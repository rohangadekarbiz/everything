/*
  Colour variants of the house pilots. Same slides, three palettes:
    sun   - signal yellow ground, black type, red marker
    teal  - deep teal ground, cream type, yellow marker
    block - a different flat colour per slide (yellow, sky, pink, grey)
*/
(function () {
  const src = (window.PILOTS || []).filter((c) => /^house-(loops|metrics|myths)$/.test(c.id));
  ["sun", "teal", "block"].forEach((p) => {
    src.forEach((c) => window.PILOTS.push(Object.assign({}, c, { id: `${c.id}-${p}`, palette: p })));
  });
})();
