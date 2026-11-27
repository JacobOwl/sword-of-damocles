# Test 5: town contingents, ground and a small navy (council, 2026-11-27)

Thread 47. **A buildable spec for test 5, not yet built.** Jacob approved the test 5 plan ("ok do it", 2026-11-27): Carthage doesn't quit, battle scenes with turning points where the general's skill picks the ground and there is a reserve call, town contingents that fight worse, break or go home, a small navy, light diplomacy, about 20 seasons. This doc covers the ground and the general, the contingents and the navy. Thread 46 designs the battle scene format; thread 48 Carthage's will and diplomacy. Each part is a switch, off by default, on in the test 5 preset.

His words: "We should look into different unit types like cavalary and war elephants and stuff ... if our general is better and lucky he can set up good terrain." "Would having units be specfically aligned with towns be a good thing? Like 5k from Gela ... maybe they can backstab us or fight worst or break first if they don't like us as much? same for carthage?" "As a rule I prefer us being inspired by other games than you making up stuff. Look into real history and plausable stuff." "maybe some navy".

**How it was run.** A first draft (`docs/council/2026-11-27-units/first-draft.md`) went to five seats, each a separate AI session with the same brief (`brief.md`): a historian, a strategy video-game designer, a board-game designer, a player-and-story seat and a navy seat. Their statements are in `docs/council/2026-11-27-units/`. Every rule below names the game or passage behind it; **our invention** marks the rest. History card: `docs/research/units-and-ground.md` (every quote opened). All numbers are invention, counted not tuned.

## In five lines

