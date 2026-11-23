// The generated cast (src/core/census.ts, data/census.json, data/names.json).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  generateCensus, stepCensus, streamFrom, censusProblems, censusLeader, censusCouncil, censusCaptain, censusName, censusFamily,
  lookOf, CENSUS_DATA, namePool, type CensusNote,
} from "../src/core/census.ts";

const names = JSON.parse(readFileSync("data/names.json", "utf8"));
const cast = JSON.parse(readFileSync("data/people.json", "utf8")).people.map((p: any) => p.name);
const decade = (seed: number) => {
  const r = streamFrom(seed);
  const c = generateCensus(r);
  const notes: { season: number; note: CensusNote }[] = [];
  for (let s = 0; s < 40; s++) for (const note of stepCensus(c, r, s)) notes.push({ season: s, note });
  return { c, notes };
};

test("every name is attested: a passage, a file, a citation, a known group", () => {
  const ids = new Set<string>();
  for (const n of names.names) {
    assert.ok(!ids.has(n.id), `duplicate name ${n.id}`);
    ids.add(n.id);
    assert.equal(n.kind, "history");
    assert.ok(names.groups[n.group], `${n.name}: unknown group ${n.group}`);
    assert.ok(["m", "f"].includes(n.sex));
    const plain = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    assert.ok(plain(n.facts?.[0]?.quote ?? "").includes(plain(n.spelled ?? n.name).slice(0, 4)), `${n.name}: the quote does not show the name`);
    assert.ok(n.facts[0].file.startsWith("sources/") && n.facts[0].cite && n.source);
  }
  for (const b of CENSUS_DATA.bodies) for (const g of Object.keys(b.groups)) {
    assert.ok(namePool(g, "m").length >= 3, `${g}: too few men's names`);
    assert.ok(namePool(g, "f").length >= 1, `${g}: no women's names`);
  }
});

test("the same seed gives the same people and the same decade; another seed does not", () => {
  const a = decade(11), b = decade(11), c = decade(12);
  assert.deepEqual(a.c, b.c);
  assert.deepEqual(a.notes, b.notes);
  assert.notDeepEqual(a.c.people, c.c.people);
});

test("100 decades: no broken family, house, name or captain in any season", () => {
  for (let seed = 1; seed <= 100; seed++) {
    const r = streamFrom(seed);
    const c = generateCensus(r);
    assert.deepEqual(censusProblems(c, 0), [], `seed ${seed} at the start`);
    for (let s = 0; s < 40; s++) {
      stepCensus(c, r, s);
      assert.deepEqual(censusProblems(c, s), [], `seed ${seed}, season ${s}`);
    }
  }
});

test("the decade has births, deaths, marriages and new heads, and the words show no code ids", () => {
  const kinds: Record<string, number> = {};
  for (let seed = 1; seed <= 20; seed++) {
    const { c, notes } = decade(seed);
    for (const { note } of notes) {
      kinds[note.kind] = (kinds[note.kind] ?? 0) + 1;
      for (const t of [note.text, note.why]) assert.doesNotMatch(t, /\b[ch]\d+\b|undefined|NaN|null|\bsomeone\b/, t);
      for (const w of note.who) assert.ok(c.people[w], `${note.text} names an unknown person`);
    }
    for (const p of Object.values(c.people)) for (const f of censusFamily(c, p.id)) assert.ok(c.people[f.person]);
  }
  for (const k of ["birth", "death", "marriage", "head", "age"]) assert.ok(kinds[k] > 0, `no ${k} in 20 decades`);
});

test("no living invented person carries the name of someone in the starting cast", () => {
  for (let seed = 1; seed <= 30; seed++) {
    const { c } = decade(seed);
    for (const p of Object.values(c.people)) if (p.given) assert.ok(!cast.includes(p.given), `${p.given} is a cast name`);
  }
});

test("the lookups: a first man for every city, the councils, captains on both sides", () => {
  const { c } = decade(3);
  for (const b of CENSUS_DATA.bodies.filter((b) => b.tie.kind === "city")) {
    const id = censusLeader(c, b.place, 39);
    assert.ok(id && c.people[id].alive, `no leader at ${b.place}`);
  }
  for (const tie of ["elders", "hundred", "people", "rich", "citizens"]) assert.ok(censusCouncil(c, tie).length >= 2, tie);
  for (const side of ["syracuse", "carthage"] as const) {
    const id = censusCaptain(c, side);
    assert.ok(id && c.people[id].alive && c.people[id].side === side);
    assert.match(censusName(c, id!, true), /captain|son of/);
  }
});

test("every face uses the mosaic editor's choices", () => {
  const OPT = {
    sex: ["m", "f"], age: ["young", "grown", "old"], skin: ["olive", "fair", "deep"], hairCol: ["black", "brown", "auburn", "grey", "white"],
    hair: ["curls", "long", "receding", "bald", "bound"], beard: ["none", "short", "full", "long"],
    head: ["none", "wreath", "band", "helmet", "pilos", "veil", "sakkos"], nose: ["straight", "arched", "short"], jaw: ["soft", "firm"],
  } as Record<string, string[]>;
  const { c } = decade(8);
  for (const id of Object.keys(c.people)) {
    const L = lookOf(c, id, 20) as Record<string, unknown>;
    for (const [k, vs] of Object.entries(OPT)) assert.ok(vs.includes(L[k] as string), `${id}: ${k} = ${L[k]}`);
    if (L.sex === "f") assert.equal(L.beard, "none");
  }
});

import { runBotGame, replay, leaderOfCity, councilOf, captainOf, censusPersonName } from "../src/core/index.ts";

test("in a game: island games have the census, citadel games do not, and island games replay with it", () => {
  const citadel = runBotGame(5);
  assert.equal(citadel.census, undefined);
  const a = runBotGame(5, { scenario: "island", bot: "careful" });
  assert.ok(a.census && Object.keys(a.census.people).length > 100);
  const b = replay(5, a.inputs, undefined, { scenario: "island" });
  assert.deepEqual(b.census, a.census);
  assert.ok(leaderOfCity(a, "leontini"));
  assert.ok(councilOf(a, "elders").length >= 2);
  assert.ok(captainOf(a, "carthage"));
  assert.doesNotMatch(censusPersonName(a, leaderOfCity(a, "motya")!, true), /\b[ch]\d+\b|undefined/);
  const lines = a.log.filter((e) => e.actor === "world" && e.visible && / heads the house| died, aged | rises to be /.test(e.text));
  assert.ok(lines.length > 0, "the feed shows some deaths and heirs");
  for (const e of lines) assert.doesNotMatch(e.text + (e.why ?? ""), /\b[ch]\d+\b|undefined|NaN/);
});

test("the families view renders for island games with no code ids or broken values", async () => {
  const { familiesView } = await import("../ui/views/families.ts");
  const { ui } = await import("../ui/lib/text.ts");
  for (const seed of [1, 2, 3, 4, 5]) {
    const s = runBotGame(seed, { scenario: "island", bot: "careful" });
    ui.s = s;
    const text = familiesView(s).replace(/<[^>]*>/g, " ");
    assert.doesNotMatch(text, /\b[ch]\d+\b|\bundefined\b|\bNaN\b|\[object|\bnull\b/, `seed ${seed}`);
    assert.match(text, /Captains hired by Carthage/);
    assert.equal(familiesView(runBotGame(seed)), "", "no census in a citadel game");
  }
});
