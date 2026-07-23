// Builds tools/styleguide.html from the palette definitions, so the preview can
// never drift from the real values. Fonts come from the @fontsource devDeps.
//
// Run: npm run styleguide

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  palette,
  semantic,
  MINIMUM_CONTRAST,
  contrastOnSurface,
} from "./palette.mjs";

const THEMES = ["light", "dark"];

const FONT_PAIRS = {
  plex: {
    label: "IBM Plex",
    sans: { family: "IBM Plex Sans", package: "ibm-plex-sans" },
    mono: { family: "IBM Plex Mono", package: "ibm-plex-mono" },
    note: "Disegnati insieme, brief “uomo e macchina”. Il mono è largo e squadrato.",
  },
  public: {
    label: "Public Sans + Commit Mono",
    sans: { family: "Public Sans", package: "public-sans" },
    mono: { family: "Commit Mono", package: "commit-mono" },
    note: "Public Sans nasce per la pubblica amministrazione USA: neutro, molto leggibile. Commit Mono è stretto e recente.",
  },
};

const WEIGHTS = [400, 600];

// Real entries from the CV, with the corrections agreed in session: Facile.it
// closed in Mar 2026, QMates ran Apr-Jul 2026. Overlaps are intentional.
const ENGAGEMENTS = [
  { org: "QMates", role: "Consulente", start: [2026, 4], end: [2026, 7] },
  { org: "Facile.it", role: "Full Stack Developer", start: [2025, 8], end: [2026, 3] },
  { org: "Soisy", role: "Full Stack Developer", start: [2020, 2], end: [2025, 6] },
  { org: "Idrolab", role: "Lead Full Stack Developer", start: [2015, 3], end: [2025, 2] },
  { org: "Ehoreca", role: "Solo Full Stack Developer", start: [2018, 11], end: [2019, 2] },
];

const SKILLS = [
  { name: "PHP", level: "expert" },
  { name: "Symfony", level: "expert" },
  { name: "TDD", level: "expert" },
  { name: "JavaScript", level: "advanced" },
  { name: "React", level: "advanced" },
  { name: "Kubernetes", level: "proficient" },
];

// Every listed skill is at least professional working level, so the scale runs
// from "proficient" up, never "beginner": the level reflects depth, not ability.
// Two encodings, compared in the styleguide: a discrete step (count, 1/2/3) and a
// continuous length (%). The count stays legible at a tiny size where height cannot.
const LEVEL_STEP = { proficient: 1, advanced: 2, expert: 3 };
const LEVEL_LENGTH = { proficient: 35, advanced: 65, expert: 100 };
// Cells lit in the 3×3 grid: floor at 5 (past half) so proficient reads as solid.
const LEVEL_CELLS = { proficient: 5, advanced: 7, expert: 9 };
// Fill order for the 3×3 grid: bottom row up, left to right within each row.
const GRID_FILL_ORDER = [7, 8, 9, 4, 5, 6, 1, 2, 3];

// Spacing scale: 4px base grid, rem-based so it scales with the root and print.
// Steps 1–4 are linear (fine control for dense CV text); above that ~1.5x jumps
// for section rhythm. Every value lands on the 4px grid.
const SPACE = [
  ["space-1", "0.25rem", 4],
  ["space-2", "0.5rem", 8],
  ["space-3", "0.75rem", 12],
  ["space-4", "1rem", 16],
  ["space-5", "1.5rem", 24],
  ["space-6", "2rem", 32],
  ["space-7", "3rem", 48],
  ["space-8", "4rem", 64],
  ["space-9", "6rem", 96],
];

const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

const asFraction = ([year, month]) => year + (month - 1) / 12;
const formatDate = ([year, month]) => `${MONTHS[month - 1]} ${year}`;

