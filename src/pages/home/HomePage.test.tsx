import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { featuredProjects } from "../../content/projects";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("leads with the real name, not the handle", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Danilo Sanchi",
    );
  });

  it("ties the historical GitHub handle to the person", () => {
    render(<HomePage />);

    const github = screen.getByRole("link", { name: /danielsan80/ });

    expect(github).toHaveAttribute("href", "https://github.com/danielsan80");
  });

  it("says what the person does, not what the site contains", () => {
    render(<HomePage />);

    expect(screen.getByRole("main")).toHaveTextContent(
      /building things with care since 2007/i,
    );
  });

  it("states the current status: freelance and available", () => {
    render(<HomePage />);

    expect(screen.getByRole("main")).toHaveTextContent(
      /freelance.*open to new collaborations/i,
    );
  });

  it("shows every featured project, the RC cars next to the libraries", () => {
    render(<HomePage />);

    const projects = within(
      screen.getByRole("region", { name: "Projects" }),
    ).getAllByRole("heading", { level: 3 });

    expect(projects.map((heading) => heading.textContent)).toEqual(
      featuredProjects.map((project) => project.name),
    );
  });

  it("links every project to all the places it lives", () => {
    render(<HomePage />);

    const links = within(
      screen.getByRole("region", { name: "Projects" }),
    ).getAllByRole("link");

    expect(links.map((link) => link.getAttribute("href"))).toEqual(
      featuredProjects.flatMap((project) =>
        project.links.map(({ url }) => url),
      ),
    );
  });
});
