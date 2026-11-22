// The browser game. It only reads the simulation's state and sends it your choices; all rules live in src/core.
import {
  DATA, FACTIONS, OFFICES, PLAYER, act, agendaById, band, capital, defense, endSeason, fullChronicle, government, influence,
  leaderOf, menu, moodName, officeName, officesOf, others, playerInfluence, plotStrength, power, preview, rankTitle,
  refuseRequest, replay, secondOptions, seasonName, stageName, startGame, traitName, originById, backingFaction,
} from "../src/core/index.ts";
import type { Args, FactionId, GameState, LogEntry, Person, Input } from "../src/core/index.ts";

const SAVE_KEY = "sword-of-damocles-save-v1";
let s: GameState | null = null;
let openAction: string | null = null;
let args: Args = {};
let tab = "season";
let designer = false;
let lastSeen = 0;

const app = document.getElementById("app")!;
const esc = (t: unknown) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const nm = (id: string) => (id === PLAYER ? "you" : s!.people[id]?.name ?? id);
const Nm = (id: string) => capital(nm(id));
const sign = (n: number) => (n > 0 ? `+${n}` : `${n}`);

// ---------- Saving: the seed and your inputs, replayed on load ----------
function save() {
  if (!s) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ seed: s.seed, inputs: s.inputs, designer })); } catch { /* storage may be blocked */ }
}
function load(): { seed: number; inputs: Input[]; designer?: boolean } | null {
  try { const v = localStorage.getItem(SAVE_KEY); return v ? JSON.parse(v) : null; } catch { return null; }
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ } }

// ---------- Start screen ----------
function splash() {
  const saved = load();
  const seed = Math.floor(Math.random() * 1_000_000);
  app.innerHTML = `
  <div class="splash">
    <p class="label">Phase 1 prototype · rules v2</p>
    <h1>The Sword of Damocles</h1>
    <p>Autumn, 405 BC. You are Dionysius, a scribe who made himself general with supreme power. The cavalry of the rich families rode home ahead of you, sacked your house and fled to Aetna. Carthage, struck by plague, has made peace. You hold the generalship and the treasury, and you sleep in the naval dockyards. The citadel on the Island is not yet built.</p>
    <p>Each season you take <b>three actions</b> from a fixed menu. The people and factions of Syracuse act on their own, by the same rules. Plots warn you three times before they strike. Hold the city to the summer of 395.</p>
    <div class="row" style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
      <label for="seed" class="label">Seed</label>
      <input id="seed" type="number" value="${seed}" style="width:9em">
      <button class="primary" id="new">Begin</button>
      ${saved ? `<button id="resume">Resume your game (seed ${esc(saved.seed)})</button>` : ""}
    </div>
    <p class="small muted">The same seed and the same choices always give the same history. Everything here is invention except the people and the situation, which come from Diodorus, Plutarch and Aristotle.</p>
  </div>`;
  document.getElementById("new")!.onclick = () => {
    const v = Number((document.getElementById("seed") as HTMLInputElement).value) || seed;
    s = startGame(v); lastSeen = 0; save(); render();
  };
  const r = document.getElementById("resume");
  if (r && saved) r.onclick = () => { s = replay(saved.seed, saved.inputs); designer = !!saved.designer; render(); };
}

// ---------- Main screen ----------
function render() {
  if (!s) return splash();
  const g = s;
  app.innerHTML = `
    ${masthead(g)}
    ${ledger(g)}
    ${g.over ? ending(g) : ""}
    <nav class="tabs" aria-label="Sections">
      ${[["city", "The city"], ["season", "This season"], ["people", "People"], ["chron", "Chronicle"]].map(([k, l]) => `<button data-tab="${k}" class="${tab === k ? "on" : ""}">${l}</button>`).join("")}
    </nav>
    <div class="cols">
      <section class="${tab === "city" ? "on" : ""}" data-col="city">${cityCol(g)}</section>
      <section class="${tab === "season" ? "on" : ""}" data-col="season">${seasonCol(g)}</section>
      <section class="${tab === "people" || tab === "chron" ? "on" : ""}" data-col="people">${tab === "chron" ? chronicle(g) : peopleCol(g)}</section>
    </div>
    ${tab !== "chron" ? `<div class="foot-chron" style="margin-top:28px">${chronicle(g)}</div>` : ""}
    <div class="foot small">
      <label><input type="checkbox" id="designer" ${designer ? "checked" : ""}> Designer view: show the moves you can't see in play</label>
      <span class="muted">Seed ${g.seed}</span>
      <button id="restart">New game</button>
    </div>`;
  wire(g);
  lastSeen = g.log.length;
}

