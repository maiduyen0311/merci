# Merci — Shopify Theme (OS 2.0)

Theme Merci của iPhoenix Themes, bán trên ThemeForest. Code nền clone từ **Top-market** (`D:\DuyenNguyen\Shopify\Top-market\top-market`) rồi restyle theo design Merci. Đầu vào design: **Option A** (A = đã có design các trang chính + ảnh sản phẩm; B = chỉ có design trang chủ, phải tự thiết kế trang con + tìm ảnh — xem `design/BRIEF.md` §2).

## Đang làm (bàn giao giữa các máy)

**Đọc trước khi làm tiếp:** `.claude/memory/MEMORY.md` + các file trong `.claude/memory/`.

- Phase hiện tại: 05 xong — 05A trang con (SPEC Appendix D), 05B generator, 05C import (2026-11-10). Merci 2.0 (161508261959) đã LIVE trên merci-demo. Thêm 78 sản phẩm demo (`scripts/demo/merci-catalogue.js`, tag `demo-merci`) để mọi collection có phân trang; sửa banner collection mobile, toolbar đếm sản phẩm, bảng màu swatch.
- 2026-11-11: mega menu Shop (cột link + Editor’s pick + banner Lookbook) và Collection (link + 4 sản phẩm New arrival); badge NEW chữ tối (tương phản), BEST màu nav dark; ảnh card `cover`; chữ parallax gọn trên mobile. Theme staging chưa publish **161552465991 "Merci 2.0 [STAGING]"** để duyệt trước khi đẩy live.
- Việc tiếp theo: user duyệt staging → `node scripts/deploy-demo.js merci --store merci-demo.myshopify.com --theme 161508261959` (live) → phase 06 (test environment).

## Playbook

Quy trình đầy đủ ở `.claude/playbook/` (README + `phases/00…11`). Chạy từng phase bằng `/phase <nn>`; dừng ở cổng duyệt của mỗi phase.

## Nguồn sự thật

- `design/BRIEF.md` — theme cho ai, đối thủ, demo, option.
- `design/SPEC.md` — tokens, section, component. Mọi decision về layout/màu/spacing/settings tham chiếu SPEC. Không sửa SPEC khi user chưa duyệt. Option A: file design thắng nếu SPEC lệch. SPEC mơ hồ → hỏi, đừng đoán hex/size.
- `design/IMAGE-CREDITS.md` — nguồn + license mọi ảnh demo.
- Prefix: giữ `tm-` cho code chung kế thừa từ Top Market; class style riêng của theme này dùng `mc-`.

## Stack

Kế thừa nguyên từ theme nền — xem CLAUDE.md của `D:\DuyenNguyen\Shopify\Top-market\top-market` cho chi tiết pipeline CSS / JS architecture:
- Shopify OS 2.0 (Dawn-based, JSON templates), SCSS (`common/scss/styles.scss` → `assets/styles.css`), Webpack 5 (`common/js/common.js` → `assets/common.js`).
- Vanilla JS module trong `common/js/modules/`, mỗi module `init()` idempotent, gọi lại trên `shopify:section:load`.
- Bootstrap 5 chỉ grid/utility. Không jQuery / Slick / Bootstrap JS.

## Lệnh

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | SCSS + JS watch + `shopify theme dev` (http://127.0.0.1:9293) |
| `npm run build` | Build production |
| `npm run check` | Theme check |
| `npm run qa` | Theme check + Playwright + Lighthouse (sau phase 06) |
| `npm run release` | Gói bán trong `dist/` |

## Convention

- Section: `home-<name>.liquid` cho section chỉ ở trang chủ; tên generic cho section dùng nhiều trang. Setting id `snake_case`, file `kebab-case`.
- CSS vars mỗi section trong `{% style %}` với selector `#<sectionName>-{{ section.id }}`. Không inline CSS lớn. Style → SCSS partial `common/scss/section/_<id>.scss` + `@use` trong `styles.scss`; không thêm `stylesheet_tag` trong section.
- Text: `{{ 'sections.<id>.<key>' | t }}` + key trong mọi file `locales/`.
- Tái dùng snippet: `card-product`, `news-card`, `page-breadcrumb`, `account-nav`, `icon-*`.
- Schema: mọi text/màu/ảnh/link/layout là setting, có default + preset. Demo khác nhau chỉ bằng JSON.
- `templates/index.json`: cập nhật `order` khi thêm/xoá section.

## Git & deploy

- Commit sau mỗi việc xong: `[YYYY-MM-DD HH:MM] <mô tả>`, rồi push nhánh `release/v1.0.0` (fetch + merge nếu remote đổi).
- Chỉ `shopify theme dev` hoặc push lên theme unpublished. Push live / publish / import nội dung store → hỏi user, trừ khi memory ghi đã được cho phép cho đúng store đó.

## Không làm

- KHÔNG sửa `design/SPEC.md` khi user chưa duyệt.
- KHÔNG thêm npm dependency khi chưa hỏi.
- KHÔNG bỏ qua schema settings; KHÔNG hard-code cho riêng 1 demo.
- KHÔNG add lại jQuery / Slick / Bootstrap JS.
- KHÔNG copy code/ảnh của theme/app thương mại khác; KHÔNG dùng ảnh không rõ license.
- KHÔNG tự chạy `shopify theme push --live`, `shopify theme publish`, xoá dữ liệu store.

## URL công khai

- Intro: `https://iphoenixthemes.com/themes/merci/` · Docs: `/themes/merci/documentation/` · Banners: `/themes/merci/themeforest/` · Support: `/themes/merci/#support`
