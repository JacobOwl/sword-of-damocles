// The browser game. It only reads the simulation's state and sends it your choices; all rules live in src/core.
import {
  DATA, FACTIONS, OFFICES, PLAYER, act, agendaById, band, capital, defense, endSeason, government, influence,
  leaderOf, menu, moodName, officeName, officesOf, others, playerInfluence, plotStrength, power, preview, rankTitle,
  refuseRequest, replay, secondOptions, seasonName, stageName, startGame, backingFaction,
  openEvents, chooseEvent,
  PACKAGES, DEFAULT_TUNING, knobsFor, packageName, SWITCHES, switchById, switchOn,
} from "../src/core/index.ts";
import type { Args, FactionId, GameState, Input, Plot } from "../src/core/index.ts";
import { guide, guideDone, howToPlay, installTips, setGuideDone, tipAttr } from "./help.ts";
import { court, flags, sheet } from "./people.ts";
import { portrait } from "./portraits.ts";
import { chronicleBook, lastSeasonSummary, seasonFeed } from "./story.ts";
import { esc, linkNames, opChip, pr, sign, ui, who } from "./text.ts";

const SAVE_KEY = "sword-of-damocles-save-v1";
const app = document.getElementById("app")!;

// ---------- Saving: the seed and your inputs, replayed on load ----------
function save() {
  const s = ui.s;
  if (!s) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ seed: s.seed, tuning: s.tuning, switches: s.switches ?? [], inputs: s.inputs, designer: ui.designer })); } catch { /* storage may be blocked */ }
}
function load(): { seed: number; tuning?: string; switches?: string[]; inputs: Input[]; designer?: boolean } | null {
  try { const v = localStorage.getItem(SAVE_KEY); return v ? JSON.parse(v) : null; } catch { return null; }
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ } }

// ---------- Start screen ----------
function splash() {
  const saved = load();
  const seed = Math.floor(Math.random() * 1_000_000);
  closeSheet();
  app.innerHTML = `
  <div class="splash">
    <p class="label">Phase 1 prototype · rules v2</p>
    <h1>The Sword of Damocles</h1>
    <p>Autumn, 405 BC. You are Dionysius, a scribe who made himself general with supreme power. The cavalry of the rich families rode home ahead of you, sacked your house and fled to Aetna. Carthage, struck by plague, has made peace. You hold the generalship and the treasury, and you sleep in the naval dockyards. The citadel on the Island is not yet built.</p>
    <p>Each season you take <b>three actions</b> from a fixed menu. The people and factions of Syracuse act on their own, by the same rules. Plots warn you three times before they strike. Hold the city to the summer of 395.</p>
    <div class="row" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
      <label for="tuning" class="small">Balance</label>
      <select id="tuning">${PACKAGES.map((p) => `<option value="${esc(p.id)}"${p.id === DEFAULT_TUNING ? " selected" : ""}>${esc(p.name)}</option>`).join("")}</select>
      <button class="primary" id="new">Begin</button>
      ${saved ? `<button id="resume">Resume your game (${esc(packageName(saved.tuning))} balance)</button>` : ""}
      <details class="seedbox"><summary class="small muted">Choose a seed</summary>
        <label for="seed" class="small">The same seed and the same choices always give the same history.</label>
        <input id="seed" type="number" value="${seed}" style="width:9em">
      </details>
    </div>
    <p class="small" id="tuning-note">${esc(PACKAGES.find((p) => p.id === DEFAULT_TUNING)?.summary)}</p>
    <details class="switches"><summary class="small">Rule switches (all off by default)</summary>
      <p class="small muted">Optional rules to try. Each works with any balance.</p>
      ${SWITCHES.map((w) => `<p class="small"><label><input type="checkbox" class="switch" value="${esc(w.id)}"> <b>${esc(w.name)}.</b> ${esc(w.summary)}</label></p>`).join("")}
    </details>
    <p class="small muted">The people and the situation come from Diodorus, Plutarch and others; each real person's sheet quotes the passages. Everything else, including every rule and number, is invention.</p>
  </div>`;
  document.getElementById("new")!.onclick = () => {
    const v = Number((document.getElementById("seed") as HTMLInputElement).value) || seed;
    const switches = [...document.querySelectorAll<HTMLInputElement>("input.switch")].filter((x) => x.checked).map((x) => x.value);
    ui.s = startGame(v, (document.getElementById("tuning") as HTMLSelectElement).value, { switches }); ui.lastSeen = 0; ui.view = "play"; ui.tab = "season"; save(); render();
  };
  const sel = document.getElementById("tuning") as HTMLSelectElement;
  sel.onchange = () => { document.getElementById("tuning-note")!.textContent = PACKAGES.find((p) => p.id === sel.value)?.summary ?? ""; };
  const r = document.getElementById("resume");
  if (r && saved) r.onclick = () => { ui.s = replay(saved.seed, saved.inputs, PACKAGES.some((p) => p.id === saved.tuning) ? saved.tuning : DEFAULT_TUNING, { switches: (saved.switches ?? []).filter((x) => switchById(x)) }); ui.designer = !!saved.designer; render(); };
}

