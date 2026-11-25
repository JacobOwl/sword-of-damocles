# After Jacob's first island test: the debrief plan

Written 2026-11-25 (thread 31, council after the 1,000 games). Jacob plays the frozen test link on Thursday 2026-11-26. This is what a thread does when his "Copy my game" line arrives, so the debrief can start within the hour.

## 1. Replay it on the code he played
- Save his line to a file, for example `docs/playtests/2026-11-26-jacob/save.json`.
- Run `npm run replay-save -- docs/playtests/2026-11-26-jacob/save.json`. If the digest does not match, the rules have moved on since his build (they have: PRs #67, #69 and #70 changed wording). The save's `build` is commit 9bc0671, which is kept on branch `claude/project-thread-3gs241`. Main's commit 26744da holds the same code. Check out a copy and replay there: `git worktree add ../frozen 26744da`, then run the same command inside `../frozen`.
- Run `npm run debrief -- <save> --out docs/playtests/2026-11-26-jacob/debrief.md` for the hidden rolls and three ways the game could have gone.

## 2. Write down his words first
- In `docs/playtests/2026-11-26-jacob/notes.md`, quote his five season-10 answers word for word, plus anything he says in chat. Write no summary before the quotes.
- Then ask him the three short questions the council added, in one message, and quote the answers:
  1. Tell the ten seasons in three sentences.
  2. Which line did you skip or stop reading?
  3. Who did you hate, and why?

## 3. Line up each moment with its log line
For every moment he calls confusing, unfair, dull or good, find the log line and its reason in the replay (`--log`, or `--all` for hidden rolls). Put them in a table: his words, the season, the line, the reason, and our reading (bug, wording, rule, or working as meant).

## 4. The three-lens review of his game
Use the usual format: UI designer and artist, expert historian or game designer, new player, at desktop and phone width. Report only. List every suggestion, each marked cheap or costly, and star the top five.

## 5. Put his game beside the numbers
Only now show him the preset's bot numbers, so they could not prime him:
- On the preset, the careful bot survives the decade 92% of the time and is killed 1% of the time (`docs/playtests/2026-11-25-aar/summary.md`, baseline).
- 33% of baseline games have no story shape in seasons 1 to 10.
- Then say whether his game was quieter or busier than the bots' games.

## 6. Then the decisions, in one sitting
- **The gate:** would he retell it? That is his verdict, quoted.
- **Sort every switch once**, into part of the island game, Workshop, or later. Fold in the eight bets (B1 to B8, `docs/council/2026-11-23-two-day-plan.md`), judged by whether he touched them and liked them.
- **The council's switches waiting on him:** "The purse runs dry", "A different first year", and "Favours wear thin" if he spammed petitions.
- **The stale branches:** see `docs/branch-list.md`.

Nothing new gets built until he has seen steps 1 to 5.
