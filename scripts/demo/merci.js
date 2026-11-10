#!/usr/bin/env node
/**
 * Merci demo generator → demos/merci/
 *
 *   node scripts/demo/merci.js            (then: node scripts/validate-templates.js)
 *
 * The demo store merci-demo.myshopify.com already holds the v1 catalogue (≈50 products,
 * 13 collections, blog "news", pages). Unlike Occasion's clone generators this one does NOT
 * create products: it only adds what v1 is missing and fixes broken v1 data.
 *
 *   content.json      metafield definitions (sold count, offer end), Files (Instagram + Lookbook
 *                     photos from scripts/demo/merci-images.ps1), page template suffixes,
 *                     menus (v1 sub-links all pointed to "/" → every item looked active).
 *                     products / collections stay empty on purpose — demo-import must not
 *                     overwrite the v1 catalogue. Use: --only metafields,files,pages,menus
 *   templates/, sections/, config/
 *                     snapshot of the theme's own JSON (the theme ships the Merci demo as its
 *                     defaults) + the demo-only references: uploaded Files and product handles.
 *
 * Safe to re-run: it always derives from the theme JSON, so nothing hand-edited lives in demos/.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'demos', 'merci');
const PREFIX = 'merci-demo';

const readJson = (file) => {
  const raw = fs.readFileSync(file, 'utf8');
  const i = raw.indexOf('{');
  return { head: raw.slice(0, i), data: JSON.parse(raw.slice(i)) };
};
const writeJson = (file, data, head = '') => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, head + JSON.stringify(data, null, 2) + '\n');
};
const shopImage = (key) => `shopify://shop_images/${PREFIX}-${key}.jpg`;

// ---------------------------------------------------------------------------
// Store collections (v1 handles are odd — titles are what shoppers see)
// ---------------------------------------------------------------------------
const C = {
  accessories: 'cornershops',
  beauty: 'lorem-ipsum-dolor-2',
  cardigans: 'lorem-ipsum-dolor',
  hoodies: 'clothings',
  jackets: 'new-in',
  jeans: 'jewelry',
  loungewear: 'lorem-ipsum-dolor-4',
  newArrival: 'new-arrival',
  shirts: 'clearance',
  shoes: 'merci-1',
  socks: 'lorem-ipsum-dolor-3',
  swimwear: 'lorem-ipsum-dolor-1',
  trending: 'trending',
};
const col = (h) => `/collections/${h}`;

// ---------------------------------------------------------------------------
// content.json
// ---------------------------------------------------------------------------
const images = {};
const files = [];
const addFile = (key) => {
  images[key] = { file: `images/${key}.jpg` };
  files.push({ key, filename: `${PREFIX}-${key}.jpg` });
};
['instagram-1', 'instagram-2', 'instagram-3', 'instagram-4', 'instagram-5', 'instagram-6', 'lookbook-1', 'lookbook-2', 'lookbook-3'].forEach(addFile);

const content = {
  storeName: 'merci',
  metafields: [
    { name: 'Badge', namespace: 'custom', key: 'badge', type: 'single_line_text_field', choices: ['new', 'hot', 'bestseller', 'sale'] },
    { name: 'Sold count', namespace: 'custom', key: 'sold_count', type: 'number_integer', description: 'Real units sold in the period below — shown as "N sold in last H hours" when the product page setting is on.' },
    { name: 'Sold in last (hours)', namespace: 'custom', key: 'sold_hours', type: 'number_integer' },
    { name: 'Offer ends', namespace: 'custom', key: 'offer_ends', type: 'date_time', description: 'End of the limited-time offer — the product page countdown hides itself after this time.' },
  ],
  images,
  files,
  products: [],
  collections: [],
  // existing v1 pages: only their template is switched (demo-import updates templateSuffix)
  pages: [
    { handle: 'faq', title: 'FAQ', template: 'faq' },
    { handle: 'lookbook', title: 'Lookbook', template: 'lookbook' },
    { handle: 'contact-us', title: 'Contact us', template: 'contact' },
    { handle: 'wishlist', title: 'My wishlist', template: 'wishlist' },
    { handle: 'compare', title: 'Compare', template: 'compare' },
  ],
  menus: [
    {
      handle: 'main-menu',
      title: 'Main menu',
      items: [
        { title: 'Home', url: '/' },
        {
          title: 'Shop',
          url: '/collections/all',
          items: [
            {
              title: 'Clothing',
              url: '/collections/all',
              items: [
                { title: 'Cardigans & Sweaters', url: col(C.cardigans) },
                { title: 'Hoodies & Sweatshirts', url: col(C.hoodies) },
                { title: 'Jackets & Coats', url: col(C.jackets) },
                { title: 'Jeans', url: col(C.jeans) },
                { title: 'Shirts & Blouses', url: col(C.shirts) },
                { title: 'Loungewear', url: col(C.loungewear) },
              ],
            },
            {
              title: 'Accessories',
              url: col(C.accessories),
              items: [
                { title: 'Bags & Hats', url: col(C.accessories) },
                { title: 'Shoes', url: col(C.shoes) },
                { title: 'Socks & Tights', url: col(C.socks) },
                { title: 'Swimwear & Beachwear', url: col(C.swimwear) },
                { title: 'Beauty', url: col(C.beauty) },
              ],
            },
          ],
        },
        {
          title: 'Collection',
          url: '/collections',
          items: [
            { title: 'New arrival', url: col(C.newArrival) },
            { title: 'Trending', url: col(C.trending) },
            { title: 'Loungewear', url: col(C.loungewear) },
            { title: 'Swimwear', url: col(C.swimwear) },
            { title: 'All collections', url: '/collections' },
          ],
        },
        { title: 'Blog', url: '/blogs/news' },
        { title: 'Lookbook', url: '/pages/lookbook' },
        { title: 'FAQ', url: '/pages/faq' },
        { title: 'Contact', url: '/pages/contact-us' },
      ],
    },
    {
      handle: 'footer',
      title: 'Footer — My account',
      items: [
        { title: 'My account', url: '/account' },
        { title: 'Wishlist', url: '/pages/wishlist' },
        { title: 'Compare', url: '/pages/compare' },
        { title: 'Contact', url: '/pages/contact-us' },
      ],
    },
    {
      handle: 'link',
      title: 'Footer — Link',
      items: [
        { title: 'Shipping policy', url: '/policies/shipping-policy' },
        { title: 'Refund policy', url: '/policies/refund-policy' },
        { title: 'Privacy policy', url: '/policies/privacy-policy' },
        { title: 'FAQs', url: '/pages/faq' },
      ],
    },
  ],
  discounts: [],
};

// ---------------------------------------------------------------------------
// Theme JSON overlay
// ---------------------------------------------------------------------------
// demos/merci/images comes from merci-images.ps1 — keep it, rebuild only the JSON
for (const d of ["templates", "sections", "config"]) fs.rmSync(path.join(OUT, d), { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const imgDir = path.join(OUT, 'images');
if (!fs.existsSync(imgDir)) {
  console.warn('! demos/merci/images missing — run: powershell -ExecutionPolicy Bypass -File scripts/demo/merci-images.ps1');
}

// index: Instagram grid → uploaded Instagram photos
{
  const { head, data } = readJson(path.join(ROOT, 'templates', 'index.json'));
  const ig = data.sections.instagram;
  if (ig) {
    ig.block_order.forEach((id, i) => {
      ig.blocks[id].settings.image = shopImage(`instagram-${(i % 6) + 1}`);
    });
  }
  writeJson(path.join(OUT, 'templates', 'index.json'), data, head);
}

// lookbook: photos + hotspot products (v1 catalogue handles)
{
  const { head, data } = readJson(path.join(ROOT, 'templates', 'page.lookbook.json'));
  const looks = {
    look1: ['lookbook-1', ['scallop-edge-laser-cut', 'button-front-denim-skirt', 'lorem-ipsum-began-as-scrambled']],
    look2: ['lookbook-2', ['knot-hem-top', 'duis-aute-pariatur', 'consectetur-adipiscing-elit']],
    look3: ['lookbook-3', ['the-placeholder-text', 'scallop-edge-laser-cut-1', 'finibus-bonorum-et-malorum']],
  };
  for (const [id, [img, handles]] of Object.entries(looks)) {
    const s = data.sections[id];
    if (!s) continue;
    s.settings.image = shopImage(img);
    s.block_order.forEach((b, i) => {
      if (handles[i]) s.blocks[b].settings.product = handles[i];
    });
  }
  writeJson(path.join(OUT, 'templates', 'page.lookbook.json'), data, head);
}

// everything else the demo uses is the theme default — copy so deploy-demo pushes one coherent set
for (const f of ['collection.json', 'product.json', 'blog.json', 'page.faq.json', 'page.contact.json']) {
  const { head, data } = readJson(path.join(ROOT, 'templates', f));
  writeJson(path.join(OUT, 'templates', f), data, head);
}
for (const f of ['header-group.json', 'footer-group.json']) {
  const { head, data } = readJson(path.join(ROOT, 'sections', f));
  writeJson(path.join(OUT, 'sections', f), data, head);
}
{
  const { head, data } = readJson(path.join(ROOT, 'config', 'settings_data.json'));
  writeJson(path.join(OUT, 'config', 'settings_data.json'), data, head);
}

writeJson(path.join(OUT, 'content.json'), content);
writeJson(path.join(OUT, 'images.manifest.json'), {
  note: 'Built by scripts/demo/merci-images.ps1 from ../instagram and ../banner (licence unknown — demo store only).',
  'instagram-1': { src: 'instagram/1.jpg', square: 1080 },
  'instagram-2': { src: 'instagram/3.jpg', square: 1080 },
  'instagram-3': { src: 'instagram/5.jpg', square: 1080 },
  'instagram-4': { src: 'instagram/7.jpg', square: 1080 },
  'instagram-5': { src: 'instagram/8.jpg', square: 1080 },
  'instagram-6': { src: 'instagram/9.jpg', square: 1080 },
  'lookbook-1': { src: 'banner/15.jpg', max: 1200 },
  'lookbook-2': { src: 'banner/7.jpg', max: 1200 },
  'lookbook-3': { src: 'banner/9.jpg', max: 1200 },
});
console.log(`✔ demos/merci: ${files.length} files, ${content.pages.length} pages, ${content.menus.length} menus`);
