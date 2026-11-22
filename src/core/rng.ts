// One seeded random stream for the whole game (mulberry32). Its state lives in the game state,
// so a saved game replays exactly.
import type { GameState } from "./types.ts";

export function nextRandom(s: GameState): number {
  let t = (s.rng = (s.rng + 0x6d2b79f5) | 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function d6(s: GameState): number {
  return 1 + Math.floor(nextRandom(s) * 6);
}

export function pick<T>(s: GameState, list: T[]): T {
  return list[Math.floor(nextRandom(s) * list.length)];
}
