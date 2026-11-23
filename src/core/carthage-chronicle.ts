// Switch "carthageChronicle" (bet B6, "The other shore"): the decade told from Carthage's side.
// It reads only the log. Each rule in data/carthage-chronicle.json turns one kind of log line into a sentence
// in Carthage's voice, and every sentence keeps the numbers of the log lines it came from, so any line can be
// traced back (tests/carthage-chronicle.test.ts checks this). It draws no dice and writes nothing, so a game
// plays exactly the same with it on or off.
import bookJson from "../../data/carthage-chronicle.json" with { type: "json" };
import { DATA } from "./data.ts";
import { seasonName } from "./state.ts";
import type { GameState, LogEntry } from "./types.ts";

interface RuleDef {
  id: string; kind: string; tone: Tone; match: string; why?: string; actor?: string; hidden?: boolean; per?: "year" | "season";
  say: string[]; source?: string; card?: string; quote?: string; file?: string;
}
interface ClosingDef { id: string; kind: string; needs: string; unlessLater?: string; atEnd?: boolean; say: string }
interface GreekYearDef { id: string; year: number; text: string; source: string }
export type Tone = "turn" | "deed" | "omen" | "house" | "aside";

export interface PunicLine { text: string; from: number[]; tone: Tone; rule: string; kind: string; source?: string }
export interface PunicSeason { season: number; name: string; lines: PunicLine[] }
export interface PunicYear {
  index: number; // 0 for the first year of the game
  heading: string; // "In the time of the suffetes ..."
  suffetes: { names: string[]; from: number[] }; // the log lines the names were read from
  greekYear: string; // "the Greeks' year 405 to 404 BC"
  greek: { text: string; source: string } | null; // what Diodorus says of Carthage that year (history, not the game)
  seasons: PunicSeason[];
}
export interface PunicBook { opening: string; years: PunicYear[]; closing: PunicLine | null; stillWriting: string | null }

const B = bookJson as unknown as {
  opening: string[]; yearHead: { two: string; one: string; none: string; greek: string }; stillWriting: string;
  rules: RuleDef[]; closings: ClosingDef[]; greekYears: GreekYearDef[]; greekSilent: string;
};
export const CARTHAGE_BOOK = B;
type Compiled = RuleDef & { re: RegExp; whyRe?: RegExp; actorRe?: RegExp };
const RULES: Compiled[] = B.rules.map((r) => ({ ...r, re: new RegExp(r.match), whyRe: r.why ? new RegExp(r.why) : undefined, actorRe: r.actor ? new RegExp(r.actor) : undefined }));
const LAST_SEASON = DATA.start.seasons - 1;

// A stable choice with no dice: the same log line always gets the same wording.
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
const pick = <T>(xs: T[], key: string): T => xs[hash(key) % xs.length];

