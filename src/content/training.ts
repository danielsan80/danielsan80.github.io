import data from "./training.json";
import type { Localized, Translatable } from "./localized";
import type { Period } from "./period";

// Courses and conferences: separate from `education` because the shape differs
// — no institution, no title earned, and periods that are points or open ranges.
export type Training = {
  title: Translatable<string>;
  period: Period;
  note: Localized<string>;
};

export const training: Training[] = data;
