/*
  House style: explainer collage without the scaffolding.
  No header, footer, counter, kicker or swipe pill. A slide carries a headline,
  one piece of evidence (a cut-out, a clipping, a marker drawing) and nothing else.
  Use with theme "house" and chrome: false. Load after render.js and vox.js.

  Type: Archivo (headlines condensed, body normal width), Newsreader for anything
  that is "printed matter" (clippings), Permanent Marker only for marker annotations.
  Grid: 80px margins, text on the left edge, art is a separate layer that may bleed.
*/
(function (root) {
  const L = root.Carousel.layouts;
  const { torn, tape } = root.Vox;
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // *phrase* = a swipe of highlighter. Use it on the phrase that carries the point, never as headline decoration.
  const fmt = (s) => esc(s).replace(/\*(.+?)\*/g, '<mark class="h-hl">$1</mark>').replace(/\n/g, "<br>");
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  // A marker stroke through points (smooth, slightly wobbly), optional arrowhead at the end.
  function stroke(pts, { sw = 12, color = "var(--marker)", arrow = false, seed = 1, wob = 3 } = {}) {
    const r = rng(seed);
    const p = pts.map(([x, y], i) => (i === 0 || i === pts.length - 1 ? [x, y] : [x + (r() - 0.5) * wob * 2, y + (r() - 0.5) * wob * 2]));
    let d = `M${p[0][0]} ${p[0][1]}`;
    for (let i = 1; i < p.length - 1; i++) {
      const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2;
      d += ` Q${p[i][0].toFixed(1)} ${p[i][1].toFixed(1)} ${i === p.length - 2 ? p[i + 1][0] : mx.toFixed(1)} ${i === p.length - 2 ? p[i + 1][1] : my.toFixed(1)}`;
    }
    if (p.length === 2) d += ` L${p[1][0]} ${p[1][1]}`;
    let head = "";
    if (arrow) {
      const [ex, ey] = p[p.length - 1], [bx, by] = p[p.length - 2];
      const a = Math.atan2(ey - by, ex - bx), len = sw * 4.2;
      head = `<path d="M${(ex + len * Math.cos(a + 2.55)).toFixed(1)} ${(ey + len * Math.sin(a + 2.55)).toFixed(1)} L${ex} ${ey} L${(ex + len * Math.cos(a - 2.6)).toFixed(1)} ${(ey + len * Math.sin(a - 2.6)).toFixed(1)}"/>`;
    }
    return `<g fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/>${head}</g>`;
  }
  const svg = (w, h, inner, style = "") => `<svg class="h-svg" viewBox="0 0 ${w} ${h}" style="width:${w}px;height:${h}px;${style}">${inner}</svg>`;
  const full = (inner, z = 2) => svg(1080, 1350, inner, `left:0;top:0;z-index:${z}`);
  const img = (src, x, y, w, rot = 0, z = 1) => `<img class="h-cut" src="${esc(src)}" alt="" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg);z-index:${z}">`;

  // The author's portrait: a halftone cut-out standing on the bottom edge, name on a paper strip across the shoulder.
  const hasFace = (ctx) => !!ctx.author.photo && ctx.carousel.face !== false;
  const face = (ctx, { x, w, rot = -3, bottom = -70, tagX, tagY, tagRot = -4, src, flip = false }) => `
    <img class="h-cut h-face" src="${esc(src || ctx.author.photo)}" alt="" style="left:${x}px;bottom:${bottom}px;width:${w}px;transform:${flip ? "scaleX(-1) " : ""}rotate(${rot}deg);z-index:3">
    ${tagX == null ? "" : `<span class="h-nametag" style="left:${tagX}px;top:${tagY}px;transform:rotate(${tagRot}deg);${torn(77, "lr", 6, 9)}">${esc(ctx.author.name)}</span>`}`;

  /* ---------- cover art ---------- */
  const A = {};

  // The funnel drips; a marker line takes what falls out and carries it back to the top.
  A.funnelLoop = (a) => img(a.src, 70, 690, 640, 5) + full(
    [[330, 1262, 15], [322, 1316, 11]].map(([x, y, r]) => `<path d="M${x} ${y - r * 2.1} C${x + r * 1.2} ${y - r * 0.5} ${x + r} ${y + r} ${x} ${y + r} C${x - r} ${y + r} ${x - r * 1.2} ${y - r * 0.5} ${x} ${y - r * 2.1}Z" fill="#000"/>`).join("") +
    stroke([[270, 1318], [130, 1260], [50, 1090], [44, 900], [90, 760], [200, 668], [320, 664], [372, 760]], { sw: 15, arrow: true, seed: 4 }), 2);

  // A single cut-out placed by hand: { src, x, y, w, rot }.
  A.img = (a) => img(a.src, a.x, a.y, a.w, a.rot || 0);

  A.gauge = (a, ctx) => img(a.src, hasFace(ctx) ? 420 : 300, hasFace(ctx) ? 810 : 850, hasFace(ctx) ? 800 : 900, -5);

  // The myths as clippings, each one crossed out, piled up and running off the page.
  A.mythPile = (a, ctx) => {
    // [x, y, rotation, font size]; with a portrait the lower clippings are set smaller so they stop short of it.
    const spots = a.lead ? [[40, 640, -3, 60], [70, 770, 2.5, 56], [30, 890, 1.5, 50], [40, 1005, -2.5, 50], [50, 1120, 2, 50]]
                : hasFace(ctx) ? [[70, 640, -3, 70], [330, 775, 2.5, 70], [50, 905, 1.5, 50], [36, 1030, -2.5, 50], [70, 1150, 2, 50]]
                               : [[70, 640, -3, 70], [330, 775, 2.5, 70], [60, 910, 1.5, 70], [40, 1050, -2.5, 66], [70, 1190, 2, 70]];
    return a.items.map((t, i) => {
      const [x, y, rot, fs] = spots[i];
      return `<p class="h-clip" style="left:${x}px;top:${y}px;font-size:${fs}px;transform:rotate(${rot}deg);z-index:${(a.lead ? 4 : 2) + (i % 2)};--tilt:${[-1.6, 1.2, -0.8, 1.8, -1.2][i]}deg;${torn(90 + i, "lr", 7, 9)}">${esc(t)}</p>`;
    }).join("");
  };

  L.hCover = (s, ctx) => {
    const f = hasFace(ctx);
    // faceLead: the portrait is the main subject. Large, running off the bottom-right, mirrored so it points back at the headline.
    const fp = Object.assign(s.faceLead ? { x: 400, w: 740, rot: 0, bottom: -150, flip: true } : { x: 640, w: 420, rot: 3, bottom: -60, tagX: 700, tagY: 1236, tagRot: 3 }, s.facePos || {});
    return {
      cls: (f ? "has-face" : "") + (f && s.faceLead ? " face-lead" : ""),
      main: `
        ${s.num ? `<p class="h-num">${esc(s.num)}</p>` : ""}
        <h1 class="h-title" style="font-size:${s.size || 160}px;${s.width ? `max-width:${s.width}px` : ""}">${fmt(s.title)}</h1>
        ${f ? "" : `<p class="h-by"${s.by === "left" ? ' style="align-self:flex-start"' : ""}>${esc(ctx.author.name)}</p>`}`,
      art: (s.art ? A[s.art.type](s.art, ctx) : "") + (f ? face(ctx, Object.assign({ src: ctx.author.photoCover }, fp)) : ""),
    };
  };

  /* ---------- inside slides ---------- */

  // Paper strips that narrow as they go down: the funnel, built from its own stages.
  L.hStrips = (s) => `
    <h2 class="h-title" style="font-size:${s.size || 150}px">${fmt(s.title)}</h2>
    <ol class="h-funnel">${s.stages.map((t, i) => `<li style="width:${920 - i * 170}px;transform:rotate(${[-1, 0.8, -0.6, 1][i % 4]}deg);${torn(30 + i, "lr", 8, 7)}">${esc(t)}</li>`).join("")}</ol>
    ${s.hand ? `<p class="h-hand" style="text-align:center;margin-top:34px;transform:rotate(-2deg)">${fmt(s.hand)}</p>` : ""}`;

  // A marker circle with the stages taped onto it.
  L.hCycle = (s) => {
    const cx = 460, cy = 450, r = 330, R = rng(9), pts = [];
    for (let a = -1.75; a <= Math.PI * 2 - 1.45; a += 0.2) { const k = 1 + (R() - 0.5) * 0.035; pts.push([cx + r * k * Math.cos(a), cy + r * k * Math.sin(a)]); }
    const heads = [-30, 90, 210].map((deg) => { const a = (deg * Math.PI) / 180, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a), t = a + Math.PI / 2;
      return stroke([[x - 30 * Math.cos(t), y - 30 * Math.sin(t)], [x + 26 * Math.cos(t), y + 26 * Math.sin(t)]], { sw: 13, arrow: true }); }).join("");
    const nodes = s.nodes.map((t, i) => { const a = ([-90, 22, 158][i] * Math.PI) / 180;
      return `<span class="h-node" style="left:${cx + r * Math.cos(a)}px;top:${cy + r * Math.sin(a)}px;--rot:${[-2, 3, -3][i]}deg;${torn(60 + i, "lr", 6, 9)}">${fmt(t)}</span>`; }).join("");
    return `
      <div class="h-cycle">${svg(920, 900, stroke(pts, { sw: 13, wob: 0 }) + heads, "left:0;top:0")}${nodes}
        ${s.hand ? `<p class="h-hand h-cycle-c">${fmt(s.hand)}</p>` : ""}</div>
      <h2 class="h-title" style="font-size:${s.size || 150}px;margin-top:auto">${fmt(s.title)}</h2>
      ${s.note ? `<p class="h-src">${fmt(s.note)}</p>` : ""}`;
  };

  // One line, as big as it goes. Used once per carousel to change the pace.
  L.hStatement = (s) => ({ cls: "is-ink", main: `<h2 class="h-title" style="font-size:${s.size || 250}px">${fmt(s.title)}</h2>${s.sub ? `<p class="h-lede">${fmt(s.sub)}</p>` : ""}` });

  // A loop told as clippings: each step on its own strip, a marker line carrying the last one back to the first.
  L.hLoop = (s) => {
    const n = s.steps.length, sh = n === 1 ? (s.h || 600) : 210, gap = 86, H = n * sh + (n - 1) * gap, W = 920, sw = n === 1 ? 770 : 760;
    const downs = s.steps.slice(1).map((_, i) => stroke([[330, (i + 1) * sh + i * gap + 14], [336, (i + 1) * (sh + gap) - 16]], { sw: 13, arrow: true })).join("");
    const back = n === 1
      ? stroke([[470, H + 16], [560, H + 100], [780, H + 70], [905, H * 0.55], [880, -30], [720, -100], [560, -74], [520, -16]], { sw: 13, arrow: true, seed: 6 })
      : stroke([[sw + 26, H - sh / 2], [sw + 150, H - sh / 2 - 30], [sw + 196, H / 2], [sw + 150, sh / 2 + 20], [sw + 30, sh / 2]], { sw: 13, arrow: true, seed: 6 });
    return `
      <div class="h-loophead"><h2 class="h-title" style="font-size:${s.size || 170}px">${fmt(s.title)}</h2>${s.n ? `<span class="h-hand h-count">${esc(s.n)}</span>` : ""}</div>
      <div class="h-loop" style="height:${H}px;margin-top:${n === 1 ? 190 : 100}px;--fs:${n === 1 ? 92 : 70}px">
        ${s.steps.map((t, i) => `<p class="h-strip" style="top:${i * (sh + gap)}px;height:${sh}px;width:${sw}px;transform:rotate(${[-1.2, 1, -0.7][i % 3]}deg);${torn(40 + i + n, "lr", 8, 6)}">${fmt(t)}</p>`).join("")}
        ${svg(W, H, downs + back, "left:0;top:0;overflow:visible")}
      </div>`;
  };

  // Reference rows: the metric, how to work it out, and the number to hold it against.
  L.hLedger = (s) => ({ cls: s.ink ? "is-ink" : "", main: `
    <h2 class="h-title" style="font-size:${s.size || 120}px">${fmt(s.title)}</h2>
    <ol class="h-ledger">${s.rows.map((r, i) => `
      <li><p class="m">${fmt(r[0])}</p><p class="f">${fmt(r[1])}</p>
        <p class="r"><span class="${s.select === i ? "h-hl" : ""}">${fmt(r[2])}</span></p></li>`).join("")}</ol>
    ${s.note ? `<p class="h-src">${fmt(s.note)}</p>` : ""}` });

  // The myth is a clipping with a line through it. The fact is the headline.
  L.hMyth = (s) => {
    const v = s.paper || "news", w = s.w || 860, rot = s.rot ?? -2.5;
    return `
      <div class="h-mythwrap" style="width:${w}px;transform:rotate(${rot}deg);margin-left:${s.x || 0}px">
        <p class="h-myth h-myth-${v}" style="${v === "news" ? torn(s.seed || 5, "rb", 9, 4) : ""}">${fmt(s.myth)}</p>
        ${svg(w, 300, stroke(s.strike || [[30, 300], [w * 0.3, 230], [w * 0.62, 190], [w - 40, 90]], { sw: 16, seed: s.seed || 5, wob: 8, color: "var(--strike, var(--marker))" }), "left:0;top:0")}
        ${v === "news" ? "" : tape(w / 2 - 80, -26, rot > 0 ? -3 : 4, 160)}
        ${s.n ? `<span class="h-hand h-mythn">${esc(s.n)}</span>` : ""}
      </div>
      <h2 class="h-title h-fact" style="font-size:${s.size || 124}px">${fmt(s.fact)}</h2>`;
  };

  // Closing slide: what to do next, and who made it.
  L.hEnd = (s, ctx) => {
    const f = hasFace(ctx), a = ctx.author;
    return {
      cls: f ? "has-face" : "",
      main: `
        <h2 class="h-title" style="font-size:${s.size || 200}px">${fmt(s.title || "Found this useful?")}</h2>
        <ul class="h-acts">
          <li><b>Repost</b> ${fmt(s.repost || "so your team sees it too.")}</li>
          <li><b>Save</b> ${fmt(s.save || "for your next planning session.")}</li>
        </ul>
        <div class="h-who"><p class="nm">Follow ${esc(a.name)}</p><p class="pr">${esc(a.promise)}</p></div>`,
      art: f ? face(ctx, { x: 610, w: 480, rot: 3, bottom: -60, src: ctx.author.photoEnd }) : "",
    };
  };

  root.Carousel.houseArt = A;
})(typeof window !== "undefined" ? window : globalThis);
