# Round 3: the chair's draft verdicts. Accept, amend or dissent.

The r2-*.md files from all six seats are in this folder. Below is the chair's reading. Verdicts that change Jacob's goals or CLAUDE.md rules are marked (FOR JACOB) and will be recorded as recommendations only.

V1. **Map and span.** 405-395 BC, same cast and events. Five places: Syracuse, Aetna, Leontini, Catana, and the Punic west as one place (Motya). Rhegium and Carthage are off-map refuges (names an exile can flee to, no simulation). Rule: no place on the map without a named person in it. City stance uses the 405 treaty standings as words (subject; tributary and unwalled; autonomous; Punic; held by mercenaries). The war of 398 is possible, never scheduled.

V2. **The hinge.** A map order is a commission: a named commander, a number of men, a purpose (take, garrison, negotiate, collect). It costs one of the usual three action slots. The men who march leave your defense (one shared pool, shown as a number). The generalship holder is the default commander; commissioning someone else is allowed but unlawful and costs standing with the assembly (friction, not a gate). If you command yourself you are away, and you name who holds the citadel; his loyalty enters the sword check. Marching levies citizens, and armed citizens add to plots against you. No separate map turn; no fixed away/home seasons (winter only makes supply worse).

V3. **Supply.** One number per army: seasons of food carried, taken from the city's grain. It drops by 1 a season away from a friendly city, 2 in winter or on a long siege; refilled by a friendly city, plunder or taking a city. At zero the army comes home, plunders (angering the land) or loses men, and the player sees this one season ahead. No routes or depots.

V4. **Faction power.** Replace "drift toward 5" with power that people carry: it moves when a named member gains or loses an office, dies, is exiled, defects, or comes home victorious, and when laws pass. Shipped as a switch, default off, swept against drift (FOR JACOB: which becomes default). PR 0 replaces drift's English text search with a structured field. UI leads with the named men, number second.

V5. **First test preset.** A named preset "First island test": island scenario, Reap what you sow, thread 09's clue warnings and partial success on, other switches off. Its own pinned digest. FOR JACOB to confirm. The 100-seed island check fails if no battle, siege or change of city ruler happens, and an island-going bot is needed.

V6. **Rivals: one feud record.** Each person has one feud record with you: a list of dated chapters that is never deleted. A pardon, debt, marriage tie or office is a "settlement" chapter that pauses hostility and can come due; it never erases. A grievance already in the record can't start a new rivalry. Rank rises by surviving you: escaping arrest, surviving a failed strike, exile and return. Surviving twice gives Nemesis. Executing a man ends his record and opens one with his kin (so the iron hand gets nemeses too). Dropping a political rival needs a decisive chapter, not quiet seasons. At most one returning exile per city at a time. Thread 09 owns the record (it is the "escalate" switch grown up); thread 10's exiles write chapters into it. Nicoteles: no hand nerf; count how many different people end reigns and report it.

V7. **Carthage.** A light priority-list bot built on the sourced skeleton: a general made "king by law" for a war (Diodorus 14.54.5), a senate/council mood, and an account at home that can end his career (Diodorus 14.76.4; Justin 19.2.5-6, undated). Two named rival houses (invention, on a later sourced pattern, Justin 20.5) whose losing side may write to you. A war-or-peace mood may be shown, tagged invention. Carthage must be able to not attack, make offers to your people, and change course for reasons inside Carthage. No "mirror" as a design goal or metric; the record may count whether one appears.

V8. **History as conditions.** No event fires on a date in the island scenario; history enters as recurring situations and conditions (plague from a crowded summer camp on marshy ground, revolt from armed citizens, allies flipping after a defeat, mercenaries paid in a city). Any dated set piece must be a switch, off by default, labelled scripted.

V9. **Engine path.** PR 0 before any island rule: Syracuse into one city record, a `where` field on every person including the player (never reuse status "absent", which means not yet entered and counts as not alive), drift's text search replaced, standard digest unchanged, save format versioned with a scenario field. Then PR 1 map, commissions, armies (own digest); PR 2 the Carthage bot behind its switch, the old clock as fallback. Thread 10 owns season.ts; thread 09 works through switches and the feud record. Every log entry gains two optional story fields: `thread` (which storyline) and `cause` (the earlier entry that led to it), agreed by both threads before island code. Test named configurations, not every switch combination. Neither thread re-pins the standard digest silently.

V10. **Legibility.** Order of value: clue warnings, then chronicle grouped by storyline (needs V9's tags), then any advisor council. The island must not add a panel on top of the current season screen; a word budget for the season screen (about 1,000 words) checked by a test. (Council of advisors stays parked.)

V11. **Recommendations for Jacob (not decided):**
- (a) "Mark this moment" button in playtests (cheap).
- (b) Story sweep: prose summaries of the two longest storylines for 10 seeds beside the balance sweep (cheap once tags exist).
- (c) Losing Syracuse as a turn: play on as an exile and return. Not in the first test; exile records designed now so it fits later. Possible headline of the second island test.
- (d) One dice stream per system, all from the seed (changes the CLAUDE.md "one seeded RNG" rule; do it in PR 0 or not at all).
- (e) Disputed numbers from rival historians in the chronicle (later).
- (f) A player ambition picked at the start, judged by the chronicle's last page; no score.

## Format
For each of V1-V11: "accept", or "amend: <one sentence>", or "dissent: <one or two sentences>". Then rank V11 (a)-(f). Then one sentence: the biggest risk the council has missed. Under 500 words. Write to r3-<seat>.md in this folder and return it. No repository edits.
