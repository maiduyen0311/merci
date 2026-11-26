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

test('product: choosing another colour updates the label, the URL and the main image', async ({ page }) => {
  await visit(page, PAGES.product);
  const option = page.locator(`${S.variantPicker} .main-product__option`).filter({ has: page.locator('.is-color') }).first();
  test.skip(!(await option.count()), 'no colour option');
  const next = option.locator('.main-product__option-pill:not(.is-selected):not(.is-disabled)').first();
  test.skip(!(await next.count()), 'no other available colour');
  const value = await next.locator('input').getAttribute('value');
  const urlBefore = page.url();
  const mainImage = page.locator('[id^="MainProductImage-"]').first();
  const srcBefore = await mainImage.getAttribute('src');
  await next.click();
  await expect(option.locator('[data-selected-value]')).toHaveText(value);
  await expect.poll(() => page.url()).not.toBe(urlBefore);
  // user 2026-11-18: every colour has its own photo, so the gallery must change
  await expect.poll(() => mainImage.getAttribute('src')).not.toBe(srcBefore);
});

test('collection: Merci card hover shows the action strip', async ({ page, isMobile }) => {
  test.skip(isMobile, 'touch devices show the add link under the price instead');
  await visit(page, PAGES.collection);
  const card = page.locator(S.card).first();
  await card.hover();
  await expect(card.locator('.mc-card__strip')).toBeVisible();
});

test('collection: hover box reads "Add to cart" for single-variant / colour-only products, "Select options" otherwise', async ({ page, isMobile }) => {
  test.skip(isMobile, 'touch devices only show the wishlist heart on the image');
  await visit(page, PAGES.collection);
  const labels = page.locator('main .card-wrapper--merci .mc-card__strip-label');
  await expect(labels.first()).toBeAttached();

  // markup contract: add button ↔ "Add to cart", quick view ↔ "Select options"
  for (const el of await labels.all()) {
    const text = ((await el.textContent()) || '').trim().toLowerCase();
    // pre-order products (Nhóm 3 #10) read "Pre-order" instead of "Add to cart"
    const preorder = (await el.locator('xpath=ancestor::*[contains(@class,"card-wrapper")]//*[contains(@class,"badge--preorder")]').count()) > 0;
    if ((await el.getAttribute('data-card-add')) || (await el.getAttribute('data-quick-color-add')) !== null) expect(text).toBe(preorder ? 'pre-order' : 'add to cart');
    else if ((await el.getAttribute('data-quick-view-trigger')) !== null) expect(text).toBe('select options');
  }

  // data contract on two real products: variant count decides the label
  const cards = page.locator('main .card-wrapper--merci');
  for (let i = 0; i < Math.min(2, await cards.count()); i++) {
    const card = cards.nth(i);
    const href = await card.locator('a[href*="/products/"]').first().getAttribute('href');
    const product = await page.evaluate(async (u) => (await fetch(u.split('?')[0] + '.js')).json(), href);
    const label = ((await card.locator('.mc-card__strip-label').textContent()) || '').trim().toLowerCase();
    const preorder = (await card.locator('.badge--preorder').count()) > 0;
    // single variant, or colour is the only option (quick add, theme setting card_quick_add) → Add to cart
    const single = product.variants.length === 1 || (product.options.length === 1 && /^colou?r$/i.test(product.options[0].name || product.options[0]));
    if (!product.available) expect(label).toBe('sold out');
    else expect(label).toBe(single ? (preorder ? 'pre-order' : 'add to cart') : 'select options');
  }
});

