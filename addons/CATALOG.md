# Catalog add-on cho Shopify theme

Loại: **T** theme-native · **M** theme + metafield/metaobject · **A** cần app (theme app extension / backend).
Cột "Có ở" = theme của mình đã có (TM = Top Market, OC = Occasion 2.0). Cập nhật cột Điểm sau mỗi vòng research (công thức ở `phases/11-addons-and-apps.md` §3).

## Đã có trong theme nền (giữ, quảng bá trong listing "Skip a dozen apps")
| Tính năng | Loại | Có ở | Module |
|---|---|---|---|
| Wishlist (localStorage, trang wishlist bảng/lưới/chia sẻ) | T | TM, OC | `wishlist.js`, `wishlist-page.js` |
| Compare sản phẩm | T | TM, OC | `compare.js`, `compare-page.js` |
| Quick view | T | TM, OC | `quick-view.js` |
| Mini cart / cart drawer + free shipping bar | T | TM, OC | `mini-cart.js`, `free-shipping-bar.js` |
| Flash deals / deal of the week countdown | T | TM, OC | `flash-deals-countdown.js`, `deal-product.js` |
| Bundle "Buy 3 get 20% OFF" (hiển thị; discount tạo trong admin) | T | OC | `product-bundle.js` |
| Sales popup "X recently bought" | T | OC | `sales-popup.js` |
| Newsletter popup, cookie consent | T | TM, OC | `newsletter-popup.js`, `cookie-consent.js` |
| Recently viewed, related products | T | TM, OC | `tm-scroller.js` |
| Quick order list / bulk order (B2B) | T | TM, OC | section `bulk-quick-order-list` |
| Lookbook, comparison table, FAQ accordion, store map | T | TM, OC | sections |
| Grid/list collection, swatch hover | T | OC | `collection-view.js`, `swatch-hover.js` |

## Ý tưởng chưa có — ứng viên
| # | Tính năng | Loại | Vì sao bán được | Công sức | Điểm |
|---|---|---|---|---|---|
| 1 | Size chart / size guide theo sản phẩm (metaobject, popup) | M | App size chart phổ biến, ngách thời trang bắt buộc | S | |
| 2 | Color swatch theo metaobject (màu + ảnh pattern) dùng chung card/PDP/filter | M | Shopify chuẩn hoá category metafield; nhiều theme chưa làm tốt | M | |
| 3 | Sticky add-to-cart bar (PDP, mobile) | T | Tăng CR, có trong mọi theme top | S | |
| 4 | Frequently bought together (từ product recommendations complementary) | T | Thay app upsell $10–30/tháng | M | |
| 5 | Cart upsell + gift wrap + order note + delivery date | T | Thay 2–3 app; ngách quà tặng/hoa | M | |
| 6 | Product options nâng cao (khắc chữ, upload ảnh → line item properties) | T | App product options rất đắt | M | |
| 7 | Pre-order / coming soon badge + nút (theo tag/metafield, selling plan nếu có) | M | Ngách điện tử, mỹ phẩm | M | |
| 8 | Back-in-stock form (gửi qua Shopify customer form + tag; app cho email tự động) | T→A | Yêu cầu thường gặp; bản T đơn giản | S / L | |
| 9 | Product reviews hiển thị (đọc metafield `reviews.rating` chuẩn Shopify + block cho app reviews) | M | Tương thích Judge.me/Yotpo; không vỡ layout | S | |
| 10 | Store locator (metaobject cửa hàng + map) | M | Ngách nội thất, offline retail | M | |
| 11 | Shoppable image / lookbook hotspot (block kéo toạ độ) | T | Wow trong demo | M | |
| 12 | Promo popup đa trigger (exit intent, scroll %, thời gian, theo trang) + discount code | T | Thay app popup | M | |
| 13 | Age verification / region notice | T | Ngách rượu, vape, CBD (lưu ý luật) | S | |
| 14 | Mega menu builder nâng cao (block sản phẩm, banner, tab theo collection) | T | Store lớn/siêu thị | M | |
| 15 | Predictive search nâng cao (gợi ý collection/page/article, trending terms) | T | Store nhiều SKU | M | |
| 16 | Theme blocks (Shopify theme blocks mới) cho section linh hoạt | T | Đi trước đối thủ về nền tảng | L | |
| 17 | Video sản phẩm / shoppable video reels | T | Xu hướng social commerce | M | |
| 18 | Dark mode / color scheme switcher | T | Wow trong listing | M | |
| 19 | Demo importer cho người mua (script tạo menu, collection, metaobject, trang mẫu) | M | Giảm support "làm sao giống demo" | L | |
| 20 | App iPhoenix Toolkit: wishlist đồng bộ tài khoản + back-in-stock email + reviews | A | Sản phẩm riêng, miễn phí cho người mua theme | XL | |

Công sức: S ≤ 1 ngày · M 2–4 ngày · L 1–2 tuần · XL > 2 tuần.

## Không nên làm trong theme
- Thay đổi checkout (chỉ qua Checkout extensibility = app).
- Tính giá/discount phía client thay cho discount thật (sai giá ở checkout → review xấu).
- Gọi API bên thứ ba có key trong theme (lộ key).
- Thư viện nặng (jQuery, Swiper full, Lottie) chỉ cho 1 hiệu ứng.
