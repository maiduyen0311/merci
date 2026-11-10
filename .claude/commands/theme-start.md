---
description: Bắt đầu theme mới — đọc CLAUDE.md, brief, playbook; xác định Option A/B; chạy phase 00 (Intake) và dừng chờ duyệt.
---

1. Đọc `CLAUDE.md`, `.claude/memory/MEMORY.md` (+ file liên quan), `.claude/playbook/README.md`, `.claude/playbook/MASTER-PROMPT.md` (phần "Cách làm việc" là luật cho cả dự án).
2. Nếu `design/BRIEF.md` đã có → tóm tắt, hỏi user còn gì thay đổi. Nếu chưa → hỏi user các ô `{{...}}` còn thiếu trong MASTER-PROMPT (tên, slug, prefix, ngách, thị trường, demo, store, repo, giá, item cũ) — gom trong 1 lần hỏi.
3. Chạy `.claude/playbook/phases/00-intake.md`.
4. Ghi option A/B + quyết định vào `.claude/memory/` và dòng "Phase hiện tại" trong CLAUDE.md.
5. Dừng ở cổng duyệt của phase 00.
