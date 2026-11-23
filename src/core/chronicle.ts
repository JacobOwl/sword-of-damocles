// The chronicle reads the season's log and writes it up in plain words. No LLM, no invented facts:
// every sentence comes from a logged action.
import { seasonName } from "./state.ts";
import { log } from "./ops.ts";
import { on } from "./switches.ts";
import { titledName } from "./feud.ts";
import type { GameState, LogEntry } from "./types.ts";

const SKIP = /^(Your watchers learn nothing|.* keeps his head down|.* does nothing this season)/;

export function seasonEntries(s: GameState, season: number, all = false): LogEntry[] {
  return s.log.filter((e) => e.season === season && (all || e.visible));
}

export function chronicleText(s: GameState, season: number): string {
  const es = seasonEntries(s, season).filter((e) => (e.kind === "event" || e.kind === "warning") && !SKIP.test(e.text));
  const deeds = es.filter((e) => e.kind === "event").map((e) => e.text);
  const warnings = es.filter((e) => e.kind === "warning").map((e) => e.text.replace(/^(Whispers|Rumors|Named): /, ""));
  const keep = deeds.length > 12 ? [...deeds.slice(0, 6), ...deeds.slice(-6)] : deeds;
  let text = keep.join(" ");
  if (warnings.length) text += ` ${warnings.join(" ")}`;
  return text.trim() || "A quiet season.";
}

export function writeChronicle(s: GameState) {
  const text = on(s, "storyChronicle") ? ((x) => (x ? [...x.paragraphs, ...x.omens].join(" ") : "A quiet season."))(storyBook(s, s.season).seasons.find((x) => x.season === s.season)) : chronicleText(s, s.season);
  log(s, { actor: "world", text: `${seasonName(s.season)}. ${text}`, visible: true, kind: "chronicle" });
}

export function fullChronicle(s: GameState): { season: string; text: string }[] {
  return s.log.filter((e) => e.kind === "chronicle").map((e) => {
    const i = e.text.indexOf(". ");
    return { season: e.text.slice(0, i), text: e.text.slice(i + 2) };
  });
}

// ---------- Switch "storyChronicle": the chronicle told by who it was about ----------
// Still only what the log says: it groups each season's deeds by the person or body they concern,
// counts repeats ("the third time"), points back to where a turning point began, and at the end
// gathers each person's thread through the decade. No invented facts, no randomness.

