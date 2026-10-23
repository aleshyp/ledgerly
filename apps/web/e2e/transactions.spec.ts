import { expect, test } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "Covered on desktop; the flows are the same.");

test("a transaction recorded on the dashboard shows up on the transactions page", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "New transaction…" }).click();
  const dialog = page.getByRole("dialog", { name: "Record a transaction" });

  await dialog.getByRole("button", { name: "Save transaction" }).click();
  await expect(dialog.getByLabel("Merchant or payer")).toBeFocused();
  await expect(dialog.getByText("Enter who you paid or who paid you.")).toBeVisible();

  await dialog.getByLabel("Merchant or payer").fill("Farmers market");
  await dialog.getByLabel("Amount").fill("84.20");
  await dialog.getByRole("button", { name: "Save transaction" }).click();
  await expect(page.getByText("Transaction saved", { exact: true })).toBeVisible();

  await expect(page.getByRole("table").getByText("Farmers market", { exact: true })).toBeVisible();

  // Client-side navigation keeps the in-memory store, as moving around the app would.
  await page.getByRole("link", { name: "View all transactions" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Transactions");
  await expect(page.getByRole("cell", { name: "Farmers market", exact: true })).toHaveCount(1);
});

test("filters live in the URL", async ({ page }) => {
  await page.goto("/transactions?status=failed");
  await expect(page.getByRole("combobox", { name: "Filter by status" })).toHaveText("Failed");
  await expect(page.locator("tbody tr")).toHaveCount(1);

  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page).toHaveURL(/\/transactions$/);
});

test("deleting a transaction can be undone", async ({ page }) => {
  await page.goto("/transactions");
  const row = page.getByRole("row", { name: /Figma/ });
  await row.getByRole("button", { name: /Actions for Figma/ }).click();
  await page.getByRole("menuitem", { name: "Delete transaction" }).click();
  await expect(row).toHaveCount(0);

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("row", { name: /Figma/ })).toBeVisible();
});

test("export downloads a CSV", async ({ page }) => {
  await page.goto("/dashboard");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  expect((await download).suggestedFilename()).toBe("ledgerly-transactions.csv");
});