1. **An army is up to five named contingents** ("Gela's levy under Athenagoras", "the guard", "the horsemen"), each with a heart: Steady, Wavering or Ready to leave, read from its town or faction. History gives at least ten armies that broke up by town or people in 406 to 393.
2. **Betrayal is a visible test, not a hidden minus.** Carthage puts an envoy on your weakest contingent a season ahead; when battle is joined it is tested, and you keep it only with a bond: hostages, pay, or its town's leading house as your friend (Sekigahara's loyalty challenge; the Campanians held by hostages, 14.61.6).
3. **The better general usually picks the ground, and luck sometimes overturns him.** One roll, then one ground card from the place's two or three ("River and plain", "Broken hills"). The ground mostly cancels horse and chariots; at a river, a big win in the roll catches the enemy half across (the sources are about being caught, not about crossing).
4. **A small navy:** a named fleet each side, counted in squadrons, with one order a season (watch, escort, carry, blockade), and one sea-battle scene. The admiral is a rival, and who rows is a political choice.
5. **No elephants in this decade** (first in Sicily: Pyrrhus about 278; Carthage's in 262, after the game ends). They go to the 289 campaign.

## Where the seats agreed

- Contingents with hearts are the centre (all five). Cap at five on screen; small bands merge into one "allied levies" token (video game, player).
- No counter table and no army builder (all). Arms are a tag that matters through the ground.
- "The horsemen are the rich families" is the best single idea (player, video game, board game, historian's sources: 13.112.3, 14.64.5).
- Cut the draft's general "win the ground roll by 3: +1 more" and its night-march rule for horse (video game, board game, historian: not in the passages).
- Two standing wishes, not three; "Keep to strong places" overlaps the plate's "Hold the line" (video game, board game).
- Siege engines out of this package (player, video game).
- One named turning moment per battle as the headline (player; it is also thread 46's "turn").

## Where they disagreed, and the call

- **Does a wavering contingent cost −1?** Video game: yes, like Total War's wavering units. Player and board game: no, a −1 nobody notices tells no story. **Call: no flat −1.** Wavering acts through the loyalty test, breaking first, and leaving. Fewer sums, more moments.
- **How a contingent leaves.** The draft had it leave at a season's start; the board game seat said two ways to vanish read as random. **Call: only by the envoy test, or by the drift-home rule already built**, both named and warned.
- **Refusing battle.** Video game: a priced fall-back with a rearguard (Warband). Board game: a roll (Hannibal: Rome vs Carthage's avoid battle). **Call: the roll, with the rearguard as its price on a success.**
- **Carthage's contingents too?** All yes; the player seat warned it makes an easy game easier. **Call: yes, and Carthage uses the same envoy on you from the first season of war.**

- **Rivers.** Video game: the loser of the roll pays −1 to cross (EU4). Historian: crossing is no penalty in itself (the Syracusans crossed the Himera and won, 13.87.1); being caught crossing is. **Call: the historian's version**, the only "win by 3" rule left.
- **Arms.** The historian showed "light troops" is not a sourced troop type here (Campanians served as horse and storming foot; Sicels as light troops is invention). **Call: three arms (heavy foot, horse, chariots); the broken-ground bonus goes to whoever knows the land**, not to a troop type.

## Part 1. Contingents (switch `contingents`)

**Data.** `Army.parts: Part[]` replaces the single `men` and `guard` numbers (both stay as sums for old code). A part: `home` (a town, a faction or a people), `men` (strength points), `arm` (heavy, horse, chariots), `leader` (a person id or a Carthaginian), `heart` (steady, wavering, leaving), `why` (one plain line), `envoy?` (who has an envoy on it), `bond?` (hostage, paid, friend). Display names live in data, never ids on screen.

**Mustering.** The muster already lists its sources; now each becomes a part: the citizens' levy (heavy), each allied town's levy (heavy, led by the head of its leading census house), the guard (heavy, led by the captain of the guard), and **the horsemen** (horse, one point, led by a rich-family man, only if the rich families are not Angry). Carthage's army musters Libyans, Iberians and Campanians (heavy; Campanians may be horse, 13.44.2), Sicels if any Sicel town is Carthage's, its horse, chariots (Ephorus' muster, 14.54.5), and sometimes **the Carthaginian citizens**, picked and rich: if they are destroyed, Carthage's council swears off risking citizens (16.80.4, 16.81.3-4; thread 48 owns the council's reaction).
- Inspired by: CK3 and Imperator levies by holding; Bannerlord's army of named parties; Sekigahara's blocks bearing their clan's mon. History: "the levy from Camarina, then those of Gela and Acragas" (14.47.6); armour "of his people" for each nation (14.41.4-5).

**Hearts (read, never rolled; shown as a word with its reason).**
- Town levy: the town's lean and its leading house (town boards). Steady at lean 1 or more, Wavering at 0 or −1, Ready to leave at −2 or less or if the leading house is Carthage's friend.
- Citizens' levy and guard: their faction's mood (Wavering at Uneasy, Ready to leave at Angry); hungry or unpaid makes any part Wavering.
- **The horsemen: the rich families' mood** (an inference, labelled: the sources show the cavalry acting as one political body, not who they were). You want horse for the plains, but taking them to war puts your enemies under arms (13.112.3: the horsemen waited to kill Dionysius on the road; 14.64.5: Theodorus "held in high esteem among the cavalry").
- Mercenaries (the guard, Carthage's Iberians and Campanians): pay. Unpaid one season, Wavering; two, Ready to leave ("threatened to go over to the enemy", 13.88.2; "a thousand men did go off", 16.78.5-16.79.1).
- Carthage's other parts: the Libyan subjects' mood for the Libyans, the Sicel towns for Sicels.
- Inspired by: CK3 clan vassals, whose levies scale with opinion; Battle Brothers' morale states; Root's relationship track (three steps).

**The envoy and the loyalty test.**
1. At the start of a season at war, Carthage's bot puts one envoy on your worst-hearted part in reach of its army, and says so: "Himilcon's envoys are in the Sicels' camp." You may do the same on Carthage's army with a new order, *Send an envoy* (1 silver), on a Wavering or Leaving part.
2. You answer with a **bond**, each one an existing or new order: *Take hostages* from that town (its lean −1; a named person waits in the citadel), *Pay them* (1 silver, this season), or court its leading house (town boards). A town whose best men march in your army is itself held: its levy counts as a bond for the town ("had sent their choicest troops to Syracuse", 14.61.6).
3. When battle is joined, each part with an envoy and no bond **turns**: it fights for the other side in this battle (its strength moves across), then goes home, and its town leans one step to the side it joined. A part with a bond holds, and its bond is named in the turning-moment line.
- Inspired by: Sekigahara's Loyalty Challenge (a block turns unless its owner shows a matching card; here it does not turn back, because in the sources it doesn't), shown face-up because a death must never feel random. History: the Sicels "went over in a body" (14.58.1); the Campanians "had given hostages to Dionysius ... they were compelled to maintain the alliance ... although they would gladly have joined the Carthaginians" (14.61.6).

**Breaking first.** In a lost battle or a draw, the worst-hearted part breaks first and takes half the loss; its leader may fall (the plate's 1 in 6). In a won battle, a Wavering part that held turns Steady and its town's lean rises one (**our invention**).
- Inspired by: CK2's separate flanks; Total War's chain rout; Sekigahara's losses to defected blocks first (8.7.2). History: Gela 405 (13.110.5-6, 13.112.3); Leptines' wing at Cronium (15.17.1-2, a later pattern).

**Before their own walls.** A town levy fighting at its own town: +1 ("as spectators on the walls parents and children", 13.60.4; "because of their knowledge of the land", 13.108.7).

**Far from home.** A town levy outside its own part of the island goes home at the end of the season unless paid (1 silver), named in the drift-home line.
- Inspired by: Hannibal: Rome vs Carthage, where independent allies "are not available outside of their own provinces" (14.2.3.3). History: the allies' "time agreed upon for the campaign had elapsed" (13.88.7).

**Towns remember, and news spreads.** Each part that turned, broke or held leaves one line on its town's sheet ("Gela's men broke at the river, Summer 397") that events can read. A lost battle also reaches the towns near the field, not only the home towns (the built town-news rule, widened: 14.88.5, 19.110.3-4).
- Inspired by: Dwarf Fortress legends; King of Dragon Pass clans remembering you.

**Cost: medium** (the army becomes a list: losses, retreat, reinforce, save files, bots). Display cheap after.

## Part 2. Ground and the general (switch `groundChoice`)

**Data.** Each place in `data/island.json` gets two or three ground cards: name, one line it favours, one it hurts. Sourced where a passage names the ground (Gela's river, 13.109.5; Syracuse's marsh, 14.70.5); the rest invention, marked. Suggested: Syracuse *Marsh by the harbour, Epipolae heights, Shore*; Gela *River and plain, Shore*; Acragas *Broken hills, River*; Leontini *Open plain, River*; Catana *Shore, Lava fields*; Messana *Shore, Hills*; Motya *Shore*; Panormus *Shore, Hills*; Aetna *Broken hills, Pass*. Roads use the place where the armies meet.

**The ground roll.** Before the clash each general rolls:
> d6 + the general's skill (his traits, as now, capped at 2) + 1 in friendly land or with a local ally + 1 if his army has horse (scouts; weakly sourced, 13.54.3)

The higher roll picks the card: yours by your **standing wish** on the plate (*Seek open ground* or *Seek broken ground*), Carthage's by its general's habit (bold: open, careful: broken). A tie: the first card. One line explains: "Himilcon outmarched you and chose the river and plain. His chariots like it; your Sicels do not."
- Inspired by: CK3's advantage from commander and terrain before the dice; Hannibal: Rome vs Carthage's one battle rating used in every roll; De Bellis Antiquitatis' invader and defender (unverified, see the video-game seat's note). History: Agyris' men, "familiar with the territory" (14.96.1).

**What the ground does (mostly cancels).**
- Open plain: horse +1; chariots cancel the enemy's horse bonus (the one chariot action described is a screen against horse on open ground, Timoleon 27).
- Broken hills or a pass: horse and chariots give nothing; the side that knows the land (friendly ground or a local ally) +1 (14.96.1).
- River: if the ground roll was won by 3 or more, the loser is **caught half across**: −2 to him, and the line says so ("a third of his army is still crossing"). Otherwise no effect. History: "the phalanx of the enemy was sundered by the river" (Timoleon 27); "ten thousand of the enemy had already crossed" (16.79.5); counter-case 13.87.1.
- Marsh: horse gives nothing; a camp there sickens (the plague rule, already built).
- Shore: your ships' stratagem applies (built), and a fleet at hand saves a beaten army's men (Part 3).
- Inspired by: Commands & Colors: Ancients terrain, which caps dice ("Mounted units roll a maximum of 2 battle dice ... downhill"); EU4, where the better manoeuvring general escapes the river-crossing penalty (softened to "caught crossing" by the historian). History: 13.109.5, 14.96.1.

**Refusing battle.** When an enemy army reaches yours, a new choice on the plate: *Refuse battle*. Roll d6 + your general's skill − theirs: 4 or more, fall back one stop and your worst-hearted part covers the retreat (a sixth lost); less, you fight anyway at −1. Either way every allied levy turns one step worse ("angered at his unwillingness to encounter the enemy"). It has a payoff too: an enemy kept waiting in your land runs short (the waiting game at the Chrysas ended in peace and Tauromenium, 14.96.3-4; the built supply rules already do this).
- Inspired by: Hannibal: Rome vs Carthage's Avoid Land Battle (a failed avoid costs a battle card); Warband's leaving troops behind to escape. History: 14.61.3, 14.96.2.

**The reserve call** is thread 46's turn; the reserve is already built on the plate.

**Pursuit (data for thread 46's pursuit stage).** After a win: *Pursue hard* (the loser loses a sixth more, a third more with horse on open ground; but if the loser kept a reserve, your pursuers are caught in disorder and you lose a sixth) or *Hold the field*. A loser that reaches its ships on a shore loses a sixth less. History: Himera, Hannibal "caught the Himeraeans in disorder as they were pushing the pursuit" (13.60.6); "he remembered also how the Himeraeans had been utterly destroyed" (13.87.2); "the crews of the ships held back the pursuers" (13.110.5).

**Arms in short.** Three tags: heavy foot (no rule), horse (+1 on open ground, +1 to the ground roll, harder pursuit), chariots (Carthage only, cancel enemy horse on open ground). Inspired by: Imperator's per-type terrain modifiers, cut to three by the historian's reading.

**Cost: small to medium.**

## Part 3. A small navy (switch `fleets`)

**Scope.** `docs/scope.md` had "naval battles beyond a single interception roll" out. Jacob asked for "maybe some navy" in test 5 and approved the plan; scope.md now says so.

**Fleets as objects.** Each side has one named fleet ("your fleet under Leptines", "Magon's fleet"), counted in squadrons 0 to 8 (Carthage's `ships` becomes its fleet), each sound or damaged. Damaged squadrons mend in a friendly port, one a season for 1 silver. The great-fleet work adds squadrons.
- Inspired by: Arcs (damaged ships flip and are repaired); Republic of Rome fleets as counters with upkeep. History: "to build more than two hundred ships and to refit the one hundred and ten he already had" (14.42.5).

**One order a season, set by the fleet seat's holder** (you, if you hold it; else he chooses, with his reason on the seat card):
- *Watch the crossing*: the interception roll (built) against Carthage's crossings and convoys.
- *Escort the grain*: the convoy escort (built).
- *Carry the army*: your army sails port to port in one season instead of marching, if the fleet has squadrons at least the army's strength ÷ 2. This is **the crossing**: an enemy fleet watching that lane intercepts, and if it does, a sea battle is fought first.
- *Blockade*: a besieged enemy port gets no grain by sea (as Carthage already can on yours).
- Inspired by: Imperator's fleet missions; Republic of Rome's fleet support for overseas legions; Twilight Imperium's win the sea before you land. History: Leptines ordered "to lie in wait" (14.53.5); the escort of provisions (14.64.1).

**The sea threat holds the army home.** While Carthage's fleet is at least yours and your army is away, a warning a season ahead: "Magon's fleet could be off Syracuse next season." History: "he ran the risk of losing the city if Magon should set out with his entire fleet against Syracuse" (14.61.2); Messana taken from the sea (14.57.1-3).

**The sea battle (one scene, the plate's shape).** Each side: d6 + sound squadrons ÷ 2 + the admiral's traits (capped at 2) + 1 if its army stands on that shore + 2 against ships caught beached. One plan: *Close order* (a loss by 1 is a draw) or *Strike ahead* (+1, but a loss is a rout: twice the squadrons lost). The loser loses a third of its squadrons (half off a hostile shore); the winner takes one as a prize.
- Inspired by: the battle plate's own plan and habit lines; Commands & Colors' banner count. History: Catana, 396, Leptines ordered to "engage with his ships in close order, and not to break his line" (14.59.7) but went ahead "in no cowardly fashion, but without prudence" (14.60.2); the army on the shore as refuge (14.59.6); beached ships burnt (14.50.1, 14.73.2); captured ships "repaired" (14.60.7).

**The admiral as a rival.** A sea victory won by an admiral who is not you: he gains standing and the citizens grow bolder against you ("without his presence, had won a victory", 14.64.3-4). A beaten admiral can lose the seat as a beaten general does. Inspired by: CK3 and Imperator's commanders with loyalty; the contested board (built).

**Who rows** (chosen when squadrons are manned): *citizens* (free, but the citizens are armed and bolder: 14.43.4, 14.64.4; Aristotle, Politics 5.1304a, of Athens), *mercenaries* (1 silver a season per two squadrons; unpaid, a squadron deserts: Sid Meier's Pirates! crews, Republic of Rome upkeep), *freed slaves* (an emergency, 14.58.1; the rich families' anger is our invention).

**Cut:** ship types (no quadrireme pieces; the great fleet stands for them), wind and weather, Diodorus' ship numbers. **Cost: medium.**

## For thread 46 (scenes) and thread 48 (Carthage, diplomacy)

- The battle scene reads, per stage (ground, plan, clash, pursuit): the ground card's name and its one line; each part's display name, side and state (held, wavered, turned, broke, went home); the turning moment as one sentence, with its reason; each modifier. A battle Carthage starts uses the standing wish, so no choice is needed mid-season.
- Thread 48 can use: **the fleet** (a named object with squadrons and an admiral), **the crossing** (Carry the army, interceptable, a sea battle first if intercepted), a fleet beached at a landing (+2 to an enemy that catches it, as at Motya), and allied squadrons (Pharacidas' ships, 14.63.4) as a second part of your fleet with its own heart.

## Build order for test 5

1. `contingents` (medium): parts, hearts, the horsemen, the envoy and the bond, breaking first, far from home, town memory lines. Carthage's parts in the same step.
2. `groundChoice` (small to medium): ground cards in data, the roll, two wishes, refuse battle, the four arms.
3. `fleets` (medium): the fleet object, orders, the crossing, blockade, the warning, the sea battle, the admiral, rowers.
Each gets counted with `npm run war-runs` (deaths, battles, turned parts, sea battles) and reported, not tuned to history.

## Parked (to `docs/later.md`)

Siege engines as their own switch (the catapult, 14.42.1; Carthage's towers and rams, 13.55.7, 13.108.8); the hill without water (Elleporus, 14.105.1-4; Cabala, 15.15.3: a beaten army trapped, and mercy as a political choice); a false-report stratagem that sends an enemy contingent home (Plutarch, Dion 27); Greek mercenaries on both sides talking (Timoleon 20); paying mercenaries in land (14.78.2-3, already parked as "Pay in land"); weather (the Crimisus storm, 16.80.1); hiring the beaten enemy's mercenaries (the Iberians, 14.75.8-9; the mercenary market is out of scope); veterans loyal to their general (Republic of Rome's legion allegiance); a "Battles" list of cards (player seat P5, if thread 46's scenes don't already keep one); elephants for the 289 campaign (Pyrrhus, Diodorus 22.8.2, 22.10.2; Commands & Colors' rampage).
