// The ten-season story read: plays seeds of a preset with a headless player for N seasons and writes, for each seed,
// the turning points (beats) and the chronicle as the player would read it, so a person can judge "would retell" or "flat".
//   npm run story-sweep -- --seeds 20 [--from 1] [--bot careful] [--preset firstIslandTest] [--seasons 10] [--out docs/playtests/ten-seasons]
// Safe to rerun: the files depend only on the code, the data and the options. It judges nothing itself; it counts.
import { mkdirSync, writeFileSync } from "node:fs";
import { runBotGame, presetOpts, storyBook, seasonName } from "../src/core/index.ts";
import type { GameState, LogEntry } from "../src/core/index.ts";

const argv = process.argv;
const opt = (k: string, d: string) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
const N = Number(opt("--seeds", "20")), FROM = Number(opt("--from", "1")), SEASONS = Number(opt("--seasons", "10"));
const BOT = opt("--bot", "careful"), PRESET = opt("--preset", "firstIslandTest"), OUT = opt("--out", "docs/playtests/ten-seasons");
const EXTRA = opt("--switches", "").split(",").filter(Boolean);

// What counts as a beat: something a player would mention when retelling. Each kind is counted separately.
export const BEATS: [string, RegExp][] = [
  ["plot", /plot strikes|plot fails|blade finds you|wounds you|is in a plot against you|starts a plot|takes over the plot/],
  ["warning", /^Named: /],
  ["enemy", /becomes your rival|is your rival again|Nemesis|old feud with you comes due/],
  ["rival", /becomes a political rival|Pretender|takes your place/],
  ["death", /is dead|put to death|dies\b|died, aged|is killed/],
  ["arrest", /Your guards take|flees the city|goes into exile/],
  ["map", /goes over to you|opens its gates|takes .* by storm|is yours|lays siege|siege of|battle|army is broken|lands at|declares war|makes peace|becomes your ally|sacks|plunder/i],
  ["carthage", /Carthage's council turns to a new goal|Carthage declares|plague is in Carthage|Libyans rise/i],
];
const beatKind = (e: LogEntry) => BEATS.find(([, re]) => re.test(e.text))?.[0];
const name = (s: GameState) => `seed ${s.seed}`;

function read(seed: number) {
  const o = presetOpts(PRESET);
  const s = runBotGame(seed, { bot: BOT, ...o, switches: [...(o.switches ?? []), ...EXTRA], seasons: SEASONS });
  const beats: { season: number; kind: string; text: string }[] = [];
  for (const e of s.log) {
    if (!e.visible || e.kind === "chronicle" || e.kind === "roll") continue;
    const k = beatKind(e);
    if (k && !beats.some((b) => b.text === e.text)) beats.push({ season: e.season, kind: k, text: e.text.replace(/^(Named): /, "") });
  }
  const count: Record<string, number> = {};
  for (const b of beats) count[b.kind] = (count[b.kind] ?? 0) + 1;
  const book = storyBook(s, s.over ? s.over.season : s.season - 1);
  return { s, beats, count, book };
}

mkdirSync(OUT, { recursive: true });
const rows: string[] = [];
for (let seed = FROM; seed < FROM + N; seed++) {
  const { s, beats, count, book } = read(seed);
  const md = [
    `# Ten seasons, ${name(s)} (${PRESET}, ${BOT} bot${EXTRA.length ? `, plus ${EXTRA.join(", ")}` : ""})`, "",
    `Ended: ${s.over ? `${s.over.reason}, ${seasonName(s.over.season)}` : `still ruling after ${SEASONS} seasons`}.`,
    `Beats: ${BEATS.map(([k]) => `${k} ${count[k] ?? 0}`).join(", ")}.`, "",
    "## Turning points", "", ...beats.map((b) => `- ${seasonName(b.season)} (${b.kind}): ${b.text}`), "",
    "## The chronicle as the player reads it", "",
    ...book.seasons.flatMap((x) => [`### ${x.name}`, "", ...x.paragraphs, ...(x.omens.length ? [`*${x.omens.join(" ")}*`] : []), ""]),
    ...(book.lives.length ? ["## Lives", "", ...book.lives.map((l) => `**${l.name}.** ${l.text}`), ""] : []),
  ].join("\n");
  writeFileSync(`${OUT}/seed-${String(seed).padStart(3, "0")}.md`, md.replace(/\n{3,}/g, "\n\n"));
  rows.push(`| ${seed} | ${s.over ? s.over.reason : "ruling"} | ${BEATS.map(([k]) => count[k] ?? 0).join(" | ")} |`);
}
console.log(`| Seed | End | ${BEATS.map(([k]) => k).join(" | ")} |\n|---|---|${BEATS.map(() => "---").join("|")}|\n${rows.join("\n")}`);
console.log(`\nWrote ${N} files to ${OUT}/.`);
