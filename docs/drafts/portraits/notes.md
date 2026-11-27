# Draft portraits: Carthage's council and three rising-cast people

Draft only, for Jacob's review. Nothing in `ui/art/` or the game changed. Every look is **invention**: no source describes these faces. Same tile settings and coin form as `ui/art/portrait-looks.json`; all face left, like the 24.

Open `looks-new.json` in the mosaic editor to change any of them. Opening it replaces the cast in the editor; reopen `ui/art/portrait-looks.json` to get the 24 back.

## The new looks

Carthage uses the editor's "Outsiders and Carthage" colours (purple field, cream cloak, gold rim). The rising-cast people use their faction's colours.

| Person | | Faction | The look, and why | Source |
|---|---|---|---|---|
| Himilcon | REAL | Carthage | Grown, grey, full beard, gold band. The senior general of 406 to 396, and the only one with a gold band: Diodorus' Greek makes him "king" for the war of 396. Grey is invention. | Diodorus 14.54.5, Greek "Ἰμίλκωνα βασιλέα" (the Loeb has "sovereign power") |
| Magon | REAL | Carthage | Grown, black long hair, full beard, bare head. Himilcon's admiral in this decade; Diodorus calls him king only in the next war, so no band yet. Long hair tells him from his son at small size. | Diodorus 14.59.1 ("Magon his admiral"); 15.15.2 ("their king Magon") |
| Hanno the elder | INVENTED | Carthage (the Elders) | Old, white, bald on top, long beard, cream band. The oldest face on the council, for the head of a merchant house. Greek name as Diodorus names Himilcon's father. | Diodorus 13.80, Greek "Ἄννωνος" |
| Bomilcar | INVENTED | Carthage (the Hundred) | Grown, deep brown skin, short beard, helmet pushed back. A man who wants a command already wears the helmet. The editor's only helmet is the Greek Corinthian one. Greek name as Diodorus spells the later Bomilcar of 308 BC. | Diodorus 20.43.1, Greek "Βορμίλκας" |
| Magon's son | REAL (no name in Diodorus) | Carthage | Young, black curls, short beard, his father's nose and colouring. Diodorus calls him "young indeed". Proposed id `magonSon`. | Diodorus 15.16.2 |
| Dion | REAL | rich families | Young, fair, black curls, no beard, cream band. A boy for most of 405 to 388. His sister Aristomache's skin and hair, his father Hipparinus' band. Proposed id `dion`. | Plutarch, *Dion* 4 ("Dion was then quite young") |
| Aristides of Locri | REAL | rich families | Old, white long hair, long beard. He had daughters to marry, so old like Hipparinus. White long hair keeps him apart from grey-bearded Daphnaeus and Demarchus; the sage's look for "one of Plato's companions" is invention. Proposed id `aristides`. | Plutarch, *Timoleon* 6 |

**Beards on every Carthaginian man.** A modern summary says priests were "distinguished from most of the population by being clean shaven" (Wikipedia, "Ancient Carthage", saved as `sources/titles/wikipedia-ancient_carthage.txt`). So most men wore beards. Modern, and not about 405 to 395 in particular.

**What the coins gave.** Siculo-Punic coins of these years copy the Syracusan Arethusa head, with a horse and palm on the back; no Carthaginian man's face is on them (`sources/coinage/wikipedia-carthaginian-coinage.txt`). So the coins gave the coin form, not faces.

**Not drawn, because the editor can't:** a man's earrings and the long robe worn without a belt. Plautus' *Poenulus* (a Roman comedy of about 200 BC, so two centuries later and a joke) mocks a Carthaginian for both: "they walk around with rings in their ears", "You, who have no belt" (5.2, in the Starks stage translation, `sources/language/starks-puny-punic-poen-5.1-5.2.txt`). The editor has no Punic headwear either. All three would need new editor options; not done.

All sources above are the saved files in JacobOwl/phoenician-punic-world, opened 2026-11-27.

## Existing looks that jar

Checked the 24 against the rising-cast sheet (age, role, faction). Ages, roles and factions all fit. These jar for other reasons:

1. **Dionysius' cloak is Punic purple** (the editor's ruler colour). `docs/art-direction.md` keeps purple for Carthage, and Carthage's coins now sit on purple, so his coin can read as Carthaginian. Cheap fix: a blood-red or gold cloak.
2. **Theste's veil and Doris' hair bag are lilac**, a Carthage colour in the editor. Minor, same reason.
3. **Daphnaeus and Demarchus are nearly the same face** (grey, full beard, sea blue), and they die together in 405.
4. **Thearides has brown hair**; his brothers Dionysius and Leptines are black-haired. Minor.

Worth knowing, not a jar: Diodorus says "Dionysius the tyrant" (he doesn't say which one) "let his hair and beard grow long" so no barber's blade came near him (20.63.3). The short beard suits 405; a long-haired look could suit a later reign.

## How the pictures were made, and what I couldn't do

- The 192 px WebPs (tile size 7, transparent outside the coin) and `contact-sheet.png` were drawn with the editor's own portrait and tile code, copied out of `tools/mosaic-editor.html` the way `scripts/build-mosaic-runtime.mjs` does, and run on a Node canvas. No browser could be installed here. Tested on three of the 24: same look, but the tiles fall a little differently from the editor's files. For files exactly as the editor makes them, open `looks-new.json` and save all at 192 px as WebP.
- Nothing was put in `ui/art/`, and no game code or data changed.
