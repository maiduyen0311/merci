---
name: design-direction
description: Merci must look different from Top Market and Occasion — hover effects / undesigned pages follow ThemeForest fashion references, on Merci style
metadata:
  type: feedback
---

User 2026-11-10: hover effects and inner pages that v1 has no design for → take references from ThemeForest fashion themes, and make them DIFFERENT from our own Top Market and Occasion themes (no shared motifs). Must still read as Merci (soft pink #bf7069 accent, Mandali, editorial, airy, pill buttons, square images).
**Why:** the themes are sold side by side; buyers should not see the same theme re-skinned.
**How to apply:** for every interaction/inner page, write the chosen Merci treatment in SPEC (§3 / §2) and avoid Top Market patterns (rounded cards, coloured circle icons, orange bars, side icon stacks that fade badges, yellow stars-first cards) and Occasion patterns. Prefer: image zoom + second image cross-fade, slide-up action bar under the image, underline-grow links, editorial captions, thin rules.

**Product cards (user 2026-11-23):** hovering a card must NOT swap to the second image (`show_secondary_image` off in every Merci template, `mc-products` default off, mega menu / recently viewed off). Clicking a colour dot swaps to that variant image and it stays visible while hovering (`.is-swatch-picked`, swatch-hover.js). Why: with the hover image on, a dot clicked with the mouse on the card showed the hover image, so "colour click does nothing". Test this with the mouse still over the card.
