import type { z } from "zod";
import type { skillGroupSchema, skillLevelSchema } from "./schema";
import data from "./skills.json";

// The level is never written out as a word: it is how full the marker is drawn.
export type SkillLevel = z.infer<typeof skillLevelSchema>;

export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Skill = SkillGroup["items"][number];

// JSON widens "expert" to string. Annotating with the widened shape keeps the
// compiler checking everything else; the test covers what it gave up on.
const parsed: (Omit<SkillGroup, "items"> & {
  items: (Omit<Skill, "level"> & { level: string })[];
})[] = data;

export const skills = parsed as SkillGroup[];
