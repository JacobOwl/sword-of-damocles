<!-- Council seat statement, 2026-11-27, thread 41. Written by a separate AI session given the brief in this folder (brief.md). Advice only. -->

THE DIGITAL STRATEGY DESIGNER: war, supply and town politics

I read src/core/island.ts, carthage.ts (goal vote, acts, generalOrders, startWar/endWar), data/island.json and data/carthage.json. All game descriptions below come from my memory of the games and I have not re-checked them. Diodorus passages are ones I grepped in the saved texts.

**The diagnosis.** At the moment a war is a single flag. startWar sets `war = true`. endWar removes Carthage's army and posts "Each keeps what it holds", so nothing is at stake. That explains three of Jacob's complaints. He couldn't tell why the war started, because there was no declaration with a demand. Gela came back for free, because nothing in the war ever counted against him. And the war went silent, because Carthage's goal flips to "libya" with no pressure to come back. Every Paradox game I've played has the same core, and that is what to borrow: a war is an object with claims, a running tally, and a price for ending it.

## 1. War as an object: aims, ledger, terms (medium; replaces the bare war flag and the "each keeps what it holds" ending)

**Borrowed from:** Victoria 3's diplomatic plays, plus the casus belli and war score from CK3 and EU4.

**What it's for:** a reason you can read, a stake, and an ending that changes the map.

- **A war opens with a declaration naming its demands.** These come from the bloc that won the vote. Examples: "return the towns that paid us tribute", "give up Messana", "pay the costs". The history behind this is real. Dionysius's letter threatened war "unless they withdrew from the Greek cities" (14.47.1-2). In 383 he demanded that Carthage leave Sicily and pay the costs (15.15-17). Make the Victoria 3 part optional: before the shooting starts there are one or two seasons in which either side can add a demand. Each demand raises the other side's anger, and either side can back down for a price. This fixes "not clear how that happened": the war is announced beforehand, with demands and a countdown.
- **A war ledger replaces the war score.** Keep it as a short list of entries that a player can read, not a percentage. Examples: "Gela taken by Carthage, held 3 seasons", "Carthaginian army beaten at Leontini", "Panormus' farms ravaged twice". Entries come from the action log, which fits the architecture rules. Each entry tilts the war toward one side by a small, plainly labelled weight. Borrow EU4's ticking score: a town held by one side counts for more every season it stays held. Taking Gela back with one embassy then becomes a small entry, not a reversal of the whole war.
- **Peace terms with real content.** A short menu, each term with a price paid out of the ledger:
  - cede a named town
  - free a tribute town
  - pay an indemnity in silver, over several seasons
  - hand over hostages, which become people in the game who can sit on the board or die
  - send back exiles
  - recognise you as lord of the Sicels

  Diodorus gives two templates. The peace of 392 gave Dionysius the Sicels and Tauromenium (14.96.2-4). The peace after Cronium gave Carthage Selinus and Acragas' land to the Halycus, and Dionysius paid 1,000 talents (15.17.5). Both sides can offer. Carthage's peace act would propose terms from what the ledger shows, with a stated reason ("the Elders want the silver road open").
- **Avoid:** EU4's fiddly per-province peace screens, and a hidden number that decides everything. The ledger should be at most six lines, and every line should name something that happened.

## 2. War weariness on both sides, tied to existing bodies (cheap to medium; replaces the bare 0-10 anger clock as the only driver)

**Borrowed from:** EU4's war exhaustion. The difference here is that weariness lands on factions, not on a national bar.

**What it's for:** wars end because people get tired, not because a timer runs out.

- **For Carthage:** weariness raises the Elders' wish for peace and sours the Libyans.
- **For you:** it moves the citizens' mood and the rich families. The history fits. The Sicilian Greeks deserted Dionysius when he refused battle (14.61.1-3, and again at 14.96.2). Theodorus's speech blames the tyrant for devastating the land (14.65.3). So weariness should also feed plots.
- **Sources of weariness:** seasons at war, armies lost, farms ravaged, and plague.
- **Payoff:** the sword check and the board get fed by the war. That is the "persistent world" Jacob likes.

## 3. Carthage's war rhythm: campaign seasons and a wish to return (medium; changes the "libya" goal and the recall act)

**Borrowed from:** the AI pacing in Old World and Field of Glory: Empires, where enemies regroup and come back.

**What it's for:** the war never goes silent, and it doesn't feel scripted either.

- **Fixed rhythm:** a war has campaign seasons (spring and summer) and lulls (winter).
- **Lull activity:** in a lull Carthage still acts at small scale. It can raid by sea, pay silver to plotters, garrison what it holds, or work on a wavering town. Diodorus has a model: Magon won the Sicels with kindness and sheltered Dionysius's victims (14.90.2-3).
- **The Libyan revolt:** a revolt doesn't cancel the war. It sets a debt to return: "Carthage will come back once Libya is quiet." This shows as a dated warning on the danger list, an estimate rather than a promise.
- **Grievances add up:** every season Carthage's demands go unmet adds a grievance. The next landing then gets stronger, or comes with a new general who carries a new trait.
- **The randomness rule:** the timing should vary, but every landing should be announced beforehand by rumours that come from actions in the log (hiring in Europe, ships counted). That keeps CLAUDE.md's "warnings before the blow".

## 4. Armies: detachments, reinforcing, garrisons (medium)

**Borrowed from:** CK3's levies raised in the field, and Imperator's split and merge.

**What it's for:** decisions about where your men are, not about stacks.

