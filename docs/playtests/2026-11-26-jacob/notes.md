# Jacob's first island test: his words (2026-11-26)

Quoted word for word, before any summary (debrief plan, step 2).

## In the thread, while playing (Thursday 2026-11-26, 12:39 PM Chicago time)

> not clear what level moods there are not clear what the agendas are. hard to tell whose actually important. can't tell what the different governments types are or what they do.

(12:41 PM)

> hard to tell if a "sieze propety works" also I'm allowed to just do it over and over? I imagine these porblems extend to lots of actions

(12:43 PM)

> so I don't own the mint is there any way I can strike coin? Ally the mint holder or get a favor or bribe or something

(12:45 PM)

> I can't see upkeep of silver and grain easily if at all

(12:45 PM)

> I should be able to mouse over it and have income expenses listed

(12:46 PM)

> how do I conquer vassalize other cities

(12:49 PM, with a screenshot of the map, `map.png`)

> I should be able to click on the city and get info about it. Wealth opinion etc

(12:53 PM, with `map-icons.png`)

> what are the different city icons. Gela  Catana Atena

(12:56 PM)

> cities are afraid of me what can I do with that? Hard to tell how it's useful or deteremined

He attached four screenshots with the first message: the mood tooltip (`mood-tip.png`), the agenda tooltip (`agenda-tip.png`), the "Who is who" list (`who-is-who.png`) and the Government label "Tyranny (yours)" (`government.png`).

## What the build he played actually does (checked in the code, thread 19)

- **Moods.** Five levels: Rebellious, Angry, Uneasy, Content, Loyal. At Angry or Rebellious a faction backs a plot or starts one (the rich instead send word to Carthage; the guard refuses duty). Under the preset's balance ("Reap what you sow"), a Content or Loyal faction holds back its agenda against you. Uneasy does neither. A Loyal guard adds 1 in battle. The tooltip names only the two ends and the plot rule.
- **Agendas.** One per faction, each a fixed ladder of steps with an outcome, for example the citizens' "The people's assembly" ends with the assembly taking the generalship from you. The steps and "When complete" are on the faction card; the tooltip is generic.
- **Who matters.** "Who is who" shows each person's opinion of you and offices, not their weight. The game does compute influence for the player and for rivals, but does not show other people's.
- **Government.** Four labels from who holds the offices: Tyranny (one man holds the citadel, the generalship and the treasury), Democracy (citizens hold three or more offices), Oligarchy (the rich hold three or more), Unsettled otherwise. Only "Tyranny (yours)" changes anything (some events, marriage offers, and the assembly under the quarrels switch). Democracy, Oligarchy and Unsettled are labels with no effect.
- **Seize property.** A roll of 4+ (a Loyal guard adds 1). Success: 2 or 3 silver, and the rich families lose 1 power. Either way the rich families' mood falls 1, the target gains a grudge, thinks 1 less of you and is Humiliated (a step toward rivalry). After you press the button the panel closes; the result is only a line in the season's news ("Your men empty the strongrooms of …" or "… had warning"), not shown where you acted. Nothing stops doing it again: the same man, every action, every season. Only the rising cost limits it. Strike coin is the exception (once a season). Most actions have no repeat limit.

- **Strike coin without the mint.** Not possible: only the mint's holder may strike, and no favour, bribe or alliance lends it. The one way is Revoke an office (automatic for the mint, which is not an armed office); the holder takes -3 opinion, a grudge and is Humiliated.

- **Upkeep.** The ledger shows only totals. Each season's end takes the guard's pay (its upkeep, in silver, if the treasury holder pays) and 2 months of grain (1 with a granary); summer adds 6 grain, a friendly fleet 2 in winter, allies and laws add silver. The guard's pay amount is not shown anywhere; the grain rule is only in the Grain tooltip. His design for it: hovering silver or grain lists income and expenses (CK3-style breakdown). Grain below 3 next season gets a warning on the "This season" line; silver gets none.

- **Conquering and allying cities.** Embassy to a city (ally: silver each summer, men at muster) or Muster, Send the army, siege, Storm the walls. Our reading: he could not find how; the island actions sit in the long action list, not on the map. Answered in the thread.

- **City info.** Clicking a city on the map does nothing. A table under the map lists each city's walls, grain, men, how it feels about you, and notes (besieged, sacked, afraid). Cities have no wealth number; allies pay a fixed silver in summer. His design: click a city for a sheet, like the character sheets.

- **Map icons.** Shape is walls (tower: walled city; roofs: open town, as Gela and Acragas start after the 405 treaty; hill: the fortress at Aetna). Colour is the side: deep red yours, lighter red your ally, dark brown free, light purple pays tribute to Carthage, deep purple Carthaginian, slate blue the exiles. The key is one line of small text under the map and gives no colours, so he had to ask.

