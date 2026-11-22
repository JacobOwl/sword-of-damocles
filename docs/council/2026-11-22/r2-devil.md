# Round 2: The Devil's Advocate

## First, the consensus list itself
Most of it I accept, and some of it I proposed. The two weakest points are the ones everyone likes most:
- **"Nemesis by escape and return."** This has become the comfortable answer, and it has two holes. First, it only produces nemeses if the player exiles people. The iron hand executes them, and his games would have no nemesis at all. Second, exiles who return can become the new version of "the same man is your enemy six times": out, back, out, back. It needs a limit: one returning exile at a time, and a second exile from the same city counts as a chapter in the first man's story, not a new rival.
- **"Light Carthage with named men and a visible goal."** Without one more thing, that is the clock with faces. It needs to be able to *not* attack, make offers to your people, and change policy because of something inside Carthage. Otherwise it's still a clock.

## D1. Map and span
**Position:** Five places, under one hard rule: no place on the map without a named person in it (narrative). Keep the span at 405-395. The Chalcidian cities (around 403) are the natural first map content, and the war of 398 should be possible, not certain.
**What moved me:** The skeptic, because four of the places are already in `places.json` and the conquest is attested. That is cheaper than my three or four places. Starting in 398 (systems) or 399 brings the great war on schedule, and that is the scripting CLAUDE.md warns against.
**Vote:** 5 places, 405-395.

## D2. The hinge
**Position:** Combine (d), (f), (b) and (a). A map order costs one of the usual three action slots (d). Each order is a commission to a named man (f), or to yourself (b). If you go yourself, you name who holds the citadel while you're away. Systems' shared pool of men (a) is the number underneath: the men you send leave your defense.
**What moved me:** Systems. The shared pool turns my "absence" idea from a story into arithmetic you can see in the forecast. I drop my own (e), away and home seasons, as the hinge. Park it.
**I refuse (c)** as a gate. If every map order needs the generalship holder, then the citizens' agenda, which hands Nicoteles the generalship, also hands him the whole map. That is today's dominant storyline made worse. Arming the citizens should be a *cost* of marching (historian, 14.45.5), not a lock on it.

## D3. Supply
**Position:** One number and no routes: the seasons of food an army carries. Each season away uses one. At zero, the army comes home, deserts, or turns on its commander, and the player is shown that ahead of time.
**What moved me:** The historian. 14.55.5 and 14.96.1 show supply deciding outcomes, and 14.96.2 shows the citizens deserting during a starve-them-out wait. That is a consequence at court; supply lines are not.
**Vote:** Yes to one counter; no to supply chains.

## D4. Faction power
**Position:** Systems is right that drift toward 5 erases the rise and fall Jacob asked for. The cheapest replacement: drift toward each faction's *own anchor*, worked out from its people (offices held, living leaders, members in exile, silver). Power then falls when Hipparinus is exiled and rises when Leptines comes home a hero. Show the number second, after the named men behind it.
**What moved me:** Systems, on the diagnosis. My own fix was only the display, and that was too shallow.
**Vote:** Replace drift with a people-based anchor, behind a switch.

## D5. Balance package
**Position:** Reap what you sow. Fair fight's coin flips read as random to a novice (player, narrative). Systems' case (coin flips make survivors, so nemeses) is answered by D6. Yes to a named "first test" preset (player). Otherwise "switches default off" means Jacob tests a configuration nobody chose.
**Vote:** Reap, plus the preset.

## D6. Rivals
**Position:** One rule merges all three proposals. Each pair of people has one **feud record that only grows** (narrative). A pardon or a debt adds a chapter but never erases one (systems' ratchet). Rank comes from the chapters in which he *survived you*: escape, failed strike, exile and return (player and devil). Executing a man ends his feud and starts one with his kin (the brother of Demarchus is the pattern already in the data). That way the iron hand gets nemeses too.
**Nicoteles:** Fix the mechanism, not the man. Influence counting 2 per office for a rival against 1 for you is the lopsided part. Whether he stays the city's main threat is Jacob's call. The historian notes he died early in the sources (14.10.3), so his rule in every game is a divergence that happens too often.
**Vote:** The merged feud rule.

## D7. Carthage's inner life
**Position:** I concede to the historian. "King by law" (DGk 14.54.5) and the account at home (Justin 19.2.5-6, undated; D14a 14.76.4) are sourced, and they beat my invented war and peace parties. Use them, tag the hundred judges with their date uncertainty, and tag Aristotle's offices as a later description.
**On the thesis charge, I keep half of it.** A rule like "generals fear judgment at home" is a sourced situation, not a thesis. Good. What would be a thesis is any check, summary count or success measure that asks "did the mirror happen?" Also, narrative's 14.75.3 (letting the Carthaginians escape to keep the Syracusans afraid) is Diodorus's *interpretation*. Show it as what Diodorus says, not as a rule of the game.
**Vote:** Historian's constitution; no mirror metric.

## D8. Big proposals, ranked by value for cost
1. **Story sweep** (cheap, high value). Prose summaries beside the balance numbers catch the blandness that counts miss.
2. **"Mark this moment" button** (cheap). It gives Jacob's playtest real data.
3. **Paired dice** (medium). It's valuable for comparing switches, but it changes CLAUDE.md's "one seeded RNG" rule, so it is Jacob's decision and a logged one. Do it as PR 0 or not at all.
4. **Losing Syracuse as a turn** (high value, costly). This is my idea, and I concede it doesn't belong in the first test. Put it in `later.md` as the headline of the second island test. The first test only needs exile to be a *place* that others can return from.
5. **Disputed numbers** (cheap, low value for fun so far). Add it to the chronicle once armies exist.

## The verdict I'd fight hardest for
**The first test preset must include a fix for the all-or-nothing blow** (thread 09's partial-success switch at minimum, and ideally the plot's moment tied to your absence). If the island ships on top of a strike that lands 97 to 100% of the time under Reap, Jacob's first test will end in a single blow, and nobody will know whether the island or the old sword made it feel unfair or flat.

**My dissent, if the council goes the other way:** Then add one count to the 100-seed island check: the share of reigns ended by a strike with no partial outcome possible. And state in the handoff, before Jacob plays, that any "it felt random" verdict can't be pinned on the island.
