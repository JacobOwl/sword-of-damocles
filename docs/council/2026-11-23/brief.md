# Assumptions council brief (2026-11-23, thread 18)

Jacob asked: "What do you need to know from me. What assumptions are you working under that you need clarification on. Have a council of agents debate and decide."

You hold one seat on a five-seat council. Your job is NOT to design new features. It is to look at the assumptions the project is working under, decide which ones the council can settle itself, and pick the very few that truly need Jacob because they change his goal or direction.

## Read first (READ ONLY: do not edit, commit or write anything in either repo)
- `/home/user/sword-of-damocles/CLAUDE.md`, `docs/scope.md`, `docs/design.md` (Jacob's original vision and roadmap), `docs/phase2-plan.md`, `docs/architecture.md` (skim), `docs/later.md`, `docs/decisions.md` (skim headings, read the last few entries), `docs/council/2026-11-22-design-council.md` (the last council; do not rerun its debate), `data/switches.json` (rule switches, all off by default).
- The open questions threads have left for Jacob, collected in one file: `/tmp/claude-0/-home-user/357ffacb-bc73-5a5d-bb89-b49f04162f77/scratchpad/questions.md` (about 60 questions; most are taste calls).
- Grep `docs/handoff.md` as needed; it is long.

## Ground rules from Jacob
- Phase 2 ("The Island", 8 cities + Aetna, simulated Carthage, armies) is the current test target. He chose the full plan over the smaller one. Phase 1 stays as a scenario.
- Godot is the long-term platform; the browser app now. The engine stays UI-free.
- Rules changes ship as optional switches, off by default. Rules, designs and opinions are Jacob's.
- He has said "You decide" for taste calls and "Do it yourself" for fetching sources. So only bring him a question if the answer changes his goal, the direction of the project, or something that can't be cheaply undone.
- He is a novice who doesn't code. Questions must be plain, few, and answerable in a sentence or a pick.
- Usage budget: about 90% of a weekly allowance to spend by Wednesday morning, 2026-11-25. Green light to be ambitious.
- Don't tune to historical rates. Don't frame the game around a thesis.

## Candidate assumptions (starting list; add any you find missing)
A1. "Done" for the island test = the scope.md gate: ten seasons produce a story Jacob would retell, and he says go. Nothing says how he will test (how many games, which preset, when).
A2. The player is always Dionysius I, ruler of Syracuse. No other start characters until Phase 3.
A3. When Dionysius dies or falls, the game ends (no heir, no exile play).
A4. A game is the decade 405-395 in seasons (40 seasons). Session length is not defined (one sitting? several? save and resume exists).
A5. The player's goal is survival; no score, no chosen ambition.
A6. Difficulty: the simple bot lasts ~11 seasons, a careful bot ~29. Is a careful human expected to usually survive the decade?
A7. All rule switches and the balance package stay at defaults (Standard, all off) until Jacob picks; no "first test" preset exists.
A8. Through Wednesday: many parallel threads keep building (events, cast, art, switches, architecture). There is no single named target for Wednesday.
A9. The game is private, for Jacob only. Never public. (Affects art licensing, coin photos, sourcing rigor for public view.)
A10. The roadmap order still holds: Phase 3 Long Game (216 years, generations, start dates, mercenary market), Phase 4 Historian (Legends browser, biased chronicle), Phase 5 optional board game.
A11. Carthage's politics are shown in full to the player.
A12. You (Dionysius) can't lead the army in person; the holder of the generalship commands (the "commission" idea is parked).
A13. Chronicle text is plain engine text; no LLM at runtime.
A14. History is conditions, not dates: real events may never happen; real people can die early.
A15. Judged on desktop; phone checked but secondary.
A16. The browser artifact on claude.ai is where Jacob plays.

## Also asked
Jacob asked for a short summary of the project's planned stages. Say in one or two lines whether the roadmap order (design.md / scope.md) still fits, from your seat.

## Format for your answer (under 1,300 words, plain English, no code)
1. For EACH assumption A1-A16 (and any you add as A17+): verdict SETTLE (give the call the council should make, one line) or ASK JACOB (why it changes his goal or direction, in one line). Be strict: ASK only when we genuinely can't decide for him.
2. Your ranked top 3 questions for Jacob, each with 2-4 options and your recommended option.
3. Which of the ~60 open thread questions (questions.md), if any, also deserve Jacob's attention; say "none" if none. Everything else the council settles by default.
4. One line on the roadmap order.
Mark any historical claim with its source passage or "unverified".
