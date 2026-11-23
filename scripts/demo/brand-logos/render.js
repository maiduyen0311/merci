// Renders logos.html → demos/merci/images/brand-*.png (transparent). node scripts/demo/brand-logos/render.js
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ deviceScaleFactor: 1 });
  await p.goto(require('url').pathToFileURL(path.join(__dirname, 'logos.html')).href);
  for (const el of await p.locator('.logo').all()) {
    const id = await el.getAttribute('id');
    await el.screenshot({ path: path.join(__dirname, '..', '..', '..', 'demos', 'merci', 'images', id + '.png'), omitBackground: true });
    console.log(id);
  }
  await b.close();
})();
