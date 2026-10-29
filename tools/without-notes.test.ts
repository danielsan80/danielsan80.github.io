import { createServer } from "vite";
import { describe, expect, it } from "vitest";
import type { Experience } from "../src/content/experiences";
import { withoutNotes } from "./without-notes";

async function companiesWithNotes(mode?: string): Promise<string[]> {
  const server = await createServer({
    mode,
    logLevel: "silent",
    server: { middlewareMode: true },
    appType: "custom",
  });

  try {
    const { experiences } = await server.ssrLoadModule(
      "/src/content/experiences.ts",
    );
    return (experiences as Experience[])
      .filter((experience) => experience.notes !== undefined)
      .map((experience) => experience.company);
  } finally {
    await server.close();
  }
}

describe("the content Vite loads", () => {
  it("has no notes by default, as the prerender reads it", async () => {
    expect(await companiesWithNotes()).toEqual([]);
  });

  it("keeps the notes in the with-notes mode, for the content check", async () => {
    expect(await companiesWithNotes("with-notes")).not.toEqual([]);
  });
});

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
    expect(withoutNotes({ name: "Mario", notes: "Private." })).toEqual({
      name: "Mario",
    });
  });

  it("removes notes nested at any depth, in mappings and in lists", () => {
    expect(
      withoutNotes([
        {
          name: "Sifone Parlante",
          period: { start: "2025-01", notes: "Private." },
          links: [
            { url: "https://example.com/sifone-parlante", notes: "Private." },
          ],
        },
      ]),
    ).toEqual([
      {
        name: "Sifone Parlante",
        period: { start: "2025-01" },
        links: [{ url: "https://example.com/sifone-parlante" }],
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
