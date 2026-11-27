// Test 5, the deeper war: battle scenes, Carthage comes back, and the small navy (switches battleScenes,
// carthageReturns, fleets; preset test5).
import { test } from "node:test";
import assert from "node:assert/strict";
import { startGame, endSeason, runBotGame } from "../src/core/index.ts";
import { perform } from "../src/core/actions.ts";
import { presetOpts } from "../src/core/presets.ts";
import { muster, yourArmy } from "../src/core/island.ts";
import { pendingScene, allScenes } from "../src/core/scenes.ts";
import { carthageBlow, recovering, returnsPrefers, inTruce } from "../src/core/returns.ts";
import { fleetState, soundYours, carryCheck, strikeCheck } from "../src/core/fleets.ts";
import { brokenState } from "../scripts/sim-check.ts";

const t5 = (seed = 3) => { const o = presetOpts("test5"); return startGame(seed, o.tuning, o); };

test("the test 5 preset turns on every test 5 switch built so far, and bot games end without a broken state", () => {
  const o = presetOpts("test5");
  for (const id of ["battleScenes", "groundChoice", "contingents", "carthageReturns", "fleets", "friendsAbroad", "evenBattles", "test5Fixes"]) assert.ok(o.switches!.includes(id), id);
  for (const seed of [1, 2, 3]) {
    const s = runBotGame(seed, { bot: "simple", tuning: o.tuning, scenario: o.scenario, switches: o.switches, preset: o.preset });
    assert.deepEqual(brokenState(s), [], `seed ${seed}`);
    assert.ok(!pendingScene(s), "no battle is left unfought at the end");
  }
});

test("Carthage comes back: a lost army starts a recovery, a peace a truce, and the council will not vote war meanwhile", () => {
  const s = t5();
  carthageBlow(s, "a test defeat");
  assert.ok(recovering(s));
  const p = returnsPrefers(s, "people", { goal: "war", why: "anger" }, false);
  assert.equal(p.goal, "recover");
  carthageBlow(s, "the peace", true);
  s.island!.war = false;
  assert.ok(inTruce(s));
});

test("the fleet: starts with four squadrons, gives its order, and a strike at Carthage's fleet is a sea scene settled at the season's end", () => {
  const s = t5(4);
  const f = fleetState(s);
  assert.equal(f.sq, 4);
  assert.equal(soundYours(s), 4);
  assert.match(carryCheck(s) ?? "", /no army/);
  // Give Carthage an army on a port of the island, and let the player hold the fleet.
  s.offices.fleet = "dionysius";
  s.island!.war = true;
  s.island!.armies.push({ id: "armyT", side: "carthage", at: "catana", men: 4, food: 3, commander: "himilcon", guard: 0, guardStart: 0, since: s.season, moved: -1, siegeSince: -1, onTake: "spare" });
  assert.equal(strikeCheck(s), null);
  const r = perform(s, "strikeFleet", {});
  assert.ok(r.ok, JSON.stringify(r));
  const sc = pendingScene(s)!;
  assert.equal(sc.kind, "sea");
  assert.ok(sc.plate!.mine.some((m) => /beach/.test(m.label)), "ships caught on the beach fight at a loss");
  endSeason(s);
  const done = allScenes(s).find((x) => x.id === sc.id)!;
  assert.equal(done.stage, "done");
  assert.ok(done.result);
  assert.ok(Number.isInteger(fleetState(s).sq) && fleetState(s).sq >= 0);
});

test("carry the army: from Syracuse by sea, either landed or stopped by a battle in the lane", () => {
  let sailed = 0;
  for (const seed of [5, 6, 7, 8]) {
    const s = t5(seed);
    s.offices.fleet = "dionysius";
    s.offices.generalship = "dionysius";
    muster(s, false);
    const a = yourArmy(s)!;
    if (carryCheck(s)) continue; // too big an army for the fleet: covered by the check itself
    const r = perform(s, "sailArmy", { target: "catana" });
    assert.ok(r.ok, JSON.stringify(r));
    assert.ok(a.at === "catana" || pendingScene(s)?.kind === "sea", `seed ${seed}`);
    sailed++;
  }
  assert.ok(sailed > 0, "at least one army was small enough to sail");
});

