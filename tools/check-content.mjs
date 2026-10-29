// Refuses to build content the pages would render wrong.
//
//   npm run check:content    run it on its own (npm run build does this first)
//
// Vite loads the rules for us: src/content/validate.ts is TypeScript, and it
// imports YAML through the plugin in vite.config.ts. The with-notes mode is
// the only one that keeps the private notes, so they are checked too. The
// fixtures, which stand in for the content in a public clone, are checked
// against the same rules, so they cannot fall behind the schemas.

import { createServer } from "vite";

const server = await createServer({
  mode: "with-notes",
  server: { middlewareMode: true },
  appType: "custom",
});

let lines;
try {
  const { contentViolations, formatViolation, siteContent } =
    await server.ssrLoadModule("/src/content/validate.ts");
  const { fixtureContent } = await server.ssrLoadModule(
    "/src/content/fixtures.ts",
  );
  const today = Date.now();
  lines = [
    ...contentViolations(siteContent, today).map(formatViolation),
    ...contentViolations(fixtureContent, today).map(
      (violation) => `fixtures: ${formatViolation(violation)}`,
    ),
  ];
} finally {
  await server.close();
}

if (lines.length > 0) {
  console.error(
    `The content is not publishable:\n${lines.map((line) => `  ${line}`).join("\n")}`,
  );
  process.exit(1);
}

console.log("Content and fixtures checked: schema and dates.");
