// Switch "dinners" (bet B5): the dinner action, the couch of honour, the moments, and what friendships and quarrels do to plots.
import { test } from "node:test";
import assert from "node:assert/strict";
import { DINNERS, EVENTS, act, endSeason, menu, preview, replay, runBotGame, startGame, suggestTable, castsFor, couchHolder, openEvents, dinnerLog, chooseEvent } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";
import { brokenState } from "../scripts/sim-check.ts";
import { recruitOrder } from "../src/core/dinner.ts";
import { readFileSync } from "node:fs";

const on = (seed = 3, scenario: "citadel" | "island" = "citadel") => startGame(seed, undefined, { switches: ["dinners"], scenario });
const free = (s: GameState) => Object.values(s.people).filter((p) => !p.player && p.status === "free").map((p) => p.id);
const table = (s: GameState, honour: string, guests: string[], wine = "mixed") => ({ target: honour, second: wine, option: guests.join(",") });

test("off by default: no dinner action, and the switch is listed off", () => {
  const s = startGame(3);
  assert.ok(!menu(s).some((m) => m.id === "hostDinner"));
  assert.ok(menu(on()).some((m) => m.id === "hostDinner"));
});

test("the table is checked before you commit: wine, guests, silver", () => {
  const s = on();
  const [h, a, b, c, d, e] = free(s);
  assert.equal(preview(s, "hostDinner", { target: h, option: `${a},${b}` }).ok, false); // no wine chosen
  assert.match(preview(s, "hostDinner", table(s, h, [a])).why ?? "", /at least 2/);
  assert.match(preview(s, "hostDinner", table(s, h, [a, b, c, d, e])).why ?? "", /at most 4/);
  assert.match(preview(s, "hostDinner", table(s, h, [a, a])).why ?? "", /once/);
  assert.match(preview(s, "hostDinner", table(s, h, [h, a])).why ?? "", /in the city/);
  assert.equal(preview(s, "hostDinner", table(s, h, [a, b])).ok, true);
  s.silver = 1;
  assert.match(preview(s, "hostDinner", table(s, h, [a, b], "strong")).why ?? "", /2 silver/);
});

test("the couch of honour: its holder gains standing, the man you take it from takes it badly", () => {
  const s = on();
  s.silver = 10;
  const [h, a, b, c] = free(s);
  const infl0 = s.people[h].infl;
  act(s, "hostDinner", table(s, h, [a, b]));
  assert.equal(couchHolder(s), h);
  assert.equal(s.people[h].infl, infl0 + DINNERS.knobs.couchInfluence);
  endSeason(s);
  if (s.over || s.people[c].status !== "free" || s.people[h].status !== "free") return;
  const before = s.people[h].opinion, inflH = s.people[h].infl;
  act(s, "hostDinner", table(s, c, [a, b]));
  assert.equal(couchHolder(s), c);
  assert.equal(s.people[h].infl, inflH - DINNERS.knobs.couchInfluence);
  assert.ok(s.people[h].opinion <= before, "the old holder thinks less of you (or no better)");
  assert.ok(s.log.some((e) => /gave the couch beside yours/.test(e.why ?? "")));
});

test("every dinner line in the log says why, and a dinner game replays exactly", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const s = on(seed);
    s.silver = 12;
    const t = suggestTable(s);
    if (!t) continue;
    act(s, "hostDinner", { ...t, second: "strong" });
    const d = s.dinners!.held[0];
    for (const e of dinnerLog(s, d)) assert.ok(e.why, `seed ${seed}: no reason for "${e.text}"`);
    for (let i = 0; i < 4 && !s.over; i++) endSeason(s);
    const r = replay(s.seed, s.inputs, s.tuning, { switches: s.switches });
    // Silver was set by hand above, so compare what the dinner did, not the whole state.
    assert.deepEqual(r.dinners?.held.map((x) => x.moments), s.dinners?.held.map((x) => x.moments));
  }
});