// ---------- Main screen ----------
function render() {
  const g = ui.s;
  if (!g) return splash();
  const views: [typeof ui.view, string][] = [["play", "The season"], ["court", "The court"], ["chronicle", "The chronicle"], ["help", "How to play"]];
  let body = "";
  if (ui.view === "play") body = play(g);
  else if (ui.view === "court") body = court(g);
  else if (ui.view === "chronicle") body = chronicleBook(g);
  else body = howToPlay();
  app.innerHTML = `
    ${masthead(g)}
    <nav class="views" aria-label="Views">${views.map(([k, l]) => `<button type="button" data-view="${k}" class="${ui.view === k ? "on" : ""}" ${ui.view === k ? 'aria-current="page"' : ""}>${l}</button>`).join("")}</nav>
    ${ledger(g)}
    ${g.over ? ending(g) : ""}
    ${body}
    <div class="foot small">
      <label><input type="checkbox" id="designer" ${ui.designer ? "checked" : ""}> Designer view: show the moves you can't see in play</label>
      <span class="muted">Seed ${g.seed} · ${esc(packageName(g.tuning))} balance${g.switches?.length ? ` · ${esc(g.switches.map((x) => switchById(x)?.name ?? "").join(", "))}` : ""}</span>
      <button id="restart">New game</button>
    </div>`;
  wire(g);
  ui.lastSeen = g.log.length;
  if (ui.sheet) openSheet(ui.sheet, false);
}

function play(g: GameState) {
  const tabs: [string, string][] = [["city", "The city"], ["season", "This season"], ["dangers", "Dangers"]];
  const alerts = g.plots.filter((p) => p.stage >= 1).length + others(g).filter((p) => (p.rival || p.political) && p.status !== "dead").length;
  return `<nav class="tabs" aria-label="Sections">
      ${tabs.map(([k, l]) => `<button data-tab="${k}" class="${ui.tab === k ? "on" : ""}">${l}${k === "dangers" && alerts ? ` <span class="count">${alerts}</span>` : ""}</button>`).join("")}
    </nav>
    <div class="cols">
      <section class="${ui.tab === "city" ? "on" : ""}" data-col="city">${cityCol(g)}</section>
      <section class="${ui.tab === "season" ? "on" : ""}" data-col="season">${seasonCol(g)}</section>
      <section class="${ui.tab === "dangers" ? "on" : ""}" data-col="dangers">${dangersCol(g)}</section>
    </div>`;
}

function masthead(g: GameState) {
  const slots = DATA.start.actionsPerSeason;
  return `<header class="mast">
    <h1>The Sword of Damocles</h1>
    <span class="when">${esc(seasonName(g.over ? g.over.season : g.season))}</span>
    <span class="muted small">Season ${Math.min(g.season + 1, DATA.start.seasons)} of ${DATA.start.seasons}</span>
    <span class="grow"></span>
    ${g.over ? "" : `<span class="label" ${tipAttr("actions")}>Actions</span><span class="slots" aria-label="${g.slots} actions left">${Array.from({ length: slots }, (_, i) => `<i class="slot ${i < g.slots ? "full" : ""}"></i>`).join("")}</span>
    <button class="primary" id="end">End the season</button>`}
  </header>`;
}

