# Events of the island, 405 to 395 BC

kind: history. This card backs every `kind: history` record in `data/island-events.json`. It is written by `node tools/build-island-events-card.mjs` from the data, so edit the data, not this file. Every quote is checked against the saved texts in Jacob's Phoenician-Punic World repo (read-only) by `node scripts/verify-cast-quotes.mjs ../phoenician-punic-world`.

41 events: 28 from the sources, 13 invented.

Texts used:
- `sources/diodorus/book14-19-40.loeb.excerpts.txt`
- `sources/diodorus/english/book14-1-18-97-117.loeb.txt`
- `sources/diodorus/english/book14-78-96.txt`
- `sources/diodorus/english/book14-gap-sections.txt`
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

### A general's offer
Peacetime, your army at home, any free town with a first man. Diodorus, Loeb translation, `sources/diodorus/english/book14-1-18-97-117.loeb.txt`.
- After the peace Dionysius "was eager to attach to himself the neighbouring cities of the Chalcidians, namely, Naxos, Catanê, and Leontini" (14.14.1).
- At Catana, "Arcesilaüs, the general of the Catanians, had offered to betray the city to him" (14.15.1).
- At Naxos, "Procles, the commander of the Naxians, on being won over by great promises, delivered over his native city to Dionysius" (14.15.2).
- Invention: the trigger, the traitor drawn from the generated cast, the town leaning your way (instead of a set night), the numbers.

### A herald before the walls
Peacetime, your army within six days of a free or tributary town. Same file.
- At Leontini "he at first led out his army in battle-order and dispatched a herald to the Leontines, commanding them to surrender the city" (14.14.3).
- They refused, and "Dionysius, having no engines of war, gave up the siege for the time being, but plundered their entire territory" (14.14.4).
- Later "he ordered them to hand over their city and enjoy citizenship in Syracuse", and the Leontines, remembering Naxos and Catana, gave in (14.15.4).
- Invention: the trigger, the odds and the bonus after a sack, the grain from plunder, the numbers.

### A man who would be tyrant
Peacetime, your army near a free or tributary town with a first man. Enna is not on the map. Same file.
- Near Enna "he persuaded Aeimnestus, a native of the city, to make a bid for tyranny, promising to aid him in the undertaking" (14.14.6).
- Aeimnestus "did not admit Dionysius into the city, Dionysius in anger changed sides and urged the Ennaeans to overthrow the tyrant" (14.14.7).
- He did it "because he wanted to encourage the other cities to put faith in him" (14.14.8).
- Invention: the trigger, the would-be tyrant drawn from the generated cast and coming to you, the odds.

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

### Rhegium takes alarm

Source: Diodorus 14.40.1 to 14.40.7, 14.44.4.

- Rhegium feared Dionysius' growing power after he enslaved its kinsmen of Naxos and Catana. Diodorus 14.40.1: "The inhabitants of Rhegium, who were colonists of Chalcis, were angered to see the growing power of Dionysius." (`sources/diodorus/book14-19-40.loeb.excerpts.txt`)
- The Syracusan exiles living in Rhegium pressed for war. Diodorus 14.40.2: "who had been exiled by Dionysius, for most of them were at that time resident in Rhegium" (`sources/diodorus/book14-19-40.loeb.excerpts.txt`)
- The Messenian Laomedon persuaded the soldiers not to fight a man who had done them no wrong. Diodorus 14.40.5: "for he advised them not begin a war against Dionysius who had done them no wrong." (`sources/diodorus/book14-19-40.loeb.excerpts.txt`)
- Dionysius waited at the border, then made peace when both cities sent envoys. Diodorus 14.40.6 to 14.40.7: "At the outset Dionysius had led out his army to the border of the Syracusan territory," (`sources/diodorus/book14-19-40.loeb.excerpts.txt`)
- Later he bound the Messenians to him with a gift of land. Diodorus 14.44.4: "he made a present to the Messenians of a large piece of territory on their borders, binding them to him by such a benefaction" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (three or more towns yours or allied); the chance that the Messenians turn back; all numbers.

### Heloris before Messana

Source: Diodorus 14.87.1 to 14.87.2.

- Rhegium took in the men Dionysius had expelled, settled the Naxians and Catanians at Mylae, and sent Heloris against Messana. Diodorus 14.87.1: "offered asylum to those who were expelled by Dionysius and were active against him, and then settled in Mylae the surviving Naxians and Catanians, prepared an army, and dispatched as its general Heloris to lay siege to" (`sources/diodorus/english/book14-gap-sections.txt`)
- His reckless attack on the citadel was beaten by the Messenians and Dionysius' mercenaries; more than five hundred fell. Diodorus 14.87.2: "When Heloris made a reckless attack upon the acropolis, the Messenians and the mercenaries of Dionysius, who were holding the city, closed ranks and advanced against him" (`sources/diodorus/english/book14-gap-sections.txt`)
- Invented: trigger (Heloris in exile while Messana is yours or allied); reinforcing and the offer; all numbers.

