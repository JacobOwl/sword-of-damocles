# Focus 1: War and geopolitics (council, 2026-11-27)

Thread 41. **Design only: nothing here is built, and no rule changes until Jacob picks.** Every rule change would be a switch, off by default, until he says it is core. All numbers would be invention.

His words: "I want a war and geopolitics focus project. Make towns have some independent politics. More events. The better map and army controls. Battle system rules. War system. Other stuff. Have council do a deep dive. Look at other games for inspiration." Then: "Better ui too." This is the first of the Paradox-DLC-style focus projects he asked for (one big theme a phase, beside the usual fixes).

**How it was run.** Five seats, each a separate AI session with the same brief, writing alone: a historian (Diodorus), a strategy-game designer (CK3, EU4, Imperator, Victoria 3, Field of Glory: Empires), a board-game designer (Root, Oath, Arcs, Pax Pamir, Hannibal: Rome vs Carthage, Twilight Struggle, Republic of Rome), a UI designer and artist, and a player-and-story seat who also guards scope. Their full statements and the brief are in `docs/council/2026-11-27-war/`. Other games are described from memory, not re-checked. History: `docs/research/war-and-towns.md` (new card, every quote opened).

## In five lines

1. **In his second test the war happened to him.** It started with no warning, had no aims, cost him nothing at home, went quiet when Carthage went home, towns came back for 1 silver, and it never ended. All five seats agree this is a missing *war system*, not missing battle detail.
2. **A war becomes an object:** why it began, each side's aim, a short ledger of what happened, weariness on both sides, and a peace with real terms (towns, silver, hostages, the Sicels).
3. **Towns become people, not a number:** each town's three leading houses (they already exist in the census) lean to you, to Carthage or to themselves, and that decides the town's side. Gates open from inside; towns split; news of a defeat brings a purge.
4. **Carthage never goes silent and never comes without warning,** and the more you hold, the bigger its next expedition (a pendulum, not a script).
5. **Orders move onto the map,** dragged along the roads, with the war ledger and Carthage's next move drawn where he already looks.

## What exists now, and what thread 39 is adding

Today a war is one flag. It starts when Carthage's anger reaches 6, 7 or 8 (by bloc), ends only as "each keeps what it holds", and pauses whenever the Libyans revolt. Towns have a side, a lean and a fear number; an embassy is one roll. One army, mustered at Syracuse only; battles are one die each plus strength. Details: `src/core/island.ts`, `src/core/carthage.ts`.

**Thread 39 (building now, the baseline for everything below):** click a town on the map to send your army, with the odds; rings on towns within 6 days of your army; the army card explains feeding; muster says why you can't add men in the field; Carthage's anger track marks 6, 7 and 8 and warns a point early; the guard dies only in battle; and its council (`docs/council/2026-11-27-second-test-rules.md`) picked two Carthage switches: `carthageHolds` (for 8 seasons after Carthage takes a town, embassies and going over are harder; no garrison object) and `libyaSpared` (Carthage stops levying the Libyans once they are Angry, the traced cause of the long revolts; no cap on the revolt). It parked ravaging, Carthage's diplomacy while recalled, and dragging armies with area foraging, which this proposal picks up. Nothing here redoes that work: 4A's garrisons would build on `carthageHolds`, and 3A's return after a revolt on `libyaSpared`.

## Where the five seats agreed

- The war needs **a face, a price and an ending** before it needs better battles (all five).
- **No tactical battlefield, no hexes, no free movement.** The game is towns and roads counted in days; keep it (all five).
- **Every pressure must be a named thing the player can read**, never a hidden war score or a supply spreadsheet (strategy, UI, player).
- **Refusing battle should cost allies and patience**, as it did Dionysius twice (14.61.3, 14.96.2) (all four rules seats).
- **Events come from the war's state and each costs someone**, shown among the matters before you, never as popups.

## Where they disagreed

- **What to build first.** The player seat: the war card and crises first, battles and dragging last ("they make the war deeper to operate but no more retellable"). The UI seat: orders on the map first, because the tabbing annoyed him every season. *Council's call: the war first, with the cheap map items alongside.*
- **How much town politics.** The player seat wants one named leader per town; the strategy seat two parties; the board-game seat three houses with tokens (reusing the census); the historian parties with news as the trigger. *Council's call: the three houses, because they already exist.*
- **Battles.** The board-game seat and the historian want a one-screen battle with a plan, a stratagem, a reserve and named wing commanders. The strategy seat wants only one choice before the roll. The player seat says later. *Council's call: build it last, and only if the war works.*

