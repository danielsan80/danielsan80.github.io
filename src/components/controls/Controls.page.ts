import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

type LanguageName = "Italiano" | "English";

type ThemeName = "Auto" | "Light" | "Dark";

export class ControlsPage {
  currentLanguage() {
    return screen.getByRole("link", { current: "page" }).textContent;
  }

  currentTheme() {
    return screen.getByRole("radio", { checked: true }).getAttribute("value");
  }

  themes() {
    return within(screen.getByRole("radiogroup", { name: "Theme" }))
      .getAllByRole("radio")
      .map((radio) => ({
        value: radio.getAttribute("value"),
        group: radio.getAttribute("name"),
      }));
  }

  languages() {
    return screen
      .getAllByRole("link", { name: /^(Italiano|English)$/ })
      .map((link) => ({
        code: link.textContent,
        href: link.getAttribute("href"),
      }));
  }

  async clickLanguage(name: LanguageName) {
    await userEvent.click(screen.getByRole("link", { name }));
  }

  async clickTheme(name: ThemeName) {
    await userEvent.click(screen.getByRole("radio", { name }));
  }

  async pressArrowRight() {
    await userEvent.keyboard("{ArrowRight}");
  }
}
