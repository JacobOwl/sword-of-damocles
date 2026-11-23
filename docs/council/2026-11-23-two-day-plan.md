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
