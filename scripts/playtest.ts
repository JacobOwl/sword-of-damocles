// The playtest bot: plays every playable setup hundreds of times with several kinds of player and reports what
// breaks, what always wins and what never happens. Report only: it changes no rule and no data.
//   npm run playtest                                   the full run (300 games per setup and player, 40 per action in the sweep)
//   npm run playtest -- --games 50 --sweep-games 10    a quicker run
//   npm run playtest -- --setups island,second --players random,careful --no-sweep
//   npm run playtest -- --one second:random:17         replay one game and print its problems and ending
//   npm run playtest -- --one second:random:17 --save game.json   ... and write it as a save (npm run replay-save -- game.json --log)
// Writes results.md, outcomes.svg and survival.svg to --out (default docs/playtests/2026-11-27-playtest-bot);
// --json <file> also writes the raw counts, and --report-from <file> rewrites the tables from them without playing.
// Every game drives the engine only through the calls the browser uses (act, chooseEvent, refuseRequest, endSeason),
// and each player draws from its own random stream, so every game is fixed by its setup, player and seed, and
// every game is replayed from its recorded inputs to check that it comes out the same.
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { availableParallelism } from "node:os";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  startGame, act, chooseEvent, refuseRequest, endSeason, replay, logDigest, menu, preview, secondOptions, thirdOptions,
  openEvents, eventById, presetOpts, OFFICES, SEATS, seatHolder, DATA, PRESETS, SWITCHES, guestPool, suggestTable,
} from "../src/core/index.ts";
import type { GameState, Args, GameOpts } from "../src/core/index.ts";
import { botAnswer } from "../src/core/events.ts";
import { botById, botRandom, playSeason } from "../src/core/bots.ts";
import { brokenState } from "./sim-check.ts";

// ---------- The setups (every way to start a game on main) ----------
interface Setup { id: string; name: string; tuning: string; opts: GameOpts }
const preset = (id: string) => { const o = presetOpts(id); return { tuning: o.tuning, opts: { scenario: o.scenario, switches: o.switches, preset: o.preset } }; };
// "Everything on": every rule switch except Begin fallen, which changes the start.
const EVERYTHING = SWITCHES.map((w) => w.id).filter((x) => x !== "exileStart");
export const SETUPS: Setup[] = [
  { id: "citadel", name: "The Citadel (Phase 1: Syracuse alone, Carthage as a clock)", tuning: "standard", opts: { scenario: "citadel", switches: [] } },
  { id: "island", name: "The Island (Phase 2, no rule switches)", tuning: "standard", opts: { scenario: "island", switches: [] } },
  { id: "first", name: `${PRESETS.find((p) => p.id === "firstIslandTest")!.name} (preset)`, ...preset("firstIslandTest") },
  { id: "second", name: `${PRESETS.find((p) => p.id === "secondIslandTest")!.name} (preset, the recommended game)`, ...preset("secondIslandTest") },
  { id: "fallen", name: "Begin fallen (Workshop: the island game opening in exile)", tuning: "standard", opts: { scenario: "island", switches: ["exile", "exileStart"] } },
  { id: "everything", name: "Everything on (stress test: the island game with every rule switch but Begin fallen)", tuning: "standard", opts: { scenario: "island", switches: EVERYTHING } },
];
const setupById = (id: string) => SETUPS.find((x) => x.id === id)!;

