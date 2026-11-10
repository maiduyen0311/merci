# Theme Factory — bộ prompt + workflow dựng 1 Shopify theme từ 0 đến lúc bán

Bộ kit rút ra từ 2 dự án đã làm: **Top Market v1.1.0** (`../Top-market/top-market`) và **Occasion 2.0** (`../Occasion/source`).
Mục tiêu: lần sau làm theme mới chỉ cần chạy 1 lệnh tạo project, dán 1 prompt vào Claude Code, rồi đi theo từng phase có cổng duyệt.

```
theme-factory/
├── README.md                 ← file này: tổng quan + cách dùng
├── SETUP.md                  ← cài môi trường terminal chạy Claude Code (Windows)
├── MASTER-PROMPT.md          ← prompt tổng, dán vào Claude Code để bắt đầu theme mới
├── phases/                   ← 12 phase, mỗi file = 1 prompt chi tiết + checklist "xong khi"
├── templates/                ← CLAUDE.md, brief, design spec, test checklist, release checklist, test Playwright
├── claude/                   ← agents / commands / settings copy vào <theme>/.claude/
├── addons/                   ← catalog chức năng add-on + mẫu spec để làm phase 11
└── scripts/                  ← setup-windows.ps1, doctor.ps1, new-theme.ps1
```

## 1. Hai lựa chọn đầu vào

| | **Option A — đã có design** | **Option B — chỉ có design trang chủ** |
|---|---|---|
| Có sẵn | PSD/Figma/JPG đủ trang chính: Home, Collection, Product, Cart, (Blog, Account…) + ảnh sản phẩm | Chỉ design trang chủ (Top/Home). Không có trang con, không có ảnh sản phẩm |
| Phase design | `phases/02A-design-from-files.md` — **đo** design, không sáng tác | `phases/02B-design-from-homepage.md` — dựng design system từ trang chủ, **thiết kế** trang con, tìm/tạo ảnh |
| Nguồn sự thật | File design (PSD thắng nếu SPEC lệch) | `design/SPEC.md` do Claude viết + **user duyệt** từng trang |
| Rủi ro chính | Đo sai toạ độ/màu | Trang con lệch phong cách trang chủ, ảnh không có license |

Hai option chỉ khác nhau ở phase 02 (và phần ảnh ở phase 05). Mọi phase khác giống nhau.

## 2. Quy trình (12 phase)

```
00 Intake ─► 01 Scaffold ─► 02A/02B Design ─► 03 Global (header/footer/tokens) ─► 04 Homepage sections
   ─► 05 Inner pages + demo content ─► 06 Test environment & QA ─► 07 Documentation ─► 08 Page intro
   ─► 09 Marketplace package ─► 10 Launch & sales ─► 11 Add-ons / apps (vòng lặp sau khi bán)
```

| Phase | File | Đầu ra chính | Cổng duyệt (user) |
|---|---|---|---|
| 00 | `phases/00-intake.md` | `design/BRIEF.md` (ngách, đối thủ, demo, option A/B) | Duyệt brief |
| 01 | `phases/01-scaffold.md` | Project mới từ theme nền, đổi tên/prefix, `npm run dev` chạy được | — |
| 02A | `phases/02A-design-from-files.md` | `design/SPEC.md` đo từ PSD/JPG, ảnh render từng section | Duyệt SPEC |
| 02B | `phases/02B-design-from-homepage.md` | Design system + mockup HTML các trang con + bộ ảnh | Duyệt từng trang |
| 03 | `phases/03-global-and-tokens.md` | Tokens, header, footer, card sản phẩm, settings_schema | Xem preview |
| 04 | `phases/04-homepage-sections.md` | Toàn bộ section trang chủ (`/convert-section`) | So với design |
| 05 | `phases/05-inner-pages-and-demo-content.md` | Collection, PDP, cart, search, blog, account, 404… + generator demo + import store | Xem demo store |
| 06 | `phases/06-test-environment.md` | Dev store, theme check, Playwright smoke + visual + a11y, Lighthouse, test matrix | Báo cáo QA pass |
| 07 | `phases/07-documentation.md` | `documentation/` HTML nhiều trang cho người mua | Duyệt |
| 08 | `phases/08-page-intro.md` | `page-intro/` landing bán theme | Duyệt |
| 09 | `phases/09-marketplace-package.md` | `npm run release` → zip + `themeforest/` (texts, banners, thumbnail, preview) | Duyệt trước khi upload |
| 10 | `phases/10-launch-and-sales.md` | `themeforest/sale/`: tracking, affiliate, campaign, posts, OG image | — |
| 11 | `phases/11-addons-and-apps.md` | Research → chọn → build add-on (theme-native / metaobject / app) → update 1.x | Duyệt shortlist |