function ledger(g: GameState) {
  const d = defense(g);
  const guardPay = g.guard.arrearsSeasons ? `<span class="warn">owed ${g.guard.owed}, won't defend you</span>` : g.factions.guard.mood <= 1 ? `<span class="warn">paid, but too angry to defend you</span>` : g.guard.refusing ? `<span class="warn">refusing duty</span>` : g.plots.some((p) => p.guardBacking) ? `<span class="warn">sold to a plot</span>` : `<span class="good">paid, at your door</span>`;
  const bf = backingFaction(g);
  const L = (k: string, t: string) => `<span class="label tipped" ${tipAttr(k)}>${t}</span>`;
  return `<div class="ledger">
    <div>${L("silver", "Silver")}<span class="v">${g.silver} <small>talents</small></span></div>
    <div>${L("grain", "Grain")}<span class="v ${g.grain < 3 ? "warn" : ""}">${g.grain} <small>months</small></span></div>
    <div>${L("carthage", "Carthage")}<span class="clock">${Array.from({ length: 10 }, (_, i) => `<i class="${i < g.clock ? "on" : ""}"></i>`).join("")}</span><span class="small muted">${g.clock} of 10</span></div>
    <div>${L("land", "Land to give")}<span class="v">${g.land}</span></div>
    <div>${L("guard", "The guard")}<span class="v">${g.guard.strength} <small>strong, ${guardPay}</small></span></div>
    <div>${L("defense", "Your defense")}<span class="v">${d.total}</span><span class="small muted">${esc(d.parts.map((p) => `${p.value} ${p.label}`).join(" + "))}</span></div>
    <div>${L("influence", "Your influence")}<span class="v">${playerInfluence(g)}</span><span class="small muted">${officesOf(g, PLAYER).length} offices${bf ? `, backed by ${esc(g.factions[bf].short)}` : ", no faction backs you"}</span></div>
    <div>${L("government", "Government")}<span class="v gov">${esc(government(g))}</span></div>
  </div>`;
}

function ending(g: GameState) {
  const o = g.over!;
  const title = { killed: "You are dead", exiled: "Exile", deposed: "Deposed", fallen: "The city falls", survived: "You held Syracuse", fled: "Flight", abdicated: "You stepped down" }[o.reason] ?? "The end";
  return `<div class="ending">
    <h2>${esc(title)}</h2>
    <p>${linkNames(o.text)}</p>
    <p class="small muted">${esc(seasonName(o.season))}. Plots against you: ${g.counters.plots ?? 0}. Enemies made: ${g.counters.rivals ?? 0}. Political rivals: ${g.counters.politicalRivals ?? 0}. Seasons as tyrant: ${g.counters.tyrantSeasons ?? 0}.</p>
    <p><button class="primary" id="again">Play again</button> <button type="button" data-view="chronicle">Read the chronicle of your rule</button></p>
  </div>`;
}

