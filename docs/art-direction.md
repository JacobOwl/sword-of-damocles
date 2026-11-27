# Art direction

Written by the art thread (thread 12), 2026-11-22. Jacob owns the look: everything here is a proposal until he says so, and every rule can be changed by a logged decision. All drawn art is **invention** (no source shows these scenes). The few motifs with a source are listed at the end, with the source.

## The idea in one line

**The game is a museum catalogue of one reign.** The pages are the curator's parchment and ink. The objects on them are what Syracuse itself made: struck silver, painted cups, pebble floors. The interface is the catalogue; the art is the collection.

That keeps the game matching The Phoenician-Punic World site (same parchment, ink and type) while giving it its own objects.

## Four materials, each with one job

| Material | Where it appears | Why |
|---|---|---|
| **Parchment and iron-gall ink** | Every screen: text, ledgers, rules, menus | It is the catalogue. Calm, readable, never in the way. |
| **Struck silver and bronze** (coins) | Portraits, the ledger's numbers, the title's coin tray | Power held as objects. Each person is a coin; the ruler's money is literal. |
| **Red-figure pottery** (clay-orange figures on black glaze) | Event pictures, painted in the round of a drinking cup; the title scene | Events are stories, and Greeks told stories on cups. The round tondo gives every event the same frame, so 52 events can share a dozen pictures without looking random. |
| **Black-figure silhouettes** (black glaze on clay) | Icons: factions, offices, action areas, stores | A silhouette reads at 16 px where line art does not. One style for every icon. |

Mosaic (pebbles and tesserae) is the fifth thread running through: the portraits are mosaic coins already, and the borders that frame big moments (title, season cards, the ending) are a band of tesserae.

**Rule:** a material is never used for another's job. No pottery-style buttons, no coin-style text boxes. That is what keeps it from becoming a wall of boxes.

## Colour

The parchment palette stays exactly as on the site. Added:

| Token | Colour | Use |
|---|---|---|
| `--glaze` | #1d1410 | Black glaze: tondo grounds, icon fill |
| `--clay` | #c8743a | Terracotta: figures in the tondos |
| `--clay-light` | #e0a066 | Highlights on clay |
| `--silver` | #b9b6ad | Coin rims, the sword's blade |
| Faction: ruler and family | #7a2e24 | Same as the blood-red coin fields |
| Faction: rich families | #2a4a5a | Same as the deep sea-blue coin fields |
| Faction: citizens | #5a5a28 | Same as the olive coin fields |
| Faction: guard | #2f5e57 | Same as the teal coin fields |

Purple (`--punic`) stays reserved for Carthage, as on the site. Red (`--blood`) stays reserved for danger. Faction colours are used only as small marks (an emblem, a rule, a coin field), never as large fills.

**Changed:** the fallback portrait circles used colours that did not match the coins (the guard was red, the family purple). They now use the coin colours above.

## Type

No change to the three faces: IM Fell English SC (display), IM Fell DW Pica (body), Cormorant Garamond (numbers). Added:

- **GFS Didot** for Greek capitals only: coin legends (ΣΥΡΑΚΟΣΙΩΝ) and names on the title coin tray. Greek is decoration, never the only label: an English name always sits beside it.
- **Inscriptions** (the title, the ending stele, season cards): display face in spaced capitals, letter-spacing about 0.18em, like letters cut in stone.
- **Drop capitals** open each year of the chronicle and each season card.

## Iconography

One set, drawn in `ui/icons.ts` as inline SVG, on a 24-unit square, filled silhouettes in black glaze (or the faction colour), no outlines, no emoji.

| Group | Icon | Why that object |
|---|---|---|
| The ruler | A sword hanging point down | The title |
| The ruler's family | A hearth with flame | The household |
| The rich families | A horse | They were the cavalry (the start text: their cavalry rode home ahead of you) |
| The common citizens | An ear of grain | Bread and the assembly; grain-ear wreaths are on the city's coins |
| The guard | A crested helmet | Hired spears |
| Carthage | A palm tree | The tree on the coins struck in Punic Sicily (general knowledge, unverified against a saved source) |
| Citadel | A walled tower | |
| Treasury | A strongbox | |
| Mint | A coin with a dolphin | Dolphins ring Arethusa on the city's coins |
| Fleet | A warship's prow and oars | |
| Generalship | A round shield and spear | |
| Assembly | Voting pebbles on a speaker's step | |
| Court actions | A drinking cup | Feasts and favours |
| City actions | A column | |
| War actions | Crossed spears | |
| Spies | An eye | Eyes painted on cups to ward off harm |
| Embassy | A herald's staff | |
| Scheming | A dagger | |
| Silver, grain, land, guard, defense, influence | Coin, grain ear, boundary stone, helmet, shield, laurel | |

## Event pictures

Each event names a picture (`art` in `data/events.json`, a word like `ship` or `feast`). The picture is a red-figure tondo: a clay-orange emblem on black glaze inside a ring of the meander. About sixteen emblems cover all 52 events: feast cup, ship, storm wave, fire, wheat and ship, coins, sealed letter, wedding torches, a bed of sickness (the staff of Asclepius), an omen (eagle and snake), dice, lyre, spear and shield, the citadel, the assembly, Carthage's palm, a dagger, a mask for the whispered and secret. A test fails if an event has no picture or names one that doesn't exist.

