# Jacob's second island test: his words (2026-11-26)

Quoted word for word, before any summary. Build played: test link https://claude.ai/artifact/8KqQzj6x3QrXRjQKzVZNK4, preset "Second island test" (30 seasons), main at 6bd1ae0 (PRs #83 and #85). His save is `save.json` (seed 254415); it replays exactly (`npm run replay-save -- docs/playtests/2026-11-26-jacob-test2/save.json`, digest 84d460fe3b58e19f). He was killed in Autumn 399 BC, season 24 of 30.

Times are Chicago time. The answers given in the thread are summarised after each note; the full replay findings are in `debrief.md`.

## In the thread, while playing

(2:50 PM, with a screenshot of Doricus's card, `standing-doricus.png`)

> I don't understand the Standing. 2 of a seat? faction to  leader? his a player?

Answer given: Standing is a five-step ladder (Nobody, Notable, A player, A rival, A pretender). "A player" is the name of a step, meaning someone who stands for seats and makes deals; it does not mean the human player. A person climbs from Notable to A player by having two of three things: a seat (an office), leadership of a faction, or a following (influence 2 or more). Code: `nextStep` in src/core/board.ts, ladder names in data/board.json.

(2:55 PM, with four screenshots: two mood tracks `mood-loyal.png` and `mood-angry.png`, Aristomache's card `aristomache-he.png`, the common citizens' card `citizens-agenda.png`, Rebellious, 7 Active, agenda The people's assembly at step 3 of 4)

> this looks funky. she is called a he. I don't know how to stop or pushy back the agenda the game just started and they almost have it

Answer given: the mood track is five boxes (Rebellious to Loyal) with the current one lit and a red line after Angry, where a faction starts backing plots. Aristomache's "He" is a bug: the standing hint is written with "He" for everyone although the data marks her as a woman. Ways to slow the citizens' agenda, from src/core/ai.ts (`factionTurn`, `agendaStep`): make them Content or Loyal (this preset's "Reap what you sow" rule stops an agenda against you while they are happy; grain handout, giving them land, a law for the citizens); Block their leader (needs leverage over him; skips their next step); act against their leader or the citizens that season (-1 to their roll); drop their power to Marginal (no agenda roll at all). Being Rebellious does not slow it; it makes them back plots as well. When it completes, the assembly gives their leader the generalship.

(3:00 PM, with two screenshots: the Arrange a marriage form with target Hipparinus and relative "Yourself", `marriage-form.png`; the result "Thearides marries Aristomache. Hipparinus's house is bound to yours", opinions up, silver +2 the dowry, `marriage-result.png`)

> I'm allowed to marry a man and men can marry men in general which prob shouldn't be a thing. Or maybe it's just shown weirdly . Alsnot not clear who gets the dowry or what is conisdered a good marriage. Hipparnis is my ally now and holds the mint but doesn't say he is minting coins for me

Answer given: the target is the house, not the spouse. The game marries your relative to the first unmarried person of that house (here Aristomache, Hipparinus's daughter), but the form never says who that will be, and the code has no check on sex, so two men can be matched. The dowry is yours (your silver). "A good marriage" is only the reason text for your relative's +2 opinion; every marriage counts as one. The mint: a holder bound to you by marriage with opinion 0 or better is friendly and strikes +1 silver for you each Autumn (src/core/board.ts `powers`, `attitude`); the seat card's line updates when the season's powers run, so it shows after this season ends.

(3:11 PM, with three screenshots: a town's "Toward you: undecided. Lean helps an embassy win it and makes it likelier to go over to your army nearby." `toward-you.png`; the Rivals list with Hipparinus +3 Devoted, Rival, Power behind the throne, Climber, influence 4 against your 5, and Leptines +2 Friendly, Rival, Contender `rivals.png`; the rich families, 9 Dominant, Rebellious, led by Hipparinus, backs a plot, agenda The cavalry come home (done) `rich-families.png`)

> this wording isn't clear or great. Also I don't understand how to send armies near a city or what counts as near. Nobles I think succeded in geting exiles home but they're still on the map. Also not super clear what happens when a man who loves me is a rival

Answer given: "Near" means your army ends a season within 6 days' march of a free or tribute town; the town then rolls a die plus its lean, plus 1 if your army has 6 or more men and plus 1 if it is the strongest on the island, and needs 7 to come over (src/core/island.ts, data/island.json). You march with Send the army, which lists each town with its days. Exiles: when the rich families finished The cavalry come home, the exiled men came back into the city (the leader of the exiles now shows "In the city"), but nothing changes Aetna on the map, so it still shows as the exiles' fortress: a bug. A rival who loves you: his love makes the seats he holds work for you (Hipparinus's mint strikes coin for you), but it does not stop his climb. At influence 5 he becomes a Pretender and takes up Take his place, which needs a second faction behind him in this test; a political rival wants your place, not your life.

(3:14 PM, with a full-screen screenshot of Spring 403 BC, season 7 of 30, `spring-403-war.png`: Carthage's anger 7 of 10, grain 2 months, citizens riot for bread, "Carthage's council turns to a new goal: War on the tyrant", "Carthage declares war on Syracuse", Himilcon given sole command)

> maybe I can manuelly move a army anywhere I want? As I drag it around I see it's sphere of influence and travel time and stuff. Maybe it can forage out a certain area or war deveastws local crops. I just got into a war with carthage appartnyl? Not clear how that happened

Answer given: the war came from Carthage's anger reaching 7 of 10 this spring (the riot for bread added the last point). Carthage's council has three blocs: the Hundred want war at anger 6, the people's assembly at 7, the Elders at 8, so at 7 two blocs out of three wanted war (src/core/carthage.ts `prefers`, data/carthage.json warAnger). Anger also rises each year as Carthage rebuilds, when you take free or tribute towns (Catana), when an exile raids Carthage's lands, and when the rich families, Angry, send word to Carthage. Dragging armies, reach rings and area foraging parked in docs/later.md. Forage already exists as an action (one town's farms: food for a season, the town loses grain and turns against you).

(3:20 PM, with a screenshot of the map and Gela's sheet, Side: Your ally, but Gela drawn in dark ink, `gela-map.png`)

> also kinda sucks to keep tabbing back and forth between the map and the army commands. Gela is my ally but doesn't show it

(3:22 PM)

> I can't munster more men into my army without disbanding it first

(3:30 PM, with a screenshot of the event "Pay in land", `pay-in-land.png`)

> why am I able to give the city that I don't own? Is this just a intended promise or bug

(3:32 PM, with a screenshot: "Embassy to a city (Gela (pays tribute to Carthage)) It worked. Silver -1 (now 1). Gela becomes your ally." `gela-embassy.png`)

> carthage conquered gela but left and I was able to get it back for basically free?

(3:34 PM)

> I don't know how to feed a army

(3:35 PM)

> does paying for mercs increase my army?

(3:38 PM, with a screenshot of the event "A joke at the ball game", whose first choice ends "FavouriteKin becomes your enemy. JokerKin becomes your enemy." `ball-game-joke.png`)

> bug text

(3:41 PM)

> Having a ally own the mint gives me free money I think but owning it myself takes a 3rd of my action econ to use it. Something worth thinking about idk if thats bad or not atm though

(3:44 PM, with a screenshot of the island view with the silver tooltip open (net -1 a season) and Carthage's council, `silver-tooltip-map.png`)

> I'm not sure allies are sending support in terms of silver/grain/men properly

(3:46 PM, with a screenshot: "The leader of the exiles at Aetna tells the city that you held the leader of the exiles at Aetna's secret over him." `exiles-secret.png`)

> bug I assume

(3:46 PM, with a screenshot of tribute lines from Leontini, Catana, Messana and Gela, `tribute.png`)

> also now tribute works but idk if it was before

(3:56 PM, with a screenshot of the silver tooltip: -4 the guard's pay, -2 the levies' pay in the field, `guard-levies-pay.png`)

> why do guards cost 4 and army 2

(4:02 PM, with a screenshot: "This season: Your army at Acragas has food for one more season." `army-food.png`)

> idk how to feed also carthage war has been going on this whole time yet they haven't really been here. At the start they landed a big army and took a city but right before crushing me they got sent home to deal with a revolt. On one hand thats cool but also it's been awhile and they haven't been back and I own most of the island

(4:05 PM)

> sometimes when I try to mint coin like in spring 399 I don't get money?

(4:11 PM, pasting his save, now `save.json`)

> So I'm not 100% what happened. What was I suppose to do to deal with the leader of the exiles. I think the nobles brought them in. I failed to imprision. And then they whined about me for 20 years and made my realm unhappy but it was hard to tell. The rich families killed me on their own? Did I have a chance to survive?

(4:11 PM)

> Also chronicle WAY too long we gotta shorten that down to the important stuff and good story arcs

(4:13 PM)

> I was a bit annonyed people kept asking for my positions. idk maybe it just me but there should be more to it? In ck3 you have a domain limit maybe we need something like that for positions. Or people should offer me deals? Maybe I'm just playing it wrong but it felt bad to just give up stuff for seemingly no reason

(4:14 PM)

> I find that I kept doing the same actions over and over too

(5:16 PM, after the debrief)

> My guard should probably come home right?

(5:50 PM)

> Why only 5 fixes what about all. List them

Answer given: the guard already comes home on disband; it is lost only when men die in the field (losses fall on guard and levy in proportion, `loseMen` in src/core/island.ts). His 3 guard units died of hunger in the siege of Leontini (the army fell from 30,000 to 10,000 in Spring to Winter 402). His rule, recorded below: the guard is lost only in battle. The full numbered list of 30 was posted in the thread.

The notes from 3:20 to 4:14 PM were answered together after the replay (my session restarted and missed them for about an hour); see `debrief.md`.

## In the game's check-ins (from the save)

- Season 10: difficulty "right".
- Season 20: "I had a good rival for a bit but now I seem to be fully in control of everything"; difficulty "easy".
- Verdict at season 25 (shown after his death): left blank.

## Suggested fixes (recorded only, nothing built during the test)

Bugs (cheap):
- Pronouns: standing hints (`nextStep` in src/core/board.ts) say "He" for women (Aristomache). Use the `sex` field from data/people.json; check other "he/his" templates too.
- Marriage has no check on sex, so two men can be matched (src/core/actions.ts `marriage`).
- The Cavalry come home brings the exiles into the city, but Aetna stays the exiles' town on the map.
- Open towns on the map ignore their side's colour: `.island-map .town { fill: currentColor }` in ui/styles/art.css overrides the `fill` attribute that `cityMark` sets on open towns, so every roofed town is drawn in ink (Gela, an ally, looked free).
- "Pay in land" offers Leontini when it is merely free (data/island-events.json `mercenariesWantLeontini`, town side free/ally/syracuse). Require ally or yours.
- Event text shows raw role names: "FavouriteKin becomes your enemy. JokerKin becomes your enemy." (A joke at the ball game).
- A secret about the teller himself reads "tells the city that you held the leader of the exiles at Aetna's secret over him"; should read "that you blackmailed him".
- Guard pay never falls when men are lost: upkeep rose by 1 per hire and stayed at 4 after the guard fell to 0 (Winter 402/401, "mercenaries lost in the field"); he paid 4 a season for ten seasons for no guard. Tie pay to strength.

Display (cheap unless marked):
- Standing line is unreadable. Rename the step "A player" (clashes with "you, the player"; e.g. "A power" or "A man of weight", Jacob's call) and show the hint as a short list: "Next step: needs two of: an office, leading a faction, a following. Has: none."
- Mood track reads as "funky": a lone lit box plus a red divider. Label the ends (Rebellious ... Loyal) or fill up to the current mood, and say on the card "Angry or worse: backs plots".
- Faction agenda card gives no way to fight it. Add "Slowed by: making them Content, blocking their leader, acting against them, cutting their power". The citizens reached step 3 of 4 within the first few seasons; pace is Jacob's call.
- Marriage form: name the actual spouse, say the dowry comes to you, drop or explain "a good marriage".
- A seat's line ("strikes coin for you") should change at once when the holder's attitude changes, or say "from next Autumn".
- Town line "Toward you: undecided. Lean helps..." is unclear: "Undecided. Warmer towns are likelier to join you when your army is within 6 days, or when you send an embassy." A 6-day ring on the map is costly.
- A Devoted rival is a mixed signal: say on his card what his love does and does not do ("Uses his seats for you. Still climbing: at 5 he becomes a Pretender."). Also odd: Hipparinus was Devoted while the faction he led was Rebellious and backed a plot.
- War came as a surprise: mark the war lines on the anger bar (6, 7, 8 by bloc) and warn a season ahead; tie each anger gain to its cause.
- Squeeze actions keep firing when empty: Strike coin 12 times (silver once) and the levy on the rich 11 times (nothing after the fourth), each still -1 to the rich's mood. Grey the action or say "brings in nothing now" on the button.
- Feeding the army is invisible: it refills only in a friendly town with 2+ months of grain and not besieging. Say so on the army card and in the food warning.
- Muster can't add men to an army in the field: say why on the button (a Reinforce action is costly).
- Map and army orders are on different tabs: Send the army from the map by clicking a town. Costly.
- Chronicle about 7,100 words over 25 seasons, with 70 "(the Nth time)" repeats. Cut it to the arcs (Jacob: "shorten that down to the important stuff and good story arcs"). Costly.

Design questions (Jacob's calls):
- Jacob's rule (5:16 PM): the guard returns to the citadel when an army is disbanded and is lost only in battle, not to hunger or desertion.
- Should love slow a rival's climb?
- Retaking a town Carthage just took costs one embassy (1 silver): Carthage never leaves a garrison.
- Carthage's war went quiet for years after its army went home to Libya while he held most of the island.
- A mint held by a friendly man is free silver; holding it yourself costs an action.
- Office requests felt like giving things up for nothing: requests should come with offers (deals) or a cap like CK3's domain limit.
- "Pay in land": if the town is free, is giving it a promise (take it later) or simply not allowed?
