import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "vite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Notes are private: the content files carry them, the built site must not.
// The key is looked for as an object literal writes it, quoted or not, so the
// word in a sentence does not count.
const NOTES_KEY = /\bnotes["'`]?\s*:/;

describe("the built site", () => {
  let outDir;

  beforeAll(async () => {
    outDir = mkdtempSync(join(tmpdir(), "dist-"));
    await build({ logLevel: "silent", build: { outDir, emptyOutDir: true } });
  });

  afterAll(() => rmSync(outDir, { recursive: true, force: true }));

  it("has no notes field in its scripts", () => {
    const scripts = readdirSync(outDir, { recursive: true })
      .filter((file) => file.endsWith(".js"))
      .filter((file) =>
        NOTES_KEY.test(readFileSync(join(outDir, file), "utf8")),
      );

    expect(scripts).toEqual([]);
  });
});
