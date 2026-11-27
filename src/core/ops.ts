// Every state change goes through these functions. Each one writes a line to the one log, with its reason,
// so the chronicle and the player can always see why something happened.
import { DATA, originById } from "./data.ts";
import { d6 } from "./rng.ts";
import { PLAYER, activeRivals, capital, moodName, nameOf, officeName, power, band, seasonName } from "./state.ts";
import type { FactionId, GameState, LogEntry, Mod, OfficeId, Scar, Status } from "./types.ts";
import { FACTIONS } from "./types.ts";
import { on } from "./switches.ts";
import { chapter, feudOn, feudOf, feudPause, feudStart, feudSurvive } from "./feud.ts";

export function log(s: GameState, e: Omit<LogEntry, "n" | "season" | "step">): LogEntry {
  const entry = { n: s.log.length, season: s.season, step: s.step, ...e } as LogEntry;
  s.log.push(entry);
  return entry;
}
export const event = (s: GameState, actor: string, text: string, why?: string, visible = true) =>
  log(s, { actor, text, why, visible, kind: "event" });
const change = (s: GameState, actor: string, text: string, why: string, visible = true) =>
  log(s, { actor, text, why, visible, kind: "change" });

// A roll: one die plus modifiers, 4+ (or `need`) succeeds. Traits add at most 2 either way.
export function roll(s: GameState, actor: string, what: string, mods: Mod[], need = 4, visible = true) {
  const die = d6(s);
  const total = die + mods.reduce((a, m) => a + m.value, 0);
  const ok = total >= need;
  log(s, { actor, text: `${what}: rolled ${die}${mods.map((m) => ` ${m.value >= 0 ? "+" : "-"}${Math.abs(m.value)} ${m.label}`).join("")} = ${total}, needs ${need}. ${ok ? "Success." : "Failure."}`,
    visible, kind: "roll", roll: { die, mods, total, need, ok } });
  return { die, total, ok };
}

export function silver(s: GameState, d: number, why: string) {
  if (!d) return;
  s.silver = Math.max(0, s.silver + d);
  change(s, "world", `Silver ${d > 0 ? "+" : ""}${d} (now ${s.silver}).`, why);
}
export function grain(s: GameState, d: number, why: string) {
  if (!d) return;
  s.grain = Math.max(0, s.grain + d);
  change(s, "world", `Grain ${d > 0 ? "+" : ""}${d} months (now ${s.grain}).`, why);
}
export function land(s: GameState, d: number, why: string) {
  s.land = Math.max(0, s.land + d);
  change(s, "world", `Land ${d > 0 ? "+" : ""}${d} (now ${s.land}).`, why);
}
export function clock(s: GameState, d: number, why: string) {
  if (!d) return;
  const before = s.clock;
  s.clock = Math.max(0, Math.min(10, s.clock + d));
  if (s.clock !== before) change(s, "world", `${s.island ? "Carthage's anger" : "The Carthage clock"} ${d > 0 ? "rises" : "falls"} to ${s.clock} of 10.`, why);
}
export function guardSet(s: GameState, key: "strength" | "upkeep", d: number, why: string) {
  const before = s.guard[key];
  s.guard[key] = Math.max(0, s.guard[key] + d);
  change(s, "guard", `Guard ${key} ${d > 0 ? "+" : ""}${d} (now ${s.guard[key]}).`, why);
  // Pay follows the men (Jacob's second test, 2026-11-26): every man lost takes his pay with him, and a guard is never paid more than it has men.
  if (key === "strength" && s.guard.strength < before) {
    const pay = Math.min(Math.max(0, s.guard.upkeep - (before - s.guard.strength)), s.guard.strength);
    if (pay < s.guard.upkeep) {
      const cut = pay - s.guard.upkeep;
      s.guard.upkeep = pay;
      change(s, "guard", `Guard upkeep ${cut} (now ${pay}).`, "dead men draw no pay");
    }
  }
}

export function mood(s: GameState, f: FactionId, d: number, why: string, visible = true) {
  const fa = s.factions[f];
  const before = fa.mood;
  fa.mood = Math.max(0, Math.min(4, fa.mood + d));
  // Counted for the headless runs: a cost that changed nothing (council 2026-11-25). Changes no rule.
  if (d < 0 && before === 0) s.counters.floorHits = (s.counters.floorHits ?? 0) + 1;
  if (fa.mood !== before) change(s, f, `${capital(fa.short)} ${fa.mood > before ? "warm" : "sour"} to ${moodName(fa.mood)}.`, why, visible);
  // At the bottom a faction can sour no further. Say what that costs instead, once a year (council 2026-11-25).
  else if (d < 0 && before === 0 && visible && (s.flags[`floor_${f}`] === undefined || s.season - s.flags[`floor_${f}`] >= 4)) {
    s.flags[`floor_${f}`] = s.season;
    change(s, f, `${capital(fa.short)} can think no worse of you. Rebellious, they put their weight behind any plot against you.`, why, visible);
  }
  if (fa.mood > 1 && fa.backing) {
    const pl = s.plots.find((p) => p.id === fa.backing);
    if (pl) pl.backers = pl.backers.filter((b) => b !== f);
    fa.backing = undefined;
    change(s, f, `${capital(fa.short)} stop backing the plot.`, "a faction stops backing a plot once its mood rises above Angry", false);
  }
}
export function powerChange(s: GameState, f: FactionId, d: number, why: string) {
  if (!d) return;
  const fa = s.factions[f];
  const before = power(s, f);
  fa.base += d;
  // Keep the total inside 0..10 without letting the base run away.
  const held = before - (fa.base - d);
  fa.base = Math.max(-held, Math.min(10 - held, fa.base));
  const after = power(s, f);
  if (after !== before) change(s, f, `${capital(fa.name)} power ${after > before ? "+" : ""}${after - before} (now ${after}, ${band(after)}).`, why);
}

