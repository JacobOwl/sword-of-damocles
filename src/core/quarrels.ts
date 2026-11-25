// Switch "quarrels" (Quarrels with terms, council on Solium Infernum 2026-11-25, Jacob: "Build it").
// A man stands up before the assembly and swears what he will do to another, and by when: strip him of his
// offices, drive him from the city, or shame him. The quarrel is then fought by public accusation in the
// assembly, where the factions take sides. Keep the oath and you gain; let the day pass and you lose face,
// and he gains. The computer's rivals swear against you too, in the open, so the quarrel is its own warning.
// Public accusation in the assembly is history (Diodorus 13.91 to 13.92, docs/research/quarrels.md); the oath
// with a set day, the limits and every number are invention (data/quarrels.json).
import quarrelsJson from "../../data/quarrels.json" with { type: "json" };
import { PLAYER, alive, capital, holds, isPlayerTyranny, leverageOver, nameOf, officeName, officesOf, others, plotOf, power, seasonName } from "./state.ts";
import { event, factionOf, grudge, makeRival, mood, opinion, powerChange, rankChange, roll, setOffice, setStatus, silver } from "./ops.ts";
import { on } from "./switches.ts";
import { pronoun } from "./pronouns.ts";
import { politicalRank, traitMods } from "./actions.ts";
import type { FactionId, GameState, Mod, OfficeId, Person } from "./types.ts";
import { FACTIONS } from "./types.ts";

export type AimId = "office" | "exile" | "shame";
export interface Quarrel {
  id: number;
  by: string; // who swore it: you (PLAYER) or one of the computer's people
  against: string;
  aim: AimId;
  office?: OfficeId; // the office he swore to take from you (their quarrels)
  sworn: number; // the season it was sworn
  due: number; // the last season it can be made good in
  tries: number; // accusations brought so far
  end?: { season: number; how: "kept" | "conceded" | "lapsed" | "silenced" | "gone" };
}
export interface QuarrelState { list: Quarrel[]; conceded: number; next: number }

const Q = quarrelsJson as unknown as { knobs: Record<string, number>; aims: { id: AimId; name: string; need: number; oath: string; theirOath?: string }[] };
export const QK = Q.knobs;
export const AIMS = Q.aims;
export const aimById = (id: string) => AIMS.find((a) => a.id === id)!;
export const quarrelsOn = (s: GameState) => on(s, "quarrels");
const qs = (s: GameState): QuarrelState => (s.quarrels ??= { list: [], conceded: 0, next: 1 });
export const openQuarrels = (s: GameState) => (s.quarrels?.list ?? []).filter((q) => !q.end);
export const quarrelBetween = (s: GameState, a: string, b: string) => openQuarrels(s).find((q) => (q.by === a && q.against === b) || (q.by === b && q.against === a));
export const yourQuarrels = (s: GameState) => openQuarrels(s).filter((q) => q.by === PLAYER);
export const quarrelsAgainstYou = (s: GameState) => openQuarrels(s).filter((q) => q.against === PLAYER);
// The last time these two quarrelled, so a man is not sworn against again at once.
const lastEnded = (s: GameState, a: string, b: string) =>
  Math.max(-99, ...(s.quarrels?.list ?? []).filter((q) => q.end && ((q.by === a && q.against === b) || (q.by === b && q.against === a))).map((q) => q.end!.season));
const cooled = (s: GameState, a: string, b: string) => s.season - lastEnded(s, a, b) >= QK.coolSeasons;
const seasonsWord = (n: number) => (n === 1 ? "this season" : `${["", "one", "two", "three", "four", "five", "six"][n] ?? n} seasons`);
const an = (w: string) => (/^[AEIOU]|^Heir/.test(w) ? `an ${w}` : `a ${w}`);
const fill = (s: GameState, t: string, q: Pick<Quarrel, "against" | "office">) =>
  t.replace("{name}", nameOf(s, q.against)).replace("{his}", pronoun(s, q.against, "his")).replace("{office}", q.office ? officeName(q.office) : "an office");

