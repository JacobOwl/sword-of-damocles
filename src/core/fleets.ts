// Switch "fleets" (test 5, docs/council/2026-11-27-units-ground-navy.md Part 3; card docs/research/navy-397-396.md):
// a small navy. Each side has one named fleet counted in squadrons, sound or damaged (Carthage's "ships" is its
// fleet). Your fleet takes one order a season from whoever holds the fleet seat: watch the crossing, escort the grain,
// blockade a port your army besieges, carry the army from port to port, or stay in harbour. An enemy fleet watching
// the lane brings on a battle at sea first; Carthage's fleet off Syracuse while your army is away is warned a season
// ahead; and a sea battle is a scene with one plan (close order or strike ahead), the rash admiral, and fight on or go
// home. A victory won by an admiral who is not you makes him and the citizens bolder. Numbers: data/fleets.json.
// Inspired by: Arcs (damaged ships flip and are repaired), Republic of Rome (fleets as counters with upkeep, fleet
// support for overseas legions), Imperator (fleet missions), Twilight Imperium (win the sea before you land).
import fleetsJson from "../../data/fleets.json" with { type: "json" };
import { on } from "./switches.ts";
import { HOOKS } from "./hooks.ts";
import { d6 } from "./rng.ts";
import { PLAYER, capital, nameOf } from "./state.ts";
import { event, log, mood, silver, grain } from "./ops.ts";
import { ABROAD_NODES, NODES, isLibya, arrive, armyName, carthageArmy, carthagePersonName, city, cityGrainChange, friendly, loseMen, nodeDef, nodeName, yourArmy } from "./island.ts";
import { addScene, pendingScene, allScenes } from "./scenes.ts";
import { boardOn, dig, vote, votedNow } from "./board.ts";
import type { Army, GameState, Mod } from "./types.ts";

export const FLEETS = fleetsJson as any;
const K = FLEETS.knobs;
export const fleetsOn = (s: GameState) => on(s, "fleets") && !!s.island;
export type Order = "watch" | "escort" | "blockade" | "carry" | "home";
export interface FleetState {
  sq: number; damaged: number; order: Order; orderWhy: string; rowers: "citizens" | "mercs" | "freed";
  cDamaged: number; threat?: number; great?: boolean; unpaid?: number; won: number; lost: number; dest?: string;
}
const poss = (n: string) => (n.endsWith("s") ? `${n}'` : `${n}'s`);
const count = (s: GameState, k: string, by = 1) => { s.counters[k] = (s.counters[k] ?? 0) + by; };
export function fleetState(s: GameState): FleetState {
  return ((s.island as any).fleets ??= { sq: K.start, damaged: 0, order: "watch", orderWhy: "the war could come by sea", rowers: "citizens", cDamaged: 0, won: 0, lost: 0 }) as FleetState;
}
export const orderDef = (id: string) => FLEETS.orders.find((o: any) => o.id === id);
const C = (s: GameState) => s.island!.carthage;
export const soundYours = (s: GameState) => { const f = fleetState(s); return Math.max(0, f.sq - f.damaged); };
export const soundTheirs = (s: GameState) => Math.max(0, C(s).ships - Math.min(C(s).ships, fleetState(s).cDamaged));
// The fleet obeys you if you hold the seat, or its holder is free and not against you.
export function fleetObeys(s: GameState): boolean {
  const h = s.offices.fleet;
  if (!h) return false;
  return h === PLAYER || (s.people[h]?.status === "free" && s.people[h].opinion >= 0);
}
// Who may give the fleet its order: you, if you hold the seat; or a holder who likes you (opinion 1 or more).
export function youOrder(s: GameState): boolean {
  const h = s.offices.fleet;
  return h === PLAYER || (!!h && s.people[h]?.status === "free" && s.people[h].opinion >= 1);
}
const admiral = (s: GameState) => s.offices.fleet;
export function admiralName(s: GameState) { const h = admiral(s); return !h ? "no one" : h === PLAYER ? "you" : nameOf(s, h); }
export function fleetName(s: GameState) { const h = admiral(s); return !h ? "the fleet of Syracuse" : h === PLAYER ? "your fleet" : `the fleet under ${nameOf(s, h)}`; }
function carthageAdmiral(s: GameState): string | undefined { const m = C(s).people.magon; return m && m.status === "free" ? "magon" : undefined; }
export function carthageFleetName(s: GameState) { const a = carthageAdmiral(s); return a ? `${poss(carthagePersonName(s, a))} fleet` : "Carthage's fleet"; }
export const ports = (s: GameState) => [...NODES.filter((n) => n.port), ...ABROAD_NODES.filter((n) => s.island?.cities[n.id])];
// The order the fleet sails under now, if it sails at all.
export function sailing(s: GameState, o: Order) { return fleetsOn(s) && fleetObeys(s) && soundYours(s) > 0 && fleetState(s).order === o && !HOOKS.fleetAbroad?.(s); } // switch "libyaCrossing": a fleet on Libya's beach sails no other order

