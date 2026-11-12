// Export carousels to LinkedIn-ready files.
//   node export.mjs                 -> every carousel
//   node export.mjs loops metrics   -> just these ids
//   node export.mjs --check         -> also report slides whose content overflows, and composition faults on
//                                      slides with the portrait (text on the face etc.; tools/composition-check.mjs).
//                                      Exits with code 1 when anything is found.
//   node export.mjs --pdf-only      -> skip the PNGs
// Output: out/<id>.pdf (upload this as a LinkedIn document post) and out/<id>/slide-NN.png
import { createRequire } from "node:module";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import vm from "node:vm";
import { compositionCheck } from "./tools/composition-check.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// require() finds a locally installed or globally available Playwright.
const { chromium } = createRequire(import.meta.url)("playwright");
const args = process.argv.slice(2);
const check = args.includes("--check");
const pngs = !args.includes("--pdf-only");
let ids = args.filter((a) => !a.startsWith("--"));

if (!ids.length) {
  const ctx = { window: {} };
  vm.runInNewContext(await readFile(path.join(here, "content/growth-examples.js"), "utf8"), ctx);
  ids = ctx.window.CAROUSELS.map((c) => c.id);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
const problems = [];

for (const id of ids) {
  const url = pathToFileURL(path.join(here, "slide.html")).href + "?id=" + encodeURIComponent(id);
  await page.goto(url);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
  const outDir = path.join(here, "out", id);
  await mkdir(outDir, { recursive: true });

  if (check) {
    const bad = await page.evaluate(() => [...document.querySelectorAll(".slide")].flatMap((s) => {
      const main = s.querySelector(".s-main");
      const sr = s.getBoundingClientRect();
      const out = [];
      const isHook = s.classList.contains("k-hook"); // covers bleed off the edge on purpose
      if (!isHook && main.scrollHeight > main.clientHeight + 1) out.push(`slide ${s.dataset.n}: content taller than its area by ${main.scrollHeight - main.clientHeight}px`);
      s.querySelectorAll(".s-main *").forEach((el) => {
        if (el.closest(".hv")) return;
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > sr.right - 30 || r.left < sr.left + 30 || r.bottom > sr.bottom - 30)) {
          const cls = typeof el.className === "string" ? el.className : el.className.baseVal;
          out.push(`slide ${s.dataset.n}: <${el.tagName.toLowerCase()} class="${cls}"> reaches the slide edge`);
        }
      });
      return [...new Set(out)];
    }));
    bad.forEach((b) => problems.push(`${id} ${b}`));
    (await compositionCheck(page, here)).forEach((b) => problems.push(`${id} ${b}`));
  }

  if (pngs) {
    const slides = await page.$$(".slide");
    for (let i = 0; i < slides.length; i++) {
      await slides[i].screenshot({ path: path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`) });
    }
  }
  await page.pdf({ path: path.join(here, "out", `${id}.pdf`), width: "1080px", height: "1350px", printBackground: true, preferCSSPageSize: true });
  console.log(`exported ${id}`);
}

await browser.close();
if (check) console.log(problems.length ? "\nLayout problems:\n" + problems.join("\n") : "\nNo layout problems found.");
if (check && problems.length) process.exitCode = 1;
