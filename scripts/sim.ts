// Headless check: play N seeds with the simple bot, look for crashes and broken state, print the counts.
// Usage: npm run sim -- --seeds 100
import { runBotGame, others, power, FACTIONS, OFFICES } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";

const arg = (k: string, d: number) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const N = arg("--seeds", 100);
const first = arg("--from", 1);

export function brokenState(s: GameState): string[] {
  const bad: string[] = [];
  const num = (v: number, lo: number, hi: number, what: string) => { if (!Number.isFinite(v) || v < lo || v > hi) bad.push(`${what} = ${v}`); };
  num(s.silver, 0, 999, "silver"); num(s.grain, 0, 999, "grain"); num(s.clock, 0, 10, "clock"); num(s.land, 0, 99, "land");
  for (const f of FACTIONS) { num(power(s, f), 0, 10, `${f} power`); num(s.factions[f].mood, 0, 4, `${f} mood`); }
  for (const p of others(s)) num(p.opinion, -3, 3, `${p.id} opinion`);
  for (const o of OFFICES) { const h = s.offices[o]; if (h && (!s.people[h] || s.people[h].status === "dead")) bad.push(`${o} held by the dead or missing ${h}`); }
  for (const pl of s.plots) for (const m of pl.members) if (!s.people[m] || ["dead", "held"].includes(s.people[m].status)) bad.push(`plot member ${m} is ${s.people[m]?.status}`);
  const nem = others(s).filter((p) => p.rival && p.rival.rank >= 4 && p.status !== "dead").length;
  if (nem > 1) bad.push(`${nem} Nemeses at once`);
  return bad;
}

const sum: Record<string, number> = {};
const ends: Record<string, number> = {};
let crashes = 0, broken = 0, totalSeasons = 0, neverTyrant = 0, tyrantEverySeason = 0;
for (let seed = first; seed < first + N; seed++) {
  try {
    const s = runBotGame(seed);
    const b = brokenState(s);
    if (b.length) { broken++; console.log(`seed ${seed}: broken state: ${b.join("; ")}`); }
    for (const [k, v] of Object.entries(s.counters)) sum[k] = (sum[k] ?? 0) + v;
    const end = s.over?.reason ?? "unfinished";
    ends[end] = (ends[end] ?? 0) + 1;
    const played = (s.over?.season ?? s.season) + 1;
    totalSeasons += played;
    if (!s.counters.tyrannies) neverTyrant++;
    if ((s.counters.tyrantSeasons ?? 0) >= played - 1) tyrantEverySeason++;
  } catch (e) {
    crashes++;
    console.log(`seed ${seed}: CRASH ${(e as Error).stack}`);
  }
}
const per = (k: string) => `${sum[k] ?? 0} (${((sum[k] ?? 0) / N).toFixed(2)} a game)`;
console.log(`\n${N} seeds (${first} to ${first + N - 1}), played by the simple bot.`);
console.log(`Crashes: ${crashes}. Broken states: ${broken}.`);
console.log(`Average length: ${(totalSeasons / N).toFixed(1)} seasons of 40.`);
console.log(`How games ended: ${Object.entries(ends).map(([k, v]) => `${k} ${v}`).join(", ")}.`);
console.log(`Tyrannies set up: ${per("tyrannies")}. Games with no tyranny: ${neverTyrant}. Games where you were tyrant almost every season: ${tyrantEverySeason}.`);
console.log(`Plots: ${per("plots")}. Strikes: ${per("strikes")}. Blows that landed: ${per("blows")}. Failed plots: ${per("plotsFailed")}.`);
console.log(`Deaths by execution: ${per("executions")}.`);
console.log(`Enemies made: ${per("rivals")}. Nemeses: ${per("nemeses")}. Political rivals: ${per("politicalRivals")}. Pretenders: ${per("pretenders")}. Deposed by a rival: ${per("politicalFalls")}.`);
console.log(`Factions falling Marginal: ${per("marginal")}. Becoming Dominant: ${per("dominant")}. Carthaginian sieges: ${per("sieges")}.`);
if (crashes || broken) process.exitCode = 1;
