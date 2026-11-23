# Phase 3, "The Long Game": a paper draft

**Status: draft, paper only.** Written by thread 25 on 2026-11-23 as bet B8 of `docs/council/2026-11-23-two-day-plan.md`. Nothing here is built or in scope. Phase 3 starts only when the Phase 2 gate in `docs/scope.md` is passed and Jacob says go. Every rule and number below is **invention** and Jacob's to change; every fact is **history** with its quote, checked against the saved texts in the Phoenician-Punic World repo (read-only). The start-date dossiers are in `docs/research/start-*.md`.

The open questions at the end are Jacob's. Where this draft picks one answer, it says so and gives the alternative.

## The idea in one paragraph

Phase 2 is one decade, one ruler and eight cities. Phase 3 is the whole span from Himera (480) to Rome crossing to Messana (264): about 216 years, about 25 cities, and the people who are born, marry, inherit and die in them. You still play one person. When that person dies you go on as someone they leave behind: a son, a daughter's husband, a freedman, the captain they trusted. The world does not wait for you: tyrants rise and fall without you, hired men seize towns, Carthage's council sends armies or keeps the peace. Nothing in the span is scripted. A start date is not a story to replay but a **set of conditions** (who holds what, who hates whom, who is owed money), and the engine is trusted to make history from them. The test of the phase is the same as Phase 2's, stretched: does a life of play make a story worth retelling, and does the *next* life feel different?

## Why it should work: the sources already read like an engine

Three patterns in the saved texts repeat across the whole span, and each one is a rule the Phase 2 engine half has already. Phase 3's job is to let them run long enough to repeat.

1. **Hired men made citizens come back to bite.** Gelon "had enrolled as citizens more than ten thousand foreign mercenaries" (Diodorus 11.72.3). After the tyranny fell they were barred from office, "resented their being excluded" and "seized in the city both Achradinê and the Island" (11.73.1). Eighty years later Dionysius I paid about ten thousand mercenaries "in lieu of their pay the city and territory of the Leontines" (14.78.2). Later still, "Campanian mercenaries of Agathocles" took Messana by treachery (Polybius 1.7) and called themselves Mamertines (1.8). The same move (pay soldiers in land and votes), three generations, three outcomes.
2. **The heir inherits a claim, not the power.** Dionysius the younger asked the assembly "to maintain toward him the loyalty that passed to him with the heritage that he had received from his father" (Diodorus 15.74.5). Hieron, Gelon's brother, saw his own brother Polyzelus as a rival "waiting to seize the kingship" (11.48.3). Agathocles named his son heir, and his grandson Archagathus, who held the army, "resolved to lay a plot for both men" (21.16.3). Who holds the six objects on the day of the funeral decides more than who was named.
3. **Liberators arrive from outside when the city asks.** Corinth sent Timoleon, "chosen by his fellow-citizens to command in Syracuse", with "seven hundred mercenaries" (16.66.1 to 16.66.2). Dion, "son of Hipparinus", "set free the Syracusans" (16.6.1). A rescuer is a person with a ship and a small company, not a scripted event.

So the long game is mostly *time* added to rules that exist: the census (births, marriages, deaths, heirs, already in `src/core/census.ts`), the six power objects, the faction bots, the island map, Carthage's council. The new systems are few: succession, a playable person who can change, a mercenary market, a map that changes over centuries, and a way to move through 864 seasons without boredom.

## 1. Time: two speeds

216 years at four seasons a year is 864 seasons. Phase 2's season, with its three orders and full feed, is too slow to play all of them, and a world that skips its seasons is not a world. The draft has **two speeds**, and you switch between them.

