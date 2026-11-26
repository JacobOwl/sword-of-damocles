// New event pictures: red-figure emblems in the round of a cup, built exactly like ui/components/vignettes.ts
// (same figures, same icons, same meander ring) so any of them can be pasted into VIGNETTES. Every scene is invention.
import * as F from "../../../../ui/components/figures.ts";
import { iconBody } from "../../../../ui/components/icons.ts";
import { vignette } from "../../../../ui/components/vignettes.ts";
import { NEW_ICONS } from "./icons-new.mjs";
import { doc, TONDO_CSS, f2 } from "./style.mjs";

// The game's ring, taken from its own vignette() output so the two can never drift apart.
const RING = (() => {
  const s = vignette("feast");
  const m = s.match(/<g class="clay">([\s\S]*?)<\/g>\s*<g class="clay fig">/);
  if (!m) throw new Error("could not find the meander ring in vignette() output");
  return m[1];
})();

export function tondoDoc(title, body, desc = "") {
  const inner = `<circle cx="60" cy="60" r="59" class="glaze"/>\n<g class="clay">${RING}</g>\n<g class="clay fig">${body}</g>\n<path d="M28 90.5 H92" class="clay line" style="stroke-width:1.1;opacity:.55"/>`;
  return doc({ w: 120, h: 120, px: [240, 240], title, desc, css: TONDO_CSS, body: inner });
}

const NEW = Object.fromEntries(NEW_ICONS.map((i) => [i.id, i.body]));
// An icon placed in the 120-unit tondo: (x, y) is its top-left corner, s its scale (24 units -> 24*s), flip mirrors it.
const place = (body, x, y, s, rot = 0, flip = false) =>
  `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${rot} ${f2(12 * s)} ${f2(12 * s)}) scale(${flip ? -s : s} ${s})${flip ? " translate(-24 0)" : ""}">${body}</g>`;
const use = (name, x, y, s, rot = 0, flip = false) => place(iconBody(name), x, y, s, rot, flip);
const nu = (id, x, y, s, rot = 0, flip = false) => {
  if (!NEW[id]) throw new Error(`no new icon ${id}`);
  return place(NEW[id], x, y, s, rot, flip);
};
// The running-wave scroll from cup borders (the same curve as vignettes.ts).
const waves = (y, x0 = 26, x1 = 94, h = 5) => {
  let d = `M${x0} ${y}`;
  for (let x = x0; x < x1; x += 10) d += ` C${x + 3} ${y} ${x + 4} ${y - h} ${x + 7} ${y - h} C${x + 10} ${y - h} ${x + 10} ${y - h / 3} ${x + 8} ${y - h / 3} C${x + 6.5} ${y - h / 3} ${x + 6.5} ${y} ${x + 10} ${y}`;
  return `<path d="${d}" class="line" style="stroke-width:1.6"/>`;
};
// A sword hanging point-down from a single hair, the game's own emblem.
const hangingSword = (x, top, len = 30) =>
  `<path d="M${x} ${f2(60 - Math.sqrt(46.4 ** 2 - (x - 60) ** 2))} V${top}" class="line hair"/>` +
  `<circle cx="${x}" cy="${top + 1.8}" r="2"/><rect x="${x - 1}" y="${top + 3.4}" width="2" height="5.4"/>` +
  `<path d="M${x - 7.2} ${top + 8.6} H${x + 7.2} V${top + 10.6} H${x - 7.2} Z"/>` +
  `<path d="M${x - 2.1} ${top + 10.6} H${x + 2.1} L${x + 1.4} ${top + 10.6 + len} L${x} ${top + 14 + len} L${x - 1.4} ${top + 10.6 + len} Z"/>` +
  `<path d="M${x} ${top + 12} V${top + 8 + len}" class="cut line" style="stroke-width:.5"/>`;

