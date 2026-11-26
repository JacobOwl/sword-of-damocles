// The second island test (thread 35, 2026-11-26): check-ins at seasons 10 and 20, the verdict at 30, and the
// "What changed" block that would have shown Jacob losing the generalship in his first game.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { presetOpts, replay, runBotGame, storesForecast } from "../src/core/index.ts";
import { ui } from "../ui/lib/text.ts";
import { checkInDue, verdictDue } from "../ui/views/verdict.ts";
import { whatChanged } from "../ui/components/changed.ts";

test("check-ins come at seasons 10 and 20, the verdict at 30", () => {
  const o = presetOpts("secondIslandTest");
  const full = runBotGame(5, { bot: "careful", ...o });
  const upTo = (n: number) => { let k = 0; return full.inputs.slice(0, full.inputs.findIndex((i) => i.t === "end" && ++k === n) + 1); };
  ui.verdict = null; ui.checkIns = [];
  const at = (n: number) => { const g = replay(5, upTo(n), o.tuning, o); ui.s = g; return g; };
  let g = at(9);
  if (g.over) return; // a reign that ends early is asked on its last page instead
  assert.equal(checkInDue(g), null);
  g = at(10);
  if (g.over) return;
  assert.equal(checkInDue(g), 10);
  assert.equal(verdictDue(g), true);
  ui.checkIns = [{ season: 10, retell: "", confused: "", unfair: "", level: "", other: "" }];
  assert.equal(verdictDue(g), false, "answered once");
  g = at(20);
  if (g.over) return;
  assert.equal(checkInDue(g), 20);
  ui.checkIns.push({ season: 20, retell: "", confused: "", unfair: "", level: "", other: "" });
  assert.equal(verdictDue(g), false);
  g = at(30);
  if (g.over) return;
  assert.equal(checkInDue(g), null);
  assert.equal(verdictDue(g), true, "the full verdict at 30");
  ui.checkIns = [];
});

test("Jacob's first game: the generalship loss leads the next season's changes", () => {
  const v = JSON.parse(readFileSync("docs/playtests/2026-11-26-jacob/save.json", "utf8"));
  const g = replay(v.seed, v.inputs, v.tuning, { scenario: v.scenario, switches: v.switches, preset: v.preset });
  ui.s = g;
  const summer403 = 7;
  const top = whatChanged(g, summer403)[0];
  assert.equal(top.level, "danger");
  assert.match(top.text, /^You lost the generalship: Nicoteles holds it now/);
});

test("the stores forecast names the guard's pay and the rations", () => {
  const g = runBotGame(1, { bot: "careful", ...presetOpts("secondIslandTest"), upto: 1 } as any);
  const f = storesForecast(g);
  assert.ok(f.grain.some((x) => x.label.startsWith("rations")));
  assert.ok(f.silver.some((x) => /guard's pay/.test(x.label)) || g.offices.treasury === null);
});
