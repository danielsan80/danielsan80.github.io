import { identity } from "../../content/identity";
import type { Lang } from "../../content/localized";
import { pagePath, type Page } from "../../site/paths";
import { Controls } from "../controls/Controls";
import { CONTROL_HEIGHT } from "../controls/height";
import { Breadcrumbs } from "./Breadcrumbs";
import { PixelLogo } from "./PixelLogo";
import styles from "./TopBar.module.css";

type TopBarProps = {
  page: Page;
  lang: Lang;
};

export function TopBar({ page, lang }: TopBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.start}>
          <a
            className={styles.logo}
            href={pagePath("home", lang)}
            aria-label={identity.name}
          >
            <PixelLogo size={CONTROL_HEIGHT} />
          </a>
          <Breadcrumbs page={page} lang={lang} />
        </div>

        <Controls page={page} lang={lang} />
      </div>
    </div>
  );
}