export const NEW_TONDOS = [
  { id: "damocles", title: "The sword on a hair", tags: ["damocles", "sword", "feast", "danger", "the title", "tyranny"],
    note: "Damocles at the tyrant's feast under a sword hung by one hair (Cicero, Tusculan Disputations 5.61-62, a story told of the younger Dionysius). The drawing is invention.",
    body: `${F.symposiast(60, 84, 1, 0.96)}${hangingSword(46, 21, 12)}` },
  { id: "audience", title: "An audience with the ruler", tags: ["audience", "petition", "court", "throne", "favour"],
    body: `${F.seatedMan(46, 94, 1, { hold: "staff" }, 1.15)}${F.standingMan(86, 94, -1, { arm: "forward" }, 1.05)}` },
  { id: "denounced", title: "A man denounced", tags: ["accusation", "assembly", "trial", "enemy", "speech"],
    body: `${F.standingMan(40, 94, 1, { arm: "raised" }, 1.08)}${F.standingMan(82, 94, -1, { arm: "wrapped" }, 1.04)}` },
  { id: "exile", title: "Into exile", tags: ["exile", "banishment", "voyage", "flight", "departure"],
    body: `${F.standingMan(38, 94, 1, { arm: "staff" }, 1.04)}${nu("merchantship", 56, 30, 1.6)}${waves(88, 56, 94, 3.5)}` },
  { id: "petalism", title: "Voting on olive leaves", tags: ["petalism", "exile vote", "assembly", "banishment", "vote"],
    note: "Syracuse's petalism (Diodorus 11.86-87); the leaves and urn are drawn by invention.",
    body: `${nu("ballot", 33, 30, 2.3)}${nu("petal", 18, 22, 0.9, -30)}${nu("petal", 78, 24, 0.85, 40)}${nu("petal", 20, 62, 0.8, 10)}${nu("petal", 80, 60, 0.8, -50)}` },
  { id: "trial", title: "Speaking against the water clock", tags: ["trial", "law court", "jury", "speech", "deadline"],
    body: `${F.standingMan(40, 94, 1, { arm: "raised" }, 1.04)}${nu("waterclock", 60, 40, 1.9)}` },
  { id: "catapult", title: "The new catapult", tags: ["catapult", "siege", "engineers", "invention", "motya", "artillery"],
    note: "Diodorus 14.42.1 credits the catapult's invention to Dionysius' engineers at Syracuse, about 399.",
    body: `${nu("catapult", 25, 22, 2.9)}` },
  { id: "siegetower", title: "Siege tower at the walls", tags: ["siege", "motya", "assault", "tower", "walls"],
    body: `${nu("citywalls", 50, 44, 1.9)}${nu("siegetower", 14, 22, 2.8)}` },
  { id: "seabattle", title: "Warships meet", tags: ["naval battle", "fleet", "trireme", "catana", "ramming"],
    body: `${nu("trireme", 18, 20, 1.7)}${nu("trireme", 46, 46, 1.7, 0, true)}${waves(90, 28, 92, 4)}` },
  { id: "trophy", title: "A trophy on the field", tags: ["victory", "battle won", "trophy", "triumph"],
    body: `${nu("trophy", 24, 18, 3)}` },
  { id: "duel", title: "Hoplites clash", tags: ["battle", "hoplites", "war", "duel", "citizen levy"],
    body: `${F.hoplite(42, 96, 1, {}, 1)}${F.hoplite(80, 96, -1, {}, 1)}` },
  { id: "treaty", title: "Envoys agree", tags: ["treaty", "embassy", "envoys", "peace", "alliance"],
    body: `${F.standingMan(40, 94, 1, { arm: "forward" }, 1.05)}${F.standingMan(80, 94, -1, { arm: "forward" }, 1.05)}${nu("scroll", 50, 18, 0.85)}` },
  { id: "oath", title: "An oath at the altar", tags: ["oath", "altar", "gods", "loyalty", "sacrifice"],
    body: `${F.standingMan(36, 94, 1, { arm: "raised" }, 1.04)}${nu("altar", 54, 52, 1.55)}` },
  { id: "sacrifice", title: "Sacrifice", tags: ["sacrifice", "altar", "festival", "gods", "cattle"],
    body: `${nu("altar", 41, 52, 1.6)}${nu("bucranion", 24, 20, 1)}${nu("bucranion", 72, 20, 1)}` },
  { id: "oracle", title: "Asking the oracle", tags: ["oracle", "delphi", "omen", "prophecy", "apollo"],
    body: `${F.standingWoman(38, 94, 1, { veil: true, arm: "forward" }, 1.05)}${nu("tripod", 54, 46, 1.75)}` },
  { id: "whisper", title: "A word in the ear", tags: ["informer", "rumour", "spies", "secret", "intrigue"],
    body: `${F.standingMan(40, 94, 1, { arm: "mouth" }, 1.04)}${F.seatedMan(78, 94, -1, { hold: "none" }, 1.1)}` },
  { id: "poison", title: "Poison", tags: ["poison", "murder", "plot", "physician"],
    body: `${nu("poison", 29, 18, 2.9)}` },
  { id: "nightletter", title: "A letter by lamplight", tags: ["letter", "night", "secret", "conspiracy", "message"],
    body: `${F.standingMan(42, 94, 1, { arm: "forward" }, 1.04)}${nu("lamp", 60, 50, 1.3)}${nu("moon", 70, 18, 1.1)}` },
  { id: "bribe", title: "Silver changes hands", tags: ["bribe", "silver", "corruption", "pay", "favour"],
    body: `${F.standingMan(40, 94, 1, { arm: "forward" }, 1.04)}${F.standingMan(82, 94, -1, { arm: "wrapped" }, 1.04)}${nu("moneybag", 55, 47, 0.62)}` },
  { id: "arrest", title: "Arrest", tags: ["arrest", "guard", "prison", "captive", "purge"],
    body: `${F.hoplite(44, 96, 1, {}, 1)}${F.standingMan(82, 94, -1, { arm: "wrapped" }, 1)}${nu("fetters", 72, 26, 0.8)}` },
  { id: "beacon", title: "The beacons are lit", tags: ["beacon", "warning", "invasion", "news", "signal"],
    body: `${nu("beacon", 26, 16, 2.8)}${waves(90, 26, 94, 3.5)}` },
  { id: "torchlight", title: "By torchlight", tags: ["night", "procession", "festival", "demeter", "march"],
    body: `${F.standingWoman(48, 94, 1, { arm: "torch" }, 1.12)}${nu("moon", 72, 18, 1.15)}` },
  { id: "famine", title: "Empty stores", tags: ["famine", "hunger", "siege", "grain", "shortage"],
    body: `${F.standingWoman(38, 94, 1, { veil: true, arm: "down" }, 1.05)}${nu("pithos", 56, 44, 1.7)}` },
  { id: "shipyard", title: "Building the fleet", tags: ["shipyard", "fleet", "building programme", "timber", "shipsheds"],
    note: "Dionysius' great building of warships, about 399 (Diodorus 14.42.2-5). The drawing is invention.",
    body: `${nu("shipsheds", 22, 22, 2.2)}${nu("timber", 66, 58, 1.2)}` },
  { id: "scales", title: "Weighing the silver", tags: ["treasury", "silver", "tribute", "accounts", "trade"],
    body: `${nu("scales", 24, 18, 3)}` },
  { id: "arethusa", title: "Arethusa and the dolphins", tags: ["arethusa", "syracuse", "coin", "nymph", "dolphins", "ortygia"],
    note: "After the coin type of Syracuse (sourced: docs/research/art-motifs.md); this head is invention.",
    body: `${F.head(58, 60, 1, { hair: "bun" }, 2.9)}${nu("dolphin", 22, 18, 0.95, -35)}${nu("dolphin", 74, 22, 0.95, 40, true)}${nu("dolphin", 20, 76, 0.9, 30, true)}${nu("dolphin", 78, 76, 0.9, -25)}` },
  { id: "mourning", title: "Mourning at the grave", tags: ["death", "funeral", "mourning", "grave", "loss"],
    body: `${F.standingWoman(38, 94, 1, { veil: true, arm: "veil" }, 1.05)}${nu("stele", 46, 38, 2.15)}` },
  { id: "eagle", title: "An eagle overhead", tags: ["omen", "eagle", "zeus", "sign", "kingship"],
    body: `${nu("eagle", 28, 22, 2.6)}${nu("thunderbolt", 70, 64, 0.95)}` },
  { id: "triskeles", title: "The three legs of Sicily", tags: ["sicily", "island", "emblem", "triskeles"],
    body: `${nu("triskeles", 24, 24, 3)}` },
  { id: "theatre", title: "A day at the theatre", tags: ["theatre", "plays", "tragedy", "festival", "crowd", "poetry"],
    body: `${nu("theatre", 26, 34, 2.8)}${nu("tragicmask", 49, 15, 0.95)}` },
  { id: "harbour", title: "The harbour", tags: ["harbour", "port", "anchor", "trade", "fleet"],
    body: `${nu("anchor", 30, 18, 2.5)}${waves(90, 26, 94, 3.5)}` },
  { id: "debate", title: "The philosopher's visit", tags: ["philosopher", "plato", "debate", "teaching", "court"],
    note: "Plato's first visit to Syracuse, about 388 (Plutarch, Dion 4-5). The figures are invention.",
    body: `${F.seatedMan(44, 94, 1, { hold: "staff" }, 1.12)}${F.standingMan(82, 94, -1, { arm: "raised" }, 1.02)}` },
  { id: "captives", title: "Captives", tags: ["captives", "slavery", "prisoners", "after the sack"],
    body: `${F.standingMan(52, 94, 1, { arm: "wrapped" }, 1.08)}${F.standingMan(76, 94, 1, { arm: "wrapped" }, 1)}${nu("fetters", 26, 58, 1)}` },
  { id: "eavesdrop", title: "The listening quarry", tags: ["ear of dionysius", "quarry", "eavesdropping", "spies", "prisoners"],
    note: "The Ear of Dionysius is a cave in a Syracusan quarry; the tale that he listened there is a later legend (general knowledge, unverified).",
    body: `${nu("quarry", 14, 38, 2.2)}${nu("ear", 60, 16, 1.6)}` },
  { id: "carthagefleet", title: "Carthage's fleet sails", tags: ["carthage", "invasion", "punic", "fleet", "himilcon"],
    body: `${nu("merchantship", 26, 26, 2.6)}${nu("tanit", 52, 14, 0.7)}${waves(90, 26, 94, 4)}` },
  { id: "spring", title: "Spring flowers", tags: ["spring", "season", "new year", "hope"],
    body: `${nu("blossom", 22, 20, 3.2)}` },
  { id: "winter", title: "Winter storms", tags: ["winter", "season", "storm", "no sailing"],
    body: `${nu("rain", 22, 16, 3.1)}` },
  { id: "summer", title: "High summer", tags: ["summer", "season", "drought", "campaign season"],
    body: `${nu("sun", 22, 20, 3.2)}` },
  { id: "vintage", title: "The vintage", tags: ["autumn", "season", "wine", "harvest", "vineyard"],
    body: `${nu("grapes", 24, 18, 3)}` },
];
