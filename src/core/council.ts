// Switch "council": the men at your table argue over what you do (docs/game-research.md, proposal 4; the war council of
// about 404 BC in Diodorus 14.8.5 is the model). Each seat in data/council.json is held by one man. Before you act he
// says what he thinks, from his faction, his traits, his ambition and what he knows. A man who plots against you, wants
// your place or hates you gives counsel that serves himself: he shields his fellow plotters and points you at someone
// else. Nothing here rolls a die. Each season's briefing is logged when it accuses someone, and a false accusation you
// check is logged too, so the player can learn whom to trust.
import { flavored, withStock } from "./vary.ts";
import councilJson from "../../data/council.json" with { type: "json" };
import { PLAYER, alive, capital, nameOf, moodName, officeName, plotOf } from "./state.ts";
import { event, opinion } from "./ops.ts";
import { on } from "./switches.ts";
import { councilOf, censusPersonName } from "./census-game.ts";
import { deedSecret, stableHash } from "./secrets.ts";
import type { Args, CouncilLine, FactionId, GameState, Person } from "./types.ts";
import { FACTIONS } from "./types.ts";

interface SeatDef { id: string; name: string; duty: string; from?: string[]; census?: string; scenario?: string; concern: string[] }
const C = councilJson as unknown as {
  knobs: { seatInfluence: number; overruleTraits: string[] };
  seats: SeatDef[];
  tags: Record<string, string[]>;
  factionLean: Record<string, Record<string, number>>;
  traitLean: Record<string, Record<string, number>>;
  said: Record<string, string[]>;
  reasons: Record<string, string>;
  brief: Record<string, string>;
};
export const COUNCIL = C;
export const councilOn = (s: GameState) => on(s, "council") && !!s.council;
export const seatDefs = (s: GameState) => C.seats.filter((x) => !x.scenario || x.scenario === (s.scenario ?? "citadel"));
export const seatName = (id: string) => C.seats.find((x) => x.id === id)?.name ?? id;
const tagsOf = (action: string) => Object.entries(C.tags).filter(([, xs]) => xs.includes(action)).map(([t]) => t);
const SEVERE = ["imprison", "execute", "exile", "seize", "revokeOffice", "demandOffice", "expose"];
const HARM = [...SEVERE, "watch", "plantRumor", "payServants", "block", "forceFavor"];

export function initCouncil(s: GameState) {
  s.council = { seats: {}, chosen: {}, brief: [], said: [], doubts: {}, right: {}, overruled: {} };
  fillSeats(s, true);
}

export const isCensusSeat = (seat: string) => !!C.seats.find((x) => x.id === seat)?.census;
export function seated(s: GameState): { seat: string; who: string; census: boolean }[] {
  if (!s.council) return [];
  return seatDefs(s).filter((d) => s.council!.seats[d.id]).map((d) => ({ seat: d.id, who: s.council!.seats[d.id]!, census: !!d.census }));
}
export const seatOf = (s: GameState, pid: string) => seated(s).find((x) => x.who === pid && !x.census)?.seat;
export const councilName = (s: GameState, who: string, census: boolean) => (census ? censusPersonName(s, who) : nameOf(s, who));

// Who can sit: free in the city, alive, and not your open enemy (an open rival would not be asked).
export const canSit = (s: GameState, p: Person | undefined) => !!p && !p.player && p.status === "free" && alive(p) && !p.rival && !p.exposed;

export function fillSeats(s: GameState, quiet = false) {
  const c = s.council!;
  const taken = new Set<string>();
  for (const d of seatDefs(s)) {
    const was = c.seats[d.id] ?? null;
    let now: string | null = null;
    if (d.census) {
      const heads = councilOf(s, d.census).filter((id) => s.census?.people[id]?.alive);
      now = was && heads.includes(was) ? was : heads[0] ?? null;
    } else {
      const chosen = c.chosen[d.id];
      if (chosen && canSit(s, s.people[chosen]) && !taken.has(chosen)) now = chosen;
      else if (was && canSit(s, s.people[was]) && !taken.has(was)) now = was;
      else now = (d.from ?? []).find((id) => canSit(s, s.people[id]) && !taken.has(id) && !Object.entries(c.chosen).some(([k, v]) => v === id && k !== d.id)) ?? null;
      if (chosen && now !== chosen) delete c.chosen[d.id];
    }
    if (now) taken.add(now);
    c.seats[d.id] = now;
    if (now !== was && !quiet) {
      if (now) event(s, d.census ? "world" : now, `${capital(councilName(s, now, !!d.census))} takes the seat of ${d.name} at your council.`, was ? `${councilName(s, was, !!d.census)} can no longer sit there` : "the seat was empty");
      else if (was) event(s, "world", `The seat of ${d.name} at your council stands empty.`, `${councilName(s, was, !!d.census)} can no longer sit there`);
    }
  }
}

