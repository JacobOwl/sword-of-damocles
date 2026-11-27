// The city column: the six offices and the four factions.
import { DATA, FACTIONS, OFFICES, PLAYER, agendaById, band, capital, leaderOf, moodName, officeName, power, SEATS, seatDef, seatHolder, dugWord, standingName, standingOf, nextStep, race, votedNow, others, knobsFor, attitude } from "../../src/core/index.ts";
import type { FactionId, GameState } from "../../src/core/index.ts";
import { tipAttr } from "./help.ts";
import { esc, who } from "../lib/text.ts";
import { FACTION_ICON, OFFICE_ICON, icon } from "../components/icons.ts";

// Switch "contestedBoard": seven seats, each with its holder, how dug in, what he did with it, and how it changes hands.
const SEAT_ICON: Record<string, string> = { ...OFFICE_ICON, captain: FACTION_ICON.guard };
function seatsBlock(g: GameState) {
  const b = g.board!;
  const rows = SEATS.map((id) => {
    const d = seatDef(id);
    const h = seatHolder(g, id);
    const st = b.seats[id];
    const unbuilt = id === "citadel" && !g.citadelBuilt;
    const holder = unbuilt ? `<span class="muted">not yet built${g.building?.what === "citadel" ? " (work has begun)" : ""}</span>` : h ? `${h === PLAYER ? "<b>You</b>" : who(h)} <span class="muted">· ${esc(dugWord(st?.dug ?? 0).toLowerCase())}</span>` : `<span class="muted">empty</span>`;
    // The holder's line follows his attitude now, not at the season's end (second test: the mint line lagged a season).
    const att = h && h !== PLAYER && g.people[h]?.status === "free" ? attitude(g, h) : undefined;
    const said = att && att !== st?.att ? d.lines[att] : st?.did;
    const did = !unbuilt && h && h !== PLAYER && said ? `<div class="small ${att === "hostile" ? "warn" : att === "friendly" ? "" : "muted"}">${esc(capital(said))}.</div>` : "";
    let how = "";
    if (!unbuilt && votedNow(g, id)) {
      const r = race(g, id);
      const lead = r?.challenger && r.holder ? (r.challenger.score > r.holder.score ? `${r.challenger.id === PLAYER ? "you lead" : `${who(r.challenger.id)} leads`}` : r.challenger.score === r.holder.score ? `${r.challenger.id === PLAYER ? "you are" : who(r.challenger.id) + " is"} level with the holder, who keeps it on a tie` : `the holder leads${r.challenger.id === PLAYER ? " you" : ` ${who(r.challenger.id)}`}`) : r?.challenger ? `${r.challenger.id === PLAYER ? "you would" : who(r.challenger.id) + " would"} take it` : "no one stands";
      how = `<div class="small muted">Voted each spring: ${lead}.</div>`;
    } // otherwise how it changes hands is in the seat's tooltip (suggestion 5: state on the board, rules one look away)
    return `<dt><span class="tipped" data-tip="office" data-tip-text="${esc(`${d.power} ${d.changes}`)}" tabindex="0">${icon(SEAT_ICON[id])}${esc(d.title)}</span></dt><dd>${holder}${did}${how}</dd>`;
  }).join("");
  const risen = others(g).filter((p) => p.status !== "dead" && p.status !== "absent" && standingOf(g, p.id) >= 2).sort((a, c) => standingOf(g, c.id) - standingOf(g, a.id));
  const ladder = risen.length
    ? `<ul class="ladder">${risen.map((p) => `<li>${who(p.id)}: <b>${esc(standingName(standingOf(g, p.id)).toLowerCase())}</b>. <span class="small muted">${esc(nextStep(g, p.id))}</span></li>`).join("")}</ul>`
    : `<p class="small muted">No one has risen high enough to stand against you yet.</p>`;
  return `<div><h2>The seats of power</h2><dl class="offices">${rows}</dl></div><div><h2>The rising few</h2>${ladder}</div>`;
}

