// The island view (Phase 2): the map of Sicily with its cities, roads and armies, and Carthage's council.
// It only reads the state; every rule is in src/core.
import {
  CARTHAGE, ISLAND, NODES, ROUTES, armyName, blocDef, capital, carthageAgenda, cityGrain, cityMen, cityWalls, goalDef, menWords,
  moodWord, nodeName, prefers, sideName, goOverMods,
} from "../src/core/index.ts";
import type { Army, GameState } from "../src/core/index.ts";
import { esc, linkNames } from "./text.ts";
import * as A from "./island-art.ts";


const SIDE_COLOR: Record<string, string> = {
  syracuse: "var(--blood)", ally: "#b0563f", free: "var(--muted)", tributary: "#8a6aa0", carthage: "var(--punic)", exiles: "#2a4a5a",
};

function mapSvg(g: GameState): string {
  // Drawn with the map kit in ui/island-art.ts (the art thread); this function only decides what goes where.
  const isl = g.island!;
  const at = (id: string) => NODES.find((n) => n.id === id)!;
  const P = (id: string): [number, number] => { const n = at(id); return [A.X(n.lon), A.Y(n.lat)]; };
  const roads = ROUTES.map((r) => A.routePath(P(r.from), P(r.to), (r as { sea?: boolean }).sea ? "sea" : "road", r.days)).join("");
  const LABEL: Record<string, [number, number, "start" | "middle" | "end"]> = {
    aetna: [-14, 4, "end"], catana: [16, 6, "start"], messana: [-12, -14, "end"], panormus: [0, -16, "middle"], motya: [12, 18, "start"],
    leontini: [-14, 8, "end"], syracuse: [0, 30, "middle"],
  };
  const marks = NODES.map((n) => {
    const c = isl.cities[n.id];
    const [x, y] = P(n.id);
    return A.cityMark(x, y, {
      name: n.name, side: c.side, walled: cityWalls(g, n.id) > 0, fort: n.type === "fort", capital: n.id === "syracuse",
      besieged: isl.armies.some((a) => a.siege === n.id), approx: !!n.approx, label: LABEL[n.id],
    });
  }).join("");
  const armies = isl.armies.map((a, i) => {
    const [x, y] = P(a.at);
    const dir = a.side === "syracuse" ? 1 : -1;
    return A.armyMark(x + dir * 22, y - 20 - i * 4, { side: a.side, men: `${Math.round(a.men * ISLAND.rules.menPerPoint / 1000)}k`, label: armyName(g, a), dir });
  }).join("");
  return `<svg viewBox="0 0 ${A.W} ${A.H}" class="island-map" role="img" aria-label="Map of Sicily: ${NODES.map((n) => `${n.name}, ${sideName(isl.cities[n.id].side)}`).join("; ")}">
    ${A.islandBase()}${roads}${A.toCarthage(A.Y(37.2))}${marks}${armies}
  </svg>`;
}

function armyLine(g: GameState, a: Army) {
  const where = a.siege ? `besieging ${nodeName(a.siege)}` : `at ${nodeName(a.at)}`;
  const food = a.food <= 0 ? `<span class="warn">no food left</span>` : `${a.food} ${a.food === 1 ? "season" : "seasons"} of food`;
  const guard = a.side === "syracuse" && a.guard ? `; ${menWords(a.guard)} of them are your guard${a.at === "syracuse" ? "" : ", away from your door"}` : "";
  return `<li><b>${esc(capital(armyName(g, a)))}</b>: ${menWords(a.men)}, ${where}, ${food}${guard}.</li>`;
}

// The chance a town goes over this season, from the same roll the world step makes.
function overNotes(g: GameState, id: string): string[] {
  const out: string[] = [];
  for (const side of ["syracuse", "carthage"] as const) {
    const m = goOverMods(g, id, side);
    if (!m) continue;
    const t = m.reduce((x, y) => x + y.value, 0);
    const p = [1, 2, 3, 4, 5, 6].filter((d) => d + t >= ISLAND.rules.goOverNeed).length;
    if (!p) continue; // the world step makes no roll it cannot win
    out.push(`<span class="${side === "syracuse" ? "good" : "warn"}">may go over to ${side === "syracuse" ? "you" : "Carthage"} (${p} in 6 next season)</span>`);
    break;
  }
  return out;
}
function cityRows(g: GameState) {
  const isl = g.island!;
  return NODES.map((n) => {
    const c = isl.cities[n.id];
    const w = cityWalls(g, n.id);
    const sieged = isl.armies.find((a) => a.siege === n.id);
    const leanWord = n.id === "syracuse" ? "" : c.lean >= 2 ? "warm to you" : c.lean === 1 ? "leans your way" : c.lean === 0 ? "undecided" : c.lean === -1 ? "cool to you" : "hostile to you";
    const notes = [sieged ? `<span class="warn">besieged by ${esc(armyName(g, sieged))}</span>` : "", c.sacked ? "sacked, still in ruins" : "", c.fear ? "afraid of you" : "", ...overNotes(g, n.id)].filter(Boolean).join("; ");
    return `<tr><th scope="row">${esc(n.name)}</th><td><span class="side" style="--c:${SIDE_COLOR[c.side]}">${esc(capital(sideName(c.side)))}</span></td>
      <td>${w ? `walls ${w}` : "no walls"}</td><td>${cityGrain(g, n.id)} months</td><td>${menWords(cityMen(g, n.id))}</td><td>${esc(leanWord)}</td><td class="small notes">${notes || `<span class="muted">${esc(n.detail)}</span>`}</td></tr>`;
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
      Anger toward Syracuse ${g.clock} of 10. Its treasury holds ${c.silver} silver; at home it has ${c.mercs ? `${menWords(c.mercs)} hired` : "no hired men"} and ${c.levy ? `${menWords(c.levy)} in Libyan levies` : "no Libyan levies"}; ${c.ships} squadrons of ships.
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
        <figcaption class="small muted">Towers are walled cities, roofs an open town, the hill a fortress; colours show each city's side. Shields are armies (the helmet yours, the palm Carthage's), with their men in thousands. Numbers on the roads are marching days. Aetna's site is uncertain. Coast and rivers: Natural Earth (today's); the hills are drawn by eye.</figcaption></figure>
      <h3>Armies</h3>${armies}
      ${abroad.length ? `<h3>This season abroad</h3><ul class="small">${abroad.map((e) => `<li>${linkNames(e.text)}${e.why ? ` <span class="muted">(${esc(e.why)})</span>` : ""}</li>`).join("")}</ul>` : ""}
      <h3>The cities</h3>
      <div class="tablewrap"><table class="cities"><thead><tr><th>City</th><th>Side</th><th>Walls</th><th>Grain</th><th>Men</th><th>Toward you</th><th class="notes">Notes</th></tr></thead><tbody>${cityRows(g)}</tbody></table></div>
    </div>
    ${carthagePanel(g)}
  </div>`;
}
