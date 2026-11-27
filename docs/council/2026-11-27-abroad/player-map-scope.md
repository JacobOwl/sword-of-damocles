# Seat: player, map and scope (council on going abroad, 2026-11-27)

Design only. Nothing here is built. Every rule would be a switch, off by default. Games are cited from memory and not re-checked. Passages are the ones in the brief, from the saved Diodorus and Polybius; anything else is marked unverified.

## 1. Speaking for the player

Jacob's third test (`docs/playtests/2026-11-27-jacob/notes.md`): "far too easy", "boring", "felt mastered". One big army walked the island. Carthage was broke and went home. Money and prison never bit. The war council (`docs/playtests/2026-11-27-war-council/report.md`) found the same: Carthage leaves within about 3 seasons of landing, and the second half of the 14 seasons is empty.

So the test for anything abroad is not "is it history" but "does it make the second half hard and worth retelling". More buttons fail that test. A choice with a price passes it.

Three stories he might retell, each from a passage:

- **"I left Syracuse to burn Carthage's fields, and my keeper nearly sold the city."** Agathocles left a garrison and his brother Antander as "curator of the city" (Diodorus 20.4.1). The council in Carthage then fought itself: Hanno and Bormilcar "had an inherited feud", and Bormilcar wanted tyranny (20.10.1 to 20.10.2). This is the story the game already half has: the commission switch names a keeper, and plots grow while you are away.
- **"Sparta saved me and then stopped me."** Polyxenus came back with thirty ships and Pharacidas as admiral (14.63.4). Later Pharacidas blocked the Syracusans' bid for liberty (14.70.1 to 14.70.3). Help that comes with a man who has his own aims is a story. Help that is just "+3 ships" is not.
- **"Rhegium said no, so I married into Locri."** Already an event (`rhegiumRefuses`, 14.44.5 to 14.44.6), but it leaves no mark. It should: Rhegium cold, Locri warm.

The smallest version that gives those stories:

1. Three outside powers as cards (Sparta, Locri, Rhegium), each with a mood and two or three actions.
2. One crossing to Libya, as a gamble: a small strip of three or four places, the army away for one to three seasons, a keeper at home, and Carthage's council forced to choose between its farmland and your city.

Not a diplomacy screen. Not a second campaign map with full logistics.

## 2. Map and UI

Three options for showing powers off the island.

- **A. Points and arrows on the edge** (the current "To Carthage" lane in `ui/components/island-art.ts`). Cheap. Rhegium already sits inside the map's frame (the box runs to 15.75 E and 38.45 N; Rhegium is at about 15.65 E, 38.1 N, from memory, check before drawing). So Rhegium can be a real point across the Strait with a sea lane to Messana. Locri is just past the east edge. Greece is far east.
- **B. A row of cards under the map**, one per power. This is Oath's way (from memory): the far lands are a row of site cards, not a drawn map. Also Pax Pamir (from memory): the off-board empires are tracked by their coalition and loyalty, not by territory. Each card shows the power's name, a coin or emblem from the art library, its mood word, what it wants, and its two or three actions. Cheap to medium.
- **C. A second small map for Libya** that opens as a tab beside "Sicily" when your army is there, or when Carthage's Libyan subjects are in revolt. Medium.

**My pick: A plus B now, C only with the crossing.** Rhegium becomes a node. Locri, Sparta and Corinth are edge arrows ("To Locri, a day's sail", "To Greece, about N days", days unverified) that open their card. Libya is first a strip of three or four site cards in the Oath style (Carthage itself, the rich farmland of 20.8.3, a Libyan town that can come over per 20.17.1, the landing beach). Draw a real small map only if the strip feels thin in play. That keeps the museum look and avoids a wall of boxes.

**Desktop:** one row of cards under the map. The Carthage panel stays. In Libya, the Libya strip takes the city table's place.

**Phone:** the map already opens on the wrong half (war council). No second map beside it: two tabs above the map ("Sicily", "Libya"), and cards stacked under it, folded to name and mood until tapped.

Mood as words, never numbers.

## 3. Scope and engine fit

The code already has: `Army.at` as a node id, the sea interception roll (`src/core/carthage.ts`), the keeper (`src/core/commission.ts`), Carthage's blocs (`data/carthage.json`), and outside powers as names (`data/outside.json`).

**Cheap (an hour or so each)**

