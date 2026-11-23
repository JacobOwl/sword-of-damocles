// The story chronicle of the first island test reads as a story: no line told more than twice in ten seasons,
// no bracketed numbers, no "You choose:" form, no nameless "He did not forget". Twenty seeds, careful bot.
import { test } from "node:test";
import assert from "node:assert/strict";
import { runBotGame, presetOpts, storyBook } from "../src/core/index.ts";
import { tidyLine } from "../src/core/chronicle.ts";

test("no sentence of the story is told more than twice in ten seasons (20 seeds)", () => {
  const o = presetOpts("firstIslandTest");
  for (let seed = 1; seed <= 20; seed++) {
    const s = runBotGame(seed, { bot: "careful", ...o, seasons: 10 });
    const b = storyBook(s, s.season - 1);
    const said: Record<string, number> = {};
    for (const x of b.seasons) for (const p of [...x.paragraphs, ...x.omens]) {
      assert.ok(!/\(\+?-?\d|You choose:|^He did not forget| He did not forget/.test(p), `seed ${seed}: ${p.slice(0, 160)}`);
      for (const t of p.split(/(?<=\.)\s+/)) if (t.length > 25) said[t] = (said[t] ?? 0) + 1;
    }
    for (const [t, n] of Object.entries(said)) assert.ok(n <= 2, `seed ${seed}: "${t}" told ${n} times`);
  }
});

test("a line is tidied for the story without losing its meaning", () => {
  assert.equal(tidyLine("Carthage's ships trade along the coasts. (+2 silver to Carthage's treasury.)"), "Carthage's ships trade along the coasts.");
  assert.equal(tidyLine("A fever. You choose: Leave it to the gods."), "A fever: you chose to leave it to the gods.");
  assert.equal(tidyLine("Light coins. You choose: Theodorus pays the difference."), "Light coins: you chose this: Theodorus pays the difference.");
});
