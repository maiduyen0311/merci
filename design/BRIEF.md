# BRIEF — Merci

> Phase 00 · 2026-11-10 · trạng thái: **chờ duyệt**

## 1. Tóm tắt
- Ngách / ngành hàng: thời trang nữ (váy, denim, áo sơ mi, hoodie, áo khoác, đồ bơi, phụ kiện).
- Khách hàng mục tiêu (merchant): boutique / brand thời trang nhỏ–vừa, 50–2.000 SKU, nhiều variant size/màu; thị trường US/EU, đa tiền tệ (USD, CAD, EUR, GBP), đa ngôn ngữ (EN, DE như store cũ).
- Lời hứa chính: "Merci — theme thời trang thanh lịch, nhiều banner editorial và lookbook, giúp boutique nhỏ có store kiểu tạp chí mà không cần app."
- Giá dự kiến: $59 (cần user xác nhận) · Item: **làm lại bản 2.0** của theme Merci cũ (Debut + jQuery, Theme Kit) — cần user xác nhận đã từng bán trên ThemeForest chưa.

## 2. Đầu vào design
- **Option**: A (biến thể "design = storefront đang live"). Lý do: không có PSD/Figma, nhưng có store đã style đủ trang (Home, Collection, Product, Cart, Blog, Lookbook, FAQ, Contact, Wishlist, Compare) tại https://merci-demo.myshopify.com/ (theme đang publish). Nguồn sự thật = **render của theme live**: chụp màn hình desktop 1440 / mobile 390, đo computed style (màu, font, size, spacing) bằng chrome-devtools, đối chiếu CSS cũ ở `../legacy-source/assets/theme.css` + `custom-styles.css`.
- Không có design mobile riêng → lấy bản responsive đang chạy làm mốc, chỗ xấu ghi "đề xuất — cần duyệt".
- File tham chiếu:

| file | loại | ghi chú |
|---|---|---|
| https://merci-demo.myshopify.com/ (theme live) | storefront | design gốc — sẽ chụp/đo ở phase 02A |
| `../legacy-source/` | code theme cũ (Debut 13.1 + jQuery, theme_id 120883249223, 01/2024) | tra CSS/markup, id class; KHÔNG copy jQuery |
| `../merci_051022/` | code theme cũ (05/2022, theme_id 120965922887, git MC-16) | tham khảo lịch sử fix |
| `../banner/` (16 + resize) | ảnh banner | license chưa rõ |
| `../product/` (50) | ảnh sản phẩm | license chưa rõ |
| `../instagram/` (~20) | ảnh lifestyle | tên file kiểu Freepik → nhiều khả năng cấm phân phối trong zip |

- Font + license web: chưa đo — xác định ở phase 02A từ computed style; nếu không có trên Google Fonts / Shopify font library → đề xuất font thay.
- Ảnh: có cho demo (3 thư mục trên) nhưng **chưa có license** → ghi vào `IMAGE-CREDITS.md`; ảnh không chứng minh được license chỉ dùng trên store demo, trong zip bán thay bằng placeholder.

## 3. Đối thủ

