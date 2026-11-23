// Switch "greatWorks" (bet B4): great works built over seasons. Dionysius' power in 401 to 397 came from building
// (Diodorus 14.18, 14.41 to 14.43; docs/research/great-works.md). A work is an object: you begin it, choose whose
// labour builds it and who is set over it, and each season it takes silver, food and men until it is done.
// What it gives when done is real power: walls, engines, armour, a fleet. Some works anger Carthage.
// The works are history; every number and rule here is invention (data/works.json).
import worksJson from "../../data/works.json" with { type: "json" };
import { PLAYER, capital, nameOf, others } from "./state.ts";
import { clock, event, grain, guardSet, log, mood, opinion, silver } from "./ops.ts";
import { on } from "./switches.ts";
import { NODES, city, carthageArmy, lean, nodeName } from "./island.ts";
import type { Args, FactionId, GameState, Mod } from "./types.ts";
import { FACTIONS } from "./types.ts";

export interface WorkDef {
  id: string; name: string; kind: string; source: string; card: string; summary: string;
  labour: "peasants" | "craftsmen"; seasons: number; silver: number; grain: number; timber?: boolean;
  done: Record<string, unknown>[]; yourself?: { faction: FactionId; by: number; why: string }; doneText: string; replacesEvent?: string;
}
export interface LabourDef { id: string; name: string; short: string; for: string[]; summary: string; silver: number; harvestLoss?: number; citizens?: number; allies?: number; faster?: number; anger?: number }
export interface Work {
  id: string;
  labour: string;
  timber?: string;
  progress: number; // seasons of work done
  overseer: string; // "you", "foreman" (a hired man, no one of note) or a person id
  stalled: number; // seasons in a row with no silver to pay the men
  started: number;
  halted?: boolean;
  done?: number; // the season it was finished
}
export interface WorksState { list: Work[]; fleet?: boolean }

const W = worksJson as unknown as { knobs: Record<string, number>; labour: LabourDef[]; works: WorkDef[]; timber: { id: string; name: string; summary: string; silver: number }[]; fleet: { grain: number } };
export const WORKS = W.works;
export const WORK_KNOBS = W.knobs;
export const workById = (id: string) => WORKS.find((w) => w.id === id);
export const labourById = (id: string) => W.labour.find((l) => l.id === id);
export const worksOn = (s: GameState) => on(s, "greatWorks");
export const worksState = (s: GameState): WorksState => (s.works ??= { list: [] });
export const workOf = (s: GameState, id: string) => s.works?.list.find((w) => w.id === id);
export const activeWorks = (s: GameState) => (s.works?.list ?? []).filter((w) => w.done === undefined && !w.halted);
export const workDone = (s: GameState, id: string) => workOf(s, id)?.done !== undefined;
// Events the works take the place of while the switch is on, so the same wall is not offered twice.
export const REPLACED_EVENTS = new Set(WORKS.map((w) => w.replacesEvent).filter(Boolean) as string[]);

// Where the timber comes from: Mount Aetna if the road is open, else Italy, at a price.
export function timberFrom(s: GameState): string {
  if (!s.island) return "aetna";
  const hostile = (id: string) => ["carthage", "exiles"].includes(city(s, id).side);
  return hostile("aetna") || hostile("catana") ? "italy" : "aetna";
}
export const timberById = (id: string) => W.timber.find((t) => t.id === id)!;

// What one season of a work costs in silver, and how many seasons it needs in all.
export function seasonCost(w: WorkDef, labour: string, timber?: string): number {
  return w.silver + (labourById(labour)?.silver ?? 0) + (w.timber && timber ? timberById(timber).silver : 0);
}
export function seasonsNeeded(w: WorkDef, work: Pick<Work, "labour" | "overseer">): number {
  const faster = labourById(work.labour)?.faster ?? 0;
  const you = work.overseer === "you" ? WORK_KNOBS.yourselfSaves : 0;
  return Math.max(1, w.seasons - faster - you);
}
// A work's name inside a sentence: "the Epipolae wall", keeping the place name's capital.
export const the = (name: string) => name.replace(/^The /, "the ");
export const overseerName = (s: GameState, o: string) => (o === "you" ? "you" : o === "foreman" ? "a hired foreman" : capital(nameOf(s, o)));

