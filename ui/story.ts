// The season's events and the chronicle, written for reading. Both come straight from the one action log.
import { PLAYER, seasonName, storyBook, switchOn } from "../src/core/index.ts";
import type { GameState, LogEntry } from "../src/core/index.ts";
import { esc, linkNames, rollLine, ui } from "./text.ts";

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
function shiftList(list: Shift[]) {
  return list.map((x) => `<li class="${x.hidden ? "hidden" : ""}"><span class="arrow ${x.up === true ? "good" : x.up === false ? "warn" : "muted"}">${x.up === true ? "▲" : x.up === false ? "▼" : "•"}</span> ${linkNames(x.text)}${x.why ? ` <span class="why">${esc(x.why)}</span>` : ""}</li>`).join("");
}

export function seasonFeed(s: GameState, season: number, steps = STEPS.map((x) => x[0])) {
  const es = s.log.filter((e) => e.season === season && e.kind !== "chronicle" && (ui.designer || e.visible) && steps.includes(e.step));
  const groups = STEPS.filter(([k]) => steps.includes(k)).map(([k, t]) => {
    const evs = es.filter((e) => e.step === k && e.kind !== "change");
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
    years.push(`<section class="cyear"><h3>Year ${y + 1} <span class="muted">${405 - y} to ${404 - y} BC</span></h3>${seasons.join("")}</section>`);
  }
  return `<article class="book"><h2>The chronicle</h2><p class="small muted">Everything here is what you saw happen, in order. Turning points are in bold; omens and warnings in italics.</p>${years.join("")}</article>`;
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
function storyChronicleBook(s: GameState) {
  const b = storyBook(s);
  const years: string[] = [];
  for (let y = 0; y * 4 < b.seasons.length; y++) {
    const ss = b.seasons.slice(y * 4, y * 4 + 4).map((x) => `<div class="cseason"><h4>${esc(x.name)}</h4>${x.paragraphs.map((p) => {
      const t = linkNames(sentences(p));
      return `<p>${TURNING.test(p) ? `<strong>${t}</strong>` : t}</p>`;
    }).join("")}${x.omens.length ? `<p class="omens">${x.omens.map(linkNames).join(" ")}</p>` : ""}</div>`);
    years.push(`<section class="cyear"><h3>Year ${y + 1} <span class="muted">${405 - y} to ${404 - y} BC</span></h3>${ss.join("")}</section>`);
  }
  const lives = b.lives.length ? `<section class="cyear"><h3>Lives</h3><p class="small muted">Each person's thread through your reign, from what you saw. Repeats are counted, not repeated.</p>${b.lives.map((l) => `<p><strong>${linkNames(l.name.charAt(0).toUpperCase() + l.name.slice(1))}.</strong> ${linkNames(sentences(l.text))}</p>`).join("")}</section>` : "";
  const ending = b.ending ? `<section class="cyear"><h3>How it ended</h3><p>${linkNames(sentences(b.ending))}</p></section>` : "";
  return `<article class="book"><h2>The chronicle</h2><p class="small muted">Told as a story: each season by who it was about, with where each turning point began. Everything here is what you saw happen.</p>${years.join("")}${ending}${lives}</article>`;
}
