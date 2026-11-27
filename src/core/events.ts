// Events: things that happen to the city and its people, drawn from the game's state.
// Every event, its trigger, its people and its choices live in data/events.json. This file only reads them:
// it checks the conditions, casts the people, shows the odds, and applies the effects through ops.ts,
// so every change is logged with its reason like any other move.
import { isPronoun, pronoun } from "./pronouns.ts";
import { REPLACED_EVENTS } from "./works.ts";
import { DATA } from "./data.ts";
import { nextRandom, pick } from "./rng.ts";
import {
  PLAYER, alive, capital, holds, isPlayerTyranny, leaderOf, nameOf, officeName, officesOf, others, plotOf, power, seasonIndex,
} from "./state.ts";
import {
  clearGrudge, clock, event, factionOf, grain, grudge, guardSet, land, leaveAllPlots, makeRival, mood, opinion, powerChange,
  rankChange, roll, setOffice, setStatus, silver,
} from "./ops.ts";
import { startPlot } from "./ai.ts";
import { on, switchById } from "./switches.ts";
import {
  applyIslandEffect, castPart, castPlaces, checkIslandCond, describeIslandEffect, isPart, partName, scoreIslandEffect,
} from "./island-events.ts";
import type { CensusRole, IslandCond, PlaceCond, PunicRole } from "./island-events.ts";
import { applyDinnerEffect, describeDinnerEffect } from "./dinner.ts";
import { applyExileEffect, checkExileCond, describeExileEffect, fitsExileRole, inExile, maybeExile, rulerName, refugeName, scoreExileEffect } from "./exile.ts";
import type { ExileCond } from "./exile.ts";
import type { EventInstance, EventsState, FactionId, GameState, Mod, OfficeId, Person } from "./types.ts";
import { OFFICES } from "./types.ts";

// ---------- Shapes of the data ----------

export type Range = { min?: number; max?: number };
export interface Cond {
  from?: string; until?: string; // seasons like "spring-404"
  seasonOfYear?: string[];
  silver?: Range; grain?: Range; clock?: Range; land?: Range;
  arrears?: Range; guardStrength?: Range; guardMood?: Range;
  mood?: Record<string, Range>; power?: Record<string, Range>;
  flag?: Record<string, boolean | { within: number }>;
  tyranny?: boolean; citadelBuilt?: boolean; walls?: boolean; disarmed?: boolean;
  playerHolds?: string[]; playerLacks?: string[];
  plotStage?: Range; plots?: Range;
  law?: string; noLaw?: string;
  done?: string[]; notDone?: string[]; // other events that have (or have not) happened
  any?: Cond[];
  island?: IslandCond; // cities, armies and Carthage (island games only; see island-events.ts)
  switchOn?: string; switchOff?: string; // an optional rule switch (data/switches.json) is on, or off
  exile?: ExileCond; // switch "exile": you are in exile, and how it stands (see exile.ts)
}
export interface RoleCond {
  id?: string | string[];
  notId?: string[];
  faction?: string | string[];
  status?: string | string[]; // default "free"
  trait?: string | string[];
  ambition?: string | string[];
  opinion?: Range;
  grudge?: boolean;
  rival?: boolean;
  political?: boolean;
  office?: boolean | string;
  marriageable?: boolean;
  married?: boolean;
  bound?: boolean;
  owedFavor?: boolean;
  leader?: boolean;
  inPlot?: boolean;
  kinOf?: string;
  real?: boolean;
  optional?: boolean;
  // A part played by one of the generated cast or one of Carthage's named men (island games only).
  census?: CensusRole["census"]; of?: string; n?: number;
  punic?: PunicRole["punic"]; punicStatus?: string[];
  // Switch "exile": with you in exile, has kin in the city, rules Syracuse now, sworn to you inside.
  where?: string; kinInCity?: boolean; usurper?: boolean; sworn?: boolean;
}
export interface Effect { [k: string]: any }
export interface RollDef {
  need?: number;
  mods?: ({ label: string; value: number; if?: Cond; ifRole?: { role: string; is: RoleCond } } | { trait: string; action: string })[];
  success: { text?: string; effects?: Effect[] };
  failure: { text?: string; effects?: Effect[] };
}
export interface ChoiceDef {
  id: string; label: string; text?: string; effects?: Effect[]; roll?: RollDef;
  cost?: { silver?: number; grain?: number; land?: number; slots?: number };
  if?: Cond; needs?: string[]; default?: boolean; history?: boolean; note?: string;
}
export interface EventDef {
  id: string; kind: "history" | "invention"; name: string; text: string; why: string;
  when?: Cond; roles?: Record<string, RoleCond>;
  weight?: number; once?: boolean; cooldown?: number; chained?: boolean;
  choices?: ChoiceDef[]; effects?: Effect[];
  source?: string; card?: string; facts?: any[]; invented?: string[]; note?: string;
  scenario?: "island" | "citadel"; // only in that kind of game (the island events are all "island")
  places?: Record<string, PlaceCond>; // towns the event is about, cast before the people
  art?: string;
  rumor?: string; // news from Carthage: with switch "falseRumors" it may be false; this names what it claims, for the later clue
}

