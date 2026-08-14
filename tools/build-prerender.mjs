// Fills the built HTML files with their rendered markup.
//
//   npm run prerender     run it on the current dist/ (npm run build does this)
//
// Runs after `vite build`: the HTML files it rewrites are the built ones, with
// the hashed asset URLs already in place.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PAGES,
  renderPages,
  unstyledClasses,
  writePages,
} from "./prerender.mjs";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const assetsDir = join(outDir, "assets");

const rendered = await renderPages(PAGES);

const css = readdirSync(assetsDir)
  .filter((file) => file.endsWith(".css"))
  .map((file) => readFileSync(join(assetsDir, file), "utf8"))
  .join("\n");

for (const { html, markup } of rendered) {
  const missing = unstyledClasses(markup, css);

  if (missing.length > 0) {
    console.error(
      `${html} would ship unstyled: no rule for ${missing.join(", ")}`,
    );
    process.exit(1);
  }
}

writePages(outDir, rendered);

console.log(
  `Pre-rendered in ${outDir}: ${rendered.map(({ html }) => html).join(", ")}`,
);
