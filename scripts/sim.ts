// Headless check and balance runs.
//   npm run sim -- --seeds 100                         the merge check: the simple bot, the default package
//   npm run sim -- --seeds 500 --bot careful --tuning slowFuse
//   npm run sim -- --seeds 500 --sweep                 every bot against every package, as a table
//   npm run sim -- --seeds 100 --switches clues,escalation   turn on optional rule switches (data/switches.json)
//   npm run sim -- --seeds 500 --switch-sweep --bots careful,patron --tunings standard
//                                                      each switch alone and all together, against none
//   add --markdown to print the sweep as Markdown tables, --json for raw numbers
// Every run looks for crashes and broken states and fails if it finds any.
import { runBotGame, BOTS, PACKAGES, DEFAULT_TUNING, SWITCHES, presetOpts } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";
import { brokenState } from "./sim-check.ts";

const argv = process.argv;
const num = (k: string, d: number) => { const i = argv.indexOf(k); return i > 0 ? Number(argv[i + 1]) : d; };
const str = (k: string, d: string) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
const has = (k: string) => argv.includes(k);
const N = num("--seeds", 100);
const first = num("--from", 1);
const PRESET = has("--preset") ? presetOpts(str("--preset", "")) : null; // --preset firstIslandTest: its game, balance and switches
const SCENARIO = (PRESET?.scenario ?? str("--scenario", "citadel")) as "citadel" | "island"; // island = Phase 2
const UPTO = num("--upto", 0); // --upto 10: stop every game after ten seasons and count only those

export interface Summary {
  bot: string; tuning: string; switches: string[]; n: number; crashes: number; broken: number;
  seasons: number[]; ends: Record<string, number>; sum: Record<string, number>; by: Record<string, number>;
  neverTyrant: number; tyrantEverySeason: number;
}

function run(bot: string, tuning: string, quiet: boolean, switches: string[] = []): Summary {
  const r: Summary = { bot, tuning, switches, n: N, crashes: 0, broken: 0, seasons: [], ends: {}, sum: {}, by: {}, neverTyrant: 0, tyrantEverySeason: 0 };
  for (let seed = first; seed < first + N; seed++) {
    let s: GameState;
    try { s = runBotGame(seed, { bot, tuning, switches, scenario: SCENARIO, ...(UPTO ? { seasons: UPTO } : {}) }); } catch (e) { r.crashes++; console.log(`seed ${seed}: CRASH ${(e as Error).stack}`); continue; }
    const b = brokenState(s);
    if (b.length) { r.broken++; if (!quiet || r.broken <= 3) console.log(`${bot}/${tuning} seed ${seed}: broken state: ${b.join("; ")}`); }
    for (const [k, v] of Object.entries(s.counters)) r.sum[k] = (r.sum[k] ?? 0) + v;
    if (s.census) {
      const ps = Object.values(s.census.people);
      r.sum.censusAlive = (r.sum.censusAlive ?? 0) + ps.filter((p) => p.alive).length;
      r.sum.censusBorn = (r.sum.censusBorn ?? 0) + s.log.filter((e) => e.actor === "world" && / was born to /.test(e.text)).length;
      r.sum.censusDied = (r.sum.censusDied ?? 0) + ps.filter((p) => !p.alive).length;
      r.sum.censusHeirs = (r.sum.censusHeirs ?? 0) + s.log.filter((e) => e.actor === "world" && / now heads the house| rises to be /.test(e.text)).length;
    }
    // Repetition: the most times one person made the same petition, and the most times one person became your enemy.
    const asks: Record<string, number> = {}, enemy: Record<string, number> = {};
    for (const e of s.log) {
      if (e.kind !== "event") continue;
      if (/petitions you for|demands /.test(e.text)) { const k = e.actor + e.text.replace(/demands|petitions you for/, "").replace(/,.*$/, ""); asks[k] = (asks[k] ?? 0) + 1; }
      if (/becomes your rival|is your rival again|old feud with you comes due/.test(e.text)) enemy[e.actor] = (enemy[e.actor] ?? 0) + 1;
    }
    r.sum.maxSameAsk = (r.sum.maxSameAsk ?? 0) + Math.max(0, ...Object.values(asks));
    r.sum.maxSameEnemy = (r.sum.maxSameEnemy ?? 0) + Math.max(0, ...Object.values(enemy));
    r.sum.distinctWarnings = (r.sum.distinctWarnings ?? 0) + new Set(s.log.filter((e) => e.kind === "warning").map((e) => e.text.replace(/ Your informer.*$/, ""))).size;
    r.sum.warnings = (r.sum.warnings ?? 0) + s.log.filter((e) => e.kind === "warning").length;
    r.sum.enemyMoreThanTwice = (r.sum.enemyMoreThanTwice ?? 0) + Object.values(enemy).filter((v) => v > 2).length;
    // The chronicle sentence repeated most often in one game (stock lines and repeated deeds both show here).
    const said: Record<string, number> = {};
    for (const e of s.log.filter((e) => e.kind === "chronicle")) for (const x of e.text.slice(e.text.indexOf(". ") + 2).split(/(?<=\.)\s+/)) if (x.length > 25) said[x] = (said[x] ?? 0) + 1;
    r.sum.maxSameSentence = (r.sum.maxSameSentence ?? 0) + Math.max(0, ...Object.values(said));
    const end = s.over?.reason ?? "unfinished";
    r.ends[end] = (r.ends[end] ?? 0) + 1;
    if (s.over?.by) { const nm = s.people[s.over.by]?.name ?? s.over.by; r.by[nm] = (r.by[nm] ?? 0) + 1; }
    const played = (s.over?.season ?? s.season) + 1;
    r.seasons.push(played);
    if (!s.counters.tyrannies) r.neverTyrant++;
    if ((s.counters.tyrantSeasons ?? 0) >= played - 1) r.tyrantEverySeason++;
  }
  return r;
}

