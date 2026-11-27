// Scenes (test 5, docs/council/2026-11-27-big-scenes.md, thread 46): the moments that stop the game.
// Every battle leaves a scene record (the frame shows it before the next season card, whether or not you could act).
// Switch "battleScenes": a battle is not fought the moment two armies meet. They stop face to face, and the battle is
// fought in your player step in stages: the ground (switch "groundChoice"), your plan, one turning point picked from
// the state of the game, the roll, and a choice after it. Battles you leave unfought take the safe choices when the
// season ends, so bots and the 100-seed runs play them too. Words and numbers: data/scenes.json, data/ground.json.
import scenesJson from "../../data/scenes.json" with { type: "json" };
import groundJson from "../../data/ground.json" with { type: "json" };
import { on } from "./switches.ts";
import { HOOKS } from "./hooks.ts";
import { d6 } from "./rng.ts";
import { PLAYER, capital, nameOf, seasonName } from "./state.ts";
import { event, log, mood, silver } from "./ops.ts";
import {
  CARTHAGE, arrive, armyName, battleMods, battleResult, battleRoll, carthagePersonName, city, destroy, friendly, generalMods, lean, loseMen,
  menWords, nearestFriendly, nodeName, path, retreat, NODES,
} from "./island.ts";
import type { BattleChoices, BattleOut, BattleRoll } from "./island.ts";
import { card, warNote, weary } from "./war.ts";
import { afterParts, armyParts, contOn, hasArm, heart, partMods, turners, worstPart } from "./contingents.ts";
import type { Army, GameState, Mod } from "./types.ts";

export const SCENES = scenesJson as any;
export const GROUND = groundJson as any;
const K = SCENES.knobs;
export const scenesOn = (s: GameState) => on(s, "battleScenes") && !!s.island;
export const groundOn = (s: GameState) => on(s, "groundChoice") && !!s.island;

export interface SceneOpt { id: string; label: string; note: string }
export interface Scene {
  id: string;
  kind: "battle" | "sea" | "council" | "report" | "plot" | "crisis" | "debate";
  season: number;
  title: string;
  art: string;
  result?: string;
  good?: boolean; // the result is good for you
  faces: string[]; // person ids, or "carthage:<id>" for Carthage's people
  beats: string[];
  speakers?: { face: string; name: string; stance: string; line: string }[]; // council and debate scenes
  plate?: { mineName: string; theirName: string; mine: Mod[]; theirs: Mod[]; dieMine?: number; dieTheirs?: number; tMine?: number; tTheirs?: number };
  stage: "choose" | "after" | "done";
  at?: string; a?: string; b?: string; // the armies (a marched in)
  ground?: { id: string; name: string; line: string; by: "syracuse" | "carthage"; rolls: [number, number]; margin: number };
  turn?: { id: string; text: string; why: string; source: string; options: SceneOpt[]; part?: string };
  options?: SceneOpt[]; // the choices now open (the turning point before the roll, the aftermath after it)
  picks: Record<string, string>;
  roll?: BattleRoll;
  won?: boolean; // your side won the roll
  fx?: { costly?: boolean; wounded?: boolean; rash?: string; trustFailed?: boolean; plan?: string; reserve?: boolean; turnedA?: string[]; turnedB?: string[]; refused?: boolean };
  mark?: string; // one line for the chronicle
  ask?: string; // what the scene asks of you, in a few words
}
const list = (s: GameState): Scene[] => ((s.island as any).scenes ??= []);
export const allScenes = (s: GameState): Scene[] => (s.island ? list(s) : []);
export const pendingScene = (s: GameState): Scene | undefined => allScenes(s).find((x) => x.stage !== "done" && (x.kind === "battle" || x.kind === "sea"));
export function addScene(s: GameState, sc: Omit<Scene, "id" | "season" | "picks" | "stage"> & Partial<Scene>): Scene {
  const l = list(s);
  const full: Scene = { id: `scene${s.season}_${l.length}_${(s.island as any).sceneN = ((s.island as any).sceneN ?? 0) + 1}`, season: s.season, picks: {}, stage: "done", ...sc } as Scene;
  l.push(full);
  while (l.length > K.keep) l.shift();
  return full;
}
const armyById = (s: GameState, id?: string) => s.island!.armies.find((x) => x.id === id);
const mineOf = (a: Army, b: Army) => (a.side === "syracuse" ? a : b);
const foeOf = (a: Army, b: Army) => (a.side === "syracuse" ? b : a);
const sum = (m: Mod[]) => m.reduce((t, x) => t + x.value, 0);
const face = (s: GameState, a: Army) => (a.side === "syracuse" ? a.commander : `carthage:${a.commander}`);
const habit = (a: Army) => CARTHAGE.people.find((p: any) => p.id === a.commander)?.method;
const skill = (s: GameState, a: Army) => Math.max(-2, Math.min(2, sum(generalMods(s, a))));

