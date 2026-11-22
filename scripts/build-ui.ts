// Builds the browser game into one self-contained page, ui/dist/index.html, with Vite (vite.config.ts).
// Safe to rerun: the output depends only on the source files.
// With --fragment <path> it also writes the page without the <html>/<head>/<body> skeleton (for publishing as an Artifact).
import { build } from "vite";
import { readFileSync, writeFileSync } from "node:fs";

await build({ configFile: "vite.config.ts" });
const page = readFileSync("ui/dist/index.html", "utf8");
const i = process.argv.indexOf("--fragment");
if (i > 0) {
  const head = page.match(/<head>([\s\S]*)<\/head>/)![1].replace(/<meta charset[^>]*>\s*/, "").replace(/<meta name="viewport"[^>]*>\s*/, "").trim();
  const body = page.match(/<body>([\s\S]*)<\/body>/)![1].trim();
  writeFileSync(process.argv[i + 1], `${head}\n${body}\n`);
}
console.log(`Built ui/dist/index.html (${Math.round(page.length / 1024)} KB).`);
