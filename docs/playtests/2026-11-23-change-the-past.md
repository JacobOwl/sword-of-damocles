# Change the past: the branch check (thread 22, 2026-11-23)

Workshop bet B2. Rerun with `npm run debrief -- --sweep 100` (safe to rerun; it exits with an error if any branch breaks).

## What was run
For seeds 1 to 100 on the island, the careful bot played a whole game. In each game one answer to an event was changed (the answer picked by seed, the first other choice that was open), everything else the bot did was kept, and once its remembered moves ran out the careful bot played the branch on to the end.

## Counts
- Branches: 100. Crashes: 0.
- Branches that did not match their parent before the split: 0. (Every branch is its parent's log, entry for entry and die for die, up to the season it went back to.)
- Branches that did not replay from their own record: 0. (A branch is an ordinary game: seed, options, inputs.)
- Ending changed, in how or when: 50 of 100.
- Named people whose fate differs between parent and branch: 3.5 a branch on average.
- Later moves that no longer fit (an event that never fired, a man no longer there to target): 18.7 a branch on average. They are listed, never forced.

## What this means, and one problem
One changed answer changes the ending about half the time. That is good for "change the past": the other road usually leads somewhere else. But not all of that is the choice. Every roll after the change comes off the one random stream in a new order, so the branch also has different luck. The comparison shows each side's dice after the split (rolls, failures, the average die) so a reader can see when luck did the work, but it can't separate the two.

A fix would be dice that don't shuffle when an unrelated choice changes (for example, one stream per season, or per kind of roll). That changes how the engine draws every die, so it would be a switch and would move every replay digest; it is parked in `later.md` for Jacob, not built.

## Sample
`docs/playtests/debriefs/seed-7-island-careful.md`: the debrief of one game (seed 7, island, careful bot): three other histories and the 14 rolls the player never saw.
