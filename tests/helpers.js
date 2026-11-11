// Shared helpers for the Merci theme tests (phase 06).
// Target: QA_PREVIEW_URL, else the live demo https://merci-demo.myshopify.com/ (user: no staging).
// Tests only read pages and use the session cart — nothing is written to the store.
try { require('dotenv').config({ quiet: true }); } catch { /* env from dotenv-cli or shell */ }

const preview = new URL(process.env.QA_PREVIEW_URL || 'https://merci-demo.myshopify.com/');
const THEME_ID = preview.searchParams.get('preview_theme_id');

// Handles exist on merci-demo (v1 catalogue + demo-merci products).
const PAGES = {
  home: '/',
  collection: process.env.QA_COLLECTION || '/collections/all',
  product: process.env.QA_PRODUCT || '/products/' + (process.env.QA_PRODUCT_HANDLE || 'scallop-edge-laser-cut'),
  cart: '/cart',
  search: '/search?q=dress',
  blog: process.env.QA_BLOG || '/blogs/news',
  notFound: '/pages/this-page-does-not-exist-qa',
};

const SELECTORS = {
  card: 'main .card-wrapper', // header mega menus also render (hidden) cards
  // Merci card: "Add to cart +" only on single-variant products; others open quick view
  cardAddToCart: 'main .card-wrapper [data-card-add]',
  quickViewTrigger: 'main .card-wrapper [data-quick-view-trigger]',
  quickViewModal: '.quick-view-modal.is-open',
  wishlistToggle: 'main .card-wrapper [data-wishlist-toggle]',
  compareToggle: 'main .card-wrapper [data-compare-toggle]',
  productForm: '.main-product__form',
  productAddToCart: '.main-product__add-to-cart',
  variantPicker: '.main-product__options',
  price: '.main-product__price-current',
  cartDrawer: 'cart-drawer.active',
  searchToggle: '.header-search-toggle__btn',
  searchInput: '#HeaderMiddleSearchInput',
  predictiveResults: '#predictive-search-results, [data-predictive-search] [id^="predictive-search-results"]',
  popupsToClose: ['.newsletter-popup__close', '[data-cookie-accept]', '[data-sales-close]'],
};

/** Build a URL that keeps the preview theme. */
function withTheme(path) {
  if (!THEME_ID) return path;
  return path + (path.includes('?') ? '&' : '?') + 'preview_theme_id=' + THEME_ID;
}

const prepared = new WeakSet();
/** Mark the theme popups as already dismissed so they never cover the page mid-test. */
async function preparePage(page) {
  if (prepared.has(page)) return;
  prepared.add(page);
  await page.addInitScript(() => {
    try {
      localStorage.setItem('tm_newsletter_popup', JSON.stringify({ until: Date.now() + 864e8 }));
      localStorage.setItem('tm_cookie_consent', JSON.stringify({ v: 1, analytics: false, marketing: false, preferences: false, ts: Date.now() }));
      sessionStorage.setItem('tm_sales_popup_dismissed', '1');
    } catch (e) { /* storage blocked */ }
  });
}

/** Go to a page: unlock password page if needed, dismiss popups. */
async function visit(page, path) {
  await preparePage(page);
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
  // the Shopify preview bar sits over the page bottom in preview mode
  await page.addStyleTag({ content: '#preview-bar-iframe,#PBarNextFrameWrapper{display:none!important}' }).catch(() => {});
  for (const sel of SELECTORS.popupsToClose) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) await el.click().catch(() => {});
  }
}

/** Number of items in the session cart (from the Ajax API — independent of badge markup). */
async function cartCount(page) {
  return page.evaluate(() => fetch('/cart.js').then((r) => r.json()).then((c) => c.item_count));
}

/** Collect console errors + failed requests for a page. */
function watchErrors(page) {
  const errors = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    // HTTP failures are reported once, with their URL, by the response listener below
    if (/Failed to load resource/.test(m.text())) return;
    if (/shop.app/.test(m.text())) return; // Shop Pay iframe CSP — Shopify, not theme code
    errors.push('console: ' + m.text());
  });
  page.on('response', (r) => {
    if (r.status() < 400 || r.request().resourceType() === 'document') return;
    if (/monorail|analytics|shop.app|web-pixels|perf-kit/.test(r.url())) return;
    errors.push(`http ${r.status()}: ${r.url()}`);
  });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => {
    const u = r.url();
    // Ignore analytics / tracking noise and requests aborted by navigation.
    if (/monorail|analytics|facebook|google|doubleclick|shop\.app|web-pixels|perf-kit/.test(u)) return;
    if (/ERR_ABORTED/.test((r.failure() || {}).errorText || '')) return;
    errors.push('requestfailed: ' + u);
  });
  return errors;
}

module.exports = { PAGES, SELECTORS, visit, dismissPopups, watchErrors, withTheme, cartCount };
