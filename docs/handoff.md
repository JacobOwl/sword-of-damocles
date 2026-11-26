# Handoff

The thread that finishes a session writes this, not Jacob. Rewrite it at the end of every session.

## Redesign proposal: offices, rivals, events (thread 36, 2026-11-26)
- Design only, nothing built: `docs/council/2026-11-26-offices-rivals-events.md`. Offices as a contested board, one ladder of standing for the rising few, and matters made from what just happened, with petitions to use your powers. Building the citadel stays the 405 game's opening goal (Jacob), and each scenario gets one.
- **Settled (council, delegated by Jacob):** seats in three tiers (assembly leader easy; generalship, fleet, treasury, mint middle; captain of the guard and citadel hard), the way each changes set by the government, and a four-word "dug in" track with upkeep. New seat: captain of the guard; city commands as small seats. History card: `docs/research/offices-history.md`.
- **Picked by Jacob:** captain of the guard and city leaders as seats; 2B (ladder of standing) and 3B (matters from moves). Next: build step 1 (office powers for holders and the crisis scene on a loss) once he says go.

## Lessons from the first tests (thread 35, 2026-11-26)
- One overview of everything learned from his game and the AI testers: `docs/playtests/2026-11-26-lessons.md`. Read it before starting the redesign or the display fixes.
- **Questions for Jacob:** how to start the redesign (the thread 19 card); which display fixes; turn on "The purse runs dry" and a once-a-season repeat limit; make losing an office a crisis scene; keep the 405 start or start nearer 398.

## Jacob's first island test: the debrief (thread 19, 2026-11-26)
- The gate is **not passed** ("tbh not much. No one or nothing stood out."). Full report: `docs/playtests/2026-11-26-jacob/debrief-report.md`; his words: `notes.md` there.
- **Questions for Jacob (the decisions sitting):** (1) his direction: a smaller cast that grows in importance and gets its own events (Nicoteles challenging him in court and assembly), and the offices as a contested board (bribe or ally holders, downsides when rivals hold one, NPCs seeking offices and asking favours of yours), which he wants to talk through; (2) the cheap display batch from his eleven questions (action results in place, tooltips, hover breakdowns, map key, city sheet, influence explained, less text): go or not; (3) rules as switches: the levy loophole, repeat limits per person, contesting the citadel, a later start nearer the war; (4) the cavalry-agenda bug; (5) which "other things" he never opened besides the Families tab.
- The test link stays as it is until he picks.

## AI testers' first impressions (thread 34, 2026-11-26)
- Jacob's first reaction to the test: overwhelming. Findings and 17 ranked layout suggestions (no rule changes): `docs/playtests/2026-11-26-ai-first-impressions/findings.md`. **Question for Jacob:** which of the starred five to build, on main after his test, never on the test link.

