import { describe, expect, it } from "vitest";
import { themeScript } from "@/lib/theme";

// Runs the inline <head> script against a fake document and storage.
function run(stored: string | null | Error) {
  const attributes = new Map<string, string>();
  const document = {
    documentElement: { setAttribute: (name: string, value: string) => attributes.set(name, value) },
  };
  const localStorage = {
    getItem: () => {
      if (stored instanceof Error) throw stored;
      return stored;
    },
  };
  new Function("document", "localStorage", themeScript)(document, localStorage);
  return attributes.get("data-theme");
}

describe("theme script", () => {
  it.each(["light", "dark"])("sets data-theme for a stored %s", (theme) => {
    expect(run(theme)).toBe(theme);
  });

  it.each([null, "system", "purple"])("leaves data-theme unset for %j", (stored) => {
    expect(run(stored)).toBeUndefined();
  });

  it("survives blocked storage", () => {
    expect(run(new Error("SecurityError"))).toBeUndefined();
  });
});
