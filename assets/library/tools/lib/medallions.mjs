// Cast medallions: a coin-style portrait for each person in docs/drafts/rising-cast.md (PR 86), plus Dionysius.
// Each is the game's own red-figure head (ui/components/figures.ts) struck in pale gold on the faction's coin field,
// with the name round the bottom in Greek capitals (my transliteration) and the faction icon behind the head.
// Nobody's real face is known; these are invention, like the game's mosaic portraits.
import * as F from "../../../../ui/components/figures.ts";
import { iconBody } from "../../../../ui/components/icons.ts";
import { C, doc, f2 } from "./style.mjs";
import { legend } from "./coins.mjs";

const FIELD = { family: C.family, rich: C.rich, citizens: C.citizens, guard: C.guard, carthage: C.punic, ruler: C.ruler };
const ICON = { family: "hearth", rich: "horse", citizens: "grain", guard: "helmet", carthage: "palm", ruler: "sword" };
const GOLD = "#ecd59a", GOLD_DK = "#b8913a";

// id, name, Greek, faction, head options, real?, in-game mosaic portrait file (if the game has one)
const CAST = [
  ["dionysius", "Dionysius I", "ΔΙΟΝΥΣΙΟΣ", "ruler", { beard: true, wreath: true }, true, "dionysius.webp"],
  ["leptines", "Leptines", "ΛΕΠΤΙΝΗΣ", "family", { beard: true, hair: "helmet" }, true, "leptines.webp"],
  ["thearides", "Thearides", "ΘΕΑΡΙΔΗΣ", "family", { beard: true }, true, "thearides.webp"],
  ["polyxenus", "Polyxenus", "ΠΟΛΥΞΕΝΟΣ", "family", { beard: true }, true, "polyxenus.webp"],
  ["heloris", "Heloris", "ΕΛΩΡΙΣ", "family", { beard: true, hair: "bald" }, true, "heloris.webp"],
  ["doris", "Doris of Locri", "ΔΩΡΙΣ", "family", { hair: "bun" }, true, "doris.webp"],
  ["andron", "Andron", "ΑΝΔΡΩΝ", "family", { beard: true }, true, "andron.webp"],
  ["philistus", "Philistus", "ΦΙΛΙΣΤΟΣ", "rich", { beard: true }, true, "philistus.webp"],
  ["hipparinus", "Hipparinus", "ΙΠΠΑΡΙΝΟΣ", "rich", { beard: true, hair: "bald" }, true, "hipparinus.webp"],
  ["aristomache", "Aristomache", "ΑΡΙΣΤΟΜΑΧΗ", "rich", { hair: "veil" }, true, "aristomache.webp"],
  ["dion", "Dion", "ΔΙΩΝ", "rich", { beard: false }, true, null],
  ["theodorus", "Theodorus", "ΘΕΟΔΩΡΟΣ", "rich", { beard: true, hair: "helmet" }, true, "theodorus.webp"],
  ["aristides", "Aristides of Locri", "ΑΡΙΣΤΕΙΔΗΣ", "rich", { beard: true, wreath: true }, true, null],
  ["nicoteles", "Nicoteles the Corinthian", "ΝΙΚΟΤΕΛΗΣ", "citizens", { beard: true }, true, "nicoteles.webp"],
  ["damon", "Damon the smith", "ΔΑΜΩΝ", "citizens", { beard: true }, false, "damon.webp"],
  ["aristotle", "Aristotle the Spartan", "ΑΡΙΣΤΟΤΕΛΗΣ", "guard", { beard: true, hair: "helmet" }, true, "aristotle.webp"],
  ["archylus", "Archylus of Thurii", "ΑΡΧΥΛΟΣ", "guard", { beard: true, hair: "helmet" }, true, "archylus.webp"],
  ["biton", "Biton of Syracuse", "ΒΙΤΩΝ", "guard", { beard: false, hair: "helmet" }, true, "biton.webp"],
  ["himilcon", "Himilcon", "ΙΜΙΛΚΩΝ", "carthage", { beard: true }, true, null],
  ["magon", "Magon", "ΜΑΓΩΝ", "carthage", { beard: true, hair: "helmet" }, true, null],
  ["magon-son", "Magon's son", "", "carthage", { beard: false }, true, null],
];

function medallion(id, greek, faction, opts) {
  const col = FIELD[faction];
  const beads = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    return `<circle cx="${f2(60 + 52.2 * Math.cos(a))}" cy="${f2(60 + 52.2 * Math.sin(a))}" r="1" fill="${C.accent}"/>`;
  }).join("");
  const helmet = opts.hair === "helmet";
  const head = helmet ? F.head(62, 60, 1, opts, 4.1) : F.head(62, 55, 1, opts, 4.4);
  const shadow = `<g class="shadow" opacity=".35" transform="translate(1.2 1.4)">${head}</g>`;
  const icon = `<g transform="translate(16 48) scale(.58)" color="${GOLD}" fill="${GOLD}">${iconBody(ICON[faction])}</g>`;
  return `<defs><radialGradient id="f-${id}" cx="40%" cy="34%" r="78%"><stop offset="0" stop-color="${col}" stop-opacity=".72"/><stop offset="1" stop-color="${col}"/></radialGradient>` +
    `<clipPath id="c-${id}"><circle cx="60" cy="60" r="48.6"/></clipPath></defs>` +
    `<circle cx="60" cy="60" r="56" fill="${C.gold}" stroke="${C.accent}" stroke-width="1.2"/><circle cx="60" cy="60" r="49" fill="url(#f-${id})" stroke="${GOLD}" stroke-width="1"/>${beads}` +
    `<g clip-path="url(#c-${id})">${shadow}<g fill="${GOLD}" color="${GOLD}">${head}</g></g>` +
    (greek ? legend(greek, null, { id: `lg-${id}`, r: 44.2, size: greek.length > 9 ? 6.2 : 7, start: 25, end: 155, fill: GOLD, bottom: true }) : "") + icon;
}

export function MEDALLIONS() {
  return CAST.map(([id, name, greek, faction, opts, real, portrait]) => {
    const col = FIELD[faction];
    const css = `.line{fill:none;stroke:${GOLD};stroke-linecap:round;stroke-linejoin:round}.cut{fill:${col}}.cut.line{fill:none;stroke:${col}}.hair{stroke:${GOLD};stroke-width:.5}.shadow path,.shadow circle,.shadow ellipse{fill:#000;stroke:none}.shadow .line{fill:none;stroke:#000}`;
    const note = `${real ? "A real person" : "An invented person"} in docs/drafts/rising-cast.md; the face is invention (the game's head drawing).` +
      (greek ? " The Greek name is my transliteration." : " No legend: the sources do not name him.") +
      (portrait ? ` The game already has a mosaic portrait, ui/art/portraits/${portrait}; this is an alternative.` : " The game has no portrait for this person yet.");
    return {
      rel: `medallions/${id}.svg`,
      text: doc({ w: 120, h: 120, px: [240, 240], title: `${name}, medallion`, desc: note, css, body: medallion(id, greek, faction, opts) }),
      id: `medallion-${id}`, type: "medallion", title: `${name} (medallion)`, person: name, faction, real,
      tags: [name.toLowerCase(), faction, "portrait", "cast", real ? "real person" : "invented person", portrait ? "has game portrait" : "no game portrait"],
      note,
    };
  });
}
