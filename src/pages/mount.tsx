import { StrictMode, type ComponentType } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import type { Lang } from "../content/localized";
import "../styles/base.css";

export function mount(Page: ComponentType<{ lang: Lang }>) {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Missing #root element in index.html");
  }

  // The template of each page declares the language it is served in.
  const lang = document.documentElement.lang === "en" ? "en" : "it";
  const app = (
    <StrictMode>
      <Page lang={lang} />
    </StrictMode>
  );

  // The built page arrives pre-rendered, so it is hydrated; in dev the root is
  // empty and there is nothing to hydrate.
  if (root.hasChildNodes()) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
}
