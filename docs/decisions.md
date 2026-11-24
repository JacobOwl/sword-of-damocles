# Decisions

Dated log: decision, why. Newest at the bottom. If a chat and this file disagree, this file wins.

## 2026-11-21 (design session)

- Build an original game rather than an Old World mod. Why: owning the engine avoids fighting someone else's code.
- Systemic factions that act on their own, not a Reigns-style card game.
- The power objects (citadel, treasury, mint, fleet, generalship, assembly) decide the government.
- TypeScript core separate from the UI. Priority-list faction bots with visible goals, moods and reasons.
- Phase 1 is "The Citadel" (Syracuse, 405 to 395 BC). Carthage appears as a pressure clock. Cut for now: city map, mercenary market, invented people, generations, coin art, board game.
- A fully simulated Carthage is the centerpiece of Phase 2.
- Art direction is the museum-catalogue look, matching The Phoenician-Punic World.

## 2026-11-22 (repo setup)

- The repo is the single source of truth. Design and build live together in one Claude Code Project, not two rooms, so there is no copy-paste handoff. Why: the website project showed things said only in chat get lost.
- Smallest Phase 1, tighter than first drafted: four factions, six power objects, about 15 people, plots and the sword check, plain-text chronicle. Why: if ten seasons of that are not fun, the rest is not worth building.
- Season steps are fixed; every change goes through one logged action list; content is data. Why: these are where simulations get fragile.
- Calibration against history is a sanity check, not a fit. Count tyrannies, seizures and invasions over 1,000 seeds and look for broken results.
- Added `docs/scope.md` (in and out of the phase) and `docs/later.md` (parking list) as the drift guard.
- Every merge needs the tests plus a 100-seed headless run; content files need a history or invention tag.
- No project-knowledge copies of the docs: sessions read the repo directly so nothing goes stale.
- Parked: Feeding an Army (supply ideas return in Phase 2), Old World mod (dropped), Bo'saal sim (may reuse the engine later). Carthage Expertise stays the home for book research.
- Overall risk named: bland history. The test is whether ten seasons produce a story worth retelling.

## 2026-11-22 (Phase 0 paper test)

- **The paper test was played in chat.** The first try ran 2 seasons and stopped because rules broke. The second try ran all 10 seasons, from autumn 405 to winter 403/402. The write-up, log and dice are in `docs/playtests/2026-11-22-paper-test.md`, and the history used is carded in `docs/research/dionysius-405-403.md`.
- **Rule fixes during the test.** These were made by Claude and accepted by Jacob in play:
  - Grain starts at 8 months, drops 2 a season, and the summer harvest adds 6.
  - Moods can rise.
  - Named people have two traits (+1 or -1 on rolls). This was Jacob's idea.
  - The Carthage clock gains +1 a year (each summer), plus 1 for a riot, street fighting or an attack on Carthage's towns.
  - Why: each old rule produced a broken result. There was a riot in season 2, moods only ever fell, and an invasion came by season 8 in every game.
- **Direction: video game, not a board game.** Why: this is Jacob's call after the test. The hidden plots and per-person bookkeeping need a computer.
- **Freeform orders are out.** The player chooses from a fixed menu of defined actions, in the style of CK3's character interactions, each with a cost, a target, odds and set results. Why: Jacob disliked that the test was "basically just RPing and making up actions".
- **Factions get a power rating that shifts over time.** Factions can become marginal or influential, driven partly by the player's actions and partly by their own. Why: in the test, faction strength never changed.
- **Factions and major characters pursue their own agendas.** These are multi-season schemes that advance whether or not the player acts. Why: in the test the factions only reacted.
- **Rivals grow out of play, in the spirit of a nemesis system.** Survivors of the player's actions become named rivals with new traits and rank, and they remember. Why: Jacob liked most that plots formed from his own actions. Note: Warner Bros. holds a US patent on parts of its Nemesis system. That doesn't matter for a private hobby game, but our rules should be our own design.
- **Next:** v2 rules (the action menu, faction power, agendas and rivals), a short re-test of 3 or 4 seasons, then `docs/rulebook.md`. Phase 0 is still in progress, even though CLAUDE.md and `scope.md` say Phase 1. Fix that wording when the rulebook lands.

## 2026-11-22 (prototype of rules v2)

- **Built a playable browser prototype** of rules v2 instead of another chat test. Why: Jacob asked for something beyond messaging, and the v2 rules are concrete enough to run as code. Play it at https://claude.ai/artifact/8KqQzj6x3QrXRjQKzVZNK4 or build it with `npm run build`.
- **Both kinds of rival are in the engine:** enemies (wounds) and political rivals (ambition), per Jacob's change to the v2 rivals section. Rival origins and types are data, so new kinds can be added without new code paths.
- **Defaults chosen where v2 was silent** are listed in `docs/handoff.md`. They are invention and Jacob's to overrule. The two with the most effect: faction power drifts 1 toward 5 when nothing moves it, and a failed law gives no one power.
- **Finding, not tuned:** with a simple bot player, no game lasts the decade (average 8.4 seasons). Plots grow to strength 10 to 17. Left for Jacob's playtest before any tuning, so the history isn't scripted.

## 2026-11-22 (the sourced cast)

- **The cast is data in the engine's format.** The engine thread owns field names and the engine; the cast thread owns the content. Why: two threads were writing the same files, and one format avoids an adapter.
- **History records carry their quotes.** Each fact has the quote, the citation and the saved file in the Phoenician-Punic World repo, and a script checks every quote. Why: confident errors are the worst failure, and a quote can be checked.
- **Game numbers are invention even on history records.** Traits, ambitions, opinions, wants, rival types and starting offices are listed under each record's `invented`. Why: the sources give character, not dice.
- **People who appear later have an `enters` season** (Doris about 398; Biton and Archylus about 397). The dead stay in the data as anchors for grudges.
- **Disagreements are shown, not settled:** the first wife's death (Diodorus or Plutarch), the sister's husband (Polyxenus or Hermocrates), and whether Aretes is Aristus.
- **Invented people are in Phase 1** (Jacob, 2026-11-22). Real people are preferred, but the game will need many invented ones, as in CK3. Each person keeps its `history` or `invention` tag, and later the UI shows a small note such as "real person". `scope.md` moved "invented people" from Out to In. Consequences: the invented guard captain and the brother of Demarchus stay, and the citizens get an invented spokesman, Damon the smith, since the sources name only Nicoteles.
- **The guard is led by Aristotle the Spartan**, attested as its commander in about 396; the invented captain serves under him.

## 2026-11-22 (research on political games)

