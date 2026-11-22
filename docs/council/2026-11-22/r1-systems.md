# Round 1: The Systems Designer

## What the engine actually is today (grounding)

From `season.ts`, `start.json` and the sweep: Phase 1 has **one real feedback loop** (grudge, then plot, then strike) and three timers that aren't loops:

- **Silver** starts at 6, the guard costs 2 a season, and the world step adds silver *only* from passed laws. It drains. It doesn't cycle.
- **Grain** is a sawtooth: -2 a season, +6 each summer. It's a timer, not a choice.
- **Carthage** is +1 a year until 10, then one roll. It's a clock.
- **Faction power** has a thermostat: power that didn't move eases 1 toward 5 every season. A needed patch, but it erases the rise and fall Jacob asked for.

So the honest diagnosis: the game has no **converter**, nothing that turns one resource into another at a price. (In John Company, money becomes men, men become glory, glory becomes office and threatens you.) Phase 2's job is to add that converter, not a map. The map is just where the conversion happens.

---

## Q1. The first slice

**Position.** Four places, not eight, and two to three years: summer 398 to winter 396 BC, about 12 seasons. The places: Syracuse; Motya (Carthage's base, "their chief base of operations against Sicily", Diodorus 14.47.4, `book14.loeb.txt`); one Sikel town (Aetna, already in the data as the exiles' refuge); and one Greek city that can go either way (Leontini or Catana). Carthage itself sits off the board. Each season one of your three actions can be a campaign order. Everything else stays citadel politics.

**Proposal: "the same men."** Make one pool of soldiers (citizen levy plus mercenary companies) that is either *in the city*, where it is your defense against plots, or *in the field*, where it is your army. Today the guard's strength 3 counts toward defense. On the island, the men you march to Motya leave your defense. Every campaign becomes a bet that you win abroad faster than your enemies organize at home; plunder pays the arrears; the victorious general comes home popular. One stock, two uses.

**Refuse.** Eight cities, roads, sea lanes and per-army supply logistics in the first slice. They're a second game glued on.

## Q2. Simulated Carthage

