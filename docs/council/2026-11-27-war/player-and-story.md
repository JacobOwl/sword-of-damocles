<!-- Council seat statement, 2026-11-27, thread 41. Written by a separate AI session given the brief in this folder (brief.md). Advice only. -->

## Player and story seat (and scope guard)

### What his war actually was
In test 2 the war happened to Jacob. He was not part of it. Anger hit 7, "Carthage declares war", Himilcon landed, took a city, went home to Libya, came back in 401, left again. Jacob took Catana, Leontini, Gela, Messana and Acragas, mostly by embassy and starving towns out. Gela cost 1 silver. His own words: "carthage war has been going on this whole time yet they haven't really been here", "I just got into a war with carthage apparently? Not clear how that happened", then at season 20, "now I seem to be fully in control of everything", difficulty "easy".

The war had five problems, and none of them is about battle mechanics:
1. **No face.** Himilcon was a name in the news. Nothing showed what he wanted, how he stood at home, or what happened to him.
2. **No choices with a price.** Every decision was "send the army there". Nothing cost someone who matters.
3. **No home front.** A long war cost him nothing in the city. His real killer, the exiles' leader, had nothing to do with the war.
4. **No end.** The war never finished. Peace can only be "each keeps what it holds", with no terms to fight over and nothing to remember.
5. **Winning had no counterweight.** Once he held most of the map, nothing pushed back.

Thread 39 is already fixing the mechanical holes (garrisons, a cap on the Libyan revolt, a warning before war). My proposals sit on top of that.

### What would make the war memorable

**1. The war as one object: a war card with aims, weariness and a treaty table (medium).** When war starts, one card appears on the island tab:
- why it began (each point of anger with its cause);
- each side's aim, e.g. Carthage "Drive the tyrant out of the Greek cities", Syracuse "Expel Carthage from Motya";
- a weariness track for each side;
- the terms on the table.

Peace becomes a negotiation over term cards: towns, the Sicels, hostages, silver paid one way or the other, a fort. Precedent (history): the 396 peace gave Dionysius the Sicels and Tauromenium (Diodorus 14.96.4). The 383 peace cost him "one thousand talents" and Selinus (15.17.5); that war is outside our 405-395 window, so it is a model for terms, not content. A treaty with named terms is something he can retell. "Each keeps what it holds" is not. This replaces the current single peace offer.

**2. Named enemy generals with a standing at home (medium).** Himilcon and Magon each get:
- a visible order and goal;
- a record (towns taken, battles);
- a standing with Carthage's council blocs.

The board's ladder idea carries over: a general who fails loses the council's backing, can be recalled or disgraced, and a new man arrives with a different method. History gives two clear styles:
- **Himilcon** takes by force and treachery (Eryx, 14.55.4). After defeat he "slipped away in disgrace" and "starved himself to death" (14.76.3-4).
- **Magon** wins Sicels "with kindness" and takes in Dionysius's victims (14.90.2-3).

So the second war feels different from the first because the enemy is a different man. Most of this reuses carthage.ts generals and board.ts standing.

**3. War crises from the war's state, each one firing once per war, none with a free right answer (medium; data in island-events.json with state conditions).** Five to start, each from a passage:
- **"The army wants battle."** Fires after N seasons at war with no battle. Fight against the odds, or wait and lose allies. Sicilian Greeks "deserted Dionysius" when he would not fight (14.61.3); the Syracusans "deserted him" in 396 (14.96.2).
- **"The enemy's bargain."** Let a beaten army go home for silver, in secret. If it comes out, the citizens learn of it (14.75.1-4). This already exists as `himilconsBargain`; tie it to the state.
- **"The town that cannot agree."** An ally under threat splits. Send men or lose it. Messana (14.56.3-5).
- **"The lord who can feed you."** A Sicel lord offers grain if you take his side. Agyris (14.95.4-96.1).
- **"Peace envoys."** Carthage offers terms when its weariness is high. Taking them angers whoever wanted more.

Every choice costs a faction, an ally or a named person, so the outcome line alone cannot decide it. This is his "events from what is actually happening", not a CK3 deck.

**4. The home front (cheap to medium).** Syracuse's own war weariness, fed by:
- seasons at war;
- levies kept in the field;
- grain;
- towns lost.

It feeds the factions he already reads: the citizens demand battle, the rich lose trade, the guard wants pay. A long, cautious war becomes dangerous at home, and that ties the war to the plots that actually kill him. No new screen: it is one row on the war card and reasons on faction moods.

