// Single source of truth for the site colour palette: OKLCH definitions in,
// sRGB hex and contrast ratios out. The palette is derived data, not hardcoded
// hex — change a number here and regenerate. Documented in doc/STILE.md (SITE-16).
//
// Run directly (npm run palette) for the report and the contrast audit, or
// import the exports to build something from the same values.

import { pathToFileURL } from "node:url";

const gamma = (value) =>
  value <= 0.0031308 ? 12.92 * value : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;

function oklchToLinear(lightness, chroma, hueDeg) {
  const hue = (hueDeg * Math.PI) / 180;
  const aAxis = chroma * Math.cos(hue);
  const bAxis = chroma * Math.sin(hue);

  const lLong = lightness + 0.3963377774 * aAxis + 0.2158037573 * bAxis;
  const mLong = lightness - 0.1055613458 * aAxis - 0.0638541728 * bAxis;
  const sLong = lightness - 0.0894841775 * aAxis - 1.291485548 * bAxis;

  const lCube = lLong ** 3;
  const mCube = mLong ** 3;
  const sCube = sLong ** 3;

  return {
    red: 4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube,
    green: -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube,
    blue: -0.0041960863 * lCube - 0.7034186147 * mCube + 1.707614701 * sCube,
  };
}

function toHex(linear) {
  const channels = [linear.red, linear.green, linear.blue];
  // Outside [0,1] means the colour has no sRGB equivalent and would be clipped.
  const clipped = channels.some((value) => value < -0.0005 || value > 1.0005);
  const hex = channels
    .map((value) => {
      const byte = Math.round(gamma(Math.min(1, Math.max(0, value))) * 255);
      return byte.toString(16).padStart(2, "0");
    })
    .join("");
  return { hex: `#${hex}`, clipped };
}

function luminance(linear) {
  const clamp = (value) => Math.min(1, Math.max(0, value));
  return (
    0.2126 * clamp(linear.red) +
    0.7152 * clamp(linear.green) +
    0.0722 * clamp(linear.blue)
  );
}

const contrast = (first, second) => {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
};

// Neutrals carry a trace of the accent hue so greys belong to the same family.
const NEUTRAL_HUE = 150;
const NEUTRAL_CHROMA = 0.006;
const GREEN_HUE = 150;
const SAGE_HUE = 155;

const scale = [
  ["neutral-0", 1.0, 0, 0],
  ["neutral-50", 0.98, NEUTRAL_CHROMA, NEUTRAL_HUE],
  ["neutral-100", 0.955, NEUTRAL_CHROMA, NEUTRAL_HUE],
  ["neutral-200", 0.905, NEUTRAL_CHROMA, NEUTRAL_HUE],
  ["neutral-300", 0.84, NEUTRAL_CHROMA, NEUTRAL_HUE],
  ["neutral-400", 0.72, NEUTRAL_CHROMA, NEUTRAL_HUE],
  ["neutral-500", 0.62, NEUTRAL_CHROMA, NEUTRAL_HUE],
  ["neutral-600", 0.52, NEUTRAL_CHROMA, NEUTRAL_HUE],
  ["neutral-700", 0.42, NEUTRAL_CHROMA, NEUTRAL_HUE],
  ["neutral-800", 0.31, NEUTRAL_CHROMA, NEUTRAL_HUE],
  ["neutral-900", 0.22, NEUTRAL_CHROMA, NEUTRAL_HUE],
  ["neutral-950", 0.16, NEUTRAL_CHROMA, NEUTRAL_HUE],

  ["green-50", 0.97, 0.03, GREEN_HUE],
  ["green-100", 0.94, 0.06, GREEN_HUE],
  ["green-200", 0.88, 0.11, GREEN_HUE],
  ["green-300", 0.82, 0.15, GREEN_HUE],
  ["green-400", 0.76, 0.18, GREEN_HUE],
  ["green-500", 0.7, 0.19, GREEN_HUE],
  ["green-600", 0.62, 0.17, GREEN_HUE],
  ["green-700", 0.53, 0.145, GREEN_HUE],
  ["green-800", 0.44, 0.12, GREEN_HUE],
  ["green-900", 0.34, 0.09, GREEN_HUE],

  ["sage-400", 0.72, 0.045, SAGE_HUE],
  ["sage-600", 0.55, 0.04, SAGE_HUE],
];