// Timeline positions are computed from the dates, never hardcoded (SITE-9).
function timeline(engagements) {
  const now = new Date();
  const today = asFraction([now.getFullYear(), now.getMonth() + 1]);

  const starts = engagements.map((entry) => asFraction(entry.start));
  const ends = engagements.map((entry) =>
    entry.end ? asFraction(entry.end) : today,
  );
  const domainStart = Math.min(...starts);
  const domainEnd = Math.max(...ends);
  const span = domainEnd - domainStart;

  return engagements.map((entry, index) => ({
    ...entry,
    left: ((starts[index] - domainStart) / span) * 100,
    width: Math.max(((ends[index] - starts[index]) / span) * 100, 0.6),
    startLabel: formatDate(entry.start),
    endLabel: entry.end ? formatDate(entry.end) : "oggi",
  }));
}

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function fontFaces() {
  return Object.values(FONT_PAIRS)
    .flatMap((pair) => [pair.sans, pair.mono])
    .flatMap((font) =>
      WEIGHTS.map((weight) => {
        const file = `../node_modules/@fontsource/${font.package}/files/${font.package}-latin-${weight}-normal`;
        return `@font-face {
  font-family: "${font.family}";
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url("${file}.woff2") format("woff2"), url("${file}.woff") format("woff");
}`;
      }),
    )
    .join("\n");
}

function themeVariables() {
  return THEMES.map((theme) => {
    const declarations = Object.keys(semantic)
      .map((role) => `  --${role}: ${palette.get(semantic[role][theme]).hex};`)
      .join("\n");
    const selector =
      theme === "light" ? ':root, [data-theme="light"]' : '[data-theme="dark"]';
    return `${selector} {\n${declarations}\n}`;
  }).join("\n\n");
}

function fontVariables() {
  return Object.entries(FONT_PAIRS)
    .map(
      ([key, pair]) => `[data-fonts="${key}"] {
  --font-sans: "${pair.sans.family}", system-ui, sans-serif;
  --font-mono: "${pair.mono.family}", ui-monospace, monospace;
}`,
    )
    .join("\n\n");
}

function spaceVariables() {
  const declarations = SPACE.map(([name, value]) => `  --${name}: ${value};`).join(
    "\n",
  );
  return `:root {\n${declarations}\n}`;
}

function spacingScale() {
  return SPACE.map(
    ([name, value, px]) => `<div class="space-row">
    <code>${name}</code>
    <code class="quiet">${value}</code>
    <code class="quiet">${px}px</code>
    <span class="space-bar" style="width:${value}"></span>
  </div>`,
  ).join("\n");
}

function semanticTable() {
  const rows = Object.keys(semantic)
    .map((role) => {
      const cells = THEMES.map((theme) => {
        const token = semantic[role][theme];
        const { hex } = palette.get(token);
        const minimum = MINIMUM_CONTRAST[role];
        const ratio = contrastOnSurface(role, theme);
        const verdict =
          minimum === undefined
            ? '<span class="badge">—</span>'
            : `<span class="badge ${ratio >= minimum ? "pass" : "fail"}">${ratio.toFixed(2)}:1</span>`;
        return `<td>
          <span class="chip" style="background:${hex}"></span>
          <code>${token}</code>
          <code class="quiet">${hex}</code>
          ${verdict}
        </td>`;
      }).join("");
      return `<tr><th scope="row"><code>${role}</code></th>${cells}</tr>`;
    })
    .join("\n");

  return `<table class="tokens">
  <thead><tr><th scope="col">ruolo</th><th scope="col">chiaro</th><th scope="col">scuro</th></tr></thead>
  <tbody>${rows}</tbody>
</table>`;
}

function swatches() {
  const groups = { neutral: [], green: [], sage: [] };
  for (const [name, colour] of palette) {
    groups[name.split("-")[0]].push([name, colour]);
  }

  return Object.entries(groups)
    .map(([group, entries]) => {
      const items = entries
        .map(
          ([name, colour]) => `<figure class="swatch">
      <div class="sample" style="background:${colour.hex}"></div>
      <figcaption>
        <code>${name}</code>
        <code class="quiet">${colour.hex}</code>
        <code class="quiet">oklch(${(colour.oklch.lightness * 100).toFixed(1)}% ${colour.oklch.chroma} ${colour.oklch.hue})</code>
      </figcaption>
    </figure>`,
        )
        .join("\n");
      return `<h3>${group}</h3>\n<div class="swatches">\n${items}\n</div>`;
    })
    .join("\n");
}

