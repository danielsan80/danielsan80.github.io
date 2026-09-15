import { z } from "zod";

const localized = <T extends z.ZodType>(value: T) =>
  z.strictObject({ it: value, en: value });

const translatable = <T extends z.ZodType>(value: T) =>
  z.union([value, localized(value)]);

export const periodSchema = z.strictObject({
  start: z.string(),
  end: z.string().optional(),
});

export const identitySchema = z.strictObject({
  name: z.string(),
  headline: translatable(z.string()),
  summary: localized(z.string()),
});

export const contactSchema = z.strictObject({
  email: z.string(),
});

export const profileSchema = z.strictObject({
  name: z.string(),
  handle: z.string(),
  url: z.string(),
});

export const experienceSchema = z.strictObject({
  role: localized(z.string()),
  company: z.string(),
  location: translatable(z.string()),
  remote: z.boolean(),
  period: periodSchema,
  notes: z.string().optional(),
  channels: z.strictObject({
    cv: localized(z.array(z.string())),
    linkedin: localized(z.string()).optional(),
  }),
});

export const educationSchema = z.strictObject({
  institution: translatable(z.string()),
  location: translatable(z.string()),
  title: localized(z.string()),
  period: periodSchema,
});

export const trainingSchema = z.strictObject({
  title: translatable(z.string()),
  period: periodSchema,
  note: localized(z.string()),
});

export const skillLevelSchema = z.enum(["proficient", "advanced", "expert"]);

export const skillGroupSchema = z.strictObject({
  category: localized(z.string()),
  items: z.array(
    z.strictObject({
      name: translatable(z.string()),
      level: skillLevelSchema,
    }),
  ),
});

export const projectSchema = z.strictObject({
  name: z.string(),
  summary: localized(z.string()),
  links: z.array(z.strictObject({ label: z.string(), url: z.string() })),
});
