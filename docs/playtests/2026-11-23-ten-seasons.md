# Ten seasons of the first island test: the story read (thread 19, 2026-11-23)

Rerun: `npm run story-sweep -- --seeds 20` (writes `docs/playtests/ten-seasons/seed-NNN.md`, one per seed: the turning points, then the chronicle as the player reads it). Counts for seasons 1 to 10 only: `npm run sim -- --seeds 100 --preset firstIslandTest --bot careful --upto 10`.

The careful bot is a cautious stand-in for a player. It is not Jacob: it arrests suspects early, avoids bad battles, and only goes campaigning in peacetime from season 6 with money and grain in hand. Read every number below as "what happens to a cautious player", not as the game's verdict.

## Before and after the early-decade events (careful bot, 100 seeds, seasons 1 to 10)

The map was nearly silent in seasons 1 to 10: Carthage spends them rebuilding, which matches the sources (the war starts in 398), and every island event needed a war or an army in the field. Three sourced events now fire in peacetime, as conditions, not dates (Diodorus 14.14 to 14.15: Catana's general offers the gate; the herald before Leontini; the would-be tyrant of Enna).

| Seasons 1 to 10, a game | Before | After |
|---|---|---|
| Island events | 0.44 | 2.70 |
| Towns taken by you | 0.15 | 0.32 |
| Allies won by embassy | 0.01 | 0.95 |
| Towns going over to you | 0.07 | 0.09 |
| Wars with Carthage | 0.13 | 0.24 |
| Sieges | 0 | 0.05 |
| Battles | 0.02 | 0.05 |
| Plot strikes | 0.02 | 0.02 |
| Crashes, broken states | 0, 0 | 0, 0 |

The iron-hand bot (tyrant) never fields an army in seasons 1 to 10, so its map stays empty (1.8 island events, no towns). Full forty-season games with the preset, 100 seeds each, five bots: 0 crashes, 0 broken states.

## Twenty seeds read (careful bot, seasons 1 to 10)

Would retell (7): seeds 2, 5, 10, 11, 12, 15, 19. Flat (13): 1, 3, 4, 6, 7, 8, 9, 13, 14, 16, 17, 18, 20.

- **2, would retell:** Nicoteles turns from a champion of the citizens into a Pretender, joins a plot and slips your guards.
- **5, would retell:** Catana becomes an ally, Gela and Acragas open their gates, Carthage declares war, and your army wins at Acragas.
- **10, would retell:** Nicoteles again: humiliated, then a Pretender, then in the Aetna exiles' plot.
- **11, would retell:** Acragas opens its gates, and Carthage declares war the next season.
- **12, would retell:** Hipparinus, humiliated, escapes your guards, becomes your Nemesis, and his plot wounds you. Then Gela, then war.
- **15, would retell:** the exiles' leader plots, escapes, and an informer names everyone; you take Hipparinus and Nicoteles.
- **19, would retell:** two plots grow into one, the blow wounds you, and every plotter is named.
- **The flat thirteen:** the same opening (below), one town won by the general's offer, one or two rivals arrested, and nothing that comes back.

## What fails, ranked (each links to seeds)

1. **Every game opens the same way.** Leptines (Heir) and Hipparinus (Climber) become political rivals in autumn 405 in 15 of 20 seeds; Hipparinus is "Humiliated" into an enemy in 16 of 20; the brother of Demarchus's grudge opens most plots. Across seeds it is one script reshuffled (compare 3, 4, 9). For one sitting this matters less than it seems, but it is the first thing a second game would show. Not tuned: reported for Jacob.
2. **Arrests end stories instead of starting them.** "Your guards take X" is where most threads stop (1, 3, 4, 9, 14). A prisoner does nothing in ten seasons. In seed 20 Hipparinus leads a plot after his arrest, which reads as a contradiction unless the release is shown.
3. **Plots rarely reach the blow.** Under Reap what you sow, 0.02 strikes a game in ten seasons for the careful bot (2 in 100). Warnings are the sword's whole presence for a cautious player. Not tuned (reaching a target would script it), reported.
4. **The map's early life is one event deep.** The general's offer wins one ally in most seeds, then the map is quiet until the bot musters (season 6 or later). Jacob will likely muster sooner, so the herald and Enna events will fire more for him than for the bot.
5. **The chronicle repeats and lists.** Carthage's trade and shipbuilding lines repeat in the same words every season; deaths of strangers from the families crowd it; numbers in brackets ("+2 silver to Carthage's treasury", "power 10"); event answers read "A fever. You choose: Leave it to the gods." Stream 4 fixes these next.
6. **Fixed here:** the informer's line began "He is in a plot..." with no name (seed 15); court matters stayed open after Carthage stormed Syracuse.

## Not changed
No numbers were tuned. Carthage still loses no army without "Beaten armies can break" (on in the preset). The bots still never sack a city in seasons 1 to 10, so the fear rule stays untested by the sweep.
