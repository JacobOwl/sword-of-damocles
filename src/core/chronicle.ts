// The chronicle reads the season's log and writes it up in plain words. No LLM, no invented facts:
// every sentence comes from a logged action.
import { seasonName } from "./state.ts";
import { log } from "./ops.ts";
import type { GameState, LogEntry } from "./types.ts";

const SKIP = /^(Your watchers learn nothing|.* keeps his head down|.* does nothing this season)/;

export function seasonEntries(s: GameState, season: number, all = false): LogEntry[] {
  return s.log.filter((e) => e.season === season && (all || e.visible));
}

export function chronicleText(s: GameState, season: number): string {
  const es = seasonEntries(s, season).filter((e) => (e.kind === "event" || e.kind === "warning") && !SKIP.test(e.text));
  const deeds = es.filter((e) => e.kind === "event").map((e) => e.text);
  const warnings = es.filter((e) => e.kind === "warning").map((e) => e.text.replace(/^(Whispers|Rumors|Named): /, ""));
  const keep = deeds.length > 12 ? [...deeds.slice(0, 6), ...deeds.slice(-6)] : deeds;
  let text = keep.join(" ");
  if (warnings.length) text += ` ${warnings.join(" ")}`;
  return text.trim() || "A quiet season.";
}

export function writeChronicle(s: GameState) {
  const text = chronicleText(s, s.season);
  log(s, { actor: "world", text: `${seasonName(s.season)}. ${text}`, visible: true, kind: "chronicle" });
}

export function fullChronicle(s: GameState): { season: string; text: string }[] {
  return s.log.filter((e) => e.kind === "chronicle").map((e) => {
    const i = e.text.indexOf(". ");
    return { season: e.text.slice(0, i), text: e.text.slice(i + 2) };
  });
}
