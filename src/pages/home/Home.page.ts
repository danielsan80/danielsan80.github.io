import { screen, within } from "@testing-library/react";

const hrefs = (links: HTMLElement[]) =>
  links.map((link) => link.getAttribute("href"));

class Intro {
  private get banner() {
    return screen.getByRole("banner");
  }

  portrait() {
    return within(this.banner).getByRole("img").getAttribute("src");
  }

  name() {
    return within(this.banner).getByRole("heading", { level: 1 }).textContent;
  }

  headline() {
    return within(this.banner)
      .getAllByTestId("headline-line")
      .map((line) => line.textContent);
  }

  summary() {
    return within(this.banner).getByTestId("summary").textContent;
  }
}

class ProjectsSection {
  constructor(private readonly region: HTMLElement) {}

  projects() {
    return within(this.region)
      .getAllByRole("article")
      .map((project) => ({
        name: within(project).getByRole("heading", { level: 3 }).textContent,
        photo: within(project).getByRole("img").getAttribute("src"),
        summary: within(project).getByRole("paragraph").textContent,
      }));
  }

  links() {
    return hrefs(within(this.region).getAllByRole("link"));
  }

  linkHref(name: string) {
    return within(this.region).getByRole("link", { name }).getAttribute("href");
  }
}

class Footer {
  private get footer() {
    return screen.getByRole("contentinfo");
  }

  links() {
    return hrefs(within(this.footer).getAllByRole("link"));
  }

  entries() {
    return within(this.footer)
      .getAllByRole("listitem")
      .map((entry) => entry.textContent);
  }
}

export class HomePage {
  readonly intro = new Intro();

  readonly footer = new Footer();

  projectsSection(name: string) {
    return new ProjectsSection(screen.getByRole("region", { name }));
  }

  links() {
    return hrefs(screen.getAllByRole("link"));
  }
}
