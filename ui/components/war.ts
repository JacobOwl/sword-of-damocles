// The war strip (war focus, council of 2026-11-27, question 1B): the war as one object at the top of the season
// and island pages. Why it began, each side's aim, the turning points so far, how tired each side is, and what
// peace would look like now. It reads the war card and changes nothing.
import { WAR, warCard, warBalance, ledgerLines, termsFor, termsText, seasonName, landingPossible } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";
import { esc, linkNames } from "../lib/text.ts";

const aim = (side: "syracuse" | "carthage", id?: string) => (side === "carthage" ? WAR.carthageAims : WAR.yourAims).find((a: any) => a.id === id);

// Weariness as a row of ten marks, with your lines (4, 7, 10) shown as gaps where things go sour.
function wearyMarks(n: number, lines: number[]) {
  const max = WAR.knobs.weary.max;
  let out = "";
  for (let i = 1; i <= max; i++) out += `<span class="wmark${i <= n ? " on" : ""}${lines.includes(i) ? " line" : ""}"></span>`;
  return `<span class="wmarks" aria-label="${n} of ${max}">${out}</span>`;
}
function wearyWord(n: number) {
  return n >= 9 ? "exhausted" : n >= 7 ? "sick of it" : n >= 4 ? "tiring" : n >= 1 ? "still eager" : "fresh";
}

export function warStrip(g: GameState): string {
  const c = warCard(g);
  if (!c || !g.island?.war) return "";
  const k = WAR.knobs.weary;
  const aC = aim("carthage", c.carthageAim), aY = aim("syracuse", c.yourAim);
  const b = warBalance(g);
  const lean = b >= 2 ? `<b class="good">The war goes your way.</b>` : b <= -2 ? `<b class="warn">The war goes Carthage's way.</b>` : `The war is even.`;
  const turns = ledgerLines(g, 5).map((e) => `<li class="${e.side === "syracuse" ? "good" : "warn"}"><span class="muted small">${esc(seasonName(e.season))}</span> ${linkNames(e.text.charAt(0).toUpperCase() + e.text.slice(1))}</li>`).join("");
  const landed = g.island.armies.some((a) => a.side === "carthage");
  const quiet = landed ? "" : c.returnOwed ? `<p class="small"><b>Quiet for now:</b> Carthage's war is paused while Libya is in revolt. It will come back.</p>`
    : c.landingDue !== undefined ? `<p class="small warn"><b>A landing is coming:</b> Carthage's fleet is ready and lands ${c.landingDue <= g.season ? "this season" : "next season"}.</p>`
    : !landingPossible(g) ? `<p class="small muted">Carthage has no army in Sicily and not yet enough men or ships to send one.</p>` : "";
  const offer = c.terms && c.termsFrom === "carthage" && c.termsSeason === g.season
    ? `<p class="small"><b>Carthage offers:</b> ${esc(termsText(c.terms))}</p>`
    : `<p class="small"><b>Peace now would be:</b> ${esc(termsText(termsFor(g, "syracuse")))}</p>`;
  const why = c.causes.length ? `, after ${esc(c.causes[c.causes.length - 1].replace(` (${seasonName(c.since)})`, ""))}` : "";
  return `<section class="warstrip" aria-label="The war">
    <div class="wartop"><h3>At war with Carthage</h3><span class="small muted">since ${esc(seasonName(c.since))}${why}</span></div>
    <div class="warcols">
      <div><span class="label">Carthage's aim</span> ${esc(aC?.name ?? "")}${c.aimsMet.includes("carthage") ? ` <b class="warn">(met)</b>` : ""}</div>
      <div><span class="label">Your aim</span> ${aY ? esc(aY.name) + (c.aimsMet.includes("syracuse") ? ` <b class="good">(met)</b>` : "") : `<span class="muted">none chosen</span>`}</div>
      <div><span class="label">Your side</span> ${wearyMarks(c.weary.syracuse, k.yoursAt)} ${wearyWord(c.weary.syracuse)}</div>
      <div><span class="label">Carthage</span> ${wearyMarks(c.weary.carthage, [])} ${wearyWord(c.weary.carthage)}</div>
    </div>
    <p class="small">${lean}${c.noBattle >= WAR.knobs.noBattleMatter - 1 ? ` <span class="warn">Your men have marched ${c.noBattle} seasons without a battle and grow restless.</span>` : ""}</p>
    ${turns ? `<ul class="warturns small">${turns}</ul>` : `<p class="small muted">No turning point yet.</p>`}
    ${quiet}${offer}
  </section>`;
}
