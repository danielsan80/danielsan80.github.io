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

const schemas = {
  identity: identitySchema,
  contact: contactSchema,
  profiles: z.array(profileSchema),
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  training: z.array(trainingSchema),
  skills: z.array(skillGroupSchema),
  projects: z.array(projectSchema),
  topics: z.array(topicSchema),
};

export type Content = Record<keyof typeof schemas, unknown>;

const DATED = ["experiences", "education", "training", "projects"] as const;

export const siteContent: Content = {
  identity,
  contact,
  profiles,
  experiences,
  education,
  training,
  skills,
  projects,
  topics,
};

export function contentViolations(
  content: Content,
  today: number,
): Violation[] {
  const collections = Object.entries(schemas);
  const shape = collections.flatMap(([name, schema]) => {
    const data = content[name as keyof Content];
    return schemaViolations(schema, data, name);
  });
  if (shape.length > 0) {
    return shape;
  }

  return DATED.flatMap((name) =>
    dateViolations(content[name] as { period: Period }[], name, today),
  );
}
