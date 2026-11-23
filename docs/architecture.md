# Architecture

How the game is built, and the rules every thread follows when adding to it. Written 2026-11-22 (thread 17), when Jacob chose to keep the game in the browser but make it a proper app, with Godot as the long-term home.

## The two halves

The game is two programs that talk in one direction.

1. **The rules engine**, `src/core/`. It holds every rule: seasons, factions, plots, the island, Carthage, the census. It reads its content from `data/`, keeps the whole game in one plain state object, and writes everything that happens to one log. It knows nothing about screens.
2. **The browser UI**, `ui/`. It reads the state, draws it, and sends the player's choices back to the engine through a handful of calls (`startGame`, `act`, `chooseEvent`, `refuseRequest`, `endSeason`, `replay`). It holds no rules.

The headless runner (`npm run sim`), the tests and the balance sweeps use the engine with no UI at all. A later Godot game would replace the second half, or both (see "The road to Godot").

## Rules for the engine (`src/core/`)

These keep the engine portable. `tests/core-boundary.test.ts` checks the first four automatically.

- **Imports:** only other `src/core/*.ts` files and `data/*.json`. No `ui/`, no `node:` modules, no npm packages.
- **No outside world:** no `Math.random`, `Date`, timers, network, `window`, `document` or storage. All chance goes through the one seeded stream in `rng.ts`; game time is the season counter.
- **State is plain data:** numbers, strings, booleans, arrays and plain objects, so a game survives `JSON.stringify` and plays on exactly the same. No class instances, `Map`, `Set` or functions inside the state (they are fine as local variables).
- **Replayable:** a game is its seed, options and the list of the player's inputs (`s.inputs`). Every player choice goes through one of the calls above so it is recorded.
- **Every change is logged with its reason** (CLAUDE.md). The UI and chronicle read the log; they never work out what happened by comparing states.
- **Content is data.** People, factions, events, actions, places and numbers live in `data/`. Code says how a kind of thing works; data says which ones exist.
- **`src/core/index.ts` is the public face.** The UI imports only from it. Add an export there when the UI needs something new.

## Rules for the UI (`ui/`)

- **Screens are functions from state to HTML text.** `court(g)`, `sheet(g, id)` and the rest return a string and touch no page. That is why `tests/ui.test.ts` can render every screen for finished games with no browser. Keep new screens this way.
- **No rules in the UI.** If a screen needs to know whether something is allowed, what it costs or what its odds are, ask the engine (`menu`, `preview`, `secondOptions`, `openEvents`). If the engine can't answer, add the answer to the engine.
- **The UI never changes the game state directly.** It calls the engine. UI-only state (which view is open, which action is unfolded) lives in `ui.ts`'s `ui` object, not in the game state.
- **Buttons carry `data-` attributes** (`data-view`, `data-act`, `data-person` ...) rather than ids where there can be many. Clicks are matched by those attributes.
- **No code ids or bare numbers in front of the player** (CLAUDE.md). The UI tests fail if an id shows.
- **Look and feel:** `docs/art-direction.md`.

## Stack

