// Switch "commission" (off by default; island games only): who leads the army, and what it costs at home.
// When you muster you choose the leader: yourself, or a named man. If you go, you name a keeper of the citadel;
// while you are away plots gain strength and the keeper's loyalty enters your defense. Mustering the levy arms
// the citizens. When the army comes home (disbanded or destroyed) the homecoming is a logged step: you, or the man
// you sent, come home cheered or shamed. Numbers are in data/commission.json; the sourced pattern is in
// docs/research/commission.md. Every rule here is invention.
import { pronoun } from "./pronouns.ts";
import commissionJson from "../../data/commission.json" with { type: "json" };
import { on } from "./switches.ts";
import { PLAYER, alive, capital, nameOf, plotOf } from "./state.ts";
import { event, mood, opinion, powerChange, factionOf } from "./ops.ts";
import type { Args, GameState, Mod, Plot } from "./types.ts";

export const COMMISSION = commissionJson as any;
const K = () => COMMISSION.knobs as Record<string, number>;
interface Option { value: string; label: string }

export const commissionOn = (s: GameState) => !!s.island && on(s, "commission");
export const away = (s: GameState) => !!s.campaign && s.campaign.leader === PLAYER; // you are in the field
const free = (s: GameState, id: string) => { const p = s.people[id]; return !!p && p.status === "free"; };
const sgn = (n: number) => (n > 0 ? `+${n}` : `${n}`);

// ---------- Choosing who leads, and the keeper ----------
export function commanderOptions(s: GameState): Option[] {
  const gen = s.offices.generalship;
  const generalOther = gen && gen !== PLAYER && free(s, gen) ? gen : null;
  const you = gen === PLAYER ? "You lead it yourself, as general" : generalOther ? `You lead it yourself (unlawful: ${nameOf(s, generalOther)} is the general)` : "You lead it yourself";
  const out: Option[] = [{ value: PLAYER, label: you }];
  const ids: string[] = [...(generalOther ? [generalOther] : []), ...(COMMISSION.commanders as string[]).filter((id) => id !== generalOther)];
  for (const id of ids) {
    const p = s.people[id];
    if (!p || p.status !== "free" || p.exposed) continue;
    const role = id === generalOther ? "the general" : gen === PLAYER || !gen ? "as your officer" : "unlawful: not the general";
    out.push({ value: id, label: `Send ${capital(p.name)} (${role}; thinks ${sgn(p.opinion)} of you)` });
  }
  return out;
}
export function keeperValue(s: GameState, id: string | undefined, truth: boolean): { value: number; label: string } {
  const k = K();
  if (!id || !free(s, id)) return { value: k.keeperGone, label: "no one keeps the citadel" };
  const p = s.people[id];
  const name = capital(p.name);
  const pl = plotOf(s, id);
  if (pl && (truth || pl.known.includes(id))) return { value: k.keeperFalse, label: `${name}, keeper of the citadel, is with the plotters` };
  if (p.opinion >= 2) return { value: k.keeperLoyal, label: `${name} keeps the citadel faithfully` };
  if (p.opinion <= -1) return { value: k.keeperSour, label: `${name} keeps the citadel grudgingly` };
  return { value: 0, label: `${name} keeps the citadel` };
}
export function keeperOptions(s: GameState, a: Args): Option[] {
  if (a.target !== PLAYER) return [];
  return (COMMISSION.keepers as string[]).filter((id) => free(s, id)).map((id) => {
    const v = keeperValue(s, id, false);
    const d = v.value ? `your defense ${sgn(v.value)} while you are away` : "no change to your defense";
    return { value: id, label: `${capital(s.people[id].name)} (thinks ${sgn(s.people[id].opinion)} of you; ${d})` };
  });
}

