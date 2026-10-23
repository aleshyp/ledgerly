import { expect, test } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "Covered on desktop; the flows are the same.");

test("the app nav reaches cards and invoices", async ({ page }) => {
  await page.goto("/dashboard");
  const nav = page.getByRole("navigation", { name: "App" });
  await nav.getByRole("link", { name: "Cards" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cards");
  await expect(nav.getByRole("link", { name: "Cards" })).toHaveAttribute("aria-current", "page");

  await nav.getByRole("link", { name: "Invoices" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Invoices");
});

test("a card can be frozen and unfrozen", async ({ page }) => {
  await page.goto("/cards");
  const card = page
    .getByRole("list", { name: "Company cards" })
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { name: "Travel" }) });
  await expect(card.getByText("Active")).toBeVisible();

  await card.getByRole("button", { name: "Freeze card, Travel" }).click();
  await expect(card.getByText("Frozen")).toBeVisible();
  await expect(page.getByText("Travel card frozen", { exact: true })).toBeVisible();

  await card.getByRole("button", { name: "Unfreeze card, Travel" }).click();
  await expect(card.getByText("Active")).toBeVisible();
});

test("issuing a card validates, then adds it to the grid", async ({ page }) => {
  await page.goto("/cards");
  await page.getByRole("button", { name: "Issue card…" }).click();
  const dialog = page.getByRole("dialog", { name: "Issue a card" });

  await dialog.getByRole("button", { name: "Issue card" }).click();
  await expect(dialog.getByLabel("Card name")).toBeFocused();

  await dialog.getByLabel("Card name").fill("Office supplies");
  await dialog.getByLabel("Monthly limit").fill("250");
  await dialog.getByRole("button", { name: "Issue card" }).click();

  await expect(page.getByText("Card issued", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Office supplies" })).toBeVisible();
});
