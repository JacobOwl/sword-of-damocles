// Switch "exile" (Fallen, not finished): the screens of an exile. While you are in exile the city column shows
// where you are and the city under its new ruler, the dangers column opens with the hunt, the ledger shows your
// purse and your men, and the line at the top names what presses. It only reads the state (src/core/exile.ts).
import { capital, moodName, seasonName, exileView, inExile, companies, talents } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";
import { esc, linkNames, opChip, sign, who } from "../lib/text.ts";
import { icon } from "../components/icons.ts";
import { portrait } from "../components/portraits.ts";

export { inExile };
const pct = (x: number) => `${Math.round(x * 100)}%`;
const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);
const mods = (m: { label: string; value: number }[]) => m.map((x) => `${esc(x.label)} ${sign(x.value)}`).join(", ");

// The ledger while you are in exile: your purse, your men, how much the ruler hears of you, your chances.
export function exileLedger(g: GameState) {
  const v = exileView(g);
  const L = (mark: string, t: string) => `<span class="label">${icon(mark)}${esc(t)}</span>`;
  const dots = Array.from({ length: v.maxNotice }, (_, i) => `<i class="${i < v.notice ? "on" : ""}"></i>`).join("");
  return `<div class="ledger exile-ledger">
    <div>${L("land", "Where you are")}<span class="v">${esc(capital(v.refuge.name))}</span><span class="small muted">safety ${v.refuge.safety}${v.refuge.crossing ? ", across the sea" : ""}</span></div>
    <div>${L("silver", "Your purse")}<span class="v">${v.silver} <small>${v.silver === 1 ? "talent" : "talents"}</small></span>${v.upkeep ? `<span class="small muted">your men cost ${esc(talents(v.upkeep))} a season</span>` : ""}</div>
    <div>${L("helmet", "Your men")}<span class="v">${v.men}</span><span class="small muted">${esc(companies(v.men))}</span></div>
    <div>${L("influence", "Followers")}<span class="v">${v.followers.length}</span><span class="small muted">${v.sworn.length} sworn inside the city</span></div>
    <div>${L("anger", "The ruler hears of you")}<span class="clock">${dots}</span><span class="small muted">${v.notice} of ${v.maxNotice}; at ${v.huntAt} a hunt may begin</span></div>
    <div>${L("city", "Syracuse is held by")}<span class="v gov">${esc(capital(v.ruler))}</span><span class="small muted">grip ${v.hold} of ${v.maxHold}</span></div>
    <div>${L("defense", "Strike now")}<span class="v">${pct(v.odds.win)}</span><span class="small muted">to win; ${pct(v.odds.die)} to die</span></div>
  </div><div class="meander ledger-rule" aria-hidden="true"></div>`;
}

// What presses this season, in one line.
export function exileNow(g: GameState) {
  const v = exileView(g);
  const xs: { text: string; level: string }[] = [];
  if (v.huntForecast.ready) xs.push({ text: `Men sent by ${v.ruler} can strike at you at the end of this season: ${pct(v.huntForecast.kill)} you die, ${pct(v.huntForecast.wound)} you are wounded. Move or lie low.`, level: "danger" });
  else if (v.hunt) xs.push({ text: `${capital(v.ruler)}'s men are hunting you (${["", "Whispers", "Rumors", "Named"][v.hunt.stage]}). See Dangers.`, level: "warn" });
  if (v.invited) xs.push({ text: "Your friends hold a gate for you this season.", level: "warn" });
  if (v.away) xs.push({ text: `${capital(v.ruler)} is away in the field this season.`, level: "warn" });
  if (v.wavering.length) xs.push({ text: `${list(v.wavering.map((id) => capital(g.people[id].name)))} may leave you at the end of the season.`, level: "warn" });
  if (v.upkeep > v.silver) xs.push({ text: "You cannot pay your hired men this season: a company will drift away.", level: "warn" });
  if (!xs.length) xs.push({ text: `You are in exile at ${v.refuge.name}. Gather men and friends; strike when the odds are good.`, level: "calm" });
  const [first, ...rest] = xs;
  return `<p class="now now-${first.level === "calm" ? "calm" : first.level}"><b>In exile:</b> ${esc(first.text)}${rest.length ? ` <span class="small">Also: ${esc(rest.map((x) => x.text.replace(/\.$/, "")).join("; "))}.</span>` : ""}</p>`;
}

