import { test, expect } from "@playwright/test";
import { trackErrors, playLessonStoryAndQuiz, playCreationSort } from "./helpers";

/**
 * PART 30 sample journey: a six-year-old on Kingdom Explorers learns "God Creates the World",
 * earns the Creation Explorer badge, and their parent sees it in the parent dashboard.
 */
test("sample child journey is saved and visible to the parent", async ({ page }) => {
  const errors = trackErrors(page);
  const email = `e2e-${Date.now()}@kqa.test`;
  const password = "e2e-test-password-1";

  // Parent creates an account and a child profile.
  await page.goto("/parents/signup");
  await page.getByTestId("auth-email").fill(email);
  await page.getByTestId("auth-password").fill(password);
  await page.getByTestId("auth-adult").check();
  await page.getByTestId("auth-consent").check();
  await page.getByTestId("auth-submit").click();
  await expect(page.getByTestId("parent-dashboard")).toBeVisible();
  await page.getByTestId("child-nickname").fill("Little Explorer");
  await page.getByTestId("child-level").selectOption("explorers");
  await page.getByTestId("add-child").click();
  await expect(page.getByTestId("child-Little Explorer")).toBeVisible();

  // Hand the device to the child.
  await page.getByTestId("start-Little Explorer").click();
  await expect(page.getByTestId("dashboard")).toBeVisible();
  await expect(page.getByTestId("dashboard-name")).toHaveText("Hi, Little Explorer!");
  await expect(page.getByText("I'm Sunny")).toBeVisible();

  // Creation Garden → God Creates the World.
  await page.getByTestId("dash-world-creation-garden").click();
  await page.getByTestId("story-creation").click();
  await expect(page.getByRole("heading", { name: "God Creates the World" })).toBeVisible();
  const asked = await playLessonStoryAndQuiz(page, "creation", "explorers");
  expect(asked).toBe(5);

  // Seven-day creation sorting game, then the lesson completes.
  await playCreationSort(page);
  await page.getByTestId("game-continue").click();
  await expect(page.getByTestId("lesson-complete")).toBeVisible();

  // Badge celebration.
  const dialog = page.getByRole("dialog", { name: /New badges?!/ });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Creation Explorer")).toBeVisible();
  await dialog.getByRole("button", { name: "Hooray!" }).click();

  // Next recommended story appears.
  await expect(page.getByTestId("next-lesson")).toBeVisible();

  // Progress persists after refresh.
  await page.goto("/learn");
  await page.reload();
  // 3 stars for the lesson + 1 for the first win of the creation-sort game
  await expect(page.getByTestId("stat-Bible Stars")).toHaveText("4");
  await expect(page.getByTestId("recent-badges").getByText("Creation Explorer")).toBeVisible();

  // Parent dashboard (behind the password gate) shows the activity.
  await page.waitForTimeout(1500); // let the debounced sync finish
  await page.goto("/parents");
  await page.getByTestId("gate-password").fill(password);
  await page.getByRole("button", { name: "Unlock" }).click();
  const card = page.getByTestId("child-Little Explorer");
  await expect(card.getByTestId("child-Lessons")).toHaveText("1");
  await card.getByRole("button", { name: "Details" }).click();
  await expect(card.getByTestId("child-history")).toContainText("God Creates the World");

  expect(errors).toEqual([]);
});