// ---------- The players ----------
type R = () => number;
// A player answers the matters open at the start of the season, then acts; matters that come up during its own turn
// (as after a failed strike from exile) get a second answer pass, with "only" naming them.
type Only = Set<string> | undefined;
interface Player { id: string; name: string; summary: string; answer: (s: GameState, r: R, only: Only) => void; act: (s: GameState, r: R) => void }
const pick = <T>(xs: T[], r: R) => xs[Math.floor(r() * xs.length)];
const shuffle = <T>(xs: T[], r: R) => { const a = xs.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const MAX_ACTS = 20; // more performed actions than this in one season means an action costs nothing and can be repeated

// A dinner's other guests (the action takes them as a list, "id,id,id"): two to four men in the city, at random.
const guestList = (s: GameState, honour: string | undefined, r: R) =>
  shuffle(guestPool(s).filter((p) => p.id !== honour), r).slice(0, 2 + Math.floor(r() * 3)).map((p) => p.id).join(",");
// One legal move picked at random from the menu: an action, then a target, a second and a third choice at random.
function randomMove(s: GameState, r: R): { a: string; args: Args } | null {
  const items = menu(s).filter((m) => !m.blocked);
  for (let tries = 0; tries < 25 && items.length; tries++) {
    const m = pick(items, r);
    const args: Args = {};
    if (m.targets) { if (!m.targets.length) continue; args.target = pick(m.targets, r).value; }
    const sec = secondOptions(s, m.id, args); if (sec.length) args.second = pick(sec, r).value;
    const th = thirdOptions(s, m.id, args); if (th.length) args.option = pick(th, r).value;
    if (m.id === "hostDinner") args.option = guestList(s, args.target, r);
    if (preview(s, m.id, args).ok) return { a: m.id, args };
  }
  return null;
}
// Every way to take one action now (target, second, third), in a random order, up to a cap.
function movesFor(s: GameState, id: string, r: R, cap = 60): Args[] {
  const m = menu(s).find((x) => x.id === id);
  if (!m || m.blocked) return [];
  const out: Args[] = [];
  for (const t of m.targets ? shuffle(m.targets.map((o) => o.value), r) : [undefined]) {
    const a1: Args = t === undefined ? {} : { target: t };
    const secs = secondOptions(s, id, a1);
    for (const sec of secs.length ? shuffle(secs.map((o) => o.value), r) : [undefined]) {
      const a2: Args = sec === undefined ? a1 : { ...a1, second: sec };
      const ths = thirdOptions(s, id, a2);
      // A dinner's guests are a free list, not a menu of options: the game's own suggested table, and a few at random.
      const opts = id === "hostDinner" ? [suggestTable(s)?.option, guestList(s, t, r), guestList(s, t, r)].filter((x): x is string => !!x) : ths.map((o) => o.value);
      for (const th of opts.length ? shuffle(opts, r) : [undefined]) {
        out.push(th === undefined ? a2 : { ...a2, option: th });
        if (out.length >= cap) return out;
      }
    }
  }
  return out;
}
function answerAtRandom(s: GameState, r: R, only: Only, share = 0.85) {
  for (const ev of openEvents(s)) {
    if (only && !only.has(ev.inst.uid)) continue;
    if (r() > share) continue; // some matters are left to take their default
    const ok = ev.choices.filter((c) => !c.blocked);
    if (ok.length) chooseEvent(s, ev.inst.uid, pick(ok, r).id);
  }
}
function actAtRandom(s: GameState, r: R) {
  let n = 0;
  while (s.slots > 0 && !s.over && n++ < MAX_ACTS) {
    if (r() < 0.08) break; // now and then a season with an action left unused
    const mv = randomMove(s, r);
    if (!mv) break;
    act(s, mv.a, mv.args);
  }
}
// The greedy hoarder answers each matter with whatever leaves it the most silver.
function silverOf(effects: any[] | undefined) { return (effects ?? []).reduce((a, e) => a + (typeof e.silver === "number" ? e.silver : 0), 0); }
function answerForSilver(s: GameState, only: Only) {
  for (const ev of openEvents(s)) {
    if (only && !only.has(ev.inst.uid)) continue;
    const def = eventById(ev.inst.id)!;
    let best: { id: string; v: number } | null = null;
    for (const c of ev.choices) {
      if (c.blocked) continue;
      const d = def.choices!.find((x) => x.id === c.id)!;
      let v = silverOf(d.effects) - (d.cost?.silver ?? 0);
      if (d.roll && c.roll) v += c.roll.chance * silverOf(d.roll.success.effects) + (1 - c.roll.chance) * silverOf(d.roll.failure.effects);
      if (!best || v > best.v || (v === best.v && c.isDefault)) best = { id: c.id, v };
    }
    if (best) chooseEvent(s, ev.inst.uid, best.id);
  }
}
const INCOME: [string, (s: GameState) => Args[]][] = [
  ["strikeCoin", () => [{}]],
  ["proposeLaw", () => ["levyRich", "taxPeople", "harbourDues"].map((x) => ({ target: x }))],
  ["seize", (s) => (menu(s).find((m) => m.id === "seize")?.targets ?? []).map((o) => ({ target: o.value }))],
  ["raid", (s) => (menu(s).find((m) => m.id === "raid")?.targets ?? []).map((o) => ({ target: o.value }))],
  ["exRaid", (s) => movesFor(s, "exRaid", () => 0)],
];
function hoard(s: GameState) {
  let n = 0;
  while (s.slots > 0 && !s.over && n++ < MAX_ACTS) {
    let done = false;
    for (const [a, opts] of INCOME) {
      for (const args of opts(s)) if (preview(s, a, args).ok) { act(s, a, args); done = true; break; }
      if (done) break;
    }
    if (!done) break;
  }
}
// The existing bots: their own actions (playSeason), and matters answered by the game's own bot rule or at random.
const viaBot = (id: string, answer: "bot" | "random") => ({
  answer: (s: GameState, r: R, only: Only) => (answer === "bot" ? botAnswer(s) : answerAtRandom(s, r, only, 1)),
  act: (s: GameState, r: R) => playSeason(s, botById(id)!, r),
});
const nothing = () => {};
export const PLAYERS: Player[] = [
  { id: "idle", name: "Idle", summary: "Does nothing at all: no actions, matters take their default, petitions lapse. Shows what the game does on its own.", answer: nothing, act: nothing },
  { id: "random", name: "Random", summary: "Every move at random: random legal actions with random targets, random answers to matters, refuses about one petition in three.", answer: (s, r, only) => answerAtRandom(s, r, only), act: (s, r) => {
    for (const q of s.requests.slice()) if (r() < 0.3) refuseRequest(s, q.id);
    actAtRandom(s, r);
  } },
  { id: "careful", name: "Always safe (the careful ruler)", summary: "The existing careful bot: pays the guard, watches grudges, pardons, arrests only names it knows, answers matters by their listed effects.", ...viaBot("careful", "bot") },
  { id: "carefulDice", name: "Always safe, random answers", summary: "The careful ruler's actions, but every matter answered at random: shows which answers help or hurt.", ...viaBot("careful", "random") },
  { id: "patron", name: "The patron", summary: "The existing patron bot: grants petitions and offices, feasts, buys off grudges.", ...viaBot("patron", "bot") },
  { id: "tyrant", name: "Aggressive (the iron hand)", summary: "The existing iron-hand bot: mercenaries, the citadel, every office, arrests and executions, seizes the rich, sacks towns.", ...viaBot("tyrant", "bot") },
  { id: "hoarder", name: "Greedy (the hoarder)", summary: "Only takes silver: strikes coin, passes the levies, seizes, raids; refuses every petition; answers matters for the most silver.", answer: (s, _r, only) => answerForSilver(s, only), act: (s) => {
    for (const q of s.requests.slice()) refuseRequest(s, q.id);
    hoard(s);
  } },
];
// The sweep: one player per action that does nothing but that action, whenever any target makes it legal.
const onlyPlayer = (a: string): Player => ({ id: `only:${a}`, name: `Only "${a}"`, summary: "", answer: nothing, act: (s, r) => {
  let n = 0;
  while (s.slots > 0 && !s.over && n++ < MAX_ACTS) {
    const args = movesFor(s, a, r).find((x) => preview(s, a, x).ok);
    if (!args) break;
    act(s, a, args);
  }
} });
const playerById = (id: string) => (id.startsWith("only:") ? onlyPlayer(id.slice(5)) : PLAYERS.find((p) => p.id === id)!);
const playerIndex = (id: string) => [...id].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) | 0, 7);

