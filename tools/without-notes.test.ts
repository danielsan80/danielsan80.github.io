import { describe, expect, it } from "vitest";
import { withoutNotes } from "./without-notes";

describe("withoutNotes", () => {
  it("removes the notes of each entry in a list", () => {
    expect(
      withoutNotes([
        { company: "Acme", notes: "Private." },
        { company: "Globex" },
      ]),
    ).toEqual([{ company: "Acme" }, { company: "Globex" }]);
  });

  it("removes the notes of a mapping at the root", () => {
    expect(withoutNotes({ name: "Danilo", notes: "Private." })).toEqual({
      name: "Danilo",
    });
  });

  it("removes notes nested at any depth, in mappings and in lists", () => {
    expect(
      withoutNotes([
        {
          name: "QRiddle",
          period: { start: "2025-01", notes: "Private." },
          links: [{ url: "https://qriddle.app", notes: "Private." }],
        },
      ]),
    ).toEqual([
      {
        name: "QRiddle",
        period: { start: "2025-01" },
        links: [{ url: "https://qriddle.app" }],
      },
    ]);
  });

  it("leaves everything else as it is: scalars, lists of scalars, nulls", () => {
    const content = {
      remote: true,
      year: 2026,
      end: null,
      tags: ["php", "notes"],
      channels: { cv: { it: ["Una riga."] } },
    };

    expect(withoutNotes(content)).toEqual(content);
  });
});
