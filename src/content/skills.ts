import data from "./skills.json";
import type { Localized, Translatable } from "./localized";

// The level is never written out as a word: it is how full the marker is drawn.
export type SkillLevel = "proficient" | "advanced" | "expert";

export type Skill = {
  name: Translatable<string>;
  level: SkillLevel;
};

export type SkillGroup = {
  category: Localized<string>;
  items: Skill[];
};

// JSON widens "expert" to string. Annotating with the widened shape keeps the
// compiler checking everything else; the test covers what it gave up on.
const parsed: {
  category: Localized<string>;
  items: { name: Translatable<string>; level: string }[];
}[] = data;

export const skills = parsed as SkillGroup[];
