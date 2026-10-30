import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { identity } from "../../content/identity";
import { highlightedProjects } from "../../content/projects";
import { Home } from "./Home";
import { HomePage } from "./Home.page";

const homePage = new HomePage();

describe("Home", () => {
  it("introduces the person: portrait, real name, headline and a few lines about them", () => {
    render(<Home lang="it" />);

    expect({
      portrait: homePage.intro.portrait(),
      name: homePage.intro.name(),
      headline: homePage.intro.headline(),
      summary: homePage.intro.summary(),
    }).toEqual({
      portrait: "/photos/portrait.svg",
      name: "Mario Rossi",
      headline: [
        "Master plumber · Leak whisperer",
        "Copper by day · Code by night",
      ],
      summary: identity.channels.home.summary.it,
    });
  });

  it("shows only the highlighted projects, each with its photo", () => {
    render(<Home lang="it" />);

    expect(
      homePage
        .projectsSection("Progetti")
        .projects()
        .map(({ name, photo }) => ({ name, photo })),
    ).toEqual([
      { name: "Sifone Parlante", photo: "/photos/talking-trap.svg" },
      {
        name: "Le Fontanelle di Borgo Sifone",
        photo: "/photos/drinking-fountains.svg",
      },
    ]);
  });

  it("describes each highlighted project with the text written for the site", () => {
    render(<Home lang="it" />);

    expect(
      homePage
        .projectsSection("Progetti")
        .projects()
        .map((project) => project.summary),
    ).toEqual(highlightedProjects.map((project) => project.channels.site.it));
  });

  it("links every highlighted project to all the places it lives, then to all the projects", () => {
    render(<Home lang="it" />);

    expect(homePage.projectsSection("Progetti").links()).toEqual([
      "https://example.com/github/mariorossi/sifone-parlante",
      "https://example.com/fontanelle",
      "/projects",
    ]);
  });

  it("keeps to English, linking all the projects in English", () => {
    render(<Home lang="en" />);

    expect(
      homePage.projectsSection("Projects").linkHref("All projects →"),
    ).toBe("/en/projects");
  });

  it("gathers every profile and the way to write, in the footer", () => {
    render(<Home lang="it" />);

    expect(homePage.footer.links()).toEqual([
      "https://example.com/github/mariorossi",
      "https://www.example.com/linkedin/mario-rossi-idraulico/",
      "mailto:mario.rossi@example.com",
    ]);
  });

  it("shows the handle next to each profile, so the same person is recognisable, and the address last among them", () => {
    render(<Home lang="it" />);

    expect(homePage.footer.entries()).toEqual([
      "GitHub mariorossi",
      "LinkedIn mario-rossi-idraulico",
      "Email mario.rossi@example.com",
    ]);
  });

  it("keeps the CV off the page: its link is handed out, not published", () => {
    render(<Home lang="it" />);

    expect(homePage.links().filter((href) => href?.includes("/cv"))).toEqual(
      [],
    );
  });

  it("speaks English at its English address", () => {
    render(<Home lang="en" />);

    expect({
      summary: homePage.intro.summary(),
      projects: homePage
        .projectsSection("Projects")
        .projects()
        .map((project) => project.summary),
    }).toEqual({
      summary: identity.channels.home.summary.en,
      projects: highlightedProjects.map((project) => project.channels.site.en),
    });
  });
});
