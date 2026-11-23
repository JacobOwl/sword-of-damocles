// Switch "convoys", Grain and the sea (off by default; island games only). Grain and silver cross the sea as
// convoys: objects with a cargo, a start, an end and a season at sea, that the map shows and the log explains.
//   Yours: grain bought abroad, the fleet's winter grain and your allies' surplus sail to Syracuse; grain sails to
//   your army on the coast. Each one bought by the city is run by a contractor, the head of one of the rich houses
//   (the generated cast), who may skim it, or at war and in a bad mood sell it to Carthage.
//   Carthage's: grain for its army on the coast (before, its ships fed the army by magic), and each spring the pay
//   for its mercenaries in Sicily. Caught, its grain feeds Syracuse and its silver fills your treasury.
// The sea: a convoy that sails in winter may be wrecked or held in port; at war, an enemy fleet may catch it with the
// same roll your fleet makes against Carthage's transports (5 or more), harder if warships escort it.
// Every number is in data/convoys.json; the sourced pattern is in docs/research/grain-and-sea.md. The rules are invention.
import convoysJson from "../../data/convoys.json" with { type: "json" };
import { on } from "./switches.ts";
import { d6 } from "./rng.ts";
import { PLAYER, capital, nameOf } from "./state.ts";
import { event, grain, log, mood, silver, nextId } from "./ops.ts";
import { ISLAND, armyName, carthageArmy, city, cityGrainChange, friendly, loseMen, nodeName, yourArmy } from "./island.ts";
import { councilOf, censusPersonName } from "./census-game.ts";
import type { Args, Contractor, Convoy, ConvoyState, GameState, Mod } from "./types.ts";

export const CONVOYS = convoysJson as any;
const K = () => CONVOYS.knobs as Record<string, number>;
export const LANDINGS = CONVOYS.landings as string[];
const R = ISLAND.rules;
interface Option { value: string; label: string }

export const convoysOn = (s: GameState) => !!s.island && on(s, "convoys");
const count = (s: GameState, k: string, by = 1) => { s.counters[k] = (s.counters[k] ?? 0) + by; };
const sum = (m: Mod[]) => m.reduce((x, y) => x + y.value, 0);
const modText = (m: Mod[]) => m.map((x) => ` ${x.value >= 0 ? "+" : "-"}${Math.abs(x.value)} ${x.label}`).join("");
const months = (n: number) => `${n} ${n === 1 ? "month" : "months"} of grain`;
export const placeName = (id: string) => CONVOYS.places[id] ?? nodeName(id);

function cs(s: GameState): ConvoyState {
  return (s.convoys ??= { fleet: [], done: [], contractors: {}, caught: {} });
}
export const atSea = (s: GameState) => s.convoys?.fleet ?? [];
export const pastConvoys = (s: GameState) => s.convoys?.done ?? [];

// ---------- The contractors: heads of the rich houses of Syracuse ----------
export function contractorName(s: GameState, id: string | undefined) {
  return id ? censusPersonName(s, id) : "the fleet";
}
export function contractorRole(s: GameState, id: string) {
  return s.census?.people[id]?.role ?? "";
}
const record = (s: GameState, id: string): Contractor => (cs(s).contractors[id] ??= { id, runs: 0, skimmed: 0, short: 0, sold: 0, barred: false, audited: -99 });
export function contractors(s: GameState): string[] {
  const st = s.convoys?.contractors ?? {};
  return councilOf(s, "rich").filter((id) => s.census?.people[id]?.alive && !st[id]?.barred);
}
// The man the city's agents pick when you don't choose: the fewest shortfalls seen for his runs, then the first house.
export function autoContractor(s: GameState): string | undefined {
  const st = s.convoys?.contractors ?? {};
  return contractors(s).slice().sort((a, b) => (st[a]?.short ?? 0) + (st[a]?.sold ?? 0) - (st[b]?.short ?? 0) - (st[b]?.sold ?? 0))[0];
}
export function contractorLine(s: GameState, id: string): string {
  const r = s.convoys?.contractors[id];
  const role = contractorRole(s, id);
  const runs = r?.runs ?? 0;
  const rec = !runs ? "no convoys yet" : `${runs} ${runs === 1 ? "convoy" : "convoys"}${r!.short ? `, ${r!.short} came short` : ", none short"}${r!.sold ? `, ${r!.sold} lost and said to be sold` : ""}`;
  return `${capital(contractorName(s, id))}${role ? `, ${role}` : ""} (${rec})`;
}
export function contractorOptions(s: GameState): Option[] {
  return contractors(s).map((id) => ({ value: id, label: contractorLine(s, id) }));
}

