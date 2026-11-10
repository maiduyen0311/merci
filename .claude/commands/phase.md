---
description: Chạy 1 phase của playbook. Cú pháp /phase <nn> (00, 01, 02, 03 … 11). Phase 02 tự chọn 02A/02B theo option trong memory.
argument-hint: <nn>
---

Phase yêu cầu: `$ARGUMENTS`

1. Tìm file `.claude/playbook/phases/$ARGUMENTS-*.md`. Với `02`: đọc option trong `.claude/memory/` / `design/BRIEF.md` → `02A-*` hoặc `02B-*`. Không thấy → liệt kê các phase có sẵn và dừng.
2. Kiểm tra phase trước đã qua cổng duyệt (memory / CLAUDE.md "Đang làm"). Chưa → báo user, hỏi có muốn chạy tiếp không.
3. Đọc file phase. Viết kế hoạch ngắn (việc + thứ tự + agent sẽ dùng), rồi làm.
4. Dùng subagent khi tách được: review + schema audit song song, QA nhiều viewport, research.
5. Sau mỗi việc xong + kiểm tra: commit `[YYYY-MM-DD HH:MM] …` + push (theo CLAUDE.md).
6. Cuối phase: tự đối chiếu mục "Xong khi" (✅/❌ từng dòng), cập nhật `.claude/memory/` + CLAUDE.md "Đang làm" (như `/handover`), báo cáo và dừng ở "Cổng duyệt".
