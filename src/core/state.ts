// Building a new game, and read-only questions about a game state.
import { DATA } from "./data.ts";
import { T, DEFAULT_TUNING, knobsFor } from "./tuning.ts";
import type { Faction, FactionId, GameState, OfficeId, Person, Plot } from "./types.ts";
import { FACTIONS, MOODS, OFFICES } from "./types.ts";

export const PLAYER = "dionysius";
const SEASON_NAMES = ["Autumn", "Winter", "Spring", "Summer"];

export function seasonName(i: number): string {
  const k = Math.floor(i / 4);
  const q = i % 4;
  const y = 405 - k;
  if (q === 0) return `Autumn ${y} BC`;
  if (q === 1) return `Winter ${y}/${y - 1} BC`;
  return `${SEASON_NAMES[q]} ${y - 1} BC`;
}
// "autumn-405" -> 0, "winter-405" -> 1, "spring-404" -> 2, "summer-404" -> 3 ...
export function seasonIndex(v: unknown): number {
  if (typeof v !== "string") return 0;
  const m = /^(autumn|winter|spring|summer)-(\d+)/i.exec(v);
  if (!m) return 0;
  const q = ["autumn", "winter", "spring", "summer"].indexOf(m[1].toLowerCase());
  const y = Number(m[2]);
  const k = q <= 1 ? 405 - y : 404 - y;
  return Math.max(0, k * 4 + q);
}
export const seasonOfYear = (i: number) => SEASON_NAMES[i % 4];

export function newGame(seed: number, tuning: string = DEFAULT_TUNING): GameState {
  knobsFor(tuning); // fails early on an unknown package
  const st = DATA.start;
  const people: Record<string, Person> = {};
  for (const p of DATA.people) {
    people[p.id] = {
      id: p.id, name: p.name, faction: p.faction, role: p.role, traits: [...p.traits], ambition: p.ambition,
      opinion: p.opinion ?? 0, grudges: (p.grudges ?? []).map((r: string) => ({ reason: r, season: -1 })),
      status: p.status ?? "free", kin: p.kin ?? [], wants: p.wants, marriageable: !!p.marriageable, married: false,
      bound: false, refusals: 0, owedFavor: false, knownUntil: -1, player: !!p.player, exposed: false, infl: 0, blockedUntil: -1, informer: false, enters: seasonIndex(p.enters),
      rival: p.rival ? { rank: p.rival.rank, scars: [p.rival.scar], memory: [], since: 0 } : undefined,
      agenda: p.agenda ? { id: p.agenda, step: 0, done: false } : undefined,
    };
  }
  for (const p of Object.values(people)) if (p.enters > 0) { (p as any).startStatus = p.status; p.status = "absent"; }
  const offices = {} as Record<OfficeId, string | null>;
  for (const o of DATA.offices) offices[o.id as OfficeId] = o.holder;
  const factions = {} as Record<FactionId, Faction>;
  for (const f of DATA.factions) {
    const id = f.id as FactionId;
    const held = OFFICES.filter((o) => offices[o] && people[offices[o]!]?.faction === id).length;
    factions[id] = {
      id, name: f.name, short: f.short, base: f.power - held, mood: MOODS.indexOf(f.mood as any), goal: 0,
      agenda: { id: f.agenda, step: 0, done: false }, actedAgainst: false, disarmed: false, powerShown: f.power,
    };
  }
  return {
    version: 1, seed, tuning, rng: seed | 0, season: 0, step: "world", slots: st.actionsPerSeason,
    silver: st.silver, grain: st.grain, clock: st.clock, land: st.land,
    guard: { strength: st.guard.strength, upkeep: st.guard.upkeep, arrearsSeasons: 0, owed: 0, refusing: false, forSale: false },
    granary: false, walls: false, laws: [], offices, citadelBuilt: false, factions, people, plots: [], requests: [],
    waiting: [], watches: [], sieges: {}, flags: {}, counters: {}, ids: 0, log: [], inputs: [], invasions: 0, leverage: [], blockedSlots: 0,
    events: { open: [], queue: [], fired: {}, count: 0 },
  };
}

export const P = (s: GameState, id: string) => s.people[id];
export const nameOf = (s: GameState, id: string) => (id === PLAYER ? "you" : s.people[id]?.name ?? id);
export const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
export const moodName = (m: number) => MOODS[Math.max(0, Math.min(4, m))];
export const officeName = (o: string) => DATA.offices.find((x) => x.id === o)?.name ?? o;
export const traitName = (t: string) => DATA.traits.find((x) => x.id === t)?.name ?? t;
export const hasTrait = (p: Person, t: string) => p.traits.includes(t);

export const alive = (p: Person) => p.status !== "dead" && p.status !== "absent";
export const inCity = (p: Person) => p.status === "free";
export const others = (s: GameState) => Object.values(s.people).filter((p) => !p.player);
export const membersOf = (s: GameState, f: FactionId) => others(s).filter((p) => p.faction === f && alive(p));

export function officesOf(s: GameState, pid: string): OfficeId[] {
  return OFFICES.filter((o) => s.offices[o] === pid);
}
export const holds = (s: GameState, pid: string, o: OfficeId) => s.offices[o] === pid;

export function power(s: GameState, f: FactionId): number {
  const held = OFFICES.filter((o) => s.offices[o] && s.people[s.offices[o]!]?.faction === f).length;
  return Math.max(0, Math.min(10, s.factions[f].base + held));
}
export function band(pow: number): "Marginal" | "Active" | "Dominant" {
  return pow <= 2 ? "Marginal" : pow >= 8 ? "Dominant" : "Active";
}

