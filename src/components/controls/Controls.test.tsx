import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Controls } from "./Controls";

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

const languages = () =>
  screen.getAllByRole("link", { name: /^(English|Italiano)$/ });

describe("Controls", () => {
  it("marks what is in use — the language of the page, and the theme of the system", () => {
    render(<Controls page="home" lang="en" />);

    expect({
      lang: screen.getByRole("link", { current: "page" }).textContent,
      theme: screen
        .getAllByRole("button", { pressed: true })
        .map((button) => button.textContent),
    }).toEqual({ lang: "EN", theme: ["Auto"] });
  });

  it("leads to the same page in each language, Italian first, the default", () => {
    render(<Controls page="projects" lang="it" />);

    expect(
      languages().map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["IT", "/projects"],
      ["EN", "/en/projects"],
    ]);
  });

  it("remembers the language chosen, for the pages opened later", async () => {
    render(<Controls page="home" lang="it" />);

    await userEvent.click(screen.getByRole("link", { name: "English" }));

    expect(localStorage.getItem("lang")).toBe("en");
  });

  it("stamps the chosen theme on the document and remembers it", async () => {
    render(<Controls page="home" lang="it" />);

    await userEvent.click(screen.getByRole("button", { name: /dark/i }));

    expect({
      stamped: document.documentElement.dataset.theme,
      stored: localStorage.getItem("theme"),
    }).toEqual({ stamped: "dark", stored: "dark" });
  });

  it("goes back to the light theme when asked again", async () => {
    render(<Controls page="home" lang="it" />);

    await userEvent.click(screen.getByRole("button", { name: /dark/i }));
    await userEvent.click(screen.getByRole("button", { name: /light/i }));

    expect({
      stamped: document.documentElement.dataset.theme,
      stored: localStorage.getItem("theme"),
    }).toEqual({ stamped: "light", stored: "light" });
  });

  it("gives the page back to the system on Auto, forgetting the choice", async () => {
    render(<Controls page="home" lang="it" />);

    await userEvent.click(screen.getByRole("button", { name: /dark/i }));
    await userEvent.click(screen.getByRole("button", { name: /auto/i }));

    expect({
      stamped: document.documentElement.dataset.theme,
      stored: localStorage.getItem("theme"),
    }).toEqual({ stamped: undefined, stored: null });
  });
});
