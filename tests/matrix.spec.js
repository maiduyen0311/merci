// Test matrix (phase 06 §3) — the parts that can run read-only against the live demo:
// every inner page / empty state on 3 viewports, plus keyboard & focus behaviour.
// Theme Editor, Safari/iOS, checkout and edge-case catalogue data stay manual (qa/REPORT-*.md).
const { test, expect } = require('@playwright/test');
const { visit, watchErrors } = require('./helpers');

const PAGES = {
  'list-collections': '/collections',
  'collection page 2': '/collections/all?page=2',
  'single-variant product': '/products/leather-mini-backpack',
  about: '/pages/about-us',
  contact: '/pages/contact-us',
  faq: '/pages/faq',
  lookbook: '/pages/lookbook',
  wishlist: '/pages/wishlist',
  compare: '/pages/compare',
  article: '/blogs/news/winter-2019-2020-trends',
  login: '/account/login',
  register: '/account/register',
  'search: no results': '/search?q=zzqqxxnothing',
};

for (const [name, path] of Object.entries(PAGES)) {
  test(`page: ${name}`, async ({ page }) => {
    const errors = watchErrors(page);
    const res = await visit(page, path);
    expect(res.status(), `${path} status`).toBe(200);
    await page.waitForLoadState('load');
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
    });
    const broken = await page.$$eval('img', (imgs) =>
      imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.currentSrc || i.src));
    expect(broken, 'broken images').toEqual([]);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'horizontal overflow (px)').toBeLessThanOrEqual(1);
    await expect(page.locator('main h1, main .h1').first(), 'page has a title').toBeAttached();
    expect(errors, 'console / request errors').toEqual([]);
  });
}

test('empty state: cart page', async ({ page }) => {
  await visit(page, '/cart');
  await expect(page.locator('main')).toContainText(/cart is empty/i);
  await expect(page.locator('main a[href*="/collections"]').first()).toBeVisible();
});

test('empty state: search with no results says so', async ({ page }) => {
  await visit(page, PAGES['search: no results']);
  await expect(page.locator('main')).toContainText(/no results|0 results|not find|no products/i);
});

// --- keyboard & focus -------------------------------------------------------------------------
test('keyboard: Tab shows a visible focus ring', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard checks run on desktop/tablet');
  await visit(page, '/');
  let checked = 0;
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const ring = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return null; // skip links etc. that are off-screen until focused
      const cs = getComputedStyle(el);
      return { tag: el.tagName, visible: (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none' };
    });
    if (!ring) continue;
    checked++;
    expect(ring.visible, `focus ring on ${ring.tag} (tab #${i + 1})`).toBe(true);
  }
  expect(checked, 'focusable elements reached').toBeGreaterThan(3);
});

test('keyboard: mega menu opens on focus and its links are reachable', async ({ page, viewport }) => {
  test.skip(viewport.width < 992, 'inline navigation is desktop only');
  await visit(page, '/');
  const item = page.locator('.header-inline-nav__item.is-mega').first();
  await item.locator('> a').focus();
  const panel = item.locator('.header-inline-nav__dropdown');
  await expect(panel).toBeVisible();
  await page.keyboard.press('Tab');
  const inside = await item.evaluate((li) => li.contains(document.activeElement));
  expect(inside, 'Tab moves into the mega panel').toBe(true);
});

test('keyboard: cart drawer opens, closes with Escape', async ({ page, viewport }) => {
  test.skip(viewport.width < 992, 'desktop header cart icon');
  await visit(page, '/');
  await page.locator('[data-cart-drawer-toggle]:visible').first().click();
  const drawer = page.locator('cart-drawer.active');
  await expect(drawer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
});

test('keyboard: mobile menu drawer opens, closes with Escape', async ({ page, viewport }) => {
  test.skip(viewport.width >= 992, 'mobile header only');
  await visit(page, '/');
  const toggle = page.locator('.header-mobile__menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#MobileDrawer')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
