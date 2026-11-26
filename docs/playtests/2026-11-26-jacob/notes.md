# Jacob's first island test: his words (2026-11-26)

Quoted word for word, before any summary (debrief plan, step 2).

## In the thread, while playing (Thursday 2026-11-26, 12:39 PM Chicago time)

> not clear what level moods there are not clear what the agendas are. hard to tell whose actually important. can't tell what the different governments types are or what they do.

He attached four screenshots: the mood tooltip (`mood-tip.png`), the agenda tooltip (`agenda-tip.png`), the "Who is who" list (`who-is-who.png`) and the Government label "Tyranny (yours)" (`government.png`).

## What the build he played actually does (checked in the code, thread 19)

- **Moods.** Five levels: Rebellious, Angry, Uneasy, Content, Loyal. At Angry or Rebellious a faction backs a plot or starts one (the rich instead send word to Carthage; the guard refuses duty). Under the preset's balance ("Reap what you sow"), a Content or Loyal faction holds back its agenda against you. Uneasy does neither. A Loyal guard adds 1 in battle. The tooltip names only the two ends and the plot rule.
- **Agendas.** One per faction, each a fixed ladder of steps with an outcome, for example the citizens' "The people's assembly" ends with the assembly taking the generalship from you. The steps and "When complete" are on the faction card; the tooltip is generic.
- **Who matters.** "Who is who" shows each person's opinion of you and offices, not their weight. The game does compute influence for the player and for rivals, but does not show other people's.
- **Government.** Four labels from who holds the offices: Tyranny (one man holds the citadel, the generalship and the treasury), Democracy (citizens hold three or more offices), Oligarchy (the rich hold three or more), Unsettled otherwise. Only "Tyranny (yours)" changes anything (some events, marriage offers, and the assembly under the quarrels switch). Democracy, Oligarchy and Unsettled are labels with no effect.

## Our reading

All four are wording and display gaps, not bugs, except government, where the gap is in the rules: three of the four governments do nothing. That one is a design question for Jacob.