// A man who gives false counsel: he plots against you, wants your place, or hates you.
export function isFalse(s: GameState, pid: string, census = false): boolean {
  if (census) return false;
  const p = s.people[pid];
  return !!(plotOf(s, pid) || p.political || p.opinion <= -2);
}
// An honest man knows of a plotter in his own faction, and of any plotter once a plot is loud enough to be talked about.
function knowsGuilt(s: GameState, a: Person, t: Person): boolean {
  const pl = plotOf(s, t.id);
  if (!pl) return false;
  return t.faction === a.faction || (pl.stage >= 2 && t.faction !== "ruler");
}
// Whom a false counsellor points you at: another honest voice at your table, else the man who holds what he wants,
// else whoever you trust most. Never his fellow plotters.
export function scapegoat(s: GameState, a: Person): Person | undefined {
  const pl = plotOf(s, a.id);
  const caught = new Set(s.council!.said.filter((x) => x.by === a.id && x.checked && !x.truth).map((x) => x.about)); // he won't try the same lie twice
  const ok = (p: Person | undefined): p is Person => !!p && !p.player && p.id !== a.id && !caught.has(p.id) && p.status === "free" && alive(p) && !pl?.members.includes(p.id) && !plotOf(s, p.id);
  const honest = seated(s).filter((x) => !x.census && x.who !== a.id && !isFalse(s, x.who)).map((x) => s.people[x.who]).filter(ok);
  if (honest.length) return honest[0];
  const want = a.wants ? s.offices[a.wants] : null;
  if (want && want !== PLAYER && ok(s.people[want])) return s.people[want];
  return Object.values(s.people).filter(ok).sort((x, y) => y.opinion - x.opinion || (x.id < y.id ? -1 : 1))[0];
}

const say = (stance: number, key: string) => {
  const xs = C.said[String(stance)] ?? [];
  return xs.length ? xs[Math.floor(stableHash(0, key) * xs.length)] : "";
};
const facName = (s: GameState, f: string) => (FACTIONS.includes(f as FactionId) ? capital(s.factions[f as FactionId].short) : "Your house");
const reason = (s: GameState, k: string, args: Args, f?: string) =>
  C.reasons[k].replace("{target}", args.target && s.people[args.target] ? s.people[args.target].name : "him").replace("{faction}", f ? facName(s, f) : "They");

export interface Counsel extends CouncilLine { stance: number; seatName: string; name: string }

// What each man at your table says about one action. Pure: no dice, no log.
export function counsel(s: GameState, action: string, args: Args, chance?: number): Counsel[] {
  if (!councilOn(s)) return [];
  const tags = tagsOf(action);
  const out: Counsel[] = [];
  for (const { seat, who, census } of seated(s)) {
    const a = census ? undefined : s.people[who];
    const fac = a ? (a.faction === "ruler" ? "family" : a.faction) : "rich";
    const traits = a ? a.traits : s.census?.people[who]?.traits ?? [];
    const parts: { v: number; k: string; lie?: boolean }[] = [];
    let lean = C.factionLean[fac]?.[action] ?? 0;
    if (action === "giveLand") lean = args.target === fac ? 2 : fac === "rich" ? -1 : 0;
    if (lean) parts.push({ v: lean, k: lean > 0 ? "factionFor" : "factionAgainst" });
    for (const t of traits) for (const tag of tags) { const v = C.traitLean[t]?.[tag]; if (v) parts.push({ v, k: v > 0 ? tag : tag === "war" ? "noWar" : tag === "harsh" ? "mercy" : tag === "gift" ? "noGift" : "odds" }); }
    const t = args.target ? s.people[args.target] : undefined;
    if (a && t) {
      const harm = HARM.includes(action), severe = SEVERE.includes(action);
      const fals = isFalse(s, a.id);
      const accused = s.council!.said.some((x) => x.by === a.id && x.about === t.id && x.season >= s.season - 2);
      if (t.id === a.id) parts.push(harm ? { v: -3, k: "selfHarm" } : tags.includes("gift") || action === "grantOffice" ? { v: 3, k: "self" } : { v: 0, k: "" });
      else if (harm && a.kin.includes(t.id)) parts.push({ v: -2, k: "kin" });
      else if (harm && fals && plotOf(s, a.id) && plotOf(s, a.id) === plotOf(s, t.id)) parts.push({ v: -3, k: "innocent", lie: true });
      else if (harm && fals && accused && !plotOf(s, t.id)) parts.push({ v: 3, k: "guilty", lie: true });
      else if (harm && !fals && knowsGuilt(s, a, t)) parts.push({ v: 2, k: "guilty" });
      else if (severe && !fals && t.faction === a.faction && !plotOf(s, t.id)) parts.push({ v: -1, k: "noProof" });
      if (action === "grantOffice" && t.id !== a.id && args.second && (a.wants === args.second || (fals && a.political))) parts.push({ v: -2, k: "rivalOffice" });
    }
    if (chance !== undefined && chance < 0.34) parts.push({ v: -1, k: "odds" });
    if (seat === "purse" && s.silver <= 2 && (tags.includes("gift") || tags.includes("war"))) parts.push({ v: -1, k: "purse" });
    const sum = parts.reduce((x, p) => x + p.v, 0);
    const stance = Math.max(-2, Math.min(2, sum));
    if (!stance) continue;
    const top = parts.filter((p) => Math.sign(p.v) === Math.sign(stance) && p.k).sort((x, y) => Math.abs(y.v) - Math.abs(x.v))[0];
    const text = `${say(stance, `${who}:${action}:${s.season}`)} ${top ? reason(s, top.k, args, fac) : ""}`.trim();
    out.push({ seat, who, census, text, stance, seatName: seatName(seat), name: councilName(s, who, census), lie: !!top?.lie });
  }
  return out;
}