export function opinion(s: GameState, pid: string, d: number, why: string, visible = true) {
  const p = s.people[pid];
  if (!p || p.player || !d) return;
  const before = p.opinion;
  p.opinion = Math.max(-3, Math.min(3, p.opinion + d));
  if (p.opinion !== before) change(s, pid, `${capital(p.name)}'s opinion of you ${d > 0 ? "rises" : "falls"} to ${fmt(p.opinion)}.`, why, visible);
}
export const fmt = (n: number) => (n > 0 ? `+${n}` : `${n}`);

export function grudge(s: GameState, pid: string, reason: string) {
  const p = s.people[pid];
  if (!p || p.player || p.status === "dead") return;
  p.grudges.push({ reason, season: s.season });
  change(s, pid, `${capital(p.name)} holds a grudge: ${reason}.`, reason);
}
export function clearGrudge(s: GameState, pid: string, why: string): boolean {
  const p = s.people[pid];
  if (!p.grudges.length) return false;
  const g = p.grudges.shift()!;
  change(s, pid, `${capital(p.name)} lets go of a grudge (${g.reason}).`, why);
  return true;
}

// Switch "contestedBoard" listens here (board.ts sets it), so every change of hands is seen without a cycle of imports.
export const boardHooks: { onSeat?: (s: GameState, seat: string, before: string | null, after: string | null) => void } = {};
export function setOffice(s: GameState, o: OfficeId, holder: string | null, why: string) {
  const before = s.offices[o];
  if (before === holder) return;
  s.offices[o] = holder;
  if (s.board) boardHooks.onSeat?.(s, o, before, holder);
  change(s, holder ?? "world", holder ? `${capital(nameOf(s, holder))} ${holder === PLAYER ? "hold" : "holds"} ${officeName(o)}.` : `${capital(officeName(o))} stands empty.`, why);
}

export function setStatus(s: GameState, pid: string, status: Status, why: string) {
  const p = s.people[pid];
  const was = p.status;
  p.status = status;
  const words = ({ free: "is free in the city", held: "is held under guard", outside: "is outside the walls", dead: "is dead", absent: "is away" } as Record<string, string>)[status];
  change(s, pid, `${capital(p.name)} ${words}.`, why);
  if (status !== "free") {
    // An office needs its holder in the city; held, exiled or dead holders lose it.
    for (const o of Object.keys(s.offices) as OfficeId[]) {
      if (s.offices[o] === pid && (status === "dead" || status === "held")) {
        // In exile the office passes to the man who rules the city, not to you (or stands empty under Carthage or the
        // assembly). Found by the second island test batch, 2026-11-26: before, a dead holder handed it to you abroad.
        const ruler = s.exile?.active ? s.exile.ruler : null;
        const heir = !ruler ? PLAYER : ruler.kind === "person" && ruler.id && ruler.id !== pid && s.people[ruler.id]?.status === "free" ? ruler.id : null;
        setOffice(s, o, heir, `${p.name} can no longer hold it`);
      }
    }
  }
  if (was === "outside" && status === "free" && feudOf(p)) feudSurvive(s, pid, "came home from exile", "the Returned");
  if (status === "held" || status === "dead") leaveAllPlots(s, pid, status === "dead" ? "dead" : "held under guard");
}

export function leaveAllPlots(s: GameState, pid: string, why: string) {
  for (const pl of s.plots) {
    if (!pl.members.includes(pid)) continue;
    pl.members = pl.members.filter((m) => m !== pid);
    change(s, pid, `${capital(s.people[pid].name)} is out of a plot.`, why, pl.known.includes(pid));
    if (pl.leader === pid && pl.members.length) {
      pl.leader = pl.members[0];
      change(s, pl.leader, `${capital(s.people[pl.leader].name)} takes over the plot.`, "its leader is gone", false);
    }
  }
  const before = s.plots.length;
  s.plots = s.plots.filter((pl) => pl.members.length > 0);
  if (s.plots.length < before) s.flags.plotBroken = s.season; // for the breathing-room knob
}

