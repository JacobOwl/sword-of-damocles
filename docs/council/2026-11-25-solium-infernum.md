# Council: what to take from Solium Infernum, 2026-11-25 (thread 32)

Jacob asked: "Is there anything our game can be inspired by in solium inferum", then "Have council look into it".

**Status: design only. Nothing was built and nothing moves into scope.** Every proposed rule is an optional switch, off by default, and Jacob's call. The last council (`2026-11-25-after-the-thousand.md`) asked for a freeze on new switches until Jacob has played the first island test (Thu 2026-11-26), so everything below waits for that game and for the one-time sort of all switches. Nothing here touches the test link.

How it was run: one session researched the game (sources at the end, each marked opened or not), checked every idea against our code and switches, and argued the five usual seats (the Player, the Systems Designer, the Historian, the Narrative Designer, the Devil's Advocate) in turn, then voted the splits. Unlike the earlier councils, the seats were not separate sessions, so the votes are one reader's judgment wearing five hats. Read them as reasoned positions, not as independent opinions.

## What Solium Infernum is (only what was opened)

Two games share the name: the 2009 original by Victor J. Davis (Cryptic Comet) and a 2024 remake by League of Geeks (released 22 February 2024, Wikipedia). Archfiends compete for the throne of Hell while Satan is missing. What matters for us:

- **Winning by standing, not land.** When the Infernal Conclave meets, "the player who has amassed the most Prestige Points wins" (manual, p.10). Quintin Smith's analysis: "Reputation is everything, making it a game of personality and public relations", and "having to fight a war is useless and to be avoided."
- **Few orders.** "every player may place two to six orders (depending on their avatar's attributes, special upgrades, etc.)", with "a minimum of two slots per turn" and never more than six (manual, pp.8, 11). A reviewer of the remake calls the two-action turn "agonizing" (CogConnected).
- **Orders resolve together, in slot order.** Everyone gives orders, "then the computer takes all turns and resolves them in a sequential order", and "slots with lower numbers execute earlier" (manual, p.8). The Regent goes first in each phase.
- **No attack without a pretext.** "you can't (publicly) attack another player without the Infernal Conclave's OK" (Smith). The pretext comes from formal diplomacy:
  - **Demand.** Costs Prestige to make (base 8, adjusted by rank and by how many demands the target already gave in to, manual p.23-24). If the target pays, the demander gets the stake back. If the target refuses, the target takes the stake, and the demander may claim a Vendetta.
  - **Insult.** Up to 6 Prestige, adjusted by rank. If the target swallows it, the insulter doubles the wager. If the target refuses, the insulter's stake is lost and the target must claim a Vendetta the next turn (manual p.24).
  - **Vendetta.** The claimant states "how he will harm his opponent and how quickly he will do it" and "must wager Prestige on the outcome" (manual p.25). PC Gamer calls it "a short war" with "tightly controlled objectives". It can instead be a single combat of champions (Praetors) in Pandemonium's arena (manual p.25).
  - **Waiting periods** follow a concession or an insult (two turns, longer if the target outranks you), and a gift stops the receiver from insulting or making demands of the giver for a while (Smith).
  - A fan guide says that after a player gives in to three demands in a row, the demander may claim a Vendetta anyway. This rests on one guide and was not found in the manual pages that were read: **unverified**.
  - **Blood Feud**: "open, unending war between two rival Archfiends", hard to reach and endable by the Conclave (PC Gamer). How it is reached was not read verbatim: **unverified**.
- **A threat list.** Each player ranks the others as threats, and "Higher ranked threats are easier targets for diplomatic actions, which means they cost less Prestige and resources to engage" (manual pp.22-23).
- **Seizing the throne by force makes you an outlaw.** Taking Pandemonium by force means "your immediate expulsion from the Infernal Conclave (i.e., your excommunication)", and an excommunicated player "may take any Canton or be stripped of any Canton at will" (manual pp.9, 12).
- **Hidden ends.** Secret objectives cost their value if failed (manual p.10). Two relics steal the win: the Kingmaker picks a puppet early and wins if the puppet is elected, and Power Behind the Throne wins if you are the election winner's Blood Vassal (PCGamesN).
- **Hell as red tape.** The remake's designers call Hell "not a place of chaos but one of red tape" (PC Gamer).
- **What players complain about.** The original was "cryptic and somewhat inaccessible" (PC Gamer), with "no tutorial" (Smith). Remake reviews: "Lots of jargon", "Not as much fun vs AI" (CogConnected); "Some rules can be unclear", "the action seems slow" (Softpedia).

## The verdict in five lines

1. **The best fit is the quarrel with stated terms**, Solium's demand, insult and vendetta, recast as Greek public quarrels. It gives Jacob's "concrete defined actions like CK3" a political grammar, gives rivals an arc with an ending, and is itself a warning before the blow. Switch, off, medium (5 of 5).
2. **"A charge first": force against a citizen needs a pretext**, or it costs more. Cheap, and it touches the purges question the last council left open (4 to 1).
3. **Each faction names a chief enemy, in public**, and quarrels with other factions as well as with you. This is Jacob's "factions acting on their own" (4 to 1).
4. **We already have Solium's best structural idea**: three actions a season (`data/start.json`, `actionsPerSeason: 3`). No change (5 of 5).
5. **Don't copy simultaneous hidden orders or champion duels.** The first fights "warnings before the blow" and the second isn't Greek. A Greek version of the duel, a showdown in the assembly, is kept for later (5 of 5 against copying; 3 to 2 to keep the assembly version).

## Ranked ideas

| # | Idea | What it would be here | Kind | Cost | Vote |
|---|---|---|---|---|---|
| ★1 | Demand, insult, vendetta | **"Quarrels with terms"**: a public demand or a public slight, then a declared quarrel with an aim and a deadline | Switch, off | medium | 5-0 |
| ★2 | No attack without the Conclave's OK | **"A charge first"**: imprison, exile or execute with a public charge on record costs less anger than without one | Switch, off | cheap | 4-1 |
| ★3 | The threat list | **"Each faction names its enemy"**: every faction shows its chief enemy (you, a man, or another faction) and acts on it | Switch, off | medium | 4-1 |
| ★4 | Prestige as the stake | **Standing as the stake of a quarrel**, using what we have (faction power, a man's following) rather than a new score | Part of ★1 | — | 3-2 |
| ★5 | Hidden ends (Kingmaker) | **A private ambition** for each rival and for you, shown at the end | Later (Phase 3) | medium | 4-1 |
| 6 | Champions duel | **A showdown in the assembly**: a quarrel settled by speakers, on the model of Theodorus and Pharacidas | Later, after ★1 | costly | 3-2 |
| 7 | Few orders, growing with standing | Already have three a season; a wound already costs one | No change | — | 5-0 |
| 8 | Outlaw after seizing the throne | Seizing the citadel by force makes you fair game for everyone | No change for now | — | 4-1 |
| 9 | Gifts buy a truce | A gift or feast stops that man's demands for a while | Part of ★1 | — | 5-0 |
| 10 | Simultaneous hidden orders | Everyone's moves resolve together, in slot order | No | — | 5-0 |
| 11 | Blind bids in the Bazaar | Blind bids for mercenary companies | Later (Phase 3 mercenary market) | medium | 5-0 |
| 12 | The most prestigious is the target | The man of most standing is easiest to strike; petalism | Later (Phase 3, earlier starts) | cheap | 4-1 |

### ★1. Quarrels with terms (switch "quarrels", off by default)

**The problem it solves.** Our people already escalate (switch `escalation`: ask once, come back with a public demand, then a grudge and a rival, `src/core/actions.ts`, `escalate`). But after the grudge, the quarrel has no shape: a rival rises by ranks (`data/rivals.json`) until something decisive happens, and the player can't start a quarrel of his own at all. Jacob's paper-test notes asked for concrete, defined actions, nemesis-style enemies and political rivals who act on their own. Solium's answer is a formal grammar: you make a demand or an insult, the other side chooses, and a refusal licenses a short, bounded fight with stated aims.

**What it would be.**
- **Two new defined acts, for you and for the computer's people:** *make a public demand* (an office given up, a son as hostage, a debt paid, a law dropped) and *a public slight* (mock him at the assembly, refuse him his seat at the feast). Each names its stake in plain words before you choose.
- **The answer is a choice by the target's priority list:** give in (he loses standing with his faction, you gain), or refuse (you lose standing if you then do nothing).
- **A refusal opens a quarrel with terms**, shown on both men's sheets: what the challenger will do ("drive him from the city", "take his office", "shame him before the assembly") and by when (two to four seasons). Success pays standing; failure costs the challenger and pays the other side. When the deadline passes, the quarrel ends either way. This gives rivals a story arc with a beginning, a test and an end, which the chronicle can tell as one thread.
- **Limits from Solium:** a waiting period after each demand; a man who gives in three times in a row is fair game (marked unverified above, so treat it as our invention); a gift or a feast buys a truce from that man's demands for a while.
- **Carthage too.** Dionysius' war of 397 began with exactly this shape. He "sent a herald to Carthage, having given him a letter to the senate, which contained the statement that the Syracusans had resolved to make war upon the Carthaginians unless they withdrew from the Greek cities" (Diodorus 14.47.1-2, checked in the saved Loeb text). Carthage then "waited for the Syracusans to take the initiative" (14.47.3). An ultimatum before war, for both sides, would be a sourced use of the same rule, and it overlaps the last council's "Carthage answers what you do".

**Seats.** Player: the clearest new verb in months, and a refusal that you must answer creates dilemmas, not bookkeeping. Systems: reuse the escalation stages and the rival record, keep the stakes in `data/`, and give every bot a priority line for "make a demand" or the feature dies against the computer, as reviewers say Solium's diplomacy does ("Not as much fun vs AI"). Historian: public demand and public shame fit Greek politics of honour, and the 397 ultimatum is sourced; quarrels between citizens with set deadlines are invention. Narrative: a quarrel is a ready-made storyline for the story chronicle, with a declared aim the reader can watch succeed or fail. Devil's Advocate: agreed on the idea, but it is the largest item here and the game already has 17 switches. Build it only if Jacob's game shows rivals feel shapeless.

**Cost:** medium (new actions, a quarrel record, bot priorities, text). **Needs Jacob's say:** yes.

### ★2. A charge first (switch "chargeFirst", off by default)

**The problem it solves.** In Solium you can't attack without the Conclave's licence. In our game you can imprison, exile or execute anyone at any time for the same cost, and the last council found that the iron hand who kills often does not suffer for it (partly reign length, `scripts/purge-recut.ts`). Jacob's rule is that every act has a reason the player can read.

**What it would be.** Acting against a citizen with a charge on record (an exposed secret, a failed plot of his, a refused demand under ★1, a quarrel he lost) costs the usual anger. Acting with no charge costs more: his faction and the commons take it as tyranny, and the reason line says so ("no charge was brought; the city calls it murder"). It works without ★1, using only the records we already have.

**Seats.** For: Player (it gives you a reason to build a case first, which is the CK3 "hook" feeling), Systems (one modifier and one reason line in the existing actions), Historian (Theodorus' speech in 14.65 to 14.69 is a public charge sheet against a tyrant; the cost numbers are invention), Narrative. Against: Devil's Advocate, who says it punishes a play style before anyone has seen Jacob play it, and that the purge figures don't yet show a problem. Agreed by all: wait for his game.

**Cost:** cheap. **Needs Jacob's say:** yes.

### ★3. Each faction names its enemy (switch "chiefEnemy", off by default)

**The problem it solves.** In the game now, factions turn their moods and priority lists mostly toward you (`src/core/ai.ts`, `factionTurn`). Solium's threat list makes every player choose whom they are watching, in the open. Jacob wants factions that act on their own.

**What it would be.** Each faction shows a chief enemy, chosen by its priority list and changing with events: you, a man, or another faction ("the rich families' enemy is now the commons, because of the grain law"). A faction aims its demands, rumours and votes at that enemy first, and it is cheaper to move against the faction that names you than one that doesn't. The player can then play factions against each other, Republic of Rome style, and the chronicle gets quarrels that don't run through the palace.

**Seats.** For: Player, Systems, Narrative, Historian (factional strife inside Syracuse is in the sources; Diodorus 11.86.5 to 11.87.5 tells of the "factional quarrels" of the 450s, checked; who names whom in our decade is invention). Against: Devil's Advocate, who warns it may make tyranny rarer still, as all-switch runs already crowd it out (4 of 288 games). It would have to be tested alone against the preset first, as the last council asked.

**Cost:** medium. **Needs Jacob's say:** yes.

### ★4. Standing as the stake (split, 3 to 2)

Solium's Prestige is both the score and the money you spend on diplomacy. **Split:** Systems, Devil's Advocate and the Historian say don't add a new number. Stake what already exists: a faction's power for a faction's quarrel, a man's following and his opinion of you for a personal one. Player and Narrative want a single visible "standing" with the city, because a stake you can see makes a refusal hurt. **Recommendation (3 to 2): use the existing numbers**, show the stake in words, and revisit a standing number only if quarrels feel weightless. Our game is scored by lasting, building and the chronicle (`docs/full-game.md`, Part 1), and a single score would pull it toward a points race.

### ★5. A private ambition (Phase 3, to `later.md`)

Solium's secret objectives and its two throne-stealing relics (the Kingmaker, Power Behind the Throne) suggest a hidden aim for each rival, and for you, shown only at the end: "Philistus wanted to be the man behind the tyrant, and he was." It suits the Varys and Littlefinger rivals of Jacob's paper test, and the full game's "three marks" for judging a campaign (`docs/full-game.md`, Part 4). Out of Phase 2 scope; parked. (Against: Devil's Advocate, who thinks hidden scoring fights readability; answered by revealing it in the chronicle, never mid-game.)

### 6. A showdown in the assembly instead of a duel (later, 3 to 2)

Solium settles some vendettas by champions fighting in an arena. Greek politics had no duels, so all five seats are against copying it. The Greek equivalent is a showdown before the assembly with a speaker on each side. Our decade has one in the sources: Theodorus "made bold to speak" against Dionysius (14.64.5), and when the Spartan Pharacidas answered for the tyrant, "the mercenaries flocked about Dionysius, and the Syracusans in dismay made no move" (14.70.2), both checked in the saved Loeb text. As a way to settle a quarrel under ★1, each side would name a speaker and the assembly's factions weigh them, with every modifier shown first. Player, Narrative and Historian want it kept; Systems and the Devil's Advocate say it is costly and should wait until ★1 has been played. Kept in `later.md`.

### 7 to 12, in short

- **7. Few orders (no change, 5-0).** We already give three a season (`data/start.json`), and a wound costs one. Solium lets orders grow from two to six with standing; that would reward the strong and make a falling ruler feel trapped, which our game already does with factions. Not needed.
- **8. Outlaw after a seizure (no change for now, 4-1).** Solium's excommunication is a clean idea (seize the throne by force and everyone may strike you), but the `seize` action and the faction moods already carry that cost. The Historian would revisit it for Agathocles' or Dionysius' seizures in the Phase 3 campaigns.
- **9. Gifts buy a truce (part of ★1, 5-0).**
- **10. Simultaneous hidden orders (no, 5-0).** In our season the people and factions act, then you answer what you have seen, then the sword check. Hidden, simultaneous orders would make a blow land before its warning, against CLAUDE.md's "The sword check gives warnings before the blow". The switch `clues` already gives the right kind of fog: real but partial warnings.
- **11. Blind bids (Phase 3, 5-0).** Blind bids against Carthage's recruiters for a mercenary company would suit the full mercenary market, which is out of scope now. Carthage "dispatched members of the senate with large sums of money to recruit mercenaries in Europe" (14.47.3), so the competition is sourced; the bidding is invention.
- **12. The man of most standing is the target (Phase 3, 4-1).** Solium makes the top threat the cheapest to attack. Syracuse once had a law for it: "the man who received the largest number of leaves had to go into exile for five years", called petalism, and "among the Syracusans it was soon repealed" (Diodorus 11.87.1 and 11.87.3, checked). It belongs to the 450s, before our decade, so it waits for the earlier starts in Phase 3.

## What to avoid, from Solium's critics

1. **Jargon and hidden rules.** "Lots of jargon", "Some rules can be unclear". Every quarrel must be offered in plain words with its stake, its deadline and its odds shown, like every other action here. No "vendetta wager" on screen.
2. **A system the computer can't play.** Solium is best against people. If ★1 goes in, the computer's people and factions must make and answer demands by their priority lists, or the player will only ever bully them.
3. **Slow turns.** Solium's turns are slow by design; ours should stay quick. A quarrel should take two to four seasons at most and end itself.
4. **Rules about rules.** Solium's Hell is "red tape". Ours is a city, and the assembly, not a referee, should be where pretexts are judged.

## Questions for Jacob

1. **Do quarrels with terms (★1) appeal?** Recommended: yes, as a switch, after your first game and the switch sort, and only if your game shows rivals without shape.
2. **Should force against a citizen cost more without a charge (★2)?** Recommended: try it as a switch after your game.
3. **Should factions quarrel with each other, not only with you (★3)?** Recommended: yes, as a switch, tested alone first.

## Sources (opened this session unless marked)

- Solium Infernum manual, Cryptic Comet, 2009: https://www.wargamer.fr/pdf/solium-infernum-manual-cryptic-comet.pdf. Read through section 4.14.5 (about two thirds); the rest of the diplomacy, Blood Feud and duel rules were seen only in summary and are not relied on. Page numbers past p.14 are approximate.
- Quintin Smith, "Analysis: How Solium Infernum Raises Hell", Game Developer, 11 December 2009: https://www.gamedeveloper.com/game-platforms/analysis-how-i-solium-infernum-i-raises-hell
- Andy Chalk, PC Gamer, 30 November 2023, on the remake: https://www.pcgamer.com/solium-infernum-comes-to-the-pc-gaming-show-with-a-unique-vision-of-hell-not-a-place-of-chaos-but-one-of-red-tape
- Wikipedia, "Solium Infernum": https://en.wikipedia.org/wiki/Solium_Infernum
- Steamah fan guide (2024, credited to TheBeautifulVoid): https://steamah.com/solium-infernum-diplomacy-guide-for-new-players/
- PCGamesN on relics: https://www.pcgamesn.com/solium-infernum/relics
- Gamepur on the archfiends: https://www.gamepur.com/guides/which-archfiend-should-you-play-in-solium-infernum
- Reviews: CogConnected https://cogconnected.com/review/solium-infernum-review/ and Softpedia https://www.softpedia.com/reviews/games/pc/solium-infernum-review-537501.shtml
- Not opened: the Slant review (failed to load) and re-actor.net's diplomacy guide (redirected elsewhere).
- Diodorus, Loeb (Oldfather), as saved in the phoenician-punic-world repository: 11.86.5 to 11.87.6 (`book11-73-92.loeb.txt`), 14.47.1 to 14.47.3, 14.64.5 and 14.70.1 to 14.70.2 (`book14.loeb.txt`). Every quote above was checked in those files.