import eventsJson from "../../data/events.json" with { type: "json" };
import islandEventsJson from "../../data/island-events.json" with { type: "json" };
import dinnersJson from "../../data/dinners.json" with { type: "json" };
import exileJson from "../../data/exile.json" with { type: "json" };
import boardJson from "../../data/board.json" with { type: "json" };
import { applyBoardEffect, describeBoardEffect, scoreBoardEffect, seatName } from "./board.ts";
export const COURT_EVENTS = (eventsJson as any).events as EventDef[];
export const ISLAND_EVENTS = ((islandEventsJson as any).events as EventDef[]).map((e) => ({ ...e, scenario: "island" as const }));
// Switch "dinners": the matters a dinner can put before you. All chained, so they never come by chance.
export const DINNER_EVENTS = (dinnersJson as any).asks as EventDef[];
// Switch "exile": the matters of an exile, drawn only while you are in exile (all island games).
export const EXILE_EVENTS = ((exileJson as any).events as EventDef[]).map((e) => ({ ...e, scenario: "island" as const }));
export const EXILE_PACING = (exileJson as any).pacing as { draws: number; secondChance: number; maxOpen: number };
// Switch "contestedBoard": the matters of the board, all chained, fired by board.ts.
export const BOARD_EVENTS = (boardJson as any).events as EventDef[];
export const EVENTS = [...COURT_EVENTS, ...ISLAND_EVENTS, ...DINNER_EVENTS, ...EXILE_EVENTS, ...BOARD_EVENTS];
export const PACING = (eventsJson as any).pacing as { draws: number; secondChance: number; maxOpen: number; cooldown: number };
export const ISLAND_PACING = (islandEventsJson as any).pacing as { draws: number; secondChance: number; maxOpen: number };
export const RUMORS = (islandEventsJson as any).rumors as { falseShare: number; clueAfter: number };
export const eventById = (id: string) => EVENTS.find((e) => e.id === id);

export function eventsState(s: GameState): EventsState {
  if (!s.events) s.events = { open: [], queue: [], fired: {}, count: 0 };
  return s.events;
}

// ---------- Conditions ----------

const inRange = (v: number, r?: Range) => !r || ((r.min === undefined || v >= r.min) && (r.max === undefined || v <= r.max));
const list = <T>(v: T | T[] | undefined): T[] | undefined => (v === undefined ? undefined : Array.isArray(v) ? v : [v]);

export function checkCond(s: GameState, c: Cond | undefined): boolean {
  if (!c) return true;
  if (c.from && s.season < seasonIndex(c.from)) return false;
  if (c.until && s.season > seasonIndex(c.until)) return false;
  if (c.seasonOfYear && !c.seasonOfYear.includes(["autumn", "winter", "spring", "summer"][s.season % 4])) return false;
  if (!inRange(s.silver, c.silver) || !inRange(s.grain, c.grain) || !inRange(s.clock, c.clock) || !inRange(s.land, c.land)) return false;
  if (!inRange(s.guard.arrearsSeasons, c.arrears) || !inRange(s.guard.strength, c.guardStrength) || !inRange(s.factions.guard.mood, c.guardMood)) return false;
  for (const [f, r] of Object.entries(c.mood ?? {})) if (!inRange(s.factions[f as FactionId].mood, r)) return false;
  for (const [f, r] of Object.entries(c.power ?? {})) if (!inRange(power(s, f as FactionId), r)) return false;
  for (const [k, v] of Object.entries(c.flag ?? {})) {
    const at = s.flags[k];
    if (v === true && at === undefined) return false;
    if (v === false && at !== undefined) return false;
    if (typeof v === "object" && (at === undefined || s.season - at > v.within)) return false;
  }
  if (c.tyranny !== undefined && isPlayerTyranny(s) !== c.tyranny) return false;
  if (c.citadelBuilt !== undefined && s.citadelBuilt !== c.citadelBuilt) return false;
  if (c.walls !== undefined && s.walls !== c.walls) return false;
  if (c.disarmed !== undefined && s.factions.citizens.disarmed !== c.disarmed) return false;
  for (const o of c.playerHolds ?? []) if (!holds(s, PLAYER, o as OfficeId)) return false;
  for (const o of c.playerLacks ?? []) if (holds(s, PLAYER, o as OfficeId)) return false;
  if (c.plotStage && !inRange(Math.max(0, ...s.plots.map((p) => p.stage)), c.plotStage)) return false;
  if (c.plots && !inRange(s.plots.length, c.plots)) return false;
  if (c.law && !s.laws.includes(c.law)) return false;
  if (c.noLaw && s.laws.includes(c.noLaw)) return false;
  const fired = eventsState(s).fired;
  for (const id of c.done ?? []) if (fired[id] === undefined) return false;
  for (const id of c.notDone ?? []) if (fired[id] !== undefined) return false;
  if (c.any && !c.any.some((x) => checkCond(s, x))) return false;
  if (c.island && !checkIslandCond(s, c.island)) return false;
  if (c.switchOn && !on(s, c.switchOn)) return false;
  if (c.switchOff && on(s, c.switchOff)) return false;
  if (c.exile && !checkExileCond(s, c.exile)) return false;
  return true;
}

