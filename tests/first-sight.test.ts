// The island at first sight: the "This season" line and the battle forecast before you send the army.
import { test } from "node:test";
import assert from "node:assert/strict";
import { runBotGame, presetOpts, replay, battleForecast, yourArmy, carthageArmy, DATA } from "../src/core/index.ts";
import { ui } from "../ui/lib/text.ts";
import { whatMatters, nowLine } from "../ui/components/now.ts";

test("the line on what matters names Carthage's army when it is on the island, and shows no ids", () => {
  const o = presetOpts("firstIslandTest");
  let seen = 0;
  for (let seed = 1; seed <= 30; seed++) {
    const s = runBotGame(seed, { bot: "careful", ...o, seasons: 20 });
    ui.s = s;
    const html = nowLine(s);
    assert.ok(s.over || /This season:/.test(html));
    assert.ok(!/\bundefined\b|NaN|\bdionysius\b|firstIslandTest/.test(html), html);
    const ca = carthageArmy(s);
    if (ca && !s.over) { seen++; assert.ok(whatMatters(s).some((x) => /army/.test(x.text)), `seed ${seed}: ${html}`); }
  }
  assert.ok(seen > 0, "some game has Carthage's army on the island by season 20");
});

test("a battle forecast lists both sides' modifiers and its chances add up", () => {
  const o = presetOpts("firstIslandTest");
  let found = 0;
  for (let seed = 1; seed <= 40 && !found; seed++) {
    const full = runBotGame(seed, { bot: "careful", ...o });
    for (let n = 1; n <= 40 && !found; n++) {
      let k = 0;
      const cut = full.inputs.findIndex((i) => i.t === "end" && ++k === n);
      if (cut < 0) break;
      const s = replay(seed, full.inputs.slice(0, cut + 1), o.tuning, o);
      const ya = yourArmy(s), ca = carthageArmy(s);
      if (!ya || !ca || s.over) continue;
      const f = battleForecast(s, ya, ca.at);
      if (!f) continue;
      found++;
      assert.ok(Math.abs(f.win + f.draw + f.lose - 1) < 1e-9);
      assert.ok(f.mine.length && f.theirs.length);
      assert.equal(yourArmy(s)!.at, ya.at, "the forecast moves nothing");
    }
  }
  assert.ok(found > 0, "found a game where both armies are in the field");
  assert.ok(DATA);
});