// ---------- What the assembly weighs ----------
// The factions take sides as they do on a law: the accused man's own faction and any faction Angry or worse
// with you stand with him (or with your accuser); any faction Content or better stands with you. Every three
// points of power between the sides is one on the roll, as in a vote.
export function sides(s: GameState, yourMan: string): { you: FactionId[]; him: FactionId[] } {
  const hisF = factionOf(s, yourMan);
  const you: FactionId[] = [], him: FactionId[] = [];
  for (const f of FACTIONS) {
    if (f === hisF || s.factions[f].mood <= 1) him.push(f);
    else if (s.factions[f].mood >= 3) you.push(f);
  }
  return { you, him };
}
function weightMod(s: GameState, other: string, forYou: boolean): Mod {
  const sd = sides(s, other);
  const sum = (fs: FactionId[]) => fs.reduce((a, f) => a + power(s, f), 0);
  const diff = (sum(sd.you) - sum(sd.him)) * (forYou ? 1 : -1);
  const v = diff >= 0 ? Math.floor(diff / 3) : -Math.floor(-diff / 3);
  const names = (fs: FactionId[]) => fs.map((f) => s.factions[f].short).join(" and ") || "no faction";
  return { label: `the assembly: ${names(sd.you)} with you, ${names(sd.him)} with ${nameOf(s, other)}`, value: v };
}

// Your accusation: who is with whom, what you hold against him, and the guard at your back.
export function accuseMods(s: GameState, target: string, fine: boolean): Mod[] {
  const p = s.people[target];
  const m: Mod[] = [weightMod(s, target, true)];
  if (holds(s, PLAYER, "assembly")) m.push({ label: "you hold the assembly", value: 1 });
  if (holds(s, target, "assembly")) m.push({ label: `${p.name} holds the assembly`, value: -1 });
  const pl = plotOf(s, target);
  if (p.exposed || leverageOver(s, PLAYER, target) > 0 || (pl && pl.known.includes(target))) m.push({ label: "you have something to charge him with", value: 1 });
  if (isPlayerTyranny(s)) m.push({ label: "the assembly fears your guard", value: 1 });
  if (fine) m.push({ label: "a rich friend pays the fines for the uproar", value: 1 });
  const q = quarrelBetween(s, PLAYER, target);
  const hard = q ? accuseNeed(q) - 4 : 0;
  if (hard > 0) m.push({ label: q!.aim === "exile" ? "banishing a citizen is the heaviest charge" : "stripping a man of office is a heavy charge", value: -hard });
  m.push(...traitMods(s, PLAYER, target, "proposeLaw"));
  return m;
}
// His accusation against you, the same weighing turned around.
function theirMods(s: GameState, q: Quarrel): Mod[] {
  const p = s.people[q.by];
  const m: Mod[] = [weightMod(s, q.by, false)];
  if (holds(s, PLAYER, "assembly")) m.push({ label: "you hold the assembly", value: -1 });
  if (holds(s, q.by, "assembly")) m.push({ label: `${p.name} holds the assembly`, value: 1 });
  if (isPlayerTyranny(s)) m.push({ label: "the assembly fears your guard", value: -1 });
  m.push(...traitMods(s, q.by, undefined, "plantRumor"));
  return m;
}
export const accuseNeed = (q: Quarrel) => aimById(q.aim).need;

// ---------- You swear a quarrel (action "swearQuarrel") ----------
export function canSwear(s: GameState, target: string): string | null {
  if (yourQuarrels(s).length >= QK.maxOpenByYou) return `you already have ${QK.maxOpenByYou} quarrels sworn`;
  if (quarrelBetween(s, PLAYER, target)) return "you are already in a quarrel with him";
  if (!cooled(s, PLAYER, target)) return "your last quarrel with him ended too lately";
  return null;
}
export function aimOptions(s: GameState, target?: string) {
  if (!target) return [];
  return AIMS.filter((a) => a.id !== "office" || officesOf(s, target).length > 0).map((a) => ({ value: a.id, label: a.name }));
}
export const termOptions = () => [
  { value: String(QK.shortSeasons), label: `Within ${seasonsWord(QK.shortSeasons)} (a bolder oath: more to gain)` },
  { value: String(QK.longSeasons), label: `Within ${seasonsWord(QK.longSeasons)}` },
];