const pct = (a: number, n: number) => `${Math.round((100 * a) / Math.max(1, n))}%`;
const per = (r: Summary, k: string) => ((r.sum[k] ?? 0) / r.n).toFixed(2);
const q = (xs: number[], f: number) => { const v = xs.slice().sort((a, b) => a - b); return v[Math.min(v.length - 1, Math.floor(f * v.length))] ?? 0; };
const alive = (r: Summary, k: number) => r.seasons.filter((x) => x > k).length; // still ruling after k seasons
export function storyLine(r: Summary) {
  const strikes = r.sum.strikes ?? 0;
  const top = Object.entries(r.by).sort((a, b) => b[1] - a[1]);
  const ended = top.reduce((a, [, v]) => a + v, 0);
  return {
    mean: (r.seasons.reduce((a, b) => a + b, 0) / Math.max(1, r.seasons.length)).toFixed(1),
    median: q(r.seasons, 0.5), p10: q(r.seasons, 0.1), p90: q(r.seasons, 0.9),
    year1: pct(alive(r, 4), r.n), year3: pct(alive(r, 12), r.n), year5: pct(alive(r, 20), r.n), survived: pct(r.ends.survived ?? 0, r.n),
    killed: pct(r.ends.killed ?? 0, r.n), exiled: pct(r.ends.exiled ?? 0, r.n), deposed: pct(r.ends.deposed ?? 0, r.n), fallen: pct(r.ends.fallen ?? 0, r.n),
    plots: per(r, "plots"), strikes: per(r, "strikes"), landed: strikes ? pct(r.sum.blows ?? 0, strikes) : "-",
    warned: strikes ? ((r.sum.strikeWarnSeasons ?? 0) / strikes).toFixed(1) : "-",
    leaderKnown: strikes ? pct(r.sum.strikeLeaderKnown ?? 0, strikes) : "-",
    odds: strikes ? pct(r.sum.strikeChance ?? 0, strikes) : "-",
    coinFlips: strikes ? pct(r.sum.strikeCoinFlips ?? 0, strikes) : "-",
    broken: per(r, "plots") === "0.00" ? "-" : pct(Math.max(0, (r.sum.plots ?? 0) - strikes), r.sum.plots ?? 1),
    enemies: per(r, "rivals"), nemeses: per(r, "nemeses"), political: per(r, "politicalRivals"), pretenders: per(r, "pretenders"),
    marginal: per(r, "marginal"), dominant: per(r, "dominant"), tyrannies: pct(r.n - r.neverTyrant, r.n), executions: per(r, "executions"),
    deathOdds: strikes ? pct(r.sum.strikeDeathChance ?? r.sum.strikeChance ?? 0, strikes) : "-",
    wounded: per(r, "blowsWounded"), seized: per(r, "blowsSeized"), fatal: per(r, "blows"),
    moreThanTwice: per(r, "enemyMoreThanTwice"), nemesisPeople: per(r, "nemesisPeople"), sameSentence: per(r, "maxSameSentence"),
    sameAsk: per(r, "maxSameAsk"), sameEnemy: per(r, "maxSameEnemy"), returning: per(r, "returningRivals"),
    freshWarnings: r.sum.warnings ? pct(r.sum.distinctWarnings ?? 0, r.sum.warnings) : "-",
    topShare: top.length ? pct(top[0][1], r.n) : "-",
    topEnder: top.length ? `${top[0][0]} ${pct(top[0][1], ended)}` : "-", enders: top.length,
  };
}

