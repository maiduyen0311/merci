---
name: packaging-scope
description: What ships in the ThemeForest package vs demo-only — Nhóm 1 conversion pack is free in the package; Notify me (restock form) is demo-only, sold as customization
metadata:
  type: project
---

User decision 2026-11-26 — applies to phase 10 (packaging, `npm run release` / scripts/release.js), phase 07
(docs) and the intro page / ThemeForest description.

**1. "Nhóm 1" conversion pack = FREE, included in the package and documented:**
- Card quick add — size chips on hover, colour-only → Add to cart (`common/js/modules/card-quick-add.js`,
  theme setting `card_quick_add`)
- Cart drawer recommendations + quick add (`common/js/modules/cart-upsell.js`, settings Mini cart →
  Recommendations in the cart)
- Multi-tier cart rewards bar (`snippets/cart-rewards.liquid`, Theme settings → Cart rewards) — docs must say it
  only shows progress; the merchant creates the matching automatic discounts in Admin → Discounts
- Calculated delivery dates + dispatch countdown (`common/js/modules/delivery-estimate.js`, PDP settings
  `delivery_mode` …)

**2. "Notify me" back-in-stock form = DEMO ONLY:**
- Stays on the live demo (merci-demo).
- NOT in the packaged source and NOT in the installation docs.
- It IS presented on the intro page (iphoenixthemes.com/themes/merci/) and in the ThemeForest description,
  as an extra offered through customization (buyers ask iPhoenix to add / tailor it).
- Code to strip when packaging: `snippets/restock-form.liquid`; restock parts of `sections/main-product.liquid`
  (settings "Back-in-stock form": show_restock_form, restock_mode, restock_consent, notify_me_*; the render at
  ~line 287–301 and 321; the "sold-out values stay selectable" condition ~line 407; inline JS `[data-restock]`
  ~line 937); restock styles in `common/scss/section/_main-product.scss` + `_mc-pages.scss`; 5 restock keys in
  every `locales/*.json`; `tests/restock.spec.js` (tests are not shipped anyway). Keep the `@app` block slot.
  Best done by release.js with marker comments (e.g. `{%- comment -%}demo-only:restock{%- endcomment -%}`)
  rather than by hand. After stripping, run theme check + a PDP smoke test on the packaged copy.

**Why:** Group 1 raises the item's value; Notify me is kept back so buyers who want it order customization work.

**How to apply:** In the listing/intro, label Notify me clearly as "available as a customization service / not
included in the download" — Envato requires the description to match what the buyer downloads, so never list it
among included features or show it in screenshots without that label. Related: [[restock-feature]],
[[business-decisions]].
