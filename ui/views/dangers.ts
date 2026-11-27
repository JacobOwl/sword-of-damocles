// The dangers column: plots against you, rivals, and who is who.
import { DATA, leaderOf, openQuarrels, quarrelLine, agendaById, capital, defense, influence, officeName, officesOf, others, playerInfluence, plotStrength, rankTitle, seasonName, stageName, knobsFor, switchById, switchOn } from "../../src/core/index.ts";
import type { FactionId, GameState, Plot } from "../../src/core/index.ts";
import { tipAttr } from "./help.ts";
import { flags } from "./people.ts";
import { portrait } from "../components/portraits.ts";
import { esc, linkNames, opChip, opinionWord, pr, sign, ui, who } from "../lib/text.ts";
import { FACTION_ICON, icon } from "../components/icons.ts";
import { foe, foeLines } from "../components/foe.ts";

export function dangersCol(g: GameState) {
  return `${foeCard(g)}${plots(g)}${quarrels(g)}${rivals(g)}${whoIsWho(g)}`;
}

// One card for the person most likely to end your rule (ui/components/foe.ts).
function foeCard(g: GameState) {
  const f = foe(g);
  if (!f || g.over) return "";
  const x = foeLines(g, f);
  const p = f.p;
  const where = p.status === "outside" ? ` ${pr(p.id).He} is outside the walls.` : "";
  const act = f.plot ? "Imprison him to take him out of the plot, or turn an informer inside it. Win back the factions behind it: a Content faction stops backing plots." : p.political?.rank === 3 ? "A Pretender needs a second faction angry with you. Keep the factions content, or take his offices and following from him." : "Watch him, buy him off, or put him where he can't reach you.";
  return `<div class="foe"><h2>Coming for you</h2>
    <div class="fhead">${portrait(p.id, "s")}<div><b>${who(p.id)}</b> ${esc(f.why)}.${x.titles ? ` <span class="small muted">${esc(x.titles)}.</span>` : ""}${esc(where)}</div></div>
    ${x.grievances.length ? `<div class="small"><span class="label">Why</span><ul class="heard">${x.grievances.map((t) => `<li>${linkNames(t)}</li>`).join("")}</ul></div>` : ""}
    ${x.plot ? `<div class="small"><span class="label">The plot</span> ${esc(x.plot)}</div>` : ""}
    ${x.lately.length ? `<div class="small"><span class="label">Lately</span><ul class="heard">${x.lately.map((t) => `<li>${linkNames(t)}</li>`).join("")}</ul></div>` : ""}
    <div class="small muted">${esc(act.replace(/\bhim\b/g, pr(p.id).him).replace(/\bhis\b/g, pr(p.id).his))}</div></div>`;
}

const partialKnobs = () => (switchById("partialBlows") as any).knobs as { wound: number; seize: number };

// Two plots must not share a title: unknown ones are counted ("A second plot, source unknown").
const ORD = ["", "second", "third", "fourth", "fifth", "sixth"];
function plotTitle(g: GameState, pl: Plot, nth = 0) {
  const lf = g.people[pl.leader].faction;
  const fname = lf === "ruler" ? "your own household" : g.factions[lf as FactionId].short;
  if (pl.stage >= 2 || ui.designer) return `A plot among ${fname}`;
  return nth ? `A ${ORD[nth] ?? "further"} plot, source unknown` : "A plot, source unknown";
}

// Plots at Whispers that you know nothing else about read as one card (suggestion 8): "Two plots at Whispers".
const NUM = ["", "One", "Two", "Three", "Four", "Five", "Six"];
function quietCard(g: GameState, qs: Plot[]) {
  const track = ["Whispers", "Rumors", "Named", "Strike"].map((n, i) => `<span class="${i < 1 ? "done" : ""} ${i === 1 ? "next" : ""}">${n}</span>`).join("");
  const when = [...new Set(qs.map((q) => seasonName(q.started)))];
  return `<div class="plot plot-s1">
    <div class="fhead"><b>${NUM[qs.length] ?? qs.length} plots, source unknown</b><span class="stage stage-1 tipped" ${tipAttr("stage")}>${stageName(1)}</span></div>
    <div class="plottrack" aria-label="Warnings passed: 1 of 3">${track}</div>
    <div class="small">Something is off, in more than one place. You don't know who. First warned ${esc(when.join(" and "))}.</div>
    <div class="small muted">Their strength is unknown. Turn an informer inside one to learn it.</div>
    <div class="small">Earliest blow: 3 seasons from now, if they keep growing.</div>
  </div>`;
}