// ---------- The season's work (the world step) ----------
export function worksSeason(s: GameState) {
  if (!worksOn(s) || !s.works || s.over) return;
  const q = s.season % 4;
  // The new fleet carries grain each autumn.
  if (s.works.fleet && q === 1) grain(s, W.fleet.grain, "the new fleet brings grain from Italy and the Greek cities");
  for (const work of activeWorks(s)) {
    const def = workById(work.id)!;
    const lab = labourById(work.labour)!;
    const ca = s.island && carthageArmy(s);
    if (ca && ca.siege === "syracuse") { event(s, "world", `No work is done on ${the(def.name)} this season.`, "Carthage's army is at the walls"); continue; }
    if (work.overseer !== "you" && work.overseer !== "foreman" && s.people[work.overseer]?.status !== "free") {
      event(s, "world", `${capital(nameOf(s, work.overseer))} can no longer oversee ${the(def.name)}; a hired foreman takes his place.`, "he is no longer free in the city");
      work.overseer = "foreman";
    }
    const cost = seasonCost(def, work.labour, work.timber);
    if (s.silver < cost) {
      work.stalled += 1;
      event(s, "world", `The men on ${the(def.name)} go unpaid and down their tools.`, `a season of it costs ${cost} silver and the treasury has ${s.silver}`);
      if (work.stalled >= WORK_KNOBS.stallLimit && work.progress > 0) {
        work.progress -= 1;
        event(s, "world", `Craftsmen drift away from ${the(def.name)}, and a season's work is lost.`, `${work.stalled} seasons unpaid`);
      }
      continue;
    }
    work.stalled = 0;
    if (work.overseer === "you") {
      if (s.slots > 1) { s.slots -= 1; event(s, PLAYER, `You spend your days on ${the(def.name)}, among the workmen (one action fewer this season).`, "you oversee the works yourself"); }
    }
    silver(s, -cost, `a season's work on ${the(def.name)} (${lab.short})`);
    if (def.grain) grain(s, -def.grain, `the workers on ${the(def.name)} must eat`);
    if (q === 3 && lab.harvestLoss) grain(s, -lab.harvestLoss, `the men on ${the(def.name)} were not in the fields for the harvest`);
    if (lab.anger) clock(s, lab.anger, `Carthage counts the craftsmen who left its lands for ${the(def.name)}`);
    // An overseer who is no friend of yours keeps some of the silver. The accounts show the loss, not the thief.
    const o = s.people[work.overseer];
    if (o && o.opinion < 0) {
      silver(s, -WORK_KNOBS.foremanSkims, `the accounts of ${the(def.name)} come up short`);
      log(s, { actor: o.id, text: `${capital(o.name)} skims the silver of ${the(def.name)}.`, why: "he is set over the works and no friend of yours", visible: false, kind: "event" });
    }
    work.progress += 1;
    const need = seasonsNeeded(def, work);
    if (work.progress >= need) finish(s, work, def);
    else event(s, "world", `Work goes on at ${the(def.name)}: ${work.progress} of ${need} seasons done.`, `${overseerName(s, work.overseer)} ${work.overseer === "you" ? "oversee" : "oversees"} it`);
  }
}

