// Saving: the seed and your inputs, replayed on load. Only the inputs are stored; the game is rebuilt by replay.
// A preset game also keeps your season-10 verdict (ui/views/verdict.ts), so "Copy my game" can carry it.
import type { Input } from "../../src/core/index.ts";
import { logDigest } from "../../src/core/index.ts";
import { ui } from "../lib/text.ts";
import type { Verdict } from "../lib/text.ts";

const SAVE_KEY = "sword-of-damocles-save-v1";
export interface Saved { seed: number; tuning?: string; scenario?: "citadel" | "island"; switches?: string[]; preset?: string; inputs: Input[]; designer?: boolean; verdict?: Verdict; checkIns?: Verdict[] }

function current(): Saved | null {
  const s = ui.s;
  if (!s) return null;
  return { seed: s.seed, tuning: s.tuning, scenario: s.scenario ?? "citadel", switches: s.switches ?? [], ...(s.preset ? { preset: s.preset } : {}), inputs: s.inputs, designer: ui.designer, ...(ui.verdict ? { verdict: ui.verdict } : {}), ...(ui.checkIns.length ? { checkIns: ui.checkIns } : {}) };
}
export function save() {
  const v = current();
  if (!v) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(v)); } catch { /* storage may be blocked */ }
}
export function load(): Saved | null {
  try { const v = localStorage.getItem(SAVE_KEY); return v ? JSON.parse(v) : null; } catch { return null; }
}
export function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ } }

// "Copy my game": everything a thread needs to replay exactly what you saw (npm run replay-save -- <file>).
export function gameText(build: string): string {
  const v = current();
  const s = ui.s;
  if (!v || !s) return "";
  return JSON.stringify({ game: "The Sword of Damocles", build, ...v, designer: undefined, reached: s.over ? s.over.season : s.season, digest: logDigest(s) });
}
