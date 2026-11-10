# Test matrix — {{THEME_NAME}} v{{VERSION}} — demo {{DEMO}} — ngày {{DATE}}

Ký hiệu: ✅ pass · ❌ fail (ghi issue + ảnh `qa/issues/`) · ➖ không áp dụng

## 1. Tự động
| Mục | Kết quả | Ghi chú |
|---|---|---|
| `shopify theme check` (0 error) | | |
| Playwright smoke (desktop / tablet / mobile) | | |
| Playwright flows | | |
| axe (0 critical/serious) | | |
| Visual (so baseline) | | |
| Lighthouse mobile: perf / a11y / bp / seo (home, collection, product) | | |

## 2. Theme Editor
- [ ] Thêm từng section từ "Add section" (preset hiển thị đẹp ngay)
- [ ] Xoá / ẩn / sắp xếp section; thêm / xoá / kéo block
- [ ] Mọi setting có hiệu lực (đổi rồi xem); không setting "chết"
- [ ] Đổi color scheme / font / button style toàn site
- [ ] Section render lại trong editor không nhân đôi carousel/event
- [ ] Header/footer group: đổi menu, logo, layout option

## 3. Trang
| Trang | Desktop 1440 | Tablet 768 | Mobile 390 | Empty state |
|---|---|---|---|---|
| Home (mọi demo) | | | | ➖ |
| Collection (filter, sort, grid/list, phân trang) | | | | 0 sp |
| Product (variant, gallery, zoom, sticky ATC, pickup) | | | | sold out / 1 variant / không ảnh |
| Cart drawer + cart page | | | | rỗng |
| Search + predictive | | | | 0 kết quả |
| Blog / article / comment | | | | |
| Page / contact / FAQ / about | | | | |
| Wishlist / compare | | | | rỗng |
| Account: login, register, reset, account, order, addresses | | | | |
| 404 / password / gift card | | | | |

## 4. Chức năng
- [ ] Add to cart từ card / quick view / PDP / wishlist → số lượng giỏ cập nhật
- [ ] Discount, gift card, nhiều tiền tệ, nhiều ngôn ngữ (selector đổi đúng)
- [ ] Checkout tới bước thanh toán (Bogus Gateway)
- [ ] Newsletter + contact form gửi được (thấy trong admin)
- [ ] Popup (newsletter, cookie, sales popup) bật/tắt + không che nội dung mobile

## 5. Dữ liệu biên
- [ ] Tên 120 ký tự · giá 0 · compare-at · 3 option × nhiều value · 20 ảnh · video · 3D model
- [ ] Collection 500 sp · menu 3 cấp nhiều mục · ngôn ngữ chữ dài (DE) · RTL (nếu hỗ trợ)

## 6. Trình duyệt & thiết bị
| Chrome | Edge | Firefox | Safari macOS | Safari iOS | Chrome Android |
|---|---|---|---|---|---|

## 7. Accessibility thủ công
- [ ] Tab qua toàn trang, focus nhìn thấy · menu/drawer/modal: focus trap + Esc · ảnh có alt · contrast đạt AA

## Issues
| # | Mức (🔴/🟡/🔵) | Trang | Mô tả | Ảnh | Trạng thái |
|---|---|---|---|---|---|
