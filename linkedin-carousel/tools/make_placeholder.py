"""Neutral author-portrait placeholder in the house style: a halftone head-and-shoulders
cut-out with a white sticker border. Replace with a real background-removed portrait
(set CAROUSEL_AUTHOR.photo). Usage: python3 tools/make_placeholder.py"""
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import math, os

W, H, PAD = 900, 1100, 40
S = 2  # supersample
w, h = W * S, H * S

# 1. silhouette mask
mask = Image.new("L", (w, h), 0)
d = ImageDraw.Draw(mask)
cx = w // 2
d.ellipse([cx - 190 * S, 110 * S, cx + 190 * S, 590 * S], fill=255)              # head
d.rounded_rectangle([cx - 85 * S, 520 * S, cx + 85 * S, 760 * S], 60 * S, fill=255)  # neck
d.rounded_rectangle([cx - 390 * S, 690 * S, cx + 390 * S, h + 400 * S], 250 * S, fill=255)  # shoulders
mask = mask.filter(ImageFilter.GaussianBlur(6 * S)).point(lambda v: 255 if v > 128 else 0)

# 2. tone: lit from the upper left, darker to the right and bottom
tone = Image.new("L", (w, h), 0)
px = tone.load()
for y in range(0, h):
    for x in range(0, w):
        t = 0.30 + 0.45 * (x / w) + 0.22 * (y / h) - 0.18 * math.exp(-(((x - cx * 0.8) / (260 * S)) ** 2 + ((y - 300 * S) / (300 * S)) ** 2))
        px[x, y] = max(0, min(255, int(255 * (1 - t))))

# 3. halftone dots on a 45 degree grid
cell = 13 * S
dots = Image.new("L", (w, h), 255)
dd = ImageDraw.Draw(dots)
for j in range(-2, int(h / (cell / 2)) + 2):
    for i in range(-2, int(w / cell) + 2):
        x = i * cell + (cell / 2 if j % 2 else 0)
        y = j * cell / 2
        xi, yi = int(min(max(x, 0), w - 1)), int(min(max(y, 0), h - 1))
        dark = 1 - px[xi, yi] / 255
        r = cell * 0.62 * math.sqrt(dark)
        if r > 0.5:
            dd.ellipse([x - r, y - r, x + r, y + r], fill=18)

# 4. sticker: white border grown from the mask
border = mask.filter(ImageFilter.MaxFilter(2 * (PAD // 2) * S + 1)).filter(ImageFilter.GaussianBlur(2 * S)).point(lambda v: 255 if v > 110 else 0)
out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
out.paste((255, 255, 255, 255), mask=border)
fig = Image.merge("RGBA", [dots, dots, dots, mask])
out.alpha_composite(fig)
out = out.resize((W, H), Image.LANCZOS)
dst = os.path.join(os.path.dirname(__file__), "..", "assets", "author-placeholder.png")
out.save(dst)
print("wrote", os.path.normpath(dst), out.size)
