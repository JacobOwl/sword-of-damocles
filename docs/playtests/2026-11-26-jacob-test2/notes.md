# Jacob's second island test: his words (2026-11-26)

Quoted word for word, before any summary. Build played: test link https://claude.ai/artifact/8KqQzj6x3QrXRjQKzVZNK4, preset "Second island test" (30 seasons), main at 6bd1ae0 (PRs #83 and #85).

Times are Chicago time.

## In the thread, while playing

(2:50 PM, with a screenshot of Doricus's card, `standing-doricus.png`)

> I don't understand the Standing. 2 of a seat? faction to  leader? his a player?

Answer given: Standing is a five-step ladder (Nobody, Notable, A player, A rival, A pretender). "A player" is the name of a step, meaning someone who stands for seats and makes deals; it does not mean the human player. A person climbs from Notable to A player by having two of three things: a seat (an office), leadership of a faction, or a following (influence 2 or more). Code: `nextStep` in src/core/board.ts, ladder names in data/board.json.

## Suggested fixes (recorded only, nothing built during the test)

- Standing line is unreadable. Rename the step "A player" (clashes with "you, the player"; e.g. "A power" or "A man of weight", Jacob's call) and rewrite the hint as a short list: "Next step: needs two of: an office, leading a faction, a following. Has: none." Cheap.
