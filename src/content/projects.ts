import type { z } from "zod";
import featured from "./featured-projects.yaml";
import type { projectSchema } from "./schema";

export type Project = z.infer<typeof projectSchema>;

export const featuredProjects = featured as Project[];

type Highlighted = Project & Required<Pick<Project, "highlight">>;

export const highlightedProjects = featuredProjects.filter(
  (project): project is Highlighted => project.highlight !== undefined,
);
