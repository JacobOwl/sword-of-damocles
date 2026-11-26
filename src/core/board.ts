// Switch "contestedBoard" (The contested board, thread 37): the offices as seats people fight over.
// Each seat has a holder who uses it every season, a way it changes hands, and a "dug in" track; the people who
// matter climb one ladder of standing; and big changes open matters before you. Every number and every text is in
// data/board.json. Design: docs/council/2026-11-26-offices-rivals-events.md; history: docs/research/offices-history.md.
import boardJson from "../../data/board.json" with { type: "json" };
import { DATA } from "./data.ts";
import { pronoun } from "./pronouns.ts";
import { nextRandom, pick } from "./rng.ts";
import {
  PLAYER, alive, capital, isPlayerTyranny, leaderOf, nameOf, officesOf, others, plotOf, power,
} from "./state.ts";
import { boardHooks, event, grudge, log, makeRival, mood, opinion, powerChange, setOffice, silver, grain, factionOf } from "./ops.ts";
import { on } from "./switches.ts";
import { fireBoard } from "./events.ts";
import { away } from "./commission.ts";
import { setSide } from "./island.ts";
import type { FactionId, GameState, Mod, OfficeId, Person } from "./types.ts";
import { FACTIONS } from "./types.ts";

const VOTERS: FactionId[] = ["citizens", "rich", "family"];
export type SeatId = OfficeId | "captain";
export const SEATS: SeatId[] = ["assembly", "generalship", "fleet", "treasury", "mint", "captain", "citadel"];
export interface SeatDef { id: SeatId; name: string; title: string; tier: string; max: number; voted: "always" | "free" | "never"; changes: string; power: string; lines: Record<"friendly" | "neutral" | "hostile", string> }
export const BOARD = boardJson as unknown as {
  dug: string[]; knobs: Record<string, number>; seats: SeatDef[]; standing: { id: string; name: string; can: string; rise?: string }[];
  falls: string; hostileActions: string[];
};
export const seatDef = (id: string) => BOARD.seats.find((x) => x.id === id)!;
export const seatName = (id: string) => seatDef(id)?.name ?? id;
export const dugWord = (n: number) => BOARD.dug[Math.max(0, Math.min(3, n))];
export const standingName = (n: number) => BOARD.standing[Math.max(0, Math.min(4, n))].name;

export interface SeatState { holder: string | null; dug: number; since: number; did?: string; att?: Attitude }
export interface BoardState {
  captain: string | null;
  seats: Record<string, SeatState>;
  commands: Record<string, string>; // city id -> person id
  standing: Record<string, { level: number; since: number; low: number }>;
  friends: Record<string, number>; // person -> last season he uses his seat as you wish
  backed: Record<string, string>; // seat -> the man you backed at its next vote
  losses: { seat: string; to: string; season: number }[];
  terms: { seat: string; to: string; season: number }[];
  hits: Record<string, number>; // how many times each man has answered your blows
  refused: Record<string, number>;
  asked: Record<string, number>;
  moved: Record<string, number>;
  lastMood: Record<string, number>;
  battlesLost: number;
  gains: Record<string, number>; // influence a man has drawn from his seat, kept small
  matters: number; mattersSeason: number;
}
type Attitude = "friendly" | "neutral" | "hostile";

export const boardOn = (s: GameState) => on(s, "contestedBoard");
const K = BOARD.knobs;
const P = (s: GameState, id: string | null | undefined): Person | undefined => (id && id !== PLAYER ? s.people[id] : undefined);

export function initBoard(s: GameState) {
  const seats: Record<string, SeatState> = {};
  const captain = s.people.aristotle ? "aristotle" : null; // Aristotle, "their commander" (Diodorus 14.78.1)
  for (const id of SEATS) {
    const holder = id === "captain" ? captain : s.offices[id as OfficeId];
    seats[id] = { holder, dug: holder ? 1 : 0, since: 0 };
  }
  s.board = { captain, seats, commands: {}, standing: {}, friends: {}, backed: {}, losses: [], terms: [], hits: {}, refused: {}, asked: {}, moved: {}, lastMood: {}, battlesLost: 0, gains: {}, matters: 0, mattersSeason: -1 };
  for (const f of FACTIONS) s.board.lastMood[f] = s.factions[f].mood;
  for (const p of others(s)) if (alive(p) || p.status === "absent") s.board.standing[p.id] = { level: startLevel(s, p), since: 0, low: 0 };
}

export const seatHolder = (s: GameState, id: string): string | null => (id === "captain" ? s.board?.captain ?? null : s.offices[id as OfficeId]);
export function seatsOf(s: GameState, pid: string): SeatId[] {
  return SEATS.filter((x) => seatHolder(s, x) === pid && (x !== "citadel" || s.citadelBuilt));
}

// ---------- Seats change hands ----------

