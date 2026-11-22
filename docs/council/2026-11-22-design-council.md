# Design council, 2026-11-22

Jacob asked for "different agents with different opinions" to "act as a council and debate" the design. Six Claude agents each held one seat and argued over three rounds: opening statements, rebuttals on eight disputes, then a vote on the chair's eleven draft verdicts. The full statements are in `docs/council/2026-11-22/` (r1, r2, r3 for each seat).

**Status: advice, not decisions.** Every design and rules verdict here is a recommendation for Jacob. Nothing in this file changes `scope.md`, and where it disagrees with `scope.md` or `docs/phase2-plan.md`, those files win until Jacob decides. The engineering verdicts (V9) are within Claude's remit and are offered to the build threads as the agreed way to work.

## The seats

| Seat | Thinks like | Cares about |
|---|---|---|
| Systems Designer | Paradox, John Company, Republic of Rome | levers, resources that connect systems, feedback loops |
| Story Engineer | RimWorld, Dwarf Fortress, Emily Short, King of Dragon Pass | memory, arcs, cause you can see, the retold anecdote |
| Historian | ACOUP standard | what the saved texts let the game claim; history as situations, not a script |
| Player's Advocate | Jacob at the keyboard, and any new player | the first 30 minutes, clicks per season, clarity |
| Scope and Architecture Skeptic | a senior engineer and producer | what can be built and kept working; the cheapest experiment |
| Devil's Advocate | attacks the consensus | the comfortable answers that are wrong |

## The short version (for Jacob)

1. **One loop, not two games.** The council agreed that the island should join the court through *absence*. Sending men to war takes them out of your defense, and the man who commands them comes home popular. If you go yourself, whoever you leave in the citadel decides your safety. All six seats ended up here, from different starting points.
2. **A smaller first island than the current plan.** The council recommends 5 places (Syracuse, Aetna, Leontini, Catana, the Punic west as one place), one food number per army and no routes. `scope.md` currently says 8 cities, routes measured in days and foraging. Vote: 6 to 0 for smaller in the first test, growing later. **Your call.** One caution against the council: CLAUDE.md notes that supply-chain parallels appeal to you, and the council chose the smallest form of supply for the first test, not the richest.
3. **Carthage built on what the sources say, which is thin.** A general made "king by law" for a war, a council mood at home, and the threat of a reckoning after defeat. The current plan's blocs "the Elders" and "the Hundred" come from Aristotle and Justin. Aristotle was writing decades later; Justin gives no date. So the council says to tag them as invention drawn from later descriptions, not to present them as fact for 400 BC.
4. **Rivals get one record that never resets.** Each person keeps one feud with you: dated chapters that are never deleted. A man becomes a Nemesis by *surviving you* (he escapes an arrest, lives through a failed strike, or comes back from exile), not by counting rank-ups. This fixes the flicker, where one man became a rival 10 times in one bot game.
5. **Before any island rule, one engine refactor.** It turns Syracuse into one city record, gives every person a "where" field, and adds a storyline tag and a cause to every log line. The game plays exactly as before. Agreed 6 to 0.
6. **History as conditions, never as dates.** Plague comes from a crowded summer camp on marsh. Revolt comes from armed citizens. Allies change sides after a defeat. The war of 398 *can* happen, but it is never scheduled.
7. **Get Jacob playing sooner.** Three seats independently named the same missed risk: a long run of merges before you play anything new. They recommend playable checkpoints along the way (see "Risks").

## Your decisions (recommendations only)

