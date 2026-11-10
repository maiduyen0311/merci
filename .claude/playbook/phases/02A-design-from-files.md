# Phase 02A — Design từ file có sẵn (Option A)

**Mục tiêu**: chuyển design (PSD/Figma/JPG) thành `design/SPEC.md` đo chính xác + ảnh tham chiếu từng section/state, để phase 03–05 chỉ việc code theo.

## Đầu vào
- `design/<demo>/01_Layout/*.psd|*.jpg` (Home, Collection, Product, Cart, Blog, Account, states: hover, mega menu, quick view, popup).
- `design/<demo>/02_Image/` ảnh gốc sản phẩm/banner (nếu có).
- Figma: link file (connector Figma phải được xác thực — skill `figma:figma-design-to-code`).

## Prompt
```text
Phase 02A. Với mỗi file design:
1. Render ra PNG (PSD: ag-psd + pngjs, initializeCanvas stub useImageData) vào design/<demo>/render/.
   Cắt từng section trang chủ thành design/<demo>/sections/NN-<id>.png; state (hover, menu, popup) → states/.
2. Dump layer text: font family, weight, size, line-height, letter-spacing, màu hex, bbox.
   Đo container, grid (số cột, gutter), spacing giữa section, radius, shadow, kích thước ảnh/ratio.
3. Viết design/SPEC.md theo .claude/playbook/templates/DESIGN-SPEC.md:
   §1 tokens (màu, font, size scale, spacing, radius, shadow, breakpoints), §2 inventory section (mỗi entry: ảnh tham chiếu,
   layout, settings, blocks, trạng thái NEW/EDIT/OK-existing so với theme nền), §3 component (card sản phẩm, card blog,
   button, input, badge, price), §4 asset, §5 câu hỏi mở, Appendix A thứ tự section, Appendix B pattern CSS vars.
4. Font: kiểm tra license web (Google Fonts / Shopify font library có không). Không có → đề xuất font thay, hỏi tôi.
5. Mobile: nếu design không có mobile, ghi đề xuất mobile cho từng section ở §2 (đánh dấu "đề xuất — cần duyệt").
Không sửa code. Dừng chờ duyệt SPEC.
```

## Kỹ thuật đo (đã dùng ở Occasion)
- Đo trực tiếp trên PNG render: crop + lấy mẫu pixel → hex. Không đoán từ mắt.
- Toạ độ layer PSD → khoảng cách thật; canvas 1820 → quy về container 1180/1200 tuỳ design.
- Kiểm tra lại bằng headless Chrome: chiều cao trang render vs PSD (Occasion: 6842px vs 6841px).
- Icon: lấy SVG từ PSD (vector layer) hoặc vẽ lại SVG, đưa vào `scripts/data/svg-icons.json`.

## Xong khi
- [ ] `design/SPEC.md` có đủ §1–§5 + Appendix A/B; mỗi section có ảnh tham chiếu.
- [ ] Mọi màu/size trong SPEC có nguồn (layer / pixel), không có giá trị "ước chừng".
- [ ] Danh sách font + license, danh sách ảnh có trong design + license (→ `design/IMAGE-CREDITS.md`).

## Cổng duyệt
User duyệt SPEC. Sau đó SPEC chỉ được sửa khi user đồng ý (ghi trong CLAUDE.md "Không làm").