export function fitsRole(s: GameState, p: Person, r: RoleCond, cast: Record<string, string>): boolean {
  if (p.player) return false;
  const ids = list(r.id);
  if (ids && !ids.includes(p.id)) return false;
  if (r.notId?.includes(p.id)) return false;
  const st = list(r.status) ?? ["free"];
  if (!st.includes(p.status)) return false;
  const fs = list(r.faction);
  if (fs && !fs.includes(p.faction)) return false;
  const ts = list(r.trait);
  if (ts && !ts.some((t) => p.traits.includes(t))) return false;
  const am = list(r.ambition);
  if (am && !am.includes(p.ambition)) return false;
  if (!inRange(p.opinion, r.opinion)) return false;
  if (r.grudge !== undefined && (p.grudges.length > 0) !== r.grudge) return false;
  if (r.rival !== undefined && !!p.rival !== r.rival) return false;
  if (r.political !== undefined && !!p.political !== r.political) return false;
  if (r.office === true && !officesOf(s, p.id).length) return false;
  if (r.office === false && officesOf(s, p.id).length) return false;
  if (typeof r.office === "string" && s.offices[r.office as OfficeId] !== p.id) return false;
  if (r.marriageable !== undefined && (p.marriageable && !p.married) !== r.marriageable) return false;
  if (r.married !== undefined && p.married !== r.married) return false;
  if (r.bound !== undefined && p.bound !== r.bound) return false;
  if (r.owedFavor !== undefined && p.owedFavor !== r.owedFavor) return false;
  if ((r.where !== undefined || r.kinInCity !== undefined || r.usurper !== undefined || r.sworn !== undefined) && !fitsExileRole(s, p, r)) return false;
  if (r.leader !== undefined) {
    const f = factionOf(s, p.id);
    if ((!!f && leaderOf(s, f)?.id === p.id) !== r.leader) return false;
  }
  if (r.inPlot !== undefined && !!plotOf(s, p.id) !== r.inPlot) return false;
  if (r.kinOf) {
    const other = cast[r.kinOf];
    if (!other || !(p.kin.includes(other) || s.people[other]?.kin.includes(p.id))) return false;
  }
  if (r.real !== undefined && (DATA.people.find((x) => x.id === p.id)?.kind === "history") !== r.real) return false;
  if (Object.values(cast).includes(p.id)) return false; // one person, one part
  return true;
}

// Cast the roles in the order they are written. Returns null if a required part can't be filled.
function castRoles(s: GameState, def: EventDef, given: Record<string, string> = {}): Record<string, string> | null {
  const places = castPlaces(s, def.places, given);
  if (!places) return null;
  const cast: Record<string, string> = { ...places };
  for (const [role, r] of Object.entries(def.roles ?? {})) {
    if (r.census || r.punic) {
      const id = given[role] && isPart(given[role]) ? given[role] : castPart(s, r as CensusRole | PunicRole, cast);
      if (id) { cast[role] = id; continue; }
      if (r.optional) continue;
      return null;
    }
    if (given[role]) {
      const p = s.people[given[role]];
      const without = Object.fromEntries(Object.entries(cast));
      if (p && fitsRole(s, p, r, without)) { cast[role] = p.id; continue; }
      if (r.optional) continue;
      return null;
    }
    const cands = others(s).filter((p) => fitsRole(s, p, r, cast));
    if (!cands.length) {
      if (r.optional) continue;
      return null;
    }
    cast[role] = (cands.length === 1 ? cands[0] : pick(s, cands)).id;
  }
  return cast;
}

// ---------- Text ----------

// {role} is the person's name; {Role} the same, capitalised for the start of a sentence.
export function fill(s: GameState, text: string, cast: Record<string, string>): string {
  return text.replace(/\{([A-Za-z]+)(?::([A-Za-z]+))?\}/g, (m, key: string, of?: string) => {
    if (of && isPronoun(key)) { const who = cast[of] ?? (of === "ruler" && s.exile?.active ? s.exile.ruler.id : undefined); return pronoun(s, who, key); } // {his:rich}: his or her
    const k = key.charAt(0).toLowerCase() + key.slice(1);
    const id = cast[k];
    if (id && (k === "seat" || k === "faction") && !of) { const v = k === "seat" ? seatName(id) : s.factions[id as FactionId]?.short ?? id; return key[0] === key[0].toUpperCase() ? capital(v) : v; } // switch "contestedBoard"
    if (!id && s.exile?.active && (k === "ruler" || k === "refuge")) { const v = k === "ruler" ? rulerName(s) : refugeName(s); return key[0] === key[0].toUpperCase() ? capital(v) : v; } // switch "exile"
    if (!id) return m;
    const n = partName(s, id);
    return key[0] === key[0].toUpperCase() ? capital(n) : n;
  });
}

// ---------- Choices: what you can pick, and what it will do ----------

export function choiceBlocked(s: GameState, inst: EventInstance, c: ChoiceDef): string | null {
  for (const r of c.needs ?? []) if (!inst.roles[r]) return "that person is not here";
  if (c.if && !checkCond(s, c.if)) return "not possible now";
  const k = c.cost ?? {};
  if (k.silver && s.silver < k.silver) return `needs ${k.silver} silver`;
  if (k.grain && s.grain < k.grain) return `needs ${k.grain} months of grain`;
  if (k.land && s.land < k.land) return `needs ${k.land} portion${k.land > 1 ? "s" : ""} of land`;
  if (k.slots && s.slots < k.slots) return `needs ${k.slots} action${k.slots > 1 ? "s" : ""}`;
  return null;
}

