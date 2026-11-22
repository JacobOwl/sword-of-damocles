// Carthage as a simulated city (Phase 2). Each season its council picks a goal by the weight of its blocs,
// then takes two acts from a fixed menu (data/carthage.json), in the goal's priority order. Its general moves
// its army by a priority list of his own. Every act is logged with the reason, as the factions' are.
import { nextRandom } from "./rng.ts";
import { d6 } from "./rng.ts";
import { PLAYER, capital, nameOf, others, plotStrength } from "./state.ts";
import { clock, event, log } from "./ops.ts";
import { deedSecret } from "./secrets.ts";
import {
  CARTHAGE, ISLAND, NODES, armyName, assault, assaultMods, assaultNeed, bloc, blocPower, carthageArmy, carthagePersonName, chance, city,
  friendly, march, menWords, nodeName, path, yourArmy, loseMen,
} from "./island.ts";
import type { Army, GameState } from "./types.ts";

const N = CARTHAGE.numbers;
const MOODS = ["Rebellious", "Angry", "Uneasy", "Content", "Loyal"];
export const goalDef = (id: string) => CARTHAGE.goals.find((g: any) => g.id === id);
export const actDef = (id: string) => CARTHAGE.actions.find((a: any) => a.id === id);
export const blocDef = (id: string) => CARTHAGE.blocs.find((b: any) => b.id === id);
const count = (s: GameState, k: string, by = 1) => { s.counters[k] = (s.counters[k] ?? 0) + by; };
const say = (s: GameState, text: string, why: string, visible = true) => log(s, { actor: "carthage", text, why, visible, kind: "event" });
const recent = (s: GameState, flag: string, n: number) => s.flags[flag] !== undefined && s.season - s.flags[flag] < n;

// What each voting bloc wants this season, and why. Thresholds are in data/carthage.json (numbers).
export function prefers(s: GameState, id: string): { goal: string; why: string } {
  const isl = s.island!;
  const c = isl.carthage;
  const plague = c.plagueUntil >= s.season;
  const lostTown = recent(s, "punicLost", 8);
  const lostTribute = recent(s, "tributeLost", 8);
  const anger = s.clock;
  if (id === "elders") {
    if (isl.war && (c.armiesLost >= N.peaceArmiesLost.elders || plague)) return { goal: "peace", why: plague ? "plague is in the city" : "an army is lost" };
    if (isl.war && s.season - isl.warSince >= N.warWeary.elders && !lostTown) return { goal: "peace", why: `${s.season - isl.warSince} seasons of war have emptied the treasury` };
    if (anger >= N.warAnger.elders || lostTown) return { goal: "war", why: lostTown ? "a Punic town has fallen" : `Carthage's anger is ${anger}` };
    if (isl.war) return { goal: "war", why: "the war is on, and the Elders will not be seen to flinch" };
    if (c.silver < N.silverForRebuild) return { goal: "rebuild", why: "the treasury is thin" };
    return { goal: "tribute", why: "trade is good, and the tribute must be kept" };
  }
  if (id === "hundred") {
    if (isl.war && c.armiesLost >= N.peaceArmiesLost.hundred) return { goal: "peace", why: "two armies are lost" };
    if (anger >= N.warAnger.hundred || lostTown || lostTribute) return { goal: "war", why: lostTown ? "a Punic town has fallen" : lostTribute ? "a tribute town was taken from Carthage" : `Carthage's anger is ${anger}` };
    if (isl.war) return { goal: "war", why: "the war is on" };
    return { goal: "tribute", why: "Carthage's hold on Sicily comes first" };
  }
  // the people
  if (isl.war && plague) return { goal: "peace", why: "plague is in the city" };
  if (isl.war && s.season - isl.warSince >= N.warWeary.people && !lostTown) return { goal: "peace", why: `${s.season - isl.warSince} seasons of war, and nothing to show for it` };
  if (anger >= N.warAnger.people || lostTown || isl.war) return { goal: "war", why: isl.war ? "the war is on, and the people want it won" : lostTown ? "a Punic town has fallen" : `Carthage's anger is ${anger}` };
  return { goal: "rebuild", why: plague ? "plague is in the city" : "the people want to mend what the last war broke" };
}

