# Brief: invading Carthage and diplomacy abroad (council, 2026-11-27, thread 48)

**Jacob's words:** "Also I want to be able to invade carthage and I want to have dilpo with greece city states and other powers if theres history behind it. Lets look into those." Then: "Have councils look into these issues. Look into other games; as a rule I prefer us being inspired by other games than you making up stuff. Look into real history and plausable stuff."

**So the rule for this council:** every proposed mechanic names the game it comes from (and how that game does it) or the ancient passage it comes from. Nothing made up without saying so. Design only; nothing is built. Any rule change would be an optional switch, off by default.

**The game now.** The Sword of Damocles: a single-player political sim, Syracuse 405 to 395 BC, you play a person (Dionysius-like) not a state. Seasons; defined CK3-style actions only. The island map has 8 cities and Aetna joined by roads and sea lanes (`data/island.json`); Carthage is a single point off the map with landing towns Motya and Panormus. Carthage is simulated: a council of blocs (Elders, Hundred, people, Libyan subjects) with moods, anger, a vote on war and peace (`src/core/carthage.ts`, `data/carthage.json`). War focus switches (`warFocus`, `townBoards`, `armySupply`, `battlePlate`, `carthageStays`, `aweNeedsMarch`; `data/war.json`, `src/core/war.ts`, `src/core/island.ts`): a war is an object with aims, a ledger, weariness both sides, peace terms; armies with months of food march along routes. The "Near-war test" opens spring 398. Outside powers are only names (`data/outside.json`: Carthage, Sparta...). `docs/scope.md` says "Italy and Greece as more than names" and "naval battles beyond a single interception roll" are OUT of Phase 2, so anything here may need a scope change Jacob makes. Thread 30's `docs/full-game.md` already sketched "the second front" (a small Libyan map) for an Agathocles campaign about 310 BC.

**Jacob's tastes.** Leder Games (Root, Oath, Arcs), Republic of Rome, John Company, CK3, Dwarf Fortress, Songs of Syx. Power as objects, asymmetric factions, emergent stories. He dislikes walls of text and CK3-style repetitive popups; he likes war, events, the map. He found the game too easy. Not Reigns.

**Running alongside (keep compatible):** thread 46 designs big event scenes; thread 47 designs unit types, battle terrain and town contingents.

**History already found (Diodorus Loeb, saved in phoenician-punic-world/sources):**
- 14.10.2 Sparta sends Aristus about 404 "ostensibly pretending that they would overthrow the government, but in truth with intent to increase the power of the tyranny".
- 14.44.3 to 14.44.6 (398): gift of land to Messana; marriage offer to Rhegium refused by its assembly; Locri accepts (Doris).
- 14.62.1 (396): Polyxenus sent "to the Greeks in Italy and to the Lacedaemonians, as well as the Corinthians, begging them to come to his aid"; 14.63.4 he returns "bringing thirty warships from his allies, with Pharacidas the Lacedaemonian as admiral"; 14.70.1 to 14.70.3 Pharacidas vetoes the Syracusans' bid for liberty.
- 14.44 / 14.45? Spartans let him recruit mercenaries; 14.58? "over a thousand mercenaries from the Lacedaemonians".
- 14.100.5 (390/389): "he drew up terms of alliance with the Leucani"; 14.101.1 the Italian Greek league: "if any city's territory was being plundered by the Leucanians, they should all come to its aid"; 14.103.4 to 14.103.5 Croton, full of Syracusan exiles, makes the exile Heloris general.
- 14.109 (388): Olympia, Lysias urges the crowd not to admit "the representatives from a most impious tyranny".
- 14.76 to 14.77 (396): Himilcon slips home, starves himself; Carthage in "superstitious fear". 14.77.1 to 14.77.3 (the Libyan revolt) NOT saved. 15.24 (379): plague, "the Libyans, undervaluing them, seceded, and the Sardinians ... revolted".
- Agathocles in Libya, 310 to 307 (Diodorus book 20 Loeb): 20.3.3 leave a garrison and "cross over into Libya"; 20.4.1 his brother Antander as "curator of the city"; 20.5 runs the blockade; 20.7 burns the ships as a vow; 20.8.3 to 20.8.4 the rich farmland; 20.10.1 the council names "Hanno and Bormilcar, men who had an inherited feud"; 20.10.2 Bormilcar wants tyranny; 20.17.1 towns come over "because of fear, others because of their hatred for the Carthaginians"; 20.69 Agathocles flees, abandons his sons; the army makes peace.
- Regulus 256 to 255 (Polybius 1.26 to 1.34, Shuckburgh, saved): lands at Aspis, offers terms "so severe" the Carthaginians refuse; the Spartan mercenary Xanthippus retrains them and wins.
- NOT saved (say so, don't quote): Diodorus 15.13 to 15.14 (Adriatic colonies, Illyrians, the raid on Pyrgi about 384), Xenophon Hellenica (ships to Sparta 387 and 369/368), Athenian inscriptions (honours 393, alliance 368). Pyrgi plunder is in pseudo-Aristotle Economics 2.2.20 per `docs/research/customs.md`.

**Output.** Write your seat statement (markdown, about 600 to 1,200 words, plain English, short sentences, no em dashes) to `/home/user/sword-of-damocles/docs/council/2026-11-27-abroad/<your-seat>.md`. Answer these questions from your seat:
1. Invading Carthage's home (Libya): how should it work in this game? What fits 398 to 395 and what is for later campaigns?
2. Diplomacy with Greek city-states and other powers: which powers, which actions, with what history behind each?
3. How should off-map powers appear (map point, card, small second map, list)?
4. What should NOT be done?
Give two or three options per question where useful, and say which you would pick and why. Every mechanic names its source game or passage. Mark anything unverified as unverified. Do not edit any other file. Return a 5-line summary.
