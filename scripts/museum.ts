// The story museum (bet B1 of the two-day plan): play many island games with bots, find story shapes in each
// log (data/story-shapes.json), score them, and bind the ten best and ten dullest as readable chronicles.
//   npm run museum                                    400 games for each of the careful, patron and iron-hand players
//   npm run museum -- --seeds 100 --bots careful      fewer games, one player
//   npm run museum -- --no-gallery                    the report only
// Writes docs/playtests/museum/report.md and dist/workshop/museum.html. Safe to rerun: the same seeds give
// the same files, byte for byte (no dates, no timings). The score is a reading aid, never a target to tune toward.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { startGame, endSeason, storyBook, seasonName, PACKAGES } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";
import { botById, botRandom, playSeason } from "../src/core/bots.ts";
import type { Bot } from "../src/core/bots.ts";
import { botAnswer } from "../src/core/events.ts";
import { dionysiusBot, DIONYSIUS_PRIORITIES } from "../src/core/dionysius-bot.ts";
import { titledName } from "../src/core/feud.ts";
import { brokenState } from "./sim-check.ts";
import { SHAPES_FILE, findShapes, scoreGame } from "./museum/shapes.ts";
import type { Found, Score } from "./museum/shapes.ts";

const argv = process.argv;
const num = (k: string, d: number) => { const i = argv.indexOf(k); return i > 0 ? Number(argv[i + 1]) : d; };
const str = (k: string, d: string) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
const N = num("--seeds", 400);
const FIRST = num("--from", 1);
const BOTS = str("--bots", "careful,patron,tyrant").split(",");
const DION = num("--dionysius", N);
// The "First island test" preset (data/presets.json), the rules Jacob plays. Override with --tuning and --switches.
const PRESET = (JSON.parse(readFileSync(new URL("../data/presets.json", import.meta.url), "utf8")).presets as { id: string; tuning: string; switches: string[] }[]).find((p) => p.id === "firstIslandTest")!;
const TUNING = str("--tuning", PRESET.tuning);
const SWITCHES = str("--switches", PRESET.switches.join(",")).split(",").filter(Boolean);
const ROOT = new URL("../", import.meta.url);
const OUT = new URL(str("--out", "docs/playtests/museum/").replace(/\/?$/, "/"), ROOT); // where the report goes

const BOT_NAMES: Record<string, string> = { careful: "the careful ruler", patron: "the patron", tyrant: "the iron hand", careless: "the careless ruler", dionysius: "Dionysius as Diodorus tells it" };

function play(seed: number, bot: Bot): GameState {
  const s = startGame(seed, TUNING, { switches: SWITCHES, scenario: "island" });
  const r = botRandom(seed);
  let n = 0;
  while (!s.over && n++ < 200) { botAnswer(s); playSeason(s, bot, r); endSeason(s); }
  return s;
}

interface Game { seed: number; bot: string; s: GameState; found: Found[]; score: Score }
const games: Game[] = [];
const dion: Game[] = [];
let crashes = 0, broken = 0;
function run(botId: string, n: number, into: Game[]) {
  const bot = botId === "dionysius" ? dionysiusBot : botById(botId);
  if (!bot) throw new Error(`unknown bot: ${botId}`);
  for (let seed = FIRST; seed < FIRST + n; seed++) {
    let s: GameState;
    try { s = play(seed, bot); } catch (e) { crashes++; console.log(`${botId} seed ${seed}: CRASH ${(e as Error).stack}`); continue; }
    const b = brokenState(s);
    if (b.length) { broken++; console.log(`${botId} seed ${seed}: broken state: ${b.join("; ")}`); }
    const found = findShapes(s);
    into.push({ seed, bot: botId, s, found, score: scoreGame(s, found) });
  }
}
for (const b of BOTS) run(b, N, games);
if (DION) run("dionysius", DION, dion);

