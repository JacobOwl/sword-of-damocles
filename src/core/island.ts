// The island scenario (Phase 2): cities, armies with supply, sieges and battles.
// Content is in data/island.json; every change goes through ops.ts or logs here with its reason.
// None of this runs in a citadel game, so a citadel game draws exactly the same dice as before.
import islandJson from "../../data/island.json" with { type: "json" };
import carthageJson from "../../data/carthage.json" with { type: "json" };
import commissionJson from "../../data/commission.json" with { type: "json" };
import { traitById } from "./data.ts";
import { on } from "./switches.ts";
import { d6 } from "./rng.ts";
import { PLAYER, capital, nameOf, power, others } from "./state.ts";
import { clock, event, grain, guardSet, mood, powerChange, setStatus, silver, nextId, log } from "./ops.ts";
import type { Army, CityState, GameState, IslandState, Mod, Side } from "./types.ts";

export const ISLAND = islandJson as any;
export const CARTHAGE = carthageJson as any;
const R = ISLAND.rules;

export interface NodeDef { id: string; name: string; type: string; side: Side; walls: number; men: number; grain: number; port?: boolean; marsh?: boolean; straits?: boolean; lean: number; lat: number; lon: number; detail: string; approx?: boolean }
export const NODES = ISLAND.nodes as NodeDef[];
export const nodeDef = (id: string) => NODES.find((n) => n.id === id);
export const nodeName = (id: string) => (id === "carthage" ? "Carthage" : nodeDef(id)?.name ?? id);
export const sideName = (side: string) => ISLAND.sides[side] ?? side;

export function newIsland(): IslandState {
  const cities: Record<string, CityState> = {};
  for (const n of NODES) cities[n.id] = { id: n.id, side: n.side, walls: n.walls, men: n.men, grain: n.grain, lean: n.lean, fear: 0, sacked: false, since: 0 };
  const st = CARTHAGE.start;
  const blocs: IslandState["carthage"]["blocs"] = {};
  const moods = ["Rebellious", "Angry", "Uneasy", "Content", "Loyal"];
  for (const b of CARTHAGE.blocs) blocs[b.id] = { id: b.id, power: b.power, mood: moods.indexOf(b.mood) };
  const people: IslandState["carthage"]["people"] = {};
  for (const p of CARTHAGE.people) people[p.id] = { id: p.id, name: p.name, status: "free" };
  return {
    cities, armies: [], war: false, warSince: -1,
    carthage: { blocs, goal: st.goal, goalWhy: "the plague of 405 and the losses of the last war", silver: st.silver, mercs: st.mercs, levy: st.levy, ships: st.ships, plagueUntil: -1, people, armiesLost: 0, offer: -1, revolt: false },
  };
}

export const isIsland = (s: GameState): s is GameState & { island: IslandState } => !!s.island;
export const city = (s: GameState, id: string) => s.island!.cities[id];
export const yourArmy = (s: GameState) => s.island?.armies.find((a) => a.side === "syracuse");
export const carthageArmy = (s: GameState) => s.island?.armies.find((a) => a.side === "carthage");
export const armyAt = (s: GameState, node: string) => s.island!.armies.filter((a) => a.at === node);
export const menWords = (pts: number) => `about ${(Math.max(0, pts) * R.menPerPoint).toLocaleString("en-US")} men`;
export function armyName(s: GameState, a: Army): string {
  if (a.side === "syracuse") return "your army";
  return `${carthagePersonName(s, a.commander)}'s army`;
}
export const carthagePersonName = (s: GameState, id: string) => s.island?.carthage.people[id]?.name ?? CARTHAGE.people.find((p: any) => p.id === id)?.name ?? "Carthage";

// Sides: who counts as a friend of whom.
export function friendly(armySide: Army["side"], side: Side): boolean {
  return armySide === "syracuse" ? side === "syracuse" || side === "ally" : side === "carthage" || side === "tributary";
}
export function hostileTo(s: GameState, armySide: Army["side"], side: Side): boolean {
  if (friendly(armySide, side)) return false;
  if (armySide === "syracuse") return true; // you may attack anyone not yours
  return s.island!.war && side !== "exiles"; // Carthage attacks your side and the free cities only in war
}

