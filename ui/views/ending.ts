// The end of a reign, as a stele.
import { seasonName } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";
import { esc, linkNames } from "../lib/text.ts";

export function ending(g: GameState) {
  const o = g.over!;
  const title = { killed: "You are dead", exiled: "Exile", deposed: "Deposed", fallen: "The city falls", survived: "You held Syracuse", fled: "Flight", abdicated: "You stepped down" }[o.reason] ?? "The end";
  const n = (k: string) => g.counters[k] ?? 0;
  return `<div class="ending ${esc(o.reason)}">
    <h2>${esc(title)}</h2>
    <p class="small muted">${esc(seasonName(o.season))}</p>
    <div class="meander" aria-hidden="true"></div>
    <p>${linkNames(o.text)}</p>
    <div class="counts"><span><b>${n("plots")}</b>plots against you</span><span><b>${n("rivals")}</b>enemies made</span><span><b>${n("politicalRivals")}</b>political rivals</span><span><b>${n("tyrantSeasons")}</b>seasons as tyrant</span></div>
    <p><button class="primary" id="again">Play again</button> <button type="button" data-view="chronicle">Read the chronicle of your rule</button></p>
  </div>`;
}