// ---------- Numbers ----------
const pct = (a: number, n: number) => { const v = (100 * a) / Math.max(1, n); return a > 0 && v < 0.5 ? "under 1%" : `${Math.round(v)}%`; };
const q = (xs: number[], f: number) => { const v = xs.slice().sort((a, b) => a - b); return v[Math.min(v.length - 1, Math.floor(f * v.length))] ?? 0; };
const spread = (xs: number[]) => `${q(xs, 0)} / ${q(xs, 0.25)} / ${q(xs, 0.5)} / ${q(xs, 0.75)} / ${q(xs, 1)}`;
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
const shapeById = Object.fromEntries(SHAPES_FILE.shapes.map((x) => [x.id, x]));
const whoName = (g: Game, who?: string) => (who ? (g.s.people[who] ? cap(titledName(g.s.people[who])) : who) : "");
const ends = (gs: Game[]) => { const c: Record<string, number> = {}; for (const g of gs) { const k = g.s.over?.reason ?? "unfinished"; c[k] = (c[k] ?? 0) + 1; } return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${pct(v, gs.length)}`).join(", "); };
const order = (a: Game, b: Game) => b.score.total - a.score.total || a.seed - b.seed || a.bot.localeCompare(b.bot);
const ranked = games.slice().sort(order);
const best = ranked.slice(0, 10);
const dullest = ranked.slice(-10).reverse();

// The title a curator would give a chronicle: its weightiest shape, with who it was about.
// A best reign is named for its rarest weighty shape (weight times how rare it is), so ten titles are not
// ten times the commonest story; a dull reign is named for what made it dull.
const share: Record<string, number> = {};
for (const g of games) for (const id of new Set(g.found.map((f) => f.shape))) share[id] = (share[id] ?? 0) + 1 / games.length;
function titleOf(g: Game): string {
  const val = (f: Found) => shapeById[f.shape].weight * (1.05 - (share[f.shape] ?? 0));
  const pos = g.found.filter((f) => shapeById[f.shape].weight > 0).sort((a, b) => val(b) - val(a) || a.season - b.season);
  const dull = g.found.filter((f) => shapeById[f.shape].weight < 0).sort((a, b) => shapeById[a.shape].weight - shapeById[b.shape].weight || a.season - b.season);
  const top = (g.score.total <= 2 ? dull[0] ?? pos[0] : pos[0]) ?? g.found[0];
  if (!top) return "A reign without a story";
  const w = whoName(g, top.who);
  return w ? `${shapeById[top.shape].name}: ${w}` : shapeById[top.shape].name;
}

const L: string[] = [];
const P = (x = "") => L.push(x);
const pkg = PACKAGES.find((p) => p.id === TUNING)?.name ?? TUNING;
P("# The story museum");
P("");
P(`Written by \`npm run museum\` (bet B1). ${games.length} island games: seeds ${FIRST} to ${FIRST + N - 1} for each of ${BOTS.map((b) => BOT_NAMES[b] ?? b).join(", ")}; balance package ${pkg}; switches ${SWITCHES.join(", ")} (the "First island test" rules). Plus ${dion.length} games of the Dionysius bot, reported separately.`);
P("");
P(`Crashes: ${crashes}. Broken states: ${broken}.`);
P("");
P("The score is a reading aid, not a measure of the game and never a target: each story shape found adds its weight (at most twice a game), each person with a thread of three or more beats adds half a point (up to four), and the dull shapes subtract. The shapes and weights are in `data/story-shapes.json`, all invention.");
P("");
P("## How the games scored");
P("");
P("| Player | Games | Score: lowest / quarter / median / three quarters / highest | First ten seasons, median | A story shape by season 10 | How games ended |");
P("|---|---|---|---|---|---|");
for (const b of [...BOTS, ...(dion.length ? ["dionysius"] : [])]) {
  const gs = b === "dionysius" ? dion : games.filter((g) => g.bot === b);
  P(`| ${BOT_NAMES[b] ?? b} | ${gs.length} | ${spread(gs.map((g) => g.score.total))} | ${q(gs.map((g) => g.score.ten), 0.5)} | ${pct(gs.filter((g) => g.score.ten > 0).length, gs.length)} | ${ends(gs)} |`);
}
P("");
P("## The shapes");
P("");
P(`| Shape | Weight | Games with it | ${BOTS.map((b) => BOT_NAMES[b] ?? b).join(" | ")} | Median season first seen |`);
P(`|---|---|---|${BOTS.map(() => "---").join("|")}|---|`);
const never: string[] = [];
for (const sh of SHAPES_FILE.shapes) {
  const has = (g: Game) => g.found.some((f) => f.shape === sh.id);
  const with_ = games.filter(has);
  if (!with_.length) never.push(sh.id);
  const first = with_.map((g) => g.found.find((f) => f.shape === sh.id)!.season);
  P(`| ${sh.name}${sh.dull ? " (dull)" : ""} | ${sh.weight} | ${pct(with_.length, games.length)} | ${BOTS.map((b) => pct(with_.filter((g) => g.bot === b).length, games.filter((g) => g.bot === b).length)).join(" | ")} | ${with_.length ? seasonName(q(first, 0.5)) : "-"} |`);
}
P("");
P("## Shapes that never appeared");
P("");
if (!never.length) P("Every shape appeared at least once.");
for (const id of never) P(`- **${shapeById[id].name}**: ${shapeById[id].line}`);
P("");
const table = (gs: Game[]) => {
  P("| Seed | Player | Score | Ten seasons | Title | Ending | Shapes |");
  P("|---|---|---|---|---|---|---|");
  for (const g of gs) P(`| ${g.seed} | ${BOT_NAMES[g.bot]} | ${g.score.total} | ${g.score.ten} | ${titleOf(g)} | ${g.s.over ? `${g.s.over.reason}, ${seasonName(g.s.over.season)}` : "unfinished"} | ${Object.entries(g.score.shapes).map(([k, v]) => `${shapeById[k].name}${v > 1 ? ` ×${v}` : ""}`).join("; ")} |`);
};
P("## The ten best");
P("");
table(best);
P("");
P("## The ten dullest");
P("");
table(dullest);
P("");
if (dion.length) {
  P("## The Dionysius bot (report only)");
  P("");
  P("A player whose priorities are what Diodorus says Dionysius I did, each cited in `docs/research/dionysius-bot.md`. It shows which of his habits the rules reward or punish. It is not a target: nothing is tuned toward how he fares.");
  P("");
  const acts: Record<string, number> = {};
  for (const g of dion) for (const i of g.s.inputs) if (i.t === "act") acts[i.action] = (acts[i.action] ?? 0) + 1;
  const per = (a: string) => ((acts[a] ?? 0) / dion.length).toFixed(2);
  const reached = (f: (s: GameState) => boolean) => pct(dion.filter((g) => f(g.s)).length, dion.length);
  P(`- Ended: ${ends(dion)}. Average length ${(dion.reduce((a, g) => a + (g.s.over?.season ?? g.s.season) + 1, 0) / dion.length).toFixed(1)} seasons of 40.`);
  P(`- Built the citadel in ${reached((s) => s.citadelBuilt)} of games and the wall in ${reached((s) => s.walls)}; married in ${reached((s) => !!s.people.dionysius?.married)}; disarmed the citizens in ${reached((s) => s.factions.citizens.disarmed)}.`);
  P(`- Actions a game: hire ${per("hire")}, land to the guard ${per("grantGuard")}, disarm ${per("disarm")}, executions ${per("execute")}, arrests ${per("imprison")}, pardons ${per("pardon")}, marriages ${per("marriage")}, armies raised ${per("muster")}, marches ${per("sendArmy")}, assaults ${per("assault")}, war declared ${per("declareWar")}, feasts ${per("feast")}, grain handouts ${per("grainHandout")}.`);
  const same = (bot: string) => games.filter((g) => g.bot === bot);
  for (const b of ["careful", "tyrant"].filter((x) => BOTS.includes(x))) P(`- For comparison, ${BOT_NAMES[b]}: ${ends(same(b))}.`);
  P(`- Median story score ${q(dion.map((g) => g.score.total), 0.5)}; best seed ${dion.slice().sort(order)[0]?.seed} (${titleOf(dion.slice().sort(order)[0])}).`);
  P("");
  P("| Priority | Passage | What he did |");
  P("|---|---|---|");
  for (const p of DIONYSIUS_PRIORITIES) P(`| ${p.id} | ${p.cite} | ${p.what.replace(/\|/g, "/")} |`);
  P("");
}
P("## Reading this");
P("");
P("Look for broken results, not rates: a shape no game reaches, a dull shape in most games, a player whose games all end the same way. Do not tune the simulation toward these numbers.");
mkdirSync(OUT, { recursive: true });
writeFileSync(new URL("report.md", OUT), L.join("\n") + "\n");

