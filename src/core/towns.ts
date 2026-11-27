// Switch "townBoards" (war focus, council of 2026-11-27, question 2B): each town's three leading houses (from the
// census) are its seats. Each house leans to you, to Carthage, or to the town alone. The houses tilt whether a town
// goes over, decide whether an ally sends its silver and men, can open a gate from inside, and turn on your friends
// when news of a defeat comes. The shapes come from Diodorus (docs/research/war-and-towns.md); every number is
// invention (data/towns.json). Setting up the boards uses no dice, so a game with the switch off plays the same.
import townsJson from "../../data/towns.json" with { type: "json" };
import { on } from "./switches.ts";
import { log, event, silver } from "./ops.ts";
import { PLAYER } from "./state.ts";
import { NODES, city, lean, nodeName, yourArmy } from "./island.ts";
import { censusPersonName } from "./census-game.ts";
import { CENSUS_DATA } from "./census.ts";
import { d6 } from "./rng.ts";
import type { GameState, Mod, Side } from "./types.ts";

export const TOWNS = townsJson as any;
export type HouseLean = "you" | "carthage" | "town";
export interface Seat { house: string; lean: HouseLean; since: number }

export const townBoardsOn = (s: GameState) => on(s, "townBoards") && !!s.island && !!s.census;
const boards = (s: GameState): Record<string, Seat[]> => ((s.island as any).townBoards ??= {});

// The town's houses, highest standing first (the first is its first man's house).
function housesOf(s: GameState, id: string) {
  return Object.values(s.census!.houses)
    .filter((h) => h.place === id && !h.endedSeason && CENSUS_DATA.bodies.find((b: any) => b.id === h.body)?.tie.kind === "city")
    .sort((a, b) => b.standing - a.standing || (a.id < b.id ? -1 : 1))
    .slice(0, 3);
}
function startLean(side: Side, cityLean: number, i: number): HouseLean {
  const second: HouseLean = cityLean >= 1 ? "you" : cityLean <= -1 ? "carthage" : "town";
  const row: Record<string, HouseLean[]> = {
    syracuse: ["you", "you", "town"], ally: ["you", second, "town"], free: ["town", second, "town"],
    tributary: ["carthage", second, "town"], carthage: ["carthage", "carthage", "town"], exiles: ["town", "town", "town"],
  };
  return (row[side] ?? row.free)[i] ?? "town";
}

// Set up once, at the first world step with the switch on (no dice).
export function initTownBoards(s: GameState) {
  if (!townBoardsOn(s) || (s.island as any).townBoards) return;
  const b = boards(s);
  for (const n of NODES) {
    if (n.id === "syracuse") continue;
    const c = city(s, n.id);
    b[n.id] = housesOf(s, n.id).map((h, i) => ({ house: h.id, lean: startLean(c.side, c.lean, i), since: s.season }));
  }
}

export function seatsOf(s: GameState, id: string): Seat[] {
  if (!townBoardsOn(s)) return [];
  return boards(s)[id] ?? [];
}
export const houseHead = (s: GameState, seat: Seat) => s.census!.houses[seat.house]?.head ?? null;
export function houseName(s: GameState, seat: Seat): string {
  const head = houseHead(s, seat);
  return head ? `the house of ${censusPersonName(s, head, true).replace(/, of [^,]+$/, "")}` : "a house with no grown head"; // "son of" tells apart heads who share a name
}
const count = (seats: Seat[], l: HouseLean) => seats.filter((x) => x.lean === l).length;
export const divided = (s: GameState, id: string) => { const x = seatsOf(s, id); return x.length === 3 && new Set(x.map((y) => y.lean)).size === 3; };
export const friendsIn = (s: GameState, id: string) => count(seatsOf(s, id), "you");

function setLean(s: GameState, id: string, i: number, to: HouseLean, why: string, visible = true) {
  const seat = seatsOf(s, id)[i];
  if (!seat || seat.lean === to) return;
  seat.lean = to;
  seat.since = s.season;
  const word = { you: "now leans to you", carthage: "now leans to Carthage", town: "now stands for the town alone" }[to];
  log(s, { actor: "world", text: `In ${nodeName(id)}, ${houseName(s, seat)} ${word}.`, why, visible, kind: "change" });
}
// One step toward a side: Carthage's friend -> the town alone -> yours, or the other way.
function step(l: HouseLean, toward: "you" | "carthage"): HouseLean {
  if (toward === "you") return l === "carthage" ? "town" : "you";
  return l === "you" ? "town" : "carthage";
}

// ---------- What the houses change ----------

// A modifier on a town going over (island.ts goOverMods): its houses, counted for or against the side.
export function houseMods(s: GameState, id: string, side: "syracuse" | "carthage"): Mod[] {
  const x = seatsOf(s, id);
  if (!x.length) return [];
  const m: Mod[] = [];
  const v = (count(x, "you") - count(x, "carthage")) * (side === "syracuse" ? 1 : -1);
  const capped = Math.max(-TOWNS.knobs.houseModMax, Math.min(TOWNS.knobs.houseModMax, v));
  if (capped) m.push({ label: `its leading houses: ${count(x, "you")} for you, ${count(x, "carthage")} for Carthage`, value: capped });
  if (divided(s, id)) m.push({ label: "the town is divided and cannot agree", value: TOWNS.knobs.dividedGoOver });
  return m;
}
// Does an ally or town of yours send its silver and men? Not if it is divided or no house there is your friend.
export function sendsSupport(s: GameState, id: string): { ok: boolean; why?: string } {
  if (!townBoardsOn(s) || !seatsOf(s, id).length) return { ok: true };
  if (divided(s, id)) return { ok: false, why: "its houses cannot agree among themselves" };
  if (!friendsIn(s, id)) return { ok: false, why: "no house there is your friend" };
  return { ok: true };
}

