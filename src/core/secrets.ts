// Switch "secrets": named secrets in place of the old leverage tokens (docs/game-research.md, proposal 6).
// A secret is about one person and names what he did. Whoever knows it holds it. A small secret (weight 1) is used up
// when its holder uses it; a deadly one (weight 2) is a lasting hold that rests for a while after each use.
// Secrets come from the start (data/secrets.json, some from the sources), from what people do (joining a plot, taking
// Carthaginian silver, a hidden grudge or agenda, false counsel) and from what you do in the dark (a rumor, an informer,
// blackmail). Your rivals dig for yours. Every change is logged with its reason; secrets you don't know stay hidden.
import secretsJson from "../../data/secrets.json" with { type: "json" };
import agendasJson from "../../data/agendas.json" with { type: "json" };
import { PLAYER, alive, capital, nameOf, officeName, plotOf } from "./state.ts";
import { event, factionOf, mood, opinion, powerChange, roll, setStatus } from "./ops.ts";
import { on } from "./switches.ts";
import { leaderOfCity, councilOf, censusPersonName } from "./census-game.ts";
import type { FactionId, GameState, Person, Secret } from "./types.ts";
import { FACTIONS } from "./types.ts";

interface Effects {
  opinion?: number | Record<string, number>; infl?: number; faction?: number; also?: Record<string, number>; moods?: Record<string, number>;
  flees?: boolean; named?: boolean; unseat?: boolean; targetFaction?: number; endsInformer?: boolean; discredits?: boolean;
}
interface Tpl { id: string; kind: string; weight: number; text: string; about?: string; exposed?: Effects; body?: string; when?: string; greek?: boolean; source?: string }
export const SECRETS = secretsJson as unknown as { knobs: Record<string, number>; start: Tpl[]; deeds: Tpl[]; yours: Tpl[]; census: Tpl[] };
const K = SECRETS.knobs;
const DATA_AGENDAS = agendasJson.agendas;
const tplById = (id: string) => [...SECRETS.start, ...SECRETS.deeds, ...SECRETS.yours, ...SECRETS.census].find((t) => t.id === id);

export const secretsOn = (s: GameState) => on(s, "secrets") && !!s.secrets;

