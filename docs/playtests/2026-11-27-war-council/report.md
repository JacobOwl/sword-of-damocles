# War council: AI testers play the Near-war test before Jacob

27 November 2026. Jacob: "Have a council test the war system before me." Report only: no rule, data or game code was changed. Rule changes are Jacob's call, as optional switches.

## What was played

- **1,500 bot games** of the Near-war test preset (test 4: spring 398 BC, 14 seasons, all four war switches on), 300 for each of five testers, fixed seeds, every game checked for broken states and replayed from its inputs. Script: `node scripts/war-council.ts --games 300`; tables in [council-runs.md](council-runs.md). The testers: **the warlord** (declares war at once, sets battle plans, reinforces, ravages, sacks Punic towns), **the defender** (fights only once Carthage lands), **the diplomat** (courts houses, embassies, offers peace, no army), **the exploit hunter** (one big army parked beside towns, ravages everything), **the turtle** (the careful bot alone). The existing bots never set a plan, ravage or reinforce; these do.
- **Two browser games** of the built page (seed 7) at desktop width (1280) and one at phone width (390), clicking through the war card, the town sheets, Muster, March from a town sheet, the battle plate, a battle, Carthage's landing and its peace offer.
- Also `npm run war-runs -- --seeds 200 --preset nearWarTest` (the careful bot): 0 crashes.

## Verdict

**The war has a face now, but it ends before it becomes a story, and it is still too easy.**

- **Fun and memorable: partly.** The best moments are real: Carthage declares war because *you* took Gela's tribute, Himilcon lands at Motya, the town sheet shows three named houses pulling three ways, a man slips out of Panormus at midnight to open a gate, Leptines asks to attack the van. The war chapter reads like a short history. But the arc is the same almost every game: Carthage lands, loses a battle or simply sits a season or two, is exhausted, and turns to peace within about 3 seasons of landing (in 76% to 100% of landings, depending on the tester). Then nothing happens for the second half of the 14 seasons.
- **Hard enough: no.** Every tester survives 85% to 95% of games, including a bot that never fights (the turtle, 93%). Carthage's council is already tired when it lands (plague, two seasons of war, an army kept in Sicily) and one lost battle with its general dead takes it to 9 of 10. Deaths come from the home front (Hipparinus, the exiles at Aetna), not from the war.
- **Understandable: mostly.** The war card, the town sheet and the plate are clear. Three things confuse: "6 in 6 next season" on a town sheet, the plate's odds that leave out tokens the battle then uses (a night march), and the guard shown "at your door" while it is with the army.
- **Exploits:** the one big army still wins towns by awe. A muster puts open towns within 6 days at 6 in 6 to come over; Gela and Acragas came over in the browser game without a blow, and Gela's going over is what made Carthage declare war. Ravage spam (the exploit hunter, 3.5 a game) did not break anything. No free action loops.

## Bugs (not rules)

1. **A general who fell in battle comes back to life.** Himilcon "falls in the battle" (status dead, `src/core/plate.ts`), then his beaten army is destroyed and `src/core/island.ts` (line 364) sets him to "disgraced": he "comes home to Carthage in disgrace", and next season "starves himself to death" a second time. Seen in the turtle's seed 2 and most games where the general falls. His army also keeps marching as "Himilcon's army" after he died.
2. **Peace terms promise more silver than they pay.** "Carthage pays you 4 silver" paid +2: `applyTerms` caps the payment at Carthage's treasury but the treaty text names the full amount (turtle seed 2, Summer 397 BC).
3. **The plate's odds leave out tokens.** The town sheet said "A battle: you win 28 in 100"; the battle then added "+1 a night march: your men rested last season" that the plate never showed, and the sides came out level. The plate also shows tokens "where it stands now", not where the battle will be.
4. **The guard is shown "paid, at your door" while it marches with the army** (header, `ui/app/shell.ts` line 124). Defense correctly drops; the label does not.
5. **The keeper's line disagrees with itself.** The muster form says Leptines adds +1 to your defense while you are away; the army line then says "Leptines keeps the citadel (your defense 0)" and the defense total shows no keeper token after the army leaves.
6. **The 398 opening keeps the 405 city notes.** Leontini (yours): "Free under the peace. Taking it breaks the treaty"; Messana (ally): "Free under the peace"; Gela and Acragas once yours: "Pays tribute to Carthage and may not rebuild its walls"; Aetna (yours) "hostile to you", "where the exiled horsemen hold out". The title page still says "405 to 395 BC" and opens with Autumn 405.
7. **A stale war matter.** "Carthage's army is close to Acragas, whose old walls have fallen down" fired the season after that army had been beaten and fled to Panormus.
8. **"Send The captain of the guard"** appears as its own man in the muster list beside Aristotle the Spartan, who holds the captaincy.
9. **"you 0 Indifferent"**: the muster form shows your own portrait with an opinion of yourself.
10. **Small text:** each season's summary opens "Spring 398 BC. Spring 398 BC." (the opening line starts with its own date); setting the plan and then the reserve logs two order lines; "A favour" petitions from Aristotle repeat every season ("the fifth time").

## Numbers that matter (300 games each)

