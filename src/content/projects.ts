import type { z } from "zod";
import data from "./projects.yaml";
import type { projectSchema } from "./schema";

export type Project = z.infer<typeof projectSchema>;

export const projects = data as Project[];

type Highlighted = Project & Required<Pick<Project, "highlight">>;

export const highlightedProjects = projects.filter(
  (project): project is Highlighted => project.highlight !== undefined,
);
