// The action menu (rules v2). Each action says who it can target, what the odds are (shown before rolling),
// and what happens. Names, costs and texts live in data/actions.json; the rules live here.
import { DATA, actionById, lawById, placeById, traitById, originById } from "./data.ts";
import { d6 } from "./rng.ts";
import {
  PLAYER, alive, band, capital, defense, holds, inCity, influence, leaderOf, memberWeight, nameOf, officeName,
  officesOf, others, plotOf, power, leverageOver,
} from "./state.ts";
import {
  clearGrudge, clock, event, factionOf, grain, grudge, guardSet, land, leaveAllPlots, makeRival, memory, mood,
  opinion, powerChange, rankChange, roll, setOffice, setStatus, silver, endRival,
} from "./ops.ts";
import type { Args, FactionId, GameState, Mod, OfficeId, Person } from "./types.ts";
import { FACTIONS, OFFICES } from "./types.ts";

export interface Option { value: string; label: string }
interface Impl {
  target?: (s: GameState) => Option[];
  second?: (s: GameState, a: Args) => Option[];
  secondLabel?: string;
  check?: (s: GameState, a: Args) => string | null;
  odds?: (s: GameState, a: Args) => Mod[] | null; // null = automatic
  need?: number;
  run: (s: GameState, a: Args, ok: boolean, die: number) => void;
  slots?: number;
}

const people = (s: GameState, f: (p: Person) => boolean): Option[] =>
  others(s).filter((p) => alive(p) && f(p)).map((p) => ({ value: p.id, label: capital(p.name) }));
const factionOpts = (ids: FactionId[], s: GameState): Option[] => ids.map((f) => ({ value: f, label: s.factions[f].name }));

// Traits add or subtract at most 2 in total on a roll.
export function traitMods(s: GameState, actor: string, target: string | undefined, action: string): Mod[] {
  const mods: Mod[] = [];
  const a = s.people[actor];
  for (const t of a?.traits ?? []) {
    const v = traitById(t)?.actor?.[action];
    if (v) mods.push({ label: `${a.player ? "your" : a.name + "'s"} trait ${traitById(t)!.name}`, value: v });
  }
  const b = target ? s.people[target] : undefined;
  for (const t of b?.traits ?? []) {
    const v = traitById(t)?.target?.[action];
    if (v) mods.push({ label: `${b!.name} is ${traitById(t)!.name}`, value: v });
  }
  let sum = mods.reduce((x, m) => x + m.value, 0);
  if (sum > 2 || sum < -2) {
    const cap = sum > 0 ? 2 : -2;
    return [{ label: "traits (capped at 2)", value: cap }];
  }
  return mods;
}
// Hooks from a rival's origin, for example Hunted gives +1 against Imprison and Watch.
function scarHook(s: GameState, pid: string | undefined, hook: string): number {
  const p = pid ? s.people[pid] : undefined;
  if (!p?.rival) return 0;
  return p.rival.scars.reduce((a, sc) => a + (originById(sc)?.hooks?.[hook] ?? 0), 0);
}
const guardMood = (s: GameState) => s.factions.guard.mood;

export function meetGoal(s: GameState, f: FactionId, metBy: string) {
  const def = DATA.factions.find((x) => x.id === f)!;
  const fa = s.factions[f];
  const g = def.goals[fa.goal % def.goals.length];
  if (g.metBy !== metBy) return;
  event(s, f, `${capital(fa.short)} have their wish: ${g.text}.`, "a faction's goal was met");
  mood(s, f, 1, `their goal was met (${g.text})`);
  powerChange(s, f, 1, "its goal was met");
  fa.goal += 1;
  const next = def.goals[fa.goal % def.goals.length];
  event(s, f, `${capital(fa.short)} now want ${next.text}.`, "a new goal");
}

function resolveRequests(s: GameState, f: (r: GameState["requests"][number]) => boolean) {
  const done = s.requests.filter(f);
  for (const r of done) event(s, r.from, `You grant ${nameOf(s, r.from)}'s petition.`, "granted");
  s.requests = s.requests.filter((r) => !f(r));
  return done.length;
}

function actAgainst(s: GameState, pid: string) {
  const f = factionOf(s, pid);
  if (f && leaderOf(s, f)?.id === pid) s.factions[f].actedAgainst = true;
}

// Make a political rival into an enemy when you hurt them (rules v2: switching kinds).
function hurtPolitical(s: GameState, pid: string, scar: string, what: string) {
  if (s.people[pid].political) makeRival(s, pid, scar, what);
}

function gainLeverage(s: GameState, holder: string, over: string, how: string) {
  s.leverage.push({ holder, over, season: s.season });
  event(s, holder, holder === PLAYER ? `You now hold a secret over ${nameOf(s, over)} (${how}).` : `${capital(nameOf(s, holder))} now holds a secret over ${nameOf(s, over)}.`,
    how, holder === PLAYER);
}
function spendLeverage(s: GameState, holder: string, over: string) {
  const i = s.leverage.findIndex((l) => l.holder === holder && l.over === over);
  if (i >= 0) s.leverage.splice(i, 1);
}
const hasSecret = (s: GameState, p: Person) => !!(plotOf(s, p.id) || p.grudges.length || p.agenda || p.political);

function reveal(s: GameState, pid: string) {
  const p = s.people[pid];
  p.knownUntil = s.season + 1;
  const pl = plotOf(s, pid);
  if (pl) {
    for (const m of [pid, pl.leader]) if (!pl.known.includes(m)) pl.known.push(m);
    event(s, PLAYER, `${capital(p.name)} is in a plot against you, led by ${nameOf(s, pl.leader)}.`, "your spies found it");
  } else {
    event(s, PLAYER, `${capital(p.name)} is in no plot. ${p.grudges.length ? `Grudges: ${p.grudges.map((g) => g.reason).join("; ")}.` : "No grudges."}`, "your spies found it");
  }
}

