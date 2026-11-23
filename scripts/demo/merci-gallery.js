#!/usr/bin/env node
/**
 * Merci demo — extra gallery views per product (user 2026-11-23: more images for the PDP thumbnails).
 *
 *   node scripts/demo/merci-gallery.js            every product of merci-catalogue.js
 *   node scripts/demo/merci-gallery.js <handle>…  only these
 *
 * From the first colour's cut-out it draws, in headless Chrome (no image library):
 *   <handle>-studio.jpg  product on a soft tinted backdrop with a floor shadow
 *   <handle>-detail.jpg  close-up of the product body (texture / finish) on warm white
 * Output: demos/merci/images/gallery/. The catalogue adds them after the colour photos.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const catalogue = require('./merci-catalogue');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'demos', 'merci', 'images', 'gallery');
const TINTS = ['#f3e4df', '#e6ede6', '#f3eadc', '#e7eaf2', '#efe4ec'];

async function load(img) {
  if (img.url) {
    const url = img.url + (img.url.includes('?') ? '&' : '?') + 'width=1400';
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return `data:${r.headers.get('content-type') || 'image/png'};base64,${Buffer.from(await r.arrayBuffer()).toString('base64')}`;
  }
  const file = path.join(ROOT, 'demos', 'merci', img.file);
  return `data:${file.endsWith('.png') ? 'image/png' : 'image/jpeg'};base64,${fs.readFileSync(file).toString('base64')}`;
}

// --- runs in the browser ---------------------------------------------------------------------
async function draw({ dataUrl, tint }) {
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = dataUrl; });
  const w = img.naturalWidth, h = img.naturalHeight;
  const src = document.createElement('canvas'); src.width = w; src.height = h;
  const sx = src.getContext('2d'); sx.drawImage(img, 0, 0);
  const px = sx.getImageData(0, 0, w, h).data;
  // product box: opaque and not near-white (works for cut-outs and white packshots)
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
    const i = (y * w + x) * 4;
    if (px[i + 3] > 24 && !(px[i] > 242 && px[i + 1] > 242 && px[i + 2] > 242)) {
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
  const W = 1000, H = 1250;
  const out = {};

  // studio view
  let c = document.createElement('canvas'); c.width = W; c.height = H; let g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, '#fbf8f6'); grad.addColorStop(1, tint);
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(191,112,105,.22)'; g.lineWidth = 2;
  g.beginPath(); g.arc(W / 2, H * 0.47, W * 0.36, 0, Math.PI * 2); g.stroke();
  const k = Math.min((W * 0.8) / bw, (H * 0.66) / bh);
  const dw = bw * k, dh = bh * k, dx = (W - dw) / 2, dy = (H - dh) / 2 - H * 0.03;
  const sh = g.createRadialGradient(W / 2, dy + dh, 4, W / 2, dy + dh, dw * 0.45);
  sh.addColorStop(0, 'rgba(60,40,35,.28)'); sh.addColorStop(1, 'rgba(60,40,35,0)');
  g.save(); g.translate(W / 2, dy + dh); g.scale(1, 0.12); g.translate(-W / 2, -(dy + dh));
  g.fillStyle = sh; g.beginPath(); g.arc(W / 2, dy + dh, dw * 0.45, 0, Math.PI * 2); g.fill(); g.restore();
  g.globalCompositeOperation = 'multiply'; // white studio backgrounds melt into the tint
  g.drawImage(src, x0, y0, bw, bh, dx, dy, dw, dh);
  out.studio = c.toDataURL('image/jpeg', 0.86);

  // detail view: a square around the upper middle of the product, on warm white
  c = document.createElement('canvas'); c.width = W; c.height = H; g = c.getContext('2d');
  g.fillStyle = '#f7f4f1'; g.fillRect(0, 0, W, H);
  const side = Math.min(bw, bh) * 0.56;
  const cx = x0 + bw / 2, cy = y0 + bh * 0.42;
  const cw = side, ch = side * (H / W);
  g.imageSmoothingQuality = 'high';
  g.drawImage(src, cx - cw / 2, cy - ch / 2, cw, ch, 0, 0, W, H);
  out.detail = c.toDataURL('image/jpeg', 0.86);
  return out;
}

(async () => {
  const only = process.argv.slice(2);
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  let n = 0;
  for (const [i, p] of catalogue.products.entries()) {
    if (only.length && !only.includes(p.handle)) continue;
    const img = catalogue.images[p.colors[0].image];
    if (!img) { console.warn('no image', p.handle); continue; }
    try {
      const dataUrl = await load(img);
      const res = await page.evaluate(draw, { dataUrl, tint: TINTS[i % TINTS.length] });
      for (const [view, url] of Object.entries(res)) fs.writeFileSync(path.join(OUT, `${p.handle}-${view}.jpg`), Buffer.from(url.split(',')[1], 'base64'));
      n++;
      console.log('✔', p.handle);
    } catch (e) { console.warn('✗', p.handle, e.message); }
  }
  await browser.close();
  console.log(`${n} products → demos/merci/images/gallery/`);
})();
