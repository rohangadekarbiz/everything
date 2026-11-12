"""Prepare ChatGPT images for the carousel engine.

    python3 tools/prep_images.py

- Images that already have real transparency are trimmed to their content.
- Images where ChatGPT painted a fake grey/white checkerboard instead of
  transparency get that background removed (flood fill from the edges,
  plus any extra seed points listed below for enclosed holes).
- Full-bleed illustrations (no transparency wanted) are copied as they are.
Writes to assets/*.png from assets/raw/*.png.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
RAW, OUT = ROOT / "assets/raw", ROOT / "assets"

# name -> how to treat it. "holes" are (x, y) points inside enclosed background areas.
JOBS = {
    "riso-loop": {"mode": "copy"},
    "halftone-funnel": {"mode": "trim"},
    "halftone-gauge-calc": {"mode": "trim"},
    "clay-tiles": {"mode": "trim"},
    "clay-loop": {"mode": "checker", "holes": [(985, 480)]},
    "author-point": {"mode": "trim"},
    "author-arms": {"mode": "checker-grid", "cell": 98, "white": 254, "grey": 232},
}


def trim(im, pad=6):
    box = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if not box:
        return im
    l, t, r, b = box
    return im.crop((max(l - pad, 0), max(t - pad, 0), min(r + pad, im.width), min(b + pad, im.height)))


def remove_checker(im, holes):
    rgb = np.asarray(im.convert("RGB")).astype(int)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    bright = rgb.mean(axis=2)
    # Background candidates: grey or white with almost no colour. Includes the soft grey drop shadow.
    cand = ((sat < 16) & (bright > 80)).astype(np.uint8) * 255
    mask = Image.fromarray(cand, "L").copy()  # copy: floodfill cannot write into numpy-backed memory
    seeds = [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)] + list(holes)
    for x in range(0, im.width, 40):
        seeds += [(x, 0), (x, im.height - 1)]
    for y in range(0, im.height, 40):
        seeds += [(0, y), (im.width - 1, y)]
    for s in seeds:
        if mask.getpixel(s) == 255:
            ImageDraw.floodfill(mask, s, 128)
    bg = np.asarray(mask) == 128
    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8), "L")
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))  # soften the cut edge
    out = im.convert("RGBA")
    out.putalpha(alpha)
    return out


def remove_checker_grid(im, cell, white, grey, tol=6, border=14):
    """For black-and-white images, where 'grey and white' also describes the subject.
    Removes only pixels that match the checkerboard's exact shade at their grid position,
    then redraws an even white sticker border around the subject."""
    g = np.asarray(im.convert("L")).astype(int)
    h, w = g.shape
    # Either checker shade, at any position (ChatGPT's grid isn't exactly regular), plus the old white border.
    # The flood fill below only removes these where they connect to the image edge, so light areas inside
    # the subject survive as long as the subject's outline is darker than the checker.
    match = (np.abs(g - white) <= tol) | (np.abs(g - grey) <= tol) | (g >= 245)
    mask = Image.fromarray((match * 255).astype(np.uint8), "L").copy()
    for x in range(0, w, 20):
        for y in (0, h - 1):
            if mask.getpixel((x, y)) == 255:
                ImageDraw.floodfill(mask, (x, y), 128)
    for y in range(0, h, 20):
        for x in (0, w - 1):
            if mask.getpixel((x, y)) == 255:
                ImageDraw.floodfill(mask, (x, y), 128)
    subject = Image.fromarray(np.where(np.asarray(mask) == 128, 0, 255).astype(np.uint8), "L")
    # Opening (erode then dilate) drops thin leftovers such as the anti-aliased rim of the old border,
    # then a median filter drops speckles left by halftone noise.
    subject = subject.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MedianFilter(5))
    sticker = subject.filter(ImageFilter.MaxFilter(2 * border + 1)).filter(ImageFilter.GaussianBlur(1.5))
    out = Image.new("RGBA", im.size, (255, 255, 255, 0))
    out.putalpha(sticker)
    photo = im.convert("RGBA")
    photo.putalpha(subject.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(0.8)))  # keep the photo edge inside the white border
    out.alpha_composite(photo)
    return out


for name, job in JOBS.items():
    src = RAW / f"{name}.png"
    if not src.exists():
        print("missing", src.name)
        continue
    im = Image.open(src)
    if job["mode"] == "copy":
        out = im.convert("RGB")
    elif job["mode"] == "checker-grid":
        out = trim(remove_checker_grid(im, job["cell"], job["white"], job["grey"]))
    elif job["mode"] == "checker":
        out = trim(remove_checker(im, job.get("holes", [])))
    else:
        out = trim(im.convert("RGBA"))
    out.save(OUT / f"{name}.png", optimize=True)
    print(f"{name}: {out.size[0]}x{out.size[1]} {out.mode}")