function printOne(r: Summary) {
  const l = storyLine(r);
  const ends = Object.entries(r.ends).map(([k, v]) => `${k} ${v}`).join(", ");
  const per2 = (k: string) => `${r.sum[k] ?? 0} (${per(r, k)} a game)`;
  console.log(`\n${N} seeds (${first} to ${first + N - 1}), played by the ${r.bot} bot, balance package ${r.tuning}, ${SCENARIO === "island" ? "the island scenario (Phase 2)" : "the citadel scenario (Phase 1)"}${r.switches.length ? `, switches ${r.switches.join(", ")}` : ""}.`);
  if (UPTO) console.log(`Counting seasons 1 to ${UPTO} only: every game stops there, so "survived" means still ruling.`);
  console.log(`Crashes: ${r.crashes}. Broken states: ${r.broken}.`);
  console.log(`Average length: ${l.mean} seasons of 40 (median ${l.median}; one game in ten ends by season ${l.p10}). Still ruling after one year ${l.year1}, three years ${l.year3}, five years ${l.year5}.`);
  console.log(`How games ended: ${ends}.`);
  console.log(`Tyrannies set up: ${per2("tyrannies")}. Games with no tyranny: ${r.neverTyrant}. Games where you were tyrant almost every season: ${r.tyrantEverySeason}.`);
  console.log(`Plots: ${per2("plots")}. Strikes: ${per2("strikes")}. Blows that landed: ${per2("blows")}. Failed plots: ${per2("plotsFailed")}.${r.switches.includes("partialBlows") ? ` Blows that only wounded: ${per2("blowsWounded")}. Blows that cost an office: ${per2("blowsSeized")}.` : ""}`);
  console.log(`Before a strike: ${l.warned} seasons of warnings on average; you knew the leader's name in ${l.leaderKnown} of strikes. Average odds of the blow: ${l.odds}; near coin flips (26 to 74%): ${l.coinFlips}.`);
  console.log(`Deaths by execution: ${per2("executions")}.`);
  console.log(`Events: ${per2("events")}, of which from the sources: ${per2("historyEvents")}. Deaths in events: ${per2("eventDeaths")}.${SCENARIO === "island" ? ` Island events: ${per2("islandEvents")}.` : ""}`);
  console.log(`Enemies made: ${per2("rivals")}. Nemeses: ${per2("nemeses")}. Political rivals: ${per2("politicalRivals")}. Pretenders: ${per2("pretenders")}. Deposed by a rival: ${per2("politicalFalls")}.`);
  console.log(`Factions falling Marginal: ${per2("marginal")}. Becoming Dominant: ${per2("dominant")}. Carthaginian sieges: ${per2("sieges")}.`);
  if (SCENARIO === "island") {
    console.log(`The island: wars ${per2("wars")}, Carthaginian landings ${per2("landings")}, sieges ${per2("islandSieges")}, battles ${per2("battles")} (you won ${per2("battlesWon")}, lost ${per2("battlesLost")}), assaults ${per2("assaults")}, cities stormed ${per2("stormed")}, starved ${per2("starved")}.`);
    console.log(`Cities taken by you ${per2("citiesTaken")} (sacked ${per2("sacks")}), lost to Carthage ${per2("citiesLost")}, allies won by embassy ${per2("alliances")}, towns going over to you ${per2("wonOver")}, towns giving in from fear ${per2("fearSurrenders")}, cities going over to Carthage ${per2("defections")}. Armies lost: yours ${per2("armiesLostYours")}, Carthage's ${per2("armiesLostCarthage")} (broken after a defeat ${per2("armiesBroken")}). Plague in a siege camp ${per2("campPlagues")}, in Carthage ${per2("carthagePlagues")}. Libyan revolts ${per2("libyanRevolts")}. Peace offers ${per2("peaceOffers")}, peaces made ${per2("peaces")}. Carthaginian silver to your enemies ${per2("carthageSilver")}.`);
    const goals = ["rebuild", "tribute", "war", "peace", "libya"].map((g) => `${g} ${per2(`carthageGoal_${g}`)}`).join(", ");
    console.log(`Seasons under each of Carthage's goals: ${goals}.`);
    const avg = (k: string) => ((r.sum[k] ?? 0) / r.n).toFixed(1);
    console.log(`The invented families, on average a game: ${avg("censusAlive")} people alive at the end, ${avg("censusBorn")} born, ${avg("censusDied")} dead (counting those dead at the end), ${avg("censusHeirs")} new heads of houses.`);
    const war = (r.sum.battles ?? 0) + (r.sum.islandSieges ?? 0) + (r.sum.citiesTaken ?? 0) + (r.sum.citiesLost ?? 0);
    if (!war) { console.log("BROKEN: no battle, siege or city changing hands in any game."); process.exitCode = 1; }
  }
  if (r.switches.includes("council")) console.log(`Council: accusations ${per2("councilAccusations")}, of them false ${per2("councilLies")}; false ones caught by a watch ${per2("liesCaught")}; actions taken against a falsely accused man ${per2("actedOnLies")}; counsellors overruled and offended ${per2("overruled")}; plotters put out of their seats ${per2("unseated")}.`);
  if (r.switches.includes("secrets")) console.log(`Secrets: you learned ${per2("secretsLearned")}, used holds ${per2("holdsUsed")}, exposed ${per2("secretsExposed")}, took offices with a hold ${per2("officesDemanded")}, learned of townsmen ${per2("townSecrets")}. Your own deeds made secrets ${per2("yourSecrets")}; rivals found yours ${per2("yourSecretsFound")}; blackmail demands ${per2("blackmailDemands")} (paid ${per2("blackmailPaid")}, refused ${per2("blackmailRefused")}); yours told to the city ${per2("yourSecretsExposed")}; held their tongue because you held a hold on them ${per2("deterred")}; silence bought back ${per2("silenceBought")}; blackmailers shown up ${per2("discredited")} (parting shots ${per2("partingShots")}).`);
  console.log(`Who ended your rule: ${Object.entries(r.by).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", ") || "no one"}.`);
}

