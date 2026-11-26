---
name: packaging-scope
description: What ships in the ThemeForest package vs demo-only — Nhóm 1 + #7/#8 in the package; Notify me, #5 video reels, #6 hotspots are demo-only (all built), sold as customization
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

**3. "Nhóm 2" (user 2026-11-26), built one by one:**
- #7 size finder ("Find my size") and #8 mobile bottom navigation bar = IN THE THEME (packaged + documented, like Nhóm 1).
- #5 shoppable video reels and #6 shop-the-look hotspots = CUSTOMIZATION, demo-only like Notify me: live on merci-demo,
  stripped from the package and the docs, advertised as customization. Build them as their own section files
  (+ own JS module / SCSS partial) so packaging just drops those files and their imports.

- #6 built 2026-11-26 — files to drop when packaging: `sections/mc-shop-the-look.liquid`,
  `common/js/modules/mc-shop-the-look.js` (+ its import/init lines in common/js/common.js, marked "demo-only"),
  `common/scss/section/_mc-shop-the-look.scss` (+ its `@use` in styles.scss, marked "demo-only"), the `look`
  section in templates/index.json (+ `order`), image `look-sunny` (scripts/demo/merci-flatlay.js).

- #5 built 2026-11-26 — files to drop when packaging: `sections/mc-video-reels.liquid`,
  `common/js/modules/mc-video-reels.js` (+ import/init lines in common.js, marked "demo-only"),
  `common/scss/section/_mc-video-reels.scss` (+ `@use`, marked "demo-only"), the `reels` section in
  templates/index.json (+ `order`), `scripts/demo/merci-reels.js`, `tests/reels.spec.js`. Clips = Pexels videos (Files merci-reel-*.mp4),
  demo store only — never put them in the package or ThemeForest screenshots without checking the Pexels licence.

**Why:** Group 1 raises the item's value; Notify me is kept back so buyers who want it order customization work.

**How to apply:** In the listing/intro, label Notify me clearly as "available as a customization service / not
included in the download" — Envato requires the description to match what the buyer downloads, so never list it
among included features or show it in screenshots without that label. Related: [[restock-feature]],
[[business-decisions]].
