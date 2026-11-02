import type { Lang } from "../content/localized";

const PAGE_MAP = {
  home: { path: "/", number: 1 },
  projects: { path: "/projects", number: 2 },
  cv: { path: "/cv", number: undefined },
} as const;

export type Page = keyof typeof PAGE_MAP;

export function pagePath(page: Page, lang: Lang): string {
  const path = PAGE_MAP[page].path;
  return lang === "it" ? path : `/${lang}${path}`;
}

export function pageNumber<P extends Page>(
  page: P,
): (typeof PAGE_MAP)[P]["number"] {
  return PAGE_MAP[page].number;
}