const COLS: [string, keyof ReturnType<typeof storyLine>][] = [
  ["Mean seasons", "mean"], ["Median", "median"], ["1 year", "year1"], ["3 years", "year3"], ["5 years", "year5"], ["Full decade", "survived"],
  ["Killed", "killed"], ["Exiled", "exiled"], ["Deposed", "deposed"],
  ["Plots a game", "plots"], ["Plots broken before striking", "broken"], ["Seasons warned", "warned"], ["Leader known", "leaderKnown"], ["Blow odds", "odds"], ["Coin flips", "coinFlips"],
  ["Enemies", "enemies"], ["Nemeses", "nemeses"], ["Political rivals", "political"], ["Pretenders", "pretenders"],
  ["Marginal", "marginal"], ["Dominant", "dominant"], ["Tyranny", "tyrannies"], ["Executions", "executions"], ["Most common ender", "topEnder"], ["Different enders", "enders"],
];

const SWITCH_COLS: [string, keyof ReturnType<typeof storyLine>][] = [
  ["Mean seasons", "mean"], ["Full decade", "survived"], ["Killed", "killed"], ["Exiled", "exiled"], ["Deposed", "deposed"],
  ["Plots a game", "plots"], ["Strikes a game", "strikes"], ["Fatal blows a game", "fatal"], ["Wounded a game", "wounded"], ["Office lost to a blow", "seized"],
  ["Blow odds", "odds"], ["Odds a strike kills or exiles", "deathOdds"], ["Seasons warned", "warned"], ["Leader known", "leaderKnown"],
  ["Different warning lines", "freshWarnings"], ["Most asks for one thing by one man", "sameAsk"], ["Most times one man became your enemy", "sameEnemy"], ["People made your enemy more than twice", "moreThanTwice"], ["Most-repeated chronicle sentence", "sameSentence"],
  ["Enemies", "enemies"], ["Returning enemies", "returning"], ["Nemeses", "nemeses"], ["People who became your Nemesis", "nemesisPeople"], ["Political rivals", "political"], ["Pretenders", "pretenders"],
  ["Most common ender", "topEnder"], ["Share of games he ends", "topShare"], ["Different enders", "enders"],
];

