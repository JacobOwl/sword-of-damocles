import { test } from "node:test";
import assert from "node:assert/strict";
import { startGame, act, endSeason, replay, runBotGame, menu, preview, DATA, others } from "../src/core/index.ts";
import { brokenState } from "../scripts/sim-check.ts";

test("the same seed gives the same history", () => {
  const a = runBotGame(7), b = runBotGame(7);
  assert.deepEqual(a.log.map((e) => e.text), b.log.map((e) => e.text));
  assert.notDeepEqual(runBotGame(8).log.map((e) => e.text), a.log.map((e) => e.text));
});

test("a game replays exactly from its seed and inputs", () => {
  const s = startGame(42);
  act(s, "watch", { target: "philistus" });
  act(s, "grainHandout", {});
  endSeason(s);
  act(s, "feast", { target: "hipparinus" });
  endSeason(s);
  const r = replay(42, s.inputs);
  assert.equal(JSON.stringify(r), JSON.stringify(s));
});

test("a season runs its steps in order and spends three actions", () => {
  const s = startGame(1);
  assert.equal(s.step, "player");
  assert.equal(s.slots, 3);
  const order = s.log.map((e) => e.step).filter((v, i, a) => a.indexOf(v) === i);
  assert.deepEqual(order, (["world", "people", "factions"] as string[]).filter((x) => (order as string[]).includes(x)));
  for (let i = 0; i < 3; i++) act(s, "envoy", {});
  assert.equal(s.slots, 0);
  assert.equal(preview(s, "envoy", {}).ok, false);
  endSeason(s);
  assert.equal(s.season, 1);
});

test("odds are shown before rolling, with every modifier", () => {
  const s = startGame(3);
  const p = preview(s, "imprison", { target: "philistus" });
  assert.equal(p.ok, true);
  assert.equal(p.auto, false);
  assert.ok(p.mods.some((m) => m.label.includes("Shrewd")));
  assert.equal(preview(s, "grainHandout", {}).auto, true);
});

test("every logged change has a reason", () => {
  const s = runBotGame(5);
  for (const e of s.log) if (e.kind === "change") assert.ok(e.why, `no reason for: ${e.text}`);
});

test("players never see code-style ids", () => {
  const s = runBotGame(11);
  const ids = Object.keys(s.people).filter((id) => /[A-Z]/.test(id));
  for (const e of s.log.filter((e) => e.visible)) for (const id of ids) assert.ok(!e.text.includes(id), `id ${id} in: ${e.text}`);
  for (const m of menu(startGame(1))) for (const t of m.targets ?? []) assert.ok(!/^[a-z]+[A-Z]/.test(t.label), t.label);
});

test("100 headless games: no crash, no broken state", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const s = runBotGame(seed);
    assert.deepEqual(brokenState(s), [], `seed ${seed}`);
  }
});

test("the menu covers the rules v2 actions", () => {
  assert.ok(DATA.actions.length >= 27 + 4);
  assert.ok(others(startGame(1)).length >= 12);
});
