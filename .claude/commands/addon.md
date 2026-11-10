---
description: Làm 1 add-on từ đầu đến cuối — spec → (duyệt) → build → test → doc → changelog. Cú pháp /addon <addon-id>.
argument-hint: <addon-id>
---

Add-on: `$ARGUMENTS`

1. Tìm `$ARGUMENTS` trong `addons/CATALOG.md` (hoặc `.claude/playbook/addons/CATALOG.md`). Không có → hỏi user mô tả, thêm vào catalog.
2. Viết `addons/specs/$ARGUMENTS.md` theo `addon-spec.template.md` (loại T/M/A, UX, settings, data, perf budget, test, doc). Dừng chờ duyệt spec.
3. Build theo phase 11 §4: module JS idempotent, SCSS partial, section/block/snippet, settings (mặc định tắt nếu ảnh hưởng UX), locale; loại M → script tạo metafield/metaobject definition; loại A → chỉ chuẩn bị chỗ đặt app block + đề xuất repo app riêng.
4. `/review-section` cho file Liquid mới; thêm test vào `tests/flows.spec.js`; `/qa e2e` + `/qa lh` (Lighthouse không tụt > 3 điểm).
5. Agent `docs-writer`: mục documentation + changelog; agent `listing-copywriter`: dòng feature cho listing + page intro.
6. Commit từng bước `[time] Add-on $ARGUMENTS: …` + push. Cập nhật cột "Có ở" trong CATALOG.
