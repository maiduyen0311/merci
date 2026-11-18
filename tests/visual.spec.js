// Visual regression. Take the baseline only after the user approved the design:
//   npm run qa:visual:update
// Dynamic parts (countdowns, sales popups, carousels autoplay) are masked / frozen.
const { test, expect } = require('@playwright/test');
const { PAGES, visit } = require('./helpers');

const MASK = ['[data-countdown]', '.sales-popup', '.flash-deals__timer', 'iframe', 'video', '.mc-slideshow', '.mc-pdp__timer', 'cart-drawer'];

for (const name of ['home', 'collection', 'product', 'cart']) {
  test(`visual: ${name}`, async ({ page }) => {
    await visit(page, PAGES[name]);
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({ content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}' });
    await page.evaluate(async () => {
      // full-page capture renders rows the viewport never scrolled to → load every image now
      document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    // lazy images below the fold must have finished, or the baseline differs run to run
    // (scrolling starts new requests → wait for the network again, then decode every image so a
    // late srcset swap or fade-in on the last row cannot land between baseline and run)
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20_000 }).catch(() => {});
    // decode() never settles for a lazy image the browser has not fetched (hidden menus, drawers) → cap each wait
    await page.evaluate(() => Promise.all([...document.images].map((i) => Promise.race([
      i.decode ? i.decode().catch(() => {}) : null,
      new Promise((r) => setTimeout(r, 3000)),
    ]))));
    await page.waitForTimeout(800);
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: MASK.map((s) => page.locator(s)),
    });
  });
}
