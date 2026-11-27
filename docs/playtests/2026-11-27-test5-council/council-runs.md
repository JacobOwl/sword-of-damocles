# War council: the bot runs

200 games for each tester on the `test5` preset (Test 5: the deeper war, 20 seasons from autumn 400 BC), fixed seeds 1 to 200. Made by `node scripts/war-council.ts --preset test5 --out docs/playtests/2026-11-27-test5-council/council-runs.md`. Counted, never tuned. The first run found two broken states (a debate won by a man who died before the vote); fixed, and this is the second run.

- **The warlord (Dionysius' way):** Declares war at once, musters levies and guard, sets a battle plan, reinforces, ravages, marches on the nearest Punic town and sacks it; the careful bot runs the city.
- **The defender:** Never declares war; musters only once Carthage has landed, then fights the careful bot's way with a plan and reinforcements.
- **The diplomat:** Courts a town's house and sends embassies every season it has the silver; offers peace whenever at war; no army unless Carthage lands.
- **The exploit hunter (one big army):** Musters everything, never disbands, parks the army beside towns that are not yet his and sends embassies while they fear it; ravages every hostile field; declares war in the second year.
- **The turtle:** The careful bot alone: never declares war, never courts, fights only the bot's way. Shows what Carthage does if you leave it be.

| tester | survived | killed | crashes | broken | replay differs | wars | war, no landing | war, no battle | landings | battles (won/lost) | towns taken / lost | Motya taken | ravages | reinforcements | purges | gates opened | hungry seasons | silver at end | out of silver | towns at end |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| warlord | 84% | 16% | 0 | 0 | 0 | 1.45 | 1% | 67% | 1.11 | 0.63 (0.25/0.27) | 0.61 / 0.80 | 8% | 0.59 | 0.41 | 0.71 | 0.06 | 0.40 | 8.94 | 7% | 5.25 |
| defender | 81% | 20% | 0 | 0 | 0 | 1.11 | 1% | 47% | 1.14 | 1.01 (0.47/0.42) | 0.49 / 0.78 | 1% | 0.00 | 0.33 | 0.61 | 0.04 | 0.07 | 5.78 | 6% | 5.24 |
| diplomat | 72% | 28% | 0 | 0 | 0 | 1.75 | 1% | 100% | 1.40 | 0.01 (0.01/0.00) | 0.01 / 1.70 | 0% | 0.00 | 0.00 | 0.00 | 0.00 | 0.03 | 5.68 | 14% | 5.50 |
| doomstack | 80% | 21% | 0 | 0 | 0 | 1.34 | 1% | 51% | 1.09 | 0.78 (0.36/0.29) | 0.84 / 0.86 | 11% | 1.47 | 0.57 | 0.71 | 0.07 | 0.23 | 6.99 | 6% | 5.62 |
| turtle | 81% | 19% | 0 | 0 | 0 | 1.10 | 1% | 61% | 1.11 | 0.49 (0.24/0.22) | 0.57 / 0.88 | 1% | 0.00 | 0.00 | 0.28 | 0.05 | 0.10 | 6.06 | 5% | 5.21 |

## How long Carthage stays

- **warlord:** Carthage landed in 100% of games; from the landing to its council wanting out (or the war's end): 7.5 seasons on average, 3 or fewer in 0% of landings. Carthage's general killed within the first two battles: 2% of games.
- **defender:** Carthage landed in 96% of games; from the landing to its council wanting out (or the war's end): 7.2 seasons on average, 3 or fewer in 0% of landings. Carthage's general killed within the first two battles: 6% of games.
- **diplomat:** Carthage landed in 100% of games; from the landing to its council wanting out (or the war's end): 4.8 seasons on average, 3 or fewer in 12% of landings. Carthage's general killed within the first two battles: 0% of games.
- **doomstack:** Carthage landed in 97% of games; from the landing to its council wanting out (or the war's end): 6.9 seasons on average, 3 or fewer in 0% of landings. Carthage's general killed within the first two battles: 4% of games.
- **turtle:** Carthage landed in 96% of games; from the landing to its council wanting out (or the war's end): 7.2 seasons on average, 3 or fewer in 0% of landings. Carthage's general killed within the first two battles: 4% of games.

## How games ended

- **warlord:** survived 168, killed 23, exileEnd 9; by Hipparinus 9, the leader of the exiles at Aetna 8, the brother of Demarchus 4, Nicoteles 1
- **defender:** survived 161, killed 23, exileEnd 16; by the leader of the exiles at Aetna 10, Hipparinus 7, the brother of Demarchus 2, Nicoteles 2
- **diplomat:** survived 144, killed 37, exileEnd 19; by Hipparinus 13, the leader of the exiles at Aetna 12, the brother of Demarchus 7, Theodorus 2
- **doomstack:** survived 159, exileEnd 21, killed 20; by Hipparinus 10, the leader of the exiles at Aetna 7, the brother of Demarchus 2, Nicoteles 1
- **turtle:** survived 162, killed 23, exileEnd 15; by the leader of the exiles at Aetna 8, Hipparinus 7, the brother of Demarchus 3, Nicoteles 2

## Problems the checks found

- warlord: none
- defender: none
- diplomat: none
- doomstack: none
- turtle: none

## A war's chapter, as the game writes it (first ended war in a few seeds)

- warlord, seed 2: the war of 400 BC: It began in Autumn 400 BC, after you declared war. Carthage fought to break the tyrant; you, to hold what you had. Spring 398 BC: your aim is met (hold what you had). Peace was made in Spring 397 BC. Each side keeps what it holds.
- warlord, seed 6: the war of Messana: It began in Autumn 400 BC, after you declared war. Carthage fought to break the tyrant; you, to free the Greek cities. Summer 398 BC: plague strikes Carthage's camp before Messana. Winter 398/397 BC: Messana goes to Carthage. Himilcon came home in disgrace. Peace was made in Winter 398/397 BC. You pay Carthage 1 silver; otherwise each side keeps what it holds.
- defender, seed 1: the war of 399 BC: It began in Autumn 399 BC, after a year passes and Carthage rebuilds (Summer 399 BC). Carthage fought to keep the tribute of the Greek towns; you, to free the Greek cities. Autumn 398 BC: Messana goes to Carthage. Autumn 398 BC: Messana is sacked by Carthage's army. Spring 397 BC: Carthage's aim is met (keep the tribute of the Greek towns). Spring 396 BC: your aim is met (free the Greek cities). Himilcon went home. Peace was made in Spring 396 BC. Each side keeps what it holds.
- defender, seed 4: the war of Aetna: It began in Summer 397 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Summer 396 BC: your army wins the battle at Aetna. Winter 396/395 BC: Himilcon's army is destroyed near Aetna. Winter 396/395 BC: Carthage's aim is met (keep the tribute of the Greek towns). Winter 396/395 BC: your army wins the battle at Aetna. Himilcon is dead. Peace was made in Spring 395 BC. Each side keeps what it holds.
- diplomat, seed 1: the war of 398 BC: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to free the Greek cities. Spring 397 BC: Gela goes to Carthage. Winter 397/396 BC: Messana goes to Carthage. Winter 397/396 BC: Messana is sacked by Carthage's army. Summer 396 BC: Carthage's aim is met (keep the tribute of the Greek towns). Himilcon went home. Peace was made in Autumn 396 BC. You pay Carthage 2 silver; otherwise each side keeps what it holds.
- diplomat, seed 2: the war of 399 BC: It began in Autumn 399 BC, after a year passes and Carthage rebuilds (Summer 399 BC). Carthage fought to keep the tribute of the Greek towns; you, to free the Greek cities. Summer 398 BC: plague strikes Carthage's camp before Messana. Autumn 398 BC: your aim is met (free the Greek cities). Peace was made in Autumn 398 BC. Carthage pays you 2 silver for the cost of the war; otherwise each side keeps what it holds.
- doomstack, seed 2: the war of Panormus: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to drive Carthage from the west. Spring 397 BC: Gela comes over to you. Spring 397 BC: Gela goes to Carthage. Summer 397 BC: your army is destroyed near Panormus. Summer 397 BC: Carthage's army wins the battle at Panormus. Himilcon went home. Peace was made in Winter 397/396 BC. You pay Carthage 1 silver; otherwise each side keeps what it holds.
- doomstack, seed 6: the war of Aetna: It began in Spring 397 BC, after you declared war. Carthage fought to break the tyrant; you, to hold what you had. Spring 396 BC: Gela comes over to you. Spring 396 BC: Gela goes to Carthage. Autumn 396 BC: your army wins the battle at Aetna. Autumn 396 BC: Acragas comes over to you. Himilcon went home. Peace was made in Winter 396/395 BC. Each side keeps what it holds.
- turtle, seed 1: the war of 399 BC: It began in Autumn 399 BC, after a year passes and Carthage rebuilds (Summer 399 BC). Carthage fought to keep the tribute of the Greek towns; you, to free the Greek cities. Autumn 398 BC: Messana goes to Carthage. Autumn 398 BC: Messana is sacked by Carthage's army. Spring 397 BC: Carthage's aim is met (keep the tribute of the Greek towns). Spring 396 BC: your aim is met (free the Greek cities). Himilcon went home. Peace was made in Spring 396 BC. Each side keeps what it holds.
- turtle, seed 2: the war of Gela: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to drive Carthage from the west. Spring 397 BC: Gela comes over to you. Spring 397 BC: Gela goes to Carthage. Summer 397 BC: Gela comes over to you. Autumn 397 BC: plague strikes Carthage's camp before Messana. Himilcon went home. Peace was made in Winter 397/396 BC. Carthage pays you 1 silver for the cost of the war; otherwise each side keeps what it holds.
