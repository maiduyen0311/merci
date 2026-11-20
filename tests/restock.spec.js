// Back-in-stock form (snippets/restock-form). The POSTs to /contact are intercepted, so no contact
// email or customer is created on the demo store.
const { test, expect } = require('@playwright/test');
const { visit, watchErrors } = require('./helpers');

// merci-demo: Ribbed Knit Tank — every XL is sold out (inventory 0, policy DENY); Mustard / XL below
const HANDLE = process.env.QA_RESTOCK_HANDLE || 'ribbed-knit-tank';
const SOLD_OUT_ID = process.env.QA_RESTOCK_VARIANT || '50059877711943';
const FORM = '[data-stock-block] [data-notify-form]';

test('restock: in-stock variant shows no form; picking a sold-out size brings it in', async ({ page }) => {
  const errors = watchErrors(page);
  await visit(page, '/products/' + HANDLE);
  await expect(page.locator(FORM)).toHaveCount(0);

  const xl = page.locator('.main-product__option-pill').filter({ has: page.locator('input[value="XL"]') }).first();
  await expect(xl).toHaveClass(/is-disabled/); // still crossed out…
  await xl.click(); // …but selectable
  const form = page.locator(FORM);
  await expect(form).toBeVisible();
  await expect(form.locator('input[name="contact[variant_id]"]')).not.toHaveValue('');
  await expect(page.locator('.main-product__add-to-cart')).toBeDisabled();
  expect(errors).toEqual([]);
});

test('restock: submit sends the contact message, then the tagged customer sign-up', async ({ page }) => {
  const posts = [];
  await page.route('**/contact', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    posts.push(route.request().postData() || '');
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<html></html>' });
  });
  await visit(page, `/products/${HANDLE}?variant=${SOLD_OUT_ID}`);
  const form = page.locator(FORM);
  await expect(form).toBeVisible();
  await form.locator('input[type="email"]').fill('qa-restock@example.com');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('.main-product__notify-success')).toBeVisible();

  await expect.poll(() => posts.length).toBe(2);
  const [contact, customer] = posts;
  expect(contact).toContain('name="form_type"\r\n\r\ncontact');
  expect(contact).toContain('qa-restock@example.com');
  expect(contact).toContain('Mustard / XL');
  expect(contact).toContain(SOLD_OUT_ID);
  expect(customer).toContain('name="form_type"\r\n\r\ncustomer');
  expect(customer).toContain('restock-' + SOLD_OUT_ID);
  expect(customer).toContain('restock-' + HANDLE);
});
