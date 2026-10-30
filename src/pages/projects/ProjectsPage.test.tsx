import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { pick } from "../../content/localized";
import { projects } from "../../content/projects";
import { topics } from "../../content/topics";
import { ProjectsPage } from "./ProjectsPage";

describe("ProjectsPage", () => {
  it("leads back to the home, by the name of the person", () => {
    render(<ProjectsPage lang="it" />);

    expect(
      screen.getByRole("link", { name: "Mario Rossi" }).getAttribute("href"),
    ).toBe("/");
  });

  it("keeps to English, leading back to the English home", () => {
    render(<ProjectsPage lang="en" />);

    expect(
      screen.getByRole("link", { name: "Mario Rossi" }).getAttribute("href"),
    ).toBe("/en/");
  });

  it("shows every project, with the role and the period, in the order of the file", () => {
    render(<ProjectsPage lang="it" />);

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
    render(<ProjectsPage lang="it" />);
    const region = screen.getByRole("region", { name: "Progetti" });

    expect(
      projects.map(
        (project) => within(region).getByText(project.channels.site.it).tagName,
      ),
    ).toEqual(projects.map(() => "P"));
  });

  it("links every project to all the places it lives", () => {
    render(<ProjectsPage lang="it" />);

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
    render(<ProjectsPage lang="it" />);

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

  it("speaks English at its English address", () => {
    render(<ProjectsPage lang="en" />);

    expect({
      heading: screen.getByRole("heading", { level: 1 }).textContent,
      topics: screen.getByRole("region", { name: "On GitHub" }).tagName,
      untagged: screen.getByRole("link", { name: "no topic" }).tagName,
    }).toEqual({ heading: "Projects", topics: "SECTION", untagged: "A" });
  });

  it("describes each topic in a line", () => {
    render(<ProjectsPage lang="it" />);

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
