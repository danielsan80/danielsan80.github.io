import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Die, type DieValue } from "./Die";
import { grid, PixelGridPage } from "./PixelGrid.page";

const face = (value: DieValue) =>
  new PixelGridPage(
    render(<Die value={value} size="1em" />).container,
  ).drawing();

const FACES = {
  1: grid`
    ◻◻◻
    ◻◾◻
    ◻◻◻
  `,
  2: grid`
    ◻◻◾
    ◻◻◻
    ◾◻◻
  `,
  3: grid`
    ◻◻◾
    ◻◾◻
    ◾◻◻
  `,
  4: grid`
    ◾◻◾
    ◻◻◻
    ◾◻◾
  `,
  5: grid`
    ◾◻◾
    ◻◾◻
    ◾◻◾
  `,
  6: grid`
    ◾◻◾
    ◾◻◾
    ◾◻◾
  `,
};

describe("Die", () => {
  it.each(Object.entries(FACES))(
    "shows %s as the face of a die",
    (value, drawing) => {
      expect(face(Number(value) as DieValue)).toEqual(drawing);
    },
  );
});