| tester | survived | killed | crashes | broken | replay differs | wars | war, no landing | war, no battle | landings | battles (won/lost) | towns taken / lost | Motya taken | ravages | reinforcements | purges | gates opened | hungry seasons | silver at end | out of silver | towns at end |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| warlord | 88% | 12% | 0 | 0 | 0 | 1.89 | 0% | 20% | 1.17 | 1.52 (0.92/0.38) | 2.26 / 0.94 | 59% | 2.29 | 0.73 | 0.94 | 0.13 | 0.72 | 12.54 | 2% | 7.15 |
| defender | 95% | 5% | 0 | 0 | 0 | 1.69 | 1% | 7% | 1.13 | 2.09 (1.24/0.50) | 1.73 / 0.76 | 9% | 0.00 | 0.44 | 0.70 | 0.04 | 0.30 | 11.13 | 1% | 6.95 |
| diplomat | 85% | 15% | 0 | 0 | 0 | 1.92 | 0% | 93% | 1.26 | 0.08 (0.04/0.03) | 0.16 / 1.38 | 1% | 0.00 | 0.03 | 0.06 | 0.00 | 0.02 | 5.46 | 8% | 6.27 |
| doomstack | 84% | 16% | 0 | 0 | 0 | 1.86 | 1% | 9% | 1.06 | 1.82 (1.14/0.40) | 2.51 / 0.72 | 63% | 3.49 | 0.74 | 0.98 | 0.12 | 0.56 | 10.83 | 2% | 7.62 |
| turtle | 93% | 7% | 0 | 0 | 0 | 1.62 | 1% | 16% | 1.19 | 1.30 (0.74/0.42) | 1.64 / 1.06 | 6% | 0.00 | 0.00 | 0.73 | 0.08 | 0.25 | 9.89 | 3% | 6.65 |

- **Carthage leaves fast.** It lands in 99% to 100% of games, and from the landing to its council turning to "Peace at a price" (or the war's end) takes 1.9 to 3.0 seasons on average; 3 seasons or fewer in 76% to 100% of landings, for every tester.
- **The general's death is not the main cause:** Carthage's general dies within the first two battles in only 8% to 13% of games. Weariness is: it is high before the first battle.
- **Money bites a little:** 1% to 8% of games end with no silver; most end with 10 to 12.
- **Motya falls in 59% to 63% of games** for the two testers who go after it, under 10% for the others.
- **No crashes, no broken states, no replay differences** in 1,500 games.

## Fix list (report only; Jacob picks)

Starred are the top five. "Cheap" is an hour or less; "costly" is a session or more. Every rule change would be a new switch, off by default.

1. ★ **Carthage stays in the war longer** (rule, switch; cheap to build, needs a batch to judge). Its war weariness is near full before the first battle: plague (+2), +1 a season with an army in Sicily, +1 every two seasons of war, +2 a lost battle, +2 a fallen general. Options: start the war card's weariness after the plague is over, or count "army in Sicily" only after the first year, or let a new general take over without +2. Goal: Carthage's first expedition lasts a year or more and a second landing is possible inside 14 seasons.
2. ★ **No awe from a muster at Syracuse** (rule, switch; cheap). Open towns within 6 days of a fresh, unmoved army should not come over certain ("6 in 6"). For example: awe only counts an army that marched there, or caps awe-flips at one a season, or needs the town not to be divided. This is test 3's "one big army scares towns over", still there.
3. ★ **Fix the dead general and the treaty silver** (bugs 1 and 2; cheap, no rule change). These are the most visible errors in a war's story.
4. ★ **The plate shows every token the battle will use, at the place of the battle** (bug 3; cheap to moderate). Odds that are wrong break trust in the one screen built to explain battle.
5. **Generals fall less often** (rule, switch; cheap). A victory kills Carthage's general on a 1 in 6; it happens in about 1 game in 10 and adds +2 weariness. Lower priority than item 1.
6. ★ **Make the second half matter**: after peace, nothing happens for 6 to 8 seasons in most games. A great expedition (the pendulum) or Carthage's courting of towns could fire sooner after a peace. Costly; design.
7. **The war card's "aim met" comes too soon**: "Free the Greek cities" was met in one season by two towns coming over by awe. Tie it to holding them through a landing. Cheap, rule, switch.
8. **Header and keeper lines** (bugs 4, 5, 9). Cheap.
9. **The 398 city notes and title** (bug 6). Cheap: notes follow the side.
10. **Stale war matters** (bug 7): check the army is still there when the matter opens. Cheap.
11. **"6 in 6" wording**: say "certain" or "5 in 6" in words, as elsewhere. Cheap.
12. **The plate's die boxes are blank** before the battle; show each side's total ("7 + a die against 7 + a die"). Cheap.
13. **Phone: the map opens on the west half**, with Syracuse and your army off screen in a sideways-scrolling box; dragging the army inside a scrolling box is awkward. Scroll it to your army, or fit the map. Moderate. (Jacob plays on a computer.)
14. **Season summary noise** (bug 10). Cheap.
15. **The muster list's extra captain** (bug 8). Cheap.

## Questions for Jacob

- Should Carthage's first expedition last about a year, and should a second one come inside the 14 seasons?
- Should towns come over by awe at all, or only by embassy, gates and siege?
- Do you want the bugs fixed (cheap, no rule change) before you play test 4, and any of the starred rule switches on in the preset?