function onSeat(s: GameState, seat: string, before: string | null, after: string | null) {
  const b = s.board;
  if (!b) return;
  const st = b.seats[seat];
  const dug = st?.dug ?? 0;
  b.seats[seat] = { holder: after, dug: 0, since: s.season };
  if (before === PLAYER && after && after !== PLAYER && s.step !== "player") b.losses.push({ seat, to: after, season: s.season });
  if (before && before !== PLAYER && after && after !== PLAYER) b.terms.push({ seat, to: after, season: s.season });
  if (before && before !== PLAYER && after === PLAYER && s.step === "player" && dug >= 2) {
    const f = factionOf(s, before);
    if (f) mood(s, f, -1, `${nameOf(s, before)} was ${dugWord(dug).toLowerCase()} in ${seatName(seat)}, and his friends lose their places with him`);
  }
}
boardHooks.onSeat = onSeat;

export function setCaptain(s: GameState, to: string | null, why: string) {
  const b = s.board!;
  const before = b.captain;
  if (before === to) return;
  b.captain = to;
  log(s, { actor: to ?? "guard", text: to ? `${capital(nameOf(s, to))} ${to === PLAYER ? "command" : "commands"} the guard.` : "The guard has no captain.", why, visible: true, kind: "change" });
  onSeat(s, "captain", before, to);
}
export function setSeat(s: GameState, seat: string, to: string | null, why: string) {
  if (seat === "captain") setCaptain(s, to, why);
  else if (seat !== "citadel" || s.citadelBuilt) setOffice(s, seat as OfficeId, to, why);
}
function dig(s: GameState, seat: string, d: number, why: string) {
  const st = s.board!.seats[seat];
  const h = seatHolder(s, seat);
  if (!st || !h) return;
  const n = Math.max(0, Math.min(seatDef(seat).max, st.dug + d));
  if (n === st.dug) return;
  st.dug = n;
  log(s, { actor: h, text: `${capital(nameOf(s, h))}'s hold on ${seatName(seat)}: ${dugWord(n)}.`, why, visible: true, kind: "change" });
}

// Is he using his seat for you, against you, or for his own?
export function attitude(s: GameState, pid: string): Attitude {
  const p = s.people[pid];
  const b = s.board!;
  if ((b.friends[pid] ?? -1) >= s.season || p.bound && p.opinion >= 0) return "friendly";
  if (p.rival || (p.political?.rank ?? 0) >= 2 || p.opinion <= K.hostileOpinion) return "hostile";
  return p.opinion >= 1 ? "friendly" : "neutral";
}

// ---------- The vote ----------

export interface Stand { id: string; score: number; parts: Mod[] }
function standScore(s: GameState, pid: string, seat: string, holder: boolean): Stand {
  const parts: Mod[] = [];
  const b = s.board!;
  if (pid === PLAYER) {
    const n = Math.min(2, seatsOf(s, PLAYER).length);
    if (n) parts.push({ label: "your seats", value: n });
    // The guard are hired foreigners: they have no vote in the assembly (invention, on the citizen assembly of 13.92).
    const f = VOTERS.filter((x) => s.factions[x].mood >= 2).sort((a, b) => s.factions[b].mood - s.factions[a].mood || power(s, b) - power(s, a))[0];
    if (f && Math.floor(power(s, f) / 2)) parts.push({ label: `${s.factions[f].short} behind you`, value: Math.floor(power(s, f) / 2) });
    if (s.factions.citizens.mood >= 3) parts.push({ label: "the citizens are content with you", value: 1 });
    if (s.factions.citizens.mood <= 1) parts.push({ label: "the citizens are angry with you", value: -1 });
  } else {
    const p = s.people[pid];
    const n = Math.min(2, seatsOf(s, pid).length);
    if (n) parts.push({ label: "his seats", value: n });
    const fol = Math.max(0, Math.min(3, p.infl));
    if (fol) parts.push({ label: "his following", value: fol });
    const f = factionOf(s, pid);
    if (f && f !== "guard" && Math.floor(power(s, f) / 2)) parts.push({ label: `${s.factions[f].short} behind him`, value: Math.floor(power(s, f) / 2) });
    if (b.backed[seat] === pid) parts.push({ label: "you back him", value: K.backedBonus });
  }
  if (holder && b.seats[seat]?.dug) parts.push({ label: dugWord(b.seats[seat].dug).toLowerCase(), value: b.seats[seat].dug });
  return { id: pid, score: parts.reduce((a, m) => a + m.value, 0), parts };
}
export function votedNow(s: GameState, seat: string): boolean {
  const v = seatDef(seat).voted;
  return v === "always" || (v === "free" && !isPlayerTyranny(s));
}
// Who would win the seat if the assembly voted now: shown on the seat card before the day.
export function race(s: GameState, seat: string): { holder?: Stand; challenger?: Stand } | null {
  if (!s.board || !votedNow(s, seat)) return null;
  const h = seatHolder(s, seat);
  const holder = h && (h === PLAYER || s.people[h]?.status === "free") ? standScore(s, h, seat, true) : undefined;
  const cands = others(s).filter((p) => p.status === "free" && p.id !== h && p.faction !== "guard" && seatsOf(s, p.id).length < 2 && ((standingOf(s, p.id) >= 2) || (standingOf(s, p.id) >= 1 && p.wants === seat)));
  const stands = cands.map((p) => standScore(s, p.id, seat, false));
  if (h !== PLAYER) stands.push(standScore(s, PLAYER, seat, false));
  stands.sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : 1));
  return { holder, challenger: stands[0] };
}
function vote(s: GameState, seat: string, why: string) {
  const r = race(s, seat);
  if (!r?.challenger) return;
  const { holder, challenger } = r;
  const line = (x: Stand) => `${capital(nameOf(s, x.id))} ${x.score}`;
  const wins = !holder || challenger.score > holder.score;
  const parts = [holder, challenger].filter(Boolean).map((x) => `${capital(nameOf(s, x!.id))}: ${x!.parts.map((m) => `${m.label} ${m.value >= 0 ? "+" : ""}${m.value}`).join(", ") || "nothing"}`).join("; ");
  const winner = wins ? challenger.id : holder!.id;
  event(s, winner, `The assembly votes on ${seatName(seat)}: ${[holder, challenger].filter(Boolean).map((x) => line(x!)).join(", ")}. ${capital(nameOf(s, winner))} ${wins ? (winner === PLAYER ? "win it" : "wins it") : (winner === PLAYER ? "keep it" : "keeps it")}.`, `${why}. ${parts}`);
  delete s.board!.backed[seat];
  s.counters.boardVotes = (s.counters.boardVotes ?? 0) + 1;
  if (wins) { s.counters.boardVotesLost = (s.counters.boardVotesLost ?? 0) + (holder ? 1 : 0); setSeat(s, seat, challenger.id, "the assembly voted"); }
}

