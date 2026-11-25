// Switch "exile" (Fallen, not finished; off by default; island games only): losing Syracuse is the middle of the
// story, not its end. When you are deposed, driven out by a plot, or Carthage takes the city, you flee to a refuge
// with a few loyal men and what silver you can carry, and someone else rules. While you are in exile the game's
// state still describes the city, now under its new ruler: its treasury, grain, offices and factions. Your own
// purse, men and followers live in s.exile. The factions' mood is still their mood toward you (how much they long
// for you); their mood toward the ruler is kept beside it. The ruler acts each season from a fixed list, with a
// reason; his men can hunt you, with warnings before they strike. You strike for the city when the odds are good
// enough, and every modifier is shown first. Numbers and texts are in data/exile.json; the sourced pattern
// (Hermocrates, the exiles at Aetna, Dion) is in docs/research/exile.md. Every rule here is invention.
import { vary } from "./vary.ts";
import { isPronoun, pronoun } from "./pronouns.ts";
import exileJson from "../../data/exile.json" with { type: "json" };
import { DATA } from "./data.ts";
import { d6 } from "./rng.ts";
import { PLAYER, alive, capital, leaderOf, moodName, nameOf, officesOf, others, plotOf, power } from "./state.ts";
import { clock, event, grain, guardSet, log, makeRival, mood, opinion, setOffice, setStatus } from "./ops.ts";
import { on } from "./switches.ts";
import { chapter } from "./feud.ts";
import { carthageArmy, carthagePersonName, city, cityWalls, islandWorld, loseMen, nodeName, path, setSide, NODES } from "./island.ts";
import { carthageStep } from "./carthage.ts";
import { censusSeason } from "./census-game.ts";
import { drawExileEvents, fireNow } from "./events.ts";
import type { Args, FactionId, GameState, Mod, OfficeId, Person } from "./types.ts";
import { FACTIONS, OFFICES } from "./types.ts";

export const EXILE = exileJson as any;
const K = () => EXILE.knobs as Record<string, number>;
const T = () => EXILE.texts as Record<string, string>;

export interface Ruler { kind: "person" | "carthage" | "assembly"; id?: string; name: string; hold: number; since: number }
export interface ExileState {
  active: boolean;
  count: number; // times you have gone into exile
  since: number; // the season this exile began
  how: string; // the fall's reason (deposed, exiled, fallen, fled)
  fall: string; // the fall's own words
  at: string; // the refuge's id (data/exile.json)
  ruler: Ruler;
  moods: Record<FactionId, number>; // the city's factions toward the ruler, 0 (Rebellious) to 4 (Loyal)
  silver: number; // your purse
  men: number; // hired companies with you
  followers: string[]; // people who came with you (status "outside", where "exile")
  sworn: string[]; // men inside the city sworn to you
  notice: number; // how much the ruler hears of you, 0 to 6
  hunt: { stage: number; since: number; named: number; dodged?: number; said?: number; saidAt?: string } | null; // men sent to find you; named: the season it reached Named; dodged: times lying low set it back
  arms: boolean; // arms bought for the citizens
  patrons: string[];
  promises: string[];
  tries: number; // failed strikes for the city in this exile
  away: number; // the season the ruler last took the field
  terms: number; // the season the ruler offered terms (-1 never)
  flags: Record<string, number>; // invited, sold, honoured: the season each happened
  wavering: string[]; // followers who were warned about last season
  acts: { season: number; id: string; text: string; why: string }[]; // the ruler's acts, for the UI
  returned?: number; // the season you came home
  end?: string; // how the exile ended (returned, settled, killed, decade)
  history: { from: number; to?: number; how: string; ruler: string; end?: string }[];
}

export const exileOn = (s: GameState) => !!s.island && on(s, "exile");
export const inExile = (s: GameState) => !!s.exile?.active;
export const refugeDef = (id: string) => (EXILE.refuges as any[]).find((r) => r.id === id);
export const refugeName = (s: GameState) => refugeDef(s.exile!.at)?.name ?? s.exile!.at;
export const patronDef = (id: string) => (EXILE.patrons as any[]).find((p) => p.id === id);
const sgn = (n: number) => (n > 0 ? `+${n}` : `${n}`);
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
export const companies = (n: number) => (n <= 0 ? "no hired men" : plural(n, "company of hired men", "companies of hired men"));
export const talents = (n: number) => plural(n, "talent", "talents");

// The ruler's name in a sentence ("the leader of the exiles at Aetna", "Carthage's garrison", "the assembly").
export function rulerName(s: GameState): string {
  const r = s.exile!.ruler;
  if (r.kind === "person" && r.id) return s.people[r.id]?.name ?? r.name;
  return r.name;
}
// {ruler} and {Ruler}, {refuge} and {Refuge}, and any extra words, filled into a text from the data.
export function words(s: GameState, text: string, extra: Record<string, string> = {}): string {
  const vars: Record<string, string> = { ruler: s.exile ? rulerName(s) : "", refuge: s.exile ? refugeName(s) : "", town: s.exile ? refugeDef(s.exile.at)?.short ?? refugeName(s) : "", ...extra };
  return text.replace(/\{([A-Za-z]+)(?::ruler)?\}/g, (m, key: string) => {
    if (m.endsWith(":ruler}") && isPronoun(key)) return pronoun(s, s.exile?.ruler.id, key); // {his:ruler}: his or her
    const k = key.charAt(0).toLowerCase() + key.slice(1);
    const v = vars[k];
    if (v === undefined) return m;
    return key[0] === key[0].toUpperCase() ? capital(v) : v;
  });
}
const say = (s: GameState, actor: string, text: string, why: string, visible = true) => event(s, actor, text, why, visible);

// ---------- Your purse, your men, how much he hears of you ----------
export function purse(s: GameState, d: number, why: string) {
  const x = s.exile!;
  if (!d) return;
  x.silver = Math.max(0, x.silver + d);
  log(s, { actor: PLAYER, text: `Your purse ${sgn(d)} (now ${talents(x.silver)}).`, why, visible: true, kind: "change" });
}
export function band(s: GameState, d: number, why: string) {
  const x = s.exile!;
  const before = x.men;
  x.men = Math.max(0, Math.min(K().maxMen, x.men + d));
  if (x.men !== before) log(s, { actor: PLAYER, text: `You have ${companies(x.men)}.`, why, visible: true, kind: "change" });
}
export function notice(s: GameState, d: number, why: string) {
  const x = s.exile!;
  const before = x.notice;
  x.notice = Math.max(0, Math.min(K().maxNotice, x.notice + d));
  if (x.notice !== before) log(s, { actor: "world", text: `${capital(rulerName(s))} hears ${x.notice > before ? "more" : "less"} of you (${x.notice} of ${K().maxNotice}).`, why, visible: false, kind: "change" });
}
export function rulerMood(s: GameState, f: FactionId, d: number, why: string, visible = true) {
  const x = s.exile!;
  const before = x.moods[f];
  x.moods[f] = Math.max(0, Math.min(4, before + d));
  if (x.moods[f] !== before) log(s, { actor: f, text: `${capital(s.factions[f].short)} ${x.moods[f] > before ? "warm" : "sour"} toward ${rulerName(s)} (${moodName(x.moods[f])}).`, why, visible, kind: "change" });
}
function hold(s: GameState, d: number, why: string) {
  const r = s.exile!.ruler;
  const before = r.hold;
  r.hold = Math.max(0, Math.min(K().maxHold, r.hold + d));
  if (r.hold !== before) log(s, { actor: "world", text: `${capital(rulerName(s))}'s grip on Syracuse ${r.hold > before ? "tightens" : "loosens"} (${r.hold} of ${K().maxHold}).`, why, visible: true, kind: "change" });
}

// ---------- Refuges ----------
export function refugeOpen(s: GameState, def: any): boolean {
  for (const n of def.needs ?? []) {
    if (n === "free" && (!def.node || city(s, def.node).side !== "free" || city(s, def.node).lean < -1)) return false;
    if (n === "peace" && s.island!.war) return false;
  }
  return true;
}
export const openRefuges = (s: GameState) => (EXILE.refuges as any[]).filter((r) => refugeOpen(s, r));
function arrive(s: GameState, def: any, why: string) {
  s.exile!.at = def.id;
  for (const [f, d] of Object.entries(def.onArrive ?? {})) mood(s, f as FactionId, d as number, `you went to ${def.name}`);
  void why;
}