## Seven questions for Jacob

Each has a recommended option (★). The cost marks are cheap, medium, costly.

### Q1. The war: what is a war?

- **1A. Aims and terms (cheap to medium).** A declaration names each side's aim; peace offers a few real terms instead of "each keeps what it holds".
- **1B. The war card ★ (medium).** One card on the island tab and the season page:
  - **Why it began**, each point of anger with its cause.
  - **Aims:** Carthage's from the bloc that won the vote ("drive the tyrant from the Greek cities"); yours you choose ("take Motya", "free the Greek cities", "the Sicels for me").
  - **The ledger:** at most six lines of named events ("Gela taken by Carthage, held three seasons", "Panormus' farms burned twice"), each tilting the war a little. A town held longer counts more, so a town retaken by embassy is a small line, not a reversal.
  - **Weariness for both sides.** Carthage's moves its blocs toward peace and the Libyans toward revolt; yours lands on your factions (the citizens, the rich, the guard), so a long war feeds the plots that actually kill you.
  - **Peace terms** from a short menu, offered by either side when weariness or the ledger allows: cede a named town, free a tribute town, silver paid over several seasons (either way), hostages (who become people), exiles sent home, the Sicels to you. History has all of them (14.96.4, 15.15.4, 15.17.5).
- **1C. As 1B, plus a stand-off before the war (costly).** One or two seasons of demands before the fighting, Victoria 3 style, each side able to raise its demand or back down at a price; and a truce that can be a trap (15.16.1-2).

### Q2. Towns: how independent?

- **2A. One leader per town (cheap to medium).** Each town has a named first man with a want (land, revenge, a marriage, to be left alone) and a price, or none (Phyton of Rhegium would not sell, 14.112.3).
- **2B. Town boards ★ (medium to costly).** The three leading houses each town already has (census) become its three seats. Each leans *to you*, *to Carthage* or *to the town alone*, shown on the town card with the head's name and want. The first man plus one more decides the town's side; the old lean becomes their sum.
  - You win houses with things you already have: a dinner, a marriage, silver, land promised, a son as hostage (the Campanians, 14.61.6). Carthage wins them with silver and kindness (Magon, 14.90.3).
  - **Gates from inside:** a house of yours in a town you besiege may open a gate (Catana and Naxos, 14.15.1-2). "A gate at midnight" stops being luck.
  - **A divided town** (three houses, three ways) sends no men or silver and falls to the first army (Messana, 14.56.3-14.57.3).
  - **News is a trigger:** a defeat anywhere lets the hostile houses banish your friends (14.88.5).
  - **When Carthage takes a town it seats its friend as first man.** Getting Gela back means turning two houses, not one roll.
  - An ally's silver, grain and men depend on who holds its seats, shown on its card (his "are allies sending support properly").
  - Start with the four most fought-over towns if the cost bites.
- **2C. As 2B, plus town assemblies and quarrels between towns (costly).** A town's assembly can stone its own generals after a missed chance (Acragas, 13.87.5) and towns quarrel with each other through the existing quarrel rules.

### Q3. Carthage: the rhythm of its wars, and the difficulty

- **3A. A war that comes back (cheap).** A Libyan revolt pauses the war but owes a return, shown as a dated warning ("Carthage will come back once Libya is quiet"); in the lull Carthage still raids by sea, sends silver to plotters and courts wavering towns.
- **3B. The pendulum ★ (medium).** 3A, plus:
  - **The more of the island you hold, the more Carthage's blocs unite.** Past a line the council votes a great expedition, announced with its size and the season it is due. "In control of everything" becomes the season before the blow, with warning.
  - **Newly taken towns are loosely held** for a few seasons; each town beyond a few needs a garrison or a friendly first man.
  - **Generals with a standing at home.** Himilcon and Magon each have a visible goal, a record and the council's backing; a failure disgraces or recalls him and the next man brings a different method (Himilcon by force and treachery, 14.55.4; Magon by kindness, 14.90.3). The second war feels different because the enemy is a different man.
- **3C. As 3B, plus a binding decree (medium to costly).** Carthage's goal each season becomes a public decree, as the Eyrie's in Root; if it cannot carry it out its blocs sour toward revolt. You can target the decree and make Carthage turn on itself.

### Q4. Armies and supply

