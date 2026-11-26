# Merci — Danh sách chức năng (rà soát + phân tích đóng gói)

Cập nhật: 2026-11-26 · Demo: https://merci-demo.myshopify.com (theme live 161508261959)

File này dùng để rà soát toàn bộ chức năng trên site, rồi quyết định chức năng nào **có trong gói bán**
(ThemeForest), chức năng nào **chỉ có trên demo để bán customize**. Quyết định đã chốt nằm ở
`.claude/memory/packaging-scope.md`; file này là bản tổng hợp để đọc.

**Ký hiệu cột "Trạng thái"**

| Ký hiệu | Nghĩa |
|---|---|
| ✅ Gói | Có trong gói bán + docs, đang bật trên demo |
| 💼 Customize | Chỉ có trên demo, gỡ khỏi gói, giới thiệu như dịch vụ customize ("không kèm trong file tải") — **đã chốt** |
| ❓ Chưa chốt | Đang có trong gói, cần quyết lại (xem Phần B) |
| 🔧 Kế thừa | Có sẵn từ theme nền Top-market / Dawn, Merci restyle lại |

Cột "Nguồn": **Merci** = làm cho Merci (phase 05+); **N1 / N2 / N3** = nhóm tính năng làm thêm 2026-11-25 → 26;
**Nền** = kế thừa.

---

## PHẦN A — Danh sách chức năng

### A1. Header & điều hướng

| Chức năng | Mô tả ngắn | Cài đặt | Nguồn | Trạng thái |
|---|---|---|---|---|
| Header Merci (logo giữa) | Hàng 1: tiền tệ · ngôn ngữ · search / logo / tài khoản · wishlist · so sánh · giỏ. Hàng 2: menu. Trang chủ: trong suốt đè lên hero, cuộn xuống thành nền trắng | Header → layout `centered` | Merci | ✅ Gói |
| Mega menu | Shop: cột link + "Editor's pick" + banner Lookbook. Collection: link + 4 sản phẩm | Header blocks Mega menu | Merci | ✅ Gói |
| Header dính khi cuộn | Header cố định ở đầu khi cuộn | Header | Nền | ✅ Gói |
| **Thanh thông báo đầu trang** | Nhiều câu luân phiên hoặc chữ chạy; đếm ngược theo ngày cố định hoặc lặp mỗi ngày tới giờ chốt; nút đóng | Section *Announcement bar* (header group) | N3 #12 | ✅ Gói |
| Menu mobile (drawer) | Menu trượt, liên hệ, tiền tệ, ngôn ngữ | Header | Nền | ✅ Gói |
| **Thanh điều hướng đáy (mobile)** | Home · Menu · Search · Wishlist · Cart (+ Account); ẩn khi cuộn xuống; nhường chỗ cho thanh mua dính đáy | Theme settings → Mobile bottom bar | N2 #8 | ✅ Gói |

### A2. Tìm kiếm

| Chức năng | Mô tả ngắn | Cài đặt | Nguồn | Trạng thái |
|---|---|---|---|---|
| Tìm kiếm theo danh mục | Ô search + chọn collection (cột 250px), tự liệt kê collection thật khi chưa chọn menu | Header | Merci | ✅ Gói |
| Gợi ý khi gõ (predictive) | Sản phẩm, collection, trang, bài viết | Search behavior | Nền | ✅ Gói |
| **Gợi ý tìm kiếm thông minh** | Ô trống: tìm gần đây (lưu trên máy khách) + từ khoá phổ biến + sản phẩm hot. Không có kết quả: gợi ý thay cho trang trống (dropdown + trang search). Esc đóng | Search behavior → Search suggestions | N3 #9 | ✅ Gói |

### A3. Trang chủ — sections (thứ tự trên demo)

