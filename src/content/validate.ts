import { z } from "zod";
import { contact } from "./contact";
import { education } from "./education";
import { experiences } from "./experiences";
import { identity } from "./identity";
import { periodBounds, type Period } from "./time/period";
import { profiles } from "./profiles";
import { projects } from "./projects";
import {
  contactSchema,
  educationSchema,
  experienceSchema,
  identitySchema,
  profileSchema,
  projectSchema,
  skillGroupSchema,
  topicSchema,
  trainingSchema,
} from "./schema";
import { skills } from "./skills";
import { topics } from "./topics";
import { training } from "./training";

export type Violation = {
  path: string;
  message: string;
};

export function formatViolation({ path, message }: Violation): string {
  return `${path}: ${message}`;
}

function pathOf(root: string, segments: PropertyKey[]): string {
  return segments.reduce<string>(
    (path, segment) =>
      typeof segment === "number"
        ? `${path}[${segment}]`
        : `${path}.${String(segment)}`,
    root,
  );
}

export function schemaViolations(
  schema: z.ZodType,
  data: unknown,
  path: string,
): Violation[] {
  const result = schema.safeParse(data);
  return result.success
    ? []
    : result.error.issues.map((issue) => ({
        path: pathOf(path, issue.path),
        message: issue.message,
      }));
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

export function contentViolations(today: number): Violation[] {
  const collections: [string, z.ZodType, unknown][] = [
    ["identity", identitySchema, identity],
    ["contact", contactSchema, contact],
    ["profiles", z.array(profileSchema), profiles],
    ["experiences", z.array(experienceSchema), experiences],
    ["education", z.array(educationSchema), education],
    ["training", z.array(trainingSchema), training],
    ["skills", z.array(skillGroupSchema), skills],
    ["projects", z.array(projectSchema), projects],
    ["topics", z.array(topicSchema), topics],
  ];

  const shape = collections.flatMap(([name, schema, data]) =>
    schemaViolations(schema, data, name),
  );
  if (shape.length > 0) {
    return shape;
  }

  return [
    ...dateViolations(experiences, "experiences", today),
    ...dateViolations(education, "education", today),
    ...dateViolations(training, "training", today),
    ...dateViolations(projects, "projects", today),
  ];
}
