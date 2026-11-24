// The play view: three columns on a desk, or three tabs on a phone.
import { others } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";
import { ui } from "../lib/text.ts";
import { cityCol } from "./city.ts";
import { seasonCol } from "./season.ts";
import { dangersCol } from "./dangers.ts";
import { nowLine } from "../components/now.ts";
import { exileCol, exileDangers, exileNow, inExile } from "./exile.ts";

export function play(g: GameState) {
  const ex = inExile(g); // switch "exile": the city column shows your exile, and the dangers open with the hunt
  const tabs: [string, string][] = [["city", ex ? "Your exile" : "The city"], ["season", "This season"], ["dangers", "Dangers"]];
  const alerts = g.plots.filter((p) => p.stage >= 1).length + others(g).filter((p) => (p.rival || p.political) && p.status !== "dead").length;
  return `${ex ? exileNow(g) : nowLine(g)}<nav class="tabs" aria-label="Sections">
      ${tabs.map(([k, l]) => `<button data-tab="${k}" class="${ui.tab === k ? "on" : ""}">${l}${k === "dangers" && alerts ? ` <span class="count">${alerts}</span>` : ""}</button>`).join("")}
    </nav>
    <div class="cols">
      <section class="${ui.tab === "city" ? "on" : ""}" data-col="city">${ex ? exileCol(g) : cityCol(g)}</section>
      <section class="${ui.tab === "season" ? "on" : ""}" data-col="season">${seasonCol(g)}</section>
      <section class="${ui.tab === "dangers" ? "on" : ""}" data-col="dangers">${ex ? exileDangers(g) : ""}${dangersCol(g)}</section>
    </div>`;
}
