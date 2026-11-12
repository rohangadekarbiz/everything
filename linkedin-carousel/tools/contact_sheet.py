"""Contact sheet of rendered carousels: one row per id. Usage: python3 tools/contact_sheet.py out/review.png id [id...]"""
import sys, glob, os
from PIL import Image
out, ids = sys.argv[1], sys.argv[2:]
here = os.path.join(os.path.dirname(__file__), "..", "out")
TW, TH, G = 432, 540, 16
rows = [[Image.open(f).convert("RGB").resize((TW, TH), Image.LANCZOS) for f in sorted(glob.glob(os.path.join(here, i, "slide-*.png")))] for i in ids]
W = max(len(r) for r in rows) * (TW + G) + G
sheet = Image.new("RGB", (W, len(rows) * (TH + G) + G), (40, 40, 40))
for y, r in enumerate(rows):
    for x, im in enumerate(r):
        sheet.paste(im, (G + x * (TW + G), G + y * (TH + G)))
sheet.save(out); print("wrote", out, sheet.size)
