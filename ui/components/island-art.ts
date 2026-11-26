// The island map's drawing kit (docs/art-direction.md, "For the island map"): an engraved-chart look in the
// Phoenician-Punic World's map palette. No game logic: ui/island.ts decides what to draw, this decides how.
// Coast and rivers: Natural Earth, public domain (ui/art/map-art.json, made by scripts/make-map-art.mjs).
// The hills, Etna, the compass and the cartouche are drawing aids, placed by eye; nothing cites them.
import art from "../art/map-art.json" with { type: "json" };
import sicily from "../art/sicily.json" with { type: "json" };
import { iconBody } from "./icons.ts";

// ---------- The frame: the same projection the island view has always used ----------
const BOX = sicily.box;
const K = 260; // px per degree of latitude
const COS = Math.cos((37.5 * Math.PI) / 180);
export const LEFT = 70; // room for the sea lane to Carthage
export const W = Math.round((BOX.e - BOX.w) * COS * K) + LEFT;
export const H = Math.round((BOX.n - BOX.s) * K);
export const X = (lon: number) => LEFT + (lon - BOX.w) * COS * K;
export const Y = (lat: number) => (BOX.n - lat) * K;
const f = (n: number) => n.toFixed(1);
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

// Sides: the same colours as the city table's swatches.
export const SIDE_COLOR: Record<string, string> = {
  syracuse: "#8e2a1c", ally: "#b0563f", free: "#5a4733", tributary: "#8a6aa0", carthage: "#5b2a63", exiles: "#2a4a5a",
};

const landD = (art.rings as number[][][]).map((r) => `M${r.map(([x, y]) => `${f(X(x))},${f(Y(y))}`).join("L")}Z`).join("");

// ---------- Relief, placed by eye: hill strokes along the north ranges, the Hyblaean and Sicani hills ----------
const HILLS: [number, number, number][] = [
  // lon, lat, size
  [13.95, 37.87, 1], [14.08, 37.9, 1.1], [14.22, 37.93, 1], [14.38, 37.95, 1.1], [14.55, 37.95, 1], [14.72, 37.97, 1], [14.88, 37.98, 1.05],
  [15.05, 38.0, .95], [15.22, 38.03, .95], [15.38, 38.1, .9], [13.78, 37.84, .9], [13.4, 37.68, .9], [13.25, 37.63, .85], [13.55, 37.7, .85],
  [14.3, 37.5, .8], [14.45, 37.55, .8], [14.15, 37.55, .75], [14.85, 37.12, .8], [14.98, 37.15, .75], [14.72, 37.1, .7], [12.85, 37.98, .8],
];
const hill = ([lon, lat, s]: [number, number, number]) => {
  const x = X(lon), y = Y(lat), w = 9 * s, h = 6 * s;
  let d = `M${f(x - w)},${f(y + h * .4)} Q${f(x - w * .3)},${f(y - h)} ${f(x)},${f(y - h)} Q${f(x + w * .4)},${f(y - h)} ${f(x + w)},${f(y + h * .4)}`;
  for (let i = 1; i <= 3; i++) { const hx = x + (w * i) / 4.5; d += ` M${f(hx)},${f(y - h * (1 - i / 4.2))} L${f(hx + 1.6)},${f(y + h * .3)}`; }
  return d;
};
function etna() {
  const x = X(14.995), y = Y(37.751);
  let hatch = "";
  for (let i = 0; i < 7; i++) hatch += `M${f(x + 3 + i * 3.2)},${f(y - 13 + i * 3.1)} L${f(x + 1 + i * 2.6)},${f(y + 10)} `;
  return `<g class="etna"><path d="M${f(x - 26)},${f(y + 10)} Q${f(x - 12)},${f(y - 4)} ${f(x - 5)},${f(y - 16)} L${f(x + 5)},${f(y - 16)} Q${f(x + 12)},${f(y - 4)} ${f(x + 26)},${f(y + 10)} Z" class="cone"/>
    <path d="${hatch}" class="hatch"/>
    <path d="M${f(x - 2)},${f(y - 18)} C${f(x - 8)},${f(y - 28)} ${f(x + 6)},${f(y - 32)} ${f(x)},${f(y - 42)} C${f(x - 6)},${f(y - 50)} ${f(x + 10)},${f(y - 54)} ${f(x + 6)},${f(y - 62)}" class="smoke"/>
    <text x="${f(x + 14)}" y="${f(y - 46)}" class="geo">Mount Aetna</text></g>`;
}

function rivers() {
  return (art.rivers as { name: string; label: string | null; lines: number[][][] }[]).map((r) => {
    const d = r.lines.map((l) => `M${l.map(([x, y]) => `${f(X(x))},${f(Y(y))}`).join("L")}`).join("");
    let label = "";
    if (r.label) {
      const l = r.lines.reduce((a, b) => (b.length > a.length ? b : a));
      const [x, y] = l[Math.floor(l.length * .45)];
      label = `<text x="${f(X(x) + 5)}" y="${f(Y(y) - 4)}" class="river-name">${esc(r.label)}</text>`;
    }
    return `<path d="${d}" class="river"/>${label}`;
  }).join("");
}

