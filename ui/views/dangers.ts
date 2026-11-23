// The dangers column: plots against you, rivals, and who is who.
import { DATA, agendaById, capital, defense, influence, officeName, officesOf, others, playerInfluence, plotStrength, rankTitle, seasonName, stageName, knobsFor, switchById, switchOn } from "../../src/core/index.ts";
import type { FactionId, GameState, Plot } from "../../src/core/index.ts";
import { tipAttr } from "./help.ts";
import { flags } from "./people.ts";
import { portrait } from "../components/portraits.ts";
import { esc, linkNames, opChip, pr, sign, ui, who } from "../lib/text.ts";
import { FACTION_ICON, icon } from "../components/icons.ts";

export function dangersCol(g: GameState) {
  return `${plots(g)}${rivals(g)}${whoIsWho(g)}`;
}

const partialKnobs = () => (switchById("partialBlows") as any).knobs as { wound: number; seize: number };

function plotTitle(g: GameState, pl: Plot) {
  const lf = g.people[pl.leader].faction;
  const fname = lf === "ruler" ? "your own household" : g.factions[lf as FactionId].short;
  return pl.stage >= 2 || ui.designer ? `A plot among ${fname}` : "A plot, source unknown";
}

function plots(g: GameState) {
  const ps = g.plots.filter((p) => ui.designer || p.stage >= 1);
  const def = defense(g).total;
  const body = ps.length ? ps.map((pl) => {
    const st = plotStrength(g, pl);
    const known = ui.designer ? pl.members : pl.known;
    const showStr = !!pl.informer || ui.designer;
    const track = ["Whispers", "Rumors", "Named", "Strike"].map((n, i) => `<span class="${i < pl.stage ? "done" : ""} ${i === pl.stage ? "next" : ""}">${n}</span>`).join("");
    let when: string;
    if (pl.stage < 3) when = `Earliest blow: ${3 - pl.stage + 1} seasons from now, if it keeps growing.`;
    else if (pl.namedSince < g.season) when = `<b class="warn">It can strike at the end of this season</b> if its strength is ${knobsFor(g.tuning).minStrike} or more.`;
    else when = `It can strike from next season, if its strength is ${knobsFor(g.tuning).minStrike} or more.`;
    const what = pl.stage === 1 ? "Something is off. You don't know who." : pl.stage === 2 ? "You know the faction, not the leader." : "You have a name.";
    const meter = showStr ? `<div class="vs"><span>Strength <b class="num">${st.total}</b></span><span class="vsbar"><i class="str" style="width:${Math.min(100, (st.total / 16) * 100)}%"></i><i class="def" style="left:${Math.min(100, (def / 16) * 100)}%"></i></span><span>your defense <b class="num">${def}</b></span></div>
      <div class="small muted">${esc(st.parts.map((p) => `${p.label} ${sign(p.value)}`).join(", "))}</div>` : `<div class="small muted">Its strength is unknown. Turn an informer inside it to learn it.</div>`;
    const knownBtns = known.length ? `<div class="small">Names you have: ${known.map((k) => who(k)).join(", ")}.</div>` : "";
    return `<div class="plot plot-s${pl.stage}">
      <div class="fhead"><b>${esc(plotTitle(g, pl))}</b><span class="stage stage-${pl.stage} tipped" ${tipAttr("stage")}>${stageName(pl.stage)}</span></div>
      <div class="plottrack" aria-label="Warnings passed: ${pl.stage} of 3">${track}</div>
      <div class="small">${what} First warned ${esc(seasonName(pl.started))}.</div>
      ${knownBtns}${pl.heard?.length ? `<div class="small"><span class="label">What you have heard</span><ul class="heard">${pl.heard.map((h) => `<li>${linkNames(h)}</li>`).join("")}</ul></div>` : ""}${meter}
      <div class="small">${when}</div>
    </div>`;
  }).join("") : `<p class="small muted">No warnings. That you know of.</p>`;
  const advice = ps.length ? `<p class="small muted">What you can do: <b>Watch</b> a suspect to see whether he is in it. <b>Turn an informer</b> to learn its size. <b>Imprison</b> a named plotter to take him out. Keep the guard paid: it is most of your defense.${switchOn(g, "partialBlows") ? ` A blow that beats your defense by ${partialKnobs().wound} or less only wounds you; by ${partialKnobs().seize} or less it costs you an office; it must beat it by ${partialKnobs().seize + 1} or more to kill you.` : ""}</p>` : "";
  return `<div><h2>Plots against you</h2>${body}${advice}</div>`;
}

