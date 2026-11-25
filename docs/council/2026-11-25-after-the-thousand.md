# Council after the 1,000 games, 2026-11-25 (thread 31)

Jacob asked: "So what changes would you implement after the 1000. Have council decide." Then: "Also have council reevaluate the game for any bigger suggestions or direction changes and such", and "Also anything else I'm forgetting to ask you should probably work on". He has not yet played the first island test, and plans to play it on Thursday 2026-11-26.

Five seats (the Player, the Systems Designer, the Historian, the Narrative Designer, the Devil's Advocate) read the AAR report (`docs/playtests/2026-11-25-aar/report.md`, PR #64), checked its claims in the code, and wrote statements. They then voted on the nine points where they split. The brief is in `2026-11-25/brief.md`, the statements are `2026-11-25/r1-*.md`, the split sheet is `2026-11-25/round2.md`, and the votes are `2026-11-25/r2-*.md`. The chair ran the one recount the council asked for (the purge recut, below) and checked every source quote used here against the saved texts.

This is advice. Rule changes are Jacob's: each one is recommended as a switch, off by default. Bug fixes and text variety are recommended outright. **Nothing was built.**

## The verdict in five lines

1. **Change nothing on the test link before tomorrow** (5 of 5). Jacob's game is the only human evidence the project will have, and he plays the preset, not the all-switch batch.
2. **Fix the bugs on main now, after tagging the frozen build** so his save still replays on the code he played (4 to 1; the Devil's Advocate would wait a day).
3. **Next, a text-variety pass**: the hunt and exile lines speak only when something changes, and every line that repeats gets two to four wordings (5 of 5, behind anything his game raises).
4. **Most of the loopholes need a count or a reason line, not a new rule.** The council's recount showed that "purges pay" is mostly an artefact of reign length.
5. **After his game: freeze new switches, then sort them all once** into the default game, the Workshop, or later. The biggest risk to the project is building ahead of its only judge.

## Before he plays (tomorrow)

- **A two-line "known oddities" note, sent to Jacob in chat** (Player, Narrative and Devil's Advocate). Two faults can show up under his preset. "Blows can miss" is on, and a wound that won by 3 or 4 can carry a wrong explanation ("it takes 3 or more to do worse than wound you"), which happens in 40 of 68 wounds in the kept logs. The story chronicle is on, and it can print "Meanwhile, After" with a stray capital. Both are wording bugs, not design.
- **Don't tell him the preset's danger numbers before he plays** (5 of 5). On the preset the careful bot survives the decade 92% of the time and is killed 1% of the time. That goes in his debrief, beside his verdict, so it can't prime him.
- **Tag the frozen commit** (Systems; accepted as the condition of the 4-1 vote on bug fixes). Every fix moves main. The tag keeps his "Copy my game" save replaying on the exact code he played.

## Part A. Changes after the 1,000 games, ranked

| # | Change | Kind | Cost | When | Vote |
|---|---|---|---|---|---|
| 1 | Tag the frozen test build (see above). | Tooling | cheap | tonight | 4-1 |
| 2 | **Bug bundle.** (a) Leave yourself out of a dead man's kin when you execute. (b) "him" becomes "her" for women. (c) The wound reason line says why a 3 or 4 only wounded: no office to take, or the leader struck from outside. (d) The plot leader isn't named twice. (e) "Meanwhile, After" loses its capital. (f) The political-rival line doesn't repeat with nothing in between. (g) A fled or held man can't lend you silver. (h) Fix the search pattern for "the general home too popular". | Bug fix | cheap | tonight, after the tag | 4-1 on timing, 5-0 on doing it |
| 3 | **Exile and hunt lines speak only on a change** (new rank, new host, new danger). Otherwise one short line, drawn from several. A source passage is cited once per game, not every time its line fires (the Persian gift line can come three times). | Text variety | cheap | after his game | 5-0 |
| 4 | **Text-variety pass.** Two to four wordings for every line that repeats, picked by a hash of the seed and season, so no dice change and every replay stays exact. Move the player-visible lines that are still written in code into `data/`. Lines that know how often they've fired ("Nicoteles is at it again"). Rate-limit the stock "Whispers" lines (up to 46 a game). | Text variety + tooling | cheap to medium | after the bugs, behind anything his game raises | 5-0 |
| 5 | **Say why a deadly secret didn't stop a takeover** ("the guard, not Nicoteles, made the choice"). Whether a hold should *block* a takeover is a later switch. | Text (switch later) | cheap | after | 3 seats, none against |
| 6 | **Vary the opening by seed.** Draw the first season from a set of sourced 405 situations instead of the same three in 81 to 94% of games. Keep the brother of Demarchus' grudge, because it is sourced. | Data + switch, off | medium | after his first game | 4-1 (the Devil's Advocate: only if he says it bored him) |
| 7 | **Coin and the levy once the rich are Rebellious.** At least, a reason line that shows the cost that already exists: the Rebellious rich back plots. Then a switch, **"The purse runs dry"**: each coin strike and levy yields less while they stay Rebellious, and the purse refills slowly. | Text now, switch off | cheap / medium | after | 5-0 for the line; 3-2 for the switch |
| 8 | **Count why Carthage goes to war** before touching it. Carthage's anger gains a point every year whatever you do, it starts at 2, and war comes at 6 to 8, so war is nearly built into every game (87 to 88%). Count how many wars came from the yearly tick alone. If most did, offer the switch "Carthage answers what you do" (the tick halved, your walls, fleets and raids drive the anger). | Tooling, then maybe a switch | cheap | after | 4-1 to count first (the Historian: build the switch, counting first) |
| 9 | **Count why Carthage's armies end** (battle, hunger, plague, recall). It loses about 0.08 armies a game even with "Beaten armies can break". | Tooling | cheap | after | 2 seats, none against |
| 10 | **Purges pay: no switch for now.** The recount (below) shows most of the effect is reign length. Two ideas are kept in `later.md` in case Jacob wants the empty court to cost something: "the cast refills" (sons come of age and new men take dead men's places, invented) and "a late, outside cost" (purged houses leave exiles abroad who press Rhegium and Carthage, and Theodorus' speech reads out your own record). | No change | none | — | 5-0 to recount first |
| 11 | **The patron's petitions: no change** until Jacob's own play shows the habit. Petition costs nothing and has no limit (`src/core/actions.ts`, petition), so the switch "Favours wear thin" is ready if it's needed. | No change | — | — | 4-1 (Systems: offer the switch now) |
| 12 | **Coming home 2 in 5: no change.** Log what held at each return (the ruler away, the factions' hatred, arms given out). If returns succeed with none of those, that's a bug. | Tooling | cheap | after | 3 seats, none against |

### The report's five questions, answered
1. **Fix the self-feud?** Yes, 5-0. Systems found it reaches the preset too, silently: when you are a dead man's nearest kin, no Bereaved avenger is made at all (`makeRival` in `src/core/ops.ts` skips the player), and the grudge lands on you unseen. So executing Leptines in the test makes no avenger.
2. **Free silver from the Rebellious rich?** Show the real cost in a reason line now. The switch "The purse runs dry" comes after (3-2). The idea has a source, which sets no rate: "in the reign of Dionysius the result of taxation used to be that in five years men had contributed the whole of their substance" (Aristotle, *Politics* 1313b, checked in the saved Rackham text).
3. **Purges pay?** The recount says mostly not. No switch now. Whether a tyrant who rules by killing should die in bed stays Jacob's call. Diodorus says Dionysius "maintained his dominance until his death" (13.96.3-4, checked).
4. **Vary the opening?** Yes, after his first game, 4-1.
5. **Exile lines?** Speak only on a change, 5-0.

### The purge recount (run by the chair)
`scripts/purge-recut.ts` (new, changes no rules, same output every run) replays the batch's 144 full-scope iron-hand games and keeps only reigns still running at a given season.

| Executions | Whole reign (as in the report) | Alive at season 12, executions before it | Alive at season 20, executions before it |
|---|---|---|---|
| 0-1 | 1 of 23 survive (4%) | 3 of 17 (18%) | 1 of 4 (25%) |
| 2-3 | 0 of 30 (0%) | 15 of 49 (31%) | 8 of 20 (40%) |
| 4-7 | 15 of 45 (33%) | 18 of 46 (39%) | 22 of 58 (38%) |
| 8+ | 20 of 46 (43%) | none yet | 5 of 11 (45%) |

Reading: the gap of 2% against 43% mostly comes from short reigns having no time to kill anyone. Among rulers still alive at season 20, survival is about the same however many they have executed. A smaller effect remains early in the reign: at season 12, the iron hand who has killed few survives 18% of the time against 39%. The Dionysius bot shows no benefit at all (at season 20: 48%, 53% and 42%). That isn't strong enough to build a rule around.

## Part B. Bigger suggestions and direction

**Stay the course on the core** (5 of 5). The batch's best stories come from the sourced pieces (the brother of Demarchus, Aetna, Theodorus, Motya, the market-place death) and from the people systems (Aristomache's return, the friend who turned). Deterministic, data-first and readable is right. Nothing here argues for a change of direction before Jacob plays.

**The biggest risk** (named by all five seats): the project is building faster than its one designer can play. There are 17 switches, eight Workshop bets, a whole-game design with six campaigns and a Phase 3 draft, and Jacob has played none of it. Every number so far comes from bots that don't read, bargain or plan. If his game says "not a story I'd retell", much of the recent work was aimed wrong.

Five suggestions, ranked:

1. **After his game, work from his game.** Replay his save, fix what he hit, and build nothing new until he says go or no-go. Needs his say: no. CLAUDE.md already says fixes and the test come first.
2. **Sort the switches once** (5 of 5). Seventeen switches make a space nobody tests, and they interact: with all of them on, the careful and patron bots almost never become tyrant (4 of 288 games, against 52 of 144 on the preset). After his game, Jacob puts each switch in one of three places: part of the island game, Workshop, or later. Aim for about six that matter. Fold the overdue assessment of the eight bets into the same decision, so he decides once. Needs his say: yes.
3. **Outside powers answer what you do, not the calendar** (Historian, Systems agreeing in principle). Carthage's yearly tick is the main reason games feel samey, and it's the least historical part of the game. In the sources, Carthage "waited for the Syracusans to take the initiative" (Diodorus 14.47.3, checked), and Rhegium was "urged on by Syracusan exiles resident in Rhegium" (14.40, as quoted in `docs/research/diodorus-401-399.md`). A switch first (Part A, item 8). Needs his say: yes.
4. **One design principle: costs keep biting at the bottom of the scale** (Systems). Every bounded number (mood, opinion, power) needs a rule for what happens past the end, and an angry faction should act rather than sit at zero. That's the Leder lesson. The Rebellious rich are the first case. Needs his say: yes, as a principle.
5. **Treat bot batches as smoke detectors, not judges** (5 of 5). Use them for crashes, broken states, repeated text and free actions. Future batch reports lead with the preset Jacob plays, and any switch is first tested alone against the preset. Needs his say: no.

Split, left to his game (4-1 to wait): whether the story chronicle becomes the main view and the season log a fold (Narrative). His game will show which one he reads.
Parked: a short end-of-reign history and a "people of your reign" page to show a friend (Player). That edges into Phase 4. Also leave the whole-game and Phase 3 paper alone until the gate (Player, Devil's Advocate).

## Part C. You didn't ask, but

1. **Have the debrief ready for tomorrow** (5 of 5). When his "Copy my game" text arrives, one thread replays it (`npm run replay-save`), lines up every confused or unfair moment with its log line, runs the three-lens review on *his* game, and writes a dated note in `docs/playtests/` in his words. Add three short questions to his season-10 verdict: tell the ten seasons in three sentences; which line did you skip; who did you hate? Nothing in the repo yet records him playing.
2. **Sort the switches and the eight bets in one sitting, after his game** (5 of 5). See Part B, item 2. Judge each bet by whether he touched it and liked it, not by bot counts.
3. **Stale branches** (5 of 5). There are 31 or 32 remote branches. List each with a "safe to delete?" line and ask him before deleting any, because deleting on GitHub can't be undone. Never merge them. The "deletes about 9k lines" figure couldn't be checked: the clone is shallow, so a tip-to-tip diff isn't what a merge would do.
4. **Mark the blocked threads "waits on your game"** (balance, great works, the Phase 3 paper), so the overview shows one thing waiting on him, not three (5 of 5).
5. **Cheap guards in the headless run** (Systems, Narrative, Historian). A "free action" count flags any action used often while its cost changes nothing, which would have caught the coin loophole. A repetition warning fires when any visible line passes a threshold. A quote check for the game repo, like the site's `verify-quotes.js`, makes sure every history-tagged line still greps in the saved texts. All three warn and never fail, and nothing is tuned to them.

Also raised: shrink the open-question queue in `docs/handoff.md` to five, with the rest defaulting to what the game does now (Devil's Advocate). And build the "Mark this moment" button, parked in `later.md` and ranked joint first by the first council, before his second game (Player).

## The single most important thing next
Let Jacob play the frozen link tomorrow with the two-line oddities note, capture his game and his words, and let that game, not the bots, steer the next build.

## History and invention
Quotes checked by the chair in the saved texts: Aristotle, *Politics* 1313b (`sicily-tyrants/aristotle-politics-5.rackham.txt`); Diodorus 13.96.3-4 (`book13.loeb.txt`); 14.47.2-3, 14.55.1, 14.65.2, 14.66.5 (`book14.loeb.txt`). Diodorus 14.40 is quoted from the game's research card and was not reopened. The report's line that Aristomache becomes Dionysius' wife in the sources was not checked by this council.
