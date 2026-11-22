// Checks a finished game for impossible values. Used by the headless runner and the tests.
import { others, power, FACTIONS, OFFICES } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";
import { censusProblems } from "../src/core/census.ts";

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
  if (s.island) {
    for (const c of Object.values(s.island.cities)) { num(c.grain, 0, 10, `${c.id} grain`); num(c.men, 0, 10, `${c.id} men`); num(c.lean, -3, 3, `${c.id} lean`); num(c.fear, 0, 3, `${c.id} fear`); }
    const sides = new Set(["syracuse", "ally", "free", "tributary", "carthage", "exiles"]);
    for (const c of Object.values(s.island.cities)) if (!sides.has(c.side)) bad.push(`${c.id} has side ${c.side}`);
    for (const a of s.island.armies) {
      if (!s.island.cities[a.at]) bad.push(`army ${a.id} is nowhere (${a.at})`);
      num(a.men, 1, 99, `army ${a.id} men`); num(a.food, 0, 3, `army ${a.id} food`); num(a.guard, 0, a.men, `army ${a.id} guard`);
    }
    if (s.island.armies.filter((a) => a.side === "syracuse").length > 1) bad.push("two armies of yours");
    if (s.island.armies.filter((a) => a.side === "carthage").length > 1) bad.push("two Carthaginian armies");
    const c = s.island.carthage;
    num(c.silver, 0, 999, "Carthage silver"); num(c.mercs, 0, 99, "Carthage mercs"); num(c.levy, 0, 99, "Carthage levy");
    for (const b of Object.values(c.blocs)) { num(b.power, 0, 10, `${b.id} power`); num(b.mood, 0, 4, `${b.id} mood`); }
    if (s.census) bad.push(...censusProblems(s.census, s.over?.season ?? s.season).map((x) => `census: ${x}`));
    if (s.island.cities.syracuse.side !== "syracuse" && s.over?.reason !== "fallen") bad.push("Syracuse changed hands but the game went on");
  }
  return bad;
}