// ---------- One game, with every check ----------
type Rec = Record<string, number>;
export interface Issue { kind: string; setup: string; player: string; seed: number; season: number; text: string }
export interface Agg {
  n: number; wins: number; ends: Rec; by: Rec; lengths: number[]; alive: Rec; tyranny: number; ms: number; slowest: [number, number];
  issues: Issue[]; issueCounts: Rec;
  evFired: Rec; evFires: Rec; chOffered: Rec; chPicked: Rec; chDefaulted: Rec; allBlocked: Rec; chWin: Rec; chGames: Rec;
  actOffered: Rec; actTaken: Rec; actGames: Rec;
  reqKinds: Rec; reqRefused: Rec; reqLapsed: Rec; reqAnswered: Rec;
  seatChanges: Rec; seatGames: Rec; cityChanges: Rec; cityGames: Rec; exileEnds: Rec;
  stuckSeasons: number; noSlotSeasons: number; maxNoSlotRun: number; inputs: number;
}
export const emptyAgg = (): Agg => ({
  n: 0, wins: 0, ends: {}, by: {}, lengths: [], alive: {}, tyranny: 0, ms: 0, slowest: [0, 0], issues: [], issueCounts: {},
  evFired: {}, evFires: {}, chOffered: {}, chPicked: {}, chDefaulted: {}, allBlocked: {}, chWin: {}, chGames: {},
  actOffered: {}, actTaken: {}, actGames: {}, reqKinds: {}, reqRefused: {}, reqLapsed: {}, reqAnswered: {},
  seatChanges: {}, seatGames: {}, cityChanges: {}, cityGames: {}, exileEnds: {}, stuckSeasons: 0, noSlotSeasons: 0, maxNoSlotRun: 0, inputs: 0,
});
const add = (r: Rec, k: string, v = 1) => { r[k] = (r[k] ?? 0) + v; };
const MAX_ISSUES = 25; // examples kept for each kind of problem; all are counted

