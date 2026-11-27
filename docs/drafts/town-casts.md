# Town casts: who held each island town, and who wanted it, 410 to 390 BC (draft)

Research draft only. Nothing here changes game code or data. It is written for the town boards (council 2B in `docs/council/2026-11-27-war-and-geopolitics.md`), which are now in the engine behind their switch: each town's three highest census houses sit as its seats and lean your way, to Carthage, or to the town alone. This draft gives every town a fixed cast that could take those seats, with `town-casts.json` beside it in the census house shape.

**How to read a town.** The map line says how the island map has it. **Who held power, and who wanted it** is history: every quote was opened in a saved text, with its passage. **Blank** says plainly what the texts leave out. **The cast** lists 4 to 8 people or houses, real ones first. A REAL person's *Did* line is history; their stances, gate and move are game proposals, like everything on an INVENTED house. **Politics in three lines** is invention built on the passages above it. **On the board in 405** is the three highest houses on stage when play starts, which is what the town boards would seat.

**Each house gives:** whom it leans to at the start; its stance to Syracuse, to Carthage and to its own common people; what it would open a gate for (for the unwalled tribute towns, what would turn it); and one move of its own. *Leans your way* means toward the player's Syracuse.

**Sources.** Checked on 2026-11-27 against the saved texts in the Phoenician-Punic World repo (read-only): Diodorus books 13 and 14 (Loeb, Oldfather), Thucydides 6 to 7 (Crawley), Pausanias 5.25 (Jones) and Nigro 2022 on Motya. Diodorus 14.37.5 and 14.40 come from this repo's own excerpts file, `sources/diodorus/book14-19-40.loeb.excerpts.txt`. Passage numbers without an author are Diodorus.

**Dates** are Diodorus' archon years, which straddle two of ours, so every "about" can be a year either way. Thucydides' lines are from 415 to 413 and are marked as background.

**Names.** Invented people take names from `docs/research/names.md`. None takes the name of a real person of these years, of the starting cast or of the reserved list in `data/census.json`. Each given name is used at most twice, in different towns. The three Sikel names saved are all kept off the living, so the one Sikel headman has no name.

**Already cast, pointed to and not repeated:** the Syracusans (the starting cast, `docs/research/cast-405-395.md`, `docs/drafts/rising-cast.md`), Biton of Syracuse and the leader of the exiles at Aetna (both in the starting cast), Archylus and Heloris (`rising-cast.md`), and Agyris (`campaign-briefs.md`). Carthage's own city is left to the Carthage cast; the Sicilian towns Carthage held are here.

## At a glance

| Town | On the map | Real people named | Invented | On the board in 405 |
|---|---|---|---|---|
| Syracuse | yes | already cast | none | skipped by the boards |
| Leontini | yes | none | 5 | Lysimachus son of Hicetas (town), Hippocrates son of Telines (town), Thrasydaeus son of Polyzelus (you) |
| Catana | yes | Arcesilaus | 5 | Arcesilaus (you), Adranodorus son of Themistus (Carthage), Timocrates son of Zoippus (town) |
| Naxos | no | Procles | 4 | Procles (you), Megacles son of Theodotes (town), Themistus son of Lysimachus (town) |
| Messana | yes | Laomedon | 6 | Theodotes son of Deinocrates (town), Archagathus son of Timocrates (you), Laomedon (town) |
| Gela | yes | Dexippus | 5 | Thrasybulus son of Lysimachus (Carthage), Archagathus son of Hicetas (Carthage), Pasiphilus son of Zoippus (town) |
| Acragas | yes | Argeius, Antisthenes, Exaenetus | 4 | Antisthenes (town), Argeius (town), Zoippus son of Hicetas (Carthage) |
| Motya | yes | Daimenes, Biton | 4 | Bostar son of Gisco (Carthage), Carthalo son of Malchus (Carthage), Sibbolet daughter of Adherbal (town) |
| Panormus | yes | none | 5 | Maharbal son of Sapho (Carthage), Bodostor son of Hasdrubal (town), Synalus son of Bostar (Carthage) |
| Aetna | yes | none | 4 | the exiles' leader (no name) (town), Hippocrates son of Polyzelus (town), Theodotes son of Zoippus (town) |
| Camarina | no | Menes | 3 | Menes (town), Lysimachus son of Thrasybulus (town), Timocrates son of Theodotes (Carthage) |
| Selinus | no | Empedion | 3 | Empedion (Carthage), Deinocrates son of Telines (you), Philistion son of Archagathus (town) |
| Himera | no | Diocles (a Syracusan) | 3 | Crinippus son of Hicetas (Carthage), Thrasybulus son of Philistion (you), Damarata daughter of Megacles (town) |

Unnamed real people (the Aetna leader, the generals of Messana, the rich men of Gela) are not counted as named. The Invented column counts invented houses, including those that stand for a real but nameless group.

## Syracuse

*Your city; the town boards skip it.*

### Who held power, and who wanted it

kind: history

**Held:**

- From 405 Dionysius: the peace said "the Syracusans shall be subject to Dionysius" (13.114.1).

**Wanted:**

- The exiles. About 408 Diocles, who had led the people, was sent away: "Diocles was exiled" (13.75.5). After 405 the exiles gathered at Aetna (see Aetna) and across the strait: the Syracusans "who had been exiled by Dionysius, for most of them were at that time resident in Rhegium" (14.40.2).

**Blank:** Not blank: Syracuse is the one town the texts fill. Its people are already cast, so they are pointed to here and not cast again.

**Cast:** The starting cast in the game's people file, `docs/research/cast-405-395.md` and `docs/drafts/rising-cast.md` (Leptines, Heloris, Philistus, Theodorus, Nicoteles, Damon the smith and the rest). The rising cast's ladder and yearly moves are where Syracuse's own politics live.

