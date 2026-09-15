import type { z } from "zod";
import type { trainingSchema } from "./schema";
import data from "./training.yaml";

// Courses and conferences: separate from `education` because the shape differs
// — no institution, no title earned, and periods that are points or open ranges.
export type Training = z.infer<typeof trainingSchema>;

export const training = data as Training[];