const officeHolders = (s: GameState) => people(s, (p) => officesOf(s, p.id).length > 0);
const marriageHouse = (s: GameState, p: Person) =>
  [p, ...p.kin.map((k) => s.people[k])].filter((x) => x && alive(x) && x.marriageable && !x.married && x.faction !== "family" && !x.player);
const freeKin = (s: GameState) =>
  [s.people[PLAYER], ...Object.values(s.people).filter((p) => p.faction === "family")].filter((p) => p.marriageable && !p.married && alive(p));

export const IMPL: Record<string, Impl> = {
  feast: {
    target: (s) => people(s, inCity),
    check: (s) => (s.silver < 1 ? "needs 1 silver" : null),
    odds: () => [],
    run: (s, a, ok) => {
      silver(s, -1, "the feast");
      const guests = [a.target!, ...others(s).filter((p) => inCity(p) && p.id !== a.target).sort((x, y) => x.opinion - y.opinion).slice(0, 2).map((p) => p.id)];
      event(s, PLAYER, `You feast ${guests.map((g) => nameOf(s, g)).join(", ")}.`, "Host a feast");
      for (const g of guests) opinion(s, g, 1, "your feast");
      if (ok) {
        const p = s.people[a.target!];
        event(s, PLAYER, `The wine loosens ${p.name}'s tongue.`, "the feast went well");
        reveal(s, p.id);
        if (hasSecret(s, p)) gainLeverage(s, PLAYER, p.id, "a feast that loosened tongues");
      }
    },
  },
  grantOffice: {
    target: (s) => people(s, (p) => inCity(p)),
    second: (s) => officesOf(s, PLAYER).map((o) => ({ value: o, label: capital(officeName(o)) })),
    secondLabel: "Office",
    check: (s, a) => (!a.second ? "choose an office you hold" : !holds(s, PLAYER, a.second as OfficeId) ? "you don't hold that office" : null),
    run: (s, a) => {
      const o = a.second as OfficeId;
      const p = s.people[a.target!];
      setOffice(s, o, p.id, "you granted it");
      event(s, PLAYER, `You grant ${officeName(o)} to ${p.name}.`, "Grant an office");
      opinion(s, p.id, 2, `you gave him ${officeName(o)}`);
      for (const r of s.requests.filter((r) => r.kind === "office" && r.office === o && r.from !== p.id)) refuse(s, r.id, true);
      resolveRequests(s, (r) => r.from === p.id && r.kind === "office");
      for (const q of others(s).filter((q) => alive(q) && q.id !== p.id && q.wants === o)) grudge(s, q.id, `you passed him over for ${officeName(o)}, ${s.season}`.replace(/, \d+$/, ""));
      const f = factionOf(s, p.id);
      if (f) meetGoal(s, f, "grantOffice");
      if (p.agenda?.id === "philistusTreasury" && o === "treasury" && !p.agenda.done) {
        p.agenda.done = true; p.agenda.result = "granted";
        event(s, p.id, `${capital(p.name)} has what he wanted: ${officeName(o)}.`, "his agenda is complete");
      }
      if (p.rival && !p.grudges.length) {
        endRival(s, p.id, "pardoned and given office, the enemy cools into a political rival");
        p.political = { type: politicalType(p), rank: 1, since: s.season, outSeasons: 0 };
      }
      if (p.political) { p.bound = true; event(s, p.id, `${capital(p.name)} is bound to you by office, but his influence grows.`, "co-opted"); }
    },
  },
  revokeOffice: {
    target: officeHolders,
    second: (s, a) => (a.target ? officesOf(s, a.target).map((o) => ({ value: o, label: capital(officeName(o)) })) : []),
    secondLabel: "Office",
    check: (s, a) => (!a.second || s.offices[a.second as OfficeId] !== a.target ? "choose one of their offices" : null),
    odds: (s, a) => {
      const p = s.people[a.target!];
      if (p.status === "outside" && s.citadelBuilt && holds(s, PLAYER, "citadel")) return null;
      const armed = p.faction === "guard" || ["fleet", "generalship"].includes(a.second!);
      if (!armed || s.factions[p.faction as FactionId]?.mood >= 2) return null;
      return guardMood(s) === 4 ? [{ label: "the guard is Loyal", value: 1 }] : [];
    },
    run: (s, a, ok) => {
      const o = a.second as OfficeId;
      const p = s.people[a.target!];
      actAgainst(s, p.id);
      if (!ok) {
        event(s, p.id, `${capital(p.name)} refuses to give up ${officeName(o)}. There is fighting in the streets.`, "the holder resisted");
        clock(s, 1, "street fighting");
        s.flags.fighting = s.season;
        makeRival(s, p.id, "Humiliated", `you tried to strip him of ${officeName(o)}`);
        return;
      }
      setOffice(s, o, PLAYER, "you revoked it");
      event(s, PLAYER, `You strip ${p.name} of ${officeName(o)}.`, "Revoke an office");
      opinion(s, p.id, -3, `you stripped him of ${officeName(o)}`);
      grudge(s, p.id, `you stripped him of ${officeName(o)}`);
      makeRival(s, p.id, "Humiliated", `you stripped him of ${officeName(o)}`);
    },
  },
  marriage: {
    target: (s) => people(s, (p) => p.faction !== "family" && !p.bound && marriageHouse(s, p).length > 0 && p.status !== "held"),
    second: (s) => freeKin(s).map((k) => ({ value: k.id, label: k.player ? "Yourself" : capital(k.name) })),
    secondLabel: "Your relative",
    check: (s, a) => {
      if (!a.second) return "choose a free relative";
      const p = s.people[a.target!];
      const asked = s.requests.some((r) => r.from === p.id && r.kind === "marriage");
      return p.opinion < 0 && !asked ? `${p.name}'s house will not agree (opinion below 0)` : null;
    },
    run: (s, a) => {
      const p = s.people[a.target!];
      const bride = marriageHouse(s, p)[0];
      const kin = s.people[a.second!];
      bride.married = true; kin.married = true;
      event(s, PLAYER, `${kin.player ? "You marry" : `${capital(kin.name)} marries`} ${bride.name}. ${capital(p.name)}'s house is bound to yours.`, "Arrange a marriage");
      const house = [p, ...p.kin.map((k) => s.people[k])].filter((x) => x && alive(x));
      for (const h of house) {
        h.bound = true;
        opinion(s, h.id, 2, "a marriage between your houses");
        if (h.rival) rankChange(s, h.id, -1, "bound to you by marriage");
      }
      if (!kin.player) opinion(s, kin.id, 2, "a good marriage");
      silver(s, d6(s) <= 3 ? 1 : 2, "the dowry");
      resolveRequests(s, (r) => r.kind === "marriage" && house.some((h) => h.id === r.from));
      const f = factionOf(s, p.id);
      if (f) meetGoal(s, f, "marriage");
      meetGoal(s, "family", "marriage");
    },
  },
  petition: {
    target: (s) => people(s, inCity),
    odds: (s, a) => [{ label: "their opinion of you", value: s.people[a.target!].opinion }, ...traitMods(s, PLAYER, a.target, "petition")],
    run: (s, a, ok) => {
      const p = s.people[a.target!];
      const f = factionOf(s, p.id);
      if (ok && f) { event(s, p.id, `${capital(p.name)} speaks for you among ${s.factions[f].short}.`, "Petition for support"); mood(s, f, 1, `${p.name} spoke for you`); }
      else event(s, p.id, `${capital(p.name)} gives you nothing but courtesy.`, "Petition for support");
    },
  },
  bribe: {
    target: (s) => people(s, (p) => p.status !== "dead"),
    second: () => [{ value: "1", label: "1 silver" }, { value: "3", label: "3 silver (clears a grudge)" }],
    secondLabel: "Amount",
    check: (s, a) => {
      const n = Number(a.second ?? 1);
      if (s.silver < n) return `needs ${n} silver`;
      if (scarHook(s, a.target, "noBribe")) return "a Bereaved rival can't be bribed";
      return null;
    },
    run: (s, a) => {
      const n = Number(a.second ?? 1);
      const p = s.people[a.target!];
      silver(s, -n, `a gift to ${p.name}`);
      event(s, PLAYER, `You send ${p.name} ${n} silver.`, "Bribe");
      opinion(s, p.id, n, "your gift");
      if (n >= 3 && !scarHook(s, p.id, "noBribeClear")) clearGrudge(s, p.id, "your gift");
      resolveRequests(s, (r) => r.from === p.id && r.kind === "silver");
    },
  },
  pardon: {
    target: (s) => people(s, (p) => p.grudges.length > 0 || p.status === "held"),
    run: (s, a) => {
      const p = s.people[a.target!];
      event(s, PLAYER, `You pardon ${p.name}.`, "Pardon");
      clearGrudge(s, p.id, "your pardon");
      if (p.status === "held") setStatus(s, p.id, "free", "pardoned");
      const pl = plotOf(s, p.id);
      if (pl) {
        if (d6(s) >= 4) leaveAllPlots(s, p.id, "pardoned, he leaves the plot");
      }
      if (p.rival && !p.grudges.length) rankChange(s, p.id, -1, "pardoned, with his grudge paid off");
    },
  },
  imprison: {
    target: (s) => people(s, inCity),
    odds: (s, a) => {
      const m: Mod[] = [];
      if (guardMood(s) >= 3) m.push({ label: `the guard is ${guardMood(s) === 4 ? "Loyal" : "Content"}`, value: 1 });
      m.push(...traitMods(s, PLAYER, a.target, "imprison"));
      const h = scarHook(s, a.target, "defendImprison");
      if (h) m.push({ label: "Hunted, and wary", value: -h });
      if (s.people[a.target!].exposed) m.push({ label: "named as a plotter", value: 1 });
      return m;
    },
    run: (s, a, ok) => {
      const p = s.people[a.target!];
      const f = factionOf(s, p.id);
      actAgainst(s, p.id);
      if (ok) {
        const wasLeader = f && leaderOf(s, f)?.id === p.id;
        event(s, PLAYER, `Your guards take ${p.name}.`, "Imprison");
        setStatus(s, p.id, "held", "you imprisoned him");
        if (f) mood(s, f, -1, `you imprisoned ${p.name}`);
        if (f && wasLeader) powerChange(s, f, -1, "its leader was imprisoned");
        if (p.rival) memory(s, p.id, "You threw him in chains");
        hurtPolitical(s, p.id, "Humiliated", "you imprisoned him");
        if (p.rival) for (const pl of s.plots) if (pl.members.includes(p.id)) rankChange(s, p.id, -1, "his plot exposed while he is held");
      } else {
        event(s, p.id, `${capital(p.name)} slips through your guards and flees the city.`, "Imprison failed");
        setStatus(s, p.id, "outside", "he fled");
        if (p.rival) rankChange(s, p.id, 1, "he escaped you");
        makeRival(s, p.id, "Hunted", "you tried to take him and he escaped");
      }
    },
  },
  execute: {
    target: (s) => people(s, (p) => p.status === "held"),
    run: (s, a) => {
      const p = s.people[a.target!];
      const f = factionOf(s, p.id);
      const wasRival = p.rival;
      event(s, PLAYER, `You have ${p.name} put to death.`, "Execute");
      setStatus(s, p.id, "dead", "executed");
      s.counters.executions = (s.counters.executions ?? 0) + 1;
      if (f) powerChange(s, f, -1, `you executed ${p.name}`);
      const kin = p.kin.map((k) => s.people[k]).filter((k) => k && alive(k));
      for (const k of kin) { grudge(s, k.id, `you executed his kin ${p.name}`); opinion(s, k.id, -2, `you executed ${p.name}`); }
      const nearest = kin[0];
      if (nearest) {
        if (wasRival) {
          makeRival(s, nearest.id, "Bereaved", `you executed ${p.name}, and the feud passes to him`);
          if (nearest.rival) nearest.rival.rank = Math.max(1, wasRival.rank - 1);
        } else if (d6(s) >= 4) makeRival(s, nearest.id, "Bereaved", `you executed ${p.name}`);
      }
      p.rival = undefined; p.political = undefined;
    },
  },
  exile: {
    target: (s) => people(s, (p) => p.status === "held" || p.status === "free"),
    run: (s, a) => {
      const p = s.people[a.target!];
      actAgainst(s, p.id);
      event(s, PLAYER, `You send ${p.name} into exile.`, "Exile");
      for (const o of officesOf(s, p.id)) setOffice(s, o, PLAYER, `${p.name} was exiled`);
      setStatus(s, p.id, "outside", "exiled");
      makeRival(s, p.id, "Exiled", "you drove him from the city");
    },
  },

  grainHandout: {
    check: (s) => (s.grain < 2 ? "needs 2 months of grain" : null),
    run: (s) => {
      grain(s, -2, "handed out");
      event(s, PLAYER, "You open the granaries to the people.", "Hand out grain");
      mood(s, "citizens", 1, "you handed out grain");
      meetGoal(s, "citizens", "grainHandout");
    },
  },
  giveLand: {
    target: (s) => factionOpts(["citizens", "rich", "family"], s),
    check: (s) => (s.land < 1 ? "no land to give" : null),
    run: (s, a) => {
      const f = a.target as FactionId;
      land(s, -1, `given to ${s.factions[f].short}`);
      event(s, PLAYER, `You give land to ${s.factions[f].short}.`, "Give land");
      mood(s, f, 1, "you gave them land");
      meetGoal(s, f, "giveLand");
      resolveRequests(s, (r) => r.kind === "land" && r.faction === f);
    },
  },
  proposeLaw: {
    target: (s) => DATA.laws.filter((l) => (l.repeatable || !s.laws.includes(l.id)) && s.flags[`failed_${l.id}`] !== s.season).map((l) => ({ value: l.id, label: `${l.name} (${l.detail})` })),
    odds: (s, a) => vote(s, a.target!).mods,
    run: (s, a, ok) => {
      const law = lawById(a.target!)!;
      const v = vote(s, law.id);
      for (const f of FACTIONS) if (s.flags[`vote_${f}`]) delete s.flags[`vote_${f}`];
      event(s, PLAYER, `You put ${law.name.toLowerCase()} to the assembly. For: ${v.forF.map((f) => s.factions[f].short).join(", ") || "no faction"}. Against: ${v.againstF.map((f) => s.factions[f].short).join(", ") || "no faction"}.`, "Propose a law or levy");
      if (ok) {
        event(s, PLAYER, `The assembly passes ${law.name.toLowerCase()}.`, "the vote");
        if (law.once) silver(s, law.once.silver, law.name);
        else s.laws.push(law.id);
        for (const [f, d] of Object.entries(law.moods ?? {})) mood(s, f as FactionId, d, law.name.toLowerCase());
        for (const f of v.forF) powerChange(s, f, 1, "it won an assembly vote");
        if (law.servesCitizens) meetGoal(s, "citizens", "lawForCitizens");
      } else {
        event(s, PLAYER, `The assembly throws out ${law.name.toLowerCase()}.`, "the vote");
        s.flags[`failed_${law.id}`] = s.season;
      }
    },
  },
  seize: {
    target: (s) => people(s, (p) => inCity(p) && (p.faction === "rich" || p.traits.includes("wealthy"))),
    odds: (s, a) => {
      const m: Mod[] = [];
      if (guardMood(s) === 4) m.push({ label: "the guard is Loyal", value: 1 });
      return [...m, ...traitMods(s, PLAYER, a.target, "seize")];
    },
    run: (s, a, ok) => {
      const p = s.people[a.target!];
      actAgainst(s, p.id);
      s.factions.rich.actedAgainst = true;
      if (ok) {
        event(s, PLAYER, `Your men empty the strongrooms of ${p.name}.`, "Seize property");
        silver(s, d6(s) <= 3 ? 2 : 3, `seized from ${p.name}`);
        powerChange(s, "rich", -1, "its property was seized");
      } else event(s, PLAYER, `${capital(p.name)} had warning. The silver is gone before your men arrive.`, "Seize property failed");
      mood(s, "rich", -1, `you went after ${p.name}'s property`);
      grudge(s, p.id, "you seized his estates");
      opinion(s, p.id, -1, "you seized his estates");
      hurtPolitical(s, p.id, "Humiliated", "you seized his estates");
    },
  },
  strikeCoin: {
    check: (s) => (!holds(s, PLAYER, "mint") ? "you don't hold the mint" : s.flags.coin === s.season ? "already struck this season" : null),
    run: (s) => {
      s.flags.coin = s.season;
      event(s, PLAYER, "You strike coin at the mint.", "Strike coin");
      silver(s, 2, "new coin");
      mood(s, "rich", -1, "debased coin eats their wealth");
    },
  },
  build: {
    target: (s) => {
      if (s.building) return [{ value: s.building.what, label: `Finish the ${s.building.what}` }];
      const o: Option[] = [];
      if (!s.citadelBuilt) o.push({ value: "citadel", label: "Citadel on the Island (4 silver)" });
      if (!s.granary) o.push({ value: "granary", label: "Granary (3 silver)" });
      if (!s.walls) o.push({ value: "wall", label: "Wall (3 silver)" });
      return o;
    },
    check: (s, a) => {
      if (s.building) return a.target === s.building.what ? null : `finish the ${s.building.what} first`;
      const cost = a.target === "citadel" ? 4 : 3;
      return s.silver < cost ? `needs ${cost} silver` : null;
    },
    run: (s, a) => {
      const what = a.target as "citadel" | "granary" | "wall";
      if (!s.building) {
        silver(s, -(what === "citadel" ? 4 : 3), `building the ${what}`);
        s.building = { what, slotsLeft: 1 };
        event(s, PLAYER, `Work begins on the ${what}. It needs one more action to finish.`, "Build");
        return;
      }
      s.building = undefined;
      event(s, PLAYER, `The ${what} is finished.`, "Build");
      if (what === "citadel") { s.citadelBuilt = true; setOffice(s, "citadel", PLAYER, "you built it"); }
      if (what === "granary") s.granary = true;
      if (what === "wall") s.walls = true;
    },
  },

  payGuard: {
    check: (s) => (s.guard.owed <= 0 ? "the guard is owed nothing" : !holds(s, PLAYER, "treasury") ? "you don't hold the treasury" : s.silver < 1 ? "no silver" : null),
    run: (s) => {
      const n = Math.min(s.silver, s.guard.owed);
      silver(s, -n, "back pay for the guard");
      s.guard.owed -= n;
      event(s, PLAYER, `You pay the guard ${n} silver of what they are owed.`, "Pay the guard's arrears");
      if (s.guard.owed <= 0) {
        s.guard.owed = 0; s.guard.arrearsSeasons = 0; s.guard.forSale = false;
        mood(s, "guard", 1, "their arrears are paid");
        meetGoal(s, "guard", "payGuard");
      }
    },
  },
  hire: {
    check: (s) => (s.silver < 2 ? "needs 2 silver" : null),
    run: (s) => {
      silver(s, -2, "hiring mercenaries");
      event(s, PLAYER, "You hire more mercenaries.", "Hire mercenaries");
      guardSet(s, "strength", 1, "new men");
      guardSet(s, "upkeep", 1, "more men to pay");
    },
  },
  grantGuard: {
    check: (s) => (s.land < 1 ? "no land to give" : null),
    run: (s) => {
      land(s, -1, "given to the guard");
      event(s, PLAYER, "You give the guard houses on the Island and the rights of citizens.", "Grant land or citizenship to the guard");
      mood(s, "guard", 1, "land and citizenship");
      mood(s, "citizens", -1, "foreigners made citizens");
      meetGoal(s, "guard", "grantGuard");
      resolveRequests(s, (r) => r.kind === "citizenship");
      const ag = s.factions.guard.agenda;
      if (!ag.done && (ag.id === "guardCitizens" || ag.id === "kingmakers")) {
        ag.done = true; ag.result = "granted";
        for (const pl of s.plots) pl.guardBacking = false;
        event(s, "guard", "The guard become citizens of Syracuse.", "their agenda is met");
        powerChange(s, "guard", 2, "its agenda completed");
      }
    },
  },
  disarm: {
    check: (s) => (s.factions.citizens.disarmed ? "the citizens are already disarmed" : null),
    odds: (s) => (guardMood(s) === 4 ? [{ label: "the guard is Loyal", value: 1 }] : []),
    run: (s, _a, ok) => {
      s.factions.citizens.actedAgainst = true;
      if (ok) {
        event(s, PLAYER, "Your mercenaries carry off the citizens' arms.", "Disarm the citizens");
        s.factions.citizens.disarmed = true;
        powerChange(s, "citizens", -2, "they were disarmed");
        mood(s, "citizens", -2, "you took their arms");
        for (const pl of s.plots) if (pl.backers.includes("citizens") || pl.members.some((m) => s.people[m].faction === "citizens")) pl.bonus -= 2;
      } else {
        event(s, PLAYER, "The citizens will not give up their arms. There is fighting in the streets.", "Disarm the citizens failed");
        s.flags.fighting = s.season;
        clock(s, 1, "street fighting");
        mood(s, "citizens", -1, "you tried to take their arms");
      }
    },
  },
  raid: {
    target: (s) => DATA.places.filter((p) => p.raid).map((p) => ({ value: p.id, label: capital(p.name) })),
    check: (s) => (raider(s) ? null : "needs the fleet (held by you or a friend) or the generalship"),
    odds: (s, a) => {
      const pl = placeById(a.target!)!;
      const r = raider(s)!;
      const m: Mod[] = traitMods(s, r.leader, undefined, "raid").map((x) => (r.leader === PLAYER ? x : { ...x, label: `${nameOf(s, r.leader)} leads: ${x.label}` }));
      if (pl.walled) m.push({ label: "walled target", value: -1 });
      return m;
    },
    run: (s, a, ok) => {
      const pl = placeById(a.target!)!;
      const r = raider(s)!;
      if (pl.carthaginian) { clock(s, 1, "an attack on Carthage's towns"); s.flags.raidYear = Math.floor(s.season / 4) + 1; }
      if (ok) {
        event(s, r.leader, `${r.leader === PLAYER ? "You raid" : `${capital(nameOf(s, r.leader))} raids`} ${pl.name} with ${r.by === "fleet" ? "the fleet" : "the army"} and comes home loaded.`, "Raid");
        if (pl.carthaginian || d6(s) <= 3) silver(s, d6(s) <= 3 ? 2 : 3, `loot from ${pl.name}`);
        else grain(s, 2, `grain from the farms of ${pl.name}`);
        if (r.leader !== PLAYER) opinion(s, r.leader, 1, "glory from the raid");
      } else {
        event(s, r.leader, `The raid on ${pl.name} is driven off.`, "Raid failed");
        if (r.by === "fleet") { s.flags.fleetDamaged = s.season; event(s, "world", "Ships are lost. The fleet can bring no grain this winter.", "the raid failed"); }
        else guardSet(s, "strength", -1, "men lost on the raid");
      }
    },
  },
  march: {
    target: (s) => DATA.places.filter((p) => p.march && !s.flags[`taken_${p.id}`]).map((p) => ({ value: p.id, label: capital(p.name) })),
    check: (s) => (!holds(s, PLAYER, "generalship") ? "you don't hold the generalship" : s.flags.marched === s.season ? "the army has marched this season" : null),
    odds: (s, a) => {
      const pl = placeById(a.target!)!;
      const m: Mod[] = traitMods(s, PLAYER, undefined, "march");
      if (pl.marchMod) m.push({ label: `${pl.name} is strong`, value: pl.marchMod });
      if (s.sieges[pl.id]) m.push({ label: "the siege lines are dug", value: s.sieges[pl.id] });
      if (guardMood(s) === 4) m.push({ label: "the guard is Loyal", value: 1 });
      if (s.guard.arrearsSeasons > 0) m.push({ label: "the guard is unpaid", value: -1 });
      return m;
    },
    run: (s, a, ok) => {
      const pl = placeById(a.target!)!;
      s.flags.marched = s.season;
      if (!ok) {
        s.sieges[pl.id] = (s.sieges[pl.id] ?? 0) + 1;
        event(s, PLAYER, `Your army sits down before ${pl.name}. It becomes a siege.`, "March on failed");
        return;
      }
      s.flags[`taken_${pl.id}`] = 1;
      event(s, PLAYER, `Your army takes ${pl.name}.`, "March on");
      if (pl.reward?.silver) silver(s, pl.reward.silver, `plunder from ${pl.name}`);
      if (pl.reward?.land) land(s, pl.reward.land, `the farmland of ${pl.name}`);
      if (pl.treaty) clock(s, 1, `taking ${pl.name} broke the treaty with Carthage`);
      if (pl.exiles) {
        powerChange(s, "rich", -1, "the exiles' fortress fell");
        mood(s, "rich", -1, "their sons at Aetna were beaten");
        for (const p of others(s).filter((p) => p.status === "outside" && p.faction === "rich")) {
          if (d6(s) >= 4) { event(s, p.id, `${capital(p.name)} dies in the fighting at Aetna.`, "the fortress fell"); setStatus(s, p.id, "dead", "killed at Aetna"); }
          else { event(s, p.id, `${capital(p.name)} is taken alive at Aetna.`, "the fortress fell"); setStatus(s, p.id, "held", "captured"); }
        }
      }
    },
  },

  watch: {
    target: (s) => people(s, (p) => p.status === "free" || p.status === "held"),
    odds: (s, a) => {
      const m = traitMods(s, PLAYER, a.target, "watch");
      const h = scarHook(s, a.target, "defendWatch");
      if (h) m.push({ label: "Hunted, and wary", value: -h });
      return m;
    },
    run: (s, a, ok, die) => {
      const p = s.people[a.target!];
      if (!s.watches.includes(p.id)) s.watches.push(p.id);
      actAgainst(s, p.id);
      if (ok) {
        event(s, PLAYER, `Your watchers follow ${p.name}.`, "Watch a person");
        reveal(s, p.id);
        if (hasSecret(s, p)) gainLeverage(s, PLAYER, p.id, "what your watchers saw");
      } else {
        event(s, PLAYER, `Your watchers learn nothing about ${p.name}.`, "Watch a person");
        if (die === 1) opinion(s, p.id, -1, "he noticed he was followed");
      }
    },
  },
  plantRumor: {
    target: (s) => people(s, (p) => p.status !== "dead"),
    second: (s, a) => people(s, (p) => p.status !== "dead" && p.id !== a.target),
    secondLabel: "Against",
    check: (s, a) => (!a.second ? "choose who the rumor turns them against" : null),
    odds: (s) => traitMods(s, PLAYER, undefined, "plantRumor"),
    run: (s, a, ok) => {
      const x = s.people[a.target!], y = s.people[a.second!];
      actAgainst(s, x.id);
      if (!ok) {
        event(s, PLAYER, `The rumor is traced back to you.`, "Plant a rumor failed");
        opinion(s, x.id, -1, "you spread lies about him"); opinion(s, y.id, -1, "you spread lies about him");
        return;
      }
      event(s, PLAYER, `A story goes round that sets ${x.name} and ${y.name} against each other.`, "Plant a rumor");
      const pl = plotOf(s, x.id);
      if (pl && pl.members.includes(y.id)) {
        const weaker = memberWeight(s, x.id, pl) <= memberWeight(s, y.id, pl) ? x : y;
        leaveAllPlots(s, weaker.id, "the rumor split the plotters");
        event(s, PLAYER, `${capital(weaker.name)} no longer trusts his fellow plotters.`, "your rumor", pl.known.includes(weaker.id));
      }
      if (x.political) { x.infl -= 1; event(s, x.id, `${capital(x.name)}'s standing suffers.`, "your rumor"); }
    },
  },
  turnInformer: {
    target: (s) => people(s, inCity),
    check: (s) => (s.silver < 1 ? "needs 1 silver" : null),
    odds: (s, a) => {
      const p = s.people[a.target!];
      const m: Mod[] = [];
      if (p.opinion >= 1) m.push({ label: "he likes you", value: 1 });
      if (p.opinion <= -2) m.push({ label: "he hates you", value: -1 });
      return [...m, ...traitMods(s, PLAYER, a.target, "turnInformer")];
    },
    run: (s, a, ok) => {
      const p = s.people[a.target!];
      silver(s, -1, "an informer's fee");
      if (ok) {
        p.informer = true;
        event(s, PLAYER, `${capital(p.name)} agrees to tell you what he hears.`, "Turn an informer");
        const pl = plotOf(s, p.id);
        if (pl) { pl.informer = p.id; pl.known = [...pl.members]; event(s, PLAYER, `He is in a plot against you, and names everyone in it.`, "your informer"); gainLeverage(s, PLAYER, pl.leader, "your informer"); }
      } else {
        event(s, PLAYER, `${capital(p.name)} takes offence at your offer.`, "Turn an informer failed");
        opinion(s, p.id, -1, "you tried to buy him");
      }
    },
  },
  forceFavor: {
    target: (s) => people(s, (p) => leverageOver(s, PLAYER, p.id) > 0),
    run: (s, a) => {
      const p = s.people[a.target!];
      spendLeverage(s, PLAYER, p.id);
      const f = factionOf(s, p.id);
      event(s, PLAYER, `You remind ${p.name} what you know. He speaks for you.`, "Force a favor");
      if (f) { mood(s, f, 1, `${p.name} spoke for you`); s.flags[`vote_${f}`] = 1; }
    },
  },
  block: {
    target: (s) => people(s, (p) => leverageOver(s, PLAYER, p.id) > 0),
    run: (s, a) => {
      const p = s.people[a.target!];
      spendLeverage(s, PLAYER, p.id);
      p.blockedUntil = s.season + 1;
      const f = factionOf(s, p.id);
      if (f && leaderOf(s, f)?.id === p.id) s.flags[`blockAgenda_${f}`] = s.season + 1;
      event(s, PLAYER, `You make it clear to ${p.name} that he should do nothing for now.`, "Block");
    },
  },
  expose: {
    target: (s) => people(s, (p) => leverageOver(s, PLAYER, p.id) > 0),
    run: (s, a) => {
      const p = s.people[a.target!];
      spendLeverage(s, PLAYER, p.id);
      p.infl -= 2;
      event(s, PLAYER, `You make ${p.name}'s secret public.`, "Expose");
      grudge(s, p.id, "you exposed his secret");
      const pl = plotOf(s, p.id);
      if (pl) { pl.known = Array.from(new Set([...pl.known, p.id, pl.leader])); }
      if (p.political) politicalRank(s, p.id, -1, "exposed, he grows careful");
    },
  },

  envoy: {
    check: (s) => (s.silver < 1 ? "needs 1 silver" : null),
    odds: (s) => {
      const m = traitMods(s, PLAYER, undefined, "envoy");
      if (s.flags.raidYear === Math.floor(s.season / 4) + 1) m.push({ label: "you raided Carthage's towns this year", value: -2 });
      return m;
    },
    run: (s, _a, ok) => {
      silver(s, -1, "gifts for Carthage");
      event(s, PLAYER, ok ? "Your envoy is heard in Carthage." : "Your envoy comes back with nothing.", "Envoy to Carthage");
      if (ok) clock(s, -1, "a good embassy");
    },
  },
  buyGrain: {
    check: (s) => (s.silver < 1 ? "needs 1 silver" : null),
    run: (s) => { silver(s, -1, "grain bought abroad"); event(s, PLAYER, "Grain ships come in from abroad.", "Buy grain abroad"); grain(s, 2, "bought abroad"); },
  },
  offerTerms: {
    target: (s) => people(s, (p) => p.status === "outside"),
    odds: (s, a) => {
      const p = s.people[a.target!];
      const m = traitMods(s, PLAYER, a.target, "offerTerms");
      if (p.grudges.length) m.push({ label: "he holds a grudge", value: -1 });
      return m;
    },
    run: (s, a, ok) => {
      const p = s.people[a.target!];
      if (ok) {
        event(s, p.id, `${capital(p.name)} accepts your terms and comes home.`, "Offer terms to exiles");
        setStatus(s, p.id, "free", "accepted terms");
        clearGrudge(s, p.id, "your terms");
        opinion(s, p.id, 1, "your terms");
        if (p.rival) rankChange(s, p.id, -1, "he accepted your terms");
        const f = factionOf(s, p.id);
        if (f) meetGoal(s, f, "offerTerms");
      } else {
        event(s, p.id, `${capital(p.name)} throws your terms back at you.`, "Offer terms failed");
        if (p.rival) rankChange(s, p.id, 1, "he refused your terms");
      }
    },
  },
};

