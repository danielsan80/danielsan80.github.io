import type { z } from "zod";
import data from "@private/content/profiles.yaml";
import type { profileSchema } from "./schema";

export type Profile = z.infer<typeof profileSchema>;

export const profiles = data as Profile[];
