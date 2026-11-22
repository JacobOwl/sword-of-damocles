// The art pass (docs/art-direction.md): every event names a picture that exists, every faction, office and action
// area has an icon, the flavour lines cover every season, and picking them never touches the game's dice.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DATA, runBotGame } from "../src/core/index.ts";
import { AREA_ICON, FACTION_ICON, ICON_NAMES, OFFICE_ICON, iconBody } from "../ui/icons.ts";
import { VIGNETTES, vignette } from "../ui/vignettes.ts";
import { FLAVOR, knownDanger, seasonLine, swordOverhead } from "../ui/ambient.ts";
import { ui } from "../ui/text.ts";

const events = JSON.parse(readFileSync("data/events.json", "utf8")).events as { id: string; art?: string }[];

test("every event has a picture, and every picture is used", () => {
  for (const e of events) assert.ok(e.art && VIGNETTES[e.art], `${e.id} has no picture (art: ${e.art})`);
  const used = new Set(events.map((e) => e.art));
  for (const v of Object.keys(VIGNETTES)) assert.ok(used.has(v), `picture ${v} is never used`);
  assert.match(vignette("ship") + "", /^$/); // an unknown picture draws nothing
  assert.match(vignette("feast"), /<svg class="tondo"/);
});

test("every faction, office and action area has an icon that exists", () => {
  for (const f of DATA.factions) assert.ok(iconBody(FACTION_ICON[f.id]), `faction ${f.id}`);
  for (const o of DATA.offices) assert.ok(iconBody(OFFICE_ICON[o.id]), `office ${o.id}`);
  for (const a of DATA.areas) assert.ok(iconBody(AREA_ICON[a]), `area ${a}`);
  for (const n of ICON_NAMES) assert.ok(iconBody(n).includes("<"), `icon ${n} is empty`);
});

test("flavour lines cover every season and every condition, with no code ids", () => {
  for (const s of ["Autumn", "Winter", "Spring", "Summer"]) assert.ok(FLAVOR.seasons.some((l) => l.season === s), s);
  for (const c of ["grainLow", "carthageNear", "plotNamed", "plotKnown", "guardUnpaid", "tyranny", "quiet"]) assert.ok(FLAVOR.seasons.some((l) => l.if === c), c);
  for (const l of [...FLAVOR.seasons, ...FLAVOR.chronicle]) assert.ok(!/[a-z][A-Z]|\{|\}/.test(l.text), `${l.id}: ${l.text}`);
});

test("season lines and the sword read the state without changing it", () => {
  for (let seed = 1; seed <= 10; seed++) {
    const s = runBotGame(seed);
    ui.s = s;
    const before = JSON.stringify(s);
    for (let i = 0; i <= s.season; i++) assert.ok(seasonLine(s, i).length > 10);
    swordOverhead(s);
    assert.equal(JSON.stringify(s), before, `seed ${seed}: the state changed`);
    const d = knownDanger(s);
    assert.ok(d.stage >= 0 && d.stage <= 3);
  }
});

test("the island map kit draws every side, walls, forts, sieges and armies", async () => {
  const A = await import("../ui/island-art.ts");
  const base = A.islandBase();
  assert.match(base, /class="coast"/);
  assert.match(base, /class="river"/);
  for (const side of ["syracuse", "ally", "free", "tributary", "carthage", "exiles"]) {
    assert.ok(A.SIDE_COLOR[side], side);
    const m = A.cityMark(10, 10, { name: "Gela", side, walled: side !== "free", besieged: side === "carthage" });
    assert.match(m, /Gela/);
  }
  assert.match(A.cityMark(0, 0, { name: "Aetna", side: "exiles", fort: true }), /palisade/);
  assert.match(A.armyMark(0, 0, { side: "carthage", men: "60k" }), /60k/);
  assert.match(A.routePath([0, 0], [10, 10], "road", 3), />3</);
});
