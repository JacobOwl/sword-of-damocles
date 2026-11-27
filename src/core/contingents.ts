// Switch "contingents" (test 5, docs/council/2026-11-27-units-ground-navy.md part 1): an army is a few named parts,
// each with a heart read from its town or faction, never rolled. Numbers: data/contingents.json (invention).
// The army's men and guard stay the sums the old code reads; the parts are fitted to them whenever they are read.
import { HOOKS } from "./hooks.ts";
import contJson from "../../data/contingents.json" with { type: "json" };
import { on } from "./switches.ts";
import { PLAYER, capital, nameOf, seasonName } from "./state.ts";
import { event, log, silver } from "./ops.ts";
import { NODES, armyName, carthageArmy, carthagePersonName, city, lean, menWords, nodeName, path, yourArmy } from "./island.ts";
import { seatsOf, townBoardsOn, houseName } from "./towns.ts";
import type { Army, GameState, Mod } from "./types.ts";

export const CONT = contJson as any;
const K = CONT.knobs;
export const contOn = (s: GameState) => on(s, "contingents") && !!s.island;
export type Heart = "steady" | "wavering" | "leaving";
export interface Part { id: string; name: string; home: string; kind: "town" | "citizens" | "guard" | "horse" | "household" | "libyans" | "iberians" | "campanians" | "chariots" | "spartans"; men: number; arm: "heavy" | "horse" | "chariots"; leader?: string; envoy?: "syracuse" | "carthage"; envoySeason?: number; bond?: "hostages" | "paid" | "friend"; paidSeason?: number; farWarned?: number }
const parts = (a: Army): Part[] => ((a as any).parts ??= []);
export const armyParts = (s: GameState, a: Army): Part[] => { if (!contOn(s)) return []; fit(a); return parts(a); };
export const heartWord = (h: Heart) => CONT.hearts[h];
const down = (h: Heart): Heart => (h === "steady" ? "wavering" : "leaving");
const days = (a: string, b: string) => (a === b ? 0 : path(a, b)?.days.at(-1) ?? 99);

// The parts always add up to the army: losses fall on each in proportion (a part named to break first takes half).
function fit(a: Army) {
  const ps = parts(a);
  if (!ps.length) return;
  const g = ps.find((p) => p.kind === "guard");
  if (g) g.men = Math.min(a.guard, a.men);
  let diff = a.men - ps.reduce((t, p) => t + p.men, 0);
  if (diff > 0) { const big = ps.filter((p) => p.kind !== "guard").sort((x, y) => y.men - x.men)[0] ?? ps[0]; big.men += diff; diff = 0; }
  const breaker = ps.find((p) => p.id === (a as any).breakFirst);
  if (diff < 0 && breaker && breaker.kind !== "guard") { const t = Math.min(breaker.men, Math.ceil(-diff / 2)); breaker.men -= t; diff += t; }
  while (diff < 0) {
    const big = ps.filter((p) => p.men > 0 && p.kind !== "guard").sort((x, y) => y.men - x.men)[0];
    if (!big) break;
    big.men -= 1; diff += 1;
  }
  (a as any).parts = ps.filter((p) => p.men > 0);
}
export const partByName = (s: GameState, a: Army, id: string) => armyParts(s, a).find((p) => p.id === id);