// Every price, in plain words, before you commit (shown under the muster action).
export function musterNotes(s: GameState, a: Args): string[] {
  if (!commissionOn(s) || !a.target) return [];
  const k = K();
  const out: string[] = [];
  const gen = s.offices.generalship;
  const lawful = isLawful(s, a.target);
  if (a.target === PLAYER) {
    out.push(`You will be away: every plot at home gains ${sgn(k.awayPlot)} strength until you come home.`);
    if (a.option) { const v = keeperValue(s, a.option, false); out.push(`${capital(v.label)}: ${v.value ? `your defense ${sgn(v.value)} while you are away` : "no change to your defense"}. If he dies or flees, ${sgn(k.keeperGone)}.`); }
    out.push(`You lead in person: ${sgn(k.inPerson)} in battle.`);
    out.push(`Come home with a victory or a town taken and the citizens' mood rises ${k.homeGlory}; come home beaten and it falls ${-k.homeShame}.`);
  } else {
    const p = s.people[a.target];
    if (p) out.push(`${capital(p.name)} leads it. Plots at home do not gain from your absence. If he wins a battle or takes a town, he comes home popular: his influence rises (up to ${k.heroInfluenceMax}) and his faction gains ${k.heroPower} power.`);
  }
  if (s.factions.citizens.mood >= 2) out.push(`The levy arms the citizens: a plot with a citizen in it gains ${sgn(k.armedPlot)} strength while the army is out.`);
  if (!lawful && gen && gen !== PLAYER) out.push(`Unlawful: ${capital(nameOf(s, gen))} is the general. The citizens' mood falls ${-k.unlawfulMood}, and he thinks 1 less of you.`);
  const named = s.plots.filter((pl) => pl.stage >= 2).length;
  if (named) out.push(`${named} plot${named === 1 ? " is" : "s are"} at Rumors or worse right now.`);
  return out;
}
function isLawful(s: GameState, leader: string): boolean {
  const gen = s.offices.generalship;
  return !gen || gen === PLAYER || gen === leader || !free(s, gen);
}

// ---------- The muster and the homecoming ----------
export function startCampaign(s: GameState, leader: string, keeper: string | undefined) {
  if (s.campaign) campaignCheck(s); // the last army was lost this season: its homecoming first
  const a = s.island!.armies.find((x) => x.side === "syracuse")!;
  const k = K();
  a.commander = leader;
  const lawful = isLawful(s, leader);
  s.campaign = {
    army: a.id, leader, keeper: leader === PLAYER ? keeper : undefined, since: s.season, lawful,
    armed: s.factions.citizens.mood >= 2,
    won0: s.counters.battlesWon ?? 0, lost0: s.counters.battlesLost ?? 0, taken0: s.counters.citiesTaken ?? 0,
  };
  s.people[leader].where = "field";
  s.counters.campaigns = (s.counters.campaigns ?? 0) + 1;
  if (leader === PLAYER) {
    s.counters.ledInPerson = (s.counters.ledInPerson ?? 0) + 1;
    event(s, PLAYER, keeper ? `You march at the head of the army. ${capital(nameOf(s, keeper))} keeps the citadel until you come home.` : "You march at the head of the army, and leave no one to keep the citadel.", "you lead the army yourself");
  } else {
    s.counters.sentNamed = (s.counters.sentNamed ?? 0) + 1;
    event(s, leader, `${capital(nameOf(s, leader))} marches at the head of the army.`, lawful ? "you sent him to lead it" : "you gave him the army, though he is not the general");
  }
  if (!lawful) {
    const gen = s.offices.generalship!;
    s.counters.unlawfulCommands = (s.counters.unlawfulCommands ?? 0) + 1;
    mood(s, "citizens", k.unlawfulMood, `the army marched under ${leader === PLAYER ? "you" : nameOf(s, leader)}, not the general the assembly chose`);
    opinion(s, gen, -1, "you passed him over for command");
  }
}

// Each season and after each order: has the army come home? Has its leader been lost?
export function campaignCheck(s: GameState) {
  const c = s.campaign;
  if (!c) return;
  const army = s.island?.armies.find((x) => x.id === c.army);
  if (c.leader !== PLAYER && !c.lost && !free(s, c.leader)) {
    c.lost = true;
    s.people[c.leader].where = undefined;
    event(s, "world", `The army in the field has lost its leader, ${nameOf(s, c.leader)}. His officers bring it on under your orders.`, "he is no longer free to lead it");
  }
  if (!army) homecoming(s);
}

