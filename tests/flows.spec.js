// Core shopper flows on the Merci markup. Session cart only — nothing is written to the store.
const { test, expect } = require('@playwright/test');
const { PAGES, SELECTORS: S, visit, cartCount } = require('./helpers');

test('product: add to cart opens the drawer and fills the cart', async ({ page }) => {
  await visit(page, PAGES.product);
  const before = await cartCount(page);
  await page.locator(S.productAddToCart).first().click();
  await expect(page.locator(S.cartDrawer)).toBeVisible();
  await expect.poll(() => cartCount(page)).toBeGreaterThan(before);
});

test('product: choosing another colour updates the selected label and the URL', async ({ page }) => {
  await visit(page, PAGES.product);
  const option = page.locator(`${S.variantPicker} .main-product__option`).filter({ has: page.locator('.is-color') }).first();
  test.skip(!(await option.count()), 'no colour option');
  const next = option.locator('.main-product__option-pill:not(.is-selected):not(.is-disabled)').first();
  test.skip(!(await next.count()), 'no other available colour');
  const value = await next.locator('input').getAttribute('value');
  const urlBefore = page.url();
  await next.click();
  await expect(option.locator('[data-selected-value]')).toHaveText(value);
  await expect.poll(() => page.url()).not.toBe(urlBefore);
});

test('collection: Merci card hover shows the action strip', async ({ page, isMobile }) => {
  test.skip(isMobile, 'touch devices show the add link under the price instead');
  await visit(page, PAGES.collection);
  const card = page.locator(S.card).first();
  await card.hover();
  await expect(card.locator('.mc-card__strip')).toBeVisible();
});

test('collection: quick view opens and closes with Escape', async ({ page }) => {
  await visit(page, PAGES.collection);
  // visible one: the strip button on desktop, the "Choose options +" link on touch screens
  const trigger = page.locator(S.quickViewTrigger + ':visible').first();
  test.skip(!(await trigger.count()), 'no quick view');
  await page.locator(S.card).first().hover().catch(() => {});
  await trigger.click({ force: true });
  await expect(page.locator(S.quickViewModal)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator(S.quickViewModal)).toHaveCount(0);
});

test('wishlist toggle is stored on the device', async ({ page }) => {
  await visit(page, PAGES.collection);
  const toggle = page.locator(S.wishlistToggle + ':visible').first();
  test.skip(!(await toggle.count()), 'no wishlist');
  await page.locator(S.card).first().hover().catch(() => {});
  await toggle.click({ force: true });
  await expect.poll(() => page.evaluate(() => localStorage.getItem('merci:wishlist') || '')).toMatch(/\w/);
});

test('predictive search shows results', async ({ page }) => {
  test.skip(page.viewportSize().width < 992, 'below 992px the mobile header search is used — covered manually');
  await visit(page, PAGES.home);
  await page.locator(S.searchToggle).first().click();
  const input = page.locator(S.searchInput).first();
  await input.fill('dress');
  await expect(page.locator(S.predictiveResults).first()).toBeVisible();
});

test('collection: sort changes product order', async ({ page }) => {
  const sep = PAGES.collection.includes('?') ? '&' : '?';
  await visit(page, PAGES.collection + sep + 'sort_by=price-ascending');
  const firstAsc = await page.locator(S.card).first().textContent();
  await visit(page, PAGES.collection + sep + 'sort_by=price-descending');
  const firstDesc = await page.locator(S.card).first().textContent();
  expect(firstAsc).not.toBe(firstDesc);
});

test('collection: pagination reaches page 2', async ({ page }) => {
  await visit(page, PAGES.collection);
  const next = page.locator('.pagination__item--prev').first(); // Dawn names the "next" arrow --prev
  test.skip(!(await next.count()), 'single page');
  await next.click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator(S.card).first()).toBeVisible();
});
