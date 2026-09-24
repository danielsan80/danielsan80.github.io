import { useSyncExternalStore } from "react";
import type { Lang } from "../../content/localized";

export type Theme = "light" | "dark";

export type ThemeChoice = Theme | "auto";

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

function forget(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing could be stored, so there is nothing to forget.
  }
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changing the same preference counts as a change here.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
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

// With nothing stored the page follows the system, through the media query in
// tokens.css: Auto is the absence of a choice, not a third theme.
export function useTheme(): [ThemeChoice, (choice: ThemeChoice) => void] {
  const choice = useSyncExternalStore(
    subscribe,
    () => {
      const stored = read("theme");
      return stored === "light" || stored === "dark" ? stored : "auto";
    },
    () => "auto" as ThemeChoice,
  );

  return [
    choice,
    (chosen: ThemeChoice) => {
      if (chosen === "auto") {
        delete document.documentElement.dataset.theme;
        forget("theme");
      } else {
        document.documentElement.dataset.theme = chosen;
        write("theme", chosen);
      }
      announce();
    },
  ];
}