// ---------- The ground (switch "groundChoice") ----------
export const groundCard = (id: string) => GROUND.cards.find((c: any) => c.id === id);
function hasHorse(s: GameState, a: Army) {
  if (contOn(s)) return hasArm(s, a, "horse") || hasArm(s, a, "chariots");
  return a.side === "carthage" || s.factions.rich.mood >= 2; // without contingents: Carthage always has horse; you, if the rich ride with you
}
function rollGround(s: GameState, a: Army, b: Army, at: string): Scene["ground"] | undefined {
  const cards: string[] = GROUND.places[at] ?? ["plain"];
  const one = (x: Army) => d6(s) + skill(s, x) + (friendly(x.side, city(s, at).side) ? 1 : 0) + (hasHorse(s, x) ? 1 : 0);
  const ra = one(a), rb = one(b);
  const pickBy = ra === rb ? undefined : ra > rb ? a : b;
  const want = (x: Army) => (x.side === "syracuse" ? (x as any).wish ?? "open" : habit(x) === "force" ? "open" : "broken");
  let id = cards[0];
  if (pickBy) {
    const w = want(pickBy);
    id = cards.find((c) => (w === "open" ? groundCard(c).open : groundCard(c).broken)) ?? cards[0];
  }
  const c = groundCard(id);
  const by = (pickBy ?? b).side;
  return { id, name: c.name, line: c.line, by, rolls: a.side === "syracuse" ? [ra, rb] : [rb, ra], margin: Math.abs(ra - rb) };
}
// What the ground gives each side, read when the battle is fought.
function groundMods(s: GameState, g: Scene["ground"], mine: Army, foe: Army, at: string): { mine: Mod[]; theirs: Mod[] } {
  const out = { mine: [] as Mod[], theirs: [] as Mod[] };
  if (!g) return out;
  const c = groundCard(g.id);
  const horse = (x: Army) => (contOn(s) ? hasArm(s, x, "horse") : x.side === "carthage" || s.factions.rich.mood >= 2);
  const chariots = (x: Army) => (contOn(s) ? hasArm(s, x, "chariots") : x.side === "carthage");
  const knows = (x: Army) => friendly(x.side, city(s, at).side);
  for (const [x, y, m] of [[mine, foe, out.mine], [foe, mine, out.theirs]] as [Army, Army, Mod[]][]) {
    if (c.open && horse(x) && !chariots(y)) m.push({ label: `horse on ${c.name.toLowerCase()}`, value: 1 });
    if (c.broken && knows(x)) m.push({ label: `knows the ${c.name.toLowerCase()}`, value: 1 });
  }
  if (c.river && g.margin >= GROUND.knobs.riverBy) {
    const caught = g.by === "syracuse" ? out.theirs : out.mine;
    caught.push({ label: "caught half across the river", value: GROUND.knobs.riverCaught });
  }
  return out;
}

