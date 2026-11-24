// Switch "exile" (Fallen, not finished; bet B7): off by default; a fall becomes an exile; the ruler acts; the hunt warns
// before it strikes; striking for the city shows its three outcomes; coming home restores you; replays exactly.
import { test } from "node:test";
import assert from "node:assert/strict";
import { startGame, endSeason, act, replay, runBotGame, menu, actionNotes, SWITCHES, logDigest, PLAYER } from "../src/core/index.ts";
import { maybeExile, returnOdds, huntForecast, exileView } from "../src/core/exile.ts";
import { brokenState } from "../scripts/sim-check.ts";
import { startScreen } from "../ui/views/start.ts";

const SW = ["exile", "clues", "partialBlows", "armiesBreak"];
const fallen = (seed = 4) => startGame(seed, "reapWhatYouSow", { scenario: "island", switches: [...SW, "exileStart"] });
const ids = /\b(dionysius|cavalryLeader|demarchusBrother|guardCaptain|hermocratesDaughter|ex[A-Z][a-zA-Z]+|campanians|rhegium)\b/;

test("off by default: no exile state, no exile actions, and a fall still ends the game", () => {
  const s = startGame(1, undefined, { scenario: "island" });
  assert.equal(s.exile, undefined);
  assert.ok(!menu(s).some((m) => /^ex[A-Z]/.test(m.id)));
  s.over = { reason: "deposed", text: "x", season: 0 };
  assert.equal(maybeExile(s), false);
  assert.equal(s.over.reason, "deposed");
});

test("the Workshop switches are hidden on the test link; the exile page ticks one and offers the other", () => {
  assert.ok(SWITCHES.find((w) => w.id === "exile")?.workshop);
  assert.ok(!startScreen(null, 1).includes('value="exile"'));
  (globalThis as any).__WORKSHOP = ["exile"]; (globalThis as any).__WORKSHOP_OFFER = ["exileStart"];
  try {
    const h = startScreen(null, 1);
    assert.match(h, /value="exile" checked/);
    assert.match(h, /value="exileStart">/);
  } finally { delete (globalThis as any).__WORKSHOP; delete (globalThis as any).__WORKSHOP_OFFER; }
  assert.ok(fallen().switches!.includes("exile"), "Begin fallen brings the exile switch with it");
});

test("Begin fallen: you start in exile, with followers, a purse, and only the exile's actions", () => {
  const s = fallen();
  const x = s.exile!;
  assert.ok(x.active);
  assert.equal(x.ruler.id, "cavalryLeader");
  assert.equal(s.people.cavalryLeader.status, "free");
  assert.equal(s.offices.generalship, "cavalryLeader");
  assert.equal(x.at, "campanians");
  assert.ok(x.followers.length >= 1 && x.followers.every((id) => s.people[id].status === "outside" && s.people[id].where === "exile"));
  assert.ok(menu(s).every((m) => /^ex[A-Z]/.test(m.id)) && menu(s).some((m) => m.id === "exStrike"));
  assert.deepEqual(brokenState(s), []);
});

test("striking for the city: the three outcomes add up and are shown before you commit", () => {
  const s = fallen();
  const o = returnOdds(s);
  assert.equal(Math.round((o.win + o.repulse + o.die) * 6), 6);
  assert.ok(actionNotes(s, "exStrike", {}).some((n) => /Killed in the streets/.test(n)));
});

test("coming home: a sure strike gives back the city, the offices and the followers", () => {
  const s = fallen();
  const x = s.exile!;
  x.men = 6; x.arms = true; x.ruler.hold = 0;
  for (const f of ["citizens", "rich", "guard", "family"] as const) { s.factions[f].mood = 3; x.moods[f] = 0; }
  assert.equal(returnOdds(s).win, 1);
  const fol = [...x.followers];
  assert.deepEqual(act(s, "exStrike", {}), { ok: true });
  assert.ok(!s.exile!.active);
  assert.equal(s.exile!.end, "returned");
  assert.equal(s.offices.generalship, PLAYER);
  assert.ok(fol.every((id) => s.people[id].status === "free" && !s.people[id].where));
  assert.ok(!menu(s).some((m) => /^ex[A-Z]/.test(m.id)), "back to the ruler's menu");
  endSeason(s);
  assert.deepEqual(brokenState(s), []);
});

