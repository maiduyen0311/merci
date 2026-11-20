// Back-in-stock form (snippets/restock-form). It posts normally through Shopify's hCaptcha, which blocks
// automated browsers — so the tests call form.submit() (skips the captcha listener) and intercept the POST:
// no contact email or customer is created on the demo store. A real send is checked by hand.
const { test, expect } = require('@playwright/test');
const { visit, watchErrors } = require('./helpers');

// merci-demo: Ribbed Knit Tank — every XL is sold out (inventory 0, policy DENY); Mustard / XL below
const HANDLE = process.env.QA_RESTOCK_HANDLE || 'ribbed-knit-tank';
const SOLD_OUT_ID = process.env.QA_RESTOCK_VARIANT || '50059877711943';
const BOX = '[data-restock]';

test('restock: hidden on an in-stock variant; picking a sold-out size shows it for that variant', async ({ page }) => {
  const errors = watchErrors(page);
  await visit(page, '/products/' + HANDLE);
  await expect(page.locator(BOX)).toBeHidden();

  const xl = page.locator('.main-product__option-pill').filter({ has: page.locator('input[value="XL"]') }).first();
  await expect(xl).toHaveClass(/is-disabled/); // still crossed out…
  await xl.click(); // …but selectable
  await expect(page.locator(BOX)).toBeVisible();
  const id = await page.locator('input[name="id"]').first().inputValue();
  await expect(page.locator(`${BOX} [data-restock-field="id"]`)).toHaveValue(id);
  await expect(page.locator(`${BOX} [data-restock-field="title"]`)).toHaveValue(/XL$/);
  await expect(page.locator('.main-product__add-to-cart')).toBeDisabled();
  await expect(page.locator('.mc-pdp__stock')).toHaveClass(/is-out/); // availability line follows the variant
  expect(errors).toEqual([]);
});

test('restock: the form posts the store contact message for the selected variant', async ({ page }) => {
  let body = '';
  await page.route('**/contact', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    body = route.request().postData() || '';
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>ok</body></html>' });
  });
  await visit(page, `/products/${HANDLE}?variant=${SOLD_OUT_ID}`);
  const form = page.locator(`${BOX} [data-notify-form]`);
  await expect(form).toBeVisible();
  await form.locator('input[type="email"]').fill('qa-restock@example.com');
  await form.evaluate((f) => f.submit());
  await expect.poll(() => body).not.toBe('');
  const fields = new URLSearchParams(body);
  expect(fields.get('form_type')).toBe('contact');
  expect(fields.get('contact[email]')).toBe('qa-restock@example.com');
  expect(fields.get('contact[variant_id]')).toBe(SOLD_OUT_ID);
  expect(body).toContain('Mustard+%2F+XL');
  expect(body).toContain(encodeURIComponent(`/products/${HANDLE}?variant=${SOLD_OUT_ID}`));
});