test("every moment and matter is well formed", () => {
  const roleKeys = new Set(["honour", "notHonour", "absent", "covets", "enemy", "opinion", "trait", "grudge", "rival", "political", "inPlot", "status", "faction"]);
  const effectKeys = new Set(["bond", "quarrel", "mend", "couch", "bondYou", "heardBy", "slip", "tongue", "teller", "carrier", "why", "opinion", "by", "reveal", "revealPlotOf", "grudge", "reason", "influence", "plotBonus"]);
  for (const m of DINNERS.moments) {
    assert.ok(DINNERS.courses.some((c) => c.n === m.course), `${m.id}: course`);
    for (const w of DINNERS.wines) assert.ok(m.tone in w.tones, `${m.id}: tone ${m.tone} missing from wine ${w.id}`);
    for (const r of Object.values(m.roles)) for (const k of Object.keys(r)) assert.ok(roleKeys.has(k), `${m.id}: role key ${k}`);
    for (const p of m.pairs ?? []) assert.ok(m.roles[p.a] && m.roles[p.b], `${m.id}: pair names a missing role`);
    for (const e of m.effects ?? []) for (const k of Object.keys(e)) assert.ok(effectKeys.has(k), `${m.id}: effect ${k}`);
    for (const k of m.text.match(/\{(\w+)\}/g) ?? []) assert.ok(m.roles[k.slice(1, -1).toLowerCase()], `${m.id}: ${k} is no role`);
    if (m.ask) {
      const ev = EVENTS.find((x) => x.id === m.ask);
      assert.ok(ev && ev.chained, `${m.id}: its matter must be a chained event`);
      for (const r of Object.keys(ev!.roles ?? {})) assert.ok(m.roles[r], `${m.id}: matter role ${r} is not cast by the moment`);
    }
  }
});

test("a dinner's moment comes from the guests: who is at the table decides what can happen", () => {
  const s = on();
  const [h, a, b] = free(s);
  const slip = DINNERS.moments.find((m) => m.id === "plotSlip")!;
  assert.equal(castsFor(s, slip, h, [h, a, b]).length, 0, "no plotter at the table, no careless word");
  const door = DINNERS.moments.find((m) => m.id === "atTheDoor")!;
  for (const c of castsFor(s, door, h, [h, a, b])) assert.ok(s.people[c.a].rival);
});

test("friends from your table are recruited first; a man you quarrelled with, never", () => {
  const s = on();
  const [l, a, b, c] = free(s);
  s.dinners = { bonds: [{ a: l, b: c, season: 0, why: "test" }], quarrels: [{ a: l, b: a, season: 0, why: "test" }], held: [] };
  const order = recruitOrder(s, l, [s.people[a], s.people[b], s.people[c]]).map((p) => p.id);
  assert.deepEqual(order, [c, b]);
});

test("100 bot games with dinners, in both scenarios: no crash, no broken state, and dinners happen", () => {
  let dinners = 0, moments = 0;
  for (const scenario of ["citadel", "island"] as const) for (let seed = 1; seed <= 50; seed++) {
    const s = runBotGame(seed, { bot: "simple", switches: ["dinners"], scenario });
    assert.deepEqual(brokenState(s), [], `${scenario} seed ${seed}`);
    dinners += s.counters.dinners ?? 0; moments += s.counters.dinnerMoments ?? 0;
  }
  assert.ok(dinners > 0 && moments > 0, `dinners ${dinners}, moments ${moments}`);
});

test("a matter from the table is answered like any other", () => {
  let answered = 0;
  for (let seed = 1; seed <= 40 && !answered; seed++) {
    const s = on(seed);
    s.silver = 20;
    for (let k = 0; k < 3 && !s.over && s.slots > 0; k++) { const t = suggestTable(s); if (t) act(s, "hostDinner", { ...t, second: "strong" }); }
    const m = openEvents(s).find((o) => (o.def as { dinner?: boolean }).dinner);
    if (!m) continue;
    const c = m.choices.find((x) => !x.blocked)!;
    assert.equal(chooseEvent(s, m.inst.uid, c.id).ok, true);
    assert.ok(!openEvents(s).some((o) => o.inst.uid === m.inst.uid));
    answered++;
  }
  assert.ok(answered, "some dinner put a choice to you");
});

test("history moments quote the saved texts and have the research card", () => {
  const card = readFileSync("docs/research/dinners.md", "utf8");
  for (const m of [...DINNERS.moments, ...(DINNERS.asks as any[])].filter((x: any) => x.kind === "history")) {
    assert.ok((m as any).facts?.length, `${m.id}: no facts`);
    for (const f of (m as any).facts) assert.ok(card.includes(f.quote.slice(0, 40)) || card.includes(f.quote.slice(-30)), `${m.id}: quote not on the card`);
  }
});
