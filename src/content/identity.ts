import data from "./identity.json";

// Who the site is about. The home page and the CV header read the same record,
// so the name is written once.
export type Identity = {
  name: string;
  headline: string;
  summary: string;
};

export const identity: Identity = data;
