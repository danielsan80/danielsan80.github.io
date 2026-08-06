import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/base.css";
import { HomePage } from "./HomePage";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root element in index.html");
}

createRoot(root).render(
  <StrictMode>
    <HomePage />
  </StrictMode>,
);
