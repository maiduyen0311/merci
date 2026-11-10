# SETUP — môi trường terminal chạy Claude Code để làm Shopify theme (Windows 11)

Cài 1 lần trên mỗi máy. Script tự động: `scripts/setup-windows.ps1` (cài) và `scripts/doctor.ps1` (kiểm tra).
Phần dưới là hướng dẫn tay — dùng khi script lỗi hoặc muốn hiểu từng bước.

> Phiên bản và lệnh cài của các công cụ thay đổi theo thời gian. Nếu 1 lệnh lỗi, xem trang chính thức ghi kèm.

## 0. Yêu cầu

- Windows 10/11, quyền cài phần mềm, `winget` (có sẵn trong Windows 11 — App Installer).
- Tài khoản: **Claude** (Pro/Max hoặc API key Console), **Shopify Partner** (tạo development store), **GitHub**.
- Ổ đĩa làm việc: `D:\DuyenNguyen\Shopify\` (mỗi theme 1 thư mục, code ở `<Theme>\source\`).

## 1. Công cụ nền

```powershell
# Cho phép chạy script PowerShell của user hiện tại
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

winget install --id Git.Git -e                    # Git for Windows (Claude Code cần Git Bash)
winget install --id OpenJS.NodeJS.LTS -e          # Node 20+ (Shopify CLI, sass, webpack)
winget install --id Microsoft.WindowsTerminal -e  # terminal nhiều tab
winget install --id Microsoft.VisualStudioCode -e # editor (tuỳ chọn)
winget install --id GitHub.cli -e                 # gh: PR, release
winget install --id Google.Chrome -e              # cho chrome-devtools MCP / Playwright
```

Mở **terminal mới** (để PATH cập nhật) rồi kiểm tra: `git --version`, `node -v` (≥ 20), `npm -v`, `gh --version`.

```powershell
git config --global user.name  "DuyenNguyen"
git config --global user.email "<email của bạn>"
git config --global core.autocrlf true
gh auth login
```

## 2. Shopify CLI

Shopify CLI bản mới cài qua npm (bản Ruby `gem install shopify-cli` và Theme Kit cũ trong `note gulp.txt` đã ngừng — không dùng nữa).

```powershell
npm install -g @shopify/cli@latest
shopify version
shopify theme --help
```

Đăng nhập store xảy ra lần đầu chạy `shopify theme dev --store <shop>.myshopify.com` (mở trình duyệt). Đổi tài khoản: `shopify auth logout`.

Ghi chú: mỗi project có `.env` (copy từ `.env.example`) với `SHOPIFY_FLAG_STORE`, `SHOPIFY_FLAG_THEME`, `SHOPIFY_DEV_PORT`. Không commit `.env`.

## 3. Claude Code

Trang chính thức: https://docs.claude.com/en/docs/claude-code/setup

```powershell
# Cách 1 — native installer (khuyên dùng, tự cập nhật)
irm https://claude.ai/install.ps1 | iex

# Cách 2 — qua npm
npm install -g @anthropic-ai/claude-code

claude --version
claude doctor          # kiểm tra cài đặt
```

Lần đầu chạy `claude` trong 1 thư mục → đăng nhập (tài khoản Claude hoặc API key). Nếu Claude Code báo không tìm thấy Git Bash:

```powershell
setx CLAUDE_CODE_GIT_BASH_PATH "C:\Program Files\Git\bin\bash.exe"
```

### Dùng hằng ngày

```powershell
cd D:\DuyenNguyen\Shopify\<Theme>\source
claude                 # phiên mới
claude --continue      # tiếp phiên gần nhất trong thư mục này
claude --resume        # chọn phiên cũ
```

Trong phiên: `/help`, `/model` (chọn model), `/memory`, `/agents`, `/mcp`, `/permissions`, `/clear`, `Shift+Tab` (đổi permission mode: default / accept edits / plan). Gõ `!lệnh` để tự chạy 1 lệnh shell (ví dụ `! shopify theme push --live` — lệnh Claude bị chặn tự chạy).

**VS Code**: cài extension "Claude Code" (Anthropic) — cùng phiên, cùng `.claude/`, xem diff trong editor.

**Windows Terminal** (tuỳ chọn): tạo profile "Theme – Claude" với `commandline: powershell -NoExit -Command "cd D:\DuyenNguyen\Shopify; claude"`.

## 4. MCP servers (công cụ cho Claude)

Thêm theo user (`-s user`) để dùng ở mọi theme:

```powershell
# Chụp màn hình / đo DOM / console trên storefront (dùng cho QA, so design)
claude mcp add chrome-devtools -s user -- npx -y chrome-devtools-mcp@latest

