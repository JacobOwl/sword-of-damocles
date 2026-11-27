// Switches "crisisScenes" and "assemblyDebates" (test 5, docs/council/2026-11-27-big-scenes.md; passages in
// docs/research/big-scenes-history.md). Words and numbers: data/crises.json.
// - The plot strike as a scene: the place, who stands with you, the roll against your defense with the odds; if you
//   live, a choice of what to do with the guilty (Pentiment's uncertain blame; mercy as in 404, Diodorus 14.9.8).
// - Warnings as counted signs on the plot's card (CK3's scheme breaches).
// - The city rises in phases (CK3 Struggles' phases moved by catalysts; Stellaris Situations): when two factions are
//   Rebellious and the guard wavers: unrest, the blockade of the Island, the council in the citadel, the break; it
//   eases back when the conditions ease. The council is the winding-sheet council of 404 (14.8.4-6), once a game.
// - The assembly debate: a vote on a seat you hold or seek is a debate of up to three rounds; you answer with the
//   levers the sources show, each with a price (Griftlands' resolve, Republic of Rome's vote, Disco Elysium's checks).
import crisesJson from "../../data/crises.json" with { type: "json" };
import { on } from "./switches.ts";
import { HOOKS } from "./hooks.ts";
import { d6 } from "./rng.ts";
import { PLAYER, capital, nameOf } from "./state.ts";
import { event, grain, log, mood, silver, setStatus, grudge, guardSet, opinion, powerChange } from "./ops.ts";
import { addScene, allScenes } from "./scenes.ts";
import type { Scene } from "./scenes.ts";
import type { FactionId, GameState, Plot } from "./types.ts";
import { FACTIONS } from "./types.ts";

export const CRISES = crisesJson as any;
const K = CRISES.knobs;
export const crisisOn = (s: GameState) => on(s, "crisisScenes") && !!s.island;
export const debatesOn = (s: GameState) => on(s, "assemblyDebates") && !!s.island;
const count = (s: GameState, k: string, by = 1) => { s.counters[k] = (s.counters[k] ?? 0) + by; };
const opts = (list: any[], action: string) => list.map((o: any) => ({ id: o.id, label: o.label, note: o.note, action }));
const sc$ = (s: GameState, id: string) => allScenes(s).find((x) => x.id === id);
// A scene that waits for your answer (a plot's guilty, the citadel council, a debate). Shown before the season card.
export const pendingChoice = (s: GameState): Scene | undefined => allScenes(s).find((x) => (x as any).choices?.length && !(x as any).answered && (x as any).open);

// ---------- Warnings as counted signs ----------
export function countSign(s: GameState, pl: Plot) { if (crisisOn(s)) (pl as any).signs = ((pl as any).signs ?? 0) + 1; }
export const signsOf = (pl: Plot) => (pl as any).signs ?? 0;

