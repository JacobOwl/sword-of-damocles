// The season column: what happened, the council, matters and petitions before you, and your actions.
import { DATA, act, capital, battleForecast, yourArmy, armyName, nodeName, menWords, chooseEvent, menu, refuseRequest, officeName, preview, secondOptions, thirdOptions, actionNotes, seasonName, openEvents } from "../../src/core/index.ts";
import type { Args, GameState } from "../../src/core/index.ts";
import { guide, guideDone } from "./help.ts";
import { flags } from "./people.ts";
import { portrait } from "../components/portraits.ts";
import { councilBlock, counselLines, blackmailNote } from "../components/intrigue.ts";
import { lastSeasonSummary, seasonFeed } from "./story.ts";
import { esc, linkNames, opChip, pr, sign, ui, who } from "../lib/text.ts";
import { AREA_ICON, icon } from "../components/icons.ts";
import { vignette } from "../components/vignettes.ts";
import * as sound from "../lib/sound.ts";
import type { Handlers } from "../app/clicks.ts";
import { dinnerPanel, dinnerHandlers } from "./dinner.ts";

export function seasonCol(g: GameState) {
  const season = g.over ? g.over.season : g.season;
  const f = seasonFeed(g, season);
  return `${!guideDone() && !g.over ? guide() : ""}
    ${lastSeasonSummary(g)}
    <div><h2>${esc(seasonName(season))}</h2>${f.empty ? `<p class="muted">Nothing has happened yet.</p>` : f.groups + f.shifts}</div>
    ${councilBlock(g)}
    ${matters(g)}
    ${requests(g)}
    ${g.over ? "" : actions(g)}`;
}

// Events waiting for your answer (data/events.json). Answering costs no action unless the choice says so.
function matters(g: GameState) {
  const evs = g.over ? [] : openEvents(g);
  if (!evs.length) return "";
  return `<div><h2>Matters before you</h2>
    <p class="small muted">Answering costs no action unless it says so. If you end the season without answering, the choice marked “if you give no answer” is taken.</p>
    ${evs.map((ev) => `<div class="matter ${(ev.def as { art?: string }).art ? "" : "no-art"}">
      ${vignette((ev.def as { art?: string }).art, `Picture for ${ev.title}`)}
      <h3>${esc(ev.title)}</h3>
      <p>${linkNames(ev.text)}</p>
      ${ev.def.kind === "history" ? `<p class="small muted">From the sources: ${esc(ev.def.source)}. What follows from your choice is the game's.</p>` : ""}
      <div class="choices">${ev.choices.map((c) => {
        const bits = [...(c.cost.length ? [`Costs ${c.cost.join(", ")}.`] : [])];
        if (c.effects.length) bits.push(`${c.effects.join(". ")}.`);
        let odds = "";
        if (c.roll) odds = `Needs <span class="need">${c.roll.need}+</span> on one die${c.roll.mods.length ? `, with ${c.roll.mods.map((m) => `${esc(m.label)} ${sign(m.value)}`).join(", ")}` : ""}. Chance <span class="chance">${Math.round(c.roll.chance * 100)}%</span>.${c.roll.success.length ? ` If it works: ${esc(c.roll.success.join(". "))}.` : ""}${c.roll.failure.length ? ` If not: ${esc(c.roll.failure.join(". "))}.` : ""}`;
        return `<div class="choice"><button data-choose="${esc(ev.inst.uid)}" data-choice="${esc(c.id)}" ${c.blocked ? "disabled" : ""}>${esc(c.label)}</button>
          <span class="small">${esc(bits.join(" "))}${odds ? ` ${odds}` : ""}${c.blocked ? ` <span class="muted">(${esc(c.blocked)})</span>` : ""}${c.isDefault ? ` <span class="tag">if you give no answer</span>` : ""}</span></div>`;
      }).join("")}</div>
    </div>`).join("")}</div>`;
}

