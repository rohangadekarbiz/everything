/*
  Carousel renderer. Turns carousel data into slide HTML strings.
  Used by the gallery page (preview) and slide.html (PDF/PNG export).

  Text helpers: *word* -> highlighted, \n -> line break, {slot} -> fill-in blank (hooks only).
*/
(function (root) {
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (s) => esc(s).replace(/\*(.+?)\*/g, '<em class="hl">$1</em>').replace(/\n/g, "<br>");
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- layouts ---------- */
  const L = {};

  L.cover = (s) => `
    <div class="cover-top">
      ${s.kicker ? `<p class="kicker">${fmt(s.kicker)}</p>` : ""}
      <h1 class="title" ${s.size ? `style="--ts:${s.size}px"` : ""}>${fmt(s.title)}</h1>
    </div>
    <div class="cover-bottom">
      ${s.sub ? `<p class="sub">${fmt(s.sub)}</p>` : ""}
      ${s.tag ? `<span class="tag-sample">${esc(s.tag)}</span>` : ""}
    </div>`;

  L.bigstat = (s) => `
    <div>
      ${s.kicker ? `<p class="kicker">${fmt(s.kicker)}</p>` : ""}
      <p class="bignum">${fmt(s.num)}</p>
      <p class="bigtext">${fmt(s.text)}</p>
    </div>
    <p class="note">${fmt(s.source)}</p>`;

  L.poster = (s) => (s.lines || [s.text]).map((t) => `<p class="poster">${fmt(t)}</p>`).join("");

  const heading = (s) => (s.heading ? `<h2 class="h2">${fmt(s.heading)}</h2>` : "") + (s.lede ? `<p class="lede">${fmt(s.lede)}</p>` : "");
  const note = (s) => (s.note ? `<p class="note">${fmt(s.note)}</p>` : "");

  L.list = (s) => `${heading(s)}
    <ol class="list ${s.numbered === false ? "no-num" : ""}">
      ${s.items.map((it, i) => `<li>${s.numbered === false ? "" : `<span class="n">${pad((s.start || 1) + i)}</span>`}<p class="t">${fmt(it.t)}</p>${it.d ? `<p class="d">${fmt(it.d)}</p>` : ""}</li>`).join("")}
    </ol>${note(s)}`;

  L.table = (s, ctx) => {
    const sheet = ctx.theme === "sheet";
    const letters = "ABCDEFGH";
    const head = `<tr>${sheet ? '<th class="cl"></th>' : ""}${s.cols.map((c) => `<th>${fmt(c)}</th>`).join("")}</tr>`;
    const letterRow = sheet ? `<tr><td class="cl"></td>${s.cols.map((_, i) => `<td class="cl">${letters[i]}</td>`).join("")}</tr>` : "";
    const rows = s.rows.map((r, ri) => `<tr class="${s.select === ri ? "sel" : ""}">${sheet ? `<td class="rn">${ri + 2}</td>` : ""}${r.map((c, ci) => `<td class="${(s.numCols || []).includes(ci) ? "num" : ""} ${s.scoreCol === ci ? "num score" : ""}">${fmt(c)}</td>`).join("")}</tr>`).join("");
    const formula = sheet && s.formula ? `<div class="formula"><span>fx</span><span>${esc(s.formula)}</span></div>` : "";
    return `${heading(s)}${formula}<table class="tbl" ${s.widths ? "" : ""}>
      ${s.widths ? `<colgroup>${sheet ? '<col style="width:60px">' : ""}${s.widths.map((w) => `<col style="width:${w}">`).join("")}</colgroup>` : ""}
      <thead>${letterRow}${head}</thead><tbody>${rows}</tbody></table>${note(s)}`;
  };

  L.mythfact = (s) => `${heading(s)}<ol class="mf">${s.pairs.map((p) => `
      <li><span class="lab">Myth</span><p class="myth">${fmt(p.m)}</p><span class="lab" style="margin-top:10px">Fact</span><p class="fact">${fmt(p.f)}</p></li>`).join("")}</ol>${note(s)}`;

  L.checks = (s) => `${heading(s)}<div class="checks">${s.groups.map((g) => `
      <div><p class="g">${fmt(g.g)}</p><ul>${g.items.map((it) => `<li><span class="box"></span><span>${fmt(it)}</span></li>`).join("")}</ul></div>`).join("")}</div>${note(s)}`;

  L.hooks = (s) => `${heading(s)}<ol class="hooks">${s.items.map((h, i) => `
      <li><span class="n">${pad((s.start || 1) + i)}</span><p>${esc(h).replace(/\{(.+?)\}/g, '<span class="slot">$1</span>')}</p></li>`).join("")}</ol>${note(s)}`;

  L.timeline = (s) => `${heading(s)}<ol class="tl">${s.stages.map((st) => `
      <li><p class="at">${fmt(st.at)}</p><p class="t">${fmt(st.t)}</p><p class="d">${fmt(st.d)}</p></li>`).join("")}</ol>${note(s)}`;

  L.dict = (s) => `${heading(s)}<ol class="dict">${s.entries.map((e) => `
      <li><p><span class="w">${fmt(e.w)}</span><span class="p">${esc(e.p)}</span></p><p class="d">${fmt(e.d)}</p>${e.e ? `<p class="e">${fmt(e.e)}</p>` : ""}</li>`).join("")}</ol>${note(s)}`;

  L.quote = (s) => `<div><p class="qmark">“</p><p class="quote">${fmt(s.text)}</p>
      <div class="quote-by"><span class="who">${fmt(s.who)}</span><span class="src">${fmt(s.src)}</span></div></div>`;

  L.kpis = (s) => `
    <div style="display:flex;flex-direction:column;gap:40px">
      ${s.kicker ? `<p class="kicker">${fmt(s.kicker)}</p>` : ""}
      <h1 class="title" style="--ts:${s.size || 92}px">${fmt(s.title)}</h1>
    </div>
    <div class="kpis" style="margin-top:auto">${s.tiles.map((t) => `
      <div class="kpi"><span class="l">${fmt(t.label)}</span><span class="b">${fmt(t.before)}</span><span class="a">${fmt(t.after)}</span></div>`).join("")}</div>`;

  L.scorecard = (s) => `${heading(s)}<ol class="score-rows">${s.rows.map((q, i) => `
      <li><p class="q"><b>${pad(i + 1)}</b>${fmt(q)}</p><div class="boxes">${[1, 2, 3, 4, 5].map((n) => `<span>${n}</span>`).join("")}</div></li>`).join("")}</ol>${note(s)}`;

  L.scorekey = (s) => `${heading(s)}<div class="bands">${s.bands.map((b) => `
      <div class="band"><span class="r">${fmt(b.r)}</span><div><p class="t">${fmt(b.t)}</p><p class="d">${fmt(b.d)}</p></div></div>`).join("")}</div>${note(s)}`;

  L.stickies = (s) => `${heading(s)}<div class="stickies">${s.items.map((t, i) => `
      <div class="sticky"><span class="n">${pad((s.start || 1) + i)}</span><span>${fmt(t)}</span></div>`).join("")}
      ${s.hand ? `<p class="handnote" style="align-self:center;padding:10px 0 0 10px">${fmt(s.hand)}</p>` : ""}</div>${note(s)}`;

  L.matrix = (s) => `${heading(s)}<div class="matrix-wrap">
      <span class="ylab">${esc(s.y)}</span>
      <div class="matrix">${s.quads.map((q) => `
        <div class="quad"><h3>${fmt(q.t)}<small>${fmt(q.s)}</small></h3>${q.items.map((it) => `<span class="mini">${fmt(it)}</span>`).join("")}</div>`).join("")}</div>
      <span class="xlab">${esc(s.x)}</span></div>`;

  L.funnel = (s) => `${heading(s)}<ol class="funnel">${s.stages.map((st, i) => {
      const w = 420 - i * 52;
      return `<li><div class="bar" style="width:${w}px"><b>${esc(st.n[0])}</b><span>${esc(st.n)}</span></div><p class="q">${fmt(st.q)}</p></li>`;
    }).join("")}</ol>${note(s)}`;

  L.leak = (s) => `${heading(s)}<ol class="leak">${s.rows.map((r) => `
      <li class="${r.leak ? "is-leak" : ""}">
        <div class="row1"><span>${fmt(r.l)}</span><b>${r.v}%</b></div>
        <div class="track"><div class="fill" style="width:${r.v}%"></div><div class="tgt" style="left:${r.t}%"></div></div>
        <span class="tgtl">target ${r.t}%${r.leak ? " · biggest gap" : ""}</span>
      </li>`).join("")}</ol>${note(s)}`;

  L.expcard = (s) => `
    <ol class="steps-mini">${s.steps.map((st, i) => `<li><span class="n">${pad((s.start || 1) + i)}</span><span>${fmt(st)}</span></li>`).join("")}</ol>
    <div class="exp">
      <div class="id"><span>${esc(s.card.id)}</span><span class="tag-sample">Sample data</span></div>
      <h3>${fmt(s.card.title)}</h3>
      <dl>${s.card.fields.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${fmt(v)}</dd>`).join("")}</dl>
      <span class="chip">${esc(s.card.result)}</span>
    </div>`;

  // Annotation pins sit inside the element they point at, so they never drift.
  const pin = (n, where, muted) => `<span class="pin at-${where}"${muted ? ' style="background:var(--muted)"' : ""}>${n}</span>`;

  L.hero = (s) => {
    const m = s.state === "before";
    return `
    <p class="state ${s.state}">${m ? "BEFORE" : "AFTER"}</p>
    <div class="mock">
      <div class="bar"><i></i><i></i><i></i><u></u></div>
      <div class="page has-pins">
        <div class="nav"><b>${esc(s.brand)}</b><span>Product&nbsp;&nbsp;&nbsp;Pricing&nbsp;&nbsp;&nbsp;Log in</span></div>
        <p class="h">${fmt(s.h)}${pin(1, "right", m)}</p>
        <p class="s">${fmt(s.s)}${pin(2, "right", m)}</p>
        <span class="btn">${esc(s.cta)}${pin(3, "btn", m)}</span>
      </div>
    </div>
    <ol class="pin-notes"${m ? ' style="--pin:var(--muted)"' : ""}>${s.notes.map((n, i) => `<li><span class="pin"${m ? ' style="background:var(--muted)"' : ""}>${i + 1}</span><span>${fmt(n)}</span></li>`).join("")}</ol>
    ${note(s)}`;
  };

  L.pricing = (s) => `${heading(s)}
    <div class="mock">
      <div class="bar"><i></i><i></i><i></i><u></u></div>
      <div class="page" style="gap:34px">
        <p class="h" style="font-size:50px;text-align:center">${fmt(s.h)}</p>
        <div class="price-toggle"><span>Monthly</span><span class="on">Annual <em>2 months free</em></span>${pin(1, "corner")}</div>
        <div class="plans">${s.plans.map((p, i) => `
          <div class="plan ${p.pop ? "pop" : ""}">${p.pop ? '<span class="badge">Most popular</span>' + pin(2, "corner") : ""}
            <span class="pn">${esc(p.n)}${i === 0 ? pin(3, "left") : ""}</span><span class="pf">${esc(p.f)}</span>
            <span class="pp">$${p.p}<small> /mo</small></span><span class="pf" style="min-height:0">billed yearly</span><span class="pb">${p.pop ? "Start trial" : "Choose"}</span></div>`).join("")}</div>
      </div>
    </div>${note(s)}`;

  L.pinlist = (s) => `${heading(s)}<ol class="pin-notes" style="margin-top:0;gap:48px">${s.items.map((it, i) => `
      <li><span class="pin">${i + 1}</span><span>${fmt(it.t)}<small>${fmt(it.d)}</small></span></li>`).join("")}</ol>${note(s)}`;

  L.flow = (s) => `${heading(s)}<ol class="flow">${s.nodes.map((n, i) => `
      <li class="${i === s.nodes.length - 1 ? "goal" : ""}"><div class="node">${fmt(n.t)}</div><span class="fnote">${n.note ? "← " + fmt(n.note) : ""}</span></li>
      ${i < s.nodes.length - 1 ? '<li aria-hidden="true"><div class="arrow"></div><span></span></li>' : ""}`).join("")}</ol>${note(s)}`;

  L.ladder = (s) => `${heading(s)}<ol class="ladder">${s.steps.map((t, i) => `<li><span class="n">${pad(i + 1)}</span><span>${fmt(t)}</span></li>`).join("")}</ol>${note(s)}`;

  /* ---------- SVG diagrams ---------- */

  L.loops = (s) => {
    const W = 904, H = 640;
    const funnel = [ ["Ad spend", 400], ["Visitors", 320], ["Sign-ups", 240], ["Customers", 160] ]
      .map(([t, w], i) => {
        const y = 80 + i * 104, x = 210 - w / 2;
        return `<rect x="${x}" y="${y}" width="${w}" height="84" fill="rgba(124,196,255,.08)" stroke="var(--accent)" stroke-width="3"/>
                <text x="210" y="${y + 53}" text-anchor="middle" font-size="30" fill="var(--ink)" style="font-family:var(--body);font-weight:600">${t}</text>`;
      }).join("");
    const cx = 690, cy = 330, r = 150;
    const nodes = [ [-90, "New user"], [30, "Shares or|creates"], [150, "Others|discover it"] ];
    const nodeSvg = nodes.map(([a, t]) => {
      const rad = (a * Math.PI) / 180, x = cx + r * Math.cos(rad), y = cy + r * Math.sin(rad);
      const lines = t.split("|");
      const h = 40 + lines.length * 34;
      return `<rect x="${x - 92}" y="${y - h / 2}" width="184" height="${h}" fill="var(--bg)" stroke="var(--ink)" stroke-width="3"/>
        ${lines.map((ln, i) => `<text x="${x}" y="${y - (lines.length - 1) * 17 + i * 34 + 10}" text-anchor="middle" font-size="27" fill="var(--ink)" style="font-family:var(--body);font-weight:600">${ln}</text>`).join("")}`;
    }).join("");
    const heads = [-30, 90, 210].map((a) => {
      const rad = (a * Math.PI) / 180, x = cx + r * Math.cos(rad), y = cy + r * Math.sin(rad);
      return `<path d="M -16 -13 L 16 0 L -16 13 Z" fill="var(--accent)" transform="translate(${x} ${y}) rotate(${a + 90})"/>`;
    }).join("");
    return `${heading(s)}
      <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="A funnel ends at customers; a loop feeds new users back in">
        <text x="0" y="30" font-size="26" fill="var(--muted)" letter-spacing="3">FUNNEL</text>
        <text x="${W}" y="30" font-size="26" fill="var(--muted)" letter-spacing="3" text-anchor="end">LOOP</text>
        ${funnel}
        <text x="210" y="${80 + 4 * 104 + 56}" text-anchor="middle" font-size="40" fill="var(--warn, #ffc24b)" style="font-family:var(--hand);font-weight:700">…and then it stops.</text>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--accent)" stroke-width="4"/>
        ${heads}${nodeSvg}
        <text x="${cx}" y="${cy + r + 130}" text-anchor="middle" font-size="40" fill="var(--warn, #ffc24b)" style="font-family:var(--hand);font-weight:700">every output feeds the next input</text>
      </svg>${note(s)}`;
  };

  // Generic line chart. series: [{pts:[...], label, color}], x labels, y max
  function lineChart({ series, xLabels, yMax, yTicks, ySuffix = "", W = 904, H = 680, endLabels = true, pointLabels = false }) {
    const m = { l: 92, r: endLabels ? 230 : 40, t: 30, b: 70 };
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    const n = series[0].pts.length;
    const X = (i) => m.l + (pw * i) / (n - 1);
    const Y = (v) => m.t + ph - (ph * v) / yMax;
    const grid = yTicks.map((t) => `<line x1="${m.l}" x2="${m.l + pw}" y1="${Y(t)}" y2="${Y(t)}" stroke="var(--line)" stroke-width="2"/>
      <text x="${m.l - 18}" y="${Y(t) + 9}" text-anchor="end" font-size="25" fill="var(--muted)">${t}${ySuffix}</text>`).join("");
    const xl = xLabels.map(([i, t]) => `<text x="${X(i)}" y="${m.t + ph + 50}" text-anchor="middle" font-size="25" fill="var(--muted)">${t}</text>`).join("");
    const lines = series.map((s) => {
      const d = s.pts.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
      const last = s.pts[n - 1];
      const lab = endLabels ? (s.label || "").split("|").map((ln, k) => `<text x="${X(n - 1) + 22}" y="${Y(last) + 9 + k * 32 + (s.dy || 0)}" font-size="26" fill="${s.color}" style="font-family:var(--body);font-weight:700">${ln}</text>`).join("") : "";
      const pts = pointLabels ? s.pts.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="10" fill="var(--card, #fff)" stroke="${s.color}" stroke-width="5"/>
          <text x="${X(i)}" y="${Y(v) - 26}" text-anchor="middle" font-size="30" font-weight="700" fill="var(--ink)">${v}</text>`).join("") : `<circle cx="${X(n - 1)}" cy="${Y(last)}" r="9" fill="${s.color}"/>`;
      return `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>${pts}${lab}`;
    }).join("");
    return `<svg class="chart" viewBox="0 0 ${W} ${H}">${grid}<line x1="${m.l}" x2="${m.l + pw}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--ink)" stroke-width="3"/>${xl}${lines}</svg>`;
  }

  L.curves = (s) => `${heading(s)}${lineChart({
      series: [
        { pts: s.a, label: s.aLabel, color: "var(--accent)" },
        { pts: s.b, label: s.bLabel, color: "var(--ink2)", dy: -10 },
      ],
      xLabels: [[0, "M0"], [3, "M3"], [6, "M6"], [9, "M9"], [12, "M12"]],
      yMax: 100, yTicks: [0, 25, 50, 75, 100], ySuffix: "%",
    })}<p class="note" style="margin-top:20px">${fmt(s.note || "")}</p>`;

  L.linechart = (s) => `${heading(s)}<div class="chart-card">${lineChart({
      series: [{ pts: s.pts, color: "var(--accent)" }],
      xLabels: s.labels.map((t, i) => [i, t]), yMax: s.yMax, yTicks: s.yTicks,
      endLabels: false, pointLabels: true, H: 620,
    })}</div>${note(s)}`;

  /* ---------- CTA ---------- */
  L.cta = (s, ctx) => `
    <div style="display:flex;flex-direction:column;gap:44px">
      <h2 class="title" style="--ts:${ctx.theme === "mustard" ? 150 : 112}px">${fmt(s.title || "Found this useful?")}</h2>
    </div>
    <ul class="cta-acts">
      <li><b>Repost</b><span>${fmt(s.repost || "so your team sees it too.")}</span></li>
      <li><b>Save</b><span>${fmt(s.save || "for your next planning session.")}</span></li>
    </ul>
    <div class="cta-who"><span class="av">${esc(ctx.author.initials)}</span>
      <div><p class="nm">Follow ${esc(ctx.author.name)}</p><p class="rl">${esc(ctx.author.promise)}</p></div></div>`;

  /* ---------- assembly ---------- */
  function renderCarousel(c, author) {
    const slides = c.slides.concat(c.cta === false ? [] : [Object.assign({ kind: "cta" }, c.cta || {})]);
    const total = slides.length;
    const ctx = { theme: c.theme, author, carousel: c, total };
    // c.chrome === false drops the header/footer scaffolding: the slide carries only its content.
    const chrome = c.chrome !== false;
    return slides.map((s, i) => {
      const fn = L[s.kind];
      if (!fn) throw new Error(`Unknown slide kind: ${s.kind}`);
      const last = i === total - 1;
      ctx.index = i;
      // A layout returns its HTML, or { main, art, cls } where art is a full-slide layer that may bleed off the edges.
      const out = fn(s, ctx);
      const main = typeof out === "string" ? out : out.main;
      const art = typeof out === "string" || !out.art ? "" : `<div class="s-art hv">${out.art}</div>`;
      const cls = typeof out === "string" || !out.cls ? "" : " " + out.cls;
      // s.bg: a full-bleed background image (e.g. an illustration with space left for the headline).
      const bg = s.bg ? ` style="background-image:url('${esc(s.bg)}');background-size:cover;background-position:center bottom"` : "";
      // c.palette: a colour variant of the theme; "pal-iN" lets a palette cycle backgrounds slide by slide.
      const pal = c.palette ? ` pal-${c.palette} pal-i${i % 4}${i === 0 ? " pal-first" : ""}${last ? " pal-last" : ""}` : "";
      return `<section class="slide t-${c.theme} k-${s.kind}${s.bg ? " has-bg" : ""}${chrome ? "" : " no-chrome"}${cls}${pal}" data-carousel="${esc(c.id)}" data-n="${i + 1}"${bg}>
        ${chrome ? `<header class="s-top"><span class="who"><span class="mark">${esc(author.initials)}</span>${esc(author.name)}</span><span>${pad(i + 1)} / ${pad(total)}</span></header>` : ""}
        ${art}<div class="s-main">${main}</div>
        ${chrome ? `<footer class="s-foot"><span>${esc(c.footer || c.type)}</span><span class="swipe">${last ? "" : i === 0 ? "Swipe →" : "→"}</span></footer>` : ""}
      </section>`;
    });
  }

  root.Carousel = { renderCarousel, layouts: L };
})(typeof window !== "undefined" ? window : globalThis);