| # | Question | Council recommends | Vote |
|---|---|---|---|
| J1 | Size of the first island test | 5 places, one food counter per army, no routes, growing later | 6-0 |
| J2 | Hinge between court and map | A **commission**: one of your three actions sends a named man (or yourself) with men and a purpose | 6-0 |
| J3 | Faction power drift toward 5 | Replace with "power that people carry", as a switch swept against drift | 6-0 |
| J4 | First test configuration | A named preset: island, Reap what you sow, clue warnings and partial success on | 6-0 |
| J5 | One dice stream per system, all from the seed (changes CLAUDE.md's "one seeded RNG") | Decide **before** the engine refactor, or never | split (see V11) |
| J6 | Pause after year 4 of the first test with "continue?" | Yes | Player's Advocate; no objection |
| J7 | Ideas to park or adopt | See V11 ranking | |

---

## The verdicts

Each verdict gives the final wording, the positions that led to it, and dissents. Votes are from round 3.

### V1. Map and span

**Verdict.** Keep 405 to 395 BC, with the same cast and events. Five places: Syracuse, Aetna, Leontini, Catana, and the Punic west as one place (Motya). Rhegium and Carthage are off-map refuges: names an exile can flee to, with no simulation. Rule: no place on the map without a named person in it. Invented leaders (for Aetna and Leontini, say) are tagged invention. City stances use the 405 treaty's standings as their words: subject, tributary and unwalled, autonomous, Punic (Diodorus 13.114.1). "Held by mercenaries" is a sixth stance from later passages (14.9.9, 14.78.3), not from the treaty. The war of 398 is possible but never scheduled. Recommended for the first test: pause after year 4 and ask "continue?" with the chronicle so far.

**Positions.**
- Round 1: the Devil and the Systems seat wanted 3 or 4 places. The Story Engineer, the Player and the Skeptic wanted 5. The Historian wanted 8, from the 405 treaty map.
- Span: Systems wanted 398 to 396; the Story Engineer and the Player wanted about 399 to 395.
- What converged them was the Skeptic's "change one thing at a time". Keeping the decade means that when Jacob says "it felt X", we know the island did it.
- The Historian's case against a late start: it needs the war to begin on schedule, and the cast goes missing, since Nicoteles and Doricus are dead by about 404 (14.10.3, 14.7.7).

**Votes.** Accept 6. Amendments folded in: the Historian's labels and invention tags, and the Player's pause.

**Differs from the current plan.** `scope.md` lists 8 cities and Aetna. The council's reason for fewer: each place without a named person is "a dead square" (Story Engineer), and 8 cities on top of 24 people is more names than a newcomer can hold (Player). The 8-city map stays the destination, and the council recommends reaching it in steps.

### V2. The hinge between court and map

**Verdict.** A map order is a **commission**: a named commander, a number of men, and a purpose (take, garrison, negotiate, collect). It costs one of the usual three actions.
- **Your defense pays for it.** The men who march leave your defense, from one shared pool shown as a number.
- **The general commands by default.** The holder of the generalship is the default commander. Commissioning someone else is allowed but unlawful, and it costs standing with the assembly. That makes the office friction, not a gate. (This rule is invention, and tagged so.)
- **If you go yourself, you name a keeper.** You are away, and you name who holds the citadel; his loyalty enters the sword check.
- **Marching arms the citizens.** It levies them, and armed citizens add to plots against you (14.7.6, 14.45.5).
- **The preview shows every price** before you commit, as numbers with reasons: men leaving, standing lost, citizens armed, and plots at Rumors or worse.
- **The homecoming is a logged step.** It records the result, the commander's new following and the pay owed, and writes a chapter in his record with you.
- There is no separate map turn and no fixed away and home seasons. Winter only makes supply worse.

**Positions.**
- Round 1 offered six candidates:
  - (a) a shared pool of men (Systems);
  - (b) "where are you?", with a regent (the Player and the Devil);
  - (c) the generalship as the gate (Historian);
  - (d) the same three action slots (Skeptic);
  - (e) away and home seasons (Devil);
  - (f) a commission (Devil).
- Round 2 combined them as a + b + d + f. The Devil refused (c) as a gate, because the citizens' agenda hands Nicoteles the generalship, and with it he would have the whole map. The Story Engineer's compromise, "unlawful, not forbidden", settled it.
- The Historian refused (d) alone ("the same three slots make war feel like any other action"), then accepted the combined rule.
- The Systems seat's point that won the room: absence has a number, so campaigning becomes a dial rather than a yes-or-no switch.

**Votes.** Accept 3. Amend 3 (preview of prices: the Player and the Skeptic; homecoming step: the Story Engineer). All folded in.

**Differs from the current plan.** `phase2-plan.md` says "Your army is commanded by whoever holds the generalship; you give it orders only if that is you." The council would loosen this to a default with a cost. Otherwise, a rival who holds the generalship takes the war away from the player completely.

### V3. Supply

**Verdict.** One number per army: the seasons of food it carries, taken from the city's grain.
- It drops by 1 a season away from a friendly city, and by 2 in winter or on a long siege.
- It refills in a friendly city, by plunder, or by taking a city.
- At zero the army comes home, plunders (which angers the land) or loses men. The player sees this one season ahead.
- No routes and no depots.

**Positions.**
- In round 1, everyone but the Historian refused supply.
- The Historian argued from the sources that supply decided wars. Dionysius withdrew "because the transport of his food supplies was reduced" (14.55.5). The Agyrinaeans ruined Mago by "continually cutting off the enemy's supplies" (14.96.1). Under that wait, the citizens deserted: "Provoked to anger at this the Syracusans deserted him" (14.96.2).
- By round 2, every seat accepted one counter. The Historian gave up supply chains and proposed a simpler Fed or Hungry flag. The others preferred a counter, because the player can see it coming.

**Votes.** Accept 6.

**Differs from the current plan.** That plan has months of food plus marching in days along routes, and foraging. The council recommends seasons rather than days and no routes for the first test.

### V4. Faction power

**Verdict.** Replace "drift toward 5" with **power that people carry**. Power moves when a named member gains or loses an office, dies, is exiled, defects or comes home victorious, and when laws pass.
- It ships as a switch, default off, and is swept against drift.
- The sweep must also show that no faction sits at 9 or 10 for most of a game, the problem drift was added to stop. It reports runaway factions (held at 9 or 10 for four or more seasons).
- It includes a brake: when a faction is Dominant, its second man turns against its leader.
- The screen leads with the named men and shows the number second: "Hipparinus and Philistus have closed ranks: the rich families are strong."
- **Engineering, needed in any case:** the drift rule currently decides whether a faction "moved" by searching log text for the word " power " (`src/core/season.ts` line 128). Any new log line with that word silently changes the rule. The refactor replaces that search with a structured field.

**Positions.**
- Systems: drift erases the rise and fall Jacob asked for. In the sweep, factions went Marginal about 0.01 to 0.04 times a game.
- Devil: ratings from 0 to 10 are too abstract for Game of Thrones. "Nobody remembers 'the rich families reached 8.'"
- Skeptic: keep drift as the default until the sweep shows the replacement doesn't run away.
- The Historian deferred to the others: the sources record power through named men and objects, never as a level.

**Votes.** Accept 4. Amend 2 (Systems and the Skeptic: the runaway test and the brake). Folded in.

### V5. Balance package and the first-test preset

**Verdict.** Define a named preset, "First island test": the island scenario, Reap what you sow, and thread 09's clue warnings and partial success switched on, with the other switches off. It gets its own pinned digest. The 100-seed island check fails if no battle, siege or change of city ruler happens, which needs a bot that goes to war. Keep partial success in the preset even if it makes the first test easier.

**Positions.**
- Round 1: Systems wanted Fair fight, because coin-flip strikes leave survivors and survivors become enemies. Everyone else wanted Reap what you sow.
- Systems conceded in round 2: Fair fight "reads as random" to a novice (Player), and partial success gives survivors without coin flips (Story Engineer).
- The preset came from the Player: "Jacob shouldn't be testing a configuration nobody chose."
- The Devil's hardest-fought verdict: without a partial-success fix, the island ships on top of a blow that lands 97 to 100% of the time under Reap. Then nobody could tell whether the island or the old sword made a game feel unfair.

**Votes.** Accept 6.

**Dissent kept on record (Devil).** If partial success is ever left out of the preset, add a count of reigns ended by a strike that had no partial outcome. And warn Jacob before he plays that an "it felt random" verdict can't be pinned on the island.

### V6. Rivals: one feud record

**Verdict.** Each person has one feud record with you: a list of dated chapters that is never deleted.
- **Settlements pause, never erase.** A pardon, a debt, a marriage tie or an office is a "settlement" chapter. It pauses hostility and can come due later.
- **No double counting.** A grievance already in the record can't start a new rivalry.
- **Rank comes from surviving you:** escaping arrest, living through a failed strike, coming back from exile. Surviving twice makes a Nemesis.
- **Execution passes the feud on.** Executing a man ends his record and opens one with his kin, and the game says so plainly at that moment ("his brother swears it will not be forgotten"). That gives the iron-hand player nemeses too.
- **Leaving takes a turning point.** Dropping a political rival needs a decisive chapter, not a few quiet seasons.
- **One returner per city.** At most one returning exile per city at a time.
- **Titles in the chronicle.** It names each record from its decisive chapter ("Hipparinus the Returned").
- **Reported, not tuned:** Nemeses a game, people starting a rivalry more than twice in a decade (target: none), the same man returning more than twice, and how many different people end reigns.
- **Who builds it.** It ships behind thread 09's escalation switch, with today's rival system still the default. Thread 09 owns the record, and it merges before thread 10 writes exile chapters into it.
- **Nicoteles: no fix by hand.** Commissions and the overreach brake should dilute him. If he still ends more than half the reigns, report it as a broken result and let Jacob pick from the sweep's three fixes.

**Positions.**
- Round 1 offered three ideas: the Story Engineer's record that only grows (seed 7: Hipparinus becomes a rival 10 times and drops off 8), Systems' "enmity ratchet" that can turn into a debt but never be erased, and nemesis by escape and return (the Player and the Devil).
- The Historian gave the sourced model: Heloris, Dionysius' friend, "or as some say, his adopted father" (14.8.5), later Rhegium's general against him (14.87.1).
- Round 2 merged all three into one rule.
- The Devil attacked the comfortable version: exile-only nemeses give the iron hand none, and a returning exile can become the new "same man six times". The kin rule and the one-per-city limit answer both points.

**Votes.** Accept 3. Amend 3 (counts: the Devil and the Story Engineer; the moment the feud is born: the Player; ownership and merge order: the Skeptic). Folded in.

### V7. Carthage

**Verdict.** A light priority-list bot built on the sourced skeleton:
- **A general "king by law".** The Greek is "Ἰμίλκωνα βασιλέα κατὰ νόμον καταστήσαντες" (Diodorus 14.54.5, `sicilian-wars.greek.txt`). The Loeb softens it to "lawfully according Himilcon sovereign power".
- **A council or senate mood at home.**
- **An account at home**, from Justin's hundred judges (19.2.5-6, no date given). The sourced outcome is Himilcon's self-sentence: he "passed sentence of death upon himself and starved himself to death" (Diodorus 14.76.4). In Diodorus no one tries him; he does it as penance for impiety.
- **Two named rival houses**, tagged "invention, on a later sourced pattern". Justin 20.5.11-13 has Suniatus warn Dionysius "from hatred" of the general Hanno, later in Dionysius' reign; the exact date is unverified. A man from a losing house may write to you.
- **A war-or-peace mood** may be shown, tagged invention.
- **Carthage must be able to refrain from attacking,** make offers to your people, and change course for reasons inside Carthage. Otherwise it is "the clock with faces" (Devil).
- **On screen:** at most one line a season in the season feed, never a panel of its own.
- **No "mirror" as a design goal or a metric.**

**Positions.**
- Round 1: everyone wanted a light bot.
- The Devil charged that building Carthage *so that* the two governments mirror each other smuggles in a thesis, which CLAUDE.md forbids. `design.md` calls the mirror "the core historical idea".
- The Historian conceded half: drop the mirror as a goal; the account at home is sourced behaviour, not an argument.
- The Devil conceded the invented war party and peace party in favour of the Historian's constitution.
- On parties, the Historian found none in the saved texts for 405 to 392; the nearest thing is rival houses.

**Votes.** Accept 4. Amend 2 (the Historian's citation wording, the Player's one line). Dissent 1 (the Devil, below).

**Chair's ruling on the dissent.** The draft said "the record may count whether a mirror appears". The Devil: "A count of mirrors is a mirror metric under another name, and once it is printed in every summary it becomes a target." The chair agrees and dropped the count, because CLAUDE.md forbids framing the game around a thesis, and the Historian and the Story Engineer had already conceded the point. If a mirror shows up, it is something Jacob notices in the chronicle, not a number. Systems and the Skeptic had accepted the count; they are noted as the other side.

**Differs from the current plan.** `scope.md` names four blocs: the Elders, the Hundred, the people, the Libyan subjects. The Historian's check: Aristotle's kings, Elders, "Hundred and Four" and boards of five (*Politics* 2.11, 1273a) come from an outsider writing decades later. The saved texts show suffetes only much later; for this period they are unverified. A senate and a people do appear in 405-396: Dionysius' letter "was read in the council and subsequently before the people" (14.47.2). So the Elders and the Hundred can stay as game blocs only if they are tagged "invention, from a later description".

### V8. History as conditions, not dates

**Verdict.** No event fires on a date in the island scenario. History enters as recurring situations:
- **Plague** from a crowded summer camp on marshy ground: "myriads of people were gathered together", "the time of year which is most productive of plagues", "the terrain was marshy and in a hollow" (14.70.4-5). Diodorus's religious cause (the plundered temple, 14.63.1 and 14.70.4) is shown in the chronicle beside the natural ones, not replaced by them.
- **Revolt** from armed citizens (14.7.6, 14.45.5, 14.64.4).
- **Allies changing sides** after a defeat (14.88.5).
- **Mercenaries paid in a city** (14.78.2-3).

**Existing events.** `data/events.json` has about ten date windows. A window may decide whether an event *can* fire, never force it. Someone reads those windows once before the island ships. Each of the 33 sourced events is restated as a condition where one fits, and the report says how many survive. Any dated set piece is a switch, off by default, labelled scripted, and the chronicle says that history forced it.

**Votes.** Accept 3. Amend 3 (the Devil, the Player and the Skeptic, all on existing events). Folded in.

### V9. Engine path (engineering; offered to threads 09 and 10 as agreed practice)

**Verdict.**
1. **PR 0, the refactor, comes before any island rule.** It must leave the standard digest unchanged.
   - Syracuse's stores, guard, offices and factions move into one city record.
   - Every person, the player included, gets a `where` field. Never reuse the status "absent": it means "not yet entered", and `alive()` counts it as not alive, so a general marked absent would lose his offices.
   - The drift text search is replaced with a structured field.
   - Every log entry gains two optional fields, `thread` (which storyline) and `cause` (the earlier entry that led to it). The system writing the entry sets them at that moment, never later by matching text.
   - The save format gets a version and a scenario field.
2. **PR 1** adds the map, commissions and armies, with its own digest. It is played against the old Carthage clock first.
3. **PR 2** adds the Carthage bot behind its switch, with the old clock kept as the fallback.
4. **How the threads share the engine.** Thread 10 owns `season.ts`; thread 09 works through switches and the feud record. Test named configurations (citadel standard, citadel with the preset, the island preset), not every combination of switches. Neither thread re-pins the standard digest without saying why.
5. **Island dice only in the island scenario.** The single shared random stream means island code must draw no dice in a citadel game.
6. **Island data gets the same tags.** Every island record gets a `kind` tag, history records get cards, and the quote checker covers island data before PR 1 merges (Historian: the island multiplies invention without saying so).
7. **Story counts in the 100-seed summary,** reported and never tuned: rival starts per person, repeated warning lines, the most-repeated chronicle sentence, turning points per game, and how many different people end reigns.

**Votes.** Accept 3. Amend 3 (tags in PR 0: the Skeptic; tags set at write time and story counts: the Story Engineer; J5 decided before PR 0: Systems). Folded in.

### V10. What the player sees

**Verdict.** In order of value: clue warnings first, then a chronicle grouped by storyline (needs V9's tags), then any council of advisors, which stays parked. The island adds no panel on top of the current season screen. The season screen keeps a word budget of about 1,000 words, checked by a test in `tests/ui.test.ts`. Season 1 today shows about 1,400 words and about 80 buttons. One line at the top says "the one thing that matters this season" (the guard unpaid, a plot Named, an army out of food). New outcomes get several wordings, chosen by the commander's traits and his record with you, so "Leptines returns from Catana" doesn't repeat 39 times.

**Positions.** Everyone ranked the advisors' council last of the three, though the Historian noted it is sourced: Dionysius "gathered together his friends to counsel with them" (14.8.4). The Player found, in one run, exile in season 4 with nothing on screen marking the danger.

**Votes.** Accept 5. Amend 1 (the Player's top line). Folded in.

### V11. Bigger ideas, ranked (recommendations only)

Ranked by all six seats on value for cost (6 points for first place, down to 1):

| Rank | Idea | Cost | Points |
|---|---|---|---|
| 1= | **"Mark this moment" button** (Player): tag a moment in play as confused, unfair, great or bored; the tag goes into the replay, so Claude can replay your exact game | cheap | 32 |
| 1= | **Story sweep** (Story Engineer): beside the balance sweep, short prose summaries of each game's two longest storylines for 10 seeds, so you can judge retellability in five minutes | cheap once V9's tags exist | 32 |
| 3 | **An ambition chosen at the start**, judged by the chronicle's last page; no score | cheap | 22 |
| 4 | **One dice stream per system, all from the seed** (Skeptic). A switch then changes only its own dice, so seed 7 with the switch on and off shows exactly what it did. This changes CLAUDE.md's "one seeded RNG" rule. Do it in PR 0 or never. Systems ranked it first; the Historian, the Story Engineer and the Player ranked it fifth | medium | 19 |
| 5 | **Losing Syracuse as a turn, not the end** (Devil): play on as an exile and plot your return. It has the highest story value but is costly. It's not for the first test; the `where` field and exile records keep it possible. It is a candidate headline for the second island test, and an idea from your pitch doc | costly | 15 |
| 6 | **Disputed numbers** (Historian): the chronicle quotes rival historians ("Ephorus would say three hundred thousand; Timaeus, nearer a hundred", 14.54.5-6), and spies narrow the range | cheap | 6 |

## Risks the council says it missed (round 3)

- **Jacob waits too long to play** (the Devil and the Skeptic, independently). Counting PR 0, the feud record, clue warnings, map, bots, Carthage and the preset, that is six or seven merges before anything new is playable. The fix: two playable checkpoints. First, the citadel under the new preset, after PR 0 and thread 09. Second, the island against the old Carthage clock, after PR 1. Jacob's verdict then steers the rest instead of reviewing it.
- **The island's first 30 minutes** (Player). Season 1 already opens with two plots and two enemies before your first move. The island needs an opening that brings in one threat at a time, and a guide rewritten for the island (`ui/help.ts` is written for the Citadel).
- **A winning ruler snowballs** (Systems). Plunder pays the guard and the army, which wins more. Once drift goes, only supply and a popular commander push back. Report it: after the first victory, did defense or silver rise in most remaining seasons? Candidate switch: the army's pay rises after each win (the mercenaries who "demanded their pay" and got Leontini, 14.78.2).
- **Repeated sentences** (Story Engineer). See V10.
- **Invention creeps in looking like fact** (Historian). City leaders, garrisons, grain stores and Carthaginian names will be guesses. See V9, item 6.

## Source checks done in the council

The Historian grepped every Diodorus quote the other seats used, and none was wrong. Corrections made:
- **Himilcon's suicide.** "Starved himself to death" is 14.76.4.
- **Two generals or one?** The Himilcon of 397-396 is probably the "Himilcon, the son of Hanno" of 406 (13.80.1) and the "Himilcar" of the 405 peace (13.114.1). Justin makes him a son of Hamilcar (19.2.1). The spelling and identity need a card before the data says so.
- **No recall.** "The council recalls Himilcon" was an invented example. No saved source has a recall; he fled on his own (14.75.4).
- **The Aetna cavalry's origin** is 13.113.3.
- **Rhegium's asylum (14.87.1)** is in `book14-gap-sections.txt`.

Unverified: the Libyan revolt after 396 (14.77.1-3, not in the saved texts), the dates of the hundred judges and of the suffetes, and the Hoyos page reference.
