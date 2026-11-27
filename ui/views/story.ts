// The season's events and the chronicle, written for reading. Both come straight from the one action log.
import { PLAYER, openEvents, seasonName, storyBook, switchOn } from "../../src/core/index.ts";
import type { GameState, LogEntry } from "../../src/core/index.ts";
import { esc, linkNames, rollLine, ui } from "../lib/text.ts";
import { chronicleLine, colophon, diodorusYear } from "../components/ambient.ts";

// Reasons that only repeat the action's own name add nothing ("Host a feast" after "You host a feast").
const ECHO = /^(Host|Grant|Revoke|Arrange|Petition|Bribe|Pardon|Imprison|Execute|Exile|Hand|Give|Propose|Seize|Strike|Build|Pay|Hire|Disarm|Raid|March|Watch|Plant|Turn|Force|Block|Expose|Envoy|Buy|Offer|Refuse)/;
const QUIET = /^(Your watchers learn nothing|.* keeps (his|her) head down|.* does nothing this season)/;

// Agenda steps read as deeds, not as game terms:
// "The citizens complete a step of The people's assembly: Build a following." becomes
// "The citizens build a following, a step toward the people's assembly."
export function plain(text: string) {
  return text.replace(/^(.+?) complete a step of (.+?): (.+?)\.$/, (_m, who: string, ag: string, step: string) =>
    `${who} ${step.charAt(0).toLowerCase()}${step.slice(1)}, a step toward ${ag.replace(/^The /, "the ")}.`);
}

// The chronicle tells, it doesn't show dice: "The plot strikes. Rolled 2 +8 ... It must beat your defense." keeps only "The plot strikes."
function told(text: string) {
  return plain(text)
    .replace(/\s*Rolled \d[^]*?(It must beat your defense\.|needs \d+\.)/, "")
    .replace(/^(.+?) complete (The .+?)\.(\s|$)/, (_m, who: string, ag: string, sp: string) => `${who} achieve their aim: ${ag.replace(/^The /, "the ")}.${sp}`);
}

const STEPS: [LogEntry["step"], string][] = [
  ["world", "The world turns"], ["people", "The people act"], ["factions", "The factions act"],
  ["player", "Your actions"], ["power", "Power changes hands"], ["sword", "The sword"],
];

function line(e: LogEntry) {
  const cls = ["e", e.kind, e.actor === PLAYER && e.kind === "event" ? "you" : "", e.visible ? "" : "hidden", e.n >= ui.lastSeen ? "new" : ""].join(" ");
  if (e.kind === "roll") return `<div class="${cls}">${rollLine(e)}${e.visible ? "" : ` <span class="tag">hidden</span>`}</div>`;
  const text = e.kind === "warning" ? e.text.replace(/^(Whispers|Rumors|Named): /, (_m, st: string) => `${st}. `) : plain(e.text);
  const why = e.why && e.kind !== "warning" && !ECHO.test(e.why) ? ` <span class="why">${esc(e.why)}</span>` : "";
  return `<div class="${cls}">${linkNames(text)}${why}${e.visible ? "" : ` <span class="tag">hidden</span>`}</div>`;
}

// Changes (opinion, mood, power, offices, stores) as one short list, so you can see what moved and why.
type Shift = { up: boolean | null; text: string; why: string; hidden: boolean };
function shifts(es: LogEntry[]): { people: Shift[]; stores: Shift[] } {
  const people: Shift[] = [];
  const stores: Shift[] = [];
  for (const e of es) {
    if (e.kind !== "change") continue;
    const up = /rises|warm|\+\d|lets go|is free/.test(e.text) ? true : /falls|sour|-\d|grudge|is dead|held|outside/.test(e.text) ? false : null;
    const sh = { up, text: e.text, why: e.why ?? "", hidden: !e.visible };
    if (/^(Silver|Grain|Land|Guard|The Carthage clock)/.test(e.text)) stores.push(sh); else people.push(sh);
  }
  return { people, stores };
}
// Eight near-identical harvest lines ("Messana's grain +4 months (now 10).") read as one.
function collapse(list: Shift[]): Shift[] {
  const town = /^(.+?)'s grain ([+-]\d+) months? \(now \d+\)\.$/;
  const groups = new Map<string, Shift[]>();
  for (const x of list) { const m = town.exec(x.text); if (m && !x.hidden) { const k = `${m[2]}|${x.why}`; groups.set(k, [...(groups.get(k) ?? []), x]); } }
  const out: Shift[] = [];
  const done = new Set<string>();
  for (const x of list) {
    const m = town.exec(x.text);
    const k = m && !x.hidden ? `${m[2]}|${x.why}` : "";
    if (!k || (groups.get(k)?.length ?? 0) < 3) { out.push(x); continue; }
    if (done.has(k)) continue;
    done.add(k);
    const g = groups.get(k)!;
    const names = g.map((y) => town.exec(y.text)![1]);
    out.push({ up: x.up, text: `Grain ${m![2]} months in ${names.length} towns (${names.join(", ")}).`, why: x.why, hidden: false });
  }
  return out;
}
function shiftList(list: Shift[]) {
  list = collapse(list);
  return list.map((x) => `<li class="${x.hidden ? "hidden" : ""}"><span class="arrow ${x.up === true ? "good" : x.up === false ? "warn" : "muted"}">${x.up === true ? "▲" : x.up === false ? "▼" : "•"}</span> ${linkNames(x.text)}${x.why ? ` <span class="why">${esc(x.why)}</span>` : ""}</li>`).join("");
}

