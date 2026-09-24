import type { z } from "zod";
import { profiles } from "./profiles";
import type { topicSchema } from "./schema";
import data from "./topics.yaml";

export type Topic = z.infer<typeof topicSchema>;

export const topics = data as Topic[];

const github = profiles.find((profile) => profile.name === "GitHub");
if (!github) {
  throw new Error("No GitHub profile to search the repositories of");
}

const repositories = `${github.url}?tab=repositories`;

export const repositorySearch = (query: string) =>
  `${repositories}&q=${encodeURIComponent(query)}`;
