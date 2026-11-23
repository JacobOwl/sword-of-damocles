// The app shell: the start screen, the page frame (masthead, ledger, views), the character-sheet dialog, and the clicks.
// It only reads the simulation's state and sends it your choices; all rules live in src/core.
import { DATA, PLAYER, act, defense, endSeason, government, menu, officesOf, playerInfluence, refuseRequest, replay, seasonName, startGame, backingFaction, chooseEvent, PACKAGES, DEFAULT_TUNING, packageName, SWITCHES, switchById } from "../../src/core/index.ts";
import type { Args, GameState } from "../../src/core/index.ts";
import { howToPlay, setGuideDone, tipAttr } from "../views/help.ts";
import { court, sheet } from "../views/people.ts";
import { islandView } from "../views/island.ts";
import { familiesView, paintCensusFaces } from "../views/families.ts";
import { chronicleBook } from "../views/story.ts";
import { esc, ui } from "../lib/text.ts";
import { showSeasonCard, swordOverhead } from "../components/ambient.ts";
import { icon } from "../components/icons.ts";
import { titlePage } from "../views/title.ts";
import * as sound from "../lib/sound.ts";
import { save, load, clearSave } from "./save.ts";
import { grantArgs } from "../views/season.ts";
import { play } from "../views/play.ts";
import { ending } from "../views/ending.ts";

const app = document.getElementById("app")!;

// ---------- Start screen ----------
export function splash() {
  const saved = load();
  const seed = Math.floor(Math.random() * 1_000_000);
  closeSheet();
  const intro = `<p>Autumn, 405 BC. You are Dionysius, a scribe who made himself general with supreme power. The cavalry of the rich families rode home ahead of you, sacked your house and fled to Aetna. Carthage, struck by plague, has made peace. You hold the generalship and the treasury, and you sleep in the naval dockyards. The citadel on the Island is not yet built.</p>
    <p>Each season you take <b>three actions</b> from a fixed menu. The people and factions of Syracuse act on their own, by the same rules. Plots warn you three times before they strike. Hold the city to the summer of 395.</p>`;
  const begin = `<div class="begin">
      <div class="begin-options">
        <label for="tuning" class="label">Balance</label>
        <select id="tuning">${PACKAGES.map((p) => `<option value="${esc(p.id)}"${p.id === DEFAULT_TUNING ? " selected" : ""}>${esc(p.name)}</option>`).join("")}</select>
        <label for="scenario" class="label">Game</label>
        <select id="scenario"><option value="island" selected>The island: Syracuse, Sicily and Carthage (Phase 2)</option><option value="citadel">The citadel: Syracuse alone (Phase 1)</option></select>
      </div>
      <p class="small note" id="tuning-note">${esc(PACKAGES.find((p) => p.id === DEFAULT_TUNING)?.summary)}</p>
      <div class="begin-options">
        <button class="primary" id="new">Begin</button>
        ${saved ? `<button id="resume">Resume your game (${esc(packageName(saved.tuning))} balance)</button>` : ""}
      </div>
      <details class="seedbox"><summary class="small muted">Choose a seed</summary>
        <label for="seed" class="small">The same seed and the same choices always give the same history.</label>
        <input id="seed" type="number" value="${seed}" style="width:9em">
      </details>
      <details class="switches"><summary class="small">Rule switches (all off by default)</summary>
        <p class="small muted">Optional rules to try. Each works with any balance.</p>
        ${SWITCHES.map((w) => `<p class="small"><label><input type="checkbox" class="switch" value="${esc(w.id)}"> <b>${esc(w.name)}.</b> ${esc(w.summary)}</label></p>`).join("")}
      </details>
      <p class="small muted note">Prototype: Phase 2, the island, built on rules v2. The people and the situation come from Diodorus, Plutarch and others; each real person's sheet quotes the passages. Everything else, including every rule, number and picture, is invention.</p>
    </div>`;
  app.innerHTML = titlePage(begin, intro);
  document.getElementById("new")!.onclick = () => {
    const v = Number((document.getElementById("seed") as HTMLInputElement).value) || seed;
    const scenario = (document.getElementById("scenario") as HTMLSelectElement).value === "citadel" ? "citadel" : "island";
    const switches = [...document.querySelectorAll<HTMLInputElement>("input.switch")].filter((x) => x.checked).map((x) => x.value);
    endedSound = false; ui.s = startGame(v, (document.getElementById("tuning") as HTMLSelectElement).value, { scenario, switches }); ui.lastSeen = 0; ui.view = "play"; ui.tab = "season"; save(); render(); showSeasonCard(ui.s);
  };
  const sel = document.getElementById("tuning") as HTMLSelectElement;
  sel.onchange = () => { document.getElementById("tuning-note")!.textContent = PACKAGES.find((p) => p.id === sel.value)?.summary ?? ""; };
  const r = document.getElementById("resume");
  if (r && saved) r.onclick = () => { ui.s = replay(saved.seed, saved.inputs, PACKAGES.some((p) => p.id === saved.tuning) ? saved.tuning : DEFAULT_TUNING, { scenario: saved.scenario === "island" ? "island" : "citadel", switches: (saved.switches ?? []).filter((x) => switchById(x)) }); ui.designer = !!saved.designer; render(); };
}

