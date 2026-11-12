/*
  Cover ("hook") slides. A hook slide = short headline + one big visual anchor
  that fills the frame and bleeds off the edge. Load after render.js.

  { kind: "hook", kicker, title, size, sub, visual: { type: "...", ...params }, order: "visual-first" }
*/
(function (root) {
  const L = root.Carousel.layouts;
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (s) => esc(s).replace(/\*(.+?)\*/g, '<em class="hl">$1</em>').replace(/~(.+?)~/g, '<s class="strike">$1</s>').replace(/\n/g, "<br>");
  const pad = (n) => String(n).padStart(2, "0");
  const V = {};

  L.hook = (s, ctx) => {
    const head = `<div class="hook-head">
        ${s.kicker ? `<p class="kicker">${fmt(s.kicker)}</p>` : ""}
        ${s.title ? `<h1 class="title" style="--ts:${s.size || 132}px">${fmt(s.title)}</h1>` : ""}
        ${s.sub ? `<p class="hook-sub">${fmt(s.sub)}</p>` : ""}
      </div>`;
    const fn = V[s.visual.type];
    if (!fn) throw new Error("Unknown cover visual: " + s.visual.type);
    const vis = `<div class="hv hv-${s.visual.type}">${fn(s.visual, ctx)}</div>`;
    return s.order === "visual-first" ? vis + head : head + vis;
  };

  /* --- 01 loop diagram, funnel crossed out ------------------------------ */
  V.loop = () => {
    const cx = 650, cy = 380, r = 300;
    const node = (a, t) => {
      const rad = (a * Math.PI) / 180, x = cx + r * Math.cos(rad), y = cy + r * Math.sin(rad);
      return `<rect x="${x - 130}" y="${y - 46}" width="260" height="92" fill="var(--bg)" stroke="var(--ink)" stroke-width="4"/>
              <text x="${x}" y="${y + 12}" text-anchor="middle" font-size="36" font-weight="700" fill="var(--ink)" style="font-family:var(--display)">${t}</text>`;
    };
    const head = (a) => {
      const rad = (a * Math.PI) / 180, x = cx + r * Math.cos(rad), y = cy + r * Math.sin(rad);
      return `<path d="M -26 -21 L 26 0 L -26 21 Z" fill="var(--accent)" transform="translate(${x} ${y}) rotate(${a + 90})"/>`;
    };
    const fun = [[200, 0], [160, 1], [120, 2]].map(([w, i]) => `<rect x="${150 - w / 2}" y="${90 + i * 62}" width="${w}" height="50" fill="none" stroke="var(--muted)" stroke-width="3"/>`).join("");
    return `<svg viewBox="20 40 1040 680" preserveAspectRatio="xMidYMid meet" class="hv-svg">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(124,196,255,.07)" stroke="var(--accent)" stroke-width="7"/>
      ${[-30, 90, 210].map(head).join("")}
      ${node(-90, "New user")}${node(30, "Shares it")}${node(150, "Others find it")}
      <text x="${cx}" y="${cy - 10}" text-anchor="middle" font-size="64" fill="var(--warn,#ffc24b)" style="font-family:var(--hand);font-weight:700">output =</text>
      <text x="${cx}" y="${cy + 58}" text-anchor="middle" font-size="64" fill="var(--warn,#ffc24b)" style="font-family:var(--hand);font-weight:700">next input</text>
      <g opacity=".9">${fun}
        <line x1="40" y1="70" x2="262" y2="300" stroke="var(--warn,#ffc24b)" stroke-width="9" stroke-linecap="round"/>
        <text x="150" y="350" text-anchor="middle" font-size="40" fill="var(--muted)" style="font-family:var(--hand);font-weight:700">funnel</text></g>
    </svg>`;
  };

  /* --- 02 spreadsheet object -------------------------------------------- */
  V.sheet = (v, ctx) => `
    <div class="obj obj-sheet">${L.table({ cols: ["Metric", "Formula", "Rule of thumb"], widths: ["26%", "44%", "30%"], select: 1, formula: "=LTV/CAC", rows: v.rows }, { theme: "sheet" })}</div>
    <div class="sticker" style="right:70px;top:6px;transform:rotate(9deg)"><b>${esc(v.badge1)}</b><span>${esc(v.badge2)}</span></div>`;

  /* --- 03 experiment card + stamp --------------------------------------- */
  V.stamp = (v) => `
    <div class="obj obj-exp">
      <div class="exp" style="box-shadow:none">
        <div class="id"><span>${esc(v.id)}</span><span class="tag-sample">Sample data</span></div>
        <h3>${fmt(v.title)}</h3>
        <dl>${v.fields.map(([k, x]) => `<dt>${esc(k)}</dt><dd>${fmt(x)}</dd>`).join("")}</dl>
      </div>
    </div>
    <div class="stamp">${esc(v.stamp)}<small>${esc(v.stampSub)}</small></div>`;

  /* --- 04 struck-through myths list ------------------------------------- */
  V.mythlist = (v) => `<ol class="myth-stack">${v.items.map((t, i) => `<li style="opacity:${1 - i * 0.14}"><span>${pad(i + 1)}</span><s>${esc(t)}</s></li>`).join("")}</ol>`;

  /* --- 05 before/after browser mocks ------------------------------------ */
  const miniMock = (brand, h, s, cta) => `<div class="mock"><div class="bar"><i></i><i></i><i></i><u></u></div>
      <div class="page"><div class="nav"><b>${esc(brand)}</b><span>Pricing&nbsp;&nbsp;Log in</span></div><p class="h">${fmt(h)}</p><p class="s">${fmt(s)}</p><span class="btn">${esc(cta)}</span></div></div>`;
  V.beforeafter = (v) => `
    <div class="ba ba-before">${miniMock(v.brand, v.before.h, v.before.s, v.before.cta)}<span class="ba-lab">Before</span><svg class="ba-x" viewBox="0 0 100 100"><path d="M12 14 L88 86 M86 12 L14 88" stroke="currentColor" stroke-width="9" stroke-linecap="round" fill="none"/></svg></div>
    <div class="ba ba-after">${miniMock(v.brand, v.after.h, v.after.s, v.after.cta)}<span class="ba-lab">After</span></div>`;

  /* --- 06 scattered sticky notes ---------------------------------------- */
  V.stickies = (v) => {
    const pos = [[60, 40, -6], [380, 10, 4], [700, 60, -3], [130, 330, 3], [450, 300, -5], [770, 360, 6], [300, 590, -2]];
    return v.items.map((t, i) => `<div class="sticky big" style="left:${pos[i][0]}px;top:${pos[i][1]}px;transform:rotate(${pos[i][2]}deg)"><span class="n">${pad(i + 1)}</span><span>${fmt(t)}</span></div>`).join("") +
      (v.hand ? `<p class="handnote" style="position:absolute;right:70px;bottom:150px;transform:rotate(-4deg)">${fmt(v.hand)}</p>` : "");
  };

  /* --- 07 two bars: keep vs win ---------------------------------------- */
  V.bars = (v) => `
    <div class="bars2">
      <div class="b2"><span class="b2v">${esc(v.a.value)}</span><div class="b2bar" style="height:${v.a.h}px"></div><span class="b2l">${esc(v.a.label)}</span></div>
      <div class="b2 on"><span class="b2v">${esc(v.b.value)}</span><div class="b2bar" style="height:${v.b.h}px"></div><span class="b2l">${esc(v.b.label)}</span></div>
    </div>
    <p class="hv-src">${esc(v.source)}</p>`;

  /* --- 08 quiz options ------------------------------------------------- */
  V.options = (v) => `<div class="opts">${v.items.map((o, i) => `
      <div class="opt" style="margin-left:${i * 60}px;transform:rotate(${[-2, 1, -1][i]}deg)"><span class="radio"></span><div><b>${esc(o.t)}</b><span>${esc(o.d)}</span></div></div>`).join("")}
      <p class="handnote" style="position:absolute;right:80px;top:-20px;transform:rotate(6deg)">${fmt(v.hand)}</p></div>`;

  /* --- 09 sticky-note matrix ------------------------------------------- */
  V.matrix = (v) => `<div class="obj obj-matrix">${L.matrix({ x: "Effort →", y: "Impact →", quads: v.quads })}</div>`;

  /* --- 10 giant AARRR funnel ------------------------------------------- */
  V.letters = (v) => `<ol class="aarrr">${v.items.map((t, i) => `<li style="width:${1000 - i * 110}px"><b>${t[0]}</b><span>${esc(t)}</span></li>`).join("")}</ol>`;

  /* --- 11 milestone route ---------------------------------------------- */
  V.route = (v) => {
    const pts = [[90, 640], [330, 520], [580, 360], [860, 130]];
    const path = "M" + pts.map((p) => p.join(" ")).join(" L ");
    return `<svg viewBox="0 0 1080 760" preserveAspectRatio="xMidYMax meet" class="hv-svg">
      <path d="M 0 700 L 90 640" stroke="var(--line)" stroke-width="6" fill="none"/>
      <path d="${path}" stroke="var(--ink)" stroke-width="6" fill="none" stroke-dasharray="2 18" stroke-linecap="round"/>
      <path d="M 860 130 L 1080 20" stroke="var(--ink)" stroke-width="6" fill="none" stroke-dasharray="2 18" stroke-linecap="round"/>
      ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${i === 3 ? 30 : 20}" fill="${i === 3 ? "var(--accent)" : "var(--bg)"}" stroke="${i === 3 ? "var(--accent)" : "var(--ink)"}" stroke-width="6"/>
        <text x="${p[0] + (i === 3 ? -50 : 36)}" y="${p[1] + (i === 3 ? 100 : 80)}" font-size="${i === 3 ? 92 : 66}" fill="var(--ink)" style="font-family:var(--display)" text-anchor="${i === 3 ? "end" : "start"}">${v.labels[i]}</text>
        <text x="${p[0] + (i === 3 ? -50 : 36)}" y="${p[1] + (i === 3 ? 148 : 124)}" font-size="30" fill="var(--muted)" style="font-family:var(--mono)" text-anchor="${i === 3 ? "end" : "start"}">${v.notes[i]}</text>`).join("")}
    </svg>`;
  };

  /* --- 12 checklist paper ---------------------------------------------- */
  V.clipboard = (v) => `
    <div class="obj obj-paper">
      <p class="paper-h">${esc(v.head)}</p>
      <ul>${v.items.map((t, i) => `<li class="${i < v.done ? "done" : ""}"><span class="box">${i < v.done ? '<svg viewBox="0 0 40 40"><path d="M6 21 L16 31 L35 8" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ""}</span>${esc(t)}</li>`).join("")}</ul>
    </div>
    <div class="sticker" style="right:80px;top:10px;transform:rotate(-8deg)"><b>${esc(v.badge1)}</b><span>${esc(v.badge2)}</span></div>`;

  /* --- 13 fanned template cards ---------------------------------------- */
  V.cards = (v) => v.items.map((t, i) => `<div class="tcard" style="left:${[120, 70, 150][i]}px;top:${[30, 320, 610][i]}px;transform:rotate(${[-5, 3, -2][i]}deg)"><span class="n">${pad(i + 1)}</span><p>${esc(t).replace(/\{(.+?)\}/g, '<span class="slot">$1</span>')}</p></div>`).join("");

  /* --- 14 giant struck word -------------------------------------------- */
  V.strike = (v) => `<div class="strike-word"><span>${esc(v.word)}</span><i></i></div><p class="strike-after">${fmt(v.after)}</p>`;

  /* --- 15 dashboard chart hero ----------------------------------------- */
  V.chart = (v) => {
    const W = 1000, H = 640, m = { l: 40, r: 60, t: 60, b: 80 };
    const n = v.pts.length, X = (i) => m.l + ((W - m.l - m.r) * i) / (n - 1), Y = (val) => m.t + ((H - m.t - m.b) * (v.max - val)) / (v.max - v.min);
    const d = v.pts.map((p, i) => `${i ? "L" : "M"}${X(i)} ${Y(p)}`).join(" ");
    const area = d + ` L ${X(n - 1)} ${H - m.b} L ${X(0)} ${H - m.b} Z`;
    return `<div class="obj obj-chart"><div class="chart-top"><span>${esc(v.label)}</span><span class="tag-sample">Sample data</span></div>
      <svg viewBox="0 0 ${W} ${H}" class="hv-svg">
        <path d="${area}" fill="var(--accent)" opacity=".08"/>
        ${[0, 1, 2, 3].map((k) => `<line x1="${m.l}" x2="${W - m.r}" y1="${m.t + k * (H - m.t - m.b) / 3}" y2="${m.t + k * (H - m.t - m.b) / 3}" stroke="var(--line)" stroke-width="2"/>`).join("")}
        <path d="${d}" fill="none" stroke="var(--accent)" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>
        ${v.pts.map((p, i) => `<circle cx="${X(i)}" cy="${Y(p)}" r="${i === 0 || i === n - 1 ? 16 : 9}" fill="${i === n - 1 ? "var(--good)" : "var(--card)"}" stroke="${i === n - 1 ? "var(--good)" : "var(--accent)"}" stroke-width="6"/>`).join("")}
        <text x="${X(0)}" y="${Y(v.pts[0]) - 40}" font-size="64" font-weight="700" fill="var(--ink)" style="font-family:var(--display)">${v.from}</text>
        <text x="${X(n - 1)}" y="${Y(v.pts[n - 1]) + 96}" text-anchor="end" font-size="80" font-weight="700" fill="var(--good)" style="font-family:var(--display)">${v.to}</text>
        ${v.xl.map((t, i) => `<text x="${X(i)}" y="${H - 26}" text-anchor="middle" font-size="28" fill="var(--muted)" style="font-family:var(--mono)">${t}</text>`).join("")}
      </svg></div>`;
  };

  /* --- 16 dictionary entry crop ---------------------------------------- */
  V.entry = (v) => `<div class="dict-entry">${v.entries.map((e) => `
      <div class="de"><p class="de-w">${esc(e.w)}</p><p class="de-p">${esc(e.pr)} <i>${esc(e.pos)}</i></p><p class="de-d"><b>1.</b> ${fmt(e.d)}</p></div>`).join("")}</div>`;

  /* --- 17 giant quote mark --------------------------------------------- */
  V.quote = (v) => `<span class="giant-q">“</span><div class="q-by"><b>${esc(v.who)}</b><span>${esc(v.src)}</span></div>`;

  /* --- 18 fan-out: one call -> five assets ------------------------------ */
  V.fanout = (v) => {
    const ys = [70, 205, 340, 475, 610];
    return `<svg viewBox="0 0 1080 720" preserveAspectRatio="xMidYMax meet" class="hv-svg">
      ${ys.map((y) => `<path d="M 380 340 C 470 340, 470 ${y + 36}, 560 ${y + 36}" stroke="var(--accent)" stroke-width="5" fill="none"/>
        <path d="M 546 ${y + 24} L 566 ${y + 36} L 546 ${y + 48}" stroke="var(--accent)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join("")}
      <rect x="70" y="270" width="310" height="140" fill="var(--ink)"/>
      <text x="225" y="330" text-anchor="middle" font-size="44" font-weight="800" fill="var(--bg)" style="font-family:var(--display)">1 customer</text>
      <text x="225" y="380" text-anchor="middle" font-size="44" font-weight="800" fill="var(--bg)" style="font-family:var(--display)">call</text>
      ${v.items.map((t, i) => `<rect x="580" y="${ys[i]}" width="440" height="78" fill="var(--card)" stroke="var(--ink)" stroke-width="4"/>
        <text x="604" y="${ys[i] + 51}" font-size="38" font-weight="700" fill="var(--ink)" style="font-family:var(--display)">${t}</text>`).join("")}
      <text x="230" y="520" text-anchor="middle" font-size="54" fill="var(--accent)" style="font-family:var(--hand);font-weight:700" transform="rotate(-4 230 520)">${v.hand}</text>
    </svg>`;
  };

  /* --- 19 score gauge --------------------------------------------------- */
  V.gauge = (v) => {
    const cx = 540, cy = 560, r = 400;
    const arc = (a0, a1, col) => {
      const p = (a) => [cx + r * Math.cos(Math.PI * (1 - a)), cy - r * Math.sin(Math.PI * (1 - a))];
      const [x0, y0] = p(a0), [x1, y1] = p(a1);
      return `<path d="M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}" stroke="${col}" stroke-width="70" fill="none"/>`;
    };
    const na = Math.PI * (1 - v.needle), nx = cx + (r - 90) * Math.cos(na), ny = cy - (r - 90) * Math.sin(na);
    return `<svg viewBox="0 0 1080 760" preserveAspectRatio="xMidYMax meet" class="hv-svg">
      ${arc(0, 0.36, "var(--bad)")}${arc(0.37, 0.71, "var(--warn)")}${arc(0.72, 1, "var(--good)")}
      <line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="var(--ink)" stroke-width="14" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="30" fill="var(--ink)"/>
      <text x="${cx}" y="${cy + 150}" text-anchor="middle" font-size="120" font-weight="700" fill="var(--ink)" style="font-family:var(--display)">__ / 25</text>
      <text x="${cx - r}" y="${cy + 64}" text-anchor="middle" font-size="28" fill="var(--muted)" style="font-family:var(--mono)">LEAKING</text>
      <text x="${cx + r}" y="${cy + 64}" text-anchor="middle" font-size="28" fill="var(--muted)" style="font-family:var(--mono)">COMPOUNDING</text>
    </svg>`;
  };

  /* --- 20 pricing page object ------------------------------------------ */
  V.pricing = (v) => `<div class="obj obj-pricing">${L.pricing({ h: v.h, plans: v.plans })}</div>`;

  /* --- photo cover (needs CAROUSEL_AUTHOR.photo) ----------------------- */
  V.photo = (v, ctx) => ctx.author.photo
    ? `<img class="cutout" src="${esc(ctx.author.photo)}" alt="">`
    : `<div class="photo-slot"><span>Your photo here</span><small>Set CAROUSEL_AUTHOR.photo to a cut-out PNG</small></div>`;
})(typeof window !== "undefined" ? window : globalThis);
