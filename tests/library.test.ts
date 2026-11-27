// The art library (assets/library): every catalog entry points at a real file, real art carries only the licences
// the library takes, CC BY items carry their credit line, and drawn SVGs stand alone (no CSS variables, a title).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const LIB = "assets/library";
type Item = { id: string; type: string; origin: string; file: string | null; thumb?: string | null; licence?: string; attribution?: string; attribution_required?: boolean; status?: string };
const catalog: { items: Item[] } = JSON.parse(readFileSync(join(LIB, "catalog.json"), "utf8"));

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
}

test("every catalog entry with a file points at a file that exists, and ids are unique", () => {
  const ids = new Set<string>();
  for (const it of catalog.items) {
    assert.ok(!ids.has(it.id), `duplicate id ${it.id}`);
    ids.add(it.id);
    if (it.file) assert.ok(existsSync(join(LIB, it.file)), `${it.id}: missing ${it.file}`);
    if (it.thumb) assert.ok(existsSync(join(LIB, it.thumb)), `${it.id}: missing thumbnail ${it.thumb}`);
  }
});

test("every drawn file is in the catalog", () => {
  const listed = new Set(catalog.items.map((i) => i.file));
  for (const f of walk(join(LIB, "made"))) {
    const rel = f.slice(LIB.length + 1);
    if (rel === "made/manifest.json") continue;
    assert.ok(listed.has(rel), `${rel} is not in catalog.json (rerun tools/build-catalog.mjs)`);
  }
});

test("real art is public domain, CC0 or CC BY, and CC BY items carry a credit line", () => {
  const real = catalog.items.filter((i) => i.origin === "real");
  assert.ok(real.length > 0);
  for (const it of real) {
    const l = String(it.licence);
    assert.doesNotMatch(l, /BY-SA|share.?alike|\bNC\b|non-?commercial|\bND\b|no-?deriv/i, `${it.id}: ${l}`);
    assert.match(l, /public domain|CC0|CC BY/i, `${it.id}: ${l}`);
    if (/CC BY/.test(l) && !/CC0/.test(l)) {
      assert.equal(it.attribution_required, true, `${it.id} should be marked as needing a credit`);
      assert.ok(it.attribution && it.attribution.length > 10, `${it.id} has no credit line`);
    }
    if (it.status === "copied") assert.ok(it.file, `${it.id} is marked copied but has no file`);
  }
});

test("drawn SVGs stand alone: a title, no CSS variables, no scripts", () => {
  for (const f of walk(join(LIB, "made")).filter((f) => f.endsWith(".svg"))) {
    const s = readFileSync(f, "utf8");
    assert.match(s, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, f);
    if (!f.endsWith("sprite.svg")) assert.match(s, /<title>[^<]+<\/title>/, `${f} has no title`);
    assert.doesNotMatch(s, /var\(--/, `${f} uses a CSS variable, which breaks outside the game`);
    assert.doesNotMatch(s, /<script|\son[a-z]+\s*=/i, `${f} has a script`);
  }
});

test("maps that use Pleiades or OpenStreetMap data say so on the map", () => {
  for (const f of walk(join(LIB, "made", "maps"))) {
    const s = readFileSync(f, "utf8");
    if (/sites|Pleiades/i.test(s) && !/-blank\.svg$/.test(f)) assert.match(s, /Pleiades, CC BY 3\.0/, `${f} lacks the Pleiades credit`);
    if (f.endsWith("syracuse.svg")) assert.match(s, /OpenStreetMap contributors, ODbL/, `${f} lacks the OpenStreetMap credit`);
  }
});