function chooseGoal(s: GameState) {
  const isl = s.island!;
  const c = isl.carthage;
  if (c.revolt) return setGoal(s, "libya", "the Libyan subjects are in revolt");
  const support: Record<string, number> = {};
  const why: Record<string, string[]> = {};
  const voters = CARTHAGE.blocs.filter((b: any) => b.votes);
  for (const b of voters) {
    const p = prefers(s, b.id);
    const st = c.blocs[b.id];
    const weight = Math.max(0, st.power - (st.mood <= 1 ? 2 : 0)); // an Angry bloc carries less weight
    support[p.goal] = (support[p.goal] ?? 0) + weight;
    (why[p.goal] ??= []).push(`${b.name} (${p.why})`);
  }
  const best = Object.keys(support).sort((a, b) => support[b] - support[a] || (a === c.goal ? -1 : b === c.goal ? 1 : 0))[0];
  // Aristotle: if the kings and the Elders agree, the matter is theirs; if not, the people decide.
  const eldersWant = prefers(s, "elders").goal;
  const decidedBy = eldersWant === best ? "the council" : "the people's assembly, since the Elders were against it";
  setGoal(s, best, `${why[best].join(" and ")}; decided by ${decidedBy}`);
}
function setGoal(s: GameState, goal: string, why: string) {
  const c = s.island!.carthage;
  count(s, `carthageGoal_${goal}`);
  if (c.goal === goal) { c.goalWhy = why; return; }
  c.goal = goal;
  c.goalWhy = why;
  say(s, `Carthage's council turns to a new goal: ${goalDef(goal).name}. ${goalDef(goal).text}`, why);
  if (goal === "war" && !s.island!.war) startWar(s, "Carthage declares war on Syracuse.", why);
}
export function startWar(s: GameState, text: string, why: string) {
  const isl = s.island!;
  if (isl.war) return;
  isl.war = true;
  isl.warSince = s.season;
  isl.carthage.armiesLost = 0;
  count(s, "wars");
  event(s, "world", text, why);
  for (const n of NODES) if (city(s, n.id).side === "tributary") {
    const c = city(s, n.id);
    c.lean = Math.min(3, c.lean + 1);
  }
  log(s, { actor: "world", text: "The tribute towns stir: their people hope to be free of Carthage.", why: "war has come", visible: true, kind: "change" });
}
export function endWar(s: GameState, why: string) {
  const isl = s.island!;
  isl.war = false;
  s.flags.peaceMade = s.season;
  delete s.flags.atWar;
  count(s, "peaces");
  const ca = carthageArmy(s);
  if (ca) { isl.armies = isl.armies.filter((a) => a !== ca); isl.carthage.mercs += Math.floor(ca.men / 2); const g = isl.carthage.people[ca.commander]; if (g) g.status = "free"; }
  event(s, "world", "Peace is made between Syracuse and Carthage. Each keeps what it holds.", why);
  s.clock = Math.min(s.clock, 4);
  isl.carthage.goal = "rebuild";
}

