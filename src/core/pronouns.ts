// He or she, from the data. The cast in data/people.json carries `sex: "f"` for its women (a missing field means a man);
// the census families carry their own sex. Nothing in the game state changes: this reads the data and the census.
import { DATA } from "./data.ts";
import type { GameState } from "./types.ts";

const WOMEN = new Set(DATA.people.filter((p: any) => p.sex === "f").map((p: any) => p.id as string));
const FORMS: Record<string, [string, string]> = { he: ["he", "she"], him: ["him", "her"], his: ["his", "her"], himself: ["himself", "herself"] };

export function sexOf(s: GameState, id: string | undefined): "m" | "f" {
  if (!id) return "m";
  if (id.startsWith("census:")) return s.census?.people[id.slice(7)]?.sex === "f" ? "f" : "m";
  return WOMEN.has(id) ? "f" : "m";
}
export const isPronoun = (word: string) => word.toLowerCase() in FORMS;
// pronoun(s, id, "his") is "his" or "her"; "His" keeps the capital.
export function pronoun(s: GameState, id: string | undefined, word: string): string {
  const f = FORMS[word.toLowerCase()];
  if (!f) return word;
  const w = f[sexOf(s, id) === "f" ? 1 : 0];
  return word[0] === word[0].toUpperCase() ? w[0].toUpperCase() + w.slice(1) : w;
}
