// Coins and tokens: silver and bronze coins with the city badges of the new icons, faction tokens, office seals,
// and blank flans for the interface. All drawn here; the badges follow well-known coin types but nothing is copied
// from a photograph, and the Greek legends are my own spelling of each city's name (unchecked against a coin).
import * as F from "../../../../ui/components/figures.ts";
import { iconBody } from "../../../../ui/components/icons.ts";
import { NEW_ICONS } from "./icons-new.mjs";
import { C, doc, esc, f2, rng } from "./style.mjs";

const NEW = Object.fromEntries(NEW_ICONS.map((i) => [i.id, i.body]));
const body = (id) => NEW[id] ?? iconBody(id);

export const METALS = {
  silver: { hi: "#eceae3", mid: "#c9c6bc", lo: "#8f8b80", deep: "#5d5a52", rim: "#a9a59a" },
  bronze: { hi: "#d9a66b", mid: "#a8743d", lo: "#6f4a24", deep: "#47301a", rim: "#8a5c2e" },
  gold: { hi: "#f5dc8c", mid: "#d6ae4a", lo: "#9c7a26", deep: "#5e4712", rim: "#b8913a" },
  lead: { hi: "#b4b6b6", mid: "#8b8e8f", lo: "#5d6062", deep: "#3c3e40", rim: "#6f7274" },
};

// A struck flan: slightly irregular edge (seeded, so the same every build), a raised rim and a ring of pellets.
export function flan(id, metal, { r = 54, wobble = 1.6, beads = 52, gradId = `g-${id}` } = {}) {
  const m = METALS[metal];
  const rand = rng([...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7));
  const pts = [];
  const n = 72;
  const ph = [rand() * 6, rand() * 6, rand() * 6];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r + wobble * (Math.sin(a * 2 + ph[0]) * 0.6 + Math.sin(a * 3 + ph[1]) * 0.4 + Math.sin(a * 5 + ph[2]) * 0.25);
    pts.push(`${f2(60 + rr * Math.cos(a))} ${f2(60 + rr * Math.sin(a))}`);
  }
  const defs = `<defs><radialGradient id="${gradId}" cx="42%" cy="36%" r="70%"><stop offset="0" stop-color="${m.hi}"/><stop offset=".55" stop-color="${m.mid}"/><stop offset="1" stop-color="${m.lo}"/></radialGradient></defs>`;
  let s = defs + `<path d="M${pts.join(" L")} Z" fill="url(#${gradId})" stroke="${m.deep}" stroke-width=".8"/>`;
  s += `<circle cx="60" cy="60" r="${r - 5.5}" fill="none" stroke="${m.lo}" stroke-width=".7" opacity=".7"/>`;
  for (let i = 0; i < beads; i++) {
    const a = (i / beads) * Math.PI * 2;
    s += `<circle cx="${f2(60 + (r - 8.6) * Math.cos(a))}" cy="${f2(60 + (r - 8.6) * Math.sin(a))}" r="1.05" fill="${m.lo}"/>`;
  }
  return s;
}

// A design struck in relief: a dark shadow copy offset down-right, a light copy up-left, then the face itself.
export function relief(svgBody, metal, { x = 0, y = 0, s = 1 } = {}) {
  const m = METALS[metal];
  const g = (dx, dy, col, op = 1) =>
    `<g transform="translate(${f2(x + dx)} ${f2(y + dy)}) scale(${s})" color="${col}" fill="${col}" opacity="${op}">${svgBody}</g>`;
  return g(0.9, 1.1, m.deep, 0.85) + g(-0.5, -0.6, m.hi, 0.9) + g(0, 0, m.lo);
}

