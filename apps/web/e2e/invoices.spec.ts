import { expect, test } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "Covered on desktop; the flows are the same.");

test("the status filter lives in the URL", async ({ page }) => {
  await page.goto("/invoices?status=overdue");
  await expect(page.getByRole("combobox", { name: "Filter by status" })).toHaveText("Overdue");
  await expect(page.locator("tbody tr")).toHaveCount(2);

  await page.getByRole("button", { name: "Reset filter" }).click();
  await expect(page).toHaveURL(/\/invoices$/);
});

test("marking an invoice as paid can be undone", async ({ page }) => {
  await page.goto("/invoices");
  const row = page.getByRole("row", { name: /INV-1042/ });
  await expect(row.getByText("Overdue")).toBeVisible();

  await row.getByRole("button", { name: /Actions for INV-1042/ }).click();
  await page.getByRole("menuitem", { name: "Mark as paid" }).click();
  await expect(row.getByText("Paid", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(row.getByText("Overdue")).toBeVisible();
});

test("a new invoice gets the next number", async ({ page }) => {
  await page.goto("/invoices");
  await page.getByRole("button", { name: "New invoice…" }).click();
  const dialog = page.getByRole("dialog", { name: "Send an invoice" });

  await dialog.getByRole("button", { name: "Send invoice" }).click();
  await expect(dialog.getByLabel("Customer")).toBeFocused();

  await dialog.getByLabel("Customer").fill("Juniper Street Deli");
  await dialog.getByLabel("Amount").fill("1,250.00");
  await dialog.getByRole("button", { name: "Send invoice" }).click();

  const row = page.getByRole("row", { name: /Juniper Street Deli/ });
  await expect(row.getByText("INV-1049")).toBeVisible();
  await expect(row.getByText("Open")).toBeVisible();
});