const SMALL = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
export function numberWords(n: number): string {
  if (n < 20) return SMALL[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${SMALL[n % 10]}` : "");
  if (n < 1000) return `${SMALL[Math.floor(n / 100)]} hundred${n % 100 ? ` and ${numberWords(n % 100)}` : ""}`;
  return `${numberWords(Math.floor(n / 1000))} thousand${n % 1000 ? ` ${numberWords(n % 1000)}` : ""}`;
}
// "10,000" -> "ten thousand"; "2,500" -> "two thousand five hundred" is too fussy for a chronicle, so round to thousands.
const thousands = (s: string) => { const n = Number(s.replace(/,/g, "")); return n >= 1000 ? `${numberWords(Math.round(n / 1000))} thousand` : numberWords(n); };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const inList = (x: string) => x.replace(/^The /, "the ");
const and = (xs: string[]) => (xs.length < 2 ? xs[0] ?? "" : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

function fill(template: string, caps: string[], whyCaps: string[], list: string[]): string {
  return template.replace(/\{(list|w?\d+)(?:\|(\w+))?\}/g, (_, key: string, f?: string) => {
    const v = key === "list" ? and(list.map(inList)) : key.startsWith("w") ? whyCaps[Number(key.slice(1))] ?? "" : caps[Number(key)] ?? "";
    if (f === "k") return thousands(v);
    if (f === "n") return numberWords(Number(v));
    if (f === "towns") return Number(v) === 1 ? "town" : "towns";
    if (f === "cap") return cap(v);
    return v;
  });
}

// The seasons whose chronicle is written: the game's own chronicle line closes each season in the log.
function finishedThrough(log: LogEntry[]): number {
  let last = -1;
  for (const e of log) if (e.kind === "chronicle" && e.season > last) last = e.season;
  return last;
}

// Which rule, if any, tells this log line. Hidden lines (things you never saw) are used only where a rule allows
// it: deaths and heirs in Carthage's own houses, and Carthage's own quiet seasons. Your court's secrets stay secret.
export function ruleFor(e: LogEntry): { rule: Compiled; caps: string[]; whyCaps: string[] } | null {
  if (e.kind === "chronicle" || e.kind === "roll") return null;
  for (const r of RULES) {
    if (!e.visible && !r.hidden) continue;
    if (r.actorRe && !r.actorRe.test(e.actor)) continue;
    const m = r.re.exec(e.text);
    if (!m) continue;
    let w: RegExpExecArray | null = null;
    if (r.whyRe) { w = r.whyRe.exec(e.why ?? ""); if (!w) continue; }
    return { rule: r, caps: [...m], whyCaps: w ? [...w] : [] };
  }
  return null;
}

// The suffetes who give the year its name: two men of Carthage's great houses that the log has named by then
// and not yet buried. Real Carthage named its years this way (the Marseille Tariff); who held the office is invention.
const HOUSE_MAN = /([A-Z][a-z]+ son of [A-Z][a-z]+), of Carthage\b/g;
const HOUSE_DEAD = /^([A-Z][a-z]+ son of [A-Z][a-z]+), of Carthage died, aged ([0-9]+)/;
// The office was held for a year: men who have held it least come first, so the names turn over.
function suffetes(log: LogEntry[], year: number, held: Record<string, number> = {}): { names: string[]; from: number[] } {
  const start = year * 4, end = year * 4 + 3;
  const first = new Map<string, number>();
  const out = new Set<string>(); // dead before the year began, or too young to hold office
  for (const e of log) {
    if (e.season > end) break;
    if (e.kind === "chronicle" || / came of age| company/.test(e.text)) continue;
    const d = HOUSE_DEAD.exec(e.text);
    if (d && (e.season < start || Number(d[2]) < 30)) out.add(d[1]);
    for (const m of e.text.matchAll(HOUSE_MAN)) if (!first.has(m[1])) first.set(m[1], e.n);
  }
  const alive = [...first.keys()].filter((x) => !out.has(x))
    .sort((a, b) => (held[a] ?? 0) - (held[b] ?? 0) || hash(`${a}@${year}`) - hash(`${b}@${year}`) || (a < b ? -1 : 1));
  const names = alive.slice(0, 2);
  return { names, from: names.map((x) => first.get(x)!) };
}

export function carthageBook(s: GameState): PunicBook {
  const log = s.log;
  const through = finishedThrough(log);
  const lines: { season: number; line: PunicLine }[] = [];
  const grouped = new Map<string, { season: number; line: PunicLine; list: string[]; tmpl: string; caps: string[]; whyCaps: string[] }>();
  for (const e of log) {
    if (e.season > through) break;
    const hit = ruleFor(e);
    if (!hit) continue;
    const { rule, caps, whyCaps } = hit;
    if (rule.per) {
      const key = `${rule.id}@${rule.per === "year" ? Math.floor(e.season / 4) : e.season}`;
      const g = grouped.get(key);
      if (g) {
        g.line.from.push(e.n);
        if (caps[1] && !g.list.includes(caps[1])) g.list.push(caps[1]);
        continue;
      }
      const line: PunicLine = { text: "", from: [e.n], tone: rule.tone, rule: rule.id, kind: rule.kind, ...(rule.source ? { source: rule.source } : {}) };
      grouped.set(key, { season: e.season, line, list: caps[1] ? [caps[1]] : [], tmpl: pick(rule.say, `${rule.id}:${e.n}`), caps, whyCaps });
      lines.push({ season: e.season, line });
      continue;
    }
    lines.push({ season: e.season, line: { text: fill(pick(rule.say, `${rule.id}:${e.n}`), caps, whyCaps, []), from: [e.n], tone: rule.tone, rule: rule.id, kind: rule.kind, ...(rule.source ? { source: rule.source } : {}) } });
  }
  for (const g of grouped.values()) g.line.text = fill(g.tmpl, g.caps, g.whyCaps, g.list);

  const years: PunicYear[] = [];
  const held: Record<string, number> = {};
  for (let y = 0; y * 4 <= through; y++) {
    const suf = suffetes(log, y, held);
    for (const x of suf.names) held[x] = (held[x] ?? 0) + 1;
    const heading = suf.names.length >= 2 ? fill(B.yearHead.two.replace("{a}", "{1}").replace("{b}", "{2}"), ["", ...suf.names], [], [])
      : suf.names.length === 1 ? B.yearHead.one.replace("{a}", suf.names[0]) : B.yearHead.none;
    const bc = 405 - y;
    const g = B.greekYears.find((x) => x.year === bc);
    const seasons: PunicSeason[] = [];
    for (let q = 0; q < 4; q++) {
      const i = y * 4 + q;
      if (i > through) break;
      const ls = lines.filter((x) => x.season === i).map((x) => x.line);
      if (ls.length) seasons.push({ season: i, name: seasonName(i), lines: ls });
    }
    years.push({ index: y, heading, suffetes: suf, greekYear: B.yearHead.greek.replace("{from}", String(bc)).replace("{to}", String(bc - 1)), greek: g ? { text: g.text, source: g.source } : null, seasons });
  }
  const closing = closingLine(log, through);
  return { opening: B.opening[0], years, closing, stillWriting: closing ? null : B.stillWriting };
}

// How the record ends, from the whole log. The first closing whose line appears wins.
function closingLine(log: LogEntry[], through: number): PunicLine | null {
  const seen = log.filter((e) => e.season <= through && e.kind !== "chronicle" && e.kind !== "roll" && e.visible);
  const atEnd = through >= LAST_SEASON;
  const lastN = log.filter((e) => e.season <= through).at(-1)?.n;
  for (const c of B.closings) {
    if (c.atEnd && !atEnd) continue;
    const re = c.needs ? new RegExp(c.needs) : null;
    const hit = re ? [...seen].reverse().find((e) => re.test(e.text)) : undefined;
    if (re && !hit) continue;
    if (c.unlessLater && hit) {
      const later = new RegExp(c.unlessLater);
      if (seen.some((e) => e.n > hit.n && later.test(e.text))) continue;
    }
    const from = hit ? hit.n : lastN;
    if (from === undefined) return null;
    return { text: c.say, from: [from], tone: "turn", rule: c.id, kind: c.kind };
  }
  return null;
}

// For the UI's footnotes: the log line a sentence came from.
export const logLine = (s: GameState, n: number): LogEntry | undefined => s.log.find((e) => e.n === n);
