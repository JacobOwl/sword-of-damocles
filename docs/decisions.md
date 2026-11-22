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

## 2026-11-22 (Phase 0 paper test)

- **The paper test was played in chat.** The first try ran 2 seasons and stopped because rules broke. The second try ran all 10 seasons, from autumn 405 to winter 403/402. The write-up, log and dice are in `docs/playtests/2026-11-22-paper-test.md`, and the history used is carded in `docs/research/dionysius-405-403.md`.
- **Rule fixes during the test.** These were made by Claude and accepted by Jacob in play:
  - Grain starts at 8 months, drops 2 a season, and the summer harvest adds 6.
  - Moods can rise.
  - Named people have two traits (+1 or -1 on rolls). This was Jacob's idea.
  - The Carthage clock gains +1 a year (each summer), plus 1 for a riot, street fighting or an attack on Carthage's towns.
  - Why: each old rule produced a broken result. There was a riot in season 2, moods only ever fell, and an invasion came by season 8 in every game.
- **Direction: video game, not a board game.** Why: this is Jacob's call after the test. The hidden plots and per-person bookkeeping need a computer.
- **Freeform orders are out.** The player chooses from a fixed menu of defined actions, in the style of CK3's character interactions, each with a cost, a target, odds and set results. Why: Jacob disliked that the test was "basically just RPing and making up actions".
- **Factions get a power rating that shifts over time.** Factions can become marginal or influential, driven partly by the player's actions and partly by their own. Why: in the test, faction strength never changed.
- **Factions and major characters pursue their own agendas.** These are multi-season schemes that advance whether or not the player acts. Why: in the test the factions only reacted.
- **Rivals grow out of play, in the spirit of a nemesis system.** Survivors of the player's actions become named rivals with new traits and rank, and they remember. Why: Jacob liked most that plots formed from his own actions. Note: Warner Bros. holds a US patent on parts of its Nemesis system. That doesn't matter for a private hobby game, but our rules should be our own design.
- **Next:** v2 rules (the action menu, faction power, agendas and rivals), a short re-test of 3 or 4 seasons, then `docs/rulebook.md`. Phase 0 is still in progress, even though CLAUDE.md and `scope.md` say Phase 1. Fix that wording when the rulebook lands.

## 2026-11-22 (prototype of rules v2)

- **Built a playable browser prototype** of rules v2 instead of another chat test. Why: Jacob asked for something beyond messaging, and the v2 rules are concrete enough to run as code. Play it at https://claude.ai/artifact/8KqQzj6x3QrXRjQKzVZNK4 or build it with `npm run build`.
- **Both kinds of rival are in the engine:** enemies (wounds) and political rivals (ambition), per Jacob's change to the v2 rivals section. Rival origins and types are data, so new kinds can be added without new code paths.
- **Defaults chosen where v2 was silent** are listed in `docs/handoff.md`. They are invention and Jacob's to overrule. The two with the most effect: faction power drifts 1 toward 5 when nothing moves it, and a failed law gives no one power.
- **Finding, not tuned:** with a simple bot player, no game lasts the decade (average 8.4 seasons). Plots grow to strength 10 to 17. Left for Jacob's playtest before any tuning, so the history isn't scripted.

## 2026-11-22 (the sourced cast)

- **The cast is data in the engine's format.** The engine thread owns field names and the engine; the cast thread owns the content. Why: two threads were writing the same files, and one format avoids an adapter.
- **History records carry their quotes.** Each fact has the quote, the citation and the saved file in the Phoenician-Punic World repo, and a script checks every quote. Why: confident errors are the worst failure, and a quote can be checked.
- **Game numbers are invention even on history records.** Traits, ambitions, opinions, wants, rival types and starting offices are listed under each record's `invented`. Why: the sources give character, not dice.
- **People who appear later have an `enters` season** (Doris about 398; Biton and Archylus about 397). The dead stay in the data as anchors for grudges.
- **Disagreements are shown, not settled:** the first wife's death (Diodorus or Plutarch), the sister's husband (Polyxenus or Hermocrates), and whether Aretes is Aristus.
- **Invented people are in Phase 1** (Jacob, 2026-11-22). Real people are preferred, but the game will need many invented ones, as in CK3. Each person keeps its `history` or `invention` tag, and later the UI shows a small note such as "real person". `scope.md` moved "invented people" from Out to In. Consequences: the invented guard captain and the brother of Demarchus stay, and the citizens get an invented spokesman, Damon the smith, since the sources name only Nicoteles.
- **The guard is led by Aristotle the Spartan**, attested as its commander in about 396; the invented captain serves under him.

## 2026-11-22 (research on political games)

- **Wrote `docs/game-research.md`**, a ranked, report-only list of what to borrow from other political and story games, what to avoid and what v2 is missing. Why: Jacob asked for substantial work while away, and the coordinator asked for this research. Nothing is decided; Jacob picks.
- **Every claim about another game is marked** as opened this session (with the link) or as general knowledge. Why: confident errors are the worst failure.
- **The nemesis patent note stands as before** (a private hobby game is unaffected). The note adds that "waiting in the wings" is the part of v2 closest to the patent's described behaviour, in case the game is ever published.

