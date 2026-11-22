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

// ---------- Slice 2: cities that change sides, and armies that break ----------
import { goOverMods, surrenderMods, arrive, battle, islandWorld } from "../src/core/island.ts";
import type { Army, GameState } from "../src/core/types.ts";

function withArmy(s: GameState, side: Army["side"], at: string, men: number, extra: Partial<Army> = {}): Army {
  const a: Army = { id: `t${side}`, side, at, men, food: 2, commander: side === "carthage" ? "himilcon" : "dionysius", guard: 0, guardStart: 0, since: -1, moved: -1, siegeSince: -1, onTake: "spare", ...extra };
  s.island!.armies.push(a);
  return a;
}

test("a town near a great army may go over; Carthage's own towns never do, and a near enemy army holds it back", () => {
  const s = startGame(7, undefined, { scenario: "island" });
  withArmy(s, "syracuse", "leontini", 8);
  const m = goOverMods(s, "catana", "syracuse")!;
  assert.ok(m, "Catana is near Leontini, so it should weigh going over");
  assert.ok(m.some((x) => x.label.startsWith("awed by the size")));
  assert.equal(goOverMods(s, "syracuse", "syracuse"), null);
  for (const n of NODES) if (s.island!.cities[n.id].side === "carthage") assert.equal(goOverMods(s, n.id, "syracuse"), null, `${n.id} is Carthage's own`);
  // Carthage pulls only in war.
  withArmy(s, "carthage", "catana", 6);
  assert.equal(goOverMods(s, "leontini", "carthage"), null);
  const before = goOverMods(s, "messana", "syracuse");
  if (before) assert.ok(before.some((x) => x.value === -2), "Carthage's army near should weigh against you");
});

test("a town that fears you may give in without a siege (Leontini after Naxos and Catana)", () => {
  let gave = 0, shut = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const s = startGame(seed, undefined, { scenario: "island" });
    s.island!.sacks = ["catana"];
    const c = s.island!.cities.leontini;
    c.side = "free"; c.fear = 3;
    const a = withArmy(s, "syracuse", "leontini", 8);
    assert.ok(surrenderMods(s, a)[0].label.includes("Catana"));
    arrive(s, a);
    if (s.island!.cities.leontini.side === "syracuse") gave++; else { shut++; assert.equal(a.siege, "leontini"); }
  }
  assert.ok(gave > 0 && shut > 0, `gave ${gave}, shut ${shut}`);
  // With no fear there is no roll.
  const s = startGame(1, undefined, { scenario: "island" });
  s.island!.cities.leontini.side = "free"; s.island!.cities.leontini.fear = 0;
  const a = withArmy(s, "syracuse", "leontini", 8);
  arrive(s, a);
  assert.ok(!s.log.some((e) => e.text.includes("weighs giving in")));
});

test("fear fades by one each summer", () => {
  const s = startGame(1, undefined, { scenario: "island" });
  s.island!.cities.gela.fear = 2;
  while (s.season % 4 !== 3) s.season++;
  islandWorld(s);
  assert.equal(s.island!.cities.gela.fear, 1);
});

test("switch armiesBreak: a starving beaten army scatters; without it, it falls back", () => {
  for (const sw of [true, false]) {
    let broke = 0;
    for (let seed = 1; seed <= 30; seed++) {
      const s = startGame(seed, undefined, { scenario: "island", ...(sw ? { switches: ["armiesBreak"] } : {}) });
      s.island!.war = true;
      const you = withArmy(s, "syracuse", "gela", 12);
      const ca = withArmy(s, "carthage", "gela", 2, { food: 0 });
      battle(s, ca, you);
      if (!s.island!.armies.includes(ca)) broke++;
    }
    if (sw) assert.ok(broke > 15, `with the switch, only ${broke} of 30 broke`);
    else assert.ok(broke < 5, `without the switch, ${broke} of 30 were destroyed`);
  }
});

test("island games with the armiesBreak switch replay and never break state", () => {
  for (const seed of [2, 9, 21]) {
    const a = runBotGame(seed, { scenario: "island", bot: "careful", switches: ["armiesBreak"] });
    const b = replay(seed, a.inputs, a.tuning, { scenario: "island", switches: ["armiesBreak"] });
    assert.equal(JSON.stringify(b.log), JSON.stringify(a.log));
    assert.deepEqual(brokenState(a), []);
  }
});
