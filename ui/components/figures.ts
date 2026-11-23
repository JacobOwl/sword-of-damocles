// People for the event pictures, drawn as red-figure painters drew them: figures left in the clay colour,
// hair, beards, eyes and the folds of cloth in black glaze (docs/art-direction.md). Every figure is invention.
// Coordinates are the 120-unit tondo of ui/vignettes.ts. dir = 1 faces right, -1 faces left.
// Classes: plain shapes are clay; "cut" is glaze (a black detail); "line" is a clay stroke; "cut line" a glaze stroke.

const n = (v: number) => v.toFixed(2);
type Dir = 1 | -1;

// A path written facing right around (x, y); flipped for dir -1.
function P(x: number, y: number, dir: Dir, s: number, pts: string) {
  // H and V take one number, so turn them into L with the current point first (all commands here are absolute).
  let cx = 0, cy = 0, sx = 0, sy = 0;
  const full = pts.replace(/([MLCQHVZ])([^MLCQHVZ]*)/g, (_m, c: string, args: string) => {
    const v = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (c === "H") { cx = v[v.length - 1]; return `L${cx},${cy} `; }
    if (c === "V") { cy = v[v.length - 1]; return `L${cx},${cy} `; }
    if (c === "Z") { cx = sx; cy = sy; return "Z "; }
    if (v.length >= 2) { cx = v[v.length - 2]; cy = v[v.length - 1]; }
    if (c === "M") { sx = cx; sy = cy; }
    return `${c}${args}`;
  });
  return full.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_m, a: string, b: string) => `${n(x + dir * s * Number(a))},${n(y + s * Number(b))}`);
}

export type HeadOpts = { beard?: boolean; hair?: "short" | "bun" | "veil" | "helmet" | "bald"; wreath?: boolean };

