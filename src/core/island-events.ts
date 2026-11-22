// The island's events (Phase 2): the conditions, parts and effects that events in data/island-events.json use on top of
// the court events' own. events.ts stays the one engine; it calls in here for anything about cities, armies, Carthage
// and the generated cast. Everything still changes through island.ts, carthage.ts or ops.ts, so it is logged with its reason.
//
// Parts in an event are stored in its cast as plain strings: a person id for the court cast, "city:<node>" for a town,
// "census:<id>" for one of the invented people, "punic:<id>" for one of Carthage's named men. Players only ever see names.
import { pick } from "./rng.ts";
import { PLAYER, capital, nameOf } from "./state.ts";
import { log } from "./ops.ts";
import {
  CARTHAGE, NODES, armyName, bloc, blocPower, carthageArmy, carthagePersonName, city, cityGrain, cityWalls, disband, friendly,
  loseMen, menWords, nodeDef, nodeName, path, takeCity, yourArmy, lean as leanCity, setSide, cityGrainChange,
} from "./island.ts";
import { endWar } from "./carthage.ts";
import { leaderOfCity, councilOf, captainOf, censusPersonName } from "./census-game.ts";
import type { Army, GameState, Side } from "./types.ts";

export type Range = { min?: number; max?: number };
const inRange = (v: number, r?: Range) => !r || ((r.min === undefined || v >= r.min) && (r.max === undefined || v <= r.max));
const list = <T>(v: T | T[] | undefined): T[] | undefined => (v === undefined ? undefined : Array.isArray(v) ? v : [v]);

// ---------- Shapes ----------

export interface ArmyCond {
  men?: Range; food?: Range; siege?: boolean; at?: string | string[]; // node ids, or a town part of the event
  onOwnGround?: boolean; withGuard?: boolean; seasonsOut?: Range; siegeFor?: Range;
}
export interface IslandCond {
  war?: boolean; warFor?: Range;
  yourArmy?: boolean | ArmyCond; carthageArmy?: boolean | ArmyCond;
  goal?: string[]; general?: boolean; plague?: boolean; revolt?: boolean;
  cSilver?: Range; ships?: Range; mercs?: Range; levy?: Range;
  bloc?: Record<string, { mood?: Range; power?: Range }>;
  sides?: Record<string, Side[]>;
  count?: { side: Side[]; min?: number; max?: number };
  people?: Record<string, string[]>; // Carthage's named men by status, e.g. { "himilcon": ["disgraced"] }
}
export interface PlaceCond {
  id?: string | string[]; notId?: string[]; side?: Side | Side[];
  lean?: Range; fear?: Range; grain?: Range; men?: Range; walls?: Range;
  sacked?: boolean; port?: boolean; marsh?: boolean;
  besiegedBy?: "you" | "carthage" | "none";
  yourArmy?: number | false; carthageArmy?: number | false; // within so many days (0 = in it), or not within the go-over distance
  changedWithin?: number; // it changed sides within so many seasons
  hasLeader?: boolean;
  optional?: boolean;
}
export interface CensusRole { census: "leader" | "council" | "captain"; of?: string; n?: number; optional?: boolean }
export interface PunicRole { punic: string | string[]; punicStatus?: string[]; optional?: boolean }

// ---------- Names of parts ----------

export function partName(s: GameState, id: string): string {
  if (id.startsWith("city:")) return nodeName(id.slice(5));
  if (id.startsWith("census:")) return censusPersonName(s, id.slice(7));
  if (id.startsWith("punic:")) return carthagePersonName(s, id.slice(6));
  return nameOf(s, id);
}
export const isPart = (id: string) => /^(city|census|punic):/.test(id);
const cityOf = (cast: Record<string, string>, ref: string) => (cast[ref]?.startsWith("city:") ? cast[ref].slice(5) : ref);

// ---------- Conditions ----------

const daysBetween = (a: string, b: string) => (a === b ? 0 : path(a, b)?.days.at(-1) ?? 999);

function armyFits(s: GameState, a: Army | undefined, c: boolean | ArmyCond | undefined, cast: Record<string, string> = {}): boolean {
  if (c === undefined) return true;
  if (c === false) return !a;
  if (!a) return false;
  if (c === true) return true;
  if (!inRange(a.men, c.men) || !inRange(a.food, c.food)) return false;
  if (c.siege !== undefined && !!a.siege !== c.siege) return false;
  const at = list(c.at)?.map((x) => cityOf(cast, x));
  if (at && !at.includes(a.at)) return false;
  if (c.onOwnGround !== undefined && friendly(a.side, city(s, a.at).side) !== c.onOwnGround) return false;
  if (c.withGuard !== undefined && (a.guard > 0) !== c.withGuard) return false;
  if (!inRange(s.season - a.since, c.seasonsOut)) return false;
  if (c.siegeFor && (!a.siege || !inRange(s.season - a.siegeSince, c.siegeFor))) return false;
  return true;
}

