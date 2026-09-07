import data from "./identity.json";
import type { Localized, Translatable } from "./localized";

// Who the site is about. The home page and the CV header read the same record,
// so the name is written once.
export type Identity = {
  name: string;
  headline: Translatable<string>;
  summary: Localized<string>;
};

export const identity: Identity = data;