// A town changes sides (island.ts setSide): a town that came over has at least one friend of its new side inside.
export function townSideChanged(s: GameState, id: string, side: Side) {
  const x = seatsOf(s, id);
  if (!x.length) return;
  const to: HouseLean | null = side === "syracuse" || side === "ally" ? "you" : side === "carthage" || side === "tributary" ? "carthage" : null;
  if (!to || x.some((y) => y.lean === to)) return;
  const i = x.findIndex((y) => y.lean !== to);
  setLean(s, id, i, to, `${nodeName(id)} went over to ${to === "you" ? "you" : "Carthage"}`);
}
// A town changes hands: the winner seats its friend as first man (island.ts takeCity).
export function seatFriend(s: GameState, id: string, side: "syracuse" | "carthage", who: string) {
  if (!seatsOf(s, id).length) return;
  setLean(s, id, 0, side === "syracuse" ? "you" : "carthage", `${who} put a friend at the head of the town`);
  // The other side's friends are driven out of a town taken by arms.
  const foe: HouseLean = side === "syracuse" ? "carthage" : "you";
  seatsOf(s, id).forEach((x, i) => { if (x.lean === foe) setLean(s, id, i, "town", `its friends of ${foe === "you" ? "yours" : "Carthage"} were driven out when the town was taken`); });
}

// News of a defeat (war.ts warBattle, warArmyDestroyed): where your friends are outnumbered, the others drive them out.
export function newsOfDefeat(s: GameState, where: string) {
  if (!townBoardsOn(s)) return;
  for (const n of NODES) {
    const c = city(s, n.id);
    if (!["ally", "syracuse", "free"].includes(c.side)) continue;
    const x = seatsOf(s, n.id);
    const mine = x.map((y, i) => [y, i] as const).filter(([y]) => y.lean === "you");
    if (!mine.length || mine.length * 2 > x.length) continue;
    if (yourArmy(s)?.at === n.id) continue; // your army in the town protects your friends
    const [seat, i] = mine[mine.length - 1];
    log(s, { actor: "world", text: `When news of the defeat at ${nodeName(where)} reaches ${nodeName(n.id)}, its other houses drive out your friends: ${houseName(s, seat)} goes into exile.`, why: "they banished the partisans of the tyrant (Diodorus 14.88.5)", visible: true, kind: "event" });
    setLean(s, n.id, i, "town", "its men were driven out", false);
    lean(s, n.id, -1, "your friends there were driven out");
  }
}

// ---------- Winning houses ----------

// The house you would court in a town: the highest not yet yours.
export function courtableSeat(s: GameState, id: string): number {
  return seatsOf(s, id).findIndex((x) => x.lean !== "you");
}
export function courtHouseMods(s: GameState, id: string): Mod[] {
  const c = city(s, id);
  const i = courtableSeat(s, id);
  const seat = seatsOf(s, id)[i];
  const m: Mod[] = [];
  if (c.lean) m.push({ label: c.lean > 0 ? `${nodeName(id)} leans your way` : `${nodeName(id)} leans against you`, value: Math.max(-1, Math.min(1, c.lean)) });
  if (seat?.lean === "carthage") m.push({ label: "the house is Carthage's friend", value: -1 });
  if (i === 0) m.push({ label: "it is the first house of the town", value: -1 });
  if (friendsIn(s, id)) m.push({ label: "your friends there speak for you", value: 1 });
  return m;
}
export function courtHouse(s: GameState, id: string, ok: boolean) {
  const i = courtableSeat(s, id);
  const seat = seatsOf(s, id)[i];
  silver(s, -TOWNS.knobs.courtCost, `gifts for ${seat ? houseName(s, seat) : "a house"} of ${nodeName(id)}`);
  if (!seat) return;
  if (!ok) { event(s, PLAYER, `${houseName(s, seat).replace(/^the/, "The")} of ${nodeName(id)} takes your gifts and promises nothing.`, "Court a house failed"); return; }
  setLean(s, id, i, step(seat.lean, "you"), "your gifts and promises");
}
// Carthage's envoys court a town (carthage.ts "court"): one house a step toward Carthage.
export function carthageCourtsHouse(s: GameState, id: string): boolean {
  if (!townBoardsOn(s)) return false;
  const x = seatsOf(s, id);
  const i = x.findIndex((y) => y.lean === "you");
  const j = i >= 0 ? i : x.findIndex((y) => y.lean === "town");
  if (j < 0) return false;
  setLean(s, id, j, step(x[j].lean, "carthage"), "Carthage's envoys bring gifts and promises (Magon's way, Diodorus 14.90.3)");
  return true;
}

// ---------- A gate from inside ----------

// While your army besieges a town where a house is your friend, once a siege that house offers a gate (14.15.1-2).
export function gateOffer(s: GameState): { town: string; head: string } | null {
  if (!townBoardsOn(s)) return null;
  const a = yourArmy(s);
  if (!a?.siege || s.flags[`gate_${a.siege}`] === a.siegeSince) return null;
  const x = seatsOf(s, a.siege);
  const seat = x.find((y) => y.lean === "you" && houseHead(s, y));
  if (!seat) return null;
  if (d6(s) < TOWNS.knobs.gateOfferNeed) return null;
  s.flags[`gate_${a.siege}`] = a.siegeSince;
  return { town: a.siege, head: houseHead(s, seat)! };
}
