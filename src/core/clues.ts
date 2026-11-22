// Switch "clues": plot warnings built from what the plotters really did, not from a pool of stock lines.
// Each plot keeps a list of its deeds (who began it and on what grievance, who joined, who said no,
// which faction or the guard paid in). A warning tells of the newest deed not yet told.
// Whispers give no faction; Rumors and Named do. Every clue is true.
import { DATA } from "./data.ts";
import { pick } from "./rng.ts";
import { capital } from "./state.ts";
import type { Deed, FactionId, GameState, Plot } from "./types.ts";
import { on } from "./switches.ts";

export function deed(s: GameState, pl: Plot, d: Omit<Deed, "season">) {
  if (!on(s, "clues")) return;
  const full: Deed = { season: s.season, ...d };
  if (d.who && !d.faction) full.faction = s.people[d.who].faction;
  if (d.who && !d.grudge) full.grudge = s.people[d.who].grudges[0]?.reason;
  (pl.deeds ??= []).push(full);
}

// "you passed him over for the fleet, 403" -> "you passed him over for the fleet"
const grievance = (g?: string) => (g ? g.replace(/, \d+(\/\d+)?$/, "") : "he was wronged");
const factionWords = (s: GameState, f?: string) =>
  !f ? "someone close to you" : f === "ruler" || f === "family" ? "your own household" : s.factions[f as FactionId]?.short ?? "someone close to you";

export function clueWarning(s: GameState, pl: Plot): string {
  const c = (DATA.warnings as any).clues as Record<string, { far: string[]; near: string[] }>;
  const untold = (pl.deeds ?? []).filter((d) => !d.told);
  const d = untold[untold.length - 1];
  for (const x of untold) x.told = true; // older untold deeds are folded into this season's talk
  const kind = d?.kind ?? "quiet";
  const lines = c[kind] ?? c.quiet;
  const near = pl.stage >= 2;
  let text = pick(s, near ? lines.near : lines.far)
    .replace("{grudge}", grievance(d?.grudge))
    .replace("{faction}", factionWords(s, d?.faction))
    .replace("{target}", d?.target ? s.people[d.target].name : "someone");
  text = capital(text);
  if (pl.stage === 3) {
    const ns = pl.known.map((k) => s.people[k].name);
    const names = ns.length > 1 ? `${ns.slice(0, -1).join(", ")} and ${ns[ns.length - 1]}` : ns[0] ?? "no one yet";
    text = `${text} The names now spoken: ${names}.`;
  }
  return text;
}
