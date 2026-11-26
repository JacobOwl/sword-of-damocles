# Art library

A store of pictures for The Sword of Damocles that Claude Code (or anyone) can search and use later: art drawn in the game's own styles, and real ancient art under open licences. Nothing here is wired into the game yet. Taking an item into the game is a separate change.

**399 items.** 326 drawn for this library, 73 real.

| Kind | Count | Where | What it is |
|---|---|---|---|
| Icons | 108 | made/icons/ | The game's 29 black-figure icons exported, plus 79 new ones: goods, sea, war, rule, gods, cities, places and time. Also one sprite with all of them. |
| Event pictures | 68 | made/events/ | The game's 29 red-figure tondos exported, plus 39 new scenes: Damocles, a trial, an exile vote, a catapult, a sea battle, a treaty, an oracle, poison, a night letter, the Ear of Dionysius, the four seasons and more. |
| Coins and tokens | 34 | made/coins/ | 18 city coin types (Syracuse, Akragas, Himera, Segesta, Selinus, Gela, Leontini, Rhegium, Messana, Kamarina, Naxos, Corinth, Carthage and others), 6 faction tokens, 6 lead office seals, 4 blank flans. |
| Cast medallions | 21 | made/medallions/ | Coin portraits of 21 people from the cast list in PR 86 (docs/drafts/rising-cast.md, not merged yet), each on their faction's colour with a Greek legend. The faces are invention. |
| Maps | 10 | made/maps/ | Sicily's ancient sites, Sicily in 405 BC by side, the central Mediterranean, Magna Graecia, the Punic west of Sicily, the whole Mediterranean, Syracuse with Ortygia and Epipolae, and three blank base maps. |
| Frames and ornament | 31 | made/ornament/ | Catalogue card, meander and tesserae frames, an empty tondo, Greek and Punic stelae, a wax tablet, a papyrus roll, plaques, an inscription block, corners, fleurons, dividers (one with the sword on a hair), a victor's ribbon, a compass rose. |
| Patterns | 45 | made/patterns/ | Seamless tiles: meanders, wave, egg and dart, bead and reel, laurel, ivy, palmette and lotus, guilloche, dentils, zigzag, chequer, rays, tongues, scales, rosettes, sea ripples, tesserae, pebbles. Most come in bronze (for parchment) and clay on black glaze. |
| Textures | 8 | made/textures/ | Seamless 256 px PNG tiles: parchment, papyrus, black glaze, terracotta, marble, limestone, bronze with verdigris, sea wash. |
| Real art | 73 | real/ | 41 images copied here (coins of Carthage and Tyre, Punic stelae, gods, helmets, Motya's walls, Selinunte, Carthage's ports, busts of Herodotus and Aristotle and more), and 32 more checked on Wikimedia Commons but not downloaded yet: the Syracusan dekadrachms of Kimon and Euainetos, the Demareteion, the Met's Sword of Damocles drawing, Westall's Damocles, Hackert's Ear of Dionysius, old plans of Syracuse, Greek helmets, the theatre at Syracuse, Motya and others. |

## Finding things

- **Look:** open `index.html` in a browser (straight from disk) for a gallery with a search box, or the contact sheets in `preview/`.
- **Read:** `INDEX.md` lists every item by kind.
- **Search:** `catalog.json` has one record per item. Each record has `id`, `type`, `title`, `file`, `tags`, `place`, `people`, `gods`, `mood`, `era`, `use_for`, `licence` and, for real art, `attribution`, `commons_page` and `doubts`.

```sh
# event pictures with a mood of danger
jq -r '.items[] | select(.type=="event") | select(.mood|index("danger")) | .file' assets/library/catalog.json
# everything about Dion
jq -r '.items[] | select(.people|index("Dion")) | "\(.type)\t\(.file // .commons_page)"' assets/library/catalog.json
# anything at Motya
jq -r '.items[] | select(.place|index("Motya")) | .id' assets/library/catalog.json
# a tag
jq -r '.items[] | select(.tags|index("harbour")) | .file' assets/library/catalog.json
# credit lines you must show for CC BY real art
jq -r '.items[] | select(.origin=="real" and .attribution_required) | .attribution' assets/library/catalog.json
# what values each facet has
jq '.facets' assets/library/catalog.json
```

