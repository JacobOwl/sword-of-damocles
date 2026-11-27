// Switch "warFocus": the war and geopolitics focus, stage 1 (council of 2026-11-27,
// docs/council/2026-11-27-war-and-geopolitics.md). A war becomes an object: why it began, each side's aim, a short
// ledger of named events, weariness on both sides, and a peace with terms. Carthage's landings are announced a season
// ahead, a revolt in Libya pauses the war but owes a return, and holding much of the island unites Carthage's council.
// Every change still goes through island.ts, carthage.ts or ops.ts, so it is logged with its reason. Numbers: data/war.json.
import warJson from "../../data/war.json" with { type: "json" };
import { on } from "./switches.ts";
import { log, event, clock, mood, silver } from "./ops.ts";
import { PLAYER, capital, seasonName } from "./state.ts";
import { CARTHAGE, ISLAND, NODES, carthageArmy, carthagePersonName, city, menWords, nodeDef, nodeName, setSide, yourArmy } from "./island.ts";
import type { GameState, Side } from "./types.ts";
import { patience } from "./supply.ts";

export const WAR = warJson as any;
const K = WAR.knobs;
export const warOn = (s: GameState) => on(s, "warFocus") && !!s.island;

export interface WarEntry { season: number; side: "syracuse" | "carthage"; text: string; weight: number; town?: string; kind: string }
export interface Terms { towns: { id: string; to: Side }[]; silver?: { payer: "syracuse" | "carthage"; amount: number }; lines: string[] }
export interface WarCard {
  since: number;
  why: string; // the council's reason, or "you declared war"
  causes: string[]; // the last few things that raised Carthage's anger
  carthageAim: string;
  yourAim?: string;
  aimsMet: string[]; // "syracuse" / "carthage", once each
  ledger: WarEntry[];
  weary: { syracuse: number; carthage: number };
  crossed: number[]; // your weariness lines already passed
  noBattle: number; // seasons your army has been in the field at war without a battle
  terms?: Terms; termsFrom?: "carthage" | "syracuse"; termsSeason?: number;
  landingDue?: number; // the season Carthage's announced landing comes
  returnOwed?: boolean; // the war paused for a revolt in Libya; Carthage owes a return
  lastMatter?: number;
}
export interface PastWar { since: number; ended: number; name: string; chapter: string }

const SIDE_GROUP = (side: Side) => (side === "syracuse" || side === "ally" ? "syracuse" : side === "carthage" || side === "tributary" ? "carthage" : "none");
const other = (x: "syracuse" | "carthage") => (x === "syracuse" ? "carthage" : "syracuse");
export const card = (s: GameState): WarCard | undefined => (warOn(s) ? (s.island as any).warCard : undefined);
const aimDef = (side: "syracuse" | "carthage", id?: string) => (side === "carthage" ? WAR.carthageAims : WAR.yourAims).find((a: any) => a.id === id);

// ---------- Opening and closing a war ----------

