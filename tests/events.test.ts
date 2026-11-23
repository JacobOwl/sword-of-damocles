// Events: data shape, every choice runs, replays, and events actually fire in headless games.
import { test } from "node:test";
import assert from "node:assert/strict";
import { COURT_EVENTS as EVENTS, PACING, forceEvent, openEvents, eventsState, chooseEvent as choose } from "../src/core/events.ts";
import { startGame, endSeason, replay, runBotGame, DATA } from "../src/core/index.ts";
import { brokenState } from "../scripts/sim-check.ts";

const EFFECT_KEYS = new Set(["silver", "grain", "land", "clock", "mood", "power", "opinion", "grudge", "clearGrudge", "rival", "rank", "status", "guard",
  "influence", "favor", "clearFavor", "bound", "informer", "reveal", "revealPlots", "revealPlotOf", "leavePlots", "startPlot", "plotBonus", "office",
  "marry", "walls", "disarm", "payArrears", "flag", "clearFlag", "then", "end", "say"]);
const people = new Set(DATA.people.map((p) => p.id));
const factions = new Set(DATA.factions.map((f) => f.id));
const scars = new Set(DATA.origins.map((o) => o.id));
const ids = new Set(EVENTS.map((e) => e.id));

function allEffects(e: (typeof EVENTS)[number]) {
  const out: any[] = [...(e.effects ?? [])];
  for (const c of e.choices ?? []) out.push(...(c.effects ?? []), ...(c.roll?.success.effects ?? []), ...(c.roll?.failure.effects ?? []));
  return out;
}

test("there are at least 30 events, with unique ids, sourced or marked invention", () => {
  assert.ok(EVENTS.length >= 30, `only ${EVENTS.length} events`);
  assert.equal(ids.size, EVENTS.length);
  assert.ok(PACING.draws >= 1 && PACING.maxOpen >= 1);
  for (const e of EVENTS) {
    assert.ok(e.kind === "history" || e.kind === "invention", e.id);
    if (e.kind === "history") assert.ok(e.facts?.length && e.facts.every((f: any) => f.quote && f.cite && f.file), `${e.id}: history needs quoted facts`);
  }
  assert.ok(EVENTS.filter((e) => e.kind === "history").length >= 20);
  assert.ok(EVENTS.filter((e) => e.kind === "invention").length >= 10);
});

test("every event refers only to things that exist", () => {
  for (const e of EVENTS) {
    const roles = new Set(Object.keys(e.roles ?? {}));
    for (const r of Object.values(e.roles ?? {})) for (const id of [r.id ?? []].flat()) assert.ok(people.has(id), `${e.id}: unknown person ${id}`);
    const texts = [e.text, e.why, ...(e.choices ?? []).flatMap((c) => [c.label, c.text ?? "", c.roll?.success.text ?? "", c.roll?.failure.text ?? ""])];
    for (const t of texts) for (const m of t.matchAll(/\{([A-Za-z]+)\}/g)) {
      const k = m[1][0].toLowerCase() + m[1].slice(1);
      assert.ok(roles.has(k), `${e.id}: {${m[1]}} is not a role`);
    }
    for (const c of e.choices ?? []) for (const n of c.needs ?? []) assert.ok(roles.has(n), `${e.id}/${c.id}: needs unknown role ${n}`);
    for (const ef of allEffects(e)) {
      const keys = Object.keys(ef).filter((k) => !["by", "to", "reason", "scar", "why", "seasons", "after", "text", "hidden"].includes(k));
      assert.equal(keys.length, 1, `${e.id}: effect ${JSON.stringify(ef)} should do one thing`);
      assert.ok(EFFECT_KEYS.has(keys[0]), `${e.id}: unknown effect ${keys[0]}`);
      for (const k of ["opinion", "grudge", "clearGrudge", "rival", "rank", "status", "influence", "favor", "clearFavor", "bound", "informer", "reveal", "revealPlotOf", "leavePlots", "startPlot", "marry"])
        if (ef[k]) assert.ok(roles.has(ef[k]) || ef[k] === "you", `${e.id}: ${k} names unknown role ${ef[k]}`);
      if (ef.mood || ef.power) assert.ok(factions.has(ef.mood ?? ef.power), `${e.id}: unknown faction`);
      if (ef.rival) assert.ok(scars.has(ef.scar ?? "Humiliated"), `${e.id}: unknown scar ${ef.scar}`);
      if (ef.then) assert.ok(ids.has(ef.then) && EVENTS.find((x) => x.id === ef.then)!.chained, `${e.id}: follow-up ${ef.then} must be a chained event`);
    }
  }
});