// ---------- The gallery ----------
function bind(g: Game, shelf: "best" | "dullest", rank: number) {
  const book = storyBook(g.s);
  return {
    shelf, rank, seed: g.seed, player: BOT_NAMES[g.bot], score: g.score.total, ten: g.score.ten, title: titleOf(g),
    ending: book.ending ?? (g.s.over?.text ?? ""), over: g.s.over ? seasonName(g.s.over.season) : "",
    seasons: book.seasons.map((x) => ({ name: x.name, p: x.paragraphs, omens: x.omens })),
    lives: book.lives.map((x) => ({ name: x.name, text: x.text })),
    shapes: g.found.map((f) => ({ name: shapeById[f.shape].name, line: shapeById[f.shape].line, dull: !!shapeById[f.shape].dull, weight: shapeById[f.shape].weight, when: seasonName(f.season), who: whoName(g, f.who), evidence: f.evidence.map((e) => ({ when: e.season >= 0 ? seasonName(e.season) : "", text: e.text })) })),
  };
}
if (!argv.includes("--no-gallery")) {
  const shelves = { best: best.map((g, i) => bind(g, "best", i + 1)), dullest: dullest.map((g, i) => bind(g, "dullest", i + 1)) };
  const stats = {
    games: games.length, players: BOTS.map((b) => BOT_NAMES[b] ?? b), rules: `${pkg}; ${SWITCHES.length} switches`,
    shapes: SHAPES_FILE.shapes.map((sh) => ({ name: sh.name, line: sh.line, weight: sh.weight, dull: !!sh.dull, share: games.filter((g) => g.found.some((f) => f.shape === sh.id)).length / Math.max(1, games.length) })),
    tenShare: games.filter((g) => g.score.ten > 0).length / Math.max(1, games.length),
  };
  const tpl = readFileSync(new URL("tools/museum/gallery.html", ROOT), "utf8");
  const data = JSON.stringify({ shelves, stats }).replace(/</g, "\\u003c");
  const dist = argv.includes("--out") ? OUT : new URL("dist/workshop/", ROOT);
  mkdirSync(dist, { recursive: true });
  writeFileSync(new URL("museum.html", dist), tpl.replace("/*MUSEUM_DATA*/null", data));
}
console.log(L.slice(0, 18).join("\n"));
console.log(`\nWrote the report${argv.includes("--no-gallery") ? "" : " and the gallery"}.`);
if (crashes || broken) process.exitCode = 1;