test("friends abroad: the powers start with their mood words, Rhegium is a town reached by sea, and help needs an envoy first", async () => {
  const { abroadState, moodWordOf, helpCheck, giveGift, askHelp, pharacidasHere } = await import("../src/core/abroad.ts");
  const s = t5(9);
  const a = abroadState(s);
  assert.equal(moodWordOf(s, "sparta"), "Watching");
  assert.equal(moodWordOf(s, "league"), "Asleep");
  assert.equal(s.island!.cities.rhegium.side, "free");
  assert.match(helpCheck(s, "sparta") ?? "", /envoy/);
  a.at.sparta = s.season;
  s.silver = 10;
  giveGift(s, "sparta");
  assert.equal(moodWordOf(s, "sparta"), "Friendly");
  assert.equal(helpCheck(s, "sparta"), null);
  askHelp(s, "sparta");
  assert.ok(!pharacidasHere(s), "help comes next season");
  endSeason(s);
  assert.ok(pharacidasHere(s), "Pharacidas arrives");
});

test("the city rises in phases, holds a council in the citadel once, and eases when the factions calm", async () => {
  const { risingSeason, risingOf, crisisChoice, pendingChoice } = await import("../src/core/crises.ts");
  const s = t5(12);
  s.factions.citizens.mood = 0; s.factions.rich.mood = 0; s.guard.arrearsSeasons = 1;
  risingSeason(s); assert.equal(risingOf(s)!.phase, 1);
  risingSeason(s); assert.equal(risingOf(s)!.phase, 2);
  risingSeason(s); assert.equal(risingOf(s)!.phase, 3);
  const sc = pendingChoice(s)!;
  assert.equal(sc.kind, "crisis");
  assert.ok(sc.speakers!.length >= 2, "your friends speak first");
  crisisChoice(s, "feign", sc.id);
  assert.ok(risingOf(s)!.feignUntil! > s.season);
  s.factions.citizens.mood = 2;
  s.season += 2;
  risingSeason(s);
  assert.ok(s.over || risingOf(s)!.phase === 0, "after the feint the rising is broken or you fall");
});

test("an assembly vote you are in is a debate: levers add to your side, and the vote settles the seat", async () => {
  const { debateMove, pendingChoice } = await import("../src/core/crises.ts");
  const { HOOKS } = await import("../src/core/hooks.ts");
  const s = t5(13);
  s.silver = 10;
  const foe = Object.values(s.people).find((p) => !p.player && p.status === "free")!.id;
  assert.ok(HOOKS.debate!(s, "treasury", "the treasury", "the assembly meets in spring", 3, 5, foe, true));
  const sc = pendingChoice(s)!;
  assert.equal(sc.kind, "debate");
  debateMove(s, "gifts", sc.id);
  assert.match(sc.result!, /^You 5/);
  debateMove(s, "vote", sc.id);
  assert.ok((sc as any).answered);
});

test("libya: cross from Syracuse, land at the Quarries with a beach-or-burn choice, Carthage answers, and the city cannot be stormed", async () => {
  const { crossCheck, libyaState, landingOpen, armyInLibya } = await import("../src/core/libya.ts");
  let landed = 0;
  for (const seed of [1, 3, 4, 6]) {
    const s = t5(seed);
    assert.match(crossCheck(s) ?? "", /no army|not at war|generalship/);
    s.offices.fleet = "dionysius"; s.offices.generalship = "dionysius";
    s.island!.war = true; s.island!.warSince = s.season;
    fleetState(s).sq = 8;
    muster(s, false);
    const a = yourArmy(s)!;
    a.commander = "leptines"; a.food = 4;
    const r = perform(s, "crossLibya", {});
    assert.ok(r.ok, JSON.stringify(r));
    if (a.at !== "quarries") { assert.equal(pendingScene(s)?.kind, "sea"); continue; }
    landed++;
    const sc = landingOpen(s)!;
    assert.ok(sc, "the landing asks beach or burn");
    assert.ok(perform(s, "libyaLanding", { target: "burn", second: sc.id }).ok);
    assert.equal(libyaState(s).burnt, true);
    assert.ok(fleetState(s).sq < 8, "burnt ships are gone");
    assert.match(perform(s, "libyaHome", {}).ok ? "" : "blocked", /blocked/, "no way home with the ships burnt");
    for (let i = 0; i < 4 && !s.over && armyInLibya(s); i++) {
      endSeason(s);
      if (!armyInLibya(s)) break;
      const to = ({ quarries: "megalepolis", megalepolis: "tunis", tunis: "carthago" } as any)[yourArmy(s)!.at];
      if (to) perform(s, "libyaMarch", { target: to });
    }
    assert.deepEqual(brokenState(s), [], `seed ${seed}`);
    if (libyaState(s).answered !== undefined) assert.ok(allScenes(s).some((x) => x.title === "Carthage answers the invasion"));
    if (yourArmy(s)?.at === "carthago") { yourArmy(s)!.siege = "carthago"; yourArmy(s)!.siegeSince = s.season - 1; const r2 = perform(s, "assault", {}); assert.ok(!r2.ok); }
  }
  assert.ok(landed > 0, "at least one army landed");
});
