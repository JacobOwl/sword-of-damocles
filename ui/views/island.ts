// The island view (Phase 2): the map of Sicily with its cities, roads and armies, and Carthage's council.
// It only reads the state; every rule is in src/core.
import {
  CARTHAGE, ISLAND, NODES, ROUTES, armyName, blocDef, capital, carthageAgenda, cityGrain, cityMen, cityWalls, goalDef, menWords,
  moodWord, nodeName, prefers, sideName, goOverMods, keeperValue, PLAYER, yourArmy, path, reachable, preview, act, battleForecast, friendly, hostileTo, warCard, supplyOn, foodState, ravaged, SUPPLY, townBoardsOn, townSeats, houseName, townDivided, sendsSupport,
} from "../../src/core/index.ts";
import type { Handlers } from "../app/clicks.ts";
import * as sound from "../lib/sound.ts";
import type { Army, GameState } from "../../src/core/index.ts";
import { esc, linkNames, ui, who } from "../lib/text.ts";
import * as A from "../components/island-art.ts";
import { nowLine } from "../components/now.ts";
import { LIBRARY_PICTURES } from "../components/library-pictures.ts";
import { warStrip } from "../components/war.ts";


const SIDE_COLOR: Record<string, string> = {
  syracuse: "var(--blood)", ally: "#b0563f", free: "var(--muted)", tributary: "#8a6aa0", carthage: "var(--punic)", exiles: "#2a4a5a",
};

function mapSvg(g: GameState): string {
  // Drawn with the map kit in ui/island-art.ts (the art thread); this function only decides what goes where.
  const isl = g.island!;
  const at = (id: string) => NODES.find((n) => n.id === id)!;
  const P = (id: string): [number, number] => { const n = at(id); return [A.X(n.lon), A.Y(n.lat)]; };
  const roads = ROUTES.map((r) => A.routePath(P(r.from), P(r.to), (r as { sea?: boolean }).sea ? "sea" : "road", r.days)).join("");
  const LABEL: Record<string, [number, number, "start" | "middle" | "end"]> = {
    aetna: [-14, 4, "end"], catana: [16, 6, "start"], messana: [-12, -14, "end"], panormus: [0, -16, "middle"], motya: [12, 18, "start"],
    leontini: [-14, 8, "end"], syracuse: [0, 30, "middle"],
  };
  const marks = NODES.map((n) => {
    const c = isl.cities[n.id];
    const [x, y] = P(n.id);
    return `<g class="citymark${ui.city === n.id ? " on" : ""}" data-city="${n.id}" data-x="${x.toFixed(1)}" data-y="${y.toFixed(1)}" role="button" tabindex="0" aria-label="${esc(n.name)}: open its sheet">` + A.cityMark(x, y, {
      name: n.name, side: c.side, walled: cityWalls(g, n.id) > 0, fort: n.type === "fort", capital: n.id === "syracuse",
      besieged: isl.armies.some((a) => a.siege === n.id), approx: !!n.approx, label: LABEL[n.id],
    }) + "</g>";
  }).join("");
  // Your army's reach (second test: "I don't understand ... what counts as near"): a dotted ring on each town within
  // the days a town can go over to your army (data/island.json goOverDays).
  const ya = yourArmy(g);
  const reach = ya ? NODES.filter((n) => n.id !== ya.at && (path(ya.at, n.id)?.days.at(-1) ?? 999) <= ISLAND.rules.goOverDays).map((n) => { const [x, y] = P(n.id); return `<circle cx="${x.toFixed(1)}" cy="${(y - 2).toFixed(1)}" r="24" class="reach-ring"/>`; }).join("") : "";
  // Switch "armySupply": burnt fields, a scorched ring that fades when the year is out.
  const burnt = NODES.filter((n) => ravaged(g, n.id)).map((n) => { const [x, y] = P(n.id); return `<circle cx="${x.toFixed(1)}" cy="${(y - 2).toFixed(1)}" r="17" class="ravaged-ring"><title>${esc(n.name)}: its fields were burnt</title></circle>`; }).join("");
  const armies = isl.armies.map((a, i) => {
    const [x, y] = P(a.at);
    const dir = a.side === "syracuse" ? 1 : -1;
    const mark = A.armyMark(x + dir * 22, y - 20 - i * 4, { side: a.side, men: `${Math.round(a.men * ISLAND.rules.menPerPoint / 1000)}k`, label: armyName(g, a), dir });
    return a.side === "syracuse" && supplyOn(g) && !g.over ? `<g class="drag-army" data-drag-army><title>Drag to a town to see the route and the towns that might go over</title>${mark}</g>` : mark;
  }).join("");
  // War focus: Carthage's hired men waiting at home, drawn on the sea lane, so a landing is never a surprise.
  const wc = warCard(g);
  const home = wc && isl.war && !isl.armies.some((a) => a.side === "carthage") && isl.carthage.mercs + isl.carthage.levy > 0
    ? A.armyMark(34, A.Y(37.2) + 26, { side: "carthage", men: `${Math.round((isl.carthage.mercs + isl.carthage.levy) * ISLAND.rules.menPerPoint / 1000)}k`, label: wc.landingDue !== undefined ? "Carthage's army, ready to sail: it lands next season" : "Carthage's men, gathering at home", dir: 1 }) : "";
  return `<svg viewBox="0 0 ${A.W} ${A.H}" class="island-map" role="img" aria-label="Map of Sicily: ${NODES.map((n) => `${n.name}, ${sideName(isl.cities[n.id].side)}`).join("; ")}">
    ${A.islandBase()}${roads}${A.toCarthage(A.Y(37.2))}${burnt}${reach}${marks}${armies}${home}
  </svg>`;
}

