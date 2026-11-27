// Maps in the island map's palette (docs/art-direction.md, "For the island map"): sea, land, an engraved coast,
// rivers, sites as dots with labels, a frame, a compass, a scale in kilometres and stadia, and a credit line.
// Geography comes from tools/data/ (made by prep-data.mjs) and the game's own ui/art/ and data/island.json.
// Every map is today's coast: a drawing, not evidence.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { C, doc, esc, f1, FONTS } from "./style.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, "../data");
const GAME = join(HERE, "../../../..");
const J = (p) => JSON.parse(readFileSync(p, "utf8"));

const RIVER = "#8fa6a8", HALO = C.page;
const STADION_KM = 0.185; // an Attic stadion, about 185 m; stadia varied from city to city (general knowledge)

// Equirectangular, squeezed by the cosine of the middle latitude, like ui/components/island-art.ts.
function projection(box, width, pad = 0) {
  const cos = Math.cos((((box.n + box.s) / 2) * Math.PI) / 180);
  const k = (width - 2 * pad) / ((box.e - box.w) * cos);
  const height = Math.round((box.n - box.s) * k + 2 * pad);
  return { width, height, k, cos, X: (lon) => pad + (lon - box.w) * cos * k, Y: (lat) => pad + (box.n - lat) * k, kmPerPx: 111.2 / k };
}

const path = (pts, P, close) => "M" + pts.map(([lon, lat]) => `${f1(P.X(lon))} ${f1(P.Y(lat))}`).join(" L") + (close ? " Z" : "");

// Land as closed rings, with two soft strokes under it for the engraver's ripple lines along the shore.
function land(rings, P) {
  const d = rings.map((r) => path(r, P, true)).join(" ");
  return `<path d="${d}" fill="none" stroke="${C.coast}" stroke-width="7" stroke-opacity=".08" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${C.coast}" stroke-width="3.4" stroke-opacity=".16" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="${C.land}" stroke="${C.coast}" stroke-width=".9" stroke-linejoin="round" fill-rule="evenodd"/>`;
}

function rivers(list, P, w = 0.9) {
  return list.map((r) => r.lines.map((l) => `<path d="${path(l, P)}" fill="none" stroke="${RIVER}" stroke-width="${r.rank && r.rank > 6 ? w * 0.7 : w}"${r.sketch ? ' stroke-dasharray="2 2"' : ""} stroke-linecap="round" stroke-linejoin="round"/>`).join("")).join("");
}

// Greedy label placement: try eight spots round each dot and keep the first that hits no earlier label or dot.
function labels(sites, P, { size = 11, bounds }) {
  const boxes = [];
  const hit = (b) => boxes.some((o) => b.x < o.x + o.w && b.x + b.w > o.x && b.y < o.y + o.h && b.y + b.h > o.y);
  const inside = (b) => b.x > bounds.x0 && b.y > bounds.y0 && b.x + b.w < bounds.x1 && b.y + b.h < bounds.y1;
  for (const s of sites) boxes.push({ x: P.X(s.lon) - 3, y: P.Y(s.lat) - 3, w: 6, h: 6 });
  let out = "";
  for (const s of sites) {
    if (s.nolabel) continue;
    const x = P.X(s.lon), y = P.Y(s.lat), fs = s.size ?? size;
    const w = s.label.length * fs * 0.52, h = fs;
    const tries = s.at ? [s.at] : ["e", "w", "ne", "se", "nw", "sw", "n", "s"];
    let pick = null;
    for (const t of tries) {
      const dx = { e: 5, w: -5 - w, ne: 4, se: 4, nw: -4 - w, sw: -4 - w, n: -w / 2, s: -w / 2 }[t];
      const dy = { e: -h / 2, w: -h / 2, ne: -h - 2, se: 2, nw: -h - 2, sw: 2, n: -h - 5, s: 5 }[t];
      const b = { x: x + dx, y: y + dy, w, h };
      if (s.at || (!hit(b) && inside(b))) { pick = b; break; }
    }
    if (!pick) pick = { x: x + 5, y: y - h / 2, w, h };
    boxes.push(pick);
    const style = `font-family="${FONTS.body}" font-size="${fs}"${s.italic ? ' font-style="italic"' : ""}`;
    const tx = f1(pick.x), ty = f1(pick.y + h * 0.82);
    out += `<text x="${tx}" y="${ty}" ${style} fill="none" stroke="${HALO}" stroke-width="3" stroke-linejoin="round">${esc(s.label)}</text>` +
      `<text x="${tx}" y="${ty}" ${style} fill="${s.color ?? C.ink}">${esc(s.label)}</text>`;
  }
  return out;
}

