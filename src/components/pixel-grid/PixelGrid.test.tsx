import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PixelGrid } from "./PixelGrid";
import { grid, PixelGridPage } from "./PixelGrid.page";

describe("PixelGrid", () => {
  it("lights the cells given, counted row by row from the top left", () => {
    const { container } = render(<PixelGrid lit={[0, 4, 8]} size="1em" />);

    expect(new PixelGridPage(container).drawing()).toEqual(grid`
      ◾◻◻
      ◻◾◻
      ◻◻◾
    `);
  });

  it("takes the size it is given, as a square", () => {
    const { container } = render(<PixelGrid lit={[]} size="0.75em" />);

    expect(new PixelGridPage(container).size()).toEqual({
      width: "0.75em",
      height: "0.75em",
    });
  });
});
