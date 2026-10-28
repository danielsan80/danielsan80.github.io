// Notes are private: only the content check reads them, in the with-notes
// mode; everything else, the built site included, loads the content without.

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
