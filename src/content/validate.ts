import { education } from "./education";
import { experiences } from "./experiences";
import { identity } from "./identity";
import { LANGS } from "./localized";
import { periodBounds, type Period } from "./period";
import { featuredProjects } from "./projects";
import { skills, type SkillLevel } from "./skills";
import { training } from "./training";

export type Violation = {
  path: string;
  message: string;
};

const LEVELS: string[] = [
  "proficient",
  "advanced",
  "expert",
] satisfies SkillLevel[];

export function formatViolation({ path, message }: Violation): string {
  return `${path}: ${message}`;
}

export function localizedViolations(value: unknown, path: string): Violation[] {
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
          {
            path,
            message: `speaks ${keys.join(", ")}, must speak ${languages.join(", ")}`,
          },
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
): Violation[] {
  return entries.flatMap((entry, index) => {
    try {
      periodBounds(entry.period, today);
      return [];
    } catch (error) {
      return [{ path: `${path}[${index}]`, message: (error as Error).message }];
    }
  });
}

export function levelViolations(
  groups: { items: { level: string }[] }[],
  path: string,
): Violation[] {
  return groups.flatMap((group, groupIndex) =>
    group.items.flatMap((item, index) =>
      LEVELS.includes(item.level)
        ? []
        : [
            {
              path: `${path}[${groupIndex}].items[${index}]`,
              message: `unknown level ${JSON.stringify(item.level)}`,
            },
          ],
    ),
  );
}

export function contentViolations(today: number): Violation[] {
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
