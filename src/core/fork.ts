// Change the past (Workshop bet B2). Every game is its seed, options and your inputs, so it replays exactly.
// This file loads a recorded game at the start of any season, lists the choices you made in it, rewrites one
// of them ("the other choice"), and compares two histories side by side with the season where they split.
// No new rules and no dice of its own: everything here is replay. The same seed and inputs give the same game.
import { replay, startGame, act, endSeason, refuseRequest, chooseEvent } from "./season.ts";
import { eventById, eventsState, viewChoice, fill, botAnswer } from "./events.ts";
import { botById, playSeason, botRandom } from "./bots.ts";
import { IMPL } from "./actions.ts";
import { actionById } from "./data.ts";
import { seasonName, government, capital } from "./state.ts";
import type { GameOpts, GameState, Input, LogEntry, Scenario } from "./types.ts";

// A recorded game: all it takes to rebuild one. The same shape as the browser's save and the replay export.
export interface Recorded { seed: number; tuning?: string; scenario?: Scenario; switches?: string[]; inputs: Input[] }

export function recordOf(s: GameState): Recorded {
  return { seed: s.seed, tuning: s.tuning, scenario: s.scenario ?? "citadel", switches: [...(s.switches ?? [])], inputs: s.inputs.map((i) => JSON.parse(JSON.stringify(i))) };
}
const optsOf = (r: Recorded): GameOpts => ({ scenario: r.scenario === "island" ? "island" : "citadel", switches: r.switches ?? [] });
export const play = (r: Recorded): GameState => replay(r.seed, r.inputs, r.tuning, optsOf(r));

// Where each season's inputs begin: starts[k] is the index of the first input of season k (after k "end"s).
export function seasonStarts(inputs: Input[]): number[] {
  const out = [0];
  inputs.forEach((i, n) => { if (i.t === "end") out.push(n + 1); });
  return out;
}

// The game as it stood when your turn began in that season: the world, the people and the factions have moved,
// and nothing of yours has happened yet. A branch made here matches its parent up to this point, die for die.
export function loadAt(r: Recorded, season: number): GameState {
  const starts = seasonStarts(r.inputs);
  const k = Math.max(0, Math.min(season, starts.length - 1));
  return replay(r.seed, r.inputs.slice(0, starts[k]), r.tuning, optsOf(r));
}
// The record cut at the start of a season, to play on from by hand.
export function recordAt(r: Recorded, season: number): Recorded {
  const starts = seasonStarts(r.inputs);
  const k = Math.max(0, Math.min(season, starts.length - 1));
  return { ...r, switches: [...(r.switches ?? [])], inputs: r.inputs.slice(0, starts[k]) };
}

// ---------- The choices you made, in words ----------
export interface Alternative { id: string; label: string; blocked: string | null }
export interface Decision {
  index: number; // where in the inputs it sits (for an unanswered event: the season's "end")
  season: number;
  kind: "act" | "choose" | "unanswered" | "refuse";
  label: string; // "You hold a feast for Hipparinus", "At 'The banquet': you chose 'Refuse'"
  event?: string; // the event's uid, for "choose" and "unanswered"
  chosen?: string; // the choice taken
  alternatives: Alternative[]; // the other choices that were open then (events only)
}

function actLabel(s: GameState, i: Extract<Input, { t: "act" }>): string {
  const def = actionById(i.action);
  const impl = IMPL[i.action];
  const name = def?.name ?? "an action";
  const tgt = i.args.target ? impl?.target?.(s).find((o) => o.value === i.args.target)?.label : undefined;
  const sec = i.args.second ? impl?.second?.(s, i.args).find((o) => o.value === i.args.second)?.label : undefined;
  return [name, tgt && `(${tgt}${sec ? `, ${sec}` : ""})`].filter(Boolean).join(" ");
}

// Walk a record input by input and describe each choice from the state just before it.
export function decisions(r: Recorded): Decision[] {
  const s = startGame(r.seed, r.tuning, optsOf(r));
  const out: Decision[] = [];
  r.inputs.forEach((i, index) => {
    const season = s.season;
    if (i.t === "act") {
      out.push({ index, season, kind: "act", label: actLabel(s, i), alternatives: [] });
      act(s, i.action, i.args);
    } else if (i.t === "choose") {
      const inst = eventsState(s).open.find((o) => o.uid === i.event);
      const def = inst ? eventById(inst.id) : undefined;
      if (inst && def) {
        const views = (def.choices ?? []).map((c) => viewChoice(s, inst, c));
        const took = views.find((v) => v.id === i.choice);
        out.push({ index, season, kind: "choose", event: i.event, chosen: i.choice, label: `${fill(s, def.name, inst.roles)}: you chose “${took?.label ?? i.choice}”`, alternatives: views.filter((v) => v.id !== i.choice).map((v) => ({ id: v.id, label: v.label, blocked: v.blocked })) });
      }
      chooseEvent(s, i.event, i.choice);
    } else if (i.t === "refuse") {
      const q = s.requests.find((x) => x.id === i.request);
      if (q) out.push({ index, season, kind: "refuse", label: `You refused ${capital(s.people[q.from]?.name ?? "a petitioner")}'s request`, alternatives: [] });
      refuseRequest(s, i.request);
    } else {
      // Events you left open take their default when the season ends; that was a choice too.
      for (const inst of eventsState(s).open) {
        const def = eventById(inst.id);
        if (!def?.choices?.length) continue;
        const views = def.choices.map((c) => viewChoice(s, inst, c));
        const d = def.choices.find((c) => c.default) ?? def.choices[0];
        out.push({ index, season, kind: "unanswered", event: inst.uid, chosen: d.id, label: `${fill(s, def.name, inst.roles)}: left unanswered, so “${views.find((v) => v.id === d.id)?.label ?? d.id}”`, alternatives: views.filter((v) => v.id !== d.id).map((v) => ({ id: v.id, label: v.label, blocked: v.blocked })) });
      }
      endSeason(s);
    }
  });
  return out;
}
export const decisionsIn = (r: Recorded, season: number) => decisions(r).filter((d) => d.season === season);

