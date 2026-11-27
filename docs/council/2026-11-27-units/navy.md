# Seat: the navy (council on units, contingents and ground, 2026-11-27)

Statement as returned by the seat (a separate AI session), condensed lightly. Its words; not a decision. Added because Jacob asked for test 5 to include "maybe some navy" (2026-11-27). Quotes spot-checked by the thread in the saved Loeb Diodorus (14.60.2, 14.60.4, 14.64.3-4, 14.70.2) and the saved Aristotle `sources/sicily-tyrants/aristotle-politics-5.rackham.txt`.

## How ships work today
- Your side has no ships, only a seat: "the fleet" in `data/board.json`. A friendly holder brings 2 grain each winter and makes the raid action possible; a failed raid sets `fleetDamaged` for 3 seasons.
- Carthage has a number, `carthage.ships` (starts 4, cap 8, "Build ships"), needed to invade, reinforce, raid, hunt convoys and blockade (4+ stops a besieged port getting grain by sea).
- The only sea fight is one die, `intercept()` in `carthage.ts`: a friendly fleet sinks a quarter of a crossing army on 5+ (4+ with the great fleet). Convoys use the same roll; an escort adds 1.
- The battle plate has one ship modifier: "your ships threaten their beach camp", +1 in a port.

## Scope
`docs/scope.md` lists "naval battles beyond a single interception roll" as out. Proposals 1-5 and 7-8 fit the current scope; proposal 6 (the sea battle) needs the scope change. Without it, the interception roll is simply shown on the plate.

## History opened (Diodorus 14 unless marked)
- The fleet built 399-398: "quadriremes and quinqueremes, no ship of the latter size having yet been built at that time" (14.41.3); "to build more than two hundred ships and to refit the one hundred and ten he already had" (14.42.5). Round numbers, not for the game.
- Who rowed: "For half of the ships of war … the pilots, officers at the bow, and rowers were drawn from citizens, while for the rest of the vessels Dionysius hired mercenaries" (14.43.4). In 396 "Dionysius set free the slaves and manned sixty ships from their numbers" (14.58.1).
- Beached ships are prey (Motya, 397): Himilcon tried to "seize the vessels which were hauled up on land" (14.50.1); Dionysius "hauled his vessels over the land" (14.50.4).
- The interception roll's source: Leptines sank the first transports, "but the rest … easily made their escape" (14.55.3).
- Catana (396): the army on the shore so "ships in distress would be able to take refuge in the camp of the land forces" (14.59.6); Leptines ordered to "engage with his ships in close order, and not to break his line" (14.59.7); instead "with his thirty best vessels … in no cowardly fashion, but without prudence" (14.60.2); "the defeat suffered by the admiral raised the spirits of the Phoenicians and markedly discouraged the Sicilian Greeks" (14.60.4); captured ships "repaired" (14.60.7).
- The sea threat pins the army: "he ran the risk of losing the city if Magon should set out with his entire fleet against Syracuse" (14.61.2).
- Escorts and politics: "Dionysius and Leptines had set out with warships to escort a supply of provisions" (14.64.1); the Syracusans won alone, "thinking how often Dionysius had met defeat, whereas they, without his presence, had won a victory" (14.64.3), and talked of deposing him, "for up until then they had been without arms" (14.64.4).
- The allied admiral's choice: Pharacidas "was on friendly terms with the tyrant" and blocked the move for liberty (14.70.2).
- The Great Harbour (396): "all the warships joined in the attack" with the land attack (14.72.4); ships "drawn up on the beach" burnt (14.73.2).
- A parallel from Athens, not Syracuse: "the naval multitude, having been the cause of the victory off Salamis … made the democracy stronger" (Aristotle, Politics 5.1304a).
- Not used: ACOUP mentions rowers only in readers' comments. Leptines' later exile is not in the saved texts opened (his death, 15.17.1, is), so any falling-out with his brother is unverified.

