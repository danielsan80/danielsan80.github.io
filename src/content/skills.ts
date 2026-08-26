import data from "./skills.json";

// The level is never written out as a word: it is how full the marker is drawn.
export type SkillLevel = "proficient" | "advanced" | "expert";

export type Skill = {
  name: string;
  level: SkillLevel;
};

export type SkillGroup = {
  category: string;
  items: Skill[];
};

// JSON widens "expert" to string. Annotating with the widened shape keeps the
// compiler checking everything else; the test covers what it gave up on.
const parsed: {
  category: string;
  items: { name: string; level: string }[];
}[] = data;

export const skills = parsed as SkillGroup[];
