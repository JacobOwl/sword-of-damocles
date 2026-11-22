// Switch "feud": one feud record per person with you (design council, verdict V6).
// A record is a list of dated chapters and is never deleted. A settlement (a pardon, a gift, an office,
// a marriage, warming to you) pauses the rivalry and keeps its rank for when it comes due again.
// A grievance already in the record can't start a new rivalry. Rank comes from surviving you:
// escaping your guards, living through a failed blow, coming home from exile. Twice makes a Nemesis.
// Executing a man closes his record and opens one with his nearest kin, said plainly.
import { capital, seasonName } from "./state.ts";
import { event, rankChange } from "./ops.ts";
import type { Chapter, Feud, GameState, Person } from "./types.ts";
import { on } from "./switches.ts";


// Titles from the decisive chapter (invention): "Hipparinus the Returned".
const SCAR_TITLE: Record<string, string> = { Humiliated: "the Slighted", Exiled: "the Exile", Hunted: "the Hunted", Bereaved: "the Bereaved", Survivor: "the Survivor" };

export const feudOn = (s: GameState) => on(s, "feud");
const rec = (p: Person): Feud => (p.feud ??= { chapters: [], counted: [], survived: 0 });
export const feudOf = (p: Person): Feud | undefined => p.feud;
// "you refused him the generalship, Spring 404 BC" and "you refused him the generalship" are one grievance.
const key = (what: string) => what.replace(/, (Autumn|Winter|Spring|Summer) [^,]*$/, "").replace(/, \d+(\/\d+)?$/, "").trim().toLowerCase();

export function chapter(s: GameState, p: Person, kind: string, text: string) {
  if (!feudOn(s) || p.player) return;
  rec(p).chapters.push({ season: s.season, kind, text });
}

// Called by makeRival before a new rivalry starts. Returns the rank to start at, or 0 when the grievance
// is already in the record and starts nothing new.
export function feudStart(s: GameState, p: Person, scar: string, what: string): number {
  const f = rec(p);
  const k = key(what);
  if (f.counted.includes(k) && scar !== "Bereaved") {
    chapter(s, p, "old", `${what}: already in the record, it starts nothing new`);
    return 0;
  }
  f.counted.push(k);
  const rank = f.pausedRank ?? 1;
  chapter(s, p, f.pausedRank ? "due" : "rivalry", f.pausedRank ? `the old feud comes due: ${what}` : `the feud begins: ${what}`);
  if (!f.title && SCAR_TITLE[scar]) f.title = SCAR_TITLE[scar];
  f.pausedRank = undefined;
  return rank;
}

// Called by endRival: a settlement pauses the rivalry, never erases it.
export function feudPause(s: GameState, p: Person, rank: number, why: string) {
  const f = rec(p);
  f.pausedRank = Math.min(3, rank);
  chapter(s, p, "settled", `the feud is paused (${why}); it stands at rank ${f.pausedRank} if it comes due`);
}

// He lived through something you did to him. Rank rises; twice makes a Nemesis.
export function feudSurvive(s: GameState, pid: string, what: string, title: string) {
  if (!feudOn(s)) return;
  const p = s.people[pid];
  if (!p || p.player || p.status === "dead") return;
  const f = rec(p);
  f.survived += 1;
  f.title = title;
  chapter(s, p, "survived", what);
  if (!p.rival) return;
  // A man becomes your Nemesis once. After that his survivals still raise him, to Faction leader at most.
  if (f.survived >= 2 && p.rival.rank < 4 && !f.wasNemesis) { f.wasNemesis = true; rankChange(s, pid, 4 - p.rival.rank, `he has survived you twice (${what})`); }
  else if (p.rival.rank < 3) rankChange(s, pid, 1, `he survived you: ${what}`);
}

// An execution ends one record and opens another with the nearest kin, and the game says so.
export function feudInherit(s: GameState, dead: Person, kin: Person | undefined) {
  if (!feudOn(s)) return;
  const f = rec(dead);
  chapter(s, dead, "executed", "put to death; the record is closed");
  f.closed = true;
  if (!kin) return;
  const k = rec(kin);
  k.title = "the Bereaved";
  k.pausedRank = Math.max(k.pausedRank ?? 1, dead.rival?.rank ?? 1);
  event(s, kin.id, `${capital(kin.name)} swears that ${dead.name}'s death will not be forgotten. The feud passes to him.`, "you executed his kin");
}

export const titledName = (p: Person) => (feudOf(p)?.title ? `${p.name} ${feudOf(p)!.title}` : p.name);
export const chapterLine = (c: Chapter) => `${seasonName(c.season)}: ${c.text}`;
