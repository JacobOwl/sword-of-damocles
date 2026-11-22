// Rewrites the name list in docs/research/names.md from data/names.json (between the two marker lines).
// Safe to rerun: the same data gives the same file.
import { readFileSync, writeFileSync } from "node:fs";
const card = "docs/research/names.md";
const d = JSON.parse(readFileSync("data/names.json", "utf8"));
const start = "<!-- names: built by tools/build-names-card.mjs -->", end = "<!-- end of names -->";
const lines = [];
for (const [g, def] of Object.entries(d.groups)) {
  const ns = d.names.filter((n) => n.group === g);
  if (!ns.length) continue;
  lines.push(`### ${def.name} (${ns.filter((n) => n.sex === "m").length} men's names, ${ns.filter((n) => n.sex === "f").length} women's)`, "", def.detail, "");
  for (const n of ns) lines.push(`- **${n.name}** (${n.sex === "m" ? "man" : "woman"}): ${n.who}. ${n.facts[0].cite}: "${n.facts[0].quote}" (\`${n.facts[0].file}\`)${n.note ? ` *${n.note}*` : ""}`);
  lines.push("");
}
const text = readFileSync(card, "utf8");
const a = text.indexOf(start), b = text.indexOf(end);
if (a < 0 || b < 0) throw new Error("markers missing in " + card);
writeFileSync(card, text.slice(0, a + start.length) + "\n\n" + lines.join("\n") + "\n" + text.slice(b));
console.log(`${d.names.length} names written to ${card}`);
