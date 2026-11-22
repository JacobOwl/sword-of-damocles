# Round 1: The Scope and Architecture Skeptic

What I checked (this session, read only): `src/core/types.ts`, `state.ts`, `ops.ts`, `rng.ts`, `season.ts`, the tests. `npm test`: 35 pass in 15 s. `npm run sim -- --seeds 100`: 1.6 s, 0 crashes. A careful-bot decade is about 1,200 log entries and about 280 KB of state. Threads 09 and 10 have pushed nothing yet, so the collision risks below are predictions, not findings.

The engine is in good shape for one city and the wrong shape for eight. `GameState` holds Syracuse's grain, silver, walls, guard, offices and factions at the top level. `FactionId` and `OfficeId` are closed lists of Syracuse's four factions and six offices. Syracuse is not a city in this code; it is the whole world. This matters more than any rules question, because it decides what threads 09 and 10 can change without breaking each other.

## Q1. The first Island slice
**Position.** Keep the same decade (405 to 395) and the same cast and events, and add a map. That reuses everything Phase 1 already tested and limits the experiment to one new thing. The map should have five places, not eight: Syracuse, Leontini, Catana, Naxos, Aetna, plus the Carthaginian west as one province node. Four of these are already records in `data/places.json`, and the conquest is attested: Dionysius was "eager to attach to himself the neighbouring cities of the Chalcidians, namely, Naxos, Catanê, and Leontini" (Diodorus 14.14.1, `sources/diodorus/english/book14-1-18-97-117.loeb.txt`). Growing to 6 to 8 places is a data change once the loop works. The one loop is the three action slots. A march, a siege or an envoy to a city costs the same slot as a Watch or a feast. Every season you choose between the walls of Catana and the men inside your own walls.
**Proposal.** Island season = the citadel season, plus map actions in the same menu, plus one new step, "campaign", between player and power. The step order is fixed by CLAUDE.md, so adding it needs a logged decision.
**Refuse.** A second turn structure (a strategic map turn plus a court turn). That is two games glued together, and it doubles test cost.

## Q2. Simulated Carthage
**Position.** For the first test, Carthage is a priority-list bot with one visible goal, one mood, one treasury and two or three named men. It does not run Syracuse's rules. The rules engine knows only Syracuse's faction ids. Running it for Carthage would mean making factions and offices open lists first (see Q9), and that is a Phase 2b job. Carthage feels like a rival society, not a clock, when you can see its reasons ("the council fears the plague and wants peace") and when its men act on your city (a bribe, an offer, an exile taken in).
**Proposal.** Carthage writes to the same log through `ops.ts`, with actor "carthage" and a visible why. The current clock becomes a fallback inside its bot ("if nothing else, rebuild"), not a separate system.
**Refuse.** Simulating Carthage's own plots and offices in the first slice. The mirror idea needs a second polity in the engine, and that comes after the refactor in Q9.

## Q3. Armies and war
**Position.** The code already has an army: the guard has strength, upkeep, arrears and "for sale". Make armies a list of records shaped like the guard, each with a commander, a location and a paymaster. Mercenaries then come almost free: arrears lead to selling out, and selling out leads to seizing a city. A battle is one roll with every modifier shown, the same roll display the game already uses, plus at most one choice before it (fight, wait, or pay them off). A siege is a counter on a city; `s.sieges` already does this for Aetna.
**Proposal.** The general is the generalship holder. While he is abroad, his plot weight and his faction's backing count for the army, not in the city. While you are abroad, your defense drops by a stated amount.
**Refuse.** Supply chains, terrain and casualty arithmetic in the first slice. They stay parked ("Feeding an Army").

## Q4. The other cities
**Position.** Each city gets a few stores: owner or stance, garrison, walls, loyalty, and a named leader drawn from `data/people`. Cities do not get their own factions yet. How you relate to a city is a short list of verbs on the existing menu: march, besiege, demand terms, install a friend, take in exiles. Exiles who flee to a city change its stance. That is the bridge to Q6.
**Proposal.** A `City` record type now (below), filled thinly for the four outer cities.
**Refuse.** Running the four-faction politics per city before Syracuse fits in a city record.

## Q5. Plots and the sword
**Position.** Test "Reap what you sow" first, as the sweep recommends, together with thread 09's partial-success switch. Don't redesign methods yet. War changes plotting cheaply through the location rule above: a ruler away on campaign is a moment, and plotters already wait for moments.
**Proposal.** A plot's "moment" is the season you march. One rule, testable headless: what share of strikes happen in seasons you are abroad?
**Refuse.** Any new strike rule that is on by default.

