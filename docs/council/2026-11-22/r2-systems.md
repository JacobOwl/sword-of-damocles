# Round 2: The Systems Designer (rebuttal)

Correction to my round 1: Himilcon's "starved himself to death" is **14.76.4** (checked, `book14.loeb.txt` line 202; the devil's seat had it right).

## D1. Map and span

**Final position.** I concede the span. Keep 405 to 395 and use five places: Syracuse, Aetna, Leontini, Catana and Motya (the Carthaginian west as one node).
**What moved me.** The skeptic: "limits the experiment to one new thing." Aetna and the Chalcidian cities give the army work before 398.
**Refuse.** Eight places. More test cost, no new mechanism.
**Vote:** five places, 405 to 395.

## D2. The hinge

**Final position.** Combine (a), (b), (d) and (f). "Where are you?" (b) is the question each season. The shared pool of men (a) is the *number* behind it. Map orders cost the same three action slots (d). A commission (f) is what you do when you stay home: a named man takes some of the men away. The regent folds into (b): whoever you leave holding the citadel commands the men you leave behind, so his loyalty sits in your defense.
**What moved me.** The devil's regent and commission ideas. They turn my pool from a bare number into people, which the pool lacked.
**Refuse (e)** as a hard rule. Make winter campaigning cost supply (D3) instead, and the rhythm emerges on its own. **Refuse (c)** as a gate on every order. Anyone you commission becomes acting general for that campaign, which makes the generalship a prize, not a lock. I do keep the historian's arming of citizens: a levy raises the citizens' strength in the plot math.
**Vote:** a + b + d + f, with the regent inside b.

## D3. Supply

**Final position.** Yes, in its minimal form: one counter per army, seasons of food. It drops by 1 each season away from a friendly city, and by 2 in winter. At 0 the army must come home or it loses men and its commander loses standing. No roads, no convoys. Raiding or taking a city refills the counter.
**What moved me.** The historian, verified. Dionysius withdrew "because the transport of his food supplies was reduced" (14.55.5). Mago was undone by men "continually cutting off the enemy's supplies" (14.96.1). One counter gives a campaign a clock, a reason to take cities and a reason to come home.
**Vote:** one supply counter. Nothing more.

## D4. Faction power

**Final position.** Remove the drift toward 5. Replace it with sources and sinks that come from people, plus one built-in brake.
- *Sources and sinks:* offices, a leader's death or exile, a defection, a homecoming army, a passed or failed law.
- *The brake, overreach:* a Dominant faction grows an internal rival, its second man, who begins working against its leader. That is the Republic of Rome pattern, and it's a negative feedback with a face.

Show power as the named men first, then a band word, with the number only on hover.
**What moved me.** The devil: "let power move when *people* move." I had sources and sinks but no faces on them.
**Vote:** no drift; people-driven change plus overreach. Jacob decides, and it ships as a switch.

## D5. Balance package

**Final position.** I concede: test Reap what you sow, with thread 09's partial-success switch on. Partial success gives the variance I wanted from Fair fight without coin flips that a novice reads as random. Yes to a named "first test" preset of switches.
**What moved me.** The player: "to a novice that reads as random."
**Vote:** Reap what you sow + partial success, as a named preset.

## D6. Rivals

**Merged rule.** One feud record per pair, and it only grows (the narrative seat's idea).
- A pardon or favour adds a "debt" chapter. It never erases the feud (my ratchet).
- Rank comes from the chapters, weighted. Escaping you counts double, and surviving you twice makes a nemesis (the devil's seat).
- Exile to a place and coming back is the standard way to escape.
- A man drops off the rivals list only after a decisive chapter, never after quiet seasons.

One record, three thresholds, all knobs in `tuning.json`.

**Nicoteles.** Don't hand-nerf him. The structural cause is that the citizens' agenda hands its leader the generalship automatically. Overreach (D4) and commissions (D2) dilute it: generals multiply, and a Dominant citizens' faction grows its own rival to Nicoteles. Then count again. If one man still ends over half the reigns, report it as a broken result, and Jacob chooses the fix.
**Vote:** the merged feud record.

## D7. Carthage's inner life

**Final position.** The historian's constitution moved me, because it is sourced and it's a mechanism.
- The general is made "king by law": "lawfully according Himilcon sovereign power" (14.54.5, checked). He has sovereign command while abroad, and he answers to the council when he comes home.
- Add a council mood as the only lever.
- Keep "war party" and "peace party" out, or tag them as invention if Jacob wants them.

**On the devil's charge.** I accept it. My round 1 coin flow (the general's buy-out silver landing in your treasury) is just a flow, and it stays. But no mechanism should exist *in order to* produce a mirror. Measure it instead: the summary should count changes to Carthage's command that followed a Syracusan result, and changes in Syracuse that followed a Carthaginian one. If no mirror shows up, that is a finding.
**Vote:** the historian's general and his account at home, plus a council mood. The mirror is measured, not built.

## D8. Ranked by value for cost

1. **One dice stream per system, all made from the seed** (skeptic). It is cheap, and every comparison after it gets clearer; without it, balance work on the island is mostly noise. It needs Jacob's yes, because it changes the "one seeded RNG" rule. Do it in the first refactor, which re-pins the digest once.
2. **Story sweep** (narrative). Cheap. It tests the Phase 1 gate directly.
3. **"Mark this moment" button** (player). Very cheap, and it gives the playtest real data.
4. **Losing Syracuse as a turn** (devil). The highest value of the five, but costly: the player needs a plotting toolkit. Park it in `later.md` until the first island test passes.
5. **Disputed numbers from rival historians** (historian). Cheap to medium, and good for fog of war, but it comes after the loop works.

## The verdict I'll fight hardest for

**Absence has a number.** The men who march are subtracted from your defense, the man you leave commands the rest, and the plot math reads both. That turns "Where are you?" into a dial, not a switch: send more men and you win abroad more often, but you are more exposed at home.

**Dissent if the council goes the other way.** If absence becomes a flat "-N defense while away", I'd log a dissent. A flat penalty makes campaigning a yes-or-no toggle with one right answer for each plot stage. The bots will find it within a sweep, and so will Jacob. A dial has no single right answer, and that is where the stories come from.
