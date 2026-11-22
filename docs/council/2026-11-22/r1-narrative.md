# Round 1: The Story Engineer

**What I looked at.** I ran one careful-bot game (seed 7, Reap what you sow). It survived the full decade and gave me nothing I would retell. Hipparinus "becomes a political rival" 10 times and "is no longer" one 8 times. He is exposed, pardoned and exposed again, and nothing ever lands. "Gathers a following" appears 39 times. "A guest leaves your table early" and "Two men fall silent" appear 5 times each, because warnings come from a five-line flavour pool, not from what the plotters did. The chronicle (`src/core/chronicle.ts`) joins the season's visible log lines and cuts to 12. It is a ledger, not a story. The parts are good: sourced events, grudges with reasons, real names. What is missing is **continuity**: a person's history with you that builds up and never resets. Phase 2 adds more nouns (cities, armies, Carthage). More nouns will not fix a missing arc, and could hide it.

---

**Q1. The first Island slice**

*Position.* Keep the map small and make it mean something: Syracuse plus four places, 399 to 395 BC (about 16 seasons). The places are Leontini (land and mercenaries), Catana (a city to win or lose), Aetna (where exiles gather) and Motya (Carthage's foothold), with Carthage offstage across the sea. Most of the sourced events already date from 398 to 396 (handoff), so this span uses the content we have. One loop, not two games: **every map move is a decision about who leaves the city.** Send Leptines with the fleet and he is absent from court, earning glory and a following. March yourself and the citadel sits with whoever you left behind.

*Proposal.* "Absence" as the shared rule. Anyone on the map is away. Away people can't vote, guard you or be watched, and they build standing with whoever is with them. Plots get a "while he is away" window. The island exists to move people out of the court and back into it.

*Refuse.* Six to eight cities in the first test. Each city with no named person in it is a dead square on the map.

**Q2. Simulated Carthage**

*Position.* Lighter than Syracuse, but personal. Three named men, each with a goal, a mood and the same memory and grudge structure the cast already has. The head of that list is Himilcon, the general of 397-396 (Diodorus 14.76.3–4: he "slipped away in disgrace to Carthage… starved himself to death"). The other two names are unverified until carded. Carthage should feel like a rival society because its men react to what they lost to you, not because it runs its own plots.

*Proposal.* The mirror runs both ways through failure. A Carthaginian defeat disgraces its general, and the bot swaps in a rival with a new temperament. A Syracusan victory abroad gives *your* general a following at home. Diodorus already shows the trick from the ruler's side: Dionysius let the Carthaginian citizens escape "in order that the Syracusans, by reason of their fear of the Carthaginians, should never find a time of ease to assert their freedom" (14.75.3, `book14.loeb.txt`). Make that a real choice: finish Carthage off, or keep it alive as a reason to need you.

*Refuse.* A full copy of the Syracuse rules for Carthage in the first test. It doubles the content and the player never sees it.

**Q3. Armies and war**

*Position.* An army is a token with a **named commander**, a strength, supply and pay owed. A battle is one roll with all its modifiers shown, plus one choice taken from the commander's traits (wait, strike, buy a traitor). The anecdote is never the battle. It is who led, who died, and what he did when he came home. Diodorus gives us both halves. The citizens, "now that they had arms in their hands," killed their commander Doricus and called the cavalry from Aetna (14.7.6–7, `book14-1-18-97-117.loeb.txt`). And after a sea victory won without Dionysius, "now because of the war they had weapons at their command" (14.64.3–4, `book14.loeb.txt`).

*Proposal.* The homecoming step. When an army returns, its commander's following, the soldiers' pay owed and the result of the campaign go through the factions step as logged actions. A victorious unpaid army is the most dangerous thing in the game.

*Refuse.* Tactical battles, unit types, hex movement.

**Q4. The other cities**

*Position.* Each city has one named leader (opinion, memory, grudges, the same records as the cast), two stores (loyalty and garrison) and a list of **who is there**. The list matters most: a city is where people end up.

*Proposal.* Exile goes somewhere. When you exile a man, he goes to a named city, keeps his grudges, recruits there and can come back with that city's help. Aetna already plays this part in the sources. That is the "flee and return" arc for nemeses.

*Refuse.* Factions inside each city. Nobody will read them.

**Q5. Plots and the sword**

*Position.* Test Reap what you sow, with thread 09's partial success and clue warnings switched on. A ~90% blow after a bunched-up early game gives the anecdote "I died in year two." That is a lesson, not a story. The best plot stories have a method and a moment, and war supplies the moment.

*Proposal.* Warnings built from what the plotters actually did, through log references: "Leptines' steward was seen at the Achradina gate." Add the moment: plots prefer seasons when you are on campaign, or when the citadel's keeper is a recruit. The Andron confession event already has the line "while your back was turned".

*Refuse.* Fair fight's coin flips as the default. A random-feeling death breaks the project's own rule.

**Q6. Rivals and nemeses**

*Position.* The rival system is the heart of "a story you'd retell", and right now it has no memory of *itself*. Seed 7 shows the flicker plainly: ten starts, eight ends, one man. Each start is treated as new. Rank 4 can't be reached because the ladder resets.

*Proposal.* A **Feud record** per pair (you and him) that only ever grows. It holds the chapters: refused, exposed, pardoned, exiled to Aetna, returned. Pardon adds a chapter. It doesn't erase the feud. Rank comes from the chapter count and how bad the chapters were, not from four rank-ups in a row. Being dropped as a political rival needs a decisive event (exile, marriage tie, a real office given), not two quiet seasons. Exile and return counts as a rank-up. That is how nemeses get made.

*Refuse.* More rival types or a higher cap before the flicker is fixed.

**Q7. The player's own goal**

*Position.* Survival alone makes every story the same shape. Pick one ambition at the start, as a player agenda of 4 to 5 visible steps, like the factions' agendas: found a dynasty, drive Carthage from the island, become loved, take Rhegium's bride. The ending then has a verdict.

*Proposal.* The prize is the chronicle. The end screen is "The Life of [you]": your ambition, your three longest feuds, who outlived you, and what the city became.

*Refuse.* A numeric score. It turns story choices into optimising.

**Q8. Voices and legibility**

*Position.* For retelling, the order is: **chronicle grouped by storyline** first, clue warnings second, the council third. A council is costly and turns samey once each advisor's lines repeat. Two voices per big decision, drawn from people who have a stake in it, gives most of the value.

*Proposal.* Storyline chronicle. The decade reads as "The Feud with Hipparinus", "The Guard's Citizenship", "The War for Motya", each with a beginning and an end and dated chapters. Season-by-season stays available as the reference.

*Refuse.* LLM text before the threads exist. It would dress up the ledger and hide the missing arcs.

**Q9. Architecture and risk**

*Position.* The island needs no new magic. Its moves are more actions in the same log. The story risk matters more than the code risk: twice as many log lines per season makes the chronicle twice as unreadable.

*Proposal.* Two story fields on every log entry. A **thread** names the storyline it belongs to, set by whoever writes the entry (a feud, a plot, a campaign, an agenda). A **cause** points back to the earlier entry that led to it. The chronicle groups by thread and can say "because". Determinism is untouched, since these are only labels. Both Phase 2 threads must agree on these two fields before anything else. Also add story counts to the 100-seed check, to report, not to tune: rival starts per person, repeated warning lines, turning points per game, and how many different people end reigns.

*Cut.* Cities 6 to 8, the biased-historian voice, the mercenary market as its own system (fold it into army pay).

---

**My top 3 questions**
1. **Q6.** Without escalating, persistent feuds there is no nemesis, no Varys and no anecdote.
2. **Q1.** Absence as the loop that ties the island to the court.
3. **Q8 and Q9 together.** Thread and cause labels on the log make the chronicle a story.

**The idea nobody else will raise: a "story sweep" next to the balance sweep.** `npm run sim` already plays 1,000 games. Have it also pull, for 10 seeds, each game's two longest threads as short prose summaries ("Hipparinus: refused the generalship 404, exposed 403, pardoned, ruined by debt 396, still waiting"). Jacob reads ten stories in five minutes and judges retellability without playing ten games. It tests the Phase 1 gate ("a story you would retell") directly, and it shows us at once when a change kills the stories even though the balance numbers look fine.

*Sources opened:* Diodorus 14.7.6–7 (`book14-1-18-97-117.loeb.txt`), 14.64.3–4, 14.75.3, 14.76.3–4 (`book14.loeb.txt`). Carthaginian names other than Himilcon: unverified.
