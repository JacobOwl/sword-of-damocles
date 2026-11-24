# Two historians tell three games (paper sample)

kind: invention. A paper test for the Phase 4 idea, "the biased-historian voice" (cut from the build for now, `docs/scope.md`), asked for by bet B6 in `docs/council/2026-11-23-two-day-plan.md`. Nothing here is in the game. Three bot games are told twice: once as a friendly Philistus might have told them, once as a hostile Timaeus might. Every sentence carries a footnote to the log line it rests on, so you can see what each voice keeps, drops and colours. Neither voice adds an event that is not in the log. What each historian was like, with sources, is in `docs/research/historians.md`.

Written by hand (by Claude, not an LLM inside the game) from the logs. The footnotes are filled in by `node scripts/voices.ts`, which replays each game and quotes the line; run it again after editing this file. The games: the careful bot, Standard balance, the island, no switches.

## A reign cut short <!-- game: 7 careful -->

### As Philistus might tell it

When the captain of his guard fell into debt at dice, Dionysius paid what he owed rather than leave a soldier open to bribes [[20]]. He gave his mercenaries houses on the Island and made them citizens [[39]] [[46]], and so bound to the city the men who kept it. Besieged by his own people, he asked the city's leave to sail away and waited, and the rebels, believing the tyranny was ending, drifted home to their fields [[77]]. He pardoned the brother of Demarchus, whose brother he had been forced to put to death [[87]] [[88]]. He trusted Leptines with the generalship [[125]], and only took it back when ambition had made Leptines dangerous [[238]]. Even then he forgave him [[319]]. Leptines repaid him with a plot [[359]] and fled when he was found out [[362]]. The first blow failed, and every conspirator was named [[424]]. A tyrant is never safe from the men he has raised: in the winter of 402 the second blow fell, and it was Leptines who led it [[642]].

### As Timaeus might tell it

He began by taxing the merchants [[28]] and then the people themselves [[34]], and spent what he took on foreigners: he gave his hired soldiers houses on the Island and Syracusan citizenship [[39]] [[46]], until the mercenaries were the strongest power in the city [[50]]. He feared a barber's razor so much that he had the women of his house learn a slave's trade and shave him [[235]]. He humiliated those who served him, taking the generalship from Leptines [[238]] and publishing his secrets to the city [[246]], and did the same to his own kinsman Thearides [[283]]. When the people's assembly took the generalship from him [[398]], he filled his prisons [[532]] [[543]]. After fire swept through Achradina [[575]] he laid the blame on a citizen's house [[587]]. The gods gave their warning at the sacrifice [[616]]. He died as tyrants die, at the hands of the men he had made [[642]].

## The city that fell <!-- game: 29 careful -->

### As Philistus might tell it

Carthage made war in the winter of 403, though its own Elders spoke against it [[430]]. Himilcon landed at Motya [[433]], stormed Messana and gave it to the sack [[517]], and laid siege to Syracuse [[564]]. Through a starving winter [[594]] Dionysius held the walls until Libya rose behind Carthage [[611]] and its council called the army home [[613]]. When Himilcon came back and plague broke out in his camp, Dionysius fell on it by land and sea at dawn and burned his ships at anchor [[939]]. He made peace when Carthage asked for it [[1090]]. When Carthage broke that peace [[1353]], he mustered the army [[1457]], and Philistus spoke for him among the rich families [[1459]]. The city fell in the spring of 396 only when there was no grain left at all [[1522]]. He did not die in it: he escaped by sea [[1522]].

### As Timaeus might tell it

He let Carthage come twice. He sent envoys to beg a bride from Rhegium and was refused [[1206]], and married two wives on one day with a feast for the city [[1217]], while the arms workshops that the war would need were left unbuilt [[1167]]. When a Carthaginian merchant offered to speak for peace, Dionysius seized his ships anyway [[1009]]. He paid his captains to play the traitor, and one of them, Acestorides, sold himself to Carthage in earnest, and his men with him [[1445]]. With the city besieged, a grain ship came from Egypt, and he let it sail on [[1497]]. His army ate the last of its food [[1518]], and Syracuse starved and fell to the barbarians. The tyrant escaped by sea with what he could carry, and left the city behind [[1522]].

## The decade he survived <!-- game: 26 careful -->

### As Philistus might tell it

From the first season he knew his enemies: the musicians of the city were made to tell what they heard, and the plotters were named [[25]]. He took the men who plotted against him without bloodshed [[223]] [[446]]. When Carthage's people voted for war [[923]], Himilcon landed with fifty thousand [[927]], sacked Messana [[1019]] and shut Syracuse in [[1067]]. Dionysius held the city with two months of grain [[1093]] until Libya rose and the Carthaginians were called home [[1111]] [[1113]]. When they came again, he turned their own suspicion against them: the story that Himilcon was in his pay was believed in Carthage [[1274]], and the council stripped its best general of his command [[1276]]. When plague came to the camp of Magon before the walls [[1357]], Dionysius fell on it at dawn while his ships burned theirs at anchor [[1370]] [[1371]]. In the autumn of 396 Carthage asked for peace [[1561]] and made offerings to win back the gods [[1562]], and he granted it [[1570]].

### As Timaeus might tell it

He had the city's musicians questioned under torture [[25]], and threw into prison men whose only fault was that he feared them [[223]] [[446]]. His spies fed false news to Carthage [[220]] [[584]], until Carthage's people voted for war [[923]]. Then the Greeks of Messana paid for him: the city was stormed and sacked, and its people fled to the hills [[1019]]. The Sicels who had always hated him looked for their chance to desert [[1105]]. It was not his generalship that saved Syracuse but Libya's revolt [[1111]] and a lie: he spread the story that Himilcon was in his pay, and Carthage believed it [[1274]]. His one sally was caught in the open and cut to pieces before the gate [[1378]]. The gods, not Dionysius, broke the besiegers: the plague took the Libyans first, and the dead lay unburied [[1357]]. Even after the camp was stormed, Carthage's soldiers walked into the suburb of Achradina and stripped the temple of Demeter and Kore, and he could not stop them [[1405]].

## What the sample shows, for Jacob to judge

- **Same facts, opposite stories.** Neither voice invents an event, yet the reigns read differently: the friendly one keeps pardons, loyalty and the sieges held; the hostile one keeps taxes, prisons, torture and luck. Choosing which lines to keep does most of the work; motives ("rather than leave a soldier open to bribes") do the rest.
- **The motive is the risky part.** Every motive in these samples is the historian's spin, not in the log. In a built version they would need to be marked as such, or drawn from a fixed list of readings per kind of event, so the game never states a guess as a fact.
- **It could be built the way Carthage's chronicle is.** A set of rules per voice, each turning a kind of log line into a sentence or leaving it out, with the footnotes kept. That is Phase 4 work and stays parked; this is only the sample.
- **Open question (yours):** would you rather read one biased history at the end of a game, or two side by side?
