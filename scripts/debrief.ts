// The debrief: what really happened in one game, and three ways it could have gone.
// Usage: npm run debrief -- <save.json> [--out file.md]
//        npm run debrief -- --sweep 100   (the branch check over many seeds; exits non-zero if a branch breaks)
//        add --then <bot> to choose who plays a branch on once your own moves run out (default: careful)
//        npm run debrief -- --seed 7 [--bot careful] [--scenario island] [--switches secrets,council] [--out file.md]
// A save is the seed, options and inputs, as the game's "copy my game" button or the browser's save stores them
// ({ seed, tuning, scenario, switches, inputs }). Safe to rerun: the output depends only on the save and the engine.
// It writes: the hidden rolls (every roll you never saw), and three counterfactual branches, the choices whose
// other answer changed the most, each played on with everything else you did kept the same.
import { readFileSync, writeFileSync } from "node:fs";
import { runBotGame, seasonName } from "../src/core/index.ts";
import { recordOf, play, decisions, rewrite, compare, hiddenRolls, loadAt, type Recorded, type Decision } from "../src/core/fork.ts";

const argv = process.argv.slice(2);
const arg = (k: string) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : undefined; };
// --sweep N: the check behind docs/playtests/2026-11-23-change-the-past.md. For seeds 1 to N (island, careful bot),
// change one answer, and count whether the branch matches its parent up to the split, replays from its own record,
// and how often the ending changes.
if (arg("--sweep")) {
  const N = Number(arg("--sweep"));
  const c = { games: 0, noAnswer: 0, crashes: 0, prefixBroken: 0, replayBroken: 0, endingChanged: 0, fates: 0, skipped: 0 };
  for (let seed = 1; seed <= N; seed++) {
    try {
      const g0 = runBotGame(seed, { bot: "careful", scenario: "island" });
      const r = recordOf(g0);
      const ds = decisions(r).filter((d) => (d.kind === "choose" || d.kind === "unanswered") && d.alternatives.some((a) => !a.blocked));
      if (!ds.length) { c.noAnswer++; continue; }
      const d = ds[seed % ds.length];
      const w = rewrite(r, { decision: d, choice: d.alternatives.find((a) => !a.blocked)!.id }, true, "careful");
      c.games++;
      const before = loadAt(r, d.season);
      if (JSON.stringify(w.game.log.slice(0, before.log.length)) !== JSON.stringify(before.log)) c.prefixBroken++;
      if (JSON.stringify(play(w.record)) !== JSON.stringify(w.game)) c.replayBroken++;
      if (g0.over?.reason !== w.game.over?.reason || g0.over?.season !== w.game.over?.season) c.endingChanged++;
      c.fates += compare(g0, w.game).fates.length;
      c.skipped += w.skipped.length;
    } catch (e) { c.crashes++; console.error(`seed ${seed}: ${(e as Error).message}`); }
  }
  console.log(`${N} seeds, island, careful bot; one answer changed per game, then the bot plays on.`);
  console.log(`Branches: ${c.games} (no answer to change: ${c.noAnswer}). Crashes: ${c.crashes}. Not matching the parent before the split: ${c.prefixBroken}. Not replaying from their own record: ${c.replayBroken}.`);
  console.log(`Ending changed (how or when): ${c.endingChanged} of ${c.games}. Named people whose fate differs: ${(c.fates / Math.max(1, c.games)).toFixed(1)} a branch. Later moves that no longer fit: ${(c.skipped / Math.max(1, c.games)).toFixed(1)} a branch.`);
  process.exit(c.crashes || c.prefixBroken || c.replayBroken ? 1 : 0);
}
let rec: Recorded;
const file = argv.find((a, i) => !a.startsWith("--") && !(i > 0 && argv[i - 1].startsWith("--")));
if (file) {
  const raw = JSON.parse(readFileSync(file, "utf8"));
  const v = raw && typeof raw.game === "object" ? raw.game : raw; // "Copy my game" text, a browser save, or { game: {...} }
  if (typeof v.seed !== "number" || !Array.isArray(v.inputs)) throw new Error("a save needs a seed and a list of inputs");
  rec = { seed: v.seed, tuning: v.tuning, scenario: v.scenario === "island" ? "island" : "citadel", switches: v.switches ?? [], ...(typeof v.preset === "string" ? { preset: v.preset } : {}), inputs: v.inputs };
} else if (arg("--seed")) {
  const sw = arg("--switches");
  rec = recordOf(runBotGame(Number(arg("--seed")), { bot: arg("--bot") ?? "careful", scenario: arg("--scenario") === "citadel" ? "citadel" : "island", switches: sw ? sw.split(",") : [] }));
} else {
  console.error("Usage: npm run debrief -- <save.json> | --seed N [--bot careful] [--scenario island|citadel] [--switches a,b] [--out file.md]");
  process.exit(1);
}

