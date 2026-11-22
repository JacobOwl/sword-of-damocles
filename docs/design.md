# Design draft (as submitted 2026-11-21)

_Working draft. Where this disagrees with `decisions.md`, decisions.md wins. Phase scope is in `scope.md`._


**To Claude Code:** I'm not asking you to build anything yet. I want your honest opinion on this design: what's realistic, what's hard, what's a trap, and how you would structure it. Push back where it's unrealistic. The questions I most want answered are at the end.

## The vision

The Sword of Damocles is a single-player political simulation of Sicily from 480 to 264 BC, from the Battle of Himera to Rome crossing into Messana.

- **What it simulates:** about 25 cities, the people in them, and the factions fighting over them.
- **Who you play:** a person, not a state. By default that's whoever holds Syracuse, but the world keeps going whether you hold it or not.
- **How you win:** you don't win by conquering the island. You try to hold power, and the game remembers how long you lasted, what you built and how you fell.
- **The output:** every campaign produces a written history.

Design references:
- **CK3:** characters and dynasties.
- **Dwarf Fortress and Songs of Syx:** a simulated world and emergent stories.
- **Root, John Company, Oath and Arcs:** asymmetric factions, power held as objects, and a world that persists.

This is explicitly not a Reigns-style card game. The factions act on their own, and events are seasoning.

## One season, one turn

The game loop runs in this order every season:

1. **The world ticks:** harvest, grain stores, silver, mercenary contracts coming due.
2. **People pursue ambitions:** characters act on their traits, grudges and family ties.
3. **Factions take their turns:** each faction is a bot that works through a priority list, like the automated opponents in solo board games.
4. **The player spends a few orders** across five areas: court, city, war, spies and embassies.
5. **Power changes hands:** factions win or lose control of the citadel, treasury, mint, fleet, generalship and assembly.
6. **The sword check:** active plots are weighed against the player's guard and spies. Warnings come before the blow, so a death never feels random.
7. **The chronicle records the season** in the voice of a biased ancient historian: Philistus, who was close to the tyrant Dionysius, or Timaeus, who hated tyrants.

## The eight systems

1. **Living island.** About 25 cities (Greek, Punic and native Sikel). Each tracks its population by class, grain, silver, walls, fleet and form of government. Time runs in seasons.
2. **People with memory.** Generals, demagogues, rich family heads, mercenary captains and Carthaginian officials each have traits, ambitions, money, relationships and grudges, and each grudge has a reason. Historical figures appear only when the conditions that produced them exist. Otherwise the game invents people.
3. **Faction bots.**
   - **Inside Syracuse:** the common citizens, the rich families, the mercenary guard and the ruler's family.
   - **Outside:** Carthage's war party and merchant families, a league of the native Sikels, and rival cities.
   - Each faction has its own turn and its own list of actions.
4. **Power objects.** The form of government isn't chosen by anyone. It comes out of who holds the citadel, treasury, mint, fleet, generalship and assembly. One man holding the citadel, the army and the treasury is a tyranny; the assembly holding the offices is a democracy.
5. **The player is a person.** The default start is as the ruler of Syracuse. Later the player could start as a demagogue, a mercenary captain or a rich exile and climb. When the player's character dies, play continues as an heir or as someone in their network.
6. **Mercenary market.**
   - Companies come from Campania, Iberia, Gaul, the Balearic Islands and mainland Greece.
   - Each has a contract, prices that rise with demand, and arrears.
   - They can be paid in land as well as silver. Historically, Dionysius I gave mercenaries citizenship and land.
   - Mercenaries who aren't paid seize cities.
7. **Two maps with supply.** One map is the island: cities, roads, sea lanes and a border river. The other is the city of Syracuse: Ortygia, Achradina, Tyche, Neapolis, Epipolae and the harbor. Armies march with supply, and sieges consume grain and bring plague.
8. **Biased chronicle.** Every person, city and war gets a browsable page, like Dwarf Fortress's Legends mode. On top of that is a written narrative in a historian's biased voice.

Carthage is simulated under the same rules: its own council, families and generals. The core historical idea is that Carthage and Syracuse shaped each other's governments, and it should emerge from play rather than be scripted.

## Architecture ideas (please critique)

- **The simulation core is separate from the UI.** It's deterministic and seeded so it can run headless for testing. I'm assuming TypeScript, but I want your opinion.
- **Content lives in data files:** people, cities, factions, events and starting positions, in JSON or YAML that I can edit without touching code.
- **Faction AI uses priority lists and utility scores,** not anything exotic. An LLM is optional, and only for writing the chronicle text, never for game logic.
- **Calibration against history.** Start the simulation in 480 BC, run it many times, and check whether it produces tyrannies, mercenary seizures and Carthaginian invasions at roughly the rates real history did. If it does, the engine is good enough, and I'd reuse it later for an invented world of my own.
- **The UI is a 2D browser game:** maps, character panels and a ledger. The art is mosaic-style, built from real ancient coin photographs.

## Roadmap (each phase playable on its own)

0. **Rulebook and paper test.** A design document, plus a test in chat with Claude running the factions.
1. **The Citadel.** Syracuse only, 405–395 BC: factions, people, plots, power objects and the sword check. Carthage appears only as outside pressure.
2. **The Island.** The Sicily map, 6–8 cities, armies with supply, and Carthage as a full simulated city.
3. **The Long Game.** All 216 years, generations of characters, start dates the player can choose, and the full mercenary market.
4. **The Historian.** The history browser and the biased chronicle.
5. **Optional: a board game.** A tabletop version of the power-object system for Tabletop Simulator.

## Known risks

- At full scope this is a multi-year hobby project. I don't write code, so you'd write it and I'd make the design calls and playtest.
- A simulation can easily produce bland, samey history. That's why phase 1 is one city and one decade.
- Faction AI that's readable and fun, rather than random or exploitable, is the hardest design problem.
- There's a lot of content to write. Each start date needs real people, families and events.

## Questions for you

1. Is a TypeScript simulation core, separate from the UI, the right base? Or would you pick something else, and why?
2. Are priority-list faction bots enough to make Syracusan politics feel alive, or do we need more? What would you do?
3. Is "run it 216 years headless and compare it to real history" a realistic way to test it? How would you set that up?
4. What's the smallest phase 1 that would tell us whether the core loop is fun?
5. Where do you expect the code to get fragile as it grows, and how should we structure it now to avoid that?
6. Is anything here a trap I should cut right away?
