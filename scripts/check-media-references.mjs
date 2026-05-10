import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const sourceMediaRoot =
  process.env.SOURCE_MEDIA_ROOT ||
  "/Users/rohanhammond/Documents/Coding/Websites/Amalfi Media Static Mirror/wp-content/uploads";
const mediaBaseUrl =
  (process.argv[2] || "https://pub-52ef3fac16a1468e9608a9544eedb4fb.r2.dev").replace(/\/$/, "") +
  "/wp-content/uploads/";
const textExtensions = new Set([".css", ".html", ".js", ".json", ".php", ".txt", ".xml"]);
const skipDirectories = new Set([".git", "node_modules"]);

function listTextFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return skipDirectories.has(entry.name) ? [] : listTextFiles(path);
    }

    return textExtensions.has(extname(entry.name).toLowerCase()) ? [path] : [];
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const references = new Set();
const quotedAttributePattern = new RegExp(
  `(?:src|href|content|poster|data-full-url)=["'](${escapeRegExp(mediaBaseUrl)}[^"']+)["']`,
  "g",
);
const cssUrlPattern = new RegExp(`url\\(["']?(${escapeRegExp(mediaBaseUrl)}[^"')]+)`, "g");

function addReference(url) {
  references.add(url.slice(mediaBaseUrl.length).replace(/&amp;/g, "&"));
}

for (const file of listTextFiles(process.cwd())) {
  const content = readFileSync(file, "utf8");

  for (const match of content.matchAll(quotedAttributePattern)) {
    addReference(match[1]);
  }

  for (const match of content.matchAll(cssUrlPattern)) {
    addReference(match[1]);
  }
}

const missing = [...references]
  .map((reference) => {
    try {
      return decodeURIComponent(reference);
    } catch {
      return reference;
    }
  })
  .filter((reference) => !existsSync(join(sourceMediaRoot, reference)))
  .sort();

console.log(`Referenced media objects: ${references.size}`);
console.log(`Missing from source upload set: ${missing.length}`);

for (const reference of missing) {
  console.log(reference);
}

process.exit(missing.length > 0 ? 1 : 0);
