import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { spawnSync } from "node:child_process";

const bucket = process.argv[2] || "amalfi-media";
const mediaRoot = join(process.cwd(), "wp-content", "uploads");
const cacheControl = "public, max-age=31536000, immutable";

const contentTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
  [".svg", "image/svg+xml"],
  [".mp4", "video/mp4"],
]);

function listFiles(directory) {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      const stats = statSync(path);

      return stats.isDirectory() ? listFiles(path) : [path];
    })
    .sort();
}

function getContentType(path) {
  const extension = path.slice(path.lastIndexOf(".")).toLowerCase();
  return contentTypes.get(extension) || "application/octet-stream";
}

const files = listFiles(mediaRoot);

console.log(`Uploading ${files.length} media files to R2 bucket "${bucket}"...`);

for (const file of files) {
  const key = ["wp-content", "uploads", relative(mediaRoot, file).split(sep).join("/")].join("/");
  const destination = `${bucket}/${key}`;
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "wrangler",
      "r2",
      "object",
      "put",
      destination,
      "--remote",
      "--file",
      file,
      "--content-type",
      getContentType(file),
      "--cache-control",
      cacheControl,
    ],
    { stdio: "inherit" },
  );

  if (result.status !== 0) {
    console.error(`Upload failed for ${key}`);
    process.exit(result.status || 1);
  }
}

console.log("R2 media upload complete.");
