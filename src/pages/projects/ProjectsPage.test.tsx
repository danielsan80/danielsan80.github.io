import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { pick } from "../../content/localized";
import { projects } from "../../content/projects";
import { topics } from "../../content/topics";
import { ProjectsPage } from "./ProjectsPage";

// The language is remembered on purpose, so it has to be forgotten between
// tests or the first one that switches it decides for the rest.
afterEach(() => localStorage.clear());

describe("ProjectsPage", () => {
  it("leads back to the home, by the name of the person", () => {
    render(<ProjectsPage />);

    expect(
      screen.getByRole("link", { name: "Mario Rossi" }).getAttribute("href"),
    ).toBe("/");
  });

  it("shows every project, with the role and the period, in the order of the file", () => {
    render(<ProjectsPage />);

    const items = within(
      screen.getByRole("region", { name: "Progetti" }),
    ).getAllByRole("article");

    expect(
      items.map((item) => ({
        name: within(item).getByRole("heading", { level: 2 }).textContent,
        meta: within(item).getByTestId("meta").textContent,
      })),
    ).toEqual([
      { name: "Sifone Parlante", meta: "autore · Mar 2021 - oggi" },
      {
        name: "Le Fontanelle di Borgo Sifone",
        meta: "autore · Mag 2017 - Set 2019",
      },
      { name: "OpenRaccordi", meta: "collaboratore · Feb 2023 - Giu 2024" },
    ]);
  });

  it("describes each project with the text written for the site", () => {
    render(<ProjectsPage />);
    const region = screen.getByRole("region", { name: "Progetti" });

    expect(
      projects.map(
        (project) => within(region).getByText(project.channels.site.it).tagName,
      ),
    ).toEqual(projects.map(() => "P"));
  });

  it("links every project to all the places it lives", () => {
    render(<ProjectsPage />);

    const links = within(
      screen.getByRole("region", { name: "Progetti" }),
    ).getAllByRole("link");

    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "https://example.com/github/mariorossi/sifone-parlante",
      "https://example.com/fontanelle",
      "https://example.com/github/openraccordi",
    ]);
  });

  it("links every topic to the repositories that carry it", () => {
    render(<ProjectsPage />);

    const links = within(
      screen.getByRole("region", { name: "Su GitHub" }),
    ).getAllByRole("link");

    expect(
      links.map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual([
      ["raccordi", topicSearch("topic:raccordi")],
      ["sensori", topicSearch("topic:sensori")],
      ["senza topic", topicSearch("topics:0")],
    ]);
  });

  it("switches the whole page to English", async () => {
    render(<ProjectsPage />);

    await userEvent.click(screen.getByRole("button", { name: "English" }));

    expect({
      heading: screen.getByRole("heading", { level: 1 }).textContent,
      topics: screen.getByRole("region", { name: "On GitHub" }).tagName,
      untagged: screen.getByRole("link", { name: "no topic" }).tagName,
    }).toEqual({ heading: "Projects", topics: "SECTION", untagged: "A" });
  });

  it("describes each topic in a line", () => {
    render(<ProjectsPage />);

    expect(
      within(screen.getByRole("region", { name: "Su GitHub" }))
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(
      topics.map(
        (topic) => `${pick(topic.label, "it")} ${topic.description.it}`,
      ),
    );
  });
});

const topicSearch = (query: string) =>
  `https://example.com/github/mariorossi?tab=repositories&q=${encodeURIComponent(query)}`;
