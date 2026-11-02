import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopBar } from "./TopBar";
import { grid } from "../pixel-grid/PixelGrid.page";
import { TopBarPage } from "./TopBar.page";

const topBar = new TopBarPage();

describe("TopBar", () => {
  it("tells where the reader is, as a path in a shell", () => {
    render(<TopBar page="projects" lang="it" />);

    expect(topBar.pathText()).toBe("~/projects");
  });

  it("leads to the home from the ~", () => {
    render(<TopBar page="projects" lang="it" />);

    expect(topBar.pathLinks()).toEqual([{ label: "~", href: "/" }]);
  });

  it("marks the page the reader is on, without linking it", () => {
    render(<TopBar page="projects" lang="it" />);

    expect(topBar.currentSegment()).toBe("projects");
  });

  it("keeps to English, leading to the English home, with the same path", () => {
    render(<TopBar page="projects" lang="en" />);

    expect({
      text: topBar.pathText(),
      links: topBar.pathLinks(),
    }).toEqual({ text: "~/projects", links: [{ label: "~", href: "/en/" }] });
  });

  it("on the home, is the home alone, and current", () => {
    render(<TopBar page="home" lang="it" />);

    expect({
      text: topBar.pathText(),
      links: topBar.pathLinks(),
      current: topBar.currentSegment(),
    }).toEqual({ text: "~", links: [], current: "~" });
  });

  it("is signed by the grid of the favicon, the top right cell off", () => {
    render(<TopBar page="home" lang="it" />);

    expect(topBar.logoDrawing()).toEqual(grid`
      ◾◾◻
      ◾◾◾
      ◾◾◾
    `);
  });

  it("leads to the home from the logo", () => {
    render(<TopBar page="projects" lang="it" />);

    expect(topBar.logoHref()).toBe("/");
  });

  it("leads to the English home from the logo, in English", () => {
    render(<TopBar page="projects" lang="en" />);

    expect(topBar.logoHref()).toBe("/en/");
  });
});