// The city column in exile: where you are, who is with you, and the city under its new ruler.
export function exileCol(g: GameState) {
  const v = exileView(g);
  const x = g.exile!;
  const person = (id: string, note: string) => `<div class="req">${portrait(id, "s")}<span class="t">${who(id)} <span class="small">${opChip(g.people[id].opinion, true)}</span> <span class="small muted">${esc(note)}</span></span></div>`;
  const followers = v.followers.length ? v.followers.map((id) => person(id, v.wavering.includes(id) ? "may leave you" : "with you")).join("") : `<p class="small muted">No one is with you.</p>`;
  const sworn = v.sworn.length ? v.sworn.map((id) => person(id, "sworn to you, inside the walls")).join("") : `<p class="small muted">No one inside the city is sworn to you yet.</p>`;
  const lost = v.lost.length ? `<p class="small muted">Lost: ${list(v.lost.map((id) => `${who(id)} (${g.people[id].status === "dead" ? "dead" : "in prison"})`))}.</p>` : "";
  const moods = v.moods.map((m) => `<tr><th scope="row">${esc(capital(m.name))}</th><td><span class="mood mood-${m.toYou}">${esc(moodName(m.toYou))}</span></td><td><span class="mood mood-${m.toRuler}">${esc(moodName(m.toRuler))}</span></td><td class="small">${m.toYou >= 3 && m.toRuler <= 1 ? `<span class="good">will rise for you</span>` : m.toYou >= 3 ? "longs for you" : m.toRuler <= 1 ? "hates the ruler" : ""}</td></tr>`).join("");
  const agenda = v.agenda.map((a) => `<li class="${a.ready ? "" : "muted"}">${esc(a.name)}${a.ready ? "" : " <span class=\"small\">(not now)</span>"}</li>`).join("");
  const acts = v.acts.length ? `<ul class="small">${v.acts.map((a) => `<li>${esc(seasonName(a.season))}: ${linkNames(a.text)} <span class="muted">(${esc(a.why)})</span></li>`).join("")}</ul>` : `<p class="small muted">Nothing yet.</p>`;
  const past = x.history.length > 1 ? `<p class="small muted">This is your exile number ${x.count}.</p>` : "";
  return `<div><h2>${icon("land")}In exile at ${esc(v.refuge.name)}</h2>
      <p class="small">Since ${esc(seasonName(v.since))}. ${esc(v.refuge.summary)}</p>${past}
      <p class="small">Men for hire here: ${v.refuge.recruits === 1 ? "a company" : `${v.refuge.recruits} companies`} for ${esc(talents(v.refuge.hirePrice))}.${v.arms ? " Arms for the citizens are bought and hidden." : ""}${v.patrons.length ? ` Patrons who helped you: ${v.patrons.length}.` : ""}</p>
      ${v.promises.length ? `<p class="small muted">What you promised: ${esc(v.promises.join(" "))}</p>` : ""}
      <h3>With you</h3>${followers}
      <h3>Your friends inside</h3>${sworn}${lost}
    </div>
    <div><h2>${icon("city")}Syracuse under ${esc(v.ruler)}</h2>
      <p class="small">${v.rulerId ? who(v.rulerId) : esc(capital(v.ruler))} holds the city. Grip on the city: ${v.hold} of ${v.maxHold}.</p>
      <table class="exile-moods"><thead><tr><th></th><th scope="col">Toward you</th><th scope="col">Toward the ruler</th><th></th></tr></thead><tbody>${moods}</tbody></table>
      <p class="small muted">A faction that is Content or better with you and Angry or worse with the ruler rises for you when you strike: +1 each.</p>
      <h3>What the ruler will do next</h3>
      <p class="small muted">The first of these that can be done, one a season.</p>
      <ol class="small">${agenda}</ol>
      <h3>What the ruler has done</h3>${acts}
    </div>`;
}

// The top of the dangers column in exile: the hunt, and the odds of striking for the city.
export function exileDangers(g: GameState) {
  const v = exileView(g);
  const h = v.hunt;
  const f = v.huntForecast;
  const track = ["Whispers", "Rumors", "Named", "Strike"].map((n, i) => `<span class="${h && i < h.stage ? "done" : ""} ${h && i === h.stage ? "next" : ""}">${n}</span>`).join("");
  const hunt = h ? `<div class="plot plot-s${h.stage}">
      <div class="fhead"><b>${esc(capital(v.ruler))}'s men are hunting you</b><span class="stage stage-${h.stage}">${["", "Whispers", "Rumors", "Named"][h.stage]}</span></div>
      <div class="plottrack" aria-label="Warnings passed: ${h.stage} of 3">${track}</div>
      <div class="small">${f.ready ? `<b class="warn">They can strike at the end of this season.</b>` : h.stage < 3 ? `They grow closer each season while the ruler hears 2 or more of you.` : "They can strike from next season."}</div>
      <div class="small">If they strike, they roll one die with ${mods(f.theirs)}, and must beat your guard of ${f.guard} (${mods(f.yours)}). You die: ${pct(f.kill)}. You are wounded: ${pct(f.wound)}${f.shield ? `, and ${esc(f.shield)} dies shielding you` : ""}.</div>
      <div class="small muted">What you can do: ${v.hunt && h.stage >= 3 ? `<b>Seek another refuge</b> and they lose a step (they know your face now)` : `<b>Seek another refuge</b> and they lose your trail`}. ${v.hides ? `<b>Lie low</b> and they lose a step (${v.hides === 1 ? "once more" : v.hides === 2 ? "twice more" : `${v.hides} more times`} for this hunt)` : `Lying low no longer throws them off`}. Hire men to guard you.</div>
    </div>` : `<p class="small muted">No one is hunting you. While ${esc(v.ruler)} hears less than ${v.huntAt} of you, and you have fewer than four companies, no one is likely to be sent.</p>`;
  const o = v.odds;
  return `<div><h2>The hunt</h2>${hunt}</div>
    <div><h2>Striking for the city</h2>
      <p class="small">One die, needs ${o.need}, with ${mods(o.mods) || "no modifiers"}.</p>
      <p class="small"><span class="good">Take the city: ${pct(o.win)}</span> · thrown back, half your men lost: ${pct(o.repulse)} · <span class="warn">killed in the streets: ${pct(o.die)}</span>.</p>
      <p class="small muted">Better odds come from hired men, friends sworn inside, factions that rise for you, arms for the citizens, and the ruler's absence or a held gate. The walls, the ruler's guard and the grip on the city count against you.</p>
    </div>`;
}
