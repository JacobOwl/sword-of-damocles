// The start screen: the title page, the story so far, and the choices before a game (balance, game, seed, rule switches).
// Its buttons are wired by the shell (ui/app/shell.ts), which starts or resumes the game.
import { DEFAULT_TUNING, PACKAGES, SWITCHES, packageName } from "../../src/core/index.ts";
import { esc } from "../lib/text.ts";
import { titlePage } from "./title.ts";

export function startScreen(saved: { tuning?: string } | null, seed: number) {
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
  return titlePage(begin, intro);
}
