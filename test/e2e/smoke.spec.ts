import { expect, test } from "@playwright/test";
import { e2eAdminPassword, e2eAdminUsername } from "./constants";

test("root request resolves to a localized storefront page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("body")).toContainText(/Ventolivo/i);
});

test("health endpoint reports the application as healthy", async ({ request }) => {
  const response = await request.get("/api/health", {
    headers: {
      "x-request-id": "health-smoke-test",
    },
  });

  expect(response.ok()).toBeTruthy();

  const payload = (await response.json()) as {
    status: string;
    checks: Array<{ name: string; status: string }>;
  };

  expect(payload.status).toBe("ok");
  expect(payload.checks).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: "database",
        status: "ok",
      }),
    ]),
  );
});

test("product endpoint responds successfully", async ({ request }) => {
  const response = await request.get("/api/products", {
    headers: {
      "x-request-id": "products-smoke-test",
    },
  });

  expect(response.ok()).toBeTruthy();
});

test("anonymous admin access redirects to login", async ({ page }) => {
  await page.goto("/en/admin");

  await expect(page).toHaveURL(/\/en\/admin\/login\?next=%2Fen%2Fadmin$/);
  await expect(page.locator('input[name="username"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
});

test("bootstrap admin login lands on the dashboard", async ({ page }) => {
  await page.goto("/en/admin/login");
  await page.locator('input[name="username"]').fill(e2eAdminUsername);
  await page.locator('input[name="password"]').fill(e2eAdminPassword);
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/en\/admin$/);
  await expect(page.locator("body")).toContainText(/admin/i);
});

test("authenticated translation requests reject invalid payloads", async ({ page }) => {
  await page.goto("/en/admin/login");
  await page.locator('input[name="username"]').fill(e2eAdminUsername);
  await page.locator('input[name="password"]').fill(e2eAdminPassword);
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/en\/admin$/);

  const endpoint = "/api/admin/translate-product";
  const requestBody = {
    sourceLocale: "",
    targetLocales: [],
    fields: {},
  };

  const sendTranslationRequest = () =>
    page.evaluate(
      async ({ targetEndpoint, body }) => {
        const response = await fetch(targetEndpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": "203.0.113.10",
          },
          body: JSON.stringify(body),
        });

        return {
          retryAfter: response.headers.get("retry-after"),
          status: response.status,
          xRateLimitLimit: response.headers.get("x-rate-limit-limit"),
          xRateLimitRemaining: response.headers.get("x-rate-limit-remaining"),
        };
      },
      {
        targetEndpoint: endpoint,
        body: requestBody,
      },
    );

  const response = await sendTranslationRequest();

  expect(response.status).toBe(400);
});
