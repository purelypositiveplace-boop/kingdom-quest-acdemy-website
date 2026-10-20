import { test, expect } from "@playwright/test";
import { trackErrors } from "./helpers";

test("guest onboarding works without an account", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  await page.getByTestId("start-learning").click();
  await page.getByTestId("who-kid").click();
  await page.getByTestId("nickname").fill("Brave Heart");
  await page.getByTestId("onboard-next").click();
  await page.getByTestId("level-disciples").click();
  await page.getByTestId("onboard-next").click();
  await page.getByTestId("onboard-next").click(); // comfort settings (skip)
  await page.getByTestId("onboard-next").click(); // navigation tour
  await page.getByTestId("start-world-noahs-harbor").click();
  await expect(page.getByTestId("dashboard-name")).toHaveText("Hi, Brave Heart!");
  await page.reload();
  await expect(page.getByTestId("dashboard-name")).toHaveText("Hi, Brave Heart!");
  expect(errors).toEqual([]);
});
