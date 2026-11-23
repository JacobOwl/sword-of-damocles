# Assumptions council, 2026-11-23 (thread 18)

Jacob asked: "What do you need to know from me. What assumptions are you working under that you need clarification on. Have a council of agents debate and decide."

Five seats (the Player, the Systems Designer, the Historian, the Producer, the Devil's Advocate) judged 16 starting assumptions and added their own, then voted in a second round on the six points where they split. Brief: `2026-11-23/brief.md`. Statements: `2026-11-23/r1-*.md`, `2026-11-23/r2-devil.md`, votes in `2026-11-23/r2-votes.md`. The historian's Diodorus quotes below were checked against the saved Loeb text by the chair.

These are advice and defaults. Anything marked "Jacob's" stays his; he can overturn any settled call with one line.

## The finding everyone agreed on

**Jacob has not yet played the island.** His only own playtest is the paper test in chat; every other playtest was run by bots. About 60 questions sit in `docs/handoff.md`, and new features keep landing. The council's view: the most useful thing this week is a test build he actually plays, not more features or more questions.

## Questions for Jacob (ranked)

1. **When will you play the first island test?** (5 of 5 seats.)
   - (a) One sitting before Wednesday morning, one game on the "First island test" preset, judged at season 10. **Recommended.**
   - (b) A few short games across the week.
   - (c) After Wednesday, once more is built.
   Why it's his: every thread's target and the rest of the week's budget depend on his calendar.

2. **Should you be able to lead the army yourself, or send a named man in place of the general?** (Named by 5 of 5; 4 say ask now, the Producer says ask after the test.)
   - (a) No. Only the holder of the generalship commands, as the plan says now.
   - (b) Yes, as a switch you can try in the test, off by default. If you go, you name a keeper of the citadel, and plots at home get easier while you're away. **Recommended.**
   - (c) Decide after the first test.
   Why it's his: it decides whether the map and the plots are one game or two, and whether the war is yours to play. The sources have Dionysius lead in person ("he himself, profiting by a moonless night, made a circuit with his army", Diodorus 14.72.1), and the danger at home came when the citizens were armed ("now because of the war they had weapons at their command", 14.64.4).

Minority questions, not put to Jacob (one seat each, outvoted): a chosen ambition at the start, beside survival (Systems: "survival alone pays you to stay home"); where the rest of the week's usage goes after the test is ready (Producer); whether the test should reach the war of 397-396 (Historian, Devil; settled below instead).

## Settled by the council

**The test**
- **"Done" for the island test** is the scope gate in Jacob's words. The game asks for a short verdict at season 10 (what you'd retell, what confused you, what felt unfair, and "too easy, too hard, about right?"); he may then play on to the war or his death, with a second prompt at the end. (4-1; Systems preferred a year-4 pause.)
- **A "First island test" preset**, listed first on the start screen and marked recommended. Standard stays the engine default (a rules choice is Jacob's; picking the preset is one click). (4-1; the Player wanted it preselected.)
- **In the preset:** Reap what you sow, Warnings are clues, Blows can miss (design council V5, 6-0), Chronicle as story (5-0, it changes no rules and the gate is judged by reading the chronicle), Beaten armies can break (4-1: without it Carthage never lost an army in 100 careful games; Himilcon's army of 396 was in fact abandoned, "abandoning all the rest of his army", 14.75.4). Everything else off. The Producer voted to keep Beaten armies out so a strange result is easier to trace.
- **Ten seasons won't reach the great war.** Ten seasons from 405 end about 403/402; most sourced island events date from 398 to 396. Jacob is told this in one line; the start stays 405 because it holds the peace of 405 and the revolt of 404/3 (Diodorus 14.7 to 14.9). Measure how many map events happen in seasons 1 to 10 over 100 seeds; if it is near zero, fix pacing, not the date.
- **A short "what to watch" note** goes with the test: the known oddities (you lose most battles, sieges are rare, the fear rule rarely fires).
- **Difficulty is not set in advance.** No tuning before a human plays, and none toward history. He is asked after his game.
- **The week:** one target, the playable test build. Fixes and the test pass (milestone 5) come first; anything new goes behind an off switch or into `later.md`. Every PR rebases on main and reruns the checks before merging (PR #32's squash merge undid #30 and #31). (5-0.)

**The game (unchanged, confirmed)**
- You are always Dionysius I; other starts stay in Phase 3.
- The game ends at death or fall in Phase 2. design.md already promises heirs and play on through your network, so this is a phase limit, not a gap; exile play stays parked.
- The decade stays 405 to 395 in 40 seasons, with save and resume.
- The goal is to hold power; the game remembers how long you lasted and how you fell (design.md). A chosen ambition stays parked (4-1).
- Carthage's politics are shown in full for the test; "only what spies learn" can come later as a switch.
- History is conditions, not dates; real people can die early. On screen, `history` reads as "Diodorus says", never "this happened".
- Army sizes: a figure plus a "disputed" note (Diodorus gives Himilcon "more than three hundred thousand infantry", 14.54.5; Timaeus says they did "not exceed one hundred thousand", 14.54.6). "About 40,000" is invention and labelled so.
- No LLM at runtime; desktop first, phone checked; Jacob plays the claude.ai artifact (version 16 on 2026-11-23, current); the project is private; keep licence notes on outside images anyway.
- **Where "you decide" ends:** taste (art, names, wording, pacing knobs) is the council's to settle. Rules changes ship only as switches that are off, and Standard stays as it is.

**The ~60 open thread questions in `docs/handoff.md`** need nothing more from Jacob. What the game does now stands as the default; the "play X and judge" questions become prompts on the season-10 verdict screen. The historian's defaults for the history ones: Polyxenus as the sister's husband, with Polyaenus' version shown as a disagreement; keep Theodorus, flagged "attested only about 396"; keep Damon as invention; keep the unnamed shares of women; tag Annobal and Bodashtart as names from outside the period; keep the Elders and the Hundred as tagged invention; Himilcon's bargain disgraces him only under its switch.

## The roadmap

All five seats: the order still fits. Phase 0 paper test (done); 1 The Citadel (built, kept as a scenario); 2 The Island (now, milestone 5 next); 3 The Long Game (480 to 264 BC, generations, chosen start dates, other characters, the full mercenary market, the rest of the cities); 4 The Historian (a browser of every person, city and war, and the biased chronicle); 5 optional board game. Two notes: heirs and exile play are the natural bridge into Phase 3, and part of Phase 4's browser already exists (character sheets, the families page). No Phase 3 work until Jacob says go at the island gate.
