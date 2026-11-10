---
name: store-and-themes
description: merci-demo.myshopify.com theme ids — Merci 2.0 is now LIVE, v1 copies kept; Admin API auth; demo catalogue (v1 27 + 78 demo-merci products)
metadata:
  type: project
---

Store: merci-demo.myshopify.com.
- 161508261959 "Merci 2.0 [DEV]" — **LIVE since 2026-11-10** (user published it). Pushing to it = pushing live → ask the user first (CLAUDE.md rule), e.g. `node scripts/deploy-demo.js merci --store merci-demo.myshopify.com --theme 161508261959`.
- 120883249223 "Merci [LIVE]" — now unpublished, old Debut theme = design reference (code in ../legacy-source).
- 161508229191 "Merci v1 Debut [COMPARE 2026-11-10]" — unpublished duplicate of the v1 theme for side-by-side compare. Do not modify.
Store already has ~15 themes (limit 20) — do not create more without cleaning up. `shopify theme dev` creates a hidden development theme (fine).

User decision 2026-11-10: Merci 2.0 is the public demo; the compare copy keeps the old design. Publish stays denied in .claude/settings.json — the user publishes.

Demo content: the store keeps the v1 catalogue (27 products, 13 collections with odd handles e.g. Accessories=cornershops, Jeans=jewelry — mapped in scripts/demo/merci.js; never edit v1 products). v1 pages use old template suffixes (faq page → "faqs").
2026-11-10 (user asked "nhập sản phẩm nhiều để có phân trang"): scripts/demo/merci-catalogue.js adds 78 products under new handles, tagged `demo-merci`, reusing the v1 photos on the store CDN; demo-import only adds them to the v1 collections (membership-only entries) → ~105 products, every category except Socks & Tights (no fitting photos) has 2–3 pages at 12/page. `--prune` now only archives `demo-merci`-tagged products. Import: `npm run demo:import -- merci --store merci-demo.myshopify.com --only products,collections` (~30 s per product).
Admin API (`shopify store execute`) authorised on the D:\Duyen_Project machine 2026-11-10 (products, files, publications, locations, inventory, content, pages, navigation scopes). Other machines: `shopify store auth --store merci-demo.myshopify.com --scopes …`.
Storefront rate-limits (403 / "local_rate_limited") after many headless captures or curls — wait a few minutes; use the Admin API to verify data.
