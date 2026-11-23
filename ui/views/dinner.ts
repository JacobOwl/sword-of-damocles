// Switch "dinners": the dinner table, drawn inside the "Give a dinner" action. You choose the couch beside yours,
// the other guests and the wine; the screen shows what you know about the table before you commit: who holds the couch now
// and who would take it badly, which guests are friends or at odds from earlier dinners, and what the wine does.
// It shows nothing you have not learned (no hidden plots or grudges). The rules are in src/core/dinner.ts.
import { DINNERS, capital, couchHolder, friendsOf, foesOf, guestPool, menu, parseGuests, preview, seasonName, suggestTable, wineById } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";
type MenuItem = ReturnType<typeof menu>[number];
import { counselLines } from "../components/intrigue.ts";
import { portrait } from "../components/portraits.ts";
import { flags } from "./people.ts";
import { esc, opChip, ui, who } from "../lib/text.ts";
import type { Handlers } from "../app/clicks.ts";

const STYLE = `<style>
.dinner .seats { display: flex; flex-wrap: wrap; gap: 4px 8px; }
.dinner .seat { display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px 2px 2px; border: 1px solid transparent; border-radius: 3px; cursor: pointer; }
.dinner .seat:has(input:checked) { border-color: currentColor; }
.dinner .seat input { margin: 0 2px 0 4px; }
.dinner .ties { margin: 0; padding-left: 1.1em; }
.dinner .wines label { margin-right: 12px; white-space: nowrap; }
</style>`;

const nm = (g: GameState, id: string) => capital(g.people[id]?.name ?? id);

// What you already know about this table, in plain words.
function tableNotes(g: GameState, honour: string | undefined, guests: string[]): string[] {
  const out: string[] = [];
  const holder = couchHolder(g);
  if (honour && holder && holder !== honour && g.people[holder]?.status === "free") {
    const p = g.people[holder];
    const hard = p.traits.includes("proud") || p.traits.includes("vengeful") || !!p.political;
    out.push(`${nm(g, holder)} holds the couch beside yours now and will think less of you if ${esc(g.people[honour].name)} takes it${hard ? ", and will hold a grudge" : ""}.`);
  }
  const all = [...(honour ? [honour] : []), ...guests];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const a = all[i], b = all[j];
    if (friendsOf(g, a).includes(b)) out.push(`${nm(g, a)} and ${esc(g.people[b].name)} are friends from an earlier dinner.`);
    if (foesOf(g, a).includes(b)) out.push(`${nm(g, a)} and ${esc(g.people[b].name)} are at odds from an earlier dinner: watered wine may mend it, strong wine will not.`);
  }
  const wants = new Map<string, string[]>();
  for (const id of all) { const w = g.people[id].wants; if (w) wants.set(w, [...(wants.get(w) ?? []), id]); }
  for (const ids of wants.values()) if (ids.length > 1) out.push(`${ids.map((id) => nm(g, id)).join(" and ")} want the same office.`);
  const enemies = all.filter((id) => g.people[id].rival);
  if (enemies.length) out.push(`${enemies.map((id) => nm(g, id)).join(" and ")} ${enemies.length > 1 ? "are enemies" : "is an enemy"}: your guards will want a search at the door.`);
  return out;
}