## How games do it (seat's confidence in brackets)
Republic of Rome: war cards with land and naval strength and fleet support; beat the navy first; fleets cost upkeep (confident of the shape). Hannibal: Rome vs Carthage: Carthage rolls on a naval movement table and can fail (unsure of numbers). Commands & Colors: Ancients: no naval rules as far as known; its banner count is a shape to borrow. Imperator: ship types, sea battles, admirals with loyalty, blockades speed sieges (fairly sure). CK3: no sea combat, only transport (confident). Pax Pamir: no navy; roads let armies move (fairly sure). Arcs: damaged ships flip and are repaired; shipyards (fairly sure). Twilight Imperium: win the space battle before landing; ships carry ground forces; fleet-supply cap (confident). Sid Meier's Pirates!: crew morale falls with time and poor pay; unhappy crews leave (confident).

## Proposals: the smallest navy for test 5
1. **Fleets as objects with a size.** Syracuse gets squadrons (0-8, like Carthage's), each sound or damaged; repairs in harbour at 1 silver a season. The great fleet work adds squadrons instead of a flag. Inspired by: Arcs; 14.42.5. Medium.
2. **One standing order a season, set by the fleet seat's holder:** Watch the crossing, Escort, Carry, Blockade, Raid, Guard the harbour; his line on the seat card says which and why. Inspired by: Imperator fleet missions; 14.53.5 (Leptines ordered "to lie in wait"). Cheap.
3. **Carry:** the army sails port to port in one season if the fleet has squadrons equal to the army's size band. Inspired by: Republic of Rome fleet support, Twilight Imperium capacity, Pax Pamir roads; 14.56.2. Medium.
4. **Blockade for both sides:** your fleet stops sea grain to a besieged Motya or Panormus. Inspired by: Imperator; 14.48.3. Cheap.
5. **The sea threat holds the army at home:** while Carthage's fleet is at or above yours and your army is away, the city's fear rises, and a "come home" warning comes a season before a raid on Syracuse. Inspired by: 14.61.2, 14.57.1-3. Cheap.
6. **The sea battle as one plate step (needs the scope change).** Sound squadrons + the admiral's habit + one plan: close order (a loss by 1 becomes a draw) or strike ahead (+1, but a bold admiral's loss becomes a rout). +1 with your army on the shore, +2 against ships caught on the beach. The loser loses squadrons, more off a hostile shore; the winner keeps one captured squadron. Inspired by: Twilight Imperium, Commands & Colors banners; 14.59.6-7, 14.60.2-7, 14.50.1, 14.73.2. Medium.
7. **The admiral as a rival.** A sea victory by an admiral not you: +1 influence for him and bolder citizens ("without his presence"); a beaten admiral can lose the seat; an allied admiral sides with you or with liberty by his opinion. Inspired by: CK3 and Imperator commanders with loyalty; 14.64.3-4, 14.70.2. Cheap.
8. **Who rows, chosen when ships are manned:** citizens (free, but bolder and armed: 14.43.4, 14.64.4, Aristotle 5.1304a); mercenaries (1 silver a season per two squadrons; unpaid crews desert a squadron: Pirates!, Republic of Rome upkeep); freed slaves (emergency, 14.58.1; the rich families' anger is our invention). Cheap to medium.

## Cut
Ship types (no quadrireme or quinquereme pieces); wind and weather in the battle; Diodorus' ship numbers (inflated; 14.62.2 garbled).

## Our inventions
All numbers; the rich families' anger at freed slaves; the warning's timing; keeping a captured squadron.

## Example (with proposal 6, invented)
1. Magon's ships, 6 squadrons, put in at Catana. Your army stands on the shore.
2. Leptines holds the fleet with 5 squadrons. He is bold, and you ordered close order.
3. Roll: 4, +1 for the army on the shore, against Magon's 5. You lose by 1, which close order turns into a draw.
4. Both fleets pull back damaged. Leptines grumbles that you kept him on a leash.
5. Carthage cannot carry its army to Syracuse this season. You have one season to bring the army home.
