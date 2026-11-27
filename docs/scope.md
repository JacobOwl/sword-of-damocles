# Scope

Current phase: **2, "The Island"**, the target of the first real test. Change this file only by a logged decision.

Phase 1, "The Citadel", is the foundation Phase 2 is built on. It stays playable as its own scenario (Syracuse alone, Carthage as a clock), and everything in it carries over. It is no longer a gate. (Jacob, 2026-11-22.)

The milestones for Phase 2 are in `docs/phase2-plan.md`.

## In (Phase 2)

Everything from Phase 1:
- Syracuse, 405 to 395 BC, in seasons. The same decade, because it holds the great war with Carthage of 397 to 396.
- Four factions: common citizens, rich families, the mercenary guard, the ruler's family.
- The six power objects: citadel, treasury, mint, fleet, generalship, assembly. Government form comes out of who holds them. With the contested board (Jacob's pick, 2026-11-26, logged in `docs/decisions.md`): a seventh seat, the captain of the guard, and the command of each city you hold as small seats.
- About 25 people with traits, ambitions, money, relationships and grudges (each grudge has a reason). Real people first, invented people where the sources run out, every person tagged `history` or `invention`.
- Plots and the sword check, with warnings before the blow.
- Events as data (`data/events.json`), with defined choices and set effects.
- A plain-text chronicle, read from the action log.
- Seeded headless runs; 100-seed check before every merge.
- Placeholder mosaic portraits.

New in Phase 2:
- **The island map**: 8 cities (Syracuse, Leontini, Catana, Messana, Gela, Acragas, Motya, Panormus) and the fortress at Aetna, joined by roads and sea lanes. Each city has a side, walls, grain, men under arms and a lean toward Syracuse or Carthage.
- **A simulated Carthage** in place of the clock: a council of blocs with power and moods (the Elders, the Hundred, the people, the Libyan subjects), its own named people (Himilcon, Magon and invented elders), its own stores, and its own fixed action menu worked through a priority list, with a visible goal and a reason for every act. The council votes on war and peace.
- **Armies with supply** as objects on the map: men, months of food, a commander. They march along routes, eat as they go, forage in enemy land, besiege cities (walls, hunger, plague) and fight battles with every modifier shown first.
- **Cities that change sides** by embassy, fear, siege or revolt.
- **Exile and return** (added by Jacob, 2026-11-23): a separate scenario, off by default, on the Workshop page. When you lose Syracuse you flee to Aetna or Rhegium with a few loyal men and your feud records, and plot your way back while someone else rules. The default game and the test preset still end at a fall.
- **A small navy** (added by Jacob for test 5, 2026-11-27: "maybe some navy", then "ok do it" to the test 5 plan): a named fleet each side in squadrons, one order a season (watch, escort, carry, blockade), and one sea-battle scene. Spec: `docs/council/2026-11-27-units-ground-navy.md`, Part 3. No ship types.
- Defined actions only, CK3-style. No freeform orders and no improvised results, for you or for Carthage.

## Out (cut for now)

The full island of about 25 cities, the mercenary market (companies, prices, contracts), naval warfare beyond the small navy above (ship types, wind, many fleets), generations, choosing the start date, other playable characters, playing as Carthage, the Sikel league as a full faction, Italy and Greece as more than names, the city map of Syracuse's districts, coin art (real coin photographs), the history browser, the biased-historian voice, the board game.

## Gate to Phase 3

Ten seasons of the island game produce a story Jacob would retell, and he says go.
