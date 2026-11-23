// Builds the browser game into one self-contained page, ui/dist/index.html, with Vite (vite.config.ts).
// Safe to rerun: the output depends only on the source files.
// With --fragment <path> it also writes the page without the <html>/<head>/<body> skeleton (for publishing as an Artifact).
// With --page <name> it builds a Workshop page instead, ui/<name>.html, to ui/dist-<name>/index.html (for example
// --page past, the "Change the past" page). The test page, ui/index.html, is built only without --page.
import { build } from "vite";
import { readFileSync, writeFileSync } from "node:fs";

const p = process.argv.indexOf("--page");
const name = p > 0 ? process.argv[p + 1] : "";
if (name && !/^[a-z-]+$/.test(name)) throw new Error(`a page name is lower-case letters: ${name}`);
const outDir = name ? `dist-${name}` : "dist";
await build({ configFile: "vite.config.ts", ...(name ? { build: { outDir, emptyOutDir: true, reportCompressedSize: false, rollupOptions: { input: `ui/${name}.html` } } } : {}) });
// Vite names a page after its source; the one page in a Workshop folder is renamed index.html.
if (name) { const { renameSync, existsSync } = await import("node:fs"); if (existsSync(`ui/${outDir}/${name}.html`)) renameSync(`ui/${outDir}/${name}.html`, `ui/${outDir}/index.html`); }
const page = readFileSync(`ui/${outDir}/index.html`, "utf8");
const i = process.argv.indexOf("--fragment");
if (i > 0) {
  const head = page.match(/<head>([\s\S]*)<\/head>/)![1].replace(/<meta charset[^>]*>\s*/, "").replace(/<meta name="viewport"[^>]*>\s*/, "").trim();
  const body = page.match(/<body>([\s\S]*)<\/body>/)![1].trim();
  writeFileSync(process.argv[i + 1], `${head}\n${body}\n`);
}
console.log(`Built ui/${outDir}/index.html (${Math.round(page.length / 1024)} KB).`);
