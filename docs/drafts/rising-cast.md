# The rising cast: Dionysius I's rivals and allies, 405 to 380 BC (draft)

Research draft only. Nothing here changes game code or data. It is written for your picks 2B (one ladder of standing) and 3B (one move a year by each rival) in `docs/council/2026-11-26-offices-rivals-events.md`, and builds on the cast card `docs/research/cast-405-395.md`.

**How to read an entry.** Name, REAL or INVENTED, faction, and the seat they would want (from the council's seats: leader of the assembly, generalship, fleet, treasury, mint, captain of the guard, citadel, a city command). **Did** is what the sources say, with the passage. **Wanted** gives a motive only where a source gives one. **Rises** and **Own move** are my game proposals (invention), for you to keep or cut. **End** is history.

**Sources.** Every quote was checked on 2026-11-26 against the saved texts in the Phoenician-Punic World repo (read-only): Diodorus books 13 to 15 (Loeb, Oldfather), Plutarch *Dion* (Perrin), Aristotle *Politics* 5 (Rackham), Polyaenus 5 (Shepherd). Two exceptions: Plutarch *Timoleon* 6 (Perrin) was read on [Perseids](https://cts.perseids.org/read/greekLit/tlg0007/tlg018/perseus-eng2/6.4-7.1), and Diodorus 15.7 was read in the Perseus Greek, because no English copy could be reached from the cloud. The 15.7 lines are my rendering of the Greek. One dating line comes from Wikipedia and says so.

**Dates** are Diodorus' archon years, which straddle two of our years, so every "about" can be a year either way. Plutarch gives no years at all; where an entry gives one for him, it comes from Diodorus.

**Not in the engine yet** (checked 2026-11-26): the ladder of standing, the captain of the guard seat and city commands. `data/offices.json` has six seats. Entries that lean on them say "needs the seat". Every Rises line leans on the ladder, and every Own move on the yearly rival move (3B), neither built.

## At a glance

| Person | | Faction | Seat wanted | How it ended |
|---|---|---|---|---|
| Leptines | REAL | family | fleet | killed at Cronium |
| Thearides | REAL | family | fleet | died, no date |
| Polyxenus | REAL | family | fleet | fled into exile |
| Heloris | REAL | family | generalship | killed leading Dionysius' enemies, about 389 |
| Doris of Locri | REAL | family | none: her son's succession | not known |
| Andron | REAL | family | citadel | executed |
| Philistus | REAL | rich families | citadel | exiled; died fighting for the son against Dion |
| Hipparinus | REAL | rich families | generalship | not known |
| Aristomache | REAL | rich families | none: her children and brother | drowned, after Dion's murder |
| Dion | REAL | rich families | treasury | overthrew the son; murdered |
| Theodorus | REAL | rich families | generalship | not known |
| Aristides of Locri | REAL | rich families | none | not known |
| Nicoteles the Corinthian | REAL | citizens | leader of the assembly | murdered about 404 |
| Damon the smith | INVENTED | citizens | leader of the assembly | |
| Aristotle the Spartan | REAL | army and guard | captain of the guard | arrested about 396 |
| Archylus of Thurii | REAL | army and guard | captain of the guard | not known |
| Biton of Syracuse | REAL | army and guard | a city command | not known |
| Himilcon | REAL | Carthage | none: the island | starved himself |
| Magon | REAL | Carthage | none: Carthage's towns | killed at Cabala |
| Magon's son | REAL | Carthage | none: the west of the island | not known |

Factions follow `data/people.json` where the person is already in the game (Andron is family there, Aristomache rich families).

## The family

### Leptines · REAL
Family · wants **the fleet**
- **Did:** Dionysius' brother, "his admiral" by about 397 (Diodorus 14.48.4). Fought "in no cowardly fashion, but without prudence" and lost to Magon off Catana (14.60.2, 14.60.4). About 390 made peace in Italy "to his own advantage, but without any profit to Dionysius", and lost the fleet (14.102.3). Exiled about 386, later recalled (15.7.3 to 15.7.4).
- **Wanted:** his own advantage, in Diodorus' telling (14.102.3).
- **Rises:** sea wins; fame among the Italian Greeks.
- **Own move:** makes a peace abroad without asking.
- **End:** killed leading a wing at Cronium (15.17.1).

### Thearides · REAL (thin)
Family · wants **the fleet**
- **Did:** "his other brother", given the fleet when Leptines lost it, about 390 (14.102.3). Took ten Rhegian ships near Lipari (14.103.2 to 14.103.3). Led the show at Olympia, about 388, where the crowd laughed at Dionysius' poems (14.109.2). Married Dionysius' daughter Arete (Plutarch *Dion* 6).
- **Wanted:** not stated.
- **Rises:** whenever Leptines falls; the marriage.
- **Own move:** asks for his brother's command.
- **End:** died before Arete married Dion; no date or cause (*Dion* 6).

### Polyxenus · REAL
Family (the house of Hermocrates) · wants **the fleet**
- **Did:** married to Dionysius' sister "to draw a distinguished house into relationship with him" (13.96.3). About 404 urged flight on "his swiftest horse" (14.8.5). About 396 envoy to Italy, Sparta and Corinth; came back with "thirty warships" (14.62.1, 14.63.4).
- **Wanted:** safety first; later he "had become his enemy" (*Dion* 21).
- **Rises:** friends abroad; ships he brings home.
- **Own move:** opens his own talks with Sparta or Corinth.
- **End:** fled into exile, no date. His wife Theste stayed and was honoured (*Dion* 21).

### Heloris · REAL
Family (friend, or adoptive father) · wants **the generalship**
- **Did:** "one of his friends, or as some say, his adopted father"; about 404 told him "Tyranny is a fair winding-sheet" (14.8.5). Later "banished by Dionysius" (14.103.5), date not given. Defended Rhegium (14.90.5); about 389 led the Italian Greek army against him.
- **Wanted:** first, the tyranny held to the end; in exile, revenge. Croton trusted him "because of his hatred" (14.103.5).
- **Rises:** in exile, with every city that fears Syracuse.
- **Own move:** raises an exile army abroad.
- **End:** surrounded and killed at the Eleporus, about 389 (14.104.3).

### Doris of Locri · REAL
Family · wants **no seat: the succession for her son**
- **Did:** daughter of Xenetus, Locri's "most esteemed citizen", fetched on the first quinquereme about 398 (14.44.6 to 14.44.7) and married the same day as Aristomache (*Dion* 3). Bore "his eldest son", which "atoned for her foreign birth" (*Dion* 3); three children in all (*Dion* 6). Dionysius put her mother to death, accused of drugging Aristomache (*Dion* 3).
- **Wanted:** not stated.
- **Rises:** each child, the heir above all.
- **Own move:** presses for her son to be named heir.
- **End:** not in these texts.

### Andron · REAL (one late source)
Family · wants **the citadel**
- **Did:** only in Polyaenus (2nd century AD): left "in charge of the fortress and the treasury" while Dionysius was away. "Hermocrates advised Andron to seize both of these". Andron confessed when asked and was executed "because he had not revealed the proposal" at once (5.2.4). No date.
- **Wanted:** not stated.
- **Rises:** each campaign that leaves him holding the keys.
- **Own move:** keeps a plot quiet and waits to see who wins.
- **End:** executed.

## The rich families

### Philistus · REAL
Rich families · wants **the citadel**
- **Did:** "a man of great wealth", paid Dionysius' fine in 406/405 (13.91.4). About 404 said a tyrant should leave only "dragged by the leg" (14.8.5). He "for a long time was commander of the garrison that guarded the citadel" (*Dion* 11). Exiled about 386 (15.7.3; *Dion* 11).
- **Wanted:** the tyranny kept, and his place beside it.
- **Rises:** each crisis his money or nerve carries.
- **Own move:** marries into the ruler's family without asking, as he did.
- **End:** recalled under Dionysius II; died after a sea defeat (*Dion* 35).

### Hipparinus · REAL (thin)
Rich families · wants **the generalship**
- **Did:** "a leading man in Syracuse", Dionysius' "colleague" as general in 406/405 (*Dion* 3). Aristotle: "Hipparinus put forward Dionysius", as an example of rich men who "squander their private means" and then back a tyrant (*Politics* 1306a). Gave his daughter Aristomache to Dionysius about 398 (14.44.8). Father of Dion (*Dion* 4).
- **Wanted:** his lost fortune back, on my reading of Aristotle.
- **Rises:** the marriage, then grandsons in the ruler's house.
- **Own move:** offers silver or a daughter for a seat.
- **End:** not in these texts.

### Aristomache · REAL
Rich families · wants **no seat: her children's place, and her brother's**
- **Did:** daughter of Hipparinus, "the most notable maiden", fetched by a chariot of four white horses about 398 (14.44.8). The city wanted her "honoured above the stranger", but she "was for a long time a barren wife" (*Dion* 3); later four children (*Dion* 6). Dion "at first was honoured because of his sister" (*Dion* 4).
- **Wanted:** not stated.
- **Rises:** the city's favour; a son; Dion's rise.
- **Own move:** speaks for her brother at court.
- **End:** drowned at sea on Hicetas' orders, after Dion's murder (*Dion* 58).

### Dion · REAL (late in the period)
Rich families · wants **the treasury**, later the generalship
- **Did:** Aristomache's brother. "Dionysius ordered his treasurers to give Dion whatever he asked" (*Dion* 4). "Quite young" when Plato came, about 388 (*Dion* 4). Ran "the most important embassies", one to Carthage, and "spoke his mind fearlessly" (*Dion* 5).
- **Wanted:** his sister's children's interests, at the elder's deathbed in 367 (*Dion* 6).
- **Rises:** once grown: embassies, and bold words forgiven.
- **Own move:** speaks against the ruler at a dinner.
- **End:** overthrew Dionysius II, then was murdered (*Dion* 57).

### Theodorus · REAL (thin)
Rich families (the cavalry) · wants **the generalship**
- **Did:** "held in high esteem among the cavalry", "a man of action" (14.64.5). About 396, with the citizens armed, asked the assembly to make Dionysius "no longer our commander" and let him leave with his goods (14.65.1, 14.69.4). The Spartan admiral backed the tyrant, "and the Syracusans in dismay made no move" (14.70.2).
- **Wanted:** "the freedom their fathers enjoyed" (14.65.1).
- **Rises:** while the citizens are armed, and after defeats.
- **Own move:** demands in the assembly that the ruler step down.
- **End:** unknown; never named again.

### Aristides of Locri · REAL (thin, undated)
Rich families (of Locri, not Syracuse) · wants **no seat: to refuse the tyrant**
- **Did:** "one of Plato's companions". Asked for a daughter, he "would be more pleased to see the maid dead than living with a tyrant". When "Dionysius put his children to death" and asked again, he grieved but "did not repent him of what had been said" (Plutarch *Timoleon* 6). Whose children: see below.
- **Wanted:** no tie to a tyrant.
- **Rises:** as the man who said no.
- **Own move:** refuses a marriage or an honour in public.
- **End:** not given.

## The citizens

### Nicoteles the Corinthian · REAL (one sentence)
Citizens · wants **leader of the assembly**
- **Did:** "a leader of the Syracusans". About 404 the Spartan Aristus "kept stirring up the Syracusans and promised to restore their liberty; then he slew Nicoteles" (14.10.3). That is all.
- **Wanted:** not stated.
- **Rises:** each assembly where the crowd backs Nicoteles.
- **Own move:** puts a law for the people to the assembly.
- **End:** murdered about 404. Everything past his name and death is invention.

### Damon the smith · INVENTED
Citizens · wants **leader of the assembly**
- **Why invented:** no text names a leader of the common people after Nicoteles. Already in the game (`data/people.json`).
- **History to lean on:** Dionysius took the citizens' arms about 404 (14.10.4); armed for the war of 396, they "talked together" of deposing him (14.64.4); in 392 the Syracusans "deserted him" at Agyrium (14.96.2).
- **Rises:** whenever the citizens are armed or let down.
- **Own move:** leads the citizen levy home mid-campaign.
- **End:** none written.

## The army and guard

### Aristotle the Spartan · REAL (thin)
Army and guard · wants **captain of the guard** (needs the seat)
- **Did:** commander of the mercenaries by about 396. Dionysius, "fearing that they might depose him", arrested him, saying he was sent "to Lacedaemon to face trial". The men "demanded their pay with some sharpness" and took Leontini instead (14.78.1 to 14.78.2). When he took command is not stated.
- **Wanted:** not stated; his men wanted their pay.
- **Rises:** each season the pay is late.
- **Own move:** leads the men to demand their pay under arms.
- **End:** arrested and sent away; fate unknown.

### Archylus of Thurii · REAL (thin)
Army and guard · wants **captain of the guard** (needs the seat)
- **Did:** led "the élite troops" in the night attack on Motya, about 397 (14.52.5); "the first to mount the wall", rewarded "with one hundred minas" (14.53.4). An Italian Greek, not a Syracusan.
- **Wanted:** not stated.
- **Rises:** sieges, and the rewards for them.
- **Own move:** asks to lead the first assault, and for the reward after.
- **End:** not in these texts.

### Biton of Syracuse · REAL (one sentence)
Army and guard · wants **a city command** (needs the seat)
- **Did:** about 397 Dionysius "stationed guards in the city whom he put under the command of Biton of Syracuse", at Motya; the garrison was "largely of Siceli" (14.53.5). About 396 Himilcon "reduced Motyê by siege" (14.55.4). Biton's fate is not told.
- **Wanted:** not stated.
- **Rises:** holding a frontier town.
- **Own move:** makes terms with the enemy to save his garrison, as the commanders of Catana and Naxos did (14.15.1 to 14.15.2).
- **End:** unknown.

## Carthage

### Himilcon · REAL
Carthage · wants **no Syracusan seat: the island for Carthage**
- **Did:** son of Hanno; co-general in 406, sole general once Hannibal died (13.80.1, 13.86.3). Made the 405 peace: "the Syracusans shall be subject to Dionysius" (13.114.1). In 396 besieged Syracuse until plague struck (14.62.3, 14.70.4). Paid "three hundred talents" for his citizens' escape by night, "without the knowledge of the Syracusans" (14.75.1, 14.75.4).
- **Wanted:** Carthage was "eager to become lords of the whole island" (13.80.1).
- **Rises:** each Sicilian town he takes.
- **Own move:** a secret bargain with the ruler.
- **End:** starved himself in Carthage (14.76.4).

### Magon · REAL
Carthage · wants **no Syracusan seat: Carthage's towns back**
- **Did:** Himilcon's admiral; beat Leptines off Catana about 396 (14.59.1, 14.60.2 to 14.60.4). From about 393 "showed kindness to the subject cities and received the victims of Dionysius' wars" (14.90.3). Led 80,000 in 392; the peace gave Dionysius the Siceli and Tauromenium (14.95.1, 14.96.4). By the next war, "their king Magon" (15.15.2).
- **Wanted:** "retrieving the Carthaginian cause" (14.90.2).
- **Rises:** each town that comes over; each exile he shelters.
- **Own move:** takes in Syracuse's exiles.
- **End:** killed at Cabala "after a splendid combat" (15.15.3).

### Magon's son · REAL (no name in Diodorus)
Carthage · wants **no Syracusan seat: the west of the island**
- **Did:** made general when Magon fell, "young indeed"; drilled the army through a truce (15.16.2). Won at Cronium: Leptines dead, "more than fourteen thousand" Greeks slain (15.17.1, 15.17.4). The peace gave Carthage Selinus and Acragas' land to the Halycus, and Dionysius "paid the Carthaginians one thousand talents" (15.17.5).
- **Wanted:** not stated; Diodorus calls him "full of ambition" (15.16.2).
- **Rises:** from nothing to command in one truce.
- **Own move:** asks for a truce, then uses it.
- **End:** not in these texts.

## Where the sources disagree or are thin

1. **Why Philistus and Leptines were exiled.** Diodorus: stung by the laughter at Olympia, Dionysius grew suspicious of his friends, killed many on false charges and exiled others, Philistus and his brother Leptines among them (15.7.3, my rendering, archon year 386/385). Plutarch: Leptines gave Philistus his daughter "without so much as telling Dionysius" (*Dion* 11).
2. **Where they went, and whether Philistus came back.** Diodorus: both fled to Thurii, were later reconciled at Dionysius' request and came home, and Leptines married Dionysius' daughter (15.7.4, my rendering). Plutarch: Philistus went to Adria and "did not return to Syracuse while the elder Dionysius was alive" (*Dion* 11).
3. **"Dragged by the leg."** Diodorus gives the line to Philistus (14.8.5). Plutarch says Philistus "has stated explicitly that this was said to Dionysius by another" (*Dion* 35).
4. **Philistus' death, three ways** (*Dion* 35): Ephorus says he killed himself; Timonides that he was taken alive and beheaded; Timaeus that boys dragged his body by "the lame leg".
5. **The sister's husband.** Diodorus and Plutarch say Polyxenus (13.96.3, *Dion* 21). Polyaenus says "Hermocrates, who had married his sister", jailed and then banished (5.2.4). Two sisters, or one story told two ways.
6. **Heloris** is "one of his friends, or as some say, his adopted father" (14.8.5): Diodorus himself gives both.
7. **Theodorus' speech** (14.65 to 14.69) is Diodorus' composition, not a record of what was said.
8. **The date of Cabala and Cronium.** Diodorus files the war under the archon year 383/382 (15.15.1). Modern accounts often put it later: [Wikipedia's Leptines page](https://en.wikipedia.org/wiki/Leptines_of_Syracuse) gives Cronium "around 375". Not settled here, so Leptines and Magon may die inside the game's years or after 380.
9. **Aristides' children.** Perrin's English, "Dionysius put his children to death", can be read either way. Aristides is the one who grieves, so I read it as his children. The Greek was not checked.
10. **Aristomache's death.** Plutarch gives two versions, throats cut at sea or "thrown overboard alive" (*Dion* 58). The saved text names her "Andromache" there; *Dion* 57 calls her Dion's "sister".
11. **Himilcon's name.** The Loeb spells him Himilcar at 13.86.3 and 13.114.1, and Himilcon in book 14.
12. **Dion's age.** Plutarch gives no birth year, only "quite young" when Plato came. "About 388" for that visit is a modern date worked out from Plato's "being about forty years old" (*Letter* 7.324). Treat Dion as a boy for most of 405 to 388.
13. **Thin entries.** Nicoteles and Biton are one sentence each. Thearides, Hipparinus after 398, Aristotle, Archylus and Theodorus are a few lines. Andron is one late anecdote. Magon's son has no name, and Aristides no date.
14. **Not reached in English.** Diodorus 15.7 (the cloud could not open LacusCurtius or the Perseus site). The Greek was read from the Perseus file the 15.6 card already uses. `docs/later.md` already asks for the English of 15.6; 15.7 could join that request.

## Considered and left out

- Theste (folded into Polyxenus); Doricus, killed at Herbessus about 404 (14.7.6 to 14.7.7); Daphnaeus and Demarchus, executed in 405 (13.96.3).
- The leader of the exiles at Aetna: real, but no text gives a name.
- Pharacidas and Aristus, the Spartans: outside powers, not climbers.
- Agyris of Agyrium, the strongest tyrant "after Dionysius" (14.95.4): an allied city ruler, a good pick if city commands get their own cast. His name is on the reserved list in `data/census.json`.
- Arcesilaus of Catana and Procles of Naxos, who handed over their cities about 403 (14.15.1 to 14.15.2).
- Damocles: undated, and already the banquet event.
- Philoxenus and Plato: guests at court, not climbers (15.6, 15.7.1).

## My view (Claude's, not the sources')

The richest arcs for the ladder are Leptines (rise, fall, recall, death), Philistus (keeper of the citadel to exile), Heloris (friend to enemy general), Theodorus (the 396 assembly) and Dion (the late riser). Nicoteles, Biton and Damon are mostly game, so their arcs are where the game writes history rather than follows it.