// ---------- The ladder of standing ----------

const isReal = (p: Person) => DATA.people.find((x) => x.id === p.id)?.kind === "history";
function startLevel(s: GameState, p: Person) { return Math.max(isReal(p) ? 1 : 0, rawLevel(s, p)); }
export const standingOf = (s: GameState, pid: string) => s.board?.standing[pid]?.level ?? 0;
function rawLevel(s: GameState, p: Person): number {
  if (!alive(p) && p.status !== "absent") return 0;
  const pol = p.political?.rank ?? 0;
  if (pol >= 3) return 4;
  const seats = seatsOf(s, p.id).length + Object.values(s.board?.commands ?? {}).filter((x) => x === p.id).length;
  const f = factionOf(s, p.id);
  const lead = !!f && leaderOf(s, f)?.id === p.id;
  const fol = p.infl >= 2;
  const rk = p.rival?.rank ?? 0;
  if (pol >= 2 || rk >= 3 || (rk >= 2 && (seats || lead))) return 3;
  if ([seats > 0, lead, fol].filter(Boolean).length >= 2) return 2;
  if (seats || lead || fol || rk || pol || p.owedFavor || p.feud) return 1;
  return 0;
}
// What he still lacks for the next step, in words.
export function nextStep(s: GameState, pid: string): string {
  const lv = standingOf(s, pid);
  const p = s.people[pid];
  if (lv >= 4) return "He can take your place.";
  if (lv === 3) return "A second faction angry with you would make him a pretender.";
  if (lv === 2) return "One faction behind him and a wish for your place would make him your rival.";
  if (lv === 1) {
    const has = [seatsOf(s, pid).length > 0 ? "a seat" : "", leaderOf(s, factionOf(s, pid) as FactionId)?.id === pid ? "a faction to lead" : "", p.infl >= 2 ? "a following" : ""].filter(Boolean);
    return `He has ${has.length ? has.join(" and ") : "a name"}; two of a seat, a faction to lead and a following make him a player.`;
  }
  return "";
}
const RISE_EVENT: Record<number, (p: Person) => string> = {
  2: (p) => (["rich", "family"].includes(p.faction) ? "boardRisePlayerHouse" : "boardRisePlayer"),
  3: () => "boardRiseRival",
  4: () => "boardRisePretender",
};
function ladder(s: GameState) {
  const b = s.board!;
  for (const p of others(s)) {
    if (p.status === "absent") continue;
    const st = (b.standing[p.id] ??= { level: 0, since: s.season, low: 0 });
    const raw = alive(p) ? Math.max(isReal(p) ? 1 : 0, rawLevel(s, p)) : 0;
    if (raw > st.level) {
      st.level += 1; st.since = s.season; st.low = 0;
      s.counters.boardRises = (s.counters.boardRises ?? 0) + 1;
      const ev = RISE_EVENT[st.level]?.(p);
      if (ev && p.status === "free" && room(s) && fireBoard(s, ev, { riser: p.id }, {})) used(s);
      else if (st.level === 1) event(s, p.id, BOARD.standing[1].rise!.replace("{Riser}", capital(p.name)), "he has a name in the city now");
      else event(s, p.id, `${capital(p.name)} is ${standingName(st.level).toLowerCase()} in the city now.`, "his standing rose");
    } else if (raw < st.level) {
      if (++st.low >= 2 || !alive(p)) {
        const was = standingName(st.level).toLowerCase();
        st.level -= 1; st.since = s.season; st.low = 0;
        if (alive(p) && st.level >= 1) event(s, p.id, BOARD.falls.replace("{Faller}", capital(p.name)).replace("{standing}", was), "his standing fell");
      }
    } else st.low = 0;
  }
}

