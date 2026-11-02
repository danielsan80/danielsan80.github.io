import type { Lang } from "../../content/localized";
import { pagePath, type Page } from "../../site/paths";
import styles from "./Controls.module.css";
import { CONTROL_HEIGHT } from "./height";
import { rememberLang, useTheme, type ThemeChoice } from "./preferences";

const LANGUAGES: [Lang, string][] = [
  ["it", "Italiano"],
  ["en", "English"],
];

const THEMES: [ThemeChoice, string][] = [
  ["auto", "Auto"],
  ["light", "Light"],
  ["dark", "Dark"],
];

type ControlsProps = {
  page: Page;
  lang: Lang;
};

export function Controls({ page, lang }: ControlsProps) {
  const [theme, chooseTheme] = useTheme();

  return (
    <div className={styles.controls}>
      <div className={styles.group} style={{ height: CONTROL_HEIGHT }}>
        {LANGUAGES.map(([code, name]) => (
          <a
            key={code}
            className={styles.button}
            href={pagePath(page, code)}
            hrefLang={code}
            aria-label={name}
            aria-current={code === lang ? "page" : undefined}
            onClick={() => rememberLang(code)}
          >
            {code.toUpperCase()}
          </a>
        ))}
      </div>

      <div
        className={styles.group}
        style={{ height: CONTROL_HEIGHT }}
        role="radiogroup"
        aria-label="Theme"
      >
        {THEMES.map(([code, name]) => (
          <label key={code} className={styles.button} data-theme-choice={code}>
            <input
              className={styles.radio}
              type="radio"
              name="theme"
              value={code}
              checked={code === theme}
              onChange={() => chooseTheme(code)}
            />
            {name}
          </label>
        ))}
      </div>
    </div>
  );
}
