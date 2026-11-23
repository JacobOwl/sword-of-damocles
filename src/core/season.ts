// One season runs fixed steps in this order: world, people, factions, player, power, sword check, chronicle.
import { DATA, lawById } from "./data.ts";
import { d6, pick } from "./rng.ts";
import {
  PLAYER, alive, band, capital, defense, government, holds, nameOf, newGame, others, plotStrength, power, seasonName,
  stageFor, stageName, isPlayerTyranny, membersOf, leaderOf, officesOf, officeName,
} from "./state.ts";
import { clock, event, grain, log, makeRival, mood, powerChange, rankChange, silver, endRival, setStatus, setOffice } from "./ops.ts";
import { factionStep, peopleStep, updatePolitical, botTurn } from "./ai.ts";
import { perform, refuse } from "./actions.ts";
import type { FactionId, GameOpts, GameState, Input, Plot } from "./types.ts";
import { islandWorld } from "./island.ts";
import { censusSeason } from "./census-game.ts";
import { carthageStep } from "./carthage.ts";
import { FACTIONS } from "./types.ts";
import { writeChronicle } from "./chronicle.ts";
import { botAnswer, chooseEvent, drawEvents, settleEvents } from "./events.ts";
import { T } from "./tuning.ts";
import { on, switchById } from "./switches.ts";
import { clueWarning } from "./clues.ts";
import { feudOn, feudSurvive } from "./feud.ts";
import { botById, botRandom, playSeason } from "./bots.ts";
import { councilBrief, councilSeasonEnd } from "./council.ts";
import { campaignCheck } from "./commission.ts";

// ---------- World ----------
function worldStep(s: GameState) {
  s.step = "world";
  s.slots = DATA.start.actionsPerSeason;
  s.watches = [];
  s.guard.refusing = false;
  for (const f of FACTIONS) s.factions[f].actedAgainst = false;
  for (const p of Object.values(s.people)) {
    if (p.status === "absent" && p.enters <= s.season) {
      p.status = (p as any).startStatus ?? "free";
      event(s, p.id, `${capital(p.name)} enters the story.`, "a new figure in Syracuse");
    }
  }
  const q = s.season % 4;
  // Grain: people stretch their rations; the summer harvest refills the stores.
  grain(s, s.granary ? -1 : -2, s.granary ? "a season's rations (the granary saves 1)" : "a season's rations");
  if (q === 3) grain(s, 6, "the summer harvest");
  if (q === 1) {
    const h = s.offices.fleet;
    const friendly = h && (h === PLAYER || (s.people[h].status === "free" && s.people[h].opinion >= 0));
    const damaged = s.flags.fleetDamaged !== undefined && s.season - s.flags.fleetDamaged < 3;
    if (friendly && !damaged) grain(s, 2, `${h === PLAYER ? "your" : nameOf(s, h!) + "'s"} fleet brings grain`);
  }
  for (const id of s.laws) {
    const l = lawById(id)!;
    if (l.income) silver(s, l.income, l.name);
    if (l.grain) grain(s, l.grain, l.name);
  }
  // The guard's pay. Whoever holds the treasury decides who is paid.
  const payer = s.offices.treasury;
  const up = s.guard.upkeep;
  let paid = false;
  if (payer === PLAYER || (payer && s.people[payer].status === "free" && s.people[payer].opinion >= 1)) {
    if (s.silver >= up) { silver(s, -up, `the guard's pay${payer === PLAYER ? "" : `, paid out by ${nameOf(s, payer)}`}`); paid = true; }
  } else if (payer) event(s, payer, `${capital(nameOf(s, payer))} holds back the guard's pay.`, "he holds the treasury and is no friend of yours");
  if (!paid) {
    s.guard.arrearsSeasons += 1;
    s.guard.owed += up;
    event(s, "guard", `The guard goes unpaid. They are owed ${s.guard.owed} silver.`, s.silver < up ? "the treasury is short" : "the treasury did not pay");
    if (s.guard.arrearsSeasons === 1) mood(s, "guard", -1, "a season of arrears, and the captain says so out loud");
  }
  if (q === 3) clock(s, 1, "a year passes and Carthage rebuilds");
  if (s.island) islandWorld(s); // the island game: cities, armies, sieges (Carthage's own council acts later)
  if (s.campaign) campaignCheck(s); // switch "commission": an army lost or home since last season
  if (s.census) censusSeason(s); // the island game: births, deaths, marriages and heirs among the invented families
  else if (s.clock >= 10) invasion(s);
}

