PLAYER SEAT: council of 2026-11-25

My lens is how a first-time player would feel in the first hour and the first ten seasons. Three facts shape everything below.

First, Jacob plays tomorrow (Thu 2026-11-26) on the frozen link. Nothing can reach that link before then. `docs/handoff.md` says "Publish nothing to that link until Jacob reports on his game." So "ready before his game" can only mean prep that leaves the link alone.

Second, his preset is not the all-switch batch. `data/presets.json` and `docs/playtests/first-island-test.md` list what it turns on: island, Reap what you sow, clues, blows can miss, story chronicle, armies break. Feud, exile, secrets, council, dinners and great works are all off. Most of the headline bugs and repetition can't appear in his game.

Third, and this worries me most: the bot closest to his preset (the careful ruler, baseline) survived the decade 92% of the time and was killed 1% of the time (`summary.md`, baseline table). 33% of baseline games had no story shape in seasons 1 to 10. If Jacob plays carefully, as a newcomer does, a quiet decade is quite likely. A quiet decade would not prove the game is dull, but it could read that way.

## Part A. Changes after the 1,000 games (ranked)

1. **Add a "known oddities" note before he plays.** Put two or three lines in `docs/playtests/first-island-test.md` naming the faults that can appear under his preset: the wound reason line at margin 3 to 4 (blows can miss is on), and "Meanwhile, After" (story chronicle is on). Then he won't spend a note on them, and he won't lose trust in what the screen says. TOOLING, cheap. **BEFORE.** It touches only the doc, never the link.

2. **Fix the wound reason line.** It's a bug: 40 of 68 wounds in the kept logs won by 3 or 4. A screen that explains a blow wrongly does the most damage to trust, and "a death must never feel random" depends on the reasons being true. BUG FIX, cheap. **AFTER** (main and Workshop; the frozen link stays as it is).

3. **Fix the self-feud and "him" for women.** I checked `src/core/actions.ts` lines 336 to 345. The kin list is never filtered for `player`, so `nearest` can be you, and the line hard-codes "passes to him". Swearing revenge on yourself breaks the fiction. BUG FIX, cheap. **AFTER.** The feud switch is off in his preset. *Q1: yes, fix it.*

4. **Fix the small text faults:** the plot leader named twice, "Meanwhile, After", the rival line repeating with nothing between, and a fugitive lending silver. Each one tells a reader "this is a machine". BUG FIX / TEXT, cheap. **AFTER.**

5. **Make the exile lines speak only on change, with a short reminder at most every third season.** The same warning printed up to 16 times trains the player to skim, and then the real warning gets skimmed too, which works against the warned-death rule. TEXT VARIETY, cheap. **AFTER.** Exile is Workshop-only. *Q5: only on change.*

6. **Vary the opening by seed.** For one game the openers are good: Philistus's warning, the general's offer and Blood in the agora give a newcomer three clear hooks. By game three they feel like Reigns. Use a pool of three or four 405 openers, drawn by seed, each sourced or tagged invention. TEXT VARIETY plus content, medium. **AFTER.** His first game benefits from the strong fixed opening. *Q4: yes, after his game.*

7. **Rate-limit the stock "Whispers" lines and the rival rumor line.** 46 "nothing new, only a feeling" lines in one game, and Nicoteles's identical rumor 11 seasons running. Say it once, then vary it or stay quiet. TEXT VARIETY, cheap. **AFTER.**

8. **Free silver from the Rebellious rich.** Confirmed in `src/core/ops.ts` line 59: mood clamps at 0, so coin (+2) and the levy (+3) cost nothing at the bottom. A player feels this exploit as soon as they find it: the money worry vanishes and the rich stop mattering. Offer a switch where coin and the levy at Rebellious each add a step toward the rich backing a plot, or raise a rival from among them. A visible danger fits better than a hidden tax. RULE SWITCH, off, cheap to medium. **AFTER.** *Q2: add the switch; Jacob tries it.*

9. **Purges pay.** As a player I don't want this "fixed" by punishing the iron hand. The fantasy of the empty court is fun, and the sources' Dionysius died in bed. The real fault is that the stage empties: fifteen dead and nobody left to story with. Offer a switch where the dead are replaced: a son comes of age, an invented man takes the dead man's station and inherits his grievance. That gives the purge a cost made of story, not a number. RULE SWITCH, off, medium. **AFTER.** *Q3: keep it as is by default; offer the "the cast refills" switch.*

