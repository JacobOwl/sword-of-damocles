# The Sword of Damocles

A single-player political simulation and story generator set in Syracuse, 480 to 264 BC. You play a person, not a state; every campaign writes a history.
Private hobby project for Jacob. He makes the design calls and playtests; Claude writes the code.

**Current phase: 2, "The Island"** (Syracuse and the island, 405 to 395 BC; Phase 1, "The Citadel", is its foundation and stays playable as a scenario). What is in and out is in `docs/scope.md`. Nothing outside it gets built.

## Start and end of every session

- **Start:** `git pull`, then read this file, `docs/scope.md`, `docs/handoff.md` and `docs/decisions.md`. Don't read old chats.
- **End:** run the checks (below), rewrite `docs/handoff.md` (Built, Changed, Broke, Questions for the next design session), add a dated entry to `docs/decisions.md`, then commit.
- **If a chat and the repo disagree, the repo wins** until a new decision is logged.
- Merge your own PR once the checks pass, then tell Jacob in one line with the link. Still ask before anything that can't be undone outside the repo.

## Checks (run before every merge)

1. `npm test` (unit tests and content validation).
2. A 100-seed headless run: no crash, no broken state, and the summary (tyrannies, plots, deaths) printed. Once the runner exists it is `npm run sim -- --seeds 100`.
3. Content files fail validation if a record lacks a `kind: history` or `kind: invention` tag. History records also need a source and a card in `docs/research/`.

Don't tune the simulation to match real historical rates. Count, look for broken results (never a tyrant, or one every year), and report. Tuning to history scripts the history.

## Architecture rules

- TypeScript. `src/core/` has no UI imports and runs headless. The UI is a 2D browser game in `ui/`.
- Deterministic: one seeded RNG, so any run replays exactly.
- Each season runs fixed steps in this order: world, people, factions, player, power, sword check, chronicle.
- Every state change is an action in one logged list, with its reason. The chronicle reads that log. Systems never reach into each other's state directly.
- All content (people, factions, power objects, events, start positions) lives in `data/`. Never write an event as code.
- Faction bots use priority lists, plus a visible goal and a mood that changes. Every action records why it happened, so the player can see it ("the rich families fear the grain law"). Readable beats clever.
- The sword check gives warnings before the blow. A death must never feel random.
- LLMs may write chronicle text only, never game logic.

## Scope discipline (the drift guard)

- `docs/scope.md` lists what is in the current phase and what is cut. A phase has to be playable before the next starts. One active build at a time.
- Any new idea, even a good one ("while I'm here..."), goes to `docs/later.md`, not into the build. Tell Jacob it was parked.
- If Jacob asks for something outside the phase, say so and offer to park it or to change `scope.md` explicitly.
- The test that matters for Phase 2: do ten seasons produce a story you would retell? If not, fix that before adding features.

## History and invention

Everything is labelled `history` (with a source) or `invention`. Historical facts need a card in `docs/research/`. Quote what you opened; give ranges for uncertain dates and numbers; never state a guess as a fact. Search saved texts, don't read whole books. If a source is blocked, add a line with the link to `docs/later.md` and ask Jacob to paste or save it (he is happy to).
Jacob's own essay project is his: don't frame the game around a thesis. Show sources and disagreements, don't decide his opinions.

## How Jacob works (apply these)

- He is a novice and doesn't write code. Explain plainly, push back on weak ideas, and propose ideas. Never call a reasonable idea of his "weak". Don't crowd out his ideas or fixate on one detail.
- **"Could we X?" means probe and report. Build only after he says "go".** A one-line cost note before large work; skip the wait when the work is clearly needed.
- Designs, rules choices and opinions stay his. Say what changed when you edit something he owns. Never silently drop a list item.
- Nothing deferred lives only in chat. Put it in `docs/later.md` (ideas) or `docs/open-questions.md`-style entries inside `docs/handoff.md` (questions).
- Quality first, usage second. Use a cheaper model for routine recipe work, but don't hand down work if quality would drop. Don't avoid medium or heavy work that has to be done.
- Never show players code-style ids or numbers (0001, "goods 1, 2, 3"). Real names and plain words in the UI and chronicle. Ids stay inside data files.
- Confident errors are the worst failure. Verify citations; a reading list from another tool once had fake links. Say plainly when something is unverified.
- Reviews are three-lens (UI designer and artist, expert historian or game designer, new player), at desktop and phone width, **report-only**. List every suggestion, each marked cheap or costly, top five starred. Jacob picks; one small thread does the fixes.
- Don't make things samey. Vary format where it helps, but sameness for a good reason is fine.
- Builders and scripts must be safe to rerun (no stray blank lines, no changing dates). This broke on the website.
- Report outcomes faithfully: if a test fails, say so with the output.

## Look and feel

Museum-catalogue look, matching the Phoenician-Punic World site: light parchment, no dark mode, no walls of boxes, mosaic-style coin portraits later (placeholders first, real coin photos preferred over drawn faces). Jacob judges on a computer, not a phone, but check both. Quality bar for sourcing: Bret Devereaux's ACOUP, numbers first, ancient passage for each number.

## Design tastes (to steer proposals)

Leder Games (Root, Oath, Arcs), Republic of Rome, John Company, CK3, Dwarf Fortress and Songs of Syx. Asymmetric factions, power held as objects, a persistent world, emergent stories. Not a Reigns-style card game. Supply-chain parallels appeal to him (the army-supply idea is parked for Phase 2).

## Where things live

`docs/` decisions and design (`design.md`, `rulebook.md` later, `scope.md`, `later.md`, `decisions.md`, `handoff.md`, `research/`, `playtests/`), `data/` content, `src/core/` simulation, `ui/` browser UI, `tests/`, `scripts/`, `tools/` (the mosaic editor for portrait art; the pictures are in `ui/art/`).
Syracuse history research lives in a separate private project. Copy needed facts into `docs/research/` with their sources; don't link to its records by id.
