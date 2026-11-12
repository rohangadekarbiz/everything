// Composition check for slides that carry cut-outs (the author's portrait, props). Used by `node export.mjs --check`.
// It enforces the rules written at the top of engine/house.js:
//   - no text within FACE_CLEAR px of the face box or HEAD_CLEAR px of the head box (hair, ears, beard)
//   - bare type never over a cut-out's visible pixels; type on paper (clippings) may cross the body only,
//     and must not be hidden behind a cut-out
//   - no prop in front of the face; the face mostly inside the slide and, on face-led covers, a sensible size
//   - clippings do not cover each other's words; bare type stays out of the right margin; the portrait runs off the bottom edge; no low-contrast type on the colour disc; cover headline >= MIN_TITLE px
//
// How: every text line is sampled on a 6px grid. Each sample point is mapped back through the cut-out's CSS
// transform (rotation, flip) into the image, where it is tested against the face / head boxes (data-face,
// data-head on the <img>, fractions of the file) and against the image's real alpha channel.
//
// Limits: the face box is a rectangle measured once per portrait (tools/face_box.py), not a detected face;
// line boxes come from font metrics, trimmed to roughly cap height, so very tall accents are not seen;
// transforms on ancestors of a cut-out are ignored; the theme's own text classes are listed in TEXT below.
import { readFile } from "node:fs/promises";
import path from "node:path";

export const RULES = { FACE_CLEAR: 40, HEAD_CLEAR: 16, MIN_FACE: 0.2, MAX_FACE: 0.4, MIN_VISIBLE: 0.85, MIN_TITLE: 96, MIN_CONTRAST: 3, MARGIN: 70 };

const cache = new Map();
async function dataUrl(root, src) {
  if (!cache.has(src)) {
    const buf = await readFile(path.join(root, src)).catch(() => null);
    cache.set(src, buf ? "data:image/png;base64," + buf.toString("base64") : null);
  }
  return cache.get(src);
}

