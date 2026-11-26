# First impressions from five AI testers

Thread 34, 2026-11-26. Asked for by Jacob after his first minutes on the first island test: "everything is very overwhelming. Way too much going on at once or it's just poorly organized or over worded or all 3."

**Report only.** Nothing in the game was changed, and the frozen test link is untouched. Every suggestion below waits for Jacob's pick.

## How this was done

- The build Jacob is playing (main commit 26744da, the same code as the frozen link) was built and walked in a real browser at desktop (1280 and 1440 wide) and phone (390 wide) width: title screen, first season, every tab, a person's sheet, and three seasons played through.
- One session wrote all five seats from the same walk, not five separate sessions. Treat the seats as five lenses, not five independent votes.
- **AI testers are a poor stand-in for a new human.** We read all 1,700 words of a screen in a second and never feel tired. A person skims, looks for "what do I do now?", and gives up on a wall. So the counts below matter more than our opinions, and the human lens (seat 2) gets the most weight.

Pictures: [first season, desktop](first-season-desktop.jpg), [third season, desktop](third-season-desktop.jpg), [first season, phone](first-season-phone.jpg).

## The verdict in one line

**All three.** It is too much at once, it is organized as a reference sheet rather than a turn, and it is over-worded. The cause is mostly layout, not content: the game shows every system's full rules on the main screen, every season, with equal weight.

## What a new player sees: the counts

First season, desktop, before doing anything:

| | Count |
|---|---|
| Words on the season screen | about 1,680 |
| Clickable buttons | 88 |
| Numbers on screen | about 120 |
| Named people | 31 |
| Actions listed | 37 (11 of them greyed out) |
| Screen heights to scroll | a bit over 4 (phone: 5½) |
| Words on the title screen, before Begin | about 450 |

By the third season the screen is about 2,100 words. For scale: a CK3 turn shows a map and three or four alerts; the rest is one click away.

## Five testers, first impressions

### 1. The strategy veteran (plays Republic of Rome, John Company)
"I like the meat: offices as objects, factions with agendas, plots that climb a ladder. But I am shown all four factions' full agenda trees, all six offices' rules, and all 37 actions every season, including 11 I can't use and the reason why for each. That is a rulebook printed on the board. I spent my first season reading, not deciding. I want the board to show state (who holds what, who is angry) and the rules one click away."

### 2. The casual newcomer (the human lens; weighted most)
"I pressed Begin and got a wall. Three columns, all the same size, all full of text. I didn't know where to look first. There is a yellow box telling me six things to do, but it sits in the middle of the story I am meant to read, so I read neither. The banner says 'See Dangers', and I can't find anything called Dangers (on desktop it is called 'Plots against you'). I read the same story about a foreigner and his secret twice. By the second season I was scrolling past everything to find the buttons. I would have quit around here."

### 3. The UX designer
"There is no focal point. The page is a three-column dashboard where the reference (offices, factions), the story (what happened) and the decisions (matters, petitions, actions) all have equal weight. The decisions, the only part that needs the player, sit at the bottom of the middle column, two screens down. Repetition makes it worse: events are printed in the log and again as decisions; each plot's stage name appears twice ('Whispers Whispers Rumors Named Strike'); dice lines ('needed 4, rolled 2, so 2. Failure.') sit next to the sentence that already says it failed; a summer harvest adds eight near-identical lines, one per city. The look (parchment, type, the season card, the map) is genuinely good. It is the order and the volume that hurt."

### 4. The narrative player (here for the story)
"The best things on screen are the stories: the man who claims a secret for finding plotters, the slave from Catana, Leptines drawing a plan with a spear taken from your own guard. They are buried between dice rolls, power numbers and grain counts. The season card ('Your food is tasted twice...') is lovely and sets the mood; keep it. I want three or four good lines per season at the top, and the bookkeeping folded away."

