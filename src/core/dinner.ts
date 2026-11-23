// Switch "dinners" (bet B5): a dinner is a scene where intrigue plays out.
// You choose who reclines on the couch beside yours (the couch of honour, a power object people want), who else comes,
// and how strong the wine is mixed. Each part of the evening (the meal, the libations, the drinking) may bring one moment
// from data/dinners.json, cast from the guests: friendships, quarrels, secrets that slip, a fight over the couch.
// Friendships and quarrels last. Plotters recruit their friends more easily and never the men they quarrelled with.
// Every change goes through ops.ts or the event effects, so it is logged with its reason. No rules live in the data's text.
import dinnersJson from "../../data/dinners.json" with { type: "json" };
import { nextRandom } from "./rng.ts";
import { PLAYER, alive, capital, nameOf, others, plotOf } from "./state.ts";
import { clearGrudge, event, grudge, opinion, silver } from "./ops.ts";
import { on } from "./switches.ts";
import { apply, fill, fireNow, fitsRole } from "./events.ts";
import type { Effect, RoleCond } from "./events.ts";
import { learn, secretsOn } from "./secrets.ts";
import type { Args, GameState, Mod, Person } from "./types.ts";

interface DinnerRole extends RoleCond { honour?: boolean; notHonour?: boolean; absent?: boolean; covets?: boolean; enemy?: boolean }
type PairTest = "sameFaction" | "otherFaction" | "kin" | "samePlot" | "bonded" | "notBonded" | "quarrelled" | "notQuarrelled" | "sameWant";
interface Moment {
  id: string; kind: string; course: number; tone: string; weight: number; name: string;
  roles: Record<string, DinnerRole>; pairs?: { a: string; b: string; is: PairTest[] }[];
  text: string; why: string; effects?: Effect[]; ask?: string; source?: string;
  peace?: boolean; // only while you are not at war with Carthage (Diodorus 15.6.1: the poems came in peacetime)
}
interface Wine { id: string; name: string; label: string; cost: number; text: string; tones: Record<string, number> }
export const DINNERS = dinnersJson as unknown as {
  knobs: Record<string, number>; courses: { id: string; n: number; name: string }[]; wines: Wine[]; moments: Moment[]; asks: { id: string }[];
};
const K = DINNERS.knobs;
export const wineById = (id: string | undefined) => DINNERS.wines.find((w) => w.id === id);

export interface Tie { a: string; b: string; season: number; why: string }
export interface DinnerRecord { season: number; honour: string; guests: string[]; wine: string; moments: string[]; from: number; to: number } // from, to: its log entries (n)
export interface DinnerState { honour?: string; honourSince?: number; bonds: Tie[]; quarrels: Tie[]; held: DinnerRecord[] }

export const dinnersOn = (s: GameState) => on(s, "dinners");
export function dinnerState(s: GameState): DinnerState {
  if (!s.dinners) s.dinners = { bonds: [], quarrels: [], held: [] };
  return s.dinners;
}

// ---------- Friendships and quarrels ----------

const tie = (list: Tie[], a: string, b: string) => list.find((t) => (t.a === a && t.b === b) || (t.a === b && t.b === a));
export const bonded = (s: GameState, a: string, b: string) => !!s.dinners && !!tie(s.dinners.bonds, a, b);
export const quarrelled = (s: GameState, a: string, b: string) => !!s.dinners && !!tie(s.dinners.quarrels, a, b);
const otherOf = (t: Tie, a: string) => (t.a === a ? t.b : t.a);
export const friendsOf = (s: GameState, a: string) => (s.dinners?.bonds ?? []).filter((t) => t.a === a || t.b === a).map((t) => otherOf(t, a));
export const foesOf = (s: GameState, a: string) => (s.dinners?.quarrels ?? []).filter((t) => t.a === a || t.b === a).map((t) => otherOf(t, a));
const drop = (list: Tie[], a: string, b: string) => { const t = tie(list, a, b); if (t) list.splice(list.indexOf(t), 1); return !!t; };
const count = (s: GameState, k: string) => { s.counters[k] = (s.counters[k] ?? 0) + 1; };

function bond(s: GameState, a: string, b: string, why: string) {
  const st = dinnerState(s);
  if (a === b || tie(st.bonds, a, b)) return;
  drop(st.quarrels, a, b);
  st.bonds.push({ a, b, season: s.season, why });
  count(s, "dinnerBonds");
  event(s, a, `${capital(nameOf(s, a))} and ${nameOf(s, b)} are friends now.`, why);
}
function quarrel(s: GameState, a: string, b: string, why: string) {
  const st = dinnerState(s);
  if (a === b || tie(st.quarrels, a, b)) return;
  drop(st.bonds, a, b);
  st.quarrels.push({ a, b, season: s.season, why });
  count(s, "dinnerQuarrels");
  event(s, a, `${capital(nameOf(s, a))} and ${nameOf(s, b)} are at odds now.`, why);
}
function mend(s: GameState, a: string, b: string, why: string) {
  if (!drop(dinnerState(s).quarrels, a, b)) return;
  count(s, "dinnerMends");
  event(s, a, `${capital(nameOf(s, a))} and ${nameOf(s, b)} have put their quarrel aside.`, why);
}

