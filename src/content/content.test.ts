import { describe, expect, it } from "vitest";
import { education } from "./education";
import { experiences } from "./experiences";
import { periodBounds } from "./period";
import { skills, type SkillLevel } from "./skills";
import { training } from "./training";

const TODAY = Date.UTC(2026, 7, 26);

const LEVELS: string[] = [
  "proficient",
  "advanced",
  "expert",
] satisfies SkillLevel[];

// The compiler stops at the shape of the JSON. These tests cover the rules it
// cannot see: that the dates are real and the levels are in range.
describe("content files", () => {
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
