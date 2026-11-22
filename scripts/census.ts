// The generated cast, headless. Safe to rerun: the same seed always prints the same thing.
//   npm run census -- --seed 7          a readable census at the start, then the decade's births, deaths and marriages
//   npm run census -- --seeds 100       100 decades: counts, and any broken state (exits 1 if there is one)
import { generateCensus, stepCensus, streamFrom, censusName, censusProblems, censusLeader, ageOf, CENSUS_DATA, placeName } from "../src/core/census.ts";
import type { CensusNote } from "../src/core/census.ts";
import { seasonName } from "../src/core/state.ts";
import { traitById } from "../src/core/data.ts";

const args = process.argv.slice(2);
const val = (k: string, d: number) => { const i = args.indexOf(k); return i >= 0 ? Number(args[i + 1]) : d; };
const SEASONS = 40;
const seasonLabel = seasonName;
const traitWords = (ts: string[]) => ts.map((t) => traitById(t)?.name ?? t).join(", ");

if (args.includes("--seeds")) {
  const n = val("--seeds", 100);
  const tally: Record<string, number> = {};
  let start = 0, end = 0, broken = 0, leaderless = 0, maxPeople = 0, minPeople = 1e9;
  for (let seed = 1; seed <= n; seed++) {
    const r = streamFrom(seed);
    const c = generateCensus(r);
    start += Object.values(c.people).filter((p) => p.alive).length;
    for (let s = 0; s < SEASONS; s++) {
      for (const note of stepCensus(c, r, s)) tally[note.kind] = (tally[note.kind] ?? 0) + 1;
      const bad = censusProblems(c, s);
      if (bad.length) { broken++; console.log(`seed ${seed}, ${seasonLabel(s)}: ${bad.join("; ")}`); break; }
      for (const b of CENSUS_DATA.bodies) if (b.tie.kind === "city" && !censusLeader(c, b.place, s)) leaderless++;
      const alive = Object.values(c.people).filter((p) => p.alive).length;
      maxPeople = Math.max(maxPeople, alive); minPeople = Math.min(minPeople, alive);
    }
    end += Object.values(c.people).filter((p) => p.alive).length;
  }
  const per = (k: string) => ((tally[k] ?? 0) / n).toFixed(1);
  console.log(`${n} decades of the generated cast (${SEASONS} seasons each).`);
  console.log(`People alive: ${(start / n).toFixed(1)} at the start, ${(end / n).toFixed(1)} at the end (fewest ${minPeople}, most ${maxPeople} in any season).`);
  console.log(`A decade: ${per("birth")} births, ${per("death")} deaths, ${per("marriage")} marriages, ${per("head")} new heads of houses, ${per("end")} houses died out, ${per("captain")} captains replaced, ${per("age")} came of age.`);
  console.log(`City seasons with no grown man to lead: ${leaderless} of ${n * SEASONS * CENSUS_DATA.bodies.filter((b) => b.tie.kind === "city").length}.`);
  console.log(`Broken states: ${broken}.`);
  process.exit(broken ? 1 : 0);
}

const seed = val("--seed", 1);
const r = streamFrom(seed);
const c = generateCensus(r);
console.log(`The generated cast, seed ${seed}, autumn 405 BC. Every person here is invented; the names are attested (data/names.json).\n`);
for (const b of CENSUS_DATA.bodies) {
  console.log(`${b.name[0].toUpperCase() + b.name.slice(1)}${placeName(b.place) && !b.name.includes(placeName(b.place)) ? ` (${placeName(b.place)})` : ""}`);
  for (const h of Object.values(c.houses).filter((h) => h.body === b.id)) {
    const head = c.people[h.head!];
    const fam = Object.values(c.people).filter((p) => p.house === h.id && p.id !== head.id);
    console.log(`  ${censusName(c, head.id, true)}, ${ageOf(head, 0)}, ${head.role}. ${traitWords(head.traits)}; wants ${head.ambition}.`);
    console.log(`    ${fam.map((p) => `${censusName(c, p.id)} (${ageOf(p, 0)})`).join(", ") || "no family"}`);
  }
}
console.log(`\nCaptains`);
for (const p of Object.values(c.people).filter((p) => p.side)) console.log(`  ${censusName(c, p.id, true)}, ${ageOf(p, 0)}, ${p.role} for ${p.side === "carthage" ? "Carthage" : "Syracuse"}.`);
console.log(`\nThe decade`);
for (let s = 0; s < SEASONS; s++) {
  const notes: CensusNote[] = stepCensus(c, r, s);
  for (const n of notes) console.log(`  ${seasonLabel(s)}: ${n.text} ${n.why}`);
}
