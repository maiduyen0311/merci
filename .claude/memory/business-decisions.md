---
name: business-decisions
description: Merci 2.0 business decisions from phase 00 — new item, $59, 1 demo, revenue from bundled app-like features
metadata:
  type: project
---

Decided by user 2026-11-10 (BRIEF §7):
1. Brand-new ThemeForest item (old Merci was never sold).
2. Repo: create new GitHub repo for Merci 2.0 (old repo thanhkma1996/merci stays untouched).
3. Demo images: ../product folder or images already on the live site.
4. $59, one demo / one layout for v1.0. Selling point = FUNCTIONALITY: bundle popular app-style features (wishlist, compare, quick view, lookbook, size guide, reviews…, more via phase 11 add-ons).
5. Locales: same set as previous themes (Top Market/Occasion locale files kept as-is).
6. Fix typos / wrong text on the old site and add content where needed.

**Why:** shapes scope of phases 04, 05 and 11.
**How to apply:** prioritise feature depth over extra demos; plan phase 11 add-ons early; never drop a feature module just because the demo does not show it.

User 2026-11-11 (phase 06 QA): keep the design pink #bf7069 behind white text on buttons/badges even though it is 3.66:1 (WCAG AA wants 4.5:1) — tests/a11y.spec.js accepts exactly that pair. Keep the sales popup ("recently bought") enabled by default.
**Why:** brand look over strict AA; sales popup is a selling feature.
**How to apply:** do not darken buttons/badges or disable the sales popup unless the user asks; text in the accent colour on white still uses color_accent_ink #a95b55.
