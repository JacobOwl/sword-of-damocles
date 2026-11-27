// Switch "friendsAbroad" (test 5, docs/council/2026-11-27-abroad.md Spec 2; card docs/research/powers-398.md):
// friends across the sea. Sparta, Corinth, Locri and the Italian Greek league are cards with a mood word and one wish;
// Rhegium is a town across the Strait, reached by sea. Five actions: send an envoy (a man of your court is away a
// season; help can be asked only where an envoy has been), offer a marriage (Locri or Rhegium), ask for help (ships, and
// Pharacidas, who once blocks a vote against you), give a gift, and recruit in Laconia. Sparta's help stays while its
// favour holds, and its favour must be kept with gifts (Pax Pamir: patrons' gifts are returned when loyalty changes).
// The league sleeps until you attack Rhegium or hold the Strait a year (Here I Stand: war on a minor power brings in
// its patron). Numbers: data/abroad.json. Inspired also by EU4's and Old World's envoys, CK3 marriage alliances, Rome II's
// call to arms and Imperator's mercenaries (all named in the council file).
import abroadJson from "../../data/abroad.json" with { type: "json" };
import { on } from "./switches.ts";
import { HOOKS } from "./hooks.ts";
import { d6 } from "./rng.ts";
import { PLAYER, capital, nameOf } from "./state.ts";
import { event, log, mood, silver, guardSet } from "./ops.ts";
import { ABROAD_NODES, city, friendly, loseMen, nodeName, yourArmy, setSide } from "./island.ts";
import { addScene } from "./scenes.ts";
import { fleetState, fleetsOn } from "./fleets.ts";
import type { GameState } from "./types.ts";

export const ABROAD = abroadJson as any;
const K = ABROAD.knobs;
export const abroadOn = (s: GameState) => on(s, "friendsAbroad") && !!s.island;
export const powerDef = (id: string) => ABROAD.powers.find((p: any) => p.id === id);
const helpDef = (id: string) => ABROAD.help.find((h: any) => h.id === id);
export interface Help { id: string; from: string; n: number; since: number; due?: number }
export interface AbroadState {
  mood: Record<string, number>; half: number; envoys: { pid: string; to: string; back: number }[]; at: Record<string, number>;
  help: Help[]; vetoUsed: boolean; married: Record<string, "yes" | "no">; lastGift: Record<string, number>; warned?: number; woke?: number; hold?: number; why?: string;
}
const count = (s: GameState, k: string, by = 1) => { s.counters[k] = (s.counters[k] ?? 0) + by; };
export function abroadState(s: GameState): AbroadState {
  const isl = s.island as any;
  if (!isl.abroad) {
    isl.abroad = { mood: Object.fromEntries(ABROAD.powers.map((p: any) => [p.id, p.start])), half: 0, envoys: [], at: {}, help: [], vetoUsed: false, married: {}, lastGift: {} };
    const r = ABROAD.rhegium;
    if (!isl.cities.rhegium) isl.cities.rhegium = { id: "rhegium", side: r.side, walls: r.walls, men: r.men, grain: r.grain, lean: r.lean, fear: 0, sacked: false, since: 0 };
  }
  return isl.abroad as AbroadState;
}
export const moodOf = (s: GameState, id: string) => abroadState(s).mood[id] ?? 0;
export const moodWordOf = (s: GameState, id: string) => powerDef(id).moods[Math.max(0, Math.min(powerDef(id).moods.length - 1, moodOf(s, id)))];
function moveMood(s: GameState, id: string, d: number, why: string) {
  const a = abroadState(s), def = powerDef(id);
  const before = a.mood[id];
  a.mood[id] = Math.max(0, Math.min(def.moods.length - 1, before + d));
  if (a.mood[id] !== before) log(s, { actor: "world", text: `${def.name} is now ${def.moods[a.mood[id]].toLowerCase()} toward you.`, why, visible: true, kind: "change" });
}
export const helpHere = (s: GameState, id: string) => abroadOn(s) && abroadState(s).help.some((h) => h.id === id && h.due === undefined);
export const pharacidasHere = (s: GameState) => helpHere(s, "spartanShips");
const envoyRecent = (s: GameState, id: string) => { const t = abroadState(s).at[id]; return t !== undefined && s.season - t <= K.envoyLasts; };

