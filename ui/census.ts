// The island's invented families (island games): a view of the generated cast, and their mosaic portraits.
// The people are invention, generated from data/census.json; the names are attested (data/names.json).
// Portraits are laid in tiles in the browser by the mosaic editor's own code (ui/mosaic-runtime.ts), one at a time
// while the page is idle, and kept for the rest of the visit. Headless tests see only the initial-in-a-circle fallback.
import type { GameState } from "../src/core/index.ts";
import { DATA, censusKin, censusPersonName, censusLook } from "../src/core/index.ts";
import { CENSUS_DATA, ageOf, placeName } from "../src/core/census.ts";
import { esc } from "./text.ts";
import { initial } from "./portraits.ts";
import looks from "./art/portrait-looks.json" with { type: "json" };
import { makeMosaic } from "./mosaic-runtime.ts";

const traitWord = (t: string) => DATA.traits.find((x) => x.id === t)?.name ?? t;
const AMBITION: Record<string, string> = { Wealth: "wants wealth", Office: "wants an office", Safety: "wants to be safe", Power: "wants power", Revenge: "wants revenge" };
const TINT: Record<string, string> = { rich: "#2a4a5a", citizens: "#5a5a28", guard: "#2f5e57", punic: "#5b2a63", b2: "#8b5b34" };

// The cache of finished portraits: census id plus the parts that change with age.
const done = new Map<string, string>();
const keyOf = (L: any) => [L.id, L.age, L.hairCol, L.hair, L.beard].join("/");

function face(s: GameState, id: string, dead: boolean) {
  const L = censusLook(s, id) as any;
  const url = done.get(keyOf(L));
  const tint = TINT[L.field ?? L.faction] ?? "#5b2a63";
  const inner = url ? `<img src="${url}" alt="">` : `<span class="mono-initial">${esc(initial(censusPersonName(s, id)))}</span>`;
  return `<span class="portrait m ${dead ? "dead" : ""} ${url ? "has-img" : ""}" style="--tint:${tint}" role="img" aria-label="Portrait of ${esc(censusPersonName(s, id))}" ${url ? "" : `data-census-face="${esc(id)}"`}>${inner}</span>`;
}

function personCard(s: GameState, id: string) {
  const c = s.census!;
  const p = c.people[id];
  const age = ageOf(p, s.season);
  // Living close family, with ages; a woman known only as a daughter is shown by her father's name.
  const kin = censusKin(s, id).filter((k) => c.people[k.person].alive).map((k) => {
    const q = c.people[k.person];
    return `${esc(k.relation)} ${esc(q.given ?? `(a daughter of ${q.fatherName})`)}, ${ageOf(q, s.season)}`;
  });
  const bits = [p.traits.map(traitWord).join(", "), p.ambition ? AMBITION[p.ambition] : ""].filter(Boolean).join("; ");
  return `<div class="card census-card">
    ${face(s, id, !p.alive)}
    <span class="card-text">
      <span class="card-name">${esc(cap(censusPersonName(s, id)))}</span>
      <span class="small muted card-role">${esc(p.role ? cap(p.role) : p.sex === "m" ? `Son of ${p.fatherName}` : "")}${p.role || p.sex === "m" ? ", " : ""}${p.alive ? `aged ${age}` : `died aged ${p.died!.age}, of ${esc(p.died!.cause)}`}</span>
      ${bits ? `<span class="small">${esc(cap(bits))}.</span>` : ""}
      ${kin.length ? `<span class="small muted">${cap(kin.join("; "))}.</span>` : ""}
      <span class="small"><span class="marker invented">invented</span></span>
    </span>
  </div>`;
}
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

// The view: each body's houses, head first, then the captains, then the year's dead.
export function familiesView(s: GameState) {
  const c = s.census;
  if (!c) return "";
  const sections = CENSUS_DATA.bodies.map((b) => {
    const heads = Object.values(c.houses).filter((h) => h.body === b.id && h.head).sort((x, y) => y.standing - x.standing).map((h) => h.head!);
    const cards = heads.map((id) => personCard(s, id));
    const where = placeName(b.place);
    return `<section class="court-faction"><div class="fhead"><h2>${esc(cap(b.name))}</h2>${where && !b.name.includes(where) ? `<span class="small muted">${esc(where)}</span>` : ""}</div><div class="cards">${cards.join("")}</div></section>`;
  }).join("");
  const capts = Object.values(c.people).filter((p) => p.side && p.alive);
  const captains = (["syracuse", "carthage"] as const).map((side) =>
    `<section class="court-faction"><div class="fhead"><h2>Captains hired by ${side === "syracuse" ? "Syracuse" : "Carthage"}</h2></div><div class="cards">${capts.filter((p) => p.side === side).map((p) => personCard(s, p.id)).join("")}</div></section>`).join("");
  const dead = Object.values(c.people).filter((p) => !p.alive && p.died && (p.died.age >= 16));
  return `<div class="court census">
    <p class="small muted">The leading families of the island's towns and of Carthage, and the hired captains. Every one of them is invented; their names are borne by real people in the ancient sources. They are born, marry, inherit and die as the seasons pass.</p>
    ${sections}${captains}
    ${dead.length ? `<p class="small muted">Died since the story began: ${dead.map((p) => `${esc(censusPersonName(s, p.id, true))}, aged ${p.died!.age}`).join("; ")}.</p>` : ""}
  </div>`;
}

// Lays the waiting portraits in tiles, one at a time while the browser is idle. Call after every render.
let mosaic: any = null;
let busy = false;
export function paintCensusFaces(s: GameState) {
  if (busy || typeof document === "undefined" || !s.census) return;
  const next = document.querySelector<HTMLElement>("[data-census-face]");
  if (!next) return;
  busy = true;
  const idle = (globalThis as any).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 30));
  idle(() => {
    try {
      if (!mosaic) mosaic = makeMosaic({ finish: looks.finish, clear: looks.clearOutside, frame: looks.frame });
      const id = next.dataset.censusFace!;
      const L = censusLook(s, id) as any;
      const key = keyOf(L);
      if (!done.has(key)) {
        const oc = document.createElement("canvas");
        mosaic.renderLook(mosaic.newLook(id, L.name, L.faction, L), oc, 128, looks.tiles);
        done.set(key, oc.toDataURL("image/webp", 0.85));
      }
      for (const el of document.querySelectorAll<HTMLElement>(`[data-census-face="${id}"]`)) {
        el.innerHTML = `<img src="${done.get(key)}" alt="">`;
        el.classList.add("has-img");
        el.removeAttribute("data-census-face");
      }
    } finally {
      busy = false;
      paintCensusFaces(s);
    }
  });
}
