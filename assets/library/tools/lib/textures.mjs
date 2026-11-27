// Seamless surface textures as PNG tiles (256 x 256, repeat both ways): parchment, papyrus, black glaze,
// terracotta, marble, limestone, bronze with verdigris, and a sea wash for maps. Made from seeded value noise
// in plain Node (zlib only), so every rebuild writes the same bytes and nothing needs installing.
import { deflateSync } from "node:zlib";

const N = 256;

// ---- a tiny PNG writer (RGB, 8 bit) ----
const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
function crc32(buf) { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(w, h, rgb) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 3 + 1)] = 0; rgb.copy(raw, y * (w * 3 + 1) + 1, y * w * 3, (y + 1) * w * 3); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

// ---- seamless value noise: the lattice wraps at the tile edge, so the tile repeats without a seam ----
function hash(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 2246822519) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const smooth = (t) => t * t * (3 - 2 * t);
function noise(x, y, px, py, seed) {
  // px, py: lattice cells across the tile (integers), so the noise repeats every N pixels.
  const fx = (x / N) * px, fy = (y / N) * py, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = smooth(fx - x0), ty = smooth(fy - y0);
  const g = (i, j) => hash(((i % px) + px) % px, ((j % py) + py) % py, seed);
  const a = g(x0, y0), b = g(x0 + 1, y0), c = g(x0, y0 + 1), d = g(x0 + 1, y0 + 1);
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}
function fbm(x, y, seed, base = 4, oct = 5, ax = 1, ay = 1) {
  let v = 0, amp = 0.5, tot = 0;
  for (let o = 0; o < oct; o++) { const p = base << o; v += amp * noise(x, y, p * ax, p * ay, seed + o * 17); tot += amp; amp *= 0.5; }
  return v / tot;
}
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));

function make(fn) {
  const buf = Buffer.alloc(N * N * 3);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const [r, g, b] = fn(x, y); const i = (y * N + x) * 3;
    buf[i] = clamp(r); buf[i + 1] = clamp(g); buf[i + 2] = clamp(b);
  }
  return png(N, N, buf);
}

