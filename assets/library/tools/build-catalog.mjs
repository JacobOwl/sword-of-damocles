// Builds the library's front door from made/manifest.json and real/sources.json:
//   catalog.json  every item, one record each, with search facets (type, subject, place, person, era, mood, use)
//   INDEX.md      the same, as a readable list grouped by kind
//   CREDITS.md    who made what and under which licence; the credit lines CC BY items need
//   index.html    a gallery with a search box (open it from disk; no server needed)
// Safe to rerun; it overwrites those four files. Run after build-made.mjs and import-real.py:
//   node assets/library/tools/build-catalog.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LIB = join(dirname(fileURLToPath(import.meta.url)), "..");
const made = JSON.parse(readFileSync(join(LIB, "made", "manifest.json"), "utf8")).items;
const real = existsSync(join(LIB, "real", "sources.json")) ? JSON.parse(readFileSync(join(LIB, "real", "sources.json"), "utf8")) : { items: [], skipped: [] };

// ---- vocabularies the facets are drawn from (a tag or title word that matches puts the item under that value) ----
const PLACES = {
  Syracuse: ["syracuse", "siracusa", "syracusae", "ortygia", "epipolae", "euryalus", "great harbour", "neapolis", "arethusa", "ear of dionysius", "latomiae", "latomie", "olympieion", "plemmyrium"],
  Ortygia: ["ortygia"], Epipolae: ["epipolae", "euryalus"], Carthage: ["carthage", "carthago", "byrsa", "cothon", "punic ports", "tophet"],
  Motya: ["motya", "mozia"], Akragas: ["akragas", "agrigento", "agrigentum", "concordia"], Selinus: ["selinus", "selinunte", "selinon"],
  Segesta: ["segesta"], Himera: ["himera"], Gela: ["gela"], Kamarina: ["kamarina", "camarina"], Leontini: ["leontini"], Catana: ["catana"],
  Messana: ["messana", "messina"], Naxos: ["naxos"], Rhegium: ["rhegium"], Locri: ["locri", "doris of locri"], Croton: ["croton"],
  Lilybaeum: ["lilybaeum", "lilybaion"], Eryx: ["eryx"], Panormus: ["panormus"], Etna: ["etna", "aetna"], Corinth: ["corinth", "koppa"],
  Sparta: ["sparta", "lacedaemon"], Athens: ["athens"], Delphi: ["delphi"], Tyre: ["tyre"], Sidon: ["sidon"], Byblos: ["byblos"], Arwad: ["arwad"],
  Sicily: ["sicily", "sicilian", "siculo", "triskeles"], Italy: ["italy", "magna graecia"], Africa: ["africa", "numidia", "libya", "zama"],
  Spain: ["spain", "ibiza", "ebusus", "huelva", "falcata"], Phoenicia: ["phoenicia", "lebanon", "homeland"], Mediterranean: ["mediterranean", "sea lanes"],
};
const PEOPLE = {
  "Dionysius I": ["dionysius", "dionysius i", "dionysius the poet"], Leptines: ["leptines"], Thearides: ["thearides"], Polyxenus: ["polyxenus"],
  Heloris: ["heloris"], "Doris of Locri": ["doris"], Andron: ["andron"], Philistus: ["philistus"], Hipparinus: ["hipparinus"], Aristomache: ["aristomache"],
  Dion: ["dion"], Theodorus: ["theodorus"], "Aristides of Locri": ["aristides"], "Nicoteles of Corinth": ["nicoteles"], "Damon the smith": ["damon"],
  "Aristotle the Spartan": ["aristotle the spartan"], "Archylus of Thurii": ["archylus"], "Biton of Syracuse": ["biton"], Himilcon: ["himilcon"],
  Magon: ["magon"], Damocles: ["damocles"], Plato: ["plato"], Archimedes: ["archimedes"], Hannibal: ["hannibal"], Hasdrubal: ["hasdrubal"],
  Massinissa: ["massinissa"], Herodotus: ["herodotus"], "Aristotle (philosopher)": ["aristotle.jpg", "real-aristotle"], "Hieron II": ["hieron"],
  Timoleon: ["timoleon"], Agathokles: ["agathokles"], Pyrrhus: ["pyrrhus"], Kimon: ["kimon"], Euainetos: ["euainetos"], Eukleidas: ["eukleidas"],
};
const GODS = {
  Tanit: ["tanit"], "Baal Hammon": ["baal hammon", "hammon", "baal"], Melqart: ["melqart", "rash melqart"], Astarte: ["astarte", "ashtart"], Eshmun: ["eshmun"],
  Arethusa: ["arethusa", "arethousa"], Apollo: ["apollo"], Zeus: ["zeus"], Athena: ["athena"], Demeter: ["demeter"], Dionysus: ["dionysus", "dionysos"],
  Poseidon: ["poseidon"], Herakles: ["herakles"], Nike: ["nike"],
};
const MOODS = {
  danger: ["danger", "sword", "damocles", "threat", "plot", "conspiracy", "poison", "murder", "arrest", "assault", "siege", "warning", "night attack", "invasion", "storm"],
  triumph: ["victory", "triumph", "trophy", "battle won", "prize", "laurel", "games", "liberation", "taenia"],
  grief: ["death", "funeral", "mourning", "loss", "grave", "epitaph", "plague", "famine", "hunger", "after the sack", "memorial"],
  intrigue: ["intrigue", "secret", "secrets", "spies", "eavesdropping", "bribe", "rumour", "informer", "secret note", "spy report", "whisper", "denunciation", "forgery"],
  sacred: ["gods", "religion", "sacrifice", "oracle", "omen", "temple", "altar", "votive", "prophecy", "tophet", "stele"],
  festive: ["feast", "symposium", "banquet", "wine", "theatre", "festival", "wedding", "comedy", "plays", "ivy", "kottabos"],
  power: ["ruler", "kingship", "tyranny", "tyrant", "throne", "citadel", "power", "crown", "authority", "decree", "law"],
  calm: ["harvest", "spring", "summer", "vineyard", "farm", "peace", "treaty", "countryside", "landscape", "grain", "dawn"],
  war: ["war", "battle", "army", "hoplite", "hoplites", "warship", "naval battle", "helmet", "armour", "weapons", "catapult", "artillery", "mercenaries", "campaign"],
};
const USE = {
  icon: "small icon (16 to 48 px) on buttons, ledgers and labels", sprite: "every icon at once, for <use href>", event: "event picture (red-figure tondo) on an event card",
  coin: "coin or token: money, factions, offices, seals", medallion: "portrait of a cast member (coin medallion)", map: "map: background, overview or a page of its own",
  ornament: "frame, divider, corner or plaque around text", pattern: "repeating border or background (CSS background)", texture: "surface texture behind panels (CSS background)",
  real: "real ancient object or old print: reference, a museum panel, a credits page",
};