// Walls and defenders. Syracuse's walls grow with the Epipolae wall; your guard at home defends it.
export function cityWalls(s: GameState, id: string): number {
  const c = city(s, id);
  return id === "syracuse" ? c.walls + (s.walls ? 1 : 0) : c.walls;
}
export function cityMen(s: GameState, id: string): number {
  const c = city(s, id);
  if (id !== "syracuse") return c.men;
  const ya = yourArmy(s);
  const home = !ya || ya.guard === 0 || ya.at === "syracuse";
  return c.men + (home && s.guard.arrearsSeasons === 0 ? s.guard.strength : 0);
}
export const cityGrain = (s: GameState, id: string) => (id === "syracuse" ? s.grain : city(s, id).grain);
export function cityGrainChange(s: GameState, id: string, d: number, why: string) {
  if (!d) return;
  if (id === "syracuse") return grain(s, d, why);
  const c = city(s, id);
  const before = c.grain;
  c.grain = Math.max(0, Math.min(10, c.grain + d));
  if (c.grain !== before) log(s, { actor: "world", text: `${nodeName(id)}'s grain ${d > 0 ? "+" : ""}${c.grain - before} months (now ${c.grain}).`, why, visible: true, kind: "change" });
}
export function lean(s: GameState, id: string, d: number, why: string) {
  const c = city(s, id);
  const before = c.lean;
  c.lean = Math.max(-3, Math.min(3, c.lean + d));
  if (c.lean !== before) log(s, { actor: "world", text: `${nodeName(id)} ${c.lean > before ? "warms to you" : "cools toward you"} (lean ${c.lean > 0 ? "+" : ""}${c.lean}).`, why, visible: true, kind: "change" });
}
export function setSide(s: GameState, id: string, side: Side, why: string) {
  const c = city(s, id);
  if (c.side === side) return;
  c.side = side;
  c.since = s.season;
  const now: Record<string, string> = { syracuse: "is now yours", ally: "is now your ally", free: "is free again", tributary: "now pays tribute to Carthage", carthage: "is now Carthage's", exiles: "is held by the exiles" };
  log(s, { actor: "world", text: `${nodeName(id)} ${now[side] ?? `is now ${sideName(side)}`}.`, why, visible: true, kind: "change" });
}
const count = (s: GameState, k: string, by = 1) => { s.counters[k] = (s.counters[k] ?? 0) + by; };

// ---------- The map: routes and paths ----------
type Edge = { to: string; days: number };
const ADJ: Record<string, Edge[]> = {};
for (const r of ISLAND.routes as { from: string; to: string; days: number }[]) {
  (ADJ[r.from] ??= []).push({ to: r.to, days: r.days });
  (ADJ[r.to] ??= []).push({ to: r.from, days: r.days });
}
export const ROUTES = ISLAND.routes as { from: string; to: string; days: number }[];
// Shortest path by days (Dijkstra; ties broken by node order in the data, so it is deterministic).
export function path(from: string, to: string): { nodes: string[]; days: number[] } | null {
  const dist: Record<string, number> = { [from]: 0 };
  const prev: Record<string, string> = {};
  const todo = new Set(NODES.map((n) => n.id));
  while (todo.size) {
    let u: string | undefined;
    for (const n of NODES) if (todo.has(n.id) && dist[n.id] !== undefined && (u === undefined || dist[n.id] < dist[u])) u = n.id;
    if (u === undefined) break;
    todo.delete(u);
    if (u === to) break;
    for (const e of ADJ[u] ?? []) {
      const d = dist[u] + e.days;
      if (dist[e.to] === undefined || d < dist[e.to]) { dist[e.to] = d; prev[e.to] = u; }
    }
  }
  if (dist[to] === undefined) return null;
  const nodes = [to];
  while (nodes[0] !== from) nodes.unshift(prev[nodes[0]]);
  return { nodes, days: nodes.map((n) => dist[n]) };
}
export const marchBudget = (s: GameState) => (s.season % 4 === 1 ? R.winterMarchDays : R.marchDays);
export function reachable(s: GameState, from: string): string[] {
  return NODES.map((n) => n.id).filter((id) => id !== from && (path(from, id)?.days.at(-1) ?? 999) <= marchBudget(s));
}
function nearestFriendly(s: GameState, a: Army, avoid?: string): string | null {
  let best: string | null = null, bestD = 999;
  for (const n of NODES) {
    if (n.id === avoid || !friendly(a.side, city(s, n.id).side)) continue;
    if (s.island!.armies.some((o) => o.side !== a.side && o.at === n.id)) continue;
    const p = path(a.at, n.id);
    if (p && p.days.at(-1)! < bestD) { best = n.id; bestD = p.days.at(-1)!; }
  }
  return best;
}

// ---------- Moving, arriving, battles ----------
export function march(s: GameState, a: Army, dest: string, why: string) {
  const p = path(a.at, dest);
  if (!p) return;
  const budget = marchBudget(s);
  const from = a.at;
  let stop = from, days = 0;
  for (let i = 1; i < p.nodes.length; i++) {
    if (p.days[i] > budget) break;
    stop = p.nodes[i]; days = p.days[i];
    if (s.island!.armies.some((o) => o.side !== a.side && o.at === stop)) break; // an enemy army bars the road
  }
  if (stop === from) return;
  a.moved = s.season;
  if (a.siege) { a.siege = undefined; }
  a.at = stop;
  const who = a.side === "syracuse" ? "Your army" : capital(armyName(s, a));
  event(s, a.side === "syracuse" ? PLAYER : "carthage", `${who} marches from ${nodeName(from)} to ${nodeName(stop)} (${days} days${stop !== dest ? `, on the way to ${nodeName(dest)}` : ""}).`, why);
  arrive(s, a);
}