export function checkIslandCond(s: GameState, c: IslandCond | undefined): boolean {
  if (!c) return true;
  const isl = s.island;
  if (!isl) return false;
  const k = isl.carthage;
  if (c.war !== undefined && isl.war !== c.war) return false;
  if (c.warFor && (!isl.war || !inRange(s.season - isl.warSince, c.warFor))) return false;
  if (!armyFits(s, yourArmy(s), c.yourArmy) || !armyFits(s, carthageArmy(s), c.carthageArmy)) return false;
  if (c.goal && !c.goal.includes(k.goal)) return false;
  if (c.general !== undefined && !!k.general !== c.general) return false;
  if (c.plague !== undefined && (k.plagueUntil >= s.season) !== c.plague) return false;
  if (c.revolt !== undefined && k.revolt !== c.revolt) return false;
  if (!inRange(k.silver, c.cSilver) || !inRange(k.ships, c.ships) || !inRange(k.mercs, c.mercs) || !inRange(k.levy, c.levy)) return false;
  for (const [b, r] of Object.entries(c.bloc ?? {})) { const x = k.blocs[b]; if (!x || !inRange(x.mood, r.mood) || !inRange(x.power, r.power)) return false; }
  for (const [id, sides] of Object.entries(c.sides ?? {})) if (!sides.includes(city(s, id).side)) return false;
  if (c.count) { const n = NODES.filter((x) => c.count!.side.includes(city(s, x.id).side)).length; if (!inRange(n, c.count)) return false; }
  for (const [id, sts] of Object.entries(c.people ?? {})) if (!sts.includes(k.people[id]?.status ?? "none")) return false;
  return true;
}

export function placeFits(s: GameState, id: string, c: PlaceCond): boolean {
  const isl = s.island!;
  const st = city(s, id);
  const def = nodeDef(id)!;
  const ids = list(c.id);
  if (ids && !ids.includes(id)) return false;
  if (c.notId?.includes(id)) return false;
  const sides = list(c.side);
  if (sides && !sides.includes(st.side)) return false;
  if (!inRange(st.lean, c.lean) || !inRange(st.fear, c.fear) || !inRange(cityGrain(s, id), c.grain) || !inRange(st.men, c.men) || !inRange(cityWalls(s, id), c.walls)) return false;
  if (c.sacked !== undefined && st.sacked !== c.sacked) return false;
  if (c.port !== undefined && !!def.port !== c.port) return false;
  if (c.marsh !== undefined && !!def.marsh !== c.marsh) return false;
  if (c.besiegedBy) {
    const by = isl.armies.find((a) => a.siege === id);
    if (c.besiegedBy === "none" ? !!by : by?.side !== (c.besiegedBy === "you" ? "syracuse" : "carthage")) return false;
  }
  for (const [key, side] of [["yourArmy", "syracuse"], ["carthageArmy", "carthage"]] as const) {
    const want = c[key];
    if (want === undefined) continue;
    const a = isl.armies.find((x) => x.side === side);
    const near = !!a && daysBetween(a.at, id) <= (want === false ? 6 : want);
    if (want === false ? near : !near) return false;
  }
  if (c.changedWithin !== undefined && (st.since === 0 || s.season - st.since > c.changedWithin)) return false;
  if (c.hasLeader !== undefined && !!leaderOfCity(s, id) !== c.hasLeader) return false;
  return true;
}

// Cast the towns of an event, in the order written. Returns null if a needed town can't be found.
export function castPlaces(s: GameState, places: Record<string, PlaceCond> | undefined, given: Record<string, string> = {}): Record<string, string> | null {
  const cast: Record<string, string> = {};
  if (!places) return cast;
  if (!s.island) return null;
  for (const [role, c] of Object.entries(places)) {
    if (given[role]?.startsWith("city:") && placeFits(s, given[role].slice(5), c) && !Object.values(cast).includes(given[role])) { cast[role] = given[role]; continue; }
    const cands = NODES.map((n) => n.id).filter((id) => !Object.values(cast).includes(`city:${id}`) && placeFits(s, id, c));
    if (!cands.length) { if (c.optional) continue; return null; }
    cast[role] = `city:${cands.length === 1 ? cands[0] : pick(s, cands)}`;
  }
  return cast;
}

