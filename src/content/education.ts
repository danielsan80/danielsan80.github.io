import data from "./education.json";
import type { Localized, Translatable } from "./localized";
import type { Period } from "./period";

export type Education = {
  institution: Translatable<string>;
  location: Translatable<string>;
  title: Localized<string>;
  period: Period;
};

export const education: Education[] = data;
