import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Marker } from "./Marker";

const lit = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("rect"))
    .filter((cell) => cell.getAttribute("data-lit") === "true")
    .map((cell) => `${cell.getAttribute("x")},${cell.getAttribute("y")}`);

describe("Marker", () => {
  it("lights five, seven or nine of the nine cells, by level", () => {
    const counts = (["proficient", "advanced", "expert"] as const).map(
      (level) => lit(render(<Marker level={level} />).container).length,
    );

    expect(counts).toEqual([5, 7, 9]);
  });

  it("fills from the bottom left, a row at a time", () => {
    const { container } = render(<Marker level="proficient" />);

    expect(lit(container)).toEqual([
      "0,6.5",
      "3.25,6.5",
      "6.5,6.5",
      "0,3.25",
      "3.25,3.25",
    ]);
  });

  it("says the level for whoever cannot see the square", () => {
    const { container } = render(<Marker level="advanced" />);

    expect(container.textContent).toBe("advanced");
  });
});
