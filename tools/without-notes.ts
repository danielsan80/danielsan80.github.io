// Notes are private: the content check and the tests read them, the built
// site must not carry them.

type YamlValue =
  number | string | boolean | null | { [key: string]: YamlValue } | YamlValue[];

export function withoutNotes(value: YamlValue): YamlValue {
  if (Array.isArray(value)) return value.map(withoutNotes);
  if (typeof value !== "object" || value === null) return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== "notes")
      .map(([key, child]) => [key, withoutNotes(child)]),
  );
}
