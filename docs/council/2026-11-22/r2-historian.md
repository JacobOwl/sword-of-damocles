# Round 2: The Historian

The file key is the same as in round 1. All paths are under `/home/user/phoenician-punic-world/sources/`.

## Quote check of the other seats (done first, because errors here are the worst failure)

I grepped every Diodorus quote the other seats used. **No quote is wrong.** Player's and Skeptic's (14.7.6, 14.8.1, 14.14.1, 14.15.4) are correct. Three fixes:
- **Systems:** "starved himself to death" is **14.76.4** in `diodorus/english/book14.loeb.txt`, which settles the section they were unsure of. Their other quotes (14.47.4, 14.41.1, 14.75.4, 14.78.2, 14.95.4) are correct.
- **Narrative:** the quotes from 14.7.6-7, 14.64.3-4, 14.75.3 and 14.76.3-4 are correct. However, calling Himilcon "the general of 397-396" leaves something out. Diodorus already has a "Himilcon, the son of Hanno and of the same family" appointed alongside Hannibal in 406 (13.80.1, `book13.loeb.txt`). The man who made the peace of 405 is "Himilcar" (13.114.1). It is probably the same man, so he belongs to the Phase 1 years too. The spelling and identity need checking on a card before the data says so.
- **Devil:** the 14.7.7 quote is exact. Two cautions. First, "the council recalls Himilcon" is an invented example: no saved source has a recall, because Himilcon fled on his own (14.75.4). Second, the Aetna cavalry's origin is 13.113.3 ("occupied Aetnê"); 14.7.7 only says they "had been banished at the beginning of the tyranny".
- **My own corrections to round 1:** 14.87.1 (Rhegium's asylum and Heloris as its general) is in `diodorus/english/book14-gap-sections.txt`, not `book14-78-96.txt`. "Hoyos p. 42" comes from the project's card; I did not re-check the page in the text file.

## D1. Map and span
**Position:** Five places, over **405-395**. The places are Syracuse, Leontini, Catana, Naxos and Aetna, plus one off-board Punic west that holds Motya. **Skeptic moved me:** a test that adds one new thing at a time is worth more than my eight-city treaty map. The treaty standings still apply to these five. Systems' 398-396 fails for a historical reason, not only a practical one. It needs the war to start on schedule, which scripts history. It also strands the cast: Nicoteles and Doricus are dead by about 404 (14.10.3; 14.7.7). **Vote:** 5 places, 405-395, with the war possible but not fixed.

## D2. The hinge
**Position:** Combine (b), (f) and (c) into one rule: **the commission is the generalship.** "Where are you?" asks whether you take the command yourself or give it to a named man with a purpose. Your choice of who holds the citadel while you are away carries the sword check. Marching levies the citizens, and **armed citizens are stronger plotters**; this is sourced at Herbessus (14.7.6) and in 14.45.5. Keep (a), the shared pool of men, as the hidden cost: the mercenaries were both army and bodyguard (14.43.3, "the mercenaries who were to form his bodyguard"). Make (e) a soft lean, not a hard rule: campaigns ended "since the summer was already coming to a close" (14.53.5). **Refuse** (d) on its own, because the same three slots make war feel like any other action. **Vote:** b + f + c, with a underneath.

## D3. Supply
**Position:** I concede on supply chains. Keep **one state per army: Fed or Hungry**. An army is Fed if it is next to a friendly city or its fleet holds the sea. A Hungry army loses men each season, and it gives the commander a sourced dilemma: fight now, or wait while the citizens grow angry ("Provoked to anger at this the Syracusans deserted him", 14.96.2). A besieged city gets one grain store. **Vote:** a single Fed/Hungry flag, no chains.

## D4. Faction power
**Position:** Outside my expertise. The sources record power through named men and objects (14.7.2-3; 14.42.5), never as a level. I side with **Devil** on display (lead with the men) and with **Systems** on replacing drift with causes: power moves because of a war, a law or a death, never back toward the middle on its own. **Vote:** causes, not drift; men first in the UI.

## D5. Balance package
**Position:** Not a history question; **Player** is right that Jacob must know which game he played. **Vote:** Reap what you sow, inside a named first-test preset.

## D6. Rivals
**Position:** These merge into one rule. **There is one feud record per pair, and it only grows** (Narrative). It can be **converted into debt or favour, but never erased** (Systems). **Nemesis is a title earned by escape and return** (Player, Devil). Heloris is the sourced model: a friend "or as some say, his adopted father" (14.8.5), who later became Rhegium's general (14.87.1). On Nicoteles: do not script his death, and do not cap him. History removed him by Aristus' betrayal (14.10.3), and the game already has that event. Give the island other threats. **Vote:** the merged rule; leave Nicoteles alone and dilute him.

## D7. Carthage's inner life
**Position:** **I concede half of Devil's charge.** Building Carthage *so that* the two governments converge would be a thesis. Drop "mirror" as a design goal. "The account at home" is a different thing: it is sourced behaviour (Justin 19.2.5-6; Diodorus 14.76.4), not an argument. On parties, I looked again. No saved text has a war party or a peace party in 405-392. The nearest is **rival houses**: Justin has Suniatus, "the most powerful of the Carthaginians at that time", warn Dionysius "from hatred" of the general Hanno, and the senate then bans Greek learning (`justin/justin-18.7-19.1.watson.txt`, 20.5.11-13). That happens late in Dionysius' reign, so it is not our decade (exact date unverified). **Proposal:** two named houses with a feud, a "king by law" general, and the account at home. A man in a losing house may write to *you*. Tag the houses "invention, on a later sourced pattern". A war/peace mood display is fine if it is tagged invention. **Vote:** feuding houses plus the account; no "mirror" goal.

## D8. Big proposals, ranked by value for cost
1. **"Mark this moment" button** (Player): cheap, and it gives the direct evidence the Phase 2 gate needs.
2. **Story sweep** (Narrative): cheap, and it measures the retellable story, the actual target.
3. **Losing Syracuse as a turn** (Systems, Devil): costly, but the highest value. It is sourced: seven thousand exiles at Aetna (14.9.5), and Dionysius himself was advised to ride off to the Campanians (14.8.5). Do it after the first test, not in it.
4. **Disputed numbers** (mine): cheap, but medium value. Honestly, it is texture, not foundation. Park it in `docs/later.md`.
5. **Dice streams per system from the seed:** medium cost; still deterministic from one seed, but it rewrites a CLAUDE.md rule, so it is Jacob's call.

## The verdict I'd fight hardest for
**History enters the island as conditions and recurring situations, never as dated triggers.** Plague comes from a crowded summer camp on marshy ground (14.70.4-5). Revolt comes from armed citizens. A defeat abroad makes allies flip (14.88.5). Mercenaries are paid in a city (14.78.2-3). No event fires on a date, and no check fails when 397 goes differently.

**My dissent if the council overrules this:** if dated set pieces ship (for example "398: Motya"), each one must be a switch that is off by default and tagged "scripted". The chronicle must then say that history forced the event, so no player ever mistakes a script for a story the game told on its own.
