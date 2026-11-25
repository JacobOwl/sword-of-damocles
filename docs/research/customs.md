# Customs, institutions and tricks from the sources: a menu for the game

Written 2026-11-25 (thread 33). **Research only. Nothing here is built.** Each item is a candidate for Jacob to pick; any new rule would be an optional switch, off by default, in its own thread.

Petalism (Diodorus 11.86-87) started this list. Thread 32 is building it with the quarrels switch, so it is not repeated here.

## How to read this

- **Ranked by fit with Jacob's taste:** concrete CK3-style actions first, then things factions and rivals do on their own, then events, then flavor. The top five are starred.
- **Attested** says how well we know it:
  - *Strong*: a writer of the time (Aristotle, Lysias, Plato's letters).
  - *Good*: a main narrative history (Diodorus, Plutarch), usually drawing on lost writers of the time.
  - *Anecdote*: a later collection of stories or tricks with one source only (Polyaenus, pseudo-Aristotle's *Economics*, Justin's summary of Trogus). Good for events, but don't build a whole rule on one of these.
  - *Later legend*: not ancient.
- **Hook** says what the item could become: flavor (a line in the chronicle), event, action, or switch. It also says whether it is cheap (data only) or costly (needs engine work).
- **Quotes.** Every quote was opened, as follows:
  - Most are from the saved texts in the Phoenician-Punic World repo (`sources/`, read-only). The file is named the first time each is used.
  - Plutarch's *Timoleon* and Justin books 19 to 21 are not saved. They were read online this session: Plutarch at lexundria.com (Perrin's translation), Justin at attalus.org and tertullian.org (Watson's translation). They are quoted in short pieces only, and a line in `docs/later.md` asks for them to be saved.
- **Already in the game** is checked against `data/`, `docs/design.md`, `docs/full-game.md` and the switches. What the game already has is listed at the end and was skipped.

## The ranked list

### ★1. The tyrant's purse tricks (action set; cheap to medium)

pseudo-Aristotle's *Economics* (`sources/sicily-tyrants/pseudo-aristotle-oeconomica-2-2.armstrong.txt`) gives a whole chapter of Dionysius I's money schemes. The game has three of them already: Demeter's ornaments, the tin coins and the Asclepius offerings. The rest are new, and each is a concrete, one-off move with a cost the city remembers:

- **The fake bribe fund.** He asked two staters a head to buy a traitor's city, then gave it back "pretending that the plot had failed… In this way he won the confidence of the citizens; so that when he again asked for money, they contributed… But this time he kept it for building the fleet." (*Economics* 2.2.20)
- **The palace sale.** He sold his furniture to the rich and wrote down the buyers. "When they had all paid, he commanded every one to bring back the article he had bought." (2.2.20)
- **The cattle trap.** He promised no tax on new herds, then "had them all valued and imposed a tax. The citizens were angry at being thus deceived, and proceeded to kill and sell their beasts." (2.2.20)
- **The orphans' estates.** "He made use of the orphans' property until each should come of age." (2.2.20)
- **The double drachma.** He made everyone bring in their silver "under pain of death" and "coined [it] into drachmae each bearing the face value of two." (2.2.20)
- **Half the plunder, then the other half.** He promised his sailors they could keep half their loot from the temple at Pyrgi, then "commanded them to bring him the other half as well." (2.2.20; Polyaenus 5.2.21 tells the same story, in `sources/sicily-tyrants/polyaenus-book5.shepherd.txt`)

Aristotle, writing at the time, gives the overall effect: "in the reign of Dionysius the result of taxation used to be that in five years men had contributed the whole of their substance" (*Politics* 5.1313b, `sources/sicily-tyrants/aristotle-politics-5.rackham.txt`).

- **Attested:** Strong for the heavy taxes (Aristotle). The single tricks are anecdote, one source each.
- **Hook:** a menu of named "purse" actions, each usable once per reign. Each gives silver now and leaves a named memory that later petitions and plots can cite ("the rich remember the palace sale"). The fake bribe fund is the only one that costs nothing the first time and doubles the take the second time.
- **Overlap:** it fits beside `purseDry` ("The purse runs dry") as more ways to raise money that the city can see.
- **Why it fits:** these are CK3-style concrete decisions, with readable reasons.

### ★2. The listeners (switch; medium)

Aristotle's list of a tyrant's methods includes spies: "to have spies like the women called provocatrices at Syracuse and the sharp-ears that used to be sent out by Hiero wherever there was any gathering or conference (for when men are afraid of spies of this sort they keep a check on their tongues, and if they do speak freely are less likely not to be found out)" (*Politics* 5.1313b).

Polyaenus has Dionysius make the musicians and courtesans tell what their lovers said (5.2.13; this is already the event "What the musicians hear"). He also has two fake-death traps: a false report of his death (5.2.15, already the event "A report of your death") and a feigned illness (5.2.16, new).

- **Attested:** Strong (Aristotle, a contemporary) for the spies' existence under Hieron I and at Syracuse. The Greek names are *potagōgides* (the "provocatrices") and *ōtakoustai* (the "sharp-ears").
- **Hook:** a switch, "Sharp-ears". You pay for a standing network of listeners, held as a power object. Plots against you are found sooner. But the city "checks its tongue": factions voice fewer grievances, so the early warnings you get from open complaint grow rarer. That is a real trade between hearing more and being told less.
- **The Ear of Dionysius is later legend.** The cave's name "was coined in 1608 by the painter Caravaggio" (Wikipedia extract, `sources/sicily-places/wikipedia-ear-of-dionysius.txt`), and the listening story comes with it. Use the quarries as the ancient prison instead. Cicero calls it "That prison which was built at Syracuse, by that most cruel tyrant Dionysius, which is called the stone-quarries" (*Against Verres* 2.5.143, `sources/sicily-tyrants/cicero-verres-2-5-143-148-2-4-115-119.yonge.txt`). If the Ear appears at all, it should be a chronicle aside labelled as later legend.

### ★3. The great oath, and the oath shrine of the Palici (action; medium)

This is content for "Oaths and vows as objects", which is already drafted in `docs/full-game.md`.

- **The great oath.** When the women suspected Callippus of plotting against Dion, "they required him to swear the great oath… The one who gives this pledge goes down into the sanctuary of Demeter and Persephone, where, after certain sacred rites have been performed, he puts on the purple vestment of the goddess, takes a blazing torch in his hand, and recites the oath." He swore it, and then waited "for the festival of the goddess by whom he had sworn, the Coreia, and then to do the murder." (Plutarch, *Dion* 56, `sources/plutarch/dion.perrin.txt`)
- **The Palici.** The Sicel shrine of the Palici was where "the most sacred oaths are taken there and men who swear falsely are immediately overtaken by the punishment of heaven". It was also a sanctuary for runaway slaves, whose masters could take them back only after swearing to treat them humanely, and "history records no case… of a violation" (Diodorus 11.89.5-8, `sources/diodorus/english/book11-73-92.loeb.txt`).
- **Attested:** Good, from Plutarch and Diodorus. The Palici passage is Diodorus describing his own island.
- **Hook:** an action, "Demand the great oath", against a man you suspect. An innocent man swears and his family is mollified. A plotter has to swear or be exposed. If he swears, his plot goes on, but it carries a visible mark ("he swore by the goddess"). Breaking the oath turns the gods' side of the city against him once it is known, and against you if you made a man swear and then struck him anyway.
- **Why it fits:** it is a rival's move as much as yours. The Callippus story is exactly the kind of betrayal Jacob wants from political rivals. The Palici could be the Sicel towns' own oath, used when you make a treaty inland.

### ★4. Lay down the sword: gambles with your own life (action; cheap to medium)

Three attested versions of one move: give yourself up and dare the crowd.

- **Gelon unarmed.** He called the army to an assembly "fully armed", and "came to the assembly not only with no arms but not even wearing a tunic and clad only in a cloak". He gave an account of his whole life, and the crowd acclaimed him "Benefactor and Saviour and King" (Diodorus 11.26.5-6, `sources/diodorus/english/book11.loeb.txt`).
- **Dionysius in the dust.** When mutinous mercenaries broke into his house, "he came out to them in mean clothes, with dust on his head", and they let him go. Later "Dionysius not long afterwards surrounded these same men with his troops at Leontini, and cut them all to pieces" (Polyaenus 5.2.1; Polyaenus himself points to Diodorus 14.78).
- **Agathocles' false abdication.** "He took off his robe and sword, and declared himself a private citizen." The Syracusans begged him to rule, and "in less than six days, having put many of the citizens to death, and driven more than five thousand into exile, possessed himself of the sovereignty" (Polyaenus 5.3.7).
- **Attested:** Good for Gelon (Diodorus). Anecdote for the other two (Polyaenus).
- **Hook:** an action open once a reign, or after a defeat. Its odds are shown and come from the citizens' and the army's moods. If it succeeds, you gain legitimacy, or a fresh mandate you can then betray, Agathocles-style. If it fails, you have handed yourself to the people who hate you, and the sword check runs at once.
- **Why it fits:** a gamble the player chooses, with readable odds and a death that doesn't feel random. It suits the Gelon campaign and the Agathocles campaign in `docs/full-game.md`.

### ★5. The oracle of "his betters" (switch; medium)

"Now he had an oracle the gods had given him that he should die when he had conquered 'his betters,' but he interpreted the oracle as referring to the Carthaginians… So in the wars that he had many times waged against them he was accustomed to withdraw in the hour of victory and accept defeat willingly". In the end he won a tragedy prize at the Lenaea at Athens, held a drinking bout to celebrate, and died of it, "though a wretched poet and though judged on this occasion in a competition at Athens, he defeated 'better' poets than himself" (Diodorus 15.74.1-4, `sources/diodorus/english/book15-73-74.loeb.txt`).

- **Attested:** Good (Diodorus), but it is the kind of story told after a death. Present it as "the story told".
- **Hook:** a switch, "A prophecy". At the start you get one riddling oracle drawn from a short list in `data/`. The chronicle keeps it in view, and one trigger fulfils it. The trigger reads several ways, and the obvious reading is wrong. The sword check treats a fulfilled oracle as a warning that has come true, never as a blow from nowhere.
- **Why it fits:** "the sword check gives warnings before the blow", and this one makes the player bend their own strategy (Dionysius threw wars to stay alive). The Damocles banquet is already in the game, so this is the other famous Dionysius death story.

### 6. The suppliant at the altar (event that factions answer; cheap)

Ducetius, the beaten Sicel leader, rode into Syracuse by night, and "seating himself at the altars he became a suppliant of the city". The demagogues wanted him punished. "The more fairminded of the elder citizens" argued "to spare the suppliant and show due regard for Fortune and the wrath of the gods". He was sent to live at Corinth on a pension (Diodorus 11.92.1-4).

- **Attested:** Good.
- **Hook:** an event in which a beaten rival, a fled general or an exile's son reaches the altars. The factions each answer by their priority lists: the citizens shout one way and the elders the other. You decide, and sparing or killing him is logged with its reason. This is also the parked idea "events that people other than you answer" (`docs/later.md`), in its simplest form.

### 7. Hatred and contempt: two reasons to strike a ruler (switch; medium)

Aristotle sorts attacks on monarchs by motive. "Dion attacked the younger Dionysius because he despised him, when he saw the citizens despising him and the king himself always drunk" (*Politics* 5.1312a). Plutarch: "the young king once kept up a drinking bout for ninety consecutive days… during this time his court gave no access or admission to men or matters of consequence" (*Dion* 7).

- **Attested:** Strong (Aristotle, who knew men at both courts).
- **Hook:** plotters gain boldness from two sources:
  - **Hatred**, from what you did to them, which the game already tracks.
  - **Contempt**, a new and visible number that rises when you lose battles, let petitions go unheard, drink, or are mocked abroad (see item 11).
- Hatred makes more plots. Contempt makes plotters bolder and quicker. A feared but respected ruler and a despised one then die in different ways, and the warnings say which it is ("they no longer fear you; they laugh").
- **Why it fits:** it is the heir campaign's (Dionysius II) natural pressure.

### 8. Carthage acts on its own: four practices (Carthage bot; cheap to medium)

The game already has the Hundred judging generals and the crucified general (`hundredAuditTheGeneral`, `crucify`). These are new:

- **Generals paired with their enemies.** In 310 the council "appointed as generals of the armies Hanno and Bormilcar, men who had an inherited feud", thinking "that because of the private mistrust and enmity of the generals the safety of the city as a whole would be secured" (Diodorus 20.10.1-2, `sources/diodorus/english/book20.loeb.txt`). Bomilcar then tried a coup, and Carthage "cruelly tortured Bormilcar himself and put him to death, paying no heed to the oaths which had been given" (20.44.6).
  - **Hook:** Carthage's bot can name two feuding commanders. That is weaker in the field but safer at home, and a rival you can play off against the other.
- **No Greek for Carthaginians.** After Suniatus wrote to Dionysius "in a letter written in Greek, of the approach of the army and the inactivity of its leader", a decree said "that no Carthaginian should thenceforward study the Greek literature or language… so that no one might be able to speak with the enemy, or write to him, without an interpreter" (Justin 20.5.12-13, read online, Watson).
  - **Hook:** when your spy in Carthage is caught, Carthage bans Greek, and your spying there costs more for some years. That is Carthage answering what you do.
- **Hanno's wedding plot.** He planned to poison the senate at his daughter's wedding. When it leaked, the senate "merely set bounds by a decree to the expenses of marriage entertainments". Then "he… raised the slaves", and in the end "his body, mangled with stripes, was nailed to a cross", with "all his children and relations, too, though guiltless" executed (Justin 21.4, read online, Watson; the date is about the 350s, uncertain).
  - **Hook:** a Carthage chronicle storyline. A great family overreaches, Carthage's mood swings, and its war goal stalls while it purges.
- **Gods from the enemy.** After the plague of 396, "since they had included neither Corê nor Demeter in their rites, they appointed their most renowned citizens to be priests of these goddesses… following the ritual used by the Greeks" (Diodorus 14.77.5, `sources/religion/diodorus-14.77-loeb.txt`). In 310 they sent offerings to Heracles at Tyre, to whom they had once sent "a tenth of all that was paid into the public revenue" (20.14.1-2).
  - **Hook:** a Carthage mood or chronicle line after a disaster, and a cheap reason for a pause in its war.
- **Not proposed for play: the sacrifice of 310.** Diodorus also says that in 310 Carthage "selected two hundred of the noblest children and sacrificed them publicly" (20.14.5). Modern scholars disagree about how far the tophet burials bear this out (see the Phoenician-Punic World repo's `sources/religion/`). If it appears at all, it should be one chronicle line with the disagreement shown. That is Jacob's call.
- **Attested:** Good for the Diodorus items. Anecdote for Justin.

### 9. The ruler's wife as broker: Damarete's crown (action; cheap)

After Himera the Carthaginians "promised to give in addition a gold crown to Damaretê, the wife of Gelon. For Damaretê at their request had contributed the greatest aid toward the conclusion of the peace". From its gold "she struck a coin which was called from her a Damareteion" (Diodorus 11.26.3).

- **Attested:** Good. The coin story is debated by numismatists, which has not been checked here.
- **Hook:** a spouse action, "Let her plead", during peace talks with Carthage. It gives better terms and raises her standing, and a wife with standing is a power in the house with her own goals. This gives the four women already in the cast something to do in politics, CK3-style.

### 10. Plunder the Phoenicians (event at the declaration of war; cheap)

Before the war of 398, "the Syracusans, with the permission of Dionysius, seized as plunder the property of the Phoenicians; for no small number of Carthaginians had their homes in Syracuse and rich possessions". The other Greek cities did the same, "although they hated the tyranny of Dionysius" (Diodorus 14.46.1-2, `sources/diodorus/english/book14.loeb.txt`).

- **Attested:** Good.
- **Hook:** when war is declared, you choose: let the city loot, or protect the Punic merchants.
  - Let the city loot: silver and the citizens' joy now, Carthage's fury, and trade lost later.
  - Protect them: the citizens grumble, but the harbour keeps its trade, and a grateful merchant may become a source in Carthage.
- **Why it fits:** it sits right inside the game's years.

### 11. The Olympic embassy, the Lenaea prize, and court flattery (event; cheap)

This is content for "Prestige abroad", which is drafted in `docs/full-game.md`.

- **Olympia, 388.** Dionysius sent chariot teams, gold-woven tents and reciters for his poems. "When they observed how poor his verses were, they laughed Dionysius to scorn and went so far… that some of them even ventured to rifle the tents". The orator Lysias "urged the multitude not to admit to the sacred festival the representatives from a most impious tyranny". The chariots crashed, the ship home was wrecked, and the sailors told Syracuse "that the badness of the verses caused the ill-success" (Diodorus 14.109.1-5, `sources/diodorus/english/book14-1-18-97-117.loeb.txt`). Lysias' own speech, the *Olympiacus*, survives in part; it was not opened here.
- **The flatterer.** An envoy accused of neglecting his duty told Dionysius the quarrel began because "they wanted sing the paeans of Stesichorus and Pindarus, and I wanted to sing your paeans", and the charge was dropped (Polyaenus 5.46).
- **Attested:** Good for Olympia (Diodorus, and a contemporary speech exists). Anecdote for the flatterer.
- **Hook:** an action, "Send teams to the games". It costs silver, and the outcome is shown in advance as a range. A win brings fame abroad. Mockery raises contempt (item 7) and starts a rumor at home. The flatterer is a dinner moment: praise the tyrant's verses to escape a charge.

### 12. What a free city does when the tyrant falls (end-of-reign events; medium)

- **The statues on trial.** Timoleon's Syracuse "actually sold its public statues at auction, a regular vote of condemnation being passed against each, as though they were men submitting their accounts". But "the statue of Gelon, their ancient tyrant, was preserved… because they admired and honoured him for the victory which he had won over the Carthaginians at Himera" (Plutarch, *Timoleon* 23.4-5, read online).
- **The citadel pulled down.** "They overthrew and demolished, not only the citadel, but also the palaces and the tombs of the tyrants. Then… Timoleon built the courts of justice there" (*Timoleon* 22.2). Diodorus agrees: "He razed the citadel and the tyrant's palace on the Island" (16.70.4, `sources/diodorus/english/book16.loeb.txt`).
- **The festival of liberty.** After Thrasybulus fell, the assembly voted "a colossal statue of Zeus the Liberator and each year to celebrate with sacrifices the Festival of Liberation… four hundred and fifty bulls" (Diodorus 11.72.2).
- **The mercenary citizens shut out.** In the same vote, the 7,000 left of Gelon's "more than ten thousand foreign mercenaries" made citizens were barred from office, so they "revolted… and they seized in the city both Achradinê and the Island" (11.72.3, 11.73.1). Aristotle uses it as his example: the Syracusans "conferred citizenship on their foreign troops and mercenaries and then faction set in and they came to battle" (*Politics* 5.1303b).
- **Attested:** Good for all four, and Strong for the mercenaries (Aristotle).
- **Hook:**
  - An end-of-game screen, "Your statue is tried". The verdict is read from your log: what you won for the city against what you took from it. It fits the parked end-of-reign history.
  - For the long game, the men you made citizens (`newCitizens`) become a faction that outlives you and fights to keep its rights.

### 13. The demand for land and the end of debts (faction goal; cheap)

- In 356, Heracleides had Hippo propose "a distribution of land, urging that liberty was based on equality, and slavery on the poverty of those who had naught" (Plutarch, *Dion* 37). Dion later "opposed them and repealed their former decrees on this head, thereby winning their displeasure" (*Dion* 48).
- In 317, "many of those who were poor and involved in debt welcomed the revolution, for Agathocles promised in the Assembly both to abolish debts and to distribute land to the poor" (Diodorus 19.9.5, `sources/diodorus/english/book19.loeb.txt`).
- **Attested:** Good.
- **Hook:** a visible goal the citizens' faction can take up ("land and the end of debts"). It is a promise a Pretender can make and you can steal. Granting it breaks the rich families. Refusing it, as Dion did, costs the people. This is data in `agendas.json`.

### 14. The fine, and the rich friend who pays it (event; cheap)

When the archons fined the young Dionysius for raising an uproar in the assembly, "Philistus… paid the fine and urged Dionysius to speak out… if they wanted to fine Dionysius throughout the whole day he would provide the money for him" (Diodorus 13.91.4, `sources/diodorus/english/book13-1-42-91-96.loeb.txt`).

- **Attested:** Good.
- **Hook:** an early-rise event for an open-history or demagogue start. A patron who pays your fines becomes a named debt you owe (it fits "favours as objects", parked). Later, Philistus the friend can become Philistus the rival.

### 15. Diocles and the temple torn down for the walls (event; cheap)

- **The lawgiver's death.** The lawgiver Diocles made it death to carry a weapon into the market-place. Hurrying out against an enemy, he walked in with his sword. When told he was breaking his own law, he said "Not so, by Zeus, I will even uphold them," and killed himself (Diodorus 13.33.2-3).
- **His temple.** He was honoured as a hero with "a temple in his honour at public expense — the one which was torn down by Dionysius at a later time when the walls of the city were being constructed" (13.35.2).
- **Attested:** Good.
- **Hook:** when you build walls (great works or the Epipolae wall), an event offers stone from the hero's shrine. Using it is faster and cheaper, but the citizens and the priests take offence. In an open-history game, Diocles' law can be one of `laws.json`: no arms in the agora, which makes a coup harder and your own guard illegal.

### 16. Laws on spending (laws; cheap)

The Greek cities, and Carthage, passed laws limiting what the rich could spend on show:

- **Funerals.** Syracuse "had by law put an end to costly funerals", and Gelon kept the law at his own burial (Diodorus 11.38.2).
- **Bedding on guard.** Besieged Acragas decreed that a night guard have no "more than one mattress, one cover, one sheepskin, and two pillows" (13.84.5).
- **Weddings.** Carthage capped the cost of wedding feasts after Hanno's plot (Justin 21.4, item 8).
- **Gold.** Dionysius made "any woman who desired to wear gold" pay a fee to the temple (*Economics* 2.2.20).
- **Attested:** Good, except the gold fee, which is anecdote.
- **Hook:** laws in `laws.json`. Each pleases the people and stings the rich families. A ruler who keeps his own law, as Gelon did, gains standing.

### 17. Ransom, sale, or freedom for captives (action after a capture; cheap)

- **Ransom or sale.** At Rhegium, those "who could pay as ransom a mina of silver should be freed, but to sell as slaves those who were unable" (Diodorus 14.111.4). The *Economics* version: he took a ransom and then sold them anyway (2.2.20).
- **A split release to sow distrust.** Dionysius made the Carthaginians pay a high ransom "but he released the Greeks… without any ransom at all. The partiality shown by the tyrant caused the Carthaginians to become suspicious of the Greeks, and they discharged all the Greek mercenaries" (Polyaenus 5.2.17).
- **Attested:** Good (Diodorus), plus anecdote (Polyaenus).
- **Hook:** after the island army takes a town, you choose ransom, sale or release. The Polyaenus version makes Carthage's bot react on its own by dismissing its Greek companies, which then go on the mercenary market.

### 18. Hostages held as objects (power object; medium)

The game already offers "Take their families as hostages" as an event choice. The sources show hostages as lasting objects:

- "Since the Campanians had given hostages to Dionysius… they were compelled to maintain the alliance with Dionysius, although they would gladly have joined the Carthaginians" (Diodorus 14.61.6).
- He later "returned the hostages to the Rhegians", but only as a pretext before the siege (14.108.3).
- Agathocles sent his own son as a hostage to Ophellas of Cyrene, as cover for a trap (Polyaenus 5.3.4).
- **Attested:** Good.
- **Hook:** a hostage is a named person held at Ortygia. While you hold him, his town's lean can't fall below a floor. Returning him is a gift. Killing him breaks the town for good. An escaped hostage is a story.

### 19. Loyalty tests (events; cheap)

- **Sealed blank tablets.** Dionysius gave each ship's captain a sealed tablet with nothing written inside, and executed those who opened it before the signal (Polyaenus 5.2.12).
- **Who wants to go home?** Before sailing for Libya, Agathocles offered to let anyone leave with his goods, and "all those who took advantage of the proclamation, he ordered to be executed, as traitors and cowards" (Polyaenus 5.3.5).
- **Attested:** Anecdote.
- **Hook:** two events for the commission switch. You can test a captain at the cost of his goodwill, and learn his loyalty number, or part of it.

### 20. Truth in the wine, and the second dinner (dinner moment; cheap)

Agathocles at his drinking parties gave "men licence to speak against him in their cups", and so "used to discover exactly the opinion of each". Later "he invited them individually on another occasion to a banquet… in number about five hundred; and surrounding them with suitable men from his mercenaries he slaughtered them all" (Diodorus 20.63.1, 20.63.6). His own jokes are good flavor too:

- With a gold cup in hand, he said he had not given up potting until he could make beakers like it (20.63.4).
- To the men on a wall who shouted "Potter and furnace-man, when will you pay your soldiers?", he answered "when I have taken this city" (20.63.5).
- **Attested:** Good.
- **Hook:** for the dinners switch, a way to mix the wine: "Let them speak freely". You learn grudges at the table, but anyone who spoke and later sees a friend punished knows why. The second dinner is the Agathocles campaign's signature atrocity, and it should stay the player's choice, never an event that happens to them.

### 21. The uncle who spoils the heir (rival behaviour; medium)

The Deinomenid tyranny fell "when Thrasybulus the brother of Hiero paid court to the son of Gelo and urged him into indulgences in order that he himself might rule" (Aristotle, *Politics* 5.1312b).

- **Attested:** Strong.
- **Hook:** for the heir campaign and successions. A rival in your own family courts your heir with pleasures. The heir's standing falls and the uncle's rises. You see it happen ("your brother keeps your son at table").

### 22. A love quarrel that splits the city (event; cheap)

"At Syracuse in ancient times… the constitution underwent a revolution as a result of a quarrel that arose between two young men, who belonged to the ruling class, about a love affair". Each stole the other's beloved, and "they stirred up a party struggle among all the people in the state" (Aristotle, *Politics* 5.1303b).

- **Attested:** Strong, though the date is unknown and before 480.
- **Hook:** an event between two of the generated cast. A private wrong between two great houses splits a faction into two blocs unless you make peace between them. It fits Jacob's taste for stories that start small.

### 23. The grain tithe sold at auction (rule for grain; medium, Hieron II)

Under Hieron II the tenth of the grain crop was farmed out by auction each year, and Rome kept the system. The Senate "resolved that the farming of the tenth should always be put up to auction according to the law of Hiero" (Cicero, *Against Verres* 2.3.15, `sources/sicily-tyrants/cicero-verres-2-3.yonge.txt`).

- **Attested:** Good. It is a Roman speech about an older Syracusan law, from about 270 to 215 BC, so it is outside 405 to 395.
- **Hook:** a 289-or-later start, or a switch for `convoys`. The grain contractors there are invention, and this is the attested shape for them: a yearly auction where the rich families bid for the tithe. A greedy contractor angers the farmers, and you take the blame. This partly answers the open source request in `docs/later.md` (who ran the grain trade), though for a later reign.
- **Archimedes and the crown.** From the same reign: Hieron's votive gold crown, where the goldsmith was suspected of mixing in silver (Vitruvius 9.pref.9-10, `sources/sicily-tyrants/vitruvius-9-pref-9-12-and-1-1-17.gwilt.txt`). An audit event: hire a clever man to prove the theft. The date is uncertain.

### 24. Omens made to order (action before battle; cheap)

- **The owls.** Agathocles "let loose into the army in many places owls, which he had long since prepared". The birds "settling on the shields and helmets, encouraged the soldiers… because the bird is held sacred to Athena" (Diodorus 20.11.3-4).
- **The burnt ships.** His burning of the ships was announced as a vow "to Demeter and Corê, the goddesses who protected Sicily" (20.7.2). The ship-burning itself is already drafted for his campaign.
- **Attested:** Good.
- **Hook:** an action before a field battle, "Arrange an omen". It costs silver, and the army's mood rises if the trick isn't seen through.

### 25. Flavor lines (chronicle only; cheap)

- **The herald's prayer.** At a palace sacrifice, "when the herald, as was the custom, prayed that the tyranny might abide unshaken for many generations, it is said that Dionysius… cried: Stop cursing us!" (Plutarch, *Dion* 13). The same chapter says the palace "was filled with dust… owing to the multitude of geometricians there" during Plato's visit.
- **Fallen tyrants.** Dionysius II "arrived shortly after in Corinth in a small tub of a freighter" (Diodorus 16.70.3), and "assumed the profession of a schoolmaster, and taught children in the open streets" (Justin 21.5, read online). These could be exile-switch lines for a fallen ruler.
- **The year named by a priest.** After Timoleon, Syracuse named each year by the "amphipoly" of Zeus Olympius, an annual priesthood (Diodorus 16.70.6). The chronicle of a free-city start could name its years this way.
- **Free speech.** When two men prosecuted Timoleon, he "would not suffer the citizens to stop the man", saying he had prayed "that he might live to see the Syracusans gain the right of free speech" (Plutarch, *Timoleon* 37.1-2, read online).
- **Euripides in the quarries.** Some Athenian prisoners of 413 "were saved for the sake of Euripides", because Sicilians loved his verses (Plutarch, *Nicias* 29, `sources/plutarch/nicias.perrin.txt`). This is a quarries line for any reign.
- **Hamilcar at Himera.** In 480, "when he saw his army routed, he cast himself into the fire where he was pouring libations on the sacrifice" (Herodotus 7.167, `sources/sicily-tyrants/herodotus-7-153-167.godley.txt`). This is for the Carthage chronicle in a 480 start.
- **Garrisoning a town with new marriages.** Polyaenus says Dionysius held a half-empty captured town by marrying "the captive slaves to the daughters of their masters", making the new men loyal to him alone (5.2.20). It is anecdote and harsh. Listed for completeness, and Jacob's call whether it belongs.

## Already in the game (skipped)

- The Damocles banquet.
- The barber and the singed beard.
- The bed behind a trench.
- The borrowed spear.
- The captain's dream.
- The musicians' reports.
- A false report of your death.
- The man with the secret of conspiracies.
- The old soldiers' pay.
- Demeter's ornaments, the tin coins, the Asclepius offerings and light coins.
- Philoxenus and the quarries.
- Damon and Phintias.
- The ball-game joke.
- New citizens and land.
- The Epipolae wall and the arms workshops.
- The double wedding.
- The Hundred auditing a general, and crucifixion.
- Greeks who fought for Carthage.
- Taking families as hostages (as an event choice).
- Disarming the citizens.
- The bodyguard.
- Carthage's mourning.
- The tower speech.
- Hermocrates and the bones.
- Burning the ships, and Agathocles' oath (drafted in `docs/full-game.md`).
- Liberators from abroad (drafted).
- Petalism (thread 32).

## Not used, or unchecked

- **Diodorus 15.7** (the second Olympic disgrace and the purge that followed) is not saved in English, so it was not opened.
- **Gelon's treaty** said to ban human sacrifice at Carthage is a later tradition. It is not in the saved texts and was not checked.
- **Plutarch's *Timoleon* and Justin books 19 to 21** were read online only. Their quotes should be checked against a saved copy before any becomes a `kind: history` record.
