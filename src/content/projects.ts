import featured from "./featured-projects.json";

export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  name: string;
  summary: string;
  links: ProjectLink[];
};

// The projects the home page leads with. When the CV and the repo hub become
// one collection this turns into a `featured` flag over it; until that
// collection exists, the list is the flag.
export const featuredProjects: Project[] = featured;
