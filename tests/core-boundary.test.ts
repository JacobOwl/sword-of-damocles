// The rules engine (src/core) stays a pure, UI-free core, so it can run headless today and be ported later
// (docs/architecture.md). These checks keep that true while many threads add rules.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { startGame, endSeason, runBotGame, replay } from "../src/core/index.ts";

const CORE = "src/core";
const files = readdirSync(CORE).filter((f) => f.endsWith(".ts"));
// Strip comments so a note like "the same fields as ui/art/..." doesn't count.
const code = (f: string) => readFileSync(`${CORE}/${f}`, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

test("the core imports only itself and the data files", () => {
  for (const f of files) {
    const specs = [...code(f).matchAll(/(?:from\s+|import\s*\(\s*)["']([^"']+)["']/g)].map((m) => m[1]);
    for (const spec of specs) {
      const ok = /^\.\/[\w-]+\.ts$/.test(spec) || /^\.\.\/\.\.\/data\/[\w-]+\.json$/.test(spec);
      assert.ok(ok, `${CORE}/${f} imports "${spec}": the core may import only ./other-core.ts files and ../../data/*.json`);
    }
  }
});

test("the core uses no browser, Node, clock or outside randomness", () => {
  const banned: [RegExp, string][] = [
    [/\bMath\.random\b/, "Math.random (use the game's seeded stream in rng.ts)"],
    [/\bDate\b/, "Date (game time is the season counter)"],
    [/\bperformance\.now\b/, "performance.now"],
    [/\b(window|document|localStorage|sessionStorage|navigator|globalThis)\b/, "a browser global"],
    [/\b(process|require|Buffer)\b/, "a Node global"],
    [/\b(setTimeout|setInterval|fetch)\b/, "timers or the network"],
  ];
  for (const f of files) {
    const src = code(f);
    for (const [re, what] of banned) assert.ok(!re.test(src), `${CORE}/${f} uses ${what}`);
  }
});

test("a game's state survives a save as JSON and plays on exactly the same", () => {
  for (const scenario of ["citadel", "island"] as const) {
    for (const seed of [3, 11, 27]) {
      const a = startGame(seed, undefined, { scenario });
      for (let i = 0; i < 4 && !a.over; i++) endSeason(a);
      const b = JSON.parse(JSON.stringify(a));
      for (let i = 0; i < 8 && !a.over; i++) { endSeason(a); endSeason(b); }
      assert.equal(JSON.stringify(b), JSON.stringify(a), `${scenario} seed ${seed}`);
    }
  }
});

test("a whole bot game replays from its seed and inputs in both scenarios", () => {
  for (const scenario of ["citadel", "island"] as const) {
    const s = runBotGame(8, { bot: "careful", scenario });
    assert.equal(JSON.stringify(replay(8, s.inputs, undefined, { scenario })), JSON.stringify(s), scenario);
  }
});
