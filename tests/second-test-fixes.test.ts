// Fixes and the council's rules after Jacob's second test (thread 39, 2026-11-27; docs/council/2026-11-27-second-test-rules.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { presetOpts, startGame, preview, menu, yourArmy, sexOf } from "../src/core/index.ts";
import { guardSet } from "../src/core/ops.ts";
import { loseMen, muster } from "../src/core/island.ts";
import { politicalRank } from "../src/core/actions.ts";
import { describe as describeEffects } from "../src/core/events.ts";
import { ui } from "../ui/lib/text.ts";
import { foe } from "../ui/components/foe.ts";

const o = presetOpts("secondIslandTest");
const game = () => startGame(7, o.tuning, o);

test("guard pay falls with the men, and is never more than the men left", () => {
  const s = game();
  s.guard.strength = 4; s.guard.upkeep = 3;
  guardSet(s, "strength", -1, "test");
  assert.equal(s.guard.upkeep, 2);
  guardSet(s, "strength", -3, "test");
  assert.equal(s.guard.strength, 0);
  assert.equal(s.guard.upkeep, 0, "no pay for a guard of none");
});

test("marriage never matches two people of the same sex", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const s = startGame(seed, o.tuning, o);
    s.step = "player";
    for (const p of Object.values(s.people)) {
      if (p.player || !p.marriageable) continue;
      const pv = preview(s, "marriage", { target: p.id, second: "dionysius" });
      if (!pv.ok) continue;
      // The spouse the run would pick is of the other sex from Dionysius.
      const house = [p, ...p.kin.map((k) => s.people[k])].filter((x) => x && x.marriageable && !x.married && x.faction !== "family" && !x.player);
      assert.ok(house.some((x) => sexOf(s, x.id) === "f"), `${p.id}: a match was offered with no woman in the house`);
    }
  }
});

test("the guard dies only in battle: hunger takes the levy, then the guard marches home", () => {
  const s = game();
  s.guard.strength = 3;
  muster(s, true);
  const a = yourArmy(s)!;
  const g0 = a.guard;
  assert.ok(g0 > 0);
  loseMen(s, a, 1, "hunger");
  assert.equal(a.guard, g0, "hunger spares the guard");
  loseMen(s, a, 99, "hunger");
  assert.equal(yourArmy(s), undefined, "the army breaks up");
  assert.equal(s.guard.strength, 3, "and the guard comes home whole");
});

test("a Devoted rival climbs no higher than Contender", () => {
  const s = game();
  const p = Object.values(s.people).find((x) => !x.player && x.status === "free")!;
  p.political = { type: "Climber", rank: 2, since: 0, outSeasons: 0 };
  p.opinion = 3;
  politicalRank(s, p.id, 1, "test");
  assert.equal(p.political.rank, 2);
  p.opinion = 1;
  politicalRank(s, p.id, 1, "test");
  assert.equal(p.political.rank, 3, "his love cooled, so he climbs");
});

test("Strike coin is free under the mint rule, and greys out when it brings in nothing", () => {
  const s = game();
  s.step = "player";
  s.offices.mint = "dionysius";
  s.slots = 0;
  assert.equal(menu(s).find((m) => m.id === "strikeCoin")!.blocked, null, "no action needed");
  s.factions.rich.mood = 0; s.flags.richSqueeze = 5; s.flags.richSqueezedAt = s.season;
  assert.match(menu(s).find((m) => m.id === "strikeCoin")!.blocked ?? "", /brings in nothing/);
});

test("an unfilled optional role is not shown in an event's choices", () => {
  const s = game();
  const lines = describeEffects(s, { id: "x", def: "ballGameJoke", roles: { favourite: "theodorus" }, season: 0 } as any, [{ rival: "favouriteKin" } as any, { opinion: "favourite", by: 1 } as any]);
  assert.equal(lines.length, 1);
  assert.ok(!lines.some((l) => /Kin/.test(l)));
});

test("the one coming for you: a named plot's leader", () => {
  const s = game();
  ui.s = s;
  const p = Object.values(s.people).find((x) => !x.player && x.status === "free")!;
  s.plots.push({ id: "p1", leader: p.id, members: [p.id], backers: ["rich"], stage: 3, stageSince: 0, namedSince: 0, bonus: 0, known: [p.id], started: 0, guardBacking: false });
  assert.equal(foe(s)?.p.id, p.id);
});