**The island's events** (`data/island-events.json`) add their own emblems in the same style: a town gate under a crescent moon (treachery at midnight), a siege tower against a wall, amphorae and wheat (supply), tents under circling birds (a camp, and plague), and, with the second slice, a herald's staff (embassies), a walled hill town (the Sicels) and the sign of Tanit between two columns (Carthage's council).

**People, since the second round.** Eight pictures now show figures drawn as red-figure painters drew them (`ui/figures.ts`): a man reclining at a feast, a speaker in the assembly, a veiled bride with a torch-bearer, a woman at the hearth, a hoplite, two men whispering, a sick man and his physician, a man reading a tablet. Figures are left in clay; hair, beards, eyes and folds are black glaze, with a thin clay line round the black hair as the painters left it. The rest stay emblems, which carry the story the way a shield device does.

**The art library's scenes (thread 40, 2026-11-27).** 39 more tondos drawn for the art library (`assets/library/made/events/new/`, from `assets/library/tools/lib/tondos.mjs`) are now game pictures too, copied in by `scripts/build-library-art.mjs` into `ui/components/library-scenes.ts`. 32 of them now give their own picture to events that shared a generic one: Damocles' banquet has the sword on a hair, the charge against Doris a trial, the Hundred's audit of the general a trial, terms of peace a treaty, the first man on the wall a trophy, Punic silver for a captain a bribe, Carthage's fleet in the Great Harbour the Punic fleet, and so on. Seven wait for an event: poison, a beacon, Arethusa, an eagle, winter, summer, the vintage. The test now requires every game picture to be used, but lets library scenes wait.

**Carthage's faces and coin.** Carthage's council (Himilcon, Magon, Hanno the elder, Bomilcar) has faces on the island view: the library's flat coin medallions on Punic purple, not the mosaic portraits, so Carthage's men look foreign beside the Syracusans. The panel's head carries Carthage's first coin type, a horse and a date palm (sourced in `docs/research/art-motifs.md`). The faces are invention.

## Signature pieces

1. **The sword overhead.** In the masthead a sword hangs by a single hair. It reads only what you know: the further the worst known plot has come (Whispers, Rumors, Named), the thinner the hair, the lower it hangs and the more it sways. At Named it trembles. With no warnings it hangs still. A tooltip says why. It never shows a plot you have not been warned of, so it can't leak hidden information.
2. **The title screen.** A banquet couch with a cup and grapes under a sword on a hair, framed by a meander band; the title cut like an inscription; an epigraph from the saved Diodorus; the cast laid out below as a tray of coins.
3. **Season cards.** When a season ends, a card turns over: the new season's name, a drop capital, one line of flavour chosen from what is true in the city (grain short, Carthage stirring, a plot named, a quiet harbour). Click, press a key or wait three seconds. The lines are in `data/flavor.json`, all invention, picked without touching the game's dice, so replays stay exact.
4. **The ending as a stele.** The last screen is a carved stone with the ending cut into it, and the counts below like a dedication.
5. **The chronicle as a book.** Drop capitals, an opening line, a colophon after the last season, a fleuron between seasons.

## Motion

Slow and few. Ink spreads in (new log lines), cards turn (season change), the sword sways. 200 to 600 ms, ease-out. Nothing loops except the sword's sway, and only when a plot is known. `prefers-reduced-motion` turns all of it off.

## Words

- Season and place words stay plain English; Greek terms only where they say something English can't, each with a tooltip (none forced in this pass).
- The game says *talents* of silver, *the Island* (Ortygia), *the agora*, *the assembly*. No "gold", no "kingdom", no "lord".
- Flavour lines are short, concrete and sensory (smoke from Achradina, the north wind in the harbour), never a joke at the setting's expense, never a fact that isn't one. A line that sounds like a historical fact is either sourced or rewritten.
- The engine's own sentences are not touched in this pass; the chronicle's voice comes from layout and framing only.

## For the island map (thread 10)

The map should look like the site's maps, so the two projects share a hand: sea #dfe5d8, land #e2d1a4, coast #8a7550, place labels in IM Fell English SC with a parchment halo, pen-and-ink place marks. City marks can use the faction colours and the icons in `ui/icons.ts` (Carthage's palm in Punic purple). No satellite look, no gradients, no glow.

## What is out

Sound (parked), animated figures, a 3D anything, dark mode (never), real coin photographs (parked for a later phase, as decided).

## Sourced motifs

- **The city's coin of these years.** ANS 2015.1.1, a Syracusan tetradrachm dated 405 to 400 BC: "ΣYPAKOΣIΩ[N] in exergue: Charioteer ... driving fast quadriga left; above, Nike flying right, crowning charioteer" and "Head of Arethousa left, wearing wreath of grain ears ... four swimming dolphins around." Saved in the Phoenician-Punic World project, `sources/sicily-places/ans-mantis-syracuse-tetradrachm-all.tsv`. Research card: `docs/research/art-motifs.md`.
- **The title epigraph.** Diodorus 14.8.5: Heloris "declared to him, 'Tyranny is a fair winding-sheet'". Same card.
