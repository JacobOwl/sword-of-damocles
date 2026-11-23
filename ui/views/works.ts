// Switch "greatWorks" (bet B4): the great works, each with its stage, its price per season, who is over it and
// what it gives when done, and the passage of Diodorus it comes from.
import { WORKS, labourById, workOf, seasonCost, seasonsNeeded, overseerName, timberFrom, timberById, seasonName } from "../../src/core/index.ts";
import type { GameState, WorkDef } from "../../src/core/index.ts";
import { esc } from "../lib/text.ts";

function stage(g: GameState, w: WorkDef): string {
  const work = workOf(g, w.id);
  if (!work) return `<p class="small muted">Not begun. ${w.seasons} season${w.seasons > 1 ? "s" : ""} of work, from ${w.silver} silver a season, more for hired or foreign hands.</p>`;
  if (work.done !== undefined) return `<p class="small"><b>Finished</b> in ${esc(seasonName(work.done))}${work.overseer !== "foreman" ? `, under ${esc(overseerName(g, work.overseer))}` : ""}.</p>`;
  const need = seasonsNeeded(w, work);
  const marks = Array.from({ length: need }, (_, i) => `<span class="${i < work.progress ? "done" : ""} ${i === work.progress ? "next" : ""}">${i + 1}</span>`).join("");
  const lab = labourById(work.labour)!;
  const timber = work.timber ? ` Timber ${work.timber === "aetna" ? "from Mount Aetna" : "from Italy"}.` : "";
  const state = work.halted ? "<b>Halted.</b> What is built stands." : work.stalled ? `<b class="warn">The men are unpaid</b> (${work.stalled} season${work.stalled > 1 ? "s" : ""}).` : "Under way.";
  return `<div class="plottrack" aria-label="Seasons of work: ${work.progress} of ${need}">${marks}</div>
    <p class="small">${state} ${work.progress} of ${need} seasons done. Built by ${esc(lab.short)}; ${esc(overseerName(g, work.overseer))} ${work.overseer === "you" ? "oversee" : "oversees"} it.${esc(timber)} Each season costs <b>${seasonCost(w, work.labour, work.timber)} silver</b>${w.grain ? ` and ${w.grain} month${w.grain > 1 ? "s" : ""} of grain` : ""}${lab.harvestLoss ? `, and in summer the harvest comes in ${lab.harvestLoss} months short` : ""}${lab.anger ? ", and Carthage's anger rises by 1" : ""}.</p>`;
}

export function worksView(g: GameState): string {
  const t = timberFrom(g);
  return `<div class="works-view">
    <p class="small muted">Power you build, not only power you hold. Begin a work from the City actions; it takes silver, food and men every season until it is done. Only two at once.</p>
    ${WORKS.map((w) => `<section class="court-faction"><div class="fhead"><h2>${esc(w.name)}</h2><span class="small muted">${esc(w.source)}</span></div>
      <p>${esc(w.summary)}</p>
      ${w.timber ? `<p class="small muted">Timber would come ${t === "aetna" ? "from Mount Aetna, while the road is yours" : `from Italy (${timberById("italy").silver} silver more a season), since the road to Aetna is closed to you`}.</p>` : ""}
      ${stage(g, w)}
    </section>`).join("")}
    <p class="small muted note">The works and what they did are history, from Diodorus. Every cost, season count and rule is invention.</p>
  </div>`;
}