10. **Make a deadly secret's failure readable.** In game 8 the hold was used four times and the takeover still happened. At minimum, write one line saying why the hold didn't stop him ("the guard, not Nicoteles, made the choice"). A switch where a hold blocks the holder's own takeover could follow. BUG FIX for the line, cheap; RULE SWITCH for the block, cheap. **AFTER.**

11. **Petition spam.** The patron petitions 32 times a game and survives 92 to 97% of the time. That is the safest play and the dullest. A switch for diminishing returns (each petition after the second in a row is worth less, and the faction says so) would help. RULE SWITCH, off, cheap. **AFTER**, and only if Jacob's own play leans on it.

12. **Coming home 2 in 5: no change.** For a player, a comeback is the delight in game 1 and game 3 of the batch. Leave it until a human has played exile. NO CHANGE.

The "general home too popular" shape, and the gap where Carthage almost never loses an army, are tooling and balance notes. They wait until after his game, and I wouldn't rank them above these.

## Part B. Bigger suggestions and direction changes

**The biggest risk:** the project is growing in breadth with no human hands on it. There are 17 switches, a whole-game design with six campaigns, a 1,008-game report and three councils, and nobody has played it. Every number we have comes from bots that don't read, bargain or plan. The Phase 2 gate is one human's verdict. Everything is downstream of tomorrow.

1. **Freeze new features until his debrief is read.** No new switches or systems until his game has been replayed and his five answers read. Problem solved: we keep tuning for bots. Cost: none. Needs Jacob's say: no; it's already the rule in CLAUDE.md ("Fixes and the test pass before new features").

2. **After the gate, prune the Workshop.** Seventeen switches means a newcomer faces a menu, not a game. After his game, Jacob picks three to five switches to become the island game's default and retires or parks the rest. The batch's own finding supports this: all switches on crowds tyranny out of the careful ruler (4 of 288 games). Cost: cheap decision, medium cleanup. Needs Jacob's say: yes.

3. **Invest in the first hour before Phase 3.** Earlier councils flagged it: "Season 1 already opens with two plots and two enemies before your first move" (design council, 2026-11-22). The batch shows 27 to 33% of decades with no story shape. Before generations and campaigns, the island needs pacing in seasons 1 to 10: one threat at a time, a guide written for the island (`ui/views/help.ts` exists; I didn't check whether it covers the island), and a sure turn by season 6 or so. Cost: medium. Needs Jacob's say: yes, after he reports.

4. **Make the retelling the product.** The best moments in these reports (Doricus taking the blade, Aristomache's return, the market-place death) are already in the log. What's missing is the page a player shows a friend: a short end-of-reign history and a "people of your reign" gallery of who turned and why. That artifact is what passes the "would you retell it" test. Cost: medium. Needs Jacob's say: yes. It edges toward Phase 4, so park it unless he moves it.

5. **Keep the tyrant campaigns for later.** Of the eight questions in `docs/full-game.md`, question 8 (teaching, or stories for later) depends on how hard his first hour is. Don't answer it until he has played. Stay the course on the engine: deterministic, data-driven and readable is right.

## Part C. You didn't ask, but

1. **A debrief plan ready before tomorrow.** When his "Copy my game" text arrives, one thread replays it (`npm run replay-save`), lists every confused or unfair moment with the log line beside it, and runs the three-lens review on his actual game, not a bot's. Write the plan down tonight so it starts within hours. Prep, cheap, BEFORE.
2. **Build the "Mark this moment" button after this game.** It was ranked joint first by the design council and is parked in `docs/later.md` (line 31), never built. Starting with his second game it turns "I think something felt off around season 6" into an exact replay point. Cheap.
3. **One decision sheet: the B1 to B8 assessment plus "which switches become default".** The bets assessment is still owed. Fold it into the pruning decision in B2 so Jacob decides once.
4. **Clean up the stale branches.** There are 32 remote branches (I counted). Some, per the brief, would delete about 9k lines if merged. List them with a one-line state each and ask Jacob to delete them. Never merge. Cheap.
5. **Close or unblock the threads still marked blocked** (balance, great works, the Phase 3 paper). Most are waiting on his game. Say so on each, so the overview shows one thing blocking, not many.

## Part D
Leave the frozen link alone. Have the debrief and replay ready, and make Jacob's game tomorrow the only thing that steers the next build.

Checked in code: `src/core/actions.ts` 336-345 (kin list unfiltered, "him" hard-coded), `src/core/ops.ts` 59 (mood floor at 0), `data/actions.json` (strike coin +2, rich -1), `data/presets.json` and `docs/playtests/first-island-test.md` (preset contents), `docs/later.md` 31 ("Mark this moment" parked). No historical claims made beyond the report's own (Dionysius dying in bed is unverified here).