- Rhegium as a ninth town node with a sea route to Messana. Same schema, so thread 47's terrain and contingents apply to it.
- Outside powers as data: give each entry in `outside.json` a mood, a goal and a short action list, worked by a priority list. This copies the Carthage bloc pattern. It is the Root Vagabond's relationship track (from memory): each faction sits on a track from hostile to allied, you climb it by aiding them, and attacking drops you to hostile at once. One ladder per power, one reason logged per step.
- Actions with passages behind them: **ask for help** (14.62.1, Polyxenus to the Italian Greeks, Sparta and Corinth); **ask for a bride** (14.44.3 to 14.44.6, Rhegium and Locri); **give land** (14.44.3, Messana); **hire Spartan men** (14.58, as the brief marks it: check the section). Each reuses an existing roll: the embassy, the marriage event, the hire action.
- The help that arrives carries a person. Pharacidas comes with the ships and joins the court with his own aim. That is one person record, not a system.

**Medium (a session or more each)**

- **The crossing.** A sea route from Syracuse to a Libyan landing, guarded by the existing interception roll. Hannibal: Rome vs Carthage (from memory) does this: an army can sail to Africa, but each crossing risks the navy roll, and Carthage's Senate may recall Hannibal when Africa is threatened. That recall is the whole point here.
- **The army abroad.** Libya's places as nodes in a separate list, so `Army.at` can hold them. Food does not resupply from Syracuse; it comes from ravaging the farmland (20.8.3) and from towns that come over (20.17.1). The keeper rule from the commission switch runs unchanged at home. Republic of Rome (from memory) adds the right danger: a commander who wins abroad comes home popular and dangerous. If you send Leptines instead of going, his victories raise his standing.
- **Carthage's answer.** A new goal for its council, "Save the farmland", that recalls its army from Sicily. The Libyan subjects bloc already exists; your army in Libya lowers its mood, and Angry Libyans revolt (the revolt rule is invention until 14.77 is saved). The blocs then split over whether to save Libya or press Syracuse, as Hanno and Bormilcar did.

**Costly (do not do in the first version)**

- Carthage as a city you can besiege like any town. Neither Agathocles nor Regulus took it. Polybius has Regulus offer terms "so severe" that Carthage refused, then Xanthippus retrains them and wins (1.31 to 1.34, saved, per the brief). Better: Carthage is a place you can threaten, not take. Your pressure counts in its war weariness and its council's mood.
- Orders that take seasons to arrive; naval battles beyond one roll.

**Near-war test (spring 398, 14 seasons).** What fits: Sparta, Locri, Rhegium and Corinth as cards; the bride, help, land and hiring actions; Pharacidas as a person. All of these happen in 398 to 396 in Diodorus. The crossing does not happen in this decade. Dionysius never went to Libya. It is a plausible what-if with Agathocles as the model, about 90 years later. It could be a switch labelled "invention, after Agathocles" in this test. Its natural home is the Agathocles campaign that `docs/full-game.md` already sketched for about 310 BC.

Later campaigns: the Italian league and the Lucanians (14.100.5, 14.101.1), Croton and Heloris (14.103.4), Olympia (14.109), Athens (not saved). All after 395.

**Scope lines Jacob would change** (`docs/scope.md`, only by a logged decision):

- Out: "Italy and Greece as more than names". Change to In: "Italy and Greece as a few cards (Sparta, Corinth, Locri, Rhegium) with a mood and a short menu, each action from a passage."
- In, new: "Rhegium on the map." It is a town, not a new system.
- In, new, as a switch: "One crossing to Libya, after Agathocles: a strip of three or four places, an army away for seasons, a keeper at home." Or park it for Phase 3.
- Out stays out: "naval battles beyond a single interception roll". The crossing uses that roll.

**Threads 46 and 47.** The crossing, burning the ships (20.7) and Pharacidas's veto are big scenes for thread 46. Libyan towns that come over would send contingents (thread 47). Spartan hired men could be a unit type there. Libya's places should be ordinary nodes so terrain fields fit.

## 4. What not to do

- No "improve relations" button you press every season. That is the EU4 grind (from memory) and it is the "more buttons" failure.
- No message from every power every season. Jacob dislikes CK3-style repeated popups. At most one foreign moment a season, and powers act only when their goal says so.
- No whole Mediterranean map. Four cards and a strip.
- No Carthage siege that ends with Carthage taken.
- No foreign friend that is only good. Sparta's help came with a veto (14.70). Every gift should carry a man, a debt or a grudge.
- Do not let the crossing become the new easy win. Before building, a batch should show the keeper losing the city, or the army stranded, in a fair share of games. Count, don't tune to history.
- Do not call the Libyan revolt history until 14.77.1 to 14.77.3 is saved.

## What I would pick

Cards for Sparta, Locri, Rhegium and Corinth plus Rhegium on the map, for the Near-war test. That is cheap and it is all 398 to 396 history. The crossing to Libya as a medium switch, built after the cards. It should be tested first in the 398 test as a labelled what-if, and kept for the Agathocles campaign as its real home.