function dots(sites, P) {
  return sites.map((s) => {
    if (s.italic && !s.dot) return "";
    const x = f1(P.X(s.lon)), y = f1(P.Y(s.lat)), r = s.r ?? 2.6;
    if (s.rough) return `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.page}" stroke="${C.ink}" stroke-width="1"/>`;
    return `<circle cx="${x}" cy="${y}" r="${r + 0.9}" fill="${C.page}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${s.color ?? C.ink}"/>`;
  }).join("");
}

// Big spaced capitals for lands and seas.
const region = (text, lon, lat, P, size = 16, color = C.muted) =>
  `<text x="${f1(P.X(lon))}" y="${f1(P.Y(lat))}" font-family="${FONTS.display}" font-size="${size}" letter-spacing="${size * 0.35}" fill="${color}" fill-opacity=".75" text-anchor="middle">${esc(text)}</text>`;

function compass(x, y, r = 22) {
  const pt = (a, rr) => `${f1(x + rr * Math.sin(a))} ${f1(y - rr * Math.cos(a))}`;
  let s = `<circle cx="${x}" cy="${y}" r="${r * 0.62}" fill="none" stroke="${C.muted}" stroke-width=".7"/>`;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, big = i % 2 === 0, rr = big ? r : r * 0.6, w = big ? 0.22 : 0.3;
    s += `<path d="M${pt(a, rr)} L${pt(a + w, r * 0.16)} L${x} ${y} Z" fill="${C.ink}"/><path d="M${pt(a, rr)} L${pt(a - w, r * 0.16)} L${x} ${y} Z" fill="${C.page}" stroke="${C.ink}" stroke-width=".5"/>`;
  }
  return s + `<text x="${x}" y="${f1(y - r - 4)}" font-family="${FONTS.display}" font-size="11" fill="${C.ink}" text-anchor="middle">N</text>`;
}

// A scale bar in kilometres with stadia beneath, sized to a round number.
function scale(x, y, P, maxPx = 160) {
  const nice = (v) => [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000].reduce((a, b) => (b <= v ? b : a), 1);
  const km = nice(maxPx * P.kmPerPx), wkm = km / P.kmPerPx;
  const st = nice((maxPx * P.kmPerPx) / STADION_KM), wst = (st * STADION_KM) / P.kmPerPx;
  const bar = (yy, w, n, label) => {
    let s = "";
    for (let i = 0; i < n; i++) s += `<rect x="${f1(x + (i * w) / n)}" y="${yy}" width="${f1(w / n)}" height="3.4" fill="${i % 2 ? C.page : C.ink}" stroke="${C.ink}" stroke-width=".5"/>`;
    return s + `<text x="${f1(x + w + 5)}" y="${yy + 3.6}" font-family="${FONTS.body}" font-size="9" fill="${C.ink}">${label}</text>`;
  };
  return `<rect x="${x - 6}" y="${y - 6}" width="${f1(Math.max(wkm, wst) + 70)}" height="27" fill="${C.page}" fill-opacity=".8"/>` + bar(y, wkm, 4, `${km} km`) + bar(y + 9, wst, 4, `${st} stadia (of about 185 m)`);
}

