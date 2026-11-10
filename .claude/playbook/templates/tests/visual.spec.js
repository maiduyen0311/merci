// Visual regression. Take the baseline only after the user approved the design:
//   npm run qa:visual:update
// Dynamic parts (countdowns, sales popups, carousels autoplay) are masked / frozen.
const { test, expect } = require('@playwright/test');
const { PAGES, visit } = require('./helpers');

const MASK = ['[data-countdown]', '.sales-popup', '.flash-deals__timer', 'iframe', 'video'];

for (const name of ['home', 'collection', 'product', 'cart']) {
  test(`visual: ${name}`, async ({ page }) => {
    await visit(page, PAGES[name]);
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({ content: '*{animation:none!important;transition:none!important;caret-color:transparent!important}' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: MASK.map((s) => page.locator(s)),
    });
  });
}
