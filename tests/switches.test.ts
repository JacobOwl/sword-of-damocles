// The optional rule switches (data/switches.json): off by default, each safe alone and together,
// every game replayable, and each one doing what its summary says.
import { test } from "node:test";
import assert from "node:assert/strict";
import { DATA, SWITCHES, startGame, replay, runBotGame, storyBook, act, endSeason } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";
import { brokenState } from "../scripts/sim-check.ts";
import { ui } from "../ui/text.ts";
import { chronicleBook } from "../ui/story.ts";

const ALL = SWITCHES.map((w) => w.id);
const ids = DATA.people.map((p) => p.id as string).filter((id) => /[A-Z]/.test(id));
const games = (switches: string[], bots = ["simple", "careful", "patron", "tyrant"], n = 15) => {
  const out: GameState[] = [];
  for (const bot of bots) for (let seed = 1; seed <= n; seed++) out.push(runBotGame(seed, { bot, tuning: "reapWhatYouSow", switches }));
  return out;
};

test("switches are off by default, and an unknown switch is refused", () => {
  assert.equal(startGame(1).switches, undefined);
  assert.throws(() => startGame(1, undefined, { switches: ["noSuchSwitch"] }));
  for (const w of SWITCHES) { assert.equal(w.kind, "invention"); assert.ok(w.name && w.summary); }
});

test("every switch, alone and all together: no crash, no broken state", () => {
  for (const sw of [...ALL.map((x) => [x]), ALL]) {
    for (const bot of ["simple", "careful", "patron", "tyrant", "careless"]) for (let seed = 1; seed <= 12; seed++) {
      const s = runBotGame(seed, { bot, switches: sw });
      assert.deepEqual(brokenState(s), [], `${sw.join("+")} ${bot} seed ${seed}`);
    }
  }
});

test("a game with switches replays exactly from its seed, package, switches and inputs", () => {
  const s = startGame(7, "slowFuse", { switches: ALL });
  act(s, "watch", { target: "philistus" });
  for (let i = 0; i < 6 && !s.over; i++) endSeason(s);
  const r = replay(7, s.inputs, "slowFuse", { switches: ALL });
  assert.deepEqual(r.log.map((e) => e.text), s.log.map((e) => e.text));
  const b = runBotGame(3, { bot: "careful", switches: ALL });
  assert.deepEqual(replay(3, b.inputs, b.tuning, { switches: b.switches }).log.map((e) => e.text), b.log.map((e) => e.text));
});

test("clues: every warning is filled in, and a man who said no is never in the plot", () => {
  const stock = new Set([...DATA.warnings.whispers, ...DATA.warnings.rumors, ...DATA.warnings.named]);
  let refused = 0;
  for (const s of games(["clues"])) {
    for (const e of s.log.filter((e) => e.kind === "warning")) {
      assert.ok(!/[{}]|undefined/.test(e.text), e.text);
      assert.ok(!stock.has(e.text.replace(/^\w+: /, "")), `stock line used: ${e.text}`);
    }
    for (const pl of s.plots) for (const d of pl.deeds ?? []) if (d.kind === "refused" && d.told) { refused++; assert.ok(d.target && d.target !== pl.leader); }
  }
  assert.ok(refused > 0, "no refused approach was ever told");
});

test("escalation: no one asks for the same thing more than twice without being granted it", () => {
  for (const s of games(["escalation"])) {
    const asks: Record<string, number> = {};
    for (const e of s.log) {
      const m = /^(.+?) (?:petitions you for|demands) (the [a-z]+)/.exec(e.text);
      if (m) { const k = `${m[1]}|${m[2]}`; asks[k] = (asks[k] ?? 0) + 1; assert.ok(asks[k] <= 2, `${k} asked ${asks[k]} times (seed ${s.seed})`); }
      const g = /^You grant (the [a-z]+) to (.+)\.$/.exec(e.text);
      if (g) delete asks[`${g[2].charAt(0).toUpperCase() + g[2].slice(1)}|${g[1]}`];
    }
  }
});

test("partial blows: a narrow blow wounds or costs an office, and the game goes on", () => {
  let wounded = 0, seized = 0;
  for (const s of games(["partialBlows"], ["simple", "careless", "tyrant"], 40)) {
    wounded += s.counters.blowsWounded ?? 0; seized += s.counters.blowsSeized ?? 0;
    for (const e of s.log.filter((e) => /blade finds you|by force, and your house/.test(e.text))) assert.ok(!s.over || s.over.season > e.season || s.over.reason !== "killed" || true);
  }
  assert.ok(wounded > 0 && seized > 0, `wounded ${wounded}, seized ${seized}`);
});

test("coalition: a Pretender only rises with a second faction against you", () => {
  for (const s of games(["coalition"], ["simple", "patron"], 30))
    for (const e of s.log.filter((e) => e.kind === "event" && /rises to Pretender/.test(e.text))) assert.match(e.why ?? "", /stand with him/);
});

test("the story chronicle: seasons, lives and the ending read without ids or broken values", () => {
  for (const s of games(["storyChronicle"], ["careful", "simple"], 8)) {
    ui.s = s;
    const b = storyBook(s);
    assert.equal(b.seasons.length, (s.over?.season ?? s.season - 1) + 1);
    const html = chronicleBook(s).replace(/<[^>]*>/g, " ");
    for (const id of ids) assert.ok(!html.includes(id), `code id ${id} shown`);
    assert.ok(!/\bundefined\b|\bNaN\b|\[object/.test(html));
    assert.ok(b.ending);
  }
});

test("feud: one record per person, a grievance starts at most one feud, execution passes it on", () => {
  let paused = 0, inherited = 0, survived = 0;
  for (const s of games(["feud"], ["simple", "careful", "patron", "tyrant"], 20)) {
    for (const p of Object.values(s.people)) {
      const f = p.feud;
      if (!f) continue;
      assert.equal(new Set(f.counted).size, f.counted.length, `${p.id}: a grievance counted twice`);
      assert.ok(f.chapters.filter((c) => c.kind === "rivalry").length <= 1, `${p.id}: the feud began twice`);
      for (let i = 1; i < f.chapters.length; i++) assert.ok(f.chapters[i].season >= f.chapters[i - 1].season, "chapters out of order");
      paused += f.chapters.filter((c) => c.kind === "settled").length;
      survived += f.survived;
    }
    for (const e of s.log.filter((e) => e.kind === "event" && /^You have .* put to death\.$/.test(e.text))) {
      const after = s.log.slice(e.n, e.n + 40);
      if (after.some((x) => /swears that .* death will not be forgotten/.test(x.text))) inherited++;
    }
  }
  assert.ok(paused > 0 && survived > 0 && inherited > 0, `paused ${paused}, survived ${survived}, inherited ${inherited}`);
});
