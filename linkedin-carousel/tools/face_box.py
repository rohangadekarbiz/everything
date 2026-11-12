"""Measure the head box and face box of a cut-out portrait (transparent PNG, head at the top).

Usage: python3 tools/face_box.py assets/author-arms.png [more.png ...] [--overlay out/facebox-check.png]

No face-detection library is needed. The head comes from the silhouette (alpha): the widest row of the
head, then the narrowest row under it (chin / neck). The hairline comes from brightness: dark hair gives
way to lighter skin down the middle of the head. Output is fractions of the image, [x0, y0, x1, y1], for
the unflipped file. Paste them into CAROUSEL_AUTHOR.portraits (content/growth-examples.js), then LOOK at
the overlay: the red box must hold forehead, eyes, nose, mouth and chin, the yellow box all of the hair.
"""
import sys
from PIL import Image, ImageDraw, ImageFilter

def measure(path):
    im = Image.open(path).convert("RGBA")
    W, H = im.size
    a = im.split()[-1].point(lambda v: 255 if v > 128 else 0)
    px = a.load()
    rows = []
    for y in range(H):
        xs = [x for x in range(0, W, 2) if px[x, y]]
        rows.append((xs[0], xs[-1]) if xs else None)
    top = next(y for y, r in enumerate(rows) if r)
    width = lambda y: rows[y][1] - rows[y][0] if rows[y] else 0
    # Widest row of the head: follow the silhouette down until it has clearly started to narrow again.
    head_y, best = top, 0
    for y in range(top, H):
        if width(y) > best: head_y, best = y, width(y)
        elif width(y) < 0.9 * best and y - top > 0.08 * H: break
    # Chin / neck: the narrowest row under it, before the shoulders open out.
    neck_y = head_y
    for y in range(head_y, H):
        if width(y) < width(neck_y): neck_y = y
        elif width(y) > 1.3 * best: break
    # The narrowest row sits at the jaw; the chin and beard hang a little below it (measured by eye: about 8% of the head).
    chin_y = min(H - 1, neck_y + int(0.08 * (neck_y - top)))
    hx0 = min(rows[y][0] for y in range(top, neck_y) if rows[y])
    hx1 = max(rows[y][1] for y in range(top, neck_y) if rows[y])
    # Hairline: mean brightness of a centre band, smoothed; the first sustained jump from hair to skin.
    g = im.convert("L").filter(ImageFilter.GaussianBlur(6)).load()
    cx0, cx1 = int(hx0 + 0.35 * (hx1 - hx0)), int(hx0 + 0.75 * (hx1 - hx0))
    lum = [sum(g[x, y] for x in range(cx0, cx1, 3)) / len(range(cx0, cx1, 3)) for y in range(H)]
    start = top + int(0.06 * (neck_y - top))  # skip the white sticker border
    dark = min(lum[start:top + (neck_y - top) // 3])
    light = max(lum[start:neck_y])
    thr = dark + 0.5 * (light - dark)
    run = max(12, int(0.1 * (neck_y - top)))  # skin must hold for a tenth of the head, so a highlight in the hair does not count
    hair_y = next((y for y in range(start, neck_y) if all(lum[k] > thr for k in range(y, min(neck_y, y + run)))), top + (neck_y - top) // 3)
    # Cheeks: silhouette between hairline and chin, pulled in a little to drop the ears and the border.
    fx0 = min(rows[y][0] for y in range(hair_y, neck_y) if rows[y])
    fx1 = max(rows[y][1] for y in range(hair_y, neck_y) if rows[y])
    inset = 0.06 * (fx1 - fx0)
    f = lambda v, n: round(v / n, 3)
    return im, dict(size=[W, H],
                    head=[f(hx0, W), f(top, H), f(hx1, W), f(chin_y, H)],
                    face=[f(fx0 + inset, W), f(hair_y, H), f(fx1 - inset, W), f(chin_y, H)])

if __name__ == "__main__":
    args = sys.argv[1:]
    overlay = args[args.index("--overlay") + 1] if "--overlay" in args else None
    paths = [p for p in args if p.endswith(".png") and p != overlay]
    tiles = []
    for p in paths:
        im, m = measure(p)
        print(f'"{p}": {{ size: {m["size"]}, face: {m["face"]}, head: {m["head"]} }},')
        W, H = im.size
        bg = Image.new("RGB", (W, H), (60, 90, 200)); bg.paste(im, (0, 0), im)
        d = ImageDraw.Draw(bg)
        for box, col in ((m["head"], (255, 230, 0)), (m["face"], (255, 40, 40))):
            d.rectangle([box[0] * W, box[1] * H, box[2] * W, box[3] * H], outline=col, width=6)
        tiles.append(bg)
    if overlay and tiles:
        sheet = Image.new("RGB", (sum(t.width for t in tiles), max(t.height for t in tiles)), (30, 30, 30))
        x = 0
        for t in tiles: sheet.paste(t, (x, 0)); x += t.width
        sheet.save(overlay); print("wrote", overlay)
