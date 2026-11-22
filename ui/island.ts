// The island view (Phase 2): the map of Sicily with its cities, roads and armies, and Carthage's council.
// It only reads the state; every rule is in src/core.
import {
  CARTHAGE, ISLAND, NODES, ROUTES, armyName, blocDef, capital, carthageAgenda, cityGrain, cityMen, cityWalls, goalDef, menWords,
  moodWord, nodeName, prefers, sideName,
} from "../src/core/index.ts";
import type { Army, GameState } from "../src/core/index.ts";
import { esc, linkNames } from "./text.ts";
import sicily from "./art/sicily.json" with { type: "json" };

// The map's frame: an equirectangular projection squeezed by the cosine of Sicily's latitude.
const BOX = sicily.box;
const K = 260; // px per degree of latitude
const COS = Math.cos((37.5 * Math.PI) / 180);
const LEFT = 70; // room for the arrow to Carthage
const W = Math.round((BOX.e - BOX.w) * COS * K) + LEFT;
const H = Math.round((BOX.n - BOX.s) * K);
const X = (lon: number) => LEFT + (lon - BOX.w) * COS * K;
const Y = (lat: number) => (BOX.n - lat) * K;

const SIDE_COLOR: Record<string, string> = {
  syracuse: "var(--blood)", ally: "#b0563f", free: "var(--muted)", tributary: "#8a6aa0", carthage: "var(--punic)", exiles: "#2a4a5a",
};

function mapSvg(g: GameState): string {
  const isl = g.island!;
  const coast = sicily.rings.map((r) => `<path d="M${r.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join("L")}Z"/>`).join("");
  const at = (id: string) => NODES.find((n) => n.id === id)!;
  const roads = ROUTES.map((r) => {
    const a = at(r.from), b = at(r.to);
    const mx = (X(a.lon) + X(b.lon)) / 2, my = (Y(a.lat) + Y(b.lat)) / 2;
    return `<line x1="${X(a.lon).toFixed(1)}" y1="${Y(a.lat).toFixed(1)}" x2="${X(b.lon).toFixed(1)}" y2="${Y(b.lat).toFixed(1)}" class="road"/>
      <text x="${mx.toFixed(1)}" y="${(my - 3).toFixed(1)}" class="days">${r.days}d</text>`;
  }).join("");
  const marks = NODES.map((n) => {
    const c = isl.cities[n.id];
    const x = X(n.lon), y = Y(n.lat);
    const col = SIDE_COLOR[c.side] ?? "var(--muted)";
    const sieged = isl.armies.some((a) => a.siege === n.id);
    const shape = n.type === "fort"
      ? `<path d="M${x},${y - 8}L${x + 7},${y + 5}L${x - 7},${y + 5}Z" fill="${col}" class="mark"/>`
      : `<rect x="${x - 6}" y="${y - 6}" width="12" height="12" fill="${col}" class="mark"${cityWalls(g, n.id) ? "" : ` stroke-dasharray="2 2"`}/>`;
    const ring = sieged ? `<circle cx="${x}" cy="${y}" r="13" class="siege"/>` : "";
    const below = n.lat > 37.9 ? -12 : 20;
    return `<g>${ring}${shape}<text x="${x}" y="${y + below}" class="place">${esc(n.name)}${n.approx ? "?" : ""}</text></g>`;
  }).join("");
  const armies = isl.armies.map((a, i) => {
    const n = at(a.at);
    const x = X(n.lon) + (a.side === "syracuse" ? 14 : -14) , y = Y(n.lat) - 12 - i * 2;
    const col = a.side === "syracuse" ? "var(--blood)" : "var(--punic)";
    return `<g class="army"><line x1="${x}" y1="${y + 12}" x2="${x}" y2="${y - 6}" stroke="${col}" stroke-width="1.5"/><path d="M${x},${y - 6}L${x + (a.side === "syracuse" ? 12 : -12)},${y - 2}L${x},${y + 2}Z" fill="${col}"/>
      <text x="${x + (a.side === "syracuse" ? 14 : -14)}" y="${y + 4}" class="men" text-anchor="${a.side === "syracuse" ? "start" : "end"}">${Math.round(a.men * ISLAND.rules.menPerPoint / 1000)}k</text></g>`;
  }).join("");
  const cy = Y(37.2);
  const toCarthage = `<g class="offmap"><path d="M${LEFT + 40},${cy} L8,${cy + 40}" class="sea"/><text x="6" y="${cy + 58}" class="place" text-anchor="start">To Carthage</text><text x="6" y="${cy + 74}" class="days" text-anchor="start">two days' sail</text></g>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="island-map" role="img" aria-label="Map of Sicily: ${NODES.map((n) => `${n.name}, ${sideName(isl.cities[n.id].side)}`).join("; ")}">
    <rect width="${W}" height="${H}" class="sea-bg"/>
    <g class="land">${coast}</g>${roads}${toCarthage}${marks}${armies}
  </svg>`;
}

function armyLine(g: GameState, a: Army) {
  const where = a.siege ? `besieging ${nodeName(a.siege)}` : `at ${nodeName(a.at)}`;
  const food = a.food <= 0 ? `<span class="warn">no food left</span>` : `${a.food} ${a.food === 1 ? "season" : "seasons"} of food`;
  const guard = a.side === "syracuse" && a.guard ? `; ${menWords(a.guard)} of them are your guard, away from your door` : "";
  return `<li><b>${esc(capital(armyName(g, a)))}</b>: ${menWords(a.men)}, ${where}, ${food}${guard}.</li>`;
}