// A state that survives JSON exactly: finite numbers, strings, booleans, null, arrays and plain objects only.
function notPlain(v: unknown, path = "s", depth = 0): string | null {
  if (v === null || typeof v === "string" || typeof v === "boolean" || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? null : `${path} = ${v}`;
  if (typeof v !== "object") return `${path} is a ${typeof v}`;
  if (depth > 40) return `${path} is nested too deep`;
  if (Array.isArray(v)) { for (let i = 0; i < v.length; i++) { const x = notPlain(v[i], `${path}[${i}]`, depth + 1); if (x) return x; } return null; }
  if (Object.getPrototypeOf(v) !== Object.prototype) return `${path} is a ${(v as object).constructor?.name ?? "non-plain object"}`;
  for (const [k, x] of Object.entries(v)) { const y = notPlain(x, `${path}.${k}`, depth + 1); if (y) return y; }
  return null;
}

export function playGame(setupId: string, playerId: string, seed: number, agg: Agg, keep?: (s: GameState) => void) {
  const st = setupById(setupId), pl = playerById(playerId);
  const opts: GameOpts = st.opts;
  const r = botRandom((seed * 1000003) ^ playerIndex(playerId));
  const issue = (kind: string, season: number, text: string) => {
    add(agg.issueCounts, kind);
    if (agg.issues.filter((x) => x.kind === kind).length < MAX_ISSUES) agg.issues.push({ kind, setup: setupId, player: playerId, seed, season, text: text.slice(0, 300) });
  };
  const t0 = performance.now();
  let s: GameState | undefined;
  const fired: Record<string, number> = {};
  const gameEv = new Set<string>(), gameAct = new Set<string>(), gameOffered = new Set<string>(), picked = new Set<string>();
  const gameSeat = new Set<string>(), gameCity = new Set<string>(), brokenSeen = new Set<string>();
  const uidToEv: Record<string, string> = {};
  const seats = () => (s!.board ? SEATS.map((x) => [x, seatHolder(s!, x) ?? ""]) : OFFICES.map((x) => [x, s!.offices[x] ?? ""])) as [string, string][];
  const sides = () => Object.values(s!.island?.cities ?? {}).map((c) => [c.id, c.side]) as [string, string][];
  const noteFired = () => {
    for (const [id, season] of Object.entries(s!.events?.fired ?? {})) if (fired[id] !== season) { fired[id] = season; add(agg.evFires, id); gameEv.add(id); }
  };
  let season = 0, noSlotRun = 0;
  try {
    s = startGame(seed, st.tuning, opts);
    noteFired();
    let lastSeats = seats(), lastSides = sides(), guard = 0;
    while (!s.over && guard++ < 70) {
      season = s.season;
      if (s.step !== "player") { issue("stuck", season, `the season opened at step "${s.step}", not the player's turn, so the season can never end`); break; }
      // What the player is offered this season.
      if (s.slots < 1) { agg.noSlotSeasons++; noSlotRun++; agg.maxNoSlotRun = Math.max(agg.maxNoSlotRun, noSlotRun); } else noSlotRun = 0;
      const items = menu(s);
      for (const m of items) if (!m.blocked) gameOffered.add(m.id);
      if (s.slots > 0 && !items.some((m) => !m.blocked)) agg.stuckSeasons++;
      const look = () => { for (const ev of openEvents(s!)) uidToEv[ev.inst.uid] = ev.inst.id; };
      for (const ev of openEvents(s)) {
        uidToEv[ev.inst.uid] = ev.inst.id;
        const free = ev.choices.filter((c) => !c.blocked);
        for (const c of free) add(agg.chOffered, `${ev.inst.id}/${c.id}`);
        if (!free.length) add(agg.allBlocked, ev.inst.id);
      }
      const reqs = new Map(s.requests.map((q) => [q.id, q.kind]));
      for (const k of reqs.values()) add(agg.reqKinds, k);
      const from = s.inputs.length;
      const atStart = new Set(openEvents(s).map((ev) => ev.inst.uid));
      pl.answer(s, r, undefined);
      pl.act(s, r);
      noteFired();
      // Matters that came up during the turn: counted as offered, then answered.
      const fresh = s.over ? [] : openEvents(s).filter((ev) => !atStart.has(ev.inst.uid));
      for (const ev of fresh) {
        uidToEv[ev.inst.uid] = ev.inst.id;
        const free = ev.choices.filter((c) => !c.blocked);
        for (const c of free) add(agg.chOffered, `${ev.inst.id}/${c.id}`);
        if (!free.length) add(agg.allBlocked, ev.inst.id);
      }
      if (fresh.length) { pl.answer(s, r, new Set(fresh.map((ev) => ev.inst.uid))); noteFired(); }
      look();
      // What the player did this season, read from the recorded inputs.
      const did = s.inputs.slice(from);
      const acts = did.filter((x) => x.t === "act");
      if (acts.length > MAX_ACTS) issue("free action loop", season, `${acts.length} actions in one season (last: ${(acts.at(-1) as any).action})`);
      for (const x of did) {
        if (x.t === "act") { add(agg.actTaken, x.action); gameAct.add(x.action); }
        else if (x.t === "choose") { const k = `${uidToEv[x.event] ?? "?"}/${x.choice}`; add(agg.chPicked, k); picked.add(k); }
        else if (x.t === "refuse") { const k = reqs.get(x.request); if (k) add(agg.reqRefused, k); }
      }
      if (!s.over) {
        for (const ev of openEvents(s)) { const d = ev.choices.find((c) => c.isDefault); if (d) add(agg.chDefaulted, `${ev.inst.id}/${d.id}`); }
        const left = new Set(s.requests.map((q) => q.id));
        for (const [id, k] of reqs) if (left.has(id)) add(agg.reqLapsed, k); else if (!did.some((x) => x.t === "refuse" && x.request === id)) add(agg.reqAnswered, k);
        const before = s.season;
        endSeason(s);
        noteFired();
        if (!s.over && s.season === before) { issue("stuck", season, "the season did not end when the player ended it"); break; }
      }
      const b = brokenState(s);
      for (const x of b) { const k = x.replace(/[0-9-]+/g, "#"); if (!brokenSeen.has(k)) { brokenSeen.add(k); issue("broken state", season, x); } }
      const nowSeats = seats();
      nowSeats.forEach(([k, h], i) => { if (h !== lastSeats[i][1]) { add(agg.seatChanges, k); gameSeat.add(k); } });
      lastSeats = nowSeats;
      const nowSides = sides();
      nowSides.forEach(([k, side], i) => { if (side !== lastSides[i]?.[1]) { add(agg.cityChanges, k); gameCity.add(k); } });
      lastSides = nowSides;
    }
    if (!s.over) issue("stuck", s.season, `the game had not ended after ${guard} seasons`);
  } catch (e) {
    const err = e as Error;
    const at = (err.stack ?? "").split("\n").find((l) => l.includes("/src/core/"))?.trim() ?? "";
    issue("crash", s?.season ?? season, `${err.message} ${at}`);
  }
  const ms = performance.now() - t0;
  agg.n++; agg.ms += ms;
  if (ms > agg.slowest[0]) agg.slowest = [ms, seed];
  if (!s) return;
  // The whole game again from its seed and inputs: it must come out exactly the same.
  if (!agg.issueCounts.crash || !agg.issues.some((x) => x.kind === "crash" && x.seed === seed && x.player === playerId)) {
    try {
      const again = replay(seed, s.inputs, st.tuning, opts);
      if (logDigest(again) !== logDigest(s)) {
        const i = s.log.findIndex((e, k) => again.log[k]?.text !== e.text);
        issue("replay differs", s.log[i]?.season ?? s.season, `replaying the inputs gives a different game from log line ${i}: "${s.log[i]?.text ?? ""}" became "${again.log[i]?.text ?? "(nothing)"}"`);
      }
    } catch (e) { issue("replay crash", s.season, (e as Error).message); }
    const np = notPlain(s);
    if (np) issue("state not plain data", s.season, np);
  }
  keep?.(s);
  const end = s.over?.reason ?? "unfinished";
  add(agg.ends, end);
  if (end === "survived") agg.wins++;
  if (s.over?.by) add(agg.by, s.people[s.over.by]?.name ?? s.over.by);
  const played = s.over ? s.over.season + 1 : s.season;
  agg.lengths.push(played);
  for (const k of [10, 20, 30]) if (played >= k && !(s.over && s.over.season < k)) add(agg.alive, String(k));
  if (s.counters.tyrannies) agg.tyranny++;
  if (s.exile?.end) add(agg.exileEnds, s.exile.end);
  agg.inputs += s.inputs.length;
  for (const id of gameEv) add(agg.evFired, id);
  for (const id of gameAct) add(agg.actGames, id);
  for (const id of gameOffered) add(agg.actOffered, id);
  for (const id of gameSeat) add(agg.seatGames, id);
  for (const id of gameCity) add(agg.cityGames, id);
  for (const k of picked) { add(agg.chGames, k); if (end === "survived") add(agg.chWin, k); }
}

export function mergeAgg(a: Agg, b: Agg) {
  a.n += b.n; a.wins += b.wins; a.tyranny += b.tyranny; a.ms += b.ms; a.inputs += b.inputs;
  a.stuckSeasons += b.stuckSeasons; a.noSlotSeasons += b.noSlotSeasons; a.maxNoSlotRun = Math.max(a.maxNoSlotRun, b.maxNoSlotRun);
  if (b.slowest[0] > a.slowest[0]) a.slowest = b.slowest;
  a.lengths.push(...b.lengths);
  for (const x of b.issues) if (a.issues.filter((y) => y.kind === x.kind).length < MAX_ISSUES) a.issues.push(x);
  for (const k of Object.keys(b) as (keyof Agg)[]) {
    const v = b[k];
    if (v && typeof v === "object" && !Array.isArray(v)) for (const [kk, n] of Object.entries(v as Rec)) add(a[k] as Rec, kk, n);
  }
}

// ---------- Workers ----------
interface Job { i: number; setup: string; player: string; from: number; to: number }
if (!isMainThread) {
  parentPort!.on("message", (job: Job | null) => {
    if (!job) { process.exit(0); }
    const agg = emptyAgg();
    for (let seed = job.from; seed <= job.to; seed++) playGame(job.setup, job.player, seed, agg);
    parentPort!.postMessage({ job, agg });
  });
}

async function runJobs(jobs: Job[], workers: number, onDone: (job: Job, agg: Agg) => void) {
  let next = 0, done = 0;
  const file = fileURLToPath(import.meta.url);
  await new Promise<void>((resolve, reject) => {
    const pool = Array.from({ length: Math.min(workers, jobs.length) }, () => new Worker(file));
    const feed = (w: Worker) => w.postMessage(next < jobs.length ? jobs[next++] : null);
    for (const w of pool) {
      w.on("message", ({ job, agg }: { job: Job; agg: Agg }) => {
        onDone(job, agg); done++;
        if (done % 20 === 0 || done === jobs.length) process.stderr.write(`  ${done} of ${jobs.length} batches\n`);
        if (done === jobs.length) { for (const x of pool) x.terminate(); resolve(); } else feed(w);
      });
      w.on("error", reject);
      feed(w);
    }
  });
}

// ---------- The main run ----------
const argv = process.argv;
const num = (k: string, d: number) => { const i = argv.indexOf(k); return i > 0 ? Number(argv[i + 1]) : d; };
const str = (k: string, d: string) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };

