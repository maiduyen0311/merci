# Phase 02B — Chỉ có design trang chủ (Option B): dựng design system, thiết kế trang con, tìm ảnh

**Mục tiêu**: từ 1 trang chủ, tạo ra bộ design đủ dùng cho toàn theme — cùng ngôn ngữ thiết kế — và bộ ảnh hợp ngách có license, được user duyệt **trước khi** code.

Agent chính: `design-director` (thiết kế), `image-curator` (ảnh). Skill: `frontend-design`.

## Bước 1 — Trích design system từ trang chủ
```text
Phase 02B bước 1. Đo trang chủ như phase 02A (render, cắt section, dump layer, đo pixel).
Từ đó suy ra design system và ghi design/SPEC.md §1 + §3:
- Màu: primary, accent, text, muted, border, background, sale/badge, success/error — mỗi màu ghi nguồn (layer/pixel).
  Màu chưa có trong trang chủ (error, success, disabled) → đề xuất, đánh dấu "đề xuất".
- Typography scale: h1–h6, body, small, button, price — từ text layer; bậc còn thiếu nội suy theo tỉ lệ.
- Spacing scale, radius, shadow, border, icon style (line/solid, stroke width), ảnh (ratio, bo góc, hover).
- Component: card sản phẩm (mọi trạng thái: hover, sale, sold out, swatch), button (primary/outline/link + hover),
  input, select, badge, breadcrumb, pagination, tab, accordion, toast/popup.
Xuất design/system/index.html — 1 trang style guide render bằng HTML/CSS thật (token + component).
Dừng chờ duyệt style guide.
```

## Bước 2 — Thiết kế trang con (HTML mockup, không phải Liquid)
```text
Phase 02B bước 2. Dùng design system đã duyệt, thiết kế từng trang con dưới dạng HTML tĩnh trong design/mockups/:
collection.html (filter sidebar + drawer mobile, grid/list, sort, pagination), product.html (gallery, variant swatch,
sticky ATC, tabs/accordion, related, recently viewed), cart.html + cart-drawer state, search.html, blog.html, article.html,
page.html, contact.html, account (login, register, account, order, addresses), 404.html, password.html,
và state: mega menu, mobile menu, quick view, newsletter popup, cookie bar.
Quy tắc:
- Chỉ dùng token + component của style guide; không thêm màu/font mới.
- Bám layout pattern phổ biến của theme top-selling cùng ngách (BRIEF §đối thủ) nhưng không sao chép.
- Mỗi trang có bản desktop 1440 và mobile 390. Chụp PNG (chrome-devtools MCP / Playwright) vào design/mockups/png/.
- Ghi vào SPEC §2 mỗi trang: section nào, setting nào, layout option nào (để merchant đổi được).
Gửi tôi duyệt theo lô (3–4 trang/lô). Trang bị yêu cầu sửa → sửa mockup, không code.
```

## Bước 3 — Ảnh sản phẩm & banner
```text
Phase 02B bước 3 (agent image-curator). Lập danh sách ảnh cần: số sản phẩm mỗi demo (≥ 24, đủ để lấp mọi section +
1 collection 2 trang), ảnh phụ (2–4 góc/sp, 1 sp có video), banner hero, banner collection, ảnh blog, logo brand, instagram.
Nguồn theo thứ tự ưu tiên:
1. Ảnh user cung cấp / ảnh khách hàng cho phép.
2. Ảnh stock license cho phép dùng thương mại + demo: Unsplash, Pexels, Pixabay (ghi URL + tác giả + license).
3. Ảnh AI tạo (công cụ user chọn) — prompt thống nhất ánh sáng/nền/góc theo art direction; ghi công cụ + prompt.
4. Ảnh trả phí (Envato Elements…) — chỉ dùng cho preview; trong gói bán thay bằng placeholder.
Xử lý: nền đồng nhất (trắng/kem theo design), crop đúng ratio card (vd 1:1 hoặc 3:4), resize ≤ 2000px, WebP/JPG ~85%,
tên file theo handle sản phẩm. Lưu design/<demo>/images/ + design/IMAGE-CREDITS.md (file | nguồn | tác giả | license | dùng ở đâu).
Tạo luôn danh sách sản phẩm (title, giá, compare-at, vendor, type, tag, variant màu/size, mô tả ngắn) hợp ngách,
để phase 05 sinh content.json.
```

## Art direction (ghi vào SPEC §4)
- Nền, ánh sáng, góc chụp, tỷ lệ sản phẩm trong khung, có người hay không, tông màu khớp palette.
- Không logo/brand thật trên sản phẩm, không người nổi tiếng, không ảnh có watermark.

## Xong khi
- [ ] `design/system/index.html` (style guide) đã duyệt.
- [ ] Mockup desktop + mobile cho mọi trang trong inventory, đã duyệt, PNG trong `design/mockups/png/`.
- [ ] `design/SPEC.md` đủ §1–§5 như Option A (từ đây phase 03+ đọc SPEC như bình thường).
- [ ] Bộ ảnh đủ số lượng + `IMAGE-CREDITS.md` đủ cột; danh sách sản phẩm demo.

## Cổng duyệt
3 cổng: style guide → mockup từng lô → bộ ảnh. Không sang phase 03 khi còn cổng chưa qua.
