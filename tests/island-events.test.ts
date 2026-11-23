// The island's events (data/island-events.json): shape, no dates, every choice runs, replay, and they fire only in island games.
import { test } from "node:test";
import assert from "node:assert/strict";
import { ISLAND_EVENTS, COURT_EVENTS, ISLAND_PACING, forceEvent, openEvents, eventsState, chooseEvent as choose } from "../src/core/events.ts";
import { ISLAND_EFFECT_KEYS } from "../src/core/island-events.ts";
import { startGame, endSeason, replay, runBotGame, DATA } from "../src/core/index.ts";
import { NODES, carthageArmy, city, muster, yourArmy } from "../src/core/island.ts";
import { brokenState } from "../scripts/sim-check.ts";
import { VIGNETTES } from "../ui/vignettes.ts";
import type { GameState } from "../src/core/types.ts";

const COURT_KEYS = new Set(["silver", "grain", "land", "clock", "mood", "power", "opinion", "grudge", "clearGrudge", "rival", "rank", "status", "guard",
  "influence", "favor", "clearFavor", "bound", "informer", "reveal", "revealPlots", "revealPlotOf", "leavePlots", "startPlot", "plotBonus", "office",
  "marry", "walls", "disarm", "payArrears", "flag", "clearFlag", "then", "end", "say"]);
const PERSON_KEYS = ["opinion", "grudge", "clearGrudge", "rival", "rank", "status", "influence", "favor", "clearFavor", "bound", "informer", "reveal", "revealPlotOf", "leavePlots", "startPlot", "marry"];
const PLACE_KEYS = ["lean", "cityGrain", "cityMen", "cityWalls", "fear", "side", "takeCity"];
const people = new Set(DATA.people.map((p) => p.id));
const nodes = new Set(NODES.map((n) => n.id));
const blocs = new Set(["elders", "hundred", "people", "libyans"]);
const ids = new Set([...COURT_EVENTS, ...ISLAND_EVENTS].map((e) => e.id));

function allEffects(e: (typeof ISLAND_EVENTS)[number]) {
  const out: any[] = [...(e.effects ?? [])];
  for (const c of e.choices ?? []) out.push(...(c.effects ?? []), ...(c.roll?.success.effects ?? []), ...(c.roll?.failure.effects ?? []));
  return out;
}
const texts = (e: (typeof ISLAND_EVENTS)[number]) => [e.name, e.text, e.why, ...(e.choices ?? []).flatMap((c) => [c.label, c.text ?? "", c.roll?.success.text ?? "", c.roll?.failure.text ?? ""]),
  ...allEffects(e).map((x) => x.why ?? "")];

test("island events: unique ids, tagged, sourced, with a picture, and only for island games", () => {
  assert.ok(ISLAND_EVENTS.length >= 15, `only ${ISLAND_EVENTS.length} island events`);
  assert.equal(ids.size, COURT_EVENTS.length + ISLAND_EVENTS.length, "an island event reuses a court event's id");
  assert.ok(ISLAND_PACING.draws >= 1 && ISLAND_PACING.maxOpen >= 1);
  for (const e of ISLAND_EVENTS) {
    assert.equal(e.scenario, "island");
    assert.ok(e.kind === "history" || e.kind === "invention", e.id);
    if (e.kind === "history") assert.ok(e.facts?.length && e.facts.every((f: any) => f.quote && f.cite && f.file) && e.source && e.card, `${e.id}: history needs a source, a card and quoted facts`);
    assert.ok(e.art && VIGNETTES[e.art], `${e.id} has no picture (art: ${e.art})`);
    assert.ok(e.choices?.length || e.effects?.length, `${e.id} does nothing`);
  }
});

test("island events come as conditions, never dates", () => {
  const dated = (c: any): boolean => !!c && (c.from !== undefined || c.until !== undefined || (c.any ?? []).some(dated));
  for (const e of ISLAND_EVENTS) {
    assert.ok(!dated(e.when), `${e.id} has a date window`);
    for (const c of e.choices ?? []) assert.ok(!dated(c.if), `${e.id}/${c.id} has a date window`);
  }
});

