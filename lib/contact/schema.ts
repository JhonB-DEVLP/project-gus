import { z } from "zod";
import { EMAIL_MAX, MESSAGE_MAX, MESSAGE_MIN, NAME_MAX, NAME_MIN } from "./limits";

// docs/spec.md §7. Runs on the server; the form only mirrors the limits.

// Control characters (line breaks, tabs, NUL…) and the Unicode line and
// paragraph separators. The name goes into the email subject.
const noControlCharacters = /^[^\p{Cc}\p{Zl}\p{Zp}]*$/u;

export const contactSchema = z.object({
  name: z.string().trim().min(NAME_MIN).max(NAME_MAX).regex(noControlCharacters),
  email: z.string().trim().max(EMAIL_MAX).pipe(z.email()),
  message: z.string().trim().min(MESSAGE_MIN).max(MESSAGE_MAX),
});

export type ContactMessage = z.infer<typeof contactSchema>;
