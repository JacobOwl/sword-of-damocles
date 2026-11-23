// "Change the past" (Workshop bet B2): go back to any season of your game, take the other choice, and read
// both histories side by side with the season where they part marked. All the work is replay, in src/core/fork.ts;
// this screen only lists your histories, offers the choices you made, and lays two chronicles next to each other.
import { seasonName, capital } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";
import { recordOf, play, decisions, rewrite, compare, loadAt, recordAt, type Recorded, type Decision, type Comparison } from "../../src/core/fork.ts";
import type { Handlers } from "../app/clicks.ts";
import { esc, linkNames, ui } from "../lib/text.ts";

// One history: the record that rebuilds it, and where it came from.
interface Line {
  name: string; // "Your history", or "Pay them for what they hear"
  record: Recorded;
  parent?: number; // the history it branched from
  from?: number; // the season it went back to
  change?: string; // in words: what was done differently
  mode?: "kept" | "own" | "bot";
  skipped?: { season: number; label: string; why: string }[];
}
type Mode = "kept" | "own" | "bot";
const KEY = "sword-of-damocles-past-v1";
export const past = {
  lines: [] as Line[],
  cur: 0, // the history being played
  pick: null as number | null, // the season opened in the list
  pair: null as [number, number] | null, // two histories being compared
  mode: "kept" as Mode,
  note: "",
};
try { const v = JSON.parse(localStorage.getItem(KEY) ?? "null"); if (v?.lines?.length) { past.lines = v.lines; past.cur = Math.min(v.cur ?? 0, v.lines.length - 1); } } catch { /* storage may be blocked */ }
const store = () => { try { localStorage.setItem(KEY, JSON.stringify({ lines: past.lines, cur: past.cur })); } catch { /* ignore */ } };

// Replays are quick but not free; keep the last few games and lists by record.
const games = new Map<string, GameState>();
const lists = new Map<string, Decision[]>();
const keyOf = (r: Recorded) => JSON.stringify(r);
function gameOf(r: Recorded): GameState {
  const k = keyOf(r);
  let g = games.get(k);
  if (!g) { g = play(r); games.set(k, g); if (games.size > 12) games.delete(games.keys().next().value!); }
  return g;
}
function decisionsOf(r: Recorded): Decision[] {
  const k = keyOf(r);
  let d = lists.get(k);
  if (!d) { d = decisions(r); lists.set(k, d); if (lists.size > 6) lists.delete(lists.keys().next().value!); }
  return d;
}

const same = (a: Recorded, b: Recorded) => a.seed === b.seed && (a.tuning ?? "") === (b.tuning ?? "") && (a.scenario ?? "citadel") === (b.scenario ?? "citadel") && JSON.stringify(a.switches ?? []) === JSON.stringify(b.switches ?? []);
const prefix = (a: Recorded, b: Recorded) => a.inputs.length <= b.inputs.length && JSON.stringify(a.inputs) === JSON.stringify(b.inputs.slice(0, a.inputs.length));
// Keep the list in step with the game being played: a new game starts a new list.
function sync(g: GameState) {
  const r = recordOf(g);
  const cur = past.lines[past.cur];
  if (cur && same(cur.record, r) && (prefix(cur.record, r) || prefix(r, cur.record))) { cur.record = r; }
  else { past.lines = [{ name: "Your history", record: r }]; past.cur = 0; past.pair = null; past.pick = null; }
  store();
}

const endOf = (g: GameState) => (g.over ? `${g.over.text} (${seasonName(g.over.season)})` : `Still being played: ${seasonName(g.season)}.`);
const short = (t: string, n = 190) => (t.length > n ? `${t.slice(0, t.lastIndexOf(" ", n))} …` : t);
const chronicleOf = (g: GameState) => {
  const out: Record<number, string> = {};
  for (const e of g.log) if (e.kind === "chronicle") { const i = e.text.indexOf(". "); out[e.season] = e.text.slice(i + 2); }
  return out;
};

