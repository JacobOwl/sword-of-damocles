// The war council: five AI testers play the Near-war test (Jacob's test 4) with the war focus, each in its own way,
// and count what the war did. Report only: it changes no rule and no data, and drives the engine through the
// same calls the browser uses (via the playtest bot's playGame, so every game is also checked and replayed).
//   node scripts/war-council.ts [--games 200] [--out docs/playtests/2026-11-27-war-council/council-runs.md]
import { writeFileSync } from "node:fs";
import { SETUPS, PLAYERS, playGame, emptyAgg } from "./playtest.ts";
import { menu, preview, act, presetOpts, PRESETS } from "../src/core/index.ts";
import type { GameState, Args } from "../src/core/index.ts";
import { botAnswer } from "../src/core/events.ts";
import { botById, playSeason } from "../src/core/bots.ts";
import { NODES, city, yourArmy, carthageArmy, friendly, reachable, cityWalls, path } from "../src/core/island.ts";

type R = () => number;
const PRESET_ID = (() => { const i = process.argv.indexOf("--preset"); return i > 0 ? process.argv[i + 1] : "nearWarTest"; })(); // --preset test5
const o = presetOpts(PRESET_ID);
{ const i = process.argv.indexOf("--without"); if (i > 0) { const w = process.argv[i + 1].split(","); o.switches = o.switches!.filter((x) => !w.includes(x)); } } // e.g. --without carthageStays,aweNeedsMarch
SETUPS.push({ id: "nearwar", name: PRESETS.find((p) => p.id === PRESET_ID)!.name, tuning: o.tuning, opts: { scenario: o.scenario, switches: o.switches, preset: o.preset } });

const can = (s: GameState, a: string, args: Args = {}) => preview(s, a, args).ok;
const tryAct = (s: GameState, a: string, args: Args = {}) => (s.slots > 0 && !s.over && can(s, a, args) ? (act(s, a, args), true) : false);
const free = (s: GameState, a: string, args: Args = {}) => (!s.over && can(s, a, args) ? (act(s, a, args), true) : false); // free orders (the plan)
const careful = botById("careful")!;
const targetsOf = (s: GameState, a: string) => (menu(s).find((m) => m.id === a && !m.blocked)?.targets ?? []).map((t) => t.value);

// The nearest hostile town the army can reach, fewest walls first.
function nearestFoe(s: GameState): string | undefined {
  const ya = yourArmy(s); if (!ya) return;
  return NODES.filter((n) => !friendly("syracuse", city(s, n.id).side) && city(s, n.id).side !== "exiles" && reachable(s, ya.at).includes(n.id))
    .sort((a, b) => (city(s, b.id).side === "carthage" ? 1 : 0) - (city(s, a.id).side === "carthage" ? 1 : 0) || cityWalls(s, a.id) - cityWalls(s, b.id) || path(ya.at, a.id)!.days.at(-1)! - path(ya.at, b.id)!.days.at(-1)!)[0]?.id;
}
function warMoves(s: GameState, r: R, style: { sack: boolean; declare: boolean; guard: boolean; ravage: boolean }) {
  if (style.declare && !s.island?.war) tryAct(s, "declareWar");
  if (!yourArmy(s)) tryAct(s, "muster", { second: style.guard ? "guard" : "levy" });
  const ya = yourArmy(s);
  if (!ya) return;
  free(s, "battlePlan", { target: ["hold", "wing", "combined"][Math.floor(r() * 3)], second: r() < 0.5 ? "all" : "reserve" });
  tryAct(s, "reinforce");
  if (ya.siege) tryAct(s, "assault");
  if (style.ravage) tryAct(s, "ravage");
  const ca = carthageArmy(s);
  if (ca && ca.siege === "syracuse" && ya.at !== "syracuse") tryAct(s, "sendArmy", { target: "syracuse", second: "spare" });
  else if (ca && reachable(s, ya.at).includes(ca.at) && ya.men >= ca.men) tryAct(s, "sendArmy", { target: ca.at, second: "spare" });
  else if (!ya.siege) { const t = nearestFoe(s); if (t) tryAct(s, "sendArmy", { target: t, second: style.sack && city(s, t).side === "carthage" ? "sack" : "spare" }); }
  if (ya.food <= 0 && !friendly("syracuse", city(s, ya.at).side)) tryAct(s, "forage");
}
const persona = (id: string, name: string, summary: string, act: (s: GameState, r: R) => void) => ({ id, name, summary, answer: (s: GameState) => botAnswer(s), act });
const council = [
  persona("warlord", "The warlord (Dionysius' way)", "Declares war at once, musters levies and guard, sets a battle plan, reinforces, ravages, marches on the nearest Punic town and sacks it; the careful bot runs the city.",
    (s, r) => { warMoves(s, r, { sack: true, declare: true, guard: true, ravage: true }); playSeason(s, careful, r); }),
  persona("defender", "The defender", "Never declares war; musters only once Carthage has landed, then fights the careful bot's way with a plan and reinforcements.",
    (s, r) => { if (s.island?.war && carthageArmy(s)) warMoves(s, r, { sack: false, declare: false, guard: false, ravage: false }); playSeason(s, careful, r); }),
  persona("diplomat", "The diplomat", "Courts a town's house and sends embassies every season it has the silver; offers peace whenever at war; no army unless Carthage lands.",
    (s, r) => {
      for (const t of targetsOf(s, "courtHouse")) if (tryAct(s, "courtHouse", { target: t })) break;
      for (const t of targetsOf(s, "embassyCity")) if (preview(s, "embassyCity", { target: t }).chance! >= 0.5 && tryAct(s, "embassyCity", { target: t })) break;
      if (s.island?.war) tryAct(s, "offerPeace");
      if (s.island?.war && carthageArmy(s)) warMoves(s, r, { sack: false, declare: false, guard: false, ravage: false });
      playSeason(s, careful, r);
    }),
  persona("doomstack", "The exploit hunter (one big army)", "Musters everything, never disbands, parks the army beside towns that are not yet his and sends embassies while they fear it; ravages every hostile field; declares war in the second year.",
    (s, r) => {
      if (s.season >= 30) warMoves(s, r, { sack: false, declare: true, guard: true, ravage: true });
      else if (!yourArmy(s)) tryAct(s, "muster", { second: "guard" });
      const ya = yourArmy(s);
      if (ya) { tryAct(s, "ravage"); const t = targetsOf(s, "embassyCity").sort((a, b) => (preview(s, "embassyCity", { target: b }).chance ?? 0) - (preview(s, "embassyCity", { target: a }).chance ?? 0))[0]; if (t && !ya.siege && ya.at !== t) tryAct(s, "sendArmy", { target: t, second: "spare" }); if (t) tryAct(s, "embassyCity", { target: t }); }
      playSeason(s, careful, r);
    }),
  persona("turtle", "The turtle", "The careful bot alone: never declares war, never courts, fights only the bot's way. Shows what Carthage does if you leave it be.",
    (s, r) => playSeason(s, careful, r)),
];
PLAYERS.push(...council);

