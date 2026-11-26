// Shoppable video reels — DEMO-ONLY section (sections/mc-video-reels.liquid, not packaged; see
// .claude/memory/packaging-scope.md). Session cart only — nothing is written to the store.
const { test, expect } = require('@playwright/test');
const { PAGES, visit, cartCount } = require('./helpers');

test('reels: cards play muted clips and the viewer adds a product to the cart', async ({ page }) => {
  await visit(page, PAGES.home);
  const section = page.locator('[data-video-reels]').first();
  test.skip(!(await section.count()), 'no reels section on the homepage');
  await section.scrollIntoViewIfNeeded();

  const card = section.locator('[data-reel]').filter({ visible: true }).first();
  const video = card.locator('video');
  await expect(video).toHaveCount(1);
  expect(await video.evaluate((v) => v.muted)).toBe(true);
  await expect.poll(() => video.evaluate((v) => !v.paused), { timeout: 15000 }).toBe(true);

  await card.locator('.mc-reel__open').click();
  const viewer = section.locator('[data-reel-viewer]');
  await expect(viewer).toBeVisible();
  await expect(viewer.locator('[data-reel-stage] video')).toHaveCount(1);
  const items = viewer.locator('.mc-reels-viewer__item');
  expect(await items.count()).toBeGreaterThan(0);

  // next clip swaps the product list
  const firstName = await items.first().locator('.mc-reels-viewer__name').textContent();
  const next = viewer.locator('[data-reel-next]');
  if (await next.isVisible()) await next.click();
  else await page.keyboard.press('ArrowRight'); // phones: arrows hidden (swipe / keys)
  await expect.poll(() => items.first().locator('.mc-reels-viewer__name').textContent()).not.toBe(firstName);

  const before = await cartCount(page);
  await viewer.locator('[data-reel-add]').first().click();
  await expect(viewer).toBeHidden();
  await expect.poll(() => cartCount(page)).toBeGreaterThan(before);
});

test('reels: Escape closes the viewer', async ({ page }) => {
  await visit(page, PAGES.home);
  const section = page.locator('[data-video-reels]').first();
  test.skip(!(await section.count()), 'no reels section on the homepage');
  await section.scrollIntoViewIfNeeded();
  await section.locator('[data-reel-open].mc-reel__shop').filter({ visible: true }).first().click();
  const viewer = section.locator('[data-reel-viewer]');
  await expect(viewer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();
});