function plots(g: GameState) {
  const all = g.plots.filter((p) => ui.designer || p.stage >= 1);
  const quiet = ui.designer ? [] : all.filter((p) => p.stage === 1 && !p.heard?.length && !p.informer && !p.known.length);
  const ps = quiet.length >= 2 ? all.filter((p) => !quiet.includes(p)) : all;
  const def = defense(g).total;
  let unknown = 0;
  const body = ps.length ? ps.map((pl) => {
    const nth = pl.stage >= 2 || ui.designer ? 0 : unknown++;
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
      <div class="fhead"><b>${esc(plotTitle(g, pl, nth))}</b><span class="stage stage-${pl.stage} tipped" ${tipAttr("stage")}>${stageName(pl.stage)}</span></div>
      <div class="plottrack" aria-label="Warnings passed: ${pl.stage} of 3">${track}</div>
      <div class="small">${what} First warned ${esc(seasonName(pl.started))}.</div>
      ${knownBtns}${pl.heard?.length ? `<div class="small"><span class="label">What you have heard</span><ul class="heard">${pl.heard.map((h) => `<li>${linkNames(h)}</li>`).join("")}</ul></div>` : ""}${meter}
      <div class="small">${when}</div>
    </div>`;
  }).join("") + (quiet.length >= 2 ? quietCard(g, quiet) : "") : quiet.length >= 2 ? quietCard(g, quiet) : `<p class="small muted">No warnings. That you know of.</p>`;
  const advice = all.length ? `<details class="howto small muted"><summary>What you can do</summary> <b>Watch</b> a suspect to see whether he is in it. <b>Turn an informer</b> to learn its size. <b>Imprison</b> a named plotter to take him out. Keep the guard paid: it is most of your defense.${switchOn(g, "partialBlows") ? ` A blow that beats your defense by ${partialKnobs().wound} or less only wounds you; by ${partialKnobs().seize} or less it costs you an office; it must beat it by ${partialKnobs().seize + 1} or more to kill you.` : ""}</details>` : "";
  return `<div><h2>Dangers: plots against you</h2>${body}${advice}</div>`;
}

// Switch "quarrels": every oath sworn before the assembly, yours and theirs, with its day.
function quarrels(g: GameState) {
  if (!switchOn(g, "quarrels")) return "";
  const qs = openQuarrels(g);
  const body = qs.length
    ? qs.map((q) => `<div class="small${q.due <= g.season ? " warn" : ""}">${linkNames(quarrelLine(g, q))}</div>`).join("")
    : `<p class="small muted">No quarrel is sworn before the assembly.</p>`;
  return `<div><h2>Quarrels sworn</h2>${body}
    <details class="howto small muted"><summary>How quarrels work</summary>A quarrel is fought by accusation in the assembly. The accused man's faction and any faction Angry with you stand with him; any faction Content or better stands with you. Give a man what he swore to take, or a gift of 3 silver if he swore to shame you, and his quarrel ends.</details></div>`;
}

// What a rival's influence means for you, in words (Jacob: "starting to match me in inlfence (not sure what that means)").
function influenceSays(g: GameState, id: string, rank: number) {
  const his = influence(g, id), yours = playerInfluence(g);
  const fix = "Bring it down by taking his offices or weakening the faction behind him; raise yours with offices and a faction's backing.";
  if (rank >= 3) return `<span class="warn">As a Pretender he works to take your place: the assembly, the guard or the strongest faction can switch to him${switchOn(g, "coalition") ? ", if a second faction is Angry with you" : ""}.</span> ${fix}`;
  if (his >= yours) return `<span class="warn">His influence has reached yours: next he can rise to Pretender and try to take your place.</span> ${fix}`;
  return `<span class="muted">Influence is one per office held plus half the power of the faction behind him. At ${yours} he rises to Pretender.</span>`;
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
        <div class="small">${r ? `Scars: ${esc(r.scars.join(", "))}. ` : ""}${pol ? `${esc(pol.type)}, influence ${influence(g, p.id)} against your ${playerInfluence(g)}. ${influenceSays(g, p.id, pol.rank)} ` : ""}<span class="muted">${p.status === "free" ? "In the city." : p.status === "held" ? "In your prison." : "Outside the walls."}</span></div>
        ${mem ? `<div class="memory">${P.He} remembers: ${esc(mem.text)}.</div>` : ""}
        ${ag ? `<div class="small warn">${P.His} agenda, <i>${esc(ag.name)}</i>: step ${p.agenda!.step} of ${ag.steps.length}${p.agenda!.step < ag.steps.length ? `, next: ${esc(ag.steps[p.agenda!.step].toLowerCase())}` : ""}.</div>` : ""}
      </div></div>`;
  }).join("") : `<p class="small muted">No one has sworn against you, and no one is climbing toward your place. Yet.</p>`;
  return `<div><h2>Rivals</h2>${body}
    ${waiting.length ? `<p class="small muted">Waiting in the wings: ${waiting.map((w) => who(w)).join(", ")}.</p>` : ""}
    <details class="howto small muted"><summary>Enemies and rivals</summary><span class="tipped" ${tipAttr("enemy")}>Enemies</span> are made by wounds and want you dead (at most ${DATA.maxEnemies}). <span class="tipped" ${tipAttr("political")}>Political rivals</span> are made by ambition and want your place (at most ${DATA.maxPolitical}).</details></div>`;
}

// Who is who: the people who matter this season first, marked with why (Jacob's first test: "Too many people all
// being shown with equal importance"). The rest fold under "Everyone else".
function whyMatters(g: GameState, p: ReturnType<typeof others>[number]): { why: string; weight: number } | null {
  const offs = officesOf(g, p.id);
  const lead = (["family", "rich", "citizens", "guard"] as FactionId[]).find((f) => leaderOf(g, f)?.id === p.id);
  const plotter = g.plots.some((pl) => pl.known.includes(p.id));
  const asks = g.requests.some((r) => r.from === p.id);
  const bits: string[] = [];
  let w = 0;
  if (p.rival) { bits.push("your enemy"); w += 5 + p.rival.rank; }
  if (p.political) { bits.push("wants your place"); w += 5 + p.political.rank; }
  if (plotter) { bits.push("in a plot you know of"); w += 6; }
  if (offs.length) { bits.push(`holds ${offs.map((o) => officeName(o)).join(" and ")}`); w += 3 + offs.length; }
  if (lead) { bits.push(`leads ${g.factions[lead].short}`); w += 3; }
  if (asks) { bits.push("petitions you"); w += 2; }
  if (!w && Math.abs(p.opinion) >= 3) { bits.push(p.opinion > 0 ? "devoted to you" : "hates you"); w += 1; }
  return w ? { why: bits.join(", "), weight: w } : null;
}

function whoIsWho(g: GameState) {
  const live = others(g).filter((p) => p.status !== "absent" && p.status !== "dead");
  const rows = live.map((p) => ({ p, m: whyMatters(g, p) }));
  const key = rows.filter((r) => r.m).sort((a, b) => b.m!.weight - a.m!.weight);
  const rest = rows.filter((r) => !r.m);
  const row = (p: (typeof live)[number], why?: string) => `<button type="button" class="row-person" data-person="${esc(p.id)}">${portrait(p.id, "s")}<span class="nm">${esc(capital(p.name))}${p.status !== "free" ? ` <span class="tag">${p.status === "held" ? "in prison" : "outside"}</span>` : ""}${why ? `<span class="small muted whyline">${esc(why)}</span>` : ""}</span><span class="opw small">${esc(opinionWord(p.opinion))}</span></button>`;
  return `<div><h2>Who matters</h2>
    ${key.length ? key.map((r) => row(r.p, r.m!.why)).join("") : `<p class="small muted">No one stands out yet.</p>`}
    ${rest.length ? `<details class="everyone"><summary class="small">Everyone else (${rest.length})</summary>${rest.map((r) => row(r.p, `${capital(g.factions[r.p.faction as FactionId]?.short ?? "")}`)).join("")}</details>` : ""}
    <p class="small"><button type="button" data-view="court">Open the court</button></p></div>`;
}
