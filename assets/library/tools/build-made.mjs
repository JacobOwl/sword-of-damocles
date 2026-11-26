// Builds every drawn (made) asset in assets/library/made/ and writes made/manifest.json.
// Safe to rerun: it clears made/ and writes the same files from the same code every time (no randomness without a seed).
// Run from the repo root:  node assets/library/tools/build-made.mjs
// It imports the game's own icon and event-picture code, so the in-game exports always match the game.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ICON_NAMES, iconBody } from "../../../ui/components/icons.ts";
import { VIGNETTE_NAMES, VIGNETTES } from "../../../ui/components/vignettes.ts";
import { iconDoc, C, esc } from "./lib/style.mjs";
import { NEW_ICONS } from "./lib/icons-new.mjs";
import { tondoDoc, NEW_TONDOS } from "./lib/tondos.mjs";
import { COINS } from "./lib/coins.mjs";
import { MEDALLIONS } from "./lib/medallions.mjs";
import { MAPS } from "./lib/maps.mjs";
import { ORNAMENTS } from "./lib/ornament.mjs";
import { TEXTURES } from "./lib/textures.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, "..");
const OUT = join(LIB, "made");

// What the game's own data says each in-game icon and picture stands for, so the catalog can be searched by it.
const GAME_ICON_TAGS = {
  sword: ["ruler", "dionysius", "faction", "power", "war"], hearth: ["family", "faction", "household", "home"],
  horse: ["rich families", "cavalry", "faction", "knights"], grain: ["citizens", "faction", "food", "harvest"],
  helmet: ["guard", "mercenaries", "faction", "army"], palm: ["carthage", "punic", "faction", "enemy"],
  citadel: ["office", "ortygia", "fortress", "seat"], treasury: ["office", "silver", "money", "seat"],
  mint: ["office", "coins", "silver", "seat"], fleet: ["office", "navy", "warship", "seat"],
  generalship: ["office", "army", "command", "seat"], assembly: ["office", "citizens", "vote", "seat"],
  court: ["area", "palace", "family"], city: ["area", "syracuse", "streets"], war: ["area", "army", "campaign"],
  spies: ["area", "intrigue", "secrets"], embassy: ["area", "diplomacy", "envoys"], scheming: ["area", "plots", "intrigue"],
  silver: ["resource", "money"], land: ["resource", "estates", "farms"], defense: ["resource", "walls", "safety"],
  influence: ["resource", "favour", "standing"], guard: ["resource", "bodyguard", "mercenaries"],
  carthage: ["enemy", "punic", "threat"], plot: ["intrigue", "conspiracy", "danger"], lyre: ["poetry", "music", "dionysius the poet"],
  mute: ["silence", "sound off", "ui"], rival: ["rival", "enemy", "ambition"], government: ["rule", "state", "council"],
};

const items = [];
function put(rel, text, meta) {
  const path = join(OUT, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  items.push({ file: `made/${rel}`, bytes: Buffer.byteLength(text), ...meta });
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// ---- Icons: the game's own, then the new ones ----
for (const name of ICON_NAMES) {
  put(`icons/game/${name}.svg`, iconDoc(`${name} (game icon)`, iconBody(name), "Exported from ui/components/icons.ts."), {
    id: `icon-game-${name}`, type: "icon", set: "game", title: name, tags: GAME_ICON_TAGS[name] ?? [], status: "in-game",
    source: "ui/components/icons.ts", use: `icon("${name}") in the game; or this file standalone`,
  });
}
for (const ic of NEW_ICONS) {
  put(`icons/new/${ic.id}.svg`, iconDoc(ic.title, ic.body, ic.note ?? ""), {
    id: `icon-${ic.id}`, type: "icon", set: "new", group: ic.group, title: ic.title, tags: ic.tags, note: ic.note, status: "new",
    use: "Copy the body into ICONS in ui/components/icons.ts to use it in game, or use the file standalone.",
  });
}
// One sprite with every icon as a <symbol>, for <svg><use href="sprite.svg#i-anchor"/></svg>.
{
  const sym = (id, title, body) => `<symbol id="i-${id}" viewBox="0 0 24 24"><title>${esc(title)}</title>${body}</symbol>`;
  const all = ICON_NAMES.map((n) => sym(n, n, iconBody(n))).concat(NEW_ICONS.map((ic) => sym(ic.id, ic.title, ic.body)));
  const css = `.line{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}.cut{fill:${C.page}}.cut.line{fill:none;stroke:${C.page}}`;
  put("icons/sprite.svg", `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n<style>${css}</style>\n${all.join("\n")}\n</svg>\n`, {
    id: "icon-sprite", type: "sprite", set: "all", title: "Every icon as one SVG sprite", tags: ["sprite", "symbols", "all icons"], status: "new",
    use: `<svg width="24" height="24"><use href="assets/library/made/icons/sprite.svg#i-anchor"/></svg> (ids are i-<name>)`,
  });
}

// ---- Event pictures: the game's own tondos, then new ones ----
for (const name of VIGNETTE_NAMES) {
  put(`events/game/${name}.svg`, tondoDoc(`${name} (game event picture)`, VIGNETTES[name], "Exported from ui/components/vignettes.ts."), {
    id: `event-game-${name}`, type: "event", set: "game", title: name, tags: [name], status: "in-game",
    source: "ui/components/vignettes.ts", use: `"art": "${name}" on an event in data/events.json`,
  });
}
for (const t of NEW_TONDOS) {
  put(`events/new/${t.id}.svg`, tondoDoc(t.title, t.body, t.note ?? ""), {
    id: `event-${t.id}`, type: "event", set: "new", title: t.title, tags: t.tags, note: t.note, status: "new",
    use: `Add the body to VIGNETTES in ui/components/vignettes.ts as "${t.id}", then "art": "${t.id}" on an event.`,
  });
}

// ---- Coins, medallions, maps, ornament, textures: each module returns finished documents ----
for (const group of [COINS, MEDALLIONS, MAPS, ORNAMENTS, TEXTURES]) {
  for (const it of group()) {
    const { rel, text, ...meta } = it;
    put(rel, text, { status: "new", ...meta });
  }
}

items.sort((a, b) => a.file.localeCompare(b.file));
const manifest = {
  note: "Every drawn asset in made/. Built by tools/build-made.mjs; do not edit by hand. status in-game = exported from the game's own code; new = drawn for this library.",
  count: items.length,
  items,
};
writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1) + "\n");
const by = {};
for (const it of items) by[it.type] = (by[it.type] ?? 0) + 1;
console.log(`made/: ${items.length} files`, by);