| Section | Mô tả | Nguồn | Trạng thái |
|---|---|---|---|
| Slideshow (`mc-slideshow`) | Hero nhiều slide | Merci | ✅ Gói |
| Text columns (`mc-text-columns`) | 3 ô dịch vụ | Merci | ✅ Gói |
| Video banner (`mc-video-banner`) | Video popup + panel layered/editorial bên cạnh | Merci | ✅ Gói |
| Products (`mc-products`) — Trending | Carousel/lưới sản phẩm | Merci | ✅ Gói |
| **Shop the look** (`mc-shop-the-look`) | Ảnh flat-lay + điểm chấm sản phẩm, chọn biến thể, "Add the whole look" | N2 #6 | 💼 Customize |
| Image tiles (`mc-image-tiles`) | 3 ô layered | Merci | ✅ Gói |
| Products — New arrival | Lưới sản phẩm | Merci | ✅ Gói |
| **Shoppable videos** (`mc-video-reels`) | Video dọc tự phát + chip sản phẩm; viewer lớn có tiếng, prev/next/vuốt, thêm vào giỏ | N2 #5 | 💼 Customize |
| Parallax banner (`mc-parallax-banner`) | Banner parallax | Merci | ✅ Gói |
| Banners (`mc-image-tiles`), Blog posts (`mc-blog-posts`), Brand logos + Instagram (`mc-image-strip`) | Banner, bài blog, 6 logo tự vẽ, lưới ảnh | Merci | ✅ Gói |

Ngoài ra còn **~15 section `home-*` cũ của Top-market** (flash deals, deal product, best selling, promo grid,
testimonials, cta banner…) không dùng trên demo Merci — xem B4.

### A4. Collection

| Chức năng | Mô tả ngắn | Nguồn | Trạng thái |
|---|---|---|---|
| Collection hero Compact | Banner ~1/3 chiều cao, chip collection cuộn ngang; mobile ẩn ảnh | Merci | ✅ Gói |
| Bộ lọc + sắp xếp | Filter Shopify, sidebar trái/phải (setting), drawer trên mobile, đổi dạng lưới | Nền + Merci | ✅ Gói |
| Ô promo trong lưới / sidebar | Ô quảng cáo chen giữa sản phẩm | Merci | ✅ Gói |
| Phân trang, đếm sản phẩm | | Nền | ✅ Gói |

### A5. Card sản phẩm

| Chức năng | Mô tả ngắn | Cài đặt | Nguồn | Trạng thái |
|---|---|---|---|---|
| Card Merci + ô hover | Add to cart / Select options + wishlist, so sánh, quick view | Cards, Merci — Quick view | Merci | ✅ Gói |
| Chấm màu đổi ảnh | Click chấm màu đổi ảnh đúng biến thể | | Merci | ✅ Gói |
| Nhãn | Sale %, NEW tự động, HOT/BEST (metafield), Sold out, **PRE-ORDER** | Badges | Nền + Merci | ✅ Gói |
| **Thêm nhanh trên card** | Hover hiện chip size, 1 click thêm theo màu đang chọn; sp chỉ có màu → nút Add to cart | `card_quick_add` | N1 #1 | ✅ Gói |
| Quick view | Hộp xem nhanh, chọn biến thể, thêm giỏ | Merci — Quick view | Nền + Merci | ✅ Gói |
| Wishlist / So sánh | Lưu trên máy khách; trang Wishlist, trang Compare | | Nền | ✅ Gói |

### A6. Trang sản phẩm

