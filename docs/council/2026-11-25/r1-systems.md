SYSTEMS DESIGNER: statement to the council, 2026-11-25

**When each item lands.** Jacob plays tomorrow (Thu 2026-11-26) on the frozen link, and nothing below should go to that link. "Before" means a thread may build it and merge it to main now, but only after the frozen version-19 commit is tagged (Part C1), so that his "Copy my game" save still replays exactly. "After" means it waits for his verdict, because his game may change the question. Every rule switch is "after".

## Part A. Changes after the 1,000 games (ranked)

1. **Tag the frozen build** so his save replays on that exact code. TOOLING, cheap. **Before.** Every fix below changes main, and a replay on a changed main can drift away from what he saw.

2. **Leave yourself out of a dead man's kin list in execute.** BUG FIX, cheap. **Before.** I checked `src/core/actions.ts` (execute, around line 336). The kin list is never filtered for the player. The visible "feud passes to him" line comes only from `feudInherit` when the feud switch is on, and the feud switch is not in his preset. But the bug also reaches his preset quietly. `makeRival` in `src/core/ops.ts` (line 150) silently drops the player, so when you are a dead man's first kin, no Bereaved avenger is made at all, and the grudge and the opinion loss land on you unseen. If you execute Leptines in the preset, nobody avenges him. Use the same fix for "him" for women (the pronoun field already exists in `src/core/pronouns.ts`). **Q1: yes, fix it.**

