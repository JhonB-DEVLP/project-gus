import type { Locale } from "@/lib/i18n";

export const CONTACT_FIELDS = ["name", "email", "message"] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];

export function isContactField(value: unknown): value is ContactField {
  return CONTACT_FIELDS.some((field) => field === value);
}

// docs/spec.md §7. Field messages are keys of the `contact.err` dictionary
// entry ("name" → dict.contact.err.name), so they translate.
export type ContactResult =
  | { ok: true }
  | { ok: false; error: "validation"; fields: Partial<Record<ContactField, string>> }
  | { ok: false; error: "rate_limited"; retryAfterSeconds: number }
  | { ok: false; error: "spam" }
  | { ok: false; error: "server" };

// What the action passes in: raw form values plus where the request came from.
export type ContactInput = {
  name: string;
  email: string;
  message: string;
  // Honeypot: must be empty.
  company: string;
  locale: Locale;
  // HMAC of the sender's IP (see client-id.ts), never the IP itself.
  clientId: string;
};

export type StoredMessage = {
  id: string;
  time: string;
  name: string;
  email: string;
  message: string;
  locale: Locale;
};

export interface MessageStore {
  save(message: StoredMessage): Promise<void>;
  countSpam(): Promise<void>;
}

export interface Mailer {
  send(message: StoredMessage): Promise<void>;
}

export interface RateLimiter {
  limit(clientId: string): Promise<{ ok: true } | { ok: false; retryAfterSeconds: number }>;
}

export type ContactDeps = {
  store: MessageStore;
  mailer: Mailer;
  limiter: RateLimiter;
};