// ---------- The plot strikes (season.ts strike) ----------
HOOKS.strikeScene = (s: GameState, pl: Plot, x: { die: number; total: number; def: { total: number; parts: { label: string; value: number }[] }; chance: number; out: string }) => {
  if (!crisisOn(s)) return;
  const leader = s.people[pl.leader];
  const where = s.citadelBuilt ? "in the citadel on the Island" : "in your house by the harbour";
  const lived = x.out === "failed" || x.out === "wounded";
  const sc = addScene(s, {
    kind: "plot", title: lived ? (x.out === "wounded" ? "The blow that missed" : "The night of the knives") : "The sword falls", art: "dagger",
    faces: [pl.leader, ...pl.members.filter((m) => m !== pl.leader).slice(0, 1)], beats: [], good: lived,
    result: x.out === "failed" ? "The plot fails" : x.out === "wounded" ? "You are wounded, and live" : s.over?.reason === "killed" ? "You are killed" : "You are driven out",
  });
  sc.beats.push(`They come for you ${where}. ${capital(leader.name)} leads ${pl.members.length > 1 ? `${pl.members.length - 1} ${pl.members.length === 2 ? "other" : "others"}` : "alone"}.`);
  sc.beats.push(`With you: ${x.def.parts.filter((p) => p.value > 0).map((p) => p.label).join(", ") || "no one"}. Your defense is ${x.def.total}.`);
  sc.beats.push(`Their roll: ${x.die}, ${x.total} in all, against ${x.def.total}. The odds were ${Math.round(x.chance * 6)} in 6 that it would beat you.`);
  if (signsOf(pl)) sc.beats.push(`You had seen ${signsOf(pl)} ${signsOf(pl) === 1 ? "sign" : "signs"} of it before the night.`);
  sc.mark = `${capital(leader.name)}'s plot struck: ${sc.result!.toLowerCase()}.`;
  if (x.out === "failed") {
    (sc as any).choices = opts(CRISES.guilty, "plotChoice");
    (sc as any).open = true;
    (sc as any).plot = { leader: pl.leader, members: [...pl.members], backers: [...pl.backers] };
    sc.ask = "What will you do with the guilty?";
  }
  count(s, "plotScenes");
};
export function plotChoice(s: GameState, id: string, sceneId?: string) {
  const sc = sceneId ? sc$(s, sceneId) : allScenes(s).find((x) => x.kind === "plot" && (x as any).open && !(x as any).answered);
  if (!sc || (sc as any).answered) return;
  const p = (sc as any).plot as { leader: string; members: string[]; backers: FactionId[] };
  (sc as any).answered = true; (sc as any).open = false;
  sc.picks.guilty = id;
  const alive = p.members.filter((m) => s.people[m] && s.people[m].status !== "dead");
  const facs = [...new Set(alive.map((m) => s.people[m].faction).filter((f) => f !== "ruler"))] as FactionId[];
  count(s, `guilty_${id}`);
  if (id === "kill") {
    for (const m of alive) setStatus(s, m, "dead", "put to death for the plot");
    for (const f of facs) mood(s, f, -1, "its men were put to death for the plot");
    s.counters.executions = (s.counters.executions ?? 0) + alive.length;
    sc.beats.push(`The guilty die: ${alive.map((m) => s.people[m].name).join(", ")}.`);
  } else if (id === "spare") {
    if (s.people[p.leader]?.status !== "dead") setStatus(s, p.leader, "outside", "spared, and sent into exile");
    silver(s, alive.length, "the spared plotters pay for their lives");
    for (const f of facs) mood(s, f, 1, "you spared their men");
    sc.beats.push(`You spare them. ${capital(s.people[p.leader]?.name ?? "The leader")} goes into exile; the others pay.`);
  } else if (id === "blame") {
    const scape = Object.values(s.people).filter((q) => !q.player && q.status === "free" && !p.members.includes(q.id) && q.opinion <= 0 && q.faction !== "ruler")
      .sort((a, b) => (b.rival ? 1 : 0) - (a.rival ? 1 : 0) || a.opinion - b.opinion || (a.id < b.id ? -1 : 1))[0];
    if (scape) {
      setStatus(s, scape.id, "held", "arrested for a plot he may not have been part of");
      grudge(s, scape.id, "you blamed him for a plot he says he never joined");
      mood(s, scape.faction as FactionId, -2, `${scape.name} was arrested for a plot he says he never joined`);
      sc.beats.push(`You blame ${scape.name}. No one is sure he was part of it.`);
    } else sc.beats.push("There is no one to blame but the guilty.");
  } else sc.beats.push("You let them go about the city, named and watched.");
}

