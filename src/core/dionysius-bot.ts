// The Dionysius bot (story museum, bet B1): a headless player whose priorities are what Diodorus says
// Dionysius I did in 405 to 396 BC, each tied to a passage quoted in docs/research/dionysius-bot.md.
// It is a report only. Nothing is tuned toward how it fares, and it is not one of the balance bots.
// Like the other bots it sees only what the screen shows and goes through the same menu as you.
import { PLAYER, holds, others } from "./state.ts";
import { islandChoices } from "./island-bot.ts";
import type { Bot, Choice } from "./bots.ts";
import type { GameState, OfficeId } from "./types.ts";

// Each priority names its passage, so the report can say which of his habits the game rewards or punishes.
export const DIONYSIUS_PRIORITIES: { id: string; cite: string; what: string }[] = [
  { id: "arrest", cite: "Diodorus 14.45.1", what: "Before his marriages he put enemies to death or banished them, \"as had been his practice\"." },
  { id: "citadel", cite: "Diodorus 14.7.2-3", what: "He walled off the Island and built a fortified acropolis on it." },
  { id: "hire", cite: "Diodorus 14.10.4", what: "He \"collected a great number of mercenaries\"." },
  { id: "guardLand", cite: "Diodorus 14.7.4-5", what: "He gave the best land to friends and officers, and the houses on the Island to friends and mercenaries." },
  { id: "disarm", cite: "Diodorus 14.10.4", what: "At harvest he entered the citizens' homes and carried off their arms." },
  { id: "wall", cite: "Diodorus 14.18.2-8", what: "He walled Epipolae with sixty thousand men in twenty days." },
  { id: "chalcidians", cite: "Diodorus 14.14.1-2, 14.15.1-3", what: "He took Aetna, marched on Leontini, took Catana and Naxos by betrayal and sold their people." },
  { id: "marry", cite: "Diodorus 14.44.6-8", what: "He married Doris of Locri and Aristomache of Syracuse on the same day." },
  { id: "dinners", cite: "Diodorus 14.45.1", what: "After the marriages he gave public dinners for the soldiers and most of the citizens and ruled \"in more humane fashion\"." },
  { id: "war", cite: "Diodorus 14.45.2-5, 14.47.1-2", what: "With his preparations made, he had the assembly vote for war and sent Carthage a herald." },
];

const married = (s: GameState) => !!s.people[PLAYER]?.married;
const free = (s: GameState) => others(s).filter((p) => p.status === "free");
const prepared = (s: GameState) => s.citadelBuilt && s.walls && s.guard.strength >= 4;

export const dionysiusBot: Bot = {
  id: "dionysius", name: "Dionysius, as Diodorus tells it",
  summary: "Fortifies the Island, hires mercenaries and gives them houses, disarms the citizens, walls Epipolae, takes the Chalcidian towns, marries, then turns gentler and makes war on Carthage.",
  choices: (s) => {
    const out: Choice[] = [];
    // Upkeep any ruler needs (not from the sources): pay the guard, keep grain above a riot.
    if (s.building) out.push({ a: "build", args: { target: s.building.what } });
    if (s.guard.owed > 0) out.push({ a: "payGuard" });
    if (s.grain < (s.season % 4 === 2 ? 3 : 5) && s.silver >= 1) out.push({ a: "buyGrain" });
    // 14.45.1: before the marriages, enemies he held were put to death; known plotters were taken.
    if (!married(s)) for (const p of others(s).filter((p) => p.status === "held" && p.rival)) out.push({ a: "execute", args: { target: p.id } });
    // The same passage: men who wanted his place were banished while the old practice held.
    if (!married(s)) for (const p of free(s).filter((p) => (p.political?.rank ?? 0) >= 2)) out.push({ a: "exile", args: { target: p.id }, min: 0.34 });
    for (const pl of s.plots) for (const m of pl.known) if (s.people[m].status === "free") out.push({ a: married(s) ? "pardon" : "imprison", args: { target: m }, min: 0.34 });
    // 14.7.2-3: the Island and its acropolis first.
    if (!s.citadelBuilt && s.silver >= 4) out.push({ a: "build", args: { target: "citadel" } });
    // 14.10.4: a great number of mercenaries.
    if (s.silver >= 2 + s.guard.upkeep && s.guard.strength < 7) out.push({ a: "hire" });
    // 14.7.4-5: land and houses to the mercenaries.
    if (s.land > 0 && s.factions.guard.mood <= 3) out.push({ a: "grantGuard" });
    // 14.10.4: the citizens' arms, taken while they were at the harvest.
    if (!s.factions.citizens.disarmed && s.citadelBuilt) out.push({ a: "disarm", min: 0.5 });
    // 14.18: the Epipolae wall.
    if (s.citadelBuilt && !s.walls && s.silver >= 3) out.push({ a: "build", args: { target: "wall" } });
    // 14.14-15: the Chalcidian towns and Aetna, the towns sold; on the island map, the iron hand's sacking style.
    if (s.island && (!s.island.war || prepared(s))) out.push(...islandChoices(s, { sack: !married(s) }));
    else if (s.island) out.push(...islandChoices(s, { sack: false }));
    // 14.44.6-8: the double marriage, once the tyranny is set up.
    if (!married(s) && s.citadelBuilt) {
      const house = free(s).filter((p) => p.marriageable && !p.married && p.opinion >= 0).sort((a, b) => b.opinion - a.opinion)[0];
      if (house) out.push({ a: "marriage", args: { target: house.id, second: PLAYER } });
    }
    // 14.45.2-5, 14.47: war on Carthage once prepared and married.
    if (s.island && !s.island.war && prepared(s) && married(s)) out.push({ a: "declareWar" });
    // 14.45.1: after the marriages, dinners and gentler rule.
    if (married(s)) {
      if (s.grain >= 7) out.push({ a: "grainHandout" });
      const cool = free(s).sort((a, b) => a.opinion - b.opinion)[0];
      if (cool && s.silver >= 2) out.push({ a: "feast", args: { target: cool.id } });
    }
    // Silver for all of it (not from the sources): the mint and levies.
    if (holds(s, PLAYER, "mint" as OfficeId)) out.push({ a: "strikeCoin" });
    if (!s.laws.includes("harbourDues")) out.push({ a: "proposeLaw", args: { target: "harbourDues" }, min: 0.34 });
    if (s.silver < 4) { out.push({ a: "strikeCoin" }); out.push({ a: "proposeLaw", args: { target: "levyRich" }, min: 0.34 }); }
    return out;
  },
};
