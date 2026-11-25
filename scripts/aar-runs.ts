// The AAR batch: many full-scope island games played by the five headless players, each written out as a
// dossier a person can read and retell, plus numbers across every game (endings, story shapes, events that
// never fire or fire every game, repeated lines, what each player spends its actions on).
//   npm run aar-runs -- [--seeds 20] [--out dist/aar] [--json]
// Three sets of games:
//   full      every optional rule switch on (all of data/switches.json except "Begin fallen"), five players,
//             --seeds each; in each block of twenty seeds, ten on Standard balance and ten on Reap what you sow
//   fallen    the same switches plus "Begin fallen": the game opens in exile (four players, a quarter of --seeds each)
//   baseline  the "First island test" preset as Jacob plays it, careful player (--seeds games)
// It changes no rules. Safe to rerun: the same options give the same files, byte for byte (no dates, no timings).
// Report written from it: docs/playtests/2026-11-25-aar/report.md.
import { mkdirSync, writeFileSync } from "node:fs";
import { startGame, endSeason, storyBook, seasonName, presetOpts, SWITCHES } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";
import { botById, botRandom, playSeason } from "../src/core/bots.ts";
import type { Bot } from "../src/core/bots.ts";
import { botAnswer } from "../src/core/events.ts";
import { dionysiusBot } from "../src/core/dionysius-bot.ts";
import { brokenState } from "./sim-check.ts";
import { findShapes, scoreGame, SHAPES_FILE } from "./museum/shapes.ts";
// The turning-point patterns of scripts/story-sweep.ts (copied: importing that script would run it).
const BEATS: [string, RegExp][] = [
  ["plot", /plot strikes|plot fails|blade finds you|wounds you|is in a plot against you|starts a plot|takes over the plot/],
  ["warning", /^Named: /],
  ["enemy", /becomes your rival|is your rival again|Nemesis|old feud with you comes due/],
  ["rival", /becomes a political rival|Pretender|takes your place/],
  ["death", /is dead|put to death|dies\b|died, aged|is killed/],
  ["arrest", /Your guards take|flees the city|goes into exile/],
  ["map", /goes over to you|opens its gates|takes .* by storm|is yours|lays siege|siege of|battle|army is broken|lands at|declares war|makes peace|becomes your ally|sacks|plunder/i],
  ["carthage", /Carthage's council turns to a new goal|Carthage declares|plague is in Carthage|Libyans rise/i],
  ["exile", /exile|refuge|strike for the city|hunt/i],
];

const argv = process.argv;
const opt = (k: string, d: string) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
const N = Number(opt("--seeds", "20"));
const OUT = opt("--out", "dist/aar").replace(/\/$/, "");
const KEEP = Number(opt("--dossiers", "40")); // write dossiers for this many of the highest and a quarter as many of the lowest story scores (0: all)

const FULL = SWITCHES.filter((x) => x.id !== "exileStart").map((x) => x.id);
const PLAYERS: Record<string, string> = { careful: "the careful ruler", patron: "the patron", tyrant: "the iron hand", careless: "the careless ruler", dionysius: "Dionysius as Diodorus tells it" };
const botOf = (id: string): Bot => (id === "dionysius" ? dionysiusBot : botById(id)!);

interface Setup { set: string; bot: string; seed: number; tuning: string; switches: string[] }
const setups: Setup[] = [];
for (const bot of Object.keys(PLAYERS)) for (let seed = 1; seed <= N; seed++)
  setups.push({ set: "full", bot, seed, tuning: (seed - 1) % 20 < 10 ? "standard" : "reapWhatYouSow", switches: FULL });
for (const bot of ["careful", "patron", "tyrant", "dionysius"]) for (let seed = 1; seed <= Math.max(1, N / 4); seed++)
  setups.push({ set: "fallen", bot, seed, tuning: "reapWhatYouSow", switches: [...FULL, "exileStart"] });
const pre = presetOpts("firstIslandTest");
for (let seed = 1; seed <= N; seed++) setups.push({ set: "baseline", bot: "careful", seed, tuning: pre.tuning, switches: pre.switches ?? [] });

function play(x: Setup): GameState {
  const s = startGame(x.seed, x.tuning, { switches: x.switches, scenario: "island" });
  const bot = botOf(x.bot), r = botRandom(x.seed);
  let n = 0;
  while (!s.over && n++ < 200) { botAnswer(s); playSeason(s, bot, r); endSeason(s); }
  return s;
}

const tag = (x: Setup) => `${x.set}-${x.bot}-${String(x.seed).padStart(2, "0")}`;
// Lines with names and numbers taken out, so "the same line" means the same stock sentence.
const stock = (t: string) => t.replace(/\(now [^)]*\)/g, "").replace(/[+-]?\d+/g, "#").trim();