// ---------- The turning point ----------
function pickTurn(s: GameState, mine: Army, foe: Army): Scene["turn"] {
  const T = (id: string) => SCENES.turns.find((t: any) => t.id === id);
  const make = (id: string, fill: Record<string, string> = {}, part?: string) => {
    const t = T(id);
    const f = (x: string) => x.replace(/\{(\w+)\}/g, (_, k) => fill[k] ?? "");
    return { id, text: f(t.text), why: f(t.why), source: t.source, options: t.options, part };
  };
  if (mine.plan === "combined") return make("late");
  const gone = contOn(s) ? turners(s, mine, foe).map((p) => p.id) : [];
  const w = contOn(s) ? worstPart(s, mine, gone) : undefined;
  if (w && w.kind !== "guard") return make("waver", { part: w.name, why: heart(s, mine, w).why }, w.id);
  const traits = mine.commander === PLAYER ? [] : s.people[mine.commander]?.traits ?? [];
  if (traits.includes("bold") || traits.includes("fiery")) return make("rash", { general: capital(nameOf(s, mine.commander)) });
  if (mine.commander === PLAYER) return make("front");
  return make("lines");
}
const safeTurn: Record<string, string> = { late: "wait", waver: "trust", rash: "rein", front: "rear", lines: "wait" };

// ---------- Opening a battle ----------
function sizes(s: GameState, a: Army) { return menWords(a.men); }
function openBattle(s: GameState, a: Army, b: Army): boolean {
  if (!s.island) return false;
  if (!scenesOn(s)) {
    if (!groundOn(s) && !contOn(s)) return false; // the old battle, fought at once
    fightNow(s, a, b);
    return true;
  }
  if (pendingScene(s)) return true; // they already stand face to face
  const mine = mineOf(a, b), foe = foeOf(a, b);
  const at = a.at;
  const ground = groundOn(s) ? rollGround(s, a, b, at) : undefined;
  const turn = pickTurn(s, mine, foe);
  const sc = addScene(s, {
    kind: "battle", title: `The battle at ${nodeName(at)}`, art: "arms", faces: [face(s, mine), face(s, foe)], beats: [],
    stage: "choose", at, a: a.id, b: b.id, ground, turn, options: turn!.options,
    ask: "Choose your plan and the turning point, then fight.",
  });
  sc.beats.push(`${capital(armyName(s, a))} marches on ${nodeName(at)} and finds ${armyName(s, b)} there: ${sizes(s, a)} against ${sizes(s, b)}.`);
  if (ground) sc.beats.push(groundBeat(s, ground, mine, foe));
  for (const l of [...partMods(s, mine, foe, at).lines, ...partMods(s, foe, mine, at).lines]) sc.beats.push(l);
  sc.plate = plateNow(s, sc);
  log(s, { actor: "world", text: `The armies stand face to face at ${nodeName(at)}. The battle will be fought this season.`, why: `${armyName(s, a)} marched on ${nodeName(at)}, where ${armyName(s, b)} stood`, visible: true, kind: "warning" });
  return true;
}
function groundBeat(s: GameState, g: NonNullable<Scene["ground"]>, mine: Army, foe: Army) {
  const who = g.by === "syracuse" ? (mine.commander === PLAYER ? "You" : capital(nameOf(s, mine.commander))) : capital(carthagePersonName(s, foe.commander));
  return `${who} ${g.margin ? `outmarched ${g.by === "syracuse" ? "them" : "you"} and chose` : "came to"} the ground: ${g.name.toLowerCase()} (ground roll ${g.rolls[0]} for you, ${g.rolls[1]} for them). ${g.line}`;
}
// The plate before the roll: every modifier on both sides, from the state as it is now.
export function plateNow(s: GameState, sc: Scene) {
  const a = armyById(s, sc.a), b = armyById(s, sc.b);
  if (!a || !b) return sc.plate;
  const mine = mineOf(a, b), foe = foeOf(a, b);
  const g = groundMods(s, sc.ground, mine, foe, sc.at!);
  const pm = partMods(s, mine, foe, sc.at!), pf = partMods(s, foe, mine, sc.at!);
  return { mineName: capital(armyName(s, mine)), theirName: capital(armyName(s, foe)), mine: [...battleMods(s, mine), ...g.mine, ...pm.mine, ...pf.theirs], theirs: [...battleMods(s, foe), ...g.theirs, ...pf.mine, ...pm.theirs] };
}

