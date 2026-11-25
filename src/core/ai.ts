// The people and factions the game controls. They use the same menu as you, through short priority lists,
// and every move records its reason so you can read why it happened.
import { flavored, withStock } from "./vary.ts";
import { pronoun } from "./pronouns.ts";
import { DATA, agendaById } from "./data.ts";
import { islandChoices } from "./island-bot.ts";
import { d6, nextRandom, pick } from "./rng.ts";
import {
  PLAYER, alive, band, capital, defense, influence, isPlayerTyranny, leaderOf, membersOf, nameOf, officeName, officesOf,
  others, playerInfluence, plotOf, plotStrength, power, leverageOver,
} from "./state.ts";
import {
  clock, event, factionOf, grudge, makeRival, mood, nextId, opinion, powerChange, rankChange, roll, setOffice, setStatus, silver, leaveAllPlots,
} from "./ops.ts";
import { traitMods, politicalRank } from "./actions.ts";
import type { FactionId, GameState, Mod, OfficeId, Person, Plot } from "./types.ts";
import { FACTIONS } from "./types.ts";
import { T } from "./tuning.ts";
import { on } from "./switches.ts";
import { deed } from "./clues.ts";
import { feudOn } from "./feud.ts";
import { secretsOn, digForYou, useOnYou, useHold, usable } from "./secrets.ts";
import { dinnersOn, recruitMods, recruitOrder, suggestTable } from "./dinner.ts";
import { quarrelTurn } from "./quarrels.ts";

const hidden = false;
const rankOf = (p: Person) => p.rival?.rank ?? 0;
const hasGrudge = (p: Person) => p.grudges.length > 0;
// The grudge he carries, told with his name ("He did not forget: You…" hid who, and broke the sentence).
const memoryLine = (p: Person) => (p.rival?.memory.length
  ? ` ${capital(p.name)} has not forgotten: ${p.rival.memory[p.rival.memory.length - 1].text.replace(/^(You|He|His) /, (m) => m.toLowerCase())}.` : "");

function againstYou(s: GameState, p: Person): Mod[] {
  const m: Mod[] = [];
  const b = p.rival?.scars.includes("Bereaved") ? 1 : 0;
  if (b) m.push({ label: "Bereaved", value: 1 });
  return m;
}

function canAct(s: GameState, p: Person) {
  if (p.player || !alive(p) || p.status === "held") return false;
  if (p.blockedUntil >= s.season) {
    p.blockedUntil = -1;
    event(s, p.id, `${capital(p.name)} does nothing this season.`, "you blocked him with what you know");
    return false;
  }
  return true;
}

// ---------- Plots ----------

function canStartPlot(s: GameState, p: Person): boolean {
  if (plotOf(s, p.id) || !hasGrudge(p)) return false;
  // Breathing room (a balance knob; 0 in standard): after a plot is broken, the city is quiet for a while.
  const br = T(s).breathingRoom;
  if (br && s.flags.plotBroken !== undefined && s.season - s.flags.plotBroken <= br) return false;
  const f = factionOf(s, p.id);
  const angry = f ? s.factions[f].mood <= 1 : false;
  if (!(rankOf(p) >= 1 || angry)) return false;
  if (f && band(power(s, f)) === "Marginal" && rankOf(p) < 3) return false;
  return true;
}

export function startPlot(s: GameState, p: Person, why: string) {
  const pl: Plot = { id: nextId(s, "plot"), leader: p.id, members: [p.id], backers: [], stage: 1, stageSince: s.season, namedSince: -1, bonus: 0,
    known: [], started: s.season, guardBacking: false };
  s.plots.push(pl);
  s.counters.plots = (s.counters.plots ?? 0) + 1;
  deed(s, pl, { kind: "start", who: p.id });
  event(s, p.id, `${capital(p.name)} starts a plot against you.${memoryLine(p)}`, why, hidden);
  return pl;
}

function recruitCandidates(s: GameState, pl: Plot): Person[] {
  return others(s).filter((q) => alive(q) && q.status !== "held" && !plotOf(s, q.id) && hasGrudge(q) && q.opinion <= 0)
    .sort((a, b) => b.grudges.length - a.grudges.length || a.opinion - b.opinion);
}

