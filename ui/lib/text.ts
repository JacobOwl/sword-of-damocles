// Shared UI state and small helpers for turning the simulation's words into readable, clickable text.
// Nothing here changes the game; it only reads the state.
import { DATA, PLAYER, capital } from "../../src/core/index.ts";
import type { Args, GameState, LogEntry } from "../../src/core/index.ts";

export const ui = {
  s: null as GameState | null,
  designer: false,
  view: "play" as "play" | "island" | "court" | "families" | "works" | "chronicle" | "help",
  tab: "season", // phone sub-tab inside the play view
  openAction: null as string | null,
  args: {} as Args,
  sheet: null as string | null, // person whose character sheet is open
  lastSeen: 0,
  verdict: null as Verdict | null, // your season-10 verdict in a preset game (ui/views/verdict.ts)
  verdictDraft: {} as Record<string, string>, // what you typed before saving it
  copyOpen: false, // the "Copy my game" box is showing
};

export interface Verdict { season: number; retell: string; confused: string; unfair: string; level: "" | "easy" | "right" | "hard"; other: string; skipped?: boolean }

export const esc = (t: unknown) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
export const sign = (n: number) => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : "0");

// ---------- Pronouns ----------
// The data has no gender field yet, so women are found from how their relatives describe them
// ("sister", "wife", "daughter"). Parked in docs/later.md: a proper field in people.json.
const FEMALE_WORDS = new Set(["wife", "sister", "daughter", "mother", "co-wife", "niece", "aunt", "widow"]);
const women = new Set<string>();
for (const p of DATA.people) {
  for (const f of (p.family ?? []) as { person: string; relation: string }[]) {
    const head = f.relation.replace(/\(.*?\)/g, "").trim().split(/\s+/).pop()?.toLowerCase() ?? "";
    if (FEMALE_WORDS.has(head)) women.add(f.person);
  }
}
export const isWoman = (id: string) => women.has(id);
export const pr = (id: string) => (isWoman(id) ? { he: "she", him: "her", his: "her", He: "She", His: "Her" } : { he: "he", him: "him", his: "his", He: "He", His: "His" });

// ---------- Records from the data files ----------
export const record = (id: string): any => DATA.people.find((p) => p.id === id);
export const isReal = (id: string) => record(id)?.kind === "history";

// ---------- Names that open a character sheet ----------
export function who(id: string, label?: string) {
  const s = ui.s!;
  if (id === PLAYER) return label ? esc(label) : "you";
  const p = s.people[id];
  if (!p) return esc(label ?? id);
  return `<button type="button" class="who" data-person="${esc(id)}">${esc(label ?? capital(p.name))}</button>`;
}

// Find people's names inside a sentence from the log and make them clickable.
let nameIndex: { id: string; re: RegExp }[] | null = null;
function names() {
  if (nameIndex) return nameIndex;
  nameIndex = DATA.people.filter((p) => !p.player)
    .map((p) => ({ id: p.id as string, name: p.name as string }))
    .sort((a, b) => b.name.length - a.name.length)
    .map(({ id, name }) => {
      const first = name.charAt(0);
      const rest = name.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return { id, re: new RegExp(`(^|[^\\w>])([${first.toUpperCase()}${first.toLowerCase()}]${rest})(?![\\w<])`, "g") };
    });
  return nameIndex;
}
export function linkNames(text: string): string {
  // Replace names longest first, with placeholders so a short name can't match inside a long one.
  let out = esc(text);
  const found: string[] = [];
  for (const { id, re } of names()) {
    out = out.replace(re, (_m, pre: string, nm: string) => {
      found.push(who(id, nm));
      return `${pre}\u0000${found.length - 1}\u0000`;
    });
  }
  return out.replace(/\u0000(\d+)\u0000/g, (_m, i) => found[Number(i)]);
}

// ---------- Rolls, in words ----------
const DIE = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
export function rollLine(e: LogEntry): string {
  const r = e.roll;
  if (!r) return linkNames(e.text);
  const what = e.text.slice(0, e.text.indexOf(": rolled"));
  const mods = r.mods.filter((m) => m.value).map((m) => `${sign(m.value)} ${esc(m.label)}`).join(", ");
  return `<span class="die" aria-hidden="true">${DIE[r.die] ?? ""}</span> ${linkNames(what)}: needed ${r.need}, rolled ${r.die}${mods ? `, ${mods}` : ""}, so ${r.total}. <b class="${r.ok ? "good" : "warn"}">${r.ok ? "Success" : "Failure"}.</b>`;
}

// ---------- Opinion ----------
const OP_WORDS: Record<string, string> = { "-3": "Hates you", "-2": "Bitter", "-1": "Cool", "0": "Indifferent", "1": "Warm", "2": "Friendly", "3": "Devoted" };
export const opinionWord = (n: number) => OP_WORDS[String(Math.max(-3, Math.min(3, n)))];
export function opChip(n: number, word = false) {
  return `<span class="op ${n < 0 ? "neg" : n > 0 ? "pos" : ""}" data-tip="opinion">${sign(n)}${word ? ` <span class="opw">${opinionWord(n)}</span>` : ""}</span>`;
}

// What the opinion changes in the log say, newest first.
export function opinionHistory(s: GameState, id: string, all: boolean) {
  return s.log.filter((e) => e.actor === id && e.kind === "change" && (all || e.visible) && /opinion of you/.test(e.text))
    .map((e) => ({ season: e.season, up: /rises/.test(e.text), to: Number((/to ([+-]?\d+)/.exec(e.text) ?? [])[1] ?? 0), why: e.why ?? "" }))
    .reverse();
}

// Turn an id like "politicalType" into words for the "invented" list.
const FIELD_WORDS: Record<string, string> = {
  traits: "traits", ambition: "ambition", opinion: "starting opinion", wants: "the office wanted", politicalType: "rival type",
  marriageable: "marriage terms", enters: "when they enter", rival: "rival status", grudges: "grudges", faction: "faction",
  agenda: "agenda", status: "where they start", role: "role wording", name: "name", kin: "kin", offices: "starting office",
};
export const fieldWords = (f: string) => FIELD_WORDS[f] ?? f.replace(/([A-Z])/g, " $1").toLowerCase();
