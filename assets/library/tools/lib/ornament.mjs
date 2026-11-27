// Frames, borders, corners, dividers and repeating patterns in the game's materials: bronze ink on parchment for
// the catalogue, clay on black glaze for anything that sits with the red-figure pictures, tesserae for big moments
// (docs/art-direction.md). Every pattern tile repeats seamlessly; every drawing is invention in the old manner.
import { C, doc, rng, f1, f2 } from "./style.mjs";
import { tondoDoc } from "./tondos.mjs";

// ---------------------------------------------------------------- patterns (tiles)
// Each tile is drawn with a stroke/fill colour `k` on an optional ground `bg`; colourways below.
const WAYS = {
  bronze: { k: C.accent, bg: null, note: "bronze on a transparent ground, for parchment pages" },
  ink: { k: C.ink, bg: null, note: "iron-gall ink on a transparent ground" },
  glaze: { k: C.clay, bg: C.glaze, note: "clay on black glaze, to sit with the red-figure pictures" },
};

const line = (d, k, w = 1.1, extra = "") => {
  const cap = /stroke-linecap/.test(extra) ? "" : ' stroke-linecap="square"';
  const join = /stroke-linejoin/.test(extra) ? "" : ' stroke-linejoin="miter"';
  return `<path d="${d}" fill="none" stroke="${k}" stroke-width="${w}"${cap}${join}${extra}/>`;
};
const rails = (w, y1, y2, k, sw = 1.1) => line(`M0 ${y1}H${w}M0 ${y2}H${w}`, k, sw);

