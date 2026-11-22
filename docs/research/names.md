# Names for invented people, and the hired captains

Card for `data/names.json` and the two history records in `data/census.json` (the captains). Written by the cast-generator thread (13), 2026-11-22.

## What this card claims, and what it does not

- **Each name is attested**: a real person carried it, in a passage saved in the phoenician-punic-world repo. The passage is quoted below and checked by `node scripts/verify-cast-quotes.mjs ../phoenician-punic-world`.
- **The invented people who carry these names are invention**, every one: their families, ages, traits, ambitions, roles and faces.
- **Dates vary.** Many attestations are earlier (the tyrants of the 480s and 460s) or later (Agathocles' Syracuse around 310, Hiero's daughters in 214, Capua in 216 to 211, the Mercenary War of 241 to 238, Spain in 212 to 209) than the game's decade. A name in use across these centuries was probably in use in 405 to 395, but that is an inference, not a fact from the sources.
- **The groups are the game's**, not the sources': Sicilian Greeks, Italian Greeks, Sikels, Carthaginians, Libyans, Campanians, Iberians, Gauls, Peloponnesians.
- **The sources name few women.** Seven Sicilian Greek women's names are saved. Carthaginian and Phoenician women's names: Amoashtart (a queen of Sidon, from a modern page), and nine found by the source-search thread (15) and carded in `docs/research/punic-womens-names.md`: one from Livy (Sophoniba), two from Carthage itself (Am-'ashtart, Sibbolet), three from later Neo-Punic stones in North Africa and three from Phoenician Cyprus. The game writes the scholars' spellings plainly (Amashtart, Ahatmilkat, Amatashtart, Amatosir, Batshalom): those spellings are invention, and each record keeps the scholars' form under `spelled`. The game still leaves some women unnamed, as the sources do ("the daughter of Hermocrates", Diodorus 14.44.5): a quarter of Greek women and about a third of Carthaginians. That share is invention (`data/census.json`, `naming.unnamedWomen`).
- **Thin pools.** Italian Greek and Libyan men's names run out in a crowded place, so men borrow from the Sicilian Greek or Carthaginian lists there (`naming.maleFallback`). Carthaginian men's names are few (the same ten or so recur in every source); in a crowded Carthage the game may use a reserved name (Hanno, Mago) rather than give two living men the same two names.
- **Kept off the living:** every name of the starting cast, and names that would be mistaken for real people of this decade or the island thread's invented Carthaginians (`reserved` in `data/census.json`).
- **Two late or foreign extras**, each marked in its record: Annobal (a sufete of Leptis Magna in AD 1 to 2) and Bodashtart (a king of Sidon). Used because the Carthaginian pool is so thin. Cut them if they jar.

## Naming conventions (invention)

- A man is "X son of Y"; a woman "X daughter of Y", and once married her husband's name is added. Two unnamed sisters are told apart by birth order ("the second daughter of Tellias").
- About half of eldest sons are named after their father's father. Modern scholars describe this as a Greek custom; it is **not checked against a saved source**, so it is invention here.

## The hired captains

- Syracuse: Campanian horsemen and Peloponnesian foot. Dionysius moved the Campanians of Catana to Aetna: Diodorus 14.58.2, "He also persuaded the Campanians who were dwelling in Catanê to move to Aetnê" (`sources/diodorus/english/book14.loeb.txt`). Peloponnesian hired men are inferred from the Spartans named in this decade (Aristus, Pharacidas; see the names below), not from a passage about hiring.
- Carthage: Libyans, Iberians and Campanians. Diodorus 13.44.1, "five thousand Libyans and eight hundred Campanians" (about 409 BC, `sources/diodorus/english/book13.loeb.txt`), and 14.54.5, "they gathered armaments from all Libya as well as from Iberia" (the war of 397 to 396, `sources/diodorus/english/book14.loeb.txt`).
- How many captains each side has (four), and the mix, are invention.

## Wanted (in `docs/later.md`)

- More Carthaginian women's names from Carthage itself (Benz 1972; the tophet stelae in CIS I).
- More Italian Greek names (Rhegium, Locri, Croton, Thurii) and Sikel names from saved texts.

## The names

<!-- names: built by tools/build-names-card.mjs -->

### Sicilian Greeks (33 men's names, 7 women's)

Names borne by Greeks of the Sicilian cities in the saved texts, from about 500 to 212 BC.

- **Hermocrates** (man): the father of Dionysius. Diodorus 13.91.3: "do, Dionysius, the son of Hermocrates, taking the floor, accused the generals" (`sources/diodorus/english/book13.loeb.txt`)
- **Athenagoras** (man): leader of the people at Syracuse. Thucydides 6.35.2: "Meanwhile Athenagoras, the leader of the people and" (`sources/sicilian-wars/thucydides-6-7-7-87.crawley.txt`)
- **Diocles** (man): a Syracusan commander. Diodorus 13.59.9: "were under the command of Diocles the Syracusan" (`sources/diodorus/english/book13.loeb.txt`)
- **Heracleides** (man): a Syracusan general. Diodorus 13.4.1: "supreme power, Hermocrates, Sicanus, and Heracleides, who enrolled soldiers and dispatched ambassadors" (`sources/diodorus/english/book13-1-42-91-96.loeb.txt`)
- **Sicanus** (man): a Syracusan general. Diodorus 13.4.1: "generals with supreme power, Hermocrates, Sicanus, and Heracleides, who enrolled soldiers and" (`sources/diodorus/english/book13-1-42-91-96.loeb.txt`)
- **Eucles** (man): a Syracusan general. Thucydides 6.103.4: "were deposed and others, Heraclides, Eucles, and Tellias, elected in their stead" (`sources/sicilian-wars/thucydides-6-7-7-87.crawley.txt`)
- **Tellias** (man): a rich man of Acragas. Diodorus 13.83.1: "perhaps the richest man was Tellias, who had in his mansion a" (`sources/diodorus/english/book13.loeb.txt`)
- **Lysimachus** (man): father of a Syracusan general. Thucydides 6.73.1: "Hermocrates himself, Heraclides, son of Lysimachus, and Sicanus, son of Execestes" (`sources/sicilian-wars/thucydides-6-7-7-87.crawley.txt`)
- **Execestes** (man): father of a Syracusan general. Thucydides 6.73.1: "Lysimachus, and Sicanus, son of Execestes" (`sources/sicilian-wars/thucydides-6-7-7-87.crawley.txt`)
- **Hippocrates** (man): tyrant of Gela. Herodotus 7.154.1: "sovereignty passed to Cleandrus' brother Hippocrates. While Hippocrates was tyrant, Gelon, a" (`sources/sicily-tyrants/herodotus-7-153-167.godley.txt`)
- **Telines** (man): an ancestor of the tyrants of Gela. Herodotus 7.153.2: "as I will show, by Telines, one of their forefathers. There were" (`sources/sicily-tyrants/herodotus-7-153-167.godley.txt`)
- **Thrasybulus** (man): brother of Hieron, ruler of Syracuse. Diodorus 11.66.4: "the kingdom to his brother Thrasybulus, who ruled over the Syracusans for" (`sources/diodorus/english/book11-38-72.loeb.txt`)
- **Thrasydaeus** (man): son of Theron of Acragas. Diodorus 11.48.6: "Subsequently to these events, Thrasydaeus the son of Theron was governing" (`sources/diodorus/english/book11-38-72.loeb.txt`)
- **Polyzelus** (man): brother of Hieron of Syracuse. Diodorus 11.48.3: "observing how popular his brother Polyzelus was among the Syracusans and believing" (`sources/diodorus/english/book11-38-72.loeb.txt`)
- **Megacles** (man): brother of Dion of Syracuse. Plutarch, Dion 28: "brilliant armour, with his brother Megacles on one side of him, and" (`sources/plutarch/dion.perrin.txt`)
- **Timocrates** (man): a friend of the younger Dionysius. Plutarch, Dion 21: "marriage, against her will, to Timocrates, one of his friends. And in" (`sources/plutarch/dion.perrin.txt`)
- **Exaenetus** (man): a runner of Acragas, Olympic victor. Diodorus 13.82.7: "namely, the Ninety-second , when Exaenetus of Acragas won the "stadion," he" (`sources/diodorus/english/book13.loeb.txt`)
- **Antisthenes** (man): a man of Acragas. Diodorus 13.84.1: "many other inhabitants of Acragas. Antisthenes at any rate, who was called" (`sources/diodorus/english/book13.loeb.txt`)
- **Empedion** (man): an envoy of the fugitives from Selinus. Diodorus 13.59.3: "since the fugitives had sent Empedion as an ambassador, to him Hannibal" (`sources/diodorus/english/book13.loeb.txt`)
- **Menes** (man): a man of Camarina. Diodorus 13.87.5: "tumult prevailed in the assembly, Menes of Camarina, who had been put" (`sources/diodorus/english/book13.loeb.txt`)
- **Argeius** (man): one of the generals of Acragas. Diodorus 13.87.5: "of them, but the fifth, Argeius by name, who was very much" (`sources/diodorus/english/book13.loeb.txt`)
- **Theodotes** (man): a Syracusan noble at the younger Dionysius' court. Plutarch, Dion 12: "had been in conference with Theodotes and Heracleides concerning a subversion of" (`sources/plutarch/dion.perrin.txt`)
- **Hicetas** (man): a Syracusan, friend of Dion. Plutarch, Dion 58: "they were taken up by Hicetas the Syracusan, who had been one" (`sources/plutarch/dion.perrin.txt`)
- **Timaeus** (man): the historian of Sicily whom Diodorus cites. Diodorus 14.54.6: "Timaeus, on the other hand, says that" (`sources/diodorus/english/book14.loeb.txt`)
- **Deinocrates** (man): a Syracusan whom Agathocles spared for their old friendship. Diodorus 19.8.6: "together the prisoners, he let Deinocrates go because of their former friendship" (`sources/diodorus/english/book19.loeb.txt`)
- **Pasiphilus** (man): a general of Agathocles. Diodorus 20.77.2: "Indeed at that very time Pasiphilus the general, having heard of the" (`sources/diodorus/english/book20.loeb.txt`)
- **Archagathus** (man): son of Agathocles. Diodorus 20.11.1: "right wing to his son Archagathus, giving him twenty-five hundred foot-soldiers; and" (`sources/diodorus/english/book20.loeb.txt`)
- **Telesides** (man): an envoy of Dion's Sicilian allies. Plutarch, Dion 42: "delegation to him, Archonides and Telesides from the allies, and Hellanicus with" (`sources/plutarch/dion.perrin.txt`)
- **Themistus** (man): a Syracusan, husband of Gelo's daughter. Livy 24.24.2: "he formed a plot with Themistus, whose wife was Gelo's daughter, and" (`sources/livy/books23-29.foster.txt`)
- **Adranodorus** (man): a Syracusan, husband of a daughter of Hiero. Livy 24.4.3: "and those of their husbands, Adranodorus and Zoippus, who were being left" (`sources/livy/books23-29.foster.txt`)
- **Zoippus** (man): a Syracusan, husband of a daughter of Hiero. Livy 24.4.3: "of their husbands, Adranodorus and Zoippus, who were being left as the" (`sources/livy/books23-29.foster.txt`)
- **Philistion** (man): an officer of Epicydes at Syracuse. Livy 25.28.5: "upon Epicydes' prefects, Polyclitus and Philistion and an Epicydes surnamed Sindon" (`sources/livy/books23-29.foster.txt`)
- **Crinippus** (man): father of Terillus, tyrant of Himera. Herodotus 7.165.1: "been for Terillus son of Crinippus, the tyrant of Himera. This man" (`sources/sicily-tyrants/herodotus-7-153-167.godley.txt`)
- **Damarete** (woman): the wife of Gelon of Syracuse. Diodorus 11.26.3: "addition a gold crown to Damaretê, the wife of Gelon. For Damaretê" (`sources/diodorus/english/book11.loeb.txt`)
- **Arete** (woman): a daughter of Dionysius. Plutarch, Dion 6: "whom were daughters, Sophrosyne and Arete. Sophrosyne became the wife of his" (`sources/plutarch/dion.perrin.txt`)
- **Sophrosyne** (woman): a daughter of Dionysius. Plutarch, Dion 6: "two of whom were daughters, Sophrosyne and Arete. Sophrosyne became the wife" (`sources/plutarch/dion.perrin.txt`)
- **Harmonia** (woman): daughter of Gelo of Syracuse. Livy 24.24.6: "the marriage of Gelo's daughter Harmonia, uniting her with Themistus" (`sources/livy/books23-29.foster.txt`)
- **Heraclia** (woman): daughter of Hiero of Syracuse. Livy 24.26.1: "Heraclia was the daughter of Hiero and" (`sources/livy/books23-29.foster.txt`)
- **Damarata** (woman): daughter of Hiero of Syracuse. Livy 24.22.8: "But his wife Damarata, daughter of Hiero and still puffed" (`sources/livy/books23-29.foster.txt`)
- **Texena** (woman): the wife of Agathocles. Justin 23.2.6: "resolved on embarking his wife Texena, and two infant sons that he" (`sources/justin/book22-23.watson.txt`)

### Italian Greeks (6 men's names, 0 women's)

Names of Greeks from the cities of southern Italy (Rhegium, Locri, Tarentum, Neapolis).

- **Phyton** (man): general of Rhegium. Diodorus 14.108.4: "The Rhegians chose Phyton as general, armed all who could" (`sources/diodorus/english/book14-1-18-97-117.loeb.txt`)
- **Anaxilas** (man): tyrant of Rhegium. Diodorus 11.76.5: "Zanclians expelled the sons of Anaxilas, who were ruling over them, and" (`sources/diodorus/english/book11-73-92.loeb.txt`)
- **Micythus** (man): regent of Rhegium after Anaxilas. Diodorus 11.48.2: "succeeded in the tyranny by Micythus, who was entrusted with the position" (`sources/diodorus/english/book11-38-72.loeb.txt`)
- **Archytas** (man): a leader of the Pythagoreans in Italy. Plutarch, Dion 18: "leaving no stone unturned, persuaded Archytas and his fellow Pythagoreans to become" (`sources/plutarch/dion.perrin.txt`)
- **Xenetus** (man): a Locrian, father of Doris. Diodorus 14.44.6: "of Doris, the daughter of Xenetus, who at that time was their" (`sources/diodorus/english/book14.loeb.txt`)
- **Nypsius** (man): a Neapolitan commander for the younger Dionysius. Plutarch, Dion 41: "Dionysius, under the command of Nypsius the Neapolitan, who brought food and" (`sources/plutarch/dion.perrin.txt`)

### Sikels (3 men's names, 0 women's)

Names of Sikel leaders of the inland towns.

- **Ducetius** (man): leader of the Sikels. Diodorus 11.76.3: "these events were taking place, Ducetius, the leader of the Siceli, harbouring" (`sources/diodorus/english/book11-73-92.loeb.txt`)
- **Archonides** (man): leader of Herbita. Diodorus 14.16.1: "Archonides, the leader of Herbitê, after the" (`sources/diodorus/english/book14-1-18-97-117.loeb.txt`)
- **Agyris** (man): lord of Agyrium. Diodorus 14.95.4: "he sent an embassy to Agyris, the lord of the Agyrinaeans. This" (`sources/diodorus/english/book14.loeb.txt`)

### Carthaginians (19 men's names, 9 women's)

Names of Carthaginians, from 480 to 202 BC. The saved texts name almost no Carthaginian women.

- **Hanno** (man): father of the general Himilcon. Diodorus 13.80.1: "general, Himilcon, the son of Hanno and of the same family" (`sources/diodorus/english/book13.loeb.txt`)
- **Himilcar** (man): a Carthaginian general. Diodorus 13.85.5: "Himilcar and Hannibal, the Carthaginian generals, noting" (`sources/diodorus/english/book13.loeb.txt`)
- **Hamilcar** (man): the Carthaginian general who fought against Gelon. Diodorus 13.43.5: "He was the grandson of Hamilcar, who fought in the war against" (`sources/diodorus/english/book13.loeb.txt`)
- **Hannibal** (man): Carthage's foremost citizen. Diodorus 13.43.5: "But when Hannibal, their foremost citizen, also advised them" (`sources/diodorus/english/book13.loeb.txt`)
- **Hasdrubal** (man): a son of the general Mago. Justin 19.1: "leaving behind him two sons, Hasdrubal and Hamilcar" (`sources/justin/justin-18.7-19.1.watson.txt`)
- **Mago** (man): a Carthaginian general. Justin 18.2: "In the meantime, Mago, general of the Carthaginians, being sent" (`sources/justin/justin-18.7-19.1.watson.txt`)
- **Gisco** (man): son of Hanno, recalled from exile. Diodorus 16.81.3: "time in recalling from exile Gisco the son of Hanno and appointing" (`sources/diodorus/english/book16.loeb.txt`)
- **Bostar** (man): a Carthaginian envoy. Livy 23.34.2: "And Gisgo and Bostar and Mago, who were sent with" (`sources/livy/books23-29.foster.txt`)
- **Adherbal** (man): a Carthaginian admiral. Polybius 1.44: "officer and prime favourite of Adherbal’s, with instructions suitable to the business" (`sources/polybius/book1.shuckburgh.txt`)
- **Carthalo** (man): a Carthaginian commander. Polybius 1.53: "vessels, to Carthage; and giving Carthalo his colleague thirty vessels, in addition" (`sources/polybius/book1.shuckburgh.txt`)
- **Malchus** (man): an early Carthaginian general. Justin 18.7: "which they sentenced their general Malchus, under whose conduct they had both" (`sources/justin/justin-18.7-19.1.watson.txt`)
- **Maharbal** (man): a Carthaginian commander. Livy 23.18.4: "troops being thus beaten back, Maharbal, who had been sent with a" (`sources/livy/books23-29.foster.txt`)
- **Sapho** (man): a grandson of the general Mago. Justin 19.2: "of sons, Hannibal, Hasdrubal, and Sapho" (`sources/justin/justin-18.7-19.1.watson.txt`)
- **Himilco** (man): a Carthaginian commander. Diodorus 20.60.4: "As for Himilco, who had been appointed to conduct" (`sources/diodorus/english/book20.loeb.txt`)
- **Bomilcar** (man): a Carthaginian general. Justin 22.7.7: "among the troops of Agathocles, Bomilcar, the Carthaginian general, would have gone" (`sources/justin/book22-23.watson.txt`)
- **Amoashtart** (woman): a queen of Sidon, mother of Eshmunazar II (a Phoenician name from the homeland). Wikipedia, Eshmunazar II: "He and his mother Amoashtart built temples in various parts of Sidon" (`sources/gods-dead/plain/wiki-Eshmunazar_II.txt`) *Not Carthaginian and not from an ancient author: a modern page on Phoenician inscriptions from Sidon. Used because the saved texts name almost no Carthaginian women.*
- **Synalus** (man): the Carthaginian commander at Minoa. Plutarch, Dion 25: "controlled. Now, it chanced that Synalus, the Carthaginian commander, was in the" (`sources/plutarch/dion.perrin.txt`)
- **Bodostor** (man): a Carthaginian prisoner held at Rome. Diodorus 24.12.1: "of food for five days, Bodostor died of despair and privation. Hamilcar" (`sources/diodorus/english/book24.loeb.txt`)
- **Annobal** (man): a magistrate (sufete) of Leptis Magna, AD 1 to 2: a Punic name from a much later inscription. IRT 322: "Annobal ornator patriae amator concordiae" (`sources/language/leptis-magna-irt322-bilingual.txt`) *Four centuries after the game's decade, and from Libya rather than Carthage. Used because the saved texts name few Carthaginian men.*
- **Bodashtart** (man): a king of Sidon (a Phoenician name from the homeland). Wikipedia, Eshmunazar II: "the dedicatory Bodashtart inscriptions found on the foundations of the Temple of Eshm" (`sources/gods-dead/plain/wiki-Eshmunazar_II.txt`) *Not Carthaginian and not from an ancient author: a modern page on Phoenician inscriptions from Sidon.*
- **Sophoniba** (woman): wife of Syphax, daughter of Hasdrubal the Carthaginian. Livy 30.12.8: "Sophoniba, the wife of Syphax, daughter of Hasdrubal the Carthaginian" (`sources/livy/numidia-30-45-selected.txt`)
- **Amashtart** (woman): a woman named on a curse tablet from Carthage. Cooke 1903, no. 50: "bind Am-'ashtart" (`sources/religion/cooke-1903-carthage-and-north-africa.txt`) *Carthage, 3rd to 2nd century BC (Cooke). The game writes it Amashtart, a plain spelling of the scholars' Am-'ashtart (invention).*
- **Sibbolet** (woman): a businesswoman of Carthage, on her gravestone. KAI 92 (CIS I 5948): "Grave of ŠBLT (Sibbolet), businesswoman of the City" (`sources/inscriptions/sibbolet-kai92.excerpts.txt`) *Carthage, undated. The game writes it Sibbolet, a plain spelling of the scholars' ŠBLT (Sibbolet) (invention).*
- **Ahatmilkat** (woman): daughter of Bo'-melqarth, on her gravestone at Maktar. Cooke 1903, no. 54: "This stone is set up to Ahath-milkath, daughter of Bo'-" (`sources/religion/cooke-1903-neopunic-incl-sulci.txt`) *Neo-Punic script, North Africa, later than the game's decade. The game writes it Ahatmilkat, a plain spelling of the scholars' Ahath-milkath (invention).*
- **Rosh** (woman): daughter of 'Abd-eshmun, who set up a pillar to her mother at Jol. Cooke 1903, no. 68: "up by Rosh, daughter" (`sources/religion/cooke-1903-neopunic-incl-sulci.txt`) *Neo-Punic script, North Africa, later than the game's decade.*
- **Amatashtart** (woman): a wife at Kition in Cyprus. Cooke 1903, no. 16 (CIS I 46): "to my wife, Amath-'ashtart, daughter of" (`sources/religion/cooke-1903-cyprus.txt`) *The Phoenician East (Kition, Cyprus), 4th to 3rd century BC. The game writes it Amatashtart, a plain spelling of the scholars' Amath-'ashtart (invention).*
- **Amatosir** (woman): a basket-bearer of Queen Arsinoe at Idalion. Cooke 1903, no. 27 (CIS I 93): "Amath-osir, daughter of Mk" (`sources/religion/cooke-1903-cyprus.txt`) *The Phoenician East (Idalion, Cyprus), 254 BC. The game writes it Amatosir, a plain spelling of the scholars' Amath-osir (invention).*
- **Batshalom** (woman): daughter of Mar-yehai, at Idalion. Cooke 1903, no. 27 (CIS I 93): "Bath-shalom, daughter of Mar-yehai" (`sources/religion/cooke-1903-cyprus.txt`) *The Phoenician East (Idalion, Cyprus), 254 BC. The game writes it Batshalom, a plain spelling of the scholars' Bath-shalom (invention).*

### Libyans (4 men's names, 0 women's)

Names of Libyans and Libyphoenicians who served Carthage.

- **Muttines** (man): a Libyphoenician cavalry leader from Hippacra. Livy 25.40.5: "race, from Hippacra, and called Muttines by his countrymen, a man of" (`sources/livy/books23-29.foster.txt`)
- **Zarzas** (man): a Libyan captain of mercenaries. Polybius 1.84: "among whom, besides others, was Zarzas the Libyan, with his division, and" (`sources/polybius/book1.shuckburgh.txt`)
- **Mathos** (man): a free Libyan, a leader in the Mercenary War. Polybius 1.69: "seconded by a Libyan called Mathōs, who was not a slave but" (`sources/polybius/book1.shuckburgh.txt`)
- **Naravas** (man): a Numidian of high rank who joined Hamilcar. Polybius 1.78: "at that time a certain Narávas, a Numidian of high rank and" (`sources/polybius/book1.shuckburgh.txt`)

### Campanians (6 men's names, 0 women's)

Names of Campanians, mostly men of Capua in 216 to 211 BC, and two mercenary leaders.

- **Spendius** (man): a leader of the mercenaries in the Mercenary War (Polybius calls him a Campanian). Polybius 1.69: "there was a certain Campanian in the army, a runaway Roman slave named Spendius" (`sources/polybius/book1.shuckburgh.txt`)
- **Decius** (man): a Campanian captain at Rhegium. Polybius 1.7: "command of a Campanian named Decius Jubellius, entered the city, and for" (`sources/polybius/book1.shuckburgh.txt`)
- **Pacuvius** (man): a noble of Capua. Livy 23.2.2: "As for the senate, Pacuvius Calavius, a noble who was at" (`sources/livy/books23-29.foster.txt`)
- **Vibius** (man): a man of Capua. Livy 23.6.1: "and on their way home Vibius Virrius, one of them, said the" (`sources/livy/books23-29.foster.txt`)
- **Magius** (man): a man of Capua. Livy 23.7.4: "to the utmost by Decius Magius, a man who lacked nothing for" (`sources/livy/books23-29.foster.txt`)
- **Seppius** (man): a Campanian magistrate. Livy 26.6.14: "highest office among the Campanians, Seppius Loesius was serving that year, though" (`sources/livy/books23-29.foster.txt`)

### Iberians (4 men's names, 0 women's)

Names of Spanish chiefs, 212 to 209 BC.

- **Allucius** (man): a young Spanish chief. Livy 26.50.3: "the young man's name was Allucius. accordingly he at once summoned parents" (`sources/livy/books23-29.foster.txt`)
- **Indibilis** (man): a Spanish chief. Livy 25.34.6: "would evidently be stricter if Indibilis, who was reported as approaching with" (`sources/livy/books23-29.foster.txt`)
- **Mandonius** (man): a Spanish chief, brother of Indibilis. Livy 26.49.11: "elderly woman, the wife of Mandonius, who was the brother of Indibilis" (`sources/livy/books23-29.foster.txt`)
- **Edesco** (man): a Spanish chief. Livy 27.17.1: "restoring their hostages and captives, Edesco, who was eminent among the Spanish" (`sources/livy/books23-29.foster.txt`)

### Gauls (1 men's names, 0 women's)

One name of a Gaulish mercenary leader.

- **Autaritus** (man): leader of the Gauls in the Mercenary War. Polybius 1.77: "Zarytus, and he now counselled Autaritus, the leader of the Gauls, and" (`sources/polybius/book1.shuckburgh.txt`)

### Peloponnesians (10 men's names, 0 women's)

Names of Spartans and Corinthians who came to Sicily as commanders, envoys and hired men.

- **Gylippus** (man): a Spartan commander. Diodorus 13.106.8: "siege of the city, but Gylippus, who with a flotilla had fought" (`sources/diodorus/english/book13.loeb.txt`)
- **Aristus** (man): a Spartan envoy to Syracuse. Diodorus 14.10.2: "their own taste, they dispatched Aristus, one of their distinguished men, to" (`sources/diodorus/english/book14-1-18-97-117.loeb.txt`)
- **Pharacidas** (man): a Spartan admiral. Diodorus 14.63.4: "warships from his allies, with Pharacidas the Lacedaemonian as admiral" (`sources/diodorus/english/book14.loeb.txt`)
- **Dexippus** (man): a Spartan at Acragas. Diodorus 13.85.3: "Fighting with them was also Dexippus the Lacedaemonian, who had lately arrived" (`sources/diodorus/english/book13.loeb.txt`)
- **Pollis** (man): a Spartan. Plutarch, Dion 5: "a trireme, which was conveying Pollis the Spartan to Greece. But Dionysius" (`sources/plutarch/dion.perrin.txt`)
- **Lysander** (man): a Spartan commander. Diodorus 14.81.1: "Boeotians. At first they sent Lysander to them with a few soldiers" (`sources/diodorus/english/book14-78-96.txt`)
- **Xanthippus** (man): a Spartan who trained Carthage's army. Polybius 1.32: "them a certain Lacedaemonian named Xanthippus, a man trained in the Spartan" (`sources/polybius/book1.shuckburgh.txt`)
- **Ariston** (man): a Corinthian helmsman at Syracuse. Diodorus 13.10.2: "And when Ariston the Corinthian pilot advised them to" (`sources/diodorus/english/book13-1-42-91-96.loeb.txt`)
- **Pyrrhicus** (man): a Corinthian, father of Ariston. Thucydides 7.39.2: "at last Ariston, son of Pyrrhicus, a Corinthian, the ablest helmsman in" (`sources/sicilian-wars/thucydides-6-7-7-87.crawley.txt`)
- **Acestorides** (man): a Corinthian elected general at Syracuse. Diodorus 19.5.1: "Thereafter, at the time when Acestorides the Corinthian had been elected general" (`sources/diodorus/english/book19.loeb.txt`)

<!-- end of names -->
