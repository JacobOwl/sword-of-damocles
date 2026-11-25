HISTORIAN SEAT: council of 2026-11-25

Timing, after the coordinator's note: Jacob plays the frozen test link tomorrow. Nothing below should change what he plays. Bug fixes may merge to main tonight because the frozen link is unaffected. Everything else waits until he has reported.

PART A. Changes after the 1,000 games (ranked)

1. Self-feud on executing your own kin. BUG FIX, cheap. Leave the player out of the kin list. I checked: src/core/actions.ts around line 336 builds the list from p.kin with no player filter, and line 337 also writes "you executed his kin", so it needs the pronoun helper too (src/core/pronouns.ts). Shown in 38 of 234 kept logs. May merge before his game (main only).

2. Small text bugs: "him" for women, "led by X. With him: X", "Meanwhile, After", the wound reason at a margin of 3-4, the rival line two seasons running, the "general home too popular" pattern. BUG FIX, cheap. May merge before (main only). After his game is fine too.

3. Fugitive lends money. BUG FIX, cheap. A fled or held person should not lend. After is fine.

4. Levy and coin at Rebellious (question 2). RULE SWITCH, off by default, medium. My pick: the rich families' purse runs dry, rather than their mood falling further. Each levy taken within a few years yields less, and the purse refills slowly. Mood stops at 0 in src/core/ops.ts line 59, so the bottom currently costs nothing. The idea comes from the sources but sets no rate. Aristotle, Politics 1313b: "the levying of taxes, as at Syracuse (for in the reign of Dionysius the result of taxation used to be that in five years men had contributed the whole of their substance)". A second option for the same switch: at Rebellious, the rich who back no plot keep sending word to Carthage, as they already do at Angry (src/core/ai.ts line 358). After his game.

5. Purges pay (question 3). RULE SWITCH, off by default, medium. Don't remove the payoff. The sources' Dionysius killed his opponents and "maintained his dominance until his death" (Diodorus 13.96.3-4). But in the sources a purge's cost comes later and from outside the city, and the game lacks that part. Two pieces:
(a) Purged and robbed houses leave exiles abroad, who press outside powers. Diodorus 14.40: Rhegium was "urged on by Syracusan exiles resident in Rhegium". Theodorus accuses him of "slaying those who spoke openly on behalf of the laws and exiling the more wealthy" (14.66.5).
(b) Theodorus' speech (the event theodorusSpeaks exists in data/events.json, from spring 398) should draw its strength from the player's own record of executions, seizures and levies, read from the log. His charge list is exactly that: he "has taken the property of private citizens together with the lives of their owners" (14.65.2).
Report how survival changes. Do not aim for a number. After his game.

6. Vary the opening (question 4). TEXT VARIETY plus a small data change, medium. Yes, vary it by seed. Keep the brother of Demarchus' grudge, because it is sourced (13.96.3). Give the first-season events date ranges and weights so that Philistus' warning, the general's offer and Blood in the agora are not all certain in season one (now 81-94%). After his game, and only once he has said whether the opening bored him.

7. Exile lines (question 5). TEXT VARIETY, cheap. Speak when the hunt changes rank, plus one fresh line otherwise. The hunt warning prints up to 16 times a game and the Pharnabazus gift can come three times in one exile. Cite a source passage once per game, not every time the line fires. After.

8. Carthage's routine. RULE SWITCH, off by default, medium. This is the historian's main finding. Carthage's anger is the clock (src/core/carthage.ts line 31). The clock starts at 2 (data/start.json) and gains 1 every year whatever happens (src/core/season.ts line 70). The war thresholds are 6-8 (data/carthage.json). So a war in most games is built in, and the 87-88% figures come from that. In the sources Carthage did not start the war of 398-397. Dionysius did, and Carthage was "totally unprepared" and "waited for the Syracusans to take the initiative" (14.47.2-3). Proposed switch: halve or drop the yearly tick, and let Syracuse's acts (walls, ships, raids, taking tribute towns, which already add to the clock) drive the anger. The landing place could also vary: Himilcon's sealed orders sent the fleet to "put in at Panormus" (14.55.1). I did not check how the game picks Motya. After his game.

9. Carthage almost never loses an army. TOOLING first, cheap. Count why armies end (battle, hunger, plague, recall) before changing anything. In the sources the 396 army was destroyed by plague and a sudden attack at Syracuse, not in an open field battle. There were "one hundred and fifty thousand dead lying in heaps and unburied because of the plague" (14.76.2), and Himilcon bought the escape of the citizen troops for "three hundred talents" (14.75.1-4). A bought escape, with Carthage's army left behind, is a story shape worth a later switch. Parked in later.md.

