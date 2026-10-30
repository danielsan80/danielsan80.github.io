import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { pick } from "../../content/localized";
import { projects } from "../../content/projects";
import { topics } from "../../content/topics";
import { Projects } from "./Projects";
import { ProjectsPage } from "./Projects.page";

const projectsPage = new ProjectsPage();

describe("Projects", () => {
  it("leads back to the home, by the name of the person", () => {
    render(<Projects lang="it" />);

    expect(projectsPage.linkHref("Mario Rossi")).toBe("/");
  });

  it("keeps to English, leading back to the English home", () => {
    render(<Projects lang="en" />);

    expect(projectsPage.linkHref("Mario Rossi")).toBe("/en/");
  });

  it("shows every project, with the role and the period, in the order of the file", () => {
    render(<Projects lang="it" />);

    expect(
      projectsPage
        .projectsSection("Progetti")
        .projects()
        .map(({ name, meta }) => ({ name, meta })),
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
    render(<Projects lang="it" />);

    expect(
      projectsPage
        .projectsSection("Progetti")
        .projects()
        .map((project) => project.summary),
    ).toEqual(projects.map((project) => project.channels.site.it));
  });

  it("links every project to all the places it lives", () => {
    render(<Projects lang="it" />);

    expect(projectsPage.projectsSection("Progetti").links()).toEqual([
      "https://example.com/github/mariorossi/sifone-parlante",
      "https://example.com/fontanelle",
      "https://example.com/github/openraccordi",
    ]);
  });

  it("links every topic to the repositories that carry it", () => {
    render(<Projects lang="it" />);

    expect(projectsPage.topicsSection("Su GitHub").topics()).toEqual([
      { label: "raccordi", href: topicSearch("topic:raccordi") },
      { label: "sensori", href: topicSearch("topic:sensori") },
      { label: "senza topic", href: topicSearch("topics:0") },
    ]);
  });

  it("describes each topic in a line", () => {
    render(<Projects lang="it" />);

    expect(projectsPage.topicsSection("Su GitHub").entries()).toEqual(
      topics.map(
        (topic) => `${pick(topic.label, "it")} ${topic.description.it}`,
      ),
    );
  });

  it("speaks English at its English address", () => {
    render(<Projects lang="en" />);

    expect({
      title: projectsPage.title(),
      projects: projectsPage
        .projectsSection("Projects")
        .projects()
        .map((project) => project.summary),
      topics: projectsPage.topicsSection("On GitHub").entries(),
    }).toEqual({
      title: "Projects",
      projects: projects.map((project) => project.channels.site.en),
      topics: topics.map(
        (topic) => `${pick(topic.label, "en")} ${topic.description.en}`,
      ),
    });
  });
});

const topicSearch = (query: string) =>
  `https://example.com/github/mariorossi?tab=repositories&q=${encodeURIComponent(query)}`;
