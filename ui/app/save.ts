// Saving: the seed and your inputs, replayed on load. Only the inputs are stored; the game is rebuilt by replay.
import type { Input } from "../../src/core/index.ts";
import { ui } from "../lib/text.ts";

const SAVE_KEY = "sword-of-damocles-save-v1";

export function save() {
  const s = ui.s;
  if (!s) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ seed: s.seed, tuning: s.tuning, scenario: s.scenario ?? "citadel", switches: s.switches ?? [], inputs: s.inputs, designer: ui.designer })); } catch { /* storage may be blocked */ }
}
export function load(): { seed: number; tuning?: string; scenario?: "citadel" | "island"; switches?: string[]; inputs: Input[]; designer?: boolean } | null {
  try { const v = localStorage.getItem(SAVE_KEY); return v ? JSON.parse(v) : null; } catch { return null; }
}
export function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ } }
