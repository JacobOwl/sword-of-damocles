// Your actions on the island (Phase 2). Names, costs and texts are in data/actions.json (scenario "island");
// the rules are here. actions.ts adds these to the menu.
import { PLAYER, capital, holds } from "./state.ts";
import { event, silver, grain, clock } from "./ops.ts";
import {
  ISLAND, NODES, assault, assaultMods, assaultNeed, bloc, city, cityWalls, disband, friendly, march, menWords, muster, musterSize,
  nodeName, path, reachable, sideName, yourArmy, carthageArmy, hostileTo, armyName, punicHeld,
} from "./island.ts";
import { endWar, startWar } from "./carthage.ts";
import { applyTerms, card, carthageAccepts, termsFor, termsText } from "./war.ts";
import { TOWNS, courtHouse, courtHouseMods, courtableSeat, houseName, seatsOf } from "./towns.ts";
import type { Args, GameState, Mod } from "./types.ts";
import { townHold, useHold, townLeader, SECRETS } from "./secrets.ts";
import { campaignCheck, commanderOptions, commissionOn, keeperOptions, musterNotes, startCampaign } from "./commission.ts";

const R = ISLAND.rules;
interface Option { value: string; label: string }
interface Impl {
  target?: (s: GameState) => Option[];
  targetLabel?: string;
  third?: (s: GameState, a: Args) => Option[];
  thirdLabel?: string;
  notes?: (s: GameState, a: Args) => string[];
  second?: (s: GameState, a: Args) => Option[];
  secondLabel?: string;
  check?: (s: GameState, a: Args) => string | null;
  odds?: (s: GameState, a: Args) => Mod[] | null;
  need?: number;
  run: (s: GameState, a: Args, ok: boolean, die: number) => void;
}
// Switch "commission": you may raise and order the army without the generalship (at a price shown on the muster).
const general = (s: GameState) => (holds(s, PLAYER, "generalship") || commissionOn(s) ? null : "you don't hold the generalship");

export const ISLAND_IMPL: Record<string, Impl> = {
  muster: {
    target: (s) => (commissionOn(s) ? commanderOptions(s) : undefined) as Option[],
    third: (s, a) => (commissionOn(s) ? keeperOptions(s, a) : []),
    targetLabel: "Who leads it",
  thirdLabel: "Keeper of the citadel",
    notes: musterNotes,
    second: (s) => !s.island ? [] : [
      { value: "levy", label: `The levies only (${menWords(musterSize(s, false).total)}; the guard stays at your door)` },
      { value: "guard", label: `The levies and the guard (${menWords(musterSize(s, true).total)}; your defense loses the guard)` },
    ],
    secondLabel: "Who marches",
    check: (s) => general(s) ?? (yourArmy(s) ? "your army is already in the field: men can't be added to it there. Bring it home to a town of yours and disband it, then muster again" : s.silver < 2 ? "needs 2 silver" : s.grain < R.grainOnMuster ? `needs ${R.grainOnMuster} months of grain` : null),
    run: (s, a) => {
      silver(s, -2, "mustering the army");
      grain(s, -R.grainOnMuster, "food for the army's baggage");
      muster(s, a.second === "guard");
      if (commissionOn(s)) startCampaign(s, a.target!, a.option);
    },
  },
  sendArmy: {
    target: (s) => {
      const a = s.island && yourArmy(s);
      if (!a) return [];
      return reachable(s, a.at).map((id) => {
        const c = city(s, id);
        const d = path(a.at, id)!.days.at(-1);
        const foe = s.island!.armies.find((o) => o.side !== "syracuse" && o.at === id);
        return { value: id, label: `${nodeName(id)} (${d} days; ${sideName(c.side)}${foe ? `; ${armyName(s, foe)} is there` : ""})` };
      });
    },
    second: (s, a) => {
      const c = a.target && s.island ? city(s, a.target) : undefined;
      if (!c || friendly("syracuse", c.side)) return [{ value: "spare", label: "Simply march there" }];
      return [{ value: "spare", label: "If it falls, spare it" }, { value: "sack", label: "If it falls, sack it (loot, but every free town will fear and hate you)" }];
    },
    secondLabel: "Orders",
    check: (s) => general(s) ?? (!yourArmy(s) ? "you have no army in the field" : yourArmy(s)!.moved === s.season ? "the army has marched this season" : null),
    run: (s, a) => {
      const army = yourArmy(s)!;
      army.onTake = a.second === "sack" ? "sack" : "spare";
      const c = city(s, a.target!);
      march(s, army, a.target!, hostileTo(s, "syracuse", c.side) ? `you sent it against ${nodeName(a.target!)}` : `you sent it to ${nodeName(a.target!)}`);
    },
  },
  assault: {
    check: (s) => {
      const a = yourArmy(s);
      return general(s) ?? (!a?.siege ? "your army is not besieging a city" : a.siegeSince === s.season ? "the siege lines need a season first" : s.flags.assaulted === s.season ? "the army has stormed once this season" : null);
    },
    odds: (s) => assaultMods(s, yourArmy(s)!),
    need: assaultNeed(),
    run: (s, _a, ok) => { s.flags.assaulted = s.season; assault(s, yourArmy(s)!, ok); },
  },
  forage: {
    check: (s) => {
      const a = yourArmy(s);
      if (general(s)) return general(s);
      if (!a) return "you have no army in the field";
      if (friendly("syracuse", city(s, a.at).side)) return "your army is in friendly country";
      if (a.food >= R.foodMax) return "the baggage is full";
      return null;
    },
    run: (s) => {
      const a = yourArmy(s)!;
      a.food = Math.min(R.foodMax, a.food + 1);
      event(s, PLAYER, `Your army strips the farms around ${nodeName(a.at)} (food for one more season).`, "Forage");
      const c = city(s, a.at);
      c.grain = Math.max(0, c.grain - 2);
      c.lean = Math.max(-3, c.lean - 1);
      event(s, "world", `${nodeName(a.at)} loses 2 months of grain and hates you more for it.`, "your army foraged its land");
    },
  },
  disband: {
    check: (s) => {
      const a = yourArmy(s);
      if (!a) return "you have no army in the field";
      return friendly("syracuse", city(s, a.at).side) ? null : "the army must be in a city of yours to disband";
    },
    run: (s) => { disband(s, yourArmy(s)!); campaignCheck(s); },
  },
  embassyCity: {
    target: (s) => !s.island ? [] : NODES.filter((n) => ["free", "tributary"].includes(city(s, n.id).side) && !s.island!.armies.some((a) => a.siege === n.id))
      .map((n) => ({ value: n.id, label: `${n.name} (${sideName(city(s, n.id).side)})` })),
    check: (s) => (s.silver < 1 ? "needs 1 silver" : null),
    odds: (s, a) => {
      const c = city(s, a.target!);
      const m: Mod[] = [];
      if (c.lean) m.push({ label: c.lean > 0 ? `${nodeName(c.id)} leans your way` : `${nodeName(c.id)} leans against you`, value: c.lean });
      if (c.fear) m.push({ label: "they fear your army", value: c.fear });
      if (punicHeld(s, c.id)) m.push({ label: "Carthage's men still hold it", value: -2 });
      else if (s.island!.war && c.side === "tributary") m.push({ label: "at war, the tribute towns want to be free", value: 1 });
      const ya = yourArmy(s);
      if (ya && (ya.at === c.id || (path(ya.at, c.id)?.days.at(-1) ?? 99) <= 6)) m.push({ label: "your army is near", value: 1 });
      const ca = carthageArmy(s);
      if (ca && (ca.at === c.id || (path(ca.at, c.id)?.days.at(-1) ?? 99) <= 6)) m.push({ label: "Carthage's army is near", value: -2 });
      if (c.side === "tributary" && !s.island!.war) m.push({ label: "they fear Carthage's anger", value: -1 });
      if (townHold(s, c.id)) m.push({ label: "you hold a secret over its first man", value: SECRETS.knobs.embassyHold });
      return m;
    },
    need: R.embassyNeed,
    run: (s, a, ok) => {
      silver(s, -1, "gifts for the embassy");
      const c = city(s, a.target!);
      if (townHold(s, c.id)) useHold(s, PLAYER, townLeader(s, c.id)!, "your envoys remind its first man what you know");
      const prev = c.side;
      if (!ok) { event(s, PLAYER, `${nodeName(c.id)} sends your envoys home with nothing.`, "Embassy failed"); return; }
      c.side = "ally";
      c.since = s.season;
      c.lean = Math.max(c.lean, 1);
      s.counters.alliances = (s.counters.alliances ?? 0) + 1;
      event(s, PLAYER, `${nodeName(c.id)} becomes your ally.`, "Embassy to a city");
      if (prev === "tributary") { clock(s, R.angerEmbassyDefect, `${nodeName(c.id)} stopped paying Carthage`); s.flags.tributeLost = s.season; }
    },
  },
  declareWar: {
    check: (s) => (s.island!.war ? "you are already at war" : null),
    run: (s) => {
      s.flags.atWar = s.season;
      clock(s, 10, "you declared war");
      startWar(s, "You declare war on Carthage.", "Declare war on Carthage");
      bloc(s, "people", -1, "Syracuse has declared war");
    },
  },
  acceptPeace: {
    check: (s) => (!s.island!.war ? "you are not at war" : s.island!.carthage.offer < s.season - 1 ? "Carthage has offered no terms" : card(s) && !card(s)!.terms ? "you sent Carthage's envoys home" : null),
    run: (s) => {
      const c = card(s); // switch "warFocus": the envoys' terms
      if (c?.terms) { const t = c.terms; applyTerms(s, t, "you accepted Carthage's terms"); endWar(s, "you accepted Carthage's terms", termsText(t)); }
      else endWar(s, "you accepted Carthage's terms");
    },
  },
  // Switch "warFocus": you send envoys with the terms the war's ledger supports; Carthage takes them only if weary or losing.
  // Switch "townBoards": court the highest house of a town that is not yet yours.
  courtHouse: {
    target: (s) => NODES.filter((n) => n.id !== "syracuse" && courtableSeat(s, n.id) >= 0 && !s.island!.armies.some((a) => a.siege === n.id))
      .map((n) => ({ value: n.id, label: `${n.name}: ${houseName(s, seatsOf(s, n.id)[courtableSeat(s, n.id)])}` })),
    check: (s) => (s.silver < TOWNS.knobs.courtCost ? `needs ${TOWNS.knobs.courtCost} silver` : null),
    odds: (s, a) => courtHouseMods(s, a.target!),
    need: TOWNS.knobs.courtNeed,
    run: (s, a, ok) => courtHouse(s, a.target!, ok),
  },
  offerPeace: {
    notes: (s) => (card(s) ? [`Your terms would be: ${termsText(termsFor(s, "syracuse"))}`] : []),
    check: (s) => (!s.island!.war ? "you are not at war" : !card(s) ? "not in this game" : s.flags.peaceOffered === s.season ? "your envoys are already on their way" : null),
    run: (s) => {
      s.flags.peaceOffered = s.season;
      const t = termsFor(s, "syracuse");
      const r = carthageAccepts(s);
      if (r.ok) { event(s, PLAYER, `Your envoys put your terms to Carthage's council, and it accepts: ${r.why}.`, "Offer peace"); applyTerms(s, t, "the peace you offered"); endWar(s, "the peace you offered", termsText(t)); }
      else event(s, PLAYER, `Your envoys put your terms to Carthage's council, and it refuses: ${r.why}.`, "Offer peace");
    },
  },
};

// The plain words for a city's state, for the UI and the bots.
export function cityLine(s: GameState, id: string): string {
  const c = city(s, id);
  const w = cityWalls(s, id);
  return `${capital(sideName(c.side))}; ${w ? `walls ${w}` : "no walls"}; ${c.grain} months of grain`;
}