- **The court (close).** Exactly the Phase 2 season: three orders, the council, plots and the sword check. This is the default when something is happening to you: a plot has a warning out, an army is within a season's march, an heir is not yet settled, an envoy waits.
- **The long years (far).** One turn is one year. You give one standing order for the year ("keep the peace", "build", "court the rich", "save silver", "train an heir") and the engine runs the four seasons with you as a bot playing that order. The chronicle gives the year a paragraph.
- **The world pulls you close.** The far speed stops itself and drops you into the court when a defined trigger fires: a warning about you, a death in your house, an army on your land, a company unpaid for two seasons, an offer from Carthage. The list of triggers is data (`data/long-years.json`), each with a plain reason ("Your guard has not been paid since spring").

*Why not just faster seasons?* Because Jacob disliked play that felt unearned in the paper test, and the far speed is a defined order with defined results, not a skip. *Alternative:* fixed eras (play ten years close, then the engine runs twenty far on its own). The draft prefers your choice of speed with the world's triggers, because it keeps you in charge of pace.

## 2. Generations: playing a house, not a man

### What carries over when you die

You do not inherit power. You inherit **a claim, a name and a ledger**.

- **The claim.** Your named heir starts with legitimacy (a new number, 0 to 10): the "loyalty that passed to him with the heritage" (15.74.5). It decays each season unless he holds an object, wins something, or the assembly confirms him.
- **The name.** Your house keeps a reputation that the factions read: "the house of the tyrant", "the liberators", "the hired men's friends". It is earned by deeds in the log, not chosen.
- **The ledger.** Debts, promises, grudges and secrets pass to the heir. A man you executed has sons; the census already makes them. A grudge has a reason and the reason is inherited ("his father was killed in the quarries by yours"). This is the nemesis Jacob asked for in the paper test, across generations: a rival who is the son of a rival.
- **Not carried over:** offices. The six objects stay with whoever physically holds them on the day you die. If your guard captain holds the citadel, the citadel is his until someone takes it.

### The funeral: a defined step

When the ruler dies, the next season opens with **the funeral**, a fixed step between "people" and "factions" in that season only.
1. The heir is named (your will, if you made one; otherwise the eldest son, otherwise the factions argue).
2. Each holder of an object chooses, by his priority list, to hand it to the heir, keep it, or sell it to another claimant. Every choice shows its reason ("The captain keeps the citadel: he was never paid for the Leontini campaign").
3. The assembly may be called to confirm the heir, as Dionysius the younger did (15.74.5).
4. If two claimants each hold objects, that is a **split house**, and the plot and rival systems run on it as they do now.

### Choosing whom you play next

When you die, you choose among **your circle**: your heir, any adult child, a son-in-law, a sworn friend, the captain of a company you paid well, a freedman you raised. Each choice shows what they start with (objects, silver, legitimacy, enemies). Choosing someone other than the heir is allowed and is a story: you may now play *against* your own son. If your circle is empty, the game offers the three most influential people in Syracuse who did not hate you. If none, the reign ends and the chronicle closes the house; you may start a new life anywhere on the island (see section 3).

### Raising an heir

A child needs years. The far speed's "train an heir" order is how. A trained heir gets one trait from the tutor you chose (a soldier, a philosopher from Greece, a merchant), each with a defined effect. *Story hook, history:* Dion and Plato's visits to Dionysius the younger are in Plato's *Letter* 7 and Plutarch's *Dion* (see `docs/research/start-357.md`); a philosopher-tutor can go wrong.

## 3. Who you can be: stations

Phase 2 gives one playable person. Phase 3 lets you play anyone in the census, and what you can do depends on your **station**, not on a scripted role. The action menu is filtered by station, so each feels different while sharing one engine.

| Station | You hold | Your main actions (new ones marked) | How you climb |
|---|---|---|---|
| **Ruler** | one or more of the six objects | the Phase 2 menu | keep them |
| **Leading man** (rich house) | silver, land, kin, a seat in council | lend, marry off, fund a faction, back a plot, stand for general | take an office in the assembly |
| **Demagogue** | the crowd's favour | speak in the assembly, accuse, call for land or debt laws (new), lead a riot (new) | be voted general with full powers |
| **Captain** | a company of hired men | sell your company to a bidder (new), demand arrears (new), seize a town (new) | hold a town, then a city |
| **Exile** | friends abroad, a grudge | raise a company abroad, write to the discontented, ask a mother city for help (new), land (new) | return and take an object |
| **Ruler of another city** | that city's objects | the ruler's menu, smaller | swallow a neighbour, or ally with Syracuse or Carthage |

