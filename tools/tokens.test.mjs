import { describe, expect, it } from "vitest";
import { FONTS, SPACE, themeTokens, tokensCss } from "./tokens.mjs";

describe("themeTokens", () => {
  it("resolves every semantic role to the light theme hex", () => {
    expect(themeTokens("light")).toEqual({
      surface: "#ffffff",
      "surface-alt": "#f6faf6",
      border: "#dde1dd",
      text: "#191b19",
      "text-muted": "#676a67",
      "accent-text": "#03823a",
      "accent-mark": "#03a14a",
      "accent-quiet": "#5f7967",
    });
  });

  it("resolves every semantic role to the dark theme hex", () => {
    expect(themeTokens("dark")).toEqual({
      surface: "#191b19",
      "surface-alt": "#0b0e0c",
      border: "#2e312f",
      text: "#edf1ee",
      "text-muted": "#a2a6a3",
      "accent-text": "#44d070",
      "accent-mark": "#0fbd59",
      "accent-quiet": "#8fad98",
    });
  });
});

describe("SPACE", () => {
  it("steps 1-4 are linear, then jumps ~1.5x, every value on the 4px grid", () => {
    expect(SPACE).toEqual([
      ["space-1", "0.25rem"],
      ["space-2", "0.5rem"],
      ["space-3", "0.75rem"],
      ["space-4", "1rem"],
      ["space-5", "1.5rem"],
      ["space-6", "2rem"],
      ["space-7", "3rem"],
      ["space-8", "4rem"],
      ["space-9", "6rem"],
    ]);
  });
});

describe("FONTS", () => {
  it("pairs Public Sans for text with Commit Mono for measurable metadata", () => {
    expect(FONTS).toEqual({
      sans: { family: "Public Sans", package: "public-sans" },
      mono: { family: "Commit Mono", package: "commit-mono" },
    });
  });
});

describe("tokensCss", () => {
  const css = tokensCss();

  it("declares the light theme on :root, so no-JS and print get it by default", () => {
    expect(css).toContain(":root {");
    expect(css).toContain("  --surface: #ffffff;");
    expect(css).toContain("  --space-5: 1.5rem;");
  });

  it("switches to dark by media query and by explicit data-theme", () => {
    expect(css).toContain("@media (prefers-color-scheme: dark)");
    expect(css).toContain(':root[data-theme="dark"]');
    expect(css).toContain(':root[data-theme="light"]');
  });

  it("forces the light theme in print", () => {
    expect(css).toContain("@media print");
  });

  it("ends with a newline", () => {
    expect(css.endsWith("\n")).toBe(true);
  });
});
