import { test, expect } from "@playwright/test";

test.describe("Login testing with a valid user and not a valid user", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("User can log in successfully", async ({ page }) => {
    await expect(page).toHaveURL("/login");

    const validEmail = process.env.USER_EMAIL;
    const validPassword = process.env.USER_PASSWORD;

    expect(validEmail, "USER_EMAIL env var is not defined").toBeDefined();
    expect(validPassword, "USER_PASSWORD env var is not defined").toBeDefined();

    await page.fill('form#js-login-form input[name="email"]', validEmail!);
    await page.fill(
      'form#js-login-form input[name="password"]',
      validPassword!
    );

    await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/auth/login") &&
          resp.request().method() === "POST" &&
          resp.status() === 200
      ),
      page.click('button[type="submit"]'),
    ]);

    await expect(page).toHaveURL("/");

    const homePageHeader = page.locator(
      'h1:has-text("Welcome to the auction house")'
    );
    await expect(homePageHeader).toBeVisible({ timeout: 10000 });
  });

  test("user cannot log in with invalid credentials", async ({ page }) => {
    await expect(page).toHaveURL("/login");

    await page.fill(
      'form#js-login-form input[name="email"]',
      "invalid_email@stud.noroff.no"
    );
    await page.fill(
      'form#js-login-form input[name="password"]',
      "invalid_password"
    );

    await page.click('form#js-login-form button[type="submit"]');

    await expect(page).toHaveURL("/login");

    const alert = page.locator("#js-show-error");
    await expect(alert).toBeVisible();
    await expect(alert).not.toHaveText("");
  });
});