// ---------- Hooks the older code calls (each returns undefined when the switch is off) ----------
// The interception roll at the crossing (carthage.ts intercept): only when watching; a sea battle if escorts fight.
export function fleetIntercept(s: GameState, a: Army): boolean {
  if (!fleetsOn(s)) return false;
  if (!sailing(s, "watch")) return true; // handled: the fleet is not watching, so nothing happens
  const m: Mod[] = [];
  if (s.works?.fleet) m.push({ label: "the great fleet", value: 1 });
  if (soundYours(s) >= soundTheirs(s)) m.push({ label: "your squadrons match theirs", value: 1 });
  const die = d6(s), t = die + m.reduce((x, y) => x + y.value, 0);
  const who = capital(fleetName(s));
  log(s, { actor: admiral(s)!, text: `${who} watches the crossing: rolled ${die}${m.map((x) => ` +${x.value} ${x.label}`).join("")} = ${t}, needs ${K.watchNeed}.`, why: "the fleet lies in wait (Diodorus 14.53.5)", visible: true, kind: "roll", roll: { die, mods: m, total: t, need: K.watchNeed, ok: t >= K.watchNeed } });
  if (t < K.watchNeed) return true;
  if (soundTheirs(s) > 0) { openSea(s, "crossing", { army: a.id }); return true; }
  event(s, admiral(s)!, `${who} falls on the transports at sea; no warships guard them.`, "the fleet watches the crossing");
  loseMen(s, a, Math.ceil(a.men / 4), "transports sunk at sea");
  count(s, "intercepts");
  return true;
}
// Who blockades a besieged port (island.ts sieges). undefined: the old rule.
HOOKS.blockade = (s: GameState, a: Army, id: string): boolean | undefined => {
  if (!fleetsOn(s)) return undefined;
  const yours = fleetObeys(s) ? soundYours(s) : 0;
  if (a.side === "carthage") return soundTheirs(s) >= K.blockadeMin && soundTheirs(s) > yours;
  return sailing(s, "blockade") && yours >= K.blockadeMin && yours >= soundTheirs(s);
};
// The escort of your grain (convoys.ts catchMods, season.ts autumn grain): only when escorting.
export const escorting = (s: GameState) => !fleetsOn(s) || sailing(s, "escort") || (!s.island!.war && fleetObeys(s) && soundYours(s) > 0 && fleetState(s).order !== "home");
export const hunting = (s: GameState) => !fleetsOn(s) || sailing(s, "watch") || sailing(s, "blockade");

