import data from "./experiences.json";
import type { Localized, Translatable } from "./localized";
import type { Period } from "./period";

// One entity for employment, freelance and everything in between: the CV never
// made that distinction, and the entries read the same way regardless.
//
// Two texts for two destinations: `bullets` is what the CV prints,
// `description` the prose LinkedIn wants. They say the same thing in different
// registers, so neither is derived from the other.
export type Experience = {
  role: Localized<string>;
  company: string;
  location: Translatable<string>;
  remote: boolean;
  period: Period;
  bullets: Localized<string[]>;
  description?: Localized<string>;
};

// File order is display order. The entries are not sorted by any single date:
// the overlapping freelance years make every sort key a lie somewhere.
export const experiences: Experience[] = data;
