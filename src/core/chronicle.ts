// The chronicle reads the season's log and writes it up in plain words. No LLM, no invented facts:
// every sentence comes from a logged action.
import { seasonName, capital } from "./state.ts";
import { log } from "./ops.ts";
import { on } from "./switches.ts";
import { titledName } from "./feud.ts";
import type { GameState, LogEntry } from "./types.ts";

const SKIP = /^(Your watchers learn nothing|.* keeps (his|her) head down|.* does nothing this season)/;

export function seasonEntries(s: GameState, season: number, all = false): LogEntry[] {
  return s.log.filter((e) => e.season === season && (all || e.visible));
}

export function chronicleText(s: GameState, season: number): string {
  const es = seasonEntries(s, season).filter((e) => (e.kind === "event" || e.kind === "warning") && !SKIP.test(e.text));
  const deeds = es.filter((e) => e.kind === "event").map((e) => e.stock ?? e.text);
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
const LOWER = /^(Again|The|You|Your|Stories|A|An|Every|Money|Silver|Someone|Nothing|Men|Two|After|Before|When|While|In|At|On|With|For|From|By|As|Once|Since|This|That|These|Those|His|Her|Their|There|Now|Then|Word|News|Talk)\b/;
const CONNECT = ["Meanwhile, ", "In the same season, ", "Elsewhere, ", "At court, "];
const ORD = ["", "", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
// 11th, 12th, 13th, but 21st, 22nd, 23rd (the chronicle once printed "22th").
const nth = (n: number) => ORD[n] ?? `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th"}`;

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

// ---------- Tidying a line for the story (switch "storyChronicle") ----------
// The log keeps every number; the story drops the bracketed ones ("(+2 silver to Carthage's treasury.)", "(power 10)").
const NUMBERED = /\s*\((?=[^)]*\d)[^)]*\)/g;
// The generated families' births, heirs and captains are kept in the families view; the story names only who died.
const FAMILY_NOISE = /took over the company of|now heads the house|rises to be |was born to /;
const FAMILY_DEATH = /^(.+) died, aged \d+\.$/;
export function tidyLine(t: string): string {
  let x = t.replace(NUMBERED, "").replace(/\s+\./g, ".");
  // "Fire in Achradina. You choose: Blame Theodorus's slaves." -> "Fire in Achradina: you chose to blame Theodorus's slaves."
  const m = /^(.+?)\. You choose: (.+)$/.exec(x);
  if (m) {
    const first = m[2].split(" ")[0];
    const lower = /^[A-Z][a-z]+$/.test(first) && !/^(Theodorus|Leptines|Philistus|Hipparinus|Nicoteles|Andron|Damon|Doricus|Heloris|Polyxenus|Thearides|Aristomache|Carthage|Syracuse)/.test(first);
    x = /^Do not /.test(m[2]) ? `${m[1]}: you chose not to ${m[2].slice(7)}` // not "you chose to do not tempt the gods"
      : lower ? `${m[1]}: you chose to ${m[2].charAt(0).toLowerCase() + m[2].slice(1)}` : `${m[1]}: you chose this: ${m[2]}`;
  }
  return x;
}
const joinNames = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

export interface StoryBook { seasons: { season: number; name: string; paragraphs: string[]; omens: string[] }[]; lives: { id: string; name: string; text: string }[]; ending?: string }