// Before you send an army: where it would stop this season and, if an enemy army bars the road, the battle it would
// fight there, with every modifier on both sides and the chance of each result (a tie is a bloody draw). Reads only.
export function battleForecast(s: GameState, a: Army, dest: string): { at: string; foe: Army; mine: Mod[]; theirs: Mod[]; win: number; draw: number; lose: number } | null {
  const p = path(a.at, dest);
  if (!p) return null;
  const budget = marchBudget(s);
  let stop = a.at;
  for (let i = 1; i < p.nodes.length; i++) {
    if (p.days[i] > budget) break;
    stop = p.nodes[i];
    if (s.island!.armies.some((o) => o.side !== a.side && o.at === stop)) break;
  }
  const foe = s.island!.armies.find((o) => o.side !== a.side && o.at === stop);
  if (!foe || stop === a.at) return null;
  const from = a.at;
  a.at = stop; // look, don't move: put it back at once
  const mine = battleMods(s, a), theirs = battleMods(s, foe);
  a.at = from;
  const d = sum(mine) - sum(theirs);
  let win = 0, draw = 0;
  for (let x = 1; x <= 6; x++) for (let y = 1; y <= 6; y++) { if (x + d > y) win++; else if (x + d === y) draw++; }
  return { at: stop, foe, mine, theirs, win: win / 36, draw: draw / 36, lose: (36 - win - draw) / 36 };
}

export function arrive(s: GameState, a: Army) {
  const foe = s.island!.armies.find((o) => o.side !== a.side && o.at === a.at);
  if (foe) {
    battle(s, a, foe);
    if (!s.island!.armies.includes(a)) return;
    if (s.island!.armies.find((o) => o.side !== a.side && o.at === a.at)) return;
  }
  if (!s.island!.armies.includes(a)) return;
  const c = city(s, a.at);
  if (!hostileTo(s, a.side, c.side)) return;
  if (cityWalls(s, a.at) === 0 && a.men >= 2 * cityMen(s, a.at)) {
    event(s, "world", `${nodeName(a.at)} has no walls and opens its gates to ${armyName(s, a)}.`, `${menWords(a.men)} against a town without walls`);
    takeCity(s, a, "surrendered");
    return;
  }
  if (a.side === "syracuse" && c.fear > 0 && fearSurrender(s, a)) return;
  a.siege = a.at;
  a.siegeSince = s.season;
  count(s, "islandSieges");
  event(s, a.side === "syracuse" ? PLAYER : "carthage", `${capital(armyName(s, a))} lays siege to ${nodeName(a.at)}.`, `${nodeName(a.at)} is ${sideName(c.side)} and shuts its gates`);
  if (a.side === "carthage" && a.at === "syracuse") s.flags.besieged = s.season;
}

function generalMods(s: GameState, a: Army): Mod[] {
  const traits: string[] = a.side === "syracuse"
    ? s.people[a.commander]?.traits ?? []
    : CARTHAGE.people.find((p: any) => p.id === a.commander)?.traits ?? [];
  const who = a.side === "syracuse" ? (a.commander === PLAYER ? "your" : `${nameOf(s, a.commander)}'s`) : `${carthagePersonName(s, a.commander)}'s`;
  const mods: Mod[] = [];
  for (const t of traits) {
    const v = traitById(t)?.actor?.march;
    if (v) mods.push({ label: `${who} trait ${traitById(t)!.name}`, value: v });
  }
  const sum = mods.reduce((x, m) => x + m.value, 0);
  return Math.abs(sum) > 2 ? [{ label: "traits (capped at 2)", value: sum > 0 ? 2 : -2 }] : mods;
}
export function battleMods(s: GameState, a: Army): Mod[] {
  const m: Mod[] = [{ label: "its strength", value: Math.floor(a.men / R.battleDivisor) }, ...generalMods(s, a)];
  if (friendly(a.side, city(s, a.at).side)) m.push({ label: "fighting on its own ground", value: 1 });
  if (a.food <= 0) m.push({ label: "hungry", value: -1 });
  if (a.side === "syracuse" && a.guard > 0 && s.factions.guard.mood === 4) m.push({ label: "the guard is Loyal", value: 1 });
  if (a.side === "syracuse" && s.guard.arrearsSeasons > 0 && a.guard > 0) m.push({ label: "the guard is unpaid", value: -1 });
  if (a.side === "syracuse" && a.commander === PLAYER && s.campaign?.leader === PLAYER) m.push({ label: "you lead in person", value: (commissionJson as any).knobs.inPerson }); // switch "commission"
  return m;
}
const sum = (m: Mod[]) => m.reduce((x, y) => x + y.value, 0);
const modText = (m: Mod[]) => m.map((x) => ` ${x.value >= 0 ? "+" : "-"}${Math.abs(x.value)} ${x.label}`).join("");

