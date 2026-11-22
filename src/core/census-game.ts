// The generated cast inside a game (island scenario only). The census itself is src/core/census.ts; this file only
// creates it from the game's one random stream and writes what happens each season to the one log, with its reason.
import { generateCensus, stepCensus, censusLeader, censusCouncil, censusCaptain, censusAt, censusName, censusFamily, lookOf } from "./census.ts";
import type { Census, CensusNote } from "./census.ts";
import { nextRandom } from "./rng.ts";
import { log } from "./ops.ts";
import type { GameState } from "./types.ts";

export function newCensus(s: GameState): Census {
  return generateCensus(() => nextRandom(s), s.season);
}

// Which notes the player sees in the season feed: what changes who leads (the death of a head of a house or a captain,
// the heir, a house ending, a new captain). Births, marriages, comings of age and other deaths are logged as well, but
// shown only in the designer view, so the feed doesn't fill with them.
function shown(n: CensusNote, all: CensusNote[]): boolean {
  if (n.kind === "head" || n.kind === "end" || n.kind === "captain") return true;
  if (n.kind === "death") return all.some((m) => m !== n && (m.kind === "head" || m.kind === "end" || m.kind === "captain") && m.who.includes(n.who[0]));
  return false;
}

// The world step, island games only: a season of births, deaths, marriages and heirs.
export function censusSeason(s: GameState) {
  if (!s.census) return;
  const notes = stepCensus(s.census, () => nextRandom(s), s.season);
  for (const n of notes) log(s, { actor: "world", text: n.text, why: n.why, visible: shown(n, notes), kind: "event" });
}

// Read-only questions for the other systems and the screens.
export const leaderOfCity = (s: GameState, cityId: string) => (s.census ? censusLeader(s.census, cityId, s.season) : undefined);
export const councilOf = (s: GameState, tieId: string) => (s.census ? censusCouncil(s.census, tieId) : []);
export const captainOf = (s: GameState, side: "syracuse" | "carthage", n = 0) => (s.census ? censusCaptain(s.census, side, n) : undefined);
export const peopleAt = (s: GameState, place: string) => (s.census ? censusAt(s.census, place) : []);
export const censusPersonName = (s: GameState, id: string, long = false) => (s.census ? censusName(s.census, id, long) : "someone");
export const censusKin = (s: GameState, id: string) => (s.census ? censusFamily(s.census, id) : []);
export const censusLook = (s: GameState, id: string) => (s.census ? lookOf(s.census, id, s.season) : undefined);
