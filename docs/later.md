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
- [Moved into scope as a scenario, Jacob 2026-11-23] Playing on as an exile who plots a return. Also from Jacob's pitch doc.
- [Phase 1?] Let the player use the scheming actions too (start a plot against a rival, lend). Rules v2 says they are open to anyone; the prototype gives them to the computer's people only.
- [Phase 1?] Events drawn from the cast's sourced stories, as data: Andron tempted to seize the citadel and treasury (Polyaenus 5.2.4), Theste's answer when her husband fled (Plutarch, *Dion* 21), the charge that Doris' mother drugged Aristomache (Plutarch, *Dion* 3), Theodorus' liberty speech and the Spartan veto (Diodorus 14.64 to 14.70). Parked by the cast thread, 2026-11-22.
- [Phase 1?] A smarter headless player for `npm run sim`, so the counts reflect a careful ruler and not a careless one.
- [Phase 1?] The 13 proposals in `docs/game-research.md` (clue-based warnings, storyline chronicle, plot methods and moments, a council, escalating petitions, secrets from deeds, tradeable promises, pacing, storylets, a shared danger, stress, and more). Parked for Jacob to pick, 2026-11-22.
- [Phase 1?] A `gender` (or pronoun) field in `data/people.json`, so the engine's sentences and the UI stop guessing. Parked by the interface thread, 2026-11-22.
- [Phase 1?] Group each season of the chronicle by storyline (one plot, one rival, one faction) and lead with the cause, as the research note proposes. The UI chronicle is ready for it once log entries carry a storyline tag. Parked by the interface thread, 2026-11-22.
- [Phase 1?] Named relationship bonds (friend, sworn enemy) shown on the character sheet, if the engine gets them. Parked by the interface thread, 2026-11-22.