### 5. The CK3 fan
"CK3 is just as deep, but it hides depth behind tooltips and lets alerts pull you in. Here everything is open at once. The 'Who is who' list shows 18 people with +1/−2 scores before I know who any of them are. Rivals called 'The leader of the exiles at Aetna' and 'The brother of Demarchus' are long titles, not names, so they are hard to hold in my head. The island tab is the best screen in the game: a map gives my eye a place to start. The season screen needs that kind of anchor."

## Where they agree

1. **The decisions are buried.** Matters, petitions and actions are what a turn is; they are at the bottom.
2. **Rules text lives on the main screen.** Office rules, agenda steps, "When complete", action costs for actions you can't take, how blows work: all shown every season.
3. **Things are said twice.** Events, plot stages, dice results under outcomes, the first-season box that never leaves until you click "Got it".
4. **Bookkeeping drowns the story.** Dice, power +1 (now 6, Active), eight harvest lines, Carthage's treasury.
5. **The art and tone are not the problem.** Every seat liked the look, the season card and the map.

## Jacob's own notes from playing (added later the same day)

His words, from the test thread, with four screenshots (mood and agenda tooltips, Who is who, the Government box):

> "not clear what level moods there are not clear what the agendas are. hard to tell whose actually important. can't tell what the different governments types are or what they do."

What the build actually does for each, checked in the code of the build he is playing, and what would help. Still report only.