function recruit(s: GameState, p: Person, pl: Plot) {
  const c = recruitOrder(s, p.id, recruitCandidates(s, pl)); // switch "dinners": friends first, never a man he quarrelled with
  if (!c.length) return false;
  const q = c[0];
  const mods: Mod[] = [...traitMods(s, p.id, q.id, "recruit"), ...againstYou(s, p), ...recruitMods(s, p.id, q.id)];
  if (rankOf(p) >= 2) mods.push({ label: "a Schemer", value: 1 });
  if (p.status === "outside" && q.status === "outside" && p.rival?.scars.includes("Exiled")) mods.push({ label: "exiles together", value: 1 });
  const r = roll(s, p.id, `${capital(p.name)} tries to recruit ${q.name}`, mods, T(s).recruitNeed, pl.known.includes(p.id) && !!pl.informer);
  if (!r.ok) { deed(s, pl, { kind: "refused", who: p.id, target: q.id }); return true; }
  if (q.bound && d6(s) < 5) { event(s, q.id, `${capital(q.name)} is bound to you, and refuses ${p.name}.`, "bound by marriage or office", hidden); deed(s, pl, { kind: "refused", who: p.id, target: q.id }); return true; }
  pl.members.push(q.id);
  deed(s, pl, { kind: "join", who: q.id });
  if (q.informer) { pl.informer = q.id; pl.known = [...pl.members]; }
  const why = q.grudges[0]?.reason ?? "a grudge";
  event(s, q.id, `${capital(q.name)} joins ${p.name}'s plot (${why}).`, `recruited; grudge: ${why}`, !!pl.informer);
  return true;
}

// ---------- Requests ----------

function request(s: GameState, p: Person, kind: GameState["requests"][number]["kind"], extra: Partial<GameState["requests"][number]>, text: string, why: string) {
  if (s.requests.some((r) => r.from === p.id)) return false;
  // People escalate (switch "escalation"): ask, wait, demand, then act. Never the same plea every season.
  let demand = false;
  if (on(s, "escalation") && (kind === "office" || kind === "silver") && !extra.agendaStep) {
    const a = p.asks?.[extra.office ?? kind];
    if (a && a.stage >= 2) return false; // refused twice: he will not ask again
    if (a && s.season - a.last < 2) return false; // he waits a season before coming back
    if (a && a.stage === 1) {
      demand = true;
      const f = factionOf(s, p.id);
      text = `${capital(p.name)} ${kind === "office" ? `demands ${officeName(extra.office!)}` : "demands the silver you owe his loyalty"}, in front of ${f ? s.factions[f].short : "the court"}. He asked once already.`;
      why = `${why}; refused once, he comes back with a demand`;
    }
  }
  s.requests.push({ id: nextId(s, "req"), from: p.id, kind, season: s.season, owed: p.owedFavor, ...(demand ? { demand: true } : {}), ...extra });
  // From the third time a man asks for the same thing, one varied sentence says so (data/wordings.json petitionAgain).
  const asked = (s.counters[`asked_${p.id}_${extra.office ?? kind}`] = (s.counters[`asked_${p.id}_${extra.office ?? kind}`] ?? 0) + 1);
  const fp = asked >= 3 ? flavored(s, "petitionAgain", text, {}, asked) : { text, stock: text };
  withStock(event(s, p.id, fp.text, why), fp.stock);
  return true;
}
function askOffice(s: GameState, p: Person, why: string): boolean {
  const done = (o: OfficeId) => on(s, "escalation") && (p.asks?.[o]?.stage ?? 0) >= 2; // he gave up asking for it
  const want = p.wants && s.offices[p.wants] !== p.id && !done(p.wants) ? p.wants : (["mint", "fleet", "assembly", "treasury"] as OfficeId[]).find((o) => s.offices[o] === PLAYER && !done(o));
  if (!want || s.offices[want] !== PLAYER) return false;
  return request(s, p, "office", { office: want }, `${capital(p.name)} petitions you for ${officeName(want)}.`, why);
}
// A man who has fled, is held or is in exile has no way to send you silver (council 2026-11-25: a hunted Philistus lent).
function lend(s: GameState, p: Person, why: string): boolean {
  if (p.status !== "free") return false;
  p.owedFavor = true;
  event(s, p.id, `${capital(p.name)} lends you 2 silver. You owe him a favour.`, why);
  silver(s, 2, `a loan from ${p.name}`);
  return true;
}

// ---------- The people step ----------

function score(s: GameState, p: Person): number {
  return p.grudges.length * 2 + rankOf(p) * 2 + (p.political?.rank ?? 0) * 2 + (["Power", "Revenge"].includes(p.ambition) ? 2 : 0) + (p.agenda && !p.agenda.done ? 1 : 0) + nextRandom(s);
}

export function peopleStep(s: GameState) {
  const cands = others(s).filter((p) => alive(p) && p.status !== "held" && (p.status === "free" || p.rival));
  // One draw per person, in a fixed order, then sort. A draw inside the sort's comparator made the number of draws
  // depend on the JavaScript engine's sort, so a game replayed differently in the browser and in Node.
  const sc = new Map(cands.map((p) => [p.id, score(s, p)]));
  cands.sort((a, b) => sc.get(b.id)! - sc.get(a.id)!);
  const actors = cands.slice(0, 3);
  for (const p of actors) {
    if (!canAct(s, p)) continue;
    personTurn(s, p);
  }
}