// ---------- Mustering ----------
// Called from island.ts muster with the muster's own sizes, so the army's total is unchanged but for the horsemen.
export function musterParts(s: GameState, a: Army, m: { citizens: number; allies: string[]; guard: number }) {
  if (!contOn(s)) return;
  const ps: Part[] = [];
  if (m.citizens) ps.push({ id: "citizens", name: "the citizens' levy", home: "syracuse", kind: "citizens", men: m.citizens, arm: "heavy" });
  for (const id of m.allies) ps.push({ id: `town_${id}`, name: `${nodeName(id)}'s levy`, home: id, kind: "town", men: 1, arm: "heavy", leader: townLeader(s, id) });
  if (m.guard) ps.push({ id: "guard", name: "the guard", home: "syracuse", kind: "guard", men: m.guard, arm: "heavy", leader: "the captain of the guard" });
  ps.push({ id: "household", name: "your household", home: "syracuse", kind: "household", men: 1, arm: "heavy" });
  // The horsemen are the rich families' sons (13.112.3; 14.64.5): you want horse for the plains, but they are your enemies under arms.
  if (s.factions.rich.mood >= 2) {
    const lead = Object.values(s.people).find((p) => p.faction === "rich" && p.status === "free" && !p.player);
    ps.push({ id: "horse", name: "the horsemen", home: "syracuse", kind: "horse", men: K.horsemen, arm: "horse", leader: lead?.name });
    a.men += K.horsemen;
  }
  (a as any).parts = ps;
  log(s, { actor: PLAYER, text: `The army marches in ${ps.length} contingents: ${ps.map((p) => `${p.name} (${menWords(p.men).replace("about ", "")})`).join(", ")}.`, why: "each town and faction marches under its own men", visible: true, kind: "change" });
}
function townLeader(s: GameState, id: string): string | undefined {
  const seat = seatsOf(s, id)[0];
  return seat && townBoardsOn(s) ? houseName(s, seat) : undefined;
}
export function carthageParts(s: GameState, a: Army, mercs: number, levy: number, extra?: { id: string; name: string; men: number }[]) {
  if (!contOn(s)) return;
  const ps: Part[] = [];
  const horse = CONT.carthageParts.find((p: any) => p.id === "horse");
  let m = mercs;
  if (mercs + levy >= horse.minMen && m >= horse.points) { ps.push({ id: "horse", name: horse.name, home: "carthage", kind: "chariots", men: horse.points, arm: "chariots" }); m -= horse.points; }
  const ib = Math.ceil(m / 2), ca = m - ib;
  if (levy) ps.push({ id: "libyans", name: "the Libyan levy", home: "libya", kind: "libyans", men: levy, arm: "heavy" });
  if (ib) ps.push({ id: "iberians", name: "the Iberians", home: "iberia", kind: "iberians", men: ib, arm: "heavy" });
  if (ca) ps.push({ id: "campanians", name: "the Campanians", home: "italy", kind: "campanians", men: ca, arm: "heavy" });
  for (const x of extra ?? []) ps.push({ id: x.id, name: x.name, home: x.id, kind: "iberians", men: x.men, arm: "heavy" });
  (a as any).parts = ps;
  fit(a);
}
// A reinforcement from a town joins that town's part (supply.ts reinforce).
export function addToPart(s: GameState, a: Army, town: string) {
  if (!contOn(s)) return;
  const ps = parts(a);
  const p = ps.find((x) => x.home === town && x.kind === "town");
  if (p) p.men += 1;
  else ps.push({ id: `town_${town}`, name: `${nodeName(town)}'s levy`, home: town, kind: "town", men: 1, arm: "heavy", leader: townLeader(s, town) });
}

// ---------- Hearts ----------
const moodHeart = (m: number): Heart => (m >= 3 ? "steady" : m === 2 ? "wavering" : "leaving");
export function heart(s: GameState, a: Army, p: Part): { heart: Heart; why: string } {
  let h: Heart; let why: string;
  const k = s.island!.carthage;
  switch (p.kind) {
    case "town": {
      const c = city(s, p.home);
      const carthageFirst = seatsOf(s, p.home)[0]?.lean === "carthage";
      h = carthageFirst ? "leaving" : c.lean >= 1 ? "steady" : c.lean >= -1 ? "wavering" : "leaving";
      why = carthageFirst ? `${nodeName(p.home)}'s first house is Carthage's friend` : `${nodeName(p.home)} ${c.lean >= 1 ? "leans your way" : c.lean >= -1 ? "is cool toward you" : "hates you"}`;
      break;
    }
    case "citizens": h = moodHeart(s.factions.citizens.mood); why = `the citizens are ${["Rebellious", "Angry", "Uneasy", "Content", "Loyal"][s.factions.citizens.mood]}`; break;
    case "horse": h = moodHeart(s.factions.rich.mood); why = `the horsemen are the rich families' sons, and the rich families are ${["Rebellious", "Angry", "Uneasy", "Content", "Loyal"][s.factions.rich.mood]}`; break;
    case "guard": {
      const arr = s.guard.arrearsSeasons;
      h = arr >= 2 ? "leaving" : arr === 1 ? "wavering" : s.factions.guard.mood >= 2 ? "steady" : s.factions.guard.mood === 1 ? "wavering" : "leaving";
      why = arr ? `the guard is unpaid for ${arr} season${arr > 1 ? "s" : ""}` : `the guard is ${["Rebellious", "Angry", "Uneasy", "Content", "Loyal"][s.factions.guard.mood]}`;
      break;
    }
    case "household": h = "steady"; why = "your own men"; break;
    case "spartans": h = "steady"; why = "they serve while Sparta favours you"; break;
    case "libyans": h = moodHeart(k.blocs.libyans.mood); why = `the Libyan subjects are ${["Rebellious", "Angry", "Uneasy", "Content", "Loyal"][k.blocs.libyans.mood]}`; break;
    default: h = k.silver >= 2 ? "steady" : "wavering"; why = k.silver >= 2 ? "Carthage pays them" : "Carthage's treasury is nearly empty, and hired men follow pay";
  }
  if (a.food <= 0 && h !== "leaving" && p.kind !== "household") { h = down(h); why += ", and they are hungry"; }
  return { heart: h, why };
}
const rank: Record<Heart, number> = { steady: 0, wavering: 1, leaving: 2 };
export function worstPart(s: GameState, a: Army, skip: string[] = []): Part | undefined {
  return armyParts(s, a).filter((p) => p.kind !== "household" && !skip.includes(p.id)).map((p) => ({ p, h: rank[heart(s, a, p).heart] })).filter((x) => x.h > 0).sort((x, y) => y.h - x.h || y.p.men - x.p.men)[0]?.p;
}
export const hasArm = (s: GameState, a: Army, arm: string) => armyParts(s, a).some((p) => p.arm === arm && p.men > 0);
export function bonded(s: GameState, p: Part): string | null {
  if (p.bond === "hostages") return "hostages wait in the citadel";
  if (p.bond === "paid" && p.paidSeason === s.season) return "they were paid this season";
  if (p.kind === "town" && seatsOf(s, p.home)[0]?.lean === "you") return `${nodeName(p.home)}'s first house is your friend`;
  return null;
}

