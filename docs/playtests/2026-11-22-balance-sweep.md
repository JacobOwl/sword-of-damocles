# Balance sweep: can a reign last? (2026-11-22)

Headless runs only, no human play. Every number here is from 1,000 seeds (seeds 1 to 1,000) for each player and balance package. Rerun any row with `npm run sim -- --seeds 1000 --bot careful --tuning slowFuse`, or the whole table with `npm run sim -- --seeds 1000 --sweep --markdown`.

**Nothing in the game's default changed.** Standard is still rules v2 as built (a test checks it plays byte for byte as before). The three other packages are options on the start screen. Choosing one, or none, is Jacob's call.

This is balance for play, not calibration to history: no number here was set to match how often real tyrants fell.

## The short version

1. **The old "1 survivor in 100" was mostly the bot.** Under the standard rules, a careful player survives the decade in **52%** of games and a generous one in **34%**. The old simple bot survives **0%**, and a player picking at random also **0%**. So the standard rules are hard but not hopeless.
2. **What standard does badly is shape, not length.** When a plot strikes, the blow lands about **90%** of the time. Deaths come early (most in years 2 and 3) and then the game goes quiet. The iron-hand style is close to suicide (**7%**).
3. **Three packages** change the shape in different ways. "Reap what you sow" gives the widest spread between good and bad play (**82%** careful against **0%** careless) and makes the iron hand a real gamble (**41%**). It is my recommendation to playtest first. Details and costs below.
4. **Two new problems appear once reigns last.** One storyline dominates the endings: Nicoteles and the citizens' assembly. And long games repeat themselves: in a decade under "Reap what you sow", the same man becomes your enemy 5 or 6 times. Both are rules questions, listed at the end.

## The players

Each is a priority list over the same menu you use. Each sees only what the screen shows you (warnings, names you uncovered, grudges, opinions, moods, power, your stores). None peeks at hidden plotters or plot strength. They roll the game's dice like you do.

| Player | How it plays |
|---|---|
| **Simple** | The first bot, unchanged. Refuses most petitions, spends carelessly. Kept so old counts stay comparable. |
| **Careful** | Pays the guard first and keeps grain above the riot line. Watches anyone with a grudge, pardons before plots can recruit, arrests only names it has. Grants a minor office after one refusal. Takes back an office from a rival who holds two. Marches on Aetna while the exiles' leader is its enemy. |
| **Patron** | Rules by favour: grants petitions and offices, marriages, feasts, grain, terms for exiles. Counters rivals with rumors and secrets; arrests only when a plot is Named. |
| **Iron hand** | Rules by force: hires mercenaries, builds the citadel, revokes every office, arrests and executes suspects, seizes the rich, disarms the citizens. |
| **Careless** | Picks any legal action at random. A floor, not a strategy. |

## Survival: still ruling at the end of the decade

| Package | Simple | Careful | Patron | Iron hand | Careless |
|---|---|---|---|---|---|
| Standard | 0% | 52% | 34% | 7% | 0% |
| Slow fuse | 0% | 67% | 51% | 11% | 0% |
| Fair fight | 1% | 66% | 53% | 18% | 0% |
| Reap what you sow | 8% | 82% | 79% | 41% | 0% |

Still ruling after three years (12 seasons):

| Package | Simple | Careful | Patron | Iron hand | Careless |
|---|---|---|---|---|---|
| Standard | 25% | 66% | 59% | 13% | 0% |
| Slow fuse | 50% | 82% | 83% | 17% | 6% |
| Fair fight | 52% | 86% | 89% | 29% | 1% |
| Reap what you sow | 69% | 94% | 96% | 89% | 9% |

## How the stories differ

Numbers are for the careful and patron players unless marked, because those are closest to how a person plays.