export function dinnerPanel(g: GameState, i: MenuItem): string {
  const args = ui.args;
  const pool = guestPool(g);
  const guests = parseGuests(args.option);
  const holder = couchHolder(g);
  const pv = preview(g, i.id, args);
  const k = DINNERS.knobs;
  const notes = tableNotes(g, args.target, guests);
  const ties = [
    ...(g.dinners?.bonds ?? []).map((t) => `${nm(g, t.a)} and ${esc(g.people[t.b]?.name)}: friends since ${esc(seasonName(t.season))} (${esc(t.why)}).`),
    ...(g.dinners?.quarrels ?? []).map((t) => `${nm(g, t.a)} and ${esc(g.people[t.b]?.name)}: at odds since ${esc(seasonName(t.season))} (${esc(t.why)}).`),
  ];
  const w = wineById(args.second);
  return `${STYLE}<div class="panel dinner">
    <div class="small"><b>Cost:</b> ${esc(i.cost)}. No roll: the evening goes where the guests take it.</div>
    <div class="small">${esc(i.success)}</div>
    <div class="small"><b>The couch beside yours:</b> ${holder && g.people[holder] ? `${who(holder)} has held it since ${esc(seasonName(g.dinners!.honourSince ?? 0))}.` : "no one has held it yet."}</div>
    <div class="row"><button data-suggest>Suggest a table</button><span class="small muted">honours a friend and invites the coldest men, so the wine can work on them</span></div>
    <div class="row"><label class="label" for="t-${i.id}">On the couch beside yours</label>
      <select id="t-${i.id}" data-honour><option value="">Choose…</option>${pool.map((p) => `<option value="${esc(p.id)}" ${args.target === p.id ? "selected" : ""}>${esc(capital(p.name))}</option>`).join("")}</select></div>
    <div><span class="label">Other guests (${k.minGuests} to ${k.maxGuests})</span>
      <div class="seats">${pool.filter((p) => p.id !== args.target).map((p) => `<label class="seat small">${portrait(p.id, "s")}<input type="checkbox" data-guest="${esc(p.id)}" ${guests.includes(p.id) ? "checked" : ""}>${esc(capital(p.name))} ${opChip(p.opinion)} ${flags(g, p)}</label>`).join("")}</div></div>
    <div class="wines small"><span class="label">The wine</span> ${DINNERS.wines.map((x) => `<label><input type="radio" name="wine" data-wine="${esc(x.id)}" ${args.second === x.id ? "checked" : ""}> ${esc(x.label)} (${x.cost} silver)</label>`).join("")}</div>
    ${w ? `<p class="small muted">${esc(w.text)}${w.id === "strong" ? " Quarrels, slips and your own careless words are likelier." : w.id === "watered" ? " Old quarrels mend more easily; little slips out." : ""}</p>` : ""}
    ${notes.length ? `<div class="small"><b>What you know about this table:</b><ul class="ties">${notes.map((n) => `<li>${n}</li>`).join("")}</ul></div>` : ""}
    <div class="odds">${pv.ok ? `<span class="good">Ready.</span>` : `<span class="muted">${esc(capital(pv.why ?? ""))}.</span>`}</div>
    ${pv.ok ? counselLines(g, i.id, args, pv.chance) : ""}
    <div class="row"><button class="primary" id="do" ${pv.ok ? "" : "disabled"}>${esc(i.name)}</button><button id="cancel">Cancel</button></div>
    ${ties.length ? `<details class="small"><summary>Friends and quarrels from your table</summary><ul class="ties">${ties.map((t) => `<li>${t}</li>`).join("")}</ul></details>` : ""}
  </div>`;
}

// ---------- Clicks (merged into the season column's handlers) ----------
export const dinnerHandlers: Handlers = {
  click: {
    "[data-suggest]": (_, c) => { const t = suggestTable(c.g); if (t) { ui.args = t; c.render(); } },
  },
  change: {
    "[data-guest]": (el, c) => {
      const id = el.dataset.guest!;
      const gs = parseGuests(ui.args.option).filter((x) => x !== id);
      if ((el as HTMLInputElement).checked) gs.push(id);
      ui.args = { ...ui.args, option: gs.join(",") || undefined };
      c.render();
    },
    "[data-honour]": (el, c) => {
      const id = (el as HTMLSelectElement).value || undefined;
      ui.args = { ...ui.args, target: id, option: parseGuests(ui.args.option).filter((x) => x !== id).join(",") || undefined };
      c.render();
      document.getElementById(el.id)?.focus();
    },
    "[data-wine]": (el, c) => { ui.args = { ...ui.args, second: el.dataset.wine }; c.render(); },
  },
};