// ---------- Matters ----------

function room(s: GameState) {
  const b = s.board!;
  if (b.mattersSeason !== s.season) { b.mattersSeason = s.season; b.matters = 0; }
  return b.matters < K.maxBoardMatters;
}
const used = (s: GameState) => { s.board!.matters += 1; s.counters.boardMatters = (s.counters.boardMatters ?? 0) + 1; };
const LOST_EVENT: Record<string, string> = { assembly: "boardLostVoted", generalship: "boardLostVoted", fleet: "boardLostVoted", treasury: "boardLostGranted", mint: "boardLostGranted", captain: "boardLostHard", citadel: "boardLostHard" };
const MEASURE: Record<string, string> = { citizens: "boardMeasureGrain", rich: "boardMeasureAudit", guard: "boardMeasurePay", family: "boardMeasureHonour" };

function crises(s: GameState) {
  const b = s.board!;
  const seen = new Set<string>();
  for (const l of b.losses.splice(0).reverse()) {
    if (seen.has(l.seat)) continue;
    seen.add(l.seat);
    if (seatHolder(s, l.seat) !== l.to || s.people[l.to]?.status !== "free") continue;
    s.counters.boardCrises = (s.counters.boardCrises ?? 0) + 1;
    room(s); // starts this season's count
    if (fireBoard(s, LOST_EVENT[l.seat], { taker: l.to }, { seat: l.seat })) used(s); // the crisis always comes, and counts toward the cap
  }
}
function measure(s: GameState, pid: string): boolean {
  const ev = MEASURE[s.people[pid].faction];
  if (!ev || !room(s) || !fireBoard(s, ev, { speaker: pid }, {})) return false;
  used(s);
  return true;
}
function otherMatters(s: GameState) {
  const b = s.board!;
  // A new holder's terms.
  for (const t of b.terms.splice(0)) {
    if (seatHolder(s, t.seat) !== t.to || s.people[t.to]?.status !== "free" || attitude(s, t.to) === "friendly") continue;
    if (room(s) && fireBoard(s, "boardTerms", { holder: t.to }, { seat: t.seat })) used(s);
  }
  // A faction turned Rebellious brings a demand.
  for (const f of FACTIONS) {
    const was = b.lastMood[f];
    b.lastMood[f] = s.factions[f].mood;
    if (!(s.factions[f].mood === 0 && was > 0) || s.season - (s.flags[`boardDemand_${f}`] ?? -99) < 8) continue;
    s.flags[`boardDemand_${f}`] = s.season;
    const lead = leaderOf(s, f);
    if (lead?.status === "free" && room(s) && fireBoard(s, "boardDemand", { leader: lead.id }, { faction: f })) used(s);
  }
  // One move a year by each man at Rival or above.
  for (const p of others(s)) {
    if (p.status !== "free" || standingOf(s, p.id) < 3) continue;
    if ((b.moved[p.id] ?? -99) > s.season - 4 || (hash(p.id) + s.season) % 4 !== 0) continue;
    if (measure(s, p.id)) { b.moved[p.id] = s.season; s.counters.boardInitiative = (s.counters.boardInitiative ?? 0) + 1; break; }
  }
  // A man you keep hitting answers.
  const hits: Record<string, number> = {};
  for (const i of s.inputs) if (i.t === "act" && i.args.target && BOARD.hostileActions.includes(i.action)) hits[i.args.target] = (hits[i.args.target] ?? 0) + 1;
  for (const [pid, n] of Object.entries(hits)) {
    const p = s.people[pid];
    if (!p || p.status !== "free" || n < K.hitsToAnswer * ((b.hits[pid] ?? 0) + 1) || !room(s)) continue;
    b.hits[pid] = (b.hits[pid] ?? 0) + 1;
    const ally = others(s).filter((q) => q.id !== pid && q.status === "free" && q.opinion <= 0 && (standingOf(s, q.id) >= 2 || q.rival || q.political))
      .sort((x, y) => standingOf(s, y.id) - standingOf(s, x.id) || (x.id < y.id ? -1 : 1))[0];
    if (ally ? fireBoard(s, "boardAnswerAlly", { victim: pid, ally: ally.id }, {}) : fireBoard(s, "boardAnswerAlone", { victim: pid }, {})) { used(s); s.counters.boardAnswers = (s.counters.boardAnswers ?? 0) + 1; }
  }
  draftPetitions(s);
  // Petitions to use your powers.
  if (!room(s) || nextRandom(s) >= K.petitionChance) return;
  const mine = (["fleet", "mint", "generalship", "treasury", "captain", "citadel"] as const).filter((x) => seatHolder(s, x) === PLAYER && (x !== "citadel" || s.citadelBuilt));
  const askers = others(s).filter((p) => p.status === "free" && standingOf(s, p.id) >= 1 && p.opinion >= -1 && !p.rival && (b.asked[p.id] ?? -99) <= s.season - K.petitionWait);
  if (!mine.length || !askers.length) return;
  const seat = pick(s, [...mine]);
  const asker = pick(s, askers);
  if (fireBoard(s, `boardAsk${capital(seat)}`, { asker: asker.id }, { seat })) { b.asked[asker.id] = s.season; used(s); s.counters.boardPetitions = (s.counters.boardPetitions ?? 0) + 1; }
}
// Six petitions from Jacob's draft (docs/drafts/petitions-draft.md, numbers 1, 3, 6, 7, 9 and 15): the board decides
// who is cast and when; the words and choices are data. Each waits 8 seasons before it can come again.
function draftPetitions(s: GameState) {
  const b = s.board!;
  const freeP = (id: string | null | undefined) => (id && id !== PLAYER && s.people[id]?.status === "free" ? id : undefined);
  const tryFire = (id: string, roles: Record<string, string>, extra: Record<string, string> = {}) => {
    if (!room(s) || s.season - (s.flags[`board_${id}`] ?? -99) < 8) return;
    if (fireBoard(s, id, roles, extra)) { s.flags[`board_${id}`] = s.season; used(s); s.counters.boardDraftPetitions = (s.counters.boardDraftPetitions ?? 0) + 1; }
  };
  const gen = freeP(s.offices.generalship);
  if (gen && s.island?.war && s.island.cities.motya?.side === "carthage") tryFire("boardPetMotya", { general: gen });
  if (gen && s.flags.boardBattleLost === s.season) {
    const sp = freeP(s.offices.assembly) !== gen ? freeP(s.offices.assembly) : undefined;
    const speaker = sp ?? (leaderOf(s, "citizens")?.id !== gen ? freeP(leaderOf(s, "citizens")?.id) : undefined);
    if (speaker) tryFire("boardPetTrial", { speaker, general: gen });
  }
  const adm = s.offices.fleet;
  if (adm && adm !== PLAYER && (s.people[adm]?.where === "field" || s.people[adm]?.status === "outside")) {
    const asker = others(s).find((p) => p.status === "free" && p.id !== adm && (p.wants === "fleet" || p.political?.type === "Climber"));
    if (asker) tryFire("boardPetAdmiral", { asker: asker.id, admiral: adm });
  }
  const cap = freeP(b.captain);
  const tre = freeP(s.offices.treasury);
  if (cap && tre && tre !== cap && s.people[tre].faction !== "guard" && s.guard.arrearsSeasons >= 1) tryFire("boardPetGuardPay", { captain: cap, treasurer: tre });
  if (cap && s.citadelBuilt && s.offices.treasury === PLAYER && s.guard.arrearsSeasons >= 1 && s.silver < s.guard.owed) tryFire("boardPetHouses", { captain: cap }, { seat: "captain" });
  for (const [city, pid] of Object.entries(b.commands)) {
    if (freeP(pid) && s.island?.armies.some((a) => a.side === "carthage" && (a.at === city || a.siege === city))) { tryFire("boardPetWalls", { commander: pid }); break; }
  }
}
const hash = (id: string) => [...id].reduce((a, c) => a + c.charCodeAt(0), 0);