// A season's chronicle with the sentences the other history lacks marked, so the difference reads at a glance.
const sentencesOf = (t: string) => t.split(/(?<=[.!?”])\s+(?=[A-Z“(])/);
function marked(text: string, other: string | null): string {
  const there = new Set(sentencesOf(other ?? ""));
  return sentencesOf(text).map((x) => (there.has(x) ? linkNames(x) : `<mark class="past-diff">${linkNames(x)}</mark>`)).join(" ");
}

// ---------- The screen ----------
export function pastView(g: GameState): string {
  sync(g);
  if (past.pair) return compareView(past.pair[0], past.pair[1]);
  const line = past.lines[past.cur];
  const chron = chronicleOf(g);
  const last = g.over ? g.over.season : g.season - 1;
  const ds = decisionsOf(line.record);
  const intro = `<p class="opening">Every game replays exactly from its seed and your choices. Go back to any season, take the other road, and read both histories side by side.</p>
    <p class="small muted">Nothing here is invented. The other history is the same game, played again by the same rules, with one choice changed. After the change, the dice also come in a new order, so the comparison shows your luck in each.</p>`;
  const lines = past.lines.length > 1 || line.parent !== undefined ? `<section class="past-lines"><h3>Your histories</h3><ol>${past.lines.map((l, i) => {
    const lg = gameOf(l.record);
    return `<li class="${i === past.cur ? "on" : ""}"><b>${esc(l.name)}</b>${l.change ? ` <span class="small muted">${esc(l.change)}</span>` : ""}<br><span class="small">${linkNames(endOf(lg))}</span>
      <span class="past-btns">${i === past.cur ? `<span class="small muted">You are playing this one.</span>` : `<button type="button" data-past-play="${i}">Play this history</button>`}${i !== past.cur ? ` <button type="button" data-past-compare="${i}">Compare with the one you're playing</button>` : l.parent !== undefined ? ` <button type="button" data-past-compare="${l.parent}">Compare with where it came from</button>` : ""}</span></li>`;
  }).join("")}</ol></section>` : "";
  const rows: string[] = [];
  for (let k = 0; k <= last; k++) {
    const mine = ds.filter((d) => d.season === k);
    const open = past.pick === k;
    rows.push(`<li class="${open ? "open" : ""}"><div class="past-row"><span class="past-when">${esc(seasonName(k))}</span>
      <span class="past-text small">${linkNames(short(chron[k] ?? "A quiet season."))}</span>
      <button type="button" data-past-pick="${k}" aria-expanded="${open}">${open ? "Close" : "Go back to this season"}</button></div>
      ${open ? pickPanel(k, mine) : ""}</li>`);
  }
  const ladder = last < 0 ? `<p class="muted">Nothing to go back to yet: the first season has not ended.</p>` : `<ol class="past-ladder">${rows.join("")}</ol>`;
  const bring = `<details class="past-bring"><summary class="small">Bring in a game from elsewhere</summary>
    <p class="small muted">Paste a game copied from the test page (its seed and your choices). It replaces the histories here.</p>
    <textarea id="past-paste" rows="3" aria-label="A copied game"></textarea> <button type="button" data-past-import>Bring it in</button></details>`;
  return `<article class="book past"><h2>Change the past</h2>${intro}<div class="meander" aria-hidden="true"></div>
    ${past.note ? `<p class="past-note" role="status">${esc(past.note)}</p>` : ""}${lines}
    <section><h3>${esc(line.name)}, season by season</h3>${ladder}</section>${bring}</article>`;
}

function pickPanel(k: number, mine: Decision[]): string {
  const radio = (m: Mode, label: string) => `<label class="small"><input type="radio" name="past-mode" value="${m}" ${past.mode === m ? "checked" : ""}> ${label}</label>`;
  const answers = mine.filter((d) => d.kind === "choose" || d.kind === "unanswered");
  const acts = mine.filter((d) => d.kind === "act");
  const answerList = answers.length ? `<ul class="past-choices">${answers.map((d) => {
    const opts = d.alternatives.map((a) => a.blocked ? `<span class="small muted">“${esc(a.label)}” (${esc(a.blocked)})</span>` : `<button type="button" data-past-alt="${d.index}" data-choice="${esc(a.id)}">Instead: ${esc(a.label)}</button>`).join(" ");
    return `<li><span>${linkNames(d.label)}.</span> ${opts || `<span class="small muted">There was no other answer open.</span>`}</li>`;
  }).join("")}</ul>` : `<p class="small muted">You answered no matters this season.</p>`;
  const actList = acts.length ? `<ul class="past-choices">${acts.map((d) => `<li><span>You took the action ${linkNames(d.label)}.</span> <button type="button" data-past-drop="${d.index}">Leave it undone</button></li>`).join("")}</ul>` : "";
  return `<div class="past-pick">
    <p class="small"><b>What you decided in ${esc(seasonName(k))}.</b> Choose one to change.</p>
    ${answerList}${actList}
    <fieldset class="past-mode"><legend class="small">After the change</legend>
      ${radio("kept", "keep everything else I did the same, and show both histories")}
      ${radio("bot", "keep what I did, then let a careful hand play it to the end")}
      ${radio("own", "stop there, and I play on myself")}
    </fieldset>
    <p><button type="button" data-past-again="${k}">Or play the whole of ${esc(seasonName(k))} again yourself</button></p>
  </div>`;
}

function compareView(ia: number, ib: number): string {
  const A = past.lines[ia], B = past.lines[ib];
  const a = gameOf(A.record), b = gameOf(B.record);
  const c: Comparison = compare(a, b);
  const head = (l: Line, i: number) => `<div class="past-head"><span class="label">${i === past.cur ? "Played now" : "History"}</span><h3>${esc(l.name)}</h3>${l.change ? `<p class="small muted">${esc(l.change)}</p>` : ""}</div>`;
  const pair = (x: string, y: string, cls = "") => `<div class="past-pair ${cls}"><div data-side="${esc(A.name)}">${x}</div><div data-side="${esc(B.name)}">${y}</div></div>`;
  if (c.split === null) return `<article class="book past"><h2>Two histories</h2><p class="muted">These two are the same history, season for season.</p><p><button type="button" data-past-back>Back to the seasons</button></p></article>`;
  const before = c.seasons.filter((x) => x.season < c.split!);
  const after = c.seasons.filter((x) => x.season >= c.split!);
  const sameBlock = before.length ? `<details class="past-same"><summary>The same for ${before.length} season${before.length > 1 ? "s" : ""}, ${esc(before[0].name)} to ${esc(before[before.length - 1].name)}</summary>${before.map((x) => `<p class="small"><b>${esc(x.name)}.</b> ${linkNames(x.a ?? "")}</p>`).join("")}</details>` : "";
  const seasons = after.map((x, j) => {
    const mark = j === 0 ? `<p class="past-split" role="note"><span aria-hidden="true">⚔</span> Here the histories part</p>` : "";
    if (x.a === x.b) return `${mark}<div class="past-season"><h4>${esc(x.name)}</h4><p class="small muted">The same in both: ${linkNames(x.a ?? "")}</p></div>`;
    const t = (v: string | null, other: string | null, g: GameState) => (v === null ? `<p class="muted small">${g.over && g.over.season < x.season ? "This history had already ended." : "Not played yet."}</p>` : `<p>${marked(v, other)}</p>`);
    return `${mark}<div class="past-season"><h4>${esc(x.name)}</h4>${pair(t(x.a, x.b, a), t(x.b, x.a, b))}</div>`;
  }).join("");
  const fates = c.fates.length ? `<table class="past-fates"><caption class="small">Who ended where</caption><thead><tr><th scope="col">Person</th><th scope="col">${esc(A.name)}</th><th scope="col">${esc(B.name)}</th></tr></thead><tbody>${c.fates.map((f) => `<tr><th scope="row">${linkNames(f.name)}</th><td>${esc(f.a)}</td><td>${esc(f.b)}</td></tr>`).join("")}</tbody></table>` : `<p class="small muted">Everyone you knew ended in the same place in both.</p>`;
  const luck = (l: Comparison["luck"]["a"]) => (l.rolls ? `${l.rolls} rolls of yours, ${l.failed} failed, the die averaging ${l.mean.toFixed(1)}` : "no rolls of yours");
  const skipped = B.skipped?.length && B.parent === ia ? `<details class="past-skipped"><summary class="small">What you did in ${esc(A.name.toLowerCase())} that no longer fit (${B.skipped.length})</summary><ul>${B.skipped.map((k) => `<li class="small">${esc(seasonName(k.season))}: ${linkNames(capital(k.label))}. ${esc(capital(k.why))}.</li>`).join("")}</ul></details>` : "";
  return `<article class="book past"><h2>Two histories</h2>
    ${pair(head(A, ia), head(B, ib), "heads")}
    <div class="past-verdict">
      <p class="label">The first thing that went differently, in ${esc(seasonName(c.split))}</p>${pair(`<p>${linkNames(c.splitLine.a ?? "Nothing yet.")}</p>`, `<p>${linkNames(c.splitLine.b ?? "Nothing yet.")}</p>`)}
      <p class="label">How each ended</p>${pair(`<p><b>${linkNames(c.endings.a)}</b></p>`, `<p><b>${linkNames(c.endings.b)}</b></p>`)}
      <p class="label">The city at the end</p>${pair(`<p>${esc(c.government.a)}</p>`, `<p>${esc(c.government.b)}</p>`)}
      <p class="label">Your dice after the split</p>${pair(`<p class="small">${luck(c.luck.a)}</p>`, `<p class="small">${luck(c.luck.b)}</p>`)}
      ${fates}${skipped}
    </div>
    <div class="meander" aria-hidden="true"></div>
    <h3>Season by season</h3><p class="small muted">What happened in one history and not in the other is marked.</p>${sameBlock}${seasons}
    <p class="past-btns"><button type="button" data-past-back>Back to the seasons</button> <button type="button" data-past-swap>Swap the sides</button>
      ${ib !== past.cur ? `<button type="button" class="primary" data-past-play="${ib}">Play “${esc(short(B.name, 40))}” on</button>` : ""}</p>
  </article>`;
}

// ---------- Clicks ----------
function branch(d: Decision, choice: string | undefined, label: string) {
  const line = past.lines[past.cur];
  const mode = past.mode;
  const w = rewrite(line.record, choice ? { decision: d, choice } : { decision: d, drop: true }, mode !== "own", mode === "bot" ? "careful" : undefined);
  past.lines.push({ name: label, record: w.record, parent: past.cur, from: d.season, change: `${seasonName(d.season)}: ${choice ? `instead of ${d.label.replace(/^.*?: /, "").replace(/^you chose /, "")}` : `left ${d.label} undone`}`, mode, skipped: w.skipped });
  const ib = past.lines.length - 1;
  past.pick = null;
  past.note = "";
  if (mode === "own") { switchTo(ib); ui.view = "play"; return; }
  games.set(keyOf(w.record), w.game);
  past.pair = [past.cur, ib];
}
function switchTo(i: number) {
  past.cur = i;
  past.pair = null;
  const g = gameOf(past.lines[i].record);
  ui.s = JSON.parse(JSON.stringify(g)); // a fresh copy to play on; the cached one stays as it was
  ui.lastSeen = ui.s!.log.length;
  store();
}
function decisionAt(index: number): Decision | undefined {
  return decisionsOf(past.lines[past.cur].record).find((d) => d.index === index);
}

export const pastHandlers: Handlers = {
  click: {
    "[data-past-pick]": (el, c) => { const k = Number(el.dataset.pastPick); past.pick = past.pick === k ? null : k; c.render(); },
    "[data-past-alt]": (el, c) => {
      const d = decisionAt(Number(el.dataset.pastAlt));
      const alt = d?.alternatives.find((a) => a.id === el.dataset.choice);
      if (!d || !alt) return;
      branch(d, alt.id, capital(alt.label));
      c.save(); c.render(); c.turn(); window.scrollTo({ top: 0 });
    },
    "[data-past-drop]": (el, c) => {
      const d = decisionAt(Number(el.dataset.pastDrop));
      if (!d) return;
      branch(d, undefined, `Without ${d.label.split(" (")[0].toLowerCase()}`);
      c.save(); c.render(); c.turn(); window.scrollTo({ top: 0 });
    },
    "[data-past-again]": (el, c) => {
      const k = Number(el.dataset.pastAgain);
      const line = past.lines[past.cur];
      past.lines.push({ name: `${seasonName(k)}, played again`, record: recordAt(line.record, k), parent: past.cur, from: k, change: `Went back to the start of ${seasonName(k)}`, mode: "own" });
      games.set(keyOf(past.lines[past.lines.length - 1].record), loadAt(line.record, k));
      switchTo(past.lines.length - 1);
      past.pick = null; ui.view = "play"; ui.tab = "season";
      c.save(); c.render(); c.turn(); window.scrollTo({ top: 0 });
    },
    "[data-past-play]": (el, c) => { switchTo(Number(el.dataset.pastPlay)); ui.view = "play"; ui.tab = "season"; c.save(); c.render(); c.turn(); window.scrollTo({ top: 0 }); },
    "[data-past-compare]": (el, c) => { past.pair = [past.cur, Number(el.dataset.pastCompare)]; c.render(); window.scrollTo({ top: 0 }); },
    "[data-past-back]": (_, c) => { past.pair = null; c.render(); },
    "[data-past-swap]": (_, c) => { if (past.pair) past.pair = [past.pair[1], past.pair[0]]; c.render(); },
    "[data-past-import]": (_, c) => {
      const t = (document.getElementById("past-paste") as HTMLTextAreaElement | null)?.value ?? "";
      try {
        const raw = JSON.parse(t);
        const v = raw.game ?? raw;
        if (typeof v.seed !== "number" || !Array.isArray(v.inputs)) throw new Error("no seed or choices");
        const r: Recorded = { seed: v.seed, tuning: v.tuning, scenario: v.scenario === "citadel" ? "citadel" : "island", switches: Array.isArray(v.switches) ? v.switches : [], inputs: v.inputs };
        const g = play(r);
        past.lines = [{ name: "The game you brought", record: recordOf(g) }]; past.cur = 0; past.pick = null; past.pair = null;
        past.note = `Brought in: ${g.over ? "a finished game" : `a game at ${seasonName(g.season)}`}.`;
        ui.s = g; ui.lastSeen = g.log.length;
        store(); c.save(); c.render();
      } catch (e) {
        past.note = `That could not be read as a game (${(e as Error).message}). Paste the whole text that "copy my game" gave you.`;
        c.render();
      }
    },
  },
  change: {
    'input[name="past-mode"]': (el) => { past.mode = (el as HTMLInputElement).value as Mode; },
  },
};

export const pastOnEnding = () => `<p class="past-cta"><button type="button" data-view="past">Change the past: go back to any season and take the other road</button></p>`;