test("every island event refers only to things that exist", () => {
  for (const e of ISLAND_EVENTS) {
    const places = new Set(Object.keys(e.places ?? {}));
    const roles = new Set(Object.keys(e.roles ?? {}));
    const court = new Set(Object.entries(e.roles ?? {}).filter(([, r]) => !r.census && !r.punic).map(([k]) => k));
    for (const r of Object.values(e.roles ?? {})) for (const id of [r.id ?? []].flat()) assert.ok(people.has(id), `${e.id}: unknown person ${id}`);
    for (const p of Object.values(e.places ?? {})) for (const id of [p.id ?? [], p.notId ?? []].flat()) assert.ok(nodes.has(id), `${e.id}: unknown town ${id}`);
    for (const r of Object.values(e.roles ?? {})) if (r.census === "leader") assert.ok(places.has(r.of ?? "") || nodes.has(r.of ?? ""), `${e.id}: leader of unknown town ${r.of}`);
    for (const t of texts(e)) for (const m of t.matchAll(/\{([A-Za-z]+)\}/g)) {
      const k = m[1][0].toLowerCase() + m[1].slice(1);
      assert.ok(roles.has(k) || places.has(k), `${e.id}: {${m[1]}} is not a part`);
    }
    for (const c of e.choices ?? []) for (const n of c.needs ?? []) assert.ok(roles.has(n) || places.has(n), `${e.id}/${c.id}: needs unknown part ${n}`);
    for (const ef of allEffects(e)) {
      const keys = Object.keys(ef).filter((k) => !["by", "to", "reason", "scar", "why", "seasons", "after", "text", "hidden", "if"].includes(k));
      assert.equal(keys.length, 1, `${e.id}: effect ${JSON.stringify(ef)} should do one thing`);
      const k = keys[0];
      assert.ok(COURT_KEYS.has(k) || ISLAND_EFFECT_KEYS.has(k), `${e.id}: unknown effect ${k}`);
      if (PERSON_KEYS.includes(k)) assert.ok(court.has(ef[k]) || ef[k] === "you", `${e.id}: ${k} must name a part from the court cast, not ${ef[k]}`);
      if (PLACE_KEYS.includes(k)) assert.ok(places.has(ef[k]) || nodes.has(ef[k]), `${e.id}: ${k} names unknown town ${ef[k]}`);
      if (k === "bloc" || k === "blocPower") assert.ok(blocs.has(ef[k]), `${e.id}: unknown bloc ${ef[k]}`);
      if (["armyMen", "armyFood", "siegeLines", "liftSiege", "armyHome"].includes(k)) assert.ok(["yours", "carthage"].includes(ef[k]), `${e.id}: ${k} must be yours or carthage`);
      if (k === "then") assert.ok(ids.has(ef.then) && ISLAND_EVENTS.find((x) => x.id === ef.then)?.chained, `${e.id}: follow-up ${ef.then} must be a chained island event`);
    }
  }
});

test("players never see code-style ids in island event text", () => {
  for (const e of ISLAND_EVENTS) for (const t of texts(e)) assert.doesNotMatch(t.replace(/\{[A-Za-z]+\}/g, ""), /[a-z][A-Z]|_|\d{4}/, `${e.id}: "${t}"`);
});