export function openWar(s: GameState, why: string) {
  if (!warOn(s)) return;
  const isl = s.island as any;
  const lostTown = s.flags.punicLost !== undefined && s.season - s.flags.punicLost < 8;
  const lostTribute = s.flags.tributeLost !== undefined && s.season - s.flags.tributeLost < 8;
  const aim = lostTown || lostTribute ? "back" : s.clock >= 8 ? "break" : "tribute";
  // The causes: the last things that raised Carthage's anger, in the log's own words.
  const causes = s.log.filter((e) => e.kind === "change" && /^Carthage's anger rises/.test(e.text) && e.why && e.season > s.season - 8).slice(-3).map((e) => `${e.why} (${seasonName(e.season)})`);
  const c: WarCard = { since: s.season, why, causes, carthageAim: aim, aimsMet: [], ledger: [], weary: { syracuse: 0, carthage: 0 }, crossed: [], noBattle: 0 };
  isl.warCard = c;
  const a = aimDef("carthage", aim);
  event(s, "carthage", `Carthage's aim in this war: ${a.name}. ${a.text}`, why);
  fireMatter(s, "warAims", {});
}

export function closeWar(s: GameState, how: string) {
  const c = card(s);
  if (!c) return;
  const isl = s.island as any;
  const name = warName(s, c);
  const chapter = warChapter(s, c, how);
  (isl.pastWars ??= []).push({ since: c.since, ended: s.season, name, chapter } as PastWar);
  log(s, { actor: "world", text: `The war is over: ${name}. ${how}`, why: "the war has ended", visible: true, kind: "event" });
  isl.warCard = undefined;
}

function warName(s: GameState, c: WarCard): string {
  const first = c.ledger.slice().sort((a, b) => b.weight - a.weight || a.season - b.season)[0];
  return first?.town ? `the war of ${nodeName(first.town)}` : `the war of ${seasonName(c.since).split(" ").slice(-2, -1)[0]} BC`;
}

// The war told as one short chapter (Jacob: "shorten that down to the important stuff and good story arcs").
export function warChapter(s: GameState, c: WarCard, how: string): string {
  const k = s.island!.carthage;
  const aimC = aimDef("carthage", c.carthageAim);
  const aimY = aimDef("syracuse", c.yourAim);
  const turns = c.ledger.slice().sort((a, b) => b.weight - a.weight || a.season - b.season).slice(0, 4).sort((a, b) => a.season - b.season)
    .map((e) => `${capital(seasonName(e.season))}: ${e.text}`);
  const gens = CARTHAGE.people.filter((p: any) => k.people[p.id]?.record).map((p: any) => {
    const st = k.people[p.id];
    const fate = { free: "went home", command: "still commands", disgraced: "came home in disgrace", dead: "is dead" }[st.status as string] ?? "";
    return `${p.name} ${fate}`;
  });
  const parts = [
    `It began in ${seasonName(c.since)}${c.causes.length ? `, after ${c.causes.slice(-1)[0].replace(` (${seasonName(c.since)})`, "")}` : ""}.`,
    `Carthage fought to ${aimC.phrase}${aimY ? `; you, to ${aimY.phrase}` : ""}.`,
    turns.length ? `${turns.join(". ")}.` : "",
    gens.length ? `${gens.join("; ")}.` : "",
    how,
  ];
  return parts.filter(Boolean).join(" ").replace(/\.\./g, ".");
}

// ---------- The ledger ----------

export function warNote(s: GameState, side: "syracuse" | "carthage", kind: string, text: string, weight: number, town?: string) {
  const c = card(s);
  if (!c || !s.island!.war) return;
  c.ledger.push({ season: s.season, side, kind, text, weight, town });
}
// A town held longer counts for more (EU4's ticking score, from memory): 1, and 1 more each season held, up to the cap.
function entryWeight(s: GameState, e: WarEntry): number {
  if (e.kind !== "town" || !e.town) return e.weight;
  const held = SIDE_GROUP(city(s, e.town).side) === e.side && city(s, e.town).since === e.season;
  return e.weight + (held ? Math.min(K.ledgerWeights.townHeldMax, s.season - e.season) : 0);
}
export function balance(s: GameState): number {
  const c = card(s);
  if (!c) return 0;
  return c.ledger.reduce((t, e) => t + (e.side === "syracuse" ? 1 : -1) * entryWeight(s, e), 0);
}
export function ledgerLines(s: GameState, n = 6): { text: string; side: string; weight: number; season: number }[] {
  const c = card(s);
  if (!c) return [];
  return c.ledger.map((e) => ({ text: e.text, side: e.side, weight: entryWeight(s, e), season: e.season }))
    .sort((a, b) => b.season - a.season || b.weight - a.weight).slice(0, n);
}

// Hook from island.ts setSide: a town that changes hands in a war is a line in the ledger.
export function warTownChanged(s: GameState, id: string, before: Side, after: Side) {
  const c = card(s);
  if (!c || !s.island!.war || id === "syracuse") return;
  const g0 = SIDE_GROUP(before), g1 = SIDE_GROUP(after);
  if (g0 === g1) return;
  if (g1 !== "none") warNote(s, g1, "town", `${nodeName(id)} ${g1 === "syracuse" ? "comes over to you" : "goes to Carthage"}`, K.ledgerWeights.town, id);
  else warNote(s, g0 === "syracuse" ? "carthage" : "syracuse", "town", `${nodeName(id)} breaks away from ${g0 === "syracuse" ? "you" : "Carthage"}`, K.ledgerWeights.town, id);
  if (g0 !== "none") weary(s, g0, K.weary.townLost, `${nodeName(id)} was lost`);
}
export function warBattle(s: GameState, winner: "syracuse" | "carthage", at: string) {
  const c = card(s);
  if (!c) return;
  c.noBattle = 0;
  warNote(s, winner, "battle", `${winner === "syracuse" ? "your army wins" : "Carthage's army wins"} the battle at ${nodeName(at)}`, K.ledgerWeights.battle, at);
  weary(s, other(winner), K.weary.battleLost, `the battle at ${nodeName(at)} was lost`);
  const k = s.island!.carthage;
  const g = carthageArmy(s)?.commander;
  if (g && k.people[g]) { const r = ((k.people[g] as any).record ??= { taken: 0, won: 0, lost: 0 }); r[winner === "carthage" ? "won" : "lost"] += 1; }
}
export function warArmyDestroyed(s: GameState, side: "syracuse" | "carthage", where: string, commander?: string) {
  if (!card(s)) return;
  warNote(s, other(side), "armyDestroyed", `${side === "syracuse" ? "your army is destroyed" : `${commander ? `${carthagePersonName(s, commander)}'s` : "Carthage's"} army is destroyed`} near ${nodeName(where)}`, K.ledgerWeights.armyDestroyed, where);
  weary(s, side, K.weary.armyDestroyed, "an army was destroyed");
}
export function warTaken(s: GameState, side: "syracuse" | "carthage", commander: string) {
  const k = s.island!.carthage;
  if (side === "carthage" && card(s) && k.people[commander]) ((k.people[commander] as any).record ??= { taken: 0, won: 0, lost: 0 }).taken += 1;
}
export function warSack(s: GameState, side: "syracuse" | "carthage", id: string) {
  warNote(s, side, "sack", `${nodeName(id)} is sacked by ${side === "syracuse" ? "your soldiers" : "Carthage's army"}`, K.ledgerWeights.sack, id);
}
export function warCampPlague(s: GameState, side: "syracuse" | "carthage", at: string) {
  warNote(s, other(side), "plague", `plague strikes ${side === "syracuse" ? "your" : "Carthage's"} camp before ${nodeName(at)}`, K.ledgerWeights.campPlague, at);
  weary(s, side, K.weary.campPlague, "plague in the camp");
}
export function warHunger(s: GameState, side: "syracuse" | "carthage") { weary(s, side, K.weary.hunger, "the army went hungry"); }

// ---------- Weariness ----------

const WEARY_WHY = ["", "", "", "", "the war drags on", "", "", "the war has cost the city its trade and its sons", "", "", "the city is sick of war"];
export function weary(s: GameState, side: "syracuse" | "carthage", d: number, why: string) {
  const c = card(s);
  if (!c || !d) return;
  const before = c.weary[side];
  c.weary[side] = Math.max(0, Math.min(K.weary.max, before + d));
  if (c.weary[side] === before) return;
  log(s, { actor: side === "syracuse" ? PLAYER : "carthage", text: `${side === "syracuse" ? "Syracuse's" : "Carthage's"} war weariness ${c.weary[side] > before ? "rises" : "eases"} to ${c.weary[side]} of ${K.weary.max}.`, why, visible: true, kind: "change" });
  if (side !== "syracuse") return;
  for (const line of K.weary.yoursAt as number[]) {
    if (c.weary.syracuse < line || c.crossed.includes(line)) continue;
    c.crossed.push(line);
    mood(s, "citizens", -1, WEARY_WHY[line] || "the war drags on");
    if (line >= 7) mood(s, "rich", -1, "the war has cost them their trade");
  }
}

// ---------- The season ----------

// Called at the start of Carthage's step: weariness ticks, the announced landing, the return owed, aims met.
export function warSeason(s: GameState) {
  if (!warOn(s)) return;
  const isl = s.island as any;
  const k = isl.carthage;
  const c: WarCard | undefined = isl.warCard;
  if (!isl.war || !c) return;
  const n = s.season - c.since;
  // Weariness: an army in the field, and every few seasons of war.
  const ya = yourArmy(s), ca = carthageArmy(s);
  if (ya && ya.since !== s.season) weary(s, "syracuse", K.weary.perSeasonInField, "the levies are kept in the field");
  if (ca && ca.since !== s.season) weary(s, "carthage", K.weary.perSeasonInField, "an army is kept in Sicily");
  if (n > 0 && n % K.weary.everyNSeasons === 0) { weary(s, "syracuse", 1, `${n} seasons of war`); weary(s, "carthage", 1, `${n} seasons of war`); }
  if (k.plagueUntil >= s.season && s.flags.warPlagueSeen !== k.plagueUntil) { s.flags.warPlagueSeen = k.plagueUntil; weary(s, "carthage", K.weary.carthagePlague, "plague in Carthage"); }
  if (ya && !ya.siege && ya.since !== s.season) c.noBattle += 1;
  if (!ya) c.noBattle = 0;
  patience(s, ya, c.noBattle); // switch "armySupply": allies drift home from an army that will not fight
  // A revolt pauses the war but owes a return (the second test: "they haven't been back").
  if (k.revolt && !c.returnOwed) { c.returnOwed = true; event(s, "carthage", "Carthage's war is paused while Libya is in revolt. It will come back once Libya is quiet.", "the Libyan subjects are in revolt"); }
  if (!k.revolt && c.returnOwed) { c.returnOwed = false; clock(s, 1, "Libya is quiet, and Carthage has a war to finish"); event(s, "carthage", "Libya is quiet. Carthage turns back to its war with you.", "the revolt is over"); }
  // Aims met.
  for (const side of ["syracuse", "carthage"] as const) {
    if (c.aimsMet.includes(side)) continue;
    const id = side === "syracuse" ? c.yourAim : c.carthageAim;
    if (id && aimMet(s, c, side, id)) {
      c.aimsMet.push(side);
      warNote(s, side, "aim", `${side === "syracuse" ? "your" : "Carthage's"} aim is met (${aimDef(side, id).phrase})`, K.ledgerWeights.aimMet);
      event(s, side === "syracuse" ? PLAYER : "carthage", `${side === "syracuse" ? "Your" : "Carthage's"} aim in this war is met: ${aimDef(side, id).name}.`, "the war has gone its way");
    }
  }
  // The announced landing: a season's warning before Carthage's army comes (warnings before the blow).
  if (!ca && c.landingDue === undefined && landingPossible(s)) {
    c.landingDue = s.season + 1;
    const men = k.mercs + k.levy;
    const who = k.general ? carthagePersonName(s, k.general) : "a general not yet named";
    log(s, { actor: "carthage", text: `Carthage readies its fleet: about ${menWords(men).replace("about ", "")} under ${who} will land in Sicily next season.`, why: "merchants count the ships and the hired men gathering at Carthage", visible: true, kind: "warning" });
  }
  if (ca) c.landingDue = undefined;
  maybeMatters(s, c);
}
// What the landing needs, without the announcement (carthage.ts CHECKS.invade adds landingReady).
export function landingPossible(s: GameState): boolean {
  const k = s.island!.carthage;
  const d = CARTHAGE.actions.find((a: any) => a.id === "invade");
  return !!s.island!.war && !carthageArmy(s) && !k.revolt && k.mercs + k.levy >= d.minMen && k.ships >= d.minShips
    && (ISLAND.carthage.landings as string[]).some((id) => city(s, id).side === "carthage");
}
export function landingReady(s: GameState): boolean {
  if (!warOn(s)) return true;
  const c = card(s);
  return !!c && c.landingDue !== undefined && s.season >= c.landingDue;
}

function aimMet(s: GameState, c: WarCard, side: "syracuse" | "carthage", id: string): boolean {
  const ours = (x: string) => SIDE_GROUP(city(s, x).side) === "syracuse";
  if (side === "syracuse") {
    if (id === "west") return ours("motya") || ours("panormus");
    if (id === "free") return !NODES.some((n) => city(s, n.id).side === "tributary");
    if (id === "hold") return s.season - c.since >= 6 && !c.ledger.some((e) => e.side === "carthage" && e.kind === "town");
    return false;
  }
  if (id === "back") return NODES.filter((n) => n.side === "carthage" || n.side === "tributary").every((n) => SIDE_GROUP(city(s, n.id).side) === "carthage");
  if (id === "break") return s.island!.armies.some((a) => a.side === "carthage" && a.siege === "syracuse");
  if (id === "tribute") return s.season - c.since >= 6 && NODES.filter((n) => n.side === "tributary").every((n) => city(s, n.id).side === "tributary");
  return false;
}

// ---------- The pendulum ----------

export const townsHeld = (s: GameState) => NODES.filter((n) => n.id !== "syracuse" && SIDE_GROUP(city(s, n.id).side) === "syracuse").length;
export function pendulum(s: GameState): boolean { return warOn(s) && townsHeld(s) >= K.pendulum.towns; }
export function pendulumAnger(s: GameState): number { return pendulum(s) ? K.pendulum.angerLess : 0; }
export function noticePendulum(s: GameState) {
  if (!warOn(s)) return;
  const p = pendulum(s);
  if (p && s.flags.pendulum === undefined) {
    s.flags.pendulum = s.season;
    event(s, "carthage", `In Carthage, the blocs close ranks: the tyrant now holds ${townsHeld(s)} towns of Sicily. Each bloc will go to war a point sooner, and hire more men when it does.`, `you hold ${townsHeld(s)} towns besides Syracuse`);
  } else if (!p && s.flags.pendulum !== undefined) {
    delete s.flags.pendulum;
    log(s, { actor: "carthage", text: "In Carthage, the blocs drift apart again.", why: `you hold ${townsHeld(s)} towns besides Syracuse`, visible: true, kind: "change" });
  }
}

// ---------- Peace terms ----------

// The terms the ledger supports. shade: points the proposer leans the balance its own way.
export function termsFor(s: GameState, proposer: "syracuse" | "carthage", shade = 0): Terms {
  const c = card(s)!;
  const T = K.terms;
  const b = balance(s) + (proposer === "carthage" ? -shade : shade);
  const t: Terms = { towns: [], lines: [] };
  const silverFor = (x: number) => Math.min(T.silverMax, Math.floor(x / T.silverEvery));
  if (b >= T.even) {
    t.silver = { payer: "carthage", amount: silverFor(b) };
    if (b >= T.townsAt) for (const n of NODES) if (city(s, n.id).side === "tributary") t.towns.push({ id: n.id, to: "free" });
  } else if (b <= -T.even) {
    t.silver = { payer: "syracuse", amount: silverFor(-b) };
    if (b <= -T.townsAt) for (const n of NODES) if ((n.side === "tributary" || n.side === "carthage") && SIDE_GROUP(city(s, n.id).side) === "syracuse") t.towns.push({ id: n.id, to: n.side as Side });
  }
  if (t.silver && t.silver.amount <= 0) t.silver = undefined;
  if (t.silver) t.lines.push(t.silver.payer === "carthage" ? `Carthage pays you ${t.silver.amount} silver for the cost of the war` : `You pay Carthage ${t.silver.amount} silver`);
  for (const x of t.towns) t.lines.push(x.to === "free" ? `${nodeName(x.id)} pays Carthage no more tribute and is free` : `${nodeName(x.id)} goes back to Carthage`);
  t.lines.push(t.towns.length || t.silver ? "otherwise each side keeps what it holds" : "each side keeps what it holds");
  void c;
  return t;
}
export const termsText = (t: Terms) => t.lines.map((x, i) => (i === 0 ? capital(x) : x)).join("; ") + ".";

// Carthage's envoys come with terms (carthage.ts "peace" act, with the switch).
export function carthageOffers(s: GameState) {
  const c = card(s);
  if (!c) return false;
  c.terms = termsFor(s, "carthage", K.terms.carthageLean);
  c.termsFrom = "carthage"; c.termsSeason = s.season;
  fireMatter(s, "peaceEnvoys", {}, true);
  return true;
}
export function applyTerms(s: GameState, t: Terms, why: string) {
  if (t.silver) {
    if (t.silver.payer === "carthage") { const k = s.island!.carthage; const v = Math.min(t.silver.amount, k.silver); k.silver -= v; silver(s, v, "Carthage pays for the cost of the war"); }
    else silver(s, -Math.min(t.silver.amount, s.silver), "the price of peace with Carthage");
  }
  for (const x of t.towns) setSide(s, x.id, x.to, why);
}
// Will Carthage take your terms? Only if it is weary or losing.
export function carthageAccepts(s: GameState): { ok: boolean; why: string } {
  const c = card(s)!;
  const A = K.acceptOffer;
  if (c.weary.carthage >= A.carthageWeary) return { ok: true, why: `Carthage is weary of the war (${c.weary.carthage} of ${K.weary.max})` };
  if (balance(s) >= A.balance) return { ok: true, why: "the war has gone your way" };
  return { ok: false, why: `Carthage is not weary enough (${c.weary.carthage} of ${K.weary.max}; it needs ${A.carthageWeary}) and the war has not gone your way` };
}

// ---------- War matters ----------
// events.ts registers its fireNow here, so this module does not import the whole event engine (an import cycle).
let fireHook: ((s: GameState, id: string, roles: Record<string, string>) => boolean) | null = null;
export const setWarFire = (f: typeof fireHook) => { fireHook = f; };
// Switch "townBoards": the same hook, with extra parts cast (events.ts fireBoard), for matters outside a war.
let townsHook: ((s: GameState, id: string, roles: Record<string, string>, extra: Record<string, string>) => boolean) | null = null;
export const setTownsFire = (f: typeof townsHook) => { townsHook = f; };
export const fireTowns = (s: GameState, id: string, roles: Record<string, string>, extra: Record<string, string>) => townsHook?.(s, id, roles, extra) ?? false;

function fireMatter(s: GameState, id: string, roles: Record<string, string>, force = false) {
  const c = card(s);
  if (!c) return;
  if (!force && c.lastMatter === s.season) return;
  if (fireHook?.(s, id, roles)) c.lastMatter = s.season;
}
function maybeMatters(s: GameState, c: WarCard) {
  if (c.lastMatter === s.season) return;
  const ya = yourArmy(s);
  if (ya && c.noBattle >= K.noBattleMatter && (s.flags.matterNoBattle === undefined || s.season - s.flags.matterNoBattle >= 6)) { s.flags.matterNoBattle = s.season; return fireMatter(s, "armyWantsBattle", {}); }
  if (s.flags.battleWon === s.season - 1 && ya && ya.commander !== PLAYER && s.people[ya.commander] && s.flags.matterVictor !== s.season - 1) {
    s.flags.matterVictor = s.season - 1;
    return fireMatter(s, "victorsWelcome", { victor: ya.commander });
  }
  if (s.flags.battleWon === s.season - 1 && carthageArmy(s) && s.flags.matterTruce === undefined) { s.flags.matterTruce = s.season; return fireMatter(s, "truceOfDays", {}); }
}
