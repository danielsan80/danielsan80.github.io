// Refuses to build content the pages would render wrong.
//
//   npm run check:content    run it on its own (npm run build does this first)
//
// Vite loads the rules for us: src/content/validate.ts is TypeScript, and it
// imports YAML through the plugin in vite.config.ts.

import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});

let lines;
try {
  const { contentViolations, formatViolation } = await server.ssrLoadModule(
    "/src/content/validate.ts",
  );
  lines = contentViolations(Date.now()).map(formatViolation);
} finally {
  await server.close();
}

if (lines.length > 0) {
  console.error(
    `The content is not publishable:\n${lines.map((line) => `  ${line}`).join("\n")}`,
  );
  process.exit(1);
}

console.log("Content checked: schema and dates.");