// ---------- Falling: from ruler to exile ----------
const FALLS = () => EXILE.falls as string[];

// Called when a game would end. If it is a fall and the switch is on, the game goes on in exile. Returns true when
// it turned the end into something else (an exile, or a change of ruler while you are already in exile).
export function maybeExile(s: GameState): boolean {
  if (!s.over || !exileOn(s)) return false;
  if (inExile(s)) {
    if (s.over.reason === "fallen") { toCarthage(s); return true; } // Carthage took the city from the ruler, not from you
    return false;
  }
  if (!FALLS().includes(s.over.reason)) return false;
  beginExile(s);
  return true;
}

function pickRuler(s: GameState, how: string, by: string | undefined): { kind: Ruler["kind"]; id?: string } {
  if (how === "fallen") return { kind: "carthage" };
  if (by && s.people[by] && alive(s.people[by]) && s.people[by].status !== "held") return { kind: "person", id: by };
  // You fled: the leader of the strongest faction takes the city, or failing anyone, the assembly.
  const ranked = [...FACTIONS].filter((f) => f !== "family").sort((a, b) => power(s, b) - power(s, a));
  for (const f of ranked) { const l = leaderOf(s, f); if (l && l.status === "free") return { kind: "person", id: l.id }; }
  return { kind: "assembly" };
}

export function beginExile(s: GameState, opts: { refuge?: string } = {}) {
  const k = K();
  const over = s.over!;
  s.over = undefined;
  const isl = s.island!;
  const pr = pickRuler(s, over.reason, over.by);
  const winners = new Set<string>([...(over.by ? plotOf(s, over.by)?.members ?? [] : [])]);
  const prev = s.exile;
  const general = isl.carthage.general;
  const name = pr.kind === "carthage" ? `Carthage's garrison${general ? ` under ${carthagePersonName(s, general)}` : ""}` : pr.kind === "assembly" ? "the assembly" : s.people[pr.id!].name;
  const x: ExileState = {
    active: true, count: (prev?.count ?? 0) + 1, since: s.season, how: over.reason, fall: over.text, at: "rhegium",
    ruler: { kind: pr.kind, id: pr.id, name, hold: k.startHold, since: s.season },
    moods: { citizens: 2, rich: 2, guard: 2, family: 1 },
    silver: 0, men: k.startMen, followers: [], sworn: [], notice: 0, hunt: null, arms: false, patrons: [], promises: [], tries: 0,
    away: -1, terms: -1, flags: {}, wavering: [], acts: [], history: [...(prev?.history ?? []), { from: s.season, how: over.reason, ruler: name }],
  };
  s.exile = x;
  // The city's factions toward their new master.
  if (pr.kind === "person") {
    const p = s.people[pr.id!];
    if (FACTIONS.includes(p.faction as FactionId)) x.moods[p.faction as FactionId] = 4;
    const pl = plotOf(s, p.id);
    for (const f of pl?.backers ?? []) x.moods[f] = Math.max(x.moods[f], 3);
  } else if (pr.kind === "carthage") x.moods = { citizens: 1, rich: 1, guard: 1, family: 0 };
  else x.moods = { citizens: 3, rich: 2, guard: 2, family: 1 };
  // The plots are over: they won. Petitions, matters and the army's campaign end with your rule.
  for (const f of FACTIONS) s.factions[f].backing = undefined;
  s.plots = [];
  s.requests = [];
  s.watches = [];
  if (s.events) { s.events.open = []; s.events.queue = []; }
  s.campaign = undefined;
  for (const a of isl.armies.filter((a) => a.side === "syracuse")) {
    isl.armies = isl.armies.filter((b) => b !== a);
    say(s, "world", `Your army at ${nodeName(a.at)} goes home to the city's new master.`, "you no longer rule Syracuse");
  }
  // Who comes with you: kin and friends who think well of you (at most four), never the men who won.
  const cands = others(s).filter((p) => p.status === "free" && !winners.has(p.id) && p.id !== pr.id && !p.political
    && (p.opinion >= 2 || (p.faction === "family" && p.opinion >= 1)));
  cands.sort((a, b) => b.opinion - a.opinion || (a.faction === "family" ? -1 : 0) - (b.faction === "family" ? -1 : 0) || a.id.localeCompare(b.id));
  for (const p of cands.slice(0, k.maxFollowers)) {
    for (const o of officesOf(s, p.id)) setOffice(s, o, pr.kind === "person" ? pr.id! : null, `${p.name} followed you into exile`);
    setStatus(s, p.id, "outside", "followed you into exile");
    p.where = "exile";
    x.followers.push(p.id);
  }
  // Your offices go to the new ruler (or stand empty under Carthage or the assembly).
  for (const o of OFFICES) if (s.offices[o] === PLAYER) setOffice(s, o, pr.kind === "person" ? pr.id! : null, "you lost Syracuse");
  if (pr.kind === "person") {
    const p = s.people[pr.id!];
    if (p.status !== "free") { setStatus(s, p.id, "free", "now holds Syracuse"); p.where = undefined; }
    if (p.political) { p.political = undefined; log(s, { actor: p.id, text: `${capital(p.name)} no longer wants your place: it is taken.`, why: "now rules Syracuse", visible: false, kind: "change" }); }
    chapter(s, p, "usurped", "took Syracuse from you");
  }
  if (pr.kind === "carthage") setSide(s, "syracuse", "carthage", "Carthage took it");
  // What you carry: a third of the treasury, at least one talent if there is any.
  const carried = Math.min(s.silver, Math.max(1, Math.ceil(s.silver / k.carryShare)));
  s.silver -= carried;
  x.silver = carried;
  if (s.factions.guard.mood >= 3) x.men += 1; // some of the guard follow you
  x.men = Math.min(k.maxMen, x.men);
  s.people[PLAYER].where = "exile";
  // Where you go: the first refuge open to you, in the order the fall suggests.
  const order: string[] = (EXILE.fallTo[over.reason] ?? EXILE.fallTo.default) as string[];
  const def = (opts.refuge && refugeOpen(s, refugeDef(opts.refuge)) ? refugeDef(opts.refuge) : null) ?? order.map(refugeDef).find((r) => r && refugeOpen(s, r)) ?? refugeDef("rhegium");
  arrive(s, def, "where the fall took you");
  s.counters.exiles = (s.counters.exiles ?? 0) + 1;
  const fol = x.followers.map((id) => s.people[id].name);
  const folText = fol.length <= 1 ? fol.join("") : `${fol.slice(0, -1).join(", ")} and ${fol.at(-1)}`;
  say(s, PLAYER, words(s, fol.length ? T().fall : T().fallAlone, { followers: folText, silver: talents(carried), men: companies(x.men) }),
    "Fallen, not finished: a fall is the middle of a story");
}

// Switch "exileStart": the game opens in exile (the revolt of 404 comes early and succeeds).
export function beginFallen(s: GameState) {
  const d = EXILE.startFallen;
  s.over = { reason: d.reason, text: T().startFallen, season: s.season, by: d.ruler };
  event(s, d.ruler, T().startFallen, "Begin fallen: the revolt of 404 succeeds (in the sources it failed, Diodorus 14.8 to 14.9)");
  beginExile(s, { refuge: d.refuge });
}

// While you are in exile, Carthage takes Syracuse from its ruler.
function toCarthage(s: GameState) {
  const x = s.exile!;
  s.over = undefined;
  if (x.ruler.kind === "carthage") return;
  say(s, "carthage", words(s, T().toCarthage), "the city fell while you were in exile");
  if (x.ruler.kind === "person" && x.ruler.id) {
    const p = s.people[x.ruler.id];
    for (const o of officesOf(s, p.id)) setOffice(s, o, null, "Carthage holds the city");
    if (p.status === "free") setStatus(s, p.id, "outside", "fled when Carthage took the city");
  }
  const g = s.island!.carthage.general;
  x.ruler = { kind: "carthage", name: `Carthage's garrison${g ? ` under ${carthagePersonName(s, g)}` : ""}`, hold: K().startHold, since: s.season };
  x.moods = { citizens: 1, rich: 1, guard: 1, family: 0 };
  x.terms = -1; x.away = -1;
  setSide(s, "syracuse", "carthage", "Carthage took it");
}

