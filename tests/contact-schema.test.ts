import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact/schema";

const valid = { name: "Gus Fune", email: "gus@example.com", message: "Saw your Léia project. Call on Thursday?" };

function fieldsWithErrors(input: Record<string, unknown>) {
  const result = contactSchema.safeParse(input);
  return result.success ? [] : [...new Set(result.error.issues.map((issue) => String(issue.path[0])))];
}

describe("contactSchema", () => {
  it("accepts a valid message and trims every field", () => {
    const result = contactSchema.parse({ name: "  Gus  ", email: " gus@example.com ", message: `  ${valid.message}  ` });
    expect(result).toEqual({ name: "Gus", email: "gus@example.com", message: valid.message });
  });

  describe("name", () => {
    it.each([
      ["2 characters", "Jo", true],
      ["80 characters", "a".repeat(80), true],
      ["1 character", "J", false],
      ["81 characters", "a".repeat(81), false],
      ["only spaces", "    ", false],
      ["1 character after trim", "  J  ", false],
    ])("%s → valid: %s", (_, name, ok) => {
      expect(fieldsWithErrors({ ...valid, name })).toEqual(ok ? [] : ["name"]);
    });

    // The name goes into the email subject: no header injection.
    it.each([
      ["a line feed", "Gus\nBcc: x@example.com"],
      ["a carriage return", "Gus\rFune"],
      ["a tab", "Gus\tFune"],
      ["a NUL", "Gus\u0000Fune"],
      ["a line separator", "Gus Fune"],
    ])("rejects %s", (_, name) => {
      expect(fieldsWithErrors({ ...valid, name })).toEqual(["name"]);
    });
  });

  describe("email", () => {
    it.each([
      ["a normal address", "name@company.com", true],
      ["254 characters", `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(57)}.com`, true],
      ["no domain", "gus@", false],
      ["no @", "gus.example.com", false],
      ["empty", "", false],
      ["255 characters", `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(58)}.com`, false],
    ])("%s → valid: %s", (_, email, ok) => {
      expect(fieldsWithErrors({ ...valid, email })).toEqual(ok ? [] : ["email"]);
    });
  });

  describe("message", () => {
    it.each([
      ["10 characters", "a".repeat(10), true],
      ["2000 characters", "a".repeat(2000), true],
      ["line breaks", "Line one\nLine two\n", true],
      ["9 characters", "a".repeat(9), false],
      ["2001 characters", "a".repeat(2001), false],
      ["9 characters after trim", `   ${"a".repeat(9)}   `, false],
    ])("%s → valid: %s", (_, message, ok) => {
      expect(fieldsWithErrors({ ...valid, message })).toEqual(ok ? [] : ["message"]);
    });
  });

  it("reports every invalid field at once", () => {
    expect(fieldsWithErrors({ name: "", email: "x", message: "" }).sort()).toEqual(["email", "message", "name"]);
  });
});
