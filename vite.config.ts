// The browser game's build (docs/architecture.md). `npm run dev` serves ui/ with live reload;
// `npm run build` writes one self-contained page, ui/dist/index.html, with all code, styles and portraits inside it.
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { readdirSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

// The commit the page was built from, carried by "Copy my game" so a thread can check out the same rules.
const BUILD = (() => { try { return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch { return "dev"; } })();

// Placeholder portraits (invention, made in tools/mosaic-editor.html): ui/art/portraits/<person id>.webp,
// inlined as data URLs into window.__PORTRAITS before the game's code runs (read by ui/components/portraits.ts).
function portraits(): Plugin {
  return {
    name: "sword-portraits",
    transformIndexHtml() {
      const dir = "ui/art/portraits";
      const art: Record<string, string> = {};
      for (const f of readdirSync(dir).filter((f) => f.endsWith(".webp")).sort()) {
        art[f.replace(/\.webp$/, "")] = `data:image/webp;base64,${readFileSync(`${dir}/${f}`).toString("base64")}`;
      }
      // A Workshop build (SWORD_WORKSHOP=greatWorks,...) shows those switches on the start screen, ticked.
      const workshop = (process.env.SWORD_WORKSHOP ?? "").split(",").filter(Boolean);
      return [{ tag: "script", children: `window.__PORTRAITS=${JSON.stringify(art)};${workshop.length ? `window.__WORKSHOP=${JSON.stringify(workshop)};` : ""}`, injectTo: "body-prepend" }];
    },
  };
}

export default defineConfig({
  root: "ui",
  base: "./",
  publicDir: false,
  define: { __BUILD__: JSON.stringify(BUILD) },
  plugins: [portraits(), viteSingleFile({ removeViteModuleLoader: true })],
  build: { outDir: "dist", emptyOutDir: true, reportCompressedSize: false },
  server: { fs: { allow: [".."] } }, // the game reads data/ and src/ from outside ui/
  logLevel: "warn",
});
