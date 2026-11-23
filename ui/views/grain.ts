// "Grain and the sea" (Workshop bet B3): every convoy at sea on the map, with why it sailed and what may happen to it,
// what landed or was lost last season, and the contractors' records. It only reads the state; the rules are in
// src/core/convoys.ts (switch "convoys").
import {
  CONVOYS, NODES, ROUTES, armyName, atSea, capital, carthageArmy, catchMods, contractorLine, contractorName, contractors,
  convoyPlace, convoysOn, cityWalls, nodeName, pastConvoys, seasonName, yourArmy,
} from "../../src/core/index.ts";
import type { Convoy, GameState } from "../../src/core/index.ts";
import { esc } from "../lib/text.ts";
import { iconBody } from "../components/icons.ts";
import * as A from "../components/island-art.ts";

const f = (n: number) => n.toFixed(1);
// Off the map: the grain ports of Italy to the east, Carthage to the south-west (the lane the island map already draws).
const OFF: Record<string, [number, number]> = { overseas: [A.X(15.5), A.Y(37.3)], carthage: [A.LEFT - 34, A.Y(37.2) + 30] };
function P(id: string): [number, number] {
  if (OFF[id]) return OFF[id];
  const n = NODES.find((x) => x.id === id)!;
  return [A.X(n.lon), A.Y(n.lat)];
}
const what = (v: Convoy) => (v.cargo === "grain" ? `${v.amount} ${v.amount === 1 ? "month" : "months"} of grain` : `${v.amount} silver`);
const PURPOSE: Record<Convoy["purpose"], string> = { bought: "bought abroad", fleet: "the fleet's grain", surplus: "an ally's surplus", army: "for the army", pay: "the mercenaries' pay" };

function lane(v: Convoy, cls: string, i: number) {
  const [x1, y1] = P(v.from), [x2, y2] = P(v.to);
  const bend = (i % 2 ? 1 : -1) * (0.16 + (i % 3) * 0.05);
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  // The ship sits where the curve is halfway.
  const sx = 0.25 * x1 + 0.5 * mx + 0.25 * x2, sy = 0.25 * y1 + 0.5 * my + 0.25 * y2;
  const side = v.side === "carthage" ? "carth" : "ours";
  const mark = cls === "caught" || cls === "wrecked" || cls === "sold"
    ? `<path d="M${f(sx - 5)},${f(sy - 5)}L${f(sx + 5)},${f(sy + 5)}M${f(sx + 5)},${f(sy - 5)}L${f(sx - 5)},${f(sy + 5)}" class="lost-x"/>`
    : `<g transform="translate(${f(sx - 9)} ${f(sy - 9)}) scale(.75)" class="ship">${iconBody("fleet")}</g>`;
  return `<g class="convoy ${side} ${cls}"><title>${esc(`${capital(convoyPlace(v.from))} to ${convoyPlace(v.to)}: ${what(v)}, ${PURPOSE[v.purpose]}. ${v.fate ? capital(v.fate) : `Why: ${v.why}`}.`)}</title>
    <path d="M${f(x1)},${f(y1)} Q${f(mx)},${f(my)} ${f(x2)},${f(y2)}" class="flow"/>${mark}</g>`;
}

