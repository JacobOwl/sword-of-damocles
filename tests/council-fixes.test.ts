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