// ---------- Your actions ----------
export function envoyPowers(s: GameState) {
  return ABROAD.powers.filter((p: any) => p.id !== "league" || moodOf(s, "league") > 0).map((p: any) => ({ value: p.id, label: `${p.name} (${moodWordOf(s, p.id).toLowerCase()})` }));
}
export function envoyMen(s: GameState) {
  const away = new Set(abroadState(s).envoys.map((e) => e.pid));
  return Object.values(s.people).filter((p) => !p.player && p.status === "free" && p.opinion >= 0 && !away.has(p.id) && !p.where)
    .sort((a, b) => b.opinion - a.opinion || (a.id < b.id ? -1 : 1)).slice(0, 8).map((p) => ({ value: p.id, label: `${capital(p.name)}${p.traits.includes("silverTongued") || p.traits.includes("wellConnected") ? " (a good envoy)" : ""}` }));
}
export function sendEnvoyAbroad(s: GameState, to: string, pid: string) {
  const a = abroadState(s);
  a.envoys.push({ pid, to, back: s.season + K.envoySeasons });
  event(s, PLAYER, `${capital(nameOf(s, pid))} sails as your envoy to ${powerDef(to).name}. He will be away a season.`, `as Polyxenus was sent "to the Greeks in Italy and to the Lacedaemonians, as well as the Corinthians" (Diodorus 14.62.1)`);
  count(s, "abroadEnvoys");
}
export function marriageTargets(s: GameState) {
  const a = abroadState(s);
  return [["locri", "Locri"], ["rhegium", "Rhegium"]].filter(([id]) => !a.married[id]).map(([id, n]) => ({ value: id, label: n }));
}
export function offerMarriage(s: GameState, to: "locri" | "rhegium") {
  const a = abroadState(s);
  const die = d6(s);
  const mod = to === "locri" ? moodOf(s, "locri") + 1 : city(s, "rhegium").lean + 2;
  const ok = die + mod >= K.marriageNeed;
  log(s, { actor: PLAYER, text: `${to === "locri" ? "Locri" : "Rhegium"}'s assembly votes on your offer of marriage: rolled ${die} ${mod >= 0 ? "+" : "−"} ${Math.abs(mod)} = ${die + mod}, needs ${K.marriageNeed}.`, why: "a town's assembly decides a marriage with a tyrant", visible: true, kind: "roll", roll: { die, mods: [{ label: to === "locri" ? "Locri's mood" : "Rhegium's lean", value: mod }], total: die + mod, need: K.marriageNeed, ok } });
  a.married[to] = ok ? "yes" : "no";
  count(s, ok ? "marriagesYes" : "marriagesNo");
  if (to === "locri") {
    if (ok) {
      moveMood(s, "locri", 2, "a marriage with the tyrant of Syracuse");
      const d = s.people.doris;
      if (d && d.status === "absent" && d.enters > s.season + 1) d.enters = s.season + 1;
      event(s, PLAYER, "Locri's assembly agrees. A bride of Locri will sail to Syracuse.", "Locri approved the match, Doris, \"daughter of Xenetus\" (Diodorus 14.44.6)");
    } else { moveMood(s, "locri", -1, "Locri refused your offer"); event(s, PLAYER, "Locri's assembly refuses your offer.", "the vote went against you"); }
  } else if (ok) {
    city(s, "rhegium").lean = Math.min(3, city(s, "rhegium").lean + 2);
    event(s, PLAYER, "Against all expectation, Rhegium's assembly accepts your offer of marriage.", "the vote went your way (history went the other way: 14.44.5)");
  } else {
    city(s, "rhegium").lean = Math.max(-3, city(s, "rhegium").lean - 1);
    event(s, PLAYER, "Rhegium's assembly votes not to accept. The only maiden it will give you, it says, is the daughter of its public executioner.", "\"the Rhegians voted not to accept\" (Diodorus 14.44.5); the siege of Rhegium came \"because of the slight he had received in connection with his offer of marriage\" (14.106.1). the executioner's daughter is Diodorus' \"we are told\" (14.107.3)");
  }
}
export function helpCheck(s: GameState, from: string): string | null {
  const def = powerDef(from);
  if (!def || def.helpAt === undefined) return "only Sparta and Corinth send help";
  if (!envoyRecent(s, from)) return `send an envoy to ${def.name} first`;
  if (moodOf(s, from) < def.helpAt) return `${def.name} is only ${moodWordOf(s, from).toLowerCase()} toward you`;
  if (abroadState(s).help.some((h) => h.from === from && h.id !== "laconians")) return `${def.name}'s help is already given`;
  return null;
}
export function askHelp(s: GameState, from: "sparta" | "corinth") {
  const a = abroadState(s);
  const id = from === "sparta" ? "spartanShips" : "corinthShips";
  const n = from === "sparta" ? K.spartaShips : K.corinthShips;
  a.help.push({ id, from, n, since: s.season, due: s.season + 1 });
  event(s, PLAYER, `${powerDef(from).name} agrees to send ${from === "sparta" ? "ships under a Spartan admiral, Pharacidas" : "ships"}. They will come next season.`, helpDef(id).source);
  count(s, "abroadHelp");
}
export function giftTargets(s: GameState) {
  return [...ABROAD.powers.filter((p: any) => p.id !== "league" || moodOf(s, "league") > 0).map((p: any) => ({ value: p.id, label: `${p.name} (${moodWordOf(s, p.id).toLowerCase()})` })), { value: "messana", label: "Messana: land on its borders" }];
}
export function giveGift(s: GameState, to: string) {
  const a = abroadState(s);
  silver(s, -K.giftSilver, `a gift to ${to === "messana" ? "Messana" : powerDef(to).name}`);
  a.lastGift[to] = s.season;
  count(s, "abroadGifts");
  if (to === "messana") {
    const c = city(s, "messana");
    c.lean = Math.min(3, c.lean + 1);
    event(s, PLAYER, "You give Messana a large piece of land on its borders.", "\"He made a present to the Messenians of a large piece of territory on their borders, binding them to him by such a benefaction\" (Diodorus 14.44.4)");
    return;
  }
  if (to === "league") { moveMood(s, "league", -1, "your gifts buy friends in the league's council"); return; }
  moveMood(s, to, 1, "your gift");
}
export function recruitCheck(s: GameState): string | null {
  if (moodOf(s, "sparta") < powerDef("sparta").helpAt) return `Sparta is only ${moodWordOf(s, "sparta").toLowerCase()} toward you`;
  if (helpHere(s, "laconians")) return "the Lacedaemonian band is already in your pay";
  if (s.silver < K.bandCost) return `needs ${K.bandCost} silver`;
  return null;
}
export function recruitLaconia(s: GameState) {
  silver(s, -K.bandCost, "the Lacedaemonian band's first pay");
  guardSet(s, "strength", K.bandGuard, "a band of Lacedaemonian mercenaries joins the guard");
  abroadState(s).help.push({ id: "laconians", from: "sparta", n: K.bandGuard, since: s.season });
  event(s, PLAYER, "A band of Lacedaemonian mercenaries lands and joins your guard. They serve while Sparta is your friend.", helpDef("laconians").source);
  count(s, "abroadRecruits");
}