// ---------- Fighting it ----------
// pick: the turning point's choice; refuse: try to refuse battle (switch "groundChoice").
export function fightScene(s: GameState, pick?: string, refuse = false) {
  const sc = pendingScene(s);
  if (sc?.kind === "sea") return HOOKS.seaFight?.(s, pick); // switch "fleets" (fleets.ts)
  if (!sc || sc.stage !== "choose") return;
  const a = armyById(s, sc.a), b = armyById(s, sc.b);
  if (!a || !b || a.at !== b.at) { (s.island as any).scenes = list(s).filter((x) => x !== sc); return; } // the armies parted (a peace, a retreat) before it was fought
  const mine = mineOf(a, b), foe = foeOf(a, b);
  const at = sc.at!;
  sc.fx = { plan: mine.plan, reserve: mine.reserve };
  const extraM: Mod[] = [], extraF: Mod[] = [];
  const o: BattleChoices = {};
  if (refuse && groundOn(s)) {
    const die = d6(s);
    const t = die + skill(s, mine) - skill(s, foe);
    const ok = t >= GROUND.knobs.refuseNeed;
    log(s, { actor: PLAYER, text: `You try to refuse battle: rolled ${die}, your general's skill against theirs ${skill(s, mine) - skill(s, foe) >= 0 ? "+" : ""}${skill(s, mine) - skill(s, foe)} = ${t}, needs ${GROUND.knobs.refuseNeed}. ${ok ? "The army slips away." : "They catch you, and you must fight."}`, why: "Refuse battle", visible: true, kind: "roll", roll: { die, mods: [{ label: "skill", value: skill(s, mine) - skill(s, foe) }], total: t, need: GROUND.knobs.refuseNeed, ok } });
    for (const p of armyParts(s, mine)) if (p.kind === "town") lean(s, p.home, -1, "they are angered at your unwillingness to meet the enemy (Diodorus 14.61.3)");
    if (ok) {
      const w = worstPart(s, mine);
      if (w) (mine as any).breakFirst = w.id;
      loseMen(s, mine, Math.max(1, Math.ceil(mine.men / 6)), "the rearguard covering the retreat");
      (mine as any).breakFirst = undefined;
      if (s.island!.armies.includes(mine)) retreat(s, mine, "you refused battle");
      sc.fx.refused = true;
      return done(s, sc, mine, foe, undefined);
    }
    extraM.push({ label: "caught while trying to slip away", value: GROUND.knobs.refuseFail });
    sc.beats.push("You tried to slip away, but they caught you.");
  }
  const g = groundMods(s, sc.ground, mine, foe, at);
  extraM.push(...g.mine); extraF.push(...g.theirs);
  const pm = partMods(s, mine, foe, at), pf = partMods(s, foe, mine, at);
  extraM.push(...pm.mine, ...pf.theirs); extraF.push(...pf.mine, ...pm.theirs);
  sc.fx.turnedA = turners(s, mine, foe).map((p) => p.id); sc.fx.turnedB = turners(s, foe, mine).map((p) => p.id);
  // The turning point.
  const t = sc.turn!;
  const choice = pick && t.options.some((x) => x.id === pick) ? pick : safeTurn[t.id];
  sc.picks.turn = choice;
  const opt = t.options.find((x) => x.id === choice)!;
  sc.beats.push(`${t.text} You chose: ${opt.label.toLowerCase()}.`);
  if (t.id === "late" && choice === "wait") mine.plan = undefined;
  if (t.id === "waver" && choice === "reserve") { if (mine.reserve) mine.reserve = false; else sc.beats.push("But you had no reserve to send."); }
  if (t.id === "waver" && choice === "trust") {
    const die = d6(s);
    const holds = die >= K.trustHoldsOn;
    log(s, { actor: PLAYER, text: `${capital(armyParts(s, mine).find((p) => p.id === t.part)?.name ?? "the wing")} ${holds ? "hold" : "give way"} (rolled ${die}, they hold on ${K.trustHoldsOn} or more).`, why: t.why, visible: true, kind: "roll", roll: { die, mods: [], total: die, need: K.trustHoldsOn, ok: holds } });
    if (!holds) { extraM.push({ label: "a wing gives way", value: K.wavering }); (mine as any).breakFirst = t.part; sc.fx.trustFailed = true; }
  }
  if (t.id === "rash") { sc.fx.rash = choice; if (choice === "rein") { extraM.push({ label: "the charge reined in", value: -1 }); o.drawBy = 1; } else extraM.push({ label: "a headlong charge", value: 1 }); }
  if (t.id === "front" && choice === "front") {
    extraM.push({ label: "you fight in the front rank", value: 1 });
    const die = d6(s);
    if (die <= K.frontWoundOn) { sc.fx.wounded = true; log(s, { actor: PLAYER, text: `You are wounded in the front rank (rolled ${die}).`, why: "you fought in the front rank", visible: true, kind: "roll" }); }
  }
  if (t.id === "lines" && choice === "high") { extraM.push({ label: "you took the higher ground first", value: 1 }); sc.fx.costly = true; }
  const r = mine === a ? battleRoll(s, a, b, extraM, extraF) : battleRoll(s, a, b, extraF, extraM);
  sc.roll = r;
  const tMine = mine === a ? r.ta : r.tb, tFoe = mine === a ? r.tb : r.ta;
  sc.plate = { mineName: capital(armyName(s, mine)), theirName: capital(armyName(s, foe)), mine: mine === a ? r.ma : r.mb, theirs: mine === a ? r.mb : r.ma, dieMine: mine === a ? r.da : r.db, dieTheirs: mine === a ? r.db : r.da, tMine, tTheirs: tFoe };
  (sc as any).o = o;
  if (tMine === tFoe || (tMine < tFoe && o.drawBy !== undefined && tFoe - tMine <= o.drawBy) || (tMine < tFoe && mine.plan === "hold" && tFoe - tMine <= 2 && on(s, "battlePlate"))) {
    return finish(s, sc, a, b, mine, foe, undefined);
  }
  sc.won = tMine > tFoe;
  sc.stage = "after";
  sc.ask = sc.won ? "You have won the field. What now?" : "Your line is breaking. What now?";
  sc.options = afterOptions(s, sc, mine, foe);
}
function trapped(s: GameState, foe: Army) { return foe.side === "carthage" && (foe.food <= 0 || !nearestFriendly(s, foe, foe.at)); }
function afterOptions(s: GameState, sc: Scene, mine: Army, foe: Army): SceneOpt[] {
  const A = SCENES.after;
  if (sc.won) return A.win.filter((x: any) => (x.id !== "terms" || (s.island!.war && foe.side === "carthage")) && (x.id !== "silver" || trapped(s, foe)));
  if (mine.reserve && on(s, "battlePlate")) return [{ id: "fight", label: "Go on", note: "Your reserve covers the retreat to camp." }];
  return A.lose;
}
export function afterScene(s: GameState, pick?: string) {
  const sc = pendingScene(s);
  if (!sc || sc.stage !== "after") return;
  if (sc.kind === "sea") return HOOKS.seaAfter?.(s, pick); // switch "fleets" (fleets.ts)
  const a = armyById(s, sc.a), b = armyById(s, sc.b);
  if (!a || !b) { sc.stage = "done"; return; }
  const ok = sc.options?.some((x) => x.id === pick);
  finish(s, sc, a, b, mineOf(a, b), foeOf(a, b), ok ? pick : defaultAfter(s, sc, mineOf(a, b), foeOf(a, b)));
}
function defaultAfter(s: GameState, sc: Scene, mine: Army, foe: Army) {
  if (!sc.won) return "fight";
  return carthageReserve(s, foe) ? "sack" : "pursue";
}
// Switch "evenBattles": a careful general of Carthage keeps a reserve, so a hard pursuit can be caught in disorder.
export const carthageReserve = (s: GameState, a: Army) => a.side === "carthage" && on(s, "evenBattles") && habit(a) === "kindness";