| Chức năng | Mô tả ngắn | Nguồn | Trạng thái |
|---|---|---|---|
| Gallery 5 ảnh | Mũi tên, vuốt, bộ đếm, zoom; đổi màu đổi ảnh | Merci | ✅ Gói |
| Chọn biến thể dạng nút/chấm | Giá trị hết hàng gạch chéo | Nền + Merci | ✅ Gói |
| Thông tin sản phẩm | Rating, SKU, tình trạng, vendor, loại; "N sold in last H hours" và "Offer ends in" **chỉ lấy số thật từ metafield** | Merci | ✅ Gói |
| Cảnh báo tồn kho thấp | "Last 3!" theo tồn kho thật | Nền | ✅ Gói |
| "Live viewers" | **Số cố định, không phải người xem thật** — mặc định tắt, có cảnh báo trong setting | Nền | ❓ Chưa chốt (B3) |
| Size guide / Share / Compare / Wishlist (hàng action) | | Nền + Merci | ✅ Gói |
| **Find my size** | Nhập chiều cao/cân nặng + kiểu mặc → đề xuất size + "Select size M" | N2 #7 | ✅ Gói |
| **Ngày giao tự tính** | "Estimated Delivery: Tue, Dec 1 – Thu, Dec 3" theo ngày làm việc, giờ store + "Order within 10h 46m to ship today" | N1 #4 | ✅ Gói |
| **Pre-order** | Tồn 0 + "tiếp tục bán" hoặc tag `pre-order` → nút PRE-ORDER, "Pre-order — ships in 3–4 weeks / from Dec 15", ghi chú trên đơn, ẩn ngày giao | N3 #10 | ❓ Chưa chốt (B2) |
| **Notify me (báo có hàng)** | Form email cho biến thể hết hàng (gửi về email store hoặc tag khách) | Merci | 💼 Customize |
| Nút mua | Add to cart AJAX, Buy it now, subtotal, gói thanh toán (selling plans), thẻ quà tặng | Nền | ✅ Gói |
| Thanh mua dính đáy | Hiện khi đã cuộn qua nút mua; nhãn đổi theo biến thể | Nền + Merci | ✅ Gói |
| Nhận tại cửa hàng | Pickup availability của Shopify | Nền | ✅ Gói |
| Bundle "mua nhiều giảm" | Có trong code, **tắt trên demo** | Nền | ❓ Chưa chốt (B4) |
| Tabs, USP, banner, reviews, related, recently viewed | Sections dưới sản phẩm | Nền + Merci | ✅ Gói |

### A7. Giỏ hàng

| Chức năng | Mô tả ngắn | Nguồn | Trạng thái |
|---|---|---|---|
| Cart drawer | Ghi chú, gói quà, mã giảm giá, ước tính ship | Nền + Merci | ✅ Gói |
| **Gợi ý trong cart drawer** | "Complete the look" — Shopify recommendations + thêm nhanh | N1 #2 | ✅ Gói |
| **Thanh thưởng nhiều mốc** | $75 free ship · $150 −10% · $250 −15% (**chỉ hiển thị** — chủ shop tự tạo discount tự động) | N1 #3 | ✅ Gói |
| Trang giỏ hàng | Các bước, danh sách, tổng, USP | Merci | ✅ Gói |

### A8. Popup & lớp phủ

| Chức năng | Mô tả ngắn | Trên demo | Nguồn | Trạng thái |
|---|---|---|---|---|
| Popup newsletter | Hiện sau X giây | Bật | Nền | ✅ Gói — #11 sẽ thêm chế độ "khi sắp rời trang" |
| Cookie banner | Chấp nhận / từ chối / tuỳ chỉnh theo nhóm | Bật | Nền | ✅ Gói |
| Sales popup | "Ai đó vừa mua …" — **chủ shop tự nhập từng dòng** (không phải đơn thật) | Bật | Nền | ❓ Chưa chốt (B3) |
| Social proof popup | Tương tự sales popup | Tắt | Nền | ❓ Chưa chốt (B3) |
| Toast thêm giỏ | Thông báo nhỏ | Bật | Nền | ✅ Gói |

### A9. Quốc tế hoá

| Chức năng | Mô tả ngắn | Nguồn | Trạng thái |
|---|---|---|---|
| Đổi ngôn ngữ | Form Shopify; 31 file ngôn ngữ (en/de/fr dịch đủ, các ngôn ngữ khác còn ~170 chuỗi tiếng Anh) | Nền + Merci | ✅ Gói |
| Đổi tiền tệ (market thật) | Khi store bật nhiều tiền tệ | Nền | ✅ Gói |
| **Bộ đổi tiền chỉ hiển thị** | Store 1 tiền tệ: hiện giá EUR/GBP/JPY… theo tỷ giá Shopify, ghi chú "thanh toán bằng USD"; cờ theo mã tiền | Merci | ✅ Gói |