// Switch "commission": who leads the army in the field, and who keeps the citadel while you are away.
function leadLine(g: GameState, a: Army) {
  const c = g.campaign;
  if (!c || c.army !== a.id) return "";
  if (c.leader === PLAYER) {
    const k = keeperValue(g, c.keeper, false);
    return ` You lead it in person. ${esc(capital(k.label))} (your defense ${k.value > 0 ? "+" : ""}${k.value}), and every plot at home is 1 stronger while you are away.`;
  }
  return c.lost ? " Its leader is lost; his officers bring it on under your orders." : ` ${linkNames(esc(capital(g.people[c.leader].name)))} leads it.`;
}
function armyLine(g: GameState, a: Army) {
  const where = a.siege ? `besieging ${nodeName(a.siege)}` : `at ${nodeName(a.at)}`;
  const food = a.food <= 0 ? `<span class="warn">no food left</span>` : `${a.food} ${a.food === 1 ? "season" : "seasons"} of food`;
  const guard = a.side === "syracuse" && a.guard ? `; ${menWords(a.guard)} of them are your guard${a.at === "syracuse" ? "" : ", away from your door"}` : "";
  if (supplyOn(g)) { // switch "armySupply": fed, short or starving, and from where
    const f = foodState(g, a);
    const cls = f.word === "fed" ? "good" : "warn";
    return `<li><b>${esc(capital(armyName(g, a)))}</b>: ${menWords(a.men)}, ${where}, <span class="${cls}">${f.word}</span> (${a.food} ${a.food === 1 ? "season" : "seasons"} of food in the baggage)${guard}.${leadLine(g, a)}<br><span class="small muted">${esc(f.why)} An army refills from the friendly towns within ${SUPPLY.knobs.supplyDays} days' march, one month of grain for every ${SUPPLY.knobs.pointsPerGrain * 5},000 men, so a big army empties its own country.</span></li>`;
  }
  const eats = a.side === "syracuse" ? `<br><span class="small muted">How it eats: one season of food each season. It refills to ${ISLAND.rules.foodOnMuster} in a town of yours or an ally's with ${ISLAND.rules.resupplyGrain} or more months of grain, if it is not besieging. In enemy land, Forage for one more season (the town hates you for it). With no food, men desert and sicken.</span>` : "";
  return `<li><b>${esc(capital(armyName(g, a)))}</b>: ${menWords(a.men)}, ${where}, ${food}${guard}.${leadLine(g, a)}${eats}</li>`;
}

