// Writes the design tokens to the stylesheet the site imports.
//
//   npm run tokens          regenerate src/styles/tokens.css
//   npm run tokens -- --check   fail if it is out of date (used by npm run check)
//
// The CSS is derived data, like the palette report and the timeline positions:
// change a value in tools/tokens.mjs and regenerate, never edit the output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tokensCss } from "./tokens.mjs";

const output = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "styles",
  "tokens.css",
);

const css = tokensCss();

if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(output, "utf8");
  } catch {
    // Missing file reads as out of date, which is what we want to report.
  }

  if (current !== css) {
    console.error("src/styles/tokens.css is out of date. Run: npm run tokens");
    process.exit(1);
  }

  console.log("Tokens up to date.");
} else {
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, css);
  console.log(`Tokens written to ${output}`);
}
