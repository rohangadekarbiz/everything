/*
  Colour lab: the same face-led cover in 12 colour treatments.
  Each entry = a palette (pal-*) + optional treatments (mod-*) + colour variables.
*/
(function () {
  const cover = (window.PILOTS || []).find((c) => c.id === "house-loops").slides[0];
  const base = { theme: "house", chrome: false, cta: false, type: "Framework", slides: [cover] };
  const lab = [
    ["col-01", "Electric blue + lime disc", "electric", ["blob"], { blob: "#d9ff3b" }],
    ["col-02", "Electric blue + orange arch", "electric", ["arch"], { blob: "#ff5a1f" }],
    ["col-03", "Lime + blue-ink portrait", "lime", ["duo"], { "duo-h": "190deg", "duo-s": "7" }],
    ["col-04", "Blue / lime diagonal split", "electric", ["split"], { bg2: "#d9ff3b" }],
    ["col-05", "Sunset grain gradient", "tangerine", ["grad"], { g2: "#ff3e9a", g3: "#ffd23f" }],
    ["col-06", "Violet + lime headline + pink disc", "violet", ["titlecol", "blob"], { titlecol: "#d9ff3b", blob: "#ff7ac8" }],
    ["col-07", "Hot pink + blue disc", "pink", ["blob"], { blob: "#2448ff" }],
    ["col-08", "Tangerine, portrait printed on colour", "tangerine", ["print"], {}],
    ["col-09", "Warm paper + blue headline + orange disc", null, ["titlecol", "blob"], { bg: "#f3efe6", titlecol: "#2448ff", blob: "#ff5a1f" }],
    ["col-10", "Electric blue + lime headline card", "electric", ["panel"], { panel: "#d9ff3b" }],
    ["col-11", "Blue + lime frame + pink disc", "electric", ["frame", "blob"], { frame: "#d9ff3b", blob: "#ff4fa8" }],
    ["col-12", "Night + orange headline + orange disc", "electric", ["titlecol", "blob"], { bg: "#0e0e12", titlecol: "#ff5a1f", blob: "#ff5a1f" }],
  ];
  window.COLOUR_LAB = lab.map(([id, label]) => ({ id, label }));
  lab.forEach(([id, label, palette, mods, vars]) => {
    window.PILOTS.push(Object.assign({}, base, { id, footer: label, palette: palette || undefined, mods, vars }));
  });
})();