function personTurn(s: GameState, p: Person) {
  // Switch "quarrels": a man with a quarrel sworn presses it; an angry rival may swear one, in the open.
  if (quarrelTurn(s, p)) return;
  // Personal agendas first (Philistus, a Nemesis, a Pretender).
  if (p.agenda && !p.agenda.done) return agendaTurn(s, p);
  if (p.rival) return revengeTurn(s, p);
  if (p.political) return politicalTurn(s, p);
  switch (p.ambition) {
    case "Revenge": return revengeTurn(s, p);
    case "Wealth":
      if (s.silver <= 3 && !p.owedFavor && (p.faction === "rich" || p.traits.includes("wealthy"))) { lend(s, p, "Ambition: Wealth. He lends at a price."); return; }
      if (askOffice(s, p, "Ambition: Wealth. He wants an office that pays.")) return;
      return void request(s, p, "silver", {}, `${capital(p.name)} asks you for a gift of silver.`, "Ambition: Wealth");
    case "Office":
      if (askOffice(s, p, `Ambition: Office.${p.refusals ? " You refused him once already." : ""}`)) return;
      return following(s, p, "Ambition: Office, and nothing to ask for");
    case "Safety": {
      const pl = plotOf(s, p.id);
      if (pl && plotStrength(s, pl).total + 3 < defense(s).total) { leaveAllPlots(s, p.id, "Ambition: Safety. The plot looks too weak."); return; }
      if (isPlayerTyranny(s) && p.opinion >= 0 && !p.bound && p.faction !== "family" && [p, ...p.kin.map((k) => s.people[k])].some((x) => x?.marriageable && !x.married))
        return void request(s, p, "marriage", {}, `${capital(p.name)} offers a marriage between your houses.`, "Ambition: Safety. Ally with whoever is strongest.");
      return void event(s, p.id, `${capital(p.name)} keeps ${pronoun(s, p.id, "his")} head down.`, "Ambition: Safety", hidden);
    }
    case "Power": {
      const f = factionOf(s, p.id);
      if (f && leaderOf(s, f)?.id === p.id && !s.factions[f].agenda.done) return following(s, p, "Ambition: Power. First, a following.");
      if (canStartPlot(s, p)) return void startPlot(s, p, "Ambition: Power, a grudge, and an angry faction");
      if (askOffice(s, p, "Ambition: Power. He bids for an office.")) return;
      return following(s, p, "Ambition: Power");
    }
  }
}

function following(s: GameState, p: Person, why: string) {
  const r = roll(s, p.id, `${capital(p.name)} builds a following`, traitMods(s, p.id, undefined, "buildFollowing"), 4, false);
  if (!r.ok) return;
  p.infl += 1;
  const ng = (s.counters[`following_${p.id}`] = (s.counters[`following_${p.id}`] ?? 0) + 1);
  const lead = `${capital(p.name)} gathers a following.`;
  const fg = ng >= 3 ? flavored(s, "followingAgain", lead, {}, ng) : { text: lead, stock: lead };
  withStock(event(s, p.id, fg.text, why), fg.stock);
  const f = factionOf(s, p.id);
  if (f && leaderOf(s, f)?.id === p.id) {
    const ag = s.factions[f].agenda;
    const def = agendaById(ag.id);
    if (!ag.done && def.steps[ag.step] === "Build a following") advanceAgenda(s, f, "his following");
  }
}

function revengeTurn(s: GameState, p: Person) {
  const pl = plotOf(s, p.id);
  if (pl && pl.leader === p.id) {
    const did = recruit(s, p, pl);
    if (did && rankOf(p) >= 2) recruit(s, p, pl);
    if (did) return;
  } else if (!pl && canStartPlot(s, p)) return void startPlot(s, p, `${p.rival ? "Your rival" : "Ambition: Revenge"}; grudge: ${p.grudges[0]?.reason}`);
  // Switch "secrets": a Schemer or worse uses what he knows about you, or digs for it, before he spreads stories.
  if (secretsOn(s) && rankOf(p) >= 2) {
    if (useOnYou(s, p, `${capital(p.name)} is your rival`, (k, x, t, w) => request(s, p, k, x, t, w))) return;
    if (!leverageOver(s, p.id, PLAYER) && digForYou(s, p, "your rival dug for your secrets")) return;
  }
  rumorAgainstYou(s, p);
}

