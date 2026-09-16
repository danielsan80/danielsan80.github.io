import { describe, expect, it } from "vitest";
import { dateLabel, periodLabel } from "./labels";
import type { Period } from "./period";

// The expected strings come from the CV as it reads today, in doc/ohmycv.
const bothLanguages = (period: Period) => [
  periodLabel(period, "it"),
  periodLabel(period, "en"),
];

describe("dateLabel", () => {
  it("says as much as the date knows, in the language asked", () => {
    const dates = ["2009", "2025-08", "2016-06-21"];

    expect(
      dates.map((date) => [dateLabel(date, "it"), dateLabel(date, "en")]),
    ).toEqual([
      ["2009", "2009"],
      ["Ago 2025", "Aug 2025"],
      ["21 Giu 2016", "21 Jun 2016"],
    ]);
  });

  it("abbreviates every month the way the CV does", () => {
    const months = Array.from(
      { length: 12 },
      (_, index) => `2020-${String(index + 1).padStart(2, "0")}`,
    );

    expect(months.map((month) => dateLabel(month, "it")).join(", ")).toBe(
      "Gen 2020, Feb 2020, Mar 2020, Apr 2020, Mag 2020, Giu 2020, Lug 2020, Ago 2020, Set 2020, Ott 2020, Nov 2020, Dic 2020",
    );
    expect(months.map((month) => dateLabel(month, "en")).join(", ")).toBe(
      "Jan 2020, Feb 2020, Mar 2020, Apr 2020, May 2020, Jun 2020, Jul 2020, Aug 2020, Sep 2020, Oct 2020, Nov 2020, Dec 2020",
    );
  });
});

describe("periodLabel", () => {
  it("joins the two ends of a range", () => {
    expect(bothLanguages({ start: "2026-04", end: "2026-07" })).toEqual([
      "Apr 2026 - Lug 2026",
      "Apr 2026 - Jul 2026",
    ]);
  });

  it("runs a role still going up to today", () => {
    expect(bothLanguages({ start: "2026-08" })).toEqual([
      "Ago 2026 - oggi",
      "Aug 2026 - present", // @note non "today"?
    ]);
  });

  it("reads an open range from a year as a beginning, not as a range", () => {
    expect(bothLanguages({ start: "2009" })).toEqual([
      "Dal 2009",
      "Since 2009",
    ]);
  });

  it("says a single day once", () => {
    expect(bothLanguages({ start: "2016-06-21", end: "2016-06-21" })).toEqual([
      "21 Giu 2016",
      "21 Jun 2016",
    ]);
  });

  it("says a single month once", () => {
    expect(bothLanguages({ start: "2012-08", end: "2012-08" })).toEqual([
      "Ago 2012",
      "Aug 2012",
    ]);
  });

  it("writes two days of the same month as one label", () => {
    expect(bothLanguages({ start: "2017-02-09", end: "2017-02-10" })).toEqual([
      "9-10 Feb 2017",
      "9-10 Feb 2017",
    ]);
  });

  it("keeps both dates whole when the days fall in different months", () => {
    expect(bothLanguages({ start: "2017-02-28", end: "2017-03-01" })).toEqual([
      "28 Feb 2017 - 1 Mar 2017",
      "28 Feb 2017 - 1 Mar 2017",
    ]);
  });
});