// ---------- A season in exile ----------
// The city goes on without you: rations and harvest, Carthage's anger, the island's armies, the families. Any
// change these make to the factions' mood is a change in their mood toward the ruler, not toward you, and the
// city's own bookkeeping is kept out of your chronicle (the designer view still shows it).
function cityRuns(s: GameState, fn: () => void) {
  const before = FACTIONS.map((f) => s.factions[f].mood);
  const n0 = s.log.length;
  fn();
  const shifts: [FactionId, number][] = [];
  FACTIONS.forEach((f, i) => { const d = s.factions[f].mood - before[i]; if (d) { s.factions[f].mood = before[i]; shifts.push([f, d]); } });
  for (const e of s.log.slice(n0)) if (!(e.actor === "carthage" || (e.kind === "event" && e.actor === "world"))) e.visible = false;
  for (const [f, d] of shifts) rulerMood(s, f, d, "what happened in the city this season", false);
  if (s.over?.reason === "fallen") toCarthage(s);
}

export function exileBeginSeason(s: GameState) {
  const x = s.exile!;
  s.step = "world";
  s.slots = DATA.start.actionsPerSeason;
  s.watches = [];
  for (const p of Object.values(s.people)) {
    if (p.status === "absent" && p.enters <= s.season) {
      p.status = (p as any).startStatus ?? "free";
      event(s, p.id, `${capital(p.name)} enters the story.`, "a new figure in Syracuse");
    }
  }
  const q = s.season % 4;
  cityRuns(s, () => {
    grain(s, s.granary ? -1 : -2, "a season's rations in the city");
    if (q === 3) grain(s, 6, "the summer harvest");
    if (q === 3) clock(s, 1, "a year passes and Carthage rebuilds");
    islandWorld(s);
  });
  if (s.over) return;
  if (s.census) censusSeason(s);
  s.step = "people";
  rulerStep(s);
  huntAdvance(s);
  drawExileEvents(s);
  if (s.over) return;
  s.step = "factions";
  cityRuns(s, () => carthageStep(s));
  if (s.over) return;
  s.step = "player";
  if (s.blockedSlots) { s.slots = Math.max(0, s.slots - s.blockedSlots); s.blockedSlots = 0; }
  void x;
}

export function exileEndSeason(s: GameState) {
  const x = s.exile!;
  const k = K();
  s.step = "sword";
  huntStrike(s);
  if (s.over || !inExile(s)) return;
  // Hired men beyond the first two cost silver; unpaid, they drift away.
  const cost = Math.ceil(Math.max(0, x.men - k.freeMen) / k.upkeepPer);
  if (cost) {
    if (x.silver >= cost) purse(s, -cost, "pay for your hired men");
    else { say(s, PLAYER, T().upkeepShort, `they cost ${talents(cost)} a season and your purse holds ${talents(x.silver)}`); band(s, -1, "unpaid"); }
  }
  followersSeason(s);
  // The ruler's grip: a seething faction or Carthage at the gates loosens it.
  if (FACTIONS.some((f) => x.moods[f] === 0)) hold(s, -1, `${FACTIONS.filter((f) => x.moods[f] === 0).map((f) => s.factions[f].short).join(" and ")} are Rebellious against the ruler`);
  const ca = carthageArmy(s);
  if (x.ruler.kind !== "carthage" && ca?.siege === "syracuse") hold(s, -1, "Carthage besieges the city");
  revolt(s);
  notice(s, -(refugeDef(x.at)?.fade ?? k.noticeFade), "time passes, and the city talks of other things");
}

// ---------- The ruler's season ----------
interface ActCheck { ok: (s: GameState) => boolean; run: (s: GameState, def: any) => void }
const rulerPerson = (s: GameState) => s.exile!.ruler.kind === "person" && !!s.exile!.ruler.id && s.people[s.exile!.ruler.id!]?.status === "free";
function lowestMood(s: GameState): FactionId | undefined {
  const x = s.exile!;
  const low = FACTIONS.filter((f) => x.moods[f] <= 1).sort((a, b) => x.moods[a] - x.moods[b] || FACTIONS.indexOf(a) - FACTIONS.indexOf(b));
  return low[0];
}
function rulerLog(s: GameState, def: any, text: string, why: string, visible = true) {
  s.exile!.acts.push({ season: s.season, id: def.id, text, why });
  say(s, s.exile!.ruler.id ?? "world", text, why, visible);
}
const ACTS: Record<string, ActCheck> = {
  hunt: {
    ok: (s) => !s.exile!.hunt && (s.exile!.notice >= K().huntNotice || s.exile!.men >= K().huntMen),
    run: (s, def) => { s.counters.exileHuntsBegun = (s.counters.exileHuntsBegun ?? 0) + 1; s.exile!.hunt = { stage: 1, since: s.season, named: -1 }; rulerLog(s, def, words(s, def.text), def.why, false); },
  },
  purge: {
    ok: (s) => s.exile!.sworn.some((id) => s.people[id]?.status === "free") && s.exile!.notice >= 2,
    run: (s, def) => {
      const x = s.exile!;
      const id = x.sworn.find((m) => s.people[m]?.status === "free")!;
      const die = d6(s);
      const total = die + Math.floor(x.notice / 2);
      log(s, { actor: x.ruler.id ?? "world", text: `${capital(rulerName(s))} searches for your friends: rolled ${die} + ${Math.floor(x.notice / 2)} for what is heard of you = ${total}, needs ${K().purgeNeed}.`, visible: false, kind: "roll", roll: { die, mods: [{ label: "what is heard of you", value: Math.floor(x.notice / 2) }], total, need: K().purgeNeed, ok: total >= K().purgeNeed } });
      if (total < K().purgeNeed) { x.acts.push({ season: s.season, id: def.id, text: `${capital(rulerName(s))} searched for your friends and found no one.`, why: def.why }); return; }
      x.sworn = x.sworn.filter((m) => m !== id);
      // The first seizure says "Your letters were found."; later ones vary the second sentence (data/exile.json purgeAgain).
      const n = (s.counters.exileFriendsSeized = (s.counters.exileFriendsSeized ?? 0) + 1);
      const text = n === 1 ? def.text : def.text.replace("Your letters were found.", vary(s, "purge", EXILE.purgeAgain as string[]));
      rulerLog(s, def, words(s, text, { friend: s.people[id].name }), words(s, def.why));
      setStatus(s, id, x.ruler.kind === "carthage" ? "dead" : "held", "seized for your letters");
    },
  },
  court: {
    ok: (s) => s.exile!.ruler.kind !== "carthage" && !!lowestMood(s),
    run: (s, def) => {
      const f = lowestMood(s)!;
      const m = moodName(s.exile!.moods[f]);
      rulerLog(s, def, words(s, def.text, { faction: s.factions[f].short }), words(s, def.why, { mood: m }));
      rulerMood(s, f, 1, "gifts from the treasury");
      if (s.silver > 0) s.silver -= 1;
    },
  },
  field: {
    ok: (s) => rulerPerson(s) && s.island!.war && !!carthageArmy(s) && carthageArmy(s)!.siege !== "syracuse" && carthageArmy(s)!.at !== "syracuse" && s.season - s.exile!.away >= K().fieldEvery,
    run: (s, def) => { s.exile!.away = s.season; rulerLog(s, def, words(s, def.text), def.why); },
  },
  terms: {
    ok: (s) => rulerPerson(s) && s.exile!.terms < 0 && s.season - s.exile!.since >= K().termsAfter,
    run: (s, def) => {
      s.exile!.terms = s.season;
      rulerLog(s, def, words(s, def.text), def.why);
      fireNow(s, "exileTerms", { ruler: s.exile!.ruler.id! });
    },
  },
  tighten: {
    ok: (s) => s.exile!.ruler.hold < K().maxHold,
    run: (s, def) => { rulerLog(s, def, words(s, def.text), def.why); hold(s, 1, def.name.toLowerCase()); },
  },
  games: {
    ok: (s) => s.exile!.ruler.kind !== "carthage" && s.exile!.moods.citizens < 4,
    run: (s, def) => { rulerLog(s, def, words(s, def.text), def.why); rulerMood(s, "citizens", 1, "grain and games"); },
  },
};
// What the ruler would do next, in order, for the UI (the visible goal of a bot, like Carthage's agenda).
export function rulerAgenda(s: GameState): { id: string; name: string; ready: boolean }[] {
  return (EXILE.rulerActs as any[]).map((a) => ({ id: a.id, name: a.name, ready: !!ACTS[a.id]?.ok(s) }));
}
function rulerStep(s: GameState) {
  for (const def of EXILE.rulerActs as any[]) {
    const a = ACTS[def.id];
    if (!a?.ok(s)) continue;
    a.run(s, def);
    return;
  }
}