// ---------- Counting ----------
const argv = process.argv;
const num = (k: string, d: number) => { const i = argv.indexOf(k); return i > 0 ? Number(argv[i + 1]) : d; };
const str = (k: string, d: string) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
const N = num("--games", 200);
// --one warlord:7 prints one game's whole log (season, text, why) and stops; --save f.json writes it as a save.
if (argv.includes("--one")) {
  const [pid, sd] = str("--one", "").split(":");
  playGame("nearwar", pid, Number(sd), emptyAgg(), (s) => {
    for (const e of s.log) console.log(`${e.season}\t${e.text}${e.why ? `   [${e.why}]` : ""}`);
    console.log(`END: ${s.over?.reason} season ${s.over?.season} silver ${s.silver}`);
    if (argv.includes("--save")) writeFileSync(str("--save", "game.json"), JSON.stringify({ seed: Number(sd), tuning: o.tuning, scenario: o.scenario, switches: o.switches, preset: o.preset, inputs: s.inputs }) + "\n");
  });
  process.exit(0);
}
const out = str("--out", "docs/playtests/2026-11-27-war-council/council-runs.md");
type Row = Record<string, number>;
const L = (s: GameState, re: RegExp) => s.log.filter((e) => re.test(e.text)).length;
const rows: Record<string, { agg: ReturnType<typeof emptyAgg>; t: Row; ex: string[] }> = {};
for (const p of council) {
  const agg = emptyAgg(), t: Row = {}, ex: string[] = [];
  const add = (k: string, v = 1) => { t[k] = (t[k] ?? 0) + v; };
  for (let seed = 1; seed <= N; seed++) {
    playGame("nearwar", p.id, seed, agg, (s) => {
      const c = s.counters;
      const pw = s.island?.pastWars ?? [];
      add("wars", c.wars ?? 0); add("landings", c.landings ?? 0); add("battles", c.battles ?? 0);
      add("battlesWon", c.battlesWon ?? 0); add("battlesLost", c.battlesLost ?? 0);
      add("citiesTaken", c.citiesTaken ?? 0); add("citiesLost", c.citiesLost ?? 0);
      add("raids", c.carthageAct_raid ?? 0); add("courts", c.carthageAct_court ?? 0);
      add("peaces", c.peaces ?? 0); add("hunger", c.hungerSeasons ?? 0);
      add("ravages", L(s, /ravages the land of/)); add("reinforce", L(s, /^Fresh men from/)); add("drift", L(s, /allies drift home after/));
      add("purges", L(s, /drive out your friends/)); add("gates", L(s, /slips out of .+ by night/)); add("generalFell", L(s, /falls in the battle/));
      add("motyaTaken", city(s, "motya").side !== "carthage" ? 1 : 0);
      add("warNoLanding", (c.wars ?? 0) > 0 && !(c.landings ?? 0) ? 1 : 0);
      add("warNoBattle", (c.wars ?? 0) > 0 && !(c.battles ?? 0) ? 1 : 0);
      add("silverEnd", s.silver); add("silverZero", s.silver <= 0 ? 1 : 0);
      add("townsEnd", Object.values(s.island!.cities).filter((x: any) => friendly("syracuse", x.side)).length);
      add("killed", s.over?.reason && s.over.reason !== "survived" ? 1 : 0);
      add("plotsMax", Math.max(0, ...s.plots.map((pl) => pl.stage)));
      add("warsEnded", pw.length);
      // How long Carthage's first landing lasts: from the landing to the season its council wants out (or the war ends).
      const first = (re: RegExp) => s.log.find((e) => re.test(e.text))?.season;
      const land = first(/ lands at .+ with about/), out = s.log.find((e) => land !== undefined && e.season >= land && /Carthage's council turns to a new goal: Peace at a price|^The war is over/.test(e.text))?.season;
      if (land !== undefined) { add("landed"); if (out !== undefined) { add("landOut"); add("landSeasons", out - land); if (out - land <= 3) add("landShort"); } }
      add("firstBattleKills", s.log.findIndex((e) => /falls in the battle/.test(e.text)) >= 0 && s.log.filter((e) => /^Battle at /.test(e.text)).length <= 2 ? 1 : 0);
      if (pw.length && ex.length < 4) ex.push(`seed ${seed}: ${pw[0].name}: ${pw[0].chapter}`);
    });
  }
  rows[p.id] = { agg, t, ex };
  process.stderr.write(`  ${p.id} done\n`);
}
const pc = (x: number) => `${Math.round((100 * x) / N)}%`, av = (x = 0) => (x / N).toFixed(2);
const lines: string[] = [
  `# War council: the bot runs`, ``,
  `${N} games for each tester on the Near-war test preset (14 seasons from spring 398 BC), fixed seeds 1 to ${N}. Made by \`node scripts/war-council.ts --games ${N}\`. Counted, never tuned.`, ``,
  ...council.map((p) => `- **${p.name}:** ${p.summary}`), ``,
  `| tester | survived | killed | crashes | broken | replay differs | wars | war, no landing | war, no battle | landings | battles (won/lost) | towns taken / lost | Motya taken | ravages | reinforcements | purges | gates opened | hungry seasons | silver at end | out of silver | towns at end |`,
  `|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|`,
  ...council.map((p) => { const { agg, t } = rows[p.id]; return `| ${p.id} | ${pc(agg.wins)} | ${pc(t.killed)} | ${agg.issueCounts.crash ?? 0} | ${agg.issueCounts["broken state"] ?? 0} | ${agg.issueCounts["replay differs"] ?? 0} | ${av(t.wars)} | ${pc(t.warNoLanding)} | ${pc(t.warNoBattle)} | ${av(t.landings)} | ${av(t.battles)} (${av(t.battlesWon)}/${av(t.battlesLost)}) | ${av(t.citiesTaken)} / ${av(t.citiesLost)} | ${pc(t.motyaTaken)} | ${av(t.ravages)} | ${av(t.reinforce)} | ${av(t.purges)} | ${av(t.gates)} | ${av(t.hunger)} | ${av(t.silverEnd)} | ${pc(t.silverZero)} | ${av(t.townsEnd)} |`; }), ``,
  `## How long Carthage stays`, ``,
  ...council.map((p) => { const t = rows[p.id].t; return `- **${p.id}:** Carthage landed in ${pc(t.landed ?? 0)} of games; from the landing to its council wanting out (or the war's end): ${t.landOut ? (t.landSeasons / t.landOut).toFixed(1) : "-"} seasons on average, 3 or fewer in ${t.landed ? Math.round((100 * (t.landShort ?? 0)) / t.landed) : 0}% of landings. Carthage's general killed within the first two battles: ${pc(t.firstBattleKills ?? 0)} of games.`; }), ``,
  `## How games ended`, ``,
  ...council.map((p) => `- **${p.id}:** ${Object.entries(rows[p.id].agg.ends).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", ")}; by ${Object.entries(rows[p.id].agg.by).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${v}`).join(", ") || "nobody"}`), ``,
  `## Problems the checks found`, ``,
  ...council.flatMap((p) => { const is = rows[p.id].agg.issues; return is.length ? is.slice(0, 6).map((x) => `- ${p.id} seed ${x.seed}, season ${x.season}, ${x.kind}: ${x.text}`) : [`- ${p.id}: none`]; }), ``,
  `## A war's chapter, as the game writes it (first ended war in a few seeds)`, ``,
  ...council.flatMap((p) => rows[p.id].ex.slice(0, 2).map((x) => `- ${p.id}, ${x}`)), ``,
];
writeFileSync(out, lines.join("\n"));
console.log(lines.join("\n"));
