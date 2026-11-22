// The title page: a red-figure panel of an empty banquet couch under a sword on a hair, the title cut like an
// inscription, Heloris' saying from Diodorus, and the cast laid out as a tray of coins. The scene is invention
// (see docs/art-direction.md); the saying and the coin legend are sourced in data/flavor.json.
import { DATA } from "../src/core/index.ts";
import { FLAVOR } from "./ambient.ts";
import { PORTRAITS } from "./portraits.ts";
import { esc } from "./text.ts";

function meanderBand(x0: number, x1: number, y: number) {
  let d = "";
  for (let x = x0; x < x1 - 9; x += 12) d += `M${x} ${y + 9} V${y + 1} H${x + 9} V${y + 7} H${x + 4} V${y + 4} H${x + 6.5} `;
  return `<path d="M${x0} ${y + 10.5} H${x1} M${x0} ${y - 1.5} H${x1}" class="line" style="stroke-width:1.2"/><path d="${d}" class="line" style="stroke-width:1.3"/>`;
}

function ivy(x0: number, x1: number, y: number) {
  let s = `<path d="M${x0} ${y} C${x0 + 40} ${y + 10} ${x1 - 40} ${y + 10} ${x1} ${y}" class="line" style="stroke-width:1.2"/>`;
  for (let i = 0; i < 16; i++) {
    const t = (i + 0.5) / 16, x = x0 + (x1 - x0) * t, yy = y + Math.sin(t * Math.PI) * 7.5;
    const up = i % 2 ? -1 : 1;
    s += `<path d="M${x.toFixed(1)} ${yy.toFixed(1)} c-5 ${5 * up} -2.6 ${10 * up} 0 ${12 * up} c2.6 ${-2 * up} 5 ${-7 * up} 0 ${-12 * up} z" />`;
  }
  return s;
}

function scene() {
  return `<svg class="title-scene" viewBox="0 0 420 250" role="img" aria-label="A painted panel: an empty banquet couch, a cup and grapes on a table, and above it a sword hanging point down by a single hair.">
  <rect x="0" y="0" width="420" height="250" class="glaze"/>
  <g class="clay">
    ${meanderBand(8, 412, 9)}
    ${meanderBand(8, 412, 230)}
    ${ivy(20, 400, 30)}
    <!-- the hair and the sword -->
    <line x1="210" y1="36" x2="210" y2="70" class="line hair" style="stroke-width:.5"/>
    <g class="title-sword">
      <circle cx="210" cy="73" r="4.2"/><rect x="207.6" y="76.5" width="4.8" height="11" rx="1"/>
      <path d="M193 88 H227 L224.4 93 H195.6 Z"/>
      <path d="M205.6 93 H214.4 L213 132 L210 144 L207 132 Z"/>
      <path d="M210 96 V131" class="cut line" style="stroke-width:1.1"/>
    </g>
    <!-- the couch -->
    <path d="M70 158 H318 C324 158 328 154 330 148 L336 128 C337 124 342 122 345 125 C348 128 346 134 344 138 L338 160 C336 166 332 170 326 170 H70 Z"/>
    <path d="M72 158 C70 150 74 142 84 140 C96 138 104 146 104 158 Z"/>
    <path d="M70 170 H330 V176 H70 Z"/>
    <path d="M84 176 H96 L94 184 C98 186 98 192 94 194 L92 216 H88 L86 194 C82 192 82 186 86 184 Z"/>
    <path d="M304 176 H316 L314 184 C318 186 318 192 314 194 L312 216 H308 L306 194 C302 192 302 186 306 184 Z"/>
    <path d="M110 158 C150 150 200 162 260 152 C280 149 300 152 318 158" class="cut line" style="stroke-width:1.2"/>
    <path d="M120 170 C140 178 170 180 200 176 C230 172 262 182 290 176" class="clay line" style="stroke-width:1"/>
    <!-- the table, cup and grapes -->
    <path d="M170 196 H252 V201 H170 Z"/>
    <path d="M176 201 L170 222 H175 L182 201 Z M246 201 L252 222 H247 L240 201 Z M209 201 H213 V222 H209 Z"/>
    <path d="M186 186 H220 C220 191 213 194 203 194 C193 194 186 191 186 186 Z"/>
    <path d="M186.5 187.5 C182 187 181 183 184 182 M219.5 187.5 C224 187 225 183 222 182" class="line" style="stroke-width:1.2"/>
    <rect x="202" y="194" width="2" height="2.4"/>
    ${[0, 1, 2, 3].map((r) => Array.from({ length: 4 - r }, (_, i) => `<circle cx="${236 + (i - (3 - r) / 2) * 4.6}" cy="${181 + r * 4}" r="2.4"/>`).join("")).join("")}
    <path d="M236 177 C236 172 240 170 243 171" class="line" style="stroke-width:1.2"/>
    <!-- a mixing bowl on the floor -->
    <path d="M346 186 H384 L381 190 C381 200 376 206 370 208 L370 214 C373 215 375 217 375 219 H355 C355 217 357 215 360 214 L360 208 C354 206 349 200 349 190 Z"/>
    <path d="M350 194 C344 193 343 200 349 201 M380 194 C386 193 387 200 381 201" class="line" style="stroke-width:1.6"/>
    <path d="M351 191.5 H379" class="cut line" style="stroke-width:.9"/>
    <path d="M22 220 H398" class="line" style="stroke-width:1"/>
  </g></svg>`;
}

function coinTray() {
  // A few from each faction, taken in turn, so the tray shows the whole city.
  const real = DATA.people.filter((p) => PORTRAITS[p.id] && p.kind === "history");
  const groups = ["ruler", "family", "rich", "citizens", "guard"].map((f) => real.filter((p) => p.faction === f));
  const cast: any[] = [];
  for (let i = 0; cast.length < 10 && i < 10; i++) for (const g of groups) if (g[i] && cast.length < 10) cast.push(g[i]);
  if (!cast.length) return "";
  return `<div class="coin-tray" aria-label="Some of the people of Syracuse">${cast.map((p) =>
    `<figure class="coin"><img src="${esc(PORTRAITS[p.id])}" alt=""><figcaption>${esc(String(p.name).replace(/^the /, ""))}</figcaption></figure>`).join("")}</div>`;
}

export function titlePage(begin: string, intro: string) {
  const epi = FLAVOR.title.find((l) => l.id === "titleEpigraph")!;
  const legend = FLAVOR.title.find((l) => l.id === "coinLegend")!;
  return `<div class="title">
    <p class="kicker"><span class="greek" title="${esc(legend.by)}">${esc(legend.text)}</span> · Syracuse, 405 to 395 BC</p>
    <h1 class="inscribed">The Sword <span class="of">of</span> Damocles</h1>
    <figure class="panel-art">${scene()}</figure>
    <blockquote class="epigraph"><p>“${esc(epi.text)}”</p><footer>${esc(epi.by)}</footer></blockquote>
    <div class="title-intro">${intro}</div>
    ${begin}
    ${coinTray()}
  </div>`;
}
