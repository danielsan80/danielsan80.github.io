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

  it("says out loud what the drawing shows, in the language asked", () => {
    render(<Lane period={{ start: "2026-08" }} domain={DOMAIN} lang="en" />);

    expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
      "Aug 2026 - present",
    );
  });
});
