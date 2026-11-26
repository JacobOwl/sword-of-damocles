# Debrief of Jacob's first island test (2026-11-26)

Steps 3 to 6 of `docs/playtests/first-island-test-debrief-plan.md`. His words are in `notes.md` (quoted first); the replay is `save.json` (digest matches, build 9bc0671); hidden rolls and three other histories are in `debrief.md`. Report only: nothing here is built.

## The gate

Phase 2's test: do ten seasons give a story you would retell? His answer: "tbh not much. No one or nothing stood out." **Not passed.** What he did like: the events, the map, "the army part was kinda fun", and Nicoteles as "a threat that was cooking up".

## His moments, lined up with the log

| His words | Season | The log line | The reason the game gave | Our reading |
|---|---|---|---|---|
| "Citadel got built right away" / "I got my 3 core pillars right away really easy" | Autumn and Winter 405 | "The citadel is finished." then "The government of Syracuse is now: Tyranny (yours)." | Build, two actions over two seasons; he already held the generalship and treasury at the start | **Rule.** The start hands him two of the three pillars; the third costs 4 silver and two actions. Nothing contests it. |
| "I put taxes in with no downside" | Autumn 405, Spring 403, Autumn 403 | "The assembly passes a levy on the rich families." (+3 silver each) | First levy: "The rich families sour to Rebellious." Later levies: no mood line at all | **Rule (known loophole).** Mood cannot fall below Rebellious, so once the rich are there, every further levy is free silver. The 1,008-game batch found the same (`docs/playtests/2026-11-25-aar/report.md`). |
| "Taxed a nemsis on repeat over and over" / "The one rich guy I kept taxing" | Spring 404 to Winter 403/402 | Seize property on Theodorus seven times: three "Your men empty the strongrooms", four "Theodorus had warning" | Each: a grudge, opinion down; he became a rival (Humiliated) in Summer 404 when also refused the generalship | **Rule and display.** Nothing limits repeats (his 12:41 question). The only person he hated is the one he farmed; Theodorus never answered back with anything he saw (his rumours fail or land unseen, his plot membership was hidden, then he was imprisoned). |
| "the leader of the common people was starting to match me in inlfence (not sure what that means) but looked like a threat that was cooking up" | Summer 403 to Spring 402 | "Nicoteles becomes a political rival (Champion)… his influence 4 is within 3 of yours (6)"; "Nicoteles rises to Pretender. (his influence (6) has reached yours (6))" | Influence: one per office plus half the backing faction's power | **Working as meant, badly explained.** The best thread in his game, and he could not read it. Influence is a number he never saw explained on Nicoteles. |
| "no other power changed hands" | Summer 403 | "The citizens complete The people's assembly. The assembly takes the generalship from you." "Nicoteles holds the generalship." "The government of Syracuse is now: Unsettled." | The citizens' agenda, four steps over seven seasons | **Display.** Power did change hands, and he did not notice: it was one line in a long season. The biggest event of his game was buried. |
| "the plots didn't have time to do much" | Winter 405/404 to the end | "Rumors: Silver from the citizens is reaching men with grievances against you." from Winter 405/404 to Winter 403/402 | The citizens backed the plot only while Angry or worse and dropped it each time grain or gifts lifted them | **Working as meant.** Two plots started in season 1; one stalled at Rumors for six seasons, the other lost its leader to his prison when Aetna fell. Matches the bots: on this preset a strike lands 0.1 times a game. |
| "no war" | whole game | Carthage's goal "Rebuild", anger 2 to 6 of 10 | Carthage rebuilds after 405, as it did | **History, by design.** Carthage's war came in 397. Ten seasons from 405 end before it. |
| "so much texts that a lot of it I glazed over" | every season | about 45 log lines a season | | **Display.** Same finding as the AI testers (`docs/playtests/2026-11-26-ai-first-impressions/findings.md`, "say each thing once"). |
| "Liked the events" | | The Spartan envoy, the captain's dream, the poet's verses, fire in Achradina, the man with the secret, the first man on the wall | | Events are the part that reads as story. |

**Also found in the replay (not raised by him):** the rich families' agenda "The cavalry come home" completed in Spring 402 ("The exiles return", rich +5 power, Dominant) one season after he had taken Aetna and imprisoned the exiles' leader. The agenda does not check that its cause still exists. That is a **bug**.

## What he asked about, and what he never opened

He asked us to note this (1:14 PM). In 17 minutes of play he asked eleven questions, every one "what does this do" or "how do I", and made two design requests (hover breakdowns, city sheets):

