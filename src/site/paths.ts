import type { Lang } from "../content/localized";

export type Page = "home" | "projects" | "cv";

const PATHS: Record<Page, string> = {
  home: "/",
  projects: "/projects",
  cv: "/cv",
};

export function pagePath(page: Page, lang: Lang): string {
  return lang === "it" ? PATHS[page] : `/${lang}${PATHS[page]}`;
}
