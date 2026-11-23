// The council and the secrets on screen (rule switches "Your council argues" and "Secrets and leverage").
// Both show nothing unless their switch is on. Real names and plain words only; the designer view also marks
// false counsel and secrets you have not found.
import type { Args, GameState, Secret } from "../../src/core/index.ts";
import { PLAYER, capital, counsel, seated, seatName, isFalse, councilName, secretsAbout, secretsKnownBy, secretLine, usableSecrets, seenHolders, silenceCost, SECRETS, seasonName } from "../../src/core/index.ts";
import { esc, ui, who, linkNames, pr } from "../lib/text.ts";
import { portrait } from "./portraits.ts";
import { face } from "../views/families.ts";

const STANCE: Record<string, string> = { "2": "urges it", "1": "for it", "-1": "wary", "-2": "against it" };
const weightWord = (x: Secret) => (x.weight === 2 ? `<span class="tag deadly">deadly</span>` : `<span class="tag">small</span>`);
const personLink = (g: GameState, id: string, census: boolean) => (census ? esc(capital(councilName(g, id, true))) : who(id));
const pic = (g: GameState, id: string, census: boolean) => (census ? face(g, id, false).replace("portrait m", "portrait s") : portrait(id, "s"));

// "Your council", in the season column: who sits, and what worries each of them this season.
export function councilBlock(g: GameState): string {
  if (!g.council || g.over) return "";
  const c = g.council;
  const seats = seated(g);
  if (!seats.length) return `<div class="council"><h2>Your council</h2><p class="small muted">Every seat at your table is empty. Seat a counsellor from the Court actions.</p></div>`;
  return `<div class="council"><h2>Your council</h2>
    <p class="small muted">They speak before each action you open. A man who plots against you, wants your place or hates you says what serves him. Watch a man they accuse to see who told the truth.</p>
    ${seats.map(({ seat, who: id, census }) => {
      const line = c.brief.find((l) => l.who === id);
      const doubts = c.doubts[id] ?? 0, right = c.right[id] ?? 0;
      const record = [doubts ? `<span class="warn">caught in a false accusation ${doubts === 1 ? "once" : `${doubts} times`}</span>` : "", right ? `right ${right === 1 ? "once" : `${right} times`}` : ""].filter(Boolean).join(", ");
      const fake = ui.designer && !census && isFalse(g, id) ? ` <span class="tag warn">false counsel</span>` : "";
      return `<div class="seat">${pic(g, id, census)}<div class="seat-t"><span class="label">${esc(capital(seatName(seat)))}</span> ${personLink(g, id, census)}${fake}${record ? ` <span class="small">(${record})</span>` : ""}
        ${line ? `<p class="counsel-q">“${linkNames(line.text)}”</p>` : ""}</div></div>`;
    }).join("")}</div>`;
}

// In an open action: what each of them says about it.
export function counselLines(g: GameState, action: string, args: Args, chance?: number): string {
  if (!g.council) return "";
  const xs = counsel(g, action, args, chance);
  if (!seated(g).length) return "";
  if (!xs.length) return `<div class="small muted counsel">Your council has no strong view.</div>`;
  return `<div class="counsel"><span class="label">Your council</span>${xs.map((x) => `<div class="small"><b>${personLink(g, x.who, !!x.census)}</b> <span class="${x.stance > 0 ? "good" : "warn"}">${STANCE[String(x.stance)]}</span>: “${esc(x.text)}”${ui.designer && x.lie ? ` <span class="tag warn">a lie</span>` : ""}</div>`).join("")}</div>`;
}

// A blackmail demand, on a petition.
export function blackmailNote(g: GameState, secretId?: string): string {
  if (!secretId || !g.secrets) return "";
  const x = g.secrets.list.find((y) => y.id === secretId);
  return x ? ` <span class="warn">Refuse, and he tells the city that ${esc(x.text)}.</span>` : "";
}

