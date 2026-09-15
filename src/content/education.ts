import type { z } from "zod";
import data from "./education.json";
import type { educationSchema } from "./schema";

export type Education = z.infer<typeof educationSchema>;

export const education: Education[] = data;
