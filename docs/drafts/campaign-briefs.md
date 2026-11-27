# Campaign briefs: the six tyrant campaigns (draft)

Research draft only. Nothing here changes game code or data. It is written for the six campaigns in `docs/full-game.md` Part 4 and builds on `docs/research/tyrant-campaigns.md`, the five start cards (`docs/research/start-480.md`, `start-466.md`, `start-357.md`, `start-317.md`, `start-289.md`) and `docs/drafts/rising-cast.md` (branch `claude/rising-cast`, PR #86, not merged). What those cards already quote is not quoted again: this file points to them.

**How to read it.** Every section carries a label. `kind: history` means what the saved texts say, with the passage. `kind: invention` means a game proposal. In the people tables, REAL or INVENTED is the person; the Faction and Seat wanted columns are game proposals for every row (factions as in `data/people.json`: citizens, rich families, army and guard, family; outsiders are "Carthage" or "outside (city)"; seats as in `rising-cast.md`); How it ended is history, with the passage. Invented people take names from `docs/research/names.md`. They are not the real men who bore those names.

**Dates.** The saved rule is in `sources/diodorus/year-headers.greek.txt`: "Olympiad n, year 1 = 776 - 4(n-1) BC". The saved headers give 480 (Calliades), 412, 396 (Phormion), 332 and 310 (Hieromnemon) outright. Every other BC year here is my arithmetic from the Athenian archon at the head of Diodorus' year, counted from the nearest Olympiad heading. An archon year straddles two of our years, so "478/7" means summer 478 to summer 477, and any event in it can fall in either. Plutarch, Justin and Polybius give no years. Dates marked "modern" come from a Wikipedia article or a coin catalogue saved in `sources/sicily-places`.

**Numbers** of soldiers, ships and money are the ancient writers' claims, not counts.

**Sources used**, all in the Phoenician-Punic World repo (read-only): Herodotus 7.153 to 7.167 (Godley); Diodorus books 11, 13 to 16, 19, 20, 22 and 23 (Loeb); Plutarch *Dion*, *Timoleon* and *Pyrrhus* (Perrin); Polybius 1 and 7 (Shuckburgh); Justin 22 and 23 (Watson); Plato *Letters* 7 and 8 (Bury); Aristotle *Politics* 5 (Rackham); Pindar *Pythian* 1 and Bacchylides 3 and 5 (Svarlien); Amendola on the Deinomenid citizen body; the Wikipedia articles and American Numismatic Society coin lists saved in `sources/sicily-places`. Quotes were checked against those files on 2026-11-27; the list is at the end.

**Coin links** go to the American Numismatic Society's record pages, as saved in `sources/sicily-places/ans-mantis-*.tsv`. Each page has photographs. The date ranges are the catalogue's, which is modern.

## At a glance

kind: history for the years; kind: invention for the goal and the end.

| # | Campaign | Years | Opening goal | Ends when | Carded in |
|---|---|---|---|---|---|
| 1 | Gelon | about 491 to 478/7 | Take Gela, then Syracuse, then make Syracuse great | His death, or 470 | `start-480.md` |
| 2 | Hieron I | 478/7 to 467/6 | Make the throne safe from Polyzelus and found a city | His death at Catana | `start-466.md` (the fall after him) |
| 3 | Dionysius I | 406/5 to about 367 | Turn an emergency command into lasting rule | His death | `rising-cast.md`, `cast-405-395.md`, `dionysius-405-403.md` |
| 4 | Dionysius II | about 367 to 357/6 | Make the realm his before anyone tests it | Dion's landing, or his fall | `start-357.md` |
| 5 | Agathocles | 317/16 to about 289 | Hold the city and keep the army's promises | His death | `start-317.md`, `start-289.md` |
| 6 | Hieron II | about 275 to 264 | Make the army's choice the city's, then tame the Mamertines | Rome crosses the strait | `start-289.md` (the years before) |

---

## 1. Gelon

### Player brief

kind: invention

You are Gelon, once a guardsman of Hippocrates, tyrant of Gela, and now captain of his cavalry. Hippocrates has died near Hybla, on campaign against the Sicels. Gela will not bear his sons, Euclides and Cleandrus, and you have said you will serve them. To the east, Syracuse is the one city Hippocrates never took, though he beat it on the Elorus. Its landowners are exiles at Casmena, driven out by their own common people. Your opening goal: make Gela yours, bring the landowners home, and take Syracuse. Then fill it with the people of other towns before Carthage comes.

### Key people

kind: history (the people, How it ended); kind: invention (Faction, Seat wanted, INVENTED rows)

| Person | | Faction | Seat wanted | How it ended |
|---|---|---|---|---|
| Hieron | REAL | family | a city command (Gela) | given Gela (Herodotus 7.156.1); named heir and king (Diodorus 11.38.3) |
| Polyzelus | REAL | family | generalship | outlived Gelon; fled to Theron under Hieron (Diodorus 11.48.5) |
| Thrasybulus | REAL | family | treasury | ruled a year after Hieron, then driven out (Diodorus 11.66.4; `start-466.md`) |
| Damarete | REAL | family | none: the peace with Carthage | a coin was named for her (Diodorus 11.26.3); her later life is not in the saved texts |
| Euclides and Cleandrus | REAL | rich families | none: their father's rule | deposed by Gelon (Herodotus 7.155.1); not known after |
| Aenesidemus son of Pataecus | REAL | army and guard | captain of the guard | named once, as a fellow guardsman (Herodotus 7.154.1); not known |
| Phormis of Maenalus | REAL | army and guard | a city command | grew rich and made offerings at Olympia (`start-480.md` no. 10) |
| Cadmus of Cos | REAL | outside (Cos, then Zancle) | none | brought Gelon's money back from Delphi (Herodotus 7.164.2) |
| Theron | REAL | outside (Acragas) | none: Himera | died after a rule of sixteen years (Diodorus 11.53.1) |
| Terillus | REAL | outside (Himera) | none: Himera back | brought Carthage in (Herodotus 7.165.1); not known after |
| Anaxilas | REAL | outside (Rhegium) | none: the strait | died after a rule of eighteen years (Diodorus 11.48.2) |
| Diognetus | REAL | outside (Megara) | none: Megara | lost his city to Gelon (Polyaenus 1.27.3, in Greek, via Amendola; see Disagreements) |
| Hamilcar son of Hanno | REAL | Carthage | none: the island | died at Himera; how is disputed (`start-480.md` Disagreements 3) |
| Philocles | INVENTED | rich families | treasury | (from `start-480.md` no. 13: a landowner home from Casmena) |
| Eucles | INVENTED | citizens | leader of the assembly | (new: a captain of the Syracusan common people who handed the city over) |

Conon, Euthippus and Mnesitheides stay as invented in `start-480.md`.

### Big events

kind: history

| Date range | What happened | Passage |
|---|---|---|
| about 491 (modern) | Hippocrates dies near Hybla; Gelon deposes his sons and rules Gela | Herodotus 7.155.1; Wikipedia timeline "491–478 BCE - Gelon is tyrant of Syracuse." |
| 491/0 or about 485 | Gelon brings the landowners and their slaves home from Casmena; the common people give Syracuse up | Herodotus 7.155.2; the year is disputed (`start-480.md` Disagreements 6) |
| 480s, no year saved | Gela goes to Hieron; Camarina is razed and its people moved to Syracuse, with more than half of Gela | Herodotus 7.156.1 to 7.156.2 |
| 480s, no year saved | Megara surrenders after a siege; its rich are made Syracusans, its common people sold abroad; the same for the Euboeans | Herodotus 7.156.2 to 7.156.3 |
| before 480 (the saved header puts Xerxes' crossing in 480) | Greek envoys ask for help against Persia; Gelon will come only as leader; they leave, and he sends Cadmus to Delphi to wait on the outcome | Herodotus 7.157.1 to 7.163.2 |
| 480/79 (Calliades) | Terillus, driven out of Himera by Theron, brings Hamilcar; Gelon and Theron win at Himera | Herodotus 7.165.1 to 7.167.1; Diodorus 11.20 to 11.22; `year-headers.greek.txt` |
| 480/79 | Peace: Carthage pays two thousand talents and builds two temples for the treaty; Damarete's crown and coin | Diodorus 11.26.2 to 11.26.3 |
| 480/79 | Gelon comes unarmed to the assembly and is hailed "Benefactor and Saviour and King" | Diodorus 11.26.5 to 11.26.6 |
| 480/79 or soon after | Temples to Demeter and Kore from the spoils; a gold tripod for Delphi | Diodorus 11.26.7 |
| 478/7 (Timosthenes) | Gelon falls ill, hands the kingship to Hieron, is buried at the Nine Towers | Diodorus 11.38.3 to 11.38.5 |

### Disagreements

kind: history. `start-480.md` already sets out nine (why Carthage came, which day, how Hamilcar died, Gelon as ruler, length of reign, when he took Syracuse, when the mercenaries were enrolled, how many, the Himera numbers). Three more:

| Question | One reading | The other |
|---|---|---|
| How Megara's people came to Syracuse | Herodotus: by conquest, "when the Megarians in Sicily surrendered to him on terms after a siege" (7.156.2) | Polyaenus, in Greek as quoted by Amendola: "Διογνήτῳ δὲ, τῷ Μεγαρέων ἄρχοντι, χρήματα παρὰ δύναμιν ἐπέταξεν" (1.27.3), that is, Gelon set Diognetus, ruler of the Megarians, a levy beyond his means (my rendering). Amendola reads it as forcing them "to pay a sum beyond their means" and so to join the new settlement |
| Who held Zancle | Herodotus: Zancle was among the towns Hippocrates enslaved (7.154.2), and later the Samians gave it to Cadmus (7.164.1) | Wikipedia, Sicilian Wars: "Anaxilas of Rhegion from Italy, who had captured Zankle from Gelo in 490 BC" |
| Would Gelon have fought Persia | Herodotus: after the envoys left he "took no more thought of this plan", and sent Cadmus to give earth and water if Persia won (7.163.1 to 7.163.2) | Diodorus: "he was making ready to sail to Greece with a large force and to join the Greeks in their war against the Persians" (11.26.4) |

### Gaps

kind: history

- Diodorus book 10, which told Gelon's rise under Hippocrates, is not saved.
- No saved ancient text gives a year for Hippocrates' death, the moves from Camarina and Gela, or the fall of Megara.
- How many people were moved from each town.
- The name of the Euboean town; Herodotus says only "the Euboeans of Sicily".
- Who led the Syracusan common people when they gave the city up.
- What became of the Cyllyrians after the landowners came home.
- Damarete's life after 480 (also a `start-480.md` gap).

### Coin to look at

kind: history (modern catalogue). [Silver tetradrachm, Syracuse, 485 to 478 BCE](http://numismatics.org/collection/1991.60.21): a chariot on one side, a woman's head on the other.

---

## 2. Hieron I

### Player brief

kind: invention

You are Hieron, ruler of Gela and the eldest of Gelon's brothers. Gelon is dead, and he named you king. The whole city followed his funeral. Many would rise against you, and only your brother's good name holds them back. Your brother Polyzelus is loved by the Syracusans, and you believe he is waiting for the throne. Theron rules Acragas, and his son governs Himera too harshly. Anaxilas holds Rhegium and Zancle across the strait. Your opening goal: make the throne safe, raise a guard of your own, settle Polyzelus without a war between brothers, and found a city that will honour you as its founder.

### Key people

kind: history (the people, How it ended); kind: invention (Faction, Seat wanted, INVENTED rows)

| Person | | Faction | Seat wanted | How it ended |
|---|---|---|---|---|
| Polyzelus | REAL | family | generalship | fled to Theron, then restored to favour (Diodorus 11.48.5, 11.48.8); not known after (`start-466.md` gaps) |
| Thrasybulus | REAL | family | treasury | succeeded, ruled a year, driven out (Diodorus 11.66.4; `start-466.md` no. 1) |
| Gelon's son (unnamed) | REAL | family | none: his father's throne | led astray by Thrasybulus (Aristotle, *Politics* 1312b; `start-466.md` no. 3) |
| Deinomenes son of Hieron | REAL | family | a city command (Aetna) | praised as "the king of Aetna" in Pindar, *Pythian* 1; not known after |
| Theron | REAL | outside (Acragas) | none: Himera | made peace with Hieron; died (Diodorus 11.48.8, 11.53.1) |
| Thrasydaeus | REAL | outside (Acragas) | none: his father's cities | beaten by Hieron, fled to Nisaean Megara and was condemned to death (Diodorus 11.53.5) |
| Anaxilas | REAL | outside (Rhegium) | none: the strait | died in 476/5 (Diodorus 11.48.2) |
| Micythus | REAL | outside (Rhegium) | none: the regency | gave the rule back and spent the rest of his life in Tegea (Diodorus 11.66.3) |
| Hagesias of Stymphalos | REAL | army and guard | none: Hieron's seer | not known (`start-466.md` no. 14) |
| Phormis of Maenalus | REAL | army and guard | a city command | still rich under Hieron (`start-466.md` no. 15) |
| Pindar | REAL | outside (a visiting poet) | none | wrote *Pythian* 1 for Hieron's chariot win (saved header: 470 BC) |
| Bacchylides | REAL | outside (a visiting poet) | none | wrote odes 3 and 5 for Hieron (saved header: 468 and 476 BC) |
| Conon | INVENTED | army and guard | captain of the guard | (from `start-480.md` no. 14: captain of the new citizens) |
| Argeius | INVENTED | army and guard | a city command (Aetna) | (new: a captain of the ten thousand Aetna settlers) |
| Antisthenes | INVENTED | citizens | a city command (Leontini) | (new: a Naxian moved to Leontini to make room for the settlers) |

### Big events

kind: history

| Date range | What happened | Passage |
|---|---|---|
| 478/7 (Timosthenes) | Gelon dies; Hieron becomes king | Diodorus 11.38.3 to 11.38.7 |
| 476/5 (Phaedon) | Fearing Polyzelus, Hieron gathers mercenaries; Polyzelus flees to Theron. Anaxilas dies; Micythus rules for his sons | Diodorus 11.48.2 to 11.48.5 |
| 476/5 | The Himerans, ruled harshly by Thrasydaeus, offer themselves to Hieron; he tells Theron instead, and the two make peace; Polyzelus is restored | Diodorus 11.48.6 to 11.48.8 |
| 476/5 | Hieron moves the people of Naxos and Catana to Leontini and refounds Catana as Aetna with ten thousand settlers | Diodorus 11.49.1 to 11.49.2 |
| 476 to 468 (modern) | Bacchylides writes odes 3 and 5 for Hieron's victories; ode 5 hails him "commander of the Syracusans" | Bacchylides 3, 5 |
| 474/3 (Acestorides) | Hieron's triremes, sent to help Cumae, beat the Etruscans at sea | Diodorus 11.51.1 to 11.51.2; Pindar, *Pythian* 1 |
| 472/1 (Chares) | Theron dies; Thrasydaeus makes war on Hieron and loses; Acragas becomes a democracy and makes peace | Diodorus 11.53.1 to 11.53.5 |
| 470 (modern) | Hieron's chariot wins at the Pythian games, and the herald proclaims "the name of Aetna" | Pindar, *Pythian* 1 |
| 467/6 (Lysistratus) | Hieron sets the sons of Anaxilas against Micythus, who leaves for Tegea; Hieron dies at Catana and is honoured as its founder | Diodorus 11.66.1 to 11.66.4 |

### Disagreements

kind: history. `start-466.md` already has the length of his rule (three figures), how long Thrasybulus lasted, and why the family fell. One more:

| Question | One reading | The other |
|---|---|---|
| What kind of ruler he was | Diodorus: "he was avaricious and violent" (11.67.4). Aristotle names "the sharp-ears that used to be sent out by Hiero wherever there was any gathering or conference" (*Politics* 1313b) | Pindar, in a poem for Hieron's victory, sings of "the king of Aetna, for whom Hieron founded that city with god-built freedom" and advises "Steer your men with the rudder of justice" (*Pythian* 1). A victory ode is written to praise |

### Gaps

kind: history

- Polyzelus, Damarete and Gelon's son after 466 (also `start-466.md` gaps).
- Who governed Gela once Hieron left it for Syracuse.
- The names of any of the ten thousand Aetna settlers, or of the Naxians and Catanians moved to Leontini.
- How the guard was paid, or what Aetna's land was worth.
- The saved Pindar has no line numbers, so it is cited by poem only.

### Coin to look at

kind: history (modern catalogue). [Silver tetradrachm, Syracuse, 474 to 470 BCE](http://numismatics.org/collection/1909.78.65): a chariot crowned by a flying Victory, and Arethusa with four dolphins.

---

## 3. Dionysius I

### Player brief

kind: invention

You are Dionysius, a scribe who spoke out against the generals after Acragas fell to Carthage. The assembly has made you general with supreme power. You have married the daughter of Hermocrates and given your sister to Polyxenus, her uncle. Carthage's army is in the south, Gela and Camarina lie in its path, and the rich families of Syracuse think you a passing danger. Your opening goal: turn an emergency command into lasting rule. Fortify the Island, give land to those who will hold it, pay a guard you can trust, and buy time from Carthage.

### Key people

kind: history (the people, How it ended); kind: invention (Faction, Seat wanted, INVENTED rows)

The full entries for 405 to 380 are in `rising-cast.md`; this table repeats its verdicts in a line and adds people from the later reign.

| Person | | Faction | Seat wanted | How it ended |
|---|---|---|---|---|
| Leptines | REAL | family | fleet | "ended his life in a blaze of glory" at Cronium (Diodorus 15.17.1) |
| Polyxenus | REAL | family | fleet | fled into exile (Plutarch, *Dion* 21) |
| Theste | REAL | family | none: her husband's safety | stayed; the city later honoured her funeral (Plutarch, *Dion* 21) |
| Heloris | REAL | family | generalship | killed leading the Italian Greeks against him, 389/8 (Diodorus 14.104.4) |
| Doris of Locri | REAL | family | none: her son's succession | not known (`rising-cast.md`) |
| Dionysius the younger | REAL | family | none: the succession | succeeded his father (Diodorus 15.74.5) |
| Philistus | REAL | rich families | citadel | exiled to Adria; recalled by the son (Plutarch, *Dion* 11) |
| Aristomache | REAL | rich families | none: her children and brother | drowned after Dion's murder (Plutarch, *Dion* 58) |
| Dion | REAL | rich families | treasury | overthrew the son; murdered (Plutarch, *Dion* 57) |
| Archylus of Thurii | REAL | army and guard | captain of the guard | not known (`rising-cast.md`) |
| Himilcon | REAL | Carthage | none: the island | "starved himself to death" (Diodorus 14.76.4) |
| Magon | REAL | Carthage | none: Carthage's towns | fell at Cabala (Diodorus 15.15.3) |
| Agyris | REAL | outside (Agyrium) | none: his own towns | fought beside Dionysius against Magon (Diodorus 14.95.4 to 14.96.1); not known after |
| Phyton | REAL | outside (Rhegium) | none: Rhegium | drowned "together with his near of kin" (Diodorus 14.112.4) |
| Damon the smith | INVENTED | citizens | leader of the assembly | (from `rising-cast.md`) |

### Big events

kind: history

| Date range | What happened | Passage |
|---|---|---|
| 406/5 (Callias) | After Acragas falls, Dionysius attacks the generals and is made general "with supreme power" | Diodorus 13.91 to 13.94 |
| 405 to 403 | Gela and Camarina given up, peace with Carthage, the cavalry's revolt, the first fortifications | carded in `dionysius-405-403.md` |
| 404 to 403 | The Island walled off; land given to the "New Citizens"; the city rises, besieges him, and he holds out | Diodorus 14.7 to 14.9 |
| before 396 | Motya besieged and taken | Diodorus 14.47 to 14.53 |
| 396/5 (Phormion) | Himilcon besieges Syracuse; plague in his camp; he pays three hundred talents to get his citizens away, and at home starves himself | Diodorus 14.70 to 14.76; `year-headers.greek.txt` |
| 392/1 (Philocles) | Magon invades; Agyris' men cut his supplies; peace, with Tauromenium to Dionysius | Diodorus 14.95 to 14.96 |
| 389/8 (Antipater) | Victory over the Italian Greeks; Heloris killed; more than ten thousand prisoners let go | Diodorus 14.103 to 14.105 |
| 388/7 to 387/6 (Pyrgion, Theodotus) | Lysias turns the crowd at Olympia against him; Rhegium besieged and taken; Phyton drowned | Diodorus 14.108 to 14.112 |
| 383/2 (Phanostratus) | War with Carthage: a victory at Cabala, a defeat at Cronium where Leptines dies; the peace gives Carthage Selinus and Acragas' land to the Halycus, and Dionysius pays a thousand talents | Diodorus 15.15 to 15.17 |
| about 368 to 367 | His tragedy wins at Athens; he falls ill at the feast and dies; the son succeeds | Diodorus 15.73 to 15.74 |

### Disagreements

kind: history. `rising-cast.md` already has fourteen (the exiles of Philistus and Leptines, the Cabala year, Philistus' death and others). Two more:

| Question | One reading | The other |
|---|---|---|
| How he died | Diodorus: after the feast "he fell violently ill from the quantity of liquor he had consumed" (15.74.2) | Plutarch, after Timaeus: "when the sick man asked for a sleeping potion, they gave him one that robbed him of his senses and made death follow sleep" (*Dion* 6). Wikipedia: "Cicero and Diodorus Siculus report that he died of natural causes shortly after learning of his play's victory in 367 BC" |
| The year of the great siege | Diodorus sets it in Phormion's year, which the saved header makes 396 | Wikipedia's Syracuse timeline: "397 BCE - Siege of Syracuse (397 BC)" |

### Gaps

kind: history

- Diodorus 15.18 to 15.72 is not saved in English, apart from 15.24 on Carthage; nor is 15.1 to 15.12 (`rising-cast.md` read 15.7 in Greek).
- No archon heading for the year of his death is saved: 15.73 opens without one.
- The year Motya fell, from a saved heading.
- Any figure for the treasury, or for the Island garrison in the later reign.

### Coin to look at

kind: history (modern catalogue). [Silver tetradrachm of Dionysius I, 405 to 400 BCE](http://numismatics.org/collection/2015.1.1): a racing chariot crowned by Victory, and the head of Arethusa.

---

## 4. Dionysius II

### Player brief

kind: invention

You are Dionysius, son of the old tyrant by his Locrian wife. Your father is dead. You have called the assembly and asked it for the loyalty it gave him. You hold the Island, the fleet and the mercenaries, but nobody fears you yet. Dion, brother of your father's other wife, is rich, admired and full of advice, and wants Plato at your court. Dion's enemies want you to call Philistus home from exile as a counterweight. Your opening goal: make the realm yours. Choose whom to trust, keep the older mercenaries paid, and end your father's war with Carthage.

### Key people

kind: history (the people, How it ended); kind: invention (Faction, Seat wanted, INVENTED rows)

| Person | | Faction | Seat wanted | How it ended |
|---|---|---|---|---|
| Dion | REAL | rich families | generalship | took Syracuse; murdered by Callippus' men (Plutarch, *Dion* 57; Diodorus 16.31.7) |
| Philistus | REAL | rich families | fleet | died after the sea fight of 356/5; how is disputed (Diodorus 16.16.3; Plutarch, *Dion* 35; `start-357.md`) |
| Plato | REAL | outside (Athens) | none: a philosopher's court | left after his third visit, with Archytas' help (Plato, *Letter* 7.350) |
| Archytas | REAL | outside (Tarentum) | none | stood surety for Plato and sent for him (Plutarch, *Dion* 18; Plato, *Letter* 7.350) |
| Aristomache | REAL | rich families | none: her children | drowned after Dion's murder (Plutarch, *Dion* 58) |
| Arete | REAL | family | none | married off to Timocrates (Plutarch, *Dion* 21); drowned with her mother (*Dion* 58) |
| Timocrates | REAL | family | citadel | fled the city when Dion arrived (Plutarch, *Dion* 28) |
| Heracleides | REAL | citizens | fleet | dead by Dion's last days (Plutarch, *Dion* 53 to 54) |
| Theodotes | REAL | rich families | none | set free by Dion (Plutarch, *Dion* 48); not known after |
| Tisias | REAL | army and guard | captain of the guard | sent with peltasts after Heracleides (Plato, *Letter* 7.349); not known |
| Callippus | REAL | outside (Athens) | generalship | ruled thirteen months (Diodorus 16.31.7), then "lost a city and got a cheese-grater" (Plutarch, *Dion* 58) |
| Apollocrates | REAL | family | citadel | gave up the citadel and sailed to his father (Plutarch, *Dion* 50) |
| Nysaeus | REAL | family | citadel | held Syracuse until his half-brother drove him out (Plutarch, *Timoleon* 1) |
| Execestes | INVENTED | army and guard | captain of the guard | (new: captain of the older mercenaries whose pay was cut, Plato, *Letter* 7.348) |
| Lycon | INVENTED | army and guard | citadel | (from `start-357.md` no. 23) |

### Big events

kind: history

| Date range | What happened | Passage |
|---|---|---|
| about 368 to 367 | The son calls the assembly, asks for loyalty, buries his father in the citadel | Diodorus 15.74.5 |
| soon after 367, no year saved | Philistus is recalled; Plato comes; about three months later Dion is put on a small boat and sent away | Plutarch, *Dion* 11 to 14; Plato, *Letter* 7.329 |
| after 367, no year saved | Peace with Carthage; the Lucanian war is wound up | Diodorus 16.5.2 |
| after Dion's exile, no year saved | Dion's revenues stopped and his estate taken; Arete given to Timocrates | Plutarch, *Dion* 18, 21 |
| Plato's third visit, no year saved | He cuts the older mercenaries' pay, they mutiny, he gives way; Heracleides flees | Plato, *Letter* 7.348 to 7.349 |
| 357/6 (archon Agathocles) | Dion lands at Minoa while Dionysius is in Italy and marches in; the city is freed | Diodorus 16.9 to 16.10; Plutarch, *Dion* 25 to 28 |
| 357/6 | Dionysius returns seven days later; the garrison breaks out and is beaten back | Diodorus 16.11 to 16.13 |
| 356/5 (Elpines) | Heracleides' fleet beats Philistus, who dies; Dionysius slips away to Italy, leaving Apollocrates in the citadel | Diodorus 16.16 to 16.17; Plutarch, *Dion* 35, 37 |
| 356/5 | Nypsius brings food and money, sacks the city; Dion saves it | Diodorus 16.18 to 16.20; Plutarch, *Dion* 41 |
| 354/3 (Diotimus) | By now Apollocrates has given up the citadel (*Dion* 50); Dion is killed and Callippus rules | Diodorus 16.31.7; Plutarch, *Dion* 50 to 57 |

After the span: Dionysius comes back "in the tenth year of his exile" (Plutarch, *Timoleon* 1) and in 343/2 (Pythodotus) gives the citadel to Timoleon and goes to Corinth (Diodorus 16.70.1).

### Disagreements

kind: history. `start-357.md` already has Philistus' death, Dion's mercenaries, the crowd, Synalus or Paralus, and Heracleides. Four more:

| Question | One reading | The other |
|---|---|---|
| How long he ruled | Diodorus: he "ruled as tyrant twelve years" (15.73.5) | Plutarch: "having held this for ten years, and then for twelve other years, after the expedition of Dion" (*Timoleon* 13) |
| Why Dion was sent away | Plato: "charging Dion with plotting against the tyranny, Dionysius set him aboard a small vessel and drove him out with ignominy" (*Letter* 7.329) | Plutarch: a letter "which Dion had written to the Carthaginian officials" (*Dion* 14), and, "according to Timaeus, he beguiled Dion by a feigned reconciliation" (*Dion* 14) |
| How the end came | Diodorus: "Timoleon frightened the tyrant Dionysius into surrendering the citadel" (16.70.1) | Plutarch: Dionysius, "in admiration of Timoleon", offered "to surrender himself and the citadel" (*Timoleon* 13), "within fifty days after his landing in Sicily" (*Timoleon* 16); Wikipedia: "Dionysius II surrendered Ortygia in 343 BC" |
| Rich or poor at Corinth | Diodorus: "retaining his private possessions" (16.70.1); Wikipedia: "a private, well-off, citizen" | Diodorus again: "spent the remaining years of his life in poverty at Corinth" (16.70.2); Plutarch: "with a single ship and a small treasure" (*Timoleon* 13) |

### Gaps

kind: history

- His years at Locri: still nothing in the saved texts (a `tyrant-campaigns.md` gap).
- The terms of the peace with Carthage (Diodorus 16.5.2 gives none).
- A year for any of Plato's visits.
- His fleet and army at 367 beyond the claims of "four hundred triremes and his ten thousand horsemen" (Plutarch, *Dion* 14).
- Who held the mint, and where the treasury was kept.

### Coin to look at

kind: history (modern catalogue). [Bronze coin, Syracuse, 367 to 344 BCE](http://numismatics.org/collection/1944.100.55886): the head of Pan and a set of pipes in a wreath. The catalogue calls it a tetradrachm, but it weighs 2.65 grams.

---

## 5. Agathocles

### Player brief

kind: invention

You are Agathocles, a potter's son, an officer, and since this morning master of Syracuse. Your soldiers have killed or driven out the Six Hundred and their friends. The assembly has made you general with absolute power, and you have promised to cancel debts and give land to the poor. You wear no diadem and keep no bodyguard. More than six thousand exiles have fled, most of them to Acragas, and Hamilcar of Carthage is watching. Your opening goal: hold the city, keep your promises without losing the army, bring the exiles' cities under Syracuse, and be ready when Carthage comes.

### Key people

kind: history (the people, How it ended); kind: invention (Faction, Seat wanted, INVENTED rows)

| Person | | Faction | Seat wanted | How it ended |
|---|---|---|---|---|
| Antander | REAL | family | a city command (Syracuse) | held Syracuse in the siege (Diodorus 20.16.1); outlived his brother (`start-289.md` no. 8) |
| Archagathus | REAL | family | generalship | killed by the army in Africa after his father fled (Diodorus 20.69.3; Justin 22.8.14) |
| Heracleides | REAL | family | none | "the younger of his sons", killed with his brother (Diodorus 20.68.3, 20.69.3) |
| Deinocrates | REAL | rich families | generalship | led the exiles, then made peace and stayed Agathocles' friend "until death" (Diodorus 20.90.1) |
| Pasiphilus | REAL | army and guard | a city command | went over to the enemy (Diodorus 20.77.2); seized and killed at Gela (20.90.2) |
| Lyciscus | REAL | army and guard | generalship | taunted Archagathus at a feast and was speared by him (Diodorus 20.33.5 to 20.33.6) |
| Hamilcar the mediator | REAL | Carthage | none: the peace | censured at Carthage for the terms (Diodorus 19.72.2) |
| Hamilcar son of Gisco | REAL | Carthage | none: Syracuse | taken before Syracuse and handed over to be killed (Diodorus 20.30.2) |
| Bomilcar | REAL | Carthage | none: Carthage itself | tried for tyranny at Carthage; tortured and put to death (Diodorus 20.44.6) |
| Ophellas | REAL | outside (Cyrene) | none: Libya | killed by Agathocles, who took his army (Diodorus 20.42.4 to 20.42.5) |
| Xenodocus | REAL | outside (Acragas) | none: a free Sicily | beaten twice, he left for Gela before his trial (Diodorus 20.56.2, 20.62.5) |
| Acrotatus | REAL | outside (Sparta) | none: Acragas' war | "sailed secretly to Laconia" (Diodorus 19.71.5) |
| Orthon | REAL | citizens | none | carried Agathocles' offer to Ophellas (Diodorus 20.40.1); not known after |
| Philonides | INVENTED | army and guard | captain of the guard | (from `start-317.md` no. 15: a Morgantina captain) |
| Telesides | INVENTED | army and guard | generalship | (new: a chiliarch, the rank Agathocles himself once held, Diodorus 19.3) |

### Big events

kind: history

| Date range | What happened | Passage |
|---|---|---|
| 317/16 (Demogenes) | The coup: more than four thousand killed, more than six thousand exiled; Agathocles elected "general with absolute power" | Diodorus 19.5 to 19.9 |
| 314/13 (Nicodorus) | Acrotatus fails at Acragas and goes home; Hamilcar brokers a peace under which the Greek cities are "autonomous under the hegemony of Syracuse" | Diodorus 19.70 to 19.71 |
| 314/13 | Agathocles builds an army of ten thousand foot and thirty-five hundred horse; Carthage censures Hamilcar | Diodorus 19.72.2 |
| 312/11 (Polemon) | The exiles gather at Messana; Deinocrates asks Carthage in; a plot at Centoripa is crushed | Diodorus 19.102 to 19.104 |
| 311/10 (Simonides) | Hamilcar's fleet loses sixty triremes to a storm but lands; Agathocles is beaten at the Himeras; cities fall away; he plans to cross to Libya | Diodorus 19.106 to 19.110 |
| 310/09 (Hieromnemon) | He mans sixty ships, lands in Africa (Wikipedia: "August 310 BC") and burns his fleet | Diodorus 20.3 to 20.7; `year-headers.greek.txt` |
| 309/8 (Demetrius of Phalerum) | Hamilcar son of Gisco, attacking Euryelus by night, is taken and killed | Diodorus 20.29 to 20.30 |
| 308/7 (Charinus) | Ophellas of Cyrene joins him and is murdered; Bomilcar's bid for tyranny at Carthage fails | Diodorus 20.40 to 20.44 |
| 307/6 (Anaxicrates) | He calls himself king; defeats in Africa; he flees, his sons are killed; the Segesta massacre; Antander's killings | Diodorus 20.54 to 20.72 |
| 306/5 to 305/4 (Coroebus, Euxenippus) | Peace with Carthage; victory over Deinocrates at Torgium; Deinocrates comes over | Diodorus 20.77 to 20.79, 20.89 to 20.90 |

### Disagreements

kind: history. `start-317.md` has the coup (Diodorus, Justin, Polyaenus), the oath and his origins; `start-289.md` has his death, the succession and Messana. Six more:

| Question | One reading | The other |
|---|---|---|
| When he took the title of king | Diodorus, in Anaxicrates' year (307/6): "he called himself king. He decided not to take a diadem" (20.54.1) | Wikipedia: "Agathocles styled himself king of Sicily in 304 BC" |
| What Carthage paid at the peace | Diodorus: "gold to the value of three hundred talents of silver (or, as Timaeus says, one hundred and fifty), and two hundred thousand measures of grain" (20.79.5) | Justin: "Agathocles made peace with them on equal terms" (22.8.15) |
| The dead at Torgium | "about seven thousand, as Timaeus says" (Diodorus 20.89.5) | "but as some have written, about four thousand" (Diodorus 20.89.5) |
| Who broke Hamilcar's army before Syracuse | Diodorus: Agathocles' men caught Hamilcar and "delivered Hamilcar over to those who wished to take vengeance upon him" (20.30.2) | Justin: the Carthaginians "were reported to have been utterly cut off by Antander, the brother of Agathocles" (22.7.2) |
| Bomilcar | Diodorus: he "made his effort to gain the tyranny" at Carthage, and "they cruelly tortured Bormilcar himself and put him to death" (20.43.3, 20.44.6) | Justin: he "would have gone over to him with his army", and "he was nailed to a cross by the Carthaginians in the middle of the forum" (22.7.7 to 22.7.8) |
| Who killed the sons | Diodorus: "those who had been with Ophellas laying violent hands upon the young men" (20.70.4) | Justin: "Archagathus, when he was going to be killed by Arcesilaus, a former friend of his father" (22.8.14) |

### Gaps

kind: history

- In English, Diodorus 19.11 to 19.64, 19.66 to 19.69, 19.73 to 19.101, 20.80 to 20.88 and 20.91 onward are not saved; for some, only the year heading is.
- Diodorus 21.2 to 21.4 and 21.8 are saved but were not read for this draft.
- How Syracuse was governed while he was in Africa, beyond Antander's command.
- What the promise of land and debt relief came to in practice.
- How many of the six thousand exiles came home.
- The names of the chiliarchs who made the coup.

### Coin to look at

kind: history (modern catalogue). [Silver tetradrachm of Agathocles, 317 to 289 BCE](http://numismatics.org/collection/1991.100.14): the head of Persephone and a four-horse chariot.

---

## 6. Hieron II

### Player brief

kind: invention

You are Hiero, son of Hierocles, still a young man. Pyrrhus has left Sicily. The army, quarrelling with the citizens, has camped near Mergane and elected you and Artemidorus as its commanders. Syracuse does not usually accept officers chosen by soldiers. The old mercenaries are restless. The Mamertines hold Messana and take tribute from much of the island, and Carthage still holds Lilybaeum. Your opening goal: make the army's choice the city's, leave the city safe when you march, and drive the Mamertines back inside Messana.

### Key people

kind: history (the people, How it ended); kind: invention (Faction, Seat wanted, INVENTED rows)

| Person | | Faction | Seat wanted | How it ended |
|---|---|---|---|---|
| Artemidorus | REAL | army and guard | generalship | named once, beside Hiero (Polybius 1.8); not known |
| Leptines | REAL | citizens | leader of the assembly | Hiero married his daughter (Polybius 1.9); not known after |
| Philistis | REAL | family | none | known only from coins with a queen's head (ANS record below); the saved texts never name her |
| Pyrrhus | REAL | outside (Epirus) | none: the island | turned tyrant (Plutarch, *Pyrrhus* 23) and left Sicily (Hoyos: "frustrated departure in 275") |
| Thoenon | REAL | rich families | citadel | put to death by Pyrrhus (Plutarch, *Pyrrhus* 23) |
| Sosistratus | REAL | rich families | generalship | "took the alarm and withdrew" (Plutarch, *Pyrrhus* 23) |
| Hicetas | REAL | rich families | generalship | ruled nine years, then pushed out by Thoenon (Diodorus 22.7.2) |
| Phintias | REAL | outside (Acragas) | none: his own city | lost to Hicetas at the Hyblaeus (Diodorus 22.2.1; `start-289.md` no. 12) |
| Tyndarion | REAL | outside (Tauromenium) | none | joined Pyrrhus (Diodorus 22.8.3); not known after |
| Ciôs | REAL | outside (Mamertines) | none: Messana | captured in Hiero's victory, died when he tore open his wounds (Diodorus 22.13.5 to 22.13.6) |
| Hannibal | REAL | Carthage | none: Messana | put troops into Messana and kept it from surrendering (Diodorus 22.13.7) |
| Hanno son of Hannibal | REAL | Carthage | none | allied with Hiero against Rome (Diodorus 23.1.2) |
| Appius Claudius | REAL | outside (Rome) | none | crossed to Messana (Diodorus 23.3.1); consul for 264 in the saved fasti (`fasti/fasti-consulares.attalus.txt`) |
| Pollis | INVENTED | army and guard | captain of the guard | (new: a captain of the old mercenaries) |
| Seppius | INVENTED | outside (Mamertines) | none: Messana | (new: a Mamertine who wants to sell the town) |

### Big events

kind: history

| Date range | What happened | Passage |
|---|---|---|
| about 288 to 279 (modern) | Hicetas rules Syracuse, beats Phintias at the Hyblaeus, is beaten by Carthage at the Terias | Diodorus 22.2.1; an ANS Hicetas coin dated 288 to 279 |
| about 279 to 278 | Thoenon pushes Hicetas out; Thoenon holds the Island and Sostratus the city; they call in Pyrrhus | Diodorus 22.7.2 to 22.7.6 |
| about 278 (modern) | Carthage blockades the Great Harbour with a hundred ships | Diodorus 22.8.1; Wikipedia timeline "278 BCE - Siege of Syracuse (278 BC)" |
| about 278 | Pyrrhus comes by Tauromenium and Catana, takes over city and Island, reconciles Thoenon and Sosistratus | Diodorus 22.8.3 to 22.8.5 |
| about 278 to 277 | Pyrrhus takes Acragas, Eryx and Panormus, but fails before Lilybaeum | Diodorus 22.10 |
| about 276 to 275 | Pyrrhus turns tyrant, kills Thoenon and leaves the island | Plutarch, *Pyrrhus* 23 to 24 |
| about 275 to 274 | The army at Mergane elects Artemidorus and Hiero; the city accepts Hiero as general | Polybius 1.8; Justin 23.4.1 to 23.4.2 |
| after the election, no year | He marries Leptines' daughter and lets the old mercenaries be cut down near Centuripa | Polybius 1.9 |
| about 269 to 265 | He beats the Mamertines by the Longanus, takes their leaders and is hailed king | Polybius 1.9; Diodorus 22.13.1 to 22.13.6 |
| about 265 to 264 | Hannibal saves Messana; Hiero and Carthage ally; Appius Claudius crosses and Hiero goes home | Diodorus 22.13.7 to 22.13.9, 23.1.2, 23.3.1 |

After the span: Hiero makes peace with Rome (Diodorus 23.4.1; Polybius 1.16). Wikipedia: "in 263 he concluded a treaty with Rome".

### Disagreements

kind: history. `tyrant-campaigns.md` s.5 has the outline. Six here:

| Question | One reading | The other |
|---|---|---|
| How he came to power | Polybius: the soldiers elected him, and the Syracusans, "though by no means usually acquiescing in the election of officers by the soldiers", approved him (1.8) | Justin: "When Pyrrhus had withdrawn from Sicily, Hieron was made governor of it;" and "by the unanimous consent of all the cities, he was first made general against the Carthaginians, and soon after king." (23.4.1 to 23.4.2) |
| When he became king | Polybius: after the Longanus, "greeted by all the allies with the title of King" (1.9); Wikipedia: "he was proclaimed king after a victory in 265 BC" | Polybius again: "during a reign of fifty-four years" (7.8), which from his death in 215 (Wikipedia) points to about 269 (my arithmetic); Wikipedia's lead: "from 275 to 215 BC"; his coins are catalogued from "274 BCE" |
| Sostratus or Sosistratus, and how it ended | Diodorus: "Thoenon and Sostratus" (22.7.3), then "Pyrrhus effected a reconciliation between Thoenon and Sosistratus" (22.8.4) | Plutarch: "Sosistratus took the alarm and withdrew; but Thoenon was accused by Pyrrhus of complicity with Sosistratus and put to death." (*Pyrrhus* 23) |
| The river | Polybius: "the Mylaean plain near the River Longanus" (1.9) | Diodorus: "encamped along the Loitanus River" (22.13.2) |
| The price of peace with Rome in 263 | Diodorus: "the Romans received one hundred and fifty thousand drachmas" (23.4.1) | Polybius: "to pay besides an indemnity of a hundred talents of silver" (1.16) |
| His birth | Justin: "whose descent was traced from Gelon", and "he was the child of a female slave" (23.4.4, 23.4.6) | Wikipedia: "the illegitimate son of a Syracusan noble, Hierocles, who claimed descent from Gelon" |

### Gaps

kind: history

- A year for the election or the Longanus battle in any saved ancient text.
- His life before 275 beyond Justin's "presented by king Pyrrhus with many military gifts" (23.4.13).
- The name of Leptines' daughter, and whether she is Philistis.
- Who held the citadel between Thoenon's death and Hiero.
- The Mamertine leaders besides Ciôs.
- His fleet before 264.

### Coins to look at

kind: history (modern catalogue). [Silver coin of Philistis, 274 to 216 BCE](http://numismatics.org/collection/1992.121.11): a queen's head and a two-horse chariot. [Bronze coin of Hieron II, 274 to 216 BCE](http://numismatics.org/collection/2019.2.1314): the head of Gelon and a horseman with a spear. For the years before him, [gold coin of Hicetas, 288 to 279 BCE](http://numismatics.org/collection/1980.109.27): Persephone and a two-horse chariot.

---

## Start-card gaps filled

kind: history. Each row takes a line from a card's "Not found in the saved texts" list.

| Card | Gap | What the saved texts give | Passage | Filled? |
|---|---|---|---|---|
| `start-480.md` | BC date of Himera | Calliades, Olympiad 75: "480/79 = 480 BC" | `year-headers.greek.txt` line 4 | yes |
| `start-480.md` | BC date of Gelon's death | Timosthenes' year, 478/7 | Diodorus 11.38.1, by my arithmetic | yes, by arithmetic |
| `start-357.md` | Exact year of the landing | the archon Agathocles' year, 357/6, the year before Elpines and Olympiad 106 | Diodorus 16.9.1, 16.15.1, by my arithmetic | yes, by arithmetic |
| `start-357.md` | Number of ships fit for sea | Philistus "fitted out sixty triremes" against about as many | Diodorus 16.16.3 | partly: a year later, in 356/5 |
| `start-357.md` | Men in the Island garrison | "The soldiers of the tyrant numbered more than ten thousand" | Diodorus 16.19.3 | partly: after Nypsius brought more men |
| `start-357.md` | Messana and Catana | "many also of the Greeks from Italy and of the Messenians were summoned"; Callippus "on setting out to take Catana, he at once lost Syracuse" | Diodorus 16.9.6; Plutarch, *Dion* 58 | partly |
| `start-357.md` | Mint or coinage | a small bronze, catalogued 367 to 344 BCE | ANS 1944.100.55886 | partly: catalogue date only |
| `start-317.md` | BC years of the coup and the treaty | Demogenes' year 317/16; the treaty in Nicodorus' year 314/13 | Diodorus 19.2.1, 19.66.1, 19.71.6 to 19.71.7, by my arithmetic | yes, by arithmetic |
| `start-317.md` | Size of the fleet | "Agathocles manned sixty ships" | Diodorus 20.5.1 | partly: in 310, not 317 |
| `start-317.md` | Coin designs | Persephone and a chariot, catalogued 317 to 289 BCE | ANS 1991.100.14 | partly: catalogue date only |
| `start-289.md` | BC year of the king's death | "361–289 BC" | Wikipedia, Agathocles | partly: modern |
| `start-289.md` | Hiero's position in 289 | none for 289; under Pyrrhus he was "presented by king Pyrrhus with many military gifts" | Justin 23.4.13 | no, only a later hint |
| `tyrant-campaigns.md` | Who ruled between Agathocles and Hieron II | Hicetas for nine years; then Thoenon (the Island) and Sostratus (the city); then Pyrrhus | Diodorus 22.7.2, 22.7.6, 22.8.4 | yes for the order; the years are modern |
| `tyrant-campaigns.md` | Dionysius II at Locri | nothing new | | no |

## Names to watch

kind: invention. Clashes between cards that the game data will meet:

- **Damon**: the invented smith in `rising-cast.md` (and `data/people.json`) and the invented ship's captain in `start-357.md` share a name.
- **Theodorus**: a real rich man of Dionysius I's time in `data/people.json`, and an invented grain contractor in `start-357.md`.
- **Demophilus**: invented twice (`start-317.md` no. 16 and `start-289.md` no. 19), and also a real general of Agathocles: "Leptines and Demophilus" (Diodorus 20.56.2).
- **Zoippus**, offered in `names.md`, was a real man of Hiero II's house: "Adranodorus and Zoippus, the sons-in-law of Hiero" (Livy 24.5.7). It is not used here for an invented man.

## To fetch

kind: history. Not in the saved texts; each would fill a gap above. The references come from my own knowledge of where these passages sit, not from a saved text, so check each one when it is fetched.

- Diodorus book 10, the fragments on Gelon and Hippocrates (Loeb, Oldfather, vol. 4).
- Diodorus 15.1 to 15.12 and 15.18 to 15.72 in English, apart from 15.24 (Loeb, Oldfather, vol. 7).
- Diodorus 19.11 to 19.64, 19.66 to 19.69, 19.73 to 19.101, 20.80 to 20.88 and 20.91 to 20.113 (Loeb, Geer, vols. 9 and 10).
- Polyaenus 1.27 in English (Shepherd), to read the Megara passage whole.
- Herodotus 6.22 to 6.24 (Godley), on Zancle and the Samians.
- Thucydides 6.4 to 6.5 (Crawley), on the founding dates of Gela, Camarina and Zancle.
- Justin 21.1 to 21.3 (Watson), on Dionysius II.
- Strabo 6.1.8 (Jones) and Athenaeus book 12 (Yonge), which I expect to tell of Dionysius II at Locri; not checked.

## Quote check

kind: history. Every quote above, with the file it was checked against on 2026-11-27 (paths under `sources/` in the Phoenician-Punic World repo). Words in quotes that are this file's own labels ("Carthage", "outside (city)", "modern", "478/7", and the cards' heading "Not found in the saved texts") are not listed.

```
diodorus/year-headers.greek.txt | Olympiad n, year 1 = 776 - 4(n-1) BC
sicily-places/wikipedia-timeline-syracuse.txt | 491–478 BCE - Gelon is tyrant of Syracuse.
diodorus/english/book11.loeb.txt | Benefactor and Saviour and King
sicily-tyrants/herodotus-7-153-167.godley.txt | when the Megarians in Sicily surrendered to him on terms after a siege
sicily-places/amendola-deinomenid-sicily-civic-body.txt | Διογνήτῳ δὲ, τῷ Μεγαρέων ἄρχοντι, χρήματα παρὰ δύναμιν ἐπέταξεν
sicily-places/amendola-deinomenid-sicily-civic-body.txt | to pay a sum beyond their means
modern/sicilian-wars/wikipedia-sicilian-wars-2026.txt | Anaxilas of Rhegion from Italy, who had captured Zankle from Gelo in 490 BC
sicily-tyrants/herodotus-7-153-167.godley.txt | took no more thought of this plan
diodorus/english/book11.loeb.txt | he was making ready to sail to Greece with a large force and to join the Greeks in their war against the Persians
sicily-tyrants/herodotus-7-153-167.godley.txt | the Euboeans of Sicily
sicily-tyrants/pindar-pythian-1.svarlien.txt | the king of Aetna
sicily-tyrants/bacchylides-3-5.svarlien.txt | commander of the Syracusans
sicily-tyrants/pindar-pythian-1.svarlien.txt | the name of Aetna
diodorus/english/book11-38-72.loeb.txt | he was avaricious and violent
sicily-tyrants/aristotle-politics-5.rackham.txt | the sharp-ears that used to be sent out by Hiero wherever there was any gathering or conference
sicily-tyrants/pindar-pythian-1.svarlien.txt | the king of Aetna, for whom Hieron founded that city with god-built freedom
sicily-tyrants/pindar-pythian-1.svarlien.txt | Steer your men with the rudder of justice
diodorus/english/book15.loeb.txt | ended his life in a blaze of glory
diodorus/english/book14.loeb.txt | starved himself to death
diodorus/english/book14-1-18-97-117.loeb.txt | together with his near of kin
diodorus/english/book13.loeb.txt | with supreme power
diodorus/english/book14-1-18-97-117.loeb.txt | New Citizens
diodorus/english/book15-73-74.loeb.txt | he fell violently ill from the quantity of liquor he had consumed
plutarch/dion.perrin.txt | when the sick man asked for a sleeping potion, they gave him one that robbed him of his senses and made death follow sleep
sicily-places/wikipedia-dionysius-i.txt | Cicero and Diodorus Siculus report that he died of natural causes shortly after learning of his play's victory in 367 BC
sicily-places/wikipedia-timeline-syracuse.txt | 397 BCE - Siege of Syracuse (397 BC)
plutarch/dion.perrin.txt | lost a city and got a cheese-grater
plutarch/lives-carthage.perrin.txt | in the tenth year of his exile
diodorus/english/book15-73-74.loeb.txt | ruled as tyrant twelve years
plutarch/lives-carthage.perrin.txt | having held this for ten years, and then for twelve other years, after the expedition of Dion
sicily-tyrants/plato-letters-7-8.bury.txt | charging Dion with plotting against the tyranny, Dionysius set him aboard a small vessel and drove him out with ignominy
plutarch/dion.perrin.txt | which Dion had written to the Carthaginian officials
plutarch/dion.perrin.txt | according to Timaeus, he beguiled Dion by a feigned reconciliation
diodorus/english/book16.loeb.txt | Timoleon frightened the tyrant Dionysius into surrendering the citadel
plutarch/lives-carthage.perrin.txt | in admiration of Timoleon
plutarch/lives-carthage.perrin.txt | to surrender himself and the citadel
plutarch/lives-carthage.perrin.txt | within fifty days after his landing in Sicily
sicily-places/wikipedia-timoleon.txt | Dionysius II surrendered Ortygia in 343 BC
diodorus/english/book16.loeb.txt | retaining his private possessions
sicily-places/wikipedia-timoleon.txt | a private, well-off, citizen
diodorus/english/book16.loeb.txt | spent the remaining years of his life in poverty at Corinth
plutarch/lives-carthage.perrin.txt | with a single ship and a small treasure
plutarch/dion.perrin.txt | four hundred triremes and his ten thousand horsemen
diodorus/english/book20.loeb.txt | the younger of his sons
diodorus/english/book20-gaps.txt | until death
diodorus/english/book19-gaps.txt | sailed secretly to Laconia
plutarch/dion.perrin.txt | general with absolute power
diodorus/english/book19-gaps.txt | autonomous under the hegemony of Syracuse
sicily-places/wikipedia-agathocles.txt | August 310 BC
diodorus/english/book20.loeb.txt | he called himself king. He decided not to take a diadem
sicily-places/wikipedia-agathocles.txt | Agathocles styled himself king of Sicily in 304 BC
diodorus/english/book20.loeb.txt | gold to the value of three hundred talents of silver (or, as Timaeus says, one hundred and fifty), and two hundred thousand measures of grain
justin/book22-23.watson.txt | Agathocles made peace with them on equal terms
diodorus/english/book20-gaps.txt | about seven thousand, as Timaeus says
diodorus/english/book20-gaps.txt | but as some have written, about four thousand
diodorus/english/book20-gaps.txt | delivered Hamilcar over to those who wished to take vengeance upon him
justin/book22-23.watson.txt | were reported to have been utterly cut off by Antander, the brother of Agathocles
diodorus/english/book20-gaps.txt | made his effort to gain the tyranny
diodorus/english/book20-gaps.txt | they cruelly tortured Bormilcar himself and put him to death
justin/book22-23.watson.txt | would have gone over to him with his army
justin/book22-23.watson.txt | he was nailed to a cross by the Carthaginians in the middle of the forum
diodorus/english/book20.loeb.txt | those who had been with Ophellas laying violent hands upon the young men
justin/book22-23.watson.txt | Archagathus, when he was going to be killed by Arcesilaus, a former friend of his father
modern/hoyos-2006/hoyos-2006.txt | frustrated departure in 275
plutarch/lives-carthage.perrin.txt | took the alarm and withdrew
sicily-places/wikipedia-timeline-syracuse.txt | 278 BCE - Siege of Syracuse (278 BC)
sicily-places/wikipedia-hiero-ii.txt | in 263 he concluded a treaty with Rome
polybius/book1.shuckburgh.txt | though by no means usually acquiescing in the election of officers by the soldiers
justin/book22-23.watson.txt | When Pyrrhus had withdrawn from Sicily, Hieron was made governor of it;
justin/book22-23.watson.txt | by the unanimous consent of all the cities, he was first made general against the Carthaginians, and soon after king.
polybius/book1.shuckburgh.txt | greeted by all the allies with the title of King
sicily-places/wikipedia-hiero-ii.txt | he was proclaimed king after a victory in 265 BC
sicily-tyrants/polybius-7-3-8.shuckburgh.txt | during a reign of fifty-four years
sicily-places/wikipedia-hiero-ii.txt | from 275 to 215 BC
sicily-places/ans-mantis-syracuse-hieron-ii-all.tsv | 274 BCE
diodorus/english/book22.txt | Thoenon and Sostratus
diodorus/english/book22.txt | Pyrrhus effected a reconciliation between Thoenon and Sosistratus
plutarch/lives-carthage.perrin.txt | Sosistratus took the alarm and withdrew; but Thoenon was accused by Pyrrhus of complicity with Sosistratus and put to death.
polybius/book1.shuckburgh.txt | the Mylaean plain near the River Longanus
diodorus/english/book22.txt | encamped along the Loitanus River
sicily-tyrants/diodorus-23-1-4.loeb.txt | the Romans received one hundred and fifty thousand drachmas (the saved text has a footnote marker "8" after "thousand")
polybius/book1.shuckburgh.txt | to pay besides an indemnity of a hundred talents of silver
justin/book22-23.watson.txt | whose descent was traced from Gelon
justin/book22-23.watson.txt | he was the child of a female slave
sicily-places/wikipedia-hiero-ii.txt | the illegitimate son of a Syracusan noble, Hierocles, who claimed descent from Gelon
justin/book22-23.watson.txt | presented by king Pyrrhus with many military gifts
diodorus/year-headers.greek.txt | 480/79 = 480 BC
diodorus/english/book16-5-20.loeb.txt | fitted out sixty triremes
diodorus/english/book16-5-20.loeb.txt | The soldiers of the tyrant numbered more than ten thousand
diodorus/english/book16-5-20.loeb.txt | many also of the Greeks from Italy and of the Messenians were summoned
plutarch/dion.perrin.txt | on setting out to take Catana, he at once lost Syracuse
diodorus/english/book20.loeb.txt | Agathocles manned sixty ships
sicily-places/wikipedia-agathocles.txt | 361–289 BC
diodorus/english/book20.loeb.txt | Leptines and Demophilus
livy/books23-29.foster.txt | Adranodorus and Zoippus, the sons-in-law of Hiero
```
