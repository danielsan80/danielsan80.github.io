import yaml from "@rollup/plugin-yaml";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), yaml()],
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        projects: "projects.html",
        cv: "cv.html",
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