- **Fear.** Each sack adds 1 fear (max 3) and -1 lean to every town not yours or Carthage's; fear fades 1 each summer. Fear adds to Embassy to a city, to a town going over to your nearby army, and to a roll to surrender when your army reaches it (needs 6: die + fear, +1 if twice its men, minus walls, -2 if Carthage's army is near; never Carthage's towns or the exiles). None of this is shown; the map table says only "afraid of you".

## Our reading

The first four are wording and display gaps, not bugs, except government, where the gap is in the rules: three of the four governments do nothing. That one is a design question for Jacob.

Seize property: the result is shown, but far from where you acted, so it reads as nothing happening. That is display, and it is true of every action. Whether actions should be limited when repeated is a rules question for Jacob.

Idea from his question (for the debrief, not built): use an office you don't hold through its holder, by favour, bribe or alliance ("have the mint holder strike for me"). Parked here, and in `docs/later.md` if he wants it.

## His answers to the season-10 and council questions (1:13 PM, word for word)

Asked in the thread because the save carried none. Questions: 1 what would you retell; 2 what confused you; 3 what felt unfair; 4 too easy, about right, too hard; 5 anything else; 6 the ten seasons in three sentences; 7 which lines did you skip; 8 who did you hate, and why.

> 1. tbh not much. No one or nothing stood out. Citadel got built right away. I put taxes in with no downside. The army part was kinda fun. I think the leader of the common people was starting to match me in inlfence (not sure what that means) but looked like a threat that was cooking up. Otherwise everything seemed pretty straight forward
> 2. na
> 3. Not much
> 4. Maybe too easy but also we only did 10 turns so the plots didn't have time to do much and no war
> 5. I'm thinking we need to refocus UI and gameplay to highlight notable factions/people. Game should prob focus on increasingly important people more so as they get more important. For exmaple the leader of the common people should prob get events challenging me in court and assembly. Kinda push me to care about a smaller pool of people over time. We will need to talk about this more
> 6. I got my 3 core pillars right away really easy and then no other power changed hands. Taxed a nemsis on repeat over and over. Sent a army out.
> 7. there was just so much texts that a lot of it I glazed over. Liked the events. Liked the map and geopolitics/war even if it is very very simple.
> 8. The one rich guy I kept taxing ig

(1:14 PM)

> also its worth noting what I asked questions on. Also I never opened the family tab and some other things

**The gate (Phase 2: do ten seasons give a story you would retell?):** in his words, "tbh not much. No one or nothing stood out." Not passed.

## The replay (thread 19, 2026-11-26)

`save.json` is his "Copy my game" line. `npm run replay-save` on the build he played (commit 9bc0671, kept on branch `claude/project-thread-3gs241`) matches its digest 165de64d723db09c: exactly his game. Seed 664527, 59 moves, ten seasons, Autumn 405 to Spring 402 BC. The save carries no season-10 answers: he reached the verdict and stopped there, so the questions were asked in the thread. `debrief.md` has the hidden rolls and three other histories.

**What happened, from the log (no reading yet):**
- Season 1: paid Micythus (Messana leans his way), gave the guard citizenship (guard Loyal and Dominant; citizens Angry), levied the rich (rich Rebellious), began the citadel.
- Season 2: citadel finished; a tax on the people (citizens Rebellious); now "Tyranny (yours)".
- Seasons 3 to 10: seized Theodorus's property seven times (three worked); refused him the generalship and he became a rival. Married Thearides to Aristomache (Hipparinus +3). Mustered the army with the guard, besieged Aetna, starved it out and sacked it, captured the exiles' leader. Messana became an ally by embassy. Athenagoras, backed at Gela, shut his gates on him.
- Meanwhile the citizens' agenda ran its four steps and the assembly gave the generalship to Nicoteles (Summer 403); government "Unsettled". Nicoteles became a Pretender in Winter 403/402.
- Plots: two from season 1 (the exiles' leader, the brother of Demarchus; Theodorus joined the second). One sat at Rumors from Winter 405/404 to the end and was never named; no blow fell.

**Odd results to check with him (found, not fixed):**
- The rich families' agenda "The cavalry come home" completed in Spring 402 ("The exiles return", rich +5 power to Dominant) one season after he had taken Aetna and was holding the exiles' leader in prison. The agenda does not notice that its cause is gone. Looks like a bug.
- Seize property on the same man seven times, as he asked about.
- Gela "weighs going over to you" twice needing 7 on one die plus small modifiers: very unlikely, and shown to him as a roll.
