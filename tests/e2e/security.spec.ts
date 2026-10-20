import { test, expect } from "@playwright/test";

test.describe("authorization boundaries", () => {
  test("child data APIs require a signed-in parent", async ({ request }) => {
    expect((await request.get("/api/progress?childId=anything")).status()).toBe(401);
    expect((await request.get("/api/children")).status()).toBe(401);
    expect((await request.get("/api/parent/export")).status()).toBe(401);
  });

  test("mutations from another origin are rejected", async ({ request }) => {
    const res = await request.post("/api/auth/login", { headers: { origin: "https://evil.example" }, data: { email: "a@b.test", password: "whatever-123" } });
    expect(res.status()).toBe(403);
  });

  test("a parent cannot read another family's child", async ({ browser }) => {
    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    const a = await ctxA.newPage();
    const b = await ctxB.newPage();
    const signup = async (page: typeof a, email: string) => {
      await page.goto("/parents/signup");
      await page.getByTestId("auth-email").fill(email);
      await page.getByTestId("auth-password").fill("e2e-test-password-1");
      await page.getByTestId("auth-adult").check();
      await page.getByTestId("auth-consent").check();
      await page.getByTestId("auth-submit").click();
      await expect(page.getByTestId("parent-dashboard")).toBeVisible();
    };
    await signup(a, `fam-a-${Date.now()}@kqa.test`);
    await signup(b, `fam-b-${Date.now()}@kqa.test`);
    const created = await a.evaluate(async () => (await fetch("/api/children", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ nickname: "Private Kid" }) })).json());
    const peek = await b.evaluate(async (id) => (await fetch(`/api/progress?childId=${id}`)).status, created.id as string);
    expect(peek).toBe(404);
    await ctxA.close();
    await ctxB.close();
  });

  test("the admin area is hidden from non-admins", async ({ page }) => {
    const res = await page.goto("/admin");
    expect(res?.status()).toBe(404);
  });

  test("parent-only pages are not indexed", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /parents");
    expect(robots).toContain("Disallow: /learn");
  });
});
