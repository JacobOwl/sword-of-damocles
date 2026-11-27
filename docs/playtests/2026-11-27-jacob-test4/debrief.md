# Test 4 (the Near-war test): Jacob's game, read from the save

27 November 2026. Jacob played the Near-war test on the test link (version 26, build 21c11dc), seed 828582, and stopped after six seasons (Spring 398 to Summer 397 BC) of fourteen: "I think I'm basically done with this save." The save is [save.json](save.json); `npm run replay-save -- docs/playtests/2026-11-27-jacob-test4/save.json --log` replays it exactly (digest 365403030776e61a). The end-of-test check-in was left empty, so his views below are only what he wrote in the thread. Report only: nothing was changed.

## What happened

- **Spring 398.** He gave the guard houses and citizenship, bought Philistus's ruined estates, outbid Carthage for Messana, and passed a tax on the people and harbour dues. The citizens and the rich families both went Rebellious in the first season. The guard went from power 4 to 10.
- **Summer 398.** Carthage declared war (its anger had reached 7, and its blocs were readier for war because he held four towns). He chose the aim "Free the Greek cities", hired men, mustered about 60,000 men with the guard, Leptines keeping the citadel, and marched on Gela, which has no walls and opened its gates.
- **Autumn 398.** He marched to Acragas, which came over without a blow (awe of his army counted, since it had marched there). His war aim was met. Carthage warned that 30,000 men would land.
- **Winter 398/397.** Himilcon landed at Motya with about 55,000 men. Jacob seized the merchant Synalus's ships (Carthage's anger 10), set a combined attack as his battle plan, and handed out grain.
- **Spring 397.** Himilcon marched on Gela and met Jacob's army at Acragas: Carthage 11, Jacob 16, a win. Jacob did not know this battle happened. He then fed Himilcon a false report through Pacuvius (Carthage lost its food and 5,000 men), paid the restless army his last 2 silver, and marched on Panormus: a second win (11 to 5, even with part of the combined attack late). Himilcon's army was destroyed, and Carthage's weariness went to 10 of 10.
- **Summer 397.** Plague in the siege camp at Panormus killed 20,000 of the levy. He let Messana's men go home, and the army broke up. Carthage offered peace; he sent the envoys back and got 2 silver, with each side keeping what it holds. At home both factions are Rebellious, Nicoteles is a political rival, two plots are at Rumors and Whispers, and Syracuse's war weariness is 8 of 10.

## Verdict

- **The war worked as a story, but it was over in a year.** It had the right beats: a cause (Gela), an aim, a landing, a trick, two battles, a plague and a peace. But Carthage was out four seasons after declaring war and two after landing, and Jacob stopped the game a season later. The council's finding holds even with `carthageStays` on: a destroyed army (+3 weariness) ends Carthage's war at once.
- **It was easy again.** Two wins out of two. In both battles his side's bonuses outweighed Carthage's (at Acragas, +5 in bonuses against Carthage's +1: home ground, leading in person, a combined attack and a night march). His dangers came from home, as in the council's games.
- **The most important battle was invisible.** Carthage started the battle at Acragas during the season. It showed only as one line in the season summary, so Jacob thought he had only taken the city.
- **Moving the army was unclear at first.** He tried to drag the army to march it. Dragging only previews the march; the town sheet's March button gives the order (one action).

## Bugs and confusions found in the save

1. **The battle Carthage starts against you has no moment of its own** (Spring 397, Acragas). One line in the summary. Parked in `docs/later.md`; thread 46 is designing big event scenes.
2. **"The army wants battle" came right after a victory.** It is fired in the war step before Carthage's march and the battle (`src/core/war.ts` line 340, `maybeMatters`), so Jacob paid his last 2 silver to keep an army that had just won.
3. **The landing warning gave the wrong size.** "About 30,000 men under Himilcon will land" (Autumn 398); 55,000 landed. The warning counts the men before that season's hiring and the Libyan levy (`src/core/war.ts` line 221).
4. **"You's hold on the generalship: New."** The seat-hold line uses "'s" after "You" and "his place" for the player (`src/core/board.ts` lines 111 and 421). In the same season the hold drops to New for being away, then rises to Settled for "another year held without a loss".
5. **Philistus becomes a rival and stops being one in the same season** (Spring 397): refused the treasury, then "no longer your rival (his opinion of you reached 2)". Two contradictory lines.
6. **The war aim was met before Carthage landed** (Autumn 398, two towns came over). Council fix item 7, still there.
7. **Peace after destroying Carthage's army paid 2 silver and nothing else.** The terms are read from the war's ledger and capped at Carthage's silver; after a destroyed army and a siege of Panormus they feel small. A rules question, not a bug.

## Fix list (report only; Jacob picks)

Starred are the top five. Every rule change would be a new switch, off by default.

1. ★ **A battle you fight gets its own scene**: the plate, the rolls and the result after the season, whoever started it. Being designed in thread 46 (big event scenes). Moderate.
2. ★ **Carthage does not leave after one lost army**: a destroyed army sends a second general and fresh hired men while Carthage has silver, and peace waits on its silver or a second defeat. Rule, switch; cheap to build, needs a batch to judge.
3. ★ **Battles closer to even**: the player's bonuses stack (home ground, leading, combined attack, night march, a Loyal guard). Options: cap the stacking at +3, or give Carthage's general the same plan choices. Rule, switch; cheap.
4. ★ **Fix "the army wants battle" after a battle** (bug 2) **and the landing size** (bug 3). Cheap.
5. ★ **Say on the map that dragging only previews the march**, or let the drop give the order with a confirm. Cheap. Parked in `docs/later.md`.
6. **"You's hold" wording and the same-season New/Settled flip** (bug 4). Cheap.
7. **A rival for less than one season** (bug 5): only announce a rival who is still one at the end of the step. Cheap.
8. **The war aim met before the landing** (bug 6; council item 7). Cheap, rule, switch.
9. **Peace terms worth winning** (item 7): a destroyed army could cost Carthage a town or its tribute towns, not just silver. Rule, switch; design.

## Ideas Jacob raised during the test (each has its own thread)

- Big pop-up event scenes for battles, serious plots and crises, perhaps in several parts (thread 46, design).
- Unit types (cavalry, war elephants) and terrain that a better, luckier general can choose (new thread, design).

## Questions for Jacob

- Did the war feel too short? (The save says it lasted four seasons.)
- Why did you stop after six seasons: was there nothing left to do once peace came?
