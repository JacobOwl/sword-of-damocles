// People: the character sheet (one person, opened from any name) and the court (everyone, by faction).
import { sheetSecrets, secretsLedger } from "../components/intrigue.ts";
import {
  DATA, PLAYER, agendaById, band, capital, influence, leaderOf, menu, moodName, officeName, officesOf, originById,
  playerInfluence, power, rankTitle, seasonName, traitName, standingOf, standingName, nextStep,
} from "../../src/core/index.ts";
import type { FactionId, GameState, Person } from "../../src/core/index.ts";
import { tipAttr } from "./help.ts";
import { portrait } from "../components/portraits.ts";
import { FACTION_ICON, icon } from "../components/icons.ts";
import { esc, fieldWords, isReal, linkNames, opChip, opinionHistory, opinionWord, pr, record, sign, ui, who } from "../lib/text.ts";

const STATUS: Record<string, string> = { free: "In the city", held: "In your prison", outside: "Outside the walls", dead: "Dead", absent: "Not yet in the story" };
export const statusWord = (p: Person) => STATUS[p.status];

const officeShort = (o: string) => capital(officeName(o).replace(/^the /, ""));
const factionName = (s: GameState, f: string) => (f === "ruler" ? "The ruler" : s.factions[f as FactionId]?.name ?? f);

export function marker(id: string, tip = true) {
  if (id === PLAYER) return "";
  const t = (k: string) => (tip ? tipAttr(k) : `data-tip="${k}"`);
  return isReal(id) ? `<span class="marker real" ${t("real")}>real person</span>` : `<span class="marker invented" ${t("invented")}>invented</span>`;
}

// Short flags shown on cards and in lists: rival, plot, held.
export function flags(s: GameState, p: Person) {
  const out: string[] = [];
  if (p.rival) out.push(`<span class="flag enemy">${esc(rankTitle(p.rival.rank))}</span>`);
  if (p.political) out.push(`<span class="flag pol">${esc(DATA.politicalRanks.find((r: any) => r.rank === p.political!.rank)?.title ?? "Rival")}</span>`);
  const secret = ui.designer || p.knownUntil >= s.season;
  const plot = s.plots.find((pl) => pl.members.includes(p.id));
  if (plot && (secret || plot.known.includes(p.id))) out.push(`<span class="flag plotting">plotting</span>`);
  if (p.informer) out.push(`<span class="flag info">your informer</span>`);
  if (p.bound) out.push(`<span class="flag good">bound to you</span>`);
  return out.join(" ");
}

// ---------- Traits in plain words ----------
const actName = (id: string) => DATA.actions.find((a) => a.id === id)?.name ?? id;
function traitLine(t: string, id: string) {
  const def = DATA.traits.find((x) => x.id === t);
  if (!def) return esc(t);
  const P = pr(id);
  const own = Object.entries(def.actor ?? {}).map(([a, v]) => `${esc(actName(a))} ${sign(v)}`);
  const at = Object.entries(def.target ?? {}).map(([a, v]) => `${esc(actName(a))} ${sign(v)}`);
  const parts = [own.length ? `${P.His} own rolls: ${own.join(", ")}` : "", at.length ? `Rolls against ${P.him}: ${at.join(", ")}` : "", def.note ? esc(def.note.replace(/\.$/, "")) : ""].filter(Boolean);
  return `<li><b>${esc(traitName(t))}</b><span class="small muted"> ${parts.join(". ")}.</span></li>`;
}

