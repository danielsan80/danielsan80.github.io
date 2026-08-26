import data from "./training.json";
import type { Period } from "./period";

// Courses and conferences: separate from `education` because the shape differs
// — no institution, no title earned, and periods that are points or open ranges.
export type Training = {
  title: string;
  period: Period;
  note: string;
};

export const training: Training[] = data;
