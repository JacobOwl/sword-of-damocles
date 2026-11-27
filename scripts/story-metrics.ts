// Story metrics: do the games make stories worth retelling? Plays the Second island test with three kinds of player,
// reads each game's log for story beats, quiet stretches and repeated sentences, and writes the tables and charts.
// Report only: it changes no rule and no data. Built on the playtest bot (scripts/playtest.ts): the same players, the
// same random streams, so a game here is the first 30 seasons of the same game there.
//   node scripts/story-metrics.ts                         the full run: 200 games each for three players, 30 seasons each
//   node scripts/story-metrics.ts --games 20              a quicker run (games per player)
//   node scripts/story-metrics.ts --one careful:17        one game: its beats season by season, its quiet stretch and its end
//   node scripts/story-metrics.ts --one careful:17 --log  ... then every line the player saw, season by season
//   node scripts/story-metrics.ts --one careful:17 --save game.json   ... and write it as a save (npm run replay-save -- game.json --log)
// Writes results.md, games.md, beats-by-kind.svg, beats-by-season.svg and one beat sheet for each of the ten games
// picked for retelling (sheets/) to --out (default docs/playtests/2026-11-27-story-metrics). Every file depends only on
// the code, the data and the options, so a rerun writes the same files. Times go to the console only.
import { spawn } from "node:child_process";
import { availableParallelism } from "node:os";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  startGame, endSeason, replay, logDigest, openEvents, newGame, seasonName, officeName, OFFICES, NODES, PLAYER, MOODS,
  storyBook,
} from "../src/core/index.ts";
import type { GameState, LogEntry } from "../src/core/index.ts";
import { botRandom } from "../src/core/bots.ts";
import { PLAYERS, setupById } from "./playtest.ts";
import { brokenState } from "./sim-check.ts";

// ---------- The run ----------
export const SETUP = "second"; // the Second island test preset, the recommended game
export const SEASONS = 30;
export const PLAYER_IDS = ["careful", "patron", "tyrant"]; // the careful ruler, the patron, the iron hand
export const PLAYER_NAMES: Record<string, string> = { careful: "the careful ruler", patron: "the patron", tyrant: "the iron hand" };
const playerIndex = (id: string) => [...id].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) | 0, 7); // as in playtest.ts

// One game, played exactly as the playtest bot plays a season (answer, act, answer what came up during the turn,
// end the season), stopped after SEASONS seasons.
export function play(playerId: string, seed: number): GameState {
  const st = setupById(SETUP), pl = PLAYERS.find((p) => p.id === playerId)!;
  const r = botRandom((seed * 1000003) ^ playerIndex(playerId));
  const s = startGame(seed, st.tuning, st.opts);
  let guard = 0;
  while (!s.over && s.season < SEASONS && guard++ < 70) {
    if (s.step !== "player") break;
    const atStart = new Set(openEvents(s).map((ev) => ev.inst.uid));
    pl.answer(s, r, undefined);
    pl.act(s, r);
    const fresh = s.over ? [] : openEvents(s).filter((ev) => !atStart.has(ev.inst.uid));
    if (fresh.length) pl.answer(s, r, new Set(fresh.map((ev) => ev.inst.uid)));
    if (!s.over) endSeason(s);
  }
  return s;
}

// ---------- The beats ----------
// A beat is something a player would mention when retelling the game. Each is read from the lines the player can
// see (hidden moves and the chronicle's own summaries are skipped). The quoted lines are the game's own words.
export const KINDS = [
  { id: "climb", name: "A man climbs to rival or pretender", reads: "\"X no longer hides it: he wants your place\", \"X is a rival (or a pretender) in the city now\", \"Two factions now speak of X as the man who should rule Syracuse\", \"X becomes a political rival\", \"X is now a Pretender\", \"X becomes your rival\", \"X is your rival again\", \"X is now your Nemesis\". One beat each time a man who is not a rival of any kind becomes one, and again when he first reaches pretender (a Pretender or a Nemesis). He can climb again after a line says he is no longer one. The first season's are left out: they come from the opening's cast (in nearly every game Leptines and Hipparinus are named political rivals at the end of season 1), not from play." },
  { id: "seat", name: "A seat lost and won back", reads: "\"X holds the fleet\" (or \"The fleet stands empty\", \"X commands the guard\") for a seat you held, then \"You hold the fleet\" (or \"You command the guard\") in a later season. Seats won back in one season are one beat. Seats lost by falling into exile and given back by coming home are left out: that is the exile beat." },
  { id: "turncoat", name: "A friend or kinsman turns plotter", reads: "The first line that shows you a man in a plot against you: \"X is in a plot against you\", \"You learn that X leads a plot\", \"... is sworn into Y's plot\", \"The names now spoken: X\", \"Every plotter is named: X, Y\", \"X joins Y's plot\", \"You are killed by men you trusted. X led them\". It counts when X is your kin (your family by blood or marriage, or the ruler's family) or a friend (his opinion of you was +2 or more at some point before). Once per man in a game: a friend turns once, and the same man found in a plot again later is not a new beat." },
  { id: "reversal", name: "A reversal", reads: "\"Silver +3 (now 14)\" and the like: silver climbs at least 5 to at least 10, then falls to half its peak or less. \"Guard strength\": climbs at least 2 to at least 4, then halves. \"You muster the army ... about 9,000 men\" and \"Your army loses about 2,000 men (now about ...)\": the army falls to half its size or less by losses (\"Your army is destroyed\" counts; disbanding does not). \"The citizens warm to Content\" and \"sour to Angry\": a faction's mood climbs two steps or more to Content or Loyal, then falls two steps or more (half the five-step scale). A see-saw between Rebellious and Uneasy is not counted: it is counted on its own, as churn. One beat each time; it starts again from the low." },
  { id: "death", name: "A named death", reads: "\"X is dead.\" for anyone of the cast (the households' background deaths, \"X son of Y died, aged 48\", are left out); \"Himilcon ... starves himself to death\"; \"X falls in the battle\" (a Carthaginian general); and your own death (\"The sword falls. You are killed ...\", \"Assassins ... find you\"). Once per person." },
  { id: "warning", name: "A warning that came true", reads: "A plot warning (\"Whispers: ...\", \"Rumors: ...\", \"Named: ...\") and then, in a later season, \"The plot strikes.\" (or, in exile, \"The hunters strike\"); \"X's army eats the last of its food\" and then \"X's army has run out of food\" within two seasons; \"Messana has 2 months of grain left under siege\" and then \"Messana has eaten its last grain and gives in\" (or \"Syracuse is starving\") within three seasons. Once per blow, per hunger, per town starved." },
  { id: "war", name: "A war begun and ended", reads: "\"Carthage declares war on Syracuse\" (or \"Syracuse is at war with Carthage\", \"You declare war on Carthage\") and later \"Peace is made between Syracuse and Carthage\". A war still going at the end is not a beat." },
  { id: "exile", name: "An exile and a return", reads: "\"You are not finished. You flee to ...\" and later \"You come home. ... Syracuse is yours again.\" An exile with no return is not a beat." },
] as const;
export type Kind = (typeof KINDS)[number]["id"];
export interface Beat { season: number; kind: Kind; text: string; who?: string[]; from?: number } // from: the season a two-part beat began
const FACTIONS = ["citizens", "rich", "guard", "family"] as const;