/** A head in profile. (x, y) is the middle of the face; s = 1 is a head about 13 units tall with its neck. */
export function head(x: number, y: number, dir: Dir, o: HeadOpts = {}, s = 1) {
  const q = (pts: string) => P(x, y, dir, s, pts);
  const face = `<path d="${q("M-4.2,1 C-5.6,-3 -3.8,-6.4 0.2,-6.4 C3.4,-6.4 4.6,-4.4 4.8,-2.2 L6.6,0.6 L4.9,1.2 L5.1,2.2 L4.7,2.6 L4.6,3.9 C3,5 0.5,5 -0.8,4.2 L-0.6,7.6 L-4.2,7.6 Z")}"/>`;
  const eye = `<path d="${q("M2.1,-1.7 L3.3,-1.9 L2.9,-1.2 Z")}" class="cut"/><path d="${q("M1.6,-3 C2.4,-3.5 3.4,-3.4 4,-2.9")}" class="cut line" style="stroke-width:${n(0.45 * s)}"/>`;
  const ear = `<path d="${q("M-1.2,-1.6 C-0.2,-1.8 0.2,0.2 -0.9,0.8")}" class="cut line" style="stroke-width:${n(0.4 * s)}"/>`;
  let hair = "";
  const h = o.hair ?? "short";
  if (h === "short" || h === "bun") hair = `<path d="${q("M-4.7,2.6 C-6.2,-3 -3.6,-7 0.4,-7 C3.2,-7 4.7,-5.3 4.6,-3.6 C2.6,-4.8 0.6,-4.4 -0.4,-2.8 C-1.4,-1 -2.2,1.8 -4.7,2.6 Z")}" class="cut"/>`;
  if (h === "bun") hair += `<circle cx="${n(x - dir * s * 5)}" cy="${n(y - s * 3.4)}" r="${n(2.6 * s)}" class="cut"/><path d="${q("M3.2,-5.6 C1,-6.6 -3,-6.4 -5.2,-3.6")}" class="line" style="stroke-width:${n(0.5 * s)}"/>`;
  if (h === "short") hair += `<path d="${q("M3.4,-5.5 C0.8,-6.6 -3.4,-5.4 -5,-1.6")}" class="line" style="stroke-width:${n(0.45 * s)}"/>`;
  if (h === "veil") hair = `<path d="${q("M-4.7,2.6 C-6.2,-3 -3.6,-7 0.4,-7 C3.2,-7 4.7,-5.3 4.6,-3.6 C2.6,-4.8 0.6,-4.4 -0.4,-2.8 C-1.4,-1 -2.2,1.8 -4.7,2.6 Z")}" class="cut"/>
    <path d="${q("M-1.4,-7.6 C2.4,-8.6 5.4,-6.6 5.2,-4.4 C3.6,-6 0.6,-6.4 -1.6,-5 C-4.4,-2 -5.4,4 -7.2,10 C-8.4,14 -9.6,18 -10.6,22 L-12.6,16 C-11,8 -8.6,-4 -1.4,-7.6 Z")}"/>
    <path d="${q("M-2.4,-6.2 C-5.8,-2 -7.8,6 -10.4,18 M-0.4,-6.8 C-3.6,-3 -5.6,4 -8,12")}" class="cut line" style="stroke-width:${n(0.45 * s)}"/>`;
  if (h === "helmet") hair = `<path d="${q("M-5.4,4 C-6.6,-3 -3.6,-7.6 0.8,-7.6 C4,-7.6 5.6,-5.2 5.4,-2.6 L5.4,-0.4 L3,-0.4 L2.6,1.6 L3.2,4.6 L-0.2,4.8 L-1.4,7.6 L-5.4,7 Z")}"/>
    <path d="${q("M5.4,-1.4 H1.6 C0.8,-1.4 0.6,-0.6 0.8,0.2 L0.8,4.4 M-5,-0.6 C-2,-1.6 1,-2.2 5.2,-2.4 M-3.6,4.6 C-3,6 -2,7 -1.4,7.4")}" class="cut line" style="stroke-width:${n(0.55 * s)}"/>
    <path d="${q("M-6.4,-5.8 C-5,-10.4 2,-12.4 6.6,-9.4 C3,-9.6 -1,-8.8 -3.6,-6.6 Z")}"/><path d="${q("M-0.6,-7.4 L0.2,-9.6")}" class="line" style="stroke-width:${n(1.2 * s)}"/>
    <path d="${q("M-5,-7.6 C-3,-9.4 1,-10.4 4.6,-9.8 M-4,-6.8 C-2,-8.4 1.6,-9.2 4,-9")}" class="cut line" style="stroke-width:${n(0.35 * s)}"/>`;
  const beard = o.beard ? `<path d="${q("M4.7,2.6 L4.6,4 C4,7 1.5,7.6 -0.6,5.6 C-1.4,4.2 -0.8,2.4 0.6,2 L3,2.8 Z")}" class="cut"/>` : "";
  const wreath = o.wreath ? Array.from({ length: 5 }, (_, i) => `<ellipse cx="${n(x + dir * s * (3.6 - i * 2))}" cy="${n(y - s * (5.6 - Math.abs(i - 1.6) * 0.6))}" rx="${n(1.3 * s)}" ry="${n(0.55 * s)}" transform="rotate(${dir * (-30 + i * 14)} ${n(x + dir * s * (3.6 - i * 2))} ${n(y - s * (5.6 - Math.abs(i - 1.6) * 0.6))})"/>`).join("") : "";
  // Black hair on a black ground: a thin reserved line of clay round it, as the painters left.
  const rim = (t: string) => t.replace(/class="cut"/g, 'class="cut hair"');
  return face + rim(hair) + (h === "helmet" ? "" : ear) + eye + rim(beard) + wreath;
}

const limb = (d: string, w: number) => `<path d="${d}" class="line limb" style="stroke-width:${n(w)}"/>`;
const hand = (x: number, y: number, r = 1.4) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}"/>`;

/** A man standing in a himation. (x, y) is between his feet; he is about 60 units tall at s = 1.
    arm: "wrapped" (inside the cloak), "raised" (speaking), "forward" (offering), "staff" (leaning on a staff). */
