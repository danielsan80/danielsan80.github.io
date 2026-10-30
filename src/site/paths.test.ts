import { describe, expect, it } from "vitest";
import { pagePath } from "./paths";

describe("pagePath", () => {
  it("keeps Italian, the default, at the root of the site", () => {
    expect([
      pagePath("home", "it"),
      pagePath("projects", "it"),
      pagePath("cv", "it"),
    ]).toEqual(["/", "/projects", "/cv"]);
  });

  it("puts English under /en, its home a folder like the root's", () => {
    expect([
      pagePath("home", "en"),
      pagePath("projects", "en"),
      pagePath("cv", "en"),
    ]).toEqual(["/en/", "/en/projects", "/en/cv"]);
  });
});
