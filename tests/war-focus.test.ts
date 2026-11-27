// The war and geopolitics focus (thread 41): the Near-war opening, town boards and army supply.
import { test } from "node:test";
import assert from "node:assert/strict";
import { startGame, endSeason, replay, runBotGame } from "../src/core/index.ts";
import { presetOpts } from "../src/core/presets.ts";
import { city, muster, yourArmy } from "../src/core/island.ts";
import { seatsOf, divided, sendsSupport, seatFriend } from "../src/core/towns.ts";
import { feedFromArea, grainNeed, ravage, ravageCheck, reinforce, reinforceCheck } from "../src/core/supply.ts";
import { brokenState } from "../scripts/sim-check.ts";

const near = () => { const o = presetOpts("nearWarTest"); return startGame(11, o.tuning, o); };

test("the Near-war test opens in spring 398 BC with the island already changed", () => {
  const s = near();
  assert.equal(s.season, 26);
  assert.equal(s.startSeason, 26);
  assert.ok(s.citadelBuilt);
  for (const id of ["catana", "leontini", "aetna"]) assert.equal(city(s, id).side, "syracuse");
  assert.equal(city(s, "messana").side, "ally");
  assert.ok(s.log.some((e) => /^Spring 398 BC\./.test(e.text)));
});

test("the Near-war test replays exactly and runs to the end without a broken state", () => {
  const o = presetOpts("nearWarTest");
  const s = runBotGame(5, { bot: "careful", tuning: o.tuning, scenario: o.scenario, switches: o.switches, preset: o.preset });
  assert.deepEqual(brokenState(s), []);
  const r = replay(5, s.inputs, o.tuning, o);
  assert.equal(JSON.stringify(r.log.map((e) => e.text)), JSON.stringify(s.log.slice(0, r.log.length).map((e) => e.text)));
});

test("town boards: three houses a town, a divided town sends nothing, a taken town gets the winner's friend", () => {
  const s = near();
  const x = seatsOf(s, "messana");
  assert.equal(x.length, 3);
  assert.equal(x[0].lean, "you");
  x[0].lean = "you"; x[1].lean = "carthage"; x[2].lean = "town";
  assert.ok(divided(s, "messana"));
  assert.equal(sendsSupport(s, "messana").ok, false);
  seatFriend(s, "messana", "carthage", "a test");
  assert.equal(seatsOf(s, "messana")[0].lean, "carthage");
  assert.ok(!seatsOf(s, "messana").some((y) => y.lean === "you"), "your friends are driven out of a town taken by Carthage");
});

test("army supply: a big army needs more grain, ravage burns a harvest, reinforce adds men", () => {
  const s = near();
  muster(s, true);
  const a = yourArmy(s)!;
  assert.ok(grainNeed(a) >= 1);
  a.food = 0;
  const before = city(s, "syracuse").grain;
  assert.ok(feedFromArea(s, a, 2));
  assert.equal(a.food, 2);
  assert.ok(city(s, "syracuse").grain < before || a.fedFrom!.length > 0);
  assert.equal(ravageCheck(s, a), "your army is in friendly country");
  a.at = "gela";
  assert.equal(ravageCheck(s, a), null);
  ravage(s, a);
  assert.ok((city(s, "gela").ravagedUntil ?? -1) > s.season);
  a.at = "leontini";
  s.silver = 5;
  assert.equal(reinforceCheck(s, a), null);
  const men = a.men;
  reinforce(s, a);
  assert.equal(a.men, men + 1);
});

test("with the switches off, the second island test is untouched by the new state", () => {
  const o = presetOpts("secondIslandTest");
  const s = startGame(3, o.tuning, o);
  for (let i = 0; i < 4; i++) endSeason(s);
  assert.equal((s.island as any).townBoards, undefined);
  assert.equal((s.island as any).warCard, undefined);
});

test("battle plate: the plan is a free order and shows on your side of the battle", async () => {
  const { act } = await import("../src/core/index.ts");
  const { battleMods } = await import("../src/core/island.ts");
  const s = near();
  muster(s, false);
  const slots = s.slots;
  act(s, "battlePlan", { target: "combined", second: "reserve" });
  assert.equal(s.slots, slots, "setting the plan uses no action");
  const a = yourArmy(s)!;
  assert.equal(a.plan, "combined");
  assert.equal(a.reserve, true);
  const labels = battleMods(s, a).map((m) => m.label);
  assert.ok(labels.some((l) => /combined attack/.test(l)));
  assert.ok(labels.some((l) => /reserve/.test(l)));
});