function mapSvg(g: GameState) {
  const isl = g.island!;
  const roads = ROUTES.map((r) => A.routePath(P(r.from), P(r.to), "road")).join("");
  const marks = NODES.map((n) => {
    const [x, y] = P(n.id);
    return A.cityMark(x, y, { name: n.name, side: isl.cities[n.id].side, walled: cityWalls(g, n.id) > 0, fort: n.type === "fort", capital: n.id === "syracuse", besieged: isl.armies.some((a) => a.siege === n.id) });
  }).join("");
  const armies = isl.armies.map((a, i) => {
    const [x, y] = P(a.at);
    const dir = a.side === "syracuse" ? 1 : -1;
    return A.armyMark(x + dir * 22, y - 20 - i * 4, { side: a.side, men: `${a.food}s food`, label: `${armyName(g, a)}: food for ${a.food} ${a.food === 1 ? "season" : "seasons"}`, dir });
  }).join("");
  const last = pastConvoys(g).filter((v) => v.due === g.season);
  const flows = [...last.map((v, i) => lane(v, v.status, i)), ...atSea(g).map((v, i) => lane(v, "sea", i + last.length))].join("");
  const [ix, iy] = OFF.overseas;
  return `<svg viewBox="0 0 ${A.W} ${A.H}" class="island-map grain-map" role="img" aria-label="Map of Sicily with ${atSea(g).length} convoys at sea">
    ${A.islandBase("grn")}${roads}${A.toCarthage(A.Y(37.2), "From Carthage", "a season at sea")}${marks}
    <text x="${f(ix)}" y="${f(iy + 18)}" class="days-t" style="text-anchor:middle">from Italy</text>
    ${flows}${armies}
  </svg>`;
}

function risk(g: GameState, v: Convoy): string {
  const out: string[] = [];
  if (v.sailed % 4 === 1 && v.due === v.sailed + 1) out.push("it sailed in winter: a storm sinks it on a 1, holds it a season on a 2");
  const m = catchMods(g, v);
  if (m) {
    const need = CONVOYS.knobs.catchNeed - m.reduce((x: number, y: { value: number }) => x + y.value, 0);
    out.push(`${v.side === "syracuse" ? "Carthage's ships" : "your ships"} catch it on ${need} or more${m.length ? ` (${m.map((x: { label: string }) => x.label).join(", ")})` : ""}`);
  }
  if (v.contractor) out.push(`${contractorName(g, v.contractor)} may skim it`);
  return out.length ? out.join("; ") : "a calm crossing";
}
function seaList(g: GameState) {
  const xs = atSea(g);
  if (!xs.length) return `<p class="small muted">No convoy is at sea.</p>`;
  return `<ul class="convoys">${xs.map((v) => `<li class="${v.side}"><b>${esc(capital(convoyPlace(v.from)))} to ${esc(convoyPlace(v.to))}</b>: ${esc(what(v))}, ${esc(PURPOSE[v.purpose])}${v.contractor ? `, run by ${esc(contractorName(g, v.contractor))}` : ""}. Due ${esc(seasonName(v.due).toLowerCase())}.
    <br><span class="small">Why it sailed: ${esc(v.why)}. At sea: ${esc(risk(g, v))}.</span></li>`).join("")}</ul>`;
}
function lastList(g: GameState) {
  const xs = pastConvoys(g).filter((v) => v.due === g.season);
  if (!xs.length) return `<p class="small muted">Nothing came in or was lost at the start of this season.</p>`;
  return `<ul class="convoys">${xs.map((v) => `<li class="${v.side} ${v.status}"><b>${esc(capital(convoyPlace(v.from)))} to ${esc(convoyPlace(v.to))}</b> (${esc(what(v))}, ${esc(PURPOSE[v.purpose])}): ${esc(v.fate ?? "")}.</li>`).join("")}</ul>`;
}
function yearTally(g: GameState) {
  const xs = pastConvoys(g).filter((v) => v.side === "syracuse" && v.cargo === "grain" && v.due > g.season - 4);
  const sent = xs.reduce((a, v) => a + v.amount, 0), got = xs.reduce((a, v) => a + (v.delivered ?? 0), 0);
  const lost = (st: Convoy["status"]) => xs.filter((v) => v.status === st).length;
  const short = xs.filter((v) => v.status === "arrived" && (v.delivered ?? 0) < v.amount).length;
  const ca = pastConvoys(g).filter((v) => v.side === "carthage" && v.due > g.season - 4);
  return `<p class="small">In the last four seasons your convoys carried ${sent} months of grain and landed ${got}: ${lost("caught")} caught by Carthage, ${lost("wrecked")} wrecked, ${lost("sold")} lost and said to be sold, ${short} landed short.
    Carthage sent ${ca.length} ${ca.length === 1 ? "convoy" : "convoys"}; you took ${ca.filter((v) => v.status === "caught").length}.</p>`;
}
function contractorTable(g: GameState) {
  const ids = [...new Set([...contractors(g), ...Object.keys(g.convoys?.contractors ?? {})])];
  if (!ids.length) return `<p class="small muted">No rich house runs your convoys.</p>`;
  return `<ul class="contractors">${ids.map((id) => {
    const r = g.convoys?.contractors[id];
    const tag = r?.barred ? ` <span class="tag warn">barred</span>` : r && g.season - r.audited < 4 ? ` <span class="tag">audited lately</span>` : "";
    return `<li>${esc(contractorLine(g, id))}${tag}</li>`;
  }).join("")}</ul>
  <p class="small muted">A convoy that lands short may be the sea's doing or the contractor's: he always blames the sea. Only an audit (an action) shows which, and it costs the rich families' goodwill either way.</p>`;
}
function armiesLine(g: GameState) {
  const ya = yourArmy(g), ca = carthageArmy(g);
  const coast = (at: string) => (CONVOYS.landings as string[]).includes(at);
  const one = (a: NonNullable<ReturnType<typeof yourArmy>>) => `${capital(armyName(g, a))} at ${nodeName(a.at)}, food for ${a.food} ${a.food === 1 ? "season" : "seasons"} (${coast(a.at) ? "on the coast: ships can feed it" : "inland: ships cannot reach it"})`;
  return [ya, ca].filter(Boolean).map((a) => `<li>${esc(one(a!))}</li>`).join("");
}

