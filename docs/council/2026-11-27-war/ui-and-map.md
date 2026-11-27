<!-- Council seat statement, 2026-11-27, thread 41. Written by a separate AI session given the brief in this folder (brief.md). Advice only. -->

## UI designer and artist seat: map, war and army screens

**What I looked at:** `ui/views/island.ts`, `ui/components/island-art.ts`, `docs/art-direction.md`, the art target `island-map.png`, and Jacob's screenshots (spring-403-war, gela-map, army-food, toward-you, silver-tooltip-map). I took no Playwright screenshots: the repo has no `node_modules`, so I judged from his screenshots.

**What the screenshots show:**
- The map is good. It already matches the art target and is the best thing on the screen.
- Everything around the map is text:
  - The Carthage panel is a column of paragraphs.
  - The cities table repeats the map.
  - The war shows up only as an "Also: You are at war..." line in small type.
- Orders are in a different place (the Actions menu), so Jacob tabs back and forth.
- Three things on the map read wrongly:
  - **Two reds.** "Yours" (#8e2a1c) and "your ally" (#b0563f) look alike at map size.
  - **Free towns look hostile.** "Free" is drawn in dark ink (#5a4733), so it reads as hostile or unknown. Gela was an ally but looked dark in his screenshot.
  - **Gela's sheet contradicts itself.** The fixed description says "Pays tribute to Carthage and may not rebuild its walls", while the Side line says "Your ally". The description is written once and never updates.

## Proposals

**1. ★ Orders on the map: drag along the roads (medium).** Drag your army's shield. The ghost route snaps to roads and towns; it does not move freely.
- While dragging:
  - The route is drawn in your colour.
  - Running day totals sit in the existing day rings.
  - A small flag marks where the season's 20 days (10 in winter) run out.
  - Towns out of reach go pale.
- On release, a small order card opens at the town: **March**, **Besiege**, **Forage here**, **Stay**, with the battle odds as "4 in 6".
- The Send menu is kept only as a keyboard and accessibility fallback.
- On phone: tap the army, then tap a town (no drag).
- Replaces the Send-the-army menu as the main way to give orders.

**2. ★ The 6-day sway ring, drawn by road, not compass (cheap once thread 39's rings land).**
- A plain circle would be wrong: it measures distance, but sway is days' march.
- Instead, each town within 6 days gets a halo in your colour with a small chip ("may go over, 2 in 6"), and the road stretches inside the ring get a faint ink wash.
- The ring is worked out again live while dragging, so Jacob sees what a move would sway before he commits.
- Carthage's ring appears too, as a dashed purple ring.

**3. ★ An army card on the map (cheap to medium).** A cartouche in a map corner, in the style of the "SICILY 405 to 395 BC" box.
- Men shown as small shields.
- Food shown as amphorae (two at most): full, half, empty.
- One line saying where the army eats next ("refills at Gela: friendly, grain 10").
- The army's buttons sit here: Muster more men, Forage, Disband.
- When Muster is greyed out, the reason sits beside it.
- This answers "I don't know how to feed an army" without a wall of text.

**4. ★ The war ledger (medium; the rules come from other seats).** It replaces the "Also: at war..." line with one ruled strip at the top of both the Season page and the Island page:
- **War with Carthage since spring 403 BC.** Why it began, in one line (for example, "anger reached 7: the riot for bread").
- **War score as a rope** with each town as a bead on your side or theirs. That makes it readable in one look.
- **Weariness for both sides** as a ledger figure, in the same style as Silver and Grain.
- **What Carthage wants**, in one sentence: "Gela and Acragas back, and 300 talents".
- **Peace terms on offer**, if any.
- When the war is quiet, the strip says why ("Carthage's army is in Libya; the Libyans are in revolt"). That answers "they haven't been back".

**5. ★ Carthage's army and intent drawn on the map (cheap).**
- When the army is not on the island, it sits on the "To Carthage" sea lane as a stack of purple shields ("15,000 hired, waiting at home"), so the threat stays visible.
- Each Carthaginian army on the island shows its general's order as a dashed purple arrow ("Himilcon: march on Syracuse").
- This puts the warning before the blow onto the map itself.

**6. A battle plate readable at a glance (cheap to medium).** One catalogue plate:
- Two columns, one coin token per general.
- Each modifier as a small stamped token: "+3 men", "+1 own ground", "-1 hungry", "+1 you lead".
- The die drawn as a die face.
- The result as a red-figure tondo (a hoplite or a rout), with one line of losses.
- Before the march, the same plate shows a blank die and "4 in 6", so the odds and the result look the same.
- No paragraphs.

**7. Town cards with the town's own politics (medium; needs the town-politics rules from other seats).**
- The head is a side ribbon plus a coin placeholder for the town's leading man (for example, Archonides at Herbita).
- A two-pan scale or three small groups for the town's parties (for you / for Carthage / for themselves), each with its leader's name.
- At most four fact lines (walls, grain, men, fear), then action buttons.
- The fixed description is rewritten from the town's current side, so it can never contradict it.
- The "Toward you" line becomes a five-step word track, like the mood track.

**8. Supply and ravaged land in pen and ink (medium).**
- Farmland is drawn as a stippled ochre patch round each town.
- **Foraged:** cross-hatched stubble.
- **Ravaged:** broken scorch strokes that fade back over the seasons.
- While dragging, the forage area round the drop point is shaded.
- Grain is shown as 0 to 3 small sheaves by each town, instead of "10 months".
- Fits the art direction: no glow, no gradients.

**9. Side colours as patterns, not two reds (cheap):**
- **Yours:** solid red.
- **Ally:** red outline with hatching.
- **Free:** bare ink outline.
- **Pays tribute to Carthage:** purple outline.
- **Carthage's:** solid purple.
- **Exiles:** solid blue.

Also move the key into a cartouche inside the map frame. This also fixes the "Gela is my ally but doesn't show it" complaint.

**10. Carthage's council as a picture (cheap to medium).**
- The four groups (the three voting blocs and the Libyans) as coins in a half circle, like a council chamber.
- Each coin is tagged with what that group wants ("War on the tyrant").
- The goal in one line.
- The anger track with the 6/7/8 marks.
- Only the next two acts are shown; the rest, and the men, sit in a fold.
- Today's paragraphs go into a "Why" fold.

**11. Season replay on the map (medium).**
- After End season, faint ink trails show where each army moved.
- Crossed spears mark where a battle was fought.
- A town that changed sides pulses once.
- Gives the war a story you could retell without reading the log.

**12. Fold away the cities table (cheap).** It repeats the map. Behind an "All towns" fold.

**13. Phone width, 390 px (cheap to medium):**
- Map at full width; the town card or order card slides up as a bottom drawer at half height.
- Tap-tap orders instead of drag.
- The war ledger shrinks to one line of chips ("War · score 2 your way · Carthage wants Gela").
- The Carthage panel sits behind a tab under the map.
- The army card docks below the map.

## Top five, ranked
1. ★ Orders on the map: drag or tap along the roads, with the ghost route, day totals and the season's limit (#1, with #3's army card).
2. ★ The road-based 6-day sway ring, live while dragging, plus Carthage's ring (#2).
3. ★ The war ledger strip: aims, score as a rope, weariness, what Carthage wants, why it is quiet (#4).
4. ★ Carthage's army and intent shown on the map and the sea lane (#5).
5. ★ Side colours as patterns, and town cards rewritten from the town's current side (#9 and #7). The cheap half (#9 and the description fix) can ship now.

## One thing NOT to do
Don't let armies move freely to any point on the map, and don't add a hex grid. The simulation is a graph of towns and roads, and towns going over, supply and battles all count days along roads. Free movement would mean rebuilding movement, saving and determinism for a look we can get by snapping to the roads. Keep the drag, keep the roads.