// ---------- The couch of honour ----------

export const couchHolder = (s: GameState) => s.dinners?.honour;
function setCouch(s: GameState, pid: string, why: string) {
  const st = dinnerState(s);
  if (st.honour === pid) return;
  const prev = st.honour;
  if (prev && s.people[prev]) s.people[prev].infl -= K.couchInfluence;
  st.honour = pid;
  st.honourSince = s.season;
  s.people[pid].infl += K.couchInfluence;
  count(s, "couchChanges");
  event(s, pid, `${capital(nameOf(s, pid))} now reclines on the couch beside yours at your dinners: it adds to ${nameOf(s, pid)}'s standing.`, why);
}

// The man who held the couch takes it badly when you give it to another. Proud men and political rivals hold a grudge.
function slight(s: GameState, prev: string, to: string) {
  const p = s.people[prev];
  if (!p || !alive(p) || p.status !== "free") return;
  count(s, "couchSlights");
  opinion(s, prev, -1, `you gave the couch beside yours to ${nameOf(s, to)}`);
  if (p.traits.includes("proud") || p.political || p.traits.includes("vengeful"))
    grudge(s, prev, `you gave the couch of honour to ${nameOf(s, to)}`);
}

// ---------- Who can come, and the plan of the table ----------

export const guestPool = (s: GameState) => others(s).filter((p) => alive(p) && p.status === "free");
export const parseGuests = (o: string | undefined) => (o ? o.split(",").map((x) => x.trim()).filter(Boolean) : []);

export function checkDinner(s: GameState, a: Args): string | null {
  const w = wineById(a.second);
  if (!w) return "choose the wine";
  if (s.silver < w.cost) return `needs ${w.cost} silver`;
  const gs = parseGuests(a.option);
  const pool = new Set(guestPool(s).map((p) => p.id));
  if (gs.some((g) => !pool.has(g) || g === a.target)) return "choose guests who are in the city";
  if (new Set(gs).size !== gs.length) return "each guest once";
  if (gs.length < K.minGuests) return `choose at least ${K.minGuests} other guests`;
  if (gs.length > K.maxGuests) return `at most ${K.maxGuests} other guests`;
  return null;
}

// A readable default table, for the bot and as the screen's first suggestion: honour the man who holds the couch if he
// still thinks well of you, else the most useful friend; invite the coldest men, so the wine can work on them.
export function suggestTable(s: GameState): Args | null {
  const pool = guestPool(s);
  if (pool.length < K.minGuests + 1) return null;
  const holder = couchHolder(s);
  const byStanding = [...pool].sort((x, y) => y.opinion - x.opinion || y.infl - x.infl || x.id.localeCompare(y.id));
  const honour = holder && pool.some((p) => p.id === holder) && s.people[holder].opinion >= 0 ? holder : byStanding[0].id;
  const rest = pool.filter((p) => p.id !== honour).sort((x, y) => x.opinion - y.opinion || y.grudges.length - x.grudges.length || x.id.localeCompare(y.id));
  const guests = rest.slice(0, Math.min(K.maxGuests - 1, rest.length)).map((p) => p.id);
  const danger = s.plots.some((pl) => pl.stage >= 2);
  const wine = danger && s.silver >= 3 ? "strong" : "mixed";
  return { target: honour, second: wine, option: guests.join(",") };
}

// ---------- Casting a moment from the table ----------

function fitsDinner(s: GameState, p: Person, r: DinnerRole, honour: string, table: string[]): boolean {
  if (r.absent ? table.includes(p.id) : !table.includes(p.id)) return false;
  if (r.honour && p.id !== honour) return false;
  if (r.notHonour && p.id === honour) return false;
  if (r.covets && !(p.political || p.traits.includes("ambitious") || p.ambition === "Office" || p.ambition === "Power")) return false;
  if (r.enemy && !(p.rival || p.political)) return false;
  return true;
}
function pairOk(s: GameState, a: Person, b: Person, is: PairTest[]): boolean {
  for (const t of is) {
    if (t === "sameFaction" && a.faction !== b.faction) return false;
    if (t === "otherFaction" && a.faction === b.faction) return false;
    if (t === "kin" && !(a.kin.includes(b.id) || b.kin.includes(a.id))) return false;
    if (t === "samePlot" && !(plotOf(s, a.id) && plotOf(s, a.id) === plotOf(s, b.id))) return false;
    if (t === "bonded" && !bonded(s, a.id, b.id)) return false;
    if (t === "notBonded" && bonded(s, a.id, b.id)) return false;
    if (t === "quarrelled" && !quarrelled(s, a.id, b.id)) return false;
    if (t === "notQuarrelled" && quarrelled(s, a.id, b.id)) return false;
    if (t === "sameWant" && !(a.wants && a.wants === b.wants)) return false;
  }
  return true;
}

