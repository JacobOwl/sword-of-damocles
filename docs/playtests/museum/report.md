# The story museum

Written by `npm run museum` (bet B1). 1200 island games: seeds 1 to 400 for each of the careful ruler, the patron, the iron hand; balance package Reap what you sow; switches clues, partialBlows, storyChronicle, armiesBreak (the "First island test" rules). Plus 400 games of the Dionysius bot, reported separately.

Crashes: 0. Broken states: 0.

The score is a reading aid, not a measure of the game and never a target: each story shape found adds its weight (at most twice a game), each person with a thread of three or more beats adds half a point (up to four), and the dull shapes subtract. The shapes and weights are in `data/story-shapes.json`, all invention.

## How the games scored

| Player | Games | Score: lowest / quarter / median / three quarters / highest | First ten seasons, median | A story shape by season 10 | How games ended |
|---|---|---|---|---|---|
| the careful ruler | 400 | -1 / 6 / 8 / 11 / 19 | 3 | 75% | survived 92%, deposed 4%, killed 3%, exiled 2%, fallen under 1% |
| the patron | 400 | -2 / 4 / 7 / 9 / 16 | 0 | 42% | survived 76%, deposed 21%, exiled 2%, killed 1% |
| the iron hand | 400 | -0.5 / 5 / 7 / 10 / 19 | 4 | 94% | exiled 36%, killed 32%, survived 21%, deposed 12% |
| Dionysius as Diodorus tells it | 400 | -1.5 / 5 / 6 / 9 / 19 | 2 | 57% | survived 61%, killed 20%, exiled 16%, deposed 3%, fallen under 1% |

## The shapes

| Shape | Weight | Games with it | the careful ruler | the patron | the iron hand | Median season first seen |
|---|---|---|---|---|---|---|
| The friend who turned | 3 | 65% | 84% | 89% | 23% | Spring 402 BC |
| A warned blow, survived | 3 | 5% | 3% | 1% | 11% | Winter 402/401 BC |
| A nemesis | 2 | 15% | 4% | 12% | 28% | Summer 403 BC |
| The enemy who came back | 2 | 23% | 28% | 41% | 1% | Summer 399 BC |
| The city that turned twice | 3 | 2% | 3% | under 1% | 2% | Spring 398 BC |
| Carthage comes | 1 | 78% | 97% | 92% | 46% | Summer 400 BC |
| A battle won in the field | 2 | 7% | 13% | 4% | 3% | Autumn 400 BC |
| A battle lost | 1 | 8% | 16% | 7% | 2% | Autumn 400 BC |
| The city besieged, and holding | 3 | 3% | 3% | 6% | 1% | Autumn 398 BC |
| Plague in the enemy's camp | 2 | 7% | 8% | 9% | 3% | Summer 398 BC |
| Kin against you | 2 | 9% | 12% | 4% | 10% | Autumn 399 BC |
| The man who would rule | 2 | 20% | 12% | 30% | 18% | Winter 403/402 BC |
| Blood for blood | 2 | 26% | 0% | 0% | 77% | Autumn 404 BC |
| The man who told you | 2 | 52% | 77% | 7% | 72% | Winter 403/402 BC |
| The guard for sale | 1 | under 1% | under 1% | 0% | 0% | Spring 402 BC |
| The sword falls, foreseen | 2 | 23% | 4% | 2% | 64% | Summer 401 BC |
| The decade held | 1 | 63% | 92% | 76% | 21% | Summer 395 BC |
| The general home too popular | 3 | 0% | 0% | 0% | 0% | - |
| A blow from nowhere (dull) | -3 | 0% | 0% | 0% | 0% | - |
| The same quarrel again (dull) | -1 | 65% | 95% | 96% | 6% | Autumn 403 BC |
| Quiet years (dull) | -2 | 31% | 45% | 35% | 13% | Spring 398 BC |
| The same words (dull) | -1 | 100% | 100% | 100% | 100% | Summer 395 BC |
| Over too soon (dull) | -1 | 6% | under 1% | 1% | 16% | Spring 403 BC |

## Shapes that never appeared

- **The general home too popular**: A man you sent with the army comes home with the army's love. Needs the switch that lets you send a named man with the army, not yet built.
- **A blow from nowhere**: Your rule ends by a plot with no warning in the four seasons before. The rules promise this never happens.

## The ten best

| Seed | Player | Score | Ten seasons | Title | Ending | Shapes |
|---|---|---|---|---|---|---|
| 117 | the iron hand | 19 | 6 | Kin against you: Leptines | survived, Summer 395 BC | Blood for blood; The man who would rule; The man who told you; The friend who turned ×3; Kin against you ×3; Carthage comes; The decade held; The same words |
| 146 | the iron hand | 19 | 2 | The city that turned twice: Catana | survived, Summer 395 BC | Blood for blood; The man who told you; The friend who turned ×2; Carthage comes; The city that turned twice; A battle lost; A battle won in the field; The decade held; The same words |
| 210 | the iron hand | 19 | 4 | Kin against you: Andron | survived, Summer 395 BC | Blood for blood; The man who would rule; Carthage comes; The man who told you; The friend who turned ×2; A nemesis; Kin against you; The decade held; The same words |
| 248 | the careful ruler | 19 | 2 | A warned blow, survived | exiled, Autumn 397 BC | The man who told you; The same quarrel again ×2; Carthage comes; The friend who turned ×2; The man who would rule; The enemy who came back; A nemesis; A warned blow, survived; The sword falls, foreseen; The same words |
| 287 | the careful ruler | 19 | 7 | A battle won in the field | survived, Summer 395 BC | The man who told you; The friend who turned ×5; The man who would rule; The guard for sale; Carthage comes; A battle won in the field; The same quarrel again; Kin against you ×2; The decade held; The same words |
| 57 | the iron hand | 18 | 2 | Kin against you: Andron | killed, Spring 398 BC | Blood for blood; The man who told you; The man who would rule; Kin against you; The friend who turned ×2; Carthage comes; The sword falls, foreseen; The same words |
| 154 | the careful ruler | 18 | 10 | A warned blow, survived | exiled, Summer 400 BC | The friend who turned ×2; The same quarrel again; The man who told you; The man who would rule; Carthage comes; A warned blow, survived; A nemesis; The sword falls, foreseen; The same words |
| 182 | the iron hand | 18 | 5 | A warned blow, survived | survived, Summer 395 BC | The man who told you; The friend who turned ×2; A warned blow, survived; Carthage comes; Kin against you ×2; The decade held; The same words |
| 257 | the careful ruler | 18 | 6 | The city that turned twice: Acragas | survived, Summer 395 BC | The friend who turned ×3; The same quarrel again ×2; Carthage comes; A battle won in the field; A battle lost; The city that turned twice; A nemesis; A warned blow, survived; The decade held; The same words |
| 345 | the iron hand | 18 | 2 | The city that turned twice: Catana | survived, Summer 395 BC | Blood for blood; The man who told you; The friend who turned; Carthage comes; The city that turned twice; A battle won in the field; A battle lost; Kin against you; The decade held; The same words |

