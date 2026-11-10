# Phase 06 — Môi trường test & QA

**Mục tiêu**: có môi trường test chạy lại được bằng 1 lệnh (`npm run qa`) + store test riêng + test matrix thủ công, để mỗi lần sửa/update biết ngay có vỡ gì không. Đây cũng là bằng chứng chất lượng khi nộp marketplace.

## 1. Ba tầng môi trường

| Tầng | Ở đâu | Dùng để |
|---|---|---|
| Local | `npm run dev` → http://127.0.0.1:9293 (development theme) | Code hằng ngày, hot reload |
| Staging | Store dev **riêng cho test** (`<slug>-test.myshopify.com`), theme unpublished `<Name> – QA` | Chạy test tự động + test matrix; dữ liệu demo đầy đủ + dữ liệu "xấu" (tên dài, không ảnh, hết hàng, 100 variant) |
| Demo | Store demo từng demo, theme live | Người mua xem; chỉ deploy bản đã qua QA |

Tạo store test: Shopify Partner → Stores → Add store → Development store. Bật: customer accounts, 2+ ngôn ngữ, 2+ tiền tệ (Markets), Search & Discovery app, 1 discount tự động, 1 gift card, password page (tạm). Lưu vào `.env.qa` (gitignore): `SHOPIFY_FLAG_STORE=<qa-store>.myshopify.com`, `SHOPIFY_FLAG_THEME=<qa theme id>` (dùng cho `qa:push`) và vào `.env`: `QA_PREVIEW_URL` (`https://<store>/?preview_theme_id=<id>`), `QA_STOREFRONT_PASSWORD`, `QA_PRODUCT_HANDLE`, `QA_COLLECTION`.

## 2. Bộ test tự động (`tests/`)

Copy từ `.claude/playbook/templates/tests/` (đã có sẵn trong kit):

| File | Kiểm tra |
|---|---|
| `playwright.config.js` | Project desktop 1440 / tablet 768 / mobile 390, baseURL = `QA_PREVIEW_URL` hoặc local |
| `tests/smoke.spec.js` | Trang chủ, collection, product, cart, search, 404 load 200, không lỗi console, không ảnh vỡ, không tràn ngang |
| `tests/flows.spec.js` | Đổi variant → giá/ảnh đổi; add to cart → cart drawer + số lượng; quick view; wishlist; compare; filter + sort; search predictive; newsletter form |
| `tests/a11y.spec.js` | axe-core: không có vi phạm `critical`/`serious` trên 6 trang chính |
| `tests/visual.spec.js` | Screenshot so baseline (`toHaveScreenshot`) — baseline chụp sau khi user duyệt design |
| `scripts/lighthouse.js` | Lighthouse mobile + desktop trên trang chủ / collection / product, ghi `qa/lighthouse-<date>.json` |

Scripts trong `package.json` (hỏi user trước khi thêm dependency: `@playwright/test`, `@axe-core/playwright`, `lighthouse`, `chrome-launcher`). Vị trí: `playwright.config.js` ở project root, `*.spec.js` + `helpers.js` trong `tests/`, `lighthouse.js` trong `scripts/`:
```json
"qa": "npm-run-all qa:check qa:e2e qa:lh",
"qa:check": "shopify theme check --fail-level error",
"qa:e2e": "playwright test",
"qa:visual:update": "playwright test tests/visual.spec.js --update-snapshots",
"qa:lh": "node scripts/lighthouse.js",
"qa:push": "npm run build && dotenv -e .env.qa -- shopify theme push"
```

Ngưỡng (bám yêu cầu Shopify Theme Store, chặt hơn ThemeForest — kiểm tra lại bản mới nhất trước khi nộp):
- Lighthouse performance trung bình ≥ 60 (mục tiêu ≥ 70 mobile), accessibility ≥ 90, best practices ≥ 90, SEO ≥ 90.
- 0 lỗi `theme check` mức error; 0 lỗi console; 0 vi phạm axe critical/serious.

## 3. Test matrix thủ công (`templates/test-checklist.md`)
Agent `qa-tester` đi qua bằng chrome-devtools MCP, chụp ảnh lỗi vào `qa/issues/`, ghi `qa/REPORT-<date>.md`:
- **Theme Editor**: thêm/xoá/sắp xếp mọi section + block; mọi setting có tác dụng; preset hiển thị đúng; `shopify:section:load` không nhân đôi event (module idempotent).
- **Trình duyệt**: Chrome, Edge, Firefox, Safari (macOS/iOS — nhờ BrowserStack hoặc máy thật), Chrome Android.
- **Dữ liệu biên**: tên sp 120 ký tự, không ảnh, 1 ảnh, 20 ảnh, giá 0, compare-at, sold out, pre-order, 3 option × nhiều value, collection 0 sp, 500 sp + phân trang.
- **Thương mại**: checkout tới bước thanh toán (Bogus Gateway), discount, gift card, nhiều tiền tệ/ngôn ngữ, customer account (đăng ký, đăng nhập, đơn hàng, địa chỉ).
- **RTL** (nếu bán thị trường Ả Rập): `dir=rtl` không vỡ layout.
- **Bàn phím & screen reader**: tab qua menu, mega menu, drawer, modal (focus trap, Esc đóng).

## Prompt
```text
Phase 06. Dựng môi trường test theo .claude/playbook/phases/06-test-environment.md:
1. Đề xuất dependency (Playwright, axe, lighthouse) — chờ tôi đồng ý rồi cài.
2. Copy templates/tests/* vào project, chỉnh selector theo markup của theme (data-testid nếu cần — thêm thuộc tính, không đổi class).
3. Thêm scripts qa:* vào package.json, biến QA_* vào .env.example.
4. Hướng dẫn tôi tạo store test (việc trong admin), sau đó qa:push theme lên theme unpublished của store test.
5. Chạy npm run qa, chụp baseline visual sau khi tôi duyệt, rồi agent qa-tester chạy test matrix thủ công.
6. Viết qa/REPORT-<date>.md: bảng pass/fail, Lighthouse, lỗi kèm ảnh + mức độ; sửa lỗi 🔴, chạy lại tới khi pass.
7. (Tuỳ chọn) GitHub Action .github/workflows/qa.yml chạy qa:check + qa:e2e trên local dev theme khi push PR.
```

## Xong khi
- [ ] `npm run qa` chạy 1 lệnh, pass ngưỡng.
- [ ] Store test + theme QA có trong memory; `qa/REPORT-<date>.md` mới nhất không còn 🔴.
- [ ] Baseline visual đã chụp; test matrix đã đi hết cho mọi demo.
