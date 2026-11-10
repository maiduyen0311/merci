# Phase 01 — Scaffold: project mới từ theme nền

**Mục tiêu**: có repo theme mới chạy được `npm run dev`, đã đổi tên, sạch dữ liệu của theme cũ.

## Tự động
`scripts/new-theme.ps1 -Name <Name> -Prefix <xx> -Option A|B [-Base <path>]` đã làm: copy theme nền (bỏ `node_modules`, `.git`, `dist`, `demos`, `design`, `documentation`, `page-intro`, `themeforest`, `.shopify`, `.env`), copy kit vào `.claude/`, sinh `CLAUDE.md` từ template, `git init`.

## Prompt
```text
Phase 01. Theme nền đã được copy. Làm sạch để thành theme {{THEME_NAME}}:
1. package.json: name, version 1.0.0, description. config/settings_schema.json: theme_info (theme_name, theme_version,
   theme_author "iPhoenix Themes", theme_documentation_url https://iphoenixthemes.com/themes/<slug>/documentation/,
   theme_support_url .../#support).
2. Tìm và liệt kê mọi chỗ còn tên theme cũ (grep -i "occasion|top market|oc-") — đổi tên hiển thị;
   GIỮ prefix tm- cho code chung; class style mới của theme này dùng prefix {{xx}}-.
   Style riêng của theme cũ (vd oc-*) → liệt kê, đề xuất xoá hay giữ làm layout option.
3. Xoá logo/wordmark cũ, ảnh demo cũ trong assets/ và common/img/ (giữ icon SVG chung).
4. templates/*.json + config/settings_data.json: đưa về mặc định trung tính (không trỏ ảnh/handle store cũ).
5. Locale: giữ key, đổi text có tên theme cũ.
   Script riêng của theme nền (scripts/demo/clone01*.js, clone02.js, occasion-index.js, docs-demo-pages.js, release.js):
   giữ làm mẫu nhưng đổi tên demo/đường dẫn ở phase 05/07/09 — không chạy khi chưa sửa (chúng ghi đè demos/).
6. .env.example → .env (hỏi tôi store dev), npm install, npm run build, npm run check (theme check), npm run dev.
7. Tạo .claude/memory/MEMORY.md + file store/theme id. Commit "[time] Scaffold {{THEME_NAME}} from <base> vX".
```

## Xong khi
- [ ] `npm run build` + `shopify theme check` không lỗi (warning ghi lại).
- [ ] `npm run dev` mở được http://127.0.0.1:9293, trang chủ render (chưa đẹp cũng được).
- [ ] grep tên theme cũ chỉ còn trong LICENSE/credit hợp lý.
- [ ] Repo đã push lên remote (nhánh `release/v1.0.0` hoặc theo brief).

## Lưu ý
- Code nền giữ nguyên kiến trúc trong CLAUDE.md (pipeline CSS, module JS). Không "dọn" module chung chỉ vì demo này chưa dùng — có thể là tính năng bán hàng.
- Nếu đây là **bản update** của item cũ (như Occasion 2.0): không tạo item mới; ghi vào memory, mọi asset bán hàng phải nhắc upgrade.
