# Petitions for the 405 island game: a first draft of twenty (2026-11-26)

**Design only. Nothing here is built, and nothing changes the rules until Jacob picks.** These are the "petitions to use your powers" and "matters from moves" of 3B in `docs/council/2026-11-26-offices-rivals-events.md`, written for the Dionysius scenario on the island, autumn 405 onward. They assume his picks there: contested seats (1B, with the captain of the guard and the city commands), the ladder of standing (2B: nobody, notable, player, rival, pretender) and matters from moves (3B).

## How to read a card

- **Asks:** who brings it. *history* means the person or group is in the sources; *invention* means the game made them up; *a seat* means whoever holds that office at the time, real or invented.
- **Trigger:** what in the game state makes it appear. The words in code type are the condition names the engine already reads (`data/events.json`, `src/core/events.ts`, `src/core/island-events.ts`). **(new)** marks something the engine doesn't have yet. Those are listed together at the end.
- **Wants:** one sentence.
- **Choices:** each with its cost. Every number is invention, set for a first count and Jacob's to change.
- **Later:** the grudge, favour or follow-up it leaves. Names in code type are events that already exist, except where marked (new).
- **Source:** the line under each card is for Jacob, not the player. It is not counted.

**Word count.** Every card is under 80 words, counting everything from "Asks" to "Later", the trigger included. The counts are in the table at the end.