| Asked about | Kind |
|---|---|
| Mood levels; what agendas are; who is important; government types | what a number or label means |
| Did Seize property work; can I repeat it | what an action did, and its limits |
| Striking coin without the mint | how to reach an action he could see but not use |
| Upkeep of silver and grain (and: it should be a hover breakdown) | where money and food go |
| How to conquer or win over cities | where the island actions are |
| City info on click; the map icons; what fear does | what the map shows |

**Reading:** the game does not explain its own systems where the player looks. Every question had an answer in the game, but in a tooltip, a fold, a table below the map or the news log. None was a rule he disagreed with, and none was about the story.

**Never opened:** the Families tab, and "some other things" (asked which). So the invented families (175 people a game, births, deaths, marriages) did nothing for his story; they live entirely behind a tab.

## His game beside the bots

Shown only now, so the numbers could not prime him (debrief plan, step 5).

- On this preset, the careful bot survives the decade 92% of the time and is killed 1% of the time; strikes land 0.1 times a game (`docs/playtests/2026-11-25-aar/summary.md`, baseline). His game: no blow, alive at season 10. Typical.
- 33% of the bots' games have no story shape in seasons 1 to 10. His game had one at most: a rival made by him (Theodorus), who never struck back. No friend turned, no warned blow, no battle, no city that turned twice. It sits with the quiet third.
- He played harder than the careful bot (levies, seizures, an army out by season 5, a sack) and was still not threatened. So the quiet is not caution on his part.

## Three-lens review of his game

Desktop is how he played; phone checked from the same screens. Each item cheap or costly; top five starred. Several repeat his in-play notes; those are marked "(his)".

**UI designer and artist**
- ★ **cheap** Show the result of an action where you took it, not only in the news (his). 
- ★ **costly** Cut the season's text: one "what changed" block with the three to five things that matter (a pillar lost, a rival risen, a city taken), the rest folded. The generalship loss must not be one line among forty-five.
- **cheap** Hover breakdowns for silver and grain (his design).
- **cheap** A real map key with colours, and a city sheet on click (his).
- **cheap** Mood, agenda, government and influence tooltips that say what each level does (his).
- **costly** Phone: the same text wall is worse at 390 wide.

**Historian and game designer**
- ★ **costly, his call** His idea: the game should narrow onto a few people who grow in importance, and give them events of their own (Nicoteles challenging him in court and in the assembly). This answers the gate more directly than any fix below. "We will need to talk about this more": it needs a design session, not a build.
- ★ **cheap, his call (rule)** Close the levy loophole: a levy on a faction already Rebellious should cost something else (power, a plot's strength, Carthage's silver to them).
- **cheap, his call (rule)** Limit repeat actions on one person per season (his question), as a switch.
- **costly, his call (rule)** Contest the third pillar: the citadel should not be a two-action purchase nobody can stop.
- **cheap, bug** "The cavalry come home" should stall or fail once Aetna is taken and the exiles' leader held.
- **history check** The quiet decade is the sources' decade: Carthage did not come until 397. The test's ten seasons cannot show the war; a test start nearer 398 would.

**New player**
- ★ **cheap** Explain influence where it matters: on Nicoteles's line, "his influence 6 now equals yours: as a Pretender he can depose you", with how to bring it down.
- **cheap** Name the stakes of each agenda in plain words (his).
- **cheap** Say what fear and lean do on the city sheet (his).
- **cheap** "Can I strike coin without the mint?": greyed actions should say how to get what they need.

## For the decisions sitting (step 6)

1. **The gate:** not passed, in his words. Fix the gate before adding features (CLAUDE.md).
2. **His direction:** (a) a smaller, rising cast with their own events (answer 5); (b) the offices as the board: people fight over the pillars, each gives powers, you can bribe or ally their holders, rivals holding one costs you, NPCs seek them and ask you for favours of yours (1:15 PM). The two fit together: the offices are what the rising few fight over. Needs a design talk. This is the biggest decision.
3. **Explain where the player looks** (his eleven questions). **The cheap display fixes**, all from his notes: action results in place, tooltips, hover breakdowns, map key, city sheet, influence explained, less text. One small thread can do these once he says go.
4. **Rules for him to choose** (each as a switch, off by default): the levy loophole, repeat limits, contesting the citadel, a later start to reach the war.
5. **The bug:** the cavalry agenda after Aetna falls. Small; fix with the display batch if he agrees.
6. **Sorting the switches and the eight bets:** he touched none of them in this game, so there is nothing from play to sort them by yet.
