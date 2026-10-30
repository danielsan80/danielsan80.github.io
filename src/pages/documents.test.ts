import { afterEach, describe, expect, it } from "vitest";
import cv from "../../cv.html?raw";
import cvEn from "../../en/cv.html?raw";
import homeEn from "../../en/index.html?raw";
import projectsEn from "../../en/projects.html?raw";
import home from "../../index.html?raw";
import projects from "../../projects.html?raw";

const PAGES = { home, projects, cv, homeEn, projectsEn, cvEn };

const eachPage = <T>(read: (page: string) => T) =>
  Object.fromEntries(
    Object.entries(PAGES).map(([name, page]) => [name, read(page)]),
  );

const parse = (page: string) =>
  new DOMParser().parseFromString(page, "text/html");

const head = (page: string) => parse(page).head;

const robots = (page: string) =>
  head(page).querySelector('meta[name="robots"]')?.getAttribute("content") ??
  null;

const canonical = (page: string) =>
  head(page).querySelector('link[rel="canonical"]')?.getAttribute("href") ??
  null;

const favicon = (page: string) =>
  head(page).querySelector('link[rel="icon"]')?.getAttribute("href") ?? null;

const lang = (page: string) => parse(page).documentElement.lang;

const alternates = (page: string) =>
  Array.from(head(page).querySelectorAll('link[rel="alternate"]')).map(
    (link) => [link.getAttribute("hreflang"), link.getAttribute("href")],
  );

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
  it("keeps the CV out of search engines, since its link is handed out, and leaves the other pages findable", () => {
    expect(eachPage(robots)).toEqual({
      home: null,
      projects: null,
      cv: "noindex",
      homeEn: null,
      projectsEn: null,
      cvEn: "noindex",
    });
  });

  it("gives every page the same icon", () => {
    expect(eachPage(favicon)).toEqual({
      home: "/favicon.svg",
      projects: "/favicon.svg",
      cv: "/favicon.svg",
      homeEn: "/favicon.svg",
      projectsEn: "/favicon.svg",
      cvEn: "/favicon.svg",
    });
  });

  it("names every page by the address it is served from, without a trailing slash past the home", () => {
    expect(eachPage(canonical)).toEqual({
      home: "https://danilosanchi.net/",
      projects: "https://danilosanchi.net/projects",
      cv: "https://danilosanchi.net/cv",
      homeEn: "https://danilosanchi.net/en/",
      projectsEn: "https://danilosanchi.net/en/projects",
      cvEn: "https://danilosanchi.net/en/cv",
    });
  });

  it("declares the language each page is written in", () => {
    expect(eachPage(lang)).toEqual({
      home: "it",
      projects: "it",
      cv: "it",
      homeEn: "en",
      projectsEn: "en",
      cvEn: "en",
    });
  });

  it("points every page to its version in each language, Italian for whoever speaks neither", () => {
    const versions = (path: string) => [
      ["it", `https://danilosanchi.net${path}`],
      ["en", `https://danilosanchi.net/en${path}`],
      ["x-default", `https://danilosanchi.net${path}`],
    ];

    expect(eachPage(alternates)).toEqual({
      home: versions("/"),
      projects: versions("/projects"),
      cv: versions("/cv"),
      homeEn: versions("/"),
      projectsEn: versions("/projects"),
      cvEn: versions("/cv"),
    });
  });

  it("applies the stored theme before the page draws, on every page", () => {
    expect(eachPage((page) => themeOnLoad(page, "dark"))).toEqual({
      home: "dark",
      projects: "dark",
      cv: "dark",
      homeEn: "dark",
      projectsEn: "dark",
      cvEn: "dark",
    });
  });
});
