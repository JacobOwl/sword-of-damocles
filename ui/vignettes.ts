// Event pictures: an emblem painted red-figure style (clay on black glaze) in the round of a drinking cup,
// inside a ring of the meander. Each event in data/events.json names one with "art". All of it is invention
// (see docs/art-direction.md). Clay parts use currentColor-free classes so CSS decides the two colours.
import { iconBody } from "./icons.ts";
import * as F from "./figures.ts";

// An icon from the set, placed and scaled into the 120-unit tondo.
const use = (name: string, x: number, y: number, s: number, rot = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${rot} ${12 * s} ${12 * s}) scale(${s})">${iconBody(name)}</g>`;

const waves = (y: number, x0 = 26, x1 = 94, h = 5) => {
  // The running-wave scroll from cup borders, drawn as one line.
  let d = `M${x0} ${y}`;
  for (let x = x0; x < x1; x += 10) d += ` C${x + 3} ${y} ${x + 4} ${y - h} ${x + 7} ${y - h} C${x + 10} ${y - h} ${x + 10} ${y - h / 3} ${x + 8} ${y - h / 3} C${x + 6.5} ${y - h / 3} ${x + 6.5} ${y} ${x + 10} ${y}`;
  return `<path d="${d}" class="line" style="stroke-width:1.6"/>`;
};

const grapes = (x: number, y: number) => {
  let s = "";
  const rows = [3, 2, 2, 1];
  rows.forEach((n, r) => { for (let i = 0; i < n; i++) s += `<circle cx="${x + (i - (n - 1) / 2) * 3.4}" cy="${y + r * 3.1}" r="1.75"/>`; });
  return s;
};


