import { dateBounds, type Period } from "../../content/period";

const DAY = 24 * 60 * 60 * 1000;

// Closed interval: `to` is the first instant of the last day, so an entry that
// lasts one day is a point. The spreadsheet the timeline was designed in
// ("Timeline - calcolo" on Drive) measures the same way.
export type Domain = {
  from: number;
  to: number;
};

// Where a period sits inside the domain, as percentages of its width. `right`
// is `left + width`: kept because a placement reads as an interval, the way the
// spreadsheet tabulates it.
export type Placement = {
  left: number;
  right: number;
  width: number;
};

export function domainOf(periods: Period[], today: number): Domain {
  if (periods.length === 0) {
    throw new Error("No periods to build a domain from");
  }

  const earliest = Math.min(
    ...periods.map((period) => dateBounds(period.start).from),
  );

  return {
    from: Date.UTC(new Date(earliest).getUTCFullYear(), 0, 1),
    to: Date.UTC(new Date(today).getUTCFullYear(), 11, 31),
  };
}

export function place(period: Period, domain: Domain): Placement {
  const width = domain.to - domain.from;
  if (width <= 0) {
    throw new Error("A domain with no duration cannot place anything");
  }

  const clamped = (instant: number) =>
    Math.min(Math.max(instant, domain.from), domain.to);
  const percent = (instant: number) =>
    ((clamped(instant) - domain.from) / width) * 100;

  // A period still open runs to the right edge instead of to today: the whole
  // timeline then moves once a year, not once a day.
  const end =
    period.end === undefined ? domain.to : dateBounds(period.end).to - DAY;
  const left = percent(dateBounds(period.start).from);
  const right = percent(end);

  return { left, right, width: right - left };
}
