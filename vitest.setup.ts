import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only auto-registers this when Vitest globals are on, and they
// are not: without it each render stacks onto the previous test's DOM.
afterEach(cleanup);

// jsdom has no matchMedia, and the theme preference asks the system what it
// prefers. Nothing stored and no dark system: the light theme.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