// ---------- The character sheet ----------
export function sheet(s: GameState, id: string) {
  const p = s.people[id];
  if (!p) return "";
  const rec = record(id) ?? {};
  const P = pr(id);
  const me = id === PLAYER;
  const offs = officesOf(s, id);
  const secret = ui.designer || p.knownUntil >= s.season;
  const plot = s.plots.find((pl) => pl.members.includes(id));

  const head = `<header class="sheet-head">
    ${portrait(id, "l")}
    <div>
      <h2 id="sheet-title">${esc(me ? "Dionysius (you)" : capital(p.name))}</h2>
      <div class="small"><i>${esc(p.role)}</i></div>
      <div class="small">${marker(id)} · <span class="fmark f-${esc(p.faction)}">${icon(FACTION_ICON[p.faction] ?? "")}${esc(factionName(s, p.faction))}</span> · ${esc(statusWord(p))}${offs.length ? ` · holds <b>${esc(offs.map(officeShort).join(", "))}</b>` : ""}</div>
      <div class="small flags">${flags(s, p)}</div>
      ${s.board && !me ? `<div class="small">Standing: <b>${esc(standingName(standingOf(s, id)))}</b>${s.board.captain === id ? " · captain of the guard" : ""}. <span class="muted">${esc(nextStep(s, id))}</span></div>` : ""}
    </div>
    <button type="button" class="close" id="sheet-close" aria-label="Close">×</button>
  </header>`;

  // Opinion, with its reasons.
  let opinion = "";
  if (!me) {
    const hist = opinionHistory(s, id, ui.designer).slice(0, 6);
    const meter = Array.from({ length: 7 }, (_, i) => `<i class="${i - 3 === p.opinion ? "on" : ""} ${i < 3 ? "neg" : i > 3 ? "pos" : ""}"></i>`).join("");
    opinion = `<section><h3>What ${P.he} thinks of you</h3>
      <div class="opline">${opChip(p.opinion, true)}<span class="opmeter" aria-hidden="true">${meter}</span></div>
      ${hist.length ? `<ul class="why-list">${hist.map((h) => `<li><span class="${h.up ? "good" : "warn"}">${h.up ? "▲" : "▼"} to ${sign(h.to)}</span> ${esc(h.why)} <span class="muted small">(${esc(seasonName(h.season))})</span></li>`).join("")}</ul>` : `<p class="small muted">No change since the story began.</p>`}
      ${p.grudges.length ? `<p class="small"><b>Grudges:</b> ${p.grudges.map((g) => esc(g.reason)).join("; ")}.</p>` : `<p class="small muted">No grudges against you.</p>`}
      ${p.owedFavor ? `<p class="small">You owe ${P.him} a favour.</p>` : ""}
      ${p.refusals ? `<p class="small warn">You have refused ${P.him} ${p.refusals === 1 ? "once" : `${p.refusals} times`}.${p.refusals === 1 ? " A second refusal makes an enemy." : ""}</p>` : ""}
    </section>`;
  }

  const wants = p.wants ? ` · wants ${esc(officeName(p.wants))}` : "";
  const character = `<section><h3>Character</h3>
    <p class="small"><b>Ambition:</b> ${esc(p.ambition)}${wants} · <b>Influence:</b> <span class="num">${influence(s, id)}</span>${me ? "" : ` (yours ${playerInfluence(s)})`}</p>
    <ul class="traits">${p.traits.map((t) => traitLine(t, id)).join("")}</ul></section>`;

  // Rivalry.
  let rivalry = "";
  if (p.rival || p.political) {
    const r = p.rival;
    const pol = p.political;
    const enemy = r ? `<div class="rival-block"><div class="fhead"><b>Enemy</b><span class="rank" ${tipAttr("rank")}>Rank ${r.rank}, ${esc(rankTitle(r.rank))}</span></div>
      <div class="ranktrack">${DATA.ranks.map((k) => `<span class="${k.rank <= r.rank ? "done" : ""}">${esc(k.title)}</span>`).join("")}</div>
      <p class="small">${r.scars.map((sc) => `<b>${esc(originById(sc)?.name ?? sc)}:</b> ${esc(originById(sc)?.effect ?? "")}`).join("<br>")}</p>
      ${r.memory.length ? `<div class="memory">${P.He} remembers:<ul>${r.memory.slice().reverse().map((m) => `<li>${esc(m.text)}</li>`).join("")}</ul></div>` : ""}
      ${p.agenda?.id === "yourFall" ? agendaTrack("yourFall", p.agenda.step) : ""}</div>` : "";
    const pt = pol ? DATA.politicalTypes.find((t: any) => t.id === pol.type) : null;
    const political = pol ? `<div class="rival-block"><div class="fhead"><b>Political rival</b><span class="rank pol" ${tipAttr("political")}>${esc(DATA.politicalRanks.find((k: any) => k.rank === pol.rank)?.title ?? "")}</span></div>
      <div class="ranktrack pol">${DATA.politicalRanks.map((k: any) => `<span class="${k.rank <= pol.rank ? "done" : ""}">${esc(k.title)}</span>`).join("")}</div>
      <p class="small">A ${esc(pol.type)}${pt ? `: ${esc(pt.leansOn.toLowerCase())}` : ""}. Influence <span class="num">${influence(s, id)}</span> against your ${playerInfluence(s)}.</p>
      ${p.agenda?.id === "takePlace" ? agendaTrack("takePlace", p.agenda.step) : ""}</div>` : "";
    rivalry = `<section><h3>Rivalry</h3>${enemy}${political}</section>`;
  } else if (!me && s.waiting.includes(id)) {
    rivalry = `<section><h3>Rivalry</h3><p class="small warn">Would be your enemy, and waits for a place among your rivals.</p></section>`;
  }
  // Switch "One feud record": his whole record with you, oldest first, never wiped.
  const fr = p.feud;
  if (fr && fr.chapters.length) {
    const paused = !p.rival && fr.pausedRank && !fr.closed ? `<p class="small">Paused at rank ${fr.pausedRank}. A new wrong brings it back there.</p>` : "";
    rivalry += `<section><h3>Feud with you${fr.title ? `: ${esc(p.name.charAt(0).toUpperCase() + p.name.slice(1))} ${esc(fr.title)}` : ""}</h3>${paused}
      <ul class="small">${fr.chapters.map((c) => `<li>${esc(seasonName(c.season))}: ${linkNames(c.text)}</li>`).join("")}</ul></section>`;
  }

  // What you know of his secrets.
  const secrets = me ? "" : `<section><h3>What you know</h3><p class="small">${secret
    ? (plot ? `<span class="warn">${P.He} is in a plot against you.</span>${plot.leader === id ? ` ${P.He} leads it.` : ""}` : `${P.He} is in no plot against you.`)
    : plot && plot.known.includes(id) ? `<span class="warn">${P.His} name has been given to you as a plotter.</span>`
    : `${P.His} secrets are hidden. Watch ${P.him} to learn whether ${P.he} plots.`}${p.informer ? ` ${P.He} reports to you about any plot ${P.he} joins.` : ""}${p.bound ? ` ${P.He} is bound to you.` : ""}</p>
    ${s.secrets ? sheetSecrets(s, id) : leverageLine(s, id)}</section>`;

  // Family ties, from the data, with clickable names.
  const fam = ((rec.family ?? []) as { person: string; relation: string }[]).filter((f) => s.people[f.person] && s.people[f.person].status !== "absent");
  const family = fam.length ? `<section><h3>Family and ties</h3><ul class="ties">${fam.map((f) => `<li>${portrait(f.person, "s")} <span>${f.person === PLAYER ? "<b>you</b>" : who(f.person)} <span class="muted small">${esc(f.relation)}${s.people[f.person].status === "dead" ? ", dead" : ""}</span></span></li>`).join("")}</ul></section>` : "";

  // What you can do to him now.
  let acts = "";
  if (!me && !s.over) {
    const items = menu(s).filter((m) => !m.blocked && m.targets?.some((t) => t.value === id));
    acts = `<section><h3>Your actions toward ${P.him}</h3>${items.length ? `<div class="sheet-acts">${items.map((m) => `<button type="button" data-sheet-act="${esc(m.id)}" data-target="${esc(id)}">${esc(m.name)}</button>`).join("")}</div>` : `<p class="small muted">${s.slots < 1 ? "No actions left this season." : `Nothing you can do to ${P.him} right now.`}</p>`}</section>`;
  }

  // Recent deeds you saw.
  const deeds = s.log.filter((e) => e.actor === id && e.kind === "event" && (ui.designer || e.visible)).slice(-5).reverse();
  const recent = deeds.length ? `<section><h3>Lately</h3><ul class="deeds">${deeds.map((e) => `<li>${linkNames(e.text)} <span class="muted small">(${esc(seasonName(e.season))})</span></li>`).join("")}</ul></section>` : "";

  // Sources (real people) or the invention note.
  const facts = (rec.facts ?? []) as { text: string; cite: string; quote?: string }[];
  const inv = (rec.invented ?? []) as string[];
  const sources = isReal(id)
    ? `<section><details class="sources"><summary><h3>In the sources</h3></summary><ul>${facts.map((f) => `<li>${esc(f.text)} <span class="cite">${esc(f.cite)}${f.quote ? `: “${esc(f.quote)}”` : ""}</span></li>`).join("")}</ul>
      ${inv.length ? `<p class="small muted">Invented for the game: ${esc(inv.map(fieldWords).join(", "))}.</p>` : ""}</details></section>`
    : `<section><p class="small muted">${me ? "" : `Invented for the game. ${rec.note ? esc(rec.note) : "The sources name no one for this place."}`}</p></section>`;

  return `${head}<div class="sheet-body"><div>${opinion}${character}${rivalry}${secrets}</div><div>${acts}${family}${recent}${sources}</div></div>`;
}

