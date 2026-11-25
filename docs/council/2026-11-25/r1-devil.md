DEVIL'S ADVOCATE SEAT: statement (council of 2026-11-25)

My main point: almost everything in this batch describes a game Jacob will not play tomorrow. His preset (data/presets.json, "firstIslandTest") turns on only four switches: clues, partialBlows, storyChronicle and armiesBreak, under Reap what you sow. The 1,008 games turned on 17. The one set that matches his game is the 144-game baseline, and it got two lines in the report. In that set the careful ruler survives the decade 92% of the time, is killed 1% of the time, and faces 0.1 strikes a game (summary.md, "baseline"). If tomorrow goes badly, I expect the reason to be too little danger, not loopholes.

PART A. Changes after the 1,000 games (ranked; each item says before or after his game)

1. Freeze everything on the test link. NO CHANGE, cheap. BEFORE: this is the "before" item. Change nothing he will play. The freeze rule in handoff.md stands.

2. Tell Jacob about one wording bug before he plays. Message only, no build, cheap. BEFORE. Blows can miss (partialBlows) is in his preset. In that mode the wound reason line is wrong when a blow wins by 3 or 4: 40 of 68 wounds in the kept logs. One of his watch questions asks whether any blow felt random, and a wrong explanation would spoil his answer. One line will do: "if a wound's explanation looks off, that's a known wording bug."

3. Self-feud bug. BUG FIX, cheap. AFTER. Q1: yes, fix it. I checked src/core/actions.ts (execute). The kin list is never filtered for the player. With the feud switch off, makeRival quietly does nothing for the player (src/core/ops.ts:150, `if (!p || p.player ...) return`), so nothing shows. But the hidden grudge and the -2 opinion still land on the player in every mode. The visible line only appears with feud on, and feud is not in his preset, so the fix can wait a day.

4. Text bugs: "him" for women, leader named twice, "Meanwhile, After", the rival line repeating, the wound reason line, a fugitive lending silver. BUG FIX, cheap, one small thread. AFTER. Two of these (the wound line and "Meanwhile, After") are in his preset. If he spots them unprompted, that shows his report is reliable. Fix them with his notes in hand.

5. "General home too popular" never matches. TOOLING, cheap. AFTER. This is a museum pattern, not the game.

6. Exile lines. TEXT VARIETY, cheap. AFTER. Q5: speak only when the hunt changes. It ranks low, because exile is Workshop only and not in his game.

7. Stock Whispers lines (84 to 86% of games). TEXT VARIETY, medium. AFTER, and only if Jacob notices them. Thread 4 already capped repeats in ten seasons, and his ten seasons are the test of that work.

8. Same opening every game. NO CHANGE for now. AFTER. Q4: not yet. Repetition across games matters by his third game, not his first, and the bots see this opening a thousand times where he sees it once. Also, the 94% Philistus line comes from the council switch, which is off in his preset. Ask again after his second game.

9. Coin and levy once the rich are Rebellious. NO CHANGE. Q2: keep it. It isn't free: a Rebellious faction puts its weight behind plots (src/core/ai.ts:352-357). The price is a standing threat, not a mood step, and that seems a good trade to me. At most, add a reason line so the player sees the cost.

10. "Purges pay." NO CHANGE; TOOLING to recheck it, cheap. AFTER. Q3: don't add a growing cost yet. I think the number is mostly survivorship bias. Only a long reign has time for 8 or more executions, and reigns that end in season 5 are counted as "fewer than 4". Recut the data before anyone reads it as a rule: survival from season 12 onward, grouped by executions up to that season. If the effect holds after that, it's Jacob's call. Game 2 (the empty court) reads as a horror story, and that may be the point.

11. Patron's petitions, a secret that doesn't stop a takeover, exile returns in 2 of 5 falls. NO CHANGE. A patron who listens and survives is the design working. The secret was over Nicoteles, but the guard switched its backing, so a reason line would be enough. And "Fallen, not finished" is supposed to allow comebacks. These are loopholes only from a bot's point of view.

12. Batch tooling. TOOLING, cheap. AFTER. Future reports lead with the preset Jacob is playing, then show any all-switch numbers. The report itself admits that with all switches on, the bots' priority lists crowd out tyranny (4 of 288 games), so any tyranny figure from all-switch runs is noise from the bots, not a finding about the game.

PART B. Bigger direction

The biggest risk: the project builds faster than its one designer can play. The clone only holds the last 55 commits (it's shallow), and 51 of them landed on the 22nd and 23rd. There are 17 switches, eight Workshop bets all built, a whole-game design of 6,486 words, a Phase 3 draft of 3,916 words, about 140k words in docs/, and roughly 9.5k lines in src/core. Jacob has played none of it. handoff.md is 185 lines, and most of it is questions he hasn't answered. CLAUDE.md says Phase 2 is passed when ten seasons give a story he would retell. Every bet since the 23rd has been building around that test without taking it.

1. After tomorrow, work only from his game (needs Jacob's say, cheap). Replay his "Copy my game" save (`npm run replay-save`). Fix what he hit. Build nothing new until he says go or no-go. This is "change nothing until Jacob plays" for one more day, and then "change what he played".

2. Cut down the switches (Jacob's call, medium). Seventeen switches make a space no one tests, and the crowding of tyranny shows they interact. After he plays, put each switch in one of three places: the default game, the Workshop, or later.md. Aim for about six that matter.

3. Stop treating bot batches as evidence about design (no say needed, cheap). Use them for crashes, broken states and repeated text. That's what the CLAUDE.md checks ask for, and they do it well. Their loophole numbers come from bots that, by the report's own list, don't plan, bargain, read the council or try odd things.

4. Shrink the question queue to five (cheap, Jacob approves). Jacob's attention is the scarce resource. Rank the open questions in handoff.md, let the rest default to what the game does now, and say so. The assumptions council did this once, and the pile has grown back.

5. Leave the whole-game and Phase 3 paper alone (no say needed). It's useful, but it is design for a gate nobody has passed. More of it risks Claude writing Jacob's vision for him.

PART C. Things he didn't ask for

1. Make sure his game is captured: the save, his season-10 verdict, and a debrief note in docs/playtests/debriefs/. Only one seed debrief is in that folder now, and nothing in the repo records Jacob playing.
2. The overdue assessment of B1 to B8: do it after his game, as one page. Judge each bet by whether he touched it and liked it, not by bot counts. Bets he ignores go to later.md.
3. Branch cleanup: there are 31 remote branches. I could not verify the "about 9k lines deleted" claim. This clone is shallow (`git rev-parse --is-shallow-repository` prints true), so merge bases are missing. A tip-to-tip diff of jmqrof against main shows 35k deletions, but that is not what a merge would do. Don't merge any of them. Deleting branches on GitHub can't be undone, so ask Jacob first.
4. The blocked threads (balance, great works, Phase 3 paper) should stay blocked. They are waiting on his game, as they should be.
5. Measure danger in the preset: is a 92% decade survival for careful play too safe for a first story? Report it, don't tune it.

PART D. The single most important thing: let Jacob play the frozen link tomorrow, tell him about the wound-line bug, and build nothing but bug fixes until his verdict is in.

History: I make no historical claims.
