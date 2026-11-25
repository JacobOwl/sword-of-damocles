# The whole game: every system, your own history, and the tyrant campaigns

**Status: design only, nothing built, nothing moved into scope.** Written by thread 30 on 2026-11-25 at Jacob's request. `docs/scope.md` still rules what gets built now (Phase 2), and it changes only by a logged decision. Every rule, number and name of a mode below is **invention** and Jacob's to change. Every fact is **history**, with its quote, in the research cards named beside it; the new facts for this doc are in `docs/research/tyrant-campaigns.md`.

What Jacob asked, in his words (2026-11-25): "I want this as the full scope of the game, not just like my little test slice, but as anything as possible. I want the full, all the mechanics, all the vision. And then as a side note, I think it would be interesting to have maybe there's an option for a playthrough where you kind of do your own history of Syracuse, but then also maybe specific campaigns where you play as the different tyrants, and then each one has their own unique challenges and starting situations."

So this doc has three jobs:
1. Put the **whole game** on one page: every system, from what is already playable to the last phase, with where each stands (part 1 and 2).
2. Design **"Your own Syracuse"**, the open playthrough (part 3).
3. Design **six tyrant campaigns**, one per great tyrant of Syracuse, each with its own start, challenge and signature rule (part 4).

Parts 5 to 7 say how it fits the phases and the engine, what to build in what order, and what only Jacob can decide. Where this doc picks an answer, it says so and gives the other choice.

---

## Part 1. The whole game in one page

**The Sword of Damocles is a game about holding power in Syracuse, from Himera (480) to Rome's crossing to Messana (264).** You play one person, never a state. The island lives without you: families plot, hired men go unpaid and seize towns, Carthage's council votes for war or peace, and every season writes a line of history. You do not win by conquering Sicily. You win by lasting, by building something that outlives you, and by what the chronicle says when you fall. The sword over your head is the plot you can see coming if you look.

Three things make it this game and not another:
- **Power is held as objects.** The citadel, the treasury, the mint, the fleet, the generalship and the assembly are things people hold, and the government is whoever holds them. A tyranny is one man with the citadel, the army and the money; a democracy is the assembly holding the offices. Nobody picks a government from a menu.
- **Everyone acts for a reason you can read.** Each faction and person works down a visible list of priorities, with a goal and a mood ("the rich families fear the grain law"). A death never comes from nowhere: warnings always come first.
- **Every game is a history.** The log of every act, with its reason, becomes a chronicle, a gallery of lives and, later, two biased ancient historians telling your reign their way.

There are two ways to play the full game:
- **Your own Syracuse**: pick a moment and a person, and let history go where it goes. Generations, any station, the whole 216 years if you want them.
- **The tyrant campaigns**: six set starts, each one great tyrant at the moment his story turns, with a charge to meet and one rule that makes his reign unlike the others.

Both run on one engine, the same rules and the same data. A campaign is a start plus a charge, never a script.

---

## Part 2. Every system, and where it stands

Status words: **Playable** (in the test game now), **Switch** (built, off by default, on the Workshop page), **Drafted** (designed on paper in a named doc), **New here** (first proposed in this doc), **Later** (named in `design.md` or `later.md`, not designed yet). The phase is where it would be built if Jacob says go.

### The world

