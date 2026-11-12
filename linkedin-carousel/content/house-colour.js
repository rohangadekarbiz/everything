/*
  Colour variants of the house pilots. Same slides, three palettes:
    sun   - signal yellow ground, black type, red marker
    teal  - deep teal ground, cream type, yellow marker
    block - a different flat colour per slide (yellow, sky, pink, grey)
*/
(function () {
  const src = (window.PILOTS || []).filter((c) => /^house-(loops|metrics|myths)$/.test(c.id));
  // A palette can bring its own treatment: electric blue runs with the lime disc behind the portrait.
  const extra = { electric: { mods: ["blob"], vars: { blob: "#d9ff3b" } } };
  ["sun", "teal", "block", "electric", "lime", "tangerine", "violet", "pink", "pop"].forEach((p) => {
    src.forEach((c) => window.PILOTS.push(Object.assign({}, c, { id: `${c.id}-${p}`, palette: p }, extra[p] || {})));
  });
})();