// ---------- Carthage's acts ----------
type Check = (s: GameState) => boolean;
const C = (s: GameState) => s.island!.carthage;
const landing = (s: GameState) => (ISLAND.carthage.landings as string[]).find((id) => city(s, id).side === "carthage" && !s.island!.armies.some((a) => a.side === "syracuse" && a.at === id));
const freeGeneral = (s: GameState) => {
  const c = C(s);
  return CARTHAGE.people.filter((p: any) => c.people[p.id].status === "free").sort((a: any, b: any) => b.general - a.general)[0];
};
const CHECKS: Record<string, Check> = {
  trade: () => true,
  hire: (s) => C(s).silver >= actDef("hire").cost,
  levy: (s) => C(s).blocs.libyans.mood >= 1 && !C(s).revolt,
  ships: (s) => C(s).silver >= actDef("ships").cost && C(s).ships < 8,
  fortify: (s) => C(s).silver >= actDef("fortify").cost && NODES.some((n) => city(s, n.id).side === "carthage" && city(s, n.id).men < actDef("fortify").maxMen && !s.island!.armies.some((a) => a.siege === n.id)),
  general: (s) => s.island!.war && !C(s).general && !!freeGeneral(s),
  invade: (s) => s.island!.war && !!C(s).general && !carthageArmy(s) && C(s).mercs + C(s).levy >= actDef("invade").minMen && C(s).ships >= actDef("invade").minShips && !!landing(s),
  reinforce: (s) => !!carthageArmy(s) && C(s).mercs + C(s).levy >= actDef("reinforce").minMen && C(s).ships >= actDef("reinforce").minShips,
  silver: (s) => s.clock >= actDef("silver").minAnger && C(s).silver >= actDef("silver").cost && (s.plots.length > 0 || others(s).some((p) => p.status === "free" && p.opinion <= -1)),
  peace: (s) => s.island!.war && C(s).offer < s.season - 1,
  recall: (s) => !!carthageArmy(s) && (C(s).goal !== "war" || carthageArmy(s)!.men <= 2),
  propitiate: (s) => C(s).silver >= actDef("propitiate").cost && (C(s).plagueUntil >= s.season || recent(s, "carthageArmyLost", 6) || recent(s, "carthagePlague", 6)) && !s.flags.propitiated,
  quiet: (s) => C(s).silver >= actDef("quiet").cost && C(s).blocs.libyans.mood <= actDef("quiet").maxMood,
};

