import { test, expect } from "@playwright/test";
import { trackErrors } from "./helpers";

test("Noah's Ark Animal Match can be won and is recorded", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/games/ark-match");
  await page.getByTestId("game-start").click();
  const cards = page.getByTestId("memory-card");
  await expect(cards.first()).toBeVisible();
  const pairs = await cards.evaluateAll((els) => els.map((e) => e.getAttribute("data-pair")!));
  const done = new Set<string>();
  for (let i = 0; i < pairs.length; i++) {
    if (done.has(pairs[i])) continue;
    const j = pairs.findIndex((p, k) => k !== i && p === pairs[i]);
    await cards.nth(i).click();
    await cards.nth(j).click();
    done.add(pairs[i]);
    await page.waitForTimeout(150);
  }
  await expect(page.getByTestId("game-complete")).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("kqa-v1") ?? "{}").state?.progress?.games?.["ark-match"]);
  expect(stored.wins).toBe(1);
  expect(errors).toEqual([]);
});

test("Bible Books Order: the first five books", async ({ page }) => {
  await page.goto("/games/books-order");
  await page.getByTestId("game-start").click();
  await page.getByTestId("mode-law").click();
  for (const b of ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"]) await page.getByTestId("seq-item").filter({ hasText: new RegExp(`^${b}$`) }).click();
  await expect(page.getByTestId("game-complete")).toBeVisible();
});

test("every game opens and starts without crashing", async ({ page }) => {
  const errors = trackErrors(page);
  const ids = ["ark-match", "memory-match", "creation-sort", "commandments-match", "fruit-garden", "books-order", "guess-who", "word-search", "crossword", "trivia", "verse-builder", "parable-puzzle", "kindness-quest", "jonah-ocean", "map-hunt", "armor-of-god"];
  for (const id of ids) {
    await page.goto(`/games/${id}`);
    await page.getByTestId("game-start").click();
    await expect(page.getByRole("button", { name: "Pause game" })).toBeVisible();
    await page.waitForTimeout(300);
    await expect(page.getByText("tripped over its shoelaces")).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});