if (isMainThread && import.meta.url === `file://${process.argv[1]}`) {
  if (argv.includes("--one")) {
    const [setup, player, seed] = str("--one", "").split(":");
    const agg = emptyAgg();
    let kept: GameState | undefined;
    playGame(setup, player, Number(seed), agg, (s) => { kept = s; });
    const s = kept;
    console.log(`${setupById(setup).name}, played by ${playerById(player).name}, seed ${seed}.`);
    if (s) console.log(`Ended: ${s.over?.reason ?? "unfinished"} in season ${(s.over?.season ?? s.season) + 1}${s.over?.text ? `: ${s.over.text.replace(/\.$/, "")}` : ""}. ${s.inputs.length} inputs.`);
    console.log(agg.issues.length ? agg.issues.map((x) => `PROBLEM (${x.kind}) in season ${x.season + 1}: ${x.text}`).join("\n") : "No problems found.");
    const save = str("--save", "");
    if (save && s) {
      const st = setupById(setup);
      writeFileSync(save, JSON.stringify({ seed: Number(seed), tuning: st.tuning, scenario: s.scenario ?? "citadel", switches: s.switches ?? [], ...(s.preset ? { preset: s.preset } : {}), inputs: s.inputs, digest: logDigest(s) }) + "\n");
      console.log(`Saved to ${save}. Read it with: npm run replay-save -- ${save} --log`);
    }
  } else if (argv.includes("--report-from")) {
    // Rewrite the tables and charts from counts saved with --json, without playing again.
    const { meta, results } = JSON.parse(readFileSync(str("--report-from", ""), "utf8"));
    const out = str("--out", "docs/playtests/2026-11-27-playtest-bot");
    mkdirSync(out, { recursive: true });
    const { writeReport } = await import("./playtest-report.ts");
    writeReport(out, meta, results, Object.fromEntries(meta.setups.map(({ id }: { id: string }) => [id, { scenario: setupById(id).opts.scenario ?? "citadel", switches: setupById(id).opts.switches ?? [] }])));
    process.stderr.write(`Wrote ${out}/results.md, outcomes.svg and survival.svg from the saved counts.\n`);
  } else {
    const N = num("--games", 300), SN = num("--sweep-games", 40), W = num("--workers", availableParallelism());
    const setups = str("--setups", SETUPS.map((x) => x.id).join(",")).split(",");
    const players = str("--players", PLAYERS.map((x) => x.id).join(",")).split(",");
    const out = str("--out", "docs/playtests/2026-11-27-playtest-bot");
    const sweep = !argv.includes("--no-sweep");
    const chunk = 25;
    const jobs: Job[] = [];
    for (const setup of setups) for (const player of players) for (let f = 1; f <= N; f += chunk) jobs.push({ i: jobs.length, setup, player, from: f, to: Math.min(N, f + chunk - 1) });
    if (sweep) for (const setup of setups) {
      const o = setupById(setup).opts, sw = o.switches ?? [];
      const ids = (DATA.actions as any[]).filter((a) => !a.aiOnly && (!a.scenario || a.scenario === o.scenario) && (!a.switch || sw.includes(a.switch)) && (!a.exile || sw.includes("exile"))).map((a) => a.id as string);
      for (const a of ids) for (let f = 1; f <= SN; f += chunk) jobs.push({ i: jobs.length, setup, player: `only:${a}`, from: f, to: Math.min(SN, f + chunk - 1) });
    }
    const results: Record<string, Record<string, Agg>> = {};
    const t0 = performance.now();
    process.stderr.write(`Playing ${jobs.reduce((a, j) => a + j.to - j.from + 1, 0)} games on ${W} workers...\n`);
    const parts: Agg[] = [];
    await runJobs(jobs, W, (job, agg) => { parts[job.i] = agg; });
    // Merged in the order of the jobs, not the order the workers finished, so a rerun writes the same files.
    jobs.forEach((job, i) => { const row = (results[job.setup] ??= {}); if (row[job.player]) mergeAgg(row[job.player], parts[i]); else row[job.player] = parts[i]; });
    process.stderr.write(`Done in ${((performance.now() - t0) / 1000).toFixed(0)} s.\n`);
    // Times change from run to run, so they go to the console only and the files stay the same on a rerun.
    for (const [setup, row] of Object.entries(results)) {
      let slow: [number, number, string] = [0, 0, ""];
      for (const [p, a] of Object.entries(row)) { if (a.slowest[0] > slow[0]) slow = [a.slowest[0], a.slowest[1], p]; a.ms = 0; a.slowest = [0, 0]; a.lengths.sort((x, y) => x - y); a.issues.sort((x, y) => x.kind.localeCompare(y.kind) || x.player.localeCompare(y.player) || x.seed - y.seed); }
      process.stderr.write(`  ${setup}: slowest game ${(slow[0] / 1000).toFixed(1)} s (${slow[2]}, seed ${slow[1]})\n`);
    }
    mkdirSync(out, { recursive: true });
    const meta = { games: N, sweepGames: SN, setups: setups.map((id) => ({ id, name: setupById(id).name })), players: PLAYERS.filter((p) => players.includes(p.id)).map(({ id, name, summary }) => ({ id, name, summary })) };
    const json = str("--json", ""); // the raw counts, for a later look (large, so not kept in the repo)
    if (json) writeFileSync(json, JSON.stringify({ meta, results }) + "\n");
    const { writeReport } = await import("./playtest-report.ts");
    writeReport(out, meta, results, Object.fromEntries(setups.map((id) => [id, { scenario: setupById(id).opts.scenario ?? "citadel", switches: setupById(id).opts.switches ?? [] }])));
    process.stderr.write(`Wrote ${out}/results.md, outcomes.svg and survival.svg${json ? ` and ${json}` : ""}.\n`);
  }
}
export { setupById, playerById };