// One lane: a single activity's span within the shared global domain. This is the
// primitive — inline above a CV entry, or stacked with others to read overlaps.
function singleTimeline(entry) {
  return `<div class="timeline">
    <div class="axis"></div>
    <div class="range" style="left:${entry.left.toFixed(2)}%;width:${entry.width.toFixed(2)}%"
      title="${escapeHtml(entry.org)}: ${entry.startLabel} – ${entry.endLabel}"></div>
    <div class="dot" style="left:${entry.left.toFixed(2)}%" data-label="${entry.startLabel}"></div>
    <div class="dot" style="left:${(entry.left + entry.width).toFixed(2)}%" data-label="${entry.endLabel}"></div>
  </div>`;
}

// Overview: one lane per experience, stacked on the same axis. Overlaps read
// vertically (Idrolab ∥ Soisy ∥ Ehoreca), never crammed onto one line.
function lanes(entries) {
  const rows = entries
    .map(
      (entry) => `  <div class="lane">
    <span class="lane-label">${escapeHtml(entry.org)}</span>
    ${singleTimeline(entry)}
  </div>`,
    )
    .join("\n");
  return `<div class="lanes">\n${rows}\n</div>`;
}

function cvPreview(entries) {
  const blocks = entries
    .slice(0, 3)
    .map((entry) => {
      return `<article class="entry">
  ${singleTimeline(entry)}
  <h4>${escapeHtml(entry.role)}</h4>
  <p class="meta"><span>${escapeHtml(entry.org)}</span> <code>${entry.startLabel} – ${entry.endLabel}</code></p>
  <ul>
    <li>Sviluppo di nuove funzionalità e integrazione con servizi interni.</li>
    <li>Supporto al team nella riorganizzazione del codice in ottica DDD.</li>
  </ul>
</article>`;
    })
    .join("\n");
  return blocks;
}

// Three cells whose lit count encodes the level; dim cells keep the footprint
// constant so keywords stay aligned. `shape` picks the cell style.
function countMarker(level, shape) {
  const lit = LEVEL_STEP[level];
  const cells = [1, 2, 3]
    .map((step) => `<i${step <= lit ? ' class="on"' : ""}></i>`)
    .join("");
  return `<span class="${shape}" title="${level}">${cells}</span>`;
}

// A 3×3 grid square, filled cell by cell from the bottom-left.
function gridMarker(level) {
  const onSet = new Set(GRID_FILL_ORDER.slice(0, LEVEL_CELLS[level]));
  const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .map((index) => `<i${onSet.has(index) ? ' class="on"' : ""}></i>`)
    .join("");
  return `<span class="grid3" title="${level}">${cells}</span>`;
}

// The chosen marker for the CV skills.
const CHOSEN_MARKER = { label: "griglia 3×3", render: gridMarker };

// Kept in the styleguide as a record of what was tried and set aside, with why.
const DISCARDED_MARKERS = [
  {
    label: "segmenti crescenti",
    why: "altezza continua: a pochi pixel i tre livelli staccano troppo poco.",
    render: (level) => countMarker(level, "meter"),
  },
  {
    label: "barra continua",
    why: "solo lunghezza (35/65/100 su 14px): non si distingue — era il difetto da evitare.",
    render: (level) =>
      `<span class="mbar" style="--length:${LEVEL_LENGTH[level]}%" title="${level}"></span>`,
  },
];

function skillList(renderMarker) {
  const items = SKILLS.map(
    (skill) =>
      `<li class="skill">${renderMarker(skill.level)}<span>${skill.name}</span></li>`,
  ).join("\n");
  return `<ul class="skills">\n${items}\n</ul>`;
}

function legacyList() {
  const items = SKILLS.map(
    (skill) =>
      `<li class="skill legacy ${skill.level}"><span class="bar"></span><span>${skill.name}</span></li>`,
  ).join("\n");
  return `<ul class="skills">\n${items}\n</ul>`;
}

function skillChosen() {
  return `    <div>
      <h3>${CHOSEN_MARKER.label}</h3>
      ${skillList(CHOSEN_MARKER.render)}
    </div>
    <div>
      <h3>attuale (ohmycv)</h3>
      ${legacyList()}
    </div>`;
}

