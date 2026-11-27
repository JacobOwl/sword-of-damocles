"""Contact sheets for the art library: one PNG per kind of asset, in assets/library/preview/.

Safe to rerun; it overwrites the sheets. Needs Python 3 with cairosvg and Pillow (pip install cairosvg pillow).
Run from the repo root after the build scripts:  python3 assets/library/tools/preview.py [filter]
An optional filter (a substring of the file path) writes only a quick-look sheet, check.png, in the system temp folder.
"""
import io
import json
import sys
import tempfile
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw, ImageFont

LIB = Path(__file__).resolve().parent.parent
PAGE = (239, 228, 200)  # parchment, the game's --page
INK = (43, 29, 18)
RULE = (201, 183, 138)


def font(size):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", "/usr/share/fonts/truetype/crosextra/Caladea-Regular.ttf"):
        if Path(f).exists():
            return ImageFont.truetype(f, size)
    return ImageFont.load_default()


def render(path, w, h):
    if path.suffix == ".svg":
        png = cairosvg.svg2png(url=str(path), output_width=w, output_height=h)
        im = Image.open(io.BytesIO(png)).convert("RGBA")
    else:
        im = Image.open(path).convert("RGBA")
        im.thumbnail((w, h))
    return im


def tiled(path, tile, repeat, w, h):
    """A pattern tile repeated across the cell, as it would look on a page."""
    tw, th = tile
    k = max(1, min(4, int(48 / max(tw, th) * 1.5))) if max(tw, th) < 40 else 2
    if path.suffix == ".svg":
        t = Image.open(io.BytesIO(cairosvg.svg2png(url=str(path), output_width=tw * k, output_height=th * k))).convert("RGBA")
    else:
        t = Image.open(path).convert("RGBA")
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ys = range(0, h, t.height) if repeat == "both" else [(h - t.height) // 2]
    for y in ys:
        for x in range(0, w, t.width):
            im.alpha_composite(t, (x, y)) if x + t.width <= w and y + t.height <= h else im.paste(t, (x, y), t)
    return im


def sheet(entries, out, cell=(120, 120), cols=10, label=True, title=""):
    if not entries:
        return
    cw, ch = cell
    lab = 26 if label else 6
    rows = (len(entries) + cols - 1) // cols
    head = 44 if title else 0
    W, H = cols * (cw + 12) + 12, head + rows * (ch + lab + 12) + 12
    img = Image.new("RGB", (W, H), PAGE)
    d = ImageDraw.Draw(img)
    f, ft = font(11), font(20)
    if title:
        d.text((14, 12), title, fill=INK, font=ft)
    for i, e in enumerate(entries):
        r, c = divmod(i, cols)
        x, y = 12 + c * (cw + 12), head + 12 + r * (ch + lab + 12)
        try:
            if e.get("tile"):
                im = tiled(LIB / e["file"], e["tile"], e.get("repeat", "x"), cw, ch)
            else:
                im = render(LIB / e["file"], *e.get("render", cell))
        except Exception as ex:  # one broken file should not stop the sheet
            d.text((x, y), f"ERR {ex}"[:30], fill=(142, 42, 28), font=f)
            continue
        ox, oy = x + (cw - im.width) // 2, y + (ch - im.height) // 2
        img.paste(im, (ox, oy), im)
        d.rectangle([x - 1, y - 1, x + cw, y + ch], outline=RULE)
        if label:
            name = e.get("label") or Path(e["file"]).stem
            d.text((x, y + ch + 4), name[:int(cw / 6.6)], fill=INK, font=f)
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, optimize=True)
    print(f"{out.name}: {len(entries)} items, {W}x{H}")


def main():
    made = json.loads((LIB / "made/manifest.json").read_text())["items"]
    real_path = LIB / "real/sources.json"
    real = json.loads(real_path.read_text())["items"] if real_path.exists() else []
    pv = LIB / "preview"
    flt = sys.argv[1] if len(sys.argv) > 1 else None
    if flt:
        es = [e for e in made if flt in e["file"]]
        big = any(k in flt for k in ("maps", "ornament", "textures"))
        sheet(es, Path(tempfile.gettempdir()) / "check.png", cell=(300, 220) if big else (120, 120), cols=4 if big else 10, title=f"check: {flt}")
        return
    pick = lambda t, s=None: [e for e in made if e["type"] == t and (s is None or e.get("set") == s)]
    sheet(pick("icon", "game"), pv / "icons-game.png", cell=(72, 72), cols=10, title="Icons already in the game (29)")
    sheet(pick("icon", "new"), pv / "icons-new.png", cell=(72, 72), cols=10, title=f"New icons ({len(pick('icon', 'new'))})")
    sheet(pick("event", "game"), pv / "events-game.png", cell=(120, 120), cols=8, title="Event pictures already in the game")
    sheet(pick("event", "new"), pv / "events-new.png", cell=(120, 120), cols=8, title=f"New event pictures ({len(pick('event', 'new'))})")
    sheet(pick("coin"), pv / "coins.png", cell=(120, 120), cols=8, title="Coins and tokens")
    sheet(pick("medallion"), pv / "medallions.png", cell=(120, 120), cols=8, title="Cast medallions")
    sheet(pick("map"), pv / "maps.png", cell=(360, 260), cols=3, title="Maps")
    sheet(pick("ornament"), pv / "ornament.png", cell=(220, 140), cols=5, title="Frames, borders and ornament")
    sheet(pick("pattern") + pick("texture"), pv / "patterns.png", cell=(160, 160), cols=6, title="Patterns and textures")
    if real:
        es = [{"file": e["file"], "label": e["id"]} for e in real if e.get("file")]
        sheet(es, pv / "real.png", cell=(150, 150), cols=7, title=f"Real art copied into the library ({len(es)})")


if __name__ == "__main__":
    main()
