// The click layer: one listener on the page for clicks and one for changes, set up once.
// Each screen exports its handlers, keyed by a CSS selector (usually a data- attribute); see docs/architecture.md.
// Handlers get a small context instead of importing the shell, so screens never depend on it.
import type { GameState } from "../../src/core/index.ts";

export interface Ctx {
  g: GameState;
  render(): void; // draw the page again from the state
  save(): void; // store the seed and inputs
  turn(): void; // the page-turn animation
  openSheet(id: string): void; // open a person's character sheet
}
export type Handler = (el: HTMLElement, ctx: Ctx, e: Event) => void;
export interface Handlers { click?: Record<string, Handler>; change?: Record<string, Handler> }

// Handlers run in the order given. For each selector, the nearest matching element around the click is used,
// and only if it is still on the page (an earlier handler may have redrawn it).
export function listen(root: HTMLElement, all: Handlers[], ctx: () => Ctx | null) {
  for (const type of ["click", "change"] as const) {
    root.addEventListener(type, (e) => {
      const c = ctx();
      if (!c) return; // the start screen wires its own buttons
      const target = e.target as HTMLElement;
      for (const h of all) {
        for (const [sel, fn] of Object.entries(h[type] ?? {})) {
          const el = target.closest<HTMLElement>(sel);
          if (el && root.contains(el)) fn(el, c, e);
        }
      }
    });
  }
}