export function seasonFeed(s: GameState, season: number, steps = STEPS.map((x) => x[0])) {
  const es = s.log.filter((e) => e.season === season && e.kind !== "chronicle" && (ui.designer || e.visible) && steps.includes(e.step));
  // Say each thing once: a matter still waiting for your answer is shown under "Matters before you", not here too;
  // dice lines go to Designer view (the sentence beside them already says what happened).
  const open = s.over ? [] : openEvents(s).map((ev) => ev.text.slice(0, 60));
  const shown = (e: LogEntry) => (ui.designer || e.kind !== "roll") && !(e.kind === "event" && open.some((t) => e.text.startsWith(t)));
  const groups = STEPS.filter(([k]) => steps.includes(k)).map(([k, t]) => {
    const evs = es.filter((e) => e.step === k && e.kind !== "change" && shown(e));
    if (!evs.length) return "";
    return `<div class="feedgroup"><span class="label">${t}</span><div class="feed">${evs.map(line).join("")}</div></div>`;
  }).join("");
  const sh = shifts(es);
  const shiftHtml = sh.people.length || sh.stores.length ? `<details class="shifts" open><summary class="label">What shifted (${sh.people.length + sh.stores.length})</summary>
    <ul>${shiftList(sh.people)}${shiftList(sh.stores)}</ul></details>` : "";
  return { groups, shifts: shiftHtml, empty: !groups && !shiftHtml };
}

// ---------- The chronicle ----------
const TURNING = /becomes your rival|Nemesis|is dead|executed|strikes|plot fails|Tyranny|government|enters the story|Dominant|fall to the margins|besieges|thrown back|deposed|seize the Island|sword falls|Pretender/i;

function chronicleSeason(s: GameState, season: number) {
  const es = s.log.filter((e) => e.season === season && e.visible && (e.kind === "event" || e.kind === "warning") && !QUIET.test(e.text));
  const omens = es.filter((e) => e.kind === "warning").map((e) => e.text.replace(/^(Whispers|Rumors|Named): /, ""));
  // One paragraph for the city, one for your deeds, one for what followed.
  const para = (steps: LogEntry["step"][]) => es.filter((e) => e.kind === "event" && steps.includes(e.step))
    .map((e) => { const t = linkNames(told(e.text)); return TURNING.test(e.text) ? `<strong>${t}</strong>` : t; }).join(" ");
  const parts = [para(["world", "people", "factions"]), para(["player"]), para(["power", "sword"])].filter(Boolean);
  const body = parts.length ? parts.map((x) => `<p>${x}</p>`).join("") : "<p>A quiet season.</p>";
  return `<div class="cseason"><h4>${esc(seasonName(season))}</h4>${body}${omens.length ? `<p class="omens">${omens.map(linkNames).join(" ")}</p>` : ""}</div>`;
}

export function chronicleBook(s: GameState) {
  const last = s.over ? s.over.season : s.season - 1;
  if (last < 0) return `<article class="book"><h2>The chronicle</h2><p class="muted">The chronicle begins when the first season ends.</p></article>`;
  if (switchOn(s, "storyChronicle")) return storyChronicleBook(s);
  const years: string[] = [];
  for (let y = 0; y * 4 <= last; y++) {
    const seasons: string[] = [];
    for (let q = 0; q < 4; q++) { const i = y * 4 + q; if (i <= last) seasons.push(chronicleSeason(s, i)); }
    const dy = diodorusYear(405 - y);
    years.push(`<section class="cyear"><h3>Year ${y + 1} <span class="muted">${405 - y} to ${404 - y} BC</span></h3>${dy ? `<p class="cdiod">${esc(dy.text)} <span class="cite">(${esc(dy.cite)})</span></p>` : ""}${seasons.join("")}</section>`);
  }
  return `<article class="book"><h2>The chronicle</h2><p class="opening">${esc(chronicleLine("opening"))}</p><div class="meander" aria-hidden="true"></div>
    <p class="small muted">Everything here is what you saw happen, in order. Turning points are in bold; omens and warnings in italics.</p>${years.join("")}
    ${s.over ? `<span class="fleuron" aria-hidden="true"></span><p class="colophon">${esc(colophon(s))}</p>` : ""}</article>`;
}

