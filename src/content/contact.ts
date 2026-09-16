import type { z } from "zod";
import data from "./contact.yaml";
import type { contactSchema } from "./schema";

export type Contact = z.infer<typeof contactSchema>;

export const contact = data as Contact;