- **4A. The missing basics (cheap to medium).** Reinforce an army in the field (fresh men arrive next season if it stands in or next to a friendly town); garrisons, yours and Carthage's, that stop a town going over; a **Ravage** order that burns a hostile town's crops for a year, raises its fear and its owner's weariness (14.48.5, 14.62.5).
- **4B. Supply by area ★ (medium).** 4A, plus: an army feeds from friendly towns within a few days' march, and a big army eats an area faster (that is the brake on one giant stack). Food shows as three states (fed, short, starving) with the reason in words. A lord like Agyris feeds one side and cuts the other's supply (14.95.7-14.96.1). Waiting fills a track, **the levy wants battle**: each season you avoid a fight, allies and citizens drift home (14.55.5, 14.61.3, 14.96.2).
- **4C. As 4B, plus one detachment (costly).** A second, smaller force under a named commander, at most two in the field. Commands become seats the board fights over; a commander who wins without you rises against you (14.64.3).

### Q5. Battles

- **5A. One choice before the roll (cheap).** Offer battle, hold your ground, or refuse it (and pay in patience).
- **5B. A battle on one plate ★, built last (medium).** Same numbers underneath, three choices on one screen:
  - **The plan:** hold the line (safe, draws likely), strike a wing (bonus if theirs is weaker), or a combined attack (biggest bonus, but each part rolls to arrive in time, which is how Gela was lost in 405, 13.109.4-13.110.4).
  - **One stratagem, earned from the state of the game, never drawn at random:** a night march if you did not move last season; ships against the beach camp if your fleet is at sea; spend the men you distrust (14.72.2-3), which wins but loses the guard's loyalty.
  - **Named wing commanders and a reserve.** A commander's death can break a winning line (Leptines, 15.17.1-2) or open peace talks (Magon at Cabala, 15.15.4); a reserve turns a rout into a retreat to camp (15.17.4). Leading from the front adds a warning before the roll, never after.
  - Carthage's general's habit is printed on the plate ("Himilcon is bold"), so the plan is a read of the enemy.
- **5C. A tactical battle game. Not recommended** by any seat.

### Q6. The map and the screens (his "better UI")

All in the museum-catalogue look, no ids or code numbers. Starred are the UI seat's top five.

