// "What changed": the three to five things from last season that matter most, at the top of the season column,
// so that losing an office or a rival's rise cannot drown among forty lines of news (Jacob's first test: the assembly
// took his generalship and he never noticed). It reads the one action log and changes nothing.
import { DATA, OFFICES, PLAYER, officeName, seasonName } from "../../src/core/index.ts";
import type { GameState, LogEntry } from "../../src/core/index.ts";
import { esc, linkNames } from "../lib/text.ts";

export interface Change { text: string; level: "danger" | "warn" | "good" | "calm"; rank: number }

// Who held an office just before log line n, read back from the log's own office lines.
function holderBefore(g: GameState, office: string, n: number): string | null | undefined {
  const name = officeName(office);
  for (let i = n - 1; i >= 0; i--) {
    const e = g.log[i];
    if (e.kind !== "change" || !e.text.includes(name)) continue;
    if (e.text.startsWith("You hold ")) return PLAYER;
    if (/stands empty/.test(e.text)) return null;
    if (e.text.endsWith(` holds ${name}.`)) return e.actor;
  }
  return undefined; // the starting holder
}
const startHolder = (office: string): string | null => (DATA.offices.find((x: any) => x.id === office) as any)?.holder ?? null;

const RULES: [RegExp, Change["level"], number][] = [
  [/sword falls|blade finds you|plot strikes|seize the Island|takes your place|deposed/i, "danger", 100],
  [/declares war|lands at|besieg/i, "danger", 80],
  [/rises to Pretender|Nemesis/, "danger", 75],
  [/becomes your rival|becomes a political rival|is your rival again|rises to /, "warn", 60],
  [/The government of Syracuse is now/, "warn", 55],
  [/complete The |give up The /, "warn", 50],
  [/is now yours|is now your ally|becomes your ally|goes over to you|surrender|is taken alive|The .+ is finished\./, "good", 45],
  [/is now Carthage's|goes over to Carthage|now pays tribute|is free again|shuts .*gates/, "warn", 45],
  [/make(s)? peace|accepts? peace/i, "good", 40],
  [/sour to Rebellious|become Dominant|fall to the margins/, "warn", 30],
];

export function whatChanged(g: GameState, season: number): Change[] {
  const es = g.log.filter((e) => e.season === season && e.visible && e.kind !== "chronicle" && e.kind !== "roll" && e.kind !== "warning");
  const out: Change[] = [];
  const seen = new Set<string>();
  const add = (c: Change) => { if (!seen.has(c.text)) { seen.add(c.text); out.push(c); } };
  for (const e of es) {
    // Offices changing hands: yours lost is the loudest line of all.
    const o = OFFICES.find((x) => e.kind === "change" && (e.text.endsWith(` holds ${officeName(x)}.`) || e.text.startsWith("You hold ") && e.text.includes(officeName(x))));
    if (o) {
      const before = holderBefore(g, o, e.n) ?? startHolder(o);
      const now = e.text.startsWith("You hold ") ? PLAYER : e.actor;
      if (before === PLAYER && now !== PLAYER) add({ text: `You lost ${officeName(o)}: ${e.text.replace(/ holds .*$/, "")} holds it now${e.why ? ` (${e.why})` : ""}.`, level: "danger", rank: 90 });
      else if (now === PLAYER && before !== PLAYER) add({ text: `You now hold ${officeName(o)}${e.why ? ` (${e.why})` : ""}.`, level: "good", rank: 70 });
      else if (now !== PLAYER) add({ text: e.text, level: "calm", rank: 35 });
      continue;
    }
    if (e.kind === "change" && / is dead\.$/.test(e.text) && g.people[e.actor] && !DATA.people.find((p: any) => p.id === e.actor)?.player) { add({ text: `${e.text.replace(/ is dead\.$/, "")} is dead${e.why ? ` (${e.why})` : ""}.`, level: "warn", rank: 65 }); continue; }
    if (e.kind !== "event" && !/ is now (yours|your ally|Carthage's|held by)| is free again\.| now pays tribute/.test(e.text)) continue;
    const r = RULES.find(([re]) => re.test(e.text));
    if (r) add({ text: e.text.split(/(?<=\.)\s+/)[0], level: r[1], rank: r[2] });
  }
  return out.sort((a, b) => b.rank - a.rank).slice(0, 5);
}

export function changedBlock(g: GameState) {
  if (g.season === 0) return "";
  const prev = g.over ? g.over.season : g.season - 1;
  const xs = whatChanged(g, prev);
  if (!xs.length) return `<div class="changed calm"><span class="label">What changed in ${esc(seasonName(prev))}</span><p class="small">Nothing that shifts the balance of power.</p></div>`;
  return `<div class="changed"><span class="label">What changed in ${esc(seasonName(prev))}</span><ul>${xs.map((x) => `<li class="ch-${x.level}">${linkNames(x.text)}</li>`).join("")}</ul></div>`;
}

// For the "This season" line: an office of yours taken last season.
export function officeLost(g: GameState): string | null {
  if (g.season === 0 || g.over) return null;
  const x = whatChanged(g, g.season - 1).find((c) => c.text.startsWith("You lost "));
  return x ? x.text.replace(/ \(.*\)\.$/, ".") : null;
}
