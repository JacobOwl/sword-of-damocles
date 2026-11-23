# Grain and the sea (switch "convoys"): 100-seed counts

Island scenario, First island test numbers not used (plain `npm run sim -- --seeds 100 --scenario island`), seeds 1 to 100, built on main after PR #55. Counts only; nothing was tuned.

| | careful, off | careful, on | patron, off | patron, on |
|---|---|---|---|---|
| Crashes / broken states | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| Mean seasons ruled (of 40) | 29.6 | 28.2 | 28.7 | 29.3 |
| Survived the decade | 65 | 62 | 54 | 53 |

With the switch on, a game on average (careful; patron):
- Your convoys sent 27.3; 15.0 (mostly grain bought abroad: the careful bot buys a lot).
- Caught by Carthage 2.9; 1.1. Wrecked by winter storms 1.3; 1.6. Held a season by storms 1.4; 1.3.
- Landed short: skimmed by the contractor 4.7; 2.0, spoiled by the sea (an honest loss) 2.6; 1.7. Sold to Carthage 0.6; 0.04.
- Your army fed by sea 2.6; 0.1. Audits 1.9 (cheats caught 1.4); 0.7 (0.5).
- Carthage's convoys 2.1; 2.4, caught by you 0.4; 0.2. Its army fed by sea 0.8; 0.9. Its mercenaries unpaid (pay caught, sunk or missing) 0.5; 0.7.
- Armies hungry after their grain was caught at sea 0.09; 0.11.

What looks odd (report, not fixed):
- The careful bot skims are high (4.7 a game) because it buys grain nearly every season and the rich families are often Angry, which makes every contractor bolder. A human who keeps the rich content, or audits early, sees far fewer.
- Sold convoys are rare except under the careful bot at war with the rich Angry, as intended.
- Armies starved by a catch are rare (about 1 game in 10). The plan asked for it to happen; it does, but seldom, because armies mostly fight inland or near friendly towns.
