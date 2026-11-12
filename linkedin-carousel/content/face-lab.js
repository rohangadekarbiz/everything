/*
  Face lab: covers that use the portrait without the generic pointing gesture.
  All on electric blue + lime disc.
*/
(function () {
  const loops = "Funnels leak.\nLoops compound.";
  const base = { theme: "house", chrome: false, cta: false, type: "Framework", palette: "electric", mods: ["blob"], vars: { blob: "#d9ff3b" } };
  const funnel = (x, y, w, rot, z) => ({ type: "img", src: "assets/halftone-funnel.png", x, y, w, rot, z });
  // Portraits are placed by the face: fh = face height, cx = face centre, headTop = top of the hair (defaults hang it under the headline).
  const lab = [
    // A. Close-up: the face fills the slide under the headline; only the collar is left of the body.
    ["face-close", "Close-up", { faceLead: true, title: loops, size: 152, facePos: { fh: 530, cx: 660 }, art: funnel(24, 840, 300, 8) }],
    // B. Corner: the headline stacked as tall as it goes, the face leaning in from the bottom-right corner.
    ["face-peek", "Leaning in from the corner", { faceLead: true, title: "Funnels\nleak.\nLoops\ncompound.", size: 176, facePos: { rot: -8, fh: 390, cx: 790 }, art: funnel(50, 900, 360, 4) }],
    // C. Presenter: arms crossed, confident, with the funnel held out in front like evidence.
    ["face-presenter", "Presenter with the evidence", { faceLead: true, title: loops, size: 152, facePos: { fh: 330, cx: 740 }, art: funnel(110, 860, 430, -8, 4) }],
    // D. Quote: the second line on a paper strip across the chest, like a caption pinned to the photo.
    ["face-quote", "Caption pinned across the chest", { faceLead: true, title: "Funnels leak.", size: 190, art: { type: "multi", items: [{ type: "clip", text: "Loops compound.", x: 236, y: 968, size: 92, rot: -4 }, funnel(30, 500, 340, 10)] } }],
  ];
  window.FACE_LAB = lab.map(([id, label]) => ({ id, label }));
  lab.forEach(([id, label, cover]) => window.PILOTS.push(Object.assign({}, base, { id, footer: label, slides: [Object.assign({ kind: "hCover" }, cover)] })));
})();
