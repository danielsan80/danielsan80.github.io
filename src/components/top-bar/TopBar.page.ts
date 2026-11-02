import { PixelGridPage } from "../pixel-grid/PixelGrid.page";
import { screen, within } from "@testing-library/react";

export class TopBarPage {
  private path() {
    return screen.getByRole("navigation", { name: /^(Percorso|Path)$/ });
  }

  pathText() {
    return this.path().textContent;
  }

  pathLinks() {
    return within(this.path())
      .queryAllByRole("link")
      .map((link) => ({
        label: link.textContent,
        href: link.getAttribute("href"),
      }));
  }

  private logo() {
    return screen.getByRole("link", { name: "Mario Rossi" });
  }

  logoHref() {
    return this.logo().getAttribute("href");
  }

  logoDrawing() {
    return new PixelGridPage(this.logo()).drawing();
  }

  currentSegment() {
    return this.path().querySelector('[aria-current="page"]')?.textContent;
  }
}
