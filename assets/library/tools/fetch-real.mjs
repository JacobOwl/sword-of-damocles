// Downloads the "link-only" real art listed in assets/library/real/sources.json, on a machine that can reach
// Wikimedia Commons. For each file it first asks the Commons API for the licence on the File page now, and only
// downloads when that is public domain, CC0 or CC BY (no share-alike, non-commercial or no-derivatives). It saves a
// copy at most 1600 px wide (Commons makes the resized copy) and a 320 px thumbnail, then marks the item "fetched".
// Safe to rerun: it skips files already fetched and changes nothing for a file whose licence no longer qualifies.
// Run from the repo root:  node assets/library/tools/fetch-real.mjs            (add --dry to only check licences)
// Then rebuild the catalog:  node assets/library/tools/build-catalog.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LIB = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(LIB, "real", "sources.json");
const DRY = process.argv.includes("--dry");
// Wikimedia asks scripts to name themselves. Add your own contact (a web page or e-mail) at the end if you like.
const UA = "sword-of-damocles-art-library/1.0 (one-off licence check and download of a few dozen files)";
const API = "https://commons.wikimedia.org/w/api.php";

const plain = (s = "") => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
function allowed(short = "", usage = "") {
  const s = `${short} ${usage}`.toLowerCase();
  if (/by-sa|share.?alike|\bnc\b|non-?commercial|\bnd\b|no-?deriv|gfdl/.test(s)) return false;
  return /public domain|^pd|\bpd\b|cc0|cc[- ]by(?![- ]sa)/.test(s);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function info(title, width) {
  const q = new URLSearchParams({ action: "query", format: "json", formatversion: "2", titles: title, prop: "imageinfo", iiprop: "url|size|extmetadata|mime", iiurlwidth: String(width) });
  const res = await fetch(`${API}?${q}`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Commons API answered ${res.status}`);
  const page = (await res.json()).query?.pages?.[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) throw new Error("no such file on Commons");
  return ii;
}
async function save(url, path) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download answered ${res.status}`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
}

const doc = JSON.parse(readFileSync(SRC, "utf8"));
const today = new Date().toISOString().slice(0, 10);
let got = 0, refused = 0, failed = 0;
for (const it of doc.items) {
  if (it.status !== "link-only") continue;
  const title = decodeURIComponent(it.commons_page.split("/wiki/")[1]).replace(/_/g, " ");
  const stem = it.id.replace(/^real-/, "");
  try {
    const big = await info(title, 1600);
    const m = big.extmetadata ?? {};
    const short = plain(m.LicenseShortName?.value), usage = plain(m.UsageTerms?.value);
    if (!allowed(short, usage)) {
      refused++;
      console.log(`LEFT OUT  ${title}\n          licence on Commons now: ${short || usage || "none stated"}`);
      continue;
    }
    if (DRY) { console.log(`OK        ${title}  (${short})`); continue; }
    const ext = /png/.test(big.mime) ? ".png" : ".jpg";
    const file = join("real", "images", `${stem}${ext}`), thumb = join("real", "thumbs", `${stem}.jpg`);
    if (!existsSync(join(LIB, file))) await save(big.thumburl ?? big.url, join(LIB, file));
    await sleep(500);
    const small = await info(title, 320);
    if (!existsSync(join(LIB, thumb))) await save(small.thumburl, join(LIB, thumb));
    Object.assign(it, {
      status: "fetched", file, thumb, size: [big.thumbwidth ?? big.width, big.thumbheight ?? big.height],
      licence_on_commons: short, licence_checked: today, artist_on_commons: plain(m.Artist?.value) || undefined,
    });
    got++;
    console.log(`FETCHED   ${title}  (${short})`);
  } catch (e) {
    failed++;
    console.log(`FAILED    ${title}: ${e.message}`);
  }
  await sleep(800); // be gentle with Commons
}
if (!DRY) writeFileSync(SRC, JSON.stringify(doc, null, 1) + "\n");
console.log(`\n${got} fetched, ${refused} left out for their licence, ${failed} failed.${DRY ? " (dry run: nothing saved)" : ""}`);
