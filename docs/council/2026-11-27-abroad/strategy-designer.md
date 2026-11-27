# Strategy-game designer seat: invading Carthage and diplomacy abroad

Design only. Every rule here would be a switch, off by default. All numbers are invention.

## How I checked the games

I looked up each mechanic on the web on 2026-11-27. The Paradox forum and the Paradox wikis blocked the fetch tool, so several Paradox points rest on guide sites. Anything marked **(from memory, unverified)** I could not confirm on a page I opened. Links are at the end of each point.

What I could confirm:

- **CK3:** marrying into a family makes a military alliance, and "you'll also be signing up to fight in your relatives' wars". Moving armies by sea costs gold. ([PC Gamer](https://pcgamer.com/crusader-kings-3-ck3-declare-war-call-allies-casus-belli))
- **EU4:** a diplomat sits at a foreign court to improve relations and is busy meanwhile. Refusing an ally's call costs prestige and relations. War subsidies are a monthly payment to a country at war. Ships beyond supply range wear down each month. War exhaustion comes from "defeats, blocked harbors, wear and war taxes". ([Gamepressure, diplomacy](https://www.gamepressure.com/europauniversalisiv/diplomatic-actions/z75486), [Gamepressure, war](https://www.gamepressure.com/europauniversalisiv/the-basics-of-war/z95488))
- **EU4, Ming tributaries:** you can only offer to become a tributary if you share a border, and Ming can refuse. ([FandomSpot](https://www.fandomspot.com/eu4-how-to-become-tributary-of-ming/)) What a tributary owes is **from memory, unverified**.
- **Imperator: Rome:** a guarantee drags you into any war on the protected state. "Support rebels" works only on people of another culture and gives the target a reason to attack you. Feudatories and client states join your wars and pay you. Mercenaries are "always more costly than regular armies", they keep their own general, and "there is always a risk of betrayal". ([Gamepressure, diplomacy](https://www.gamepressure.com/imperator-rome/diplomacy/z6c388), [Gamepressure, mercenaries](https://www.gamepressure.com/imperator-rome/mercenaries/z9c2a3))
- **Total War: Rome II:** attitude has four words: friendly, indifferent, unfriendly, hostile. A client state gives up much of its income and grants access in return for protection. Refusing to help an attacked ally cancels the alliance. A transport appears automatically when an army crosses the sea; it is "unable to withstand sustained damage", and an escort fleet takes any attack first. ([Rome II manual, diplomacy](https://r2enc.totalwar.com/en/manual/single-player/0038_enc_page_campaign_play_faction_diplomacy/index.html), [Rome II manual, movement](https://r2enc.totalwar.com/en/manual/single-player/0019_enc_page_campaign_play_military_movement))
- **Total War: Troy:** each offer shows a chance of acceptance before you send it, and relations show as one coloured icon. ([Gamepressure](https://www.gamepressure.com/total-war-saga-troy/diplomacy-and-alliances/z5d7ee))
- **Victoria 3, diplomatic plays:** there is no declare-war button. A demand opens a play. Both sides "sway" undecided powers with promises. A countdown locks it, and the side that backs down concedes only the main demand. At full escalation war breaks out. ([gameplay.tips](https://gameplay.tips/guides/victoria-3-diplomatic-play-guide.html))
- **CK2 Jade Dragon:** China is off the map. You earn "grace" by sending tribute and spend it on boons. A new dynasty resets grace to zero, with warning first. ([GamingOnLinux](https://www.gamingonlinux.com/2017/11/crusader-kings-ii-jade-dragon-now-available-my-thoughts-on-all-the-kowtowing-and-tribute/page=1/))
- **CK2 Sunset Invasion:** first Aztec explorers arrive to trade, then the invasion fleet lands in Spain. ([Destructoid](https://www.destructoid.com/crusader-kings-ii-sunset-invasion-impressions/))
- **Old World:** an ambassador is needed to ask for peace. Missions include truce, tribute and trade. Each foreign leader can be won over once. ([gameplay.tips](https://gameplay.tips/guides/old-world-ultimate-diplomacy-guide.html))
- **Rome II, Syracuse:** the Hannibal at the Gates missions push Syracuse to attack Libya for a foothold. ([Softpedia diary](https://games.softpedia.com/blog/Rome-II-Hannibal-at-the-Gates-Diary-Syracuse-and-the-Lure-of-Technology-435589.shtml))

I found nothing useful on Field of Glory: Empires or on CK3's off-map content; the pages I reached said almost nothing. I leave both out rather than guess. Total War: Pharaoh had nothing on this subject.

## 1. Invading Carthage's home

Diodorus gives no Syracusan landing in Libya in 398 to 395 in the saved texts. Agathocles (310) and Regulus (256) are the models. Both did well at first and both failed. That matters: it is a gamble, not a win button, which helps a game that felt too easy.

**Option 1A. "Carry the war to Libya" as one big action (my pick for 398, as a what-if switch).** Choosing it requires ships, an army with food, and a named keeper left at home.
- *Crossing:* Rome II's fragile transport and escort rule, cut down to the interception roll we already have. With warships escorting, the roll is fair. Without them, it is bad. Crossing costs silver, as embarking does in CK3.
- *The keeper:* Agathocles left his brother Antander as "curator of the city" (20.4.1). The keeper is a cast member with his own ambition. He can hold, bargain or betray. This is the home front, and it is the story.
- *Abroad:* the army lives off the land, as Agathocles did in the rich farmland (20.8.3 to 20.8.4). It loses men each season it stays, like EU4 wear beyond supply range.
- *Carthage's answer:* the Carthage council must vote: save the farms, or strike Syracuse. That is our existing bloc vote, not a new system. The Libyan bloc's anger becomes your lever: towns come over "because of fear, others because of their hatred for the Carthaginians" (20.17.1). That ties into `libyaSpared`.
- *The failure:* if you demand too much, Carthage refuses and hires a better general, as with Regulus and Xanthippus (Polybius 1.31 to 1.34). Take that from Victoria 3: ask for a main demand you can get, or lose everything.

**Option 1B. A small second map of Libya** (Rome II's full map, shrunk). It has five or six places: the landing beach, the farmland, Tunis, a few Libyan towns, Carthage itself. Two maps run at once. It is costly. I would keep it for the Agathocles campaign, as `docs/full-game.md` already plans.

**Option 1C. Raids only.** Ships burn a coastal district for silver and anger, with no army landing. It is cheap, but it gives a weaker story.

**Pick:** 1A now as a switch, with Libya drawn as a card (see 3). Use 1B for the 310 campaign. 1A's data should be reusable by 1B.

## 2. Diplomacy with Greek cities and other powers

**The powers, 398 to 395, each with its history:**
- **Sparta:** a patron with strings. Aristus "in truth with intent to increase the power of the tyranny" (14.10.2). Ships and Pharacidas (14.62.1, 14.63.4). Pharacidas vetoes liberty (14.70.1 to 14.70.3). Mercenaries (14.58, section to check).
- **Corinth:** asked for aid in 396 (14.62.1).
- **Messana:** the gift of land (14.44).
- **Rhegium:** the marriage refused by its assembly (14.44).
- **Locri:** the marriage accepted, Doris (14.44).
- **Later only:** the Lucanians (14.100.5), the Italian league (14.101.1), Croton's exiles (14.103), Olympia (14.109).

**The actions, each from a game:**
1. **Send an envoy.** Use a named man from your cast, away for one or two seasons (EU4's diplomat who is busy; Old World's ambassador; Polyxenus in 14.62.1). Sending your best man abroad leaves him off your council. That cost is the point.
2. **Offer a marriage.** A bride for an alliance (CK3; Locri and Rhegium, 14.44). The town's assembly can refuse, as Rhegium did. That is a town-politics roll, using the three houses from the war council.
3. **Give a gift.** Land, silver or grain (Rome II and Imperator gifts; Messana's land, 14.44).
4. **Call for help.** An ally sends ships or men. Refusing costs the ally, as in Rome II and EU4. **Help arrives with a man attached** (Pharacidas). Sparta's admiral is a person on your map with his own veto. That is Imperator's client relationship turned round: you are the client.
5. **Hire mercenaries through a patron.** Pricier than citizens, with their own captain and a betrayal risk (Imperator).

**Option 2A. Favour as a pool (CK2 Jade Dragon's grace).** You earn Sparta's favour by gifts and by keeping order. You spend it on ships, men or a recruiting licence. A change of mood at Sparta resets it, with warning. The pool fits one great patron well.

**Option 2B. Attitude words only (Rome II's four words, with Troy's acceptance chance shown on the offer).** Each power has one word and one wish. No numbers.

**Option 2C. Victoria 3's play before the war of 397.** In 398 the embassies come right before the war with Carthage (14.44 onward; the exact line of the declaration is to check). So the season before war becomes a play: you name your demand, then you spend a season or two swaying Messana, Rhegium, Locri, Sparta and the Sicels. Each one leans, backs you or stays out. Carthage can back down and grant the main demand.

**Pick:** 2B for every power, 2A for Sparta only, and 2C as the shape of the road to war. This gives a short list of real moves with real people, not a menu of treaties.

## 3. How off-map powers should appear

- **3A. A list in a panel.** Cheap, but it is a wall of text. He dislikes those.
- **3B. Cards on the map's edge (my pick).** The sea lanes run off the island's edge to a card: Italy, Greece, Libya. Each card shows a coin portrait, one attitude word, what the power wants, and your envoy if one is there. This is CK2 Jade Dragon's status screen made small and placed where he already looks. Clicking a card gives the two or three actions above.
- **3C. A small second map.** Only for Libya, and only in the Agathocles campaign (1B).

**Arrivals get warnings first.** In Sunset Invasion, explorers come before the fleet. Here, a Spartan ship docks, a rumour comes from Corinth, or Carthaginian levies gather in Libya. Each one is a ledger line a season before the event. This matches the rule that a blow must never feel random.

## 4. What NOT to do

- **No relation numbers on screen** (EU4's +100 / +200). Use words.
- **No full treaty screen** with every deal type for every power (the Rome II and Troy lists). Trade pacts, access and confederation have no 398 history here.
- **No points currencies** like EU4's diplomacy points or Imperator's oratory. Our cost is people, silver, ships and time.
- **No guaranteed conquest of Carthage.** Agathocles and Regulus both failed. If the city can fall, it should be very rare.
- **No naval battle system.** It is out of scope; keep the single interception roll.
- **No Sunset Invasion fantasy powers.** Only powers with a passage behind them.
- **No AI that pesters with offers every season.** EU4 and Total War players complain about this **(from memory, unverified)**.
- **No Italy, Greece or Libya beyond names without a scope change.** `docs/scope.md` rules them out of Phase 2. Jacob decides.

## Labels

Game mechanics: as cited above. Ancient passages: from the brief's list, already checked in `phoenician-punic-world/sources`, except 14.58 and the declaration line, which are to check. Invention: the keeper's betrayal roll, the favour reset at Sparta, the edge cards, all numbers.
