// Cuts the island map's drawing layers out of the Natural Earth files saved in the Phoenician-Punic World repo
// and writes ui/art/map-art.json: the land (Sicily, the islets, and the toe of Italy clipped to the frame) and the
// four rivers Natural Earth has in Sicily. Natural Earth is public domain; it is today's coast, a drawing only.
//   node scripts/make-map-art.mjs ../phoenician-punic-world
// Safe to rerun: the output depends only on the input files.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2];
const ne = root && join(root, "sources/natural-earth");
if (!ne || !existsSync(join(ne, "central-med-land.json"))) { console.log("Give the path to the phoenician-punic-world repo."); process.exit(1); }
const sicily = JSON.parse(readFileSync("ui/art/sicily.json", "utf8"));
const box = sicily.box; // the same frame as the island map
const pad = 0.2;
const B = { w: box.w - 0.9, e: box.e + pad, s: box.s - pad, n: box.n + pad }; // room west of the frame for the sea to Carthage
const r3 = (v) => Math.round(v * 1000) / 1000;

// Sutherland-Hodgman: clip a ring to the frame, one edge at a time.
function clip(ring) {
  const edges = [
    [(p) => p[0] >= B.w, (a, b) => [B.w, a[1] + ((b[1] - a[1]) * (B.w - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= B.e, (a, b) => [B.e, a[1] + ((b[1] - a[1]) * (B.e - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= B.s, (a, b) => [a[0] + ((b[0] - a[0]) * (B.s - a[1])) / (b[1] - a[1]), B.s]],
    [(p) => p[1] <= B.n, (a, b) => [a[0] + ((b[0] - a[0]) * (B.n - a[1])) / (b[1] - a[1]), B.n]],
  ];
  let out = ring;
  for (const [inside, cross] of edges) {
    const pts = out; out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      if (inside(b)) { if (!inside(a)) out.push(cross(a, b)); out.push(b); } else if (inside(a)) out.push(cross(a, b));
    }
    if (!out.length) break;
  }
  return out;
}

const land = JSON.parse(readFileSync(join(ne, "central-med-land.json"), "utf8"));
const rings = land.rings.map(clip).filter((r) => r.length >= 4).map((r) => r.map(([x, y]) => [r3(x), r3(y)]));
const LABEL = { Platani: "Halycus", "Salso (Imera Meridionale)": "Himeras", Simeto: "Symaethus" };
const rv = JSON.parse(readFileSync(join(ne, "med-rivers.json"), "utf8")).rivers;
const inB = ([x, y]) => x >= B.w && x <= B.e && y >= B.s && y <= B.n;
const rivers = rv.filter((r) => r.lines.some((l) => l.some(inB)))
  .map((r) => ({ name: r.name, label: LABEL[r.name] ?? null, lines: r.lines.map((l) => l.filter(inB).map(([x, y]) => [r3(x), r3(y)])).filter((l) => l.length > 1) }));
const out = {
  source: "Natural Earth 1:10m land and rivers, public domain, via sources/natural-earth in the Phoenician-Punic World repo. Today's coast and rivers: a drawing, not evidence.",
  rivers_note: "Ancient names: Halycus for the Platani as on the Phoenician-Punic World maps; Himeras for the southern Salso and Symaethus for the Simeto are the usual identifications (general knowledge, not checked against a saved source). The Belice is drawn but not named.",
  frame: B, rings, rivers,
};
writeFileSync("ui/art/map-art.json", JSON.stringify(out) + "\n");
console.log(`Wrote ui/art/map-art.json: ${rings.length} land rings, ${rivers.length} rivers.`);
