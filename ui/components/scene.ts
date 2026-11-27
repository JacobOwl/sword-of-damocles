// The scene frame (test 5, docs/council/2026-11-27-big-scenes.md): a full-screen plate for the moments that stop the
// game. Every battle gets one, even one you could not play (it shows before the next season card), and with the switch
// "battleScenes" a battle waits for you in it: the ground, your plan, the turning point, the roll, and what comes after.
// Council debates in Carthage, plot strikes and crises use the same frame. It reads the state and sends your choices
// through act(), like every other screen.
import { act, allScenes, pendingScene, plateNow, BATTLE, planDef, habitLine, carthageArmy, yourArmy, seasonName, switchOn, PLAYER } from "../../src/core/index.ts";
import type { GameState, Scene } from "../../src/core/index.ts";
import { esc, ui } from "../lib/text.ts";
import { vignette } from "./vignettes.ts";
import { PORTRAITS, portrait, initial } from "./portraits.ts";

type Mod = { label: string; value: number };
const KEY = "sword-of-damocles-scenes-seen";
function seen(g: GameState): Set<string> {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? "{}"); return new Set(v[`${g.seed}:${g.preset ?? ""}`] ?? []); } catch { return new Set(); }
}
function markSeen(g: GameState, id: string) {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    const k = `${g.seed}:${g.preset ?? ""}`;
    v[k] = [...new Set([...(v[k] ?? []), id])].slice(-80);
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch { /* storage may be blocked */ }
}
const sum = (m: Mod[]) => m.reduce((t, x) => t + x.value, 0);
const sign = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : "0");
// The chance a die plus M beats a die plus T, in plain words.
function odds(M: number, T: number) {
  let w = 0, d = 0;
  for (let x = 1; x <= 6; x++) for (let y = 1; y <= 6; y++) { if (x + M > y + T) w++; else if (x + M === y + T) d++; }
  const p = Math.round((w / 36) * 10);
  return `You win about ${Math.max(0, Math.min(10, p))} ${p === 1 ? "time" : "times"} in 10${d ? `, draw ${Math.round((d / 36) * 10) || "less than 1"} in 10` : ""}.`;
}
function faceHtml(g: GameState, id: string) {
  if (id.startsWith("carthage:")) {
    const cid = id.slice(9);
    const name = g.island?.carthage.people[cid]?.name ?? "Carthage";
    const url = PORTRAITS[cid];
    return `<figure class="scf"><span class="portrait l ${url ? "has-img" : ""}" style="--tint:#4a2b4f" role="img" aria-label="Portrait of ${esc(name)}">${url ? `<img src="${esc(url)}" alt="">` : `<span class="mono-initial">${esc(initial(name))}</span>`}</span><figcaption>${esc(name)}</figcaption></figure>`;
  }
  if (!g.people[id]) return "";
  return `<figure class="scf">${portrait(id, "l")}<figcaption>${id === PLAYER ? "You" : esc(g.people[id].name)}</figcaption></figure>`;
}
function tokens(m: Mod[], theirs = false) {
  return m.map((x) => `<li class="${(x.value >= 0) !== theirs ? "good" : "warn"}"><b>${sign(x.value)}</b> ${esc(x.label)}</li>`).join("");
}
function plateHtml(g: GameState, sc: Scene) {
  const p = sc.stage === "choose" ? plateNow(g, sc) ?? sc.plate : sc.plate;
  if (!p) return "";
  const M = sum(p.mine), T = sum(p.theirs);
  const die = (n?: number) => `<span class="die${n ? " thrown" : ""}" aria-label="${n ? `rolled ${n}` : "a die not yet thrown"}">${n ?? ""}</span>`;
  const total = (n?: number, base?: number) => (n !== undefined ? `<b class="sct">= ${n}</b>` : `<span class="muted">${sign(base ?? 0)}</span>`);
  return `<div class="scplate">
    <div><span class="label">${esc(p.mineName)}</span> ${die(p.dieMine)} ${total(p.tMine, M)}<ul class="tokens small">${tokens(p.mine)}</ul></div>
    <div><span class="label">${esc(p.theirName)}</span> ${die(p.dieTheirs)} ${total(p.tTheirs, T)}<ul class="tokens small">${tokens(p.theirs, true)}</ul></div>
  </div>${sc.stage === "choose" ? `<p class="small scodds">${esc(odds(M, T))}</p>` : ""}`;
}
function choiceHtml(g: GameState, sc: Scene) {
  if (sc.stage === "choose") {
    const ya = yourArmy(g);
    const plans = switchOn(g, "battlePlate") && ya ? `<div class="scplan"><span class="label">Your plan</span> ${BATTLE.plans.map((p: any) => `<button type="button" class="small${ya.plan === p.id ? " on" : ""}" data-scplan="${p.id}" title="${esc(p.text)}">${esc(p.name)}</button>`).join(" ")}
      <button type="button" class="small${ya.reserve ? " on" : ""}" data-scres="${ya.reserve ? "" : "1"}">${ya.reserve ? "Reserve held back" : "Hold back a reserve"}</button>
      <p class="small muted">${ya.plan ? esc(planDef(ya.plan).text) : "No plan set: your general fights his own way."} ${esc(habitLine(g, carthageArmy(g)))}</p></div>` : "";
    const t = sc.turn!;
    return `${plans}<div class="scturn"><span class="label">The turning point</span><p class="scturn-text">${esc(t.text)} <span class="muted small">(${esc(t.why)}; ${esc(t.source)})</span></p>
      <div class="scopts">${t.options.map((o) => `<button type="button" class="scopt" data-scfight="${o.id}"><b>${esc(o.label)}</b><span class="small">${esc(o.note)}</span></button>`).join("")}</div>
      ${switchOn(g, "groundChoice") ? `<p class="small"><button type="button" class="small" data-screfuse="1">Try to refuse battle</button> <span class="muted">Your general's skill against theirs, 4 or more on a die: you fall back and your rearguard pays. Your allies resent it either way.</span></p>` : ""}</div>`;
  }
  if (sc.stage === "after") {
    return `<div class="scturn"><span class="label">${esc(sc.ask ?? "What now?")}</span><div class="scopts">${(sc.options ?? []).map((o) => `<button type="button" class="scopt" data-scafter="${o.id}"><b>${esc(o.label)}</b><span class="small">${esc(o.note)}</span></button>`).join("")}</div></div>`;
  }
  if (sc.kind === "crisis" || sc.kind === "plot" || sc.kind === "debate" || sc.kind === "council") {
    const opts = (sc as any).choices as { id: string; label: string; note: string; action: string }[] | undefined;
    if (opts?.length && !(sc as any).answered) return `<div class="scturn"><span class="label">${esc(sc.ask ?? "Your choice")}</span><div class="scopts">${opts.map((o) => `<button type="button" class="scopt" data-scchoice="${esc(o.action)}:${esc(o.id)}"><b>${esc(o.label)}</b><span class="small">${esc(o.note)}</span></button>`).join("")}</div></div>`;
  }
  return `<p class="scgo"><button type="button" data-scclose="1">Go on</button></p>`;
}
const KIND: Record<string, string> = { battle: "A battle", sea: "A battle at sea", council: "In Carthage", plot: "The sword", crisis: "The city rises", debate: "In the assembly", report: "News" };
export function sceneHtml(g: GameState, sc: Scene) {
  const speakers = sc.speakers?.length ? `<ul class="scspeak">${sc.speakers.map((x) => `<li>${faceHtml(g, x.face)}<div><b>${esc(x.name)}</b> <span class="stance">${esc(x.stance)}</span><p>${esc(x.line)}</p></div></li>`).join("")}</ul>` : "";
  return `<div class="scene-inner${sc.good === false ? " bad" : ""}">
    <div class="tesserae" aria-hidden="true"></div>
    <div class="scgrid">
      <div class="scpic">${vignette(sc.art, sc.title)}<div class="scfaces">${sc.faces.map((f) => faceHtml(g, f)).join(`<span class="scvs" aria-hidden="true">against</span>`)}</div></div>
      <div class="sctext">
        <p class="sc-kicker">${esc(KIND[sc.kind] ?? "")} · ${esc(seasonName(sc.season))}</p>
        <h2 class="scttl">${esc(sc.title)}</h2>
        ${sc.result ? `<p class="scres ${sc.good === false ? "warn" : "good"}">${esc(sc.result)}</p>` : ""}
        ${speakers}
        <ol class="scbeats">${sc.beats.filter(Boolean).map((b, i) => `<li style="--i:${i}">${esc(b)}</li>`).join("")}</ol>
        ${sc.kind === "battle" || sc.kind === "sea" ? plateHtml(g, sc) : ""}
        ${choiceHtml(g, sc)}
      </div>
    </div>
    <div class="tesserae" aria-hidden="true"></div>
  </div>`;
}

