# How great political games work, and what it means for this game

Research note, 2026-11-22. **Report only: nothing here is built or decided.** Every recommendation is a proposal for Jacob. Anything he picks goes through `scope.md` or `later.md` first.

How to read it: the ranked list comes first, then what each game teaches, then the sources. Each item is marked **cheap** (a day or less of work, mostly data or small code) or **costly** (a new system or a lot of writing). The top five are starred.

What I looked at in our own game: rules v2 as built in the prototype (`data/*.json`, `src/core/`), the paper test write-up, and one full bot game (seed 7, 15 seasons, ends with Nicoteles recalling you through the assembly). Quotes from that game are below as evidence.

---

## The ranked list

### ★1. Make the warnings real clues about the real plot (cheap to medium)

**Now:** warnings come from a fixed pool of flavour lines. In seed 7, "A slave is seen carrying letters out by the Achradina gate" appears in 10 of 15 seasons, sometimes twice in one season. It says a plot exists but never who or why.

**Borrow:** CK3's scheme rework made discovery a visible count ("breaches"), and every breach is a moment the target learns something. The nemesis games made enemies memorable by showing their history on them (scars, taunts that cite your last meeting). King of Dragon Pass hands information to you through people, not meters.

**Proposal:** build each warning from a logged action of a real plotter. "Theodorus' steward was seen at the house of the brother of Demarchus." "Someone paid the guard captain's debts." The player can then act on the clue (watch the steward, pay the captain first). The flavour pool stays for colour, used once each per game. This is the cheapest way to make a death feel earned, which is a core rule in `CLAUDE.md`.

### ★2. Turn the chronicle into a story, not a log (medium)

**Now:** the chronicle joins the season's log lines. Game terms leak in: "The citizens complete a step of The people's assembly: Build a following." The ending line lists all four ways a Pretender can win, not the one that happened: "You lose your place: the assembly recalls you, the guard or the strongest faction switches to them, they hold too many offices to remove, or a vote exiles you."

**Borrow:** Tynan Sylvester on RimWorld: "The real engine of story is the gameplay systems themselves", but the player has to be able to see the story. Dwarf Fortress's Legends mode shows each person's life as a list of deeds with causes (general knowledge, not checked this session).

**Proposal:** group a season's lines by storyline (one plot, one rival, one faction agenda) and lead with cause: "Leptines, refused the generalship for the third time, went over to the plotters." Write agenda steps as deeds, not step names. Keep the full log in the designer view. No LLM needed: these are templates over the log.

### ★3. Make plots less all-or-nothing (medium)

**Now:** in the latest 100 seeds, 70 of 79 strikes landed. Once a plot strikes, you are almost always dead.

**Borrow:** Paradox reworked CK3 schemes for exactly this. The designer wrote that the old system was "a bit too random" and "very… binary": "You could either almost definitely pull a scheme off, or it wasn't even worth attempting." Defence was the same: "you were generally either completely safe or utterly screwed." The fix gave schemes a few named agents with jobs, a growing success chance, and counters the target can use.

**Proposal:** a plot picks a **method and a moment** from data (poison at a feast, a blade at the dockyards, a gate opened by a bribed guard). Each method needs a kind of member (a cook, a guard, a gatekeeper) and a moment the engine can show in a clue. Your counters are concrete: change your table, sleep somewhere else, buy the gatekeeper. This gives the middle ground between "safe" and "dead", and gives the sword check a scene. Tune nothing to history; just count landed blows afterwards.

### ★4. Give your inner circle voices: a council that argues (medium)

**Borrow:** King of Dragon Pass's clan ring: seven advisors who comment on every decision from their skills and personality, and are sometimes wrong. Six Ages added advisors who "may also initiate actions to further their own agendas". Suzerain's ministers argue both sides before you decide; the reviewer at Vice wrote that "Most decisions you make will occur after hearing your ministers and advisors argue their sides."

**Proposal:** when you face a petition, a vote or a plot clue, two or three of your people (Philistus, Leptines, Heloris, Polyxenus) each give one line of counsel built from their traits, opinion and agenda. A Spymaster-type rival gives advice that serves himself. This is where Jacob's Varys and Littlefinger figures get a stage: you see them in every decision, so their betrayal lands. It uses people already in `data/people.json`; the lines are templates in data.