**Fixed for all twenty.** A seat in a trigger only counts when someone other than you holds it, unless the card says so. A petition needs its asker free and in the city, except 13, whose asker is in exile. Each one waits 8 seasons before it can come again (the deck's own `cooldown`), or sooner for a new asker.

---

## The war with Carthage

### 1. Let me take Motya
**Asks:** the general (a seat; Leptines, Hipparinus and Theodorus want it, all history).
**Trigger:** `island.war`; `playerLacks: generalship`; `sides.motya: carthage`.
**Wants:** to lead the army against Motya himself.
1. **Let him go:** a win is his, and he climbs a step (new).
2. **Go yourself, leaving him the siege works:** his grudge, "you took my war".
3. **Wait a year:** citizens' mood −1, Carthage's ships +1.

**Later:** after a win he asks for the fleet; a loss opens petition 3.

*Source: Diodorus 14.47.4 (Dionysius marched on Motya himself), 14.48.4 ("he left Leptines his admiral in command of the works"). History for the march; the petition and its choices are invention.*

### 2. Give us back our arms
**Asks:** the citizens' leader (a role; Nicoteles at the start, history).
**Trigger:** `disarmed: true`; `island.carthageArmy` (a Punic army on the island).
**Wants:** their weapons back, to fight for their city.
1. **Arm them all:** a full levy, but citizens' plots lose their −1 (new: rearming).
2. **Arm only the men who march:** silver −1 a season for their pay.
3. **Refuse:** citizens' mood −1; the guard and hired men fight alone.

**Later:** armed citizens who win without you bring `theodorusSpeaks` early.

*Source: Diodorus 14.10.4 (he "carried off the arms of them all"), 14.45.5 (they hoped that "once they had got weapons in their hand, they could strike for their liberty"), 14.64.3 to 14.64.4 (after a win without him, "now because of the war they had weapons at their command"). History.*

### 3. Try the beaten general
**Asks:** the assembly's leader (a seat), for the survivors.
**Trigger:** `flag.armyLost` or `battleLost` within 1; led by a man, not you (new).
**Wants:** the general tried for treason.
1. **Let them judge:** he is exiled, a rival; his faction's mood −1, citizens' +1.
2. **Shield him:** citizens' mood −1; he owes you a favour.
3. **Accuse him yourself:** an action; citizens' +1, the rich −1, his kin's grudge.

**Later:** in exile, he may bring home the bones (petition 13).

*Source: Diodorus 13.91.2 (survivors "lodged accusations against their generals, asserting that it was due to their treachery"), 13.91.3 (choice 3 is what Dionysius did: he "accused the generals of betraying their cause to the Carthaginians"), 13.92.1 (the people "immediately dismissed some of them from office and chose other generals"). History.*

### 4. Fight now, before the siege
**Asks:** your allies' levy leaders (census leaders, invention).
**Trigger:** `flag.fleetDamaged` or `battleLost` within 1; a Punic army within 2 days of Syracuse; an ally.
**Wants:** a battle now, before the siege.
1. **Fight:** every modifier shown; lose, and the siege starts with fewer men.
2. **Fall back:** allied levies go home; their towns' lean −1.
3. **Pay them to stay:** silver −3 for one season.

**Later:** if you fell back, Carthage courts those towns (`carthageCourtsAnAlly`).

*Source: Diodorus 14.61.1 to 14.61.3 (after the sea battle off Catana they "urged Dionysius to seek an immediate encounter"; he refused, and most "deserted Dionysius"). History.*

### 5. Leave us our harvest
**Asks:** the grain-lords of the Leontine plain (census council of Leontini, invention).
**Trigger:** `island.war`; `island.carthageArmy`; summer; `sides.leontini: syracuse, ally`.
**Wants:** to keep their harvest in their own barns, not in your forts.
1. **Take it into the forts:** your grain +2, Leontini's lean −2.
2. **Leave it:** if Carthage's army reaches the plain, its food +2.
3. **Buy it at their price:** silver −2, grain +2.

**Later:** taken twice, they open talks with Carthage (`carthageCourtsAnAlly`).

*Source: Diodorus 14.58.1 (he was "most concerned, however, to fortify the citadels of the Leontines and to store in them the harvest from the plains"). History for the forts; the grain-lords' plea is invention.*

---

## Seats held by others

### 6. The admiral is away
**Asks:** a man who wants the fleet (Thearides, history, or any Climber).
**Trigger:** the admiral is away at sea or with the army (new: away); asker `wants: fleet`.
**Wants:** the absent admiral stripped and the fleet given to him.
1. **Agree:** the admiral comes home a rival, scar Humiliated.
2. **Refuse:** he accuses the admiral in the assembly himself (`accuseAssembly`).
3. **Recall the admiral first:** no winter grain and no raid next season.

**Later:** whoever loses the fleet holds the grudge.

*Source: Diodorus 13.63.1 (Hermocrates, "sent as admiral in command of thirty-five triremes", "was overpowered by his political opponents" and "handed over the fleet"). History, about 410; the petition is invention. Thearides is a real man in the cast; his wanting the fleet is the game's.*

### 7. Pay the guard first
**Asks:** the captain of the guard (the new seat; until then Aristotle the Spartan, history).
**Trigger:** `arrears` 1 or more; `playerLacks: treasury`; the treasurer isn't of the guard.
**Wants:** the guard paid before the treasurer's friends.
1. **Order it:** arrears cleared; the treasurer's grudge, his faction's mood −1.
2. **Pay from your own purse:** silver −(what is owed).
3. **Let it wait:** guard mood −1; the guard is for sale (`guard.forSale`).

**Later:** left waiting twice, the captain is courted (`captainCourted`).

*Source: Diodorus 14.78.1 to 14.78.2 (the mercenaries "demanded their pay with some sharpness"). The treasurer paying his own friends is the 1A treasury power, invention.*

### 8. Coin for the wedding
**Asks:** the master of the mint (a seat; Hipparinus at the start, history).
**Trigger:** `playerLacks: mint`; `flag.wed` within 1; the holder is a bride's kin (`kinOf`).
**Wants:** a wedding coin with his house's sign.
1. **Allow it:** the rich families' power +1 for a year; his opinion +1.
2. **Only the city's own dies:** his opinion −1, the rich families' mood −1.
3. **Refuse:** his opinion −2; he votes against you next.

**Later:** if allowed, `lightCoins` can follow, under his name.

*Source: Plutarch, Dion 3 (Aristomache was "daughter of Hipparinus, who was a leading man in Syracuse"; Dionysius "married both wives on one day"). Hipparinus is history; his holding the mint is the game's start, and the coin is invention: no source names an office for the mint (`docs/research/offices-history.md`).*

### 9. Men for the walls
**Asks:** your town's commander (the new city seat; for now a census leader, invention).
**Trigger:** a Punic army within 2 days (`carthageArmy: 2`); `besiegedBy: none`; walls 2 or less.
**Wants:** your guard on his walls.
1. **Send the guard:** your guard −1, weaker at the sword check; his men +1.
2. **Send citizens:** citizens' mood −1; his men +1.
3. **Tell him to hold:** besieged, he may betray you, more if aggrieved.

**Later:** a betrayal comes as `generalOffersTheGate` (new).

*Source: Diodorus 14.15.1 ("Arcesilaüs, the general of the Catanians, had offered to betray the city to him"). History for the betrayal; the plea is invention.*

---

## Rivals and the assembly

### 10. Pay my fine
**Asks:** a young speaker of the citizens (invention).
**Trigger:** he reaches Notable (new: the ladder) by attacking your seat holder; the magistrates fine him (new).
**Wants:** his fine paid, so he can keep speaking.
1. **Pay it:** silver −1; he owes you; your holder's opinion −1.
2. **Let it stand:** he falls back to Nobody; citizens' mood −1.
3. **Let Philistus pay:** the rich families' power +1.

**Later:** kept speaking, he climbs a step a year.

*Source: Diodorus 13.91.4 ("the archons ... laid a fine upon Dionysius on the charge of raising an uproar, Philistus ... paid the fine"). History: this is how Dionysius himself rose, turned around.*

### 11. Come unarmed
**Asks:** a Champion of the citizens (a role).
**Trigger:** a Champion at Player or higher (new: the ladder); `tyranny: true`.
**Wants:** you in the assembly unarmed, as Gelon came.
1. **Go unarmed:** a sword check without the guard. Live, and citizens' mood +2; he falls a step.
2. **Refuse:** he climbs a step; citizens' mood −1.
3. **Send gifts:** silver −2, citizens' mood +1; he still climbs.

**Later:** if you lived, his next challenge waits two years.

*Source: Diodorus 11.26.5 to 11.26.6 (Gelon came "not only with no arms but not even wearing a tunic", and was acclaimed "Benefactor and Saviour and King"). History, but from 480: a precedent the city remembers, not an event of 405.*

### 12. Spare my kinsman
**Asks:** the kin of a named plotter (a role).
**Trigger:** `plotStage` 3; a member you know by name (new); his kin free (`kinOf`), opinion 0 or more.
**Wants:** the plotter's life.
1. **Spare him:** the asker is bound to you, but the plot takes heart (+1).
2. **Execute him:** the plot breaks; the asker's grudge, his faction's mood −1.
3. **Banish him to the Peloponnese:** a rival, scar Exiled; the asker is content.

**Later:** a banished man writes home (`letterFromExiles`).

*Source: Polyaenus 5.2.4 (the tempter was put "in prison; but afterwards, to oblige her, he banished him to the Peloponnese"). Polyaenus, not Diodorus or Plutarch; already used by `andronTempted`.*

### 13. Bring home the bones
**Asks:** an exiled rival (a role).
**Trigger:** `armyLost` or `battleLost` within 8, on enemy ground (new); a rival scarred Exiled, `status: outside`.
**Wants:** leave to bring the dead home, walking behind them to the border.
1. **Allow it:** citizens' mood +1; he climbs a step.
2. **Refuse:** citizens' mood −2: "the tyrant leaves the dead unburied".
3. **Send your own heralds:** an action, silver −1; he loses his cause.

**Later:** allowed, he asks to come home within a year.

*Source: Diodorus 13.75.2 to 13.75.5 (Hermocrates "collected the bones of the dead" and stopped "at the border"; "Diocles was exiled" over the burial). History, about 408.*

---

## Grain and the guard

### 14. Sell my harvest to Carthage
**Asks:** a grain-lord of Leontini (census council, invention).
**Trigger:** `island.war: false`; summer; your `grain` 3 or less; `sides.leontini: ally`; Carthage's `goal` rebuild or tribute.
**Wants:** to sell his harvest to Punic ships, which pay more.
1. **Allow it:** Carthage's silver +1, his opinion +1; your winter runs short.
2. **Forbid it:** his grudge; Leontini's lean −1.
3. **Buy it at his price:** silver −2, grain +2.

**Later:** forbidden twice, he moves his house to Punic land (Leontini's men −1).

*Source: Diodorus 14.41.1 ("some of the Greeks were deserting to the Carthaginian domain, taking with them their justice and their estates"). Context only; the grain-lord and his sale are invention.*

### 15. Houses on the Island
**Asks:** the captain of the guard (the new seat).
**Trigger:** `citadelBuilt`; `playerHolds: treasury`; `arrears` 1 or more; silver short of what's owed (new).
**Wants:** houses on the Island for his men, instead of silver.
1. **Give them:** land −1, arrears cleared, citizens' mood −1; his seat digs in.
2. **Borrow and pay:** a rich man lends; you owe him a favour.
3. **Refuse:** guard mood −1; the guard is for sale.

**Later:** a dug-in captain is Unshakeable sooner, against you too.

*Source: Diodorus 14.7.4 to 14.7.5 (the houses on the Island "he gave to his friends and the mercenaries"). Plutarch, Dion 11: Philistus "for a long time was commander of the garrison that guarded the citadel". History.*

---

## The towns of the island

### 16. Refugees from a sacked town
**Asks:** the sacked town's first man (invention).
**Trigger:** a town of yours, allied or free, sacked by Carthage this season (`sacked`, `changedWithin: 0`).
**Wants:** houses and bread in Syracuse, and their generals tried.
1. **Take them in:** grain −2, citizens' mood −1; Syracuse's men +1 next year.
2. **Settle them in a town you hold:** land −1; its men +1, lean −1.
3. **Turn them away:** allies' fear +1, lean −1.

**Later:** taken in, they accuse your general (petition 3).

*Source: Diodorus 13.91.1 to 13.91.2 (after Acragas fell "some removed to Syracuse"; the survivors "lodged accusations against their generals"), 13.111.3 to 13.111.5 (the flight from Camarina, and the soldiers "enraged against Dionysius"). History.*

### 17. Will we be next?
**Asks:** an allied town's first man (invention).
**Trigger:** you sacked a town within 2 seasons (new: dated sacks); an ally at `fear` 2+.
**Wants:** your oath to spare his town.
1. **Swear it:** fear −2, lean +1; break it, and every town's lean −2 (new: oaths).
2. **Garrison his walls:** your guard −1, his men +1, fear +1.
3. **Offer citizenship, as Leontini had:** his town moves to Syracuse; citizens' mood −1.

**Later:** a frightened leader listens to Carthage (`carthageCourtsAnAlly`).

*Source: Diodorus 14.15.2 to 14.15.4 (the Naxians and Catanians sold; the Leontines, "reflecting on the fate of the Naxians and Catanians", left for Syracuse), 14.40.1 (Rhegium angry that he "had sold into slavery the Naxians and Catanians"). History.*

---

## Carthage and Sparta

### 18. Carthage wants its tribute
**Asks:** Carthage's Elders, through Hanno the elder (the Elders history, Hanno invention).
**Trigger:** `flag.tributeLost` within 1 (a tributary town came over to you); `island.war: false`.
**Wants:** the town back under tribute, or its tribute paid by you.
1. **Give it back:** its lean −2, citizens' mood −1.
2. **Pay its tribute yourself:** silver −1 a year; Carthage's anger −1.
3. **Refuse:** Carthage's anger +2; the Hundred's power +1.

**Later:** refused, the Elders' mood −1 at Carthage's next war vote.

*Source: Diodorus 13.114.1 (by the peace of 405, Selinus, Acragas, Himera, Gela and Camarina "shall pay tribute to the Carthaginians"). History.*

### 19. A man of the Hundred
**Asks:** Bomilcar of the Hundred, through a merchant (invention).
**Trigger:** `island.war`; `island.general: false` (Carthage has no general); Bomilcar free.
**Wants:** silver to buy votes, so he gets Carthage's command over better men.
1. **Pay him:** silver −3; a weaker general (new: a council vote). Found out, Carthage's anger +3.
2. **Refuse:** the best man free gets the command.
3. **Betray him to the Elders:** Elders' mood +1; Bomilcar disgraced, and his grudge.

**Later:** paid, he asks for more before every battle.

*Source: none. Invention, built on Carthage's council of blocs (`data/carthage.json`) and `hundredAuditTheGeneral`.*

### 20. Sparta's price
**Asks:** Pharacidas, the Spartan admiral (history).
**Trigger:** `flag.spartanShips`; `theodorusSpeaks` answered with his help (new: remembered choices).
**Wants:** grain and silver for his thirty ships, and leave to hire men here.
1. **Pay him:** silver −2, grain −1; he speaks for you at the next challenge.
2. **Let him hire your men:** guard strength −1; Sparta stays a friend.
3. **Refuse:** he sails home, and `spartanFriend` is lost before the assembly.

**Later:** a refused Sparta sends no ships in the next war.

*Source: Diodorus 14.63.4 (Polyxenus came "bringing thirty warships from his allies, with Pharacidas the Lacedaemonian as admiral"), 14.70.1 to 14.70.2 ("not to overthrow the rule of Dionysius"). History; the price is invention.*

---

## What the twenty cover

| Trigger | Petitions |
|---|---|
| War with Carthage under way | 1, 2, 4, 5, 9, 19, 20 |
| A battle or an army lost | 3, 4, 13 |
| A town sacked (by Carthage or by you) | 16, 17 |
| Grain running low, or the harvest | 5, 14 |
| Someone else holding a seat | 1 (general), 3 (assembly), 6 (fleet), 7 (treasury), 8 (mint), 9 (city command) |
| The guard and hired men | 7, 15, 20 |
| A rival rising in the assembly | 10, 11, 12, 13 |
| Carthage's own politics | 18, 19 |
| A seat you hold, under pressure | 15 (treasury), 11 (your guard) |

Kinds: 16 rest on history (the asker, the trigger or a choice), 3 are invention with history as context (8, 9, 14), and 1 is pure invention (19). One uses a source outside Diodorus and Plutarch: Polyaenus (12). Three lean on precedents older than 405, which the Syracusans of 405 would remember: Gelon in 480 (11) and Hermocrates about 410 to 408 (6, 13).

## Overlaps with events that already exist

I left out three petitions I first drafted because the deck already has them: plundering the Phoenicians at the start of the war (a choice in `warOnCarthage`), escorting the grain past Carthage's fleet (`grainConvoy`), and mercenaries wanting land once peace is made (`mercenariesWantLeontini`). Others touch existing events on purpose, as causes or follow-ups:
- 2 and 20 lead into or out of `theodorusSpeaks`.
- 4, 5 and 17 hand on to `carthageCourtsAnAlly`.
- 3 is Syracuse's side of `hundredAuditTheGeneral` (Carthage's trial of its general).
- 8 feeds `lightCoins`; 12 feeds `letterFromExiles`.

## Design gaps I found (my view)

These are what the cards need that the code or the docs don't have yet. Each card marks its own with **(new)**.

| Gap | Today | Needed by |
|---|---|---|
| Who led a lost army or battle | `flags.armyLost` and `flags.battleLost` hold only the season; the destroyed army's commander isn't kept | 3, 13 |
| Where a battle was fought | the flags don't keep the place, so "the dead lie on enemy ground" can't be read | 13 |
| A seat holder being away | only `where: "field"`, under the commission switch; nothing for the fleet at sea | 6 |
| The ladder of standing (2B) | two separate tracks (`rival.rank`, `political.rank`); a part can ask `political: true` but not its type or rank | 1, 10, 11, 13 |
| The new seats | `OfficeId` has six seats; no captain of the guard or city commands yet | 7, 9, 15 |
| Digging in | no state for New, Settled, Dug in, Unshakeable | 15 |
| Re-arming the citizens | `disarmed` never goes back to false, and in the island game disarming only weakens citizen plots: the levy is the same size either way, so petition 2 has no teeth without a change | 2 |
| Dates on sacks | `island.sacks` lists towns, not seasons | 17 |
| Events remembering choices | `events.fired` keeps the season, not the choice, so a follow-up can't tell how you answered | 20, and any "Later" that depends on a choice |
| A known plot member as a part | `inPlot` only; nothing for "a member whose name you know" (`plot.known`) | 12 |
| Fines and magistrates | no fine for a speaker, and I didn't find any cost to the accuser when an accusation fails | 10 |
| Carthage choosing its general | the best free man by a fixed weight; no vote that silver could move | 19 |
| Oaths to towns | only the one `promised` flag | 17 |
| What the guard is owed, as a condition | `arrears` counts seasons; no condition reads `guard.owed` against your silver | 15 |
| A Punic betrayal offer | no `generalOffersTheGate` event yet | 9 |

One question for Jacob before any of this is built: today a petition (`Request`) can only ask for an office, silver, citizenship, a marriage or land, with yes or no. These twenty are shaped like events, with three answers and set costs. They could live as a new kind of event in `data/` (like the dinner asks in `data/dinners.json`), or `Request` could grow choices. That's an architecture call, and it's his.

## Sources checked

Every quote above was checked against the saved texts in the Phoenician-Punic World repo (read only), the same files the research cards use:
- Diodorus, Loeb (Oldfather) via LacusCurtius: `sources/diodorus/english/book11.loeb.txt` (11.26), `book13.loeb.txt` (13.91 to 13.92, 13.111, 13.114), `book13-gaps.txt` (13.63, 13.75), `book14-1-18-97-117.loeb.txt` (14.7, 14.10, 14.15), `book14.loeb.txt` (14.41, 14.45, 14.47 to 14.48, 14.58, 14.61, 14.63 to 14.64, 14.70), `book14-78-96.txt` (14.78).
- Diodorus 14.40.1: this repo's own `sources/diodorus/book14-19-40.loeb.excerpts.txt`.
- Plutarch, Dion (Perrin): `sources/plutarch/dion.perrin.txt` (chapters 3 and 11).
- Polyaenus 5.2.4 (Shepherd): `sources/sicily-tyrants/polyaenus-book5.shepherd.txt`.
- **Plutarch's Timoleon was read but not used.** It opens in 344, and nothing in it fits the decade from 405.
- Dates: Diodorus counts by Athenian archon years, so give a range for each. Hermocrates (13.63, 13.75) is about 410 to 408 and Gelon (11.26) is 480: precedents the Syracusans of 405 would remember, not events of the game's decade.

## Word counts

Counted by a small script: every word from "Asks" to the end of "Later". Code words and numbers count as words; the list numbers 1, 2, 3 and the source line don't.

| Petition | Words |
|---|---|
| 1. Let me take Motya | 76 |
| 2. Give us back our arms | 78 |
| 3. Try the beaten general | 76 |
| 4. Fight now, before the siege | 72 |
| 5. Leave us our harvest | 72 |
| 6. The admiral is away | 78 |
| 7. Pay the guard first | 77 |
| 8. Coin for the wedding | 78 |
| 9. Men for the walls | 76 |
| 10. Pay my fine | 73 |
| 11. Come unarmed | 74 |
| 12. Spare my kinsman | 77 |
| 13. Bring home the bones | 76 |
| 14. Sell my harvest to Carthage | 76 |
| 15. Houses on the Island | 78 |
| 16. Refugees from a sacked town | 77 |
| 17. Will we be next? | 77 |
| 18. Carthage wants its tribute | 76 |
| 19. A man of the Hundred | 78 |
| 20. Sparta's price | 78 |
