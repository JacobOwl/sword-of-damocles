// Headless players for balance runs. Each one is a priority list over the same menu you use, and each one
// looks only at what the screen shows you: plot warnings and the names you have uncovered, grudges, opinions,
// moods, power and your own stores. None of them peeks at hidden plot members or strengths.
// They draw their own random numbers from a separate stream, so the game's dice are the same dice a person gets.
import {
  PLAYER, alive, band, defense, holds, influence, leaderOf, officesOf, others, playerInfluence, plotOf, power,
} from "./state.ts";
import { leverageOver } from "./state.ts";
import { inScenario, perform, preview, vote } from "./actions.ts";
import { DATA } from "./data.ts";
import type { Args, FactionId, GameState, OfficeId, Person } from "./types.ts";
import { FACTIONS } from "./types.ts";
import { islandChoices } from "./island-bot.ts";
import { atSea, convoysOn } from "./convoys.ts";
import { worksChoices } from "./works.ts";
import { holdsDeadly, seenHolders, silenceCost } from "./secrets.ts";

export interface Choice { a: string; args?: Args; min?: number } // min: lowest chance worth rolling for
export interface Bot { id: string; name: string; summary: string; choices: (s: GameState, r: () => number) => Choice[] }

// ---------- What the player can see ----------
const free = (s: GameState) => others(s).filter((p) => p.status === "free");
const weight = (s: GameState, p: Person) => {
  const f = p.faction as FactionId;
  return officesOf(s, p.id).length * 3 + (FACTIONS.includes(f) && leaderOf(s, f)?.id === p.id ? 2 : 0) + (p.rival?.rank ?? 0) + (p.political?.rank ?? 0);
};
const knownPlotters = (s: GameState) => {
  const ids = new Set<string>();
  for (const pl of s.plots) for (const m of pl.known) if (s.people[m].status === "free") ids.add(m);
  return [...ids].map((id) => s.people[id]);
};
const worstStage = (s: GameState) => s.plots.reduce((a, pl) => Math.max(a, pl.stage), 0);
// Who could be plotting: grudge holders you haven't cleared, the most dangerous first.
// With "Warnings are clues" on, what you have heard points somewhere: a grievance or a faction you were told of
// raises a suspect, and a man who came to tell you he said no is cleared. All of it is on the plot cards.
function clueHit(s: GameState, p: Person): number {
  let v = 0;
  for (const pl of s.plots) for (const d of pl.deeds ?? []) {
    if (!d.told) continue;
    if (d.kind === "refused" && d.target === p.id) return -5;
    if (d.grudge && p.grudges.some((g) => g.reason === d.grudge)) v += 2;
    if (pl.stage >= 2 && d.faction && d.faction === p.faction) v += 1;
  }
  // Switch "council": a man named at your council this season, by someone you have not caught lying.
  const c = s.council;
  if (c) for (const l of c.brief) if (l.accuse === p.id && !(c.doubts[l.who] ?? 0)) v += 2;
  return v;
}
const suspects = (s: GameState) =>
  free(s).filter((p) => (p.grudges.length || p.rival) && p.knownUntil < s.season)
    .sort((a, b) => clueHit(s, b) - clueHit(s, a) || weight(s, b) - weight(s, a) || a.opinion - b.opinion);
// Rumors name a faction; the player sees which one in the warning. The plot leader's faction is that faction.
const rumoredFactions = (s: GameState) => new Set(s.plots.filter((pl) => pl.stage >= 2).map((pl) => s.people[pl.leader].faction));
const upkeepReserve = (s: GameState) => (holds(s, PLAYER, "treasury") ? s.guard.upkeep : 0);
const spare = (s: GameState, n: number) => s.silver - upkeepReserve(s) >= n;
const KEY: OfficeId[] = ["citadel", "treasury"];