// Frame, title cartouche and credit line round the map body.
function frame(P, title, sub, credit, { m = 14 } = {}) {
  const W = P.width, H = P.height;
  const tw = Math.max(title.length * 9.5, sub.length * 5.4) + 26;
  return `<rect x="${m / 2}" y="${m / 2}" width="${W - m}" height="${H - m}" fill="none" stroke="${C.ink}" stroke-width="1.6"/>` +
    `<rect x="${m / 2 + 4}" y="${m / 2 + 4}" width="${W - m - 8}" height="${H - m - 8}" fill="none" stroke="${C.ink}" stroke-width=".6"/>` +
    `<g><rect x="${m + 8}" y="${m + 8}" width="${f1(tw)}" height="${sub ? 46 : 30}" fill="${C.page}" stroke="${C.ink}" stroke-width=".8"/>` +
    `<rect x="${m + 11}" y="${m + 11}" width="${f1(tw - 6)}" height="${sub ? 40 : 24}" fill="none" stroke="${C.rule}" stroke-width=".6"/>` +
    `<text x="${m + 21}" y="${m + 31}" font-family="${FONTS.display}" font-size="17" fill="${C.ink}">${esc(title)}</text>` +
    (sub ? `<text x="${m + 21}" y="${m + 47}" font-family="${FONTS.body}" font-size="9.5" font-style="italic" fill="${C.muted}">${esc(sub)}</text>` : "") + `</g>` +
    `<rect x="${f1(W - m - 10 - credit.length * 4.3)}" y="${H - m - 16}" width="${f1(credit.length * 4.3 + 6)}" height="13" fill="${C.page}" fill-opacity=".85"/>` +
    `<text x="${W - m - 6}" y="${H - m - 6}" font-family="${FONTS.body}" font-size="8" fill="${C.muted}" text-anchor="end">${esc(credit)}</text>`;
}

function mapDoc({ P, title, sub, credit, body, desc, bare }) {
  const W = P.width, H = P.height;
  const inner = `<rect width="${W}" height="${H}" fill="${C.sea}"/><clipPath id="mapclip"><rect x="11" y="11" width="${W - 22}" height="${H - 22}"/></clipPath><g clip-path="url(#mapclip)">${body}</g>` +
    (bare ? `<rect x="7" y="7" width="${W - 14}" height="${H - 14}" fill="none" stroke="${C.ink}" stroke-width="1.2"/><text x="${W - 14}" y="${H - 13}" font-family="${FONTS.body}" font-size="8" fill="${C.muted}" text-anchor="end">${esc(credit)}</text>` : frame(P, title, sub, credit));
  return doc({ w: W, h: H, title, desc, body: inner });
}

// ---------------------------------------------------------------------------------------------------------------
const PL = () => J(join(DATA, "places.json")).places;
const NE_CREDIT = "Coast and rivers: Natural Earth, public domain.";
const PL_CREDIT = "Sites: Pleiades, CC BY 3.0.";
const skipName = (n) => /river|islands|headland|Holy Isle|Lacinium/i.test(n);
const tidy = (n) => n.replace(" (Messana)", "").replace("Soloeis (Soluntum)", "Soloeis").replace("Himeraean Thermae", "Thermae");

function placeSites(box) {
  // keep a thin margin so no dot or label is cut by the frame
  const mx = (box.e - box.w) * 0.03, my = (box.n - box.s) * 0.03;
  return PL().filter((p) => p.lon >= box.w + mx && p.lon <= box.e - mx && p.lat >= box.s + my && p.lat <= box.n - my && !skipName(p.name))
    .map((p) => ({ lon: p.lon, lat: p.lat, label: tidy(p.name), rough: p.precision === "rough" || p.name.includes("(?)") }));
}