test("a hopeless strike can kill you, and the game ends there", () => {
  for (let seed = 1; seed < 40; seed++) {
    const s = fallen(seed);
    s.exile!.men = 1; s.exile!.ruler.hold = 3;
    if (returnOdds(s).die < 1) continue;
    act(s, "exStrike", {});
    assert.equal(s.over?.reason, "killed");
    assert.equal(s.exile!.end, "killed");
    return;
  }
  assert.fail("no hopeless start found");
});

test("the hunt warns at Whispers, Rumors and Named before it can strike", () => {
  const s = fallen(9);
  const x = s.exile!;
  x.notice = 6; x.hunt = { stage: 1, since: s.season, named: -1 };
  const warned: number[] = [];
  for (let i = 0; i < 6 && !s.over && s.exile!.active; i++) {
    s.exile!.notice = 6;
    const h = s.exile!.hunt;
    if (h) warned.push(h.stage);
    if (huntForecast(s).ready) { assert.ok(warned.includes(1) && warned.includes(2) && warned.includes(3)); break; }
    endSeason(s);
  }
  assert.ok(warned.includes(3), "the hunt reached Named");
  assert.ok(s.log.some((e) => e.kind === "warning" && /^Named: /.test(e.text)));
});

test("a plot's blow becomes an exile when the switch is on", () => {
  const s = startGame(7, "reapWhatYouSow", { scenario: "island", switches: SW });
  s.over = { reason: "exiled", text: "The plotters seize the Island.", season: s.season, by: "theodorus" };
  assert.equal(maybeExile(s), true);
  assert.equal(s.over, undefined);
  assert.equal(s.exile!.ruler.id, "theodorus");
  assert.ok(!Object.values(s.offices).includes(PLAYER));
  endSeason(s);
  assert.ok(s.exile!.active && s.step === "player");
  assert.deepEqual(brokenState(s), []);
});

test("100 bot games with the switch: no crash, no broken state, replays exactly, and exiles end in more than one way", () => {
  const ends = new Set<string>();
  let exiles = 0;
  for (let seed = 1; seed <= 100; seed++) {
    const opts = { scenario: "island" as const, switches: [...SW, ...(seed % 3 === 0 ? ["exileStart"] : [])] };
    const s = runBotGame(seed, { tuning: "reapWhatYouSow", ...opts });
    assert.deepEqual(brokenState(s), [], `seed ${seed}`);
    for (const h of s.exile?.history ?? []) { exiles++; ends.add(h.end ?? "open"); }
    if (seed % 10 === 0) { // the simple bot draws from the game's own dice, so replay a careful bot's game instead
      const c = runBotGame(seed, { bot: "careful", tuning: "reapWhatYouSow", ...opts });
      assert.equal(logDigest(replay(seed, c.inputs, "reapWhatYouSow", opts)), logDigest(c), `seed ${seed} replays`);
    }
    for (const e of s.log) if (e.visible && s.exile && e.season >= s.exile.history[0].from) assert.ok(!ids.test(e.text), `code id in: ${e.text}`);
  }
  assert.ok(exiles > 30, `${exiles} exiles`);
  assert.ok(ends.has("returned") && ends.size >= 2, [...ends].join(", "));
});

test("the exile screens read without code ids", async () => {
  const { exileCol, exileDangers, exileLedger, exileNow } = await import("../ui/views/exile.ts");
  const { ui } = await import("../ui/lib/text.ts");
  const s = fallen();
  ui.s = s;
  const html = [exileCol(s), exileDangers(s), exileLedger(s), exileNow(s)].join("").replace(/data-person="[^"]*"/g, "").replace(/class="[^"]*"/g, "");
  assert.ok(!ids.test(html.replace(/<[^>]+>/g, " ")), "no ids");
  assert.ok(!/undefined|NaN/.test(html));
  assert.ok(exileView(s).agenda.length >= 5);
});
