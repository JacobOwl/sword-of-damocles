import { test } from "node:test";
import assert from "node:assert/strict";
import { runBotGame, startGame, act, endSeason } from "../src/core/index.ts";
import { recordOf, play, loadAt, recordAt, seasonStarts, decisions, rewrite, compare, hiddenRolls } from "../src/core/fork.ts";

const games = [
  runBotGame(11, { bot: "careful", scenario: "island" }),
  runBotGame(12, { bot: "careful" }),
  runBotGame(13, { bot: "tyrant", scenario: "island", switches: ["secrets", "council"] }),
];

test("a recorded game plays back exactly", () => {
  for (const g of games) assert.equal(JSON.stringify(play(recordOf(g))), JSON.stringify(g));
});

test("loading at a season gives the game as it stood when that turn began", () => {
  for (const g of games) {
    const r = recordOf(g);
    for (const k of [0, 1, Math.floor(g.season / 2), g.season]) {
      const s = loadAt(r, k);
      assert.equal(s.season, Math.min(k, seasonStarts(r.inputs).length - 1));
      // The loaded game is the parent's log cut at that point, entry for entry.
      assert.deepEqual(s.log, g.log.slice(0, s.log.length));
      if (!s.over) assert.equal(s.step, "player");
    }
  }
});

test("a branch matches its parent up to the split, and differs after it", () => {
  let tried = 0;
  for (const g of games) {
    const r = recordOf(g);
    const ds = decisions(r).filter((d) => (d.kind === "choose" || d.kind === "unanswered") && d.alternatives.some((a) => !a.blocked));
    for (const d of ds.slice(0, 3)) {
      const alt = d.alternatives.find((a) => !a.blocked)!;
      const w = rewrite(r, { decision: d, choice: alt.id }, true);
      const before = loadAt(r, d.season);
      assert.deepEqual(w.game.log.slice(0, before.log.length), before.log, "the branch shares the parent's history up to that season");
      const c = compare(g, w.game);
      assert.ok(c.split !== null && c.split >= d.season, "the split is at or after the changed season");
      for (const p of c.seasons.filter((x) => x.season < c.split!)) assert.ok(p.same);
      // A branch is a game like any other: it replays from its own record.
      assert.equal(JSON.stringify(play(w.record)), JSON.stringify(w.game));
      tried++;
    }
  }
  assert.ok(tried >= 3, "found choices to change");
});

test("stopping at the changed choice leaves the rest of that season to play by hand", () => {
  const g = games[0];
  const r = recordOf(g);
  const d = decisions(r).find((x) => x.kind === "choose" && x.alternatives.some((a) => !a.blocked))!;
  const w = rewrite(r, { decision: d, choice: d.alternatives.find((a) => !a.blocked)!.id }, false);
  assert.equal(w.game.season, d.season);
  assert.equal(w.skipped.length, 0);
  assert.equal(w.record.inputs.length, d.index + 1);
});

test("dropping an action keeps the rest and lists what no longer fits", () => {
  const g = games[1];
  const r = recordOf(g);
  const d = decisions(r).find((x) => x.kind === "act")!;
  const w = rewrite(r, { decision: d, drop: true }, true);
  assert.equal(w.record.inputs.length <= r.inputs.length, true);
  for (const x of w.skipped) assert.ok(x.label && x.why);
});

test("a game compared with itself has no split", () => {
  const c = compare(games[0], play(recordOf(games[0])));
  assert.equal(c.split, null);
  assert.equal(c.fates.length, 0);
  assert.ok(c.seasons.every((x) => x.same));
});

test("choices are told in words, with no ids", () => {
  const s = startGame(5);
  act(s, "watch", { target: "philistus" });
  endSeason(s);
  const ds = decisions(recordOf(s));
  assert.ok(ds.length >= 1);
  for (const d of ds) assert.doesNotMatch(d.label, /\bev\d+|req\d+|[a-z][A-Z]\w+/, d.label);
  assert.ok(hiddenRolls(games[0]).every((x) => x.die >= 1 && x.die <= 6));
  assert.equal(recordAt(recordOf(s), 1).inputs.length, s.inputs.length);
});