- **TypeScript everywhere**, run directly by Node 22's type stripping for tests and scripts (no compile step to test). So use only erasable TypeScript: no `enum`, no `namespace`, no parameter properties; import with the `.ts` extension.
- **No UI framework.** Screens are plain functions returning HTML text, wired by a small event layer. Why: the screens are already written this way and tested headless; every thread can add to them without learning a framework; Node runs them in tests without a loader; and since Godot is the long-term home, the browser UI should stay cheap to keep rather than deep to leave. If a screen ever needs fine-grained live updates (an animated map, drag and drop), that one component can use a small library inside it without changing the rest.
- **Build: Vite** (`vite.config.ts`, page shell `ui/index.html`). `npm run dev` serves the game with live reload while you work. `npm run build` (`scripts/build-ui.ts`) writes one self-contained page, `ui/dist/index.html`: code, styles and portraits inlined by `vite-plugin-singlefile` and a small portraits plugin, fonts linked from Google Fonts. `npm run build -- --fragment <path>` also writes the page without its outer skeleton, which is what is published to the Artifact link (https://claude.ai/artifact/8KqQzj6x3QrXRjQKzVZNK4).
- **Stylesheets** are linked from `ui/index.html` and inlined by the build. A new stylesheet is one more `<link>` there (or, for a component's own styles, an `import "./x.css"` in its file once the component layout exists).
- **The walk-through check:** `npm run walk -- <page.html> <out.json>` (`scripts/ui-walk.mjs`) plays the built page with a fixed seed and fixed clicks, at desktop and phone width, in both scenarios, and records the page after each step. Run it on the page before and after a UI restructure and compare the two files: they must be identical. Needs Playwright (present in the cloud machines; locally, `NODE_PATH=$(npm root -g)` with a global Playwright).

## Layout

Since PR #35 (steps 4 and 5) the UI is laid out like this:

```
src/core/            the rules engine
data/                all content
ui/
  index.html         the page shell (links the stylesheets, loads main.ts)
  main.ts            starts the app, nothing else
  app/
    shell.ts         start screen, page frame (masthead, ledger, view buttons, foot), character-sheet dialog, clicks
    save.ts          saving and loading (seed and inputs in the browser's storage)
  views/             screens and the big parts of screens
    play.ts          the play view: three columns, or three tabs on a phone
    city.ts          offices and factions
    season.ts        the season feed, council, matters, petitions, your actions
    dangers.ts       plots, rivals, who is who
    ending.ts        the end of a reign
    people.ts        the character sheet and the court
    story.ts         the season feed and the chronicle book
    island.ts        the island view
    families.ts      the families view (was ui/census.ts)
    help.ts          how to play, the first-game guide, tooltips
    title.ts         the title page
  components/        pieces drawn on several screens
    portraits.ts, icons.ts, figures.ts, vignettes.ts, island-art.ts (the map kit),
    ambient.ts (season card, sword overhead, flavour), intrigue.ts (council and secrets blocks)
  lib/               helpers with no screen of their own
    text.ts          the ui state object, esc, names that link, pronouns
    sound.ts         sound in the browser
    mosaic-runtime.ts  generated by scripts/build-mosaic-runtime.mjs
  styles/            style.css, art.css
  art/               pictures and art data
```

Where a file went (for threads with older branches; git follows the renames when you merge main):

| Was | Now |
|---|---|
| `ui/main.ts` (one 470-line file) | `ui/app/shell.ts`, `ui/app/save.ts`, `ui/views/play.ts`, `city.ts`, `season.ts`, `dangers.ts`, `ending.ts` |
| `ui/text.ts`, `sound.ts`, `mosaic-runtime.ts` | `ui/lib/` |
| `ui/portraits.ts`, `icons.ts`, `figures.ts`, `vignettes.ts`, `island-art.ts`, `ambient.ts`, `intrigue.ts` | `ui/components/` |
| `ui/people.ts`, `story.ts`, `island.ts`, `help.ts`, `title.ts` | `ui/views/` |
| `ui/census.ts` | `ui/views/families.ts` |
| `ui/style.css`, `ui/art.css` | `ui/styles/` |

A new screen goes in `views/`, a piece used on several screens in `components/`. A new stylesheet is a `<link>` in `ui/index.html`.

A **view or component** is a file that exports functions `(g: GameState, ...) => string`. If it needs clicks, it also exports its handlers, for example `{ click: { "[data-grant]": (el, g) => ... } }`, which the click layer registers once. If it needs to touch the page after drawing (the census portraits are painted after render), it exports an `afterRender(g)`.

## Migration steps

Each step is one small pull request that keeps `npm test`, the typecheck and `npm run sim -- --seeds 100` passing, and keeps the game behaving the same. Before each UI step, a scripted browser walk-through (same seed, same clicks) is recorded before and after, and the pages must match.

1. **This document, the engine boundary test and the replay export.** No game files move. (Done, PR #26.)
2. **Vite build.** `npm run dev` for a live-reloading page; `npm run build` still writes `ui/dist/index.html` and the fragment. The walk-through gives the same pages as the old esbuild page. (Done, PR #28.)
3. **Split `ui/main.ts` and move the UI files** into `app/`, `views/`, `components/`, `lib/` and `styles/` (steps 4 and 5 of the first plan, done together while no other thread had UI work open). Every function moved unchanged; the walk-through (110 pages, now with a pass that turns every rule switch on) is identical. (Done, PR #35.)
4. **One click layer.** Replace the per-render wiring in `ui/app/shell.ts` with handlers registered once, matched by `data-` attributes, each view owning its own.
5. **Start screen as a view.** Move the start screen's HTML out of the shell into `views/`, leaving the shell only frame, dialog and clicks.

## The road to Godot

Godot is the goal for later (Jacob, 2026-11-22). The engine is being kept so that a port is a translation, not a redesign. What carries over unchanged: all of `data/` (Godot reads JSON natively), the rules as described in `docs/design.md` and the code, the seed-and-inputs save format, and the log with its reasons.

**The conformance replays are the bridge.** `npm run replays` writes `dist/replays.json`: whole games as a seed, scenario, balance, switches and the list of inputs, with the log each one must produce (every sentence, die and total, plus a checksum). A port is correct when it replays every case and produces the same log. Generate the file from the commit being ported; it changes whenever a rule does, so it is not kept in the repo.

Three ways to get there, in the order I would try them. None has been tried yet.

1. **Translate the engine to GDScript or C#.** Most work (the engine is about 6,000 lines of TypeScript), but the result is native and fast, and the replays check it case by case. One known trap: the random stream (`rng.ts`, mulberry32) uses 32-bit integer arithmetic. GDScript integers are 64-bit, so every step needs masking to 32 bits; C# `int` and `uint` match JavaScript directly.
2. **Run the existing TypeScript engine inside Godot** through a JavaScript runtime. For C# Godot, a .NET JavaScript interpreter could run the bundled engine; for GDScript there are community addons that embed a JavaScript engine. Least work up front, and the browser and Godot versions would share one engine. Unverified: I have not checked which of these runtimes are maintained or fast enough; check before choosing.
3. **Godot web export talking to the engine in the page** through Godot's JavaScript bridge. Works only for the web build, so it is a stepping stone at most.

What would make a port harder, and so is avoided now: rules hidden in the UI, state that is not plain data, randomness outside the seeded stream, and content written as code.
