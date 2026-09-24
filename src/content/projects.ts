import type { z } from "zod";
import featured from "./featured-projects.yaml";
import type { projectSchema } from "./schema";

export type Project = z.infer<typeof projectSchema>;

export const featuredProjects = featured as Project[];

type Highlighted = Project & Required<Pick<Project, "highlight">>;

export const highlightedProjects = featuredProjects.filter(
  (project): project is Highlighted => project.highlight !== undefined,
);

const ongoing = (project: Project) => project.period.end === undefined;

// sort is stable, so among equals the file order, by importance, holds.
export const listedProjects = [...featuredProjects].sort(
  (first, second) => Number(ongoing(second)) - Number(ongoing(first)),
);