// Every way to cast the moment from this table (at most a few dozen: five guests, two parts).
export function castsFor(s: GameState, m: Moment, honour: string, table: string[]): Record<string, string>[] {
  const roles = Object.entries(m.roles);
  const out: Record<string, string>[] = [];
  const go = (i: number, cast: Record<string, string>) => {
    if (i === roles.length) {
      for (const pr of m.pairs ?? []) if (!pairOk(s, s.people[cast[pr.a]], s.people[cast[pr.b]], pr.is)) return;
      out.push({ ...cast });
      return;
    }
    const [name, r] = roles[i];
    const cands = r.absent ? others(s).filter((p) => alive(p) && (p.status === "free" || p.status === "outside")) : table.map((id) => s.people[id]);
    const st = r.status ?? (r.absent ? ["free", "outside"] : undefined);
    for (const p of cands) {
      if (!fitsDinner(s, p, r, honour, table)) continue;
      if (!fitsRole(s, p, { ...r, status: st }, cast)) continue;
      go(i + 1, { ...cast, [name]: p.id });
    }
  };
  go(0, {});
  return out;
}

// ---------- Effects only a dinner has (the rest are the event effects in events.ts) ----------

export function applyDinnerEffect(s: GameState, roles: Record<string, string>, e: Effect, why: string): boolean {
  const pid = (r: string) => (r === "you" ? PLAYER : roles[r] ?? r);
  const live = (id: string | undefined) => !!id && !!s.people[id] && alive(s.people[id]);
  if (e.bond) { const [a, b] = e.bond.map(pid); if (live(a) && live(b)) bond(s, a, b, why); return true; }
  if (e.quarrel) { const [a, b] = e.quarrel.map(pid); if (live(a) && live(b)) quarrel(s, a, b, why); return true; }
  if (e.mend) { const [a, b] = e.mend.map(pid); if (live(a) && live(b)) mend(s, a, b, why); return true; }
  if (e.couch) { const a = pid(e.couch); if (live(a)) { const prev = couchHolder(s); if (prev && prev !== a) slight(s, prev, a); setCouch(s, a, why); } return true; }
  if (e.bondYou) { const a = pid(e.bondYou); if (live(a) && s.people[a].grudges.length) clearGrudge(s, a, why); return true; }
  if (e.heardBy) {
    // Another cold guest of his faction agrees with the grievance: they become friends in it.
    const a = pid(e.heardBy);
    const table = (s.dinners?.held.at(-1)?.guests ?? []).concat(s.dinners?.held.at(-1)?.honour ?? []);
    const b = table.find((id) => id !== a && live(id) && s.people[id].faction === s.people[a].faction && s.people[id].opinion <= 0 && !bonded(s, a, id));
    if (b) bond(s, a, b, `${nameOf(s, b)} agreed with ${nameOf(s, a)}'s grievance against you`);
    return true;
  }
  if (e.slip) {
    const b = pid(e.slip);
    if (!live(b)) return true;
    count(s, "dinnerSlips");
    if (secretsOn(s)) {
      const x = learn(s, PLAYER, b, why);
      if (!x) event(s, PLAYER, `The story about ${nameOf(s, b)} is one you knew already.`, why);
      return true;
    }
    s.people[b].knownUntil = Math.max(s.people[b].knownUntil, s.season + 1);
    s.leverage.push({ holder: PLAYER, over: b, season: s.season });
    event(s, PLAYER, `You now hold a secret over ${nameOf(s, b)} (a story told at your dinner).`, why);
    return true;
  }
  if (e.tongue) {
    const x = pid(e.tongue);
    if (!live(x)) return true;
    count(s, "dinnerTongues");
    opinion(s, x, -1, `word reached ${nameOf(s, x)} of what you said at dinner`);
    const p = s.people[x];
    if (p.traits.some((t) => ["proud", "vengeful", "fiery"].includes(t))) grudge(s, x, "you mocked him at your dinner, and he heard of it");
    return true;
  }
  return false;
}