// upTo: the last season to tell. By default the last finished one; the chronicle step passes the season it is writing,
// which is not finished yet (before, it got the season before, and every logged story chronicle read "A quiet season").
export function storyBook(s: GameState, upTo?: number): StoryBook {
  const last = upTo ?? (s.over ? s.over.season : s.season - 1);
  const seen: Record<string, Record<string, number>> = {}; // person -> sentence -> times
  const notable: Record<string, { season: number; text: string }[]> = {};
  const seasons: StoryBook["seasons"] = [];
  let lastCity = new Set<string>();
  let against = "", explained = false, stale = 0;
  const began = new Set<string>(), omenSeen = new Set<string>(), remembered = new Set<string>();
  for (let i = 0; i <= last; i++) {
    const es = s.log.filter((e) => e.season === i && e.visible);
    for (const e of es) {
      if (!(e.kind === "event" || e.kind === "change") || !NOTABLE.test(e.text)) continue;
      const who = subjectOf(s, e);
      if (s.people[who]) (notable[who] ??= []).push({ season: i, text: e.text });
    }
    const deeds = es.filter((e) => e.kind === "event" && !SKIP.test(e.text) && !FAMILY_NOISE.test(e.text));
    const groups = new Map<string, string[]>();
    const familyDead: string[] = [];
    const cityLines = new Set<string>();
    for (const e of deeds) {
      const who = subjectOf(s, e);
      const key = s.people[who] ? who : who === "you" ? "you" : "city"; // factions and the world are the city
      const fd = key === "city" ? FAMILY_DEATH.exec(e.text) : null;
      if (fd) { familyDead.push(fd[1]); continue; }
      let t = tidyLine(e.stock ?? e.text); // the plain line: the story does its own "again" and counting
      // The city's standing business (Carthage trading, a content faction holding back) is told once, not every season.
      if (key === "city") { cityLines.add(t); if (lastCity.has(t)) continue; }
      // A grudge remembered is told once per grudge, with the man's name ("He did not forget" alone hid who).
      const mem = / (?:He did not forget|[A-Z][^.:]*? has not forgotten): (.+?)\.(?=\s|$)/.exec(t);
      if (mem) {
        const k = `${who}|${mem[1]}`;
        t = remembered.has(k) || !s.people[who] ? t.replace(mem[0], "") : t.replace(mem[0], ` ${capital(s.people[who].name)} has not forgotten: ${mem[1]}.`);
        remembered.add(k);
      }
      // A vote is told once: the proposal's For and Against go onto the result.
      const prop = /^You put (.+) to the assembly\. For: (.+)\. Against: (.+)\.$/.exec(t);
      if (prop) { against = prop[3] === "no faction" ? "" : prop[3]; continue; }
      if (/^The assembly (passes|throws out) /.test(t) && against) { t = t.replace(/\.$/, /passes/.test(t) ? `, over the objections of ${joinNames(against.split(", "))}.` : `: ${joinNames(against.split(", "))} voted it down.`); against = ""; }
      // "He wants your place, not your life" explains a political rival the first time only.
      if (/He wants your place, not your life\./.test(t)) { if (explained) t = t.replace(/\s*He wants your place, not your life\./, ""); explained = true; }
      // The same deed by the same hand: the second time "again", after that counted.
      const n = ((seen.all ??= {})[t] = (seen.all[t] ?? 0) + 1);
      if (n === 2) t = joinWith("Again, ", t);
      else if (n > 2) t = t.replace(/^(.*?)\.(\s.*)?$/, `$1 (the ${nth(n)} time).`); // the third time on, its first sentence and a count
      if (s.people[who] && TURN.test(e.text) && !began.has(who)) {
        const first = (notable[who] ?? []).find((x) => x.season < i);
        if (first && !/enters the story/.test(first.text)) { began.add(who); t += ` It began in ${seasonName(first.season)}: ${tidyLine(LOWER.test(first.text) ? first.text.charAt(0).toLowerCase() + first.text.slice(1) : first.text).replace(/\s*He wants your place, not your life\./, "")}`; }
      }
      (groups.get(key) ?? groups.set(key, []).get(key)!).push(t);
    }
    lastCity = cityLines;
    if (familyDead.length) (groups.get("city") ?? groups.set("city", []).get("city")!).push(`Among the families, ${joinNames(familyDead)} died.`);
    // The city first, then each person in the order they first appear, then your own doings.
    const rank = (k: string) => (k === "city" ? 0 : k === "you" ? 2 : 1);
    const order = [...groups.keys()].sort((a, b) => rank(a) - rank(b));
    // One connective at most, where the story turns from the city to its people; more reads as filler.
    const paragraphs = order.map((k, j) => {
      const text = groups.get(k)!.join(" ");
      return j === 1 && order[0] === "city" && rank(k) === 1 ? joinWith(CONNECT[i % CONNECT.length], text) : text;
    });
    // Warnings: each line once in the story. A season with only old ones gets one line saying the talk goes on.
    const heard = es.filter((e) => e.kind === "warning").map((e) => e.text.replace(/^(Whispers|Rumors|Named): /, ""));
    // Sentence by sentence: a clue already told is not told again, even inside a new warning.
    const omens = heard.map((x) => x.split(/(?<=\.)\s+/).filter((t) => { const fresh = !omenSeen.has(t); omenSeen.add(t); return fresh; }).join(" ")).filter(Boolean);
    if (heard.length && !omens.length) { stale += 1; omens.push(stale === 1 ? "Nothing new from your informers: the same talk goes on." : `Nothing new from your informers (the ${nth(stale)} season with nothing new).`); }
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
