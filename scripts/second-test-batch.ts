// The batch after the second test's fixes (thread 39): the Second island test preset (30 seasons) with and without
// the council's six new rules, for each bot. Counts only; nothing is tuned.   node scripts/second-test-batch.ts [seeds]
import { startGame, endSeason, presetOpts, carthageArmy } from "../src/core/index.ts";
import { botAnswer } from "../src/core/events.ts";
import { botById, botRandom, playSeason } from "../src/core/bots.ts";
import { brokenState } from "./sim-check.ts";

const N = Number(process.argv[2] ?? 100);
const NEW = ["guardBattleOnly", "devotedHoldsBack", "carthageHolds", "libyaSpared", "mintHabit", "petitionOffers"];
const o = presetOpts("secondIslandTest");
const rows: string[] = [
  "| bot | rules | crashes | broken | ruling at 30 | killed | deposed | tyrannies | landings | Libyan revolts | war seasons | longest war lull | guard at end | strikes of coin |",
  "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|",
];
for (const bot of ["careful", "patron", "tyrant", "careless"]) {
  for (const withNew of [false, true]) {
    const switches = withNew ? o.switches : o.switches!.filter((x) => !NEW.includes(x));
    const c = { crash: 0, broken: 0, ruling: 0, killed: 0, deposed: 0, tyr: 0, land: 0, rev: 0, war: 0, lull: 0, guard: 0, coin: 0 };
    for (let seed = 1; seed <= N; seed++) {
      try {
        const s = startGame(seed, o.tuning, { ...o, switches });
        const b = botById(bot)!, r = botRandom(seed);
        let lull = 0, worst = 0;
        for (let n = 0; n < 30 && !s.over; n++) {
          botAnswer(s); playSeason(s, b, r); endSeason(s);
          if (s.island?.war) { c.war++; lull = carthageArmy(s) ? 0 : lull + 1; worst = Math.max(worst, lull); } else lull = 0;
        }
        if (brokenState(s).length) c.broken++;
        if (!s.over) c.ruling++; else if (s.over.reason === "killed") c.killed++; else if (s.over.reason === "deposed") c.deposed++;
        c.tyr += s.counters.tyrannies ?? 0; c.land += s.counters.landings ?? 0; c.rev += s.counters.libyanRevolts ?? 0;
        c.lull += worst; c.guard += s.guard.strength;
        c.coin += s.log.filter((e) => e.kind === "event" && e.why === "Strike coin").length;
      } catch (e) { c.crash++; console.error(bot, seed, (e as Error).stack); }
    }
    const f = (x: number) => (x / N).toFixed(2);
    rows.push(`| ${bot} | ${withNew ? "with the six" : "without"} | ${c.crash} | ${c.broken} | ${c.ruling}% | ${c.killed} | ${c.deposed} | ${f(c.tyr)} | ${f(c.land)} | ${f(c.rev)} | ${f(c.war)} | ${f(c.lull)} | ${f(c.guard)} | ${f(c.coin)} |`);
  }
}
console.log(rows.join("\n"));
