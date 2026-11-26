# Jacob's second island test: his words (2026-11-26)

Quoted word for word, before any summary. Build played: test link https://claude.ai/artifact/8KqQzj6x3QrXRjQKzVZNK4, preset "Second island test" (30 seasons), main at 6bd1ae0 (PRs #83 and #85).

Times are Chicago time.

## In the thread, while playing

(2:50 PM, with a screenshot of Doricus's card, `standing-doricus.png`)

> I don't understand the Standing. 2 of a seat? faction to  leader? his a player?

Answer given: Standing is a five-step ladder (Nobody, Notable, A player, A rival, A pretender). "A player" is the name of a step, meaning someone who stands for seats and makes deals; it does not mean the human player. A person climbs from Notable to A player by having two of three things: a seat (an office), leadership of a faction, or a following (influence 2 or more). Code: `nextStep` in src/core/board.ts, ladder names in data/board.json.

(2:55 PM, with four screenshots: two mood tracks `mood-loyal.png` and `mood-angry.png`, Aristomache's card `aristomache-he.png`, the common citizens' card `citizens-agenda.png`, Rebellious, 7 Active, agenda The people's assembly at step 3 of 4)

> this looks funky. she is called a he. I don't know how to stop or pushy back the agenda the game just started and they almost have it

Answer given: the mood track is five boxes (Rebellious to Loyal) with the current one lit and a red line after Angry, where a faction starts backing plots. Aristomache's "He" is a bug: the standing hint is written with "He" for everyone although the data marks her as a woman. Ways to slow the citizens' agenda, from src/core/ai.ts (`factionTurn`, `agendaStep`): make them Content or Loyal (this preset's "Reap what you sow" rule stops an agenda against you while they are happy; grain handout, giving them land, a law for the citizens); Block their leader (needs leverage over him; skips their next step); act against their leader or the citizens that season (-1 to their roll); drop their power to Marginal (no agenda roll at all). Being Rebellious does not slow it; it makes them back plots as well. When it completes, the assembly gives their leader the generalship.
 (recorded only, nothing built during the test)

- Standing line is unreadable. Rename the step "A player" (clashes with "you, the player"; e.g. "A power" or "A man of weight", Jacob's call) and rewrite the hint as a short list: "Next step: needs two of: an office, leading a faction, a following. Has: none." Cheap.
