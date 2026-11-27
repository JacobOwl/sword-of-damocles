# Prompts for Duet jobs

Ready-to-paste prompts for jobs run in Duet (Jacob's other Claude tool) on this repo. Each job ends in a draft PR. Jobs 1 and 2 were written 2026-11-26 (thread 40) and are done. Jobs 3 to 14 were written 2026-11-27 (thread 42), after Jacob asked for more jobs and bigger ones. Paths checked against `main` at commit 742ebc1.

## How these are built

- **Self-contained.** Each prompt carries its own rules, so it can be pasted alone, in any order. The rules block is the same in every prompt.
- **Out of the way of live builds.** Jobs don't edit `src/`, `ui/`, `data/`, `tests/` or `package.json`, because thread 41 (war and geopolitics) and thread 39 (second test fixes) work there. Drafts go to `docs/drafts/`, research cards to `docs/research/`, reports to `docs/playtests/`, new scripts to new files only. The Godot trial gets its own `godot/` folder.
- **Bigger than before.** Each says "do all of it, not a sample", and how to stop well if it runs out of room.
- **Order, if run one at a time:** 3 (story metrics) first, because 11 uses its counts; 4 and 5 before 14 (faces for the new casts); the rest in any order.

| # | Job | Kind | Size |
|---|---|---|---|
| 3 | Would you retell it? Story counts over 600 games | script and report | large |
| 4 | Carthage's government and council cast | research and draft data | large |
| 5 | Town casts for the war | research and draft data | large |
| 6 | Thirty matters from what's happening | design and draft data | large |
| 7 | Court and dynasty: why the pages go unopened | review, research, three designs | large |
| 8 | The rulebook, checked against the code | writing | large |
| 9 | Fresh eyes: three full games in the browser | playtest report | large |
| 10 | Godot trial | code in its own folder | very large |
| 11 | Less sameness: variants for the most repeated lines | writing and draft data | medium |
| 12 | The next decade, 395 to 385 BC | research | large |
| 13 | A glossary for new players | research and draft data | medium |
| 14 | Faces for the new casts | art | medium |

## 3. Would you retell it?

```
Repo: JacobOwl/sword-of-damocles. Job: measure whether games make stories worth retelling.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Don't edit src/, ui/, data/, tests/ or package.json: other builds are working there. Plain words in anything a player or Jacob reads, no code ids. This is a big job: do all of it, not a sample. If you run out of room, push what you have and list what's left in the PR.

CLAUDE.md's test for this phase: "do ten seasons produce a story you would retell?" Nobody has measured it.

Build on the playtest bot (scripts/playtest.ts; if PR #97 isn't merged, branch from claude/playtest-bot). New files only: scripts/story-metrics.ts and docs/playtests/2026-11-27-story-metrics/.

1. Play 600 games of the Second island test preset, 30 seasons each, 200 each with the careful, patron and iron-hand players.
2. From each game's log, count story beats. Define each in plain words with the log line it reads: a man climbs to rival or pretender; a seat lost and won back; a friend or kinsman turns plotter; a reversal (silver, army or a faction's mood up, then down by half); a named death; a warning that came true; a war begun and ended; an exile and a return.
3. Find the longest quiet stretch in each game (seasons with no beat).
4. Count repetition: the 40 sentences, names stripped, a player sees most, and how often per game.
5. Pick the 5 games with the most beats and the 5 with the fewest. Retell each in under 150 words, as a friend would over a drink, with its replay command.
6. Say what separates the good games from the dull ones, with two SVG charts.

Report only: no fixes. Ideas at the end, each marked cheap or costly, top five starred. Run npm test and npm run sim -- --seeds 100 and give the results.
```

## 4. Carthage's government and council cast

```
Repo: JacobOwl/sword-of-damocles. Job: Carthage's home politics, sourced, and a cast to play them.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Don't edit src/, ui/, data/, tests/ or package.json: other builds are working there. History: search the saved texts in JacobOwl/phoenician-punic-world (read-only, never edit it); never read whole books; quote what you opened with the passage number; ranges for uncertain dates and numbers; label everything kind: history or kind: invention; never state a guess as fact or invent a link; list unsaved texts under "To fetch". Plain words, no code ids. This is a big job: do all of it, not a sample. If you run out of room, push what you have and list what's left.

Read first: data/carthage.json, data/census.json (Carthage's council), docs/research/carthage-chronicle.md, docs/research/names.md and punic-womens-names.md, docs/council/2026-11-27-war-and-geopolitics.md (3B, Carthage's pendulum, not built), docs/drafts/rising-cast.md on branch claude/rising-cast (the layout to copy).

1. docs/research/carthage-government.md: how Carthage was governed about 410 to 380 BC, as far as the texts go. Suffetes, the council, the Hundred and Four, the assembly, kings, generals judged on return. Try Aristotle Politics 2.11, Justin 19, Diodorus 13 and 14, Polybius 6.51. Modern readings side by side, not decided. Say plainly where the texts are later than our years.
2. docs/drafts/carthage-cast.md: 15 to 20 people, 410 to 380 BC, real first, invented to fill seats. Per person: faction at home, what they want, what they did (passage), how they could rise, one move of their own, how it ended.
3. Three options, cheap to costly, for how home politics could steer Carthage's war choices in the game (who wants war, who wants trade, what brings a general down). Input for the war focus, not a build.
4. docs/drafts/carthage-cast.json in data/people.json's shape.
```

## 5. Town casts for the war

```
Repo: JacobOwl/sword-of-damocles. Job: give every town on the island map a cast and its own politics.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Don't edit src/, ui/, data/, tests/ or package.json: other builds are working there. History: search the saved texts in JacobOwl/phoenician-punic-world (read-only, never edit it); never read whole books; quote what you opened with the passage number; ranges for uncertain dates and numbers; label everything kind: history or kind: invention; never state a guess as fact or invent a link; list unsaved texts under "To fetch". Plain words, no code ids. This is a big job: do all of it, not a sample. If you run out of room, push what you have and list what's left.

Read first: data/places.json and data/island.json (the towns), data/census.json (the generated houses and their shape), docs/research/war-and-towns.md, docs/research/island-405-395.md, docs/council/2026-11-27-war-and-geopolitics.md (2B, town boards, not built).

For every town on the map:
1. Who held power about 410 to 390 BC, and who wanted it, from the texts. For example the men who opened Naxos and Catana to Dionysius (Diodorus 14.15). Real people first.
2. 4 to 8 people or houses (invent to fill, names from docs/research/names.md): stance to Syracuse, to Carthage and to their own common people; what they would open a gate for; one move of their own.
3. The town's politics in three lines: who is in, who is out, what splits them.
4. Which towns the texts leave blank, said plainly.

Deliver docs/drafts/town-casts.md, and docs/drafts/town-casts.json in census.json's house shape so a later build can load it. End with a table: town, real people found, invented, best passage.
```

## 6. Thirty matters from what's happening

```
Repo: JacobOwl/sword-of-damocles. Job: write 30 matters (events) that grow out of the game's state.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Don't edit src/, ui/, data/, tests/ or package.json: other builds are working there. History: search the saved texts in JacobOwl/phoenician-punic-world (read-only, never edit it); quote what you opened with the passage number; label everything kind: history or kind: invention; never invent a link. Plain words, no code ids in player text. This is a big job: do all 30. If you run out of room, push what you have and list what's left.

Jacob hates CK3-style pop-ups with an obvious answer. He wants matters that come from what is really happening (a rival rising in the assembly, a seat changing hands) and people taking their own initiative, like a game master.

Read first: docs/playtests/2026-11-26-jacob-test2/notes.md, docs/council/2026-11-26-offices-rivals-events.md, docs/drafts/petitions-draft.md, data/events.json, data/board.json and data/island-events.json (the formats), src/core/types.ts (what state exists; read only), docs/research/events-405-395.md, docs/later.md.

Not war: another thread writes the war matters. Spread them over seats, money and grain, marriage and family, gods and festivals, the guard, exiles, the rich families, the assembly, old grudges. At least 10 from sourced stories.

For each: what triggers it (plain words, plus the state it reads); who brings it and why; 2 to 4 choices, each costing something real; what each choice changes; which later matter it can lead to (chains of 2 or 3); why the answer isn't obvious; history or invention with the passage.

Then test yourself: list any matter where one choice is plainly best, and rewrite it. Deliver docs/drafts/matters-from-state.md and a JSON in events.json's shape, with a closing table: trigger, how often you expect it, chains.
```

## 7. Court and dynasty

```
Repo: JacobOwl/sword-of-damocles. Job: find out why Jacob never opens the Court and Families pages, research the real court, and design three ways forward.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Don't edit src/, ui/, data/, tests/ or package.json: other builds are working there. History: search the saved texts in JacobOwl/phoenician-punic-world (read-only, never edit it); quote what you opened with the passage number; ranges for uncertain dates; label everything kind: history or kind: invention; never invent a link. Plain words. This is a big job: do all of it. If you run out of room, push what you have and list what's left.

Read first: ui/views/people.ts and ui/views/families.ts and what feeds them, docs/later.md (Court and Families items), docs/council/2026-11-27-second-test-rules.md, docs/research/cast-405-395.md, dinners.md, damocles.md, both of Jacob's test notes in docs/playtests/.

1. Review. Run the game in headless Chromium (Playwright), play 5 seasons of the Second island test, and screenshot Court and Families at 1440 and 390 px wide. Three lenses (UI designer and artist, game designer, new player), report only. Every suggestion marked cheap or costly, top five starred.
2. docs/research/court-and-household.md: Dionysius I's household from the sources. The two weddings on one day, Doris and Aristomache, the children and the heir, daughters married to brothers and friends, Dion's rise, the guards and the searches, the fear stories (Cicero Tusculan Disputations 5.57 to 5.63, Plutarch Dion 3 to 9, Diodorus 14.44).
3. docs/drafts/court-and-dynasty.md, three designs, a page each: (a) fold the court into the board, kin as seat holders and heirs; (b) a small succession and household track, CK3's idea with few people; (c) cut both pages and move what matters elsewhere. Each says what the player sees, which sourced stories it uses, and the build cost. Recommend one; the call is Jacob's.
```

## 8. The rulebook, checked against the code

```
Repo: JacobOwl/sword-of-damocles. Job: write the player's rulebook for the Second island test, every rule checked against the code.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Don't edit src/, ui/, data/, tests/ or package.json: other builds are working there. Plain words, no code ids in the rulebook itself. This is a big job: do all of it. If you run out of room, push what you have and list what's left.

Write docs/drafts/rulebook.md from main as it stands; name the commit at the top. Reader: a new player who skims. Jacob reads tables, lists and short sections, not walls of prose.

Cover: the season and its steps; actions; silver and grain; factions and moods; the seven seats and the ladder of standing; matters and petitions; plots, warnings and the sword; the guard; war, armies and the map; Carthage; exile and return; how a game ends. Each section: one short paragraph on the idea, then a table or list of the exact rules (costs, limits, what each choice does).

Check every rule in src/core/, data/ and data/presets.json (which switches the Second island test turns on). Put file references in an appendix only.

Also:
1. A one-page quick start and a "your first three seasons" guide.
2. A list of every place where the game's own words (ui/, data/wordings.json, data/actions.json) say something different from what the code does, with both versions quoted.
3. Rules a player can't discover from the screen at all.

Under 12,000 words. Run npm test and npm run sim -- --seeds 100 to confirm nothing changed.
```

## 9. Fresh eyes: three full games in the browser

```
Repo: JacobOwl/sword-of-damocles. Job: play three full games in the browser as a new player and report what it's like. Report only.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Don't edit src/, ui/, data/, tests/ or package.json. Plain words. This is a big job: play all three games to the end. If you run out of room, push what you have and list what's left.

Read first: docs/playtests/2026-11-26-ai-first-impressions/findings.md (the last fresh-eyes test), docs/playtests/2026-11-26-jacob-test2/notes.md (Jacob's own words), docs/handoff.md (what changed since).

Run the game (npm run dev, or build and serve) and drive it with Playwright in headless Chromium. Play the Second island test three times, 30 seasons each, choosing by reading the screen like a person would, not by reading the code:
1. a careful ruler, 2. a greedy one who grabs every seat and seizes from the rich, 3. someone who clicks whatever looks interesting.

Each game: a screenshot every 5 seasons at 1440 px and at 390 px; a short diary entry per season (what you noticed, what you did, why, what confused you); the moment you first felt in danger; how it ended and whether you saw it coming.

Then report in docs/playtests/2026-11-27-fresh-eyes/:
- Each game retold in under 200 words. Would you retell it?
- Three lenses: UI designer and artist, game designer, new player. Every suggestion marked cheap or costly, top five starred.
- Which findings from the first fresh-eyes test are fixed, which remain.
- Words on screen per season, buttons per season, and how they changed from season 1 to 30.
```

## 10. Godot trial

```
Repo: JacobOwl/sword-of-damocles. Job: a trial port to Godot 4, to learn what moving the game there would cost. Jacob's long-term platform is Godot; the rules engine was kept UI-free for this.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Work only in a new godot/ folder: don't edit src/, ui/, data/, tests/ or package.json. Plain words in the report. This is a big job. If you run out of room, push what works and list what's left.

Read first: docs/architecture.md (the Godot port path), src/core/index.ts (the engine's public calls), ui/views/island.ts and ui/views/season.ts, data/places.json, ui/art/ (portraits).

1. godot/tools/export-states.ts: runs the engine through its public calls only (import from src/core, change nothing there) and writes the game state after seasons 1, 10 and 30 of three seeds of the Second island test to godot/sample-states/.
2. A Godot 4 project in godot/ that loads those files and shows: the island map with towns, roads, armies and sides; one season screen (ledger, seats, dangers); a person card with a portrait from ui/art/. Same parchment museum look (docs/art-direction.md).
3. If you can download Godot 4 headless, import the project, run it and save screenshots. If not, say so plainly.
4. docs/godot-trial.md: what ported easily, what didn't; three ways to run the rules in Godot (rewrite in GDScript, rewrite in C#, run the TypeScript in a JS runtime), each with cost, risk and how determinism and replays survive; an honest estimate of the whole port; your recommendation, which is Jacob's call.
```

## 11. Less sameness: variants for the most repeated lines

```
Repo: JacobOwl/sword-of-damocles. Job: draft fresh wordings for the lines players see too often.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Don't edit src/, ui/, data/, tests/ or package.json: other builds are working there. No code ids or bare numbers in any line a player reads. This is a big job: do all of it. If you run out of room, push what you have and list what's left.

Jacob's tests: "too much text, glazed over" and "same actions over and over". The 1,008-game batch found heavy repetition.

Read first: data/wordings.json, data/flavor.json, src/core/vary.ts (how lines vary now; read only), src/core/chronicle.ts, docs/playtests/2026-11-25-aar/. If the story-metrics PR (docs/playtests/2026-11-27-story-metrics/) exists, use its repetition counts; if not, run npm run sim and count the repeated lines yourself, names stripped.

1. For the 60 most repeated lines: 4 variants each, same meaning, same slots for names. Mix plain lines with a few in a Diodorus-like voice. Keep each shorter than the original where you can.
2. The 20 hardest lines to read (long, numbers, nested clauses): one shorter rewrite each.
3. Lines that say the same thing twice in one season: list them.

Deliver docs/drafts/wordings-variants.json in wordings.json's shape, and docs/drafts/wordings-variants.md with a before-and-after table and how often each line shows per game.
```

## 12. The next decade, 395 to 385 BC

```
Repo: JacobOwl/sword-of-damocles. Job: a sourced events card for the decade after the current game, for the Long Game phase.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Don't edit src/, ui/, data/, tests/ or package.json. History: search the saved texts in JacobOwl/phoenician-punic-world (read-only, never edit it); never read whole books; quote what you opened with the passage number; ranges for dates and numbers; label everything kind: history or kind: invention; never invent a link; list unsaved texts under "To fetch". This is a big job: do the whole decade. If you run out of room, push what you have and list what's left.

Read first: docs/research/events-405-395.md (the format to copy), docs/research/island-405-395.md, docs/research/carthage-chronicle.md, docs/drafts/rising-cast.md and docs/drafts/campaign-briefs.md (branches claude/rising-cast and claude/campaign-briefs), docs/full-game.md.

Try Diodorus 14.78 to 14.117 and 15.1 to 15.17, Plutarch Dion, Polyaenus 5.2, Justin 20, Aristotle Politics 5.

Deliver docs/research/events-395-385.md:
1. A year-by-year timeline: Sicily, Italy, Carthage, Greece where it touches Syracuse.
2. 25 to 40 events in events-405-395.md's layout: situation, what Dionysius (or Carthage, or a rival) did, the passage, and a possible game shape (invention).
3. The cast in these years: who dies, who rises, who falls out, who marries whom.
4. Carthage in these years: Magon's war, the peace, the Libyan revolt, as far as the texts go.
5. Disagreements side by side. Gaps said plainly.
```

## 13. A glossary for new players

```
Repo: JacobOwl/sword-of-damocles. Job: a sourced glossary of the words a new player meets.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Don't edit src/, ui/, data/, tests/ or package.json. History: search the saved texts in JacobOwl/phoenician-punic-world (read-only, never edit it); quote what you opened with the passage number; label everything kind: history or kind: invention; never invent a link. Plain words. Do all of it. If you run out of room, push what you have and list what's left.

1. Collect every term a player meets: run npm run sim and read data/ and ui/ text for places, offices, groups, things and Greek or Punic words (for example Ortygia, Epipolae, the assembly, hoplite, trireme, suffete, the Elders, obol, talent, tyrant).
2. For each, 60 words or fewer: what it was, in plain words; what it does in the game, if different (marked invention); one quote with its passage where a text supports it.
3. Sort by where the player first meets it.
4. Flag terms the game uses differently from the sources, side by side.

Deliver docs/drafts/glossary.json (term, short text, game text, kind, source, quote) and docs/drafts/glossary.md. Aim for 80 to 120 terms.
```

## 14. Faces for the new casts

```
Repo: JacobOwl/sword-of-damocles. Job: draft mosaic portraits for the people in the new cast sheets. Art only. Run this after the Carthage cast (docs/drafts/carthage-cast.md) and town casts (docs/drafts/town-casts.md) PRs exist; use their branches if not merged.

Rules: read CLAUDE.md first and follow it. New branch from main; finish with one draft PR, not merged. Don't edit src/, ui/, data/, tests/ or package.json. Looks are invention; cite any source you used for dress or coins from JacobOwl/phoenician-punic-world (read-only). Do all of it. If you run out of room, push what you have and list what's left.

Read first: docs/art-direction.md, ui/art/portrait-looks.json, tools/mosaic-editor.html, and the last portrait job: docs/drafts/portraits/ on branch claude/portraits-next-faces (PR #95), including how it drew the pictures without a browser.

1. A look for every named person in both sheets who has none yet: same tile settings and coin form, faction colours from the editor.
2. Lessons from PR #95: Carthage's faces came out alike and the darkest skin was hard to read at small size. Make each face tell apart at 64 px (hair, beard, headwear, age, colour), and check them side by side at that size.
3. If the editor lacks something the sources show (earrings, Punic headwear, an unbelted robe), propose the editor change in notes; don't make it.

Deliver docs/drafts/portraits-2/looks-new.json (opens in the editor), a 192 px WebP per face, one contact sheet at full size and one at 64 px, and notes.md: one line per person (name, REAL or INVENTED, faction, why this look, source if any).
```

## Done

Jobs 1 and 2, kept as written (paths checked against 8915213). Both ran: portraits in PR #95, campaign briefs in PR #96.

### 1. Portraits (done: PR #95)

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

### 2. Campaign research (done: PR #96)

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