// ---------- Main screen ----------
let endedSound = false;
export function render() {
  const g = ui.s;
  if (!g) return splash();
  const views: [typeof ui.view, string][] = [["play", "The season"], ...(g.island ? [["island", "The island"] as [typeof ui.view, string]] : []), ["court", "The court"], ...(g.census ? [["families", "The families"] as [typeof ui.view, string]] : []), ["chronicle", "The chronicle"], ["help", "How to play"]];
  let body = "";
  if (ui.view === "play") body = play(g);
  else if (ui.view === "court") body = court(g);
  else if (ui.view === "island" && g.island) body = islandView(g);
  else if (ui.view === "families" && g.census) body = familiesView(g);
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
  paintCensusFaces(g); // the invented families' portraits, laid in tiles while the page is idle
  sound.update(g);
  if (g.over && !endedSound) { endedSound = true; sound.ending(g.over.reason); }
  ui.lastSeen = g.log.length;
  if (ui.sheet) openSheet(ui.sheet, false);
}

function masthead(g: GameState) {
  const slots = DATA.start.actionsPerSeason;
  return `<header class="mast">
    <h1>${swordOverhead(g)}<span>The Sword <span class="of">of</span> Damocles</span></h1>
    <span class="when">${esc(seasonName(g.over ? g.over.season : g.season))}</span>
    <span class="muted small">Season ${Math.min(g.season + 1, DATA.start.seasons)} of ${DATA.start.seasons}</span>
    <span class="grow"></span>
    <button type="button" id="sound" class="sound-btn" aria-pressed="${sound.soundOn()}" data-tip="${sound.soundOn() ? "Sound is on: a lyre each season, the harbour, a drone while a plot has a name. Click to turn it off." : "Sound is off. Click to hear a lyre each season, the harbour, and a drone while a plot has a name."}">${icon(sound.soundOn() ? "lyre" : "mute")}<span class="sr">${sound.soundOn() ? "Sound on" : "Sound off"}</span></button>
    ${g.over ? "" : `<span class="label" ${tipAttr("actions")}>Actions</span><span class="slots" aria-label="${g.slots} actions left">${Array.from({ length: slots }, (_, i) => `<i class="slot ${i < g.slots ? "full" : ""}"></i>`).join("")}</span>
    <button class="primary" id="end">End the season</button>`}
  </header><div class="meander mast-rule" aria-hidden="true"></div>`;
}

