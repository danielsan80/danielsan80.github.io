import { education } from "./education";
import { experiences } from "./experiences";
import { identity } from "./identity";
import { LANGS } from "./localized";
import { periodBounds, type Period } from "./period";
import { featuredProjects } from "./projects";
import { skills, type SkillLevel } from "./skills";
import { training } from "./training";

const LEVELS: string[] = [
  "proficient",
  "advanced",
  "expert",
] satisfies SkillLevel[];

export function localizedViolations(value: unknown, path: string): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      localizedViolations(item, `${path}[${index}]`),
    );
  }
  if (typeof value !== "object" || value === null) {
    return [];
  }

  const keys = Object.keys(value);
  const languages: string[] = LANGS;
  if (keys.some((key) => languages.includes(key))) {
    const complete =
      keys.length === languages.length &&
      languages.every((lang) => keys.includes(lang));
    return complete
      ? []
      : [
          `${path}: speaks ${keys.join(", ")}, must speak ${languages.join(", ")}`,
        ];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    localizedViolations(child, `${path}.${key}`),
  );
}

export function dateViolations(
  entries: { period: Period }[],
  path: string,
  today: number,
): string[] {
  return entries.flatMap((entry, index) => {
    try {
      periodBounds(entry.period, today);
      return [];
    } catch (error) {
      return [`${path}[${index}]: ${(error as Error).message}`];
    }
  });
}

export function levelViolations(
  groups: { items: { level: string }[] }[],
  path: string,
): string[] {
  return groups.flatMap((group, groupIndex) =>
    group.items.flatMap((item, index) =>
      LEVELS.includes(item.level)
        ? []
        : [
            `${path}[${groupIndex}].items[${index}]: unknown level ${JSON.stringify(item.level)}`,
          ],
    ),
  );
}

export function contentViolations(today: number): string[] {
  const collections: [string, unknown][] = [
    ["identity", identity],
    ["experiences", experiences],
    ["education", education],
    ["training", training],
    ["skills", skills],
    ["featuredProjects", featuredProjects],
  ];

  return [
    ...collections.flatMap(([name, data]) => localizedViolations(data, name)),
    ...dateViolations(experiences, "experiences", today),
    ...dateViolations(education, "education", today),
    ...dateViolations(training, "training", today),
    ...levelViolations(skills, "skills"),
  ];
}