// ---------- The envoy (each season of war) ----------
export function envoys(s: GameState) {
  if (!contOn(s) || !s.island!.war) return;
  const ya = yourArmy(s), ca = carthageArmy(s);
  if (!ya || !ca || days(ya.at, ca.at) > K.envoyDays) return;
  if (armyParts(s, ya).some((p) => p.envoy === "carthage")) return;
  const p = worstPart(s, ya);
  if (!p || p.kind === "household") return;
  p.envoy = "carthage"; p.envoySeason = s.season;
  const who = carthagePersonName(s, ca.commander);
  log(s, { actor: "carthage", text: `${who}'s envoys are in the camp of ${p.name}. Unless you bind them (hostages, pay, or a friend at the head of their town), they will turn when battle is joined.`, why: `${heart(s, ya, p).why}, so they are the weakest heart in your army (as Carthage's agents won over the Sicels, Diodorus 14.58.1)`, visible: true, kind: "warning" });
}
export function sendEnvoy(s: GameState, partId: string) {
  const ca = carthageArmy(s)!;
  const p = partByName(s, ca, partId)!;
  silver(s, -K.envoyCost, "gifts for the envoy");
  p.envoy = "syracuse"; p.envoySeason = s.season;
  event(s, PLAYER, `Your envoy slips into the camp of ${p.name}. If their heart is not steady when battle is joined, they will turn.`, "Send an envoy");
}
export function bindPart(s: GameState, partId: string, how: "hostages" | "paid") {
  const a = yourArmy(s)!;
  const p = partByName(s, a, partId)!;
  if (how === "hostages") {
    p.bond = "hostages";
    if (p.kind === "town") lean(s, p.home, -1, "you took hostages from its leading men");
    event(s, PLAYER, `You take hostages from ${p.name}: they will wait in the citadel until the war is over.`, "as the Campanians were held to Dionysius by their hostages (Diodorus 14.61.6)");
  } else {
    silver(s, -K.payCost, `pay for ${p.name}`);
    p.bond = "paid"; p.paidSeason = s.season;
    event(s, PLAYER, `You pay ${p.name} for this season.`, "hired hands follow pay");
  }
}
// Options for the bind and envoy orders (island-actions.ts).
export const bindTargets = (s: GameState) => { const a = yourArmy(s); return a ? armyParts(s, a).filter((p) => p.kind !== "household" && !bonded(s, p)).map((p) => ({ value: p.id, label: `${capital(p.name)} (${heartWord(heart(s, a, p).heart)}${p.envoy === "carthage" ? "; Carthage's envoys are with them" : ""})` })) : []; };
export const envoyTargets = (s: GameState) => { const a = carthageArmy(s); return a ? armyParts(s, a).filter((p) => p.envoy !== "syracuse" && heart(s, a, p).heart !== "steady").map((p) => ({ value: p.id, label: `${capital(p.name)} (${heartWord(heart(s, a, p).heart)}: ${heart(s, a, p).why})` })) : []; };