// ---------- Sailing ----------
function sail(s: GameState, c: Omit<Convoy, "id" | "sailed" | "due" | "status">): Convoy {
  const v: Convoy = { id: nextId(s, "convoy"), sailed: s.season, due: s.season + 1, status: "atSea", ...c };
  cs(s).fleet.push(v);
  count(s, v.side === "syracuse" ? "convoysSent" : "carthageConvoys");
  if (v.contractor) record(s, v.contractor).runs += 1;
  const who = v.contractor ? `, run by ${contractorName(s, v.contractor)}` : "";
  const what = v.cargo === "grain" ? months(v.amount) : `${v.amount} silver`;
  log(s, { actor: v.side === "syracuse" ? (v.contractor ? "rich" : PLAYER) : "carthage", text: `A convoy sails from ${placeName(v.from)} for ${placeName(v.to)} with ${what}${who}. It is due next season.`, why: v.why, visible: true, kind: "event" });
  return v;
}

// Grain bought abroad (the action "Buy grain abroad", with the switch on): it sails now and lands next season.
export function buyGrainConvoy(s: GameState, contractor?: string) {
  const k = K();
  const who = contractor && contractors(s).includes(contractor) ? contractor : autoContractor(s);
  sail(s, { side: "syracuse", cargo: "grain", amount: k.boughtGrain, from: "overseas", to: "syracuse", purpose: "bought", contractor: who, why: "you bought grain abroad" });
}

// The world step: what sails this season (after the armies have eaten, so a convoy lands before the next meal).
export function convoysSail(s: GameState) {
  if (!convoysOn(s)) return;
  const k = K();
  const isl = s.island!;
  const q = s.season % 4;
  // The fleet's winter grain, which before landed at once (season.ts), now sails.
  if (q === 1 && fleetFriendly(s)) {
    const h = s.offices.fleet!;
    sail(s, { side: "syracuse", cargo: "grain", amount: k.fleetGrain, from: "overseas", to: "syracuse", purpose: "fleet", why: `${h === PLAYER ? "your" : nameOf(s, h) + "'s"} fleet fetches grain` });
  }
  // After the harvest, your allies' ports with grain to spare sell it to Syracuse's merchants.
  if (q === 3) {
    for (const id of LANDINGS) {
      if (id === "syracuse") continue;
      const c = city(s, id);
      if (!["ally", "syracuse"].includes(c.side) || c.grain < k.surplusAt || isl.armies.some((a) => a.siege === id)) continue;
      const who = autoContractor(s);
      cityGrainChange(s, id, -k.surplusSent, "its surplus is shipped to Syracuse");
      sail(s, { side: "syracuse", cargo: "grain", amount: k.surplusSent, from: id, to: "syracuse", purpose: "surplus", contractor: who, why: `${nodeName(id)} has grain to spare after the harvest (${c.grain + k.surplusSent} months)` });
    }
  }
  // Carthage feeds an army on the coast by sea, if it has the ships.
  const ca = carthageArmy(s);
  const c = isl.carthage;
  if (ca && LANDINGS.includes(ca.at) && ca.food < R.foodOnMuster && c.ships >= k.carthageMinShips && !atSea(s).some((v) => v.army === ca.id && v.cargo === "grain")) {
    sail(s, { side: "carthage", cargo: "grain", amount: k.carthageArmyGrain, from: "carthage", to: ca.at, army: ca.id, purpose: "army", why: `${armyName(s, ca)} at ${nodeName(ca.at)} has ${ca.food <= 0 ? "no food left" : `food for ${ca.food} ${ca.food === 1 ? "season" : "seasons"}`}` });
  }
  // Each spring, the pay for Carthage's mercenaries in Sicily crosses the sea, or does not come at all.
  if (ca && q === 2) {
    if (c.silver >= k.carthagePay) {
      c.silver -= k.carthagePay;
      sail(s, { side: "carthage", cargo: "silver", amount: k.carthagePay, from: "carthage", to: LANDINGS.includes(ca.at) ? ca.at : "panormus", army: ca.id, purpose: "pay", why: "a year's pay for the mercenaries in Sicily" });
    } else unpaid(s, ca.id, "Carthage's treasury is empty");
  }
  hungerCheck(s);
}

