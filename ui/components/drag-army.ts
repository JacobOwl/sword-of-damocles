// Orders on the map (war focus, council of 2026-11-27, Q6 star): drag your army's shield to a town. While you drag,
// the road route is drawn in your colour with its days, and each town that might go over to you if the army ended
// its march there gets a halo with its chance ("2 in 6"). Let go on a town to open its sheet, where the March
// buttons give the order with its odds. It reads the state and changes nothing; the order is still one action.
import { ISLAND, NODES, goOverMods, path, reachable, yourArmy } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";

const NS = "http://www.w3.org/2000/svg";
let drag: { svg: SVGSVGElement; layer: SVGGElement; target: string | null } | null = null;

function pos(svg: SVGSVGElement, id: string): [number, number] | null {
  const m = svg.querySelector<SVGGElement>(`g.citymark[data-city="${id}"]`);
  if (!m?.dataset.x) return null;
  return [Number(m.dataset.x), Number(m.dataset.y)];
}
function nearest(svg: SVGSVGElement, x: number, y: number): string | null {
  let best: string | null = null, d = 34 * 34;
  for (const n of NODES) {
    const p = pos(svg, n.id);
    if (!p) continue;
    const dd = (p[0] - x) ** 2 + (p[1] - y) ** 2;
    if (dd < d) { d = dd; best = n.id; }
  }
  return best;
}
// The chance a town goes over if your army stood at `at`, from the same rule the world step uses.
function swayAt(g: GameState, at: string): { id: string; p: number }[] {
  const a = yourArmy(g);
  if (!a) return [];
  const was = a.at;
  a.at = at; // read-only look: put the army there, ask the rule, put it back
  try {
    return NODES.map((n) => {
      const m = goOverMods(g, n.id, "syracuse");
      if (!m) return { id: n.id, p: 0 };
      const t = m.reduce((x, y) => x + y.value, 0);
      return { id: n.id, p: [1, 2, 3, 4, 5, 6].filter((d) => d + t >= ISLAND.rules.goOverNeed).length };
    }).filter((x) => x.p > 0);
  } finally { a.at = was; }
}
function draw(g: GameState, target: string | null) {
  if (!drag) return;
  const { svg, layer } = drag;
  layer.innerHTML = "";
  const a = yourArmy(g);
  if (!a || !target || target === a.at) return;
  const ok = reachable(g, a.at).includes(target);
  const route = path(a.at, target);
  if (route) {
    const pts = route.nodes.map((id) => pos(svg, id)).filter(Boolean) as [number, number][];
    const line = document.createElementNS(NS, "polyline");
    line.setAttribute("points", pts.map((p) => p.join(",")).join(" "));
    line.setAttribute("class", ok ? "drag-route" : "drag-route far");
    layer.appendChild(line);
    const end = pts.at(-1)!;
    const label = document.createElementNS(NS, "text");
    label.setAttribute("x", String(end[0] + 12)); label.setAttribute("y", String(end[1] - 22));
    label.setAttribute("class", "drag-days");
    label.textContent = ok ? `${route.days.at(-1)} days` : `${route.days.at(-1)} days: too far this season`;
    layer.appendChild(label);
  }
  if (!ok) return;
  for (const t of swayAt(g, target)) {
    const p = pos(svg, t.id);
    if (!p) continue;
    const ring = document.createElementNS(NS, "circle");
    ring.setAttribute("cx", String(p[0])); ring.setAttribute("cy", String(p[1] - 2)); ring.setAttribute("r", "26");
    ring.setAttribute("class", "drag-halo");
    layer.appendChild(ring);
    const txt = document.createElementNS(NS, "text");
    txt.setAttribute("x", String(p[0])); txt.setAttribute("y", String(p[1] + 34));
    txt.setAttribute("class", "drag-odds");
    txt.textContent = `${t.p} in 6`;
    layer.appendChild(txt);
  }
}
function svgPoint(svg: SVGSVGElement, e: PointerEvent) {
  const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM()!.inverse());
}

export function setupArmyDrag(root: HTMLElement, game: () => GameState | null, done: (target: string | null) => void) {
  root.addEventListener("pointerdown", (e) => {
    const el = (e.target as Element).closest?.("[data-drag-army]");
    const g = game();
    if (!el || !g || g.over) return;
    const svg = el.closest("svg") as SVGSVGElement;
    const layer = document.createElementNS(NS, "g") as SVGGElement;
    layer.setAttribute("class", "drag-layer");
    svg.appendChild(layer);
    drag = { svg, layer, target: null };
    (el as Element).setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  root.addEventListener("pointermove", (e) => {
    const g = game();
    if (!drag || !g) return;
    const p = svgPoint(drag.svg, e);
    const t = nearest(drag.svg, p.x, p.y);
    if (t !== drag.target) { drag.target = t; draw(g, t); }
  });
  const end = () => {
    if (!drag) return;
    const t = drag.target;
    drag.layer.remove();
    drag = null;
    const a = game() && yourArmy(game()!);
    done(t && a && t !== a.at ? t : null);
  };
  root.addEventListener("pointerup", end);
  root.addEventListener("pointercancel", end);
}