// Carthage at the gates and enemies behind walls you can march on.
function outside(s: GameState, out: Choice[], minMarch: number, sack = false) {
  if (s.island) out.push(...islandChoices(s, { sack })); // the island game (Phase 2): armies, embassies, peace
  out.push(...worksChoices(s)); // switch "greatWorks" (nothing when it is off)
  if (s.clock >= 7 && !s.walls && s.silver >= 3) out.push({ a: "build", args: { target: "wall" } });
  if (s.clock >= 7 && s.silver >= 1) out.push({ a: "envoy", min: 0.34 });
  const hunted = others(s).some((p) => p.status === "outside" && p.rival && p.faction === "rich");
  if (hunted && s.guard.arrearsSeasons === 0) for (const pl of DATA.places.filter((p) => p.exiles)) out.push({ a: "march", args: { target: pl.id }, min: minMarch });
}
function basics(s: GameState, out: Choice[]) {
  if (s.building) out.push({ a: "build", args: { target: s.building.what } });
  if (s.guard.owed > 0) out.push({ a: "payGuard" });
  // Grain falls 2 at the start of next season and the citizens riot under 3, so end each season on 5 or more
  // (summer refills it, so spring can run lower).
  const need = s.season % 4 === 2 ? 3 : 5;
  // Switch "convoys": bought grain lands a season late, so buy ahead, and count what is already at sea.
  const sea = convoysOn(s) ? atSea(s).filter((v) => v.side === "syracuse" && v.cargo === "grain" && v.to === "syracuse").reduce((x, v) => x + v.amount, 0) : 0;
  if (s.grain + sea < need + (convoysOn(s) ? 2 : 0) && s.silver >= 1) out.push({ a: "buyGrain" });
}
// Steady income from laws, against the guard's pay.
const steady = (s: GameState) => s.laws.reduce((a, id) => a + (DATA.laws.find((l) => l.id === id)?.income ?? 0), 0);
function income(s: GameState, out: Choice[], harsh: boolean) {
  out.push({ a: "strikeCoin" });
  for (const pl of DATA.places.filter((p) => p.raid && !p.carthaginian)) out.push({ a: "raid", args: { target: pl.id }, min: 0.5 });
  for (const l of ["harbourDues", "taxPeople", "levyRich"]) if (!s.laws.includes(l)) out.push({ a: "proposeLaw", args: { target: l }, min: harsh ? 0.34 : 0.5 });
  if (harsh) for (const p of free(s).filter((p) => p.faction === "rich" || p.traits.includes("wealthy")).sort((a, b) => weight(s, a) - weight(s, b)))
    out.push({ a: "seize", args: { target: p.id }, min: 0.5 });
}
// Answer petitions. `generous` grants minor offices at once; otherwise only after one refusal (a second makes an enemy).
function petitions(s: GameState, out: Choice[], generous: boolean, keepKey = true) {
  for (const r of s.requests) {
    const p = s.people[r.from];
    // Switch "secrets": fight back first (buy him off if the silver is there, else show him up as a blackmailer,
    // which costs a parting shot), else pay the price if it is not a key office.
    if (r.blackmail) {
      if (spare(s, silenceCost(s, r.from))) out.push({ a: "buySilence", args: { target: r.from }, min: 0.5 });
      out.push({ a: "expose", args: { target: r.from } });
    }
    if (r.blackmail && r.kind === "office" && r.office && holds(s, PLAYER, r.office) && (!KEY.includes(r.office) || !keepKey)) out.push({ a: "grantOffice", args: { target: r.from, second: r.office } });
    if (r.kind === "silver") out.push({ a: "bribe", args: { target: r.from, second: "1" } });
    if (r.kind === "citizenship" && s.land > 0) out.push({ a: "grantGuard" });
    if (r.kind === "marriage") out.push({ a: "marriage", args: { target: r.from, second: s.people[PLAYER].married ? "thearides" : PLAYER } });
    if (r.kind === "office" && r.office && holds(s, PLAYER, r.office)) {
      const key = KEY.includes(r.office);
      const risky = !!p.political || p.grudges.length > 0;
      const willGrant = (!key || !keepKey) && !risky && (generous || p.refusals >= 1 || r.owed || r.agendaStep);
      if (willGrant) out.push({ a: "grantOffice", args: { target: r.from, second: r.office } });
      else if (r.owed || r.agendaStep || p.refusals >= 1) out.push({ a: "bribe", args: { target: r.from, second: "3" } }); // soften the blow
    }
  }
}
// Keep each faction above Angry: the cheapest fix for each.
function moods(s: GameState, out: Choice[], floor: number) {
  for (const f of FACTIONS.slice().sort((a, b) => s.factions[a].mood - s.factions[b].mood)) {
    if (s.factions[f].mood > floor) continue;
    if (f === "citizens" && s.grain >= 7) out.push({ a: "grainHandout" });
    if (f === "guard" && s.land > 0) out.push({ a: "grantGuard" });
    if (f !== "guard" && s.land > 0) out.push({ a: "giveLand", args: { target: f } });
    const friend = free(s).filter((p) => p.faction === f).sort((a, b) => b.opinion - a.opinion)[0];
    if (friend) out.push({ a: "petition", args: { target: friend.id }, min: 0.5 });
    if (friend && leverageOver(s, PLAYER, friend.id)) out.push({ a: "forceFavor", args: { target: friend.id } });
  }
}
// Clear grudges among the people a plot would want, before anyone recruits them.
function soothe(s: GameState, out: Choice[], n: number) {
  const sore = free(s).filter((p) => p.grudges.length && !plotOf(s, p.id)?.known.includes(p.id)).sort((a, b) => weight(s, b) - weight(s, a));
  for (const p of sore.slice(0, n)) {
    out.push({ a: "pardon", args: { target: p.id } });
    if (spare(s, 3) && !p.rival?.scars.some((x) => ["Humiliated", "Bereaved"].includes(x))) out.push({ a: "bribe", args: { target: p.id, second: "3" } });
  }
}
// Push back on political rivals before they reach Pretender.
// `strip`: take back an office from a rival who holds two or more, at rank `strip` or higher (makes him an enemy instead).
function counterPolitical(s: GameState, out: Choice[], strip = 9) {
  // Switch "secrets": buy back what a known rival holds over you, when the silver is there.
  for (const id of seenHolders(s)) if (s.people[id].political && spare(s, silenceCost(s, id) + 1)) out.push({ a: "buySilence", args: { target: id }, min: 0.5 });
  const pr = others(s).filter((p) => p.political && alive(p)).sort((a, b) => b.political!.rank - a.political!.rank || influence(s, b.id) - influence(s, a.id));
  for (const p of pr) {
    const os = officesOf(s, p.id);
    if (p.political!.rank >= strip && os.length >= 2 && p.status === "free") {
      const o = (["generalship", "treasury", "citadel", "fleet", "assembly", "mint"] as OfficeId[]).find((x) => os.includes(x))!;
      out.push({ a: "revokeOffice", args: { target: p.id, second: o }, min: 0.5 });
    }
    // Switch "secrets": a deadly hold takes an office back without making an enemy of his faction; servants find holds.
    if (os.length && p.status === "free" && holdsDeadly(s, PLAYER, p.id)) out.push({ a: "demandOffice", args: { target: p.id, second: os[0] } });
    if (!leverageOver(s, PLAYER, p.id) && p.political!.rank >= 2 && spare(s, 2)) out.push({ a: "payServants", args: { target: p.id }, min: 0.5 });
    if (leverageOver(s, PLAYER, p.id)) out.push({ a: p.agenda?.id === "takePlace" ? "block" : "expose", args: { target: p.id } });
    if (p.political!.rank >= 2 || influence(s, p.id) >= playerInfluence(s)) {
      if (p.knownUntil < s.season) out.push({ a: "watch", args: { target: p.id } });
      const other = free(s).find((q) => q.id !== p.id);
      if (other) out.push({ a: "plantRumor", args: { target: p.id, second: other.id }, min: 0.5 });
    }
  }
}
// Leaders of factions whose agendas would hurt you: block them with what you know.
function blockAgendas(s: GameState, out: Choice[]) {
  for (const f of FACTIONS) {
    const ag = s.factions[f].agenda;
    const def = DATA.agendas.find((a) => a.id === ag.id);
    if (!def?.againstRuler || ag.done || ag.step < def.steps.length - 2) continue;
    const lead = leaderOf(s, f);
    if (!lead) continue;
    if (leverageOver(s, PLAYER, lead.id)) out.push({ a: "block", args: { target: lead.id } });
    else if (lead.status === "free" && lead.knownUntil < s.season) out.push({ a: "watch", args: { target: lead.id } });
  }
}

