/*
  Vox-style explainer collage kit: textured paper, torn clippings, tape,
  highlighter, hand-drawn marker circles and arrows, marked-up printouts.
  Load after render.js and covers.js. Theme class: t-vox.
*/
(function (root) {
  const L = root.Carousel.layouts;
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (s) => esc(s).replace(/\*(.+?)\*/g, '<em class="hl">$1</em>').replace(/\n/g, "<br>");

  // Small seeded random so torn edges and marker strokes look hand-made but render the same every time.
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  // clip-path for paper with torn edges. edges: string of t/r/b/l to tear.
  function torn(seed, edges = "tb", amp = 9, step = 2.2) {
    const r = rng(seed), pts = [];
    const j = () => (r() * amp).toFixed(1);
    for (let x = 0; x <= 100; x += step) pts.push(`${Math.min(x, 100)}% ${edges.includes("t") ? j() : 0}px`);
    for (let y = 0; y <= 100; y += step) pts.push(`calc(100% - ${edges.includes("r") ? j() : 0}px) ${Math.min(y, 100)}%`);
    for (let x = 100; x >= 0; x -= step) pts.push(`${Math.max(x, 0)}% calc(100% - ${edges.includes("b") ? j() : 0}px)`);
    for (let y = 100; y >= 0; y -= step) pts.push(`${edges.includes("l") ? j() : 0}px ${Math.max(y, 0)}%`);
    return `clip-path:polygon(${pts.join(",")});`;
  }

  // Hand-drawn marker loop around a box (w x h), overshooting where it closes.
  function markerCircle(w, h, seed = 3, color = "var(--marker)", sw = 9) {
    const r = rng(seed), cx = w / 2, cy = h / 2, pts = [];
    for (let a = -0.5; a <= Math.PI * 2 + 0.45; a += 0.18) {
      const k = 1 + (r() - 0.5) * 0.06 + (a > Math.PI * 2 ? 0.07 : 0);
      pts.push([cx + (w / 2) * k * Math.cos(a), cy + (h / 2) * k * Math.sin(a)]);
    }
    const d = "M" + pts.map((p) => p.map((n) => n.toFixed(1)).join(" ")).join(" L");
    return `<svg class="mk" viewBox="-20 -20 ${w + 40} ${h + 40}" style="width:${w + 40}px;height:${h + 40}px"><path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  // Hand-drawn arrow from (0,0) toward (dx,dy) with a slight curve.
  function markerArrow(dx, dy, bend = 40, color = "var(--marker)", sw = 8) {
    const mx = dx / 2 - (dy / Math.hypot(dx, dy)) * bend, my = dy / 2 + (dx / Math.hypot(dx, dy)) * bend;
    const ang = Math.atan2(dy - my, dx - mx), a1 = ang + 2.6, a2 = ang - 2.6, L2 = 34;
    const W = Math.abs(dx) + 80, H = Math.abs(dy) + 80, ox = dx < 0 ? -dx + 40 : 40, oy = dy < 0 ? -dy + 40 : 40;
    return `<svg class="mk" viewBox="0 0 ${W} ${H}" style="width:${W}px;height:${H}px;margin:-${oy}px 0 0 -${ox}px"><g transform="translate(${ox} ${oy})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M0 0 Q ${mx} ${my} ${dx} ${dy}"/><path d="M${dx + L2 * Math.cos(a1)} ${dy + L2 * Math.sin(a1)} L${dx} ${dy} L${dx + L2 * Math.cos(a2)} ${dy + L2 * Math.sin(a2)}"/></g></svg>`;
  }

  const tape = (x, y, rot, w = 170) => `<span class="tape" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg)"></span>`;
  const label = (t) => `<span class="vx-label">${esc(t)}</span>`;
  const at = (x, y, html, extra = "") => `<div class="vx-at" style="left:${x}px;top:${y}px;${extra}">${html}</div>`;

  /* ---------- covers ---------- */

  // Funnels leak. Loops compound.
  const V = {};
  V.voxLoop = () => `
    <div class="vx-paper vx-grid" style="left:70px;top:40px;width:470px;height:520px;transform:rotate(-5deg);${torn(11, "trb")}">
      <p class="vx-type" style="margin:34px 0 0 40px">FIG. 1 · THE FUNNEL</p>
      <svg viewBox="0 0 470 440" style="position:absolute;left:0;top:70px;width:470px;height:440px">
        ${[[360, 0], [290, 1], [220, 2], [150, 3]].map(([w, i]) => `<rect x="${235 - w / 2}" y="${30 + i * 82}" width="${w}" height="64" fill="none" stroke="#3b3b3b" stroke-width="3"/>`).join("")}
        ${["Ads", "Visits", "Sign-ups", "Customers"].map((t, i) => `<text x="235" y="${72 + i * 82}" text-anchor="middle" font-size="27" fill="#3b3b3b" style="font-family:var(--type)">${t}</text>`).join("")}
        ${[0, 1, 2].map((i) => `<path d="M${235 + (i - 1) * 30} 370 q 6 18 0 30" stroke="#5a7fa8" stroke-width="5" fill="none" stroke-linecap="round"/>`).join("")}
      </svg>
    </div>
    ${at(150, 300, `<svg class="mk" viewBox="0 0 330 330" style="width:330px;height:330px"><path d="M30 40 L300 300 M296 36 L36 294" stroke="var(--marker)" stroke-width="16" stroke-linecap="round" fill="none"/></svg>`, "transform:rotate(-5deg);z-index:3")}
    ${at(118, 590, `<span class="vx-hand">it leaks</span>`, "transform:rotate(-6deg);z-index:4")}
    <div class="vx-paper" style="left:460px;top:150px;width:560px;height:600px;transform:rotate(3deg);${torn(29, "lb")}">
      <p class="vx-type" style="margin:40px 0 0 46px">FIG. 2 · THE LOOP</p>
      <svg viewBox="0 0 560 520" style="position:absolute;left:0;top:70px;width:560px;height:520px">
        <circle cx="280" cy="250" r="170" fill="none" stroke="#1d1d1b" stroke-width="5"/>
        ${[-30, 90, 210].map((a) => { const rad = a * Math.PI / 180, x = 280 + 170 * Math.cos(rad), y = 250 + 170 * Math.sin(rad); return `<path d="M -16 -13 L 16 0 L -16 13 Z" fill="#1d1d1b" transform="translate(${x} ${y}) rotate(${a + 90})"/>`; }).join("")}
        ${[[-90, "New user"], [30, "Shares it"], [150, "Others find it"]].map(([a, t]) => { const rad = a * Math.PI / 180, x = 280 + 170 * Math.cos(rad), y = 250 + 170 * Math.sin(rad); return `<rect x="${x - 100}" y="${y - 30}" width="200" height="60" fill="#fffdf6" stroke="#1d1d1b" stroke-width="3"/><text x="${x}" y="${y + 9}" text-anchor="middle" font-size="27" fill="#1d1d1b" style="font-family:var(--type)">${t}</text>`; }).join("")}
      </svg>
      ${at(156, 268, `<span class="vx-hl-block">output = next input</span>`)}
      ${at(118, 230, markerCircle(330, 110, 7))}
    </div>
    ${tape(640, 118, -6)}${tape(950, 520, 52, 150)}${tape(160, 18, 4, 150)}
    ${at(600, 790, markerArrow(-60, -110, -30))}
    ${at(630, 778, `<span class="vx-hand">this compounds</span>`, "transform:rotate(-3deg);z-index:4")}`;

  // Winning a customer costs 5–25× more than keeping one.
  V.voxStat = () => `
    <div class="vx-paper vx-receipt" style="left:600px;top:30px;width:380px;height:640px;transform:rotate(4deg);${torn(5, "b", 14, 3.2)}">
      <p class="rc-h">COST PER CUSTOMER</p><p class="rc-s">illustrative ratio</p>
      <div class="rc-row"><span>KEEP ONE</span><span>$1.00</span></div>
      <div class="rc-row"><span>WIN ONE</span><span>$5.00</span></div>
      <div class="rc-row"><span>&nbsp;&nbsp;up to</span><span>$25.00</span></div>
      <div class="rc-rule"></div>
      <div class="rc-row rc-tot"><span>GAP</span><span class="vx-circ">5–25×${markerCircle(190, 80, 13)}</span></div>
      <p class="rc-f">Source: Harvard Business Review, 2014</p>
      <div class="rc-bar"></div>
    </div>
    <div class="vx-paper vx-num" style="left:60px;top:90px;width:560px;height:430px;transform:rotate(-4deg);${torn(17, "trbl", 8)}">
      <span>5–25<i>×</i></span>
    </div>
    ${tape(250, 66, -2, 190)}
    ${at(110, 560, `<span class="vx-hand big">5–25× more<br>to win than<br>to keep</span>`, "transform:rotate(-4deg)")}`;

  // 12 growth metrics every founder should know.
  // Same idea with a ChatGPT halftone funnel cut-out instead of the drawn figure.
  V.voxLoopPhoto = (v) => `
    <img class="vx-img" src="${esc(v.funnel)}" alt="" style="left:30px;top:30px;width:560px;transform:rotate(-8deg)">
    ${at(120, 120, `<svg class="mk" viewBox="0 0 360 360" style="width:360px;height:360px"><path d="M30 40 L330 320 M320 30 L40 330" stroke="var(--marker)" stroke-width="18" stroke-linecap="round" fill="none"/></svg>`, "z-index:4")}
    ${at(70, 520, `<span class="vx-hand big">it leaks</span>`, "transform:rotate(-6deg);z-index:4")}
    <div class="vx-paper" style="left:480px;top:170px;width:560px;height:600px;transform:rotate(3deg);${torn(29, "lb")}">
      <p class="vx-type" style="margin:40px 0 0 46px">FIG. 2 · THE LOOP</p>
      <svg viewBox="0 0 560 520" style="position:absolute;left:0;top:70px;width:560px;height:520px">
        <circle cx="280" cy="250" r="170" fill="none" stroke="#1d1d1b" stroke-width="5"/>
        ${[-30, 90, 210].map((a) => { const rad = a * Math.PI / 180, x = 280 + 170 * Math.cos(rad), y = 250 + 170 * Math.sin(rad); return `<path d="M -16 -13 L 16 0 L -16 13 Z" fill="#1d1d1b" transform="translate(${x} ${y}) rotate(${a + 90})"/>`; }).join("")}
        ${[[-90, "New user"], [30, "Shares it"], [150, "Others find it"]].map(([a, t]) => { const rad = a * Math.PI / 180, x = 280 + 170 * Math.cos(rad), y = 250 + 170 * Math.sin(rad); return `<rect x="${x - 100}" y="${y - 30}" width="200" height="60" fill="#fffdf6" stroke="#1d1d1b" stroke-width="3"/><text x="${x}" y="${y + 9}" text-anchor="middle" font-size="27" fill="#1d1d1b" style="font-family:var(--type)">${t}</text>`; }).join("")}
      </svg>
      ${at(156, 268, `<span class="vx-hl-block">output = next input</span>`)}
      ${at(118, 230, markerCircle(330, 110, 7))}
    </div>
    ${tape(660, 140, -6)}${tape(970, 540, 52, 150)}
    ${at(620, 800, markerArrow(-60, -110, -30))}
    ${at(650, 788, `<span class="vx-hand">this compounds</span>`, "transform:rotate(-3deg);z-index:4")}`;

  V.voxSheet = (v = {}) => {
    const rows = [["CAC", "S&M spend ÷ new customers", "Falling"], ["LTV", "ARPA × margin ÷ churn", "3× CAC+"], ["Payback", "CAC ÷ (ARPA × margin)", "< 12 mo"], ["NRR", "(Start + exp − churn) ÷ start", "> 100%"], ["Quick ratio", "(New + exp) ÷ (churn + contr.)", "4+"], ["Burn multiple", "Net burn ÷ net new ARR", "< 1.5×"]];
    return `
    <div class="vx-paper vx-print" style="left:80px;top:40px;width:900px;height:860px;transform:rotate(-3deg)">
      <div class="pr-head"><span>growth_metrics.xlsx</span><span>Page 1 of 2</span></div>
      <table class="pr-tbl"><thead><tr><th>Metric</th><th>Formula</th><th>Healthy</th></tr></thead>
      <tbody>${rows.map((r, i) => { const hl = i === 1 || i === 3; return `<tr class="${hl ? "is-hl" : ""}"><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${hl ? `<span class="vx-circ">${esc(r[2])}${markerCircle(190, 76, 21 + i)}</span>` : esc(r[2])}</td></tr>`; }).join("")}</tbody></table>
    </div>
    <span class="clip" style="left:220px;top:6px"></span>
    ${at(720, -40, `<div class="vx-sticky">save<br>this</div>`, "transform:rotate(8deg);z-index:5")}
    ${v.sticker
      ? `<img class="vx-img" src="${esc(v.sticker)}" alt="" style="left:560px;top:560px;width:520px;transform:rotate(7deg);z-index:6">`
      : `${at(130, 690, `<span class="vx-hand">start with these two</span>`, "transform:rotate(-4deg);z-index:5")}
         ${at(610, 640, markerArrow(40, -150, 40))}`}`;
  };

  // Generic image layers for any theme: [{ src, x, y, w, rot, z }]
  V.layers = (v) => v.items.map((l) => `<img class="ly-img${l.shadow === false ? "" : " ly-shadow"}" src="${esc(l.src)}" alt="" style="left:${l.x}px;top:${l.y}px;width:${l.w}px;transform:rotate(${l.rot || 0}deg);z-index:${l.z || 1}">`).join("");
  V.none = () => "";

  Object.assign(root.Carousel.coverVisuals || (root.Carousel.coverVisuals = {}), V);

  /* ---------- inside slide: torn strips list ---------- */
  L.voxList = (s) => `
    <h2 class="h2">${fmt(s.heading)}</h2>
    <ol class="vx-strips">${s.items.map((it, i) => `
      <li style="transform:rotate(${[-1.2, 0.8, -0.6, 1][i % 4]}deg);${torn(40 + i, "lr", 7, 4)}">
        <span class="vx-n">${markerCircle(70, 70, 50 + i)}<b>${i + 1}</b></span>
        <div><p class="t">${fmt(it.t)}</p><p class="d">${fmt(it.d)}</p></div>
      </li>`).join("")}</ol>
    ${s.hand ? `<p class="vx-hand" style="margin-top:34px;transform:rotate(-2deg)">${fmt(s.hand)}</p>` : ""}`;

  root.Vox = { torn, markerCircle, markerArrow, tape };
})(typeof window !== "undefined" ? window : globalThis);
