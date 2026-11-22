# Handoff

The thread that finishes a session writes this, not Jacob. Rewrite it at the end of every session.

## Built by the balance thread (2026-11-22)
- **Balance packages** in `data/tuning.json`: the plot, defense and political-rival numbers in one place. **Standard** (rules v2 as built) is still the default; a test checks it plays byte for byte as before. Three options: **Slow fuse**, **Fair fight**, **Reap what you sow**. The start screen has a Balance menu with a one-line summary of each; the save and the footer remember which one a game uses. The UI's "strength 6" and "within 3" lines now read the package.
- **Four new headless players** in `src/core/bots.ts`: careful, patron, iron hand (id `tyrant`), careless (random). They see only what the screen shows you and use their own random stream, so their games replay from inputs like yours. The simple bot is unchanged.
- **`npm run sim`** now takes `--bot`, `--tuning`, `--sweep` (every player against every package), `--markdown` and `--json`. New story counts: seasons of warning before a strike, whether you knew the leader, the odds of the blow, near coin flips, plots broken, who ended your rule.
- **The report:** `docs/playtests/2026-11-22-balance-sweep.md` (1,000 seeds per player and package, the comparison, a recommendation and five problems found).
- `tests/balance.test.ts`: default and unknown packages, the standard digest, knob names, replay under every package, 40 games for every player under every package with no broken state.

