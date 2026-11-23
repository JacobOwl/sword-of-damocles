// Finds story shapes (data/story-shapes.json) in a finished game's log, and scores the game for story.
// It reads only the log and the end state, the same things the chronicle reads. Nothing here changes a game.
import { readFileSync } from "node:fs";
import { NODES, seasonName, storyBook } from "../../src/core/index.ts";
import type { GameState, LogEntry } from "../../src/core/index.ts";

type Step = string | { re: string; kind?: string };
export interface Find {
  type: "person" | "city" | "log" | "repeat" | "quiet" | "sentence" | "short" | "ending";
  steps?: Step[]; gap?: number; within?: number; faction?: string; either?: boolean;
  match?: string; min?: number; seasons?: number; before?: number;
  reason?: string[]; warned?: number; named?: boolean; unwarned?: boolean;
}
export interface Shape { id: string; name: string; line: string; weight: number; kind: string; dull?: boolean; find: Find }
export interface ShapesFile { about: string; kind: string; turns: string; shapes: Shape[] }

export const SHAPES_FILE: ShapesFile = JSON.parse(readFileSync(new URL("../../data/story-shapes.json", import.meta.url), "utf8"));
export const FIND_TYPES = ["person", "city", "log", "repeat", "quiet", "sentence", "short", "ending"];

// One time a shape happened: when, about whom, and the log lines that show it (quoted, never rewritten).
export interface Found { shape: string; season: number; who?: string; evidence: { season: number; text: string }[] }

const step = (x: Step) => (typeof x === "string" ? { re: new RegExp(x), kind: undefined } : { re: new RegExp(x.re), kind: x.kind });
const hits = (e: LogEntry, x: ReturnType<typeof step>) => (x.kind ? e.kind === x.kind : e.kind === "event" || e.kind === "change") && x.re.test(e.text);
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

// Who an entry is about: its actor if that is a person, else the person your own deed names
// (the longest name that appears, so "the brother of Demarchus" is not read as Demarchus).
function aboutWhom(s: GameState, e: LogEntry): string | undefined {
  const p = s.people[e.actor];
  if (p && !p.player) return e.actor;
  if (e.actor !== "dionysius") return undefined;
  let best: { id: string; len: number } | undefined;
  for (const q of Object.values(s.people)) {
    if (q.player) continue;
    if ((e.text.includes(q.name) || e.text.includes(cap(q.name))) && (!best || q.name.length > best.len)) best = { id: q.id, len: q.name.length };
  }
  return best?.id;
}

// Match steps in order over a list of entries: each step comes after the one before, at least `gap` seasons later,
// and the whole run lies within `within` seasons of its first step. The first full run wins.
function sequence(es: LogEntry[], steps: Step[], gap = 0, within?: number): LogEntry[] | undefined {
  const ss = steps.map(step);
  for (let start = 0; start < es.length; start++) {
    if (!hits(es[start], ss[0])) continue;
    const out = [es[start]];
    for (let j = start + 1; j < es.length && out.length < ss.length; j++) {
      const e = es[j], prev = out[out.length - 1];
      if (within !== undefined && e.season - out[0].season > within) break;
      if (e.season < prev.season + gap || e.n <= prev.n) continue;
      if (hits(e, ss[out.length])) out.push(e);
    }
    if (out.length === ss.length) return out;
  }
  return undefined;
}

const ev = (xs: LogEntry[]) => xs.map((e) => ({ season: e.season, text: e.text }));

