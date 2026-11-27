// What the end of this season will take from and add to your silver and grain, for the ledger's hover breakdown
// (Jacob's first test: "I should be able to mouse over it and have income expenses listed"). It reads the state and
// changes nothing; the rules it mirrors are in season.ts (rations, harvest, fleet, laws, the guard's pay) and
// island.ts (allies' tribute, the levies' pay). Keep the two in step.
import { escorting } from "./fleets.ts";
import { lawById } from "./data.ts";
import { ISLAND, NODES, yourArmy } from "./island.ts";
import { convoysOn } from "./convoys.ts";
import { PLAYER, nameOf } from "./state.ts";
import type { GameState } from "./types.ts";

export interface Flow { label: string; value: number; maybe?: boolean }

export function storesForecast(s: GameState): { silver: Flow[]; grain: Flow[] } {
  const silver: Flow[] = [], grain: Flow[] = [];
  const q = s.season % 4;
  grain.push({ label: s.granary ? "rations (the granary saves 1)" : "rations", value: s.granary ? -1 : -2 });
  if (q === 3) grain.push({ label: "the summer harvest", value: 6 });
  if (q === 1) {
    const h = s.offices.fleet;
    const friendly = h && (h === PLAYER || (s.people[h].status === "free" && s.people[h].opinion >= 0));
    const damaged = s.flags.fleetDamaged !== undefined && s.season - s.flags.fleetDamaged < 3;
    if (friendly && !damaged && !convoysOn(s) && escorting(s)) grain.push({ label: `${h === PLAYER ? "your" : `${nameOf(s, h!)}'s`} fleet brings grain`, value: 2 });
  }
  for (const id of s.laws) {
    const l = lawById(id)!;
    if (l.income) silver.push({ label: l.name, value: l.income });
    if (l.grain) grain.push({ label: l.name, value: l.grain });
  }
  const payer = s.offices.treasury;
  if (payer === PLAYER) silver.push({ label: "the guard's pay", value: -s.guard.upkeep });
  else if (payer && s.people[payer].status === "free" && s.people[payer].opinion >= 1) silver.push({ label: `the guard's pay, paid out by ${nameOf(s, payer)}`, value: -s.guard.upkeep });
  else if (payer) silver.push({ label: `the guard's pay (${nameOf(s, payer)} holds the treasury and may hold it back)`, value: -s.guard.upkeep, maybe: true });
  if (s.island) {
    const R = ISLAND.rules;
    const ya = yourArmy(s);
    if (ya) { const pay = Math.ceil(Math.max(0, ya.men - ya.guard) / R.upkeepPerPoints); if (pay) silver.push({ label: "the levies' pay in the field", value: -pay }); }
    if (q === 3) {
      const payers = NODES.filter((n) => n.id !== "syracuse").filter((n) => {
        const c = s.island!.cities[n.id];
        return (c.side === "ally" || c.side === "syracuse") && c.grain >= 2 && !s.island!.armies.some((a) => a.siege === n.id);
      });
      if (payers.length) silver.push({ label: `tribute from ${payers.map((n) => n.name).join(", ")}`, value: payers.length * R.allySilver });
    }
  }
  return { silver, grain };
}