// ---------- The other choice ----------
// Change one event answer (or drop one action) and either stop there, to play on by hand, or keep everything
// else you did the same. Kept inputs are matched by meaning, not by number: an answer goes to the same event
// if it fires again, a refusal to the same person's request. What no longer fits is listed, never forced.
export interface Rewrite { record: Recorded; game: GameState; skipped: { season: number; label: string; why: string }[] }
export type Change = { decision: Decision; choice?: string; drop?: boolean };

interface Meaning { input: Input; season: number; label: string; eventId?: string; roles?: string; from?: string; kind?: string }

function meanings(r: Recorded): Meaning[] {
  const s = startGame(r.seed, r.tuning, optsOf(r));
  return r.inputs.map((i) => {
    const m: Meaning = { input: i, season: s.season, label: "" };
    if (i.t === "act") { m.label = actLabel(s, i); act(s, i.action, i.args); }
    else if (i.t === "choose") {
      const inst = eventsState(s).open.find((o) => o.uid === i.event);
      if (inst) { m.eventId = inst.id; m.roles = JSON.stringify(inst.roles); m.label = `your answer to ${fill(s, eventById(inst.id)?.name ?? "an event", inst.roles)}`; }
      chooseEvent(s, i.event, i.choice);
    } else if (i.t === "refuse") {
      const q = s.requests.find((x) => x.id === i.request);
      if (q) { m.from = q.from; m.kind = q.kind; m.label = `refusing ${capital(s.people[q.from]?.name ?? "a petitioner")}`; }
      refuseRequest(s, i.request);
    } else { m.label = "the end of the season"; endSeason(s); }
    return m;
  });
}

// Play one remembered input on a branch, matched by meaning. Returns why it could not be played, or null.
function playMeaning(s: GameState, m: Meaning): string | null {
  const i = m.input;
  if (s.over) return "the game had already ended";
  if (i.t === "end") { endSeason(s); return null; }
  if (m.season !== s.season) return "the seasons no longer line up";
  if (i.t === "act") { const res = act(s, i.action, i.args); return res.ok ? null : res.error ?? "not possible"; }
  if (i.t === "choose") {
    const open = eventsState(s).open.filter((o) => o.id === m.eventId);
    const inst = open.find((o) => JSON.stringify(o.roles) === m.roles) ?? open[0];
    if (!inst) return "it never happened this time";
    const res = chooseEvent(s, inst.uid, i.choice);
    return res.ok ? null : res.error ?? "not possible";
  }
  const q = s.requests.find((x) => x.from === m.from && x.kind === m.kind);
  if (!q) return "no such request this time";
  refuseRequest(s, q.id);
  return null;
}

// When your remembered inputs run out before the branch's game ends, a bot can play on to the end
// ("careful" by default in the debrief). Its moves are ordinary inputs, so the branch still replays.
const ERR: Record<string, string> = { "choose a target": "that person or place was no longer there to choose", "unknown action": "it was not open this time" };
export function rewrite(r: Recorded, change: Change, keepRest: boolean, thenBot?: string): Rewrite {
  const d = change.decision;
  const ms = meanings(r);
  const s = replay(r.seed, r.inputs.slice(0, d.index), r.tuning, optsOf(r));
  const skipped: Rewrite["skipped"] = [];
  // The changed choice itself.
  if (!change.drop) {
    if (!change.choice || !d.event) throw new Error("a changed answer needs an event and a choice");
    const res = chooseEvent(s, d.event, change.choice);
    if (!res.ok) throw new Error(`that choice can't be taken: ${res.error}`);
  }
  // For an unanswered event the remembered input at d.index is the season's end, which still has to happen.
  const from = d.kind === "unanswered" ? d.index : d.index + 1;
  if (keepRest) {
    for (const m of ms.slice(from)) {
      if (s.over) break;
      const why = playMeaning(s, m);
      if (why) skipped.push({ season: m.season, label: m.label, why: ERR[why] ?? why });
    }
  }
  const bot = thenBot ? botById(thenBot) : undefined;
  if (thenBot && !bot) throw new Error(`unknown bot: ${thenBot}`);
  if (bot) {
    const rnd = botRandom(r.seed + 7919 * (d.index + 1)); // the bot's own stream, fixed by the record and the change
    let n = 0;
    while (!s.over && n++ < 200) { botAnswer(s); playSeason(s, bot, rnd); endSeason(s); }
  }
  return { record: recordOf(s), game: s, skipped };
}