function invasion(s: GameState) {
  s.invasions += 1;
  s.flags.invaded = s.season;
  const mods = [{ label: "the guard", value: s.guard.arrearsSeasons === 0 ? s.guard.strength : 0 }];
  if (s.walls) mods.push({ label: "the walls", value: 2 });
  if (holds(s, PLAYER, "generalship")) mods.push({ label: "you command the army", value: 1 });
  const die = d6(s);
  const total = die + mods.reduce((a, m) => a + m.value, 0);
  event(s, "world", `A Carthaginian army lands in Sicily and marches on Syracuse. Rolled ${die}${mods.map((m) => ` +${m.value} ${m.label}`).join("")} = ${total}, needs 9.`, "the Carthage clock reached 10");
  if (total >= 9) {
    event(s, "world", "Carthage's army is thrown back from the walls.", "the defense held");
    s.clock = 5;
    for (const f of ["citizens", "family"] as FactionId[]) mood(s, f, 1, "the city was saved");
    return;
  }
  s.counters.sieges = (s.counters.sieges ?? 0) + 1;
  event(s, "world", "Carthage besieges the city. Hunger and fear spread.", "the defense failed");
  grain(s, -4, "the siege");
  silver(s, -2, "the siege");
  for (const f of FACTIONS) mood(s, f, -1, "the siege");
  s.clock = 8;
  if (s.flags.besieged !== undefined) {
    s.over = { reason: "fallen", text: "Syracuse falls to Carthage. You escape by sea with what you can carry.", season: s.season };
    event(s, "world", s.over.text, "a second failed defense");
  }
  s.flags.besieged = s.season;
}

// ---------- Power ----------
function powerStep(s: GameState) {
  s.step = "power";
  // An unpaid guard sells itself to the highest bidder. You can outbid by paying their arrears before this step.
  if (s.guard.forSale && s.guard.arrearsSeasons >= 2) {
    const best = s.plots.slice().sort((a, b) => plotStrength(s, b).total - plotStrength(s, a).total)[0];
    if (best) {
      best.guardBacking = true;
      event(s, "guard", "The guard sells itself to a plot against you.", "two seasons unpaid, and the plotters paid", !!best.informer);
      event(s, "guard", "Your mercenaries no longer look you in the eye.", "the guard is for sale");
    } else {
      const took = s.silver;
      silver(s, -took, "the guard helped itself");
      s.guard.owed = Math.max(0, s.guard.owed - took);
      event(s, "guard", `The guard breaks into the treasury and takes ${took} silver.`, "two seasons unpaid, and no one else bid");
    }
    s.guard.forSale = false;
  }
  // Dominant factions claim vacant offices for free.
  for (const f of FACTIONS) {
    if (band(power(s, f)) !== "Dominant") continue;
    for (const o of Object.keys(s.offices) as (keyof GameState["offices"])[]) {
      if (o === "citadel" && !s.citadelBuilt) continue;
      const h = s.offices[o];
      if (h === null || (h !== PLAYER && !alive(s.people[h]))) {
        const lead = leaderOf(s, f);
        if (lead) { s.offices[o] = lead.id; event(s, f, `${capital(s.factions[f].short)} claim the empty ${o} for ${lead.name}.`, "a Dominant faction claims any vacant office"); }
      }
    }
  }
  // Enemies who come to like you stop being enemies.
  for (const p of others(s)) if (p.rival && p.opinion >= 2) endRival(s, p.id, `his opinion of you reached ${p.opinion}`);
  updatePolitical(s);
  // Drift (a default, not in rules v2): power that did not move this season eases 1 toward 5,
  // because holding influence takes work. Without it every faction ran to 10 in the headless runs.
  for (const f of FACTIONS) {
    const now = power(s, f);
    const moved = s.log.some((e) => e.season === s.season && e.actor === f && e.kind === "change" && e.text.includes(" power "));
    if (!moved && now !== 5) powerChange(s, f, now > 5 ? -1 : 1, "power drifts back toward the middle when nothing holds it there");
  }
  // Report band changes.
  for (const f of FACTIONS) {
    const now = power(s, f);
    const was = s.factions[f].powerShown;
    if (band(now) !== band(was)) {
      event(s, f, `${s.factions[f].name} ${band(now) === "Marginal" ? "fall to the margins" : band(now) === "Dominant" ? "become Dominant" : "are a force again"} (power ${now}).`, `power went from ${was} to ${now}`);
      if (band(now) === "Marginal") s.counters.marginal = (s.counters.marginal ?? 0) + 1;
      if (band(now) === "Dominant") s.counters.dominant = (s.counters.dominant ?? 0) + 1;
    }
    s.factions[f].powerShown = now;
  }
  const gov = government(s);
  const prev = s.flags.gov;
  const govCode = ["Unsettled", "Democracy", "Oligarchy"].indexOf(gov) + 1 || (isPlayerTyranny(s) ? 10 : 20);
  if (prev !== govCode) {
    if (prev !== undefined) event(s, "world", `The government of Syracuse is now: ${gov}.`, "the power objects changed hands");
    if (govCode === 10) s.counters.tyrannies = (s.counters.tyrannies ?? 0) + 1;
    s.flags.gov = govCode;
  }
  if (govCode === 10) s.counters.tyrantSeasons = (s.counters.tyrantSeasons ?? 0) + 1;
}

