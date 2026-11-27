# Playtest bot: what breaks, what always wins, what never happens

27 November 2026. Written by Claude from a run of `npm run playtest` (scripts/playtest.ts) on main at 742ebc1. Report only: no rule or data was changed. The full tables are in [results.md](results.md), with two charts: [how games end](outcomes.svg) and [how long each player lasts](survival.svg).

## What was played

- **23,520 games in about 10 minutes** on 4 cores. 300 games for each of 6 setups and 7 kinds of player (12,600), plus a sweep that plays each action alone, 40 games each (10,920).
- **The 6 setups** are every way to start a game on main: the Citadel, the Island with no switches, the first and second island test presets, Begin fallen, and a stress test with every rule switch on. The six tyrant campaigns are not playable yet (PR #96 holds their history briefs only), so they are not here.
- **The 7 players:** idle (does nothing), random, the existing careful, patron and iron-hand bots, the careful bot with random answers to matters, and a greedy hoarder that only takes silver.
- **Fixed seeds.** Every game is fixed by its setup, player and seed. `npm run playtest -- --one second:random:17` replays one and prints its problems; add `--save game.json` to read it with `npm run replay-save -- game.json --log`.

## Problems found

No crashes, no season that could not end, no game that never ended, no action that could be repeated for free, and every game replayed to the same log. Two invalid states:

1. **A dead man keeps his council seat while you are in exile.** Everything-on setup only (the council switch with exile). In 155 of its 2,100 games (7%). The seat holder dies while you are abroad, and the council never clears his seat, because the council's seating runs in the city's season and not in exile's. Replay: `everything:idle:4` (season 5), `everything:idle:1` (season 12), `everything:random:210` (Heloris, season 18). Checked by hand: in every case looked at, you were in exile.
2. **A dead man starts a plot.** Once, in Begin fallen: `fallen:carefulDice:97`, season 34. "The hour of death" kills Theodorus. "Theodorus speaks for liberty" is still open that season; answered after his death, its failed roll starts a plot led by the dead man. The plot effect checks that its man is not in prison, but not that he is alive.

## Who wins

- **Nothing wins almost always.** Only the careful bot in the first island test passes 90% (92%). In the second island test, the recommended game, the careful bot and the patron each win 86%; the iron hand wins 34%.
- **No exploit found.** The greedy hoarder never wins more than 2%. Played alone, no action wins more than 18% (seizing property, first test). Doing nothing never wins; in the Citadel and the Island it ends half the games by season 5 and all of them by season 10.
- **Random play never wins** in any setup.
- **The exiles at Aetna end the most rules,** in every setup, then the brother of Demarchus.
- **One answer stands out:** in "Counsel in the Island", asking the city's leave to sail away is the best answer in five of the six setups (55% to 83% wins for the random-answer player). The flight answer ends the game at once unless exile is on, as written.

## What never happens

- **Every ending, every action and all but one event came up.**
- **"Men for the walls" (a board petition) never fired.** It needs a city's command given and a Carthaginian army at that city. Only the random player ever gave a command (36 times), so this is as much a gap in the bots as in the game.
- **"A seat lost": "Arrest [taker]" was never open** in the 103 times the matter came up. It needs a content, fully paid guard at the moment a guard seat (captain or citadel) is taken from you, which may never happen together.
- **Seven answers were open but never taken,** even by the random player, because they were rarely open. The list is in results.md.
- **No faction ever asks for land.** The "land" petition kind exists, and Give land answers it, but nothing in the code ever makes one.
- **Motya changes sides in 0% to 2% of games, Panormus in 1% to 3%.** Historically, Dionysius took Motya in 397 BC.
- **Most petitions lapse.** About one comes each season, and even the careful bot lets 87% lapse (the iron hand, all of them).
- **Already known, not counted as new:** events don't remember earlier choices, so follow-ups that need a remembered choice can't fire.

## Fix ideas (not built)

1. Council seats: let the dead, held and exiled leave their seats in exile's season too, or clear a council seat when its holder dies.
2. Dead plotters: start a plot only for a free, living man; better, when a matter's main person dies before you answer it, close the matter.
3. Land petitions: either let a faction ask for land (the guard or the rich), or remove the kind.
4. "Men for the walls" and "Arrest [taker]": a test that sets up each one, to show whether it can come up at all.
5. Motya: decide whether taking it should be reachable in a normal game.
6. The existing bots never give a dinner or a city's command and ignore most petitions. Teaching them would let the 100-seed sim cover those systems.

## Two gaps in the bot, fixed before the final run

- **Dinners:** the dinner action takes a free list of guests, so the first run never gave one. The bot now uses the game's own suggested table, or guests at random.
- **Matters that come up mid-turn,** such as "Reported dead" after a failed strike from exile, were never answered or counted. Each player now answers them in a second pass.