// ---------- The city rises (season.ts powerStep) ----------
interface Rising { phase: number; since: number; council?: number; feignUntil?: number; ended?: number }
const R = (s: GameState): Rising => ((s as any).rising ??= { phase: 0, since: 0 }) as Rising;
export const risingOf = (s: GameState) => (crisisOn(s) ? R(s) : undefined);
function rebels(s: GameState): FactionId[] { return FACTIONS.filter((f) => f !== "guard" && s.factions[f].mood === 0); }
const guardWavers = (s: GameState) => s.guard.arrearsSeasons >= 1 || s.factions.guard.mood <= 1;
export function risingSeason(s: GameState) {
  if (!crisisOn(s) || s.over) return;
  const r = R(s);
  const hot = rebels(s).length >= K.rebels && guardWavers(s);
  if (r.feignUntil !== undefined && s.season < r.feignUntil) return; // the rising waits on your feigned terms
  if (r.feignUntil !== undefined && s.season >= r.feignUntil) { r.feignUntil = undefined; return breakRoll(s, true); }
  if (!hot) {
    if (r.phase > 0) {
      r.phase -= 1; r.since = s.season;
      log(s, { actor: "world", text: r.phase === 0 ? "The rising dies away. The shops open again." : `The rising eases: ${CRISES.phases[r.phase].name.toLowerCase()}.`, why: "fewer than two factions are Rebellious, or the guard is steady again", visible: true, kind: "change" });
      if (r.phase === 0) { r.ended = s.season; count(s, "risingsEased"); }
    }
    return;
  }
  if (r.phase >= 3) return breakRoll(s, false);
  r.phase += 1; r.since = s.season;
  const ph = CRISES.phases[r.phase];
  count(s, "risingPhases");
  if (r.phase === 1) silver(s, -Math.min(s.silver, K.unrestSilver), "the shops are shut");
  if (r.phase === 2) grain(s, -K.blockadeGrain, "the Island is cut off from the country");
  const who = rebels(s).map((f) => s.factions[f].short);
  if (r.phase === 3 && r.council === undefined) return councilScene(s);
  const sc = addScene(s, { kind: "crisis", title: ph.name, art: ph.art, faces: [], beats: [ph.text, `Rebellious: ${who.join(" and ")}. The guard ${s.guard.arrearsSeasons >= 1 ? "is unpaid" : "is sullen"}.`, "If two factions stay Rebellious and the guard wavers, the rising goes on to its next phase next season. Calm one faction, or pay the guard, and it eases."], good: false, result: `The city rises: ${ph.name.toLowerCase()}` });
  sc.mark = `${capital(ph.name)}: the city rose against you.`;
  if (r.phase === 3) sc.beats.push("You have held council once already. Next season, if nothing changes, the city tries to break in.");
}
function councilScene(s: GameState) {
  const r = R(s);
  r.council = s.season;
  const C = CRISES.council;
  const speakers = C.speakers.filter((x: any) => s.people[x.id] && s.people[x.id].status === "free").map((x: any) => ({ face: x.id, name: capital(s.people[x.id].name), stance: x.stance, line: x.line }));
  const sc = addScene(s, { kind: "crisis", title: CRISES.phases[3].name, art: "assembly", faces: [], beats: [CRISES.phases[3].text], speakers, good: false, result: "Shut in the citadel" });
  if (!speakers.length) sc.beats.push("None of the friends who spoke in 404 is here; you must decide alone.");
  (sc as any).choices = opts(C.choices, "crisisChoice");
  (sc as any).open = true;
  sc.ask = "Stay, flee, or feign terms?";
  sc.mark = "Shut in the citadel, you held council with your friends.";
  count(s, "citadelCouncils");
}
const holdMods = (s: GameState, hired: boolean) => {
  const m = [{ label: "your guard", value: Math.min(3, Math.floor(s.guard.strength / 2)) }];
  if (s.citadelBuilt) m.push({ label: "the citadel's walls", value: 1 });
  if (hired) m.push({ label: "the men you hired", value: 2 });
  return m;
};
function breakRoll(s: GameState, hired: boolean) {
  const r = R(s);
  const m = holdMods(s, hired);
  const die = d6(s), t = die + m.reduce((a, x) => a + x.value, 0);
  const ok = t >= K.holdNeed;
  log(s, { actor: PLAYER, text: `The city tries to break into the Island: rolled ${die}${m.map((x) => ` +${x.value} ${x.label}`).join("")} = ${t}, you hold on ${K.holdNeed}.`, why: "the rising", visible: true, kind: "roll", roll: { die, mods: m, total: t, need: K.holdNeed, ok } });
  const sc = addScene(s, { kind: "crisis", title: ok ? "The rising breaks" : "The city breaks in", art: ok ? "trophy" : "fire", faces: [], beats: [], good: ok, result: ok ? "You hold the Island" : "Your rule is over" });
  if (ok) {
    for (const f of rebels(s)) { powerChange(s, f, -1, "the rising was broken"); s.factions[f].mood = 1; }
    r.phase = 0; r.ended = s.season;
    sc.beats.push(hired ? "The hired horsemen ride in through the rebels and the siege breaks, as the Campanians broke it in 404 (Diodorus 14.9.3)." : "Your guard holds the walls, and the rebels lose heart and scatter.");
    sc.beats.push("The rebel factions are angry still, but they have lost men and nerve.");
    count(s, "risingsBroken");
  } else {
    sc.beats.push("The gates of the Island are opened from within.");
    const fate = d6(s);
    s.over = fate <= 3 ? { reason: "exiled", text: "The city breaks into the Island. You escape by sea with a few friends and go into exile.", season: s.season } : { reason: "killed", text: "The city breaks into the Island, and you are killed in the citadel.", season: s.season };
    event(s, "world", s.over.text, "the rising broke in");
    count(s, "risingsWon");
  }
  sc.mark = ok ? "The rising against you was broken." : "The city rose and broke into the Island.";
}
export function crisisChoice(s: GameState, id: string, sceneId?: string) {
  const sc = sceneId ? sc$(s, sceneId) : allScenes(s).find((x) => x.kind === "crisis" && (x as any).open && !(x as any).answered);
  if (!sc || (sc as any).answered) return;
  (sc as any).answered = true; (sc as any).open = false;
  sc.picks.council = id;
  const r = R(s);
  count(s, `council_${id}`);
  if (id === "flee") {
    sc.beats.push("You ride out at night, alive.");
    s.over = { reason: "exiled", text: "You flee the citadel by night and leave Syracuse to the rebels.", season: s.season };
    event(s, PLAYER, s.over.text, "you chose to flee, as Polyxenus advised (Diodorus 14.8.5)");
  } else if (id === "feign") {
    const pay = s.silver;
    if (pay) silver(s, -pay, "the hired men's price, \"any price they should ask\"");
    guardSet(s, "strength", K.feignGuard, "hired horsemen on their way");
    r.feignUntil = s.season + K.feignSeasons;
    sc.beats.push(`Your envoys ask leave for you to sail away; your messengers ride for hired men. The rising waits ${K.feignSeasons} seasons.`);
    event(s, PLAYER, "You feign terms with the rebels while your messengers ride for hired men.", "as in 404 (Diodorus 14.8.6)");
  } else {
    sc.beats.push("You will stay, and be dragged out by the leg if it comes to that.");
    breakRoll(s, false);
  }
}

