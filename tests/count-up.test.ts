import { describe, expect, it } from "vitest";
import { toMs } from "@/components/count-up";

// The production CSS minifier rewrites "1100ms" as "1.1s".
describe("toMs", () => {
  it.each([
    ["1100ms", 1100],
    ["1.1s", 1100],
    [" 1100ms ", 1100],
    ["0.25s", 250],
  ])("reads %j as %d ms", (time, ms) => {
    expect(toMs(time)).toBe(ms);
  });

  it("returns NaN for an empty value, so the animation is skipped", () => {
    expect(toMs("")).toBeNaN();
  });
});
