import { describe, expect, it } from "vitest";
import { domainOf, place, type Placement } from "./placement";

// The numbers below come from the spreadsheet the CV timeline was designed in:
// "Timeline - calcolo" on Drive, whose domain runs 01/01/1994 to 31/12/2026.
const TODAY = Date.UTC(2026, 8, 16);
const DOMAIN = { from: Date.UTC(1994, 0, 1), to: Date.UTC(2026, 11, 31) };

const rounded = ({ left, right, width }: Placement) => ({
  left: Number(left.toFixed(2)),
  right: Number(right.toFixed(2)),
  width: Number(width.toFixed(2)),
});

const messageOf = (run: () => unknown) => {
  try {
    run();
    return "no error";
  } catch (error) {
    return (error as Error).message;
  }
};

describe("domainOf", () => {
  it("opens on the January of the earliest year and closes on this December", () => {
    expect(
      domainOf(
        [
          { start: "2015-03", end: "2025-02" },
          { start: "1994-09", end: "1999-07" },
          { start: "2026-08" },
        ],
        TODAY,
      ),
    ).toEqual(DOMAIN);
  });

  it("refuses an empty list: there is no interval to place anything in", () => {
    expect(messageOf(() => domainOf([], TODAY))).toBe(
      "No periods to build a domain from",
    );
  });
});

describe("place", () => {
  it("places the entries where the spreadsheet places them", () => {
    const entries = [
      { start: "2020-02", end: "2025-06" },
      { start: "2015-03", end: "2025-02" },
      { start: "2009", end: "2011" },
      { start: "1994-09", end: "1999-07" },
    ];

    expect(entries.map((period) => rounded(place(period, DOMAIN)))).toEqual([
      { left: 79.05, right: 95.44, width: 16.4 },
      { left: 64.13, right: 94.43, width: 30.3 },
      { left: 45.46, right: 54.54, width: 9.08 },
      { left: 2.02, right: 16.9, width: 14.89 },
    ]);
  });

  it("runs a period still open up to the right edge, so it moves once a year", () => {
    expect(rounded(place({ start: "2026-08" }, DOMAIN))).toEqual({
      left: 98.74,
      right: 100,
      width: 1.26,
    });
  });

  it("gives a single day no width: it is a point, not a bar", () => {
    expect(
      rounded(place({ start: "2016-06-21", end: "2016-06-21" }, DOMAIN)),
    ).toEqual({ left: 68.1, right: 68.1, width: 0 });
  });

  it("gives a two-day course the width of the day between its ends", () => {
    expect(
      rounded(place({ start: "2017-02-09", end: "2017-02-10" }, DOMAIN)),
    ).toEqual({ left: 70.03, right: 70.04, width: 0.01 });
  });

  it("clips a period that ends after the right edge", () => {
    expect(
      rounded(place({ start: "2026-08", end: "2027-06" }, DOMAIN)),
    ).toEqual({ left: 98.74, right: 100, width: 1.26 });
  });

  it("refuses a domain with no duration: every position would divide by zero", () => {
    const instant = { from: DOMAIN.to, to: DOMAIN.to };

    expect(messageOf(() => place({ start: "2016-06-21" }, instant))).toBe(
      "A domain with no duration cannot place anything",
    );
  });
});