// ---------- Each season ----------

const line = (st: SeatState, att: Attitude, text?: string) => { st.att = att; st.did = text; };
function powers(s: GameState) {
  const b = s.board!;
  const q = s.season % 4;
  for (const seat of SEATS) {
    const st = b.seats[seat];
    const h = seatHolder(s, seat);
    const p = P(s, h);
    if (!p || p.status !== "free" || (seat === "citadel" && !s.citadelBuilt)) { st.did = undefined; st.att = undefined; continue; }
    const att = attitude(s, p.id);
    const say = seatDef(seat).lines[att];
    const f = factionOf(s, p.id);
    const why = `${p.name} holds ${seatName(seat)}${att === "friendly" ? " and uses it for you" : att === "hostile" ? " and is no friend of yours" : " and uses it for his own"}`;
    const gain = (why2: string) => { if ((b.gains[p.id] ?? 0) >= 3) return; b.gains[p.id] = (b.gains[p.id] ?? 0) + 1; p.infl += 1; event(s, p.id, `${capital(p.name)} ${say}. His following grows.`, why2); };
    line(st, att, say);
    if (seat === "treasury" && att === "hostile" && s.silver > 0) { silver(s, -1, `${p.name} pays his own people first`); if (q === 0 && f && s.factions[f].mood < 3) mood(s, f, 1, `${p.name} pays his own from the treasury`); }
    else if (seat === "mint" && q === 0) {
      if (att === "friendly") silver(s, 1, `${p.name} strikes coin for you`);
      else if (att === "neutral" && f) powerChange(s, f, 1, `${p.name} strikes coin for his own faction`);
      else if (att === "hostile") { silver(s, -1, `${p.name} debases the coin, and prices rise`); mood(s, "citizens", -1, `${p.name} debased the coin, and bread costs more`); }
    } else if (seat === "fleet" && q === 1) {
      if (att === "neutral" && f && s.factions[f].mood < 3) mood(s, f, 1, `${p.name} carries his friends' trade in your ships`);
      else if (att === "hostile") grain(s, -1, `${p.name} keeps the grain ships in harbour`);
    } else if (seat === "generalship") {
      if (att === "hostile" && (q === 0 || s.island?.war)) gain(why);
      else if (att === "neutral" && q === 0) gain(why);
    } else if (seat === "assembly" && q === 2) {
      if (att === "friendly") mood(s, "citizens", 1, `${p.name} puts up an honour for you in the assembly`);
      else if (!measure(s, p.id)) st.did = undefined;
    } else if (seat === "citadel" && att === "hostile" && q === 0) {
      s.blockedSlots += 1;
      event(s, p.id, `${capital(p.name)} shuts the Island's gates on you for a day. You lose an action this season.`, why);
    }
  }
}
function commands(s: GameState) {
  const b = s.board!;
  if (!s.island) return;
  for (const [city, pid] of Object.entries(b.commands)) {
    const p = s.people[pid];
    const c = s.island.cities[city];
    if (!p || p.status !== "free" || !c || !["syracuse", "ally"].includes(c.side)) { delete b.commands[city]; continue; }
    const att = attitude(s, pid);
    const near = s.island.armies.some((a) => a.side === "carthage" && (a.at === city || a.siege === city));
    if (att === "hostile" && near) {
      delete b.commands[city];
      s.counters.boardBetrayals = (s.counters.boardBetrayals ?? 0) + 1;
      event(s, pid, `${capital(p.name)}, who held ${DATA.places.find((x) => x.id === city)?.name ?? city} for you, opens its gates to Carthage.`, `he commanded the city and was no friend of yours, and Carthage's army was at the gates (as Arcesilaus did at Catana, Diodorus 14.15.1)`);
      setSide(s, city, "carthage", `${p.name} betrayed it`);
      makeRival(s, pid, "Exiled", "he betrayed a city you gave him");
    }
  }
}
function syncCaptain(s: GameState) {
  const b = s.board!;
  const c = b.captain;
  if (c && c !== PLAYER && s.people[c]?.status !== "free") {
    const payer = s.offices.treasury;
    const to = payer === PLAYER || !payer || s.people[payer]?.status !== "free" ? PLAYER : (leaderOf(s, "guard")?.status === "free" ? leaderOf(s, "guard")!.id : payer);
    setCaptain(s, to, `${s.people[c].name} can no longer command it, and whoever pays the guard names the next`);
    if (s.people[c]?.status === "held") mood(s, "guard", -1, "their captain was arrested, and they ask for their pay with some sharpness");
  }
  // Mutiny: two seasons unpaid, and the guard picks its own captain.
  if (s.guard.arrearsSeasons === 2 && (c === PLAYER || (c && attitude(s, c) === "friendly"))) {
    const lead = others(s).filter((p) => p.faction === "guard" && p.status === "free" && p.id !== c).sort((x, y) => x.opinion - y.opinion || (x.id < y.id ? -1 : 1))[0];
    if (lead) { s.counters.boardMutinies = (s.counters.boardMutinies ?? 0) + 1; setCaptain(s, lead.id, "the guard went unpaid two seasons and chose its own captain"); }
  }
}
function falls(s: GameState) {
  const b = s.board!;
  for (const seat of SEATS) {
    const h = seatHolder(s, seat);
    const st = b.seats[seat];
    if (!h || !st) continue;
    if (st.holder !== h) { b.seats[seat] = { holder: h, dug: 0, since: s.season }; continue; } // changed hands without the hook
    const gone = h === PLAYER ? away(s) : s.people[h].status === "outside" || s.people[h].where === "field";
    if (gone && st.dug > 0) dig(s, seat, -1, `${nameOf(s, h)} ${h === PLAYER ? "are" : "is"} away from the city, and others take his place in it`);
  }
  const lost = s.counters.battlesLost ?? 0;
  if (lost > b.battlesLost) {
    b.battlesLost = lost;
    s.flags.boardBattleLost = s.season;
    dig(s, "generalship", -1, "the army was beaten in the field");
    if (votedNow(s, "generalship")) vote(s, "generalship", "the army was beaten, and the assembly dismisses and elects (Diodorus 13.92.1)");
  }
  if (s.season % 4 !== 0) return;
  for (const seat of SEATS) {
    const h = seatHolder(s, seat);
    const st = b.seats[seat];
    if (!h || (seat === "citadel" && !s.citadelBuilt)) continue;
    if (s.season - st.since >= 3 && st.dug < seatDef(seat).max) dig(s, seat, 1, "another year held without a loss");
    if (st.dug >= 2) {
      const pays = h === PLAYER ? s.silver >= K.upkeep : (factionOf(s, h) ? power(s, factionOf(s, h)!) >= 5 : false);
      if (h === PLAYER && pays) silver(s, -K.upkeep, `upkeep for your hold on ${seatName(seat)}: gifts to the men you placed there`);
      if (!pays) dig(s, seat, -1, h === PLAYER ? "you could not pay the men who keep it for you" : "his friends cannot keep paying for it");
    }
  }
}

