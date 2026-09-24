import type { Lang } from "../../content/localized";
import styles from "./Controls.module.css";
import { useLang, useTheme, type ThemeChoice } from "./preferences";

const LANGUAGES: [Lang, string][] = [
  ["it", "Italiano"],
  ["en", "English"],
];

const THEMES: [ThemeChoice, string][] = [
  ["auto", "Auto"],
  ["light", "Light"],
  ["dark", "Dark"],
];

export function Controls() {
  const [lang, chooseLang] = useLang();
  const [theme, chooseTheme] = useTheme();

  return (
    <div className={styles.controls}>
      <div className={styles.group}>
        {LANGUAGES.map(([code, name]) => (
          <button
            key={code}
            type="button"
            className={styles.button}
            aria-label={name}
            aria-pressed={code === lang}
            onClick={() => chooseLang(code)}
          >
            {code.toUpperCase()}
          </button>
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
