import { describe, expect, it } from "vitest";
import { pageNumber, pagePath } from "./paths";

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

describe("pageNumber", () => {
  it("numbers the pages of the menu, the home first", () => {
    expect([pageNumber("home"), pageNumber("projects")]).toEqual([1, 2]);
  });

  it("leaves the CV without a number, as it is not in the menu", () => {
    expect(pageNumber("cv")).toBeUndefined();
  });
});
