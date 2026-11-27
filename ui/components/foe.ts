// "The one coming for you" (second test, starred fix): one card for the person most likely to end your rule, with
// why he hates you, what he has done lately, the factions behind him and how far his plot has come. Jacob died to the
// exiles' leader in season 24 and asked "What was I supposed to do?". It reads the state and changes nothing.
import { DATA, PLAYER, capital, plotStrength, rankTitle, seasonName, stageName } from "../../src/core/index.ts";
import type { GameState, Person, Plot } from "../../src/core/index.ts";

export interface Foe { p: Person; plot?: Plot; why: string }

const politicalTitle = (rank: number) => DATA.politicalRanks?.find((r: any) => r.rank === rank)?.title ?? "";

export function foe(g: GameState): Foe | null {
  // A plot whose leader you have named comes first: the strongest.
  const named = g.plots.filter((pl) => pl.stage >= 1 && pl.known.includes(pl.leader) && g.people[pl.leader]?.status !== "dead")
    .sort((a, b) => plotStrength(g, b).total - plotStrength(g, a).total)[0];
  if (named) return { p: g.people[named.leader], plot: named, why: "leads a plot against you" };
  const score = (p: Person) => (p.rival?.rank ?? 0) + (p.political?.rank === 3 ? 4 : p.political?.rank ?? 0);
  const top = Object.values(g.people).filter((p) => !p.player && p.id !== PLAYER && (p.status === "free" || p.status === "outside") && ((p.rival?.rank ?? 0) >= 3 || (p.political?.rank ?? 0) >= 3))
    .sort((a, b) => score(b) - score(a) || a.id.localeCompare(b.id))[0];
  if (!top) return null;
  return { p: top, why: top.political?.rank === 3 ? "wants your place" : "wants you dead" };
}

// Plain lines for the card, in order: titles, grievances, his plot, what he has done lately.
export function foeLines(g: GameState, f: Foe): { titles: string; grievances: string[]; plot?: string; lately: string[] } {
  const p = f.p;
  const titles = [p.rival ? rankTitle(p.rival.rank) : "", p.political ? politicalTitle(p.political.rank) : ""].filter(Boolean).join(", ");
  const when = (t: string, n: number) => (n >= 0 && !/\b\d{3} BC\)?$|, \d{3}$/.test(t) ? `${capital(t)} (${seasonName(n)})` : capital(t));
  const grievances = [...p.grudges.map((x) => when(x.reason, x.season)), ...(p.rival?.memory ?? []).map((m) => when(m.text, m.season))];
  const uniq = [...new Set(grievances)].slice(-3);
  let plot: string | undefined;
  if (f.plot) {
    const backers = f.plot.backers.map((b) => g.factions[b].short);
    plot = `${stageName(f.plot.stage)}, since ${seasonName(f.plot.started)}. ${backers.length ? `Behind it: ${backers.join(", ")}.` : "No faction backs it yet."}${f.plot.guardBacking ? " The guard has sold itself to it." : ""}`;
  }
  const lately = g.log.filter((e) => e.visible && e.kind === "event" && e.actor === p.id && e.season >= g.season - 8).slice(-3).map((e) => e.text);
  return { titles, grievances: uniq, plot, lately };
}