// ---------- The players ----------

const careful: Bot = {
  id: "careful", name: "The careful ruler",
  summary: "Pays the guard first, watches anyone with a grudge, pardons before plots can recruit, arrests only names it has, and answers petitions.",
  choices: (s) => {
    const out: Choice[] = [];
    basics(s, out);
    for (const p of knownPlotters(s).sort((a, b) => weight(s, b) - weight(s, a))) out.push({ a: "imprison", args: { target: p.id }, min: 0.5 });
    if (steady(s) < s.guard.upkeep && s.silver < 3 * s.guard.upkeep) income(s, out, false);
    counterPolitical(s, out, 2);
    outside(s, out, 0.34);
    const stage = worstStage(s);
    if (stage >= 2) {
      const rf = rumoredFactions(s);
      const sus = suspects(s).sort((a, b) => Number(rf.has(b.faction)) - Number(rf.has(a.faction)));
      for (const p of sus.slice(0, 2)) out.push({ a: "watch", args: { target: p.id } });
      if (spare(s, 1)) for (const p of sus.filter((p) => p.opinion >= 0).slice(0, 1)) out.push({ a: "turnInformer", args: { target: p.id }, min: 0.5 });
    }
    petitions(s, out, false);
    moods(s, out, 1);
    soothe(s, out, 2);
    blockAgendas(s, out);
    if (!s.citadelBuilt && spare(s, 4)) out.push({ a: "build", args: { target: "citadel" } });
    if (s.clock >= 5 && spare(s, 1)) out.push({ a: "envoy", min: 0.5 });
    if (s.clock >= 6 && !s.walls && spare(s, 3)) out.push({ a: "build", args: { target: "wall" } });
    if (s.silver - upkeepReserve(s) < 3) income(s, out, false);
    if (!s.granary && s.citadelBuilt && spare(s, 3)) out.push({ a: "build", args: { target: "granary" } });
    moods(s, out, 2);
    for (const ex of others(s).filter((p) => p.status === "outside" && p.rival)) out.push({ a: "offerTerms", args: { target: ex.id }, min: 0.5 });
    if (stage >= 1) for (const p of suspects(s).slice(0, 2)) out.push({ a: "watch", args: { target: p.id } });
    if (spare(s, 2)) { const low = free(s).sort((a, b) => a.opinion - b.opinion)[0]; if (low) out.push({ a: "feast", args: { target: low.id } }); }
    if (spare(s, 3) && s.guard.strength < 5) out.push({ a: "hire" });
    income(s, out, false);
    return out;
  },
};