// ---------- The season's briefing ----------

function concernLine(s: GameState, concern: string): string | null {
  const B = C.brief;
  if (concern === "plot" && s.plots.some((p) => p.stage >= 1)) return B.plot;
  if (concern === "guard" && s.guard.arrearsSeasons > 0) return B.guard.replace("{owed}", String(s.guard.owed));
  if (concern === "silver" && s.silver <= 2) return B.silver.replace("{silver}", String(s.silver));
  if (concern === "grain" && s.grain <= 4) return B.grain.replace("{grain}", String(s.grain));
  if (concern === "carthage" && s.clock >= 7) return B.carthage.replace("{clock}", String(s.clock));
  if (concern === "faction") {
    const f = FACTIONS.filter((x) => s.factions[x].mood <= 1).sort((x, y) => s.factions[x].mood - s.factions[y].mood)[0];
    if (f) return B.faction.replace("{faction}", capital(s.factions[f].short)).replace("{mood}", moodName(s.factions[f].mood));
  }
  return null;
}

// At the start of your turn: who sits, and what each says. Accusations are logged; a false one leaves a secret.
export function councilBrief(s: GameState) {
  if (!councilOn(s)) return;
  fillSeats(s);
  const c = s.council!;
  c.brief = [];
  const plotting = s.plots.some((p) => p.stage >= 1);
  for (const { seat, who, census } of seated(s)) {
    const d = C.seats.find((x) => x.id === seat)!;
    const a = census ? undefined : s.people[who];
    let line: CouncilLine | null = null;
    if (a && plotting) {
      if (isFalse(s, a.id)) {
        const g = scapegoat(s, a);
        if (g) line = { seat, who, text: C.brief.accuse.replace("{target}", g.name), accuse: g.id, truth: false, lie: true };
      } else {
        // Only news: a plotter inside the walls whose name you don't have, and not one another man named already.
        const t = s.plots.flatMap((pl) => pl.members.filter((m) => !pl.known.includes(m))).map((m) => s.people[m])
          .find((m) => m.id !== a.id && m.status === "free" && knowsGuilt(s, a, m) && !c.brief.some((l) => l.accuse === m.id));
        if (t) line = { seat, who, text: C.brief.accuseTrue.replace("{target}", t.name), accuse: t.id, truth: true };
      }
    }
    if (!line) {
      const t = d.concern.map((k) => concernLine(s, k)).find(Boolean);
      line = { seat, who, ...(census ? { census: true } : {}), text: t ?? C.brief.quiet };
    }
    c.brief.push(line);
    if (line.accuse) {
      const fresh = !c.said.some((x) => x.by === who && x.about === line!.accuse && x.season >= s.season - 2);
      if (fresh) {
        c.said.push({ season: s.season, by: who, about: line.accuse, truth: !!line.truth });
        s.counters.councilAccusations = (s.counters.councilAccusations ?? 0) + 1;
        if (!line.truth) s.counters.councilLies = (s.counters.councilLies ?? 0) + 1;
        const fa = flavored(s, "councilAccuse", `At your council, ${a!.name} says ${s.people[line.accuse].name} is plotting against you.`);
        withStock(event(s, who, fa.text, `${a!.name}, ${d.name}`), fa.stock);
        if (!line.truth) deedSecret(s, who, "falseCounsel");
      }
    }
  }
  if (c.said.length > 40) c.said = c.said.slice(-40);
}

