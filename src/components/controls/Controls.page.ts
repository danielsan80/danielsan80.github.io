import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

type LanguageName = "Italiano" | "English";

type ThemeName = "Auto" | "Light" | "Dark";

export class ControlsPage {
  currentLanguage() {
    return screen.getByRole("link", { current: "page" }).textContent;
  }

  pressedThemes() {
    return screen
      .getAllByRole("button", { pressed: true })
      .map((button) => button.textContent);
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
    await userEvent.click(screen.getByRole("button", { name }));
  }
}
