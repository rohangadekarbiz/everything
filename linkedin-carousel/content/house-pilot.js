/*
  House-style pilots (theme "house", engine/house.js): explainer collage with the
  scaffolding removed. Copy is the approved copy from growth-examples.js, re-paced
  to one idea per slide. Each carousel also gets a "-noface" cover for comparison.
*/
(function () {
  const base = { theme: "house", chrome: false, cta: false };
  const house = [
    {
      id: "house-loops", type: "Framework", ...base,
      slides: [
        { kind: "hCover", title: "Funnels leak.\nLoops\ncompound.", size: 196, art: { type: "funnelLoop", src: "assets/halftone-funnel.png" } },
        { kind: "hStrips", title: "A funnel ends.", stages: ["Ad spend", "Visitors", "Sign-ups", "Customers"], hand: "…and then it stops." },
        { kind: "hCycle", title: "A loop feeds itself.", nodes: ["New user", "Shares or\ncreates", "Others\ndiscover it"], hand: "every output feeds the next input", note: "Loop model popularised by Reforge." },
        { kind: "hStatement", title: "3 loops you can build" },
        { kind: "hLoop", n: "1", title: "Content loop", steps: ["Users create pages.", "Pages rank in search.", "Searchers sign up."] },
        { kind: "hLoop", n: "2", title: "Referral loop", steps: ["Inviting a teammate is part of using the product."] },
        { kind: "hLoop", n: "3", title: "Paid loop", steps: ["Revenue from new customers funds the next round of ads."] },
        { kind: "hEnd" },
      ],
    },
    {
      id: "house-metrics", type: "Cheat sheet", ...base,
      slides: [
        { kind: "hCover", num: "12", title: "growth metrics every founder should know.", size: 112, width: 640, by: "left", art: { type: "gauge", src: "assets/halftone-gauge-calc.png" }, facePos: { x: 40, w: 340, rot: -3, tagX: 70, tagY: 1250, tagRot: -4 } },
        { kind: "hLedger", title: "Unit economics", size: 130, select: 1, rows: [
          ["CAC", "Sales + marketing spend ÷ new customers", "Falling over time"],
          ["LTV", "ARPA × gross margin ÷ churn rate", "3× CAC or more"],
          ["CAC payback", "CAC ÷ (ARPA × gross margin)", "Under 12 months"],
        ] },
        { kind: "hLedger", title: "Unit economics", size: 130, rows: [
          ["Burn multiple", "Net burn ÷ net new ARR", "Under 1.5×"],
          ["Magic number", "Net new ARR in quarter ÷ last quarter's S&M spend", "Above 0.75"],
          ["Trial → paid", "New customers ÷ trials started", "Beat last quarter"],
        ] },
        { kind: "hLedger", title: "Retention & engagement", size: 104, ink: true, select: 2, rows: [
          ["Activation", "Activated users ÷ sign-ups", "Rising each month"],
          ["Logo churn", "Customers lost ÷ customers at start", "Lower each cohort"],
          ["NRR", "(Start MRR + expansion − contraction − churn) ÷ start", "Above 100%"],
        ] },
        { kind: "hLedger", title: "Retention & engagement", size: 104, ink: true, rows: [
          ["GRR", "(Start MRR − contraction − churn) ÷ start", "Above 85%"],
          ["Quick ratio", "(New + expansion) ÷ (churn + contraction)", "4 or higher"],
          ["DAU / MAU", "Daily actives ÷ monthly actives", "20%+ for daily tools"],
        ], note: "Rules of thumb vary by stage. Compare with your own trend first." },
        { kind: "hEnd" },
      ],
    },
    {
      id: "house-myths", type: "Myth vs fact", ...base,
      slides: [
        { kind: "hCover", title: "5 growth myths worth unlearning.", size: 168, art: { type: "mythPile", items: ["More traffic fixes growth.", "Going viral is luck.", "Growth is marketing's job.", "Copy what worked for them.", "A/B test everything."] } },
        { kind: "hMyth", n: "1", myth: "More traffic will fix growth.", fact: "If activation is broken, more traffic just leaks faster.", paper: "news", rot: -2.5, seed: 5, w: 860, size: 136 },
        { kind: "hMyth", n: "2", myth: "Going viral is luck.", fact: "Virality is designed: who gets invited, when, and why they say yes.", paper: "pad", rot: 3, seed: 8, w: 760, x: 160, size: 120 },
        { kind: "hMyth", n: "3", myth: "Growth is marketing's job.", fact: "Growth is product, marketing and sales running one system.", paper: "card", rot: -1.5, seed: 11, w: 840, x: 30, size: 132 },
        { kind: "hMyth", n: "4", myth: "Copy what worked for them.", fact: "Their playbook fit their audience, stage and budget.", paper: "news", rot: 2, seed: 14, w: 800, x: 120, size: 140 },
        { kind: "hMyth", n: "5", myth: "A/B test everything.", fact: "Low traffic? Make bigger changes and talk to customers.", paper: "pad", rot: -3, seed: 17, w: 740, size: 136 },
        { kind: "hEnd" },
      ],
    },
  ];
  // Same covers without the author's portrait, to compare.
  const noFace = house.map((c) => ({ ...c, id: c.id + "-noface", face: false, slides: [c.slides[0], c.slides[c.slides.length - 1]] }));
  window.PILOTS = (window.PILOTS || []).concat(house, noFace);
})();