export function swear(s: GameState, target: string, aim: AimId, term: number) {
  const st = qs(s);
  const p = s.people[target];
  const q: Quarrel = { id: st.next++, by: PLAYER, against: target, aim, sworn: s.season, due: s.season + term - 1, tries: 0 };
  st.list.push(q);
  s.counters.quarrelsYours = (s.counters.quarrelsYours ?? 0) + 1;
  event(s, PLAYER, `You stand up in the assembly and swear that within ${seasonsWord(term)} you will ${fill(s, aimById(aim).oath, q)}.`, "Swear a quarrel");
  // Solium's answer to a demand: give in, or refuse. A careful or friendly man gives way rather than face the assembly.
  if (p.ambition === "Safety" || p.opinion >= 1 || p.traits.includes("cautious")) {
    yields(s, q);
    return;
  }
  event(s, target, `${capital(p.name)} refuses to give way. The quarrel is open until ${seasonName(q.due)}.`, "he will not give way, and thinks the assembly will stand with him");
  grudge(s, target, `you swore before the assembly to ${aimById(aim).name.charAt(0).toLowerCase()}${aimById(aim).name.slice(1)}`);
  opinion(s, target, -1, "you swore a quarrel against him");
  const f = factionOf(s, target);
  if (f) mood(s, f, -1, `you swore a quarrel against ${p.name}`);
}
// He gives way at once: the aim happens without a trial, but there is no glory in it.
function yields(s: GameState, q: Quarrel) {
  const p = s.people[q.against];
  const why = "he gave way rather than face the assembly";
  if (q.aim === "office") for (const o of officesOf(s, p.id)) setOffice(s, o, PLAYER, `${p.name} gave it up rather than face the assembly`);
  if (q.aim === "exile") setStatus(s, p.id, "outside", "he left the city rather than face the assembly");
  if (q.aim === "shame") { p.infl -= 1; event(s, p.id, `${capital(p.name)} begs your pardon in public.`, why); }
  else event(s, p.id, `${capital(p.name)} gives way rather than face the assembly.`, `${p.ambition === "Safety" ? "a careful man" : p.opinion >= 1 ? "he thinks well of you" : "a cautious man"}`);
  opinion(s, p.id, -1, "he gave way to you in public");
  close(s, q, "conceded");
}

// ---------- You accuse him (action "accuseAssembly") ----------
export function accuse(s: GameState, target: string, fine: boolean, ok: boolean) {
  const q = quarrelBetween(s, PLAYER, target)!;
  const p = s.people[target];
  q.tries += 1;
  s.counters.accusations = (s.counters.accusations ?? 0) + 1;
  if (fine) silver(s, -QK.fineSilver, "a rich friend paid the fines for your uproar in the assembly");
  if (!ok) {
    event(s, PLAYER, `The assembly will not convict ${p.name}. ${q.due > s.season ? `You have until ${seasonName(q.due)}.` : "Your day has run out."}`, "Accuse before the assembly failed");
    p.infl += 1;
    event(s, p.id, `${capital(p.name)} walks out of the assembly cleared, and the stronger for it.`, "an accusation that fails makes the accused look wronged");
    return;
  }
  const short = q.due - q.sworn + 1 <= QK.shortSeasons;
  event(s, PLAYER, `The assembly hears you out and finds against ${p.name}.`, "Accuse before the assembly");
  if (q.aim === "office") for (const o of officesOf(s, p.id)) setOffice(s, o, PLAYER, `the assembly stripped ${p.name} of it at your accusation`);
  if (q.aim === "exile") setStatus(s, p.id, "outside", "the assembly drove him from the city at your accusation");
  if (q.aim === "shame") {
    p.infl -= 2;
    event(s, p.id, `${capital(p.name)} leaves the assembly to jeers.`, "shamed before the assembly");
    if (p.political) politicalRank(s, p.id, -1, "shamed before the assembly");
    const f = factionOf(s, p.id);
    if (f) powerChange(s, f, -1, `${p.name} was shamed before the assembly`);
  }
  mood(s, "citizens", 1, "you made good your oath before the assembly");
  if (short) {
    const best = FACTIONS.filter((f) => f !== factionOf(s, p.id)).sort((a, b) => s.factions[b].mood - s.factions[a].mood)[0];
    powerChange(s, best, 1, "an oath kept quickly: the city sees whose side wins");
  }
  makeRival(s, p.id, "Humiliated", "you beat him in the assembly");
  qs(s).conceded = 0;
  close(s, q, "kept");
}