// The city rises against its ruler: if it longs for you, your friends send for you; if not, another man takes it.
function revolt(s: GameState) {
  const x = s.exile!;
  const rebels = FACTIONS.filter((f) => x.moods[f] === 0);
  if (!(rebels.length >= 2 || (x.moods.citizens === 0 && x.ruler.hold === 0))) return;
  if (s.factions.citizens.mood >= 3 || x.ruler.kind === "carthage") {
    if (x.flags.sentFor !== undefined && s.season - x.flags.sentFor < 4) return;
    if (!s.factions.citizens.mood || s.factions.citizens.mood < 2) return;
    x.flags.sentFor = s.season;
    fireNow(s, "exileSendFor", {});
    return;
  }
  const lead = rebels.filter((f) => f !== "family").sort((a, b) => power(s, b) - power(s, a)).map((f) => leaderOf(s, f)).find((p) => p && p.status === "free" && p.id !== x.ruler.id && !x.followers.includes(p.id));
  if (!lead) return;
  const old = rulerName(s);
  if (x.ruler.kind === "person" && x.ruler.id) {
    const p = s.people[x.ruler.id];
    for (const o of officesOf(s, p.id)) setOffice(s, o, lead.id, `${p.name} was driven out`);
    if (p.status === "free") setStatus(s, p.id, "outside", "driven out by the city");
  }
  x.ruler = { kind: "person", id: lead.id, name: lead.name, hold: 1, since: s.season };
  x.moods = { citizens: 2, rich: 2, guard: 2, family: 1 };
  if (FACTIONS.includes(lead.faction as FactionId)) x.moods[lead.faction as FactionId] = 4;
  x.terms = -1;
  if (x.hunt) x.hunt = null;
  s.counters.exileRevolts = (s.counters.exileRevolts ?? 0) + 1;
  say(s, lead.id, words(s, T().revolt, { old }), `${rebels.map((f) => s.factions[f].short).join(" and ")} rose against ${old}`);
}

// ---------- The hunt: the sword over the exile, with warnings before the blow ----------
function huntAdvance(s: GameState) {
  const x = s.exile!;
  const h = x.hunt;
  if (!h) return;
  if (h.since < s.season && h.stage < 3 && x.notice >= K().huntPace) h.stage += 1;
  if (h.stage === 3 && h.named < 0) h.named = s.season;
  // Said in full when the hunt reaches a new stage or finds you at a new refuge; in the seasons between, a shorter
  // line from data/exile.json keeps the warning in view without repeating it word for word (council 2026-11-25).
  const fresh = h.said !== h.stage || h.saidAt !== x.at;
  const line = fresh ? (EXILE.hunt as string[])[h.stage - 1] : vary(s, "hunt", (EXILE.huntQuiet as string[][])[h.stage - 1]);
  h.said = h.stage; h.saidAt = x.at;
  log(s, { actor: "world", text: words(s, line), why: fresh ? "the ruler's men hunt you" : "the ruler's men hunt you, as before", visible: true, kind: "warning" });
}
export function huntMods(s: GameState): { theirs: Mod[]; yours: Mod[] } {
  const x = s.exile!;
  const k = K();
  const theirs: Mod[] = [{ label: "the ruler's killers", value: k.huntBase }];
  if (x.notice >= k.huntLoud) theirs.push({ label: "the whole city talks of you", value: 1 });
  if (x.flags.sold !== undefined && s.season - x.flags.sold <= 2) theirs.push({ label: "a follower who left told them where you sleep", value: 1 });
  const def = refugeDef(x.at);
  const yours: Mod[] = [{ label: `the safety of ${def?.short ?? x.at}`, value: def?.safety ?? 1 }];
  if (x.men) yours.push({ label: "your hired men", value: Math.min(2, x.men) });
  if (x.followers.length) yours.push({ label: "your followers keep watch", value: 1 });
  return { theirs, yours };
}
// The chance a strike now would wound or kill you (they roll one die and must beat your guard).
export function huntForecast(s: GameState) {
  const { theirs, yours } = huntMods(s);
  const a = theirs.reduce((t, m) => t + m.value, 0), g = yours.reduce((t, m) => t + m.value, 0);
  const w = K().woundMargin;
  const margins = [1, 2, 3, 4, 5, 6].map((d) => d + a - g);
  const shield = shieldOf(s);
  return { theirs, yours, guard: g, wound: margins.filter((m) => m >= 1 && m <= w).length / 6, kill: margins.filter((m) => m > w).length / 6, shield: shield ? s.people[shield].name : undefined, ready: !!s.exile!.hunt && s.exile!.hunt.stage === 3 && s.exile!.hunt.named >= 0 && s.exile!.hunt.named <= s.season };
}
const shieldOf = (s: GameState) => [...s.exile!.followers].sort((a, b) => s.people[b].opinion - s.people[a].opinion || a.localeCompare(b))[0];
function huntStrike(s: GameState) {
  const x = s.exile!;
  const h = x.hunt;
  if (!h || h.stage < 3 || h.named < 0 || h.named >= s.season) return;
  const { theirs, yours } = huntMods(s);
  const g = yours.reduce((t, m) => t + m.value, 0);
  const die = d6(s);
  const total = die + theirs.reduce((t, m) => t + m.value, 0);
  s.counters.exileHunts = (s.counters.exileHunts ?? 0) + 1;
  log(s, { actor: x.ruler.id ?? "world", text: `The hunters strike: rolled ${die}${theirs.map((m) => ` +${m.value} ${m.label}`).join("")} = ${total}, against your guard of ${g} (${yours.map((m) => `${m.value} ${m.label}`).join(", ")}). They must beat it.`, visible: true, kind: "roll", roll: { die, mods: theirs, total, need: g + 1, ok: total > g } });
  x.hunt = null;
  const margin = total - g;
  if (margin <= 0) {
    say(s, PLAYER, words(s, T().huntFailed), "your guard held");
    if (x.ruler.kind !== "carthage") rulerMood(s, "citizens", -1, "killers sent after a man in exile");
    return;
  }
  if (margin <= K().woundMargin) {
    const sh = shieldOf(s);
    s.counters.exileWounds = (s.counters.exileWounds ?? 0) + 1;
    say(s, PLAYER, words(s, T().huntWounded, { shield: sh ? `, because ${s.people[sh].name} took the blade meant for you` : "" }), `the strike beat your guard by ${margin}; it takes ${K().woundMargin + 1} or more to kill you`);
    s.blockedSlots += 1;
    if (sh) { x.followers = x.followers.filter((f) => f !== sh); setStatus(s, sh, "dead", "killed shielding you from the hunters"); }
    return;
  }
  s.counters.exileHuntKills = (s.counters.exileHuntKills ?? 0) + 1;
  s.over = { reason: "killed", text: words(s, T().huntKilled), season: s.season, by: x.ruler.id };
  endRecord(s, "killed");
  event(s, x.ruler.id ?? "world", s.over.text, `the strike beat your guard by ${margin}`);
}

// ---------- Followers ----------
function followersSeason(s: GameState) {
  const x = s.exile!;
  const yearEnd = (s.season - x.since) % 4 === 3;
  const hope = x.sworn.length >= 1 || x.men >= 3;
  for (const id of x.followers.slice()) {
    const p = s.people[id];
    if (!p || p.status === "dead") { x.followers = x.followers.filter((f) => f !== id); continue; }
    if (yearEnd && !hope) opinion(s, id, -1, "a year of exile, and nothing to show for it");
    if (p.opinion > 0) { x.wavering = x.wavering.filter((w) => w !== id); continue; }
    if (!x.wavering.includes(id)) { x.wavering.push(id); log(s, { actor: id, text: words(s, T().wavering, { name: p.name }), why: `opinion of you has fallen to ${p.opinion}`, visible: true, kind: "warning" }); continue; }
    x.wavering = x.wavering.filter((w) => w !== id);
    x.followers = x.followers.filter((f) => f !== id);
    p.where = undefined;
    say(s, id, words(s, T().deserts, { name: p.name }), "warned last season, and still no hope");
    setStatus(s, id, "free", "came home under the new ruler");
    x.flags.sold = s.season;
    notice(s, 2, `${p.name} told what is known of you`);
  }
}