export function choiceMods(s: GameState, inst: EventInstance, rd: RollDef): Mod[] {
  const mods: Mod[] = [];
  for (const m of rd.mods ?? []) {
    if ("trait" in m) {
      const pid = m.trait === "you" ? PLAYER : inst.roles[m.trait];
      const p = pid ? s.people[pid] : undefined;
      for (const t of p?.traits ?? []) {
        const td = DATA.traits.find((x) => x.id === t);
        const v = td?.actor?.[m.action];
        if (v) mods.push({ label: `${p!.player ? "your" : p!.name + "'s"} trait ${td!.name}`, value: v });
      }
      continue;
    }
    if (m.if && !checkCond(s, m.if)) continue;
    if (m.ifRole) {
      const p = s.people[inst.roles[m.ifRole.role]];
      if (!p || !fitsRole(s, p, m.ifRole.is, {})) continue;
    }
    mods.push({ label: fill(s, m.label, inst.roles), value: m.value });
  }
  return mods;
}

export interface ChoiceView {
  id: string; label: string; blocked: string | null; cost: string[]; effects: string[]; isDefault?: boolean;
  roll?: { need: number; mods: Mod[]; chance: number; success: string[]; failure: string[] };
}

// What the player sees before choosing: costs, effects in plain words, and the odds of any roll.
export function viewChoice(s: GameState, inst: EventInstance, c: ChoiceDef): ChoiceView {
  const cost: string[] = [];
  if (c.cost?.silver) cost.push(`${c.cost.silver} silver`);
  if (c.cost?.grain) cost.push(`${c.cost.grain} months of grain`);
  if (c.cost?.land) cost.push(`${c.cost.land} portion${c.cost.land > 1 ? "s" : ""} of land`);
  if (c.cost?.slots) cost.push(`${c.cost.slots} action${c.cost.slots > 1 ? "s" : ""}`);
  const v: ChoiceView = { id: c.id, label: fill(s, c.label, inst.roles), blocked: choiceBlocked(s, inst, c), cost, effects: describe(s, inst, c.effects ?? []) };
  if (c.roll) {
    const mods = choiceMods(s, inst, c.roll);
    const need = c.roll.need ?? 4;
    const sum = mods.reduce((a, m) => a + m.value, 0);
    const chance = [1, 2, 3, 4, 5, 6].filter((d) => d + sum >= need).length / 6;
    v.roll = { need, mods, chance, success: describe(s, inst, c.roll.success.effects ?? []), failure: describe(s, inst, c.roll.failure.effects ?? []) };
  }
  return v;
}

const sgn = (n: number) => (n > 0 ? `+${n}` : `${n}`);
const fname = (s: GameState, f: string) => (s.factions[f as FactionId]?.name ?? f);

// Plain words for each effect. Hidden effects (marked "hidden": true) are left out.
export function describe(s: GameState, inst: EventInstance, effects: Effect[]): string[] {
  const out: string[] = [];
  const who = (r: string) => (r === "you" ? "you" : capital(partName(s, inst.roles[r] ?? r)));
  for (const e of effects) {
    if (e.hidden) continue;
    if (e.if && !checkCond(s, e.if)) continue;
    // An optional role nobody filled: the effect falls on no one, so say nothing (second test: "FavouriteKin becomes your enemy").
    const target = e.opinion ?? e.grudge ?? e.clearGrudge ?? e.rival ?? e.rank ?? e.status ?? e.influence ?? e.favor ?? e.clearFavor ?? e.bound ?? e.informer ?? e.reveal;
    if (typeof target === "string" && target !== "you" && !inst.roles[target] && !s.people[target]) continue;
    const isl = describeIslandEffect(s, inst.roles, e);
    if (isl !== null) { out.push(isl); continue; }
    const din = describeDinnerEffect(s, inst.roles, e);
    if (din !== null) { out.push(din); continue; }
    const exi = describeExileEffect(s, inst.roles, e);
    if (exi !== null) { if (exi) out.push(exi); continue; }
    const brd = describeBoardEffect(s, inst.roles, e);
    if (brd !== null) { if (brd) out.push(brd); continue; }
    if (e.silver) out.push(`Silver ${sgn(e.silver)}`);
    else if (e.grain) out.push(`Grain ${sgn(e.grain)} months`);
    else if (e.land) out.push(`Land ${sgn(e.land)}`);
    else if (e.clock) out.push(`The Carthage clock ${sgn(e.clock)}`);
    else if (e.mood) out.push(`${fname(s, e.mood)}: mood ${sgn(e.by)}`);
    else if (e.power) out.push(`${fname(s, e.power)}: power ${sgn(e.by)}`);
    else if (e.opinion) out.push(`${who(e.opinion)}: opinion of you ${sgn(e.by)}`);
    else if (e.grudge) out.push(`${who(e.grudge)} holds a grudge`);
    else if (e.clearGrudge) out.push(`${who(e.clearGrudge)} lets go of a grudge`);
    else if (e.rival) out.push(`${who(e.rival)} becomes your enemy`);
    else if (e.rank) out.push(`${who(e.rank)}: rival rank ${sgn(e.by)}`);
    else if (e.status) out.push(`${who(e.status)} ${({ dead: "dies", outside: "leaves the city", held: "is held under guard", free: "is free in the city" } as any)[e.to]}`);
    else if (e.guard) out.push(`Guard ${e.guard} ${sgn(e.by)}`);
    else if (e.influence) out.push(`${who(e.influence)}: influence ${sgn(e.by)}`);
    else if (e.favor) out.push(`You owe ${who(e.favor)} a favour`);
    else if (e.clearFavor) out.push(`Your debt to ${who(e.clearFavor)} is settled`);
    else if (e.bound) out.push(`${who(e.bound)} is bound to you`);
    else if (e.informer) out.push(`${who(e.informer)} reports to you on any plot`);
    else if (e.reveal) out.push(`You learn ${who(e.reveal)}'s secrets`);
    else if (e.revealPlots) out.push("You learn the names in every plot against you");
    else if (e.revealPlotOf) out.push(`You learn who is in any plot with ${who(e.revealPlotOf)}`);
    else if (e.clearFlag === "fleetDamaged") out.push("The fleet is repaired");
    else if (e.leavePlots) out.push(`${who(e.leavePlots)} leaves any plot`);
    else if (e.startPlot) out.push(`${who(e.startPlot)} starts plotting against you`);
    else if (e.plotBonus) out.push(`Every plot against you ${sgn(e.plotBonus)} strength`);
    else if (e.office) out.push(e.to === "you" ? `You take ${officeName(e.office)}` : `${who(e.to)} holds ${officeName(e.office)}`);
    else if (e.marry) out.push(`You marry ${who(e.marry)}`);
    else if (e.walls) out.push("The city gets its new walls");
    else if (e.disarm) out.push("The citizens are disarmed: their power -2, mood -2");
    else if (e.payArrears) out.push("The guard's arrears are cleared");
    else if (e.end) out.push("Your rule ends");
    // Switch "petitionOffers": what the asker gives back, said as his offer.
    if (e.offer && e.why && out.length) out[out.length - 1] = `In return, ${fill(s, e.why, inst.roles)}: ${out[out.length - 1].charAt(0).toLowerCase()}${out[out.length - 1].slice(1)}`;
  }
  return out;
}

