// Refuses to build content the pages would render wrong.
//
//   npm run check:content    run it on its own (npm run build does this first)
//
// Vite loads the rules for us: src/content/validate.ts is TypeScript, and it
// imports JSON.

import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});

let violations;
try {
  const { contentViolations } = await server.ssrLoadModule(
    "/src/content/validate.ts",
  );
  violations = contentViolations(Date.now());
} finally {
  await server.close();
}

if (violations.length > 0) {
  console.error(
    `The content is not publishable:\n${violations.map((violation) => `  ${violation}`).join("\n")}`,
  );
  process.exit(1);
}

console.log("Content checked: dates, levels and both languages.");
