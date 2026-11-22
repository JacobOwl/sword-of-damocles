# Round 2: The Scope and Architecture Skeptic

Cost key: **cheap** is data or one small rule. **Medium** is new state, tests and one PR touching the season loop. **Costly** touches the player's assumptions across `actions.ts` or needs a staged rewrite.

I accept the chair's agreements, with one addition: the city-record refactor also gives every person, the player included, a `where` field. Absence, exile to a place and return all need it.

## D1. Map and span
**Final position.** Four places: Syracuse, Aetna, one Chalcidian city (Leontini or Catana), and the Punic west as one node, Motya. Span 405 to 395. I concede the fifth place to the devil and systems. The player and narrative seats convinced me that a place with no named man is a dead square, and every place costs bot coverage. I take one thing from the historian: the 405 treaty's standings (subject, tributary and unwalled, autonomous, Punic, held by mercenaries) as the vocabulary for a city's stance.
**Costs.**
- 4 or 5 places: cheap. 8: medium (eight cards, eight leaders, bot coverage for each).
- 405 to 395: cheap. A 398 or 399 start: medium (a second start file and an events audit), and close to "choosing the start date", which `scope.md` lists as Out.
**Vote:** 4 places, 405 to 395.

## D2. The hinge between court and map
**Final position.** These are one mechanism seen from five sides:
- **(f) The commission** is the map action. It costs **(d)** one of the three slots, and it names a commander and how many men he takes.
- The men he takes leave your defense. That is **(a)** the systems seat's shared pool, and it falls out of armies shaped like the guard.
- **(b)** If you name yourself as commander, you are away. You must name who holds the citadel while you are gone, and that man's loyalty enters the sword check.
- **(c)** The generalship holder is the default commander, as a cheap switch, not a hard rule.

I'd refuse **(e)**, away and home seasons, as a rule for now. As a modifier ("winter campaigns cost a season of grain extra") it's fine.
**Costs.**
- (c), (d) and (f): cheap. (a): cheap once armies exist.
- (b): medium (absence, a stand-in in the defense, and the "absent" status trap from my Round 1).
- (e): cheap to code, but it shapes every season.

Refuse: a separate map turn.
**Vote:** a + b + c (switch) + d + f.

## D3. Supply
**Final position.** The historian moved me partly. A single number earns its place: seasons of grain an army carries, taken from the city's grain store when it marches. At zero the army must come home, plunder (a grudge in that city), or lose men. It ties the court's grain to the war and forces the homecoming everyone wants. Diodorus' retreat "because the transport of his food supplies was reduced" (14.55.5, quoted by the historian) is this rule (I didn't reopen the passage).
**Costs.** One number: cheap. Routes, lines and cutting supply: costly, and refused.
**Vote:** one number per army, in the first slice.

## D4. Faction power
**Final position.** The systems seat is right that drift flattens power. The sweep is consistent with that: factions fall to Marginal 0.01 times a game. The cheapest experiment: a "no drift" switch, plus real sinks from the island (a leader exiled or killed, a defeat, a defection). Sweep it and compare how often factions go Marginal or Dominant. PR 0 also has to replace drift's English text search with a structured flag, or any Carthaginian "power" line breaks it. The devil is right that the display should lead with the named men.
**Costs.** Drift switch plus sinks: medium. The structured flag: cheap, and needed anyway. Named-men display: cheap.
**Vote:** keep drift as the default; "no drift + sinks" ships as a switch and goes into the first-test preset if the sweep looks alive.

## D5. Balance package and the preset
**Final position.** Reap what you sow first. Fair fight runs only as a sweep comparison. Systems didn't persuade me: coin-flip deaths break the "never random" rule. On the named preset, I concede fully to the player seat. A preset is one record (scenario, package, switches) with its own pinned digest. The 100-seed check runs the preset, and the check fails if no battle, siege or change of ruler happened.
**Costs.** Preset: cheap. Bot coverage for the island: medium.
**Vote:** Reap what you sow, inside a named "First island" preset.

## D6. Rivals
**Final position.** These merge into one rule. **One feud record per person, a list of chapters (narrative), never deleted (systems' ratchet).** Hostility is on unless the latest chapter is a settlement: a debt, a marriage tie, an office given. That is systems' conversion. **Rank is the number of times he escaped you** (player, devil): a failed strike, an arrest he dodged, an exile he came back from.

Thread 09's "escalate" switch *is* this feature, so 09 owns the feud record; thread 10's exile only writes chapters into it.

On Nicoteles: leave him alone. He is Jacob's to judge. Count how many different people end reigns.
**Costs.** Feud record behind a switch: medium. Replacing the old system outright: costly, and refused for now.
**Vote:** one feud record, owned by thread 09; Nicoteles left as he is, and counted.

## D7. Carthage's inner life
**Final position.** Take the historian's skeleton, because it is sourced and costs the same as an invented one: a general made "king by law", a senate mood, an account at home that ends careers. Add one mood axis, war against peace, clearly tagged invention. The devil's charge holds: don't build Carthage *to produce* a mirror. Give it its own stakes and count whether mirroring appears.
**Costs.** Either version: medium.
**Vote:** the historian's skeleton plus an invented war-or-peace mood, no mirror target.

## D8. Big proposals, ranked by value for cost
1. **Mark this moment.** Cheap: an input the rules ignore, which replay already carries. Very high value: every playtest becomes a seed, inputs and a tag.
2. **Story sweep.** Cheap to medium; it needs the storyline tag on log entries first. High value: it tests the Phase 1 gate directly.
3. **One dice stream per system.** Medium, with one deliberate digest re-pin. High value for every A/B test after it. Jacob decides, because it changes a CLAUDE.md rule.
4. **Disputed numbers.** Cheap if army sizes are ranges in data and the chronicle names both authors. Modest value.
5. **Play on as an exile.** Costly: the player's actions assume he is in the city. It is the biggest story payoff, but it belongs in Phase 2b (`later.md`). The player's `where` field keeps the door open.

## The verdict I'd fight hardest for
**PR 0 lands before any island rule.** It moves Syracuse into one city record, gives every person, the player included, a `where` field, replaces the drift text search, and leaves the digest unchanged. Thread 10 owns `season.ts`. Thread 09 works through switches and the feud record.

**Dissent if the council goes the other way.** Write it into `decisions.md` that the top level of the game state is frozen: no new city fields go there. A thread that adds "absent on campaign" to the status field is knowingly creating the bug in my Round 1.
