<!-- Council seat statement, 2026-11-27, thread 41. Written by a separate AI session given the brief in this folder (brief.md). Advice only. -->

THE BOARD-GAME DESIGNER: statement for the war and geopolitics focus

I read src/core/island.ts (battle, goOverMods, goingOver), data/island.json, the start of data/island-events.json, src/core/census-game.ts and data/census.json. One finding changes what is cheap here: **each town already has three census houses with a head, a standing and a role** ("the first man of Messana", "a shipowner of the strait", "a friend of Rhegium"). Events can already ask for a town's leader (`hasLeader`). So towns already have the people. What they lack is any politics: each house has no side of its own, and a town's side comes from one number (lean) plus one die roll. All game descriptions below are from memory of the games, not re-checked.

---

## 1. Towns as little boards (medium; replaces lean as a free number, and the 1-silver embassy roll)

**The idea from other games.** In Twilight Struggle (from memory) you control a country when your influence there beats the other side's by its stability number, and coups strike where the other side is thin. In Pax Pamir (from memory) loyalty is a visible object: cards are people placed in regions, and a coalition holds a region because its pieces sit there.

**For the game.** Each town sheet shows its three houses as three seats, like the contested board in src/core/board.ts. Each seat shows its head's name, his want, and one token: *for you*, *for Carthage* or *for the town alone*. The town's side follows the first man plus one other seat. Lean stops being a free number and becomes a summary of the seats.

**How you place influence.** Use actions that already exist: a dinner, a marriage, silver, a promise of land, or taking a son as a hostage. A hostage is history: the Campanians "had given hostages to Dionysius ... they were compelled to maintain the alliance ... although they would gladly have joined the Carthaginians" (Diodorus 14.61.6). Carthage places influence its own way (see section 4).

**Coups and betrayals.** When your army besieges a town and a house there holds your token, that house can open a gate. This is the Catana and Naxos pattern: "the general of the Catanians, had offered to betray the city to him" (14.15.1); Procles was "won over by great promises" (14.15.2). It turns the existing "A gate at midnight" event from luck into a result of what you set up. It works both ways: Carthage's tokens in your allied towns are the warning before a town goes over.

**Divided towns.** If all three seats hold different tokens, the town is *divided*. It sends no men and no silver, and the first army to arrive tips it. Messana did this: "they could not agree among themselves about the war" (14.56.3), with one party fleeing and another trusting an oracle (14.56.4-5).

**The town's own leader.** The first man has one want shown on his seat: land, revenge on a neighbour, a marriage, or to be left alone. Agyris was won "with the promise of ... a large portion of neighbouring territory" (14.95.6). Meeting a want flips a seat. Breaking a promise flips it back and is written in the chronicle.

**Why it fixes Gela.** When Carthage takes a town, it installs its friend as first man (a garrison of people, not of soldiers). Getting the town back means turning two houses, not winning one die roll.

## 2. A battle on one screen, with three choices (medium; replaces the single d6 and keeps the same numbers underneath)

**The idea from other games.** In Hannibal: Rome vs Carthage (from memory) battle cards make generals and attrition matter. Commands & Colors (from memory) splits the field into left, centre and right, and the cards you hold limit where you can act. I would take the feel of both, not the bulk.

**The battle screen.** It has three rows, resolved in two rounds, the clash and then the push.

1. **The plan.** Pick one of three:
   - *Hold the line*: safe, and a draw is likely.
   - *Strike a wing*: a bonus if you beat their weaker wing.
   - *A combined attack*: the biggest bonus, but each part rolls to arrive on time.

   The combined attack is the Gela battle of 405. Dionysius "divided his infantry into three groups" (13.109.4) and it failed because "the Sicilian Greeks ... came too late and the mercenaries with Dionysius encountered difficulties in making their way through the streets" (13.110.4). A player who loses this way can retell why.

2. **One stratagem card.** You get one to three cards, earned from the state of the game, never drawn at random:
   - *Night march*: your army did not move last season.
   - *Ships against the beach camp*: you have a fleet at sea.
   - *Cavalry screen*: the rich families are not Angry.
   - *Spend the troublemakers*: your guard is disloyal. At Syracuse, Dionysius sent ahead the mercenaries who had "engaged time and again in factional quarrels" and ordered the cavalry to "flee and leave the mercenaries in the lurch" (14.72.2-3). It wins the push, but your guard is gone and the citizens remember it.

3. **A reserve.** Hold back one strength point. It joins in round two only if you are losing, and turns a rout into a retreat.

**The general's risk.** A general who leads from the front adds +1, but sets off a sword-check warning ("you will stand in the front rank") before the roll, never after it.

**What Carthage shows.** Its general's habit is printed on the screen ("Himilcon fights from behind his camp"), so the choice is a read of the enemy, not a guess. The forecast still shows the odds for each plan.

