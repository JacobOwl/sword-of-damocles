// The start screen: the title page, the story so far, and the choices before a game.
// The first choice is a ready-made setup (data/presets.json), listed first and marked recommended; the second is
// to set it up yourself (balance, game, rule switches). Its buttons are wired by the shell (ui/app/shell.ts).
import { DEFAULT_TUNING, PACKAGES, PRESETS, SWITCHES, packageName, presetById, switchById } from "../../src/core/index.ts";
import type { PresetDef } from "../../src/core/index.ts";
import { esc } from "../lib/text.ts";
import { titlePage } from "./title.ts";
// Workshop switches (the bets of docs/council/2026-11-23-two-day-plan.md) show only on a Workshop build, ticked
// beside each preset: a Workshop page's entry file sets them (ui/works-main.ts). The test link never shows them.
const workshopIds = (): string[] => (globalThis as any).__WORKSHOP ?? [];
const offered = (): string[] => (globalThis as any).__WORKSHOP_OFFER ?? []; // shown on a Workshop page, but left unticked
const shown = (w: { id: string; workshop?: boolean }) => !w.workshop || workshopIds().includes(w.id) || offered().includes(w.id);

// One plain line naming what a preset turns on.
export function presetRules(p: PresetDef) {
  const sw = p.switches.map((id) => switchById(id)?.name ?? id);
  return `${packageName(p.tuning)} balance; ${sw.length ? sw.join(", ") : "no rule switches"}.`;
}

// Switches a thread marks "besidePreset" are offered as unticked boxes beside a preset, not inside it.
const extras = () => SWITCHES.filter((w) => ((w as { besidePreset?: boolean }).besidePreset && shown(w)) || workshopIds().includes(w.id) || offered().includes(w.id));

function presetCard(p: PresetDef, checked: boolean) {
  const ex = extras().filter((w) => !p.switches.includes(w.id));
  return `<label class="setup">
      <input type="radio" name="setup" value="${esc(p.id)}"${checked ? " checked" : ""}>
      <span><b>${esc(p.name)}</b>${p.recommended ? ` <span class="tag rec">recommended</span>` : ""}
      <span class="small">${esc(p.summary)}</span></span>
    </label>
    ${ex.length ? `<div class="setup-extra">${ex.map((w) => `<p class="small"><label><input type="checkbox" class="extra" value="${esc(w.id)}"${workshopIds().includes(w.id) ? " checked" : ""}> <span class="tag new">new</span> <b>${esc(w.name)}.</b> ${esc(w.summary)}</label></p>`).join("")}</div>` : ""}
    <details class="watch"><summary class="small">What to watch for, and the rules on</summary>
      <p class="small muted">Rules on: ${esc(presetRules(p))}</p>
      <ul class="small">${p.watch.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
      <p class="small muted">${p.checkIns?.length ? `At seasons ${p.checkIns.join(" and ")} the game checks in with two short questions. ` : ""}At the end of season ${p.verdictSeason} the game asks for your verdict. Your answers stay in the game, and "Copy my game" at the foot of the page copies them with your moves.</p>
    </details>`;
}

export function startScreen(saved: { tuning?: string; preset?: string } | null, seed: number) {
  const intro = `<p>Autumn, 405 BC. You are Dionysius, a scribe who made himself general with supreme power. The cavalry of the rich families rode home ahead of you, sacked your house and fled to Aetna. Carthage, struck by plague, has made peace. You hold the generalship and the treasury, and you sleep in the naval dockyards. The citadel on the Island is not yet built.</p>
    <p>Each season you take <b>three actions</b> from a fixed menu. The people and factions of Syracuse act on their own, by the same rules. Plots warn you three times before they strike. Hold the city to the summer of 395.</p>`;
  const first = PRESETS.find((p) => p.recommended) ?? PRESETS[0];
  const savedName = saved ? (saved.preset ? presetById(saved.preset)?.name : `${packageName(saved.tuning)} balance`) : "";
  const begin = `<div class="begin">
      <fieldset class="setups"><legend class="label">How to play</legend>
        ${PRESETS.map((p) => presetCard(p, p === first)).join("")}
        <label class="setup">
          <input type="radio" name="setup" value="custom"${first ? "" : " checked"}>
          <span><b>Set it up yourself</b> <span class="small">Choose the game, the balance and any rule switches.</span></span>
        </label>
        <div class="custom">
          <div class="begin-options">
            <label for="tuning" class="label">Balance</label>
            <select id="tuning">${PACKAGES.map((p) => `<option value="${esc(p.id)}"${p.id === DEFAULT_TUNING ? " selected" : ""}>${esc(p.name)}</option>`).join("")}</select>
            <label for="scenario" class="label">Game</label>
            <select id="scenario"><option value="island" selected>The island: Syracuse, Sicily and Carthage (Phase 2)</option><option value="citadel">The citadel: Syracuse alone (Phase 1)</option></select>
          </div>
          <p class="small note" id="tuning-note">${esc(PACKAGES.find((p) => p.id === DEFAULT_TUNING)?.summary)}</p>
          <details class="switches"><summary class="small">Rule switches (all off by default)</summary>
            <p class="small muted">Optional rules to try. Each works with any balance.</p>
            ${SWITCHES.filter(shown).map((w) => `<p class="small"><label><input type="checkbox" class="switch" value="${esc(w.id)}"${workshopIds().includes(w.id) ? " checked" : ""}> <b>${esc(w.name)}.</b> ${esc(w.summary)}</label></p>`).join("")}
          </details>
        </div>
      </fieldset>
      <div class="begin-options">
        <button class="primary" id="new">Begin</button>
        ${saved ? `<button id="resume">Resume your game (${esc(savedName)})</button>` : ""}
      </div>
      <details class="seedbox"><summary class="small muted">Choose a seed</summary>
        <label for="seed" class="small">The same seed and the same choices always give the same history.</label>
        <input id="seed" type="number" value="${seed}" style="width:9em">
      </details>
      <p class="small muted note">Prototype: Phase 2, the island, built on rules v2. The people and the situation come from Diodorus, Plutarch and others; each real person's sheet quotes the passages. Everything else, including every rule, number and picture, is invention.</p>
    </div>`;
  return titlePage(begin, intro);
}
