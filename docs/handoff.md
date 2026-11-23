# Handoff

The thread that finishes a session writes this, not Jacob. Rewrite it at the end of every session.

## Built by the court-intrigue thread (14, 2026-11-23): secrets softened, and ways to fight back
- **Held secrets count half toward influence** (knob `influencePerSecret` 0.5 in `data/secrets.json`): two secrets over you give a rival 1 influence, not 2. Halving alone barely moved the numbers (the patron lost its old repeatable Expose), so a **political rival at rank 2 or higher now has a scheme** your watchers can see (one per game at the current setting; a new one every `schemeSeasons` seasons) ("is buying votes for his bid to take your place"), which you can expose or use. Knobs `schemeRank` and `schemeSeasons`.
- **You see who holds your secrets.** A man joins that list when he makes a demand, tells the city, or when your watchers follow him and overhear what he knows. The character sheet and the Secrets ledger show it (they read the engine's list now, not the log).
- **New action "Buy back a secret"** (Spies, secrets switch): 1 silver plus 1 for each small secret and 2 for each deadly one he holds over you, roll 3+ (Greedy +2, Wealthy -1, a grudge -1, a Pretender -2). He forgets, and any demand he made is withdrawn. On a failure you keep your silver and he thinks 1 less of you.
- **A blackmail demand is itself a secret you hold** ("tried to blackmail you"). Expose picks it first; once exposed, no one believes what he says about you, his holds are worthless and his demand is withdrawn.
- **Bots** expose a blackmailer first, buy back from a known political rival when they have spare silver, and pay a demand only when neither works.
- **Numbers** (300 seeds, patron deposed; without the switch, then with): citadel 30% to 40%, island 22% to 27%. Before this change it was 52% and 41%. Careful player with secrets: 7% citadel, 5% island. Blackmailers shown up about 1 a game; silence bought rarely (0.02 to 0.05 a game), because exposing is free once he has demanded.
- **Decided for story (the coordinator passed on "You decide"):** keep all 14 start secrets; keep the council's seat lists to men, since the lines say "he", and anyone can still be seated with Seat a counsellor; the council speaking on events is a good idea, kept in `docs/later.md` and not built, to keep this slice small.

## Built by the court-intrigue thread (14, 2026-11-22): two rule switches, off by default
- **Your council argues** (`council`; `data/council.json`, `src/core/council.ts`). Four seats at your table (the kinsman, the old friend, the purse, the sword), filled from lists of the real cast; in island games a fifth, **the voice of the rich houses**, is the head of the first rich house among the invented families. Before each action you open, each man says what he thinks (for it, wary, against it) and why, from his faction, traits, ambition and what he knows. Each season each gives one line on what worries him. A man in a plot, a political rival, or one who hates you (opinion -2 or worse) gives **false counsel**: he shields his fellow plotters and accuses an honest man. Watch the accused to catch a liar. New action **Seat a counsellor**. A seat adds 1 to a man's influence. No dice anywhere in the council.
- **Secrets and leverage** (`secrets`; `data/secrets.json`, `src/core/secrets.ts`). The old leverage tokens become named secrets. Five start secrets come from the sources (Plutarch *Dion* 11 and 21, Diodorus 13.95.4 and 14.8.5); nine more are invention. More come from deeds, and from yours. Small secrets are used up; deadly ones rest 2 seasons. Actions **Pay his servants**, **Demand his office**, island-only **Send spies to a town**. Rivals dig for your secrets, then ask a price for silence or tell the city. A man you hold a deadly secret over keeps yours to himself.
- **Screens** (`ui/components/intrigue.ts`), **card** `docs/research/council-and-secrets.md`, **report** `docs/playtests/2026-11-22-intrigue.md`, **tests** `tests/intrigue.test.ts`. The default game is unchanged.

## Questions from the court-intrigue thread
- Exposing a blackmailer costs nothing once he has made a demand, so bots almost never buy silence. Should exposing him cost something (he tells the city anyway, believed by some)?
- Women at the council with their own lines, if you want them later.

## Built by the island events thread (16, 2026-11-22), slices 1 and 2
- **A second event library for the island**, `data/island-events.json`: **37 events, 26 from the sources and 11 invented**. The card is `docs/research/island-events.md`, written by `node tools/build-island-events-card.mjs` from the data (safe to rerun). The quote checker reads the island events too (326 of 326 found).
  - Slice 1 covers sieges, supply, plague and mercenaries: the gate at midnight, the mole to Motya, siege towers, heralds to the temples, Greeks who fought for Carthage, the first man on the wall, ships on the beach, the late baggage, cutting their foragers, the grain convoy, fever in the lines, plague in the Punic camp, Himilcon's bargain, pay in land (Leontini), Punic silver for a captain, envoys to the Campanians, the allies' harvest, and the goddesses' temple.
  - Slice 2 covers embassies, the Italian Greeks, Sicels, Carthage's council and defections: Rhegium takes alarm (Laomedon), Heloris before Messana, new people for an empty Messana, envoys in dismay (Halicyae), Carthage's envoys to an ally, your friends driven out after a defeat (14.88.5), a first man's offer to come over, Agyris of Agyrium, the Sicels wavering, the hill of Taurus, the Sicel lords, Archonides founding Halaesa, Croton choosing Heloris, Carthage in mourning, and the captain of a garrison. Four "rumor from Carthage" events let you meddle in its politics: the Hundred putting the general on trial, a merchant of the Elders wanting peace, the dockyard speakers crying for war, and Libya's grievance. Each rumor is played by one of the generated councillors.
- **Engine:** `src/core/island-events.ts`, with small hooks in `src/core/events.ts`.
  - Events can name **towns** as parts (`places`).
  - Parts can go to **the generated cast** (a town's first man, a councillor of the Elders, the Hundred or the people, or a hired captain) and to **Carthage's named men**.
  - Conditions can check **armies and Carthage** in `when.island`.
  - Effects can change towns (lean, grain, men, walls, fear, side, opening the gates), armies (men, food, siege lines, lifting a siege, Carthage sailing home) and Carthage (bloc mood and power, treasury, hired men, levy, fleet, plague, a general's fall, peace).
  - Every effect is shown in plain words on the choice and logged with its reason.
  - Battles now set the flags `battleWon` and `battleLost`.
- **Pacing:** island games get one extra draw a season from the island events only, a second one 30% of the time, with at most two island events open. Citadel games never see them.
- **Pictures:** seven new emblems in `ui/vignettes.ts`: a gate under the moon, a siege tower, amphorae, a camp under birds, a herald's staff, a walled hill town, and the sign of Tanit between columns.
- **Tests:** `tests/island-events.test.ts` checks:
  - the shape of every event, and that none uses dates;
  - that every part and effect exists, and no ids show in the text;
  - that every choice runs without breaking a game (110 of 111 run);
  - that island events never fire in a citadel game;
  - that they fire in island games and replay exactly.
- **Checks:**
  - 79 of 79 tests pass.
  - Citadel, 100 seeds: unchanged by this work (killed 32, deposed 44, exiled 23, survived 1, after thread 07's Damocles event).
  - Island, 100 seeds for each of the five players: 0 crashes, 0 broken states.
  - Island events a game: careful 10, patron 9, simple 4.5, careless 4, iron hand 3.5.

## Questions from the island events thread
- **Sieges are rare for the bots** (under one a game), so you will mostly meet the siege events (the mole, the towers, the gate at midnight) in your own play. Is that rare enough, or too rare?
- **Himilcon's bargain** sends Carthage's army home without counting it as a lost army, so Himilcon's end (disgrace, starving himself) still never fires from it. Should taking the bargain disgrace him?
- **Duplicates:** the court's "The mercenaries' demand" tells the same story as the island's "Pay in land", and both can fire in an island game. Keep both, or hide the court one in island games? The court events "Leptines attacks", "Himilcon's offer" and "War on Carthage" overlap the island's own war in the same way.
- **Italy and the Sicels** stay as names (scope): their events move your towns, armies and Carthage, never an Italian or Sicel map piece. Heloris' two events need him in exile first, so they are rare.
- **Rumors from Carthage are always true.** Should some be false (for example, unless you have sent an embassy lately)?
- **Pre-existing, found while testing:** when Carthage storms Syracuse in the factions step, that season's court events stay open at the end of the game. It is harmless, but the court test only checks the simple bot in the citadel.

## Built by the web-app thread (17, 2026-11-22/23), steps 1 to 3
- **Step 1 (PR #26):** `docs/architecture.md`; `tests/core-boundary.test.ts` (the engine imports only itself and `data/`, no `Math.random`/`Date`/browser/Node globals, a JSON save plays on the same, bot games replay); `npm run replays` writes `dist/replays.json` for checking a later port.
- **Step 2 (PR #28):** Vite. `npm run dev` serves the game with live reload; `npm run build` writes the same one-file page and `--fragment` for the Artifact. The game link was republished from it (version 12).
- **Step 3 (PR #35): the new layout.** `ui/main.ts` is split into `ui/app/` (shell, save) and `ui/views/` (play, city, season, dangers, ending); the other UI files moved into `ui/views/`, `ui/components/`, `ui/lib/` and `ui/styles/`. The table of old and new paths is in `docs/architecture.md`. `ui/census.ts` is now `ui/views/families.ts`. Functions moved unchanged.
- **`npm run walk`** (`scripts/ui-walk.mjs`): a scripted walk through the built page (fixed seed and clicks, 1280 and 390 px, both scenarios, and a pass with every rule switch on): 110 pages, identical before and after each step.
- **Changed:** nothing in the game. **Broke:** nothing: 85 of 85 tests, typecheck clean, 100-seed run 0 crashes, 0 broken states.
- **Noticed, not changed:** `ui/views/families.ts` imports `src/core/census.ts` directly instead of through `src/core/index.ts`.
- **Next:** one click layer (each view owns its handlers), then the start screen as a view.

## Built by the events thread (07, 2026-11-23): five more Cicero court stories
- **Six new event records** (`data/events.json`, all history, card `docs/research/damocles.md`): No blade at your throat (barber, 5.58), A bed behind a trench (5.59), A voice from a tower (5.59), A joke at the ball game (5.60), A friend as pledge with its follow-up The hour of death (5.63). Each quotes the saved Latin.
- In 100 careful-bot games: tower 82, barber 67, pledge 57 (return 55), trench 42 (needs the wedding), ball game 20.
- **Broke:** nothing: 85 of 85 tests; 100 seeds in both scenarios, 0 crashes, 0 broken states; 351 quotes checked, 0 not found. Digest re-pinned for the added records only.
- **Restored:** PR #32 merged from an older base and undid PR #30 and #31 (deleted the saved Cicero Latin, and put the Damocles event back to "both readings"). Both are restored in this PR.
- **Question for Jacob:** the ball-game event can kill two invented courtiers over a joke, as Cicero tells. Keep it that harsh?

## Built by the events thread (07, 2026-11-22): the Damocles banquet
- **New event "A sword on a horse-hair"** (`data/events.json`, history): a courtier praises your fortune at a feast. You can hang a sword over his couch (what Cicero tells; he loses standing and warmth, plots are a little harder), reward the flattery, or smile it away. It fires in about 80 of 100 careful-bot games.
- **Settled on Dionysius I** (PR #31, after PR #30 saved Cicero's Latin): the event quotes 5.57, 5.59 and 5.61 and keeps Livius.org's Dionysius II reading as a disagreement. Only the timing is invention.
- **Changed:** two switch tests (another thread's) now test the rule, not luck: "clues" allows a man who said no to join later if a later join is recorded (it happens when a new wrong changes his mind), and "partial blows" checks the seize branch directly, since bot games reach it only about 3 times in 300. `partialBlow` in `src/core/season.ts` is exported for that test. Standard digest re-pinned for the one added event (verified: without it, the old digest matches).
- **Broke:** nothing: 72 of 72 tests; 100 seeds, 0 crashes, 0 broken states; 271 quotes checked, 0 not found.


## Questions from the web-app thread
- **Which Godot route?** Translating the engine to GDScript or C#, or running the TypeScript engine inside Godot. Not needed now; the architecture doc lists both, unverified.

## Built by the source-search thread (15, 2026-11-22): the missing source texts
- **Saved in this repo** (`sources/`, short exact quotes with link and licence): Diodorus 14.19 to 14.41.1 (archons for 401, 400 and 399, and every Sicilian line: Messenian mercenaries, Adranum, Rhegium's failed war in 14.40); Cicero's Damocles story (5.61 in English quotes; 5.57 to 5.63 in Latin); the Sibbolet gravestone (KAI 92). Cards: `docs/research/diodorus-401-399.md`, `damocles.md`, `punic-womens-names.md` (nine women's names, eight from Cooke 1903 and Livy, already saved in the phoenician-punic-world repo).
- **Changed:** `scripts/verify-cast-quotes.mjs` reads a file from this repo first, then the other repo, and now checks `data/calendar.json` too (254 of 254 found).
- **Broke:** nothing. 68 of 68 tests pass; the 100-seed run is unchanged (tyrannies 13, plots 432, deaths in events 23).
- **Not saved:** whole chapters (the cloud reader gives short quotes only), Yonge's or the Latin Cicero 5.57 to 5.63, Benz's name list. In `docs/later.md`.

## Questions from the source-search thread
- **Damocles is settled: Dionysius I** (Cicero's Latin, 5.57 to 5.63, now saved). Cicero gives no year, so when it happens in a game is a design choice. The same passage has five more court stories (the daughters as barbers, the trench round the bed, the ball-game killing, the tower, the two Pythagoreans); use any as events?
- **Rhegium's war of 399 (Diodorus 14.40)** fell apart because Messana's generals marched without a vote. Worth an event for the island?

## Built by the cast-generator thread (13, 2026-11-22), slice 1: the generated cast
- **Names from the sources** (`data/names.json`): 94 personal names, each with the passage where a real person bears it (Diodorus, Thucydides, Herodotus, Plutarch, Plato, Justin, Polybius, Livy, two inscriptions), in nine groups: Sicilian Greeks, Italian Greeks, Sikels, Carthaginians, Libyans, Campanians, Iberians, Gauls, Peloponnesians. Card: `docs/research/names.md` (its list is rebuilt by `node tools/build-names-card.mjs`). `tools/name-finder.mjs` is the drafting aid that found the passages; every quote is checked by `node scripts/verify-cast-quotes.mjs ../phoenician-punic-world` (247 of 247 found).
- **The generator** (`src/core/census.ts`, rules in `data/census.json`, all invention): about 165 invented people in 40 houses (the rich and the citizens of Syracuse, the leading men of Leontini, Catana, Messana, Gela, Acragas, Motya and Panormus, the exiles at Aetna, the Elders, the Hundred and the people's speakers at Carthage), each with a father's name, age, spouse, children, one or two traits from `data/traits.json`, an ambition, a role (the first man of Leontini, a grain-lord, a judge of the Hundred) and the parts of a face for the mosaic portraits. Plus four captains hired by each side.
- **A decade of life:** every season some die (by age; causes in plain words), wives bear children, widows hold houses for young sons, heirs take over with the house's role, houses die out and a new man rises in their place, a dead captain's company passes to a new one, and each autumn there are marriages and children come of age at 16. Every change comes back as a sentence with its reason, for the log.
- **In island games (slice 2):** `s.census` is made at the start of every island game from the game's one random stream (`src/core/census-game.ts`), and each world step runs a season of life, every change logged with its reason. The feed shows only deaths of heads of houses and captains, heirs, houses ending and new captains; births, marriages and comings of age are logged but shown only in the designer view. Citadel games have no census and replay exactly as before (100 seeds: killed 27, deposed 41, exiled 32, tyrannies 13, unchanged).
- **Lookups for the island thread**, exported from `src/core/index.ts`: `leaderOfCity(s, cityId)`, `councilOf(s, "elders" | "hundred" | "people" | "rich" | "citizens")`, `captainOf(s, side, n)`, `peopleAt(s, place)`, `censusPersonName(s, id, long)`, `censusKin(s, id)`, `censusLook(s, id)`. Not yet shown anywhere on screen: thread 10 chooses where city leaders and captains appear.
- 100 island games: 0 crashes, 0 broken states (the census is now part of the broken-state check); the simple bot's games end with about 173 invented people alive, 17 born, 12 dead and 6 new heads of houses; the careful bot's longer games, 38 born, 32 dead, 16 new heads.
- `npm run census -- --seed 7` prints a readable census and its decade; `npm run census -- --seeds 100` checks 100 decades. 1,000 decades: 0 broken states; about 167 people at the start and 179 at the end; a decade has about 55 births, 47 deaths, 13 marriages, 12 new heads of houses and 1 house dying out. Not tuned.
- `tests/census.test.ts`: every name attested, same seed same decade, 100 decades with no broken family, house, name or captain, births, deaths, marriages and heirs happen, no code ids in the words, no living invented person carries a cast name, the lookups for the island thread, every face uses the mosaic editor's choices.

- **Slice 3, faces and a page:** a new view, **The families** (island games only, `ui/census.ts`): every house of the island's towns, Syracuse's rich and citizens, Carthage's Elders, Hundred and people, and the captains of both sides, as cards with a mosaic portrait, name, role, age, traits in words, ambition, living family with ages and the "invented" marker; the dead at the foot. Portraits are laid in tiles in the browser by the mosaic editor's own code: `node scripts/build-mosaic-runtime.mjs` copies the editor's palette, bust drawing and tile laying out of `tools/mosaic-editor.html` into `ui/mosaic-runtime.ts` (generated; rerun it after changing the editor). Faces are drawn one at a time while the page is idle (about 0.2 s each) at 128 px, and change with age (grey hair, white hair, beards at 18). Coin colours for the new people (invention, thread 12 may change them in `lookOf` in `src/core/census.ts`): Syracuse's houses their faction's coin, other Greek towns bronze, Carthage, its towns and its captains Punic purple, Syracuse's captains the guard's teal.
- Checked at 1280 px and 390 px: no sideways scroll; about 45 faces painted within 9 seconds of opening the view.

## Questions from the cast-generator thread
- **Women's names.** Nine Punic women's names were added (from thread 15's card), written plainly for players (Amashtart, Ahatmilkat, Batshalom). The game leaves a quarter of Greek women and about a third of Carthaginian women unnamed ("the daughter of Tellias", "the wife of Bostar"), as the sources do. Keep these shares?
- **Annobal and Bodashtart**, a Punic name from Roman Leptis Magna and a Phoenician king of Sidon, pad the thin Carthaginian list. Keep or cut?
- **Births and deaths:** about 55 births and 47 deaths in a decade among 165 people. Too busy for the log, or the right texture? (The island slice can show only deaths and heirs of people who matter.)
- **The families page:** useful as its own view, or should these people only appear where they matter (a city's first man on the island map, the captain on an army, the elders on Carthage's council)? Thread 10 has the lookups for that.
- **Scope check:** the generated people fill the island's cities, Carthage's council and the captains. Nobody plays an heir, so "generations" stays out. Say if you'd rather this waited.

## Built by the art thread, second round (2026-11-22)
- **Diodorus' years** in the chronicle and on each autumn's season card (`data/calendar.json`, `docs/research/calendar.md`).
- **Sound** (`ui/sound.ts`), off until you click the lyre in the masthead.
- **The island map's look** (`ui/island-art.ts`, `ui/art/map-art.json` from `node scripts/make-map-art.mjs ../phoenician-punic-world`). On a phone the map scrolls sideways instead of shrinking the names.
- **Figures in eight event pictures** (`ui/figures.ts`).
- Questions: do the figures read well at their size, and which other events should get people? Is the sound worth keeping, too loud or too quiet? Should the drone start at Rumors or only at Named?

## Built by the rule-switches thread (09, 2026-11-22)
- **Five rule switches, off by default** (`data/switches.json`; engine in `src/core/switches.ts`, `src/core/clues.ts` and small hooks in `ai.ts`, `actions.ts`, `ops.ts`, `season.ts`, `chronicle.ts`). The start screen has a "Rule switches" fold with a checkbox and a one-line summary for each; the save and the footer remember them.
  - **Warnings are clues:** plots keep a list of deeds; each warning tells of the newest one (grievance, faction, the man who said no, the guard's new silver). Lines are in `data/warnings.json` under `clues`. Plot cards show "What you have heard".
  - **Blows can miss:** beating your defense by 1 or 2 wounds you; by 3 or 4 costs an office and half your silver; 5 or more kills or exiles as before. Margins are `knobs` in the switch's data.
  - **People escalate:** ask, wait a season, demand in public, then never again for that office; old enemies return a rank higher.
  - **A Pretender needs a coalition:** rank 3 and Take his place steps need a second faction Angry or worse with you.
  - **Chronicle as story:** `storyBook()` in `src/core/chronicle.ts`; the UI chronicle shows seasons by person, a Lives section and How it ended.
- `npm run sim` takes `--switches a,b` and `--switch-sweep` (none, each alone, all), with new counts: wounds, offices lost to a blow, the odds a strike kills, repeated asks, the same man made an enemy, returning enemies, fresh warning lines, the most-repeated chronicle sentence, the top ender's share.
- The careful and other bots read told clues when picking suspects (`clueHit` in `bots.ts`); with the switch off it changes nothing.
- `tests/switches.test.ts`: off by default, unknown switch refused, every switch alone and together with five players and no broken state, replay with switches, clues filled and true, no one asks more than twice, partial blows happen, Pretenders need a coalition, the story chronicle shows no ids.
- Report: `docs/playtests/2026-11-22-switches.md` (500 seeds × 4 players × 7 switch sets × 2 packages).
- **Works with the island scenario too** (merged after Phase 2 slice 1): all five switches on, Reap what you sow, 100 island games each for the simple, careful, patron and iron-hand players: 0 crashes, 0 broken states; the careful player survives 90, the patron 94. The sweep tables in the report are for the citadel scenario only.

- **Sixth switch, One feud record** (council V6; `src/core/feud.ts`, hooks in `ops.ts`, `actions.ts`, `season.ts`, `ai.ts`): one record per person, settlements that pause, rank from surviving you, the feud passed to kin on execution, political rivals that stay until a turning point. Character sheets show "Feud with you"; the story chronicle titles people ("the Returned"). `npm run sim -- --switch-sweep --sets none,feud,escalation+feud` compares sets. Report: `docs/playtests/2026-11-22-feud.md`.

## Questions from the rule-switches thread
- One feud record: political rivals now stay until something decisive happens, and they hold the cap of two. Is that a slow squeeze you like, or should the cap rise when the switch is on?
- Which switches should be on for your next playtest? The report suggests People escalate and Warnings are clues; then A Pretender needs a coalition; Blows can miss with Standard balance.
- Blows can miss: is a wound (one lost action) enough of a cost? Should the wounded ruler also lose defense for a season?
- Coalition: is "Angry or worse" the right bar for a second faction, or should Uneasy count? (With Uneasy, the rich families qualify from the first season and the switch did almost nothing.)
- The feud record from the design council (V6): build it as a sixth switch?

## Built by the art thread (2026-11-22)
- **Art direction** in `docs/art-direction.md`: the catalogue look, four materials, colours, type, icons, event pictures, motion, words, and a section for the island map.
- **Icons** (`ui/icons.ts`): 25 black-figure silhouettes for factions (sword, hearth, horse, grain, helmet; Carthage a palm), offices, action areas and stores. Used in the ledger, offices, factions, action menu, who is who, court and character sheets.
- **Event pictures** (`ui/vignettes.ts`): 22 red-figure cup tondi; each event names one with `art` in `data/events.json`.
- **Title page** (`ui/title.ts`): a painted panel of an empty couch under the sword, the title in inscription capitals, Heloris' saying, a coin tray of the cast. The start options keep their ids; thread 10 will add a scenario choice inside `.begin-options`.
- **Season cards and the sword overhead** (`ui/ambient.ts`): a card with the new season and one line of flavour from `data/flavor.json` (click, key or 3.6 seconds); a sword in the masthead that sways more as the worst known plot advances.
- **Ending as a stele, chronicle as a book** (opening line, drop capitals, colophon), meander rules, parchment specks, silver-coin action slots, page-turn motion. All motion stops under reduced motion.
- `tests/look.test.ts`: pictures and icons exist for every event, faction, office and area; flavour covers every season and condition; the flavour and the sword never change the state.
- Rules untouched. 100 seeds: 0 crashes, 0 broken states; killed 27, deposed 41, exiled 32; tyrannies 13 (same as before).

## Questions from the art thread
- Does the look land? Title page, season cards, event pictures: keep, tone down or change?
- Season cards appear at every season change. Too much? (A switch to turn them off is cheap.)
- The sword overhead: readable as a danger gauge, or too subtle?
- Faction emblems: horse for the rich families (their cavalry), grain for the citizens, helmet for the guard, hearth for the family, palm for Carthage. Any you'd change?

## Built by the design council (thread 11, 2026-11-22)
- Docs only: `docs/council/2026-11-22-design-council.md` (eleven verdicts with positions, votes and dissents) and the full statements in `docs/council/2026-11-22/`. No code, data or rules changed, so the 100-seed counts are untouched.
- Verdicts that touch thread 09 (feud record, clue warnings and partial success in a first-test preset, story counts) and thread 10 (the engine refactor first, commissions, one food counter, Carthage's sourced skeleton, history as conditions) were sent to those threads.

## Questions from the design council (Jacob's to decide)
- ~~Size of the first island test~~: decided by Jacob, 2026-11-22: keep the current plan (8 cities and Aetna, routes, foraging).
- **The hinge:** a commission (one of your three actions sends a named man, or you, with men and a purpose; the general commands by default, anyone else costs standing). The plan says only the general gives orders. (V2)
- **Replace "drift toward 5"** with power that people carry, as a switch first? (V4)
- **A named "First island test" preset** (island, Reap what you sow, clue warnings and partial success on), and a pause after year 4? (V1, V5)
- **One dice stream per system** from the seed: decide before the engine refactor or not at all; it changes CLAUDE.md's "one seeded RNG". (V11)
- **Ideas ranked by the council:** "mark this moment" button and a story sweep (tied first), an ambition chosen at the start, dice streams, playing on as an exile, disputed numbers. Parked in `later.md`.
- **Carthage's blocs:** keep the Elders and the Hundred as tagged invention from later sources, or use the council's general, council mood and two rival houses? (V7)

## Built by the Phase 2 thread (10, 2026-11-22): the island, slice 2 (towns that change sides)
- **Towns go over to a great army** (`goOverMods` and `goingOver` in `src/core/island.ts`): each season, a free or tribute town within 6 days of your army, or (in war) a free town, ally or town you took near Carthage's army, rolls d6 plus its lean, fear, "awed by the size" (6+ points), "the strongest on the island", minus 2 if the other army is near and 1 for strong walls; 7 or more and it goes over. Carthage's own towns never do (14.48.1). The roll and every modifier are in the log; the city table shows "may go over to you (2 in 6 next season)".
- **Fear after a sack** (`surrenderMods`): when your army reaches a town that fears you, it rolls to open its gates before a siege, naming the last town you sacked ("they remember the sack of Catana"). Fear fades a step each summer.
- **Switch "Beaten armies can break"** (`data/switches.json`, off): a beaten army with no food, or beaten twice within a year, scatters. With it on (careful bot, 100 seeds) Carthage loses 0.25 armies a game, 0.21 of them broken; without it, 0.
- **The bots** no longer march into Carthage's army unless their battle numbers are better by 1; the iron hand sacks Carthage's towns and towns that lean against it.
- The old war rule (every town leaning against you went over at once when Carthage's army outnumbered yours) is gone.
- `tests/island.test.ts`: five new tests (going over, fear surrender, fear fading, the switch, replay with the switch).
- Checks: 57 of 57 tests pass. Citadel 100 seeds unchanged (10.8 seasons; killed 27, deposed 41, exiled 32; tyrannies 13). Island, 100 seeds for each of the five players: 0 crashes, 0 broken states. Careful bot: wars 0.86, battles 0.33 (won 0.06, lost 0.22), cities taken 1.31, towns going over to you 0.72, to Carthage 0.14.

## Broke or odd after slice 2 (found, not tuned)
- **The fear rule never fires in the sweeps.** Only the iron hand sacks, and it rarely lives past season 9. It works in its unit test. Your playtest is the real test.
- **Battles fell from about 1 a game to 0.33** now the bot avoids bad fights; when Carthage attacks it still wins most (it is usually larger). Most of the careful bot's gains now come from towns going over (0.72 a game), not fighting.
- **Carthage still never loses an army with the switch off.**

## Built by the Phase 2 thread (10, 2026-11-22): the island, slice 1

Play it: the browser game now starts **the island** by default (a "Game" choice on the start screen keeps **the citadel**, Phase 1, exactly as before; a test pins its digest). `npm run sim -- --seeds 100 --scenario island` gives the island summary.
- **Data:** `data/island.json` (8 cities and Aetna, their sides in 405 from the peace terms, roads in marching days, every rule number), `data/carthage.json` (four blocs, four men, five goals, thirteen acts, thresholds). Card: `docs/research/island-405-395.md` (all 24 quotes checked by `scripts/verify-cast-quotes.mjs`). The Elders, the Hundred and the people of Carthage are tagged invention from a later description (Aristotle), per the design council.
- **Engine:** `src/core/island.ts` (cities, roads, armies, food, sieges, plague in camps, battles, assaults, taking, sparing or sacking a city, mustering), `src/core/carthage.ts` (the council picks a goal by bloc power, two acts a season from its menu in the goal's order, its general's own priority list, plague, Libyan revolt, peace offers, silver to your enemies, your fleet intercepting the crossing), `src/core/island-actions.ts` (your eight actions: Muster the army, Send the army, Storm the walls, Forage, Disband, Embassy to a city, Declare war, Accept Carthage's terms), `src/core/island-bot.ts` (what the headless players do on the island). Hooks: the world step runs the island instead of the old invasion roll; Carthage acts after the Syracusan factions; the guard does not defend you while it is away with the army; in the island game the Carthage clock is called Carthage's anger and is what its council reads. Raid and March on are citadel-only.
- **Browser game:** a new view, The island (`ui/island.ts`): the map of Sicily (Natural Earth coastline cut by `scripts/make-island-map.mjs`, palette from the art direction), armies as flags, sieges ringed, a cities table, and a Carthage panel (goal and why, each bloc's power, mood and what it wants now, what Carthage will do next in order, its men). Checked at 1366 and 390 px wide, no sideways scroll.
- **Tests:** `tests/island.test.ts` (scenario separation, replay, 30 games for every bot with no broken state, war actually happens, no code ids in the log or the view). `scripts/sim-check.ts` checks island values; `scripts/sim.ts --scenario island` fails if no battle, siege or city changes hands.
- **100 seeds, island:** simple bot: 0 crashes, 0 broken; average 11.4 seasons; wars 0.21 a game, landings 0.31, battles 0.17. Careful bot: 0 crashes, 0 broken; average 29.0 seasons, 62 survive; wars 0.85 a game, landings 1.33, sieges 0.84, battles 1.03 (you win 0.20, lose 0.68), cities taken by you 1.39, lost 0.68, going over to Carthage 0.66, peaces 0.36. Citadel 100 seeds unchanged (10.8 seasons; killed 27, deposed 41, exiled 32; tyrannies 13).

## Broke or odd in the island (found, not tuned)
- **Carthage never loses an army** in 100 careful games: a beaten army always has a friendly town to fall back to, so Himilcon's end (disgrace, starving himself) never fires. Possible fixes, all Jacob's: a beaten army that is also hungry breaks; a second defeat in a year breaks it; plague halves it more often.
- **Plague in a siege camp** is rare (0.04 a game) even after lowering the size it needs from 10 to 6 points, because armies rarely sit through a summer before a city.
- **You lose most battles** (0.68 lost to 0.20 won): the bot attacks when its army is merely equal, and Carthage gets "its own ground" near its towns.
- **The Libyans revolt about once a game** and Quiet Libya is Carthage's goal for about 5 seasons of 40: every war levy sours them.
- The bot never sacks a city, so the fear-and-hatred rule is untested by the sweep.

## Questions from the Phase 2 thread
- Keep the decade 405 to 395, or start nearer the war so the island test reaches it sooner?
- Should you see all of Carthage's council (as now), or only what spies and envoys learn?
- Should you (Dionysius) be able to lead the army in person, away from the court? The design council recommends this "commission" as the hinge between the map and the plots (`docs/council/2026-11-22-design-council.md`); it is parked in `docs/later.md`.
- Army sizes: one strength point is about 5,000 men, so armies show as "about 40,000 men". Diodorus' numbers are larger and disputed (card). Fine, or show only words (small, large, vast)?

## Built by the portrait thread (2026-11-22)
- **Placeholder portraits for all 24 people** in `ui/art/portraits/<person id>.webp`: mosaic coins, 192 px, about 20 KB each. `scripts/build-ui.ts` inlines them as `window.__PORTRAITS`; `ui/portraits.ts` reads that map and keeps the initial-in-a-circle fallback (which the headless tests still use). The dead still show greyed out.
- **The mosaic editor** in `tools/mosaic-editor.html` (Jacob's Carthage Mosaic Editor plus a Portrait mode, a cast sheet and zip export). To change a face: open the editor, Save, Open saved settings, load `ui/art/portrait-looks.json`, change the person, then on The cast set Tiles to size 7, tick Transparent outside the coin, choose 192 px and WebP, Save all as a zip, and copy the files over `ui/art/portraits/` (drop the `-192` from the names). Save the looks file back too. The build inputs for the editor are in the project files under `mosaic-editor/`.
- `tests/art.test.ts`: one picture per person and no strays, each a small WebP, and the looks file matches the cast and says the looks are invention.
- Rules and data untouched by this work. 100 seeds after merging the events work: 0 crashes, 0 broken states, average 10.8 seasons; killed 27, deposed 41, exiled 32; tyrannies 13.

## Questions from the portrait thread
- Are the faction colours on the coins right (ruler and family blood red, rich blue, citizens olive, guard teal)? Should the ruler stand apart from his family?
- At the small 26 px size the faces are only shapes. Fine as is, or should small slots use a flat, drawn version?
- Do any looks jar with what you picture (for example Aristotle the Spartan in a pilos with long hair, Damon the smith in a felt cap)?

## Built by the balance thread (2026-11-22)
- **Balance packages** in `data/tuning.json`: the plot, defense and political-rival numbers in one place. **Standard** (rules v2 as built) is still the default; a test checks it plays byte for byte as before. Three options: **Slow fuse**, **Fair fight**, **Reap what you sow**. The start screen has a Balance menu with a one-line summary of each; the save and the footer remember which one a game uses. The UI's "strength 6" and "within 3" lines now read the package.
- **Four new headless players** in `src/core/bots.ts`: careful, patron, iron hand (id `tyrant`), careless (random). They see only what the screen shows you and use their own random stream, so their games replay from inputs like yours. The simple bot is unchanged.
- **`npm run sim`** now takes `--bot`, `--tuning`, `--sweep` (every player against every package), `--markdown` and `--json`. New story counts: seasons of warning before a strike, whether you knew the leader, the odds of the blow, near coin flips, plots broken, who ended your rule.
- **The report:** `docs/playtests/2026-11-22-balance-sweep.md` (1,000 seeds per player and package, the comparison, a recommendation and five problems found).
- Merged with the interface polish (#5): the Balance menu sits beside Begin; the plot card reads its strike threshold from the package; three help lines in `ui/help.ts` now say their numbers are for Standard balance.
- `tests/balance.test.ts`: default and unknown packages, the standard digest, knob names, replay under every package, 40 games for every player under every package with no broken state.

## Built
- **Research note on political games** (`docs/game-research.md`, 2026-11-22): what CK3, the nemesis games, King of Dragon Pass, Six Ages, Suzerain, RimWorld, Republic: The Revolution, Twilight Imperium, Republic of Rome and others do well and badly, with 13 ranked proposals for this game (top five starred), traps to avoid, what v2 is missing, and a note on the Warner Bros. nemesis patent. Report only; nothing in it is built.
- **A playable browser prototype of rules v2.** `npm run build` writes one self-contained page, `ui/dist/index.html`. The same page is published for Jacob as an Artifact: https://claude.ai/artifact/8KqQzj6x3QrXRjQKzVZNK4
- **The engine** (`src/core/`, no UI imports, runs headless). One seeded random stream; a game replays exactly from its seed and your inputs. The season runs world, people, factions, you, power, sword, chronicle. Every change goes through `ops.ts`, which writes it to one log with its reason. The chronicle reads that log.
- **The menu:** all 27 v2 actions, the 4 scheming actions (used by the computer's people), plus Pay the guard's arrears and the three leverage actions (Force a favor, Block, Expose). Every roll shows its target number and every modifier before you commit, with the chance.
- **Faction power 0 to 10** with Marginal, Active and Dominant bands; moods; goals; the five faction agendas plus Philistus' and Kingmakers.
- **Enemies** (scars, ranks to Nemesis, memory, blood feud, the cap of 3, waiting in the wings) and **political rivals** (influence, types, ranks to Pretender, the agenda Take his place, which can depose you without killing you; cap of 2). Rival origins and types are data in `data/rivals.json`, so new kinds can be added.
- **Plots and the sword** with the three warnings, strike rules and the failed-plot exposure.
- **Content in `data/`:** factions, people, offices, traits, actions, agendas, laws, places, warnings, rivals, start. Every record carries `kind`; history records carry a source and a card.
- **Checks:** `npm test` (10 tests: determinism, replay, step order, odds shown, every change has a reason, no ids shown to players, 100 headless games with no broken state, content validation). `npm run sim -- --seeds 100` prints the summary.
- **Designer view** in the UI shows the hidden moves (plots forming, recruits, secret rolls) for playtesting.

## Built by the cast thread (PR #2)
- `data/people.json`: 24 people. 21 can act: 17 real people (Dionysius, his brothers Leptines and Thearides, his sister Theste and her husband Polyxenus, Heloris, Andron, Doris, Hipparinus, Philistus, Aristomache, Theodorus, Nicoteles, Aristotle the Spartan, Doricus, Biton, Archylus), plus four invented people or unnamed roles: the leader at Aetna, the brother of Demarchus, a guard captain and Damon the smith. 3 are dead at the start and kept as anchors for grudges (the first wife, Daphnaeus, Demarchus). Each history record carries its facts with a quote, a citation and the saved file it came from, and lists which fields are invention.
- Doris enters in summer 398; Biton and Archylus in summer 397.
- `data/factions.json`: sourced facts on each faction. Starting leaders: Nicoteles, Hipparinus, Aristotle the Spartan, Leptines.
- `data/outside.json`: Carthage, Sparta, the nearby cities and the Italian Greeks, with their named men. Pressure and chronicle names only.
- `docs/research/cast-405-395.md`: the card behind all of it, with dates as ranges and disagreements shown.
- `tests/cast.test.ts` (shape, kin, offices, scars, no code ids in names, roles or grudges) and `scripts/verify-cast-quotes.mjs` (`node scripts/verify-cast-quotes.mjs ../phoenician-punic-world`; 75 of 75 quotes found).
- Corrected `docs/research/dionysius-405-403.md`: Philistus' marriage to Leptines' daughter is in Plutarch, *Dion* 11 (no date).
- 100 seeds with the new cast: average 9.8 seasons (was 8.4); killed 29, exiled 41, deposed 29, survived 1; tyrannies 1; plots 3.71 a game, 70 blows landed of 79 strikes; enemies 1.67, political rivals 2.60, Pretenders 0.46, Nemeses 0.11 a game; factions Dominant 2.09 a game, Marginal 0.04. No crashes, no broken states. Still lopsided against the bot; not tuned.

## Built by the interface thread (2026-11-22)
UI only: no file in `src/core/` or `data/` changed, so the rules and the 100-seed counts are untouched.
- **Character sheets.** Click any name, anywhere (feed, chronicle, offices, rivals, petitions), to open that person's sheet: portrait slot, a "real person" or "invented" marker, role, faction, offices, what they think of you with the reasons from the log ("to 0, you refused his petition, Spring 404 BC"), grudges, traits in plain words ("His own rolls: Recruit +1"), ambition, influence, enemy and political-rival ranks with tracks, memories and agendas, what you know of their plots, family ties from `people.json` (clickable), what they did lately, and for real people the quoted passages with citations. Buttons for every action you can take toward them open that action with them already chosen.
- **The court**, a new view: everyone by faction as cards, with portrait, marker, office, flags (enemy rank, rival rank, plotting, informer) and opinion in words (Hates you, Bitter, Cool, Indifferent, Warm, Friendly, Devoted). The dead are listed at the foot; people who enter later are counted, not named.
- **Dangers column.** Plots get a four-step track (Whispers, Rumors, Named, Strike), when they can first strike, the names you have, and, once you have an informer, strength against your defense as a bar. A short "what you can do" line. Enemies and political rivals are one "Rivals" list with portraits. "Who is who" is a compact list with opinions.
- **A readable season.** Rolls are sentences ("needed 4, rolled 2, +1 Dominant, so 3. Failure."). Agenda steps read as deeds ("The citizens build a following, a step toward the people's assembly"). A "What shifted" list shows opinion, mood, power, office and store changes with reasons (before, players never saw these). "How last season ended" folds the previous season's results.
- **The chronicle** is its own view, oldest first, by year and season, three paragraphs a season (the city, you, what followed), turning points in bold, omens in italics, names clickable, no dice. Built from the visible log in `ui/story.ts`; the engine's own chronicle text is unchanged.
- **Onboarding.** A six-step "How a season works" guide on the first game (dismissable; remembered in the browser), a "How to play" view with a glossary, and tooltips (hover, focus or tap) on the ledger, faction power, moods, agendas, plot stages, ranks and markers.
- **Portraits.** `ui/portraits.ts` has one `PORTRAITS` map (person id to image URL or data URL). Empty for now; everyone gets a tessera roundel in their faction's colour with an initial. The art thread can fill the map without touching the screens.
- **Phone width** checked at 390 px: no sideways scroll, ledger in a grid, sheet as a full-height dialog.
- `tests/ui.test.ts`: every sheet, the court, the chronicle and every season feed render for 20 finished bot games with no code ids, "undefined" or "NaN" shown; names link longest first; pronouns.
- Code: `ui/main.ts` (shell), `ui/text.ts` (helpers, pronouns, name links), `ui/people.ts` (sheet, court), `ui/story.ts` (feed, chronicle), `ui/help.ts` (guide, glossary, tooltips), `ui/portraits.ts`.

## Built by the events thread (06, 2026-11-22)
- **An event system, all data.** `data/events.json` holds every event: a trigger from game state (`when`: dates, stores, moods, power, flags, offices, plot stage, other events), the people it needs (`roles`: by id or by faction, trait, opinion, grudge, office, plot and so on), text with `{role}` names, and defined choices. Each choice has a cost, set effects and sometimes a roll; the player sees every effect in plain words and every roll's modifiers and chance before choosing. `src/core/events.ts` only reads the data. 33 effect kinds, all through `ops.ts`, so every change is logged with its reason.
- **Where it runs.** At the end of the people step: queued follow-ups first, then one draw a season (35% chance of a second), at most three waiting. Answering costs no action unless the choice says so; unanswered events take the choice marked default when the season ends. Answers are inputs, so games replay exactly. The bot answers by scoring the visible effects.
- **52 events.** 33 from the sources (Diodorus 14, Plutarch *Dion*, Polyaenus 5.2, *Oeconomica* 2.2): Andron's confession, Polyxenus' flight and Theste's answer, Rhegium's refusal, the two weddings, the son from Locri, the charge against the Locrian mother, the council in the Island (Heloris, Polyxenus, Philistus) and the Campanians' price, Aristus the Spartan, the harvest disarming, the Epipolae wall, the arms workshops and the catapult, war while Carthage is sick, Theodorus' speech and the Spartan veto, the embassy for ships, the mercenaries' demand and Leontini, Carthage's secret offer, Marsyas' dream, the borrowed spear, Philistus' marriage, the man with the secret, the musicians, the feigned death, Demeter's ornaments, tin coins, Asclepius' offerings, sharing out the land, Doricus at Herbessus, terms for Aetna, Leptines' sea battle, the veterans' pay. 19 invented: a quarrel at your table, a debt called in, a house in ruin, a match between houses, a fever, blood in the agora, fire in Achradina, a storm, a bad omen, a poet's verses, a slave with a story, a disputed estate, a grain ship, the captain's dice, the spring festival, Carthaginian silver, light coins, a letter from the exiles, your promise comes due.
- **Follow-ups chain:** the flight leads to Theste; the weddings to a son and then to the charge; the council to the Campanians; the embassy to thirty ships; Theodorus' speech to a promise that comes due six seasons later.
- **Research card** `docs/research/events-405-395.md`: each sourced event's quotes, files, dates as ranges, what is invented, how far to trust each author, and the substitutions (Marsyas is played by a guard; Andron's tempter is cast from the unfriendly). `scripts/verify-cast-quotes.mjs` now checks `data/events.json` too: 129 of 129 quotes found.
- **Browser game:** a "Matters before you" panel in the season column, each choice a button with its cost, effects, odds and an "if you give no answer" tag; sourced events say which passage they come from. Names link to the character sheets.
- **Tests** `tests/events.test.ts`: 52 events, unique ids, quotes on every sourced one; every role, effect, faction, scar and follow-up exists; no code ids in text; all 149 choices run in a game with no broken state; games with answered events replay exactly; 25 or more different events fire across 100 bot games, none left open at the end.
- **New ending reasons:** "fled" (taking Polyxenus' advice) and "abdicated" (keeping your promise).
- **100 seeds with events** (simple bot, standard package, after merging the balance thread): average 10.8 seasons; killed 27, exiled 32, deposed 41; tyrannies 13 (0.13 a game); plots 4.32 a game, 59 blows landed of 64 strikes; events 14.1 a game, 5.9 of them sourced; 0.23 deaths in events a game. No crashes, no broken states. Not tuned. With the event draw switched off, the standard package reproduces its old digest exactly, so events are the only change; `tests/balance.test.ts` is re-pinned to the new digest with a note.
- **Which events fire.** Over 200 games with the careful bot (average 30 seasons), 47 of the 52 fire. Never seen: Polyxenus' flight and so Theste's answer (he must hold a grudge and dislike you), the mercenaries' demand (that bot always pays the guard), and the two follow-ups that need a choice the bot avoids (the Campanians, the thirty ships). All 149 choices run in the forced test.

## Changed
- Events thread: `src/core/season.ts` calls the event draw at the end of the people step, settles unanswered events when the season ends, replays event answers, and lets the bot answer before acting. `invasion()` now sets a flag `invaded`. `GameState` has an `events` field and inputs can be `choose`. `scripts/sim.ts` prints event counts.
- `data/events/` removed (no events yet; content is in the other data files). `tests/smoke.test.ts` replaced by real tests.
- `tsconfig.json` now checks `scripts/` and `ui/` too and reads JSON. `esbuild` added as a dev dependency for the UI build.

## Broke
- Rule-switches thread: nothing new broke (0 crashes or broken states in 28,000 switch-sweep games). Two text bugs fixed (a man leading his own plot; the Take his place ending). The "exiled men arrested again" bug below did not reproduce in 1,000 games.
- Nothing new broke: no crash or broken state in 20,000 balance games (1,000 seeds x 5 players x 4 packages).
- **The balance finding, corrected:** the old "1 survivor in 100" was mostly the simple bot. Under standard rules a careful bot survives the decade in 52% of games, a patron 34%, an iron hand 7%, a careless one 0%. Standard's problem is shape: blows land about 90% of the time and deaths bunch in years 2 and 3. Full tables in the sweep report.
- Found by the sweep, not fixed (rules questions): Nicoteles and the citizens' assembly end most reigns once plots are slower; long reigns repeat (the same man becomes your enemy 5 or 6 times in a decade); political rivals flicker on and off (9 to 15 a game for careful players); Carthage takes the city in 5 to 8% of patron games; Nemeses almost never appear.
- Seen while reading seed 7 for the research note (not fixed, not checked further): Theodorus is exiled in autumn 403, then "Your guards take Theodorus" and he is exiled again in autumn and winter 402. Exiled people may be getting taken again from outside the walls. The Watch result reads "Theodorus is in a plot against you, led by Theodorus" when he leads it himself.
- Nothing crashes, and no broken state in 100 seeds. **But the headless results are lopsided.** Latest 100-seed run with the simple bot player:
  - Average game: 8.4 seasons of 40. Endings: killed 26, exiled 36, deposed by a political rival 38. No bot game survived the decade.
  - Plots: 3.4 a game; 65 strikes, 62 landed, 3 failed.
  - Tyrannies set up: 1 in 100 (the bot rarely saves for the citadel).
  - Enemies 2.2 a game, political rivals 2.7, Pretenders 0.7, Nemeses 0.1.
  - Factions turning Dominant: 2.3 a game; Marginal: 0.02.
  - The bot is a weak player (it refuses most petitions and is careless with silver), so a human may do much better. This needs Jacob's playtest before any tuning.
- Where the strength comes from, in traced games: office holders weigh 3 each in a plot, two backing factions at power 7 to 10 add 2 to 3 each, and an unpaid guard sells itself (+3 to the plot, and its 3 leaves your defense). Plots reach 10 to 17 against a defense of 6 to 10.

## Defaults I chose where v2 was silent (all invention, all Jacob's to change)
- Faction power is a base plus 1 for each office its members hold (so "+1 per office, counted every season" doesn't snowball). Stripping an office costs that +1; there's no second -1.
- **Power drift:** at the power step, a faction whose power did not change that season moves 1 toward 5. Without it every faction ran to 10 within a few seasons.
- A failed law changes no power (v2 only gives power to the winners of a passed vote) and can't be proposed again that season.
- The treasury holder pays the guard: you, or a holder whose opinion of you is +1 or better. Anyone else withholds it.
- Petitions left unanswered at the end of the season count as refused. Refusing the guard's citizenship demand doesn't lower their mood; their agenda handles it (Kingmakers).
- Plots target only you. Only the plot leader recruits. A plot strikes when its strength plus 4 beats your defense, or after two seasons at Named (three for a Patient leader).
- Carthage at 10: a landing roll (die plus guard, +2 walls, +1 if you command the army) against 9. Win and the clock drops to 5. Lose and the city is besieged; a second loss ends the game.
- Political rivals: your influence uses the faction with the best mood (Uneasy or better) as "the faction that backs you most". Rank 2 needs 2 offices or leverage over you; rank 3 needs influence equal to yours. Expose costs a rival 2 influence and a rank but doesn't make him an enemy.
- Marriage needs a free relative (you or Thearides) and a house with an unmarried daughter, so it is rare (only Hipparinus' house has one at the start).
- The 4 scheming actions are for the computer's people only.

## Questions for the next design session
- **Events (thread 06).** Play a few seasons and judge: too many events, too few, too samey? Knobs in `data/events.json` `pacing` (one draw a season, 35% for a second, three waiting at most, eight seasons before an event repeats). Should answering some events cost an action? Should what Dionysius really did be marked in the game ("this is what happened"), or stay hidden so it doesn't steer you? Most sourced events date from 398 to 396; the careful bot reaches them, the simple bot rarely does. The fever can kill real people early (it did 25 times in 100 games, counting every event death): keep, or spare the cast's main figures?
- **Interface questions (thread 07).** The data has no gender field, so the UI finds women from how relatives describe them ("sister", "wife"); the engine's own sentences still say "him" for everyone. Add a field to `people.json`? Is "real person" the right marker wording? Should the guide also appear in later games? The help text restates rules from `src/core`; if a rule changes, `ui/help.ts` needs the same change.
- **Friction seen in play (thread 07, not fixed, engine or balance):** feasting until silver hits 0 leaves the guard unpaid and the defense at 4, and a plot struck in the fourth season (seed 7). The Pretender ending lists all four ways to lose instead of the one that happened (from `docs/game-research.md`; not seen in my runs). Several plots show the same Whispers lines, because warnings are drawn from a flavour pool rather than from what the plotters did (see `docs/game-research.md`, proposal 1).

- **Pick a balance package** (or keep Standard): play one game each of Standard and Reap what you sow. The sweep report recommends Reap what you sow to test first; Slow fuse if that feels too easy. Fair fight makes most strikes coin flips. Once you pick, the default is one line in `data/tuning.json`.
- **Nicoteles' road to power** dominates the endings in the softer packages: the citizens' agenda gives him the generalship, and two offices make him a Pretender. Change it (rival influence 2 per office against your 1; the generalship going to the assembly rather than its leader; Pretenders needing a second faction), or keep it as the city's main political threat?
- **Repetition in long reigns** (research ★5): should a refused man escalate (ask, demand, act) instead of cycling enemy, pardon, enemy?
- Read `docs/game-research.md` and pick which proposals, if any, to try. The top five: warnings built from what the real plotters did; a chronicle grouped by storyline; plots with a method and a moment so they are less all-or-nothing; a council of your people who argue each decision; people who escalate instead of repeating the same petition.
- Play the prototype for 10 seasons. Does it produce a story you would retell? Where did it feel unfair or dull?
- Are plots too strong? Knobs to consider, each a rules choice for you: office holders weigh 2 instead of 3; faction backing adds power divided by 4; Named plots strike only two seasons after Named; a Watch on a member always reveals the whole plot.
- Is influence "within 3 of yours" too loose? At the start your influence is 4, so anyone with 1 influence qualifies.
- Is the drift toward 5 the right fix for runaway faction power, or should agenda steps stop adding power?
- The open questions in rules v2 still stand (three actions, steady income, conquest, the absent-holder rule, rival caps, dinners).
- **Cast questions.** Who married Dionysius' sister: Diodorus and Plutarch say Polyxenus, Polyaenus a Hermocrates (the data follows the first two and shows the disagreement). Theodorus is attested only in about 396 but is in from the start, so the rich families have a voice for liberty: keep? Damon the smith is invented to speak for the citizens after Nicoteles: rename or cut?
