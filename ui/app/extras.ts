// Extra screens for the Workshop pages (docs/council/2026-11-23-two-day-plan.md, part two).
// The game Jacob tests registers none, so its pages are unchanged. A Workshop page's entry file
// (for example ui/past-main.ts) adds its view here before the game starts: a button in the view bar,
// a screen, its clicks, and optionally a line under the ending stele.
import type { GameState } from "../../src/core/index.ts";
import type { Handlers } from "./clicks.ts";

export interface ExtraView {
  id: string; // the view's key, used as data-view="<id>"
  label: string; // the button in the view bar
  render(g: GameState): string;
  handlers?: Handlers;
  onEnding?(g: GameState): string; // HTML put under the ending stele (a button into the view, say)
  when?(g: GameState): boolean; // show the view only for some games (a rule switch, say); always when left out
}
export const extraViews: ExtraView[] = [];
// One handler set the shell listens to; filled as views are added (the click layer reads it at each click).
export const extraHandlers: Required<Handlers> = { click: {}, change: {} };
export const extrasFor = (g: GameState) => extraViews.filter((x) => !x.when || x.when(g));
export function addView(v: ExtraView) {
  extraViews.push(v);
  Object.assign(extraHandlers.click, v.handlers?.click ?? {});
  Object.assign(extraHandlers.change, v.handlers?.change ?? {});
}