## Q6. Rivals and nemeses
**Position.** The repeat problem is a memory problem. A man who is pardoned and refused again should escalate, not reset, and that is thread 09's switch. On the island, exile stops being an ending for a rival and becomes a move: he goes to Aetna or Rhegium and comes back with backers. Where a person is has to be a field for this.
**Proposal.** A new `where` field on each person (a city id), separate from status.
**Refuse.** Reusing status "absent" for "away on campaign". Today "absent" means "has not entered the story yet", and `alive()` treats absent people as not alive. A general put in "absent" would lose his offices to the power step's vacant-office claim.

## Q7. The player's goal
**Position.** That is Jacob's call. Cheapest test: record a stated ambition at the start ("hold the Chalcidian cities", "found a dynasty", "die in bed") and print in the summary whether it was met. Don't score it yet.
**Refuse.** A numeric score that bots can be tuned to.

## Q8. Voices and legibility
**Position.** The storyline chronicle matters most, and it is mostly a data change. Log entries need a storyline tag and a place. With eight places the season feed becomes noise without them.
**Proposal.** Add `place` and `thread` (storyline) fields to `LogEntry` in the same PR as the City record.
**Refuse.** A council of advisors before the island loop works.

## Q9. Architecture and risk
**Position.** Stage it, and let the existing digest test do the policing. The cheapest safe refactor this project will ever get is available now. `tests/balance.test.ts` pins a hash of 20 standard games, so a pure move of code passes only if behaviour is byte-identical.

Staged path:
1. **PR 0, the refactor, no rules change.** Move Syracuse's city-level fields (grain, silver, walls, granary, the guard, offices, factions, citadel built) into `cities.syracuse`. The standard digest must not change. Give `GameState` a `version: 2` and a `scenario` field.
2. **PR 1, the map with no Carthage bot.** Island scenario only: city records, the campaign step, armies shaped like the guard. The citadel scenario must still match its digest, and the island gets its own pinned digest.
3. **PR 2, the Carthage bot**, behind its switch.
4. **Later (Phase 2b): open the faction and office lists**, so another polity can run full rules. This is the mirror idea.

Fragile points found in the code:
- **The drift rule reads English.** `season.ts` decides whether a faction's power moved by searching the whole season log for entries whose text contains " power ". If Carthage logs "Carthage's power...", or anyone rewords a sentence, Syracuse's drift silently changes. It also rescans the log every season, which grows slower as logs grow. Fix: a structured tag on the entry, or a per-faction "moved this season" flag. Do this in PR 0.
- **One random stream shared by everything.** Any island roll shifts every later citadel roll. Rule: island code draws no random numbers in the citadel scenario, checked by the citadel digest.
- **The 100-seed check would pass with no war at all.** No current bot marches. Thread 10 must add a bot that uses the map, and the summary must count battles, sieges and cities that changed hands. If those counts are zero, the check counts as failed.
- **Test cost.** 15 s now. Switches times packages times scenarios times bots grows fast. Test each switch alone in both scenarios, plus all switches on together, but not the full cross product.

**Threads 09 and 10.** The shared hot files are `types.ts`, `season.ts`, `actions.ts`, `ai.ts`, `data/tuning.json`, the digest constant, and `docs/handoff.md`, which both threads are told to "rewrite". Rules:
- 09 merges first. Its switches are off by default, so the digest must not move.
- PR 0 comes next, then 10 rebases onto it.
- Neither thread re-pins the standard digest. A thread that needs to re-pin has changed default behaviour, and must stop and say so.
- 09's switches go in as `tuning.json` knobs. The scenario is a start option, not a package.
- Whichever thread merges second rewrites `docs/handoff.md` by merging, keeping every line of the other thread's section.

## My top 3 foundation questions
1. **Q9:** Does Syracuse become one city record (PR 0) before the island code lands?
2. **Q1:** Is the island loop the same three slots with war actions on the menu, or a separate map turn?
3. **Q3:** Are armies guard-shaped records with commanders and paymasters, so that war feeds plots through who is where?

## The idea nobody else will raise: paired dice for fair comparisons
Today every A/B comparison of a package or switch is noisy. As the sweep says, a game's "dice diverge after the first difference, so compare rates, not single seeds." Give each system its own random stream, all derived from the one game seed: world, people, events, sword and island. The bots already do this (`botRandom(seed)`). Then turning on one switch changes only that switch's dice, and the harvests, fevers and Carthage's moves stay the same. Seed 7 with the switch on and off then shows exactly what the switch did. That makes 100 seeds as informative as 1,000, and Jacob can replay one story both ways. It stays deterministic, but CLAUDE.md says "one seeded RNG", so this is an architecture rule change. It needs Jacob's yes and a logged decision, and it re-pins the digest once, on purpose. That makes it a candidate for PR 0.
