import { defineConfig, devices } from "@playwright/test";

const port = 3100;

/** Runs against the production build: `pnpm build` first, then `pnpm --filter @ledgerly/web e2e`. */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    // Entrance animations would otherwise catch axe mid-fade.
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "light", use: { ...devices["Desktop Chrome"], colorScheme: "light" } },
    { name: "dark", use: { ...devices["Desktop Chrome"], colorScheme: "dark" } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `pnpm exec next start --port ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
