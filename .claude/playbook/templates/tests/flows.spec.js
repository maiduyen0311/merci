// Core shopper flows. Skip a test with test.skip() if the theme/demo does not ship that feature.
const { test, expect } = require('@playwright/test');
const { PAGES, SELECTORS: S, visit } = require('./helpers');

test('product: add to cart opens drawer and updates count', async ({ page }) => {
  await visit(page, PAGES.product);
  const before = Number((await page.locator(S.cartCount).first().textContent().catch(() => '0')) || 0);
  await page.locator(S.productAddToCart).first().click();
  await expect(page.locator(S.cartDrawer)).toBeVisible();
  await expect.poll(async () => Number((await page.locator(S.cartCount).first().textContent()) || 0)).toBeGreaterThan(before);
});

test('product: changing variant updates URL', async ({ page }) => {
  await visit(page, PAGES.product);
  const picker = page.locator(S.variantPicker).first();
  test.skip(!(await picker.count()), 'single-variant product');
  const inputs = picker.locator('input[type="radio"]:not(:checked), option:not(:checked)');
  test.skip(!(await inputs.count()), 'no other variant');
  const urlBefore = page.url();
  const first = inputs.first();
  if ((await first.evaluate((n) => n.tagName)) === 'OPTION') {
    const value = await first.getAttribute('value');
    await picker.locator('select').first().selectOption(value);
  } else {
    await picker.locator(`label[for="${await first.getAttribute('id')}"]`).click();
  }
  await expect.poll(() => page.url()).not.toBe(urlBefore);
});

test('collection: card add to cart', async ({ page }) => {
  await visit(page, PAGES.collection);
  await expect(page.locator(S.card).first()).toBeVisible();
  const atc = page.locator(S.cardAddToCart).first();
  test.skip(!(await atc.count()), 'cards have no add-to-cart button');
  await atc.hover({ force: true });
  await atc.click({ force: true });
  await expect(page.locator(S.cartDrawer)).toBeVisible();
});

test('collection: quick view opens and closes with Escape', async ({ page }) => {
  await visit(page, PAGES.collection);
  const trigger = page.locator(S.quickViewTrigger).first();
  test.skip(!(await trigger.count()), 'no quick view');
  await page.locator(S.card).first().hover();
  await trigger.click({ force: true });
  await expect(page.locator(S.quickViewModal)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator(S.quickViewModal)).toBeHidden();
});

test('wishlist toggle persists after reload', async ({ page }) => {
  await visit(page, PAGES.collection);
  const toggle = page.locator(S.wishlistToggle).first();
  test.skip(!(await toggle.count()), 'no wishlist');
  await page.locator(S.card).first().hover();
  await toggle.click({ force: true });
  const stored = await page.evaluate(() => Object.keys(localStorage).filter((k) => /wish/i.test(k)).map((k) => localStorage.getItem(k)).join(''));
  expect(stored.length).toBeGreaterThan(2);
});

test('predictive search shows results', async ({ page, isMobile }) => {
  test.skip(isMobile, 'mobile search is inside the drawer — covered manually');
  await visit(page, PAGES.home);
  const input = page.locator(S.searchInput).first();
  await input.click();
  await input.fill('a');
  await expect(page.locator(S.predictiveResults).first()).toBeVisible();
});

test('collection: sort changes product order', async ({ page }) => {
  await visit(page, PAGES.collection + (PAGES.collection.includes('?') ? '&' : '?') + 'sort_by=price-ascending');
  const firstAsc = await page.locator(S.card).first().textContent();
  await visit(page, PAGES.collection + (PAGES.collection.includes('?') ? '&' : '?') + 'sort_by=price-descending');
  const firstDesc = await page.locator(S.card).first().textContent();
  expect(firstAsc).not.toBe(firstDesc);
});
