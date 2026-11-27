// A late opening for a test preset (data/presets.json "opening"): the game starts at a later season with the
// island already changed, so a test can begin near a war instead of playing ten years to reach one. It is applied
// once in newGame, before any dice, so a game replays exactly from its preset name. All of it is plain state:
// no rules are added, and a game without an opening is untouched.
import type { GameState, Side } from "./types.ts";

export interface Opening {
  season: number;
  citadel?: boolean; walls?: boolean;
  silver?: number; grain?: number; clock?: number; guard?: number;
  cities?: Record<string, { side?: Side; lean?: number; fear?: number }>;
  carthage?: { plagueUntil?: number; silver?: number; mercs?: number; levy?: number; ships?: number };
  text: string; // the first line of the story, what is true when you take up the game
  why: string;
  kind?: string; source?: string; card?: string; // the label and sources of the opening's facts
}

export function applyOpening(s: GameState, o: Opening, player: string) {
  s.season = o.season;
  s.startSeason = o.season;
  if (o.citadel) { s.citadelBuilt = true; s.offices.citadel = player; }
  if (o.walls) s.walls = true;
  if (o.silver !== undefined) s.silver = o.silver;
  if (o.grain !== undefined) s.grain = o.grain;
  if (o.clock !== undefined) s.clock = o.clock;
  if (o.guard !== undefined) s.guard.strength = o.guard;
  // People due in the story by now are simply there, without an "enters the story" line each.
  for (const p of Object.values(s.people)) if (p.status === "absent" && p.enters <= o.season) p.status = (p as any).startStatus ?? "free";
  if (s.island) {
    for (const [id, c] of Object.entries(o.cities ?? {})) {
      const st = s.island.cities[id];
      if (!st) throw new Error(`opening: unknown town ${id}`);
      if (c.side) { st.side = c.side; st.since = o.season; }
      if (c.lean !== undefined) st.lean = c.lean;
      if (c.fear !== undefined) st.fear = c.fear;
    }
    const k = s.island.carthage;
    Object.assign(k, o.carthage ?? {});
  }
}
