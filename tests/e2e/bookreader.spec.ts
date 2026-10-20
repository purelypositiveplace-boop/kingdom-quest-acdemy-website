import { test, expect } from "@playwright/test";
import { trackErrors } from "./helpers";

test("Read Me the Bible opens a chapter as a book and turns pages", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/bible");
  await page.getByTestId("open-listen").click();
  await page.getByRole("link", { name: /In the beginning/ }).click();
  const reader = page.getByTestId("book-reader");
  await expect(reader.getByRole("heading", { name: "Genesis 1" })).toBeVisible();
  // No recording yet, so the page says so instead of offering a fake play button.
  await expect(page.getByTestId("audio-coming")).toBeVisible();
  await expect(page.getByTestId("read-to-me")).toHaveCount(0);
  await expect(reader.locator('[data-verse="1"]')).toContainText("In the beginning");
  // Turn through every page until the next-chapter button appears.
  for (let i = 0; i < 20 && (await page.getByTestId("page-next").count()); i++) await page.getByTestId("page-next").click();
  await expect(reader.locator('[data-verse="31"]')).toBeVisible();
  await page.getByTestId("next-chapter").click();
  await expect(reader.getByRole("heading", { name: "Genesis 2" })).toBeVisible();
  expect(errors).toEqual([]);
});
