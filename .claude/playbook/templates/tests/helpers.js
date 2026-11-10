// Shared helpers for theme tests. Adjust SELECTORS to the theme's markup (prefer data-* attributes).
try { require('dotenv').config({ quiet: true }); } catch { /* env from dotenv-cli or shell */ }

const preview = new URL(process.env.QA_PREVIEW_URL || 'http://127.0.0.1:9293/');
const THEME_ID = preview.searchParams.get('preview_theme_id');

// Pages every theme must render. Handles must exist on the QA store (demo content).
const PAGES = {
  home: '/',
  collection: process.env.QA_COLLECTION || '/collections/all',
  product: process.env.QA_PRODUCT || '/products/' + (process.env.QA_PRODUCT_HANDLE || 'demo-product'),
  cart: '/cart',
  search: '/search?q=a',
  blog: process.env.QA_BLOG || '/blogs/news',
  notFound: '/pages/this-page-does-not-exist-qa',
};

const SELECTORS = {
  card: '.card-product',
  cardAddToCart: '.card-product [name="add"]',
  quickViewTrigger: '[data-quick-view-trigger]',
  quickViewModal: '.quick-view-modal',
  wishlistToggle: '[data-wishlist-toggle]',
  compareToggle: '[data-compare-toggle]',
  productForm: 'product-form form, form[action*="/cart/add"]',
  productAddToCart: 'product-form [name="add"], form[action*="/cart/add"] [name="add"]',
  variantPicker: 'variant-selects, variant-radios, [data-variant-picker]',
  price: '.price, [data-price]',
  cartDrawer: 'cart-drawer',
  cartCount: '.cart-count-bubble, [data-cart-count]',
  searchInput: 'predictive-search input[type="search"]',
  predictiveResults: 'predictive-search [id^="predictive-search-results"]',
  popupsToClose: ['.newsletter-popup [data-close]', '.cookie-consent [data-accept]', '.sales-popup [data-close]'],
};

/** Build a URL that keeps the preview theme. */
function withTheme(path) {
  if (!THEME_ID) return path;
  return path + (path.includes('?') ? '&' : '?') + 'preview_theme_id=' + THEME_ID;
}

/** Go to a page: unlock password page if needed, dismiss popups. */
async function visit(page, path) {
  const res = await page.goto(withTheme(path), { waitUntil: 'domcontentloaded' });
  if (page.url().includes('/password') && process.env.QA_STOREFRONT_PASSWORD) {
    await page.fill('input[type="password"]', process.env.QA_STOREFRONT_PASSWORD);
    await page.keyboard.press('Enter');
    await page.waitForLoadState('domcontentloaded');
    return visit(page, path);
  }
  await dismissPopups(page);
  return res;
}

async function dismissPopups(page) {
  for (const sel of SELECTORS.popupsToClose) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) await el.click().catch(() => {});
  }
}

/** Collect console errors + failed requests for a page. */
function watchErrors(page) {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => {
    const u = r.url();
    // Ignore analytics / tracking noise.
    if (!/monorail|analytics|facebook|google|doubleclick|shop\.app/.test(u)) errors.push('requestfailed: ' + u);
  });
  return errors;
}

module.exports = { PAGES, SELECTORS, visit, dismissPopups, watchErrors, withTheme };
