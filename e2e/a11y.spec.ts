import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Spec §11: axe on home, one project page and contact, zero violations.
// The 404 is checked too. Each page runs in both themes, since contrast
// differs. Reduced motion shows the finished page, so axe never measures
// an element halfway through its entrance.

const pages = ["/en", "/en/work/leia", "/en/contact", "/en/work/prj-04"];
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const path of pages) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${path} has no axe violations (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.goto(path);
      // Home streams the live section; wait until it has resolved.
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(results.violations).toEqual([]);
    });
  }
}

test("an unknown path returns 404 and names what was requested", async ({ page }) => {
  const response = await page.goto("/pt/work/prj-04");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Peça não encontrada");
  await expect(page.getByText("/pt/work/prj-04")).toBeVisible();
});