// ---------- Striking for the city ----------
const soldier = (p: Person) => p.faction === "guard" || p.traits.includes("brave") || p.traits.includes("bold");
const swornValue = (s: GameState, id: string) => (s.offices.citadel === id || s.people[id].faction === "guard" ? 2 : 1);
export function returnMods(s: GameState): Mod[] {
  const x = s.exile!;
  const k = K();
  const m: Mod[] = [];
  if (x.men) m.push({ label: `your hired men (${companies(x.men)})`, value: Math.min(Math.ceil(x.men / 2), k.maxMenOnReturn) });
  const sworn = x.sworn.filter((id) => s.people[id]?.status === "free");
  if (sworn.length) m.push({ label: sworn.length === 1 ? `${s.people[sworn[0]].name}, sworn to you inside` : "men sworn to you inside", value: Math.min(k.maxSworn + 1, sworn.reduce((t, id) => t + swornValue(s, id), 0)) });
  for (const f of FACTIONS) if (s.factions[f].mood >= 3 && x.moods[f] <= 1) m.push({ label: `${s.factions[f].short} rise for you`, value: 1 });
  if (x.arms && s.factions.citizens.mood >= 2) m.push({ label: "arms for the citizens", value: k.armsBonus });
  if (x.away === s.season) m.push({ label: "the ruler is away in the field", value: k.awayBonus });
  if (x.flags.invited === s.season) m.push({ label: "your friends hold a gate", value: k.invitedBonus });
  const fighter = x.followers.find((id) => soldier(s.people[id]));
  if (fighter) m.push({ label: `${s.people[fighter].name} fights beside you`, value: 1 });
  m.push({ label: "the walls of Syracuse", value: -cityWalls(s, "syracuse") });
  if (x.ruler.kind === "carthage") m.push({ label: "the Carthaginian garrison", value: -3 });
  else if (x.moods.guard >= 2) m.push({ label: "the ruler's guard", value: -Math.ceil(s.guard.strength / 2) });
  const ca = carthageArmy(s);
  if (ca && ca.at === "syracuse" && !ca.siege) m.push({ label: "Carthage's army in the city", value: -Math.min(3, ca.men) });
  if (x.ruler.hold) m.push({ label: "the ruler's grip on the city", value: -x.ruler.hold });
  const cross = refugeDef(x.at)?.crossing ?? 0;
  if (cross) m.push({ label: "a sea crossing that warns the city", value: cross });
  if (x.notice >= k.expected) m.push({ label: "the city expects you", value: -1 });
  if (x.ruler.kind !== "carthage" && ca?.siege === "syracuse") m.push({ label: "Carthage's siege holds the ruler's men on the walls", value: 1 });
  return m;
}
export function returnOdds(s: GameState) {
  const mods = returnMods(s);
  const k = K();
  const sum = mods.reduce((t, m) => t + m.value, 0);
  const tot = [1, 2, 3, 4, 5, 6].map((d) => d + sum);
  return { mods, need: k.returnNeed, win: tot.filter((t) => t >= k.returnNeed).length / 6, repulse: tot.filter((t) => t < k.returnNeed && t >= k.repulsedFrom).length / 6, die: tot.filter((t) => t < k.repulsedFrom).length / 6 };
}

function strikeHome(s: GameState, die: number) {
  const x = s.exile!;
  const k = K();
  const total = die + returnMods(s).reduce((t, m) => t + m.value, 0);
  s.counters.exileStrikes = (s.counters.exileStrikes ?? 0) + 1;
  if (total >= k.returnNeed) return comeHome(s, total - k.returnNeed);
  if (total >= k.repulsedFrom) {
    x.tries += 1;
    s.counters.exileRepulsed = (s.counters.exileRepulsed ?? 0) + 1;
    say(s, PLAYER, T().thrownBack, `the attack came to ${total}; it needed ${k.returnNeed}`);
    band(s, -Math.ceil(x.men / 2), "thrown back from the walls");
    mood(s, "citizens", -1, "they saw you fail");
    notice(s, k.maxNotice, "the whole city saw you come");
    if (!x.hunt) x.hunt = { stage: 1, since: s.season, named: -1 };
    const kin = x.followers.find((id) => s.people[id].faction === "family" && s.people[id].status === "outside");
    if (kin) fireNow(s, "exileReportedDead", { kin });
    return;
  }
  s.counters.exileDeaths = (s.counters.exileDeaths ?? 0) + 1;
  s.over = { reason: "killed", text: words(s, T().killed), season: s.season, by: x.ruler.id };
  endRecord(s, "killed");
  event(s, x.ruler.id ?? PLAYER, s.over.text, `the attack came to ${total}; below ${k.repulsedFrom} the attackers are cut down`);
}

function comeHome(s: GameState, margin: number) {
  const x = s.exile!;
  const k = K();
  const r = x.ruler;
  const bits: string[] = [];
  s.counters.exileReturns = (s.counters.exileReturns ?? 0) + 1;
  if (r.kind === "person" && r.id && s.people[r.id] && alive(s.people[r.id])) {
    const p = s.people[r.id];
    const f = FACTIONS.includes(p.faction as FactionId) ? (p.faction as FactionId) : undefined;
    for (const o of officesOf(s, p.id)) setOffice(s, o, PLAYER, "you took the city back");
    if (p.status === "free" && margin >= k.captureMargin) { bits.push(words(s, T().rulerTaken)); setStatus(s, p.id, "held", "taken when you came home"); }
    else if (p.status === "free") { bits.push(words(s, T().rulerFled)); setStatus(s, p.id, "outside", "fled when you came home"); makeRival(s, p.id, "Exiled", "you threw the ruler out of Syracuse"); }
    if (f) mood(s, f, -1, `you threw down ${p.name}, their man`);
  } else if (r.kind === "carthage") {
    bits.push(T().carthageOut);
    setSide(s, "syracuse", "syracuse", "you took it back from Carthage's garrison");
    const ca = carthageArmy(s);
    if (ca && ca.at === "syracuse") {
      loseMen(s, ca, 2, "cut down in the streets of Syracuse");
      if (s.island!.armies.includes(ca)) {
        const to = NODES.filter((n) => city(s, n.id).side === "carthage").map((n) => ({ id: n.id, d: path("syracuse", n.id)?.days.at(-1) ?? 99 })).sort((a, b) => a.d - b.d)[0];
        if (to) { ca.at = to.id; ca.siege = undefined; say(s, "carthage", `What is left of ${carthagePersonName(s, ca.commander)}'s army falls back to ${nodeName(to.id)}.`, "driven out of Syracuse"); }
      }
    }
  }
  for (const o of ["citadel", "generalship", "treasury"] as OfficeId[]) {
    const h = s.offices[o];
    if (o === "citadel" && !s.citadelBuilt) continue;
    if (!h || (h !== PLAYER && s.people[h]?.status !== "free")) setOffice(s, o, PLAYER, "you took the city back");
  }
  for (const id of x.followers) {
    const p = s.people[id];
    if (!p || p.status === "dead") continue;
    p.where = undefined;
    setStatus(s, id, "free", "came home with you");
    opinion(s, id, 1, "shared your exile");
  }
  for (const id of x.sworn) if (s.people[id]?.status === "free") opinion(s, id, 1, "opened the city to you");
  s.silver += x.silver;
  if (x.men >= 2) guardSet(s, "strength", 1, "your hired men join the guard");
  for (const pid of x.patrons) if (pid === "carthage") { clock(s, -2, "your promise of peace to Carthage"); mood(s, "citizens", -1, "Carthage's silver brought you home"); }
  s.people[PLAYER].where = undefined;
  if (s.events) s.events.open = s.events.open.filter((o) => !String(o.id).startsWith("exile"));
  x.returned = s.season;
  endRecord(s, "returned");
  s.flags.returned = s.season;
  say(s, PLAYER, T().returned.replace("{how}", bits.join(" ")).replace(/\s+/g, " "), `you struck for the city and won by ${margin}`);
}

function endRecord(s: GameState, how: string) {
  const x = s.exile!;
  x.active = false;
  x.end = how;
  x.hunt = null;
  const h = x.history.at(-1);
  if (h) { h.to = s.season; h.end = how; }
}

// The decade ends while you are in exile.
export function exileDecadeEnd(s: GameState): NonNullable<GameState["over"]> {
  const text = words(s, T().decade);
  endRecord(s, "decade");
  return { reason: "exileEnd", text, season: s.season - 1 };
}

