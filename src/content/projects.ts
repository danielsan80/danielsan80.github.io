import type { z } from "zod";
import featured from "./featured-projects.yaml";
import type { projectSchema } from "./schema";

export type Project = z.infer<typeof projectSchema>;

export const featuredProjects = featured as Project[];