const words = (it) => [...(it.tags ?? []), it.title ?? "", it.id ?? "", it.note ?? "", it.file ?? "", ...(it.people ?? []), it.place ?? ""].join(" | ").toLowerCase();
const has = (w, term) => new RegExp(`(^|[^a-z])${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`).test(w);
const facet = (w, vocab) => Object.entries(vocab).filter(([, terms]) => terms.some((t) => has(w, t))).map(([k]) => k);

function era(it) {
  if (it.origin === "made") return it.type === "map" ? "today's coastline, ancient sites" : ["event", "medallion", "coin"].includes(it.type) ? "drawn for the game's years (c. 405-367 BC)" : "timeless (icons and ornament)";
  const text = `${it.date ?? ""} ${it.title ?? ""} ${(it.tags ?? []).join(" ")}`;
  const ad = [...text.matchAll(/\b(1[5-9]\d\d|20\d\d)\b/g)].map((m) => +m[1]).filter((y) => y < 2030);
  const bc = [...text.matchAll(/(\d{2,4})\s*(?:-\s*\d{2,4}\s*)?(?:BC|ac|av\. j\.-c\.)/gi)].map((m) => +m[1]);
  if (/photo|ruins|site|aerial|excavations?|walls|fortress|cothon-motya/.test(text.toLowerCase()) && !bc.length && !ad.length) return "photo of a site or object today";
  if (bc.length) { const y = Math.max(...bc); return y > 600 ? "Phoenician homeland and early colonies (before 600 BC)" : y > 323 ? "archaic and classical (600-323 BC)" : "Hellenistic and Punic Wars (323-146 BC)"; }
  if (ad.length) return "modern print, painting or drawing (after 1500)";
  return "date not stated";
}

const items = [];
for (const m of made) {
  if (m.file.endsWith("manifest.json")) continue;
  const base = { origin: "made", ...m, thumb: m.file, licence: "Drawn for this project (same terms as the game)", attribution_required: false };
  items.push(base);
}
for (const r of real.items) {
  items.push({ origin: "real", type: "real", set: r.status, ...r, file: r.file ?? null });
}
for (const it of items) {
  const w = words(it);
  // Real items may carry a free-text place and people from the Commons check; keep those as notes, facet on the vocabularies.
  if (it.origin === "real") {
    if (it.place) it.place_note = it.place;
    if (it.people?.length) it.people_note = it.people.join("; ");
  }
  it.place = facet(w, PLACES);
  it.people = facet(w, PEOPLE);
  it.gods = facet(w, GODS);
  it.mood = facet(w, MOODS);
  it.era = era(it);
  it.use_for = USE[it.type] ?? USE.real;
  it.tags = [...new Set((it.tags ?? []).map((t) => String(t).toLowerCase()))];
}
items.sort((a, b) => (a.origin === b.origin ? 0 : a.origin === "made" ? -1 : 1) || a.type.localeCompare(b.type) || a.id.localeCompare(b.id));