function homecoming(s: GameState) {
  const c = s.campaign!;
  const k = K();
  const won = (s.counters.battlesWon ?? 0) - c.won0;
  const lost = (s.counters.battlesLost ?? 0) - c.lost0;
  const taken = (s.counters.citiesTaken ?? 0) - c.taken0;
  const destroyed = s.flags.armyLost !== undefined && s.flags.armyLost >= c.since;
  const tally = [won ? `${won} battle${won === 1 ? "" : "s"} won` : "", lost ? `${lost} lost` : "", taken ? `${taken} town${taken === 1 ? "" : "s"} taken` : ""].filter(Boolean).join(", ") || "no battle won and no town taken";
  const glory = !destroyed && won + taken > 0 && won >= lost;
  s.counters.homecomings = (s.counters.homecomings ?? 0) + 1;
  if (c.leader === PLAYER) {
    event(s, PLAYER, destroyed ? `You come home to Syracuse with a few horsemen; the army is gone (${tally}).` : `You come home to Syracuse at the head of the army (${tally}).`, "Homecoming");
    if (glory) { s.counters.heroHomecomings = (s.counters.heroHomecomings ?? 0) + 1; mood(s, "citizens", k.homeGlory, "the city cheers you home"); }
    else if (!destroyed && lost > won) mood(s, "citizens", k.homeShame, "you come home beaten");
    if (c.keeper && free(s, c.keeper)) {
      const pl = plotOf(s, c.keeper);
      if (pl && !pl.known.includes(c.keeper)) {
        pl.known.push(c.keeper);
        event(s, c.keeper, `${capital(nameOf(s, c.keeper))} hands back the keys of the citadel, but will not meet your eye. You learn he is in a plot against you.`, "you came home and watched your keeper");
      } else event(s, c.keeper, `${capital(nameOf(s, c.keeper))} hands back the keys of the citadel.`, "you came home");
    }
  } else if (!c.lost) {
    const p = s.people[c.leader];
    event(s, c.leader, destroyed ? `${capital(p.name)} comes home with the few who escaped (${tally}).` : `${capital(p.name)} brings the army home (${tally}).`, "Homecoming");
    if (glory) {
      s.counters.heroHomecomings = (s.counters.heroHomecomings ?? 0) + 1;
      const gain = Math.min(k.heroInfluenceMax, won + taken);
      p.infl += gain;
      event(s, c.leader, `Syracuse cheers ${p.name} home. ${capital(pronoun(s, p.id, "his"))} influence rises by ${gain}.`, "he won in the field, and the men he led talk of him");
      const f = factionOf(s, c.leader);
      if (f) powerChange(s, f, k.heroPower, `${p.name} came home a victor`);
    } else if (destroyed || lost > won) {
      p.infl -= 1;
      event(s, c.leader, `Men blame ${p.name} for the defeat. ${capital(pronoun(s, p.id, "his"))} influence falls by 1.`, "he lost in the field");
    }
  }
  for (const id of [c.leader, c.keeper]) if (id && s.people[id]) s.people[id].where = undefined;
  s.campaign = undefined;
}

// ---------- What it does to plots and to your defense (read by state.ts) ----------
export function campaignPlotParts(s: GameState, pl: Plot): Mod[] {
  const c = s.campaign;
  if (!c || !on(s, "commission")) return [];
  const k = K();
  const out: Mod[] = [];
  if (c.leader === PLAYER) out.push({ label: "you are away with the army", value: k.awayPlot });
  if (c.armed && pl.members.some((m) => s.people[m]?.faction === "citizens" && alive(s.people[m]))) out.push({ label: "the citizens are armed for the war", value: k.armedPlot });
  return out;
}
export function campaignDefense(s: GameState): Mod[] {
  if (!away(s) || !on(s, "commission")) return [];
  const v = keeperValue(s, s.campaign!.keeper, true);
  return v.value ? [{ label: v.label, value: v.value }] : [];
}
export const keeperInfluence = (s: GameState, pid: string) => (away(s) && s.campaign!.keeper === pid ? K().keeperInfluence : 0);
