import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "../../styles/base.css";
import { HomePage } from "./HomePage";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root element in index.html");
}

const page = (
  <StrictMode>
    <HomePage />
  </StrictMode>
);

// The built page arrives pre-rendered, so it is hydrated; in dev the root is
// empty and there is nothing to hydrate.
if (root.hasChildNodes()) {
  hydrateRoot(root, page);
} else {
  createRoot(root).render(page);
}
