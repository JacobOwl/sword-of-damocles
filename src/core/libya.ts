// Switch "libyaCrossing" (test 5, docs/council/2026-11-27-abroad.md Spec 3; card docs/research/libya-what-if.md):
// a what-if. Carry the war to Libya, as Agathocles did in 310 and no one did in this decade. The army sails from
// Syracuse with the fleet (thread 47's crossing: Carthage's fleet may fight in the lane), lands at the Quarries and
// chooses to beach or burn the ships; lives off the farmland; Libyan towns come over from fear or hatred and fall
// away when the army marches off (Hannibal & Hamilcar 19.4); Carthage's council must answer (recall its army from
// Sicily, arm its citizens, or strike Syracuse while you are away); Carthage can be besieged but never stormed; and
// you come home with the fleet, or slip away alone (20.69.3). Places and numbers: data/libya.json.
// Inspired also by Nevsky (ships per load), Republic of Rome (no landing without fleets), Total War: Rome II
// (fragile transports), EU4 (wear beyond supply), Oath (the keeper you leave behind).
import libyaJson from "../../data/libya.json" with { type: "json" };
import { on } from "./switches.ts";
import { HOOKS } from "./hooks.ts";
import { d6 } from "./rng.ts";
import { PLAYER, capital, nameOf } from "./state.ts";
import { event, log, silver } from "./ops.ts";
import { LIBYA_NODES, arrive, bloc, carthageArmy, city, destroy, loseMen, menWords, nodeName, setSide, yourArmy, carthagePersonName } from "./island.ts";
import { addScene, allScenes, pendingScene } from "./scenes.ts";
import { carryArmy, carryNeed, fleetState, fleetsOn, soundTheirs, soundYours, youOrder, admiralName } from "./fleets.ts";
import { card, weary } from "./war.ts";
import type { Army, GameState, Mod } from "./types.ts";

export const LIBYA = libyaJson as any;
const K = LIBYA.knobs;
export const libyaOn = (s: GameState) => on(s, "libyaCrossing") && !!s.island;
const placeDef = (id: string) => LIBYA.places.find((p: any) => p.id === id);
export const inLibya = (id?: string) => !!id && LIBYA.places.some((p: any) => p.id === id);
export interface LibyaState { landed?: number; burnt?: boolean; vow?: "vow" | "regret"; answered?: number; answer?: string; foe?: { men: number; due: number }; won?: number; plundered?: number; held: string[]; aelymas?: boolean; aelymasGone?: boolean; fought?: boolean; crossings: number }
const count = (s: GameState, k: string, by = 1) => { s.counters[k] = (s.counters[k] ?? 0) + by; };
export function libyaState(s: GameState): LibyaState { return ((s.island as any).libya ??= { held: [], crossings: 0 }) as LibyaState; }
function ensurePlaces(s: GameState) {
  const cs = s.island!.cities as any;
  for (const p of LIBYA.places) if (!cs[p.id]) cs[p.id] = { id: p.id, side: p.side, walls: p.walls, men: p.men, grain: p.grain, lean: p.lean, fear: 0, sacked: false, since: 0 };
}
export const armyInLibya = (s: GameState) => { const a = yourArmy(s); return a && inLibya(a.at) ? a : undefined; };
const lowFirst = (x: string) => x[0].toLowerCase() + x.slice(1);
const blocName = (id: string) => (id === "elders" ? "the Elders" : id === "people" ? "the people of Carthage" : id === "hundred" ? "the Hundred" : "the Libyans");
const sum = (m: Mod[]) => m.reduce((t, x) => t + x.value, 0);

