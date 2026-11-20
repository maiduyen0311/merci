---
name: restock-feature
description: Back-in-stock is a theme feature (snippets/restock-form), the iphoenix-restock app is paused; merci-demo lives in Partner org PhoenixCorp
metadata:
  type: project
---

User decision 2026-11-20: building/installing the app was too involved → back-in-stock alerts ship **inside the theme**
(`snippets/restock-form.liquid`, main-product settings "Back-in-stock form"); keep the `@app` block slot under the buy
buttons for apps later.

**Why:** `shopify app dev` only installs on a dev store of the same Partner org. merci-demo.myshopify.com (plan
"Development") belongs to org **PhoenixCorp**; the app linked first (client_id 9ad4147e…) sits in org **iphoenix**.
A test store `merci-demo-kkhveayo.myshopify.com` was created by mistake in that flow — not used.

**How to apply:**
- Theme form cannot email shoppers on restock: it sends a contact message + (setting) a customer tagged
  `restock`, `restock-<variant id>`, `restock-<handle>`; the merchant sends the email. Say so in docs/listing — never
  claim automatic restock emails for the theme alone.
- Tests: `tests/restock.spec.js` uses Ribbed Knit Tank (all XL sold out, variant 50059877711943) and intercepts
  `/contact` — never submit the real form on the demo.
- Resuming the app (`D:\Duyen_Project\shopify\apps\iphoenix-restock`, own git repo, no remote): run
  `npx shopify app dev --reset --store merci-demo.myshopify.com` in a separate terminal (CLI prompts need a TTY; the
  `!` prefix and PowerShell `npm run x -- --flag` both fail), pick org PhoenixCorp → create app, then fix
  `shopify.app.toml` again: CLI rewrites it (drops app_proxy/webhooks on link, sets webhook API 2027-01 while code
  uses October26).