// Capitals round the top of the coin, the way legends run.
export function legend(text, metal, { r = 40.5, size = 7.2, start = 200, end = 340, id = "lg", fill, bottom = false } = {}) {
  const m = METALS[metal] ?? {};
  const a0 = (start * Math.PI) / 180, a1 = (end * Math.PI) / 180;
  const p = (a) => `${f2(60 + r * Math.cos(a))} ${f2(60 + r * Math.sin(a))}`;
  // Along the top the path runs clockwise; along the bottom it runs the other way, so the letters stay upright.
  const d = bottom ? `M${p(a1)} A${r} ${r} 0 0 0 ${p(a0)}` : `M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}`;
  return `<defs><path id="${id}" d="${d}"/></defs><text font-family="'GFS Didot', 'Cormorant Garamond', Georgia, serif" font-size="${size}" letter-spacing="1.4" fill="${fill ?? m.deep}" text-anchor="middle"><textPath href="#${id}" startOffset="50%">${esc(text)}</textPath></text>`;
}

const coinCss = (metal) => {
  const m = METALS[metal];
  return `.line{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}.cut{fill:${m.mid}}.cut.line{fill:none;stroke:${m.mid}}.hair{stroke:${m.lo};stroke-width:.45}`;
};
const coinDoc = (title, desc, metal, inner) => doc({ w: 120, h: 120, px: [240, 240], title, desc, css: coinCss(metal), body: inner });

const CITY = [
  // id, city, badge icon, metal, legend (my spelling; "" = none)
  ["akragas-crab", "Akragas", "crab", "silver", "ΑΚΡΑΓΑΣ"],
  ["akragas-eagle", "Akragas", "eagle", "silver", "ΑΚΡΑΓΑΣ"],
  ["himera-cock", "Himera", "cock", "silver", "ΙΜΕΡΑ"],
  ["segesta-hound", "Segesta", "hound", "silver", "ΣΕΓΕΣΤΑ"],
  ["selinus-leaf", "Selinus", "selinon", "silver", "ΣΕΛΙΝΟΣ"],
  ["gela-bull", "Gela", "bull", "silver", "ΓΕΛΑΣ"],
  ["leontini-lion", "Leontini", "lionmask", "silver", "ΛΕΟΝΤΙΝΟΙ"],
  ["rhegium-lion", "Rhegium", "lionmask", "silver", "ΡΗΓΙΟΝ"],
  ["messana-hare", "Messana", "hare", "silver", "ΜΕΣΣΑΝΑ"],
  ["kamarina-swan", "Kamarina", "swan", "silver", "ΚΑΜΑΡΙΝΑ"],
  ["naxos-grapes", "Naxos", "grapes", "silver", "ΝΑΞΟΣ"],
  ["corinth-koppa", "Corinth", "koppa", "silver", ""],
  ["sicily-triskeles", "Sicily", "triskeles", "silver", ""],
  ["syracuse-dolphin", "Syracuse (bronze)", "dolphin", "bronze", "ΣΥΡΑ"],
  ["syracuse-trident", "Syracuse (bronze)", "trident", "bronze", "ΣΥΡΑ"],
  ["carthage-palm", "Carthage (Siculo-Punic)", "palm", "silver", ""],
  ["carthage-horse", "Carthage (Siculo-Punic)", "horse", "silver", ""],
];

