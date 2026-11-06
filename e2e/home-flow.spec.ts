import { expect, test } from "@playwright/test";

test("home -> nav scroll-highlight -> contact form happy path", async ({ page }) => {
  await page.goto("/");

  const desktopNav = page.locator("nav").first();

  // Click "Projects" in the nav and confirm it scrolls to the #projects section and
  // picks up the active (aria-current) state that NavBar's scroll-spy drives.
  await desktopNav.getByRole("button", { name: /projects/i }).click();
  await expect(page.locator("#projects")).toBeInViewport();
  await expect(desktopNav.getByRole("button", { name: /projects/i })).toHaveAttribute(
    "aria-current",
    "page",
  );

  // Contact form happy path: fill every required field and submit.
  await desktopNav.getByRole("button", { name: /contact/i }).click();
  await page.getByLabel(/name/i).fill("Ada Lovelace");
  await page.getByLabel(/email/i).fill("ada@example.com");
  await page.getByLabel(/subject/i).fill("Hello there");
  await page.getByLabel(/message/i).fill("Loved the site, great work!");
  await page.getByRole("button", { name: /send message/i }).click();

  // Dev-mode ContactForm fast-forwards to /thank-you without a live form backend.
  await expect(page).toHaveURL(/\/thank-you$/);
});