// ---------- The sword ----------
function swordStep(s: GameState) {
  s.step = "sword";
  for (const pl of s.plots.slice()) {
    if (!s.plots.includes(pl)) continue;
    if (pl.informer && pl.members.includes(pl.informer)) pl.known = [...pl.members];
    const str = plotStrength(s, pl).total;
    const target = stageFor(s, str);
    const before = pl.stage;
    if (target > pl.stage && pl.stageSince < s.season) { pl.stage += 1; pl.stageSince = s.season; }
    else if (target < pl.stage) { pl.stage = target; pl.stageSince = s.season; }
    if (pl.stage === 3 && before < 3) {
      pl.namedSince = s.season;
      const names = [pl.leader, ...pl.members.filter((m) => m !== pl.leader)].slice(0, pl.members.length > 2 ? 2 : 1);
      for (const n of names) if (!pl.known.includes(n)) pl.known.push(n);
    }
    if (pl.stage < 3) pl.namedSince = -1;
    warn(s, pl);
    // Does it strike?
    const def = defense(s).total;
    const leader = s.people[pl.leader];
    const patient = leader.traits.includes("patient");
    const k = T(s);
    const canStrike = pl.stage === 3 && pl.namedSince >= 0 && pl.namedSince < s.season && str >= k.minStrike;
    const keen = str + (patient ? k.strikeMargin - 1 : k.strikeMargin) > def || s.season - pl.namedSince >= (patient ? k.namedWait + 1 : k.namedWait);
    if (canStrike && keen) strike(s, pl);
    if (s.over) return;
  }
}

function warn(s: GameState, pl: Plot) {
  const w = DATA.warnings;
  const lf = s.people[pl.leader].faction;
  const fname = lf === "ruler" ? "your own household" : s.factions[lf as FactionId].short;
  let text: string;
  if (on(s, "clues")) { const c = clueWarning(s, pl); text = `${stageName(pl.stage)}: ${c}`; if (pl.deeds?.some((d) => d.season >= s.season - 1 && d.told && !d.shown)) { for (const d of pl.deeds) d.shown = true; (pl.heard ??= []).push(`${seasonName(s.season)}: ${c}`); } }
  else if (pl.stage === 1) text = `Whispers: ${pick(s, w.whispers)}`;
  else if (pl.stage === 2) text = `Rumors: ${pick(s, w.rumors).replace("{faction}", fname)}`;
  else text = `Named: ${pick(s, w.named).replace("{names}", pl.known.map((k) => s.people[k].name).join(" and "))}`;
  if (pl.informer) text += ` Your informer says it has ${pl.members.length} members and strength ${plotStrength(s, pl).total}.`;
  log(s, { actor: "world", text, why: `a plot at ${stageName(pl.stage)}`, visible: true, kind: "warning" });
}

