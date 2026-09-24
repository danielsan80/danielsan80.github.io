# danilosanchi.net

My personal site: who I am, the projects I am working on, and where to find me.

**[danilosanchi.net](https://danilosanchi.net/)**

## Pages

- `/` — the person: portrait, headline, a few lines, the highlighted projects,
  the profiles.
- `/projects` — every project, then my GitHub repositories grouped by topic.
- `/cv` — the CV, laid out to be printed. It is not linked from the site and not
  indexed: I hand the link out myself.
- `/styleguide` — the visual language of the site, for reference.

The site speaks Italian by default and English on request.

## Content

Everything the pages say lives in `src/content/` as YAML, checked against Zod
schemas at build time: a record that does not fit its schema, or a date that
does not exist, stops the build.

The same content feeds the site, the CV and my LinkedIn profile. Texts written
for one place sit under `channels` (`home`, `cv`, `linkedin`), so each record
says where its words end up.

## How it is built

Vite and React, without a router: each page is its own HTML file (`index.html`,
`projects.html`, `cv.html`) with its own React app. At build time every page is
rendered to HTML with `renderToString`, so it reads without JavaScript and
prints as it is; React then hydrates it for the language and theme controls.

The visual choices, and the reasons behind them, are in
[`doc/STILE.md`](doc/STILE.md). The
[styleguide](https://danilosanchi.net/styleguide) shows them in place — tokens,
colour scale with contrasts, spacing, type, the skill marker, the timeline. It
is generated from the palette itself on every build, so it cannot drift from
the values the site uses.

## Commands

```bash
npm install
npm run dev      # the site at localhost:5173, styleguide included
npm run check    # types, lint, format, tests, colour contrast, design tokens
npm run build    # styleguide, content check, Vite build, pre-rendering in dist/
```

## Deploy

Every push to `master` runs `npm run check` and `npm run build` on GitHub
Actions, and publishes `dist/` to GitHub Pages.

The site lives in the `danielsan80.github.io` repository on purpose: it is my
GitHub user site, and project sites such as
[QRiddle](https://danilosanchi.net/qriddle/) are served under its domain.

The previous site, a Jekyll list of links, is kept in the `v1-jekyll-2024` tag.