// A number in [0, 1) from the seed and a name. Used only to decide which invented townsman hides what, so the
// census keeps its own dice; the same seed always gives the same answer.
export function stableHash(seed: number, key: string): number {
  let h = 2166136261 ^ (seed | 0);
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

function fill(t: string, args: Record<string, string>, s: GameState) {
  const nm = (k: string) => (s.people[args[k]] ? s.people[args[k]].name : args[k]);
  return t.replace(/\{(\w+)\}'s/g, (_m, k) => (k in args ? (nm(k).endsWith("s") ? `${nm(k)}'` : `${nm(k)}'s`) : k))
    .replace(/\{(\w+)\}/g, (_m, k) => (k in args ? nm(k) : k));
}

function add(s: GameState, tpl: Tpl, about: string, args: Record<string, string> = {}, known: string[] = [], census = false): Secret {
  const st = s.secrets!;
  st.n += 1;
  const sec: Secret = { id: `secret${st.n}`, tpl: tpl.id, about, weight: tpl.weight === 2 ? 2 : 1, text: fill(tpl.text, args, s), season: s.season, known: [...known], rest: {}, spent: [], ...(Object.keys(args).length ? { args } : {}), ...(census ? { census: true } : {}), ...(tpl.kind === "history" ? { history: true } : {}) };
  st.list.push(sec);
  return sec;
}

// Called by newGame when the switch is on.
export function initSecrets(s: GameState) {
  s.secrets = { list: [], n: 0 };
  for (const t of SECRETS.start) if (t.about && s.people[t.about]) add(s, t, t.about);
}

export const about = (s: GameState, who: string) => (s.secrets?.list ?? []).filter((x) => x.about === who && x.publicSince === undefined);
export const knownBy = (s: GameState, holder: string) => (s.secrets?.list ?? []).filter((x) => x.known.includes(holder) && x.publicSince === undefined);
export const secretName = (s: GameState, x: Secret) => (x.census ? censusPersonName(s, x.about, true) : nameOf(s, x.about));
// "Philistus has married one of Leptines' daughters" / "you staged the night alarm".
export const secretLine = (s: GameState, x: Secret) => (x.about === PLAYER ? x.text : `${capital(secretName(s, x))} ${x.text}`);

// Your secret as the man it is about tells it: "you held his secret over him", not "you held Nicoteles' secret over him".
export function toHolder(s: GameState, x: Secret, pid: string) {
  const nm = s.people[pid]?.name;
  if (!nm || x.args?.target !== pid) return x.text;
  return x.text.split(nm.endsWith("s") ? `${nm}'` : `${nm}'s`).join("his");
}

export function usable(s: GameState, holder: string, over: string, deadlyOnly = false): Secret[] {
  return about(s, over).filter((x) => x.known.includes(holder) && !x.spent.includes(holder) && (x.rest[holder] ?? -1) < s.season && (!deadlyOnly || x.weight === 2));
}
export const holdsDeadly = (s: GameState, holder: string, over: string) => usable(s, holder, over, true).length > 0;

// Secrets that follow from what a man is doing now. Made the first time someone could find them, so nothing is
// stored for people no one looks at.
export function derive(s: GameState, pid: string) {
  if (!s.secrets || pid === PLAYER) return;
  const p = s.people[pid];
  if (!p || !alive(p)) return;
  const have = (tpl: string, key?: string) => s.secrets!.list.some((x) => x.about === pid && x.tpl === tpl && (key === undefined || x.args?.key === key));
  const pl = plotOf(s, pid);
  if (pl) {
    if (pl.leader === pid && !have("plotLeader", pl.id)) add(s, tplById("plotLeader")!, pid, { key: pl.id });
    else if (pl.leader !== pid && !have("plotSworn", pl.id)) add(s, tplById("plotSworn")!, pid, { key: pl.id, leader: pl.leader });
  }
  // A political rival at rank 2 or more has a scheme your watchers can see, renewed every schemeSeasons seasons.
  if (p.political && p.political.rank >= SECRETS.knobs.schemeRank && !have("politicalScheme", String(Math.floor(s.season / SECRETS.knobs.schemeSeasons)))) add(s, tplById("politicalScheme")!, pid, { key: String(Math.floor(s.season / SECRETS.knobs.schemeSeasons)) });
  const g = p.grudges[0];
  if (g && !have("grudgeHidden", g.reason)) add(s, tplById("grudgeHidden")!, pid, { key: g.reason, grudge: g.reason });
  if (p.agenda && !p.agenda.done && p.agenda.id !== "yourFall" && !have("agendaHidden", p.agenda.id)) {
    const name = (DATA_AGENDAS as { id: string; name: string }[]).find((a) => a.id === p.agenda!.id)?.name ?? "his own ends";
    add(s, tplById("agendaHidden")!, pid, { key: p.agenda.id, agenda: name.toLowerCase() });
  }
}

// A deed that makes a secret about someone else (Carthaginian silver, false counsel).
export function deedSecret(s: GameState, pid: string, tpl: string, args: Record<string, string> = {}, known: string[] = []) {
  if (!secretsOn(s) || !s.people[pid] || pid === PLAYER) return;
  const old = s.secrets!.list.find((x) => x.about === pid && x.tpl === tpl && x.publicSince === undefined);
  if (old) { for (const k of known) if (!old.known.includes(k)) old.known.push(k); return; }
  add(s, tplById(tpl)!, pid, args, known);
}

// ---------- Fighting back ----------

// The men you know hold something over you. You learn it when one makes a demand or tells the city, or when your
// watchers follow him and overhear it.
export const seenHolders = (s: GameState) => (s.secrets?.seen ?? []).filter((id) => s.people[id] && alive(s.people[id]) && knownBy(s, id).some((x) => x.about === PLAYER));
export function markSeen(s: GameState, pid: string) {
  if (!s.secrets || pid === PLAYER) return;
  s.secrets.seen = s.secrets.seen ?? [];
  if (!s.secrets.seen.includes(pid)) s.secrets.seen.push(pid);
}
// Your watchers followed him: if he holds something over you, now you know.
export function watchedHolder(s: GameState, pid: string) {
  if (!secretsOn(s) || (s.secrets!.seen ?? []).includes(pid)) return;
  const x = knownBy(s, pid).filter((y) => y.about === PLAYER).sort((a, b) => b.weight - a.weight)[0];
  if (!x) return;
  markSeen(s, pid);
  event(s, PLAYER, `Your watchers overhear ${nameOf(s, pid)} talking: he knows that ${toHolder(s, x, pid)}.`, "Watch a person");
}
// What his silence costs: 1 silver, and 1 more for each secret he holds over you (2 for a deadly one).
export const silenceCost = (s: GameState, pid: string) => 1 + knownBy(s, pid).filter((x) => x.about === PLAYER).reduce((a, x) => a + x.weight, 0);
// He takes your silver and forgets what he knows (until he digs again). Any demand he made is withdrawn.
export function forget(s: GameState, pid: string) {
  for (const x of knownBy(s, pid).filter((y) => y.about === PLAYER)) x.known = x.known.filter((k) => k !== pid);
  s.requests = s.requests.filter((r) => !(r.from === pid && r.blackmail));
  if (s.secrets?.seen) s.secrets.seen = s.secrets.seen.filter((k) => k !== pid);
}
// Something you did in the dark. `known`: who saw it (the man you blackmailed knows you did).
export function yourDeed(s: GameState, tpl: string, args: Record<string, string> = {}, known: string[] = []) {
  if (!secretsOn(s)) return;
  const old = s.secrets!.list.find((x) => x.about === PLAYER && x.tpl === tpl && x.publicSince === undefined && x.args?.target === args.target && x.args?.second === args.second);
  if (old) { for (const k of known) if (!old.known.includes(k)) old.known.push(k); return; }
  add(s, tplById(tpl)!, PLAYER, args, known);
  s.counters.yourSecrets = (s.counters.yourSecrets ?? 0) + 1;
}

// `holder` learns one secret about `who` that he did not know: the deadliest, then the oldest.
// `kinds`: "seen" for what watchers can see (plots, grudges, agendas), "kept" for what a household knows, or both.
export function learn(s: GameState, holder: string, who: string, how: string, kinds: "seen" | "kept" | "all" = "all"): Secret | null {
  if (!secretsOn(s)) return null;
  derive(s, who);
  const seen = ["plotSworn", "plotLeader", "grudgeHidden", "agendaHidden", "politicalScheme"];
  const pool = about(s, who).filter((x) => !x.known.includes(holder) && (kinds === "all" || (kinds === "seen") === seen.includes(x.tpl)))
    .sort((a, b) => b.weight - a.weight || a.season - b.season);
  const x = pool[0];
  if (!x) return null;
  x.known.push(holder);
  if (holder === PLAYER) {
    s.counters.secretsLearned = (s.counters.secretsLearned ?? 0) + 1;
    event(s, PLAYER, `You learn that ${secretLine(s, x)}.${x.weight === 2 ? " It is a deadly secret: a hold you can use again and again." : ""}`, how);
  } else {
    if (who === PLAYER) s.counters.yourSecretsFound = (s.counters.yourSecretsFound ?? 0) + 1;
    event(s, holder, `${capital(nameOf(s, holder))} learns that ${who === PLAYER ? x.text : secretLine(s, x)}.`, how, false);
  }
  return x;
}

// Use a hold. A small secret is used up; a deadly one rests. Returns what was used, or null.
export function useHold(s: GameState, holder: string, over: string, why: string, deadlyOnly = false): Secret | null {
  const xs = usable(s, holder, over, deadlyOnly).sort((a, b) => a.weight - b.weight || a.season - b.season); // spend small ones first
  const x = xs[0];
  if (!x) return null;
  if (x.weight === 2) x.rest[holder] = s.season + K.holdRest;
  else x.spent.push(holder);
  if (holder === PLAYER) {
    s.counters.holdsUsed = (s.counters.holdsUsed ?? 0) + 1;
    if (!x.census) yourDeed(s, "blackmailed", { target: over }, [over]);
    event(s, PLAYER, x.weight === 2 ? `You let ${secretName(s, x)} know what you know: ${secretLine(s, x)}. The hold rests for ${K.holdRest} seasons.` : `You use what you know: ${secretLine(s, x)}. That secret is spent.`, why);
  }
  return x;
}

// A secret goes public. Its effects come from data/secrets.json.
// About half: -2 becomes -1, and the one biggest -1 stays -1 so a parting shot is never free.
const halve = (m: Record<string, number>) => {
  const out: Record<string, number> = {};
  for (const [k, d] of Object.entries(m)) out[k] = Math.trunc(d / 2);
  const top = Object.entries(m).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
  if (top && out[top[0]] === 0) out[top[0]] = Math.sign(top[1]);
  return out;
};
// `half`: told by a man already shown up as a blackmailer, so only some believe it.
export function exposeSecret(s: GameState, x: Secret, by: string, why: string, half = false) {
  x.publicSince = s.season;
  const t = tplById(x.tpl);
  const e: Effects = t?.exposed ?? {};
  const byName = capital(nameOf(s, by));
  if (x.about === PLAYER) {
    s.counters.yourSecretsExposed = (s.counters.yourSecretsExposed ?? 0) + 1;
    event(s, by, `${byName} tells the city that ${x.text}.${half ? " Some believe him." : ""}`, why);
    for (const [f, d] of Object.entries(half ? halve(e.moods ?? {}) : e.moods ?? {})) mood(s, f as FactionId, d, `they heard that ${x.text}`);
    if (typeof e.opinion === "object") for (const [k, d] of Object.entries(half ? halve(e.opinion) : e.opinion)) if (x.args?.[k]) opinion(s, x.args[k], d, `he heard that ${x.text}`);
    const tf = x.args?.target ? factionOf(s, x.args.target) : undefined;
    if (e.targetFaction && tf && !half) mood(s, tf, e.targetFaction, `they heard that ${x.text}`);
    if (e.endsInformer && x.args?.target && s.people[x.args.target]) {
      s.people[x.args.target].informer = false;
      for (const pl of s.plots) if (pl.informer === x.args.target) pl.informer = undefined;
    }
    return;
  }
  if (x.census) { event(s, by, `${byName} makes it known that ${secretLine(s, x)}.`, why); return; }
  const p = s.people[x.about];
  s.counters.secretsExposed = (s.counters.secretsExposed ?? 0) + 1;
  event(s, by, `${byName} ${by === PLAYER ? "make" : "makes"} it public that ${secretLine(s, x)}.`, why);
  if (typeof e.opinion === "number" && by === PLAYER) opinion(s, p.id, e.opinion, "you exposed his secret");
  if (e.infl) { p.infl += e.infl; event(s, p.id, `${capital(p.name)}'s standing falls (influence ${e.infl}).`, `his secret is out: ${x.text}`); }
  const f = factionOf(s, p.id);
  if (e.faction && f) powerChange(s, f, e.faction, `${p.name}'s secret is out`);
  for (const [k, d] of Object.entries(e.also ?? {})) if (s.people[k] && by === PLAYER) opinion(s, k, d, `you exposed ${p.name}'s secret, and it touches him`);
  if (e.named) { const pl = plotOf(s, p.id); if (pl) pl.known = Array.from(new Set([...pl.known, p.id, pl.leader])); }
  if (e.flees && p.status === "free") setStatus(s, p.id, "outside", `his fear is known, and he flees`);
  if (e.discredits) {
    const held = knownBy(s, p.id).filter((y) => y.about === PLAYER);
    if (by === PLAYER) s.counters.discredited = (s.counters.discredited ?? 0) + 1;
    // His parting shot: he tells the city his worst secret about you anyway, and some believe him.
    // His kin and his faction take it ill that you shamed him.
    const shot = held.slice().sort((a, b) => b.weight - a.weight)[0];
    forget(s, p.id);
    if (shot) {
      s.counters.partingShots = (s.counters.partingShots ?? 0) + 1;
      exposeSecret(s, shot, p.id, "his parting shot, once you showed him up as a blackmailer", true);
    }
    if (by === PLAYER) {
      for (const k of p.kin) if (s.people[k] && k !== PLAYER && alive(s.people[k])) opinion(s, k, -1, `you shamed his kinsman ${p.name} before the city`);
      if (f) mood(s, f, -1, `you shamed ${p.name} before the city`);
    }
  }
  if (e.unseat && s.council) for (const [k, v] of Object.entries(s.council.seats)) if (v === p.id) s.council.seats[k] = null;
}

// ---------- Your rivals and your secrets ----------

// Your rivals dig for your secrets. Returns true if he spent his turn on it.
export function digForYou(s: GameState, p: Person, why: string): boolean {
  if (!secretsOn(s)) return false;
  const left = about(s, PLAYER).filter((x) => !x.known.includes(p.id));
  if (!left.length) return false;
  const seat = s.council && Object.values(s.council.seats).includes(p.id);
  const mods = seat ? [{ label: "he sits at your council", value: 1 }] : [];
  const r = roll(s, p.id, `${capital(p.name)} digs for your secrets`, mods, 4, false);
  if (r.ok) learn(s, p.id, PLAYER, why);
  return true;
}

// A man who holds a secret over you uses it: a demand with a threat, or he tells the city.
// He holds his tongue while you hold a deadly secret over him. Returns true if he acted.
export function useOnYou(s: GameState, p: Person, why: string, request: (kind: "office" | "silver", extra: Record<string, unknown>, text: string, why: string) => boolean): boolean {
  if (!secretsOn(s)) return false;
  const xs = usable(s, p.id, PLAYER).sort((a, b) => b.weight - a.weight);
  const x = xs[0];
  if (!x) return false;
  if (holdsDeadly(s, PLAYER, p.id)) {
    event(s, p.id, `${capital(p.name)} keeps what he knows about you to himself: you know too much about him.`, "a hold on each side", false);
    s.counters.deterred = (s.counters.deterred ?? 0) + 1;
    return false;
  }
  if (x.weight === 2 || p.political) {
    const want = (p.wants && s.offices[p.wants] === PLAYER ? p.wants : (["treasury", "mint", "fleet", "assembly"] as const).find((o) => s.offices[o] === PLAYER));
    const text = want
      ? `${capital(p.name)} comes to you alone. He knows that ${toHolder(s, x, p.id)}. He asks for ${officeName(want)}, or the assembly hears of it.`
      : `${capital(p.name)} comes to you alone. He knows that ${toHolder(s, x, p.id)}. He asks for silver, or the assembly hears of it.`;
    const ok = request(want ? "office" : "silver", { ...(want ? { office: want } : {}), blackmail: x.id }, text, `${why}; he holds a secret over you`);
    if (ok) {
      s.counters.blackmailDemands = (s.counters.blackmailDemands ?? 0) + 1;
      markSeen(s, p.id);
      deedSecret(s, p.id, "triedBlackmail", {}, [PLAYER]);
    }
    return ok;
  }
  x.spent.push(p.id);
  exposeSecret(s, x, p.id, `${why}; he spends what he knows`);
  markSeen(s, p.id);
  return true;
}

// A blackmail demand was refused: he tells the city. Granted: he holds his tongue for a while.
export function blackmailRefused(s: GameState, pid: string, secretId: string) {
  const x = s.secrets?.list.find((y) => y.id === secretId);
  if (!x || x.publicSince !== undefined || !s.people[pid] || !alive(s.people[pid])) return;
  s.counters.blackmailRefused = (s.counters.blackmailRefused ?? 0) + 1;
  exposeSecret(s, x, pid, "you refused his demand, and he said he would");
}
export function blackmailGranted(s: GameState, pid: string, secretId: string) {
  const x = s.secrets?.list.find((y) => y.id === secretId);
  if (!x) return;
  x.rest[pid] = s.season + K.demandRest;
  s.counters.blackmailPaid = (s.counters.blackmailPaid ?? 0) + 1;
  event(s, pid, `${capital(nameOf(s, pid))} has what he asked for, and keeps quiet for now.`, "you paid for his silence", true);
}

// Influence from what a man knows (counted in place of the old tokens).
export const heldCount = (s: GameState, holder: string) => Math.min(2, knownBy(s, holder).filter((x) => x.about !== holder).length);

// ---------- The island's invented people ----------

// Whether a town's first man (or a Carthaginian elder) hides something, decided once from the seed.
export function censusSecret(s: GameState, cid: string, body: "city" | "carthage", place: string): Secret | null {
  if (!secretsOn(s) || !s.census) return null;
  const old = s.secrets!.list.find((x) => x.about === cid && x.census);
  if (old) return old;
  if (s.secrets!.list.some((x) => x.about === cid && x.tpl === "none")) return null;
  const st = s.island?.cities[place];
  const greek = !["motya", "panormus"].includes(place);
  const cands = SECRETS.census.filter((t) => t.body === body && (!t.greek || greek) && (t.when !== "leansCarthage" || (st && (st.lean < 0 || ["tributary", "carthage"].includes(st.side)))));
  if (!cands.length || stableHash(s.seed, `${cid}:has`) >= K.censusShare) {
    s.secrets!.list.push({ id: `none-${cid}`, tpl: "none", about: cid, weight: 1, text: "", season: s.season, known: [], rest: {}, spent: [], census: true, publicSince: s.season });
    return null;
  }
  const t = cands[Math.floor(stableHash(s.seed, `${cid}:which`) * cands.length)];
  return add(s, t, cid, {}, [], true);
}
export const townLeader = (s: GameState, place: string) => (place === "carthage" ? councilOf(s, "elders")[0] : leaderOfCity(s, place));

// The hold you have over a town's first man, if any (for an embassy).
export function townHold(s: GameState, place: string): Secret | null {
  if (!secretsOn(s)) return null;
  const cid = townLeader(s, place);
  if (!cid) return null;
  return usable(s, PLAYER, cid)[0] ?? null;
}

export const FACTION_IDS = FACTIONS;
