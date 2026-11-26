# Debrief: Jacob's second island test (2026-11-26)

His words are in `notes.md` and come first. This file is the replay: what happened in his game, why he died, and what the test says. Report only: nothing here is built. Thread 38.

**Save:** `save.json`, seed 254415, build 6bd1ae0, 178 moves. `npm run replay-save -- docs/playtests/2026-11-26-jacob-test2/save.json --log` reproduces it exactly (digest 84d460fe3b58e19f matches).

**Result:** killed in Autumn 399 BC, season 24 of 30, by a plot led by the leader of the exiles at Aetna. At the season-20 check-in he called it "easy": "I had a good rival for a bit but now I seem to be fully in control of everything". Four seasons later he was dead.

## The story the game told

1. **405 to 404.** The citadel went up in the first two seasons. A levy on the rich turned them Rebellious at once. The leader of the exiles at Aetna started planting stories that kept the citizens Angry or worse.
2. **Hipparinus, the good rival.** He rose to political rival (Climber) in Winter 405/404 and to rival in the open by Winter 404/403. Jacob bought his friendship (+3) and married his own brother Thearides to Hipparinus's daughter Aristomache, which made the mint work for him. Later Jacob stripped him of the mint and imprisoned him (Spring 402). This is the arc Jacob remembered.
3. **The exiles come home (Summer 404).** The rich families finished "The cavalry come home", which brought every exile into the city, their leader included. In Winter 404/403 Jacob tried to seize his estates (rolled 1) and imprison him (rolled 1). He fled, came back with a grudge and the scar Hunted, rose to Schemer, then blackmailed Jacob over the staged night alarm at Leontini and told the city when refused.
4. **War with Carthage (Spring 403).** Anger reached 7. Himilcon landed at Motya with about 35,000 men, then went home to a Libyan revolt. Jacob took Catana, Leontini (starved out), Gela and Messana (by embassy) and Acragas. Carthage landed again in Autumn 401 and left again. By 400 Jacob held most of the island.
5. **The slow knife (Summer 404 to Autumn 399).** One plot ran the whole game, with the exiles' leader, Theodorus and the brother of Demarchus. Feigning illness (Autumn 401) and freeing a slave (Summer 400) named its members. Jacob imprisoned Theodorus and later executed him. The exiles' leader stayed free. The plot reached Named in Spring 399 and struck in Autumn 399 at 15 (a 6 plus strength 9) against a defense of 7.

## Why he died, and could he have lived

- **The guard was gone.** In Winter 402/401 he disbanded an army the guard had marched with, and "mercenaries lost in the field" took the guard from 3 to 0. He never rebuilt it, so his defense fell from 10 to 7 (4 base, 2 the citadel, 0 the guard, 1 Andron). **Bug:** the guard's pay stayed 4 a season for those ten seasons, because pay rises by 1 per hire and never falls when men are lost (`disband` in src/core/island.ts changes strength only).
- **Both big factions backed the plot.** The citizens were kept Rebellious by the exiles' leader's stories. The rich were Rebellious from the levies and the debased coin.
- **He had warning.** The plot showed Whispers from the first season, Rumors from Summer 404, both names known by Autumn 401, and Named for three seasons before the blow. Imprisoning or executing the exiles' leader in that window would have ended it, as it did for Theodorus. With a guard of 3 his defense would have been 10, and a 15 then still kills (it must beat defense by 5). With 4 or more men in the guard, or the leader held, he likely lives.
- **Fair or random?** By the design rule, a death must never feel random, and this one did have warnings. But Jacob could not tell what was happening ("they whined about me for 20 years and made my realm unhappy but it was hard to tell"). The warnings were there; the link from "the exiles' leader spreads stories" to "the citizens back a plot that will kill you" was not drawn on screen.

## Why it felt easy, then sudden

- **About 20 actions did nothing.** Strike coin 12 times: silver once. The levy on the rich 11 times: nothing after the fourth. "The purse runs dry" emptied the rich, but both actions stayed in the menu, and each still cost the rich a step of mood. That is Jacob's "I kept doing the same actions over and over", and it fed the plot that killed him.
- **The map was won but nothing pushed back.** Carthage's army went home to Libya twice. Towns it took came back for one embassy (Gela for 1 silver), because Carthage never garrisons. From 401 the war cost him nothing.
- **Requests for his seats (30 petitions and demands).** He refused most of them, which made rivals "in the wings" (Theodorus, Nicoteles, Leptines). Jacob felt they asked for things with nothing offered: "it felt bad to just give up stuff for seemingly no reason".

## What the board added (thread 37's question)

- **Worked:** a rival with an arc (Hipparinus: rival, bought, married into the family, stripped and jailed), the mint as a seat that matters, "The rising few", the seat cards. He read and asked about all of them.
- **Did not land:** the standing line's wording; "a player" as a step name; petitions for seats felt like demands with no deal; the exiles' leader was the real enemy but his story was spread over news lines, not shown as one arc.
- **Too many matters?** He did not say too many. He said the chronicle is far too long (about 7,100 words over 25 seasons, 70 "(the Nth time)" repeats) and wants it cut to "the important stuff and good story arcs".

## Answers he was given in the thread (checked in code)

- **Feeding an army:** it refills by itself at the start of a season in a town that is yours or an ally's, with 2+ months of grain, if it is not besieging (src/core/island.ts). Otherwise Forage. At Motya he was besieging, so the army starved (about 10,000 men lost to hunger in Summer 399).
- **Guard 4, army 2:** guard pay is +1 per hire (the bug above). Levies cost 1 silver per 6,000 men in the field.
- **Allies:** +1 silver each summer if they have 2+ months of grain, and men when you muster. Working, but only in summer.
- **Strike coin gave nothing:** the rich had "nothing left to give" (The purse runs dry).
- **Muster:** you cannot add men to an army in the field.

## Suggested fixes

The full list is in `notes.md` under "Suggested fixes": 8 bugs, 13 display items, 6 design questions. The five that matter most:

1. ★ **Guard pay tied to guard strength** (bug, cheap). It drained his silver for nothing and hid that his defense was gone.
2. ★ **Say when an action is empty** (cheap). Grey out or label Strike coin and the levy when the rich have nothing left. This is his "same actions over and over".
3. ★ **Draw the arc of the man who is killing you** (display, costly). One card for the exiles' leader showing his grudge, his stories, which factions he turned, his plot, its stage. "Hard to tell" was the failure, not the death.
4. ★ **Shorten the chronicle to arcs** (costly). Jacob asked for it directly.
5. ★ **Petitions for seats should carry offers** (design, Jacob's call): a deal, a price or a threat, or a CK3-style limit on how many seats one man can hold.