// ---------- The actions (data/actions.json, marked "exile": true) ----------
interface Option { value: string; label: string }
interface Impl {
  target?: (s: GameState) => Option[]; targetLabel?: string;
  notes?: (s: GameState, a: Args) => string[];
  check?: (s: GameState, a: Args) => string | null;
  odds?: (s: GameState, a: Args) => Mod[] | null; need?: number;
  run: (s: GameState, a: Args, ok: boolean, die: number) => void;
}
const ix = (s: GameState) => s.exile!;
const factionTargets = (s: GameState): Option[] => FACTIONS.filter((f) => s.factions[f].mood < 4).map((f) => ({ value: f, label: `${s.factions[f].name} (toward you: ${moodName(s.factions[f].mood)}; toward ${rulerName(s)}: ${moodName(ix(s).moods[f])})` }));
const insideTargets = (s: GameState): Option[] => others(s).filter((p) => p.status === "free" && p.id !== ix(s).ruler.id && !ix(s).sworn.includes(p.id) && p.opinion >= -1)
  .map((p) => ({ value: p.id, label: `${capital(p.name)} (thinks ${sgn(p.opinion)} of you${officesOf(s, p.id).length ? `; holds ${officesOf(s, p.id).length === 1 ? "an office" : "offices"}` : ""})` }));
const letterMods = (s: GameState, f: FactionId): Mod[] => {
  const x = ix(s);
  const m: Mod[] = [];
  const own = x.followers.find((id) => s.people[id].faction === f);
  if (own) m.push({ label: `${s.people[own].name} writes to old friends among them`, value: 1 });
  if (x.moods[f] <= 1) m.push({ label: `they are ${moodName(x.moods[f])} with ${rulerName(s)}`, value: 1 });
  if (x.moods[f] >= 4) m.push({ label: `${rulerName(s)} has them in hand`, value: -1 });
  if (x.notice >= K().expected) m.push({ label: "your letters are expected", value: -1 });
  if (s.people[PLAYER].traits.includes("silverTongued")) m.push({ label: "your trait Silver-tongued", value: 1 });
  return m;
};

export const EXILE_IMPL: Record<string, Impl> = {
  exWrite: {
    target: factionTargets, targetLabel: "Write to",
    odds: (s, a) => letterMods(s, a.target as FactionId),
    notes: (s, a) => a.target ? [`${capital(rulerName(s))} hears 1 more of you; on a 1, 3 more.`, ...(ix(s).notice + 1 >= K().huntNotice && !ix(s).hunt ? [`At ${K().huntNotice} the ruler may send men to hunt you.`] : [])] : [],
    run: (s, a, ok, die) => {
      const f = a.target as FactionId;
      if (ok) mood(s, f, 1, "your letters from exile");
      else say(s, PLAYER, `Your letters to ${s.factions[f].short} come to nothing.`, "Write to a faction");
      notice(s, die === 1 ? 3 : 1, die === 1 ? "your letter was carried to the ruler" : "letters from exile are talked of");
      if (die === 1) say(s, PLAYER, `One of your letters to ${s.factions[f].short} is carried to ${rulerName(s)}.`, "a 1 on the die");
    },
  },
  exSlander: {
    target: (s) => FACTIONS.filter((f) => ix(s).moods[f] > 0).map((f) => ({ value: f, label: `${s.factions[f].name} (toward ${rulerName(s)}: ${moodName(ix(s).moods[f])})` })), targetLabel: "Among",
    odds: (s, a) => {
      const f = a.target as FactionId;
      const m: Mod[] = [];
      if (f && s.factions[f].mood >= 3) m.push({ label: "they long for you", value: 1 });
      if (f && ix(s).moods[f] >= 4) m.push({ label: "they are Loyal to the ruler", value: -1 });
      if (ix(s).sworn.length) m.push({ label: "your sworn men spread it", value: 1 });
      return m;
    },
    notes: (s) => [`${capital(rulerName(s))} hears 1 more of you.`, "A faction that longs for you (Content or better) and is Angry or worse with the ruler rises for you when you strike: +1 each."],
    run: (s, a, ok) => {
      const f = a.target as FactionId;
      if (ok) rulerMood(s, f, -1, "stories you spread against the ruler");
      else say(s, PLAYER, `The stories you spread among ${s.factions[f].short} find no ears.`, "Spread word against the ruler");
      notice(s, 1, "the stories are traced to you");
    },
  },
  exHire: {
    check: (s) => { const d = refugeDef(ix(s).at); return ix(s).silver < d.hirePrice ? `needs ${talents(d.hirePrice)}` : ix(s).men >= K().maxMen ? "you have all the men you can lead" : null; },
    notes: (s) => { const d = refugeDef(ix(s).at); const after = Math.min(K().maxMen, ix(s).men + d.recruits); const up = Math.ceil(Math.max(0, after - K().freeMen) / K().upkeepPer); return [`Costs ${talents(d.hirePrice)}; you will have ${companies(after)}.`, up ? `Their pay: ${talents(up)} a season from now on.` : "No pay due yet: the first two companies serve for plunder."]; },
    odds: () => null,
    run: (s) => { const d = refugeDef(ix(s).at); purse(s, -d.hirePrice, "Hire men"); band(s, d.recruits, `men for hire at ${d.short}`); notice(s, 1, "an exile hiring men is news"); },
  },
  exArms: {
    check: (s) => (ix(s).arms ? "the arms are bought" : ix(s).silver < 2 ? "needs 2 talents" : null),
    odds: () => null,
    run: (s) => { purse(s, -2, "Buy arms for the citizens"); ix(s).arms = true; say(s, PLAYER, "Suits of armour are bought and hidden, to be handed out to the citizens when you come.", "as Dion brought five thousand suits for the unarmed (Diodorus 16.9.5, 16.10.3)"); },
  },
  exRaid: {
    check: (s) => (ix(s).men < 2 ? "needs 2 companies" : ix(s).flags.raided === s.season ? "you have raided this season" : null),
    odds: (s) => { const extra = Math.min(2, ix(s).men - 2); return extra > 0 ? [{ label: "companies beyond two", value: extra }] : []; },
    notes: () => ["Carthage's anger rises 1 whatever happens."],
    run: (s, _a, ok) => {
      ix(s).flags.raided = s.season;
      clock(s, 1, "an exile raids Carthage's lands");
      notice(s, 1, "the raid is talked of");
      if (ok) {
        purse(s, 2, "plunder from Carthage's lands");
        const last = ix(s).flags.praised;
        if (last === undefined || s.season - last >= 4) { ix(s).flags.praised = s.season; mood(s, "citizens", 1, "you struck at Carthage, as Hermocrates did (Diodorus 13.63.4 to 13.63.5)"); } say(s, PLAYER, "Your men come back from Carthage's country with cattle, slaves and silver.", "Raid Carthage's lands"); }
      else { band(s, -1, "beaten off"); say(s, PLAYER, "Carthage's subjects beat your raiders off.", "Raid Carthage's lands"); }
    },
  },
  exInside: {
    target: insideTargets, targetLabel: "Whom",
    check: (s) => (ix(s).silver < 1 ? "needs 1 talent" : ix(s).sworn.length >= K().maxSworn ? `at most ${K().maxSworn} sworn men` : null),
    odds: (s, a) => {
      const p = s.people[a.target!];
      if (!p) return [];
      const m: Mod[] = [];
      const op = Math.max(-2, Math.min(2, p.opinion));
      if (op) m.push({ label: "opinion of you", value: op });
      if (p.traits.includes("greedy")) m.push({ label: "Greedy", value: 1 });
      if (officesOf(s, p.id).length) m.push({ label: "holds an office, and has much to lose", value: -1 });
      if (ix(s).notice >= K().expected) m.push({ label: "your letters are expected", value: -1 });
      return m;
    },
    notes: (s, a) => (a.target ? [`If he swears, he adds ${swornValue(s, a.target)} when you strike for the city. While ${rulerName(s)} hears 2 or more of you, he may search out your sworn men.`] : []),
    run: (s, a, ok, die) => {
      purse(s, -1, "Win a friend inside the city");
      const p = s.people[a.target!];
      if (ok) { ix(s).sworn.push(p.id); opinion(s, p.id, 1, "sworn to you in secret"); say(s, PLAYER, `${capital(p.name)} swears to you in secret.`, "Win a friend inside the city"); }
      else if (die === 1) { say(s, p.id, `${capital(p.name)} takes your letter to ${rulerName(s)}.`, "a 1 on the die"); opinion(s, p.id, -1, "chose the new ruler over you"); notice(s, 2, "a man you wrote to betrayed you"); if (!ix(s).hunt) ix(s).hunt = { stage: 1, since: s.season, named: -1 }; }
      else say(s, PLAYER, `${capital(p.name)} will not commit to you.`, "Win a friend inside the city");
    },
  },
  exPatron: {
    target: (s) => (EXILE.patrons as any[]).filter((p) => !ix(s).patrons.includes(p.id) && !(p.needs.includes("notCarthage") && ix(s).ruler.kind === "carthage"))
      .map((p) => ({ value: p.id, label: `${capital(p.name)}: ${p.silver ? talents(p.silver) : ""}${p.silver && p.men ? " and " : ""}${p.men ? companies(p.men) : ""}` })),
    targetLabel: "Patron",
    notes: (s, a) => { const p = patronDef(a.target ?? ""); if (!p) return []; return [...Object.entries(p.longing).map(([f, d]) => `The ${s.factions[f as FactionId].short} think less of you (mood ${sgn(d as number)}).`), ...(p.promise ? [p.promise] : []), `${capital(rulerName(s))} hears 1 more of you.`]; },
    odds: () => null,
    run: (s, a) => {
      const p = patronDef(a.target!);
      ix(s).patrons.push(p.id);
      // A patron who paid you in an earlier exile is told in a shorter line, and its source is cited once a game.
      const key = `exilePatron_${p.id}`;
      const again = (s.counters[key] ?? 0) > 0 && p.again;
      s.counters[key] = (s.counters[key] ?? 0) + 1;
      say(s, PLAYER, again ? p.again : p.text, `Seek a patron abroad: ${p.name}`);
      purse(s, p.silver, p.name);
      band(s, p.men, p.name);
      for (const [f, d] of Object.entries(p.longing)) mood(s, f as FactionId, d as number, `you took the silver of ${p.name}`);
      if (p.promise) ix(s).promises.push(p.promise);
      notice(s, 1, "envoys come and go");
    },
  },
  exLieLow: {
    odds: () => null,
    run: (s) => {
      notice(s, -2, "you lie low");
      const h = ix(s).hunt;
      if (h && (h.dodged ?? 0) >= K().lieLowSteps) say(s, PLAYER, words(s, T().huntKnowsHabits), `lying low has set this hunt back ${K().lieLowSteps} times already`);
      else if (h) { h.dodged = (h.dodged ?? 0) + 1; h.stage -= 1; if (h.stage <= 0) ix(s).hunt = null; else if (h.stage < 3) h.named = -1; }
      say(s, PLAYER, `You keep to your lodging at ${refugeDef(ix(s).at).short} and see no one.`, "Lie low");
    },
  },
  exMove: {
    target: (s) => openRefuges(s).filter((r) => r.id !== ix(s).at).map((r) => ({ value: r.id, label: `${capital(r.name)}: safety ${r.safety}, ${r.recruits === 1 ? "a company" : `${r.recruits} companies`} for ${talents(r.hirePrice)}${r.crossing ? ", a sea crossing to strike" : ""}` })),
    targetLabel: "Where",
    check: (s, a) => { const r = a.target ? refugeDef(a.target) : null; return r && ix(s).silver < (r.moveCost ?? 0) ? `needs ${talents(r.moveCost)} for the crossing` : null; },
    notes: (_s, a) => { const r = a.target ? refugeDef(a.target) : null; return r ? [r.summary] : []; },
    odds: () => null,
    run: (s, a) => {
      const r = refugeDef(a.target!);
      const from = refugeDef(ix(s).at);
      if (r.moveCost) purse(s, -r.moveCost, "the crossing");
      say(s, PLAYER, `You leave ${from.name} for ${r.name}.`, "Seek another refuge");
      arrive(s, r, "Seek another refuge");
      const h = ix(s).hunt;
      if (h && h.stage >= 3) { h.stage = 2; h.named = -1; say(s, PLAYER, words(s, T().huntFollows), "they had named you before you moved"); }
      else if (h) { ix(s).hunt = null; say(s, PLAYER, "The men hunting you lose your trail.", "you moved"); }
      notice(s, -1, "you moved");
    },
  },
  exStrike: {
    check: (s) => (ix(s).men < 1 && !ix(s).sworn.length ? "you have no men and no friends inside" : null),
    odds: (s) => returnMods(s),
    need: 4,
    notes: (s) => {
      const o = returnOdds(s);
      const pct = (x: number) => `${Math.round(x * 100)}%`;
      return [`Take the city back: ${pct(o.win)}.`, `Thrown back with half your men lost: ${pct(o.repulse)}.`, `Killed in the streets, and the game ends: ${pct(o.die)}.`];
    },
    run: (s, _a, _ok, die) => strikeHome(s, die),
  },
};