test('collection: quick view opens and closes with Escape', async ({ page }) => {
  await visit(page, PAGES.collection);
  // visible one: the hover box on desktop, the "Select options +" link on touch screens
  const trigger = page.locator(S.quickViewTrigger + ':visible').first();
  test.skip(!(await trigger.count()), 'no quick view');
  // centre it first (a forced click at the bottom of a phone screen would hit the fixed bottom bar),
  // then hover the card so the desktop hover box is open
  await trigger.evaluate((el) => el.scrollIntoView({ block: 'center' }));
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

// Nhóm 3 #9 — search suggestions (Theme settings → Search behavior)
test('search suggestions: empty box shows popular terms + products; a used term becomes a recent search', async ({ page }) => {
  await visit(page, PAGES.home);
  const desktop = page.viewportSize().width >= 992;
  if (desktop) await page.locator(S.searchToggle).first().click();
  else await page.locator('[data-mobile-search-open]').filter({ visible: true }).first().click();
  const scope = page.locator(desktop ? '.header-middle__search' : '#MobileSearch');
  const input = scope.locator('input[type="search"]');
  await input.click();
  const panel = scope.locator('[data-search-discovery]');
  await expect(panel).toBeVisible();
  const chip = panel.locator('.search-discovery__chip').first();
  test.skip(!(await chip.count()), 'no popular terms set');
  const term = (await chip.getAttribute('data-search-term')) || '';
  await chip.click();
  await page.waitForURL(/\/search\?/);
  const recent = await page.evaluate(() => JSON.parse(localStorage.getItem('mc_recent_searches') || '[]'));
  expect(recent[0]).toBe(term);
});

test('search page: no results suggests popular terms / products', async ({ page }) => {
  await visit(page, '/search?q=xyzzyplugh7741'); // typo-tolerant search: a nonsense word + digits matches nothing
  const panel = page.locator('main .search-discovery--no-results');
  test.skip(!(await panel.count()), 'search suggestions are turned off');
  await expect(panel).toContainText(/no results/i);
  expect(await panel.locator('.search-discovery__chip, .search-discovery__product').count()).toBeGreaterThan(0);
});

// Nhóm 3 #12 — announcement bar (rotating messages + countdown)
test('announcement bar: messages rotate and the countdown ticks', async ({ page }) => {
  await visit(page, PAGES.home);
  const bar = page.locator('[data-announcement-bar]').first();
  test.skip(!(await bar.count()), 'no announcement bar');
  await expect(bar).toBeVisible();
  const active = bar.locator('.mc-announce__item.is-active');
  await expect(active).toHaveCount(1);
  const next = bar.locator('[data-announce-next]');
  test.skip(!(await next.count()), 'single message');
  const first = await active.innerText();
  await next.click();
  await expect.poll(() => active.innerText()).not.toBe(first);
  const timer = bar.locator('[data-announce-timer]').filter({ hasText: /\d{2}:\d{2}:\d{2}/ }).first();
  if (await timer.count()) {
    const t1 = await timer.innerText();
    await expect.poll(() => timer.innerText(), { timeout: 3000 }).not.toBe(t1);
  }
});

// Nhóm 3 #10 — pre-order (demo: Cable Knit Cardigan in Sage = stock 0 + continue selling)
test('pre-order: the variant switches the button, the note and the order line property', async ({ page }) => {
  await visit(page, '/products/cable-knit-cardigan');
  const note = page.locator('[data-preorder-note]');
  test.skip(!(await note.count()), 'no pre-order variants on this product');
  const sage = page.locator('.main-product__option-pill', { has: page.locator('input[value="Sage"]') }).first();
  test.skip(!(await sage.count()), 'no Sage colour');
  const label = page.locator('.main-product__add-to-cart [data-add-text]');
  await sage.click();
  await expect(note).toBeVisible();
  await expect(label).toHaveText(/pre-?order/i);
  await expect(page.locator('[data-preorder-prop]')).toBeEnabled();
  await expect(page.locator('[data-preorder-hide]')).toBeHidden();
  // back to an in-stock colour → normal add to cart again
  const other = page.locator('.main-product__option').filter({ has: page.locator('.is-color') })
    .locator('.main-product__option-pill:not(.is-disabled)').filter({ hasNot: page.locator('input[value="Sage"]') }).first();
  await expect(other).toHaveCount(1);
  await other.click();
  await expect(note).toBeHidden();
  await expect(label).not.toHaveText(/pre-?order/i);
  await expect(page.locator('[data-preorder-prop]')).toBeDisabled();
  await expect(page.locator('[data-preorder-hide]')).toBeVisible();
});