const palette = new Map(
  scale.map(([name, lightness, chroma, hue]) => {
    const linear = oklchToLinear(lightness, chroma, hue);
    return [
      name,
      { ...toHex(linear), linear, oklch: { lightness, chroma, hue } },
    ];
  }),
);

// Semantic tokens are the only ones components may use; the raw scale stays here.
const semantic = {
  surface: { light: "neutral-0", dark: "neutral-900" },
  "surface-alt": { light: "neutral-50", dark: "neutral-950" },
  border: { light: "neutral-200", dark: "neutral-800" },
  text: { light: "neutral-900", dark: "neutral-100" },
  "text-muted": { light: "neutral-600", dark: "neutral-400" },
  "accent-text": { light: "green-700", dark: "green-400" },
  "accent-mark": { light: "green-600", dark: "green-500" },
  "accent-quiet": { light: "sage-600", dark: "sage-400" },
};

// Minimum contrast required against the surface of the same theme.
const MINIMUM_CONTRAST = {
  text: 4.5,
  "text-muted": 4.5,
  "accent-text": 4.5,
  "accent-mark": 3, // non-text graphic marks
  "accent-quiet": 3,
  border: 1.2,
  "surface-alt": 1,
};

function reportScale() {
  console.log(
    "token".padEnd(13),
    "hex".padEnd(9),
    "oklch".padEnd(26),
    "on light".padEnd(9),
    "on dark",
  );
  const lightSurface = palette.get(semantic.surface.light).linear;
  const darkSurface = palette.get(semantic.surface.dark).linear;

  for (const [name, colour] of palette) {
    const { lightness, chroma, hue } = colour.oklch;
    console.log(
      name.padEnd(13),
      colour.hex.padEnd(9),
      `oklch(${(lightness * 100).toFixed(1)}% ${chroma} ${hue})`.padEnd(26),
      contrast(colour.linear, lightSurface).toFixed(2).padEnd(9),
      contrast(colour.linear, darkSurface).toFixed(2),
      colour.clipped ? "  out of sRGB gamut" : "",
    );
  }
}

function auditSemantic() {
  const failures = [];

  for (const [role, minimum] of Object.entries(MINIMUM_CONTRAST)) {
    for (const theme of ["light", "dark"]) {
      const surface = palette.get(semantic.surface[theme]).linear;
      const colour = palette.get(semantic[role][theme]).linear;
      const ratio = contrast(colour, surface);
      if (ratio < minimum) {
        failures.push(`${role} (${theme}): ${ratio.toFixed(2)} < ${minimum}`);
      }
    }
  }

  const clipped = [...palette]
    .filter(([, colour]) => colour.clipped)
    .map(([name]) => name);
  failures.push(...clipped.map((name) => `${name}: out of sRGB gamut`));

  return failures;
}

export { palette, semantic, MINIMUM_CONTRAST, contrast, auditSemantic };

// Resolves a semantic role to its hex for one theme.
export const resolve = (role, theme) => palette.get(semantic[role][theme]).hex;

// Contrast of a semantic role against the surface of the same theme.
export const contrastOnSurface = (role, theme) =>
  contrast(
    palette.get(semantic[role][theme]).linear,
    palette.get(semantic.surface[theme]).linear,
  );

const runAsScript =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (runAsScript) {
  reportScale();

  const failures = auditSemantic();
  console.log("");
  if (failures.length > 0) {
    console.error("Contrast audit failed:");
    for (const failure of failures) console.error(`  ${failure}`);
    process.exit(1);
  }
  console.log("Contrast audit passed.");
}
