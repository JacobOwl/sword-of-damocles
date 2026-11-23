// Switch "dinners": counts over many bot games, with the switch on and off, and sample dinners read from the log.
//   node scripts/dinner-sweep.ts --seeds 100 [--scenario island] [--bot careful] [--samples 3] [--markdown]
// Safe to rerun: the output depends only on the seeds and the code.
import { runBotGame, seasonName, dinnerLog } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";

const argv = process.argv;
const arg = (k: string, d: string) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
const N = Number(arg("--seeds", "100"));
const SCEN = arg("--scenario", "citadel") as "citadel" | "island";
const BOT = arg("--bot", "simple");
const SAMPLES = Number(arg("--samples", "0"));
const KEYS = ["dinners", "dinnerMoments", "dinnerBonds", "dinnerQuarrels", "dinnerMends", "dinnerSlips", "dinnerTongues", "dinnerAsks", "couchChanges", "couchSlights"];
const LABEL: Record<string, string> = {
  dinners: "dinners given", dinnerMoments: "moments", dinnerBonds: "friendships", dinnerQuarrels: "quarrels", dinnerMends: "quarrels mended",
  dinnerSlips: "secrets let slip", dinnerTongues: "your own tongue", dinnerAsks: "choices put to you", couchChanges: "couch changed hands", couchSlights: "men slighted over the couch",
};

function play(switches: string[]) {
  const sum: Record<string, number> = {};
  let crashes = 0, broken = 0, seasons = 0, friendRecruits = 0, plots = 0, blows = 0;
  const ends: Record<string, number> = {};
  const games: GameState[] = [];
  for (let seed = 1; seed <= N; seed++) {
    let s: GameState;
    try { s = runBotGame(seed, { bot: BOT, switches, scenario: SCEN }); } catch (e) { crashes++; console.log(`seed ${seed}: CRASH ${(e as Error).stack}`); continue; }
    if (!s.over || Number.isNaN(s.silver) || s.season < 0) broken++;
    for (const k of KEYS) sum[k] = (sum[k] ?? 0) + (s.counters[k] ?? 0);
    seasons += s.season;
    plots += s.counters.plots ?? 0;
    blows += s.counters.blowsLanded ?? 0;
    friendRecruits += s.log.filter((e) => e.roll?.mods.some((m) => m.label === "friends from your table")).length;
    const r = s.over?.reason ?? "running";
    ends[r] = (ends[r] ?? 0) + 1;
    if (games.length < 40) games.push(s);
  }
  return { sum, crashes, broken, seasons: seasons / N, friendRecruits, plots: plots / N, ends, games };
}

const on = play(["dinners"]);
const off = play([]);
const md = argv.includes("--markdown");
const per = (n: number) => (n / N).toFixed(2);
console.log(`${N} seeds, ${SCEN} scenario, the ${BOT} bot.`);
console.log(`Crashes: on ${on.crashes}, off ${off.crashes}. Broken states: on ${on.broken}, off ${off.broken}.`);
console.log(`Average length: on ${on.seasons.toFixed(1)} seasons, off ${off.seasons.toFixed(1)}. Plots a game: on ${on.plots.toFixed(2)}, off ${off.plots.toFixed(2)}.`);
console.log(`Endings on: ${JSON.stringify(on.ends)}. Off: ${JSON.stringify(off.ends)}.`);
if (md) { console.log("\n| With dinners on | total | a game |\n|---|---|---|"); for (const k of KEYS) console.log(`| ${LABEL[k]} | ${on.sum[k] ?? 0} | ${per(on.sum[k] ?? 0)} |`); console.log(`| recruit rolls helped by a friendship | ${on.friendRecruits} | ${per(on.friendRecruits)} |`); }
else { for (const k of KEYS) console.log(`  ${LABEL[k]}: ${on.sum[k] ?? 0} (${per(on.sum[k] ?? 0)} a game)`); console.log(`  recruit rolls helped by a friendship: ${on.friendRecruits}`); }

// Sample dinners: the busiest ones from the first games, as the log tells them.
if (SAMPLES) {
  const found: { seed: number; season: number; lines: string[]; n: number }[] = [];
  for (const s of on.games) {
    for (const d of s.dinners?.held ?? []) {
      const lines = dinnerLog(s, d).filter((e) => e.kind !== "roll" && e.visible).map((e) => `${e.text}${e.why ? ` (${e.why})` : ""}`);
      found.push({ seed: s.seed, season: d.season, lines, n: d.moments.length });
    }
  }
  found.sort((a, b) => b.n - a.n || a.seed - b.seed || a.season - b.season);
  const seen = new Set<number>();
  let shown = 0;
  for (const f of found) {
    if (seen.has(f.seed) || shown >= SAMPLES) continue;
    seen.add(f.seed); shown++;
    console.log(`\n### Seed ${f.seed}, ${seasonName(f.season)}\n`);
    for (const l of f.lines) console.log(`- ${l}`);
  }
}
