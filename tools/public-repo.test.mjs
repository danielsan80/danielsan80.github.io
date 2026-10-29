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
});
