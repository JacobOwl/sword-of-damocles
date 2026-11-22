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
}

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
}

export interface Request {
  id: string;
  from: string;
  kind: "office" | "silver" | "citizenship" | "marriage" | "land";
  office?: OfficeId;
  faction?: FactionId;
  season: number;
  owed?: boolean;
  agendaStep?: boolean;
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
export interface EventInstance { uid: string; id: string; roles: Record<string, string>; season: number }
export interface EventsState {
  open: EventInstance[];
  queue: { id: string; season: number; roles: Record<string, string> }[]; // follow-ups waiting their season
  fired: Record<string, number>; // event id -> last season it fired
  count: number;
}

export type Input =
  | { t: "act"; action: string; args: Args }
  | { t: "refuse"; request: string }
  | { t: "choose"; event: string; choice: string }
  | { t: "end" };

export interface Args { target?: string; second?: string; option?: string }

export interface GameState {
  version: 1;
  seed: number;
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
  over?: { reason: string; text: string; season: number };
  invasions: number;
  leverage: Leverage[];
  blockedSlots: number;
  events?: EventsState;
}