// Your watchers have looked at a man someone accused. A wrong accusation is remembered against the man who made it.
export function councilChecked(s: GameState, pid: string) {
  if (!councilOn(s)) return;
  const c = s.council!;
  const inPlot = !!plotOf(s, pid);
  for (const x of c.said) {
    if (x.about !== pid || x.checked || x.season < s.season - 2) continue;
    for (const y of c.said) if (y.about === pid && y.by === x.by) y.checked = true;
    if (inPlot) {
      c.right[x.by] = (c.right[x.by] ?? 0) + 1;
      event(s, x.by, `${capital(nameOf(s, x.by))} was right about ${nameOf(s, pid)}.`, "your watchers checked his counsel");
    } else {
      c.doubts[x.by] = (c.doubts[x.by] ?? 0) + 1;
      s.counters.liesCaught = (s.counters.liesCaught ?? 0) + 1;
      event(s, x.by, `${capital(nameOf(s, x.by))} told your council that ${nameOf(s, pid)} was plotting. Your watchers found nothing.`, "your watchers checked his counsel");
    }
  }
}

// Before an action runs: men who argued hard against it and can't bear being overruled think less of you.
export function councilHeard(s: GameState, action: string, args: Args, chance?: number) {
  if (!councilOn(s)) return;
  const c = s.council!;
  const lines = counsel(s, action, args, chance);
  for (const l of lines) {
    if (l.census || l.stance > -2 || c.overruled[l.who] === s.season) continue;
    const p = s.people[l.who];
    if (!p.traits.some((t) => C.knobs.overruleTraits.includes(t))) continue;
    c.overruled[l.who] = s.season;
    s.counters.overruled = (s.counters.overruled ?? 0) + 1;
    opinion(s, l.who, -1, `you overruled him at your council (${l.text})`);
  }
  const t = args.target;
  if (t && HARM.includes(action) && !plotOf(s, t) && c.said.some((x) => x.about === t && !x.truth && x.season >= s.season - 1)) s.counters.actedOnLies = (s.counters.actedOnLies ?? 0) + 1;
}

// At the end of a season: a man named as a plotter loses his seat, and the game says so.
export function councilSeasonEnd(s: GameState) {
  if (!councilOn(s)) return;
  for (const { seat, who, census } of seated(s)) {
    if (census) continue;
    const p = s.people[who];
    const named = s.plots.some((pl) => pl.members.includes(who) && pl.known.includes(who)) || p.exposed;
    if (!named) continue;
    s.council!.seats[seat] = null;
    if (s.council!.chosen[seat] === who) delete s.council!.chosen[seat];
    s.counters.unseated = (s.counters.unseated ?? 0) + 1;
    event(s, who, `${capital(p.name)}, who sat at your council as ${seatName(seat)}, is named as a plotter. His seat is empty.`, "a plotter at your table");
  }
  fillSeats(s); // the dead, the held and the exiled leave their seats
}

// Influence from a seat at your table (political rivals).
export const seatInfluence = (s: GameState, pid: string) => (s.council && seatOf(s, pid) ? C.knobs.seatInfluence : 0);

// The action "Seat a counsellor".
export const COUNCIL_IMPL = {
  seatCounsel: {
    target: (s: GameState) => !councilOn(s) ? [] : Object.values(s.people).filter((p) => canSit(s, p) && !seatOf(s, p.id)).map((p) => ({ value: p.id, label: capital(p.name) })),
    second: (s: GameState) => !councilOn(s) ? [] : seatDefs(s).filter((d) => !d.census).map((d) => ({ value: d.id, label: `${capital(d.name)} (${d.duty})${s.council!.seats[d.id] ? `, now ${nameOf(s, s.council!.seats[d.id]!)}` : ", empty"}` })),
    secondLabel: "Seat",
    run: (s: GameState, a: Args) => {
      const c = s.council!;
      const was = c.seats[a.second!];
      c.chosen[a.second!] = a.target!;
      c.seats[a.second!] = a.target!;
      event(s, PLAYER, `You give ${nameOf(s, a.target!)} the seat of ${seatName(a.second!)} at your council.`, "Seat a counsellor");
      opinion(s, a.target!, 1, "you gave him a seat at your table");
      if (was && s.people[was]) opinion(s, was, -1, `you put him out of his seat at your council`);
    },
  },
};
export { officeName };
