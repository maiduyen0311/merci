---
description: Build gói bán (npm run release) và đi release checklist. Cú pháp /release-kit <version>.
argument-hint: <version>
---

Version: `$ARGUMENTS`

1. Kiểm tra `qa/REPORT-*.md` mới nhất không còn 🔴 (không có → đề xuất `/qa` trước).
2. Bump version ở `package.json`, `config/settings_schema.json` (theme_info), changelog (`themeforest/content/06-changelog.md` + `documentation/help.html`). Hỏi user nội dung changelog nếu chưa rõ.
3. `npm run build` → `npm run check` → `npm run release`.
4. Copy `.claude/playbook/templates/release-checklist.md` → `qa/RELEASE-$ARGUMENTS.md`, đi từng dòng (mở zip, liệt kê file, grep tên store/handle demo, kiểm license ảnh theo `design/IMAGE-CREDITS.md`).
5. Upload thử 1 zip theme lên store test **(hỏi trước)** dưới dạng theme unpublished.
6. Báo cáo: đường dẫn file trong `dist/`, checklist ✅/❌, việc user phải làm (upload ThemeForest, tag git). Commit `[time] Release $ARGUMENTS`.