- **Wrote `docs/game-research.md`**, a ranked, report-only list of what to borrow from other political and story games, what to avoid and what v2 is missing. Why: Jacob asked for substantial work while away, and the coordinator asked for this research. Nothing is decided; Jacob picks.
- **Every claim about another game is marked** as opened this session (with the link) or as general knowledge. Why: confident errors are the worst failure.
- **The nemesis patent note stands as before** (a private hobby game is unaffected). The note adds that "waiting in the wings" is the part of v2 closest to the patent's described behaviour, in case the game is ever published.

## 2026-11-22 (interface polish, thread 07)

- **Every name opens a character sheet, and the court is its own view.** Why: Jacob wants CK3-style characters whose opinions, rivalries and ties are visible, and the old list hid most of that.
- **The player now sees what shifted and why** (opinion, mood, power, offices, stores), from the same log. Before, these lines showed only in the designer view. Why: a death must never feel random, and the reasons were already logged.
- **The chronicle is rendered from the visible log in the UI**, not by changing the engine's chronicle. It drops dice and turns agenda steps into deeds. Why: other threads are changing the engine; UI and rules stay separate. Grouping by storyline (research note, proposal 2) is not done.
- **Real people carry a small "real person" marker; invented people "invented".** From the cast's `kind` field. Per the decision that real people get a marker.
- **Portraits go through one map, `ui/portraits.ts`.** Placeholders until the mosaic editor or coin photos supply art.
- No rules, data or balance changed. The 100-seed counts are the same as before.

## 2026-11-22 (balance packages and better headless players)

- **Balance numbers moved into data** (`data/tuning.json`) as named packages. Standard stays the default and plays exactly as before. Why: the rules choices are Jacob's, so the alternatives are options, not changes.
- **Three alternative packages: Slow fuse, Fair fight, Reap what you sow.** Each changes only numbers or switches existing rules on, except two small new switches: "quiet seasons after a plot breaks" (research ★8) and "a content faction holds back agendas against you". Both are off in Standard. Why: the coordinator asked for 2 or 3 packages with their survival and story shapes; Jacob hasn't picked any research proposal, so these stay options.
- **Four new headless players** (careful, patron, iron hand, careless) that see only what the player sees. Why: the simple bot made the rules look far harsher than they are (0% against 52% for a careful player under the same rules).
- **Recommendation, not a decision:** playtest Reap what you sow first. Jacob decides.
- **Not tuned to history.** Targets were about play: careless should lose, careful should usually but not always win, each style should have its own typical ending, and a blow should come after warnings.

## 2026-11-22 (events, thread 06)

- **Events are in Phase 1** (Jacob chose this on 2026-11-22). `scope.md` now lists them. Why: the Phase 1 test is whether a decade makes a story worth retelling, and events give the people and the city things to happen to them.
- **Events are data, never code.** Each event in `data/events.json` has a trigger built from game state, the people it needs (by id or by description), text, and two to five defined choices with set effects, costs and, for some, a roll with every modifier shown first. `src/core/events.ts` only reads them. Why: CLAUDE.md rule, and Jacob wants defined CK3-style choices, not improvisation.
- **Events fire at the end of the people step**, at most one a season plus a 35% chance of a second, and no more than three waiting at once. Answering costs no action unless the choice says so. Unanswered events take a choice marked as the default when the season ends. All of this is invention and Jacob's to change (`pacing` in the data file).
- **What Dionysius really did is one choice among several, never forced.** It is marked `history: true` in the data, and sometimes now decided by a roll. Why: tuning to history scripts the history (CLAUDE.md).
- **Follow-ups chain** (a flight leads to Theste's answer, the weddings to a son and then to the charge against the Locrian mother, Theodorus' speech to a promise that comes due).
- **52 events: 33 from the sources, 19 invented.** Every sourced event quotes the saved text it comes from (54 quotes, all found by `scripts/verify-cast-quotes.mjs`) and lists what is invented. Card: `docs/research/events-405-395.md`.
- **Damocles is not used yet**: the passage (Cicero, *Tusculan Disputations* 5.61 to 5.62) is not saved and modern pages disagree which Dionysius it belongs to. Request in `later.md`.

## 2026-11-22 (placeholder portraits)

- **Mosaic portraits are in Phase 1 as placeholders** (Jacob, on a decision card). `scope.md` now lists them as In; real coin photographs stay parked for Phase 4. Why: faces on the character sheets and court cards make plots and rivals easier to follow in playtests, and the change is UI only.
- **The art is made in Jacob's mosaic editor, expanded for the game** (`tools/mosaic-editor.html`, also at https://claude.ai/artifact/Pcu7iE69Dyhk1q2876QFPC). It draws a bust in profile from choices (sex, age, hair, beard, headwear, faction colours) and lays it in tiles. Every look is invention, and the looks file says so; no source describes these faces.
- **One 192 px WebP per person**, tile size 7, transparent outside the coin, in `ui/art/portraits/<person id>.webp`, about 20 KB each. The build inlines them, so the game stays one file. Why: the largest slot is 92 px, and 192 covers it at double density; tile size 7 is the smallest that still reads as tiles at 46 px.
- **Faction colours on the coins are invention:** the ruler and his family on blood red, the rich families on deep sea blue, the citizens on olive, the guard on teal. Jacob's to change.


## 2026-11-22 (Phase 2 becomes the first test target, thread 10)

- **Phase 2, "The Island", is the target of the first real test, not Phase 1** (Jacob: "phase 2 should be the goal as our initial testing stage instead of 1"). Read as: Phase 1 is the foundation, built and kept playable as its own scenario, and Phase 2's content (the island map, a simulated Carthage, armies with supply) is pulled in now. The "ten seasons make a story you would retell" test applies to the island game. Why: Jacob's call; the court game alone has no outside world to push against, and Carthage as a clock is the thinnest part of it.
- **`scope.md` now says Phase 2**, lists what is in and out, and moves the gate to Phase 3. CLAUDE.md's phase line changed to match.
- **The decade stays 405 to 395 BC** (a default, Jacob's to change): it holds the great war of 397 to 396 (Motya, Himilcon's march, the siege and plague at Syracuse), and the cast is built for it.
- **Eight cities and one fortress** (a default): Syracuse, Leontini, Catana, Messana, Gela, Acragas, Motya, Panormus, and Aetna. Selinus, Himera, Camarina, Naxos and the Sikel towns are parked.
- **Phase 1 is a scenario, not deleted.** A game has a scenario, `island` or `citadel`; the citadel game must replay exactly as before.
- **Milestones** are in `docs/phase2-plan.md`: the map and cities, Carthage simulated, armies with supply, cities that change sides, the test pass.

## 2026-11-22 (design council, thread 11)