| | Standard | Slow fuse | Fair fight | Reap what you sow |
|---|---|---|---|---|
| Seasons of warnings before a strike | 7.7 to 8.7 | 10.3 to 10.8 | 9.6 to 10.8 | 12.4 to 12.6 |
| You knew the plot leader's name at the strike | 62 to 84% | 76 to 92% | 84 to 97% | 85 to 92% |
| Odds that a strike lands | 90 to 92% | 99 to 100% | 60 to 66% | 97 to 100% |
| Strikes that were near coin flips (26 to 74%) | 5 to 15% | 0 to 1% | **54 to 73%** | 0 to 1% |
| Plots broken before they struck | 85 to 89% | 93 to 94% | 91 to 93% | 97 to 98% |
| Enemies made a game | 2.7 to 3.3 | 3.2 to 3.9 | 3.2 to 4.0 | 5.0 to 5.6 |
| Games deposed by a political rival (patron) | 13% | 18% | 19% | 7% |
| Iron hand: how it ends | killed or exiled 88% | killed or exiled 85% | killed or exiled 75% | **deposed 45%**, killed or exiled 15% |
| Nemeses a game | under 0.1 | under 0.1 | under 0.1 | under 0.1 |
| Who ended the reign most often (careful) | Leptines 29% | Leptines 29% | Leptines 25% | Nicoteles 39% |

What each one feels like, read from the numbers and from traced games:

- **Standard: short and sharp.** Plots are strong early (office holders weigh 3, two angry factions add 2 to 3 each) and strike as soon as they have a fair chance. If you miss a plot for two seasons you are usually dead, and the blow almost always lands. The two starting enemies (the exiles' leader at Aetna and the brother of Demarchus) are the most common enders for the careless and iron-hand players.
- **Slow fuse: you see it coming.** Plots need strength 4 for Rumors, 7 for Named and 8 to strike, and wait three seasons at Named. A Watch on one plotter names them all. After a plot breaks, no new plot starts for a season. Deaths come late and are earned, but the knife is now all or nothing: a plot that strikes kills you.
- **Fair fight: coups can fail.** Plots grow as fast, but your defense counts for more (base 6, citadel 3, each watched plotter 2) and office holders weigh 2. A third of strikes fail, and a leader who survives his failed blow rises a rank. This is the only package where failed coups and Survivors are common. **The cost: most strikes become coin flips**, which is what the brief warns against.
- **Reap what you sow: the city answers you.** Slow fuse, plus one rule: a Content or Loyal faction holds back its agenda against you (it says so once, in the season log). Neglect the citizens and their assembly takes your generalship; keep them content and it doesn't. Each style now has its own downfall: the iron hand is usually voted out by the people's champion rather than stabbed, the careless ruler is still stabbed, the careful ruler mostly lasts. Plots still kill when they strike; they just strike rarely and late.

## What each package changes

| Knob | Standard | Slow fuse | Fair fight | Reap what you sow |
|---|---|---|---|---|
| Office holder's weight in a plot | 3 | 3 | **2** | 3 |
| Backing faction adds power divided by | 3 | 3 | **4** | 3 |
| Strength for Rumors / Named | 3 / 5 | **4 / 7** | 3 / 5 | **4 / 7** |
| Least strength to strike | 6 | **8** | 6 | **8** |
| Strikes when strength + this beats your defense | 4 | **2** | 4 | **2** |
| Seasons at Named before it strikes anyway | 2 | **3** | 2 | **3** |
| Your base defense / citadel / each watched plotter | 4 / 2 / 1 | 4 / 2 / 1 | **6 / 3 / 2** | 4 / 2 / 1 |
| A Watch names the whole plot | no | **yes** | no | **yes** |
| Quiet seasons after a plot breaks | 0 | **1** | 0 | **1** |
| Failed plot leader rises a rank | no | no | **yes** | no |
| Take his place: roll needed per step | 4+ | **5+** | **5+** | **5+** |
| Content factions hold back agendas against you | no | no | no | **yes** |

All knobs live in `data/tuning.json`. A new package is a few lines of data. The agendas that count as "against you" are tagged `againstRuler` in `data/agendas.json` (the people's assembly, the cavalry come home, the guard as kingmakers, name the heir).

## Recommendation

**Playtest "Reap what you sow" first, against Standard.** Why:

- It is the only package where the result tracks your choices across the whole range: careless 0%, simple 8%, iron hand 41%, careful and patron about 80%. That fits the goal that plots and falls grow out of what you do.
- Each play style has its own typical ending, so different games tell different stories.
- Deaths come after 12 or more seasons of warnings, with the leader named about 90% of the time. A death should never feel random, and here it rarely does.

Its costs, honestly:

- **It may be too easy for a careful player** (82%). If so, Slow fuse (67%) is the same idea without the faction rule.
- **The blow is still all or nothing.** Tuning can't fix that without turning strikes into coin flips (see Fair fight). Proposal ★3 in `docs/game-research.md` (a plot picks a method and a moment you can counter) is the real fix.
- **Nicoteles ends 39 to 77% of the reigns that fall**, depending on the style (all but the careless player). See below.

## Problems the sweep found (rules questions, not fixed)

1. **One storyline dominates once plots are slower.** The citizens' agenda (four steps, about six seasons) gives Nicoteles the generalship. Two offices make him Power behind the throne, his influence passes yours, and three more steps depose you. In every softer package he is the most common ender for the simple and patron players. Possible fixes, each a rules choice: rival influence 2 per office against your 1 per office is lopsided; the agenda could give the generalship to the assembly rather than its leader; Pretenders could need a second faction behind them.
2. **Long reigns repeat themselves.** In decade-long games under Reap what you sow (300 seeds), the same man became your enemy 5.2 (careful) to 6.0 (patron) times on average: refused, pardoned, refused again. Under Standard it is 2.3 to 3.5, because games end sooner. This is research proposal ★5 (ask, then demand, then act; one ask per office).
3. **Political rivals flicker.** Careful and patron players see 9 to 15 "becomes a political rival" lines a game, because a rival who drops more than 3 below your influence for two seasons stops being one and then starts again. The handoff already asks whether "within 3 of yours" is too loose.
4. **Carthage takes the city in 5 to 8% of patron games** in every package. The patron spends silver on favours and rarely builds walls. Probably a bot weakness, but worth a look when you play: the landing roll is a die plus the guard (3) against 9, so without walls and the generalship it fails two times in three.
5. **Nemeses almost never appear** (under 0.1 a game in every package and style). Rank 4 needs four rank-ups, and enemies rarely live that long. If the "big bad" is a goal, this needs its own change; Fair fight's "rises a rank after a failed blow" helps only a little (0.3 a game for the iron hand).

## Caveats

- The bots are not Jacob. They don't read the chronicle, take risks for a story, or play the political actions with any cunning. A human may do better or worse than "careful".
- The careful bot marches on Aetna early, which removes the exiles' leader in many games. A player who doesn't think of it will meet that plot more often.
- Seeds are the same across packages, but a game's dice diverge after the first difference, so compare rates, not single seeds.

## Appendix: full tables (1,000 seeds each)

The player columns use the code ids: `tyrant` is the iron hand. "Coin flips" counts strikes whose odds were between 26% and 74%. "Blow odds" is the average chance the blow lands at the moment it is rolled. "Different enders" counts how many different people ended a reign.

### Standard (1000 seeds each)

| | simple | careful | patron | tyrant | careless |
|---|---|---|---|---|---|
| Mean seasons | 9.6 | 26.5 | 22.0 | 9.8 | 5.7 |
| Median | 8 | 40 | 18 | 7 | 5 |
| 1 year | 96% | 96% | 95% | 93% | 83% |
| 3 years | 25% | 66% | 59% | 13% | 0% |
| 5 years | 3% | 59% | 45% | 8% | 0% |
| Full decade | 0% | 52% | 34% | 7% | 0% |
| Killed | 35% | 20% | 23% | 44% | 49% |
| Exiled | 37% | 21% | 25% | 44% | 50% |
| Deposed | 28% | 3% | 13% | 5% | 1% |
| Plots a game | 3.74 | 4.11 | 3.48 | 3.41 | 2.55 |
| Plots broken before striking | 79% | 89% | 85% | 71% | 61% |
| Seasons warned | 6.6 | 7.7 | 8.7 | 6.2 | 5.4 |
| Leader known | 90% | 84% | 62% | 66% | 99% |
| Blow odds | 89% | 90% | 92% | 90% | 100% |
| Coin flips | 21% | 15% | 5% | 9% | 0% |
| Enemies | 1.54 | 2.72 | 3.31 | 2.40 | 1.81 |
| Nemeses | 0.16 | 0.04 | 0.03 | 0.23 | 0.06 |
| Political rivals | 2.71 | 10.23 | 9.14 | 2.37 | 2.71 |
| Pretenders | 0.45 | 0.08 | 0.34 | 0.07 | 0.16 |
| Marginal | 0.02 | 0.05 | 0.09 | 0.51 | 0.05 |
| Dominant | 2.12 | 3.03 | 2.94 | 2.24 | 1.57 |
| Tyranny | 3% | 8% | 0% | 98% | 0% |
| Executions | 0.00 | 0.00 | 0.00 | 2.00 | 0.10 |
| Most common ender | the leader of the exiles at Aetna 36% | Leptines 29% | Leptines 29% | the leader of the exiles at Aetna 37% | the brother of Demarchus 45% |
| Different enders | 10 | 10 | 8 | 13 | 8 |

### Slow fuse (1000 seeds each)

| | simple | careful | patron | tyrant | careless |
|---|---|---|---|---|---|
| Mean seasons | 12.9 | 31.6 | 29.1 | 11.6 | 7.3 |
| Median | 12 | 40 | 40 | 7 | 6 |
| 1 year | 100% | 100% | 100% | 99% | 97% |
| 3 years | 50% | 82% | 83% | 17% | 6% |
| 5 years | 8% | 75% | 69% | 13% | 1% |
| Full decade | 0% | 67% | 51% | 11% | 0% |
| Killed | 21% | 13% | 11% | 41% | 46% |
| Exiled | 24% | 13% | 13% | 44% | 49% |
| Deposed | 55% | 3% | 18% | 4% | 4% |
| Plots a game | 3.89 | 4.11 | 3.57 | 3.25 | 2.61 |
| Plots broken before striking | 88% | 94% | 93% | 73% | 64% |
| Seasons warned | 8.5 | 10.3 | 10.8 | 7.0 | 6.6 |
| Leader known | 93% | 92% | 76% | 63% | 100% |
| Blow odds | 98% | 99% | 100% | 96% | 100% |
| Coin flips | 0% | 1% | 0% | 3% | 0% |
| Enemies | 2.02 | 3.18 | 3.90 | 2.23 | 2.09 |
| Nemeses | 0.21 | 0.05 | 0.06 | 0.29 | 0.09 |
| Political rivals | 3.01 | 11.67 | 10.68 | 2.37 | 2.98 |
| Pretenders | 0.71 | 0.07 | 0.40 | 0.05 | 0.27 |
| Marginal | 0.02 | 0.05 | 0.09 | 0.51 | 0.05 |
| Dominant | 2.67 | 3.33 | 3.30 | 2.57 | 2.04 |
| Tyranny | 5% | 11% | 0% | 99% | 1% |
| Executions | 0.00 | 0.00 | 0.00 | 1.93 | 0.15 |
| Most common ender | Nicoteles 55% | Leptines 29% | Nicoteles 44% | the leader of the exiles at Aetna 34% | the brother of Demarchus 42% |
| Different enders | 9 | 8 | 8 | 10 | 10 |

### Fair fight (1000 seeds each)

| | simple | careful | patron | tyrant | careless |
|---|---|---|---|---|---|
| Mean seasons | 13.1 | 32.2 | 30.5 | 14.7 | 6.3 |
| Median | 13 | 40 | 40 | 8 | 6 |
| 1 year | 99% | 100% | 100% | 99% | 94% |
| 3 years | 52% | 86% | 89% | 29% | 1% |
| 5 years | 9% | 78% | 74% | 22% | 0% |
| Full decade | 1% | 66% | 53% | 18% | 0% |
| Killed | 25% | 12% | 10% | 37% | 48% |
| Exiled | 22% | 12% | 10% | 38% | 51% |
| Deposed | 52% | 4% | 19% | 7% | 1% |
| Plots a game | 4.41 | 4.56 | 4.30 | 3.89 | 2.59 |
| Plots broken before striking | 84% | 91% | 93% | 70% | 62% |
| Seasons warned | 7.7 | 9.6 | 10.8 | 7.0 | 5.8 |
| Leader known | 94% | 97% | 84% | 65% | 99% |
| Blow odds | 66% | 60% | 66% | 63% | 99% |
| Coin flips | 38% | 54% | 73% | 27% | 2% |
| Enemies | 1.82 | 3.17 | 4.03 | 2.77 | 1.94 |
| Nemeses | 0.26 | 0.09 | 0.08 | 0.30 | 0.08 |
| Political rivals | 3.00 | 11.71 | 11.42 | 2.50 | 2.84 |
| Pretenders | 0.70 | 0.10 | 0.42 | 0.10 | 0.21 |
| Marginal | 0.05 | 0.07 | 0.14 | 0.78 | 0.05 |
| Dominant | 2.60 | 3.36 | 3.38 | 2.83 | 1.79 |
| Tyranny | 3% | 12% | 0% | 98% | 0% |
| Executions | 0.00 | 0.00 | 0.00 | 2.63 | 0.13 |
| Most common ender | Nicoteles 53% | Leptines 25% | Nicoteles 49% | the leader of the exiles at Aetna 31% | the brother of Demarchus 44% |
| Different enders | 9 | 7 | 8 | 12 | 9 |

### Reap what you sow (1000 seeds each)

| | simple | careful | patron | tyrant | careless |
|---|---|---|---|---|---|
| Mean seasons | 17.8 | 36.1 | 36.6 | 27.6 | 7.9 |
| Median | 16 | 40 | 40 | 27 | 7 |
| 1 year | 100% | 100% | 100% | 100% | 98% |
| 3 years | 69% | 94% | 96% | 89% | 9% |
| 5 years | 29% | 90% | 91% | 62% | 2% |
| Full decade | 8% | 82% | 79% | 41% | 0% |
| Killed | 23% | 6% | 4% | 7% | 44% |
| Exiled | 22% | 7% | 3% | 8% | 49% |
| Deposed | 47% | 2% | 7% | 45% | 6% |
| Plots a game | 4.47 | 5.03 | 4.26 | 3.57 | 2.64 |
| Plots broken before striking | 90% | 97% | 98% | 90% | 65% |
| Seasons warned | 9.5 | 12.6 | 12.4 | 12.8 | 6.9 |
| Leader known | 96% | 92% | 85% | 84% | 99% |
| Blow odds | 97% | 97% | 100% | 41% | 100% |
| Coin flips | 3% | 1% | 0% | 38% | 0% |
| Enemies | 2.55 | 4.99 | 5.55 | 2.51 | 2.20 |
| Nemeses | 0.51 | 0.07 | 0.08 | 0.39 | 0.13 |
| Political rivals | 3.52 | 13.60 | 15.43 | 3.11 | 2.94 |
| Pretenders | 0.62 | 0.07 | 0.13 | 0.47 | 0.32 |
| Marginal | 0.07 | 0.16 | 0.07 | 0.41 | 0.08 |
| Dominant | 2.75 | 3.28 | 2.91 | 6.12 | 1.78 |
| Tyranny | 20% | 33% | 1% | 98% | 0% |
| Executions | 0.00 | 0.00 | 0.00 | 2.27 | 0.18 |
| Most common ender | Nicoteles 51% | Nicoteles 39% | Nicoteles 56% | Nicoteles 77% | the brother of Demarchus 41% |
| Different enders | 8 | 7 | 7 | 8 | 12 |

