# War council: the bot runs again, with the fixes and the two new switches (carthageStays, aweNeedsMarch)

300 games for each tester on the Near-war test preset (14 seasons from spring 398 BC), fixed seeds 1 to 300. Made by `node scripts/war-council.ts --games 300`. Counted, never tuned.

- **The warlord (Dionysius' way):** Declares war at once, musters levies and guard, sets a battle plan, reinforces, ravages, marches on the nearest Punic town and sacks it; the careful bot runs the city.
- **The defender:** Never declares war; musters only once Carthage has landed, then fights the careful bot's way with a plan and reinforcements.
- **The diplomat:** Courts a town's house and sends embassies every season it has the silver; offers peace whenever at war; no army unless Carthage lands.
- **The exploit hunter (one big army):** Musters everything, never disbands, parks the army beside towns that are not yet his and sends embassies while they fear it; ravages every hostile field; declares war in the second year.
- **The turtle:** The careful bot alone: never declares war, never courts, fights only the bot's way. Shows what Carthage does if you leave it be.

| tester | survived | killed | crashes | broken | replay differs | wars | war, no landing | war, no battle | landings | battles (won/lost) | towns taken / lost | Motya taken | ravages | reinforcements | purges | gates opened | hungry seasons | silver at end | out of silver | towns at end |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| warlord | 86% | 14% | 0 | 0 | 0 | 1.78 | 0% | 7% | 1.01 | 2.12 (1.43/0.43) | 2.21 / 0.94 | 51% | 2.41 | 0.70 | 1.04 | 0.10 | 0.57 | 12.42 | 2% | 7.11 |
| defender | 92% | 8% | 0 | 0 | 0 | 1.58 | 1% | 5% | 1.00 | 2.39 (1.66/0.41) | 1.67 / 0.60 | 8% | 0.00 | 0.38 | 0.49 | 0.02 | 0.37 | 10.33 | 2% | 6.98 |
| diplomat | 78% | 22% | 0 | 0 | 0 | 1.76 | 0% | 88% | 1.13 | 0.20 (0.13/0.05) | 0.13 / 1.61 | 0% | 0.00 | 0.08 | 0.05 | 0.00 | 0.08 | 5.02 | 12% | 6.02 |
| doomstack | 88% | 12% | 0 | 0 | 0 | 1.80 | 1% | 5% | 0.99 | 2.29 (1.61/0.36) | 2.49 / 0.63 | 63% | 3.70 | 0.72 | 0.94 | 0.08 | 0.61 | 11.01 | 3% | 7.57 |
| turtle | 91% | 9% | 0 | 0 | 0 | 1.46 | 1% | 9% | 1.02 | 1.82 (1.27/0.36) | 1.73 / 1.00 | 5% | 0.00 | 0.00 | 0.58 | 0.04 | 0.23 | 9.96 | 2% | 6.69 |

## How long Carthage stays

- **warlord:** Carthage landed in 100% of games; from the landing to its council wanting out (or the war's end): 3.8 seasons on average, 3 or fewer in 49% of landings. Carthage's general killed within the first two battles: 16% of games.
- **defender:** Carthage landed in 99% of games; from the landing to its council wanting out (or the war's end): 3.4 seasons on average, 3 or fewer in 63% of landings. Carthage's general killed within the first two battles: 15% of games.
- **diplomat:** Carthage landed in 100% of games; from the landing to its council wanting out (or the war's end): 3.6 seasons on average, 3 or fewer in 19% of landings. Carthage's general killed within the first two battles: 2% of games.
- **doomstack:** Carthage landed in 99% of games; from the landing to its council wanting out (or the war's end): 3.3 seasons on average, 3 or fewer in 65% of landings. Carthage's general killed within the first two battles: 17% of games.
- **turtle:** Carthage landed in 99% of games; from the landing to its council wanting out (or the war's end): 4.1 seasons on average, 3 or fewer in 44% of landings. Carthage's general killed within the first two battles: 15% of games.

## How games ended

- **warlord:** survived 258, exileEnd 25, killed 17; by Hipparinus 6, the leader of the exiles at Aetna 5, the brother of Demarchus 5, Theodorus 1
- **defender:** survived 276, exileEnd 13, killed 11; by the leader of the exiles at Aetna 5, Hipparinus 4, the brother of Demarchus 2
- **diplomat:** survived 234, exileEnd 38, killed 28; by the leader of the exiles at Aetna 15, the brother of Demarchus 7, Hipparinus 6
- **doomstack:** survived 264, exileEnd 19, killed 17; by the leader of the exiles at Aetna 8, Hipparinus 4, the brother of Demarchus 4, Nicoteles 1
- **turtle:** survived 273, exileEnd 15, killed 12; by Hipparinus 5, the brother of Demarchus 4, the leader of the exiles at Aetna 3

## Problems the checks found

- warlord: none
- defender: none
- diplomat: none
- doomstack: none
- turtle: none

## A war's chapter, as the game writes it (first ended war in a few seeds)

- warlord, seed 1: the war of Gela: It began in Spring 398 BC, after you declared war. Carthage fought to break the tyrant; you, to hold what you had. Summer 397 BC: your army wins the battle at Gela. Summer 397 BC: Gela goes to Carthage. Autumn 397 BC: Himilcon's army is destroyed near Gela. Autumn 397 BC: your army wins the battle at Gela. Himilcon is dead. Peace was made in Winter 397/396 BC. Carthage pays you 1 silver for the cost of the war; otherwise each side keeps what it holds.
- warlord, seed 2: the war of Panormus: It began in Spring 398 BC, after you declared war. Carthage fought to break the tyrant; you, to hold what you had. Winter 398/397 BC: Acragas comes over to you. Spring 397 BC: Himilcon's army is destroyed near Panormus. Spring 397 BC: your army wins the battle at Acragas. Spring 397 BC: your army wins the battle at Panormus. Himilcon is dead. Peace was made in Summer 397 BC. Carthage pays you 1 silver for the cost of the war; otherwise each side keeps what it holds.
- defender, seed 2: the war of Panormus: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Winter 398/397 BC: Acragas comes over to you. Spring 397 BC: Magon's army is destroyed near Panormus. Spring 397 BC: your army wins the battle at Acragas. Spring 397 BC: your army wins the battle at Panormus. Himilcon is dead; Magon came home in disgrace. Peace was made in Summer 397 BC. Carthage pays you 1 silver for the cost of the war; otherwise each side keeps what it holds.
- defender, seed 3: the war of Gela: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Spring 397 BC: your army wins the battle at Gela. Spring 397 BC: Gela comes over to you. Summer 397 BC: Magon's army is destroyed near Gela. Summer 397 BC: your army wins the battle at Gela. Himilcon is dead; Magon came home in disgrace. Peace was made in Autumn 397 BC. Carthage pays you 1 silver for the cost of the war; otherwise each side keeps what it holds.
- diplomat, seed 1: the war of Messana: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Spring 397 BC: Gela goes to Carthage. Summer 397 BC: Acragas goes to Carthage. Autumn 397 BC: your army wins the battle at Messana. Autumn 397 BC: Gela comes over to you. Himilcon came home in disgrace. Peace was made in Winter 397/396 BC. You pay Carthage 1 silver; otherwise each side keeps what it holds.
- diplomat, seed 2: the war of Gela: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Spring 397 BC: Gela goes to Carthage. Summer 397 BC: Acragas goes to Carthage. Autumn 397 BC: Gela comes over to you. Himilcon went home. Peace was made in Winter 397/396 BC. Each side keeps what it holds.
- doomstack, seed 2: the war of Panormus: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Winter 398/397 BC: Acragas comes over to you. Spring 397 BC: Magon's army is destroyed near Panormus. Spring 397 BC: your army wins the battle at Acragas. Spring 397 BC: your army wins the battle at Panormus. Himilcon is dead; Magon came home in disgrace. Peace was made in Summer 397 BC. Carthage pays you 1 silver for the cost of the war; otherwise each side keeps what it holds.
- doomstack, seed 3: the war of Panormus: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Spring 397 BC: your army wins the battle at Gela. Spring 397 BC: Gela comes over to you. Summer 397 BC: Himilcon's army is destroyed near Panormus. Summer 397 BC: your army wins the battle at Panormus. Himilcon is dead. Peace was made in Autumn 397 BC. Carthage pays you 1 silver for the cost of the war; otherwise each side keeps what it holds.
- turtle, seed 1: the war of Panormus: It began in Autumn 398 BC, after Carthage lost the tribute of Gela (Summer 398 BC). Carthage fought to win back what was taken; you, to hold what you had. Autumn 398 BC: Acragas comes over to you. Winter 398/397 BC: Panormus comes over to you. Summer 397 BC: Gela goes to Carthage. Spring 396 BC: your army wins the battle at Panormus. Himilcon is dead. Peace was made in Winter 396/395 BC. Each side keeps what it holds.
- turtle, seed 2: the war of Panormus: It began in Summer 398 BC, after a year passes and Carthage rebuilds. Carthage fought to keep the tribute of the Greek towns; you, to hold what you had. Winter 398/397 BC: Acragas comes over to you. Spring 397 BC: Magon's army is destroyed near Panormus. Spring 397 BC: your army wins the battle at Acragas. Spring 397 BC: your army wins the battle at Panormus. Himilcon is dead; Magon came home in disgrace. Peace was made in Summer 397 BC. Carthage pays you 1 silver for the cost of the war; otherwise each side keeps what it holds.