// The chance a town goes over this season, from the same roll the world step makes.
function overNotes(g: GameState, id: string): string[] {
  const out: string[] = [];
  for (const side of ["syracuse", "carthage"] as const) {
    const m = goOverMods(g, id, side);
    if (!m) continue;
    const t = m.reduce((x, y) => x + y.value, 0);
    const p = [1, 2, 3, 4, 5, 6].filter((d) => d + t >= ISLAND.rules.goOverNeed).length;
    if (!p) continue; // the world step makes no roll it cannot win
    out.push(`<span class="${side === "syracuse" ? "good" : "warn"}">may go over to ${side === "syracuse" ? "you" : "Carthage"} (${p} in 6 next season)</span>`);
    break;
  }
  return out;
}
function cityRows(g: GameState) {
  const isl = g.island!;
  return NODES.map((n) => {
    const c = isl.cities[n.id];
    const w = cityWalls(g, n.id);
    const sieged = isl.armies.find((a) => a.siege === n.id);
    const leanWord = n.id === "syracuse" ? "" : c.lean >= 2 ? "warm to you" : c.lean === 1 ? "leans your way" : c.lean === 0 ? "undecided" : c.lean === -1 ? "cool to you" : "hostile to you";
    const notes = [sieged ? `<span class="warn">besieged by ${esc(armyName(g, sieged))}</span>` : "", c.sacked ? "sacked, still in ruins" : "", c.fear ? "afraid of you" : "", ...overNotes(g, n.id)].filter(Boolean).join("; ");
    return `<tr class="${ui.city === n.id ? "on" : ""}"><th scope="row"><button type="button" class="linkish" data-city="${n.id}">${esc(n.name)}</button></th><td><span class="side" style="--c:${SIDE_COLOR[c.side]}">${esc(capital(sideName(c.side)))}</span></td>
      <td>${w ? `walls ${w}` : "no walls"}</td><td>${cityGrain(g, n.id)} months</td><td>${menWords(cityMen(g, n.id))}</td><td>${esc(leanWord)}</td><td class="small notes">${notes || `<span class="muted">${esc(n.detail)}</span>`}</td></tr>`;
  }).join("");
}

