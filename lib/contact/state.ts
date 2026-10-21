import type { ContactField, ContactResult } from "./types";

// What the contact action returns to `useActionState`. Shared by the
// Server Action and the ContactForm (types and one constant, no server code).
export type ContactValues = Record<ContactField, string>;

export type ContactState = {
  result: ContactResult | null;
  // The text to put back in the form: what was sent, or empty after a success.
  values: ContactValues;
  // For "Thanks, {name}." after a success.
  sentName: string;
  // Bumped on every reply; the form remounts with `values` as defaults.
  version: number;
};

export const EMPTY_VALUES: ContactValues = { name: "", email: "", message: "" };

export const initialContactState: ContactState = { result: null, values: EMPTY_VALUES, sentName: "", version: 0 };
