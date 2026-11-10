# Phase 07 — Tài liệu cho người mua

**Mục tiêu**: `documentation/` HTML tĩnh nhiều trang (tiếng Anh), đi kèm gói bán + host tại `https://iphoenixthemes.com/themes/<slug>/documentation/`. Agent: `docs-writer`. Mẫu: `../Occasion/source/documentation/`.

## Cấu trúc
```
documentation/
├── index.html            # Overview: theme là gì, demo, yêu cầu, gói tải về gồm gì, mục lục
├── getting-started.html  # Upload theme zip, chọn demo, import nội dung mẫu (nếu có), publish
├── store-setup.html      # Menus, collections, Search & Discovery filters, metafields (swatch, size chart…), markets, ngôn ngữ
├── customize.html        # Theme settings (màu, font, layout, cart, card…) + từng section: ảnh + bảng setting
├── pages.html            # Template trang con: product, collection, blog, contact, wishlist, compare, FAQ…
├── <demo>.html           # Mỗi demo 1 trang: ảnh, cách dựng lại đúng demo (sinh bởi scripts/docs-demo-pages.js)
├── help.html             # FAQ, lỗi thường gặp, cập nhật theme (giữ settings), support policy, changelog
├── licenses/             # Dawn MIT, font, icon, ảnh (IMAGE-CREDITS)
└── assets/ images/
```

## Prompt
```text
Phase 07 (agent docs-writer). Viết documentation theo cấu trúc trên, giọng hướng dẫn từng bước cho merchant không biết code.
- Mọi section: ảnh chụp từ store demo + bảng setting (lấy tự động từ {% schema %} — viết/tái dùng script sinh bảng).
- Mỗi tính năng bán hàng (wishlist, compare, quick view, bundle, sales popup…) có 1 mục: bật ở đâu, cấu hình gì.
- Ghi rõ cái nào cần app/việc trong admin (discount, Markets, customer accounts).
- Help: cách update lên bản mới mà không mất chỉnh sửa (duplicate theme, Theme Editor → copy settings), support qua
  https://iphoenixthemes.com/themes/<slug>/#support, thời gian phản hồi, phạm vi support (không gồm custom code).
- Changelog đồng bộ với themeforest/content/06-changelog.md.
- Không dùng tài nguyên ngoài ngoài font hệ thống; chạy được khi mở file:// trong gói zip.
Kiểm tra link hỏng (script), ảnh nặng ≤ 300KB, mobile đọc được.
```

## Xong khi
- [ ] Mọi section + theme setting có trong `customize.html`; mọi demo có trang riêng.
- [ ] Không link hỏng; mở offline được; `settings_schema.json` → `theme_documentation_url` trỏ đúng URL.