### New people for an empty city

Source: Diodorus 14.58.3, 14.78.5.

- Himilcon razed Messana so that no one would know the site had been lived in. Diodorus 14.58.3: "Himilcon threw down the walls of" (`sources/diodorus/english/book14.loeb.txt`)
- Dionysius settled a thousand Locrians, four thousand Medmaeans and six hundred Peloponnesian Messenians there; Sparta was offended, and he moved the Messenians. Diodorus 14.78.5: "But when he observed that the Lacedaemonians were offended that the Messenians whom they had driven out were settled in a renowned city, he removed them" (`sources/diodorus/english/book14-78-96.txt`)
- Invented: trigger (Messana yours and nearly empty); settling veterans; all numbers.

### Envoys in dismay

Source: Diodorus 14.54.2, 14.48.4.

- As Dionysius laid waste Carthage's territory, the Halicyaeans in dismay sent envoys and made an alliance. Diodorus 14.54.2: "While he was laying waste the countryside, the Halicyaeans in dismay sent an embassy to him and concluded an alliance" (`sources/diodorus/english/book14.loeb.txt`)
- Earlier the Sicani, fearing the size of his army, all went over to him. Diodorus 14.48.4: "Now the Sicani, fearing the great size of the army, all went over to the Syracusans" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (any free or tribute town near your army in enemy land; the source names Halicyae); hostages and refusing; all numbers.
- Note: This is the event form of the island's own rule that towns go over to a great army.

### Your friends driven out

Source: Diodorus 14.88.5.

- After Dionysius' defeat at Tauromenium, Acragas and Messana banished his partisans and renounced his alliance. Diodorus 14.88.5: "After this disaster the Acragantini and Messenians banished the partisans of Dionysius, asserted their freedom, and renounced their alliance with the tyrant" (`sources/diodorus/english/book14-78-96.txt`)
- Invented: trigger (a lost battle or army, and a town that does not love you); silver and threats; all numbers.

### The lord of Agyrium

Source: Diodorus 14.95.4, 14.95.6, 14.96.1.

- Agyris had the strongest armament in Sicily after Dionysius, and twenty thousand citizens. Diodorus 14.95.4: "This man possessed the strongest armament of any of the tyrants of Sicily at that time after Dionysius" (`sources/diodorus/english/book14-78-96.txt`)
- Dionysius entered the city with a small company and won him with the promise of land. Diodorus 14.95.6: "after entering the city with a small company, persuaded Agyris to join him as a genuine ally and promised to make him a present of a large portion of neighbouring territory" (`sources/diodorus/english/book14-78-96.txt`)
- Invented: trigger (Carthage's army in the interior; the source tells it of Magon's campaign); sending envoys; all numbers.

### The Sicels waver

Source: Diodorus 14.58.1.