export function battle(s: GameState, a: Army, b: Army) {
  const ma = battleMods(s, a), mb = battleMods(s, b);
  const da = d6(s), db = d6(s);
  const ta = da + sum(ma), tb = db + sum(mb);
  count(s, "battles");
  event(s, "world", `Battle at ${nodeName(a.at)}. ${capital(armyName(s, a))} rolled ${da}${modText(ma)} = ${ta}; ${armyName(s, b)} rolled ${db}${modText(mb)} = ${tb}.`, "two armies met");
  if (ta === tb) {
    loseMen(s, a, Math.ceil(a.men / 6), "a bloody draw");
    loseMen(s, b, Math.ceil(b.men / 6), "a bloody draw");
    event(s, "world", "Neither side gives way. Both armies draw off, bloodied.", "the rolls were equal");
    // The one that marched in falls back.
    if (s.island!.armies.includes(a)) retreat(s, a, "it could not break through");
    return;
  }
  const [win, lose] = ta > tb ? [a, b] : [b, a];
  event(s, "world", `${capital(armyName(s, win))} wins the battle at ${nodeName(win.at)}.`, "the higher roll");
  loseMen(s, win, Math.ceil(win.men / 6), "the cost of victory");
  loseMen(s, lose, Math.ceil(lose.men / 3), "beaten in the field");
  s.flags[win.side === "syracuse" ? "battleWon" : "battleLost"] = s.season; // for events (data/island-events.json)
  if (win.side === "syracuse") {
    mood(s, "citizens", 1, "a victory over Carthage");
    mood(s, "guard", 1, "a victory, and plunder from the camp");
    count(s, "battlesWon");
  } else {
    mood(s, "citizens", -1, "your army was beaten");
    count(s, "battlesLost");
  }
  if (!s.island!.armies.includes(lose)) return;
  // Switch "armiesBreak": a beaten army that is starving, or was beaten once already this year, scatters.
  if (on(s, "armiesBreak")) {
    const twice = lose.beaten !== undefined && s.season - lose.beaten < R.breakWithin;
    if (lose.food <= 0 || twice) {
      count(s, "armiesBroken");
      return destroy(s, lose, twice ? "beaten twice within a year, its men lose heart and scatter" : "beaten with no food left, its men scatter to find their own");
    }
  }
  lose.beaten = s.season;
  retreat(s, lose, "beaten in the field");
}

function retreat(s: GameState, a: Army, why: string) {
  const to = nearestFriendly(s, a, a.at);
  if (!to) return destroy(s, a, "it had nowhere to retreat to");
  const p = path(a.at, to)!;
  a.siege = undefined;
  const from = a.at;
  a.at = to;
  event(s, a.side === "syracuse" ? PLAYER : "carthage", `${capital(armyName(s, a))} falls back from ${nodeName(from)} to ${nodeName(to)} (${p.days.at(-1)} days).`, why);
}

export function loseMen(s: GameState, a: Army, n: number, why: string) {
  if (n <= 0) return;
  const before = a.men;
  a.men = Math.max(0, a.men - n);
  const lost = before - a.men;
  // Losses fall on the guard and the levy in proportion.
  if (a.guard > 0 && before > 0) a.guard = Math.max(0, a.guard - Math.round((lost * a.guard) / before));
  if (a.guard > a.men) a.guard = a.men;
  log(s, { actor: a.side === "syracuse" ? PLAYER : "carthage", text: `${capital(armyName(s, a))} loses ${menWords(lost)} (now ${menWords(a.men)}).`, why, visible: true, kind: "change" });
  if (a.men <= 0) destroy(s, a, why);
}

function destroy(s: GameState, a: Army, why: string) {
  const isl = s.island!;
  isl.armies = isl.armies.filter((x) => x !== a);
  event(s, a.side === "syracuse" ? PLAYER : "carthage", `${capital(armyName(s, a))} is destroyed.`, why);
  if (a.side === "syracuse") {
    count(s, "armiesLostYours");
    s.flags.armyLost = s.season;
    if (a.guardStart > 0) guardSet(s, "strength", -Math.min(a.guardStart, s.guard.strength), "your mercenaries died with the army");
    mood(s, "citizens", -1, "the army was lost");
    mood(s, "family", -1, "the army was lost");
  } else {
    count(s, "armiesLostCarthage");
    const c = isl.carthage;
    c.armiesLost += 1;
    s.flags.carthageArmyLost = s.season;
    const g = c.people[a.commander];
    if (g) { g.status = "disgraced"; event(s, "carthage", `${g.name} comes home to Carthage in disgrace.`, "he lost his army"); }
    if (c.general === a.commander) c.general = undefined;
    clock(s, -2, "Carthage has lost an army and fears you");
  }
}