// The scenes to show now: a battle waiting for you first, then any finished scene you have not yet seen.
export function scenesDue(g: GameState): Scene[] {
  if (!g.island) return [];
  const p = pendingScene(g);
  const s0 = seen(g);
  const done = allScenes(g).filter((x) => x.stage === "done" && !s0.has(x.id) && x.season >= g.season - 1);
  return p ? [p] : done.slice(0, 3);
}
let open: HTMLElement | null = null;
export function showScenes(getG: () => GameState | null, rerender: () => void, after?: () => void) {
  if (typeof document === "undefined") return after?.();
  const g = getG();
  if (!g) return after?.();
  const due = scenesDue(g);
  if (!due.length) { open?.remove(); open = null; return after?.(); }
  const sc = due[0];
  if (!open) {
    open = document.createElement("div");
    open.className = "scene";
    open.setAttribute("role", "dialog");
    open.setAttribute("aria-modal", "true");
    document.body.appendChild(open);
    open.addEventListener("click", (e) => {
      const g2 = getG();
      const t = (e.target as HTMLElement).closest<HTMLElement>("button");
      if (!g2 || !t) return;
      const cur = scenesDue(g2)[0];
      if (!cur) return;
      const d = t.dataset;
      if (d.scplan) act(g2, "battlePlan", { target: d.scplan, second: yourArmy(g2)?.reserve ? "reserve" : "all" });
      else if (d.scres !== undefined) act(g2, "battlePlan", { target: yourArmy(g2)?.plan ?? "hold", second: d.scres ? "reserve" : "all" });
      else if (d.scfight) act(g2, "sceneFight", { target: d.scfight, second: "fight" });
      else if (d.screfuse) act(g2, "sceneFight", { target: cur.turn?.options[0].id, second: "refuse" });
      else if (d.scafter) act(g2, "sceneAfter", { target: d.scafter });
      else if (d.scchoice) { const [action, id] = d.scchoice.split(":"); act(g2, action, { target: id, second: cur.id }); }
      else if (d.scclose) markSeen(g2, cur.id);
      else return;
      rerender();
      showScenes(getG, rerender, after);
    });
  }
  open.innerHTML = sceneHtml(g, sc);
  open.scrollTop = 0;
  (open.querySelector("button") as HTMLElement | null)?.focus({ preventScroll: true });
  void ui;
}
