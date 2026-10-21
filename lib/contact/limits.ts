// Field limits shared by the schema and the form. Kept apart from schema.ts
// so the client bundle doesn't pull in Zod for three numbers.
export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const EMAIL_MAX = 254;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;
