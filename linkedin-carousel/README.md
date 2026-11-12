# LinkedIn carousel engine

Designs LinkedIn carousels in HTML/CSS and exports them as upload-ready PDFs (1080 × 1350, 4:5 portrait).

## Files

| Path | What it is |
|---|---|
| `content/growth-examples.js` | The carousels: copy, type, visual style. Set your name in `CAROUSEL_AUTHOR` at the top. |
| `engine/render.js` | Slide layouts (cover, list, table, funnel, matrix, chart, teardown, CTA…). |
| `engine/covers.js` | Cover ("hook") slides: a short headline plus one big visual that bleeds off the edge. |
| `engine/slides.css` | Base slide styles, the 10 visual themes and the cover styles. |
| `gallery.html` | Swipe-file page showing every carousel. Open it in a browser. |
| `slide.html` | Page the exporter renders, one carousel at a time (`slide.html?id=loops`). |
| `export.mjs` | Playwright exporter. |

## House style (no scaffolding)

`theme: "house", chrome: false, cta: false` gives the explainer-collage house style from `engine/house.js`: no header, footer, counter, kicker or swipe pill. Slide kinds: `hCover`, `hStrips`, `hCycle`, `hStatement`, `hLoop`, `hLedger`, `hMyth`, `hEnd`. Examples are in `content/house-pilot.js` (`house-loops`, `house-metrics`, `house-myths`, plus `-noface` variants of each cover).

`chrome: false` works on any carousel and drops the header/footer. `CAROUSEL_AUTHOR.photo` is the author's background-removed portrait (ideally a B&W halftone cut-out with a white sticker border); it stands on the bottom edge of the cover and closing slide. `face: false` on a carousel leaves it out. `tools/make_placeholder.py` regenerates the neutral placeholder, `tools/contact_sheet.py out/review.png <id>…` builds a contact sheet.

## Export

```sh
node export.mjs --check            # all carousels, plus a layout check
node export.mjs loops metrics      # only these ids
node export.mjs --pdf-only         # skip the per-slide PNGs
```

Output goes to `out/` (git-ignored): `out/<id>.pdf` to upload as a LinkedIn document post, and `out/<id>/slide-NN.png` per slide. `--check` lists any slide whose content runs past its area or into the edge margin. Cover visuals are allowed to bleed off the edge.

Needs Node 18+ and Playwright with Chromium (`npm i -D playwright && npx playwright install chromium` if it isn't already available). Fonts load from Google Fonts, so the export needs internet access.

## Add a carousel

Add an object to `window.CAROUSELS`:

```js
{
  id: "my-post", type: "Cheat sheet", theme: "sheet", goal: "saves",
  why: "…", steal: "…", footer: "Short topic label",
  slides: [
    { kind: "cover", kicker: "Cheat sheet", title: "Big claim with a *highlight*", sub: "One-line promise." },
    { kind: "list", heading: "Three things", items: [{ t: "Title", d: "One line." }] },
  ],
}
```

A closing follow/repost/save slide is added automatically (`cta: false` turns it off, or pass an object to change its copy).

Themes: `blueprint`, `sheet`, `lab`, `oxblood`, `grid`, `board`, `cobalt`, `dict`, `dash`, `mustard`.

Cover visuals (`kind: "hook"`, `visual: { type }`): `loop`, `sheet`, `stamp`, `mythlist`, `beforeafter`, `stickies`, `bars`, `options`, `matrix`, `letters`, `route`, `clipboard`, `cards`, `strike`, `chart`, `entry`, `quote`, `fanout`, `gauge`, `pricing`, `photo` (set `CAROUSEL_AUTHOR.photo` to a cut-out PNG).

Slide kinds: `hook`, `cover`, `bigstat`, `poster`, `list`, `table`, `mythfact`, `checks`, `hooks`, `timeline`, `dict`, `quote`, `kpis`, `scorecard`, `scorekey`, `stickies`, `matrix`, `funnel`, `leak`, `expcard`, `hero`, `pricing`, `pinlist`, `flow`, `ladder`, `loops`, `curves`, `linechart`, `cta`. See `content/growth-examples.js` for an example of each.

Text shortcuts: `*word*` highlights, `\n` breaks a line, `{blank}` draws a fill-in slot (in `hooks`).
