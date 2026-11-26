# Redesign proposal: offices as the board, the rising few, events from what is happening (2026-11-26)

Thread 36. **Design only: nothing here is built, and nothing changes the rules until Jacob picks.** Inputs: his test answers and notes (`docs/playtests/2026-11-26-jacob/`), the lessons overview (`docs/playtests/2026-11-26-lessons.md`, sections C and D), and what the code does today. Thread 35 is building the display fixes, the bugs, the core-rules change and the 20 to 30 season test preset; this proposal does not touch any of that.

## In five lines

1. **Today an office held by someone else barely matters.** It mostly just greys out one of your buttons. That is why "no other power changed hands" felt true even when it did.
2. **The board:** each office gets a power its holder uses every season, for himself or his friends, so a rival holding one hurts you and everyone wants one. People campaign for them; you bribe, ally, accuse or fight.
3. **The rising few:** one ladder of standing (nobody, notable, player, rival, pretender). Only people high on it are shown up front, and each step up arrives as a scene, not a log line.
4. **Events come from moves:** a big change (an office lost, a rival risen, a war, a man you keep robbing) opens a matter starring the people involved. Petitions become asks to use your powers, and the answer is remembered.
5. **Three questions, three options each.** We recommend the middle option every time (B, B, B), built in the order at the end, behind one switch until you say it is core.

His words this answers: "put more empahsis on the core pillars of goverment. Kinda board game it up with people fighting over them and them giving powers. Being able to bribe or ally people who control other offices. Having downsides for rivals owning it. Having NPCs seek it out. Having NPCs ask me for favors of my powers", "push me to care about a smaller pool of people over time", and "I would prefer my events and petitions to, generally, be based on whats actually happening in the game".

## What the game has today

**The gap.** The six offices are citadel, treasury, mint, fleet, generalship and assembly. What a holder who is not you gets from one:

| Office | Today, when someone else holds it | What is missing |
|---|---|---|
| Citadel | You lose +2 defence | Nobody can take it from you; you build it in two actions (his "too easy") |
| Treasury | The guard's pay is not taken out for you | The holder never pays or starves anyone on his own |
| Mint | You can't strike coin | The holder never strikes for himself |
| Fleet | Winter grain only if he is friendly | He never sends ships anywhere himself |
| Generalship | You can't march | Taken by the citizens' agenda in his game, and it cost him nothing he saw |
| Assembly | You lose +1 on votes | The holder never proposes anything |

People ask you only for offices **you** hold, and nothing else moves an office except a few events, the citizens' agenda, a strike, exile or a quarrel. Influence (one per office plus half the faction's power) is what makes a Pretender, but he never saw it explained.

**Pieces already built** (most behind switches, off by default) that this design reuses instead of rebuilding:

| Piece | What it gives the redesign |
|---|---|
| People escalate | Ask, demand in public, then act: the shape of a petition with memory |
| A Pretender needs a coalition | A rival only threatens your seat with a second faction behind him |
| Quarrels with terms | Swear to strip a man, accuse in the assembly, demand an office: the court and assembly challenges |
| Secrets and leverage | Something to hold over an office holder |
| Dinners as the stage | Where alliances with holders are made |
| One feud record | People remember what you did to them |
| Your council argues | Office holders as voices at your table |
| Great works | A way to make the citadel a contested build |
| Political rivals | Climber, Spymaster, Heir, Champion, with ranks Contender, Power behind the throne, Pretender |
| Events with parts | 103 events already cast their parts by faction, opinion, grudge, office or rival, but only 3 parts ask for an office holder and 1 for a rival |

## Question 1. The offices: how much of a board?

**Always, whichever option:** losing an office is a crisis. Thread 35 is making the loss impossible to miss on screen; the rule half is a **scene**: who took it, what it costs you from now on, and three answers (bargain with the new holder, contest it in the assembly, take it back by force), each with a price.

### 1A. Seats with powers (medium)
Each office gives its holder **one power he uses every season**, by a priority list with a visible reason, like the faction bots:
- **Treasury:** decides who is paid first. A hostile holder pays his own faction before the guard.
- **Mint:** strikes coin for himself or his faction (their silver, their power), and can debase it (prices rise for everyone).
- **Fleet:** picks where the ships go: grain home, a raid, or a convoy for a friend.
- **Generalship:** leads the army, can refuse your march or take the credit for a win.
- **Assembly:** sets one vote a year: a law, a levy, an honour or a trial.
- **Citadel:** whoever holds it can shut the gates on anyone, you included.

On each office card, one line: what the holder did with it this season, and the cost to you. You can **ask a holder to use it for you** (a favour owed), **bribe** him or **ally** with him. Simple, and it answers "downsides for rivals owning it", but people still don't fight over the seats much.

