import { describe, expect, it } from "vitest";
import { education } from "./education";
import { experiences } from "./experiences";
import { identity } from "./identity";
import { LANGS } from "./localized";
import { periodBounds } from "./period";
import { featuredProjects } from "./projects";
import { skills, type SkillLevel } from "./skills";
import { training } from "./training";

const TODAY = Date.UTC(2026, 7, 26);

const LEVELS: string[] = [
  "proficient",
  "advanced",
  "expert",
] satisfies SkillLevel[];

// Any object that speaks one language must speak them all. The walk is
// generic on purpose: a new collection gets checked without registering here.
function incompleteLocalized(value: unknown, path: string): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      incompleteLocalized(item, `${path}[${index}]`),
    );
  }
  if (typeof value !== "object" || value === null) {
    return [];
  }

  const keys = Object.keys(value);
  const languages: string[] = LANGS;
  if (keys.some((key) => languages.includes(key))) {
    const complete =
      keys.length === languages.length &&
      languages.every((lang) => keys.includes(lang));
    return complete ? [] : [path];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    incompleteLocalized(child, `${path}.${key}`),
  );
}

// The compiler stops at the shape of the JSON. These tests cover the rules it
// cannot see: that the dates are real, the levels are in range and every
// localized value speaks both languages.
describe("content files", () => {
  it("gives every localized value both languages", () => {
    const collections: [string, unknown][] = [
      ["identity", identity],
      ["experiences", experiences],
      ["education", education],
      ["training", training],
      ["skills", skills],
      ["featuredProjects", featuredProjects],
    ];

    expect(
      collections.flatMap(([name, data]) => incompleteLocalized(data, name)),
    ).toEqual([]);
  });

  it("dates every entry with a range that can be placed on a timeline", () => {
    const dated = [...experiences, ...education, ...training];

    const undatable = dated.filter((entry) => {
      try {
        periodBounds(entry.period, TODAY);
        return false;
      } catch {
        return true;
      }
    });

    expect(undatable).toEqual([]);
  });

  it("grades every skill with a level the marker knows how to draw", () => {
    const levels: string[] = skills.flatMap((group) =>
      group.items.map((item) => item.level),
    );

    expect(levels.filter((level) => !LEVELS.includes(level))).toEqual([]);
  });
});