// ---------- Each season (carthage.ts carthageStep) ----------
export function abroadSeason(s: GameState) {
  if (!abroadOn(s)) return;
  const a = abroadState(s);
  // Envoys come home with an answer.
  for (const e of a.envoys.filter((x) => x.back <= s.season)) {
    a.envoys = a.envoys.filter((x) => x !== e);
    const p = s.people[e.pid];
    const def = powerDef(e.to);
    if (!p || p.status !== "free") continue;
    const m = (p.traits.includes("silverTongued") ? 1 : 0) + (p.traits.includes("wellConnected") ? 1 : 0);
    const die = d6(s);
    const ok = die + m >= K.envoyNeed;
    a.at[e.to] = s.season;
    log(s, { actor: e.pid, text: `${capital(p.name)} comes back from ${def.name}: rolled ${die}${m ? ` + ${m} his gifts as an envoy` : ""}, needs ${K.envoyNeed}. ${ok ? "He brings a warmer answer." : "He was heard politely and sent home."}`, why: "the envoy's reply", visible: true, kind: "roll", roll: { die, mods: m ? [{ label: "his gifts as an envoy", value: m }] : [], total: die + m, need: K.envoyNeed, ok } });
    if (ok && e.to !== "league") moveMood(s, e.to, 1, `${p.name}'s embassy`);
    if (ok && e.to === "league") moveMood(s, "league", -1, `${p.name} spoke for you in the league's council`);
  }
  // Help arrives.
  for (const h of a.help.filter((x) => x.due !== undefined && x.due <= s.season)) {
    h.due = undefined; h.since = s.season;
    if (fleetsOn(s)) fleetState(s).sq += h.n;
    event(s, PLAYER, h.id === "spartanShips" ? `Pharacidas the Spartan sails into the Great Harbour with ${h.n} squadrons. Your fleet has ${fleetsOn(s) ? fleetState(s).sq : "more ships"} now.` : `Corinth's ships arrive: ${h.n} ${h.n === 1 ? "squadron" : "squadrons"} more for your fleet.`, helpDef(h.id).source);
  }
  // Sparta's favour must be kept: each spring without a gift in the past year it cools a step (warned a season ahead).
  const lapsing = moodOf(s, "sparta") >= powerDef("sparta").helpAt && (a.lastGift.sparta ?? -99) < s.season - 3;
  if (s.season % 4 === 1 && lapsing && a.warned !== s.season) {
    a.warned = s.season;
    log(s, { actor: "world", text: `Sparta's favour cools: without a gift by spring, it will grow cooler toward you${a.help.some((h) => h.from === "sparta") ? ", and its ships and men will sail home" : ""}.`, why: "a patron expects its friends to remember it", visible: true, kind: "warning" });
  }
  if (s.season % 4 === 2 && lapsing) moveMood(s, "sparta", -1, "no gift from Syracuse this year");
  // Help leaves when favour drops.
  for (const h of a.help.filter((x) => x.due === undefined && moodOf(s, x.from) < powerDef(x.from).helpAt)) {
    a.help = a.help.filter((x) => x !== h);
    if (h.id === "laconians") guardSet(s, "strength", -Math.min(h.n, s.guard.strength), "the Lacedaemonian band goes home");
    else if (fleetsOn(s)) { const f = fleetState(s); f.sq = Math.max(0, f.sq - h.n); f.damaged = Math.min(f.damaged, f.sq); }
    event(s, PLAYER, `${capital(helpDef(h.id).name)} ${h.id === "laconians" ? "go" : "sail"} home: ${powerDef(h.from).name} is no longer your friend.`, "help from a patron lasts while its favour does");
    count(s, "abroadHelpLeft");
  }
  leagueSeason(s);
}
// The league: asleep until you attack Rhegium or hold the Strait a year; then the cities of Italy aid each other.
function leagueSeason(s: GameState) {
  const a = abroadState(s);
  const r = city(s, "rhegium");
  const ya = yourArmy(s);
  const yoursR = friendly("syracuse", r.side), yoursM = friendly("syracuse", city(s, "messana").side);
  if (yoursR && yoursM) a.hold ??= s.season; else a.hold = undefined;
  const attacked = !!ya && (ya.at === "rhegium" || ya.siege === "rhegium");
  const held = a.hold !== undefined && s.season - a.hold >= K.leagueHoldSeasons;
  const lv = moodOf(s, "league");
  if (lv === 0 && (attacked || held)) {
    a.woke = s.season;
    moveMood(s, "league", 1, attacked ? "you attacked Rhegium" : "you have held both sides of the Strait a year");
    event(s, "world", "The Greek cities of Italy send to one another. If you press on, they will league against you, and come to Rhegium's aid next season.", "they \"formed an alliance among themselves and established a Council\" (Diodorus 14.91.1)");
    count(s, "leagueWoke");
    return;
  }
  if (lv === 1 && a.woke !== undefined && s.season - a.woke >= K.leagueWarnSeasons && (attacked || held)) {
    moveMood(s, "league", 1, "the cities of Italy have sworn to aid each other");
    event(s, "world", "The Italian Greek league is sworn: if any city's land is plundered, all will come to its aid.", "\"if any city's territory was being plundered ... they should all come to its aid\" (Diodorus 14.101.1)");
    count(s, "leagueSworn");
    return;
  }
  if (lv < 2) return;
  // Leagued: the second front.
  if (ya && ya.siege === "rhegium") {
    loseMen(s, ya, 1, "the league's men break into the siege lines at Rhegium");
    r.grain = Math.min(10, r.grain + 2);
    event(s, "world", "The league's ships run grain into Rhegium, and its men sally against your lines.", "the league's mutual aid (Diodorus 14.101.1)");
  } else if (yoursR && ya?.at !== "rhegium") {
    const die = d6(s);
    log(s, { actor: "world", text: `The league moves to free Rhegium: rolled ${die}, frees it on 4 or more.`, why: "you hold Rhegium and no army of yours is there", visible: true, kind: "roll", roll: { die, mods: [], total: die, need: 4, ok: die >= 4 } });
    if (die >= 4) { setSide(s, "rhegium", "free", "the Italian league frees Rhegium"); r.lean = -2; count(s, "leagueFreed"); }
  }
  if (s.season % 4 === 2) { const m = city(s, "messana"); m.lean = Math.max(-3, m.lean - 1); log(s, { actor: "world", text: "The league's envoys work on Messana across the Strait.", why: "the Italian league wants the Strait free of you", visible: true, kind: "change" }); }
}