| His point | What the game has now | Why it doesn't land | Suggestion | Cost |
|---|---|---|---|---|
| **Mood levels** | Five moods: Rebellious, Angry, Uneasy, Content, Loyal (`MOODS` in `src/core/types.ts`). The tooltip names only the two ends. | The ladder is never drawn. You see one word ("Angry") with no sense of how far it is from the top or bottom, or which step is the danger line. | Show mood as a five-step track like the power bar, with the current step lit and the line at Angry marked "may back a plot". The tooltip lists all five. | Cheap |
| **Agendas** | Each faction shows an agenda name, its steps as a list, and "When complete". The tooltip says it is a scheme that moves a step each time whether or not you act. | Agendas are shown as a list of verbs ("Petition, Fund the exiles, Win a friend at court, Force terms") with no "you are here", no sign of how close it is to done, and no hint of how to slow it. | One line per faction: "Agenda: The cavalry come home, step 2 of 4. When done, the exiles return." Steps as dots with the current one lit; what slows it (keeping the faction Content) said once. | Cheap |
| **Who is important** | Who is who lists 18 people by faction, each with a number from −3 to +3 and, for a few, a small office word. | The number is unlabelled (it is the person's opinion of you), the office is in tiny capitals, and everyone has the same size row. Nothing marks the leader of a faction, someone in a plot, or a rival. | Sort and mark by weight: faction leaders and office holders first with the office as a plain label ("holds the Mint"), rivals and known plotters marked, opinion as a word ("likes you", "hates you") instead of +2/−3. Show the top six or so; the rest under "Everyone else". Same as suggestion 9 below. | Cheap |
| **Government types** | Four labels, set only by who holds the offices (`government()` in `src/core/state.ts`): Tyranny if one person holds the citadel, the generalship and the treasury; Democracy if the common citizens hold 3 offices; Oligarchy if the rich families hold 3; otherwise Unsettled. How to play has one line on it. | The box never says what the types are or how to reach them. In this build only Tyranny changes play (some events need it, and it affects who offers you marriages); Democracy and Oligarchy are labels with no effect of their own. So a player looking for what they do finds nothing, because there is nothing yet. | Cheap: the Government box opens a short card listing the four types, the rule for each, and what each changes (honestly "nothing yet" for two of them), with a hint toward tyranny ("you need: the citadel"). Costly, and a rules choice for Jacob: give Democracy and Oligarchy real effects, or drop them as labels. | Cheap / rules |

These four fit the main finding: the game has the information, but shows it as rules text or bare numbers instead of a picture of where you stand. Mood, agenda progress and importance all want the same treatment as the power bar, which every tester could read at a glance.

## Suggestions, ranked

Starred are the top five. Cheap means an afternoon or less of UI work; costly means a real layout change. None touch the rules.

| # | Suggestion | Kind | Cost |
|---|---|---|---|
| ★1 | **Put "Needs you" first.** Order the season screen as: a three-line summary of the season, then the matters and petitions, then your actions. The full log moves below or into a fold. | Group | Costly |
| ★2 | **Say each thing once.** An event that asks you something appears only under "Matters before you", not also in the log. Plot ladders drop the repeated stage name. The dice line goes when the sentence already says success or failure. | Cut | Cheap |
| ★3 | **Hide the dice and the routine.** Dice rolls move to Designer view. Harvest and other per-city lines collapse to one ("The harvest is in: every town +4 months"). "What shifted" shows only things about you and Syracuse; the rest folds. | Hide | Cheap |
| ★4 | **Show only actions you can take now.** The 11 greyed-out actions fold into "Not available (11)". Costs show when you open an action, as they already do. | Hide | Cheap |
| ★5 | **Shrink the left column to state, not rules.** Each office one line (name, holder); each faction one line (name, mood, power bar, what it wants). Rules, agenda steps and "When complete" open on click or hover. | Cut | Cheap to medium |
| 6 | Move the "Your first season" box out of the story: show it once as a card at the start (like the season card), then keep it under How to play. | Group | Cheap |
| 7 | Fix the label: the banner says "See Dangers" but the desktop column is "Plots against you". Use one name. | Reword | Cheap |
| 8 | Two plots at the same stage with the same unknowns read as one card: "Two plots at Whispers, source unknown". | Cut | Cheap |
| 9 | "Who is who" shows only the people who matter this season (rivals, office holders, petitioners, anyone in a plot you know of); the rest is in The court tab. | Hide | Cheap |
| 10 | Rivals get a short name first and the title second (a personal name, then "leader of the exiles at Aetna"), where the census has a name to give. | Reword | Cheap |
| 11 | The "From the sources: Diodorus 14.14.1..." line under each event becomes a small "Source" mark that opens on click. Keeps the sourcing, loses a line. | Hide | Cheap |
| 12 | Ledger strip: eight numbers to five. Government and Land to give move into tooltips or the court tab until they change. | Cut | Cheap |
| 13 | Title screen: the 110-word "Lead the army yourself" paragraph and the "Rules on" list move under "Set it up yourself". A new player sees the story, one recommended choice and Begin. | Hide | Cheap |
| 14 | Plot help ("A blow that beats your defense by 2 or less only wounds you...") opens from a "How plots work" link instead of sitting under every plot list. | Hide | Cheap |
| 15 | Numbers in the story prose ("power +1 (now 6, Active)") stay in the ledger and the faction line, not in the sentences. | Reword | Medium |
| 16 | Introduce systems over the first year: season 1 shows the court and the matters; the island and Carthage get a one-line "new" pointer the first time they matter. This touches how the opening feels, so it is Jacob's call. | Group | Costly |
| 17 | Mood as a five-step track; agendas as steps with "you are here"; a Government card that lists the four types and what each changes (see Jacob's notes above). | Group | Cheap |
| 18 | Phone: the three tabs work, but the season tab is 5½ screens. Items 1 to 5 fix most of it; nothing phone-only is needed first. | — | — |

**Keep as is:** the season card between seasons, the map and the island tab, the parchment look, the person sheets (short and clear at 120-140 words), "if you give no answer" under each choice.

## What we could not judge

- Whether the game is fun once the screen is clear. Overload hides that question; it does not answer it.
- How it feels after several seasons for a person, who learns where to look. AI testers do not get used to a layout.
- Jacob's own play. His notes and save come first; this doc is only first impressions.

## Suggested next step

If Jacob wants it, one small thread does ★2, ★3, ★4 and items 6 and 7 (all cheap, all wording or folds, no rules) on main, not on the test link, and shows before-and-after word counts. ★1 and ★5 are the real fix but change the layout, so they come after he picks.
