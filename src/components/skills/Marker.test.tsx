import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SkillLevel } from "../../content/skills";
import { grid, PixelGridPage } from "../pixel-grid/PixelGrid.page";
import { Marker } from "./Marker";

const drawing = (level: SkillLevel) =>
  new PixelGridPage(render(<Marker level={level} />).container).drawing();

describe("Marker", () => {
  it("fills past half at the lowest level, from the bottom left", () => {
    expect(drawing("proficient")).toEqual(grid`
      ◻◻◻
      ◾◾◻
      ◾◾◾
    `);
  });

  it("fills on, a row at a time, at the level above", () => {
    expect(drawing("advanced")).toEqual(grid`
      ◾◻◻
      ◾◾◾
      ◾◾◾
    `);
  });

  it("fills the whole square at the highest level", () => {
    expect(drawing("expert")).toEqual(grid`
      ◾◾◾
      ◾◾◾
      ◾◾◾
    `);
  });

  it("says the level for whoever cannot see the square", () => {
    const { container } = render(<Marker level="advanced" />);

    expect(container.textContent).toBe("advanced");
  });
});
