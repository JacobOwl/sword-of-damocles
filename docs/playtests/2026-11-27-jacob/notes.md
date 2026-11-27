# Third island test: Jacob, 2026-11-26 (evening, Chicago time)

Save: `save.json` (seed 392894, build 742ebc1, Second island test preset). Replays exactly (digest dcfa5f92e9b86de9).
`npm run replay-save -- docs/playtests/2026-11-27-jacob/save.json --log`

Reached season 30 alive. Check-in at season 20: "easy". His verdict: far too easy, a boring run, felt mastered.

## His questions, answered from the code and the replay

- **Will I lose an ally when I disband?** No. An ally only goes over to Carthage at war, when Carthage's army is within 6 days (`goOverMods`, island.ts). Disbanding changes nothing.
- **Ally towns vs your own towns?** Almost no difference. Both pay 1 silver a season, send men to a muster, take a commander and count as yours. The only gap: a town you hold has a garrison (-1 to going over to Carthage). Towns become "yours" only by siege or storm; embassies and going over make allies.
- **Why do cities like or dislike me?** Every change to a town's lean is logged with its reason ("Catana warms to you: its first man is in your pay"), but the city sheet shows only the word ("Warm"). Fix: list the last few reasons on the sheet.
- **Ships?** Carthage's fleet number only gates landings (3 ships to invade, 2 to send more men). Your fleet office catches Carthage's transports on a 5 and fetches winter grain. The beached-ships and storm events are story beats with no lasting effect on either fleet. There is no sea battle. The convoys switch (grain at sea, fleets hunting convoys) is off in this preset.
- **Downside to keeping people in prison forever?** None. Imprisoning costs once (faction mood -1, and -1 power if he led it). After that a prisoner costs nothing, never escapes, and no one campaigns for him. Four rivals sat in prison.
- **No way to reduce the guard:** correct. "Hire mercenaries" only adds. He hired 5 times; the pay reached 5 silver a season, and by Spring 397 the treasury was empty and the guard unpaid, with no way to shed men.
- **Informer bug:** turning Damon, who leads his own one-man plot, made him "inform" on himself and handed over a deadly secret about himself. Should not happen (a plot's leader should refuse, or lie).

## Patterns: why it was easy

1. **Money never bit until the very end.** Tribute from 8 towns (+1 each), 2 standing taxes, the levy on the rich passed 6 times, and 8 seizures of property (6 worked, all but one on the same two men). The purse-runs-dry rule only cut yields from 3 to 1.
2. **One huge army wins the island by walking.** 50,000 men at the first muster (levy plus the whole guard). "Awed by the size" +1 and "strongest on the island" +1 flipped Leontini and Gela in the first season. Aetna and Motya opened by "gate at midnight" events (needs 3 and 4), Acragas has no walls, Messana came by an event, Panormus starved. Every town on the map was yours or your ally by 400 BC.
3. **Carthage is broke and toothless.** It declared war in Summer 403, landed 35,000 at Motya, fought one drawn battle, lost men to unpaid mercenaries, and was called home to quiet Libya by Summer 402. Treasury 1 silver. It never besieged anything. Losing its tribute towns drains it, so your success snowballs into its weakness.
4. **Plots never get going.** 39 warnings: 31 at Whispers, 7 Rumors, 1 Named, none at Strike. Feasts, informers and a "slave with a story" event named every plotter, and prison ended each one.
5. **Refusing has no teeth.** He refused about 20 petitions and demands. Rivals "turn to acting", but the only act was Leptines winning the generalship once while the army was away, which a contest (rolled 6) undid.
6. **Prison and seizure are free and repeatable** (see above): the same two men were seized from 3 and 4 times.

## Smaller problems

- **Massacre event after a peaceful surrender:** "Your army has burst into Panormus... kill everyone" fired after Panormus starved and gave in, with orders to spare it. The event (island-events.json, `punicLost`) should need a storm, not a surrender or a gate.
- The chronicle cut may be too short (Jacob: "over corrected", but the run was dull). Room to show a little more.
- Pay in land gave the mercenaries Leontini; worth checking that the town's side and command read sensibly after.

## Proposals (none built; Jacob picks)

Starred are the ones I would do first. Rules go behind switches.

- ★ **Prison costs:** a prisoner's faction and family press for release each season; long imprisonment raises a lasting grudge, a chance of escape or a rescue plot, and the citizens sour after several held at once. *(cheap-medium)*
- ★ **Carthage that can pay:** Carthage borrows or hires on credit for a war it chose, so one season of empty treasury does not end it; and a landed army besieges your allies instead of waiting. *(medium; overlaps thread 41's war focus, so hand it there)*
- ★ **Awe needs more than size:** going over should weigh the town's lean and fear far more than headcount, and a muster that big should strain grain and the levy (citizens away from the harvest). *(cheap)*
- ★ **Repeated seizure and levies cost more:** each seizure of the same house raises a grudge and his faction's anger; the rich go Rebellious faster. *(cheap)*
- ★ **Dismiss mercenaries:** an action to pay off part of the guard (one-off silver, and the dismissed men may turn bandit or go to Carthage). *(cheap)*
- Allies vs yours: allies could pay less, refuse levies when they "do not love you", and drift away in peace if neglected; your own towns cost a garrison. *(medium)*
- City sheet shows the reasons behind its lean. *(cheap, display)*
- Turn an informer: a plot's leader refuses or feeds you lies. *(cheap, bug)*
- Massacre event only after a storm. *(cheap, bug)*
- Ships matter: Carthage's fleet blockades or raids your coast, your fleet's strength changes the catch roll. *(costly; war focus)*