function raider(s: GameState): { by: "fleet" | "army"; leader: string } | null {
  const f = s.offices.fleet;
  if (f && !(s.flags.fleetDamaged !== undefined && s.season - s.flags.fleetDamaged < 3)) {
    if (f === PLAYER) return { by: "fleet", leader: PLAYER };
    const p = s.people[f];
    if (p.status === "free" && p.opinion >= 0) return { by: "fleet", leader: f };
  }
  if (holds(s, PLAYER, "generalship")) return { by: "army", leader: PLAYER };
  return null;
}

export function vote(s: GameState, lawId: string) {
  const law = lawById(lawId)!;
  const forF: FactionId[] = [], againstF: FactionId[] = [];
  for (const f of FACTIONS) {
    if (s.flags[`vote_${f}`] || law.for.includes(f)) forF.push(f);
    else if (law.against.includes(f)) againstF.push(f);
    else if (s.factions[f].mood >= 3) forF.push(f);
    else if (s.factions[f].mood <= 1) againstF.push(f);
  }
  const sum = (fs: FactionId[]) => fs.reduce((a, f) => a + power(s, f), 0);
  const diff = sum(forF) - sum(againstF);
  const weight = diff >= 0 ? Math.floor(diff / 3) : -Math.floor(-diff / 3);
  const mods: Mod[] = [{ label: `the assembly's weight (${sum(forF)} for, ${sum(againstF)} against)`, value: weight }, ...traitMods(s, PLAYER, undefined, "proposeLaw")];
  if (holds(s, PLAYER, "assembly")) mods.push({ label: "you hold the assembly", value: 1 });
  return { forF, againstF, mods };
}

