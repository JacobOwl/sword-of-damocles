<!-- Council seat statement, 2026-11-27, thread 48. Written by a separate AI session given brief.md in this folder. Advice only. -->

# The board-game designer: invading Carthage and diplomacy abroad

I read the brief and the war council's summary. I then opened rules texts online for the main games. Each mechanic below says where it comes from. **Verified** means I read it in the linked rules or a review just now. **From memory, unverified** means I did not open a source this session. Several rules summaries I used carry their own "known errors" warning, so a verified rule here is checked against that summary, not the printed rulebook. Every number in a proposal is invention.

## What the games teach, in one table

| Game | The mechanic | Status |
|---|---|---|
| Hannibal & Hamilcar (Valley Games / Phalanx) | A Carthaginian sea move needs a die roll while Rome holds naval supremacy; a bad roll means "The CUs are eliminated and the General is displaced" (11.5, 11.6). Taking Carthago is a sudden-death win (23.1). A siege needs "3 Siege Points" (20.1.1). Political control markers that "cannot trace a path" to a friendly unit are removed (19.4). | Verified, [rules text](https://lehi-innovation.github.io/boardgame-rules/extracted/hannibal-rome-vs-carthage-rules.txt) |
| Republic of Rome | Wars are cards that arrive from outside. Inactive wars wait; a matching war or leader activates them (1.07.331, 1.07.341). "Each Unprosecuted War" adds 1 unrest (1.08.11). Some wars need a naval victory first, and "Land Battles may only be fought if enough Fleets are present" (1.10.11). Four active wars and "the Republic collapses" (1.07.334). | Verified, [living rules](https://tlscotarius.github.io/patresconscripti/livingrules_v106a.html) |
| Republic of Carthage (fan game, after Republic of Rome) | Carthage's own senate fights Sicilian, Libyan and Numidian wars; "The Sikels are available for all Sicilian and Roman Wars"; "The Libyan War adds four Libyan Light Infantry". | Verified, [Spotlight on Games](https://spotlightongames.com/variant/Roc/rules.complete.html). The designer's name was not in the part I read. |
| Here I Stand | A diplomacy phase. Declaring war on a minor power lets its patron step in: "Venice is activated as a Papal ally" (9.6). Suing for peace needs a captured leader or home space, and the loser "removes 2 units" (9.3). Foreign War cards "draw powers away". | Verified, [rules text](https://lehi-innovation.github.io/boardgame-rules/extracted/here-i-stand-rules.txt); the Foreign War detail is from memory, unverified |
| Pax Pamir 2nd ed. | You are always loyal to one coalition. Switching costs you: "first return your gifts" and "discard any prizes and patriots". "Patriots will only serve in your court if your loyalties align!" | Verified, [rules](https://rally-the-troops.com/pax-pamir/info/rules.html) |
| Twilight Struggle | Control needs influence at least equal to the country's stability number and a lead of at least that number. | Verified, [summary](https://lehi-innovation.github.io/boardgame-rules/rules/twilight-struggle/) |
| Time of Crisis | Barbarians wait in homelands "inactive side up". A crisis roll flips some active, and the black die decides how many invade, the white die the path. You "may move an army into a barbarian homeland". | Verified, [rules](https://rally-the-troops.com/time-of-crisis/info/rules.html) |
| Nevsky (Levy & Campaign) | To Sail, "one Ship per Provender and two Ships per Loot" (4.7.3). Lords whose service runs out "must Disband" (3.3.2). | Verified, [rules](https://rally-the-troops.com/nevsky/info/rules.html) |
| Peloponnesian War (Mark Herman) | Solo play against a bot driven by "bellicosity". A defeat costs a side a full point, a victory adds only half. | Verified, [Inside GMT](https://insidegmt.com/?p=20565), [Space-Biff review](https://spacebiff.com/2019/11/06/peloponnesian-war/) |
| Oath | The Chancellor can offer Exiles citizenship and can banish Citizens; the next game starts from the last. | Verified, [Wikipedia](https://en.wikipedia.org/wiki/Oath:_Chronicles_of_Empire_and_Exile) |
| Arcs: the Blighted Reach | Players are regents "beholden to a distant Emperor"; the Imperial Council card stays in the court; Edicts force a war, peace or escalation policy. | Verified, [review](https://theboardgameschronicle.com/2026/05/03/first-impressions-for-arcs-the-blighted-reach-from-leder-games/) |
| Polis | A proxenos pawn wins over neutral cities. | Verified, [summary](https://lehi-innovation.github.io/boardgame-rules/rules/polis-fight-for-the-hegemony/) |
| Sword of Rome | Cards bring in non-player powers: the Gauls, the Volsci and Carthage. | Verified, [review](https://armchairgeneral.com/?p=2402) |
| John Company 2nd ed. | Indian states rise, invade and rebel each turn; invasions bring loot but family members can be "killed or disgraced". | Verified, [Wikipedia](https://en.wikipedia.org/wiki/John_Company_(board_game)) |
| Fire in the Lake (COIN) | Insurgents Rally (place guerrillas, then bases), March, Attack, Terror; scoring comes in periodic Coup rounds. | Verified, [summary](https://lehi-innovation.github.io/boardgame-rules/rules/fire-in-the-lake/) |
| Successors | Legitimacy wins the game, and holding royal family members brings it. | Verified, [review](https://www.meeplemountain.com/reviews/successors-fourth-edition/) |
| Imperial Struggle | Diplomatic actions flag alliance spaces; the war tiles for the next war are on show early. | Alliance spaces verified, [Players' Aid](https://theplayersaid.com/2020/08/26/imperial-struggle-the-global-rivalry-britain-and-france-1697-1789-from-gmt-games-action-point-2/); war tiles from memory, unverified |
| Root, Almoravid | Not used below. | Not checked |

## 1. Invading Carthage's home

The history comes first. No source in the brief has Dionysius land in Libya between 398 and 395. Libya's trouble in 396 is Carthage's own Libyan revolt (14.77, not saved). Real invasions come later: Agathocles in 310 and Regulus in 256. So in this campaign, an invasion of Libya is a what-if. It should be possible, hard and rare.

**Option 1A. The raid across the sea (for 398 to 395) ★**
- One action: "Sail for Libya." You choose ships, men and food.
- **Crossing roll, from Hannibal & Hamilcar 11.5.** If Carthage rules the sea, Carthage rolls against your crossing. A bad roll sinks part of the force. Defeating Carthage at sea first improves the roll. Republic of Rome's "fleet support" rule (1.10.11) says the same thing differently: no landing without enough ships.
- **Food goes by ship, from Nevsky 4.7.3.** Ships carry the months of food the army needs, so a bigger army needs more hulls. This reuses `armySupply`.
- **What you can do there:** plunder the farms and stir the Libyans. Diodorus 20.8.3 to 20.8.4 (Agathocles' army sees the rich farmland) is the flavour.
- **What it does to Carthage:** its council blocs react through the existing moods. Elders' anger rises; fear of a Libyan rising rises; the Hundred may call the expedition home. Republic of Carthage gives Carthage's own "Libyan War". Here the raid makes that war likelier.
- **The cost at home:** while the army is away, Carthage, the knights or the towns may move. Under Here I Stand's suing for peace (9.3), peace needs a captured leader or home space, so a raid that takes nothing buys no peace.

**Option 1B. The second front map (for a later campaign about 310 BC)**
- A small Libyan map, as thread 30 sketched. Towns there carry control markers, like Hannibal & Hamilcar's. A marker cut off from your army is removed (19.4). This is 20.17.1: towns come over "because of fear, others because of their hatred". They fall away as fast.
- Carthage itself is a walled city that needs three siege points (20.1.1). Taking it ends the war, as in Hannibal & Hamilcar's sudden death (23.1). It should be near impossible.
- **Home needs a regent.** Agathocles leaves his brother Antander as "curator of the city" (20.4.1). The regent is a named person with loyalty and a mood. He may betray you. That is Oath's Chancellor and Exile tension.
- **Carthage's coup risk.** Bormilcar wants tyranny (20.10.2). This uses the existing council blocs.

**Option 1C. The off-stage war (cheapest)**
- The raid is one card, resolved by a roll, with no units moved. This is Here I Stand's Foreign War cards (from memory, unverified).
- It is cheap, but you never see it on the map. He loves the map, so I would not pick it.

**My pick:** 1A as an off-by-default switch for this campaign, and 1B for the Agathocles campaign. 1A uses the systems he already has (army food, Carthage's blocs, the interception roll). It needs a scope change, since naval battles beyond one roll are out.

## 2. Diplomacy with Greek cities and other powers

Every power below has a passage behind it. Powers without a saved passage (Athens, the Illyrians) stay names until the text is saved.

| Power | What it can give | What it costs | Passage |
|---|---|---|---|
| Sparta | Mercenaries, an admiral, protection | A Spartan who vetoes Syracusan liberty | 14.10.2, 14.63.4, 14.70.1 to 14.70.3 |
| Corinth | Ships (the mother city) | A plea, in hard times | 14.62.1 |
| Locri | A bride, a firm Italian friend | Rhegium's hatred | 14.44.3 to 14.44.6 |
| Rhegium | The strait | Its assembly can refuse you | 14.44 |
| Messana | Its loyalty, for land | Land | 14.44 |
| Lucanians | Raids on the Italian Greeks | Greek hatred, the Italian league | 14.100.5, 14.101.1 |
| Olympia | Fame across Greece | Lysias' crowd may shame you | 14.109 (388, so later) |

**Option 2A. Patron loyalty, from Pax Pamir ★**
- You lean to one patron at a time: Sparta, or no one.
- Sparta's help is a set of objects: a mercenary band, an admiral, ships. They serve only while you stay loyal. Pax Pamir's patriots are the model.
- Turning from Sparta returns all of them. Pax Pamir's rule that you "first return your gifts" is the model.
- **The string.** The admiral object can veto one action at the worst moment, as Pharacidas did (14.70). Help that bites back makes the game harder.

**Option 2B. Influence in each city, from Twilight Struggle**
- Each Italian city has a stability number. Locri is low, Rhegium high, since its assembly said no.
- You and a rival (Rhegium, or later the Italian league) place influence. You control a city only when you lead by its stability.
- Actions that place influence: an envoy (Polyxenus at 14.62.1 is the type), a marriage, a gift of land, and a guest-friend. That last is Polis' proxenos pawn, a named person you place in a city.

**Option 2C. Minor powers that wake, from Here I Stand 9.6**
- Rhegium, Locri and the Lucanians are minor powers. Each is asleep until something wakes it.
- Attack Rhegium and its friends wake against you. That is Here I Stand's rule that war on Venice brings in the Pope. Historically it is the league of 14.101.1: "they should all come to its aid".
- Marry into Locri and Locri wakes on your side.

**My pick:** 2A for Sparta and Corinth, and 2C for Italy. 2B is good, but it is a second influence board beside the town houses the war council already chose. That is too much sameness and too many tokens. I would add 2B only if 2C proves too thin.

**The actions:** send an envoy, offer a marriage, give land, ask for ships, hire mercenaries (with Sparta's leave), and send a guest-friend. Each takes a season. Each can be refused. Each answer is one line in the chronicle, not a popup.

## 3. How off-map powers appear

- **3A. A point with a track** is what Carthage has now. It works for one power.
- **3B. Homeland boxes on the map's edge, from Time of Crisis ★.** Put three boxes in the sea margin: Greece, Italy and Libya. Each holds a few pieces, face down while quiet and face up when stirred. The crisis roll or an event flips them. Active pieces "invade" or arrive along a drawn sea lane. In this game that means Spartan ships, Lucanian raiders or Libyan rebels. You can see the trouble build before it comes, which follows the sword rule: warnings before the blow.
- **3C. War cards that arrive, from Republic of Rome.** A war or crisis card lies in waiting until a matching card or leader wakes it. An ignored war costs unrest every season (1.08.11).
- **3D. A small second map**, as in option 1B. Only for a campaign built around it.

**My pick:** 3B, with 3C's "unprosecuted war costs unrest" rule laid on top. The boxes keep it on the map he loves. The pieces are power as objects. The unrest rule makes ignoring the outside world cost something, which answers "too easy". The Libya box also gives the Libyan revolt a face. Its rebels behave like a COIN insurgent: they Rally and March when Carthage is weak. That is from Fire in the Lake, much simplified: two moves, not four.

**For difficulty, from Herman's Peloponnesian War:** a defeat abroad should cost more standing than a win gains, a full point against half. It is a small rule that makes adventures risky.

## 4. What NOT to do

- **No free negotiation.** Here I Stand's diplomacy is players talking at a table. A one-player game cannot copy it. Use fixed offers with plain answers.
- **No Greece map in Phase 2.** The war council said no hexes and no free movement. A second map belongs to a campaign built for it.
- **Do not make Carthage a win button.** Hannibal & Hamilcar can end on taking Carthago, but Agathocles never took it (20.69, he fled). Make it near impossible.
- **No invented alliances.** Athens in 398 has no saved passage. Keep it a name until Xenophon or the inscriptions are saved.
- **No influence board in every place at once.** One system for towns, one for patrons. More is a wall of tokens.
- **No scoring rules borrowed whole.** Pax Pamir's dominance checks and Twilight Struggle's region scoring are for rival players. Take the loyalty rule, not the scoring.
- **No popups for each envoy.** Answers go in the matters before you and in the chronicle.
