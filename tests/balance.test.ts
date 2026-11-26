// Balance packages and the headless players.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { startGame, act, endSeason, replay, runBotGame, PACKAGES, BOTS, DEFAULT_TUNING, knobsFor } from "../src/core/index.ts";
import { brokenState } from "../scripts/sim-check.ts";

test("standard is the default, and an unknown package is refused", () => {
  assert.equal(DEFAULT_TUNING, "standard");
  assert.equal(startGame(1).tuning, "standard");
  assert.throws(() => startGame(1, "noSuchPackage"));
});

test("the standard package plays exactly as rules v2 did before packages existed", () => {
  // Digest of seeds 1 to 20 with the simple bot, taken before the numbers moved into data/tuning.json.
  const h = createHash("sha256");
  for (let seed = 1; seed <= 20; seed++) {
    const s = runBotGame(seed);
    h.update(JSON.stringify(s.log.map((e) => e.text)) + JSON.stringify(s.over && { reason: s.over.reason, text: s.over.text, season: s.over.season }));
  }
  assert.equal(h.digest("hex").slice(0, 16), STANDARD_DIGEST);
});
// Re-pinned 2026-11-22 when events joined the season (thread 06). With the event draw switched off,
// the old digest "6f4d7392e5e4631f" still matched, so events were the only change.
// Re-pinned again 2026-11-22 (thread 09) for two text fixes only: "is in a plot against you, and leads it
// himself" instead of "led by" his own name, and the Take his place ending no longer lists all four ways to lose.
// With those two lines put back, "825ddae722aa16c6" still matched, so the rule switches change nothing while off.
// Re-pinned 2026-11-22 (thread 07) for one added event, "A sword on a horse-hair" (the Damocles banquet).
// With that event taken out of data/events.json, "91a0386516ddf2e8" still matched.
// Re-pinned 2026-11-22 (thread 07) for five more Cicero court stories (Tusculan Disputations 5.58 to 5.63).
// With those six records taken out of data/events.json, "5f0f33e5b9691537" still matched.
// Re-pinned 2026-11-23 (thread 19): the people step drew dice inside a sort comparator, so the number of draws
// depended on the JavaScript engine (a game copied from the browser replayed differently in Node). Scores are now
// drawn once per person before sorting. Rules unchanged; the dice fall in a different order.
const STANDARD_DIGEST = "d53441bd9c33ab85"; // 2026-11-26, thread 35: bug fix, "The cavalry come home" is given up once the exiles' leader is held or dead (and, on the island, Aetna has fallen); it used to complete anyway. Before that "5c34f854e2f89991", 2026-11-25, thread 31 (part 3): one added line only ("X can think no worse of you", once a year per faction at the floor; 60-game log diff: 226 added lines, nothing else changed). Part 2 "8a235434c7a7309b": only wording (varied sentences after repeated lines, chosen by hash, no dice; 60-game log diff: same lines in the same order). Part 1, "153e5331210365ac": only wording (council bug fixes: he/she, "22nd", no leader named twice, "you chose not to", lower case after "Again,"); a log diff of 60 games shows the same lines in the same order. Before that "47fe46af89063851" (thread 28, "her house").

test("every package only names knobs that exist", () => {
  const known = Object.keys(knobsFor("standard"));
  for (const p of PACKAGES) for (const k of Object.keys(p.knobs)) assert.ok(known.includes(k), `${p.id}: unknown knob ${k}`);
});

test("a game under any package replays exactly from its seed, package and inputs", () => {
  for (const p of PACKAGES) {
    const s = startGame(42, p.id);
    act(s, "watch", { target: "philistus" });
    act(s, "grainHandout", {});
    endSeason(s);
    act(s, "feast", { target: "hipparinus" });
    endSeason(s);
    assert.equal(JSON.stringify(replay(42, s.inputs, p.id)), JSON.stringify(s), p.id);
  }
});

test("every bot under every package: 40 games, no crash, no broken state", () => {
  for (const p of PACKAGES) for (const b of ["simple", ...BOTS.map((x) => x.id)]) for (let seed = 1; seed <= 40; seed++) {
    const s = runBotGame(seed, { bot: b, tuning: p.id });
    assert.ok(s.over, `${p.id}/${b}/${seed} did not finish`);
    assert.deepEqual(brokenState(s), [], `${p.id}/${b}/${seed}`);
  }
});

test("the new bots are replayable: their moves are ordinary inputs", () => {
  const s = runBotGame(9, { bot: "careful", tuning: "slowFuse" });
  const r = replay(9, s.inputs, "slowFuse");
  assert.deepEqual(r.log.map((e) => e.text), s.log.map((e) => e.text));
});
