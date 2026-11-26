// Ready-made setups (data/presets.json), the season-10 verdict and "Copy my game".
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { PRESETS, presetById, presetOpts, PACKAGES, switchById, startGame, replay, runBotGame, endSeason, logDigest, DEFAULT_TUNING } from "../src/core/index.ts";
import { ui } from "../ui/lib/text.ts";
import { verdictDue, verdictView } from "../ui/views/verdict.ts";
import { startScreen, presetRules } from "../ui/views/start.ts";
import { brokenState } from "../scripts/sim-check.ts";

const text = (html: string) => html.replace(/<[^>]*>/g, " ");

test("every preset names a balance, a game and switches that exist, and adds no rules", () => {
  assert.ok(PRESETS.length >= 1);
  for (const p of PRESETS) {
    assert.equal((p as any).kind, "invention");
    assert.ok(PACKAGES.some((k) => k.id === p.tuning), `${p.id}: unknown balance ${p.tuning}`);
    for (const w of p.switches) assert.ok(switchById(w), `${p.id}: unknown switch ${w}`);
    assert.ok(["island", "citadel"].includes(p.scenario));
    assert.ok(p.verdictSeason > 0 && p.watch.length > 0);
  }
  assert.equal(DEFAULT_TUNING, "standard", "Standard stays the engine default");
});

test("the first island test keeps the council's setup, so its saves replay", () => {
  const p = presetById("firstIslandTest")!;
  assert.equal(p.scenario, "island");
  assert.equal(p.tuning, "reapWhatYouSow");
  assert.deepEqual([...p.switches].sort(), ["armiesBreak", "clues", "partialBlows", "storyChronicle"]);
  assert.equal(p.verdictSeason, 10);
  assert.equal(presetRules(p), "Reap what you sow balance; Warnings are clues, Blows can miss, Chronicle as story, Beaten armies can break.");
  assert.match(startScreen(null, 7), /value="firstIslandTest"/, "still offered");
});

test("the second island test is listed first and recommended, with the rules Jacob made core (2026-11-26) and the contested board", () => {
  const p = presetById("secondIslandTest")!;
  assert.equal(p.scenario, "island");
  assert.equal(p.tuning, "reapWhatYouSow");
  assert.deepEqual([...p.switches].sort(), ["armiesBreak", "bargainDisgraces", "clues", "coalition", "commission", "contestedBoard", "escalation", "exile", "feud", "partialBlows", "purseDry", "quarrels", "secrets", "storyChronicle"]);
  assert.ok(!p.switches.includes("variedOpening"), "Jacob kept the first year as it is");
  assert.equal(p.verdictSeason, 30);
  assert.deepEqual(p.checkIns, [10, 20]);
  for (const id of p.switches) assert.ok(switchById(id), id);
  const html = startScreen(null, 7);
  const first = html.indexOf('name="setup"');
  assert.ok(html.indexOf('value="secondIslandTest"', first) - first < 40, "the preset is the first choice");
  assert.match(html, /value="secondIslandTest" checked/);
  assert.match(text(html), /recommended/);
  assert.match(text(html), /Rules on: Reap what you sow balance; Warnings are clues/);
  assert.ok(!/Lead the army yourself\.<\/b>/.test(html.slice(first, html.indexOf('value="firstIslandTest"'))), "a rule inside the preset is not offered again beside it");
});

test("a preset game is the same game as its options, and replays exactly", () => {
  const o = presetOpts("firstIslandTest");
  const a = runBotGame(5, { bot: "careful", ...o });
  const b = runBotGame(5, { bot: "careful", tuning: o.tuning, scenario: o.scenario, switches: o.switches });
  assert.equal(a.preset, "firstIslandTest");
  assert.equal(b.preset, undefined);
  assert.equal(logDigest(a), logDigest(b), "the preset name changes nothing in play");
  const r = replay(5, a.inputs, o.tuning, o);
  assert.equal(logDigest(r), logDigest(a));
  assert.deepEqual(brokenState(a), []);
});

// Pinned so nothing changes the test build under Jacob without a logged decision (freeze: 2026-11-24).
// Re-pin only with a line in docs/decisions.md saying what changed.
const PRESET_DIGEST = "515cdfe37a928f0b"; // 2026-11-25, thread 31 (part 3): one added line only, the floor line. Part 2 "8d9ccb179fc0ce4a": only wording, varied sentences after repeated lines. Part 1 "489e7bfc4ee22b8a": only wording (council bug fixes, same 60-game log diff); the frozen test link (code of main 26744da) keeps "a13b4b4e66093c27". Before that thread 28: "her house"; thread 19: dice no longer drawn inside a sort
test("the first island test plays exactly as pinned (careful bot, seeds 1 to 10)", () => {
  const h = createHash("sha256");
  for (let seed = 1; seed <= 10; seed++) h.update(logDigest(runBotGame(seed, { bot: "careful", ...presetOpts("firstIslandTest") })));
  assert.equal(h.digest("hex").slice(0, 16), PRESET_DIGEST);
});

test("the verdict is asked at season 10 of a preset game, once, and never in other games", () => {
  const o = presetOpts("firstIslandTest");
  // The careful bot's moves, cut after nine and after ten seasons.
  const full = runBotGame(3, { bot: "careful", ...o });
  const upTo = (n: number) => { let k = 0; return full.inputs.slice(0, full.inputs.findIndex((i) => i.t === "end" && ++k === n) + 1); };
  ui.verdict = null;
  const g9 = replay(3, upTo(9), o.tuning, o);
  assert.equal(g9.over, undefined);
  ui.s = g9;
  assert.equal(verdictDue(g9), false, "not before season 10");
  const g = replay(3, upTo(10), o.tuning, o);
  ui.s = g;
  assert.equal(g.over, undefined);
  assert.equal(verdictDue(g), true, "asked once ten seasons are done");
  const html = verdictView(g);
  for (const q of ["What would you retell?", "What confused you?", "What felt unfair?", "too easy", "about right", "too hard"]) assert.ok(text(html).includes(q), q);
  assert.ok(!/\bundefined\b|\bNaN\b|firstIslandTest/.test(text(html)));
  ui.verdict = { season: 10, retell: "", confused: "", unfair: "", level: "right", other: "" };
  assert.equal(verdictDue(g), false, "answered once, not asked again");
  ui.verdict = null;
  const plain = startGame(3, "standard", { scenario: "island" });
  for (let i = 0; i < 10; i++) endSeason(plain);
  assert.equal(verdictDue(plain), false, "no verdict outside a preset");
  // A reign that ends before season 10 is asked on its last page.
  const short = startGame(3, o.tuning, o);
  for (let i = 0; i < 10; i++) endSeason(short);
  assert.ok(short.over && short.over.season < 10);
  assert.equal(verdictDue(short), true);
});
