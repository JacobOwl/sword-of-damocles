// The game's icons, drawn as black-figure silhouettes on a 24-unit square (see docs/art-direction.md).
// Every icon is invention. They fill with currentColor, so a faction colour or black glaze comes from CSS.
// "cut" parts are holes knocked out in the page colour (an eye, a keyhole), so they read on any ground.

const leaf = (x: number, y: number, a: number, l = 3.2, w = 1.15) =>
  `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${(l / 2).toFixed(2)}" ry="${(w / 2).toFixed(2)}" transform="rotate(${a.toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})"/>`;

function grainEar() {
  let s = `<path d="M11.55 22.5 C11.7 17 11.8 12 12 6 L12.5 6 C12.5 12 12.4 17 12.45 22.5 Z"/>`;
  for (let i = 0; i < 5; i++) {
    const y = 7.4 + i * 2.75;
    s += leaf(10.25, y + 0.6, -58, 3.6, 1.75) + leaf(13.75, y + 0.6, 58, 3.6, 1.75);
    s += `<path d="M10.1 ${y - 0.6} L7.2 ${y - 3.4}" class="line"/><path d="M13.9 ${y - 0.6} L16.8 ${y - 3.4}" class="line"/>`;
  }
  s += leaf(12.2, 4.6, 90, 3.8, 1.7) + `<path d="M12.2 2.8 L12.2 0.4" class="line"/>`;
  return s;
}

