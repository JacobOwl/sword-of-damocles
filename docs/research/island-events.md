# Events of the island, 405 to 395 BC

kind: history. This card backs every `kind: history` record in `data/island-events.json`. It is written by `node tools/build-island-events-card.mjs` from the data, so edit the data, not this file. Every quote is checked against the saved texts in Jacob's Phoenician-Punic World repo (read-only) by `node scripts/verify-cast-quotes.mjs ../phoenician-punic-world`.

18 events: 14 from the sources, 4 invented.

Texts used:
- `sources/diodorus/english/book14-1-18-97-117.loeb.txt`
- `sources/diodorus/english/book14-78-96.txt`
- `sources/diodorus/english/book14.loeb.txt`

## What is history and what is game

History comes in as **conditions, never dates** (design council V8). An event from the sources fires when the island is in the situation the source describes: an army before a town, a plague in a crowded summer camp, an unpaid guard, a town just taken. It may fire in 404 or not at all. The source gives the situation and usually what Dionysius did, which is one choice among several and marked as his. **Everything mechanical is invention:** the trigger, who plays a part when the source names someone the game does not have (often one of the generated invented people), the other choices, and every number. Each record lists these under `invented`.

Diodorus writes by archon year and composes his own speeches and motives. Where he explains why Dionysius acted (the bargain with Himilcon, 14.75.3), the game shows that as an effect on the city, not as a fact about Dionysius' mind.

## The events from the sources

### A gate at midnight

Source: Diodorus 14.15.1 to 14.15.2.

- Catana was betrayed to Dionysius by its general, who let him in about midnight. Diodorus 14.15.1: "the general of the Catanians, had offered to betray the city to him. Consequently, being admitted by" (`sources/diodorus/english/book14-1-18-97-117.loeb.txt`)
- Naxos was handed over by its commander, won over by great promises. Diodorus 14.15.2: "Procles, the commander of the Naxians, on being won over by great promises, delivered over his native city to Dionysius" (`sources/diodorus/english/book14-1-18-97-117.loeb.txt`)
- Invented: trigger (any town your army besieges); the traitor is the town's first man from the generated cast; the promise and the refusal; all numbers.

### The mole to the island

Source: Diodorus 14.48.2, 14.49.3.

- Motya lay on an island six stades off Sicily; its people breached the causeway. Diodorus 14.48.2: "It also had a narrow artificial causeway extending to the shore of Sicily, which the Motyans breached at this time" (`sources/diodorus/english/book14.loeb.txt`)
- Dionysius filled the strait and advanced his engines along the mole. Diodorus 14.49.3: "he at once put many times more men on the task of filling up the strait between the city and the coast, and, as the mole was extended, advanced his engines of war little by little toward the walls" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger; the blockade choice; all numbers.

### Towers six storeys high

Source: Diodorus 14.51.1.

- At Motya Dionysius used rams, catapults and wheeled towers six stories high. Diodorus 14.51.1: "kept hammering the towers with his battering-rams, while with the catapults he kept down the fighters on the battlements; and he also advanced against the walls his wheeled towers, six stories high" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (any town with walls you have besieged for a season); all numbers.
- Note: The towers need the arms workshops (the event of that name) to have been set up.

### Heralds to the temples

Source: Diodorus 14.53.1 to 14.53.2.

