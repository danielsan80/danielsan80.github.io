import { describe, expect, it } from "vitest";
import { dateBounds, periodBounds } from "./period";

// Half-open intervals: `to` is the first instant outside the period, which
// makes durations a subtraction instead of a special case.
const utc = (year: number, month: number, day: number) =>
  Date.UTC(year, month - 1, day);

const messageOf = (run: () => unknown) => {
  try {
    run();
    return "no error";
  } catch (error) {
    return (error as Error).message;
  }
};

describe("dateBounds", () => {
  it("spans the whole year when only the year is given", () => {
    expect(dateBounds("2009")).toEqual({
      from: utc(2009, 1, 1),
      to: utc(2010, 1, 1),
    });
  });

  it("spans the whole month when the day is left out", () => {
    expect(dateBounds("2025-08")).toEqual({
      from: utc(2025, 8, 1),
      to: utc(2025, 9, 1),
    });
  });

  it("rolls over to the next year on December", () => {
    expect(dateBounds("2011-12")).toEqual({
      from: utc(2011, 12, 1),
      to: utc(2012, 1, 1),
    });
  });

  it("spans a single day when the day is given", () => {
    expect(dateBounds("2016-06-21")).toEqual({
      from: utc(2016, 6, 21),
      to: utc(2016, 6, 22),
    });
  });

  it("rejects anything that is not a real date", () => {
    const malformed = [
      "",
      "17-02",
      "2017-13",
      "2017-00",
      "2017-02-30",
      "2017-2-9",
      "2017-02-09T10:00",
      "duemilanove",
      "0050",
    ];

    expect(
      malformed.map((value) => messageOf(() => dateBounds(value))),
    ).toEqual(
      malformed.map((value) => `Invalid date: ${JSON.stringify(value)}`),
    );
  });
});

describe("periodBounds", () => {
  const today = utc(2026, 8, 26);

  it("runs from the start of the first date to the end of the last", () => {
    expect(periodBounds({ start: "2020-02", end: "2025-06" }, today)).toEqual({
      from: utc(2020, 2, 1),
      to: utc(2025, 7, 1),
    });
  });

  it("runs up to today when the end is missing, for a role still going", () => {
    expect(periodBounds({ start: "2025-08" }, today)).toEqual({
      from: utc(2025, 8, 1),
      to: today,
    });
  });

  it("runs up to today when the end is missing on a bare year", () => {
    expect(periodBounds({ start: "2009" }, today)).toEqual({
      from: utc(2009, 1, 1),
      to: today,
    });
  });

  it("is one day wide when start and end are the same day", () => {
    expect(
      periodBounds({ start: "2016-06-21", end: "2016-06-21" }, today),
    ).toEqual({ from: utc(2016, 6, 21), to: utc(2016, 6, 22) });
  });

  it("covers both days of a two-day course", () => {
    expect(
      periodBounds({ start: "2017-02-09", end: "2017-02-10" }, today),
    ).toEqual({ from: utc(2017, 2, 9), to: utc(2017, 2, 11) });
  });

  it("rejects a period that ends before it starts", () => {
    expect(
      messageOf(() =>
        periodBounds({ start: "2020-02", end: "2019-06" }, today),
      ),
    ).toBe('Period ends before it starts: "2020-02" to "2019-06"');
  });
});