// One of the generated cast, or one of Carthage's named men. Returns undefined if no one fits.
export function castPart(s: GameState, r: CensusRole | PunicRole, cast: Record<string, string>): string | undefined {
  if ("punic" in r) {
    const k = s.island?.carthage;
    if (!k) return undefined;
    const want = list(r.punic)!;
    const ids = want.flatMap((w) => (w === "general" ? (k.general ? [k.general] : carthageArmy(s) ? [carthageArmy(s)!.commander] : []) : [w]));
    const ok = ids.filter((id) => k.people[id] && (r.punicStatus ?? ["free", "command"]).includes(k.people[id].status) && !Object.values(cast).includes(`punic:${id}`));
    return ok.length ? `punic:${ok[0]}` : undefined;
  }
  if (!s.census) return undefined;
  let id: string | undefined;
  if (r.census === "leader") id = leaderOfCity(s, cityOf(cast, r.of ?? ""));
  else if (r.census === "council") {
    const xs = councilOf(s, r.of ?? "elders").filter((x) => s.census!.people[x]?.alive && !Object.values(cast).includes(`census:${x}`));
    id = xs.length ? (xs.length === 1 ? xs[0] : pick(s, xs)) : undefined;
  } else if (r.census === "captain") id = captainOf(s, (r.of ?? "syracuse") as "syracuse" | "carthage", r.n ?? 0);
  if (!id || Object.values(cast).includes(`census:${id}`)) return undefined;
  return `census:${id}`;
}

// ---------- Effects ----------

const ISLAND_EFFECTS = ["lean", "cityGrain", "cityMen", "cityWalls", "fear", "side", "takeCity", "armyMen", "armyFood", "siegeLines", "liftSiege",
  "armyHome", "onTake", "bloc", "blocPower", "cSilver", "cMercs", "cLevy", "cShips", "cPlague", "generalFalls", "peace"] as const;
export const ISLAND_EFFECT_KEYS = new Set<string>(ISLAND_EFFECTS);
const armyOf = (s: GameState, side: string) => (side === "carthage" ? carthageArmy(s) : yourArmy(s));
const sgn = (n: number) => (n > 0 ? `+${n}` : `${n}`);
const blocName = (id: string) => CARTHAGE.blocs.find((b: any) => b.id === id)?.name ?? id;

