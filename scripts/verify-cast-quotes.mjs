// Checks that every quoted passage in the cast and event data really appears in the saved source text.
// The texts live in Jacob's Phoenician-Punic World repo (read-only), so pass its path:
//   node scripts/verify-cast-quotes.mjs ../phoenician-punic-world
// Each fact names its file; a quote with "..." is checked piece by piece. Exits 1 on any miss.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2];
if (!root || !existsSync(join(root, "sources"))) {
  console.log("Skipped: give the path to the phoenician-punic-world repo.");
  process.exit(0);
}
const norm = (s) => s.replace(/[’‘]/g, "'").replace(/[­]/g, "").replace(/‑/g, "-").replace(/\s+/g, " ").toLowerCase();
const cache = new Map();
const text = (f) => {
  if (!cache.has(f)) cache.set(f, norm(readFileSync(join(root, f), "utf8")));
  return cache.get(f);
};
const facts = [];
const walk = (o, where) => {
  if (Array.isArray(o)) o.forEach((v) => walk(v, where));
  else if (o && typeof o === "object") {
    if (typeof o.quote === "string" && o.file) facts.push({ ...o, where });
    for (const [k, v] of Object.entries(o)) walk(v, o.id ?? where);
  }
};
for (const f of ["data/people.json", "data/factions.json", "data/outside.json", "data/events.json"]) walk(JSON.parse(readFileSync(f, "utf8")), f);
let bad = 0;
for (const f of facts) {
  const hay = text(f.file);
  const parts = f.quote.split("...").map((p) => p.trim()).filter(Boolean);
  if (!parts.every((p) => hay.includes(norm(p)))) {
    bad++;
    console.log(`NOT FOUND (${f.where}, ${f.cite}, ${f.file}): ${f.quote}`);
  }
}
console.log(`${facts.length} quotes checked, ${bad} not found.`);
process.exit(bad ? 1 : 0);
