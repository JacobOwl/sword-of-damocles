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

## 2026-11-22 (interface polish, thread 07)

- **Every name opens a character sheet, and the court is its own view.** Why: Jacob wants CK3-style characters whose opinions, rivalries and ties are visible, and the old list hid most of that.
- **The player now sees what shifted and why** (opinion, mood, power, offices, stores), from the same log. Before, these lines showed only in the designer view. Why: a death must never feel random, and the reasons were already logged.
- **The chronicle is rendered from the visible log in the UI**, not by changing the engine's chronicle. It drops dice and turns agenda steps into deeds. Why: other threads are changing the engine; UI and rules stay separate. Grouping by storyline (research note, proposal 2) is not done.
- **Real people carry a small "real person" marker; invented people "invented".** From the cast's `kind` field. Per the decision that real people get a marker.
- **Portraits go through one map, `ui/portraits.ts`.** Placeholders until the mosaic editor or coin photos supply art.
- No rules, data or balance changed. The 100-seed counts are the same as before.

## 2026-11-22 (balance packages and better headless players)

- **Balance numbers moved into data** (`data/tuning.json`) as named packages. Standard stays the default and plays exactly as before. Why: the rules choices are Jacob's, so the alternatives are options, not changes.
- **Three alternative packages: Slow fuse, Fair fight, Reap what you sow.** Each changes only numbers or switches existing rules on, except two small new switches: "quiet seasons after a plot breaks" (research ★8) and "a content faction holds back agendas against you". Both are off in Standard. Why: the coordinator asked for 2 or 3 packages with their survival and story shapes; Jacob hasn't picked any research proposal, so these stay options.
- **Four new headless players** (careful, patron, iron hand, careless) that see only what the player sees. Why: the simple bot made the rules look far harsher than they are (0% against 52% for a careful player under the same rules).
- **Recommendation, not a decision:** playtest Reap what you sow first. Jacob decides.
- **Not tuned to history.** Targets were about play: careless should lose, careful should usually but not always win, each style should have its own typical ending, and a blow should come after warnings.

## 2026-11-22 (events, thread 06)

- **Events are in Phase 1** (Jacob chose this on 2026-11-22). `scope.md` now lists them. Why: the Phase 1 test is whether a decade makes a story worth retelling, and events give the people and the city things to happen to them.
- **Events are data, never code.** Each event in `data/events.json` has a trigger built from game state, the people it needs (by id or by description), text, and two to five defined choices with set effects, costs and, for some, a roll with every modifier shown first. `src/core/events.ts` only reads them. Why: CLAUDE.md rule, and Jacob wants defined CK3-style choices, not improvisation.
- **Events fire at the end of the people step**, at most one a season plus a 35% chance of a second, and no more than three waiting at once. Answering costs no action unless the choice says so. Unanswered events take a choice marked as the default when the season ends. All of this is invention and Jacob's to change (`pacing` in the data file).
- **What Dionysius really did is one choice among several, never forced.** It is marked `history: true` in the data, and sometimes now decided by a roll. Why: tuning to history scripts the history (CLAUDE.md).
- **Follow-ups chain** (a flight leads to Theste's answer, the weddings to a son and then to the charge against the Locrian mother, Theodorus' speech to a promise that comes due).
- **52 events: 33 from the sources, 19 invented.** Every sourced event quotes the saved text it comes from (54 quotes, all found by `scripts/verify-cast-quotes.mjs`) and lists what is invented. Card: `docs/research/events-405-395.md`.
- **Damocles is not used yet**: the passage (Cicero, *Tusculan Disputations* 5.61 to 5.62) is not saved and modern pages disagree which Dionysius it belongs to. Request in `later.md`.

## 2026-11-22 (placeholder portraits)

- **Mosaic portraits are in Phase 1 as placeholders** (Jacob, on a decision card). `scope.md` now lists them as In; real coin photographs stay parked for Phase 4. Why: faces on the character sheets and court cards make plots and rivals easier to follow in playtests, and the change is UI only.
- **The art is made in Jacob's mosaic editor, expanded for the game** (`tools/mosaic-editor.html`, also at https://claude.ai/artifact/Pcu7iE69Dyhk1q2876QFPC). It draws a bust in profile from choices (sex, age, hair, beard, headwear, faction colours) and lays it in tiles. Every look is invention, and the looks file says so; no source describes these faces.
- **One 192 px WebP per person**, tile size 7, transparent outside the coin, in `ui/art/portraits/<person id>.webp`, about 20 KB each. The build inlines them, so the game stays one file. Why: the largest slot is 92 px, and 192 covers it at double density; tile size 7 is the smallest that still reads as tiles at 46 px.
- **Faction colours on the coins are invention:** the ruler and his family on blood red, the rich families on deep sea blue, the citizens on olive, the guard on teal. Jacob's to change.


## 2026-11-22 (Phase 2 becomes the first test target, thread 10)

- **Phase 2, "The Island", is the target of the first real test, not Phase 1** (Jacob: "phase 2 should be the goal as our initial testing stage instead of 1"). Read as: Phase 1 is the foundation, built and kept playable as its own scenario, and Phase 2's content (the island map, a simulated Carthage, armies with supply) is pulled in now. The "ten seasons make a story you would retell" test applies to the island game. Why: Jacob's call; the court game alone has no outside world to push against, and Carthage as a clock is the thinnest part of it.
- **`scope.md` now says Phase 2**, lists what is in and out, and moves the gate to Phase 3. CLAUDE.md's phase line changed to match.
- **The decade stays 405 to 395 BC** (a default, Jacob's to change): it holds the great war of 397 to 396 (Motya, Himilcon's march, the siege and plague at Syracuse), and the cast is built for it.
- **Eight cities and one fortress** (a default): Syracuse, Leontini, Catana, Messana, Gela, Acragas, Motya, Panormus, and Aetna. Selinus, Himera, Camarina, Naxos and the Sikel towns are parked.
- **Phase 1 is a scenario, not deleted.** A game has a scenario, `island` or `citadel`; the citadel game must replay exactly as before.
- **Milestones** are in `docs/phase2-plan.md`: the map and cities, Carthage simulated, armies with supply, cities that change sides, the test pass.
