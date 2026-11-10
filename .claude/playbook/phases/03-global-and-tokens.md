# Phase 03 — Global: tokens, header, footer, card, theme settings

**Mục tiêu**: phần dùng chung toàn site đúng design trước khi làm section — mọi section sau dựa vào đây.

## Prompt
```text
Phase 03. Theo design/SPEC.md:
1. Agent theme-tokens: đồng bộ §1 vào common/scss/_tokens.scss (SCSS vars + CSS custom properties)
   và config/settings_schema.json (colors, typography font_picker, buttons, cards, badges, layout width).
   snippet theme-styles render CSS vars runtime từ settings. Default = đúng hex SPEC.
2. Header (sections/header.liquid + header-group.json + common/scss/header/*): top bar, logo, search, account,
   wishlist, cart, nav, mega menu (blocks: columns / banner / product), mobile drawer, sticky. Layout option nếu
   các demo có header khác nhau (vd centered_split) — 1 section, nhiều layout setting.
3. Footer (footer.liquid + footer-group.json): cột menu, newsletter, social, payment icons, copyright, layout option.
4. Card sản phẩm (agent card-component): snippets/card-product.liquid — ảnh 2 (hover), badge (sale/new/sold out/tag),
   swatch, rating, nút ATC / quick view / wishlist / compare, layout option theo demo.
5. Primitive trang trong: .tm-btn, .tm-input, .tm-card… (common/scss/section/_pages.scss) khớp style guide.
6. Locale: en.default.json + các ngôn ngữ trong BRIEF; schema text dùng t:.
Mỗi phần xong: npm run dev, so với ảnh tham chiếu 1440 / 390, commit + push.
```

## Xong khi
- [ ] Đổi màu/font trong Theme Editor → toàn site đổi theo.
- [ ] Header/footer khớp design desktop + mobile; mega menu + mobile drawer chạy, không lỗi console.
- [ ] Card sản phẩm đủ trạng thái; dùng chung ở mọi nơi (không markup card thứ 2).
- [ ] `/review-section header` + `/review-section footer` không còn 🔴.
