import data from "./experiences.json";
import type { Period } from "./period";

// One entity for employment, freelance and everything in between: the CV never
// made that distinction, and the entries read the same way regardless.
export type Experience = {
  role: string;
  company: string;
  location: string;
  remote: boolean;
  period: Period;
  bullets: string[];
};

// File order is display order. The entries are not sorted by any single date:
// the overlapping freelance years make every sort key a lie somewhere.
export const experiences: Experience[] = data;