function cityRows(g: GameState) {
  const isl = g.island!;
  return NODES.map((n) => {
    const c = isl.cities[n.id];
    const w = cityWalls(g, n.id);
    const sieged = isl.armies.find((a) => a.siege === n.id);
    const leanWord = n.id === "syracuse" ? "" : c.lean >= 2 ? "warm to you" : c.lean === 1 ? "leans your way" : c.lean === 0 ? "undecided" : c.lean === -1 ? "cool to you" : "hostile to you";
    const notes = [sieged ? `<span class="warn">besieged by ${esc(armyName(g, sieged))}</span>` : "", c.sacked ? "sacked, still in ruins" : "", c.fear ? "afraid of you" : ""].filter(Boolean).join("; ");
    return `<tr><th scope="row">${esc(n.name)}</th><td><span class="side" style="--c:${SIDE_COLOR[c.side]}">${esc(capital(sideName(c.side)))}</span></td>
      <td>${w ? `walls ${w}` : "no walls"}</td><td>${cityGrain(g, n.id)} months</td><td>${menWords(cityMen(g, n.id))}</td><td>${esc(leanWord)}</td><td class="small">${notes || `<span class="muted">${esc(n.detail)}</span>`}</td></tr>`;
  }).join("");
}

function carthagePanel(g: GameState) {
  const c = g.island!.carthage;
  const goal = goalDef(c.goal);
  const blocs = CARTHAGE.blocs.map((b: any) => {
    const st = c.blocs[b.id];
    const want = b.votes ? prefers(g, b.id) : null;
    return `<li><b>${esc(capital(b.name))}</b> <span class="small muted">power ${st.power} of 10, ${esc(moodWord(st.mood))}${b.votes ? "" : ", no vote"}</span><br>
      <span class="small">${esc(b.detail)}${want ? ` Now they want: <b>${esc(goalDef(want.goal).name)}</b> (${esc(want.why)}).` : ""}</span></li>`;
  }).join("");
  const next = carthageAgenda(g).map((x) => `<li class="${x.ready ? "" : "muted"}">${esc(x.name)}${x.ready ? "" : " (not now)"}</li>`).join("");
  const men = (CARTHAGE.people as any[]).map((p) => {
    const st = c.people[p.id];
    const words = { free: "at home", command: "in command of the war", disgraced: "in disgrace", dead: "dead" }[st.status];
    return `<li>${esc(p.name)} <span class="small muted">(${esc(p.role)}; ${esc(words)}${p.kind === "history" ? "; real person" : "; invented"})</span></li>`;
  }).join("");
  const plague = c.plagueUntil >= g.season ? `<p class="warn small">Plague is in Carthage.</p>` : "";
  const revolt = c.revolt ? `<p class="warn small">The Libyans are in revolt.</p>` : "";
  return `<div class="carthage">
    <h2>Carthage</h2>
    <p><span class="label">Its goal</span> <b>${esc(goal.name)}</b>. ${esc(goal.text)} <span class="small muted">Why: ${esc(c.goalWhy)}.</span></p>
    <p class="small">${g.island!.war ? `<span class="warn">At war with you since ${esc(seasonWord(g, g.island!.warSince))}.</span>` : "At peace with you."}
      Anger toward Syracuse ${g.clock} of 10. Its treasury holds ${c.silver} silver; at home it has ${menWords(c.mercs)} of hired men and ${menWords(c.levy)} of Libyan levies; ${c.ships} squadrons of ships.
      ${c.offer >= g.season - 1 && g.island!.war ? "<b>Its envoys are in Syracuse with terms.</b>" : ""}</p>
    ${plague}${revolt}
    <h3>The council</h3><ul class="blocs">${blocs}</ul>
    <p class="small muted">The council picks the goal the most power wants. If the Elders are against it, the people's assembly decides (after Aristotle, who wrote two generations later).</p>
    <h3>What it does next, in order</h3><ol class="small">${next}</ol>
    <h3>Its men</h3><ul class="small">${men}</ul>
  </div>`;
}
function seasonWord(g: GameState, n: number) {
  const y = 405 - Math.floor(n / 4), q = n % 4;
  return q === 0 ? `autumn ${y} BC` : q === 1 ? `winter ${y}/${y - 1} BC` : `${q === 2 ? "spring" : "summer"} ${y - 1} BC`;
}

export function islandView(g: GameState): string {
  const isl = g.island!;
  const armies = isl.armies.length ? `<ul>${isl.armies.map((a) => armyLine(g, a)).join("")}</ul>` : `<p class="muted small">No army is in the field.</p>`;
  const abroad = g.log.filter((e) => e.visible && e.season === g.season && (e.actor === "carthage" || /army|siege|Battle|march|gates|ally|tribute|Plague/i.test(e.text)) && e.kind !== "chronicle").slice(-12);
  return `<div class="island">
    <div class="island-main">
      <h2>Sicily</h2>
      <figure class="mapfig">${mapSvg(g)}
        <figcaption class="small muted">Squares are cities, the triangle a fortress; a dashed square has no walls. Flags are armies (red yours, purple Carthage's), with their men in thousands. Roads show marching days. Aetna's site is uncertain. Coastline: Natural Earth.</figcaption></figure>
      <h3>Armies</h3>${armies}
      ${abroad.length ? `<h3>This season abroad</h3><ul class="small">${abroad.map((e) => `<li>${linkNames(e.text)}${e.why ? ` <span class="muted">(${esc(e.why)})</span>` : ""}</li>`).join("")}</ul>` : ""}
      <h3>The cities</h3>
      <div class="tablewrap"><table class="cities"><thead><tr><th>City</th><th>Side</th><th>Walls</th><th>Grain</th><th>Men</th><th>Toward you</th><th>Notes</th></tr></thead><tbody>${cityRows(g)}</tbody></table></div>
    </div>
    ${carthagePanel(g)}
  </div>`;
}
