import data from "./education.json";
import type { Period } from "./period";

export type Education = {
  institution: string;
  location: string;
  title: string;
  period: Period;
};

export const education: Education[] = data;
