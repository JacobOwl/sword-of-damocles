# Council brief: unit types, town contingents and battle ground (2026-11-27)

You sit on a design council for Jacob's browser game "The Sword of Damocles" (repo /home/user/sword-of-damocles; read its CLAUDE.md first). You are one seat of four. DESIGN ONLY: do not edit or create any file in either repository, do not commit. Return your statement as your final reply (about 900 to 1,400 words, plain English, no walls of text).

## What Jacob asked (his words)
- "We should look into different unit types like cavalary and war elephants and stuff. We should look into how we can use terrarin like if our general is better and lucky he can set up good terrain."
- "Would having units be specfically aligned with towns be a good thing? Like 5k from Gela and we know there from Gela. Showcases the importnace of the town but also maybe they can backstab us or fight worst or break first if they don't like us as much? same for carthage? brainstorming ideas to make towns matter more and have more character. Any real history of these kinds of backstabs or city army diffs"
- His standing rule: "Have councils look into these issues. Look into other games; as a rule I prefer us being inspired by other games than you making up stuff. Look into real history and plausable stuff."

**So the key rule for every seat: each mechanic you propose must name where it comes from — a specific game (and what in it) and/or an ancient passage (opened in the saved texts). Anything with neither is "our invention": label it, and keep such things few and small.** If you are not sure how a game works, say so; do not state a guess about a game as fact. Confident errors are the worst failure.

## Read first
1. The draft to critique: `docs/council/2026-11-27-units/first-draft.md` (contingents with hearts, five arms, a contested ground roll, standing wish, refusing battle; elephants only via Pyrrhus in the 289 campaign).
2. Its history card: `docs/research/units-and-ground.md` (all quotes opened).
3. The battle as it is: `src/core/island.ts` (battleMods, battle, muster around lines 177-330 and 709-735), `src/core/plate.ts`, `data/battle.json`. The war focus record: `docs/council/2026-11-27-war-and-geopolitics.md` (skim).
4. Jacob's tastes (CLAUDE.md): Leder Games (Root, Oath, Arcs), Republic of Rome, John Company, CK3, Dwarf Fortress, Songs of Syx. Asymmetric factions, power as objects, emergent stories. He is a novice, dislikes walls of text and fiddly micromanagement, read only the structured parts of the screen in tests, liked the war, the map and events. A parallel thread is designing multi-part battle scenes (ground, plan, clash with a "turn" danger, pursuit): `docs/council/2026-11-27-big-scenes.md` if it exists on main.

## Saved sources (READ-ONLY, grep, never read whole books)
/home/user/phoenician-punic-world/sources: Diodorus `diodorus/english/book13.loeb.txt`, `book14.loeb.txt`, `book15.loeb.txt`, `book16.loeb.txt`, `book22.loeb.txt`; Plutarch `plutarch/lives-carthage.perrin.txt` (Timoleon, Dion); Polybius `polybius/book1.shuckburgh.txt`; Polyaenus `sicily-tyrants/polyaenus-book5*` (late, doubtful); Devereaux `acoup/` (modern). Quote only what you opened, with the section number.

## Your statement's shape
1. Verdict on the draft in three lines.
2. Your proposals, each one line of rule + "Inspired by:" (game and/or passage) + cost (cheap/medium/costly).
3. What to cut or change in the draft, and why.
4. Anything in the draft that is our invention and has a better precedent you know.
5. One example battle told in five plain lines, as the player would see it with your version.
