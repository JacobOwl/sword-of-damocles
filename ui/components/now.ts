// "What matters this season": one plain line at the top of the season and island screens, naming the most
// pressing thing in order: a blow that can fall, Carthage at your walls, an army or a city about to go hungry,
// the guard unpaid, a war, Carthage's anger near war. It reads the state and changes nothing.
import { quarrelsAgainstYou, yourQuarrels, armyName, capital, carthageArmy, nodeName, path, yourArmy, menWords } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";
import { esc } from "../lib/text.ts";
import { knownDanger } from "./ambient.ts";

const daysTo = (a: string, b: string) => (a === b ? 0 : path(a, b)?.days.at(-1) ?? 99);

export function whatMatters(g: GameState): { text: string; level: "danger" | "warn" | "calm" }[] {
  const out: { text: string; level: "danger" | "warn" | "calm" }[] = [];
  const d = knownDanger(g);
  if (d.ready) out.push({ text: "A plot you know of can strike at the end of this season. See Dangers.", level: "danger" });
  const ca = carthageArmy(g), ya = yourArmy(g);
  if (ca?.siege === "syracuse") out.push({ text: `${capital(armyName(g, ca))} is besieging Syracuse.`, level: "danger" });
  else if (ca && g.island) {
    const days = daysTo(ca.at, "syracuse");
    // Where your own army stands from theirs, so the player can judge a march without opening the map.
    const yours = !ya ? "" : ya.at === ca.at ? " Your army stands at the same place." : ` Your army is at ${nodeName(ya.at)}, ${daysTo(ya.at, ca.at)} days from it.`;
    out.push({ text: `${capital(armyName(g, ca))}, ${menWords(ca.men)}, is at ${nodeName(ca.at)}, ${days} days' march from Syracuse.${yours}`, level: days <= 6 ? "danger" : "warn" });
  }
  if (ya && ya.food <= 1) out.push({ text: `Your army at ${nodeName(ya.at)} has food for ${ya.food <= 0 ? "no more seasons: it must forage or come home" : "one more season"}.`, level: ya.food <= 0 ? "danger" : "warn" });
  // Next season's rations, less the harvest if it is summer next.
  const next = (g.season + 1) % 4, ration = g.granary ? 1 : 2;
  const after = g.grain - ration + (next === 3 ? 6 : 0);
  if (g.grain < 3) out.push({ text: `Syracuse has ${g.grain} months of grain. The hungry may riot.`, level: "danger" });
  else if (after < 3) out.push({ text: `Grain runs low next season (${Math.max(0, after)} months after rations${next === 3 ? " and the harvest" : ""}).`, level: "warn" });
  if (g.guard.arrearsSeasons) out.push({ text: "The guard is unpaid and will not defend you.", level: "danger" });
  if (g.island?.war && !ca) out.push({ text: "You are at war with Carthage, though its army is not on the island.", level: "warn" });
  if (g.island && !g.island.war && g.clock >= 8) out.push({ text: `Carthage's anger is ${g.clock} of 10: its council is close to war.`, level: "warn" });
  // Switch "quarrels": an oath whose day is this season.
  for (const q of quarrelsAgainstYou(g).filter((q) => q.due <= g.season)) out.push({ text: `${capital(g.people[q.by].name)}'s quarrel with you comes to its day this season. See Dangers.`, level: "warn" });
  for (const q of yourQuarrels(g).filter((q) => q.due <= g.season)) out.push({ text: `Your oath against ${g.people[q.against].name} must be made good this season, or the city will remember it. See Dangers.`, level: "warn" });
  if (!out.length && d.stage >= 1) out.push({ text: `A plot is forming (${["", "Whispers", "Rumors", "Named"][d.stage]}). See Dangers.`, level: "warn" });
  return out;
}

export function nowLine(g: GameState) {
  if (g.over) return "";
  const xs = whatMatters(g);
  if (!xs.length) return `<p class="now now-calm"><b>This season:</b> nothing presses. A season to build, win friends or look outward.</p>`;
  const [first, ...rest] = xs;
  return `<p class="now now-${first.level}"><b>This season:</b> ${esc(first.text)}${rest.length ? ` <span class="small">Also: ${esc(rest.map((x) => x.text.replace(/\.$/, "")).join("; "))}.</span>` : ""}</p>`;
}