// The sea: fine horizontal strokes, broken, like an engraver's.
function seaHatch() {
  let d = "";
  for (let y = 6; y < H; y += 7) {
    let x = (y * 37) % 23;
    while (x < W) { const len = 10 + ((x * 7 + y * 3) % 18); d += `M${x},${y}h${len}`; x += len + 6 + ((x + y) % 9); }
  }
  return `<path d="${d}" class="sea-hatch"/>`;
}

function compass(cx: number, cy: number, r = 26) {
  const pt = (a: number, rr: number) => `${f(cx + Math.sin(a) * rr)},${f(cy - Math.cos(a) * rr)}`;
  let dark = "", light = "";
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, rr = i % 2 ? r * .62 : r, w = i % 2 ? .22 : .2;
    dark += `M${f(cx)},${f(cy)} L${pt(a - w, rr * .3)} L${pt(a, rr)} Z `;
    light += `M${f(cx)},${f(cy)} L${pt(a + w, rr * .3)} L${pt(a, rr)} Z `;
  }
  return `<g class="compass"><circle cx="${cx}" cy="${cy}" r="${r * .42}" class="ring"/><path d="${light}" class="light"/><path d="${dark}" class="dark"/>
    <circle cx="${cx}" cy="${cy}" r="2"/><text x="${cx}" y="${f(cy - r - 4)}" class="geo n">N</text></g>`;
}

function cartouche(x: number, y: number) {
  return `<g class="cartouche"><rect x="${x}" y="${y}" width="150" height="50" class="frame"/><rect x="${x + 4}" y="${y + 4}" width="142" height="42" class="inner"/>
    <text x="${x + 75}" y="${y + 23}" class="ct-title">Sicily</text><text x="${x + 75}" y="${y + 38}" class="ct-sub">405 to 395 BC</text></g>`;
}

/** The base map: sea, coast with water-lines, land, relief, rivers, Etna, compass, cartouche and sea names. */
export function islandBase(id = "isl") {
  return `<defs><clipPath id="${id}-land"><path d="${landD}"/></clipPath>
      <pattern id="${id}-speck" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".6" class="speck"/><circle cx="4.5" cy="4.2" r=".45" class="speck"/></pattern></defs>
    <rect width="${W}" height="${H}" class="sea-bg"/>${seaHatch()}
    <path d="${landD}" class="wl wl3"/><path d="${landD}" class="wl-gap wl3"/><path d="${landD}" class="wl wl2"/><path d="${landD}" class="wl-gap wl2"/><path d="${landD}" class="wl wl1"/><path d="${landD}" class="wl-gap wl1"/>
    <path d="${landD}" class="land-fill"/><rect width="${W}" height="${H}" fill="url(#${id}-speck)" clip-path="url(#${id}-land)"/>
    <path d="${landD}" class="coast"/>
    <g clip-path="url(#${id}-land)"><path d="${HILLS.map(hill).join(" ")}" class="hills"/>${rivers()}</g>
    ${etna()}
    <text x="${f(X(14.35))}" y="${f(Y(38.33))}" class="sea-name">Tyrrhenian Sea</text>
    <text x="${f(X(15.45))}" y="${f(Y(37.3))}" class="sea-name" transform="rotate(-72 ${f(X(15.45))} ${f(Y(37.3))})">Ionian Sea</text>
    <text x="${f(X(13.3))}" y="${f(Y(36.75))}" class="sea-name">The sea toward Libya</text>
    <text x="${f(X(15.66))}" y="${f(Y(38.4))}" class="geo italy">Italy</text>
    ${compass(W - 40, H - 44)}${cartouche(LEFT + 6, 8)}`;
}

export type CityOpts = { name: string; side: string; walled?: boolean; besieged?: boolean; capital?: boolean; fort?: boolean; approx?: boolean; label?: [number, number, "start" | "middle" | "end"] };