const playOn = arg("--then") ?? "careful"; // who plays on once your own inputs run out
const g = play(rec);
const lines: string[] = [];
const say = (t = "") => lines.push(t);
say(`# Debrief: seed ${rec.seed}, ${rec.scenario === "island" ? "the island" : "the citadel"}`);
say();
say(`Balance: ${rec.tuning ?? "default"}. Rule switches: ${rec.switches?.length ? rec.switches.join(", ") : "none"}. ${rec.inputs.length} inputs over ${g.over ? g.over.season + 1 : g.season} seasons.`);
say();
say(`**How it ended:** ${g.over ? `${g.over.text} (${seasonName(g.over.season)})` : `still playing at ${seasonName(g.season)}`}`);
say();

// ---------- Three other histories ----------
const candidates = decisions(rec).filter((d) => (d.kind === "choose" || d.kind === "unanswered") && d.alternatives.some((a) => !a.blocked));
const scored = candidates.flatMap((d) => d.alternatives.filter((a) => !a.blocked).map((alt) => {
  const w = rewrite(rec, { decision: d, choice: alt.id }, true, playOn);
  const c = compare(g, w.game);
  const endA = g.over ? g.over.season : g.season, endB = w.game.over ? w.game.over.season : w.game.season;
  const score = (g.over?.reason !== w.game.over?.reason ? 10 : 0) + c.fates.length + Math.abs(endA - endB);
  return { d, alt, w, c, score };
}));
// The three that changed the most, from three different seasons where possible.
const picked: typeof scored = [];
for (const x of [...scored].sort((a, b) => b.score - a.score || a.d.index - b.d.index)) {
  if (picked.length >= 3) break;
  if (picked.some((p) => p.d.season === x.d.season) && scored.some((y) => !picked.some((p) => p.d.season === y.d.season) && y.score === x.score)) continue;
  if (picked.some((p) => p.d.index === x.d.index && p.alt.id === x.alt.id)) continue;
  picked.push(x);
}
say(`## Three other histories`);
say();
say(`Each takes one answer you gave, changes it, and plays on with everything else you did kept the same; if your own moves run out first, the ${playOn} bot plays on to the end (${candidates.length} answers could have gone another way; these three changed the most). After the change the dice come in a new order too, so luck is shown for both.`);
picked.sort((a, b) => a.d.index - b.d.index).forEach((x, n) => {
  say();
  say(`### ${n + 1}. ${seasonName(x.d.season)}: ${x.d.label.replace(/: (you chose|left unanswered, so) .*/, "")}`);
  say();
  say(`- **You:** ${x.d.label.replace(/^.*?: /, "")}. **Instead:** “${x.alt.label}”.`);
  if (x.c.split !== null) say(`- **First thing that went differently** (${seasonName(x.c.split)}): yours, "${x.c.splitLine.a ?? "nothing"}"; the other, "${x.c.splitLine.b ?? "nothing"}"`);
  say(`- **Yours ended:** ${x.c.endings.a}`);
  say(`- **The other ended:** ${x.c.endings.b}`);
  say(`- **Government at the end:** ${x.c.government.a} / ${x.c.government.b}`);
  if (x.c.fates.length) say(`- **Fates that differ:** ${x.c.fates.slice(0, 8).map((f) => `${f.name}, ${f.a} / ${f.b}`).join("; ")}${x.c.fates.length > 8 ? `; and ${x.c.fates.length - 8} more` : ""}`);
  say(`- **Your luck after the split:** ${x.c.luck.a.rolls} rolls averaging ${x.c.luck.a.mean} (${x.c.luck.a.failed} failed) / ${x.c.luck.b.rolls} rolls averaging ${x.c.luck.b.mean} (${x.c.luck.b.failed} failed)`);
  if (x.w.skipped.length) say(`- **What you did that no longer fit:** ${x.w.skipped.length} (${x.w.skipped.slice(0, 4).map((k) => `${seasonName(k.season)}, ${k.label}: ${k.why}`).join("; ")}${x.w.skipped.length > 4 ? "; ..." : ""})`);
});
if (!picked.length) say("\nNo answer in this game could have gone another way.");

// ---------- The hidden rolls ----------
const hidden = hiddenRolls(g);
say();
say(`## The rolls you never saw (${hidden.length})`);
say();
say("Every hidden roll in the game, in order: plots growing, men choosing, the world moving. Nothing here is invented; it is the game's own log.");
say();
say("| Season | What | Rolled | Total | Needed | |");
say("|---|---|---|---|---|---|");
for (const h of hidden) say(`| ${h.season} | ${h.text.replace(/\|/g, "/").replace(/: rolled.*$/, "")} | ${h.die} | ${h.total} | ${h.need} | ${h.ok ? "yes" : "no"} |`);

const out = lines.join("\n") + "\n";
const o = arg("--out");
if (o) { writeFileSync(o, out); console.log(`Wrote the debrief to ${o}.`); } else process.stdout.write(out);