// ---------- Exile conditions, roles and effects for the events in data/exile.json ----------
export interface ExileCond { since?: { min?: number; max?: number }; notice?: { min?: number; max?: number }; men?: { min?: number; max?: number }; silver?: { min?: number; max?: number }; followers?: { min?: number; max?: number }; sworn?: { min?: number; max?: number }; rulerKind?: string[]; refuge?: string[]; hunt?: boolean }
const inR = (v: number, r?: { min?: number; max?: number }) => !r || ((r.min === undefined || v >= r.min) && (r.max === undefined || v <= r.max));
export function checkExileCond(s: GameState, c: ExileCond): boolean {
  if (!inExile(s)) return false;
  const x = s.exile!;
  if (!inR(s.season - x.since, c.since) || !inR(x.notice, c.notice) || !inR(x.men, c.men) || !inR(x.silver, c.silver) || !inR(x.followers.length, c.followers) || !inR(x.sworn.length, c.sworn)) return false;
  if (c.rulerKind && !c.rulerKind.includes(x.ruler.kind)) return false;
  if (c.refuge && !c.refuge.includes(x.at)) return false;
  if (c.hunt !== undefined && !!x.hunt !== c.hunt) return false;
  return true;
}
export function fitsExileRole(s: GameState, p: Person, r: { where?: string; kinInCity?: boolean; usurper?: boolean; sworn?: boolean }): boolean {
  if (r.where !== undefined && (p.where ?? "") !== r.where) return false;
  if (r.kinInCity !== undefined && (p.married || p.kin.some((k) => k !== PLAYER && s.people[k]?.status === "free")) !== r.kinInCity) return false;
  if (r.usurper !== undefined && (s.exile?.ruler.id === p.id && !!s.exile?.active) !== r.usurper) return false;
  if (r.sworn !== undefined && !!s.exile?.sworn.includes(p.id) !== r.sworn) return false;
  return true;
}
const X_KEYS = ["xPurse", "xMen", "xNotice", "xLonging", "xRulerMood", "xHold", "xEnd", "xFollowerHome", "xFollowersHome", "xFlag", "xHuntEnd", "xBlock"];
export const isExileEffect = (e: Record<string, any>) => X_KEYS.some((k) => k in e);
export function applyExileEffect(s: GameState, roles: Record<string, string>, e: Record<string, any>, why: string): boolean {
  if (!isExileEffect(e)) return false;
  if (!inExile(s)) return true;
  const x = s.exile!;
  if (e.xPurse) purse(s, e.xPurse, why);
  else if (e.xMen) band(s, e.xMen, why);
  else if (e.xNotice) notice(s, e.xNotice, why);
  else if (e.xLonging) mood(s, e.xLonging, e.by, why);
  else if (e.xRulerMood) rulerMood(s, e.xRulerMood, e.by, why);
  else if (e.xHold) hold(s, e.xHold, why);
  else if (e.xFlag) x.flags[e.xFlag] = s.season;
  else if (e.xHuntEnd) { if (x.hunt) { x.hunt = null; say(s, PLAYER, "No one hunts a dead man.", why); } }
  else if (e.xBlock) s.blockedSlots += e.xBlock;
  else if (e.xFollowerHome) {
    const id = roles[e.xFollowerHome];
    const p = id ? s.people[id] : undefined;
    if (!p || !x.followers.includes(id)) return true;
    x.followers = x.followers.filter((f) => f !== id);
    p.where = undefined;
    setStatus(s, id, "free", "went home under the amnesty, with your blessing");
    opinion(s, id, 2, "you let them go home");
    if (e.sworn && x.sworn.length < K().maxSworn) { x.sworn.push(id); say(s, id, `${capital(p.name)} goes home, and will be your friend inside the walls.`, why); }
  } else if (e.xFollowersHome) {
    for (const id of x.followers.slice()) {
      const p = s.people[id];
      if (!fitsExileRole(s, p, { kinInCity: true })) continue;
      x.followers = x.followers.filter((f) => f !== id);
      p.where = undefined;
      setStatus(s, id, "free", "took the city's terms for family's sake");
    }
  } else if (e.xEnd) {
    s.over = { reason: e.xEnd, text: words(s, T()[e.xEnd] ?? "Your exile ends."), season: s.season, by: x.ruler.id };
    endRecord(s, e.xEnd);
    s.people[PLAYER].where = undefined;
    event(s, PLAYER, s.over.text, why);
  }
  return true;
}
export function describeExileEffect(s: GameState, roles: Record<string, string>, e: Record<string, any>): string | null {
  if (!isExileEffect(e)) return null;
  const name = (r: string) => capital(s.people[roles[r]]?.name ?? r);
  if (e.xPurse) return `Your purse ${sgn(e.xPurse)}`;
  if (e.xMen) return `${e.xMen > 0 ? "Gain" : "Lose"} ${companies(Math.abs(e.xMen))}`;
  if (e.xNotice) return e.xNotice <= -K().maxNotice ? `${capital(s.exile ? rulerName(s) : "the ruler")} stops looking for you` : `${capital(s.exile ? rulerName(s) : "the ruler")} hears ${e.xNotice > 0 ? "more" : "less"} of you (${sgn(e.xNotice)})`;
  if (e.xLonging) return `${capital(s.factions[e.xLonging as FactionId].name)} toward you ${sgn(e.by)}`;
  if (e.xRulerMood) return `${capital(s.factions[e.xRulerMood as FactionId].name)} toward ${s.exile ? rulerName(s) : "the ruler"} ${sgn(e.by)}`;
  if (e.xHold) return `The ruler's grip on the city ${sgn(e.xHold)}`;
  if (e.xFlag === "invited") return "Strike for Syracuse this season and your friends hold a gate (+3)";
  if (e.xFlag) return "";
  if (e.xHuntEnd) return "Any men hunting you give up";
  if (e.xBlock) return `You lose ${plural(e.xBlock, "action", "actions")} next season`;
  if (e.xFollowerHome) return `${name(e.xFollowerHome)} goes home${e.sworn ? ", and will be your friend inside" : ""}`;
  if (e.xFollowersHome) return "Followers with families in the city go home";
  if (e.xEnd === "settled") return "You go home as a private man, and the game ends";
  if (e.xEnd) return "Your exile ends";
  return null;
}
// For the headless players: how good an effect looks.
export function scoreExileEffect(s: GameState, e: Record<string, any>): number {
  if (!isExileEffect(e) || !inExile(s)) return 0;
  const x = s.exile!;
  if (e.xPurse) return e.xPurse * 1;
  if (e.xMen) return e.xMen * 1.5;
  if (e.xNotice) return -e.xNotice * 0.4;
  if (e.xLonging) return e.by * 1.2;
  if (e.xRulerMood) return -e.by * 0.8;
  if (e.xFlag === "invited") return returnOdds(s).win + 0.5 >= 0.5 ? 3 : 0;
  if (e.xHuntEnd) return x.hunt ? 2 : 0;
  if (e.xBlock) return -1.5;
  if (e.xFollowerHome) return e.sworn ? 1 : -1;
  if (e.xFollowersHome) return -1.5;
  if (e.xEnd) return -6 + Math.min(5, x.tries * 2 + Math.floor((s.season - x.since) / 8));
  return 0;
}

