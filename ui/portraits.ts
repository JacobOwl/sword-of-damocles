// Portrait slots. Every person is drawn through portrait(), so real art can drop in later without touching the screens.
//
// To add a portrait: put an entry in PORTRAITS, keyed by the person's id in data/people.json, whose value is an image
// URL or a data: URL (a mosaic from the art editor, or a coin photo). Until then each person gets a placeholder:
// a tessera pattern in their faction's colour with their initial.
import { PLAYER } from "../src/core/index.ts";
import { esc, ui } from "./text.ts";

export const PORTRAITS: Record<string, string> = {};

const FACTION_TINT: Record<string, string> = { citizens: "#4f6b3a", rich: "#7a5424", guard: "#6d2a22", family: "#5b2a63", ruler: "#2b1d12" };

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
