import type { Lang } from "../../content/localized";
import { pagePath, type Page } from "../../site/paths";
import styles from "./Controls.module.css";
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

export function Controls({ page, lang }: { page: Page; lang: Lang }) {
  const [theme, chooseTheme] = useTheme();

  return (
    <div className={styles.controls}>
      <div className={styles.group}>
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

      <div className={styles.group}>
        {THEMES.map(([code, name]) => (
          <button
            key={code}
            type="button"
            className={styles.button}
            data-theme-choice={code}
            aria-pressed={code === theme}
            onClick={() => chooseTheme(code)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