function strike(s: GameState, pl: Plot) {
  const leader = s.people[pl.leader];
  const str = plotStrength(s, pl).total;
  const def = defense(s);
  const mods = [{ label: "the plot's strength", value: str }];
  if (leader.rival?.scars.includes("Survivor")) mods.push({ label: "a Survivor leads it", value: 1 });
  if (leader.rival?.scars.includes("Bereaved")) mods.push({ label: "Bereaved", value: 1 });
  const die = d6(s);
  const total = die + mods.reduce((a, m) => a + m.value, 0);
  s.counters.strikes = (s.counters.strikes ?? 0) + 1;
  // For the balance runs: how long you were warned, whether you knew who led it, and the odds of the blow.
  const add = mods.reduce((a, m) => a + m.value, 0);
  const chance = [1, 2, 3, 4, 5, 6].filter((d) => d + add > def.total).length / 6;
  s.counters.strikeWarnSeasons = (s.counters.strikeWarnSeasons ?? 0) + (s.season - pl.started + 1);
  if (pl.known.includes(pl.leader)) s.counters.strikeLeaderKnown = (s.counters.strikeLeaderKnown ?? 0) + 1;
  s.counters.strikeChance = (s.counters.strikeChance ?? 0) + chance;
  if (chance > 0.25 && chance < 0.75) s.counters.strikeCoinFlips = (s.counters.strikeCoinFlips ?? 0) + 1;
  // The chance the blow kills or exiles you: the same as above unless "Blows can miss" is on.
  const worst = on(s, "partialBlows") ? (switchById("partialBlows") as any).knobs.seize : 0;
  s.counters.strikeDeathChance = (s.counters.strikeDeathChance ?? 0) + [1, 2, 3, 4, 5, 6].filter((d) => d + add > def.total + worst).length / 6;
  event(s, pl.leader, `The plot strikes. Rolled ${die}${mods.map((m) => ` +${m.value} ${m.label}`).join("")} = ${total}, against your defense of ${def.total} (${def.parts.map((p) => `${p.value} ${p.label}`).join(", ")}). It must beat your defense.`, "the sword check");
  if (total > def.total && on(s, "partialBlows") && partialBlow(s, pl, total - def.total)) return;
  if (total > def.total) {
    const fate = d6(s);
    s.counters.blows = (s.counters.blows ?? 0) + 1;
    s.over = fate <= 3
      ? { reason: "exiled", text: `The plotters seize the Island. You escape with your life and go into exile. ${capital(leader.name)} led them.`, season: s.season }
      : { reason: "killed", text: `The sword falls. You are killed by men you trusted. ${capital(leader.name)} led them.`, season: s.season };
    s.over.by = leader.id;
    event(s, pl.leader, s.over.text, "the plot beat your defense");
    return;
  }
  s.counters.plotsFailed = (s.counters.plotsFailed ?? 0) + 1;
  event(s, pl.leader, `The plot fails. Every plotter is named: ${pl.members.map((m) => s.people[m].name).join(", ")}.`, "your defense held");
  for (const m of pl.members) s.people[m].exposed = true;
  for (const f of pl.backers) { powerChange(s, f, -2, "its plot was exposed"); s.factions[f].backing = undefined; }
  const hadRank = leader.rival?.rank;
  makeRival(s, pl.leader, "Survivor", "his plot failed and he lived");
  feudSurvive(s, pl.leader, "lived through his own failed blow", "the Survivor");
  // A balance knob (0 in standard): a leader who survives his failed blow comes back stronger.
  if (T(s).rankOnFailedPlot && hadRank !== undefined) rankChange(s, pl.leader, T(s).rankOnFailedPlot, "he survived his own failed blow, and learned from it");
  for (const m of pl.members) if (s.people[m].status === "held" && s.people[m].rival) rankChange(s, m, -1, "his plot was exposed while he was held");
  if (pl.guardBacking) event(s, "guard", "The guard that sold itself to the plot stands exposed.", "the plot failed");
  s.plots = s.plots.filter((p) => p !== pl);
  s.flags.plotBroken = s.season;
}

// Switch "partialBlows": a blow that only just beats your defense wounds you or costs you an office.
// Returns false when the margin is wide enough to kill or exile you as before.
export function partialBlow(s: GameState, pl: Plot, margin: number): boolean {
  const k = (switchById("partialBlows") as any).knobs as { wound: number; seize: number };
  if (margin > k.seize) return false;
  const leader = s.people[pl.leader];
  const lead = capital(leader.name);
  const takeable = (["treasury", "generalship", "fleet", "mint", "assembly"] as const).filter((o) => s.offices[o] === PLAYER);
  const backersHit = (d: number) => { for (const f of pl.backers) { powerChange(s, f, d, "its plot was exposed"); s.factions[f].backing = undefined; } };
  // Seizing an office needs the leader inside the walls; a blow led from outside can only wound.
  if (margin <= k.wound || !takeable.length || leader.status !== "free") {
    s.counters.blowsWounded = (s.counters.blowsWounded ?? 0) + 1;
    event(s, pl.leader, `The blade finds you, but not deep enough. You live, wounded. ${lead} flees the city, and every plotter is named: ${pl.members.map((m) => s.people[m].name).join(", ")}.`, `the blow beat your defense by ${margin}; it takes ${k.wound + 1} or more to do worse than wound you`);
    s.blockedSlots += 1;
    event(s, PLAYER, "Your wound keeps you to your bed. You lose an action next season.", "wounded in the strike");
    for (const m of pl.members) s.people[m].exposed = true;
    backersHit(-1);
    for (const o of officesOf(s, pl.leader)) setOffice(s, o, PLAYER, `${leader.name} fled the city`);
    if (leader.status === "free") setStatus(s, pl.leader, "outside", "he fled after his blow failed to kill");
    makeRival(s, pl.leader, "Survivor", "his blow wounded you, and he got away");
    feudSurvive(s, pl.leader, "struck at you and got away", "the Bold");
  } else {
    s.counters.blowsSeized = (s.counters.blowsSeized ?? 0) + 1;
    const o = takeable[0];
    event(s, pl.leader, `The plotters break into your house. You escape to the dockyards with your life, but ${lead} holds ${officeName(o)} by force, and your house is plundered.`, `the blow beat your defense by ${margin}; it takes ${k.seize + 1} or more to kill or exile you`);
    setOffice(s, o, pl.leader, "he took it by force in the strike");
    silver(s, -Math.ceil(s.silver / 2), "your house was plundered");
    leader.exposed = true;
    backersHit(-1);
    makeRival(s, pl.leader, "Survivor", `he struck at you and took ${officeName(o)}`);
    if (feudOn(s)) feudSurvive(s, pl.leader, `struck at you and took ${officeName(o)}`, "the Usurper");
    else rankChange(s, pl.leader, 1, `he struck at you and took ${officeName(o)}`);
  }
  s.plots = s.plots.filter((p) => p !== pl);
  s.flags.plotBroken = s.season;
  return true;
}

