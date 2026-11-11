// Playwright config for Shopify theme QA (phase 06).
// BASE_URL: QA_PREVIEW_URL (https://<qa-store>.myshopify.com/?preview_theme_id=<id>) or local `npm run dev`.
try { require('dotenv').config({ quiet: true }); } catch { /* env from dotenv-cli or shell */ }
const { defineConfig, devices } = require('@playwright/test');

// Merci: no staging — tests run read-only against the live demo unless QA_PREVIEW_URL is set
const preview = process.env.QA_PREVIEW_URL || 'https://merci-demo.myshopify.com/';
const url = new URL(preview);

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000, toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
  fullyParallel: true,
  workers: 3, // the storefront rate-limits bursts (403 local_rate_limited)
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { outputFolder: 'qa/playwright-report', open: 'never' }]],
  use: {
    baseURL: url.origin,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 768, height: 1024 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome', viewport: { width: 390, height: 844 } } },
  ],
});
