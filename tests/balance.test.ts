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
const STANDARD_DIGEST = "825ddae722aa16c6";

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
