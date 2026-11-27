// Switch "carthageReturns" (test 5, thread 48 spec 1, docs/council/2026-11-27-abroad.md): Carthage loses battles, not
// wars. A lost army or a peace starts a recovery (Magon "set about retrieving the Carthaginian cause", Diodorus 14.90.2-3);
// the memory of lost armies fades; a treaty brings a truce; the council debates in the open each spring and after each
// blow, shown as a scene with three speakers (it shows the existing vote, Aristotle's rule, and adds none); you can tip
// it with a herald or a bribe; the second expedition comes bigger, from Libya, Sardinia and Italy (14.95.1); and a
// landing left unanswered sours your people (Republic of Rome's unrest from an ignored war). Numbers: data/carthage.json.
import carthageJson from "../../data/carthage.json" with { type: "json" };
import { on } from "./switches.ts";
import { d6 } from "./rng.ts";
import { PLAYER, capital, seasonName } from "./state.ts";
import { event, log, mood, silver, clock } from "./ops.ts";
import { bloc, carthageArmy, yourArmy } from "./island.ts";
const CARTHAGE = carthageJson as any;
import { card, weary } from "./war.ts";
import { addScene } from "./scenes.ts";
import type { GameState } from "./types.ts";

export const RET = CARTHAGE.returns;
export const returnsOn = (s: GameState) => on(s, "carthageReturns") && !!s.island;
const F = (s: GameState) => ((s.island as any).returns ??= { recoverUntil: -1, truceUntil: -1, angerFloor: 0, lostAt: [], herald: undefined, paid: {}, exiles: [], debated: -1, expeditions: 0 }) as {
  recoverUntil: number; truceUntil: number; angerFloor: number; lostAt: number[]; herald?: { season: number; kind: "demand" | "terms" }; paid: Record<string, number>; exiles: string[]; debated: number; expeditions: number; blowAt?: number; blowWhy?: string;
};
export const recovering = (s: GameState) => returnsOn(s) && F(s).recoverUntil >= s.season;
export const inTruce = (s: GameState) => returnsOn(s) && F(s).truceUntil >= s.season && !s.island!.war;
export const returnsState = (s: GameState) => (returnsOn(s) ? F(s) : undefined);

// A Carthaginian army destroyed (island.ts destroy) or a peace (carthage.ts endWar): the recovery begins.
export function carthageBlow(s: GameState, why: string, peace = false) {
  if (!returnsOn(s)) return;
  const f = F(s);
  f.recoverUntil = s.season + RET.recoverSeasons;
  f.blowAt = s.season; f.blowWhy = why;
  if (!peace) f.lostAt.push(s.season);
  if (peace) { f.truceUntil = s.season + RET.truceSeasons; f.angerFloor = s.clock; }
  log(s, { actor: "carthage", text: `Carthage does not give up: it turns to recovering what it lost${peace ? `, and keeps the truce until ${seasonName(f.truceUntil)}` : ""}.`, why: `${why}; as after 396, "they constructed ships and made careful provision of supplies for the war" (Diodorus 14.77.5)`, visible: true, kind: "event" });
}
// How many armies Carthage still remembers losing: each loss fades after a while (a scar, not a veto).
export function armiesRemembered(s: GameState): number {
  const k = s.island!.carthage;
  if (!returnsOn(s)) return k.armiesLost;
  const f = F(s);
  return f.lostAt.filter((x) => s.season - x < RET.forgetSeasons).length;
}
// Each season, at the start of Carthage's step: the recovery eases its weariness, anger keeps its floor, an
// unanswered landing sours your people, and the old losses fade.
export function returnsSeason(s: GameState) {
  if (!returnsOn(s)) return;
  const f = F(s);
  const k = s.island!.carthage;
  k.armiesLost = armiesRemembered(s);
  if (recovering(s) && card(s)) weary(s, "carthage", -RET.recoverEase, "Carthage mends its losses");
  if (recovering(s) && s.clock < f.angerFloor) clock(s, f.angerFloor - s.clock, "Carthage has not forgotten the last war");
  // A landing left unanswered: Carthage's army has stood on the island for a while and your army has not met it.
  const ca = carthageArmy(s), ya = yourArmy(s);
  if (ca && s.island!.war && s.season - ca.since >= RET.unansweredAfter) {
    const fought = [s.flags.battleWon, s.flags.battleLost].some((x) => x !== undefined && s.season - x <= 1);
    const answering = ya && (ya.at === ca.at || !!ya.siege);
    if (!fought && !answering) mood(s, "citizens", -1, "Carthage's army stands on Sicily, and you have not met it (as the Syracusans turned on Dionysius when he would not fight, Diodorus 14.64.1)");
  }
}
// Carthage's council won't vote war while recovering or in a truce, unless you broke the terms; and a weary Carthage
// fights on while it still has silver to hire another army. Called from carthage.ts prefers.
export function returnsPrefers(s: GameState, id: string, p: { goal: string; why: string }, lostTown: boolean): { goal: string; why: string } {
  if (!returnsOn(s)) return p;
  const k = s.island!.carthage;
  const f = F(s);
  if (p.goal === "war" && !s.island!.war && inTruce(s) && !lostTown) return { goal: "recover", why: `the truce holds until ${seasonName(f.truceUntil)}` };
  if (p.goal === "peace" && s.island!.war && k.silver >= RET.peaceSilver && armiesRemembered(s) < 2) return { goal: recovering(s) ? "recover" : "war", why: `Carthage still has ${k.silver} silver to hire another army` };
  if (recovering(s) && (p.goal === "war" || p.goal === "rebuild" || p.goal === "tribute")) return { goal: "recover", why: `Carthage is recovering from ${f.blowWhy ?? "its losses"} until ${seasonName(f.recoverUntil)}` };
  // Your herald: a demand insults the people; terms give the Elders a reason to wait.
  const h = f.herald;
  if (h && s.season - h.season <= 1) {
    if (h.kind === "demand" && id === "people" && p.goal !== "war") return { goal: "war", why: "your herald's demand insulted Carthage" };
    if (h.kind === "terms" && id === "elders" && p.goal === "war") return { goal: s.island!.war ? "peace" : "recover", why: "your herald brought terms worth hearing" };
  }
  // A man you paid speaks a step softer.
  if (f.paid[id] !== undefined && s.season - f.paid[id] <= 1 && p.goal === "war") return { goal: s.island!.war ? "peace" : "recover", why: "its speaker has been paid to speak for waiting" };
  return p;
}

