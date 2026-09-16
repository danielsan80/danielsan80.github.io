export type Lang = "it" | "en";

export const LANGS: Lang[] = ["it", "en"];

export type Localized<T> = Record<Lang, T>;

export type Translatable<T> = T | Localized<T>;

function isLocalized<T>(value: Translatable<T>): value is Localized<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    LANGS.every((lang) => lang in value)
  );
}

export function pick<T>(value: Translatable<T>, lang: Lang): T {
  return isLocalized(value) ? value[lang] : value;
}
