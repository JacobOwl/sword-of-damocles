# Prompts for Duet jobs

Ready-to-paste prompts for jobs run in Duet (Jacob's other Claude tool) on this repo. Each job ends in a draft PR and changes no game code. Written 2026-11-26 (thread 40). Paths checked against `main` at commit 8915213.

Notes for both:
- The rising-cast sheet is not on `main` yet: it is on branch `claude/rising-cast` (`docs/drafts/rising-cast.md`). The prompts say so.
- PR #89 (the art library, not merged) has flat drawn medallions, a different style from the mosaic coins.
- All 24 people in `data/people.json` already have a portrait. The portrait job covers the faces still missing: Carthage's council and the rising-cast people who are not in the game yet.

## 1. Portraits

```
Repo: JacobOwl/sword-of-damocles. Job: draft mosaic portraits for the people who need faces next. Art only: change no game code or data.

Read first: CLAUDE.md, docs/art-direction.md, docs/decisions.md (search "portrait"), ui/art/portrait-looks.json (the 24 existing looks), tools/mosaic-editor.html (the editor; it opens and saves a looks.json cast file), and docs/drafts/rising-cast.md on branch claude/rising-cast.

Who:
1. Carthage's council in data/carthage.json: Himilcon, Magon, Hanno the elder, Bomilcar. Use the editor's "Outsiders and Carthage" colours.
2. Rising-cast people with no look yet: Dion, Aristides of Locri, Magon's son.
3. Check the 24 existing looks against the rising-cast sheet (age, role, faction). List any that jar; don't change them.

PR #89 (branch claude/art-library) has flat drawn medallions for some of these people. Those are a different style: make mosaic coins, not medallions.

Style: same tile settings and coin form as portrait-looks.json. The looks are invention: no source describes these faces. Where coins or dress help (Siculo-Punic coins, Carthaginian clothing), search the saved files in JacobOwl/phoenician-punic-world (read-only, never edit it; try sources/coinage/ and sources/modern/) and cite what you opened. Never invent a link.

Deliver on a new branch, as one draft PR, not merged:
- docs/drafts/portraits/looks-new.json: the new looks in the same format as portrait-looks.json, so Jacob can open it in the editor.
- If you can run a headless browser: each face as a 192 px WebP (tile size 7, transparent outside the coin) in docs/drafts/portraits/, plus one contact-sheet PNG of all new faces. Not in ui/art/ yet.
- docs/drafts/portraits/notes.md: one line per person (name, REAL or INVENTED, faction, why this look, source if any), then the list of existing looks that jar.

Keep the notes short and plain. Say plainly anything you could not do.
```

## 2. Campaign research

```
Repo: JacobOwl/sword-of-damocles. Job: a history brief for each of the six tyrant campaigns. Research and writing only: change no game code or data.

Read first: CLAUDE.md, docs/full-game.md Part 4 (the six campaigns), docs/research/tyrant-campaigns.md, the start cards docs/research/start-480.md, start-466.md, start-357.md, start-317.md and start-289.md, and docs/drafts/rising-cast.md on branch claude/rising-cast (the model for the people tables). Don't repeat what those cards hold: point to them, and fill their "Not found in the saved texts" gaps where you can.

Sources: the saved texts in JacobOwl/phoenician-punic-world, read-only, never edit it (sources/herodotus, diodorus, plutarch, polybius, justin, sicily-tyrants, modern). Search them; never read whole books. Quote what you opened, with the passage number. Give ranges for dates and numbers. Never state a guess as a fact or invent a link. If a needed text isn't saved, list it under "To fetch" with its reference.

For each campaign (Gelon, Hieron I, Dionysius I, Dionysius II, Agathocles, Hieron II):
1. Player brief: under 120 words, plain, second person: the situation at the start and the opening goal.
2. Key people: a table of 8 to 15 (name, REAL or INVENTED, faction, seat they want, how it ended). Invent people only where the sources leave a gap.
3. Big events: 5 to 10, each with a date range, one line on what happened, and the passage.
4. Disagreements: where sources or modern readings differ, shown side by side, not decided.
5. Gaps: what the saved texts don't say.

Deliver on a new branch as one draft PR, not merged: docs/drafts/campaign-briefs.md, with a short at-a-glance table on top. Label every section kind: history or kind: invention. Don't frame it around a thesis.
```