/** A city: a walled town (towers), an open town (roofs) or a fort on a hill, in its side's colour. */
export function cityMark(x: number, y: number, o: CityOpts) {
  const c = SIDE_COLOR[o.side] ?? SIDE_COLOR.free;
  const s = o.capital ? 1.25 : 1;
  let glyph: string;
  if (o.fort) {
    glyph = `<path d="M${f(x - 10)},${f(y + 6)} Q${f(x)},${f(y - 9)} ${f(x + 10)},${f(y + 6)} Z" class="hill-base"/>
      <path d="M${f(x - 6)},${f(y - 1)} V${f(y - 8)} M${f(x - 2)},${f(y - 2.5)} V${f(y - 10)} M${f(x + 2)},${f(y - 2.5)} V${f(y - 10)} M${f(x + 6)},${f(y - 1)} V${f(y - 8)}" class="palisade" style="stroke:${c}"/>`;
  } else if (o.walled) {
    glyph = `<g transform="translate(${f(x - 10 * s)} ${f(y - 12 * s)}) scale(${(20 * s / 24).toFixed(3)})" style="color:${c}" class="town">${iconBody("citadel")}</g>`;
  } else {
    const r = (dx: number, dy: number) => `<path d="M${f(x + dx - 4.6)},${f(y + dy)} L${f(x + dx)},${f(y + dy - 4.6)} L${f(x + dx + 4.6)},${f(y + dy)} V${f(y + dy + 5)} H${f(x + dx - 4.6)} Z"/><rect x="${f(x + dx - 1)}" y="${f(y + dy + 1.8)}" width="2" height="3.2" class="door"/>`;
    glyph = `<g fill="${c}" style="color:${c}" class="town open">${r(-5.6, 0)}${r(5.6, 0)}${r(0, -7)}</g>`;
  }
  const ring = o.capital ? `<circle cx="${f(x)}" cy="${f(y - 2)}" r="${f(17)}" class="cap-ring" style="stroke:${c}"/>` : "";
  let siege = "";
  if (o.besieged) {
    let d = "";
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, r1 = 17, r2 = 22; d += `M${f(x + Math.cos(a) * r1)},${f(y - 2 + Math.sin(a) * r1)}L${f(x + Math.cos(a) * r2)},${f(y - 2 + Math.sin(a) * r2)}`; }
    siege = `<circle cx="${f(x)}" cy="${f(y - 2)}" r="19.5" class="siege-line"/><path d="${d}" class="siege-ticks"/>`;
  }
  const [dx, dy, an] = o.label ?? [0, 22, "middle"];
  return `<g class="city side-${esc(o.side)}">${siege}${ring}${glyph}<text x="${f(x + dx)}" y="${f(y + dy)}" class="place" style="text-anchor:${an}">${esc(o.name)}${o.approx ? "?" : ""}</text></g>`;
}

/** An army: a round shield in its side's colour carrying its emblem (a helmet for Syracuse, a palm for Carthage), and its men. */
export function armyMark(x: number, y: number, o: { side: string; men: string; label?: string; dir?: 1 | -1 }) {
  const c = o.side === "carthage" ? SIDE_COLOR.carthage : SIDE_COLOR.syracuse;
  const emblem = o.side === "carthage" ? "palm" : "helmet";
  const dir = o.dir ?? (o.side === "carthage" ? -1 : 1);
  const tx = x + dir * 14;
  return `<g class="army-mark">${o.label ? `<title>${esc(o.label)}</title>` : ""}
    <circle cx="${f(x)}" cy="${f(y)}" r="10.5" fill="${c}" class="shield"/><circle cx="${f(x)}" cy="${f(y)}" r="8.4" class="shield-rim"/>
    <g transform="translate(${f(x - 7)} ${f(y - 7)}) scale(.5833)" class="emblem">${iconBody(emblem)}</g>
    <text x="${f(tx)}" y="${f(y + 4)}" class="men" style="text-anchor:${dir > 0 ? "start" : "end"}">${esc(o.men)}</text></g>`;
}

/** A route: roads as a dotted track with the days in a small ring; sea lanes as a dashed curve. */
export function routePath(a: [number, number], b: [number, number], kind: "road" | "sea", days?: number) {
  const [x1, y1] = a, [x2, y2] = b;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  if (kind === "sea") {
    const nx = -(y2 - y1) * .18, ny = (x2 - x1) * .18;
    return `<path d="M${f(x1)},${f(y1)} Q${f(mx + nx)},${f(my + ny)} ${f(x2)},${f(y2)}" class="sea-lane"/>`;
  }
  return `<path d="M${f(x1)},${f(y1)} L${f(x2)},${f(y2)}" class="road-under"/><path d="M${f(x1)},${f(y1)} L${f(x2)},${f(y2)}" class="road"/>${days != null ? `<g class="days"><circle cx="${f(mx)}" cy="${f(my)}" r="7"/><text x="${f(mx)}" y="${f(my + 3.2)}">${days}</text></g>` : ""}`;
}

/** The lane off the map to Carthage, with a ship on it. */
export function toCarthage(y: number, label = "To Carthage", sub = "two days' sail") {
  const x0 = X(12.45), y0 = y;
  return `<g class="offmap"><path d="M${f(x0)},${f(y0)} Q${f(LEFT - 10)},${f(y0 + 10)} 10,${f(y0 + 46)}" class="sea-lane carth"/>
    <path d="M10,${f(y0 + 46)} l9,-1 l-4,-7 z" class="arrow"/>
    <g transform="translate(${f(LEFT - 42)} ${f(y0 - 4)}) scale(.9)" class="ship">${iconBody("fleet")}</g>
    <text x="6" y="${f(y0 + 64)}" class="place" style="text-anchor:start">${esc(label)}</text><text x="6" y="${f(y0 + 79)}" class="days-t" style="text-anchor:start">${esc(sub)}</text></g>`;
}