// ---------- The assembly debate (board.ts vote) ----------
interface Debate { seat: string; seatName: string; why: string; you: number; them: number; foe: string; holder: boolean; round: number; used: string[] }
HOOKS.debate = (s: GameState, seat: string, seatName: string, why: string, you: number, them: number, foe: string, holder: boolean): boolean => {
  if (!debatesOn(s) || allScenes(s).some((x) => x.kind === "debate" && (x as any).open)) return false;
  const d: Debate = { seat, seatName, why, you, them, foe, holder, round: 0, used: [] };
  const sc = addScene(s, { kind: "debate", title: `The assembly votes on ${seatName}`, art: "assembly", faces: [PLAYER, foe], beats: [], good: you > them });
  (sc as any).debate = d; (sc as any).open = true;
  sc.speakers = [{ face: foe, name: capital(nameOf(s, foe)), stance: holder ? "for taking it from you" : "for keeping it", line: holder ? `${capital(seatName)} has been held too long by one man.` : "The city is safe as it is." }];
  sc.beats.push(`${capital(why)}. ${capital(nameOf(s, foe))} speaks first.`);
  refresh(s, sc);
  count(s, "debates");
  return true;
};
function leverOk(s: GameState, d: Debate, id: string): boolean {
  if (d.used.includes(id)) return false;
  switch (id) {
    case "fines": return Object.values(s.people).some((p) => p.status === "free" && p.faction === "rich" && p.opinion >= 1);
    case "word": return Object.values(s.people).some((p) => p.status === "free" && !p.player && p.opinion >= 2 && p.id !== d.foe);
    case "armed": return s.guard.strength >= 1;
    case "gelon": return !(s.flags as any).gelonUsed;
    case "gifts": return s.silver >= 2;
  }
  return false;
}
function refresh(s: GameState, sc: Scene) {
  const d = (sc as any).debate as Debate;
  sc.result = `You ${d.you}, ${capital(nameOf(s, d.foe))} ${d.them}`;
  sc.good = d.you >= (d.holder ? d.them : d.them + 1);
  const levers = d.round < K.rounds ? CRISES.levers.filter((l: any) => leverOk(s, d, l.id)) : [];
  (sc as any).choices = [...opts(levers, "debateMove"), { id: "vote", label: "Call the vote", note: d.holder ? "Ties go to you, the holder." : "You need more than they have.", action: "debateMove" }];
  sc.ask = d.round < K.rounds ? `Round ${d.round + 1} of ${K.rounds}: answer, or call the vote` : "Call the vote";
}
export function debateMove(s: GameState, id: string, sceneId?: string) {
  const sc = sceneId ? sc$(s, sceneId) : allScenes(s).find((x) => x.kind === "debate" && (x as any).open);
  if (!sc || !(sc as any).open) return;
  const d = (sc as any).debate as Debate;
  if (id === "vote" || d.round >= K.rounds) return resolveDebate(s, sc);
  const l = CRISES.levers.find((x: any) => x.id === id);
  if (!l || !leverOk(s, d, id)) return;
  d.used.push(id); d.round += 1; d.you += l.value;
  count(s, `lever_${id}`);
  if (id === "fines") { const p = Object.values(s.people).filter((q) => q.status === "free" && q.faction === "rich" && q.opinion >= 1).sort((a, b) => b.opinion - a.opinion || (a.id < b.id ? -1 : 1))[0]; p.owedFavor = true; sc.beats.push(`${capital(p.name)} pays your fines and tells you to speak on. You owe him.`); }
  if (id === "word") { const p = Object.values(s.people).filter((q) => q.status === "free" && !q.player && q.opinion >= 2 && q.id !== d.foe).sort((a, b) => b.opinion - a.opinion || (a.id < b.id ? -1 : 1))[0]; opinion(s, p.id, -1, "he spent his name for you in the assembly"); sc.beats.push(`${capital(p.name)} rises and speaks for you.`); }
  if (id === "armed") { mood(s, "citizens", -1, "armed men stood at the assembly's door"); sc.beats.push("Your guard stands at the doors with their spears. The assembly goes quiet."); }
  if (id === "gelon") { (s.flags as any).gelonUsed = s.season; sc.beats.push("You remind them of Gelon, and Himera, and what one general with full power can do."); }
  if (id === "gifts") { silver(s, -2, "gifts and banquets promised to the people"); sc.beats.push("You promise gifts and banquets when the vote is done."); }
  // The other side answers each round, a little.
  const die = d6(s);
  if (die >= 5) { d.them += 1; sc.beats.push(`${capital(nameOf(s, d.foe))} answers well (rolled ${die}): +1 to his side.`); }
  refresh(s, sc);
  if (d.round >= K.rounds) sc.ask = "Call the vote";
}
function resolveDebate(s: GameState, sc: Scene) {
  const d = (sc as any).debate as Debate;
  (sc as any).open = false; (sc as any).answered = true;
  const youWin = d.holder ? d.you >= d.them : d.you > d.them;
  sc.result = `${youWin ? (d.holder ? "You keep" : "You win") : (d.holder ? "You lose" : "You fail to win")} ${d.seatName}: ${d.you} to ${d.them}`;
  sc.good = youWin;
  sc.mark = `The assembly debated ${d.seatName}: ${youWin ? "you carried the vote" : "the vote went against you"}.`;
  count(s, youWin ? "debatesWon" : "debatesLost");
  HOOKS.debateResult?.(s, d.seat, youWin ? PLAYER : d.foe, d.holder && !youWin, `${d.why}; the debate ended ${d.you} to ${d.them}`);
  if (!youWin && d.holder) sc.beats.push("A lost vote can be tried again next spring.");
}
// At the end of the season: answers left open take their defaults.
export function settleChoices(s: GameState) {
  for (const sc of allScenes(s)) {
    if (!(sc as any).open || (sc as any).answered) continue;
    if ((sc as any).settle) HOOKS[(sc as any).settle]?.(s, sc); // a choice owned by another module (libya.ts)
    else if (sc.kind === "plot") plotChoice(s, "watch", sc.id);
    else if (sc.kind === "crisis") crisisChoice(s, "stay", sc.id);
    else if (sc.kind === "debate") resolveDebate(s, sc);
    if (s.over) return;
  }
}
