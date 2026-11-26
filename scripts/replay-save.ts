// Replays a game copied with "Copy my game" exactly as the player saw it, and prints what happened.
//   npm run replay-save -- <file.json>               the setup, the verdict, a digest check, then the chronicle
//   npm run replay-save -- <file.json> --log         every visible log line instead of the chronicle
//   npm run replay-save -- <file.json> --all         every log line, hidden moves and rolls included
// The file holds the one line the game copied. If the digest does not match, the rules changed since the build
// it was played on ("build" in the file is the commit): check that commit out and run this again.
import { readFileSync } from "node:fs";
import { replay, logDigest, seasonName, presetById, packageName, switchById, fullChronicle } from "../src/core/index.ts";

const file = process.argv[2];
if (!file) { console.error("Usage: npm run replay-save -- <file.json> [--log | --all]"); process.exit(2); }
const raw = readFileSync(file, "utf8").trim();
const v = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
const s = replay(v.seed, v.inputs, v.tuning, { scenario: v.scenario, switches: v.switches ?? [], ...(v.preset ? { preset: v.preset } : {}) });
const digest = logDigest(s);
const p = presetById(v.preset);
console.log(`Seed ${v.seed}, ${p ? `${p.name}, ` : ""}${packageName(v.tuning)} balance, ${v.scenario === "island" ? "the island" : "the citadel"}${v.switches?.length ? `; switches: ${v.switches.map((x: string) => switchById(x)?.name ?? x).join(", ")}` : ""}.`);
console.log(`Built from commit ${v.build ?? "unknown"}. ${v.inputs.length} moves; reached ${seasonName(s.over ? s.over.season : s.season)}${s.over ? ` (${s.over.reason})` : ""}.`);
if (v.digest) console.log(v.digest === digest ? `Digest ${digest} matches: this is exactly the game that was played.` : `DIGEST MISMATCH: the file says ${v.digest}, this replay gives ${digest}. The rules changed since commit ${v.build}; check it out and replay there.`);
for (const x of v.checkIns ?? []) {
  console.log(`\nCheck-in at season ${x.season}${x.skipped ? ": skipped." : ":"}`);
  if (!x.skipped) for (const [k, label] of [["retell", "Would retell"], ["confused", "Confused by"], ["level", "Difficulty"]]) if (x[k]) console.log(`  ${label}: ${x[k]}`);
}
if (v.verdict) {
  const x = v.verdict;
  console.log(`\nVerdict at season ${x.season}${x.skipped ? ": skipped." : ":"}`);
  if (!x.skipped) for (const [k, label] of [["retell", "Would retell"], ["confused", "Confused by"], ["unfair", "Felt unfair"], ["level", "Difficulty"], ["other", "Other"]]) if (x[k]) console.log(`  ${label}: ${x[k]}`);
}
console.log("");
if (process.argv.includes("--log") || process.argv.includes("--all")) {
  const all = process.argv.includes("--all");
  let season = -1;
  for (const e of s.log) {
    if (!all && !e.visible) continue;
    if (e.season !== season) { season = e.season; console.log(`\n== ${seasonName(season)} ==`); }
    console.log(`${e.visible ? "" : "(hidden) "}[${e.step}/${e.kind}] ${e.text}${e.why ? ` (${e.why})` : ""}${e.roll ? ` [d6 ${e.roll.die}, total ${e.roll.total} vs ${e.roll.need}]` : ""}`);
  }
} else for (const c of fullChronicle(s)) console.log(`${c.season}\n${c.text}\n`);
if (v.digest && v.digest !== digest) process.exitCode = 1;