// ---------- In battle ----------
// The parts that turn when battle is joined: an envoy on them, no bond, and a heart that is not steady.
export function turners(s: GameState, a: Army, foe: Army): Part[] {
  return armyParts(s, a).filter((p) => p.envoy === foe.side && !bonded(s, p) && heart(s, a, p).heart !== "steady");
}
export function partMods(s: GameState, a: Army, foe: Army, at: string): { mine: Mod[]; theirs: Mod[]; lines: string[] } {
  const mine: Mod[] = [], theirs: Mod[] = [], lines: string[] = [];
  if (!contOn(s)) return { mine, theirs, lines };
  for (const p of armyParts(s, a)) if (p.kind === "town" && p.home === at) mine.push({ label: `${p.name} fights before its own walls`, value: K.ownWalls });
  for (const p of turners(s, a, foe)) {
    const v = Math.max(1, Math.ceil(p.men / 2));
    mine.push({ label: `${p.name} turns against you`, value: -v });
    theirs.push({ label: `${p.name} joins them`, value: v });
    lines.push(`${capital(p.name)} ${a.side === "syracuse" ? "turn and fight for Carthage" : `turn and fight for you`}: ${heart(s, a, p).why}, and ${a.side === "syracuse" ? "Carthage's" : "your"} envoy was with them.`);
  }
  return { mine, theirs, lines };
}
// After the battle: turned parts go home and their towns lean to the side they joined; a wavering part that held on a
// win turns steady (its town warms to you, invention); every part leaves one line in its town's memory.
export function afterParts(s: GameState, a: Army, foe: Army, won: boolean, turned: string[]) {
  if (!contOn(s) || !s.island!.armies.includes(a)) return;
  for (const p of armyParts(s, a).slice()) {
    if (turned.includes(p.id)) {
      a.men = Math.max(0, a.men - p.men);
      if (p.kind === "guard") a.guard = 0;
      (a as any).parts = parts(a).filter((x) => x !== p);
      event(s, a.side === "syracuse" ? PLAYER : "carthage", `${capital(p.name)} ${a.side === "syracuse" ? "leave your army and go home" : "leave Carthage's army"}.`, "they turned in the battle");
      if (p.kind === "town") { lean(s, p.home, a.side === "syracuse" ? -1 : 1, `its men turned in the battle at ${nodeName(a.at)}`); remember(s, p.home, `${nodeName(p.home)}'s men turned against you at ${nodeName(a.at)}`); }
      continue;
    }
    p.envoy = undefined;
    if (p.kind === "town" && a.side === "syracuse") {
      const h = heart(s, a, p).heart;
      if (won && h === "wavering") { lean(s, p.home, 1, `its men held and shared the victory at ${nodeName(a.at)}`); remember(s, p.home, `${nodeName(p.home)}'s men held at ${nodeName(a.at)}`); }
      else if (!won && (a as any).breakFirst === p.id) remember(s, p.home, `${nodeName(p.home)}'s men broke first at ${nodeName(a.at)}`);
    }
  }
  (a as any).breakFirst = undefined;
  if (foe) (foe as any).breakFirst = undefined;
  if (a.men <= 0) s.island!.armies = s.island!.armies.filter((x) => x !== a);
}
export function remember(s: GameState, town: string, line: string) {
  const c = city(s, town) as any;
  (c.memory ??= []).push(`${line} (${seasonName(s.season)})`);
  if (c.memory.length > 4) c.memory.shift();
}

// ---------- Far from home (each world step) ----------
export function farFromHome(s: GameState) {
  if (!contOn(s)) return;
  const a = yourArmy(s);
  if (!a || a.since === s.season) return;
  for (const p of armyParts(s, a).slice()) {
    if (p.kind !== "town" || days(p.home, a.at) <= K.farDays) { p.farWarned = undefined; continue; }
    if (p.paidSeason === s.season - 1 || p.paidSeason === s.season) continue;
    if (p.farWarned === undefined) {
      p.farWarned = s.season;
      log(s, { actor: PLAYER, text: `${capital(p.name)} grumble: they are ${days(p.home, a.at)} days from home. Unless you pay them (1 silver), they go home next season.`, why: "the allies' time agreed for the campaign had run out (Diodorus 13.88.7)", visible: true, kind: "warning" });
      continue;
    }
    a.men = Math.max(0, a.men - p.men);
    city(s, p.home).men += p.men;
    (a as any).parts = parts(a).filter((x) => x !== p);
    event(s, PLAYER, `${capital(p.name)} go home to ${nodeName(p.home)}.`, `they were ${days(p.home, a.at)} days from home and unpaid`);
    remember(s, p.home, `${nodeName(p.home)}'s men went home from ${nodeName(a.at)}`);
  }
  if (a.men <= 0) s.island!.armies = s.island!.armies.filter((x) => x !== a);
}
export { armyName, nameOf };
HOOKS.muster = musterParts;
HOOKS.far = farFromHome;