// ---------- Going ----------
export function crossCheck(s: GameState): string | null {
  if (!libyaOn(s)) return "the switch is off";
  if (!fleetsOn(s)) return "you need the fleet (switch \"A small navy\")";
  const a = yourArmy(s);
  if (!a) return "you have no army in the field";
  if (inLibya(a.at)) return "the army is in Libya already";
  if (a.at !== "syracuse") return "the army must sail from Syracuse";
  if (a.moved === s.season) return "the army has marched this season";
  if (!s.island!.war) return "you are not at war with Carthage";
  if (a.food < 2) return "the army needs two seasons of food in its ships";
  if (!youOrder(s)) return `${capital(admiralName(s))} holds the fleet and does not take your orders`;
  if (soundYours(s) < carryNeed(s)) return `the army needs ${carryNeed(s)} sound squadrons; the fleet has ${soundYours(s)}`;
  if (a.commander === PLAYER && !s.campaign?.keeper) return "name a keeper for Syracuse first (lead the army out with a keeper)";
  if (pendingScene(s)) return "a battle waits to be fought";
  return null;
}
export function crossToLibya(s: GameState) {
  ensurePlaces(s);
  const L = libyaState(s);
  L.crossings += 1;
  count(s, "libyaCrossings");
  const a = yourArmy(s)!;
  event(s, PLAYER, `Telling no one where, you put the army on the ships and sail south. ${LIBYA.whatIf}`, "\"Disclosing this intention to none of his friends\" (Diodorus 20.4.1)");
  void a;
  carryArmy(s, "quarries");
}
// fleets.ts land(): the army has come ashore somewhere.
HOOKS.landed = (s: GameState, a: Army, dest: string) => {
  if (!libyaOn(s) || a.side !== "syracuse") return;
  const L = libyaState(s);
  if (dest !== "quarries") { if (!inLibya(dest)) { L.held = []; L.vow = undefined; L.foe = undefined; } return; }
  L.landed = s.season; L.burnt = false; L.vow = undefined; L.answered = undefined; L.answer = undefined;
  const sc = addScene(s, { kind: "crisis", title: "The landing at the Quarries", art: "warship", faces: [a.commander], beats: [], good: true, result: "Ashore in Libya" });
  (sc as any).kicker = "In Libya, a what-if";
  sc.beats.push(`${a.commander === PLAYER ? "You bring" : `${capital(nameOf(s, a.commander))} brings`} ${menWords(a.men)} ashore at the Quarries and ${a.commander === PLAYER ? "build" : "builds"} a palisade from sea to sea, as Agathocles did (Diodorus 20.6.3).`);
  sc.beats.push("The ships lie on the beach. They are the army's only way home.");
  (sc as any).choices = LIBYA.landing.choices.map((o: any) => ({ id: o.id, label: o.label, note: o.note, action: "libyaLanding" }));
  (sc as any).open = true; (sc as any).settle = "libyaSettle";
  sc.ask = "Beach the ships, or burn them?";
  sc.mark = "Your army landed in Libya.";
};
export function libyaLanding(s: GameState, id: string, sceneId?: string) {
  const sc = sceneId ? allScenes(s).find((x) => x.id === sceneId) : allScenes(s).find((x) => x.title === "The landing at the Quarries" && (x as any).open);
  if (!sc || (sc as any).answered) return;
  (sc as any).answered = true; (sc as any).open = false;
  sc.picks.landing = id;
  const L = libyaState(s);
  count(s, `landing_${id}`);
  if (id === "burn") {
    const f = fleetState(s);
    const n = Math.min(f.sq, carryNeed(s));
    f.sq -= n; f.damaged = Math.min(f.damaged, f.sq);
    L.burnt = true; L.vow = "vow";
    sc.beats.push(`You burn ${n} ${n === 1 ? "squadron" : "squadrons"} on the beach. "In victory alone would they have hope of safety" (Diodorus 20.7.5).`);
    event(s, PLAYER, "You burn the ships on the beach of Libya. There is no way home but victory.", "as Agathocles did (Diodorus 20.7.1 to 20.7.5)");
  } else sc.beats.push("The ships stay on the beach, guarded by a few men. Carthage's fleet may come for them.");
}
// crises.ts settleChoices: an unanswered landing keeps the ships on the beach.
HOOKS.libyaSettle = (s: GameState, sc: any) => libyaLanding(s, "beach", sc.id);
export const landingOpen = (s: GameState) => allScenes(s).find((x) => (x as any).settle === "libyaSettle" && (x as any).open && !(x as any).answered);
// fleets.ts: is the fleet away in Libya (so Syracuse's harbour is bare)?
HOOKS.fleetAbroad = (s: GameState) => libyaOn(s) && !!armyInLibya(s) && !libyaState(s).burnt;

