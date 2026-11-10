---
name: store-and-themes
description: merci-demo.myshopify.com theme ids — live Merci v1, compare copy, Merci 2.0 dev theme; publish permission
metadata:
  type: project
---

Store: merci-demo.myshopify.com (Shopify CLI 5.0.1 already authenticated on this machine, 2026-11-10).
- 120883249223 "Merci [LIVE]" — LIVE, old Debut theme = design reference (code in ../legacy-source).
- 161508229191 "Merci v1 Debut [COMPARE 2026-11-10]" — unpublished duplicate of the live theme, kept for side-by-side compare. Do not modify.
- 161508261959 "Merci 2.0 [DEV]" — unpublished, target of all pushes (SHOPIFY_FLAG_THEME).
Store already has ~15 themes (limit 20) — do not create more without cleaning up.

User decision 2026-11-10: Merci 2.0 will be PUBLISHED on merci-demo (it becomes the live demo); the compare copy keeps the old design.
**Why:** user wants the new theme as the public demo and the old one only for comparison.
**How to apply:** publish is denied in .claude/settings.json — user runs `! shopify theme publish --theme 161508261959` themselves. Recommend doing it after phase 04/05 so the live demo is not an unstyled Top Market clone; measure design (phase 02A) on the compare copy preview.

Demo content (phase 05, 2026-11-10): the store keeps the v1 catalogue (≈50 products, 13 collections with odd handles e.g. Accessories=cornershops, Jeans=jewelry — mapped in scripts/demo/merci.js). Generator never creates products. v1 pages use old template suffixes (faq page → "faqs").
Admin API (`shopify store execute`, used by demo-import) is NOT authorised yet — needs `shopify store auth --store merci-demo.myshopify.com --scopes …` run by the user, and phase 05C import needs the user's go-ahead (first time).
Storefront rate-limits (403 / "local_rate_limited") after many headless captures — wait a few minutes.