export function politicalType(p: Person): string {
  return (p as any).politicalType ?? DATA.people.find((x) => x.id === p.id)?.politicalType ?? DATA.politicalTypeByFaction[p.faction] ?? "Climber";
}
export function politicalRank(s: GameState, pid: string, d: number, why: string) {
  const p = s.people[pid];
  if (!p.political) return;
  const r = Math.max(0, Math.min(3, p.political.rank + d));
  if (r === p.political.rank) return;
  if (r === 0) { p.political = undefined; event(s, pid, `${capital(p.name)} is no longer a political rival.`, why); return; }
  const up = r > p.political.rank;
  p.political.rank = r;
  const title = DATA.politicalRanks.find((x: any) => x.rank === r)!.title;
  event(s, pid, `${capital(p.name)} ${up ? "rises" : "falls"} to ${title}.`, why);
  if (r === 3 && !p.agenda?.id.startsWith("takePlace")) {
    p.agenda = { id: "takePlace", step: 0, done: false };
    s.counters.pretenders = (s.counters.pretenders ?? 0) + 1;
    event(s, pid, `${capital(p.name)} is now a Pretender, and works in the open to take your place.`, why);
  }
}

// Requests (petitions to you). Refusing in public stings; the second refusal makes a grudge and a rival.
export function refuse(s: GameState, id: string, quiet = false) {
  const r = s.requests.find((x) => x.id === id);
  if (!r) return;
  s.requests = s.requests.filter((x) => x.id !== id);
  const p = s.people[r.from];
  event(s, p.id, quiet ? `${capital(p.name)}'s petition goes unanswered.` : `You refuse ${p.name}'s petition.`, "Refuse");
  if (r.kind === "citizenship") { s.flags.guardRefused = (s.flags.guardRefused ?? 0) + 1; mood(s, "guard", -1, "you refused them citizenship"); return; }
  p.infl -= 1;
  opinion(s, p.id, -1, "you refused his petition");
  p.refusals += 1;
  if (p.refusals >= 2 || r.owed || r.agendaStep) {
    p.refusals = 0;
    grudge(s, p.id, r.office ? `you refused him ${officeName(r.office)}` : "you refused his petitions");
    makeRival(s, p.id, "Humiliated", r.office ? `you refused him ${officeName(r.office)}` : "you refused him");
    if (r.agendaStep && p.agenda) { p.agenda.done = true; p.agenda.result = "refused"; }
  }
}