export function standingMan(x: number, y: number, dir: Dir, o: { arm?: "wrapped" | "raised" | "forward" | "staff" | "mouth"; beard?: boolean; wreath?: boolean; hair?: HeadOpts["hair"] } = {}, s = 1) {
  const q = (pts: string) => P(x, y, dir, s, pts);
  const feet = `<path d="${q("M-3,-1.6 L3.6,-1.6 L6,0 L-3,0 Z M-8,-1.6 L-2.6,-1.6 L-1.6,0 L-8.4,0 Z")}"/>`;
  const body = `<path d="${q("M-6.6,-44 C-2,-46 4,-46 7.4,-44 C9.6,-36 9.8,-24 8.6,-14 C8.2,-8 7.6,-4 7,-2 L-8.6,-2 C-9.6,-12 -10.4,-26 -6.6,-44 Z")}"/>`;
  const folds = `<path d="${q("M7.4,-43 C2,-36 -4,-30 -9,-26 M8.4,-30 C3,-26 -2,-22 -9.4,-18 M3.6,-22 L4.6,-3 M0.6,-20 L0.8,-3 M-2.6,-18 L-3.4,-3 M-6,-17 L-6.8,-3 M7.4,-16 C6.8,-10 6.6,-6 6.2,-3")}" class="cut line" style="stroke-width:${n(0.55 * s)}"/>`;
  const hem = `<path d="${q("M-8.6,-2 C-5,-3 -1,-1.4 2,-2.4 C4,-3 5.6,-1.6 7,-2")}" class="cut line" style="stroke-width:${n(0.5 * s)}"/>`;
  const neck = "";
  let arm = "";
  const a = o.arm ?? "wrapped";
  if (a === "raised") arm = limb(q("M5,-41 L12,-47 L14.6,-56"), 3 * s) + hand(x + dir * s * 14.8, y - s * 57.4, 1.5 * s) + `<path d="${q("M15.6,-58.6 L15.2,-61 M14.4,-59 L13.8,-61.2")}" class="line" style="stroke-width:${n(0.8 * s)}"/>`;
  if (a === "forward") arm = limb(q("M5,-41 L10,-32 L17,-34"), 3 * s) + hand(x + dir * s * 17.6, y - s * 34.2, 1.5 * s);
  if (a === "staff") arm = limb(q("M5,-41 L10,-32 L13,-36"), 3 * s) + `<path d="${q("M14,-50 L15,0")}" class="line" style="stroke-width:${n(1.4 * s)}"/>` + hand(x + dir * s * 14, y - s * 36, 1.5 * s);
  if (a === "mouth") arm = limb(q("M5,-41 L8,-34 L7,-48"), 3 * s) + hand(x + dir * s * 7, y - s * 48.6, 1.4 * s);
  const hd = head(x + dir * s * 1.2, y - s * 52.4, dir, { beard: o.beard ?? true, wreath: o.wreath, hair: o.hair }, s);
  return feet + body + folds + hem + neck + hd + arm;
}

/** A woman standing in a long chiton and mantle, veiled or with her hair up. */
export function standingWoman(x: number, y: number, dir: Dir, o: { veil?: boolean; arm?: "veil" | "forward" | "down" | "torch" } = {}, s = 1) {
  const q = (pts: string) => P(x, y, dir, s, pts);
  const feet = `<path d="${q("M2,-1.4 L6,-1.4 L7.4,0 L2,0 Z")}"/>`;
  const body = `<path d="${q("M-5.6,-44 C-1.6,-46 3,-46 6.4,-44 C7.6,-36 7.4,-28 7.8,-20 C8.4,-12 9.6,-6 10.4,-1.4 L-10,-1.4 C-9,-8 -8.2,-16 -7.6,-24 C-7,-32 -7.6,-38 -5.6,-44 Z")}"/>`;
  const folds = `<path d="${q("M5,-20 L7.6,-2 M2,-19 L3.4,-2 M-1,-19 L-0.8,-2 M-4,-19 L-4.6,-2 M-6.8,-20 L-7.8,-2 M-7,-24 C-2,-21 3,-21 7.6,-24 M6.4,-43 C3,-38 2,-32 2.4,-26")}" class="cut line" style="stroke-width:${n(0.5 * s)}"/>`;
  let arm = "";
  const a = o.arm ?? "down";
  if (a === "veil") arm = limb(q("M4.4,-41 L10,-36 L8,-48"), 2.6 * s) + hand(x + dir * s * 7.8, y - s * 48.8, 1.3 * s);
  if (a === "forward") arm = limb(q("M4.4,-41 L9,-33 L16,-35"), 2.6 * s) + hand(x + dir * s * 16.6, y - s * 35.2, 1.3 * s);
  if (a === "torch") arm = limb(q("M4.4,-41 L9,-34 L12,-40"), 2.6 * s) + `<path d="${q("M12.6,-62 L12,-24")}" class="line" style="stroke-width:${n(1.5 * s)}"/>` +
    `<path d="${q("M12.6,-62 C10,-64 10.4,-68 12.8,-72 C13,-69 15,-69 14.8,-66 C15.6,-67 16.4,-66 16,-64 C15.4,-62 14,-61.4 12.6,-62 Z")}"/>` + hand(x + dir * s * 12.2, y - s * 40, 1.3 * s);
  const hd = head(x + dir * s * 1, y - s * 52, dir, { hair: o.veil ? "veil" : "bun" }, s * 0.95);
  return feet + body + folds + hd + arm;
}