const count = (key) => { const c = {}; for (const it of items) for (const v of [].concat(it[key] ?? [])) c[v] = (c[v] ?? 0) + 1; return Object.fromEntries(Object.entries(c).sort((a, b) => b[1] - a[1])); };
const bytes = items.reduce((n, it) => n + (it.bytes ?? 0), 0);
const catalog = {
  about: "The Sword of Damocles art library: drawn art in the game's own style plus real ancient art under open licences. One record per item. " +
    "Search with jq (see README.md). Facets place, people, gods, mood and era are worked out from tags and titles by tools/build-catalog.mjs, so treat them as a finding aid, not as facts.",
  counts: { items: items.length, by_type: count("type"), by_origin: count("origin"), real_by_status: Object.fromEntries(["copied", "fetched", "link-only"].map((k) => [k, items.filter((i) => i.origin === "real" && i.status === k).length])) },
  facets: { place: count("place"), people: count("people"), gods: count("gods"), mood: count("mood"), era: count("era") },
  items,
};
writeFileSync(join(LIB, "catalog.json"), JSON.stringify(catalog, null, 1) + "\n");

// ---- INDEX.md ----
const TITLES = { icon: "Icons", sprite: "Icon sprite", event: "Event pictures", coin: "Coins, tokens and seals", medallion: "Cast medallions", map: "Maps", ornament: "Frames, dividers and ornament", pattern: "Patterns (tiles)", texture: "Textures (tiles)", real: "Real art" };
let md = `# Art library index\n\nEvery item in the library, grouped by kind. Built by tools/build-catalog.mjs from made/manifest.json and real/sources.json; do not edit by hand. ` +
  `${items.length} items. Search catalog.json for anything finer (README.md has examples).\n`;
for (const t of Object.keys(TITLES)) {
  const group = items.filter((i) => i.type === t);
  if (!group.length) continue;
  md += `\n## ${TITLES[t]} (${group.length})\n\n`;
  for (const i of group) {
    const where = i.file ? `[${i.file.split("/").pop()}](${i.file})` : `[Commons page](${i.commons_page}) (not downloaded yet)`;
    const bits = [i.set && i.origin === "made" ? i.set : null, i.licence && i.origin === "real" ? i.licence : null, i.place?.length ? i.place.slice(0, 3).join(", ") : null].filter(Boolean).join("; ");
    md += `- **${String(i.title).replace(/\|/g, "/")}**: ${where}${bits ? ` (${bits})` : ""}${i.tags?.length ? `. ${i.tags.slice(0, 8).join(", ")}` : ""}\n`;
  }
}
writeFileSync(join(LIB, "INDEX.md"), md);

// ---- CREDITS.md ----
let cr = `# Credits\n\n## Drawn for this library\n\nEverything under made/ was drawn for this project in code (tools/), in the game's own styles. ` +
  `Those files are the project's own, on the same terms as the game. The maps are built on open data:\n\n` +
  `- Coastlines and rivers: [Natural Earth](https://www.naturalearthdata.com/), public domain.\n` +
  `- Ancient site positions: [Pleiades](https://pleiades.stoa.org/), CC BY 3.0. Credit line on every map that uses it: "Sites: Pleiades, CC BY 3.0."\n` +
  `- Syracuse coast and cliffs: [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, ODbL. Keep the line "(c) OpenStreetMap contributors, ODbL" on the Syracuse map or wherever it is shown.\n\n` +
  `The data came by way of the phoenician-punic-world project's prepared files (tools/prep-data.mjs).\n\n## Real art copied here\n\n` +
  `Public domain and CC0 items need no credit, but giving one is good manners. CC BY items must be credited as shown. Licences were read off the Wikimedia Commons pages by the phoenician-punic-world project; the Commons page is the authority.\n\n` +
  `| File | Licence | Credit line | Commons page |\n|---|---|---|---|\n`;
