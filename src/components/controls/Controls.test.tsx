import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Controls } from "./Controls";
import { ControlsPage } from "./Controls.page";

const controls = new ControlsPage();

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

const theme = () => ({
  applied: document.documentElement.dataset.theme,
  stored: localStorage.getItem("theme"),
});

describe("Controls", () => {
  it("marks what is in use — the language of the page, and the theme of the system", () => {
    render(<Controls page="home" lang="en" />);

    expect({
      lang: controls.currentLanguage(),
      theme: controls.currentTheme(),
    }).toEqual({ lang: "EN", theme: "Auto" });
  });

  it("leads to the same page in each language, Italian first, the default", () => {
    render(<Controls page="projects" lang="it" />);

    expect(controls.languages()).toEqual([
      { code: "IT", href: "/projects" },
      { code: "EN", href: "/en/projects" },
    ]);
  });

  it("remembers the language chosen, for the pages opened later", async () => {
    render(<Controls page="home" lang="it" />);

    await controls.clickLanguage("English");

    expect(localStorage.getItem("lang")).toBe("en");
  });

  it("applies the chosen theme to the document and remembers it", async () => {
    render(<Controls page="home" lang="it" />);

    await controls.clickTheme("Dark");

    expect(theme()).toEqual({ applied: "dark", stored: "dark" });
  });

  it("goes back to the light theme when asked again", async () => {
    render(<Controls page="home" lang="it" />);

    await controls.clickTheme("Dark");
    await controls.clickTheme("Light");

    expect(theme()).toEqual({ applied: "light", stored: "light" });
  });

  it("gives the page back to the system on Auto, forgetting the choice", async () => {
    render(<Controls page="home" lang="it" />);

    await controls.clickTheme("Dark");
    await controls.clickTheme("Auto");

    expect(theme()).toEqual({ applied: undefined, stored: null });
  });
});
