# Phase 09 — Gói bán & listing marketplace

**Mục tiêu**: `npm run release` ra đúng gói upload; bộ text + ảnh listing sẵn sàng. Agent: `listing-copywriter`. Mẫu: `../Occasion/source/themeforest/` + `scripts/release.js`.

## 1. Gói tải về (`dist/`)
```
dist/
├── <slug>-v1.0.0.zip                 # gói người mua tải
│   ├── theme/<slug>-<demo>.zip       # 1 zip theme / demo (settings_data + templates của demo đó), build prod, không source
│   ├── documentation/                # phase 07
│   └── licenses/ + README.txt
└── themeforest-upload/
    ├── thumbnail.png                 # 80×80
    ├── inline-preview.jpg            # 590×300 (ảnh lớn đầu listing)
    ├── preview-images/ (screenshots) # theo yêu cầu category
    └── main-file.zip
```
Kiểm tra: zip theme upload thử lên store test không lỗi; không có `.env`, `node_modules`, `design/`, PSD, ảnh không license (thay placeholder nếu license không cho phân phối).

## 2. Nội dung listing (`themeforest/content/`)
| File | Nội dung |
|---|---|
| `01-item-details.md` | Tên item (≤ 100 ký tự, có keyword ngách), category, tags (≤ 15), compatible browsers, Shopify OS 2.0, files included, demo URL |
| `02-item-description.html` | Mô tả HTML: banner ảnh (host `/themes/<slug>/themeforest/`), demo list, feature list, "skip apps", support, changelog, credits |
| `03-description-images.md` | Danh sách banner cần + kích thước (rộng 1000–1200px) |
| `04-seo-keywords.md` | Keyword chính/phụ từ đối thủ + Google |
| `05-message-to-reviewer.md` | Demo store + password, ghi chú kỹ thuật, nguồn ảnh/font |
| `06-changelog.md` | Theo semver, đồng bộ documentation |
| `07-presale-faq.md` | Trả lời sẵn câu hỏi mua trước |

`themeforest/preview/`: `thumbnail.html`, `inline-preview.html`, `banners.html` + `build.js` (render HTML → ảnh bằng headless Chrome).

## 3. Shopify Theme Store (nếu nộp)
Yêu cầu khắt khe hơn (performance, a11y, không phụ thuộc framework nặng, đủ template, theme check sạch, demo store, tài liệu, support): đọc lại yêu cầu mới nhất tại shopify.dev/docs/storefronts/themes/store trước khi quyết định. Ghi khoảng cách vào `qa/THEME-STORE-GAP.md`.

## Prompt
```text
Phase 09. 1) Cập nhật scripts/release.js cho theme này (demo list, tên file, loại trừ). npm run release; mở zip kiểm tra
cấu trúc; upload thử 1 zip theme lên store test (theme unpublished).
2) Agent listing-copywriter viết themeforest/content/01–07 (tiếng Anh, giọng bán hàng nhưng đúng sự thật: mọi
tính năng ghi trong listing phải có trong theme). 3) Dựng preview HTML + build.js, render ảnh.
4) Chạy templates/release-checklist.md, báo cáo chỗ chưa đạt. Không upload lên ThemeForest — đó là việc của tôi.
```

## Xong khi
- [ ] `release-checklist.md` pass hết; zip upload thử OK.
- [ ] Text listing + ảnh sẵn trong `dist/themeforest-upload/`; banner đã sẵn để host ở `/themes/<slug>/themeforest/`.