export function leaderOf(s: GameState, f: FactionId): Person | undefined {
  // The first listed member who is free in the city, else anyone alive.
  const ms = membersOf(s, f);
  const named = DATA.factions.find((x) => x.id === f)?.leader;
  const lead = named ? s.people[named] : undefined;
  if (lead && lead.status === "free") return lead;
  return ms.find((p) => p.status === "free") ?? ms.find((p) => p.status !== "held");
}

export function government(s: GameState): string {
  for (const p of Object.values(s.people)) {
    if (alive(p) && ["citadel", "generalship", "treasury"].every((o) => s.offices[o as OfficeId] === p.id))
      return p.player ? "Tyranny (yours)" : `Tyranny (${p.name})`;
  }
  const count = (f: FactionId) => OFFICES.filter((o) => s.offices[o] && s.people[s.offices[o]!]?.faction === f).length;
  if (count("citizens") >= 3) return "Democracy";
  if (count("rich") >= 3) return "Oligarchy";
  return "Unsettled";
}
export const isPlayerTyranny = (s: GameState) => government(s) === "Tyranny (yours)";

export function guardDefends(s: GameState): boolean {
  const g = s.guard;
  return g.arrearsSeasons === 0 && s.factions.guard.mood > 1 && !g.refusing && !s.plots.some((p) => p.guardBacking);
}

export function defense(s: GameState): { total: number; parts: { label: string; value: number }[] } {
  const k = T(s);
  const parts = [{ label: "base", value: k.defenseBase }];
  if (s.citadelBuilt && holds(s, PLAYER, "citadel")) parts.push({ label: "the citadel", value: k.citadelDefense });
  if (guardDefends(s)) parts.push({ label: "the guard", value: s.guard.strength });
  const watched = s.watches.filter((w) => s.plots.some((pl) => pl.members.includes(w))).length;
  if (watched && k.watchDefense) parts.push({ label: "watches on plotters", value: watched * k.watchDefense });
  return { total: parts.reduce((a, b) => a + b.value, 0), parts };
}

export function memberWeight(s: GameState, pid: string, plot: Plot): number {
  const p = s.people[pid];
  const k = T(s);
  if (officesOf(s, pid).length) return k.officeWeight;
  const f = p.faction as FactionId;
  if (FACTIONS.includes(f) && leaderOf(s, f)?.id === pid) return k.leaderWeight;
  return k.memberWeight;
}

export function plotStrength(s: GameState, plot: Plot): { total: number; parts: { label: string; value: number }[] } {
  const parts: { label: string; value: number }[] = [];
  for (const m of plot.members) {
    const p = s.people[m];
    parts.push({ label: p.name, value: memberWeight(s, m, plot) });
    if (p.rival) {
      const b = DATA.ranks.find((r) => r.rank === p.rival!.rank)?.plotBonus ?? 0;
      if (b) parts.push({ label: `${p.name}'s rank`, value: b });
    }
  }
  for (const f of plot.backers) {
    const v = Math.floor(power(s, f) / T(s).backingDivisor);
    if (v) parts.push({ label: `${s.factions[f].name} backing`, value: v });
  }
  if (plot.guardBacking) parts.push({ label: "the guard's swords", value: s.guard.strength });
  if (plot.bonus) parts.push({ label: plot.bonus > 0 ? "preparations" : "disarmed citizens", value: plot.bonus });
  return { total: Math.max(0, parts.reduce((a, b) => a + b.value, 0)), parts };
}

export const stageName = (n: number) => ["None", "Whispers", "Rumors", "Named"][n] ?? "Named";
export const stageFor = (s: GameState, strength: number) => (strength >= T(s).stageNamed ? 3 : strength >= T(s).stageRumors ? 2 : 1);

export const activeRivals = (s: GameState) => others(s).filter((p) => p.rival && alive(p));
export const plotOf = (s: GameState, pid: string) => s.plots.find((pl) => pl.members.includes(pid));
export const isKnown = (s: GameState, pid: string) => s.people[pid].knownUntil >= s.season;

// Influence, 0 to 10 (political rivals). Offices +2 each, +1 if you owe them a favour, +1 per leverage token they hold.
export function influence(s: GameState, pid: string): number {
  const p = s.people[pid];
  if (p.player) return playerInfluence(s);
  if (p.status === "outside" || p.status === "dead") return 0;
  let v = 2 * officesOf(s, pid).length + (p.owedFavor ? 1 : 0) + s.leverage.filter((l) => l.holder === pid).length + p.infl;
  if (p.status === "held") v -= 2;
  return Math.max(0, Math.min(10, v));
}
// Your influence: offices you hold, plus half the power of the faction that backs you most.
export function backingFaction(s: GameState): FactionId | undefined {
  const fs = FACTIONS.filter((f) => s.factions[f].mood >= 2).sort((a, b) => s.factions[b].mood - s.factions[a].mood || power(s, b) - power(s, a));
  return fs[0];
}
export function playerInfluence(s: GameState): number {
  const f = backingFaction(s);
  return Math.max(0, Math.min(10, officesOf(s, PLAYER).length + (f ? Math.floor(power(s, f) / 2) : 0)));
}
export const politicalRivals = (s: GameState) => others(s).filter((p) => p.political && alive(p));
export const enemies = activeRivals;
export const leverageOver = (s: GameState, holder: string, over: string) => s.leverage.filter((l) => l.holder === holder && l.over === over).length;