- At Motya the Sicilian Greeks slew everyone they met. Diodorus 14.53.1: "for the Sicilian Greeks, eager to return cruelty for cruelty, slew everyone they encountered, sparing without distinction not a child, not a woman, not an elder" (`sources/diodorus/english/book14.loeb.txt`)
- Dionysius, wanting captives to sell, sent heralds telling the Motyans to flee to the Greek temples. Diodorus 14.53.2: "he stationed heralds to cry aloud and tell the Motyans to take refuge in the temples which were revered by the Greeks" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (taking a town of Carthage's own); the other two choices; all numbers.

### Greeks who fought for Carthage

Source: Diodorus 14.53.4.

- After Motya Dionysius crucified Daimenes and other Greeks who had fought for Carthage. Diodorus 14.53.4: "and other Greeks who had fought on the side of the Carthaginians and had been taken captive" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger; which town hears of it; enlisting and releasing; all numbers.

### The first man on the wall

Source: Diodorus 14.53.4.

- Dionysius rewarded Archylus, the first up the wall of Motya, with one hundred minas, and honoured the brave. Diodorus 14.53.4: "he rewarded Archylus, who had been the first to mount the wall, with one hundred minas, and honoured according to their merits all others who had performed deeds of valour" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (any town you take); the hero is one of your hired captains from the generated cast (the source names Archylus of Thurii); the other choices; all numbers.

### Ships on the beach

Source: Diodorus 14.50.1, 14.50.4.

- Himilcon came with his hundred best triremes to catch Dionysius' ships hauled up in the harbour of Motya. Diodorus 14.50.1: "hearing that Dionysius had hauled his warships up on land, manned at once his hundred best triremes" (`sources/diodorus/english/book14.loeb.txt`)
- Dionysius hauled the ships over land, manned them with archers and slingers, and used the new catapults from the shore. Diodorus 14.50.4: "he hauled his vessels over the land with no difficulty and launched them safely in the sea outside the harbour" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (any port your army besieges while Carthage has a fleet); the other choices; all numbers.

### Cut off their foragers

Source: Diodorus 14.96.1.

- Magon, camped in hostile land and short of supplies, was harried by Agyris' troops, who knew the ground. Diodorus 14.96.1: "the troops of Agyris, being familiar with the territory, held the advantage in laying ambushes and were continually cutting off the enemy's supplies" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger; local men from one of the island's towns play the part of Agyris' troops; the horsemen; all numbers.

### The grain convoy

Source: Diodorus 14.63.4, 14.64.1.

- Besieged, Dionysius sent merchant ships to Sardinia and Libya for grain. Diodorus 14.63.4: "He also dispatched merchant ships to Sardinia and Libya to secure grain and every kind of food" (`sources/diodorus/english/book14.loeb.txt`)
- While Dionysius and Leptines escorted supplies, the Syracusans on their own took a food ship. Diodorus 14.64.1: "Dionysius and Leptines had set out with warships to escort a supply of provisions; and the Syracusans, who were thus left to themselves" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (grain 3 or less under siege); sending the admiral alone; all numbers.

### Plague in the Punic camp

Source: Diodorus 14.70.4 to 14.72.1.

- A plague struck the Carthaginian army before Syracuse, from crowding, the season and the heat. Diodorus 14.70.4: "that myriads of people were gathered together, that it was the time of year which is most productive of plagues" (`sources/diodorus/english/book14.loeb.txt`)
- The camp's ground was marshy and in a hollow. Diodorus 14.70.5: "since the terrain was marshy and in a hollow" (`sources/diodorus/english/book14.loeb.txt`)
- The plague first attacked the Libyans; soon no one dared approach the sick. Diodorus 14.71.1: "Now the plague first attacked the Libyans" (`sources/diodorus/english/book14.loeb.txt`)
- Dionysius attacked the camp by land and the ships by sea at daybreak. Diodorus 14.72.1: "ordered Pharacidas and Leptines the admirals to attack the enemy's ships at daybreak, while he himself, profiting by a moonless night, made a circuit with his army" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (plague breaking out in a Carthaginian siege camp, from the island's own plague roll); waiting; all numbers.
- Note: Diodorus also gives a religious cause, the plundered temple of Demeter and Kore (14.70.4). The game's plague comes from the camp; the event names both.

### A bargain by night

Source: Diodorus 14.75.1 to 14.75.9.

- The Carthaginians, beaten, offered Dionysius three hundred talents in secret to let their troops cross to Libya. Diodorus 14.75.1: "they entered into negotiations with Dionysius without the knowledge of the Syracusans. They asked him to allow their remaining troops to cross back to Libya and promised to give him the three hundred talents" (`sources/diodorus/english/book14.loeb.txt`)
- Diodorus says Dionysius agreed so that fear of Carthage would keep the Syracusans from seeking their freedom. Diodorus 14.75.3: "in order that the Syracusans, by reason of their fear of the Carthaginians, should never find a time of ease to assert their freedom" (`sources/diodorus/english/book14.loeb.txt`)
- The Iberians left behind took service with Dionysius. Diodorus 14.75.9: "Dionysius made peace with the Iberians and enrolled them in his mercenaries" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (plague, a lost battle, or a starving army); refusing; all numbers (300 talents is shown as 4 silver).
- Note: Diodorus' reason for the deal is his own judgement of Dionysius' motive; the game shows it as the effect on plots, not as fact.

### Pay in land

Source: Diodorus 14.78.1 to 14.78.3.

- Fearing the mercenaries might depose him, Dionysius arrested their commander Aristotle. Diodorus 14.78.1: "seeing that the mercenaries were most hostile to him and fearing that they might depose him, first of all arrested Aristotle, their commander" (`sources/diodorus/english/book14-78-96.txt`)
- He sent Aristotle to Sparta for trial and gave the ten thousand mercenaries Leontini in place of pay. Diodorus 14.78.2: "offered to the mercenaries, who numbered about ten thousand, in lieu of their pay the city and territory of the Leontines" (`sources/diodorus/english/book14-78-96.txt`)
- They shared out the land and settled in Leontini; he recruited new mercenaries. Diodorus 14.78.3: "after portioning it out in allotments they made their home in Leontini" (`sources/diodorus/english/book14-78-96.txt`)
- Invented: trigger (unpaid guard, or a recent peace); paying or stalling; all numbers.
- Note: The court event 'The mercenaries' demand' tells the same story in the citadel game.

### Envoys to the Campanians

Source: Diodorus 14.61.4 to 14.61.5.

- Himilcon sent envoys to the Campanians who held Aetna, urging them to revolt from Dionysius. Diodorus 14.61.4: "sent ambassadors to the Campanians who held" (`sources/diodorus/english/book14.loeb.txt`)
- He promised them land and spoils, and pointed to the Campanians of Entella, who sided with Carthage. Diodorus 14.61.5: "He promised both to give them a large amount of territory and to let them share in the spoils of the war" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (any town of yours near Carthage's army; the source names Aetna); the choices; all numbers.

### The goddesses' temple

Source: Diodorus 14.63.1, 14.77.4.

- Himilcon took the suburb of Achradina and plundered the temples of Demeter and Kore. Diodorus 14.63.1: "he also plundered the temples of both Demeter and" (`sources/diodorus/english/book14.loeb.txt`)
- Afterwards the Carthaginians believed the gods were fighting them and voted to propitiate them. Diodorus 14.77.4: "Consequently they voted by every means to propitiate the gods who had been sinned against" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger; the choices; all numbers.

## Invented events

These have no source. Some borrow a situation the sources describe; the note says which.

- **The baggage is late**
- **Fever in the lines**: The causes the physicians name follow Diodorus 14.70.4 to 14.70.5 (crowding, the season, the water, marshy ground), but this event is invention.
- **Punic silver for a captain**
- **The harvest is waiting**