// ---------- Two histories side by side ----------
export interface SeasonPair { season: number; name: string; a: string | null; b: string | null; same: boolean }
export interface FateLine { id: string; name: string; a: string; b: string }
export interface Comparison {
  split: number | null; // the season where the two first differ (null: the same history)
  splitLine: { a: string | null; b: string | null }; // the first thing that happened differently
  seasons: SeasonPair[];
  endings: { a: string; b: string };
  government: { a: string; b: string };
  fates: FateLine[]; // named people whose fate differs
  luck: { a: { rolls: number; mean: number; failed: number }; b: { rolls: number; mean: number; failed: number } }; // your rolls after the split
}

const sameEntry = (x: LogEntry, y: LogEntry) => x.season === y.season && x.text === y.text && x.kind === y.kind && (x.roll?.die ?? 0) === (y.roll?.die ?? 0);
const chronicleOf = (s: GameState) => {
  const out: Record<number, string> = {};
  for (const e of s.log) if (e.kind === "chronicle") { const i = e.text.indexOf(". "); out[e.season] = e.text.slice(i + 2); }
  return out;
};
const FATE: Record<string, string> = { free: "free in the city", held: "in prison", outside: "outside the walls", dead: "dead", absent: "away" };
function fateOf(s: GameState, id: string): string {
  const p = s.people[id];
  if (!p || (p.status === "absent" && p.enters > s.season)) return "never came into the story";
  const word = FATE[p.status] ?? p.status;
  if (p.status === "free") return word;
  const when = [...s.log].reverse().find((e) => e.actor === id && e.kind === "change" && /^.+ (is dead|is held under guard|is outside the walls)\.$/.test(e.text));
  return when ? `${word} (${seasonName(when.season)})` : word;
}
function luckOf(s: GameState, from: number) {
  const rs = s.log.filter((e) => e.season >= from && e.roll && e.actor === "dionysius").map((e) => e.roll!);
  const mean = rs.length ? Math.round((rs.reduce((t, r) => t + r.die, 0) / rs.length) * 10) / 10 : 0;
  return { rolls: rs.length, mean, failed: rs.filter((r) => !r.ok).length };
}
const endingOf = (s: GameState) => (s.over ? `${s.over.text} (${seasonName(s.over.season)})` : `Still playing, ${seasonName(s.season)}.`);

export function compare(a: GameState, b: GameState): Comparison {
  let n = 0;
  while (n < a.log.length && n < b.log.length && sameEntry(a.log[n], b.log[n])) n++;
  const differ = n < a.log.length || n < b.log.length;
  const split = differ ? Math.min(a.log[n]?.season ?? Infinity, b.log[n]?.season ?? Infinity) : null;
  // The first visible difference, in words (hidden rolls can differ first; show what a player could see).
  // The changed answer itself ("You choose: ...") is skipped: the reader knows it; what came of it is the news.
  const firstSeen = (s: GameState) => s.log.slice(n).find((e) => e.visible && e.kind !== "chronicle" && !/ You choose: /.test(e.text))?.text ?? null;
  const ca = chronicleOf(a), cb = chronicleOf(b);
  const last = Math.max(...Object.keys(ca).map(Number), ...Object.keys(cb).map(Number), 0);
  const seasons: SeasonPair[] = [];
  for (let i = 0; i <= last; i++) {
    const x = ca[i] ?? null, y = cb[i] ?? null;
    seasons.push({ season: i, name: seasonName(i), a: x, b: y, same: x === y && (split === null || i < split) });
  }
  const fates: FateLine[] = [];
  for (const id of Object.keys(a.people)) {
    if (a.people[id].player || !b.people[id]) continue;
    const fa = fateOf(a, id), fb = fateOf(b, id);
    if (fa !== fb) fates.push({ id, name: capital(a.people[id].name), a: fa, b: fb });
  }
  const from = split ?? 0;
  return {
    split, splitLine: { a: differ ? firstSeen(a) : null, b: differ ? firstSeen(b) : null }, seasons,
    endings: { a: endingOf(a), b: endingOf(b) }, government: { a: government(a), b: government(b) }, fates,
    luck: { a: luckOf(a, from), b: luckOf(b, from) },
  };
}

// The rolls you never saw: every hidden roll in the log, in order (for the debrief).
export function hiddenRolls(s: GameState): { season: string; text: string; die: number; total: number; need: number; ok: boolean }[] {
  return s.log.filter((e) => e.roll && !e.visible).map((e) => ({ season: seasonName(e.season), text: e.text, die: e.roll!.die, total: e.roll!.total, need: e.roll!.need, ok: e.roll!.ok }));
}
