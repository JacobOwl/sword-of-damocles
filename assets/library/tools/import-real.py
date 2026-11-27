"""Builds assets/library/real/: real ancient art and old prints under open licences, with their sources.

Two kinds of item go into real/sources.json:
  copied     image files already fetched from Wikimedia Commons by the phoenician-punic-world project, whose
             licence that project read off each Commons page (its images/CREDITS.md). Only public domain, CC0 and
             CC BY files are copied; resized to at most 1600 px with a 320 px thumbnail.
  link-only  Commons files whose licence was read off the File page on 2026-11-26 (tools/data/commons-checked.json)
             but not downloaded, because the build machine could not reach Wikimedia. tools/fetch-real.mjs fetches them.
Everything else (share-alike, non-commercial, no-derivatives, other or unclear licences) goes in "skipped" with the reason.

Safe to rerun; it rewrites real/ from the same inputs. Needs Python 3 and Pillow.
Run from the repo root:  python3 assets/library/tools/import-real.py [path/to/phoenician-punic-world]
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image

LIB = Path(__file__).resolve().parent.parent
ROOT = LIB.parent.parent
PPW = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "phoenician-punic-world"
OUT = LIB / "real"
MAX, THUMB = 1600, 320

# What each file-name prefix in the PPW collection is about, for search.
PREFIX = {
    "gods": ["gods", "religion", "punic"], "war": ["war", "army", "weapons"], "tyre": ["tyre", "phoenicia", "homeland"],
    "sicily": ["sicily", "places"], "spain": ["spain", "barcids"], "siege": ["carthage", "siege", "146 bc"],
    "homeland": ["phoenicia", "homeland", "lebanon"], "trade": ["trade", "crafts"], "africa": ["punic west"],
    "hannibal": ["hannibal", "barcids", "second punic war"], "coin": ["coin", "money", "punic"], "carthage": ["carthage", "places"],
}
# Plain titles for files whose source list gives only the Commons file name (taken from that name, nothing added).
DESC = {
    "gods-tanit-stele-louvre": "Punic stele with a sign of Tanit, Louvre AO 23068",
    "gods-tanit-baal-hammon-stele": "Punic stele dedicated to Tanit and Baal Hammon, with a flower and a caduceus, Louvre AO 23120",
    "gods-baal-thinissut-bardo": "Baal from Thinissut, Bardo Museum",
    "gods-melqart-tyre-coin": "Silver coin of Tyre, Melqart and dolphin, 347-346 BC, BnF",
    "gods-ashtart-throne": "Throne of Ashtart",
    "gods-stele-ship-rudder": "Punic stele carved with a ship's rudder, Louvre AO 23043",
    "war-cothon-carthage-print": "The cothon of Carthage seen from the old citadel of Byrsa, print",
    "war-tanit-horse-tetradrachm": "Carthage tetradrachm, Tanit and horse, serrated edge, about 200 BC",
    "war-dekadrachm-tanit": "Dekadrachm of Carthage, goddess Tanit, about 260 BC, National Museum of American History",
    "tyre-al-mina-site": "Al Mina site, Tyre, Lebanon",
    "sicily-selinunte-temple-c-air": "Selinunte, Temple C from the air",
    "sicily-motya-walls": "Walls of Motya (Mozia)",
    "siege-byrsa-excavations-beule": "Byrsa, Beule's excavations (19th-century plate), Carthage",
    "war-montefortino-helmet-met": "Helmet of the Montefortino type, Metropolitan Museum",
    "war-montefortino-helmet-2": "Helmet of the Montefortino type",
    "war-falcata-met": "Knife (falcata), Metropolitan Museum 32.75.260",
    "homeland-ahiram-sarcophagus": "Sarcophagus of Ahiram from Byblos, photo published 1936",
    "homeland-byblos-ruins": "Ancient ruins of Byblos, Lebanon",
    "homeland-arwad-fortress": "Courtyard of the fortress of Arwad",
    "trade-nimrud-ivory-sphinx": "Phoenician-style Nimrud ivory of two sphinxes flanking a cartouche",
    "africa-massinissa-coin": "Coin of Massinissa (CNG)",
    "africa-ibiza-tanit-terracotta": "Terracotta from Puig des Molins, Ibiza",
    "hannibal-zama-battleplan": "Battle of Zama, battle plan (modern drawing)",
    "hannibal-hasdrubal-coin": "Hasdrubal coin",
    "gods-eshmun-votive-head": "Votive statue, Eshmun",
    "gods-melqart-huelva": "Male god, Reshef-Melqart, Museo de Huelva",
    "gods-astarte-cyprus-throne": "Phoenician goddess (Astarte) on a throne, Kunsthistorisches Museum, Vienna",
    "gods-baal-shamem-palmyra": "Statue of Baalshamin",
}
# Files left out on purpose even though their licence would allow them.
LEAVE_OUT = {
    "walbank.jpg": "photo of a modern historian, not art; a living or recent person's likeness",
    "quinn.jpg": "video still of a living historian, not art; a living person's likeness",
}


def licence_of(credit):
    """The licence named at the end of a CREDITS.md credit cell, or (None, reason) when it may not be used."""
    c = credit.lower()
    if re.search(r"by-sa|share.?alike", c):
        return None, "share-alike (CC BY-SA): its terms would bind the game, so left out"
    if re.search(r"\bnc\b|non-?commercial|\bnd\b|no-?deriv", c):
        return None, "non-commercial or no-derivatives licence"
    if "licence ouverte" in c or "license ouverte" in c:
        return None, "French Licence Ouverte: open, but not one of the licences this library takes (PD, CC0, CC BY)"
    if "cc0" in c:
        return "CC0", None
    if "public domain" in c:
        return "Public domain", None
    m = re.search(r"cc by (\d\.\d)", c)
    if m:
        return f"CC BY {m.group(1)}", None
    return None, "licence not stated clearly"


def author_of(credit):
    m = re.search(r"public domain", credit, re.I)
    if m and m.start() > 0 and "falsefalse" in credit:  # a Commons template pasted into the credit cell
        credit = credit[: m.start()]
    a = re.sub(r",?\s*(cc0|public domain|cc by[^,]*|cc by-sa[^,]*)(\s*\(.*\))?\s*$", "", credit, flags=re.I).strip(" ,")
    a = re.sub(r"(Unknown author)+", "Unknown author", a)
    return a or "not recorded"


def tables(md):
    """Every table row of images/CREDITS.md as (section heading, cells)."""
    section = ""
    for line in md.splitlines():
        if line.startswith("#"):
            section = line.strip("# ").strip()
        elif line.startswith("|") and not re.match(r"^\|\s*-", line):
            cells = [x.strip() for x in line.strip().strip("|").split("|")]
            if len(cells) >= 4 and re.search(r"\.(jpe?g|png)$", cells[0], re.I):
                yield section, cells


def find(name):
    for base in ("images/evidence", "images/art-library", "site/assets/portraits", "site/assets/evidence"):
        p = PPW / base / name
        if p.exists():
            return p
    return None


def save(src, stem):
    im = Image.open(src)
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") and src.suffix.lower() == ".png" else "RGB")
    im.thumbnail((MAX, MAX))
    ext = ".png" if im.mode == "RGBA" else ".jpg"
    full = OUT / "images" / f"{stem}{ext}"
    full.parent.mkdir(parents=True, exist_ok=True)
    im.save(full, **({"optimize": True} if ext == ".png" else {"quality": 86, "optimize": True, "progressive": True}))
    th = im.copy()
    th.thumbnail((THUMB, THUMB))
    tpath = OUT / "thumbs" / f"{stem}.jpg"
    tpath.parent.mkdir(parents=True, exist_ok=True)
    if th.mode == "RGBA":
        bg = Image.new("RGB", th.size, (239, 228, 200))
        bg.paste(th, mask=th.split()[3])
        th = bg
    th.save(tpath, quality=82, optimize=True)
    return full, tpath, im.size


def main():
    credits = (PPW / "images/CREDITS.md").read_text(encoding="utf-8", errors="replace")
    items, skipped, seen = [], [], set()
    # Keep what tools/fetch-real.mjs already downloaded, so a rerun here doesn't undo it.
    before = {}
    if (OUT / "sources.json").exists():
        for it in json.loads((OUT / "sources.json").read_text(encoding="utf-8"))["items"]:
            if it.get("status") == "fetched" and it.get("file") and (LIB / it["file"]).exists():
                before[it["id"]] = it
    for section, cells in tables(credits):
        name, what, credit, page = cells[0], cells[1], cells[2], cells[3]
        if name in seen:
            continue
        seen.add(name)
        lic, why = licence_of(credit)
        stem = Path(name).stem
        mojibake = "�" in page or "?" in page.split("File:", 1)[-1]
        row = {"id": f"real-{stem}", "title": DESC.get(stem) or (what if not what.lower().endswith((".jpg", ".png", ".jpeg")) else Path(what).stem),
               "commons_page": page, "credit_as_recorded": credit}
        if name in LEAVE_OUT:
            skipped.append({**row, "why": LEAVE_OUT[name]})
            continue
        if not lic:
            skipped.append({**row, "why": why})
            continue
        src = find(name)
        if not src:
            skipped.append({**row, "why": f"{lic}, but the file is not in the phoenician-punic-world checkout"})
            continue
        full, thumb, size = save(src, stem)
        pre = stem.split("-")[0]
        doubts = []
        if "\ufffd" in credit or "\ufffd" in what:
            doubts.append("Some accented letters in the recorded title or author were lost (shown as ?); check the Commons page.")
            row["title"] = row["title"].replace("\ufffd", "?")
        if mojibake:
            doubts.append("The Commons address in the source list has broken accented letters; search Commons for the title to reach the page.")
        if "zama" in stem or "route-map" in stem:
            doubts.append("A modern reconstruction drawing, not ancient evidence.")
        if "capua" in stem:
            doubts.append("The bust's identification as Hannibal is doubtful.")
        if "(per commons)" in credit.lower() or "author not recorded" in credit.lower():
            doubts.append("Author or licence taken from the Commons page as recorded, without more checking.")
        lic_url = {"CC0": "https://creativecommons.org/publicdomain/zero/1.0/"}.get(lic) or \
            (f"https://creativecommons.org/licenses/by/{lic.split()[-1]}/" if lic.startswith("CC BY") else None)
        author = author_of(credit).replace("\ufffd", "?")
        attribution = f"{row['title']}. {author}, {lic}, via Wikimedia Commons" if lic.startswith("CC BY") else f"{row['title']}. {lic}, via Wikimedia Commons"
        items.append({
            **row, "status": "copied", "file": str(full.relative_to(LIB)), "thumb": str(thumb.relative_to(LIB)), "size": list(size),
            "licence": lic, "licence_url": lic_url, "author": author, "attribution": attribution,
            "attribution_required": lic.startswith("CC BY"), "copied_from": f"phoenician-punic-world/{src.relative_to(PPW)}",
            "tags": PREFIX.get(pre, []) + [w for w in re.findall(r"[a-z]+", stem.lower()) if len(w) > 3 and w not in PREFIX],
            "doubts": doubts, "list": section,
        })
    checked = json.loads((LIB / "tools/data/commons-checked.json").read_text())
    for v in checked["verified"]:
        stem = re.sub(r"[^a-z0-9]+", "-", v["commons_title"][5:].rsplit(".", 1)[0].lower()).strip("-")[:70]
        lic = v["licence"]
        items.append({
            "id": f"real-{stem}", "title": v.get("object") or v["commons_title"][5:], "status": "link-only", "file": None, "thumb": None,
            "commons_page": v["page_url"], "original_url": v["original_url"], "size": [v.get("width"), v.get("height")],
            "licence": lic, "author": v.get("author"), "institution": v.get("institution"), "accession": v.get("accession"),
            "attribution": v.get("attribution"), "attribution_required": "CC BY" in lic and "CC0" not in lic,
            "date": v.get("date"), "place": v.get("place"), "people": v.get("people", []), "kind": v.get("kind"),
            "tags": v.get("tags", []), "doubts": [v["doubt"]] if v.get("doubt") else [], "list": f"checked 2026-11-26 ({v['group']})",
        })
    items = [before.get(i["id"], i) if i["status"] == "link-only" else i for i in items]
    for s in checked["skipped"]:
        skipped.append({"id": None, "title": s["commons_title"][5:], "commons_page": s["page_url"], "credit_as_recorded": s.get("licence"), "why": s["why"]})
    OUT.mkdir(parents=True, exist_ok=True)
    doc = {
        "note": "Real ancient art and old prints under open licences. 'copied' items have a file here; 'link-only' items are "
                "listed with their checked licence and are fetched by tools/fetch-real.mjs. Credit every CC BY item as its "
                "'attribution' says. 'skipped' lists files left out and why. Built by tools/import-real.py; do not edit by hand.",
        "licences_taken": ["Public domain", "CC0", "CC BY (any version)"],
        "count": {"copied": sum(i["status"] == "copied" for i in items), "fetched": sum(i["status"] == "fetched" for i in items),
                  "link_only": sum(i["status"] == "link-only" for i in items), "skipped": len(skipped)},
        "gaps": checked.get("gaps"),
        "items": items, "skipped": skipped,
    }
    (OUT / "sources.json").write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("real/:", doc["count"])


if __name__ == "__main__":
    main()
