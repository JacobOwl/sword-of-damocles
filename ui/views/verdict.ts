// The season-10 verdict, in a game started from a preset (data/presets.json): what you'd retell, what confused you,
// what felt unfair, and how hard it was. Answers stay in your save and go out with "Copy my game"; then you play on.
// It reads the game and changes nothing in it.
import { presetById, seasonName } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";
import { esc, ui } from "../lib/text.ts";
import type { Verdict } from "../lib/text.ts";
import type { Handlers } from "../app/clicks.ts";

// A check-in due now (a season in the preset's checkIns reached and not yet answered), or null.
export function checkInDue(g: GameState): number | null {
  const p = presetById(g.preset);
  if (!p || g.over || ui.verdict) return null;
  const s0 = g.startSeason ?? 0; // a late opening counts its check-ins from where it began
  const due = (p.checkIns ?? []).filter((n) => n < p.verdictSeason && g.season - s0 >= n && !ui.checkIns.some((c) => c.season - s0 >= n));
  return due.length ? due[due.length - 1] : null;
}

// Due once the preset's season is reached (or the game ended before it), until answered or skipped.
// On the way, a shorter check-in at each of the preset's checkIns.
export function verdictDue(g: GameState) {
  const p = presetById(g.preset);
  if (!p || ui.verdict) return false;
  return g.season - (g.startSeason ?? 0) >= p.verdictSeason || !!g.over || checkInDue(g) !== null;
}

export function verdictView(g: GameState) {
  const p = presetById(g.preset)!;
  if (checkInDue(g) !== null) return checkInView(g, checkInDue(g)!);
  const early = !!g.over && g.over.season - (g.startSeason ?? 0) < p.verdictSeason;
  const draft = ui.verdictDraft as Record<string, string>;
  const q = (id: keyof Verdict, label: string, hint: string) => `<p><label for="v-${id}"><b>${esc(label)}</b> <span class="small muted">${esc(hint)}</span></label>
      <textarea id="v-${id}" rows="3">${esc(draft[id] ?? "")}</textarea></p>`;
  return `<article class="verdict">
    <h2>${early ? "Before you go: your verdict" : `${p.verdictSeason} seasons in: your verdict`}</h2>
    <p class="small muted">${esc(seasonName(g.over ? g.over.season : g.season - 1))}. ${early ? "Your rule ended early, which is a result too." : `You have played ${p.verdictSeason} seasons of the ${esc(p.name.toLowerCase())}.`} A few honest lines here are worth more than a long report. Nothing you write changes the game.</p>
    <p class="small"><button type="button" data-view="chronicle">Read the chronicle first</button></p>
    ${q("retell", "What would you retell?", "The moment or the person you'd tell a friend about. \"Nothing\" is a fine answer.")}
    ${q("confused", "What confused you?", "A screen, a word, a number, a result you couldn't explain.")}
    ${q("unfair", "What felt unfair?", "A blow, a loss or a roll that came from nowhere.")}
    <fieldset class="level"><legend><b>So far the game is</b></legend>
      ${[["easy", "too easy"], ["right", "about right"], ["hard", "too hard"]].map(([v, l]) => `<label><input type="radio" name="v-level" value="${v}"${draft.level === v ? " checked" : ""}> ${l}</label>`).join("\n      ")}
    </fieldset>
    ${q("other", "Anything else?", "Optional.")}
    <p><button class="primary" id="verdict-save">${early ? "Save my verdict" : "Save and play on"}</button> <button type="button" id="verdict-skip" class="small">Skip</button></p>
    <p class="small muted">Your answers are kept with this game. "Copy my game" at the foot of the page copies them with every move you made, so the game can be replayed exactly as you saw it.</p>
  </article>`;
}

// The shorter check-in: two questions and how hard it feels, then play on.
function checkInView(g: GameState, n: number) {
  const p = presetById(g.preset)!;
  const draft = ui.verdictDraft as Record<string, string>;
  const q = (id: keyof Verdict, label: string, hint: string) => `<p><label for="v-${id}"><b>${esc(label)}</b> <span class="small muted">${esc(hint)}</span></label>
      <textarea id="v-${id}" rows="2">${esc(draft[id] ?? "")}</textarea></p>`;
  return `<article class="verdict">
    <h2>${n} seasons in: a quick check-in</h2>
    <p class="small muted">${esc(seasonName(g.season - 1))}. Two short questions, then play on. Your full verdict comes at season ${p.verdictSeason}.</p>
    ${q("retell", "Anything you'd retell so far?", "A moment or a person. \"Nothing yet\" is a fine answer.")}
    ${q("confused", "Anything confusing?", "Optional.")}
    <fieldset class="level"><legend><b>So far the game is</b></legend>
      ${[["easy", "too easy"], ["right", "about right"], ["hard", "too hard"]].map(([v, l]) => `<label><input type="radio" name="v-level" value="${v}"${draft.level === v ? " checked" : ""}> ${l}</label>`).join("\n      ")}
    </fieldset>
    <p><button class="primary" id="checkin-save">Save and play on</button> <button type="button" id="checkin-skip" class="small">Skip</button></p>
  </article>`;
}

const val = (id: string) => (document.getElementById(`v-${id}`) as HTMLTextAreaElement | null)?.value.trim() ?? "";
export const verdictHandlers: Handlers = {
  click: {
    "#verdict-save": (_, c) => {
      const level = (document.querySelector<HTMLInputElement>('input[name="v-level"]:checked')?.value ?? "") as Verdict["level"];
      ui.verdict = { season: c.g.over ? c.g.over.season + 1 : c.g.season, retell: val("retell"), confused: val("confused"), unfair: val("unfair"), level, other: val("other") };
      ui.verdictDraft = {}; c.save(); c.render(); window.scrollTo({ top: 0 });
    },
    "#checkin-save": (_, c) => {
      const level = (document.querySelector<HTMLInputElement>('input[name="v-level"]:checked')?.value ?? "") as Verdict["level"];
      ui.checkIns = [...ui.checkIns, { season: c.g.season, retell: val("retell"), confused: val("confused"), unfair: "", level, other: "" }];
      ui.verdictDraft = {}; c.save(); c.render(); window.scrollTo({ top: 0 });
    },
    "#checkin-skip": (_, c) => {
      ui.checkIns = [...ui.checkIns, { season: c.g.season, retell: "", confused: "", unfair: "", level: "", other: "", skipped: true }];
      c.save(); c.render();
    },
    "#verdict-skip": (_, c) => {
      ui.verdict = { season: c.g.over ? c.g.over.season + 1 : c.g.season, retell: "", confused: "", unfair: "", level: "", other: "", skipped: true };
      c.save(); c.render();
    },
  },
  change: {
    // Keep what you typed if the page is drawn again before you save (a name clicked, the sound turned on).
    "textarea[id^=v-]": (el) => { ui.verdictDraft[el.id.slice(2)] = (el as HTMLTextAreaElement).value; },
    'input[name="v-level"]': (el) => { ui.verdictDraft.level = (el as HTMLInputElement).value; },
  },
};

// A short line for the foot and the ending once the verdict is in.
export function verdictNote(g: GameState) {
  const p = presetById(g.preset);
  if (!p || !ui.verdict) return "";
  return ui.verdict.skipped ? "You skipped the verdict." : `Your verdict from season ${ui.verdict.season} is saved with this game.`;
}
