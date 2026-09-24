// Renders each page to HTML at build time.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

export const PAGES = [
  {
    html: "index.html",
    module: "/src/pages/home/HomePage.tsx",
    component: "HomePage",
  },
  {
    html: "projects.html",
    module: "/src/pages/projects/ProjectsPage.tsx",
    component: "ProjectsPage",
  },
  {
    html: "cv.html",
    module: "/src/pages/cv/CvPage.tsx",
    component: "CvPage",
  },
];

const ROOT_ELEMENT = '<div id="root"></div>';

export function injectMarkup(template, markup) {
  if (!template.includes(ROOT_ELEMENT)) {
    throw new Error(`Missing ${ROOT_ELEMENT} in the page template`);
  }

  return template.replace(ROOT_ELEMENT, `<div id="root">${markup}</div>`);
}

// Vite in middleware mode gives us its module loader — TSX and CSS modules
// included — without serving anything.
export async function renderPages(pages) {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  try {
    const rendered = [];

    for (const page of pages) {
      const module = await server.ssrLoadModule(page.module);
      const Page = module[page.component];

      if (!Page) {
        throw new Error(`${page.module} has no export ${page.component}`);
      }

      rendered.push({
        html: page.html,
        markup: renderToString(createElement(Page)),
      });
    }

    return rendered;
  } finally {
    await server.close();
  }
}

// The markup gets its class names from Vite's module loader, the stylesheet
// from the build. The two hash CSS modules the same way today, and nothing
// enforces it: if they ever drifted the page would ship unstyled and still
// look fine to every other check.
export function unstyledClasses(markup, css) {
  const used = [...markup.matchAll(/class="([^"]*)"/g)].flatMap(([, value]) =>
    value.split(/\s+/).filter(Boolean),
  );

  return [...new Set(used)].filter((name) => !css.includes(`.${name}`)).sort();
}

export function writePages(outDir, rendered) {
  for (const { html, markup } of rendered) {
    const file = join(outDir, html);
    writeFileSync(file, injectMarkup(readFileSync(file, "utf8"), markup));
  }
}