### A10. Trang phụ & tài khoản

About, Contact, FAQ (+ bảng so sánh tắt), Lookbook (ảnh + điểm sản phẩm), Blog + bài viết, Wishlist, Compare,
404, Password, toàn bộ trang tài khoản khách (đăng nhập, đăng ký, đơn hàng, địa chỉ). Nguồn: Nền + Merci. ✅ Gói.

### A11. Công cụ cho iPhoenix (không bán, không vào gói)

| Công cụ | Dùng để |
|---|---|
| `scripts/demo/merci.js` + `scripts/demo-import.js` | Sinh và nhập dữ liệu demo (sản phẩm, collection, menu, trang, ảnh) |
| `scripts/demo-translate.js`, `scripts/locales-fill.js` | Nhập bản dịch de/fr, kiểm chuỗi chưa dịch |
| `scripts/demo/merci-flatlay.js`, `merci-reels.js`, `merci-gallery.js`, `merci-image-tool.js` | Tạo ảnh flat-lay, upload video, ảnh gallery, tách nền / đổi màu |
| `tests/` (Playwright 7 trình duyệt), `scripts/lighthouse.js` | QA — 297 test pass ở lần chạy đủ gần nhất |

---

## PHẦN B — Phân tích: gói bán hay customize?

### B1. Tiêu chí

Một chức năng **nên vào gói** khi:
1. Người mua theme thời trang **mong đợi có sẵn** (đối thủ cùng giá đều có), hoặc làm theme nổi bật trong ảnh/mô tả.
2. Chạy **chỉ bằng dữ liệu Shopify có sẵn** — người mua cài xong là dùng được, không cần chuẩn bị nội dung đặc biệt.
3. **Ít phát sinh hỗ trợ** — cài đặt rõ ràng, khó cấu hình sai.

Một chức năng **nên để customize** khi:
1. Thị trường đang **bán thành app trả phí hằng tháng** → người mua sẵn sàng trả tiền riêng.
2. **Cần nội dung riêng** để đẹp (video, ảnh flat-lay, toạ độ điểm chấm) → đằng nào cũng cần người làm giúp.
3. **Mỗi shop cần khác nhau** (quy trình, email, kho) → dễ thành ticket hỗ trợ nếu phát miễn phí.

Lưu ý Envato: mô tả và ảnh quảng cáo phải **khớp đúng file tải về**. Chức năng customize luôn ghi
"available as a customization service — not included in the download".

### B2. Đề xuất theo từng nhóm

**Giữ trong gói (đồng ý với quyết định hiện tại)**

| Chức năng | Lý do |
|---|---|
| Nhóm 1: thêm nhanh trên card, gợi ý trong giỏ, thanh thưởng, ngày giao | Tăng đơn trực tiếp, dữ liệu Shopify sẵn, là điểm bán chính trong mô tả |
| Find my size, thanh đáy mobile | Thời trang rất cần; cấu hình đơn giản (bảng size) |
| Gợi ý tìm kiếm thông minh | Người mua mong đợi; không cần dữ liệu đặc biệt |
| Thanh thông báo + đếm ngược | Gần như theme nào cũng có; kiểu "lặp mỗi ngày" là điểm khác biệt nhỏ |
| Bộ đổi tiền chỉ hiển thị | Giải quyết vấn đề thật của shop không bật được Shopify Payments; ghi rõ trong docs là chỉ hiển thị |

**Đã chốt customize (đồng ý)**

| Chức năng | Lý do |
|---|---|
| Notify me | App báo có hàng thu phí tháng (Klaviyo, Back in Stock…) → bán được; mỗi shop cần quy trình khác (email store / tag khách / app) |
| Shoppable videos | Cần video riêng (bản quyền!) + gắn sản phẩm — đúng kiểu dịch vụ làm giúp; app tương tự (Tolstoy, Videowise) thu phí cao |
| Shop the look | Cần ảnh flat-lay + toạ độ điểm chấm cho từng look → luôn cần người làm |