function ledger(g: GameState) {
  const d = defense(g);
  const guardPay = g.guard.arrearsSeasons ? `<span class="warn">owed ${g.guard.owed}, won't defend you</span>` : g.factions.guard.mood <= 1 ? `<span class="warn">paid, but too angry to defend you</span>` : g.guard.refusing ? `<span class="warn">refusing duty</span>` : g.plots.some((p) => p.guardBacking) ? `<span class="warn">sold to a plot</span>` : `<span class="good">paid, at your door</span>`;
  const bf = backingFaction(g);
  const MARK: Record<string, string> = { silver: "silver", grain: "grain", carthage: "palm", land: "land", guard: "helmet", defense: "defense", influence: "influence", government: "city" };
  const L = (k: string, t: string) => `<span class="label tipped" ${tipAttr(k)}>${icon(MARK[k], k === "carthage" ? "f-carthage" : "")}${t}</span>`;
  return `<div class="ledger">
    <div>${L("silver", "Silver")}<span class="v">${g.silver} <small>talents</small></span></div>
    <div>${L("grain", "Grain")}<span class="v ${g.grain < 3 ? "warn" : ""}">${g.grain} <small>months</small></span></div>
    <div>${g.island ? L("anger", "Carthage's anger") : L("carthage", "Carthage")}<span class="clock">${Array.from({ length: 10 }, (_, i) => `<i class="${i < g.clock ? "on" : ""}"></i>`).join("")}</span><span class="small muted">${g.clock} of 10</span></div>
    <div>${L("land", "Land to give")}<span class="v">${g.land}</span></div>
    <div>${L("guard", "The guard")}<span class="v">${g.guard.strength} <small>strong, ${guardPay}</small></span></div>
    <div>${L("defense", "Your defense")}<span class="v">${d.total}</span><span class="small muted">${esc(d.parts.map((p) => `${p.value} ${p.label}`).join(" + "))}</span></div>
    <div>${L("influence", "Your influence")}<span class="v">${playerInfluence(g)}</span><span class="small muted">${officesOf(g, PLAYER).length} offices${bf ? `, backed by ${esc(g.factions[bf].short)}` : ", no faction backs you"}</span></div>
    <div>${L("government", "Government")}<span class="v gov">${esc(government(g))}</span></div>
  </div><div class="meander ledger-rule" aria-hidden="true"></div>`;
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

// A page-turn when the view or the season changes (CSS turns it off for reduced motion).
function turn() { app.classList.remove("turn"); void app.offsetWidth; app.classList.add("turn"); }

// ---------- Events ----------
function wire(g: GameState) {
  document.getElementById("sound")?.addEventListener("click", () => { sound.toggle(g); render(); });
  for (const id of ["end", "end2"]) document.getElementById(id)?.addEventListener("click", () => { endSeason(g); ui.openAction = null; ui.args = {}; save(); render(); turn(); window.scrollTo({ top: 0 }); showSeasonCard(g); });
  document.getElementById("restart")?.addEventListener("click", () => { clearSave(); ui.s = null; splash(); });
  document.getElementById("again")?.addEventListener("click", () => { clearSave(); ui.s = null; splash(); });
  document.getElementById("designer")?.addEventListener("change", (e) => { ui.designer = (e.target as HTMLInputElement).checked; save(); render(); });
  document.getElementById("guide-done")?.addEventListener("click", () => { setGuideDone(true); render(); });
  document.getElementById("guide-again")?.addEventListener("click", () => { setGuideDone(false); ui.view = "play"; ui.tab = "season"; render(); window.scrollTo({ top: 0 }); });
  app.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((b) => (b.onclick = () => { ui.view = b.dataset.view as typeof ui.view; render(); turn(); window.scrollTo({ top: 0 }); }));
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
    act(g, ui.openAction, ui.args); sound.tick(); ui.openAction = null; ui.args = {}; save(); render();
  });
  document.getElementById("cancel")?.addEventListener("click", () => { ui.openAction = null; ui.args = {}; render(); });
  app.querySelectorAll<HTMLButtonElement>("[data-grant]").forEach((b) => (b.onclick = () => {
    const r = g.requests.find((x) => x.id === b.dataset.grant);
    const ga = r && grantArgs(g, r);
    if (ga) { act(g, ga.a, ga.args); sound.tick(); save(); render(); }
  }));
  app.querySelectorAll<HTMLButtonElement>("[data-choose]").forEach((b) => (b.onclick = () => { chooseEvent(g, b.dataset.choose!, b.dataset.choice!); sound.tick(); save(); render(); }));
  app.querySelectorAll<HTMLButtonElement>("[data-refuse]").forEach((b) => (b.onclick = () => { refuseRequest(g, b.dataset.refuse!); save(); render(); }));
}
