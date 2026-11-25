NARRATIVE DESIGNER: statement (council 2026-11-25)

Timing first. Jacob plays the frozen link tomorrow (Thu 26 Nov) with the "First island test" preset. I checked `data/presets.json`: that preset turns on only clues, blows can miss, the story chronicle and armies break. Feud, exile, council and secrets are all off in it. So most of the bugs in the batch can't reach his game, and nothing should change in the frozen build before he plays. His fresh reaction to the samey opening is the most valuable thing we can collect. Each item below says READY BEFORE or AFTER his game. "Before" here only means a note he reads first, never a change to the build.

**Part A. Changes after the 1,000 games (ranked)**

1. **Hunt and exile lines speak only when something changes.** On a season with nothing new, print one short line instead, drawn from several. TEXT VARIETY, cheap. AFTER. `data/exile.json` holds one line per hunt stage, and `huntAdvance` in `src/core/exile.ts` logs it every season, which is why the "Named" line can appear 16 times. The story chronicle already has a "nothing new from your informers" counter (`src/core/chronicle.ts`, about line 168). Reuse it for the season log. Q5: yes.
2. **Two to four wordings for every line that repeats, picked by a hash of seed and season.** `data/flavor.json` and `src/core/carthage-chronicle.ts` already pick lines this way without touching the game's dice, so replays and bot numbers stay the same. Adding variants to lists already drawn with `pick` (the warning lines in `data/warnings.json`) also leaves the dice untouched, because `pick` makes one draw whatever the list length. TEXT VARIETY, cheap. AFTER. The worst offenders are "You strike coin at the mint" (38 times in one game), "Stories about you spread…" (41), "Their loyalty is for sale" (37) and the four quiet "Whispers" lines (84 to 86% of games, up to 46 times).
3. **Move player-visible sentences from code into data.** These are hard-coded today: `council.ts:199` (the council accusation), `actions.ts:432` (strike coin), `ai.ts:212` (rumor), `ai.ts:341` (guard unpaid), `feud.ts:76` (feud oath). The project rule is that content lives in `data/`, and wording can't vary until it's there. TOOLING, cheap to medium. AFTER. Do it together with item 2.
4. **Lines that know how many times they've fired.** First time: "Nicoteles spreads stories about you among the rich families." Later: "Nicoteles is at it again." After several: "No one listens to Nicoteles any more, but he keeps talking." In data, that's a first / again / long-running variant per line. This turns a rival's eleven-season loop (game 4) into an arc. TEXT VARIETY, cheap. AFTER.
5. **The chronicle folds the player's routine into one sentence per year.** "Through 398 you struck coin every season and taxed the rich twice." The facts stay in the log; only the story view compresses. The story chronicle already groups by storyline. TEXT VARIETY, medium. AFTER.
6. **Fix the self-feud bug, and fix "him" for women in the same line.** BUG FIX, cheap. AFTER (feud is off in his preset). The kin filter in `actions.ts:342-345` lets the player in. `feud.ts:76` hard-codes "him" although `src/core/pronouns.ts` exists. Q1: yes.
7. **Fix the wound reason line, plot leader named twice, "Meanwhile, After", and the repeating rival line.** BUG FIX, cheap. AFTER, but give Jacob a three-line "known oddities" note BEFORE he plays. "Blows can miss" and the story chronicle are both on in his preset, so he may see the wrong wound reason and the stray capital. He shouldn't take them as design.
8. **Vary the opening.** Q4: yes, but AFTER his first game, and only once he has said whether the opening bored him. It's DATA plus a RULE SWITCH, off by default, cheap. "A general's offer" has weight 5 and needs only peace (`data/island-events.json`, about line 4522), so it nearly always wins the first draw. "Blood in the agora" has weight 3. Options: a varied-opening switch that lowers their first-season weight, or start windows for them. The council accusation in 94% of games comes from the fixed starting plot, so varying who leads that plot by seed would be a second switch.
9. **The rich at Rebellious.** Q2: at minimum the text should change at the floor ("The rich pay, and say nothing. That silence is new."), so the player feels a cost even if there isn't one. Any real cost is a RULE SWITCH, off by default, cheap. AFTER.
10. **Purges pay.** Q3: I won't decide the story for Jacob. My lens: an empty court is a dead chronicle, with nobody left to retell. Proposal: a "the cast refills" RULE SWITCH, off by default, medium. Sons come of age, kin return from abroad, the guard throws up a new captain, each an invented person tagged `invention`. That helps balance and story both. AFTER.
11. **The repeated Persian gift and the fugitive who lends money.** Second-time wording for patrons ("The satrap's agent comes again, with less"). The citation in data is "Diodorus 13.63.2", which is the repo's citation, not checked by me. Also stop held or fled people from lending, a BUG FIX, cheap. AFTER.
12. **"The general home too popular" shape.** Fix its pattern against the commission's actual log line. TOOLING, cheap. AFTER.

**Part B. Bigger suggestions**

Mostly stay the course. The best games read as real stories: Aristomache's arc in game 7, the recall and return in game 4, the friend who turned in game 6. But three changes of emphasis:

1. **The story chronicle should be what the player reads; the log is the evidence.** Problem: the season log is where the repetition lives, and it reads as a log. The story chronicle already removes repeated warnings. Make it the main view and the log a fold. Medium. Needs Jacob's say, and his game tomorrow will tell us which one he actually read.
2. **Give text a variety budget the way the season screen has a word budget.** One rule: no visible line verbatim more than three times a game. Medium, mostly content. No scope change.
3. **Characters need beats, not just states.** Rivals today have a rank and one remembered grievance (`memoryLine` in `ai.ts` always prints the latest). Add one turning line per rank change ("Nicoteles stops pretending"). Cheap per line. Fits Phase 2.
4. **Pause on switches.** Seventeen switches on at once crowd the bots and blur the stories. Don't add another until Jacob has played the preset and picked the three or four he likes. Needs his say.

**Biggest risk:** we build for bots while the only judge, Jacob, hasn't played yet. Every repetition finding is real, but whether a story is retellable is his call, not a score. A second risk is my own lens: smoothing the text could hide a thin simulation. Variety in wording can't fix a samey opening. That needs content.

**Part C. You didn't ask, but**

1. **Capture tomorrow's game properly.** Keep his saved log plus a short retell form: "tell the ten seasons in three sentences; which line did you skip; who did you hate." Then compare his retelling with the chronicle. There's no record yet that he has played. `docs/playtests/first-island-test.md` exists to fill in.
2. **A repetition check in the 100-seed run.** It prints a warning when any visible line passes a threshold, never fails, and is never tuned to. `summary.md` already computes the most-repeated line (18.8 a game on average).
3. **The B1 to B8 assessment is still owed** (`docs/council/2026-11-23-two-day-plan.md`). It should come after his game, so it can use his verdict.
4. **Stale branches.** `git branch -r` lists about 20 `claude/project-thread-*` branches, including `jmqrof`. Don't merge them. Ask Jacob before deleting any.
5. **Unblock or close the threads still marked blocked** (balance, great works, the Phase 3 paper), so the board shows what's really waiting on him.

History check: the report says that in the sources Aristomache becomes Dionysius' wife. I haven't verified that here. The Pharnabazus and Aristus citations are as quoted in `data/exile.json`, and I didn't open the passages.

**Part D.** Change nothing in the frozen build. Let Jacob play tomorrow with a three-line known-oddities note, capture his retelling, and only then start the text-variety thread (items 1 to 4).
