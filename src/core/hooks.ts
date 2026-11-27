// Hooks between modules that would otherwise import each other in a circle. A leaf module: it imports nothing at
// run time, so a module can fill a hook while it loads, and island.ts reads it only while a game runs.
import type { Army, GameState } from "./types.ts";
export const HOOKS: {
  scene?: (s: GameState, a: Army, b: Army) => boolean;
  report?: (s: GameState, a: Army, b: Army, r: any, out: any) => void;
  muster?: (s: GameState, a: Army, m: { citizens: number; allies: string[]; guard: number }) => void;
  far?: (s: GameState) => void;
  [k: string]: any;
} = {};