// ---------- Each season (carthage.ts carthageStep, after Carthage has moved) ----------
export function fleetSeason(s: GameState) {
  if (!fleetsOn(s)) return;
  const f = fleetState(s), c = C(s);
  if (s.works?.fleet && !f.great) { f.great = true; f.sq = Math.min(K.max, f.sq + K.great); event(s, PLAYER, `The great fleet joins ${fleetName(s)}: ${f.sq} squadrons now.`, "the ship-sheds round the Great Harbour are full (Diodorus 14.42.5)"); }
  f.cDamaged = Math.min(f.cDamaged, c.ships);
  // Mending: one damaged squadron a season, in a friendly port, for silver.
  if (f.damaged > 0 && s.silver >= K.mendCost) { silver(s, -K.mendCost, "shipwrights mend a damaged squadron"); f.damaged -= 1; }
  if (f.cDamaged > 0 && c.silver >= K.mendCost) { c.silver -= K.mendCost; f.cDamaged -= 1; }
  // Hired rowers must be paid.
  if (f.rowers === "mercs" && f.sq > 0) {
    const pay = Math.ceil(f.sq / K.mercPay);
    if (s.silver >= pay) silver(s, -pay, "the hired rowers' pay");
    else { f.sq -= 1; f.damaged = Math.min(f.damaged, f.sq); event(s, PLAYER, "Unpaid, the hired rowers of one squadron take their pay from the ship's stores and sail away.", "the rowers were not paid"); }
  }
  // The holder's order, if he does not take yours.
  if (!youOrder(s) && admiral(s)) {
    const [o, why] = ownOrder(s);
    if (o !== f.order) { f.order = o; f.orderWhy = why; event(s, admiral(s)!, `${capital(nameOf(s, admiral(s)!))} orders the fleet: ${orderDef(o).name.toLowerCase()}.`, why); }
  }
  if (f.order === "carry" && f.dest === undefined) { f.order = "watch"; f.orderWhy = "back on watch after the crossing"; }
  seaThreat(s);
}
function ownOrder(s: GameState): [Order, string] {
  const h = admiral(s)!;
  if (!fleetObeys(s)) return ["home", `${nameOf(s, h)} is no friend of yours and keeps the ships in harbour`];
  const ya = yourArmy(s);
  if (ya?.siege && nodeDef(ya.siege)?.port && !friendly("syracuse", city(s, ya.siege).side)) return ["blockade", `your army besieges ${nodeName(ya.siege)}, a port`];
  if (s.island!.war && !carthageArmy(s)) return ["watch", "Carthage's army has yet to cross"];
  if (!s.island!.war) return ["escort", "there is no war, and the grain ships need guarding from pirates"];
  return ["watch", "Carthage's transports still cross with men and grain"];
}
// The sea threat: Carthage's fleet as strong as yours, and your army away from Syracuse (Diodorus 14.61.2).
function seaThreat(s: GameState) {
  const f = fleetState(s);
  const ya = yourArmy(s);
  const yours = fleetObeys(s) && !HOOKS.fleetAbroad?.(s) ? soundYours(s) : 0; // switch "libyaCrossing": the fleet is on Libya's beach
  const threat = s.island!.war && soundTheirs(s) >= Math.max(K.threatMin, yours) && !!ya && ya.at !== "syracuse";
  if (!threat) { f.threat = undefined; return; }
  if (f.threat !== undefined && f.threat < s.season) {
    const die = d6(s);
    log(s, { actor: "carthage", text: `${capital(carthageFleetName(s))} weighs whether to sail on Syracuse: rolled ${die}, sails on ${K.threatNeed} or more.`, why: "your army is away and its fleet is as strong as yours", visible: true, kind: "roll", roll: { die, mods: [], total: die, need: K.threatNeed, ok: die >= K.threatNeed } });
    if (die >= K.threatNeed) {
      f.threat = undefined;
      if (yours > 0 && !pendingScene(s)) return void openSea(s, "harbour", {});
      return raidHarbour(s, "no fleet of yours puts out to meet it");
    }
  }
  if (f.threat === undefined) {
    f.threat = s.season;
    log(s, { actor: "world", text: `${capital(carthageFleetName(s))} could be off Syracuse next season. Your army is away at ${nodeName(ya!.at)}.`, why: `"he ran the risk of losing the city if Magon should set out with his entire fleet against Syracuse" (Diodorus 14.61.2)`, visible: true, kind: "warning" });
  }
}
function raidHarbour(s: GameState, why: string) {
  grain(s, -K.raidGrain, "Carthage's fleet in the Great Harbour");
  mood(s, "citizens", -1, "Carthage's ships burn the shipyards while your army is away");
  event(s, "carthage", `${capital(carthageFleetName(s))} sails into the Great Harbour of Syracuse, burns ships in their sheds and takes the grain on the quays.`, `${why}; as Messana was taken from the sea while its men were away (Diodorus 14.57.1)`);
  count(s, "harbourRaids");
}