// ---------- Firing and resolving ----------

function eligible(s: GameState, def: EventDef): boolean {
  const ev = eventsState(s);
  if (def.chained) return false; // only fires when another event queues it
  if (REPLACED_EVENTS.has(def.id) && on(s, "greatWorks")) return false; // the works take its place
  if (def.scenario === "island" && !s.island) return false;
  if (def.scenario === "citadel" && s.island) return false;
  const last = ev.fired[def.id];
  if (last !== undefined && (def.once ?? def.kind === "history")) return false;
  if (last !== undefined && s.season - last < (def.cooldown ?? PACING.cooldown)) return false;
  return checkCond(s, def.when);
}

function fire(s: GameState, def: EventDef, cast: Record<string, string>, why: string) {
  const ev = eventsState(s);
  ev.fired[def.id] = s.season;
  ev.count += 1;
  s.counters.events = (s.counters.events ?? 0) + 1;
  if (def.kind === "history") s.counters.historyEvents = (s.counters.historyEvents ?? 0) + 1;
  if (def.scenario === "island") s.counters.islandEvents = (s.counters.islandEvents ?? 0) + 1;
  const actor = Object.values(cast)[0] ?? "world";
  event(s, actor, fill(s, def.text, cast), fill(s, why, cast));
  // Switch "falseRumors": some news from Carthage is false. Its effects on Carthage never happen, and later word tells which.
  let falseRumor: boolean | undefined;
  if (def.rumor && on(s, "falseRumors")) {
    falseRumor = nextRandom(s) < RUMORS.falseShare;
    const claim = fill(s, def.rumor, cast);
    (ev.clues ??= []).push({ season: s.season + RUMORS.clueAfter, text: falseRumor ? `Later word from Carthage: the story that ${claim} was false.` : `Later word from Carthage confirms the story that ${claim}.` });
    if (falseRumor) s.counters.falseRumors = (s.counters.falseRumors ?? 0) + 1;
  }
  // Effects on the event itself happen as it fires; choices come after.
  apply(s, { uid: "", id: def.id, roles: cast, season: s.season, falseRumor }, def.effects ?? [], def.name);
  if (!def.choices?.length || s.over) return;
  const uid = `ev${ev.count}`;
  ev.open.push({ uid, id: def.id, roles: cast, season: s.season, ...(falseRumor !== undefined ? { falseRumor } : {}) });
}

// Put a chained event before the player now, with its people already chosen (switch "dinners": a matter at the table).
export function fireNow(s: GameState, id: string, roles: Record<string, string>): boolean {
  const def = eventById(id);
  if (!def) return false;
  const cast = castRoles(s, def, roles);
  if (!cast) return false;
  fire(s, def, cast, def.why);
  return true;
}

// Switch "contestedBoard": a matter of the board, its people given, with the seat or faction it is about.
export function fireBoard(s: GameState, id: string, roles: Record<string, string>, extra: Record<string, string>): boolean {
  const def = eventById(id);
  if (!def) return false;
  const cast = castRoles(s, def, roles);
  if (!cast) return false;
  Object.assign(cast, extra);
  fire(s, def, cast, def.why);
  return true;
}

// Switch "exile": in exile, only the follow-ups and the exile's own matters come before you.
export function drawExileEvents(s: GameState) {
  const ev = eventsState(s);
  for (const q of ev.queue.filter((x) => x.season <= s.season)) {
    ev.queue.splice(ev.queue.indexOf(q), 1);
    const def = eventById(q.id);
    if (!def || !EXILE_EVENTS.includes(def as any) || !checkCond(s, def.when)) continue;
    const cast = castRoles(s, def, q.roles);
    if (cast) fire(s, def, cast, def.why);
  }
  if (inExile(s)) drawFrom(s, EXILE_EVENTS, EXILE_PACING.draws, EXILE_PACING.secondChance, EXILE_PACING.maxOpen);
}

