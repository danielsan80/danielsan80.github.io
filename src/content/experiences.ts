import type { z } from "zod";
import data from "@private/content/experiences.yaml";
import type { experienceSchema } from "./schema";

export type Experience = z.infer<typeof experienceSchema>;

export const experiences = data as Experience[];