/** A man reclining at a feast on a couch, propped on his left elbow, a cup held out. (x, y) is the middle of the couch top. */
export function symposiast(x: number, y: number, dir: Dir, s = 1) {
  const q = (pts: string) => P(x, y, dir, s, pts);
  const couch = `<path d="${q("M-34,0 H34 V3 H-34 Z M-32,3 L-30,18 H-27 L-28,3 Z M28,3 L27,18 H30 L32,3 Z M-34,0 C-36,-6 -34,-10 -30,-10 L-28,-2 Z")}"/>
    <path d="${q("M-31,-0.4 C-31,-8 -26,-11 -20,-10 C-17,-7 -18,-2 -20,0 Z")}" class="cushion"/>`;
  const legs = `<path d="${q("M-14,-1 C-6,-9 10,-9 24,-6 C29,-5 31,-3 30,0 L-14,0 Z")}"/>
    <path d="${q("M-8,-6 C0,-4 10,-4 22,-4 M-2,-8 C6,-6 16,-6 26,-5 M4,-2 C10,-3 18,-2 28,-2")}" class="cut line" style="stroke-width:${n(0.5 * s)}"/>
    <path d="${q("M29,-3 L33,-4 L33.6,-2.4 L30,-1.6 Z")}"/>`;
  const torso = `<path d="${q("M-15,-1 C-17,-10 -19,-18 -20,-26 L-12,-28 C-10,-20 -8,-10 -6,-2 Z")}"/>
    <path d="${q("M-17.4,-20 C-15,-19 -13,-19.6 -11.8,-21 M-16,-12 C-13.6,-12 -11,-13 -9.4,-14")}" class="cut line" style="stroke-width:${n(0.5 * s)}"/>`;
  const elbow = limb(q("M-19,-25 L-24,-16 L-20,-11"), 3 * s);
  const arm = limb(q("M-13,-26 L-5,-21 L2,-25"), 3 * s) + hand(x + dir * s * 2.6, y - s * 25.4, 1.4 * s);
  const cup = `<path d="${q("M-1,-28 H10 C10,-25.4 7.6,-24.2 4.5,-24.2 C1.4,-24.2 -1,-25.4 -1,-28 Z M3.8,-24.2 H5.2 V-22.6 H3.8 Z M2.2,-22.4 H6.8 V-21.6 H2.2 Z")}"/>`;
  const hd = head(x + dir * s * -14.4, y - s * 33, dir, { beard: true, wreath: true }, s * 0.95);
  return couch + legs + torso + elbow + hd + arm + cup;
}

/** A man seated on a chair, facing dir, holding something in his lap or reading a tablet. */
export function seatedMan(x: number, y: number, dir: Dir, o: { hold?: "tablet" | "staff" | "none"; beard?: boolean } = {}, s = 1) {
  const q = (pts: string) => P(x, y, dir, s, pts);
  const chair = `<path d="${q("M-12,-19 H6 V-17 H-12 Z")}"/><path d="${q("M-10,-17 C-12,-10 -15,-4 -17,0 M4,-17 C6,-10 8,-4 10,0 M-11,-19 C-12,-26 -13,-32 -16,-36")}" class="line" style="stroke-width:${n(1.6 * s)}"/>`;
  const body = `<path d="${q("M-10,-19 C-11,-28 -10,-36 -6,-42 L2,-42 C4,-34 4,-26 3,-21 L12,-21 C14,-14 14,-6 13,-1 L8,-1 C8,-8 7.6,-14 7,-17 L-10,-17 Z")}"/>
    <path d="${q("M-8,-24 C-3,-23 3,-22 11,-20 M-9,-30 C-5,-27 -1,-25 3,-24 M12.6,-16 L12,-2 M9.6,-16 L9.6,-2 M-4,-38 C-6,-32 -6,-26 -6,-20")}" class="cut line" style="stroke-width:${n(0.5 * s)}"/>
    <path d="${q("M8.6,-1 L14,-1 L15.6,0 L8.6,0 Z")}"/>`;
  let arms = "";
  const h = o.hold ?? "none";
  if (h === "tablet") arms = limb(q("M0,-38 L4,-29 L9,-31"), 2.8 * s) + `<path d="${q("M7.6,-38 L13.6,-36 L12,-27 L6,-29 Z")}"/><path d="${q("M8.4,-35.4 L12.4,-34.2 M8,-33.2 L12,-32 M7.6,-31 L11.4,-30")}" class="cut line" style="stroke-width:${n(0.45 * s)}"/>` + hand(x + dir * s * 9, y - s * 31, 1.3 * s);
  if (h === "staff") arms = limb(q("M0,-38 L5,-30 L10,-33"), 2.8 * s) + `<path d="${q("M11,-50 L13,0")}" class="line" style="stroke-width:${n(1.3 * s)}"/>` + hand(x + dir * s * 10.6, y - s * 33, 1.4 * s);
  const hd = head(x + dir * s * -1.6, y - s * 48, dir, { beard: o.beard ?? true }, s);
  return chair + body + hd + arms;
}

