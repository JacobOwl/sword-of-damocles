// The generated cast: invented families for the island's cities, Carthage's council and the hired captains.
//
// Everything here is a pure function of a random source, so it replays exactly. In a game the source is the game's one
// seeded stream (see census hooks in season.ts); tools and tests can pass their own. The rules and numbers are in
// data/census.json, the names in data/names.json (each attested in a saved text). The people are invention.
//
// The census never reaches into the rest of the game state. Other systems ask it questions through the lookups at the
// end of this file (censusLeader, censusCaptain, censusCouncil, censusAt, censusName).
import censusJson from "../../data/census.json" with { type: "json" };
import namesJson from "../../data/names.json" with { type: "json" };
import peopleJson from "../../data/people.json" with { type: "json" };

export type Rand = () => number;
export type Sex = "m" | "f";

// The parts of a face that stay with a person for life. Age, grey hair and baldness come from their age when drawn.
export interface Genes {
  skin: "olive" | "fair" | "deep";
  hair: "black" | "brown" | "auburn";
  style: "curls" | "long" | "receding" | "bald" | "bound";
  beard: "none" | "short" | "full" | "long";
  head: "none" | "wreath" | "band" | "helmet" | "pilos" | "veil" | "sakkos";
  nose: "straight" | "arched" | "short";
  jaw: "soft" | "firm";
  greys: number; // the age at which this person's hair turns grey
  faceSeed: number;
}

export interface CensusPerson {
  id: string;
  kind: "invention";
  given: string | null; // null: known only as someone's daughter, as women often are in the sources
  fatherName: string;
  sex: Sex;
  born: number; // year BC
  group: string; // a name group from data/names.json
  body: string; // a body id from data/census.json (a city's leading men, a Carthaginian bloc, a captains' list)
  place: string; // a node id from data/island.json, or "carthage"
  house?: string;
  father?: string;
  mother?: string;
  spouse?: string;
  widowOf?: string;
  brotherOf?: string; // a head's brother, made with the house (their father is not in the census)
  children: string[];
  traits: string[];
  ambition: string | null;
  role?: string;
  side?: "syracuse" | "carthage"; // captains only
  alive: boolean;
  died?: { season: number; age: number; cause: string };
  genes: Genes;
}

export interface House { id: string; body: string; place: string; head: string | null; standing: number; group: string; founded: string; endedSeason?: number }

export interface Census {
  seed: number; // the first draw, kept for faces
  people: Record<string, CensusPerson>;
  houses: Record<string, House>;
  n: number;
}

export interface CensusNote {
  kind: "birth" | "death" | "marriage" | "head" | "age" | "captain" | "end";
  text: string;
  why: string;
  who: string[];
}

// ---- data ----

interface NameRec { id: string; name: string; group: string; sex: Sex }
interface BodyDef { id: string; name: string; place: string; tie: { kind: string; id: string }; houses: number; standing: [number, number]; groups: Record<string, number>; roles: string[] }
interface CaptainDef { id: string; name: string; side: "syracuse" | "carthage"; count: number; groups: Record<string, number>; roles: Record<string, string> }

const C = censusJson as any;
export const CENSUS_DATA = {
  startYear: C.startYear as number,
  bodies: C.bodies as BodyDef[],
  captains: C.captains as CaptainDef[],
  naming: C.naming,
  people: C.people,
  life: C.life,
};
const NAMES = (namesJson as any).names as NameRec[];
// Names no living invented person may carry: the reserved list, and every name in the starting cast.
const CAST_NAMES = new Set<string>(((peopleJson as any).people as { name: string }[]).map((p) => p.name).filter((n) => /^[A-Z]/.test(n)));
const RESERVED = new Set<string>([...(C.reserved.names as string[]), ...CAST_NAMES]);

export function namePool(group: string, sex: Sex, living = true): string[] {
  const g = sex === "f" && !NAMES.some((n) => n.group === group && n.sex === "f") ? (CENSUS_DATA.naming.femaleFallback[group] ?? group) : group;
  return NAMES.filter((n) => n.group === g && n.sex === sex && (!living || !RESERVED.has(n.name))).map((n) => n.name);
}
const fatherPool = (group: string) => namePool(group, "m", false);

// ---- small random helpers ----

