---
description: Lưu trạng thái để đổi máy / phiên mới — cập nhật .claude/memory/ và mục "Đang làm" trong CLAUDE.md, commit + push.
---

1. Tóm tắt phiên: phase hiện tại, việc đã xong (commit hash), việc đang dở (file, bước), việc tiếp theo, quyết định mới của user, quyền mới được cho (deploy store nào…).
2. Cập nhật file memory liên quan trong `.claude/memory/` (1 fact / file, frontmatter name/description/type) + 1 dòng index trong `.claude/memory/MEMORY.md`. Đổi ngày tương đối thành ngày tuyệt đối.
3. Nếu memory của Claude trên máy (`~/.claude/projects/<project>/memory/`) mới hơn → chép sang `.claude/memory/`.
4. Sửa mục "Đang làm" trong `CLAUDE.md` (≤ 6 dòng).
5. Lưu ý file không có trong git (PSD, `.env`, ảnh gốc lớn) mà máy kia cần → liệt kê để user tự chép.
6. Commit `[YYYY-MM-DD HH:MM] Handover: …` + push.
