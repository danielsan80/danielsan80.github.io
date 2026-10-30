import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { identity } from "../../content/identity";
import { highlightedProjects } from "../../content/projects";
import { Home } from "./Home";

describe("Home", () => {
  it("introduces the person: portrait, real name, headline and a few lines about them", () => {
    render(<Home lang="it" />);

    const intro = screen.getByRole("banner");

    expect({
      portrait: within(intro).getByRole("img").getAttribute("src"),
      name: within(intro).getByRole("heading", { level: 1 }).textContent,
      headline: Array.from(
        within(intro).getByText("Master plumber").closest("p")?.children ?? [],
      ).map((line) => line.textContent),
      summary: within(intro).getByText(identity.channels.home.summary.it)
        .tagName,
    }).toEqual({
      portrait: "/photos/portrait.svg",
      name: "Mario Rossi",
      headline: [
        "Master plumber · Leak whisperer",
        "Copper by day · Code by night",
      ],
      summary: "P",
    });
  });

  it("shows only the highlighted projects, each with its photo", () => {
    render(<Home lang="it" />);

    const projects = within(
      screen.getByRole("region", { name: "Progetti" }),
    ).getAllByRole("article");

    expect(
      projects.map((project) => ({
        name: within(project).getByRole("heading", { level: 3 }).textContent,
        photo: within(project).getByRole("img").getAttribute("src"),
      })),
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
    const region = screen.getByRole("region", { name: "Progetti" });

    expect(
      highlightedProjects.map(
        (project) => within(region).getByText(project.channels.site.it).tagName,
      ),
    ).toEqual(highlightedProjects.map(() => "P"));
  });

  it("links every highlighted project to all the places it lives, then to all the projects", () => {
    render(<Home lang="it" />);

    const links = within(
      screen.getByRole("region", { name: "Progetti" }),
    ).getAllByRole("link");

    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "https://example.com/github/mariorossi/sifone-parlante",
      "https://example.com/fontanelle",
      "/projects",
    ]);
  });

  it("keeps to English, linking all the projects in English", () => {
    render(<Home lang="en" />);

    expect(
      screen.getByRole("link", { name: "All projects →" }).getAttribute("href"),
    ).toBe("/en/projects");
  });

  it("gathers every profile and the way to write, in the footer", () => {
    render(<Home lang="it" />);

    const links = within(screen.getByRole("contentinfo")).getAllByRole("link");

    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "https://example.com/github/mariorossi",
      "https://www.example.com/linkedin/mario-rossi-idraulico/",
      "mailto:mario.rossi@example.com",
    ]);
  });

  it("shows the handle next to each profile, so the same person is recognisable, and the address last among them", () => {
    render(<Home lang="it" />);

    const entries = within(screen.getByRole("contentinfo")).getAllByRole(
      "listitem",
    );

    expect(entries.map((entry) => entry.textContent)).toEqual([
      "GitHub mariorossi",
      "LinkedIn mario-rossi-idraulico",
      "Email mario.rossi@example.com",
    ]);
  });

  it("keeps the CV off the page: its link is handed out, not published", () => {
    render(<Home lang="it" />);

    expect(
      screen
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"))
        .filter((href) => href?.includes("/cv")),
    ).toEqual([]);
  });

  it("speaks English at its English address", () => {
    render(<Home lang="en" />);

    expect({
      summary: screen.getByText(identity.channels.home.summary.en).tagName,
      projects: screen.getByRole("region", { name: "Projects" }).tagName,
    }).toEqual({ summary: "P", projects: "SECTION" });
  });
});