// On a character sheet: the secrets you hold over him, and those you know he holds over you.
export function sheetSecrets(g: GameState, id: string): string {
  if (!g.secrets) return "";
  const P = pr(id);
  const mine = secretsAbout(g, id).filter((x) => x.known.includes(PLAYER));
  const theirs = secretsAbout(g, PLAYER).filter((x) => x.known.includes(id) && (ui.designer || usedOnYou(g, id)));
  const hidden = ui.designer ? secretsAbout(g, id).filter((x) => !x.known.includes(PLAYER)) : [];
  const line = (x: Secret, holder: string) => {
    const ok = usableSecrets(g, holder, x.about).includes(x);
    const state = x.spent.includes(holder) ? "used up" : !ok ? `resting until ${seasonName((x.rest[holder] ?? g.season) + 1)}` : "ready";
    return `<li>${weightWord(x)} ${linkNames(capital(secretLine(g, x)))}. <span class="muted">${esc(state)}${x.history ? ", from the sources" : ""}</span></li>`;
  };
  return `${mine.length ? `<p class="small"><b>Secrets you hold over ${P.him}:</b></p><ul class="small secrets">${mine.map((x) => line(x, PLAYER)).join("")}</ul>` : `<p class="small muted">You hold no secret over ${P.him}. Watching shows what ${P.he} does now; paying ${P.his} servants, what ${P.he} did.</p>`}
    ${theirs.length ? `<p class="small warn"><b>${P.He} knows:</b></p><ul class="small secrets">${theirs.map((x) => line(x, id)).join("")}</ul><p class="small muted">Buy back a secret (${silenceCost(g, id)} silver) to make ${P.him} forget, or expose ${P.him} if ${P.he} tried to blackmail you.</p>` : ""}
    ${hidden.length ? `<p class="small muted"><b>Designer view, not yet found:</b> ${hidden.map((x) => esc(x.text)).join("; ")}.</p>` : ""}`;
}
// You know he holds a secret of yours once he has made a demand, told the city, or been overheard by your watchers.
const usedOnYou = (g: GameState, id: string) => seenHolders(g).includes(id);

// In the court view: the ledger of secrets.
export function secretsLedger(g: GameState): string {
  if (!g.secrets) return "";
  const held = secretsKnownBy(g, PLAYER).filter((x) => x.about !== PLAYER);
  const yours = secretsAbout(g, PLAYER);
  const known = (x: Secret) => x.known.filter((k) => k !== PLAYER && g.people[k] && (ui.designer || usedOnYou(g, k)));
  const told = (g.secrets.list).filter((x) => x.publicSince !== undefined && x.tpl !== "none").slice(-6).reverse();
  return `<section class="court-faction secrets-ledger"><div class="fhead"><h2>Secrets</h2><span class="small muted">A small secret is used up; a deadly one rests ${SECRETS.knobs.holdRest} seasons after each use.</span></div>
    <div class="ledger-cols">
      <div><h3>What you know</h3>${held.length ? `<ul class="small secrets">${held.map((x) => `<li>${weightWord(x)} ${linkNames(capital(secretLine(g, x)))}.${x.spent.includes(PLAYER) ? ` <span class="muted">Used up.</span>` : usableSecrets(g, PLAYER, x.about).includes(x) ? "" : ` <span class="muted">Resting.</span>`}</li>`).join("")}</ul>` : `<p class="small muted">Nothing yet. Watch a man, or pay his servants.</p>`}</div>
      <div><h3>Your own secrets</h3>${yours.length ? `<ul class="small secrets">${yours.map((x) => { const ks = known(x); return `<li>${weightWord(x)} ${linkNames(capital(x.text))}.${ks.length ? ` <span class="warn">Known to ${ks.map((k) => who(k)).join(", ")}.</span>` : ` <span class="muted">No one you know of has it.</span>`}</li>`; }).join("")}</ul>` : `<p class="small muted">None.</p>`}
        <p class="small muted">Your rivals dig for these. While you hold a deadly secret over a man, he keeps yours to himself. A man you know holds one can be bought off (Buy back a secret), and a man who tried to blackmail you can be exposed: that ends his hold, but he tells one secret as a parting shot, and his kin and faction take it ill.</p></div>
    </div>
    ${told.length ? `<p class="small"><b>Told to the city:</b> ${told.map((x) => `${linkNames(capital(secretLine(g, x)))} (${esc(seasonName(x.publicSince!))})`).join("; ")}.</p>` : ""}
  </section>`;
}
