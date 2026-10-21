import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const COLOR_TOKENS = [
  "--bg",
  "--surface",
  "--fg",
  "--muted",
  "--rule",
  "--field",
  "--accent",
  "--on-accent",
  "--warn",
  "--error",
] as const;

const MOTION_TOKENS = ["--dur-fast", "--dur-base", "--dur-hero", "--ease"] as const;

// Custom properties declared directly inside the first block that opens with `selector`.
function declarations(selector: string): Map<string, string> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Missing block: ${selector}`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  const body = css.slice(open + 1, close);
  return new Map(
    [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].flatMap(([, name, value]) =>
      name && value ? [[name, value.trim()] as const] : [],
    ),
  );
}

describe("design tokens in app/globals.css", () => {
  const light = declarations(":root {");
  const darkBySystem = declarations(':root:not([data-theme="light"]) {');
  const darkByChoice = declarations(':root[data-theme="dark"] {');

  it.each(COLOR_TOKENS)("defines %s in all three theme blocks", (token) => {
    expect(light.has(token)).toBe(true);
    expect(darkBySystem.has(token)).toBe(true);
    expect(darkByChoice.has(token)).toBe(true);
  });

  it("keeps both dark blocks identical", () => {
    expect(darkByChoice).toEqual(darkBySystem);
  });

  it("gives the dark theme its own values, not the light ones", () => {
    for (const token of COLOR_TOKENS) {
      expect(darkBySystem.get(token)).not.toBe(light.get(token));
    }
  });

  it.each(MOTION_TOKENS)("defines motion token %s", (token) => {
    expect(light.has(token)).toBe(true);
  });
});
