# Phase 0 paper test, 2026-11-22

Played in chat. Jacob played Dionysius, and Claude ran the factions and people. The rules were a one-page draft, "The Citadel: starter rules for the paper test", kept as a Claude Doc (https://claude.ai/artifact/PsTQMCF52p5BbUgqHmfRm5). All the rules are **invention**. The setting facts are history, and they're carded in `docs/research/dionysius-405-403.md`.

## Result

- **First try:** two seasons. It stopped because four rules broke (see below).
- **Second try:** all ten seasons, from autumn 405 to winter 403/402 BC. Dionysius survived.
- **Counts:**
  - One tyranny, held from season 2 on, through the citadel, treasury, generalship and mint.
  - Three plots. Two struck and failed (seasons 4 and 8), and one was still at Rumors at the end.
  - Deaths: the guard captain (executed) and the cavalry leader at Aetna (killed). The player didn't die.
  - Carthage declared war in season 10, after the player raided a tribute town. In history the war came in 397.
- **Broken results to watch:** under the first clock rule, Carthage invaded by season 8 in every game. That's fixed now (see below).

## Rules changed during play

| When | Change | Why |
| --- | --- | --- |
| After try 1 | Grain starts at 8 months, drops 2 a season, and the summer harvest adds 6 | Draining 3 a season caused a riot in season 2 |
| After try 1 | Moods rise one step when a goal is met or an order serves the faction directly | Moods could only fall |
| After try 1 | Each named person has two traits, worth +1 or -1 on a roll | Jacob's idea |
| After try 1 | The Carthage clock gets +1 extra only for a riot, street fighting or an attack on Carthage's towns | "Unsettled" applied almost every season |
| Try 2, season 5 | The clock gains +1 a year (each summer), not +1 a season | +1 a season reached 10 by season 8 in every game |

## Rulings made in play (not yet in the rules)

1. Handing out real grain or land needs no roll. Only words (speeches and promises) are rolled.
2. A plot can strike at the earliest the season *after* it is Named.
3. When the guard has gone two seasons unpaid, it goes to the highest bidder at the power step, and the player can outbid the others.
4. A plot member whose grudge is resolved rolls to leave the plot.
5. If you hold the citadel, you can take an office (power object) whose holder is absent, with no roll. This may be too easy.
6. A plot loses a faction's backing when that faction's mood rises above Angry.
7. A marriage is a Court order. A dowry is allowed.
8. The citadel costs 2 orders (they can be in different seasons) and 4 talents. Philistus' offer to pay half halves the silver.

## Claude's findings

- **The warnings worked.** Both blows were foreseen, and neither felt random.
- **The guard's pay drove the story.** At 3 talents a season with no steady income, it was a deficit every season, until the player created a tax and took the mint.
- **The player reached outside the city three times** (Leontini, Catana and Selinus). Phase 1 has no island, so these were resolved as one roll each.
- **Marriages were a strong tool** (three were used). Dinners barely came up.
- **The factions only reacted.** Their strength numbers never changed. The orders were freeform, so Claude improvised the results.

## Jacob's verdict

- Go with a video game.
- He liked the plot as a threat, and that the plot forms from his own actions.
- He disliked "basically just RPing and making up actions". He wants concrete, CK3-style rules where every character interaction and activity is a defined thing.
- He wants faction power ratings that shift, so factions become marginal or influential over time. That should come partly from his actions and partly from the factions' own agency.
- He wants characters and factions to act on their own, not wait to be acted on.
- He wants rivals and plots to develop naturally, like a nemesis system, so the game makes its own "big bad" bosses.

## Next

Write v2 rules: an action menu, faction power, agendas and rivals. Run a short re-test of 3 or 4 seasons using only the menu. Then write `docs/rulebook.md`.

---

## Full log

The season-by-season log follows, with dice, modifiers and rulings. The dice came from Python `random.Random(4040)` for try 2 and `random.Random(405)` for try 1, so every roll can be replayed.

Dice: Python random.Random(405), d6 stream: 1 2 6 6 4 1 6 5 5 6 5 1 ... (next unused: #1)

## Try 1

### Season 1, autumn 405 BC
World: grain 6->3, silver 6->4 (guard paid), Carthage clock 2->3.
People: Cavalry leader at Aetna starts plot vs Dionysius (+2, faction leader). Philistus offers to fund the Ortygia wall for an office. Heloris urges the citadel.
Factions: Citizens push goal (grain before winter), Nicoteles speaks. Rich (Angry) fund the Aetna plot (+1 -> strength 3, stage Whispers). Guard captain asks for land on Ortygia. Family (Content) reports rumors: Polyxenus brings the whisper.
Awaiting Jacob's three orders.
Orders (Jacob):
1. City: speech promising every man a king of his own. d6 #1=1, mods +1 (proven demagogue, Diod. 13.91-94) -1 (nothing concrete, grain 3) = 1. FAIL. Citizens Uneasy->Angry. Nicoteles: "kings of an empty granary".
2. War: land on Ortygia to guard leaders + 1 silver bribe. Certain. Silver 4->3. Guard Content->Loyal. (Parallel: Diod. 14.7.5, island houses to friends and mercenaries.)
3. Court: haggle with Philistus (traits: Dionysius Silver-tongued +1, Philistus Shrewd -1). d6 #2=2. FAIL. No money. Counteroffer: the treasury in exchange for paying for the wall.
Power: no change. Sword: Aetna plot str 3, Whispers, cannot strike.
Chronicle: see thread.

### Season 2, winter 405/404 BC
World: grain 3-3=0, +2 Leptines' fleet brings grain -> 2. Silver 3-2 (guard) = 1. Clock 3+1+1 (unsettled: no citadel) = 5.
People: Aetna leader recruits (d6 #3=6 ok) Nicoteles (+2) -> plot str 5, stage Rumors. Nicoteles grudge: promised kingship, given hunger.
Factions: Citizens grain<3 -> riot, Angry->Rebellious, assembly shut unless grain handed out. Rich Angry -> fund plot +1 -> str 6. Guard Loyal, paid, defends ruler. Family Content -> Leptines reports Rumors.
Defense now: 4 + guard 3 = 7 (no citadel). Faction strengths: citizens 4, rich 3, guard 3, family 2.
Rule rulings made: strike earliest the season AFTER Named. Fleet holder Leptines (loyal) uses fleet for grain.
Findings so far: grain drain too harsh; moods only fall (no recovery path); clock fast; failed orders sting hard; Jacob wants DnD-style traits on people (fits Phase 1 "traits").

## Try 2 (restart after rule changes: grain -2/season, start 8, summer +6; moods can rise; traits; clock +1/season, +1 only for riot/street fighting/attacking Carthage's towns)
Dice: Python random.Random(4040): 1 3 6 6 5 5 6 5 5 3 4 4 1 1 3 2 6 2 3 5 (next unused: #1)
Traits (invention): Dionysius Silver-tongued, Suspicious | Philistus Shrewd, Ambitious | Polyxenus Cautious, Well-connected | Leptines Bold, Generous | Thearides Dutiful, Showy | Heloris Blunt, Proud | Hipparinus Wealthy, Patient | Nicoteles Fiery, Outsider | Doricus Harsh, Loyal | Aetna cavalry leader Vengeful, Brave

### T2 Season 1, autumn 405
World: grain 8->6, silver 6->4, clock 2->3.
People: Aetna leader starts plot (+2). Philistus offers half the wall for an office. Leptines asks to raid Carthage's tribute towns with the fleet.
Factions: Citizens (Uneasy, goal: a share of the land being given out) Nicoteles demands it. Rich (Angry) fund plot -> str 3, Whispers. Guard (Content) asks land on Ortygia. Family: Heloris brings the whisper.
Orders:
1. War: Leptines raids Carthage's tribute towns for grain and silver. d6 #1=1 +1 Bold +1 Carthage plague-weakened (13.114.2) = 3 FAIL. Driven off at the harbour, 5 ships lost, nothing taken. Clock +1 (attacked Carthage's towns). Fleet gives no grain next season.
2. War: land on Ortygia to the guard. Certain. Goal met: guard Content->Loyal, new goal citizenship.
3. City: levy on the rich "for the citadel". Assembly passes it gladly. d6 #2=3 +1 Silver-tongued +1 citizens back it -1 rich Angry = 4 SUCCESS: +3 silver. Promise logged: money is for the citadel. Citizens gesture roll #3=6: Uneasy->Content.
Silver 4+3=7. Clock 3->4. Sword: plot 3 Whispers, cannot strike.
Rule set: citadel = 2 orders (any seasons) + 4 silver; Philistus' offer halves the silver.

### T2 Season 2, winter 405/404
World: grain 6->4 (no fleet grain), silver 7-2=5, clock 4->5.
People: Aetna leader recruits #4=6 ok: the brother of Demarchus (executed by Dionysius, 13.96.3; role, unnamed) +1 -> 4, Rumors. Philistus: "You didn't need my money after all?" (grudge seed). Leptines wants to redeem himself.
Factions: Citizens Content, push land share. Rich Angry fund plot +1 -> 5 ("your walls with our money; our money to Aetna"). Guard Loyal, goal citizenship. Family: Polyxenus brings Rumors.
Defense 4+3=7 (+2 with citadel).
Orders (reading: citadel = 2 orders, Philistus = 3rd):
1-2. Build the citadel at full price. Certain. Silver 5-4=1. Citadel -> Dionysius. Levy promise kept. Government now reads TYRANNY (citadel+generalship+treasury).
3. Court: office for Philistus if he undermines the plot. Office = the mint (my pick; Jacob can swap). Spy roll #5=5 +1 Shrewd +1 rich insider = 7 SUCCESS: names the Aetna cavalry leader and Demarchus' brother; talks some families out of funding: plot 5->4.
Sword: plot 4 at Rumors, cannot strike.

### T2 Season 3, spring 404
World: grain 4-2+2 (Leptines' fleet repaired) = 4. Silver 1, guard owed 2 -> pays 1, ARREARS 1, silver 0. Clock 5->6.
People: Aetna leader recruits #6=5 ok: the guard captain (grudge: unpaid) +2 -> 6. Stage Named. Strike possible season 4.
Factions: Citizens Content push land. Rich Angry fund plot +1, cancelled by Philistus' undermining. Guard arrears: Loyal->Content, captain complains in public. Family: Thearides (Dutiful) passed over for the mint -> grudge, Uneasy.
Defense: 4+2 citadel = 6; +3 guard only if arrears paid.
Orders:
1. Court: marriage for Thearides into Hipparinus' house (invention), ask dowry. #7=6 +1 Silver-tongued +1 Hipparinus Patient = 8 OK: +2 silver. Family gesture #8=5: Uneasy->Content. Rich: marriage +1, torture -1 (below) -> net Angry->... see 3.
2. City: sell land and minor honours. #9=5 +1 Silver-tongued +1 citizens want land -1 rich Angry = 6 OK: +3 silver. Citizen gesture #10=3 fail ("he sells what he gave his friends free").
Silver 0+2+3=5, arrears paid 1 -> 4. Guard back-pay goal met: Content->Loyal, new goal citizenship.
3. Spies/War: arrest and torture plotters. Aetna leader out of reach. Demarchus' brother arrested #11=4 +1 Suspicious +1 guard Loyal = 6 OK. Torture #12=4: names the guard captain. Rich: noble tortured (-1), marriage into Hipparinus' house (+1): stays Angry.
Plot 6 -1 (brother taken) = 5. Sword: 5 < 6, cannot strike.

### T2 Season 4, summer 404
World: grain 4-2+6 = 8. Silver 4-2 = 2. Clock 6->7.
People: Aetna leader recruit #13=1 fails. Guard captain (Greedy, Brave) knows he was named.
Factions: Citizens Content. Rich Angry: last chance, fund plot +1 -> 6 (Named) -> CAN STRIKE this season. Guard Loyal, paid. Family Content: Polyxenus warns captain seen with Aetna men.
Defense 4+2+3 = 9. Plot 6+d6 must beat 9.
Orders:
1. City: feast + grain handout (8->6). Ruling: a real handout raises mood automatically (only words need a roll). Citizens Content->Loyal.
2. War: raid noble estates. #14=1 +1 guard Loyal -1 nobles forewarned = 1 FAIL. Silver hidden, nothing taken. Rich: property seized -> Rebellious.
3. War: pay and expand the guard, hire mercs (2 talents, guard str 3->4, upkeep now 3/season), citizenship for mercs. Guard goal met (stays Loyal). Citizens: foreigners made citizens -> Loyal->Content. Captain's grudge resolved? Ruling: member rolls to leave: #15=3 +1 citizenship -1 Greedy = 3, stays (he's named, no way back).
Silver 2->0.
SWORD CHECK: plot 6 + #16=2 = 8 vs defense 4+2 citadel+4 guard = 10. PLOT FAILS. Night of the feast, captain opens dockyard gate, Aetna riders caught in the market-place by new mercs (echo 13.113.2). Captain captured (#17=6). Aetna leader escapes. Plot exposed and broken. Street fighting this season.

### T2 Season 5, autumn 404
World: grain 6-2=4. Silver 0, guard owed 3 -> ARREARS 3. Clock: rules-as-written 7+1(fighting)+1 = 9 -> invasion next season. FINDING: baseline +1/season reaches 10 by season 8 in every game = broken result. Proposed: +1 per year (summer). Under that, clock = 2+1(summer 404)+1 raid+1 fighting = 5.
People: captain prisoner. Aetna leader beaten, licking wounds. Philistus suggests striking coin. Leptines wants command.
Factions: Citizens Content (land). Rich Rebellious: look for a leader -> approach Hipparinus (new plot, Whispers, str 2). Guard: arrears, leaderless, Loyal->Content. Family Content: Polyxenus brings whisper about Hipparinus.
Jacob didn't object -> clock now +1/year (summer). Clock = 5.
Orders:
1. City: Philistus strikes coin at the mint. +2 silver. Rich already Rebellious (floor). Paid 2 of 3 arrears -> owed 1. Silver 0.
2. Court: public execution of the captain. No roll. Ruling: guard unmoved (traitor caught in the act); plot recruiting -1 next season (fear).
3. War: army to Hipparinus' house to seize the rich ringleaders. #18=2 +0 = 2 FAIL . Ringleaders slip away; Hipparinus, undecided, now leads them. Thearides' father-in-law attacked -> family Content->Uneasy. Street fighting -> clock 5->6.
New plot: Hipparinus (+2) + Aetna leader (+2) = 4, Rumors next.

### T2 Season 6, winter 404/403
World: grain 4-2+2 (Leptines) = 4. Silver 0; guard owed 3 + 1 back = SECOND SEASON ARREARS. No summer clock tick: 6.
People: Philistus: pays the arrears if made keeper of the treasury. Nicoteles: "Arm the citizens; you won't need foreigners" (cf. Dionysius disarming citizens, 14.10.4). Thearides asks to be captain of the guard.
Factions: Citizens Content. Rich Rebellious fund plot +1 -> 5, Rumors. Guard: 2 seasons arrears -> sells loyalty to best bidder (auction resolves at the power step; the plot is bidding). Family Uneasy -> asks office (Thearides, captain).
Defense now 4+2 = 6 (guard unpaid, doesn't count).
Orders:
1. War: take Leontini (nearest city; autonomous under the 405 treaty, 13.114.1) and move its people to Syracuse (historical parallel 14.15.4, c. 403). #20=5, mods +1 terror/herald, -1 no siege engines (14.14.4), -1 unpaid guard, +1 Silver-tongued = 5 OK. +3 grain, +2 silver. Leontines become Syracusans. SCOPE NOTE: conquest is outside Phase 1 (no island); resolved abstractly. Rules gap: treaty breach doesn't move clock.
2. Embassy: trade treaty with Athens. Athens has just surrendered and is starving (13.107.4). #21=6 +1 -2 = 5 OK but small: +1 silver.
3. Court: titles and honours for the guard. #22=6 +1 -1 = 6 OK: they take honours for the last talent of back pay. Silver 3 paid toward 4 owed; honours cover the rest. Auction cancelled. Guard back-pay goal met: Content->Loyal.
Thearides passed over for captain again. Philistus' treasury offer declined (grudge seed).
Sword: plot 5, Rumors, can't strike.

### T2 Season 7, spring 403
World: grain 4+3-2 = 5. Silver 0, guard owed 3 -> arrears 1 -> Loyal->Content. Clock 6.
People: recruit #23=1 fail. Thearides passed over twice: family Uneasy->Angry, he leaves your dinner early. Hipparinus courts Philistus (whisper).
Factions: Citizens Content: want Leontini's land. Rich Rebellious fund +1 -> 6, NAMED: Hipparinus, the Aetna leader. Strike possible season 8. Guard Content, arrears 1. Family Angry.
Defense 4+2 = 6 (guard unpaid); 10 if paid.
FINDING: guard upkeep 3/season vs no steady income = structural deficit every season.
Orders:
1. Court+War: fleet from Leptines to Thearides (historical echo: 14.102.3, Leptines relieved, Thearides given the fleet). Thearides' goal met +1, Leptines stripped -1: family stays Angry. Raid on Carthage's towns #24=3 +1 Carthage still weak -1 Thearides untested = 3 FAIL. Ships lost; clock +1 -> 7.
2. City: steady tax on the people "against the Punic threat". Assembly (citizens) #25=2 +1 Silver-tongued +1 real Punic fear -1 tax on themselves = 3 FAIL. Blocked. Citizens Content->Uneasy.
3. Court: marriage (Leptines' daughter, cf. Philistus' later marriage to her in Plutarch Dion 11, unverified here) or adoption for Philistus. #26=1 +1 +1 Ambitious -1 grudge = 2 FAIL. "Ask me again when you can pay your soldiers."
Sword: plot 6 Named, can strike from season 8.

### T2 Season 8, summer 403
World: grain 5-2+6 = 9. Silver 0; guard 2nd season arrears -> for sale again, plot bidding. Clock 7+1 (summer) = 8.
People: Hipparinus recruits Philistus #27=4 OK (grudge: twice refused) +3 (holds the mint) -> plot 9. Hidden from Jacob except signs.
Factions: Citizens Uneasy, want Leontini land. Rich Rebellious fund. Guard for sale. Family Angry: Leptines (stripped of fleet) "prepares to replace" (line 2, ruler likely to fall) - whisper only.
Defense 6 (guard unpaid). Plot 9+d6 vs 6 -> will win unless Jacob acts.
Orders:
1. City: the tax again. #28=3 +1 Silver-tongued +1 Punic fear (clock 8) +1 full harvest -1 taxing themselves -1 refused last season = 4 OK. Steady +2 silver/season. Citizens: tax forced on them -> Uneasy->Angry.
2. City: mint coin. Philistus (holder) is away plotting. Ruling: with the citadel you can seize an absent holder's object, no roll. Mint -> Dionysius. Strike +2. Side effect: Philistus loses his holder weight (+3 -> +1): plot 9 -> 7.
3. War/Court: Leptines leads an army against Catana (traitor inside, cf. Arcesilaus 14.15.1). #30=6 (#29 spare) +1 Bold +1 traitor = 8 OK: +2 silver loot. Honour lands: family Angry->Uneasy. Leptines' choice #31=5: comes home loyal, for now.
Silver 0+2+2+2 = 6, paid all 6 owed. Guard: auction cancelled, back pay met -> Loyal. Defense 4+2+4 = 10.
SWORD: plot 7 + #32=1 = 8 vs 10. FAILS. Rich agents try the dockyard gate with bribes; guard paid that morning refuses. Exposed: Hipparinus, Philistus, the Aetna leader, the rich families' money.
FINDING: seizing an absent holder's object free may be too easy. Mint "each season" power needs wording (default strike unless declined).

### T2 Season 9, autumn 403
World: grain 9-2 = 7. Silver: +2 tax +2 mint (default) = 4, guard 3 -> 1. Clock 8.
Factions: Citizens Angry -> Nicoteles starts a citizens' plot against whoever holds most objects (you: 4 of 6). Whispers, str 2. Rich Rebellious, plot broken -> offer Carthage a deal: clock 8->9. Guard Loyal. Family Uneasy, Leptines home a hero.
Orders:
1. City: festival, grain handout 7->5. Automatic: citizens Angry->Uneasy. Ruling: Nicoteles' plot loses the citizens' backing while they're above Angry; he leads it alone, str 2.
2. War: attack Aetna (cf. 14.14.2, Dionysius takes the fortress). #33=5 +1 guard Loyal +1 exiles broken -1 mountain fortress = 6 OK. Cavalry leader killed (#34=3). Exiles scattered.
3. Spies/War: arrest Philistus, seize his wealth. #35=5 +1 Suspicious +1 guard -1 Shrewd = 6 OK. +3 silver. Philistus in chains (cf. his later exile, Plutarch Dion 11-12).
Silver 1+3 = 4. Sword: Nicoteles plot 2, Whispers, cannot strike.
Dice continue (Random(4040) #41-60): 6 1 5 3 4 2 2 3 4 5 2 1 3 1 3 3 4 5 5 3. Next unused #36.

### T2 Season 10, winter 403/402
World: grain 5-2+2 (fleet) = 5. Silver 4+2 tax+2 mint-3 guard = 5. Clock 9.
People: recruit #36=1 fail. Hipparinus (exposed, Patient) offers his daughter Aristomache in marriage for his life (Plutarch Dion 3: Dionysius married Aristomache, daughter of Hipparinus, and Doris of Locri on one day). Thearides pleads for his father-in-law.
Factions: Citizens Uneasy, want Leontini land. Rich Rebellious fund Nicoteles' plot +1 -> 3, Rumors (citizens and rich in the same houses). Guard Loyal, new goal: land at Leontini (clashes with citizens). Family Uneasy.
Defense 10.
Orders:
1. Court: marry Aristomache, daughter of Hipparinus. Certain. Family goal (mercy) met: Uneasy->Content. Rich gesture #37=6: Rebellious->Angry. Hipparinus bound by marriage.
2. City: Leontini farmland to the people. Goal met: citizens Uneasy->Content. Guard wanted the same land: Loyal->Content.
3. War: loot a Carthaginian tribute town (Selinus, tribute under 13.114.1). #38=5 = 5 OK, +3 silver. Attack on Carthage's towns: clock 9->10. CARTHAGE LANDS (next season). Test ends.
Sword: Nicoteles plot 3, Rumors, cannot strike.

### End state, winter 403/402
Dionysius alive, tyranny held from season 2 on (citadel, treasury, generalship, mint). Silver 8. Grain 5.
Counts: 1 tyranny (never fell), 3 plots (2 struck and failed, 1 at Rumors), deaths: guard captain executed, cavalry leader killed; 0 player deaths. Carthage war at season 10 (historically 397).
Rulings made in play (to write into rules): handouts automatic, words rolled; strike earliest season after Named; unpaid guard sold at auction at power step, player can outbid; members whose grudge is resolved roll to leave; with citadel, seize an absent holder's object free; plot loses a faction's backing when its mood rises above Angry; marriages as Court orders with dowry.
