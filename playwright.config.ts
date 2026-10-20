import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against the production build:
 *   NEXT_DIST_DIR=.next-build npm run build && npm run test:e2e
 * If nothing is listening on E2E_PORT, Playwright starts the server itself.
 */
const port = Number(process.env.E2E_PORT ?? 3200);

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  webServer: { command: `node scripts/serve-build.mjs ${port}`, port, reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 820, height: 1180 }, hasTouch: true }, testMatch: /responsive|guest/ },
    { name: "phone", use: { ...devices["Pixel 7"] }, testMatch: /responsive|guest/ },
  ],
});
