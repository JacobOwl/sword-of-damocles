# The Producer (round 1)

**Where we stand (from git log and handoff):** milestones 1 to 4 of `docs/phase2-plan.md` are merged: the map, a simulated Carthage, armies with supply, and towns changing sides. On top of them sit 41 island events, the generated cast, 11 rule switches and the web-app restructure. **Milestone 5, the test pass, has not started.** No first-test preset exists, nobody has read ten seasons of an island game, and there has been no three-lens review. Jacob has not played the island. The drift risk is real: PR #32 was squash-merged from an old base and quietly undid PRs #30 and #31, and that took a later PR to repair. Eleven switches are waiting for one person to choose among them. The problem now is not missing features. It's that Jacob has nothing ready to play.

(Chair's note: the seat read an old line in handoff saying the link was at version 12; the artifact was republished as version 16 on 2026-11-23.)

## 1. Verdicts

- **A1 Done = the gate. ASK JACOB (lightly).** Only he can say when and how he will play, and the budget plan depends on it.
- **A2 Always Dionysius I. SETTLE:** yes. Other start characters are cut in scope.md.
- **A3 Death or fall ends the game. SETTLE:** yes for the first test. Exile play stays parked.
- **A4 40 seasons, length undefined. SETTLE:** keep the decade. Add the council's "continue?" pause after year 4 (V1), shown with the chronicle so far, so one sitting is about 16 seasons.
- **A5 Goal is survival. SETTLE:** survival only. "Ambition chosen at start" stays parked.
- **A6 Difficulty. SETTLE:** don't tune. Report what happens: the careful bot survives 62 of 100 island games.
- **A7 Everything at defaults, no preset. SETTLE:** build the council's "First island test" preset (V5: island, Reap what you sow, clue warnings, partial blows), every other switch off, as the default start. One click turns it off.
- **A8 Many threads, no Wednesday target. SETTLE:** name one target for Wednesday morning: milestone 5 done, game republished. Freeze new content until then; new ideas go to `later.md`.
- **A9 Private. SETTLE:** yes.
- **A10 Roadmap order. SETTLE:** yes.
- **A11 Carthage shown in full. SETTLE:** yes for the first test; "only what spies learn" later as a switch.
- **A12 No personal command. SETTLE:** keep for the test; commission stays parked.
- **A13 No LLM at runtime. SETTLE:** yes.
- **A14 History as conditions. SETTLE:** yes.
- **A15 Desktop first. SETTLE:** yes.
- **A16 Plays on the artifact. SETTLE:** yes; republish from main and log the version.
- **A17 (added) The test link is current. SETTLE:** republishing is the last step of milestone 5.
- **A18 (added) Parallel threads merge safely. SETTLE:** no squash merges from stale bases; rebase on main and rerun checks (lesson of PR #32).
- **A19 (added) Jacob is told what to look for. SETTLE:** a one-page "what to watch" note with the biggest oddities (you lose most battles, sieges are rare, the fear rule rarely fires).

## 2. Top 3 questions

**Q1. When will you play the island test, and how much?** (a) Wednesday or Thursday, one game in the preset, stopping at the year-4 pause *(recommended)*; (b) two games, preset and defaults; (c) later, whenever; (d) not this week.

**Q2. Can we pause new features until you've played?** (a) Yes, freeze and fix only what the test finds *(recommended)*; (b) mostly, one small content thread may keep going; (c) no.

**Q3. What should the rest of the budget go to after the test is ready?** (a) Deepen the island where the test finds dullness *(recommended)*; (b) plan Phase 3 on paper; (c) art and sound; (d) save it.

## 3. Open thread questions that need Jacob

Two, both answered by playing: "Does ten seasons produce a story you'd retell?" and "Does the look land?". Everything else gets the council's default.

## 4. Roadmap

The order fits. The risk is Phase 2 growing sideways and never reaching its gate. No Phase 3 work until Jacob says go.