function rivals(g: GameState) {
  const rs = others(g).filter((p) => (p.rival || p.political) && p.status !== "dead")
    .sort((a, b) => (b.rival?.rank ?? 0) * 2 + (b.political?.rank ?? 0) * 2 - ((a.rival?.rank ?? 0) * 2 + (a.political?.rank ?? 0) * 2));
  const waiting = g.waiting.filter((w) => g.people[w].status !== "dead");
  const body = rs.length ? rs.map((p) => {
    const r = p.rival;
    const pol = p.political;
    const mem = r?.memory[r.memory.length - 1];
    const P = pr(p.id);
    const kind = [r ? `<span class="rank tipped" ${tipAttr("rank")}>Enemy · ${esc(rankTitle(r.rank))}</span>` : "", pol ? `<span class="rank pol tipped" ${tipAttr("political")}>Rival · ${esc(DATA.politicalRanks.find((x: any) => x.rank === pol.rank)!.title)}</span>` : ""].filter(Boolean).join("<br>");
    const ag = p.agenda && (p.agenda.id === "yourFall" || p.agenda.id === "takePlace") ? agendaById(p.agenda.id) : null;
    return `<div class="rival">
      ${portrait(p.id, "m")}
      <div class="rival-text">
        <div class="fhead"><span>${who(p.id)} <span class="small">${opChip(p.opinion, true)}</span></span><span class="rank-col">${kind}</span></div>
        <div class="small">${r ? `Scars: ${esc(r.scars.join(", "))}. ` : ""}${pol ? `${esc(pol.type)}, influence ${influence(g, p.id)} against your ${playerInfluence(g)}. ` : ""}<span class="muted">${p.status === "free" ? "In the city." : p.status === "held" ? "In your prison." : "Outside the walls."}</span></div>
        ${mem ? `<div class="memory">${P.He} remembers: ${esc(mem.text)}.</div>` : ""}
        ${ag ? `<div class="small warn">${P.His} agenda, <i>${esc(ag.name)}</i>: step ${p.agenda!.step} of ${ag.steps.length}${p.agenda!.step < ag.steps.length ? `, next: ${esc(ag.steps[p.agenda!.step].toLowerCase())}` : ""}.</div>` : ""}
      </div></div>`;
  }).join("") : `<p class="small muted">No one has sworn against you, and no one is climbing toward your place. Yet.</p>`;
  return `<div><h2>Rivals</h2>${body}
    ${waiting.length ? `<p class="small muted">Waiting in the wings: ${waiting.map((w) => who(w)).join(", ")}.</p>` : ""}
    <p class="small muted"><span class="tipped" ${tipAttr("enemy")}>Enemies</span> are made by wounds and want you dead (at most ${DATA.maxEnemies}). <span class="tipped" ${tipAttr("political")}>Political rivals</span> are made by ambition and want your place (at most ${DATA.maxPolitical}).</p></div>`;
}

function whoIsWho(g: GameState) {
  const order: FactionId[] = ["family", "rich", "citizens", "guard"];
  return `<div><h2>Who is who</h2>
    ${order.map((f) => {
      const ps = others(g).filter((p) => p.faction === f && p.status !== "absent" && p.status !== "dead");
      if (!ps.length) return "";
      return `<div class="area"><span class="label">${icon(FACTION_ICON[f], `f-${f}`)}${esc(g.factions[f].name)}</span>${ps.map((p) => {
        const offs = officesOf(g, p.id);
        return `<button type="button" class="row-person" data-person="${esc(p.id)}">${portrait(p.id, "s")}<span class="nm">${esc(capital(p.name))}${offs.length ? ` <span class="tag">${esc(offs.map((o) => capital(officeName(o).replace(/^the /, ""))).join(", "))}</span>` : ""}${p.status !== "free" ? ` <span class="tag">${p.status === "held" ? "in prison" : "outside"}</span>` : ""} ${flags(g, p)}</span>${opChip(p.opinion)}</button>`;
      }).join("")}</div>`;
    }).join("")}
    <p class="small"><button type="button" data-view="court">Open the court</button></p></div>`;
}
