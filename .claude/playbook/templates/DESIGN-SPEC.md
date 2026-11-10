# SPEC — {{THEME_NAME}}

> Nguồn sự thật cho code. Mỗi giá trị ghi nguồn: `[psd:<layer>]`, `[px:<file>@x,y]`, hoặc `[đề xuất]` (Option B — cần user duyệt).

## §1 Tokens
### 1.1 Màu
| Token | Hex | Dùng cho | Nguồn |
|---|---|---|---|
| `--color-primary` | | | |
| `--color-accent` | | | |
| `--color-text` / `--color-muted` / `--color-border` / `--color-bg` / `--color-sale` / `--color-success` / `--color-error` | | | |

### 1.2 Typography
| Vai trò | Font | Weight | Size desktop / mobile | Line-height | Letter-spacing | Nguồn |
|---|---|---|---|---|---|---|

### 1.3 Layout
- Canvas design: … px · Container: … px · Gutter: … · Breakpoints: 1440 / 1200 / 992 / 768 / 576 / 390
- Spacing scale · Radius · Shadow · Border

## §2 Section & trang
### 2.x `<section-id>` — trạng thái NEW / EDIT / OK-existing
- Ảnh: `design/<demo>/sections/NN-<id>.png` (+ mobile)
- Layout desktop / mobile:
- Settings: | id | type | default | ghi chú |
- Blocks: | type | settings | giới hạn |
- Hành vi (carousel, tab, countdown…):
- Layout option cho demo khác:

## §3 Component
### 3.1 Card sản phẩm (mọi trạng thái)
### 3.2 Card blog
### 3.3 Button / input / select / badge / price / breadcrumb / pagination / tab / accordion / popup

## §4 Asset
- Icon (SVG, stroke) · Logo · Ảnh: art direction, ratio, số lượng — chi tiết license ở `IMAGE-CREDITS.md`

## §5 Câu hỏi mở / gaps

## Appendix A — Thứ tự section trang chủ (mỗi demo)
## Appendix B — Pattern CSS vars
```liquid
{% style %}
  #SectionName-{{ section.id }} { --sec-bg: {{ section.settings.bg }}; --sec-pt: {{ section.settings.padding_top }}px; }
{% endstyle %}
```
