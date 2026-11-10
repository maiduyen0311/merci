---
description: Chạy QA theme và tổng hợp báo cáo. Cú pháp /qa [all|check|e2e|a11y|visual|lh|manual] (mặc định all).
argument-hint: [scope]
---

Scope: `$ARGUMENTS` (trống = all)

1. Nếu chưa có `tests/` hoặc script `qa:*` trong `package.json` → báo cần chạy `/phase 06` trước, dừng.
2. Kiểm tra QA preview URL trong `.env` (không in giá trị bí mật). Không có → dùng local `npm run dev` (hỏi user có đang chạy không).
3. Spawn agent `qa-tester` với scope tương ứng. Với `all`: tự động (check + e2e + a11y + visual + lh) và manual matrix có thể chạy song song 2 agent.
4. Hiển thị tóm tắt: verdict, số 🔴/🟡/🔵, Lighthouse, top 5 lỗi + file nghi ngờ. Link `qa/REPORT-<date>.md`.
5. Không tự sửa code; đề xuất thứ tự sửa và hỏi user.
