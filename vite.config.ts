import yaml from "@rollup/plugin-yaml";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { withoutNotes } from "./tools/without-notes";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    yaml(mode === "with-notes" ? {} : { transform: withoutNotes }),
  ],
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        projects: "projects.html",
        cv: "cv.html",
        styleguide: "styleguide.html",
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
}));