// The city sheet, opened by clicking a city on the map or in the table (Jacob: "I should be able to click on the city
// and get info about it"). Everything it says is read from the state and the rules in src/core/island.ts.
const LEAN_WORD = (l: number) => (l >= 2 ? "warm to you" : l === 1 ? "leans your way" : l === 0 ? "undecided" : l === -1 ? "cool to you" : "hostile to you");
function citySheet(g: GameState, id: string) {
  const isl = g.island!;
  const n = NODES.find((x) => x.id === id)!;
  const c = isl.cities[id];
  const R = ISLAND.rules;
  const w = cityWalls(g, id);
  const sieged = isl.armies.find((a) => a.siege === id);
  const here = isl.armies.filter((a) => a.at === id);
  const rows: [string, string][] = [
    ["Side", `${capital(sideName(c.side))}`],
    ["Walls", w ? `${w} (each point makes it harder to storm and to frighten)` : "none: an open town"],
    ["Grain", `${cityGrain(g, id)} months${sieged ? ", and falling under siege" : ""}`],
    ["Men", menWords(cityMen(g, id))],
  ];
  if (id !== "syracuse") rows.push(["Toward you", `${capital(LEAN_WORD(c.lean))}. The warmer a town, the likelier it joins you when you send an embassy, or when your army ends a season within ${R.goOverDays} days of it (the dotted rings on the map).`]);
  if (id !== "syracuse") rows.push(["Fear of you", c.fear ? `${c.fear} of 3. Each sack you make adds 1 to every free town; it fades 1 each summer. Fear helps an embassy, helps a town go over to your army, and may make it surrender when your army arrives (one die plus fear, +1 if your army is twice its men, less its walls, −2 if Carthage's army is near; needs ${R.surrenderNeed}).` : "none. Sacking a town makes the others afraid."]);
  if (c.side === "ally" || c.side === "syracuse") rows.push(["Pays you", `${R.allySilver} silver each summer while it has grain, and sends men when you muster`]);
  if (c.side === "tributary") rows.push(["Pays Carthage", "tribute each summer, under the peace of 405"]);
  if (c.sacked) rows.push(["Ruins", "sacked, and still rebuilding"]);
  if (g.board && id !== "syracuse" && (c.side === "ally" || c.side === "syracuse")) rows.push(["Command", g.board.commands[id] ? `${who(g.board.commands[id])} holds it for you. A man who is no friend of yours may open its gates when Carthage's army comes.` : "no one: give it to a man with Give a city's command"]);
  const notes = overNotes(g, id);
  const how = id === "syracuse" ? "" : c.side === "syracuse" ? "It is yours." : c.side === "ally" ? "It is your ally: keep it warm, and keep Carthage's army away from it." : c.side === "carthage" || c.side === "exiles" ? "To take it: Muster, then Send the army to besiege it; Storm the walls or starve it out. It will not go over or surrender from fear." : "To win it: Embassy to a city (lean and fear help), or march your army near it and it may go over; or besiege and take it.";
  return `<div class="citysheet"><div class="fhead"><h3>${esc(n.name)}</h3><button type="button" class="small" data-city="">Close</button></div>
    <p class="small muted">${esc(c.side === n.side ? n.detail : `Before: ${n.detail} Now ${sideName(c.side)}.`)}</p>
    <dl class="sheetdl">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
    ${housesBlock(g, id)}
    ${sieged ? `<p class="small warn">Besieged by ${esc(armyName(g, sieged))}.</p>` : ""}${here.length && !sieged ? `<p class="small">Here: ${here.map((a) => esc(armyName(g, a))).join(", ")}.</p>` : ""}
    ${notes.length ? `<p class="small">Next season it ${notes.join("; ")}.</p>` : ""}
    ${how ? `<p class="small"><b>What you can do.</b> ${esc(how)}</p>` : ""}${marchHere(g, id)}${mapResult(g)}</div>`;
}

// Switch "townBoards": the town's three leading houses, each with its head and which way it leans.
const HOUSE_LEAN: Record<string, [string, string]> = { you: ["your friend", "good"], carthage: ["Carthage's friend", "warn"], town: ["for the town alone", "muted"] };
function housesBlock(g: GameState, id: string) {
  if (!townBoardsOn(g) || id === "syracuse") return "";
  const x = townSeats(g, id);
  if (!x.length) return "";
  const c = g.island!.cities[id];
  const lines = x.map((seat, i) => {
    const [w, cls] = HOUSE_LEAN[seat.lean];
    return `<li>${i === 0 ? "<b>First house:</b> " : ""}${esc(capital(houseName(g, seat)))}: <span class="${cls}">${esc(w)}</span></li>`;
  }).join("");
  const sup = sendsSupport(g, id);
  const state = townDivided(g, id) ? `<p class="small warn">Divided: its houses pull three ways. It is easier for any army to win over${c.side === "ally" || c.side === "syracuse" ? ", and it sends you no silver or men" : ""}.</p>`
    : (c.side === "ally" || c.side === "syracuse") && !sup.ok ? `<p class="small warn">It sends you no silver or men: ${esc(sup.why!)}.</p>` : "";
  return `<h4 class="small">Its leading houses</h4><ul class="small houses">${lines}</ul>${state}
    <p class="small muted">Each house for you adds 1 to the town going over to you, each for Carthage takes 1 away (2 at most). Win a house with Court a house; a friend inside a town you besiege may open a gate.</p>`;
}