function masthead(g: GameState) {
  const slots = DATA.start.actionsPerSeason;
  return `<header class="mast">
    <h1>The Sword of Damocles</h1>
    <span class="when">${esc(seasonName(g.over ? g.over.season : g.season))}</span>
    <span class="muted small">Season ${Math.min(g.season + 1, DATA.start.seasons)} of ${DATA.start.seasons}</span>
    <span class="grow"></span>
    ${g.over ? "" : `<span class="label">Actions</span><span class="slots" aria-label="${g.slots} actions left">${Array.from({ length: slots }, (_, i) => `<i class="slot ${i < g.slots ? "full" : ""}"></i>`).join("")}</span>
    <button class="primary" id="end">End the season</button>`}
  </header>`;
}

function ledger(g: GameState) {
  const d = defense(g);
  const guardPay = g.guard.arrearsSeasons ? `<span class="warn">owed ${g.guard.owed}, won't defend you</span>` : g.factions.guard.mood <= 1 ? `<span class="warn">paid, but too angry to defend you</span>` : g.guard.refusing ? `<span class="warn">refusing duty</span>` : g.plots.some((p) => p.guardBacking) ? `<span class="warn">sold to a plot</span>` : `<span class="good">paid, and at your door</span>`;
  const bf = backingFaction(g);
  return `<div class="ledger">
    <div><span class="label">Silver</span><span class="v">${g.silver} <small>talents</small></span></div>
    <div><span class="label">Grain</span><span class="v ${g.grain < 3 ? "warn" : ""}">${g.grain} <small>months</small></span></div>
    <div><span class="label">Carthage</span><span class="clock" title="At 10 a Carthaginian army lands">${Array.from({ length: 10 }, (_, i) => `<i class="${i < g.clock ? "on" : ""}"></i>`).join("")}</span><span class="small muted">${g.clock} of 10</span></div>
    <div><span class="label">Land to give</span><span class="v">${g.land}</span></div>
    <div><span class="label">The guard</span><span class="v">${g.guard.strength} <small>strong, ${guardPay}</small></span></div>
    <div><span class="label">Your defense</span><span class="v" title="${esc(d.parts.map((p) => `${p.value} ${p.label}`).join(", "))}">${d.total}</span><span class="small muted">${esc(d.parts.map((p) => `${p.value} ${p.label}`).join(" + "))}</span></div>
    <div><span class="label">Your influence</span><span class="v">${playerInfluence(g)}</span><span class="small muted">${officesOf(g, PLAYER).length} offices${bf ? `, backed by ${esc(g.factions[bf].short)}` : ", no faction backs you"}</span></div>
    <div><span class="label">Government</span><span class="v" style="font-family:var(--display);font-weight:400">${esc(government(g))}</span></div>
  </div>`;
}

function ending(g: GameState) {
  const o = g.over!;
  const title = { killed: "You are dead", exiled: "Exile", deposed: "Deposed", fallen: "The city falls", survived: "You held Syracuse" }[o.reason] ?? "The end";
  return `<div class="ending" style="margin-top:14px">
    <h2 style="border:0">${esc(title)}</h2>
    <p>${esc(o.text)}</p>
    <p class="small muted">${esc(seasonName(o.season))}. Plots against you: ${g.counters.plots ?? 0}. Enemies made: ${g.counters.rivals ?? 0}. Political rivals: ${g.counters.politicalRivals ?? 0}. Seasons as tyrant: ${g.counters.tyrantSeasons ?? 0}.</p>
    <button class="primary" id="again">Play again</button>
  </div>`;
}

