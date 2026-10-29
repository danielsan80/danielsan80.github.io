import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

// The content lives in .private/, a private repository of its own: its notes
// must not be readable here, and the rest stays with them.
describe("the public repository", () => {
  it("tracks no content file", () => {
    const files = execFileSync(
      "git",
      ["ls-files", "src/content/*.yaml", "src/content/*.yml"],
      { encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean);

    expect(files).toEqual([]);
  });

  it("tracks the content photos as a link to .private/photos", () => {
    const entries = execFileSync(
      "git",
      ["ls-files", "--stage", "public/photos"],
      { encoding: "utf8" },
    )
      .split("\n")
      .filter(Boolean)
      .map((entry) => {
        const [mode, blob] = entry.split(/\s+/);
        const target = execFileSync("git", ["cat-file", "-p", blob], {
          encoding: "utf8",
        });
        return { mode, target };
      });

    expect(entries).toEqual([{ mode: "120000", target: "../.private/photos" }]);
  });
});