function requests(g: GameState) {
  if (!g.requests.length || g.over) return "";
  return `<div><h2>Petitions to you</h2>
    <p class="small muted">Granting uses an action. Refusing in public costs a petitioner influence and opinion; a second refusal makes an enemy. Petitions left unanswered are refused when the season ends.</p>
    ${g.requests.map((r) => {
      const p = g.people[r.from];
      const P = pr(p.id);
      const what = r.kind === "office" ? `asks for ${officeName(r.office!)}` : r.kind === "silver" ? "asks for a gift of 1 silver" : r.kind === "citizenship" ? "demands land and citizenship for the guard" : r.kind === "marriage" ? "offers a marriage between your houses" : "asks for land";
      const grant = grantArgs(g, r);
      const pv = grant ? preview(g, grant.a, grant.args) : null;
      const risk = p.refusals ? `<span class="warn">You refused ${P.him} once already: refusing again makes an enemy.</span>` : "";
      return `<div class="req">${portrait(p.id, "s")}<span class="t">${who(p.id)} ${esc(what)}. <span class="small">${opChip(p.opinion, true)}</span>${r.owed ? ` <i>You owe ${P.him} a favour.</i>` : ""} ${risk}${blackmailNote(g, r.blackmail)}</span>
        <span class="req-btns"><button data-grant="${r.id}" ${pv?.ok ? "" : "disabled"}>Grant</button>
        <button data-refuse="${r.id}">Refuse</button></span>
        ${pv && !pv.ok ? `<span class="small muted">Can't grant: ${esc(pv.why)}</span>` : ""}</div>`;
    }).join("")}</div>`;
}

export function grantArgs(g: GameState, r: GameState["requests"][number]): { a: string; args: Args } | null {
  if (r.kind === "office") return { a: "grantOffice", args: { target: r.from, second: r.office } };
  if (r.kind === "silver") return { a: "bribe", args: { target: r.from, second: "1" } };
  if (r.kind === "citizenship") return { a: "grantGuard", args: {} };
  if (r.kind === "land") return { a: "giveLand", args: { target: r.faction } };
  if (r.kind === "marriage") {
    const kin = secondOptions(g, "marriage", { target: r.from })[0];
    return kin ? { a: "marriage", args: { target: r.from, second: kin.value } } : null;
  }
  return null;
}

function actions(g: GameState) {
  const items = menu(g);
  const areas = DATA.areas.filter((a) => items.some((i) => i.area === a));
  return `<div id="actions"><h2>Your actions</h2>
    <p class="small muted">Open an action to see its target, cost and odds before you commit. A roll is one die plus modifiers; 4 or more succeeds.</p>
    ${areas.map((area) => `<div class="area"><span class="label">${icon(AREA_ICON[area] ?? "")}${esc(area)}</span>
      ${items.filter((i) => i.area === area).map((i) => `
        <button class="act ${ui.openAction === i.id ? "open" : ""} ${i.blocked ? "off" : ""}" data-act="${i.id}" aria-expanded="${ui.openAction === i.id}">
          <span>${esc(i.name)}${i.reach ? ` <span class="tag" data-tip="reach">reach</span>` : ""}</span><span class="c">${esc(i.blocked ?? i.cost)}</span>
        </button>
        ${ui.openAction === i.id ? panel(g, i) : ""}`).join("")}
    </div>`).join("")}
    <p style="margin-top:14px"><button class="primary" id="end2">End the season</button> <span class="small muted">${g.slots} action${g.slots === 1 ? "" : "s"} left.</span></p></div>`;
}

// Sending the army into an enemy army: the battle it would fight, every modifier on both sides, before you commit.
function battleNote(g: GameState, dest: string | undefined) {
  const a = yourArmy(g);
  if (!a || !dest) return "";
  const f = battleForecast(g, a, dest);
  if (!f) return "";
  const list = (m: { label: string; value: number }[]) => m.map((x) => `${esc(x.label)} ${sign(x.value)}`).join(", ") || "nothing";
  const pct = (x: number) => `${Math.round(x * 100)}%`;
  return `<div class="small battle-note"><b>This march means a battle at ${esc(nodeName(f.at))}</b> against ${esc(armyName(g, f.foe))} (${esc(menWords(f.foe.men))}). Each side rolls one die. Yours adds ${list(f.mine)}; theirs adds ${list(f.theirs)}. You win ${pct(f.win)}, draw ${pct(f.draw)}, lose ${pct(f.lose)}.</div>`;
}