export function memory(s: GameState, pid: string, text: string) {
  const p = s.people[pid];
  if (!p?.rival) return;
  p.rival.memory.push({ season: s.season, text: `${text}, ${seasonName(s.season)}` });
}

// Rivals. Origins (scars) come from data/rivals.json; rank changes are logged with their reason.
export function makeRival(s: GameState, pid: string, scar: Scar, what: string) {
  const p = s.people[pid];
  if (!p || p.player || p.status === "dead") return;
  if (p.rival) {
    if (!p.rival.scars.includes(scar)) p.rival.scars.push(scar);
    chapter(s, p, "scar", what);
    memory(s, pid, what);
    change(s, pid, `${capital(p.name)} carries a new scar: ${scar}.`, what);
    return;
  }
  const max = DATA.maxEnemies;
  if (activeRivals(s).length >= max) {
    if (!s.waiting.includes(pid)) s.waiting.push(pid);
    change(s, pid, `${capital(p.name)} would be your rival, and waits in the wings.`, `${what}; you already have ${max} rivals`);
    (p as any).pendingScar = scar;
    return;
  }
  // Switch "escalation": an old enemy comes back worse, a rank for each time he was your rival before (at most rank 3).
  // Switch "feud": a grievance already in his record starts nothing new; a paused feud resumes at its rank.
  const fromFeud = feudOn(s) ? feudStart(s, p, scar, what) : -1;
  if (fromFeud === 0) { change(s, pid, `${capital(p.name)}'s grievance is already in his record with you; it starts no new feud.`, what); return; }
  const past = fromFeud < 0 && on(s, "escalation") ? p.pastRivalries ?? 0 : 0;
  const rank = fromFeud > 0 ? fromFeud : Math.min(3, 1 + past);
  p.rival = { rank, scars: [scar], memory: [], since: s.season };
  memory(s, pid, what);
  s.counters.rivals = (s.counters.rivals ?? 0) + 1;
  if (past || fromFeud > 1) s.counters.returningRivals = (s.counters.returningRivals ?? 0) + 1;
  const title = DATA.ranks.find((x) => x.rank === rank)?.title;
  if (fromFeud > 0 && feudOf(p)!.chapters.some((c) => c.kind === "settled")) event(s, pid, `${capital(p.name)}'s old feud with you comes due, at rank ${rank}.`, what);
  else event(s, pid, past
    ? `${capital(p.name)} is your rival again (${originById(scar)?.name ?? scar}), and comes back as a ${title}.`
    : `${capital(p.name)} becomes your rival (${originById(scar)?.name ?? scar}).`, past ? `${what}; he was your rival ${past === 1 ? "once" : `${past} times`} before` : what);
}

export function rankChange(s: GameState, pid: string, d: number, why: string) {
  const p = s.people[pid];
  if (!p?.rival) return;
  let r = p.rival.rank + d;
  if (r >= 4 && activeRivals(s).some((x) => x.id !== pid && x.rival!.rank >= 4)) r = 3; // only one Nemesis
  r = Math.min(4, r);
  if (r <= 0) return endRival(s, pid, why);
  if (r === p.rival.rank) return;
  const up = r > p.rival.rank;
  p.rival.rank = r;
  const title = DATA.ranks.find((x) => x.rank === r)!.title;
  event(s, pid, `${capital(p.name)} ${up ? "rises" : "falls"} to rank ${r}, ${title}.`, why);
  if (r === 4) {
    p.agenda = { id: "yourFall", step: 0, done: false };
    s.counters.nemeses = (s.counters.nemeses ?? 0) + 1;
    // Counts each man once, however often he climbs back to Nemesis (for the balance runs).
    if (s.flags[`nemesis_${pid}`] === undefined) { s.flags[`nemesis_${pid}`] = s.season; s.counters.nemesisPeople = (s.counters.nemesisPeople ?? 0) + 1; }
    event(s, pid, `${capital(p.name)} is now your Nemesis, and works openly toward your fall.`, why);
  }
}
export function endRival(s: GameState, pid: string, why: string) {
  const p = s.people[pid];
  if (!p?.rival) return;
  if (feudOn(s)) feudPause(s, p, p.rival.rank, why);
  p.rival = undefined;
  if (on(s, "escalation")) p.pastRivalries = (p.pastRivalries ?? 0) + 1;
  if (p.agenda?.id === "yourFall") p.agenda = undefined;
  event(s, pid, `${capital(p.name)} is no longer your rival.`, why);
  // A waiting rival takes the open slot.
  const next = s.waiting.shift();
  if (next && s.people[next].status !== "dead") makeRival(s, next, (s.people[next] as any).pendingScar ?? "Humiliated", "an old wrong, waiting its turn");
}

export function factionOf(s: GameState, pid: string): FactionId | undefined {
  const f = s.people[pid]?.faction;
  return FACTIONS.includes(f as FactionId) ? (f as FactionId) : undefined;
}

export function nextId(s: GameState, prefix: string) {
  s.ids += 1;
  return `${prefix}${s.ids}`;
}
