# Big scenes: the moments that stop the game

Thread 46, 2026-11-27. A council (a games researcher and a historian) looked at how other games stage big moments and how real battles, assemblies and plots turned. **This is the spec for test 5's scenes**, aimed at the plan Jacob approved ("ok do it"): battle scenes with two or three turning points, the general's skill picks the ground, a reserve call, one sea-battle scene, plus scenes for plots and crises. Rule changes sit behind switches, off by default, on in the test 5 preset.

Every mechanic below names the game or passage it comes from, in brackets. Anything with neither is marked *invention* and kept small (mostly numbers).

- Games report: `docs/council/2026-11-27-big-scenes/games.md` (quotes and links).
- History card: `docs/research/big-scenes-history.md` (Diodorus, Thucydides, Plutarch, Devereaux, all from the saved texts).

## The problem

In test 4 Carthage marched into your army at Acragas, Spring 397, and the battle was one line in the season summary. You won it without knowing it happened.

## Five rules for every scene

1. **Only from what is happening.** A scene fires because a battle, a plot strike or a vote is actually taking place, never by chance. [Six Ages: scenes picked "with conditions to make sure they're relevant or interesting"]
2. **Rare, and never the same twice running.** At most one scene a season. A scene shape just used waits before it comes again. [Reigns: cards "played too recently" are removed]
3. **No right answer, only priorities.** Every choice costs something you can see. If there is no real choice, the scene is a report with one "Go on" button. [The Banner Saga: "there are no right choices, only priorities"]
4. **Your people speak first.** Two or three council members give one biased line each before you choose. [King of Dragon Pass advisers; Suzerain ministers; history: the friends' councils at Gela 13.111.1 and in 404, 14.8.5]
5. **Odds shown, and a roll stands.** Each pivot shows its chance first ("4 in 6"), and the result is played out, good or bad. [Disco Elysium red checks: "both the negative and positive outcomes are played out"]

## The scene frame (build 1, no rule change)

A full-screen plate on parchment, like the season card: the library picture large, the faces of both sides, three to five short beats revealed one at a time, the dice and modifiers on a small plate, and what changed. It opens before the next season card. [Total War's post-battle screen: a named result over a picture]

- **The result has a name:** a crushing victory, a victory, a costly victory, a draw, a retreat to camp, a rout. [Total War grades; *invention* where the line between them falls]
- **Report scenes** with no choice, from the log alone: a battle you could not play, a city taken or lost, a seat lost, a plot that strikes. This alone fixes the missed Acragas battle.
- **The mark it leaves:** each scene writes one chronicle line and, where it fits, a lasting tag (a trophy at the field, a grudge, a town's memory). [Oath: "a map that remembers"; Six Ages: "a choice may trigger another scene at a later date"]
- **Art:** all from the library (`assets/library/catalog.json`): Hoplites clash, the trophy, the siege tower, the sea battle, the Punic fleet, the debate, the assembly, the dagger, torchlight, mourning, the arrest. Mosaic faces. Nothing new to draw for build 1.
- **Phone:** picture on top, beats underneath.

## The battle scene (build 2, switch `battleScenes`)

The same dice and modifiers as now, split into stages, with a balance bar from "they break" to "you break". [Six Ages: planning, skirmish and melee, each melee turn pushing a balance bar (fan wiki, no quote); King of Dragon Pass: the opening clash "affects the odds"]

**Timing.** A battle Carthage starts is now fought in the world step, before you act. With the switch, armies that meet stop face to face, and the battle is fought as the scene at the start of your next player step. Bots answer the same choices, so 100-seed runs still play it. [*invention*, needed for any choice inside a battle]

**Stage 1, the ground.** The better general (plus a roll) picks the field; thread 47's ground types (plain, hills, river, pass, marsh, by the sea) and contingents feed this. [thread 47's proposal; Field of Glory: generals add dice]

**Stage 2, the plan.** The existing battle plate: hold the line, strike a wing, a combined attack, and the reserve. The enemy general's habit is shown first. [our plate; history: the Gela plan, 13.109.4-5]

**Stage 3, the turning point.** The scene picks one danger from the state, the ones the sources show deciding battles:

| Danger | Fires when | Your choice | From |
|---|---|---|---|
| A part comes late | Combined attack set | Wait for it, or attack with what you have | Gela: "came too late" (13.110.4) |
| A wing wavers | A contingent's town dislikes you (thread 47) | Send the reserve to it, or let it go and save the rest | Cronium: the winning wing routs when the other is crushed (15.17.2) |
| The commander is rash | Your admiral or a bold captain | Rein him in (lose the edge) or let him go (more to win, more to lose) | Leptines "in no cowardly fashion, but without prudence" (14.60.2) |
| A general falls | A beaten side's general rolls badly | Spread the news, or hide it | Himera: "reported that the general had been slain" (11.22.3); Cronium 15.17.1 |
| Men you distrust | The guard or hired men you suspect | Send them first, and let them die | Syracuse 396: "flee and leave the mercenaries in the lurch" (14.72.2-3) |

**Stage 4, after the battle.** Most killing came in the pursuit [history: 11.22.4, 14.60.5, 15.17.3, Thucydides 7.44.8], so this is a real choice:

- *Winner:* pursue (more of them die, yours tire, a night may save them [15.17.4]), sack the camp (silver and the guard's love, they get away), or stop the killing and offer terms [14.9.5]. [The Banner Saga: pursue or pull back]
- *Loser:* the reserve covers the retreat to camp (existing rule), or ask a truce to bury the dead and slip away by night, leaving fires burning [Gela, 13.111.1-2].
- *A secret offer:* if Carthage is beaten and its army trapped, it may offer silver to let its own citizens sail home [Syracuse 396, "the three hundred talents", 14.75.1]. Taking it pays you and keeps the city needing you; your allies may see it. [history]

**Counting.** The plate once made battles easier and was fixed; this build reruns the war council's five testers and reports win rates before and after. Counted, not tuned to history.

## The sea-battle scene (part of build 2, with test 5's navy)

One scene for a fleet battle, shorter: the line, the admiral's discipline, the swimmers. [history: Catana, 14.59-14.61]

- *Before:* fight near your army's shore, where beaten ships can take refuge [14.59.6].
- *The turning point:* the rash admiral (above).
- *After:* a council of fight on or go home; if you go home, allies may desert [14.61.1-3].

## Plot and crisis scenes (build 3, switch `crisisScenes`)

**Plots already give warnings**; the scene makes the last ones a sequence instead of lines. The order the sources show: grumbling, a spark, the night, a council, a feint, outside help, a split among the plotters, mercy or killing. [history: the revolt of 404, 14.7 to 14.9; the cavalry revolt of 405, 13.112-113]

- **Warnings as counted signs.** Each warning is a mark on the plot's card, with the most it can take shown. [CK3 schemes rework: "breaches"]
- **The strike as a scene.** When a plot strikes, a short scene: the place, who is with you, your defense against their roll, the odds shown first. If you live, choose: the guilty die, the guilty are spared for a price, or you blame someone you are not sure of. [Pentiment: "it's never going to be clear if that's really the person"; history: mercy at 14.9.5]
- **The city rises (a crisis with phases).** When two factions are rebellious and the guard wavers, the crisis opens as a track with phases: unrest, the blockade, the council, the break. Your actions push it; each phase change is a scene. [CK3 Struggles: phases moved "by way of catalysts"; Stellaris Situations: a bar with reasons, resolved at either end]
- **The winding-sheet council** (once a game, when you are shut in the citadel): Heloris, Polyxenus and Philistus each speak, with their real lines, and you choose to stay, to flee, or to feign terms and send for help. [history: 14.8.5 to 14.8.6; *invention*: who in the cast speaks if one of them is dead]

## The debate (later, not test 5)

Parked for the build after test 5 unless Jacob wants it sooner: a debate in the assembly with two standings that rise and fall, the opponent's line shown first, moves from the attested levers (a rich friend pays your fines [13.91.4], an ally's word [14.70.1-2], armed men present [14.70.2], invoking Gelon [13.94.5], gifts after [14.70.3]), and a lost vote that can be tried again next spring. [Griftlands: resolve; Republic of Rome: vote order, blocs, veto; Disco Elysium white checks; history: Theodorus 14.64-70]

## What stays invention

The size of the balance bar, how far each stage moves it, the result names' thresholds, the crisis track's length, and every number. All are picked once, counted across seeds, and never tuned to historical rates.

## Build order for test 5

1. **Scene frame and report scenes.** About one thread. No rule change.
2. **Battle scene and sea-battle scene** (`battleScenes`). About two threads; needs thread 47's ground and contingents for stage 1 and the wavering wing, and the navy for the sea scene. Can be built before them, with plain stand-ins.
3. **Plot and crisis scenes** (`crisisScenes`). About one to two threads.

## Questions for Jacob

1. May leading in person, or a plot strike, kill you inside a scene, with the odds shown on the button? (Proposed: yes.)
2. Scenes pop up for battles, plot strikes and lost seats; everything else waits at the top of the season. All right?
3. The debate: after test 5 (proposed), or in it?