const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const lc = (x: string) => x.toLowerCase();
const capital = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
const num = (x: string) => Number(x.replace(/,/g, ""));
const and = (xs: string[]) => (xs.length < 2 ? xs[0] ?? "" : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

// The lines the player sees: visible, not the chronicle's summaries (they repeat the same news).
export const seen = (s: GameState) => s.log.filter((e) => e.visible && e.kind !== "chronicle");

// Who a name in a line is: the cast (Syracusans, newcomers) and Carthage's named men.
function namesOf(s: GameState) {
  const byName = new Map<string, string>();
  for (const p of Object.values(s.people)) if (p.id !== PLAYER) byName.set(lc(p.name), p.id);
  for (const p of Object.values(s.island?.carthage.people ?? {})) byName.set(lc(p.name), `carthage:${p.id}`);
  const nameOf = (id: string) => (id.startsWith("carthage:") ? s.island!.carthage.people[id.slice(9)].name : s.people[id]?.name ?? id);
  const idOf = (x: string) => byName.get(lc(x.trim()));
  // Every known name found in a list such as "A, B and C".
  const listed = (x: string) => x.split(/, | and /).map(idOf).filter((v): v is string => !!v);
  return { idOf, nameOf, listed };
}

export function readBeats(s: GameState, seed: number) {
  const start = newGame(seed, setupById(SETUP).tuning, setupById(SETUP).opts);
  const { idOf, nameOf, listed } = namesOf(s);
  const beats: Beat[] = [];
  const add = (b: Beat) => beats.push({ ...b, text: capital(b.text) });
  const lines = seen(s).filter((e) => e.season < SEASONS); // the opening of season 31 is past the game
  const sn = (n: number) => seasonName(n);
  const youKin = new Set(s.people[PLAYER]?.kin ?? []);
  const isKin = (id: string) => youKin.has(id) || s.people[id]?.faction === "family";

  // Climbs: the level of each man in each of the three rival systems (1 rival, 2 pretender).
  const lvl: Record<string, Record<string, number>> = {};
  const top = (id: string) => Math.max(0, ...Object.values(lvl[id] ?? {}));
  const climb = (e: LogEntry, name: string, sys: string, to: number) => {
    const id = idOf(name); if (!id) return;
    const before = top(id);
    (lvl[id] ??= {})[sys] = Math.max(lvl[id][sys] ?? 0, to);
    if (top(id) > before && e.season > 0) add({ season: e.season, kind: "climb", text: `${nameOf(id)} becomes ${top(id) === 2 ? (sys === "enemy" ? "your Nemesis" : "a pretender") : "a rival"}`, who: [id] });
  };
  const fall = (name: string, sys: string, to: number) => { const id = idOf(name); if (id && lvl[id]?.[sys] !== undefined) lvl[id][sys] = Math.min(lvl[id][sys], to); };

  // Seats: who holds each, as the lines say. Starts from the opening's holders.
  const seatNames = new Map<string, string>(OFFICES.map((o) => [lc(officeName(o)), o]));
  const holder: Record<string, string> = Object.fromEntries(OFFICES.map((o) => [o, start.offices[o] ?? ""]));
  holder.captain = start.people.aristotle ? "aristotle" : "";
  const lost: Record<string, number> = {};
  let regained: { season: number; seats: string[] } | null = null;
  const flushRegained = () => { if (regained) { add({ season: regained.season, kind: "seat", text: `You win back ${and(regained.seats.map((x) => (x === "captain" ? "the guard's command" : officeName(x))))}`, from: Math.min(...regained.seats.map((x) => lost[`was:${x}`] ?? regained!.season)) }); regained = null; } };
  let exileSeason = -99, homeSeason = -99;
  const seatTo = (e: LogEntry, seat: string, who: string) => {
    const was = holder[seat];
    holder[seat] = who;
    if (e.season === exileSeason || e.season === homeSeason) { delete lost[seat]; return; } // the exile beat covers these
    if (was === PLAYER && who !== PLAYER) lost[seat] = e.season;
    else if (who === PLAYER && was !== PLAYER && lost[seat] !== undefined && lost[seat] < e.season) {
      if (regained && regained.season !== e.season) flushRegained();
      lost[`was:${seat}`] = lost[seat];
      (regained ??= { season: e.season, seats: [] }).seats.push(seat);
      delete lost[seat];
    }
  };

  // Plotters revealed, opinions (for friends), and the warnings.
  const best: Record<string, number> = {};
  for (const p of Object.values(start.people)) best[p.id] = p.opinion;
  const revealed = new Set<string>(); // once per man in a game: a friend turns once
  const reveal = (e: LogEntry, ids: string[]) => {
    for (const id of ids) {
      if (id.startsWith("carthage:") || revealed.has(id)) continue;
      revealed.add(id);
      const kin = isKin(id), friend = (best[id] ?? -9) >= 2;
      if (kin || friend) add({ season: e.season, kind: "turncoat", text: `${nameOf(id)}, ${kin ? "your kin" : "once your friend"}, is in a plot against you`, who: [id] });
    }
  };
  let firstWarned = -1;
  const foodWarn: Record<string, number> = {}, grainWarn: Record<string, number> = {};
  let starvingCounted = -99;

  // Reversals: a series of values, its last low and its peak since that low.
  const series: Record<string, { low: number; peak: number; peakAt: number }> = {};
  // fell: has the value fallen far enough from the peak (halved, or for a mood two steps)?
  const halved = (pk: number, v: number) => v <= pk / 2;
  const point = (e: LogEntry, key: string, v: number, minRise: number, minPeak: number, label: (lo: number, pk: number, v: number) => string, fell = halved) => {
    const x = (series[key] ??= { low: v, peak: v, peakAt: e.season });
    if (v > x.peak) { x.peak = v; x.peakAt = e.season; }
    if (x.peak - x.low >= minRise && x.peak >= minPeak && fell(x.peak, v)) {
      add({ season: e.season, kind: "reversal", text: label(x.low, x.peak, v), from: x.peakAt });
      series[key] = { low: v, peak: v, peakAt: e.season };
    } else if (v < x.low) series[key] = { low: v, peak: v, peakAt: e.season };
  };
  const moodKey: Record<string, string> = Object.fromEntries(FACTIONS.map((f) => [lc(s.factions[f].short), f]));
  for (const f of FACTIONS) series[`mood:${f}`] = { low: start.factions[f].mood, peak: start.factions[f].mood, peakAt: 0 };
  series.silver = { low: start.silver, peak: start.silver, peakAt: 0 };
  series.guard = { low: start.guard.strength, peak: start.guard.strength, peakAt: 0 };
  const moodRe = new RegExp(`^The (${FACTIONS.map((f) => esc(lc(s.factions[f].short).replace(/^the /, ""))).join("|")}) (warm|sour) to (${MOODS.join("|")})\\.`);

  const dead = new Set<string>();
  const died = (e: LogEntry, id: string | undefined, how: string) => { if (!id || dead.has(id)) return; dead.add(id); add({ season: e.season, kind: "death", text: `${nameOf(id)} ${how}`, who: [id] }); };
  let warStart = -1, exileStart = -1, relapses = 0;
  let m: RegExpMatchArray | null;

  for (const e of lines) {
    const t = e.text;
    if (regained && regained.season !== e.season) flushRegained();
    // --- climbs
    if ((m = t.match(/^(.+?) no longer hides it: (?:he|she) wants your place/))) climb(e, m[1], "ladder", 1);
    else if ((m = t.match(/^(.+?) is a rival in the city now\./))) climb(e, m[1], "ladder", 1);
    else if ((m = t.match(/^Two factions now speak of (.+?) as the (?:man|woman) who should rule Syracuse/))) climb(e, m[1], "ladder", 2);
    else if ((m = t.match(/^(.+?) is a pretender in the city now\./))) climb(e, m[1], "ladder", 2);
    else if ((m = t.match(/^(.+?) is no longer a pretender\./))) fall(m[1], "ladder", 1);
    else if ((m = t.match(/^(.+?) is no longer a rival\./))) fall(m[1], "ladder", 0);
    else if ((m = t.match(/^(.+?) becomes a political rival \(/))) climb(e, m[1], "political", 1);
    else if ((m = t.match(/^The family names (.+?) your heir\. .* becomes a political rival/))) climb(e, m[1], "political", 1);
    else if ((m = t.match(/^(.+?) is now a Pretender, and works in the open/)) || (m = t.match(/^(.+?) rises to Pretender\./))) climb(e, m[1], "political", 2);
    else if ((m = t.match(/^(.+?) is no longer a political rival\./))) fall(m[1], "political", 0);
    else if ((m = t.match(/^(.+?) becomes your rival \(/)) || (m = t.match(/^(.+?) is your rival again/))) climb(e, m[1], "enemy", 1);
    else if ((m = t.match(/^(.+?) is now your Nemesis/)) || (m = t.match(/^(.+?) rises to rank \d+, Nemesis/))) climb(e, m[1], "enemy", 2);
    else if ((m = t.match(/^(.+?) is no longer your rival\./))) fall(m[1], "enemy", 0);
    // --- seats
    if ((m = t.match(/^You hold (the [a-z ]+)\.$/)) && seatNames.has(m[1])) seatTo(e, seatNames.get(m[1])!, PLAYER);
    else if ((m = t.match(/^(.+?) holds (the [a-z ]+)\.$/)) && seatNames.has(m[2])) seatTo(e, seatNames.get(m[2])!, idOf(m[1]) ?? m[1]);
    else if ((m = t.match(/^(The [a-z ]+) stands empty\.$/)) && seatNames.has(lc(m[1]))) seatTo(e, seatNames.get(lc(m[1]))!, "");
    else if (t === "You command the guard.") seatTo(e, "captain", PLAYER);
    else if ((m = t.match(/^(.+?) commands the guard\.$/))) seatTo(e, "captain", idOf(m[1]) ?? m[1]);
    else if (t === "The guard has no captain.") seatTo(e, "captain", "");
    // --- opinions and plotters
    if ((m = t.match(/^(.+?)'s? opinion of you (?:rises|falls) to ([+-]?\d+)\./))) { const id = idOf(m[1]); if (id) best[id] = Math.max(best[id] ?? -9, Number(m[2])); }
    if ((m = t.match(/^(.+?) is in a plot against you, led by (.+?)\./))) reveal(e, [idOf(m[1]), idOf(m[2])].filter((x): x is string => !!x));
    else if ((m = t.match(/^(.+?) is in a plot against you, and leads it/))) reveal(e, [idOf(m[1])].filter((x): x is string => !!x));
    else if ((m = t.match(/^You learn that (.+?) leads a plot against you/))) reveal(e, [idOf(m[1])].filter((x): x is string => !!x));
    else if ((m = t.match(/^You learn that (.+?) is sworn into (.+?)'?s? plot against you/))) reveal(e, [idOf(m[1]), idOf(m[2])].filter((x): x is string => !!x));
    else if ((m = t.match(/^(.+?) joins (.+?)'s? plot\b/))) reveal(e, [idOf(m[1]), idOf(m[2])].filter((x): x is string => !!x));
    if ((m = t.match(/The names now spoken: (.+?)\.$/))) reveal(e, listed(m[1]));
    if ((m = t.match(/every plotter is named: (.+?)\.$/i))) reveal(e, listed(m[1]));
    if ((m = t.match(/You are killed by men you trusted\. (.+?) led them\./))) reveal(e, [idOf(m[1])].filter((x): x is string => !!x));
    // --- warnings that came true
    if (e.kind === "warning" && /^(Whispers|Rumors|Named): /.test(t) && firstWarned < 0) firstWarned = e.season;
    if ((t.startsWith("The plot strikes.") || t.startsWith("The hunters strike")) && firstWarned >= 0 && firstWarned < e.season) {
      add({ season: e.season, kind: "warning", text: `A blow warned of since ${sn(firstWarned)} falls`, from: firstWarned });
      firstWarned = -1;
    }
    if ((m = t.match(/^(.+?) eats the last of its food\./))) foodWarn[m[1]] = e.season;
    if ((m = t.match(/^(.+?) has run out of food\./)) && foodWarn[m[1]] !== undefined && e.season - foodWarn[m[1]] <= 2 && e.season > foodWarn[m[1]]) {
      add({ season: e.season, kind: "warning", text: `${m[1]}, warned it was eating the last of its food, runs out`, from: foodWarn[m[1]] }); delete foodWarn[m[1]];
    }
    if ((m = t.match(/^(.+?) has \d+ months of grain left under siege\./))) grainWarn[m[1]] = grainWarn[m[1]] ?? e.season;
    if ((m = t.match(/^(.+?) has eaten its last grain and gives in\./)) || (t.startsWith("Syracuse is starving.") && (m = ["", "Syracuse"]))) {
      const w = grainWarn[m[1]];
      if (w !== undefined && e.season - w <= 3 && e.season > w && !(m[1] === "Syracuse" && starvingCounted >= w)) {
        add({ season: e.season, kind: "warning", text: `${m[1]}, warned its grain was nearly gone, starves`, from: w });
        if (m[1] === "Syracuse") starvingCounted = e.season; else delete grainWarn[m[1]];
      }
    }
    // --- reversals
    if ((m = t.match(/^Silver ([+-]\d+) \(now (-?\d+)\)\./))) point(e, "silver", Number(m[2]), 5, 10, (lo, pk, v) => `Your silver climbs from ${lo} to ${pk}, then falls to ${v}`);
    if ((m = t.match(/^Guard strength ([+-]\d+) \(now (\d+)\)\./))) point(e, "guard", Number(m[2]), 2, 4, (lo, pk, v) => `Your guard grows from ${lo} to ${pk}, then falls to ${v}`);
    if ((m = t.match(/^You muster the army at .*?: about ([\d,]+) men/))) series.army = { low: 0, peak: num(m[1]), peakAt: e.season };
    if ((m = t.match(/^Your army (?:loses|gains) about [\d,]+ men(?: of the levy)? \(now about ([\d,]+) men\)\./)) && series.army) point(e, "army", num(m[1]), 1, 1, (_lo, pk, v) => `Your army of about ${pk.toLocaleString("en-US")} men is cut to about ${v.toLocaleString("en-US")}`);
    if (t.startsWith("Your army is destroyed.") && series.army) { point(e, "army", 0, 1, 1, (_lo, pk) => `Your army of about ${pk.toLocaleString("en-US")} men is destroyed`); delete series.army; }
    if (/^Your army (breaks up|comes home and disbands)/.test(t)) delete series.army;
    if ((m = t.match(moodRe))) {
      const f = moodKey[`the ${m[1]}`], v = MOODS.indexOf(m[3] as (typeof MOODS)[number]);
      if (v === 0 && m[2] === "sour") relapses++; // churn: back to Rebellious
      point(e, `mood:${f}`, v, 2, 3, (lo, pk, x) => `${capital(s.factions[f].short)} warm from ${MOODS[lo]} to ${MOODS[pk]}, then sour to ${MOODS[x]}`, (pk, x) => pk - x >= 2);
    }
    // --- deaths (the cast only, not the households' background deaths)
    if ((m = t.match(/^(.+?) is dead\.$/)) && e.actor !== "world") died(e, idOf(m[1]), `dies (${e.why ?? "no reason given"})`);
    if (t.startsWith("Himilcon goes about the temples of Carthage")) died(e, idOf("Himilcon"), "starves himself to death in Carthage");
    if ((m = t.match(/^(.+?) falls in the battle\./))) died(e, idOf(m[1]), "falls in battle");
    if (s.over?.reason === "killed" && t === s.over.text && !dead.has(PLAYER)) { dead.add(PLAYER); add({ season: e.season, kind: "death", text: `You are killed: ${t.replace(/\.$/, "")}`, who: [PLAYER] }); }
    // --- war and peace
    if (/^(Carthage declares war on Syracuse|Syracuse is at war with Carthage|You declare war on Carthage)\./.test(t) && warStart < 0) warStart = e.season;
    if (t.startsWith("Peace is made between Syracuse and Carthage.") && warStart >= 0) { add({ season: e.season, kind: "war", text: `A war with Carthage, ${sn(warStart)} to ${sn(e.season)}`, from: warStart }); warStart = -1; }
    // --- exile and return
    if (t.startsWith("You are not finished. You flee to")) {
      exileStart = e.season; exileSeason = e.season;
      for (const k of Object.keys(lost)) delete lost[k];
    }
    if (t.startsWith("You come home.") && exileStart >= 0) { homeSeason = e.season; add({ season: e.season, kind: "exile", text: `Exiled in ${sn(exileStart)}, home in ${sn(e.season)}`, from: exileStart }); exileStart = -1; }
  }
  flushRegained();
  beats.sort((a, b) => a.season - b.season);
  // An end that came after the 30th season (in the opening of the 31st) is past the game, like every line from then.
  const over = s.over && s.over.season < SEASONS ? s.over : undefined;
  const played = over ? over.season + 1 : Math.min(s.season, SEASONS);
  // Quiet stretch: the longest run of seasons with no beat. A season counts as eventful if a beat ends in it, or if
  // a two-part beat that later finished began in it (the war's first season, the exile's flight, the seat's loss).
  const busy = new Set<number>();
  for (const b of beats) { busy.add(b.season); if (b.from !== undefined && b.kind !== "warning" && b.kind !== "reversal") busy.add(b.from); }
  let run = 0, longest = 0, longestFrom = 0;
  for (let i = 0; i < played; i++) {
    if (busy.has(i)) run = 0; else { run++; if (run > longest) { longest = run; longestFrom = i - run + 1; } }
  }
  return { beats, played, over, relapses, quiet: { length: longest, from: longestFrom }, unfinishedWar: warStart >= 0 ? warStart : undefined, exiledAtEnd: exileStart >= 0 };
}

// ---------- Repeated sentences ----------
// Each line the player sees, split into sentences, with names and numbers taken out, so "Leptines's opinion of you
// falls to -2." and "Nicoteles's opinion of you falls to -1." count as one sentence.
export function sentenceKeys(s: GameState) {
  const names = new Set<string>();
  for (const p of Object.values(s.people)) if (p.id !== PLAYER) names.add(p.name);
  for (const p of Object.values(s.island?.carthage.people ?? {})) names.add(p.name);
  const towns = NODES.map((n) => n.name);
  const people = [...names].sort((a, b) => b.length - a.length).map(esc);
  const personRe = new RegExp(`\\b(${people.join("|")})\\b`, "gi");
  const townRe = new RegExp(`\\b(${towns.map(esc).join("|")})\\b`, "g");
  const out = new Map<string, { n: number; news: boolean }>();
  for (const e of seen(s)) {
    if (e.season >= SEASONS) continue; // the opening of season 31 is past the game
    const news = e.kind === "event" || e.kind === "warning";
    const parts = e.text.split(/(?<=[.!?:)])\s+(?=[A-Z("[])/);
    for (const raw of parts) {
      const k = raw
        .replace(/\b[A-Z][a-z]+ son of [A-Z][a-z]+(, of [A-Z][a-z]+)?/g, "[someone]")
        .replace(personRe, "[someone]")
        .replace(townRe, "[a town]")
        .replace(/[+-]?\d(?:[\d,]*\d)?/g, "N")
        .trim();
      if (!k) continue;
      const x = out.get(k) ?? { n: 0, news };
      x.n++;
      out.set(k, x);
    }
  }
  return out;
}

// ---------- One game's record ----------
export interface GameRec {
  player: string; seed: number; end: string; endSeason: number; played: number; beats: Beat[]; quiet: { length: number; from: number };
  firstTen: number; kinds: Partial<Record<Kind, number>>; problems: string[];
  sentences: [string, number, boolean][];
  facts: Record<string, number>; // what else happened, for "what separates the good games from the dull"
}
const firstAt = (lines: LogEntry[], test: (t: string) => boolean) => { const e = lines.find((x) => test(x.text)); return e ? e.season + 1 : 0; };
export function record(playerId: string, seed: number, withSentences = true): GameRec {
  const problems: string[] = [];
  let s: GameState;
  try { s = play(playerId, seed); } catch (e) { return { player: playerId, seed, end: "crash", endSeason: -1, played: 0, beats: [], quiet: { length: 0, from: 0 }, firstTen: 0, kinds: {}, problems: [`crash: ${(e as Error).message}`], sentences: [], facts: {} }; }
  const b = brokenState(s);
  if (b.length) problems.push(`broken state: ${b.join("; ")}`);
  try {
    const st = setupById(SETUP);
    const again = replay(seed, s.inputs, st.tuning, st.opts);
    if (logDigest(again) !== logDigest(s)) problems.push("replaying the inputs gives a different game");
  } catch (e) { problems.push(`replay crash: ${(e as Error).message}`); }
  const r = readBeats(s, seed);
  const kinds: Partial<Record<Kind, number>> = {};
  for (const x of r.beats) kinds[x.kind] = (kinds[x.kind] ?? 0) + 1;
  const c = s.counters as Record<string, number>;
  const lines = seen(s).filter((e) => e.season < SEASONS);
  const facts: Record<string, number> = {
    landings: c.landings ?? 0, wars: c.wars ?? 0, battles: lines.filter((e) => e.text.startsWith("Battle at ")).length,
    strikes: c.strikes ?? 0, tyrannies: c.tyrannies ?? 0, exiles: lines.filter((e) => e.text.startsWith("You are not finished. You flee to")).length,
    matters: lines.filter((e) => e.kind === "event" && / You choose: /.test(e.text)).length,
    actions: s.inputs.filter((x) => x.t === "act").length,
    kindsOfAction: new Set(s.inputs.filter((x) => x.t === "act").map((x) => (x as { action: string }).action)).size,
    peopleInBeats: new Set(r.beats.flatMap((x) => x.who ?? []).filter((x) => x !== PLAYER)).size,
    firstBeat: r.beats.length ? r.beats[0].season + 1 : 0,
    linesSeen: lines.length,
    unfinishedWar: r.unfinishedWar !== undefined ? 1 : 0,
    relapses: r.relapses, // a faction soured back to Rebellious
    wonAtEnd: r.over || r.exiledAtEnd ? 0 : 1,
    // when the big things first happen (season number, 0 if never)
    warAt: firstAt(lines, (t) => /^(Carthage declares war on Syracuse|You declare war on Carthage)\./.test(t)),
    strikeAt: firstAt(lines, (t) => t.startsWith("The plot strikes.")),
    fleeAt: firstAt(lines, (t) => t.startsWith("You are not finished. You flee to")),
  };
  const keys = withSentences ? sentenceKeys(s) : new Map();
  return {
    player: playerId, seed, end: r.over?.reason ?? (r.exiledAtEnd ? "exile" : "ruling"), endSeason: r.over ? r.over.season : -1, played: r.played, beats: r.beats, quiet: r.quiet,
    firstTen: r.beats.filter((x) => x.season < 10).length, kinds, problems, facts,
    sentences: [...keys].map(([k, v]) => [k, v.n, v.news] as [string, number, boolean]),
  };
}


// ---------- The tables and charts ----------
// Everything below reads the records only, so the files depend on the games and nothing else.
const SHORT: Record<Kind, [string, string]> = { climb: ["rise", "rises"], seat: ["seat", "seats"], turncoat: ["turncoat", "turncoats"], reversal: ["reversal", "reversals"], death: ["death", "deaths"], warning: ["warning", "warnings"], war: ["war", "wars"], exile: ["exile", "exiles"] };
const kindName = (k: Kind) => KINDS.find((x) => x.id === k)!.name;
const PAYOFF: Kind[] = ["seat", "warning", "war", "exile"]; // two-part beats: something begun and then closed
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const mean = (xs: number[]) => (xs.length ? sum(xs) / xs.length : 0);
const median = (xs: number[]) => { const a = [...xs].sort((x, y) => x - y), n = a.length; return n ? (n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2) : 0; };
const f1 = (x: number) => x.toFixed(1), f2 = (x: number) => x.toFixed(2);
const pct = (a: number, b: number) => `${b ? Math.round((100 * a) / b) : 0}%`;
const md = (x: string) => x.replace(/([|*_<>`\\])/g, "\\$1");
const replayCmd = (r: { player: string; seed: number }) => `node scripts/story-metrics.ts --one ${r.player}:${r.seed}`;
const ENDS: Record<string, string> = { exile: "in exile at the end", ruling: "still ruling", survived: "still ruling", killed: "killed", exiled: "in exile", deposed: "deposed", fallen: "Syracuse fell", crash: "crashed" };
const endText = (r: GameRec) => (r.end === "ruling" || r.end === "exile" ? ENDS[r.end] : `${ENDS[r.end] ?? r.end} in season ${r.endSeason + 1}`);
const sheetName = (r: GameRec) => `${r.player === "tyrant" ? "iron-hand" : r.player}-${r.seed}.md`;
const playerName = (p: string) => PLAYER_NAMES[p];
const kindsText = (r: GameRec) => KINDS.filter((k) => r.kinds[k.id]).map((k) => `${r.kinds[k.id]} ${SHORT[k.id][r.kinds[k.id] === 1 ? 0 : 1]}`).join(", ") || "none";

// The ten games to retell: the five with the most beats, and the five with the fewest. Ties: for the most, the
// player's order then the seed; for the fewest, the longer game first (the same beats over more seasons is duller),
// then the player's order and the seed.
export function pickGames(recs: GameRec[]) {
  const ok = recs.filter((r) => !r.problems.length);
  const po = (r: GameRec) => PLAYER_IDS.indexOf(r.player);
  const most = [...ok].sort((a, b) => b.beats.length - a.beats.length || po(a) - po(b) || a.seed - b.seed).slice(0, 5);
  const fewest = [...ok].sort((a, b) => a.beats.length - b.beats.length || b.played - a.played || po(a) - po(b) || a.seed - b.seed).slice(0, 5);
  return { most, fewest };
}
// The lively and the dull quarter: for each player, the quarter of its games with the most beats and the quarter with
// the fewest (ties as for the ten games), so that no one player's style fills either group.
export function quarters(recs: GameRec[]) {
  const lively: GameRec[] = [], dull: GameRec[] = [];
  for (const p of PLAYER_IDS) {
    const g = recs.filter((r) => r.player === p && !r.problems.length);
    const q = Math.floor(g.length / 4);
    lively.push(...[...g].sort((a, b) => b.beats.length - a.beats.length || a.seed - b.seed).slice(0, q));
    dull.push(...[...g].sort((a, b) => a.beats.length - b.beats.length || b.played - a.played || a.seed - b.seed).slice(0, q));
  }
  return { lively, dull };
}
// The first ten seasons, as a friend would hear them: a man in two kinds of beat (he rises and then turns plotter,
// say, or turns plotter and is executed), and something begun and then closed (a seat won back, a warning come true,
// a war ended, a return from exile).
function firstTen(r: GameRec) {
  const bs = r.beats.filter((b) => b.season < 10);
  const per = new Map<string, Set<Kind>>();
  for (const b of bs) for (const w of b.who ?? []) if (w !== PLAYER) (per.get(w) ?? per.set(w, new Set()).get(w)!).add(b.kind);
  return {
    beats: bs.length, kinds: new Set(bs.map((b) => b.kind)).size,
    arc: [...per.values()].some((k) => k.size >= 2),
    payoff: bs.some((b) => PAYOFF.includes(b.kind)),
    payoffBeyondVote: bs.some((b) => PAYOFF.includes(b.kind) && !(b.kind === "seat" && b.text === "You win back the generalship")),
  };
}
// Beats per season, among the games still being played in that season.
function perSeason(rs: GameRec[]) {
  return Array.from({ length: SEASONS }, (_, i) => {
    const going = rs.filter((r) => r.played > i);
    return { going: going.length, beats: going.length ? sum(going.map((r) => r.beats.filter((b) => b.season === i).length)) / going.length : 0 };
  });
}

// ---------- The two charts (plain SVG; light and dark, with each value under the pointer) ----------
const FONT = `font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"`;
const STYLE = `<style>
  .bg{fill:#ffffff} .t1{fill:#191919} .t2{fill:#666666} .grid{stroke:#e7e7e7} .axis{stroke:#c2c2c2}
  .s1{fill:#257de0} .s2{fill:#f47230} .l1{stroke:#257de0} .l2{stroke:#f47230} .hit{fill:transparent}
  @media (prefers-color-scheme: dark){ .bg{fill:#191919} .t1{fill:#efefef} .t2{fill:#9c9c9c} .grid{stroke:#303030} .axis{stroke:#474747}
    .s1{fill:#338ced} .s2{fill:#e76624} .l1{stroke:#338ced} .l2{stroke:#e76624} }
</style>`;
const xmlEsc = (x: string) => x.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const niceMax = (v: number) => { const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 10]; const p = 10 ** Math.floor(Math.log10(v || 1)); for (const s of steps) if (s * p >= v) return s * p; return 10 * p; };
// A horizontal bar from x0 to x1, its far end rounded (4px), its base square on the axis.
const hbar = (x0: number, x1: number, y: number, h: number, cls: string, tip: string) => {
  const w = Math.max(0, x1 - x0), r = Math.min(4, w, h / 2);
  const d = w <= 0 ? "" : `M${x0},${y}h${f1(w - r)}a${r},${r} 0 0 1 ${r},${r}v${f1(h - 2 * r)}a${r},${r} 0 0 1 -${r},${r}h-${f1(w - r)}z`;
  return `<g><title>${xmlEsc(tip)}</title>${d ? `<path class="${cls}" d="${d}"/>` : ""}<rect class="hit" x="${x0}" y="${y - 4}" width="${Math.max(w, 24)}" height="${h + 8}"/></g>`;
};

export function kindChart(lively: GameRec[], dull: GameRec[]) {
  const W = 760, left = 250, right = 48, top = 112, row = 40, barH = 12, gap = 2;
  const rows = KINDS.map((k) => ({ k, a: mean(lively.map((r) => r.kinds[k.id] ?? 0)), b: mean(dull.map((r) => r.kinds[k.id] ?? 0)) }));
  const max = niceMax(Math.max(...rows.flatMap((x) => [x.a, x.b])));
  const plotW = W - left - right, H = top + rows.length * row + 48;
  const X = (v: number) => left + (v / max) * plotW;
  const ticks = Array.from({ length: Math.floor(max) + 1 }, (_, i) => i).filter((v) => max <= 10 || v % 2 === 0);
  const out: string[] = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FONT} role="img" aria-labelledby="t d">`, STYLE);
  out.push(`<title id="t">Beats per game, by kind: lively games against dull ones</title>`);
  out.push(`<desc id="d">For each of the eight kinds of beat, the average number per game in the lively quarter (${lively.length} games) and the dull quarter (${dull.length} games). ${rows.map((x) => `${x.k.name}: ${f2(x.a)} against ${f2(x.b)}`).join(". ")}.</desc>`);
  out.push(`<rect class="bg" width="${W}" height="${H}"/>`);
  out.push(`<text class="t1" x="24" y="32" font-size="17" font-weight="600">Beats per game, by kind: lively games against dull ones</text>`);
  out.push(`<text class="t2" x="24" y="54" font-size="13">For each player, the quarter of its games with the most beats and the quarter with the fewest,</text>`);
  out.push(`<text class="t2" x="24" y="71" font-size="13">${lively.length} games each. Second island test, ${SEASONS} seasons.</text>`);
  // legend
  out.push(`<rect class="s1" x="24" y="86" width="12" height="12" rx="2"/><text class="t1" x="42" y="96" font-size="13">Lively quarter</text>`);
  out.push(`<rect class="s2" x="150" y="86" width="12" height="12" rx="2"/><text class="t1" x="168" y="96" font-size="13">Dull quarter</text>`);
  for (const v of ticks) out.push(`<line class="grid" x1="${f1(X(v))}" x2="${f1(X(v))}" y1="${top - 6}" y2="${top + rows.length * row}" stroke-width="1"/>`);
  rows.forEach((x, i) => {
    const y = top + i * row + (row - 2 * barH - gap) / 2;
    out.push(`<text class="t1" x="${left - 12}" y="${y + barH + 4}" font-size="13" text-anchor="end">${xmlEsc(x.k.name)}</text>`);
    out.push(hbar(left, X(x.a), y, barH, "s1", `${x.k.name}, lively quarter: ${f2(x.a)} per game`));
    out.push(hbar(left, X(x.b), y + barH + gap, barH, "s2", `${x.k.name}, dull quarter: ${f2(x.b)} per game`));
    // the value at each bar's end, small, in the secondary ink (the table in results.md has them too)
    out.push(`<text class="t2" x="${f1(X(x.a) + 6)}" y="${y + barH - 2}" font-size="11">${f1(x.a)}</text>`);
    out.push(`<text class="t2" x="${f1(X(x.b) + 6)}" y="${y + 2 * barH + gap - 2}" font-size="11">${f1(x.b)}</text>`);
  });
  const base = top + rows.length * row;
  out.push(`<line class="axis" x1="${left}" x2="${left}" y1="${top - 6}" y2="${base}" stroke-width="1"/>`);
  for (const v of ticks) out.push(`<text class="t2" x="${f1(X(v))}" y="${base + 18}" font-size="12" text-anchor="middle">${v}</text>`);
  out.push(`<text class="t2" x="${left + plotW / 2}" y="${base + 38}" font-size="12" text-anchor="middle">beats per game</text>`);
  out.push(`</svg>`);
  return out.join("\n") + "\n";
}

export function seasonChart(lively: GameRec[], dull: GameRec[]) {
  const W = 760, H = 430, left = 64, right = 120, top = 124, bottom = 56;
  const a = perSeason(lively), b = perSeason(dull);
  const max = niceMax(Math.max(...a.map((x) => x.beats), ...b.map((x) => x.beats)));
  const plotW = W - left - right, plotH = H - top - bottom;
  const X = (i: number) => left + (i / (SEASONS - 1)) * plotW, Y = (v: number) => top + plotH - (v / max) * plotH;
  const step = max <= 1 ? 0.25 : max <= 3 ? 0.5 : 1;
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  const out: string[] = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FONT} role="img" aria-labelledby="t d">`, STYLE);
  out.push(`<title id="t">Beats per season: lively games against dull ones</title>`);
  out.push(`<desc id="d">Average beats in each of the 30 seasons, among the games still being played that season. Lively quarter: ${a.map((x) => f2(x.beats)).join(", ")}. Dull quarter: ${b.map((x) => f2(x.beats)).join(", ")}.</desc>`);
  out.push(`<rect class="bg" width="${W}" height="${H}"/>`);
  out.push(`<text class="t1" x="24" y="32" font-size="17" font-weight="600">Beats per season: lively games against dull ones</text>`);
  out.push(`<text class="t2" x="24" y="54" font-size="13">Average beats in each season, among the games still being played then.</text>`);
  out.push(`<text class="t2" x="24" y="71" font-size="13">The same two quarters as the chart of beats by kind.</text>`);
  out.push(`<line class="l1" x1="24" x2="40" y1="92" y2="92" stroke-width="2" stroke-linecap="round"/><text class="t1" x="46" y="96" font-size="13">Lively quarter</text>`);
  out.push(`<line class="l2" x1="150" x2="166" y1="92" y2="92" stroke-width="2" stroke-linecap="round"/><text class="t1" x="172" y="96" font-size="13">Dull quarter</text>`);
  for (const v of ticks) {
    out.push(`<line class="${v === 0 ? "axis" : "grid"}" x1="${left}" x2="${left + plotW}" y1="${f1(Y(v))}" y2="${f1(Y(v))}" stroke-width="1"/>`);
    out.push(`<text class="t2" x="${left - 8}" y="${f1(Y(v) + 4)}" font-size="12" text-anchor="end">${v}</text>`);
  }
  for (const i of [0, 4, 9, 14, 19, 24, 29]) out.push(`<text class="t2" x="${f1(X(i))}" y="${top + plotH + 18}" font-size="12" text-anchor="middle">${i + 1}</text>`);
  out.push(`<text class="t2" x="${left + plotW / 2}" y="${top + plotH + 38}" font-size="12" text-anchor="middle">season</text>`);
  out.push(`<text class="t2" x="${left - 8}" y="${top - 14}" font-size="12" text-anchor="end">beats</text>`);
  const line = (xs: { beats: number }[], cls: string) => `<path class="${cls}" fill="none" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" d="${xs.map((x, i) => `${i ? "L" : "M"}${f1(X(i))},${f1(Y(x.beats))}`).join("")}"/>`;
  out.push(line(a, "l1"), line(b, "l2"));
  // end labels, nudged apart if they would touch
  let ya = Y(a[SEASONS - 1].beats), yb = Y(b[SEASONS - 1].beats);
  if (Math.abs(ya - yb) < 16) { const mid = (ya + yb) / 2, up = ya <= yb ? -1 : 1; ya = mid + up * 8; yb = mid - up * 8; }
  out.push(`<text class="t1" x="${left + plotW + 8}" y="${f1(ya + 4)}" font-size="13">Lively quarter</text>`);
  out.push(`<text class="t1" x="${left + plotW + 8}" y="${f1(yb + 4)}" font-size="13">Dull quarter</text>`);
  // a hover band per season with both values
  for (let i = 0; i < SEASONS; i++) {
    const x0 = i === 0 ? left : (X(i - 1) + X(i)) / 2, x1 = i === SEASONS - 1 ? left + plotW : (X(i) + X(i + 1)) / 2;
    out.push(`<g><title>Season ${i + 1}: lively ${f2(a[i].beats)} beats (${a[i].going} games still going), dull ${f2(b[i].beats)} (${b[i].going} games still going)</title><rect class="hit" x="${f1(x0)}" y="${top}" width="${f1(x1 - x0)}" height="${plotH}"/></g>`);
  }
  out.push(`</svg>`);
  return out.join("\n") + "\n";
}

// ---------- The files ----------
function writeStoryReport(out: string, recs: GameRec[], N: number) {
  const ok = recs.filter((r) => !r.problems.length);
  const by = (p: string) => ok.filter((r) => r.player === p);
  const { most, fewest } = pickGames(recs);
  const { lively, dull } = quarters(recs);
  const L: string[] = [];
  const row = (...xs: (string | number)[]) => L.push(`| ${xs.join(" | ")} |`);
  // A table's head; the columns named in left are set flush left (words), the rest flush right (numbers).
  const headL = (left: number[], ...xs: string[]) => { row(...xs); L.push(`|${xs.map((_, i) => (left.includes(i) ? " --- " : " ---: ")).join("|")}|`); };
  const head = (...xs: string[]) => headL([0], ...xs);

  L.push(`# Story metrics: the numbers`, ``);
  L.push(`Written by \`node scripts/story-metrics.ts\`. ${recs.length} games of the Second island test, ${SEASONS} seasons each (or until the ruler falls): ${N} each for ${PLAYER_IDS.map(playerName).join(", ")}, seeds 1 to ${N}. The players are the playtest bot's. The report that reads these numbers is [report.md](report.md); every game is listed in [games.md](games.md).`, ``);
  const problems = recs.filter((r) => r.problems.length);
  L.push(problems.length ? `**${problems.length} games had a problem** and are left out of the tables: ${problems.map((r) => `${playerName(r.player)} seed ${r.seed} (${r.problems.join("; ")})`).join("; ")}.` : `Every game ran without a crash, every game's state checked out at the end, and replaying each game's moves gave the same game.`, ``);

  L.push(`## What counts as a beat`, ``, `A beat is something a player would mention when telling someone about the game. Each is read from the lines the player can see in the log; the quotes are the game's own words.`, ``);
  for (const k of KINDS) L.push(`- **${k.name}.** ${k.reads}`);
  L.push(``, `The **longest quiet stretch** is the longest run of seasons with no beat in it. A season with the first half of a two-part beat that later closed (a seat lost, a war begun, a flight into exile) is not quiet.`, ``);
  L.push(`**Churn** is not a beat: it counts each time a faction sours back to Rebellious. It is here because it is the commonest swing in the game and it never makes a beat on its own.`, ``);

  L.push(`## Each player's games`, ``);
  head("", ...PLAYER_IDS.map(playerName));
  row("Games", ...PLAYER_IDS.map((p) => by(p).length));
  row("Still ruling after 30 seasons", ...PLAYER_IDS.map((p) => by(p).filter((r) => r.end === "ruling").length));
  row("Killed before then", ...PLAYER_IDS.map((p) => by(p).filter((r) => r.end === "killed").length));
  const otherEnds = [...new Set(ok.map((r) => r.end))].filter((e) => e !== "ruling" && e !== "killed");
  for (const e of otherEnds) row(e === "exile" ? `In exile after ${SEASONS} seasons` : `Ended: ${ENDS[e] ?? e}`, ...PLAYER_IDS.map((p) => by(p).filter((r) => r.end === e).length));
  row("Seasons played, on average", ...PLAYER_IDS.map((p) => f1(mean(by(p).map((r) => r.played)))));
  row("Beats per game: average", ...PLAYER_IDS.map((p) => f1(mean(by(p).map((r) => r.beats.length)))));
  row("Beats per game: middle game", ...PLAYER_IDS.map((p) => median(by(p).map((r) => r.beats.length))));
  row("Beats per game: fewest to most", ...PLAYER_IDS.map((p) => { const b = by(p).map((r) => r.beats.length); return `${Math.min(...b)} to ${Math.max(...b)}`; }));
  row("Kinds of beat per game (of 8), average", ...PLAYER_IDS.map((p) => f1(mean(by(p).map((r) => Object.keys(r.kinds).length)))));
  row("Beats in the first ten seasons, average", ...PLAYER_IDS.map((p) => f1(mean(by(p).map((r) => r.firstTen)))));
  row("Longest quiet stretch: average", ...PLAYER_IDS.map((p) => f1(mean(by(p).map((r) => r.quiet.length)))));
  row("Longest quiet stretch: middle game", ...PLAYER_IDS.map((p) => median(by(p).map((r) => r.quiet.length))));
  row("Longest quiet stretch: the longest", ...PLAYER_IDS.map((p) => Math.max(...by(p).map((r) => r.quiet.length))));
  row("Games with a quiet stretch of 8 seasons or more", ...PLAYER_IDS.map((p) => pct(by(p).filter((r) => r.quiet.length >= 8).length, by(p).length)));
  row("Churn per game (a faction back to Rebellious)", ...PLAYER_IDS.map((p) => f1(mean(by(p).map((r) => r.facts.relapses ?? 0)))));
  row("Lines seen per game", ...PLAYER_IDS.map((p) => Math.round(mean(by(p).map((r) => r.facts.linesSeen ?? 0)))));
  L.push(``);

  L.push(`## Beats by kind`, ``, `Average per game, and in brackets the share of games with at least one.`, ``);
  head("Beat", ...PLAYER_IDS.map(playerName), "All games");
  for (const k of KINDS) {
    const cell = (rs: GameRec[]) => `${f2(mean(rs.map((r) => r.kinds[k.id] ?? 0)))} (${pct(rs.filter((r) => r.kinds[k.id]).length, rs.length)})`;
    row(k.name, ...PLAYER_IDS.map((p) => cell(by(p))), cell(ok));
  }
  L.push(``);
  // The commonest wordings of each kind, so a reader can see what the beats are made of.
  L.push(`### What the beats mostly are`, ``, `The five commonest beats of each kind across all games, names kept, with how many games had each.`, ``);
  for (const k of KINDS) {
    const c = new Map<string, number>();
    for (const r of ok) for (const t of new Set(r.beats.filter((b) => b.kind === k.id).map((b) => b.text.replace(/(Spring|Summer|Autumn|Winter) [\d/]+ BC/g, "[a season]")))) c.set(t, (c.get(t) ?? 0) + 1);
    const topK = [...c].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 5);
    L.push(`- **${k.name}:** ${topK.length ? topK.map(([t, n]) => `"${md(t)}" (${n})`).join("; ") : "none"}.`);
  }
  L.push(``);

  L.push(`## The first ten seasons`, ``, `What a player has to tell after ten seasons. **A man with a story**: someone (not you) in two kinds of beat by then, for instance he rises and then turns plotter, or turns plotter and is executed. **Something begun and closed**: a seat won back, a warning come true, a war ended or a return from exile. The generalship changes hands often (given to a man who asks for it, lost at the spring vote, handed back when its holder is arrested), so the line below that one leaves out the generalship won back on its own.`, ``);
  head("", ...PLAYER_IDS.map(playerName));
  const ft = (p: string) => by(p).map(firstTen);
  row("Beats, middle game", ...PLAYER_IDS.map((p) => median(ft(p).map((x) => x.beats))));
  row("Kinds of beat, middle game", ...PLAYER_IDS.map((p) => median(ft(p).map((x) => x.kinds))));
  row("Games with no beat at all", ...PLAYER_IDS.map((p) => pct(ft(p).filter((x) => !x.beats).length, by(p).length)));
  row("Games with three kinds of beat or more", ...PLAYER_IDS.map((p) => pct(ft(p).filter((x) => x.kinds >= 3).length, by(p).length)));
  row("Games with a man with a story", ...PLAYER_IDS.map((p) => pct(ft(p).filter((x) => x.arc).length, by(p).length)));
  row("Games with something begun and closed", ...PLAYER_IDS.map((p) => pct(ft(p).filter((x) => x.payoff).length, by(p).length)));
  row("... leaving out the generalship won back", ...PLAYER_IDS.map((p) => pct(ft(p).filter((x) => x.payoffBeyondVote).length, by(p).length)));
  row("Games with both a man with a story and something closed", ...PLAYER_IDS.map((p) => pct(ft(p).filter((x) => x.arc && x.payoff).length, by(p).length)));
  L.push(``);

  L.push(`## When the big things happen`, ``, `The first season in which each happens, among the games where it does.`, ``);
  head("", ...PLAYER_IDS.map(playerName));
  for (const [key, what] of [["warAt", "Carthage declares war"], ["strikeAt", "A plot strikes at you"], ["fleeAt", "You flee into exile"]] as const) {
    row(`${what}: by season 10`, ...PLAYER_IDS.map((p) => pct(by(p).filter((r) => r.facts[key] && r.facts[key] <= 10).length, by(p).length)));
    row(`... by season ${SEASONS}`, ...PLAYER_IDS.map((p) => pct(by(p).filter((r) => r.facts[key]).length, by(p).length)));
    row(`... season it first happens, middle game`, ...PLAYER_IDS.map((p) => { const xs = by(p).map((r) => r.facts[key]).filter((x) => x); return xs.length ? median(xs) : "never"; }));
  }
  L.push(``);

  L.push(`## Quiet stretches`, ``, `How long each game's longest stretch with no beat is, and where in the game it falls.`, ``);
  const bands = [[0, 2], [3, 4], [5, 6], [7, 9], [10, 14], [15, 30]];
  head("Longest quiet stretch", ...PLAYER_IDS.map(playerName));
  for (const [a, b] of bands) row(`${a} to ${b} seasons`, ...PLAYER_IDS.map((p) => by(p).filter((r) => r.quiet.length >= a && r.quiet.length <= b).length));
  L.push(``);
  head("It starts in", ...PLAYER_IDS.map(playerName));
  for (const [a, b] of [[0, 9], [10, 19], [20, 29]]) row(`seasons ${a + 1} to ${b + 1}`, ...PLAYER_IDS.map((p) => by(p).filter((r) => r.quiet.length > 0 && r.quiet.from >= a && r.quiet.from <= b).length));
  L.push(``);

  L.push(`## Lively games against dull ones`, ``, `For each player, the quarter of its games with the most beats (the lively quarter) and the quarter with the fewest (the dull quarter), ${lively.length} games each. Taking quarters inside each player keeps the iron hand's busy games from filling the lively quarter by themselves. These are the tables behind the two charts.`, ``);
  L.push(`![Beats per game, by kind](beats-by-kind.svg)`, ``);
  head("Per game", "Lively quarter", "Dull quarter");
  row("Beats", f1(mean(lively.map((r) => r.beats.length))), f1(mean(dull.map((r) => r.beats.length))));
  for (const k of KINDS) row(k.name, f2(mean(lively.map((r) => r.kinds[k.id] ?? 0))), f2(mean(dull.map((r) => r.kinds[k.id] ?? 0))));
  row("Kinds of beat (of 8)", f1(mean(lively.map((r) => Object.keys(r.kinds).length))), f1(mean(dull.map((r) => Object.keys(r.kinds).length))));
  row("People (not you) in a beat", f1(mean(lively.map((r) => r.facts.peopleInBeats ?? 0))), f1(mean(dull.map((r) => r.facts.peopleInBeats ?? 0))));
  row("Season of the first beat", f1(mean(lively.filter((r) => r.beats.length).map((r) => r.facts.firstBeat))), f1(mean(dull.filter((r) => r.beats.length).map((r) => r.facts.firstBeat))));
  row("Longest quiet stretch, seasons", f1(mean(lively.map((r) => r.quiet.length))), f1(mean(dull.map((r) => r.quiet.length))));
  row("Seasons played", f1(mean(lively.map((r) => r.played))), f1(mean(dull.map((r) => r.played))));
  row("Killed before season 30", `${lively.filter((r) => r.end === "killed").length} of ${lively.length}`, `${dull.filter((r) => r.end === "killed").length} of ${dull.length}`);
  row("Carthaginian landings", f2(mean(lively.map((r) => r.facts.landings ?? 0))), f2(mean(dull.map((r) => r.facts.landings ?? 0))));
  row("Battles", f2(mean(lively.map((r) => r.facts.battles ?? 0))), f2(mean(dull.map((r) => r.facts.battles ?? 0))));
  row("A war still going at the end", pct(lively.filter((r) => r.facts.unfinishedWar).length, lively.length), pct(dull.filter((r) => r.facts.unfinishedWar).length, dull.length));
  row("Plots that struck", f2(mean(lively.map((r) => r.facts.strikes ?? 0))), f2(mean(dull.map((r) => r.facts.strikes ?? 0))));
  row("Matters put to the player (\"You choose\")", f1(mean(lively.map((r) => r.facts.matters ?? 0))), f1(mean(dull.map((r) => r.facts.matters ?? 0))));
  row("Actions taken", f1(mean(lively.map((r) => r.facts.actions ?? 0))), f1(mean(dull.map((r) => r.facts.actions ?? 0))));
  row("Different actions taken", f1(mean(lively.map((r) => r.facts.kindsOfAction ?? 0))), f1(mean(dull.map((r) => r.facts.kindsOfAction ?? 0))));
  row("Churn (a faction back to Rebellious)", f1(mean(lively.map((r) => r.facts.relapses ?? 0))), f1(mean(dull.map((r) => r.facts.relapses ?? 0))));
  L.push(``, `The same comparison inside each player:`, ``);
  head("Per game", ...PLAYER_IDS.flatMap((p) => [`${playerName(p)}, lively`, "dull"]));
  const lp = (p: string) => lively.filter((r) => r.player === p), dp = (p: string) => dull.filter((r) => r.player === p);
  const both = (f: (rs: GameRec[]) => string) => PLAYER_IDS.flatMap((p) => [f(lp(p)), f(dp(p))]);
  row("Beats", ...both((rs) => f1(mean(rs.map((r) => r.beats.length)))));
  for (const k of KINDS) row(k.name, ...both((rs) => f2(mean(rs.map((r) => r.kinds[k.id] ?? 0)))));
  row("People in a beat", ...both((rs) => f1(mean(rs.map((r) => r.facts.peopleInBeats ?? 0)))));
  row("Longest quiet stretch", ...both((rs) => f1(mean(rs.map((r) => r.quiet.length)))));
  row("Seasons played", ...both((rs) => f1(mean(rs.map((r) => r.played)))));
  row("Killed before season 30", ...both((rs) => `${rs.filter((r) => r.end === "killed").length}`));
  L.push(``, `![Beats per season](beats-by-season.svg)`, ``);
  const pa = perSeason(lively), pb = perSeason(dull);
  head("Season", "Lively: beats", "games going", "Dull: beats", "games going");
  for (let i = 0; i < SEASONS; i++) row(i + 1, f2(pa[i].beats), pa[i].going, f2(pb[i].beats), pb[i].going);
  L.push(``);

  // Repetition
  const tally = new Map<string, { n: number; games: number; news: boolean; per: Record<string, number> }>();
  for (const r of ok) for (const [k, n, news] of r.sentences) {
    const x = tally.get(k) ?? { n: 0, games: 0, news, per: {} };
    x.n += n; x.games++; x.per[r.player] = (x.per[r.player] ?? 0) + n;
    tally.set(k, x);
  }
  const totalSentences = sum([...tally.values()].map((x) => x.n));
  const ranked = [...tally].sort((a, b) => b[1].n - a[1].n || (a[0] < b[0] ? -1 : 1));
  const top40 = ranked.slice(0, 40);
  L.push(`## The sentences a player sees most`, ``);
  L.push(`Every line the player can see, cut into sentences, with names put as [someone], towns as [a town] and numbers as N. Across the ${ok.length} games a player sees ${Math.round(totalSentences / ok.length)} sentences a game, of ${tally.size} different ones. The 40 commonest are ${pct(sum(top40.map(([, x]) => x.n)), totalSentences)} of everything seen. "News" marks a sentence from an event or a warning; the rest are results, rolls and changes to the numbers.`, ``);
  headL([1, 7], "", "Sentence", "Per game", ...PLAYER_IDS.map(playerName), "Games with it", "News");
  top40.forEach(([k, x], i) => row(i + 1, `"${md(k)}"`, f1(x.n / ok.length), ...PLAYER_IDS.map((p) => f1((x.per[p] ?? 0) / by(p).length)), pct(x.games, ok.length), x.news ? "news" : ""));
  L.push(``);
  const news = ranked.filter(([, x]) => x.news).slice(0, 20);
  L.push(`### The news a player sees most`, ``, `The same count, news only (events and warnings), the 20 commonest.`, ``);
  headL([1], "", "Sentence", "Per game", "Games with it");
  news.forEach(([k, x], i) => row(i + 1, `"${md(k)}"`, f1(x.n / ok.length), pct(x.games, ok.length)));
  L.push(``);

  L.push(`## The ten games retold`, ``, `The five games with the most beats and the five with the fewest, of all ${ok.length}. Ties: for the most, the player's order then the seed; for the fewest, the longer game first (the same beats over more seasons is duller), then the player's order and the seed. Each has a sheet with its beats and the game's own chronicle. Replay one with the command shown; \`npm run playtest -- --one second:<player>:<seed>\` plays the same game but goes on past season 30.`, ``);
  headL([0, 1, 5, 6, 7, 8], "", "Player", "Seed", "Beats", "Kinds", "Ended", "Longest quiet", "Sheet", "Replay");
  [...most.map((r, i) => [`Most ${i + 1}`, r] as const), ...fewest.map((r, i) => [`Fewest ${i + 1}`, r] as const)].forEach(([label, r]) =>
    row(label, playerName(r.player), r.seed, r.beats.length, Object.keys(r.kinds).length, endText(r), `${r.quiet.length} seasons`, `[sheet](sheets/${sheetName(r)})`, `\`${replayCmd(r)}\``));
  L.push(``);
  const fullFew = [...ok].filter((r) => r.played >= SEASONS).sort((a, b) => a.beats.length - b.beats.length || PLAYER_IDS.indexOf(a.player) - PLAYER_IDS.indexOf(b.player) || a.seed - b.seed).slice(0, 10);
  L.push(`For comparison, the ten games with the fewest beats among those that ran all ${SEASONS} seasons: ${fullFew.map((r) => `${playerName(r.player)} seed ${r.seed} (${r.beats.length})`).join(", ")}.`, ``);
  writeFileSync(`${out}/results.md`, L.join("\n"));

  // games.md: every game
  const G: string[] = [`# Story metrics: every game`, ``, `${ok.length} games of the Second island test, ${SEASONS} seasons each, written by \`node scripts/story-metrics.ts\`. The numbers are in [results.md](results.md). Kinds: ${KINDS.map((k) => `${SHORT[k.id][1]} = ${lc(k.name)}`).join("; ")}.`, ``];
  for (const p of PLAYER_IDS) {
    G.push(`## ${capital(playerName(p))}`, ``, `| Seed | Ended | Beats | First ten seasons | Kinds | Longest quiet | Replay |`, `| ---: | --- | ---: | ---: | --- | --- | --- |`);
    for (const r of by(p)) G.push(`| ${r.seed} | ${endText(r)} | ${r.beats.length} | ${r.firstTen} | ${kindsText(r)} | ${r.quiet.length ? `${r.quiet.length} (seasons ${r.quiet.from + 1} to ${r.quiet.from + r.quiet.length})` : "none"} | \`${replayCmd(r)}\` |`);
    G.push(``);
  }
  writeFileSync(`${out}/games.md`, G.join("\n"));

  writeFileSync(`${out}/beats-by-kind.svg`, kindChart(lively, dull));
  writeFileSync(`${out}/beats-by-season.svg`, seasonChart(lively, dull));

  // A sheet for each of the ten games: its beats, its quiet stretch, and the game's own chronicle, to retell from.
  mkdirSync(`${out}/sheets`, { recursive: true });
  const picks = [...most.map((r, i) => [`one of the five games with the most beats (${i + 1} of 5)`, r] as const), ...fewest.map((r, i) => [`one of the five games with the fewest beats (${i + 1} of 5)`, r] as const)];
  for (const [why, r] of picks) {
    const s = play(r.player, r.seed);
    const S: string[] = [`# ${capital(playerName(r.player))}, seed ${r.seed}`, ``, `Second island test, ${SEASONS} seasons at most: ${why}. Ended: ${endText(r)}${s.over && r.endSeason >= 0 ? ` (${md(s.over.text)})` : ""}.`, ``];
    S.push(`Replay: \`${replayCmd(r)}\` (add \`--log\` for every line the player saw).`, ``);
    S.push(`**${r.beats.length} beats** of ${Object.keys(r.kinds).length} kinds: ${kindsText(r)}. **Longest quiet stretch:** ${r.quiet.length ? `${r.quiet.length} seasons, ${seasonName(r.quiet.from)} to ${seasonName(r.quiet.from + r.quiet.length - 1)}` : "none"}.`, ``, `## The beats`);
    let last = -1;
    for (const b of r.beats) { if (b.season !== last) { last = b.season; S.push(``, `**Season ${b.season + 1}, ${seasonName(b.season)}**`, ``); } S.push(`- ${kindName(b.kind)}: ${md(b.text)}.`); }
    S.push(``, `## The game's own chronicle`, ``, `As the game tells it in the story view, up to the last season played.`, ``);
    const book = storyBook(s, Math.min(s.over ? s.over.season : s.season - 1, SEASONS - 1));
    for (const x of book.seasons) { S.push(`**Season ${x.season + 1}, ${x.name}.** ${x.paragraphs.map(md).join(" ")}`, ``); }
    if (book.ending && s.over && r.endSeason >= 0) S.push(`**The end.** ${md(book.ending)}`, ``);
    writeFileSync(`${out}/sheets/${sheetName(r)}`, S.join("\n"));
  }
  process.stderr.write(`Wrote results.md, games.md, two charts and ${picks.length} sheets to ${out}.\n`);
}

// ---------- The command line ----------
const argv = process.argv;
const opt = (k: string, d: string) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
const self = fileURLToPath(import.meta.url);

if (import.meta.url === `file://${process.argv[1]}`) {
  if (argv.includes("--part")) {
    // A child process: plays every game whose number in the list falls to it, and writes one record per line.
    const [k, n] = opt("--part", "0/1").split("/").map(Number);
    const N = Number(opt("--games", "200"));
    let i = 0;
    for (const p of PLAYER_IDS) for (let seed = 1; seed <= N; seed++, i++) if (i % n === k) process.stdout.write(JSON.stringify(record(p, seed)) + "\n");
  } else if (argv.includes("--one")) {
    const [p, seedS] = opt("--one", "").split(":");
    const seed = Number(seedS);
    if (!PLAYER_IDS.includes(p) && !PLAYERS.some((x) => x.id === p)) { console.error(`Unknown player "${p}". Try careful, patron or tyrant.`); process.exit(2); }
    const s = play(p, seed);
    const r = readBeats(s, seed);
    console.log(`Second island test, played by ${PLAYERS.find((x) => x.id === p)!.name}, seed ${seed}, ${SEASONS} seasons at most.`);
    console.log(`Ended: ${r.over ? `${r.over.reason} in ${seasonName(r.over.season)}: ${r.over.text}` : r.exiledAtEnd ? `in exile after ${r.played} seasons` : `still ruling after ${r.played} seasons`}`);
    console.log(`${r.beats.length} beats. Longest quiet stretch: ${r.quiet.length} seasons (${seasonName(r.quiet.from)} to ${seasonName(r.quiet.from + r.quiet.length - 1)}).\n`);
    let last = -1;
    for (const b of r.beats) { if (b.season !== last) { last = b.season; console.log(`${seasonName(b.season)} (season ${b.season + 1})`); } console.log(`  ${KINDS.find((k) => k.id === b.kind)!.name}: ${b.text}.`); }
    if (argv.includes("--log")) {
      let season = -1;
      for (const e of seen(s).filter((x) => x.season < SEASONS)) { if (e.season !== season) { season = e.season; console.log(`\n== ${seasonName(season)} ==`); } console.log(e.text); }
    }
    const save = opt("--save", "");
    if (save) {
      const st = setupById(SETUP);
      writeFileSync(save, JSON.stringify({ seed, tuning: st.tuning, scenario: s.scenario ?? "island", switches: s.switches ?? [], ...(s.preset ? { preset: s.preset } : {}), inputs: s.inputs, digest: logDigest(s) }) + "\n");
      console.log(`\nSaved to ${save}. Read it with: npm run replay-save -- ${save} --log`);
    }
  } else {
    const N = Number(opt("--games", "200")), W = Number(opt("--workers", String(availableParallelism())));
    const out = opt("--out", "docs/playtests/2026-11-27-story-metrics");
    const t0 = performance.now();
    process.stderr.write(`Playing ${N * PLAYER_IDS.length} games of ${SEASONS} seasons on ${W} processes...\n`);
    const recs: GameRec[] = [];
    await Promise.all(Array.from({ length: W }, (_, k) => new Promise<void>((resolve, reject) => {
      const child = spawn(process.execPath, [self, "--part", `${k}/${W}`, "--games", String(N)], { stdio: ["ignore", "pipe", "inherit"] });
      let buf = "";
      child.stdout.on("data", (d) => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) { recs.push(JSON.parse(buf.slice(0, i))); buf = buf.slice(i + 1); } });
      child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`part ${k} exited with ${code}`))));
    })));
    process.stderr.write(`Played in ${((performance.now() - t0) / 1000).toFixed(0)} s.\n`);
    recs.sort((a, b) => PLAYER_IDS.indexOf(a.player) - PLAYER_IDS.indexOf(b.player) || a.seed - b.seed);
    mkdirSync(out, { recursive: true });
    const json = opt("--json", "");
    if (json) writeFileSync(json, JSON.stringify(recs) + "\n");
    writeStoryReport(out, recs, N);
    process.stderr.write(`Done in ${((performance.now() - t0) / 1000).toFixed(0)} s.\n`);
  }
}
