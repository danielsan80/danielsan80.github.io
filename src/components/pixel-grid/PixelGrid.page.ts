import { CELLS_PER_SIDE, STEP } from "./geometry";

const ON = "◾";
const OFF = "◻";

export function grid(strings: TemplateStringsArray): string[] {
  return strings[0]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

export class PixelGridPage {
  constructor(private readonly scope: Element) {}

  private svg() {
    const svg = this.scope.querySelector("svg");
    if (!svg) throw new Error("No pixel grid here");
    return svg;
  }

  drawing() {
    const rows = Array.from({ length: CELLS_PER_SIDE }, () =>
      Array<string>(CELLS_PER_SIDE).fill(""),
    );
    this.svg()
      .querySelectorAll("rect")
      .forEach((cell) => {
        const column = Number(cell.getAttribute("x")) / STEP;
        const row = Number(cell.getAttribute("y")) / STEP;
        rows[row][column] = cell.getAttribute("data-lit") === "true" ? ON : OFF;
      });
    return rows.map((row) => row.join(""));
  }

  size() {
    return {
      width: this.svg().getAttribute("width"),
      height: this.svg().getAttribute("height"),
    };
  }
}
