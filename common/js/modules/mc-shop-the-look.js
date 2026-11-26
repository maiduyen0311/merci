// Shop the look with hotspots (sections/mc-shop-the-look.liquid, user 2026-11-26 "Nhóm 2 #6").
// DEMO-ONLY feature — not shipped in the ThemeForest package (see .claude/memory/packaging-scope.md).
//
// Dot hover/focus ↔ list item highlight; dot click opens its small product card on the image;
// quick add per product (variant select updates the id + price) and "Add the whole look".

import { addToCart, toast } from './mini-cart.js';
import { formatMoney } from './money.js';

function bind(root) {
  if (root.dataset.bound === '1') return;
  root.dataset.bound = '1';
  const format = root.dataset.moneyFormat;
  const dots = [...root.querySelectorAll('[data-look-dot]')];
  const items = [...root.querySelectorAll('[data-look-item]')];

  const highlight = (n) => {
    dots.forEach((d) => d.classList.toggle('is-active', d.dataset.lookDot === n));
    items.forEach((i) => i.classList.toggle('is-active', i.dataset.lookItem === n));
  };
  const closePops = (except) => {
    root.querySelectorAll('[data-look-pop]').forEach((p) => { if (p !== except) p.hidden = true; });
    dots.forEach((d) => { if (!except || d.dataset.lookDot !== except.dataset.lookPop) d.setAttribute('aria-expanded', 'false'); });
  };

  dots.forEach((dot) => {
    const n = dot.dataset.lookDot;
    dot.addEventListener('mouseenter', () => highlight(n));
    dot.addEventListener('focus', () => highlight(n));
    dot.addEventListener('click', () => {
      const pop = root.querySelector(`[data-look-pop="${n}"]`);
      if (!pop) return;
      const open = pop.hidden;
      closePops(pop);
      pop.hidden = !open;
      dot.setAttribute('aria-expanded', String(open));
      highlight(n);
    });
  });
  items.forEach((item) => item.addEventListener('mouseenter', () => highlight(item.dataset.lookItem)));
  root.addEventListener('mouseleave', () => highlight(null));
  document.addEventListener('click', (e) => { if (!e.target.closest('[data-look-dot], [data-look-pop]')) closePops(null); });
  root.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePops(null); });

  const total = () => {
    const el = root.querySelector('[data-look-total]');
    if (!el) return;
    let sum = 0;
    items.forEach((item) => {
      const sel = item.querySelector('[data-look-variant]');
      const btn = item.querySelector('[data-look-add]');
      if (!btn) return;
      sum += Number(sel ? sel.selectedOptions[0].dataset.price : item.dataset.price || 0) || 0;
    });
    if (sum) el.textContent = formatMoney(sum, format);
  };
  root.addEventListener('change', (e) => {
    const sel = e.target.closest('[data-look-variant]');
    if (!sel) return;
    const item = sel.closest('[data-look-item]');
    const opt = sel.selectedOptions[0];
    const btn = item.querySelector('[data-look-add]');
    if (btn) btn.dataset.lookAdd = sel.value;
    const price = item.querySelector('[data-look-price]');
    if (price) price.textContent = formatMoney(opt.dataset.price, format);
    total();
  });

  const busy = async (btn, lines) => {
    btn.disabled = true;
    btn.classList.add('is-loading');
    try { await addToCart(lines); } catch (err) { toast(err.message); }
    btn.disabled = false;
    btn.classList.remove('is-loading');
  };

  root.addEventListener('click', (e) => {
    const add = e.target.closest('[data-look-add]');
    if (add) { busy(add, [{ id: Number(add.dataset.lookAdd), quantity: 1 }]); return; }
    const all = e.target.closest('[data-look-add-all]');
    if (all) {
      const lines = [...root.querySelectorAll('[data-look-add]')].map((b) => ({ id: Number(b.dataset.lookAdd), quantity: 1 }));
      if (lines.length) busy(all, lines);
    }
  });
}

const McShopTheLook = {
  init() {
    document.querySelectorAll('[data-shop-the-look]').forEach(bind);
  },
};

export default McShopTheLook;