function rumorAgainstYou(s: GameState, p: Person) {
  const f = factionOf(s, p.id) ?? "citizens";
  const target: FactionId = p.status === "outside" ? "citizens" : f;
  const mods: Mod[] = [...traitMods(s, p.id, undefined, "plantRumor"), ...againstYou(s, p)];
  if (p.rival?.scars.includes("Humiliated")) mods.push({ label: "Humiliated", value: 1 });
  const r = roll(s, p.id, `${capital(p.name)} spreads stories about you`, mods, 4, false);
  if (r.ok) {
    // From the third rumor on, the line says who keeps telling it (data/wordings.json rumorAgain), not the same words again.
    const told = (s.counters[`rumors_${p.id}`] = (s.counters[`rumors_${p.id}`] ?? 0) + 1);
    const lead = `Stories about you spread among ${s.factions[target].short}.`;
    const fr = told >= 3 ? flavored(s, "rumorAgain", lead, { name: p.name }, told) : { text: lead, stock: lead };
    withStock(event(s, p.id, `${fr.text}${memoryLine(p)}`, `${p.name} planted a rumor`, true), `${lead}${memoryLine(p)}`);
    mood(s, target, -1, `${p.name}'s rumors`);
  }
}

function politicalTurn(s: GameState, p: Person) {
  const type = p.political!.type;
  // Switch "secrets": a political rival with a hold over you asks a price for his silence.
  if (secretsOn(s) && type !== "Spymaster" && p.political!.rank >= 2 && useOnYou(s, p, `a ${type} uses what he knows`, (k, x, t, w) => request(s, p, k, x, t, w))) return;
  if (type === "Climber") {
    if (s.silver <= 3 && !p.owedFavor) { lend(s, p, "A Climber: he lends, and you owe him"); return; }
    if (askOffice(s, p, "A Climber bids for office")) return;
    return following(s, p, "A Climber");
  }
  if (type === "Spymaster" && secretsOn(s)) {
    if (!leverageOver(s, p.id, PLAYER)) { if (!digForYou(s, p, "a Spymaster collects secrets")) following(s, p, "A Spymaster, with nothing left to find"); return; }
    if (p.political!.rank >= 3 && useOnYou(s, p, "a Spymaster sells his silence", (k, x, t, w) => request(s, p, k, x, t, w))) return;
    if (p.political!.rank >= 2) {
      useHold(s, p.id, PLAYER, "Block, with a secret over you");
      s.blockedSlots += 1;
      return void event(s, p.id, `${capital(p.name)} uses what he knows about you. You lose an action this season.`, "Block, with a secret over you");
    }
    return following(s, p, "A Spymaster waits");
  }
  if (type === "Spymaster") {
    if (!leverageOver(s, p.id, PLAYER)) {
      const r = roll(s, p.id, `${capital(p.name)} collects secrets`, traitMods(s, p.id, undefined, "watch"), 4, false);
      if (r.ok) { s.leverage.push({ holder: p.id, over: PLAYER, season: s.season }); event(s, p.id, `${capital(p.name)} has learned something about you.`, "a Spymaster collects leverage", false); }
      return;
    }
    if (p.political!.rank >= 2) {
      const i = s.leverage.findIndex((l) => l.holder === p.id && l.over === PLAYER);
      s.leverage.splice(i, 1);
      s.blockedSlots += 1;
      return void event(s, p.id, `${capital(p.name)} uses what he knows about you. You lose an action this season.`, "Block, with leverage over you");
    }
    return following(s, p, "A Spymaster waits");
  }
  if (type === "Heir") {
    if (askOffice(s, p, "An Heir wants commands")) return;
    const r = roll(s, p.id, `${capital(p.name)} courts the guard`, [], 4, false);
    if (r.ok) { p.infl += 1; event(s, p.id, `${capital(p.name)} wins friends in the guard.`, "an Heir courts the guard's favour"); }
    return;
  }
  return following(s, p, "A Champion speaks for the people");
}

