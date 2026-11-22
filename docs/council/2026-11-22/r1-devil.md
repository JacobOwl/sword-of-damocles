# Round 1: The Devil's Advocate

## Where I actually agree
Determinism, one log, everything as data, rule switches off by default, readable bots: keep all of it. I also accept Phase 2 as the target. My attack is on how it is being done. The comfortable plan is "add a map, add armies, simulate Carthage like Syracuse, and the stories will come." I think the map will drown the stories unless it has to earn its place.

## The radical alternative I'm steelmanning
**The island as a map of people, not of armies.** Leave out army tokens on roads. Each city on the map is a *place where people are*: who governs it, which of your relatives or friends sit there, who has fled there, what it owes you. War happens off-screen. You make the political decisions (who commands, who stays home to hold the citadel, how you pay, what terms you give) and get back the political consequences (a general comes home popular, the guard is owed money, a city now hosts your enemies). Diodorus supports this reading of the period: the 404 crisis was not lost on a battlefield. The citizen army besieging Herbessus turned on its commander: "The soldiers, in anger at this, slew the commander, whose name was Doricus, and, crying to the citizens to strike for their freedom, sent for the cavalry from Aetnê" (`sources/diodorus/english/book14-1-18-97-117.loeb.txt`, 14.7.7). In this period war is a plot that happens to carry spears. A tactical war layer is a second game competing with the first.

I don't expect this to win outright. But every Phase 2 feature should have to answer one test: **what does it change at court?**