// The last season, short, for the season column.
export function lastSeasonSummary(s: GameState) {
  if (s.season === 0) return "";
  const prev = s.season - 1;
  const f = seasonFeed(s, prev, ["player", "power", "sword"]);
  if (f.empty) return "";
  return `<details class="last"><summary><span class="label">How ${esc(seasonName(prev))} ended</span></summary>${f.groups}${f.shifts}</details>`;
}

// The rule switch "Chronicle as story": each season told by who it was about, then each person's thread.
const sentences = (text: string) => text.split(/(?<=\.)\s+(?=[A-Z])/).map((x) => told(x)).join(" ");
// The chronicle cut to its arcs (second test: "WAY too long we gotta shorten that down to the important stuff and good
// story arcs", about 7,100 words). Up top: how it ended and the main threads. Then each year in a few lines, only its
// turning points; the whole season stays folded underneath for whoever wants it. Same storyBook, nothing invented.
const KEY = /becomes your rival|Nemesis|is dead|executed|put to death|plot strikes|plot fails|Tyranny|Pretender|seize the Island|sword falls|takes your place|declares war|makes peace|peace with|is destroyed|is now yours|is now Carthage's|now pays tribute|is now your ally|marries|citadel is built|You build|complete The|achieve their aim|lands in Sicily|flee|exile|comes home|takes .* from you|loses .* to|you lost|wins the vote|elected/i;
const CONNECTIVE = /^(Meanwhile|In the same season|Elsewhere|At court), (\w)/;
const unlink = (x: string) => x.replace(CONNECTIVE, (_m, _c, l: string) => l.toUpperCase());
const keyLines = (p: string) => p.split(/(?<=\.)\s+(?=[A-Z])/).filter((x) => KEY.test(x) && !/\(the \w+ time\)|^Again, |at it again|^The assembly votes on/.test(x)).map((x) => told(unlink(x)));
function storyChronicleBook(s: GameState) {
  const b = storyBook(s);
  const years: string[] = [];
  for (let y = 0; y * 4 < b.seasons.length; y++) {
    const ss = b.seasons.slice(y * 4, y * 4 + 4);
    const key = ss.flatMap((x) => keyLines(x.paragraphs.join(" ")).map((t) => ({ name: x.name, t })));
    const seen = new Set<string>();
    const brief = key.filter((k) => !seen.has(k.t) && seen.add(k.t)).slice(0, 6);
    const full = ss.map((x) => `<div class="cseason"><h4>${esc(x.name)}</h4>${x.paragraphs.map((p) => {
      const t = linkNames(sentences(p));
      return `<p>${TURNING.test(p) ? `<strong>${t}</strong>` : t}</p>`;
    }).join("")}${x.omens.length ? `<p class="omens">${x.omens.map(linkNames).join(" ")}</p>` : ""}</div>`).join("");
    const lines = brief.length ? `<ul class="cbrief">${brief.map((k) => `<li><span class="muted">${esc(k.name.split(" ")[0])}.</span> ${linkNames(k.t)}</li>`).join("")}</ul>` : `<p class="small muted">No turning point this year.</p>`;
    years.push(`<section class="cyear"><h3>Year ${y + 1} <span class="muted">${405 - y} to ${404 - y} BC</span></h3>${lines}<details class="cfull"><summary class="small">The whole year</summary>${full}</details></section>`);
  }
  // The main threads: the four people with the most to their story, each cut to their first beat and turning points.
  const lives = b.lives.slice(0, 4).map((l) => {
    const beats = l.text.split(/(?<=\.)\s+(?=[A-Z])/);
    const keep = [...new Set(beats.filter((x, i) => (i === 0 || i === beats.length - 1 || KEY.test(x)) && !/at it again/.test(x)))].slice(0, 6);
    return `<p><strong>${linkNames(l.name.charAt(0).toUpperCase() + l.name.slice(1))}.</strong> ${linkNames(sentences(keep.join(" ")))}</p>`;
  }).join("");
  const rest = b.lives.slice(4);
  const more = rest.length ? `<details class="cfull"><summary class="small">Other lives (${rest.length})</summary>${rest.map((l) => `<p><strong>${linkNames(l.name.charAt(0).toUpperCase() + l.name.slice(1))}.</strong> ${linkNames(sentences(l.text))}</p>`).join("")}</details>` : "";
  const ending = b.ending ? `<section class="cyear"><h3>How it ended</h3><p>${linkNames(sentences(b.ending))}</p></section>` : "";
  const threads = lives ? `<section class="cyear"><h3>The main threads</h3>${lives}${more}</section>` : "";
  return `<article class="book"><h2>The chronicle</h2><p class="small muted">The turning points of each year. Open a year for the whole of it. Everything here is what you saw happen.</p>${ending}${threads}${years.join("")}</article>`;
}
