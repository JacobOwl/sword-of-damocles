# Phase 2, "The Island": plan

Status: draft by the Phase 2 thread (10), 2026-11-22. Every rule and number here is invention and Jacob's to change. Facts from the sources are carded in `docs/research/island-405-395.md`.

## The idea in one paragraph

You are still Dionysius in Syracuse, and the court game of Phase 1 is unchanged. Around it there is now an island: eight cities and a fortress, some free, some paying tribute to Carthage, two of them Carthage's own. Carthage is no longer a clock. It is a second city run by a council whose blocs want different things, whose generals have names, and which acts every season from a fixed menu, as your factions do. War is a thing armies do on the map: they march, eat, forage, besiege and fight. What happens abroad feeds the court (a lost army makes the guard restless; a sacked city enriches the treasury and frightens its neighbours; Carthage's silver finds the men who hate you).

## How it is switched

A game has a **scenario**: `island` (Phase 2, the default in the browser game once slice 2 lands) or `citadel` (Phase 1, exactly as before). The citadel scenario must replay byte for byte as it does now; a test pins it. Island code never runs in a citadel game.

## Milestones

Each one ends playable, with the checks passing, merged, and the browser game republished.

1. **The map and the cities.** `data/island.json`: 8 cities and the fortress at Aetna, routes by road and sea with their length in days, each city's side, walls, grain, men and lean. A map view in the browser game. Each season the cities harvest, tributaries pay Carthage, your allies send you a little silver and men. The Carthage clock becomes Carthage's anger (the same number, renamed, so every Phase 1 action that raised or lowered the clock still works).
2. **Carthage simulated.** `data/carthage.json`: four blocs with power 0 to 10 and moods, the council's goal, Carthage's people, its stores (silver, mercenaries, levies, ships), and its action menu with a priority list for each goal. Two acts a season, each logged with its reason ("the Elders fear for the tribute"). The council votes on war and peace by bloc power, as your assembly does. Carthage can send silver to your enemies (backing a plot), raise armies, demand terms and, in war, send an army to Sicily.
3. **Armies with supply.** Armies on the map, yours and Carthage's, with the same rules: march (days along routes, up to a season's marching), food carried in months, eaten each season, refilled in friendly cities, foraged in enemy country (which hurts that city); hunger costs men. Sieges: each season the besieger rolls against the walls, the town's grain runs down, and a hungry, crowded camp in summer risks plague. Battles: one roll each side, every modifier shown, the loser retreats or breaks. Your army is commanded by whoever holds the generalship; you give it orders only if that is you.
4. **Cities that change sides.** Embassies, fear after a sack (the Leontines "reflecting on the fate of the Naxians and Catanians", Diodorus 14.15.4), revolts when an army is near, and the Sikels and the free cities going over to the stronger side (14.58.1). Sacking a city frightens its neighbours and makes them hate you; sparing it does neither.
5. **The test pass.** Bots that use the war actions, a 100-seed island summary (wars, sieges, cities taken, armies lost, Carthage's goals, plus the Phase 1 counts), a read of ten seasons from several seeds, a three-lens review, then Jacob's playtest. Fix what stops ten seasons from making a story before adding anything.

## What carries over unchanged

Factions, offices, people, plots, rivals, events, balance packages and the switches from thread 09. In the island scenario the old "Raid" and "March on" actions are replaced by the army actions, because they were single rolls standing in for a map.

## Open questions for Jacob (also in `docs/handoff.md`)

- Keep the decade 405 to 395, or start nearer the war (say 399) so the island test reaches the fighting sooner?
- Should Carthage's own politics be visible in full (its blocs, moods and goal), or only what your spies and envoys learn?
- Should a beaten Carthaginian general face the council's judgment (Himilcon's end, Diodorus 14.76.4, was his own sentence)?
- How much of the war should you be able to hand to a general you don't fully trust?