// ---------- Taking a city ----------
export function takeCity(s: GameState, a: Army, how: "surrendered" | "stormed" | "starved") {
  const id = a.at;
  const c = city(s, id);
  const def = nodeDef(id)!;
  const prev = c.side;
  a.siege = undefined;
  // Other armies besieging it stop.
  for (const o of s.island!.armies) if (o.siege === id) o.siege = undefined;
  if (a.side === "carthage") {
    if (id === "syracuse") {
      s.over = { reason: "fallen", text: "Syracuse falls to Carthage. You escape by sea with what you can carry.", season: s.season };
      if (s.events) s.events.open = []; // no court matter waits on a fallen city
      event(s, "world", s.over.text, how === "starved" ? "the city starved" : "the walls were stormed");
      return;
    }
    count(s, "citiesLost");
    setSide(s, id, def.side === "tributary" ? "tributary" : "carthage", `${carthagePersonName(s, a.commander)} took it`);
    if (how === "stormed") {
      c.men = 0; c.grain = 0; c.sacked = true;
      event(s, "carthage", `${carthagePersonName(s, a.commander)} sacks ${nodeName(id)}. Its people flee to the hills.`, "it was taken by storm");
    } else event(s, "carthage", `${nodeName(id)} submits to Carthage and is spared.`, `it ${how}`);
    for (const f of ["citizens", "family"] as const) if (prev === "syracuse" || prev === "ally") mood(s, f, -1, `${nodeName(id)} fell to Carthage`);
    bloc(s, "people", 1, `${nodeName(id)} was taken`);
    return;
  }
  count(s, "citiesTaken");
  setSide(s, id, "syracuse", how === "surrendered" ? "it opened its gates to you" : how === "starved" ? "it starved and gave in" : "your army stormed it");
  if (a.onTake === "sack") {
    const loot = prev === "carthage" ? 4 : 2;
    silver(s, loot, `the sack of ${nodeName(id)}`);
    c.men = 0; c.grain = 0; c.sacked = true; c.lean = -3;
    event(s, PLAYER, `Your soldiers sack ${nodeName(id)} and sell its people.`, "you ordered a sack");
    mood(s, "guard", 1, `plunder from ${nodeName(id)}`);
    count(s, "sacks");
    (s.island!.sacks ??= []).push(id);
    for (const n of NODES) {
      if (n.id === id || n.id === "syracuse") continue;
      const o = city(s, n.id);
      if (o.side === "syracuse" || o.side === "carthage") continue;
      o.fear = Math.min(3, o.fear + 1);
      lean(s, n.id, -1, `they heard of the sack of ${nodeName(id)}`);
    }
  } else {
    c.men = Math.max(1, c.men - 1);
    lean(s, id, 2 - c.lean > 0 ? 2 - c.lean : 0, "you spared it");
    event(s, PLAYER, `You spare ${nodeName(id)}. Its people keep their homes.`, "you ordered it spared");
  }
  if (prev === "tributary") { clock(s, R.angerTributeLost, `Carthage lost the tribute of ${nodeName(id)}`); s.flags.tributeLost = s.season; }
  if (prev === "carthage") { clock(s, R.angerPunicLost, `Carthage lost ${nodeName(id)}, a town of its own`); s.flags.punicLost = s.season; bloc(s, "people", -1, `${nodeName(id)} fell`); }
  if (prev === "free" && !s.island!.war) clock(s, R.angerFreeTaken, `taking ${nodeName(id)} broke the peace of 405, which left it free`);
  if (prev === "exiles") {
    powerChange(s, "rich", -1, "the exiles' fortress fell");
    mood(s, "rich", -1, "their sons at Aetna were beaten");
    for (const p of others(s).filter((p) => p.status === "outside" && p.faction === "rich")) {
      if (d6(s) >= 4) { event(s, p.id, `${capital(p.name)} dies in the fighting at Aetna.`, "the fortress fell"); setStatus(s, p.id, "dead", "killed at Aetna"); }
      else { event(s, p.id, `${capital(p.name)} is taken alive at Aetna.`, "the fortress fell"); setStatus(s, p.id, "held", "captured"); }
    }
  }
}

// ---------- Assault ----------
export function assaultMods(s: GameState, a: Army): Mod[] {
  const id = a.siege!;
  const m: Mod[] = [{ label: "your strength", value: Math.floor(a.men / 3) }, ...generalMods(s, a)];
  if (a.side === "carthage") m[0].label = "its strength";
  const lines = Math.min(R.linesMax, s.season - a.siegeSince);
  if (lines > 0) m.push({ label: "the siege lines are dug", value: lines });
  if (a.side === "syracuse" && s.flags.armed !== undefined) m.push({ label: "your engines and catapults", value: 1 });
  const w = cityWalls(s, id);
  if (w) m.push({ label: `the walls of ${nodeName(id)}`, value: -R.wallWeight * w });
  const men = Math.floor(cityMen(s, id) / 2);
  if (men) m.push({ label: "its defenders", value: -men });
  return m;
}
export const assaultNeed = () => R.assaultBase;
export function assault(s: GameState, a: Army, ok: boolean) {
  const id = a.siege!;
  count(s, "assaults");
  if (ok) {
    count(s, "stormed");
    event(s, a.side === "syracuse" ? PLAYER : "carthage", `${capital(armyName(s, a))} storms the walls of ${nodeName(id)}.`, "the assault succeeded");
    takeCity(s, a, "stormed");
  } else {
    event(s, a.side === "syracuse" ? PLAYER : "carthage", `The assault on ${nodeName(id)} is thrown back from the walls.`, "the assault failed");
    loseMen(s, a, Math.max(1, Math.ceil(a.men / 6)), "dead under the walls");
  }
}
export function chance(mods: Mod[], need: number) {
  const t = sum(mods);
  return [1, 2, 3, 4, 5, 6].filter((d) => d + t >= need).length / 6;
}