function agendaTurn(s: GameState, p: Person) {
  const ag = p.agenda!;
  const def = agendaById(ag.id);
  const step = def.steps[ag.step];
  if (ag.id === "philistusTreasury") {
    if (step === "Lend to you") { if (lend(s, p, `Agenda: ${def.name}, step 1`)) return stepDone(s, p); return; }
    if (step === "Petition") {
      if (s.offices.treasury !== PLAYER) return following(s, p, "the treasury is not yours to give");
      if (request(s, p, "office", { office: "treasury", agendaStep: true }, `${capital(p.name)} petitions you for the treasury.`, `Agenda: ${def.name}, last step`)) return;
      return;
    }
  }
  if (ag.id === "yourFall" && !plotOf(s, p.id)) return void startPlot(s, p, `Agenda: Your fall`);
  if (ag.id === "takePlace" && on(s, "coalition") && !coalition(s, p)) {
    // A Pretender needs a coalition (switch): with no second faction against you, his bid stalls.
    if (s.flags[`stalledBid_${p.id}`] === undefined) event(s, p.id, `${capital(p.name)}'s bid for your place stalls: no faction but his own will stand with him.`, "a Pretender needs a second faction Angry or worse with you");
    s.flags[`stalledBid_${p.id}`] = s.season;
    return following(s, p, "a Pretender courts a second faction");
  }
  if (ag.id === "takePlace" && s.flags[`stalledBid_${p.id}`] !== undefined) {
    delete s.flags[`stalledBid_${p.id}`];
    const f = coalition(s, p)!;
    event(s, p.id, `${capital(s.factions[f].short)} now stand with ${p.name}, and his bid for your place moves again.`, `${s.factions[f].short} are ${["Rebellious", "Angry"][s.factions[f].mood]} with you`);
  }
  const mods: Mod[] = [...againstYou(s, p)];
  if (ag.id === "takePlace") {
    if (influence(s, p.id) >= playerInfluence(s)) mods.push({ label: "his influence matches yours", value: 1 });
    if (p.bound) mods.push({ label: "bound to you", value: -1 });
  }
  const r = roll(s, p.id, `${capital(p.name)}: ${step}`, mods, ag.id === "takePlace" ? T(s).takePlaceNeed : 4, ag.id !== "philistusTreasury" || true);
  if (r.ok) stepDone(s, p);
}

function stepDone(s: GameState, p: Person) {
  const ag = p.agenda!;
  const def = agendaById(ag.id);
  event(s, p.id, `${capital(p.name)} completes a step of ${def.name}: ${def.steps[ag.step]}.`, `agenda ${def.name}`);
  ag.step += 1;
  if (p.rival) rankChange(s, p.id, 1, "he completed an agenda step");
  if (ag.id === "yourFall") { const pl = plotOf(s, p.id); if (pl) { pl.bonus += 1; deed(s, pl, { kind: "arms", who: p.id }); } }
  if (ag.step >= def.steps.length) {
    ag.done = true;
    // Take his place: the ending says the one way it happened, not the list of all four.
    event(s, p.id, `${capital(p.name)} completes ${def.name}.${ag.id === "takePlace" ? "" : ` ${def.completes}`}`, "agenda complete");
    if (ag.id === "yourFall") { const pl = plotOf(s, p.id); if (pl) pl.bonus += 2; }
    if (ag.id === "takePlace") politicalVictory(s, p);
  }
}

function politicalVictory(s: GameState, p: Person) {
  let how = "a vote of the assembly sends you into exile";
  if (s.offices.assembly === p.id) how = "the assembly recalls you";
  else if (s.factions.guard.mood <= 2) how = `the guard switches its backing to ${pronoun(s, p.id, "him")}`;
  else if (officesOf(s, p.id).length >= 3) how = `${pronoun(s, p.id, "he")} holds so many offices that no one can remove ${pronoun(s, p.id, "him")}`;
  s.counters.politicalFalls = (s.counters.politicalFalls ?? 0) + 1;
  // A deadly secret binds a man's tongue, not the city: say so when you held one and he rose anyway (council 2026-11-25).
  const knew = secretsOn(s) && (s.secrets?.list ?? []).some((x) => x.about === p.id && x.weight === 2 && x.known.includes(PLAYER) && x.publicSince === undefined);
  const bound = knew ? ` What you knew about ${pronoun(s, p.id, "him")} kept ${pronoun(s, p.id, "him")} quiet, but it was ${how.startsWith("the guard") ? "the guard" : how.includes("assembly") ? "the assembly" : "the city"} that chose.` : "";
  s.over = { reason: "deposed", text: `${capital(p.name)} takes your place: ${how}.${bound} You live, but you no longer rule Syracuse.`, season: s.season, by: p.id };
  event(s, p.id, s.over.text, "Take his place");
}

// ---------- The faction step ----------

export function factionStep(s: GameState) {
  for (const f of FACTIONS) {
    const pow = power(s, f);
    const b = band(pow);
    const n = b === "Dominant" ? 2 : b === "Active" ? 1 : 0;
    for (let i = 0; i < Math.max(1, n); i++) factionTurn(s, f, n > 0);
  }
}

