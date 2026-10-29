import type { Content } from "./validate";

// Invented content in the shape of .private/content/, for a clone without
// access to the private repository: bin/install --fixtures copies it there.
// Loaded here only to be checked against the same schemas.
const files = import.meta.glob<unknown>("/fixtures/content/*.yaml", {
  eager: true,
  import: "default",
});

export const fixtureContent = Object.fromEntries(
  Object.entries(files).map(([path, data]) => [
    path.replace(/^.*\/|\.yaml$/g, ""),
    data,
  ]),
) as Content;