const T = {
  parchment: {
    title: "Parchment", tags: ["parchment", "page", "paper", "background", "game"],
    note: "The game's page colour (#efe4c8) with soft mottling and faint fibres; a background for panels and cards.",
    fn: (x, y) => {
      const m = fbm(x, y, 3, 2, 5), f = noise(x, y, 64, 4, 9), spot = Math.max(0, fbm(x, y, 21, 2, 3) - 0.62) * 2.2;
      return mix(hex("#efe4c8"), hex("#d9c79a"), Math.min(1, (m - 0.35) * 0.9 + f * 0.12 + spot)).map((v) => v + (hash(x, y, 5) - 0.5) * 5);
    },
  },
  papyrus: {
    title: "Papyrus", tags: ["papyrus", "scroll", "book", "background", "fibres"],
    note: "Crossed layers of papyrus strips: long fibres one way, then the other.",
    fn: (x, y) => {
      const h = noise(x, y, 2, 96, 31) * 0.6 + noise(x, y, 4, 192, 32) * 0.4, v = noise(x, y, 96, 2, 33) * 0.6 + noise(x, y, 192, 4, 34) * 0.4;
      const t = Math.max(h, v * 0.85) * 0.55 + fbm(x, y, 35, 2, 3) * 0.45;
      return mix(hex("#eadcb0"), hex("#c7ab6e"), Math.min(1, Math.max(0, (t - 0.3) * 1.25)));
    },
  },
  glaze: {
    title: "Black glaze", tags: ["glaze", "pottery", "black", "red figure", "background", "dark"],
    note: "The black glaze of the event pictures (#1d1410) with a faint sheen; a dark ground for clay-coloured drawing.",
    fn: (x, y) => {
      const s = fbm(x, y, 41, 2, 4), spark = hash(x, y, 43) > 0.997 ? 18 : 0;
      return hex("#1d1410").map((v, i) => v + (s - 0.5) * (i === 2 ? 14 : 18) + spark);
    },
  },
  terracotta: {
    title: "Terracotta", tags: ["terracotta", "clay", "pottery", "tile", "background", "warm"],
    note: "Fired clay in the figures' colour (#c8743a), with grit and a little uneven firing.",
    fn: (x, y) => {
      const m = fbm(x, y, 51, 2, 5), grit = hash(x, y, 53);
      const base = mix(hex("#c8743a"), hex("#a85c2c"), Math.max(0, m - 0.4) * 1.6);
      return grit > 0.985 ? mix(base, hex("#e8c49a"), 0.6) : grit < 0.012 ? mix(base, hex("#5a3218"), 0.5) : base;
    },
  },
  marble: {
    title: "Marble", tags: ["marble", "stone", "temple", "statue", "background", "white"],
    note: "White marble with grey veins, for temples, statues and inscriptions.",
    fn: (x, y) => {
      const w = fbm(x, y, 61, 2, 5), u = Math.abs(Math.sin(((x + y) / N) * 2 * Math.PI * 1 + w * 7.5));
      const vein = Math.pow(1 - u, 9) * 0.75 + Math.pow(1 - Math.abs(Math.sin((x / N) * 2 * Math.PI * 2 + w * 11)), 22) * 0.4;
      return mix(mix(hex("#f2efe8"), hex("#ddd8cd"), fbm(x, y, 63, 2, 3)), hex("#7e7a72"), Math.min(1, vein));
    },
  },
  limestone: {
    title: "Limestone", tags: ["limestone", "stone", "walls", "quarry", "epipolae", "background"],
    note: "Warm, pitted limestone like the walls of Epipolae and the quarries.",
    fn: (x, y) => {
      const m = fbm(x, y, 71, 4, 5), pit = fbm(x, y, 73, 8, 3), d = hash(x, y, 75);
      let c = mix(hex("#d8cfbb"), hex("#b7a98c"), Math.max(0, (m - 0.38) * 1.4));
      if (pit < 0.3) c = mix(c, hex("#8e826a"), Math.min(.6, (0.3 - pit) * 2.4));
      return c.map((v) => v + (d - 0.5) * 14);
    },
  },
  bronze: {
    title: "Bronze with verdigris", tags: ["bronze", "metal", "verdigris", "patina", "armour", "background"],
    note: "Old bronze (#7a5424) going green in patches with verdigris (#28603f), for armour, statues and plaques.",
    fn: (x, y) => {
      const m = fbm(x, y, 81, 2, 5), g = fbm(x, y, 83, 4, 4);
      const metal = mix(hex("#7a5424"), hex("#a8783a"), Math.max(0, m - 0.35) * 1.5);
      return mix(metal, mix(hex("#3f7d63"), hex("#6aa28a"), g), Math.max(0, Math.min(1, (g - 0.55) * 4)));
    },
  },
  "sea-wash": {
    title: "Sea wash", tags: ["sea", "water", "map", "background", "pale"],
    note: "The maps' pale sea (#dfe5d8) with a soft wash, for map backgrounds and harbour panels.",
    fn: (x, y) => mix(hex("#e6eadf"), hex("#cdd6c6"), Math.min(1, Math.max(0, (fbm(x, y, 91, 2, 4) - 0.3) * 1.5 + noise(x, y, 4, 48, 93) * 0.12))),
  },
};

export const TEXTURES = () => Object.entries(T).map(([id, t]) => ({
  rel: `textures/${id}.png`, id: `texture-${id}`, type: "texture", title: t.title, tags: t.tags, note: `${t.note} Seamless 256 x 256 tile.`,
  tile: [N, N], repeat: "both", use: `CSS: background: url(assets/library/made/textures/${id}.png) repeat;`,
  text: make(t.fn),
}));
