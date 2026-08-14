import data from "./contact.json";

export type Contact = {
  email: string;
};

// The phone number stays on the CV, which is handed to people. A public page
// that search engines index is a different room.
export const contact: Contact = data;