export function describeDinnerEffect(s: GameState, roles: Record<string, string>, e: Effect): string | null {
  const who = (r: string) => capital(nameOf(s, roles[r] ?? r));
  if (e.bond) return `${who(e.bond[0])} and ${who(e.bond[1])} become friends`;
  if (e.quarrel) return `${who(e.quarrel[0])} and ${who(e.quarrel[1])} fall out`;
  if (e.mend) return `${who(e.mend[0])} and ${who(e.mend[1])} make peace`;
  if (e.couch) return `${who(e.couch)} takes the couch of honour`;
  if (e.bondYou) return `${who(e.bondYou)} lets go of a grudge, if any`;
  if (e.slip) return `You learn a secret about ${who(e.slip)}`;
  if (e.tongue) return `${who(e.tongue)} thinks less of you`;
  if (e.heardBy) return "";
  return null;
}

// ---------- The dinner ----------

export function hostDinner(s: GameState, a: Args) {
  const st = dinnerState(s);
  const w = wineById(a.second)!;
  const honour = a.target!;
  const guests = parseGuests(a.option);
  const table = [honour, ...guests];
  const from = (s.log.at(-1)?.n ?? 0) + 1;
  silver(s, -w.cost, "the dinner");
  count(s, "dinners");
  event(s, PLAYER, `You give a dinner. On the couch beside yours, ${nameOf(s, honour)}; with you, ${guests.map((g) => nameOf(s, g)).join(", ")}. ${w.text}`, "Give a dinner");
  const rec: DinnerRecord = { season: s.season, honour, guests, wine: w.id, moments: [], from, to: from };
  st.held.push(rec);
  if (st.held.length > K.kept) st.held.shift();
  // The couch beside yours.
  const prev = st.honour;
  if (prev && prev !== honour) slight(s, prev, honour);
  if (prev !== honour) setCouch(s, honour, "you seated him beside you");
  opinion(s, honour, 1, "the couch beside yours at dinner");
  // Three parts of the evening, at most one moment each, and at most one matter put to you.
  let asked = false;
  for (const c of DINNERS.courses) {
    rec.to = s.log.at(-1)?.n ?? from;
    if (s.over) return;
    const pool: { m: Moment; cast: Record<string, string>; w: number }[] = [];
    for (const m of DINNERS.moments) {
      if (m.course !== c.n) continue;
      if (m.ask && asked) continue;
      if (rec.moments.includes(m.id)) continue;
      if (m.peace && s.island?.war) continue;
      const wt = m.weight * (w.tones[m.tone] ?? 1);
      if (wt <= 0) continue;
      const casts = castsFor(s, m, honour, table);
      if (!casts.length) continue;
      const cast = casts[Math.floor(nextRandom(s) * casts.length)];
      pool.push({ m, cast, w: wt });
    }
    const total = pool.reduce((x, p) => x + p.w, 0) + K.nothingWeight;
    let r = nextRandom(s) * total;
    const chosen = pool.find((p) => (r -= p.w) < 0);
    if (!chosen) continue;
    const { m, cast } = chosen;
    rec.moments.push(m.id);
    count(s, "dinnerMoments");
    event(s, Object.values(cast)[0] ?? PLAYER, `During ${c.name}: ${fill(s, m.text, cast)}`, fill(s, m.why, cast));
    apply(s, { uid: "", id: m.id, roles: cast, season: s.season }, m.effects ?? [], m.name);
    if (m.ask && fireNow(s, m.ask, cast)) { asked = true; count(s, "dinnerAsks"); }
  }
  rec.to = s.log.at(-1)?.n ?? from;
}

// The log entries of one dinner, in order (for the screen and the sample write-ups).
export const dinnerLog = (s: GameState, d: DinnerRecord) => s.log.filter((e) => e.n >= d.from && e.n <= d.to);

// ---------- What it does to plots (ai.ts asks these) ----------

// A plotter never recruits a man he quarrelled with at your table, and recruits his friends from it first.
export function recruitOrder(s: GameState, leader: string, cands: Person[]): Person[] {
  if (!dinnersOn(s) || !s.dinners) return cands;
  const ok = cands.filter((q) => !quarrelled(s, leader, q.id));
  return [...ok.filter((q) => bonded(s, leader, q.id)), ...ok.filter((q) => !bonded(s, leader, q.id))];
}
export function recruitMods(s: GameState, leader: string, q: string): Mod[] {
  if (!dinnersOn(s) || !bonded(s, leader, q)) return [];
  return [{ label: "friends from your table", value: K.friendRecruit }];
}

// The action, in the shape actions.ts uses.
export const DINNER_IMPL = {
  hostDinner: {
    target: (s: GameState) => guestPool(s).map((p) => ({ value: p.id, label: capital(p.name) })),
    second: () => DINNERS.wines.map((w) => ({ value: w.id, label: `${w.label} (${w.cost} silver)` })),
    secondLabel: "Wine",
    check: (s: GameState, a: Args) => checkDinner(s, a),
    run: (s: GameState, a: Args) => hostDinner(s, a),
  },
};