function doAct(s: GameState, id: string, goalName: string) {
  const c = C(s);
  const d = actDef(id);
  const why = `Carthage's goal: ${goalName}`;
  count(s, `carthageAct_${id}`);
  switch (id) {
    case "trade": {
      const v = s.island!.war ? N.tradeAtWar : d.silver;
      c.silver += v;
      say(s, `${d.text} (+${v} silver to Carthage's treasury.)`, why);
      bloc(s, "elders", d.mood.elders, "trade pays");
      break;
    }
    case "hire":
      c.silver -= d.cost; c.mercs += d.mercs;
      say(s, `${d.text} (${menWords(d.mercs)} hired.)`, why);
      break;
    case "levy":
      c.levy += d.levy;
      say(s, `${d.text} (${menWords(d.levy)}.)`, why);
      bloc(s, "libyans", d.mood.libyans, "their sons are taken for the levy");
      break;
    case "ships":
      c.silver -= d.cost; c.ships += d.ships;
      say(s, `${d.text} (Carthage's fleet is now ${c.ships}.)`, why);
      break;
    case "fortify": {
      const t = NODES.find((n) => city(s, n.id).side === "carthage" && city(s, n.id).men < d.maxMen && !s.island!.armies.some((a) => a.siege === n.id))!;
      c.silver -= d.cost; city(s, t.id).men += d.men;
      say(s, `Carthage sends men to hold ${t.name}.`, why);
      break;
    }
    case "general": {
      const g = freeGeneral(s);
      c.general = g.id;
      c.people[g.id].status = "command";
      say(s, `The council gives ${g.name} sole command of the war.`, `${why}; he is the ablest man free to lead`);
      count(s, "carthageGenerals");
      break;
    }
    case "invade": {
      const at = landing(s)!;
      const men = c.mercs + c.levy;
      c.mercs = 0; c.levy = 0;
      const a: Army = { id: `carthage${s.season}`, side: "carthage", at, men, food: 2, commander: c.general!, guard: 0, guardStart: 0, since: s.season, moved: s.season, siegeSince: -1, onTake: "sack" };
      s.island!.armies.push(a);
      count(s, "landings");
      event(s, "carthage", `${carthagePersonName(s, a.commander)} lands at ${nodeName(at)} with ${menWords(men)}.`, why);
      intercept(s, a);
      break;
    }
    case "reinforce": {
      const a = carthageArmy(s)!;
      const men = c.mercs + c.levy;
      c.mercs = 0; c.levy = 0;
      a.men += men;
      say(s, `Carthage ships ${menWords(men)} to ${armyName(s, a)}.`, why);
      break;
    }
    case "silver": {
      c.silver -= d.cost;
      count(s, "carthageSilver");
      const pl = s.plots.slice().sort((a, b) => plotStrength(s, b).total - plotStrength(s, a).total)[0];
      if (pl) {
        pl.bonus += 1;
        deedSecret(s, pl.leader, "carthageSilver");
        const seen = !!pl.informer;
        say(s, `Carthaginian silver reaches the plot against you, through ${s.people[pl.leader].name}.`, `${why}; a plot already stands against you`, seen);
      } else {
        const p = others(s).filter((p) => p.status === "free" && p.opinion <= -1).sort((a, b) => a.opinion - b.opinion)[0];
        p.infl += 1;
        deedSecret(s, p.id, "carthageSilver");
        say(s, `Carthaginian silver finds ${p.name}, who has no love for you.`, `${why}; ${p.name}'s opinion of you is ${p.opinion}`, p.knownUntil >= s.season);
      }
      break;
    }
    case "peace":
      c.offer = s.season;
      count(s, "peaceOffers");
      event(s, "carthage", "Carthage's envoys come to Syracuse with terms: peace, and each side keeps what it holds. You may accept this season or the next.", why);
      break;
    case "recall": {
      const a = carthageArmy(s)!;
      s.island!.armies = s.island!.armies.filter((x) => x !== a);
      c.mercs += Math.floor(a.men / 2);
      const g = c.people[a.commander];
      if (g && g.status === "command") g.status = "free";
      c.general = undefined;
      event(s, "carthage", `The council calls ${armyName(s, a)} home from Sicily.`, why);
      break;
    }
    case "propitiate":
      c.silver -= d.cost;
      s.flags.propitiated = s.season;
      say(s, `${d.text}`, `${why}; the gods seem to be against Carthage`);
      bloc(s, "people", d.mood.people, "the gods are honoured");
      break;
    case "quiet":
      c.silver -= d.cost;
      say(s, d.text, `${why}; the Libyans are ${MOODS[c.blocs.libyans.mood]}`);
      bloc(s, "libyans", d.mood.libyans, "a year's dues remitted");
      break;
  }
}

// Your fleet may catch Carthage's transports at sea (Leptines did, Diodorus 14.55.2).
function intercept(s: GameState, a: Army) {
  const f = s.offices.fleet;
  if (!f || (s.flags.fleetDamaged !== undefined && s.season - s.flags.fleetDamaged < 3)) return;
  const friend = f === PLAYER || (s.people[f]?.status === "free" && s.people[f].opinion >= 0);
  if (!friend) return;
  const die = d6(s);
  const who = f === PLAYER ? "Your fleet" : `${capital(nameOf(s, f))}'s ships`;
  if (die >= 5) {
    event(s, f, `${who} fall on the transports at sea (rolled ${die}, needs 5).`, "the fleet watches the crossing");
    loseMen(s, a, Math.ceil(a.men / 4), "transports sunk at sea");
    count(s, "intercepts");
  } else log(s, { actor: f, text: `${who} miss the crossing (rolled ${die}, needs 5).`, why: "the fleet watches the crossing", visible: true, kind: "roll" });
}