const PATTERNS = [
  {
    id: "meander-key", title: "Meander key on rails", w: 12, h: 12, repeat: "x",
    tags: ["meander", "greek key", "border", "rule", "game"],
    note: "The same tile as .meander in ui/styles/art.css: a key hooked on the lower rail.",
    draw: (k) => line("M0 10.5H12M0 1.5H12M1 9V3.4H9V7.6H4.4V5.4H6.8", k, 1.1, ' stroke-linecap="butt"'),
  },
  {
    id: "meander-running", title: "Running meander", w: 18, h: 18, repeat: "x",
    tags: ["meander", "greek key", "border", "continuous"],
    note: "One unbroken line, the commonest Greek border.",
    draw: (k) => rails(18, 1.2, 16.8, k, 1) + line("M0 13.5V4.5H12V9H6V13.5H18", k, 1.6),
  },
  {
    id: "meander-deep", title: "Deep meander hooks", w: 24, h: 24, repeat: "x",
    tags: ["meander", "greek key", "border", "wide"],
    note: "Three-turn keys on a rail, for wide frames.",
    draw: (k) => rails(24, 1.2, 22.8, k, 1.2) + line("M2 21V4H21V18H7V9H16V13.5H11.5", k, 1.7),
  },
  {
    id: "wave", title: "Running wave", w: 20, h: 14, repeat: "x",
    tags: ["wave", "running dog", "vitruvian scroll", "sea", "border"],
    note: "The rolling wave (running dog) of Greek borders; good under sea pictures and maps.",
    draw: (k) => `<path d="M0 14V11C5 11 7 3 12.5 3C17 3 18.5 8.5 14.5 9.2C11.8 9.7 11 6.6 13.6 6.2C11.2 6 10.4 10.6 14.2 10.8C17 11 18.5 11 20 11V14Z" fill="${k}"/>`,
  },
  {
    id: "egg-and-dart", title: "Egg and dart", w: 14, h: 14, repeat: "x",
    tags: ["egg and dart", "ionic", "moulding", "border", "architecture"],
    note: "The Ionic moulding: eggs in their shells with darts between.",
    draw: (k) => line("M0 1.2H14", k, 1) + line("M1.4 2C1.4 13.2 9.6 13.2 9.6 2", k, 1.1, ' stroke-linecap="round"') +
      `<ellipse cx="5.5" cy="6.4" rx="2.5" ry="3.9" fill="${k}"/>` + line("M11.8 2V10.6", k, 1, ' stroke-linecap="round"') + `<path d="M10.3 9.4L11.8 13L13.3 9.4Z" fill="${k}"/>`,
  },
  {
    id: "bead-and-reel", title: "Bead and reel", w: 16, h: 8, repeat: "x",
    tags: ["bead and reel", "astragal", "moulding", "border", "thin"],
    note: "A thin moulding: long beads and pairs of reels.",
    draw: (k) => `<ellipse cx="5" cy="4" rx="3.7" ry="2.5" fill="${k}"/><ellipse cx="11.3" cy="4" rx=".95" ry="2.9" fill="${k}"/><ellipse cx="13.7" cy="4" rx=".95" ry="2.9" fill="${k}"/>`,
  },
  {
    id: "laurel", title: "Laurel band", w: 24, h: 12, repeat: "x",
    tags: ["laurel", "wreath", "victory", "apollo", "border"],
    note: "Laurel leaves on a stem: victory and Apollo.",
    draw: (k) => line("M0 6H24", k, .8, ' stroke-linecap="butt"') + [3, 15].map((x) => `<path d="M${x} 6q2.6 -5.6 7 -5.2q-1.6 4.6 -7 5.2z" fill="${k}"/>`).join("") +
      [9, 21].map((x) => `<path d="M${x} 6q2.6 5.6 7 5.2q-1.6 -4.6 -7 -5.2z" fill="${k}"/>`).join("") + `<circle cx="8.6" cy="3.2" r=".9" fill="${k}"/><circle cx="20.6" cy="8.8" r=".9" fill="${k}"/>`,
  },
  {
    id: "ivy", title: "Ivy band", w: 32, h: 22, repeat: "x",
    tags: ["ivy", "dionysus", "wine", "symposium", "border", "game"],
    note: "Ivy on a waving stem, as under the game's title scene: Dionysus and the drinking party.",
    draw: (k) => {
      const leaf = "M0 0C-3 1 -5.4 -2 -4.4 -4.4C-3.4 -6.4 -1.2 -7 0 -9C1.2 -7 3.4 -6.4 4.4 -4.4C5.4 -2 3 1 0 0Z";
      return line("M0 11C8 6 8 6 16 11C24 16 24 16 32 11", k, 1.1, ' stroke-linecap="butt"') +
        `<path d="${leaf}" fill="${k}" transform="translate(8 7.4) scale(.72)"/><path d="${leaf}" fill="${k}" transform="translate(24 14.6) scale(.72 -.72)"/>` +
        `<circle cx="14" cy="6.2" r=".9" fill="${k}"/><circle cx="15.6" cy="5" r=".9" fill="${k}"/><circle cx="30" cy="15.8" r=".9" fill="${k}"/><circle cx="31.6" cy="17" r=".9" fill="${k}"/>`;
    },
  },
  {
    id: "palmette-lotus", title: "Palmette and lotus", w: 24, h: 20, repeat: "x",
    tags: ["palmette", "lotus", "anthemion", "border", "vase"],
    note: "Alternating palmettes and lotus buds on linked scrolls, the band round the necks of vases.",
    draw: (k) => {
      let s = line("M0 18C3 15 9 15 12 18C15 15 21 15 24 18", k, 1, ' stroke-linecap="round"');
      for (let i = -2; i <= 2; i++) {
        const a = (i * 26 * Math.PI) / 180, x = 6 + Math.sin(a) * 7.5, y = 15.5 - Math.cos(a) * 7.5;
        s += `<ellipse cx="${f2((6 + x) / 2)}" cy="${f2((15.5 + y) / 2)}" rx="1.25" ry="${i ? 3.6 : 4.1}" transform="rotate(${i * 26} ${f2((6 + x) / 2)} ${f2((15.5 + y) / 2)})" fill="${k}"/>`;
      }
      return s + `<path d="M18 16C18 11 18 7 18 4C19.2 7 19.4 12 18 16Z" fill="${k}"/><path d="M18 16C15 14 14.2 10 14.6 7.4C16.4 9.6 17.4 13 18 16Z" fill="${k}"/><path d="M18 16C21 14 21.8 10 21.4 7.4C19.6 9.6 18.6 13 18 16Z" fill="${k}"/>`;
    },
  },
  {
    id: "guilloche", title: "Guilloche", w: 20, h: 16, repeat: "x",
    tags: ["guilloche", "twist", "plait", "border", "mosaic"],
    note: "Two interlaced strands with eyes, common in mosaic borders.",
    draw: (k) => line("M0 8C3.5 1.5 6.5 1.5 10 8C13.5 14.5 16.5 14.5 20 8", k, 1.4, ' stroke-linecap="butt"') +
      line("M0 8C3.5 14.5 6.5 14.5 10 8C13.5 1.5 16.5 1.5 20 8", k, 1.4, ' stroke-linecap="butt"') + `<circle cx="5" cy="8" r="1.5" fill="${k}"/><circle cx="15" cy="8" r="1.5" fill="${k}"/>`,
  },
  {
    id: "dentils", title: "Dentils", w: 12, h: 10, repeat: "x",
    tags: ["dentils", "cornice", "architecture", "temple", "border"],
    note: "The teeth under a temple cornice.",
    draw: (k) => line("M0 1H12", k, 1) + `<rect x="1.5" y="3" width="7" height="6.5" fill="${k}"/>`,
  },
  {
    id: "zigzag", title: "Zigzag", w: 12, h: 10, repeat: "x",
    tags: ["zigzag", "chevron", "geometric", "border", "simple"],
    note: "A plain zigzag between rails, as on Geometric pots.",
    draw: (k) => rails(12, 1, 9, k, .9) + line("M0 7.4L6 2.6L12 7.4", k, 1.3, ' stroke-linejoin="miter" stroke-linecap="butt"'),
  },
  {
    id: "checker", title: "Chequer band", w: 8, h: 10, repeat: "x",
    tags: ["chequer", "checkerboard", "geometric", "border"],
    note: "Two rows of chequers between rails.",
    draw: (k) => rails(8, .6, 9.4, k, .9) + `<rect x="0" y="1.2" width="4" height="3.8" fill="${k}"/><rect x="4" y="5" width="4" height="3.8" fill="${k}"/>`,
  },
  {
    id: "rays", title: "Rays", w: 10, h: 20, repeat: "x",
    tags: ["rays", "black figure", "vase foot", "border", "triangles"],
    note: "The rays round the foot of black-figure pots; put it on the floor of a panel, points up.",
    draw: (k) => `<path d="M.6 20L5 2.5L9.4 20Z" fill="${k}"/>`,
  },
  {
    id: "tongues", title: "Tongues", w: 10, h: 12, repeat: "x",
    tags: ["tongues", "vase shoulder", "border", "black figure"],
    note: "Rounded tongues hanging from a rail, as on vase shoulders.",
    draw: (k) => line("M0 .8H10", k, 1) + `<path d="M1 1.6H9V7A4 4 0 0 1 1 7Z" fill="${k}"/>`,
  },
  {
    id: "scales", title: "Scales", w: 12, h: 10, repeat: "both",
    tags: ["scales", "imbrication", "armour", "field", "background"],
    note: "Overlapping scales for a field: armour, roofs, fish, a dragon. Repeats both ways.",
    draw: (k) => line("M0 5A3 3 0 0 0 6 5A3 3 0 0 0 12 5M-3 10A3 3 0 0 0 3 10A3 3 0 0 0 9 10A3 3 0 0 0 15 10M-3 0A3 3 0 0 0 3 0A3 3 0 0 0 9 0A3 3 0 0 0 15 0", k, .9, ' stroke-linecap="butt"'),
  },
  {
    id: "rosettes", title: "Dot rosettes", w: 24, h: 24, repeat: "both",
    tags: ["rosette", "dots", "field", "background", "textile"],
    note: "Staggered dot rosettes, like a woven cloak; a quiet background. Repeats both ways.",
    draw: (k) => [[6, 6], [18, 18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="${k}"/>` +
      Array.from({ length: 6 }, (_, i) => `<circle cx="${f2(x + 3.1 * Math.cos((i * Math.PI) / 3))}" cy="${f2(y + 3.1 * Math.sin((i * Math.PI) / 3))}" r=".75" fill="${k}"/>`).join("")).join(""),
  },
  {
    id: "sea", title: "Sea ripples", w: 24, h: 12, repeat: "both",
    tags: ["sea", "water", "waves", "map", "field", "background"],
    note: "Small ripples for the sea on a map or a harbour scene. Repeats both ways.",
    draw: (k) => line("M1 3.5q2.5 -2.2 5 0q2.5 2.2 5 0M13 9.5q2.5 -2.2 5 0q2.5 2.2 5 0", k, .7, ' stroke-linecap="round" opacity=".7"'),
  },
];

// Tesserae: their own colours, so only the ground changes.
function tesseraeBand(bg) {
  const cells = [[0, C.clay], [7, C.glaze], [14, C.gold], [21, C.glaze]];
  const page = bg ?? C.page;
  return `<rect width="28" height="8" fill="${page}"/>` + cells.map(([x, c]) => `<rect x="${x}" y="1" width="6" height="6" fill="${c}"/>`).join("");
}
function tesseraeField(seed, palette, round = false) {
  const r = rng(seed), n = 8, cell = 6;
  let s = "";
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const c = palette[Math.floor(r() * palette.length)];
    const jx = (r() - 0.5) * 0.7, jy = (r() - 0.5) * 0.7, sz = 4.6 + r() * 0.6;
    const x = i * cell + (cell - sz) / 2 + jx, y = j * cell + (cell - sz) / 2 + jy;
    s += round ? `<ellipse cx="${f2(x + sz / 2)}" cy="${f2(y + sz / 2)}" rx="${f2(sz / 2)}" ry="${f2(sz / 2.3)}" transform="rotate(${Math.floor(r() * 180)} ${f2(x + sz / 2)} ${f2(y + sz / 2)})" fill="${c}"/>`
      : `<rect x="${f2(x)}" y="${f2(y)}" width="${f2(sz)}" height="${f2(sz)}" rx=".5" fill="${c}"/>`;
  }
  return s;
}

function patternItems() {
  const out = [];
  const make = (id, title, w, h, repeat, body, tags, note, way) => {
    const css = repeat === "both" ? "repeat" : "repeat-x";
    out.push({
      rel: `patterns/${id}.svg`, id: `pattern-${id}`, type: "pattern", title, tags: [...tags, way ?? "colour"].filter(Boolean),
      note, tile: [w, h], repeat, colourway: way,
      use: `CSS: background: url(assets/library/made/patterns/${id}.svg) ${css} 0 0 / ${w}px ${h}px;`,
      text: doc({ w, h, px: [w, h], title: `${title} (tile)`, desc: `${note} Tiles ${repeat === "both" ? "both ways" : "left to right"}.`, body }),
    });
  };
  for (const p of PATTERNS) {
    for (const [way, cw] of Object.entries(WAYS)) {
      if (way === "ink" && !["meander-running", "egg-and-dart", "laurel", "scales", "sea"].includes(p.id)) continue;
      const body = (cw.bg ? `<rect width="${p.w}" height="${p.h}" fill="${cw.bg}"/>` : "") + p.draw(cw.k);
      make(`${p.id}-${way}`, `${p.title}, ${way}`, p.w, p.h, p.repeat, body, p.tags, `${p.note} Colourway: ${cw.note}.`, way);
    }
  }
  make("tesserae-band", "Tesserae band", 28, 8, "x", tesseraeBand(), ["tesserae", "mosaic", "border", "big moments", "game"],
    "The tesserae band of ui/styles/art.css, drawn as a tile.");
  make("tesserae-band-glaze", "Tesserae band on glaze", 28, 8, "x", tesseraeBand(C.glaze), ["tesserae", "mosaic", "border", "dark"],
    "The tesserae band set in black glaze instead of parchment.");
  make("tesserae-field", "Tesserae field", 48, 48, "both", `<rect width="48" height="48" fill="${C.page}"/>` +
    tesseraeField(7, [C.clay, C.clay, C.gold, C.glaze, C.panel, C.panel, C.clayLight, C.accent]), ["tesserae", "mosaic", "field", "background", "floor"],
    "A floor of square tesserae in the game's colours. Repeats both ways.");
  make("pebble-field", "Pebble mosaic field", 48, 48, "both", `<rect width="48" height="48" fill="${C.glaze}"/>` +
    tesseraeField(11, ["#e9e0cc", "#ddd2b8", "#cfc3a6", "#3a2e24", "#e9e0cc"], true), ["pebbles", "mosaic", "field", "background", "floor", "dark"],
    "River pebbles, light on dark, as in early Greek floor mosaics. Repeats both ways.");
  return out;
}

// ---------------------------------------------------------------- ornaments (single pieces)
// Meander running along a straight side, for frames: the running meander scaled to a band of height h.
function meanderAlong(x0, y0, len, h, k, vertical = false) {
  const u = h / 18, n = Math.floor(len / (18 * u)), pad = (len - n * 18 * u) / 2;
  let d = "";
  for (let i = 0; i < n; i++) {
    const x = pad + i * 18 * u;
    d += `M${f2(x)} ${f2(13.5 * u)}V${f2(4.5 * u)}H${f2(x + 12 * u)}V${f2(9 * u)}H${f2(x + 6 * u)}V${f2(13.5 * u)}H${f2(x + 18 * u)}`;
  }
  const tr = vertical ? `translate(${f2(x0 + h)} ${f2(y0)}) rotate(90)` : `translate(${f2(x0)} ${f2(y0)})`;
  return `<g transform="${tr}"><path d="M0 ${f2(1.2 * u)}H${f2(len)}M0 ${f2(16.8 * u)}H${f2(len)}" fill="none" stroke="${k}" stroke-width="${f2(u)}"/>` +
    `<path d="${d}" fill="none" stroke="${k}" stroke-width="${f2(1.6 * u)}" stroke-linecap="square"/></g>`;
}
const rect = (x, y, w, h, k, sw = 1, extra = "") => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="none" stroke="${k}" stroke-width="${sw}"${extra}/>`;

function tanitSign(cx, top, s, fill) {
  // The "sign of Tanit": a triangle, a bar with raised ends, a disc. Common on Punic votive stelae.
  return `<g transform="translate(${cx} ${top}) scale(${s})" fill="${fill}"><circle cx="0" cy="4" r="4"/><path d="M-9 9.5H9V11.4H-9Z"/><path d="M-9 9.5V5.5L-7.2 5.5V9.5Z"/><path d="M9 9.5V5.5L7.2 5.5V9.5Z"/><path d="M0 11.4L-8 28H8Z"/></g>`;
}
function palmetteAt(cx, cy, s, k, petals = 7) {
  let g = "";
  const half = (petals - 1) / 2;
  for (let i = -half; i <= half; i++) {
    const a = (i * 20 * Math.PI) / 180, mx = cx + Math.sin(a) * 9 * s, my = cy - Math.cos(a) * 9 * s;
    g += `<ellipse cx="${f2(mx)}" cy="${f2(my)}" rx="${f2(1.9 * s)}" ry="${f2((i ? 5.6 : 6.4) * s)}" transform="rotate(${i * 20} ${f2(mx)} ${f2(my)})" fill="${k}"/>`;
  }
  return g + `<path d="M${f2(cx - 7 * s)} ${f2(cy + 4 * s)}C${f2(cx - 7 * s)} ${f2(cy - 1 * s)} ${f2(cx - 2 * s)} ${f2(cy - 1 * s)} ${f2(cx)} ${f2(cy + 1 * s)}C${f2(cx + 2 * s)} ${f2(cy - 1 * s)} ${f2(cx + 7 * s)} ${f2(cy - 1 * s)} ${f2(cx + 7 * s)} ${f2(cy + 4 * s)}" fill="none" stroke="${k}" stroke-width="${f2(1.3 * s)}" stroke-linecap="round"/>` +
    `<circle cx="${f2(cx - 7 * s)}" cy="${f2(cy + 4.6 * s)}" r="${f2(1.3 * s)}" fill="${k}"/><circle cx="${f2(cx + 7 * s)}" cy="${f2(cy + 4.6 * s)}" r="${f2(1.3 * s)}" fill="${k}"/>`;
}
function rosetteAt(cx, cy, r, k, n = 8) {
  let g = `<circle cx="${cx}" cy="${cy}" r="${f2(r * .26)}" fill="${k}"/>`;
  for (let i = 0; i < n; i++) {
    const a = (i * 2 * Math.PI) / n, mx = cx + Math.cos(a) * r * .62, my = cy + Math.sin(a) * r * .62;
    g += `<ellipse cx="${f2(mx)}" cy="${f2(my)}" rx="${f2(r * .34)}" ry="${f2(r * .16)}" transform="rotate(${f1((a * 180) / Math.PI)} ${f2(mx)} ${f2(my)})" fill="${k}"/>`;
  }
  return g;
}
function hederaAt(cx, cy, s, k) {
  // The ivy leaf (hedera), the scribes' fleuron.
  return `<path d="M${cx} ${f2(cy + 10 * s)}C${f2(cx - 4 * s)} ${f2(cy + 4 * s)} ${f2(cx - 12 * s)} ${f2(cy + 1 * s)} ${f2(cx - 10 * s)} ${f2(cy - 6 * s)}C${f2(cx - 8 * s)} ${f2(cy - 11 * s)} ${f2(cx - 2 * s)} ${f2(cy - 10 * s)} ${cx} ${f2(cy - 5 * s)}C${f2(cx + 2 * s)} ${f2(cy - 10 * s)} ${f2(cx + 8 * s)} ${f2(cy - 11 * s)} ${f2(cx + 10 * s)} ${f2(cy - 6 * s)}C${f2(cx + 12 * s)} ${f2(cy + 1 * s)} ${f2(cx + 4 * s)} ${f2(cy + 4 * s)} ${cx} ${f2(cy + 10 * s)}Z" fill="${k}"/>` +
    `<path d="M${cx} ${f2(cy - 5 * s)}C${f2(cx - 1 * s)} ${f2(cy - 12 * s)} ${f2(cx + 3 * s)} ${f2(cy - 15 * s)} ${f2(cx + 6 * s)} ${f2(cy - 16 * s)}" fill="none" stroke="${k}" stroke-width="${f2(1.4 * s)}" stroke-linecap="round"/>`;
}
function swordDown(x, y, s, k) {
  // A short sword hanging point down from (x, y): pommel, grip, crossguard, leaf blade.
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${k}"><circle cx="0" cy="1.6" r="1.6"/><rect x="-.9" y="3" width="1.8" height="6"/><path d="M-5 9H5L4.2 10.6H-4.2Z"/><path d="M-1.8 10.6C-2.6 16 -2.4 22 0 30C2.4 22 2.6 16 1.8 10.6Z"/></g>`;
}
function laurelBranch(x0, y, len, dir, k, s = 1) {
  // A laurel branch growing from x0 in direction dir (+1 right, -1 left).
  let g = `<path d="M${x0} ${y}H${f1(x0 + dir * len)}" stroke="${k}" stroke-width="${f2(s)}" fill="none"/>`;
  for (let t = 6; t < len - 4; t += 9) {
    const x = x0 + dir * t;
    g += `<path d="M${f1(x)} ${y}q${f2(dir * 3 * s)} ${f2(-6 * s)} ${f2(dir * 8 * s)} ${f2(-5.6 * s)}q${f2(-dir * 2 * s)} ${f2(5 * s)} ${f2(-dir * 8 * s)} ${f2(5.6 * s)}z" fill="${k}"/>` +
      `<path d="M${f1(x + dir * 4.5)} ${y}q${f2(dir * 3 * s)} ${f2(6 * s)} ${f2(dir * 8 * s)} ${f2(5.6 * s)}q${f2(-dir * 2 * s)} ${f2(-5 * s)} ${f2(-dir * 8 * s)} ${f2(-5.6 * s)}z" fill="${k}"/>`;
  }
  return g;
}

function ornamentItems() {
  const out = [];
  const add = (id, title, w, h, body, tags, note, extra = {}) => out.push({
    rel: `ornament/${id}.svg`, id: `ornament-${id}`, type: "ornament", title, tags, note, ...extra,
    text: doc({ w, h, title, desc: note, body }),
  });
  const k = C.accent, ink = C.ink;

  // Frames
  {
    const W = 480, H = 300;
    const body = rect(3, 3, W - 6, H - 6, ink, 1.6) + rect(9, 9, W - 18, H - 18, k, .8) + `<path d="M9 62H${W - 9}" stroke="${k}" stroke-width=".8"/>` +
      meanderAlong(24, 66, W - 48, 10, k) + [[9, 9], [W - 21, 9], [9, H - 21], [W - 21, H - 21]].map(([x, y]) => `<rect x="${x}" y="${y}" width="12" height="12" fill="${k}"/><rect x="${x + 3.5}" y="${y + 3.5}" width="5" height="5" fill="${C.page}"/>`).join("");
    add("frame-catalogue-card", "Catalogue card frame", W, H, body, ["frame", "card", "catalogue", "panel", "title band"],
      "A card with a title band and a meander rule under it, for a ledger entry, a person's file or a museum label.", { use: "Put the title in the band (y 20 to 58) and the text below the meander (y 84 on)." });
  }
  {
    const W = 480, H = 320, b = 16;
    const body = rect(2, 2, W - 4, H - 4, k, 1.2) + meanderAlong(6, 6, W - 12, b, k) + meanderAlong(6, H - 6 - b, W - 12, b, k) +
      meanderAlong(6, 6 + b, H - 12 - 2 * b, b, k, true) + meanderAlong(W - 6 - b, 6 + b, H - 12 - 2 * b, b, k, true) + rect(6 + b + 4, 6 + b + 4, W - 2 * (10 + b), H - 2 * (10 + b), k, .8);
    add("frame-meander", "Meander frame", W, H, body, ["frame", "meander", "greek key", "border", "panel"],
      "A panel framed on all four sides by a running meander.");
  }
  {
    const W = 480, H = 320, r = rng(23), cols = [C.clay, C.glaze, C.gold, C.glaze];
    let body = `<rect width="${W}" height="${H}" fill="none"/>`;
    let i = 0;
    const sq = (x, y) => { body += `<rect x="${f1(x)}" y="${f1(y)}" width="6" height="6" fill="${cols[i++ % 4]}"/>`; };
    for (let x = 2; x <= W - 8; x += 7) { sq(x, 2); sq(x, H - 8); }
    for (let y = 9; y <= H - 15; y += 7) { sq(2, y); sq(W - 8, y); }
    body += rect(13, 13, W - 26, H - 26, k, .8);
    void r;
    add("frame-tesserae", "Tesserae frame", W, H, body, ["frame", "tesserae", "mosaic", "big moments", "season", "ending"],
      "A border of tesserae in the game's four-colour order, for the big moments the art direction gives to mosaic.");
  }
  out.push({
    rel: "ornament/frame-tondo-empty.svg", id: "ornament-frame-tondo-empty", type: "ornament", title: "Empty tondo", tags: ["frame", "tondo", "red figure", "event", "blank"],
    note: "The event picture frame with nothing in it: glaze, meander ring and ground line. Draw a new scene inside.",
    use: "Draw figures in the 120-unit box above the ground line (y 90.5), inside r 46.",
    text: tondoDoc("Empty tondo", "", "The game's event picture frame, empty, for drawing a new scene."),
  });
  {
    const W = 240, H = 400;
    const body = `<path d="M20 392V96H220V392Z" fill="${C.panel}" stroke="${ink}" stroke-width="1.6"/>` +
      `<path d="M14 96L120 30L226 96Z" fill="${C.panel}" stroke="${ink}" stroke-width="1.6"/><path d="M40 90L120 41L200 90Z" fill="none" stroke="${k}" stroke-width=".9"/>` +
      palmetteAt(120, 28, 1.3, ink) + palmetteAt(16, 92, .9, ink, 5) + palmetteAt(224, 92, .9, ink, 5) +
      `<path d="M14 96H226V108H14Z" fill="${C.page}" stroke="${ink}" stroke-width="1.2"/>` + rect(36, 124, 168, 248, k, 1) + `<path d="M10 392H230" stroke="${ink}" stroke-width="2.4"/>`;
    add("frame-stele-greek", "Greek grave stele", W, H, body, ["frame", "stele", "grave", "memorial", "death", "epitaph"],
      "An Attic-style grave stele with a pediment and palmette acroteria. For a death, an epitaph or a memorial notice.",
      { use: "Text or a figure in the panel x 36 to 204, y 124 to 372." });
  }
  {
    const W = 240, H = 400;
    const body = `<path d="M30 392V110L120 40L210 110V392Z" fill="${C.panel}" stroke="${ink}" stroke-width="1.6"/>` +
      `<path d="M48 112L120 56L192 112Z" fill="none" stroke="${C.punic}" stroke-width="1"/>` + tanitSign(120, 66, 1.2, C.punic) +
      `<path d="M30 116H210" stroke="${ink}" stroke-width="1.2"/>` + rect(50, 132, 140, 238, C.punic, .9) + `<path d="M22 392H218" stroke="${ink}" stroke-width="2.4"/>`;
    add("frame-stele-punic", "Punic votive stele", W, H, body, ["frame", "stele", "punic", "carthage", "tanit", "votive", "motya"],
      "A pointed Punic stele with the sign of Tanit in the gable, the shape of the votive stones from the tophets of Carthage and Motya (general knowledge, not a copy of one stone). For Carthaginian news and treaties.",
      { use: "Text in the panel x 50 to 190, y 132 to 370." });
  }
  {
    const W = 480, H = 300, wax = "#3a2a1c";
    const leaf = (x) => `<rect x="${x}" y="10" width="226" height="280" rx="6" fill="${C.accent}" stroke="${ink}" stroke-width="1.4"/><rect x="${x + 16}" y="26" width="194" height="248" rx="2" fill="${wax}"/>` +
      `<path d="M${x + 16} 26h194" stroke="#00000055" stroke-width="3"/>`;
    const body = leaf(8) + leaf(246) + [70, 150, 230].map((y) => `<rect x="229" y="${y - 6}" width="22" height="12" rx="3" fill="${C.gold}" stroke="${ink}" stroke-width=".8"/>`).join("") +
      `<g stroke="${C.clayLight}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".75"><path d="M40 70h120M40 92h150M40 114h96M278 70h140M278 92h110"/></g>` +
      `<path d="M300 250L456 168" stroke="${C.silver}" stroke-width="3.4" stroke-linecap="round"/><path d="M456 168l12 -7" stroke="${C.silver}" stroke-width="6" stroke-linecap="round"/>`;
    add("frame-wax-tablet", "Wax tablet, open", W, H, body, ["frame", "letter", "tablet", "wax", "writing", "denunciation", "secret", "stylus"],
      "A wooden diptych with dark wax, scratched lines and a bronze stylus: letters, denunciations, secret orders. The lines are blank scratches, not writing.",
      { use: "Put text over the wax panels (x 24 to 218 and x 262 to 456, y 26 to 274) in a light colour." });
  }
  {
    const W = 520, H = 200, pap = "#e8d9ae";
    const body = `<rect x="44" y="22" width="432" height="156" fill="${pap}"/>` +
      Array.from({ length: 12 }, (_, i) => `<path d="M44 ${30 + i * 13}H476" stroke="#c9b37e" stroke-width=".5"/>`).join("") +
      `<path d="M44 22H476M44 178H476" stroke="${ink}" stroke-width="1.1"/>` +
      [[44, -1], [476, 1]].map(([x, d]) => `<rect x="${x - (d < 0 ? 30 : 0)}" y="14" width="30" height="172" rx="14" fill="${C.panel}" stroke="${ink}" stroke-width="1.3"/>` +
        `<path d="M${x + d * 6 - (d < 0 ? 0 : 0)} 18V182M${x + d * 16} 18V182" stroke="${k}" stroke-width=".7"/><rect x="${x - (d < 0 ? 20 : -10)}" y="4" width="10" height="10" rx="2" fill="${ink}"/><rect x="${x - (d < 0 ? 20 : -10)}" y="186" width="10" height="10" rx="2" fill="${ink}"/>`).join("");
    add("frame-scroll", "Papyrus roll, open", W, H, body, ["frame", "scroll", "papyrus", "book", "history", "chronicle", "philistus", "quotation"],
      "An open papyrus roll between its two rolled ends: for a quotation from a historian, a decree or a chronicle page.",
      { use: "Text in x 60 to 460, y 30 to 170." });
  }
  {
    const W = 360, H = 140;
    const body = `<path d="M60 14H300V126H60Z" fill="${C.panel}" stroke="${ink}" stroke-width="1.6"/><path d="M60 14L14 40V100L60 126M300 14L346 40V100L300 126" fill="${C.panel}" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>` +
      `<path d="M60 14V126M300 14V126" stroke="${ink}" stroke-width="1"/>` + rect(70, 24, 220, 92, k, .8) + `<circle cx="34" cy="70" r="4" fill="${ink}"/><circle cx="326" cy="70" r="4" fill="${ink}"/>`;
    add("cartouche-tabula-ansata", "Tablet with handles (tabula ansata)", W, H, body, ["cartouche", "label", "plaque", "inscription", "title"],
      "A label plaque with dovetail handles. The form is commonest in Roman times; use it as a generic plaque, not as a period piece for 400 BC.",
      { use: "One or two lines of text in x 76 to 284." });
  }
  {
    const W = 360, H = 110;
    const body = `<path d="M12 4H348L356 12V98L348 106H12L4 98V12Z" fill="${C.panel}" stroke="${ink}" stroke-width="1.5"/>` + rect(12, 12, 336, 86, k, .8) +
      `<path d="M150 98H210" stroke="${k}" stroke-width="2"/>` + rosetteAt(180, 98, 6, k, 8);
    add("cartouche-plain", "Plain cartouche", W, H, body, ["cartouche", "label", "plaque", "title", "map"],
      "A plain label with clipped corners and a small rosette on the lower rule, like the map title boxes.");
  }
  {
    const W = 480, H = 160, stone = "#d8cfbb";
    const body = `<rect x="6" y="26" width="468" height="128" fill="${stone}" stroke="${ink}" stroke-width="1.4"/><path d="M2 8H478V26H2Z" fill="${stone}" stroke="${ink}" stroke-width="1.4"/>` +
      `<path d="M2 14H478" stroke="${ink}" stroke-width=".7"/>` + Array.from({ length: 39 }, (_, i) => `<rect x="${8 + i * 12}" y="17" width="7" height="7" fill="${ink}" opacity=".55"/>`).join("") +
      rect(20, 40, 440, 100, "#8b7f68", 1.2) + rect(26, 46, 428, 88, "#8b7f68", .6);
    add("frame-inscription", "Inscription block", W, H, body, ["frame", "inscription", "stone", "decree", "title", "law", "public notice"],
      "A limestone block under a dentil cornice, with an incised border: for a decree, a law, a treaty or the title of a public notice.",
      { use: "Cut-in capitals (IM Fell English SC, letter-spaced) in x 40 to 440, y 56 to 128, colour #4a4030." });
  }
  {
    const s = 96, body = `<rect x="1" y="1" width="94" height="94" fill="none" stroke="${C.blood}" stroke-width="1.4"/>` +
      meanderAlong(4, 4, 88, 8, C.blood) + meanderAlong(4, 84, 88, 8, C.blood) + meanderAlong(4, 12, 72, 8, C.blood, true) + meanderAlong(84, 12, 72, 8, C.blood, true);
    add("frame-dropcap", "Drop-cap box", s, s, body, ["frame", "drop cap", "initial", "chronicle", "book"],
      "A square for an initial letter, in the blood red of the game's drop caps (ui/styles/art.css .dropcap).", { use: "Set the letter in the 64-unit square in the middle." });
  }

  // Corners: each drawn for the top-left; flip with transform: scale(-1,1) etc. for the other three.
  {
    const c = 64;
    add("corner-meander", "Corner: meander", c, c, `<path d="M2 62V2H62" fill="none" stroke="${k}" stroke-width="1.2"/><path d="M8 56V8H56M8 40H24V24H40V8" fill="none" stroke="${k}" stroke-width="1.8" stroke-linecap="square"/><path d="M16 32V16H32" fill="none" stroke="${k}" stroke-width="1.8" stroke-linecap="square"/>`,
      ["corner", "meander", "frame", "border"], "A meander corner for the top-left; mirror it for the others.", { use: "Mirror with transform=\"scale(-1 1)\" or (1 -1)." });
    add("corner-palmette", "Corner: palmette", c, c, `<path d="M2 62V2H62" fill="none" stroke="${k}" stroke-width="1.2"/>` + `<g transform="rotate(-45 22 22)">${palmetteAt(22, 24, 1.15, k, 5)}</g>`,
      ["corner", "palmette", "frame", "border"], "A palmette growing out of the corner, for the top-left.", { use: "Mirror for the other corners." });
    add("corner-bracket", "Corner: bracket", c, c, `<path d="M3 61V3H61" fill="none" stroke="${ink}" stroke-width="1.6"/><path d="M10 50V10H50" fill="none" stroke="${k}" stroke-width=".9"/><rect x="6" y="6" width="8" height="8" fill="${k}"/><circle cx="24" cy="24" r="3" fill="${k}"/>`,
      ["corner", "bracket", "frame", "catalogue"], "A plain double-rule corner with a stud: the catalogue look.");
    let t = "", i = 0; const cols = [C.clay, C.glaze, C.gold, C.glaze];
    for (let x = 2; x < 62; x += 7) t += `<rect x="${x}" y="2" width="6" height="6" fill="${cols[i++ % 4]}"/>`;
    for (let y = 9; y < 62; y += 7) t += `<rect x="2" y="${y}" width="6" height="6" fill="${cols[i++ % 4]}"/>`;
    add("corner-tesserae", "Corner: tesserae", c, c, t + `<rect x="13" y="13" width="10" height="10" fill="${C.blood}"/>`, ["corner", "tesserae", "mosaic", "frame"], "A tesserae corner with a red keystone.");
  }

  // Fleurons and small marks
  add("fleuron-hedera", "Fleuron: ivy leaf", 48, 48, hederaAt(24, 26, 1.6, k), ["fleuron", "ivy", "hedera", "divider", "section break"],
    "The ivy leaf (hedera), the oldest printers' and stonecutters' fleuron; the game uses the ❦ character for it.");
  add("fleuron-palmette", "Fleuron: palmette", 48, 48, palmetteAt(24, 30, 1.25, k), ["fleuron", "palmette", "divider", "ornament"], "A single palmette.");
  add("fleuron-rosette", "Fleuron: rosette", 48, 48, rosetteAt(24, 24, 20, k, 8), ["fleuron", "rosette", "flower", "divider"], "An eight-petal rosette.");
  add("fleuron-lotus", "Fleuron: lotus", 48, 48, `<path d="M24 42C24 30 24 18 24 6C27 16 27.4 30 24 42Z" fill="${k}"/><path d="M24 42C16 38 12.8 26 14 16C19 22 22 32 24 42Z" fill="${k}"/><path d="M24 42C32 38 35.2 26 34 16C29 22 26 32 24 42Z" fill="${k}"/><path d="M14 44H34" stroke="${k}" stroke-width="2"/>`,
    ["fleuron", "lotus", "flower", "egypt", "punic"], "A lotus bud, the eastern flower that Greeks and Phoenicians both used.");
  add("fleuron-interpunct", "Fleuron: three dots", 48, 48, [12, 24, 36].map((y) => `<circle cx="24" cy="${y}" r="3.4" fill="${k}"/>`).join(""),
    ["fleuron", "interpunct", "punctuation", "inscription", "divider"], "Three stacked dots, the word divider of Greek inscriptions.");
  add("fleuron-sword", "Fleuron: sword on a hair", 48, 64, `<path d="M24 2V18" stroke="${ink}" stroke-width=".6"/>` + swordDown(24, 18, 1.4, ink),
    ["fleuron", "sword", "damocles", "danger", "game", "section break"], "The game's emblem as a small mark: a sword hanging by a hair (Cicero, Tusculan Disputations 5.61-62).");

  // Dividers
  {
    const W = 480, H = 72;
    const body = `<path d="M10 14H214M266 14H470" stroke="${ink}" stroke-width="1.2"/><path d="M10 18H214M266 18H470" stroke="${k}" stroke-width=".6"/>` +
      `<circle cx="240" cy="14" r="3" fill="${ink}"/><path d="M240 14V30" stroke="${ink}" stroke-width=".5"/>` + swordDown(240, 30, 1.3, ink);
    add("divider-sword-on-hair", "Divider: sword on a hair", W, H, body, ["divider", "rule", "sword", "damocles", "danger", "game", "section break"],
      "A rule with the sword of Damocles hanging from its middle: a section break for a moment of danger.");
  }
  {
    const W = 480, H = 40, leaf = "M0 0C-3 1 -5.4 -2 -4.4 -4.4C-3.4 -6.4 -1.2 -7 0 -9C1.2 -7 3.4 -6.4 4.4 -4.4C5.4 -2 3 1 0 0Z";
    const yAt = (x) => 20 - 6 * Math.sin(((x - 10) / 60) * Math.PI);
    let d = "M10 20";
    for (let x = 14; x <= 470; x += 4) d += `L${x} ${f1(yAt(x))}`;
    let s = `<path d="${d}" fill="none" stroke="${k}" stroke-width="1.2"/>`;
    for (let x = 40; x < 470; x += 60) {
      const up = Math.sin(((x - 10) / 60) * Math.PI) > 0;
      s += `<path d="${leaf}" fill="${k}" transform="translate(${x} ${f1(yAt(x) + (up ? -.5 : .5))}) scale(1.5 ${up ? 1.5 : -1.5})"/>`;
    }
    add("divider-ivy", "Divider: ivy", W, H, s, ["divider", "ivy", "dionysus", "symposium", "rule"], "A waving ivy rule, for feasts and wine.");
  }
  {
    const W = 480, H = 36;
    const body = laurelBranch(226, 18, 200, -1, k) + laurelBranch(254, 18, 200, 1, k) + rosetteAt(240, 18, 9, k, 8);
    add("divider-laurel", "Divider: laurel", W, H, body, ["divider", "laurel", "victory", "triumph", "rule"], "Two laurel branches meeting at a rosette: for a victory or an honour.");
  }
  add("divider-meander", "Divider: short meander", 240, 18, meanderAlong(0, 0, 240, 18, k), ["divider", "meander", "rule", "short"], "A short running meander rule.");
  add("divider-wave", "Divider: wave", 480, 18, `<g transform="translate(0 2)">${Array.from({ length: 24 }, (_, i) => `<g transform="translate(${i * 20} 0)">${PATTERNS.find((p) => p.id === "wave").draw(k)}</g>`).join("")}</g>`,
    ["divider", "wave", "sea", "rule"], "A rule of rolling waves, for news from the sea.");
  add("divider-tesserae", "Divider: tesserae", 480, 10, Array.from({ length: 68 }, (_, i) => `<rect x="${2 + i * 7}" y="2" width="6" height="6" fill="${[C.clay, C.glaze, C.gold, C.glaze][i % 4]}"/>`).join(""),
    ["divider", "tesserae", "mosaic", "rule", "game"], "A single line of tesserae, as at the top and foot of the season cards.");
  add("divider-dots", "Divider: three dots", 120, 24, [42, 60, 78].map((x) => `<circle cx="${x}" cy="12" r="3" fill="${k}"/>`).join(""), ["divider", "dots", "asterism", "section break", "simple"], "Three dots in a row: the quietest section break.");

  // Ribbon, compass
  {
    const W = 480, H = 80;
    const body = `<path d="M40 22H440L452 40L440 58H40L28 40Z" fill="${C.blood}"/><path d="M48 28H432M48 52H432" stroke="${C.gold}" stroke-width="1" stroke-dasharray="1 4" stroke-linecap="round"/>` +
      `<path d="M40 22L6 14L18 38L4 62L40 58Z" fill="#6b2015"/><path d="M440 22L474 14L462 38L476 62L440 58Z" fill="#6b2015"/>`;
    add("ribbon-taenia", "Victor's ribbon", W, H, body, ["ribbon", "taenia", "victory", "games", "banner", "title"],
      "A red victor's fillet (taenia) as a banner: for a win at the games or a public honour.", { use: "One line of text, x 60 to 420, in the page colour." });
  }
  {
    const s = 200, x = 100, y = 104, r = 82;
    const pt = (a, rr) => `${f1(x + rr * Math.sin(a))} ${f1(y - rr * Math.cos(a))}`;
    let body = `<circle cx="${x}" cy="${y}" r="${r * .7}" fill="none" stroke="${C.muted}" stroke-width="1"/><circle cx="${x}" cy="${y}" r="${r * .74}" fill="none" stroke="${C.muted}" stroke-width=".5"/>`;
    for (let i = 0; i < 16; i++) {
      const a = (i * Math.PI) / 8, lvl = i % 4 === 0 ? 1 : i % 2 === 0 ? 0.62 : 0.42, w = i % 4 === 0 ? 0.2 : 0.26;
      body += `<path d="M${pt(a, r * lvl)} L${pt(a + w, r * .13)} L${x} ${y} Z" fill="${ink}"/><path d="M${pt(a, r * lvl)} L${pt(a - w, r * .13)} L${x} ${y} Z" fill="${C.page}" stroke="${ink}" stroke-width=".7"/>`;
    }
    body += `<circle cx="${x}" cy="${y}" r="4" fill="${C.gold}" stroke="${ink}" stroke-width=".8"/>`;
    add("compass-rose", "Compass rose", s, s + 8, body, ["compass", "map", "north", "wind rose"],
      "A sixteen-point compass rose for maps. Letters left off so it reads in any language; north is up.");
  }
  return out;
}

export const ORNAMENTS = () => [...patternItems(), ...ornamentItems()];