interface Row {
  tag: string; set: string; bot: string; seed: number; tuning: string; end: string; endText: string; endSeason: number; by?: string;
  seasons: number; score: number; ten: number; shapes: Record<string, number>; counters: Record<string, number>;
  events: string[]; actions: Record<string, number>; maxSameLine: number; maxSameLineText: string; broken: string[];
  silverMax: number; grainMin: number;
}
const rows: Row[] = [];
const lineGames: Record<string, number> = {};
const dossiers = new Map<string, string>(); // stock line -> games it appears in (full and fallen)
mkdirSync(`${OUT}/games`, { recursive: true });
let crashes = 0;
for (const x of setups) {
  let s: GameState;
  try { s = play(x); } catch (e) { crashes++; console.log(`${tag(x)}: CRASH ${(e as Error).stack}`); continue; }
  const found = findShapes(s), score = scoreGame(s, found);
  const actions: Record<string, number> = {};
  for (const i of s.inputs as { t: string; action?: string }[]) if (i.t === "act" && i.action) actions[i.action] = (actions[i.action] ?? 0) + 1;
  const vis = s.log.filter((e) => e.visible && (e.kind === "event" || e.kind === "warning"));
  const same: Record<string, number> = {};
  for (const e of vis) same[e.text] = (same[e.text] ?? 0) + 1;
  const top = Object.entries(same).sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
  let silverMax = 0, grainMin = 99;
  for (const e of s.log) {
    const m = /^Silver [+-]\d+ \(now (-?\d+)\)/.exec(e.text); if (m) silverMax = Math.max(silverMax, Number(m[1]));
    const g = /^Grain [+-]\d+ months \(now (-?\d+)\)/.exec(e.text); if (g) grainMin = Math.min(grainMin, Number(g[1]));
  }
  if (x.set !== "baseline") for (const t of new Set(vis.map((e) => stock(e.text)))) lineGames[t] = (lineGames[t] ?? 0) + 1;
  const end = s.over?.reason ?? "survived";
  const row: Row = {
    tag: tag(x), set: x.set, bot: x.bot, seed: x.seed, tuning: x.tuning, end, endText: s.over?.text ?? "", endSeason: s.over?.season ?? s.season,
    by: s.over?.by ? s.people[s.over.by]?.name ?? s.over.by : undefined, seasons: (s.over?.season ?? s.season - 1) + 1,
    score: score.total, ten: score.ten, shapes: score.shapes, counters: s.counters, events: Object.keys(s.events?.fired ?? {}),
    actions, maxSameLine: top[1], maxSameLineText: top[0], broken: brokenState(s), silverMax, grainMin,
  };
  rows.push(row);
  // The dossier: what a writer needs to tell the game straight from its log.
  const beats = vis.filter((e) => BEATS.some(([, re]) => re.test(e.text)));
  const book = storyBook(s, s.over ? s.over.season : s.season - 1);
  const md = [
    `# ${row.tag}`, "",
    `Player: ${PLAYERS[x.bot]}. Balance: ${x.tuning}. Switches: ${x.switches.length}${x.set === "fallen" ? " (begins in exile)" : ""}.`,
    `Ended: ${s.over ? `${end}, ${seasonName(s.over.season)}: ${s.over.text.replace(/\.$/, "")}` : "still ruling at the end of the decade"}. Story score ${score.total} (first ten seasons ${score.ten}).`,
    `Shapes: ${found.map((f) => `${f.shape} (${seasonName(f.season)}${f.who ? `, ${s.people[f.who]?.name ?? f.who}` : ""})`).join("; ") || "none"}.`, "",
    "## Turning points", "", ...beats.map((e) => `- ${seasonName(e.season)}: ${e.text}${e.why ? ` *(${e.why})*` : ""}`), "",
    "## Everything the player saw", "",
    ...vis.map((e) => `- ${seasonName(e.season)} [${e.step}] ${e.text}${e.why ? ` *(${e.why})*` : ""}`), "",
    "## The chronicle", "", ...book.seasons.flatMap((b) => [`### ${b.name}`, "", ...b.paragraphs, ""]),
    ...(book.lives.length ? ["## Lives", "", ...book.lives.map((l) => `**${l.name}.** ${l.text}`), ""] : []),
  ].join("\n").replace(/\n{3,}/g, "\n\n");
  dossiers.set(row.tag, md);
}

