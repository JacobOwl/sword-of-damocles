// Scene-setting that changes nothing in the game: the sword over the masthead, the card that opens each season,
// and the lines of flavour they use (data/flavor.json). Everything here only reads the state.
// Lines are picked by a hash of the seed and the season, never with the game's dice, so replays stay exact.
import flavorJson from "../../data/flavor.json" with { type: "json" };
import calendarJson from "../../data/calendar.json" with { type: "json" };
import { DATA, government, others, presetById, seasonName } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";
import { icon } from "./icons.ts";
import { esc } from "../lib/text.ts";

type Line = { id: string; text: string; season?: string; if?: string; by?: string };
export const FLAVOR = flavorJson as unknown as { title: Line[]; seasons: Line[]; chronicle: Line[] };

function hash(a: number, b: number) {
  let h = (a * 2654435761) ^ (b * 40503 + 0x9e3779b9);
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

// What the player can see of the danger: only warned plots count, so this never leaks a hidden one.
export function knownDanger(g: GameState) {
  const warned = g.plots.filter((p) => p.stage >= 1);
  const stage = warned.reduce((m, p) => Math.max(m, p.stage), 0);
  const ready = warned.some((p) => p.stage >= 3 && p.namedSince < g.season);
  return { stage, ready, count: warned.length };
}

function conditions(g: GameState): Set<string> {
  const c = new Set<string>();
  const d = knownDanger(g);
  if (g.grain < 3) c.add("grainLow");
  if (g.clock >= 7) c.add("carthageNear");
  if (d.stage >= 3) c.add("plotNamed");
  else if (d.stage >= 1) c.add("plotKnown");
  if (g.guard.arrearsSeasons) c.add("guardUnpaid");
  if (government(g) === "Tyranny (yours)") c.add("tyranny");
  if (!d.count && !others(g).some((p) => (p.rival || p.political) && p.status !== "dead")) c.add("quiet");
  return c;
}

// One line for the season: a line about what is pressing, if anything is, otherwise one about the time of year.
export function seasonLine(g: GameState, season = g.season): string {
  const c = conditions(g);
  const h = hash(g.seed, season);
  const pressing = FLAVOR.seasons.filter((l) => l.if && c.has(l.if) && l.if !== "quiet");
  const kind = seasonName(season).split(" ")[0];
  const time = FLAVOR.seasons.filter((l) => l.season === kind);
  const quiet = FLAVOR.seasons.filter((l) => l.if === "quiet" && c.has("quiet"));
  // Pressing matters win two times in three; otherwise the season speaks (now and then, the quiet does).
  const pool = pressing.length && h % 3 !== 0 ? pressing : quiet.length && h % 5 === 0 ? quiet : time;
  return (pool[h % pool.length] ?? time[0]).text;
}

// Diodorus' name for the game year that begins in autumn of `year` BC (data/calendar.json), if the text is saved.
const YEARS = (calendarJson as unknown as { years: { year: number; text: string; source: string }[] }).years;
export function diodorusYear(year: number) {
  const y = YEARS.find((x) => x.year === year);
  return y ? { text: `In Diodorus, ${y.text}`, cite: y.source.replace(/^Diodorus /, "") } : null;
}

export const chronicleLine = (id: string) => FLAVOR.chronicle.find((l) => l.id === id)?.text ?? "";
export function colophon(g: GameState) {
  const r = g.over?.reason;
  return (FLAVOR.chronicle.find((l) => l.if === r) ?? FLAVOR.chronicle.find((l) => l.id === "colophonOther"))!.text;
}

// ---------- The sword overhead ----------
const STAGE_WORDS = ["No warnings have reached you. The sword hangs still.", "Whispers: something is being planned. The hair holding the sword has frayed.", "Rumors: you know which faction. The sword sways on a thinning hair.", "Named: you know a plotter. The hair is nearly through."];
export function swordOverhead(g: GameState) {
  if (g.over) return "";
  const d = knownDanger(g);
  const tip = `${STAGE_WORDS[d.stage]}${d.ready ? " A plot can strike at the end of this season." : ""} (Only plots you have been warned of count.)`;
  return `<span class="overhead s${d.stage} ${d.ready ? "ready" : ""}" data-tip="${esc(tip)}" tabindex="0" role="img" aria-label="${esc(tip)}">
    <svg viewBox="0 0 24 60" aria-hidden="true"><line x1="12" y1="0" x2="12" y2="${22 + d.stage * 3}" class="hair"/>
    <g class="blade" transform="translate(0 ${20 + d.stage * 3})">${icon("sword").replace(/^<svg[^>]*>|<\/svg>$/g, "")}</g></svg></span>`;
}

// ---------- The season card ----------
let cardTimer = 0;
export function showSeasonCard(g: GameState) {
  if (g.over || typeof document === "undefined") return;
  document.querySelector(".season-card")?.remove();
  const name = seasonName(g.season);
  const [kind, ...rest] = name.split(" ");
  const line = seasonLine(g);
  const year = Math.floor(g.season / 4) + 1;
  const dy = diodorusYear(405 - (year - 1));
  const el = document.createElement("div");
  el.className = "season-card";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", `${name}. ${line}`);
  el.innerHTML = `<div class="sc-inner">
    <div class="tesserae" aria-hidden="true"></div>
    ${icon("sword", "sc-sword")}
    <p class="sc-kicker">Year ${year} of ${g.exile?.active ? "the decade, in exile" : "your rule"} · ${seasonCount(g).toLowerCase()}</p>
    <h2 class="sc-season">${esc(kind)}</h2>
    <p class="sc-year">${esc(rest.join(" "))}</p>
    ${g.season % 4 === 0 && dy ? `<p class="sc-diod">${esc(dy.text)} <span class="cite">(${esc(dy.cite)})</span></p>` : ""}
    <p class="sc-line"><span class="dropcap">${esc(line.charAt(0))}</span>${esc(line.slice(1))}</p>
    <p class="sc-go">Click or press any key</p>
    <div class="tesserae" aria-hidden="true"></div>
  </div>`;
  document.body.appendChild(el);
  const close = () => {
    clearTimeout(cardTimer);
    el.classList.add("out");
    window.removeEventListener("keydown", close);
    setTimeout(() => el.remove(), 380);
  };
  el.addEventListener("click", close);
  window.addEventListener("keydown", close, { once: true });
  cardTimer = window.setTimeout(close, 3600);
}

// A test preset counts to its verdict ("Season 4 of 30"), then to the end of the game.
export function seasonCount(g: GameState) {
  const n = Math.min(g.season + 1, DATA.start.seasons);
  const v = presetById(g.preset)?.verdictSeason;
  return v && v < DATA.start.seasons && n <= v ? `Season ${n} of ${v} in this test` : `Season ${n} of ${DATA.start.seasons}`;
}

