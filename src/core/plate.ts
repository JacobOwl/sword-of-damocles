// Switch "battlePlate" (war focus, council of 2026-11-27, question 5B): the same battle underneath, with your plan,
// a stratagem earned from the state of the game (never drawn at random), a reserve, and the enemy general's habit
// shown so the plan is a read of the enemy. Shapes from Diodorus (docs/research/war-and-towns.md); numbers invention.
import battleJson from "../../data/battle.json" with { type: "json" };
import { on } from "./switches.ts";
import { log, event, mood } from "./ops.ts";
import { PLAYER } from "./state.ts";
import { CARTHAGE, carthagePersonName, nodeDef } from "./island.ts";
import { card, weary } from "./war.ts";
import { d6 } from "./rng.ts";
import type { Army, GameState, Mod } from "./types.ts";

export const BATTLE = battleJson as any;
const K = BATTLE.knobs;
export const plateOn = (s: GameState) => on(s, "battlePlate") && !!s.island;
export const planDef = (id?: string) => BATTLE.plans.find((p: any) => p.id === id);

const habit = (s: GameState, foe: Army | undefined) => (foe ? CARTHAGE.people.find((p: any) => p.id === foe.commander)?.method : undefined);
export function habitLine(s: GameState, foe: Army | undefined): string {
  if (!foe) return "";
  const name = carthagePersonName(s, foe.commander);
  const m = habit(s, foe);
  return m === "force" ? `${name} is bold: he comes on hard and takes towns by force.` : m === "kindness" ? `${name} is careful: he wins towns by kindness and spares his men.` : `${name}'s habits are not known.`;
}

// The stratagems your army has earned now, from what it did and what you hold.
export function stratagems(s: GameState, a: Army, at = a.at): Mod[] {
  const m: Mod[] = [];
  if (a.side === "carthage") return a.moved !== s.season - 1 && a.since < s.season ? [{ label: "a night march: its men rested last season", value: 1 }] : [];
  if (a.moved !== s.season - 1 && a.since < s.season) m.push({ label: "a night march: your men rested last season", value: 1 });
  if (a.guard > 0 && s.factions.guard.mood <= 2) m.push({ label: "you send the men you distrust in first (the guard will resent it)", value: 1 });
  if (nodeDef(at)?.port && s.offices.fleet === PLAYER) m.push({ label: "your ships threaten their beach camp", value: 1 });
  return m.slice(0, 1); // one stratagem a battle: the first earned
}

// Your plan's modifiers (island.ts battleMods, your side only).
export function planMods(s: GameState, a: Army, foe: Army | undefined, at = a.at): Mod[] {
  if (!plateOn(s)) return [];
  if (a.side === "carthage") return stratagems(s, a, at); // Carthage's generals use the night too
  if (!a.plan) return []; // no plan set: your general fights his own way, and earns no stratagem
  const m: Mod[] = [];
  if (a.plan === "hold" && habit(s, foe) === "force") m.push({ label: "a firm line against a general who comes on hard", value: 1 });
  if (a.plan === "wing") { m.push({ label: "you strike a wing", value: 1 }); if (foe && a.men > foe.men) m.push({ label: "their line is thinner than yours", value: 1 }); }
  if (a.plan === "combined") m.push({ label: "a combined attack, if both parts arrive in time", value: 2 });
  if (a.reserve) m.push({ label: "a reserve held back", value: K.reserveMod });
  m.push(...stratagems(s, a, at));
  return m;
}

// During the battle (island.ts battle): the parts of a combined attack roll to arrive. Returns the change to the total.
export function combinedArrival(s: GameState, a: Army): number {
  if (!plateOn(s) || a.side !== "syracuse" || a.plan !== "combined") return 0;
  const rolls = [d6(s), d6(s)];
  const late = rolls.filter((r) => r <= K.lateOn).length;
  if (late) log(s, { actor: PLAYER, text: `${late === 2 ? "Both parts" : "One part"} of your combined attack came too late (rolled ${rolls.join(" and ")}).`, why: "as at Gela in 405, the parts of the army could not keep time (Diodorus 13.110.4)", visible: true, kind: "event" });
  return -2 * late;
}
// After the roll: holding the line turns a narrow defeat into a draw.
export const holdsToDraw = (s: GameState, a: Army, margin: number) => plateOn(s) && a.side === "syracuse" && a.plan === "hold" && margin <= K.holdDraw;
// A reserve turns a rout into a retreat to camp: smaller losses, and the army never scatters.
export const reserveSaves = (s: GameState, a: Army) => plateOn(s) && a.side === "syracuse" && !!a.reserve;

// After a battle: the stratagem's cost, and the chance the beaten general of Carthage falls (Magon at Cabala, 15.15.3-4).
export function afterBattle(s: GameState, mine: Army, foe: Army, won: boolean) {
  if (!plateOn(s)) return;
  if (mine.plan && stratagems(s, mine)[0]?.label.startsWith("you send the men you distrust")) mood(s, "guard", -1, "you sent them in first to be spent");
  if (won && d6(s) <= K.generalFallsOn) {
    const k = s.island!.carthage;
    const st = k.people[foe.commander];
    if (st && st.status !== "dead") {
      st.status = "dead";
      event(s, "carthage", `${carthagePersonName(s, foe.commander)} falls in the battle. Carthage's army loses heart.`, "its general was killed (as Magon fell at Cabala, Diodorus 15.15.3)");
      if (card(s)) weary(s, "carthage", K.generalFallsWeary, "its general fell in battle");
    }
  }
}
