# Phase 11 — Add-on, app, plugin: tăng tính cạnh tranh sau khi theme hoàn thiện

**Mục tiêu**: tìm và làm các chức năng giúp theme bán chạy hơn (lý do để chọn theme này thay vì đối thủ) hoặc dùng tốt hơn (merchant không phải mua app). Vòng lặp: research → chấm điểm → spec → build → test → doc → release bản 1.x. Agent: `addon-researcher`. Catalog: `addons/CATALOG.md`.

## 1. Ba loại add-on

| Loại | Là gì | Ưu | Nhược | Ví dụ |
|---|---|---|---|---|
| **T — Theme-native** | Liquid + JS module + setting trong theme | Bán kèm theme, không backend, không phí tháng | Không có dữ liệu server, giới hạn bởi Liquid | Wishlist (localStorage), compare, quick view, mega menu, sticky ATC, size chart, countdown, free shipping bar, sales popup |
| **M — Theme + metafield/metaobject** | Theme đọc metafield/metaobject; kèm script/hướng dẫn tạo definition | Dữ liệu sửa được trong admin, không app | Merchant phải tạo definition (giảm bằng script/import JSON) | Swatch màu theo metaobject, size chart theo sp, FAQ, lookbook shoppable, store locator, ingredients/specs tab, badges theo tag |
| **A — App (theme app extension)** | Shopify app riêng (Remix/React Router + app extension block) | Có backend: email, đồng bộ, đánh giá, đếm tồn kho | Phải host, duyệt App Store, support; sản phẩm riêng | Back-in-stock alert, reviews có ảnh, wishlist đồng bộ tài khoản, pre-order + thanh toán sau, bundle discount qua Functions |

Ưu tiên T → M → A. Loại A chỉ khi điểm cao và có kế hoạch kinh doanh riêng (bán trên Shopify App Store, miễn phí cho người mua theme = điểm bán).

## 2. Research
```text
Phase 11 bước 1 (agent addon-researcher):
1. Liệt kê tính năng của 5–8 theme top-selling cùng ngách (ThemeForest + Shopify Theme Store) → ma trận tính năng
   (hàng = tính năng, cột = theme, ô = có/không/ghi chú). Đánh dấu tính năng theme mình chưa có.
2. App phổ biến trong ngách trên Shopify App Store (category: upsell, reviews, wishlist, product options, countdown…):
   tên, số review, giá/tháng → những gì merchant đang trả tiền mà theme có thể làm sẵn.
3. Đọc comment/review của đối thủ (ThemeForest comments, App Store reviews 1–3 sao): yêu cầu lặp lại, phàn nàn.
4. Comment/support của chính theme mình (dán từ ThemeForest) → yêu cầu khách.
5. Thay đổi nền tảng Shopify gần đây (theme blocks, new customer accounts, Checkout extensibility, Functions,
   Markets, Search & Discovery) → cơ hội dùng sớm hơn đối thủ.
Ghi addons/research-<date>.md (nguồn có link). Không copy code của theme/app khác.
```
Nguồn tham khảo local: `../Shella`, `../Riode`, `../Brator`, `../Merci` (xem tính năng/settings, không lấy code/ảnh).

## 3. Chấm điểm & chọn (bảng trong `addons/CATALOG.md`)
Mỗi ý tưởng 1–5 điểm: **Nhu cầu** (×3), **Khác biệt so với đối thủ** (×2), **Thay app trả phí** (×2), **Wow trong demo/listing** (×1), trừ **Công sức** (×2) và **Rủi ro** (perf, support, review từ chối) (×1).
```text
Phase 11 bước 2. Chấm điểm mọi ý tưởng trong research + CATALOG, xếp hạng, đề xuất top 5 cho bản tiếp theo
(kèm loại T/M/A, ước lượng công sức, ảnh hưởng performance). Dừng chờ tôi chọn.
```

## 4. Build từng add-on (`/addon <id>`)
1. **Spec**: `addons/specs/<id>.md` theo `addons/addon-spec.template.md` — user story, setting, block, data (metafield/metaobject), UX desktop/mobile, a11y, perf budget (JS ≤ 10KB gz, lazy init), edge case, cách test, cách viết doc. Duyệt spec.
2. **Build**: module `common/js/modules/<id>.js` (idempotent, init khi phần tử có trên trang), SCSS partial, section/block/snippet, setting **mặc định tắt** nếu ảnh hưởng UX, locale.
3. **M**: script tạo definition (`scripts/setup/<id>-definitions.js` qua Admin GraphQL — skill `shopify-admin`) + JSON mẫu.
4. **A**: repo app riêng (`shopify app init`), theme app extension block; theme chỉ có chỗ đặt block. Spec kinh doanh riêng.
5. **Test**: thêm case vào `tests/flows.spec.js`, chạy `npm run qa` (Lighthouse không tụt > 3 điểm).
6. **Doc + listing**: mục mới trong `documentation/customize.html`, changelog, feature list ThemeForest, page intro ("Skip a dozen apps"), post giới thiệu.
7. **Release**: bump version (minor), `npm run release`, upload update (việc của user).

## Xong khi (mỗi vòng)
- [ ] `addons/research-<date>.md` + bảng điểm cập nhật.
- [ ] Add-on chọn: spec duyệt, build, test pass, doc + changelog + listing cập nhật, version bump.