- **Reinforcing in the field:** a muster can send fresh men to the army if it stands in or next to a friendly town. They arrive the next season. This fixes "can't muster more men".
- **Detachments:** allow one detachment beside the main army, with a hard cap of two field forces. It needs a commander from the commission seat, so commands become something the board fights over. A detachment can hold a road, guard a siege, or garrison a town.
- **Garrisons:** a town's garrison is men taken out of your field strength, and it raises the town's defence and stops it going over. Carthage should do the same. Otherwise towns flip back for nothing, which is what happened at Gela.
- **Avoid:** CK3 doom-stacks, which come from merging with no cost. Field armies need a supply limit (section 5), and that limit punishes one giant stack. Also avoid EU4 fort-and-zone-of-control micromanagement. Keep one rule from it: an enemy-held walled town on a route slows your march through it.

## 5. Supply by area: forage, ravage, supply limit (medium; replaces the single-town forage)

**Borrowed from:** Imperator's supply and foraging, and CK3's raiding. Keep the bookkeeping out of sight.

**What it's for:** war hurts the land, and the land shapes the war.

- **Foraging range:** an army feeds from towns within a few days' march. The dotted ring the other thread is building already shows this area. Each town's grain shows how many seasons it can feed an army of a given size. Bigger armies drain the area faster, and that is the supply limit.
- **Ravaging:** this is a separate order. It ruins a hostile town's crops for a year, lowers its grain, raises its fear, adds a ledger entry, and adds weariness to the side that owns the town. Ravaging is plain history. Dionysius "plundered the territory of Solus and Panormus ... and cut down the trees" (14.48.5). He "ravaged the Carthaginian territory" (14.54.4) and was "laying waste the territory" on the march home (14.55.7).
- **Denying supply:** a friendly town can refuse supply to the enemy. Agyris did this when he fed Dionysius and cut Magon's supply (14.95.4-14.96.1). That ties supply to the politics in section 6.
- **Avoid:** attrition spreadsheets. Show at most three food states (fed / short / starving) with the reason written out.

## 6. Towns' own politics: one city seat per town (medium to costly; uses board.ts, not a new system)

**Borrowed from:** CK3's county control, Imperator's province loyalty and governors, and Root's "the middle decides".

**What it's for:** Devereaux's "fracture-zone". Towns in the middle play both sides.

- **Two parties, each led by a named person:** give each town two parties instead of a single lean number. Examples: the Gela "friends of Carthage" and the "Greek party". The lean number becomes the result of which party holds the town's single seat.
- **Contesting the seat:** you can win the seat with the existing levers: a dinner, silver, a quarrel, a marriage, or a hostage. Carthage contests it with its "silver to plotters" act.
- **History:** these are documented. Catana was betrayed by its general Arcesilaus and Naxos by Procles, "won over by great promises" (14.15.1-2). Messana "could not agree among themselves about the war" (14.56.3-5). Rhegium's assembly voted down the marriage (14.44.5). Archonides founded Halaesa (14.16.1-2).
- **Payoff:** "a gate at midnight" stops being a random event and becomes a seat-holder acting on his own initiative. This gives Jacob the "NPCs taking initiative" and the DM-like events he asked for, because events grow out of the seats.
- **Allies and quarrels:** an ally's support (silver, grain, men) depends on who holds its seat. Show that on the town sheet, which answers "are allies sending support properly". Quarrels between towns, such as Leontini against Syracuse over its refugees, become terms in the existing quarrels system.
- **Cost:** this is the most work of anything here. It could start with only the four towns most fought over.

## 7. UI: the map is where you give orders (medium; the "better UI too" half)

**Borrowed from:** Total War and Mount & Blade, where you drag an army.

- **Dragging:** dragging an army shows its route, the days, its foraging area, battle odds and food state on arrival. Orders are given right on the map: march, forage, ravage, besiege, detach. That ends the tabbing between map and actions.
- **War panel:** the war ledger and its demands get a fixed panel on the Season page, as a structured block, because Jacob reads the structured parts of the screen.
- **Chronicle:** war entries in the chronicle should be one line each.

## What to avoid overall

- EU4-style micromanagement such as fort-by-fort zone-of-control rules.
- Several armies roaming freely.
- Tactical battles. Total War battles fit their own game, not this one. Battles should stay one readable roll, perhaps with a single choice before it (offer battle / hold ground / refuse). That choice is good history: refusing battle and losing allies who desert (14.61, 14.96) is a real dilemma.
- Naval war, Italy and more towns are Phase 3 or need a scope change.
- Every rule above is a switch for Jacob to turn on. All are off by default and come with numbers that are invention.

## Top five, ranked

1. **War as an object:** a declaration with demands, a ledger of named entries, and peace terms with real content (medium).
2. **Carthage's war rhythm:** a revolt pauses the war but owes a return, with small lull acts and warnings beforehand (medium).
3. **Area supply with ravaging as an order,** plus supply limits that punish one giant stack (medium).
4. **Reinforcing in the field, one detachment, and garrisons,** so taken towns stay taken unless retaken (medium).
5. **One contested seat per town,** reusing board.ts, so the middle towns have named people who change sides (medium to costly; start with four towns).

## One thing NOT to do

Don't build a hidden numeric war score, or an attrition or supply spreadsheet, as the engine of the war. Every point of pressure must come from a named event in the log that the player can read. If the player can't retell why the war ended the way it did, the system has failed. That holds however well it balances.
