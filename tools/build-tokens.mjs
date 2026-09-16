// Writes the design tokens to the stylesheet the site imports.
//
//   npm run tokens          regenerate src/styles/tokens.css
//   npm run tokens -- --check   fail if it is out of date (used by npm run check)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
  const current = existsSync(output) ? readFileSync(output, "utf8") : "";

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
