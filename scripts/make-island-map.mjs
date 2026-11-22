// Cuts Sicily's coastline out of the Natural Earth land file saved in the Phoenician-Punic World repo
// and writes ui/art/sicily.json for the island map. Natural Earth is public domain.
//   node scripts/make-island-map.mjs ../phoenician-punic-world
// Safe to rerun: the output depends only on the input file.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2];
const src = root && join(root, "sources/natural-earth/central-med-land.json");
if (!src || !existsSync(src)) { console.log("Give the path to the phoenician-punic-world repo."); process.exit(1); }
const land = JSON.parse(readFileSync(src, "utf8"));
const box = { w: 12.2, e: 15.75, s: 36.55, n: 38.45 };
const inside = ([x, y]) => x >= box.w && x <= box.e && y >= box.s && y <= box.n;
const rings = land.rings.filter((r) => r.length >= 8 && r.every(inside)).map((r) => r.map(([x, y]) => [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]));
const out = { source: "Natural Earth 1:10m land, public domain, via sources/natural-earth/central-med-land.json in the Phoenician-Punic World repo", box, rings };
writeFileSync("ui/art/sicily.json", JSON.stringify(out) + "\n");
console.log(`Wrote ui/art/sicily.json: ${rings.length} rings, ${rings.reduce((a, r) => a + r.length, 0)} points.`);
