# Decisions

Dated log: decision, why. Newest at the bottom. If a chat and this file disagree, this file wins.

## 2026-11-21 (design session)

- Build an original game rather than an Old World mod. Why: owning the engine avoids fighting someone else's code.
- Systemic factions that act on their own, not a Reigns-style card game.
- The power objects (citadel, treasury, mint, fleet, generalship, assembly) decide the government.
- TypeScript core separate from the UI. Priority-list faction bots with visible goals, moods and reasons.
- Phase 1 is "The Citadel" (Syracuse, 405 to 395 BC). Carthage appears as a pressure clock. Cut for now: city map, mercenary market, invented people, generations, coin art, board game.
- A fully simulated Carthage is the centerpiece of Phase 2.
- Art direction is the museum-catalogue look, matching The Phoenician-Punic World.

## 2026-11-22 (repo setup)

- The repo is the single source of truth. Design and build live together in one Claude Code Project, not two rooms, so there is no copy-paste handoff. Why: the website project showed things said only in chat get lost.
- Smallest Phase 1, tighter than first drafted: four factions, six power objects, about 15 people, plots and the sword check, plain-text chronicle. Why: if ten seasons of that are not fun, the rest is not worth building.
- Season steps are fixed; every change goes through one logged action list; content is data. Why: these are where simulations get fragile.
- Calibration against history is a sanity check, not a fit. Count tyrannies, seizures and invasions over 1,000 seeds and look for broken results.
- Added `docs/scope.md` (in and out of the phase) and `docs/later.md` (parking list) as the drift guard.
- Every merge needs the tests plus a 100-seed headless run; content files need a history or invention tag.
- No project-knowledge copies of the docs: sessions read the repo directly so nothing goes stale.
- Parked: Feeding an Army (supply ideas return in Phase 2), Old World mod (dropped), Bo'saal sim (may reuse the engine later). Carthage Expertise stays the home for book research.
- Overall risk named: bland history. The test is whether ten seasons produce a story worth retelling.
