import "server-only";

import { z } from "zod";
import { ROLE_TYPE_VALUES } from "@/lib/contact";

// Payload the /api/contact route accepts. Caps keep a submission a real
// message, not a pasted document or an abuse vector:
//   - name:     a person, not a paragraph
//   - message:  substantive but bounded
//   - company:  optional, short
//   - website:  honeypot — a hidden field a human never fills. Non-empty
//               means a bot; the route accepts it (200) but drops it.

export const ContactRequestSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(120),
  email: z.email("a valid email is required").max(254),
  "role-type": z.enum(ROLE_TYPE_VALUES),
  company: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(1, "message is required").max(4000),
  // Honeypot: rendered visually hidden, so a real user leaves it blank. A
  // non-empty value means a bot — accepted here (bounded) and dropped by the
  // route with a 200, so the bot gets no signal that it was filtered.
  website: z.string().max(2000).optional().default(""),
});

export type ContactRequest = z.infer<typeof ContactRequestSchema>;