function laurel() {
  // Two branches on a circle, leaves in pairs leaning up the branch, tied at the foot.
  let s = "";
  const r = 8.2;
  for (const side of [-1, 1]) {
    const a0 = 90 + side * 16, a1 = 90 + side * 160;
    const pt = (a: number, rr = r) => [12 + rr * Math.cos((a * Math.PI) / 180), 12.6 + rr * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    s += `<path d="M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 0 ${side < 0 ? 1 : 0} ${x1.toFixed(2)} ${y1.toFixed(2)}" class="line" style="stroke-width:.8"/>`;
    for (let i = 0; i < 6; i++) {
      const a = a0 + ((a1 - a0) * (i + 0.6)) / 6.4;
      const tangent = a + (side < 0 ? 90 : -90);
      for (const k of [-1, 1]) {
        const [x, y] = pt(a, r + k * 1.35);
        s += leaf(x, y, tangent - side * k * 28 + 180, 3.5, 1.55);
      }
    }
  }
  s += `<path d="M10.2 20.6 L12 19.4 L13.8 20.6 M12 19.4 L10.8 23 M12 19.4 L13.2 23" class="line" style="stroke-width:.8"/>`;
  return s;
}

// The drawings. Keep each one plain: a silhouette, at most two cut details.
const ICONS: Record<string, string> = {
  // ---- Factions ----
  sword: `<path d="M12 0 L12 2.2" class="line hair" style="stroke-width:.35"/>
    <circle cx="12" cy="3.4" r="1.45"/><rect x="11.15" y="4.6" width="1.7" height="3.4" rx=".4"/>
    <path d="M6.6 8 H17.4 L16.6 9.7 H7.4 Z"/>
    <path d="M10.55 9.7 H13.45 L13.05 19.6 L12 23.4 L10.95 19.6 Z"/><path d="M12 10.4 V19.4" class="cut line" style="stroke-width:.45"/>`,
  hearth: `<path d="M4.5 13.6 H19.5 V15.6 H18 V19.8 H19.5 V22 H4.5 V19.8 H6 V15.6 H4.5 Z"/>
    <path d="M7.6 16.4 H16.4 V19.1 H7.6 Z" class="cut"/>
    <path d="M12 2.4 C14.6 5.6 16.6 7.6 16 10.6 C15.6 12.6 14 13.2 12 13.2 C10 13.2 8.3 12.5 8 10.6 C7.6 8.4 9.1 7.2 9.8 5.4 C10.5 7.2 11.2 7.8 11.4 8.8 C12.4 6.8 12.7 4.8 12 2.4 Z"/>`,
  horse: `<path d="M8.2 22.6 C7.8 18.6 8.6 15.4 10 13.1 L6.6 14.4 C5.3 14.9 4.1 14.3 4.3 13 L4.8 10.6 C5.6 7.6 7.8 5.2 10.6 4.3 L10.9 1.6 L12.6 3.6 L13.8 1.9 L14.4 4.2 C17.6 5.4 19.6 8.8 19.8 12.6 C20 16.4 19 19.8 18.6 22.6 Z"/>
    <circle cx="9.7" cy="7.9" r=".95" class="cut"/><path d="M14.6 5.4 C17 7.6 17.8 11.4 17.2 15.6" class="cut line" style="stroke-width:.6"/>
    <path d="M5.2 12.7 L6.6 12.3" class="cut line" style="stroke-width:.6"/>`,
  grain: grainEar(),
  helmet: `<path d="M3.6 6.8 C4.6 2.8 9.6 .9 15.2 1.4 C19 1.8 21.6 3.6 22.6 6.8 C21 5.6 19 5 16.4 5 C12 5 9.4 5.6 7.6 7 Z"/>
    <rect x="11.4" y="4.6" width="2" height="2.4"/>
    <path d="M18.6 21.4 C19.6 18.8 20.2 16 19.9 13.4 C19.5 8.8 16.6 6.4 12.4 6.4 C8.2 6.4 5.4 8.9 4.8 12.6 L4.4 16.2 C4.4 16.9 4.9 17.3 5.6 17.3 L6.6 17.3 L6.6 20.6 C6.6 21.4 7.3 21.8 8.1 21.6 L10.4 21 C11 20.8 11.4 20.3 11.4 19.6 L11.6 17.2 C13 18.2 14 19.6 14.3 21.4 Z"/>
    <path d="M4.2 11.7 H10.6 C11.2 11.7 11.5 12.1 11.4 12.6 L11.3 13.4 H8.1 L8 21.4 L6.6 21.4 L6.6 13.4 H4.2 Z" class="cut"/>
    <path d="M13.6 9.4 C16 9.6 17.6 11.4 17.8 14" class="cut line" style="stroke-width:.6"/>`,
  palm: `<path d="M11.1 22.6 C11.5 18 12 13.6 12.7 9.6 L13.7 9.7 C13.4 13.8 13.2 18 13.2 22.6 Z"/>
    <path d="M12.2 12 h1.3 M12 15 h1.3 M11.8 18 h1.4" class="cut line" style="stroke-width:.5"/>
    <path d="M13.2 9.2 C10.4 6.8 6.2 7 3 10.4 C6.4 9 9.8 9.2 13 10 Z"/>
    <path d="M13.2 9.2 C16 6.8 20.2 7 23 10.4 C19.6 9 16.2 9.2 13.4 10 Z"/>
    <path d="M13.1 9.1 C11.6 5.4 8.4 3.4 4.8 3.8 C8.2 4.8 10.6 6.6 12.6 9.6 Z"/>
    <path d="M13.3 9.1 C14.8 5.4 18 3.4 21.6 3.8 C18.2 4.8 15.8 6.6 13.8 9.6 Z"/>
    <path d="M13.2 9 C12.8 5.6 13.4 3 15 1 C14.6 3.6 14.4 6 14 9.2 Z"/>
    <circle cx="12.4" cy="10.6" r=".9"/><circle cx="14.2" cy="10.8" r=".9"/>`,
  // ---- Offices ----
  citadel: `<path d="M5 22.4 V9.6 H4.2 V5 H7.4 V7 H9.6 V5 H11 V3 H13 V5 H14.4 V7 H16.6 V5 H19.8 V9.6 H19 V22.4 Z"/>
    <path d="M9.8 22.4 V17.4 C9.8 15.8 10.8 15 12 15 C13.2 15 14.2 15.8 14.2 17.4 V22.4 Z" class="cut"/>
    <rect x="11.4" y="9.4" width="1.2" height="3" class="cut"/><rect x="7" y="11" width="1" height="2.4" class="cut"/><rect x="16" y="11" width="1" height="2.4" class="cut"/>`,
  treasury: `<path d="M3.5 10.6 C3.5 7 6 5.4 12 5.4 C18 5.4 20.5 7 20.5 10.6 Z"/>
    <rect x="3.5" y="11.4" width="17" height="9.6" rx=".6"/>
    <path d="M7.2 5.9 V21 M16.8 5.9 V21" class="cut line" style="stroke-width:.7"/>
    <circle cx="12" cy="14.6" r="1.3" class="cut"/><path d="M11.45 15.2 H12.55 L12.9 17.8 H11.1 Z" class="cut"/>
    <rect x="4.4" y="21" width="2.4" height="1.6"/><rect x="17.2" y="21" width="2.4" height="1.6"/>`,
  mint: `<circle cx="12" cy="12" r="10.2" class="line" style="stroke-width:1.5"/>
    <circle cx="12" cy="12" r="8.1" class="line dots" style="stroke-width:1.1;stroke-dasharray:.1 1.6;stroke-linecap:round"/>
    <path d="M5.2 13.4 C6.2 9.4 10.4 7.6 14 8.6 L16.6 6.6 L16.2 9.6 C17.6 10.6 18.6 12 18.4 13.2 L16.6 12.6 C14.8 14.8 10.8 15.8 8 14.6 L5.6 16.6 L6.4 14 Z"/>
    <circle cx="15.6" cy="10.8" r=".55" class="cut"/>`,
  fleet: `<path d="M5.4 13.4 C3.6 11 3.6 7.6 5.8 5.4 C5.4 8.2 6 10.8 7.6 13.4 Z"/>
    <path d="M1.4 14.2 H19.6 C20.8 14.2 21.6 13.4 22 12.2 L22.8 12.6 C22.6 14 22 15.2 21.2 15.8 L23.6 16.4 L21 17.2 H5.6 C4.2 17.2 3 16.6 2.4 15.8 L1 15.6 Z"/>
    <path d="M6 17.2 L4.6 21.6 M8.4 17.2 L7 21.6 M10.8 17.2 L9.4 21.6 M13.2 17.2 L11.8 21.6 M15.6 17.2 L14.2 21.6 M18 17.2 L16.6 21.6" class="line" style="stroke-width:.85"/>
    <circle cx="19.4" cy="15.6" r=".7" class="cut"/><path d="M5 15.7 H17" class="cut line" style="stroke-width:.5"/>`,
  generalship: `<path d="M3.4 22 L19 4.4" class="line" style="stroke-width:1.2"/><path d="M21.4 1.6 C21.2 3.8 20.2 5.4 18.6 6.2 L17.6 5.2 C18.4 3.6 19.8 2.2 21.4 1.6 Z"/>
    <circle cx="10.6" cy="13.4" r="7.2"/><circle cx="10.6" cy="13.4" r="5.6" class="cut line" style="stroke-width:.6"/>
    <path d="M8.4 10.2 C11.4 9.6 13.8 11.6 13.6 14.4 C13.4 16.4 11.8 17.4 10.2 17.4 C12.2 16.4 12.8 14.6 12.2 13 C11.6 11.4 10.2 10.4 8.4 10.2 Z" class="cut"/>`,
  assembly: `<path d="M2.4 22.4 V18.8 H6.6 V15.6 H17.4 V18.8 H21.6 V22.4 Z"/><path d="M9.6 15.6 V12.6 H14.4 V15.6 Z"/>
    <circle cx="7" cy="7.6" r="1.9"/><circle cx="12" cy="5.6" r="1.9"/><circle cx="17" cy="7.6" r="1.9"/>
    <circle cx="12" cy="5.6" r=".7" class="cut"/>`,
  // ---- Action areas ----
  court: `<path d="M3.4 8.6 H20.6 C20.6 12.4 16.8 14.6 12 14.6 C7.2 14.6 3.4 12.4 3.4 8.6 Z"/>
    <path d="M3.6 9.6 C1.4 9.2 .8 7.2 2.2 6.4 M20.4 9.6 C22.6 9.2 23.2 7.2 21.8 6.4" class="line" style="stroke-width:1.1"/>
    <rect x="11.2" y="14.4" width="1.6" height="4.2"/><ellipse cx="12" cy="19.8" rx="4.6" ry="1.4"/>
    <path d="M6.4 10.6 C9.6 12.4 14.4 12.4 17.6 10.6" class="cut line" style="stroke-width:.55"/>`,
  city: `<rect x="4.6" y="2.6" width="14.8" height="2"/><path d="M6.2 4.6 H17.8 L16.2 7 H7.8 Z"/>
    <path d="M8.2 7 H15.8 L15.1 19.2 H8.9 Z"/>
    <path d="M10.2 7.6 L10.4 18.8 M12 7.6 V18.8 M13.8 7.6 L13.6 18.8" class="cut line" style="stroke-width:.55"/>
    <rect x="6.6" y="19.2" width="10.8" height="1.6"/><rect x="4.4" y="20.8" width="15.2" height="1.8"/>`,
  war: `<path d="M3.6 21.8 L18.4 5" class="line" style="stroke-width:1.2"/><path d="M20.6 2.4 C20.4 4.6 19.4 6.1 17.8 6.9 L16.9 5.9 C17.7 4.3 19 3 20.6 2.4 Z"/>
    <path d="M20.4 21.8 L5.6 5" class="line" style="stroke-width:1.2"/><path d="M3.4 2.4 C3.6 4.6 4.6 6.1 6.2 6.9 L7.1 5.9 C6.3 4.3 5 3 3.4 2.4 Z"/>
    <path d="M2.8 20.6 L4.8 22.6 M21.2 20.6 L19.2 22.6" class="line" style="stroke-width:1.8"/>`,
  spies: `<path d="M1.2 12.4 C5.4 6 18.6 6 22.8 12.4 C18.6 18.8 5.4 18.8 1.2 12.4 Z"/>
    <circle cx="12" cy="12.4" r="4.1" class="cut"/><circle cx="12" cy="12.4" r="2.2"/><circle cx="12.8" cy="11.6" r=".6" class="cut"/>
    <path d="M3.4 6.6 C7.6 2.6 16.4 2.6 20.6 6.6" class="line" style="stroke-width:1.3"/>`,
  embassy: `<rect x="11.3" y="8.6" width="1.4" height="14" rx=".5"/>
    <path d="M9 1.6 C8 4.6 9.2 7.8 12 7.8 C14.8 7.8 16 4.6 15 1.6" class="line" style="stroke-width:1.5"/>
    <path d="M8.6 10 C10.6 11.2 13.4 11.2 15.4 10 M8.6 13 C10.6 11.8 13.4 11.8 15.4 13" class="line" style="stroke-width:1"/>
    <circle cx="12" cy="8.4" r="1.1"/>`,
  scheming: `<path d="M12 1.4 L13.6 5.6 L13.3 14.2 H10.7 L10.4 5.6 Z"/><path d="M12 3.6 V13.6" class="cut line" style="stroke-width:.45"/>
    <path d="M7.2 14.2 H16.8 C16.8 15.2 16 15.8 15 15.8 H9 C8 15.8 7.2 15.2 7.2 14.2 Z"/>
    <rect x="11" y="15.8" width="2" height="4.8"/><circle cx="12" cy="21.6" r="1.5"/>`,
  // ---- Stores and standing ----
  silver: `<ellipse cx="12" cy="18.6" rx="8.4" ry="2.6"/><path d="M3.6 16.2 V18.6 H20.4 V16.2 Z"/>
    <ellipse cx="12" cy="16.2" rx="8.4" ry="2.6" class="cut line" style="stroke-width:.5"/>
    <ellipse cx="12.8" cy="12.4" rx="7.6" ry="2.4"/><path d="M5.2 10.2 V12.4 H20.4 V10.2 Z"/><ellipse cx="12.8" cy="10.2" rx="7.6" ry="2.4" class="cut line" style="stroke-width:.5"/>
    <ellipse cx="11.6" cy="6.4" rx="6.8" ry="2.2"/><path d="M4.8 4.4 V6.4 H18.4 V4.4 Z"/><ellipse cx="11.6" cy="4.4" rx="6.8" ry="2.2"/>
    <ellipse cx="11.6" cy="4.4" rx="4.6" ry="1.3" class="cut line" style="stroke-width:.45"/>`,
  land: `<path d="M8.2 19.6 V8 C8.2 5 9.9 3.4 12 3.4 C14.1 3.4 15.8 5 15.8 8 V19.6 Z"/>
    <path d="M9.8 8.4 H14.2 M9.8 10.6 H14.2 M9.8 12.8 H13" class="cut line" style="stroke-width:.6"/>
    <path d="M1 20.4 H23 V22.4 H1 Z"/><path d="M2 18.6 L5.6 17.6 M18.4 17.6 L22 18.6" class="line" style="stroke-width:.8"/>`,
  defense: `<circle cx="12" cy="12" r="10.4"/><circle cx="12" cy="12" r="8.4" class="cut line" style="stroke-width:.8"/>
    <path d="M12 6.4 L13.7 10.3 L17.8 10.6 L14.6 13.3 L15.6 17.4 L12 15.2 L8.4 17.4 L9.4 13.3 L6.2 10.6 L10.3 10.3 Z" class="cut"/>`,
  influence: laurel(),
  guard: "",
  carthage: "",
  // ---- Small marks ----
  plot: `<path d="M12 1.4 L13.6 5.6 L13.3 14.2 H10.7 L10.4 5.6 Z"/><path d="M7.2 14.2 H16.8 C16.8 15.2 16 15.8 15 15.8 H9 C8 15.8 7.2 15.2 7.2 14.2 Z"/><rect x="11" y="15.8" width="2" height="4.8"/><circle cx="12" cy="21.6" r="1.5"/>`,
  rival: `<path d="M2.4 12 C5.8 6.6 18.2 6.6 21.6 12 C18.2 17.4 5.8 17.4 2.4 12 Z"/><circle cx="12" cy="12" r="3.6" class="cut"/><circle cx="12" cy="12" r="1.8"/>`,
  government: "",
};
ICONS.guard = ICONS.helmet;
ICONS.carthage = ICONS.palm;
ICONS.government = ICONS.city;

export const ICON_NAMES = Object.keys(ICONS);
export const iconBody = (name: string) => ICONS[name] ?? "";

// Which icon stands for what. Kept here so the screens only ask for "the citizens" or "the mint".
export const FACTION_ICON: Record<string, string> = { ruler: "sword", family: "hearth", rich: "horse", citizens: "grain", guard: "helmet", carthage: "palm" };
export const OFFICE_ICON: Record<string, string> = { citadel: "citadel", treasury: "treasury", mint: "mint", fleet: "fleet", generalship: "generalship", assembly: "assembly" };
export const AREA_ICON: Record<string, string> = { Court: "court", City: "city", War: "war", Spies: "spies", Embassy: "embassy", Scheming: "scheming" };

export function icon(name: string, cls = "", label?: string) {
  const body = ICONS[name];
  if (!body) return "";
  const a11y = label ? `role="img" aria-label="${label.replace(/"/g, "&quot;")}"` : `aria-hidden="true"`;
  return `<svg class="ico ico-${name} ${cls}" viewBox="0 0 24 24" ${a11y} focusable="false">${body}</svg>`;
}