// ---------- Your orders (actions) ----------
export function setOrder(s: GameState, o: Order) {
  const f = fleetState(s);
  f.order = o; f.orderWhy = "your order"; f.dest = undefined;
  event(s, PLAYER, `You order the fleet: ${orderDef(o).name.toLowerCase()}.`, orderDef(o).text);
}
export function setRowers(s: GameState, r: FleetState["rowers"]) {
  const f = fleetState(s);
  if (r === f.rowers) return;
  f.rowers = r;
  if (r === "freed" && !(f as any).freedOnce) {
    (f as any).freedOnce = true;
    f.sq = Math.min(K.max, f.sq + K.freedAdd);
    mood(s, "rich", -1, "you freed the slaves to row the ships");
    event(s, PLAYER, `You free the slaves and man ${K.freedAdd} more squadrons with them: ${f.sq} now.`, "\"In Syracuse Dionysius set free the slaves and manned sixty ships from their numbers\" (Diodorus 14.58.1)");
  } else if (r === "freed") event(s, PLAYER, "The freed men take the benches again.", "they were freed once already");
  else event(s, PLAYER, r === "mercs" ? "Hired rowers take the benches: they cost silver, but the citizens stay unarmed." : "Citizens take the benches again: free, but armed.", r === "mercs" ? "half the ships were manned by hired men (Diodorus 14.43.4)" : "citizens rowed half the ships (Diodorus 14.43.4)");
}
// Build a squadron in the ship-sheds of the Great Harbour (14.42.5), at Carthage's price.
export function buildCheck(s: GameState): string | null {
  if (!fleetsOn(s)) return "the switch is off";
  if (fleetState(s).sq >= K.max) return `the fleet has ${K.max} squadrons, as many as the harbour can hold`;
  if (s.silver < K.buildCost) return `needs ${K.buildCost} silver`;
  return null;
}
export function buildSquadron(s: GameState) {
  const f = fleetState(s);
  silver(s, -K.buildCost, "timber, shipwrights and oars for a new squadron");
  f.sq += 1;
  event(s, PLAYER, `A new squadron is launched from the ship-sheds: the fleet has ${f.sq} now.`, "\"he began at one and the same time to build more than two hundred ships\" (Diodorus 14.42.5)");
}
// Carry the army from port to port: the crossing.
export function carryNeed(s: GameState) { const a = yourArmy(s); return a ? Math.ceil(a.men / K.carryPer) : 0; }
export function carryTargets(s: GameState) {
  const a = yourArmy(s);
  if (!a || !nodeDef(a.at)?.port) return [];
  return ports(s).filter((n) => n.id !== a.at).map((n) => ({ value: n.id, label: `${n.name} (${friendly("syracuse", city(s, n.id).side) ? "a friendly port" : "an enemy shore"})` }));
}
export function carryCheck(s: GameState): string | null {
  const a = yourArmy(s);
  if (!fleetsOn(s)) return "the switch is off";
  if (!a) return "you have no army in the field";
  if (a.moved === s.season) return "the army has marched this season";
  if (!nodeDef(a.at)?.port) return `${nodeName(a.at)} has no harbour`;
  if (isLibya(a.at)) return "the army is in Libya: sail home from a port there";
  if (!youOrder(s)) return `${capital(admiralName(s))} does not take your orders`;
  if (soundYours(s) < carryNeed(s)) return `the army needs ${carryNeed(s)} sound squadrons to carry it; the fleet has ${soundYours(s)}`;
  if (pendingScene(s)) return "a battle waits to be fought";
  return null;
}
export function carryArmy(s: GameState, dest: string) {
  const a = yourArmy(s)!;
  const f = fleetState(s);
  f.order = "carry"; f.orderWhy = "your order"; f.dest = dest;
  a.moved = s.season;
  const watching = s.island!.war && soundTheirs(s) > 0;
  if (watching) {
    const m: Mod[] = soundYours(s) > soundTheirs(s) ? [{ label: "your squadrons outnumber theirs", value: -1 }] : [];
    const die = d6(s), t = die + m.reduce((x, y) => x + y.value, 0);
    log(s, { actor: "carthage", text: `${capital(carthageFleetName(s))} watches the lane: rolled ${die}${m.map((x) => ` ${x.value} ${x.label}`).join("")} = ${t}, intercepts on ${K.laneNeed}.`, why: "an enemy fleet watching the lane intercepts the crossing", visible: true, kind: "roll", roll: { die, mods: m, total: t, need: K.laneNeed, ok: t >= K.laneNeed } });
    if (t >= K.laneNeed) return void openSea(s, "carry", { dest, army: a.id });
  }
  land(s, a, dest);
}
function land(s: GameState, a: Army, dest: string) {
  const from = a.at;
  if (a.siege) a.siege = undefined;
  a.at = dest;
  fleetState(s).dest = undefined;
  event(s, PLAYER, `${capital(fleetName(s))} carries ${armyName(s, a)} from ${nodeName(from)} to ${nodeName(dest)} in one season.`, "the army goes by sea");
  count(s, "crossings");
  arrive(s, a);
  HOOKS.landed?.(s, a, dest); // switch "libyaCrossing"
}
// Strike Carthage's fleet where it lies beached beside its army (Motya, 14.50.1; Syracuse, 14.73.2).
export function beachedAt(s: GameState): string | undefined {
  const ca = carthageArmy(s);
  return ca && nodeDef(ca.at)?.port && soundTheirs(s) > 0 && s.season - ca.since <= 1 ? ca.at : undefined;
}
export function strikeCheck(s: GameState): string | null {
  if (!fleetsOn(s)) return "the switch is off";
  if (!youOrder(s)) return `${capital(admiralName(s))} does not take your orders`;
  if (soundYours(s) <= 0) return "your fleet has no sound squadrons";
  if (!carthageArmy(s) || !nodeDef(carthageArmy(s)!.at)?.port) return "Carthage's fleet is not on the island's shore";
  if (pendingScene(s)) return "a battle waits to be fought";
  const struck = (s.flags as any).seaStruck as number | undefined;
  if (struck !== undefined && s.season - struck < 4) return "the fleet attacked this year already; the crews need the winter";
  return null;
}
export function strikeFleet(s: GameState) { (s.flags as any).seaStruck = s.season; openSea(s, "beached", { at: carthageArmy(s)!.at }); }