export interface MenuItem {
  id: string; name: string; area: string; cost: string; roll: string; success: string; failure?: string; ruler?: boolean; reach?: boolean;
  targets?: Option[]; secondLabel?: string; blocked: string | null;
}
export function menu(s: GameState): MenuItem[] {
  return DATA.actions.filter((a) => !a.aiOnly).map((a) => {
    const impl = IMPL[a.id];
    const targets = impl.target?.(s);
    let blocked: string | null = null;
    if (s.step !== "player" || s.over) blocked = "not your turn";
    else if (s.slots < 1) blocked = "no actions left this season";
    else if (targets && targets.length === 0) blocked = "no one to choose";
    else if (!impl.target && impl.check) blocked = impl.check(s, {});
    if (!blocked && s.building && a.id !== "build" && false) blocked = null;
    return { id: a.id, name: a.name, area: a.area, cost: a.cost, roll: a.roll, success: a.success, failure: a.failure, ruler: a.ruler, reach: a.reach,
      targets, secondLabel: impl.secondLabel, blocked };
  });
}
export function secondOptions(s: GameState, action: string, args: Args): Option[] {
  return IMPL[action]?.second?.(s, args) ?? [];
}

// What the player sees before choosing: the target number and every modifier.
export function preview(s: GameState, action: string, args: Args): { ok: boolean; why?: string; auto: boolean; need: number; mods: Mod[]; chance?: number } {
  const impl = IMPL[action];
  if (!impl) return { ok: false, why: "unknown action", auto: true, need: 4, mods: [] };
  const why = validate(s, action, args);
  if (why) return { ok: false, why, auto: true, need: 4, mods: [] };
  const mods = impl.odds?.(s, args) ?? null;
  if (mods === null) return { ok: true, auto: true, need: 4, mods: [] };
  const need = impl.need ?? 4;
  const sum = mods.reduce((a, m) => a + m.value, 0);
  const chance = [1, 2, 3, 4, 5, 6].filter((d) => d + sum >= need).length / 6;
  return { ok: true, auto: false, need, mods, chance };
}

