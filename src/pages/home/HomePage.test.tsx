import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { contact } from "../../content/contact";
import { identity } from "../../content/identity";
import { profiles } from "../../content/profiles";
import { highlightedProjects } from "../../content/projects";
import { HomePage } from "./HomePage";

// The language is remembered on purpose, so it has to be forgotten between
// tests or the first one that switches it decides for the rest.
afterEach(() => localStorage.clear());

describe("HomePage", () => {
  it("introduces the person: portrait, real name, tagline and a few lines about them", () => {
    render(<HomePage />);

    const intro = screen.getByRole("banner");

    expect({
      portrait: within(intro).getByRole("img").getAttribute("src"),
      name: within(intro).getByRole("heading", { level: 1 }).textContent,
      tagline: Array.from(
        within(intro).getByText("Senior software engineer").closest("p")
          ?.children ?? [],
      ).map((line) => line.textContent),
      about: within(intro).getByText(identity.about.it).tagName,
    }).toEqual({
      portrait: identity.portrait.src,
      name: "Danilo Sanchi",
      tagline: [
        "Senior software engineer · Hands-on consultant",
        "Clean code lover · Hearthian at heart",
      ],
      about: "P",
    });
  });

  it("shows only the highlighted projects, each with its photo", () => {
    render(<HomePage />);

    const projects = within(
      screen.getByRole("region", { name: "Progetti" }),
    ).getAllByRole("article");

    expect(
      projects.map((project) => ({
        name: within(project).getByRole("heading", { level: 3 }).textContent,
        photo: within(project).getByRole("img").getAttribute("src"),
      })),
    ).toEqual([
      {
        name: "Mini Race Challenge",
        photo: "/photos/mini-race-challenge.webp",
      },
      { name: "QRiddle", photo: "/photos/qriddle.webp" },
    ]);
  });

  it("links every highlighted project to all the places it lives, then to all the projects", () => {
    render(<HomePage />);

    const links = within(
      screen.getByRole("region", { name: "Progetti" }),
    ).getAllByRole("link");

    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      ...highlightedProjects.flatMap((project) =>
        project.links.map(({ url }) => url),
      ),
      "/projects/",
    ]);
  });

  it("gathers every profile and the way to write, in the footer", () => {
    render(<HomePage />);

    const links = within(screen.getByRole("contentinfo")).getAllByRole("link");

    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      ...profiles.map((profile) => profile.url),
      `mailto:${contact.email}`,
    ]);
  });

  it("shows the handle next to each profile, so the same person is recognisable, and the address last among them", () => {
    render(<HomePage />);

    const entries = within(screen.getByRole("contentinfo")).getAllByRole(
      "listitem",
    );

    expect(entries.map((entry) => entry.textContent)).toEqual([
      ...profiles.map((profile) => `${profile.name} ${profile.handle}`),
      `Email ${contact.email}`,
    ]);
  });

  it("keeps the CV off the page: its link is handed out, not published", () => {
    render(<HomePage />);

    expect(
      screen
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"))
        .filter((href) => href?.includes("/cv")),
    ).toEqual([]);
  });

  it("switches the whole page to English", async () => {
    render(<HomePage />);

    await userEvent.click(screen.getByRole("button", { name: "English" }));

    expect({
      about: screen.getByText(identity.about.en).tagName,
      projects: screen.getByRole("region", { name: "Projects" }).tagName,
    }).toEqual({ about: "P", projects: "SECTION" });
  });
});
