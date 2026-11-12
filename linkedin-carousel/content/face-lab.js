/*
  Face lab: covers that use the portrait without the generic pointing gesture.
  All on electric blue + lime disc.
*/
(function () {
  const loops = "Funnels leak.\nLoops\ncompound.";
  const base = { theme: "house", chrome: false, cta: false, type: "Framework", palette: "electric", mods: ["blob"], vars: { blob: "#d9ff3b" } };
  const funnel = (x, y, w, rot) => ({ type: "img", src: "assets/halftone-funnel.png", x, y, w, rot });
  const lab = [
    // A. Close-up: big head and shoulders rising from the bottom edge; the crossed arms fall off the slide.
    ["face-close", "Close-up from below", { faceLead: true, title: loops, size: 168, width: 620, facePos: { src: "assets/author-arms.png", x: 330, w: 1080, bottom: -700, flip: false, rot: 0 }, art: funnel(30, 780, 380, 6) }],
    // B. Peek: half of the face slides in from the right edge, eye contact, lots of air.
    ["face-peek", "Peeking in from the edge", { faceLead: true, title: loops, size: 180, width: 700, facePos: { src: "assets/author-arms.png", x: 470, w: 980, bottom: -360, rot: -9 }, art: funnel(40, 800, 470, 4) }],
    // C. Presenter: arms crossed, confident, with the funnel held out in front like evidence.
    ["face-presenter", "Presenter with the evidence", { faceLead: true, title: loops, size: 168, width: 620, facePos: { src: "assets/author-arms.png", x: 420, w: 700, bottom: -170, rot: 0 }, art: funnel(250, 860, 470, -8) }],
    // D. Quote: the cover line on a paper strip across the chest, like a caption pinned to the photo.
    ["face-quote", "Caption pinned across the chest", { faceLead: true, title: "Funnels leak.", size: 190, width: 900, facePos: { src: "assets/author-arms.png", x: 300, w: 800, bottom: -260, rot: 0 }, art: { type: "multi", items: [{ type: "clip", text: "Loops compound.", x: 120, y: 1000, size: 92, rot: -4 }, funnel(-30, 520, 330, 10)] } }],
  ];
  window.FACE_LAB = lab.map(([id, label]) => ({ id, label }));
  lab.forEach(([id, label, cover]) => window.PILOTS.push(Object.assign({}, base, { id, footer: label, slides: [Object.assign({ kind: "hCover" }, cover)] })));
})();