function findOne(s: GameState, sh: Shape, turns: RegExp): Found[] {
  const f = sh.find;
  const log = s.log.filter((e) => e.visible);
  const out: Found[] = [];
  if (f.type === "person") {
    const by: Record<string, LogEntry[]> = {};
    for (const e of log) { const w = aboutWhom(s, e); if (w) (by[w] ??= []).push(e); }
    for (const [id, es] of Object.entries(by)) {
      if (f.faction && s.people[id].faction !== f.faction) continue;
      const m = sequence(es, f.steps!, f.gap ?? 0, f.within);
      if (m) out.push({ shape: sh.id, season: m[m.length - 1].season, who: id, evidence: ev(m) });
    }
  } else if (f.type === "city") {
    for (const n of NODES) {
      const es = log.filter((e) => e.text.includes(n.name));
      const m = sequence(es, f.steps!, 1) ?? (f.either ? sequence(es, [...f.steps!].reverse(), 1) : undefined);
      if (m) out.push({ shape: sh.id, season: m[m.length - 1].season, who: n.name, evidence: ev(m) });
    }
  } else if (f.type === "log") {
    const m = sequence(log.filter((e) => e.kind !== "chronicle"), f.steps!, 0, f.within);
    if (m) out.push({ shape: sh.id, season: m[m.length - 1].season, evidence: ev(m) });
  } else if (f.type === "repeat") {
    const re = new RegExp(f.match!);
    const by: Record<string, LogEntry[]> = {};
    for (const e of log) if (e.kind === "event" && re.test(e.text)) { const w = aboutWhom(s, e); if (w) (by[w] ??= []).push(e); }
    for (const [id, es] of Object.entries(by)) if (es.length >= f.min!) out.push({ shape: sh.id, season: es[f.min! - 1].season, who: id, evidence: ev(es.slice(0, f.min!)) });
  } else if (f.type === "quiet") {
    const last = s.over?.season ?? s.season - 1;
    const busy = new Set(log.filter((e) => (e.kind === "event" || e.kind === "change") && turns.test(e.text)).map((e) => e.season));
    let run = 0;
    for (let i = 0; i <= last; i++) {
      run = busy.has(i) ? 0 : run + 1;
      if (run === f.seasons) { out.push({ shape: sh.id, season: i, evidence: [{ season: i - run + 1, text: `Nothing turns from ${seasonName(i - run + 1)} to ${seasonName(i)}.` }] }); break; }
    }
  } else if (f.type === "sentence") {
    const said: Record<string, number> = {};
    for (const e of log.filter((e) => e.kind === "chronicle")) for (const x of e.text.slice(e.text.indexOf(". ") + 2).split(/(?<=\.)\s+/)) if (x.length > 25) said[x] = (said[x] ?? 0) + 1;
    const top = Object.entries(said).sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] >= f.min!) out.push({ shape: sh.id, season: s.over?.season ?? s.season, evidence: [{ season: -1, text: `${top[0]} (${top[1]} times)` }] });
  } else if (f.type === "short") {
    if (s.over && s.over.reason !== "survived" && s.over.season < f.before!) out.push({ shape: sh.id, season: s.over.season, evidence: [{ season: s.over.season, text: s.over.text }] });
  } else if (f.type === "ending") {
    if (!s.over || !f.reason!.includes(s.over.reason)) return out;
    const end = s.over.season;
    if (f.warned !== undefined) {
      const warns = log.filter((e) => e.kind === "warning" && e.season >= end - f.warned! && e.season <= end);
      const leader = s.over.by ? s.people[s.over.by] : undefined;
      const named = !!leader && log.some((e) => e.season <= end && (e.kind === "warning" || /is in a plot against you|plots against you|names everyone/.test(e.text)) && (e.text.includes(leader.name) || e.text.includes(cap(leader.name))));
      if (f.unwarned ? warns.length > 0 : !warns.length || (f.named && !named)) return out;
      out.push({ shape: sh.id, season: end, who: s.over.by, evidence: [...ev(warns.slice(-2)), { season: end, text: s.over.text }] });
    } else out.push({ shape: sh.id, season: end, evidence: [{ season: end, text: s.over.text }] });
  }
  return out;
}

export function findShapes(s: GameState, file: ShapesFile = SHAPES_FILE): Found[] {
  const turns = new RegExp(file.turns);
  return file.shapes.flatMap((sh) => findOne(s, sh, turns)).sort((a, b) => a.season - b.season);
}

// The score: each shape's weight, counted at most twice a game (a second friend who turns is still news;
// a fifth is the same story), plus half a point for each person whose thread has three or more beats
// (up to four), so a reign full of people beats one full of numbers. Dull shapes subtract.
export interface Score { total: number; ten: number; shapes: Record<string, number>; people: number }
export function scoreGame(s: GameState, found: Found[], file: ShapesFile = SHAPES_FILE): Score {
  const w = Object.fromEntries(file.shapes.map((x) => [x.id, x.weight]));
  const count: Record<string, number> = {};
  let total = 0, ten = 0;
  const tenCount: Record<string, number> = {};
  for (const f of found) {
    count[f.shape] = (count[f.shape] ?? 0) + 1;
    if (count[f.shape] <= 2) total += w[f.shape];
    if (f.season <= 9 && w[f.shape] > 0) { tenCount[f.shape] = (tenCount[f.shape] ?? 0) + 1; if (tenCount[f.shape] <= 2) ten += w[f.shape]; }
  }
  const people = Math.min(4, storyBook(s).lives.length);
  total += people / 2;
  return { total: Math.round(total * 10) / 10, ten, shapes: count, people };
}