// ---------- At sea: storms, enemy fleets, the contractor, and landing ----------
export function fleetFriendly(s: GameState): boolean {
  const f = s.offices.fleet;
  if (!f || (s.flags.fleetDamaged !== undefined && s.season - s.flags.fleetDamaged < 3)) return false;
  return f === PLAYER || (s.people[f]?.status === "free" && s.people[f].opinion >= 0);
}
// The odds an enemy fleet catches this convoy, from the same numbers the arrival uses (null: no enemy fleet hunts).
export function catchMods(s: GameState, v: Convoy): Mod[] | null {
  const k = K();
  if (!s.island!.war) return null;
  if (v.side === "syracuse") {
    if (s.island!.carthage.ships < k.carthageHuntShips) return null;
    return fleetFriendly(s) ? [{ label: "your warships escort it", value: -k.escort }] : [];
  }
  return fleetFriendly(s) ? [] : null;
}
export function contractorMods(s: GameState, id: string): Mod[] {
  const r = s.convoys?.contractors[id] ?? { skimmed: 0, audited: -99 };
  const p = s.census?.people[id];
  const m: Mod[] = [];
  if (p?.traits.includes("greedy")) m.push({ label: "he is greedy", value: 1 });
  if (p?.traits.includes("dutiful")) m.push({ label: "he is dutiful", value: -1 });
  if (s.factions.rich.mood <= 1) m.push({ label: "the rich families are angry with you", value: 1 });
  if (r.skimmed > 0 && r.audited < s.season - K().auditedSeasons) m.push({ label: "he got away with it before", value: 1 });
  if (s.season - r.audited < K().auditedSeasons) m.push({ label: "you audited him lately", value: -2 });
  return m;
}

function close(s: GameState, v: Convoy, status: Convoy["status"], fate: string) {
  v.status = status;
  v.fate = fate;
  const st = cs(s);
  st.fleet = st.fleet.filter((x) => x !== v);
  st.done.push(v);
}

