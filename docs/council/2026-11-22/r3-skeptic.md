# Round 3: The Scope and Architecture Skeptic

**V1.** Accept. I voted for four places; five is still cheap.

**V2.** Amend: the preview must show every price of a commission (men leaving the defense, the standing lost with the assembly, armed citizens added to plots) as numbers with reasons, as every other action does.

**V3.** Accept.

**V4.** Amend: the "power that people carry" switch must also pass the test that made drift necessary. Over the sweep, no faction sits at 10 for most of a game. Before drift, every faction ran to 10 within a few seasons.

**V5.** Accept.

**V6.** Amend: the feud record ships behind thread 09's switch, with today's rival system still the default, and it merges before thread 10 writes exile chapters. Otherwise thread 10 has to write against a record that doesn't exist yet.

**V7.** Accept.

**V8.** Amend: this contradicts V1 ("same events") unless it is worded carefully. `data/events.json` has about ten date windows ("from": "spring-398", "until": "summer-403" and so on). I'd allow a window when it only decides whether an event can fire, never when it forces one. Someone has to read those ten windows once before the island ships.

**V9.** Amend: the two story fields, `thread` and `cause`, go into PR 0 itself, so both threads build on the same log shape from day one.

**V10.** Accept. The word-budget test can sit in the existing `tests/ui.test.ts`, which already renders each season.

**V11.** Accept as recommendations only.

## Ranking of V11
1. **(a) Mark this moment.** Cheap, and it turns every playtest into a game I can replay exactly.
2. **(b) Story sweep.** Cheap once the story tags exist, and it tests the "story you would retell" gate directly.
3. **(d) One dice stream per system.** Do it in PR 0 or never. Every later A/B test gets cleaner.
4. **(f) Ambition at the start.** Cheap data, a real want.
5. **(c) Losing as a turn.** Costly. It's the best second test, and the `where` field keeps it possible.
6. **(e) Disputed numbers.** Later.

## The biggest risk the council missed
Counting PR 0, the feud record, the clue warnings, the map, the island bot, the Carthage bot and the preset, Jacob may wait through six or seven merges without playing anything new. So after PR 0 and thread 09, give him a playable checkpoint: the citadel scenario under the new preset. If the island test then disappoints, we will know whether the island is to blame or the court underneath it.
