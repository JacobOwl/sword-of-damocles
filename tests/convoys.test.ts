// Switch "convoys", Grain and the sea: grain and silver cross the sea as convoys, run by contractors who may skim.
import { test } from "node:test";
import assert from "node:assert/strict";
import { PLAYER } from "../src/core/state.ts";
import { startGame, replay, runBotGame, act, endSeason, menu, preview, logDigest } from "../src/core/index.ts";
import { atSea, pastConvoys, contractors, convoysArrive, convoysSail, CONVOYS } from "../src/core/convoys.ts";
import { brokenState } from "../scripts/sim-check.ts";
import type { Army, GameState } from "../src/core/types.ts";

const SW = { scenario: "island" as const, switches: ["convoys"] };
const ready = (seed = 3) => { const s = startGame(seed, undefined, SW); s.silver = 10; s.grain = 12; return s; };
const shown = (s: GameState, re: RegExp) => s.log.some((e) => e.visible && re.test(e.text));

test("without the switch, bought grain lands at once and the convoy actions are not in the menu", () => {
  const s = startGame(3, undefined, { scenario: "island" });
  s.silver = 5;
  const g = s.grain;
  act(s, "buyGrain", {});
  assert.equal(s.grain, g + 2);
  assert.equal(s.convoys, undefined);
  const ids = menu(s).map((m) => m.id);
  assert.ok(!ids.includes("sendGrain") && !ids.includes("auditContracts"));
});

test("with the switch, bought grain sails now, is run by a rich house, and lands (or not) next season with its reason", () => {
  const s = ready();
  const g = s.grain;
  act(s, "buyGrain", {});
  assert.equal(s.grain, g, "nothing lands this season");
  const v = atSea(s)[0];
  assert.ok(v && v.purpose === "bought" && v.contractor && contractors(s).includes(v.contractor));
  assert.ok(shown(s, /A convoy sails from the grain ports of Italy for Syracuse/));
  endSeason(s);
  assert.ok(!atSea(s).includes(v) || v.due > s.season, "it has landed, or a storm holds it");
  const done = pastConvoys(s).find((x) => x.id === v.id);
  if (done) assert.ok(done.fate && ["arrived", "caught", "wrecked", "sold"].includes(done.status));
});

test("a contractor's skim is shown as a shortfall with his excuse; the truth is hidden until an audit", () => {
  const s = ready();
  act(s, "buyGrain", {});
  const v = atSea(s)[0];
  const id = v.contractor!;
  // Make him as crooked as the rules allow, and try arrivals until he skims (each try is a fresh copy).
  let hit: GameState | undefined;
  for (let i = 0; i < 40 && !hit; i++) {
    const t = structuredClone(s) as GameState;
    t.rng = (t.rng + i * 7919) | 0;
    t.census!.people[id].traits = ["greedy"];
    t.factions.rich.mood = 1;
    t.season += 1; // the season it is due (not winter, so no storm)
    t.season = t.season % 4 === 1 ? t.season + 1 : t.season;
    t.convoys!.fleet[0].due = t.season; t.convoys!.fleet[0].sailed = t.season - 1;
    convoysArrive(t);
    if (t.convoys!.contractors[id].skimmed > 0) hit = t;
  }
  assert.ok(hit, "a greedy man with angry friends skims at least once in 40 tries");
  const t = hit!;
  assert.ok(shown(t, /lands 1 month of grain short\. .* says seawater spoiled it/));
  assert.ok(t.log.some((e) => !e.visible && /keeps back 1 month of grain/.test(e.text)), "the truth is in the hidden log");
  // The audit finds it, he repays and is barred, and the rich resent it.
  t.step = "player"; t.slots = 3;
  const g = t.grain, mood = t.factions.rich.mood;
  assert.ok(act(t, "auditContracts", { target: id }).ok);
  assert.equal(t.grain, g + 1);
  assert.ok(t.convoys!.contractors[id].barred);
  assert.ok(!contractors(t).includes(id));
  assert.equal(t.factions.rich.mood, Math.max(0, mood - 1));
});