function factionTurn(s: GameState, f: FactionId, canAgenda: boolean) {
  const fa = s.factions[f];
  const name = capital(fa.short);
  // Emergencies come first.
  if (f === "citizens" && s.grain < 3) {
    event(s, f, `${name} riot for bread.`, `grain is under 3 months (${s.grain})`);
    mood(s, f, -1, "hunger");
    clock(s, 1, "a riot");
    s.flags.riot = s.season;
    return;
  }
  if (f === "guard" && s.guard.arrearsSeasons >= 2) {
    if (!s.guard.forSale) { const fg = flavored(s, "guardForSale", "The guard has gone two seasons unpaid. Their loyalty is for sale."); withStock(event(s, f, fg.text, "two seasons of arrears"), fg.stock); }
    s.guard.forSale = true;
    return;
  }
  if (fa.mood <= 1) {
    const plots = s.plots.filter((pl) => !pl.backers.includes(f));
    const own = plots.find((pl) => pl.members.some((m) => s.people[m].faction === f)) ?? plots.sort((a, b) => plotStrength(s, b).total - plotStrength(s, a).total)[0];
    if (own && !fa.backing) {
      own.backers.push(f);
      fa.backing = own.id;
      deed(s, own, { kind: "backing", faction: f });
      event(s, f, `${name} put their weight behind a plot.`, `${name} are ${fa.mood === 0 ? "Rebellious" : "Angry"}`, !!own.informer);
      return;
    }
    if (!fa.backing) {
      const lead = membersOf(s, f).filter((p) => canStartPlot(s, p) && p.status !== "held").sort((a, b) => b.grudges.length - a.grudges.length)[0];
      if (lead) { startPlot(s, lead, `${name} are ${fa.mood === 0 ? "Rebellious" : "Angry"}, and ${lead.name} has a grudge`); return; }
      if (f === "rich") { event(s, f, "The rich families send quiet word to Carthage.", "Angry, with no plot to fund"); clock(s, 1, "the rich families offered Carthage a deal"); return; }
      if (f === "guard") { s.guard.refusing = true; event(s, f, "The guard refuses its duties this season.", "the guard is Angry"); return; }
    }
  }
  if (!canAgenda) return; // Marginal: its agenda stalls.
  agendaStep(s, f);
}

function agendaStep(s: GameState, f: FactionId) {
  const fa = s.factions[f];
  const ag = fa.agenda;
  if (ag.done) return;
  const def = agendaById(ag.id);
  const step = def.steps[ag.step];
  const name = capital(fa.short);
  if ((s.flags[`blockAgenda_${f}`] ?? -1) >= s.season) {
    delete s.flags[`blockAgenda_${f}`];
    return void event(s, f, `${name} make no progress on ${def.name}.`, "you blocked their leader");
  }
  // Reap what you sow (a balance knob, off in standard): a Content or Loyal faction holds its agenda against you.
  // Said once when it starts holding back, not every season.
  const stallKey = `stalled_${f}`;
  if (T(s).contentFactionsStall && def.againstRuler && fa.mood >= 3) {
    if (s.flags[stallKey] === undefined) event(s, f, `${name} hold back from ${def.name} while they are ${fa.mood === 4 ? "Loyal" : "Content"}.`, "a content faction does not move against you");
    s.flags[stallKey] = s.season;
    return;
  }
  if (s.flags[stallKey] !== undefined) { delete s.flags[stallKey]; event(s, f, `${name} take up ${def.name} again.`, "they are no longer content"); }
  const lead = leaderOf(s, f);
  // Steps that ask you for something.
  if (ag.id === "guardCitizens" && lead) request(s, lead, "citizenship", {}, `${capital(lead.name)} demands citizenship for the guard.`, `Agenda: ${def.name}, step ${ag.step + 1} (${step})`);
  if (ag.id === "nameHeir") {
    const held = membersOf(s, "family").reduce((a, p) => a + officesOf(s, p.id).length, 0);
    if ((step === "Win an office" && held >= 1) || (step === "Win a second office" && held >= 2)) return advanceAgenda(s, f, "the family already holds it");
    if (step !== "Win the guard") {
      const asker = membersOf(s, "family").filter((p) => p.status === "free" && p.wants && s.offices[p.wants] === PLAYER)[0];
      if (asker) askOffice(s, asker, `Agenda: ${def.name}, ${step}`);
      return;
    }
  }
  const mods: Mod[] = [];
  if (band(power(s, f)) === "Dominant") mods.push({ label: "Dominant", value: 1 });
  if (fa.actedAgainst) mods.push({ label: "you worked against it this season", value: -1 });
  if (ag.id === "peoplesAssembly" && step === "Win a vote" && s.offices.assembly && s.people[s.offices.assembly]?.faction === "citizens") mods.push({ label: "they hold the assembly", value: 1 });
  if (!lead) mods.push({ label: "no leader in the city", value: -1 });
  const r = roll(s, f, `${name}: ${step}`, mods, 4);
  if (!r.ok) return;
  if (ag.id === "guardCitizens" && step === "Refuse a duty") { s.guard.refusing = true; event(s, f, "The guard refuses a duty. They will not stand at your door this season.", "Agenda: Citizens of Syracuse"); }
  if (ag.id === "kingmakers") {
    const best = s.plots.slice().sort((a, b) => plotStrength(s, b).total - plotStrength(s, a).total)[0];
    if (best) { best.guardBacking = true; deed(s, best, { kind: "guard" }); event(s, f, "The guard sells its loyalty to a plot against you.", "the guard are kingmakers", !!best.informer); }
  }
  advanceAgenda(s, f, step);
}

