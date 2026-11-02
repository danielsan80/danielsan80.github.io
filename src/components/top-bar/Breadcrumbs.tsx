import { Fragment } from "react";
import { pick, type Lang } from "../../content/localized";
import { pagePath, type Page } from "../../site/paths";
import styles from "./Breadcrumbs.module.css";

const PATH = { it: "Percorso", en: "Path" };

function segmentsTo(page: Page): { page: Page; label: string }[] {
  const home = { page: "home" as const, label: "~" };
  return page === "home" ? [home] : [home, { page, label: page }];
}

type BreadcrumbsProps = {
  page: Page;
  lang: Lang;
};

export function Breadcrumbs({ page, lang }: BreadcrumbsProps) {
  return (
    <nav className={styles.path} aria-label={pick(PATH, lang)}>
      {segmentsTo(page).map((segment, index) => (
        <Fragment key={segment.page}>
          {index > 0 && <span className={styles.muted}>/</span>}
          {segment.page === page ? (
            <span aria-current="page">{segment.label}</span>
          ) : (
            <a href={pagePath(segment.page, lang)}>{segment.label}</a>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
