// Switch "commission": lead the army yourself or send a named man, with a keeper of the citadel while you are away.
import { test } from "node:test";
import assert from "node:assert/strict";
import { PLAYER, defense, plotStrength } from "../src/core/state.ts";
import { startGame, replay, runBotGame, act, endSeason, menu, preview, actionNotes, thirdOptions } from "../src/core/index.ts";
import { startPlot } from "../src/core/ai.ts";
import { brokenState } from "../scripts/sim-check.ts";

const SW = { scenario: "island" as const, switches: ["commission"] };
const ready = (seed = 3) => { const s = startGame(seed, undefined, SW); s.silver = 10; s.grain = 12; return s; };

test("without the switch, the muster asks no leader and needs the generalship as before", () => {
  const s = startGame(3, undefined, { scenario: "island" });
  assert.equal(menu(s).find((m) => m.id === "muster")!.targets, undefined);
  s.offices.generalship = "leptines";
  assert.match(preview(s, "muster", { second: "levy" }).why ?? "", /generalship/);
});

test("leading in person: a keeper is asked for, the prices are shown, plots grow and the keeper counts", () => {
  const s = ready();
  assert.match(preview(s, "muster", { target: PLAYER, second: "levy" }).why ?? "", /keeper of the citadel/);
  assert.ok(thirdOptions(s, "muster", { target: PLAYER }).some((o) => o.value === "andron"));
  const notes = actionNotes(s, "muster", { target: PLAYER, second: "levy", option: "leptines" });
  assert.ok(notes.some((n) => /away/.test(n)) && notes.some((n) => /keeps the citadel/.test(n)), notes.join(" | "));
  s.people.leptines.opinion = 3;
  const pl = startPlot(s, s.people.theodorus, "a test");
  const before = plotStrength(s, pl).total;
  const def0 = defense(s).total;
  assert.ok(act(s, "muster", { target: PLAYER, second: "levy", option: "leptines" }).ok);
  assert.equal(s.campaign?.leader, PLAYER);
  assert.equal(s.people[PLAYER].where, "field");
  assert.equal(plotStrength(s, pl).total, before + 1);
  assert.ok(defense(s).parts.some((p) => /Leptines keeps the citadel faithfully/.test(p.label)));
  assert.equal(defense(s).total, def0 + 1);
  // A keeper who joins a plot turns against you.
  pl.members.push("leptines");
  assert.ok(defense(s).parts.some((p) => p.value === -2));
});

test("the homecoming is logged, clears the campaign, and you can see a false keeper", () => {
  const s = ready();
  act(s, "muster", { target: PLAYER, second: "levy", option: "andron" });
  const pl = startPlot(s, s.people.theodorus, "a test");
  pl.members.push("andron");
  act(s, "disband", {});
  assert.equal(s.campaign, undefined);
  assert.equal(s.people[PLAYER].where, undefined);
  assert.ok(s.log.some((e) => e.why === "Homecoming"));
  assert.ok(pl.known.includes("andron"));
});

test("sending a man who is not the general is unlawful, and costs you with the citizens", () => {
  const s = ready();
  s.offices.generalship = "leptines";
  const mood = s.factions.citizens.mood;
  assert.ok(actionNotes(s, "muster", { target: "theodorus", second: "levy" }).some((n) => /Unlawful/.test(n)));
  assert.ok(act(s, "muster", { target: "theodorus", second: "levy" }).ok);
  assert.equal(s.campaign?.lawful, false);
  assert.equal(s.factions.citizens.mood, mood - 1);
  assert.equal(s.island!.armies.find((a) => a.side === "syracuse")!.commander, "theodorus");
  // You can still give it orders by letter.
  assert.equal(preview(s, "sendArmy", { target: "catana", second: "spare" }).why, undefined);
  endSeason(s);
});

test("a man who comes home a victor comes home popular", () => {
  const s = ready();
  act(s, "muster", { target: "leptines", second: "levy" });
  const infl = s.people.leptines.infl;
  s.counters.battlesWon = (s.counters.battlesWon ?? 0) + 1;
  act(s, "disband", {});
  assert.equal(s.people.leptines.infl, infl + 1);
  assert.ok(s.log.some((e) => /cheers Leptines home/.test(e.text)));
});

test("bots use the switch, games replay exactly, and nothing breaks", () => {
  let led = 0;
  for (const bot of ["careful", "patron", "simple", "tyrant", "careless"]) for (let seed = 1; seed <= 12; seed++) {
    const s = runBotGame(seed, { bot, ...SW });
    assert.deepEqual(brokenState(s), [], `${bot} ${seed}`);
    led += s.counters.campaigns ?? 0;
    if (seed <= 3 && bot !== "simple") { // the simple bot draws from the game's own dice, so only the other bots replay from inputs alone
      const r = replay(seed, s.inputs, undefined, SW);
      assert.equal(JSON.stringify(r.log), JSON.stringify(s.log), `${bot} ${seed} replays`);
    }
  }
  assert.ok(led > 0);
});
