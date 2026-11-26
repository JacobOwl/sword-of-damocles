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

## Our reading

The first four are wording and display gaps, not bugs, except government, where the gap is in the rules: three of the four governments do nothing. That one is a design question for Jacob.

Seize property: the result is shown, but far from where you acted, so it reads as nothing happening. That is display, and it is true of every action. Whether actions should be limited when repeated is a rules question for Jacob.

Idea from his question (for the debrief, not built): use an office you don't hold through its holder, by favour, bribe or alliance ("have the mint holder strike for me"). Parked here, and in `docs/later.md` if he wants it.