// ---------- In Libya (actions) ----------
export function marchTargets(s: GameState) {
  const a = armyInLibya(s);
  if (!a) return [];
  return (placeDef(a.at).next as string[]).map((id) => ({ value: id, label: `${placeDef(id).name} (${city(s, id).side === "syracuse" ? "yours" : city(s, id).sacked ? "razed" : "Carthage's"})` }));
}
export function marchCheck(s: GameState): string | null {
  const a = armyInLibya(s);
  if (!a) return "your army is not in Libya";
  if (a.moved === s.season) return "the army has marched this season";
  if (pendingScene(s)) return "a battle waits to be fought";
  return null;
}
export function marchInLibya(s: GameState, to: string) {
  const a = armyInLibya(s)!;
  const from = a.at;
  a.moved = s.season; a.siege = undefined; a.at = to;
  event(s, PLAYER, `Your army marches from ${nodeName(from)} to ${nodeName(to)}.`, "the campaign in Libya");
  const c = city(s, to);
  if (c.side !== "carthage" || to === "carthago") return arrive(s, a);
  // A Libyan town may come over from fear or hatred (20.17.1).
  const m: Mod[] = [{ label: "the Libyans hate Carthage", value: K.hate }];
  if (c.fear) m.push({ label: "fear of you", value: c.fear });
  if (a.men >= 2 * c.men) m.push({ label: "your army is twice its men", value: 1 });
  if (c.walls) m.push({ label: "its walls", value: -c.walls });
  const die = d6(s), t = die + sum(m);
  log(s, { actor: "world", text: `${nodeName(to)} weighs whether to come over: rolled ${die}${m.map((x) => ` ${x.value >= 0 ? "+" : "−"}${Math.abs(x.value)} ${x.label}`).join("")} = ${t}, needs ${K.overNeed}.`, why: "\"some of the cities ... because of fear, others because of their hatred for the Carthaginians\" (Diodorus 20.17.1)", visible: true, kind: "roll", roll: { die, mods: m, total: t, need: K.overNeed, ok: t >= K.overNeed } });
  if (t >= K.overNeed) { setSide(s, to, "syracuse", "it came over to your army"); count(s, "libyaTownsOver"); }
  else arrive(s, a);
}
export function plunderCheck(s: GameState): string | null {
  const a = armyInLibya(s);
  if (!a) return "your army is not in Libya";
  if (a.at === "quarries" || a.at === "carthago") return "there is nothing to plunder here";
  if (city(s, a.at).side === "syracuse") return `${nodeName(a.at)} is yours: plunder an enemy's land`;
  if (libyaState(s).plundered === s.season) return "the army has plundered this season";
  return null;
}
export function plunder(s: GameState) {
  const a = armyInLibya(s)!;
  const c = city(s, a.at);
  const L = libyaState(s);
  L.plundered = s.season;
  a.food = Math.min(4, a.food + K.plunderFood);
  silver(s, K.plunderSilver, `booty from the farmland of ${nodeName(a.at)}`);
  c.fear = Math.min(3, c.fear + 1); c.lean = Math.max(-3, c.lean - 1);
  event(s, PLAYER, `Your army plunders the villas and gardens about ${nodeName(a.at)} and loads itself with booty.`, "\"he at a single stroke loaded his army with booty\" (Diodorus 20.8.6)");
  count(s, "libyaPlunders");
}
export function razeCheck(s: GameState): string | null {
  const a = armyInLibya(s);
  if (!a) return "your army is not in Libya";
  if (city(s, a.at).side !== "syracuse" || a.at === "quarries") return "raze a town you hold";
  return null;
}
export function raze(s: GameState) {
  const a = armyInLibya(s)!;
  const c = city(s, a.at);
  silver(s, 3, `the plunder of ${nodeName(a.at)}`);
  c.side = "free"; c.sacked = true; c.men = 0; c.walls = 0; c.grain = 0;
  libyaState(s).held = libyaState(s).held.filter((x) => x !== a.at);
  event(s, PLAYER, `You raze ${nodeName(a.at)} rather than garrison it, and leave no place of refuge behind you.`, "he \"destroyed the cities and camped in the open\" (Diodorus 20.8.7)");
  count(s, "libyaRazed");
}
// Home: with the fleet, if it is not burnt; or alone.
export function homeCheck(s: GameState): string | null {
  const a = armyInLibya(s);
  if (!a) return "your army is not in Libya";
  if (a.moved === s.season) return "the army has marched this season";
  if (!placeDef(a.at).port) return `${nodeName(a.at)} has no harbour`;
  if (pendingScene(s)) return "a battle waits to be fought";
  if (soundYours(s) < carryNeed(s)) return libyaState(s).burnt ? "you burnt the ships: take a port town to build new ones, or slip away alone" : `the army needs ${carryNeed(s)} sound squadrons`;
  return null;
}
export function sailHome(s: GameState) { event(s, PLAYER, "The army goes down to the ships to sail home to Syracuse.", "the campaign in Libya ends"); count(s, "libyaHome"); carryArmy(s, "syracuse"); }
export function slipAway(s: GameState) {
  const a = armyInLibya(s)!;
  count(s, "libyaSlipped");
  event(s, PLAYER, "You take ship by night with a few followers and slip away to Syracuse, leaving the army in Libya.", "\"he embarked on the transport with a few followers and secretly sailed away\" (Diodorus 20.69.3)");
  const sc = addScene(s, { kind: "crisis", title: "The night you left the army", art: "mourning", faces: [], beats: ["You sail away in winter with a few friends. The army wakes to find you gone.", "Agathocles \"abandoned his sons, whom the soldiers among other things slew when they learned of his escape\" (Diodorus 20.69.3). The men you left make their own peace with Carthage."], good: false, result: "You live; the army is gone" });
  (sc as any).kicker = "In Libya, a what-if";
  sc.mark = "You slipped away from Libya and left the army behind.";
  destroy(s, a, "you left it in Libya and it made its own peace with Carthage");
}

