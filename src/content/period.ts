import type { z } from "zod";
import type { periodSchema } from "./schema";

// As precise as it needs to be: "2009", "2025-08", "2016-06-21".
export type PartialDate = string;

// An absent `end` means the period is still open: a role in progress, or the
// conferences attended "since 2009".
export type Period = z.infer<typeof periodSchema>;

// Half-open: `to` is the first instant outside the period.
export type Bounds = {
  from: number;
  to: number;
};

const DATE = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;

export function dateBounds(date: PartialDate): Bounds {
  const bounds = boundsOf(date);
  if (!bounds) {
    throw new Error(`Invalid date: ${JSON.stringify(date)}`);
  }
  return bounds;
}

function boundsOf(date: PartialDate): Bounds | null {
  const parts = DATE.exec(date);
  if (!parts) {
    return null;
  }

  const year = Number(parts[1]);
  // JavaScript maps the years 0 to 99 onto 1900 to 1999, so "0050" would
  // quietly become 1950 instead of being refused.
  if (year < 100) {
    return null;
  }

  if (parts[2] === undefined) {
    return { from: Date.UTC(year, 0, 1), to: Date.UTC(year + 1, 0, 1) };
  }

  const month = Number(parts[2]);
  if (month < 1 || month > 12) {
    return null;
  }

  if (parts[3] === undefined) {
    // A 13th month rolls into January of the next year, which is exactly where
    // December ends: the rollover is the answer, not a bug.
    return { from: Date.UTC(year, month - 1, 1), to: Date.UTC(year, month, 1) };
  }

  const day = Number(parts[3]);
  const from = Date.UTC(year, month - 1, day);
  // 30 February rolls into March instead of being refused, so the day counts
  // only if it survives the round trip.
  if (new Date(from).getUTCDate() !== day) {
    return null;
  }

  return { from, to: Date.UTC(year, month - 1, day + 1) };
}

export function periodBounds(period: Period, today: number): Bounds {
  const { from } = dateBounds(period.start);
  const to = period.end === undefined ? today : dateBounds(period.end).to;

  if (to < from) {
    throw new Error(
      `Period ends before it starts: ${JSON.stringify(period.start)} to ${JSON.stringify(period.end)}`,
    );
  }

  return { from, to };
}