// ---------- The headless player in exile: a priority list over the same menu ----------
export function exileChoices(s: GameState): { a: string; args: Args }[] {
  const x = s.exile!;
  const out: { a: string; args: Args }[] = [];
  const o = returnOdds(s);
  const long = s.season - x.since;
  if ((o.win >= 0.5 && o.die <= 1 / 6) || (o.win >= 0.34 && o.die === 0) || (long >= 16 && o.win >= 0.34 && o.die <= 1 / 6) || (x.flags.invited === s.season && o.win >= 0.34)) out.push({ a: "exStrike", args: {} });
  // The hunt: the bot reacts only when the killers can strike this season and could kill; a wound it risks.
  const hf = huntForecast(s);
  if (hf.ready && hf.kill > 0) {
    const r = openRefuges(s).filter((d) => d.id !== x.at && x.silver >= (d.moveCost ?? 0) && d.safety > refugeDef(x.at).safety).sort((a, b) => b.safety - a.safety)[0];
    if (r) out.push({ a: "exMove", args: { target: r.id } });
    if ((x.hunt!.dodged ?? 0) < K().lieLowSteps) out.push({ a: "exLieLow", args: {} });
    else if (x.silver >= refugeDef(x.at).hirePrice && x.men < 2) out.push({ a: "exHire", args: {} });
  }
  if (x.men >= 3 && x.silver <= 1) out.push({ a: "exRaid", args: {} });
  const d = refugeDef(x.at);
  if (x.silver >= d.hirePrice + 1 && x.men < 4) out.push({ a: "exHire", args: {} });
  if (!x.arms && x.silver >= 2 && x.men >= 2) out.push({ a: "exArms", args: {} });
  const pat = (EXILE.patrons as any[]).find((p) => !x.patrons.includes(p.id) && p.id !== "carthage");
  if (pat && x.silver < 3) out.push({ a: "exPatron", args: { target: pat.id } });
  const inside = insideTargets(s).map((t) => s.people[t.value]).sort((a, b) => b.opinion - a.opinion || a.id.localeCompare(b.id))[0];
  if (inside && inside.opinion >= 0 && x.silver >= 1 && x.sworn.length < 2) out.push({ a: "exInside", args: { target: inside.id } });
  const sour = [...FACTIONS].filter((f) => s.factions[f].mood >= 3 && x.moods[f] >= 2).sort((a, b) => x.moods[a] - x.moods[b] || FACTIONS.indexOf(a) - FACTIONS.indexOf(b))[0];
  if (sour && x.notice < K().huntNotice + 1) out.push({ a: "exSlander", args: { target: sour } });
  if (x.notice < K().huntNotice) {
    const f = [...FACTIONS].filter((f) => s.factions[f].mood < 3).sort((a, b) => s.factions[a].mood - s.factions[b].mood || FACTIONS.indexOf(a) - FACTIONS.indexOf(b))[0];
    if (f) out.push({ a: "exWrite", args: { target: f } });
  }
  if (x.men >= 2) out.push({ a: "exRaid", args: {} });
  if (!x.hunt) out.push({ a: "exLieLow", args: {} }); // with nothing better to do; a hunt it judged it can survive, it lets come
  return out;
}

// For the UI: everything the exile screens show, read from the state.
export function exileView(s: GameState) {
  const x = s.exile!;
  const def = refugeDef(x.at);
  return {
    refuge: def, ruler: rulerName(s), rulerKind: x.ruler.kind, rulerId: x.ruler.id, hold: x.ruler.hold, maxHold: K().maxHold,
    moods: FACTIONS.map((f) => ({ f, name: s.factions[f].name, short: s.factions[f].short, toYou: s.factions[f].mood, toRuler: x.moods[f] })),
    silver: x.silver, men: x.men, followers: x.followers, sworn: x.sworn.filter((id) => s.people[id]?.status === "free"), lost: x.sworn.filter((id) => s.people[id]?.status !== "free"),
    notice: x.notice, maxNotice: K().maxNotice, huntAt: K().huntNotice, hunt: x.hunt, hides: Math.max(0, K().lieLowSteps - (x.hunt?.dodged ?? 0)), huntForecast: huntForecast(s), odds: returnOdds(s),
    agenda: rulerAgenda(s), acts: x.acts.slice(-4).reverse(), since: x.since, arms: x.arms, patrons: x.patrons, promises: x.promises, tries: x.tries, wavering: x.wavering,
    upkeep: Math.ceil(Math.max(0, x.men - K().freeMen) / K().upkeepPer), away: x.away === s.season, invited: x.flags.invited === s.season,
  };
}
void nameOf;
