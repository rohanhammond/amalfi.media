import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const mediaBaseUrl = (process.argv[2] || "https://pub-52ef3fac16a1468e9608a9544eedb4fb.r2.dev").replace(/\/$/, "");
const mediaPath = `${mediaBaseUrl}/wp-content/uploads/`;
const textExtensions = new Set([".css", ".html", ".js", ".json", ".php", ".txt", ".xml"]);
const skipDirectories = new Set([".git", "node_modules", "wp-content/uploads"]);

function listTextFiles(directory, prefix = "") {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const relativePath = prefix ? `${prefix}/${entry}` : entry;
    const stats = statSync(path);

    if (stats.isDirectory()) {
      if (skipDirectories.has(relativePath) || skipDirectories.has(entry)) {
        return [];
      }

      return listTextFiles(path, relativePath);
    }

    return textExtensions.has(extname(entry).toLowerCase()) ? [path] : [];
  });
}

function rewrite(content) {
  return content
    .replace(/https?:\/\/amalfi\.media\/wp-content\/uploads\//g, mediaPath)
    .replace(/\/\/amalfi\.media\/wp-content\/uploads\//g, mediaPath)
    .replace(/((?:\.\.\/)+)wp-content\/uploads\//g, mediaPath)
    .replace(/\.\/wp-content\/uploads\//g, mediaPath)
    .replace(/(["'(=,\s])\/wp-content\/uploads\//g, `$1${mediaPath}`)
    .replace(/(["'(=,\s])wp-content\/uploads\//g, `$1${mediaPath}`);
}

let changed = 0;

for (const file of listTextFiles(process.cwd())) {
  const original = readFileSync(file, "utf8");
  const next = rewrite(original);

  if (next !== original) {
    writeFileSync(file, next);
    changed += 1;
  }
}

console.log(`Rewrote media URLs in ${changed} files.`);