export async function compositionCheck(page, root) {
  const srcs = await page.evaluate(() => [...new Set([...document.querySelectorAll("img.h-cut")].map((i) => i.getAttribute("src")))]);
  if (!srcs.length) return [];
  const images = {};
  for (const s of srcs) images[s] = await dataUrl(root, s);

  return page.evaluate(async ({ images, R }) => {
    // Alpha masks, 200px wide, read from data URLs (file:// images would taint the canvas).
    const masks = {};
    for (const [src, url] of Object.entries(images)) {
      if (!url) continue;
      const im = new Image(); im.src = url; await im.decode();
      const w = 200, h = Math.round((200 * im.naturalHeight) / im.naturalWidth);
      const c = Object.assign(document.createElement("canvas"), { width: w, height: h });
      const g = c.getContext("2d"); g.drawImage(im, 0, 0, w, h);
      masks[src] = { w, h, d: g.getImageData(0, 0, w, h).data };
    }
    const opaque = (m, u, v) => u >= 0 && v >= 0 && u < 1 && v < 1 && m.d[(Math.floor(v * m.h) * m.w + Math.floor(u * m.w)) * 4 + 3] > 128;

    // An element's own box and transform, in slide coordinates.
    function frame(el, slide) {
      let x = 0, y = 0;
      for (let e = el; e && e !== slide; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; }
      const cs = getComputedStyle(el), w = el.offsetWidth, h = el.offsetHeight;
      const m = new DOMMatrix(cs.transform === "none" ? "" : cs.transform), inv = m.inverse();
      const [ox, oy] = cs.transformOrigin.split(" ").map(parseFloat);
      const out = (u, v) => { const p = m.transformPoint(new DOMPoint(u - ox, v - oy)); return [p.x + ox + x, p.y + oy + y]; };
      const into = (px, py) => { const p = inv.transformPoint(new DOMPoint(px - x - ox, py - y - oy)); return [p.x + ox, p.y + oy]; };
      return { w, h, out, into, z: parseInt(cs.zIndex, 10) || 0 };
    }
    const grid = (x0, y0, x1, y1, map = (a, b) => [a, b], step = 6) => {
      const pts = [];
      const nx = Math.max(1, Math.ceil((x1 - x0) / step)), ny = Math.max(1, Math.ceil((y1 - y0) / step));
      for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) pts.push(map(x0 + ((x1 - x0) * i) / nx, y0 + ((y1 - y0) * j) / ny));
      return pts;
    };
    const rgb = (c) => (c.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number);
    const lum = (c) => { const [r, g, b] = rgb(c).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const contrast = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };
    const quote = (t) => `"${t.trim().replace(/\s+/g, " ").slice(0, 28)}"`;

    const TEXT = ".h-title, .h-num, .h-by, .h-lede, .h-hand, .h-acts li, .h-who p, .h-src";   // bare type
    const PAPER = ".h-clip, .h-nametag, .h-strip, .h-node, .h-funnel li, .h-myth";          // type on its own paper
    const problems = [];

    for (const slide of document.querySelectorAll(".slide")) {
      const cuts = [...slide.querySelectorAll("img.h-cut")];
      if (!cuts.length) continue;
      const sb = slide.getBoundingClientRect(), SW = sb.width, SH = sb.height;
      const say = (msg) => problems.push(`slide ${slide.dataset.n}: ${msg}`);

      // Text items: { label, pts, paper, z (null = headline layer, above all art) }
      const items = [];
      slide.querySelectorAll(TEXT).forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        const carded = cs.transform !== "none" || (rgb(cs.backgroundColor).length && !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor));
        if (carded) { // e.g. the headline card (mod-panel): the whole card counts, as paper
          const f = frame(el, slide);
          items.push({ label: quote(el.textContent), pts: grid(0, 0, f.w, f.h, f.out), paper: true, z: null });
          return;
        }
        const fs = parseFloat(cs.fontSize), walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.textContent.trim()) continue;
          const range = document.createRange(); range.selectNodeContents(n);
          for (const r of range.getClientRects()) {
            if (r.width < 2) continue;
            // Trim the line box to about cap height / descender: that is where the ink is.
            items.push({ label: quote(n.textContent), color: cs.color, paper: false, z: null,
              pts: grid(r.left - sb.left, r.top - sb.top + fs * 0.14, r.right - sb.left, r.bottom - sb.top - fs * 0.05) });
          }
        }
      });
      slide.querySelectorAll(PAPER).forEach((el) => {
        if (getComputedStyle(el).display === "none") return;
        const f = frame(el, slide);
        const cs = getComputedStyle(el), pad = (k) => parseFloat(cs["padding" + k]) || 0;
        items.push({ label: quote(el.textContent), pts: grid(0, 0, f.w, f.h, f.out), paper: true, z: el.closest(".s-art") ? f.z : null, f,
          words: grid(pad("Left"), pad("Top"), f.w - pad("Right"), f.h - pad("Bottom"), f.out) });
      });

      const cutInfo = cuts.map((img) => {
        const f = frame(img, slide), src = img.getAttribute("src");
        const box = (attr) => img.dataset[attr] ? img.dataset[attr].split(",").map(Number).map((v, i) => v * (i % 2 ? f.h : f.w)) : null;
        return { img, f, src, mask: masks[src], face: box("face"), head: box("head"), name: src.split("/").pop() };
      });

      for (const c of cutInfo) {
        if (!c.mask) say(`cannot read ${c.src}, so text over it is not checked`);
        const isFace = c.img.classList.contains("h-face");
        if (isFace && !c.face) say(`portrait ${c.name} has no face box (add it to CAROUSEL_AUTHOR.portraits)`);
        for (const it of items) {
          let face = 0, head = 0, body = 0;
          for (const [px, py] of it.pts) {
            const [u, v] = c.f.into(px, py);
            const near = (b, m) => b && u > b[0] - m && u < b[2] + m && v > b[1] - m && v < b[3] + m;
            if (near(c.face, R.FACE_CLEAR)) face++;
            else if (near(c.head, R.HEAD_CLEAR)) head++;
            else if (c.mask && opaque(c.mask, u / c.f.w, v / c.f.h)) body++;
          }
          const behind = it.z != null && it.z < c.f.z;
          if (face) say(`${it.label} is on the face or within ${R.FACE_CLEAR}px of it`);
          else if (head) say(`${it.label} touches the head (hair, ears or beard; ${R.HEAD_CLEAR}px clearance)`);
          else if (body > 1 && !it.paper) say(`${it.label} runs over the cut-out ${c.name} (only text on paper may cross a cut-out)`);
          else if (body > 1 && behind) say(`${it.label} is partly hidden behind ${c.name}`);
        }
        if (!isFace || !c.face) continue;

        // The face itself: visible, a sensible size, not covered by a prop, portrait grounded on the bottom edge.
        const pts = grid(c.face[0], c.face[1], c.face[2], c.face[3], c.f.out, 10);
        const inside = pts.filter(([x, y]) => x >= 0 && x <= SW && y >= 0 && y <= SH).length / pts.length;
        if (inside < R.MIN_VISIBLE) say(`only ${Math.round(inside * 100)}% of the face is inside the slide (minimum ${R.MIN_VISIBLE * 100}%)`);
        const share = (c.face[3] - c.face[1]) / SH;
        if (slide.classList.contains("face-lead") && (share < R.MIN_FACE || share > R.MAX_FACE))
          say(`face is ${Math.round(share * 100)}% of the slide height (face-led covers: ${R.MIN_FACE * 100}-${R.MAX_FACE * 100}%)`);
        for (const p of cutInfo) {
          if (p === c || !p.mask || p.f.z <= c.f.z) continue;
          const hit = pts.filter(([x, y]) => { const [u, v] = p.f.into(x, y); return opaque(p.mask, u / p.f.w, v / p.f.h); }).length;
          if (hit) say(`prop ${p.name} covers part of the face`);
        }
        const corners = [[0, 0], [c.f.w, 0], [0, c.f.h], [c.f.w, c.f.h]].map(([u, v]) => c.f.out(u, v));
        if (Math.max(...corners.map((p) => p[1])) < SH) say(`portrait ${c.name} stops ${Math.round(SH - Math.max(...corners.map((p) => p[1])))}px above the bottom edge (it should run off the slide)`);
      }

      // Bare type on the colour disc / arch needs contrast.
      slide.querySelectorAll(".h-halo").forEach((halo) => {
        const cs = getComputedStyle(halo);
        if (cs.display === "none") return;
        const f = frame(halo, slide), round = parseFloat(cs.borderTopLeftRadius) >= Math.min(f.w, f.h) / 2 - 1 && Math.abs(f.w - f.h) < 2;
        for (const it of items) {
          if (it.paper || contrast(it.color, cs.backgroundColor) >= R.MIN_CONTRAST) continue;
          const on = it.pts.filter(([px, py]) => { const [u, v] = f.into(px, py);
            return round ? Math.hypot(u - f.w / 2, v - f.h / 2) < f.w / 2 : u > 0 && u < f.w && v > 0 && v < f.h; }).length;
          if (on > 1) say(`${it.label} sits on the colour shape with too little contrast`);
        }
      });

      // A clipping must not cover the words of the clipping under it (later in the page = on top, unless z-index says otherwise).
      const papers = items.filter((it) => it.words);
      papers.forEach((a, i) => papers.forEach((b, j) => {
        if (a === b || (a.z ?? 99) > (b.z ?? 99) || ((a.z ?? 99) === (b.z ?? 99) && i > j)) return;
        const hit = a.words.filter(([x, y]) => { const [u, v] = b.f.into(x, y); return u > 0 && v > 0 && u < b.f.w && v < b.f.h; }).length;
        if (hit / a.words.length > 0.03) say(`${a.label} is ${Math.round((hit / a.words.length) * 100)}% covered by the clipping ${b.label}`);
      }));

      // Unwrapped headline lines must still respect the right margin.
      for (const it of items) {
        const right = Math.max(...it.pts.map((q) => q[0]));
        const out = it.pts.filter(([x, y]) => x < 0 || y < 0 || x > SW || y > SH).length / it.pts.length;
        if (out > 0.04) say(`${it.label} is ${Math.round(out * 100)}% outside the slide`);
        if (!it.paper && right > SW - R.MARGIN) say(`${it.label} runs ${Math.round(right - (SW - R.MARGIN))}px into the right margin`);
      }
      const title = slide.matches(".k-hCover") && slide.querySelector(".h-title");
      if (title && parseFloat(getComputedStyle(title).fontSize) < R.MIN_TITLE) say(`cover headline is under ${R.MIN_TITLE}px, too small at thumbnail size`);
    }
    return [...new Set(problems)];
  }, { images, R: RULES });
}