export const VIGNETTES: Record<string, string> = {
  feast: `${F.symposiast(57, 74, 1, 1.12)}${grapes(88, 30)}`,
  wedding: `${F.standingWoman(48, 94, 1, { veil: true, arm: "veil" }, 1.18)}${F.standingWoman(80, 94, -1, { arm: "torch" }, 1.08)}`,
  hearth: `${use("hearth", 58, 52, 1.6)}${F.standingWoman(40, 94, 1, { arm: "forward" }, 1.15)}`,
  warship: `${use("fleet", 21, 20, 3.3)}${waves(88, 26, 94, 5)}`,
  grainship: `<path d="M22 70 C30 80 84 81 96 64 L91 62.5 C82 70 44 71 24 66.5 Z"/>
    <path d="M24 66.5 C20 62 21 56 25 53 C24.5 58 25.5 62 28 66.6 Z"/>
    <path d="M60 68 V28" class="line" style="stroke-width:1.8"/><path d="M42 30 H78" class="line" style="stroke-width:1.6"/>
    <path d="M43 31.5 H77 C76 42 76 50 78 58 H42 C44 50 44 42 43 31.5 Z"/>
    <path d="M51 32 V57 M60 32 V57 M69 32 V57 M44 40 H76 M44 49 H77" class="cut line" style="stroke-width:.8"/>
    <path d="M32 66 C31 62 32 59 34 58 C36 59 37 62 36 66 Z M38 67 C37 63 38 60 40 59 C42 60 43 63 42 67 Z M84 66 C83 62 84 59 86 58 C88 59 89 62 88 66 Z"/>
    ${waves(88, 26, 94, 4.5)}`,
  storm: `<path d="M26 78 C30 66 40 58 52 60 C46 62 44 68 48 72 C52 76 58 72 56 66 C64 70 64 82 56 86 L26 86 Z"/>
    <path d="M58 86 C60 74 70 66 82 68 C76 70 74 76 78 80 C82 84 88 80 86 74 C93 78 94 84 94 86 Z"/>
    <path d="M70 22 L58 44 L66 44 L54 64 L74 38 L65 38 L78 22 Z"/>
    <path d="M30 34 L27 42 M36 30 L33 38 M84 34 L81 42 M90 40 L87 48 M42 40 L39 48" class="line" style="stroke-width:1.2"/>`,
  fire: `<path d="M26 88 V70 L34 64 L42 70 V88 Z M44 88 V66 L54 58 L64 66 V88 Z M66 88 V72 L74 66 L82 72 V74 L88 70 L94 74 V88 Z"/>
    <path d="M30 88 V80 H34 V88 M51 88 V78 H57 V88 M72 88 V80 H76 V88" class="cut line" style="stroke-width:1"/>
    <path d="M36 62 C30 52 36 44 40 38 C40 46 44 46 46 50 C46 42 52 36 52 26 C60 34 62 44 58 52 C62 50 62 46 64 42 C70 50 70 58 66 62 C72 58 74 54 74 48 C82 56 82 64 78 66 Z"/>
    <path d="M46 60 C44 54 48 50 50 46 C51 52 54 54 55 58 M62 60 C62 56 64 54 66 52 C67 56 68 58 67 61" class="cut line" style="stroke-width:1.1"/>`,
  coins: `${use("mint", 46, 24, 2)}${use("silver", 24, 50, 1.55)}
    <circle cx="80" cy="76" r="6.5"/><circle cx="80" cy="76" r="4.4" class="cut line" style="stroke-width:.8"/>
    <circle cx="68" cy="84" r="5"/><circle cx="68" cy="84" r="3.2" class="cut line" style="stroke-width:.7"/>`,
  temple: `<path d="M24 46 L60 26 L96 46 Z"/><path d="M33 43 L60 30 L87 43 Z" class="cut"/>
    <circle cx="60" cy="38" r="3"/>
    <rect x="26" y="47" width="68" height="4"/>
    <path d="M31 52 H37 V80 H31 Z M45 52 H51 V80 H45 Z M69 52 H75 V80 H69 Z M83 52 H89 V80 H83 Z"/>
    <path d="M57 64 C57 60 63 60 63 64 L62 80 H58 Z"/>
    <rect x="25" y="80" width="70" height="3.4"/><rect x="22" y="83.4" width="76" height="3.4"/>`,
  omen: `<path d="M57 50 C47 38 36 34 22 38 C28 40 32 42 34 45 C28 45 24 47 22 52 C28 51 34 52 39 54 C35 56 31 60 30 64 C38 60 46 59 55 60 Z"/>
    <path d="M63 50 C73 38 84 34 98 38 C92 40 88 42 86 45 C92 45 96 47 98 52 C92 51 86 52 81 54 C85 56 89 60 90 64 C82 60 74 59 65 60 Z"/>
    <ellipse cx="60" cy="56" rx="6.5" ry="12"/><circle cx="60" cy="40.5" r="5"/><path d="M55.5 40 L50 42.5 L55.6 43.5 Z"/>
    <circle cx="58.6" cy="39.4" r="1" class="cut"/>
    <path d="M55 66 L60 80 L65 66 Z"/>
    <path d="M40 80 C48 72 54 84 62 78 C70 72 74 84 82 76" class="line" style="stroke-width:2.6"/><circle cx="83" cy="75" r="2.2"/>
    <path d="M37.5 39.5 C40 42 44 43.6 48 44 M82.5 39.5 C80 42 76 43.6 72 44" class="cut line" style="stroke-width:.8"/>`,
  sickness: `${F.sickBed(52, 76, 1, 1)}${F.standingMan(88, 94, -1, { arm: "staff" }, .95)}`,
  letter: `${F.seatedMan(56, 94, 1, { hold: "tablet" }, 1.25)}`,
  dice: `<path d="M30 52 L46 44 L62 52 L46 60 Z"/><path d="M30 52 V70 L46 78 V60 Z"/><path d="M62 52 V70 L46 78 V60 Z"/>
    <path d="M30 52 L46 60 L62 52 M46 60 V78" class="cut line" style="stroke-width:1"/>
    <ellipse cx="46" cy="52" rx="2" ry="1.2" class="cut"/>
    <circle cx="35" cy="60" r="1.5" class="cut"/><circle cx="41" cy="70" r="1.5" class="cut"/>
    <circle cx="51" cy="62" r="1.4" class="cut"/><circle cx="54" cy="66" r="1.4" class="cut"/><circle cx="57" cy="70" r="1.4" class="cut"/>
    <path d="M66 42 L80 36 L92 44 L78 50 Z"/><path d="M66 42 V56 L78 64 V50 Z"/><path d="M92 44 V58 L78 64 V50 Z"/>
    <path d="M66 42 L78 50 L92 44 M78 50 V64" class="cut line" style="stroke-width:1"/>
    <circle cx="74" cy="42" r="1.3" class="cut"/><circle cx="84" cy="45" r="1.3" class="cut"/>
    <circle cx="72" cy="55" r="1.4" class="cut"/><circle cx="85" cy="54" r="1.4" class="cut"/>
    <path d="M30 84 C40 82 48 84 54 82" class="line" style="stroke-width:1.2"/>
    <path d="M60 80 C62 76 68 76 70 79 C72 82 76 82 78 80 C79 84 74 87 70 85 C68 84 64 86 61 84 Z"/>`,
  lyre: `<path d="M51 66 C42 54 42 38 47 26 M69 66 C78 54 78 38 73 26" class="line" style="stroke-width:4"/>
    <path d="M44 33 L76 33" class="line" style="stroke-width:3"/>
    <ellipse cx="60" cy="74" rx="17" ry="11.5"/>
    <path d="M50 70 L54 78 L60 74 L66 78 L70 70 L60 66 Z M48 79 L54 78 M72 79 L66 78" class="cut line" style="stroke-width:.9"/>
    <path d="M54 35 V68 M57.3 35 V68 M60.6 35 V68 M64 35 V68 M67 35 V68" class="line" style="stroke-width:.8"/>
    <rect x="52" y="66" width="16" height="3"/>`,
  mask: `${F.standingMan(46, 94, 1, { arm: "mouth" }, 1.12)}${F.standingMan(78, 94, -1, { arm: "wrapped" }, 1.12)}`,
  dagger: `${use("scheming", 26, 20, 3, 28)}
    <circle cx="82" cy="80" r="2"/><circle cx="76" cy="85" r="1.4"/><circle cx="88" cy="86" r="1.2"/>`,
  arms: `${F.hoplite(58, 96, 1, { blazon: `<g class="cut">${use("horse", 43.8, 49.4, .9)}</g>` }, 1.12)}`,
  horse: `${use("horse", 30, 28, 2.5)}
    <path d="M36 26 C30 30 30 40 36 44 C32 44 26 40 26 34 C26 28 31 24 36 26 Z"/>
    <circle cx="86" cy="30" r="1.2"/><circle cx="80" cy="22" r="1"/><circle cx="92" cy="40" r="1"/>`,
  walls: `<path d="M24 86 V44 H22 V36 H27 V40 H31 V36 H35 V40 H39 V36 H44 V44 H42 V58 H78 V44 H76 V36 H81 V40 H85 V36 H89 V40 H93 V36 H98 V44 H96 V86 Z"/>
    <path d="M42 54 H46 V50 H50 V54 H54 V50 H58 V54 H62 V50 H66 V54 H70 V50 H74 V54 H78 V58 H42 Z"/>
    <path d="M53 86 V74 C53 70 56 68 60 68 C64 68 67 70 67 74 V86 Z" class="cut"/>
    <path d="M24 52 H42 M24 62 H96 M24 72 H96 M78 52 H96 M33 44 V52 M87 44 V52 M30 52 V62 M48 62 V72 M72 62 V72 M90 52 V62 M36 72 V86 M84 72 V86" class="cut line" style="stroke-width:.7"/>
    <rect x="31.5" y="46" width="3" height="4" class="cut"/><rect x="85.5" y="46" width="3" height="4" class="cut"/>`,
  assembly: `<path d="M30 92 V84 H58 V92 Z"/><path d="M33 88 H55" class="cut line" style="stroke-width:.6"/>${F.standingMan(44, 84, 1, { arm: "raised" }, 1.08)}${F.head(78, 66, -1, { beard: true }, 1.3)}${F.head(91, 73, -1, {}, 1.3)}${F.head(76, 82, -1, { beard: true }, 1.3)}`,
  harvest: `${use("grain", 11, 22, 2.9)}${use("grain", 23, 30, 2.4, 14)}
    <path d="M70 34 C92 34 100 56 86 70 C86 58 80 48 70 44 Z"/><path d="M71 41 C76 54 74 70 68 86" class="line" style="stroke-width:3"/>`,
  palm: `${use("palm", 28, 24, 2.6)}
    <path d="M38 87 C46 84 74 84 82 87" class="line" style="stroke-width:1.4"/>`,
};

