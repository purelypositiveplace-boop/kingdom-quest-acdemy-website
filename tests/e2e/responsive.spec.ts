import { test, expect } from "@playwright/test";
import { trackErrors } from "./helpers";

const PAGES = ["/", "/stories", "/games", "/world", "/world/creation-garden", "/lessons/creation", "/verses", "/bible", "/bible/john/3", "/prayer", "/map", "/timeline", "/characters/david", "/music", "/printables/david-maze", "/parents", "/search", "/rewards", "/values/being-kind", "/jesus", "/about"];

test("key pages load without errors, overflow, broken images or tiny targets", async ({ page }) => {
  const errors = trackErrors(page);
  for (const path of PAGES) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBeLessThan(400);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${path} horizontal overflow`).toBeLessThanOrEqual(1);
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
    expect(broken, `${path} broken images`).toEqual([]);
    const tiny = await page.evaluate(() =>
      [...document.querySelectorAll("main button, main a")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const inline = getComputedStyle(el).display === "inline";
          return r.width > 0 && !inline && !el.closest(".scripture") && (r.height < 24 || r.width < 24);
        })
        .map((el) => (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)),
    );
    expect(tiny, `${path} small tap targets`).toEqual([]);
    expect(errors, `${path} page errors`).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("keyboard users can reach the main action", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});
