import { afterEach, describe, expect, it } from "vitest";
import cv from "../../cv.html?raw";
import home from "../../index.html?raw";
import projects from "../../projects.html?raw";

const head = (page: string) =>
  new DOMParser().parseFromString(page, "text/html").head;

const robots = (page: string) =>
  head(page).querySelector('meta[name="robots"]')?.getAttribute("content") ??
  null;

const canonical = (page: string) =>
  head(page).querySelector('link[rel="canonical"]')?.getAttribute("href") ??
  null;

const favicon = (page: string) =>
  head(page).querySelector('link[rel="icon"]')?.getAttribute("href") ?? null;

// What the page runs before it draws: the inline script, the one without a src.
const themeOnLoad = (page: string, stored: string) => {
  localStorage.setItem("theme", stored);
  const script = head(page).querySelector("script:not([src])");
  new Function(script?.textContent ?? "")();
  return document.documentElement.dataset.theme;
};

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

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

  it("names every page by an address without a trailing slash, the file it is served from", () => {
    expect({
      home: canonical(home),
      projects: canonical(projects),
      cv: canonical(cv),
    }).toEqual({
      home: "https://danilosanchi.net/",
      projects: "https://danilosanchi.net/projects",
      cv: "https://danilosanchi.net/cv",
    });
  });

  it("applies the stored theme before the page draws, on every page", () => {
    expect({
      home: themeOnLoad(home, "dark"),
      projects: themeOnLoad(projects, "dark"),
      cv: themeOnLoad(cv, "dark"),
    }).toEqual({ home: "dark", projects: "dark", cv: "dark" });
  });
});
