import type { z } from "zod";
import data from "./identity.yaml";
import type { identitySchema } from "./schema";

// Who the site is about. The home page and the CV header read the same record,
// so the name is written once.
export type Identity = z.infer<typeof identitySchema>;

export const identity = data as Identity;
