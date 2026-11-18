/**
 * Merci demo — derived product images built by scripts/demo/merci-image-tool.js
 * (user 2026-11-18: cut-outs only; colours without a real photo may be recoloured cut-outs).
 *
 * Each entry: { key, src, ops } → demos/merci/images/derived/<key>.png
 *   src  CDN url of a merci-demo product photo, or a path relative to the project root
 *   ops  [{ type: 'cutout', tolerance, soft, shadow }]           remove a plain studio backdrop
 *        [{ type: 'recolor', to, fromHue, range, minSat, contrast }] move the garment hue to `to`
 *                                                                  (fromHue omitted = neutral garment)
 * Every file here is a derivative of a photo already listed in design/IMAGE-CREDITS.md.
 */
const CDN = 'https://cdn.shopify.com/s/files/1/0083/1658/4007/products/';
const LOCAL = 'demos/merci/images/';

const cut = (key, file, opts = {}) => ({ key, src: LOCAL + file, ops: [{ type: 'cutout', ...opts }] });

const entries = [
  // studio-grey packshots → cut-outs
  cut('scarf-leopard', 'p-scrunchie.jpg'),
  cut('sneaker-knit-blush', 'p-sneaker-pink.jpg'),
  cut('cardigan-blush', 'p-cardigan-pink.jpg', { tolerance: 8, soft: 22 }),
  cut('backpack-black', 'p-backpack.jpg'),
  cut('crossbody-straw', 'p-bucket-cobalt.jpg', { tolerance: 10, soft: 26 }), // file name is wrong: it is a straw crossbody bag
  // homepage video banner panel (sections/mc-video-banner): product cut-outs already transparent → trim + resize only
  { key: 'banner-dress', src: CDN + '8.png', ops: [] },
  { key: 'banner-hat', src: CDN + '17_e3da8542-535b-4b7e-b15e-c4659a3b9d3b.png', ops: [] },
  // colour variants are declared next to each product in merci-catalogue.js ([name, photo, '#hex'])
];

module.exports = { entries, CDN };