export function grainView(g: GameState): string {
  if (!g.island) return `<section class="grain"><h2>Grain and the sea</h2><p>This page follows the island game. Start a new game on the island.</p></section>`;
  if (!convoysOn(g)) return `<section class="grain"><h2>Grain and the sea</h2>
    <p>This game was started without the switch <b>Grain and the sea</b>, so grain still arrives at once and nothing sails. Start a new game: on this page the switch is ticked for you on the start screen.</p></section>`;
  const armies = armiesLine(g);
  return `<section class="grain">
    <h2>Grain and the sea</h2>
    <p class="opening">Syracuse eats what the sea brings. Every cargo below crosses for a season, and each one is a chance for a storm, an enemy squadron or a contractor's hand.</p>
    <figure class="grain-fig">${mapSvg(g)}
      <figcaption class="small muted">Ships: convoys at sea now (red lines yours, purple Carthage's). Crosses: lost at the start of this season. Faint lines: landed at the start of this season. Shields: armies, with the food they carry. Hover a line for its cargo and cause.</figcaption></figure>
    <div class="grain-cols">
      <div><h3>At sea now</h3>${seaList(g)}
        <h3>Came in, or did not</h3>${lastList(g)}${yearTally(g)}</div>
      <div><h3>The contractors</h3>${contractorTable(g)}
        ${armies ? `<h3>Armies and the coast</h3><ul class="small">${armies}</ul>` : ""}
        <h3>How it works</h3><ul class="small">
          <li>Buying grain abroad sends a convoy: it lands next season, not now.</li>
          <li>Each winter, a friendly fleet fetches grain from Italy. Each summer, your allied ports with ${CONVOYS.knobs.surplusAt} months of grain or more ship ${CONVOYS.knobs.surplusSent} to Syracuse.</li>
          <li>An army on the coast (${esc((CONVOYS.landings as string[]).map(nodeName).join(", "))}) can be fed by sea: the action "Send grain to the army by sea".</li>
          <li>Carthage feeds its army on the coast by sea and sends its mercenaries' pay each spring. Catch the grain and its army goes hungry; catch the pay and its mercenaries desert.</li>
          <li>The sources behind this, and what is invented, are on the research card (Diodorus 14.55, 14.63.4, 14.64.1).</li>
        </ul></div>
    </div>
    <p class="small muted">Workshop page. Every rule and number here is invention, labelled as such; the pattern comes from the sources named above.</p>
  </section>`;
}