| System | What it does | Status | Phase |
|---|---|---|---|
| Seasons in fixed steps | world, people, factions, player, power, sword check, chronicle | Playable | 1 |
| The island map | 8 cities and Aetna, roads and sea lanes, each city's side, walls, grain and lean | Playable | 2 |
| The whole island | about 25 places (Selinus, Himera, Camarina, Naxos, Enna, the Sikel towns, Segesta, Eryx, Tauromenium, Lilybaeum) | Drafted (`phase3-draft.md` s.5) | 3 |
| Cities born and razed by rules | a razed city's people may found a new town; a ruler can found a city with settlers and rename it (Aetna from Catana, `tyrant-campaigns.md` s.2) | Drafted | 3 |
| Moving a town's people | a ruler can move a beaten town into his own city: its rich become citizens, its poor can be sold (Gelon, Herodotus 7.156.2) | New here | 3 |
| Grain and the sea | bought grain sails home, can be skimmed or lost | Switch | 2 |
| Seasons of plague and hunger in sieges | walls, hunger and plague wear down a besieged city | Playable | 2 |
| The city map of Syracuse | Ortygia, Achradina, Tyche, Neapolis, Epipolae and the harbours as places that can be held separately (Thrasybulus held "Achradinê ... and the Island", Diodorus 11.67.8) | Later (`design.md` system 7) | 3 or 4 |
| A second front abroad | a small map of another land (Carthage's farmland in Libya, south Italy) that a ruler with ships can carry a war to | New here | 3 |
| Italy and Greece as levers | Rhegium, Locri, Corinth, Sparta, Epirus: small outside powers with a mood and a short menu (send a liberator, a bride, a company, refuse) | Drafted (s.5) | 3 |
| Rome at the end | Rome as an outside power that can be called in, only in the last decades | New here (the draft keeps Rome a name) | 3 |

### People

| System | What it does | Status | Phase |
|---|---|---|---|
| The cast | about 25 people with traits, ambitions, money, ties and grudges, each grudge with its reason | Playable | 1 |
| The census | invented families around the cast: births, marriages, deaths | Playable | 2 |
| Rivals and nemeses | an enemy who survives you rises a rank; a feud record that never resets | Playable / Switch | 1 to 2 |
| People escalate | a refused man comes back with a public demand, then a grudge | Switch | 1 |
| Dinners | the table as a stage: who sits where, what the wine loosens | Switch | 2 |
| Secrets and the council | your councillors speak, keep secrets and sell them | Playable / Switch | 2 |
| Generations | the funeral as a step; heirs inherit a claim, a name and a ledger, never the offices | Drafted (s.2) | 3 |
| Choosing whom you play next | anyone in your circle, even against your own heir | Drafted (s.2) | 3 |
| Stations | play a ruler, a leading man, a demagogue, a captain, an exile, or the ruler of another city; each has its own menu | Drafted (s.3) | 3 |
| Tutors and training an heir | the tutor you choose gives the child a trait; a philosopher can go wrong (Plato at the younger Dionysius' court, Letter 7.328) | Drafted (s.2) | 3 |

### Power and danger

| System | What it does | Status | Phase |
|---|---|---|---|
| The six power objects | citadel, treasury, mint, fleet, generalship, assembly; government comes out of who holds them | Playable | 1 |
| The four factions in Syracuse | common citizens, rich families, mercenary guard, ruler's family, each with power that rises and falls | Playable | 1 |
| Plots and the sword check | plots ripen; warnings come before the blow; the blow is weighed against your guard and spies | Playable | 1 |
| Warnings are clues; blows can miss | each warning comes from a real act; a narrow blow wounds or costs an office | Switch | 1 |
| Laws and offices | grain laws, land laws, offices you grant or refuse | Playable | 1 |
| Oaths and vows as objects | a sworn oath is a thing in play; breaking it costs you with the gods, the exiles and the crowd (Agathocles' oath, Diodorus 19.5.4, `start-317.md`; his vow to burn the ships, 20.7.2) | New here (start-317 card suggests it) | 3 |
| Legitimacy | a number for the heir's claim that fades unless he holds, wins, or is confirmed | Drafted (s.2) | 3 |
| Exile and return | lose Syracuse and plot your way back from Aetna or Rhegium | Switch ("Fallen, not finished") | 2 |
| Liberators from abroad | a mother city sends a man with a ship and a small company when the city asks (Timoleon, Dion) | Drafted (s.0) | 3 |

### War and money

| System | What it does | Status | Phase |
|---|---|---|---|
| Armies with supply | men, months of food, a commander; march, forage, besiege, fight with every modifier shown | Playable | 2 |
| The commission | lead the army yourself, or send a named man; leave a keeper of the citadel | Switch | 2 |
| A simulated Carthage | a council of blocs with moods, its own people and stores, voting war and peace | Playable | 2 |
| Carthage's chronicle | the decade told from Carthage's side | Switch | 2 |
| The mercenary market | companies as objects bought at a spring auction; upkeep each season, wages due at discharge; pay in silver, land, citizenship or promises; unpaid companies seize towns, and seizures are catching | Drafted (s.4) | 3 |
| War at sea | fleets as more than one interception roll: battles, blockades, and running a blockade (Agathocles, Diodorus 20.5.2 to 20.5.4) | Later (cut from Phase 2) | 3 |
| Great works | walls, forts and temples that take seasons, cost silver and change the city | Switch | 2 |
| Tribute and treaties | a beaten side pays; a treaty is an object with terms that can be broken | Partly playable (Carthage's peace) | 2 to 3 |
| Prestige abroad | games victories, poets, offerings at Olympia and Delphi as a way to buy fame (Hieron and his poets, `start-466.md`) | New here | 3 |

### Story and the player's view

| System | What it does | Status | Phase |
|---|---|---|---|
| The chronicle | read from the log; storyline chronicle as a switch; years named as Diodorus names them | Playable / Switch | 1 to 2 |
| Change the past | replay a game with one choice changed and see what followed | Switch | 2 |
| Story museum | many games read for the shapes of stories they make | Built (tool) | 2 |
| Two speeds | the court (close, one season a turn) and the long years (far, one year a turn, one standing order); the world pulls you close when something happens to you | Drafted (s.1) | 3 |
| Ambition, judged at the end | one ambition per life, judged by the chronicle's last page, no score | Later (design council, `later.md`) | 3 |
| Legends browser | a page for every person, city and war, Dwarf Fortress style | Later | 4 |
| Biased historians | Philistus (close to Dionysius) and Timaeus (who hated tyrants) as rule sets that keep, drop or colour each kind of line | Later (paper sample in `playtests/2026-11-23-voices.md`) | 4 |
| "What the sources say" | at the end, the real history beside yours, with its quotes and the places the sources disagree | Later (assumptions council) | 4 |
| Coin-mosaic portraits | portraits laid from real coin photographs | Later | 4 |
| The board game | the power-object system for Tabletop Simulator | Later | 5 (optional) |

---

## Part 3. Your own Syracuse (the open playthrough)

This is the Phase 3 long game of `docs/phase3-draft.md` given a front door. Nothing in it is scripted after the first season.

### Setting up

1. **Pick a moment.** One of the start dates (480, 466, 405, 357, 317, 289, plus the campaign starts in part 4), each a set of conditions: who holds the six objects, faction moods, which cities exist and whose side they are on, Carthage's posture, the market, about 15 named people. *Draft's pick:* only the researched dates. *Other choice:* any year, with the engine running from the nearest start date to that year before you join (slower to start, and the world you join is already your own).
2. **Pick a person.** Any station the start offers (ruler, leading man, demagogue, captain, exile, ruler of another city), real or invented. Each choice shows what you hold, whom you owe and who hates you.
3. **Pick how true the world starts.** *New here:* three settings, Jacob's to keep or cut.
   - **As it was:** the real cast and the real conditions. The most history, the least surprise at the start.
   - **Same island, new people:** the real conditions, but the cast made by the census (all tagged invention, never given a real man's name). For a second life at the same date.
   - **A different Sicily:** the conditions shaken a little within ranges (a city's lean, a faction's mood, Carthage's stores). Never beyond what the start card allows as plausible.
4. **Pick an ambition** (optional). One sentence the chronicle will judge you by at the end: "Found a house that rules for three generations", "Free Syracuse and die a private man", "Drive Carthage from the island". A list in data, each with how it is judged.
5. **Pick the switches** you want, as now.

### Playing

- Two speeds, as drafted: the court for when things happen to you, the long years for the rest.
- When you die, you go on as someone in your circle. When your house ends, you can start a new life anywhere on the island in the same world, or stop.
- The world ends in 264, when Rome crosses to Messana, or earlier if no Greek city in Sicily is free.

### What you get at the end

The chronicle of your Syracuse, every life you played, a page for every house that held the citadel, and (Phase 4) the sources' version beside yours: "In your history Messana was never taken by hired men. In ours, Campanians 'entered the town under guise of friendship' (Polybius 1.7)."

---

## Part 4. The tyrant campaigns

### What a campaign is

A campaign is four pieces of data, and no new kind of code:

1. **A start**: the same kind of start file as the open game, set at the moment the tyrant's story turns.
2. **A charge**: what the campaign asks of you, in three marks the chronicle judges at the end (see below).
3. **A signature rule**: one rule that makes this reign unlike the others. Every signature rule is a **general rule** that the open game can use too, behind a switch, off by default until Jacob picks. Nothing exists only for one campaign. That keeps the engine honest and means each campaign builds the open game as it goes.
4. **An epilogue**: when the campaign ends, the engine runs on a few years with you watching, and the chronicle tells what happened to what you built.

**No scripts.** The real history is not forced. Himera does not have to happen in 480; Polyzelus does not have to flee. The start puts the pressures in place that made those things likely, and the engine is trusted. A campaign where it goes differently is a good campaign, and the end page shows the difference.

### How a campaign is judged

*New here, Jacob's to change.* Three marks, each given in words, never a score:

- **Held**: did you keep power to the campaign's end date, or how long did you last?
- **The charge**: did you meet the campaign's own challenge (below)?
- **The legacy**: what did the epilogue show: did your house, your city, your settlers or your laws outlive you?

The chronicle names the reign from the three ("The founder whose city outlived him", "The heir who lost everything in a year"). A fall ends the campaign unless the exile switch is on, as now; with it, the campaign can go on from exile and the marks are judged on how you came back.

*Other choice:* one plain verdict (held or fell) and no marks. The draft prefers marks because each campaign's story is more than survival.

### The six campaigns at a glance

| # | Campaign | You play | Starts | Ends | The challenge in one line |
|---|---|---|---|---|---|
| 1 | **The cavalry captain** | Gelon | about 491 (Gela) | his death (about 478), or 470 | Take two cities, then make one great one, before Carthage comes |
| 2 | **The founder** | Hieron I | Gelon's death (about 478) | his death (about 467) | Hold your dead brother's city against your living one, and found a city of your own |
| 3 | **The sword** | Dionysius I | 405 | 367 | Rise from a clerk to master of Sicily, and live with the fear |
| 4 | **The heir** | Dionysius II | 367 | 357, or his fall | Keep everything your father built when nobody fears you yet |
| 5 | **Burn the ships** | Agathocles | about 317 | his death (about 289) | A potter's son with only the army: take the city, then carry the war to Carthage itself |
| 6 | **Between Rome and Carthage** | Hieron II | about 275 | 264 (Rome crosses) | Get the army's crown, tame the Mamertines, and choose the winning side |

The dates are ranges where the sources give only archon years (`tyrant-campaigns.md`, top). Each campaign below lists its start, map, cast, challenge, signature rule, how it is judged and where its facts are carded.

---

### 1. The cavalry captain: Gelon

**Start:** about 491, at Gela, the season Hippocrates the tyrant dies near Hybla. You are "captain of the entire cavalry" (Herodotus 7.154.2), and the city will not bear his sons (7.155.1). *Other start:* 485, the day Syracuse's exiled landowners ask you to bring them home (7.155.2), if 491 makes the campaign too long.

**Map:** the south and east of the island: Gela, Camarina, Syracuse, Megara, Leontini, Acragas, Himera, the Sikel towns; Carthage's west. Needs the whole-island map (Phase 3).

**Cast:** real: Gelon, his brothers Hieron, Polyzelus and Thrasybulus, Damaretê, Theron of Acragas, Terillus of Himera, Anaxilas of Rhegium, Phormis the Arcadian; the sons of Hippocrates (Euclides and Cleandrus, Herodotus 7.155.1). Invented: the landowners' leader in exile at Casmena, a captain of the Syracusan poor, a Megarian rich man (as in `start-480.md`).

**The challenge:** three steps the sources describe and the engine must let you fail at: take Gela from the heirs you pretend to serve; take Syracuse by bringing home its exiled rich, which makes its poor your enemies; then make Syracuse great before Terillus' friends bring Carthage in (Herodotus 7.165.1). And all the while stay loved: Gelon is the one tyrant Diodorus says died "in the esteem of his people" (11.23.3, `start-480.md`).

**Signature rule: moving a town.** A ruler who takes a town can move its people into his own city. Its rich become citizens (a new block of voters with a grudge or a debt to you); its poor can be enrolled, sold abroad, or left. Your city grows fast; the towns you emptied are gone from the map and remembered by their people. Herodotus' reason, shown on the action: "he held the common people to be exceedingly disagreeable to live with" (7.156.3).

**Also in play:** the Greek embassy asking for help against Persia (Herodotus 7.157 to 7.162) as a defined choice (help, bargain for the command, refuse); mercenaries made citizens, the bill that falls due in 466 (`start-466.md`); the will that names an heir.

**Judged:** Held: are you alive and ruling at the end? Charge: is Syracuse the largest city on the island, and has Carthage been beaten or kept out? Legacy: the epilogue runs your heir's first years. If Hieron or whoever you named holds the citadel, the mark is met.

**Facts:** `docs/research/tyrant-campaigns.md` s.1, `docs/research/start-480.md`.

---

### 2. The founder: Hieron I

**Start:** about 478, Gelon's funeral. You are the eldest brother, named heir (Diodorus 11.38.3), ruler of Gela until now. Gelon wanted a cheap funeral by the law, and the whole city walked behind it (11.38.3 to 11.38.4). You have his name; your brother Polyzelus has the crowd (11.48.3).

**Map:** the island at its Phase 3 size, with Italy as levers: Cumae, Rhegium, Croton and Sybaris across the strait.

**Cast:** real: Hieron, Polyzelus, Thrasybulus, Damaretê (Gelon's widow, whom Polyzelus married in some accounts; not in the saved texts, so left out until carded), Theron and his son Thrasydaeus at Acragas, the sons of Anaxilas and their guardian Micythus at Rhegium, the seer Hagesias, Phormis. Invented: a captain of the new citizens, a Naxian who lost his town to your settlers, a poet at court (Pindar and Bacchylides are named in the sources but as visitors, not as people to play with).

**The challenge:** keep your brother from taking the city without making the city hate you for it. Diodorus' verdict is that Hieron was "avaricious and violent" and that men held back from revolt only "because of Gelon's reputation" (11.67.4); Pindar and Bacchylides praise him. You decide which one the chronicle writes.

**Signature rule: founding a city.** A ruler can found or refound a town with settlers of his choice and a new name: Catana became Aetna with "ten thousand settlers" (11.49.1), and the old people were moved to Leontini (11.49.2). The settlers are your men (a garrison that farms), and the founder can be honoured as its hero after death (11.66.4). It costs a town's goodwill and makes a people of exiles. *Also tested:* the **dangerous command** (send a rival with an army and hope he dies, as Hieron sent Polyzelus to Sybaris, 11.48.4), which the commission switch half-has already.

**Also in play:** Theron of Acragas as the rival tyrant and in-law; the Himerans offering you their city against him, which you can take or betray (11.48.7 to 11.48.8); the sea war for Cumae (11.51.1 to 11.51.2), the first use of the war-at-sea rules; prestige from games victories and poets.

**Judged:** Held: do you die in power? Charge: does a city you founded exist at your death, and is your brother alive and not ruling? Legacy: the epilogue is the cruellest of the six. The engine plays your heir's first year by itself, and the history it is up against is one year: Thrasybulus "ruled over the Syracusans for one year" (11.66.4). If the city still has a Deinomenid ruler after the epilogue, the mark is met.

**Facts:** `tyrant-campaigns.md` s.2, `start-480.md`, `start-466.md`.

---

### 3. The sword: Dionysius I

**Start:** 405, the game that exists. You rise "from a scribe and ordinary private citizen" (Diodorus 13.96.4, `dionysius-405-403.md`) and hold the citadel. The Phase 2 island game (405 to 395) is this campaign's first chapter, already playable.

**Map:** the Phase 2 island now; the whole island and south Italy (Rhegium, Locri, Croton) for the later reign.

**Cast:** the game's present cast (`cast-405-395.md`): Leptines, Philistus, Doris, Aristomache, Hipparinus, Theodorus, Himilcon, Magon and the rest, plus the census. Later chapters add Dion and the children of the two wives (Diodorus 16.6.2).

**The challenge:** survive the rise, the great war of 397 to 396 and the fear that comes with power, to 367. This is the campaign the game is named for: Damocles was at his court (`docs/research/damocles.md`).

**Signature rule: the sword itself**, built: the plots and the sword check, with warnings before the blow. *For the long reign, new here:* **the fear**. Each season you hold the citadel by force, the people around you trust you less and you trust them less; your guard grows, your table shrinks, and some actions (walking unguarded, a dinner with strangers) become harder. The Damocles story is this rule told as a scene: a dinner moment with the sword over the couch, written from Cicero (Tusculan Disputations 5.61 to 5.62, Latin saved).

**Also in play:** everything in Phase 2: the island, Carthage, armies, the commission, grain, dinners, great works, exile.

**Judged:** Held: are you alive in 367? Charge: is Carthage pushed back past where it stood in 405, and does Syracuse hold the citadel walls you built? Legacy: the epilogue opens campaign 4: does your heir get the assembly's loyalty?

**Facts:** the existing cards (`dionysius-405-403.md`, `island-405-395.md`, `diodorus-401-399.md`, `cast-405-395.md`, `damocles.md`).

---

### 4. The heir: Dionysius II

**Start:** 367, your father's funeral. He died of a feast after winning a prize for a tragedy at Athens (Diodorus 15.74.1 to 15.74.2). You call the assembly and ask it "to maintain toward him the loyalty that passed to him with the heritage that he had received from his father" (15.74.5). You hold everything: by Diodorus' count "four hundred ships of war", a huge army and the citadel (16.9.2, a claim, not a count). You hold no one's fear.

**Map:** Syracuse at its largest, with the city map (Ortygia as a place you can be shut into); the island; Italy (Locri, your mother's city, 16.6.2); Greece as levers (Athens, where Plato is).

**Cast:** real: Dionysius II, Dion (your uncle by your father's second wife, "a man who had great proficiency in philosophy", 16.6.3), Aristomache, Arete, the half-brothers Hipparinus and Nysaeus, Philistus, Plato (a visitor), Heracleides, Callippus. Invented as in `start-357.md`.

**The challenge:** turn an inherited claim into your own power before someone with a better claim does. Dion is "considered powerful enough to overthrow the tyranny" (16.6.4). Exile him and he comes back with ships; keep him and he is at your table.

**Signature rule: legitimacy that fades.** The heir's claim, drafted in `phase3-draft.md` s.2, is the campaign's core number: it starts high and falls every season unless you win something, hold something yourself, or the assembly confirms you. Your father's men follow the claim while it lasts. *Also tested:* **the tutor** (bring a philosopher to court; he can change your traits, your laws, or your enemies' minds. Plato's account: reports of plotting "caused Dion's expulsion", Letter 7.333), and **the liberator's landing** (Dion "putting ashore with two merchantmen", Diodorus 16.9.2).

**Judged:** Held: do you hold Ortygia in 357, ten years on? Charge: is your legitimacy your own by then (raised above where you started, by deeds)? Legacy: is Dion dead, reconciled or ruling? Each reads differently in the chronicle. *Other end:* play on past 357 into exile at Locri and the return, using the exile switch. The history has him back in Syracuse later and out again under Timoleon (`start-357.md`; dates in later books, not carded).

**Facts:** `tyrant-campaigns.md` s.3, `start-357.md`.

---

### 5. Burn the ships: Agathocles

**Start:** about 317, the morning of the coup (`start-317.md`): the Six Hundred are in the trap, the army is yours, the oath at Demeter's shrine is still fresh. *Other start:* earlier, as a soldier exiled with an army of his own in the interior (Diodorus 19.5.4), for a longer climb.

**Map:** the whole island, and a **second theatre**: Carthage's home country in Libya (its farmland, its towns, the city itself as a place you can besiege but hardly take).

**Cast:** real (`start-317.md`): Agathocles, his brother Antandrus, Deinocrates and the exiles, Hamilcar, Acrotatus; later his sons, Archagathus, Menon of Segesta (`start-289.md`). Invented: a chiliarch, a survivor of the Six Hundred, a Morgantina captain.

**The challenge:** a man with "the lowest beginnings" and no right to rule but the army. First keep the promises that won the assembly ("to abolish debts and to distribute land to the poor", 19.9.5) or survive breaking them. Then, when Carthage besieges Syracuse, do the mad thing: break the blockade with sixty ships (20.5.1 to 20.5.2) and land in Libya while your city starves behind you.

**Signature rule: the second front.** A ruler with ships can carry his army to the enemy's own land. Two maps run at once: you in Libya, plundering and fighting with what you carried; Syracuse at home under siege with a keeper you named. Carthage's council must choose between saving its farmland and taking your city. Messages take seasons. *Also tested:* **burning the ships** (an act that removes retreat: your army's morale rises and you cannot leave without new ships, Diodorus 20.7.5), and **promises as a ledger** (each promise to the assembly is an object that is kept, broken or paid late, `start-317.md` story 1).

**Judged:** Held: do you die ruling, at about 289? Charge: did you fight Carthage on its own land, and does Syracuse still stand? Legacy: the epilogue is the poisoned succession of `start-289.md`: does your named heir live a year? (Diodorus 21.16.3 to 21.16.6, three deaths in one year.)

**Facts:** `tyrant-campaigns.md` s.4, `start-317.md`, `start-289.md`.

---

### 6. Between Rome and Carthage: Hieron II

**Start:** about 275, the camp near Merganè. Pyrrhus has left Sicily; the army has "quarrelled with the citizens" and elected you as one of its commanders (Polybius 1.8). The city did not ask for you.

**Map:** the whole island late in the span: Messana held by the Mamertines, Tauromenium, Lilybaeum in Carthage's west, the Lipari islands; Rhegium across the strait; Rome as an outside power that can be called in.

**Cast:** real: Hiero, Artemidorus (the other elected commander), Leptines (the common people's leading man, whose daughter you can marry, 1.9), the Mamertines and their general Ciôs (Diodorus 22.13.5), the Carthaginian Hannibal at Lipara (22.13.7), Tyndarion of Tauromenium; late in the campaign Appius Claudius. Invented: a captain of the old mercenaries, a Mamertine who wants to sell the town, a Syracusan grain merchant, an envoy to Rome.

**The challenge:** three things in order. Make the city accept a general chosen by soldiers, which it "by no means usually" does (1.8). Deal with the old hired men, who are "disaffected and mutinous" (1.9). Then take Messana, with Carthage and in the end Rome both wanting it. The campaign's last season is the choice Polybius describes: stay with Carthage or send "messages to the Consuls, proposing peace and friendship" (1.16).

**Signature rule: the army's election.** Soldiers can choose their own commanders, and a city can accept or refuse them. It is a general rule for the market's companies (`phase3-draft.md` s.4), here at its strongest: your power comes from the camp, and the city is a second constituency. *Also tested:* **the deputy at home** (a marriage tie to the man who holds the city while you are away, Polybius 1.9: the commission switch's keeper, made a person you are related to), **spending your own men** (send a company you cannot trust into a battle it will lose; it is a defined act with a cost, Polybius 1.9), and **Rome as the last outside power**.

**Judged:** Held: are you king, or at least general, in 264? Charge: are the Mamertines out of Messana or bound to you? Legacy: which side are you on when the campaign ends, and the epilogue's verdict on it. The real Hieron reigned "fifty-four years" in peace by Polybius' count (7.8); the chronicle can say whether yours will.

**Facts:** `tyrant-campaigns.md` s.5, `start-289.md` (the market, the Mamertines).

---

### Bridges: other people to play later

Not tyrant campaigns, but starts that join them up, each already part-carded. Listed so they are not lost; none designed here.
- **Thrasybulus' year** (466): one year to keep a dynasty the city has turned on (`start-466.md`). A short, hard campaign.
- **The free city** (466 to 405): the democracy between the tyrannies, which "maintained its democracy for almost sixty years" (Diodorus 11.68.6). Play a leading man, not a tyrant.
- **Dion** (357): the liberator who becomes the feared man (`start-357.md`).
- **Timoleon** (344): the man Corinth sent (`phase3-draft.md`, history pattern 3). Needs a card.
- **A Mamertine captain** (289): the hired men who take a city for themselves (`start-289.md`).

---

## Part 5. How it fits the phases and the engine

### The phases

| Phase | What it adds to the whole game | Campaigns | Open game |
|---|---|---|---|
| 0, paper test | done | | |
| 1, The Citadel | the court, factions, objects, plots, the sword | | |
| 2, The Island (now) | the map, Carthage, armies, the test | Campaign 3's first chapter (405 to 395) is the test game | |
| 3, The Long Game | generations, two speeds, stations, the market, the whole island, more starts | Each campaign is one Phase 3 start, built in the order of part 6 | "Your own Syracuse" is Phase 3's main mode |
| 4, The Historian | legends browser, biased historians, coin portraits, "what the sources say" | Each campaign's end page shows the sources' version | Same, for any game |
| 5, Board game (optional) | the power objects on a table | A campaign is a ready scenario for the table | |

This doc changes no phase and no scope. Campaigns and the open game are Phase 3 work and wait for the Phase 2 gate ("ten seasons of the island game produce a story Jacob would retell, and he says go").

### The engine

Everything follows `docs/architecture.md`. The engine stays UI-free, deterministic and plain-data, so all of this ports to Godot unchanged.

- **A start** is `data/starts/<id>.json` (as drafted): the six objects, factions, places that exist, the cast, Carthage, the market. Content validation already demands `kind` and a research card for every history record.
- **A campaign** is `data/campaigns/<id>.json`: which start, which person you play, the end date, the three marks, which switches it turns on, and the epilogue's length. *New here.* No code says "Gelon".
- **The marks** are conditions read from the state and the log at the end date (who holds the citadel, whether a city founded by you exists, whether a named person rules), written in a small fixed vocabulary like the event conditions that exist now. They never steer the game while it runs.
- **Signature rules** are ordinary engine modules (`src/core/<rule>.ts`) gated by a switch in `data/switches.json`, off by default. A campaign turns its own on; the open game can turn any of them on. Rules changes stay Jacob's.
- **The epilogue** is the existing headless run: the engine plays on N years with a bot in your seat and the chronicle reads it. The Dionysius bot is the first of these already.
- **The headless check grows, not changes:** the 100-seed run covers each campaign as it lands; the counts per campaign (how often each mark is met, how often the history repeats) are reported, never tuned to history.

---

## Part 6. Build order and cost, if Jacob says go

After the Phase 2 gate. Each step ends playable with checks passing. Cost: light, medium or heavy, like the Phase 2 slices.

1. **Campaign frame** (medium): `data/campaigns/`, the three marks, the epilogue, the start screen's two doors ("Your own Syracuse" and "The campaigns"). Proven on campaign 3, which exists.
2. **Campaign 3 in full** (medium): the 405 game run to 367, with the fear. Needs Phase 3's two speeds or a longer close game.
3. **Campaign 4, the heir** (medium): needs generations and legitimacy (Phase 3 slice 1), so it is the natural second campaign. Uses the 357 card.
4. **Campaign 6, Hieron II** (heavy): needs the market (Phase 3 slice 3) and the late island; adds Rome as a lever.
5. **Campaign 5, Agathocles** (heavy): needs war at sea and the second theatre, the largest new map work.
6. **Campaigns 1 and 2, Gelon and Hieron I** (medium each): need the whole island and the founding and moving rules; research is mostly done (`start-480.md`, `start-466.md`, `tyrant-campaigns.md`).
7. **"Your own Syracuse" in full** (heavy): any start, any station, the three world settings, the 216 years. It is mostly built by then, because every campaign built part of it.

*Other order:* Gelon first, because his story is the start of the span. The draft prefers 3, 4, 6 because each needs the next Phase 3 system in the drafted order, so no campaign waits on a system built only for it.

---

## Part 7. Questions for Jacob

None of these blocks anything now; each has the draft's pick.

1. **Campaign length.** Whole reigns (the draft's pick, with two speeds) or one decade each, at the moment of crisis?
2. **The marks.** Three marks in words (the draft's pick) or a single held-or-fell verdict?
3. **The six.** Are these the right six? Thrasybulus, Dion or Timoleon could replace one or join them.
4. **Gelon's start.** 491 at Gela (the draft's pick, the whole rise) or 485 at Syracuse (shorter)?
5. **Rome.** A playable outside power in the last decades (the draft's pick, needed for Hieron II's choice) or only a name, as `phase3-draft.md` has it?
6. **The second front.** A small Libyan map for Agathocles (the draft's pick), or Libya as a list of places with no map?
7. **The world settings** for the open game: keep all three (as it was, new people, a different Sicily), or only "as it was"?
8. **What the campaigns are for.** Teaching the systems one at a time, or separate stories for after you know the game? The order in part 6 serves the first; you may want the second.

## History and invention

- **History, with a card:** every quoted line and every real person and place. The new facts are in `docs/research/tyrant-campaigns.md`, checked word for word against the saved texts on 2026-11-25; the rest in the cards named in each section. BC dates are modern reckonings, given as ranges.
- **Invention:** every rule, mark, campaign name, mode, invented person and number; the choice of the six tyrants; the build order.
- **Not decided here:** anything about Jacob's own reading of the tyrants. Where the sources judge a man (Diodorus on Hieron, Polybius on Hiero II), the doc shows the judgement and, where it exists, the other side.
