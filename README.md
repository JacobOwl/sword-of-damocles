# The Sword of Damocles

A political simulation of Syracuse that writes its own history. Phase 1 is The Citadel: Syracuse, 405 to 395 BC. See `CLAUDE.md` and `docs/`.

## Play

- In the browser: https://claude.ai/artifact/8KqQzj6x3QrXRjQKzVZNK4 (Jacob's private link).
- Locally: `npm install`, then `npm run build`, then open `ui/dist/index.html`.

## Checks

- `npm test`: unit tests, content validation and 100 headless games.
- `npm run sim -- --seeds 100`: plays 100 seeds with a simple bot and prints the counts (tyrannies, plots, deaths, rivals).
- `npm run typecheck`.
