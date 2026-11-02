import { screen, within } from "@testing-library/react";

export class FooterPage {
  private get footer() {
    return screen.getByRole("contentinfo");
  }

  title() {
    return within(this.footer).getByRole("heading").textContent;
  }

  links() {
    return within(this.footer)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
  }

  entries() {
    return within(this.footer)
      .getAllByRole("listitem")
      .map((entry) => entry.textContent);
  }
}
