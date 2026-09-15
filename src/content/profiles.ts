import type { z } from "zod";
import data from "./profiles.yaml";
import type { profileSchema } from "./schema";

export type Profile = z.infer<typeof profileSchema>;

// One collection, three readers: the home footer, the repo hub and the CV
// header. The handle travels with the URL because the point is to show that
// danielsan80 and dansan are the same person as Danilo Sanchi.
export const profiles = data as Profile[];