- The Sicels, who had long hated Dionysius, went over to Carthage, all but Assorus; he strengthened the forts and stored the Leontine harvest in its citadels. Diodorus 14.58.1: "The Siceli, who had hated Dionysius from of old and now had an opportunity to revolt, went over in a body, with the exception of the people of Assorus, to the Carthaginians" (`sources/diodorus/english/book14.loeb.txt`)
- He was most concerned to fortify the citadels of Leontini and store the harvest of the plains there. Diodorus 14.58.1: "He was most concerned, however, to fortify the citadels of the Leontines and to store in them the harvest from the plains" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger; buying them off with land; all numbers (the Sicels are shown as men joining Carthage's army).

### The hill of Taurus

Source: Diodorus 14.59.2, 14.88.1 to 14.88.4.

- Sicels walled the peak of Taurus and named it Tauromenium. Diodorus 14.59.2: "since those who gathered remained ( menein ) upon Taurus, they named the city Tauromenium" (`sources/diodorus/english/book14.loeb.txt`)
- The Sicels held that the land had been their ancestors' before the Greeks founded Naxos. Diodorus 14.88.1: "that these parts of the island had been the possession of the Siceli, when Greeks first landed there and founded Naxos" (`sources/diodorus/english/book14-78-96.txt`)
- Dionysius attacked on a moonless stormy winter night, broke in, and was thrown out; more than six hundred died. Diodorus 14.88.2 to 14.88.4: "more than six hundred of Dionysius' troops were slain and most of them lost their complete armour, while Dionysius himself saved only his corslet" (`sources/diodorus/english/book14-78-96.txt`)
- Invented: trigger; the treaty and leaving them; all numbers.
- Note: A failure here counts as a lost battle, so towns that do not love you may drive out your friends (Diodorus 14.88.5, the event 'Your friends driven out').

### The Sicel lords

Source: Diodorus 14.78.7.

- After the war Dionysius campaigned against the Sicels, took Menaenum and Morgantina, and made treaties with Agyris, Damon and the Herbitaeans and Assorini. Diodorus 14.78.7: "in the course of which he took Menaenum and Morgantinum and struck a treaty with Agyris, the tyrant of the Agyrinaeans, and Damon, the lord of the Centoripans" (`sources/diodorus/english/book14-78-96.txt`)
- Invented: trigger (peace made with Carthage); all numbers.

### Archonides founds a city

Source: Diodorus 14.16.1 to 14.16.2.

- Archonides of Herbita, after peace with Dionysius, founded Halaesa with mercenaries and refugees. Diodorus 14.16.1: "For he had not only many mercenaries but also a mixed throng who had streamed into the city in connection with the war against Dionysius" (`sources/diodorus/english/book14-1-18-97-117.loeb.txt`)
- He occupied a hill eight stades from the sea and called the city Halaesa Archonidion. Diodorus 14.16.2: "he occupied a hill lying eight stades from the sea, on which he founded the city of Halaesa" (`sources/diodorus/english/book14-1-18-97-117.loeb.txt`)
- Invented: trigger (peace with Carthage, or three towns yours or allied); hiring and gifts; all numbers.
- Note: Diodorus also reports that some said Halaesa was founded by the Carthaginians (14.16.4).

### The Italian Greeks choose a general

Source: Diodorus 14.103.4 to 14.103.5.

- The Italian Greeks gave Croton, with the most Syracusan exiles, the conduct of the war. Diodorus 14.103.4: "Since the city of the Crotoniates was the most heavily populated and had the largest number of exiles from Syracuse, they gave over to them the command of the war" (`sources/diodorus/english/book14-1-18-97-117.loeb.txt`)
- They chose Heloris as general, trusting his hatred of the tyrant. Diodorus 14.103.5: "chose as general Heloris the Syracusan. Since this man had been banished by Dionysius" (`sources/diodorus/english/book14-1-18-97-117.loeb.txt`)
- Invented: trigger (four or more towns yours or allied, and Heloris in exile); the choices; all numbers.
- Note: Diodorus places this after 395; the game lets it happen whenever the situation arises. Italy stays names only in Phase 2.

### Carthage in mourning

Source: Diodorus 14.76.2 to 14.77.5.

- Carthage was suddenly anxious for its own homeland. Diodorus 14.76.2: "of a sudden were forced to be anxious for their own fatherland" (`sources/diodorus/english/book14.loeb.txt`)
- The city was seized by superstitious fear and voted to propitiate the gods. Diodorus 14.77.4: "the entire city was seized by superstitious fear and dread" (`sources/diodorus/english/book14.loeb.txt`)
- They made their most renowned citizens priests of Demeter and Kore, and chose Greeks living among them to serve. Diodorus 14.77.5: "they appointed their most renowned citizens to be priests of these goddesses" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (Carthage's army lost or sent home); your choices; all numbers.

### Walls fallen down

Source: Diodorus 14.56.4 to 14.56.5.

- At Messana, with Himilcon near, the walls had fallen down and there was no time to repair them; families and goods were sent to neighbouring cities. Diodorus 14.56.4: "their walls had fallen down and that the situation allowed no time for their repair. Consequently they removed from the city their children and wives and most valuable possessions to neighbouring cities" (`sources/diodorus/english/book14.loeb.txt`)
- Others trusted an old oracle that Carthaginians would carry water in Messana. Diodorus 14.56.5: "Carthaginians must be bearers of water in" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger (any weakly walled town near Carthage's army; the source tells it of Messana); sending help; all numbers.

### Ships in the Great Harbour

Source: Diodorus 14.62.2.

- Himilcon's fleet, decked with spoils, entered the Great Harbour of Syracuse in order and dismayed the city. Diodorus 14.62.2: "Himilcon decked his ships with the spoils taken from the enemy and put in at the great harbour of the Syracusans, and he caused great dismay among the inhabitants of the city" (`sources/diodorus/english/book14.loeb.txt`)
- Invented: trigger; the choices; all numbers (Diodorus' 250 warships and 3,000 merchantmen are not used).

## Invented events

These have no source. Some borrow a situation the sources describe; the note says which.

- **The baggage is late**
- **Fever in the lines**: The causes the physicians name follow Diodorus 14.70.4 to 14.70.5 (crowding, the season, the water, marshy ground), but this event is invention.
- **Punic silver for a captain**
- **The harvest is waiting**
- **Carthage's envoys**
- **An offer to come over**
- **A rumor from Carthage: the general on trial**: The Hundred is the game's bloc from Aristotle, Politics 1273a, written decades later (see data/carthage.json). The accuser is one of the generated cast.
- **A rumor from Carthage: a merchant's word**
- **A rumor from Carthage: the dockyards cry for war**
- **A rumor from Libya**: Diodorus tells of the Libyans' great rising after the war of 396 (14.77, not among the saved sections). This event is invention.
- **The captain of the garrison**
- **A sally from the walls**
- **Talk of surrender**