# Tài liệu + validate Liquid / GraphQL Admin của Shopify
claude mcp add shopify-dev -s user -- npx -y @shopify/dev-mcp@latest

# (tuỳ chọn) điều khiển trình duyệt bằng Playwright
claude mcp add playwright -s user -- npx -y @playwright/mcp@latest

claude mcp list
```

- **Figma** (nếu design ở Figma): bật connector Figma trong claude.ai → Settings → Connectors, hoặc `/mcp` trong phiên để xác thực.
- **Claude in Chrome** (extension): dùng khi cần thao tác admin Shopify / ThemeForest bằng trình duyệt thật đã đăng nhập.

## 5. Skills

Theme nền (Occasion) đã có trong `.agents/skills/`: `frontend-design` (anthropics/skills), `shopify-liquid`, `shopify-admin` (Shopify/shopify-ai-toolkit). Cài cho project mới:

```powershell
npx skills add anthropics/skills --skill frontend-design
npx skills add Shopify/shopify-ai-toolkit --skill shopify-liquid --skill shopify-admin
```

(Nếu lệnh `skills` khác phiên bản, copy thư mục `.agents/skills/` từ `../Occasion/source/`.)

## 6. Quyền & an toàn (`.claude/settings.json`)

`new-theme.ps1` copy `claude/settings.json` của kit vào project. Nội dung chính:

- **allow**: `npm run *`, `shopify theme dev/check/list/package`, `node scripts/*`, `git add/commit/status/diff/log`.
- **ask**: `git push`, `shopify theme push` (theme unpublished), `node scripts/demo-import.js`.
- **deny**: `shopify theme push --live`, `shopify theme publish`, `shopify theme delete`, `git push --force`, đọc `.env`.

Muốn cho phép thêm cho 1 store demo (như occasion-demo-2): ghi vào `.claude/memory/` + `settings.local.json`, đừng sửa file chung.

## 7. Thư viện dự án (cài trong mỗi theme)

```powershell
cd D:\DuyenNguyen\Shopify\<Theme>\source
npm install                                  # sass, webpack, bootstrap, dotenv-cli, npm-run-all, copyfiles
# phase 06 — môi trường test (hỏi user trước khi thêm, theo CLAUDE.md):
npm install -D @playwright/test @axe-core/playwright lighthouse chrome-launcher
npx playwright install chromium
# đọc PSD (Option A, máy không có Python):
npm install -D ag-psd pngjs
```

## 8. Kiểm tra cuối

```powershell
powershell -ExecutionPolicy Bypass -File D:\DuyenNguyen\Shopify\theme-factory\scripts\doctor.ps1
```

Pass khi: git, node ≥ 20, npm, shopify, claude, gh có mặt; `claude mcp list` có `chrome-devtools` + `shopify-dev`; Chrome có mặt.

## 9. Lỗi hay gặp

| Lỗi | Cách sửa |
|---|---|
| `running scripts is disabled` | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` hoặc chạy với `-ExecutionPolicy Bypass` |
| `shopify` không nhận | mở terminal mới; kiểm tra `npm config get prefix` có trong PATH |
| Port 9293 bận | `npm run dev:stop` |
| `theme dev` hỏi store mỗi lần | điền `SHOPIFY_FLAG_STORE` trong `.env` |
| Claude không thấy MCP | `claude mcp list`; khởi động lại phiên; `npx` cần mạng lần đầu |
| Push bị chặn ở auto mode | đúng thiết kế — tự chạy bằng `! <lệnh>` trong phiên |
