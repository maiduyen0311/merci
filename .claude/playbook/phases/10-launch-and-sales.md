# Phase 10 — Ra mắt & bán hàng

**Mục tiêu**: có kế hoạch + tài sản để đẩy sale tuần đầu và các đợt khuyến mãi. Mọi thứ ở `themeforest/sale/` (không nằm trong build). Mẫu: `../Occasion/source/themeforest/sale/`.

## Tài sản
| File | Nội dung |
|---|---|
| `README.md` | Checklist ra mắt theo ngày (D-7 → D+30) |
| `01-landing-page.md` | Cấu hình page intro: ITEM_URL, affiliate, sale strip |
| `02-tracking.md` | GA4 + Meta Pixel trên page intro; UTM cho mọi link (email, social, ads) |
| `03-affiliate.md` | Link Envato affiliate, cách gắn |
| `04-campaign-plan.md` | Kênh: Facebook groups Shopify, Reddit r/shopify (đúng luật group), X, Pinterest, YouTube demo, blog iphoenixthemes.com, email khách cũ |
| `05-<season>.md` | Black Friday / Cyber Monday / Tết: mức giảm, thời gian, banner |
| `06-posts.md` | Bài đăng soạn sẵn theo kênh (EN), mỗi bài 1 tính năng/1 demo |
| `07-week1.md` | Theo dõi tuần đầu: views → sales, comment/support, rating |
| `og-image.html` + `render.js` | OG image 1200×630 cho page intro + share |
| `videos/` | Video demo 30–60s (screen record store demo + tiêu đề) |

## Prompt
```text
Phase 10 (agent listing-copywriter). Tạo themeforest/sale/ theo bảng trên cho {{THEME_NAME}}:
kế hoạch D-7 → D+30, post soạn sẵn cho từng kênh, tracking + UTM, OG image. Kế hoạch video demo (kịch bản theo cảnh,
thời lượng, cảnh quay từ store demo). Không tự đăng bài / gửi email — chỉ soạn để tôi đăng.
Sau tuần 1: tôi dán số liệu, bạn phân tích và đề xuất chỉnh listing/giá/kênh.
```

## Xong khi
- [ ] Tracking chạy (GA4 realtime thấy visit page intro); mọi link có UTM.
- [ ] Bài đăng tuần 1 + banner khuyến mãi sẵn sàng.