// Called once a season, at the end of the people step.
export function drawEvents(s: GameState) {
  const ev = eventsState(s);
  // Switch "falseRumors": word arrives on whether earlier news from Carthage was true.
  for (const c of (ev.clues ?? []).filter((x) => x.season <= s.season)) {
    ev.clues!.splice(ev.clues!.indexOf(c), 1);
    event(s, "carthage", c.text, "merchants and envoys bring the truth in time");
  }
  // Follow-ups queued by earlier choices come first, if their people are still there.
  for (const q of ev.queue.filter((x) => x.season <= s.season)) {
    ev.queue.splice(ev.queue.indexOf(q), 1);
    const def = eventById(q.id);
    if (!def || !checkCond(s, def.when)) continue;
    const cast = castRoles(s, def, q.roles);
    if (cast) fire(s, def, cast, def.why);
  }
  // Switch "contestedBoard": the board makes its own matters, so the old deck comes rarer (no second draw).
  drawFrom(s, COURT_EVENTS, PACING.draws, s.board ? 0 : PACING.secondChance, PACING.maxOpen);
  // The island game draws again from the island's own events, so the court's intrigue is not crowded out.
  if (s.island && !s.over) {
    const islandOpen = () => ev.open.filter((o) => eventById(o.id)?.scenario === "island").length;
    drawFrom(s, ISLAND_EVENTS, ISLAND_PACING.draws, ISLAND_PACING.secondChance, ISLAND_PACING.maxOpen, islandOpen);
  }
}

function drawFrom(s: GameState, defs: EventDef[], baseDraws: number, second: number, maxOpen: number, openCount?: () => number) {
  const ev = eventsState(s);
  const opened = openCount ?? (() => ev.open.length);
  let draws = baseDraws + (nextRandom(s) < second ? 1 : 0);
  while (draws-- > 0 && opened() < maxOpen) {
    const pool: { def: EventDef; cast: Record<string, string> }[] = [];
    for (const def of defs) {
      if (!eligible(s, def) || ev.open.some((o) => o.id === def.id)) continue;
      const cast = castRoles(s, def);
      if (cast) pool.push({ def, cast });
    }
    if (!pool.length) return;
    // Switch "variedOpening": in the first seasons every eligible event weighs the same, so the year opens differently.
    const flat = on(s, "variedOpening") && s.season < ((switchById("variedOpening") as any).knobs.seasons as number);
    const w = (d: EventDef) => (flat ? 1 : d.weight ?? 1);
    // With it, a draw whose pool holds a single event (the island's first season offers only "A general's offer")
    // also has an even chance of bringing nothing, so that one event does not open every game.
    const quiet = flat && pool.length === 1 ? 1 : 0;
    const total = pool.reduce((a, x) => a + w(x.def), 0) + quiet;
    let r = nextRandom(s) * total;
    if (r >= total - quiet) continue;
    const chosen = pool.find((x) => (r -= w(x.def)) < 0) ?? pool[pool.length - 1];
    fire(s, chosen.def, chosen.cast, chosen.def.why);
    if (s.over) return;
  }
}

export function openEvents(s: GameState) {
  return eventsState(s).open.map((inst) => {
    const def = eventById(inst.id)!;
    const d = defaultChoice(s, inst);
    const note = def.rumor && on(s, "falseRumors") ? ` This is a rumor: about ${Math.round(RUMORS.falseShare * 3)} in 3 such stories prove false, and you will learn which in time.` : "";
    return { inst, def, title: def.name, text: fill(s, def.text, inst.roles) + note, choices: (def.choices ?? []).map((c) => ({ ...viewChoice(s, inst, c), isDefault: c === d })) };
  });
}

// Answer an event. Costs only what the choice says (most cost no action).
export function resolveEvent(s: GameState, uid: string, choiceId: string, auto = false): { ok: boolean; error?: string } {
  const ev = eventsState(s);
  const inst = ev.open.find((o) => o.uid === uid);
  if (!inst) return { ok: false, error: "no such event" };
  const def = eventById(inst.id)!;
  const c = def.choices?.find((x) => x.id === choiceId);
  if (!c) return { ok: false, error: "no such choice" };
  const blocked = choiceBlocked(s, inst, c);
  if (blocked) return { ok: false, error: blocked };
  ev.open = ev.open.filter((o) => o !== inst);
  const k = c.cost ?? {};
  const why = `${def.name}: ${fill(s, c.label, inst.roles)}`;
  if (k.silver) silver(s, -k.silver, why);
  if (k.grain) grain(s, -k.grain, why);
  if (k.land) land(s, -k.land, why);
  if (k.slots) s.slots -= k.slots;
  event(s, PLAYER, auto ? `You let the matter lie: ${fill(s, c.label, inst.roles).toLowerCase()}.` : `${def.name}. You choose: ${fill(s, c.label, inst.roles)}.`, auto ? "you gave no answer before the season ended" : "your choice");
  if (c.text) event(s, PLAYER, fill(s, c.text, inst.roles), why);
  apply(s, inst, c.effects ?? [], why);
  if (c.roll) {
    const r = roll(s, PLAYER, why, choiceMods(s, inst, c.roll), c.roll.need ?? 4);
    const out = r.ok ? c.roll.success : c.roll.failure;
    if (out.text) event(s, PLAYER, fill(s, out.text, inst.roles), `${why} (${r.ok ? "it worked" : "it failed"})`);
    apply(s, inst, out.effects ?? [], why);
  }
  return { ok: true };
}