if (has("--switch-sweep")) {
  const bots = has("--bots") ? str("--bots", "").split(",") : ["careful", "patron", "tyrant", "simple"];
  const tunings = has("--tunings") ? str("--tunings", "").split(",") : [DEFAULT_TUNING];
  // --sets none,feud,escalation+feud picks the switch sets to compare (default: none, each alone, all).
  const sets: [string, string[]][] = has("--sets")
    ? str("--sets", "").split(",").map((x) => [x, x === "none" ? [] : x === "all" ? SWITCHES.map((w) => w.id) : x.split("+")] as [string, string[]])
    : [["none", []], ...SWITCHES.map((w) => [w.id, [w.id]] as [string, string[]]), ["all", SWITCHES.map((w) => w.id)]];
  let bad = 0;
  const all: { set: string; r: Summary }[] = [];
  for (const t of tunings) for (const b of bots) for (const [name, sw] of sets) { const r = run(b, t, true, sw); all.push({ set: name, r }); bad += r.crashes + r.broken; }
  if (has("--json")) console.log(JSON.stringify(all.map(({ set, r }) => ({ set, bot: r.bot, tuning: r.tuning, ...storyLine(r), ends: r.ends, by: r.by }))));
  else for (const t of tunings) for (const b of bots) {
    const rows = all.filter((x) => x.r.tuning === t && x.r.bot === b);
    const name = PACKAGES.find((p) => p.id === t)?.name ?? t;
    console.log(`\n### ${b} player, ${name} balance (${N} seeds each)\n`);
    console.log(`| | ${rows.map((x) => x.set).join(" | ")} |`);
    console.log(`|---|${rows.map(() => "---").join("|")}|`);
    for (const [label, key] of SWITCH_COLS) console.log(`| ${label} | ${rows.map((x) => storyLine(x.r)[key]).join(" | ")} |`);
  }
  console.log(`\nCrashes and broken states across the sweep: ${bad}.`);
  if (bad) process.exitCode = 1;
} else if (has("--sweep")) {
  const bots = has("--bots") ? str("--bots", "").split(",") : ["simple", ...BOTS.map((b) => b.id)];
  const tunings = has("--tunings") ? str("--tunings", "").split(",") : PACKAGES.map((p) => p.id);
  const all: Summary[] = [];
  let bad = 0;
  for (const t of tunings) for (const b of bots) { const r = run(b, t, true); all.push(r); bad += r.crashes + r.broken; }
  if (has("--json")) console.log(JSON.stringify(all.map((r) => ({ bot: r.bot, tuning: r.tuning, ...storyLine(r), ends: r.ends, by: r.by, crashes: r.crashes, broken: r.broken }))));
  else {
    const md = has("--markdown");
    for (const t of tunings) {
      const rows = all.filter((r) => r.tuning === t);
      const name = PACKAGES.find((p) => p.id === t)?.name ?? t;
      if (md) {
        console.log(`\n### ${name} (${N} seeds each)\n`);
        console.log(`| | ${rows.map((r) => r.bot).join(" | ")} |`);
        console.log(`|---|${rows.map(() => "---").join("|")}|`);
        for (const [label, key] of COLS) console.log(`| ${label} | ${rows.map((r) => storyLine(r)[key]).join(" | ")} |`);
      } else {
        console.log(`\n== ${name} (${N} seeds each) ==`);
        console.log(["".padEnd(30), ...rows.map((r) => r.bot.padStart(14))].join(""));
        for (const [label, key] of COLS) console.log([label.padEnd(30), ...rows.map((r) => String(storyLine(r)[key]).padStart(14))].join(""));
      }
    }
    console.log(`\nCrashes and broken states across the sweep: ${bad}.`);
  }
  if (bad) process.exitCode = 1;
} else {
  const extra = has("--switches") ? str("--switches", "").split(",").filter(Boolean) : [];
  const r = run(str("--bot", "simple"), PRESET ? PRESET.tuning : str("--tuning", DEFAULT_TUNING), false, PRESET ? [...(PRESET.switches ?? []), ...extra] : extra);
  printOne(r);
  if (r.crashes || r.broken) process.exitCode = 1;
}
