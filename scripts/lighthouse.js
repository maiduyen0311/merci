#!/usr/bin/env node
// Lighthouse on home / collection / product, mobile + desktop. Writes qa/lighthouse-<date>.json and fails under thresholds.
// Usage: node scripts/lighthouse.js  (needs: npm i -D lighthouse chrome-launcher)
try { require('dotenv').config({ quiet: true }); } catch { /* env from dotenv-cli or shell */ }
const fs = require('fs');
const path = require('path');

const THRESHOLDS = { performance: 60, accessibility: 90, 'best-practices': 90, seo: 90 };

(async () => {
  const { default: lighthouse } = await import('lighthouse');
  const chromeLauncher = await import('chrome-launcher');
  const preview = new URL(process.env.QA_PREVIEW_URL || 'https://merci-demo.myshopify.com/');
  const themeId = preview.searchParams.get('preview_theme_id');
  const pages = {
    home: '/',
    collection: process.env.QA_COLLECTION || '/collections/all',
    product: process.env.QA_PRODUCT || '/products/' + (process.env.QA_PRODUCT_HANDLE || 'scallop-edge-laser-cut'),
  };
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
  const out = { date: new Date().toISOString(), base: preview.origin, themeId, results: [] };
  let failed = false;

  for (const formFactor of ['mobile', 'desktop']) {
    for (const [name, p] of Object.entries(pages)) {
      const url = preview.origin + p + (themeId ? (p.includes('?') ? '&' : '?') + 'preview_theme_id=' + themeId : '');
      const config = formFactor === 'desktop'
        ? { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttlingMethod: 'simulate' } }
        : undefined;
      const { lhr } = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error' }, config);
      const scores = Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
      const below = Object.entries(THRESHOLDS).filter(([k, min]) => scores[k] < min).map(([k]) => k);
      if (below.length) failed = true;
      out.results.push({ formFactor, name, url, scores, below });
      console.log(`${formFactor.padEnd(7)} ${name.padEnd(10)} ${JSON.stringify(scores)}${below.length ? '  ✗ ' + below.join(',') : ''}`);
    }
  }
  await chrome.kill();
  fs.mkdirSync('qa', { recursive: true });
  const file = path.join('qa', `lighthouse-${out.date.slice(0, 10)}.json`);
  fs.writeFileSync(file, JSON.stringify(out, null, 2));
  console.log('→ ' + file);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
