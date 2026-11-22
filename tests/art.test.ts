// The placeholder portraits: one picture per person in data/people.json, no strays, and the looks file matches.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const people = JSON.parse(readFileSync("data/people.json", "utf8"));
const ids: string[] = (Array.isArray(people) ? people : people.people).map((p: { id: string }) => p.id);
const files = readdirSync("ui/art/portraits").filter((f) => f.endsWith(".webp")).map((f) => f.replace(/\.webp$/, ""));

test("every person has a portrait and every portrait has a person", () => {
  assert.deepEqual([...files].sort(), [...ids].sort());
});

test("each portrait is a small WebP picture", () => {
  for (const f of files) {
    const b = readFileSync(`ui/art/portraits/${f}.webp`);
    assert.equal(b.subarray(0, 4).toString("latin1"), "RIFF", f);
    assert.equal(b.subarray(8, 12).toString("latin1"), "WEBP", f);
    assert.ok(b.length < 60_000, `${f} is ${b.length} bytes`);
  }
});

test("the looks file covers the same people and says the looks are invention", () => {
  const looks = JSON.parse(readFileSync("ui/art/portrait-looks.json", "utf8"));
  assert.equal(looks.format, "carthage-mosaic-cast");
  assert.match(looks.note, /invention/);
  assert.deepEqual(looks.people.map((p: { id: string }) => p.id).sort(), [...ids].sort());
});