## 3. Wars with aims, weariness and terms (medium; replaces "each keeps what it holds")

**The idea from other games.** In Republic of Rome (from memory) wars come out of a deck, grow when left alone, and a winning general becomes a danger at home. In Arcs (from memory) ambitions are declared publicly and then scored. In Here I Stand (from memory) a diplomacy phase sits between the fighting.

**For the game.**
- **War aims.** At the declaration, each side puts one *war aim* card on the board. Carthage's aims could be "keep the straits", "tribute from the Greek towns" or "punish Syracuse". Yours could be "drive them from the west" or "the Sicels for me". Your aim is a choice you make. The ultimatum was history: "unless they withdrew from the Greek cities" (14.47.1-2).
- **Weariness.** Each side has a *weariness* track, visible on the map. Seasons of war, lost battles and sacked towns fill it.
- **Peace terms.** Peace is offered when a track is full, and its terms come from the aims: towns ceded, an indemnity, hostages. The peace of about 383-376 shows that terms can run either way: Carthage gained Selinus and the land to the Halycus, and Dionysius paid 1,000 talents (Diodorus 15.17; ranges, per the brief's summary, which I have not re-opened).

**Why it fixes "I own most of the island".** Winning raises your aim's stakes, Carthage's anger and the weariness of your own citizens all at once. Holding everything costs you.

## 4. Sharper asymmetry (cheap to medium; it changes priority lists, not engines)

**The idea from other games.** In Root (from memory) the Eyrie must follow a public Decree, and falls into turmoil when it cannot. In Oath (from memory) the ruler holds the world while the others pull at it.

**Carthage.** Its goal each season is already a decree. Make it binding and visible: if it cannot carry out its decree, its blocs fall out of temper and the clock moves toward the Libyan revolt. That gives the player something to target: block the decree and Carthage turns on itself. Carthage is the sea, silver and mercenaries. It arrives late but in strength, and it holds the coast by kindness rather than by garrisons. Magon "treated kindly" the Sicels and took in Dionysius's victims (14.90.2-3, per the research card). In game terms, Carthage spends silver to place tokens in houses.

**You.** You have short marches inland, walls, fear and hostages. Your weakness is the citizens: they demand battle and leave if refused. "The Sicilian Greeks urged battle, he refused, they deserted" (14.61.1-3), and again in 14.96.2-4. Make that a visible track, *the levy wants battle*. It fills each season you avoid a fight, so waiting is a real cost.

**The result.** The two sides want different things on the map: Carthage wants ports, you want the interior and the houses.

## 5. Events from the state of the war, not a timer (cheap; data only, uses the existing event engine)

Each event is keyed on a visible state, with someone in the story taking the first step:
- **"The levy goes home for the harvest"**: the battle track is full and it is summer.
- **"A victorious general's welcome"**: your commander has won twice. He becomes a rival on the contested board (Republic of Rome's dangerous general).
- **"The secret bargain"**: Carthage's weariness is full and its army is trapped. This follows the 300 talents for safe passage, made "without the knowledge of the Syracusans" (14.75.1). Accepting buys peace and costs you with the citizens.
- **"A house asks your price"**: a divided town.
- **"Carthage's friend is first man now"**: a seat turned against you.

There are no popups with an obvious answer: each event costs something on both sides.

---

## Smaller points

- **Supply as objects (cheap).** Show food as baggage tokens on the army's shield, so a player can see it without reading a sentence.
- **Map controls.** Dragging armies is already on thread 39's list; I would not redesign it. One addition: the town sheet should show the three seats right beside "send your army". This answers the tabbing between map and actions: the town is where you decide.
- **Scope.** All of this fits inside eight cities and one Carthage. A war at sea, Italy and more towns are Phase 3.
- **Switches.** Every rule change here should be built as a switch, off by default, and Jacob decides.

## Top five, ranked

1. **Town boards from the existing census houses**, with seats, tokens, wants, gates opened from inside and divided towns (medium).
2. **War aims, weariness tracks and peace terms read from the aims** (medium). This is the fix for "fully in control by season 20".
3. **A one-screen battle**: plan, one earned stratagem card, a reserve, and the general's risk with a warning (medium).
4. **Carthage's binding decree and Carthage's way of buying influence, against your fear, hostages and a levy that wants battle** (cheap to medium).
5. **War-state events written as data**: the harvest desertion, the dangerous victor, the secret bargain, the house's price (cheap).

## What NOT to do

Do not build a tactical battlefield: no hexes, no unit-by-unit movement, no Commands & Colors-sized combat game inside the game. It would swallow the phase, it cannot be read on one screen, and it moves the story away from people and towns. The stories Jacob would retell are about who betrayed a gate and why. The battle should be three choices and a result you can explain.

No files were edited and nothing was committed.
