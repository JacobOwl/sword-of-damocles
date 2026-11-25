# A thousand reigns: after action reports from the full game

Thread 29, 2026-11-25. Asked by Jacob: run a large batch of games with every mechanic on, pick about ten of the most interesting playthroughs, write them up like a magazine's pre-release after action reports, and say what the batch shows about weaknesses, repetition and loopholes. **Report only: no rules were changed.**

## What was run

1,008 headless games of the island game (Phase 2), 40 seasons each unless the reign ended sooner. Nothing crashed and the broken-state check found nothing.

| Set | Games | Rules |
|---|---|---|
| Full scope | 720 | Every optional rule switch on at once (17 of them: clues, blows can miss, escalation, coalition, story chronicle, feud record, armies break, council, secrets, bought retreat disgraces, false rumors, commission, dinners, great works, grain convoys, exile and return, Carthage's chronicle). 144 games for each of the five players. In every block of twenty seeds, ten use Standard balance and ten use Reap what you sow. |
| Begin fallen | 144 | The same switches plus "Begin fallen": you open in exile. 36 games each for four players. Reap what you sow. |
| Baseline | 144 | The "First island test" preset exactly as Jacob plays it, played by the careful ruler. |

**Who plays.** The game's five scripted players: the careful ruler, the patron, the iron hand, the careless ruler (random legal moves, a floor), and "Dionysius as Diodorus tells it". Each one follows a priority list. None of them plays like a person. They don't read the council, plan two seasons ahead, or try strange things on purpose. So the stats below show what simple strategies stumble into. A human player will find more.

**How to rerun.** `npm run aar-runs -- --seeds 144 --out dist/aar --json` (about four minutes). The same seeds give the same files byte for byte. `summary.md` in this folder is that run's numbers, and `games/` holds the full log of each game written up below.

**How I picked the ten.** The story-museum score (`data/story-shapes.json`) ranked all 864 full and fallen games. I read the top forty or so and chose for variety: different players, different endings, and stories driven by the people, the map and the exile rules. A high score alone wasn't enough. All ten games come from seeds 1 to 36, so every dossier is here in `games/` and can be replayed.

---

## The ten reports

### 1. "The Long Way Home": eighteen seasons in exile, and Syracuse won back with Carthage at the gates
*fallen-dionysius-05: Dionysius as Diodorus tells it, begins in exile. Survived the decade.*

The revolt of 404 comes early and works. "The army that rose at Herbessus and the cavalry from Aetna take the Island, and the leader of the exiles rules Syracuse." Our Dionysius takes Polyxenus' advice and rides for the Campanians at Entella with Heloris, Leptines, Doricus and Philistus, two talents of silver and two companies of hired men.

Then the new ruler starts picking off his friends inside the walls, one per season: "The leader of the exiles at Aetna has Andron seized. Your letters were found." Then Leptines, Hipparinus, Polyxenus and Thearides. Every season his hosts at Entella warn that the ruler's men "mean to strike soon". In Summer 403 they do: "Assassins sent by the leader of the exiles at Aetna find you at Entella. You live, wounded, because Doricus took the blade meant for you."

The money runs dry ("Your hired men go unpaid, and a company drifts away"). Then comes the twist. In Spring 401, Himilcon marches 30,000 men from Acragas to Syracuse and lays siege to it, and that same season the exile strikes: "You come home. The leader of the exiles at Aetna is taken alive in the citadel. Syracuse is yours again." You win back a city that is already under siege. That summer, plague breaks out in the camp before Syracuse. The usurper is put to death. Carthage turns to "Peace at a price".

The second half is a war of ups and downs. You win at Motya, lose at Panormus, and lose Philistus to fever in the camp. Your army is broken outside Syracuse, you take Gela back, and in the last year your old friend Heloris starts a plot against you.

**Why it's interesting.** This is the exile switch working as a whole arc: the fall, the purge of your friends, a hunt that warns before it strikes, the bodyguard who dies for you, and a return timed with Carthage. It was the highest-scoring begin-fallen game. **The warning sign:** the same hunt warning was printed 10 times in 18 exile seasons, word for word.

### 2. "The Empty Court": the iron hand kills everyone and wins
*full-tyrant-36: the iron hand, Standard balance. Survived the decade.*

This reign is a list of executions. Hipparinus plots with Nicoteles and Leptines in Autumn 404. All three are dead by spring. Hipparinus's daughter Aristomache becomes "your rival (Bereaved)" and joins the brother of Demarchus. Both die. Then Thearides, Theodorus, the leader of the exiles at Aetna, Heloris, Damon the smith, Aristotle the Spartan, Andron, your sister Theste and Doricus. By 396, fifteen named people have been put to death and there is barely a court left.

Meanwhile you take Gela, Acragas and Leontini ("The soldiers say that Decius was the first man to climb its wall", twice, at two different cities). The one man you can't catch is the captain of your own guard. He "slips through your guards and flees the city". His plot strikes in the last winter, 10 against your 6, and only wounds you, because the captain was leading it from outside the walls.

**Why it's interesting.** It reads like a horror story, and it points to the batch's clearest dominant strategy (see Findings). For the iron hand, killing more is safer: iron-hand reigns with eight or more executions survived the decade 43% of the time, and those with fewer than four survived 2% of the time.

### 3. "Three Falls and Two Comebacks": the careless ruler's very long decade
*full-careless-02: the careless ruler, Standard balance. Ended in exile at Rhegium; Leptines holds Syracuse.*

The careless ruler acts at random, and here that made a soap opera. He executes Heloris, exiles Polyxenus and his own brother Leptines, and seizes Theste. In Summer 402 a plot breaks into his house ("Hipparinus holds the treasury by force, and your house is plundered"). A year later the plotters seize the Island and he flees. A Persian satrap's agent pays him "a great sum, as Pharnabazus paid Hermocrates in his exile". In Spring 400 he strikes back: "You come home. Hipparinus escapes over the walls."

Hipparinus becomes his Nemesis. Then Leptines, back from exile, takes the Island in 399. The careless ruler returns again in 397 and executes Hipparinus, which turns Aristomache against him. In Autumn 396 Leptines throws him out a third time and rises to Nemesis. The decade ends with the ruler across the strait and his brother in the citadel.

**Why it's interesting.** Four changes of hands in one game, and he won the city back twice. It shows that a fall and a comeback can make a reign, not just end it. It also shows that the comeback may be too easy (see Findings: about two in five falls end in a return).

### 4. "My Brother's Keeper": Dionysius executes Leptines
*full-dionysius-06: Dionysius as Diodorus tells it, Standard balance. Survived the decade.*

Leptines marries his daughter to Philistus "without so much as telling you". He asks for the generalship twice and is refused twice. He becomes your rival, and then a letter shows him in his own plot. In Winter 404/403: "Your guards take Leptines. You have Leptines put to death." Then the game prints a line that should not exist: "Dionysius swears that Leptines's death will not be forgotten. The feud passes to him." You are Dionysius. You have just sworn revenge on yourself.

The rest is a hard but good reign. Nicoteles rises to Pretender and the assembly recalls you in Autumn 401. You come back three seasons later ("Nicoteles escapes over the walls"), and he spends the next five years spreading stories about you, every season. Three blows land and none kills you: two plunder your house and one "finds you, but not deep enough".

**Why it's interesting.** It has the best political arc in the batch (recall by the assembly, return, a lasting enemy who uses words rather than knives), and it shows the batch's most visible bug. See Findings, bug 1.

### 5. "The Father-in-Law": a marriage that bought nothing
*full-careless-10: the careless ruler, Standard balance. Killed in Winter 401/400 by Hipparinus.*

In season one: "You marry Aristomache. Hipparinus's house is bound to yours." Hipparinus lends you two silver. He then asks for the generalship and the treasury, is refused both, and "turns from asking to acting". He becomes your Nemesis within a year. Meanwhile the guard goes unpaid, and "Their loyalty is for sale" is printed 14 times in this game.

The council becomes a farce. You seat the leader of the exiles at Aetna, a pardoned enemy, as your sword. He and three other counsellors tell you seven times that Theste is plotting, and you exile her. Andron, keeper of the fortress, confesses that the same man "urged him to seize both while your back was turned", and you exile Andron too. Then you exile your wife. The blow comes from Hipparinus: the plot rolled 14 against your defense of 4.

**Why it's interesting.** Every piece is in the rules (marriage alliances, debts that become leverage, a lying council, an unpaid guard), and a random player strung them into a tragedy. It's one of the few games (2%) where the guard-for-sale shape fired.

### 6. "The Historian": Philistus turns
*full-careless-20: the careless ruler, Standard balance. Killed in Spring 398 by Philistus.*

Philistus is the most loyal man in the history books, so this one stings. Twice you have your men "empty the strongrooms of Philistus". You make him lead the army although he is not the general, and then try to arrest him in the field: "Philistus slips through your guards and flees the city. The army in the field has lost its leader." He throws your terms back twice and becomes your Nemesis.

Across the strait, Rhegium takes in your exiles, and Croton chooses Heloris as its general "because his hatred of you can be trusted". You win at Acragas and lose it the next season. Under torture, the musicians name Philistus among the plotters. The blow rolled 15 against 4.

**Why it's interesting.** The friend-who-turned story with a cause you can follow (you robbed him twice and humiliated him), and Italy's Greeks joining in through the Heloris events. **The odd note:** Philistus "lends you 2 silver" in Summer 401, while he is a hunted fugitive.

### 7. "Aristomache": the daughter who came back for her father
*fallen-tyrant-03: the iron hand, begins in exile. Survived the decade.*

You win the city back from exile within six months. You then execute Hipparinus, and "Aristomache becomes your rival (Bereaved)." Next you execute the brother of Demarchus, Theodorus and the leader of the exiles. Aristomache escapes your guards twice and rises to Nemesis. In Spring 401 her plot strikes with "+1 Bereaved" and a total of 16 against your 6: "The plotters seize the Island. You escape with your life and go into exile. Aristomache led them."

Two seasons later you are back, she is "taken alive in the citadel", and you have her put to death. Nicoteles, Philistus and Damon the smith follow.

**Why it's interesting.** The feud record at its best: the bereavement is named, it adds to the blow's strength, and it decides the ending of one exile and the start of the next. In the sources Aristomache becomes Dionysius' wife. Here she becomes his deadliest enemy, and the game makes it feel earned.

### 8. "Blackmail": a war of secrets lost in the market place
*full-careful-18: the careful ruler, Reap what you sow. Killed in Winter 397/396, trying to come home.*

The leader of the exiles at Aetna "comes to you alone. He knows that you staged the night alarm at Leontini that won you your bodyguard. He asks for the treasury, or the assembly hears of it." You let the petition lapse, so he tells the city. Over the next three years he tells it that your rumor set Nicoteles and Leptines against each other, that you "sent gifts to Carthage while your men fought her", and that you paid Nicoteles' servants to spy on him. You make his blackmail public, and his standing falls.

You hold a deadly secret on Nicoteles and use it four times: "You let Nicoteles know what you know." It doesn't save you. In Winter 398/397, "Nicoteles takes your place: the guard switches its backing to him." From Rhegium you gather the bones of the unburied dead, take Carthage's silver and Sparta's company, and hide armour for the citizens. The strike comes to 1: "You fall in the market place, as Hermocrates did when he tried to come home in 408."

**Why it's interesting.** Secrets cut both ways, with real consequences. It's the only top game where politics alone, with no knife, ends a reign, and the death in the market place echoes the sources. **The question it raises:** a hold used four times did nothing to stop the man it was held over (see Findings).

### 9. "The Careful Man Who Took Motya"
*full-careful-09: the careful ruler, Standard balance. Survived the decade.*

The careful ruler is supposed to be safe, but he lasts barely a year. His mercenaries are paid with "new silver, and it isn't yours", and the plot rolls 10 against 5. "You escape with your life and go into exile." He flees to Messana with Philistus, Heloris, Doricus and the captain of the guard, takes the Persian money, and is home within two years, with the usurper "taken alive in the citadel".

Then the careful ruler goes to war. He takes Acragas, besieges Panormus, and beats Himilcon at Motya while his army is hungry (9 against 8). He holds through a drawn second battle, sends heralds to the temples, and in Summer 399 hears: "Motya is yours. The soldiers say that Magius was the first man to climb its wall." That's two years after the real siege of 397, by a player who never set out to imitate Dionysius. The army is eventually lost ("1 battle won, 3 towns taken"), but the city holds.

**Why it's interesting.** The map story the island test was built for: supply by sea, sieges, a first man over the wall. And it came from the cautious player. Battles of this kind are rare (a battle won in the field happens in 19% of games).

### 10. "Seven Seasons": over before it began
*full-tyrant-02: the iron hand, Standard balance. Killed in Spring 403.*

The iron hand learns that Hipparinus is sworn into a plot, takes him and has him put to death in the same season. Aristomache becomes Bereaved. That same summer the blade "finds you, but not deep enough". The leader of the exiles flees and rises to Nemesis. The brother of Demarchus, refused the generalship twice ("the second time in public"), escapes the guards. In Spring 403 the plot strikes with "+1 Bereaved", 13 against 6, and the reign is over.

**Why it's interesting.** It's a short, clean tragedy, with every blow foreshadowed. It also stands for a pattern: 13% of full-scope and fallen reigns (112 of 864) are over in eight seasons or fewer: 40 of them the careless ruler's and 32 the iron hand's. A player who rules by fear can lose within two years, which is fair but may be harsh for a first game.

---

## Findings

### Bugs and oddities (found, not fixed)

1. **You can inherit a feud against yourself.** When you execute your own kin with the feud switch on, the game names *you* as the nearest kin: "Dionysius swears that Leptines's death will not be forgotten. The feud passes to him." It also fires for Heloris, Thearides and Theste, and it showed up in 38 of the 234 game logs kept. The cause is in `src/core/actions.ts` (execute): the dead man's kin list includes the player, and the game doesn't leave you out. The grudge and opinion loss also land on the player, unseen. I saw no later line where the player acts on the feud, but I didn't check every hidden effect. The fix is a one-line filter. Jacob's call whether a thread fixes it.
2. **The same line uses "him" for women.** "The feud passes to him" is printed for Theste. The pronoun field from thread 28 would fix this.
3. **The plot leader is named twice:** "Aristomache is in a plot against you, led by the brother of Demarchus. With him: the brother of Demarchus."
4. **A capital letter in the middle of a sentence** in the story chronicle: "Meanwhile, After the failed attack, Heloris would give out…"
5. **A political-rival line repeats itself:** "Thearides becomes a political rival (Heir)" two seasons running, with nothing in between.
6. **A fugitive lends you money.** Philistus "lends you 2 silver" while he is fled and hunted (game 6).
7. **A wound's reason line can be wrong.** With "Blows can miss", a blow that wins by 3 or 4 should cost you an office. If you hold none, or the leader strikes from outside the walls, it only wounds you, but the reason still says "it takes 3 or more to do worse than wound you". 40 of the 68 wounds in the kept logs won by 3 or 4. The rule may be right, but the explanation the player sees is not.
8. **One story shape never matches.** "The general home too popular" shows up in 0 of 864 games even with the commission switch on. Its search pattern was a guess (as the museum thread noted) and still doesn't match the commission's log line.

### Repetition

- **Every game opens the same way.** In 94% of games, the first council line is "Philistus says the brother of Demarchus is plotting against you." In 91%, "A general's offer" fires in the first season and the player sends silver. In 81%, "Blood in the agora" fires. The rich families' "cavalry come home" agenda completes in 83% to 94% of games, step by step in the same order.
- **Carthage follows the same script.** "Himilcon lands at Motya" (87%) and "The council gives Himilcon sole command" (88%) happen in nearly every game. The goals cycle through Rebuild, Guard the tribute, War and Quiet Libya. Libya rises in 87% of games. Carthage feels like a power with a routine, not a timer, but it's the same routine every time.
- **Exile lines repeat every season.** "Named: your hosts at Entella name the ruler's men, and say they mean to strike soon" comes up as often as 16 times in one game. "Your letters were found" (a friend seized) comes up as often as 9 times. "The hired men want pay. You choose: Promise them the plunder" comes up as often as 5 times. The Persian satrap's gift "as Pharnabazus paid Hermocrates" can come three times in one exile, and it cites the same passage each time.
- **Stock warning lines.** "Whispers: Your steward has nothing new, only a feeling" comes up as many as 46 times in a single patron game. Four stock "Whispers" lines each appear in 84% to 86% of games.
- **A spurned rival's rumors.** Nicoteles "planted a rumor" with the same sentence 11 seasons running in game 4. A rival with one grievance repeats it forever.
- **The most-repeated visible line** averages 19 times a game. The worst cases are the player's own actions: "You strike coin at the mint" (38 times) and "The assembly passes a levy on the rich families" (34).

### Loopholes and dominant strategies

1. **The rich families are free money once they hate you.** Striking coin gives +2 silver and costs the rich families one step of mood. The levy on the rich is +3 silver, can be raised again, and costs one step. Mood stops at the bottom (Rebellious) and can't fall further, so after that both actions are free silver every season. The iron hand and Dionysius players hold up to 32 silver. If the rich at Rebellious should still cost something, that's a rules choice.
2. **For a tyrant, killing more is safer.** Iron-hand reigns with eight or more executions survived 43% of the time. Those with fewer than four survived 2% of the time. Executing someone creates a Bereaved kin, but it also removes the plotter, and the cast doesn't refill fast enough for revenge to keep up. Game 2 ends with fifteen of the named cast dead and the ruler alive.
3. **The patron's petition spam.** The patron uses "Petition for support" 32 times a game (as many as 71) and survives 92% of the time (97% on Reap what you sow). It's the safest player in the batch, and it does almost the same thing every season.
4. **A deadly secret doesn't stop the man it's held over.** In game 8 the hold on Nicoteles was used four times, and he still took power through the guard. Either a hold should block a takeover, or the game should say why it didn't.
5. **Coming home is common.** 373 of 864 reigns saw at least one fall into exile. There were 608 falls and 253 returns, so about two in five falls ended in a return. 213 games saw at least one return, and 96 of the 144 begin-fallen games won the city back at least once. Only 73 deaths came from the ruler's hunters and 60 from a failed strike in the market place. Thread 28 tuned the hunt and that is Jacob's call. The point here: with exile on, a fall is often just a long detour.

### Balance as the scripted players see it (not tuned, reported)

| Player (full scope) | Survived the decade, Standard | Survived, Reap what you sow | Tyrannies a game |
|---|---|---|---|
| Careful ruler | 68% | 81% | 0.0 |
| Patron | 88% | 97% | 0.0 |
| Iron hand | 20% | 30% | 1.3 |
| Careless ruler | 9% | 16% | 0.0 |
| Dionysius as Diodorus | 31% | 50% | 1.7 |

- **With every switch on, the careful ruler and the patron almost never become tyrant (4 of 288 games). In the baseline preset, the careful ruler does in 52 of 144 games.** No single switch causes it. Turning any one switch off still gives 0 to 2 tyrannies in 20 games, and turning any one switch on alone gives 5 to 18. It looks like the bots' fault: with 17 switches, the extra actions crowd out the steps toward tyranny in the bots' priority lists. That's worth knowing before reading anything else about tyranny from all-switch runs.
- **The first ten seasons are often empty.** 27% of full-scope games have no story shape in seasons 1 to 10 (baseline: 33%). The patron's first ten seasons average 1.2 points against the iron hand's 3.9. Thread 19's question ("would you retell ten seasons?") still gets "not always" from the bots.
- **Carthage still almost never loses an army** (0.08 a game, even with "Beaten armies can break"). There are about half a battle and one Carthaginian siege of a city per game. 100 cities were stormed in 864 games.
- **Rare beats**: the city besieged and holding (1%), the guard for sale (2%), a city that turned twice (3%), plague in the enemy's camp (7%). "A blow from nowhere" never happened: every fatal blow was warned, as the design requires.
- **Who ends you**: the leader of the exiles at Aetna (147 reigns), the brother of Demarchus (68), Hipparinus (42), Leptines (29), Nicoteles (25) and Aristomache (25). The two men with a grudge from 405 end about a quarter of all reigns.
- **Dinners and great works barely show up.** Only two players host anything (the careless ruler and Dionysius, about once a game through their feast action), and the bots finish a great work 0.0 to 0.4 times a game. These two switches are nearly untested by this batch. Jacob's own play is the real test.

### What the bots can't tell us
They don't read the council's lies (they acted on a lie at most 1.1 times a game), they don't bargain with secrets on purpose, and they never try a sack, a fear surrender or a marriage plan. Any loophole that needs cleverness (for example, timing an exile strike for a Carthaginian siege, as game 1 did by luck) needs a person to find it.

## Questions for Jacob
1. **Fix the feud-against-yourself bug** (one line, plus "him" for women)? It's a bug rather than a rules change, but the call is yours.
2. **Free silver from the rich at the bottom of their mood:** keep it, or should striking coin and the levy cost something else once they are Rebellious?
3. **Purges pay for the tyrant.** Is that the story you want (the sources' Dionysius killed plenty and died in bed), or should mass execution have a cost that grows?
4. **The same opening every game** (Philistus's warning, the general's offer, Blood in the agora). Should the first-season events vary by seed?
5. **Exile lines that repeat every season.** Should they say something new each season, or only speak when the hunt changes rank?
