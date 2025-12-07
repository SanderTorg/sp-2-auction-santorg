import { test, expect } from "@playwright/test";

test("Navigation to home page, waits for listings to load, click a listing then verify details page", async ({
  page,
}) => {
  const listingsRespPromise = page.waitForResponse(
    (r) =>
      r.url().includes("/auction/listings") &&
      r.request().method() === "GET" &&
      r.status() === 200
  );
  await page.goto("/");
  await expect(page).toHaveURL("/");
  await listingsRespPromise;

  const cards = page.locator("a[href^='/listing/']");
  await expect(cards.first()).toBeVisible({ timeout: 15000 });

  await cards.first().click();
  await expect(page).toHaveURL(/\/listing\//);
  await expect(page.locator("h1")).toBeVisible();
});