Place, people, gods, mood and era are worked out from tags and titles by `tools/build-catalog.mjs`. Treat them as a finding aid, not as facts.

## Using a drawn item in the game

The drawn art uses the game's own palette and materials (docs/art-direction.md), so it drops in without a new style:

- **Icons:** each file's body goes into `ICONS` in `ui/components/icons.ts` unchanged. They fill with `currentColor` on a 24-unit square; `.line` is a stroke and `.cut` is a cut-out in the page colour.
- **Event pictures:** each new scene's body goes into `VIGNETTES` in `ui/components/vignettes.ts` under its id; then `"art": "<id>"` on an event in `data/events.json`. The figures come from the game's own figure kit, so they match.
- **Medallions, coins, maps, ornament:** standalone SVGs. Use them as `<img>`, or inline them.
- **Patterns and textures:** CSS backgrounds. Each catalog record has a `use` line, for example `background: url(assets/library/made/patterns/meander-running-bronze.svg) repeat-x 0 0 / 18px 18px;`.
- **Standalone files** carry plain colours, not the game's CSS variables, so they also work in other tools. Inlined in the game, the game's CSS styles the same classes.

The drawn scenes, faces and coins are invention in the ancient manner, not copies of real objects. Sources are named in each item's `note` where a scene follows one, for example Cicero for Damocles or Diodorus for the catapult. The Greek legends on the coins and medallions are spelled by hand, not copied from a real coin.

## Licences

- **Drawn art (made/)** is this project's own, on the same terms as the game.
- **The maps** use Natural Earth coastlines (public domain), Pleiades site positions (CC BY 3.0) and, for Syracuse, OpenStreetMap coast and cliffs (ODbL). Each map carries its credit line; keep it when you use the map.
- **Real art (real/)** takes only public domain, CC0 and CC BY. CC BY items must be credited as their `attribution` says. Share-alike (CC BY-SA), non-commercial and no-derivatives files were left out, as were other licences. All 74 skipped files are listed in `real/sources.json` with the reason, and the notable ones are in `CREDITS.md`.
- **Doubts** are on each record. For example, a broken Commons address in the source list, a doubtful identification (the "Hannibal" bust from Capua), or a modern reconstruction (the Zama battle plan).

## Rebuilding

Every script is safe to rerun and writes the same output from the same input. Run them from the repo root.

```sh
node assets/library/tools/build-made.mjs                                     # all drawn art, and made/manifest.json
python3 assets/library/tools/import-real.py ../phoenician-punic-world        # copies real art, writes real/sources.json
node assets/library/tools/fetch-real.mjs                                     # downloads the link-only real art (rechecks each licence first)
node assets/library/tools/build-catalog.mjs                                  # catalog.json, INDEX.md, CREDITS.md, index.html
python3 assets/library/tools/preview.py                                      # contact sheets in preview/
```

- Node 22.18 or later. No packages to install: the scripts use only Node's own modules and import the game's icon and figure code directly.
- `import-real.py` and `preview.py` need Python 3 with Pillow; `preview.py` also needs cairosvg (`pip install pillow cairosvg`).
- `import-real.py` and `tools/prep-data.mjs` read from a checkout of phoenician-punic-world next to this repo. `prep-data.mjs` has already been run, and its output is in `tools/data/`.
- `fetch-real.mjs` needs a network that reaches Wikimedia Commons. It downloads at most 1600 px plus a 320 px thumbnail, and leaves out any file whose licence on Commons has changed. Run `build-catalog.mjs` again afterwards. `tests/library.test.ts` checks that every file in the catalog exists, that real art carries only the allowed licences and that CC BY items have a credit line.

## Adding to it

Draw new things in `tools/lib/` (icons in `icons-new.mjs`, scenes in `tondos.mjs`, and so on), then rerun the scripts above. Use the palette in `tools/lib/style.mjs`, plain colours in standalone files (no `var()`), and a `<title>` in every SVG. Say in the `note` what a scene follows, or that it is invention. Add real art only with a licence read off the file's own page, and put it through `import-real.py` or `fetch-real.mjs` so that the credit travels with it.
