import { screen, within } from "@testing-library/react";

class ProjectsSection {
  constructor(private readonly region: HTMLElement) {}

  projects() {
    return within(this.region)
      .getAllByRole("article")
      .map((project) => ({
        name: within(project).getByRole("heading", { level: 2 }).textContent,
        meta: within(project).getByTestId("meta").textContent,
        summary: within(project).getByTestId("summary").textContent,
      }));
  }

  links() {
    return within(this.region)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
  }
}

class TopicsSection {
  constructor(private readonly region: HTMLElement) {}

  topics() {
    return within(this.region)
      .getAllByRole("link")
      .map((link) => ({
        label: link.textContent,
        href: link.getAttribute("href"),
      }));
  }

  entries() {
    return within(this.region)
      .getAllByRole("listitem")
      .map((entry) => entry.textContent);
  }
}

export class ProjectsPage {
  title() {
    return screen.getByRole("heading", { level: 1 }).textContent;
  }

  linkHref(name: string) {
    return screen.getByRole("link", { name }).getAttribute("href");
  }

  projectsSection(name: string) {
    return new ProjectsSection(screen.getByRole("region", { name }));
  }

  topicsSection(name: string) {
    return new TopicsSection(screen.getByRole("region", { name }));
  }
}
