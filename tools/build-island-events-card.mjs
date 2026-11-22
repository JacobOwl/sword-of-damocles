// Writes docs/research/island-events.md, the research card for data/island-events.json, from the data itself.
// Safe to rerun: the output depends only on the data (no dates, no stray blank lines).
//   node tools/build-island-events-card.mjs
import { readFileSync, writeFileSync } from "node:fs";

const data = JSON.parse(readFileSync("data/island-events.json", "utf8"));
const events = data.events;
const hist = events.filter((e) => e.kind === "history");
const inv = events.filter((e) => e.kind === "invention");
const files = [...new Set(hist.flatMap((e) => e.facts.map((f) => f.file)))].sort();

const out = [];
out.push("# Events of the island, 405 to 395 BC");
out.push("");
out.push("kind: history. This card backs every `kind: history` record in `data/island-events.json`. It is written by `node tools/build-island-events-card.mjs` from the data, so edit the data, not this file. Every quote is checked against the saved texts in Jacob's Phoenician-Punic World repo (read-only) by `node scripts/verify-cast-quotes.mjs ../phoenician-punic-world`.");
out.push("");
out.push(`${events.length} events: ${hist.length} from the sources, ${inv.length} invented.`);
out.push("");
out.push("Texts used:");
for (const f of files) out.push(`- \`${f}\``);
out.push("");
out.push("## What is history and what is game");
out.push("");
out.push("History comes in as **conditions, never dates** (design council V8). An event from the sources fires when the island is in the situation the source describes: an army before a town, a plague in a crowded summer camp, an unpaid guard, a town just taken. It may fire in 404 or not at all. The source gives the situation and usually what Dionysius did, which is one choice among several and marked as his. **Everything mechanical is invention:** the trigger, who plays a part when the source names someone the game does not have (often one of the generated invented people), the other choices, and every number. Each record lists these under `invented`.");
out.push("");
out.push("Diodorus writes by archon year and composes his own speeches and motives. Where he explains why Dionysius acted (the bargain with Himilcon, 14.75.3), the game shows that as an effect on the city, not as a fact about Dionysius' mind.");
out.push("");
out.push("## The events from the sources");
for (const e of hist) {
  out.push("");
  out.push(`### ${e.name}`);
  out.push("");
  out.push(`Source: ${e.source}.`);
  out.push("");
  for (const f of e.facts) out.push(`- ${f.text} ${f.cite}: "${f.quote}" (\`${f.file}\`)`);
  if (e.invented?.length) out.push(`- Invented: ${e.invented.join("; ")}.`);
  if (e.note) out.push(`- Note: ${e.note}`);
}
out.push("");
out.push("## Invented events");
out.push("");
out.push("These have no source. Some borrow a situation the sources describe; the note says which.");
out.push("");
for (const e of inv) out.push(`- **${e.name}**${e.note ? `: ${e.note}` : ""}`);
writeFileSync("docs/research/island-events.md", out.join("\n") + "\n");
console.log(`wrote docs/research/island-events.md (${hist.length} history, ${inv.length} invention)`);
