// Replays must not depend on the JavaScript engine. A comparator that draws from the dice made the number of draws
// depend on how many comparisons the engine's sort makes (Chromium and Node differ), so a copied game diverged.
// Here every sort is swapped for a different stable sort (insertion sort): if all comparators are pure, nothing changes.
import { test } from "node:test";
import assert from "node:assert/strict";
import { runBotGame, presetOpts, logDigest } from "../src/core/index.ts";

function withInsertionSort<T>(fn: () => T): T {
  const orig = Array.prototype.sort;
  Array.prototype.sort = function (this: any[], cmp?: (a: any, b: any) => number) {
    const c = cmp ?? ((a: any, b: any) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0));
    for (let i = 1; i < this.length; i++) {
      const x = this[i];
      let j = i - 1;
      while (j >= 0 && c(this[j], x) > 0) { this[j + 1] = this[j]; j--; }
      this[j + 1] = x;
    }
    return this;
  } as any;
  try { return fn(); } finally { Array.prototype.sort = orig; }
}

test("a game plays the same whatever sort the engine uses", () => {
  const o = presetOpts("firstIslandTest");
  for (const [seed, bot, opts] of [[3, "careful", o], [19, "careful", o], [7, "simple", {}], [11, "tyrant", o]] as const) {
    const a = logDigest(runBotGame(seed, { bot, ...opts, seasons: 16 }));
    const b = withInsertionSort(() => logDigest(runBotGame(seed, { bot, ...opts, seasons: 16 })));
    assert.equal(b, a, `seed ${seed}, ${bot} bot`);
  }
});