// ---------- The world step for the island ----------
export function islandWorld(s: GameState) {
  const isl = s.island!;
  const q = s.season % 4;
  // Summer: cities harvest, tributaries pay Carthage, your cities pay you.
  if (q === 3) {
    for (const n of NODES) {
      if (n.id === "syracuse") continue;
      const c = city(s, n.id);
      const besieged = isl.armies.some((a) => a.siege === n.id);
      if (!besieged && !c.sacked) cityGrainChange(s, n.id, 4, "the summer harvest");
      if (besieged) continue;
      if (c.side === "tributary") { isl.carthage.silver += R.tributeSilver; }
      if ((c.side === "ally" || c.side === "syracuse") && c.grain >= 2) silver(s, R.allySilver, `tribute from ${nodeName(n.id)}`);
    }
    const trib = NODES.filter((n) => city(s, n.id).side === "tributary" && !isl.armies.some((a) => a.siege === n.id)).length;
    if (trib) event(s, "carthage", `The tribute of ${trib} Sicilian ${trib === 1 ? "town" : "towns"} reaches Carthage.`, "the peace of 405 made them pay");
    for (const n of NODES) { const c = city(s, n.id); if (c.sacked && c.since <= s.season - 4) { c.sacked = false; c.men = Math.max(c.men, 1); } }
  }
  // Armies eat. In a friendly city they refill from its stores; Carthage's ships feed an army in a port.
  for (const a of isl.armies.slice()) {
    if (a.since === s.season) continue;
    const c = city(s, a.at);
    const def = nodeDef(a.at)!;
    if (friendly(a.side, c.side) && !a.siege && cityGrain(s, a.at) >= R.resupplyGrain && a.food < R.foodOnMuster) {
      cityGrainChange(s, a.at, -R.resupplyGrain, `feeding ${armyName(s, a)}`);
      a.food = R.foodOnMuster;
      continue;
    }
    if (a.side === "carthage" && def.port && isl.carthage.ships >= 2 && a.food < R.foodOnMuster && !on(s, "convoys")) { // switch "convoys": its grain sails instead (convoys.ts)
      a.food = R.foodOnMuster;
      log(s, { actor: "carthage", text: `Carthage's ships bring food to ${armyName(s, a)} at ${nodeName(a.at)}.`, why: "it holds the sea", visible: true, kind: "change" });
      continue;
    }
    a.food -= 1;
    if (a.food < 0) {
      a.food = 0;
      event(s, a.side === "syracuse" ? PLAYER : "carthage", `${capital(armyName(s, a))} has run out of food. Men desert and sicken.`, "no food left in the baggage");
      count(s, "hungerSeasons");
      loseMen(s, a, Math.ceil(a.men / 4), "hunger");
    } else if (a.food === 0) {
      log(s, { actor: a.side === "syracuse" ? PLAYER : "carthage", text: `${capital(armyName(s, a))} eats the last of its food.`, why: "a season in the field", visible: true, kind: "warning" });
    }
  }
  // Your army's pay: the levies are paid from your silver.
  const ya = yourArmy(s);
  if (ya && ya.since !== s.season) {
    const pay = Math.ceil(Math.max(0, ya.men - ya.guard) / R.upkeepPerPoints);
    if (pay && s.silver >= pay) silver(s, -pay, "the levies' pay in the field");
    else if (pay) mood(s, "citizens", -1, "the levies in the field go unpaid");
  }
  // Sieges: the town eats its stores; a crowded camp in the hot months risks plague.
  for (const a of isl.armies.slice()) {
    if (!a.siege || a.siegeSince === s.season) continue;
    const id = a.siege;
    const def = nodeDef(id)!;
    // Switch "greatWorks": your great fleet keeps the sea open to your own ports (Diodorus 14.50.4).
    const blockade = a.side === "carthage" && isl.carthage.ships >= 4 && !(s.works?.fleet && friendly("syracuse", city(s, id).side));
    const loss = def.port && !blockade ? R.siegeGrainLossPort : R.siegeGrainLoss;
    cityGrainChange(s, id, -loss, `besieged by ${armyName(s, a)}`);
    if (cityGrain(s, id) === 0) {
      if (id === "syracuse") {
        mood(s, "citizens", -1, "hunger in the besieged city");
        event(s, "world", "Syracuse is starving. If the siege holds, the gates will open.", "no grain left under siege");
        if (s.flags.starving !== undefined && s.flags.starving === s.season - 1) { count(s, "starved"); takeCity(s, a, "starved"); if (s.over) return; }
        s.flags.starving = s.season;
      } else {
        count(s, "starved");
        event(s, "world", `${nodeName(id)} has eaten its last grain and gives in.`, "starved by the siege");
        takeCity(s, a, "starved");
        continue;
      }
    } else if (cityGrain(s, id) <= 2) {
      log(s, { actor: "world", text: `${nodeName(id)} has ${cityGrain(s, id)} months of grain left under siege.`, why: "the siege", visible: true, kind: "warning" });
    }
    if ((q === 3 || q === 0) && a.men >= R.plagueMinMen) {
      const on = def.marsh ? R.plagueOnMarsh : R.plagueOn;
      const die = d6(s);
      if (die <= on) {
        count(s, "campPlagues");
        event(s, a.side === "syracuse" ? PLAYER : "carthage", `Plague breaks out in the camp before ${nodeName(id)}.`, `a crowded camp in the hot months${def.marsh ? ", on marshy ground" : ""} (rolled ${die}, plague on ${on} or less)`);
        if (a.side === "carthage") { s.flags.carthagePlague = s.season; bloc(s, "people", -1, "plague in the army"); }
        loseMen(s, a, Math.ceil(a.men / 2), "plague in the camp");
      }
    }
  }
  // Fear fades: once a year, in summer, each city's fear of you drops by one.
  if (q === 3) for (const n of NODES) { const c = city(s, n.id); if (c.fear > 0) { c.fear -= 1; log(s, { actor: "world", text: `${nodeName(n.id)} fears you a little less (fear ${c.fear}).`, why: "a year has passed", visible: true, kind: "change" }); } }
  goingOver(s);
}

