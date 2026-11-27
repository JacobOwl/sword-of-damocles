// Switch "warFocus" batch: games with the second island test's rules plus the war focus, counted (never tuned).
//   npm run war-runs -- --seeds 100 [--bot careful] [--preset nearWarTest]
import { runBotGame } from "../src/core/season.ts";
import { presetOpts } from "../src/core/presets.ts";
const argv = process.argv;
const num = (k: string, d: number) => { const i = argv.indexOf(k); return i > 0 ? Number(argv[i + 1]) : d; };
const str = (k: string, d: string) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
const N = num("--seeds", 100), bot = str("--bot", "careful"), preset = str("--preset", "secondIslandTest");
const base = presetOpts(preset);
const switches = [...new Set([...base.switches!, ...(argv.includes("--off") ? [] : ["warFocus"])])];
const t: Record<string, number> = {};
const add = (k: string, v = 1) => { t[k] = (t[k] ?? 0) + v; };
let crashes = 0;
const sample: string[] = [];
for (let seed = 1; seed <= N; seed++) {
  try {
    const s = runBotGame(seed, { bot, tuning: base.tuning, scenario: base.scenario, switches, preset: base.preset });
    add("seasons", s.over ? s.over.season + 1 : s.season);
    add(`end_${s.over?.reason ?? "unfinished"}`);
    add("wars", s.counters.wars ?? 0); add("peaces", s.counters.peaces ?? 0); add("landings", s.counters.landings ?? 0);
    add("battles", s.counters.battles ?? 0); add("citiesLost", s.counters.citiesLost ?? 0); add("citiesTaken", s.counters.citiesTaken ?? 0);
    add("raids", s.counters.carthageAct_raid ?? 0); add("courts", s.counters.carthageAct_court ?? 0); add("peaceOffers", s.counters.peaceOffers ?? 0);
    const pw = s.island?.pastWars ?? [];
    add("warsEnded", pw.length);
    add("warSeasons", pw.reduce((x, w) => x + (w.ended - w.since), 0));
    if (s.island?.war) add("stillAtWar");
    if (s.flags.pendulum !== undefined || s.log.some((e) => /blocs close ranks/.test(e.text))) add("pendulumGames");
    add("matters", s.log.filter((e) => /What the war is for|The army wants battle|A victor's welcome|Envoys with terms|A truce of a few days/.test(e.text)).length);
    add("termsPeace", s.log.filter((e) => /^Peace is made/.test(e.text) && !/Each keeps what it holds\.$/.test(e.text)).length);
    // Switch "townBoards": the houses at work.
    const L = (re: RegExp) => s.log.filter((e) => re.test(e.text)).length;
    add("houseShifts", L(/^In .+, the house of .+ (now leans|now stands)/)); add("purges", L(/drive out your friends/));
    add("tributeWithheld", L(/sends you no tribute this year/)); add("gatesOffered", L(/slips out of .+ by night/)); add("gatesTaken", s.log.filter((e) => /Pay his price/.test(e.why ?? "") || /Pay his price/.test(e.text)).length);
    if (s.island && (s.island as any).townBoards) add("dividedAtEnd", Object.keys((s.island as any).townBoards).filter((id) => new Set(((s.island as any).townBoards[id] as any[]).map((x) => x.lean)).size === 3).length);
    add("ravages", L(/ravages the land of/)); add("reinforcements", L(/^Fresh men from/)); add("allyDrift", L(/allies drift home after/)); add("hunger", s.counters.hungerSeasons ?? 0);
    if (pw.length && sample.length < 3) sample.push(`seed ${seed}: ${pw[0].name}: ${pw[0].chapter}`);
  } catch (e) { crashes++; if (crashes < 4) console.error(`seed ${seed}:`, (e as Error).stack?.split("\n").slice(0, 4).join("\n")); }
}
console.log(`${N} games, bot ${bot}, preset ${preset}, warFocus ${argv.includes("--off") ? "off" : "on"}. Crashes: ${crashes}.`);
for (const [k, v] of Object.entries(t).sort()) console.log(`  ${k}: ${v} (${(v / N).toFixed(2)} a game)`);
console.log(`Average war length (ended wars): ${t.warsEnded ? (t.warSeasons / t.warsEnded).toFixed(1) : "-"} seasons.`);
for (const x of sample) console.log(`\n${x}`);
