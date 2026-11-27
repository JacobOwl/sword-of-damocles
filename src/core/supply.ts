// Switch "armySupply" (war focus, council of 2026-11-27, question 4B): an army feeds from the friendly towns within
// a few days' march, and a big army eats an area faster, which is the brake on one giant army. Ravage burns a hostile
// town's crops for a year; Reinforce brings fresh men to an army in the field; an army kept waiting without a battle
// loses its allies. Shapes from Diodorus (docs/research/war-and-towns.md); numbers invention (data/supply.json).
import { addToPart } from "./contingents.ts";
import supplyJson from "../../data/supply.json" with { type: "json" };
import { on } from "./switches.ts";
import { log, event, silver, clock } from "./ops.ts";
import { PLAYER, capital } from "./state.ts";
import { NODES, armyName, city, cityGrainChange, friendly, menWords, nodeName, path } from "./island.ts";
import { card, weary } from "./war.ts";
import type { Army, GameState } from "./types.ts";

export const SUPPLY = supplyJson as any;
const K = SUPPLY.knobs;
export const supplyOn = (s: GameState) => on(s, "armySupply") && !!s.island;

const daysTo = (a: string, b: string) => (a === b ? 0 : path(a, b)?.days.at(-1) ?? 999);

// The friendly towns that can feed an army where it stands, nearest first, and the grain they can spare.
export function supplyTowns(s: GameState, a: Army): { id: string; spare: number; days: number }[] {
  return NODES.map((n) => ({ id: n.id, days: daysTo(a.at, n.id) }))
    .filter((x) => x.days <= K.supplyDays && x.id !== a.siege && friendly(a.side, city(s, x.id).side) && !s.island!.armies.some((o) => o.siege === x.id))
    .map((x) => ({ ...x, spare: Math.max(0, city(s, x.id).grain - K.keepGrain) }))
    .filter((x) => x.spare > 0)
    .sort((x, y) => x.days - y.days || y.spare - x.spare);
}
// Months of grain an army needs to refill: one for every few points of men.
export const grainNeed = (a: Army) => Math.max(1, Math.ceil(a.men / K.pointsPerGrain));

// Try to feed an army from the area (island.ts, where armies eat). True if it was fed.
export function feedFromArea(s: GameState, a: Army, full: number): boolean {
  const need = grainNeed(a);
  const towns = supplyTowns(s, a);
  if (towns.reduce((t, x) => t + x.spare, 0) < need) return false;
  let left = need;
  const from: string[] = [];
  for (const t of towns) {
    if (left <= 0) break;
    const take = Math.min(t.spare, left);
    cityGrainChange(s, t.id, -take, `feeding ${armyName(s, a)}`);
    from.push(t.id);
    left -= take;
  }
  a.food = full;
  a.fedFrom = from;
  a.fedSeason = s.season;
  return true;
}

// Fed, short or starving, with the reason in words (for the army's card).
export function foodState(s: GameState, a: Army): { word: "fed" | "short" | "starving"; why: string } {
  const need = grainNeed(a);
  const towns = supplyTowns(s, a);
  const spare = towns.reduce((t, x) => t + x.spare, 0);
  const area = towns.length ? towns.map((t) => nodeName(t.id)).join(", ") : "no friendly town";
  const feeds = spare >= need ? `It can be fed next season from ${area} (${need} months of grain needed, ${spare} to spare within ${K.supplyDays} days).`
    : `${area === "no friendly town" ? "No friendly town" : area} within ${K.supplyDays} days ${spare ? `can spare only ${spare} of the ${need} months of grain it needs` : "has grain to spare"}: it eats from its baggage.`;
  if (a.food <= 0) return { word: "starving", why: feeds };
  if (a.food === 1) return { word: "short", why: feeds };
  return { word: "fed", why: feeds };
}

// ---------- Ravage ----------

export const ravaged = (s: GameState, id: string) => (city(s, id).ravagedUntil ?? -1) >= s.season;
export function ravageCheck(s: GameState, a: Army | undefined): string | null {
  if (!a) return "you have no army in the field";
  if (a.at === "syracuse" || friendly("syracuse", city(s, a.at).side)) return "your army is in friendly country";
  if (ravaged(s, a.at)) return "its fields are already burnt";
  if (s.flags.ravaged === s.season) return "the army has ravaged once this season";
  return null;
}
export function ravage(s: GameState, a: Army) {
  const id = a.at;
  const c = city(s, id);
  s.flags.ravaged = s.season;
  c.ravagedUntil = s.season + K.ravageSeasons;
  event(s, PLAYER, `Your army ravages the land of ${nodeName(id)}: it cuts down the trees and burns the standing grain.`, "Ravage (Diodorus 14.48.5)");
  cityGrainChange(s, id, -K.ravageGrain, "its crops were burnt");
  c.fear = Math.min(3, c.fear + 1);
  log(s, { actor: "world", text: `${nodeName(id)} fears you more (fear ${c.fear}), and gets no harvest for a year.`, why: "its land was laid waste", visible: true, kind: "change" });
  c.lean = Math.max(-3, c.lean - 1);
  if (["carthage", "tributary"].includes(c.side)) {
    if (card(s)) weary(s, "carthage", 1, `the land of ${nodeName(id)} was laid waste`);
    else clock(s, 1, `you laid waste the land of ${nodeName(id)}`);
  }
}

// ---------- Reinforce ----------

// The friendly town that can send men to the army: within a couple of days, with men to spare.
export function reinforceFrom(s: GameState, a: Army): string | undefined {
  return NODES.map((n) => ({ id: n.id, days: daysTo(a.at, n.id) }))
    .filter((x) => x.days <= K.reinforceDays && ["ally", "syracuse"].includes(city(s, x.id).side) && city(s, x.id).men >= 2 && !s.island!.armies.some((o) => o.siege === x.id))
    .sort((x, y) => x.days - y.days || city(s, y.id).men - city(s, x.id).men)[0]?.id;
}
export function reinforceCheck(s: GameState, a: Army | undefined): string | null {
  if (!a) return "you have no army in the field";
  if (s.silver < K.reinforceCost) return `needs ${K.reinforceCost} silver`;
  if (a.reinforced === s.season) return "fresh men came this season already";
  if (!reinforceFrom(s, a)) return `no town of yours or your allies' within ${K.reinforceDays} days has men to spare`;
  return null;
}
export function reinforce(s: GameState, a: Army) {
  const from = reinforceFrom(s, a)!;
  silver(s, -K.reinforceCost, "pay for fresh men");
  city(s, from).men -= 1;
  a.men += 1;
  addToPart(s, a, from); // switch "contingents"
  a.reinforced = s.season;
  event(s, PLAYER, `Fresh men from ${nodeName(from)} join ${armyName(s, a)} (now ${menWords(a.men)}).`, "Reinforce the army");
}

// ---------- Patience ----------

// Called each season (war.ts warSeason): an army kept in the field long without a battle loses its allies (14.61.3).
export function patience(s: GameState, a: Army | undefined, noBattle: number) {
  if (!supplyOn(s) || !a || noBattle < K.driftAfter) return;
  const allies = Math.max(0, a.men - a.guard - 1);
  if (!allies) return;
  a.men -= 1;
  log(s, { actor: PLAYER, text: `${capital(armyName(s, a))} loses ${menWords(1)}: allies drift home after ${noBattle} seasons without a battle.`, why: "the Sicilian Greeks, angered at his unwillingness to encounter the enemy, deserted (Diodorus 14.61.3)", visible: true, kind: "change" });
}