// ---------- The debate (a scene, each spring and after each blow) ----------
const stance = (g: string) => (g === "war" ? "for war" : g === "peace" ? "for peace" : "for waiting");
function speaker(s: GameState, bloc: string): { face: string; name: string } {
  const k = s.island!.carthage;
  for (const id of RET.speakers[bloc] as string[]) {
    const p = k.people[id];
    if (p && p.status !== "dead" && p.status !== "command") return { face: `carthage:${id}`, name: p.name };
    if (!p && !CARTHAGE.people.some((x: any) => x.id === id)) return { face: "", name: capital(id) };
  }
  return { face: "", name: "an elder of Carthage" };
}
// Called from carthage.ts chooseGoal with each bloc's preference and the result.
export function maybeDebate(s: GameState, prefs: { id: string; name: string; goal: string; why: string }[], best: string, decidedBy: string) {
  if (!returnsOn(s)) return;
  const f = F(s);
  const blow = f.blowAt !== undefined && s.season - f.blowAt === 1;
  const spring = s.season % 4 === 2;
  if (!(blow || spring) || f.debated === s.season) return;
  f.debated = s.season;
  const goalName = CARTHAGE.goals.find((g: any) => g.id === best)?.name ?? best;
  const speakers = prefs.map((p) => { const sp = speaker(s, p.id); return { face: sp.face, name: `${sp.name}, for ${p.name}`, stance: stance(p.goal), line: `${capital(p.why)}.` }; });
  const sc = addScene(s, {
    kind: "council", title: "The council of Carthage debates", art: "debate", faces: [], beats: [], speakers,
    result: `${goalName}`, good: best !== "war",
  });
  sc.beats.push(blow ? `After ${f.blowWhy ?? "the blow"}, Carthage's council meets to decide what comes next.` : "In spring, Carthage's council meets on the war, as it does each year.");
  sc.beats.push(`The vote: ${goalName.toLowerCase()}, decided by ${decidedBy}.`);
  if (f.herald && s.season - f.herald.season <= 1) sc.beats.push(f.herald.kind === "demand" ? "Your herald's demand was read in the council and then before the people." : "Your herald's terms were read in the council.");
  sc.mark = `${capital(seasonName(s.season))}: Carthage's council voted for ${goalName.toLowerCase()}.`;
}

// ---------- Your levers ----------
export function sendHerald(s: GameState, kind: "demand" | "terms") {
  F(s).herald = { season: s.season, kind };
  event(s, PLAYER, kind === "demand" ? "Your herald carries a demand to Carthage: give up the Greek towns of Sicily, or face war." : "Your herald carries terms to Carthage: peace, and each keeps what it holds.", "as Dionysius sent a letter to the senate of Carthage (Diodorus 14.47.1-2)");
}
export function payMan(s: GameState, blocId: string) {
  const f = F(s);
  silver(s, -RET.payCost, "silver for a man in Carthage");
  const die = d6(s);
  const found = die <= RET.payFoundOn;
  f.paid[blocId] = s.season;
  const sp = speaker(s, blocId);
  log(s, { actor: PLAYER, text: `Your silver reaches ${sp.name} in Carthage (rolled ${die}; found out on ${RET.payFoundOn}).`, why: "Pay a man in Carthage", visible: true, kind: "roll", roll: { die, mods: [], total: die, need: RET.payFoundOn + 1, ok: !found } });
  if (found) {
    delete f.paid[blocId];
    for (const b of ["elders", "hundred", "people"]) bloc(s, b, -1, "the tyrant's silver was found in the council");
    clock(s, 1, "Carthage found your silver in its council");
    event(s, "carthage", `${capital(sp.name)} is found with your silver. Carthage's council is furious.`, "the bribe was discovered");
  }
}
// Carthage's act "Take in the exiles": a man you drove out finds a welcome there.
export function takeInExiles(s: GameState): boolean {
  const f = F(s);
  const p = Object.values(s.people).find((x) => !x.player && (x.status === "outside" || x.status === "exiled" as any) && !f.exiles.includes(x.id));
  if (!p) return false;
  f.exiles.push(p.id);
  event(s, "carthage", `${capital(p.name)} is welcomed at Carthage. Its envoys now speak in Sicily with a Syracusan beside them.`, "Magon \"received the victims of Dionysius' wars\" (Diodorus 14.90.3)");
  return true;
}
export const exilesTaken = (s: GameState) => (returnsOn(s) ? F(s).exiles.length : 0);
// The second expedition comes from Libya, Sardinia and Italy (14.95.1).
export function secondExpedition(s: GameState): { id: string; name: string; share: number }[] {
  if (!returnsOn(s)) return [];
  const f = F(s);
  f.expeditions += 1;
  return f.expeditions >= 2 ? RET.second : [];
}
