// Purge recut (council 2026-11-25): does executing more keep the iron hand alive, once reign length is held fixed?
// Plays the AAR batch's full-scope iron-hand games (same seeds, switches and balance as scripts/aar-runs.ts),
// keeps only reigns still running at the start of season LANDMARK, groups them by executions so far, and counts
// who survives the decade from there. Changes no rules. Same options give the same output.
//   npx tsx scripts/purge-recut.ts [--seeds 144] [--landmark 12] [--bot tyrant]
import { startGame, endSeason, SWITCHES } from "../src/core/index.ts";
import { botById, botRandom, playSeason } from "../src/core/bots.ts";
import { botAnswer } from "../src/core/events.ts";
import { dionysiusBot } from "../src/core/dionysius-bot.ts";

const argv = process.argv;
const opt = (k: string, d: string) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
const N = Number(opt("--seeds", "144")), L = Number(opt("--landmark", "12")), BOT = opt("--bot", "tyrant");
const FULL = SWITCHES.filter((x) => x.id !== "exileStart").map((x) => x.id);
const bot = BOT === "dionysius" ? dionysiusBot : botById(BOT)!;
const bands = (n: number) => (n < 2 ? "0-1" : n < 4 ? "2-3" : n < 8 ? "4-7" : "8+");
const atL: Record<string, [number, number]> = {}, end: Record<string, [number, number]> = {};
let reached = 0;
for (let seed = 1; seed <= N; seed++) {
  const s = startGame(seed, (seed - 1) % 20 < 10 ? "standard" : "reapWhatYouSow", { switches: FULL, scenario: "island" });
  const r = botRandom(seed);
  let n = 0, exAtL = -1;
  while (!s.over && n++ < 200) {
    if (s.season === L && exAtL < 0) exAtL = s.counters.executions ?? 0;
    botAnswer(s); playSeason(s, bot, r); endSeason(s);
  }
  const ok = !s.over || s.over.reason === "survived" ? 1 : 0;
  const b2 = bands(s.counters.executions ?? 0);
  end[b2] = [(end[b2]?.[0] ?? 0) + ok, (end[b2]?.[1] ?? 0) + 1];
  if (exAtL >= 0) { reached++; const b = bands(exAtL); atL[b] = [(atL[b]?.[0] ?? 0) + ok, (atL[b]?.[1] ?? 0) + 1]; }
}
const show = (t: Record<string, [number, number]>) => ["0-1", "2-3", "4-7", "8+"].map((b) => t[b] ? `${b}: ${t[b][0]}/${t[b][1]} survive (${Math.round((100 * t[b][0]) / t[b][1])}%)` : `${b}: none`).join("; ");
console.log(`${BOT}, ${N} full-scope games.`);
console.log(`By executions over the whole reign (as in the report): ${show(end)}`);
console.log(`Alive at season ${L} (${reached} games), by executions before it: ${show(atL)}`);
