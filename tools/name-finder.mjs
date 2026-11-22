// Drafting helper (not part of the game): finds each candidate name in the saved ancient texts of the
// read-only phoenician-punic-world repo and proposes a short exact quote with its citation.
// Usage: node tools/name-finder.mjs ../phoenician-punic-world tools/name-candidates.json > /tmp/found.json
// Safe to rerun: same inputs give the same output. A person checks every proposal before it goes into data/names.json.
import fs from "node:fs";
import path from "node:path";

const [root, candFile] = process.argv.slice(2);
const cands = JSON.parse(fs.readFileSync(candFile, "utf8"));

// Files searched, in order of preference (closest to Sicily, 405 to 395 BC, first), with the author for the citation.
const FILES = [
  ["sources/diodorus/english/book14.loeb.txt", "Diodorus"],
  ["sources/diodorus/english/book14-78-96.txt", "Diodorus"],
  ["sources/diodorus/english/book13.loeb.txt", "Diodorus"],
  ["sources/diodorus/english/book14-1-18-97-117.loeb.txt", "Diodorus"],
  ["sources/diodorus/english/book13-1-42-91-96.loeb.txt", "Diodorus"],
  ["sources/diodorus/english/book11.loeb.txt", "Diodorus"],
  ["sources/diodorus/english/book11-73-92.loeb.txt", "Diodorus"],
  ["sources/diodorus/english/book11-38-72.loeb.txt", "Diodorus"],
  ["sources/diodorus/english/book12-sicily-bits.loeb.txt", "Diodorus"],
  ["sources/diodorus/english/book15.loeb.txt", "Diodorus"],
  ["sources/sicilian-wars/thucydides-6-7-7-87.crawley.txt", "Thucydides"],
  ["sources/sicily-tyrants/herodotus-7-153-167.godley.txt", "Herodotus"],
  ["sources/sicilian-wars/herodotus-7-165-166.godley.txt", "Herodotus"],
  ["sources/plutarch/dion.perrin.txt", "Plutarch, Dion"],
  ["sources/sicily-tyrants/plato-letters-7-8.bury.txt", "Plato, Letters"],
  ["sources/diodorus/english/book16.loeb.txt", "Diodorus"],
  ["sources/diodorus/english/book19.loeb.txt", "Diodorus"],
  ["sources/diodorus/english/book20.loeb.txt", "Diodorus"],
  ["sources/diodorus/english/book24.loeb.txt", "Diodorus"],
  ["sources/justin/justin-18.7-19.1.watson.txt", "Justin"],
  ["sources/justin/book22-23.watson.txt", "Justin"],
  ["sources/polybius/book1.shuckburgh.txt", "Polybius"],
  ["sources/livy/books23-29.foster.txt", "Livy"],
  ["sources/livy/books21-22.foster.txt", "Livy"],
];

function cite(author, line) {
  let m = line.match(/^Plutarch, Dion\|(\d+)\t/);
  if (m) return `Plutarch, Dion ${m[1]}`;
  m = line.match(/^\s*\[?(\d+(?:\.\d+)+)\]?\s/);
  if (m) return `${author} ${m[1]}`;
  return null;
}

function quoteAround(text, idx, len) {
  const words = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(text))) words.push({ s: m.index, e: m.index + m[0].length });
  const w = words.findIndex((x) => x.e > idx);
  const a = Math.max(0, w - 5), b = Math.min(words.length - 1, w + 6);
  let q = text.slice(words[a].s, words[b].e);
  // Justin's saved text has verse numbers and "L" markers inside lines; keep the quote clear of them.
  q = q.replace(/^(?:L\s+)/, "");
  const cut = q.search(/\s\d+\s/);
  if (cut > 0) q = q.slice(0, cut);
  q = q.replace(/^[^A-Za-z]+/, "").replace(/^L\s+/, "").replace(/[,;:.]+$/, "");
  return q;
}

const out = [];
for (const c of cands) {
  const re = new RegExp(`\\b${c.find ?? c.name}\\b`);
  const files = c.files ?? FILES.map((f) => f[0]);
  let hit = null;
  for (const [f, author] of FILES.filter((x) => files.includes(x[0]))) {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = re.exec(line);
      if (!m) continue;
      const ct = cite(author, line);
      if (!ct) continue;
      const body = line.replace(/^[^\t]*\t/, "");
      const i = body.search(re);
      if (i < 0) continue;
      if (c.near && !new RegExp(c.near, "i").test(body)) continue;
      hit = { cite: ct, quote: quoteAround(body, i, (c.find ?? c.name).length), file: f };
      break;
    }
    if (hit) break;
  }
  out.push({ ...c, ...(hit ?? { missing: true }) });
}
console.log(JSON.stringify(out, null, 1));
