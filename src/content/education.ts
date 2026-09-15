import type { z } from "zod";
import data from "./education.yaml";
import type { educationSchema } from "./schema";

export type Education = z.infer<typeof educationSchema>;

export const education = data as Education[];
