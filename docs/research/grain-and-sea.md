# Grain and the sea (switch "convoys")

What the saved texts show about food moving by sea in Dionysius' wars, and about the men who carried it. The rule built on it (`data/convoys.json`, `src/core/convoys.ts`) is **invention**: every number, the season at sea, the contractor's honesty roll and the audit are ours. The patterns behind it are **history**, quoted below from the saved texts in the Phoenician-Punic World project (`sources/`). Each quote was opened and is checked by `node scripts/verify-cast-quotes.mjs ../phoenician-punic-world`.

## Transports carried an army's food (`transports`)
- Diodorus 14.47.7 (397 BC, Dionysius marching on Motya): he "was accompanied by not less than five hundred merchantmen loaded with great numbers of engines of war and all the other supplies needed".
- Diodorus 14.103.2 (a later campaign, against Rhegium and the Italiots, after the game's decade): "not less than three hundred vessels transporting food supplies".
- The numbers are Diodorus' and are round; the game does not use them. What it takes is the shape: a large army on the coast is fed from ships, not only from the land it stands on.

## Transports caught at sea (`interception`)
- Diodorus 14.55.2 to 14.55.3 (396 BC, Himilcon's crossing): Dionysius "dispatched Leptines with thirty triremes under orders to ram and destroy all he could intercept". Leptines sank the first ships, "but the rest, having all canvas spread and catching the wind with their sails, easily made their escape". This is the "single interception roll" already in scope (`intercept` in `src/core/carthage.ts`, 5 or more on a die); the switch uses the same roll for convoys.
- Diodorus 14.64.1 (396 BC, the siege of Syracuse): the Syracusans, "seeing by chance a vessel approaching laden with food, sailed out against it with five ships, seized it, and brought it to the city". In the game, Carthage's grain caught by your ships is brought into Syracuse.

## Carthage fed its army in Sicily by sea (`carthageGrain`)
- Diodorus 14.63.4 (396 BC, Himilcon before Syracuse): "He also dispatched merchant ships to Sardinia and Libya to secure grain and every kind of food."
- Before this switch, Carthage's ships fed its army in any port without a convoy (`src/core/island.ts`). With the switch, that grain sails from Carthage, takes a season, and can be caught.

## Supply decided where to fight (`supplyShapesWar`)
- Diodorus 14.55.5 (396 BC): Dionysius chose not to fight in the west "because he was widely separated from his allied cities and because the transport of his food supplies was reduced, to renew the war in other areas".
- Diodorus 14.96.1 (393 BC or so, after the decade; the year is not checked here): Magon, in hostile country, "was ever more and more in want of supplies", and the troops of Agyris "were continually cutting off the enemy's supplies".

## Warships escorted the provisions (`escort`)
- Diodorus 14.64.1 (396 BC): "Dionysius and Leptines had set out with warships to escort a supply of provisions". In the game, if the fleet's holder is friendly to you, your warships escort your convoys: Carthage needs 1 more to catch one.

## Men who carried the cargo kept some of it (`skimming`)
- Polyaenus, *Stratagems* 5.2.21 (Dionysius' raid on the temple at Pyrgi in Etruria, which modern writers usually put in 384 BC, after the game's decade; not checked here): "he was informed that the soldiers and sailors had stolen a thousand talents of gold". Single source, a late collector of stratagems (2nd century AD), and about plunder, not grain.
- Cicero, *Against Verres* 2.3.24 (70 BC, Roman Sicily, more than three centuries later): Verres "selected for his principal agent in distressing and plundering the fortunes of the cultivators of the land". The speech is about the men who contracted to collect Sicily's grain tithe and robbed both the farmers and the state.
- Neither passage is about Syracuse in 405 to 395. They show the pattern the rule uses (the men who handle a cargo or a grain contract keep some of it, and the ruler has to check), and they are labelled as parallels, not as evidence for the decade.

## What is invention
- That grain bought abroad, the fleet's winter grain and allies' surplus come as convoys a season later, and that the fleet's grain sails in winter.
- The contractors: heads of the rich houses of Syracuse from the generated cast (`src/core/census.ts`), all invented people. Their honesty roll (skim on 6 or more; greedy +1, dutiful -1, the rich families Angry or worse +1, got away with it before +1, audited lately -2) and the chance of an honest loss to seawater (a 1 on the same die). Selling a whole convoy to Carthage needs 8 or more, at war, with the rich Angry or worse.
- The audit and its price (the rich families' mood falls 1, cheat or not).
- Winter storms: a convoy that sails in winter sinks on a 1 and is held a season on a 2. No saved text gives a sailing season for these years; the idea that winter seas were dangerous is general and is not sourced here.
- Carthage's pay convoy each spring, and desertion (a sixth of the army) when the pay is caught, sunk or missing.
- Landings: the ports in `data/island.json` plus Gela and Acragas on the south coast. Leontini and Aetna are inland.
- Sizes: 2 months of grain a convoy, 1 silver for the contractor's fee, 1 silver of pay.

## Disagreements and gaps
- Diodorus' numbers of ships (five hundred, three hundred) are the kind modern historians treat as inflated; the game uses none of them.
- Who ran Syracuse's grain trade under Dionysius is not stated in the saved texts. Merchants and shipowners from the rich houses are a guess, labelled invention. A better source (on the Syracusan grain trade, or on contractors under the tyrants) would be worth asking Jacob to save; it is listed in `docs/later.md`.
- Whether Carthage paid its mercenaries in Sicily by shipping coin is not stated in the passages opened here; the pay convoy is invention.
