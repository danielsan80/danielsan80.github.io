import { describe, expect, it } from "vitest";
import cv from "../../cv/index.html?raw";
import home from "../../index.html?raw";
import projects from "../../projects/index.html?raw";

const head = (page: string) =>
  new DOMParser().parseFromString(page, "text/html").head;

const robots = (page: string) =>
  head(page).querySelector('meta[name="robots"]')?.getAttribute("content") ??
  null;

const favicon = (page: string) =>
  head(page).querySelector('link[rel="icon"]')?.getAttribute("href") ?? null;

describe("page documents", () => {
  it("keeps the CV out of search engines, since its link is handed out, and leaves the home findable", () => {
    expect({
      home: robots(home),
      projects: robots(projects),
      cv: robots(cv),
    }).toEqual({ home: null, projects: null, cv: "noindex" });
  });

  it("gives every page the same icon", () => {
    expect({
      home: favicon(home),
      projects: favicon(projects),
      cv: favicon(cv),
    }).toEqual({
      home: "/favicon.svg",
      projects: "/favicon.svg",
      cv: "/favicon.svg",
    });
  });
});
