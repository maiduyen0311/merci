# Release checklist — {{THEME_NAME}} v{{VERSION}}

## Code
- [ ] `npm run qa` pass (theme check 0 error, Playwright, axe, Lighthouse ngưỡng)
- [ ] `config/settings_schema.json` → `theme_info`: name, version = {{VERSION}}, author, documentation URL, support URL
- [ ] `package.json` version = {{VERSION}}; changelog có mục {{VERSION}}
- [ ] Không còn `console.log` debug, TODO, tên theme cũ, store/handle của demo store trong default settings
- [ ] Locale: mọi key có ở mọi ngôn ngữ (`node scripts/locale-merge.js` / check)

## Gói (`dist/`)
- [ ] Mỗi demo 1 zip theme, upload thử lên store test thành công, trang chủ giống demo sau khi set nội dung
- [ ] Không có `.env`, `node_modules`, `design/`, PSD, `.shopify/`, `qa/`, `tests/`, source SCSS/JS (trừ khi chủ ý bán kèm source)
- [ ] Ảnh trong zip: chỉ ảnh được phép phân phối; còn lại placeholder; `licenses/` có Dawn MIT + font + icon + IMAGE-CREDITS
- [ ] Documentation mở offline được, không link hỏng

## Listing
- [ ] Tên, tags, description, feature list đúng sự thật (mỗi tính năng có trong theme)
- [ ] Thumbnail 80×80, inline preview 590×300, screenshots, banner mô tả đã host ở `/themes/<slug>/themeforest/`
- [ ] Demo store: chạy, không password (hoặc password ghi trong reviewer message), giá USD, không sản phẩm rác
- [ ] Message to reviewer: demo URL, nguồn ảnh/font, ghi chú kỹ thuật
- [ ] Page intro: số liệu khớp, nút mua trỏ item (sau khi item được duyệt)
- [ ] Bản update: mọi asset nhắc "What's new", người mua cũ được update miễn phí

## Sau khi upload (việc của user)
- [ ] Tag git `v{{VERSION}}` + push tag
- [ ] Ghi `.claude/memory/` (ngày nộp, trạng thái review)
