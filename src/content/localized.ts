export type Lang = "it" | "en";

export const LANGS: Lang[] = ["it", "en"];

// Every language is mandatory: a record with a hole is caught by the content
// test, not discovered as a blank on the page.
export type Localized<T> = Record<Lang, T>;

// A value that reads the same in every language stays a plain value: "PHP" is
// "PHP", and the skill list does not double in size to say so.
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