function finish(s: GameState, work: Work, def: WorkDef) {
  work.done = s.season;
  s.counters.worksDone = (s.counters.worksDone ?? 0) + 1;
  event(s, PLAYER, def.doneText, `${def.name} is finished`);
  for (const e of def.done) {
    if (e.walls) { s.walls = true; event(s, "world", s.island ? "Syracuse's walls rise by one." : "The city has its wall.", def.name); }
    if (e.flag) s.flags[e.flag as string] = s.season;
    if (e.flag === "armed") event(s, "world", "Your armies will storm walls with engines and catapults.", def.name);
    if (e.guard) guardSet(s, "strength", e.guard as number, "armour and arms from the workshops");
    if (e.levy && s.island) { city(s, "syracuse").men += e.levy as number; event(s, "world", "The citizens are armed from the workshops: Syracuse has more men to hold its walls.", def.name); }
    if (e.anger) clock(s, e.anger as number, e.why as string);
    if (e.fleet) { worksState(s).fleet = true; event(s, "world", "The new fleet will bring grain each autumn and hold the sea.", def.name); }
  }
  if (work.overseer === "you" && def.yourself) mood(s, def.yourself.faction, def.yourself.by, def.yourself.why);
  const o = s.people[work.overseer];
  if (o && o.status === "free") {
    o.infl += WORK_KNOBS.overseerInfluence;
    event(s, o.id, `${capital(o.name)} gains standing: the city knows who built ${the(def.name)}.`, "he was set over the works");
    opinion(s, o.id, 1, `the honour of ${the(def.name)}`);
  }
}

// ---------- Your actions ----------
interface Option { value: string; label: string }
interface Impl {
  target?: (s: GameState) => Option[];
  second?: (s: GameState, a: Args) => Option[];
  secondLabel?: string;
  check?: (s: GameState, a: Args) => string | null;
  odds?: (s: GameState, a: Args) => Mod[] | null;
  run: (s: GameState, a: Args, ok: boolean, die: number) => void;
}
const free = (s: GameState) => others(s).filter((p) => p.status === "free");
const factionWord = (s: GameState, f: string) => (FACTIONS.includes(f as FactionId) ? s.factions[f as FactionId].short : "your family");