## 3. Cách dùng nhanh

```powershell
# 1. Lần đầu trên máy mới — cài công cụ (xem SETUP.md)
powershell -ExecutionPolicy Bypass -File D:\DuyenNguyen\Shopify\theme-factory\scripts\setup-windows.ps1
powershell -ExecutionPolicy Bypass -File D:\DuyenNguyen\Shopify\theme-factory\scripts\doctor.ps1

# 2. Tạo project theme mới từ theme nền (mặc định: Occasion source)
powershell -ExecutionPolicy Bypass -File D:\DuyenNguyen\Shopify\theme-factory\scripts\new-theme.ps1 `
  -Name "Bloomy" -Prefix "bl" -Option B

# 3. Đặt design vào D:\DuyenNguyen\Shopify\Bloomy\source\design\  (PSD / JPG / Figma link)
# 4. Mở terminal ở project, chạy Claude Code
cd D:\DuyenNguyen\Shopify\Bloomy\source
claude
# 5. Dán MASTER-PROMPT.md (đã điền {{...}}) — hoặc gõ /theme-start
```

Sau đó mỗi phase gọi `/phase 03`, `/phase 04`… Claude đọc file phase tương ứng trong `.claude/playbook/` (do `new-theme.ps1` copy vào), làm, rồi dừng ở cổng duyệt.

## 4. Nguyên tắc chung (áp dụng mọi phase)

1. **Design là nguồn sự thật.** Option A: đo, không đoán hex/size. Option B: mọi thứ Claude tự thiết kế phải được user duyệt trước khi code.
2. **Mọi thứ merchant có thể muốn đổi = setting** (text, màu, ảnh, link, layout option). Demo khác nhau chỉ bằng JSON (template + settings_data), không hard-code theo demo.
3. **Stack cố định**: OS 2.0 dựa trên Dawn, SCSS → 1 `styles.css`, webpack → `common.js`, vanilla JS module idempotent, Bootstrap 5 chỉ grid/utility. Không jQuery/Slick/Bootstrap JS.
4. **Commit theo từng việc** `[YYYY-MM-DD HH:MM] …` rồi push. Memory dự án nằm trong `.claude/memory/` (git-tracked) để đổi máy làm tiếp.
5. **An toàn store**: chỉ `shopify theme dev` / push lên theme unpublished. Push theme live, publish, xoá sản phẩm, import nội dung lên store thật → hỏi user (trừ store demo đã được cho phép trong memory).
6. **License**: không copy code/ảnh từ theme thương mại khác (Shella, Riode, Brator, Merci… trong `../` chỉ để tham khảo tính năng). Ảnh demo phải có nguồn + license ghi trong `design/IMAGE-CREDITS.md`.
7. **URL công khai**: `https://iphoenixthemes.com/themes/<theme-slug>/` (intro), `/documentation/`, `/themeforest/`.

## 5. Agents & commands trong kit

Copy vào `<theme>/.claude/` bởi `new-theme.ps1` (agents gốc của Occasion — `section-builder`, `liquid-reviewer`, `schema-auditor`, `responsive-qa`, `theme-tokens`, `card-component` — được giữ nguyên từ theme nền).

| Loại | Tên | Việc |
|---|---|---|
| agent | `design-director` | Option B: suy design system từ trang chủ, thiết kế trang con dạng HTML mockup |
| agent | `image-curator` | Tìm / tạo / xử lý ảnh sản phẩm + banner, ghi license |
| agent | `qa-tester` | Chạy test matrix phase 06, viết báo cáo lỗi có ảnh |
| agent | `docs-writer` | Viết documentation người mua + changelog |
| agent | `listing-copywriter` | Text ThemeForest / Shopify Theme Store, SEO keywords, reviewer message, posts |
| agent | `addon-researcher` | Phân tích đối thủ + app store, chấm điểm add-on |
| command | `/theme-start` | Đọc brief + playbook, xác định option, lập kế hoạch phase |
| command | `/phase <nn>` | Chạy 1 phase theo file playbook |
| command | `/qa [scope]` | Chạy QA (theme check + Playwright + Lighthouse) và tổng hợp |
| command | `/release-kit` | Build gói bán + kiểm release checklist |
| command | `/addon <idea>` | Spec → build → test → doc 1 add-on |
| command | `/handover` | Cập nhật `.claude/memory/` + CLAUDE.md "Đang làm" trước khi đổi máy |

Ngoài ra command có sẵn từ theme nền: `/spec`, `/build-section`, `/wire-section`, `/review-section`, skill `convert-section`.