// Called once a season, after the factions and Carthage act and before your turn.
export function boardSeason(s: GameState) {
  if (!s.board) return;
  syncCaptain(s);
  falls(s);
  if (s.over) return;
  if (s.season % 4 === 2) for (const seat of SEATS) if (votedNow(s, seat) && seat !== "citadel") vote(s, seat, seat === "assembly" ? "the assembly meets in spring" : "the yearly vote of a free city (the yearly term is invention)");
  crises(s);
  powers(s);
  commands(s);
  ladder(s);
  otherMatters(s);
}

// ---------- Effects in board matters ----------

export function applyBoardEffect(s: GameState, roles: Record<string, string>, e: any, why: string): boolean {
  if (!s.board) return e.seat !== undefined || e.dig !== undefined || e.friend !== undefined || e.factionMood !== undefined || e.factionPower !== undefined || e.refused !== undefined;
  const pid = (r: string) => (r === "you" ? PLAYER : roles[r]);
  if (e.seat !== undefined) { const seat = e.seat === "$seat" ? roles.seat : e.seat; const to = e.to === "you" ? PLAYER : pid(e.to); if (seat && to) setSeat(s, seat, to, why); return true; }
  if (e.dig !== undefined) { if (roles.seat) dig(s, roles.seat, e.by, why); return true; }
  if (e.friend !== undefined) { const p = pid(e.friend); if (p) s.board.friends[p] = s.season + (e.seasons ?? 4) - 1; return true; }
  if (e.factionMood !== undefined) { const f = factionOf(s, pid(e.factionMood) ?? ""); if (f) mood(s, f, e.by, why); return true; }
  if (e.factionPower !== undefined) { const f = factionOf(s, pid(e.factionPower) ?? ""); if (f) powerChange(s, f, e.by, why); return true; }
  if (e.refused !== undefined) {
    const p = pid(e.refused);
    if (!p) return true;
    const n = (s.board.refused[p] = (s.board.refused[p] ?? 0) + 1);
    opinion(s, p, -1, "you refused him");
    if (n >= 2) { s.board.refused[p] = 0; grudge(s, p, "you refused him twice"); makeRival(s, p, "Humiliated", "you refused him twice"); }
    return true;
  }
  return false;
}
export function describeBoardEffect(s: GameState, roles: Record<string, string>, e: any): string | null {
  const who = (r: string) => (r === "you" ? "you" : capital(nameOf(s, roles[r] ?? r)));
  if (e.seat !== undefined) return `You take back ${seatName(e.seat === "$seat" ? roles.seat : e.seat)}`;
  if (e.dig !== undefined) return `${who(e.dig)}'s hold on ${seatName(roles.seat)} ${e.by > 0 ? "firms" : "loosens"}`;
  if (e.friend !== undefined) return `${who(e.friend)} uses his seat as you wish for a year`;
  if (e.factionMood !== undefined) { const f = factionOf(s, roles[e.factionMood] ?? ""); return f ? `${capital(s.factions[f].short)}: mood ${e.by > 0 ? "+" : ""}${e.by}` : ""; }
  if (e.factionPower !== undefined) { const f = factionOf(s, roles[e.factionPower] ?? ""); return f ? `${capital(s.factions[f].short)}: power ${e.by > 0 ? "+" : ""}${e.by}` : ""; }
  if (e.refused !== undefined) { const p = roles[e.refused]; return (s.board?.refused[p] ?? 0) >= 1 ? `${who(e.refused)} remembers you refused him before: a grudge, and a rival` : `${who(e.refused)}: opinion of you -1, and he remembers`; }
  return null;
}
export function scoreBoardEffect(s: GameState, roles: Record<string, string>, e: any): number {
  if (e.seat !== undefined) return 4;
  if (e.dig !== undefined) return -0.5 * e.by;
  if (e.friend !== undefined) return 2;
  if (e.factionMood !== undefined) return 1.2 * e.by;
  if (e.factionPower !== undefined) return -0.3 * e.by;
  if (e.refused !== undefined) return (s.board?.refused[roles[e.refused]] ?? 0) >= 1 ? -3 : -0.6;
  return 0;
}

