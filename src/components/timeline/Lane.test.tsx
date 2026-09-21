import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Lane } from "./Lane";

const DOMAIN = { from: Date.UTC(1994, 0, 1), to: Date.UTC(2026, 11, 31) };

const geometry = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("[style]")).map((element) =>
    element.getAttribute("style"),
  );

describe("Lane", () => {
  it("draws the range and a dot at each of its ends", () => {
    const { container } = render(
      <Lane
        period={{ start: "2020-02", end: "2025-06" }}
        domain={DOMAIN}
        lang="it"
      />,
    );

    expect(geometry(container)).toEqual([
      "left: 79.05%; width: 16.4%;",
      "left: 79.05%;",
      "left: 95.44%;",
    ]);
  });

  it("draws a single day as one dot, with no range under it", () => {
    const { container } = render(
      <Lane
        period={{ start: "2016-06-21", end: "2016-06-21" }}
        domain={DOMAIN}
        lang="it"
      />,
    );

    expect(geometry(container)).toEqual(["left: 68.1%;"]);
  });

  it("names each dot with the date it marks, for whoever hovers it", () => {
    const { container } = render(
      <Lane
        period={{ start: "2020-02", end: "2025-06" }}
        domain={DOMAIN}
        lang="it"
      />,
    );

    expect(
      Array.from(container.querySelectorAll("[data-label]")).map((dot) =>
        dot.getAttribute("data-label"),
      ),
    ).toEqual(["Feb 2020", "Giu 2025"]);
  });

  it("leaves a period still open without a dot on its right end", () => {
    const { container } = render(
      <Lane period={{ start: "2026-08" }} domain={DOMAIN} lang="it" />,
    );

    expect(geometry(container)).toEqual([
      "left: 98.74%; width: 1.26%;",
      "left: 98.74%;",
    ]);
  });

  it("says out loud what the drawing shows, in the language asked", () => {
    render(<Lane period={{ start: "2026-08" }} domain={DOMAIN} lang="en" />);

    expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
      "Aug 2026 - present",
    );
  });
});