**5. The difficulty fix: a pendulum, not a wall (medium).** "In control of everything" should be the season before the blow, with warning. Three parts:
- **Escalation.** The more of the island you hold, the more Carthage's blocs unite. Past a line, the council votes a great expedition. This shows as a visible warning: "Carthage's council raises an army for Sicily", with its size and the season it is due.
- **A cost for holding too much.** Each town beyond a few needs a garrison or a loyal leader, or it wavers.
- **Newly taken towns are loosely held** for a few seasons.

Devereaux (ACOUP part 1) gives the shape: territory "swings wildly ... but over the long-term relatively little changes." The game should count swings. It should not tune toward history's map.

**6. The chronicle tells each war as one chapter (medium).** Cause, three to five turning points drawn from the crises and battles, the treaty's terms, and what became of the enemy general. About 150 words. This answers "WAY too long ... important stuff and good story arcs" for the war. The war card's log already holds the turning points.

**7. Town politics, kept to one thing (medium; stage 2).** Each of the 8 cities gets one named leader with a lean and a price. This works where it can stand on history: Catana's general Arcesilaus, who betrayed the city (14.15.1-2); Archonides of Herbita; Agyris; Messana's two parties. Elsewhere the leader is labelled invention. This is what makes towns "independent" without a council per town.

### Staging and scope

**Stage 1, the first build, so his next test feels different:**
- the war card with aims, weariness and treaty terms (1);
- Himilcon with home standing (2, Himilcon only);
- the five war crises (3);
- the home-front weariness row (4);
- the escalation warning (5);
- the war chapter in the chronicle (6);
- a test preset starting about 398, so ten seasons are the war. The first test ended before the war (lessons.md: "No war"), and in the second it started in season 7.

His next ten seasons should contain a whole war, start to treaty.

**Stage 2:** town leaders (7), Magon and the second war, allies' own weariness and desertion.

**Stage 3 or parked:**
- battle choices (one or two deployment picks before the roll, at most);
- drag-to-move armies with area foraging and crop ruin (already in later.md; a UI thread can pair this with thread 39's click-to-send);
- naval war beyond the interception roll (Phase 3);
- more towns (scope change);
- the mercenary market (out).

**Better UI:** the war card lives on the island tab, beside the map. The crises appear in "Matters before you", never as popups. Each crisis names the town on the map.

### Sample war, as he would see it (398-396; history labelled where used, the rest invention)
- **Spring 398.** The war card opens. Carthage's aim: "Hold Motya and punish the tyrant". Ours: choose between "Take Motya" and "Free the Greek cities". Anger shows its causes. He picks Motya.
- **Summer 398.** Siege of Motya. Crisis: "Ships on the beach" (exists). Motya falls. He chooses between sacking it and sparing it (history: Motya sacked, 14.53).
- **Autumn 398.** Warning: "Carthage's council unites: Himilcon given an army, due in spring." His map is at its widest.
- **Spring 397.** Himilcon lands, retakes Motya, and takes Eryx by a traitor (14.55.4). The citizens' weariness rises.
- **Summer 397.** Crisis: "The army wants battle." The odds are 2 in 6. He waits. Two allied towns desert (14.61.3), and the map shrinks for the first time.
- **Autumn 397.** Messana splits (14.56). He cannot reach it, and it falls.
- **Spring 396.** Himilcon besieges Syracuse. Plague strikes his camp (an existing event).
- **Summer 396.** Crisis: "The enemy's bargain." Himilcon offers silver to go home with his Carthaginians. He takes it in secret; the citizens may find out.
- **Autumn 396.** Peace on the table: Motya back to Carthage, the Sicels to him (here the game borrows the terms of the 392 treaty, 14.96.4). Himilcon's standing at home falls to Disgraced (history: his suicide, 14.76).
- **Chronicle:** "The war of Motya". Five lines and one treaty he can retell.

### Top five, ranked
1. A war card with aims, weariness and a treaty of named terms.
2. Five state-driven war crises, each firing once, each costing someone.
3. Escalation, the pendulum: winning big brings a visible great expedition.
4. A named enemy general with standing at home, recalled or disgraced by results.
5. A 398 test preset, plus the war told as one short chronicle chapter.

### One thing NOT to do
Don't build the battle-tactics system or drag-armies first. They make the war deeper to operate but no more retellable. In his test the war failed because it had no face, no price and no ending, not because the battles were too simple.