// ---------- The computer's people swear against you ----------
// One quarrel against you at a time, one man at a time, and never one who is plotting in secret:
// a man who means to kill you does not announce it.
function wantsToSwear(s: GameState, p: Person): boolean {
  if (p.status !== "free" || p.player) return false;
  const angry = (p.political?.rank ?? 0) >= 2 || (p.rival?.rank ?? 0) >= 2;
  if (!angry || (!p.grudges.length && p.opinion > -2)) return false;
  if (plotOf(s, p.id)) return false;
  if (quarrelsAgainstYou(s).length >= QK.maxOpenAgainstYou) return false;
  if (quarrelBetween(s, p.id, PLAYER) || !cooled(s, p.id, PLAYER)) return false;
  return (s.quarrels?.list ?? []).every((q) => q.sworn !== s.season); // one new quarrel a season at most
}
function theirAim(s: GameState, p: Person): { aim: AimId; office?: OfficeId } {
  if (p.wants && holds(s, PLAYER, p.wants) && p.wants !== "citadel") return { aim: "office", office: p.wants };
  const o = (["treasury", "fleet", "assembly", "mint", "generalship"] as OfficeId[]).find((x) => holds(s, PLAYER, x));
  if (o && (p.political?.rank ?? 0) >= 2) return { aim: "office", office: o };
  return { aim: "shame" };
}
// Called at the start of his turn in the people step. Returns true if the quarrel took his turn.
export function quarrelTurn(s: GameState, p: Person): boolean {
  if (!quarrelsOn(s) || s.over) return false;
  const mine = openQuarrels(s).find((q) => q.by === p.id);
  if (mine) { theirAccusation(s, mine); return true; }
  if (!wantsToSwear(s, p)) return false;
  const st = qs(s);
  const { aim, office } = theirAim(s, p);
  const term = QK.theirSeasons;
  const q: Quarrel = { id: st.next++, by: p.id, against: PLAYER, aim, office, sworn: s.season, due: s.season + term, tries: 0 };
  st.list.push(q);
  s.counters.quarrelsTheirs = (s.counters.quarrelsTheirs ?? 0) + 1;
  const why = p.political ? `${an(p.political.type)} who wants your place` : "your enemy, and he wants it known";
  event(s, p.id, `${capital(p.name)} stands up in the assembly and swears that before ${seasonName(q.due)} he will ${fill(s, aimById(aim).theirOath!, q)}.`, `${why}; grudge: ${p.grudges[0]?.reason ?? "none, but he thinks little of you"}`);
  const hint = aim === "office" ? `Give him ${officeName(office!)} and the quarrel ends; or see that the factions stand with you when he brings his charge.` : "Gift him 3 silver and the quarrel ends; or see that the factions stand with you when he brings his charge.";
  event(s, PLAYER, hint, "a sworn quarrel can be answered");
  return true;
}
function theirAccusation(s: GameState, q: Quarrel) {
  const p = s.people[q.by];
  q.tries += 1;
  s.counters.accusations = (s.counters.accusations ?? 0) + 1;
  const r = roll(s, p.id, `${capital(p.name)} accuses you before the assembly`, theirMods(s, q), accuseNeed(q), true);
  if (!r.ok) {
    event(s, p.id, `The assembly hears ${p.name} out and does nothing.${q.due > s.season ? ` He has until ${seasonName(q.due)}.` : ""}`, "his accusation failed");
    return;
  }
  if (q.aim === "office" && q.office && holds(s, PLAYER, q.office)) {
    event(s, p.id, `The assembly finds for ${p.name} and takes ${officeName(q.office)} from you. He holds it now.`, "his accusation carried");
    setOffice(s, q.office, p.id, `the assembly took it from you at ${p.name}'s accusation`);
  } else {
    event(s, p.id, `${capital(p.name)} shames you before the assembly, and the city laughs with him.`, "his accusation carried");
    mood(s, "citizens", -1, `${p.name} shamed you before the assembly`);
  }
  p.infl += 1;
  const f = factionOf(s, p.id);
  if (f) powerChange(s, f, 1, `${p.name} beat you in the assembly`);
  if (p.political) politicalRank(s, p.id, 1, "he beat you in the assembly");
  else if (p.rival) rankChange(s, p.id, 1, "he beat you in the assembly");
  close(s, q, "kept");
}