// Unanswered events take their default choice (or the last one) when the season ends.
function defaultChoice(s: GameState, inst: EventInstance): ChoiceDef | undefined {
  const cs = eventById(inst.id)!.choices ?? [];
  return cs.find((x) => x.default && !choiceBlocked(s, inst, x)) ?? [...cs].reverse().find((x) => !choiceBlocked(s, inst, x));
}
export function settleEvents(s: GameState) {
  for (const inst of eventsState(s).open.slice()) {
    const c = defaultChoice(s, inst);
    if (c) resolveEvent(s, inst.uid, c.id, true);
    else eventsState(s).open = eventsState(s).open.filter((o) => o !== inst);
  }
}

// ---------- Effects ----------

const CARTHAGE_SIDE = new Set(["bloc", "blocPower", "generalFalls", "cSilver", "cMercs", "cLevy", "cShips", "cPlague"]);
export function apply(s: GameState, inst: EventInstance, effects: Effect[], why: string) {
  const pid = (r: string) => (r === "you" ? PLAYER : inst.roles[r] ?? (s.people[r] ? r : undefined));
  for (const e of effects) {
    if (s.over) return;
    if (e.if && !checkCond(s, e.if)) continue;
    if (inst.falseRumor && CARTHAGE_SIDE.has(Object.keys(e).find((k) => CARTHAGE_SIDE.has(k)) ?? "")) continue; // a false rumor changes nothing in Carthage
    const reason = e.why ? fill(s, e.why, inst.roles) : why;
    if (applyIslandEffect(s, inst.roles, e, reason)) continue;
    if (applyDinnerEffect(s, inst.roles, e, reason)) continue;
    if (applyExileEffect(s, inst.roles, e, reason)) continue;
    if (applyBoardEffect(s, inst.roles, e, reason)) continue;
    if (e.silver) silver(s, e.silver, reason);
    else if (e.grain) grain(s, e.grain, reason);
    else if (e.land) land(s, e.land, reason);
    else if (e.clock) clock(s, e.clock, reason);
    else if (e.mood) mood(s, e.mood, e.by, reason);
    else if (e.power) powerChange(s, e.power, e.by, reason);
    else if (e.opinion) { const p = pid(e.opinion); if (p && alive(s.people[p])) opinion(s, p, e.by, reason); }
    else if (e.grudge) { const p = pid(e.grudge); if (p) grudge(s, p, fill(s, e.reason, inst.roles)); }
    else if (e.clearGrudge) { const p = pid(e.clearGrudge); if (p) clearGrudge(s, p, reason); }
    else if (e.rival) { const p = pid(e.rival); if (p) makeRival(s, p, e.scar ?? "Humiliated", fill(s, e.reason ?? why, inst.roles)); }
    else if (e.rank) { const p = pid(e.rank); if (p) rankChange(s, p, e.by, reason); }
    else if (e.status) {
      const p = pid(e.status);
      if (!p || !alive(s.people[p]) && e.to !== "free") continue;
      if (e.to === "dead") { s.counters.eventDeaths = (s.counters.eventDeaths ?? 0) + 1; }
      setStatus(s, p, e.to, reason);
      if (e.to === "outside") for (const o of OFFICES) if (s.offices[o] === p) setOffice(s, o, PLAYER, `${s.people[p].name} has left the city`);
    }
    else if (e.guard) guardSet(s, e.guard, e.by, reason);
    else if (e.influence) { const p = pid(e.influence); if (p) s.people[p].infl += e.by; }
    else if (e.favor) { const p = pid(e.favor); if (p) s.people[p].owedFavor = true; }
    else if (e.clearFavor) { const p = pid(e.clearFavor); if (p) s.people[p].owedFavor = false; }
    else if (e.bound) { const p = pid(e.bound); if (p) s.people[p].bound = true; }
    else if (e.informer) {
      const p = pid(e.informer);
      if (!p) continue;
      s.people[p].informer = true;
      const pl = plotOf(s, p);
      if (pl) { pl.informer = p; pl.known = [...pl.members]; }
    }
    else if (e.reveal) { const p = pid(e.reveal); if (p) s.people[p].knownUntil = s.season + (e.seasons ?? 1); }
    else if (e.revealPlots) {
      for (const pl of s.plots) pl.known = [...pl.members];
      if (s.plots.length) event(s, PLAYER, `You learn who plots against you: ${s.plots.map((pl) => pl.members.map((m) => s.people[m].name).join(", ")).join("; ")}.`, reason);
      else event(s, PLAYER, "No one, it seems, plots against you. For now.", reason);
    }
    else if (e.leavePlots) { const p = pid(e.leavePlots); if (p) leaveAllPlots(s, p, reason); }
    else if (e.startPlot) { const p = pid(e.startPlot); if (p && !plotOf(s, p) && s.people[p].status !== "held") startPlot(s, s.people[p], reason); }
    else if (e.plotBonus) for (const pl of s.plots) pl.bonus += e.plotBonus;
    else if (e.office) {
      const to = e.to === "you" ? PLAYER : pid(e.to);
      if (to && (to === PLAYER || s.people[to].status === "free")) setOffice(s, e.office, to, reason);
    }
    else if (e.marry) {
      const p = pid(e.marry);
      if (!p) continue;
      const bride = s.people[p];
      if (bride.status !== "free") setStatus(s, p, "free", reason);
      bride.married = true; bride.bound = true;
      s.people[PLAYER].married = true;
      event(s, PLAYER, `You marry ${bride.name}.`, reason);
      for (const k of bride.kin) { const h = s.people[k]; if (h && alive(h)) { h.bound = true; opinion(s, k, 1, "a marriage between your houses"); } }
    }
    else if (e.walls) { if (!s.walls) { s.walls = true; event(s, "world", "The new walls stand.", reason); } }
    else if (e.disarm) {
      if (s.factions.citizens.disarmed) continue;
      s.factions.citizens.disarmed = true;
      powerChange(s, "citizens", -2, reason);
      mood(s, "citizens", -2, reason);
      for (const pl of s.plots) if (pl.backers.includes("citizens") || pl.members.some((m) => s.people[m].faction === "citizens")) pl.bonus -= 2;
    }
    else if (e.payArrears) {
      if (s.guard.owed || s.guard.arrearsSeasons) {
        s.guard.owed = 0; s.guard.arrearsSeasons = 0; s.guard.forSale = false;
        event(s, "guard", "The guard's arrears are settled.", reason);
      }
    }
    else if (e.flag) s.flags[e.flag] = s.season;
    else if (e.clearFlag) delete s.flags[e.clearFlag];
    else if (e.revealPlotOf) {
      const p = pid(e.revealPlotOf);
      const pl = p ? plotOf(s, p) : undefined;
      if (pl) { pl.known = [...pl.members]; event(s, PLAYER, `You learn who is in ${s.people[p!].name}'s plot: ${pl.members.map((m) => s.people[m].name).join(", ")}.`, reason); }
    }
    else if (e.then) eventsState(s).queue.push({ id: e.then, season: s.season + (e.after ?? 1), roles: { ...inst.roles } });
    else if (e.end) {
      s.over = { reason: e.end, text: fill(s, e.text ?? "Your rule ends.", inst.roles), season: s.season };
      event(s, PLAYER, s.over.text, reason);
      if (maybeExile(s)) return; // switch "exile": you fled, and the game goes on in exile
    }
    else if (e.say) event(s, "world", fill(s, e.say, inst.roles), reason);
  }
}