export const VIGNETTE_NAMES = Object.keys(VIGNETTES);

function meanderRing() {
  // 24 key units around the rim, each a square hook on a running baseline.
  let s = `<circle cx="60" cy="60" r="55.6" class="line" style="stroke-width:1.2"/><circle cx="60" cy="60" r="46.4" class="line" style="stroke-width:1.2"/>`;
  const n = 24;
  const unit = `<path d="M0 9 V3 H7 V7.4 H3.4 V5.2 H5" class="line" style="stroke-width:1.15"/>`;
  for (let i = 0; i < n; i++) s += `<g transform="rotate(${(360 / n) * i} 60 60) translate(56.8 3.4) scale(.95)">${unit}</g>`;
  return s;
}
const RING = meanderRing();

export function vignette(name: string | undefined, label = "") {
  const body = VIGNETTES[name ?? ""];
  if (!body) return "";
  const a11y = label ? `role="img" aria-label="${label.replace(/"/g, "&quot;")}"` : `aria-hidden="true"`;
  return `<svg class="tondo" viewBox="0 0 120 120" ${a11y} focusable="false">
    <circle cx="60" cy="60" r="59" class="glaze"/>
    <g class="clay">${RING}</g>
    <g class="clay fig">${body}</g>
    <path d="M28 90.5 H92" class="clay line" style="stroke-width:1.1;opacity:.55"/>
  </svg>`;
}