export function advanceAgenda(s: GameState, f: FactionId, why: string) {
  const fa = s.factions[f];
  const ag = fa.agenda;
  const def = agendaById(ag.id);
  event(s, f, `${capital(fa.short)} complete a step of ${def.name}: ${def.steps[ag.step]}.`, why);
  powerChange(s, f, 1, "an agenda step succeeded");
  ag.step += 1;
  const lead = leaderOf(s, f);
  if (lead?.rival) rankChange(s, lead.id, 1, "his faction's agenda advanced");
  if (ag.step < def.steps.length) return;
  ag.done = true;
  event(s, f, `${capital(fa.short)} complete ${def.name}. ${def.completes}`, "agenda complete");
  powerChange(s, f, 2, "its agenda completed");
  switch (ag.id) {
    case "peoplesAssembly":
      if (lead && s.offices.generalship !== lead.id) setOffice(s, "generalship", lead.id, "the assembly elected its own general");
      break;
    case "cavalryHome":
      for (const p of membersOf(s, "rich").filter((p) => p.status === "outside")) setStatus(s, p.id, "free", "the exiles came home");
      powerChange(s, "rich", 3, "the exiles returned");
      break;
    case "guardCitizens":
      fa.agenda = { id: "kingmakers", step: 0, done: false };
      event(s, f, "You never granted it. The guard become kingmakers, and start selling their loyalty.", "Agenda: Citizens of Syracuse, refused");
      break;
    case "nameHeir": {
      const brothers = membersOf(s, "family").filter((p) => ["leptines", "thearides"].includes(p.id) && alive(p)).sort((a, b) => a.opinion - b.opinion);
      const b = brothers[0];
      if (b) {
        // Already a political rival: he rises, and the line says so instead of making him one again (council 2026-11-25).
        const was = b.political;
        b.political = { type: "Heir", rank: Math.max(2, was?.rank ?? 0), since: was?.since ?? s.season, outSeasons: 0 };
        event(s, b.id, was ? `The family names ${b.name} your heir. ${capital(pronoun(s, b.id, "he"))} rises to Power behind the throne.` : `The family names ${b.name} your heir. ${capital(pronoun(s, b.id, "he"))} becomes a political rival: Power behind the throne.`, "Agenda: Name the heir");
      }
      break;
    }
  }
}

// ---------- Political rivals: made by ambition ----------

// Switch "coalition": the strongest faction, other than his own, that is Angry or worse with you.
export function coalition(s: GameState, p: Person): FactionId | undefined {
  return FACTIONS.filter((f) => f !== p.faction && s.factions[f].mood <= 1).sort((a, b) => s.factions[a].mood - s.factions[b].mood || power(s, b) - power(s, a))[0];
}

export function updatePolitical(s: GameState) {
  const you = playerInfluence(s);
  const max = DATA.maxPolitical;
  for (const p of others(s)) {
    if (!alive(p)) { p.political = undefined; continue; }
    const inf = influence(s, p.id);
    const close = inf >= 1 && inf >= you - T(s).politicalRange;
    if (p.political) {
      if (!close) {
        p.political.outSeasons += 1;
        // Switch "feud": a political rival does not drop away after quiet seasons; it takes a turning point.
        if (p.political.outSeasons >= 2 && !feudOn(s)) { p.political = undefined; event(s, p.id, `${capital(p.name)} is no longer a political rival.`, "you out-climbed him"); }
        continue;
      }
      p.political.outSeasons = 0;
      const r = p.political.rank;
      // A hold over you (a leverage token, or with "secrets" on any usable secret) lifts him.
      const hold = leverageOver(s, p.id, PLAYER) > 0;
      if (r === 1 && (officesOf(s, p.id).length >= 2 || hold)) politicalRank(s, p.id, 1, officesOf(s, p.id).length >= 2 ? "he holds two offices" : "he holds a secret over you");
      else if (r === 2 && inf >= you && (!on(s, "coalition") || coalition(s, p))) {
        const f = on(s, "coalition") ? coalition(s, p) : undefined;
        politicalRank(s, p.id, 1, `his influence (${inf}) has reached yours (${you})${f ? `, and ${s.factions[f].short} stand with him` : ""}`);
      }
      continue;
    }
    if (!["Office", "Power"].includes(p.ambition) || !close || p.status !== "free") continue;
    if (s.people && Object.values(s.people).filter((x) => x.political && alive(x)).length >= max) continue;
    p.political = { type: (p as any).politicalType ?? DATA.people.find((x) => x.id === p.id)?.politicalType ?? DATA.politicalTypeByFaction[p.faction] ?? "Climber", rank: 1, since: s.season, outSeasons: 0 };
    s.counters.politicalRivals = (s.counters.politicalRivals ?? 0) + 1;
    event(s, p.id, `${capital(p.name)} becomes a political rival (${p.political.type}). He wants your place, not your life.`, `Ambition: ${p.ambition}; his influence ${inf} is within ${T(s).politicalRange} of yours (${you})`);
  }
}