// ---------- Carthage's general ----------
function generalOrders(s: GameState) {
  const isl = s.island!;
  const a = carthageArmy(s);
  if (!a || !isl.war || a.moved === s.season || s.over) return;
  const go = (dest: string, why: string) => { if (dest !== a.at) march(s, a, dest, why); };
  // 1. Find food.
  if (a.food <= 0 && !friendly(a.side, city(s, a.at).side)) {
    const home = NODES.filter((n) => friendly(a.side, city(s, n.id).side)).map((n) => n.id).sort((x, y) => (path(a.at, x)?.days.at(-1) ?? 99) - (path(a.at, y)?.days.at(-1) ?? 99))[0];
    if (home) return go(home, "his army has no food left");
  }
  // 2. Relieve a town of Carthage's under siege.
  const relieve = NODES.find((n) => friendly(a.side, city(s, n.id).side) && isl.armies.some((o) => o.side === "syracuse" && o.siege === n.id));
  if (relieve) return go(relieve.id, `${relieve.name} is besieged by your army`);
  // 3. Already besieging: storm if the odds are fair, else starve them.
  if (a.siege) {
    const m = assaultMods(s, a);
    const p = chance(m, assaultNeed());
    const bold = (CARTHAGE.people.find((x: any) => x.id === a.commander)?.traits ?? []).includes("bold");
    if (s.season > a.siegeSince && p >= (bold ? 0.34 : 0.5)) {
      const die = d6(s);
      const t = die + m.reduce((x, y) => x + y.value, 0);
      log(s, { actor: "carthage", text: `${capital(armyName(s, a))} assaults ${nodeName(a.siege)}: rolled ${die}${m.map((x) => ` ${x.value >= 0 ? "+" : "-"}${Math.abs(x.value)} ${x.label}`).join("")} = ${t}, needs ${assaultNeed()}. ${t >= assaultNeed() ? "Success." : "Failure."}`,
        visible: true, kind: "roll", roll: { die, mods: m, total: t, need: assaultNeed(), ok: t >= assaultNeed() } });
      assault(s, a, t >= assaultNeed());
    } else log(s, { actor: "carthage", text: `${capital(armyName(s, a))} keeps up the siege of ${nodeName(a.siege)}.`, why: `the odds of storming it are ${Math.round(p * 100)}%; better to starve it`, visible: true, kind: "event" });
    return;
  }
  // 4. Take back what was Carthage's or paid it tribute.
  const lost = NODES.find((n) => (n.side === "carthage" || n.side === "tributary") && ["syracuse", "ally"].includes(city(s, n.id).side));
  if (lost) return go(lost.id, `${lost.name} was Carthage's and must be won back`);
  // 5. The straits.
  const straits = NODES.find((n) => n.straits && !friendly(a.side, city(s, n.id).side));
  if (straits && !isl.armies.some((o) => o.side === "syracuse" && o.at === straits.id)) return go(straits.id, `${straits.name}'s harbour and the straits would bar help from Italy`);
  // 6. Syracuse.
  go("syracuse", "to break the tyrant in his own city");
}