const TURN = /becomes your rival|is your rival again|Nemesis|is dead|put to death|plot strikes|plot fails|Pretender|seize the Island|sword falls|takes your place|blade finds you|by force|will not ask you/;
const NOTABLE = /petitions you|demands|refuse|holds a grudge|rival|exile|guards take|pardon|You grant|strip|starts a plot|joins .*plot|Pretender|Nemesis|is dead|put to death|marries|flees|will not ask|takes your place|by force|blade finds you|plot strikes|plot fails|enters the story|is in a plot|leaves without a word|takes over the plot/;
const LOWER = /^(The|You|Your|Stories|A|An|Every|Money|Silver|Someone|Nothing|Men|Two)\b/;
const CONNECT = ["Meanwhile, ", "In the same season, ", "Elsewhere, ", "At court, "];
const ORD = ["", "", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

function subjectOf(s: GameState, e: LogEntry): string {
  if (e.actor !== "dionysius" && s.people[e.actor]) return e.actor;
  if (e.actor === "dionysius") {
    let best: { id: string; at: number } | undefined;
    for (const p of Object.values(s.people)) {
      if (p.player) continue;
      const at = e.text.indexOf(p.name.charAt(0).toUpperCase() + p.name.slice(1));
      const at2 = at >= 0 ? at : e.text.indexOf(p.name);
      if (at2 >= 0 && (!best || at2 < best.at)) best = { id: p.id, at: at2 };
    }
    return best?.id ?? "you";
  }
  return e.actor; // a faction or the world
}
const joinWith = (prefix: string, t: string) => prefix + (LOWER.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

// One person's thread, short: noise dropped, repeats folded into one line with a count,
// and a long life cut to its turning points plus how it began and how it stands.
const NOISE = /lets go of a grudge|waits in the wings|is in no plot|You grant .*'s petition|petition goes unanswered/;
function beatsOf(xs: { season: number; text: string }[]): string[] {
  const keyed = new Map<string, { first: number; last: number; n: number; text: string; order: number }>();
  xs.filter((x) => !NOISE.test(x.text)).forEach((x, order) => {
    const k = keyed.get(x.text);
    if (k) { k.n += 1; k.last = x.season; } else keyed.set(x.text, { first: x.season, last: x.season, n: 1, text: x.text, order });
  });
  let beats = [...keyed.values()].sort((a, b) => a.order - b.order);
  if (beats.length > 10) beats = beats.filter((b, i) => i < 2 || i >= beats.length - 2 || TURN.test(b.text) || b.n >= 3);
  return beats.map((b) => {
    const when = b.n > 1 ? `${seasonName(b.first)} to ${seasonName(b.last)}` : seasonName(b.first);
    return `${when}: ${b.text.replace(/\.$/, "")}${b.n > 1 ? ` (${b.n} times)` : ""}.`;
  });
}

export interface StoryBook { seasons: { season: number; name: string; paragraphs: string[]; omens: string[] }[]; lives: { id: string; name: string; text: string }[]; ending?: string }

// upTo: the last season to tell. By default the last finished one; the chronicle step passes the season it is writing,
// which is not finished yet (before, it got the season before, and every logged story chronicle read "A quiet season").
export function storyBook(s: GameState, upTo?: number): StoryBook {
  const last = upTo ?? (s.over ? s.over.season : s.season - 1);
  const seen: Record<string, Record<string, number>> = {}; // person -> sentence -> times
  const notable: Record<string, { season: number; text: string }[]> = {};
  const seasons: StoryBook["seasons"] = [];
  for (let i = 0; i <= last; i++) {
    const es = s.log.filter((e) => e.season === i && e.visible);
    for (const e of es) {
      if (!(e.kind === "event" || e.kind === "change") || !NOTABLE.test(e.text)) continue;
      const who = subjectOf(s, e);
      if (s.people[who]) (notable[who] ??= []).push({ season: i, text: e.text });
    }
    const deeds = es.filter((e) => e.kind === "event" && !SKIP.test(e.text));
    const groups = new Map<string, string[]>();
    for (const e of deeds) {
      const who = subjectOf(s, e);
      const key = s.people[who] ? who : who === "you" ? "you" : "city"; // factions and the world are the city
      let t = e.text;
      if (s.people[who]) {
        const n = ((seen[who] ??= {})[t] = (seen[who][t] ?? 0) + 1);
        if (n >= 2 && /petitions you|demands|spread among|gathers a following/.test(t)) t = t.replace(/\.$/, ` (the ${ORD[n] ?? `${n}th`} time).`);
        if (TURN.test(e.text)) {
          const first = (notable[who] ?? []).find((x) => x.season < i);
          if (first && !/enters the story/.test(first.text)) t += ` It began in ${seasonName(first.season)}: ${first.text.charAt(0).toLowerCase() + first.text.slice(1)}`;
        }
      }
      (groups.get(key) ?? groups.set(key, []).get(key)!).push(t);
    }
    // The city first, then each person in the order they first appear, then your own doings.
    const rank = (k: string) => (k === "city" ? 0 : k === "you" ? 2 : 1);
    const order = [...groups.keys()].sort((a, b) => rank(a) - rank(b));
    // One connective at most, where the story turns from the city to its people; more reads as filler.
    const paragraphs = order.map((k, j) => {
      const text = groups.get(k)!.join(" ");
      return j === 1 && order[0] === "city" && rank(k) === 1 ? joinWith(CONNECT[i % CONNECT.length], text) : text;
    });
    const omens = es.filter((e) => e.kind === "warning").map((e) => e.text.replace(/^(Whispers|Rumors|Named): /, ""));
    seasons.push({ season: i, name: seasonName(i), paragraphs: paragraphs.length ? paragraphs : ["A quiet season."], omens });
  }
  const lives = Object.entries(notable).map(([id, xs]) => ({ id, beats: beatsOf(xs) })).filter((x) => x.beats.length >= 3).map(({ id, beats }) => {
    const p = s.people[id];
    const nm = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    const fate = { dead: `${nm} is dead.`, outside: `${nm} ends outside the walls.`, held: `${nm} ends in your prison.` }[p.status as string] ?? "";
    return { id, name: titledName(p), n: beats.length, text: `${beats.join(" ")}${fate ? ` ${fate}` : ""}` };
  }).sort((a, b) => b.n - a.n).map(({ id, name, text }) => ({ id, name, text }));
  let ending: string | undefined;
  if (s.over) {
    ending = s.over.text;
    const by = s.over.by && notable[s.over.by];
    if (by && by.length) ending += ` The thread that led here began in ${seasonName(by[0].season)}: ${by[0].text.charAt(0).toLowerCase() + by[0].text.slice(1)}`;
  }
  return { seasons, lives, ending };
}