// ---------- The city ----------
function cityCol(g: GameState) {
  const offices = OFFICES.map((o) => {
    const h = g.offices[o];
    const text = o === "citadel" && !g.citadelBuilt ? `<span class="muted">not yet built${g.building?.what === "citadel" ? " (work has begun)" : ""}</span>` : h ? (h === PLAYER ? "<b>You</b>" : esc(Nm(h))) : `<span class="muted">empty</span>`;
    const eff = DATA.offices.find((x) => x.id === o)!.effect;
    return `<dt title="${esc(eff)}">${esc(capital(officeName(o).replace(/^the /, "")))}</dt><dd>${text}</dd>`;
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
    <div class="fhead"><h3>${esc(fa.name)}</h3><span><span class="num">${pow}</span> <span class="band ${b}">${b}</span></span></div>
    <div class="powerbar" title="Power ${pow} of 10. Marginal 0 to 2, Active 3 to 7, Dominant 8 to 10.">${bar}</div>
    <div class="small">Mood: <span class="mood mood-${fa.mood}">${moodName(fa.mood)}</span>${lead ? ` · Led by ${esc(Nm(lead.id))}` : ""}${fa.backing ? ` · <span class="warn">backs a plot</span>` : ""}</div>
    <div class="small">Wants: ${esc(goal)}</div>
    <div class="small">Agenda: <i>${esc(ag.name)}</i>${fa.agenda.done ? ` <span class="muted">(done${fa.agenda.result ? `, ${esc(fa.agenda.result)}` : ""})</span>` : ""}</div>
    <div class="steps">${ag.steps.map((st, i) => `<span class="${i < fa.agenda.step || fa.agenda.done ? "done" : ""}">${esc(st)}</span>`).join("")}</div>
    ${fa.agenda.done ? "" : `<div class="small muted">When complete: ${esc(ag.completes)}</div>`}
  </div>`;
}

// ---------- This season ----------
function seasonCol(g: GameState) {
  const prev = g.log.filter((e) => e.kind === "chronicle").slice(-1)[0];
  return `${prev && g.season > 0 ? `<div class="last"><span class="label">Last season</span><p class="small" style="margin:2px 0 0">${esc(prev.text)}</p></div>` : ""}
    <div><h2>${esc(seasonName(g.over ? g.over.season : g.season))}</h2>${feed(g)}</div>
    ${requests(g)}
    ${g.over ? "" : actions(g)}`;
}

function feed(g: GameState) {
  const season = g.over ? g.over.season : g.season;
  const es = g.log.filter((e) => e.season === season && e.kind !== "chronicle" && (designer || e.visible));
  const groups: [string, LogEntry[]][] = [
    ["The world", es.filter((e) => e.step === "world")],
    ["The people act", es.filter((e) => e.step === "people")],
    ["The factions act", es.filter((e) => e.step === "factions")],
    ["Your actions", es.filter((e) => e.step === "player")],
    ["Power changes hands", es.filter((e) => e.step === "power")],
    ["The sword", es.filter((e) => e.step === "sword")],
  ];
  return groups.filter(([, l]) => l.some((e) => designer || e.kind !== "change")).map(([t, l]) => `<div class="feedgroup"><span class="label">${t}</span><div class="feed">${l.map(entry).join("")}</div></div>`).join("") || `<p class="muted">Nothing has happened yet.</p>`;
}

function entry(e: LogEntry) {
  const cls = [e.kind, e.actor === PLAYER && e.kind === "event" ? "you" : "", e.visible ? "" : "hidden", e.n >= lastSeen ? "new" : ""].join(" ");
  const why = e.why && e.kind === "event" && !/^(Host|Grant|Revoke|Arrange|Petition|Bribe|Pardon|Imprison|Execute|Exile|Hand|Give|Propose|Seize|Strike|Build|Pay|Hire|Disarm|Raid|March|Watch|Plant|Turn|Force|Block|Expose|Envoy|Buy|Offer|Refuse)/.test(e.why) ? ` <span class="why">(${esc(e.why)})</span>` : "";
  if (e.kind === "change" && !designer) return "";
  return `<div class="e ${cls}">${esc(e.text)}${why}${e.visible ? "" : ` <span class="tag">hidden</span>`}</div>`;
}

function requests(g: GameState) {
  if (!g.requests.length || g.over) return "";
  return `<div><h2>Petitions to you</h2>
    <p class="small muted">Refusing in public costs a petitioner influence and opinion. A second refusal makes a grudge and an enemy. Petitions you leave unanswered are refused when the season ends.</p>
    ${g.requests.map((r) => {
      const p = g.people[r.from];
      const what = r.kind === "office" ? `asks for ${officeName(r.office!)}` : r.kind === "silver" ? "asks for a gift of 1 silver" : r.kind === "citizenship" ? "demands land and citizenship for the guard" : r.kind === "marriage" ? "offers a marriage between your houses" : "asks for land";
      const grant = grantArgs(g, r);
      const pv = grant ? preview(g, grant.a, grant.args) : null;
      return `<div class="req"><span class="t"><b>${esc(capital(p.name))}</b> ${esc(what)}.${r.owed ? " <i>You owe him a favour.</i>" : ""}${p.refusals ? " <i>You refused him once already.</i>" : ""}</span>
        <button data-grant="${r.id}" ${pv?.ok ? "" : "disabled"} title="${esc(pv?.ok ? "Uses one action" : pv?.why ?? "")}">Grant</button>
        <button data-refuse="${r.id}">Refuse</button>
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
  return `<div><h2>Your actions</h2>
    <p class="small muted">Choose an action to see its target, cost and odds before you commit. A roll is one die plus modifiers; 4 or more succeeds.</p>
    ${areas.map((area) => `<div class="area"><span class="label">${esc(area)}</span>
      ${items.filter((i) => i.area === area).map((i) => `
        <button class="act ${openAction === i.id ? "open" : ""} ${i.blocked ? "off" : ""}" data-act="${i.id}" aria-expanded="${openAction === i.id}">
          <span>${esc(i.name)}${i.reach ? ' <span class="tag">reach</span>' : ""}</span><span class="c">${esc(i.blocked ?? i.cost)}</span>
        </button>
        ${openAction === i.id ? panel(g, i) : ""}`).join("")}
    </div>`).join("")}
    <p style="margin-top:14px"><button class="primary" id="end2">End the season</button> <span class="small muted">${g.slots} action${g.slots === 1 ? "" : "s"} left.</span></p></div>`;
}

function panel(g: GameState, i: ReturnType<typeof menu>[number]) {
  const seconds = i.targets ? secondOptions(g, i.id, args) : secondOptions(g, i.id, args);
  const pv = preview(g, i.id, args);
  let odds = "";
  if (pv.ok && pv.auto) odds = `<span class="good">Automatic: no roll.</span>`;
  else if (pv.ok) odds = `Needs <span class="need">${pv.need}+</span> on one die${pv.mods.length ? `, with ${pv.mods.map((m) => `${esc(m.label)} ${sign(m.value)}`).join(", ")}` : ", no modifiers"}. Chance <span class="chance">${Math.round((pv.chance ?? 0) * 100)}%</span>.`;
  else odds = `<span class="muted">${esc(pv.why)}</span>`;
  return `<div class="panel">
    <div class="small"><b>Cost:</b> ${esc(i.cost)}. <b>Roll:</b> ${esc(i.roll)}.</div>
    <div class="small"><b>If it works:</b> ${esc(i.success)}${i.failure ? ` <b>If not:</b> ${esc(i.failure)}` : ""}</div>
    ${i.targets || seconds.length ? `<div class="row">
      ${i.targets ? `<label class="label" for="t-${i.id}">Target</label><select id="t-${i.id}" data-arg="target"><option value="">Choose…</option>${i.targets.map((o) => `<option value="${esc(o.value)}" ${args.target === o.value ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select>` : ""}
      ${seconds.length ? `<label class="label" for="s-${i.id}">${esc(i.secondLabel ?? "Option")}</label><select id="s-${i.id}" data-arg="second"><option value="">Choose…</option>${seconds.map((o) => `<option value="${esc(o.value)}" ${args.second === o.value ? "selected" : ""}>${esc(o.label)}</option>`).join("")}</select>` : ""}
    </div>` : ""}
    <div class="odds">${odds}</div>
    <div class="row"><button class="primary" id="do" ${pv.ok ? "" : "disabled"}>${esc(i.name)}</button><button id="cancel">Cancel</button></div>
  </div>`;
}

// ---------- People ----------
function peopleCol(g: GameState) {
  return `${plots(g)}${rivals(g)}${political(g)}<div><h2>The people</h2>${people(g)}</div>`;
}

function plots(g: GameState) {
  const ps = g.plots.filter((p) => designer || p.stage >= 1);
  const body = ps.length ? ps.map((pl) => {
    const leaderF = g.people[pl.leader].faction;
    const fname = leaderF === "ruler" ? "your household" : g.factions[leaderF as FactionId].short;
    const st = plotStrength(g, pl);
    const known = designer ? pl.members : pl.known;
    const what = pl.stage === 1 ? "Something is off. You don't know who." : pl.stage === 2 ? `${capital(fname)} are plotting. You don't know who leads it.` : `Named. It can strike ${pl.namedSince < g.season ? "this season" : "next season"} once it is strong enough.`;
    return `<div class="plot"><span class="stage stage-${pl.stage}">${stageName(pl.stage)}</span> · ${esc(what)}
      ${known.length ? `<div class="small">Names you have: ${known.map((k) => esc(Nm(k))).join(", ")}.</div>` : ""}
      ${pl.informer || designer ? `<div class="small">Strength ${st.total} (${esc(st.parts.map((p) => `${p.label} ${sign(p.value)}`).join(", "))}).</div>` : ""}</div>`;
  }).join("") : `<p class="small muted">No warnings. That you know of.</p>`;
  return `<div><h2>Warnings</h2>${body}<p class="small muted">A plot must pass Whispers, Rumors and Named, a season at least at each, and reach strength 6, before it can strike. It must beat your defense of ${defense(g).total}.</p></div>`;
}

function rivals(g: GameState) {
  const rs = others(g).filter((p) => p.rival && p.status !== "dead");
  const waiting = g.waiting.filter((w) => g.people[w].status !== "dead");
  return `<div><h2>Enemies</h2>
    ${rs.length ? rs.map((p) => {
      const r = p.rival!;
      const mem = r.memory[r.memory.length - 1];
      return `<div class="rival"><div class="fhead"><b>${esc(capital(p.name))}</b><span class="rank">Rank ${r.rank}, ${esc(rankTitle(r.rank))}</span></div>
        <div class="small">Scars: ${r.scars.map((sc) => `<span title="${esc(originById(sc)?.effect)}">${esc(originById(sc)?.name ?? sc)}</span>`).join(", ")} · ${esc(statusWord(p))}</div>
        ${mem ? `<div class="memory">He remembers: ${esc(mem.text)}.</div>` : ""}
        ${p.agenda?.id === "yourFall" ? `<div class="small warn">Agenda, Your fall: ${esc(agendaById("yourFall").steps.map((st, i) => (i < p.agenda!.step ? `${st} (done)` : st)).join(", "))}</div>` : ""}</div>`;
    }).join("") : `<p class="small muted">No one has sworn against you yet.</p>`}
    ${waiting.length ? `<p class="small muted">Waiting in the wings: ${waiting.map((w) => esc(Nm(w))).join(", ")}.</p>` : ""}
    <p class="small muted">Enemies are made by wounds: a failed arrest, exile, a killed kinsman, public humiliation, or a failed plot they survived. At most 3 at a time.</p></div>`;
}

function political(g: GameState) {
  const ps = others(g).filter((p) => p.political && p.status !== "dead");
  return `<div><h2>Political rivals</h2>
    ${ps.length ? ps.map((p) => {
      const r = p.political!;
      const title = DATA.politicalRanks.find((x: any) => x.rank === r.rank)!.title;
      return `<div class="rival"><div class="fhead"><b>${esc(capital(p.name))}</b><span class="rank pol">${esc(title)}</span></div>
        <div class="small">${esc(r.type)} · influence <span class="num">${influence(g, p.id)}</span> against your ${playerInfluence(g)} · opinion <span class="op ${p.opinion < 0 ? "neg" : p.opinion > 0 ? "pos" : ""}">${sign(p.opinion)}</span>${p.bound ? " · bound to you" : ""}</div>
        ${p.agenda?.id === "takePlace" ? `<div class="small warn">Agenda, Take his place: ${esc(agendaById("takePlace").steps.map((st, i) => (i < p.agenda!.step ? `${st} (done)` : st)).join(", "))}</div>` : ""}</div>`;
    }).join("") : `<p class="small muted">No one is climbing toward your place yet.</p>`}
    <p class="small muted">Political rivals are made by ambition: anyone after office or power whose influence comes within 3 of yours. They want your place, not your life. At most 2 at a time.</p></div>`;
}

function statusWord(p: Person) {
  return { free: "in the city", held: "in your prison", outside: "outside the walls", dead: "dead", absent: "not yet in the story" }[p.status];
}

function people(g: GameState) {
  const order: (FactionId | "ruler")[] = ["family", "rich", "citizens", "guard"];
  return order.map((f) => {
    const ps = others(g).filter((p) => p.faction === f && p.status !== "absent");
    if (!ps.length) return "";
    return `<div class="area"><span class="label">${esc(g.factions[f as FactionId].name)}</span>${ps.map((p) => person(g, p)).join("")}</div>`;
  }).join("");
}

function person(g: GameState, p: Person) {
  const offs = officesOf(g, p.id);
  const secretOk = designer || p.knownUntil >= g.season;
  const plot = g.plots.find((pl) => pl.members.includes(p.id));
  const plotLine = secretOk ? (plot ? `<span class="warn">In a plot against you.</span>` : "In no plot.") : `<span class="muted">Plots and schemes: unknown until you Watch him.</span>`;
  return `<details class="person"><summary><span>${esc(capital(p.name))}${offs.length ? ` <span class="tag">${esc(offs.map((o) => capital(officeName(o).replace(/^the /, ""))).join(", "))}</span>` : ""}${p.status !== "free" ? ` <span class="tag">${esc(statusWord(p))}</span>` : ""}</span>
      <span class="op ${p.opinion < 0 ? "neg" : p.opinion > 0 ? "pos" : ""}" title="Opinion of you, -3 to +3">${sign(p.opinion)}</span></summary>
    <div class="body">
      <div><i>${esc(p.role)}</i></div>
      <div>Traits: ${p.traits.map((t) => esc(traitName(t))).join(", ")} · Ambition: ${esc(p.ambition)} · Influence ${influence(g, p.id)}</div>
      ${p.grudges.length ? `<div>Grudges: ${p.grudges.map((x) => esc(x.reason)).join("; ")}.</div>` : `<div class="muted">No grudges.</div>`}
      ${p.bound ? "<div>Bound to you.</div>" : ""}${p.owedFavor ? "<div>You owe him a favour.</div>" : ""}
      <div>${plotLine}</div>
    </div></details>`;
}

// ---------- Chronicle ----------
function chronicle(g: GameState) {
  const c = fullChronicle(g);
  return `<div class="chron"><h2>The chronicle</h2>${c.length ? c.slice().reverse().map((x) => `<p><b>${esc(x.season)}.</b> ${esc(x.text)}</p>`).join("") : `<p class="muted">The chronicle begins when the first season ends.</p>`}</div>`;
}

// ---------- Events ----------
function wire(g: GameState) {
  for (const id of ["end", "end2"]) document.getElementById(id)?.addEventListener("click", () => { endSeason(g); openAction = null; args = {}; save(); render(); window.scrollTo({ top: 0 }); });
  document.getElementById("restart")?.addEventListener("click", () => { clearSave(); s = null; splash(); });
  document.getElementById("again")?.addEventListener("click", () => { clearSave(); s = null; splash(); });
  document.getElementById("designer")?.addEventListener("change", (e) => { designer = (e.target as HTMLInputElement).checked; save(); render(); });
  app.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((b) => (b.onclick = () => { tab = b.dataset.tab!; render(); }));
  app.querySelectorAll<HTMLButtonElement>("[data-act]").forEach((b) => (b.onclick = () => {
    const id = b.dataset.act!;
    openAction = openAction === id ? null : id; args = {};
    const item = menu(g).find((m) => m.id === id);
    if (item?.targets?.length === 1) args.target = item.targets[0].value;
    render();
    document.querySelector(`[data-act="${id}"]`)?.scrollIntoView({ block: "nearest" });
  }));
  app.querySelectorAll<HTMLSelectElement>("[data-arg]").forEach((sel) => (sel.onchange = () => {
    const k = sel.dataset.arg as keyof Args;
    args = { ...args, [k]: sel.value || undefined };
    if (k === "target") args.second = undefined;
    render();
    (document.getElementById(sel.id) as HTMLElement | null)?.focus();
  }));
  document.getElementById("do")?.addEventListener("click", () => {
    if (!openAction) return;
    act(g, openAction, args); openAction = null; args = {}; save(); render();
  });
  document.getElementById("cancel")?.addEventListener("click", () => { openAction = null; args = {}; render(); });
  app.querySelectorAll<HTMLButtonElement>("[data-grant]").forEach((b) => (b.onclick = () => {
    const r = g.requests.find((x) => x.id === b.dataset.grant);
    const ga = r && grantArgs(g, r);
    if (ga) { act(g, ga.a, ga.args); save(); render(); }
  }));
  app.querySelectorAll<HTMLButtonElement>("[data-refuse]").forEach((b) => (b.onclick = () => { refuseRequest(g, b.dataset.refuse!); save(); render(); }));
}

splash();