## The foundational attacks, briefly
- **Is the season the wrong unit?** Not wrong, but it's flat. Forty identical seasons, each with three actions, is a lot of clicking, and it's why things repeat. The ancient year had a shape: a campaigning season when the men were away, and a winter when everyone was home and plotting. Make spring and summer "away" seasons and autumn and winter "home" seasons. Cheap, and it gives every year a rhythm.
- **Does a map of armies undercut "you play a person"?** Yes, if the map shows counters. Root works because its pieces *are* its factions. If the map shows "Syracusan army, strength 7", you're playing a state. If it shows "Leptines with the fleet at Motya", you're still playing a person.
- **Is plot-and-sword the right heart, or a gimmick?** It's the right heart, but at present it's a slot machine with a long fuse: strikes land about 90% of the time, Fair fight turns them into coin flips, and nothing sits between the two (balance sweep). The island's best use is to *give the sword new angles*: plots launched while you're abroad, killers who come from exile, a general who doesn't come back.
- **Are faction ratings from 0 to 10 too abstract for Game of Thrones?** On their own, yes. Nobody remembers "the rich families reached 8." People remember "Hipparinus and Philistus closed ranks." Keep the number in the engine, but lead in the UI with the named men behind it, and let power move when *people* move (a defection, a death, an exile).
- **Is Carthage-as-mirror a thesis smuggled into the design?** Partly. `design.md` calls it "the core historical idea". CLAUDE.md says not to frame the game around a thesis. Building Carthage with Syracuse's exact rules *so that* the two shape each other's governments is building the conclusion into the machine. The honest version is to give Carthage its own stakes and see whether a mirror shows up. If it never does, that is a result, not a bug.
- **Would fewer, deeper people beat more cities?** Yes. Twenty-four people already produce one dominant storyline (Nicoteles), one man who becomes your enemy five or six times, and almost no nemeses.
- **Will simulating everything make bland stories?** It will, at the city level. "Catana's loyalty fell to 3" is noise. The 52 authored events are currently the best story material in the game. Phase 2 needs more authored *situations* (the Motya siege, the Leontini settlement, the mercenaries' demand) with emergent outcomes, not more simulated stores.

## Q1. The first slice of the island
**Position:** Use three or four places, not six to eight. Keep the 405-395 window so the cast, the research cards and the 52 events carry over. The map should be one loop: every action on it starts with a person you choose and ends with a change at court.
**Proposal:** The places are Syracuse; Aetna (where the exiles are, the threat already in the data); one contested Greek city (Leontini or Catana); and the Carthaginian west as a single place (Motya). On the map each season you have one choice, *a commission*: send a named man with a force and a purpose (take, garrison, negotiate, collect). He goes, and the outcome comes back as a log entry *about him*.
**What I'd refuse:** roads, supply lines and movement points in the first slice.

## Q2. Simulated Carthage
**Position:** Use a light bot with three or four named men whose *careers* are at stake. Don't give it the full Syracuse engine. What makes it feel like a rival society is that defeat has consequences inside Carthage. Diodorus on Himilcon after 396: "he passed sentence of death upon himself and starved himself to death" (`book14.loeb.txt`, 14.76.4). A Carthaginian general who knows failure will ruin him behaves differently from a clock. I haven't checked how much the saved sources say about Carthage's internal government in 405-395. My guess is that it is thin, so most of it would be invention and must be tagged as invention.
**Proposal:** Carthage gets a war party and a peace party (both invention), a commander whose fate depends on results, and one visible goal per year. Its actions read like faction actions ("the council recalls Himilcon").
**What I'd refuse:** building Carthage on the same rules *in order to* make the mirror happen.

## Q3. Armies and war
**Position:** Settle battles off-screen, in one roll with its modifiers shown, plus *one* choice before it (the kind of risk you take). Settle sieges over seasons, because seasons are where politics happens. All the interest is in what war does at home.
**Proposal:** **The regent decision.** When you go on campaign, you name who holds the citadel and the treasury while you're away. That person's loyalty, ambition and faction now carry the sword check. Taking a commission yourself raises your standing but leaves the door open. This draws on the Herbessus revolt (14.7.6-14.8.1), and it ties the two games together.
**What I'd refuse:** a mercenary market in the first slice. Arrears already exist; just let unpaid companies seize a *place on the map*.

## Q4. The other cities
**Position:** Each city is one governor (a person), a stance toward you, and who is sheltering there. Nothing more yet.
**Proposal:** Cities are mostly *where people go*: exiles flee there, relatives marry into them, governors rule them. A city's stance is mainly its governor's opinion of you.
**What I'd refuse:** population by class, grain and silver for each city.

## Q5. Plots and the sword
**Position:** The all-or-nothing blow is the deepest problem left over from Phase 1, and the island will hide it, not fix it. Fix it first, with method-and-moment plots (research ★3). Test Reap what you sow first.
**Proposal:** A plot's *moment* can be your absence. A plot that waits for you to leave gives a new kind of warning: "they are eager for you to take the field." Then the decision whether to go becomes a real dilemma.
**What I'd refuse:** retuning strike numbers again before ★3 is tried as a switch.

## Q6. Rivals and nemeses
**Position:** Rank counting is the wrong road to a nemesis. Nemeses come from *history*, not from accumulation: the man who survived you, fled, and came back.
**Proposal:** Exile produces nemeses. An exiled enemy goes to a place on the map, gathers backing there, and returns as a named threat with a past. The Aetna cavalry is exactly this pattern (14.7.7, 14.8.1). Use two rules: a rival can't be "made" from the same grievance twice, and anyone who has survived you twice is promoted to nemesis.
**What I'd refuse:** more caps and thresholds to stop rivals flickering. Fix the cause (the influence "within 3" test is too loose).

## Q7. The player's own goal
**Position:** Survival alone makes careful play correct and boring (the careful bot wins 82% under Reap). The player needs a want that *costs* safety.
**Proposal:** At the start, pick one ambition from a few concrete ones: take Motya, found a dynasty, die in your bed, rule with the assembly. The chronicle's last page judges you against it.
**What I'd refuse:** a numerical score.

## Q8. Voices and legibility
**Position:** Clue-based warnings (★1) matter most, because they turn the sword into a story you can read. Second is the chronicle grouped by storyline. The council (★4) is the most costly of the three, and the regent decision gives a cheaper taste of it.
**Proposal:** Build ★1 before any map UI is polished.
**What I'd refuse:** building the council before the warnings say something true.

## Q9. Architecture and risk
**Position:** The real risk is not determinism. It's two threads (09 and 10) both editing the season loop at once, and a growing number of switch combinations that nobody tests.
**Proposal:** One thread owns `season.ts`, and the other works only through new steps or data. Test a short list of named configurations (Citadel standard, Citadel Reap, Island with Reap), not every combination. Fail the 100-seed check if the island never changes who rules Syracuse.
**What I'd refuse:** running a second full Syracuse-style engine inside Carthage.

## My top three questions for the foundation
1. **What does each island feature change at court?** If the answer is "nothing", cut it.
2. **Does absence become the main thing linking war and the citadel?** I think it's the loop Q1 asks for.
3. **Do we fix the all-or-nothing blow (★3) before building the map on top of it?**

## The idea nobody else will raise
**Losing Syracuse should be a turn, not the end of the game.** Once there is an island, being deposed or exiled can send you, with your household, to Aetna or a friendly city. From there you play the exile's game: gather backing, plot, return. This is the period's own pattern (the Aetna cavalry), and `design.md` already says "the world keeps going whether you hold it or not". It turns the most common ending into the best second act, it puts the player on the plotting side of the sword, and it is the island's strongest reason to exist.