// ---------- Hooks ----------
// Herman's rule: a defeat with Spartan ships in your fleet costs Sparta's favour a step; two wins raise it a step.
HOOKS.seaResult = (s: GameState, won: boolean, margin: number) => {
  if (!abroadOn(s) || !pharacidasHere(s)) return;
  const a = abroadState(s);
  if (margin < 0) moveMood(s, "sparta", -1, "Spartan ships were beaten under your command");
  else if (won) { a.half += 1; if (a.half >= 2) { a.half = 0; moveMood(s, "sparta", 1, "Spartan ships shared your victories"); } }
};
// Pharacidas' veto: once, when the assembly would take a seat from you, he speaks for you and the vote fails.
HOOKS.veto = (s: GameState, seat: string, seatName: string): boolean => {
  if (!abroadOn(s) || !pharacidasHere(s)) return false;
  const a = abroadState(s);
  if (a.vetoUsed) return false;
  a.vetoUsed = true;
  mood(s, "citizens", -K.vetoCitizens, "a Spartan blocked the assembly's free vote");
  event(s, PLAYER, `The assembly is about to take ${seatName} from you when Pharacidas the Spartan rises and speaks for you. The vote fails. The citizens will not forget it.`, "the Spartan admiral was sent \"not to overthrow the rule of Dionysius\" (Diodorus 14.70.2); the Syracusans remembered how a Spartan \"at the time that he was asserting the right of the Syracusans to freedom, had betrayed them\" (14.70.3)");
  const sc = addScene(s, { kind: "debate", title: "The Spartan speaks", art: "assembly", faces: [PLAYER], beats: [], result: "The vote fails", good: true });
  sc.beats.push(`The assembly met to vote on ${seatName}, and the count was against you.`);
  sc.beats.push("Pharacidas the Spartan, whose ships lie in the harbour, rose and spoke for you. No one would cross Sparta.");
  sc.beats.push(`You keep ${seatName}. The citizens grumble that Sparta came to free them and stayed to guard their master.`);
  sc.mark = `The Spartan Pharacidas blocked the assembly's vote on ${seatName}.`;
  count(s, "vetoes");
  return true;
};
HOOKS.abroadStart = (s: GameState) => { if (abroadOn(s)) abroadState(s); };
export const abroadNodes = () => ABROAD_NODES;
void nodeName;
