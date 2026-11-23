// Switch "carthageChronicle" (bet B6): the decade told from Carthage's side. Every sentence must trace to the log,
// the book must read cleanly, and turning the switch on must not change a single die.
import { test } from "node:test";
import assert from "node:assert/strict";
import { runBotGame, carthageBook, logDigest, SWITCHES } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";
import { ruleFor, CARTHAGE_BOOK } from "../src/core/carthage-chronicle.ts";
import { shoreView, shoreWhen } from "../ui/views/shore.ts";

const games = (switches: string[], n = 12, bots = ["simple", "careful", "patron", "tyrant"]) => {
  const out: GameState[] = [];
  for (const bot of bots) for (let seed = 1; seed <= n; seed++) out.push(runBotGame(seed, { bot, tuning: "standard", switches: ["carthageChronicle", ...switches], scenario: "island" }));
  return out;
};
const SOME = games([]);
const WITH_OTHERS = games(["commission", "armiesBreak", "bargainDisgraces", "falseRumors", "convoys"], 8);

test("every line traces to log lines of its own season (or year), told by the rule that wrote it", () => {
  let lines = 0;
  for (const s of [...SOME, ...WITH_OTHERS]) {
    const b = carthageBook(s);
    for (const y of b.years) for (const se of y.seasons) for (const l of se.lines) {
      lines++;
      assert.ok(l.from.length > 0, `a line with no source: ${l.text}`);
      for (const n of l.from) {
        const e = s.log.find((x) => x.n === n);
        assert.ok(e, `log line ${n} is missing`);
        assert.equal(ruleFor(e!)?.rule.id, l.rule, `log line ${n} ("${e!.text}") is not told by ${l.rule}`);
        assert.equal(Math.floor(e!.season / 4), y.index, `${l.rule}: a line from another year`);
        if (CARTHAGE_BOOK.rules.find((r) => r.id === l.rule)!.per !== "year") assert.equal(e!.season, se.season, `${l.rule}: a line from another season`);
        if (!e!.visible) assert.ok(CARTHAGE_BOOK.rules.find((r) => r.id === l.rule)!.hidden, `${l.rule} used a line you never saw: ${e!.text}`);
      }
    }
    for (const n of y0(b)) assert.ok(s.log.some((x) => x.n === n), "a suffete's name from no log line");
    if (b.closing) for (const n of b.closing.from) assert.ok(s.log.some((x) => x.n === n));
  }
  assert.ok(lines > 1000, `only ${lines} lines in ${SOME.length + WITH_OTHERS.length} games`);
});
const y0 = (b: ReturnType<typeof carthageBook>) => b.years.flatMap((y) => y.suffetes.from);

test("the book reads cleanly: no unfilled slot, no code id, no bare log wording about you", () => {
  for (const s of [...SOME, ...WITH_OTHERS]) {
    const b = carthageBook(s);
    const all = [b.closing?.text ?? "", ...b.years.flatMap((y) => [y.heading, y.greekYear, ...y.seasons.flatMap((se) => se.lines.map((l) => l.text))])];
    for (const t of all) {
      assert.ok(!/[{}]|\bundefined\b|\bNaN\b|census:|city:|punic:|\b[a-z]+[A-Z][a-zA-Z]*\b/.test(t), `unclean: ${t}`);
      assert.ok(!/\b(you|your)\b/i.test(t), `Carthage's record speaks of "you": ${t}`);
    }
  }
});

test("a finished game always has a closing, and one still running says so", () => {
  for (const s of SOME) {
    const b = carthageBook(s);
    assert.ok(b.closing || b.stillWriting);
    if (s.over) assert.ok(b.closing, `seed ${s.seed}: ended (${s.over.reason}) with no closing`);
  }
});

test("the switch changes nothing in play: the same log with it on and off", () => {
  for (const bot of ["simple", "careful"]) for (let seed = 1; seed <= 6; seed++) {
    const on = runBotGame(seed, { bot, switches: ["carthageChronicle"], scenario: "island" });
    const off = runBotGame(seed, { bot, switches: [], scenario: "island" });
    assert.equal(logDigest(on), logDigest(off), `${bot} seed ${seed}`);
  }
  assert.ok(SWITCHES.find((w) => w.id === "carthageChronicle")?.workshop, "the switch must stay off the test link");
});

test("the main turns of the war are told when they happen", () => {
  const told = new Set(SOME.flatMap((s) => carthageBook(s).years.flatMap((y) => y.seasons.flatMap((se) => se.lines.map((l) => l.rule)))));
  for (const id of ["trade", "tribute", "goalWarAssembly", "soleCommand", "lands", "levy", "hire", "peace"]) assert.ok(told.has(id), `no game told ${id}`);
});

test("the view renders for every game, with footnotes, and only where the switch is on", () => {
  for (const s of SOME.slice(0, 20)) {
    const html = shoreView(s);
    assert.ok(!/\bundefined\b|\bNaN\b|\[object/.test(html));
    assert.ok(html.includes("Where these lines come from"));
    assert.ok(shoreWhen(s));
  }
  const off = runBotGame(1, { bot: "simple", switches: [], scenario: "island" });
  assert.ok(!shoreWhen(off));
});