**❓ Cần quyết: Pre-order (#10)** — hiện đang tính vào gói.
- Lý do đưa vào **customize**: app pre-order (PreProduct, Timesact…) thu phí tháng; bản theme chỉ là "nhãn + ghi chú"
  (khách trả đủ tiền ngay, không có đặt cọc, không có email riêng) → người cần thật sự thường muốn thêm phần
  đặt cọc / giới hạn số lượng = việc customize.
- Lý do giữ **trong gói**: code nhỏ, chạy bằng cơ chế có sẵn của Shopify (Continue selling), là dòng đẹp trong
  danh sách tính năng; nó cũng là "bản cơ bản" để rao bán gói nâng cấp (đặt cọc, giới hạn số lượng).
- **Đề xuất: giữ trong gói** bản cơ bản, và rao bán gói nâng cấp "Pre-order + đặt cọc" như customize.

### B3. Tính năng "thúc giục" — rủi ro uy tín

| Chức năng | Vấn đề | Đề xuất |
|---|---|---|
| Live viewers | Số cố định, không phải người xem thật. EU (Omnibus) và FTC coi là gây hiểu lầm; reviewer Envato có thể nhắc | **Gỡ khỏi gói** (hoặc giữ nhưng tắt + cảnh báo như hiện nay). Không bật trên demo |
| Sales popup / Social proof | Chủ shop tự nhập "ai đó vừa mua" — dễ thành đơn bịa | Giữ trong gói nhưng docs khuyên dùng đơn thật; demo **chỉ giữ 1 trong 2** (đang bật Sales popup) và không hiện cùng lúc cookie banner |
| Offer countdown, "N sold in last H hours" | Lấy số thật từ metafield, hết hạn tự ẩn | Giữ — ổn |

### B4. Phần thừa kế thừa từ Top-market (nên dọn trước khi đóng gói)

- ~15 section `home-*` (flash deals, deal product, best selling, promo grid, testimonials, cta banner, script
  banner…) **không dùng trên demo Merci** và chưa restyle theo design Merci. Người mua kéo vào sẽ thấy lệch
  phong cách → ticket hỗ trợ, reviewer có thể đánh giá kém.
  **Đề xuất:** hoặc restyle 3–4 cái đáng giữ (flash deals, testimonials, best selling), hoặc ẩn khỏi gói
  (không có preset → không thêm được từ Theme Editor) rồi gỡ hẳn ở bản sau.
- Bundle "buy more, save more" trên PDP: tắt trên demo, chưa kiểm tra lại sau khi restyle → hoặc kiểm tra
  + bật 1 sản phẩm demo, hoặc gỡ.
- Quick order list / bulk order (B2B của Dawn): không dùng → gỡ khỏi gói cho gọn.

### B5. Tóm tắt đề xuất

| | Chức năng |
|---|---|
| **Trong gói, bật trên demo** | Header + mega menu + thanh thông báo, thanh đáy mobile, search thông minh, card Merci + thêm nhanh + quick view + wishlist/compare, PDP (gallery, Find my size, ngày giao, pre-order cơ bản, thanh dính), cart drawer + gợi ý + thanh thưởng, bộ đổi tiền, đa ngôn ngữ, mọi trang phụ |
| **Trong gói, tắt trên demo** | Social proof popup, live viewers (hoặc gỡ), bundle (nếu giữ) |
| **Customize (chỉ demo)** | Notify me, Shoppable videos, Shop the look, gói nâng cấp Pre-order + đặt cọc |
| **Dọn trước khi đóng gói** | Section `home-*` cũ, quick order list, các chuỗi ngôn ngữ còn tiếng Anh (ngoài en/de/fr) |

### B6. Việc còn lại của Nhóm 3

- #11: thêm chế độ "khi sắp rời trang" cho popup newsletter (không làm popup mới).
- Dọn lớp phủ demo: newsletter không hiện ngay khi vào trang; cookie banner và sales popup không cùng lúc.
- Lỗi test có sẵn: ảnh chụp so sánh đang che kín màn hình đầu (mask `cart-drawer`) → header/hero chưa được so ảnh.