// Island states that fit most events: your army besieging a town of Carthage's (or one that changed sides), Carthage's
// army before Syracuse or in the field, war, plague, a just-taken town, low stores.
function setups(seed: number, switches: string[] = []): GameState[] {
  const out: GameState[] = [];
  for (const kind of ["yourSiege", "theirSiege", "taken", "field", "winter"]) {
    const s = startGame(seed, undefined, { scenario: "island", switches });
    const isl = s.island!;
    isl.war = true; isl.warSince = 0; s.flags.atWar = 0;
    s.flags.armed = 0; s.flags.carthagePlague = 0; s.flags.punicLost = 0; s.flags.battleWon = 0; s.flags.peaceMade = 0;
    s.offices.fleet = "leptines";
    s.guard.arrearsSeasons = 1; s.grain = 2; s.silver = 9; s.slots = 3; s.season = 3;
    muster(s, false);
    const ya = yourArmy(s)!;
    ya.men = 8; ya.food = 1; ya.since = 0;
    const target = kind === "yourSiege" ? "motya" : kind === "taken" ? "catana" : "acragas";
    ya.at = target;
    if (kind !== "taken") { ya.siege = target; ya.siegeSince = 1; }
    isl.carthage.general = "himilcon"; isl.carthage.people.himilcon.status = "command";
    isl.armies.push({ id: "carthage1", side: "carthage", at: kind === "theirSiege" ? "syracuse" : "gela", men: 8, food: 0, commander: "himilcon", guard: 0, guardStart: 0, since: 0, moved: -1, siegeSince: 1, siege: kind === "theirSiege" ? "syracuse" : undefined, onTake: "sack" });
    s.people.heloris.status = "outside";
    if (kind === "winter") s.season = 5;
    if (kind === "taken" || kind === "winter") { city(s, "messana").side = "syracuse"; city(s, "messana").men = 1; }
    if (kind === "taken") { const ca = isl.armies.find((a) => a.side === "carthage")!; ca.at = "leontini"; }
    if (kind === "field") { const ca = isl.armies.find((a) => a.side === "carthage")!; ca.at = "leontini"; ca.siege = "leontini"; }
    city(s, "leontini").side = "ally"; city(s, "leontini").since = 2;
    city(s, "catana").side = "ally";
    if (kind === "taken") { city(s, "catana").side = "syracuse"; city(s, "catana").since = 3; city(s, "motya").side = "syracuse"; city(s, "motya").since = 3; }
    out.push(s);
  }
  return out;
}

test("every choice of every island event runs without breaking the game", () => {
  let ran = 0;
  const skipped: string[] = [];
  for (const e of ISLAND_EVENTS) {
    for (const c of e.choices ?? [{ id: "" } as any]) {
      let done = false;
      for (let seed = 1; seed <= 3 && !done; seed++) {
        for (const s of setups(seed)) {
          if (!forceEvent(s, e.id)) continue;
          const open = openEvents(s).find((o) => o.def.id === e.id);
          s.step = "player";
          if (c.id && open) { const r = choose(s, open.inst.uid, c.id); if (!r.ok) continue; }
          if (!s.over) endSeason(s);
          assert.deepEqual(brokenState(s), [], `${e.id}/${c.id}`);
          assert.ok(!carthageArmy(s) || carthageArmy(s)!.men >= 0);
          ran++; done = true; break;
        }
      }
      if (!done) skipped.push(`${e.id}/${c.id}`);
    }
  }
  if (skipped.length) console.log(`island choices not run: ${skipped.join(", ")}`);
  const total = ISLAND_EVENTS.reduce((a, e) => a + (e.choices?.length ?? 1), 0);
  console.log(`${ran} of ${total} island event choices ran`);
  assert.ok(ran >= total * 0.9, `only ${ran} of ${total} island event choices could be tested`);
});

test("island events never fire in a citadel game", () => {
  for (let seed = 1; seed <= 40; seed++) {
    const s = runBotGame(seed);
    for (const e of ISLAND_EVENTS) assert.equal(eventsState(s).fired[e.id], undefined, `seed ${seed}: ${e.id} fired in the citadel`);
  }
});

