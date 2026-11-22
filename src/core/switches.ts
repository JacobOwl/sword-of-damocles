// Optional rule switches from data/switches.json. Off unless a game lists them, so the default game
// plays exactly as before. A game stores its switches, so it replays exactly.
import switchesJson from "../../data/switches.json" with { type: "json" };
import type { GameState } from "./types.ts";

export interface SwitchDef { id: string; name: string; summary: string; kind: string; research?: string }
export const SWITCHES = switchesJson.switches as SwitchDef[];
export const switchById = (id: string) => SWITCHES.find((x) => x.id === id);
export const on = (s: GameState, id: string) => !!s.switches?.includes(id);
export function checkSwitches(ids: string[] | undefined): string[] {
  const out: string[] = [];
  for (const id of ids ?? []) {
    if (!switchById(id)) throw new Error(`unknown rule switch: ${id}`);
    if (!out.includes(id)) out.push(id);
  }
  // Keep a stable order, so the same set always reads the same in a save.
  return SWITCHES.map((x) => x.id).filter((id) => out.includes(id));
}