export function cityCol(g: GameState) {
  if (g.board) return seatsTail(g, seatsBlock(g));
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
function seatsTail(g: GameState, seats: string) {
  const facs = FACTIONS.map((f) => faction(g, f)).join("");
  const laws = g.laws.length ? `<p class="small">Laws in force: ${g.laws.map((l) => esc(DATA.laws.find((x) => x.id === l)!.name)).join("; ")}.</p>` : "";
  const extra = [g.granary ? "a granary" : "", g.walls ? "new walls" : "", g.factions.citizens.disarmed ? "the citizens are disarmed" : ""].filter(Boolean);
  return `${seats}${laws || extra.length ? `<div>${laws}${extra.length ? `<p class="small">The city has ${extra.join(", ")}.</p>` : ""}</div>` : ""}
    <div><h2>The factions</h2>${facs}</div>`;
}

// The five moods as a track, the current one lit, the danger line marked (Jacob: "not clear what level moods there are").
const MOOD_SAYS = ["Rebellious: backs or starts a plot; costs no longer sour it", "Angry: may back or start a plot", "Uneasy: neither helps nor plots", "Content: no plots; under Reap what you sow it also holds its agenda back", "Loyal: as Content, and a Loyal guard fights better"];
function moodTrack(m: number) {
  const tip = MOOD_SAYS.map((t, i) => `${i === m ? "▶ " : ""}${t}`).reverse().join("\n");
  return `<span class="moodtrack tipped" data-tip="mood" data-tip-text="${esc(tip)}" tabindex="0" aria-label="Mood: ${moodName(m)}"><span class="end">Rebellious</span>${[0, 1, 2, 3, 4].map((i) => `<i class="m${i}${i === m ? " on" : ""}${i === 1 ? " line" : ""}"></i>`).join("")}<span class="end">Loyal</span> <span class="mood mood-${m}">${moodName(m)}</span></span>`;
}

// What holds an agenda back, from agendaStep in src/core/ai.ts (second test: "I don't know how to stop or push back the agenda").
function slowedBy(g: GameState, f: FactionId, against: boolean) {
  return [
    against && knobsFor(g.tuning).contentFactionsStall ? "keeping them Content (they hold back)" : "",
    "blocking their leader (skips a step)",
    "acting against them that season",
    "their leader out of the city",
    "cutting their power to Marginal (stops it)",
  ].filter(Boolean).join(", ");
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
    <div class="small">Mood ${moodTrack(fa.mood)}${fa.backing ? ` · <span class="warn">backs a plot</span>` : ""}</div>
    ${lead ? `<div class="small lead-line">Led by ${who(lead.id)}.</div>` : ""}
    <div class="small">Agenda: <i class="tipped" ${tipAttr("agenda")} data-tip-text="${esc(`${ag.name}. Steps: ${ag.steps.join(", ")}. When complete: ${ag.completes} It moves a step when its roll succeeds, whether or not you act. Working against the faction slows it.`)}">${esc(ag.name)}</i>${fa.agenda.done ? ` <span class="muted">(${esc(fa.agenda.result ?? "done")})</span>` : ` <span class="dots" aria-label="step ${fa.agenda.step} of ${ag.steps.length}">${ag.steps.map((_, i) => `<i class="${i < fa.agenda.step ? "on" : ""}${i === fa.agenda.step ? " next" : ""}"></i>`).join("")}</span> <span class="muted">step ${fa.agenda.step} of ${ag.steps.length}</span>`}</div>
    ${!fa.agenda.done && fa.agenda.step >= ag.steps.length - 1 ? `<div class="small warn">One step left. When done: ${esc(ag.completes)}</div>` : ""}
    <details class="fmore"><summary class="small muted">What they want, and how to slow them</summary>
      <div class="small ${fa.mood <= 1 ? "warn" : "muted"}">Angry or worse backs plots.</div>
      <div class="small">Wants: ${esc(goal)}</div>
      <div class="steps" aria-hidden="true">${ag.steps.map((st, i) => `<span class="${i < fa.agenda.step || fa.agenda.done ? "done" : ""} ${i === fa.agenda.step && !fa.agenda.done ? "next" : ""}">${esc(st)}</span>`).join("")}</div>
      ${fa.agenda.done ? "" : `<div class="small muted">Next: ${esc((ag.steps[fa.agenda.step] ?? "").toLowerCase())}. When done: ${esc(ag.completes)}</div>
      <div class="small muted">Slowed by: ${esc(slowedBy(g, f, ag.againstRuler === true))}.</div>`}
    </details>
  </div>`;
}
