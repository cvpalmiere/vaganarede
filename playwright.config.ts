import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: "html",
  timeout: 45000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 20000,
    "x-e2e-bypass": process.env.E2E_BYPASS_KEY || "",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
