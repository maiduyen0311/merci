# Merci — Shopify Theme (OS 2.0)

Theme Merci của iPhoenix Themes, bán trên ThemeForest. Code nền clone từ **Top-market** (`D:\DuyenNguyen\Shopify\Top-market\top-market`) rồi restyle theo design Merci. Đầu vào design: **Option A** (A = đã có design các trang chính + ảnh sản phẩm; B = chỉ có design trang chủ, phải tự thiết kế trang con + tìm ảnh — xem `design/BRIEF.md` §2).

## Đang làm (bàn giao giữa các máy)

**Đọc trước khi làm tiếp:** `.claude/memory/MEMORY.md` + các file trong `.claude/memory/`.

- Phase hiện tại: 05 xong — 05A trang con (SPEC Appendix D), 05B generator, 05C import (2026-11-10). Merci 2.0 (161508261959) đã LIVE trên merci-demo. Thêm 78 sản phẩm demo (`scripts/demo/merci-catalogue.js`, tag `demo-merci`) để mọi collection có phân trang; sửa banner collection mobile, toolbar đếm sản phẩm, bảng màu swatch.
- 2026-11-11: mega menu Shop (cột link + Editor’s pick + banner Lookbook) và Collection (link + 4 sản phẩm New arrival); badge NEW chữ tối (tương phản), BEST màu nav dark; ảnh card `cover`; chữ parallax gọn trên mobile. User 2026-11-11: không dùng staging — làm và push thẳng lên theme live 161508261959.
- Phase 06 (2026-11-11): `npm run qa` = theme check + Playwright (tests/, target live demo, 3 viewport) + Lighthouse (`scripts/lighthouse.js`). Báo cáo `qa/REPORT-2026-11-11.md`. User 2026-11-11: giữ màu nút #bf7069 như design (a11y test chấp nhận đúng cặp này), giữ sales popup. Baseline visual đã chụp (tests/visual.spec.js-snapshots, win32). Còn mở: test matrix thủ công.
- 2026-11-17: redesign trang con (SPEC Appendix E): banner nhiều lớp `snippets/mc-art.liquid` + sections `mc-banner`, `mc-collection-hero`, `mc-collections-list`, `mc-usp`, `mc-story`, `mc-cart-steps`; sidebar/grid promo collection; main-page title band; article. 6 ảnh art-* (Files). Trang about-us đã tạo.. Đã LIVE + kiểm tra desktop/mobile; ô promo lưới hiện mọi trang (11 sp/trang); chữ accent trên panel hồng dùng ink #9c524c; promo sidebar ẩn < 992px. QA: smoke/flows/a11y pass, baseline visual chụp lại.
- 2026-11-17 (chiều): theo feedback user — chỉ hiện SẢN PHẨM, không người mẫu: 3 ô trang chủ Layered cao bằng nhau (ảnh cut-out PNG), banner mc-art dùng ảnh `stage-*` (cut-out trên nền màu, `scripts/demo/merci-images.ps1` Save-Stage), collection hero + ô list collections lấy ảnh sản phẩm đầu tiên (packshot, multiply trên nền màu), chữ viền tự co theo độ dài. Đã archive 21 sp demo ảnh model + gỡ 28 ảnh model khỏi 7 sp v1 (danh sách khôi phục `qa/removed-model-media.json`). Đã LIVE; smoke/flows/a11y pass; baseline visual chụp lại; visual test hết flaky (2026-11-18: ảnh lazy → eager + decode trước khi chụp full-page). Còn ảnh model ở Instagram strip / lookbook / slideshow trang chủ (ảnh lifestyle) — hỏi user có cần thay không.
- 2026-11-18: user giữ ảnh lifestyle (slideshow, banner lớn trang chủ, Instagram, Lookbook). Test matrix tự động `tests/matrix.spec.js` (13 trang con × 3 viewport, empty state, bàn phím) + project Edge; sửa: Esc đóng cart drawer, FAQ có H1, article tràn ngang tablet. Báo cáo `qa/REPORT-2026-11-18.md` — 156 pass. Còn thủ công (cần user): Theme Editor, Safari/iOS, Firefox, checkout Bogus, tài khoản khách, dữ liệu biên.
- 2026-11-18 (tiếp): dropdown tiền tệ/ngôn ngữ mở xuống; mọi font-size +1px (token body 14px…), chữ nội dung 1.6rem; card hover box mới (Add to cart / Select options + wishlist, compare, quick view); video banner + panel layered làm lại; catalogue demo: 1 món/sản phẩm, chỉ cut-out, mỗi màu 1 ảnh (`scripts/demo/merci-image-tool.js` tách nền + đổi màu, ảnh `demos/merci/images/derived/`); 27 sp v1 → Draft; đổi biến thể ảnh cross-fade. Playwright thêm firefox / webkit / iphone (cần `npx playwright install firefox webkit` trên mỗi máy).
- 2026-11-19: test đủ 7 project (Chrome×3, Edge, Firefox, WebKit, iPhone) 274 pass; sửa tràn ngang About trên iPhone (.mc-story overflow-x: clip); PDP hàng nút không cắt chữ (nút không co nhỏ hơn nhãn, thiếu chỗ thì wishlist xuống hàng); test search rỗng dùng từ khoá vô nghĩa (search Shopify sửa lỗi chính tả); baseline visual chụp lại.
- 2026-11-20: báo có hàng làm **trong theme** (`snippets/restock-form.liquid`, settings "Back-in-stock form" ở main-product): chọn lưu thành email cho store (mặc định) hoặc customer tag `restock-<variant id>`, POST thường qua hCaptcha của Shopify (AJAX bị 403), không tự gửi mail; giá trị hết hàng vẫn chọn được; giữ chỗ app block `@app`. App `apps/iphoenix-restock` tạm gác (merci-demo thuộc org PhoenixCorp) — xem memory `restock-feature`.
- 2026-11-23: sản phẩm hết hàng để xem form báo có hàng (`SOLD_OUT` trong merci-catalogue.js): Leather Chelsea Boots + Quilted Puffer Tote hết toàn bộ, Wide Brim Straw Boater hết màu Black, Crinkle Maxi Skirt hết màu Rust. `demo-import --only products --handles a,b` để upsert vài sản phẩm.
- 2026-11-23 (feedback): nhãn card góc trái; ảnh card `contain` (hiện trọn sp); brand strip = 6 logo tự vẽ (scripts/demo/brand-logos); icon Follow us 2rem; banner cạnh video kiểu **Editorial** (setting panel_style); collection hero **Compact** (~1/3 chiều cao, mobile ẩn ảnh, chip cuộn ngang); sidebar collection bên phải (setting sidebar_position); Sort by -1px; PDP: gallery 5 ảnh (merci-gallery.js: studio + cận cảnh), mũi tên + vuốt + bộ đếm, wishlist xuống hàng Size guide/Compare (setting wishlist_position). Tiền tệ: dùng form localization + market thật; store hiện chỉ bật USD → cần bật thêm tiền tệ trong Settings → Markets. Ngôn ngữ /de /fr đổi chữ theme; nội dung store cần Translate & Adapt.
- 2026-11-23 (chiều): icon thanh toán 5rem; search: cột category 250px, tự liệt kê collection thật khi chưa chọn menu; banner editorial cạnh video dùng ảnh túi Striped Straw Tote. **Tiền tệ:** store không bật được nhiều tiền tệ (gateway không hỗ trợ — `scripts/demo-markets.js` báo lỗi) → theme có **bộ đổi tiền chỉ hiển thị** (`common/js/modules/currency-converter.js`, header settings Currency converter / Converter currencies / Converter note): USD EUR GBP CAD AUD JPY theo tỷ giá công khai của Shopify, ghi chú "thanh toán bằng USD" trong dropdown + trên nút checkout. **Ngôn ngữ:** `node scripts/demo-translate.js merci --store …` nhập bản dịch de/fr (từ điển `demos/merci/translations.js`): tên/mô tả/loại sản phẩm, collection, menu, trang, chữ section của theme live. Store auth đã có scope markets + translations. Đã nhập xong (2026-11-23 tối): sản phẩm 194/194, collection 9/12, link 23/26, menu 6/6, trang 7/7, theme 284/285 chuỗi (de/fr); chạy lại khi thêm nội dung.
- 2026-11-23 (tối): bản dịch de/fr đã nhập xong. Card sản phẩm: bỏ ảnh thứ hai khi hover (mọi template + mega menu + recently viewed), chấm màu click đổi ảnh đúng variant kể cả khi chuột đang trên card (`.is-swatch-picked`). Đã deploy live 161508261959; **chưa chạy lại `npm run qa`** sau lần sửa này.
- Việc tiếp theo: user duyệt layout mới + quyết các mục thủ công trong REPORT-2026-11-18 → phase 07 (docs). Nếu push báo "verify your identity": user mở link xác minh rồi chạy lại.

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