// ---------- The simple bot's answer ----------

// Scores a choice by its visible effects, so headless runs answer events too. Crude on purpose.
const VAL: Record<string, number> = { silver: 1, grain: 0.5, land: 1, clock: -1.5 };
function scoreEffects(s: GameState, inst: EventInstance, es: Effect[]): number {
  let v = 0;
  for (const e of es) {
    v += scoreIslandEffect(s, inst.roles, e);
    v += scoreExileEffect(s, e);
    v += scoreBoardEffect(s, inst.roles, e);
    for (const k of Object.keys(VAL)) if (typeof e[k] === "number") v += VAL[k] * e[k];
    if (e.mood) v += e.by * (s.factions[e.mood as FactionId].mood <= 1 ? 2 : 1.2);
    if (e.power) v += e.power === "family" ? e.by * 0.5 : -e.by * 0.3;
    if (e.opinion) v += e.by * 0.6;
    if (e.grudge) v -= 1.5;
    if (e.rival) v -= 2.5;
    if (e.startPlot) v -= 3;
    if (e.plotBonus) v -= e.plotBonus * 2;
    if (e.revealPlots) v += s.plots.length ? 3 : 0.5;
    if (e.reveal || e.informer) v += 0.8;
    if (e.guard) v += e.by * (e.guard === "strength" ? 1.5 : -1);
    if (e.walls) v += 3;
    if (e.payArrears) v += 2;
    if (e.end) v -= 100;
  }
  return v;
}
export function botAnswer(s: GameState) {
  for (const inst of eventsState(s).open.slice()) {
    const def = eventById(inst.id)!;
    let best: { id: string; v: number } | null = null;
    for (const c of def.choices ?? []) {
      if (choiceBlocked(s, inst, c)) continue;
      let v = scoreEffects(s, inst, c.effects ?? []) - (c.cost?.silver ?? 0) - (c.cost?.slots ?? 0) * 1.5 - (c.cost?.grain ?? 0) * 0.5 - (c.cost?.land ?? 0);
      if (c.roll) {
        const view = viewChoice(s, inst, c).roll!;
        v += view.chance * scoreEffects(s, inst, c.roll.success.effects ?? []) + (1 - view.chance) * scoreEffects(s, inst, c.roll.failure.effects ?? []);
      }
      // No random tie-break here: the game's own random stream must only move on replayable steps.
      if (!best || v > best.v) best = { id: c.id, v };
    }
    if (best) chooseEvent(s, inst.uid, best.id);
  }
}

// The public way to answer: recorded as an input so the game replays exactly.
export function chooseEvent(s: GameState, uid: string, choice: string) {
  if (s.step !== "player" || s.over) return { ok: false, error: "not your turn" };
  const inst = eventsState(s).open.find((o) => o.uid === uid);
  if (!inst) return { ok: false, error: "no such event" };
  const def = eventById(inst.id)!;
  const c = def.choices?.find((x) => x.id === choice);
  if (!c) return { ok: false, error: "no such choice" };
  const b = choiceBlocked(s, inst, c);
  if (b) return { ok: false, error: b };
  s.inputs.push({ t: "choose", event: uid, choice });
  return resolveEvent(s, uid, choice);
}


// For tests and the designer: fire an event now, ignoring its trigger. Returns false if its people can't be cast.
export function forceEvent(s: GameState, id: string, roles: Record<string, string> = {}): boolean {
  const def = eventById(id);
  if (!def) return false;
  const cast = castRoles(s, def, roles);
  if (!cast) return false;
  fire(s, def, cast, `${def.why} (forced)`);
  return true;
}
