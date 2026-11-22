// Content checks for the cast: people, factions and outside powers.
// CLAUDE.md check 3: every record has a kind tag; history records need a source and a card in docs/research/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const load = (p: string) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
const people: any[] = load("data/people.json").people;
const factions: any[] = load("data/factions.json").factions;
const outside: any[] = load("data/outside.json").outside;
const traits = new Set(load("data/traits.json").traits.map((t: any) => t.id));
const offices = new Set(load("data/offices.json").offices.map((o: any) => o.id));
const scars = new Set(load("data/rivals.json").origins.map((o: any) => o.id));
const types = new Set(load("data/rivals.json").politicalTypes.map((t: any) => t.id));
const ids = new Set(people.map((p) => p.id));
const factionIds = new Set(factions.map((f) => f.id));

const AMBITIONS = ["Wealth", "Office", "Safety", "Revenge", "Power"];
const STATUSES = ["free", "held", "outside", "dead"];
const SEASON = /^(autumn|winter|spring|summer)-\d{3}$/;

function checkSourced(where: string, r: any) {
  assert.ok(r.kind === "history" || r.kind === "invention", `${where}: kind must be history or invention`);
  if (r.kind !== "history") return;
  assert.ok(r.source, `${where}: history record needs a source`);
  assert.ok(r.card && existsSync(new URL(`../${r.card}`, import.meta.url)), `${where}: card ${r.card} not found in docs/research/`);
  for (const f of r.facts ?? []) {
    assert.ok(f.text && f.cite && f.quote && f.file, `${where}: each fact needs text, cite, quote and file`);
  }
}

test("people ids are unique", () => {
  assert.equal(ids.size, people.length);
});

test("every person is tagged and sourced", () => {
  for (const p of people) checkSourced(`person ${p.id}`, p);
});

test("every person fits the engine's shape", () => {
  const players = people.filter((p) => p.player);
  assert.equal(players.length, 1, "exactly one player character");
  for (const p of people) {
    const at = `person ${p.id}`;
    assert.ok(p.name && typeof p.name === "string", `${at}: name`);
    assert.ok(p.faction === "ruler" || factionIds.has(p.faction), `${at}: unknown faction ${p.faction}`);
    assert.ok(AMBITIONS.includes(p.ambition), `${at}: ambition ${p.ambition}`);
    assert.ok(STATUSES.includes(p.status ?? "free"), `${at}: status ${p.status}`);
    assert.ok(Array.isArray(p.traits), `${at}: traits`);
    if (p.status !== "dead") assert.equal(p.traits.length, 2, `${at}: two traits`);
    for (const t of p.traits) assert.ok(traits.has(t), `${at}: unknown trait ${t}`);
    assert.ok(Number.isInteger(p.opinion ?? 0) && Math.abs(p.opinion ?? 0) <= 3, `${at}: opinion -3..3`);
    if (p.wants) assert.ok(offices.has(p.wants), `${at}: unknown office ${p.wants}`);
    for (const k of p.kin ?? []) assert.ok(ids.has(k), `${at}: unknown kin ${k}`);
    for (const g of p.grudges ?? []) assert.equal(typeof g, "string", `${at}: grudges are plain strings`);
    if (p.rival) {
      assert.ok(scars.has(p.rival.scar), `${at}: unknown scar ${p.rival.scar}`);
      assert.ok(p.rival.rank >= 1 && p.rival.rank <= 4, `${at}: rival rank 1..4`);
    }
    if (p.politicalType) assert.ok(types.has(p.politicalType), `${at}: unknown political type ${p.politicalType}`);
    if (p.enters) assert.match(p.enters, SEASON, `${at}: enters like "summer-398"`);
  }
});

test("no player-facing text shows a code id", () => {
  for (const p of people) {
    for (const text of [p.name, p.role, ...(p.grudges ?? [])]) {
      assert.doesNotMatch(String(text), /[a-z][A-Z]|\d{4}|_/, `person ${p.id}: "${text}" looks like an id`);
    }
  }
});

test("office holders are people in the cast", () => {
  for (const o of load("data/offices.json").offices) {
    if (o.holder) assert.ok(ids.has(o.holder), `office ${o.id}: unknown holder ${o.holder}`);
  }
});

test("factions and outside powers are tagged and sourced", () => {
  for (const f of factions) checkSourced(`faction ${f.id}`, f);
  for (const o of outside) {
    checkSourced(`outside ${o.id}`, o);
    for (const p of o.people ?? []) for (const f of p.facts ?? []) assert.ok(f.quote && f.cite, `outside ${o.id}/${p.id}: fact needs quote and cite`);
  }
});

test("every faction has a free member at the start to lead it", () => {
  for (const f of factions) {
    assert.ok(people.some((p) => p.faction === f.id && (p.status ?? "free") === "free" && !p.enters), `faction ${f.id} has no leader`);
  }
});