## The test link is frozen (thread 19, 2026-11-24)
- The first island test build is live at the test link (https://claude.ai/artifact/8KqQzj6x3QrXRjQKzVZNK4, version 19, built from main after PR #61). **Publish nothing to that link until Jacob reports on his game.** Bets go to the Workshop page.
- What to watch for while he plays, and how to read his "Copy my game" text: `docs/playtests/first-island-test.md` and `npm run replay-save -- <file>`.
- At the freeze, "Dinners as the stage" and "Grain and the sea" became Workshop switches like the other bets, so the test link's own setup list shows only the test's rules. Their Workshop pages still offer them ticked.
- What each thread built is in `docs/handoff-archive.md` (moved, word for word). This file keeps only what is open.

## Customs from the sources (thread 33, 2026-11-25)
Record: `docs/research/customs.md`. Research only; nothing built. Petalism is left to thread 32.
- **Questions for Jacob:** which of the 25 to build, if any? Top five: the tyrant's purse tricks (one-off money schemes the city remembers), the listeners ("Sharp-ears": hear plots sooner, hear fewer complaints), the great oath (make a suspect swear by the goddess), laying down the sword (Gelon unarmed before the assembly), and the oracle of "his betters". Each would be a switch, off by default.
- The Ear of Dionysius is a name from 1608 (Caravaggio), not ancient; the card says so.

## Council on Solium Infernum (thread 32, 2026-11-25)
Record: `docs/council/2026-11-25-solium-infernum.md`. Advice only; nothing built. All of it waits for Jacob's game and the switch sort.
- **Questions for Jacob:** quarrels with terms (public demand or slight, then a quarrel with an aim and a deadline)? force against a citizen costs more without a charge? factions quarrel with each other, each with a named chief enemy? Each recommended as a switch, off by default.

## Built after the council (thread 31, 2026-11-25, Jacob: "Do all the changes")
- PRs #67 (bug fixes), #69 (quieter exile warnings, varied wording through `src/core/vary.ts` and `data/wordings.json`, no dice) and #70 (switches `purseDry` and `variedOpening`, Workshop, off by default, plus a line when a Rebellious faction can sour no further). Digests re-pinned for wording or that line only, each time checked by a 60-game log diff.
- **Your save from tomorrow replays on commit 26744da** (same code as the frozen build), not on main. See `docs/playtests/first-island-test-debrief-plan.md`.
- `npm run sim` now prints two warn-only lines: the most repeated line, and "costs that changed nothing" (a Rebellious faction asked to sour further). On the default run the second already warns (11 a game). That's the loophole family the council named, and it's reported, not tuned. `npm run verify-quotes` checks every data file's quotes against the saved texts (415, 0 missing).
- Old branches: `docs/branch-list.md`. All 32 are merged work, and none would delete anything. Nothing was deleted.
- Not done: the leading sentences of varied lines are still in code; the Workshop artifact was not republished with the two new switches.

## Council after the 1,000 games (thread 31, 2026-11-25)
Record: `docs/council/2026-11-25-after-the-thousand.md`. Advice only; nothing built. Jacob plays the frozen test link on Thu 2026-11-26.
- **Before he plays:** change nothing on the test link; tell him the two wording bugs he may meet (the wound reason line at a margin of 3-4, "Meanwhile, After"); don't show him the preset's danger numbers until his debrief.
- **Next builds, in order:** tag the frozen commit, then the bug bundle (self-feud, "him" for women, wound reason, leader named twice, stray capital, repeating rival line, fugitive lending, the general-home pattern); then exile lines only on a change; then the text-variety pass. Anything his game raises comes before the text pass.
- **Counts before rules:** why Carthage goes to war (the yearly tick), why its armies end, what held at each return from exile. Purges were recounted (`scripts/purge-recut.ts`): mostly an artefact of reign length, so no switch for now.
- **Switches recommended, off by default, Jacob's call:** "The purse runs dry" (coin and levy at Rebellious), a varied opening by seed (after his first game), and "Carthage answers what you do" (if the count says the tick drives most wars). "Favours wear thin" is ready if his play shows petition spam.
- **After his game:** sort every switch and the eight bets once (part of the game, Workshop or later); list the stale branches for him to delete or keep; mark the blocked threads as waiting on his game.

## From the AAR batch (thread 29, 2026-11-25)
1,008 headless games with every switch on, ten written up as after action reports: `docs/playtests/2026-11-25-aar/report.md`. No rules changed.
- **Bugs found, not fixed:** executing your own kin with the feud switch makes *you* the heir to the feud ("Dionysius swears that Leptines's death will not be forgotten"; the kin list in `src/core/actions.ts` execute includes the player); "The feud passes to him" for women; a wound's reason line says "it takes 3 or more" when a 3 or 4 only wounded because you held no office or the leader struck from outside; "led by X. With him: X"; "Meanwhile, After…" in the story chronicle; "the general home too popular" shape still never matches.
- **Questions for Jacob:** fix the self-feud bug? Should striking coin and the levy still cost something once the rich families are Rebellious (now free silver)? Purges pay for the iron hand (8+ executions: 43% survive; under 4: 2%). Is that wanted? Vary the first season (the same three openers in 81 to 94% of games)? Should exile lines speak only when the hunt changes, not every season?
- **Read before trusting all-switch tyranny counts:** with every switch on, the careful ruler and the patron almost never become tyrant (4 of 288 games, against 52 of 144 on the preset). No single switch causes it; it looks like the bots' priority lists being crowded.

## Questions for Jacob, ranked (assumptions council, thread 18, 2026-11-23)
Only these two need Jacob. Every other question below defaults to what the game does now (`docs/council/2026-11-23-assumptions-council.md`).
1. **When will you play the first island test?** Recommended: one sitting before Wednesday morning, the "First island test" preset, judged at season 10.
2. **Should you be able to lead the army yourself, or send a named man?** Recommended: yes, as a switch you can try, off by default.

## Broke or odd, found by the exile thread
- **Fixed (follow-up, same day): the hunt never struck.** Lying low knocked Named back to Rumors, and the next season it climbed back to Named with a fresh season's grace, so one action a season kept you safe forever (and the bot lay low whenever it had nothing better to do). Now, with the exile switch only: lying low sets one hunt back **three times at most** (then "they have learned your habits"), and once you are Named, seeking another refuge drops them a step instead of losing them. The dangers column counts the hides you have left. The bot now reacts only when a strike could kill, and stops lying low out of habit. 100 games: 118 hunts begun, 45 struck, 18 wounded you, 15 killed you, and in the rest your guard held. With two hides it was 27 deaths, and with four it was 9. Three is the call.
- **Fixed (follow-up): the broken-state check** flagged a game that ended in exile while Carthage held Syracuse. It now allows a game that ended in exile.
- **The city's own revolt against the ruler** fires almost never (0 in 100 games).
- **The default "simple" bot can't replay from its inputs** because it draws from the game's own dice. This is old and known (see `tests/commission.test.ts`). The exile test replays careful-bot games instead, and 30 of 30 replay exactly.

## Questions from the exile thread
- **Done (follow-up, Jacob delegated it): he or she.** `data/people.json` now marks the cast's four women with `"sex": "f"` (Theste, Doris, Aristomache, the daughter of Hermocrates). A missing field means a man, and census people already had a sex. `src/core/pronouns.ts` reads these; game saves are unchanged. Event texts can now write `{his:rich}`, `{he:ruler}` and so on, and get "her" or "she" when the person is a woman. The fire grudge now says "her house" for Aristomache, which fixes the line above. Standard and preset digests were re-pinned for that wording only (a log diff of 30 games shows no other change). Other texts that say "his" for a role a woman could fill have not been audited yet. The exile texts still avoid pronouns, which reads fine.

## Broke or odd, found by the Carthage's-chronicle thread
- Fixed by thread 28: `Aristomache holds a grudge: you blamed his house for the fire.` now says "her house" (pronoun field; the frozen test link keeps the old wording).
- In seed 26 (careful, island) the Achradina temple event fires in Autumn 397, a season after Magon's army lifted the siege (its army was still at Syracuse). Probably fine; noted in case it reads oddly in play.

## Questions from the grain-and-sea thread
- Is a season at sea for bought grain too slow? It makes the careful bot buy almost every season, and skims pile up (4.7 a game). Report only.
- Should the audit cost the rich families' goodwill even when it catches a cheat? Now it does, both ways.
- Parked in `later.md`: a source on Syracuse's grain trade under the tyrants (the contractors are invention); depots and wagons stay in Phase 3.

## Questions from the great-works thread
- Taste, Jacob's: should overseeing a work yourself cost an action every season (as now), or only once? Should the peasants resent the wall (as now) even though Diodorus says "all were zealous" (14.18.6)? Is two works at once right?
- Should the citadel on the Island (14.7.2-3) also become a great work, instead of the two-action Build? Left as it is.

## Questions from the army thread
- The bots almost always lead in person and rarely send a man; more of your falls now happen while you are away. Is absence too cheap, too dear, or about right? (Report only: not tuned.)
- Unlawful commands are common for the bots, because the assembly often takes the generalship from you. Should passing over the general cost more, or less?
- Not built, parked in `docs/later.md`: a purpose for each command (take, garrison, negotiate), a disloyal commander turning his army on you, and petitions going unanswered while you are away.

## Next for the build (from the same council)
Build the "First island test" preset (listed first on the start screen), the season-10 verdict prompt, and a short "what to watch" note; measure map events in seasons 1 to 10 over 100 seeds. Fixes and the test pass before new features.

## Questions from the whole-game thread (30, 2026-11-25; none urgent)
The eight questions at the end of `docs/full-game.md`: whole reigns or one decade per campaign; three marks or held-or-fell; are these the right six tyrants; Gelon from 491 or 485; Rome playable at the end or only a name; a Libyan map for Agathocles; which world settings for the open game; what the campaigns are for (teaching the systems, or stories for later). Nothing was built and scope is unchanged.

## Questions from the Long Game thread (Jacob's, none urgent)
The seven open questions at the end of `docs/phase3-draft.md`: two speeds or fixed eras; play anyone in your circle or only the heir; invented men in the station of real people born after the start; stop at 264 or run on; whether a person in a Punic city of Sicily is ever playable; which start to build after 405; auction or plain prices for hired companies.

## Questions from the story-museum thread
- **What the museum found (read it as signs, not targets):** see the report's tables. The patron's first ten seasons often hold no story shape at all, and the dullest ten reigns are all quiet survivals by the patron or careful ruler: years with no turn, and the same man becoming a political rival three times or more (the "flicker" already noted). Worth reading two of them before judging the gate.
- **No game ended by a blow without warnings** in the four seasons before (the rule holds in 1,200 games).
- **Never seen:** "the general home too popular" needs the army switch (thread 20); its words are guessed in the shapes file and must be matched to that switch's log line once it lands. "The city that turned twice" and "Syracuse besieged and holding" are rare (a few in a hundred).
- **The Dionysius bot** survives the decade in about six games in ten, fortifies and disarms every time, but marries in under half (the cast offers few matches) and so rarely reaches his war on Carthage. Is that a fair reading of the rules, or should the marriage of 14.44 be an event?
- **Weights and shapes are guesses.** Change them freely in `data/story-shapes.json`; tell the next thread which shapes you would retell.

## Questions from the change-the-past thread
- After a change, the dice come in a new order, so part of every difference is luck (shown on the page). Do you want "fixed fortune" dice as a switch to try later? Parked in `later.md`; the game does what it does now until you say.

## Questions from the court-intrigue thread
- Women at the council with their own lines, if you want them later.

## Questions from the island events thread
- **Sieges are rare for the bots** (under one a game), so you will mostly meet the siege events (the mole, the towers, the gate at midnight) in your own play. Is that rare enough, or too rare?
- **Himilcon's bargain** sends Carthage's army home without counting it as a lost army, so Himilcon's end (disgrace, starving himself) still never fires from it. Should taking the bargain disgrace him?
- **Duplicates:** the court's "The mercenaries' demand" tells the same story as the island's "Pay in land", and both can fire in an island game. Keep both, or hide the court one in island games? The court events "Leptines attacks", "Himilcon's offer" and "War on Carthage" overlap the island's own war in the same way.
- **Italy and the Sicels** stay as names (scope): their events move your towns, armies and Carthage, never an Italian or Sicel map piece. Heloris' two events need him in exile first, so they are rare.
- **Rumors from Carthage are always true.** Should some be false (for example, unless you have sent an embassy lately)?
- **Pre-existing, found while testing:** when Carthage storms Syracuse in the factions step, that season's court events stay open at the end of the game. It is harmless, but the court test only checks the simple bot in the citadel.

## Questions from the web-app thread
- **Which Godot route?** Translating the engine to GDScript or C#, or running the TypeScript engine inside Godot. Not needed now; the architecture doc lists both, unverified.

## Questions from the source-search thread
- **Damocles is settled: Dionysius I** (Cicero's Latin, 5.57 to 5.63, now saved). Cicero gives no year, so when it happens in a game is a design choice. The same passage has five more court stories (the daughters as barbers, the trench round the bed, the ball-game killing, the tower, the two Pythagoreans); use any as events?
- **Rhegium's war of 399 (Diodorus 14.40)** fell apart because Messana's generals marched without a vote. Worth an event for the island?

## Questions from the cast-generator thread
- **Women's names.** Nine Punic women's names were added (from thread 15's card), written plainly for players (Amashtart, Ahatmilkat, Batshalom). The game leaves a quarter of Greek women and about a third of Carthaginian women unnamed ("the daughter of Tellias", "the wife of Bostar"), as the sources do. Keep these shares?
- **Annobal and Bodashtart**, a Punic name from Roman Leptis Magna and a Phoenician king of Sidon, pad the thin Carthaginian list. Keep or cut?
- **Births and deaths:** about 55 births and 47 deaths in a decade among 165 people. Too busy for the log, or the right texture? (The island slice can show only deaths and heirs of people who matter.)
- **The families page:** useful as its own view, or should these people only appear where they matter (a city's first man on the island map, the captain on an army, the elders on Carthage's council)? Thread 10 has the lookups for that.
- **Scope check:** the generated people fill the island's cities, Carthage's council and the captains. Nobody plays an heir, so "generations" stays out. Say if you'd rather this waited.

## Questions from the rule-switches thread
- One feud record: political rivals now stay until something decisive happens, and they hold the cap of two. Is that a slow squeeze you like, or should the cap rise when the switch is on?
- Which switches should be on for your next playtest? The report suggests People escalate and Warnings are clues; then A Pretender needs a coalition; Blows can miss with Standard balance.
- Blows can miss: is a wound (one lost action) enough of a cost? Should the wounded ruler also lose defense for a season?
- Coalition: is "Angry or worse" the right bar for a second faction, or should Uneasy count? (With Uneasy, the rich families qualify from the first season and the switch did almost nothing.)
- The feud record from the design council (V6): build it as a sixth switch?

## Questions from the art thread
- Does the look land? Title page, season cards, event pictures: keep, tone down or change?
- Season cards appear at every season change. Too much? (A switch to turn them off is cheap.)
- The sword overhead: readable as a danger gauge, or too subtle?
- Faction emblems: horse for the rich families (their cavalry), grain for the citizens, helmet for the guard, hearth for the family, palm for Carthage. Any you'd change?

## Questions from the design council (Jacob's to decide)
- ~~Size of the first island test~~: decided by Jacob, 2026-11-22: keep the current plan (8 cities and Aetna, routes, foraging).
- **The hinge:** a commission (one of your three actions sends a named man, or you, with men and a purpose; the general commands by default, anyone else costs standing). The plan says only the general gives orders. (V2)
- **Replace "drift toward 5"** with power that people carry, as a switch first? (V4)
- **A named "First island test" preset** (island, Reap what you sow, clue warnings and partial success on), and a pause after year 4? (V1, V5)
- **One dice stream per system** from the seed: decide before the engine refactor or not at all; it changes CLAUDE.md's "one seeded RNG". (V11)
- **Ideas ranked by the council:** "mark this moment" button and a story sweep (tied first), an ambition chosen at the start, dice streams, playing on as an exile, disputed numbers. Parked in `later.md`.
- **Carthage's blocs:** keep the Elders and the Hundred as tagged invention from later sources, or use the council's general, council mood and two rival houses? (V7)

## Broke or odd after slice 2 (found, not tuned)
- **The fear rule never fires in the sweeps.** Only the iron hand sacks, and it rarely lives past season 9. It works in its unit test. Your playtest is the real test.
- **Battles fell from about 1 a game to 0.33** now the bot avoids bad fights; when Carthage attacks it still wins most (it is usually larger). Most of the careful bot's gains now come from towns going over (0.72 a game), not fighting.
- **Carthage still never loses an army with the switch off.**

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

## Questions from the portrait thread
- Are the faction colours on the coins right (ruler and family blood red, rich blue, citizens olive, guard teal)? Should the ruler stand apart from his family?
- At the small 26 px size the faces are only shapes. Fine as is, or should small slots use a flat, drawn version?
- Do any looks jar with what you picture (for example Aristotle the Spartan in a pilos with long hair, Damon the smith in a felt cap)?

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

## Open items lifted from the built notes (moved to `docs/handoff-archive.md`)
- From the ten-season read (thread 19, streams 2 and 3): the same opening every seed, and arrests ending stories, are design questions for Jacob, not bugs; nothing was tuned.
- From the art thread, second round: do the figures read well at their size, and which other events should get people? Is the sound worth keeping, too loud or too quiet? Should the drone start at Rumors or only at Named?
- From the three-lens review (thread 19, stream 7): which unstarred items in `docs/playtests/2026-11-23-review.md` to do. Jacob picks after playing.

