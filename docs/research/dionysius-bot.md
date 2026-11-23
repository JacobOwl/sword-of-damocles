# The Dionysius bot

Card for the museum's Dionysius bot (`src/core/dionysius-bot.ts`, bet B1). The bot is a headless player whose priorities follow what Diodorus says Dionysius I did between the peace of 405 and the war of 397. It is used for a report only (`npm run museum`, section "The Dionysius bot"); nothing is tuned toward how it fares.

Each priority is **history** (the habit) applied with **invention** (the game's menu, the order of the list and every threshold). Upkeep (paying the guard, buying grain) and raising silver (the mint, harbour dues, the levy) are invention: the passages do not say how he paid for things season by season.

Source: Diodorus Siculus, *Library of History*, Book 14, Loeb translation (Oldfather), as saved in the phoenician-punic-world repository under `sources/diodorus/english/book14-1-18-97-117.loeb.txt` (14.7 to 14.18) and `book14.loeb.txt` (14.44 to 14.47). The quotes below were opened in those files; `tests/museum.test.ts` checks each one is there when that repository sits beside this one.

| Priority | Passage | Quote |
|---|---|---|
| Fortify the Island first | 14.7.2-3 | "he divided it from the rest of the city by an expensive wall" ... "He also constructed on the Island at great expense a fortified acropolis as a place of refuge in case of immediate need" |
| Land and houses to friends and mercenaries | 14.7.4-5 | "he picked out the best of it and distributed it in gifts to his friends as well as to higher officers" ... "He also distributed the dwellings among the common people, except those on the island, which he gave to his friends and the mercenaries." |
| Disarm the citizens at harvest; hire mercenaries | 14.10.4 | "Dionysius, sending the Syracusans out to harvest their crops, entered their homes and carried off the arms of them all" ... "and also collected a great number of mercenaries" |
| Aetna and the Chalcidian towns | 14.14.1-2 | "was eager to attach to himself the neighbouring cities of the Chalcidians, namely, Naxos, Catanê, and Leontini." ... "he encamped near Aetnê and won the fortress" |
| Taken towns sold (the bot sacks before the marriages) | 14.15.2 | "sold the inhabitants into slavery, turned their property over to the soldiers to plunder, and razed the walls and the dwellings." |
| The Epipolae wall | 14.18.4, 14.18.8 | "he gathered the peasants from the countryside, from whom he selected some sixty thousand capable men" ... "the wall was brought to completion in twenty days." |
| The double marriage | 14.44.6, 14.44.8 | "Dionysius sued for the hand of Doris, the daughter of Xenetus" ... "he also sought in marriage from among the people of his city the most notable maiden among them, Aristomachê" |
| Harsh before the marriages, gentler after (dinners; no more executions or banishments) | 14.45.1 | "he gave a series of public dinners for the soldiers and the larger part of the citizens; for he now renounced the oppressive aspect of his tyranny" ... "no more putting them to death or banishing them, as had been his practice." |
| War on Carthage once prepared | 14.45.2, 14.47.1-2 | "called an assembly of the Syracusans and urged them to make war against the Carthaginians" ... "When Dionysius, the tyrant of the Syracusans, had completed all his preparations for the war according to his personal design, he sent a herald to Carthage" |

## What is invention here
- The order of the list, and that the bot exiles political rivals of rank 2 or more before it marries (read from 14.45.1's "banishing them, as had been his practice"; the passage names no rivals).
- That "prepared" means the citadel and the wall built and a guard of 4 or more, and that the bot declares war only once married (Diodorus puts the marriages a few days before the assembly, 14.45.2; the game has no such calendar).
- The bot marries the friendliest free person who can marry; the game's cast has no Doris of Locri.
