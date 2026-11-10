# Phase 00 — Intake: brief, đối thủ, chọn Option A/B

**Mục tiêu**: biết chính xác đang làm theme gì, cho ai, so với ai, bao nhiêu trang/section, đầu vào design thuộc option nào.

## Đầu vào
- Thư mục `design/` (PSD / JPG / Figma link / ảnh) mà user đặt vào.
- Thông tin user điền trong MASTER-PROMPT.

## Prompt
```text
Phase 00. Liệt kê toàn bộ file trong design/ (tên, kích thước canvas, số artboard/layer nếu là PSD — đọc bằng ag-psd).
Xác định option:
- A nếu có ít nhất Home + Collection + Product + Cart (+ ảnh sản phẩm gốc).
- B nếu chỉ có Home (hoặc thiếu ảnh sản phẩm).
Viết design/BRIEF.md theo .claude/playbook/templates/theme-brief.md. Research nhanh 3–5 theme top-selling
cùng ngách trên ThemeForest + Shopify Theme Store: tính năng nổi bật, số demo, giá, điểm yếu bị review chê.
Liệt kê inventory: section trang chủ (đặt id kebab-case, prefix home- nếu chỉ dùng ở trang chủ) và trang con cần có.
Dừng chờ duyệt.
```

## Các bước
1. **Kiểm kê design** — PSD: `ag-psd` dump cây layer (tên, bbox, text, font, size, màu). JPG: kích thước, canvas width, container x (vd 1820px, container 320–1500).
2. **Chọn option** theo quy tắc trên; nếu lửng (vd có Home + Product nhưng không có ảnh) → Option A cho trang có design, phần thiếu theo cách làm của 02B. Ghi rõ trong BRIEF.
3. **Đối thủ** (WebSearch / Chrome): ThemeForest category Shopify, sort Best sellers, lọc ngách; Shopify Theme Store cùng ngành. Ghi bảng: tên, giá, sales, rating, số demo, 10 tính năng, phàn nàn thường gặp.
4. **Inventory**: bảng section trang chủ + trang con (template) + popup/state (mega menu, quick view, cart drawer, newsletter popup, mobile menu).
5. **Kế hoạch**: số phiên ước lượng mỗi phase, rủi ro (font không có license web, ảnh thiếu, store thiếu quyền…).

## Xong khi
- [ ] `design/BRIEF.md` đủ các mục của template, option A/B có lý do.
- [ ] Inventory section/trang có id.
- [ ] Bảng đối thủ ≥ 3 theme, có link.
- [ ] Danh sách câu hỏi mở cho user.

## Cổng duyệt
User duyệt BRIEF + inventory + option. Ghi quyết định vào `.claude/memory/` (project memory).
