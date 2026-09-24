import { describe, expect, it } from "vitest";
import cv from "../../cv/index.html?raw";
import home from "../../index.html?raw";

const head = (page: string) =>
  new DOMParser().parseFromString(page, "text/html").head;

const robots = (page: string) =>
  head(page).querySelector('meta[name="robots"]')?.getAttribute("content") ??
  null;

describe("page documents", () => {
  it("keeps the CV out of search engines, since its link is handed out, and leaves the home findable", () => {
    expect({ home: robots(home), cv: robots(cv) }).toEqual({
      home: null,
      cv: "noindex",
    });
  });
});