// ---------- The city ----------
function cityCol(g: GameState) {
  const offices = OFFICES.map((o) => {
    const h = g.offices[o];
    const text = o === "citadel" && !g.citadelBuilt ? `<span class="muted">not yet built${g.building?.what === "citadel" ? " (work has begun)" : ""}</span>` : h ? (h === PLAYER ? "<b>You</b>" : who(h)) : `<span class="muted">empty</span>`;
    const eff = DATA.offices.find((x) => x.id === o)!.effect;
    return `<dt>${esc(capital(officeName(o).replace(/^the /, "")))}</dt><dd>${text}<div class="small muted">${esc(eff)}</div></dd>`;
  }).join("");
  const facs = FACTIONS.map((f) => faction(g, f)).join("");
  const laws = g.laws.length ? `<p class="small">Laws in force: ${g.laws.map((l) => esc(DATA.laws.find((x) => x.id === l)!.name)).join("; ")}.</p>` : "";
  const extra = [g.granary ? "a granary" : "", g.walls ? "new walls" : "", g.factions.citizens.disarmed ? "the citizens are disarmed" : ""].filter(Boolean);
  return `<div><h2>The six offices</h2><dl class="offices">${offices}</dl>${laws}${extra.length ? `<p class="small">The city has ${extra.join(", ")}.</p>` : ""}</div>
    <div><h2>The factions</h2>${facs}</div>`;
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
  return `<div class="faction">
    <div class="fhead"><h3>${esc(fa.name)}</h3><span><span class="num">${pow}</span> <span class="band ${b} tipped" ${tipAttr("power")}>${b}</span></span></div>
    <div class="powerbar" aria-hidden="true">${bar}</div>
    <div class="small">Mood: <span class="mood mood-${fa.mood} tipped" ${tipAttr("mood")}>${moodName(fa.mood)}</span>${lead ? ` · Led by ${who(lead.id)}` : ""}${fa.backing ? ` · <span class="warn">backs a plot</span>` : ""}</div>
    <div class="small">Wants: ${esc(goal)}</div>
    <div class="small">Agenda: <i class="tipped" ${tipAttr("agenda")}>${esc(ag.name)}</i>${fa.agenda.done ? ` <span class="muted">(done${fa.agenda.result ? `, ${esc(fa.agenda.result)}` : ""})</span>` : ""}</div>
    <div class="steps">${ag.steps.map((st, i) => `<span class="${i < fa.agenda.step || fa.agenda.done ? "done" : ""}">${esc(st)}</span>`).join("")}</div>
    ${fa.agenda.done ? "" : `<div class="small muted">When complete: ${esc(ag.completes)}</div>`}
  </div>`;
}

// ---------- This season ----------
function seasonCol(g: GameState) {
  const season = g.over ? g.over.season : g.season;
  const f = seasonFeed(g, season);
  return `${!guideDone() && !g.over ? guide() : ""}
    ${lastSeasonSummary(g)}
    <div><h2>${esc(seasonName(season))}</h2>${f.empty ? `<p class="muted">Nothing has happened yet.</p>` : f.groups + f.shifts}</div>
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
    ${evs.map((ev) => `<div class="matter">
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
      return `<div class="req">${portrait(p.id, "s")}<span class="t">${who(p.id)} ${esc(what)}. <span class="small">${opChip(p.opinion, true)}</span>${r.owed ? ` <i>You owe ${P.him} a favour.</i>` : ""} ${risk}</span>
        <span class="req-btns"><button data-grant="${r.id}" ${pv?.ok ? "" : "disabled"}>Grant</button>
        <button data-refuse="${r.id}">Refuse</button></span>
        ${pv && !pv.ok ? `<span class="small muted">Can't grant: ${esc(pv.why)}</span>` : ""}</div>`;
    }).join("")}</div>`;
}

function grantArgs(g: GameState, r: GameState["requests"][number]): { a: string; args: Args } | null {
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
    ${areas.map((area) => `<div class="area"><span class="label">${esc(area)}</span>
      ${items.filter((i) => i.area === area).map((i) => `
        <button class="act ${ui.openAction === i.id ? "open" : ""} ${i.blocked ? "off" : ""}" data-act="${i.id}" aria-expanded="${ui.openAction === i.id}">
          <span>${esc(i.name)}${i.reach ? ` <span class="tag" data-tip="reach">reach</span>` : ""}</span><span class="c">${esc(i.blocked ?? i.cost)}</span>
        </button>
        ${ui.openAction === i.id ? panel(g, i) : ""}`).join("")}
    </div>`).join("")}
    <p style="margin-top:14px"><button class="primary" id="end2">End the season</button> <span class="small muted">${g.slots} action${g.slots === 1 ? "" : "s"} left.</span></p></div>`;
}

