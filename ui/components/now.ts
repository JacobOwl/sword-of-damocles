// "What matters this season": one plain line at the top of the season and island screens, naming the most
// pressing thing in order: a blow that can fall, Carthage at your walls, an army or a city about to go hungry,
// the guard unpaid, a war, Carthage's anger near war. It reads the state and changes nothing.
import { CARTHAGE, PLAYER, presetById, quarrelsAgainstYou, yourQuarrels, armyName, capital, carthageArmy, nodeName, path, yourArmy, menWords } from "../../src/core/index.ts";
import type { GameState } from "../../src/core/index.ts";
import { esc } from "../lib/text.ts";
import { knownDanger } from "./ambient.ts";
import { officeLost } from "./changed.ts";
import { foe } from "./foe.ts";

const daysTo = (a: string, b: string) => (a === b ? 0 : path(a, b)?.days.at(-1) ?? 99);

export function whatMatters(g: GameState): { text: string; level: "danger" | "warn" | "calm" }[] {
  const out: { text: string; level: "danger" | "warn" | "calm" }[] = [];
  const d = knownDanger(g);
  const lost = officeLost(g);
  if (lost) out.push({ text: lost, level: "danger" });
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
  else if (g.offices.treasury === PLAYER && g.silver < g.guard.upkeep) out.push({ text: `The guard's pay (${g.guard.upkeep} silver) is due at the end of this season and you have ${g.silver}. Raise silver (a levy, striking coin) or the guard goes unpaid.`, level: "danger" });
  if (g.island?.war && !ca) out.push({ text: "You are at war with Carthage, though its army is not on the island.", level: "warn" });
  // A season's warning before war (second test: "I just got into a war with carthage apparently? Not clear how").
  if (g.island && !g.island.war) {
    const W = CARTHAGE.numbers.warAnger as Record<string, number>;
    const NAME: Record<string, string> = { hundred: "the Hundred", people: "the people's assembly", elders: "the Elders" };
    const rises = g.season % 4 === 3 ? 1 : 0; // the yearly rise comes in the summer step (src/core/season.ts)
    const want = Object.entries(W).filter(([, n]) => g.clock >= n).map(([b]) => NAME[b]);
    const soon = Object.entries(W).filter(([, n]) => g.clock < n && g.clock + 1 >= n).map(([b]) => NAME[b]);
    if (want.length) out.push({ text: `Carthage's anger is ${g.clock} of 10: ${want.join(" and ")} want war now. If the blocs that want it hold most of the council's power, war comes.`, level: "danger" });
    else if (soon.length) out.push({ text: `Carthage's anger is ${g.clock} of 10. One more point and ${soon.join(" and ")} want war${rises ? "; it rises by 1 at the end of this season" : ""}. Taking its towns or tribute, raids and riots add to it.`, level: "warn" });
  }
  // Switch "quarrels": an oath whose day is this season.
  for (const q of quarrelsAgainstYou(g).filter((q) => q.due <= g.season)) out.push({ text: `${capital(g.people[q.by].name)}'s quarrel with you comes to its day this season. See Dangers.`, level: "warn" });
  for (const q of yourQuarrels(g).filter((q) => q.due <= g.season)) out.push({ text: `Your oath against ${g.people[q.against].name} must be made good this season, or the city will remember it. See Dangers.`, level: "warn" });
  const f = foe(g);
  if (f) out.push({ text: `${capital(f.p.name)} ${f.why}. See Coming for you, under Dangers.`, level: f.plot && f.plot.stage >= 3 ? "danger" : "warn" });
  if (!out.length && d.stage >= 1) out.push({ text: `A plot is forming (${["", "Whispers", "Rumors", "Named"][d.stage]}). See Dangers.`, level: "warn" });
  return out;
}

// The scenario's natural first goal (a preset's "aim"), shown until it is met: something to get you going.
const AIM_DONE: Record<string, (g: GameState) => boolean> = { citadelBuilt: (g) => !!g.citadelBuilt };
export function aimLine(g: GameState) {
  const aim = presetById(g.preset)?.aim;
  if (!aim || g.over) return "";
  const done = AIM_DONE[aim.done]?.(g) ?? false;
  if (done) return "";
  const begun = aim.id === "citadel" && g.building?.what === "citadel" ? " The work has begun: one more Build action finishes it." : aim.id === "citadel" ? " Use Build under Your actions (4 silver, then one more action to finish)." : "";
  return `<p class="now now-aim"><b>Your aim:</b> ${esc(aim.text.replace(/^Your first aim: /, ""))}${esc(begun)}</p>`;
}

export function nowLine(g: GameState) {
  return nowOnly(g) + aimLine(g);
}
function nowOnly(g: GameState) {
  if (g.over) return "";
  const xs = whatMatters(g);
  if (!xs.length) return `<p class="now now-calm"><b>This season:</b> nothing presses. A season to build, win friends or look outward.</p>`;
  const [first, ...rest] = xs;
  return `<p class="now now-${first.level}"><b>This season:</b> ${esc(first.text)}${rest.length ? ` <span class="small">Also: ${esc(rest.map((x) => x.text.replace(/\.$/, "")).join("; "))}.</span>` : ""}</p>`;
}