**Position.** Make it a light bot, not the same rules as Syracuse. Give it three named men (a general, a rival in the council, a merchant voice for peace), two stores (silver and men), and one lever: the balance between its war party and its peace party. It should feel like a society because its *politics respond to your results*, not because it has a deep sim. The history supports a mirror. A plague let Dionysius strike ("many Carthaginians in Libya had fallen victims to a plague", 14.41.1). The beaten general Himilcon paid to get out ("conveyed the three hundred talents to the acropolis", 14.75.4). He then punished himself at home ("starved himself to death", `book14.loeb.txt` line 202; I haven't confirmed the section number).

**Proposal.** When a Carthaginian general loses, two things happen: his rival in the council gains power, and he has a price. He can buy his army's way home with silver, and that silver lands in *your* treasury, which a faction there may want. So Carthage's politics and yours trade the same coins. The mirror is a flow, not a script.

**Refuse.** Carthage with its own four factions, six objects and plots before the island loop is proven fun. Double the content for a rival seen mostly through its armies.

## Q3. Armies and war

**Position.** An army is a token with three numbers: men, supply (seasons of grain carried), and a named commander. A battle is one roll with every modifier shown, plus one choice made beforehand (press, hold, or negotiate). Mercenaries are *contracts with arrears*. The guard already has `owed` and `arrearsSeasons`, so generalize the guard into two or three companies, each with a captain. The history gives the cash-out: about ten thousand mercenaries "demanded their pay", and Dionysius gave them "the city and territory of the Leontines" instead (14.78.2, `book14-78-96.txt`). So cities become a currency for paying men.

**Proposal: sieges reuse the plot engine.** A siege is a plot against a city: stages, strength against the walls, warnings to the defender, a strike. When Carthage besieges Syracuse, you get warnings as before a blow (see the last section).

**Refuse.** Battle tactics minigames, formations, or supply as daily rations. Glory as a separate bar is fine, but only if it feeds influence, the existing number that makes Pretenders.

## Q4. The other cities

**Position.** Each city gets a few stores and one named leader, no factions. The stores: men, grain, walls, who it leans to (Syracuse, Carthage or itself), and a ruler. The sources do name local strongmen. Agyris "possessed the strongest armament of any of the tyrants of Sicily at that time after Dionysius" (14.95.4). The player relates to a city in four ways, each a defined action: march on it, ally with its ruler, install a friend, or settle men on it. Settling men is the mercenary payment above.

**Proposal: exile becomes a place.** Today exile is a status. On the island, an exiled person goes to a named city, adds to its men, and can come back. A city full of your exiles becomes a threat you can see on the map. This also fixes rivals (Q6).

**Refuse.** Population by class, a per-city economy, or per-city power objects in this slice.

## Q5. Plots and the sword

**Position.** The problem isn't how lethal a strike is. It's that defense is one number with no rhythm. War gives it a rhythm for free: your defense drops when you march. A plot's *moment* is your campaign. That's the "method and moment" proposal without new machinery. As a package, I'd test Fair fight first once war exists, because coin-flip strikes (54 to 73% of strikes) produce the most survivors who come back as enemies, and that is what feeds nemeses. Reap what you sow is safer but lands 97 to 100% of the strikes it allows. The choice is Jacob's.

**Proposal.** Plot strength gains "the ruler is away" (your defense counts only the men you left behind), and a warning type, "the garrison asks how long you will be gone", fires whenever you march with a plot at Rumors or worse. You choose your risk knowingly.

**Refuse.** Any death that happens while you're abroad without a warning issued before you marched.

## Q6. Rivals and nemeses

**Position.** Rivals flicker because their state can be reset: a pardon or a rise in opinion ends the rivalry, and then it comes back. Nemeses need four separate rank-ups, so they never arrive. Make enmity a ratchet: a grudge can be *converted* (into a debt or a favor owed), but never erased. Nemesis rank should come from **surviving you**: escaping an arrest, a failed strike, exile and return. It shouldn't come from accumulating points.

**Proposal.** Surviving you is the promotion. Each time a man survives your move against him, he goes up a rank, and on the island exile is the main way to survive. The man you exiled to Aetna comes back with Aetna's men. That's Shadow of Mordor's core loop: the enemy who lived.

**Refuse.** Raising the rival cap, or adding more rival types, before the ratchet exists.

## Q7. The player's goal

**Position.** Survival alone is a negative goal. The player needs something that *costs* survival. Ambitions should be concrete states of the world, picked at the start from data: hold citadel, mint and generalship together for eight seasons; take Motya; marry into the two leading houses; leave an heir in office.

**Proposal.** One chosen ambition plus a legacy ledger at the end that counts objects held, cities that lean to you, and enemies who outlived you. Show it, don't rank it. The chronicle remains the prize.

**Refuse.** A single score that the bots then optimize. That would recreate tuning toward one strategy.

## Q8. Voices and legibility

**Position.** For a systems game, legibility means seeing the *flows*, not hearing more prose. The retold story is "I knew the guard would turn if I marched, and marched anyway."

**Proposal: a forecast line.** Next season you pay 2 to the guard and have 1, so the guard goes into arrears. Your army carries one season of grain. Nicoteles' plot would face defense 4 if you leave. Every number comes from the same computation the engine will run. If there is a council, each advisor should argue from one line of this forecast (the captain about pay, the brother about the army).

**Refuse.** Advisors whose advice isn't computed from state.

## Q9. Architecture and risk

**Position.** The biggest risk is two threads editing `season.ts` and plot strength at the same time. Thread 09 is changing plots; thread 10 needs "ruler away" in defense. The second risk is the random stream: every new roll on the island shifts every later roll, so the citadel scenario must keep its pinned digest byte for byte. The third risk is the drift toward 5, which will fight any war-driven power swing.

**Proposal.** Make defense and plot strength a *list of contributions from data* (as `tuning.json` already does for weights). Thread 10 then adds entries, and thread 09 adds switches, without either rewriting the other's function. Island rolls should happen only when `scenario: "island"` is set, so the citadel digest test stays the guard. Run the 100-seed check per scenario, and add two counts the summary lacks: campaigns launched, and plots that struck while the ruler was away.

**Refuse.** Simulated Carthage and the island map landing in one PR. Ship the island against the old clock first, then swap in the Carthage bot behind its switch, so a broken result can be traced to one change.

---

## My top 3 foundation questions

1. **The shared men pool (Q1).** Is the same body of men both your army and your defense? If yes, the two games become one loop. If no, they stay glued together.
2. **What replaces the drift toward 5?** Faction power needs real sources and sinks: offices, victories, defeats, plunder, settlements.
3. **Carthage's depth (Q2).** Is it a bot whose politics respond to your results, or a full mirror? Settle it before thread 10 writes `carthage.ts`.

## The idea nobody else will raise

**One engine for every kind of pressure.** Plots against you, sieges of cities, and Carthage's preparations for war should all run on the same staged machine: hidden strength, stages, warnings, a moment, a strike that can partly succeed. Thread 09's improvements to plots (clues, partial success) then upgrade sieges and invasions for free. The player learns to read one kind of danger, and every number on screen means the same thing everywhere. Few mechanisms, many uses.