3. **Exile lines only when something changes** (the hunt's rank, a new host, a new danger). Otherwise, one short line saying how many seasons have gone quiet. TEXT VARIETY, cheap. **Before** (Workshop only; exile is not in his preset). **Q5: only on change.**

4. **The small text bugs:** the plot leader named twice, "Meanwhile, After", the political-rival line repeating, the wound reason line at a margin of 3 to 4 (say why it only wounded: no office to take, or the leader struck from outside), and the fugitive who lends money (block lending while the man is fled). BUG FIX / TEXT VARIETY, cheap. **Before.**

5. **Free silver at the bottom of the rich families' mood.** I checked `src/core/ops.ts` (line 59): mood stops at 0. Striking coin (`actions.ts` line 428) and `levyRich` (`data/laws.json`, repeatable) keep their silver but lose their cost once the rich are Rebellious. That is a classic cost that stops mattering. My proposed switch, "Anger overflows", off by default: a hit the floor can't absorb becomes a point of "rich fury". Each point adds +1 to any plot the rich back, and at 3 points they act: they hide their silver (the next coin or levy yields half) or they try to take the mint. RULE SWITCH, medium. **After.** **Q2: keep the default and add the switch.** The aim is not to forbid squeezing the rich. It is to make a hated faction act, instead of sitting there as a number at zero.

6. **Purges pay.** I checked: `s.counters.executions` is counted (`actions.ts` line 334) and read nowhere. Execute also lowers the dead man's faction's power by 1 and costs no faction mood (only imprison costs mood). So each execution weakens a faction and removes a plotter, and the only price is a kin grudge, which runs out as the cast thins. My proposed switch, "Terror has a price", off by default: after the third execution, each further one lowers the mood of every faction one step (fear spreads), or makes plot recruiting easier by 1. It should never forbid purges. RULE SWITCH, medium. **After.** **Q3: keep the default, offer the switch.** Whether a tyrant who rules by killing should die in bed is Jacob's call. I have not checked the sources on how Dionysius died, so the "died in bed" line in the report is unverified as far as I'm concerned.

7. **Petition is a free, unlimited mood pump.** I checked `actions.ts` (line 248): it costs nothing, has no limit on how often the same person can be asked, and gives the faction +1 mood on a 4+. The patron's 92 to 97% survival comes from this. Proposed switch, "Favours wear thin", off by default: each petition to the same person in a row is −1, and a success spends 1 opinion. RULE SWITCH, cheap. **After.**

8. **A deadly secret has no effect on plots.** I checked `src/core/secrets.ts` (around line 249): a hold only stops the man from telling the city what he knows about you. It never touches his plots or a takeover. Two cheap steps. First, the text should say so when the hold is used (TEXT VARIETY, **before**). Second, a switch: "A hold binds his hand", where a held man can't lead a takeover while the hold rests (RULE SWITCH, **after**).

9. **Vary the opening.** Draw two or three of the first-season events from a seeded set of sourced 405 situations, instead of the same three in 81 to 94% of games. RULE SWITCH, medium. **After.** **Q4: yes, vary it by seed.** Of all the rule switches, this is the one I would most expect Jacob to promote, because season one is where "would I retell it" gets decided.

10. **Stock "Whispers" lines and the spurned rival's rumor.** Rotate the wordings, say nothing when there is nothing new, and only repeat a rival's line when he has a fresh grievance. TEXT VARIETY, cheap. **Before** (Workshop only, not his link).

11. **Fix the search pattern for "the general home too popular"** so it matches the commission's log line. TOOLING, cheap. **Before.**

12. **Carthage almost never loses an army** (0.08 a game, even with armies breaking switched on). Report its break rolls first, before changing anything. NO CHANGE yet. **After.** We need numbers before we touch a rule.

## Part B. Bigger suggestions and direction changes

**The biggest risk is that complexity has outrun testing.** There are 17+ switches, exile, works, dinners, convoys, and a five-phase whole-game design. The only gate, Jacob playing ten seasons, has not happened yet. All the evidence so far is bots, and the batch shows that with every switch on, the bots' behaviour changes (tyrannies fall from 52 in 144 games to 4 in 288). The switches now interact in ways nobody has looked at one by one.

1. **Stay the course on Phase 2, with a switch freeze.** No new switches until Jacob has played. After that, sort every switch once: make it part of the game, keep it optional, or retire it. Cost: light. Needs Jacob's say. It solves the combinatorial mess and gives the game an actual rule set, not just a menu of options.

2. **One design rule for every system: costs must keep biting at the floor.** Every bounded number (mood, opinion, power, silver) needs a rule for what happens beyond the end of the scale, and an angry faction should end up acting, not just sitting at the bottom. This is the Leder lesson: anger should become a move on the board, not a number at zero. Cost: medium as a pattern; items 5 to 7 above are the first cases. Needs Jacob's say as a design principle.

3. **A "free action" detector in the headless run.** For every action, count how often it was used while its listed cost changed nothing (mood already at the floor, silver unspent, no limit hit), and flag any action that happens more than about 10 times a game at zero real cost. This catches the next loophole without needing a clever human. TOOLING, cheap. No say needed.

4. **Make Carthage less samey across seeds.** Seed its council's starting moods and its first goal, so the routine differs from game to game. It shouldn't be scripted, only varied at the start. Within scope. Medium. Needs Jacob's say (switch).

5. **Treat the bots as smoke detectors, not judges.** Stop reading survival and tyranny rates as balance until there is at least one human game. Cost: none. This one is about how the council reads the numbers.

## Part C. You didn't ask, but

1. **Tag the frozen commit** (see A1). Cheap, and it can't go wrong.
2. **Have the debrief ready for his save:** one thread on standby to run `npm run replay-save` and the change-the-past debrief on his game the same day, and to record his verdict in `docs/playtests/`. At the moment there is no record that he has played.
3. **The B1 to B8 assessment is still owed.** Make it one page: what each bet built, its counts with the switch on, and keep, promote or retire. It feeds the switch sorting in B1.
4. **Clean up the stale branches.** There are 32 remote branches (`git branch -r`). List which ones are already merged and which would delete work (`claude/project-thread-jmqrof` would delete about 9,000 lines), then ask Jacob before deleting any, since deletion can't be undone.
5. **Unblock or close the three blocked threads** (balance, great works, the Phase 3 paper). Mark each one "waits on Jacob's game" with a single named trigger, so nothing sits half-open.

## Part D

Tag the frozen build, then let Jacob play, and change nothing that matters until his ten-season verdict is written down.