// Apply one island effect. Returns false if the effect is not an island one, so events.ts can try its own.
export function applyIslandEffect(s: GameState, cast: Record<string, string>, e: Record<string, any>, why: string): boolean {
  const key = Object.keys(e).find((x) => ISLAND_EFFECT_KEYS.has(x));
  if (!key) return false;
  const isl = s.island;
  if (!isl) return true; // never in a citadel game
  const k = isl.carthage;
  const town = (ref: string) => { const id = cityOf(cast, ref); return isl.cities[id] ? id : undefined; };
  switch (key) {
    case "lean": { const id = town(e.lean); if (id) leanCity(s, id, e.by, why); break; }
    case "cityGrain": { const id = town(e.cityGrain); if (id) cityGrainChange(s, id, e.by, why); break; }
    case "cityMen": case "cityWalls": case "fear": {
      const id = town(e[key]); if (!id) break;
      const c = city(s, id);
      const field = key === "cityMen" ? "men" : key === "cityWalls" ? "walls" : "fear";
      const max = field === "fear" ? 3 : field === "walls" ? 4 : 10;
      const before = c[field];
      c[field] = Math.max(0, Math.min(max, c[field] + e.by));
      const word = field === "men" ? "men under arms" : field === "walls" ? "walls" : "fear of you";
      if (c[field] !== before) log(s, { actor: "world", text: `${nodeName(id)}: ${word} ${sgn(c[field] - before)} (now ${c[field]}).`, why, visible: true, kind: "change" });
      break;
    }
    case "side": { const id = town(e.side); if (id && id !== "syracuse") setSide(s, id, e.to, why); break; }
    case "takeCity": {
      const id = town(e.takeCity);
      const a = yourArmy(s);
      if (id && a && a.at === id && city(s, id).side !== "syracuse") takeCity(s, a, "surrendered");
      break;
    }
    case "armyMen": { const a = armyOf(s, e.armyMen); if (!a) break; if (e.by < 0) loseMen(s, a, -e.by, why); else { a.men += e.by; log(s, { actor: a.side === "syracuse" ? PLAYER : "carthage", text: `${capital(armyName(s, a))} gains ${menWords(e.by)} (now ${menWords(a.men)}).`, why, visible: true, kind: "change" }); } break; }
    case "armyFood": {
      const a = armyOf(s, e.armyFood); if (!a) break;
      const before = a.food;
      a.food = Math.max(0, Math.min(3, a.food + e.by));
      if (a.food !== before) log(s, { actor: a.side === "syracuse" ? PLAYER : "carthage", text: `${capital(armyName(s, a))}: food ${sgn(a.food - before)} season${Math.abs(a.food - before) > 1 ? "s" : ""} (now ${a.food}).`, why, visible: true, kind: "change" });
      break;
    }
    case "siegeLines": { const a = armyOf(s, e.siegeLines); if (a?.siege) { a.siegeSince -= e.by; log(s, { actor: a.side === "syracuse" ? PLAYER : "carthage", text: `The siege lines before ${nodeName(a.siege)} are pushed forward.`, why, visible: true, kind: "change" }); } break; }
    case "liftSiege": { const a = armyOf(s, e.liftSiege); if (a?.siege) { const at = a.siege; a.siege = undefined; log(s, { actor: a.side === "syracuse" ? PLAYER : "carthage", text: `${capital(armyName(s, a))} lifts the siege of ${nodeName(at)}.`, why, visible: true, kind: "event" }); } break; }
    case "armyHome": {
      const a = armyOf(s, e.armyHome); if (!a) break;
      if (a.side === "syracuse") { disband(s, a); break; }
      isl.armies = isl.armies.filter((x) => x !== a);
      k.mercs += Math.floor(a.men / 2);
      const g = k.people[a.commander];
      if (g && g.status === "command") g.status = "free";
      k.general = undefined;
      log(s, { actor: "carthage", text: `${capital(armyName(s, a))} sails home to Libya.`, why, visible: true, kind: "event" });
      break;
    }
    case "onTake": { const a = yourArmy(s); if (a) a.onTake = e.onTake; break; }
    case "bloc": bloc(s, e.bloc, e.by, why); break;
    case "blocPower": blocPower(s, e.blocPower, e.by, why); break;
    case "cSilver": case "cMercs": case "cLevy": case "cShips": {
      const field = ({ cSilver: "silver", cMercs: "mercs", cLevy: "levy", cShips: "ships" } as const)[key];
      const before = k[field];
      k[field] = Math.max(0, k[field] + e[key]);
      const word = ({ silver: "treasury", mercs: "hired men", levy: "Libyan levy", ships: "fleet" } as const)[field];
      if (k[field] !== before) log(s, { actor: "carthage", text: `Carthage's ${word} ${sgn(k[field] - before)} (now ${k[field]}).`, why, visible: true, kind: "change" });
      break;
    }
    case "cPlague": if (k.plagueUntil < s.season) { k.plagueUntil = s.season + e.cPlague; s.counters.carthagePlagues = (s.counters.carthagePlagues ?? 0) + 1; log(s, { actor: "carthage", text: "Plague is in Carthage.", why, visible: true, kind: "event" }); } break;
    case "generalFalls": {
      const id = cast[e.generalFalls]?.startsWith("punic:") ? cast[e.generalFalls].slice(6) : k.general;
      const g = id ? k.people[id] : undefined;
      if (!g || g.status === "dead") break;
      const a = carthageArmy(s);
      if (a && a.commander === g.id) {
        const next = CARTHAGE.people.filter((p: any) => k.people[p.id].status === "free").sort((x: any, y: any) => y.general - x.general)[0];
        if (next) { a.commander = next.id; k.people[next.id].status = "command"; k.general = next.id; log(s, { actor: "carthage", text: `${next.name} takes command of the army in Sicily.`, why, visible: true, kind: "event" }); }
        else { applyIslandEffect(s, cast, { armyHome: "carthage" }, why); }
      } else if (k.general === g.id) k.general = undefined;
      g.status = e.to ?? "disgraced";
      log(s, { actor: "carthage", text: `${g.name} is ${g.status === "dead" ? "put to death" : "stripped of his command"}.`, why, visible: true, kind: "event" });
      break;
    }
    case "peace": if (isl.war) endWar(s, why); break;
  }
  return true;
}

