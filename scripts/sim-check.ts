// Checks a finished game for impossible values. Used by the headless runner and the tests.
import { others, power, FACTIONS, OFFICES } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";

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

