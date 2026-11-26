#!/usr/bin/env node
/**
 * Merci demo — "Shop the look" flat-lay (user 2026-11-26, Nhóm 2 #6, demo-only feature).
 *
 *   node scripts/demo/merci-flatlay.js
 *
 * Lays the cut-outs of real demo products on a soft backdrop (headless Chrome canvas, no image
 * library), so every hotspot points at a product the store sells. Writes
 * demos/merci/images/look-sunny.jpg and prints each product's hotspot (x/y % of the image) for
 * templates/index.json (section mc-shop-the-look).
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const catalogue = require('./merci-catalogue');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'demos', 'merci', 'images', 'look-sunny.jpg');

// handle, centre x/y and box (fractions of the canvas), rotation (deg); hotspot = a point on the item
const LAYOUT = [
  { handle: 'crochet-mini-dress', cx: 0.36, cy: 0.5, w: 0.36, h: 0.84, rot: -4, spot: [0.5, 0.42] },
  { handle: 'wide-brim-straw-boater', cx: 0.74, cy: 0.27, w: 0.34, h: 0.36, rot: 8, spot: [0.5, 0.55] },
  { handle: 'striped-straw-tote', cx: 0.75, cy: 0.69, w: 0.24, h: 0.5, rot: 6, spot: [0.5, 0.6] },
  { handle: 'braided-slide-sandals', cx: 0.12, cy: 0.8, w: 0.2, h: 0.28, rot: -12, spot: [0.5, 0.5] },
];

async function load(img) {
  if (img.url) {
    const r = await fetch(img.url + (img.url.includes('?') ? '&' : '?') + 'width=1400');
    if (!r.ok) throw new Error(`${r.status} ${img.url}`);
    return `data:${r.headers.get('content-type') || 'image/png'};base64,${Buffer.from(await r.arrayBuffer()).toString('base64')}`;
  }
  const file = path.join(ROOT, 'demos', 'merci', img.file);
  return `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
}

// --- runs in the browser ---------------------------------------------------------------------
async function draw(items) {
  const W = 1600, H = 1200;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  // flat colour = the section's "Image area background" (#efe3d8), so the photo has no visible edge
  g.fillStyle = '#efe3d8'; g.fillRect(0, 0, W, H);
  // a few soft "linen" strokes
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1;
  for (let y = 0; y < H; y += 6) { g.beginPath(); g.moveTo(0, y + Math.sin(y) * 2); g.lineTo(W, y); g.stroke(); }

  const spots = [];
  for (const it of items) {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = it.dataUrl; });
    // trim to the product (opaque, not near-white)
    const s = document.createElement('canvas'); s.width = img.naturalWidth; s.height = img.naturalHeight;
    const sx = s.getContext('2d'); sx.drawImage(img, 0, 0);
    const px = sx.getImageData(0, 0, s.width, s.height).data;
    let x0 = s.width, y0 = s.height, x1 = 0, y1 = 0;
    for (let y = 0; y < s.height; y += 2) for (let x = 0; x < s.width; x += 2) {
      const i = (y * s.width + x) * 4;
      if (px[i + 3] > 24 && !(px[i] > 240 && px[i + 1] > 240 && px[i + 2] > 240)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    const bw = x1 - x0, bh = y1 - y0;
    const k = Math.min((it.w * W) / bw, (it.h * H) / bh);
    const dw = bw * k, dh = bh * k;
    const cx = it.cx * W, cy = it.cy * H;
    g.save();
    g.translate(cx, cy); g.rotate((it.rot * Math.PI) / 180);
    g.shadowColor = 'rgba(70,45,30,.22)'; g.shadowBlur = 28; g.shadowOffsetX = 10; g.shadowOffsetY = 14;
    g.globalCompositeOperation = 'multiply'; // white studio backgrounds melt into the backdrop
    g.drawImage(s, x0, y0, bw, bh, -dw / 2, -dh / 2, dw, dh);
    g.restore();
    // hotspot in the rotated item → canvas %
    const lx = (it.spot[0] - 0.5) * dw, ly = (it.spot[1] - 0.5) * dh, a = (it.rot * Math.PI) / 180;
    spots.push({ handle: it.handle, x: Math.round(((cx + lx * Math.cos(a) - ly * Math.sin(a)) / W) * 100), y: Math.round(((cy + lx * Math.sin(a) + ly * Math.cos(a)) / H) * 100) });
  }
  return { jpg: c.toDataURL('image/jpeg', 0.88), spots };
}

(async () => {
  const items = [];
  for (const l of LAYOUT) {
    const p = catalogue.products.find((x) => x.handle === l.handle);
    if (!p) throw new Error(`no product ${l.handle}`);
    items.push({ ...l, dataUrl: await load(catalogue.images[p.colors[0].image]) });
  }
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  const { jpg, spots } = await page.evaluate(draw, items);
  await browser.close();
  fs.writeFileSync(OUT, Buffer.from(jpg.split(',')[1], 'base64'));
  console.log(`✔ ${path.relative(ROOT, OUT)}`);
  console.log(JSON.stringify(spots, null, 1));
})();
