// Accessibility: no critical/serious axe violations on the main pages.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { PAGES, visit } = require('./helpers');

const PAGES_TO_CHECK = ['home', 'collection', 'product', 'cart', 'search', 'blog'];

for (const name of PAGES_TO_CHECK) {
  test(`a11y: ${name}`, async ({ page }, info) => {
    test.skip(info.project.name === 'tablet', 'desktop + mobile are enough');
    await visit(page, PAGES[name]);
    await page.waitForLoadState('load');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('#shopify-pc__banner') // Shopify cookie banner (not theme code)
      .exclude('iframe')
      .analyze();
    // Accepted by the user 2026-11-11: white text on the Merci pink #bf7069 (buttons, badges) stays as designed
    // even though it is 3.66:1. Every other contrast failure still fails the test.
    const accepted = (n) => /foreground color: #ffffff, background color: #bf7069/i.test(((n.any || [])[0] || {}).message || '');
    const bad = results.violations
      .filter((v) => ['critical', 'serious'].includes(v.impact))
      .map((v) => (v.id === 'color-contrast' ? { ...v, nodes: v.nodes.filter((n) => !accepted(n)) } : v))
      .filter((v) => v.nodes.length);
    const summary = bad.map((v) => `${v.impact} ${v.id}: ${v.help} (${v.nodes.length}) → ${v.nodes[0].target.join(' ')}`);
    expect(summary, 'axe critical/serious').toEqual([]);
  });
}
