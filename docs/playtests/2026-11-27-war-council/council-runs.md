# War council: the bot runs

300 games for each tester on the Near-war test preset (14 seasons from spring 398 BC), fixed seeds 1 to 300. Made by `node scripts/war-council.ts --games 300`. Counted, never tuned.

- **The warlord (Dionysius' way):** Declares war at once, musters levies and guard, sets a battle plan, reinforces, ravages, marches on the nearest Punic town and sacks it; the careful bot runs the city.
- **The defender:** Never declares war; musters only once Carthage has landed, then fights the careful bot's way with a plan and reinforcements.
- **The diplomat:** Courts a town's house and sends embassies every season it has the silver; offers peace whenever at war; no army unless Carthage lands.
- **The exploit hunter (one big army):** Musters everything, never disbands, parks the army beside towns that are not yet his and sends embassies while they fear it; ravages every hostile field; declares war in the second year.
- **The turtle:** The careful bot alone: never declares war, never courts, fights only the bot's way. Shows what Carthage does if you leave it be.

| tester | survived | killed | crashes | broken | replay differs | wars | war, no landing | war, no battle | landings | battles (won/lost) | towns taken / lost | Motya taken | ravages | reinforcements | purges | gates opened | hungry seasons | silver at end | out of silver | towns at end |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| warlord | 88% | 12% | 0 | 0 | 0 | 1.89 | 0% | 20% | 1.17 | 1.52 (0.92/0.38) | 2.26 / 0.94 | 59% | 2.29 | 0.73 | 0.94 | 0.13 | 0.72 | 12.54 | 2% | 7.15 |
| defender | 95% | 5% | 0 | 0 | 0 | 1.69 | 1% | 7% | 1.13 | 2.09 (1.24/0.50) | 1.73 / 0.76 | 9% | 0.00 | 0.44 | 0.70 | 0.04 | 0.30 | 11.13 | 1% | 6.95 |
| diplomat | 85% | 15% | 0 | 0 | 0 | 1.92 | 0% | 93% | 1.26 | 0.08 (0.04/0.03) | 0.16 / 1.38 | 1% | 0.00 | 0.03 | 0.06 | 0.00 | 0.02 | 5.46 | 8% | 6.27 |
| doomstack | 84% | 16% | 0 | 0 | 0 | 1.86 | 1% | 9% | 1.06 | 1.82 (1.14/0.40) | 2.51 / 0.72 | 63% | 3.49 | 0.74 | 0.98 | 0.12 | 0.56 | 10.83 | 2% | 7.62 |
| turtle | 93% | 7% | 0 | 0 | 0 | 1.62 | 1% | 16% | 1.19 | 1.30 (0.74/0.42) | 1.64 / 1.06 | 6% | 0.00 | 0.00 | 0.73 | 0.08 | 0.25 | 9.89 | 3% | 6.65 |

## How long Carthage stays

- **warlord:** Carthage landed in 100% of games; from the landing to its council wanting out (or the war's end): 2.6 seasons on average, 3 or fewer in 95% of landings. Carthage's general killed within the first two battles: 9% of games.
- **defender:** Carthage landed in 99% of games; from the landing to its council wanting out (or the war's end): 2.8 seasons on average, 3 or fewer in 85% of landings. Carthage's general killed within the first two battles: 11% of games.
- **diplomat:** Carthage landed in 100% of games; from the landing to its council wanting out (or the war's end): 1.9 seasons on average, 3 or fewer in 100% of landings. Carthage's general killed within the first two battles: 0% of games.
- **doomstack:** Carthage landed in 99% of games; from the landing to its council wanting out (or the war's end): 2.6 seasons on average, 3 or fewer in 88% of landings. Carthage's general killed within the first two battles: 13% of games.
- **turtle:** Carthage landed in 99% of games; from the landing to its council wanting out (or the war's end): 3.0 seasons on average, 3 or fewer in 76% of landings. Carthage's general killed within the first two battles: 8% of games.

## How games ended

- **warlord:** survived 264, killed 23, exileEnd 13; by Hipparinus 9, the leader of the exiles at Aetna 6, the brother of Demarchus 4, Nicoteles 3
- **defender:** survived 285, exileEnd 9, killed 6; by the leader of the exiles at Aetna 3, Hipparinus 2, Nicoteles 1
- **diplomat:** survived 254, killed 23, exileEnd 23; by the leader of the exiles at Aetna 10, Hipparinus 7, the brother of Demarchus 3, Philistus 1
- **doomstack:** survived 253, killed 24, exileEnd 23; by the leader of the exiles at Aetna 10, Hipparinus 7, the brother of Demarchus 5, Leptines 1
- **turtle:** survived 280, exileEnd 11, killed 9; by Hipparinus 3, the brother of Demarchus 3, the leader of the exiles at Aetna 3

## Problems the checks found

- warlord: none
- defender: none
- diplomat: none
- doomstack: none
- turtle: none

## A war's chapter, as the game writes it (first ended war in a few seeds)

- warlord, seed 1: the war of Gela: It began in Spring 398 BC, after you declared war. Carthage fought to break the tyrant; you, to hold what you had. Summer 397 BC: your army wins the battle at Gela. Summer 397 BC: Gela goes to Carthage. Summer 397 BC: Gela comes over to you. Himilcon went home. Peace was made in Autumn 397 BC. Each side keeps what it holds.
- warlord, seed 2: the war of Panormus: It began in Spring 398 BC, after you declared war. Carthage fought to break the tyrant; you, to hold what you had. Winter 398/397 BC: Acragas comes over to you. Spring 397 BC: Himilcon's army is destroyed near Panormus. Spring 397 BC: your army wins the battle at Acragas. Spring 397 BC: your army wins the battle at Panormus. Himilcon is dead. Peace was made in Summer 397 BC. Carthage pays you 4 silver for the cost of the war; otherwise each side keeps what it holds.
- defender, seed 1: the war of Motya: It began in Autumn 398 BC, after Carthage lost the tribute of Gela (Summer 398 BC). Carthage fought to win back what was taken; you, to hold what you had. Autumn 398 BC: Acragas comes over to you. Winter 398/397 BC: Panormus comes over to you. Spring 397 BC: Himilcon's army is destroyed near Motya. Spring 397 BC: your army wins the battle at Motya. Himilcon is dead. Peace was made in Summer 397 BC. Carthage pays you 5 silver for the cost of the war; otherwise each side keeps what it holds.
- defender, seed 2: the war of Panormus: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Winter 398/397 BC: Acragas comes over to you. Spring 397 BC: Himilcon's army is destroyed near Panormus. Spring 397 BC: your army wins the battle at Acragas. Spring 397 BC: your army wins the battle at Panormus. Himilcon is dead. Peace was made in Summer 397 BC. Carthage pays you 4 silver for the cost of the war; otherwise each side keeps what it holds.
- diplomat, seed 1: the war of Gela: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Spring 397 BC: Gela goes to Carthage. Summer 397 BC: Acragas goes to Carthage. Himilcon went home. Peace was made in Summer 397 BC. You pay Carthage 1 silver; otherwise each side keeps what it holds.
- diplomat, seed 2: the war of Gela: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Spring 397 BC: Gela goes to Carthage. Summer 397 BC: Acragas goes to Carthage. Himilcon went home. Peace was made in Summer 397 BC. You pay Carthage 1 silver; otherwise each side keeps what it holds.
- doomstack, seed 2: the war of Panormus: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Winter 398/397 BC: Acragas comes over to you. Spring 397 BC: Himilcon's army is destroyed near Panormus. Spring 397 BC: your army wins the battle at Acragas. Spring 397 BC: your army wins the battle at Panormus. Himilcon is dead. Peace was made in Summer 397 BC. Carthage pays you 4 silver for the cost of the war; otherwise each side keeps what it holds.
- doomstack, seed 3: the war of Gela: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Spring 397 BC: your army wins the battle at Gela. Spring 397 BC: Gela comes over to you. Spring 397 BC: Gela goes to Carthage. Spring 397 BC: Gela comes over to you. Himilcon went home. Peace was made in Summer 397 BC. Carthage pays you 1 silver for the cost of the war; otherwise each side keeps what it holds.
- turtle, seed 1: the war of Panormus: It began in Autumn 398 BC, after Carthage lost the tribute of Gela (Summer 398 BC). Carthage fought to win back what was taken; you, to hold what you had. Autumn 398 BC: Acragas comes over to you. Winter 398/397 BC: Panormus comes over to you. Summer 397 BC: Gela goes to Carthage. Spring 396 BC: your army wins the battle at Panormus. Himilcon is dead. Peace was made in Winter 396/395 BC. Carthage pays you 2 silver for the cost of the war; otherwise each side keeps what it holds.
- turtle, seed 2: the war of Panormus: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Winter 398/397 BC: Acragas comes over to you. Spring 397 BC: Himilcon's army is destroyed near Panormus. Spring 397 BC: your army wins the battle at Acragas. Spring 397 BC: your army wins the battle at Panormus. Himilcon is dead. Peace was made in Summer 397 BC. Carthage pays you 4 silver for the cost of the war; otherwise each side keeps what it holds.
