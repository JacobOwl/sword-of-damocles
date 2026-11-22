// Writes conformance replays: whole games as a seed, options and the player's inputs, plus what must come out.
// A port of the rules (Godot, see docs/architecture.md) replays each case and must produce the same log, die by die.
// Usage: npm run replays [-- --out dist/replays.json --games 10]
// Safe to rerun: the output depends only on the engine and data/ at this commit.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { createHash } from "node:crypto";
import { runBotGame, BOTS } from "../src/core/index.ts";

const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const out = arg("--out", "dist/replays.json");
const games = Number(arg("--games", "10"));
const sha = (t: string) => createHash("sha256").update(t).digest("hex");

const cases = [];
for (const scenario of ["citadel", "island"] as const) {
  for (let i = 0; i < games; i++) {
    const seed = 1000 + i;
    const bot = BOTS[i % BOTS.length].id; // the named bots' moves are ordinary inputs, so they replay
    const s = runBotGame(seed, { bot, scenario });
    const log = s.log.map((e) => ({ season: e.season, step: e.step, actor: e.actor, kind: e.kind, text: e.text, ...(e.roll ? { die: e.roll.die, total: e.roll.total, ok: e.roll.ok } : {}) }));
    cases.push({
      seed, scenario, tuning: s.tuning, switches: s.switches ?? [], inputs: s.inputs,
      expect: { over: s.over, seasons: s.season, logLength: log.length, logSha256: sha(JSON.stringify(log)), log },
    });
  }
}
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ format: 1, note: "Replay each case from seed, scenario, tuning, switches and inputs; the log must match.", cases }, null, 1) + "\n");
console.log(`Wrote ${cases.length} replays to ${out}.`);
