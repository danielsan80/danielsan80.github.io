import type { z } from "zod";
import type { trainingSchema } from "./schema";
import data from "./training.yaml";

export type Training = z.infer<typeof trainingSchema>;

export const training = data as Training[];
