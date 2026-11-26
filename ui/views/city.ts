// The city column: the six offices and the four factions.
import { DATA, FACTIONS, OFFICES, PLAYER, agendaById, band, capital, leaderOf, moodName, officeName, power } from "../../src/core/index.ts";
import type { FactionId, GameState } from "../../src/core/index.ts";
import { tipAttr } from "./help.ts";
import { esc, who } from "../lib/text.ts";
import { FACTION_ICON, OFFICE_ICON, icon } from "../components/icons.ts";

export function cityCol(g: GameState) {
  const offices = OFFICES.map((o) => {
    const h = g.offices[o];
    const text = o === "citadel" && !g.citadelBuilt ? `<span class="muted">not yet built${g.building?.what === "citadel" ? " (work has begun)" : ""}</span>` : h ? (h === PLAYER ? "<b>You</b>" : who(h)) : `<span class="muted">empty</span>`;
    const eff = DATA.offices.find((x) => x.id === o)!.effect;
    return `<dt><span class="tipped" data-tip="office" data-tip-text="${esc(eff)}" tabindex="0">${icon(OFFICE_ICON[o])}${esc(capital(officeName(o).replace(/^the /, "")))}</span></dt><dd>${text}</dd>`;
  }).join("");
  const facs = FACTIONS.map((f) => faction(g, f)).join("");
  const laws = g.laws.length ? `<p class="small">Laws in force: ${g.laws.map((l) => esc(DATA.laws.find((x) => x.id === l)!.name)).join("; ")}.</p>` : "";
  const extra = [g.granary ? "a granary" : "", g.walls ? "new walls" : "", g.factions.citizens.disarmed ? "the citizens are disarmed" : ""].filter(Boolean);
  return `<div><h2>The six offices</h2><dl class="offices">${offices}</dl>${laws}${extra.length ? `<p class="small">The city has ${extra.join(", ")}.</p>` : ""}</div>
    <div><h2>The factions</h2>${facs}</div>`;
}

// The five moods as a track, the current one lit, the danger line marked (Jacob: "not clear what level moods there are").
const MOOD_SAYS = ["Rebellious: backs or starts a plot; costs no longer sour it", "Angry: may back or start a plot", "Uneasy: neither helps nor plots", "Content: no plots; under Reap what you sow it also holds its agenda back", "Loyal: as Content, and a Loyal guard fights better"];
function moodTrack(m: number) {
  const tip = MOOD_SAYS.map((t, i) => `${i === m ? "▶ " : ""}${t}`).reverse().join("\n");
  return `<span class="moodtrack tipped" data-tip="mood" data-tip-text="${esc(tip)}" tabindex="0" aria-label="Mood: ${moodName(m)}">${[0, 1, 2, 3, 4].map((i) => `<i class="m${i}${i === m ? " on" : ""}${i === 1 ? " line" : ""}"></i>`).join("")} <span class="mood mood-${m}">${moodName(m)}</span></span>`;
}

function faction(g: GameState, f: FactionId) {
  const fa = g.factions[f];
  const pow = power(g, f);
  const b = band(pow);
  const def = DATA.factions.find((x) => x.id === f)!;
  const goal = def.goals[fa.goal % def.goals.length].text;
  const ag = agendaById(fa.agenda.id);
  const lead = leaderOf(g, f);
  const bar = Array.from({ length: 10 }, (_, i) => `<i class="${i < pow ? "on" : ""} ${i === 3 || i === 8 ? "cut" : ""}"></i>`).join("");
  return `<div class="faction f-${f}">
    <div class="fhead"><h3>${icon(FACTION_ICON[f], `f-${f}`)}${esc(fa.name)}</h3><span><span class="num">${pow}</span> <span class="band ${b} tipped" ${tipAttr("power")}>${b}</span></span></div>
    <div class="powerbar" aria-hidden="true">${bar}</div>
    <div class="small">Mood ${moodTrack(fa.mood)}${lead ? ` · Led by ${who(lead.id)}` : ""}${fa.backing ? ` · <span class="warn">backs a plot</span>` : ""}</div>
    <div class="small">Wants: ${esc(goal)}</div>
    <div class="small">Agenda: <i class="tipped" ${tipAttr("agenda")} data-tip-text="${esc(`${ag.name}. Steps: ${ag.steps.join(", ")}. When complete: ${ag.completes} It moves a step when its roll succeeds, whether or not you act. Working against the faction slows it.`)}">${esc(ag.name)}</i>${fa.agenda.done ? ` <span class="muted">(${esc(fa.agenda.result ?? "done")})</span>` : `, step ${fa.agenda.step} of ${ag.steps.length}${ag.steps[fa.agenda.step] ? `; next: ${esc(ag.steps[fa.agenda.step].toLowerCase())}` : ""}`}</div>
    <div class="steps" aria-hidden="true">${ag.steps.map((st, i) => `<span class="${i < fa.agenda.step || fa.agenda.done ? "done" : ""} ${i === fa.agenda.step && !fa.agenda.done ? "next" : ""}">${esc(st)}</span>`).join("")}</div>
    ${fa.agenda.done ? "" : `<div class="small${fa.agenda.step >= ag.steps.length - 1 ? " warn" : " muted"}">When done: ${esc(ag.completes)}</div>`}
  </div>`;
}