*History behind the stations:* the demagogue (Dionysius I "from a scribe and ordinary private citizen" to tyrant, Diodorus 13.96.4, carded in `docs/research/dionysius-405-403.md`); the captain (the Campanians at Entella "possessed themselves of the city", 14.9.9); the exile (Dion, 16.6.1). Agathocles as a climber is in `docs/research/start-317.md`.

**Out, still:** playing as Carthage. Carthage stays simulated. A Carthaginian-born person in Sicily (a Motya merchant, say) could be a leading man of a Punic city, but that is a later question (open questions).

## 4. The mercenary market

The design note in `docs/design.md` asks for companies from Campania, Iberia, Gaul, the Balearics and Greece, with contracts, prices that rise with demand, arrears, and pay in land. The draft makes it a **Republic of Rome style auction**, because Jacob likes power held as objects, and a hired company is exactly that: an object anyone with silver can pick up, and that can walk away.

### Companies as objects

Each company is a card in `data/companies.json` with: an origin, a size (in the game's strength points), a **captain** (a census person with traits and ambition), a price, loyalty to its payer, and two money counters taken from how pay actually worked:
- **Upkeep**, paid every season (food and keep). Unpaid upkeep costs loyalty fast and makes the company forage your own land.
- **Wages owed**, which pile up and fall due at discharge. Devereaux, summarising Polybius: most pay, "their misthos (wages) as distinct from their sitos/sitonion/sitometria (maintenance pay) – seems to have been due at discharge, at the end of a campaign" (ACOUP, "Raising Carthaginian Armies" part 2, `sources/acoup/raising-carthaginian-armies-2.devereaux.md`). That is the trap: a long war costs little until it ends, then the bill arrives all at once, which is what Devereaux says broke Carthage after the First Punic War.

### The spring market

Each spring, the market step (part of "world") deals companies into the open market. How many, and from where, depends on the world: a war in Greece floods it with Greek hoplites; Carthage's recruiters in Europe drain it ("members of the senate with large sums of money to recruit mercenaries in Europe", Diodorus 14.47.3, in `docs/research/island-405-395.md`).

Bidders take turns: you, every faction that has silver, other cities' rulers, Carthage, and exiles abroad. Each bot bids by its priority list ("the rich families bid for a guard because the grain law frightens them"). The price of the next company rises with each sale that spring. The rule that prices climb under demand has a direct source: in Greece Philomelus raised "the base pay for the mercenaries at half as much again as was usual" and "quickly assembled a large number" (Diodorus 16.30, `sources/diodorus/english/book16-21-35.loeb.txt`).

### Ways to pay, and what each costs later

- **Silver.** Clean, if you have it.
- **Land.** A company can take a town's land as its pay: "the city and territory of the Leontines" (14.78.2), which they "portioned out in allotments" (14.78.3). The town's people lose it, and the company settles: it becomes a new body in the census, with wives, sons and a grudge if it is ever asked to leave.
- **Citizenship.** A company can be made citizens of your city. It joins the guard faction as voters. Fifty years later their grandsons are a faction of their own, barred or not from office by whoever then rules, as in 466 (11.72.3 to 11.73.1). This is the long game's signature: a choice that pays out after you are dead.
- **Promises.** Wages owed can be promised against a future sack. The company remembers.

### What an unpaid company does

A fixed escalation, shown on the company's card: grumbling, then a demand ("demanded their pay with some sharpness", 14.78.2), then foraging your land, then going over to the highest bidder, then **seizing a town**. When a company seizes a town, the town changes hands and the company's captain becomes its ruler. This is how the Mamertine state can appear by itself: Campanians "entered the town under guise of friendship" and "drove out some of the citizens and put others to the sword" (Polybius 1.7). The game never scripts Messana's fall; it can happen to any town near an idle, unpaid company. And a seizure is catching: "The speed with which they became masters of a fair territory and city found ready imitators of their conduct" (Polybius 1.7). So each seizure on the island makes the next one likelier for every idle company that hears of it. The fullest market facts are in `docs/research/start-289.md`.

## 5. The rest of the island, and a map that changes

About 25 places, up from 8. The new ones (parked in `docs/later.md`): Selinus, Himera, Camarina, Naxos, Enna and the Sikel towns, Segesta and Eryx, plus Tauromenium and Lilybaeum, which do not exist at every start.

- **Cities are founded and destroyed by rules, not dates.** Lilybaeum was "founded by the Carthaginians after their city of Motya had been captured by the tyrant Dionysius" (Diodorus 22.10.4). Tauromenium was settled by the men "who had survived the razing of Naxos by Dionysius" on the hill "called Tauros" (16.7.1). So the rule is: when a city is razed, its survivors may found a new town at a defined site nearby, after some years. Hieron's refounding of Catana as Aetna with "ten thousand settlers" (11.49.1) is the same rule run by a ruler: you can found a city with settlers, renaming it, and the settlers are yours.
- **Each place has an era of being**: a list of the conditions under which it can exist (Motya until taken; Lilybaeum after Motya is taken; Tauromenium after Naxos is razed). A start position lists which places exist at that date.
- **Ruled by other tyrants.** At 480 the island has several tyrants (Theron at Acragas, Anaxilas at Rhegium across the strait); at 289 it has Phintias at Acragas and the Mamertines at Messana. Each other ruler is a census person running the ruler's menu, smaller, by priority list. They can be your ally, your father-in-law, or your killer.
- **Italy and Greece stay names with a few levers**: Rhegium, Locri, Corinth, Sparta, Epirus. Each is a small outside power with a mood and a short menu (send a liberator, send a bride, lend a company, refuse). Rome is a name until the end (section 7).

## 6. Start dates: seeds of a period

A start is a data file (`data/starts/<year>.json`) and a research card (`docs/research/start-<year>.md`). It sets conditions only: who holds the six objects, faction power and moods, each place's side, Carthage's posture, the market, and a cast of about 15 named people (real first, invented where the texts run out), plus the census made around them. After the first season nothing about the start is enforced.

The five dossiers this draft proposes (each a research card with its quotes):

| Start | What you find | Default player | Why it is a good seed |
|---|---|---|---|
| **480, after Himera** | Gelon holds everything; Carthage beaten and paying; mercenaries made citizens | Gelon, or his brother | Can the founder's house survive its own success? |
| **466, the tyrants fall** | a new democracy; seven thousand new citizens barred from office and holding Ortygia | a leader of the free city | The bill for Gelon's citizens falls due |
| **357, Dion's return** | the tyrant abroad, his garrison in the citadel, a liberator landing with a small company | Dion | A liberator with hired men and a people who want land |
| **317, Agathocles' coup** | the oligarchs massacred; a general with full powers; exiles at Acragas | Agathocles | A climber with no right to rule but the army |
| **289, after Agathocles** | the king dead, "self-government" restored, Campanian companies unpaid | a leading man of Syracuse | The market's bill: who takes Messana? |

The 405 start of Phases 1 and 2 stays as the sixth, and the best tested.

*Historical people appear only when their conditions hold.* A real person in a start is placed at the start. A real person born *after* the start (Agathocles, say, in a 357 game) is not forced to appear; the census may instead make an invented man in the same station ("a soldier's son with an army's love") if the conditions that made the real one exist. This is the design note's "Historical figures appear only when the conditions that produced them exist", kept honest: the invented man is tagged invention and the chronicle never gives him the real man's name.

## 7. How the long game ends

- **Your houses' story ends** when your last chosen person dies with an empty circle, or you stop. The chronicle closes with what the house held, how long, and how it fell.
- **The world's story ends at 264**, when the engine reaches the year Rome crosses to Messana, or earlier if no Greek city in Sicily is free. The draft does not simulate Rome. In the last year, the chronicle names who holds Messana and who called whom, because Polybius' account starts from the Mamertines' embassy to Rome (1.10). If your history has no Mamertines, it says so: the story of 264 needs a reason in your world, not in ours.
- **No score**, as in Phase 2. The design council's "ambition chosen at the start, judged by the chronicle" (parked in `later.md`) fits here best: one ambition per life, judged at its end.

## 8. Testing it

The CLAUDE.md rule holds: count, look for broken results, do not tune to history.
- **A 216-year headless run per seed**, 100 seeds. Count: tyrannies (and how long), democracies, mercenary seizures, cities founded and destroyed, Carthaginian wars, houses that last three generations, years with no ruler. Broken results are the ones in CLAUDE.md, stretched: a tyrant every year, none in two centuries, the same family forever, an island emptied.
- **The sameness check.** Two seeds from the same start should diverge by 50 years. The test: compare who holds Syracuse in years 30, 60 and 90 across 20 seeds. If one house holds it in most, the world is on rails.
- **The story test, per life.** Read three lives (close speed for the dramatic parts, far for the rest) and ask Phase 2's question: would Jacob retell it?
- **Performance.** A census over 216 years is thousands of dead people. The dead move to an archive (still readable by the chronicle and the Phase 4 browser) so each season only touches the living. Save files hold the archive compressed.

## 9. Build order, if Jacob says go

Each slice ends playable, with checks passing.
1. **The funeral and the circle.** Death of the ruler, heirs, legitimacy, choosing whom you play next. In the existing 405 start, run past 395. *Smallest test of the phase:* does the second life feel different from the first?
2. **The two speeds.** Far speed with standing orders and triggers.
3. **The market.** Companies, the spring auction, upkeep and wages owed, pay in land and citizenship, seizures.
4. **Stations.** The demagogue, captain and exile menus.
5. **The island grows.** About 25 places, eras of being, other cities' rulers.
6. **The other starts.** One at a time, each with its card checked, 289 first (it tests the market) or 357 (it tests the exile).
7. **The 216-year sweep and the ending.**

Cost note: slices 1 to 3 are heavy engine work (about the size of Phase 2's slices 1 and 2 together); 4 and 5 are medium; each start is medium research plus light data.

## Risks

- **Content cost.** Five starts at about 15 people each is 75 sourced people, plus the cities. The dossiers show the saved texts can carry it, thinly in places (see each card's "Not found").
- **The far speed becomes the game.** If the close speed is rarely needed, the triggers are too few. The test above counts how often you are pulled close.
- **Sameness over two centuries.** The engine has a few patterns; repeated for 216 years they could read as one story told six times. Variation comes from the census (new people, new grudges), the map's eras and the market's supply, not from more events.
- **History as conditions might fail.** If no seed ever produces anything like a Mamertine Messana or a Timoleon, that is not a bug to tune away; it is a finding to report.

## Open questions for Jacob

1. **Pace.** Two speeds you choose, with the world pulling you close (the draft's pick), or fixed eras that alternate on their own?
2. **Who you play next.** Anyone in your circle, even against your own heir (the draft's pick), or only the heir, as in CK3's default?
3. **Real people born after the start.** Let the census make an invented man in the same station (the draft's pick), or bring the real person in when his conditions hold, or never?
4. **The end.** Stop at 264 with a closing chronicle (the draft's pick), or let the world run on with Rome as a name?
5. **Punic Sicily.** Should a person in a Carthaginian city of Sicily ever be playable (not Carthage itself, which stays out)?
6. **Which start to build first** after 405: 289 (tests the market), 357 (tests the exile and the liberator), or 466 (tests a democracy without a tyrant)?
7. **Is the auction right?** A Republic of Rome style spring auction, or a quieter market where companies simply have prices?