for (const r of real.items.filter((r) => r.status !== "link-only")) cr += `| ${r.file} | ${r.licence} | ${String(r.attribution).replace(/\|/g, "/")} | ${r.commons_page} |\n`;
cr += `\n## Real art listed, not yet downloaded\n\nLicence read off each Commons File page on 2026-11-26. Run tools/fetch-real.mjs on a machine that can reach Wikimedia; it checks the licence again before it downloads.\n\n| Item | Licence | Credit line | Commons page |\n|---|---|---|---|\n`;
for (const r of real.items.filter((r) => r.status === "link-only")) cr += `| ${String(r.title).replace(/\|/g, "/").slice(0, 90)} | ${r.licence} | ${String(r.attribution ?? "").replace(/\|/g, "/")} | ${r.commons_page} |\n`;
cr += `\n## Left out\n\n${real.skipped.length} files were looked at and left out: share-alike, non-commercial or no-derivatives licences, licences outside public domain, CC0 and CC BY, or not art. Each is in real/sources.json under "skipped" with the reason. The notable ones:\n\n`;
const notable = real.skipped.filter((s) => !/^share-alike \(CC BY-SA\)/.test(s.why) || /sicily|syracuse|motya|selinunte|coin|tetradrachm|drachm/i.test(s.title ?? ""));
for (const s of notable.slice(0, 30)) cr += `- ${String(s.title).replace(/\|/g, "/").slice(0, 100)}: ${s.why}\n`;
if (real.gaps) cr += `\n## Not found yet\n\n${real.gaps}\n`;
writeFileSync(join(LIB, "CREDITS.md"), cr);

// ---- index.html: a gallery that works straight from disk ----
const slim = items.map((i) => ({ id: i.id, t: i.type, n: i.title, f: i.file, th: i.thumb ?? i.file, p: i.commons_page, l: i.origin === "real" ? i.licence : "", s: i.set ?? "",
  k: [i.tags, i.place, i.people, i.gods, i.mood, i.era].flat().filter(Boolean).join(" ").toLowerCase(), tile: i.tile ?? null }));
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Art library: The Sword of Damocles</title><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;background:#efe4c8;color:#2b1d12;font:15px/1.4 Georgia,serif}header{position:sticky;top:0;background:#e6d7b0;padding:10px 16px;border-bottom:1px solid #c9b78a;display:flex;gap:10px;flex-wrap:wrap;align-items:center;z-index:2}
h1{font-size:18px;margin:0 12px 0 0;letter-spacing:.04em}input,select{font:inherit;padding:4px 8px;border:1px solid #c9b78a;background:#efe4c8}#n{color:#5a4733}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;padding:16px}figure{margin:0;border:1px solid #c9b78a;background:#f4ecd6;padding:8px;display:flex;flex-direction:column}
.pic{height:130px;display:flex;align-items:center;justify-content:center;background-repeat:repeat}.pic img{max-width:100%;max-height:130px}figcaption{font-size:12px;margin-top:6px;word-break:break-word}
figcaption b{display:block;font-weight:normal;color:#2b1d12}figcaption span{color:#5a4733}a{color:#7a5424}.none{color:#5a4733;font-style:italic;font-size:12px;text-align:center;padding:6px}</style></head>
<body><header><h1>Art library</h1><input id="q" placeholder="Search: syracuse, danger, coin, Dion..." size="34" autofocus><select id="t"><option value="">every kind</option></select><span id="n"></span></header><main id="g"></main>
<script>const D=${JSON.stringify(slim)};
const t=document.getElementById("t"),q=document.getElementById("q"),g=document.getElementById("g"),n=document.getElementById("n");
[...new Set(D.map(d=>d.t))].forEach(x=>{const o=document.createElement("option");o.value=o.textContent=x;t.append(o)});
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
function show(){const words=q.value.toLowerCase().split(/\\s+/).filter(Boolean),k=t.value;
const hits=D.filter(d=>(!k||d.t===k)&&words.every(w=>(d.k+" "+d.n+" "+d.id).toLowerCase().includes(w)));n.textContent=hits.length+" of "+D.length;
g.innerHTML=hits.map(d=>{const pic=!d.f?'<div class="none">not downloaded yet<br><a href="'+esc(d.p)+'">Commons page</a></div>':d.tile?'<div class="pic" style="background-image:url('+esc(d.f)+');background-size:'+(d.tile[0]*(d.tile[0]<40?3:1))+'px"></div>':'<div class="pic"><img loading="lazy" src="'+esc(d.th)+'" alt=""></div>';
return '<figure>'+pic+'<figcaption><b>'+esc(d.n)+'</b><span>'+esc(d.t)+(d.s?" · "+esc(d.s):"")+(d.l?" · "+esc(d.l):"")+'</span><br>'+(d.f?'<a href="'+esc(d.f)+'">'+esc(d.f.split("/").pop())+'</a>':"")+'</figcaption></figure>'}).join("")}
q.oninput=t.onchange=show;show();</script></body></html>
`;
writeFileSync(join(LIB, "index.html"), html);
console.log(`catalog.json: ${items.length} items`, catalog.counts.by_type, `${(bytes / 1024).toFixed(0)} KB of drawn files`);