test("island events fire in island games, are all answered, and the game replays exactly", () => {
  const seen = new Set<string>();
  for (let seed = 1; seed <= 60; seed++) {
    const s = runBotGame(seed, { scenario: "island", bot: "careful" });
    for (const e of ISLAND_EVENTS) if (eventsState(s).fired[e.id] !== undefined) seen.add(e.id);
    // A game that ends inside a season (Syracuse stormed in the factions step) may leave matters unanswered.
    if (!s.over || s.over.season !== s.season) assert.equal(eventsState(s).open.length, 0, `seed ${seed}: events left open`);
    assert.deepEqual(brokenState(s), [], `seed ${seed}`);
  }
  assert.ok(seen.size >= 8, `only ${seen.size} island events fired in 60 careful games: ${[...seen].join(", ")}`);
  // A careful player's island game, with island events answered, replays exactly from its inputs.
  let checked = 0;
  for (let seed = 1; seed <= 60 && checked < 3; seed++) {
    const s = runBotGame(seed, { scenario: "island", bot: "careful" });
    const answered = s.inputs.filter((i) => i.t === "choose").length;
    if (!ISLAND_EVENTS.some((e) => eventsState(s).fired[e.id] !== undefined) || !answered) continue;
    const r = replay(seed, s.inputs, undefined, { scenario: "island" });
    assert.deepEqual(r.log.map((e) => e.text), s.log.map((e) => e.text), `seed ${seed}`);
    checked++;
  }
  assert.ok(checked >= 3, "no island game with answered events to replay");
});

test("switch 'A bought retreat disgraces the general': off, Himilcon goes home free; on, in disgrace, and may starve himself", () => {
  for (const sw of [[], ["bargainDisgraces"]]) {
    const s = setups(1, sw)[1];
    assert.ok(forceEvent(s, "himilconsBargain"));
    const o = openEvents(s).find((x) => x.def.id === "himilconsBargain")!;
    s.step = "player";
    assert.equal(choose(s, o.inst.uid, "take").ok, true);
    assert.equal(carthageArmy(s), undefined);
    const st = s.island!.carthage.people.himilcon.status;
    if (sw.length) assert.equal(st, "disgraced"); else assert.equal(st, "free");
    endSeason(s); endSeason(s);
    if (sw.length) assert.ok(["disgraced", "dead"].includes(s.island!.carthage.people.himilcon.status));
    assert.deepEqual(brokenState(s), []);
  }
});

test("switch 'Rumors can lie': off, rumors are always true; on, about a third are false, change nothing in Carthage, and a clue follows", () => {
  const rumors = ISLAND_EVENTS.filter((e) => e.rumor);
  assert.ok(rumors.length >= 3);
  let falses = 0, total = 0, clues = 0;
  for (let seed = 1; seed <= 60; seed++) {
    for (const sw of [[], ["falseRumors"]]) {
      const s = setups(seed, sw)[1];
      s.flags.punicLost = s.season; s.island!.carthage.blocs.libyans.mood = 1;
      if (!forceEvent(s, "dockyardSpeakers")) continue;
      const inst = eventsState(s).open.find((o) => o.id === "dockyardSpeakers")!;
      if (!sw.length) { assert.equal(inst.falseRumor, undefined); assert.equal(eventsState(s).clues, undefined); continue; }
      total++;
      assert.match(openEvents(s).find((o) => o.def.id === "dockyardSpeakers")!.text, /about 1 in 3/);
      const power = s.island!.carthage.blocs.people.power;
      s.step = "player";
      choose(s, inst.uid, "shout");
      if (inst.falseRumor) { falses++; assert.equal(s.island!.carthage.blocs.people.power, power, "a false rumor changed Carthage"); }
      for (let i = 0; i < 3 && !s.over; i++) endSeason(s);
      if (s.log.some((e) => /^Later word from Carthage/.test(e.text))) clues++;
    }
  }
  assert.ok(total >= 30, `only ${total} rumors cast`);
  assert.ok(falses > total * 0.15 && falses < total * 0.55, `${falses} false of ${total}`);
  assert.ok(clues >= total * 0.8, `clues came for only ${clues} of ${total}`);
});

test("court events that tell the island's own stories are hidden in island games", () => {
  for (const id of ["mercenaryDemand", "himilconOffer"]) assert.equal(COURT_EVENTS.find((e) => e.id === id)?.scenario, "citadel");
  for (let seed = 1; seed <= 30; seed++) {
    const s = runBotGame(seed, { scenario: "island", bot: "careful" });
    for (const id of ["mercenaryDemand", "himilconOffer"]) assert.equal(eventsState(s).fired[id], undefined, `seed ${seed}: ${id} fired on the island`);
  }
});
