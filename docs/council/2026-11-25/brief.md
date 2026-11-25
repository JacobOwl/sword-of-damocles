# Council brief: what to change after the 1,000 games (2026-11-25, thread 31)

Jacob asked: "So what changes would you implement after the 1000. Have council decide." Then: "Also have council reevaluate the game for any bigger suggestions or direction changes and such."

You hold one seat on a five-seat council. Each seat argues from its own lens and may disagree with the others. Opinions are welcome; confident errors are not.

## Read first (READ ONLY: do not edit, commit or write anything in either repo)
- `/home/user/sword-of-damocles/CLAUDE.md`, `docs/scope.md`, `docs/design.md` (Jacob's vision), `docs/later.md` (skim).
- **The run under review:** `docs/playtests/2026-11-25-aar/report.md` (read all of it) and `docs/playtests/2026-11-25-aar/summary.md` (grep as needed). Dossiers of the ten written-up games are in `docs/playtests/2026-11-25-aar/games/`.
- `docs/full-game.md` (the whole-game design, thread 30, PR #63): Parts 1, 5, 6 and 7 at least.
- Earlier councils, do not rerun their debates: `docs/council/2026-11-22-design-council.md`, `docs/council/2026-11-23-assumptions-council.md`, `docs/council/2026-11-23-two-day-plan.md`.
- `docs/handoff.md` (open questions from every thread), `data/switches.json` (17+ optional rules, all off by default).
- Code, to check claims before you rely on them: `src/core/` (e.g. execute in `src/core/actions.ts`; mood floors; the coin and levy actions in `data/`), `data/` (events, actions). Grep, don't read whole files.

## Facts and ground rules
- **Jacob has not yet reported playing the first island test** (frozen test link, "First island test" preset). Every playtest so far is by scripted bots. The Phase 2 gate is his: do ten seasons produce a story he would retell?
- Rule changes are Jacob's call. Recommend them as **optional switches, off by default**. Pure bug fixes and text variety (wording, repetition) may be recommended outright.
- Don't tune to historical rates; don't frame the game around a thesis. Count, find broken results, report.
- Anything new and outside Phase 2 scope goes to `docs/later.md` unless Jacob changes scope; a direction change is a recommendation to Jacob, not a build.
- Jacob is a novice who doesn't code. He likes Leder Games (Root, Oath, Arcs), Republic of Rome, John Company, CK3, Dwarf Fortress, Songs of Syx: asymmetric factions, power held as objects, emergent stories. Not a Reigns-style card game. Godot long term; browser now.
- The bots don't read the council, bargain with secrets, plan ahead or try odd things. Weigh bot numbers accordingly.

## Known findings (from the report)
Bugs: self-feud when executing own kin (one-line fix in execute); "him" for women; wound reason line wrong at margin 3-4; plot leader named twice; "Meanwhile, After" capital; rival line repeating; fugitive lends money; "general home too popular" shape never matches.
Loopholes: rich families at Rebellious make coin/levy free silver; iron hand safer the more he executes (8+: 43% survive, <4: 2%); patron petition spam (92-97% survive); a deadly secret doesn't stop a takeover; exile returns about 2 in 5 falls.
Repetition: same opening in 81-94% of games (Philistus's warning, the general's offer, Blood in the agora); Carthage's same script (87-88%); exile hunt warning verbatim up to 16 times a game; stock "Whispers" lines; a rival's rumor line 11 seasons running.
Other: all-switch runs crowd tyranny out of careful/patron bots; 27% of games have no story shape in seasons 1-10; Carthage almost never loses an army; dinners and great works barely tested.
The report's five questions for Jacob: fix the self-feud? coin/levy at Rebellious? purges pay? vary the opening? exile lines only on change?

## Your answer (under 1,400 words, plain English, no code blocks)
**Part A. Changes after the 1,000 games.** A ranked list (your top 8 to 12). For each: what to change, in one or two plain lines; type (BUG FIX / TEXT VARIETY / RULE SWITCH, off by default / TOOLING / NO CHANGE, and why); cost (cheap / medium / costly); and the reason, citing the report's numbers or a file you checked. Answer each of the report's five questions with your pick.
**Part B. Bigger suggestions and direction changes.** Step back from the batch. Is the project heading the right way? Up to five bigger suggestions or changes of direction (or "stay the course", with why), each with the problem it solves, what it would mean in practice, its cost, and whether it needs Jacob's say. Be honest about the biggest risk to the project.
**Part C. You didn't ask, but.** Jacob also asked: "anything else I'm forgetting to ask you should probably work on". Name up to five things he hasn't asked for that the project should do, ranked. Known open items to weigh (check them): the assessment of the eight Workshop bets B1-B8 (`docs/council/2026-11-23-two-day-plan.md`) is still owed; threads on balance, great works and the Phase 3 paper are still marked blocked; stale branches such as `claude/project-thread-jmqrof` would delete about 9k lines if merged (`git branch -r`, don't merge); there is no record that Jacob played the first island test or what he thought.
**Part D.** One line: the single most important thing to do next.
Mark any historical claim with its source passage (as quoted in the repo) or "unverified". Mark anything you checked in code with the file.
