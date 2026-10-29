import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { education } from "../../content/education";
import { experiences } from "../../content/experiences";
import { projects } from "../../content/projects";
import { training } from "../../content/training";
import { CvPage } from "./CvPage";

// The language is remembered on purpose, so it has to be forgotten between
// tests or the first one that switches it decides for the rest.
afterEach(() => localStorage.clear());

describe("CvPage", () => {
  it("keeps the sections of the CV, in the order the CV has them", () => {
    render(<CvPage />);

    expect(
      screen
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "Summary",
      "Projects",
      "Experience",
      "Education",
      "Formazione",
      "Skills",
    ]);
  });

  it("heads the page with the contacts, the handle linked to its profile", () => {
    render(<CvPage />);
    const header = screen.getByRole("banner");

    expect(
      within(header)
        .getAllByRole("link")
        .map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["mario.rossi@example.com", "mailto:mario.rossi@example.com"],
      ["mariorossi", "https://example.com/github/mariorossi"],
      [
        "example.com/linkedin/mario-rossi-idraulico",
        "https://www.example.com/linkedin/mario-rossi-idraulico/",
      ],
      ["danilosanchi.net", "https://danilosanchi.net"],
    ]);
  });

  it("describes each project with the text written for the CV", () => {
    render(<CvPage />);
    const items = within(
      screen.getByRole("list", { name: "Projects" }),
    ).getAllByRole("listitem");
    const openings = projects.map(
      (project) => `${project.name} — ${project.channels.cv.it}`,
    );

    expect(
      items.map((item, index) =>
        item.textContent?.slice(0, openings[index].length),
      ),
    ).toEqual(openings);
  });

  it("tells where to find each project, with the links from the content", () => {
    render(<CvPage />);
    const list = screen.getByRole("list", { name: "Projects" });

    expect(
      within(list)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual([
      "https://example.com/github/mariorossi/sifone-parlante",
      "https://example.com/fontanelle",
      "https://example.com/github/openraccordi",
    ]);
  });

  it("shows the address itself, so it can be read off paper and typed back", () => {
    render(<CvPage />);
    const list = screen.getByRole("list", { name: "Projects" });

    expect(
      within(list)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual([
      "example.com/github/mariorossi/sifone-parlante",
      "example.com/fontanelle",
      "example.com/github/openraccordi",
    ]);
  });

  it("switches the whole page to the other language", async () => {
    render(<CvPage />);

    await userEvent.click(screen.getByRole("button", { name: "English" }));

    expect({
      training: screen
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent)
        .at(-2),
      role: within(
        screen.getByRole("article", { name: "Rossi Consulenze Idrauliche" }),
      ).getByRole("heading", { level: 3 }).textContent,
    }).toEqual({
      training: "Training",
      role: "Plumbing consultant",
    });
  });

  it("gives every dated entry its own timeline", () => {
    render(<CvPage />);

    expect(screen.getAllByRole("img").length).toBe(
      experiences.length + education.length + training.length,
    );
  });

  it("heads an experience with role, company and dates", () => {
    render(<CvPage />);
    const entry = screen.getByRole("article", {
      name: "Rossi Consulenze Idrauliche",
    });

    expect({
      role: within(entry).getByRole("heading", { level: 3 }).textContent,
      company: within(entry).getByText("Rossi Consulenze Idrauliche")
        .textContent,
      period: within(entry).getByText(/2026/).textContent,
      timeline: within(entry).getByRole("img").getAttribute("aria-label"),
    }).toEqual({
      role: "Consulente idraulico",
      company: "Rossi Consulenze Idrauliche",
      period: "Gen 2026 - oggi",
      timeline: "Gen 2026 - oggi",
    });
  });

  it("prints the bullets written for the CV, not the prose written for LinkedIn", () => {
    render(<CvPage />);
    const entry = screen.getByRole("article", {
      name: "Rossi Consulenze Idrauliche",
    });

    expect(
      within(entry)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(experiences[0].channels.cv.it);
  });
});