export function convoysArrive(s: GameState) {
  if (!convoysOn(s)) return;
  const k = K();
  for (const v of atSea(s).slice()) {
    if (v.due > s.season) continue;
    const who = v.side === "syracuse" ? PLAYER : "carthage";
    const name = v.cargo === "grain" ? `the grain convoy from ${placeName(v.from)}` : "the pay convoy from Carthage";
    // Winter storms (one roll, for a convoy that sailed in winter).
    if (v.sailed % 4 === 1 && v.due === v.sailed + 1) {
      const die = d6(s);
      if (die <= k.stormWreck) {
        count(s, "convoysWrecked");
        event(s, "world", `A winter storm sinks ${name}.`, `it sailed in winter (rolled ${die}; wrecked on ${k.stormWreck}, held in port on ${k.stormLate})`);
        close(s, v, "wrecked", "sunk by a winter storm");
        if (v.purpose === "pay" && v.army) unpaid(s, v.army, "their pay went down in a storm");
        continue;
      }
      if (die <= k.stormLate) {
        count(s, "convoysLate");
        v.due += 1;
        log(s, { actor: "world", text: `Winter storms hold ${name} in port. It will come a season late.`, why: `it sailed in winter (rolled ${die}; held in port on ${k.stormLate} or less)`, visible: true, kind: "event" });
        continue;
      }
    }
    // An enemy fleet.
    const m = catchMods(s, v);
    if (m) {
      const die = d6(s);
      const t = die + sum(m);
      const caught = t >= k.catchNeed;
      const hunter = v.side === "syracuse" ? "Carthage's ships" : s.offices.fleet === PLAYER ? "Your fleet" : `${capital(nameOf(s, s.offices.fleet!))}'s ships`;
      log(s, { actor: v.side === "syracuse" ? "carthage" : s.offices.fleet!, text: `${hunter} lie in wait for ${name}: rolled ${die}${modText(m)} = ${t}, needs ${k.catchNeed}. ${caught ? "They catch it." : "It slips past."}`,
        why: "at war, warships hunt the convoys", visible: true, kind: "roll", roll: { die, mods: m, total: t, need: k.catchNeed, ok: caught } });
      if (caught) { catchIt(s, v, name); continue; }
    }
    // Your contractor.
    let amount = v.amount;
    if (v.contractor) {
      const r = record(s, v.contractor);
      const cm = contractorMods(s, v.contractor);
      const die = d6(s);
      const t = die + sum(cm);
      const cn = capital(contractorName(s, v.contractor));
      log(s, { actor: "rich", text: `${cn}'s honesty: rolled ${die}${modText(cm)} = ${t}; he skims on ${k.skimNeed}, sells it on ${k.sellNeed} at war.`, why: "he runs the convoy", visible: false, kind: "roll", roll: { die, mods: cm, total: t, need: k.skimNeed, ok: t >= k.skimNeed } });
      if (t >= k.sellNeed && s.island!.war && s.factions.rich.mood <= 1) {
        r.sold += 1; r.skimmed += v.amount;
        count(s, "convoysSold");
        s.island!.carthage.silver += 1;
        event(s, who, `${capital(name)} never reaches ${nodeName(v.to)}. ${cn} says pirates took it; in the agora men say his agents sold it to Carthage at Motya.`, "the convoy did not come");
        log(s, { actor: "rich", text: `${cn} sold the grain to Carthage's agents (+1 silver to Carthage).`, why: `the rich families are angry with you, and at war Carthage pays well (rolled ${t})`, visible: false, kind: "event" });
        close(s, v, "sold", `lost; ${cn} says pirates, the agora says sold to Carthage`);
        continue;
      }
      if (t >= k.skimNeed) {
        amount -= 1; r.skimmed += 1; r.short += 1; v.skimmed = 1;
        count(s, "convoysSkimmed");
        log(s, { actor: "rich", text: `${cn} keeps back ${months(1)} and sells it on the quay.`, why: `${cm.filter((x) => x.value > 0).map((x) => x.label).join(", ") || "the chance was there"} (rolled ${t})`, visible: false, kind: "event" });
        event(s, who, `${capital(name)} lands ${months(1)} short. ${cn} says seawater spoiled it.`, "the count at the granary came short");
      } else if (die === 1) {
        amount -= 1; r.short += 1;
        count(s, "convoysSpoiled");
        log(s, { actor: "world", text: `Seawater got into the holds.`, why: "bad luck at sea (an honest loss)", visible: false, kind: "event" });
        event(s, who, `${capital(name)} lands ${months(1)} short. ${cn} says seawater spoiled it.`, "the count at the granary came short");
      }
    }
    land(s, v, Math.max(0, amount), name);
  }
}

function catchIt(s: GameState, v: Convoy, name: string) {
  if (v.side === "syracuse") {
    count(s, "convoysCaught");
    event(s, PLAYER, `Carthage's ships take ${name}.`, "they caught it at sea");
    close(s, v, "caught", "taken by Carthage's ships");
    if (v.army) cs(s).caught[v.army] = s.season;
    return;
  }
  count(s, "carthageConvoysCaught");
  if (v.cargo === "grain") {
    event(s, s.offices.fleet!, `Your ships take Carthage's grain convoy and bring it into Syracuse.`, "they caught it at sea, as the Syracusans took a food ship in 396 (Diodorus 14.64.1)");
    grain(s, v.amount, "grain taken from Carthage's convoy");
    if (v.army) cs(s).caught[v.army] = s.season;
  } else {
    event(s, s.offices.fleet!, `Your ships take the pay for Carthage's mercenaries.`, "they caught it at sea");
    silver(s, v.amount, "Carthage's pay chest, taken at sea");
    if (v.army) unpaid(s, v.army, "their pay was taken at sea");
  }
  close(s, v, "caught", v.side === "carthage" ? "taken by your ships" : "taken");
}

