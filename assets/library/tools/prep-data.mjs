// Copies the open map data the library's maps need out of the Phoenician-Punic World repo (read-only) into
// tools/data/, thinned, with each source's credit kept beside it. Run it only when that data changes; the maps
// themselves are built from tools/data/ by build-made.mjs, so a rebuild never needs the other repo.
// Safe to rerun. Usage, from the repo root:
//   node assets/library/tools/prep-data.mjs [path to phoenician-punic-world]   (default ../phoenician-punic-world)
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PPW = resolve(process.argv[2] ?? join(HERE, "../../../../phoenician-punic-world"));
const OUT = join(HERE, "data");
if (!existsSync(join(PPW, "sources/natural-earth"))) throw new Error(`no Phoenician-Punic World repo at ${PPW}`);
mkdirSync(OUT, { recursive: true });

const read = (p) => JSON.parse(readFileSync(join(PPW, p), "utf8"));
const r4 = (n) => Math.round(n * 1e4) / 1e4;
const write = (name, obj) => {
  writeFileSync(join(OUT, name), JSON.stringify(obj) + "\n");
  console.log(`tools/data/${name}`);
};

// Drop points closer than `tol` degrees to the last kept one (keeps the first and last of every line).
function thin(pts, tol) {
  if (pts.length < 3) return pts.map(([x, y]) => [r4(x), r4(y)]);
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i], [px, py] = out[out.length - 1];
    if (Math.hypot(x - px, y - py) >= tol) out.push(pts[i]);
  }
  out.push(pts[pts.length - 1]);
  return out.map(([x, y]) => [r4(x), r4(y)]);
}

// ---- Natural Earth land and rivers (public domain) ----
const NE = "Natural Earth (naturalearthdata.com), public domain, via sources/natural-earth in the Phoenician-Punic World repo. Today's coast: a drawing, not evidence.";
for (const f of ["central-med-land", "whole-med-land"]) {
  const d = read(`sources/natural-earth/${f}.json`);
  write(`${f}.json`, { source: d.source, licence: "public domain", note: NE, box: d.box, rings: d.rings });
}
{
  const d = read("sources/natural-earth/med-rivers.json");
  const box = { w: 7, e: 19.5, s: 32, n: 44 };
  const inBox = ([x, y]) => x >= box.w && x <= box.e && y >= box.s && y <= box.n;
  const rivers = d.rivers
    .map((r) => ({ name: r.name, rank: r.rank, sketch: r.sketch || undefined, lines: r.lines.map((l) => thin(l, 0.01)).filter((l) => l.some(inBox)) }))
    .filter((r) => r.lines.length);
  write("central-med-rivers.json", { licence: "public domain (Natural Earth); lines flagged sketch are the Phoenician-Punic World repo's hand sketches", note: NE, box, rivers });
}

// ---- Pleiades places (CC BY 3.0): Sicily, south Italy, and a few far cities for the overview map ----
{
  const places = new Map();
  for (const f of readdirSync(join(PPW, "data/places")).filter((f) => f.endsWith(".json"))) {
    for (const rec of read(`data/places/${f}`)) {
      for (const p of rec.places ?? []) {
        if (typeof p.lat !== "number" || !String(p.id).startsWith("pleiades:")) continue;
        const near = p.lat > 35.5 && p.lat < 41.6 && p.lon > 11.5 && p.lon < 18.5;
        const far = ["Carthage", "Utica", "Corinth", "Sparta", "Cyrene", "Tyre", "Sidon", "Massalia", "Rome", "Kerkouane", "Hadrumetum"].includes(p.name);
        if (near || far) places.set(p.id, { id: p.id, name: p.name, lat: r4(p.lat), lon: r4(p.lon), precision: p.precision ?? null });
      }
    }
  }
  write("places.json", {
    source: "Pleiades gazetteer (pleiades.stoa.org), CC BY 3.0, as saved in the Phoenician-Punic World repo's data/places/*.json. Credit: Pleiades, https://pleiades.stoa.org, CC BY 3.0.",
    licence: "CC BY 3.0",
    places: [...places.values()].sort((a, b) => a.lon - b.lon),
  });
}

// ---- Syracuse: OpenStreetMap coast and cliffs (ODbL), Pleiades topography (CC BY 3.0) ----
{
  const box = { w: 15.17, e: 15.35, s: 36.98, n: 37.14 };
  const inBox = ([x, y]) => x >= box.w && x <= box.e && y >= box.s && y <= box.n;
  const coast = read("sources/osm/syracuse-coast.json");
  const lines = coast.lines.map((l) => thin(l, 0.00035)).map((l) => l.filter(inBox)).filter((l) => l.length > 2);
  const rings = coast.rings.map((r) => thin(r, 0.00025)).filter((r) => r.length > 3 && r.some(inBox));
  const cliffEls = read("sources/osm/syracuse-cliffs.json").elements.filter((e) => e.type === "way" && e.geometry && ["cliff", "ridge", "escarpment"].includes(e.tags?.natural ?? e.tags?.man_made));
  const cliffs = cliffEls.map((e) => thin(e.geometry.map((g) => [g.lon, g.lat]), 0.0003)).filter((l) => l.length > 1 && l.some(inBox));
  const topo = [];
  for (const f of readdirSync(join(PPW, "sources/sicily-places")).filter((f) => f.endsWith(".json"))) {
    const t = readFileSync(join(PPW, "sources/sicily-places", f), "utf8");
    const d = JSON.parse(t.slice(t.indexOf("{")));
    const pt = d.reprPoint;
    if (!pt || !inBox(pt)) continue;
    topo.push({ id: `pleiades:${f.match(/-(\d+)\.json$/)[1]}`, title: d.title, lon: r4(pt[0]), lat: r4(pt[1]) });
  }
  write("syracuse.json", {
    source: "Coast and cliffs: OpenStreetMap via the Overpass API (fetched 2026-11-20 into the Phoenician-Punic World repo's sources/osm), (c) OpenStreetMap contributors, ODbL 1.0, https://www.openstreetmap.org/copyright. Ancient places: Pleiades, CC BY 3.0. Today's coast, a drawing only: the OpenStreetMap line draws Ortygia joined to the mainland, as it is now.",
    licence: "ODbL 1.0 (OpenStreetMap data); CC BY 3.0 (Pleiades points)",
    box, coast: { lines, rings }, cliffs, topo: topo.sort((a, b) => a.lon - b.lon),
  });
}
