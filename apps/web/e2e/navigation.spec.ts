import { expect, test } from "@playwright/test";

test("every internal link on the marketing site resolves", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page
    .locator("a[href^='/']")
    .evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute("href")!.split("#")[0]!))]);

  for (const href of hrefs) {
    const response = await request.get(href || "/");
    expect(response.status(), href).toBe(200);
  }
});

test("sign-up calls to action lead to sign-up, not sign-in", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Open an account" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Create your account");

  await page.goto("/pricing");
  await page.getByRole("link", { name: "Start 14-day trial" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Start your Growth trial");
});

test("shares a preview card", async ({ page, request }) => {
  await page.goto("/");
  const image = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(image).toBeTruthy();
  const response = await request.get(new URL(image!).pathname);
  expect(response.headers()["content-type"]).toContain("image/png");
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "The menu only shows below md.");

  test("reaches every section from the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("menuitem", { name: "Pricing" }).click();
    await expect(page).toHaveURL(/\/pricing$/);
  });
});
