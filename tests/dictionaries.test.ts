import { describe, expect, it } from "vitest";
import en from "@/app/[lang]/dictionaries/en.json";
import pt from "@/app/[lang]/dictionaries/pt.json";

// Flattens { nav: { work: "Work" } } into [["nav.work", "Work"]].
// An array (like the hero lines) is one key: each language may break the
// text into a different number of lines, but every item is still checked.
function entries(value: unknown, prefix = ""): [string, unknown][] {
  if (Array.isArray(value)) return value.map((item): [string, unknown] => [prefix, item]);
  if (value === null || typeof value !== "object") return [[prefix, value]];
  return Object.entries(value).flatMap(([key, child]) =>
    entries(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("dictionaries", () => {
  const enEntries = entries(en);
  const ptEntries = entries(pt);

  it("have the same keys in both languages", () => {
    const keys = (list: [string, unknown][]) => [...new Set(list.map(([key]) => key))].sort();
    expect(keys(ptEntries)).toEqual(keys(enEntries));
  });

  it.each([
    ["en", enEntries],
    ["pt", ptEntries],
  ] as const)("%s has only non-empty strings", (_, list) => {
    for (const [key, value] of list) {
      expect(typeof value, key).toBe("string");
      expect(String(value).trim(), key).not.toBe("");
    }
  });
});