function land(s: GameState, v: Convoy, amount: number, name: string) {
  v.delivered = amount;
  if (v.cargo === "silver") {
    close(s, v, "arrived", "the mercenaries were paid");
    log(s, { actor: "carthage", text: `The pay for Carthage's mercenaries reaches Sicily.`, why: "the convoy came through", visible: true, kind: "event" });
    return;
  }
  if (v.army) {
    const a = s.island!.armies.find((x) => x.id === v.army);
    if (a && LANDINGS.includes(a.at)) {
      const before = a.food;
      a.food = Math.min(R.foodMax, a.food + amount);
      count(s, v.side === "syracuse" ? "armiesFedBySea" : "carthageFedBySea");
      log(s, { actor: v.side === "syracuse" ? PLAYER : "carthage", text: `${capital(name)} lands at ${nodeName(a.at)}: ${capital(armyName(s, a))} has food for ${a.food} ${a.food === 1 ? "season" : "seasons"} (was ${before}).`, why: "the convoy came through", visible: true, kind: "event" });
      close(s, v, "arrived", `fed ${armyName(s, a)} at ${nodeName(a.at)}`);
      return;
    }
    // The army has gone inland or is lost: the grain goes home (yours) or back to Carthage.
    if (v.side === "syracuse") {
      grain(s, amount, `the army's grain, brought home: ${a ? `the army is inland at ${nodeName(a.at)}` : "the army is gone"}`);
      close(s, v, "arrived", "found no army on the coast and came home");
    } else close(s, v, "arrived", "found no army on the coast and went home");
    return;
  }
  if (v.to === "syracuse") grain(s, amount, `${name} lands`);
  else cityGrainChange(s, v.to, amount, `${name} lands`);
  close(s, v, "arrived", amount < v.amount ? `landed ${months(amount)} of ${v.amount}` : `landed ${months(amount)}`);
}

function unpaid(s: GameState, armyId: string, why: string) {
  const a = s.island!.armies.find((x) => x.id === armyId);
  if (!a) return;
  count(s, "carthageUnpaid");
  event(s, "carthage", `${capital(armyName(s, a))}'s mercenaries go unpaid, and some of them leave.`, why);
  loseMen(s, a, Math.max(1, Math.ceil(a.men / K().unpaidDesert)), "unpaid mercenaries desert");
}

// An army whose grain was caught at sea, and which is now out of food: the catch told.
function hungerCheck(s: GameState) {
  const st = s.convoys;
  if (!st) return;
  for (const [id, when] of Object.entries(st.caught)) {
    const a = s.island!.armies.find((x) => x.id === id);
    if (!a || s.season - when > K().starveWithin) { delete st.caught[id]; continue; }
    if (a.food <= 0) {
      count(s, "starvedByCatch");
      event(s, a.side === "syracuse" ? PLAYER : "carthage", `${capital(armyName(s, a))} is hungry: the grain ships it waited for were taken at sea.`, `its convoy was caught ${s.season - when === 0 ? "this season" : "last season"}`);
      delete st.caught[id];
    }
  }
}