const tyrant: Bot = {
  id: "tyrant", name: "The iron hand",
  summary: "Rules by force: hires mercenaries, builds the citadel, takes every office, arrests and executes anyone it suspects, seizes the rich, refuses petitions.",
  choices: (s) => {
    const out: Choice[] = [];
    basics(s, out);
    for (const p of others(s).filter((p) => p.status === "held" && (p.rival || p.grudges.length))) out.push({ a: "execute", args: { target: p.id } });
    for (const p of knownPlotters(s).sort((a, b) => weight(s, b) - weight(s, a))) out.push({ a: "imprison", args: { target: p.id }, min: 0.34 });
    out.push({ a: "strikeCoin" });
    if (steady(s) < s.guard.upkeep && s.silver < 3 * s.guard.upkeep) income(s, out, true);
    if (!s.citadelBuilt && spare(s, 4)) out.push({ a: "build", args: { target: "citadel" } });
    if (spare(s, 2 + s.guard.upkeep)) out.push({ a: "hire" });
    if (worstStage(s) >= 2) for (const p of suspects(s).slice(0, 2)) out.push({ a: "watch", args: { target: p.id } });
    // Take the offices back, the unarmed ones first.
    for (const o of ["mint", "assembly", "fleet"] as OfficeId[]) {
      const h = s.offices[o];
      if (h && h !== PLAYER && s.people[h].status === "free") out.push({ a: "revokeOffice", args: { target: h, second: o }, min: 0.5 });
    }
    // Arrest the dangerous before they act: grudge-holders with weight.
    for (const p of free(s).filter((p) => p.grudges.length && weight(s, p) >= 2).sort((a, b) => weight(s, b) - weight(s, a)).slice(0, 1))
      out.push({ a: "imprison", args: { target: p.id }, min: 0.5 });
    outside(s, out, 0.34, true);
    if (!s.factions.citizens.disarmed && s.factions.guard.mood >= 3) out.push({ a: "disarm", min: 0.5 });
    if (s.grain <= 4) out.push({ a: "buyGrain" });
    income(s, out, true);
    if (s.factions.guard.mood <= 2 && s.land > 0) out.push({ a: "grantGuard" });
    if (s.clock >= 6 && spare(s, 1)) out.push({ a: "envoy", min: 0.34 });
    if (s.clock >= 6 && !s.walls && spare(s, 3)) out.push({ a: "build", args: { target: "wall" } });
    for (const p of suspects(s).slice(0, 2)) out.push({ a: "watch", args: { target: p.id } });
    return out;
  },
};

