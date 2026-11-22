// A scripted walk through the built game page: the same seed and the same clicks every time,
// recording the page after each step. Used to check that a restructure changes nothing on screen:
//   node scripts/ui-walk.mjs ui/dist/index.html before.json   (then again after, and compare the files)
// Needs Playwright with Chromium (present in the cloud machines). Safe to rerun.
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const { chromium } = createRequire(import.meta.url)("playwright"); // installed globally in the cloud machines
const [page = "ui/dist/index.html", out = "ui-walk.json"] = process.argv.slice(2);
const browser = await chromium.launch();
const snaps = [];
const errors = [];
for (const [scenario, width] of [["island", 1280], ["citadel", 1280], ["island", 390]]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(`${scenario} ${width}px: ${e.message}`));
  await p.goto("file://" + resolve(page));
  // Portraits of the generated cast are painted after render while idle; strip their pixels from the record.
  const snap = async (label) => {
    await p.waitForTimeout(50);
    const html = await p.evaluate(() => {
      const strip = (h) => h.replace(/id="seed" type="number" value="\d+"/, 'id="seed"').replace(/src="data:[^"]*"/g, 'src="data:"').replace(/style="background-image:[^"]*"/g, "")
        // generated faces are painted while the page is idle, so whether one is done yet is timing, not behaviour
        .replace(/<span class="portrait [^"]*"( style="[^"]*")? role="img" (aria-label="[^"]*")[^>]*>(<img[^>]*>|<span class="mono-initial">[^<]*<\/span>)<\/span>/g, "<face $2>");
      const d = document.querySelector("dialog[open]");
      return strip(document.getElementById("app").innerHTML) + (d ? "\n<!--dialog-->\n" + strip(d.innerHTML) : "");
    });
    snaps.push({ scenario, width, label, html });
  };
  const click = async (sel) => { const el = p.locator(`${sel} >> visible=true`).first(); if (await el.count()) { await el.click(); return true; } return false; };
  await snap("title");
  await p.evaluate(() => { document.getElementById("seed").value = "4242"; }); // the seed box is folded away
  await p.selectOption("#scenario", scenario);
  await click("#new");
  await p.keyboard.press("Escape");
  await snap("start");
  for (const v of ["island", "court", "families", "chronicle", "help", "play"]) if (await click(`nav.views [data-view="${v}"]`)) await snap(`view ${v}`);
  for (const t of ["city", "dangers", "season"]) if (await click(`[data-tab="${t}"]`)) await snap(`tab ${t}`);
  if (await click("[data-person]")) { await snap("sheet"); await p.keyboard.press("Escape"); }
  for (let season = 0; season < 4; season++) {
    if (await click("[data-choose]:not([disabled])")) await snap(`season ${season} answered`);
    if (await click("button.act:not(.off)")) {
      await snap(`season ${season} action open`);
      const sel = p.locator('select[data-arg="target"]').first();
      if (await sel.count()) { const opts = await sel.locator("option").all(); if (opts.length > 1) { await sel.selectOption({ index: 1 }); await snap(`season ${season} target`); } }
      if (await click("#do:not([disabled])")) await snap(`season ${season} acted`);
      else await click("#cancel");
    }
    if (!(await click("#end"))) break;
    await p.keyboard.press("Escape");
    await snap(`season ${season} ended`);
  }
  await ctx.close();
}
await browser.close();
writeFileSync(out, JSON.stringify({ errors, snaps }, null, 1) + "\n");
console.log(`${snaps.length} snapshots, ${errors.length} page errors -> ${out}`);
if (errors.length) console.log(errors.join("\n"));
