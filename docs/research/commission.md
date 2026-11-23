# Leading the army yourself (switch "commission")

What the sources show about Dionysius away from Syracuse with his army, and who held the city behind him. The rule built on it (`data/commission.json`, `src/core/commission.ts`) is **invention**: every number, and the choice to make absence a cost in the sword check, is ours. The pattern behind it is **history**, quoted below from the saved texts in the Phoenician-Punic World project (`sources/`). Each quote was opened and is checked by `node scripts/verify-cast-quotes.mjs ../phoenician-punic-world`.

## Dionysius led his army in person (`ledInPerson`)
- Diodorus 14.72.1 (the night attack on Himilcon's camp, 396 BC): "while he himself, profiting by a moonless night, made a circuit with his army".
- Diodorus 14.95.3 (a later campaign against Mago, after the decade the game covers; the exact year is not checked here): he "speedily collected as many Syracusans and mercenaries as he could and set forth, having in all not less than twenty thousand soldiers".
- Why it matters for the rule: the current plan let only the holder of the generalship command, and gave the player no presence in the field. Diodorus has Dionysius take the field again and again, so "you lead it yourself" is the sourced default and sending another man the variation.

## A keeper of the fortress while he was away (`keeperAndron`)
- Polyaenus, *Stratagems* 5.2.4: "When Dionysius left on a foreign expedition, he left Andron in charge of the fortress and the treasury. Hermocrates advised Andron to seize both of these, while Dionysius was absent."
- Andron confessed, and Dionysius "ordered him to be executed, because he had not revealed the proposal". Polyaenus gives no date or campaign, so the story is a pattern, not an event of a known year.
- In the game: if you go, you name a keeper; his loyalty adds to or takes from your defense. A keeper who has joined a plot is the Andron case, and when you come home you may see it in his face.

## Armed citizens and an absent tyrant (`armedCitizens`)
- Diodorus 14.45.5 (398 BC, the vote for war): the Syracusans "hoped that once they had got weapons in their hand, they could strike for their liberty".
- Diodorus 14.64.3 to 14.64.4 (396 BC, during the siege of Syracuse, while "Dionysius and Leptines had set out with warships", 14.64.1): the citizens, "without his presence, had won a victory over the Carthaginians, they were now puffed up with pride", and "now because of the war they had weapons at their command".
- In the game: while you are away every plot gains 1; while the levy is out, a plot with a citizen in it gains 1.

## His house sacked while he was away (`houseSacked`)
- Diodorus 13.112.3 to 13.112.4 (405 BC, just before the game starts): after the retreat from Gela the Syracusan cavalry "rode off with one accord to Syracuse", entered the dockyards and "plundered the house of Dionysius which was filled with silver and gold". This is the start screen's backstory, and the model for what an absence can cost.

## What is invention
- The sizes: plots +1 while you are away, +1 for armed citizens, keeper +1 (thinks 2 or more of you), -1 (thinks -1 or less), -2 (in a plot), -1 (gone), +1 in battle when you lead in person.
- "Unlawful" command: passing over the elected general (the design council's verdict V2, `docs/council/2026-11-22-design-council.md`) angers the citizens by 1 and the general by 1. No source gives this rule.
- The homecoming: a victory raises the citizens' mood (you) or a man's influence and his faction's power (a man you sent); a defeat lowers them.
- Who may lead and who may keep the citadel: lists in `data/commission.json`, drawn from the real cast.

## Disagreements and gaps
- Whether Dionysius' absences in 405 to 395 were long enough to matter is not stated season by season; Diodorus' chronology for the early 390s is compressed (see `docs/research/diodorus-401-399.md`).
- Polyaenus is a late collector of stratagems (2nd century AD); his Andron story is single-source.