// Orders from the map (second test: "kinda sucks to keep tabbing back and forth between the map and the army commands").
// The same action as Send the army in the season column, with its checks; one click is one action.
function marchHere(g: GameState, id: string) {
  const a = yourArmy(g);
  if (!a || g.over || a.at === id || !reachable(g, a.at).includes(id)) return "";
  const days = path(a.at, id)?.days.at(-1);
  const pv = preview(g, "sendArmy", { target: id, second: "spare" });
  if (!pv.ok) return `<p class="small muted">Send the army here (${days} days): ${esc(pv.why ?? "not now")}.</p>`;
  const c = g.island!.cities[id];
  const fc = battleForecast(g, a, id);
  const fight = fc ? ` <span class="${fc.win >= 0.5 ? "good" : "warn"}">A battle: you win ${Math.round(fc.win * 100)} in 100.</span>` : "";
  const btn = (order: string, label: string) => `<button type="button" class="small" data-march="${id}" data-order="${order}">${esc(label)}</button>`;
  const buttons = friendly("syracuse", c.side) ? btn("spare", `March here (${days} days)`) : `${btn("spare", `March on it (${days} days), spare it if it falls`)} ${hostileTo(g, "syracuse", c.side) || c.side === "free" ? btn("sack", "March on it, sack it if it falls") : ""}`;
  return `<p class="small marchhere"><b>Orders.</b> ${buttons} <span class="muted">Uses one action.</span>${fight}</p>`;
}
function mapResult(g: GameState) {
  const r = ui.lastResult;
  if (!r || r.where !== "map") return "";
  const lines = g.log.slice(r.from, r.to).filter((e) => (e.visible || ui.designer) && (e.kind === "event" || e.kind === "change")).map((e) => `<li>${linkNames(e.text)}</li>`).join("");
  return `<div class="result" role="status"><span class="label">What happened: ${esc(r.title)}</span>${lines ? `<ul>${lines}</ul>` : ""}</div>`;
}
export const islandHandlers: Handlers = {
  click: {
    "[data-march]": (b, c) => {
      const id = b.dataset.march!, from = c.g.log.length;
      act(c.g, "sendArmy", { target: id, second: b.dataset.order });
      sound.tick();
      ui.lastResult = { where: "map", title: `you sent the army to ${nodeName(id)}`, from, to: c.g.log.length };
      ui.city = id; c.save(); c.render();
    },
  },
};

function mapKey() {
  const sides: [string, string][] = [["syracuse", "yours"], ["ally", "your ally"], ["free", "free"], ["tributary", "pays tribute to Carthage"], ["carthage", "Carthage's"], ["exiles", "held by the exiles"]];
  return `<div class="mapkey small"><span class="label">Key</span>
    ${sides.map(([k, l]) => `<span><i class="sw" style="background:${A.SIDE_COLOR[k]}"></i>${esc(l)}</span>`).join("")}
    <span>Tower: walled city · roofs: open town · hill: fortress</span><span>Shields: armies, men in thousands · road numbers: days' march</span><span>Dotted rings: towns within 6 days of your army, which may go over to you</span>
    <span class="muted">Click a city for its sheet, and to send your army there.</span></div>`;
}

