// Shared shapes for the simulation. Everything here is plain JSON so a game can be saved and replayed.

export type FactionId = "citizens" | "rich" | "guard" | "family";
export const FACTIONS: FactionId[] = ["citizens", "rich", "guard", "family"];
export type OfficeId = "citadel" | "treasury" | "mint" | "fleet" | "generalship" | "assembly";
export const OFFICES: OfficeId[] = ["citadel", "treasury", "mint", "fleet", "generalship", "assembly"];

// Moods, from worst (0) to best (4).
export const MOODS = ["Rebellious", "Angry", "Uneasy", "Content", "Loyal"] as const;
export type Ambition = "Wealth" | "Office" | "Safety" | "Revenge" | "Power";
export type Scar = string; // an id from data/rivals.json, so new rival origins can be added as data
export type Status = "free" | "held" | "outside" | "dead" | "absent"; // absent: enters the story later
export type Step = "world" | "people" | "factions" | "player" | "power" | "sword" | "chronicle";

export interface Grudge { reason: string; season: number }
export interface Memory { season: number; text: string }

export interface Rival {
  rank: number; // 1 Malcontent, 2 Schemer, 3 Faction leader, 4 Nemesis
  scars: Scar[];
  memory: Memory[];
  since: number;
}

export interface Person {
  id: string;
  name: string;
  faction: FactionId | "ruler";
  role: string;
  traits: string[];
  ambition: Ambition;
  opinion: number; // -3..+3, their opinion of you
  grudges: Grudge[];
  status: Status;
  kin: string[];
  wants?: OfficeId;
  marriageable: boolean;
  married: boolean;
  bound: boolean;
  refusals: number;
  owedFavor: boolean; // you owe them a favour (they lent to you)
  knownUntil: number; // their secrets are visible to you up to this season
  rival?: Rival;
  agenda?: AgendaState;
  player?: boolean;
  exposed: boolean; // named as a plotter after a failed blow
  infl: number; // influence gained or lost from events (offices, favours and leverage are counted on top)
  political?: Political;
  blockedUntil: number; // a Block cancels their next action
  informer: boolean; // reports to you about any plot they are in
  enters: number; // season they enter the story (0 = from the start)
  asks?: Record<string, { stage: number; last: number }>; // switch "escalation": how far each petition has gone
  pastRivalries?: number; // switch "escalation": times he was your rival before
  feud?: Feud; // switch "feud": his one record with you, never deleted
  where?: "field"; // switch "commission": away with the army (missing = in the city, or wherever his status says)
}

// Switch "feud" (design council V6): one dated record per person with you.
export interface Chapter { season: number; kind: string; text: string }
export interface Feud { chapters: Chapter[]; counted: string[]; survived: number; pausedRank?: number; title?: string; closed?: boolean; wasNemesis?: boolean }

// A political rival wants your place, not your death (rules v2, Jacob's change of 2026-11-22).
export interface Political { type: string; rank: number; since: number; outSeasons: number }
export interface Leverage { holder: string; over: string; season: number }

export interface AgendaState { id: string; step: number; done: boolean; result?: string }

export interface Faction {
  id: FactionId;
  name: string;
  short: string;
  base: number; // power not counting offices
  mood: number; // index into MOODS
  goal: number; // index into its goal list
  agenda: AgendaState;
  actedAgainst: boolean; // you worked against its agenda this season
  backing?: string; // plot id it backs
  disarmed: boolean;
  powerShown: number; // power as of the last power step, for logging changes
}

export interface Plot {
  id: string;
  leader: string;
  members: string[];
  backers: FactionId[];
  stage: number; // 1 Whispers, 2 Rumors, 3 Named
  stageSince: number;
  namedSince: number; // -1 until Named
  bonus: number; // lasting bonus (Nemesis agenda) or malus (disarmed citizens)
  known: string[]; // members whose names you have
  informer?: string;
  started: number;
  guardBacking: boolean;
  deeds?: Deed[]; // switch "clues": what the plotters did, so warnings can come from it
  heard?: string[]; // switch "clues": the clues you were told, in order
}

// Something a plot did, kept so a warning can tell of it (switch "clues").
export interface Deed { season: number; kind: string; who?: string; target?: string; faction?: string; grudge?: string; told?: boolean; shown?: boolean }

export interface Request {
  id: string;
  from: string;
  kind: "office" | "silver" | "citizenship" | "marriage" | "land";
  office?: OfficeId;
  faction?: FactionId;
  season: number;
  owed?: boolean;
  agendaStep?: boolean;
  demand?: boolean; // switch "escalation": asked once and refused, now he demands it
  blackmail?: string; // switch "secrets": the secret he will tell if you refuse
}

// Switch "secrets": a named secret about one person (or about you), and who holds it.
export interface Secret {
  id: string;
  tpl: string; // a record id in data/secrets.json
  about: string; // a person id, "dionysius" for you, or a census id when `census` is set
  census?: boolean;
  weight: 1 | 2; // 1 small (used up), 2 deadly (a hold that rests after each use)
  text: string;
  season: number;
  known: string[]; // who holds it
  rest: Record<string, number>; // holder -> last season the hold rests
  spent: string[]; // holders who used up a small secret
  args?: Record<string, string>;
  history?: boolean;
  publicSince?: number; // told to the city: no one can use it again
}
export interface SecretsState { list: Secret[]; n: number; seen?: string[] } // seen: men you know hold something over you

