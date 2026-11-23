// What a headless player does on the island (Phase 2), for the checks and balance runs.
// It sees only what the map shows: armies, sides, walls, grain, and the odds the preview gives.
import { PLAYER, holds } from "./state.ts";
import { NODES, battleMods, carthageArmy, city, friendly, path, reachable, yourArmy, cityWalls } from "./island.ts";
import type { Args, GameState } from "./types.ts";
import { townHold } from "./secrets.ts";
import { commanderOptions, commissionOn, keeperOptions } from "./commission.ts";
import { LANDINGS, autoContractor, contractors, convoysOn } from "./convoys.ts";

export interface IslandChoice { a: string; args?: Args; min?: number }

// How a bot fights: the iron hand sacks Carthage's towns and any town that leans against it; the others spare.
export interface IslandStyle { sack?: boolean }
// The edge your army would have in a battle where Carthage's army stands, from the same numbers the battle uses.
function edge(s: GameState, ya: NonNullable<ReturnType<typeof yourArmy>>, ca: NonNullable<ReturnType<typeof carthageArmy>>): number {
  const sum = (m: { value: number }[]) => m.reduce((x, y) => x + y.value, 0);
  const at = ya.at;
  ya.at = ca.at; // look, don't move: put it back at once
  const e = sum(battleMods(s, ya)) - sum(battleMods(s, ca));
  ya.at = at;
  return e;
}

export function islandChoices(s: GameState, style: IslandStyle = {}): IslandChoice[] {
  const out: IslandChoice[] = [];
  if (s.island && convoysOn(s)) out.push(...convoyChoices(s));
  if (!s.island || (!holds(s, PLAYER, "generalship") && !commissionOn(s))) return out;
  const isl = s.island;
  const ya = yourArmy(s);
  const ca = carthageArmy(s);
  const danger = s.plots.some((pl) => pl.stage >= 2);
  if (isl.war && isl.carthage.offer >= s.season - 1 && (!ya || (ca && ca.men > ya.men) || s.grain <= 3)) out.push({ a: "acceptPeace" });
  if (!ya) {
    const wantWar = isl.war && ca;
    const wantSpoils = !isl.war && s.silver >= 7 && s.grain >= 6 && !danger && s.season >= 6;
    if (wantWar || wantSpoils) out.push({ a: "muster", args: { second: danger || s.guard.strength < 3 ? "levy" : "guard", ...(commissionOn(s) ? leaderArgs(s, danger) : {}) } });
    for (const n of NODES) {
      const c = city(s, n.id);
      // Switch "secrets": send spies first, so the embassy can lean on its first man (the action is in the menu only with the switch).
      if ((c.side === "tributary" || c.side === "free") && c.lean >= 0 && s.silver >= 5 && !townHold(s, n.id)) out.push({ a: "spyTown", args: { target: n.id }, min: 0.5 });
      if ((c.side === "tributary" || c.side === "free") && c.lean >= 1 && s.silver >= 4) out.push({ a: "embassyCity", args: { target: n.id }, min: 0.5 });
    }
    return out;
  }
  const near = (id: string) => reachable(s, ya.at).includes(id);
  if (ya.siege) out.push({ a: "assault", min: 0.5 });
  if (ya.food <= 0 && !friendly("syracuse", city(s, ya.at).side)) out.push({ a: "forage" });
  if (ca) {
    if (ca.siege === "syracuse" && ya.at !== "syracuse" && near("syracuse")) out.push({ a: "sendArmy", args: { target: "syracuse", second: "spare" } });
    if (edge(s, ya, ca) >= 1 && ca.at !== ya.at && near(ca.at)) out.push({ a: "sendArmy", args: { target: ca.at, second: "spare" } });
    if (edge(s, ya, ca) < 1 && ya.at !== "syracuse" && near("syracuse")) out.push({ a: "sendArmy", args: { target: "syracuse", second: "spare" } });
  }
  if (!ya.siege && ya.food >= 1) {
    const blocked = (id: string) => !!ca && path(ya.at, id)!.nodes.includes(ca.at) && edge(s, ya, ca) < 1; // don't walk into a battle you would likely lose
    const targets = NODES.filter((n) => !friendly("syracuse", city(s, n.id).side) && city(s, n.id).side !== "exiles" && near(n.id) && !blocked(n.id))
      .sort((a, b) => cityWalls(s, a.id) - cityWalls(s, b.id) || (path(ya.at, a.id)!.days.at(-1)! - path(ya.at, b.id)!.days.at(-1)!));
    const t = targets.find((n) => cityWalls(s, n.id) === 0 || ya.men >= 8);
    if (t) out.push({ a: "sendArmy", args: { target: t.id, second: style.sack && (city(s, t.id).side === "carthage" || city(s, t.id).lean < 0) ? "sack" : "spare" } });
  }
  if (!isl.war && !ya.siege && friendly("syracuse", city(s, ya.at).side) && (ya.food <= 0 || s.silver <= 2)) out.push({ a: "disband" });
  if (!ya.siege && ya.food <= 0 && ya.at !== "syracuse" && near("syracuse")) out.push({ a: "sendArmy", args: { target: "syracuse", second: "spare" } });
  return out;
}

// Switch "commission": with a plot at Rumors or worse, send the most loyal man who will go (the general first);
// otherwise lead in person and leave the citadel to the most loyal keeper you know of.
function leaderArgs(s: GameState, danger: boolean): Args {
  const men = commanderOptions(s).filter((o) => o.value !== PLAYER).map((o) => s.people[o.value])
    .filter((p) => p.opinion >= 1 && !s.plots.some((pl) => pl.known.includes(p.id)))
    .sort((a, b) => (b.id === s.offices.generalship ? 1 : 0) - (a.id === s.offices.generalship ? 1 : 0) || b.opinion - a.opinion);
  if (danger && men[0]) return { target: men[0].id };
  const keepers = keeperOptions(s, { target: PLAYER }).map((o) => s.people[o.value])
    .filter((p) => !s.plots.some((pl) => pl.known.includes(p.id))).sort((a, b) => b.opinion - a.opinion);
  return { target: PLAYER, option: keepers[0]?.id ?? keeperOptions(s, { target: PLAYER })[0]?.value };
}

// Switch "convoys": feed an army on the coast that is low on food; audit a contractor whose convoys keep coming short.
function convoyChoices(s: GameState): IslandChoice[] {
  const out: IslandChoice[] = [];
  const ya = yourArmy(s);
  if (ya && LANDINGS.includes(ya.at) && ya.food <= 1 && s.grain >= 4 && s.silver >= 1 && autoContractor(s)) out.push({ a: "sendGrain", args: { target: autoContractor(s) } });
  const st = s.convoys?.contractors ?? {};
  const sus = contractors(s).find((id) => (st[id]?.short ?? 0) + (st[id]?.sold ?? 0) * 2 >= 2 && s.season - (st[id]?.audited ?? -99) >= 4 && s.factions.rich.mood >= 2);
  if (sus) out.push({ a: "auditContracts", args: { target: sus } });
  return out;
}