const int = (r: Rand, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
const chance = (r: Rand, p: number) => r() < p;
const pick = <T>(r: Rand, xs: T[]): T => xs[Math.floor(r() * xs.length)];
function weighted(r: Rand, w: Record<string, number>): string {
  const keys = Object.keys(w);
  const total = keys.reduce((a, k) => a + w[k], 0);
  let x = r() * total;
  for (const k of keys) { x -= w[k]; if (x < 0) return k; }
  return keys[keys.length - 1];
}

// A standalone stream for tools and tests (mulberry32, as in rng.ts). In a game, pass the game's own stream instead.
export function streamFrom(seed: number): Rand {
  let a = seed | 0;
  return () => {
    let t = (a = (a + 0x6d2b79f5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- time ----

export const yearOf = (season: number) => CENSUS_DATA.startYear - Math.floor(season / 4);
export const ageOf = (p: CensusPerson, season: number) => p.born - (p.alive || !p.died ? yearOf(season) : yearOf(p.died.season));

// ---- names ----

const living = (c: Census) => Object.values(c.people).filter((p) => p.alive);

export function censusName(c: Census, id: string, long = false): string {
  const p = c.people[id];
  if (!p) return "someone";
  const where = placeName(p.place);
  const at = long && where ? `, of ${where}` : "";
  if (p.sex === "m") return p.given ? (long ? `${p.given} son of ${p.fatherName}${at}` : p.given) : "someone";
  // A woman is named by her father and, once married, her husband, as the sources name them. Some are known only as
  // someone's daughter; her husband's or her father's full name tells two such women apart.
  const husband = p.spouse ? c.people[p.spouse] : p.widowOf ? c.people[p.widowOf] : undefined;
  if (!long) return p.given ?? (husband?.given ? `the ${p.spouse ? "wife" : "widow"} of ${husband.given}` : `the daughter of ${p.fatherName}`);
  const own = p.given ? `${p.given} daughter of ${p.fatherName}` : `the daughter of ${p.fatherName}`;
  if (husband) return `${own}, ${p.spouse ? "wife" : "widow"} of ${censusName(c, husband.id, true)}`;
  const father = p.father ? c.people[p.father] : undefined;
  if (father?.given) {
    // Unnamed sisters are told apart by birth order, counted over all of them, so the words never change.
    const sisters = father.children.map((k) => c.people[k]).filter((x) => x.sex === "f" && !x.given).sort((a, b) => b.born - a.born);
    const i = sisters.findIndex((x) => x.id === p.id);
    const ord = sisters.length > 1 && !p.given ? `${ORDINALS[Math.min(i, ORDINALS.length - 1)]} ` : "";
    return `${p.given ? own : `the ${ord}daughter of ${p.fatherName}`} son of ${father.fatherName}${at}`;
  }
  const child = p.children.map((k) => c.people[k]).find((x) => x?.sex === "m" && x.given);
  return child && !p.given ? `${own}, mother of ${censusName(c, child.id, true)}` : `${own}${at}`;
}

const PLACE_NAMES: Record<string, string> = {
  syracuse: "Syracuse", leontini: "Leontini", catana: "Catana", messana: "Messana", gela: "Gela", acragas: "Acragas",
  aetna: "Aetna", motya: "Motya", panormus: "Panormus", carthage: "Carthage",
};
const ORDINALS = ["eldest", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
export const placeName = (id: string) => PLACE_NAMES[id] ?? "";

// A given name for a new person: not reserved, not the father's own name, not shared with a living parent or sibling,
// and never the same name and father's name as someone alive in the same place. Some women get no name (null), as
// long as no other unnamed woman with the same father's name lives there.
function chooseGiven(c: Census, r: Rand, group: string, sex: Sex, father?: CensusPerson, avoid: string[] = [], fatherName?: string, place?: string): string | null {
  const N = CENSUS_DATA.naming;
  const fname = fatherName ?? father?.given ?? "";
  const here = Object.values(c.people).filter((p) => p.alive && p.fatherName === fname && (!place || p.place === place));
  const taken = new Set<string>([...avoid, fname]);
  for (const p of here) if (p.given) taken.add(p.given);
  if (father) for (const k of father.children) { const g = c.people[k]?.given; if (g) taken.add(g); }
  // With a father in the census, unnamed sisters are told apart by birth order; otherwise only one per father's name.
  // (A daughter of another man with the same two names, dead or alive, also blocks it.)
  const twin = (p: CensusPerson) => { const f = p.father ? c.people[p.father] : undefined; return !!father && !!f && f.id !== father.id && f.given === father.given && f.fatherName === father.fatherName; };
  const nullOk = sex === "f" && (father
    ? !here.some((p) => p.given === null && !p.spouse && !p.widowOf && twin(p))
    : !here.some((p) => p.given === null && !p.spouse && !p.widowOf && !p.children.length));
  if (nullOk && chance(r, N.unnamedWomen[group] ?? N.unnamedWomen.default)) return null;
  const all = namePool(group, sex);
  if (!all.length) throw new Error(`No ${sex === "m" ? "men's" : "women's"} names for the group ${group} in data/names.json`);
  const pool = all.filter((n) => !taken.has(n));
  // About half of eldest sons are named after their father's father.
  if (sex === "m" && father && father.children.every((k) => c.people[k]?.sex !== "m") && chance(r, N.grandfatherName)) {
    if (!RESERVED.has(father.fatherName) && !taken.has(father.fatherName)) return father.fatherName;
  }
  if (pool.length) return pick(r, pool);
  if (sex === "f") return null;
  const near = N.maleFallback?.[group];
  const borrowed = near ? namePool(near, "m").filter((n) => !taken.has(n)) : [];
  if (borrowed.length) return pick(r, borrowed);
  // Last resort, before two men share both names: a reserved name of the group (never a name from the starting cast).
  const spare = namePool(group, "m", false).filter((n) => !taken.has(n) && !CAST_NAMES.has(n));
  return spare.length ? pick(r, spare) : pick(r, all);
}

// ---- faces ----

function genesFor(r: Rand, group: string, sex: Sex, role?: string): Genes {
  const skin: Genes["skin"] = group === "libyan" ? (chance(r, 0.5) ? "deep" : "olive") : group === "celt" ? "fair" : chance(r, 0.08) ? "fair" : "olive";
  const hair: Genes["hair"] = group === "celt" ? (chance(r, 0.5) ? "auburn" : "brown") : chance(r, 0.75) ? "black" : "brown";
  const style: Genes["style"] = sex === "f" ? (chance(r, 0.7) ? "bound" : "long") : pick(r, ["curls", "curls", "long", "receding", "bald"] as const);
  const beard: Genes["beard"] = sex === "f" ? "none"
    : group === "punic" ? pick(r, ["full", "full", "long", "short"] as const)
    : group === "campanian" || group === "iberian" ? pick(r, ["none", "short", "short"] as const)
    : pick(r, ["short", "full", "full", "long"] as const);
  const captain = !!role && /captain/.test(role);
  const priest = !!role && /priest/.test(role);
  const head: Genes["head"] = sex === "f" ? pick(r, ["veil", "veil", "sakkos", "none"] as const)
    : captain ? (group === "greekAbroad" ? "pilos" : "helmet") : priest ? "wreath" : chance(r, 0.15) ? "band" : "none";
  return {
    skin, hair, style, beard, head,
    nose: group === "punic" ? pick(r, ["arched", "arched", "straight"] as const) : pick(r, ["straight", "straight", "arched", "short"] as const),
    jaw: sex === "f" ? "soft" : chance(r, 0.6) ? "firm" : "soft",
    greys: int(r, 42, 62),
    faceSeed: int(r, 0, 99999),
  };
}

// A child takes skin, hair colour and nose from one parent or the other, most of the time.
function inherit(r: Rand, father: CensusPerson, mother: CensusPerson, group: string, sex: Sex): Genes {
  const g = genesFor(r, group, sex);
  const from = chance(r, 0.5) ? father.genes : mother.genes;
  if (chance(r, 0.8)) { g.skin = from.skin; g.hair = from.hair; }
  if (chance(r, 0.6)) g.nose = (chance(r, 0.5) ? father : mother).genes.nose;
  return g;
}

// The look for the mosaic portrait (the same fields as ui/art/portrait-looks.json), as this person looks this season.
export function lookOf(c: Census, id: string, season: number) {
  const p = c.people[id];
  const age = ageOf(p, season);
  const g = p.genes;
  const band = age < 30 ? "young" : age < 55 ? "grown" : "old";
  const hairCol = age >= g.greys + 12 ? "white" : age >= g.greys ? "grey" : g.hair;
  const style = p.sex === "m" && band === "young" && (g.style === "bald" || g.style === "receding") ? "curls" : g.style;
  const beard = p.sex === "m" && age < 18 ? "none" : g.beard;
  const body = CENSUS_DATA.bodies.find((b) => b.id === p.body);
  const faction = body?.tie.kind === "faction" ? body.tie.id : p.side === "syracuse" ? "guard" : "outside";
  // The coin's colours (invention): Syracuse's houses take their faction's coin; the other Greek towns bronze;
  // Carthage, its towns and its captains Punic purple; Syracuse's captains the guard's teal.
  const punic = p.place === "carthage" || p.place === "motya" || p.place === "panormus" || p.side === "carthage";
  const coin = body?.tie.kind === "faction" || p.side === "syracuse" ? {} : punic ? { field: "punic", ring: "gold", clothes: "cream" } : { field: "b2", ring: "b3", clothes: "sand" };
  return {
    id, name: censusName(c, id), faction, sex: p.sex, age: band, facing: "left", skin: g.skin, hairCol, hair: style, beard,
    head: g.head, nose: g.nose, jaw: g.jaw, faceSeed: g.faceSeed, ...coin, kind: "invention",
  };
}

// ---- making people ----

function traitsFor(r: Rand): string[] {
  const P = CENSUS_DATA.people;
  const n = chance(r, 0.6) ? 1 : 2;
  const out: string[] = [];
  while (out.length < n) {
    const t = pick(r, P.traits as string[]);
    const clash = (P.opposites as string[][]).some((pair) => pair.includes(t) && pair.some((x) => x !== t && out.includes(x)));
    if (!out.includes(t) && !clash) out.push(t);
  }
  return out;
}

function add(c: Census, p: Omit<CensusPerson, "id" | "kind" | "children" | "alive">): CensusPerson {
  const id = `c${++c.n}`;
  const full: CensusPerson = { id, kind: "invention", children: [], alive: true, ...p };
  c.people[id] = full;
  return full;
}

function adultBits(r: Rand) {
  return { traits: traitsFor(r), ambition: weighted(r, CENSUS_DATA.people.ambitions) };
}

function marry(a: CensusPerson, b: CensusPerson) {
  a.spouse = b.id;
  b.spouse = a.id;
}

function makeHouse(c: Census, r: Rand, body: BodyDef, role: string, year: number) {
  const P = CENSUS_DATA.people;
  const group = weighted(r, body.groups);
  const hid = `h${Object.keys(c.houses).length + 1}`;
  const headAge = int(r, P.headAge[0], P.headAge[1]);
  const fatherName = pick(r, fatherPool(group));
  const given = chooseGiven(c, r, group, "m", undefined, [], fatherName, body.place)!;
  const head = add(c, { given, fatherName, sex: "m", born: year + headAge, group, body: body.id, place: body.place, house: hid, role, ...adultBits(r), genes: genesFor(r, group, "m", role) });
  const house: House = { id: hid, body: body.id, place: body.place, head: head.id, standing: int(r, body.standing[0], body.standing[1]), group, founded: head.id };
  c.houses[hid] = house;

  let mother: CensusPerson | undefined;
  if (headAge < 55 && chance(r, P.widowedMotherChance)) {
    const age = Math.min(84, headAge + int(r, 18, 28));
    const mf = pick(r, fatherPool(group));
    mother = add(c, { given: chooseGiven(c, r, group, "f", undefined, [], mf, body.place), fatherName: mf, sex: "f", born: year + age, group, body: body.id, place: body.place, house: hid, ...adultBits(r), genes: genesFor(r, group, "f") });
    head.mother = mother.id;
    mother.children.push(head.id);
  }
  const wifeAge = Math.max(17, headAge - int(r, P.wifeYounger[0], P.wifeYounger[1]));
  const wf = pick(r, fatherPool(group));
  const wife = add(c, { given: chooseGiven(c, r, group, "f", undefined, [], wf, body.place), fatherName: wf, sex: "f", born: year + wifeAge, group, body: body.id, place: body.place, house: hid, ...adultBits(r), genes: genesFor(r, group, "f") });
  marry(head, wife);
  // Children, eldest first, born while the mother was 17 to 40. Daughters past 16 have married out of the house.
  let ageNext = Math.min(wifeAge - 17, 30);
  const nKids = int(r, P.children[0], P.children[1]);
  for (let i = 0; i < nKids && ageNext >= 0 && wifeAge - ageNext <= 40; i++) {
    const sex: Sex = chance(r, 0.5) ? "m" : "f";
    if (!(sex === "f" && ageNext > 16)) {
      const kid = add(c, {
        given: chooseGiven(c, r, group, sex, head, [], undefined, body.place), fatherName: head.given!, sex, born: year + ageNext, group, body: body.id, place: body.place, house: hid,
        father: head.id, mother: wife.id, traits: ageNext >= 16 ? traitsFor(r) : [], ambition: ageNext >= 16 ? weighted(r, P.ambitions) : null, genes: inherit(r, head, wife, group, sex),
      });
      head.children.push(kid.id);
      wife.children.push(kid.id);
    }
    ageNext -= int(r, P.childGap[0], P.childGap[1]);
  }
  if (chance(r, P.brotherChance)) {
    const age = Math.max(20, headAge + int(r, -8, 8));
    const bro = add(c, { given: chooseGiven(c, r, group, "m", undefined, [head.given!], fatherName, body.place), fatherName, sex: "m", born: year + age, group, body: body.id, place: body.place, house: hid, brotherOf: head.id, mother: mother?.id, ...adultBits(r), genes: genesFor(r, group, "m") });
    mother?.children.push(bro.id);
  }
  return house;
}

function makeCaptain(c: Census, r: Rand, def: CaptainDef, year: number): CensusPerson {
  // A group and two names that no living captain already has; a group whose names are used up is passed over.
  const used = new Set(living(c).filter((p) => p.side).map((p) => `${p.given}/${p.fatherName}`));
  const taken = living(c).filter((p) => p.body === def.id).map((p) => p.given ?? "");
  let group = weighted(r, def.groups), given = "", fatherName = "";
  for (let tries = 0; tries < 8; tries++) {
    fatherName = pick(r, fatherPool(group));
    given = chooseGiven(c, r, group, "m", undefined, taken, fatherName) ?? "";
    if (!used.has(`${given}/${fatherName}`) && !taken.includes(given)) break;
    group = weighted(r, def.groups);
  }
  const role = def.roles[group];
  return add(c, {
    given, fatherName, sex: "m", born: year + int(r, CENSUS_DATA.people.captainAge[0], CENSUS_DATA.people.captainAge[1]),
    group, body: def.id, place: def.side === "carthage" ? "carthage" : "syracuse", role, side: def.side, ...adultBits(r), genes: genesFor(r, group, "m", role),
  });
}

// The census at the start of a game. `r` is the game's random stream; the census draws from it in a fixed order.
export function generateCensus(r: Rand, season = 0): Census {
  const c: Census = { seed: int(r, 1, 2 ** 30), people: {}, houses: {}, n: 0 };
  const year = yearOf(season);
  for (const body of CENSUS_DATA.bodies) for (let i = 0; i < body.houses; i++) makeHouse(c, r, body, body.roles[i % body.roles.length], year);
  for (const def of CENSUS_DATA.captains) for (let i = 0; i < def.count; i++) makeCaptain(c, r, def, year);
  return c;
}

// ---- a season of life: deaths, births, marriages, coming of age, a new head for a house ----

function deathChance(age: number): number {
  const band = (CENSUS_DATA.life.death as { to: number; p: number }[]).find((b) => age <= b.to)!;
  return band.p / 4;
}
function causeOf(r: Rand, age: number): string {
  const K = CENSUS_DATA.life.causes;
  return pick(r, age < 15 ? K.child : age < 60 ? K.adult : K.old);
}
const kin = (c: Census, a: CensusPerson, b: CensusPerson) =>
  a.father === b.id || b.father === a.id || a.mother === b.id || b.mother === a.id ||
  (!!a.father && a.father === b.father) || (!!a.mother && a.mother === b.mother);

function die(c: Census, r: Rand, p: CensusPerson, season: number, notes: CensusNote[], cause?: string) {
  const age = ageOf(p, season);
  const why = cause ?? causeOf(r, age);
  p.alive = false;
  p.died = { season, age, cause: why };
  const sp = p.spouse ? c.people[p.spouse] : undefined;
  if (sp) { sp.spouse = undefined; sp.widowOf = p.id; p.spouse = undefined; }
  notes.push({ kind: "death", text: `${cap(censusName(c, p.id, true))} died, aged ${age}.`, why: `${cap(why)}.`, who: [p.id] });
  if (p.side) {
    const def = CENSUS_DATA.captains.find((d) => d.id === p.body)!;
    const next = makeCaptain(c, r, def, yearOf(season));
    notes.push({ kind: "captain", text: `${cap(censusName(c, next.id, true))} took over the company of ${censusName(c, p.id)}.`, why: `Its captain had died.`, who: [next.id, p.id] });
  }
  const h = p.house ? c.houses[p.house] : undefined;
  if (h && h.head === p.id) newHead(c, r, h, p, season, notes);
}

function newHead(c: Census, r: Rand, h: House, old: CensusPerson, season: number, notes: CensusNote[]) {
  const L = CENSUS_DATA.life;
  const members = living(c).filter((x) => x.house === h.id);
  const byAge = (a: CensusPerson, b: CensusPerson) => b.born - a.born;
  const sons = members.filter((x) => x.father === old.id && x.sex === "m").sort(byAge);
  const brothers = members.filter((x) => x.sex === "m" && x.id !== old.id && (x.brotherOf === old.id || old.brotherOf === x.id || (!!old.father && x.father === old.father))).sort(byAge);
  const grownSon = sons.find((x) => ageOf(x, season) >= L.headFromAge);
  const grownBrother = brothers.find((x) => ageOf(x, season) >= L.headFromAge);
  const widow = members.find((x) => x.widowOf === old.id);
  const next = grownSon ?? grownBrother ?? sons[0] ?? widow ?? members.filter((x) => x.sex === "m").sort(byAge)[0];
  const role = old.role;
  old.role = undefined;
  if (!next) {
    h.head = null;
    h.endedSeason = season;
    notes.push({ kind: "end", text: `The house of ${old.given ?? old.fatherName} at ${placeName(h.place)} has no one left to head it.`, why: `${cap(censusName(c, old.id))} died with no living son, brother or widow in the house.`, who: [old.id] });
    // Its place among the leading men is taken by a new house, so a city or bloc never runs out of named people.
    const body = CENSUS_DATA.bodies.find((b) => b.id === h.body);
    if (body && role) {
      const nh = makeHouse(c, r, body, role, yearOf(season));
      notes.push({ kind: "head", text: `${cap(censusName(c, nh.head!, true))} rises to be ${role}.`, why: `The house of ${old.given ?? old.fatherName} has died out, and a new man takes its place.`, who: [nh.head!] });
    }
    return;
  }
  h.head = next.id;
  next.role = role;
  const how = next === grownSon ? "his eldest living son" : next === grownBrother ? "his brother" : next === widow ? "his widow, who holds it for the children" : next.father === old.id ? "his son, still a child" : "the eldest man left in the house";
  notes.push({ kind: "head", text: `${cap(censusName(c, next.id, true))} now heads the house${role ? ` and is ${role}` : ""}.`, why: `${cap(censusName(c, old.id))} died; the house passed to ${how}.`, who: [next.id, old.id] });
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// One season. Returns what happened, in plain words with reasons, for the game's log. Draws from `r` in a fixed order.
export function stepCensus(c: Census, r: Rand, season: number): CensusNote[] {
  const L = CENSUS_DATA.life;
  const notes: CensusNote[] = [];
  const year = yearOf(season);
  const autumn = season % 4 === 0;

  for (const p of living(c)) {
    if (!p.alive) continue; // a captain's death can add people mid-loop; they are checked next season
    const age = ageOf(p, season);
    if (chance(r, deathChance(age))) { die(c, r, p, season, notes); continue; }
    // Coming of age: at 16 a child gets a character and an aim.
    if (autumn && age === 16 && !p.traits.length) {
      p.traits = traitsFor(r);
      p.ambition = weighted(r, CENSUS_DATA.people.ambitions);
      notes.push({ kind: "age", text: `${cap(censusName(c, p.id, true))} came of age.`, why: `Turned 16 this autumn.`, who: [p.id] });
    }
  }
  // A widow who holds a house hands it to her eldest son once he is grown.
  if (autumn) for (const h of Object.values(c.houses)) {
    const w = h.head ? c.people[h.head] : undefined;
    if (!w || w.sex !== "f" || !w.alive) continue;
    const son = w.children.map((k) => c.people[k]).filter((x) => x.alive && x.sex === "m" && x.house === h.id && ageOf(x, season) >= L.headFromAge).sort((a, b) => b.born - a.born)[0];
    if (!son) continue;
    h.head = son.id;
    son.role = w.role;
    w.role = undefined;
    notes.push({ kind: "head", text: `${cap(censusName(c, son.id, true))} now heads the house${son.role ? ` and is ${son.role}` : ""}.`, why: `He is grown, and his mother ${censusName(c, w.id)} hands the house to him.`, who: [son.id, w.id] });
  }
  // Births: a married woman of the right age, whose husband is alive.
  for (const m of living(c)) {
    if (m.sex !== "f" || !m.spouse) continue;
    const age = ageOf(m, season);
    const p = age >= L.birth.from && age <= L.birth.to ? L.birth.p : age > L.birth.to && age <= L.birth.lateTo ? L.birth.lateP : 0;
    if (!p || !chance(r, p / 4)) continue;
    const father = c.people[m.spouse];
    const sex: Sex = chance(r, 0.5) ? "m" : "f";
    const kid = add(c, {
      given: chooseGiven(c, r, father.group, sex, father, [], undefined, father.place), fatherName: father.given ?? father.fatherName, sex, born: year, group: father.group,
      body: father.body, place: father.place, house: father.house, father: father.id, mother: m.id, traits: [], ambition: null, genes: inherit(r, father, m, father.group, sex),
    });
    father.children.push(kid.id);
    m.children.push(kid.id);
    notes.push({ kind: "birth", text: `A ${sex === "m" ? "son" : "daughter"}${kid.given ? `, ${kid.given},` : ""} was born to ${censusName(c, father.id, true)} and ${censusName(c, m.id)}.`, why: `A birth in the house.`, who: [kid.id, father.id, m.id] });
    if (chance(r, L.birth.childbedDeath)) die(c, r, m, season, notes, "childbirth");
  }
  // Marriages, once a year in autumn: an unmarried woman and an unmarried man of the same place, not close kin.
  if (autumn) {
    const P = CENSUS_DATA.people;
    const free = (sex: Sex) => living(c).filter((x) => x.sex === sex && !x.spouse && !x.side && ageOf(x, season) >= P.marriedFrom[sex]);
    const heads = new Set(Object.values(c.houses).map((h) => h.head));
    for (const w of free("f")) {
      if (w.spouse || heads.has(w.id) || ageOf(w, season) > 40 || !chance(r, L.marriage.p)) continue;
      const men = free("m").filter((m) => !m.spouse && !kin(c, m, w) && m.house !== w.house &&
        Math.abs(ageOf(m, season) - ageOf(w, season)) <= L.marriage.maxGapYears && ageOf(m, season) >= ageOf(w, season) - 5);
      const here = men.filter((m) => m.place === w.place);
      const pool = here.length && !chance(r, L.marriage.otherPlaceP) ? here : men.filter((m) => m.group === w.group || (m.group !== "punic") === (w.group !== "punic"));
      if (!pool.length) continue;
      const m = pick(r, pool);
      const bride = censusName(c, w.id);
      marry(m, w);
      const from = w.place;
      w.house = m.house;
      w.body = m.body;
      w.place = m.place;
      notes.push({ kind: "marriage", text: `${cap(censusName(c, m.id, true))} married ${bride}${from !== m.place ? ` of ${placeName(from)}` : ""}.`, why: `A match between two houses.`, who: [m.id, w.id] });
    }
  }
  return notes;
}

// ---- lookups for the other systems (read only) ----

export const isAdult = (c: Census, id: string, season: number) => ageOf(c.people[id], season) >= CENSUS_DATA.life.headFromAge;

// The first man of a city: the head of its highest-standing house who is alive and grown.
export function censusLeader(c: Census, place: string, season: number): string | undefined {
  const hs = Object.values(c.houses)
    .filter((h) => h.place === place && h.head && CENSUS_DATA.bodies.find((b) => b.id === h.body)?.tie.kind === "city")
    .filter((h) => isAdult(c, h.head!, season))
    .sort((a, b) => b.standing - a.standing);
  return hs[0]?.head ?? undefined;
}

// The heads of the houses tied to a Carthaginian bloc (elders, hundred, people) or a Syracusan faction (rich, citizens).
export function censusCouncil(c: Census, tieId: string): string[] {
  return Object.values(c.houses)
    .filter((h) => h.head && CENSUS_DATA.bodies.find((b) => b.id === h.body)?.tie.id === tieId)
    .map((h) => h.head!);
}

// The n-th living captain hired by a side.
export function censusCaptain(c: Census, side: "syracuse" | "carthage", n = 0): string | undefined {
  const xs = living(c).filter((p) => p.side === side);
  return xs.length ? xs[n % xs.length].id : undefined;
}

// Everyone alive in a place (the captains of Syracuse count as at Syracuse).
export function censusAt(c: Census, place: string): string[] {
  return living(c).filter((p) => p.place === place).map((p) => p.id);
}

// Close family, in words, for a character sheet.
export function censusFamily(c: Census, id: string): { person: string; relation: string }[] {
  const p = c.people[id];
  const out: { person: string; relation: string }[] = [];
  const word = (x: CensusPerson, m: string, f: string) => (x.sex === "m" ? m : f);
  if (p.father) out.push({ person: p.father, relation: "father" });
  if (p.mother) out.push({ person: p.mother, relation: "mother" });
  if (p.spouse) out.push({ person: p.spouse, relation: word(c.people[p.spouse], "husband", "wife") });
  if (p.widowOf) out.push({ person: p.widowOf, relation: word(c.people[p.widowOf], "late husband", "late wife") });
  for (const k of p.children) out.push({ person: k, relation: word(c.people[k], "son", "daughter") });
  for (const s of Object.values(c.people)) {
    if (s.id === id) continue;
    const sibling = (!!p.father && s.father === p.father) || (!!p.mother && s.mother === p.mother) || s.brotherOf === id || p.brotherOf === s.id;
    if (sibling) out.push({ person: s.id, relation: word(s, "brother", "sister") });
  }
  return out;
}

// ---- checks (used by the tests and the 100-seed run) ----

// Anything here is a broken census: a one-sided marriage, a dead head, a reserved or repeated name, a lost captain.
export function censusProblems(c: Census, season: number): string[] {
  const out: string[] = [];
  const alive = living(c);
  const seen = new Map<string, string>();
  for (const p of alive) {
    const nm = censusName(c, p.id, true);
    if (!p.fatherName || p.given === undefined) out.push(`${p.id} has no name`);
    if (p.given && CAST_NAMES.has(p.given)) out.push(`${nm} carries the name of a person in the starting cast`);
    if (seen.has(nm)) out.push(`two living people called ${nm}`);
    seen.set(nm, p.id);
    const age = ageOf(p, season);
    if (age < 0 || age > 100) out.push(`${nm} is aged ${age}`);
    if (p.spouse) {
      const s = c.people[p.spouse];
      if (!s?.alive || s.spouse !== p.id) out.push(`${nm}'s marriage is one-sided or to the dead`);
      if (s && s.sex === p.sex) out.push(`${nm} is married to someone of the same sex`);
      if (s && kin(c, p, s)) out.push(`${nm} is married to close kin`);
    }
    for (const k of p.children) if (c.people[k]?.father !== p.id && c.people[k]?.mother !== p.id) out.push(`${nm}'s child does not name them as a parent`);
  }
  for (const h of Object.values(c.houses)) {
    if (h.head && !c.people[h.head]?.alive) out.push(`house ${h.id} is headed by the dead`);
    if (!h.head && h.endedSeason === undefined) out.push(`house ${h.id} has no head`);
  }
  for (const d of CENSUS_DATA.captains) {
    const n = alive.filter((p) => p.body === d.id).length;
    if (n !== d.count) out.push(`${d.name}: ${n} captains, expected ${d.count}`);
  }
  for (const b of CENSUS_DATA.bodies) {
    const n = Object.values(c.houses).filter((h) => h.body === b.id && h.head).length;
    if (n < b.houses) out.push(`${b.name}: ${n} houses, expected ${b.houses}`);
  }
  return out;
}
