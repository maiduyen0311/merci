#!/usr/bin/env node
/**
 * Merci demo images — background removal + colour variants for product cut-outs.
 *
 *   node scripts/demo/merci-image-tool.js            build every entry of scripts/demo/merci-derived.js
 *   node scripts/demo/merci-image-tool.js <key> ...  build only these keys
 *
 * Output: demos/merci/images/derived/<key>.png (RGBA). The catalogue (merci-catalogue.js) points
 * product colours at these files and scripts/demo-import.js uploads them.
 *
 * Runs the pixel work inside headless Chrome (Playwright, already a dev dependency) so no image
 * library is needed:
 *   cutout  — flood-fill from the border over pixels close to the backdrop colour (plain studio
 *             grey / white), soft alpha on the edge band, then trims to the product box.
 *   recolor — moves the garment's dominant hue to a target colour, keeps its shading; neutral
 *             pixels (white soles, black laces, metal) and other hues are left alone.
 * User 2026-11-18: product photos must be cut-outs; colours without a real photo may be recoloured.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
// cut-outs first: some colour variants recolour a cut-out
const entries = [...require('./merci-derived').entries, ...require('./merci-catalogue').derived];

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'demos', 'merci', 'images', 'derived');

async function loadSource(src) {
  if (/^https?:/.test(src)) {
    const url = src + (src.includes('?') ? '&' : '?') + 'width=1200';
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${r.status} ${url}`);
    return { mime: r.headers.get('content-type') || 'image/png', b64: Buffer.from(await r.arrayBuffer()).toString('base64') };
  }
  const file = path.join(ROOT, src);
  return { mime: file.endsWith('.png') ? 'image/png' : 'image/jpeg', b64: fs.readFileSync(file).toString('base64') };
}

// --- runs in the browser ------------------------------------------------------
function pagePipeline({ dataUrl, ops }) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error('decode failed'));
    img.onload = () => {
      let cv = document.createElement('canvas');
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      let ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      let id = ctx.getImageData(0, 0, cv.width, cv.height);

      const rgb2hsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
        if (mx === mn) return [0, 0, l];
        const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
        let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
        return [h * 60, s, l];
      };
      const hsl2rgb = (h, s, l) => {
        h = ((h % 360) + 360) % 360 / 360;
        if (s === 0) return [l * 255, l * 255, l * 255];
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
        const f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
        return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
      };
      const hex2hsl = (hex) => { const n = parseInt(hex.replace('#', ''), 16); return rgb2hsl(n >> 16, (n >> 8) & 255, n & 255); };
      const hueDist = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

      for (const op of ops) {
        const { width: w, height: h, data: px } = id;
        if (op.type === 'cutout') {
          // backdrop = median of the border pixels
          const border = [];
          for (let x = 0; x < w; x += 2) { border.push((0 * w + x) * 4, ((h - 1) * w + x) * 4); }
          for (let y = 0; y < h; y += 2) { border.push((y * w) * 4, (y * w + w - 1) * 4); }
          const med = [0, 1, 2].map((c) => border.map((o) => px[o + c]).sort((a, b) => a - b)[border.length >> 1]);
          const dist = (o) => Math.max(Math.abs(px[o] - med[0]), Math.abs(px[o + 1] - med[1]), Math.abs(px[o + 2] - med[2]));
          const t1 = op.tolerance || 14, t2 = op.soft || 34;
          // flood fill from every border pixel through "close to backdrop" pixels (≤ t2)
          const state = new Uint8Array(w * h); // 1 = backdrop
          const stack = [];
          const push = (i) => { if (!state[i] && dist(i * 4) <= t2) { state[i] = 1; stack.push(i); } };
          for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
          for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
          while (stack.length) {
            const i = stack.pop(), x = i % w, y = (i / w) | 0;
            if (x > 0) push(i - 1); if (x < w - 1) push(i + 1);
            if (y > 0) push(i - w); if (y < h - 1) push(i + w);
          }
          for (let i = 0; i < w * h; i++) {
            if (!state[i]) continue;
            const o = i * 4, d = dist(o);
            // ≤ t1: backdrop → transparent; t1..t2: shadow / anti-aliased edge → partial alpha
            px[o + 3] = d <= t1 ? 0 : Math.round(255 * Math.min(1, (d - t1) / (t2 - t1)) * (op.shadow ?? 0.55));
          }
          // 1px feather on the product edge against removed backdrop
          const a = new Uint8ClampedArray(w * h); for (let i = 0; i < w * h; i++) a[i] = px[i * 4 + 3];
          for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
            const i = y * w + x; if (state[i] || a[i] === 0) continue;
            const n = a[i - 1] + a[i + 1] + a[i - w] + a[i + w];
            if (n < 4 * 255) px[i * 4 + 3] = Math.round((a[i] * 4 + n) / 8);
          }
        }
        if (op.type === 'recolor') {
          const [th, ts, tl] = hex2hsl(op.to);
          const range = op.range || 30, minSat = op.minSat ?? 0.12;
          let srcHue = op.fromHue;
          if (srcHue === 'auto') {
            // dominant hue of the saturated opaque pixels (10° bins, weighted by saturation)
            const bins = new Float64Array(36);
            for (let i = 0; i < w * h; i += 3) {
              const o = i * 4; if (px[o + 3] < 200) continue;
              const [hh, ss, ll] = rgb2hsl(px[o], px[o + 1], px[o + 2]);
              if (ss > minSat && ll > 0.08 && ll < 0.95) bins[Math.floor(hh / 10) % 36] += ss;
            }
            let best = 0; for (let b = 1; b < 36; b++) if (bins[b] + bins[(b + 35) % 36] + bins[(b + 1) % 36] > bins[best] + bins[(best + 35) % 36] + bins[(best + 1) % 36]) best = b;
            srcHue = best * 10 + 5;
          }
          // garment statistics over the masked pixels
          let n = 0, sumS = 0, sumL = 0;
          const w8 = new Float32Array(w * h);
          for (let i = 0; i < w * h; i++) {
            const o = i * 4; if (px[o + 3] < 20) continue;
            const [hh, ss, ll] = rgb2hsl(px[o], px[o + 1], px[o + 2]);
            let m;
            if (srcHue == null) m = ll > (op.minL ?? 0.04) && ll < (op.maxL ?? 0.97) ? 1 : 0; // neutral garment: every pixel in the lightness band
            else m = ss < minSat * 0.6 ? 0 : Math.max(0, Math.min(1, (range - hueDist(hh, srcHue)) / (range * 0.35))) * Math.min(1, ss / minSat);
            w8[i] = m; if (m > 0.5) { n++; sumS += ss; sumL += ll; }
          }
          const mS = n ? sumS / n : 0.5, mL = n ? sumL / n : 0.5;
          const contrast = op.contrast ?? (tl > mL ? Math.max(0.45, (1 - tl) / Math.max(0.05, 1 - mL)) : Math.max(0.6, tl / Math.max(0.05, mL)));
          for (let i = 0; i < w * h; i++) {
            const m = w8[i]; if (!m) continue;
            const o = i * 4;
            const [, ss, ll] = rgb2hsl(px[o], px[o + 1], px[o + 2]);
            const ns = Math.max(0, Math.min(1, srcHue == null ? ts : ss * (ts / Math.max(0.05, mS))));
            const nl = Math.max(0, Math.min(1, tl + (ll - mL) * contrast));
            const [r, g, b] = hsl2rgb(th, ns, nl);
            px[o] = px[o] * (1 - m) + r * m; px[o + 1] = px[o + 1] * (1 - m) + g * m; px[o + 2] = px[o + 2] * (1 - m) + b * m;
          }
        }
      }
      ctx.putImageData(id, 0, 0);

      // trim to the opaque box + 4% margin
      const { width: w, height: h, data: px } = id;
      let x0 = w, y0 = h, x1 = 0, y1 = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (px[(y * w + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 > x0) {
        const m = Math.round(Math.max(x1 - x0, y1 - y0) * 0.04);
        // longest side ≤ 1000px: enough for the PDP column, keeps the repo light
        const k = Math.min(1, 1000 / Math.max(x1 - x0 + 1 + 2 * m, y1 - y0 + 1 + 2 * m));
        const cw = Math.round((x1 - x0 + 1 + 2 * m) * k), ch = Math.round((y1 - y0 + 1 + 2 * m) * k);
        const out = document.createElement('canvas'); out.width = cw; out.height = ch;
        const octx = out.getContext('2d'); octx.imageSmoothingQuality = 'high';
        octx.drawImage(cv, x0, y0, x1 - x0 + 1, y1 - y0 + 1, Math.round(m * k), Math.round(m * k), Math.round((x1 - x0 + 1) * k), Math.round((y1 - y0 + 1) * k));
        cv = out;
      }
      resolve(cv.toDataURL('image/png'));
    };
    img.src = dataUrl;
  });
}

(async () => {
  const only = process.argv.slice(2);
  const list = only.length ? entries.filter((e) => only.includes(e.key)) : entries;
  if (!list.length) { console.error('no matching entries'); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.setContent('<!doctype html><title>image tool</title>');
  for (const e of list) {
    const { mime, b64 } = await loadSource(e.src);
    const png = await page.evaluate(pagePipeline, { dataUrl: `data:${mime};base64,${b64}`, ops: e.ops });
    fs.writeFileSync(path.join(OUT, `${e.key}.png`), Buffer.from(png.split(',')[1], 'base64'));
    console.log(`  ✔ ${e.key}`);
  }
  await browser.close();
})().catch((err) => { console.error(err); process.exit(1); });