10. Exile returns about 2 in 5 falls. TOOLING, cheap. NO CHANGE to odds yet. Log what held at each return: the ruler away, the factions' hatred, arms given out. Diodorus' account of Dion makes those three the cause: "the willing support of those who were to be liberated ... the pusillanimity of the tyrant and his subjects' hatred of him" (16.9.3), and "the tyrant was sojourning ... along the Adriatic" (16.10.2). Against that, Hermocrates was killed in the market place (13.75.8), and the Aetna exiles never got back by force (14.9.8, 14.14.2). If returns succeed when none of those three holds, that is a bug. If they hold, it is a design choice for Jacob. After.

11. Deadly secret doesn't stop a takeover. TEXT first, cheap. Say why it failed (the guard switched; a secret binds a man, not the guard). Making a hold block a takeover is a RULE SWITCH and Jacob's call. After.

12. Patron petition spam. NO CHANGE now. It is a bot habit at 92-97% survival. Watch whether Jacob does it too.

The report's five questions: (1) fix the self-feud: yes. (2) coin and levy at Rebellious: yes, as a switch; the purse runs dry. (3) purges: keep the payoff and add a delayed, outside cost, as a switch. (4) vary the opening: yes, by seed, sourced events kept. (5) exile lines: speak only on a change, plus one fresh line.

PART B. Bigger direction

1. Stay the course on the core. The sourced pieces (Demarchus' brother, Aetna, Theodorus, Motya, the market-place death) give the batch's best stories. No change of direction is needed. Jacob's say: no.

2. Make outside powers react to the player, not to the calendar. This one covers Carthage, Rhegium, Sparta and the exiles. In the sources, Carthage, Rhegium and the exiles move because of what Syracuse does (14.40, 14.47). A Carthage driven by a timer is the main reason games feel samey, and it is also the least historical part of the game. Medium cost. Jacob's say: yes (rule switches).

3. Let consequences come late. Grievances building over years and coming out at a crisis (Theodorus' speech while the citizens are armed, 14.65-70) is how this period's sources tell the cost of tyranny. Purges, levies and the opening's sameness could all draw on one store: the log's record of what you did. Medium cost. Jacob's say: yes.

4. Stop judging from all-switch bot runs. With 17 switches the bots' priority lists crowd out tyranny (4 of 288 against 52 of 144). Before trusting any count, run each switch alone against the preset. Cheap tooling. Jacob's say: no.

5. The biggest risk: the project runs ahead of its only real judge. Thirty-one threads, a whole-game design and six campaigns exist, and Jacob has not played ten seasons. If his game says "not a story I'd retell", much of the recent work was aimed wrong. Nothing more should be built until his verdict, apart from bug fixes.

PART C. You didn't ask, but

1. Record his game properly. Save "Copy my game", replay it (npm run replay-save), and write a dated playtest note in his words. There is no such record yet.
2. Two-line answers for the owed B1-B8 assessment (docs/council/2026-11-23-two-day-plan.md): which bets proved out, which stay off. Read it against his play, not the bots'.
3. Stale branches: there are 20+ origin/claude/project-thread-* branches, including jmqrof. List them with a "safe to delete?" line each for Jacob. Deleting cannot be undone outside the repo, so ask first, and never merge them.
4. A sources-coverage check. Every history-tagged event should cite a passage that still greps in the saved texts. The game repo has no quote-verify script like the site's verify-quotes.js. That costs little and guards against confident errors.
5. Unblock or close the blocked threads (balance, great works, the Phase 3 paper) with one line each: "waits on Jacob's playtest".

PART D. Fix the self-feud bug on main tonight. Then build nothing until Jacob has played his ten seasons and said in his own words whether he would retell them.

Checked in code: src/core/actions.ts (execute kin list, about lines 336-338), src/core/ops.ts (mood floor, line 59), src/core/ai.ts (rich send word to Carthage, line 358), src/core/carthage.ts (anger is the clock, lines 31-50), src/core/season.ts (yearly clock tick, line 70), data/start.json (clock 2), data/carthage.json (thresholds 6-8), data/events.json (theodorusSpeaks). Quotes were opened in /home/user/phoenician-punic-world/sources/: diodorus/english/book13.loeb.txt (13.96), book14-1-18-97-117.loeb.txt (14.8-9), book14.loeb.txt (14.44, 14.47, 14.54-55, 14.65-70, 14.75-76), sicily-tyrants/aristotle-politics-5.rackham.txt (1313b). The quotes for 13.75, 14.9.8, 14.14.2, 14.40 and 16.9-10 come from docs/research/exile.md and docs/research/diodorus-401-399.md. I did not reopen those passages in the source files.
