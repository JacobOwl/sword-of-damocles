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
  menWords, carthagePersonName, path, reachable, goOverMods, surrenderMods, battleForecast, battleMods, friendly, hostileTo,
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
// Switch "quarrels" (Quarrels with terms).
export { openQuarrels, yourQuarrels, quarrelsAgainstYou, quarrelLine, quarrelsOn, AIMS as QUARREL_AIMS } from "./quarrels.ts";
export type { Quarrel, QuarrelState } from "./quarrels.ts";
// Switch "exile" (Fallen, not finished; bet B7).
export { exileView, inExile, exileOn, companies, talents, refugeDef, rulerName, returnOdds, huntForecast, EXILE } from "./exile.ts";
export type { ExileState } from "./exile.ts";
// Switch "carthageChronicle" (bet B6): the decade told from Carthage's side, read from the log.
export { carthageBook, logLine, numberWords } from "./carthage-chronicle.ts";
export type { PunicBook, PunicYear, PunicSeason, PunicLine } from "./carthage-chronicle.ts";
export { storesForecast } from "./forecast.ts";
// Switch "contestedBoard": the seats, the ladder of standing.
export { SEATS, BOARD, seatDef, seatName as boardSeatName, seatHolder, seatsOf, dugWord, standingName, standingOf, nextStep, race, votedNow, attitude, boardOn } from "./board.ts";
export type { BoardState, SeatId } from "./board.ts";
export type { Flow } from "./forecast.ts";
export { pronoun, sexOf } from "./pronouns.ts";
export { WAR, warOn, card as warCard, balance as warBalance, ledgerLines, termsFor, termsText, warChapter, townsHeld, pendulum, landingPossible } from "./war.ts";
export type { WarCard, PastWar, Terms } from "./war.ts";
export { townBoardsOn, seatsOf as townSeats, houseName, houseHead, divided as townDivided, sendsSupport, courtableSeat } from "./towns.ts";
export type { Seat, HouseLean } from "./towns.ts";
export { supplyOn, foodState, ravaged, supplyTowns, grainNeed, SUPPLY } from "./supply.ts";
export { plateOn, planDef, habitLine, stratagems, BATTLE } from "./plate.ts";
// Test 5: scenes, contingents, the ground.
export { allScenes, pendingScene, plateNow, scenesOn, groundOn, groundCard, GROUND, SCENES } from "./scenes.ts";
export type { Scene, SceneOpt } from "./scenes.ts";
export { armyParts, heart as partHeart, heartWord, bonded as partBonded, contOn, CONT } from "./contingents.ts";
export { FLEETS, fleetsOn, fleetState, soundYours, soundTheirs, fleetName, carthageFleetName, admiralName, orderDef, youOrder, fleetObeys } from "./fleets.ts";
export { returnsState, recovering, inTruce } from "./returns.ts";
export { ABROAD, abroadOn, abroadState, moodOf as abroadMood, moodWordOf as abroadMoodWord, powerDef, pharacidasHere, helpHere } from "./abroad.ts";
export { LIBYA, libyaOn, libyaState, inLibya, armyInLibya, landingOpen } from "./libya.ts";
export { LIBYA_NODES, isLibya } from "./island.ts";
export { ABROAD_NODES } from "./island.ts";
export { pendingChoice, signsOf, crisisOn, risingOf, CRISES } from "./crises.ts";
