import data from "./profiles.json";

export type Profile = {
  name: string;
  handle: string;
  url: string;
};

// One collection, three readers: the home footer, the repo hub and the CV
// header. The handle travels with the URL because the point is to show that
// danielsan80 and dansan are the same person as Danilo Sanchi.
export const profiles: Profile[] = data;
