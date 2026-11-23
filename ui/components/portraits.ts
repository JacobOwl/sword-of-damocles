// Portrait slots. Every person is drawn through portrait(), so real art can drop in later without touching the screens.
//
// The pictures are ui/art/portraits/<person id>.webp, placeholder mosaics made in tools/mosaic-editor.html (their looks are
// invention). scripts/build-ui.ts inlines them into the page as window.__PORTRAITS. A person with no picture (and every
// person in the headless tests) gets the fallback: a tessera pattern in their faction's colour with their initial.
import { PLAYER } from "../../src/core/index.ts";
import { esc, ui } from "../lib/text.ts";

export const PORTRAITS: Record<string, string> = (globalThis as { __PORTRAITS?: Record<string, string> }).__PORTRAITS ?? {};

// The same colours as the coin fields of the mosaic portraits (docs/art-direction.md).
const FACTION_TINT: Record<string, string> = { citizens: "#5a5a28", rich: "#2a4a5a", guard: "#2f5e57", family: "#7a2e24", ruler: "#7a2e24" };

export function initial(name: string) {
  // The first capitalised word ("the brother of Demarchus" gives D), else the first word.
  const words = name.replace(/^the\s+/i, "").split(/\s+/);
  const w = words.find((x) => /^[A-Z]/.test(x)) ?? words[0];
  return w.charAt(0).toUpperCase();
}

export function portrait(id: string, size: "s" | "m" | "l" = "m") {
  const s = ui.s!;
  const p = s.people[id];
  if (!p) return "";
  const url = PORTRAITS[id];
  const dead = p.status === "dead";
  const tint = FACTION_TINT[p.faction] ?? FACTION_TINT.ruler;
  const label = `Portrait of ${p.player ? "you" : p.name}${url ? "" : " (placeholder)"}`;
  const inner = url ? `<img src="${esc(url)}" alt="">` : `<span class="mono-initial">${esc(initial(id === PLAYER ? "Dionysius" : p.name))}</span>`;
  return `<span class="portrait ${size} ${dead ? "dead" : ""} ${url ? "has-img" : ""}" style="--tint:${tint}" role="img" aria-label="${esc(label)}">${inner}</span>`;
}
