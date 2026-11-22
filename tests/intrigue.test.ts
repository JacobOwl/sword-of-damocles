// The switches "Your council argues" and "Secrets and leverage" (data/council.json, data/secrets.json).
import { test } from "node:test";
import assert from "node:assert/strict";
import { startGame, runBotGame, replay, act, endSeason, counsel, seated, secretsAbout, secretLine } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";
import { brokenState } from "../scripts/sim-check.ts";

const BOTH = ["council", "secrets"];
const many = (switches: string[], scenario: "citadel" | "island", n = 25) => {
  const out: GameState[] = [];
  for (const bot of ["simple", "careful", "patron", "tyrant", "careless"]) for (let seed = 1; seed <= n; seed++) out.push(runBotGame(seed, { bot, switches, scenario }));
  return out;
};
const sum = (gs: GameState[], k: string) => gs.reduce((a, s) => a + (s.counters[k] ?? 0), 0);
const CODE = /\b[a-z]+[A-Z][A-Za-z]*\b|\b(secret|plot|req)\d+\b/;

test("off by default: no council, no secrets, and the default game is unchanged", () => {
  const s = startGame(5);
  assert.equal(s.council, undefined);
  assert.equal(s.secrets, undefined);
  const a = runBotGame(9, { bot: "careful" }), b = runBotGame(9, { bot: "careful", switches: ["clues"] });
  assert.ok(a.log.length && b.log.length);
});

test("each alone and together, in both scenarios: no crash, no broken state", () => {
  for (const scenario of ["citadel", "island"] as const) for (const sw of [["council"], ["secrets"], BOTH]) {
    for (const s of many(sw, scenario, 12)) assert.deepEqual(brokenState(s), [], `${scenario} ${sw.join("+")} seed ${s.seed}`);
  }
});

test("a game with both replays exactly", () => {
  for (const scenario of ["citadel", "island"] as const) {
    const s = startGame(11, undefined, { scenario, switches: BOTH });
    act(s, "watch", { target: "philistus" });
    for (let i = 0; i < 6 && !s.over; i++) endSeason(s);
    const r = replay(11, s.inputs, undefined, { scenario, switches: BOTH });
    assert.deepEqual(r.log.map((e) => e.text), s.log.map((e) => e.text));
  }
});

test("the council sits, speaks before actions, and some of what it says is false", () => {
  const s = startGame(3, undefined, { switches: ["council"] });
  assert.equal(seated(s).length, 4);
  const lines = counsel(s, "seize", { target: "hipparinus" });
  assert.ok(lines.some((l) => l.stance < 0), "someone argues against seizing a rich man");
  assert.ok(counsel(s, "execute", { target: "philistus" }).some((l) => l.who === "philistus" && l.stance === -2), "a man argues for his own life");
  const island = startGame(3, undefined, { scenario: "island", switches: ["council"] });
  assert.equal(seated(island).length, 5, "the island adds a voice of the rich houses from the invented families");
  const gs = many(["council"], "citadel");
  assert.ok(sum(gs, "councilAccusations") > 0 && sum(gs, "councilLies") > 0, "accusations, some false");
  assert.ok(sum(gs, "liesCaught") > 0, "a watch can catch a false accusation");
  assert.ok(sum(gs, "overruled") > 0, "a proud counsellor resents being overruled");
});

test("secrets: real ones at the start, learned, used, and your rivals find and use yours", () => {
  const s = startGame(3, undefined, { switches: ["secrets"] });
  assert.ok(secretsAbout(s, "philistus").some((x) => x.history), "Philistus starts with a secret from Plutarch");
  assert.ok(secretsAbout(s, "dionysius").some((x) => x.tpl === "leontiniAlarm"), "you start with the night alarm at Leontini");
  for (const scenario of ["citadel", "island"] as const) {
    const gs = many(["secrets"], scenario);
    for (const k of ["secretsLearned", "holdsUsed", "yourSecretsFound", "blackmailDemands", "yourSecretsExposed"]) assert.ok(sum(gs, k) > 0, `${scenario}: ${k} happens`);
    if (scenario === "island") assert.ok(sum(gs, "townSecrets") > 0, "spies learn what a town's first man hides");
  }
});

test("no code ids in what the player reads", () => {
  for (const s of many(BOTH, "island", 6)) {
    for (const e of s.log.filter((e) => e.visible && /council|secret|knows that|tells the city|hold/.test(e.text))) assert.ok(!CODE.test(e.text), e.text);
    for (const x of s.secrets!.list.filter((x) => x.tpl !== "none")) assert.ok(!CODE.test(secretLine(s, x)), secretLine(s, x));
  }
});
