# SPEC — Merci 2.0

> Phase 02A · 2026-11-10 · trạng thái: **đã duyệt 2026-11-10 — §5 theo đề xuất**
> Nguồn sự thật: theme Merci v1 (bản compare `161508229191`, giống hệt theme live `120883249223`).
> Ký hiệu nguồn: `[css:<selector>]` computed style đo bằng headless Chrome · `[px:<file>@x,y]` mẫu pixel trên ảnh chụp ·
> `[cfg:<key>]` `config/settings_data.json` của theme live · `[đề xuất]` Claude tự đưa ra — cần duyệt.
> Ảnh chụp: `design/merci/render/<page>-{desktop,mobile}.png` (1440 / 390), section trang chủ: `design/merci/sections/`.
> Số đo thô: `design/merci/render/styles.json`.

## §1 Tokens

### 1.1 Màu
| Token | Hex | Dùng cho | Nguồn |
|---|---|---|---|
| `--color-primary` | `#bf7069` | link hover, menu active, nút Add to cart, badge HOT, nút submit mobile, viền tab active, mũi tên newsletter | `[cfg:color_link_hover]` `[px:product-desktop@800,836]` |
| `--color-primary-soft` | `#f2d0d0` | badge NEW, nền slide hero | `[px:collection-desktop@642,742]` `[px:home-desktop@30,300]` |
| `--color-text` | `#332c2c` | chữ thân, giá ở card | `[cfg:color_body_text]` `[css:body]` |
| `--color-heading` | `#000000` / `#333333` | tiêu đề section (#000), tiêu đề PDP (#333) | `[css:h2]` `[css:PDP h1]` |
| `--color-link` | `#0c0c0c` | link, tên sản phẩm | `[cfg:color_link]` |
| `--color-muted` | `#666666` | vendor, ngày blog, "Loading reviews" | `[cfg:color_vendor]` |
| `--color-dark` | `#231e17` | thanh menu ngang ở trang con (nền), chữ trắng | `[px:collection-desktop@30,118]` |
| `--color-black-btn` | `#010101` / `#000000` | nút Buy it now, Read more, nút outline chữ đen | `[cfg:primary_button_color]` `[css:PDP BUY IT NOW]` |
| `--color-border` | `#e8e9eb` | đường kẻ, viền input/ô | `[cfg:color_borders]` |
| `--color-border-strong` | `#949494` | viền input | `[cfg:color_text_field_border]` |
| `--color-bg` | `#ffffff` | nền trang | `[cfg:color_body_bg]` |
| `--color-bg-alt` | `#f9f9f9` | nền footer | `[px:home-desktop@30,5400]` |
| `--color-bg-tab` | `#f2f2f2` | nền thanh tab PDP | `[px:product-desktop@300,1288]` |
| `--color-sale` | `#e95144` `[đề xuất]` | giá sale PDP (đang hiển thị đỏ cam) | đo lại khi code; v1 dùng đỏ cho giá PDP |
| `--color-compare` | `#9f9f9f` | giá gạch | `[css colors: rgb(159,159,159)]` |
| `--color-success` / `--color-error` | `#2e7d32` / `#d32f2f` `[đề xuất]` | thông báo form, tồn kho | v1 không có |

### 1.2 Typography
Font duy nhất trên v1: **Mandali** (Google Fonts, OFL — dùng web hợp lệ). Shopify font library **không có** Mandali → load từ Google Fonts hoặc tự host file woff2 trong `assets/` (OFL cho phép phân phối). `[đề xuất]` cho merchant đổi được: thêm `font_picker` heading/body, mặc định "Merci (Mandali)" tự host; chọn font khác thì dùng font library.

| Vai trò | Weight | Size desktop / mobile | Line-height | Letter-spacing | Transform | Nguồn |
|---|---|---|---|---|---|---|
| Body | 400 | 13 / 13 | 1.5 | normal | — | `[css:body]` `[cfg:type_base_size=13]` |
| Hero heading (slide) | 500 | 60 / 22 `[đề xuất mobile]` | 1.0 | 1.5px | — | `[css:h2 60px]` |
| Hero eyebrow | 500 | 25 / 13 | 1.0 | 1.5px | uppercase | `[css:h2 25px]` |
| Section title ("TRENDING", "NEW ARRIVAL") | 400 | 24 / 22 | 1.2 | 0.5px | uppercase | `[cfg:type_header_base_size=24]` + ảnh |
| Banner title (list-banner) | 600 | 24 / 18 | 1.2 | normal | — | ảnh `sections/05-*` |
| Banner script "WOMAN" | 600 | 40 / 30 | 1 | 4px | uppercase, màu `#a6606d` | `[css:h3 WOMAN]` |
| Menu chính | 600 | 13 | 1.5 | normal | uppercase | `[css:nav a]` |
| Sidebar heading | 600 | 16 | 1.5 | normal | uppercase | `[css:COL h3]` |
| PDP title | 600 | 18 / 18 | 1.2 | normal | — | `[css:PDP h1]` |
| PDP price | 400 | 17 (giá chính đỏ ~20) | 1.5 | — | — | `[css:PDP price]` |
| Card title / price | 400 | 13 | 1.5 | — | — | `[css:COL h2/price]` |
| Blog card title | 600 | 16 | 1.5 | — | — | `[css:h3 Winter…]` |
| Button | 500 | 14–15 | 1.5 | normal | uppercase | `[css:ADD TO CART]` |
| Badge | 400 | 12 | 1.5 | — | uppercase | `[css:HOT]` |

### 1.3 Layout
- Canvas đo: 1440. **Container 1200px** (1170 nội dung + 2×15 padding) `[css:.container w1200]`.
- Breakpoints: 1440 / 1200 / 992 / 768 / 576 / 390 (giữ của Top Market).
- Khoảng cách giữa section: 60–70px desktop, 40px mobile `[đo y trong styles.json: 672→803, 1931→2547…]`.
- Radius: 0 cho ảnh/card/input; **pill 25px** cho nút "Shop now", "Show more", Add to cart, Add wish list, Buy it now `[ảnh product-desktop]`; tròn cho swatch.
- Shadow: không dùng. Border 1px `--color-border`.
- Icon: line, stroke ~1.5px, 20–24px (header: search, compare, wishlist, cart, settings) — tái dùng `snippets/svg.liquid` của Top Market.

## §2 Section & trang

### Header (EDIT `header.liquid` + header-group)
- Ảnh: `sections/01-header-*.png`, `02-navigation-*.png`, render trang con.
- **Desktop** 3 cột cao 99px: trái social (Twitter, Facebook, Instagram, YouTube); giữa logo (ảnh, ~120px); phải currency (USD), language (cờ), search, compare (badge đếm), wishlist (badge), cart (badge), nút settings (dropdown account: login form + My account, Order tracking, Privacy, Shipping).
- **Menu ngang** dưới header, căn giữa, cao 40px. Trang chủ: nền trong suốt chồng lên hero, chữ đen, active `#bf7069`. Trang con: nền `#231e17`, chữ trắng. → setting `nav_style: transparent | dark` cho template index và mặc định.
- Badge đếm: tròn 16px nền `#bf7069` chữ trắng.
- Mega menu 3 kiểu (giữ cả 3 làm block):
  1. `mega_columns_images` (Shop): 2 cột link + 3 ảnh promo có heading + nút.
  2. `mega_collections` (Collection): 5 cột collection, mỗi cột tiêu đề + 5 link.
  3. `mega_lookbook` (Lookbook): cột link + ảnh trái có heading/nút + lưới 6 collection có ảnh.
- **Mobile**: hamburger trái, settings, logo giữa, search + cart phải; drawer menu.
- Sticky header `[đề xuất]` (v1 không sticky).
- Settings: logo, logo_width, social links (dùng settings global), show_currency, show_language, show_compare, show_wishlist, nav_style, sticky.

### Trang chủ (Appendix A là thứ tự)
| # | id mới | Từ v1 | Mô tả & layout | Settings / blocks | So Top Market |
|---|---|---|---|---|---|
| 1 | `home-hero` | slideshow | Full width, cao 632px desktop / ~260 mobile; 3 slide: ảnh nền + eyebrow + heading 2 dòng + nút pill outline. Vị trí chữ left/right/center theo slide. Dots dưới. | block `slide`: image, image_mobile, eyebrow, heading (richtext 2 dòng), button_text, link, text_position, text_color. Section: autoplay, speed, height | EDIT |
| 2 | `home-services-bar` | policys-block | 3 ô viền 1px, chữ giữa: heading 14px uppercase + sub 13px. Mobile: slider ngang. | block `item`: heading, subheading, link | EDIT |
| 3 | `home-video-banner` | video-banner-block | Lưới 2 cột (8/4): trái ảnh + nút play mở popup video YouTube/Vimeo; phải ảnh + chữ lớn "WOMAN" màu `#a6606d`. Mobile: xếp dọc. | video_url, poster, banner_image, banner_heading, banner_link, heading_color | NEW (tận dụng `video-banner`) |
| 4 | `home-trending-row` | trending-product | Tiêu đề giữa "TRENDING"; carousel 4 card desktop / 2 mobile, mũi tên tròn 2 bên, dots mobile. | title, collection, products_to_show, columns_desktop, columns_mobile, autoplay | EDIT |
| 5 | `home-collection-tiles` | list-banner (3) | 3 ô ảnh 1:1.15, chữ giữa: eyebrow + title 24px. Mobile: slider 1 ô + dots. | block `tile`: image, eyebrow, title, link, text_position, text_color; columns | NEW |
| 6 | `home-new-arrivals` | new-arrival-product | Tiêu đề giữa; lưới 5 cột desktop / 2 mobile; badge HOT/NEW; countdown trên card nếu có metafield; nút pill "Show more". | title, collection, limit, columns, show_more_link | EDIT |
| 7 | `home-parallax-banner` | banner-parallax | Full width cao 500, ảnh nền parallax, chữ trái: eyebrow + heading 40px uppercase. Mobile cao 200, tắt parallax. | image, image_mobile, eyebrow, heading, button_text, link, height, parallax (bool) | NEW (mở rộng `image-banner`) |
| 8 | `home-dual-banner` | list-banner (2) | 2 ô ảnh ngang, chữ top-left / bottom-left: title 24px + hashtag nhỏ letter-spacing. Mobile slider. | block `banner`: image, title, subtitle, link, text_position | EDIT |
| 9 | `home-latest-news` | featured-blog | Tiêu đề giữa; 3 card blog: ảnh 4:3, ngày (muted, uppercase nhỏ), title 13px. Mobile slider. | title, blog, limit, show_date, show_author | EDIT |
| 10 | `home-brand-showcase` | brands | 5 ô: logo chữ + 3 ảnh sản phẩm xen kẽ, không viền. Mobile slider. | block `item`: image, link | EDIT `home-brand-logos` |
| 11 | `home-instagram` | instagram | Tiêu đề "@MERCI_SHOP" + sub "Follow us on Instagram". v1 không hiện ảnh (API Instagram cũ đã chết) → `[đề xuất]` lưới 6 ảnh do merchant upload, mỗi ảnh link tới post. | title, subtitle, profile_url; block `image`: image, link | EDIT |

### Footer (EDIT `footer.liquid` + footer-group)
- Nền `#f9f9f9`, 4 cột: (1) logo + text giới thiệu + copyright; (2) "MY ACCOUNT" menu; (3) "LINK" menu; (4) "FOLLOW US" social + icon thanh toán.
- Dưới: **Newsletter** căn giữa: heading "NEWSLETTER" 24px, sub "Sign up to receive our latest news & events" (sửa typo), input gạch chân, placeholder `#bf7069` uppercase, nút mũi tên `#bf7069`.
- Payment icons: dùng `shop.enabled_payment_types` (bỏ upload ảnh như v1).
- Mobile: cột 1 căn giữa, cột 2–3 thành 2 cột cạnh nhau, rồi follow us, newsletter.

### Collection (`main-collection-banner` + `main-collection-product-grid` — EDIT)
- Banner ảnh full container (cao ~440) từ collection image hoặc setting.
- Breadcrumb 13px.
- Sidebar trái 220px: "BY CATEGORIES" (menu có +/− mở cấp con), PRICE (slider 2 đầu + 2 ô + nút Apply), COLOR (chấm màu + checkbox), các filter khác theo Shopify Search & Discovery; block ảnh promo; block custom text; "FEATURED PRODUCT" (list 4 sp ảnh nhỏ).
- Toolbar: "VIEW AS" grid/list, "SORT BY" select.
- Lưới 3 cột desktop, 2 mobile; card như §3.1. Phân trang số + Previous/Next, "Showing 1–12 of 27".
- Layout option (thay 4 template của v1): `filter_position: left | right | drawer`, `grid_style: normal | metro | masonry`, `columns_desktop: 2–5`. Mobile: filter trong drawer.

### Product (`main-product` + `product-tabs` + `related-products` — EDIT)
- Gallery trái 50%: ảnh lớn + dải thumbnail ngang có mũi tên. Layout option (thay 7 template của v1): `gallery_layout: thumbs_bottom | thumbs_left | thumbs_right | grid | slideshow | fullwidth`; `details_layout: tabs | accordion`.
- Cột phải: title 18/600; rating; **"🔥 17 sold in last 7 hours"** (block sales-hint, số do merchant đặt hoặc metafield — không bịa số ngẫu nhiên `[đề xuất]`); SKU / Availability / Product type; **countdown "Limited-time offer, ends in"** (đọc metafield ngày kết thúc — **v1 lỗi NaN**, phải sửa); giá sale đỏ + giá gạch; mô tả ngắn; swatch màu tròn 30px; size tròn 30px viền; quantity pill (− 1 +) + subtotal; nút Add to cart (pill `#bf7069`) + Add wish list (pill outline); Buy it now (pill đen full width); link wishlist/compare; tags; ảnh trust badge (block image).
- Tabs dưới: nền `#f2f2f2`, tab active viền trên `#bf7069` chữ `#cd7b69`; tab: Description / Reviews / Material / Size chart / Video.
- "YOU MAY ALSO LIKE": 4 card.
- Mobile: gallery slider, sticky ATC (có sẵn Top Market).

### Trang khác
| Trang | Layout | Ghi chú |
|---|---|---|
| Blog | sidebar trái (Recent articles, Tag cloud ô viền, ảnh, custom block — mỗi widget đóng/mở) + lưới 2 cột: ảnh, meta (ngày, tác giả, icon), title 16/600, excerpt, nút đen "READ MORE" | layout option: sidebar left/right/none, columns 2/3 |
| Article | `[đề xuất]` cùng sidebar blog, ảnh lớn, nội dung, share, bình luận | đo khi có bài thật |
| Lookbook | v1 chưa hoàn thiện (ảnh giữ chỗ) → `[đề xuất]` dùng `lookbook.liquid` Top Market: ảnh lớn có hotspot sản phẩm + lưới ảnh, mỗi hotspot mở card sản phẩm | cần duyệt mockup |
| FAQ, Contact, page | tiêu đề trang uppercase 24px, breadcrumb; FAQ accordion; Contact form + map + info | dùng section Top Market, restyle token |
| Cart | bảng sản phẩm + tổng + shipping estimator; cart drawer khi thêm hàng | Top Market `cart-drawer` |
| Search, list-collections, wishlist, compare, account, 404, password | restyle token, layout Top Market | |

## §3 Component

### 3.1 Card sản phẩm
- Ảnh trên nền trắng, tỉ lệ ~1:1.3 (270×350), không viền, không bo góc.
- Badge góc trên giữa ảnh: HOT (`#bf7069`, chữ trắng), NEW (`#f2d0d0`, chữ trắng), Sale `-xx%` `[đề xuất]`, Sold out `[đề xuất]`; 12px uppercase, padding 2×8.
- Dưới ảnh (căn giữa): rating, title 13px `#000` (hover `#bf7069`), giá 13px + giá gạch xám.
- Swatch màu tròn 10px dưới giá (mobile thấy rõ trên v1).
- Hover desktop: ảnh thứ 2; hiện cụm nút: Add to cart / Quick view / Wishlist / Compare `[đề xuất — v1 có, cần đo trạng thái hover]`.
- Countdown trên ảnh (4 ô đen 30px: ngày/giờ/phút/giây) khi sản phẩm có ngày kết thúc khuyến mãi.

### 3.2 Card blog
Ảnh 4:3, meta xám 11px uppercase (ngày), title 13–16px; trang blog có excerpt + nút đen.

### 3.3 Button / form
| Loại | Style |
|---|---|
| Primary | pill, nền `#bf7069`, chữ trắng 14/500 uppercase, cao 37–44 |
| Dark | pill, nền `#000`, chữ trắng (Buy it now); vuông cho "READ MORE" |
| Outline | pill viền 1px `#000`, chữ đen ("SHOP NOW", "Add wish list", "Show more") — hover nền `#bf7069` viền `#bf7069` chữ trắng `[đề xuất]` |
| Input | viền 1px `#e8e9eb`, cao 40, không bo; newsletter: chỉ gạch chân |
| Select | như input, mũi tên chevron |
| Breadcrumb | 13px, phân cách `›` |
| Pagination | số 13px, trang hiện tại đậm, Previous/Next |
| Tab | xem PDP |
| Accordion | tiêu đề 16/600 uppercase, +/− phải |

## §4 Asset
- Logo: `logo.png` của v1 (chữ MERCI, chữ E là 3 vạch, chấm đỏ) — tải về từ store; `[đề xuất]` vẽ lại SVG để nét ở mọi kích thước.
- Icon: SVG line của Top Market (`snippets/svg.liquid`).
- Ảnh demo: lấy từ `../product`, `../banner`, `../instagram` và ảnh đang có trên store (user cho phép 2026-11-10). License chưa rõ → ghi `IMAGE-CREDITS.md`, chỉ dùng trên store demo; zip bán dùng placeholder.
- Trust badges ảnh PNG v1 → `[đề xuất]` thay bằng icon SVG + text (nhẹ, dịch được).

## §5 Câu hỏi mở / gaps
1. Font: tự host Mandali (khuyên dùng, giống v1 100%) hay đổi font có trong Shopify font library (vd. Jost / Poppins) cho merchant dễ đổi?
2. Menu trang chủ trong suốt + trang con nền tối `#231e17`: giữ 2 kiểu như v1?
3. Lookbook v1 chưa có nội dung — đồng ý dùng kiểu hotspot (§2) không?
4. Instagram: lưới ảnh upload tay (không cần app) — đồng ý?
5. "17 sold in last 7 hours": v1 hiển thị số ngẫu nhiên → ThemeForest/Shopify coi là gây hiểu lầm. Đề xuất: số lấy từ metafield, mặc định tắt.
6. Hover state của card (nút quick view / wishlist / compare) chưa chụp được ở headless — đo thêm bằng tay ở phase 03 nếu cần.

## Appendix A — Thứ tự section trang chủ (Demo 1)
`home-hero` → `home-services-bar` → `home-video-banner` → `home-trending-row` → `home-collection-tiles` → `home-new-arrivals` → `home-parallax-banner` → `home-dual-banner` → `home-latest-news` → `home-brand-showcase` → `home-instagram` · footer-group: `newsletter` (trong footer) + `footer`.

## Appendix B — Pattern CSS vars
```liquid
{% style %}
  #HomeHero-{{ section.id }} { --sec-pt: {{ section.settings.padding_top }}px; --sec-pb: {{ section.settings.padding_bottom }}px; --sec-bg: {{ section.settings.background }}; }
{% endstyle %}
```
Token toàn cục khai báo trong `common/scss/_tokens.scss` + `snippets/theme-styles.liquid` (`--mc-color-primary`, `--mc-color-dark`, `--mc-radius-pill: 25px`, `--mc-container: 1200px`).

## Appendix C — Thực thi phase 04 (2026-11-10, user yêu cầu khác Top Market / Occasion)
Quyết định: trang chủ dùng bộ section riêng `sections/mc-*.liquid` (SCSS `common/scss/section/_mc-*.scss`) thay vì sửa section Top Market — layout + motif của Top Market khác quá xa và user muốn không trùng mô-típ. Section Top Market vẫn giữ trong theme làm section bổ sung.

| Vị trí (Appendix A) | Section | Preset | Tương tác Merci |
|---|---|---|---|
| 1 hero | `mc-slideshow` | Merci slideshow | fade, từng dòng chữ trượt lên, ảnh zoom-out chậm, chỉ báo gạch ngang, mũi tên line dài; swipe mobile |
| 2 3 ô chữ | `mc-text-columns` | Merci text columns | viền đổi primary, gạch chân sub-line chạy ra; mobile swipe |
| 3 video + WOMAN | `mc-video-banner` | Merci video banner | nút play vòng sóng lan, popup `<dialog>` YouTube/Vimeo; chữ giãn letter-spacing khi hover |
| 4 trending, 6 new arrival | `mc-products` (layout carousel / grid) | Merci product carousel / grid | thanh progress mảnh thay chấm, mũi tên line |
| 5 ô collection, 8 cặp banner | `mc-image-tiles` | Merci collection tiles / banner pair | zoom chậm + khung viền mảnh hiện bên trong ảnh |
| 7 parallax | `mc-parallax-banner` | Merci parallax banner | background-attachment fixed (desktop, chuột, không reduced-motion) |
| 9 blog | `mc-blog-posts` | Merci blog posts | zoom + khung + gạch chân tiêu đề |
| 10 brand, 11 Instagram | `mc-image-strip` (hover fade / social) | Merci brand showcase / Instagram | brand: ảnh khác mờ + xám; IG: phủ primary + icon trượt lên |

§3.1 Card (thay [đề xuất] cũ) — Theme settings → Product cards → Card layout "Merci": ảnh chuyển ảnh 2 + zoom chậm; dải trắng trượt lên đáy ảnh (♡ | QUICK VIEW | ⇄); dòng giá đổi thành link "ADD TO CART +" / "CHOOSE OPTIONS +" gạch chân chạy ra; màn cảm ứng: không dải, link hiện dưới giá.
§3.3 Button `.mc-btn`: viền pill, nền primary quét từ dưới lên khi hover (Top Market chỉ đổi màu).

## Appendix D — Thực thi phase 05 (2026-11-10, trang con — tham khảo ThemeForest, khác Top Market / Occasion)
Quyết định: giữ section Top Market của trang con (filter, phân trang, biến thể, cart… đã chạy ổn) và phủ một lớp giao diện Merci `common/scss/section/_mc-pages.scss` (nạp cuối `styles.scss`). Chỉ sửa markup khi cần hành vi mới.

| Trang | Merci (khác Top Market) |
|---|---|
| Chung | breadcrumb không nền, chữ nhỏ uppercase, phân cách gạch mảnh; tiêu đề trang uppercase giãn chữ; input vuông 44px viền mảnh; `.tm-btn` nền quét từ dưới lên; card bỏ bo góc |
| Collection | banner ảnh full container (`layout: banner`), tiêu đề giữa; widget sidebar uppercase + kẻ mảnh (bỏ gạch cam 60px); hover danh mục có gạch trượt vào; chấm màu có vòng; toolbar mở giữa 2 đường kẻ; 3 cột, ảnh dọc, không sao vàng; phân trang chữ "Showing 1–12 of 27 · Previous 1 2 3 Next" (`snippets/pagination.liquid`) |
| Product | `main-product` Style "Merci" (`layout_style`): bảng SKU / Availability / Vendor / Type (`snippets/mc-product-meta.liquid`); dòng "N sold in last H hours" từ metafield `custom.sold_count` + `custom.sold_hours` (mặc định tắt); countdown "Limited-time offer, ends in" từ `custom.offer_ends` — tự ẩn khi trống / hết hạn (sửa lỗi NaN v1); gallery 50/50 không viền, thumbnail gạch chân; swatch tròn 30px, size tròn; ATC pill primary + "Add wish list" pill viền + Buy it now đen full width, cùng hiệu ứng quét. Bỏ số giả: "live viewers" mặc định tắt, "Only N left" chỉ hiện khi kho được theo dõi. Tab kiểu v1: dải `#f2f2f2`, tab active nền trắng + vạch primary trên. Mô tả cắt bỏ shortcode v1 sau `[des]` |
| Blog | Card style "Merci": byline (ngày — tác giả) trên tiêu đề, nút vuông đen "READ MORE"; sidebar trái, tag cloud ô vuông viền |
| FAQ | hàng kẻ mảnh, câu hỏi uppercase, dấu +/− vẽ bằng 2 vạch (bỏ hộp bo góc + chevron tròn); bảng so sánh tắt trên trang FAQ |
| Contact | icon line trần màu primary, các dòng ngăn bằng kẻ mảnh, form mở cạnh 1 đường kẻ dọc (bỏ icon tròn nền màu + card bo góc) |
| Lookbook | `page.lookbook.json`: 3 look `lookbook` layout split xen kẽ trái/phải, hotspot "+" mảnh xoay thành "×", vòng mảnh thay pulse đặc, card sản phẩm vuông |
| Login / register | form giữa trang, tiêu đề uppercase, nút pill full width |
| 404 | số "404" viền (text-stroke) thay khối màu đặc |
| Collections list | ảnh vuông góc + khung mảnh khi hover |
| Wishlist / cart | empty state không khung nét đứt, lợi ích ngăn bằng kẻ dọc; tiêu đề/nhãn uppercase, tổng tiền màu chữ |

Nội dung demo: `scripts/demo/merci.js` → `demos/merci/` (không tạo sản phẩm — store đã có catalogue v1). Import: `--only metafields,files,pages,menus`.