// Plain words for an island effect, or null if it is not one.
export function describeIslandEffect(s: GameState, cast: Record<string, string>, e: Record<string, any>): string | null {
  const key = Object.keys(e).find((x) => ISLAND_EFFECT_KEYS.has(x));
  if (!key) return null;
  const t = (ref: string) => nodeName(cityOf(cast, ref));
  const army = (side: string) => (side === "carthage" ? "Carthage's army" : "Your army");
  switch (key) {
    case "lean": return e.by > 0 ? `${t(e.lean)} warms to you (${sgn(e.by)})` : `${t(e.lean)} cools toward you (${sgn(e.by)})`;
    case "cityGrain": return `${t(e.cityGrain)}'s grain ${sgn(e.by)} months`;
    case "cityMen": return `${t(e.cityMen)}'s men under arms ${sgn(e.by)}`;
    case "cityWalls": return `${t(e.cityWalls)}'s walls ${sgn(e.by)}`;
    case "fear": return `${t(e.fear)}'s fear of you ${sgn(e.by)}`;
    case "side": return `${t(e.side)} becomes ${({ syracuse: "yours", ally: "your ally", free: "free", tributary: "Carthage's tributary", carthage: "Carthage's", exiles: "the exiles'" } as any)[e.to] ?? e.to}`;
    case "takeCity": return `${t(e.takeCity)} opens its gates to you`;
    case "armyMen": return `${army(e.armyMen)} ${e.by > 0 ? "gains" : "loses"} ${menWords(Math.abs(e.by))}`;
    case "armyFood": return `${army(e.armyFood)}: food ${sgn(e.by)} season${Math.abs(e.by) > 1 ? "s" : ""}`;
    case "siegeLines": return `${army(e.siegeLines)}'s siege lines ${sgn(e.by)}`;
    case "liftSiege": return `${army(e.liftSiege)} lifts its siege`;
    case "armyHome": return e.armyHome === "carthage" ? "Carthage's army sails home" : "Your army comes home and disbands";
    case "onTake": return e.onTake === "sack" ? "Your army will sack the next town it takes" : "Your army will spare the next town it takes";
    case "bloc": return `In Carthage, ${blocName(e.bloc)}: mood ${sgn(e.by)}`;
    case "blocPower": return `In Carthage, ${blocName(e.blocPower)}: power ${sgn(e.by)}`;
    case "cSilver": return `Carthage's treasury ${sgn(e.cSilver)}`;
    case "cMercs": return `Carthage's hired men ${sgn(e.cMercs)}`;
    case "cLevy": return `Carthage's Libyan levy ${sgn(e.cLevy)}`;
    case "cShips": return `Carthage's fleet ${sgn(e.cShips)}`;
    case "cPlague": return "Plague in Carthage";
    case "generalFalls": return `${capital(cast[e.generalFalls] ? partName(s, cast[e.generalFalls]) : "Carthage's general")} loses his command`;
    case "peace": return "Peace with Carthage: each side keeps what it holds";
  }
  return null;
}

// The simple bot's rough value for an island effect.
export function scoreIslandEffect(s: GameState, cast: Record<string, string>, e: Record<string, any>): number {
  const key = Object.keys(e).find((x) => ISLAND_EFFECT_KEYS.has(x));
  if (!key || !s.island) return 0;
  switch (key) {
    case "lean": return e.by * 0.6;
    case "cityGrain": case "cityMen": case "cityWalls": {
      const id = cityOf(cast, e[key]);
      const mine = ["syracuse", "ally"].includes(s.island.cities[id]?.side ?? "");
      return (mine ? 0.5 : -0.3) * e.by;
    }
    case "fear": return e.by * 0.3;
    case "side": return ["syracuse", "ally"].includes(e.to) ? 3 : ["carthage", "tributary"].includes(e.to) ? -3 : 0;
    case "takeCity": return 4;
    case "armyMen": return (e.armyMen === "carthage" ? -1.5 : 1.5) * e.by;
    case "armyFood": return (e.armyFood === "carthage" ? -1 : 1) * e.by;
    case "siegeLines": return e.siegeLines === "carthage" ? -1 : 1;
    case "liftSiege": return e.liftSiege === "carthage" ? 3 : -1.5;
    case "armyHome": return e.armyHome === "carthage" ? 6 : -2;
    case "cSilver": case "cMercs": case "cLevy": case "cShips": return -0.6 * e[key];
    case "bloc": return e.bloc === "libyans" ? -0.8 * e.by : 0;
    case "cPlague": return 2;
    case "generalFalls": return 2;
    case "peace": return s.island.war ? 2 : 0;
  }
  return 0;
}
