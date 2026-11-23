// The app shell: the start screen, the page frame (masthead, ledger, views), the character-sheet dialog, and the clicks.
// It only reads the simulation's state and sends it your choices; all rules live in src/core.
import { DATA, PLAYER, defense, endSeason, government, officesOf, playerInfluence, replay, seasonName, startGame, backingFaction, PACKAGES, DEFAULT_TUNING, packageName, switchById } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";
import { howToPlay, tipAttr } from "../views/help.ts";
import { court, sheet } from "../views/people.ts";
import { islandView } from "../views/island.ts";
import { familiesView, paintCensusFaces } from "../views/families.ts";
import { chronicleBook } from "../views/story.ts";
import { esc, ui } from "../lib/text.ts";
import { showSeasonCard, swordOverhead } from "../components/ambient.ts";
import { icon } from "../components/icons.ts";
import { startScreen } from "../views/start.ts";
import * as sound from "../lib/sound.ts";
import { save, load, clearSave } from "./save.ts";
import { play } from "../views/play.ts";
import { listen, type Ctx, type Handlers } from "./clicks.ts";
import { seasonHandlers } from "../views/season.ts";
import { helpHandlers } from "../views/help.ts";
import { ending } from "../views/ending.ts";
import { extraViews, extraHandlers } from "./extras.ts";

const app = document.getElementById("app")!;

// ---------- Start screen ----------
export function splash() {
  const saved = load();
  const seed = Math.floor(Math.random() * 1_000_000);
  closeSheet();
  app.innerHTML = startScreen(saved, seed);
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
  const views: [typeof ui.view, string][] = [["play", "The season"], ...(g.island ? [["island", "The island"] as [typeof ui.view, string]] : []), ["court", "The court"], ...(g.census ? [["families", "The families"] as [typeof ui.view, string]] : []), ["chronicle", "The chronicle"], ...extraViews.map((x) => [x.id, x.label] as [typeof ui.view, string]), ["help", "How to play"]];
  const extra = extraViews.find((x) => x.id === ui.view);
  let body = "";
  if (ui.view === "play") body = play(g);
  else if (ui.view === "court") body = court(g);
  else if (ui.view === "island" && g.island) body = islandView(g);
  else if (ui.view === "families" && g.census) body = familiesView(g);
  else if (ui.view === "chronicle") body = chronicleBook(g);
  else if (extra) body = extra.render(g);
  else body = howToPlay();
  app.innerHTML = `
    ${masthead(g)}
    <nav class="views" aria-label="Views">${views.map(([k, l]) => `<button type="button" data-view="${k}" class="${ui.view === k ? "on" : ""}" ${ui.view === k ? 'aria-current="page"' : ""}>${l}</button>`).join("")}</nav>
    ${ledger(g)}
    ${g.over ? ending(g) + extraViews.map((x) => x.onEnding?.(g) ?? "").join("") : ""}
    ${body}
    <div class="foot small">
      <label><input type="checkbox" id="designer" ${ui.designer ? "checked" : ""}> Designer view: show the moves you can't see in play</label>
      <span class="muted">Seed ${g.seed} · ${esc(packageName(g.tuning))} balance${g.switches?.length ? ` · ${esc(g.switches.map((x) => switchById(x)?.name ?? "").join(", "))}` : ""}</span>
      <button id="restart">New game</button>
    </div>`;
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

// ---------- Clicks ----------
// The frame's own clicks; each screen's are in its file (views/season.ts, views/help.ts).
const endSeasonNow = (c: Ctx) => { endSeason(c.g); ui.openAction = null; ui.args = {}; c.save(); c.render(); c.turn(); window.scrollTo({ top: 0 }); showSeasonCard(c.g); };
const restart = () => { clearSave(); ui.s = null; splash(); };
const frameHandlers: Handlers = {
  click: {
    "#sound": (_, c) => { sound.toggle(c.g); c.render(); },
    "#end": (_, c) => endSeasonNow(c),
    "#end2": (_, c) => endSeasonNow(c),
    "#restart": restart,
    "#again": restart,
    "[data-view]": (b, c) => { ui.view = b.dataset.view as typeof ui.view; c.render(); c.turn(); window.scrollTo({ top: 0 }); },
    "[data-tab]": (b, c) => { ui.tab = b.dataset.tab!; c.render(); },
    "[data-person]": (b, c, e) => { e.preventDefault(); c.openSheet(b.dataset.person!); },
  },
  change: {
    "#designer": (el, c) => { ui.designer = (el as HTMLInputElement).checked; c.save(); c.render(); },
  },
};
listen(app, [frameHandlers, helpHandlers, seasonHandlers, extraHandlers], () => (ui.s ? { g: ui.s, render, save, turn, openSheet } : null));