| Theme | Marketplace | Giá | Sales / review | Số demo | Tính năng nổi bật | Bị chê |
|---|---|---|---|---|---|---|
| [Prestige](https://themes.shopify.com/themes/prestige) (Maestrooo) | Shopify Theme Store | ~$400 | ~91% / 860+ review | 3–4 | editorial, luxury, mega menu, sticky header, search mạnh | đắt, ít layout trang chủ |
| [Impulse](https://themes.shopify.com/themes/impulse) (Archetype) | Shopify Theme Store | ~$380–400 | ~95% | 3–4 | countdown, hotspot/lookbook, upsell, promo grid | nặng, nhiều setting rối |
| [Broadcast](https://themes.shopify.com/themes/broadcast) | Shopify Theme Store | ~$360–420 | ~93% | 3 | streetwear/modern fashion, urgency, điều hướng mượt | phong cách ít linh hoạt |
| [Be Yours](https://themes.shopify.com/themes/be-yours) (RoarTheme) | Shopify Theme Store | ~$350 | 98% / 675 review | 5+ | fashion tối giản, quick view, cart drawer | — |
| [Milana](https://themeforest.net/category/ecommerce/shopify?term=fashion) | ThemeForest | $49 | ~106 sales | nhiều | multipurpose fashion OS 2.0 | ít sales → chất lượng/hỗ trợ không chắc |

Nguồn tổng hợp: [fudge.ai](https://www.fudge.ai/blog/best-shopify-themes-for-fashion/), [gempages](https://gempages.net/blogs/shopify/shopify-fashion-themes), [smartaddons](https://www.smartaddons.com/shopify-themes/themes-on-themeforest). Số liệu là ảnh chụp thời điểm, cần kiểm lại trên trang listing trước phase 09.

Kết luận:
- **Phải bằng**: mega menu có ảnh, quick view + cart drawer, swatch màu/size trên card, lookbook/hotspot, filter sidebar + drawer mobile, đa tiền tệ/ngôn ngữ.
- **Phải hơn**: nhẹ (không jQuery, Lighthouse mobile ≥ 80), giá ThemeForest rẻ hơn nhiều so với Theme Store, wishlist + compare + lookbook có sẵn không cần app, nhiều layout PDP (gallery left/right/top, tabs/accordion, fullwidth — như menu Shop của bản cũ).

## 4. Demo

| Demo | Phong cách | Store | Trạng thái design |
|---|---|---|---|
| Demo 1 — Merci Classic | bản đang live: hồng đất `#bf7069` (link hover trong schema cũ), editorial, banner nhiều | merci-demo.myshopify.com | có (storefront live) |
| Demo 2, 3 | chưa có — đề xuất làm sau v1.0 | — | — |

## 5. Inventory

### Section trang chủ (thứ tự theo storefront live)

| # | id | Mô tả | So với Top Market | Ảnh tham chiếu |
|---|---|---|---|---|
| 1 | `announcement` (header-group) | topbar: social, wishlist, account dropdown, currency, language | EDIT `header.liquid` | phase 02A |
| 2 | `header` | logo, search, account, cart; mega menu ảnh (Shop, Collection, Lookbook) | EDIT `header.liquid` + mega menu | " |
| 3 | `home-hero` | slideshow "New arrivals / Enjoy this summer trend" + nút | EDIT `home-hero` | " |
| 4 | `home-promo-grid` | 2 promo banner: "Hot trend summer", "Stock limit top dress – sale 40%" | EDIT `home-promo-grid` | " |
| 5 | `home-services-bar` | 3 banner chữ: New styles / Visit us in store / Buy now pay later | EDIT `home-services-bar` (hoặc `banner-row`) | " |
| 6 | `home-trending-row` | "Woman / Trending" — carousel sản phẩm, swatch size, nút show more | EDIT `home-trending-row` | " |
| 7 | `home-collection-tiles` | 3 ô ảnh collection: New arrivals / Valkyrio sale 30% / Maria collection | NEW (gần `home-dual-banner` 3 cột) | " |
| 8 | `home-new-arrivals` | grid sản phẩm có badge Hot/New, sale, show more | EDIT `home-new-arrivals` | " |
| 9 | `home-parallax-banner` | banner parallax "Spring woman / A summer ride" | NEW (mở rộng `image-banner` thêm parallax) | " |
| 10 | `home-dual-banner` | 2 ô: "Plaid swimsuit #maystore", "Sale up to 50% #sweatshirt" | EDIT `home-dual-banner` | " |
| 11 | `home-latest-news` | 3 bài blog mới nhất | EDIT `home-latest-news` | " |
| 12 | `home-instagram` | "@merci_shop — Follow us on instagram" grid ảnh | EDIT `home-instagram` | " |
| 13 | `newsletter` (footer-group) | "Sign up to receive our latest news & events" | EDIT `newsletter` (sửa typo "recelve") | " |
| 14 | `footer` | intro text, cột My account / Link / Follow us, payment icons, copyright | EDIT `footer.liquid` | " |

Section Top Market không dùng ở demo Merci (giữ lại làm tính năng bán): `home-flash-deals`, `home-deal-product` (bản cũ có countdown), `home-brand-logos`, `testimonials-carousel`, `collection-circles`, `video-banner`, `home-script-banner`, `home-cta-banner`, `brand-story`, `sales-popup`.

### Trang con & state

| Template / state | Có design? | Ghi chú |
|---|---|---|
| collection (filter left, normal grid, metro grid, masonry grid) | có (live) | 4 layout = setting của `main-collection-product-grid`, không tách template |
| product (single slideshow, gallery left/right/top, tab, accordion, fullwidth) | có (live) | 7 layout = setting/alternate template `product.*.json` |
| cart + cart drawer (mini cart) | có | dùng `cart-drawer` của Top Market |
| search + predictive search | có | |
| blog, article (blog sidebar) | có | |
| page.lookbook | có | `lookbook.liquid` (hotspot) |
| page.faq, page.contact, page (thường) | có | |
| page.wishlist, page.compare | có | Top Market đã có |
| list-collections | có | |
| account: login, register, account, order, addresses, reset, activate | có (Debut mặc định) | restyle theo token |
| 404, password, gift card | có | |
| state: mega menu, mobile menu, quick view, account dropdown, currency/lang, wishlist modal, newsletter popup | có | đo ở phase 02A |

## 6. Kế hoạch phase

| Phase | Ước lượng | Rủi ro |
|---|---|---|
| 01 Scaffold (đổi tên Top Market → Merci, dọn demo cũ, `.env`, build/check/dev) | 1 phiên | store chỉ có quyền theme Debut cũ; cần đăng nhập CLI |
| 02A Đo storefront live → `SPEC.md` + ảnh từng section/state | 2 phiên | storefront rate-limit 429 khi fetch nhiều; font cũ có thể không có license web |
| 03 Tokens, header, footer, card sản phẩm | 2 phiên | mega menu 3 kiểu khác nhau |
| 04 14 section trang chủ (2 NEW, 12 EDIT) | 3–4 phiên | parallax + carousel phải nhẹ, không jQuery |
| 05 Trang con + 7 layout PDP + 4 layout collection + demo content | 3–4 phiên | **license ảnh** demo |
| 06 QA | 1–2 phiên | |
| 07–10 Docs, page intro, package, launch | 3–4 phiên | |
| 11 Add-on | sau khi bán | |

## 7. Câu hỏi mở cho user
1. Merci cũ đã từng bán trên ThemeForest chưa (có link item)? Nếu có → làm bản **update 2.0** của item đó thay vì item mới.
2. Store dev để code: dùng luôn `merci-demo.myshopify.com` (theme mới push dạng **unpublished**, không đụng theme live) hay tạo dev store mới?
3. Repo git: tạo `github.com/maiduyen0311/merci` (nhánh `release/v1.0.0`)? Repo cũ `thanhkma1996/merci` để nguyên.
4. Ảnh trong `../product`, `../banner`, `../instagram` lấy từ đâu (Freepik / Envato / tự chụp)? Có license phân phối trong zip không?
5. Giá $59 và 1 demo cho v1.0 — đồng ý? Có muốn thêm demo 2 (vd tối giản đen trắng) không?
6. Giữ ngôn ngữ EN + DE như store cũ, hay theo bộ locale của Top Market?
7. Có chỉnh gì trên bản live muốn sửa luôn khi làm lại (typo "recelve", "Spring wonman", nhãn menu sai link "Jeans → /collections/jewelry")? Mặc định: sửa lỗi chính tả, giữ nguyên bố cục.