| | Item | Cost |
|---|---|---|
| ★ | **Orders on the map.** Drag your army's shield along the roads (it snaps to roads, it doesn't fly): the route in your colour, day totals in the road rings, a flag where the season's march runs out, unreachable towns pale. On release, an order card at the town: March, Besiege, Forage, Ravage, Stay, with the odds as "4 in 6". On a phone: tap the army, tap a town. The menu stays as a fallback. | medium |
| ★ | **The 6-day sway counted by road, live while dragging:** a halo on each town that might go over, with "2 in 6"; Carthage's in dashed purple. | cheap once thread 39's rings land |
| ★ | **The war strip** at the top of the season page and the island: since when, why, aims, the ledger as a rope of town beads, weariness, what Carthage wants, terms on offer; when the war is quiet it says why ("Carthage's army is in Libya; the Libyans are in revolt"). | medium (needs Q1) |
| ★ | **Carthage's army drawn even when it is at home:** purple shields on the sea lane ("about 15,000 hired, waiting at home"), and on the island a dashed arrow with its general's order. | cheap |
| ★ | **Side colours as patterns:** yours solid red, ally hatched red, free a bare outline, tribute purple outline, Carthage's solid purple; the key in a cartouche inside the map. And town descriptions written from the town's current side (Gela's card said "pays tribute" beside "your ally"). | cheap |
| | **An army cartouche on the map:** men as shields, food as amphorae, "eats next at Gela", the army's buttons with the reason when one is greyed. | cheap to medium |
| | **The battle plate:** two columns, a coin per general, each modifier a stamped token, the die as a die face; before a march the same plate with a blank die. | cheap to medium |
| | **Town card with its houses** (Q2): side ribbon, the first man's coin, three houses each with a name and a lean, four facts, then actions. | medium |
| | **Farmland in pen and ink:** foraged land cross-hatched, ravaged land scorched and fading back; grain as 0 to 3 sheaves. | medium |
| | **Carthage's council as a half circle of coins**, each with what it wants; the paragraphs go into a "Why" fold. | cheap to medium |
| | **The season replayed on the map:** faint trails where armies went, crossed spears where they fought, a town that changed sides pulses once. | medium |
| | **Fold the cities table** (it repeats the map). | cheap |
| | **Phone:** map full width, town and order cards as a bottom drawer, the war strip as one line of chips. | cheap to medium |

### Q7. Events from war and diplomacy

Each fires from the war's state, at most once a war, and costs a faction, an ally or a named person, so the outcome line alone never decides it. All data, in `data/island-events.json`, in "Matters before you". Two exist already and would be tied to state.

| Matter | Fires when | The choice | Source |
|---|---|---|---|
| The army wants battle | the patience track is full | fight against the odds, or wait and lose allies | 14.61.1-3, 14.96.2 |
| The enemy's bargain (exists) | Carthage's army is beaten and trapped | let it go for silver in secret (and keep Carthage feared), or destroy it | 14.75.1-3 |
| The town that cannot agree | an ally is divided and threatened | send men you need elsewhere, or let it go | 14.56.3-5 |
| The lord who can feed you | short of food near a Sicel lord | land promised for his grain and men | 14.95.4-7 |
| A gate from inside | a house of yours in a besieged town | pay the traitor his price, and the town remembers | 14.15.1-2 |
| Your friends driven out | a defeat anywhere | march to save them, or let the purge stand | 14.88.5 |
| The general who would not sell | a captured enemy leader | spare him, or make an example (your soldiers protest) | 14.112.2-3 |
| A victor's welcome | your commander wins without you | honour him (he climbs the ladder) or slight him (a grudge) | 14.64.3 |
| Peace envoys | the other side's weariness is high | take the terms (whoever wanted more is angry) or press on | 14.96.3-4 |
| The truce of a few days | you won a battle and Carthage asks a truce | grant it (and their new general drills) or refuse | 15.16.1-2 (pattern) |
| Unpaid men | your hired men are owed two seasons | pay, pay in land, or risk them going over | 13.88.2-3, 14.78.2 |
| The levy goes home for the harvest | summer, the patience track high | release them, or keep them and anger the citizens | invention |

## Build stages, if he picks the stars

Each stage is playable, testable and ends with a short test of ten seasons.

1. **A war with a face and an end.** The war card (1B), weariness and terms; Carthage's return and the pendulum (3B); the first six war matters (Q7); the war told as one chapter of about 150 words in the chronicle (his "WAY too long"). Cheap map items alongside: the war strip, Carthage drawn at home, side colours as patterns, town descriptions fixed. *His next test should hold a whole war, from declaration to treaty.*
2. **Towns that choose.** Town boards (2B), garrisons, gates from inside, divided towns, news purges; the town card; the rest of the war matters.
3. **Moving and feeding.** Dragging along roads with the live sway ring; the army cartouche; reinforce in the field; area supply, ravaging and the patience track (4B); ravaged land drawn on the map.
4. **The battle plate (5B),** and the season replayed on the map. Only if stages 1 to 3 made the war worth fighting.

## Scope flags (Jacob's call)

- **A test that starts near the war.** The player seat suggests a preset starting about 398 so ten seasons are a war. `docs/scope.md` lists "choosing the start date" as out; a fixed later-start preset for testing is a different thing, but it needs his say.
- **Patterns from outside the decade.** The treaties of 392 and the 380s, Cabala and Cronium, Phyton (about 387) are used for the *shape* of terms and battles, never as dated events in 405 to 395.
- **Hostages as people** add people to the cast; detachments mean a second army. Both fit Phase 2 as written, but they grow it.
- **Out of this focus** (Phase 3 or a scope change): a naval war beyond the interception roll, Italy and Rhegium as playable, more towns, the mercenary market.
- **A "focus" in `scope.md`.** If he likes focus projects, `scope.md` could name the current focus beside the phase. Not changed here.

## Parked (to `docs/later.md`)

Polyaenus' trick of sparing certain men's lands to make their town suspect them (5.2.18, late and doubtful); moving a beaten town's people to Syracuse (Caulonia, 14.106.3; already parked for Gelon in Phase 3); a binding decree for Carthage if he picks 3B and not 3C; area foraging as a separate order from Ravage (folded into 4B here).

## Risks

- **Too much at once.** Seven questions; the stages exist so only stage 1 is built before his next test.
- **Weariness that only ever ends wars.** It must also start them: Carthage's weakness should invite your declaration (14.41.1).
- **The pendulum as a rubber band.** Count how often the great expedition comes and whether it ever wins; never tune it to history's map.
- **Too many matters a season.** War matters share the board's cap of two a season.

## Jacob's picks

(Empty until he picks.)
