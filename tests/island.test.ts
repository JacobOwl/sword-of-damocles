// The island scenario (Phase 2): replays exactly, never breaks state, actually goes to war, shows no code ids,
// and leaves the citadel scenario (Phase 1) untouched.
import { test } from "node:test";
import assert from "node:assert/strict";
import { BOTS, NODES, menu, replay, runBotGame, startGame } from "../src/core/index.ts";
import { brokenState } from "../scripts/sim-check.ts";
import { ui } from "../ui/text.ts";
import { islandView } from "../ui/island.ts";

const ACTIONS = ["muster", "sendArmy", "assault", "forage", "disband", "embassyCity", "declareWar", "acceptPeace"];

test("a citadel game has no island and no island actions; an island game has no raid or march", () => {
  const c = startGame(1);
  assert.equal(c.island, undefined);
  assert.equal(c.scenario, undefined);
  const cm = menu(c).map((m) => m.id);
  for (const a of ACTIONS) assert.ok(!cm.includes(a), `${a} in the citadel menu`);
  const i = startGame(1, undefined, { scenario: "island" });
  assert.ok(i.island);
  const im = menu(i).map((m) => m.id);
  for (const a of ACTIONS) assert.ok(im.includes(a), `${a} missing from the island menu`);
  assert.ok(!im.includes("raid") && !im.includes("march"));
  assert.equal(Object.keys(i.island!.cities).length, NODES.length);
});

test("island games replay exactly from seed and inputs", () => {
  for (const bot of ["careful", "patron", "tyrant"]) for (const seed of [3, 5, 11]) { // the simple bot shares the game's dice, so only the others replay
    const a = runBotGame(seed, { scenario: "island", bot });
    const b = replay(seed, a.inputs, a.tuning, { scenario: "island" });
    assert.equal(JSON.stringify(b.log), JSON.stringify(a.log), `${bot} seed ${seed} log differs`);
    assert.deepEqual(b.island, a.island);
  }
});

test("every bot, 30 island games each: no crash, no broken state", () => {
  for (const bot of ["simple", ...BOTS.map((b) => b.id)]) for (let seed = 1; seed <= 30; seed++) {
    const s = runBotGame(seed, { scenario: "island", bot });
    assert.ok(s.over, `${bot} seed ${seed} did not end`);
    assert.deepEqual(brokenState(s), [], `${bot} seed ${seed}`);
  }
});

test("the island goes to war: battles, sieges and cities changing hands happen", () => {
  const sum: Record<string, number> = {};
  for (let seed = 1; seed <= 60; seed++) for (const [k, v] of Object.entries(runBotGame(seed, { scenario: "island", bot: "careful" }).counters)) sum[k] = (sum[k] ?? 0) + v;
  assert.ok((sum.wars ?? 0) > 0, "no war");
  assert.ok((sum.battles ?? 0) > 0, "no battle");
  assert.ok((sum.islandSieges ?? 0) > 0, "no siege");
  assert.ok((sum.citiesTaken ?? 0) + (sum.citiesLost ?? 0) > 0, "no city changed hands");
  assert.ok((sum.landings ?? 0) > 0, "Carthage never landed");
});

test("no code ids or broken values in the island log or the island view", () => {
  const ids = ["tributary", "syracuse", "carthageAct", "islandSieges", "hundred", "elders", "libyans", "himilcon", "magon", "panormus", "motya"];
  for (let seed = 1; seed <= 15; seed++) {
    const s = runBotGame(seed, { scenario: "island", bot: "careful" });
    for (const e of s.log.filter((e) => e.visible)) {
      const t = `${e.text} ${e.why ?? ""}`;
      assert.ok(!/\bundefined\b|\bNaN\b|\[object/.test(t), `seed ${seed}: ${t}`);
      for (const id of ids) assert.ok(!new RegExp(`\\b${id}\\b`).test(t), `seed ${seed}: id ${id} in "${t}"`);
    }
    ui.s = s;
    const html = islandView(s).replace(/<[^>]*>/g, " ");
    assert.ok(!/\bundefined\b|\bNaN\b|\[object/.test(html), `seed ${seed}: island view broken`);
    for (const id of ids) assert.ok(!new RegExp(`\\b${id}\\b`).test(html), `seed ${seed}: id ${id} in the island view`);
  }
});