// ---------- Answering a quarrel sworn against you ----------
// Giving him what he swore to take ends it (hooked into Grant an office and Bribe). Give way too often and the
// city decides you can be pushed.
export function quarrelConceded(s: GameState, by: string, what: "office" | "gift", office?: OfficeId) {
  if (!quarrelsOn(s)) return;
  const q = openQuarrels(s).find((x) => x.by === by && x.against === PLAYER && (what === "gift" ? x.aim === "shame" : x.office === office));
  if (!q) return;
  const p = s.people[by];
  event(s, by, `${capital(p.name)} has what he swore to have, and lets the quarrel drop.`, what === "gift" ? "your gift bought him off" : `you gave him ${officeName(office!)}`);
  close(s, q, "conceded");
  const st = qs(s);
  st.conceded += 1;
  s.counters.concessions = (s.counters.concessions ?? 0) + 1;
  if (st.conceded >= QK.concedeLimit) {
    st.conceded = 0;
    event(s, PLAYER, "You have given way three times running. The city decides you can be pushed.", "three concessions in a row");
    mood(s, "guard", -1, "a ruler who gives way to every man who shouts in the assembly");
    for (const r of others(s).filter((x) => x.political && alive(x))) politicalRank(s, r.id, 1, "you can be pushed");
  }
}
// You took him out of the city or the world while he had a quarrel sworn against you: the city sees that you
// silenced him rather than answer him (hooked into Imprison, Exile and Execute).
export function quarrelSilenced(s: GameState, pid: string, how: string) {
  if (!quarrelsOn(s)) return;
  const q = quarrelBetween(s, PLAYER, pid);
  if (!q) return;
  const p = s.people[pid];
  // Either way round: you swore against him and used your guards instead of the assembly, or he swore
  // against you and you shut his mouth. The city sees it.
  event(s, PLAYER, q.by === PLAYER
    ? `The city says you ${how.replace("{name}", p.name)} because you could not beat ${pronoun(s, pid, "him")} in the assembly.`
    : `The city says you ${how.replace("{name}", p.name)} rather than answer ${pronoun(s, pid, "him")} in the assembly.`, q.by === PLAYER ? "you had sworn a quarrel against him" : "he had sworn a quarrel against you");
  mood(s, "citizens", -1, `you silenced ${p.name} rather than face ${pronoun(s, pid, "him")} in the assembly`);
  close(s, q, "silenced");
}

// ---------- The season's end: oaths that ran out ----------
export function quarrelsSeasonEnd(s: GameState) {
  if (!quarrelsOn(s) || !s.quarrels) return;
  for (const q of openQuarrels(s)) {
    const other = q.by === PLAYER ? s.people[q.against] : s.people[q.by];
    // He is dead, held or gone from the city: the quarrel ends with no one the winner. (Taking him out of the
    // city yourself does not count as keeping your oath: that was the assembly's to do.)
    if (other.status !== "free") {
      close(s, q, "gone");
      event(s, q.by === PLAYER ? PLAYER : other.id, q.by === PLAYER ? `Your quarrel with ${other.name} ends: he is beyond the assembly's reach.` : `${capital(other.name)}'s quarrel with you ends: he can no longer bring it.`, other.status === "dead" ? "he is dead" : "he is no longer free in the city");
      continue;
    }
    if (q.due > s.season) continue;
    if (q.by === PLAYER) {
      event(s, PLAYER, `The day you swore by has passed, and ${other.name} still stands. The city remembers your oath.`, "an oath not kept");
      mood(s, "citizens", -1, "you swore before the assembly and did not make it good");
      other.infl += 2;
      const f = factionOf(s, other.id);
      if (f) powerChange(s, f, 1, `${other.name} faced you down`);
      opinion(s, other.id, -1, "you swore against him and failed");
    } else {
      event(s, other.id, `${capital(other.name)} swore to ${fill(s, aimById(q.aim).theirOath!, q)} and could not. The city laughs at him.`, "an oath not kept");
      other.infl -= 2;
      if (other.political) politicalRank(s, other.id, -1, "his oath came to nothing");
      else if (other.rival) rankChange(s, other.id, -1, "his oath came to nothing");
      const f = factionOf(s, other.id);
      if (f) powerChange(s, f, -1, `${other.name}'s oath came to nothing`);
    }
    close(s, q, "lapsed");
  }
}
function close(s: GameState, q: Quarrel, how: NonNullable<Quarrel["end"]>["how"]) {
  q.end = { season: s.season, how };
  const k = `quarrel_${how}_${q.by === PLAYER ? "yours" : "theirs"}`;
  s.counters[k] = (s.counters[k] ?? 0) + 1;
}

// One plain line about a quarrel, for the dangers column and the people sheet.
export function quarrelLine(s: GameState, q: Quarrel): string {
  const left = q.due - s.season;
  const when = left <= 0 ? "this season is the last" : `until ${seasonName(q.due)}`;
  if (q.by === PLAYER) return `You swore to ${fill(s, aimById(q.aim).oath, q)}, ${when}. You need ${accuseNeed(q)} or more to convict him.`;
  return `${capital(nameOf(s, q.by))} swore to ${fill(s, aimById(q.aim).theirOath!, q)}, ${when}. He needs ${accuseNeed(q)} or more.`;
}
