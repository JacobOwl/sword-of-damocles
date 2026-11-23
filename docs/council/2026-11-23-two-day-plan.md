# Two-day plan, 2026-11-23 to Wednesday morning 2026-11-25 (assumptions council, round 3)

Jacob asked: "Have the council decide on ways to utilize usage over the next 2 days." He has since answered both council questions: he plays the first island test **in one sitting before Wednesday morning**, and he wants **leading the army yourself (or sending a named man) as a switch to try**.

All five seats agreed on the rule: spend heavily only where it makes his first ten island seasons more likely to be a story he'd retell. Seat plans are summarised in `2026-11-23/r3-plans.md`; this is the merged plan.

## Ground rules for every stream
- One thread per stream. Each branches fresh from main, rebases on main and reruns the checks before merging (the PR #32 lesson).
- Each stream owns the files listed; it borrows another stream's files only after that stream has merged.
- Each stream appends its own section to `docs/handoff.md` and `docs/decisions.md`; only stream 8 tidies them.
- No new events, cast, art, sound, secrets or council work, and no new switches beyond the commission. New ideas go to `later.md`.
- Fix broken results; never tune toward a target or historical rate.
- **Freeze: Tuesday 2026-11-24, about 18:00 UTC.** After the republish, nothing else is published until Jacob reports back or Wednesday morning, so his game isn't changed under him.

## The streams, ranked

**1. The test build** (medium to heavy; starts now)
- Goal: Jacob starts the island test in one click and is asked for his verdict at season 10.
- Done: a "First island test" choice listed first and marked recommended (Reap what you sow, Warnings are clues, Blows can miss, Chronicle as story, Beaten armies can break; Standard stays the engine default); a one-line list of which rules are on; a short first-season guide (your three actions, the sword, the map, the moods); at season 10 a verdict screen (what you'd retell, what confused you, what felt unfair, too easy / too hard / about right), answers saved in the game, then play on; a "what to watch" note; a "copy my game" button so a thread can replay exactly what he saw; the preset's own pinned digest; walk-through at 1280 and 390 px.
- Owns: a new `data/presets.json`, preset loading in `src/core/switches.ts`/`tuning.ts`, `ui/views/start.ts`, a new verdict view, `ui/app/save.ts`, their tests.

**2. Ten-season story read** (heavy, the most valuable; starts now with the switch flags given directly)
- Goal: find out whether ten seasons make a story before Jacob does.
- Done: `npm run sim` reports counts for seasons 1 to 10 only (map events, sieges, towns changing sides, battles, plots, endings) over 100 seeds; a rerunnable story-sweep script; a report in `docs/playtests/` reading 20 seeds of the preset with the careful bot, each marked "would retell" or "flat" with the reason, and a ranked list of failures linked to seeds. Rerun after streams 3 and 4 merge, and on 10 seeds with the army switch on once it lands; report before and after.
- Owns: `scripts/sim.ts`, `scripts/sim-check.ts`, a new story-sweep script, `docs/playtests/`. Report only otherwise.

**3. Island loop and early pacing** (heavy; starts now on the known items, then takes stream 2's list)
- Goal: the island makes things happen in seasons 1 to 10, and broken results are fixed.
- Done: the known broken results fixed or reported with counts (Carthage never loses an army without the switch; court events left open after Carthage storms Syracuse; the bot never sacks a city); if the map is quiet early, fix pacing, not the start date, using sourced early-decade events as conditions (the exiles at Aetna, 14.9; Herbessus and the armed citizens, 14.7.5-6; Naxos, Catana and Leontini, 14.14-15; Messana's march without a vote, 14.40), each quoted from the saved text and tagged; before-and-after table; 100 seeds, 0 crashes, 0 broken.
- Owns: `src/core/island.ts`, `carthage.ts`, `island-bot.ts`, `bots.ts`, `data/island.json`, `data/carthage.json`, `data/island-events.json`, `docs/research/` for its cards. Not `island-actions.ts`.

**4. A chronicle worth retelling** (medium to heavy; starts now)
- Goal: what he reads at season 10 and at the end is the story itself: grouped by storyline, cause first, no ids, no line repeated in the same words.
- Done: repeated outcomes have several wordings chosen by the man and his record with you; the Whispers lines differ by plot; no outcome repeats more than twice in ten seasons over 20 seeds (a test checks it); five of stream 2's seeds read well when printed.
- Owns: `src/core/chronicle.ts`, `src/core/clues.ts`, `data/flavor.json`, `data/warnings.json`, the story view. Log fields it needs (storyline, cause) are added by stream 3 on request.

**5. Lead the army yourself, as a switch** (heavy, ranked second by most seats once Jacob said yes; starts now; **cut-off Tuesday 12:00 UTC**, and if it misses, it ships after his test and he is told in one line)
- Goal: one of your three actions sends you or a named man with an army and a purpose; if you go, you name a keeper of the citadel, his loyalty enters the sword check, and plots at home get easier while you're away; homecoming is a logged step. Sourced pattern: Diodorus 14.72.1, 14.64.4.
- Done: switch in `data/switches.json`, off by default; offered as an unticked checkbox beside the test preset on the start screen, marked new, with one line on what it changes (not inside the preset, so his first verdict can be traced: 3 seats to 2, Systems and Historian wanted it in; the start-screen line goes in through stream 1 or after it merges); the bots use it; every price shown before you commit; 100 seeds with it on and off, no crashes or broken states, counts reported; research card.
- Owns: a new `src/core/commission.ts`, `src/core/island-actions.ts`, the `where` field on people, the switch entry.

**6. The island at first sight** (medium; starts now)
- Goal: the map, city panels, army orders and season screen read plainly to a newcomer in the first half hour.
- Done: plain words, every battle modifier shown first, food warned a season ahead, one line at the top saying what matters this season, the season screen near the council's word budget (about 1,000 words), no ids on any island screen, walk-through at both widths.
- Owns: `ui/views/island.ts`, `ui/views/city.ts`, `ui/views/season.ts`, `ui/views/help.ts`, `ui/components/` (not intrigue), `ui/styles/`.

**7. Three-lens review, then one cheap-fix thread** (medium; Tuesday, after streams 1, 3, 4 and 6 merge; a cheaper model is fine)
- Goal: the usual review of the build he will play (UI and art, historian or game designer, new player) at desktop and phone width, report only.
- Done: every suggestion listed, each cheap or costly, top five starred; the historian lens also checks the history and invention tags on the island and Carthage data. One small thread then fixes only the cheap starred breakages before the freeze; taste picks wait for Jacob.

**8. Freeze, publish and tidy** (light; Tuesday about 18:00 UTC)
- Goal: one stable build at the link he plays.
- Done: every check passes, the digests are pinned, the page is republished and its version logged, `docs/handoff.md` cut to what is open (every old question either answered by default or listed, none dropped), and Jacob gets one line with the link and the "what to watch" note.

## Where the usage goes
Heavy: streams 2, 3, 5, then 1 and 4. Medium: 6 and 7. Light: 8. If a thread finishes early, it reruns stream 2's read on more seeds rather than starting something new. After Jacob reports (Tuesday night to Wednesday), what is left goes to fixing what he found, replayed from his own game.

## Not this week
New events, more cast, art beyond fixes, secrets and council extensions, Godot, architecture refactors, Phase 3, the chosen ambition and the "what the sources say" page (parked).

## For Jacob, not done here
The Producer seat found stale branches (for example `claude/project-thread-jmqrof`) that would delete about 9,000 lines if merged by mistake. Deleting them can't be undone, so they are left alone unless Jacob says to clear them.

# Part two: ambitious bets (round 4)

Jacob, after the plan above: "for the usage I specifically mean stuff beyond fixes/changes at my request after playing. Be ambitious and creative." So the test build above stays as the protected core, and the rest of the budget goes to bigger bets. Seat proposals are summarised in `2026-11-23/r4-bets.md`.

## Rules for every bet
- **The test link never moves.** Bets publish to a separate **Workshop** page (a second Artifact), never to the link Jacob plays. He tries them after his sitting.
- New rules are switches, off by default, never in the test preset. New modes are separate scenarios. The default and preset digests stay pinned.
- A bet that needs an engine hook in a test-build stream's file (`island-actions.ts`, `chronicle.ts`, `season.ts`, `start.ts`, `carthage.ts`, `island-bot.ts`) adds it only after that stream merges, and never after the Tuesday 18:00 UTC freeze until Jacob has played.
- Each bet owns new files; `data/switches.json` gets one appended entry per switch.

## The bets, ranked

**B1. The story museum** (medium to heavy; tool, no scope change; 4 of 5 seats proposed a version)
- Bet: run 1,000 to 2,000 preset games headless, find story shapes in the log (a friend who betrays you, a warned blow survived, a general home too popular, a city that turns twice, a rival who survives you twice), score them, and bind the ten best and ten dullest as readable chronicles. Also runs a "Dionysius bot" whose priorities are what Diodorus says he did, each cited (Historian), as a report only, never a target.
- By Wednesday: `npm run museum` (safe to rerun), a shapes file in `data/`, a Workshop gallery of 20 chronicles with seeds, a list of shapes that never appeared, and the Dionysius bot report.
- Owns: `scripts/museum.ts`, `data/story-shapes.json`, a gallery view under `tools/`, `docs/playtests/museum/`, a separate bot in `src/core/bots.ts`.

**B2. Change the past** (heavy; interface and tool, no scope change; Player, Producer, Devil)
- Bet: every game replays exactly from its seed and choices, so from the last page you can go back to any season, make the other choice and play on, then read both chronicles side by side with the split marked. "If I'd paid the guard, Leptines lives." It turns one sitting into many stories and proves deaths weren't random. The museum's "play from here" uses the same loader.
- By Wednesday: a core helper that loads a game at any season (a test proves a branch matches its parent up to the split), a "go back to this season" button and a side-by-side view on the Workshop page, and `npm run debrief -- <save>` that writes the hidden rolls and three counterfactual branches for a save.
- Owns: a new `src/core/fork.ts`, a new replay view, `scripts/debrief.ts`.

**B3. Grain and the sea** (heavy; switch, fits Phase 2's armies with supply; 4 of 5 seats)
- Bet: the supply chain as play, John Company style. Grain flows from harvest to granaries to ships to armies along the sea lanes; Carthage's silver for its mercenaries has to cross the sea; convoys are objects on the map caught by the single interception roll already in scope; named contractors from the generated rich houses run them and can skim, delay or sell to Carthage. A map overlay shows every flow with its cause. Depots and wagons stay parked for Phase 3.
- By Wednesday: switch off by default, `data/convoys.json`, research card (passages to be found and quoted), the overlay on the Workshop map, 100 seeds on and off with convoys sent, caught and armies starved by a catch.
- Owns: new `src/core/convoys.ts`, `data/convoys.json`, an overlay component; its army hook waits for the commission stream.

**B4. Great works** (heavy; switch, fits Phase 2; Historian)
- Bet: Dionysius' power in 401-397 came from building. Timber, "half of his woodmen to Mount Aetnê… the other half… to Italy" (Diodorus 14.42.4); craftsmen bought "by high wages from Italy and Greece as well as Carthaginian territory" (14.41.3); the Epipolae wall "brought to completion in twenty days" (14.18.8). Works (the wall, the arsenal, ship-sheds, quinqueremes) are objects built over seasons that pull men off the harvest, silver out of the treasury and craftsmen from rivals, and raise Carthage's anger. Power you build, not only power you hold.
- By Wednesday: switch off by default, `data/works.json`, research card, tests, 100 seeds with 0 crashes, default replays unchanged.
- Owns: new `src/core/works.ts`, `data/works.json`.

**B5. Dinners as the stage** (heavy; switch; Devil, from Jacob's own pitch idea)
- Bet: you choose who is invited, where they sit and how much wine goes round; bonds form, grudges come out, secrets slip. The seating is a power object people fight over. In rules v2 and in `later.md`, barely seen so far.
- By Wednesday: switch off by default, one dinner action with seating and wine choices, every outcome logged with its reason, 100 seeds with counts of bonds and slips, three sample dinners written up.
- Owns: new `src/core/dinner.ts`, `data/dinners.json`, `ui/views/dinner.ts`.

**B6. The other shore** (medium; fits Phase 2, the voices sample is paper only; Devil, Historian, Player)
- Bet: the same decade told from Carthage's own log in Carthaginian terms (the council's votes, the general "king by law", 14.54.5, defeat read as the gods' anger, "against whom the gods were clearly fighting", 14.77.4), as a second chronicle tab that reads only the log. Plus, on paper only, three seeds told by a friendly Philistus and a hostile Timaeus, every sentence footnoted to its log entry, to let Jacob judge the Phase 4 idea early.
- By Wednesday: the Carthage chronicle on the Workshop page with a test that every line traces to a log entry; the voices samples in `docs/playtests/`; a card on each historian's leanings (unverified claims marked).
- Owns: a new view and a new `src/core/carthage-chronicle.ts` (not `chronicle.ts`), its sentences in `data/`.

**B7. Fallen, not finished: exile and return** (heavy; in scope since Jacob said yes, 2026-11-23; Player, Systems, Devil)
- Bet: when you lose Syracuse you flee to Aetna or Rhegium with a few loyal men and your feud records, and plot your way back while someone else rules. Every fall becomes the middle of a story. It is in Jacob's pitch and design.md.
- Until Jacob answers: a design note and a prototype on a branch as a separate scenario, not merged. On his yes: merged as a scenario, off by default, on the Workshop page.
- Owns: new `src/core/exile.ts`, a scenario data file; reuses the commission's `where` field.

**B8. The Long Game on paper** (medium to heavy research; paper only, no scope change; Producer, Historian)
- Bet: make the jump to Phase 3 quick once the gate is passed, and test whether "history as conditions" works beyond one decade. A draft rulebook (generations and heirs from the census, start dates as "seeds of a period", the mercenary market as a Republic of Rome style auction) and five start-date dossiers (480, 466, 357, 317, 289): who holds the six power objects, the factions, Carthage's posture, about 15 people each tagged history or invention, every claim quoted from the saved texts.
- By Wednesday: `docs/phase3-draft.md` marked draft with open questions as Jacob's, five dossiers in `docs/research/`, gaps in `later.md`.
- Owns: those docs only.

## Waves
Beside the eight test-build streams, the Producer seat puts the safe ceiling at about five bets at once.
- **Now:** B1, B2, B4, B5, B8 (new files only, or paper).
- **After the commission stream merges (Tuesday about 12:00 UTC):** B3.
- **After the freeze:** B6's tab, and B7 if Jacob says yes.
Heavy effort: B2, B3, B4, B5. Medium: B1, B6. B8's research can use a cheaper model with a strong model checking every quote.

## Proposed, not chosen (parked in later.md)
Favours as objects (Systems: every pardon, loan or marriage makes a named debt that can be called in, sold or inherited); Carthage's general under his own sword (Systems); Root-style asymmetric factions (Systems); disputed numbers as ranges spies narrow (Historian); a printable reign broadside with "mark this moment" (Player); secrets that change hands (Devil); a Godot spike (Player, Producer; the Devil calls it a trap until the route matters); a print-and-play board game (Producer; Phase 5). Traps the Devil named and the council agreed with: an LLM writing Philistus' history (invented facts in a historian's voice), playing as Carthage or all 216 years now, another hundred events, calibrating to history.
