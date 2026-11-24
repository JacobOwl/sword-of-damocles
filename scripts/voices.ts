// Fills in the footnotes of the voices sample (bet B6, paper only): docs/playtests/voices/source.md has [[n]] markers,
// each the number of a log line in a replayed bot game; this writes docs/playtests/2026-11-23-voices.md with each
// marker turned into a footnote quoting that line and its season. Safe to rerun: the same source gives the same file.
//   node scripts/voices.ts
import { readFileSync, writeFileSync } from "node:fs";
import { runBotGame, seasonName } from "../src/core/index.ts";
import type { GameState } from "../src/core/index.ts";

const src = readFileSync("docs/playtests/voices/source.md", "utf8");
const out: string[] = [];
let game: GameState | null = null, label = "", notes: string[] = [], k = 0;
const flush = () => { if (notes.length) out.push("", ...notes, ""); notes = []; };
for (const line of src.split("\n")) {
  const g = /<!-- game: (\d+) (\w+) -->/.exec(line);
  if (g) {
    flush();
    game = runBotGame(Number(g[1]), { bot: g[2], tuning: "standard", switches: [], scenario: "island" });
    label = `g${g[1]}`; k = 0;
    out.push(line.replace(g[0], "").trimEnd(), "", `*Seed ${g[1]}, the ${g[2]} bot. The game ended: ${game.over?.text ?? "still running"}*`);
    continue;
  }
  if (/^## /.test(line) && !g) flush();
  if (/^### /.test(line)) { flush(); k = 0; label = label.replace(/-.*$/, "") + `-${line.includes("Timaeus") ? "t" : "p"}`; }
  out.push(line.replace(/\[\[(\d+)\]\]/g, (_, n: string) => {
    if (!game) throw new Error("a footnote before any game");
    const e = game.log.find((x) => x.n === Number(n));
    if (!e) throw new Error(`no log line ${n} in ${label}`);
    k++;
    notes.push(`[^${label}-${k}]: ${seasonName(e.season)}: “${e.text}”${e.why ? ` (why: ${e.why})` : ""}`);
    return `[^${label}-${k}]`;
  }));
}
flush();
writeFileSync("docs/playtests/2026-11-23-voices.md", out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n");
console.log("Wrote docs/playtests/2026-11-23-voices.md");