test("players never see code-style ids in event text", () => {
  for (const e of EVENTS) {
    const texts = [e.name, e.text, e.why, ...(e.choices ?? []).flatMap((c) => [c.label, c.text ?? "", c.roll?.success.text ?? "", c.roll?.failure.text ?? ""])];
    for (const t of texts) assert.doesNotMatch(t.replace(/\{[A-Za-z]+\}/g, ""), /[a-z][A-Z]|_|\d{4}/, `${e.id}: "${t}"`);
  }
});

test("every choice of every event runs without breaking the game", () => {
  let ran = 0;
  const skipped: string[] = [];
  for (const e of EVENTS) {
    for (const c of e.choices ?? [{ id: "" } as any]) {
      for (let seed = 1; seed <= 6; seed++) {
        const s = startGame(seed);
        // Give the people what the rarer parts ask for, so most events can be cast.
        for (const p of Object.values(s.people)) { if (p.enters) p.status = (p as any).startStatus ?? "free"; p.owedFavor = p.id === "philistus"; }
        s.people.cavalryLeader.rival = { rank: 1, scars: ["Exiled"], memory: [], since: 0 };
        if (e.id === "polyxenusFlees") { s.people.polyxenus.opinion = -1; s.people.polyxenus.grudges.push({ reason: "a test", season: 0 }); }
        if (["eldestSon", "dorisMother"].includes(e.id)) { s.people.doris.married = true; s.people.doris.status = "free"; s.people.aristomache.married = true; }
        s.offices.fleet = "leptines";
        if (!forceEvent(s, e.id)) { if (seed === 6) skipped.push(`${e.id}/${c.id}`); continue; }
        const open = openEvents(s).find((o) => o.def.id === e.id);
        if (c.id && open) {
          s.silver = 9; s.land = 3; s.grain = 9; s.slots = 3;
          const r = choose(s, open.inst.uid, c.id);
          if (!r.ok) continue;
        }
        if (!s.over) endSeason(s);
        assert.deepEqual(brokenState(s), [], `${e.id}/${c.id}`);
        ran++;
        break;
      }
    }
  }
  if (skipped.length) console.log(`not cast in a fresh game: ${skipped.join(", ")}`);
  console.log(`${ran} event choices ran`);
  assert.ok(ran >= 100, `only ${ran} event choices could be tested`);
});

test("a game with answered events replays exactly", () => {
  let checked = 0;
  for (let seed = 1; seed <= 40 && checked < 5; seed++) {
    const s = startGame(seed);
    for (let season = 0; season < 4 && !s.over; season++) {
      for (const o of openEvents(s)) {
        const c = o.choices.find((x) => !x.blocked);
        if (c) { assert.equal(choose(s, o.inst.uid, c.id).ok, true); checked++; }
      }
      endSeason(s);
    }
    assert.equal(JSON.stringify(replay(seed, s.inputs)), JSON.stringify(s), `seed ${seed}`);
  }
  assert.ok(checked >= 5, "no events opened to answer");
});

test("events fire in headless games, and both kinds appear", () => {
  const seen = new Set<string>();
  let history = 0, total = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const s = runBotGame(seed);
    for (const id of Object.keys(eventsState(s).fired)) seen.add(id);
    history += s.counters.historyEvents ?? 0;
    total += s.counters.events ?? 0;
    assert.equal(eventsState(s).open.length, 0, `seed ${seed}: events left open at the end`);
  }
  assert.ok(seen.size >= 25, `only ${seen.size} different events fired in 100 games`);
  assert.ok(history > 0 && total > history);
});

test("the ball-game killings cost you: fear, and the dead men's kin become enemies", () => {
  const s = startGame(3); s.season = 8;
  const real = new Set(DATA.people.filter((p) => p.kind === "history").map((p) => p.id as string));
  const free = Object.values(s.people).filter((p) => !p.player && p.status === "free");
  const fav = free.find((p) => !real.has(p.id) && ["guard", "family", "rich"].includes(p.faction))!;
  fav.opinion = 1;
  const kin = free.find((p) => p.id !== fav.id && real.has(p.id) && !p.rival)!;
  fav.kin.push(kin.id);
  const moodBefore = s.factions.rich.mood;
  assert.ok(forceEvent(s, "ballGameJoke", { favourite: fav.id }));
  const open = openEvents(s).find((o) => o.def.id === "ballGameJoke")!;
  assert.equal(open.inst.roles.favouriteKin, kin.id);
  assert.ok(choose(s, open.inst.uid, "kill").ok);
  assert.equal(s.people[fav.id].status, "dead");
  assert.ok(s.people[kin.id].rival, "the dead man's kinsman becomes an enemy");
  assert.ok(s.factions.rich.mood < moodBefore, "the court is afraid");
});
