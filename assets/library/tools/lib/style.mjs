// Shared colours and SVG wrappers for the art library. The colours are the game's own (ui/styles/style.css and
// ui/styles/art.css, docs/art-direction.md), so anything drawn here drops into the game without a new palette.

export const C = {
  page: "#efe4c8", // parchment
  panel: "#e6d7b0",
  ink: "#2b1d12", // iron-gall ink
  muted: "#5a4733",
  rule: "#c9b78a",
  accent: "#7a5424", // bronze
  gold: "#b8913a",
  olive: "#28603f", // verdigris: good
  blood: "#8e2a1c", // danger
  punic: "#5b2a63", // Carthage only
  glaze: "#1d1410", // black glaze
  clay: "#c8743a", // terracotta
  clayLight: "#e0a066",
  silver: "#b9b6ad",
  // Faction marks, the same as the coin fields of the mosaic portraits.
  ruler: "#7a2e24",
  family: "#7a2e24",
  rich: "#2a4a5a",
  citizens: "#5a5a28",
  guard: "#2f5e57",
  // The island map (docs/art-direction.md, "For the island map").
  sea: "#dfe5d8",
  land: "#e2d1a4",
  coast: "#8a7550",
};

export const FONTS = {
  display: "'IM Fell English SC', Georgia, serif",
  body: "'IM Fell DW Pica', Georgia, 'Times New Roman', serif",
  num: "'Cormorant Garamond', Georgia, serif",
  greek: "'GFS Didot', 'Cormorant Garamond', Georgia, serif",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export { esc };

// The CSS each kind of drawing needs to stand alone. Plain colours only: some SVG tools (cairosvg, older
// Inkscape) fail on var(). Inlined in the game, the game's own CSS (ui/styles/art.css) styles the same classes.
export const ICON_CSS = `.line{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}.cut{fill:${C.page}}.cut.line{fill:none;stroke:${C.page}}`;
export const TONDO_CSS = `.glaze{fill:${C.glaze}}.clay{fill:${C.clay}}.line{fill:none;stroke:${C.clay};stroke-linecap:round;stroke-linejoin:round}.cut{fill:${C.glaze}}.cut.line{fill:none;stroke:${C.glaze}}.hair{stroke:${C.clay};stroke-width:.45}.cushion{stroke:${C.glaze};stroke-width:.5}`;

// A whole standalone SVG document. Keep it one line per part so diffs stay readable.
export function doc({ w, h, vb, title, desc = "", css = "", body, color, px }) {
  const size = px ? ` width="${px[0]}" height="${px[1]}"` : ` width="${w}" height="${h}"`;
  const col = color ? ` color="${color}" fill="currentColor" style="color:${color}"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb ?? `0 0 ${w} ${h}`}"${size}${col}>\n` +
    `<title>${esc(title)}</title>\n` + (desc ? `<desc>${esc(desc)}</desc>\n` : "") +
    (css ? `<style>${css}</style>\n` : "") + body.trim() + `\n</svg>\n`;
}

// A black-figure icon on the 24-unit square, filled with currentColor (black glaze when standalone).
export const iconDoc = (title, body, desc = "", color = C.glaze) =>
  doc({ w: 24, h: 24, px: [96, 96], title, desc, css: ICON_CSS, body, color });

// Deterministic small random numbers, so every rebuild writes the same files.
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

export const f2 = (n) => (Math.round(n * 100) / 100).toString();
export const f1 = (n) => (Math.round(n * 10) / 10).toString();
