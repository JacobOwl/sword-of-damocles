// Varied wording with no dice: the same game, season and line always get the same wording, so replays and
// every digest of the game's choices stay exact. Used where one stock sentence would otherwise repeat season
// after season (council 2026-11-25). The wordings themselves live in data/.
import type { GameState, LogEntry } from "./types.ts";
import WORDINGS from "../../data/wordings.json" with { type: "json" };

export function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
// One of the wordings, chosen by the game's seed, the season and a key naming the line.
export function vary<T>(s: GameState, key: string, xs: T[]): T {
  return xs[hash(`${s.seed}:${s.season}:${key}`) % xs.length];
}

// A line with one varied sentence after it (data/wordings.json). The log keeps the plain line as `stock`, so the
// story chronicle still counts repeats ("again", "the third time"). `n` lets a line vary by how often it was said.
export function flavored(s: GameState, key: string, lead: string, vars: Record<string, string> = {}, n = 0): { text: string; stock: string } {
  const xs = (WORDINGS as any)[key] as string[] | undefined;
  if (!xs?.length) return { text: lead, stock: lead };
  const raw = vary(s, `${key}:${n}`, xs);
  const add = raw.replace(/\{([A-Za-z]+)\}/g, (m, k: string) => {
    const v = vars[k.charAt(0).toLowerCase() + k.slice(1)];
    if (v === undefined) return m;
    return k[0] === k[0].toUpperCase() ? v.charAt(0).toUpperCase() + v.slice(1) : v;
  });
  return { text: add ? `${lead} ${add}` : lead, stock: lead };
}
export const withStock = (e: LogEntry, stock: string) => { if (stock !== e.text) e.stock = stock; return e; };
