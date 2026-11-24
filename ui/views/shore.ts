// "Carthage's chronicle" (Workshop bet B6, "The other shore"): the decade told from Carthage's side. The book is
// written by the engine from the log alone (src/core/carthage-chronicle.ts); this screen lays it out, numbers each
// sentence's source as a footnote, and can set it beside your own chronicle, season by season.
import { carthageBook, logLine, seasonName, switchOn } from "../../src/core/index.ts";
import type { GameState, PunicLine, PunicYear } from "../../src/core/index.ts";
import type { Handlers } from "../app/clicks.ts";
import { esc, ui } from "../lib/text.ts";

let beside = false; // UI only: set the two chronicles side by side

const SOURCE_NOTE = "Follows";
function lineHtml(l: PunicLine, mark: number, hover: string) {
  const t = esc(l.text);
  const body = l.tone === "turn" ? `<strong>${t}</strong>` : l.tone === "omen" ? `<em>${t}</em>` : t;
  return `<span class="pl ${l.tone}">${body}<sup class="fn"><a href="#shore-n${mark}" title="${esc(hover)}">${mark}</a></sup></span>`;
}

// The game's own chronicle for a season, from its line in the log, for the side-by-side reading.
function yourSeason(g: GameState, season: number) {
  const e = g.log.find((x) => x.kind === "chronicle" && x.season === season);
  if (!e) return "";
  const i = e.text.indexOf(". ");
  return e.text.slice(i + 2);
}

function yearHtml(g: GameState, y: PunicYear, counter: { n: number }) {
  const notes: string[] = [];
  const seasons = y.seasons.map((se) => {
    const parts = se.lines.map((l) => {
      const mark = ++counter.n;
      const src = l.from.map((n) => logLine(g, n)).filter(Boolean).map((e) => `“${esc(e!.text)}”`);
      const more = src.length > 3 ? ` and ${src.length - 3} more like ${src.length - 3 === 1 ? "it" : "them"}` : "";
      notes.push(`<li id="shore-n${mark}" value="${mark}"><span class="muted">${esc(seasonName(se.season))}, from the game's log:</span> ${src.slice(0, 3).join(" ")}${more}${l.source ? ` <span class="cite">${SOURCE_NOTE} ${esc(l.source)}.</span>` : ""}</li>`);
      return lineHtml(l, mark, `From the game's log: ${logLine(g, l.from[0])?.text ?? ""}`);
    });
    const punic = `<p>${parts.join(" ")}</p>`;
    if (!beside) return `<div class="cseason"><h4>${esc(se.name)}</h4>${punic}</div>`;
    return `<div class="cseason two"><h4>${esc(se.name)}</h4><div class="shore-pair"><div class="ours"><p class="label">In Syracuse</p><p>${esc(yourSeason(g, se.season))}</p></div><div class="theirs"><p class="label">In Carthage</p>${punic}</div></div></div>`;
  });
  return `<section class="cyear shore-year"><h3>${esc(y.heading)} <span class="muted greek-year">${esc(y.greekYear)}</span></h3>
    ${y.greek ? `<p class="cdiod">${esc(y.greek.text)} <span class="cite">(${esc(y.greek.source)})</span></p>` : ""}
    ${seasons.length ? seasons.join("") : `<p class="muted">Nothing of Carthage is recorded this year.</p>`}
    ${notes.length ? `<details class="shore-notes"><summary>Where these lines come from</summary><ol>${notes.join("")}</ol></details>` : ""}</section>`;
}

export function shoreView(g: GameState) {
  if (!g.island) return `<article class="book shore"><h2>Carthage's chronicle</h2><p class="muted">Carthage keeps its own record only in the island game.</p></article>`;
  const b = carthageBook(g);
  const counter = { n: 0 };
  const years = b.years.map((y) => yearHtml(g, y, counter)).join("");
  const toggle = `<p class="shore-toggle"><button type="button" data-shore-beside aria-pressed="${beside}">${beside ? "Read Carthage's chronicle alone" : "Set it beside your own chronicle"}</button></p>`;
  return `<article class="book shore${beside ? " wide" : ""}"><h2>Carthage's chronicle</h2>
    <p class="opening">${esc(b.opening)}</p><div class="meander" aria-hidden="true"></div>
    <p class="small muted">Turning points are in bold, the gods' signs in italics. Each small number leads to the line of the game's log the sentence was made from. Where a sentence follows a Greek author, the note names the passage. The year names, the suffetes, are men of Carthage's houses in your game: the custom is real, the names are invention.</p>
    ${toggle}
    ${years || `<p class="muted">The record begins when the first season ends.</p>`}
    <span class="fleuron" aria-hidden="true"></span><p class="colophon">${esc(b.closing?.text ?? b.stillWriting ?? "")}</p></article>`;
}

export const shoreHandlers: Handlers = {
  click: { "[data-shore-beside]": (_el, c) => { beside = !beside; c.render(); } },
};
export const shoreOnEnding = (g: GameState) => (g.island && (ui.view as string) !== "shore" ? `<p class="shore-cta"><button type="button" data-view="shore">Read the decade as Carthage would tell it</button></p>` : "");
export const shoreWhen = (g: GameState) => !!g.island && switchOn(g, "carthageChronicle");
