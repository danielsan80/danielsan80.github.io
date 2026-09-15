import type { z } from "zod";
import featured from "./featured-projects.json";
import type { projectSchema } from "./schema";

export type Project = z.infer<typeof projectSchema>;

// The projects the home page leads with. When the CV and the repo hub become
// one collection this turns into a `featured` flag over it; until that
// collection exists, the list is the flag.
export const featuredProjects: Project[] = featured;