function panel(g: GameState, i: ReturnType<typeof menu>[number]) {
  const args = ui.args;
  const seconds = secondOptions(g, i.id, args);
  const pv = preview(g, i.id, args);
  let odds = "";
  if (pv.ok && pv.auto) odds = `<span class="good">Certain: no roll.</span>`;
  else if (pv.ok) {
    const pct = Math.round((pv.chance ?? 0) * 100);
    odds = `<span class="chance-bar" aria-hidden="true"><i style="width:${pct}%"></i></span> <span class="chance">${pct}%</span> chance. Needs <span class="need">${pv.need}+</span> on one die${pv.mods.length ? `, with ${pv.mods.map((m) => `${esc(m.label)} ${sign(m.value)}`).join(", ")}` : ", no modifiers"}.`;
  } else odds = `<span class="muted">${esc(capital(pv.why ?? ""))}.</span>`;
  const target = args.target && g.people[args.target] ? g.people[args.target] : null;
  return `<div class="panel">
    <div class="small"><b>Cost:</b> ${esc(i.cost)}. <b>Roll:</b> ${esc(i.roll)}.</div>
    <div class="small"><b>If it works:</b> ${esc(i.success)}${i.failure ? ` <b>If not:</b> ${esc(i.failure)}` : ""}</div>
    ${i.targets || seconds.length ? `<div class="row">
      ${i.targets ? `<label class="label" for="t-${i.id}">Target</label><select id="t-${i.id}" data-arg="target"><option value="">Choose…</option>${i.targets.map((o) => `<option value="${esc(o.value)}" ${args.target === o.value ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select>` : ""}
      ${seconds.length ? `<label class="label" for="s-${i.id}">${esc(i.secondLabel ?? "Option")}</label><select id="s-${i.id}" data-arg="second"><option value="">Choose…</option>${seconds.map((o) => `<option value="${esc(o.value)}" ${args.second === o.value ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select>` : ""}
    </div>` : ""}
    ${target ? `<div class="small target-line">${portrait(target.id, "s")} ${who(target.id)} ${opChip(target.opinion, true)} ${flags(g, target)}</div>` : ""}
    <div class="odds">${odds}</div>
    <div class="row"><button class="primary" id="do" ${pv.ok ? "" : "disabled"}>${esc(i.name)}</button><button id="cancel">Cancel</button></div>
  </div>`;
}

// ---------- Dangers: plots, rivals, and who is who ----------
function dangersCol(g: GameState) {
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
      return `<div class="area"><span class="label">${esc(g.factions[f].name)}</span>${ps.map((p) => {
        const offs = officesOf(g, p.id);
        return `<button type="button" class="row-person" data-person="${esc(p.id)}">${portrait(p.id, "s")}<span class="nm">${esc(capital(p.name))}${offs.length ? ` <span class="tag">${esc(offs.map((o) => capital(officeName(o).replace(/^the /, ""))).join(", "))}</span>` : ""}${p.status !== "free" ? ` <span class="tag">${p.status === "held" ? "in prison" : "outside"}</span>` : ""} ${flags(g, p)}</span>${opChip(p.opinion)}</button>`;
      }).join("")}</div>`;
    }).join("")}
    <p class="small"><button type="button" data-view="court">Open the court</button></p></div>`;
}

// ---------- Character sheet dialog ----------
let dialog: HTMLDialogElement | null = null;
function openSheet(id: string, focus = true) {
  const g = ui.s!;
  if (!g.people[id]) return;
  ui.sheet = id;
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.className = "sheet";
    dialog.setAttribute("aria-labelledby", "sheet-title");
    document.body.appendChild(dialog);
    dialog.addEventListener("close", () => { ui.sheet = null; });
    dialog.addEventListener("click", (e) => {
      const t = e.target as HTMLElement;
      if (t === dialog || t.closest("#sheet-close")) { closeSheet(); return; }
      const person = t.closest<HTMLElement>("[data-person]");
      if (person) { openSheet(person.dataset.person!); return; }
      const a = t.closest<HTMLElement>("[data-sheet-act]");
      if (a) {
        closeSheet();
        ui.view = "play"; ui.tab = "season"; ui.openAction = a.dataset.sheetAct!; ui.args = { target: a.dataset.target };
        render();
        document.querySelector(`[data-act="${ui.openAction}"]`)?.scrollIntoView({ block: "center" });
      }
    });
  }
  dialog.innerHTML = sheet(g, id);
  if (!dialog.open) dialog.showModal();
  if (focus) (dialog.querySelector("#sheet-close") as HTMLElement | null)?.focus();
  dialog.scrollTop = 0;
}
function closeSheet() { ui.sheet = null; if (dialog?.open) dialog.close(); }

// ---------- Events ----------
function wire(g: GameState) {
  for (const id of ["end", "end2"]) document.getElementById(id)?.addEventListener("click", () => { endSeason(g); ui.openAction = null; ui.args = {}; save(); render(); window.scrollTo({ top: 0 }); });
  document.getElementById("restart")?.addEventListener("click", () => { clearSave(); ui.s = null; splash(); });
  document.getElementById("again")?.addEventListener("click", () => { clearSave(); ui.s = null; splash(); });
  document.getElementById("designer")?.addEventListener("change", (e) => { ui.designer = (e.target as HTMLInputElement).checked; save(); render(); });
  document.getElementById("guide-done")?.addEventListener("click", () => { setGuideDone(true); render(); });
  document.getElementById("guide-again")?.addEventListener("click", () => { setGuideDone(false); ui.view = "play"; ui.tab = "season"; render(); window.scrollTo({ top: 0 }); });
  app.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((b) => (b.onclick = () => { ui.view = b.dataset.view as typeof ui.view; render(); window.scrollTo({ top: 0 }); }));
  app.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((b) => (b.onclick = () => { ui.tab = b.dataset.tab!; render(); }));
  app.querySelectorAll<HTMLElement>("[data-person]").forEach((b) => (b.onclick = (e) => { e.preventDefault(); openSheet(b.dataset.person!); }));
  app.querySelectorAll<HTMLButtonElement>("[data-act]").forEach((b) => (b.onclick = () => {
    const id = b.dataset.act!;
    ui.openAction = ui.openAction === id ? null : id; ui.args = {};
    const item = menu(g).find((m) => m.id === id);
    if (item?.targets?.length === 1) ui.args.target = item.targets[0].value;
    render();
    document.querySelector(`[data-act="${id}"]`)?.scrollIntoView({ block: "nearest" });
  }));
  app.querySelectorAll<HTMLSelectElement>("[data-arg]").forEach((sel) => (sel.onchange = () => {
    const k = sel.dataset.arg as keyof Args;
    ui.args = { ...ui.args, [k]: sel.value || undefined };
    if (k === "target") ui.args.second = undefined;
    render();
    (document.getElementById(sel.id) as HTMLElement | null)?.focus();
  }));
  document.getElementById("do")?.addEventListener("click", () => {
    if (!ui.openAction) return;
    act(g, ui.openAction, ui.args); ui.openAction = null; ui.args = {}; save(); render();
  });
  document.getElementById("cancel")?.addEventListener("click", () => { ui.openAction = null; ui.args = {}; render(); });
  app.querySelectorAll<HTMLButtonElement>("[data-grant]").forEach((b) => (b.onclick = () => {
    const r = g.requests.find((x) => x.id === b.dataset.grant);
    const ga = r && grantArgs(g, r);
    if (ga) { act(g, ga.a, ga.args); save(); render(); }
  }));
  app.querySelectorAll<HTMLButtonElement>("[data-choose]").forEach((b) => (b.onclick = () => { chooseEvent(g, b.dataset.choose!, b.dataset.choice!); save(); render(); }));
  app.querySelectorAll<HTMLButtonElement>("[data-refuse]").forEach((b) => (b.onclick = () => { refuseRequest(g, b.dataset.refuse!); save(); render(); }));
}

installTips();
splash();