// ---------- Actions ----------
export const seatHolders = (s: GameState) => others(s).filter((p) => p.status === "free" && seatsOf(s, p.id).length > 0);
export { plotOf };

// ---------- Your actions on the board (data/actions.json, switch "contestedBoard") ----------
type Opt = { value: string; label: string };
interface BImpl { target?: (s: GameState) => Opt[]; second?: (s: GameState, a: any) => Opt[]; secondLabel?: string; check?: (s: GameState, a: any) => string | null; odds?: (s: GameState, a: any) => Mod[] | null; need?: number; run: (s: GameState, a: any, ok: boolean, die: number) => void }
const opt = (s: GameState, ps: Person[]): Opt[] => ps.map((p) => ({ value: p.id, label: capital(p.name) }));
const free = (s: GameState) => others(s).filter((p) => p.status === "free");
const yourCities = (s: GameState) => Object.values(s.island?.cities ?? {}).filter((c) => c.id !== "syracuse" && ["syracuse", "ally"].includes(c.side));
const placeName = (id: string) => DATA.places.find((x) => x.id === id)?.name ?? capital(id);
export const BOARD_IMPL: Record<string, BImpl> = {
  askHolder: {
    target: (s) => opt(s, seatHolders(s)),
    check: (s, a) => (a.target && s.people[a.target].owedFavor ? "you already owe him a favour" : a.target && attitude(s, a.target) === "friendly" ? "he already uses his seat for you" : null),
    odds: (s, a) => {
      const p = s.people[a.target];
      const m: Mod[] = [];
      if (p.opinion) m.push({ label: "his opinion of you", value: Math.max(-2, Math.min(2, p.opinion)) });
      const d = Math.max(0, ...seatsOf(s, p.id).map((x) => s.board!.seats[x].dug));
      if (d >= 2) m.push({ label: "he is dug in and needs you less", value: -1 });
      if (p.traits.includes("greedy")) m.push({ label: "Greedy", value: 1 });
      return m;
    },
    run: (s, a, ok) => {
      const p = s.people[a.target];
      if (!ok) { opinion(s, p.id, -1, "you asked a favour and he would not give it"); event(s, PLAYER, `${capital(p.name)} hears you out, and does nothing.`, "Ask a favour of a holder"); return; }
      s.board!.friends[p.id] = s.season + 3;
      p.owedFavor = true;
      event(s, PLAYER, `${capital(p.name)} agrees: for a year ${pronoun(s, p.id, "he")} will use ${seatsOf(s, p.id).map(seatName).join(" and ")} as you wish. You owe ${pronoun(s, p.id, "him")} a favour.`, "Ask a favour of a holder");
    },
  },
  backCandidate: {
    target: (s) => opt(s, free(s).filter((p) => p.faction !== "guard" && standingOf(s, p.id) >= 1)),
    second: (s) => SEATS.filter((x) => x !== "citadel" && votedNow(s, x) && seatHolder(s, x) !== PLAYER).map((x) => ({ value: x, label: capital(seatName(x)) })),
    secondLabel: "Seat",
    check: (s) => (s.silver < 1 ? "needs 1 silver" : null),
    run: (s, a) => {
      silver(s, -1, `gifts for the men who will vote for ${nameOf(s, a.target)}`);
      s.board!.backed[a.second] = a.target;
      opinion(s, a.target, 1, `you back him for ${seatName(a.second)}`);
      event(s, PLAYER, `You let it be known that you back ${nameOf(s, a.target)} for ${seatName(a.second)} at the spring vote.`, "Back a man at the vote");
    },
  },
  appointCaptain: {
    target: (s) => opt(s, free(s).filter((p) => ["guard", "family"].includes(p.faction) && p.id !== s.board?.captain)),
    check: (s) => (s.board?.captain !== PLAYER && s.offices.treasury !== PLAYER ? "only whoever pays the guard (the treasury) names its captain, and the post must be yours to give" : s.board?.captain && s.board.captain !== PLAYER ? "the guard has a captain: only his arrest frees the post" : null),
    run: (s, a) => {
      setCaptain(s, a.target, "you appointed him");
      opinion(s, a.target, 2, "you made him captain of the guard");
      event(s, PLAYER, `You make ${nameOf(s, a.target)} captain of the guard.`, "Appoint the captain of the guard");
    },
  },
  giveCommand: {
    target: (s) => opt(s, free(s)),
    second: (s) => yourCities(s).map((c) => ({ value: c.id, label: `${placeName(c.id)}${s.board?.commands[c.id] ? ` (now ${nameOf(s, s.board.commands[c.id])})` : ""}` })),
    secondLabel: "City",
    check: (s, a) => (!yourCities(s).length ? "you hold no city but Syracuse" : a.second && s.board?.commands[a.second] === a.target ? "he holds it already" : null),
    run: (s, a) => {
      const was = s.board!.commands[a.second];
      s.board!.commands[a.second] = a.target;
      opinion(s, a.target, 1, `you gave him the command of ${placeName(a.second)}`);
      if (was && was !== a.target) opinion(s, was, -2, `you gave the command of ${placeName(a.second)} to another`);
      event(s, PLAYER, `You give ${nameOf(s, a.target)} the command of ${placeName(a.second)}.`, "Give a city's command");
    },
  },
};
