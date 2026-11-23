// Ready-made setups from data/presets.json: a game, a balance package and rule switches that already exist.
// A preset adds no rules. A game remembers its preset only by name, so it replays exactly from its options.
import presetsJson from "../../data/presets.json" with { type: "json" };
import type { GameOpts, Scenario } from "./types.ts";

export interface PresetDef {
  id: string; name: string; summary: string; recommended?: boolean; scenario: Scenario; tuning: string; switches: string[];
  verdictSeason: number; watch: string[];
}
export const PRESETS = presetsJson.presets as PresetDef[];
export const presetById = (id: string | undefined) => PRESETS.find((p) => p.id === id);
// The options to start or replay a preset game with.
export function presetOpts(id: string): { tuning: string } & GameOpts {
  const p = presetById(id);
  if (!p) throw new Error(`unknown preset: ${id}`);
  return { tuning: p.tuning, scenario: p.scenario, switches: [...p.switches], preset: p.id };
}