// ---------- The public API ----------
export function beginSeason(s: GameState) {
  worldStep(s);
  if (s.over) return finish(s);
  s.step = "people";
  peopleStep(s);
  if (s.over) return finish(s);
  drawEvents(s); // events from data/events.json, at the end of the people step
  if (s.over) return finish(s);
  s.step = "factions";
  factionStep(s);
  if (s.island) carthageStep(s); // Carthage's council and general, after the Syracusan factions
  if (s.over) return finish(s);
  s.step = "player";
  if (s.council) councilBrief(s); // switch "council": who sits at your table, and what each of them says this season
  if (s.blockedSlots) {
    s.slots = Math.max(0, s.slots - s.blockedSlots);
    s.blockedSlots = 0;
  }
}

export function endSeason(s: GameState) {
  if (s.step !== "player" || s.over) return;
  s.inputs.push({ t: "end" });
  settleEvents(s); // events you left unanswered take their default choice
  for (const r of s.requests.slice()) refuse(s, r.id, true);
  if (s.campaign) campaignCheck(s); // switch "commission": the homecoming, before the plots are weighed
  powerStep(s);
  if (!s.over) swordStep(s);
  if (!s.over && s.council) councilSeasonEnd(s);
  finish(s);
}

function finish(s: GameState) {
  s.step = "chronicle";
  writeChronicle(s);
  if (s.over) return;
  s.season += 1;
  if (s.season >= DATA.start.seasons) {
    s.over = { reason: "survived", text: "The decade ends, and you still hold Syracuse.", season: s.season - 1 };
    return;
  }
  beginSeason(s);
}

export function startGame(seed: number, tuning?: string, opts: GameOpts = {}): GameState {
  const s = newGame(seed, tuning, opts);
  beginSeason(s);
  return s;
}

export { chooseEvent };

export function act(s: GameState, action: string, args = {}) {
  return perform(s, action, args);
}
export function refuseRequest(s: GameState, id: string) {
  if (s.step !== "player" || s.over) return;
  s.inputs.push({ t: "refuse", request: id });
  refuse(s, id);
}

// Any game replays exactly from its seed and the list of your inputs.
export function replay(seed: number, inputs: Input[], tuning?: string, opts: GameOpts = {}): GameState {
  const s = startGame(seed, tuning, opts);
  for (const i of inputs) {
    if (i.t === "act") perform(s, i.action, i.args);
    else if (i.t === "refuse") refuseRequest(s, i.request);
    else if (i.t === "choose") chooseEvent(s, i.event, i.choice);
    else endSeason(s);
  }
  return s;
}

// A whole game played by a headless player, for the checks and the balance runs.
// "simple" is the first bot (it shares the game's dice); the others are in bots.ts.
export function runBotGame(seed: number, opts: { bot?: string; tuning?: string } & GameOpts = {}): GameState {
  const s = startGame(seed, opts.tuning, { switches: opts.switches, scenario: opts.scenario, preset: opts.preset });
  const bot = opts.bot && opts.bot !== "simple" ? botById(opts.bot) : undefined;
  if (opts.bot && opts.bot !== "simple" && !bot) throw new Error(`unknown bot: ${opts.bot}`);
  const r = botRandom(seed);
  let n = 0;
  while (!s.over && n++ < 200) {
    botAnswer(s); // events first, then actions
    if (bot) playSeason(s, bot, r);
    else botTurn(s);
    endSeason(s);
  }
  return s;
}