export const WORKS_IMPL: Record<string, Impl> = {
  beginWork: {
    target: (s) => WORKS.filter((w) => !workDone(s, w.id) && !activeWorks(s).some((x) => x.id === w.id)).map((w) => {
      const half = workOf(s, w.id);
      return { value: w.id, label: half ? `Take up ${the(w.name)} again (${half.progress} seasons done)` : `${w.name} (${w.seasons} season${w.seasons > 1 ? "s" : ""} of work, from ${w.silver} silver a season)` };
    }),
    second: (s, a) => {
      const w = a.target && workById(a.target);
      if (!w) return [];
      const t = w.timber ? timberFrom(s) : undefined;
      return W.labour.filter((l) => l.for.includes(w.labour)).map((l) => ({ value: l.id, label: `${l.name}: ${seasonCost(w, l.id, t)} silver a season. ${l.summary}` }));
    },
    secondLabel: "Whose labour",
    check: (s) => (activeWorks(s).length >= WORK_KNOBS.atOnce ? `the city can carry only ${WORK_KNOBS.atOnce} great works at once` : null),
    run: (s, a) => {
      const def = workById(a.target!)!;
      const lab = labourById(a.second!)!;
      const st = worksState(s);
      let work = workOf(s, def.id);
      const timber = def.timber ? timberFrom(s) : undefined;
      if (work) { work.halted = false; work.labour = lab.id; work.timber = timber; work.stalled = 0; }
      else { work = { id: def.id, labour: lab.id, timber, progress: 0, overseer: "foreman", stalled: 0, started: s.season }; st.list.push(work); }
      event(s, PLAYER, `Work begins on ${the(def.name)}, with ${lab.short}. It needs ${seasonsNeeded(def, work) - work.progress} more season${seasonsNeeded(def, work) - work.progress > 1 ? "s" : ""} and ${seasonCost(def, lab.id, timber)} silver each season, from next season on.`, "Begin a great work");
      if (timber) event(s, "world", `The woodmen go to ${timber === "aetna" ? "Mount Aetna" : "Italy"} for the timber.`, timber === "aetna" ? "the road to Aetna is open" : "the road to Aetna is closed to you, so the timber must come by sea");
      if (lab.citizens) mood(s, "citizens", lab.citizens, `the peasants are taken from their fields for ${the(def.name)}`);
      if (lab.allies && s.island) for (const n of NODES) if (city(s, n.id).side === "ally") lean(s, n.id, lab.allies, `you commandeered its craftsmen for ${the(def.name)}`);
    },
  },
  overseeWork: {
    target: (s) => activeWorks(s).map((w) => ({ value: w.id, label: `${workById(w.id)!.name} (now ${overseerName(s, w.overseer)})` })),
    second: (s, a) => {
      const w = a.target && workOf(s, a.target);
      if (!w) return [];
      const out: Option[] = [];
      if (w.overseer !== "you") out.push({ value: "you", label: "Yourself: it costs you one action every season, but the work goes a season faster and the city sees you toil" });
      if (w.overseer !== "foreman") out.push({ value: "foreman", label: "A hired foreman: no one of note gains from it" });
      for (const p of free(s)) if (p.id !== w.overseer) out.push({ value: p.id, label: `${capital(p.name)} (${factionWord(s, p.faction)}): his people are pleased, and he gains standing when it is done` });
      return out;
    },
    secondLabel: "Who is set over it",
    run: (s, a) => {
      const w = workOf(s, a.target!)!;
      const def = workById(w.id)!;
      w.overseer = a.second!;
      event(s, PLAYER, `${capital(overseerName(s, w.overseer))} ${w.overseer === "you" ? "take charge of" : "is set over"} ${the(def.name)}.`, "Set a man over the works");
      const p = s.people[w.overseer];
      if (p && FACTIONS.includes(p.faction as FactionId)) mood(s, p.faction as FactionId, 1, `${p.name}, one of their own, is set over ${the(def.name)}`);
      if (p) opinion(s, p.id, 1, "you trusted him with the works");
    },
  },
  haltWork: {
    target: (s) => activeWorks(s).map((w) => ({ value: w.id, label: `${workById(w.id)!.name} (${w.progress} seasons done; the work done is kept)` })),
    run: (s, a) => {
      const w = workOf(s, a.target!)!;
      w.halted = true;
      event(s, PLAYER, `You stop the work on ${the(workById(w.id)!.name)}. What is built stands, half-done.`, "Halt a great work");
    },
  },
};

// ---------- What a headless player does ----------
// It builds in Diodorus' order (the wall, then the arms, then the fleet), only with silver to spare and no plot
// near the blow, and sets a friend over the works if it has one.
export function worksChoices(s: GameState): { a: string; args?: Args }[] {
  if (!worksOn(s) || s.over) return [];
  const out: { a: string; args?: Args }[] = [];
  const danger = s.plots.some((pl) => pl.stage >= 2);
  const active = activeWorks(s);
  for (const w of active) if (w.stalled >= WORK_KNOBS.stallLimit) out.push({ a: "haltWork", args: { target: w.id } }); // stop paying for nothing
  for (const w of active) {
    if (w.overseer !== "foreman") continue;
    const friend = free(s).filter((p) => p.opinion >= 2).sort((a, b) => b.opinion - a.opinion || a.id.localeCompare(b.id))[0];
    if (friend) out.push({ a: "overseeWork", args: { target: w.id, second: friend.id } });
  }
  if (!danger && active.length === 0 && s.silver >= 8) {
    const next = WORKS.find((w) => !workDone(s, w.id));
    if (next) {
      const labour = next.labour === "peasants" ? (s.silver >= 12 ? "hired" : "peasants") : s.silver >= 10 ? "abroad" : "subjects";
      out.push({ a: "beginWork", args: { target: next.id, second: labour } });
    }
  }
  return out;
}