// ---------- Your actions (data/actions.json, switch "convoys") ----------
const armyConvoy = (s: GameState) => atSea(s).some((v) => v.side === "syracuse" && v.purpose === "army");
export const CONVOY_IMPL: Record<string, {
  target?: (s: GameState) => Option[]; targetLabel?: string; notes?: (s: GameState, a: Args) => string[];
  check?: (s: GameState, a: Args) => string | null; run: (s: GameState, a: Args, ok: boolean, die: number) => void;
}> = {
  sendGrain: {
    target: (s) => (convoysOn(s) ? contractorOptions(s) : []),
    targetLabel: "Who runs the convoy",
    notes: (s) => {
      const a = yourArmy(s);
      if (!a) return [];
      const k = K();
      const v: Convoy = { id: "", side: "syracuse", cargo: "grain", amount: 0, from: "syracuse", to: a.at, purpose: "army", sailed: s.season, due: s.season + 1, status: "atSea", why: "" };
      const m = catchMods(s, v);
      const out = [`It sails now and lands at ${nodeName(a.at)} next season, if the army is still on the coast: food for ${k.armyGrain} more ${k.armyGrain === 1 ? "season" : "seasons"} (${R.foodMax} at most).`];
      if (s.season % 4 === 1) out.push(`It sails in winter: a storm sinks it on a 1, holds it a season on a 2.`);
      if (m) out.push(`Carthage's ships hunt the sea lanes: they catch it on ${k.catchNeed - sum(m)} or more.`);
      else out.push(s.island!.war ? "Carthage has too few ships to hunt convoys." : "At peace, no fleet hunts it.");
      return out;
    },
    check: (s) => {
      if (!convoysOn(s)) return "needs the switch Grain and the sea";
      const a = yourArmy(s);
      const k = K();
      if (!a) return "you have no army in the field";
      if (!LANDINGS.includes(a.at)) return `the army is inland at ${nodeName(a.at)}; ships cannot reach it`;
      if (armyConvoy(s)) return "a convoy is already at sea for the army";
      if (a.food >= R.foodMax) return "the baggage is full";
      if (s.grain < k.armyGrainCost) return `needs ${k.armyGrainCost} months of grain`;
      if (s.silver < k.armyFee) return `needs ${k.armyFee} silver`;
      if (!contractors(s).length) return "no rich house will run it";
      return null;
    },
    run: (s, a) => {
      const k = K();
      const army = yourArmy(s)!;
      const who = a.target && contractors(s).includes(a.target) ? a.target : autoContractor(s);
      grain(s, -k.armyGrainCost, "grain loaded for the army");
      silver(s, -k.armyFee, `the contractor's fee, paid to ${contractorName(s, who)}`);
      sail(s, { side: "syracuse", cargo: "grain", amount: k.armyGrain, from: "syracuse", to: army.at, army: army.id, purpose: "army", contractor: who, why: `you sent grain to your army at ${nodeName(army.at)}` });
    },
  },
  auditContracts: {
    target: (s) => (convoysOn(s) ? contractors(s).filter((id) => (s.convoys?.contractors[id]?.runs ?? 0) > 0).map((id) => ({ value: id, label: contractorLine(s, id) })) : []),
    targetLabel: "Whose books",
    notes: () => ["If he cheated you, he pays it back and is barred from your contracts; the rich families resent seeing one of their own shamed (their mood -1).", "If he was honest, the rich families resent the insult just the same (their mood -1), and he is careful for a year."],
    check: (s, a) => (!convoysOn(s) ? "needs the switch Grain and the sea" : !contractors(s).some((id) => (s.convoys?.contractors[id]?.runs ?? 0) > 0) ? "no contractor has run a convoy yet" : a.target && !s.convoys?.contractors[a.target] ? "he has run no convoy" : null),
    run: (s, a) => {
      const k = K();
      const id = a.target && s.convoys?.contractors[a.target] ? a.target : contractors(s).find((x) => (s.convoys?.contractors[x]?.runs ?? 0) > 0)!;
      const r = record(s, id);
      const cn = capital(contractorName(s, id));
      r.audited = s.season;
      count(s, "audits");
      if (r.skimmed > 0) {
        count(s, "auditsCaught");
        event(s, PLAYER, `Your clerks go through ${cn}'s books and the granary tallies. He kept back ${months(r.skimmed)}${r.sold ? `, and sold ${r.sold === 1 ? "a whole convoy" : `${r.sold} whole convoys`} to Carthage` : ""}. He pays it back and is barred from your contracts.`, "Audit the grain contracts");
        grain(s, r.skimmed, `${cn} repays what he kept back`);
        silver(s, k.auditRepay, `${cn}'s fine`);
        r.barred = true;
        mood(s, "rich", -1, `${cn}, of one of their houses, was shamed`);
      } else {
        event(s, PLAYER, `Your clerks go through ${cn}'s books and find nothing amiss.${r.short ? " The shortfalls were the sea's doing." : ""}`, "Audit the grain contracts");
        mood(s, "rich", -1, `you treated ${cn}, an honest man of their class, as a thief`);
      }
    },
  },
};