// Switch "council": who sits at your table, what they said, and how often they were wrong.
export interface CouncilLine { seat: string; who: string; census?: boolean; text: string; accuse?: string; truth?: boolean; lie?: boolean }
export interface CouncilState {
  seats: Record<string, string | null>;
  chosen: Record<string, string>; // seats you filled yourself
  brief: CouncilLine[]; // this season's briefing
  said: { season: number; by: string; about: string; truth: boolean; checked?: boolean }[];
  doubts: Record<string, number>; // times you caught a man's counsel false
  right: Record<string, number>; // times his warning proved true
  overruled: Record<string, number>; // person -> last season you overruled him
}

export interface Building { what: "citadel" | "granary" | "wall"; slotsLeft: number }

export interface LogEntry {
  n: number;
  season: number;
  step: Step;
  actor: string; // person id, faction id, or "world"
  text: string; // plain words, for the chronicle
  why?: string; // the reason, shown to the player
  visible: boolean; // false for secrets you haven't uncovered
  kind: "event" | "change" | "roll" | "warning" | "chronicle";
  roll?: { die: number; mods: Mod[]; total: number; need: number; ok: boolean };
}

export interface Mod { label: string; value: number }

// Events (data/events.json): one that has fired and waits for your answer, and the bookkeeping.
export interface EventInstance { uid: string; id: string; roles: Record<string, string>; season: number; falseRumor?: boolean } // falseRumor: switch "falseRumors"
export interface EventsState {
  open: EventInstance[];
  queue: { id: string; season: number; roles: Record<string, string> }[]; // follow-ups waiting their season
  fired: Record<string, number>; // event id -> last season it fired
  count: number;
  clues?: { season: number; text: string }[]; // switch "falseRumors": later word on whether a rumor was true
}

export type Input =
  | { t: "act"; action: string; args: Args }
  | { t: "refuse"; request: string }
  | { t: "choose"; event: string; choice: string }
  | { t: "end" };

// Options for a new game, beyond the seed and the balance package.

export interface Args { target?: string; second?: string; option?: string }

// The island scenario (Phase 2). A citadel game (Phase 1) has no island and runs exactly as before.
export type Scenario = "citadel" | "island";
export interface GameOpts { scenario?: Scenario; switches?: string[] }
export type Side = "syracuse" | "ally" | "free" | "tributary" | "carthage" | "exiles";
export interface CityState { id: string; side: Side; walls: number; men: number; grain: number; lean: number; fear: number; sacked: boolean; since: number }
export interface Army {
  id: string;
  side: "syracuse" | "carthage";
  at: string; // a node id from data/island.json
  men: number; // strength points (about 5,000 men each)
  beaten?: number; // the season it last lost a battle (switch "armiesBreak")
  food: number; // seasons of food carried
  commander: string;
  guard: number; // points that are your mercenary guard (they don't defend you at home while away)
  guardStart: number; // guard points that marched out
  since: number;
  moved: number; // last season it marched
  siege?: string; // the city it besieges
  siegeSince: number;
  onTake: "spare" | "sack";
}
export interface Bloc { id: string; power: number; mood: number }
export interface CarthagePerson { id: string; name: string; status: "free" | "command" | "disgraced" | "dead" }
export interface CarthageState {
  blocs: Record<string, Bloc>;
  goal: string;
  goalWhy: string;
  silver: number;
  mercs: number;
  levy: number;
  ships: number;
  plagueUntil: number;
  general?: string;
  people: Record<string, CarthagePerson>;
  armiesLost: number;
  offer: number; // season it last offered peace (-1 never)
  revolt: boolean;
}
// Switch "commission": who leads the army in the field, who keeps the citadel, and the tallies at the start, for the homecoming.
export interface Campaign {
  army: string; // the army's id
  leader: string; // PLAYER (you went yourself) or a person id
  keeper?: string; // who keeps the citadel while you are away
  since: number;
  lawful: boolean; // led by the holder of the generalship (or sent by you as general)
  armed: boolean; // the citizens' levy marched
  won0: number; lost0: number; taken0: number; // counters at the muster
  lost?: boolean; // the named leader died or fled while away
}
export interface IslandState { cities: Record<string, CityState>; armies: Army[]; war: boolean; warSince: number; carthage: CarthageState; sacks?: string[] } // sacks: the cities you sacked, in order

export interface GameState {
  version: 1;
  seed: number;
  tuning?: string; // id of the balance package in data/tuning.json (missing = the default)
  switches?: string[]; // optional rule switches from data/switches.json (missing = none)
  rng: number;
  season: number; // 0 = autumn 405 BC
  step: Step;
  slots: number;
  silver: number;
  grain: number;
  clock: number;
  land: number;
  guard: { strength: number; upkeep: number; arrearsSeasons: number; owed: number; refusing: boolean; forSale: boolean };
  granary: boolean;
  walls: boolean;
  building?: Building;
  laws: string[];
  offices: Record<OfficeId, string | null>;
  citadelBuilt: boolean;
  factions: Record<FactionId, Faction>;
  people: Record<string, Person>;
  plots: Plot[];
  requests: Request[];
  waiting: string[]; // would-be rivals waiting for a slot
  watches: string[]; // people you watched this season
  sieges: Record<string, number>;
  flags: Record<string, number>;
  counters: Record<string, number>;
  ids: number;
  log: LogEntry[];
  inputs: Input[];
  over?: { reason: string; text: string; season: number; by?: string };
  invasions: number;
  leverage: Leverage[];
  blockedSlots: number;
  events?: EventsState;
  scenario?: Scenario; // missing = citadel (Phase 1)
  island?: IslandState;
  census?: import("./census.ts").Census; // the generated cast of invented people (island games only)
  secrets?: SecretsState; // switch "secrets"
  council?: CouncilState; // switch "council"
  campaign?: Campaign; // switch "commission": the army in the field and who leads it
}
