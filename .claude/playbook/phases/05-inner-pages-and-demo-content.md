# Phase 05 — Trang con + nội dung demo + store demo

**Mục tiêu**: mọi template Shopify có giao diện đúng design; mỗi demo có generator nội dung và import lên store demo.

## A. Trang con
Template cần đủ: `collection`, `list-collections`, `product` (+ alternate template nếu có, vd `product.bundle`), `cart`, `search`, `blog`, `article`, `page`, `page.contact`, `page.about`, `page.faq`, `page.wishlist`, `page.compare`, `404`, `password`, `gift_card`, `customers/*` (login, register, account, order, addresses, activate, reset).

```text
Phase 05A. Theo SPEC §2 (trang con) + mockup/design: làm từng template. Dùng primitive _pages.scss, snippet có sẵn
(card-product, news-card, page-breadcrumb, account-nav…). Filter: Shopify Search & Discovery (storefront filtering),
drawer mobile (_facets-drawer.scss). PDP: variant picker swatch theo metafield/option, gallery zoom, sticky ATC,
pickup availability, share, related + recently viewed. Cart drawer + trang cart dùng chung addToCart().
Mỗi template: so với design 1440/390, review, commit.
Kiểm tra empty state: collection rỗng, search 0 kết quả, cart rỗng, sản phẩm không ảnh, sold out, 1 variant.
```

## B. Nội dung demo (generator — như `scripts/demo/clone02.js` của Occasion)
```text
Phase 05B. Viết scripts/demo/<demo>.js sinh demos/<demo>/:
content.json (products + variants + images, collections, pages, blog posts, menus, Files), templates/*.json,
sections/{header,footer}-group.json, config/settings_data.json, images.manifest.json.
Ảnh: Option A → crop/resize từ design/<demo>/02_Image; Option B → bộ ảnh phase 02B (image-curator).
Chạy node scripts/validate-templates.js. Không bao giờ chạy lại generator đè lên JSON đã sửa tay — sửa generator trước.
```

## C. Store demo
```text
Phase 05C. (Hỏi tôi trước lần đầu) Import: npm run demo:import -- <demo> --store <shop> (an toàn chạy lại, tìm theo handle).
Deploy: node scripts/deploy-demo.js <demo> --store <shop> --theme <id> (theme unpublished trước; live khi tôi duyệt).
Việc phía store theme không sửa được — liệt kê để tôi làm trong admin: tiền tệ/Markets, customer accounts,
discount tự động (cần read_discounts), ngôn ngữ (cần write_markets), password page.
```

## Xong khi
- [ ] Mọi template trong danh sách render đúng; empty state ổn.
- [ ] Mỗi demo: generator chạy được, `validate-templates.js` pass, store demo hiển thị như design.
- [ ] `.claude/memory/` có store, theme id, quy trình update, quyền deploy đã được cho.