// ---------- Cities that change sides ----------
// A town near a great army may go over to it, as Eryx and the Sicani did to Dionysius (Diodorus 14.48.1, 14.48.4)
// and the Siceli did to Carthage (14.58.1). One roll a season per town, for the nearer side's army.
const within = (from: string, to: string, days: number) => from === to || (path(from, to)?.days.at(-1) ?? 999) <= days;
export function goOverMods(s: GameState, id: string, side: Army["side"]): Mod[] | null {
  const isl = s.island!;
  const c = city(s, id);
  if (id === "syracuse" || isl.armies.some((a) => a.siege === id)) return null;
  const army = isl.armies.find((a) => a.side === side);
  if (!army || !within(army.at, id, R.goOverDays)) return null;
  // Who may go over: to you, the free towns and the tribute towns (not Carthage's own, which "expected aid", 14.48.1);
  // to Carthage, in war only, the free towns, your allies, and the towns you took.
  const can = side === "syracuse" ? ["free", "tributary"].includes(c.side) : isl.war && ["free", "ally", "syracuse"].includes(c.side);
  if (!can) return null;
  const holder = isl.armies.find((a) => a.at === id && friendly(a.side, c.side));
  if (holder) return null; // an army of its own side stands in it
  const foe = isl.armies.find((a) => a.side !== side);
  const m: Mod[] = [];
  if (side === "syracuse") {
    if (c.lean) m.push({ label: c.lean > 0 ? "they lean your way" : "they lean against you", value: c.lean });
    if (c.fear) m.push({ label: "they fear you", value: c.fear });
    if (c.side === "tributary") m.push(isl.war ? { label: "at war, the tribute towns want to be free", value: 1 } : { label: "they fear Carthage's anger", value: -1 });
  } else {
    if (c.lean) m.push({ label: c.lean < 0 ? "they hate you" : "they are loyal to you", value: -c.lean });
    if (c.side === "syracuse") m.push({ label: "your garrison holds it", value: -1 });
  }
  if (army.men >= R.aweMen) m.push({ label: `awed by the size of ${armyName(s, army)}`, value: 1 });
  if (!foe || army.men > foe.men) m.push({ label: `${armyName(s, army)} is the strongest on the island`, value: 1 });
  if (foe && within(foe.at, id, R.goOverDays)) m.push({ label: `${armyName(s, foe)} is near`, value: -2 });
  if (cityWalls(s, id) >= 2) m.push({ label: "they trust their walls", value: -1 });
  return m;
}
function goingOver(s: GameState) {
  const isl = s.island!;
  for (const n of NODES) {
    for (const side of ["syracuse", "carthage"] as const) {
      const m = goOverMods(s, n.id, side);
      if (!m) continue;
      const army = isl.armies.find((a) => a.side === side)!;
      const total = sum(m);
      if (total + 6 < R.goOverNeed) continue; // no roll can do it, so no roll is made
      const c = city(s, n.id);
      const prev = c.side;
      const die = d6(s);
      const ok = die + total >= R.goOverNeed;
      log(s, { actor: "world", text: `${nodeName(n.id)} weighs going over to ${side === "syracuse" ? "you" : "Carthage"}: rolled ${die}${modText(m)} = ${die + total}, needs ${R.goOverNeed}. ${ok ? "It goes over." : "It stays as it is."}`,
        why: `${armyName(s, army)} is within ${R.goOverDays} days`, visible: true, kind: "roll", roll: { die, mods: m, total: die + total, need: R.goOverNeed, ok } });
      if (!ok) break;
      if (side === "syracuse") {
        count(s, "wonOver");
        setSide(s, n.id, "ally", `awed by your army, ${nodeName(n.id)} goes over to you`);
        c.lean = Math.max(c.lean, 1);
        event(s, PLAYER, `${nodeName(n.id)} comes over to you without a blow.`, `your army is near and ${m.filter((x) => x.value > 0).map((x) => x.label).join(", ")}`);
        if (prev === "tributary") { clock(s, R.angerEmbassyDefect, `${nodeName(n.id)} stopped paying Carthage`); s.flags.tributeLost = s.season; }
      } else {
        count(s, "defections");
        setSide(s, n.id, "tributary", `${carthagePersonName(s, army.commander)}'s army is near`);
        event(s, "carthage", `${nodeName(n.id)} goes over to Carthage.`, `${armyName(s, army)} is near and ${m.filter((x) => x.value > 0).map((x) => x.label).join(", ")}`);
        if (prev === "syracuse" || prev === "ally") mood(s, "citizens", -1, `${nodeName(n.id)} went over to Carthage`);
      }
      break;
    }
  }
}