- **Held a design council** at Jacob's request ("use different agents with different opinions, act as a council and debate"). Six seats (systems designer, story engineer, historian, player's advocate, scope and architecture skeptic, devil's advocate), three rounds. Record: `docs/council/2026-11-22-design-council.md`; every statement in `docs/council/2026-11-22/`.
- **Its design verdicts are recommendations, not decisions.** Where they differ from `scope.md` and `docs/phase2-plan.md` (5 places instead of 8, one food counter instead of routes, commissions instead of "only the general gives orders", Carthage's blocs), the scope and plan stand until Jacob picks. Why: rules and goals are Jacob's.
- **Engineering verdicts offered to the build threads as agreed practice** (V9): a refactor before any island rule that moves Syracuse into a city record, adds a `where` field to people (never reusing status "absent"), replaces the drift rule's text search for " power " with a structured field, and adds `thread` and `cause` fields to log entries, with the standard digest unchanged. Why: the engine stores one city at the top of the state, and the drift rule silently breaks if any new log line contains the word "power".
- **History flag, fact not opinion:** Carthage's "Elders" and "Hundred" come from Aristotle (*Politics* 2.11, written decades later) and Justin (19.2.5-6, undated). If used as blocs they are tagged invention from a later description. The saved texts show a senate and a people for 405-396 (Diodorus 14.47.2).

## 2026-11-22 (rule switches for plots and rivals, thread 09)

- **Five optional rule switches, all off by default** (`data/switches.json`, `src/core/switches.ts`): Warnings are clues, Blows can miss, People escalate, A Pretender needs a coalition, Chronicle as story. Ticked on the start screen, alone or together, with any balance package; a game stores its switches so it replays exactly. Why: these are rules choices and Jacob's to make; the coordinator asked for each as an option he can compare.
- **Switches are separate from balance packages.** A package sets numbers; a switch adds or changes a rule. Why: so any switch can be tried with any balance.
- **New games take an options object** (`GameOpts`: `switches` now, `scenario` from the Phase 2 thread), agreed with thread 10 so the two builds don't collide.
- **Every clue is true.** Warnings under the clues switch are built from a list of deeds each plot keeps (who began it, who joined, who said no, who paid in). Stock lines are used only when the switch is off.
- **Recommendation, not a decision:** try People escalate and Warnings are clues first; A Pretender needs a coalition if Nicoteles keeps ending reigns; Blows can miss with Standard balance. Report: `docs/playtests/2026-11-22-switches.md`.
- **Two text bugs fixed by default**: a man leading his own plot, and the Take his place ending listing every way to lose. The standard digest in `tests/balance.test.ts` was re-pinned for these two lines only, and the test says so (the design council asked that it never be re-pinned silently).
- **Parked:** the council's feud record (V6) as a further switch, plots with a method and a moment, and `thread`/`cause` log fields set at write time once thread 10 adds them (`docs/later.md`).

- **Jacob kept the current plan for the first island test** (decision card, 2026-11-22): 8 cities and Aetna, routes in days, foraging and the four Carthaginian blocs, as `scope.md` says. The council's smaller first slice (V1, V3) is declined. Its other verdicts are unchanged.
## 2026-11-22 (art direction and flavour, thread 12)

- **Jacob asked for a full art, interface and flavour pass** ("go hard on art and UI and flavor"). It is UI and words only: no rule, number or engine sentence changed, and the 100-seed check matches the run before it (tyrannies 13, crashes 0). The art is placeholder-grade invention, like the portraits; real coin photographs stay parked.
- **Art direction written first:** `docs/art-direction.md`. The game is a museum catalogue of one reign: parchment and ink for the interface, struck silver for people, red-figure cup paintings for events, black-figure silhouettes for icons, tesserae and the meander for borders. Jacob owns it; every rule in it can change.
- **Faction colours unified with the coins:** the fallback portrait circles and the new faction marks use the coin colours (ruler and family blood red, rich sea blue, citizens olive, guard teal). Before, the fallback circles used other colours.
- **Events name a picture** (`art` in `data/events.json`): 22 emblems in a cup tondo cover all 52 events. No human figures yet (parked). A test checks every event has a picture that exists.
- **Flavour lives in `data/flavor.json`**: season lines chosen from what is true in the city, the chronicle's opening and closing lines, the title epigraph. Picked by a hash of the seed and the season, never the game's dice, so replays are exact. Two records are history (Heloris' saying, Diodorus 14.8.5; the coin legend ΣΥΡΑΚΟΣΙΩΝ, ANS 2015.1.1), carded in `docs/research/art-motifs.md`.
- **The sword overhead** reads only plots you have been warned of, so it can't leak a hidden plot. Why: the sword check must give warnings, never information the player shouldn't have.

## 2026-11-22 (the island, slice 1, thread 10)

- **The island is the default game in the browser; the citadel is a choice on the start screen.** Why: Phase 2 is the test target. The citadel game replays exactly as before (the standard digest test still passes unchanged).
- **Carthage's clock became Carthage's anger in the island game**, the same number, so every Phase 1 action and event that moved the clock still works, and the council reads it to choose war. No invasion roll at 10; armies land instead.
- **Carthage chooses a goal by bloc power each season** (Rebuild, Guard the tribute, War on the tyrant, Peace at a price, Quiet Libya) and takes two acts from its menu in that goal's order. If the Elders want something else, the people decide (after Aristotle). All thresholds are invention in `data/carthage.json`.
- **The Elders, the Hundred and the people of Carthage are tagged invention from a later description** (Aristotle wrote two generations later; Diodorus names only a senate for 397). Recommended by the design council (thread 11).
- **Your guard can march with the army, and then does not defend you at home.** The first link between the map and the sword. The fuller link (you or a named man leading in person, a keeper left in the citadel) is the council's "commission" recommendation, parked for Jacob.
- **Carthage's ships feed its armies in ports; yours eat from friendly towns.** Why: an asymmetry from the sea, and the reason Motya and Panormus matter.
- **Two rule numbers changed after the first runs, both because a rule never fired or ran away:** blocs below Uneasy recover a step each summer if nothing soured them (Libya was in revolt a third of every game), and war weariness (the Elders want peace after 8 seasons of war, the people after 12; wars never ended). Plague in a siege camp now needs 6 strength points, not 10 (it never happened). Not tuned to history.

## 2026-11-22 (the island, slice 2: towns that change sides, thread 10)
- **Done:** towns go over to a large army nearby (one roll a season per town, every modifier shown); a town that fears you may give in when your army arrives; fear fades one step each summer; an optional switch "Beaten armies can break" (off by default); the bots stop walking into battles they would likely lose, and the iron hand sacks Carthage's towns and towns that lean against it. The city table shows the chance a town goes over next season.
- **Decided:** the old rule (in war, every town with lean -1 or less went over to Carthage at once when its army outnumbered yours) is replaced by the roll. Why: it was all at once and showed no odds.
- **Decided:** Carthage's own towns (Motya, Panormus) never go over, following 14.48.1. Going over to you makes a town your ally, not yours.
- **Decided:** armies breaking is a switch, not a rule, because the handoff named it as Jacob's choice. With it on, about one Carthaginian army in five games breaks (careful bot); Himilcon's end can now fire.
- **Open:** the fear rule fires only in unit tests; no bot sacks often enough in the sweeps to test it (see handoff).

## 2026-11-22 (art thread, second round: dating and sound)

- **The chronicle names each year as Diodorus does** (the archon at Athens, and the Olympiad when there was one), from `data/calendar.json`, every line quoted from the saved Loeb text. Card: `docs/research/calendar.md`. Years 401 to 399 show none until Diodorus 14.19 to 14.40 is saved. The game's years start in autumn and Diodorus' in midsummer, so the line says "In Diodorus, the year ...", not a date.
- **Sound, made in the browser** (`ui/sound.ts`, no recordings): a plucked lyre in a Dorian scale for each new season, wind and water underneath (more wind in winter, cicadas in summer), a low drone while a known plot is at Rumors or Named, a pebble click when you act, a falling or rising phrase at the end. **Off by default**; a lyre button in the masthead turns it on, and the choice is remembered on that device. Why off: browsers block sound until you click, and sound that starts by itself annoys.
- **The island map is drawn as an engraved chart** (`ui/island-art.ts`, a drawing kit with no game logic): sea hatching and water-lines along the coast, specked land, hill strokes and Mount Aetna placed by eye, Natural Earth rivers with their usual ancient names (Halycus, Himeras, Symaethus), a compass, a cartouche; towers for walled cities, roofs for open towns, a palisaded hill for the fort, a ring of stakes for a siege, shields with a helmet or a palm for armies. The map thread (10) keeps the logic in `ui/island.ts`. Art thread, 2026-11-22.

## 2026-11-22 (the feud record switch, thread 09)

- **The design council's feud record (V6) is built as a sixth rule switch, "One feud record", off by default.** Why: the council made it its strongest consensus but left the choice to Jacob, and today's rival system stays the default until he picks.
- **What it does:** one dated record per person, never wiped; settlements pause a rivalry and keep its rank; one grievance starts at most one feud; rank comes from surviving you, and a second survival makes a Nemesis (once per man); an execution passes the feud to the nearest kin, said plainly; political rivals stay until something decisive happens. Titles come from the decisive chapter.
- **Two choices of mine, Jacob's to change:** a man becomes a Nemesis by survival only once (without this, one exile climbing back and forth counted as a new Nemesis each time), and a resumed feud keeps the paused rank, at most 3.
- **Not built:** one returning exile per city (needs the island's cities). Parked in `later.md`.
- **A counted side effect, not fixed:** political rivals who never drop off hold the cap of two, so fewer new ones rise. Report: `docs/playtests/2026-11-22-feud.md`.
- New count for the sweeps: people who became your Nemesis, counted once per man. The old "Nemeses" count adds every climb back to rank 4.
- **Painted figures in eight event pictures** (`ui/figures.ts`, red-figure style, invention): feast, assembly, wedding, hearth, arms, whispering, sickness, letter. The other fourteen stay emblems. Art thread, 2026-11-22.

## 2026-11-22 (the generated cast, slice 1, thread 13)
- **Invented people are generated, not hand-written, for the island's cities, Carthage's council and the hired captains.** Why: Jacob wants CK3-style numbers of invented people, each tagged; the island and Carthage need named men; hand-writing 165 people would be samey. The sourced cast of Syracuse is unchanged.
- **Every generated name is attested in a saved text, with its passage** (`data/names.json`, card `docs/research/names.md`). The people are invention. Names of the starting cast are never given to the living; a reserved list keeps off names that would be mistaken for real people of the decade.
- **The census is its own system**, a pure function of a random stream (`src/core/census.ts`). In a game it will draw from the game's one seeded stream, in island games only, so the citadel scenario stays byte for byte. Other systems read it through lookups (`censusLeader`, `censusCouncil`, `censusCaptain`, `censusAt`), agreed with thread 10.
- **Some women stay unnamed, as in the sources**, more often Carthaginians (no Carthaginian woman's name is saved). Their husband's or father's name tells them apart.
- **Births, deaths, marriages and heirs within the decade are in; generations (playing an heir) stay out**, per `scope.md`.
- **Not tuned to ancient birth and death rates** (CLAUDE.md): rough chances, counted for broken results over 1,000 decades.
- **Open:** women's names, the two late Punic names, how much of this the log should show (handoff questions).

## 2026-11-22 (the generated cast, slice 2: in island games, thread 13)
- **Every island game has a census, drawn from the game's one random stream at the start and stepped in the world step.** Why: one stream keeps replays exact; island games only, so the citadel scenario is untouched. Thread 10 agreed (its island tests replay rather than pin a digest).
- **The feed shows what changes who leads** (a head of a house or a captain dies, an heir takes over, a house ends) and keeps births, marriages and comings of age in the designer view. Why: about 40 births a decade would bury the season feed. Jacob's to change.
- **The census joins the broken-state check** of the 100-seed run.

## 2026-11-22 (the generated cast, slice 3: faces and a page, thread 13)
- **Generated people get mosaic portraits drawn in the browser by the editor's own code**, copied by `scripts/build-mosaic-runtime.mjs` into `ui/mosaic-runtime.ts`. Why: the people differ every game, so the faces can't be pre-made files; copying the editor's code keeps one source for the art style (thread 12's), instead of a second drawing of faces.
- **A view "The families" lists the invented cast in island games.** Why: 165 people need a place to be seen before thread 10 shows them on the map and in Carthage's council. Jacob's to keep or fold away.

## 2026-11-22 (missing source texts, thread 15)
- **Sources found later can be saved in this repo**, under `sources/`, as short exact quotes with their link and licence. Why: the phoenician-punic-world repo is read-only for this game. `scripts/verify-cast-quotes.mjs` now reads a file from this repo first and from that repo otherwise, and it now also checks `data/calendar.json` (7 more quotes, all found).
- **Saved:** Diodorus 14.19 to 14.40 (the three archon years 401 to 399 and every Sicilian line, from LacusCurtius, public domain); Cicero's Damocles story, 5.61 (short quotes from a copyrighted translation, as citations only); nine women's names from inscriptions and Livy. Cards: `docs/research/diodorus-401-399.md`, `damocles.md`, `punic-womens-names.md`.
- **Only quotes, not whole texts.** The cloud's network is closed except GitHub, and the web reader returns short passages. Enough for the three gaps; whole chapters wait for Jacob if ever needed.
- **Which Dionysius Damocles served: Dionysius I**, settled the same day from Cicero's Latin (5.57: tyrant 38 years, from age 25; 5.59: wives Aristomache and Doris of Locri; 5.61: "hic quidem tyrannus"). Livius.org's "Dionysius II" is wrong for Cicero. The story has no date, so its year in the game is invention.
- **No game data changed.** The calendar (thread 12), events (thread 06) and names (thread 13) stay with their threads.

## 2026-11-22 (Punic women's names in the generated cast, thread 13)
- **Nine Carthaginian and Phoenician women's names join `data/names.json`**, from the source-search thread's card (`docs/research/punic-womens-names.md`). The game writes the scholars' forms plainly (Am-'ashtart as Amashtart, and so on); those spellings are invention and the records keep the scholars' form. Why: until now the saved texts gave no Carthaginian woman's name, so 60% of Carthaginian women were unnamed and the rest all Amoashtart.
- **Unnamed Carthaginian women drop from 60% to 35%** (`naming.unnamedWomen.punic`). Invention, Jacob's to change.

## 2026-11-22 (art thread 12: the last three Diodorus years)

- **Done:** `data/calendar.json` now names 401 (Exaenetus, 14.19.1), 400 (Laches, with the Ninety-fifth Olympiad, 14.35.1) and 399 (Aristocrates, 14.38.1), quoted from the excerpts the source-search thread saved (`sources/diodorus/book14-19-40.loeb.excerpts.txt`). Every year of the decade now has its Diodorus line. `docs/research/calendar.md` updated. Checks: 68 tests pass; 100 seeds in both scenarios, 0 crashes, 0 broken states; 257 quotes checked, 0 not found.

## 2026-11-22 (a proper web app, step 1: thread 17)
- **The browser game stays TypeScript with no UI framework; Vite replaces the hand-written esbuild script next.** Why: screens are already plain functions tested headless, every thread can add to them, and Godot is the long-term home (Jacob), so the browser UI should stay cheap. Plan in `docs/architecture.md`.
- **The engine's purity is now tested** (`tests/core-boundary.test.ts`) and **conformance replays can be exported** (`npm run replays`) for a later port. Why: Godot is the goal; a port is checked by replaying the same games.
- **Open:** which Godot route (translate or embed), for later.

## 2026-11-22 (council and secrets switches, thread 14)
- **Two new rule switches, both off by default: "Your council argues" and "Secrets and leverage".** Why: Jacob's wish for CK3-style interactions and Varys or Littlefinger rivals; the research proposals 4 and 6 (`docs/game-research.md`), parked in `docs/later.md` for Jacob to pick, are built only as switches, like the earlier ones, so nothing changes until he turns them on.
- **Which invented townsman hides what is decided from a hash of the seed and his name, not the game's dice**, so turning the switch on doesn't shift the island's census. Same seed, same answer, every time.
- **The council rolls no dice.** What a man says follows from state, so a player can learn whom to trust.
- **Open:** see the questions in `docs/handoff.md` (how hard secrets should push political rivals, the council on events, women's seats).

## 2026-11-22 (island and Carthage events, slice 1: thread 16)
- **The island gets its own event library, `data/island-events.json`, run by the same engine.** `src/core/island-events.ts` adds conditions on towns, armies and Carthage, parts played by towns, the generated cast and Carthage's named men, and effects on towns, armies and Carthage's council and stores. Why: the court's 52 events never touch the map; the island needed its own stories without a second event system.
- **Island events have their own draw each season (one, sometimes two; at most two open), only in island games.** Why: so the court's intrigue is not crowded out, and so citadel games draw exactly the same dice as before (the standard digest and the 100-seed counts are unchanged).
- **History arrives as conditions, never dates** (council V8), and a test fails if an island event has a date window. What Dionysius did is one choice, marked as his.
- **Slice 1: 18 events** (14 from Diodorus, 4 invented) on treachery at the gates, the mole to Motya, siege engines, the sack of a Punic town, Greeks who fought for Carthage, the first man on the wall, ships caught on the beach, supply, cutting Carthage's foragers, the grain convoy, fever in camp, plague in the Punic camp, Himilcon's bargain, mercenaries paid with Leontini, Carthage buying a captain, the Campanians courted, the allies' harvest and the goddesses' temple. Four new emblems.
- **Battles now leave a flag (`battleWon`, `battleLost`)** so events can follow a defeat. Logged only in the state, not the chronicle.
- **Open:** see the questions in `docs/handoff.md`.

## 2026-11-22 (the Damocles banquet event, thread 07)
- **The Damocles story is an event, not a fixed scene.** Hanging the sword is the sourced choice (`history: true`) among three; the game never forces it. Why: events offer what Dionysius did as one choice, per the events decision.
- **Which Dionysius stays open in the game.** Both modern readings are quoted; Cicero 5.57 would settle it and is not yet saved (`docs/later.md`). The event's dating (from Spring 404) is invention for this decade either way.
- **A refusal is not forever.** Under "Warnings are clues", a man who said no can join the same plot later after a new wrong; the deeds list records both, so every clue stays true.

## 2026-11-22 (a proper web app, step 2: thread 17)
- **The browser game builds with Vite 8 and `vite-plugin-singlefile`** into the same single page; `npm run dev` gives a live-reloading page. Why: a standard build with a dev server, while the Artifact link still gets one self-contained page.
- **UI restructures are checked by a scripted walk-through** (`npm run walk`) that must record identical pages before and after. Why: "behaviour identical" needs a check, not a promise.

## 2026-11-22 (island and Carthage events, slice 2: thread 16)
- **19 more island events**: Rhegium and Messana, Heloris and Croton, the Sicels (Agyris, Taurus, Archonides, the Sicel lords), embassies and defections, and four rumors from Carthage's council that you can meddle in with silver or words. Why: the coordinator's brief and the paper test's wish for factions that act on their own and rivals you can work against.
- **Rumors from Carthage use the generated councillors** (a judge of the Hundred, a merchant of the Elders, a dockyard speaker) as named parts, so Carthage's politics have faces. They are tagged invention: the blocs come from Aristotle, written decades later.
- **Italy and the Sicels stay names only**, as `scope.md` says. Their events act through your towns, armies and Carthage.

## 2026-11-22 (Damocles event updated, thread 07)
- **"A sword on a horse-hair" is now settled on Dionysius I.** It quotes Cicero's Latin 5.57, 5.59 and 5.61 (saved by PR #30) and keeps Livius.org's Dionysius II reading as a disagreement. Only the timing is invention. Five more court stories from the same passage are parked in `docs/later.md`.

## 2026-11-23 (five Cicero court stories as events, thread 07)
- **Five more events from Cicero, Tusculan Disputations 5.58 to 5.63** (six records; the Pythagoreans story has a follow-up). Built at the coordinator's request under Jacob's green light for the week. Each gives what Dionysius did as one choice among three.
- **The daughters become "the women of your house".** Dionysius' daughters could not be grown in 405 to 395, so the barber event changes who learns the trade; the change is listed on the event and the card.
- **Standard digest re-pinned** (verified: without the six records the old digest matches).
- **Restored work that PR #32 undid by accident.** Its squash merge came from an older base. It deleted the saved Cicero Latin (`sources/cicero/tusculan-5-57-63.latin.txt`, from PR #30) and put the Damocles event and card back to their "both readings" state (PR #31). Both are restored here from their own commits.

## 2026-11-23 (a proper web app, step 3: thread 17)
- **The UI is laid out as `ui/app/`, `ui/views/`, `ui/components/`, `ui/lib/` and `ui/styles/`**, and `ui/main.ts` only starts the app. Why: one 470-line file held every screen and every click; now a screen lives in its own file. Done in one step while no other thread had UI work open, so the moves happened once.

## 2026-11-23 (secrets softened, fight-back added, thread 14)
- **With Secrets on, a held secret counts half toward influence, and a political rival at rank 2 or more has a scheme to find (one per game at the current setting).** Why: Jacob ("You decide", passed on by the coordinator) wanted rivals stronger but not twice as deadly, aiming at about 40% patron depositions. Result: 40% citadel, 27% island (30% and 22% without the switch). Not tuned to history; this is game feel.
- **Fight back: Buy back a secret, and exposing a blackmailer makes his holds worthless.** You learn who holds your secrets when he demands, tells, or is overheard by your watchers. Behind the secrets switch, off by default.
- **Handoff questions, decided for story:** keep all start secrets; seat lists stay men-only (Seat a counsellor takes anyone); the council on events stays parked in `docs/later.md`.

## 2026-11-23 (island events follow-ups: thread 16, decided by the coordinator on Jacob's "you decide")
- **New switch "A bought retreat disgraces the general"** (`bargainDisgraces`, off by default): if you take Himilcon's bargain, he comes home in disgrace and Carthage counts the army as lost, so he may starve himself, as Diodorus says (14.76.4). Why: without it his end never fires.
- **New switch "Rumors can lie"** (`falseRumors`, off by default): about one in three rumors from Carthage is false (`rumors.falseShare` in `data/island-events.json`). A false rumor changes nothing in Carthage. Two seasons later, word comes whether it was true. Each rumor says so when it arrives.
- **Court events that repeat the island's own stories are hidden in island games:** "The mercenaries' demand" (the island has "Pay in land") and "Carthage's secret offer" (the island has "A bargain by night"). Events can now carry `"scenario": "citadel"`.
- **Four more siege events,** mostly for the defender: a sally from the walls, talk of surrender in a besieged town, walls fallen down (Messana, 14.56.4), and Carthage's fleet in the Great Harbour (14.62.2). A careful player now meets about 1.2 siege events in a war game, up from 0.8. The simple bot meets about 0.3, because it rarely fights.
- **Engine:** an effect can carry an `if` condition; conditions can check `switchOn` and `switchOff`.

## 2026-11-23 (the ball-game killings, thread 07)
- **Kept as harsh as Cicero tells, with a cost.** The coordinator decided on Jacob's "You decide". Killing both men lowers the mood of the family and of the rich families, makes plots harder through fear, and turns any living kin of the dead into Bereaved enemies. Tested in `tests/events.test.ts`.

## 2026-11-23 (a proper web app, step 4: thread 17)
- **Clicks go through one listener, set up once; each screen exports its handlers keyed by `data-` selectors.** Why: the old wiring re-attached every handler after every redraw from one function that knew every screen; now a screen's buttons and what they do sit in the same file. Behaviour is unchanged (walk-through identical).
- **Exposing a blackmailer has a cost** (later the same day; the coordinator decided on Jacob's "You decide"): he tells the city his worst secret about you as a parting shot, at about half the harm, and his kin and faction turn colder. Why: so buying silence stays a real choice. Behind the secrets switch.

## 2026-11-23 (assumptions council, thread 18)
- **Done:** a five-seat council judged the project's working assumptions (`docs/council/2026-11-23-assumptions-council.md`). Advice and defaults only; nothing in the game changed.
- **Decided by the council (taste and scheduling, reversible):** a "First island test" preset, listed first but not the engine default (Reap what you sow, Warnings are clues, Blows can miss, Chronicle as story, Beaten armies can break); a verdict prompt at season 10, then play on if you like; keep 405 to 395; no difficulty tuning before Jacob plays; fixes and the test pass before any new feature this week; every PR rebases on main before merging. The open thread questions in `handoff.md` default to what the game does now.
- **Open, Jacob's:** when he will play the first island test; whether he can lead the army himself (or send a named man) as a switch.
- **Jacob answered (2026-11-23):** he will play the first island test in one sitting before Wednesday morning (2026-11-25), on the First island test setup, judged at season 10.
- **Jacob answered (2026-11-23):** yes, you can lead the army yourself or send a named man, built as a switch to try (off by default). If you go, you name a keeper of the citadel, and plots at home get easier while you're away. This moves the "commission" from `later.md` into the build as a switch.

## 2026-11-23 (two-day plan, assumptions council round 3, thread 18)
- **Done:** the council's plan for the usage through Wednesday morning (`docs/council/2026-11-23-two-day-plan.md`): eight streams, one thread each, ranked; freeze and republish Tuesday about 18:00 UTC; the army switch has a Tuesday 12:00 UTC cut-off and goes beside the test preset as an unticked checkbox, not inside it (3-2).
- **Open, Jacob's:** whether to delete stale branches such as `claude/project-thread-jmqrof` (merging one by mistake would delete about 9,000 lines). Left alone.
- **Part two of the plan (Jacob: "be ambitious and creative"):** eight ambitious bets beside the test build, all published to a separate Workshop page and never to the test link: the story museum, change the past, grain and the sea, great works, dinners, the other shore, exile and return (needs Jacob's change to scope.md), the Long Game on paper. Others parked in later.md.
- **Jacob answered (2026-11-23):** yes, build "exile and return" as a scenario. Added to `scope.md` (Phase 2, separate scenario, off by default, Workshop page only). Bet B7 of the two-day plan can merge, after the Tuesday freeze.

## 2026-11-23 (test build, stream 1, thread 19)
- **Done:** the "First island test" preset (listed first, recommended; island, Reap what you sow, Warnings are clues, Blows can miss, Chronicle as story, Beaten armies can break), the season-10 verdict, "Copy my game" with `npm run replay-save`, the island first-season guide, the "what to watch" note.
- **Decided (small calls):** the verdict also appears if the reign ends before season 10; it can be skipped; answers are stored with the save, not in the game state, so they never change play. The preset's digest is pinned and changes only with a logged line.
- **Fixed:** the story chronicle's logged text was always "A quiet season." (off-by-one season). Changes logged text only with that switch on; the Standard digest is unchanged.

## 2026-11-23 (test build, streams 2 and 3, thread 19)
- **Done:** ten-season counts and the story sweep; report in `docs/playtests/2026-11-23-ten-seasons.md`; three peacetime island events from Diodorus 14.14 to 14.15, as conditions, not dates.
- **Decided (small calls):** fix the quiet early map with events, not by moving the start date or by tuning; the preset's digest re-pinned for the new events and the informer line (Standard digest unchanged).
- **Open:** the same opening every seed and arrests that end stories (report, items 1 and 2) are Jacob's to weigh after his test.

## 2026-11-23 (Phase 3 on paper, thread 25)
- **Done:** `docs/phase3-draft.md` (draft) and five start dossiers, `docs/research/start-480.md`, `start-466.md`, `start-357.md`, `start-317.md`, `start-289.md`. Bet B8 of the two-day plan. Paper only; no scope change, no game code.
- **Picked in the draft, all reversible and Jacob's to change:** two speeds of play you choose, with triggers that pull you back to the court; heirs inherit a claim, a name and a ledger, never offices; you may play anyone in your circle; real people born after a start are not forced in, the census may make an invented man in the same station; the world stops at 264.
- **Open, Jacob's:** the seven questions at the end of the draft (also in `handoff.md`).


## 2026-11-23 (the story museum, bet B1, thread 21)
- **Done:** `npm run museum` plays 400 island games each for the careful, patron and iron-hand bots on the First island test preset, finds story shapes in each log (`data/story-shapes.json`, 23 shapes, all invention), scores them, writes `docs/playtests/museum/report.md`, and binds the ten best and ten dullest reigns as chronicles in `dist/workshop/museum.html`, published on the Workshop page. Safe to rerun: the same seeds write the same files.
- **Decided (thread, small and reversible):** the score is a reading aid, never a target. Each shape adds its weight at most twice a game, each person with a thread of three or more beats adds half a point (up to four), dull shapes subtract. Weights are guesses in the data file, to be changed freely.
- **Decided:** one Workshop artifact for all eight bets (https://claude.ai/artifact/BVQogSjtUF5DRXKQ9u5VNr). Its hub (`tools/workshop/index.html`) lights each bet's entry once that bet's own page exists beside it, so no bet edits another's page.
- **Done, report only:** the Dionysius bot (`src/core/dionysius-bot.ts`, card `docs/research/dionysius-bot.md`), whose priorities follow Diodorus 14.7 to 14.47, each quoted. It is not in `BOTS` and nothing is tuned toward it.
- **Open, Jacob's:** see the museum questions in `handoff.md`.

## 2026-11-23 (change the past, thread 22, Workshop bet B2)
- **Done:** `src/core/fork.ts` loads any recorded game at the start of any season, lists the choices you made in words, and rewrites one (another answer to an event, an answer to one you left open, or an action left undone). After the change it can stop (you play on), keep everything else you did (matched by meaning: the same event if it fires again, the same man's request), or keep that and let the careful bot finish. `compare` lays two histories side by side: the season they part, the first thing that went differently, endings, the city's government, whose fates differ, and your dice after the split. `npm run debrief -- <save>` writes the hidden rolls and the three changed answers that changed the most; `--sweep 100` is the branch check.
- **Done:** a Workshop page, `ui/past.html` (built with `npm run build -- --page past`): the whole game plus a "Change the past" view, a button under the ending stele, and a box to bring in a game copied from the test page. Published as `past.html` on the shared Workshop artifact, never at the test link.
- **Decided (small, reversible):** Workshop pages add screens through `ui/app/extras.ts`, a list the shell reads. The test page registers nothing, so its 110-page walk-through is identical before and after.
- **Found:** one changed answer changes the ending in 50 of 100 games, but the dice also reshuffle after the change. Shown, not fixed; "fixed fortune" parked in `later.md`.

## 2026-11-23 (army thread 20, stream 5)

- Built "Lead the army yourself" as switch `commission`, off by default, offered beside the First island test preset and not inside it. Why: Jacob chose it as a switch to try; outside the preset his first verdict stays traceable.
- You lead by default in the choices; the general and named men are the alternatives. Why: Diodorus has Dionysius take the field in person (14.72.1, 14.95.3).
- Absence costs: plots +1 while away, the keeper's loyalty in your defense, armed citizens +1 to plots with a citizen in them. Being there pays: +1 in battle. Why: the sourced danger at home (14.64.3-4; Polyaenus 5.2.4) and the council's verdict V2. Sizes are invention and untuned.
- With the switch, the generalship is friction, not a gate: passing over the elected general costs 1 citizens' mood and 1 of his opinion (council V2, "unlawful, not forbidden").
- Parked (later.md): purposes for commands, a commander turning on you, petitions while away.

## 2026-11-23 (dinners as the stage, bet B5, thread 24)
- **Done:** the switch "Dinners as the stage" (off by default; Workshop page only): the Give a dinner action, the couch of honour, 15 moments, 4 table choices, friendships and quarrels that change recruiting, a research card, 100-seed counts in both scenarios, and three sample dinners.
- **Decided (small calls, all invention, all behind the switch):** no roll for a dinner; at most one moment for each of the three parts of the evening, and at most one choice put to you per dinner; strong wine costs 2 silver; the couch adds 1 influence; the table panel never shows hidden plots or grudges.
- **Open, Jacob's:** women as guests; whether the dinner replaces the feast; rival hosts (in `later.md`).

## 2026-11-23 (test build, stream 4, thread 19)
- **Done:** the story chronicle tells repeated business once, varies repeats ("Again", then a count), names who remembers a grudge, drops bracketed numbers and family noise. Test: no sentence more than twice in ten seasons over 20 seeds.
- **Decided (small call):** the generated families' births and heirs stay in the families view, not the story; their deaths are one line a season. Preset digest re-pinned (logged chronicle text only).

## 2026-11-23 (test build, stream 6, thread 19)
- **Done:** a "This season:" line on the season and island screens; the battle forecast (both sides' modifiers and chances) before you send the army.
- **Decided (small call):** no cuts to the season screen's words before the review; the word count is reported, not trimmed.


## 2026-11-23 (dinners follow-up, thread 24)
- **Decided (taste calls delegated by Jacob):** wives and sisters can be guests (the sources are silent; noted on the card). The feast stays beside the dinner. Rival hosts stay parked.
- **Done:** fetched the Greek of Diodorus 15.6 from the Perseus Digital Library's GitHub (Oldfather's Loeb Greek, CC BY-SA 4.0) and saved it. Added Philoxenus and the quarries as the dinner moment "Your verses". It comes only in peace, as Diodorus 15.6.1 sets it, and the pardon follows a season later. The English is the game's own, marked as such.
- **Open:** a published English translation of Diodorus 15 to check that rendering against. LacusCurtius and Perseus are blocked from the cloud.

## 2026-11-23 (great works, bet B4, thread 23)
- **Done:** switch "Great works" (off by default, Workshop page only): the Epipolae wall, the arms workshops and the great fleet as objects built over seasons, with labour, overseers, silver, food and Carthage's anger; research card `docs/research/great-works.md` with every quote opened in the saved Loeb text; 100 seeds on and off, 0 crashes.
- **Decided (small calls, Jacob's to change):** all costs and season counts; the bots build in Diodorus' order (wall, arms, fleet) and halt a work unpaid for two seasons; switches marked `workshop: true` show only on a Workshop build.
- **Done after the island stream merged:** the great fleet makes the interception roll need 4 instead of 5 and stops Carthage's blockade of your besieged ports.
- **Open:** the taste questions in `docs/handoff.md`.

## 2026-11-23 (determinism fix, thread 19)
- **Fixed:** dice drawn inside a sort comparator made replays depend on the JavaScript engine, so "Copy my game" could not reproduce a browser game in Node. Draws now happen before the sort. Standard and preset digests re-pinned for this reason only. A test guards it.
- **Changed in other threads' tests (said here because they are theirs):** `tests/dinner.test.ts` (couch test follows the current holder) and `tests/works.test.ts` (threshold 20 to 15 finished works).


## 2026-11-23 (three-lens review of the test build, stream 7, thread 19)
- **Done:** report-only review at 1280 and 390 (`docs/playtests/2026-11-23-review.md`), every item marked cheap or costly, top five starred. The five starred items were cheap breakages and are fixed: the grudge line names the man ("<name> has not forgotten: you…"), Carthage's council reason groups blocs that agree, Send the army preselects "spare it", the "This season" line says where your own army is, and a second unknown plot is titled "A second plot".
- **Re-pinned:** Standard digest 2a992b0770170009, preset digest fda5fb102c1a022a. Only log wording changed; the 100-seed summaries (Standard and preset) are identical before and after.
- **Open:** every unstarred item in the review waits for Jacob's pick after he plays.
## 2026-11-23 (grain and the sea, thread 26, Workshop bet B3)
- **Done:** switch `convoys`, "Grain and the sea", off by default, island only: convoys a season at sea (bought grain, the fleet's grain, allies' surplus, grain to the army, Carthage's grain and mercenary pay), winter storms, the existing interception roll for catches, contractors from the census who may skim or sell, and an audit action. Workshop page `grain.html`. Card `docs/research/grain-and-sea.md` (Diodorus 14.47.7, 14.55.2-5, 14.63.4, 14.64.1, 14.96.1, 14.103.2; Polyaenus 5.2.21 and Cicero, Verres 2.3.24 as labelled later parallels).
- **Decided (small, reversible):** with the switch on, "Buy grain abroad" sends a convoy instead of landing grain at once, and Carthage's port feeding becomes a convoy. Without the switch nothing changes (digests untouched). Not offered beside the First island test preset, so the frozen test link is unaffected.
- **Open (Jacob's):** whether a season at sea is too slow; whether the audit should cost goodwill when it catches a cheat. Counts in `docs/playtests/2026-11-23-grain-and-sea.md`.

## 2026-11-24 (Carthage's chronicle, bet B6, thread 27)
- **Done:** switch `carthageChronicle` (Workshop only, off by default): the decade told from Carthage's side, read from the log alone, every sentence footnoted to its log line; Workshop page `shore.html`. Paper only: the voices sample (friendly Philistus, hostile Timaeus, three seeds) and a card on both historians.
- **Decided (taste calls delegated by Jacob):** the year frame is the suffetes' dating formula (later evidence, marked as such); the chronicle never says "you"; it uses only log lines you saw, plus births, deaths and heirs in Carthage's own houses; the one sentence naming Baal Hammon and Tanit is marked invention on the card. Engine untouched: the switch only adds a view, and the log is identical on and off.
- **Small shared change:** `ExtraView.when(g)` in `ui/app/extras.ts` (test page unaffected).
- **Open:** the questions in `docs/handoff.md`; the English Loeb of Diodorus 14.77.1 to 14.77.3 is still not saved (the game renders the Greek itself).

## 2026-11-24 (Carthage's chronicle follow-up, thread 27)
- **Decided (taste calls delegated by Jacob):** the solemn plain voice stays; side by side stays a button; the voices idea, if built in Phase 4, shows two historians side by side; the suffetes frame stays, marked as later evidence. No rule changes, so no switches. Details in `docs/handoff.md`.

## 2026-11-24 (exile and return, bet B7, thread 28)
- **Done:** switches `exile` ("Fallen, not finished") and `exileStart` ("Begin fallen"), both Workshop only, off by default, island only. A fall becomes an exile: refuges, patrons, hired men, friends inside, a ruler who acts on a visible list, a hunt that warns three times before it strikes, and a strike for the city whose three outcomes show before you commit. Kills and a decade in exile still end the game. Workshop page `exile.html`. Card `docs/research/exile.md` (Diodorus 13.63, 13.75, 14.7 to 14.10, 14.58, 14.61, 16.6 to 16.10, every quote checked).
- **Decided (taste calls delegated by Jacob, all numbers in `data/exile.json`):** the strike bands, the refuges and their prices, the ruler's order of acts, the hunt's pace, Entella as the Campanians' town, and Carthage's council as an invented patron. Switches may now name the switches they `require`. The Workshop can offer a switch without ticking it (`__WORKSHOP_OFFER`).
- **Small shared changes:** actions can be marked `exile` (shown only while you are in exile, and the usual actions hidden then). Event roles can ask for `where`, `kinInCity`, `usurper` and `sworn`. The sim prints an exile line when the switch is on. With the switch off the digests are unchanged.
- **Open:** a gender field for people, and whether the hunt should be harsher (both in `docs/handoff.md`).