/** A hoplite: crested helmet, round shield on the left arm, spear upright in the right hand. */
export function hoplite(x: number, y: number, dir: Dir, o: { blazon?: string } = {}, s = 1) {
  const q = (pts: string) => P(x, y, dir, s, pts);
  const legs = limb(q("M-2,-22 L-4,-11 L-5,-1"), 3.2 * s) + limb(q("M3,-22 L6,-11 L7,-1"), 3.2 * s) +
    `<path d="${q("M-7,-1.6 L-2,-1.6 L-1,0 L-7.4,0 Z M5,-1.6 L10,-1.6 L11.4,0 L5,0 Z M-5.2,-12 L-3,-4 M6.6,-12 L7,-4")}" class="cut line" style="stroke-width:${n(0.5 * s)}"/>`;
  const chiton = `<path d="${q("M-6,-24 L7,-24 L8,-20 L-7,-20 Z")}"/><path d="${q("M-5,-21 L-5.4,-20 M-2,-21 L-2,-20 M1,-21 L1,-20 M4,-21 L4.2,-20")}" class="cut line" style="stroke-width:${n(0.5 * s)}"/>`;
  const torso = `<path d="${q("M-5,-24 C-6,-32 -5,-40 -2,-44 L5,-44 C7,-38 7,-30 7,-24 Z")}"/>`;
  const spear = `<path d="${q("M12,-70 L12,2")}" class="line" style="stroke-width:${n(1.2 * s)}"/><path d="${q("M12,-78 C13.4,-75 13.4,-72 12,-69 C10.6,-72 10.6,-75 12,-78 Z")}"/>` + limb(q("M4,-41 L9,-34 L12,-40"), 3 * s) + hand(x + dir * s * 12, y - s * 40, 1.6 * s);
  const shield = `<circle cx="${n(x - dir * s * 3)}" cy="${n(y - s * 32)}" r="${n(13 * s)}"/><circle cx="${n(x - dir * s * 3)}" cy="${n(y - s * 32)}" r="${n(10.6 * s)}" class="cut line" style="stroke-width:${n(0.8 * s)}"/>${o.blazon ?? `<path d="${P(x - dir * s * 3, y - s * 32, dir, s, "M-4,3 L0,-5 L4,3")}" class="cut line" style="stroke-width:${n(1.6 * s)}"/>`}`;
  const hd = head(x + dir * s * 1.6, y - s * 50, dir, { hair: "helmet" }, s * 0.95);
  return spear + legs + chiton + torso + hd + shield;
}

/** A man lying sick on a bed under a blanket, his head on a pillow. (x, y) is the middle of the bed top. */
export function sickBed(x: number, y: number, dir: Dir, s = 1) {
  const q = (pts: string) => P(x, y, dir, s, pts);
  const bed = `<path d="${q("M-30,0 H30 V3 H-30 Z M-28,3 L-27,16 H-24 L-25,3 Z M24,3 L23,16 H26 L27,3 Z M30,0 C33,-5 32,-9 28,-9 L27,-1 Z")}"/>`;
  const body = `<path d="${q("M-22,-1 C-18,-8 -6,-9 8,-8 C18,-8 26,-6 27,-1 Z")}"/><path d="${q("M-16,-5 C-6,-6 6,-6 24,-4 M-10,-2 C0,-3 12,-3 22,-2")}" class="cut line" style="stroke-width:${n(0.5 * s)}"/>
    <path d="${q("M-31,-0.6 C-31,-6 -27,-8 -21,-7 C-19,-4 -20,-1 -21,0 Z")}" class="cushion"/>`;
  const hd = `<g transform="rotate(${dir * -70} ${n(x - dir * s * 24)} ${n(y - s * 7)})">${head(x - dir * s * 24, y - s * 7, dir, { beard: true }, s * 0.85)}</g>`;
  return bed + body + hd;
}