// ---------- The season for Carthage (after the Syracusan factions act) ----------
export function carthageStep(s: GameState) {
  const isl = s.island!;
  const c = isl.carthage;
  // A war you declared in an event (the assembly's vote) or by action begins here.
  if (!isl.war && s.flags.atWar !== undefined && (s.flags.peaceMade === undefined || s.flags.atWar > s.flags.peaceMade)) startWar(s, "Syracuse is at war with Carthage.", "your assembly voted for war");
  // Upkeep: hired men must be paid, or they leave.
  const army = carthageArmy(s)?.men ?? 0;
  const upkeep = Math.floor((c.mercs + army) / N.mercUpkeepPer);
  if (upkeep) {
    if (c.silver >= upkeep) c.silver -= upkeep;
    else {
      c.silver = 0;
      const ca = carthageArmy(s);
      if (ca) loseMen(s, ca, 1, "Carthage cannot pay its mercenaries");
      else if (c.mercs > 0) { c.mercs -= 1; say(s, "Unpaid mercenaries leave Carthage's service.", "the treasury is empty"); }
    }
  }
  // Plague in Carthage (the chance is invention; Diodorus 14.45.3 tells of one before 397).
  if (c.plagueUntil < s.season && s.season % 4 === 3 && nextRandom(s) < N.plagueChance) {
    c.plagueUntil = s.season + N.plagueSeasons;
    count(s, "carthagePlagues");
    event(s, "carthage", "Plague breaks out in Carthage and in Libya.", "word comes by the merchant ships");
    for (const b of Object.keys(c.blocs)) bloc(s, b, -1, "plague in the city");
    c.mercs = Math.floor(c.mercs / 2); c.levy = Math.floor(c.levy / 2);
  }
  if (c.plagueUntil === s.season) event(s, "carthage", "The plague in Carthage burns itself out.", "a year has passed");
  // Time heals: once a year a bloc below Uneasy that nothing soured this season rises one step.
  if (s.season % 4 === 3) for (const b of Object.values(c.blocs)) {
    const soured = s.log.some((e) => e.season === s.season && e.actor === "carthage" && e.kind === "change" && e.text.includes(`${blocDef(b.id).name} sour`));
    if (b.mood < 2 && !soured) bloc(s, b.id, 1, "a year without new grievances");
  }
  // The Libyans rise when Rebellious, and settle when Uneasy again.
  const lib = c.blocs.libyans.mood;
  if (!c.revolt && lib === 0) { c.revolt = true; count(s, "libyanRevolts"); event(s, "carthage", "The Libyan subjects rise against Carthage.", "the levies and dues drove them to it"); }
  else if (c.revolt && lib >= 2) { c.revolt = false; event(s, "carthage", "Libya is quiet again.", `the Libyans are ${MOODS[lib]}`); }
  if (c.revolt) c.silver = Math.max(0, c.silver - 1);
  // The council's goal, then its acts.
  chooseGoal(s);
  const goal = goalDef(c.goal);
  let acts = CARTHAGE.actsPerSeason;
  const done = new Set<string>();
  for (const id of goal.priorities) {
    if (acts <= 0) break;
    if (done.has(id) || !CHECKS[id]?.(s)) continue;
    doAct(s, id, goal.name);
    done.add(id);
    acts -= 1;
    if (s.over) return;
  }
  if (acts === CARTHAGE.actsPerSeason) say(s, "Carthage waits and counts its silver.", `Carthage's goal: ${goal.name}; nothing on its list can be done`, false);
  // A beaten war party loses weight; the blocs that warned against it gain.
  if (s.flags.carthageArmyLost === s.season) {
    for (const b of CARTHAGE.blocs.filter((x: any) => x.votes)) blocPower(s, b.id, prefers(s, b.id).goal === "war" ? -1 : 1, "an army was lost in Sicily");
  }
  generalOrders(s);
  // A free general who has disgraced himself may end his own life, as Himilcon did (Diodorus 14.76.4).
  for (const p of Object.values(c.people)) if (p.status === "disgraced" && s.flags.carthageArmyLost === s.season - 1 && p.id === "himilcon") {
    p.status = "dead";
    event(s, "carthage", "Himilcon goes about the temples of Carthage in rags, blaming himself, and starves himself to death.", "the shame of his lost army");
  }
}

// What the council would do next, for the UI: the goal's list with what each act needs.
export function carthageAgenda(s: GameState): { id: string; name: string; ready: boolean }[] {
  const goal = goalDef(s.island!.carthage.goal);
  return goal.priorities.map((id: string) => ({ id, name: actDef(id).name, ready: !!CHECKS[id]?.(s) }));
}
export const moodWord = (m: number) => MOODS[Math.max(0, Math.min(4, m))];
