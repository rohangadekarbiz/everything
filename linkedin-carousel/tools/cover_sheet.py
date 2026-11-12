"""Labelled sheet of covers (or any one slide per id).
Usage: python3 tools/cover_sheet.py out.png [--cols N] [--w 300] [--dir out] id[:slide][=label] ...
A cell is `id` (slide 1), `id:last`, or `id:3`; `=label` overrides the caption. `--dir` reads from another render folder."""
import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
args = sys.argv[1:]
out = args.pop(0)
cols, tw, base = 6, 300, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "out")
cells = []
while args:
    a = args.pop(0)
    if a == "--cols": cols = int(args.pop(0))
    elif a == "--w": tw = int(args.pop(0))
    elif a == "--dir": base = args.pop(0)
    else:
        spec, _, label = a.partition("=")
        cid, _, n = spec.partition(":")
        files = sorted(glob.glob(os.path.join(base, cid, "slide-*.png")))
        f = files[-1] if n == "last" else files[int(n) - 1 if n else 0]
        cells.append((f, label or (cid + (" (end)" if n == "last" else ""))))
th, G, LH = round(tw * 1350 / 1080), 14, 26
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
rows = -(-len(cells) // cols)
sheet = Image.new("RGB", (cols * (tw + G) + G, rows * (th + LH + G) + G), (34, 34, 34))
d = ImageDraw.Draw(sheet)
for i, (f, label) in enumerate(cells):
    x, y = G + (i % cols) * (tw + G), G + (i // cols) * (th + LH + G)
    d.text((x, y + 4), label, font=font, fill=(235, 235, 235))
    sheet.paste(Image.open(f).convert("RGB").resize((tw, th), Image.LANCZOS), (x, y + LH))
sheet.save(out); print("wrote", out, sheet.size)
