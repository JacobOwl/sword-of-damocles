// Fixes chosen by the council of 2026-11-25 (docs/council/2026-11-25-after-the-thousand.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { startGame, act } from "../src/core/index.ts";

function executeLeptines(switches: string[]) {
  const s = startGame(3, "standard", { switches });
  s.people.leptines.status = "held";
  const before = s.log.length;
  act(s, "execute", { target: "leptines" });
  return { s, lines: s.log.slice(before).map((e) => `${e.text} ${e.why ?? ""}`) };
}

test("you are never heir to the feud of kin you execute", () => {
  const { s, lines } = executeLeptines(["feud"]);
  assert.equal(s.people.leptines.status, "dead");
  assert.ok(!lines.some((l) => /^Dionysius swears/.test(l)), lines.join("\n"));
  assert.ok(lines.some((l) => /^Thearides swears that Leptines's death will not be forgotten\. The feud passes to him\./.test(l)), lines.join("\n"));
  assert.equal(s.people.thearides.rival?.scars.includes("Bereaved"), true);
  assert.ok(!s.people.dionysius.grudges?.some((g) => /Leptines/.test(g.reason)));
});

test("without the feud switch, a dead man's grudge still goes to his kin, not to you", () => {
  const { s } = executeLeptines([]);
  assert.ok(s.people.thearides.grudges.some((g) => g.reason === "you executed his kin Leptines"));
  assert.ok(s.people.theste.grudges.some((g) => g.reason === "you executed her kin Leptines"), "she, not he");
  assert.ok(!s.people.dionysius.grudges?.some((g) => /Leptines/.test(g.reason)));
});

test("varied wording uses no dice: a replay is exact, and the story chronicle reads the plain line", async () => {
  const { runBotGame, replay } = await import("../src/core/index.ts");
  const a = runBotGame(7, { bot: "tyrant", scenario: "island" });
  const b = replay(7, a.inputs, a.tuning, { scenario: "island" });
  assert.deepEqual(b.log.map((e) => e.text), a.log.map((e) => e.text));
  const varied = a.log.filter((e) => e.stock && e.stock !== e.text);
  assert.ok(varied.length > 0, "some lines carry a varied sentence");
  for (const e of varied) assert.ok(e.text.startsWith(e.stock!.replace(/ \(\+\d+ silver to Carthage's treasury\.\)$/, "")), e.text);
});

test("the purse runs dry: at Rebellious each squeeze yields less, and only with the switch", async () => {
  const { startGame, act } = await import("../src/core/index.ts");
  for (const sw of [[], ["purseDry"]]) {
    const s = startGame(4, "standard", { switches: sw });
    s.factions.rich.mood = 0;
    s.offices.mint = "dionysius";
    const got: number[] = [];
    for (let i = 0; i < 3; i++) { const before = s.silver; s.flags.coin = -1; act(s, "strikeCoin"); s.slots = 3; got.push(s.silver - before); }
    if (sw.length) assert.deepEqual(got, [2, 1, 0]);
    else assert.deepEqual(got, [2, 2, 2]);
    assert.ok(s.log.some((e) => /can think no worse of you/.test(e.text)), "the floor says what it costs");
  }
});