function agendaTrack(aid: string, step: number) {
  const ag = agendaById(aid);
  return `<div class="small warn">Agenda, <i>${esc(ag.name)}</i>:</div><div class="steps">${ag.steps.map((st, i) => `<span class="${i < step ? "done" : ""}">${esc(st)}</span>`).join("")}</div><div class="small muted">When complete: ${esc(ag.completes)}</div>`;
}

function leverageLine(s: GameState, id: string) {
  const over = s.leverage.filter((l) => l.holder === id && l.over === PLAYER).length;
  const mine = s.leverage.filter((l) => l.holder === PLAYER && l.over === id).length;
  const bits = [over ? `${pr(id).He} holds leverage over you (${over}).` : "", mine ? `You hold leverage over ${pr(id).him} (${mine}).` : ""].filter(Boolean);
  return bits.length ? `<p class="small">${bits.join(" ")}</p>` : "";
}

// ---------- The court ----------
export function court(s: GameState) {
  const order: (FactionId)[] = ["family", "rich", "citizens", "guard"];
  const alive = (p: Person) => p.status !== "dead" && p.status !== "absent";
  const dead = Object.values(s.people).filter((p) => !p.player && p.status === "dead");
  const later = Object.values(s.people).filter((p) => p.status === "absent").length;
  const sections = order.map((f) => {
    const fa = s.factions[f];
    const pow = power(s, f);
    const lead = leaderOf(s, f);
    const ps = Object.values(s.people).filter((p) => !p.player && p.faction === f && alive(p))
      .sort((a, b) => (a.id === lead?.id ? -1 : b.id === lead?.id ? 1 : officesOf(s, b.id).length - officesOf(s, a.id).length));
    return `<section class="court-faction">
      <div class="fhead"><h2><span class="f-${f}">${icon(FACTION_ICON[f])}</span>${esc(fa.name)}</h2><span class="small"><span class="num">${pow}</span> <span class="band ${band(pow)}" ${tipAttr("power")}>${band(pow)}</span> · <span class="mood mood-${fa.mood}" ${tipAttr("mood")}>${moodName(fa.mood)}</span></span></div>
      <div class="cards">${ps.map((p) => card(s, p, p.id === lead?.id)).join("")}</div>
    </section>`;
  }).join("");
  const you = s.people[PLAYER];
  return `<div class="court">
    <p class="small muted">Everyone who matters in Syracuse, by faction. Click a card to open the full sheet. The number is what they think of you.</p>
    <section class="court-faction"><div class="fhead"><h2><span class="f-ruler">${icon("sword")}</span>You</h2></div><div class="cards">${card(s, you, false)}</div></section>
    ${sections}
    ${secretsLedger(s)}
    ${dead.length || later ? `<p class="small muted">${dead.length ? `The dead: ${dead.map((p) => who(p.id)).join(", ")}.` : ""}${later ? ` ${later} more will enter the story later.` : ""}</p>` : ""}
  </div>`;
}

function card(s: GameState, p: Person, leads: boolean) {
  const offs = officesOf(s, p.id);
  const me = p.player;
  return `<button type="button" class="card" data-person="${esc(p.id)}">
    ${portrait(p.id, "m")}
    <span class="card-text">
      <span class="card-name">${esc(me ? "Dionysius (you)" : capital(p.name))}</span>
      <span class="small muted card-role">${esc(p.role)}</span>
      <span class="small">${[marker(p.id, false), leads ? "<b>leads</b>" : "", s.board && !me && standingOf(s, p.id) >= 2 ? `<b>${esc(standingName(standingOf(s, p.id)).toLowerCase())}</b>` : "", offs.length || s.board?.captain === p.id ? esc([...offs.map(officeShort), ...(s.board?.captain === p.id ? ["captain of the guard"] : [])].join(", ")) : "", p.status !== "free" ? `<span class="warn">${esc(statusWord(p).toLowerCase())}</span>` : ""].filter(Boolean).join(" · ")}</span>
      <span class="small">${flags(s, p)}</span>
    </span>
    ${me ? "" : `<span class="card-op">${opChip(p.opinion)}<span class="opw small">${opinionWord(p.opinion)}</span></span>`}
  </button>`;
}

