import { useSyncExternalStore } from "react";
import type { Lang } from "../../content/localized";

export type Theme = "light" | "dark";

// A browser in private mode, or one told to block site data, throws on the
// first read: a preference that cannot be stored is not worth a crash.
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The page works, it just forgets.
  }
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  const system = matchMedia("(prefers-color-scheme: dark)");
  listeners.add(listener);
  // Another tab changing the same preference counts as a change here, and so
  // does the system switching theme while nothing is stored.
  window.addEventListener("storage", listener);
  system.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
    system.removeEventListener("change", listener);
  };
}

const announce = () => listeners.forEach((listener) => listener());

// The pre-rendered file is written in Italian and carries no theme, so that is
// what the server snapshot has to say. The stored choice arrives on the first
// client read, and React swaps it in after hydration.
export function useLang(): [Lang, (lang: Lang) => void] {
  const lang = useSyncExternalStore(
    subscribe,
    () => {
      const stored = read("lang");
      return stored === "it" || stored === "en" ? stored : "it";
    },
    () => "it" as Lang,
  );

  return [
    lang,
    (chosen: Lang) => {
      write("lang", chosen);
      announce();
    },
  ];
}

// With nothing stored the page follows the system, so the button that shows as
// chosen is the one actually in effect — not none.
export function useTheme(): [Theme, (theme: Theme) => void] {
  const theme = useSyncExternalStore(
    subscribe,
    () => {
      const stored = read("theme");
      if (stored === "light" || stored === "dark") {
        return stored;
      }
      return matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    },
    () => "light" as Theme,
  );

  return [
    theme,
    (chosen: Theme) => {
      document.documentElement.dataset.theme = chosen;
      write("theme", chosen);
      announce();
    },
  ];
}