// ---------- Each season (carthage.ts carthageStep) ----------
export function libyaSeason(s: GameState) {
  if (!libyaOn(s) || !s.island!.cities.quarries) return;
  const L = libyaState(s);
  const a = armyInLibya(s);
  const c = s.island!.carthage;
  if (!a) {
    for (const id of L.held) if (city(s, id).side === "syracuse") setSide(s, id, "carthage", "your army has left Libya");
    L.held = []; L.foe = undefined;
    return;
  }
  // Carthage the city: never stormed, never starved (its sea is open).
  city(s, "carthago").grain = 10;
  if (a.siege === "carthago") {
    if (card(s)) weary(s, "carthage", K.siegeWeary, "Carthage itself is besieged and its refugees go hungry (Diodorus 20.59.2)");
    bloc(s, "elders", -1, "Carthage itself is besieged");
  }
  // Towns held only while the army is near; newly held towns stir the Libyans.
  const near = new Set([a.at, ...(placeDef(a.at).next as string[])]);
  for (const p of LIBYA.places) {
    if (p.id === "quarries" || p.id === "carthago") continue;
    const yours = city(s, p.id).side === "syracuse";
    if (yours && !L.held.includes(p.id)) { L.held.push(p.id); bloc(s, "libyans", -1, `${p.name} went over to you`); }
    if (yours && !near.has(p.id)) { setSide(s, p.id, "carthage", "your army marched away, and Carthage's friends took it back"); L.held = L.held.filter((x) => x !== p.id); count(s, "libyaFellAway"); }
  }
  // Burnt ships are rebuilt only in a port town you hold.
  if (L.burnt) for (const id of L.held) if (placeDef(id).port) { fleetState(s).sq += K.portShips; log(s, { actor: PLAYER, text: `The shipwrights of ${nodeName(id)} build you a squadron.`, why: "a port town you hold in Libya", visible: true, kind: "change" }); }
  // A beached fleet is a target (Motya, 14.50.1).
  if (!L.burnt && soundTheirs(s) > 0 && fleetState(s).sq > 0) {
    const die = d6(s);
    if (die >= K.beachRisk) { fleetState(s).sq -= 1; event(s, "carthage", "Carthage's ships fall on your fleet on the beach of Libya and burn a squadron.", `ships drawn up on the beach are easy prey (rolled ${die})`); }
  }
  // The vow, then the regret (20.7.5, 20.8.1).
  if (L.burnt && L.vow === "vow" && L.landed !== undefined && s.season - L.landed >= 1 && !((L.won ?? -1) >= L.landed || (L.plundered ?? -1) >= L.landed)) {
    L.vow = "regret";
    event(s, PLAYER, "With the ships ash on the beach, the soldiers look at the sea between them and home, and lose heart.", "\"they considered the vastness of the sea\" (Diodorus 20.8.1)");
  }
  // The Libyans in revolt join you (Aelymas, 20.18.3).
  if (c.revolt && !L.aelymas && !L.aelymasGone) { L.aelymas = true; a.men += 1; event(s, PLAYER, "Aelymas, a king of the Libyans, joins your army with his men. They hate Carthage, and will leave you if you lose.", "Aelymas joined Agathocles and later deserted him (Diodorus 20.18.3)"); }
  // Carthage's answer, the season after you land.
  // Carthage's answer: when the army comes near the city, or two seasons after the landing.
  if (L.landed !== undefined && L.answered === undefined && s.season > L.landed && (NEAR.includes(a.at) || s.season - L.landed >= 2)) answer(s);
  // The citizens' army marches out.
  if (L.foe && L.foe.due <= s.season) libyaBattle(s, a);
}
const NEAR = ["tunis", "utica", "carthago"];
function answer(s: GameState) {
  const L = libyaState(s);
  const k = s.island!.carthage;
  const a = armyInLibya(s)!;
  L.answered = s.season;
  // Each answer is pressed by one bloc: its power, plus what the hour gives it. The strongest carries the council.
  const why = (x: any): Mod[] => {
    const m: Mod[] = [{ label: `the power of ${blocName(x.bloc)}`, value: k.blocs[x.bloc].power }];
    if (x.id === "recall") m.push({ label: "Carthage's army stands in Sicily", value: 2 });
    if (x.id === "arm" && NEAR.includes(a.at)) m.push({ label: "the enemy is in sight of the walls", value: 2 });
    if (x.id === "strike" && HOOKS.fleetAbroad?.(s)) m.push({ label: "Syracuse's fleet is away on the beach of Libya", value: 1 });
    if (x.id === "strike" && !carthageArmy(s)) m.push({ label: "no army of Carthage stands in Sicily to strike with", value: -2 });
    return m;
  };
  const opts = LIBYA.answers.filter((x: any) => x.id !== "recall" || !!carthageArmy(s)).map((x: any) => ({ x, m: why(x), t: sum(why(x)) }));
  opts.sort((p: any, q: any) => q.t - p.t || (p.x.id < q.x.id ? -1 : 1));
  const best = opts[0].x;
  L.answer = best.id;
  const speakers = opts.map((o: any) => ({ face: "", name: capital(blocName(o.x.bloc)), stance: `${lowFirst(o.x.name)} (${o.m.map((y: Mod) => `${y.value >= 0 ? "+" : "−"}${Math.abs(y.value)} ${y.label}`).join(", ")}: ${o.t})`, line: o.x.line }));
  const sc = addScene(s, { kind: "council", title: "Carthage answers the invasion", art: "debate", faces: [], beats: ["An enemy army stands in Libya. Carthage's council meets in fear."], speakers, result: best.name, good: best.id !== "strike" });
  sc.beats.push(`The strongest voice carries it: ${lowFirst(best.name)}.`);
  sc.mark = `Carthage answered your landing in Libya: ${lowFirst(best.name)}.`;
  count(s, `libyaAnswer_${best.id}`);
  if (best.id === "recall") {
    const ca = carthageArmy(s)!;
    s.island!.armies = s.island!.armies.filter((x) => x !== ca);
    k.mercs += Math.ceil(ca.men / 2);
    const g = k.people[ca.commander]; if (g) g.status = "free";
    event(s, "carthage", `${capital(carthagePersonName(s, ca.commander))}'s army is recalled from Sicily to defend Carthage. It sails home.`, best.source);
    L.foe = { men: Math.ceil(ca.men / 2) + 2, due: s.season + 1 };
  } else if (best.id === "arm") {
    L.foe = { men: K.citizens, due: s.season + K.citizensDue };
    event(s, "carthage", "Carthage arms its own citizens and marches them out against your army.", best.source);
  } else {
    k.goal = "war"; k.goalWhy = "strike Syracuse while its ruler's army is in Libya";
    s.clock = Math.min(10, s.clock + 2);
    event(s, "carthage", "Carthage leaves your army in Libya and turns on Syracuse while you are away.", "the Hundred's counsel");
  }
}
function libyaBattle(s: GameState, a: Army) {
  const L = libyaState(s);
  const foe = L.foe!;
  const mine: Mod[] = [{ label: "its strength", value: Math.floor(a.men / 2) }];
  if (L.vow === "vow") mine.push({ label: "they burnt the ships: victory or nothing", value: 1 });
  if (L.vow === "regret") mine.push({ label: "they look at the sea and lose heart", value: -1 });
  if (L.aelymas) mine.push({ label: "Aelymas' Libyans", value: 1 });
  const theirs: Mod[] = [{ label: "its strength", value: Math.floor(foe.men / 2) }, { label: "fighting for their own city", value: 1 }];
  if (!L.fought) theirs.push({ label: "two generals with an inherited feud (Diodorus 20.10.1)", value: -1 });
  L.fought = true;
  const dm = d6(s), dt = d6(s), tm = dm + sum(mine), tt = dt + sum(theirs);
  const won = tm > tt, draw = tm === tt;
  const sc = addScene(s, { kind: "report", title: "The battle before Carthage", art: won ? "trophy" : draw ? "camp" : "mourning", faces: [a.commander], beats: [`Carthage's citizens, ${menWords(foe.men)}, march out against ${menWords(a.men)} of yours.`], good: won, result: won ? "A victory in Libya" : draw ? "A bloody draw" : "A defeat in Libya" });
  sc.plate = { mineName: "Your army", theirName: "Carthage's citizens", mine, theirs, dieMine: dm, dieTheirs: dt, tMine: tm, tTheirs: tt };
  count(s, won ? "libyaBattlesWon" : "libyaBattlesLost");
  if (won) {
    foe.men -= Math.max(1, Math.ceil(foe.men / 2));
    L.won = s.season; if (L.vow === "regret") L.vow = "vow";
    if (card(s)) weary(s, "carthage", 2, "its citizens were beaten before its walls");
    sc.beats.push(foe.men > 0 ? "They fall back behind the walls of Carthage." : "Carthage's citizen army is destroyed. Its council swears never again to risk its citizens in the field.");
    if (foe.men <= 0) L.foe = undefined; else foe.due = s.season + 2;
  } else if (draw) {
    foe.men = Math.max(0, foe.men - 1); loseMen(s, a, 1, "the bloody draw before Carthage");
    sc.beats.push("Both sides draw off to bury their dead.");
    foe.due = s.season + 2;
  } else {
    if (L.aelymas) { L.aelymas = false; L.aelymasGone = true; loseMen(s, a, 1, "Aelymas and his Libyans desert you"); sc.beats.push("Aelymas and his Libyans desert you (Diodorus 20.18.3)."); }
    if (yourArmy(s) === a) loseMen(s, a, Math.ceil(a.men / 3), "beaten before Carthage");
    sc.beats.push("Your army falls back on its camp.");
    foe.due = s.season + 2;
  }
  sc.mark = `${sc.title}: ${sc.result!.toLowerCase()}.`;
}
