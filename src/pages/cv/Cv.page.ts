import { screen, within } from "@testing-library/react";

const linksIn = (container: HTMLElement) =>
  within(container)
    .getAllByRole("link")
    .map((link) => ({
      text: link.textContent,
      href: link.getAttribute("href"),
    }));

class ProjectsList {
  private get list() {
    return screen.getByRole("list", { name: "Projects" });
  }

  entries() {
    return within(this.list)
      .getAllByRole("listitem")
      .map((entry) => entry.textContent);
  }

  links() {
    return linksIn(this.list);
  }
}

class Experience {
  constructor(private readonly entry: HTMLElement) {}

  role() {
    return within(this.entry).getByRole("heading", { level: 3 }).textContent;
  }

  where() {
    return within(this.entry).getByTestId("where").textContent;
  }

  period() {
    return within(this.entry).getByTestId("period").textContent;
  }

  timeline() {
    return within(this.entry).getByRole("img").getAttribute("aria-label");
  }

  bullets() {
    return within(this.entry)
      .getAllByRole("listitem")
      .map((bullet) => bullet.textContent);
  }
}

export class CvPage {
  readonly projects = new ProjectsList();

  sectionTitles() {
    return screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent);
  }

  contacts() {
    return linksIn(screen.getByRole("banner"));
  }

  experience(company: string) {
    return new Experience(screen.getByRole("article", { name: company }));
  }

  timelineCount() {
    return screen.getAllByRole("img").length;
  }
}
