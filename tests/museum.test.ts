// The story museum (bet B1): the shapes file, the shape finder on made-up logs, the Dionysius bot,
// and that a small museum run writes the same report twice.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { SHAPES_FILE, FIND_TYPES, findShapes } from "../scripts/museum/shapes.ts";
import { startGame, endSeason } from "../src/core/index.ts";
import type { GameState, LogEntry } from "../src/core/index.ts";
import { botRandom, playSeason } from "../src/core/bots.ts";
import { botAnswer } from "../src/core/events.ts";
import { dionysiusBot } from "../src/core/dionysius-bot.ts";
import { brokenState } from "../scripts/sim-check.ts";

test("every story shape is tagged invention, has plain words and a detector that compiles", () => {
  assert.equal(SHAPES_FILE.kind, "invention");
  new RegExp(SHAPES_FILE.turns);
  const ids = new Set<string>();
  for (const sh of SHAPES_FILE.shapes) {
    assert.ok(!ids.has(sh.id), `duplicate shape ${sh.id}`); ids.add(sh.id);
    assert.equal(sh.kind, "invention", sh.id);
    assert.ok(FIND_TYPES.includes(sh.find.type), `${sh.id}: unknown find type ${sh.find.type}`);
    assert.ok(typeof sh.weight === "number" && sh.weight !== 0, sh.id);
    assert.equal(!!sh.dull, sh.weight < 0, `${sh.id}: dull shapes and only dull shapes subtract`);
    assert.ok(!/[a-z][A-Z]|_|\d{3}/.test(`${sh.name} ${sh.line}`), `${sh.id}: no ids in the words players read`);
    for (const st of sh.find.steps ?? []) new RegExp(typeof st === "string" ? st : st.re);
    if (sh.find.match) new RegExp(sh.find.match);
  }
});

// A made-up game: just enough state for the finder.
function fake(entries: [number, string, LogEntry["kind"], string][], over?: GameState["over"]): GameState {
  const person = (id: string, name: string, faction = "rich") => ({ id, name, faction, player: id === "dionysius" } as any);
  return {
    season: 12, over, log: entries.map(([season, actor, kind, text], n) => ({ n, season, actor, kind, text, visible: true, step: "people" })),
    people: { dionysius: person("dionysius", "you", "ruler"), philistus: person("philistus", "Philistus"), leptines: person("leptines", "Leptines", "family"), demarchusBrother: person("demarchusBrother", "the brother of Demarchus"), demarchus: person("demarchus", "Demarchus") },
  } as unknown as GameState;
}
const ids = (s: GameState) => findShapes(s).map((f) => `${f.shape}:${f.who ?? ""}`);

test("the finder reads a friend who turns, and not a friend who stays", () => {
  const turned = fake([[1, "philistus", "event", "Philistus speaks for you among the rich families."], [5, "philistus", "event", "Philistus joins the leader of the exiles at Aetna's plot (a grudge)."]]);
  assert.ok(ids(turned).includes("friendTurned:philistus"));
  const stayed = fake([[1, "philistus", "event", "Philistus speaks for you among the rich families."], [5, "philistus", "event", "Philistus speaks for you among the rich families."]]);
  assert.ok(!ids(stayed).some((x) => x.startsWith("friendTurned")));
  // Too far apart (more than twelve seasons) is not one story.
  const far = fake([[0, "philistus", "event", "Philistus speaks for you among the rich families."], [20, "philistus", "event", "Philistus becomes your rival (Humiliated)."]]);
  assert.ok(!ids(far).some((x) => x.startsWith("friendTurned")));
});

test("the finder gives your deeds to the man they name, the longest name first", () => {
  const s = fake([[1, "dionysius", "event", "You grant the brother of Demarchus's petition."], [4, "demarchusBrother", "event", "The brother of Demarchus starts a plot against you."]]);
  assert.ok(ids(s).includes("friendTurned:demarchusBrother"));
  assert.ok(!ids(s).includes("friendTurned:demarchus"));
});

test("the finder reads kin, warned blows, a town that turns twice, and an unwarned death", () => {
  const kin = fake([[3, "leptines", "event", "Leptines starts a plot against you."]]);
  assert.ok(ids(kin).includes("kinAgainst:leptines"));
  const warned = fake([[2, "world", "warning", "Rumors: doors are shut at night."], [4, "philistus", "event", "The plot fails. Every plotter is named: Philistus."]]);
  assert.ok(ids(warned).includes("warnedSurvived:"));
  const town = fake([[2, "carthage", "event", "Catana goes over to Carthage."], [6, "dionysius", "event", "Catana comes over to you without a blow."]]);
  assert.ok(ids(town).includes("cityTwice:Catana"));
  const blind = fake([[1, "world", "warning", "Whispers: unease."], [9, "philistus", "event", "The plot strikes."]], { reason: "killed", text: "The sword falls.", season: 9, by: "philistus" });
  assert.ok(ids(blind).includes("blowFromNowhere:philistus"));
  assert.ok(!ids(blind).some((x) => x.startsWith("warnedFall")));
});

test("the Dionysius bot plays island games without crashes or broken states, and replays the same", () => {
  const play = (seed: number) => {
    const s = startGame(seed, "reapWhatYouSow", { scenario: "island", switches: ["clues", "partialBlows", "storyChronicle", "armiesBreak"] });
    const r = botRandom(seed);
    let n = 0;
    while (!s.over && n++ < 200) { botAnswer(s); playSeason(s, dionysiusBot, r); endSeason(s); }
    return s;
  };
  for (let seed = 1; seed <= 6; seed++) {
    const s = play(seed);
    assert.deepEqual(brokenState(s), [], `seed ${seed}`);
    assert.ok(s.citadelBuilt || s.over!.season < 6, `seed ${seed}: the Island is fortified first`);
  }
  assert.equal(JSON.stringify(play(3).log), JSON.stringify(play(3).log));
});

test("the Dionysius card quotes what the saved Diodorus says", { skip: !existsSync("../phoenician-punic-world/sources/diodorus/english/book14.loeb.txt") }, () => {
  const card = readFileSync("docs/research/dionysius-bot.md", "utf8");
  const text = ["book14-1-18-97-117.loeb.txt", "book14.loeb.txt"].map((f) => readFileSync(`../phoenician-punic-world/sources/diodorus/english/${f}`, "utf8")).join("\n").replace(/\s+/g, " ");
  const quotes = card.split("\n").filter((l) => l.startsWith("| ")).flatMap((l) => [...l.matchAll(/"([^"]{20,})"/g)].map((m) => m[1]));
  assert.ok(quotes.length >= 12);
  for (const q of quotes) assert.ok(text.includes(q), `not in the saved text: ${q}`);
});

test("a small museum run writes the same report twice, and a gallery with its data", () => {
  const run = () => {
    const out = mkdtempSync(join(tmpdir(), "museum-"));
    execFileSync(process.execPath, ["scripts/museum.ts", "--seeds", "4", "--bots", "careful,tyrant", "--dionysius", "2", "--out", out]);
    return { report: readFileSync(join(out, "report.md"), "utf8"), page: readFileSync(join(out, "museum.html"), "utf8") };
  };
  const a = run(), b = run();
  assert.equal(a.report, b.report);
  assert.equal(a.page, b.page);
  assert.ok(!a.page.includes("/*MUSEUM_DATA*/null"));
  assert.match(a.report, /Crashes: 0\. Broken states: 0\./);
});
