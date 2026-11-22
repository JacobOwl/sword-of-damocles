// The public face of the simulation, for the UI, the tests and the headless runner.
export * from "./types.ts";
export * from "./state.ts";
export { DATA } from "./data.ts";
export { menu, preview, secondOptions, vote } from "./actions.ts";
export { startGame, act, endSeason, refuseRequest, replay, runBotGame, chooseEvent } from "./season.ts";
export { openEvents, EVENTS, eventById } from "./events.ts";
export type { ChoiceView, EventDef } from "./events.ts";
export { fullChronicle, chronicleText, seasonEntries, storyBook } from "./chronicle.ts";
export type { StoryBook } from "./chronicle.ts";
export { rankTitle, originById, agendaById } from "./data.ts";
export { PACKAGES, DEFAULT_TUNING, knobsFor, packageName } from "./tuning.ts";
export { BOTS, botById } from "./bots.ts";
export { SWITCHES, switchById, on as switchOn } from "./switches.ts";
export type { SwitchDef } from "./switches.ts";