### 1B. Contested seats ★ recommended (costly)
1A, plus **each office has a way it changes hands**, and people go after it:
- **Elected each year by the assembly:** generalship and assembly. (History: Dionysius himself was made general by the assembly, "general with supreme power", Diodorus 13.94.5, card `docs/research/dionysius-405-403.md`.) Election day is a visible race: who stands, who backs whom, the votes before the count.
- **Granted by you, but can be challenged:** treasury, mint, fleet. A rival can accuse a holder in the assembly to strip him (the quarrels switch already has this), or ask you for it.
- **Held by force:** the citadel. Building it stays the opening goal of the 405 game (Jacob, 2026-11-26: "reasonable for 'building the citadel' to be the a first intital goal"). The contest starts once it stands: holding it needs the guard, and a rival who wins the guard can take it.

People seek seats by their ambition: Climbers want the treasury, Champions the assembly, Heirs the generalship. You can back a candidate, buy votes, accuse, or hold a dinner to win a holder over. This is the "board game it up" option.

### 1C. The favour economy (most costly)
1B, plus **every office makes one or two favours a season** that its holder can give to anyone: you, a rival, a faction. Favours are the currency of the board: you trade them for votes, silver, men. Closest to Republic of Rome and John Company, and the most board-game feel. The risk: one more resource to read every season, when too much text was his main complaint.

## Question 2. The cast: how do people rise?

### 2A. The circle (cheap to medium)
At most five to seven people are brought forward: office holders, rivals, people with a grudge you know of, people with a petition. Everyone else sits under "Everyone else". Events cast their parts from the circle first. Mostly display, and thread 35 is already doing the display half ("bring forward only the people who matter"), so 2A on its own is small.

### 2B. One ladder of standing ★ recommended (medium)
The circle, plus **one visible ladder** that joins today's two rival tracks (enemies and political rivals):

| Standing | How you get there | What you can now do to the player |
|---|---|---|
| Nobody | Everyone starts here except the real cast | Nothing |
| Notable | An office, a win, a big gift, a feud | Petitions, small favours asked |
| Player | Two of: an office, a faction's backing, a following | Stands for seats, bargains, makes allies |
| Rival | Wants your place, with one faction behind him | Challenges you in court and the assembly, swears quarrels |
| Pretender | A second faction behind him (the coalition switch) | Can take your place, shown in full |

**Each step up is a scene**, starring the person: "Nicoteles is carried from the assembly on the shoulders of the crowd." Each step down is one too. Influence is shown on the ladder in words ("one step from Pretender: he needs the rich or the guard"), not as a number.

### 2C. Rivals with arcs (costly)
2B, plus the top two rivals each run a **plan in acts**, shown like a faction agenda: "Nicoteles: 1 win the assembly (done), 2 the generalship, 3 put you on trial, 4 the people's tyranny." You see where he is, and you can break an act. The most retellable, and the most authored: it risks every Nicoteles playing out the same way unless the acts come from data and branch.

## Question 3. Events and petitions: where do they come from?

**Always, whichever option:**
- **No easy right answer.** Every choice costs someone in the circle; no choice is free. The outcome line alone can't decide it, because the cost is a person you care about.
- **Remembered.** What you grant or refuse goes on that person's record (the feud switch) and comes back.
- **Fewer repeats.** A seen event waits years, or needs a new cause.

### 3A. Triggers on the old deck (cheap to medium)
Keep the 103 events, and add new conditions to their parts and timing: a rival at a given standing, an office just changed hands, a war on, a faction at Rebellious, the same action on the same man three times. Add more events written to those conditions, and a repeat wait. Cheapest, but the events stay a deck: the game's state picks which card, it does not write the matter.

### 3B. Matters from moves ★ recommended (medium to costly)
3A, plus a **second kind of matter made from what just happened.** Each big change in the log opens one, from data templates (never code), starring the people involved:
- An office changes hands: the new holder comes to court with terms.
- A rival rises a step: his first move in the open.
- A faction reaches Rebellious: its leader brings a demand, not a mood line.
- You hit the same man three times: he answers (a trial, a plot, a plea through his kin).
- A war starts, a city turns, an army is lost: the people with a stake come to you.

**Petitions grow** and change kind: holders and rising people ask for **uses of your powers** ("let the fleet carry my grain to Gela", "the mint to strike for my daughter's wedding", "the generalship for my son"), and each answer moves the board.

**Initiative:** each person on the ladder at Rival or above takes **one move of his own a year** that reaches you as a matter (Nicoteles proposes a grain law in the assembly: you oppose it, back it, or take it over as yours). This is the "AI taking initiative" half, and the DM role: the state picks the cast, the person picks the move.

The old deck stays, rarer, for colour and history.

