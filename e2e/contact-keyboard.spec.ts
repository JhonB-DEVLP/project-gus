import { expect, test } from "@playwright/test";

// Spec §11: fill and send the contact form with the keyboard only.
test("sends the contact form using only Tab, typing and Enter", async ({ page }) => {
  await page.goto("/en/contact");
  await page.waitForLoadState("networkidle");

  // Flags the honeypot if it ever takes focus on the way through the page.
  await page.locator("#c-company").evaluate((input) => {
    input.addEventListener("focus", () => {
      document.body.dataset.honeypotFocused = "true";
    });
  });

  // Tab from the top of the page (skip link, header…) to the first field.
  const name = page.locator("#c-name");
  for (let i = 0; i < 40; i++) {
    if (await name.evaluate((input) => input === document.activeElement)) break;
    await page.keyboard.press("Tab");
  }
  await expect(name).toBeFocused();
  await page.keyboard.type("Ada Lovelace");

  await page.keyboard.press("Tab");
  await expect(page.locator("#c-email")).toBeFocused();
  await page.keyboard.type("ada@example.com");

  await page.keyboard.press("Tab");
  await expect(page.locator("#c-message")).toBeFocused();
  await page.keyboard.type("Hello, I would like to talk about a project.");

  // The honeypot has tabIndex -1, so the next stop is the submit button.
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Send message" })).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("status")).toContainText("Message sent");
  await expect(page.getByRole("status")).toContainText("Thanks, Ada Lovelace.");
  await expect(page.locator("body")).not.toHaveAttribute("data-honeypot-focused", "true");
});