export function COINS() {
  const out = [];
  const add = (id, title, tags, metal, inner, note) =>
    out.push({ rel: `coins/${id}.svg`, text: coinDoc(title, note ?? "", metal, inner), id: `coin-${id}`, type: "coin", title, tags, metal, note });

  for (const [id, city, badge, metal, leg] of CITY) {
    const isPunic = city.startsWith("Carthage");
    const note = isPunic
      ? "A Punic-style coin with a game icon as its badge (Carthage struck palm and horse types in Sicily: general knowledge, unverified). No legend."
      : `The ${city.replace(/ \(.*/, "")} badge follows a well-known coin type (general knowledge, unverified); the drawing is invention${leg ? ", and the legend is my spelling" : ""}.`;
    const s = leg ? 2.75 : 3.2;
    const off = 60 - 12 * s;
    add(id, `${city} coin, ${badge}`, [city.toLowerCase().split(" ")[0], "coin", metal, badge, isPunic ? "punic" : "greek city"], metal,
      flan(id, metal) + relief(body(badge), metal, { x: off, y: leg ? off + 4 : off, s }) + (leg ? legend(leg, metal, { id: `lg-${id}` }) : ""), note);
  }

  // Syracuse's own type: the nymph's head among dolphins (sourced: docs/research/art-motifs.md); the head is invention.
  {
    const id = "syracuse-arethusa", metal = "silver";
    const head = F.head(58, 63, 1, { hair: "bun" }, 3.3);
    const dol = (x, y, r, flip) => `<g transform="translate(${x} ${y}) rotate(${r} 6 6) scale(${flip ? -0.5 : 0.5} 0.5)${flip ? " translate(-24 0)" : ""}">${body("dolphin")}</g>`;
    const ring = dol(22, 24, -40, false) + dol(86, 26, 40, true) + dol(20, 84, 30, true) + dol(88, 84, -30, false);
    const inner = flan(id, metal) + relief(ring, metal) + relief(head, metal) + legend("ΣΥΡΑΚΟΣΙΩΝ", metal, { id: "lg-syr", start: 212, end: 328, size: 6.4 });
    add(id, "Syracuse tetradrachm, Arethusa and dolphins", ["syracuse", "arethusa", "coin", "silver", "dolphins", "ortygia"], metal, inner,
      "After Syracuse's coin type, the nymph Arethusa ringed by dolphins (sourced: docs/research/art-motifs.md). The head is a game figure, not a copy; the legend is my spelling.");
  }

  // Faction tokens: the game's faction icons on the coin fields its mosaic portraits use.
  const FACTIONS = [["ruler", "sword", C.ruler, "the ruler"], ["family", "hearth", C.family, "the family"], ["rich", "horse", C.rich, "the rich families"],
    ["citizens", "grain", C.citizens, "the citizens"], ["guard", "helmet", C.guard, "the guard"], ["carthage", "palm", C.punic, "Carthage"]];
  for (const [fid, ic, col, name] of FACTIONS) {
    const id = `token-${fid}`;
    const inner = `<defs><radialGradient id="tf-${fid}" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="${col}" stop-opacity=".78"/><stop offset="1" stop-color="${col}"/></radialGradient></defs>` +
      `<circle cx="60" cy="60" r="55" fill="${C.gold}" stroke="${C.accent}" stroke-width="1.2"/><circle cx="60" cy="60" r="49" fill="url(#tf-${fid})" stroke="#e8cf86" stroke-width="1"/>` +
      Array.from({ length: 40 }, (_, i) => { const a = (i / 40) * Math.PI * 2; return `<circle cx="${f2(60 + 52 * Math.cos(a))}" cy="${f2(60 + 52 * Math.sin(a))}" r=".95" fill="${C.accent}"/>`; }).join("") +
      `<g transform="translate(27.6 27.6) scale(2.7)" color="#f1e3b4" fill="#f1e3b4">${iconBody(ic)}</g>`;
    out.push({ rel: `coins/${id}.svg`, text: doc({ w: 120, h: 120, px: [240, 240], title: `Faction token: ${name}`, desc: "The game's faction icon on its faction colour.",
      css: `.line{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}.cut{fill:${col}}.cut.line{fill:none;stroke:${col}}`, body: inner }),
      id: `coin-${id}`, type: "coin", title: `Faction token: ${name}`, tags: ["faction", fid, "token", "badge"], metal: "gold" });
  }

  // Office seals: lead sealings with the game's office icons, for orders, letters and appointments.
  for (const off of ["citadel", "treasury", "mint", "fleet", "generalship", "assembly"]) {
    const id = `seal-${off}`;
    const inner = flan(id, "lead", { r: 50, wobble: 2.6, beads: 0 }) + `<circle cx="60" cy="60" r="38" fill="none" stroke="${METALS.lead.lo}" stroke-width="1.4"/>` + relief(iconBody(off), "lead", { x: 31.2, y: 31.2, s: 2.4 });
    add(id, `Lead seal of the ${off}`, ["seal", "office", off, "order", "letter"], "lead", inner, "A lead sealing struck with the game's office icon.");
  }

  // Blank flans for the interface: a counter, a price, a button.
  for (const metal of ["silver", "bronze", "gold", "lead"]) {
    const id = `blank-${metal}`;
    add(id, `Blank ${metal} coin`, ["blank", "counter", "ui", metal], metal, flan(id, metal), "An empty coin to put a number or icon on.");
  }
  return out;
}
