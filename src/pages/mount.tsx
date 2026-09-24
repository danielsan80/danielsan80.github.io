import { StrictMode, type ReactNode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "../styles/base.css";

export function mount(page: ReactNode) {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Missing #root element in index.html");
  }

  const app = <StrictMode>{page}</StrictMode>;

  // The built page arrives pre-rendered, so it is hydrated; in dev the root is
  // empty and there is nothing to hydrate.
  if (root.hasChildNodes()) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
}
