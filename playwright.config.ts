import { defineConfig } from "@playwright/test";
import {
  e2eAdminPassword,
  e2eAdminSecret,
  e2eAdminUsername,
  e2eBaseUrl,
  e2eDatabaseUrl,
  e2ePort,
} from "./test/e2e/constants";

export default defineConfig({
  testDir: "./test/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: e2eBaseUrl,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "node ./scripts/start-e2e-server.mjs",
    url: e2eBaseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      ADMIN_PASSWORD: e2eAdminPassword,
      ADMIN_SESSION_SECRET: e2eAdminSecret,
      ADMIN_USERNAME: e2eAdminUsername,
      DATABASE_URL: e2eDatabaseUrl,
      HOSTNAME: "127.0.0.1",
      NEXT_PUBLIC_SITE_URL: e2eBaseUrl,
      PORT: `${e2ePort}`,
      PRODUCTS_DATA_SOURCE: "mock",
    },
  },
});