export function validate(s: GameState, action: string, args: Args): string | null {
  const impl = IMPL[action];
  const def = actionById(action);
  if (!impl || !def || def.aiOnly) return "unknown action";
  if (s.over) return "the game is over";
  if (s.step !== "player") return "not your turn";
  if (s.slots < 1) return "no actions left this season";
  if (impl.target) {
    const opts = impl.target(s);
    if (!args.target || !opts.some((o) => o.value === args.target)) return "choose a target";
  }
  if (impl.second) {
    const opts = impl.second(s, args);
    if (!args.second || !opts.some((o) => o.value === args.second)) return `choose ${impl.secondLabel?.toLowerCase() ?? "an option"}`;
  }
  return impl.check?.(s, args) ?? null;
}

export function perform(s: GameState, action: string, args: Args): { ok: boolean; error?: string } {
  const why = validate(s, action, args);
  if (why) return { ok: false, error: why };
  const impl = IMPL[action];
  s.inputs.push({ t: "act", action, args: { ...args } });
  s.slots -= 1;
  const mods = impl.odds?.(s, args) ?? null;
  const name = actionById(action)!.name;
  if (mods === null) { impl.run(s, args, true, 0); return { ok: true }; }
  const r = roll(s, PLAYER, name, mods, impl.need ?? 4);
  impl.run(s, args, r.ok, r.die);
  return { ok: true };
}

export { band, defense, influence };
