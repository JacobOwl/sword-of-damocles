# Great works (switch "greatWorks"): 100-seed runs, on and off

Thread 23, 2026-11-23. Bet B4 of `docs/council/2026-11-23-two-day-plan.md`. Counts only; nothing was tuned toward a target.
Rerun: `npm run sim -- --seeds 100 --scenario island --switch-sweep --bots careful,patron,tyrant,careless --sets none,greatWorks --markdown` (and `--scenario citadel`).

**Crashes and broken states: 0** in every run (both scenarios, four bots, 100 seeds each, on and off). The merge check (`npm run sim -- --seeds 100`, simple bot) is unchanged, because the simple bot never builds and the switch is off by default.

## How much gets built (100 seeds each)

| Scenario, bot | Works begun | Finished | Wall | Arms | Fleet | Seasons the men downed tools |
|---|---|---|---|---|---|---|
| Island, careful | 63 | 57 | 44 | 11 | 2 | 26 |
| Island, patron | 71 | 64 | 39 | 19 | 6 | 32 |
| Island, tyrant | 7 | 6 | 4 | 2 | 0 | 4 |
| Island, careless | 94 | 4 | 1 | 3 | 0 | 592 |
| Citadel, careful | 78 | 74 | 53 | 17 | 4 | 12 |
| Citadel, patron | 32 | 29 | 20 | 8 | 1 | 8 |
| Citadel, tyrant | 11 | 10 | 7 | 3 | 0 | 16 |
| Citadel, careless | 71 | 0 | 0 | 0 | 0 | 395 |

On the First island test setup with the switch added (careful bot), 61 of 100 games finish at least one work, 33 of them inside the first ten seasons; the median first work is done in season 8.

## Endings, off against on (island)

| Bot | Full decade | Killed | Exiled | Deposed |
|---|---|---|---|---|
| Careful | 66% / 64% | 17% / 13% | 13% / 18% | 4% / 5% |
| Patron | 61% / 57% | 9% / 11% | 10% / 10% | 20% / 22% |
| Tyrant | 6% / 6% | 45% / 48% | 46% / 44% | 3% / 2% |
| Careless | 0% / 2% | 57% / 36% | 30% / 48% | 13% / 14% |

Citadel: careful 70% / 71% full decade, patron 35% / 43%, tyrant 5% / 3%, careless 0% / 0%.

## Broken or odd (found, not tuned)

- **The fleet is rarely built** (2 to 6 games in 100): the bots build in Diodorus' order and few reigns get to the third work. A person may well start with it.
- **The careless bot begins works and starves them.** It picks actions at random, so it begins works it can't pay for; 592 seasons of downed tools in 100 games. It is a floor, not a player, but it shows that an unpaid work nags every season until halted.
- **The tyrant bot almost never builds**: it rarely has 8 silver to spare.
- Killed and exiled shares move a few points for the careful bot, inside what 100 seeds can tell apart. No pattern is claimed.
- The fleet's interception bonus is not built (see `docs/handoff.md`), so for now the fleet gives only grain and Carthage's anger.
