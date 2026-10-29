import type { z } from "zod";
import data from "@private/content/identity.yaml";
import type { identitySchema } from "./schema";

export type Identity = z.infer<typeof identitySchema>;

export const identity = data as Identity;
