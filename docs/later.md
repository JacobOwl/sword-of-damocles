# Later (parking list)

New ideas land here, not in the build. Tag each with the phase it might belong to. Jacob decides what moves into `scope.md`.

- [Moved into scope 2026-11-22] Fully simulated Carthage and the island map with armies and supply are now Phase 2 scope (`scope.md`, `docs/phase2-plan.md`).
- [Phase 3] The rest of the island's cities: Selinus, Himera, Camarina, Naxos, Enna and the Sikel towns, Segesta and Eryx.
- [Phase 3] The full Feeding an Army logistics (wagons, baggage, depots), beyond Phase 2's months of food.
- [Phase 3] All 216 years, generations, selectable start dates, full mercenary market (land as pay; Dionysius I gave mercenaries citizenship and land).
- [Phase 3] Other starting characters: demagogue, mercenary captain, rich exile.
- [Phase 4] Legends-style browser for every person, city and war; chronicle in a biased voice (Philistus close to Dionysius, Timaeus hostile to tyrants).
- [Phase 4] Coin-mosaic portraits from real coin photographs, replacing the Phase 1 placeholder portraits (drawn busts laid in tiles, invention).
- [Optional] Board game of the power-object system for Tabletop Simulator.
- [Optional] Calibrating the engine against history over 1,000 seeds, as a sanity check only.
- [Optional] Reuse the engine for an invented world (Bo'saal).
- [Done in Phase 2 by the island map, 2026-11-22] Simple conquest or raids on nearby cities (Leontini, Catana, Naxos, Carthage's tribute towns). In the paper test, the player reached outside the city 3 times in 10 seasons. Phase 1 has no island, so each one was resolved as a single roll.
- [Phase 1?] Dinners as the main stage for drama: who is invited, where they sit, what the wine loosens. This is from Jacob's pitch doc (background only), and it barely came up in the paper test.
- [Phase 3?] Playing on as an exile who plots a return. Also from Jacob's pitch doc.
- [Phase 1?] Let the player use the scheming actions too (start a plot against a rival, lend). Rules v2 says they are open to anyone; the prototype gives them to the computer's people only.
- [Phase 1?] Events drawn from the cast's sourced stories, as data: Andron tempted to seize the citadel and treasury (Polyaenus 5.2.4), Theste's answer when her husband fled (Plutarch, *Dion* 21), the charge that Doris' mother drugged Aristomache (Plutarch, *Dion* 3), Theodorus' liberty speech and the Spartan veto (Diodorus 14.64 to 14.70). Parked by the cast thread, 2026-11-22.
- [Phase 1?] A smarter headless player for `npm run sim`, so the counts reflect a careful ruler and not a careless one.
- [Phase 1?] The 13 proposals in `docs/game-research.md` (clue-based warnings, storyline chronicle, plot methods and moments, a council, escalating petitions, secrets from deeds, tradeable promises, pacing, storylets, a shared danger, stress, and more). Parked for Jacob to pick, 2026-11-22.
- [Phase 1?] A `gender` (or pronoun) field in `data/people.json`, so the engine's sentences and the UI stop guessing. Parked by the interface thread, 2026-11-22.
- [Phase 1?] Group each season of the chronicle by storyline (one plot, one rival, one faction) and lead with the cause, as the research note proposes. The UI chronicle is ready for it once log entries carry a storyline tag. Parked by the interface thread, 2026-11-22.
- [Phase 1?] Named relationship bonds (friend, sworn enemy) shown on the character sheet, if the engine gets them. Parked by the interface thread, 2026-11-22.

- [Phase 1?] Make Nemeses reachable. Under every balance package they appear under 0.1 times a game, because rank 4 needs four rank-ups. Found by the balance sweep, 2026-11-22.
- [Phase 1?] Smarter bots for the political actions (Force a favor before votes, Expose to stop Pretenders), so the sweep tests that side of the game too. Balance thread, 2026-11-22.
- [Source to save] Cicero, *Tusculan Disputations* 5.61 to 5.62, the story of Damocles and the sword. Not among the saved texts, and the cloud could not reach it (https://www.thelatinlibrary.com/cicero/tusc5.shtml was refused). Jacob, could you paste or save an English translation of 5.61 to 5.62? Two saved modern pages disagree about which Dionysius it belongs to, so no event uses it yet. Parked by the events thread, 2026-11-22.
- [Phase 1?] Events that people other than you answer (a faction leader choosing, by its priority list), so events can happen between the computer's people too. Parked by the events thread, 2026-11-22.
- [Phase 1?] Philoxenus the poet sent to the quarries, and other court stories outside the saved texts. Needs a saved source first. Parked by the events thread, 2026-11-22.
- [Phase 2, Jacob to decide] From the design council (2026-11-22, `docs/council/2026-11-22-design-council.md`, V11), ranked: a "mark this moment" button that tags a moment in play into the replay; a story sweep (prose summaries of each game's two longest storylines for 10 seeds beside the balance sweep); an ambition chosen at the start and judged by the chronicle's last page, no score; one dice stream per system made from the seed (changes the "one seeded RNG" rule; do it in the engine refactor or not at all); disputed numbers from rival historians in the chronicle (Diodorus 14.54.5-6).
- [Phase 2 second test?] Losing Syracuse as a turn, not the end: play on as an exile at Aetna or Rhegium and plot a return (design council V11; also in Jacob's pitch doc). Exile records and the `where` field are to be designed so it fits later.
- [Phase 2?] Two playable checkpoints before the full island: the citadel under the first-test preset, then the island against the old Carthage clock (design council, risks).
- [Phase 2?] A switch that raises the army's pay after each victory, to brake a winning ruler (design council, Systems seat; compare Diodorus 14.78.2).
