# Phase 08 — Page intro (landing bán theme)

**Mục tiêu**: trang giới thiệu tĩnh `page-intro/` = "Live preview" của item, host tại `https://iphoenixthemes.com/themes/<slug>/`. Không nằm trong gói bán. Mẫu: `../Occasion/source/page-intro/` (README mô tả layout).

## Layout chuẩn (product landing, không chép storefront)
Sticky nav → hero (các homepage trong khung trình duyệt + số liệu: demos, sections, pages) → trust strip (OS 2.0, speed, support, free updates) → demo cards (hover cuộn full page, link store demo) → feature rows (ảnh/text xen kẽ) → "Skip a dozen apps" (tính năng built-in thay app trả phí, tiết kiệm $/tháng) → inner pages grid → mobile phones → under the hood (performance, a11y, clean code) → FAQ → CTA → footer.

## Prompt
```text
Phase 08. Dựng page-intro/ (index.html + assets/intro.css + assets/intro.js + images/), không build step.
- Chỉ dùng palette + font của theme (token ở :root intro.css), wordmark SVG từ snippet logo của theme, logo iPhoenix
  từ D:\DuyenNguyen\Shopify\iphoenixthemes.com\logo\.
- Ảnh chụp từ store demo (?country=US để giá USD): full page 1440→900px, trang con 1440×1100→1000×764,
  phone 390×844→520×1125; JPEG đã nén. Tên: demo-<slug>-full, page-<slug>-*, m-<slug>-*.
- Mọi nút mua có data-buy; ITEM_URL, AFFILIATE_URL, GA4_ID, META_PIXEL_ID, SALE (strip khuyến mãi) ở đầu intro.js.
- SEO: title, description, canonical, og:image 1200×630 (vẽ bằng HTML → render), JSON-LD Product.
- Scroll-spy menu, reveal on scroll, prefers-reduced-motion, Lighthouse ≥ 90 mọi mục.
- README.md cho page-intro (như Occasion): cấu trúc, cách thêm demo, quy ước ảnh, palette.
Chờ tôi duyệt rồi mới upload (upload = việc công khai).
```

## Xong khi
- [ ] Mở file:// và trên host đều đúng; mọi link demo/buy chạy; Lighthouse ≥ 90.
- [ ] Số liệu (số demo, section, trang) khớp theme thật và khớp listing ThemeForest.
- [ ] Có mục trên site iphoenixthemes.com trỏ tới trang này (repo `iphoenixthemes.com/source`, theme WP `iphoenix-2026` — hỏi trước khi push `develop` vì auto-deploy production).
