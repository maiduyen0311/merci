# Add-on spec: {{addon-id}}

- **Tên hiển thị**: {{Size chart}}          **Loại**: T / M / A          **Version đưa vào**: {{1.1.0}}
- **Điểm (CATALOG)**: {{..}}                **Công sức**: S / M / L / XL

## 1. Vấn đề & người dùng
- Merchant muốn: …
- Khách mua muốn: …
- Hiện merchant đang dùng app nào / trả bao nhiêu: …

## 2. Đối thủ làm thế nào
| Theme/App | Cách làm | Điểm hay | Điểm dở |
|---|---|---|---|

## 3. UX
- Desktop: … (ảnh mockup `addons/specs/{{id}}/desktop.png`)
- Mobile: …
- Trạng thái: mặc định / loading / rỗng / lỗi.
- A11y: role, aria, focus trap, Esc, bàn phím.

## 4. Cấu hình (merchant)
| Nơi | Setting id | Kiểu | Default | Ghi chú |
|---|---|---|---|---|
| Theme settings › … | `{{id}}_enable` | checkbox | false | |

## 5. Dữ liệu
- Metafield / metaobject definition (namespace.key, type), script tạo: `scripts/setup/{{id}}-definitions.js`.
- Line item properties / cart attributes (nếu có).

## 6. Kỹ thuật
- File: `common/js/modules/{{id}}.js`, `common/scss/section/_{{id}}.scss`, `snippets/{{id}}.liquid`, …
- Init: idempotent (`dataset.bound`), chỉ khi có phần tử; chạy lại trên `shopify:section:load`.
- Perf budget: JS ≤ 10KB gzip, không request thêm khi tắt; Lighthouse không tụt > 3 điểm.

## 7. Test
- Playwright: …  · Test matrix thủ công: …  · Edge case: …

## 8. Tài liệu & bán hàng
- Mục documentation: …  · Dòng changelog: …  · Feature listing / page intro: …  · Post giới thiệu: …
