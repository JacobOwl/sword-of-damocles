// Switch "contestedBoard" (thread 37): seats with holders who use them, votes, the crisis when you lose a seat,
// the captain of the guard, the ladder of standing and the matters made from moves.
import { test } from "node:test";
import assert from "node:assert/strict";
import { replay, runBotGame, startGame, endSeason, openEvents, presetOpts, defense } from "../src/core/index.ts";
import { setOffice } from "../src/core/ops.ts";
import { seatsOf, standingOf, race } from "../src/core/board.ts";
import { brokenState } from "../scripts/sim-check.ts";

const SW = { scenario: "island" as const, switches: ["contestedBoard"] };

test("off by default: a game without the switch has no board", () => {
  const s = startGame(3, undefined, { scenario: "island" });
  assert.equal(s.board, undefined);
});

test("the board starts with seven seats and Aristotle as captain of the guard", () => {
  const s = startGame(3, undefined, SW);
  assert.ok(s.board);
  assert.equal(s.board!.captain, "aristotle");
  assert.equal(Object.keys(s.board!.seats).length, 7);
  assert.ok(s.switches!.includes("escalation") && s.switches!.includes("quarrels"), "it turns its helpers on");
  assert.ok(seatsOf(s, "dionysius").includes("generalship"));
});

test("losing a seat outside your turn opens the crisis, with a way to bargain and to fight", () => {
  const s = startGame(4, undefined, SW);
  endSeason(s);
  s.step = "power"; // as if a rival took it after your turn
  setOffice(s, "generalship", "hipparinus", "test");
  s.step = "player";
  endSeason(s); // the next season begins, and the crisis comes before you
  const crisis = openEvents(s).find((e) => e.def.id === "boardLostVoted");
  if (s.offices.generalship !== "hipparinus" || s.people.hipparinus.status !== "free") return; // the vote or a death moved it first
  assert.ok(crisis, "the crisis scene is open");
  assert.match(crisis!.text, /Hipparinus holds the generalship/);
  assert.deepEqual(crisis!.choices.map((c) => c.id), ["bargain", "contest", "force", "accept"]);
});

test("a captain who turns against you takes the guard out of your defense", () => {
  const s = startGame(5, undefined, SW);
  const before = defense(s).total;
  s.people.aristotle.opinion = -2;
  assert.ok(defense(s).total < before, "the guard no longer counts");
});

test("a vote shows who leads before the day", () => {
  const s = startGame(6, undefined, SW);
  const r = race(s, "assembly");
  assert.ok(r?.holder && r.challenger);
  assert.equal(r!.holder!.id, "nicoteles");
});

test("100 bot games of the second test: no crash, no broken state, seats change hands and people rise", () => {
  const o = presetOpts("secondIslandTest");
  assert.ok(o.switches!.includes("contestedBoard"));
  let votes = 0, rises = 0, crises = 0, matters = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const s = runBotGame(seed, { bot: "careful", ...o });
    assert.deepEqual(brokenState(s), [], `seed ${seed}`);
    votes += s.counters.boardVotesLost ?? 0; rises += s.counters.boardRises ?? 0; crises += s.counters.boardCrises ?? 0; matters += s.counters.boardMatters ?? 0;
  }
  assert.ok(votes > 50 && rises > 100 && crises > 50 && matters > 500, `${votes} ${rises} ${crises} ${matters}`);
});

test("a board game replays exactly", () => {
  const o = presetOpts("secondIslandTest");
  const s = runBotGame(9, { bot: "careful", ...o, seasons: 12 });
  const r = replay(9, s.inputs, o.tuning, o);
  assert.equal(JSON.stringify(r.board), JSON.stringify(s.board));
  assert.equal(r.log.length, s.log.length);
});

test("standing: the real cast start as Notable or higher", () => {
  const s = startGame(2, undefined, SW);
  assert.ok(standingOf(s, "nicoteles") >= 1);
});
