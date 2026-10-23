import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/pricing",
  "/contact",
  "/login",
  "/signup",
  "/forgot-password",
  "/dashboard",
  "/transactions",
  "/settings",
  "/settings?tab=notifications",
  "/settings?tab=workspace",
  "/no-such-page",
];

for (const route of routes) {
  test.describe(route, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
    });

    test("has no WCAG 2.2 AA violations", async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const report = results.violations.flatMap((v) =>
        v.nodes.map((node) => `${v.id} ${node.target.join(" ")}: ${node.failureSummary}`),
      );
      expect(report).toEqual([]);
    });

    test("has one h1, no skipped heading levels and one main landmark", async ({ page }) => {
      const levels = await page
        .locator("h1, h2, h3, h4, h5, h6")
        .evaluateAll((els) =>
          els.filter((el) => el.checkVisibility()).map((el) => Number(el.tagName[1])),
        );
      expect(levels.filter((l) => l === 1)).toHaveLength(1);
      levels.forEach((level, i) => {
        if (i > 0) expect(level - levels[i - 1]!).toBeLessThanOrEqual(1);
      });
      await expect(page.locator("main#main-content")).toHaveCount(1);
    });
  });
}
