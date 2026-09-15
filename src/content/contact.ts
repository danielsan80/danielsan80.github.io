import type { z } from "zod";
import data from "./contact.json";
import type { contactSchema } from "./schema";

export type Contact = z.infer<typeof contactSchema>;

// The phone number stays on the CV, which is handed to people. A public page
// that search engines index is a different room.
export const contact: Contact = data;
