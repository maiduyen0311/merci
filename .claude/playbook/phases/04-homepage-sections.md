# Phase 04 — Section trang chủ

**Mục tiêu**: mọi section trong SPEC §2 (trang chủ) được build, wire vào `templates/index.json`, review, khớp design.

## Quy trình mỗi section (skill `convert-section`)
1. `/spec <id>` — xem entry; trạng thái NEW / EDIT / OK-existing.
2. `/build-section <id>` — agent `section-builder` tạo `sections/<id>.liquid` + `common/scss/section/_<id>.scss` + `@use` + locale.
   EDIT → sửa section có sẵn của theme nền, thêm **layout option** thay vì tạo section trùng chức năng.
3. `/wire-section <id>` — chèn vào `templates/index.json` theo Appendix A.
4. `npm run dev` → so với `design/.../sections/NN-<id>.png` ở 1440 và 390 (chrome-devtools MCP screenshot).
5. `/review-section <id>` (liquid-reviewer + schema-auditor song song) → sửa hết 🔴, phần lớn 🟡.
6. Commit `[time] Build <id> section` + push.

## Prompt
```text
Phase 04. Làm lần lượt các section trang chủ trong SPEC Appendix A theo quy trình convert-section.
Ưu tiên tái dùng section của theme nền (EDIT + layout option). Section dùng carousel → module carousel.js / tm-scroller có sẵn.
Sau mỗi 3 section: chụp full trang chủ 1440 + 390, đặt cạnh design, liệt kê lệch (spacing, size, màu) và sửa.
Cuối phase: chạy responsive-qa ở 1440/1024/768/375 cho toàn trang chủ.
```

## Xong khi
- [ ] Trang chủ demo 1 khớp design ở desktop (lệch ≤ vài px) và hợp lý ở mobile.
- [ ] Mọi section có preset → thêm được từ Theme Editor vào trang khác; blocks kéo thả được.
- [ ] Không lỗi console; `shopify theme check` sạch error.
- [ ] Demo 2, 3 (nếu có) chỉ khác ở JSON (template + settings) — nếu cần tính năng mới → setting mới.