## The ten dullest

| Seed | Player | Score | Ten seasons | Title | Ending | Shapes |
|---|---|---|---|---|---|---|
| 354 | the patron | -2 | 0 | Quiet years | survived, Summer 395 BC | Quiet years; The same quarrel again ×2; The decade held; The same words |
| 365 | the patron | -1 | 0 | Quiet years | survived, Summer 395 BC | The same quarrel again ×2; Quiet years; Carthage comes; The decade held; The same words |
| 315 | the patron | -1 | 0 | Quiet years | survived, Summer 395 BC | The same quarrel again ×2; Quiet years; Carthage comes; The decade held; The same words |
| 308 | the careful ruler | -1 | 0 | Quiet years | survived, Summer 395 BC | The same quarrel again ×2; Carthage comes; Quiet years; The decade held; The same words |
| 304 | the patron | -1 | 0 | Quiet years | survived, Summer 395 BC | The same quarrel again ×2; Quiet years; Carthage comes; The decade held; The same words |
| 228 | the careful ruler | -1 | 0 | Quiet years | survived, Summer 395 BC | The same quarrel again ×2; Carthage comes; Quiet years; The decade held; The same words |
| 130 | the patron | -1 | 0 | Quiet years | survived, Summer 395 BC | The same quarrel again ×2; Quiet years; Carthage comes; The decade held; The same words |
| 100 | the patron | -1 | 0 | Quiet years | survived, Summer 395 BC | The same quarrel again ×2; Quiet years; Carthage comes; The decade held; The same words |
| 87 | the patron | -1 | 0 | Quiet years | survived, Summer 395 BC | The same quarrel again ×2; Carthage comes; Quiet years; The decade held; The same words |
| 79 | the patron | -1 | 1 | Quiet years | survived, Summer 395 BC | Carthage comes; The same quarrel again ×3; Quiet years; The decade held; The same words |

## The Dionysius bot (report only)

A player whose priorities are what Diodorus says Dionysius I did, each cited in `docs/research/dionysius-bot.md`. It shows which of his habits the rules reward or punish. It is not a target: nothing is tuned toward how he fares.

- Ended: survived 61%, killed 20%, exiled 16%, deposed 3%, fallen under 1%. Average length 32.2 seasons of 40.
- Built the citadel in 100% of games and the wall in 100%; married in 46%; disarmed the citizens in 100%.
- Actions a game: hire 2.29, land to the guard 0.90, disarm 1.59, executions 2.55, arrests 4.34, pardons 3.25, marriages 0.16, armies raised 1.07, marches 2.40, assaults 0.22, war declared 0.18, feasts 0.77, grain handouts 0.75.
- For comparison, the careful ruler: survived 92%, deposed 4%, killed 3%, exiled 2%, fallen under 1%.
- For comparison, the iron hand: exiled 36%, killed 32%, survived 21%, deposed 12%.
- Median story score 6; best seed 231 (A warned blow, survived).

| Priority | Passage | What he did |
|---|---|---|
| arrest | Diodorus 14.45.1 | Before his marriages he put enemies to death or banished them, "as had been his practice". |
| citadel | Diodorus 14.7.2-3 | He walled off the Island and built a fortified acropolis on it. |
| hire | Diodorus 14.10.4 | He "collected a great number of mercenaries". |
| guardLand | Diodorus 14.7.4-5 | He gave the best land to friends and officers, and the houses on the Island to friends and mercenaries. |
| disarm | Diodorus 14.10.4 | At harvest he entered the citizens' homes and carried off their arms. |
| wall | Diodorus 14.18.2-8 | He walled Epipolae with sixty thousand men in twenty days. |
| chalcidians | Diodorus 14.14.1-2, 14.15.1-3 | He took Aetna, marched on Leontini, took Catana and Naxos by betrayal and sold their people. |
| marry | Diodorus 14.44.6-8 | He married Doris of Locri and Aristomache of Syracuse on the same day. |
| dinners | Diodorus 14.45.1 | After the marriages he gave public dinners for the soldiers and most of the citizens and ruled "in more humane fashion". |
| war | Diodorus 14.45.2-5, 14.47.1-2 | With his preparations made, he had the assembly vote for war and sent Carthage a herald. |

## Reading this

Look for broken results, not rates: a shape no game reaches, a dull shape in most games, a player whose games all end the same way. Do not tune the simulation toward these numbers.