// ---------- A simple player for headless runs ----------

import { menu, perform, preview, refuse as refuseRequest } from "./actions.ts";
import type { Args } from "./types.ts";
import { exileChoices, inExile } from "./exile.ts";

export function botTurn(s: GameState) {
  let guard = 0;
  while (s.slots > 0 && !s.over && guard++ < 10) {
    const c = botChoices(s).filter((x) => preview(s, x.a, x.args).ok);
    if (!c.length) break;
    const top = c.slice(0, 2);
    const ch = top.length > 1 && nextRandom(s) < 0.3 ? top[1] : top[0];
    perform(s, ch.a, ch.args);
  }
  for (const r of s.requests.slice()) if (r.season === s.season) refuseRequest(s, r.id);
}

function botChoices(s: GameState): { a: string; args: Args }[] {
  if (inExile(s)) return exileChoices(s); // switch "exile": the exile's own priority list
  const out: { a: string; args: Args }[] = [];
  const push = (a: string, args: Args = {}) => out.push({ a, args });
  const free = others(s).filter((p) => p.status === "free");
  if (s.building) push("build", { target: s.building.what });
  if (s.guard.owed > 0) push("payGuard");
  if (s.grain <= 4) { push("buyGrain"); push("buyGrain"); }
  if (s.island) for (const c of islandChoices(s)) push(c.a, c.args ?? {}); // the island game (Phase 2)
  // Break plots you can see.
  for (const pl of s.plots) for (const m of pl.known) if (s.people[m].status === "free") push("imprison", { target: m });
  for (const p of others(s)) if (p.status === "held" && p.rival) push("exile", { target: p.id });
  const danger = s.plots.some((pl) => pl.stage >= 2);
  if (danger) {
    const sus = free.filter((p) => p.grudges.length && p.knownUntil < s.season).sort((a, b) => officesOf(s, b.id).length - officesOf(s, a.id).length);
    if (sus.length) push("watch", { target: sus[0].id });
    for (const p of free) if (p.rival && officesOf(s, p.id).length) push("revokeOffice", { target: p.id, second: officesOf(s, p.id)[0] });
    if (s.silver >= 2 + s.guard.upkeep) push("hire");
  }
  // Answer petitions with something cheap where it can.
  for (const r of s.requests) {
    if (r.kind === "silver" && s.silver >= 3) push("bribe", { target: r.from, second: "1" });
    if (r.kind === "citizenship" && s.land > 0) push("grantGuard");
    if (r.kind === "marriage") push("marriage", { target: r.from, second: s.people[PLAYER].married ? "thearides" : PLAYER });
    if (r.kind === "office" && r.office && !["treasury", "generalship", "citadel"].includes(r.office)) push("grantOffice", { target: r.from, second: r.office });
  }
  // Soothe grudges among the powerful.
  const sore = free.filter((p) => p.grudges.length && officesOf(s, p.id).length).sort((a, b) => b.grudges.length - a.grudges.length)[0];
  if (sore) push("pardon", { target: sore.id });
  if (s.silver <= 2) {
    push("strikeCoin");
    if (!s.laws.includes("harbourDues")) push("proposeLaw", { target: "harbourDues" });
    if (!s.laws.includes("taxPeople")) push("proposeLaw", { target: "taxPeople" });
    const rich = free.filter((p) => p.faction === "rich" && !p.grudges.length);
    if (rich.length) push("seize", { target: pick(s, rich).id });
  }
  if (!s.citadelBuilt && s.silver >= 4 + s.guard.upkeep) push("build", { target: "citadel" });
  if (s.clock >= 7 && s.silver >= 1) push("envoy");
  if (s.factions.citizens.mood <= 2 && s.grain >= 6) push("grainHandout");
  for (const ex of others(s).filter((p) => p.status === "outside" && p.rival)) push("offerTerms", { target: ex.id });
  if (dinnersOn(s) && s.silver >= 3) { const t = suggestTable(s); if (t) push("hostDinner", t); } // switch "dinners"
  if (s.silver >= 3) { const low = free.sort((a, b) => a.opinion - b.opinion)[0]; if (low) push("feast", { target: low.id }); }
  const any = free.filter((p) => p.knownUntil < s.season);
  if (any.length) push("watch", { target: pick(s, any).id });
  push("strikeCoin");
  return out;
}