function finish(s: GameState, sc: Scene, a: Army, b: Army, mine: Army, foe: Army, pick: string | undefined) {
  const o: BattleChoices = (sc as any).o ?? {};
  delete (sc as any).o;
  if (pick) sc.picks.after = pick;
  const myWin = sc.won === true;
  const winner = myWin ? mine : foe, loser = myWin ? foe : mine;
  if (sc.won !== undefined) {
    o.winAfter = myWin ? pick : habit(foe) === "force" ? "pursue" : undefined;
    o.loseAfter = myWin ? (foe.men * 2 < mine.men ? "truce" : undefined) : pick;
    if (sc.fx?.rash === "loose" && !myWin) o.rout = true;
    const open = sc.ground ? groundCard(sc.ground.id).open : true;
    o.pursuitDiv = hasHorse(s, winner) && open ? 3 : 6;
    o.reserveCaught = !!loser.reserve || carthageReserve(s, loser);
    if (o.winAfter === "silver") o.winAfter = "terms";
  }
  inScene = true;
  const out = battleResult(s, a, b, sc.roll!, o);
  inScene = false;
  // What the choices did besides the losses.
  if (myWin && pick === "sack") { silver(s, K.spoils, `the spoils of ${armyName(s, foe)}'s camp`); mood(s, "guard", 1, "they shared the spoils of the camp"); }
  if (myWin && pick === "terms" && card(s)) {
    weary(s, "carthage", 1, "you stopped the killing and offered terms");
    for (const n of NODES) if (n.id !== "syracuse" && (path(sc.at!, n.id)?.days.at(-1) ?? 99) <= 6 && !friendly("syracuse", city(s, n.id).side)) lean(s, n.id, 1, "you showed mercy to the beaten");
  }
  if (myWin && pick === "silver" && s.island!.armies.includes(foe)) {
    const k = s.island!.carthage;
    const v = Math.min(K.secretSilver, k.silver);
    k.silver -= v;
    if (v) silver(s, v, "Carthage's secret silver, to let its citizens sail home");
    event(s, "carthage", `${capital(carthagePersonName(s, foe.commander))} sails home by night with Carthage's own citizens. His hired men are left to their fate.`, "you took his silver (as Himilcon paid Dionysius, Diodorus 14.75.1 to 14.75.3)");
    destroy(s, foe, "its general sailed home by night and left it");
    for (const n of NODES) if (city(s, n.id).side === "ally") lean(s, n.id, -1, "they saw Carthage's ships slip away unharmed");
  }
  if (!myWin && sc.won !== undefined && pick === "truce") {
    mood(s, "citizens", -1, "you asked Carthage for your dead");
    warNote(s, "carthage", "truce", `you asked a truce to bury your dead at ${nodeName(sc.at!)}`, 1, sc.at);
  }
  if (myWin && sc.fx?.costly && s.island!.armies.includes(mine)) loseMen(s, mine, Math.ceil(mine.men / 6), "the price of the higher ground");
  if (sc.fx?.wounded) {
    if (!myWin && sc.won !== undefined && !s.over) {
      s.over = { reason: "killed", text: `You fall in the front rank at ${nodeName(sc.at!)}, wounded and then cut down in the rout.`, season: s.season };
      if (s.events) s.events.open = [];
      event(s, "world", s.over.text, "you fought in the front rank and the battle was lost");
    } else { s.blockedSlots += 1; event(s, PLAYER, "Your wound keeps you to your tent. You lose an action next season.", "wounded in the front rank"); }
  }
  // Restore the standing orders the turning point changed for this battle only.
  if (s.island!.armies.includes(mine)) { mine.plan = sc.fx?.plan as any; if (sc.fx?.reserve !== undefined) mine.reserve = sc.fx.reserve; }
  afterParts(s, mine, foe, myWin, sc.fx?.turnedA ?? []);
  afterParts(s, foe, mine, !myWin, sc.fx?.turnedB ?? []);
  done(s, sc, mine, foe, out);
  // The army that marched in goes on: a town without its defender may open its gates or be besieged.
  if (!s.over && s.island!.armies.includes(a) && !s.island!.armies.some((x) => x.side !== a.side && x.at === a.at)) arrive(s, a);
}
let inScene = false;