// ---------- The sea battle (a scene) ----------
type Ctx = "crossing" | "carry" | "harbour" | "beached";
function traitMods(s: GameState, side: "syracuse" | "carthage"): Mod[] {
  if (side === "carthage") return carthageAdmiral(s) ? [{ label: `${carthagePersonName(s, "magon")} commands, Carthage's admiral`, value: 1 }] : [];
  const h = admiral(s);
  if (!h || h === PLAYER) return [];
  const t = s.people[h]?.traits ?? [];
  let v = 0;
  if (t.includes("brave") || t.includes("bold")) v += 1;
  if (t.includes("shrewd") || t.includes("patient")) v += 1;
  v = Math.min(K.traitCap, v);
  return v ? [{ label: `${poss(capital(nameOf(s, h)))} seamanship`, value: v }] : [];
}
function where(s: GameState, ctx: Ctx, x: any): string {
  if (ctx === "harbour") return "syracuse";
  if (ctx === "beached") return x.at;
  if (ctx === "carry") return x.dest;
  const a = s.island!.armies.find((o) => o.id === x.army);
  return a?.at ?? "syracuse";
}
export function seaMods(s: GameState, ctx: Ctx, at: string, plan?: string): { mine: Mod[]; theirs: Mod[] } {
  const mine: Mod[] = [{ label: `${soundYours(s)} sound squadrons`, value: Math.floor(soundYours(s) / 2) }, ...traitMods(s, "syracuse")];
  const theirs: Mod[] = [{ label: `${soundTheirs(s)} sound squadrons`, value: Math.floor(soundTheirs(s) / 2) }, ...traitMods(s, "carthage")];
  if (yourArmy(s)?.at === at && ctx !== "carry") mine.push({ label: "your army stands on that shore", value: 1 });
  if (carthageArmy(s)?.at === at) theirs.push({ label: "its army stands on that shore", value: 1 });
  if (ctx === "beached") mine.push({ label: "their ships are caught on the beach", value: 2 });
  if (plan === "strike") mine.push({ label: "you strike ahead", value: 1 });
  return { mine, theirs };
}
const TITLE: Record<Ctx, string> = { crossing: "The battle at the crossing", carry: "The battle in the lane", harbour: "The battle off Syracuse", beached: "The fleet strikes the beach" };
function openSea(s: GameState, ctx: Ctx, x: any) {
  const at = where(s, ctx, x);
  const h = admiral(s);
  const bold = !!h && h !== PLAYER && (s.people[h]?.traits ?? []).some((t) => t === "bold" || t === "fiery");
  const R = FLEETS.rash;
  const turn = bold
    ? { id: "rash", text: R.text.replace("{admiral}", capital(nameOf(s, h!))), why: R.why, source: R.source, options: R.options }
    : { id: "plan", text: "How will the fleet fight?", why: "the admiral's one choice before the lines meet", source: "Diodorus 14.59.7, 14.60.2", options: FLEETS.plans.map((p: any) => ({ id: p.id, label: p.label, note: p.note })) };
  const sc = addScene(s, {
    kind: "sea", title: TITLE[ctx], art: "warship", faces: [h ?? PLAYER, ...(carthageAdmiral(s) ? ["carthage:magon"] : [])], beats: [], stage: "choose",
    at, turn, options: turn.options, ask: "Choose how the fleet fights.",
  });
  (sc as any).sea = { ctx, ...x };
  const lead: Record<Ctx, string> = {
    crossing: `${capital(fleetName(s))} catches Carthage's transports at sea, and ${carthageFleetName(s)} turns to fight for them.`,
    carry: `${capital(carthageFleetName(s))} bars the lane as ${fleetName(s)} carries your army to ${nodeName(x.dest)}.`,
    harbour: `${capital(carthageFleetName(s))} appears off Syracuse, and ${fleetName(s)} puts out to meet it.`,
    beached: `${capital(fleetName(s))} finds ${carthageFleetName(s)} drawn up on the beach at ${nodeName(at)}.`,
  };
  sc.beats.push(`${lead[ctx]} ${soundYours(s)} squadrons against ${soundTheirs(s)}.`);
  const m = seaMods(s, ctx, at);
  sc.plate = { mineName: capital(fleetName(s)), theirName: capital(carthageFleetName(s)), mine: m.mine, theirs: m.theirs };
  log(s, { actor: "world", text: `${TITLE[ctx]}: the fleets meet this season.`, why: lead[ctx], visible: true, kind: "warning" });
  count(s, "seaBattles");
}
const sumM = (m: Mod[]) => m.reduce((t, x) => t + x.value, 0);
function lose(s: GameState, side: "syracuse" | "carthage", n: number) {
  const f = fleetState(s);
  if (side === "syracuse") { n = Math.min(n, f.sq); f.sq -= n; f.damaged = Math.min(f.damaged, f.sq); return n; }
  const c = C(s); n = Math.min(n, c.ships); c.ships -= n; f.cDamaged = Math.min(f.cDamaged, c.ships); return n;
}
function prize(s: GameState, side: "syracuse" | "carthage") {
  const f = fleetState(s);
  if (side === "syracuse") { if (f.sq < K.max) { f.sq += 1; f.damaged += 1; return 1; } return 0; }
  const c = C(s); if (c.ships < K.max) { c.ships += 1; f.cDamaged += 1; return 1; } return 0;
}
HOOKS.seaFight = (s: GameState, pick?: string) => {
  const sc = pendingScene(s);
  if (!sc || sc.kind !== "sea" || sc.stage !== "choose") return;
  const x = (sc as any).sea as { ctx: Ctx; [k: string]: any };
  const h = admiral(s);
  let plan = pick ?? "close";
  sc.picks.turn = plan;
  if (sc.turn?.id === "rash" && plan === "close") {
    const die = d6(s);
    if (die <= K.rashDisobeys) { plan = "strike"; sc.beats.push(`You hold ${nameOf(s, h!)} to close order, but he goes ahead anyway with the best of the ships (rolled ${die}). "In no cowardly fashion, but without prudence" (Diodorus 14.60.2).`); }
    else sc.beats.push(`${capital(nameOf(s, h!))} keeps his place in the line (rolled ${die}).`);
  }
  const m = seaMods(s, x.ctx, sc.at!, plan);
  const dm = d6(s), dt = d6(s);
  const tm = dm + sumM(m.mine), tt = dt + sumM(m.theirs);
  let margin = tm - tt;
  if (margin === -1 && plan === "close") { margin = 0; sc.beats.push("Your line holds in close order: what would have been a defeat is a draw."); }
  sc.plate = { mineName: sc.plate!.mineName, theirName: sc.plate!.theirName, mine: m.mine, theirs: m.theirs, dieMine: dm, dieTheirs: dt, tMine: tm, tTheirs: tt };
  const won = margin > 0;
  sc.won = won;
  const hostile = (side: "syracuse" | "carthage") => !friendly(side, city(s, sc.at!).side);
  const f = fleetState(s);
  let mine = 0, theirs = 0, taken = 0;
  if (margin === 0) {
    if (f.damaged < f.sq) f.damaged += 1;
    if (f.cDamaged < C(s).ships) f.cDamaged += 1;
    sc.result = "A drawn fight at sea"; sc.good = true;
    sc.beats.push("The fleets part at dusk. Each side has a squadron too battered to fight again until it is mended.");
  } else {
    const loser = won ? "carthage" : "syracuse";
    const sound = loser === "carthage" ? soundTheirs(s) : soundYours(s);
    let n = Math.max(1, Math.ceil(sound / (hostile(loser) ? 2 : 3)));
    if (!won && plan === "strike") n = Math.min(Math.max(n, sound - 1), n * 2); // a rout, but a few ships flee to the open sea (14.60.4)
    if (x.ctx === "beached" && won) n += 1;
    if (won) { theirs = lose(s, "carthage", n); taken = prize(s, "syracuse"); }
    else { mine = lose(s, "syracuse", n); taken = prize(s, "carthage"); }
    sc.result = won ? (margin >= 4 ? "A great victory at sea" : "A victory at sea") : (!won && plan === "strike" ? "A rout at sea" : "A defeat at sea");
    sc.good = won;
    sc.beats.push(won ? `${capital(carthageFleetName(s))} loses ${theirs} ${theirs === 1 ? "squadron" : "squadrons"}${taken ? ", and one is towed home as a prize to be repaired (Diodorus 14.60.7)" : ""}.` : `${capital(fleetName(s))} loses ${mine} ${mine === 1 ? "squadron" : "squadrons"}${taken ? `, and ${carthageFleetName(s)} tows one away as a prize` : ""}.`);
  }
  log(s, { actor: h ?? PLAYER, text: `${sc.title}: rolled ${dm}, total ${tm}, against ${dt}, total ${tt}. ${sc.result}.`, why: "the fleets met", visible: true, kind: "roll", roll: { die: dm, mods: m.mine, total: tm, need: tt + 1, ok: won } });
  if (won) { f.won += 1; count(s, "seaWon"); } else if (margin < 0) { f.lost += 1; count(s, "seaLost"); }
  (sc as any).margin = margin;
  admiralAfter(s, won, margin);
  sc.stage = "after";
  sc.options = (won ? FLEETS.after.won : margin < 0 ? FLEETS.after.lost : FLEETS.after.won.slice(1)).map((o: any) => ({ id: o.id, label: o.label, note: o.note }));
  if (margin === 0) sc.options = [{ id: "home", label: "Row home", note: "Both fleets go home to mend." }];
  sc.ask = won ? "Chase them, or row home?" : margin < 0 ? "Fight on, or break off?" : "What now?";
};
HOOKS.seaAfter = (s: GameState, pick?: string) => {
  const sc = pendingScene(s);
  if (!sc || sc.kind !== "sea" || sc.stage !== "after") return;
  const x = (sc as any).sea as { ctx: Ctx; [k: string]: any };
  const margin = (sc as any).margin as number;
  const p = pick ?? "home";
  sc.picks.after = p;
  if (p === "chase" && margin > 0) {
    const die = d6(s);
    if (die >= K.chaseNeed) { const n = lose(s, "carthage", 1); sc.beats.push(`You chase them (rolled ${die}): ${n ? "one more squadron of theirs is taken" : "they have nothing left to take"}.`); }
    else { const f = fleetState(s); if (f.damaged < f.sq) f.damaged += 1; sc.beats.push(`You chase them (rolled ${die}), and one of your squadrons is battered in the chase.`); }
  } else if (p === "fight" && margin < 0) {
    const die = d6(s);
    if (die >= K.fightOnNeed) { const f = fleetState(s); if (f.sq < K.max) f.sq += 1; sc.beats.push(`You fight on (rolled ${die}) and save a squadron that was lost.`); }
    else { const n = lose(s, "syracuse", 1); sc.beats.push(`You fight on (rolled ${die}), and lose ${n ? "one more squadron" : "nothing more, for nothing is left"}.`); }
  } else sc.beats.push(margin < 0 ? "You break off and row for home." : "The fleet rows home.");
  // What the battle decided.
  const won = margin > 0;
  if (x.ctx === "crossing") {
    const a = s.island!.armies.find((o) => o.id === x.army);
    if (a && won) { loseMen(s, a, Math.ceil(a.men / 4), "transports sunk at sea"); sc.beats.push("With their escort beaten, the transports are sunk: a quarter of Carthage's army never reaches Sicily."); count(s, "intercepts"); }
  } else if (x.ctx === "carry") {
    const a = yourArmy(s);
    if (a) {
      if (won) { sc.beats.push(`The lane is open: the army lands at ${nodeName(x.dest)}.`); sc.stage = "done"; land(s, a, x.dest); }
      else if (margin < 0) { loseMen(s, a, Math.ceil(a.men / 4), "transports sunk in the lane"); sc.beats.push("Transports go down with the men aboard; the rest put back into harbour."); fleetState(s).dest = undefined; }
      else { sc.beats.push("The army puts back into harbour; it will try again."); fleetState(s).dest = undefined; }
    }
  } else if (x.ctx === "harbour") {
    if (won || margin === 0) { mood(s, "citizens", 1, "the fleet drove Carthage's ships from the harbour"); sc.beats.push("The city watched from the walls as Carthage's ships were driven off."); }
    else raidHarbour(s, "your fleet was beaten before the harbour");
  }
  sc.stage = "done";
  sc.mark = `${sc.title}: ${sc.result!.toLowerCase()}.`;
  if (fleetState(s).order === "carry") { fleetState(s).order = "watch"; fleetState(s).orderWhy = "back on watch after the crossing"; }
};
// The admiral as a rival: a victory won without you makes him (and armed citizens) bolder; a defeat costs him.
function admiralAfter(s: GameState, won: boolean, margin: number) {
  HOOKS.seaResult?.(s, won, margin); // switch "friendsAbroad": Sparta watches how its ships fare
  const h = admiral(s);
  const f = fleetState(s);
  if (!h) return;
  if (h === PLAYER) { if (won && f.rowers === "citizens") mood(s, "citizens", 1, "the citizens rowed and won with you at sea"); return; }
  const p = s.people[h];
  if (!p) return;
  if (won) {
    p.infl = (p.infl ?? 0) + 1;
    event(s, h, `${capital(p.name)} is the hero of the harbour. Men say he won without you.`, "\"without his presence, had won a victory\" (Diodorus 14.64.3)");
    if (f.rowers === "citizens") mood(s, "citizens", -1, "the citizens who rowed have weapons now, and won without you (Diodorus 14.64.4)");
  } else if (margin < 0) {
    p.infl = (p.infl ?? 0) - 1;
    event(s, h, `${capital(p.name)} comes home beaten from the sea.`, "the fleet lost");
    if (boardOn(s) && s.board) { dig(s, "fleet", -1, "the fleet was beaten at sea"); if (votedNow(s, "fleet")) vote(s, "fleet", "the fleet was beaten, and the assembly may give it to another"); }
  }
}
export const seaScenes = (s: GameState) => allScenes(s).filter((x) => x.kind === "sea");
void cityGrainChange;