const patron: Bot = {
  id: "patron", name: "The patron",
  summary: "Rules by favour: grants petitions and offices, arranges marriages, feeds the people, feasts rivals, buys off grudges, and counters rivals with rumors and secrets.",
  choices: (s) => {
    const out: Choice[] = [];
    basics(s, out);
    if (steady(s) < s.guard.upkeep && s.silver < 3 * s.guard.upkeep) income(s, out, false);
    const stage = worstStage(s);
    if (stage >= 3) for (const p of knownPlotters(s).sort((a, b) => weight(s, b) - weight(s, a)).slice(0, 1)) out.push({ a: "imprison", args: { target: p.id }, min: 0.5 });
    petitions(s, out, true);
    counterPolitical(s, out, 3);
    outside(s, out, 0.5);
    moods(s, out, 2);
    soothe(s, out, 2);
    if (stage >= 2) for (const p of suspects(s).slice(0, 1)) { out.push({ a: "watch", args: { target: p.id } }); if (spare(s, 1) && p.opinion >= 0) out.push({ a: "turnInformer", args: { target: p.id }, min: 0.5 }); }
    for (const pl of s.plots) for (const m of pl.known) if (s.people[m].status === "free") {
      const other = pl.known.find((x) => x !== m) ?? pl.leader;
      if (other !== m) out.push({ a: "plantRumor", args: { target: m, second: other }, min: 0.5 });
      out.push({ a: "pardon", args: { target: m } });
    }
    blockAgendas(s, out);
    for (const ex of others(s).filter((p) => p.status === "outside")) out.push({ a: "offerTerms", args: { target: ex.id }, min: 0.5 });
    if (!s.laws.includes("publicGrain") && spare(s, 2)) out.push({ a: "proposeLaw", args: { target: "publicGrain" }, min: 0.5 });
    if (s.clock >= 5 && spare(s, 1)) out.push({ a: "envoy", min: 0.5 });
    if (s.clock >= 6 && !s.walls && spare(s, 3)) out.push({ a: "build", args: { target: "wall" } });
    if (s.silver - upkeepReserve(s) < 3) income(s, out, false);
    if (!s.citadelBuilt && spare(s, 4)) out.push({ a: "build", args: { target: "citadel" } });
    if (spare(s, 1)) { const low = free(s).filter((p) => p.opinion < 2).sort((a, b) => weight(s, b) - weight(s, a))[0]; if (low) out.push({ a: "feast", args: { target: low.id } }); }
    for (const f of FACTIONS) { const fr = free(s).filter((p) => p.faction === f && p.opinion >= 1).sort((a, b) => b.opinion - a.opinion)[0]; if (fr && s.factions[f].mood < 4) out.push({ a: "petition", args: { target: fr.id }, min: 0.5 }); }
    income(s, out, false);
    return out;
  },
};

// Picks any legal action at random: a floor for how a careless player fares.
const careless: Bot = {
  id: "careless", name: "The careless ruler",
  summary: "Picks any legal action at random and lets petitions lapse. A floor, not a strategy.",
  choices: (s, r) => {
    const opts: Choice[] = [];
    for (const def of DATA.actions.filter((a) => !a.aiOnly && inScenario(s, a))) {
      const t = preview(s, def.id, {});
      if (t.ok) { opts.push({ a: def.id }); continue; }
      const targets = (menuTargets(s, def.id) ?? []).slice(0, 6);
      for (const tg of targets) {
        const sec = secondTargets(s, def.id, { target: tg });
        if (sec.length) opts.push({ a: def.id, args: { target: tg, second: sec[Math.floor(r() * sec.length)] } });
        else opts.push({ a: def.id, args: { target: tg } });
      }
    }
    for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
    return opts;
  },
};

import { IMPL } from "./actions.ts";
const menuTargets = (s: GameState, a: string) => IMPL[a]?.target?.(s)?.map((o) => o.value);
const secondTargets = (s: GameState, a: string, args: Args) => IMPL[a]?.second?.(s, args).map((o) => o.value) ?? [];

export const BOTS: Bot[] = [careful, patron, tyrant, careless];
export const botById = (id: string) => BOTS.find((b) => b.id === id);

// One season of play by a bot. Returns nothing; every move goes through the same menu and log as yours.
export function playSeason(s: GameState, bot: Bot, r: () => number) {
  let guard = 0;
  const tried = new Set<string>();
  while (s.slots > 0 && !s.over && guard++ < 12) {
    let done = false;
    for (const c of bot.choices(s, r)) {
      const key = `${c.a}:${c.args?.target ?? ""}:${c.args?.second ?? ""}:${c.args?.option ?? ""}`;
      if (tried.has(key) && !["buyGrain", "build"].includes(c.a)) continue;
      const pv = preview(s, c.a, c.args ?? {});
      if (!pv.ok) continue;
      if (!pv.auto && c.min !== undefined && (pv.chance ?? 0) < c.min) continue;
      tried.add(key);
      perform(s, c.a, c.args ?? {});
      done = true;
      break;
    }
    if (!done) break;
  }
}

// A bot's own random stream (mulberry32), apart from the game's dice.
export function botRandom(seed: number): () => number {
  let a = (seed ^ 0x9e3779b9) | 0;
  return () => {
    let t = (a = (a + 0x6d2b79f5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export { band, defense, power, vote };
