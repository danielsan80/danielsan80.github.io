import { describe, expect, it } from "vitest";
import { z } from "zod";
import { experienceSchema, skillGroupSchema } from "./schema";
import {
  contentViolations,
  dateViolations,
  formatViolation,
  schemaViolations,
} from "./validate";

const TODAY = Date.UTC(2026, 7, 26);

const experiences = z.array(experienceSchema);

const experience = {
  role: { it: "Sviluppatore", en: "Developer" },
  company: "Resolvi Srl",
  location: "Remote",
  remote: true,
  period: { start: "2025-08" },
  bullets: { it: ["Scritto codice"], en: ["Wrote code"] },
};

describe("schemaViolations", () => {
  it("finds nothing in a record that matches its schema", () => {
    expect(schemaViolations(experiences, [experience], "experiences")).toEqual(
      [],
    );
  });

  it("names every localized value that does not speak both languages", () => {
    expect(
      schemaViolations(
        experiences,
        [
          { ...experience, role: { it: "Consulente" } },
          { ...experience, bullets: { it: ["Uno"], en: ["One"], fr: ["Un"] } },
        ],
        "experiences",
      ),
    ).toEqual([
      {
        path: "experiences[0].role.en",
        message: "Invalid input: expected string, received undefined",
      },
      {
        path: "experiences[1].bullets",
        message: 'Unrecognized key: "fr"',
      },
    ]);
  });

  it("leaves plain values alone: a word that reads the same in every language is not localized", () => {
    expect(
      schemaViolations(
        experiences,
        [
          { ...experience, location: "Milano" },
          { ...experience, location: { it: "Milano", en: "Milan" } },
        ],
        "experiences",
      ),
    ).toEqual([]);
  });

  it("names a field that is missing, mistyped or misspelled", () => {
    const { bullets, ...withoutBullets } = experience;

    expect(
      schemaViolations(
        experiences,
        [
          { ...experience, remote: "yes" },
          { ...withoutBullets, bulets: bullets },
        ],
        "experiences",
      ),
    ).toEqual([
      {
        path: "experiences[0].remote",
        message: "Invalid input: expected boolean, received string",
      },
      {
        path: "experiences[1].bullets",
        message: "Invalid input: expected object, received undefined",
      },
      {
        path: "experiences[1]",
        message: 'Unrecognized key: "bulets"',
      },
    ]);
  });

  it("names a date that YAML read as a number or a timestamp because it was left unquoted", () => {
    expect(
      schemaViolations(
        experiences,
        [
          { ...experience, period: { start: 2009 } },
          { ...experience, period: { start: new Date("2016-06-21") } },
        ],
        "experiences",
      ),
    ).toEqual([
      {
        path: "experiences[0].period.start",
        message: "Invalid input: expected string, received number",
      },
      {
        path: "experiences[1].period.start",
        message: "Invalid input: expected string, received Date",
      },
    ]);
  });

  it("names every skill graded with a level the marker cannot draw", () => {
    expect(
      schemaViolations(
        z.array(skillGroupSchema),
        [
          {
            category: { it: "Linguaggi", en: "Languages" },
            items: [
              { name: "PHP", level: "expert" },
              { name: "Go", level: "guru" },
            ],
          },
        ],
        "skills",
      ),
    ).toEqual([
      {
        path: "skills[0].items[1].level",
        message:
          'Invalid option: expected one of "proficient"|"advanced"|"expert"',
      },
    ]);
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
      { path: "experiences[2]", message: 'Invalid date: "nope"' },
      {
        path: "experiences[3]",
        message: 'Period ends before it starts: "2020" to "2010"',
      },
    ]);
  });
});

describe("contentViolations", () => {
  it("finds nothing to report in the content the site ships", () => {
    expect(contentViolations(TODAY)).toEqual([]);
  });
});

describe("formatViolation", () => {
  it("reads as the path followed by what is wrong at it", () => {
    expect(
      formatViolation({
        path: "skills[0].items[1]",
        message: 'unknown level "guru"',
      }),
    ).toBe('skills[0].items[1]: unknown level "guru"');
  });
});
