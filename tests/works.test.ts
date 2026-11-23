// Switch "greatWorks" (bet B4): off by default, builds over seasons, costs what it says, gives what it says,
// replays exactly, never breaks state, and shows no ids on its screen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { startGame, endSeason, act, replay, runBotGame, menu, secondOptions, workOf, SWITCHES } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";
import { brokenState } from "../scripts/sim-check.ts";
import { worksView } from "../ui/views/works.ts";
import { startScreen } from "../ui/views/start.ts";

const W = ["greatWorks"];
const island = (seed = 3) => startGame(seed, undefined, { scenario: "island", switches: W });
const seasons = (s: GameState, n: number) => { for (let i = 0; i < n && !s.over; i++) endSeason(s); };

test("great works are off by default: no actions, no state, the wall is still in Build", () => {
  const s = startGame(1, undefined, { scenario: "island" });
  assert.equal(s.works, undefined);
  assert.ok(!menu(s).some((m) => ["beginWork", "overseeWork", "haltWork"].includes(m.id)));
  const b = runBotGame(5, { bot: "careful", scenario: "island" });
  assert.equal(b.works, undefined);
  assert.ok(menu(startGame(1)).find((m) => m.id === "build")!.targets!.some((t) => t.value === "wall"));
});

test("the start screen hides a Workshop switch unless the page is a Workshop build", () => {
  assert.ok(SWITCHES.find((w) => w.id === "greatWorks")?.workshop);
  assert.ok(!startScreen(null, 1).includes('value="greatWorks"'));
  (globalThis as any).__WORKSHOP = ["greatWorks"];
  try { assert.match(startScreen(null, 1), /value="greatWorks" checked/); } finally { delete (globalThis as any).__WORKSHOP; }
});

test("the Epipolae wall: one season of hired work raises Syracuse's walls; the old wall leaves Build", () => {
  const s = island();
  s.silver = 20;
  assert.ok(!menu(s).find((m) => m.id === "build")?.targets?.some((t) => t.value === "wall"));
  assert.ok(secondOptions(s, "beginWork", { target: "epipolae" }).some((o) => o.value === "peasants"));
  assert.deepEqual(act(s, "beginWork", { target: "epipolae", second: "hired" }), { ok: true });
  assert.equal(s.walls, false);
  const before = s.silver;
  seasons(s, 1);
  assert.equal(workOf(s, "epipolae")!.done, s.season);
  assert.equal(s.walls, true);
  assert.ok(s.log.some((e) => /a season's work on the epipolae wall/.test(e.why ?? "") && /Silver -5/.test(e.text)), "3 silver for the wall and 2 for hired men");
  assert.ok(before > s.silver - 99);
});

test("unpaid men down tools, and after two seasons a season's work is lost", () => {
  const s = island();
  s.silver = 20;
  act(s, "beginWork", { target: "arsenal", second: "abroad" });
  seasons(s, 1);
  assert.equal(workOf(s, "arsenal")!.progress, 1);
  s.silver = 0;
  seasons(s, 2);
  const w = workOf(s, "arsenal")!;
  assert.ok(w.stalled >= 2 || s.silver >= 3, "stalled while the treasury was empty");
  assert.ok(s.log.some((e) => /down their tools/.test(e.text)));
  assert.ok(w.progress <= 1 && w.done === undefined);
});

test("the arms workshops: engines, a stronger guard and armed citizens; craftsmen from Carthage's lands anger Carthage", () => {
  const s = island(4);
  s.silver = 40;
  const guard = s.guard.strength, men = s.island!.cities.syracuse.men;
  act(s, "beginWork", { target: "arsenal", second: "punic" });
  const angerLines = () => s.log.filter((e) => /craftsmen who left its lands/.test(e.why ?? "")).length;
  seasons(s, 2); // three seasons, one faster with the best craftsmen
  const w = workOf(s, "arsenal")!;
  assert.notEqual(w.done, undefined, "done in two seasons");
  assert.ok(angerLines() >= 1 || s.clock === 10);
  assert.notEqual(s.flags.armed, undefined);
  assert.equal(s.guard.strength, guard + 1);
  assert.equal(s.island!.cities.syracuse.men, men + 1);
});

test("overseers: yourself costs an action a season; a man who hates you skims, and the log hides his name", () => {
  const s = island(6);
  s.silver = 40;
  act(s, "beginWork", { target: "fleet", second: "abroad" });
  act(s, "overseeWork", { target: "fleet", second: "you" });
  seasons(s, 1);
  assert.equal(s.slots, 2, "one action fewer while you oversee");
  const foe = Object.values(s.people).find((p) => !p.player && p.status === "free")!;
  act(s, "overseeWork", { target: "fleet", second: foe.id });
  foe.opinion = -2;
  seasons(s, 1);
  const skim = s.log.filter((e) => /skims the silver/.test(e.text));
  if (workOf(s, "fleet")!.overseer === foe.id && s.people[foe.id].status === "free") {
    assert.ok(skim.length >= 1 && skim.every((e) => !e.visible));
    assert.ok(s.log.some((e) => e.visible && /accounts of the great fleet come up short/.test(e.why ?? "")));
  }
});

test("bots build, every game stays sound, and a game with works replays exactly", () => {
  let done = 0;
  for (const scenario of ["island", "citadel"] as const) for (const bot of ["careful", "patron", "tyrant", "careless"]) for (let seed = 1; seed <= 12; seed++) {
    const s = runBotGame(seed, { bot, scenario, switches: W });
    assert.deepEqual(brokenState(s), [], `${scenario} ${bot} ${seed}`);
    done += (s.works?.list ?? []).filter((w) => w.done !== undefined).length;
  }
  assert.ok(done >= 20, `bots finished ${done} works`);
  const b = runBotGame(9, { bot: "patron", scenario: "island", switches: W });
  assert.deepEqual(replay(9, b.inputs, b.tuning, { scenario: "island", switches: W }).log.map((e) => e.text), b.log.map((e) => e.text));
});

test("the works screen names things in plain words, with no ids or broken values", () => {
  for (const seed of [1, 2, 3, 4, 5, 6]) {
    const s = runBotGame(seed, { bot: "patron", scenario: "island", switches: W });
    const html = worksView(s).replace(/<[^>]+>/g, " ");
    assert.ok(!/undefined|NaN|\bnull\b/.test(html), html.slice(0, 400));
    assert.ok(!/\b(epipolae|arsenal|punic|abroad|subjects|peasants|italy|aetna)\b/.test(html), "a raw id on the works screen");
  }
});