### 3C. A storyteller (costly)
3B, plus a **pacing director**, like RimWorld's storytellers: it watches how much is happening and chooses what to raise. Quiet for two seasons: a rival takes his move early. Three crises at once: the next matter waits. It is the most DM-like, but it can feel steered, and it adds a hidden hand to a game whose rule is that every act has a visible reason. We suggest parking it in `docs/later.md` until 3B has been played.

## What a 20-season game might look like (1B, 2B, 3B)

Invented, to show the shape, not a script:
1. **Season 2.** Nicoteles holds the assembly. Its power: he sets this year's vote, and puts up a grain law. A matter: oppose it (the citizens sour), back it (the rich sour), or take it over as your law (he loses the credit and remembers).
2. **Season 4.** You took the law. He rises to **Player** anyway: a scene in the agora. He stands for the generalship at the next election. The race shows him two votes behind your man.
3. **Season 5.** You keep seizing Theodorus's property. The third time, he answers: he asks Nicoteles to hear his case in the assembly. Now two of your rivals are working together, because of what you did.
4. **Season 6, election day.** Nicoteles wins the generalship by a vote. **Crisis scene:** he holds the army. Bargain (he asks for the fleet's grain for the citizens), accuse him (the quarrel), or move the guard (the citadel, and the rich watch).
5. **Season 9.** The war with Carthage comes. He commands. A matter from his own initiative: he wants to march on Motya without you. If he wins, he steps to **Rival**; if he loses, the assembly wants his head, and it is yours to give or refuse.

Each step came from a move someone made, and each person on stage was someone he already knew. That is the test for the gate.

## Order of building, if he picks B, B, B

| Step | What | Cost | Notes |
|---|---|---|---|
| 1 | Office powers for holders (1A) and the crisis scene on a loss | Medium | The heart of it; testable alone |
| 2 | The ladder of standing (2B), joining the two rival tracks, steps as scenes | Medium | Uses thread 35's "people who matter" display |
| 3 | Matters from moves and petitions for your powers (3B, without initiative) | Medium | Templates in `data/`, like events |
| 4 | Elections and challenges (the rest of 1B) | Costly | Needs a visible race on screen |
| 5 | One move a year by each rival (3B initiative) | Medium | |
| 6 | Play 20 to 30 seasons, count, then decide on 1C, 2C, 3C | | |

All behind one switch, "The contested board", off by default, until he says it is core. It leans on switches already built (people escalate, coalition, quarrels, secrets, feud), so it would turn those on with it. That overlaps the core-rules recap thread 35 is doing: that list is his call there, not here.

**One-line cost note:** steps 1 to 3 are about two or three building threads; all six are about five or six.

## Start years and opening goals (Jacob, 2026-11-26)

His words: "start years should be done ck3 style where you pick a different year for different expeirence. for our test I'm ok with doing the same guy year. Also for this scerienco I think its reasonable for 'building the citadel' to be the a first intital goal. Every scerico should have a natural starting goal like that to get you going".

- **Opening goal, now:** the 405 game opens with one stated goal, "Build the citadel", shown as the first thing on the board, with what it gives you and who would rather you didn't. It fits this design: the citadel is the first seat you win, and the board fight begins once you hold it. The next tests stay on 405.
- **Each scenario has its own opening goal:** a start in exile would open with "Win back a foothold"; a start nearer the war with "Hold the generalship when Carthage lands". Written as data in each start, like the start positions.
- **Picking a start year, CK3 style:** `docs/scope.md` lists "choosing the start date" as out of Phase 2, so this is parked in `docs/later.md` (the start cards in `docs/research/start-*.md` are the groundwork). If he wants it in Phase 2, that is a logged change to `scope.md`, his call.

## Risks

- **More text.** Every new power and matter adds lines. Each must replace something, not add to it: the office card's one line replaces the log lines it covers.
- **Samey matters.** Templates repeat as fast as events do. Each needs several wordings (the varied wording system already exists) and a cause that differs.
- **Too strong a hand.** If holders' powers bite hard, the game may tip from too easy to hopeless. Count with the bots first, without tuning to history.
- **History.** The offices and their powers are invention, except the assembly electing the general, which is sourced. Elections every year is invention; the sources do not give a term.

## Questions for Jacob

1. **Offices:** 1A seats with powers, 1B contested seats (recommended), or 1C the favour economy?
2. **Cast:** 2A the circle, 2B one ladder of standing (recommended), or 2C rivals with arcs?
3. **Events:** 3A triggers on the old deck, 3B matters from moves (recommended), or 3C a storyteller?
4. **Order:** start with step 1 (office powers and the crisis scene), or another?
5. **Start years:** keep picking a start year parked for Phase 3, or change `scope.md` to bring it into Phase 2?
6. **Elections:** generalship and assembly elected each year, or only when the assembly is called?