// ---------- The scene's words ----------
function resultName(out: BattleOut | undefined, sc: Scene): { key: string; good: boolean } {
  const R = SCENES.results;
  if (sc.fx?.refused) return { key: "refused", good: true };
  if (!out) return { key: "draw", good: true };
  if (out.result === "held") return { key: "held", good: true };
  if (out.result === "draw") return { key: "draw", good: true };
  if (out.winner === "syracuse") return { key: out.margin >= R.crushing.at ? "crushing" : out.margin >= R.victory.at ? "victory" : "costly", good: true };
  if (out.destroyed.includes("syracuse")) return { key: "rout", good: false };
  if (out.saved) return { key: "camp", good: false };
  if (sc.picks.after === "truce") return { key: "night", good: false };
  return { key: out.margin >= R.rout.at ? "rout" : "defeat", good: false };
}
const OUTCOME: Record<string, string> = {
  crushing: "Their line broke at the first shock, and the rout ran back to their camp.",
  victory: "After a long struggle their line gave way.",
  costly: "They gave way at last, but the field was dearly bought.",
  defeat: "Your line gave way and fell back.",
  rout: "Your line broke, and the rout ran for miles.",
  camp: "Your line broke, but the reserve covered the retreat to camp, and night saved the rest.",
  night: "You asked for your dead and slipped away by night, leaving your fires burning.",
  draw: "Neither side gave way. Both armies drew off, bloodied.",
  held: "Your line held. The enemy could not break it, and the day ended without a victor.",
  refused: "You refused battle and slipped away, and your rearguard paid for it.",
};
const AFTER: Record<string, string> = {
  pursue: "You pursued hard.", sack: "Your men sacked their camp.", terms: "You stopped the killing and offered terms.",
  silver: "You took Carthage's secret silver and let its citizens sail home.", truce: "", fight: "",
};
function done(s: GameState, sc: Scene, mine: Army, foe: Army, out: BattleOut | undefined) {
  const r = resultName(out, sc);
  sc.result = SCENES.results[r.key].name;
  sc.good = r.good;
  sc.art = r.key === "refused" || r.key === "draw" || r.key === "held" ? "camp" : r.good ? "trophy" : "mourning";
  sc.beats.push(OUTCOME[r.key]);
  if (sc.picks.after && AFTER[sc.picks.after]) sc.beats.push(AFTER[sc.picks.after]);
  if (out) sceneLosses(sc);
  void mine; void foe;
  sc.stage = "done";
  sc.options = undefined;
  sc.ask = undefined;
  sc.mark = `${capital(seasonName(s.season))}: ${(sc.result ?? "").toLowerCase()} at ${nodeName(sc.at!)}.`;
  event(s, "world", `The battle at ${nodeName(sc.at!)}: ${(sc.result ?? "").toLowerCase()} for you.`, sc.beats.slice(-2, -1)[0] ?? "the battle was fought");
}
// The report scene for a battle fought at once (no choice, or a bot's), and the fill for a scene's losses.
HOOKS.report = (s: GameState, a: Army, b: Army, r: BattleRoll, out: BattleOut) => {
  const mine = mineOf(a, b), foe = foeOf(a, b);
  const lostMine = mine === a ? out.lostA : out.lostB, lostFoe = mine === a ? out.lostB : out.lostA;
  const losses = `You lost ${menWords(lostMine)}; ${carthagePersonName(s, foe.commander) === "Carthage" ? "Carthage" : `${capital(armyName(s, foe)).replace(/'s army$/, "")}`} lost ${menWords(lostFoe)}${out.destroyed.includes(foe.side) ? ", and the army was destroyed" : ""}.`;
  if (inScene) { const sc = pendingScene(s); if (sc) (sc as any).losses = losses; return; }
  const sc = addScene(s, {
    kind: "battle", title: `The battle at ${nodeName(a.at)}`, art: "arms", faces: [face(s, mine), face(s, foe)], beats: [], at: a.at, a: a.id, b: b.id,
    plate: { mineName: capital(armyName(s, mine)), theirName: capital(armyName(s, foe)), mine: mine === a ? r.ma : r.mb, theirs: mine === a ? r.mb : r.ma, dieMine: mine === a ? r.da : r.db, dieTheirs: mine === a ? r.db : r.da, tMine: mine === a ? r.ta : r.tb, tTheirs: mine === a ? r.tb : r.ta },
  });
  sc.beats.push(`${capital(armyName(s, a))} marched on ${nodeName(a.at)} and met ${armyName(s, b)} there.`);
  const g = (s.island as any).lastGround;
  if (g && g.season === s.season) { sc.ground = g.ground; sc.beats.push(groundBeat(s, g.ground, mine, foe)); }
  for (const l of (s.island as any).lastTurned?.season === s.season ? (s.island as any).lastTurned.lines : []) sc.beats.push(l);
  const rn = resultName(out, sc);
  sc.result = SCENES.results[rn.key].name; sc.good = rn.good;
  sc.art = rn.key === "draw" || rn.key === "held" ? "camp" : rn.good ? "trophy" : "mourning";
  sc.beats.push(OUTCOME[rn.key]);
  sc.beats.push(losses);
  sc.mark = `${capital(seasonName(s.season))}: ${(sc.result ?? "").toLowerCase()} at ${nodeName(a.at)}.`;
};
// A battle fought at once, with the ground and the contingents (switches "groundChoice" and "contingents" without scenes).
function fightNow(s: GameState, a: Army, b: Army) {
  const mine = mineOf(a, b), foe = foeOf(a, b);
  const at = a.at;
  const ground = groundOn(s) ? rollGround(s, a, b, at) : undefined;
  if (ground) (s.island as any).lastGround = { season: s.season, ground };
  const g = groundMods(s, ground, mine, foe, at);
  const pm = partMods(s, mine, foe, at), pf = partMods(s, foe, mine, at);
  (s.island as any).lastTurned = { season: s.season, lines: [...pm.lines, ...pf.lines] };
  const tA = turners(s, mine, foe).map((p) => p.id), tB = turners(s, foe, mine).map((p) => p.id);
  const extraM = [...g.mine, ...pm.mine, ...pf.theirs], extraF = [...g.theirs, ...pf.mine, ...pm.theirs];
  const r = mine === a ? battleRoll(s, a, b, extraM, extraF) : battleRoll(s, a, b, extraF, extraM);
  const tMine = mine === a ? r.ta : r.tb, tFoe = mine === a ? r.tb : r.ta;
  if (tMine < tFoe) { const w = worstPart(s, mine); if (w) (mine as any).breakFirst = w.id; }
  const out = battleResult(s, a, b, r, {});
  afterParts(s, mine, foe, out.winner === "syracuse", tA);
  afterParts(s, foe, mine, out.winner === "carthage", tB);
}

HOOKS.scene = openBattle;

// At the end of the season: a battle you left unfought is fought with the safe choices.
export function settleScenes(s: GameState) {
  for (let i = 0; i < 3; i++) {
    const sc = pendingScene(s);
    if (!sc) return;
    if (sc.stage === "choose") fightScene(s);
    else afterScene(s);
  }
}
// The losses line is written by the report hook into the scene while it finishes; move it into the beats.
export function sceneLosses(sc: Scene) { const l = (sc as any).losses; if (l && !sc.beats.includes(l)) sc.beats.push(l); }
