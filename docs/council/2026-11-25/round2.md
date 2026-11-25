# Round 2: votes on the splits (council 2026-11-25)

All five seats agree on: no change to the frozen test link; the self-feud fix (Q1 yes) and the small text bugs as plain fixes; exile lines speak only on a change (Q5); a switch freeze until Jacob has played; sort the switches after his game; record his game properly; the B1-B8 assessment after his game; ask before deleting stale branches.

Vote on each split below: pick one option and give one line why. You may change your round-1 view. Under 500 words.

S1. **Timing of plain bug fixes.** (a) Merge to main tonight, after tagging the frozen commit, so Jacob's save still replays on the frozen code. (b) Wait until after his game, so his notes and the fixes go together.
S2. **Coin and levy once the rich are Rebellious (Q2).** (a) No rule change; add a visible reason line, since Rebellious rich already back plots (src/core/ai.ts ~352-357). (b) A switch, off by default; if so, which cost: "anger overflows" (fury points, then the rich act), "the purse runs dry" (each levy yields less; Aristotle Pol. 1313b), or a warning line only.
S3. **Purges pay (Q3).** (a) Recut the data first (survival from season 12 by executions so far, to remove survivorship bias), then decide. (b) Offer a switch now; if so, which: "the cast refills" (sons, kin, new captain, invented), "terror has a price" (fear lowers every faction after the third), or "late, outside cost" (exiles abroad press Rhegium/Carthage; Theodorus' speech draws on your record, 14.65).
S4. **Vary the opening (Q4).** (a) Yes after his first game, by seed, keeping the sourced grudge. (b) Only if Jacob says the opening bored him.
S5. **Carthage's yearly anger tick** (src/core/season.ts ~70, clock starts at 2, war at 6-8: war is nearly built in). (a) A switch: Syracuse's own acts drive Carthage's anger, tick halved or dropped. (b) Count first, no switch yet. (c) No change.
S6. **Patron's petitions.** (a) A switch "favours wear thin". (b) No change until Jacob's play shows the habit.
S7. **Story chronicle as the main view, log as the fold.** (a) Recommend to Jacob after his game. (b) Leave it; his game shows which he read.
S8. **A danger check for the preset** (careful bot survives 92%, killed 1%, 0.1 strikes a game on the preset). (a) Report it to Jacob with his test, no tuning. (b) Don't mention it before he plays (it could prime him).
S9. **Text-variety work after his game** (2-4 wordings per repeated line, chosen by a hash of seed and season so no dice change; move hard-coded lines into data/; first/again/long-running variants). (a) First thread after his game. (b) After the bug fixes, but behind anything his game raises.