// The Leontines, "reflecting on the fate of the Naxians and Catanians", gave in without a siege (14.15.4).
export function surrenderMods(s: GameState, a: Army): Mod[] {
  const id = a.at;
  const c = city(s, id);
  const isl = s.island!;
  const last = isl.sacks?.at(-1);
  const m: Mod[] = [{ label: last ? `they remember the sack of ${nodeName(last)}` : "they fear you", value: c.fear }];
  if (a.men >= 2 * cityMen(s, id)) m.push({ label: "your army is far stronger", value: 1 });
  const w = cityWalls(s, id);
  if (w) m.push({ label: `the walls of ${nodeName(id)}`, value: -w });
  const ca = carthageArmy(s);
  if (ca && isl.war && within(ca.at, id, R.goOverDays)) m.push({ label: "Carthage's army may save them", value: -2 });
  return m;
}
function fearSurrender(s: GameState, a: Army): boolean {
  const id = a.at;
  const c = city(s, id);
  if (c.side === "carthage" || c.side === "exiles") return false; // Carthage's own towns and the exiles expect no mercy
  const m = surrenderMods(s, a);
  const die = d6(s);
  const t = die + sum(m);
  const ok = t >= R.surrenderNeed;
  log(s, { actor: "world", text: `${nodeName(id)} weighs giving in to your army: rolled ${die}${modText(m)} = ${t}, needs ${R.surrenderNeed}. ${ok ? "It gives in." : "It shuts its gates."}`,
    why: "your army stands before a town that fears you", visible: true, kind: "roll", roll: { die, mods: m, total: t, need: R.surrenderNeed, ok } });
  if (!ok) return false;
  count(s, "fearSurrenders");
  event(s, "world", `${nodeName(id)}, afraid of suffering what others suffered, opens its gates to you.`, m[0].label);
  takeCity(s, a, "surrendered");
  return true;
}

// A bloc's mood in Carthage. Kept here so island.ts and carthage.ts share it.
export function bloc(s: GameState, id: string, d: number, why: string) {
  const b = s.island!.carthage.blocs[id];
  if (!b || !d) return;
  const before = b.mood;
  b.mood = Math.max(0, Math.min(4, b.mood + d));
  const def = CARTHAGE.blocs.find((x: any) => x.id === id);
  const moods = ["Rebellious", "Angry", "Uneasy", "Content", "Loyal"];
  if (b.mood !== before) log(s, { actor: "carthage", text: `In Carthage, ${def.name} ${b.mood > before ? "warm" : "sour"} to ${moods[b.mood]}.`, why, visible: true, kind: "change" });
}
export function blocPower(s: GameState, id: string, d: number, why: string) {
  const b = s.island!.carthage.blocs[id];
  if (!b || !d) return;
  const before = b.power;
  b.power = Math.max(0, Math.min(10, b.power + d));
  const def = CARTHAGE.blocs.find((x: any) => x.id === id);
  if (b.power !== before) log(s, { actor: "carthage", text: `In Carthage, ${def.name}: power ${b.power > before ? "+" : ""}${b.power - before} (now ${b.power}).`, why, visible: true, kind: "change" });
}

// ---------- Your army: mustering ----------
export function musterSize(s: GameState, withGuard: boolean) {
  const cit = s.factions.citizens.mood >= 2 ? Math.max(1, Math.floor(power(s, "citizens") / 2)) : 0;
  const allies = NODES.filter((n) => n.id !== "syracuse" && ["ally", "syracuse"].includes(city(s, n.id).side) && city(s, n.id).men >= 2).map((n) => n.id);
  const guard = withGuard ? s.guard.strength : 0;
  return { citizens: cit, allies, guard, total: cit + allies.length + guard + 1 };
}
export function muster(s: GameState, withGuard: boolean) {
  const m = musterSize(s, withGuard);
  for (const id of m.allies) city(s, id).men -= 1;
  const a: Army = { id: nextId(s, "army"), side: "syracuse", at: "syracuse", men: m.total, food: R.foodOnMuster, commander: s.offices.generalship ?? PLAYER, guard: m.guard, guardStart: m.guard, since: s.season, moved: -1, siegeSince: -1, onTake: "spare" };
  s.island!.armies.push(a);
  count(s, "musters");
  const parts = [`${m.citizens} from the citizens' levy`, ...(m.allies.length ? [`${m.allies.length} from ${m.allies.map(nodeName).join(" and ")}`] : []), ...(m.guard ? [`${m.guard} of the guard`] : []), "1 of your household"];
  event(s, PLAYER, `You muster the army at Syracuse: ${menWords(a.men)} (${parts.join(", ")}).`, "Muster the army");
  if (m.guard) event(s, "guard", "The guard marches with the army. It will not stand at your door while it is away.", "you took the guard to war");
  if (s.factions.citizens.mood < 2) event(s, "citizens", "The citizens are too angry to march for you.", "their mood is Angry or worse");
}
export function disband(s: GameState, a: Army) {
  s.island!.armies = s.island!.armies.filter((x) => x !== a);
  event(s, PLAYER, `Your army comes home and disbands at ${nodeName(a.at)}.`, "Disband the army");
  if (a.guard < a.guardStart) guardSet(s, "strength", -Math.min(a.guardStart - a.guard, s.guard.strength), "mercenaries lost in the field");
}