function carthagePanel(g: GameState) {
  const c = g.island!.carthage;
  const goal = goalDef(c.goal);
  const blocs = CARTHAGE.blocs.map((b: any) => {
    const st = c.blocs[b.id];
    const want = b.votes ? prefers(g, b.id) : null;
    return `<li><b>${esc(capital(b.name))}</b> <span class="small muted">power ${st.power} of 10, ${esc(moodWord(st.mood))}${b.votes ? "" : ", no vote"}</span><br>
      <span class="small">${esc(b.detail)}${want ? ` Now they want: <b>${esc(goalDef(want.goal).name)}</b> (${esc(want.why)}).` : ""}</span></li>`;
  }).join("");
  const next = carthageAgenda(g).map((x) => `<li class="${x.ready ? "" : "muted"}">${esc(x.name)}${x.ready ? "" : " (not now)"}</li>`).join("");
  const men = (CARTHAGE.people as any[]).map((p) => {
    const st = c.people[p.id];
    const words = { free: "at home", command: "in command of the war", disgraced: "in disgrace", dead: "dead" }[st.status];
    const face = LIBRARY_PICTURES[`face:${p.id}`];
    const img = face ? `<img class="cface${st.status === "dead" ? " dead" : ""}" src="${esc(face)}" alt="" width="44" height="44">` : "";
    return `<li>${img}<span>${esc(p.name)} <span class="small muted">(${esc(p.role)}; ${esc(words)}${p.kind === "history" ? "; real person" : "; invented"})</span></span></li>`;
  }).join("");
  const plague = c.plagueUntil >= g.season ? `<p class="warn small">Plague is in Carthage.</p>` : "";
  const revolt = c.revolt ? `<p class="warn small">The Libyans are in revolt.</p>` : "";
  return `<div class="carthage">
    <div class="fhead"><h2>Carthage</h2><img class="ccoin" src="${esc(LIBRARY_PICTURES["coin:carthage"])}" alt="Carthage's coin: a horse, and a date palm" title="Carthage's first coins (about 410 to 390 BC) bore a horse and a date palm. The drawing is invention." width="48" height="48"></div>
    <p><span class="label">Its goal</span> <b>${esc(goal.name)}</b>. ${esc(goal.text)} <span class="small muted">Why: ${esc(c.goalWhy)}.</span></p>
    <p class="small">${g.island!.war ? `<span class="warn">At war with you since ${esc(seasonWord(g, g.island!.warSince))}.</span>` : "At peace with you."}
      Anger toward Syracuse ${g.clock} of 10. Its treasury holds ${c.silver} silver; at home it has ${c.mercs ? `${menWords(c.mercs)} hired` : "no hired men"} and ${c.levy ? `${menWords(c.levy)} in Libyan levies` : "no Libyan levies"}; ${c.ships} squadrons of ships.
      ${c.offer >= g.season - 1 && g.island!.war ? "<b>Its envoys are in Syracuse with terms.</b>" : ""}</p>
    ${plague}${revolt}
    <h3>The council</h3><ul class="blocs">${blocs}</ul>
    <p class="small muted">The council picks the goal the most power wants. If the Elders are against it, the people's assembly decides (after Aristotle, who wrote two generations later).</p>
    <h3>What it does next, in order</h3><ol class="small">${next}</ol>
    <h3>Its men</h3><ul class="small cmen">${men}</ul>
    <p class="small muted">Their faces are invention: no source shows them.</p>
  </div>`;
}
function seasonWord(g: GameState, n: number) {
  const y = 405 - Math.floor(n / 4), q = n % 4;
  return q === 0 ? `autumn ${y} BC` : q === 1 ? `winter ${y}/${y - 1} BC` : `${q === 2 ? "spring" : "summer"} ${y - 1} BC`;
}

export function islandView(g: GameState): string {
  const isl = g.island!;
  const armies = isl.armies.length ? `<ul>${isl.armies.map((a) => armyLine(g, a)).join("")}</ul>` : `<p class="muted small">No army is in the field.</p>`;
  const abroad = g.log.filter((e) => e.visible && e.season === g.season && (e.actor === "carthage" || /army|siege|Battle|march|gates|ally|tribute|Plague/i.test(e.text)) && e.kind !== "chronicle").slice(-12);
  return `${nowLine(g)}${warStrip(g)}<div class="island">
    <div class="island-main">
      <h2>Sicily</h2>
      <figure class="mapfig">${mapSvg(g)}
        ${mapKey()}
        <figcaption class="small muted">The helmet is your army, the palm Carthage's. Aetna's site is uncertain. Coast and rivers: Natural Earth (today's); the hills are drawn by eye.</figcaption></figure>
      ${ui.city && isl.cities[ui.city] ? citySheet(g, ui.city) : ""}
      <h3>Armies</h3>${armies}
      ${abroad.length ? `<h3>This season abroad</h3><ul class="small">${abroad.map((e) => `<li>${linkNames(e.text)}${e.why ? ` <span class="muted">(${esc(e.why)})</span>` : ""}</li>`).join("")}</ul>` : ""}
      <h3>The cities</h3>
      <div class="tablewrap"><table class="cities"><thead><tr><th>City</th><th>Side</th><th>Walls</th><th>Grain</th><th>Men</th><th>Toward you</th><th class="notes">Notes</th></tr></thead><tbody>${cityRows(g)}</tbody></table></div>
    </div>
    ${carthagePanel(g)}
  </div>`;
}