export function MAPS() {
  const out = [];
  const add = (id, title, tags, P, text, note, places = []) =>
    out.push({ rel: `maps/${id}.svg`, text, id: `map-${id}`, type: "map", title, tags, note, width: P.width, height: P.height, places });

  const central = J(join(DATA, "central-med-land.json"));
  const whole = J(join(DATA, "whole-med-land.json"));
  const rv = J(join(DATA, "central-med-rivers.json")).rivers;
  const sicily = J(join(GAME, "ui/art/sicily.json"));
  const art = J(join(GAME, "ui/art/map-art.json"));
  const island = J(join(GAME, "data/island.json"));
  const B = (P) => ({ x0: 14, y0: 70, x1: P.width - 14, y1: P.height - 24 });

  // ---- 1. Sicily: the ancient sites ----
  {
    const box = { w: 12.15, e: 15.85, s: 36.5, n: 38.62 };
    const P = projection(box, 1400);
    const sites = placeSites(box);
    const body = land(central.rings, P) + rivers(rv, P, 1) + region("SICILY", 13.75, 37.8, P, 24) +
      dots(sites, P) + labels(sites, P, { size: 11, bounds: B(P) }) + compass(P.width - 60, 70) + scale(40, P.height - 60, P);
    const text = mapDoc({ P, title: "Sicily: the ancient sites", sub: "Pleiades locations; hollow dots are rough or doubtful", credit: `${NE_CREDIT} ${PL_CREDIT} Labels, frame and drawing: invention.`, body,
      desc: "Every Pleiades site on Sicily saved in the Phoenician-Punic World repo. Today's coast: a drawing, not evidence." });
    add("sicily-sites", "Sicily: the ancient sites", ["sicily", "island", "cities", "sites", "pleiades", "overview"], P, text,
      "Site positions are Pleiades' (CC BY 3.0); label positions are chosen by the script.", sites.map((s) => s.label));
  }

  // ---- 2. Sicily in 405: the game's island, by side, with the game's roads ----
  {
    const box = { w: 11.3, e: 15.95, s: 36.35, n: 38.65 };
    const P = projection(box, 1400);
    const SIDE = { syracuse: "#8e2a1c", ally: "#b0563f", free: C.muted, tributary: "#8a6aa0", carthage: C.punic, exiles: C.rich };
    const nodes = Object.fromEntries(island.nodes.map((n) => [n.id, n]));
    let routes = "";
    for (const r of island.routes) {
      const a = nodes[r.from], b = nodes[r.to];
      if (!a || !b) continue;
      routes += `<path d="M${f1(P.X(a.lon))} ${f1(P.Y(a.lat))} L${f1(P.X(b.lon))} ${f1(P.Y(b.lat))}" stroke="${C.accent}" stroke-width="1.3" stroke-dasharray="5 3" fill="none"/>`;
      routes += `<text x="${f1((P.X(a.lon) + P.X(b.lon)) / 2)}" y="${f1((P.Y(a.lat) + P.Y(b.lat)) / 2 - 3)}" font-family="${FONTS.num}" font-size="10" fill="${C.accent}" text-anchor="middle">${r.days} days</text>`;
    }
    // Carthage lies off the map to the south-west: an arrow from the corner to each landing.
    const cLon = box.w + 0.12, cLat = box.s + 0.25;
    let sea = "";
    for (const l of island.carthage.landings) {
      const n = nodes[l];
      if (n) sea += `<path d="M${f1(P.X(cLon))} ${f1(P.Y(cLat))} Q${f1((P.X(cLon) + P.X(n.lon)) / 2)} ${f1((P.Y(cLat) + P.Y(n.lat)) / 2 + 30)} ${f1(P.X(n.lon))} ${f1(P.Y(n.lat))}" stroke="${C.punic}" stroke-width="1.2" stroke-dasharray="2 3" fill="none"/>`;
    }
    const sites = island.nodes.map((n) => ({ lon: n.lon, lat: n.lat, label: n.name, color: SIDE[n.side], r: n.type === "fort" ? 3.2 : 4.4 }));
    sites.push({ lon: cLon, lat: cLat, label: "to Carthage", color: C.punic, r: 3, italic: true, dot: true, at: "ne" });
    const nS = Object.keys(island.sides).length, ky = P.height - 60 - nS * 17;
    let key = `<rect x="${P.width - 300}" y="${ky - 18}" width="250" height="${nS * 17 + 30}" fill="${C.page}" stroke="${C.ink}" stroke-width=".7"/>`;
    Object.entries(island.sides).forEach(([k, label], i) => {
      key += `<circle cx="${P.width - 286}" cy="${ky + i * 17}" r="4.4" fill="${SIDE[k]}"/><text x="${P.width - 274}" y="${ky + i * 17 + 4}" font-family="${FONTS.body}" font-size="11" fill="${C.ink}">${esc(label)}</text>`;
    });
    key += `<path d="M${P.width - 294} ${ky + nS * 17 - 2} H${P.width - 278}" stroke="${C.accent}" stroke-width="1.3" stroke-dasharray="5 3"/><text x="${P.width - 274}" y="${ky + nS * 17 + 2}" font-family="${FONTS.body}" font-size="11" fill="${C.ink}">road, days' march (game)</text>`;
    const body = land(sicily.rings, P) + rivers(art.rivers, P, 1.1) + routes + sea + dots(sites, P) +
      labels(sites, P, { size: 13, bounds: B(P) }) + key + compass(P.width - 60, 70) + scale(40, P.height - 60, P);
    const text = mapDoc({ P, title: "Sicily in 405 BC: who held what", sub: "Sides from data/island.json; roads and their days are the game's invention", credit: `${NE_CREDIT} Site positions: data/island.json. Drawing: invention.`, body,
      desc: "The game's island scenario (data/island.json): each city coloured by its side in 405 BC as carded in docs/research/island-405-395.md, with the game's roads." });
    add("sicily-405-sides", "Sicily in 405 BC: who held what (the game's island)", ["sicily", "405 bc", "sides", "carthage", "roads", "island scenario", "game"], P, text,
      "Sides follow data/island.json, which cards them to docs/research/island-405-395.md. Road lengths are the game's invention.", sites.map((s) => s.label));
  }

  // ---- 3. The central Mediterranean ----
  {
    const box = { w: 7.6, e: 19.2, s: 33.6, n: 42.2 };
    const P = projection(box, 1400);
    const want = ["Carthage", "Utica", "Kerkouane", "Hadrumetum", "Syracuse", "Motya", "Panormus", "Agrigentum", "Selinus", "Gela", "Himera", "Messene (Messana)", "Rhegium", "Locri", "Croton", "Thurii", "Tarentum", "Metapontum", "Neapolis", "Cumae", "Rome", "Melita", "Lipara", "Catana", "Elea", "Lilybaeum"];
    const sites = PL().filter((p) => want.includes(p.name)).map((p) => ({ lon: p.lon, lat: p.lat, label: tidy(p.name), rough: p.precision === "rough" }));
    const body = land(central.rings, P) + rivers(rv.filter((r) => (r.rank ?? 9) <= 6 || r.sketch), P, 0.8) +
      region("SICILY", 14.1, 37.5, P, 15) + region("ITALY", 15.3, 40.9, P, 18) + region("AFRICA", 9.6, 34.9, P, 18) + region("SARDINIA", 9.05, 40.1, P, 12) +
      dots(sites, P) + labels(sites, P, { size: 11.5, bounds: B(P) }) + compass(P.width - 60, 70) + scale(40, P.height - 60, P);
    const text = mapDoc({ P, title: "The central Mediterranean", sub: "Sicily between Carthage and the Greek cities of Italy", credit: `${NE_CREDIT} ${PL_CREDIT} Drawing: invention.`, body,
      desc: "Sicily, south Italy and the coast of Africa round Carthage. Today's coast." });
    add("central-mediterranean", "The central Mediterranean", ["mediterranean", "carthage", "italy", "sicily", "africa", "overview", "sea lanes"], P, text, "Site positions are Pleiades'.", sites.map((s) => s.label));
  }

  // ---- 4. Magna Graecia: the Greek cities of south Italy ----
  {
    const box = { w: 13.7, e: 17.6, s: 37.75, n: 41.25 };
    const P = projection(box, 1100);
    const sites = placeSites(box);
    const body = land(central.rings, P) + rivers(rv, P, 0.9) + region("ITALY", 16.2, 40.75, P, 18) + region("SICILY", 14.6, 37.95, P, 13) +
      dots(sites, P) + labels(sites, P, { size: 11.5, bounds: B(P) }) + compass(P.width - 60, 70) + scale(40, P.height - 60, P);
    const text = mapDoc({ P, title: "The Greek cities of Italy", sub: "Where Heloris raised the Italian Greeks", credit: `${NE_CREDIT} ${PL_CREDIT} Drawing: invention.`, body,
      desc: "South Italy with the Greek cities in the Pleiades data: Rhegium, Locri, Croton, Thurii and the rest." });
    add("magna-graecia", "The Greek cities of Italy", ["italy", "magna graecia", "locri", "rhegium", "croton", "heloris", "doris of locri"], P, text,
      "The subtitle refers to Heloris leading the Italian Greeks about 389 (rising-cast.md, Diodorus 14.103.5). Site positions are Pleiades'.", sites.map((s) => s.label));
  }

  // ---- 5. The Punic west of Sicily ----
  {
    const box = { w: 11.95, e: 13.95, s: 37.3, n: 38.28 };
    const P = projection(box, 1200);
    const sites = PL().filter((p) => p.lon >= box.w && p.lon <= box.e && p.lat >= box.s && p.lat <= box.n)
      .map((p) => ({ lon: p.lon, lat: p.lat, label: tidy(p.name.replace(" (?)", "?")), rough: p.precision === "rough" || p.name.includes("(?)"), italic: /river|islands|Isle/.test(p.name) }));
    const body = land(central.rings, P) + rivers(rv, P, 1.2) + dots(sites, P) + labels(sites, P, { size: 12, bounds: B(P) }) +
      compass(P.width - 60, 70) + scale(40, P.height - 60, P);
    const text = mapDoc({ P, title: "The Punic west of Sicily", sub: "Motya, Lilybaeum, Eryx, Segesta and Panormus", credit: `${NE_CREDIT} ${PL_CREDIT} Drawing: invention. Motya's lagoon is too small for this coast.`, body,
      desc: "Western Sicily, Carthage's corner of the island. Natural Earth's 1:10m coast is too coarse to show the Stagnone lagoon round Motya." });
    add("west-sicily", "The Punic west of Sicily", ["sicily", "carthage", "punic", "motya", "lilybaeum", "eryx", "segesta", "panormus", "siege of motya"], P, text, "Site positions are Pleiades'.", sites.map((s) => s.label));
  }

  // ---- 6. The whole Mediterranean ----
  {
    const box = { w: -6.5, e: 36.5, s: 29.5, n: 45.5 };
    const P = projection(box, 1600);
    const want = ["Carthage", "Syracuse", "Massalia", "Rome", "Corinth", "Sparta", "Cyrene", "Tyre", "Sidon", "Utica", "Locri", "Tarentum"];
    const sites = PL().filter((p) => want.includes(p.name)).map((p) => ({ lon: p.lon, lat: p.lat, label: p.name, rough: p.precision === "rough" }));
    const body = land(whole.rings, P) + region("SICILY", 14.1, 36.9, P, 10) + region("AFRICA", 8, 31.4, P, 18) + region("GREECE", 22.4, 39.6, P, 13) + region("ITALY", 13.6, 42.6, P, 13) +
      dots(sites, P) + labels(sites, P, { size: 12, bounds: B(P) }) + compass(P.width - 60, 70) + scale(40, P.height - 60, P);
    const text = mapDoc({ P, title: "The Mediterranean", sub: "Syracuse, Carthage and the mother cities", credit: `Coast: Natural Earth 1:50m, public domain. ${PL_CREDIT} Drawing: invention.`, body,
      desc: "The whole sea, with Syracuse, Carthage, Corinth (Syracuse's founder), Sparta, Tyre and Sidon." });
    add("mediterranean", "The Mediterranean", ["mediterranean", "overview", "corinth", "sparta", "tyre", "carthage", "world map"], P, text,
      "Corinth founded Syracuse and Tyre founded Carthage (general knowledge). Site positions are Pleiades'.", sites.map((s) => s.label));
  }

  // ---- 7. Syracuse and its quarters ----
  {
    const sy = J(join(DATA, "syracuse.json"));
    const box = sy.box;
    const P = projection(box, 1300);
    const ln = sy.coast.lines[0];
    // The mainland line runs south to north with land on its left (west): close it round the west edge to fill.
    const fill = path([...ln, [box.w - 0.01, box.n + 0.01], [box.w - 0.01, box.s - 0.01]], P, true);
    const rings = sy.coast.rings.map((r) => path(r, P, true)).join(" ");
    const d = `${fill} ${rings}`;
    const coast = `<path d="${d}" fill="none" stroke="${C.coast}" stroke-width="8" stroke-opacity=".08"/><path d="${d}" fill="none" stroke="${C.coast}" stroke-width="3.6" stroke-opacity=".16"/>` +
      `<path d="${d}" fill="${C.land}" stroke="none"/><path d="${path(ln, P)} ${rings}" fill="none" stroke="${C.coast}" stroke-width="1"/>`;
    const cliffs = sy.cliffs.map((l) => `<path d="${path(l, P)}" fill="none" stroke="${C.muted}" stroke-width="1.6" stroke-dasharray="1.2 1.6" stroke-opacity=".55"/>`).join("");
    const NAME = { Euryelos: "Euryalus fort", "Cyanes Fons": "Cyane spring", Hexapyla: "Hexapyla", "Temple of Olympian Zeus, Syracuse": "Olympieion", "Greek Theater at Syracuse": "Theatre",
      Epipolai: "Epipolae", "Neapolis of Syracuse": "Neapolis", "Arethusae Fons": "Arethusa spring", "Temple of Apollo at Syracuse": "Temple of Apollo", "Ortygia (island)": "Ortygia", "Plemmyrium (promontory)": "Plemmyrium" };
    const sites = sy.topo.filter((t) => NAME[t.title]).map((t) => ({ lon: t.lon, lat: t.lat, label: NAME[t.title], italic: /spring/.test(NAME[t.title]), dot: true, r: 2.4 }));
    const body = coast + cliffs + region("GREAT HARBOUR", 15.285, 37.045, P, 12, "#6d8790") +
      dots(sites, P) + labels(sites, P, { size: 12.5, bounds: B(P) }) + compass(P.width - 60, 70) + scale(40, P.height - 60, P);
    const text = mapDoc({ P, title: "Syracuse", sub: "Ortygia, the harbours and the Epipolae heights; dotted lines are today's cliffs", credit: "Coast and cliffs: (c) OpenStreetMap contributors, ODbL. Sites: Pleiades, CC BY 3.0. Harbour label placed by eye. Drawing: invention.", body,
      desc: "Syracuse from today's OpenStreetMap coast and cliffs, with the ancient sites Pleiades locates. The Dionysian walls are not drawn: no saved source traces them." });
    add("syracuse", "Syracuse: Ortygia, the harbours and Epipolae", ["syracuse", "ortygia", "epipolae", "euryalus", "great harbour", "city plan", "walls"], P, text,
      "OpenStreetMap data is ODbL: keep the credit line. The Great Harbour label is placed by eye; the walls are not drawn because no saved source traces them.", sites.map((s) => s.label));
  }

  // ---- 8. Blank base maps for the game to draw on ----
  const blank = (id, title, box, width, rings, rvs, credit) => {
    const P = projection(box, width);
    add(`${id}-blank`, `${title} (blank base map)`, ["base map", "blank", "no labels", id], P,
      mapDoc({ P, title, sub: "", credit, body: land(rings, P) + (rvs ? rivers(rvs, P, 1) : ""), bare: true, desc: `Coast${rvs ? " and rivers" : ""} only, for drawing on. Bounds ${JSON.stringify(box)} (equirectangular, x squeezed by cos of the mid latitude).` }),
      `Bounds ${JSON.stringify(box)}; x = (lon - w) * cos(mid lat) * k, y = (n - lat) * k, where k = width / ((e - w) * cos(mid lat)).`);
  };
  blank("sicily", "Sicily", { w: 12.15, e: 15.85, s: 36.5, n: 38.62 }, 1400, central.rings, rv, NE_CREDIT);
  blank("central-mediterranean", "The central Mediterranean", { w: 7.6, e: 19.2, s: 33.6, n: 42.2 }, 1400, central.rings, null, "Coast: Natural Earth, public domain.");
  blank("mediterranean", "The Mediterranean", { w: -6.5, e: 36.5, s: 29.5, n: 45.5 }, 1600, whole.rings, null, "Coast: Natural Earth 1:50m, public domain.");
  return out;
}
