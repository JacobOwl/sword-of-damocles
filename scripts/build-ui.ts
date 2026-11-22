// Builds the browser game into one self-contained page: ui/dist/index.html.
// Safe to rerun: the output depends only on the source files.
// With --fragment <path> it also writes the page without the <html>/<head>/<body> skeleton (for publishing as an Artifact).
import { build } from "esbuild";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const js = await build({ entryPoints: ["ui/main.ts"], bundle: true, format: "iife", target: "es2020", minify: true, write: false, legalComments: "none" });
const code = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = readFileSync("ui/style.css", "utf8");
const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IM+Fell+DW+Pica:ital@0;1&family=IM+Fell+English+SC&family=Cormorant+Garamond:wght@600;700&display=swap">`;
const head = `<title>The Sword of Damocles</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n${fonts}\n<style>\n${css}\n</style>`;
const bodyHtml = `<main id="app"></main>\n<script>\n${code}\n</script>\n`;
const page = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n${bodyHtml}</body>\n</html>\n`;
mkdirSync("ui/dist", { recursive: true });
writeFileSync("ui/dist/index.html", page);
const i = process.argv.indexOf("--fragment");
if (i > 0) writeFileSync(process.argv[i + 1], `${head}\n${bodyHtml}`);
console.log(`Built ui/dist/index.html (${Math.round(page.length / 1024)} KB).`);