- [Phase 1?] Make Nemeses reachable. Under every balance package they appear under 0.1 times a game, because rank 4 needs four rank-ups. Found by the balance sweep, 2026-11-22.
- [Phase 1?] Smarter bots for the political actions (Force a favor before votes, Expose to stop Pretenders), so the sweep tests that side of the game too. Balance thread, 2026-11-22.
- [Found 2026-11-22] Cicero, *Tusculan Disputations* 5.57 to 5.63: the Latin is saved (`sources/cicero/tusculan-5-57-63.latin.txt`) and settles it: Damocles was at the court of Dionysius I (`docs/research/damocles.md`). Yonge's English is still not saved; only needed for a public-domain English text. Source-search thread (15).
- [Phase 1?] Events that people other than you answer (a faction leader choosing, by its priority list), so events can happen between the computer's people too. Parked by the events thread, 2026-11-22.
- [Phase 1?] Philoxenus the poet sent to the quarries, and other court stories outside the saved texts. Needs a saved source first. Parked by the events thread, 2026-11-22.
- [Phase 2, Jacob to decide] From the design council (2026-11-22, `docs/council/2026-11-22-design-council.md`, V11), ranked: a "mark this moment" button that tags a moment in play into the replay; a story sweep (prose summaries of each game's two longest storylines for 10 seeds beside the balance sweep); an ambition chosen at the start and judged by the chronicle's last page, no score; one dice stream per system made from the seed (changes the "one seeded RNG" rule; do it in the engine refactor or not at all); disputed numbers from rival historians in the chronicle (Diodorus 14.54.5-6).
- [Moved into scope as a scenario, Jacob 2026-11-23] Losing Syracuse as a turn, not the end: play on as an exile at Aetna or Rhegium and plot a return (design council V11; also in Jacob's pitch doc). Exile records and the `where` field are to be designed so it fits later.
- [Phase 2?] Two playable checkpoints before the full island: the citadel under the first-test preset, then the island against the old Carthage clock (design council, risks).
- [Phase 2?] A switch that raises the army's pay after each victory, to brake a winning ruler (design council, Systems seat; compare Diodorus 14.78.2).
- [Phase 2] One returning exile per city at a time (design council V6). The rest of V6 is built as the switch "One feud record" (thread 09, 2026-11-22); this part needs the island's cities.
- [Phase 2?] Plots with a method and a moment you can counter (research proposal 3). "Blows can miss" is only its smallest version: a narrow blow wounds or costs an office. Parked by thread 09, 2026-11-22.
- [Phase 2?] Set the council's `thread` and `cause` log fields at write time on plot, clue and rival lines, once thread 10's engine refactor adds them, so the story chronicle can group by storyline without matching names in text. Parked by thread 09, 2026-11-22.

- Done (art thread, second round): painted figures in eight event pictures (`ui/figures.ts`).
- Done (art thread, second round): sound (`ui/sound.ts`), off by default.
- Done (art thread, second round): the chronicle names each year as Diodorus does, from `data/calendar.json`.
- [Phase 1?] Fix "1 offices" in the ledger's influence line (plural with one office). Seen by the art thread, 2026-11-22; not fixed, it's outside the art pass.
- [Source to save] Diodorus 14.77.1 to 14.77.3, the Libyan revolt after 396. Not among the saved texts (book14.loeb.txt jumps from 14.76 to 14.77.4). The island's Libyan revolt rule is invention until it is saved. Jacob, could you paste or save it? Parked by the Phase 2 thread, 2026-11-22.
- [Moved into the build as a switch, Jacob 2026-11-23] The design council's "commission" (`docs/council/2026-11-22-design-council.md`): you or a named man lead the army with a purpose, the general by default; if you go, you name a keeper of the citadel whose loyalty enters the sword check; homecoming is a logged step. Jacob to pick. Parked by the Phase 2 thread, 2026-11-22.
- [Phase 2?] A `where` field on every person (court, field, exile, abroad) instead of reusing statuses, per the design council's engineering notes. Needed for the commission.
- [Phase 2?] Character sheets for Carthage's men (Himilcon, Magon, Hanno, Bomilcar) like the Syracusans'.
- [Found 2026-11-22] Diodorus 14.19 to 14.40: the three archon years and every Sicilian line are saved as short quotes (`docs/research/diodorus-401-399.md`). The chapters in full are not saved (the cloud reader gives short quotes only); only needed if a thread wants more than the Sicilian lines. Source-search thread (15).
- [Partly found 2026-11-22] Carthaginian and Phoenician women's names: nine found and quoted (`docs/research/punic-womens-names.md`). Still wanted for a fuller pool: Benz, *Personal Names in the Phoenician and Punic Inscriptions* (1972), or G. Minunno's open-access chapter on names from the Carthage tophet, https://uplopen.com/chapters/e/6346/files/ca64917e-2270-43b9-8d0d-a4b96f4cc07b.pdf (the cloud reader was refused). Jacob, could you save the chapter? Source-search thread (15).
- [Source to save] More Italian Greek names (Rhegium, Locri, Croton, Thurii) and Sikel names. Only four Italian Greek men's names are usable now. Cast-generator thread, 2026-11-22.
- [Phase 4?] At the end of a game, a "what the sources say" page beside your decade (assumptions council, Historian seat, 2026-11-23). Parked 5-0.
- [Phase 2?] The council could speak on events ("Matters before you") too, each man for one choice. Parked by thread 14, 2026-11-22; on 2026-11-23 judged the better story and still parked, to build in its own small thread.
- [Phase 2?] Secrets that pass between people: a Spymaster selling what he knows to another rival, or to Carthage. Parked by thread 14, 2026-11-22.
- [Phase 2?, from the assumptions council round 4, 2026-11-23] Bets proposed but not chosen for the two-day plan: favours as objects (named debts called in, sold or inherited); Carthage's general under his own sword (14.76.4); Root-style asymmetric factions; disputed numbers as ranges that spies narrow (14.54.5-6); a printable reign broadside; secrets that change hands; a Godot spike; a print-and-play board game (Phase 5). Details in `docs/council/2026-11-23-two-day-plan.md`.
