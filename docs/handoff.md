# Handoff

The thread that finishes a session writes this, not Jacob. Rewrite it at the end of every session.

## Built
- No engine code yet. This session ran the Phase 0 paper test in chat, from autumn 405 to winter 403/402, with Jacob as Dionysius. See `docs/playtests/2026-11-22-paper-test.md`.
- Added `docs/research/dionysius-405-403.md`, the history behind the starting position, checked against the saved Diodorus, Plutarch and Aristotle texts.
- The working starter rules are in a Claude Doc: https://claude.ai/artifact/PsTQMCF52p5BbUgqHmfRm5

## Changed
- Rules fixed during the test: grain pacing, moods that can rise, two traits per person, and the Carthage clock at +1 a year. See `docs/decisions.md`.
- The direction is now a video game, with a fixed action menu, shifting faction power, agendas, and rivals that grow out of play. See `docs/decisions.md`.
- `docs/later.md` gained three items: conquest, dinners, and playing as an exile.

## Broke
- Nothing in the code. In the rules, Claude made 8 rulings during play that aren't written into the rules yet (listed in the playtest file).
- The engine still runs no seasons, so the 100-seed check (`npm run sim`) doesn't exist yet. Only `npm test` runs, and it passes (1 smoke test).

## Questions for the next design session
- Write the v2 rules (about 20 defined actions, faction power from 0 to 10 with marginal and dominant thresholds, multi-season agendas, and rivals), then re-test them for 3 or 4 seasons using only the menu.
- Does conquest of nearby cities belong in Phase 1 in a simple form, or in Phase 2? The player kept reaching for it.
- The guard costs 3 talents a season and nothing brings in steady income. Is that the intended mercenary trap, or should Phase 1 have regular income such as harvest tax or port dues?
- Is taking an absent holder's office for free too easy?
- CLAUDE.md and `scope.md` say Phase 1, but Phase 0 isn't finished. Fix the wording when the rulebook lands.