### ★5. People remember, escalate, and stop repeating themselves (cheap)

**Now:** in seed 7, Leptines petitions for the generalship in 8 of 15 seasons. He becomes your rival (Humiliated) three times and is pardoned twice. Repetition flattens the drama.

**Borrow:** King of Dragon Pass: "every decision you're making is a result of choices made hours ago" (a reviewer quoted by Aaron Reed). The nemesis rivals taunt you with what happened last time.

**Proposal:** a person asks, then demands, then acts (joins a plot, goes to a rival, leaves the city). Each refusal is a memory with a date that later lines cite. A pardon clears a grudge once; a second pardon for the same wrong is worth less. One ask per person per office.

---

### 6. Secrets come from deeds, and hooks come in two strengths (medium)

**Borrow:** CK3: "Characters can acquire Secrets when they do something that is frowned upon or outright illegal." A secret can be exposed or turned into blackmail. Hooks are weak or strong: "weak Hooks are used up once expended, while Strong Hooks only get a cooldown." Holding a hook on someone deters them.

**Proposal:** our leverage is one generic token ("what your watchers saw"). Instead, secrets are made by logged deeds (taking a bribe, joining a plot, an affair, killing a guest) and name the deed. A small secret gives a one-use favour; a deadly one gives a lasting hold. **And you have secrets too**: your own deeds (an execution without trial, money taken from a temple) become leverage for rivals. The parked cast stories (Andron tempted to seize the citadel, the drugging charge against Doris' mother) are natural sources.

### 7. Promises and votes you can trade (medium)

**Borrow:** Twilight Imperium's agenda phase: players spend influence as votes and trade for them, and deals that cannot be settled at once "are not binding and can be broken with no gameplay repercussions". Diplomacy is built entirely on non-binding promises (general knowledge, not checked this session). The Game of Thrones board game turns influence into secret bids for turn order and tie-breaks.

**Proposal:** before an assembly vote, you may buy a faction's vote with a **promise** (land next season, an office, a pardon). The engine remembers it. A broken promise is a grudge with its date, and the faction trusts your next promise less. This makes the assembly a place of deals, and breaking your word a real choice.

### 8. Pace the pressure like a storyteller (medium)

**Borrow:** RimWorld's storytellers. Cassandra "will push you with dangerous events, then give breathing room, then come back to push once more." Sylvester: "The game tries to hurt but not kill the colony", and "The storyteller eases off when the colony population drops."

**Proposal:** a small pacing rule, not a script: after a strike or a riot, the next season is quieter (plots regroup, factions lick wounds). This is pacing, not tuning to history, but it does shape outcomes, so it is Jacob's call. Our bot games last 9.8 seasons on average out of 40; breathing room would show whether that is the bot or the rules.

### 9. Write events as storylets in data (medium, and grows with content)

**Borrow:** Emily Short's storylets: "there is a piece of content", "there are prerequisites that determine when the content can play", and "there are effects on the world state". They are "simple, atomic, robust, and recombinable." King of Dragon Pass works this way: each scene's outcome changes the state, and "the new simulation state impacts the pool of what future scenes are now available."

**Proposal:** this fits our rule "never write an event as code". An event is a data record with conditions (who, which faction mood, which office), text with slots, and the actions it triggers through `ops.ts`. Start with the four parked cast stories. Short's warning: storylets that depend on an exact route cause "too much combinatorial explosion", so keep conditions on state, not on history paths.

### 10. A common danger that tests the factions (cheap)

**Borrow:** in Republic of Rome, if the players do not cooperate against outside threats, "the game wins and all players lose". The tension between rivalry and shared survival is the game.

**Proposal:** when the Carthage clock is high (say 8 or more), each faction's priority list puts defence first, and a faction that plots anyway loses mood with the others. Carthage stays a clock, as scope requires, but it now changes faction behaviour.

### 11. Acting against your own nature costs something (costly)

**Borrow:** CK3's stress: "One of the quickest ways to have a stress-induced breakdown is by acting in ways that conflict with your personality." It "encourages roleplaying without actually stopping you from doing whatever you want."

**Proposal:** your character's traits make some actions cost composure (a Suspicious ruler who pardons, a Generous one who seizes property). Too much and you get a visible flaw that others can use. Costly, because it needs a new meter and UI. Fits "you play a person, not a state". Probably after the core loop is fun.

### 12. Keep the people in the politics (affirm what we have)

**Borrow (as warning):** Bret Devereaux's critique of Imperator: its "extremely elite-centric design" "cannot incorporate the democratic elements" of ancient republics. Republic of Rome made the same cut on purpose: "the citizen assemblies were intentionally ignored."

**Proposal:** nothing new. Our assembly votes and the citizens' agenda (which deposed the bot in seed 7) already do this. Keep them strong when tuning, and resist making the game only about the rich houses. This is a design note, not a thesis about Syracuse.

### 13. Shown odds: keep exact numbers for now (decision for Jacob)

CK3's rework moved from an exact chance to ranges ("they don't give an exact value"). King of Dragon Pass never shows percentages and explains failure inside the world ("I really should never have done that, it was a stupid idea!"). Our prototype shows every target and modifier. For playtesting, exact is better. Later, Jacob could pick a softer display (words like "likely") with the exact numbers one click away.

---

## What to avoid (traps other games fell into)

- **Feature creep around the core** (cheap to avoid). Shadow of Mordor's nemesis system grew Uruk factions with morale and discipline bars, then was cut back: the team "progressively returned to something closer to the original focus." The director also blamed "insecurity about our core systems" for work on side features. Our drift guard (`scope.md`, `later.md`) is the right defence.
- **Promising a living world and shipping a thin one.** Republic: The Revolution was marketed with "thousands of factions" and shipped "a total of ten". Reviews called its ideology "rock, paper scissors" and its interface "woeful", and found the 3D city "the least involving part of the game". Lesson: few factions, deep; no map until the politics work (already the plan).
- **Hand-writing everything.** Suzerain is about 450,000 words and King of Dragon Pass needed "over five hundred" scenes. We can't write that. Use people, memory and templates, and save hand-written storylets for the sourced history.
- **All-or-nothing danger.** See ★3: CK3's own designers called their old schemes "more of a catapult than a crossbow."
- **Clues without consequence, and repetition.** See ★1 and ★5.

## What is missing from v2

1. **A goal of your own beyond survival.** Right now you only react. Possible: a few ambitions to pick (build the citadel, found a dynasty by marriage, beat Carthage at sea), each a multi-season agenda for the player, like the factions have. Cheap in data.
2. **Relationships with names.** Opinion is one number. CK3-style named bonds (friend, rival, lover, sworn enemy) would give the chronicle sentences and the council voices (general knowledge of CK3; not checked this session).
3. **Your secrets.** See 6.
4. **A reason to fear your friends' success.** A loyal brother who wins too many commands becomes the Heir type. The data has it; the UI should show the warning sign early.

## Our design and the Warner Bros. patent

US patent 10,926,179, "Nemesis characters, nemesis forts, social vendettas and followers in computer games", was granted on 23 February 2021. Google Patents lists it as "Active, expires 2036-08-11" (news sites say 2035 or 2036). I could not read the claims themselves. Patent Arcade's summary of claim 1: an interaction between the player and one opponent changes the stored parameters of a **second** opponent, and the game shows that change.

This doesn't matter for a private hobby game (decision of 2026-11-22). If the game were ever published, the parts of v2 closest to that description are "waiting in the wings" and rank-ups that follow from another rival's fall. Our rivals grow from their own grudges against you, which is a different core. A lawyer, not this note, would have to judge it. This is not legal advice.

---

## What each game teaches (short)

| Game | The one thing to take | Checked this session? |
| --- | --- | --- |
| Crusader Kings III | Secrets from deeds; weak and strong hooks; stress from acting against traits; schemes reworked to avoid all-or-nothing | Yes (dev diaries 5 and 157, PC Gamer) |
| Crusader Kings II | Plots and favours, the ancestors of CK3's schemes and hooks | No |
| Shadow of Mordor and War | Enemies with names, scars and memory; "orcs that the player loved to hate"; cut back to the core | Yes (PC Gamer, Game Informer, Kotaku, Game Developer) |
| King of Dragon Pass, Six Ages | Advisors with skills and agendas; scenes as data; consequences that return | Yes (Aaron Reed, Game Developer) |
| Suzerain | Ministers argue both sides; budget as a few units; deals that "haunt the rest of my term" | Yes (AV Club, Vice, Wikipedia) |
| RimWorld | A storyteller paces pressure; hurt, don't kill | Yes (RimWorld wiki, Game Developer) |
| Dwarf Fortress | Legends: a life as a list of deeds with causes | No |
| Republic: The Revolution | Ambition outran the game; avoid a big map before the politics work | Yes (Wikipedia, GameSpot) |
| Tropico | Factions with approval and demands | No |
| Twilight Imperium | Votes bought with influence and non-binding deals | Yes (FFG preview, 2017) |
| Diplomacy | Promises are the whole game, and none bind | No |
| A Game of Thrones: The Board Game | Secret bids for influence tracks; orders placed face down | Partly (a student analysis; the publisher's page failed) |
| Republic of Rome | Rivals who all lose if the state falls | Yes (Wikipedia) |
| Root | Asymmetric factions that play by different rules | No |
| Imperator (via ACOUP) | Don't model only the elites | Yes (ACOUP) |

## Sources (all opened this session unless marked)

- CK3 Dev Diary #5, Schemes, Secrets and Hooks (pre-release): https://admin-forum.paradoxplaza.com/forum/developer-diary/ck3-dev-diary-5-schemes-secrets-and-hooks.1289167/page-3
- CK3 Dev Diary #157, Schemes and Stories: https://admin-forum.paradoxplaza.com/forum/developer-diary/dev-diary-157-schemes-stories.1703863/post-29887149
- PC Gamer, CK3 stress: https://pcgamer.com/crusader-kings-3s-best-feature-is-that-you-can-get-so-stressed-out-you-die
- Nemesis design: https://www.pcgamer.com/shadow-of-mordors-nemesis-system-inspired-by-multiplayer-sports ; https://www.gameinformer.com/b/news/archive/2015/01/20/shadow-of-mordor-s-nemesis-system-was-once-a-bit-more-complicated.aspx ; https://kotaku.com/shadow-of-mordors-nemesis-system-couldve-been-way-more-1681120649 ; https://gamedeveloper.com/design/video-how-the-nemesis-system-in-i-shadow-of-war-i-was-designed (page summary only; the talk was not watched)
- Patent: https://patents.google.com/patent/US10926179B2 ; https://www.patentarcade.com/2021/02/warner-brothers-granted-patent-for-nemesis-system-from-middle-earth-video-games.html
- King of Dragon Pass: https://if50.substack.com/p/1999-king-of-dragon-pass
- Six Ages: https://www.gamedeveloper.com/design/how-i-six-ages-i-builds-a-game-around-the-power-of-myth ; https://www.gamedeveloper.com/production/making-six-ages-for-ios-a-retrospective
- Suzerain: https://www.avclub.com/suzerain-interview ; https://www.vice.com/en/article/suzerain-game-review/ ; https://en.wikipedia.org/wiki/Suzerain_(video_game)
- RimWorld: https://rimworldwiki.com/wiki/AI_storytellers ; https://www.gamedeveloper.com/design/how-i-rimworld-i-fleshes-out-the-i-dwarf-fortress-i-formula
- Republic: The Revolution: https://en.wikipedia.org/wiki/Republic:_The_Revolution ; https://www.gamespot.com/republic-the-revolution/reviews/republic-the-revolution-review-6073646/
- Twilight Imperium 4, A Galactic Council: https://www.fantasyflightgames.com/en/news/2017/9/13/a-galactic-council/
- A Game of Thrones: The Board Game (student analysis): https://babel.speldesign.uu.se/?p=6204
- Republic of Rome: https://en.wikipedia.org/wiki/Republic_of_Rome_(game)
- ACOUP, Teaching Paradox, Imperator, Part IIIa: https://acoup.blog/2024/08/24/collections-teaching-paradox-imperator-part-iiia-de-re-publica/ (about the first 40% read word for word; the rest only as a summary)
- Emily Short: https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/ ; https://emshort.blog/2019/11/29/storylets-you-want-them/
- Not opened: Dwarf Fortress, Tropico, Diplomacy, Root, Crusader Kings II. Statements about them are general knowledge and marked as such.
