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

Everything the pages say lives in `.private/content/` as YAML, checked against
the Zod schemas in `src/content/` at build time: a record that does not fit
its schema, or a date that does not exist, stops the build. The photos the
content points to live in `.private/photos/`, served on `/photos/` through
the `public/photos` link.

The same content feeds the site, the CV and my LinkedIn profile. Texts written
for one place sit under `channels` (`home`, `cv`, `linkedin`), so each record
says where its words end up.

`.private/` is a clone of the private `danielsan80.github.io-private`
repository, ignored by this one: some records carry notes that are never
published. Without it the site does not build.

Without access to it, `bin/install --fixtures` fills `.private/` with the
invented content of `fixtures/`, the same files with a made-up person in
them, so the site runs all the same. The fixtures are checked against the
same schemas as the real content. A `.private/` filled this way is not a
clone: to clone the private repository later, remove it first.

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
bin/install      # clones .private/ if missing, then npm install
bin/install --fixtures  # the same, with invented content instead of the clone
npm run dev      # the site at localhost:5173, styleguide included
npm run check    # types, lint, format, tests, colour contrast, design tokens
npm run build    # styleguide, content check, Vite build, pre-rendering in dist/
```

## Deploy

Every push to `master` runs `npm run check` and `npm run build` on GitHub
Actions, and publishes `dist/` to GitHub Pages.

The workflow checks out the private repository into `.private/` with a
read-only deploy key, kept in the `PRIVATE_DEPLOY_KEY` secret. To create it,
or replace it:

```bash
key=$(mktemp -d)/private-deploy-key
ssh-keygen -t ed25519 -N "" -C "danielsan80.github.io CI" -f "$key"
gh repo deploy-key add "$key.pub" -R danielsan80/danielsan80.github.io-private \
  --title "danielsan80.github.io CI"
gh secret set PRIVATE_DEPLOY_KEY -R danielsan80/danielsan80.github.io < "$key"
rm "$key" "$key.pub"
```

To replace a key, remove the old one first: `gh repo deploy-key list` and
`gh repo deploy-key delete` on the private repository.

The site lives in the `danielsan80.github.io` repository on purpose: it is my
GitHub user site, and project sites are served under its domain. Those with a
domain of their own, such as [QRiddle](https://qriddle.app), are reached
through it with a redirect: old links to `danilosanchi.net/qriddle/` keep
working.

The previous site, a Jekyll list of links, is kept in the `v1-jekyll-2024` tag.