function skillDiscarded() {
  return DISCARDED_MARKERS.map(
    (variant) => `    <div>
      <h3>${variant.label}</h3>
      ${skillList(variant.render)}
      <p class="why">${variant.why}</p>
    </div>`,
  ).join("\n");
}

const engagements = timeline(ENGAGEMENTS);

const html = `<!doctype html>
<html lang="it" data-theme="light" data-fonts="public">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Styleguide — danilosanchi.net</title>
<style>
${fontFaces()}

${themeVariables()}

${fontVariables()}

${spaceVariables()}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--surface);
  color: var(--text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

code { font-family: var(--font-mono); font-size: 0.85em; }
.quiet { color: var(--text-muted); }
a { color: var(--accent-text); }

header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--surface-alt);
  border-bottom: 1px solid var(--border);
}

header h1 { font-size: 1rem; margin: 0; font-weight: 600; }
.controls { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.control { display: flex; gap: 0.4rem; align-items: center; }
.control span { font-size: 0.8rem; color: var(--text-muted); }

button {
  font: inherit;
  font-size: 0.85rem;
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  border-radius: 3px;
  cursor: pointer;
}
button[aria-pressed="true"] {
  border-color: var(--accent-mark);
  color: var(--accent-text);
  font-weight: 600;
}

main { max-width: 62rem; margin: 0 auto; padding: 2rem; }
section { margin-bottom: 4rem; }
section > h2 {
  font-size: 1.1rem;
  font-weight: 600;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border);
}
section > p { color: var(--text-muted); max-width: 42rem; }
h3 { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin: 2rem 0 0.75rem; }

/* Timeline — the identity element. Positions computed from dates. */
.timeline { position: relative; height: 34px; margin: 0.5rem 0; }
.axis {
  position: absolute; top: 50%; left: 0; right: 0; height: 1px;
  background: var(--border); transform: translateY(-50%);
}
.range {
  position: absolute; top: 50%; height: 1px;
  background: var(--accent-mark); transform: translateY(-50%); z-index: 1;
}
.dot {
  position: absolute; top: 50%; width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent-mark); transform: translate(-50%, -50%); z-index: 2;
}
.dot::after {
  content: attr(data-label);
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
  background: var(--text); color: var(--surface);
  padding: 3px 6px; border-radius: 3px;
  font-family: var(--font-mono); font-size: 0.7rem; white-space: nowrap;
  opacity: 0; transition: opacity 0.15s; pointer-events: none;
}
.dot:hover::after { opacity: 1; }

/* Overview: stacked lanes sharing one axis. */
.lanes { display: grid; gap: 0.35rem; }
.lane { display: grid; grid-template-columns: 7rem 1fr; align-items: center; gap: 1rem; }
.lane-label { font-size: 0.85rem; }
.lane .timeline { height: 22px; margin: 0; }

.entry { margin: 2rem 0; }
.entry h4 { margin: 0.5rem 0 0.15rem; font-size: 1rem; }
.entry .meta { margin: 0 0 0.4rem; color: var(--text-muted); font-size: 0.9rem; }
.entry ul { margin: 0; padding-left: 1.2rem; }
.entry li { margin: 0.1rem 0; }

/* Tokens */
table.tokens { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
table.tokens th, table.tokens td {
  text-align: left; padding: 0.5rem 0.6rem; border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
table.tokens thead th { color: var(--text-muted); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
.chip {
  display: inline-block; width: 1.1rem; height: 1.1rem; border-radius: 3px;
  border: 1px solid var(--border); vertical-align: -0.25rem; margin-right: 0.4rem;
}
.badge {
  font-family: var(--font-mono); font-size: 0.7rem; padding: 0.1rem 0.35rem;
  border-radius: 3px; margin-left: 0.4rem; border: 1px solid var(--border);
}
.badge.pass { color: var(--accent-text); border-color: var(--accent-mark); }
.badge.fail { color: #b3261e; border-color: #b3261e; }

.swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr)); gap: 0.75rem; }
.swatch { margin: 0; }
.swatch .sample { height: 3.5rem; border-radius: 4px; border: 1px solid var(--border); }
.swatch figcaption { display: flex; flex-direction: column; gap: 0.05rem; padding-top: 0.35rem; font-size: 0.75rem; }

/* Skills — compact marker before each keyword; inline and dense, as in the CV. */
.skills { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.4rem 1.1rem; }
.skill { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; }
/* 3×3 grid — the chosen marker: fills the square cell by cell, bottom-left up. */
.grid3 { display: grid; grid-template-columns: repeat(3, 3px); grid-auto-rows: 3px; gap: 1px; }
.grid3 i { background: var(--border); border-radius: 0.5px; }
.grid3 i.on { background: var(--accent-mark); }
/* Discarded — segmented meter: lit count = level, ascending height. */
.meter { display: inline-flex; align-items: flex-end; gap: 1px; height: 13px; }
.meter i { width: 3px; background: var(--border); border-radius: 1px; }
.meter i:nth-child(1) { height: 46%; }
.meter i:nth-child(2) { height: 73%; }
.meter i:nth-child(3) { height: 100%; }
.meter i.on { background: var(--accent-mark); }
/* Discarded — continuous vertical fill: length only, no count. */
.mbar {
  width: 3px; height: 14px; border-radius: 1px;
  background: linear-gradient(to top, var(--accent-mark) var(--length), var(--border) var(--length));
}
/* Legacy (ohmycv): single vertical tick, three colours. */
.skill.legacy .bar { flex: none; width: 3px; height: 12px; border-radius: 1px; }
.skill.legacy.expert .bar { background: #539956; }
.skill.legacy.advanced .bar { height: 10.5px; background: #a2d446; }
.skill.legacy.proficient .bar { height: 9px; background: #ffc164; }
.discarded { opacity: 0.7; }
.why { color: var(--text-muted); font-size: 0.8rem; margin: 0.4rem 0 0; }

.columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: 2rem; }

/* Typography */
.specimen { border: 1px solid var(--border); border-radius: 4px; padding: 1.25rem; }
.specimen .name { font-size: 0.75rem; color: var(--text-muted); margin: 0 0 0.75rem; }
.specimen .display { font-size: 1.75rem; font-weight: 600; margin: 0 0 0.25rem; }
.specimen p { margin: 0.5rem 0; }
.specimen .metadata { font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); }
.pair-plex { --font-sans: "IBM Plex Sans", sans-serif; --font-mono: "IBM Plex Mono", monospace; }
.pair-public { --font-sans: "Public Sans", sans-serif; --font-mono: "Commit Mono", monospace; }
.scale-row { display: flex; align-items: baseline; gap: 1rem; padding: 0.2rem 0; }
.scale-row code { flex: none; width: 4rem; color: var(--text-muted); }

/* Spacing */
.space-row { display: flex; align-items: center; gap: 1rem; padding: 0.2rem 0; }
.space-row code { flex: none; }
.space-row code:first-child { width: 5rem; }
.space-row code.quiet { width: 3.5rem; }
.space-bar { height: 1rem; background: var(--accent-quiet); border-radius: 2px; }

@media print {
  :root { color-scheme: light; }
  header { display: none; }
  body { background: #fff; }
}
</style>
</head>
<body>

<header>
  <h1>Styleguide — danilosanchi.net</h1>
  <div class="controls">
    <div class="control">
      <span>tema</span>
      <button data-set-theme="light" aria-pressed="true">chiaro</button>
      <button data-set-theme="dark" aria-pressed="false">scuro</button>
    </div>
    <div class="control">
      <span>font</span>
      <button data-set-fonts="public" aria-pressed="true">Public + Commit</button>
      <button data-set-fonts="plex" aria-pressed="false">IBM Plex</button>
    </div>
  </div>
</header>

<main>

<section>
  <h2>Anteprima CV</h2>
  <p>Come si comporta l'insieme su contenuto reale: timeline, gerarchia, metadati in mono.</p>
  ${cvPreview(engagements)}
</section>

<section>
  <h2>Timeline: corsie parallele</h2>
  <p>Una corsia per esperienza, tutte sullo stesso asse temporale globale. Le sovrapposizioni si leggono in verticale — Idrolab corre in parallelo a Soisy ed Ehoreca — senza accavallarsi su una riga sola. È lo stesso primitivo che sta sopra ogni voce del CV. Passa il mouse sui punti per le date.</p>
  ${lanes(engagements)}
</section>

<section>
  <h2>Token semantici</h2>
  <p>I soli che i componenti possono usare. Il rapporto di contrasto è calcolato contro la superficie dello stesso tema.</p>
  ${semanticTable()}
</section>

<section>
  <h2>Scala completa</h2>
  <p>Generata in OKLCH, tinta 150. I neutri portano una traccia di verde: guardali in massa, non sul singolo campione.</p>
  ${swatches()}
</section>

<section>
  <h2>Marcatore skill</h2>
  <p>Un marcatore compatto prefissa ogni keyword, inline e denso come nel CV: una sola tinta, il livello (proficient / advanced / expert) è nella quantità di riempimento. Scelta la griglia 3×3, riempita 5/7/9 celle dal basso. A fianco la resa attuale del CV (ohmycv): tre colori, differenza d'altezza di 3px su 12.</p>
  <h3>scelto</h3>
  <div class="columns">
${skillChosen()}
  </div>
  <h3>scartate</h3>
  <p class="quiet">Provate e messe da parte, tenute qui come registro.</p>
  <div class="columns discarded">
${skillDiscarded()}
  </div>
</section>

<section>
  <h2>Spaziature</h2>
  <p>Griglia base 4px, valori in <code>rem</code> così scalano con il root e in stampa. Passi 1–4 lineari per il ritmo del testo denso, poi salti ~1.5× per le sezioni. La riga di testo a 1rem/1.5 = 24px = <code>space-5</code>: il ritmo verticale cade sulla griglia senza un baseline grid rigido.</p>
  ${spacingScale()}
</section>

<section>
  <h2>Tipografia</h2>
  <p>Le due coppie candidate sullo stesso contenuto. Il mono porta i metadati misurabili: date, durate, repo, linguaggi.</p>
  <div class="columns">
${Object.entries(FONT_PAIRS)
  .map(
    ([key, pair]) => `    <div class="specimen pair-${key}">
      <p class="name">${pair.label}</p>
      <p class="display">Danilo Sanchi</p>
      <p class="metadata">Ago 2025 – Mar 2026 · PHP · Symfony · ~11 anni</p>
      <p>Costruisco applicazioni web con cura dal 2007, in ufficio e in garage. I progetti personali non sono rumore: sono lo stesso mestiere applicato per divertimento.</p>
      <p class="metadata">github.com/danielsan80 — JobBoy v2.1.0 — 0fbd59</p>
      <p class="quiet" style="font-size:0.8rem">${pair.note}</p>
    </div>`,
  )
  .join("\n")}
  </div>

  <h3>scala tipografica</h3>
  ${[
    ["3rem", "Danilo Sanchi"],
    ["1.75rem", "Experience"],
    ["1.15rem", "Lead Full Stack Developer"],
    ["1rem", "Testo corrente del CV, densità alta."],
    ["0.85rem", "Metadato secondario"],
  ]
    .map(
      ([size, text]) =>
        `<div class="scale-row"><code>${size}</code><span style="font-size:${size}">${text}</span></div>`,
    )
    .join("\n  ")}
</section>

</main>

<script>
for (const button of document.querySelectorAll("[data-set-theme], [data-set-fonts]")) {
  button.addEventListener("click", () => {
    const attribute = button.dataset.setTheme ? "theme" : "fonts";
    const value = button.dataset.setTheme ?? button.dataset.setFonts;
    document.documentElement.dataset[attribute] = value;
    const group = button.closest(".control");
    for (const sibling of group.querySelectorAll("button")) {
      sibling.setAttribute("aria-pressed", String(sibling === button));
    }
  });
}
</script>

</body>
</html>
`;

const outputPath = join(dirname(fileURLToPath(import.meta.url)), "styleguide.html");
writeFileSync(outputPath, html);
console.log(`Styleguide written to ${outputPath}`);