## Built
- **Research note on political games** (`docs/game-research.md`, 2026-11-22): what CK3, the nemesis games, King of Dragon Pass, Six Ages, Suzerain, RimWorld, Republic: The Revolution, Twilight Imperium, Republic of Rome and others do well and badly, with 13 ranked proposals for this game (top five starred), traps to avoid, what v2 is missing, and a note on the Warner Bros. nemesis patent. Report only; nothing in it is built.
- **A playable browser prototype of rules v2.** `npm run build` writes one self-contained page, `ui/dist/index.html`. The same page is published for Jacob as an Artifact: https://claude.ai/artifact/8KqQzj6x3QrXRjQKzVZNK4
- **The engine** (`src/core/`, no UI imports, runs headless). One seeded random stream; a game replays exactly from its seed and your inputs. The season runs world, people, factions, you, power, sword, chronicle. Every change goes through `ops.ts`, which writes it to one log with its reason. The chronicle reads that log.
- **The menu:** all 27 v2 actions, the 4 scheming actions (used by the computer's people), plus Pay the guard's arrears and the three leverage actions (Force a favor, Block, Expose). Every roll shows its target number and every modifier before you commit, with the chance.
- **Faction power 0 to 10** with Marginal, Active and Dominant bands; moods; goals; the five faction agendas plus Philistus' and Kingmakers.
- **Enemies** (scars, ranks to Nemesis, memory, blood feud, the cap of 3, waiting in the wings) and **political rivals** (influence, types, ranks to Pretender, the agenda Take his place, which can depose you without killing you; cap of 2). Rival origins and types are data in `data/rivals.json`, so new kinds can be added.
- **Plots and the sword** with the three warnings, strike rules and the failed-plot exposure.
- **Content in `data/`:** factions, people, offices, traits, actions, agendas, laws, places, warnings, rivals, start. Every record carries `kind`; history records carry a source and a card.
- **Checks:** `npm test` (10 tests: determinism, replay, step order, odds shown, every change has a reason, no ids shown to players, 100 headless games with no broken state, content validation). `npm run sim -- --seeds 100` prints the summary.
- **Designer view** in the UI shows the hidden moves (plots forming, recruits, secret rolls) for playtesting.

## Built by the cast thread (PR #2)
- `data/people.json`: 24 people. 21 can act: 17 real people (Dionysius, his brothers Leptines and Thearides, his sister Theste and her husband Polyxenus, Heloris, Andron, Doris, Hipparinus, Philistus, Aristomache, Theodorus, Nicoteles, Aristotle the Spartan, Doricus, Biton, Archylus), plus four invented people or unnamed roles: the leader at Aetna, the brother of Demarchus, a guard captain and Damon the smith. 3 are dead at the start and kept as anchors for grudges (the first wife, Daphnaeus, Demarchus). Each history record carries its facts with a quote, a citation and the saved file it came from, and lists which fields are invention.
- Doris enters in summer 398; Biton and Archylus in summer 397.
- `data/factions.json`: sourced facts on each faction. Starting leaders: Nicoteles, Hipparinus, Aristotle the Spartan, Leptines.
- `data/outside.json`: Carthage, Sparta, the nearby cities and the Italian Greeks, with their named men. Pressure and chronicle names only.
- `docs/research/cast-405-395.md`: the card behind all of it, with dates as ranges and disagreements shown.
- `tests/cast.test.ts` (shape, kin, offices, scars, no code ids in names, roles or grudges) and `scripts/verify-cast-quotes.mjs` (`node scripts/verify-cast-quotes.mjs ../phoenician-punic-world`; 75 of 75 quotes found).
- Corrected `docs/research/dionysius-405-403.md`: Philistus' marriage to Leptines' daughter is in Plutarch, *Dion* 11 (no date).
- 100 seeds with the new cast: average 9.8 seasons (was 8.4); killed 29, exiled 41, deposed 29, survived 1; tyrannies 1; plots 3.71 a game, 70 blows landed of 79 strikes; enemies 1.67, political rivals 2.60, Pretenders 0.46, Nemeses 0.11 a game; factions Dominant 2.09 a game, Marginal 0.04. No crashes, no broken states. Still lopsided against the bot; not tuned.

## Changed
- `data/events/` removed (no events yet; content is in the other data files). `tests/smoke.test.ts` replaced by real tests.
- `tsconfig.json` now checks `scripts/` and `ui/` too and reads JSON. `esbuild` added as a dev dependency for the UI build.

## Broke
- Nothing new broke: no crash or broken state in 20,000 balance games (1,000 seeds x 5 players x 4 packages).
- **The balance finding, corrected:** the old "1 survivor in 100" was mostly the simple bot. Under standard rules a careful bot survives the decade in 52% of games, a patron 34%, an iron hand 7%, a careless one 0%. Standard's problem is shape: blows land about 90% of the time and deaths bunch in years 2 and 3. Full tables in the sweep report.
- Found by the sweep, not fixed (rules questions): Nicoteles and the citizens' assembly end most reigns once plots are slower; long reigns repeat (the same man becomes your enemy 5 or 6 times in a decade); political rivals flicker on and off (9 to 15 a game for careful players); Carthage takes the city in 5 to 8% of patron games; Nemeses almost never appear.
- Seen while reading seed 7 for the research note (not fixed, not checked further): Theodorus is exiled in autumn 403, then "Your guards take Theodorus" and he is exiled again in autumn and winter 402. Exiled people may be getting taken again from outside the walls. The Watch result reads "Theodorus is in a plot against you, led by Theodorus" when he leads it himself.
- Nothing crashes, and no broken state in 100 seeds. **But the headless results are lopsided.** Latest 100-seed run with the simple bot player:
  - Average game: 8.4 seasons of 40. Endings: killed 26, exiled 36, deposed by a political rival 38. No bot game survived the decade.
  - Plots: 3.4 a game; 65 strikes, 62 landed, 3 failed.
  - Tyrannies set up: 1 in 100 (the bot rarely saves for the citadel).
  - Enemies 2.2 a game, political rivals 2.7, Pretenders 0.7, Nemeses 0.1.
  - Factions turning Dominant: 2.3 a game; Marginal: 0.02.
  - The bot is a weak player (it refuses most petitions and is careless with silver), so a human may do much better. This needs Jacob's playtest before any tuning.
- Where the strength comes from, in traced games: office holders weigh 3 each in a plot, two backing factions at power 7 to 10 add 2 to 3 each, and an unpaid guard sells itself (+3 to the plot, and its 3 leaves your defense). Plots reach 10 to 17 against a defense of 6 to 10.

## Defaults I chose where v2 was silent (all invention, all Jacob's to change)
- Faction power is a base plus 1 for each office its members hold (so "+1 per office, counted every season" doesn't snowball). Stripping an office costs that +1; there's no second -1.
- **Power drift:** at the power step, a faction whose power did not change that season moves 1 toward 5. Without it every faction ran to 10 within a few seasons.
- A failed law changes no power (v2 only gives power to the winners of a passed vote) and can't be proposed again that season.
- The treasury holder pays the guard: you, or a holder whose opinion of you is +1 or better. Anyone else withholds it.
- Petitions left unanswered at the end of the season count as refused. Refusing the guard's citizenship demand doesn't lower their mood; their agenda handles it (Kingmakers).
- Plots target only you. Only the plot leader recruits. A plot strikes when its strength plus 4 beats your defense, or after two seasons at Named (three for a Patient leader).
- Carthage at 10: a landing roll (die plus guard, +2 walls, +1 if you command the army) against 9. Win and the clock drops to 5. Lose and the city is besieged; a second loss ends the game.
- Political rivals: your influence uses the faction with the best mood (Uneasy or better) as "the faction that backs you most". Rank 2 needs 2 offices or leverage over you; rank 3 needs influence equal to yours. Expose costs a rival 2 influence and a rank but doesn't make him an enemy.
- Marriage needs a free relative (you or Thearides) and a house with an unmarried daughter, so it is rare (only Hipparinus' house has one at the start).
- The 4 scheming actions are for the computer's people only.

## Questions for the next design session
- **Pick a balance package** (or keep Standard): play one game each of Standard and Reap what you sow. The sweep report recommends Reap what you sow to test first; Slow fuse if that feels too easy. Fair fight makes most strikes coin flips. Once you pick, the default is one line in `data/tuning.json`.
- **Nicoteles' road to power** dominates the endings in the softer packages: the citizens' agenda gives him the generalship, and two offices make him a Pretender. Change it (rival influence 2 per office against your 1; the generalship going to the assembly rather than its leader; Pretenders needing a second faction), or keep it as the city's main political threat?
- **Repetition in long reigns** (research ★5): should a refused man escalate (ask, demand, act) instead of cycling enemy, pardon, enemy?
- Read `docs/game-research.md` and pick which proposals, if any, to try. The top five: warnings built from what the real plotters did; a chronicle grouped by storyline; plots with a method and a moment so they are less all-or-nothing; a council of your people who argue each decision; people who escalate instead of repeating the same petition.
- Play the prototype for 10 seasons. Does it produce a story you would retell? Where did it feel unfair or dull?
- Are plots too strong? Knobs to consider, each a rules choice for you: office holders weigh 2 instead of 3; faction backing adds power divided by 4; Named plots strike only two seasons after Named; a Watch on a member always reveals the whole plot.
- Is influence "within 3 of yours" too loose? At the start your influence is 4, so anyone with 1 influence qualifies.
- Is the drift toward 5 the right fix for runaway faction power, or should agenda steps stop adding power?
- The open questions in rules v2 still stand (three actions, steady income, conquest, the absent-holder rule, rival caps, dinners).
- **Cast questions.** Who married Dionysius' sister: Diodorus and Plutarch say Polyxenus, Polyaenus a Hermocrates (the data follows the first two and shows the disagreement). Theodorus is attested only in about 396 but is in from the start, so the rich families have a voice for liberty: keep? Damon the smith is invented to speak for the citizens after Nicoteles: rename or cut?