{
  const ranked = rows.filter((r) => r.set !== "baseline").sort((a, b) => b.score - a.score || a.tag.localeCompare(b.tag));
  const keep = KEEP ? new Set([...ranked.slice(0, KEEP), ...ranked.slice(-Math.ceil(KEEP / 4)), ...rows.filter((r) => r.seed <= 20)].map((r) => r.tag)) : new Set(rows.map((r) => r.tag));
  for (const [t, md] of dossiers) if (keep.has(t)) writeFileSync(`${OUT}/games/${t}.md`, md);
}

// ---------- Numbers across all games ----------
const pct = (a: number, n: number) => `${Math.round((100 * a) / Math.max(1, n))}%`;
const avg = (xs: number[]) => (xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length)).toFixed(1);
const L: string[] = [];
const P = (...x: string[]) => L.push(...x);
P(`# AAR batch: ${rows.length} games, ${crashes} crashes, ${rows.filter((r) => r.broken.length).length} broken states`, "");
for (const set of ["full", "fallen", "baseline"]) {
  P(`## ${set}`, "", "| Player | Games | Survived the decade | Killed | Deposed or exiled for good | Other ends | Avg seasons | Avg story score | Tyrannies a game | Strikes a game |", "|---|---|---|---|---|---|---|---|---|---|");
  for (const bot of Object.keys(PLAYERS)) {
    const g = rows.filter((r) => r.set === set && r.bot === bot);
    if (!g.length) continue;
    const c = (f: (r: Row) => boolean) => pct(g.filter(f).length, g.length);
    const other = [...new Set(g.map((r) => r.end))].filter((e) => !["survived", "killed", "deposed", "exileEnd", "exiled"].includes(e));
    P(`| ${PLAYERS[bot]} | ${g.length} | ${c((r) => r.end === "survived")} | ${c((r) => r.end === "killed")} | ${c((r) => ["deposed", "exileEnd", "exiled"].includes(r.end))} | ${other.map((o) => `${o} ${c((r) => r.end === o)}`).join(", ") || "-"} | ${avg(g.map((r) => r.seasons))} | ${avg(g.map((r) => r.score))} | ${avg(g.map((r) => r.counters.tyrannies ?? 0))} | ${avg(g.map((r) => r.counters.strikes ?? 0))} |`);
  }
  P("");
}
const full = rows.filter((r) => r.set !== "baseline");
P("## Endings, all full-scope and fallen games", "");
const ends: Record<string, number> = {}; for (const r of full) ends[r.end] = (ends[r.end] ?? 0) + 1;
P(Object.entries(ends).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", "), "");
const by: Record<string, number> = {}; for (const r of full) if (r.by) by[r.by] = (by[r.by] ?? 0) + 1;
P("Who ended the reign: " + Object.entries(by).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", "), "");
P("Ending texts (stock form, count):", "");
const et: Record<string, number> = {}; for (const r of full) if (r.endText) { const k = stock(r.endText).replace(/^[A-Z][^.]*? (sent by|of) [^.]*?find/, "X find"); et[k] = (et[k] ?? 0) + 1; }
for (const [k, v] of Object.entries(et).sort((a, b) => b[1] - a[1]).slice(0, 15)) P(`- ${v}: ${k}`);
P("", "## Story shapes (share of full-scope and fallen games with each)", "");
for (const sh of SHAPES_FILE.shapes) { const n = full.filter((r) => r.shapes[sh.id]).length; P(`- ${sh.name} (${sh.id}${sh.dull ? ", dull" : ""}): ${pct(n, full.length)}`); }
P("", "## Events", "");
const evCount: Record<string, number> = {}; for (const r of full) for (const e of r.events) evCount[e] = (evCount[e] ?? 0) + 1;
const ev = Object.entries(evCount).sort((a, b) => b[1] - a[1]);
P(`Distinct events fired: ${ev.length}. In 80% or more of games: ${ev.filter(([, v]) => v >= 0.8 * full.length).map(([k, v]) => `${k} ${pct(v, full.length)}`).join(", ")}`, "");
P(`Fired in only one or two games: ${ev.filter(([, v]) => v <= 2).map(([k]) => k).join(", ")}`, "");
P("", "## Most common visible lines across games (stock form, share of games where it appears)", "");
for (const [k, v] of Object.entries(lineGames).sort((a, b) => b[1] - a[1]).slice(0, 30)) P(`- ${pct(v, full.length)}: ${k}`);
P("", "## Player actions (average uses a game, full scope)", "");
const acts = [...new Set(full.flatMap((r) => Object.keys(r.actions)))].sort();
P(`| Action | ${Object.keys(PLAYERS).map((b) => PLAYERS[b]).join(" | ")} |`, `|---|${Object.keys(PLAYERS).map(() => "---").join("|")}|`);
for (const a of acts) P(`| ${a} | ${Object.keys(PLAYERS).map((b) => { const g = full.filter((r) => r.set === "full" && r.bot === b); return avg(g.map((r) => r.actions[a] ?? 0)); }).join(" | ")} |`);
P("", "## Counters (average a game, full scope, by player)", "");
const keys = [...new Set(full.flatMap((r) => Object.keys(r.counters)))].sort();
P(`| Counter | ${Object.keys(PLAYERS).join(" | ")} |`, `|---|${Object.keys(PLAYERS).map(() => "---").join("|")}|`);
for (const k of keys) P(`| ${k} | ${Object.keys(PLAYERS).map((b) => { const g = full.filter((r) => r.set === "full" && r.bot === b); return avg(g.map((r) => r.counters[k] ?? 0)); }).join(" | ")} |`);
P("", "## Repetition inside one game", "");
const rep = full.slice().sort((a, b) => b.maxSameLine - a.maxSameLine);
P(`Average of the most-repeated visible line a game: ${avg(full.map((r) => r.maxSameLine))}. Worst ten:`, "");
for (const r of rep.slice(0, 10)) P(`- ${r.tag}: ${r.maxSameLine} times: "${r.maxSameLineText}"`);
P("", "## Extremes", "");
P(`Most silver held: ${full.slice().sort((a, b) => b.silverMax - a.silverMax).slice(0, 5).map((r) => `${r.tag} ${r.silverMax}`).join(", ")}`);
P(`Lowest grain: ${full.slice().sort((a, b) => a.grainMin - b.grainMin).slice(0, 5).map((r) => `${r.tag} ${r.grainMin}`).join(", ")}`, "");
P("## Ranked by story score (full scope and fallen)", "", "| Game | Score | First ten | End | Season | By | Shapes |", "|---|---|---|---|---|---|---|");
for (const r of full.slice().sort((a, b) => b.score - a.score)) P(`| ${r.tag} | ${r.score} | ${r.ten} | ${r.end} | ${r.seasons} | ${r.by ?? ""} | ${Object.keys(r.shapes).join(", ")} |`);
for (const r of rows.filter((r) => r.broken.length)) P(`Broken: ${r.tag}: ${r.broken.join("; ")}`);
writeFileSync(`${OUT}/summary.md`, L.join("\n") + "\n");
if (argv.includes("--json")) writeFileSync(`${OUT}/rows.json`, JSON.stringify(rows, null, 1));
console.log(`${rows.length} games, ${crashes} crashes, ${rows.filter((r) => r.broken.length).length} broken. Wrote ${OUT}/summary.md and ${OUT}/games/.`);
