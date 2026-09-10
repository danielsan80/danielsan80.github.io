import { describe, expect, it } from "vitest";
import {
  contentViolations,
  localizedViolations,
  dateViolations,
  levelViolations,
} from "./validate";

const TODAY = Date.UTC(2026, 7, 26);

describe("localizedViolations", () => {
  it("names every localized value that does not speak both languages", () => {
    expect(
      localizedViolations(
        [
          { role: { it: "Sviluppatore", en: "Developer" } },
          { role: { it: "Consulente" } },
          { note: { en: "Attended twice", fr: "Deux fois" } },
        ],
        "entries",
      ),
    ).toEqual([
      "entries[1].role: speaks it, must speak it, en",
      "entries[2].note: speaks en, fr, must speak it, en",
    ]);
  });

  it("leaves plain values alone: a word that reads the same in every language is not localized", () => {
    expect(
      localizedViolations(
        { company: "Resolvi Srl", skills: ["PHP", "TypeScript"] },
        "record",
      ),
    ).toEqual([]);
  });
});

describe("dateViolations", () => {
  it("names every entry whose period cannot be placed on a timeline", () => {
    expect(
      dateViolations(
        [
          { period: { start: "2015-09", end: "2025-06" } },
          { period: { start: "2026-08" } },
          { period: { start: "nope" } },
          { period: { start: "2020", end: "2010" } },
        ],
        "experiences",
        TODAY,
      ),
    ).toEqual([
      'experiences[2]: Invalid date: "nope"',
      'experiences[3]: Period ends before it starts: "2020" to "2010"',
    ]);
  });
});

describe("levelViolations", () => {
  it("names every skill graded with a level the marker cannot draw", () => {
    expect(
      levelViolations(
        [
          { items: [{ level: "expert" }, { level: "guru" }] },
          { items: [{ level: "advanced" }] },
        ],
        "skills",
      ),
    ).toEqual(['skills[0].items[1]: unknown level "guru"']);
  });
});

describe("contentViolations", () => {
  it("finds nothing to report in the content the site ships", () => {
    expect(contentViolations(TODAY)).toEqual([]);
  });
});
