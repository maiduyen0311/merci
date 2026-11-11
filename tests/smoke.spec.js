// Smoke: every main page loads, no console errors, no broken images, no horizontal overflow.
const { test, expect } = require('@playwright/test');
const { PAGES, visit, watchErrors } = require('./helpers');

for (const [name, path] of Object.entries(PAGES)) {
  test(`smoke: ${name}`, async ({ page }) => {
    const errors = watchErrors(page);
    const res = await visit(page, path);
    expect(res.status(), `${path} status`).toBe(name === 'notFound' ? 404 : 200);
    await page.waitForLoadState('load');

    // Lazy images: scroll to the bottom so they load.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
    });

    const broken = await page.$$eval('img', (imgs) =>
      imgs.filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.currentSrc || i.src));
    expect(broken, 'broken images').toEqual([]);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'horizontal overflow (px)').toBeLessThanOrEqual(1);

    expect(errors, 'console / request errors').toEqual([]);
  });
}
