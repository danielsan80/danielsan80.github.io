import type { z } from "zod";
import type { skillGroupSchema, skillLevelSchema } from "./schema";
import data from "./skills.yaml";

export type SkillLevel = z.infer<typeof skillLevelSchema>;

export type SkillGroup = z.infer<typeof skillGroupSchema>;

export const skills = data as SkillGroup[];
