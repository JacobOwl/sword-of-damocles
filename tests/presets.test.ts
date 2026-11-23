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

test("the first island test is the council's setup, listed first and recommended", () => {
  const p = presetById("firstIslandTest")!;
  assert.equal(p.scenario, "island");
  assert.equal(p.tuning, "reapWhatYouSow");
  assert.deepEqual([...p.switches].sort(), ["armiesBreak", "clues", "partialBlows", "storyChronicle"]);
  assert.equal(p.verdictSeason, 10);
  const html = startScreen(null, 7);
  const first = html.indexOf('name="setup"');
  assert.ok(html.indexOf('value="firstIslandTest"', first) - first < 40, "the preset is the first choice");
  assert.match(html, /value="firstIslandTest" checked/);
  assert.match(text(html), /recommended/);
  assert.match(text(html), /Rules on: Reap what you sow balance; Warnings are clues, Blows can miss, Chronicle as story, Beaten armies can break\./);
  assert.equal(presetRules(p), "Reap what you sow balance; Warnings are clues, Blows can miss, Chronicle as story, Beaten armies can break.");
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
const PRESET_DIGEST = "fda5fb102c1a022a"; // 2026-11-23, thread 19: dice no longer drawn inside a sort (browser and Node replay alike); story chronicle repeat fixes
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
