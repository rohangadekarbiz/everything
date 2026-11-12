/*
  Style pilots built from ChatGPT elements (assets/), to pick a house style.
  Same two covers in each style: "Funnels leak. Loops compound." and "12 growth metrics".
*/
window.PILOTS = [
  /* Risograph: the illustration is the whole background */
  {
    id: "cmp-loops-riso", type: "Framework", theme: "riso", footer: "Growth loops", cta: false,
    slides: [
      { kind: "hook", bg: "assets/riso-loop.png", kicker: "Growth framework", title: "Funnels leak.\nLoops *compound.*", size: 114, visual: { type: "none" } },
    ],
  },
  /* Vox collage: halftone cut-out + paper, tape, marker */
  {
    id: "cmp-loops-vox", type: "Framework", theme: "vox", footer: "Growth loops", cta: false,
    slides: [
      { kind: "hook", kicker: "Growth framework", title: "Funnels leak.\nLoops *compound.*", size: 118, visual: { type: "voxLoopPhoto", funnel: "assets/halftone-funnel.png" } },
      { kind: "voxList", heading: "3 loops you can *build*", items: [
        { t: "Content loop", d: "Users create pages. Pages rank. Searchers sign up." },
        { t: "Referral loop", d: "Inviting a teammate is part of using the product." },
        { t: "Paid loop", d: "Revenue from new customers funds the next ads." },
      ], hand: "pick one. not three." },
    ],
  },
  /* Clay 3D: one soft object, lots of air */
  {
    id: "cmp-loops-clay", type: "Framework", theme: "clay", footer: "Growth loops", cta: false,
    slides: [
      { kind: "hook", kicker: "Growth framework", title: "Funnels leak.\nLoops *compound.*", size: 140, visual: { type: "layers", items: [{ src: "assets/clay-loop.png", x: 30, y: 40, w: 1020 }] } },
    ],
  },
  {
    id: "cmp-metrics-vox", type: "Cheat sheet", theme: "vox", footer: "Growth metrics", cta: false,
    slides: [
      { kind: "hook", kicker: "Cheat sheet · save this", title: "12 growth metrics every founder *should know.*", size: 100, visual: { type: "voxSheet", sticker: "assets/halftone-gauge-calc.png" } },
    ],
  },
  {
    id: "cmp-metrics-clay", type: "Cheat sheet", theme: "clay", footer: "Growth metrics", cta: false,
    slides: [
      { kind: "hook", kicker: "Cheat sheet · save this", title: "12 growth metrics every founder *should know.*", size: 112, visual: { type: "layers", items: [{ src: "assets/clay-tiles.png", x: 120, y: 20, w: 840 }] } },
    ],
  },
  /* Vox collage built only from code (no ChatGPT image) */
  {
    id: "vox-retention", type: "One big number", theme: "vox", footer: "Retention math", cta: false,
    slides: [
      { kind: "hook", kicker: "Retention", title: "Winning a customer costs more than *keeping one.*", size: 100, visual: { type: "voxStat" } },
    ],
  },
];
