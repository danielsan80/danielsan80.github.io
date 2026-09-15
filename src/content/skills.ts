import type { z } from "zod";
import type { skillGroupSchema, skillLevelSchema } from "./schema";
import data from "./skills.yaml";

// The level is never written out as a word: it is how full the marker is drawn.
export type SkillLevel = z.infer<typeof skillLevelSchema>;

export type SkillGroup = z.infer<typeof skillGroupSchema>;

export const skills = data as SkillGroup[];