test("an audit of an honest man costs the rich families' goodwill and finds nothing", () => {
  const s = ready();
  act(s, "buyGrain", {});
  const id = atSea(s)[0].contractor!;
  s.convoys!.contractors[id].skimmed = 0;
  const mood = s.factions.rich.mood;
  assert.ok(act(s, "auditContracts", { target: id }).ok);
  assert.ok(shown(s, /find nothing amiss/));
  assert.equal(s.factions.rich.mood, mood - 1);
  assert.ok(!s.convoys!.contractors[id].barred);
});

test("grain to the army: only on the coast, priced first, and it feeds the army that is still there", () => {
  const s = ready();
  s.offices.generalship = PLAYER;
  assert.ok(act(s, "muster", { second: "levy" }).ok);
  const a = s.island!.armies.find((x) => x.side === "syracuse") as Army;
  a.at = "leontini";
  assert.match(preview(s, "sendGrain", { target: contractors(s)[0] }).why ?? "", /inland/);
  a.at = "catana"; a.food = 0;
  const pv = preview(s, "sendGrain", { target: contractors(s)[0] });
  assert.ok(pv.ok, pv.why);
  const g = s.grain;
  assert.ok(act(s, "sendGrain", { target: contractors(s)[0] }).ok);
  assert.equal(s.grain, g - CONVOYS.knobs.armyGrainCost);
  const v = atSea(s).find((x) => x.purpose === "army")!;
  assert.equal(v.army, a.id);
  assert.match(preview(s, "sendGrain", { target: contractors(s)[0] }).why ?? "", /already at sea/);
  // Land it by hand at peace (no fleet hunts it), as if it sailed in autumn (no storm): the army eats from it.
  s.island!.war = false; v.sailed = 0; v.due = s.season;
  const before = a.food;
  convoysArrive(s);
  const done = pastConvoys(s).find((x) => x.id === v.id)!;
  assert.equal(done.status, "arrived");
  assert.ok(a.food > before);
});

test("Carthage's army is no longer fed by magic in port: its grain sails, and its pay crosses each spring", () => {
  const s = ready();
  s.island!.war = true;
  const ca: Army = { id: "carthageTest", side: "carthage", at: "motya", men: 8, food: 1, commander: "himilcon", guard: 0, guardStart: 0, since: -1, moved: -1, siegeSince: -1, onTake: "sack" };
  s.island!.armies.push(ca);
  s.season = 2; // spring
  convoysSail(s);
  assert.ok(atSea(s).some((v) => v.side === "carthage" && v.cargo === "grain" && v.army === ca.id));
  assert.ok(atSea(s).some((v) => v.side === "carthage" && v.cargo === "silver" && v.purpose === "pay"));
});

test("60 games with the switch on: no crash, no broken state, and convoys are sent, caught, skimmed and starve armies", () => {
  const tot: Record<string, number> = {};
  for (let seed = 1; seed <= 60; seed++) {
    const s = runBotGame(seed, { bot: "careful", ...SW });
    assert.deepEqual(brokenState(s), [], `seed ${seed}`);
    for (const [k, v] of Object.entries(s.counters)) tot[k] = (tot[k] ?? 0) + v;
  }
  for (const k of ["convoysSent", "convoysCaught", "convoysSkimmed", "carthageConvoys", "carthageConvoysCaught", "armiesFedBySea", "audits", "starvedByCatch"]) assert.ok((tot[k] ?? 0) > 0, `${k} never happened`);
});

test("a game with convoys replays exactly from its inputs", () => {
  const s = runBotGame(11, { bot: "careful", ...SW });
  const r = replay(s.seed, s.inputs, s.tuning, SW);
  assert.equal(logDigest(r), logDigest(s));
});
