// The public face of the simulation, for the UI, the tests and the headless runner.
export * from "./types.ts";
export * from "./state.ts";
export { DATA } from "./data.ts";
export { menu, preview, secondOptions, thirdOptions, actionNotes, vote } from "./actions.ts";
export { away as awayWithArmy, commissionOn, keeperValue } from "./commission.ts";
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
export { PRESETS, presetById, presetOpts } from "./presets.ts";
export type { PresetDef } from "./presets.ts";
// The island scenario (Phase 2).
export {
  NODES, ROUTES, ISLAND, CARTHAGE, nodeDef, nodeName, sideName, cityWalls, cityMen, cityGrain, yourArmy, carthageArmy, armyName,
  menWords, carthagePersonName, path, reachable, goOverMods, surrenderMods, battleForecast,
} from "./island.ts";
export { carthageAgenda, goalDef, blocDef, actDef, prefers, moodWord } from "./carthage.ts";
export { inScenario } from "./actions.ts";
// The generated cast (island games).
export { leaderOfCity, councilOf, captainOf, peopleAt, censusPersonName, censusKin, censusLook } from "./census-game.ts";
export type { Census, CensusPerson } from "./census.ts";
export { counsel, seated, seatName, isFalse, councilName, COUNCIL } from "./council.ts";
export type { Counsel } from "./council.ts";
export { about as secretsAbout, knownBy as secretsKnownBy, secretLine, usable as usableSecrets, seenHolders, silenceCost, SECRETS } from "./secrets.ts";
// Switch "dinners": the dinner table.
export { DINNERS, wineById, couchHolder, friendsOf, foesOf, bonded, quarrelled, guestPool, parseGuests, suggestTable, castsFor, dinnersOn, dinnerLog } from "./dinner.ts";
export type { DinnerState, DinnerRecord, Tie } from "./dinner.ts";
export { logDigest } from "./digest.ts";
// Switch "convoys", Grain and the sea (island games).
export { CONVOYS, LANDINGS, convoysOn, atSea, pastConvoys, contractors, contractorLine, contractorName, contractorMods, catchMods, placeName as convoyPlace } from "./convoys.ts";
// Switch "greatWorks" (bet B4).
export { WORKS, workById, labourById, workOf, activeWorks, workDone, seasonCost, seasonsNeeded, overseerName, timberFrom, timberById, worksOn } from "./works.ts";
export type { Work, WorkDef, WorksState } from "./works.ts";
// Switch "exile" (Fallen, not finished; bet B7).
export { exileView, inExile, exileOn, companies, talents, refugeDef, rulerName, returnOdds, huntForecast, EXILE } from "./exile.ts";
export type { ExileState } from "./exile.ts";
// Switch "carthageChronicle" (bet B6): the decade told from Carthage's side, read from the log.
export { carthageBook, logLine, numberWords } from "./carthage-chronicle.ts";
export type { PunicBook, PunicYear, PunicSeason, PunicLine } from "./carthage-chronicle.ts";