function panel(g: GameState, i: ReturnType<typeof menu>[number]) {
  if (i.id === "hostDinner") return dinnerPanel(g, i); // switch "dinners": the table has its own panel
  const args = ui.args;
  const seconds = secondOptions(g, i.id, args);
  const thirds = thirdOptions(g, i.id, args);
  const notes = actionNotes(g, i.id, args);
  const pv = preview(g, i.id, args);
  let odds = "";
  if (pv.ok && pv.auto) odds = `<span class="good">Certain: no roll.</span>`;
  else if (pv.ok) {
    const pct = Math.round((pv.chance ?? 0) * 100);
    odds = `<span class="chance-bar" aria-hidden="true"><i style="width:${pct}%"></i></span> <span class="chance">${pct}%</span> chance. Needs <span class="need">${pv.need}+</span> on one die${pv.mods.length ? `, with ${pv.mods.map((m) => `${esc(m.label)} ${sign(m.value)}`).join(", ")}` : ", no modifiers"}.`;
  } else odds = `<span class="muted">${esc(capital(pv.why ?? ""))}.</span>`;
  const target = args.target && g.people[args.target] ? g.people[args.target] : null;
  const fight = i.id === "sendArmy" ? battleNote(g, args.target) : "";
  return `<div class="panel">
    <div class="small"><b>Cost:</b> ${esc(i.cost)}. <b>Roll:</b> ${esc(i.roll)}.</div>
    <div class="small"><b>If it works:</b> ${esc(i.success)}${i.failure ? ` <b>If not:</b> ${esc(i.failure)}` : ""}</div>
    ${i.targets || seconds.length || thirds.length ? `<div class="row">
      ${i.targets ? `<label class="label" for="t-${i.id}">${esc(i.targetLabel ?? "Target")}</label><select id="t-${i.id}" data-arg="target"><option value="">Choose…</option>${i.targets.map((o) => `<option value="${esc(o.value)}" ${args.target === o.value ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select>` : ""}
      ${seconds.length ? `<label class="label" for="s-${i.id}">${esc(i.secondLabel ?? "Option")}</label><select id="s-${i.id}" data-arg="second"><option value="">Choose…</option>${seconds.map((o) => `<option value="${esc(o.value)}" ${args.second === o.value ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select>` : ""}
      ${thirds.length ? `<label class="label" for="o-${i.id}">${esc(i.thirdLabel ?? "Option")}</label><select id="o-${i.id}" data-arg="option"><option value="">Choose…</option>${thirds.map((o) => `<option value="${esc(o.value)}" ${args.option === o.value ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select>` : ""}
    </div>` : ""}
    ${notes.length ? `<ul class="small prices">${notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
    ${target ? `<div class="small target-line">${portrait(target.id, "s")} ${who(target.id)} ${opChip(target.opinion, true)} ${flags(g, target)}</div>` : ""}
    ${fight}
    <div class="odds">${fight && pv.ok ? `<span class="muted">The march itself is certain; the battle is not.</span>` : odds}</div>
    ${pv.ok ? counselLines(g, i.id, args, pv.chance) : ""}
    <div class="row"><button class="primary" id="do" ${pv.ok ? "" : "disabled"}>${esc(i.name)}</button><button id="cancel">Cancel</button></div>
  </div>`;
}

// ---------- Clicks on this column (registered once by the click layer, ui/app/clicks.ts) ----------
export const seasonHandlers: Handlers = {
  click: {
    "[data-act]": (b, c) => {
      const id = b.dataset.act!;
      ui.openAction = ui.openAction === id ? null : id; ui.args = {};
      const item = menu(c.g).find((m) => m.id === id);
      if (item?.targets?.length === 1) ui.args.target = item.targets[0].value;
      c.render();
      document.querySelector(`[data-act="${id}"]`)?.scrollIntoView({ block: "nearest" });
    },
    "#do": (_, c) => {
      if (!ui.openAction) return;
      act(c.g, ui.openAction, ui.args); sound.tick(); ui.openAction = null; ui.args = {}; c.save(); c.render();
    },
    "#cancel": (_, c) => { ui.openAction = null; ui.args = {}; c.render(); },
    "[data-grant]": (b, c) => {
      const r = c.g.requests.find((x) => x.id === b.dataset.grant);
      const ga = r && grantArgs(c.g, r);
      if (ga) { act(c.g, ga.a, ga.args); sound.tick(); c.save(); c.render(); }
    },
    "[data-choose]": (b, c) => { chooseEvent(c.g, b.dataset.choose!, b.dataset.choice!); sound.tick(); c.save(); c.render(); },
    "[data-refuse]": (b, c) => { refuseRequest(c.g, b.dataset.refuse!); c.save(); c.render(); },
    ...dinnerHandlers.click,
  },
  change: {
    "[data-arg]": (sel, c) => {
      const k = sel.dataset.arg as keyof Args;
      ui.args = { ...ui.args, [k]: (sel as HTMLSelectElement).value || undefined };
      if (k === "target") { ui.args.second = undefined; ui.args.option = undefined; }
      c.render();
      (document.getElementById(sel.id) as HTMLElement | null)?.focus();
    },
    ...dinnerHandlers.change,
  },
};
