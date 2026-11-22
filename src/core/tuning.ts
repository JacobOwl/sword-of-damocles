// Balance packages from data/tuning.json. A game stores the id of its package, so it replays exactly.
// "standard" is rules v2 as built; the others change only the numbers they list.
import tuningJson from "../../data/tuning.json" with { type: "json" };
import type { GameState } from "./types.ts";

export type Knobs = typeof tuningJson.standard;
export interface TuningPackage { id: string; name: string; summary: string; knobs: Partial<Knobs> }

export const PACKAGES = tuningJson.packages as unknown as TuningPackage[];
export const DEFAULT_TUNING: string = tuningJson.default;

const cache = new Map<string, Knobs>();
export function knobsFor(id: string | undefined): Knobs {
  const key = id ?? DEFAULT_TUNING;
  let k = cache.get(key);
  if (!k) {
    const pkg = PACKAGES.find((p) => p.id === key);
    if (!pkg) throw new Error(`unknown balance package: ${key}`);
    k = { ...tuningJson.standard, ...pkg.knobs } as Knobs;
    cache.set(key, k);
  }
  return k;
}
export const T = (s: GameState): Knobs => knobsFor(s.tuning);
export const packageName = (id: string | undefined) => PACKAGES.find((p) => p.id === (id ?? DEFAULT_TUNING))?.name ?? "Standard";