**Pictures** (Wikimedia Commons pages, as listed in the Phoenician-Punic World repo): [Coins of Syracuse and Agrigento, Paolo Orsi museum](https://commons.wikimedia.org/wiki/File:Monete_di_Siracusa_e_Agrigento_-_Museo_Paolo_Orsi.jpg).

## Leontini

*A free town, walled, leaning neither way.*

### Who held power, and who wanted it

kind: history

**Held:**

- 406: Acragas' refugees "made their home in Leontini, the Syracusans having given them this city for their dwelling-place" (13.89.4).
- 405: "This city was at that time an outpost of the Syracusans, being full of exiles and foreigners." Dionysius counted on them, "desiring as they did a change of government" (13.95.3), and there the people voted him "a guard of six hundred soldiers" (13.95.5).
- 405: "the Geloans and Camarinaeans, who were at odds with Dionysius, left him and departed to Leontini" (13.113.4). The peace then said "the inhabitants of Leontini and Messenê and the Siceli shall all live under laws of their own making" (13.114.1).

**Wanted:**

- Dionysius. His first march on it, about 403, came to nothing (14.14.3 to 14.14.4). The second time he told them to "hand over their city and enjoy citizenship in Syracuse", and the Leontines, "reflecting on the fate of the Naxians and Catanians", "left their city, and removed to Syracuse" (14.15.4).
- 396: he was "most concerned" to "fortify the citadels of the Leontines and to store in them the harvest from the plains" (14.58.1).
- About 396/5: his mercenaries, "who numbered about ten thousand", took "in lieu of their pay the city and territory of the Leontines", "because the territory was good land" (14.78.2 to 14.78.3).
- Earlier, as background: "some Leontine exiles" pleaded at Athens for help in 415 (Thucydides 6.19.1).

**Blank:** Blank for names. No Leontine is named in any saved text of these years, and who ran the town in 405 to 403 is not said. The cast is invented on the groups the texts do give: the refugees and exiles, the Syracusan outpost, the grain of the plain and, after 396, the mercenaries.

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. Lysimachus son of Hicetas** · INVENTED · the first man of Leontini · 405 to 403 · stands for the town alone

- *Syracuse:* Sells it grain and fears being swallowed by it. *Carthage:* Far away; Carthage's peace left Leontini free (13.114.1). *Own people:* Speaks for the old townsmen against the refugees Syracuse settled on them.
- *Opens the gate for:* Syracusan citizenship for every household, with the old farms kept: the terms Dionysius in fact offered (14.15.4).
- *Own move:* Calls the assembly to hand the town over before a siege, so that no one is sold as the Naxians were.

**2. Thrasydaeus son of Polyzelus** · INVENTED · an exile of Acragas, settled in Leontini · 405 · leans your way

- *Syracuse:* Backs Dionysius, who took up the refugees' anger at the generals (13.91.2 to 13.91.3). *Carthage:* Hates it: it razed his city (13.108.2). *Own people:* Billets his people on the townsmen, who resent it.
- *Opens the gate for:* A war on Carthage and a road home to Acragas.
- *Own move:* Goes home to Acragas once the peace lets its people back (13.114.1), taking his house off this board.

**3. Hippocrates son of Telines** · INVENTED · a refugee of Gela, here since 405 · 405 to 404 · stands for the town alone

- *Syracuse:* Against Dionysius: his people walked out on him (13.113.4). *Carthage:* Against: it took his city. *Own people:* Leads the Geloan families camped in the town.
- *Opens the gate for:* Never for Dionysius; for the exiles at Aetna, if they came.
- *Own move:* Spreads the charge that Dionysius gave Gela up on purpose, the talk Diodorus reports in 13.112.1.

**4. Deinocrates son of Archagathus** · INVENTED · a grain-lord of the Leontine plain · 405 to 403 · leans your way

- *Syracuse:* Sells it his grain. *Carthage:* Would sell to its army just as gladly. *Own people:* His tenants work the plain; he lends them seed at a price.
- *Opens the gate for:* His estates kept and a fair price for the harvest.
- *Own move:* Holds back the harvest to raise the price before a siege.

**5. Acestorides son of Pyrrhicus** · INVENTED · a captain of the mercenaries given Leontini, from about 396 · 396 to 395 · leans your way

- *Syracuse:* Took the land in place of his pay (14.78.2) and still wants the rest. *Carthage:* Fought it in 396. *Own people:* His men are the new townsmen; the old ones went to Syracuse in 403 (14.15.4).
- *Opens the gate for:* Back pay.
- *Own move:* Marches his men to the citadel to demand their pay "with some sharpness", as the ten thousand did at Syracuse (14.78.2).

**On the board in 405:** Lysimachus son of Hicetas (stands for the town alone); Hippocrates son of Telines (stands for the town alone); Thrasydaeus son of Polyzelus (leans your way).

### Politics in three lines

kind: invention, built on the passages above

- In: the refugees and exiles Syracuse put there, who gave Dionysius his guard (13.95.3 to 13.95.5).
- Out: the Leontines themselves, unnamed in every line; that they resented the newcomers is invention.
- What splits them: whether to trust Dionysius. Acragas' refugees backed him; Gela's and Camarina's walked out on him (13.113.4). After 396 the mercenaries are the town.

**Best passage:** 13.95.3, "This city was at that time an outpost of the Syracusans, being full of exiles and foreigners."

## Catana

*A free town, walled, leaning a little to Carthage.*

### Who held power, and who wanted it

kind: history

**Held:**

- Background, 415: it refused the Athenians, "there being a Syracusan party in the town" (Thucydides 6.50.3). A man who "was a native of Catana" carried a false message for Athens, naming "members of their party still left in the city" (6.64.2).
- About 403: "Arcesilaüs, the general of the Catanians, had offered to betray the city to him. Consequently, being admitted by Arcesilaüs about midnight, he became master of Catanê. After taking their arms from the citizens, he placed an adequate garrison in the city" (14.15.1).
- Then Dionysius sold the Catanians, "selling the captives he took as booty in Syracuse", and "granted to the Campanians the city of the Catanians as their dwelling-place" (14.15.3).

**Wanted:**

- Rhegium, "colonists of Chalcis", was angered that he had sold "the Naxians and Catanians, their kinsmen" (14.40.1). About 394 Rhegium "settled in Mylae the surviving Naxians and Catanians" (14.87.1).
- 396: Dionysius moved the Campanians "who were dwelling in Catanê" to Aetna (14.58.2), and Carthage's fleet, after the sea battle, "anchored their triremes in the harbour of Catanê" (14.60.7).

**Blank:** Arcesilaus is the only Catanian named, in one sentence. What he was paid, whether he went to Syracuse and what became of him are not told. The people who were sold have no names.

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. Arcesilaus, general of the Catanians** · REAL (one sentence) · the general of the Catanians · 405 to 403 · leans your way

- *Did:* He "had offered to betray the city" and let Dionysius in "about midnight" (14.15.1).
- *Syracuse:* Sold it the city. *Carthage:* Not stated. *Own people:* Disarmed, then sold, after he opened the gate (14.15.1, 14.15.3).
- *Opens the gate for:* He opened it himself. His price is not given; at Naxos the price was "great promises" (14.15.2).
- *Own move:* Offers the gate from inside, before any siege.

**2. Timocrates son of Zoippus** · INVENTED · the harbour-master of Catana · 405 to 403 · stands for the town alone

- *Syracuse:* Trades with it and fears its fleet. *Carthage:* Would water its ships, as its fleet later used the harbour (14.60.7). *Own people:* Pays the rowers and dockmen.
- *Opens the gate for:* The harbour dues left in his hands under any master.
- *Own move:* Sells grain and timber to whichever fleet is in the bay.

**3. Adranodorus son of Themistus** · INVENTED · a landowner under Aetna · 405 to 403 · leans to Carthage

- *Syracuse:* Fears Dionysius' horsemen in his fields. *Carthage:* Sees Carthage's peace of 405 as the one thing holding Dionysius back. *Own people:* His tenants; he keeps them fed and quiet.
- *Opens the gate for:* None for Dionysius; for a Carthaginian army that promised to leave his land alone.
- *Own move:* Sends a man to Carthage's officers with an offer of supplies.

**4. Philistion son of Megacles** · INVENTED · a friend of Rhegium · 405 to 403 · stands for the town alone

- *Syracuse:* Against: Catana and Naxos are Rhegium's kin, Chalcidians (14.40.1). *Carthage:* Against. *Own people:* For the assembly over the general.
- *Opens the gate for:* Rhegium's army.
- *Own move:* Asks Rhegium to send men before Dionysius comes.

**5. Magius son of Vibius, captain of the Campanians** · INVENTED, standing for a REAL group · captain of the Campanians given Catana · 403 to 396 · leans your way

- *Syracuse:* Housed by Dionysius in a sold city (14.15.3); moved by him to Aetna in 396 (14.58.2). *Carthage:* At Aetna his men "would gladly have joined the Carthaginians" but were held by hostages (14.61.6). *Own people:* His men took the Catanians' houses.
- *Opens the gate for:* Land and a share of the spoils, Himilcon's offer (14.61.5), once the hostages are home.
- *Own move:* Holds the walls for whoever pays. From 396 the house sits at Aetna (see Aetna).

**6. Pasiphilus son of Crinippus** · INVENTED · a Catanian who escaped the sale, at Mylae about 394 · 394 · stands for the town alone

- *Syracuse:* Wants Dionysius dead. *Carthage:* Would take its help. *Own people:* He is what is left of them.
- *Opens the gate for:* Any army that takes him home.
- *Own move:* Joins Rhegium's war on Messana, which began as his people were settled at Mylae (14.87.1).

**On the board in 405:** Arcesilaus (leans your way); Adranodorus son of Themistus (leans to Carthage); Timocrates son of Zoippus (stands for the town alone). Divided three ways, so it sends nothing.

### Politics in three lines

kind: invention, built on the passages above

- In: the general Arcesilaus and the men on the walls (14.15.1).
- Out: the citizens, who lost their arms and then their freedom (14.15.1, 14.15.3).
- What splits them: Syracuse or Rhegium and the Chalcidian kin (14.40.1). That the old Syracusan party of 415 (Thucydides 6.50.3) was behind Arcesilaus is my reading, not stated.

**Best passage:** 14.15.1, "being admitted by Arcesilaüs about midnight, he became master of Catanê"

**Pictures** (Wikimedia Commons pages, as listed in the Phoenician-Punic World repo): [A tetradrachm of Catana signed by Euaenetus, about 420 BC](https://commons.wikimedia.org/wiki/File:Catania,_tetradracma_firmata_euainetos,_420_ac.JPG).

## Naxos

*Not on the island map; in the places file only, gone after about 403.*

### Who held power, and who wanted it

kind: history

**Held:**

- Background, 415: the Athenians were "Received by the Naxians" (Thucydides 6.50.3).
- About 403: "Procles, the commander of the Naxians, on being won over by great promises, delivered over his native city to Dionysius, who, after paying the promised gifts to the traitor and granting him his kinsmen, sold the inhabitants into slavery, turned their property over to the soldiers to plunder, and razed the walls and the dwellings" (14.15.2).

**Wanted:**

- The Sikels. Dionysius gave "the territory of the Naxians" to "the neighbouring Siceli" (14.15.3). In 396 Siceli took the peak of Taurus, Siceli "who, however, had no leader" (14.59.1); "having been induced by Himilcon's offers, they occupied this peak", walled it, and "named the city Tauromenium" (14.59.2).
- About 394/3 they held it against Dionysius, saying "they had only recovered territory that belonged to their fathers" (14.88.1); "Dionysius himself saved only his corslet" (14.88.4). The peace of 392 gave him the town; he "banished most of the Siceli who were in it" (14.96.4).
- The Naxians who survived: Rhegium settled them at Mylae (14.87.1); the Messenians took Mylae and "let the Naxians who had been settled there go free under a truce", and they "made their dwelling some in one place and others in another" (14.87.3).

**Blank:** Procles is the only Naxian named. The Sikels of Taurus are named by no one; Diodorus says they "had no leader" (14.59.1).

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. Procles, commander of the Naxians** · REAL (one sentence) · the commander of the Naxians · 405 to 403 · leans your way

- *Did:* Won over "by great promises", he handed the city over; Dionysius paid "the promised gifts" and granted "him his kinsmen" (14.15.2).
- *Syracuse:* Sold it the city. *Carthage:* Not stated. *Own people:* Let them be sold into slavery by the man he let in; only his own kin were spared.
- *Opens the gate for:* Great promises, paid in gifts, and his own kin spared (14.15.2).
- *Own move:* Names his price to Dionysius before the army comes.

**2. Megacles son of Theodotes** · INVENTED · a leader of the Naxian assembly · 405 to 403 · stands for the town alone

- *Syracuse:* Against. *Carthage:* Against. *Own people:* Their voice.
- *Opens the gate for:* None; he would arm the people for the walls.
- *Own move:* Moves in the assembly to take the command from Procles.

**3. Themistus son of Lysimachus** · INVENTED · a friend of Rhegium · 405 to 403 · stands for the town alone

- *Syracuse:* Against: Rhegium was "of the same blood" as Naxos (14.40.1). *Carthage:* No dealings. *Own people:* For them.
- *Opens the gate for:* Rhegium's ships.
- *Own move:* Sends envoys across the strait for help.

**4. the headman of the Sikels on Taurus (no name)** · INVENTED, standing for a REAL group · a headman of the Sikels given Naxos' land · 403 to 392 · leans to Carthage

- *Syracuse:* Took the land as Dionysius' gift (14.15.3), then held the hill against him (14.88.1 to 14.88.4). *Carthage:* Took its offers in 396 (14.59.2). *Own people:* Claims the hill for the Sikels' fathers (14.88.1).
- *Opens the gate for:* None; the hill is theirs by right.
- *Own move:* Walls the peak and names the town (14.59.2).
- *Name:* No Sikel name is free: the three saved are kept off the living. The generator's rule would give him a Sicilian Greek name.

**5. Zoippus son of Philistion** · INVENTED · a Naxian survivor, at Mylae about 394 · 394 · stands for the town alone

- *Syracuse:* Hates Dionysius. *Carthage:* Neither. *Own people:* The scattered.
- *Opens the gate for:* A home.
- *Own move:* Leaves Mylae under the truce and looks for a town that will take him (14.87.3).

**On the board in 405:** Procles (leans your way); Megacles son of Theodotes (stands for the town alone); Themistus son of Lysimachus (stands for the town alone).

### Politics in three lines

kind: invention, built on the passages above

- In: the commander Procles, who held the gate (14.15.2).
- Out: the people, who had no say and were sold (14.15.2).
- What splits them: Dionysius' gifts against Rhegium's kinship (14.15.2, 14.40.1). After 403 the town is gone and its land passes to the Sikels.

**Best passage:** 14.15.2, "after paying the promised gifts to the traitor and granting him his kinsmen, sold the inhabitants into slavery"

## Messana

*A free town on the strait, walled, leaning neither way.*

### Who held power, and who wanted it

kind: history

**Held:**

- Background, 415: when a plot to let Athens in was betrayed, word went "to the friends of the Syracusans in Messina, who had at once put to death its authors" (Thucydides 6.74.1).
- About 408 Hermocrates, "after he had arrived at Messenê, he had five triremes built and hired a thousand soldiers" (13.63.2). In 409 half of Himera's people sailed "as far as Messenê" (13.61.5).
- 404: Messana and Rhegium sent triremes to the Syracusans who rose against Dionysius, "being eager to support them in the cause of freedom" (14.8.2).
- About 399, Rhegium's generals "induced the generals of the Messenians to join in the war". "Now the generals were won over by the Rhegians and, without obtaining a vote of the people," "led forth their forces". Then "opposition broke out among the soldiers due to a harangue delivered by the Messenian Laomedon"; "for he advised them not begin a war against Dionysius who had done them no wrong", and "since the people had not approved the war", the soldiers went home, "deserting their generals" (14.40.3 to 14.40.5).

**Wanted:**

- Dionysius: about 398 he "made a present to the Messenians of a large piece of territory on their borders, binding them to him by such a benefaction" (14.44.4).
- Himilcon: in 396 he wanted it because "it had an excellent harbour, capable of accommodating all his ships" (14.56.1). The town "could not agree among themselves about the war" (14.56.3). One party, seeing "their own cavalry were at Syracuse" and that "their walls had fallen down", "removed from the city their children and wives and most valuable possessions to neighbouring cities" (14.56.4). Another trusted an oracle, "Carthaginians must be bearers of water in Messenê" (14.56.5), and "selected the ablest troops from among their young men and dispatched them to Peloris" (14.56.6). Himilcon took it and "threw down the walls of Messenê" (14.58.3).
- 395: Dionysius "settled in Messenê a thousand Locrians, four thousand Medmaeans, and six hundred Messenians from the Peloponnesus", then moved the last to a new town: "The Messenians named their city Tyndaris" (14.78.5 to 14.78.6).
- About 394 Rhegium sent Heloris against it; "the Messenians and the mercenaries of Dionysius, who were holding the city" beat him (14.87.2). Soon after, "the Acragantini and Messenians banished the partisans of Dionysius, asserted their freedom, and renounced their alliance with the tyrant" (14.88.5), and Magon "launched an attack upon the territory of Messenê" (14.90.3).

**Blank:** Laomedon is the only Messenian named. The generals of about 399, the leaders of the two parties of 396 and the partisans banished about 393 have no names.

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. Laomedon the Messenian** · REAL (one passage) · a Messenian who spoke against the war (no office given) · 405 to 396 · stands for the town alone

- *Did:* His "harangue" turned the army home; he said not to war on Dionysius "who had done them no wrong" (14.40.4 to 14.40.5).
- *Syracuse:* No war with Dionysius. *Carthage:* Not stated. *Own people:* With the people's vote: the soldiers went home "since the people had not approved the war" (14.40.5).
- *Opens the gate for:* None; he keeps the town out of other men's wars.
- *Own move:* Speaks to the levy on the march and turns it home (14.40.4 to 14.40.5): a move that cancels the town's support.

**2. Theodotes son of Deinocrates** · INVENTED, standing for a REAL group · the first man of Messana, one of its generals about 399 · 405 to 396 · stands for the town alone

- *Syracuse:* Against Dionysius: led the army out with Rhegium (14.40.4). *Carthage:* No dealings until 396. *Own people:* Goes over their heads, "without obtaining a vote of the people" (14.40.4).
- *Opens the gate for:* Rhegium's generals.
- *Own move:* Takes the levy out without a vote.

**3. Archagathus son of Timocrates** · INVENTED · a shipowner of the strait · 405 to 396 · leans your way

- *Syracuse:* Carries timber and grain to Syracuse and wants the strait quiet. *Carthage:* Fears for his ships if it comes. *Own people:* Hires the rowers.
- *Opens the gate for:* His ships safe and the harbour open.
- *Own move:* Carries word of Rhegium's plans to Syracuse.

**4. Micythus son of Nypsius** · INVENTED · a friend of Rhegium · 405 to 396 · stands for the town alone

- *Syracuse:* Against; Rhegium shelters the Syracusan exiles (14.40.2). *Carthage:* Against. *Own people:* For the vote.
- *Opens the gate for:* Rhegium's army.
- *Own move:* Brings Rhegium's generals across the strait to win over Messana's (14.40.3).

**5. Polyzelus son of Thrasybulus** · INVENTED, standing for a REAL group · head of the party that sent its families away in 396 · 405 to 396 · stands for the town alone

- *Syracuse:* Sees no help coming: their own horse were at Syracuse (14.56.4). *Carthage:* Thinks it cannot be held off with the walls down (14.56.4). *Own people:* Saves his own and leaves the rest.
- *Opens the gate for:* Safe conduct for his household.
- *Own move:* Sends wives, children and valuables to neighbouring towns (14.56.4).

**6. Hicetas son of Pasiphilus** · INVENTED, standing for a REAL group · head of the party of the oracle in 396 · 405 to 396 · stands for the town alone

- *Syracuse:* Will fight beside it. *Carthage:* Sure it will lose, by the oracle (14.56.5). *Own people:* Leads the young men out.
- *Opens the gate for:* Never.
- *Own move:* Sends the ablest young men to hold Peloris (14.56.6).

**7. Crinippus son of Hippocrates, a Locrian** · INVENTED · a Locrian settled in Messana in 395 · 395 to 393 · leans your way

- *Syracuse:* Owes his land to Dionysius (14.78.5). *Carthage:* Against. *Own people:* The old Messenians see him as Dionysius' man.
- *Opens the gate for:* Dionysius' army, any day.
- *Own move:* Holds the town with Dionysius' mercenaries (14.87.2). If the board turns, he is one of "the partisans of Dionysius" banished (14.88.5).
- *Name:* A Sicilian Greek name by the generator's rule: the Italian Greek pool has only two names free.

**On the board in 405:** Theodotes son of Deinocrates (stands for the town alone); Archagathus son of Timocrates (leans your way); Laomedon (stands for the town alone).

### Politics in three lines

kind: invention, built on the passages above

- In: the generals, who could take the army out "without obtaining a vote of the people" (14.40.4).
- Out: the people and the men who spoke for them, like Laomedon, until the soldiers walked home (14.40.5).
- What splits them: Rhegium or Dionysius; and in 396, flee or fight (14.56.3 to 14.56.6).

**Best passage:** 14.40.4 to 14.40.5, the generals marched "without obtaining a vote of the people," and the army went home "since the people had not approved the war"

## Gela

*Pays tribute to Carthage, no walls, leaning a little your way.*

### Who held power, and who wanted it

kind: history

**Held:**

- 406: the Spartan Dexippus "was tarrying in Gela, enjoying high regard by reason of the city of his birth", and led "fifteen hundred mercenaries" to Acragas (13.85.3).
- 405: Gela "at that time was under the eye of Dexippus, the Lacedaemonian, who had been put in charge by the Syracusans" (13.93.1).
- "when Dionysius on arrival found the wealthiest citizens engaged in strife with the people, he accused them in an assembly and secured their condemnation, whereupon he put them to death and confiscated their possessions" (13.93.2). The people thought him "responsible for their liberation; for in their envy of the most influential citizens they stigmatized the superiority these men possessed as a despotism over themselves" (13.93.3).

**Wanted:**

- Dionysius, who tried to win Dexippus, "and when Dexippus would not join with him" went home (13.93.4); later "Dexippus the Lacedaemonian he dismissed to Greece", "lest he should seize a favourable opportunity and restore to the Syracusans their liberty" (13.96.1).
- Carthage, 405: it took "a bronze statue of Apollo of colossal size" and sent it "to Tyre" (13.108.4). The Geloans voted to send their families to Syracuse, "but when the women fled to the altars about the market-place and begged to share the same fortune as the men, they yielded to them" (13.108.6).
- After Dionysius led them out by night, "the hatred against Dionysius was flaring up" (13.112.1), and the Geloans, "at odds with Dionysius", went to Leontini (13.113.4). The peace let them back to a town "which shall be unfortified, but shall pay tribute to the Carthaginians" (13.114.1).
- 397: "He received first the levy from Camarina, then those of Gela and Acragas" (14.47.6). In 396 Theodorus says Dionysius "betrayed Gela and Camarina and made these cities desolate" (14.68.2), in a speech Diodorus wrote.

**Blank:** Dexippus is the only person named at Gela, and he is a Spartan. The rich men killed in 405 and the people's leaders have no names.

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. Dexippus the Lacedaemonian** · REAL (a few lines) · the Spartan put in charge of Gela by the Syracusans · 406 to 405 · stands for the town alone

- *Did:* Put "in charge by the Syracusans" (13.93.1); "would not join" Dionysius (13.93.4); sent "to Greece" (13.96.1). At Acragas the story was that he took "a bribe of fifteen talents" (13.88.7).
- *Syracuse:* Syracuse's officer, but not Dionysius' man (13.93.4, 13.96.1). *Carthage:* Fought it at Acragas; accused there of treachery (13.87.5), a story only. *Own people:* A foreigner over them, whose guards were paid from the rich men's goods (13.93.2).
- *Opens the gate for:* The Syracusan state, not its new master.
- *Own move:* Refuses to join the ruler. Left in place, he is the man who might "restore to the Syracusans their liberty" (13.96.1). Off the board before play starts.

**2. Thrasybulus son of Lysimachus** · INVENTED, standing for a REAL group · son of one of the rich men put to death in 405 · 405 to 395 · leans to Carthage

- *Syracuse:* Dionysius killed his father and took the estate (13.93.2). *Carthage:* Its tribute-men might give back what Dionysius took. *Own people:* They cheered his father's death (13.93.3).
- *Opens the gate for:* His father's land back, from anyone.
- *Own move:* Carries the charge that Dionysius gave Gela up on purpose (13.112.1) to Carthage's officers.

**3. Archagathus son of Hicetas** · INVENTED · a landowner back from exile · 405 to 395 · leans to Carthage

- *Syracuse:* Fled it; came home under Carthage's peace. *Carthage:* Pays its tribute (13.114.1) and wants its protection. *Own people:* Wary of them.
- *Opens the gate for:* Gela has no walls (13.114.1). What turns him: a promise to keep his land under any master.
- *Own move:* Pays the tribute early to win Carthage's favour.

**4. Pasiphilus son of Zoippus** · INVENTED, standing for a REAL group · a leader of the Geloan people · 405 to 395 · stands for the town alone

- *Syracuse:* Hailed Dionysius as their liberator (13.93.3 to 13.93.4), then turned on him after the night flight (13.112.1). *Carthage:* Against. *Own people:* Theirs; he shares their envy of "the most influential citizens" (13.93.3).
- *Opens the gate for:* The rich men's land shared out.
- *Own move:* Carries a decree of honours to a ruler who pleases the people (13.93.4).

**5. Telines son of Megacles** · INVENTED · a priest of the old temples · 405 to 395 · leans your way

- *Syracuse:* Will back any war that brings the god home. *Carthage:* It carried off Apollo to Tyre (13.108.4). *Own people:* Keeps their festivals.
- *Opens the gate for:* An army that swears to bring Apollo back.
- *Own move:* Calls for war at every festival.

**6. Damarete daughter of Polyzelus** · INVENTED · a widow who led the women to the altars in 405 · 405 to 395 · stands for the town alone

- *Syracuse:* Will not be sent there (13.108.6). *Carthage:* Against. *Own people:* Speaks for the families.
- *Opens the gate for:* None while the men stand.
- *Own move:* Fills the altars to stop a vote to send the families away (13.108.6).

**On the board in 405:** Thrasybulus son of Lysimachus (leans to Carthage); Archagathus son of Hicetas (leans to Carthage); Pasiphilus son of Zoippus (stands for the town alone).

### Politics in three lines

kind: invention, built on the passages above

- In: "the wealthiest citizens", until Dionysius had them condemned (13.93.2), and the Spartan put in charge (13.93.1).
- Out: the people, who called the rich men's standing "a despotism over themselves" (13.93.3).
- What splits them: rich against poor, which Dionysius used; after 405, the blame for the night flight (13.112.1).

**Best passage:** 13.93.3, "in their envy of the most influential citizens they stigmatized the superiority these men possessed as a despotism over themselves"

## Acragas

*Pays tribute to Carthage, no walls, leaning a little your way.*

### Who held power, and who wanted it

kind: history

**Held:**

- Background, 413: Syracuse sent Sicanus "to Agrigentum where there was a revolution" (Thucydides 7.46.1); he failed, "the party friendly to the Syracusans having been driven out" (7.50.1).
- The rich: "perhaps the richest man was Tellias", who told his servants to "invite every stranger to be his guest" (13.83.1). "Antisthenes at any rate, who was called Rhodus", married off his daughter, and "more than eight hundred chariots followed the bride" (13.84.1). In 412 Exaenetus of Acragas won the foot race at Olympia and came home with "three hundred chariots belonging to citizens of Acragas" (13.82.7).
- 406: Carthage asked them "to become their allies, but otherwise to stay neutral"; they "would not entertain these terms" (13.85.2). In the assembly "Menes of Camarina, who had been put in command, came forward and lodged an accusation against the Acragantine generals"; the crowd "killed four of them, but the fifth, Argeius by name, who was very much younger, they spared" (13.87.5).

**Wanted:**

- Carthage: the city was left; Tellias "set fire to the temple and burned himself together with the dedications in it" (13.90.2); the refugees in Syracuse "lodged accusations against their generals" (13.91.2). In 405 Himilcon "razed to the ground the city of the Acragantini" (13.108.2). The peace let its people back, unwalled and paying tribute (13.114.1).
- Dionysius: its levy joined him in 397 (14.47.6). About 394/3 "the Acragantini and Messenians banished the partisans of Dionysius" (14.88.5).
- Undated: Pausanias says "war was waged by the Agrigentines" on Motye, which was "inhabited by Libyans and Phoenicians", and the spoils paid for bronze boys at Olympia (Pausanias 5.25.5).

**Blank:** Who led the town after its people came back is not named, nor who led the banishing about 393. The rich men named are known from Timaeus' stories of the old city, and whether they lived past 406 is not told, except Tellias, who died.

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. Argeius, the general the crowd spared** · REAL (one sentence) · the fifth general of 406, spared by the crowd · 405 to 395 · stands for the town alone

- *Did:* The crowd killed four generals; "the fifth, Argeius by name, who was very much younger, they spared" (13.87.5).
- *Syracuse:* The relief army's commander accused him and his colleagues (13.87.5). *Carthage:* Fought it. *Own people:* They stoned his colleagues and spared him for his youth.
- *Opens the gate for:* None for any army; he has seen what happens to generals who fail.
- *Own move:* Speaks for whatever the assembly already wants.

**2. Antisthenes called Rhodus** · REAL (one story, from Timaeus; alive after 406 not known) · the horse-breeder, whose daughter's wedding had eight hundred chariots · 405 to 395 · stands for the town alone

- *Did:* At his daughter's wedding "more than eight hundred chariots followed the bride" (13.84.1).
- *Syracuse:* Its alliance cost him his city. *Carthage:* Its peace lets him keep his horses. *Own people:* He feasted the whole citizen body at the wedding (13.84.1).
- *Opens the gate for:* His estates and horses kept.
- *Own move:* Throws a feast for the citizens to win the assembly.

**3. Zoippus son of Hicetas** · INVENTED · the man who collects Carthage's tribute · 405 to 395 · leans to Carthage

- *Syracuse:* Against: Syracuse's war would end his office. *Carthage:* Its man; the tribute passes through his hands (13.114.1). *Own people:* Squeezes them, and keeps a share.
- *Opens the gate for:* Carthage's army; for Syracuse, a promise that he keeps his office.
- *Own move:* Raises the tribute on his enemies' land.

**4. Megacles son of Tellias** · INVENTED · heir of Tellias, who kept the wine-cellars · 405 to 395 · leans your way

- *Syracuse:* Wants it to make war on Carthage. *Carthage:* His father burned himself in Athena's temple rather than be taken (13.90.2). *Own people:* Keeps his father's open door for strangers (13.83.1).
- *Opens the gate for:* A war that rebuilds the city.
- *Own move:* Opens what is left of the cellars, once "three hundred great casks hewn out of the very rock" (13.83.3), to feed a levy for Dionysius.
- *Name:* Tellias is real; this son is invented.

**5. Exaenetus the runner** · REAL (one sentence; fate not known) · Olympic foot-race winner of 412 · 405 to 395 · stands for the town alone

- *Did:* Won at Olympia in 412 and came home with "three hundred chariots belonging to citizens of Acragas" (13.82.7).
- *Syracuse:* Not stated. *Carthage:* Not stated. *Own people:* Their champion.
- *Opens the gate for:* Not stated; in play, the young men follow him.
- *Own move:* Stands for general with the crowd behind him.

**6. Polyzelus son of Timocrates** · INVENTED, standing for a REAL group · of the old party friendly to Syracuse, now Dionysius' partisan · 405 to 393 · leans your way

- *Syracuse:* Its old friend: his party was driven out in 413 (Thucydides 7.50.1). *Carthage:* Against. *Own people:* They drove his party out once and will again.
- *Opens the gate for:* Dionysius.
- *Own move:* Sends the levy to Dionysius first (14.47.6). Banished with "the partisans of Dionysius" about 393 if the board turns (14.88.5).

**7. Themistus son of Deinocrates** · INVENTED · a leader of the returned people, about 393 · 395 to 393 · stands for the town alone

- *Syracuse:* Against: leads the banishing of Dionysius' partisans (14.88.5). *Carthage:* Willing to deal: Magon "showed kindness to the subject cities" (14.90.3). *Own people:* Theirs.
- *Opens the gate for:* Carthage's army, if it keeps the town free of Dionysius.
- *Own move:* Banishes Dionysius' friends (14.88.5).

**On the board in 405:** Antisthenes (stands for the town alone); Argeius (stands for the town alone); Zoippus son of Hicetas (leans to Carthage).

### Politics in three lines

kind: invention, built on the passages above

- In: the generals and the rich houses, until the assembly stoned four generals in 406 (13.87.5).
- Out: the crowd, which in that hour was the real power; after 405 the friends of Syracuse, banished about 393 (14.88.5).
- What splits them: who lost the city, and whether to trust Syracuse again (13.91.2, 14.88.5).

**Best passage:** 13.87.5, "killed four of them, but the fifth, Argeius by name, who was very much younger, they spared"

**Pictures** (Wikimedia Commons pages, as listed in the Phoenician-Punic World repo): [Coins of Syracuse and Agrigento, Paolo Orsi museum](https://commons.wikimedia.org/wiki/File:Monete_di_Siracusa_e_Agrigento_-_Museo_Paolo_Orsi.jpg).

## Motya

*Carthage's town, strongly walled, leaning hard to Carthage.*

### Who held power, and who wanted it

kind: history

**Held:**

- Carthage: Motya was "a Carthaginian colony, which they used as their chief base of operations against Sicily" (14.47.4). In 406 Carthage "summoned forty triremes from Panormus and Motyê" (13.88.4). About 408 Hermocrates "laid waste the territory of the inhabitants of Motyê" (13.63.4).
- 397: the Motyans were "expecting aid from the Carthaginians", knowing Syracuse would strike first "because it was most loyal to the Carthaginians" (14.48.1); they held out "even though they had for the moment no allies to help them" (14.51.2).
- They fought "with their wives and children before their eyes" (14.52.1). "Most appalling for the Phoenicians and the greatest cause of their despair was the thought how cruelly they had used their Greek captives and the prospect of their suffering the same treatment" (14.52.2).
- The sack yielded "much silver and not a little gold, as well as costly raiment" (14.53.3). Dionysius "rewarded Archylus, who had been the first to mount the wall, with one hundred minas", sold the Motyans who lived, and "he crucified Daïmenes and other Greeks who had fought on the side of the Carthaginians and had been taken captive" (14.53.4).

**Wanted:**

- Dionysius, then Carthage again: he left it "under the command of Biton of Syracuse; and the garrison was composed largely of Siceli" (14.53.5). In 396 "Himilcon reduced Motyê by siege" (14.55.4).
- The place itself: an inscription "found in a votive pit beside the south-eastern corner of the pool" carries a Greek dedication to Ba'al, and the sacred precinct ran from 550 to 397/396 BC (Nigro 2022, [doi:10.15184/aqy.2022.8](https://doi.org/10.15184/aqy.2022.8)). Pausanias calls the town "inhabited by Libyans and Phoenicians" (5.25.5), though he puts it at the wrong end of the island.

**Blank:** Blank for the Motyans themselves. No Phoenician of Motya is named in any saved text, and how the town governed itself is not told (`war-and-towns.md` says the same). The two names are a Greek who fought for Carthage (Daimenes) and Syracuse's garrison commander (Biton).

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. Daimenes and the Greeks of Motya** · REAL (one sentence) · a Greek who fought for Carthage at Motya · 405 to 397 · leans to Carthage

- *Did:* Crucified with "other Greeks who had fought on the side of the Carthaginians" (14.53.4).
- *Syracuse:* Fights it to the end. *Carthage:* Fights for it. *Own people:* Lives among the Motyans; the Greek dedication in the sacred pool (Nigro 2022) hints that Greeks worshipped there too.
- *Opens the gate for:* None: a Greek who fought for Carthage could expect no mercy from Syracuse.
- *Own move:* Holds a tower to the last.

**2. Biton of Syracuse** · REAL (one sentence; already in the starting cast) · Dionysius' commander of the garrison, 397 to 396 · 397 to 396 · leans your way

- *Did:* Left in command, with a garrison "composed largely of Siceli" (14.53.5).
- *Syracuse:* Its man. *Carthage:* Its besieger in 396 (14.55.4). *Own people:* Holds a town whose people were sold.
- *Opens the gate for:* Already cast: see `rising-cast.md`, where his own move is to make terms to save his garrison.
- *Own move:* See `rising-cast.md`.

**3. Bostar son of Gisco** · INVENTED · the first man of Motya · 405 to 397 · leans to Carthage

- *Syracuse:* Its enemy. *Carthage:* Its colony's first man; waits for its fleet (14.48.1). *Own people:* Holds them together by fear of the sack (14.52.1 to 14.52.2).
- *Opens the gate for:* Only Carthage's relief.
- *Own move:* Breaks the causeway to the shore, as "the Motyans breached" it in 397 (14.48.2), and readies the town for siege.

**4. Sibbolet daughter of Adherbal** · INVENTED · the dyer and trader (census role), a widow who runs the dye-works · 405 to 397 · stands for the town alone

- *Syracuse:* Sells cloth to Greek buyers in peace. *Carthage:* Loyal while its ships come. *Own people:* Employs many of the town's workers.
- *Opens the gate for:* Her stores, her ships and her people spared. The one Motyan who might bargain.
- *Own move:* Sends a ship to Carthage begging for the fleet, and a second, secretly, to sound out Syracuse.
- *Name:* Sibbolet is a businesswoman's name from a Carthage gravestone (names.md).

**5. Carthalo son of Malchus** · INVENTED · the shipwright of the harbour · 405 to 397 · leans to Carthage

- *Syracuse:* Its enemy. *Carthage:* Builds and mends its triremes. *Own people:* His yard feeds many families.
- *Opens the gate for:* None.
- *Own move:* Mans the masts with fire-throwers, as the Motyans did (14.51.2).

**6. Zarzas son of Naravas** · INVENTED · head of a Libyan household of Motya · 405 to 397 · stands for the town alone

- *Syracuse:* Fears it most. *Carthage:* Serves it but owes it little. *Own people:* One of them.
- *Opens the gate for:* His family's freedom, not to be sold.
- *Own move:* Hides his family's silver in the cisterns.

**On the board in 405:** Bostar son of Gisco (leans to Carthage); Carthalo son of Malchus (leans to Carthage); Sibbolet daughter of Adherbal (stands for the town alone).

### Politics in three lines

kind: invention, built on the passages above

- In: the Phoenician houses of Carthage's "chief base" (14.47.4), unnamed.
- Out: no one we can see; Greeks lived and fought there on Carthage's side (14.53.4).
- What splits them: nothing the texts show. Fear held them together: of the sack, and of paying for how they had treated Greek captives (14.52.2).

**Note:** The playtest of PR 97 found that Motya hardly ever changes sides. The texts agree: they call it "most loyal" (14.48.1) and show no party inside it. This cast keeps that, but gives the board one house that stands for the town (the dye-works), so a long siege or a big bribe has something to work on.

**Best passage:** 14.52.2, "the thought how cruelly they had used their Greek captives and the prospect of their suffering the same treatment"

**Pictures** (Wikimedia Commons pages, as listed in the Phoenician-Punic World repo): [Motya's walls](https://commons.wikimedia.org/wiki/File:Murs_Mozia.jpg); [Motya's north gate](https://commons.wikimedia.org/wiki/File:Mozia-nordwesttor-heiligtum-b.JPG); [Motya's sacred pool (the "kothon") from the north](https://commons.wikimedia.org/wiki/File:Mozia-kothon-von-norden-hdr.jpg).

## Panormus

*Carthage's town, walled, leaning hard to Carthage.*

### Who held power, and who wanted it

kind: history

**Held:**

- Carthage. About 408 Hermocrates ravaged its land, and "when the inhabitants offered battle en masse before the city he slew about five hundred of them and shut up the rest within their walls" (13.63.4). In 406 its triremes sailed with Motya's: "forty triremes from Panormus and Motyê" (13.88.4).
- 397: "of the rest of the cities only five remained loyal to the Carthaginians, these being Halicyae, Solûs, Aegesta, Panormus, and Entella" (14.48.4). Dionysius "plundered the territory of Solûs and Panormus" and "cut down the trees on it" (14.48.5).

**Wanted:**

- 396: Carthage's great landing came here: "After Himilcon had put in at Panormus and disembarked his army" (14.55.4). Theodorus blames Dionysius for not fighting: "First of all at Panormus, when the enemy were disembarking" (14.68.5).

**Blank:** Blank. No one at Panormus is named in any saved text, and nothing is told of who led it. The cast is invented on the census roles and on the one thing the texts show: its people came out and fought for their fields.

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. Maharbal son of Sapho** · INVENTED · the first man of Panormus · 405 to 395 · leans to Carthage

- *Syracuse:* Its enemy. *Carthage:* Carthage's landing place (14.55.4); he hosts its generals. *Own people:* Leads them out to fight for their fields (13.63.4).
- *Opens the gate for:* Only Carthage.
- *Own move:* Readies the harbour and stores for Carthage's army.

**2. Bodostor son of Hasdrubal** · INVENTED · a merchant of the harbour · 405 to 395 · stands for the town alone

- *Syracuse:* Trades with Greek towns when there is peace. *Carthage:* Pays its harbour dues; resents its levies. *Own people:* Hires porters and boatmen.
- *Opens the gate for:* Trade kept open and his warehouses spared.
- *Own move:* Buys up grain before Carthage's army lands.

**3. Synalus son of Bostar** · INVENTED · a priest of Baal (census role) · 405 to 395 · leans to Carthage

- *Syracuse:* The enemy of the gods. *Carthage:* The mother city. *Own people:* Keeps the festivals and the sacrifices.
- *Opens the gate for:* None.
- *Own move:* Calls for the town to arm when Dionysius' men cut the trees (14.48.5).

**4. Adherbal son of Malchus** · INVENTED · captain of the town's levy · 405 to 395 · leans to Carthage

- *Syracuse:* Its enemy. *Carthage:* Carthage's. *Own people:* Leads the men who "offered battle en masse" (13.63.4).
- *Opens the gate for:* None.
- *Own move:* Marches out to fight raiders in the fields.

**5. Heraclia daughter of Crinippus** · INVENTED · a Himeraean widow who keeps a trading house at Panormus · 405 to 395 · stands for the town alone

- *Syracuse:* Her kin fight for it (14.47.6). *Carthage:* Her hosts, who razed her city (13.62.4). *Own people:* A stranger among them.
- *Opens the gate for:* A safe road for her household.
- *Own move:* Carries news between Panormus and the Greek towns.

**On the board in 405:** Maharbal son of Sapho (leans to Carthage); Bodostor son of Hasdrubal (stands for the town alone); Synalus son of Bostar (leans to Carthage).

### Politics in three lines

kind: invention, built on the passages above

- In: Carthage's friends, which the texts make the whole town (14.48.4).
- Out: no one named; the Greek traders and the many strangers in a port are invention.
- What splits them: nothing the texts show. The town fought as one for its land (13.63.4).

**Best passage:** 13.63.4, "when the inhabitants offered battle en masse before the city he slew about five hundred of them"

## Aetna

*The exiles' fortress, strongly walled, leaning against you.*

### Who held power, and who wanted it

kind: history

**Held:**

- 405: "The main body of the cavalry which was left fled from the city and occupied Aetnê" (13.113.3).
- 404: "more than seven thousand of them were gathered with the cavalry at Aetnê" (14.9.5). Dionysius sent envoys "asking the exiles to accept terms and return to their native land" (14.9.6). "Now certain of them, who had left behind children and wives, felt compelled to accept the offer"; the rest, reminded that he had buried their dead, said he deserved the same, and "they prayed to the gods that they might, the sooner the better, see him obtain it" (14.9.7). They "would by no means put any trust in the tyrant, remained in Aetnê, watching for an opportunity against him" (14.9.8).

**Wanted:**

- About 403 Dionysius "won the fortress, the exiles there being no match for an army of such size" (14.14.2). About 400 he "founded in Sicily a city just below the crest of Mount Aetnê", "and named it Adranum, after a certain famous temple" (14.37.5, this repo's excerpts).
- 396: he moved the Campanians of Catana to Aetna, "since it was an exceptionally strong fortress" (14.58.2). Himilcon "sent ambassadors to the Campanians who held Aetnê, urging them to revolt from Dionysius" (14.61.4), promising "to give them a large amount of territory and to let them share in the spoils of the war" (14.61.5). "But since the Campanians had given hostages to Dionysius and had sent their choicest troops to Syracuse, they were compelled to maintain the alliance with Dionysius, although they would gladly have joined the Carthaginians" (14.61.6).

**Blank:** Blank for names. The leader of the exiles is real but no saved text names him (he is already in the starting cast without a name). The Campanian captains are not named either.

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. the leader of the exiles at Aetna (no name)** · REAL (real, never named; already in the starting cast) · leader of the exiles · 405 to 403 · stands for the town alone

- *Did:* The cavalry "fled from the city and occupied Aetnê" (13.113.3); the hard core stayed "watching for an opportunity against him" (14.9.8).
- *Syracuse:* Against Dionysius; for the Syracuse of before 405. *Carthage:* Not stated. *Own people:* The exiles are of every sort, rich riders and common men.
- *Opens the gate for:* Already cast; not repeated here.
- *Own move:* Already cast; not repeated here.

**2. Theodotes son of Zoippus** · INVENTED · a cavalryman who fled Syracuse (census role) · 405 to 403 · stands for the town alone

- *Syracuse:* Rode against Dionysius in 405 (13.113.3). *Carthage:* Not his friend, but no worse than the tyrant. *Own people:* A rich man's son among poor exiles.
- *Opens the gate for:* Opens for no one; he wants to ride out, not let anyone in.
- *Own move:* Raids Dionysius' farms from the hill.

**3. Hippocrates son of Polyzelus** · INVENTED, standing for a REAL group · an exile who lost his land, with wife and children left in Syracuse · 405 to 404 · stands for the town alone

- *Syracuse:* Will take the terms to see his family (14.9.7). *Carthage:* Against. *Own people:* One of the many.
- *Opens the gate for:* His family safe and his land given back.
- *Own move:* Leaves the fortress under Dionysius' word (14.9.7), and his house goes home.

**4. Thrasydaeus son of Megacles** · INVENTED, standing for a REAL group · a young hothead of the exiles (census role) · 405 to 403 · stands for the town alone

- *Syracuse:* Prays for Dionysius' death (14.9.7). *Carthage:* Would take its help against the tyrant. *Own people:* Rouses the poorer exiles.
- *Opens the gate for:* Anyone marching on Syracuse.
- *Own move:* Answers the envoys with a curse (14.9.7).

**5. Magius son of Vibius, captain of the Campanians** · INVENTED, standing for a REAL group · captain of the Campanians at Aetna, from 396 · 396 to 395 · leans your way

- *Syracuse:* Bound by the hostages he gave and the men he sent (14.61.6). *Carthage:* Would gladly join it (14.61.6). *Own people:* His men hold the fortress.
- *Opens the gate for:* Himilcon's offer, land and spoils (14.61.5), once the hostages are free.
- *Own move:* Sends to Himilcon in secret, and waits.
- *Same house as in Catana:* it moved here in 396 (14.58.2).

**On the board in 405:** the exiles' leader (no name) (stands for the town alone); Hippocrates son of Polyzelus (stands for the town alone); Theodotes son of Zoippus (stands for the town alone).

### Politics in three lines

kind: invention, built on the passages above

- In (405 to 403): the exiled horsemen and the seven thousand who joined them (14.9.5).
- Out: the exiles with families in Syracuse, who took the terms and went (14.9.7). From 396 the Campanians hold it for Dionysius.
- What splits them: trust in Dionysius' word against hatred of him (14.9.7 to 14.9.8).

**Best passage:** 14.9.7, "they prayed to the gods that they might, the sooner the better, see him obtain it"

## Camarina

*Not on the island map; one of Carthage's tribute towns in the places file.*

### Who held power, and who wanted it

kind: history

**Held:**

- Background, 415: Syracuse feared that "the Camarinaeans had not sent what they did send for the first battle very willingly" (Thucydides 6.75.3); "Hermocrates, with some others, accordingly arrived at Camarina from Syracuse, and Euphemus and others from the Athenians" to argue before its assembly (6.75.4).
- 406, at Acragas: "Menes of Camarina, who had been put in command, came forward and lodged an accusation against the Acragantine generals" (13.87.5).

**Wanted:**

- 405: Dionysius "compelled the residents of that city also to depart with their children and wives to Syracuse"; "some gathered together silver and gold and whatever could be easily carried", and "some, who were aged or suffering from illness, were left behind because they had no relatives or friends" (13.111.3). The Camarinaeans, "at odds with Dionysius", went to Leontini (13.113.4). The peace made them a tribute town (13.114.1).
- 397: "He received first the levy from Camarina" (14.47.6). In 396 Theodorus says he "betrayed Gela and Camarina" (14.68.2).

**Blank:** Menes is the only Camarinaean named, at Acragas, not at home. Who led Camarina in these years is not told.

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. Menes of Camarina** · REAL (one sentence) · a commander at Acragas in 406 · 405 to 395 · stands for the town alone

- *Did:* He "lodged an accusation against the Acragantine generals" and "so incited all who were present" that four were stoned (13.87.5).
- *Syracuse:* Served with the Syracusan-led army; his town later broke with Dionysius (13.113.4). *Carthage:* Fought it. *Own people:* Knows how to turn a crowd on its generals (13.87.5).
- *Opens the gate for:* None stated; in play, whoever the assembly wants.
- *Own move:* Accuses a town's generals before the assembly: the move Dionysius himself made at Syracuse.

**2. Timocrates son of Theodotes** · INVENTED · a rich man who carried his silver out in 405 · 405 to 395 · leans to Carthage

- *Syracuse:* Blames Dionysius for the flight (14.68.2). *Carthage:* Pays its tribute and keeps his silver. *Own people:* Left the old and sick behind (13.111.3); they remember.
- *Opens the gate for:* His silver safe.
- *Own move:* Pays Carthage's tribute for the whole town and takes a hold over it.

**3. Lysimachus son of Thrasybulus** · INVENTED, standing for a REAL group · led his people to Leontini rather than Syracuse in 405 · 405 to 395 · stands for the town alone

- *Syracuse:* Against Dionysius (13.113.4). *Carthage:* Against. *Own people:* Brought them home.
- *Opens the gate for:* None for Dionysius.
- *Own move:* Takes his people to Leontini (13.113.4).

**4. Hicetas son of Megacles** · INVENTED · captain of the levy that joined Dionysius first in 397 · 397 to 395 · leans your way

- *Syracuse:* Marches with it (14.47.6). *Carthage:* War on it means the end of the tribute. *Own people:* His men are the town's farmers.
- *Opens the gate for:* War on Carthage.
- *Own move:* Brings the levy first of all the towns (14.47.6).

**On the board in 405:** Menes (stands for the town alone); Lysimachus son of Thrasybulus (stands for the town alone); Timocrates son of Theodotes (leans to Carthage).

### Politics in three lines

kind: invention, built on the passages above

- In: no one named at home; Menes held a command abroad (13.87.5).
- Out: the old and the poor, left behind in the flight of 405 (13.111.3).
- What splits them: whether Dionysius saved them or sold them (13.113.4, 14.68.2).

**Best passage:** 13.111.3, "some, who were aged or suffering from illness, were left behind because they had no relatives or friends"

## Selinus

*Not on the island map; one of Carthage's tribute towns in the places file.*

### Who held power, and who wanted it

kind: history

**Held:**

- 410: the Selinuntians wanted "to carve off for themselves a large portion of the neighbouring territory", so Segesta put itself in Carthage's hands (13.43.3).
- 409: after the sack, "twenty-six hundred in number, made their way in safety to Acragas" (13.58.3). "Empedion had always favoured the cause of the Carthaginians and before the siege had counselled the citizens not to go to war against the Carthaginians"; Hannibal gave back his goods, "his kinsmen who were among the captives", and let the survivors "dwell in the city and to cultivate its fields upon payment of tribute to the Carthaginians" (13.59.3).

**Wanted:**

- About 408 Hermocrates, with "above a thousand of the Himeraeans who had been driven from their home", took the town: "seizing Selinus he built a wall about a part of the city and called to him from all quarters the Selinuntians who were still alive" (13.63.3).
- 405: a tribute town by the peace (13.114.1). 397: Dionysius marched to Motya "after adding the men of Selinus, as he passed by" (14.47.6).

**Blank:** Empedion is the only Selinuntian named. Who led the town after 408 is not told.

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. Empedion of Selinus** · REAL (one passage) · the man who had counselled peace with Carthage · 405 to 395 · leans to Carthage

- *Did:* He "had always favoured the cause of the Carthaginians" and was given back his goods and kin (13.59.3).
- *Syracuse:* Against its wars. *Carthage:* Its friend, rewarded for it (13.59.3). *Own people:* He got his kin back when theirs were sold.
- *Opens the gate for:* Carthage, always; for Syracuse, nothing.
- *Own move:* Goes to Carthage's general on the town's behalf, as he did in 409.

**2. Deinocrates son of Telines** · INVENTED · a survivor who came back with Hermocrates about 408 · 405 to 395 · leans your way

- *Syracuse:* Hermocrates' man, and so Syracuse's (13.63.3). *Carthage:* Took his city. *Own people:* Gathered them back from all quarters (13.63.3).
- *Opens the gate for:* A Syracusan army.
- *Own move:* Rebuilds a stretch of the wall the peace forbids.

**3. Philistion son of Archagathus** · INVENTED · a survivor farming under the tribute · 405 to 395 · stands for the town alone

- *Syracuse:* Wants no more wars. *Carthage:* Pays and hates paying. *Own people:* One of them.
- *Opens the gate for:* A year without soldiers in his fields.
- *Own move:* Hides the harvest from the tribute-men.

**4. Adranodorus son of Hicetas** · INVENTED · captain of the men who joined Dionysius in 397 · 397 to 395 · leans your way

- *Syracuse:* Marches with it (14.47.6). *Carthage:* Against. *Own people:* Leads the young men.
- *Opens the gate for:* War on Carthage.
- *Own move:* Joins the army as it passes (14.47.6).

**On the board in 405:** Empedion (leans to Carthage); Deinocrates son of Telines (leans your way); Philistion son of Archagathus (stands for the town alone). Divided three ways, so it sends nothing.

### Politics in three lines

kind: invention, built on the passages above

- In, under Carthage: Empedion, whose friendship with Carthage saved his house (13.59.3).
- Out: those who had wanted the war, and Hermocrates' men, who came back with a wall the peace did not allow (13.63.3).
- What splits them: Carthage's tribute against Syracuse's war.

**Best passage:** 13.59.3, "Empedion had always favoured the cause of the Carthaginians and before the siege had counselled the citizens not to go to war"

**Pictures** (Wikimedia Commons pages, as listed in the Phoenician-Punic World repo): [Temples A, B and C at Selinus](https://commons.wikimedia.org/wiki/File:Temples_A,_B,_and_C_at_Selinunte_sel26.jpg); [Temple C at Selinus from the air](https://commons.wikimedia.org/wiki/File:Selinunte_Temple_C_aerial_view.jpg).

## Himera

*Not on the island map; razed in 409, a tribute town in the places file.*

### Who held power, and who wanted it

kind: history

**Held:**

- 409: "Diocles, who commanded the forces in Himera" (13.61.3), a Syracusan, advised a retreat; they would "embark half the populace on the triremes" (13.61.4). "Although the Himeraeans complained indignantly at this conclusion", the ships carried women, children and others "as far as Messenê" (13.61.5).
- Hannibal took it and "the city he razed to the ground, two hundred and forty years after its founding"; of the men, "some three thousand" were tortured and killed where his grandfather fell (13.62.4).

**Wanted:**

- About 408, "above a thousand of the Himeraeans who had been driven from their home" joined Hermocrates (13.63.3). About 407 Carthage "founded in Sicily right at the warm (therma) springs a city which they named Therma" (13.79.8).
- 397: Dionysius "sent for the Himeraeans, whose home was on the other side of Sicily" (14.47.6). 396: Himilcon "formed relations of friendship with the Himeraeans and the dwellers in the fort of Cephaloedium" (14.56.2).

**Blank:** Blank for Himeraeans. No man of Himera is named in these years; Diocles was a Syracusan. Where the Himeraeans of 397 lived is not said beyond "the other side of Sicily".

### The cast

kind: history for the REAL people's *Did* lines; kind: invention for everything else.

**1. Diocles the Syracusan** · REAL (a Syracusan; exiled about 408, so not a seat) · the Syracusan who commanded at Himera in 409 · 409 to 408 · not a seat

- *Did:* Commanded at Himera (13.61.3); "Diocles was exiled" about 408 (13.75.5).
- *Syracuse:* A leader of its people until his exile (13.75.5). *Carthage:* Fought it, then gave up the town. *Own people:* The Himeraeans "complained indignantly" at his plan (13.61.5).
- *Opens the gate for:* Not a seat: he is gone before play starts.
- *Own move:* In the story of Himera only.

**2. Thrasybulus son of Philistion** · INVENTED, standing for a REAL group · a Himeraean who marched with Hermocrates about 408 · 405 to 395 · leans your way

- *Syracuse:* Fought for Hermocrates (13.63.3) and answers Dionysius' call (14.47.6). *Carthage:* Killed his kin (13.62.4). *Own people:* Speaks for the families who were shipped out.
- *Opens the gate for:* Any war on Carthage.
- *Own move:* Brings the Himeraeans to Dionysius in 397 (14.47.6).

**3. Crinippus son of Hicetas** · INVENTED, standing for a REAL group · a Himeraean who made friends with Himilcon in 396 · 405 to 395 · leans to Carthage

- *Syracuse:* Thinks it brought only ruin. *Carthage:* Makes terms with it (14.56.2). *Own people:* Wants them left in peace on their farms.
- *Opens the gate for:* Carthage's peace.
- *Own move:* Takes Himilcon's friendship for the town (14.56.2).

**4. Damarata daughter of Megacles** · INVENTED · a widow among those shipped to Messana in 409 · 405 to 395 · stands for the town alone

- *Syracuse:* Its ships saved her and left her husband behind (13.61.4 to 13.61.5). *Carthage:* Killed him (13.62.4). *Own people:* Keeps the names of the dead.
- *Opens the gate for:* A place to bury her dead.
- *Own move:* Asks every army for leave to rebuild the old town.

**On the board in 405:** Crinippus son of Hicetas (leans to Carthage); Thrasybulus son of Philistion (leans your way); Damarata daughter of Megacles (stands for the town alone). Divided three ways, so it sends nothing.

### Politics in three lines

kind: invention, built on the passages above

- In: no one; the town was razed in 409 (13.62.4).
- Out: its people, scattered to Messana, Hermocrates' camp and "the other side of Sicily" (13.61.5, 13.63.3, 14.47.6).
- What splits them: Dionysius' war (14.47.6) or Himilcon's friendship (14.56.2).

**Best passage:** 13.61.5, "Although the Himeraeans complained indignantly at this conclusion"

## The towns the texts leave blank

Said plainly:

- **Leontini:** no Leontine is named in any saved text of 410 to 390 BC. The texts give only groups: refugees, exiles, the plain's farmers and, after 396, mercenaries.
- **Panormus:** no one is named and nothing is told of who led it. Its people fought for their fields (13.63.4) and stayed loyal to Carthage (14.48.4).
- **Motya:** no Motyan Phoenician is named, and how the town governed itself is not told. The two named men are a Greek who fought for Carthage and Syracuse's garrison commander.
- **Aetna:** the leader of the exiles is real but nameless, and the Campanian captains are nameless too.
- **Himera:** razed in 409; no Himeraean is named in these years.
- **Thin but not blank:** Catana (Arcesilaus, one sentence), Naxos (Procles, one sentence), Messana (Laomedon, one passage), Gela (only the Spartan Dexippus), Camarina (Menes, named at Acragas) and Selinus (Empedion, one passage). Acragas is the fullest, but its rich men are known from stories of the old city before 406.

## Where the sources are thin or disagree

1. **Dexippus.** Diodorus gives the bribe of fifteen talents as "the story" (13.88.7) and the abuse at Acragas as "we are told" (13.87.5). Either way, he is Syracuse's officer at Gela who would not join Dionysius (13.93.4).
2. **Two crowds of Campanians.** Those Dionysius dismissed in 404 "having regard to their fickleness" (14.9.8) seized Entella (14.9.9). The Campanians given Catana about 403 (14.15.3) and moved to Aetna in 396 (14.58.2) are, as far as the texts show, other men in his pay. This draft makes the Catana and Aetna Campanians one house and leaves the Entella men out.
3. **The Sikels of Taurus** "had no leader" in 396 (14.59.1), yet held the hill against Dionysius about 394/3 (14.88). Someone led them by then; no text names him.
4. **Motya's place.** Pausanias puts Motye at Pachynum, the south-east cape (5.25.5). Diodorus puts it near Eryx in the west (14.47.4). Diodorus is right: Nigro places the site "at the centre of the Marsala Lagoon on the western coast of Sicily" (Nigro 2022). Pausanias' line is used only for who lived there, and its war is undated.
5. **Theodorus' charge** that Dionysius betrayed Gela and Camarina (14.68.2) is a speech Diodorus wrote, not a record.
6. **Leontini after 403.** The Leontines moved to Syracuse (14.15.4), yet in 396 Dionysius fortified "the citadels of the Leontines" (14.58.1) and gave the town to mercenaries (14.78.2 to 14.78.3). Who lived there between 403 and 396 is not said.
7. **Who led the Messenian generals.** Diodorus names no general for 399 (14.40.3 to 14.40.5) and no leader for either party of 396 (14.56.3 to 14.56.6).
8. **The Greek dedication at Motya.** Nigro reads it as a dedication to Ba'al by its Greek name; whether Greeks lived in Motya or only visited is not settled by it. Daimenes and the other Greeks fighting there (14.53.4) are the firmer evidence.

## Considered and left out

- **Eryx, Entella, Segesta, Halicyae, Solus, Herbita, Agyrium, Centoripa, Tauromenium and Tyndaris:** real towns of these years, but not on the island map or in the places file. Tauromenium appears under Naxos, Tyndaris under Messana. Agyris of Agyrium and Damon, "the lord of the Centoripans" (14.78.7), would lead a Sikel cast if those towns join the map.
- **Damon of Centoripa** shares a name with the game's invented Damon the smith. If he is ever cast, one of them needs a mark.
- **Hermocrates** at Selinus and Messana (13.63): Dionysius' father-in-law in the starting story, killed about 407 (13.75); he appears in passages only.
- **Heloris** leads Rhegium's attack on Messana (14.87.1); he is in `rising-cast.md`.
- **The Peloponnesian Messenians** settled at Messana and then Tyndaris (14.78.5 to 14.78.6): a group with no names, and their town is off the map.
- **Tellias** died in 406 (13.90.2); he appears only as the father of an invented heir.

## To fetch

- Diodorus 14.19 to 14.39 in full (only excerpts are saved): the gap between the fall of Catana and Naxos and the war of 397.
- Diodorus 14.77.1 to 14.77.3 in English.
- Thucydides 5.4, on Leontini in the 420s, which modern accounts give as the root of the Leontine exiles of 6.19.1. Not saved, so not checked.
- Lilybaeum, which modern accounts say took Motya's place after 397. Not found in the saved texts searched for this draft.
- Any source that names a Motyan, a Panormitan, a Leontine of these years or the leader of the exiles at Aetna. None was found in the saved texts.
- Polyaenus 5 for stories set in these towns (not searched for this draft).

## The JSON file

`docs/drafts/town-casts.json` holds the same cast in the census shape, for a later build to load.

- **bodies:** one per town, in the shape of `data/census.json`'s bodies (id, kind, name, place, tie, houses, standing, groups, roles). The eight map towns keep the census body ids, so a build could swap the generated three houses for these; Naxos, Camarina, Selinus and Himera get new bodies tied to their own place ids and are marked off the map.
- **houses:** the census house shape (id, body, place, head, standing, group, founded), plus the cast: kind, years on stage, start lean (you, carthage or town), the three stances, the gate, the move and the facts behind a REAL house. The Campanian house appears twice, at Catana and then at Aetna, with one head.
- **people:** the heads, in the census person shape where it fits (given, father's name, sex, birth year, group, body, place, house, traits, ambition, role). Biton and the Aetna leader are not repeated: their houses point to the starting cast instead. Real people have no birth year or father's name in the texts, so those are empty. Faces (genes) are left for the generator to roll.
- **towns:** the politics lines, the blank note, the best passage and every history fact with its passage and file.
- The start leans here are proposals from the texts. The engine's own rule seats leans by the town's side and order (`startLean` in the towns code); where the two differ, a build could take either.

## Closing table

| Town | Real people found | Invented | Best passage |
|---|---|---|---|
| Syracuse | already cast (starting cast, rising cast) | none | 13.114.1, "the Syracusans shall be subject to Dionysius" |
| Leontini | none named | 5 | 13.95.3, "This city was at that time an outpost of the Syracusans, being full of exiles and foreigners." |
| Catana | Arcesilaus | 5 | 14.15.1, "being admitted by Arcesilaüs about midnight, he became master of Catanê" |
| Naxos | Procles | 4 | 14.15.2, "after paying the promised gifts to the traitor and granting him his kinsmen, sold the inhabitants into slavery" |
| Messana | Laomedon | 6 | 14.40.4 to 14.40.5, the generals marched "without obtaining a vote of the people," and the army went home "since the people had not approved the war" |
| Gela | Dexippus | 5 | 13.93.3, "in their envy of the most influential citizens they stigmatized the superiority these men possessed as a despotism over themselves" |
| Acragas | Argeius, Antisthenes, Exaenetus | 4 | 13.87.5, "killed four of them, but the fifth, Argeius by name, who was very much younger, they spared" |
| Motya | Daimenes, Biton | 4 | 14.52.2, "the thought how cruelly they had used their Greek captives and the prospect of their suffering the same treatment" |
| Panormus | none named | 5 | 13.63.4, "when the inhabitants offered battle en masse before the city he slew about five hundred of them" |
| Aetna | the exiles' leader (no name) | 4 | 14.9.7, "they prayed to the gods that they might, the sooner the better, see him obtain it" |
| Camarina | Menes | 3 | 13.111.3, "some, who were aged or suffering from illness, were left behind because they had no relatives or friends" |
| Selinus | Empedion | 3 | 13.59.3, "Empedion had always favoured the cause of the Carthaginians and before the siege had counselled the citizens not to go to war" |
| Himera | Diocles (a Syracusan) | 3 | 13.61.5, "Although the Himeraeans complained indignantly at this conclusion" |
